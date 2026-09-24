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

  async function loadHistory() {
    const button=$("refreshHistory"),rows=$("historyRows"),message=$("historyMessage");
    button.disabled=true;
    message.textContent="";
    const {data,error}=await client.rpc("quiz_my_history_v13");
    button.disabled=false;
    if(error){message.innerHTML=`<div class="notice bad">Could not load quiz history: ${esc(error.message)}</div>`;
      rows.innerHTML='<tr><td colspan="5">History is unavailable. You can still join a quiz using its code.</td></tr>';return}
    const history=Array.isArray(data)?data:[];
    const submitted=history.filter(item=>item.attempt_status==="submitted").length;
    $("historyStats").innerHTML=`<div class="stat"><strong>${history.length}</strong><span>Quizzes joined (latest 100)</span></div>
      <div class="stat"><strong>${submitted}</strong><span>Submitted</span></div>`;
    rows.innerHTML=history.map(item=>{
      const done=item.attempt_status==="submitted";
      const resultAllowed=done&&item.score_visible;
      const score=resultAllowed?`${Number(item.score).toFixed(1)} / ${Number(item.max_score).toFixed(1)} (${item.percentage==null?'—':Number(item.percentage).toFixed(1)+'%'})`
        :!done?'—':!item.feedback_submitted?'Complete feedback':item.release_mode==='faculty_only'?'Faculty only':'Awaiting release';
      const link=done?`<a class="btn ghost mini" href="result.html?attempt=${encodeURIComponent(item.attempt_id)}">${item.feedback_submitted?'View Result':'Complete Feedback'}</a>`
        :item.quiz_status==='closed'?'<span class="muted">Quiz closed</span>'
        :`<a class="btn teal mini" href="quiz.html?attempt=${encodeURIComponent(item.attempt_id)}">Continue</a>`;
      return `<tr><td><strong>${esc(item.title)}</strong><br><span class="muted">${esc(item.course||'')}</span></td>
        <td>${esc(CBQuiz.localDate(item.joined_at))}${item.submitted_at?`<br><span class="muted">Submitted ${esc(CBQuiz.localDate(item.submitted_at))}</span>`:''}</td>
        <td><span class="badge ${done?'closed':item.quiz_status==='live'?'live':'waiting'}">${done?'Submitted':esc(item.quiz_status==='closed'?'Closed':item.quiz_status==='live'?'In progress':'Waiting')}</span></td>
        <td>${esc(score)}</td><td>${link}</td></tr>`;
    }).join('')||'<tr><td colspan="5">You have not joined a quiz yet. Enter the code above when your faculty shares one.</td></tr>';
  }
  $("refreshHistory").onclick=loadHistory;
  await loadHistory();

  const qs = new URLSearchParams(location.search);
  if (qs.get("code")) {
    $("quizCode").value = qs.get("code").toUpperCase();
  }
})();