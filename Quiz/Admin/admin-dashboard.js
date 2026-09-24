(async()=>{
 const {client,$,requireAdmin,esc,toast}=CBQuiz;try{await requireAdmin()}catch{return}
 let quizzes=[];
 async function duplicateQuiz(id,title){
   const newTitle=prompt("Name for duplicated quiz:",`${title} - Copy`);
   if(newTitle===null)return;
   if(!newTitle.trim()){toast("Enter a quiz title.","error");return}
   const {data,error}=await client.rpc("quiz_admin_duplicate_v6",{p_quiz_id:id,p_new_title:newTitle.trim()});
   if(error){toast(error.message,"error");return}
   toast(`Quiz duplicated. New code: ${data.code}`);await load();
 }
 function render(){
   const selectedCourse=$("courseFilter").value;
   const visible=quizzes.filter(q=>!selectedCourse||(q.course||"")===selectedCourse);
   $("quizRows").innerHTML=visible.map(q=>`<tr>
     <td><strong>${esc(q.title)}</strong><br><span class="muted">${esc(q.course||"")}</span></td>
     <td><strong>${esc(q.code)}</strong></td>
     <td><span class="badge ${esc(q.status)}">${esc(q.status)}</span></td>
     <td>${Number(q.question_count||0)}</td>
     <td><div class="actions compact">
       ${["draft","waiting"].includes(q.status)?`<a class="btn ghost" href="edit.html?id=${encodeURIComponent(q.id)}">Edit</a>`:""}
       <a class="btn teal" href="assign.html?id=${encodeURIComponent(q.id)}">Sections</a>
       <a class="btn ghost" href="live.html?id=${encodeURIComponent(q.id)}">Control</a>
       <a class="btn ghost" href="results.html?id=${encodeURIComponent(q.id)}">Results</a>
       <a class="btn ghost" href="analytics.html?id=${encodeURIComponent(q.id)}">Analytics</a>
       <button class="btn ghost duplicateQuiz" data-id="${esc(q.id)}" data-title="${esc(q.title)}">Duplicate</button>
       ${q.status!=="live"?`<button class="btn danger deleteQuiz" data-id="${esc(q.id)}" data-title="${esc(q.title)}">Delete</button>`:""}
     </div></td></tr>`).join("")||'<tr><td colspan="5">No quizzes for this course.</td></tr>';
   document.querySelectorAll(".duplicateQuiz").forEach(b=>b.onclick=()=>duplicateQuiz(b.dataset.id,b.dataset.title));
   document.querySelectorAll(".deleteQuiz").forEach(b=>b.onclick=async()=>{
     if(!confirm(`Delete "${b.dataset.title}"? This permanently deletes its questions, attempts and results.`))return;
     const {error}=await client.rpc("quiz_admin_delete_v2",{p_quiz_id:b.dataset.id});
     if(error){toast(error.message,"error");return}toast("Quiz deleted.");await load();
   });
 }
 async function load(showFeedback=false){
   const btn=$("refreshBtn");btn.disabled=true;btn.textContent="Refreshing...";
   const {data,error}=await client.rpc("quiz_admin_list_v1");
   btn.disabled=false;btn.textContent="Refresh";
   if(error){$("quizRows").innerHTML=`<tr><td colspan="5">${esc(error.message)}</td></tr>`;return}
   quizzes=data||[];
   const filter=$("courseFilter"),previous=filter.value;
   filter.innerHTML='<option value="">All courses</option>'+[...new Set(quizzes.map(q=>q.course||"").filter(Boolean))].sort().map(course=>`<option value="${esc(course)}">${esc(course)}</option>`).join("");
   filter.value=previous;render();
   $("lastRefresh").textContent=`Last refreshed: ${new Date().toLocaleTimeString()}`;
   if(showFeedback)toast("Dashboard refreshed from Supabase.");
 }
 $("courseFilter").onchange=render;
 $("refreshBtn").onclick=()=>load(true);
 await load();
})();
