(function(){
"use strict";
const cloud=window.CodeBhavyaSupabase||{};
const client=cloud.client||null;
const HISTORY_KEY="codebhavya-placement-mcq-history-v2";
const topicLabels={c:"C",python:"Python",dsa:"DSA",database:"Database","core-cs":"Core CS",aptitude:"Aptitude","ai-ml":"AI & ML"};
const targetText={
 general:"Balanced fundamentals used in general campus placement screening.",
 service:"Output tracing, debugging, syntax, functions and dependable fundamentals.",
 product:"Memory, edge cases, complexity, undefined behaviour and deeper reasoning.",
 ai:"Data-processing, numeric correctness, memory safety and systems-oriented C questions."
};
const targetLabels={general:"General",service:"Service-based",product:"Product-based",ai:"AI / ML / Data"};
let topic="c",user=null,availableIds=[],session=null,questions=[],answers={},current=0,timeLeft=0,timer=null,startedAt=0,submitting=false;
const $=id=>document.getElementById(id);

function readHistory(){try{return JSON.parse(localStorage.getItem(HISTORY_KEY)||"[]")}catch(e){return[]}}
function writeHistory(results){const old=readHistory();const rows=results.map(r=>({question_id:r.question_id,topic,is_correct:r.is_correct,attempted_at:new Date().toISOString()}));try{localStorage.setItem(HISTORY_KEY,JSON.stringify(rows.concat(old).slice(0,2000)))}catch(e){return}}
function normalizeOptions(value){if(Array.isArray(value)){return value.map((v,i)=>typeof v==="object"?{key:String(v.key||String.fromCharCode(65+i)),text:String(v.text||"")}:{key:String.fromCharCode(65+i),text:String(v)})}return Object.keys(value||{}).sort().map(key=>({key,text:String(value[key])}))}
function setMessage(text){$("setupMessage").textContent=text||""}
function setLoading(on){$("examLoading").hidden=!on;$("examEmpty").hidden=on||Boolean(session);$("examActive").hidden=on||!session;$("startQuiz").disabled=on}
function params(){return{target:$("quizTarget").value,difficulty:$("quizDifficulty").value,count:Number($("quizCount").value)}}

async function refreshAvailability(){
 const p=params();$("targetHelp").textContent=targetText[p.target];setMessage("");
 if(!client){$("quizAvailability").textContent="Database connection is unavailable.";$("quizAvailability").dataset.state="limited";$("startQuiz").disabled=true;return}
 try{
  let q=client.from("mcq_questions").select("id").eq("is_published",true).eq("topic",topic).eq("target_path",p.target);
  if(p.difficulty!=="all")q=q.eq("difficulty",p.difficulty);
  const result=await q.limit(1000);if(result.error)throw result.error;
  const solved=new Set(readHistory().filter(x=>x.topic===topic&&x.is_correct).map(x=>String(x.question_id)));
  if(user){const h=await client.from("mcq_attempts").select("question_id").eq("user_id",user.id).eq("topic",topic).eq("is_correct",true).limit(2000);if(!h.error)(h.data||[]).forEach(x=>solved.add(String(x.question_id)))}
  availableIds=(result.data||[]).map(x=>String(x.id)).filter(id=>!solved.has(id));
  const count=availableIds.length;$("quizAvailability").textContent=count+" unseen questions match this exact combination.";$("quizAvailability").dataset.state=count>=5?"ready":"limited";
  [...$("quizCount").options].forEach(o=>{o.disabled=Number(o.value)>count});
  const selected=$("quizCount").selectedOptions[0];if(selected&&selected.disabled){const allowed=[...$("quizCount").options].filter(o=>!o.disabled).pop();if(allowed)$("quizCount").value=allowed.value}
  $("startQuiz").disabled=count<5;
 }catch(error){availableIds=[];$("quizAvailability").textContent="Run placement-v2-schema.sql and the C question seed first.";$("quizAvailability").dataset.state="limited";$("startQuiz").disabled=true}
}

function renderPalette(){const box=$("questionPalette");box.replaceChildren();questions.forEach((q,i)=>{const b=document.createElement("button");b.type="button";b.textContent=String(i+1);b.classList.toggle("is-current",i===current);b.classList.toggle("is-answered",Boolean(answers[q.id]));b.setAttribute("aria-label","Question "+(i+1)+(answers[q.id]?", answered":""));b.addEventListener("click",()=>{current=i;renderQuestion()});box.append(b)})}
function updateCounts(){const count=questions.filter(q=>answers[q.id]).length;$("answeredCount").textContent=String(count);$("unansweredCount").textContent=String(questions.length-count)}
function renderQuestion(){
 const q=questions[current];if(!q)return;
 $("examProgress").textContent="QUESTION "+(current+1)+" OF "+questions.length;$("examProgressFill").style.width=((current+1)/questions.length*100)+"%";
 $("questionSubtopic").textContent=q.subtopic;$("questionDifficulty").textContent=q.difficulty;$("questionText").textContent=q.question_text;
 const box=$("questionOptions");box.replaceChildren();normalizeOptions(q.options).forEach(opt=>{const label=document.createElement("label");label.className="exam-option";const radio=document.createElement("input");radio.type="radio";radio.name="examAnswer";radio.value=opt.key;radio.checked=answers[q.id]===opt.key;const text=document.createElement("span");const key=document.createElement("b");key.textContent=opt.key;const content=document.createTextNode(opt.text);text.append(key,content);label.append(radio,text);box.append(label)});
 $("savedIndicator").textContent=answers[q.id]?"Answer saved. You can change it before submission.":"Select one answer. It will not be graded until submission.";$("savedIndicator").classList.toggle("is-saved",Boolean(answers[q.id]));
 $("previousQuestion").disabled=current===0;$("nextQuestion").textContent=current===questions.length-1?"Finish & Review":"Save & Next →";
 renderPalette();updateCounts();$("questionText").setAttribute("tabindex","-1");$("questionText").focus({preventScroll:true});
}
function formatTime(seconds){return String(Math.floor(seconds/60)).padStart(2,"0")+":"+String(seconds%60).padStart(2,"0")}
function updateTimer(){timeLeft=Math.max(0,timeLeft);$("examTimer").textContent=formatTime(timeLeft);$("examClock").classList.toggle("is-urgent",timeLeft<=60);if(timeLeft===0){clearInterval(timer);timer=null;submitQuiz(true)}}
function beginTimer(){clearInterval(timer);updateTimer();timer=setInterval(()=>{timeLeft--;updateTimer()},1000)}

async function startQuiz(event){
 event.preventDefault();if(!client)return;const p=params();if(availableIds.length<p.count){setMessage("This exact combination does not have "+p.count+" unseen questions. Refresh the availability or choose a smaller count.");return}
 setLoading(true);setMessage("");
 try{
  const excluded=readHistory().filter(x=>x.topic===topic&&x.is_correct).map(x=>String(x.question_id||"")).filter(id=>/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id));
  const response=await client.rpc("start_mcq_session",{p_topic:topic,p_target:p.target,p_difficulty:p.difficulty,p_count:p.count,p_exclude_ids:excluded});if(response.error)throw response.error;
  session=response.data;questions=(session.questions||[]).sort((a,b)=>a.position-b.position);if(questions.length!==p.count)throw new Error("The server did not return the exact requested count.");
  answers={};current=0;timeLeft=Number(session.total_seconds)||p.count*60;startedAt=Date.now();$("examEmpty").hidden=true;$("examResults").hidden=true;$("examActive").hidden=false;setLoading(false);renderQuestion();beginTimer();
 }catch(error){session=null;setLoading(false);$("examEmpty").hidden=false;setMessage(error.message||"The exact quiz could not be created.")}
}
function openSubmit(){const answered=questions.filter(q=>answers[q.id]).length;$("submitDialogText").textContent="You answered "+answered+" of "+questions.length+" questions. "+(answered<questions.length?(questions.length-answered)+" unanswered questions will be marked incorrect.":"All questions are answered.");$("submitDialog").showModal()}

function renderResults(data){
 const total=Number(data.total)||questions.length,score=Number(data.score)||0,percent=total?Math.round(score/total*100):0,used=Math.max(0,Math.round((Date.now()-startedAt)/1000));
 $("resultBadge").textContent=percent+"%";$("resultScore").textContent=score+"/"+total;$("resultTime").textContent=formatTime(used);$("resultAnswered").textContent=String(Object.keys(answers).length);$("resultTarget").textContent=targetLabels[$("quizTarget").value];$("resultsSummary").textContent="You answered "+score+" of "+total+" questions correctly. Review every decision below.";
 const review=$("resultReview");review.replaceChildren();(data.results||[]).forEach((r,index)=>{const card=document.createElement("article");card.className="review-card"+(r.is_correct?"":" is-wrong");const h=document.createElement("h3");h.textContent=(index+1)+". "+r.question_text;const state=document.createElement("p");const stateStrong=document.createElement("strong");stateStrong.textContent=r.is_correct?"Correct":"Needs review";state.append(stateStrong,document.createTextNode(" · Your answer: "+(r.selected_option||"Not answered")+" · Correct answer: "+r.correct_option));const exp=document.createElement("p");exp.textContent=r.explanation;const opts=document.createElement("div");opts.className="review-options";normalizeOptions(r.options).forEach(opt=>{const p=document.createElement("p");if(opt.key===r.correct_option)p.classList.add("is-correct");if(!r.is_correct&&opt.key===r.selected_option)p.classList.add("is-selected-wrong");p.textContent=opt.key+". "+opt.text+" — "+(r.option_explanations?.[opt.key]||"");opts.append(p)});const rule=document.createElement("p");rule.className="correction-rule";rule.textContent="Correction rule: "+r.correction_rule;card.append(h,state,exp,opts,rule);review.append(card)});
 $("examActive").hidden=true;$("examResults").hidden=false;$("examResults").scrollIntoView({behavior:"smooth",block:"start"});writeHistory(data.results||[]);refreshAvailability();
}
async function submitQuiz(timedOut){
 if(submitting||!session)return;submitting=true;clearInterval(timer);timer=null;$("reviewSubmit").disabled=true;
 try{const response=await client.rpc("submit_mcq_session",{p_session_id:session.session_id,p_access_token:session.access_token,p_answers:answers});if(response.error)throw response.error;renderResults(response.data)}catch(error){setMessage(error.message||"Submission failed. Your answers remain available; please try again.");$("reviewSubmit").disabled=false;if(!timedOut)beginTimer()}finally{submitting=false}
}
async function initialize(){
 const requested=new URLSearchParams(location.search).get("topic")||"c";topic=topicLabels[requested]?requested:"c";const label=topicLabels[topic];$("builderTitle").textContent=label+" Placement Quiz";$("topicCrumb").textContent=label+" Quiz";document.title=label+" Placement Quiz | CodeBhavya";
 if(client){const auth=await client.auth.getUser();user=auth.data?.user||null;client.auth.onAuthStateChange((_event,sessionValue)=>{user=sessionValue?.user||null;refreshAvailability()})}refreshAvailability();$("quizSetupForm").addEventListener("submit",startQuiz);$("quizTarget").addEventListener("change",refreshAvailability);$("quizDifficulty").addEventListener("change",refreshAvailability);
 $("answerForm").addEventListener("change",e=>{if(e.target.name!=="examAnswer")return;answers[questions[current].id]=e.target.value;renderQuestion()});$("clearAnswer").addEventListener("click",()=>{delete answers[questions[current].id];renderQuestion()});$("previousQuestion").addEventListener("click",()=>{if(current>0){current--;renderQuestion()}});$("nextQuestion").addEventListener("click",()=>{if(current<questions.length-1){current++;renderQuestion()}else openSubmit()});$("reviewSubmit").addEventListener("click",openSubmit);$("submitDialog").addEventListener("close",()=>{if($("submitDialog").returnValue==="confirm")submitQuiz(false)});$("newQuiz").addEventListener("click",()=>{session=null;questions=[];answers={};$("examResults").hidden=true;$("examEmpty").hidden=false;refreshAvailability();$("examBuilder").scrollIntoView({behavior:"smooth"})});
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",initialize);else initialize();
}());
