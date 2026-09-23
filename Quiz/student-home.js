(async () => {
  const { client, $, requireSession, esc } = CBQuiz;
  try { await requireSession(); } catch { return; }

  $("quizCode").addEventListener("input", e => {
    e.target.value = e.target.value.toUpperCase().replace(/[^A-Z0-9-]/g,"");
  });

  $("joinBtn").addEventListener("click", async () => {
    const code = $("quizCode").value.trim().toUpperCase();
    const msg = $("joinMessage");
    if (!code) { msg.innerHTML='<div class="notice bad">Enter the quiz code.</div>'; return; }
    $("joinBtn").disabled = true;
    msg.innerHTML='<div class="notice">Checking quiz…</div>';
    const { data, error } = await client.rpc("quiz_join_v1", { p_code: code });
    $("joinBtn").disabled = false;
    if (error) { msg.innerHTML=`<div class="notice bad">${esc(error.message)}</div>`; return; }
    sessionStorage.setItem("cb_quiz_join", JSON.stringify(data));
    location.href = `quiz.html?attempt=${encodeURIComponent(data.attempt_id)}`;
  });

  const qs = new URLSearchParams(location.search);
  if (qs.get("code")) {
    $("quizCode").value = qs.get("code").toUpperCase();
  }
})();