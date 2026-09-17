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
