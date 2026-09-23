(async()=>{
 const {client,$,requireAdmin,esc,localDate,fmtDuration}=CBQuiz;try{await requireAdmin()}catch{return}
 const id=new URLSearchParams(location.search).get("id");
 const {data,error}=await client.rpc("quiz_admin_results_v1",{p_quiz_id:id});
 if(error){$("rows").innerHTML=`<tr><td colspan="6">${esc(error.message)}</td></tr>`;return}
 $("title").textContent=data.title+" - Results";
 const submitted=data.participants.filter(x=>x.status==="submitted");
 const avg=submitted.length?submitted.reduce((s,x)=>s+Number(x.score||0),0)/submitted.length:0;
 $("stats").innerHTML=`<div class="stat"><strong>${data.participants.length}</strong><span>Joined</span></div><div class="stat"><strong>${submitted.length}</strong><span>Submitted</span></div><div class="stat"><strong>${avg.toFixed(1)}</strong><span>Average Score</span></div><div class="stat"><strong>${data.max_score}</strong><span>Maximum</span></div>`;
 $("rows").innerHTML=data.participants.map(p=>`<tr><td>${esc(p.student_label)}</td><td>${esc(p.status)}</td><td>${p.score==null?"—":p.score}</td><td>${esc(localDate(p.joined_at))}</td><td>${esc(localDate(p.submitted_at))}</td><td>${p.duration_seconds==null?"—":fmtDuration(p.duration_seconds)}</td></tr>`).join("")||`<tr><td colspan="6">No attempts yet.</td></tr>`;
})();