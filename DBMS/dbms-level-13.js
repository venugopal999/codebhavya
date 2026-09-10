(function(){
"use strict";
const STORAGE_KEY="codebhavya.dbms.course.progress.v1";
const rows=[
{name:"Anu",branch:"AIML",city:"Hyderabad",status:"ACTIVE",cgpa:8.6,credits:22},
{name:"Bharat",branch:"CSE",city:"Vijayawada",status:"ACTIVE",cgpa:7.9,credits:20},
{name:"Charan",branch:"AIML",city:"Hyderabad",status:"ACTIVE",cgpa:9.1,credits:24},
{name:"Divya",branch:"ECE",city:"Guntur",status:"WITHDRAWN",cgpa:8.2,credits:18},
{name:"Esha",branch:"CSE",city:"Hyderabad",status:"ACTIVE",cgpa:null,credits:21},
{name:"Farah",branch:"AIML",city:"Visakhapatnam",status:"ACTIVE",cgpa:8.9,credits:23},
{name:"Gopal",branch:"IT",city:"Guntur",status:"INACTIVE",cgpa:7.4,credits:17},
{name:"Harini",branch:"CSE",city:"Hyderabad",status:"ACTIVE",cgpa:9.1,credits:24},
{name:"Imran",branch:"ECE",city:null,status:"ACTIVE",cgpa:8.0,credits:20},
{name:"Jaya",branch:"AIML",city:"Vijayawada",status:"ACTIVE",cgpa:7.9,credits:19},
{name:"Kiran",branch:"IT",city:"Hyderabad",status:"ACTIVE",cgpa:8.5,credits:22},
{name:"Latha",branch:"ECE",city:"Guntur",status:"ACTIVE",cgpa:null,credits:16}
];
const explanations=[
"A scalar function maps each input row to one output value.",
"COUNT(*) counts rows regardless of NULL values inside their columns.",
"COUNT(expression) counts only rows where that expression is non-NULL.",
"GROUP BY branch partitions rows by distinct branch value and produces one group per value.",
"HAVING evaluates conditions on groups after aggregate values exist.",
"WHERE removes source rows before groups are formed.",
"AVG ignores NULL inputs and divides the sum of non-NULL values by their count.",
"Conditional aggregation converts a condition into values, commonly 1 and 0, that an aggregate can summarize.",
"Except for COUNT, an aggregate over an empty input generally returns NULL.",
"An ordinary selected column must normally define the group grain or be inside an aggregate."
];
const countCases={
star:{title:"COUNT(*) = 4",input:["8.6","NULL","9.1","8.0"],included:[true,true,true,true],explanation:"COUNT(*) counts all four rows. It does not inspect whether cgpa is NULL."},
column:{title:"COUNT(cgpa) = 3",input:["8.6","NULL","9.1","8.0"],included:[true,false,true,true],explanation:"COUNT(cgpa) excludes the row whose evaluated cgpa expression is NULL."},
distinct:{title:"COUNT(DISTINCT branch) = 3",input:["AIML","CSE","AIML","ECE","NULL"],included:[true,true,false,true,false],explanation:"Duplicate AIML contributes once, and NULL does not contribute to COUNT(DISTINCT expression)."},
average:{title:"AVG(cgpa) = 8.57",input:["8.6","NULL","9.1","8.0"],included:[true,false,true,true],explanation:"AVG uses (8.6 + 9.1 + 8.0) / 3. The NULL value is not converted to zero."},
empty:{title:"SUM(credits) = NULL",input:[],included:[],explanation:"With no input rows, SUM generally returns NULL. COALESCE(SUM(credits), 0) is appropriate only when zero has the intended meaning."}
};
const aggregateLabels={"count-all":"COUNT(*)","count-cgpa":"COUNT(cgpa)",avg:"ROUND(AVG(cgpa), 2)",min:"MIN(cgpa)",max:"MAX(cgpa)",sum:"SUM(credits)"};
function escapeHtml(v){return String(v).replace(/[&<>"']/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[c];});}
function round(value){return value===null?null:Math.round(value*100)/100;}
function aggregate(group,type){
const cgpas=group.map(function(r){return r.cgpa;}).filter(function(v){return v!==null;});
if(type==="count-all")return group.length;if(type==="count-cgpa")return cgpas.length;if(type==="avg")return cgpas.length?round(cgpas.reduce(function(a,b){return a+b;},0)/cgpas.length):null;if(type==="min")return cgpas.length?Math.min.apply(null,cgpas):null;if(type==="max")return cgpas.length?Math.max.apply(null,cgpas):null;if(type==="sum")return group.length?group.reduce(function(total,r){return total+r.credits;},0):null;return null;
}
function compare(value,operator,target){if(value===null)return false;return{gte:value>=target,gt:value>target,lte:value<=target,lt:value<target,eq:value===target}[operator];}
function filterRows(type){if(type==="active")return rows.filter(function(r){return r.status==="ACTIVE";});if(type==="recorded")return rows.filter(function(r){return r.cgpa!==null;});if(type==="strong")return rows.filter(function(r){return r.cgpa!==null&&r.cgpa>=8;});return rows.slice();}
function whereSql(type){return{active:"status = 'ACTIVE'",recorded:"cgpa IS NOT NULL",strong:"cgpa >= 8"}[type]||"";}
function buildReport(event){
if(event)event.preventDefault();const where=document.getElementById("aggregateWhere").value,groupBy=document.getElementById("aggregateGroup").value,type=document.getElementById("aggregateFunction").value,having=document.getElementById("aggregateHavingOperator").value,target=Number(document.getElementById("aggregateHavingValue").value),conditional=document.getElementById("conditionalMetric").checked,source=filterRows(where),groups=new Map();
source.forEach(function(row){const key=groupBy==="none"?"All rows":(row[groupBy]===null?"NULL":row[groupBy]);if(!groups.has(key))groups.set(key,[]);groups.get(key).push(row);});
let report=Array.from(groups,function(entry){const key=entry[0],members=entry[1];return{key:key,members:members,value:aggregate(members,type),strong:members.filter(function(r){return r.cgpa!==null&&r.cgpa>=8.5;}).length};});
const beforeHaving=report.length;if(having!=="none")report=report.filter(function(item){return compare(item.value,having,target);});
const groupExpression=groupBy==="none"?"":groupBy+", ",alias=type.replace(/-/g,"_");
let sql="SELECT "+groupExpression+aggregateLabels[type]+" AS "+alias;
if(conditional)sql+=",\n       SUM(CASE WHEN cgpa >= 8.5 THEN 1 ELSE 0 END) AS strong_count";
sql+="\nFROM students";if(whereSql(where))sql+="\nWHERE "+whereSql(where);if(groupBy!=="none")sql+="\nGROUP BY "+groupBy;if(having!=="none")sql+="\nHAVING "+aggregateLabels[type]+" "+{gte:">=",gt:">",lte:"<=",lt:"<",eq:"="}[having]+" "+target;if(groupBy!=="none")sql+="\nORDER BY "+groupBy+" ASC";sql+=";";
document.getElementById("generatedAggregateSql").textContent=sql;document.getElementById("aggregateStageCounts").innerHTML="<div><strong>"+rows.length+"</strong><span>source rows</span></div><b>→</b><div><strong>"+source.length+"</strong><span>after WHERE</span></div><b>→</b><div><strong>"+beforeHaving+"</strong><span>formed groups</span></div><b>→</b><div><strong>"+report.length+"</strong><span>after HAVING</span></div>";
document.getElementById("aggregateGroupMembers").innerHTML=Array.from(groups,function(entry){return"<div><strong>"+escapeHtml(entry[0])+"</strong><span>"+entry[1].map(function(r){return escapeHtml(r.name);}).join(", ")+"</span></div>";}).join("");
document.getElementById("aggregateResultTitle").textContent=report.length+" result row"+(report.length===1?"":"s");
const headers=(groupBy==="none"?[]:[groupBy]).concat([alias]).concat(conditional?["strong_count"]:[]);
document.getElementById("aggregateResultTable").innerHTML="<div class=\"aggregate-table-wrap\"><table><thead><tr>"+headers.map(function(h){return"<th>"+escapeHtml(h)+"</th>";}).join("")+"</tr></thead><tbody>"+(report.length?report.map(function(item){return"<tr>"+(groupBy==="none"?"":"<td>"+escapeHtml(item.key)+"</td>")+"<td class=\""+(item.value===null?"is-null":"")+"\">"+(item.value===null?"NULL":item.value)+"</td>"+(conditional?"<td>"+item.strong+"</td>":"")+"</tr>";}).join(""):"<tr><td colspan=\""+headers.length+"\">No groups satisfy HAVING.</td></tr>")+"</tbody></table></div>";
}
function initAggregateLab(){const form=document.getElementById("aggregateLabForm");if(!form)return;form.addEventListener("submit",buildReport);document.getElementById("resetAggregateLab").addEventListener("click",function(){form.reset();buildReport();});buildReport();}
function initCountLab(){const buttons=Array.from(document.querySelectorAll("[data-count-case]")),result=document.getElementById("countCaseResult");if(!buttons.length||!result)return;function render(key){const item=countCases[key];result.innerHTML="<span>AGGREGATE OUTCOME</span><h3>"+item.title+"</h3>"+(item.input.length?"<div class=\"count-inputs\">"+item.input.map(function(value,index){return"<div class=\""+(item.included[index]?"included":"excluded")+"\"><code>"+value+"</code><small>"+(item.included[index]?"contributes":"ignored")+"</small></div>";}).join("")+"</div>":"<div class=\"empty-aggregate\">No input rows</div>")+"<p>"+item.explanation+"</p>";buttons.forEach(function(b){b.setAttribute("aria-selected",String(b.dataset.countCase===key));});}buttons.forEach(function(b){b.addEventListener("click",function(){render(b.dataset.countCase);});});render("star");}
function initChecks(){const checks=Array.from(document.querySelectorAll(".concept-check")),score=document.getElementById("conceptScore"),answered=new Map();function update(){let correct=0;answered.forEach(function(v){if(v)correct++;});if(score)score.textContent="Answered correctly: "+correct+" of "+checks.length;}checks.forEach(function(check,index){const answer=check.dataset.answer,feedback=check.querySelector(".check-feedback"),buttons=Array.from(check.querySelectorAll("[data-option]"));buttons.forEach(function(button){button.addEventListener("click",function(){const correct=button.dataset.option===answer;answered.set(index,correct);buttons.forEach(function(item){item.classList.remove("is-correct","is-wrong");if(item.dataset.option===answer)item.classList.add("is-correct");});if(!correct)button.classList.add("is-wrong");feedback.innerHTML=correct?"<strong>Correct.</strong> "+explanations[index]:"Not quite. Review the highlighted answer. "+explanations[index];update();});});});}
function readProgress(){try{const v=JSON.parse(localStorage.getItem(STORAGE_KEY)||"[]");return Array.isArray(v)?v.map(Number):[];}catch(e){return[];}}
function initCompletion(){const button=document.getElementById("completeLessonButton"),status=document.getElementById("lessonSidebarStatus");if(!button)return;let completed=readProgress();function render(){const done=completed.indexOf(13)!==-1;button.classList.toggle("is-complete",done);button.setAttribute("aria-pressed",String(done));button.textContent=done?"✓ Level 13 completed":"Mark Level 13 complete";if(status){status.textContent=done?"Level 13 completed":"Not completed";status.parentElement.classList.toggle("is-complete",done);}}button.addEventListener("click",function(){const i=completed.indexOf(13);if(i===-1)completed.push(13);else completed.splice(i,1);completed.sort(function(a,b){return a-b;});try{localStorage.setItem(STORAGE_KEY,JSON.stringify(completed));}catch(e){}render();});render();}
function initReading(){const bar=document.getElementById("lessonReadingBar"),links=Array.from(document.querySelectorAll(".lesson-section-link")),sections=links.map(function(l){return document.querySelector(l.getAttribute("href"));}).filter(Boolean);function update(){const max=document.documentElement.scrollHeight-window.innerHeight;if(bar)bar.style.width=(max>0?Math.min(100,Math.max(0,window.scrollY/max*100)):0)+"%";}window.addEventListener("scroll",update,{passive:true});update();if("IntersectionObserver"in window){const observer=new IntersectionObserver(function(entries){entries.forEach(function(entry){if(!entry.isIntersecting)return;links.forEach(function(link){link.classList.toggle("active",link.getAttribute("href")==="#"+entry.target.id);});});},{rootMargin:"-20% 0px -70% 0px"});sections.forEach(function(s){observer.observe(s);});}}
function init(){initAggregateLab();initCountLab();initChecks();initCompletion();initReading();}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init,{once:true});else init();
}());

