(() => {
  "use strict";
  const client = window.CBQuiz?.client;
  const form = document.getElementById("forgotForm");
  const button = document.getElementById("sendReset");
  const emailInput = document.getElementById("resetEmail");
  const message = document.getElementById("forgotMessage");
  const show = (text, bad = false) => {
    message.replaceChildren();
    const notice = document.createElement("div");
    notice.className = "notice" + (bad ? " bad" : "");
    notice.textContent = text;
    message.append(notice);
  };

  if (!client) {
    button.disabled = true;
    show("Account service is unavailable. Please try again later.", true);
    return;
  }

  form.addEventListener("submit", async event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    button.disabled = true;
    show("Sending your reset request…");
    try {
      const redirectTo = new URL("reset-password.html", location.href).href;
      const { error } = await client.auth.resetPasswordForEmail(emailInput.value.trim(), { redirectTo });
      if (error) throw error;
      show("If a CodeBhavya account exists for that email, a reset link is on its way. Check your inbox and spam folder.");
    } catch (error) {
      show(error?.message || "Could not send the link. Please try again.", true);
    } finally {
      button.disabled = false;
    }
  });
})();
