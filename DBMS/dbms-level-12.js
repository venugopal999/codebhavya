(function(){
"use strict";
const STORAGE_KEY="codebhavya.dbms.course.progress.v1";
const sourceRows=[
{student_id:101,name:"Anu",branch:"AIML",cgpa:8.6,city:"Hyderabad",status:"ACTIVE"},
{student_id:102,name:"Bharat",branch:"CSE",cgpa:7.9,city:"Vijayawada",status:"ACTIVE"},
{student_id:103,name:"Charan",branch:"AIML",cgpa:9.1,city:"Hyderabad",status:"ACTIVE"},
{student_id:104,name:"Divya",branch:"ECE",cgpa:8.2,city:"Guntur",status:"WITHDRAWN"},
{student_id:105,name:"Esha",branch:"CSE",cgpa:null,city:"Hyderabad",status:"ACTIVE"},
{student_id:106,name:"Farah",branch:"AIML",cgpa:8.9,city:"Visakhapatnam",status:"ACTIVE"},
{student_id:107,name:"Gopal",branch:"IT",cgpa:7.4,city:"Guntur",status:"INACTIVE"},
{student_id:108,name:"Harini",branch:"CSE",cgpa:9.1,city:"Hyderabad",status:"ACTIVE"},
{student_id:109,name:"Imran",branch:"ECE",cgpa:8.0,city:null,status:"ACTIVE"},
{student_id:110,name:"Jaya",branch:"AIML",cgpa:7.9,city:"Vijayawada",status:"ACTIVE"}
];
const columns=["student_id","name","branch","cgpa","city","status"];
const explanations=[
"SELECT forms the result expressions and therefore controls the returned columns.",
"WHERE evaluates predicates for individual candidate rows and keeps only TRUE.",
"BETWEEN is inclusive at both its lower and upper boundaries.",
"In LIKE, % represents zero or more characters, so A% means begins with A.",
"IS NULL is the dedicated predicate for missing values; equality with NULL yields UNKNOWN.",
"DISTINCT removes duplicate combinations across the complete selected expression list.",
"A relational result has no guaranteed order unless ORDER BY requests one.",
"Parentheses make the intended grouping of AND and OR explicit and reviewable.",
"A searched CASE returns the THEN expression belonging to its first TRUE WHEN.",
"Deterministic pagination requires a stable ORDER BY, normally ending with a unique tie-breaker."
];
const predicateCases={
like:{expression:"name LIKE 'A%'",description:"Only names beginning with uppercase A are TRUE in this case-sensitive teaching example.",outcomes:[["Anu","TRUE","KEPT"],["Bharat","FALSE","FILTERED"],["Asha","TRUE","KEPT"],["Divya","FALSE","FILTERED"]]},
in:{expression:"branch IN ('AIML', 'CSE')",description:"IN is TRUE when the value equals one member of the stated set.",outcomes:[["AIML","TRUE","KEPT"],["CSE","TRUE","KEPT"],["ECE","FALSE","FILTERED"],["NULL","UNKNOWN","FILTERED"]]},
between:{expression:"cgpa BETWEEN 8 AND 9",description:"Both 8 and 9 are included. NULL cannot be ordered and therefore produces UNKNOWN.",outcomes:[["7.9","FALSE","FILTERED"],["8.0","TRUE","KEPT"],["9.0","TRUE","KEPT"],["9.1","FALSE","FILTERED"],["NULL","UNKNOWN","FILTERED"]]},
null:{expression:"city IS NULL",description:"IS NULL is TRUE only for missing city values.",outcomes:[["Hyderabad","FALSE","FILTERED"],["NULL","TRUE","KEPT"],["Guntur","FALSE","FILTERED"]]},
precedence:{expression:"branch = 'AIML' OR branch = 'CSE' AND cgpa >= 9",description:"AND binds before OR, so every AIML row qualifies while a CSE row also needs cgpa at least 9.",outcomes:[["AIML, 7.2","TRUE","KEPT"],["CSE, 8.8","FALSE","FILTERED"],["CSE, 9.1","TRUE","KEPT"],["ECE, 9.5","FALSE","FILTERED"]]}
};
function escapeHtml(value){return String(value).replace(/[&<>"']/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[c];});}
function sqlString(value){return"'"+String(value).replace(/'/g,"''")+"'";}
function isNumericField(field){return field==="student_id"||field==="cgpa";}
function formatValue(value){return value===null?"NULL":String(value);}
function filterMarkup(index){
return"<div class=\"query-filter-row\" data-filter-row><label class=\"filter-enabled\"><input type=\"checkbox\" data-filter-enabled"+(index===0?" checked":"")+"> Filter "+(index+1)+"</label><label>Column<select data-filter-field>"+columns.map(function(c){return"<option"+(c===(index===0?"cgpa":"branch")?" selected":"")+">"+c+"</option>";}).join("")+"</select></label><label>Operator<select data-filter-operator><option value=\"eq\">=</option><option value=\"neq\">&lt;&gt;</option><option value=\"gt\""+(index===0?" selected":"")+">&gt;</option><option value=\"gte\">≥</option><option value=\"lt\">&lt;</option><option value=\"lte\">≤</option><option value=\"contains\">contains</option><option value=\"starts\">starts with</option><option value=\"in\">IN list</option><option value=\"between\">BETWEEN</option><option value=\"is-null\">IS NULL</option><option value=\"not-null\">IS NOT NULL</option></select></label><label>Value<input data-filter-value value=\""+(index===0?"8":"AIML")+"\" placeholder=\"Use comma for list/range\"></label></div>";
}
function operatorSql(field,operator,value){
const literal=function(v){return isNumericField(field)&&v!==""&&!Number.isNaN(Number(v))?String(Number(v)):sqlString(v);};
if(operator==="is-null")return field+" IS NULL";
if(operator==="not-null")return field+" IS NOT NULL";
if(operator==="contains")return field+" LIKE "+sqlString("%"+value+"%");
if(operator==="starts")return field+" LIKE "+sqlString(value+"%");
if(operator==="in")return field+" IN ("+value.split(",").map(function(v){return literal(v.trim());}).join(", ")+")";
if(operator==="between"){const parts=value.split(",");return field+" BETWEEN "+literal((parts[0]||"").trim())+" AND "+literal((parts[1]||"").trim());}
const signs={eq:"=",neq:"<>",gt:">",gte:">=",lt:"<",lte:"<="};return field+" "+signs[operator]+" "+literal(value);
}
function evaluate(row,field,operator,value){
const actual=row[field];if(operator==="is-null")return actual===null;if(operator==="not-null")return actual!==null;if(actual===null)return false;
if(operator==="contains")return String(actual).includes(value);
if(operator==="starts")return String(actual).startsWith(value);
if(operator==="in"){const wanted=value.split(",").map(function(v){return isNumericField(field)?Number(v.trim()):v.trim();});return wanted.indexOf(actual)!==-1;}
if(operator==="between"){const parts=value.split(",").map(function(v){return isNumericField(field)?Number(v.trim()):v.trim();});return parts.length>=2&&actual>=parts[0]&&actual<=parts[1];}
const expected=isNumericField(field)?Number(value):value;if(isNumericField(field)&&Number.isNaN(expected))return false;
return{eq:actual===expected,neq:actual!==expected,gt:actual>expected,gte:actual>=expected,lt:actual<expected,lte:actual<=expected}[operator];
}
function readFilters(){
return Array.from(document.querySelectorAll("[data-filter-row]")).filter(function(row){return row.querySelector("[data-filter-enabled]").checked;}).map(function(row){return{field:row.querySelector("[data-filter-field]").value,operator:row.querySelector("[data-filter-operator]").value,value:row.querySelector("[data-filter-value]").value.trim()};});
}
function renderResult(selected,rows){
const target=document.getElementById("queryResultTable");target.innerHTML="<div class=\"query-result-wrap\"><table><thead><tr>"+selected.map(function(c){return"<th>"+escapeHtml(c)+"</th>";}).join("")+"</tr></thead><tbody>"+(rows.length?rows.map(function(row){return"<tr>"+selected.map(function(c){return"<td class=\""+(row[c]===null?"is-null":"")+"\">"+escapeHtml(formatValue(row[c]))+"</td>";}).join("")+"</tr>";}).join(""):"<tr><td colspan=\""+selected.length+"\">No rows match this query.</td></tr>")+"</tbody></table></div>";
}
function runQuery(event){
if(event)event.preventDefault();
const selected=Array.from(document.querySelectorAll('[name="projection"]:checked')).map(function(i){return i.value;});
if(!selected.length){document.getElementById("queryResultTitle").textContent="Choose at least one result column";return;}
const filters=readFilters(),connector=document.getElementById("queryConnector").value,distinct=document.getElementById("queryDistinct").checked,sort=document.getElementById("querySort").value,direction=document.getElementById("queryDirection").value,limit=document.getElementById("queryLimit").value;
let result=sourceRows.filter(function(row){if(!filters.length)return true;const outcomes=filters.map(function(f){return evaluate(row,f.field,f.operator,f.value);});return connector==="AND"?outcomes.every(Boolean):outcomes.some(Boolean);});
const filteredCount=result.length;
if(sort)result.sort(function(a,b){if(a[sort]===null)return 1;if(b[sort]===null)return-1;if(a[sort]===b[sort])return a.student_id-b.student_id;const comparison=a[sort]<b[sort]?-1:1;return direction==="DESC"?-comparison:comparison;});
let projected=result.map(function(row){const out={};selected.forEach(function(c){out[c]=row[c];});return out;});
if(distinct){const seen=new Set();projected=projected.filter(function(row){const key=JSON.stringify(selected.map(function(c){return row[c];}));if(seen.has(key))return false;seen.add(key);return true;});}
const distinctCount=projected.length;if(limit)projected=projected.slice(0,Number(limit));
let sql="SELECT "+(distinct?"DISTINCT ":"")+selected.join(", ")+"\nFROM students";
if(filters.length)sql+="\nWHERE "+filters.map(function(f){return operatorSql(f.field,f.operator,f.value);}).join("\n  "+connector+" ");
if(sort)sql+="\nORDER BY "+sort+" "+direction+(sort==="student_id"?"":", student_id ASC");
if(limit)sql+="\nLIMIT "+limit;
sql+=";";
document.getElementById("generatedSelect").textContent=sql;
document.getElementById("queryResultTitle").textContent=projected.length+" row"+(projected.length===1?"":"s")+" returned";
document.getElementById("queryStageSummary").innerHTML="<div><strong>"+sourceRows.length+"</strong><span>FROM rows</span></div><b>→</b><div><strong>"+filteredCount+"</strong><span>after WHERE</span></div><b>→</b><div><strong>"+distinctCount+"</strong><span>after projection"+(distinct?" / DISTINCT":"")+"</span></div><b>→</b><div><strong>"+projected.length+"</strong><span>final rows</span></div>";
renderResult(selected,projected);
}
function initQueryBuilder(){
const rows=document.getElementById("queryFilterRows"),form=document.getElementById("queryBuilderForm");if(!rows||!form)return;rows.innerHTML=filterMarkup(0)+filterMarkup(1);
rows.addEventListener("change",function(event){if(event.target.matches("[data-filter-operator]")){const row=event.target.closest("[data-filter-row]"),input=row.querySelector("[data-filter-value]"),noValue=event.target.value==="is-null"||event.target.value==="not-null";input.disabled=noValue;input.placeholder=event.target.value==="between"?"Example: 8, 9":event.target.value==="in"?"Example: AIML, CSE":"Value";}});
form.addEventListener("submit",runQuery);
document.getElementById("resetQueryButton").addEventListener("click",function(){form.reset();rows.innerHTML=filterMarkup(0)+filterMarkup(1);document.getElementById("querySort").value="";document.getElementById("queryLimit").value="";runQuery();});
document.getElementById("copyQueryButton").addEventListener("click",function(){const status=document.getElementById("queryCopyStatus"),text=document.getElementById("generatedSelect").textContent;if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(text).then(function(){status.textContent="SQL copied.";},function(){status.textContent="Copy was unavailable; select the SQL manually.";});}else status.textContent="Copy was unavailable; select the SQL manually.";});
runQuery();
}
function initPredicateLab(){const buttons=Array.from(document.querySelectorAll("[data-predicate-case]")),result=document.getElementById("predicateCaseResult");if(!buttons.length||!result)return;function render(key){const item=predicateCases[key];result.innerHTML="<header><span>WHERE "+escapeHtml(item.expression)+"</span><h3>"+item.outcomes.filter(function(r){return r[1]==="TRUE";}).length+" rows survive the WHERE gate</h3><p>"+item.description+"</p></header><div class=\"predicate-table-wrap\"><table><thead><tr><th>Input</th><th>Predicate</th><th>WHERE result</th></tr></thead><tbody>"+item.outcomes.map(function(row){return"<tr class=\"outcome-"+row[1].toLowerCase()+"\"><td>"+escapeHtml(row[0])+"</td><td>"+row[1]+"</td><td>"+row[2]+"</td></tr>";}).join("")+"</tbody></table></div>";buttons.forEach(function(b){b.setAttribute("aria-selected",String(b.dataset.predicateCase===key));});}buttons.forEach(function(b){b.addEventListener("click",function(){render(b.dataset.predicateCase);});});render("like");}
function initChecks(){const checks=Array.from(document.querySelectorAll(".concept-check")),score=document.getElementById("conceptScore"),answered=new Map();function update(){let correct=0;answered.forEach(function(v){if(v)correct++;});if(score)score.textContent="Answered correctly: "+correct+" of "+checks.length;}checks.forEach(function(check,index){const answer=check.dataset.answer,feedback=check.querySelector(".check-feedback"),buttons=Array.from(check.querySelectorAll("[data-option]"));buttons.forEach(function(button){button.addEventListener("click",function(){const correct=button.dataset.option===answer;answered.set(index,correct);buttons.forEach(function(item){item.classList.remove("is-correct","is-wrong");if(item.dataset.option===answer)item.classList.add("is-correct");});if(!correct)button.classList.add("is-wrong");feedback.innerHTML=correct?"<strong>Correct.</strong> "+explanations[index]:"Not quite. Review the highlighted answer. "+explanations[index];update();});});});}
function readProgress(){try{const v=JSON.parse(localStorage.getItem(STORAGE_KEY)||"[]");return Array.isArray(v)?v.map(Number):[];}catch(e){return[];}}
function initCompletion(){const button=document.getElementById("completeLessonButton"),status=document.getElementById("lessonSidebarStatus");if(!button)return;let completed=readProgress();function render(){const done=completed.indexOf(12)!==-1;button.classList.toggle("is-complete",done);button.setAttribute("aria-pressed",String(done));button.textContent=done?"✓ Level 12 completed":"Mark Level 12 complete";if(status){status.textContent=done?"Level 12 completed":"Not completed";status.parentElement.classList.toggle("is-complete",done);}}button.addEventListener("click",function(){const i=completed.indexOf(12);if(i===-1)completed.push(12);else completed.splice(i,1);completed.sort(function(a,b){return a-b;});try{localStorage.setItem(STORAGE_KEY,JSON.stringify(completed));}catch(e){}render();});render();}
function initReading(){const bar=document.getElementById("lessonReadingBar"),links=Array.from(document.querySelectorAll(".lesson-section-link")),sections=links.map(function(l){return document.querySelector(l.getAttribute("href"));}).filter(Boolean);function update(){const max=document.documentElement.scrollHeight-window.innerHeight;if(bar)bar.style.width=(max>0?Math.min(100,Math.max(0,window.scrollY/max*100)):0)+"%";}window.addEventListener("scroll",update,{passive:true});update();if("IntersectionObserver"in window){const observer=new IntersectionObserver(function(entries){entries.forEach(function(entry){if(!entry.isIntersecting)return;links.forEach(function(link){link.classList.toggle("active",link.getAttribute("href")==="#"+entry.target.id);});});},{rootMargin:"-20% 0px -70% 0px"});sections.forEach(function(s){observer.observe(s);});}}
function init(){initQueryBuilder();initPredicateLab();initChecks();initCompletion();initReading();}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init,{once:true});else init();
}());
