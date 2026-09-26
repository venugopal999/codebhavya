"use strict";

/* =========================================================
   CodeBhavya Full Stack MERN — Lesson Engine V4
   Detailed / beginner-first / dark-theme compatible
   Supports both the new `sections` lessons and legacy
   `concepts` lessons used by Levels 1–6.
   ========================================================= */

const STORAGE_KEY = "codebhavya.fullstack.progress.v1";
const levels = window.FULLSTACK_LEVELS || [];
const lessons = window.FULLSTACK_LESSONS || {};
const params = new URLSearchParams(location.search);
const levelNumber = Math.max(1, Math.min(30, Number(params.get("level")) || 1));
const lesson = lessons[levelNumber] || null;
let traceIndex = 0;
let traceTimer = null;

const esc = value => String(value ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[c]));
const rich = value => esc(value).replace(/&lt;strong&gt;/gi,"<strong>").replace(/&lt;\/strong&gt;/gi,"</strong>").replace(/&lt;em&gt;/gi,"<em>").replace(/&lt;\/em&gt;/gi,"</em>").replace(/&lt;code&gt;/gi,"<code>").replace(/&lt;\/code&gt;/gi,"</code>");
const arr = value => Array.isArray(value) ? value : [];
const asText = value => typeof value === "string" ? value : (value?.text || value?.description || value?.meaning || "");

function progressGet(){try{const x=JSON.parse(localStorage.getItem(STORAGE_KEY)||"[]");return Array.isArray(x)?x:[]}catch{return[]}}
function progressSet(x){localStorage.setItem(STORAGE_KEY,JSON.stringify(x))}
function showToast(message){const t=document.getElementById("toast");if(!t)return;t.textContent=message;t.classList.add("show");clearTimeout(showToast.timer);showToast.timer=setTimeout(()=>t.classList.remove("show"),1600)}

function renderSidebar(){
  const nav=document.getElementById("levelNav"); if(!nav)return;
  nav.innerHTML=levels.map(l=>{const n=Number(l.n),ok=l.available!==false;return `<a class="${n===levelNumber?"active":""} ${ok?"":"locked"}" href="${ok?`lesson.html?level=${n}`:"#"}" ${ok?"":'aria-disabled="true"'}><b>${String(n).padStart(2,"0")}</b><span>${esc(l.title||`Level ${n}`)}</span>${ok?"":"<small>planned</small>"}</a>`}).join("");
}

function renderCode(code,label="WORKED EXAMPLE"){
  if(!code)return "";
  return `<div class="code-box premium-code-box"><header><span>${esc(label)}</span><button type="button" data-copy="${esc(code)}">Copy</button></header><pre><code>${esc(code)}</code></pre></div>`;
}
function renderPoints(items){return arr(items).length?`<ul class="content-points">${arr(items).map(x=>`<li>${rich(asText(x))}</li>`).join("")}</ul>`:""}
function renderKeyIdea(x){return x?`<div class="key-idea"><span>💡</span><div><strong>Key Idea</strong><p>${rich(x)}</p></div></div>`:""}
function renderWarning(x){return x?`<div class="warning-box"><span>⚠️</span><div><strong>Important</strong><p>${rich(x)}</p></div></div>`:""}
function renderMistake(x){return x?`<div class="mistake-box"><span>❌</span><div><strong>Common Mistake</strong><p>${rich(x)}</p></div></div>`:""}

function renderSimpleList(title,items,cls="info-list"){
  if(!arr(items).length)return "";
  return `<div class="${cls}">${title?`<h3>${esc(title)}</h3>`:""}<ul>${arr(items).map(x=>`<li>${rich(asText(x))}</li>`).join("")}</ul></div>`;
}

