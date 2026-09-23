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

 $("startMode").onchange=()=>{$("scheduleFields").hidden=$("startMode").value!=="scheduled"};
 $("addOptionBtn").onclick=()=>{if(optionCount<8){optionCount++;drawOptions()}};

 $("createBtn").onclick=async()=>{
   const title=$("title").value.trim(), course=$("course").value.trim();
   const duration=Math.round(Number($("duration").value)*60);
   const mode=$("startMode").value;
   let scheduled=null;
   if(mode==="scheduled"){
     if(!$("scheduledStart").value){$("message").innerHTML='<div class="notice bad">Choose the scheduled start date and time.</div>';return}
     scheduled=new Date($("scheduledStart").value).toISOString();
     if(new Date(scheduled).getTime()<=Date.now()+30000){$("message").innerHTML='<div class="notice bad">Scheduled start must be in the future.</div>';return}
   }
   if(!title||duration<60){$("message").innerHTML='<div class="notice bad">Enter a title and valid duration.</div>';return}
   const {data,error}=await client.rpc("quiz_admin_create_v7",{
     p_title:title,p_course:course||null,p_duration_seconds:duration,
     p_show_result:$("showResult").value,p_shuffle_questions:$("shuffleQuestions").checked,
     p_shuffle_options:$("shuffleOptions").checked,p_start_mode:mode,p_scheduled_start_at:scheduled
   });
   if(error){$("message").innerHTML=`<div class="notice bad">${esc(error.message)}</div>`;return}
   quizId=data.id; $("questionPanel").hidden=false; $("createBtn").disabled=true;
   $("message").innerHTML=`<div class="notice">Quiz created. Code: <strong>${esc(data.code)}</strong>. ${mode==="scheduled"?"Waiting room is already available; it will start automatically at the scheduled time.":"Add questions, then open the waiting room."}</div>`;
   $("controlLink").href=`live.html?id=${encodeURIComponent(quizId)}`;
   if(mode==="scheduled") $("openWaitingBtn").hidden=true;
 };

 $("saveQuestionBtn").onclick=async()=>{
   if(!quizId)return;
   const text=$("qText").value.trim(), marks=Number($("qMarks").value)||1, negative=Math.max(0,Number($("qNegative").value)||0);
   const options=[...document.querySelectorAll(".opt-text")].map(x=>x.value.trim());
   const correct=Number(document.querySelector('input[name="correct"]:checked')?.value ?? -1);
   if(!text||options.some(x=>!x)||correct<0){toast("Complete question, options and correct answer.","error");return}
   const {error}=await client.rpc("quiz_admin_add_question_v7",{
     p_quiz_id:quizId,p_question_text:text,p_marks:marks,p_negative_marks:negative,p_options:options,p_correct_index:correct
   });
   if(error){toast(error.message,"error");return}
   savedCount++; $("qText").value=""; $("qMarks").value="1"; $("qNegative").value="0";
   document.querySelectorAll(".opt-text").forEach(x=>x.value=""); optionCount=4;drawOptions();
   $("questionList").innerHTML=`<div class="notice">${savedCount} question${savedCount===1?"":"s"} saved.</div>`;
 };

 $("openWaitingBtn").onclick=async()=>{
   if(!quizId)return;
   const {error}=await client.rpc("quiz_admin_open_waiting_v1",{p_quiz_id:quizId});
   if(error){toast(error.message,"error");return}
   location.href=`live.html?id=${encodeURIComponent(quizId)}`;
 };
})();