(async()=>{
 const {client,$,requireAdmin,esc,toast}=CBQuiz; try{await requireAdmin()}catch{return}
 let quizId=null, optionCount=4, savedCount=0;

 function drawOptions(){
   const existing=[...document.querySelectorAll(".opt-text")].map(x=>x.value);
   $("optionEditor").innerHTML=Array.from({length:optionCount},(_,i)=>`<div class="option-editor">
     <input type="radio" name="correct" value="${i}" ${i===0?"checked":""}>
     <input class="input opt-text" placeholder="Option ${i+1}" value="${esc(existing[i]||"")}">
     ${optionCount>2?`<button type="button" class="btn ghost removeOpt" data-i="${i}">Remove</button>`:""}
   </div>`).join("");
   document.querySelectorAll(".removeOpt").forEach(b=>b.onclick=()=>{if(optionCount>2){optionCount--;drawOptions()}});
 }
 drawOptions();
 $("addOptionBtn").onclick=()=>{if(optionCount<8){optionCount++;drawOptions()}};

 $("createBtn").onclick=async()=>{
   const title=$("title").value.trim(), course=$("course").value.trim();
   const duration=Math.round(Number($("duration").value)*60);
   if(!title||duration<60){$("message").innerHTML='<div class="notice bad">Enter a title and valid duration.</div>';return}
   const {data,error}=await client.rpc("quiz_admin_create_v1",{
     p_title:title,p_course:course||null,p_duration_seconds:duration,
     p_show_result:$("showResult").value,p_shuffle_questions:$("shuffleQuestions").checked,
     p_shuffle_options:$("shuffleOptions").checked
   });
   if(error){$("message").innerHTML=`<div class="notice bad">${esc(error.message)}</div>`;return}
   quizId=data.id; $("questionPanel").hidden=false; $("createBtn").disabled=true;
   $("message").innerHTML=`<div class="notice">Quiz created. Code: <strong>${esc(data.code)}</strong>. Add questions below.</div>`;
   $("controlLink").href=`live.html?id=${encodeURIComponent(quizId)}`;
 };

 $("saveQuestionBtn").onclick=async()=>{
   if(!quizId)return;
   const text=$("qText").value.trim(), marks=Number($("qMarks").value)||1;
   const options=[...document.querySelectorAll(".opt-text")].map(x=>x.value.trim());
   const correct=Number(document.querySelector('input[name="correct"]:checked')?.value ?? -1);
   if(!text||options.some(x=>!x)||correct<0){toast("Complete question, options and correct answer.","error");return}
   const {data,error}=await client.rpc("quiz_admin_add_question_v1",{
     p_quiz_id:quizId,p_question_text:text,p_marks:marks,p_options:options,p_correct_index:correct
   });
   if(error){toast(error.message,"error");return}
   savedCount++; $("qText").value=""; document.querySelectorAll(".opt-text").forEach(x=>x.value=""); optionCount=4;drawOptions();
   $("questionList").innerHTML=`<div class="notice">${savedCount} question${savedCount===1?"":"s"} saved.</div>`;
 };

 $("openWaitingBtn").onclick=async()=>{
   if(!quizId)return;
   const {error}=await client.rpc("quiz_admin_open_waiting_v1",{p_quiz_id:quizId});
   if(error){toast(error.message,"error");return}
   location.href=`live.html?id=${encodeURIComponent(quizId)}`;
 };
})();