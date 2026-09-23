(async()=>{
 const {client,$,requireSession,esc,fmtDuration}=CBQuiz;
 try{await requireSession()}catch{return}
 const attempt=new URLSearchParams(location.search).get("attempt");
 const {data,error}=await client.rpc("quiz_my_result_v1",{p_attempt_id:attempt});
 if(error){$("resultBox").innerHTML=`<div class="notice bad">${esc(error.message)}</div>`;return}
 if(!data.can_show_score){
   $("resultBox").innerHTML=`<h1>Quiz submitted</h1><p>Your response has been saved.</p><div class="notice">Faculty has chosen to release scores after the quiz closes.</div><a class="btn primary" href="./">Quiz Home</a>`;return;
 }
 $("resultBox").innerHTML=`<span class="badge ${data.quiz_status==="closed"?"closed":"live"}">${esc(data.quiz_status)}</span>
 <h1>${esc(data.title)}</h1><div class="result-score">${data.score}/${data.max_score}</div>
 <p>Time used: <strong>${fmtDuration(data.duration_seconds)}</strong></p>
 <p class="muted">Submitted: ${esc(new Date(data.submitted_at).toLocaleString())}</p>
 <a class="btn primary" href="./">Quiz Home</a>`;
})();