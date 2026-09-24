(async()=>{
 const {client,$,requireAdmin,esc,toast}=CBQuiz; try{await requireAdmin()}catch{return}
 let quizId=null, optionCount=4, savedCount=0;
 const selectedCorrect=()=>[...document.querySelectorAll('input[name="correct"]:checked')].map(x=>Number(x.value));
 const currentValues=()=>[...document.querySelectorAll('.opt-text')].map(x=>x.value);
 function previewImage(){const url=$('qImage').value.trim();$('qImagePreview').innerHTML=url?`<div class="question-image-preview"><img src="${esc(url)}" alt="Question image preview"><span>Image preview</span></div>`:'';}
 function drawOptions(values=[],correct=[0]){
   const type=$('qType').value;
   if(type==='true_false'){values=['True','False'];optionCount=2;if(!correct.length)correct=[0]}
   else{optionCount=Math.max(2,Math.min(8,values.length||optionCount||4));while(values.length<optionCount)values.push('')}
   const inputType=type==='multiple_mcq'?'checkbox':'radio';
   $('optionEditor').innerHTML=Array.from({length:optionCount},(_,i)=>`<div class="option-editor"><input type="${inputType}" name="correct" value="${i}" ${correct.includes(i)?'checked':''}><input class="input opt-text" placeholder="Option ${i+1}" value="${esc(values[i]||'')}" ${type==='true_false'?'readonly':''}>${type!=='true_false'&&optionCount>2?`<button type="button" class="btn ghost removeOpt" data-i="${i}">Remove</button>`:''}</div>`).join('');
   $('addOptionBtn').hidden=type==='true_false';
   $('qTypeNote').innerHTML=type==='multiple_mcq'?'<div class="notice">Select all correct options. Students must choose the exact correct set for full marks.</div>':type==='true_false'?'<div class="notice">True / False uses two fixed options.</div>':'<div class="notice">Select exactly one correct option.</div>';
   document.querySelectorAll('.removeOpt').forEach(b=>b.onclick=()=>{const idx=Number(b.dataset.i),vals=currentValues();let c=selectedCorrect();vals.splice(idx,1);c=c.filter(x=>x!==idx).map(x=>x>idx?x-1:x);if(!c.length)c=[0];optionCount=vals.length;drawOptions(vals,c);});
 }
 function resetQuestion(){$('qType').value='single_mcq';$('qImage').value='';$('qText').value='';$('qMarks').value='1';$('qNegative').value='0';optionCount=4;previewImage();drawOptions(['','','',''],[0]);}
 $('startMode').onchange=()=>{$('scheduleFields').hidden=$('startMode').value!=='scheduled'};
 $('monitorFocus').onchange=()=>{$('focusMonitorSettings').hidden=!$('monitorFocus').checked};
 $('qType').onchange=()=>drawOptions(currentValues(),selectedCorrect().length?selectedCorrect():[0]);
 $('qImage').addEventListener('blur',previewImage);$('qImage').addEventListener('change',previewImage);
 $('addOptionBtn').onclick=()=>{if(optionCount<8){const vals=currentValues(),c=selectedCorrect();optionCount++;vals.push('');drawOptions(vals,c.length?c:[0])}};
 $('createBtn').onclick=async()=>{
   const title=$('title').value.trim(),course=$('course').value.trim(),duration=Math.round(Number($('duration').value)*60),mode=$('startMode').value;let scheduled=null;
   if(mode==='scheduled'){if(!$('scheduledStart').value){$('message').innerHTML='<div class="notice bad">Choose the scheduled start date and time.</div>';return}scheduled=new Date($('scheduledStart').value).toISOString();if(new Date(scheduled).getTime()<=Date.now()+30000){$('message').innerHTML='<div class="notice bad">Scheduled start must be in the future.</div>';return}}
   if(!title||duration<60){$('message').innerHTML='<div class="notice bad">Enter a title and valid duration.</div>';return}
   const {data,error}=await client.rpc('quiz_admin_create_v8',{p_title:title,p_course:course||null,p_duration_seconds:duration,p_show_result:$('showResult').value,p_shuffle_questions:$('shuffleQuestions').checked,p_shuffle_options:$('shuffleOptions').checked,p_start_mode:mode,p_scheduled_start_at:scheduled,p_monitor_focus:$('monitorFocus').checked,p_focus_warning_limit:Math.max(1,Math.min(10,Number($('focusWarningLimit').value)||3))});
   if(error){$('message').innerHTML=`<div class="notice bad">${esc(error.message)}</div>`;return}quizId=data.id;$('questionPanel').hidden=false;$('createBtn').disabled=true;$('message').innerHTML=`<div class="notice">Quiz created. Code: <strong>${esc(data.code)}</strong>.</div>`;$('controlLink').href=`live.html?id=${encodeURIComponent(quizId)}`;if(mode==='scheduled')$('openWaitingBtn').hidden=true;
 };
 $('saveQuestionBtn').onclick=async()=>{
   if(!quizId)return;const type=$('qType').value,text=$('qText').value.trim(),image=$('qImage').value.trim()||null,marks=Number($('qMarks').value)||1,negative=Math.max(0,Number($('qNegative').value)||0),options=currentValues().map(x=>x.trim()),correct=selectedCorrect();
   if(!text||options.length<2||options.some(x=>!x)){toast('Complete the question and all options.','error');return}if(type==='multiple_mcq'&&correct.length<2){toast('Select at least two correct options.','error');return}if(type!=='multiple_mcq'&&correct.length!==1){toast('Select exactly one correct answer.','error');return}
   const {error}=await client.rpc('quiz_admin_add_question_v8',{p_quiz_id:quizId,p_question_type:type,p_question_text:text,p_image_url:image,p_marks:marks,p_negative_marks:negative,p_options:options,p_correct_indices:correct});if(error){toast(error.message,'error');return}savedCount++;resetQuestion();$('questionList').innerHTML=`<div class="notice">${savedCount} question${savedCount===1?'':'s'} saved.</div>`;
 };
 $('openWaitingBtn').onclick=async()=>{if(!quizId)return;const {error}=await client.rpc('quiz_admin_open_waiting_v1',{p_quiz_id:quizId});if(error){toast(error.message,'error');return}location.href=`live.html?id=${encodeURIComponent(quizId)}`};
 resetQuestion();
})();
