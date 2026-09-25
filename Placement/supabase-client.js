(function () {
    "use strict";

    const config = window.CODEBHAVYA_SUPABASE_CONFIG || {};
    const url = String(config.url || "").trim();
    const publishableKey = String(config.publishableKey || "").trim();
    const configured = /^https:\/\/[a-z0-9-]+\.supabase\.co\/?$/i.test(url)
        && publishableKey.length > 20
        && !publishableKey.includes("PASTE_YOUR");

    let client = null;
    let error = "";
    const idleLimitMs = 5 * 60 * 1000;
    const activityKey = "codebhavya:placement:last-activity";
    const tabMarker = "codebhavya:placement:tab-open";
    const sessionKey = "codebhavya-placement-tab-auth-v1";
    let lastActivity = 0;
    let signedIn = false;
    let signingOutForIdle = false;

    function coverExpiredSession() {
        const screen = document.createElement("div");
        screen.setAttribute("role", "alert");
        screen.setAttribute("aria-live", "assertive");
        screen.style.cssText = "position:fixed;inset:0;z-index:2147483647;display:grid;place-content:center;gap:.75rem;padding:2rem;background:#f4f7fb;color:#102a4c;text-align:center;font:600 1rem/1.5 system-ui,sans-serif";
        const title = document.createElement("strong");
        title.textContent = "Session expired";
        title.style.fontSize = "1.5rem";
        const message = document.createElement("span");
        message.textContent = "For your privacy, sign in again to continue.";
        screen.append(title, message);
        // This is outside the inert body so the message remains accessible.
        document.documentElement.append(screen);
        if (document.body) document.body.inert = true;
        else document.addEventListener("DOMContentLoaded", function () { document.body.inert = true; }, { once: true });
    }

    function readActivity() {
        try { return Number(window.sessionStorage.getItem(activityKey)) || lastActivity; }
        catch (_) { return lastActivity; }
    }

    function writeActivity(time) {
        lastActivity = time;
        try { window.sessionStorage.setItem(activityKey, String(time)); }
        catch (_) { /* Timer remains active in this tab. */ }
    }

    function clearActivity() {
        lastActivity = 0;
        try { window.sessionStorage.removeItem(activityKey); }
        catch (_) { /* Storage may be blocked. */ }
    }

    function clearPlacementData() {
        // Only Placement-owned keys: never clear another app's Supabase token.
        const prefixes = ["codebhavya-placement-", "codebhavya-interview-", "codebhavya-mcq-revision-", "codebhavya-mock-", "codebhavya-full-", "codebhavya-solve-timer-"];
        try {
            for (let index = window.localStorage.length - 1; index >= 0; index--) {
                const key = window.localStorage.key(index);
                if (key && (prefixes.some(function (prefix) { return key.startsWith(prefix); })
                    || /^codebhavya-[a-z0-9_-]+-draft:/.test(key))) {
                    window.localStorage.removeItem(key);
                }
            }
        } catch (_) { /* Storage may be blocked. */ }
    }

    try {
        const last = Number(window.sessionStorage.getItem(activityKey));
        if (!window.sessionStorage.getItem(tabMarker) || (last && Date.now() - last >= idleLimitMs)) {
            window.sessionStorage.removeItem(sessionKey);
            window.sessionStorage.removeItem(activityKey);
            clearPlacementData();
        }
        window.sessionStorage.setItem(tabMarker, "1");
    } catch (_) { /* Storage may be blocked. */ }

    function checkIdle() {
        if (!client || !signedIn || signingOutForIdle) return false;
        const last = readActivity();
        if (!last) {
            // Earlier versions did not record activity; start their timer now.
            writeActivity(Date.now());
            return false;
        }
        if (Date.now() - last < idleLimitMs) return false;
        signingOutForIdle = true;
        coverExpiredSession();
        clearActivity();
        clearPlacementData();
        try { window.sessionStorage.removeItem(sessionKey); }
        catch (_) { /* The visible session is already covered. */ }
        // Calling auth methods directly in an auth callback can deadlock.
        window.setTimeout(async function () {
            try {
                // Do not leave a shared computer showing private data if this stalls offline.
                await Promise.race([
                    client.auth.signOut({ scope: "local" }),
                    new Promise(function (resolve) { window.setTimeout(resolve, 2000); })
                ]);
            } catch (_) {
                // The local credential was already cleared; a server response is optional.
            } finally {
                try { window.sessionStorage.removeItem(sessionKey); }
                catch (_) { /* The page stays covered until it can reload. */ }
                clearActivity();
                clearPlacementData();
                window.location.reload();
            }
        }, 0);
        return true;
    }

    if (!configured) {
        error = "Add your Supabase Project URL and publishable key in supabase-config.js.";
    } else if (!window.supabase || typeof window.supabase.createClient !== "function") {
        error = "The secure cloud library could not be loaded. Local progress is still available.";
    } else {
        try {
            client = window.supabase.createClient(url.replace(/\/$/, ""), publishableKey, {
                auth: {
                    autoRefreshToken: true,
                    persistSession: true,
                    detectSessionInUrl: true,
                    storage: window.sessionStorage,
                    storageKey: sessionKey
                }
            });
            client.auth.onAuthStateChange(function (event, session) {
                const wasSignedIn = signedIn;
                signedIn = Boolean(session && session.user);
                if (event === "SIGNED_OUT") {
                    clearActivity();
                    clearPlacementData();
                } else if (signedIn && event === "SIGNED_IN" && !wasSignedIn && !readActivity()) {
                    writeActivity(Date.now());
                } else if (signedIn) {
                    checkIdle();
                }
            });
            ["pointerdown", "keydown", "touchstart"].forEach(function (eventName) {
                document.addEventListener(eventName, function () {
                    if (!signedIn || checkIdle()) return;
                    if (Date.now() - readActivity() > 60 * 1000) writeActivity(Date.now());
                }, { passive: true });
            });
            document.addEventListener("visibilitychange", function () {
                if (!document.hidden) checkIdle();
            });
            window.addEventListener("focus", checkIdle);
            window.addEventListener("online", checkIdle);
            window.setInterval(checkIdle, 60 * 1000);
        } catch (clientError) {
            error = "Cloud progress could not be started. Local progress is still available.";
        }
    }

    window.CodeBhavyaSupabase = Object.freeze({
        configured: Boolean(client),
        client: client,
        error: error
    });

    document.dispatchEvent(new CustomEvent("codebhavya:supabase-ready", {
        detail: window.CodeBhavyaSupabase
    }));
}());
