(async()=>{
 const {client,$,requireAdmin,esc,toast}=CBQuiz;try{await requireAdmin()}catch{return}
 let rows=[], quizzes=[], editingId=null, optionCount=4;

 function drawOptions(values=[],correctIndex=0){
   optionCount=Math.max(2,Math.min(8,values.length||optionCount||4));
   $("bankOptionEditor").innerHTML=Array.from({length:optionCount},(_,i)=>`<div class="option-editor">
     <input type="radio" name="bankCorrect" value="${i}" ${i===correctIndex?"checked":""}>
     <input class="input bank-opt-text" placeholder="Option ${i+1}" value="${esc(values[i]||"")}">
     ${optionCount>2?`<button class="btn ghost bankRemoveOpt" type="button" data-i="${i}">Remove</button>`:""}
   </div>`).join("");
   document.querySelectorAll(".bankRemoveOpt").forEach(b=>b.onclick=()=>{
     const vals=[...document.querySelectorAll(".bank-opt-text")].map(x=>x.value);
     let correct=Number(document.querySelector('input[name="bankCorrect"]:checked')?.value??0);
     const i=Number(b.dataset.i); vals.splice(i,1); optionCount=vals.length;
     if(correct===i)correct=0;else if(correct>i)correct--;
     drawOptions(vals,correct);
   });
 }

 function resetEditor(){
   editingId=null; optionCount=4;
   $("bankEditorTitle").textContent="New Bank Question";
   $("bankCourse").value=$("filterCourse").value||"";
   $("bankTopic").value=$("filterTopic").value||"";
   $("bankDifficulty").value="Medium"; $("bankMarks").value=1; $("bankNegative").value=0; $("bankTags").value=""; $("bankQuestionText").value="";
   drawOptions(["","","",""],0);
 }

 function openEditor(q=null){
   $("bankEditor").hidden=false;
   if(!q){resetEditor()}
   else{
     editingId=q.id; $("bankEditorTitle").textContent="Edit Bank Question";
     $("bankCourse").value=q.course||""; $("bankTopic").value=q.topic||""; $("bankDifficulty").value=q.difficulty||"Medium";
     $("bankMarks").value=q.marks||1; $("bankNegative").value=q.negative_marks||0; $("bankTags").value=(q.tags||[]).join(", "); $("bankQuestionText").value=q.text||"";
     const ci=Math.max(0,q.options.findIndex(o=>o.is_correct)); optionCount=q.options.length; drawOptions(q.options.map(o=>o.text),ci);
   }
   $("bankEditor").scrollIntoView({behavior:"smooth",block:"start"});
 }

 async function loadQuizzes(){
   const {data,error}=await client.rpc("quiz_admin_list_v1"); if(error)return;
   quizzes=(data||[]).filter(q=>["draft","waiting"].includes(q.status));
   const opts='<option value="">Choose target quiz...</option>'+quizzes.map(q=>`<option value="${esc(q.id)}">${esc(q.title)} · ${esc(q.status)}</option>`).join("");
   $("targetQuiz").innerHTML=opts; $("randomQuiz").innerHTML=opts;
   const qid=new URLSearchParams(location.search).get("quiz"); if(qid){$("targetQuiz").value=qid;$("randomQuiz").value=qid;}
 }

 async function loadBank(){
   const {data,error}=await client.rpc("quiz_bank_list_v6",{
     p_search:$("search").value.trim()||null,
     p_course:$("filterCourse").value.trim()||null,
     p_topic:$("filterTopic").value.trim()||null,
     p_difficulty:$("filterDifficulty").value||null
   });
   if(error){$("bankRows").innerHTML=`<tr><td colspan="7">${esc(error.message)}</td></tr>`;return}
   rows=data||[];
   $("bankRows").innerHTML=rows.map(q=>`<tr>
     <td><input class="bankSelect" type="checkbox" value="${esc(q.id)}"></td>
     <td><strong>${esc(q.text)}</strong><br><span class="muted">${q.options.length} options · ${(q.tags||[]).map(esc).join(", ")}</span></td>
     <td>${esc(q.course||"—")}</td><td>${esc(q.topic||"—")}</td><td><span class="badge">${esc(q.difficulty)}</span></td><td>${q.marks}</td>
     <td><div class="actions compact"><button class="btn ghost bankEdit" data-id="${esc(q.id)}">Edit</button><button class="btn danger bankDelete" data-id="${esc(q.id)}">Delete</button></div></td>
   </tr>`).join("")||'<tr><td colspan="7">No questions found.</td></tr>';

   document.querySelectorAll(".bankEdit").forEach(b=>b.onclick=()=>openEditor(rows.find(x=>x.id===b.dataset.id)));
   document.querySelectorAll(".bankDelete").forEach(b=>b.onclick=async()=>{
     if(!confirm("Delete this question from the Question Bank? Existing quizzes keep their copied question."))return;
     const {error}=await client.rpc("quiz_bank_delete_v6",{p_question_id:b.dataset.id});
     if(error){toast(error.message,"error");return}toast("Question deleted from bank.");await loadBank();
   });
 }

 $("newBankQuestion").onclick=()=>openEditor();
 $("closeBankEditor").onclick=()=>{$("bankEditor").hidden=true};
 $("bankAddOption").onclick=()=>{if(optionCount<8){const vals=[...document.querySelectorAll(".bank-opt-text")].map(x=>x.value);const c=Number(document.querySelector('input[name="bankCorrect"]:checked')?.value??0);optionCount++;vals.push("");drawOptions(vals,c)}};

 $("saveBankQuestion").onclick=async()=>{
   const options=[...document.querySelectorAll(".bank-opt-text")].map(x=>x.value.trim());
   const correct=Number(document.querySelector('input[name="bankCorrect"]:checked')?.value??-1);
   const text=$("bankQuestionText").value.trim();
   if(!text||options.some(x=>!x)||correct<0){toast("Complete question, options and correct answer.","error");return}
   const tags=$("bankTags").value.split(",").map(x=>x.trim()).filter(Boolean);
   const {error}=await client.rpc("quiz_bank_save_v7",{
     p_question_id:editingId,p_course:$("bankCourse").value.trim()||null,p_topic:$("bankTopic").value.trim()||null,
     p_difficulty:$("bankDifficulty").value,p_question_text:text,p_marks:Number($("bankMarks").value)||1,p_negative_marks:Math.max(0,Number($("bankNegative").value)||0),
     p_tags:tags,p_options:options,p_correct_index:correct
   });
   if(error){toast(error.message,"error");return}
   toast(editingId?"Bank question updated.":"Question added to bank."); $("bankEditor").hidden=true; await loadBank();
 };

 $("applyFilters").onclick=loadBank;
 $("clearFilters").onclick=()=>{$("search").value="";$("filterCourse").value="";$("filterTopic").value="";$("filterDifficulty").value="";loadBank()};
 $("selectAll").onchange=e=>document.querySelectorAll(".bankSelect").forEach(x=>x.checked=e.target.checked);

 $("addSelectedBtn").onclick=async()=>{
   const ids=[...document.querySelectorAll(".bankSelect:checked")].map(x=>x.value), quiz=$("targetQuiz").value;
   if(!quiz){toast("Choose a target quiz.","error");return}
   if(!ids.length){toast("Select at least one bank question.","error");return}
   const {data,error}=await client.rpc("quiz_admin_add_bank_questions_v6",{p_quiz_id:quiz,p_bank_question_ids:ids});
   if(error){toast(error.message,"error");return}
   toast(`${data.added} question${data.added===1?"":"s"} added to quiz.`);
 };

 $("randomAddBtn").onclick=async()=>{
   const quiz=$("randomQuiz").value,count=Math.max(1,Math.min(100,Number($("randomCount").value)||10));
   if(!quiz){toast("Choose a target quiz.","error");return}
   const {data,error}=await client.rpc("quiz_admin_add_random_bank_v6",{
     p_quiz_id:quiz,p_count:count,p_course:$("randomCourse").value.trim()||null,p_topic:$("randomTopic").value.trim()||null,
     p_difficulty:$("randomDifficulty").value||null
   });
   if(error){toast(error.message,"error");return}
   toast(`${data.added} random question${data.added===1?"":"s"} added.`);
 };

 $("templateBtn").onclick=()=>{
   const csv=[
     ["question","option_a","option_b","option_c","option_d","correct_answer","marks","negative_marks","course","topic","difficulty","tags"],
     ["Which operator gives remainder in C?","/","%","+","*","B","1","0.25","C Programming","Operators","Easy","arithmetic,operators"]
   ];
   const text=csv.map(r=>r.map(v=>`"${String(v).replaceAll('"','""')}"`).join(",")).join("\n");
   const blob=new Blob([text],{type:"text/csv;charset=utf-8"}),a=document.createElement("a");
   a.href=URL.createObjectURL(blob);a.download="CodeBhavya-Question-Bank-Template.csv";a.click();URL.revokeObjectURL(a.href);
 };

 $("importBtn").onclick=async()=>{
   const file=$("importFile").files[0]; if(!file){toast("Choose a CSV or Excel file.","error");return}
   $("importStatus").innerHTML='<div class="notice">Reading file…</div>';
   try{
     const buf=await file.arrayBuffer(),wb=XLSX.read(buf,{type:"array"}),sheet=wb.Sheets[wb.SheetNames[0]];
     const raw=XLSX.utils.sheet_to_json(sheet,{defval:""});
     const normalized=raw.map((r,i)=>{
       const lower={};Object.keys(r).forEach(k=>lower[String(k).trim().toLowerCase()]=r[k]);
       const correct=String(lower.correct_answer||"").trim().toUpperCase();
       const ci={A:0,B:1,C:2,D:3,"1":0,"2":1,"3":2,"4":3}[correct];
       if(ci===undefined)throw new Error(`Row ${i+2}: correct_answer must be A, B, C, D, 1, 2, 3 or 4.`);
       return {
         question:String(lower.question||"").trim(),
         options:[lower.option_a,lower.option_b,lower.option_c,lower.option_d].map(x=>String(x||"").trim()),
         correct_index:ci,marks:Number(lower.marks||1),negative_marks:Math.max(0,Number(lower.negative_marks||0)),
         course:String(lower.course||"").trim()||null,topic:String(lower.topic||"").trim()||null,
         difficulty:String(lower.difficulty||"Medium").trim(),tags:String(lower.tags||"").split(",").map(x=>x.trim()).filter(Boolean)
       };
     });
     if(!normalized.length)throw new Error("No data rows found.");
     if(normalized.some((r,i)=>!r.question||r.options.some(x=>!x)))throw new Error("Every row needs a question and four options.");
     const {data,error}=await client.rpc("quiz_bank_bulk_import_v6",{p_rows:normalized});
     if(error)throw error;
     $("importStatus").innerHTML=`<div class="notice">${data.imported} questions imported successfully.</div>`;
     await loadBank();
   }catch(e){$("importStatus").innerHTML=`<div class="notice bad">${esc(e.message)}</div>`}
 };

 drawOptions(["","","",""],0);
 await Promise.all([loadQuizzes(),loadBank()]);
})();