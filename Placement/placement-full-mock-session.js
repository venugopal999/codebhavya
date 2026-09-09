(function(){
  "use strict";
  const client=(window.CodeBhavyaSupabase||{}).client||null;const $=(id)=>document.getElementById(id);
  const globalHeader=document.querySelector(".top-header");
  if(globalHeader){globalHeader.hidden=true;globalHeader.style.setProperty("display","none","important");}
  document.body.style.setProperty("padding-top","0","important");
  const sessionId=new URLSearchParams(location.search).get("session");
  const labels={aptitude:"Aptitude & Reasoning",technical:"Technical Assessment",coding:"Programming Test"};
  const durations={aptitude:"20 minutes",technical:"20 minutes",coding:"50 minutes"};
  let assessment=null,index=0,answers={},reviewed={},timer=null,integrityArmed=false,reportingIncident=false,lastIncidentAt=0,codingIndex=0;
  function state(name){["assessmentLoading","assessmentSignedOut","assessmentError","secureStart","assessmentWorkspace"].forEach((id)=>{$(id).hidden=id!==name;});}
  function text(parent,tag,value,className){const element=document.createElement(tag);element.textContent=value;if(className)element.className=className;parent.append(element);return element;}
  function button(label,className,handler){const element=document.createElement("button");element.type="button";element.textContent=label;element.className=className;element.addEventListener("click",handler);return element;}
  function section(key){return(assessment?.sections||[]).find((item)=>item.section_key===key);}
  function storageKey(suffix){return"codebhavya-full-"+sessionId+"-"+suffix;}
  function readLocal(key,fallback){try{return JSON.parse(localStorage.getItem(storageKey(key)))??fallback;}catch(_error){return fallback;}}
  function writeLocal(key,value){localStorage.setItem(storageKey(key),JSON.stringify(value));}
  function normalizeOptions(value){if(Array.isArray(value))return value.map((item,i)=>typeof item==="object"?{key:item.key||String.fromCharCode(65+i),text:item.text||item.label||String(item.value||"")}:{key:String.fromCharCode(65+i),text:String(item)});if(value&&typeof value==="object")return Object.entries(value).map(([key,item])=>({key,text:typeof item==="object"?(item.text||item.label||String(item.value||"")):String(item)}));return[];}
  function setError(message){$("assessmentActionError").textContent=message||"";}
  function ask(message){const wasArmed=integrityArmed;integrityArmed=false;const accepted=window.confirm(message);integrityArmed=wasArmed;return accepted;}
  function clearClock(){if(timer)clearInterval(timer);timer=null;}
  function renderRail(){
    const rail=$("sectionRail");rail.replaceChildren();
    (assessment.sections||[]).forEach((item)=>{const tab=document.createElement("div");tab.className="round-tab "+item.status+(assessment.current_section===item.section_key?" active":"");text(tab,"b",item.status==="completed"?"✓":String(item.position).padStart(2,"0"),"round-step");const copy=document.createElement("span");text(copy,"strong",labels[item.section_key]);text(copy,"small",item.status==="completed"?item.score+"% complete":item.status==="active"?"In progress":"Locked");tab.append(copy);rail.append(tab);});
  }
  function startClock(item){
    clearClock();const end=new Date(item.expires_at).getTime();
    function draw(){const remaining=Math.max(0,Math.floor((end-Date.now())/1000));$("sectionClock").textContent=String(Math.floor(remaining/60)).padStart(2,"0")+":"+String(remaining%60).padStart(2,"0");if(remaining<=0){clearClock();if(assessment.current_section==="coding")syncCoding(true,true);else submitCurrent(true);}}
    draw();timer=setInterval(draw,1000);
  }
  function renderMcq(item){
    const questions=item.questions||[];answers=readLocal("answers-"+item.section_key,{});reviewed=readLocal("review-"+item.section_key,{});
    index=Math.max(0,Math.min(index,questions.length-1));const question=questions[index];const content=$("assessmentContent");content.replaceChildren();
    const shell=document.createElement("div");shell.className="full-assessment-shell";const side=document.createElement("aside");side.className="full-question-side";text(side,"strong",labels[item.section_key]+" questions");
    const palette=document.createElement("div");palette.className="question-palette";questions.forEach((entry,i)=>{const b=button(String(i+1),(answers[entry.id]?"answered ":"")+(reviewed[entry.id]?"review ":"")+(i===index?"current":""),()=>{index=i;renderMcq(item);});palette.append(b);});side.append(palette);text(side,"p","Green: answered · Gold: marked for review. Answers remain hidden until the complete assessment is submitted.");
    const main=document.createElement("article");main.className="full-question-main";const status=document.createElement("div");status.className="assessment-status";text(status,"span","QUESTION "+(index+1)+" OF "+questions.length+" · "+(question.subtopic||question.topic_group||"Mixed"));text(status,"strong",question.difficulty||"balanced");main.append(status);text(main,"h2",question.question_text);
    const options=document.createElement("div");options.className="option-list full-options";normalizeOptions(question.options).forEach((option)=>{const label=document.createElement("label");label.className="option-choice";const input=document.createElement("input");input.type="radio";input.name="fullAnswer";input.value=option.key;input.checked=answers[question.id]===option.key;input.addEventListener("change",()=>{answers[question.id]=option.key;writeLocal("answers-"+item.section_key,answers);renderMcq(item);});label.append(input);text(label,"b",option.key);text(label,"span",option.text);options.append(label);});main.append(options);
    const reviewAction=document.createElement("div");reviewAction.className="question-review-action";reviewAction.append(button(reviewed[question.id]?"Remove review mark":"Mark for review","",()=>{reviewed[question.id]=!reviewed[question.id];writeLocal("review-"+item.section_key,reviewed);renderMcq(item);}));main.append(reviewAction);
    const controls=document.createElement("div");controls.className="question-controls";const previous=button("← Previous","mock-secondary",()=>{if(index>0){index--;renderMcq(item);}});previous.disabled=index===0;const next=button(index===questions.length-1?"Submit section":"Save & next →","mock-primary",()=>{if(index<questions.length-1){index++;renderMcq(item);}else submitCurrent(false);});controls.append(previous,next);main.append(controls);shell.append(side,main);content.append(shell);startClock(item);
  }
  function codingUrl(item){return"solve.html?topic="+encodeURIComponent(item.topic)+"&problem="+encodeURIComponent(item.slug)+"&fullmock="+encodeURIComponent(sessionId);}
  function attachFrameIntegrity(frame){frame.addEventListener("load",()=>{try{const style=frame.contentDocument.createElement("style");style.textContent=".top-header,footer,.placement-global-footer{display:none!important}body{padding-top:0!important}";frame.contentDocument.head.append(style);["copy","cut","paste"].forEach((type)=>frame.contentDocument.addEventListener(type,(event)=>{event.preventDefault();recordIncident(type+"_attempt","Clipboard "+type+" was blocked inside the coding workspace.");},true));frame.contentDocument.addEventListener("contextmenu",(event)=>event.preventDefault(),true);}catch(_error){/* Same-origin assessment pages are expected. */}});}
  function renderCoding(item){
    answers={};const problems=assessment.coding_items||[];codingIndex=Math.max(0,Math.min(codingIndex,problems.length-1));const problem=problems[codingIndex];const content=$("assessmentContent");content.replaceChildren();const wrap=document.createElement("div");wrap.className="coding-assessment";
    const header=document.createElement("header");header.className="coding-assessment-header";const copy=document.createElement("div");text(copy,"small","PROGRAMMING TEST","mock-eyebrow");text(copy,"h2","Solve two judged problems");text(copy,"p","Use Run and Submit inside the coding workspace. Answers and hidden-case outcomes remain part of the final result.");header.append(copy);const tabs=document.createElement("div");tabs.className="coding-tabs";problems.forEach((entry,i)=>tabs.append(button("Problem "+entry.position+(entry.submission_id?" ✓":""),i===codingIndex?"active":"",()=>{codingIndex=i;renderCoding(item);})));header.append(tabs);wrap.append(header);
    const frame=document.createElement("iframe");frame.className="coding-frame";frame.src=codingUrl(problem);frame.title="Coding problem "+problem.position+": "+problem.title;frame.setAttribute("allow","clipboard-read 'none'; clipboard-write 'none'");attachFrameIntegrity(frame);wrap.append(frame);
    const sync=document.createElement("div");sync.className="coding-sync-bar";text(sync,"p","After submitting a solution, synchronize to record its best score.");const actions=document.createElement("div");actions.className="coding-sync-actions";actions.append(button("Synchronize solutions","mock-secondary",()=>syncCoding(false)),button("Finish assessment","mock-primary",()=>syncCoding(true)));sync.append(actions);wrap.append(sync);content.append(wrap);startClock(item);
  }
  function render(){
    renderRail();$("warningCount").textContent=Math.min(Number(assessment.warning_count)||0,2)+" / 2";$("assessmentTitle").textContent=labels[assessment.current_section]||"Assessment submitted";$("assessmentMeta").textContent="Answers and explanations unlock only after all three sections.";
    const item=section(assessment.current_section);if(!item)return;if(["aptitude","technical"].includes(item.section_key))renderMcq(item);else renderCoding(item);
  }
  async function submitCurrent(timedOut){
    const key=assessment.current_section;if(!["aptitude","technical"].includes(key))return;const item=section(key);const total=(item.questions||[]).length,answered=Object.keys(answers).length;
    if(!timedOut&&answered<total&&!ask((total-answered)+" questions are unanswered and will receive zero. Submit this section?"))return;
    clearClock();setError("");
    try{const result=await client.rpc("submit_full_placement_mcq",{p_session_id:sessionId,p_section_key:key,p_answers:answers,p_timed_out:Boolean(timedOut)});if(result.error)throw result.error;localStorage.removeItem(storageKey("answers-"+key));localStorage.removeItem(storageKey("review-"+key));index=0;await load(false);}catch(error){setError(error.message||"The section could not be submitted.");startClock(item);}
  }
  async function syncCoding(finish,automatic=false){
    if(finish&&!automatic&&!ask("Finish the full assessment? Any problem without a submitted solution receives zero."))return;clearClock();setError("");
    try{const result=await client.rpc("sync_full_placement_coding",{p_session_id:sessionId,p_finish:Boolean(finish)});if(result.error)throw result.error;if(finish){const completed=await client.rpc("finalize_full_placement_assessment",{p_session_id:sessionId,p_reason:"completed"});if(completed.error)throw completed.error;integrityArmed=false;if(document.fullscreenElement)await document.exitFullscreen().catch(()=>{});location.href="full-mock-result.html?session="+encodeURIComponent(sessionId);return;}await load(false);}catch(error){setError(error.message||"Coding results could not be synchronized.");startClock(section("coding"));}
  }
  async function autoSubmit(){
    integrityArmed=false;clearClock();$("integrityTitle").textContent="Assessment submitted";$("integrityMessage").textContent="The third integrity incident ended the assessment.";$("integrityStatus").textContent="Opening your result dashboard…";$("returnSecureMode").hidden=true;
    try{
      const key=assessment.current_section;if(["aptitude","technical"].includes(key))await client.rpc("submit_full_placement_mcq",{p_session_id:sessionId,p_section_key:key,p_answers:answers,p_timed_out:true});
      else await client.rpc("sync_full_placement_coding",{p_session_id:sessionId,p_finish:false});
      await client.rpc("finalize_full_placement_assessment",{p_session_id:sessionId,p_reason:"integrity"});
    }finally{location.href="full-mock-result.html?session="+encodeURIComponent(sessionId);}
  }
  async function recordIncident(type,message){
    const now=Date.now();if(!integrityArmed||reportingIncident||now-lastIncidentAt<1600)return;lastIncidentAt=now;reportingIncident=true;
    try{const result=await client.rpc("record_full_assessment_incident",{p_session_id:sessionId,p_event_type:type,p_details:{message:message,section:assessment.current_section}});if(result.error)throw result.error;assessment.warning_count=result.data.warning_count;$("warningCount").textContent=Math.min(result.data.warning_count,2)+" / 2";$("integrityModal").hidden=false;$("integrityMessage").textContent=message;$("integrityStatus").textContent=result.data.warning_count>=3?"Third incident: submitting now.":"Warning "+result.data.warning_count+" of 2. Another "+(3-result.data.warning_count)+" incident"+(3-result.data.warning_count===1?"":"s")+" will submit the assessment.";if(result.data.warning_count>=3)await autoSubmit();}catch(error){setError(error.message||"Integrity event could not be recorded.");}finally{reportingIncident=false;}
  }
  async function enterSecureMode(){
    $("secureStartError").textContent="";
    try{
      if(!document.fullscreenElement)await document.documentElement.requestFullscreen();
      if(assessment.status==="ready"){const result=await client.rpc("begin_full_placement_assessment",{p_session_id:sessionId});if(result.error)throw result.error;}
      await load(false);setTimeout(()=>{integrityArmed=true;},1200);
    }catch(error){$("secureStartError").textContent="Full-screen permission is required to start. Allow it in your browser and try again.";}
  }
  async function resumeSecureMode(){try{if(!document.fullscreenElement)await document.documentElement.requestFullscreen();$("integrityModal").hidden=true;setTimeout(()=>{integrityArmed=true;},800);}catch(_error){$("integrityStatus").textContent="Allow full-screen to continue the assessment.";}}
  async function load(showLoading=true){
    if(showLoading)state("assessmentLoading");if(!sessionId){$("assessmentErrorMessage").textContent="This assessment link has no session identifier.";state("assessmentError");return;}if(!client){$("assessmentErrorMessage").textContent="Supabase connection is unavailable.";state("assessmentError");return;}
    try{const auth=await client.auth.getUser();if(!auth.data?.user){state("assessmentSignedOut");return;}const result=await client.rpc("get_full_placement_assessment",{p_session_id:sessionId});if(result.error)throw result.error;assessment=result.data;if(["completed","auto_submitted"].includes(assessment.status)){location.href="full-mock-result.html?session="+encodeURIComponent(sessionId);return;}if(assessment.status==="ready"||!document.fullscreenElement){state("secureStart");$("enterSecureMode").textContent=assessment.status==="ready"?"Enter Full-Screen & Start":"Return to Full-Screen & Resume";return;}state("assessmentWorkspace");render();}catch(error){$("assessmentErrorMessage").textContent=error.message||"This assessment could not be restored.";state("assessmentError");}
  }
  document.addEventListener("visibilitychange",()=>{if(document.hidden)recordIncident("tab_hidden","The assessment tab was hidden or another tab was opened.");});
  document.addEventListener("fullscreenchange",()=>{if(integrityArmed&&!document.fullscreenElement){recordIncident("fullscreen_exit","Full-screen assessment mode was exited.");integrityArmed=false;}});
  window.addEventListener("blur",()=>recordIncident("window_blur","The assessment window lost focus."));
  ["copy","cut","paste"].forEach((type)=>document.addEventListener(type,(event)=>{if(!integrityArmed)return;event.preventDefault();recordIncident(type+"_attempt","Clipboard "+type+" was blocked during the assessment.");},true));
  document.addEventListener("contextmenu",(event)=>{if(integrityArmed)event.preventDefault();},true);
  window.addEventListener("beforeunload",(event)=>{if(integrityArmed){event.preventDefault();event.returnValue="";}});
  $("enterSecureMode").addEventListener("click",enterSecureMode);$("returnSecureMode").addEventListener("click",resumeSecureMode);load();
}());
