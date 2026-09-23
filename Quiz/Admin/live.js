(async()=>{
 const {client,$,requireAdmin,esc,localDate,toast}=CBQuiz;try{await requireAdmin()}catch{return}
 const id=new URLSearchParams(location.search).get("id"); if(!id){location.href="index.html";return}
 let quiz=null, channel=null;
 async function load(){
   const {data,error}=await client.rpc("quiz_admin_get_v1",{p_quiz_id:id}); if(error){$("control").innerHTML=esc(error.message);return}
   quiz=data;
   $("control").innerHTML=`<span class="badge ${esc(quiz.status)}">${esc(quiz.status)}</span>
   <h1>${esc(quiz.title)}</h1><div class="code-big">${esc(quiz.code)}</div>
   <p>${quiz.question_count} question${quiz.question_count===1?"":"s"} · ${Math.round(quiz.duration_seconds/60)} minutes · Joined: <strong>${quiz.joined_count}</strong></p>
   <div class="actions" style="justify-content:center">
     ${["draft","waiting"].includes(quiz.status)?`<a class="btn ghost" href="edit.html?id=${encodeURIComponent(id)}">Edit Questions</a>`:""}
     ${quiz.status==="draft"?`<button class="btn gold" id="openBtn">Open Waiting Room</button>`:""}
     ${quiz.status==="waiting"?`<button class="btn teal" id="startBtn">START QUIZ</button>`:""}
     ${quiz.status==="live"?`<button class="btn danger" id="closeBtn">CLOSE QUIZ</button>`:""}
     <a class="btn ghost" href="results.html?id=${encodeURIComponent(id)}">Results</a>
   </div>`;
   if($("openBtn"))$("openBtn").onclick=()=>action("quiz_admin_open_waiting_v1");
   if($("startBtn"))$("startBtn").onclick=()=>{if(confirm("Start the quiz for all joined students now? Editing will be locked after Start."))action("quiz_admin_start_v1")};
   if($("closeBtn"))$("closeBtn").onclick=()=>{if(confirm("Close quiz and finalize remaining attempts?"))action("quiz_admin_close_v1")};
   await loadParticipants();
 }
 async function action(name){const {error}=await client.rpc(name,{p_quiz_id:id});if(error)toast(error.message,"error");else await load()}
 async function loadParticipants(){
   const {data,error}=await client.rpc("quiz_admin_participants_v1",{p_quiz_id:id});
   if(error){$("participants").innerHTML=`<tr><td colspan="5">${esc(error.message)}</td></tr>`;return}
   $("participants").innerHTML=(data||[]).map(p=>`<tr><td>${esc(p.student_label)}</td><td>${esc(localDate(p.joined_at))}</td><td>${esc(p.status)}</td><td><strong>${Number(p.fullscreen_exit_count||0)}</strong> / 3</td><td>${p.score==null?"—":p.score}</td></tr>`).join("")||`<tr><td colspan="5">No students joined yet.</td></tr>`;
 }
 await load();
 channel=client.channel(`admin-quiz-${id}`)
   .on("postgres_changes",{event:"*",schema:"public",table:"quiz_attempts",filter:`quiz_id=eq.${id}`},loadParticipants)
   .on("postgres_changes",{event:"UPDATE",schema:"public",table:"quizzes",filter:`id=eq.${id}`},load)
   .subscribe();
 setInterval(loadParticipants,5000);
})();
