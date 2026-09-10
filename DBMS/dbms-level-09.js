(function () {
"use strict";
const STORAGE_KEY="codebhavya.dbms.course.progress.v1";
const explanations=[
"SQL is declarative because a query states the required result rather than a physical access algorithm.",
"CREATE TABLE defines a database object, so it belongs to DDL.",
"FROM and JOIN conceptually establish the source row set before later clauses.",
"WHERE tests individual rows before GROUP BY forms groups.",
"DECIMAL or NUMERIC supports exact fixed-scale arithmetic suitable for money.",
"NULL represents absent, unknown or inapplicable information, depending on the attribute semantics.",
"IS NULL is the dedicated nullness predicate; ordinary equality with NULL produces UNKNOWN.",
"TRUE AND UNKNOWN is UNKNOWN because the unknown operand could still make the conjunction false.",
"WHERE retains only TRUE; both FALSE and UNKNOWN are removed.",
"Row limiting varies across LIMIT, TOP and FETCH syntax even though SELECT and WHERE are broadly portable."
];
const scenarios={
filter:{query:"SELECT name, cgpa\nFROM students\nWHERE branch = 'AIML' AND cgpa >= 8\nORDER BY cgpa DESC\nLIMIT 2;",stages:[
{name:"FROM",action:"Read the source relation",description:"FROM establishes all candidate student rows.",columns:["id","name","branch","cgpa"],rows:[[101,"Anu","AIML","8.6"],[102,"Bharat","CSE","7.9"],[103,"Charan","AIML","9.1"],[104,"Divya","ECE","8.2"],[105,"Esha","AIML","NULL"]]},
{name:"WHERE",action:"Keep rows whose predicate is TRUE",description:"Anu and Charan satisfy both conditions. Esha's cgpa comparison is UNKNOWN, so WHERE removes the row.",columns:["id","name","branch","cgpa"],rows:[[101,"Anu","AIML","8.6"],[103,"Charan","AIML","9.1"]]},
{name:"SELECT",action:"Project requested expressions",description:"Only name and cgpa remain in the result shape.",columns:["name","cgpa"],rows:[["Anu","8.6"],["Charan","9.1"]]},
{name:"ORDER BY",action:"Sort by cgpa descending",description:"Higher cgpa values appear first.",columns:["name","cgpa"],rows:[["Charan","9.1"],["Anu","8.6"]]},
{name:"LIMIT",action:"Keep the first two ordered rows",description:"Two rows are already present, so neither is removed. LIMIT is a common dialect form.",columns:["name","cgpa"],rows:[["Charan","9.1"],["Anu","8.6"]]}
]},
group:{query:"SELECT branch, COUNT(*) AS student_count\nFROM students\nWHERE cgpa IS NOT NULL\nGROUP BY branch\nHAVING COUNT(*) >= 2\nORDER BY student_count DESC;",stages:[
{name:"FROM",action:"Read every student",description:"The source has five rows.",columns:["name","branch","cgpa"],rows:[["Anu","AIML","8.6"],["Bharat","CSE","7.9"],["Charan","AIML","9.1"],["Divya","ECE","8.2"],["Esha","CSE","NULL"]]},
{name:"WHERE",action:"Remove NULL cgpa before grouping",description:"Esha is removed because cgpa IS NOT NULL is FALSE.",columns:["name","branch","cgpa"],rows:[["Anu","AIML","8.6"],["Bharat","CSE","7.9"],["Charan","AIML","9.1"],["Divya","ECE","8.2"]]},
{name:"GROUP BY",action:"Create one group per branch",description:"Rows are partitioned by equal branch values.",columns:["group","members"],rows:[["AIML","Anu, Charan"],["CSE","Bharat"],["ECE","Divya"]]},
{name:"HAVING",action:"Keep groups with at least two rows",description:"Only AIML has COUNT(*) >= 2.",columns:["group","members","count"],rows:[["AIML","Anu, Charan",2]]},
{name:"SELECT",action:"Calculate the result expressions",description:"The group key and aggregate receive their final column names.",columns:["branch","student_count"],rows:[["AIML",2]]},
{name:"ORDER BY",action:"Sort the grouped result",description:"Only one group remains, so its position is unchanged.",columns:["branch","student_count"],rows:[["AIML",2]]}
]},
join:{query:"SELECT s.name, d.dept_name\nFROM students s\nJOIN departments d ON d.dept_id = s.dept_id\nWHERE d.dept_name = 'AI & ML'\nORDER BY s.name;",stages:[
{name:"FROM",action:"Start with students",description:"The first relation contributes student rows and dept_id foreign keys.",columns:["id","name","dept_id"],rows:[[101,"Anu","D10"],[102,"Bharat","D20"],[103,"Charan","D10"],[104,"Divya","D30"]]},
{name:"JOIN",action:"Match department rows",description:"Each student row is extended with the department having the same dept_id.",columns:["name","dept_id","dept_name"],rows:[["Anu","D10","AI & ML"],["Bharat","D20","CSE"],["Charan","D10","AI & ML"],["Divya","D30","ECE"]]},
{name:"WHERE",action:"Keep AI & ML matches",description:"The department predicate retains Anu and Charan.",columns:["name","dept_id","dept_name"],rows:[["Anu","D10","AI & ML"],["Charan","D10","AI & ML"]]},
{name:"SELECT",action:"Project name and department",description:"Join keys are no longer needed in the displayed result.",columns:["name","dept_name"],rows:[["Anu","AI & ML"],["Charan","AI & ML"]]},
{name:"ORDER BY",action:"Sort names ascending",description:"Anu appears before Charan.",columns:["name","dept_name"],rows:[["Anu","AI & ML"],["Charan","AI & ML"]]}
]}
};
const nullRows=[
{id:101,name:"Anu",cgpa:8.6,branch:"AIML",mentor:null},
{id:102,name:"Bharat",cgpa:7.9,branch:"CSE",mentor:201},
{id:103,name:"Charan",cgpa:null,branch:"AIML",mentor:202},
{id:104,name:"Divya",cgpa:9.1,branch:null,mentor:null}
];
const nullCases={
cgpa:{expression:"cgpa > 8",values:["TRUE","FALSE","UNKNOWN","TRUE"],explanation:"A NULL cgpa cannot be compared with 8, so Charan's result is UNKNOWN."},
"not-cgpa":{expression:"NOT (cgpa > 8)",values:["FALSE","TRUE","UNKNOWN","FALSE"],explanation:"NOT reverses TRUE and FALSE, but NOT UNKNOWN remains UNKNOWN."},
branch:{expression:"branch = 'AIML'",values:["TRUE","FALSE","TRUE","UNKNOWN"],explanation:"Divya's NULL branch produces UNKNOWN under ordinary equality."},
mentor:{expression:"mentor_id IS NULL",values:["TRUE","FALSE","FALSE","TRUE"],explanation:"IS NULL is TRUE exactly for the rows whose mentor_id is missing."},
"bad-null":{expression:"mentor_id = NULL",values:["UNKNOWN","UNKNOWN","UNKNOWN","UNKNOWN"],explanation:"Ordinary equality with NULL never returns TRUE, even when both sides appear missing. Use IS NULL."}
};
function escapeHtml(value){return String(value).replace(/[&<>"']/g,function(character){return{"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[character];});}
function renderTable(columns,rows){return"<div class=\"trace-table-wrap\"><table><thead><tr>"+columns.map(function(column){return"<th>"+escapeHtml(column)+"</th>";}).join("")+"</tr></thead><tbody>"+rows.map(function(row){return"<tr>"+row.map(function(cell){return"<td class=\""+(cell==="NULL"?"is-null":"")+"\">"+escapeHtml(cell)+"</td>";}).join("")+"</tr>";}).join("")+"</tbody></table></div>";}
function initTrace(){
const select=document.getElementById("queryTraceScenario"),query=document.getElementById("traceQueryText"),buttons=document.getElementById("traceStageButtons"),stage=document.getElementById("traceStage"),previous=document.getElementById("previousTraceStage"),next=document.getElementById("nextTraceStage");
if(!select||!query||!buttons||!stage||!previous||!next)return;
let index=0;
function render(){
const scenario=scenarios[select.value],item=scenario.stages[index];
query.textContent=scenario.query;
buttons.innerHTML=scenario.stages.map(function(entry,entryIndex){return"<button type=\"button\" role=\"tab\" data-trace-index=\""+entryIndex+"\" aria-selected=\""+(entryIndex===index)+"\">"+(entryIndex+1)+". "+entry.name+"</button>";}).join("");
stage.innerHTML="<header><span>LOGICAL STAGE "+(index+1)+" OF "+scenario.stages.length+"</span><h3>"+item.name+": "+item.action+"</h3><p>"+item.description+"</p></header>"+renderTable(item.columns,item.rows)+"<div class=\"row-count\"><strong>"+item.rows.length+"</strong><span>row"+(item.rows.length===1?"":"s")+" at this stage</span></div>";
buttons.querySelectorAll("[data-trace-index]").forEach(function(button){button.addEventListener("click",function(){index=Number(button.dataset.traceIndex);render();});});
previous.disabled=index===0;next.disabled=index===scenario.stages.length-1;next.textContent=next.disabled?"Final result reached ✓":"Next stage →";
}
select.addEventListener("change",function(){index=0;render();});
previous.addEventListener("click",function(){if(index>0){index-=1;render();}});
next.addEventListener("click",function(){if(index<scenarios[select.value].stages.length-1){index+=1;render();}});
render();
}
function initNullPredictor(){
const buttons=Array.from(document.querySelectorAll("[data-null-case]")),result=document.getElementById("nullPredictorResult");if(!buttons.length||!result)return;
function render(key){
const item=nullCases[key],kept=item.values.filter(function(value){return value==="TRUE";}).length;
result.innerHTML="<header><span>WHERE "+escapeHtml(item.expression)+"</span><h3>"+kept+" of "+nullRows.length+" rows survive</h3><p>"+item.explanation+"</p></header><div class=\"null-result-table\"><table><thead><tr><th>id</th><th>name</th><th>cgpa</th><th>branch</th><th>mentor_id</th><th>Predicate</th><th>WHERE</th></tr></thead><tbody>"+nullRows.map(function(row,index){const value=item.values[index];return"<tr class=\"truth-"+value.toLowerCase()+"\"><td>"+row.id+"</td><td>"+row.name+"</td><td>"+(row.cgpa===null?"<b>NULL</b>":row.cgpa)+"</td><td>"+(row.branch===null?"<b>NULL</b>":row.branch)+"</td><td>"+(row.mentor===null?"<b>NULL</b>":row.mentor)+"</td><td><strong>"+value+"</strong></td><td>"+(value==="TRUE"?"KEPT":"FILTERED")+"</td></tr>";}).join("")+"</tbody></table></div>";
buttons.forEach(function(button){button.setAttribute("aria-selected",String(button.dataset.nullCase===key));});
}
buttons.forEach(function(button){button.addEventListener("click",function(){render(button.dataset.nullCase);});});render("cgpa");
}
function initChecks(){
const checks=Array.from(document.querySelectorAll(".concept-check")),score=document.getElementById("conceptScore"),answered=new Map();
function update(){let correct=0;answered.forEach(function(value){if(value)correct+=1;});if(score)score.textContent="Answered correctly: "+correct+" of "+checks.length;}
checks.forEach(function(check,index){const answer=check.dataset.answer,feedback=check.querySelector(".check-feedback"),buttons=Array.from(check.querySelectorAll("[data-option]"));buttons.forEach(function(button){button.addEventListener("click",function(){const correct=button.dataset.option===answer;answered.set(index,correct);buttons.forEach(function(item){item.classList.remove("is-correct","is-wrong");if(item.dataset.option===answer)item.classList.add("is-correct");});if(!correct)button.classList.add("is-wrong");feedback.innerHTML=correct?"<strong>Correct.</strong> "+explanations[index]:"Not quite. Review the highlighted answer. "+explanations[index];update();});});});
}
function readProgress(){try{const value=JSON.parse(localStorage.getItem(STORAGE_KEY)||"[]");return Array.isArray(value)?value.map(Number):[];}catch(error){return[];}}
function initCompletion(){const button=document.getElementById("completeLessonButton"),status=document.getElementById("lessonSidebarStatus");if(!button)return;let completed=readProgress();function render(){const done=completed.indexOf(9)!==-1;button.classList.toggle("is-complete",done);button.setAttribute("aria-pressed",String(done));button.textContent=done?"✓ Level 9 completed":"Mark Level 9 complete";if(status){status.textContent=done?"Level 9 completed":"Not completed";status.parentElement.classList.toggle("is-complete",done);}}button.addEventListener("click",function(){const index=completed.indexOf(9);if(index===-1)completed.push(9);else completed.splice(index,1);completed.sort(function(a,b){return a-b;});try{localStorage.setItem(STORAGE_KEY,JSON.stringify(completed));}catch(error){}render();});render();}
function initReading(){const bar=document.getElementById("lessonReadingBar"),links=Array.from(document.querySelectorAll(".lesson-section-link")),sections=links.map(function(link){return document.querySelector(link.getAttribute("href"));}).filter(Boolean);function update(){const max=document.documentElement.scrollHeight-window.innerHeight,percent=max>0?Math.min(100,Math.max(0,window.scrollY/max*100)):0;if(bar)bar.style.width=percent+"%";}window.addEventListener("scroll",update,{passive:true});update();if("IntersectionObserver"in window){const observer=new IntersectionObserver(function(entries){entries.forEach(function(entry){if(!entry.isIntersecting)return;links.forEach(function(link){link.classList.toggle("active",link.getAttribute("href")==="#"+entry.target.id);});});},{rootMargin:"-20% 0px -70% 0px"});sections.forEach(function(section){observer.observe(section);});}}
function init(){initTrace();initNullPredictor();initChecks();initCompletion();initReading();}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init,{once:true});else init();
}());
