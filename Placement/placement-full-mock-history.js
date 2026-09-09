(function(){
  "use strict";
  const client=(window.CodeBhavyaSupabase||{}).client||null;
  const $=(id)=>document.getElementById(id);
  const topicLabels={c:"C Programming",python:"Python",dsa:"Data Structures & Algorithms",database:"Database & SQL","core-cs":"Core Computer Science","ai-ml":"AI & Machine Learning"};
  const trackLabels={general:"General Campus",service:"Foundation & High-Volume",product:"Product Engineering",ai:"Data, AI & Analytics"};
  const sectionLabels={aptitude:"Aptitude",technical:"Technical",coding:"Coding"};
  const completedStatuses=new Set(["completed","auto_submitted"]);
  const number=(value)=>Number.isFinite(Number(value))?Number(value):0;
  function state(name){["historyLoading","historySignedOut","historyError","historyWorkspace"].forEach((id)=>{$(id).hidden=id!==name;});}
  function text(parent,tag,value,className){const element=document.createElement(tag);element.textContent=value;if(className)element.className=className;parent.append(element);return element;}
  function dateLabel(value){return new Intl.DateTimeFormat(undefined,{day:"numeric",month:"short",year:"numeric",hour:"numeric",minute:"2-digit"}).format(new Date(value));}
  function scoreBand(score){if(score>=90)return"Strong placement readiness";if(score>=75)return"Interview ready";if(score>=60)return"Assessment ready";if(score>=40)return"Developing";return"Foundation required";}
  function sectionScores(row){return{aptitude:number(row.section_scores?.aptitude),technical:number(row.section_scores?.technical),coding:number(row.section_scores?.coding)};}
  function strongest(scores){return Object.entries(scores).sort((a,b)=>b[1]-a[1])[0];}
  function weakest(scores){return Object.entries(scores).sort((a,b)=>a[1]-b[1])[0];}
  function retakeHref(row){const query=new URLSearchParams({target:row.target_path,technical:row.technical_topic,coding:row.coding_topic});return"full-mock.html?"+query.toString();}
  function summaryCard(parent,label,value,note,tone){const card=document.createElement("article");card.className="history-summary-card"+(tone?" "+tone:"");text(card,"small",label);text(card,"strong",value);text(card,"p",note);parent.append(card);}
  function renderSummary(completed){
    const target=$("historySummary");target.replaceChildren();
    if(!completed.length){summaryCard(target,"COMPLETED TESTS","0","Complete your first full assessment to establish a baseline.");summaryCard(target,"LATEST SCORE","—","No completed result yet.");summaryCard(target,"BEST SCORE","—","Your personal best will appear here.");summaryCard(target,"NEXT FOCUS","Start","Take one complete assessment.","focus");return;}
    const latest=completed[completed.length-1],previous=completed[completed.length-2];
    const delta=previous?number(latest.score)-number(previous.score):null;
    const weak=weakest(sectionScores(latest));
    const best=Math.max(...completed.map((row)=>number(row.score)));
    summaryCard(target,"COMPLETED TESTS",String(completed.length),"Secure assessments with a released final result.");
    summaryCard(target,"LATEST SCORE",number(latest.score)+"%",scoreBand(number(latest.score)));
    summaryCard(target,"CHANGE",delta===null?"Baseline":(delta>0?"+":"")+delta+" points",delta===null?"Complete one more test to measure improvement.":delta>0?"Improved from your previous assessment.":delta===0?"Unchanged from your previous assessment.":"Review the section-level changes before retaking.",delta!==null&&delta>0?"positive":delta!==null&&delta<0?"negative":"");
    summaryCard(target,"NEXT FOCUS",sectionLabels[weak[0]],weak[1]+"% in the latest assessment.","focus");
    const bestNote=document.createElement("p");bestNote.className="history-best-note";bestNote.textContent="Personal best: "+best+"%. Strongest latest section: "+sectionLabels[strongest(sectionScores(latest))[0]]+".";target.after(bestNote);
  }
  function svgElement(name,attributes){const element=document.createElementNS("http://www.w3.org/2000/svg",name);Object.entries(attributes||{}).forEach(([key,value])=>element.setAttribute(key,String(value)));return element;}
  function renderTrend(completed){
    const target=$("historyTrend");target.replaceChildren();
    if(!completed.length){text(target,"p","No completed scores yet. Your first result will become the trend baseline.","history-empty");return;}
    const width=780,height=250,left=52,right=24,top=24,bottom=44,plotWidth=width-left-right,plotHeight=height-top-bottom;
    const svg=svgElement("svg",{viewBox:`0 0 ${width} ${height}`,role:"img","aria-label":"Overall assessment scores: "+completed.map((row)=>number(row.score)+" percent").join(", ")});svg.classList.add("history-chart");
    [0,50,100].forEach((value)=>{const y=top+plotHeight-(value/100)*plotHeight;svg.append(svgElement("line",{x1:left,y1:y,x2:width-right,y2:y,class:"trend-guide"}));const label=svgElement("text",{x:left-10,y:y+4,"text-anchor":"end",class:"trend-axis-label"});label.textContent=value+"%";svg.append(label);});
    const points=completed.map((row,index)=>{const x=completed.length===1?left+plotWidth/2:left+(index/(completed.length-1))*plotWidth;const y=top+plotHeight-(number(row.score)/100)*plotHeight;return{x,y,row,index};});
    if(points.length>1)svg.append(svgElement("polyline",{points:points.map((point)=>point.x+","+point.y).join(" "),class:"trend-line"}));
    points.forEach((point)=>{svg.append(svgElement("circle",{cx:point.x,cy:point.y,r:6,class:"trend-point"}));const score=svgElement("text",{x:point.x,y:point.y-12,"text-anchor":"middle",class:"trend-score"});score.textContent=number(point.row.score)+"%";svg.append(score);const attempt=svgElement("text",{x:point.x,y:height-15,"text-anchor":"middle",class:"trend-attempt"});attempt.textContent="Test "+(point.index+1);svg.append(attempt);});
    target.append(svg);
  }
  function sectionMetric(parent,key,value){const item=document.createElement("div");const row=document.createElement("span");text(row,"b",sectionLabels[key]);text(row,"strong",value+"%");item.append(row);const bar=document.createElement("progress");bar.max=100;bar.value=value;bar.setAttribute("aria-label",sectionLabels[key]+" score "+value+" percent");item.append(bar);parent.append(item);}
  function renderAttempts(rows,completed){
    const target=$("historyAttempts");target.replaceChildren();
    if(!rows.length){const empty=document.createElement("div");empty.className="history-empty";text(empty,"h3","No assessment attempts yet");text(empty,"p","Create a full assessment when you are ready to establish your baseline.");const link=text(empty,"a","Take your first full assessment","mock-primary");link.href="full-mock.html";target.append(empty);return;}
    const chronological=[...completed].sort((a,b)=>new Date(a.created_at)-new Date(b.created_at));const deltaById=new Map();chronological.forEach((row,index)=>deltaById.set(row.id,index?number(row.score)-number(chronological[index-1].score):null));
    rows.forEach((row)=>{
      const done=completedStatuses.has(row.status)&&row.score!==null;const card=document.createElement("article");card.className="assessment-history-card"+(row.status==="auto_submitted"?" integrity-failed":"");
      const header=document.createElement("header");const copy=document.createElement("div");text(copy,"small",dateLabel(row.completed_at||row.created_at));text(copy,"h3",(trackLabels[row.target_path]||row.target_path)+" · "+(topicLabels[row.technical_topic]||row.technical_topic));text(copy,"p","Coding: "+(topicLabels[row.coding_topic]||row.coding_topic));header.append(copy);
      const score=document.createElement("div");score.className="attempt-score";text(score,"strong",done?number(row.score)+"%":"—");text(score,"span",done?scoreBand(number(row.score)):row.status.replaceAll("_"," "));header.append(score);card.append(header);
      if(done){const metrics=document.createElement("div");metrics.className="attempt-sections";const scores=sectionScores(row);Object.entries(scores).forEach(([key,value])=>sectionMetric(metrics,key,value));card.append(metrics);const weak=weakest(scores);const delta=deltaById.get(row.id);const insight=document.createElement("p");insight.className="attempt-insight";insight.textContent=(delta===null?"Baseline attempt":(delta>0?"Improved "+delta+" points":delta===0?"Same overall score":"Decreased "+Math.abs(delta)+" points"))+" · Priority: "+sectionLabels[weak[0]]+" ("+weak[1]+"%)";card.append(insight);}
      const footer=document.createElement("div");footer.className="attempt-footer";const status=text(footer,"span",row.status==="auto_submitted"?"Auto-submitted after integrity incidents":row.warning_count?row.warning_count+" integrity warning"+(row.warning_count===1?"":"s"):done?"Clean completion":row.status==="ready"?"Not started":"In progress","attempt-integrity "+(row.status==="auto_submitted"?"failed":row.warning_count?"warning":"clean"));status.title="Integrity status";
      const actions=document.createElement("div");if(done){const detail=text(actions,"a","View detailed result","mock-secondary");detail.href="full-mock-result.html?session="+encodeURIComponent(row.id);}else{const resume=text(actions,"a","Resume assessment","mock-primary");resume.href="full-mock-session.html?session="+encodeURIComponent(row.id);}const retake=text(actions,"a","Retake this setup","mock-secondary");retake.href=retakeHref(row);footer.append(actions);card.append(footer);target.append(card);
    });
  }
  async function load(){
    state("historyLoading");
    if(!client){$("historyErrorMessage").textContent="Supabase connection is unavailable.";state("historyError");return;}
    try{const auth=await client.auth.getUser();if(!auth.data?.user){state("historySignedOut");return;}const result=await client.rpc("get_my_full_placement_assessments");if(result.error)throw result.error;const rows=Array.isArray(result.data)?result.data:[];const completed=rows.filter((row)=>completedStatuses.has(row.status)&&row.score!==null).sort((a,b)=>new Date(a.completed_at||a.created_at)-new Date(b.completed_at||b.created_at));renderSummary(completed);renderTrend(completed);renderAttempts(rows,completed);state("historyWorkspace");}
    catch(error){const missing=/get_my_full_placement_assessments|function .* does not exist|schema cache/i.test(String(error?.message||""));$("historyErrorMessage").textContent=missing?"Run Placement/full-assessment-history-v45.sql once in Supabase, then try again.":(error.message||"Your assessment history could not be loaded.");state("historyError");}
  }
  $("retryHistory").addEventListener("click",load);load();
}());
