(function () {
    "use strict";

    const cloud = window.CodeBhavyaSupabase || {};
    const client = cloud.client || null;
    let mode = "signin";
    let currentSession = null;
    let signOutRequested = false;

    function element(id) {
        return document.getElementById(id);
    }

    function setCloudStatus(message, tone) {
        const status = element("placementCloudStatus");
        if (!status) {
            return;
        }
        status.textContent = message || "";
        status.dataset.tone = tone || "neutral";
    }

    function setAuthMessage(message, tone) {
        const status = element("placementAuthMessage");
        if (!status) {
            return;
        }
        status.textContent = message || "";
        status.dataset.tone = tone || "neutral";
    }

    function friendlyError(error) {
        const message = String(error && error.message ? error.message : error || "");
        const lowered = message.toLowerCase();

        if (lowered.includes("invalid login credentials")) {
            return "The email or password is incorrect.";
        }
        if (lowered.includes("email not confirmed")) {
            return "Please confirm your email before signing in.";
        }
        if (lowered.includes("already registered") || lowered.includes("already exists")) {
            return "An account already exists for this email. Please sign in.";
        }
        if (lowered.includes("password")) {
            return "Use a password with at least 8 characters.";
        }
        if (lowered.includes("rate limit")) {
            return "Too many attempts were made. Please wait briefly and try again.";
        }
        return message || "The account request could not be completed. Please try again.";
    }

    function setMode(nextMode) {
        mode = nextMode === "signup" ? "signup" : "signin";
        const signingUp = mode === "signup";
        const nameField = element("placementNameField");
        const nameInput = element("placementDisplayName");
        const password = element("placementAuthPassword");

        element("placementSignInTab").setAttribute("aria-selected", String(!signingUp));
        element("placementSignUpTab").setAttribute("aria-selected", String(signingUp));
        nameField.hidden = !signingUp;
        nameInput.required = signingUp;
        password.autocomplete = signingUp ? "new-password" : "current-password";
        element("placementAuthSubmit").textContent = signingUp ? "Create my account" : "Sign in securely";
        element("placementAuthTitle").textContent = signingUp
            ? "Create your progress account"
            : "Sign in to continue your journey";
        setAuthMessage("", "neutral");
    }

    function openDialog(nextMode) {
        const dialog = element("placementAuthDialog");
        setMode(nextMode || "signin");
        if (typeof dialog.showModal === "function") {
            dialog.showModal();
        } else {
            dialog.setAttribute("open", "");
        }
        window.setTimeout(function () {
            const focusTarget = mode === "signup"
                ? element("placementDisplayName")
                : element("placementAuthEmail");
            focusTarget.focus();
        }, 0);
    }

    function closeDialog() {
        const dialog = element("placementAuthDialog");
        if (typeof dialog.close === "function") {
            dialog.close();
        } else {
            dialog.removeAttribute("open");
        }
    }

    function renderSession(session) {
        currentSession = session || null;
        const user = currentSession && currentSession.user ? currentSession.user : null;
        const openButton = element("placementOpenAuth");
        const syncButton = element("placementSyncNow");
        const signOutButton = element("placementSignOut");
        const title = element("placementCloudTitle");
        const description = element("placementCloudDescription");
        const privacy = element("placementPrivacyNote");

        if (!client) {
            title.textContent = "Progress saved on this device";
            description.textContent = "Cloud progress has not been configured yet.";
            openButton.textContent = "Cloud setup needed";
            openButton.disabled = true;
            syncButton.hidden = true;
            signOutButton.hidden = true;
            privacy.textContent = "Your selections and progress stay in this browser.";
            setCloudStatus(cloud.error || "Cloud progress is unavailable. Local progress still works.", "error");
            return;
        }

        openButton.disabled = false;

        if (!user) {
            title.textContent = "Progress saved on this device";
            description.textContent = "Sign in to keep your plan, readiness and learning history across devices.";
            openButton.textContent = "Sign in / Create account";
            openButton.hidden = false;
            syncButton.hidden = true;
            signOutButton.hidden = true;
            privacy.textContent = "Saved in this browser. Sign in above to synchronize across devices.";
            setCloudStatus("You can continue without an account.", "neutral");
            return;
        }

        title.textContent = "Cloud progress is on";
        description.textContent = "Signed in as " + (user.email || "CodeBhavya student") + ".";
        openButton.hidden = true;
        syncButton.hidden = false;
        signOutButton.hidden = false;
        privacy.textContent = "Saved in this browser and securely synchronized to your account.";
        setCloudStatus("Checking your latest progress…", "neutral");
    }

    function announceSession(session, eventName, explicitSignOut) {
        window.dispatchEvent(new CustomEvent("codebhavya:auth-changed", {
            detail: {
                session: session || null,
                user: session && session.user ? session.user : null,
                event: eventName || "SESSION_UPDATED",
                explicitSignOut: Boolean(explicitSignOut)
            }
        }));
    }

    async function submitAuthentication(event) {
        event.preventDefault();
        const form = element("placementAuthForm");
        const submit = element("placementAuthSubmit");

        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        const email = element("placementAuthEmail").value.trim();
        const password = element("placementAuthPassword").value;
        const displayName = element("placementDisplayName").value.trim();

        submit.disabled = true;
        submit.setAttribute("aria-busy", "true");
        setAuthMessage(mode === "signup" ? "Creating your account…" : "Signing you in…", "neutral");

        try {
            if (mode === "signup") {
                const redirectPath = window.location.pathname.replace(/index\.html$/i, "");
                const result = await client.auth.signUp({
                    email: email,
                    password: password,
                    options: {
                        data: { display_name: displayName },
                        emailRedirectTo: window.location.origin + redirectPath
                    }
                });

                if (result.error) {
                    throw result.error;
                }

                if (result.data && result.data.session) {
                    setAuthMessage("Account created. Your progress will now synchronize.", "success");
                    window.setTimeout(closeDialog, 700);
                } else {
                    setAuthMessage("Account created. Open your email and select the confirmation link, then sign in.", "success");
                }
            } else {
                const result = await client.auth.signInWithPassword({
                    email: email,
                    password: password
                });

                if (result.error) {
                    throw result.error;
                }

                setAuthMessage("Signed in. Loading your progress…", "success");
                window.setTimeout(closeDialog, 500);
            }
        } catch (error) {
            setAuthMessage(friendlyError(error), "error");
        } finally {
            submit.disabled = false;
            submit.removeAttribute("aria-busy");
        }
    }

    async function signOut() {
        const button = element("placementSignOut");
        button.disabled = true;
        setCloudStatus("Saving your latest changes before signing out…", "neutral");

        try {
            if (window.CodeBhavyaPlacementSync && typeof window.CodeBhavyaPlacementSync.flush === "function") {
                await window.CodeBhavyaPlacementSync.flush();
            }
            signOutRequested = true;
            const result = await client.auth.signOut();
            if (result.error) {
                throw result.error;
            }
        } catch (error) {
            signOutRequested = false;
            button.disabled = false;
            setCloudStatus(friendlyError(error), "error");
        }
    }

    function initialize() {
        element("placementOpenAuth").addEventListener("click", function () {
            openDialog("signin");
        });
        element("placementAuthClose").addEventListener("click", closeDialog);
        element("placementSignInTab").addEventListener("click", function () {
            setMode("signin");
        });
        element("placementSignUpTab").addEventListener("click", function () {
            setMode("signup");
        });
        element("placementAuthForm").addEventListener("submit", submitAuthentication);
        element("placementSignOut").addEventListener("click", signOut);
        element("placementAuthDialog").addEventListener("click", function (event) {
            if (event.target === element("placementAuthDialog")) {
                closeDialog();
            }
        });

        renderSession(null);

        if (!client) {
            return;
        }

        client.auth.onAuthStateChange(function (eventName, session) {
            const explicitSignOut = eventName === "SIGNED_OUT" && signOutRequested;
            signOutRequested = false;
            renderSession(session);
            announceSession(session, eventName, explicitSignOut);
        });
    }

    window.CodeBhavyaAuth = Object.freeze({
        getSession: function () {
            return currentSession;
        },
        getUser: function () {
            return currentSession && currentSession.user ? currentSession.user : null;
        },
        open: openDialog,
        setCloudStatus: setCloudStatus
    });

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initialize);
    } else {
        initialize();
    }
}());
