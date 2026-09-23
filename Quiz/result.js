(async()=>{
  const {client,$,requireSession,esc,fmtDuration}=CBQuiz;
  try{await requireSession()}catch{return}
  const attempt=new URLSearchParams(location.search).get("attempt");
  let channel=null,poll=null,lastQuizId=null;

  async function loadResult(){
    const {data,error}=await client.rpc("quiz_my_result_v1",{p_attempt_id:attempt});
    if(error){$("resultBox").innerHTML=`<div class="notice bad">${esc(error.message)}</div>`;return}
    lastQuizId=data.quiz_id;

    if(data.can_show_score){
      clearInterval(poll); poll=null;
      $("resultBox").innerHTML=`<span class="badge ${data.quiz_status==="closed"?"closed":"live"}">${esc(data.quiz_status)}</span>
      <h1>${esc(data.title)}</h1><div class="result-score">${data.score}/${data.max_score}</div>
      <p>Time used: <strong>${fmtDuration(data.duration_seconds)}</strong></p>
      <p class="muted">Submitted: ${esc(new Date(data.submitted_at).toLocaleString())}</p>
      <a class="btn primary" href="./">Quiz Home</a>`;
      return;
    }

    if(data.release_mode==="faculty_only"){
      clearInterval(poll); poll=null;
      $("resultBox").innerHTML=`<h1>Quiz submitted</h1><p>Your response has been saved.</p>
      <div class="notice">This quiz is configured as <strong>Faculty only</strong>. Your score is not released on the student page.</div>
      <a class="btn primary" href="./">Quiz Home</a>`;
      return;
    }

    $("resultBox").innerHTML=`<h1>Quiz submitted</h1><p>Your response has been saved.</p>
    <div class="notice warn"><span class="pulse"></span> Waiting for faculty to close the quiz and release results…</div>
    <div class="actions" style="justify-content:center"><button class="btn ghost" id="checkResult">Check Result Now</button><a class="btn primary" href="./">Quiz Home</a></div>`;
    $("checkResult")?.addEventListener("click",loadResult);
    if(!poll) poll=setInterval(loadResult,2500);
  }

  await loadResult();
  if(lastQuizId){
    channel=client.channel(`quiz-result-${lastQuizId}`)
      .on("postgres_changes",{event:"UPDATE",schema:"public",table:"quizzes",filter:`id=eq.${lastQuizId}`},loadResult)
      .subscribe();
  }
})();
