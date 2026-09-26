(() => {
  "use strict";
  const client = window.CBQuiz?.client;
  const arrival = window.CBQuizRecoveryArrival || {};
  const form = document.getElementById("resetForm");
  const button = document.getElementById("savePassword");
  const message = document.getElementById("recoveryMessage");
  const first = document.getElementById("newPassword");
  const second = document.getElementById("confirmPassword");
  let recovered = false;
  let completed = false;
  const show = (text, bad = false) => {
    message.replaceChildren();
    const notice = document.createElement("div");
    notice.className = "notice" + (bad ? " bad" : "");
    notice.textContent = text;
    message.append(notice);
  };
  const ready = () => {
    if (completed || arrival.linkError) return;
    recovered = true;
    form.hidden = false;
    show("Link verified. Enter a new password of at least 8 characters.");
    // Keep access tokens out of browser history after the auth client has processed them.
    history.replaceState(null, "", location.pathname);
  };

  if (!client) {
    show("Account service is unavailable. Please try again later.", true);
    return;
  }
  if (arrival.linkError) {
    show("This reset link is invalid or expired. Request a new link.", true);
    return;
  }

  client.auth.onAuthStateChange((event, session) => {
    if (event === "PASSWORD_RECOVERY" && session?.user) ready();
    if (event === "SIGNED_OUT" && recovered && !completed) {
      recovered = false;
      form.hidden = true;
      show("Your reset session ended. Request another reset link.", true);
    }
  });

  // The client may process an email link before this page receives its auth event.
  // A previously signed-in tab is never accepted through this fallback.
  (async () => {
    if (!arrival.fromLink || arrival.hadStoredSession) {
      if (!recovered) show("Open the link in your reset email to set a new password.", true);
      return;
    }
    try {
      const { data, error } = await client.auth.getSession();
      if (!error && data?.session?.user) ready();
      else if (!recovered) show("This reset link is invalid or expired. Request a new link.", true);
    } catch (_) {
      if (!recovered) show("Could not verify the reset link. Request a new link.", true);
    }
  })();

  form.addEventListener("submit", async event => {
    event.preventDefault();
    if (!recovered || completed || !form.reportValidity()) return;
    if (first.value !== second.value) {
      show("The two passwords do not match.", true);
      second.focus();
      return;
    }
    button.disabled = true;
    show("Saving your new password…");
    try {
      const { data: verified, error: userError } = await client.auth.getUser();
      if (userError || !verified?.user) throw new Error("Reset session expired. Request another reset link.");
      const { error } = await client.auth.updateUser({ password: first.value });
      if (error) throw error;
      completed = true;
      recovered = false;
      form.hidden = true;
      first.value = "";
      second.value = "";
      // Use local sign-out because Quiz and Placement share this browser session.
      try { await client.auth.signOut({ scope: "local" }); }
      catch (_) { /* Clear the saved browser session below even when offline. */ }
      finally {
        try {
          sessionStorage.removeItem("codebhavya-placement-tab-auth-v1");
          sessionStorage.removeItem("codebhavya:placement:last-activity");
          sessionStorage.removeItem("cb_quiz_join");
        } catch (_) { /* The password has already been updated. */ }
      }
      show("Password changed. You can now sign in with your new password.");
    } catch (error) {
      if (!completed) show(error?.message || "Could not change the password. Try again.", true);
    } finally {
      button.disabled = false;
    }
  });
})();
