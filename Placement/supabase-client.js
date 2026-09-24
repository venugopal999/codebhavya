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
    const idleLimitMs = 24 * 60 * 60 * 1000;
    const activityKey = "codebhavya:placement:last-activity";
    let lastActivity = 0;
    let signedIn = false;
    let signingOutForIdle = false;

    function readActivity() {
        try { return Number(window.localStorage.getItem(activityKey)) || lastActivity; }
        catch (_) { return lastActivity; }
    }

    function writeActivity(time) {
        lastActivity = time;
        try { window.localStorage.setItem(activityKey, String(time)); }
        catch (_) { /* Timer remains active in this tab. */ }
    }

    function clearActivity() {
        lastActivity = 0;
        try { window.localStorage.removeItem(activityKey); }
        catch (_) { /* Storage may be blocked. */ }
    }

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
        // Calling auth methods directly in an auth callback can deadlock.
        window.setTimeout(async function () {
            try {
                const result = await client.auth.signOut({ scope: "local" });
                if (result.error) throw result.error;
                clearActivity();
            } catch (_) {
                // Retry when the tab resumes or connectivity returns.
            } finally {
                signingOutForIdle = false;
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
                    detectSessionInUrl: true
                }
            });
            client.auth.onAuthStateChange(function (event, session) {
                const wasSignedIn = signedIn;
                signedIn = Boolean(session && session.user);
                if (event === "SIGNED_OUT") {
                    clearActivity();
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
            window.addEventListener("storage", function (event) {
                if (event.key === activityKey) checkIdle();
            });
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
