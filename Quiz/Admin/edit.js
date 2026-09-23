(async()=>{
  const {client,$,requireAdmin,esc,toast}=CBQuiz;
  try{await requireAdmin()}catch{return}
  const quizId=new URLSearchParams(location.search).get("id");
  $("bankShortcut").href=`bank.html?quiz=${encodeURIComponent(quizId)}`;
  if(!quizId){location.href="index.html";return}

  let bundle=null, editingQuestionId=null, optionCount=4;

  function editable(){return bundle && ["draft","waiting"].includes(bundle.quiz.status)}

  function drawOptions(values=[],correctIndex=0){
    optionCount=Math.max(2,Math.min(8,values.length||optionCount||4));
    $("optionEditor").innerHTML=Array.from({length:optionCount},(_,i)=>`<div class="option-editor">
      <input type="radio" name="correct" value="${i}" ${i===correctIndex?"checked":""} ${!editable()?"disabled":""}>
      <input class="input opt-text" placeholder="Option ${i+1}" value="${esc(values[i]||"")}" ${!editable()?"disabled":""}>
      ${optionCount>2&&editable()?`<button type="button" class="btn ghost removeOpt" data-i="${i}">Remove</button>`:""}
    </div>`).join("");
    document.querySelectorAll(".removeOpt").forEach(b=>b.onclick=()=>{
      const idx=Number(b.dataset.i);
      const vals=[...document.querySelectorAll(".opt-text")].map(x=>x.value);
      const checked=Number(document.querySelector('input[name="correct"]:checked')?.value??0);
      vals.splice(idx,1); optionCount=vals.length;
      let nextCorrect=checked;
      if(checked===idx)nextCorrect=0; else if(checked>idx)nextCorrect=checked-1;
      drawOptions(vals,nextCorrect);
    });
  }

  function setEditorEnabled(enabled){
    ["qText","qMarks","addOptionBtn","saveQuestionBtn","cancelEditBtn","newQuestionBtn","saveQuizBtn"].forEach(id=>{if($(id))$(id).disabled=!enabled});
    document.querySelectorAll("#editorPanel input,#editorPanel textarea,#editorPanel button").forEach(el=>el.disabled=!enabled);
    ["title","course","duration","showResult","shuffleQuestions","shuffleOptions"].forEach(id=>{if($(id))$(id).disabled=!enabled});
  }

  function resetEditor(){
    editingQuestionId=null; $("editorTitle").textContent="Add Question"; $("qText").value=""; $("qMarks").value="1"; optionCount=4; drawOptions(["","","",""],0);
  }

  function editQuestion(id){
    const q=bundle.questions.find(x=>x.id===id); if(!q)return;
    editingQuestionId=id; $("editorTitle").textContent=`Edit Question ${q.position}`; $("qText").value=q.text; $("qMarks").value=q.marks;
    const correct=Math.max(0,q.options.findIndex(o=>o.is_correct)); optionCount=q.options.length; drawOptions(q.options.map(o=>o.text),correct);
    $("editorPanel").scrollIntoView({behavior:"smooth",block:"start"});
  }

  async function load(){
    const {data,error}=await client.rpc("quiz_admin_edit_bundle_v2",{p_quiz_id:quizId});
    if(error){document.querySelector("main").innerHTML=`<section class="panel"><div class="notice bad">${esc(error.message)}</div></section>`;return}
    bundle=data; const q=data.quiz;
    $("title").value=q.title||""; $("course").value=q.course||""; $("duration").value=Math.round(q.duration_seconds/60); $("showResult").value=q.show_result;
    $("shuffleQuestions").checked=!!q.shuffle_questions; $("shuffleOptions").checked=!!q.shuffle_options; $("controlLink").href=`live.html?id=${encodeURIComponent(q.id)}`;
    $("editStatus").innerHTML=`<div class="notice ${editable()?"":"warn"}">Status: <strong>${esc(q.status)}</strong> · Code: <strong>${esc(q.code)}</strong>${editable()?" · Editing is allowed until Start is pressed.":" · This quiz is locked because it has started or closed."}</div>`;
    $("questionList").innerHTML=(data.questions||[]).map(x=>`<div class="question-manage-row"><div><strong>Q${x.position}. ${esc(x.text)}</strong><div class="muted">${x.options.length} options · ${x.marks} mark${x.marks===1?"":"s"}</div></div><div class="actions compact">${editable()?`<button class="btn ghost editQ" data-id="${esc(x.id)}">Edit</button><button class="btn danger deleteQ" data-id="${esc(x.id)}">Delete</button>`:""}</div></div>`).join("")||'<div class="notice warn">No questions yet.</div>';
    document.querySelectorAll(".editQ").forEach(b=>b.onclick=()=>editQuestion(b.dataset.id));
    document.querySelectorAll(".deleteQ").forEach(b=>b.onclick=async()=>{
      if(!confirm("Delete this question?"))return;
      const {error}=await client.rpc("quiz_admin_delete_question_v2",{p_question_id:b.dataset.id});
      if(error){toast(error.message,"error");return} toast("Question deleted."); await load(); resetEditor();
    });
    setEditorEnabled(editable());
    if(editable() && !editingQuestionId) resetEditor();
  }

  $("saveQuizBtn").onclick=async()=>{
    const {error}=await client.rpc("quiz_admin_update_quiz_v2",{
      p_quiz_id:quizId,p_title:$("title").value.trim(),p_course:$("course").value.trim()||null,
      p_duration_seconds:Math.round(Number($("duration").value)*60),p_show_result:$("showResult").value,
      p_shuffle_questions:$("shuffleQuestions").checked,p_shuffle_options:$("shuffleOptions").checked
    });
    if(error){toast(error.message,"error");return} toast("Quiz settings saved."); await load();
  };

  $("newQuestionBtn").onclick=()=>{resetEditor();$("editorPanel").scrollIntoView({behavior:"smooth"})};
  $("cancelEditBtn").onclick=resetEditor;
  $("addOptionBtn").onclick=()=>{
    if(optionCount>=8)return;
    const vals=[...document.querySelectorAll(".opt-text")].map(x=>x.value); const correct=Number(document.querySelector('input[name="correct"]:checked')?.value??0);
    optionCount++; vals.push(""); drawOptions(vals,correct);
  };

  $("saveQuestionBtn").onclick=async()=>{
    const text=$("qText").value.trim(),marks=Number($("qMarks").value)||1;
    const options=[...document.querySelectorAll(".opt-text")].map(x=>x.value.trim());
    const correct=Number(document.querySelector('input[name="correct"]:checked')?.value??-1);
    if(!text||options.length<2||options.some(x=>!x)||correct<0){toast("Complete the question, options and correct answer.","error");return}
    const call=editingQuestionId
      ? client.rpc("quiz_admin_update_question_v2",{p_question_id:editingQuestionId,p_question_text:text,p_marks:marks,p_options:options,p_correct_index:correct})
      : client.rpc("quiz_admin_add_question_v1",{p_quiz_id:quizId,p_question_text:text,p_marks:marks,p_options:options,p_correct_index:correct});
    const {error}=await call; if(error){toast(error.message,"error");return}
    toast(editingQuestionId?"Question updated.":"Question added."); editingQuestionId=null; await load(); resetEditor();
  };

  await load();
})();
