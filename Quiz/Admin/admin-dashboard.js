(async()=>{
 const {client,$,requireAdmin,esc}=CBQuiz; try{await requireAdmin()}catch{return}
 async function load(){
   const {data,error}=await client.rpc("quiz_admin_list_v1");
   if(error){$("quizRows").innerHTML=`<tr><td colspan="5">${esc(error.message)}</td></tr>`;return}
   $("quizRows").innerHTML=(data||[]).map(q=>`<tr>
     <td><strong>${esc(q.title)}</strong><br><span class="muted">${esc(q.course||"")}</span></td>
     <td><strong>${esc(q.code)}</strong></td>
     <td><span class="badge ${esc(q.status)}">${esc(q.status)}</span></td>
     <td>${q.question_count}</td>
     <td><div class="actions">
       <a class="btn ghost" href="live.html?id=${encodeURIComponent(q.id)}">Control</a>
       <a class="btn ghost" href="results.html?id=${encodeURIComponent(q.id)}">Results</a>
     </div></td></tr>`).join("") || `<tr><td colspan="5">No quizzes yet.</td></tr>`;
 }
 $("refreshBtn").onclick=load; await load();
})();