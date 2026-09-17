(function(){
  "use strict";
  const client=(window.CodeBhavyaSupabase||{}).client||null;const $=(id)=>document.getElementById(id);
  const sessionId=new URLSearchParams(location.search).get("session");
  const labels={aptitude:"Aptitude & Reasoning",technical:"Technical Assessment",coding:"Programming Test"};
  function state(name){["fullResultLoading","fullResultSignedOut","fullResultError","fullResultWorkspace"].forEach((id)=>{$(id).hidden=id!==name;});}
  function text(parent,tag,value,className){const element=document.createElement(tag);element.textContent=value;if(className)element.className=className;parent.append(element);return element;}
  function optionText(options,key){if(!key)return"Not answered";if(Array.isArray(options)){const item=options.find((entry,index)=>(entry.key||String.fromCharCode(65+index))===key);return item?.text||item?.label||key;}return options?.[key]||key;}
  function renderAnswers(target,items){
    const list=$(target);list.replaceChildren();
    items.forEach((item,index)=>{
      const card=document.createElement("article");card.className="answer-review"+(item.is_correct?"":" wrong");
      text(card,"h3",(index+1)+". "+item.question_text);
      text(card,"p",(item.is_correct?"Correct":"Needs review")+" · Your answer: "+(item.selected_option||"Not answered")+" ("+optionText(item.options,item.selected_option)+") · Correct answer: "+item.correct_option+" ("+optionText(item.options,item.correct_option)+")");
      const explanation=item.option_explanations?.[item.selected_option]||item.explanation||"Review the governing concept.";text(card,"p",explanation,"answer-option-detail"+(item.is_correct?"":" chosen-wrong"));
      if(!item.is_correct&&item.option_explanations?.[item.correct_option])text(card,"p","Why the correct choice works: "+item.option_explanations[item.correct_option],"answer-option-detail");
      if(item.correction_rule)text(card,"p","Correction rule: "+item.correction_rule,"correction");
      list.append(card);
    });
  }
  function render(report){
    $("fullScore").textContent=report.score+"%";$("fullBand").textContent=report.band;
    $("fullResultSummary").textContent=(report.status==="auto_submitted"?"The assessment was automatically submitted. ":"")+"Review all three sections before choosing your next practice session.";
    const integrity=$("integrityResult").parentElement;const count=Number(report.warning_count)||0;$("integrityResult").textContent=report.integrity_status==="clean"?"Clean":report.integrity_status==="warning"?"Warning recorded":"Auto-submitted";$("integrityDetail").textContent=count+" recorded incident"+(count===1?"":"s");integrity.classList.toggle("warning",report.integrity_status==="warning");integrity.classList.toggle("failed",report.integrity_status==="auto_submitted");
    const scores=$("fullSectionScores");scores.replaceChildren();["aptitude","technical","coding"].forEach((key)=>{const value=Number(report.section_scores?.[key])||0;const card=document.createElement("article");card.className="section-score-card";text(card,"small",labels[key].toUpperCase());text(card,"strong",value+"%");const bar=document.createElement("div");bar.className="mini-bar";const fill=document.createElement("span");fill.style.width=value+"%";bar.append(fill);card.append(bar);scores.append(card);});
    renderAnswers("aptitudeReview",report.aptitude_results||[]);renderAnswers("technicalReview",report.technical_results||[]);
    const coding=$("codingReview");coding.replaceChildren();(report.coding_results||[]).forEach((item)=>{const card=document.createElement("article");card.className="coding-item";text(card,"small","PROBLEM "+item.position);text(card,"h3",item.title);text(card,"p",item.statement);const meta=document.createElement("div");meta.className="coding-result-meta";[item.difficulty,(item.points_awarded||0)+" of "+item.points+" points",item.score+"%"].forEach((value)=>text(meta,"span",value));card.append(meta);const link=document.createElement("a");link.className="mock-secondary";link.href="solve.html?topic="+encodeURIComponent(item.topic)+"&problem="+encodeURIComponent(item.slug);link.textContent="Practise again →";card.append(link);coding.append(card);});
    const actions=$("fullNextActions");actions.replaceChildren();(report.next_actions||[]).forEach((item,index)=>{const link=document.createElement("a");link.className="report-action";link.href=item.href;text(link,"b",String(index+1).padStart(2,"0"));const copy=document.createElement("div");text(copy,"strong",item.title);text(copy,"p",item.action);link.append(copy);text(link,"span","Open →");actions.append(link);});
    state("fullResultWorkspace");
  }
  async function load(){
    state("fullResultLoading");if(!sessionId){$("fullResultErrorMessage").textContent="This result link has no assessment identifier.";state("fullResultError");return;}if(!client){$("fullResultErrorMessage").textContent="Supabase connection is unavailable.";state("fullResultError");return;}
    try{const auth=await client.auth.getUser();if(!auth.data?.user){state("fullResultSignedOut");return;}const result=await client.rpc("get_full_placement_assessment_result",{p_session_id:sessionId});if(result.error)throw result.error;render(result.data);}catch(error){$("fullResultErrorMessage").textContent=error.message||"This result is unavailable.";$("resumeFullLink").href="full-mock-session.html?session="+encodeURIComponent(sessionId);$("resumeFullLink").textContent="Resume assessment";state("fullResultError");}
  }
  $("printFullResult").addEventListener("click",()=>window.print());load();
}());
