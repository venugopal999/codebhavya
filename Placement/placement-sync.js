(function () {
    "use strict";

    const cloud = window.CodeBhavyaSupabase || {};
    const client = cloud.client || null;
    const META_KEY = "codebhavya-placement-sync-meta-v1";
    const MISTAKES_KEY = "codebhavya-placement-mistakes-v1";
    const SYNC_DELAY = 700;

    const stateFields = [
        {
            key: "codebhavya-placement-plan-v1",
            column: "plan",
            fallback: { target: "general", days: 30, minutes: 60 },
            meaningful: function (value) {
                return value && typeof value === "object"
                    && (value.target !== "general" || Number(value.days) !== 30 || Number(value.minutes) !== 60);
            }
        },
        {
            key: "codebhavya-placement-readiness-v1",
            column: "readiness",
            fallback: [],
            meaningful: function (value) {
                return Array.isArray(value) && value.some(Boolean);
            }
        },
        {
            key: "codebhavya-placement-sprint-v1",
            column: "sprint",
            fallback: {},
            meaningful: function (value) {
                return value && Array.isArray(value.completed) && value.completed.some(Boolean);
            }
        },
        {
            key: "codebhavya-placement-proof-v1",
            column: "proof",
            fallback: {},
            meaningful: function (value) {
                return value && typeof value === "object" && Object.values(value).some(Boolean);
            }
        }
    ];

    let currentUser = null;
    let initialSyncFinished = false;
    let activeSync = null;
    const timers = new Map();

    function setStatus(message, tone) {
        if (window.CodeBhavyaAuth && typeof window.CodeBhavyaAuth.setCloudStatus === "function") {
            window.CodeBhavyaAuth.setCloudStatus(message, tone);
        }
    }

    function setSyncButtonBusy(busy) {
        const button = document.getElementById("placementSyncNow");
        if (!button) {
            return;
        }
        button.disabled = Boolean(busy);
        button.textContent = busy ? "Syncing…" : "Sync now";
    }

    function readJson(key, fallback) {
        try {
            const stored = window.localStorage.getItem(key);
            return stored ? JSON.parse(stored) : fallback;
        } catch (error) {
            return fallback;
        }
    }

    function writeJson(key, value) {
        try {
            window.localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            return false;
        }
        return true;
    }

    function normalizeForComparison(value) {
        if (Array.isArray(value)) {
            return value.map(normalizeForComparison);
        }
        if (value && typeof value === "object") {
            return Object.keys(value).sort().reduce(function (result, key) {
                result[key] = normalizeForComparison(value[key]);
                return result;
            }, {});
        }
        return value;
    }

    function equalValues(first, second) {
        return JSON.stringify(normalizeForComparison(first))
            === JSON.stringify(normalizeForComparison(second));
    }

    function readMeta() {
        const value = readJson(META_KEY, {});
        return value && typeof value === "object" ? value : {};
    }

    function writeMeta(meta) {
        writeJson(META_KEY, meta);
    }

    function markPending(key) {
        const meta = readMeta();
        meta.userId = currentUser ? currentUser.id : (meta.userId || null);
        meta.fields = meta.fields && typeof meta.fields === "object" ? meta.fields : {};
        meta.fields[key] = new Date().toISOString();
        writeMeta(meta);
    }

    function clearPending(key) {
        const meta = readMeta();
        meta.fields = meta.fields && typeof meta.fields === "object" ? meta.fields : {};
        delete meta.fields[key];
        meta.lastSyncedAt = new Date().toISOString();
        if (currentUser) {
            meta.userId = currentUser.id;
        }
        writeMeta(meta);
    }

    function remoteIsNewerOrEqual(meta, key, remoteUpdatedAt) {
        if (!meta.fields || !meta.fields[key]) {
            return true;
        }
        const localTime = Date.parse(meta.fields[key]);
        const remoteTime = Date.parse(remoteUpdatedAt || "");
        if (Number.isNaN(localTime) || Number.isNaN(remoteTime)) {
            return false;
        }
        return remoteTime >= localTime;
    }

    function cleanMistake(entry) {
        if (!entry || !entry.topic || !entry.rule) {
            return null;
        }
        return {
            id: String(entry.id || Date.now()),
            topic: String(entry.topic).trim().slice(0, 180),
            category: String(entry.category || "Programming").trim(),
            reason: String(entry.reason || "Concept gap").trim(),
            rule: String(entry.rule).trim().slice(0, 140)
        };
    }

    function mistakeToDatabase(entry, userId) {
        const clean = cleanMistake(entry);
        return clean ? {
            user_id: userId,
            client_id: clean.id,
            topic: clean.topic,
            category: clean.category,
            reason: clean.reason,
            correction_rule: clean.rule
        } : null;
    }

    function mistakeToLocal(row) {
        return cleanMistake({
            id: row.client_id,
            topic: row.topic,
            category: row.category,
            reason: row.reason,
            rule: row.correction_rule
        });
    }

    async function upsertMistakes(entries, userId) {
        const rows = entries.map(function (entry) {
            return mistakeToDatabase(entry, userId);
        }).filter(Boolean);

        if (!rows.length) {
            return;
        }

        const result = await client
            .from("mistakes")
            .upsert(rows, { onConflict: "user_id,client_id" });

        if (result.error) {
            throw result.error;
        }
    }

    async function replaceRemoteMistakes(entries, userId) {
        const cleaned = entries.map(cleanMistake).filter(Boolean).slice(0, 12);
        await upsertMistakes(cleaned, userId);

        const existingResult = await client
            .from("mistakes")
            .select("client_id")
            .eq("user_id", userId);

        if (existingResult.error) {
            throw existingResult.error;
        }

        const localIds = new Set(cleaned.map(function (entry) {
            return entry.id;
        }));
        const removedIds = (existingResult.data || []).map(function (row) {
            return row.client_id;
        }).filter(function (id) {
            return !localIds.has(id);
        });

        if (removedIds.length) {
            const deleteResult = await client
                .from("mistakes")
                .delete()
                .eq("user_id", userId)
                .in("client_id", removedIds);

            if (deleteResult.error) {
                throw deleteResult.error;
            }
        }
    }

    async function mergeMistakes(userId, differentOwner) {
        const result = await client
            .from("mistakes")
            .select("client_id,topic,category,reason,correction_rule,created_at")
            .eq("user_id", userId)
            .order("created_at", { ascending: false });

        if (result.error) {
            throw result.error;
        }

        const remoteEntries = (result.data || []).map(mistakeToLocal).filter(Boolean);
        const storedLocalEntries = readJson(MISTAKES_KEY, []);
        const localEntries = differentOwner || !Array.isArray(storedLocalEntries)
            ? []
            : storedLocalEntries.map(cleanMistake).filter(Boolean);
        const mergedMap = new Map();

        remoteEntries.forEach(function (entry) {
            mergedMap.set(entry.id, entry);
        });
        localEntries.forEach(function (entry) {
            mergedMap.set(entry.id, entry);
        });

        const merged = Array.from(mergedMap.values()).slice(0, 12);
        const localBeforeMerge = readJson(MISTAKES_KEY, []);
        const changedLocally = !equalValues(localBeforeMerge, merged);

        if (changedLocally) {
            writeJson(MISTAKES_KEY, merged);
        }

        if (!differentOwner && localEntries.length) {
            await upsertMistakes(merged, userId);
        }

        return changedLocally;
    }

    async function fetchPlacementState(userId) {
        const result = await client
            .from("placement_state")
            .select("plan,readiness,sprint,proof,updated_at")
            .eq("user_id", userId)
            .maybeSingle();

        if (result.error) {
            throw result.error;
        }

        if (result.data) {
            return result.data;
        }

        const createResult = await client
            .from("placement_state")
            .upsert({ user_id: userId }, { onConflict: "user_id" })
            .select("plan,readiness,sprint,proof,updated_at")
            .single();

        if (createResult.error) {
            throw createResult.error;
        }
        return createResult.data;
    }

    async function performFullSync(user, manual) {
        setSyncButtonBusy(true);
        setStatus(manual ? "Synchronizing your progress…" : "Loading your latest progress…", "neutral");

        const remote = await fetchPlacementState(user.id);
        const meta = readMeta();
        const differentOwner = Boolean(meta.userId && meta.userId !== user.id);
        const upload = { user_id: user.id };
        let hasUpload = false;
        let needsReload = false;

        stateFields.forEach(function (field) {
            const localValue = readJson(field.key, field.fallback);
            const remoteValue = remote[field.column] === null || remote[field.column] === undefined
                ? field.fallback
                : remote[field.column];

            if (differentOwner) {
                if (!equalValues(localValue, remoteValue)) {
                    writeJson(field.key, remoteValue);
                    needsReload = true;
                }
                return;
            }

            const localMeaningful = field.meaningful(localValue);
            const remoteMeaningful = field.meaningful(remoteValue);

            if (localMeaningful && !remoteMeaningful) {
                upload[field.column] = localValue;
                hasUpload = true;
            } else if (remoteMeaningful && !localMeaningful) {
                writeJson(field.key, remoteValue);
                needsReload = true;
            } else if (localMeaningful && remoteMeaningful && !equalValues(localValue, remoteValue)) {
                if (remoteIsNewerOrEqual(meta, field.key, remote.updated_at)) {
                    writeJson(field.key, remoteValue);
                    needsReload = true;
                } else {
                    upload[field.column] = localValue;
                    hasUpload = true;
                }
            }
        });

        if (hasUpload) {
            const uploadResult = await client
                .from("placement_state")
                .upsert(upload, { onConflict: "user_id" });

            if (uploadResult.error) {
                throw uploadResult.error;
            }
        }

        const mistakesChanged = await mergeMistakes(user.id, differentOwner);
        needsReload = needsReload || mistakesChanged;

        writeMeta({
            userId: user.id,
            fields: {},
            lastSyncedAt: new Date().toISOString()
        });

        initialSyncFinished = true;
        setStatus("Progress synchronized successfully.", "success");
        setSyncButtonBusy(false);

        if (needsReload) {
            window.setTimeout(function () {
                window.location.reload();
            }, 350);
        }

        return true;
    }

    function runFullSync(user, manual) {
        if (!client || !user) {
            return Promise.resolve();
        }
        if (activeSync) {
            return activeSync;
        }

        activeSync = performFullSync(user, manual).catch(function () {
            setSyncButtonBusy(false);
            setStatus("Cloud sync could not finish. Your progress is still safe on this device.", "error");
            return false;
        }).finally(function () {
            activeSync = null;
        });

        return activeSync;
    }

    async function saveStateField(field) {
        if (!currentUser) {
            return;
        }

        const value = readJson(field.key, field.fallback);
        const payload = { user_id: currentUser.id };
        payload[field.column] = value;

        const result = await client
            .from("placement_state")
            .upsert(payload, { onConflict: "user_id" });

        if (result.error) {
            throw result.error;
        }
        clearPending(field.key);
    }

    async function savePendingKey(key) {
        if (!currentUser) {
            return;
        }

        try {
            if (key === MISTAKES_KEY) {
                const storedEntries = readJson(MISTAKES_KEY, []);
                const entries = Array.isArray(storedEntries) ? storedEntries : [];
                await replaceRemoteMistakes(entries, currentUser.id);
                clearPending(MISTAKES_KEY);
            } else {
                const field = stateFields.find(function (candidate) {
                    return candidate.key === key;
                });
                if (field) {
                    await saveStateField(field);
                }
            }
            setStatus("Progress synchronized successfully.", "success");
            return true;
        } catch (error) {
            setStatus("Saved on this device. Use ‘Sync now’ when your connection is available.", "error");
            return false;
        }
    }

    function scheduleSave(key) {
        if (!currentUser || !initialSyncFinished) {
            return;
        }

        if (timers.has(key)) {
            window.clearTimeout(timers.get(key));
        }

        timers.set(key, window.setTimeout(function () {
            timers.delete(key);
            savePendingKey(key);
        }, SYNC_DELAY));
    }

    async function flush() {
        if (activeSync) {
            const activeResult = await activeSync;
            if (activeResult === false) {
                throw new Error("Cloud synchronization did not complete.");
            }
        }
        if (!currentUser) {
            return;
        }

        timers.forEach(function (timer) {
            window.clearTimeout(timer);
        });
        timers.clear();

        const meta = readMeta();
        const pendingKeys = Object.keys(meta.fields || {});
        for (const key of pendingKeys) {
            const saved = await savePendingKey(key);
            if (!saved) {
                throw new Error("Cloud synchronization did not complete.");
            }
        }
    }

    function resetLocalProgress() {
        stateFields.forEach(function (field) {
            writeJson(field.key, field.fallback);
        });
        writeJson(MISTAKES_KEY, []);
        try {
            window.localStorage.removeItem(META_KEY);
        } catch (error) {
            return;
        }
    }

    function handleAuthentication(detail) {
        const user = detail && detail.user ? detail.user : null;

        if (!user) {
            const hadUser = Boolean(currentUser);
            currentUser = null;
            initialSyncFinished = false;
            timers.forEach(function (timer) {
                window.clearTimeout(timer);
            });
            timers.clear();

            if (hadUser && detail && detail.explicitSignOut) {
                resetLocalProgress();
                setStatus("Signed out. Cloud progress remains in your account.", "success");
                window.setTimeout(function () {
                    window.location.reload();
                }, 350);
            }
            return;
        }

        currentUser = user;
        initialSyncFinished = false;
        runFullSync(user, false);
    }

    async function recordReadinessAttempt(detail) {
        if (!currentUser || !detail) {
            setStatus("Assessment saved on this device. Sign in to add it to your history.", "neutral");
            return;
        }

        const result = await client.from("readiness_attempts").insert({
            user_id: currentUser.id,
            score: Number(detail.score) || 0,
            answers: Array.isArray(detail.answers) ? detail.answers : [],
            pillar_scores: detail.pillarScores || {},
            weakest_pillar: Array.isArray(detail.weakestPillars)
                ? detail.weakestPillars.join(", ")
                : null
        });

        if (result.error) {
            setStatus("Readiness result is saved locally, but its history could not be updated.", "error");
            return;
        }
        setStatus("Readiness result added to your progress history.", "success");
    }

    function initialize() {
        if (!client) {
            return;
        }

        window.addEventListener("codebhavya:auth-changed", function (event) {
            handleAuthentication(event.detail || {});
        });

        window.addEventListener("codebhavya:local-progress-changed", function (event) {
            const key = event.detail && event.detail.key;
            const supported = key === MISTAKES_KEY || stateFields.some(function (field) {
                return field.key === key;
            });

            if (!supported) {
                return;
            }
            markPending(key);
            scheduleSave(key);
        });

        window.addEventListener("codebhavya:readiness-submitted", function (event) {
            recordReadinessAttempt(event.detail || {});
        });

        document.getElementById("placementSyncNow").addEventListener("click", function () {
            if (currentUser) {
                runFullSync(currentUser, true);
            }
        });

        window.addEventListener("online", function () {
            if (currentUser) {
                runFullSync(currentUser, false);
            }
        });

        const existingUser = window.CodeBhavyaAuth && window.CodeBhavyaAuth.getUser
            ? window.CodeBhavyaAuth.getUser()
            : null;
        if (existingUser) {
            handleAuthentication({ user: existingUser, event: "EXISTING_SESSION" });
        }
    }

    window.CodeBhavyaPlacementSync = Object.freeze({
        flush: flush,
        syncNow: function () {
            return currentUser ? runFullSync(currentUser, true) : Promise.resolve();
        }
    });

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initialize);
    } else {
        initialize();
    }
}());