function renderFlow(flow,title="Step-by-Step Flow"){
  if(!arr(flow).length)return "";
  return `<div class="learning-flow"><h3>${esc(title)}</h3><div class="flow-track">${arr(flow).map((x,i)=>{const name=typeof x==="string"?x:(x.name||x.title||"");const detail=typeof x==="string"?"":(x.detail||x.description||"");return `<div class="flow-item"><div class="flow-number">${String(i+1).padStart(2,"0")}</div><div class="flow-content"><strong>${rich(name)}</strong>${detail?`<span>${rich(detail)}</span>`:""}</div></div>${i<flow.length-1?'<div class="flow-arrow">↓</div>':""}`}).join("")}</div></div>`;
}

function renderComparison(data){
  if(!arr(data).length)return "";
  let rows=data;
  if(data.headers&&data.rows){return `<div class="comparison-table"><table><thead><tr>${arr(data.headers).map(h=>`<th>${rich(h)}</th>`).join("")}</tr></thead><tbody>${arr(data.rows).map(r=>`<tr>${arr(r).map(c=>`<td>${rich(c)}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`}
  const headers=data.some(x=>x?.term!==undefined)?["Term","Meaning"]:["Item","Meaning"];
  return `<div class="comparison-table"><table><thead><tr>${headers.map(h=>`<th>${h}</th>`).join("")}</tr></thead><tbody>${data.map(x=>`<tr><td><strong>${rich(x.term??x.name??x.range??"")}</strong></td><td>${rich(x.meaning??x.description??"")}</td></tr>`).join("")}</tbody></table></div>`;
}

function renderMethods(items){if(!arr(items).length)return "";return `<div class="method-grid">${items.map(x=>`<article class="method-card"><b>${esc(x.name||"")}</b><p>${rich(x.meaning||x.purpose||"")}</p>${x.example?`<code>${esc(x.example)}</code>`:""}</article>`).join("")}</div>`}
function renderGroups(items){if(!arr(items).length)return "";return `<div class="status-grid">${items.map(x=>`<article class="status-card"><b>${esc(x.range||x.code||"")}</b><h3>${esc(x.title||x.meaning||"")}</h3>${x.description?`<p>${rich(x.description)}</p>`:""}</article>`).join("")}</div>`}
function renderBreakdown(items){if(!arr(items).length)return "";return `<div class="url-breakdown">${items.map(x=>`<article><code>${esc(x.part||x.label||"")}</code><p>${rich(x.meaning||x.description||x.value||"")}</p></article>`).join("")}</div>`}
function renderArchitecture(items){if(!arr(items).length)return "";return `<div class="architecture-flow">${items.map((x,i)=>{const name=typeof x==="string"?x:(x.title||x.name||"");const list=typeof x==="string"?[]:arr(x.items);return `<article><span>${String(i+1).padStart(2,"0")}</span><h3>${esc(name)}</h3>${list.length?`<ul>${list.map(v=>`<li>${rich(v)}</li>`).join("")}</ul>`:""}</article>`}).join("")}</div>`}
function renderRole(title,items,icon){return arr(items).length?`<article class="role-panel"><h3>${icon} ${esc(title)}</h3><ul>${items.map(x=>`<li>${rich(asText(x))}</li>`).join("")}</ul></article>`:""}

function renderMessage(value,title){
  if(!value)return "";
  if(Array.isArray(value))return `<div class="message-panel"><h3>${esc(title)}</h3>${renderSimpleList("",value)}</div>`;
  if(typeof value==="string")return `<div class="message-panel"><h3>${esc(title)}</h3><p>${rich(value)}</p></div>`;
  return `<div class="message-panel"><h3>${esc(value.title||title)}</h3>${value.method?`<div class="message-line"><span>Method</span><strong>${esc(value.method)}</strong></div>`:""}${value.path?`<div class="message-line"><span>Path</span><code>${esc(value.path)}</code></div>`:""}${value.status?`<div class="message-line"><span>Status</span><strong>${esc(value.status)}</strong></div>`:""}${renderSimpleList("Headers",value.headers)}${value.body?`<pre>${esc(typeof value.body==="string"?value.body:JSON.stringify(value.body,null,2))}</pre>`:""}</div>`;
}

function renderExample(value,label="REAL-WORLD EXAMPLE"){
  if(!value)return "";
  if(typeof value==="string")return `<div class="real-example"><strong>🌍 ${esc(label)}</strong><p>${rich(value)}</p></div>`;
  return `<div class="real-example"><strong>🌍 ${esc(value.title||label)}</strong>${value.text?`<p>${rich(value.text)}</p>`:""}${arr(value.steps).length?`<ol>${value.steps.map(s=>`<li>${rich(s)}</li>`).join("")}</ol>`:""}${value.code?renderCode(value.code,"EXAMPLE CODE"):""}${value.output?`<div class="output-box"><strong>Expected Result</strong><pre>${esc(value.output)}</pre></div>`:""}</div>`;
}

function renderConcept(c,i){
  const intro=c.intro||c.text||"";
  const explanation=arr(c.explanation);
  return `<section class="lesson-section concept-section"><div class="concept-heading"><div class="concept-number">${String(c.number||i+1).padStart(2,"0")}</div><div><p class="section-label">CONCEPT ${String(c.number||i+1).padStart(2,"0")}</p><h2>${esc(c.title||"Concept")}</h2></div></div>${intro?`<p class="concept-intro">${rich(intro)}</p>`:""}${renderPoints(c.points)}${explanation.length?`<div class="explanation-list">${explanation.map(x=>`<p>${rich(asText(x))}</p>`).join("")}</div>`:""}${renderKeyIdea(c.keyIdea)}${renderWarning(c.warning)}${renderMistake(c.commonMistake)}${renderExample(c.example)}${c.realWorld?`<div class="real-example"><strong>🌍 Real-World Connection</strong><p>${rich(c.realWorld)}</p></div>`:""}${c.code?renderCode(c.code,c.label||"WORKED EXAMPLE"):""}${c.output?`<div class="output-box"><strong>Expected Result</strong><pre>${esc(c.output)}</pre></div>`:""}${renderComparison(c.comparison)}${renderMethods(c.methods)}${renderGroups(c.groups)}${renderBreakdown(c.breakdown)}${renderFlow(c.flow)}${renderMessage(c.request,"HTTP Request")}${renderMessage(c.response,"HTTP Response")}${c.exampleRequest?renderCode(c.exampleRequest,"EXAMPLE REQUEST"):""}${c.exampleResponse?renderCode(c.exampleResponse,"EXAMPLE RESPONSE"):""}${c.frontend||c.backend?`<div class="role-grid">${renderRole("Frontend",c.frontend,"🖥️")}${renderRole("Backend",c.backend,"⚙️")}</div>`:""}${renderSimpleList("Server Responsibilities",c.serverResponsibilities)}${renderArchitecture(c.architecture)}${c.tryIt?`<div class="try-it-box"><strong>🧪 ${esc(c.tryIt.title||"Try It Yourself")}</strong>${renderSimpleList("",c.tryIt.steps)}</div>`:""}</section>`;
}

function renderObjectives(items){return arr(items).length?`<section class="lesson-section objectives-section"><p class="section-label">LEARNING OBJECTIVES</p><h2>What you will learn</h2><div class="objective-grid">${items.map((x,i)=>`<article><b>${String(i+1).padStart(2,"0")}</b><p>${rich(asText(x))}</p></article>`).join("")}</div></section>`:""}

function normalizeTrace(trace){
  if(!trace)return null;
  if(arr(trace.lines).length)return {title:trace.title||"Follow the execution step by step",lines:trace.lines.map((x,i)=>({line:Number.isInteger(x.line)?x.line:i+1,code:x.code||"",explain:x.explanation||x.explain||""}))};
  if(arr(trace.code).length)return {title:trace.title||"Follow the execution step by step",lines:trace.code.map((code,i)=>({line:i+1,code,explain:trace.steps?.[i]?.explain||trace.steps?.[i]?.explanation||trace.steps?.[i]?.state||""}))};
  return null;
}
function renderTrace(trace){
  const t=normalizeTrace(trace); if(!t)return "";
  return `<section class="lesson-section trace-section"><p class="section-label">PROGRAM / SYSTEM TRACING</p><h2>${esc(t.title)}</h2><div class="premium-trace"><div class="trace-left"><div class="trace-code" id="traceCode">${t.lines.map((x,i)=>`<div data-trace-line="${i}"><span class="trace-line-number">${String(x.line).padStart(2,"0")}</span><code>${esc(x.code)}</code></div>`).join("")}</div><div class="trace-controls"><button id="traceReset" type="button">Reset</button><button id="traceNext" type="button" class="primary">Next step</button><button id="traceAuto" type="button">Auto Run</button></div></div><aside class="trace-state"><span class="trace-state-label">CURRENT STEP</span><strong id="traceState">Ready</strong><p id="traceExplain">Press Next step to begin.</p></aside></div></section>`;
}

function renderRevision(items){if(!arr(items).length)return "";return `<section class="lesson-section revision-section"><p class="section-label">QUICK REVISION</p><h2>Remember these essential ideas</h2><div class="revision-grid">${items.map((x,i)=>{const pair=Array.isArray(x);return `<article><b>${String(i+1).padStart(2,"0")}</b><div>${pair?`<strong>${rich(x[0])}</strong><p>${rich(x[1])}</p>`:`<p>${rich(x)}</p>`}</div></article>`}).join("")}</div></section>`}

function renderInterview(items){if(!arr(items).length)return "";return `<section class="lesson-section interview-section"><p class="section-label">PLACEMENT & INTERVIEW</p><h2>Explain the concept, don't just memorize it</h2><div class="interview-list">${items.map((x,i)=>`<details class="interview-item"><summary><span>${String(i+1).padStart(2,"0")}</span>${esc(x.question||x.q||"")}</summary><div class="interview-answer"><p>${rich(x.answer||x.a||"")}</p></div></details>`).join("")}</div></section>`}

function renderPractice(items){if(!arr(items).length)return "";return `<section class="lesson-section practice-section"><p class="section-label">PRACTICE ARENA</p><h2>Now apply what you learned</h2><p class="section-description">Try these problems without immediately looking at the solution. The goal is to build understanding, not just finish questions.</p><div class="practice-grid">${items.map((x,i)=>`<article class="practice-card"><header><span>CHALLENGE ${String(i+1).padStart(2,"0")}</span>${x.difficulty?`<b>${esc(x.difficulty)}</b>`:""}</header><h3>${esc(x.title||"Practice Challenge")}</h3><p>${rich(x.prompt||x.task||"")}</p>${arr(x.hints).length?`<details><summary>Need a hint?</summary><ul>${x.hints.map(h=>`<li>${rich(h)}</li>`).join("")}</ul></details>`:""}</article>`).join("")}</div></section>`}

function renderQuiz(items){if(!arr(items).length)return "";return `<section class="lesson-section quiz-section"><p class="section-label">KNOWLEDGE CHECK</p><h2>Test your understanding</h2>${items.map((x,i)=>`<article class="quiz-question" data-question="${i}"><span class="quiz-number">QUESTION ${String(i+1).padStart(2,"0")}</span><h3>${esc(x.question||x.q||"")}</h3><div class="quiz-options">${arr(x.options).map((o,j)=>`<button type="button" data-option="${j}">${String.fromCharCode(65+j)}. ${esc(o)}</button>`).join("")}</div><div class="quiz-result" hidden></div></article>`).join("")}</section>`}

function renderGlossary(items){if(!arr(items).length)return "";return `<section class="lesson-section glossary-section"><p class="section-label">GLOSSARY</p><h2>Terms to remember</h2><div class="glossary-grid">${items.map(x=>`<article><strong>${esc(Array.isArray(x)?x[0]:x.term||"")}</strong><p>${rich(Array.isArray(x)?x[1]:x.meaning||"")}</p></article>`).join("")}</div></section>`}
function renderCompletion(x,takeaway){const message=x?.message||x?.text||takeaway;if(!message)return "";return `<section class="lesson-section completion-section"><p class="section-label">LEVEL COMPLETE</p><h2>${esc(x?.title||"You now have the foundation")}</h2><p>${rich(message)}</p><button class="complete-button" id="completeLevel" type="button">Mark Level ${levelNumber} complete</button></section>`}

function legacyData(l){return {objectives:l.objectives||l.outcomes||[],concepts:l.sections||l.concepts||[],visualizer:l.visualizer||null,trace:l.trace||null,revision:l.revision||[],interview:l.interview||[],practice:l.practice||[],quiz:l.quiz||[],glossary:l.glossary||[],completion:l.completion||null,takeaway:l.takeaway||""}}

function renderLesson(){
  const main=document.getElementById("lessonMain"); if(!main)return;
  if(!lesson){main.innerHTML=`<section class="lesson-section"><p class="section-label">PLANNED LEVEL</p><h2>Level ${levelNumber}</h2><p>This level is part of the CodeBhavya Full Stack MERN roadmap and is not released yet.</p><a class="button primary" href="lesson.html?level=1">Open Level 01</a></section>`;return;}
  const d=legacyData(lesson), concepts=arr(d.concepts), quiz=arr(d.quiz);
  document.title=`Level ${levelNumber}: ${lesson.title||""} | CodeBhavya`;
  const description = document.querySelector('meta[name="description"]');
  if (description) {
    const text = String(lesson.hero?.description || lesson.summary || `Learn ${lesson.title} in the CodeBhavya Full Stack course.`)
      .replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
    description.content = text.length > 160 ? text.slice(0, 157).replace(/\s+\S*$/, "") + "…" : text;
  }
  const hero=`<section class="lesson-hero premium-hero"><div class="hero-level-number">${String(levelNumber).padStart(2,"0")}</div><div><p class="eyebrow">${esc(lesson.kicker||lesson.hero?.badge||`LEVEL ${String(levelNumber).padStart(2,"0")}`)}</p><h1>${esc(lesson.title||"")}</h1><p>${rich(lesson.hero?.description||lesson.summary||"")}</p><div class="lesson-meta">${lesson.duration?`<span>⏱ ${esc(lesson.duration)}</span>`:""}${lesson.difficulty?`<span>◈ ${esc(lesson.difficulty)}</span>`:""}<span>▣ ${concepts.length} concepts</span><span>✓ ${quiz.length} checks</span></div></div></section>`;
  const content=concepts.map(renderConcept).join("");
  const prev=levelNumber>1?`<a href="lesson.html?level=${levelNumber-1}">← Previous level</a>`:`<span></span>`;
  const next=levels.some(x=>Number(x.n)===levelNumber+1&&x.available!==false)?`<a href="lesson.html?level=${levelNumber+1}">Next level →</a>`:`<a href="index.html#roadmap">Return to roadmap →</a>`;
  main.innerHTML=hero+renderObjectives(d.objectives)+content+renderTrace(d.trace)+renderRevision(d.revision)+renderInterview(d.interview)+renderPractice(d.practice)+renderQuiz(d.quiz)+renderGlossary(d.glossary)+renderCompletion(d.completion,d.takeaway)+`<nav class="lesson-nav">${prev}${next}</nav>`;
  initTrace(); initQuiz(); initCompletion();
}

function initTrace(){
  const next=document.getElementById("traceNext"),reset=document.getElementById("traceReset"),auto=document.getElementById("traceAuto");if(!next)return;
  const t=normalizeTrace(lesson?.trace); if(!t)return;
  const step=()=>{
    clearInterval(traceTimer);
    const lines=document.querySelectorAll("[data-trace-line]"),state=document.getElementById("traceState"),explain=document.getElementById("traceExplain");
    if(traceIndex>=t.lines.length){lines.forEach(x=>x.classList.add("completed"));if(state)state.textContent="Trace complete";if(explain)explain.textContent="Reset to follow the execution again.";next.disabled=true;if(auto)auto.disabled=true;return;}
    lines.forEach((x,i)=>{x.classList.toggle("active",i===traceIndex);if(i<traceIndex)x.classList.add("completed")});
    const current=lines[traceIndex];current?.scrollIntoView({behavior:"smooth",block:"nearest"});
    if(state)state.textContent=`Step ${traceIndex+1}`;if(explain)explain.textContent=t.lines[traceIndex].explain||"";traceIndex++;
    if(traceIndex>=t.lines.length){setTimeout(()=>{next.disabled=true;if(auto)auto.disabled=true},20)}
  };
  next.onclick=step;reset.onclick=()=>{clearInterval(traceTimer);traceIndex=0;document.querySelectorAll("[data-trace-line]").forEach(x=>x.classList.remove("active","completed"));document.getElementById("traceState").textContent="Ready";document.getElementById("traceExplain").textContent="Press Next step to begin.";next.disabled=false;if(auto)auto.disabled=false};
  auto.onclick=()=>{clearInterval(traceTimer);step();traceTimer=setInterval(()=>{if(traceIndex>=t.lines.length){clearInterval(traceTimer);return}step()},900)};
}

function initQuiz(){document.querySelectorAll(".quiz-question").forEach(q=>q.querySelectorAll("[data-option]").forEach(btn=>btn.onclick=()=>{const i=Number(q.dataset.question),selected=Number(btn.dataset.option),item=lesson?.quiz?.[i];if(!item)return;const correct=Number(item.answer);q.querySelectorAll("[data-option]").forEach(b=>{b.disabled=true;const n=Number(b.dataset.option);if(n===correct)b.classList.add("correct");if(n===selected&&n!==correct)b.classList.add("wrong")});const r=q.querySelector(".quiz-result");r.hidden=false;r.classList.toggle("success",selected===correct);r.classList.toggle("failure",selected!==correct);r.innerHTML=selected===correct?`<strong>✓ Correct!</strong> ${rich(item.explanation||"")}`:`<strong>✗ Not quite.</strong> ${rich(item.explanation||"")}`}))}
function initCompletion(){const b=document.getElementById("completeLevel");if(!b)return;const update=()=>{const done=progressGet().includes(levelNumber);b.textContent=done?`✓ Level ${levelNumber} completed`:`Mark Level ${levelNumber} complete`;b.classList.toggle("completed",done)};b.onclick=()=>{let p=progressGet();p=p.includes(levelNumber)?p.filter(x=>x!==levelNumber):[...p,levelNumber];progressSet(p);update();showToast(p.includes(levelNumber)?"Level completed 🎉":"Completion removed")};update()}
function initCopy(){document.addEventListener("click",e=>{const b=e.target.closest("[data-copy]");if(!b)return;navigator.clipboard?.writeText(b.dataset.copy).then(()=>showToast("Code copied successfully")).catch(()=>showToast("Copy failed — select the code manually"))})}
function initSidebar(){const menu=document.getElementById("lessonMenu"),side=document.getElementById("sidebar"),shade=document.getElementById("shade");const close=()=>{side?.classList.remove("open");if(shade)shade.hidden=true};menu?.addEventListener("click",()=>{side?.classList.toggle("open");if(shade)shade.hidden=!side?.classList.contains("open")});shade?.addEventListener("click",close);document.getElementById("levelSearch")?.addEventListener("input",e=>{const q=e.target.value.toLowerCase();document.querySelectorAll("#levelNav a").forEach(a=>a.hidden=!a.textContent.toLowerCase().includes(q))})}
function initTopNav(){document.getElementById("navToggle")?.addEventListener("click",()=>document.getElementById("siteNav")?.classList.toggle("open"))}
function initReading(){const bar=document.getElementById("readingBar");if(!bar)return;const f=()=>{const max=document.documentElement.scrollHeight-innerHeight;bar.style.width=`${max?Math.max(0,Math.min(100,scrollY/max*100)):0}%`};addEventListener("scroll",f,{passive:true});addEventListener("resize",f);f()}

document.addEventListener("DOMContentLoaded",()=>{document.getElementById("year").textContent=new Date().getFullYear();renderSidebar();renderLesson();initCopy();initSidebar();initTopNav();initReading()});

