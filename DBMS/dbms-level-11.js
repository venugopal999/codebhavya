(function(){
"use strict";
const STORAGE_KEY="codebhavya.dbms.course.progress.v1";
const initialRows=[
{id:101,name:"Anu",branch:"AIML",cgpa:8.6,status:"ACTIVE"},
{id:102,name:"Bharat",branch:"CSE",cgpa:7.9,status:"ACTIVE"},
{id:103,name:"Charan",branch:"AIML",cgpa:9.1,status:"ACTIVE"},
{id:104,name:"Divya",branch:"ECE",cgpa:8.2,status:"WITHDRAWN"},
{id:105,name:"Esha",branch:"CSE",cgpa:null,status:"ACTIVE"}
];
const safetyCases={
keyed:{decision:"PROCEED AFTER PREVIEW",tone:"safe",title:"Update one student by primary key",statement:"UPDATE students SET cgpa = 8.8 WHERE student_id = 102;",reason:"A unique-key predicate has a predictable one-row blast radius, but still verify the identity and affected-row count.",steps:["Preview student_id 102.","Confirm exactly one row.","Apply inside the intended transaction.","Verify the returned id and cgpa."]},
missing:{decision:"STOP",tone:"danger",title:"Update status without WHERE",statement:"UPDATE students SET status = 'INACTIVE';",reason:"Every row is targeted. If that is not the explicitly reviewed requirement, the statement is unsafe.",steps:["Do not execute it.","Write the intended predicate.","Preview matching primary keys.","Require review for a deliberate whole-table change."]},
cascade:{decision:"REVISE AND INSPECT",tone:"warning",title:"Delete a parent row with cascading children",statement:"DELETE FROM departments WHERE dept_id = 10;",reason:"The visible predicate targets one department, but ON DELETE CASCADE can expand the effect into related tables.",steps:["Inspect foreign-key actions.","Count affected child rows.","Confirm retention obligations.","Test rollback and restore paths."]},
batch:{decision:"PROCEED IN CONTROLLED BATCHES",tone:"warning",title:"Insert 500,000 imported records",statement:"INSERT INTO students (...) SELECT ... FROM staging_students;",reason:"The SQL may be valid while locks, logging, constraint failures or one bad source row make the operation risky.",steps:["Validate source types and keys first.","Measure on representative data.","Choose batch or atomic behavior intentionally.","Monitor errors, time and storage."]},
retry:{decision:"REVISE FOR IDEMPOTENCY",tone:"warning",title:"Client retries an INSERT after a timeout",statement:"INSERT INTO payments (request_id, amount) VALUES ('R42', 500);",reason:"The first request may have succeeded even though its response was lost. A retry can duplicate the business action.",steps:["Use a unique request or idempotency key.","Choose an explicit conflict policy.","Return the existing result on retry.","Test concurrent duplicate requests."]}
};
const explanations=[
"An explicit column list documents positional mapping and prevents accidental dependence on physical table order.",
"Without a WHERE clause, every row in the target relation normally qualifies for UPDATE.",
"Running SELECT with the identical predicate reveals row identities and count before destructive DML.",
"A multi-row VALUES list lets one INSERT statement add several rows.",
"An unexpected row count is evidence that the predicate or assumptions are wrong; stop or roll back before continuing.",
"ON CONFLICT, ON DUPLICATE KEY and MERGE capabilities differ across database products.",
"SET column = NULL explicitly stores the missing-value marker when the column permits it.",
"The declared referential action can reject the delete, cascade it, or alter referencing child values.",
"RETURNING or equivalent facilities expose changed rows directly when the selected DBMS supports them.",
"Preview, validate, change and verify is the general safe sequence for data-changing SQL."
];
let rows=clone(initialRows),operation="insert",pending=null,undoStack=[];
function clone(value){return JSON.parse(JSON.stringify(value));}
function escapeHtml(value){return String(value).replace(/[&<>"']/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[c];});}
function sqlString(value){return"'"+String(value).replace(/'/g,"''")+"'";}
function renderTable(previewRows,kind,matched){
const target=document.getElementById("dmlDataTable"),count=document.getElementById("dmlRowCount");if(!target)return;
const ids=matched||[];
target.innerHTML="<div class=\"dml-table-wrap\"><table><thead><tr><th>student_id</th><th>name</th><th>branch</th><th>cgpa</th><th>status</th></tr></thead><tbody>"+previewRows.map(function(row){let cls="";if(ids.indexOf(row.id)!==-1)cls=kind==="delete"?"preview-delete":kind==="insert"?"preview-new":"preview-change";return"<tr class=\""+cls+"\"><td>"+row.id+"</td><td>"+escapeHtml(row.name)+"</td><td>"+escapeHtml(row.branch)+"</td><td>"+(row.cgpa===null?"<b>NULL</b>":row.cgpa.toFixed(1))+"</td><td>"+escapeHtml(row.status)+"</td></tr>";}).join("")+"</tbody></table></div>";
if(count)count.textContent=previewRows.length+" row"+(previewRows.length===1?"":"s")+(pending?" after preview":"");
}
function options(values){return values.map(function(v){return"<option value=\""+escapeHtml(v)+"\">"+escapeHtml(v)+"</option>";}).join("");}
function controlMarkup(){
if(operation==="insert")return"<div class=\"dml-field-grid\"><label>Student ID<input type=\"number\" name=\"id\" value=\"106\" required></label><label>Name<input name=\"name\" value=\"Farah\" required></label><label>Branch<select name=\"branch\">"+options(["AIML","CSE","ECE","IT"])+"</select></label><label>CGPA<input type=\"number\" name=\"cgpa\" min=\"0\" max=\"10\" step=\"0.1\" value=\"8.7\"></label><label>Status<select name=\"status\">"+options(["ACTIVE","INACTIVE","WITHDRAWN"])+"</select></label></div>";
const match="<label>Match column<select name=\"matchField\">"+options(["student_id","branch","status"])+"</select></label><label>Match value<input name=\"matchValue\" value=\"101\" required></label>";
if(operation==="update")return"<div class=\"dml-field-grid\">"+match+"<label>Change column<select name=\"changeField\">"+options(["branch","cgpa","status"])+"</select></label><label>New value<input name=\"changeValue\" value=\"9.0\" required></label></div>";
return"<div class=\"dml-field-grid\">"+match+"</div><label class=\"danger-confirm\"><input type=\"checkbox\" name=\"confirmDelete\"> I reviewed the matching rows and intend to delete them.</label>";
}
function setMessage(tone,title,text){const box=document.getElementById("dmlRiskMessage");box.className="dml-risk-message "+tone;box.innerHTML="<strong>"+escapeHtml(title)+"</strong><p>"+escapeHtml(text)+"</p>";}
function findMatches(field,value){
return rows.filter(function(row){if(field==="student_id")return row.id===Number(value);return String(row[field])===String(value).toUpperCase();});
}
function readForm(){const form=document.getElementById("dmlLabForm"),data=new FormData(form);return Object.fromEntries(data.entries());}
function preview(event){
event.preventDefault();pending=null;document.getElementById("applyDmlButton").disabled=true;const data=readForm(),before=clone(rows),after=clone(rows),matched=[];let sql="";
if(operation==="insert"){
const id=Number(data.id),cgpa=data.cgpa===""?null:Number(data.cgpa),name=String(data.name||"").trim(),branch=String(data.branch),status=String(data.status);
if(!Number.isInteger(id)||id<=0)return setMessage("danger","Invalid student ID","Enter a positive whole-number key.");
if(rows.some(function(r){return r.id===id;}))return setMessage("danger","Primary-key conflict","student_id "+id+" already exists. Choose a unique key.");
if(!name)return setMessage("danger","Name is required","NOT NULL would reject an empty student name.");
if(cgpa!==null&&(Number.isNaN(cgpa)||cgpa<0||cgpa>10))return setMessage("danger","CHECK constraint failed","CGPA must be between 0 and 10.");
after.push({id:id,name:name,branch:branch,cgpa:cgpa,status:status});matched.push(id);
sql="INSERT INTO students (student_id, name, branch, cgpa, status)\nVALUES ("+id+", "+sqlString(name)+", "+sqlString(branch)+", "+(cgpa===null?"NULL":cgpa)+", "+sqlString(status)+")\nRETURNING *;";
setMessage("safe","1 new row previewed","The key and values satisfy this classroom schema. Apply only after reviewing the highlighted row.");
}else{
const hits=findMatches(data.matchField,data.matchValue);if(!hits.length){pending=null;renderTable(rows);document.getElementById("applyDmlButton").disabled=true;return setMessage("warning","0 rows matched","Revise the match value; applying this statement would change nothing.");}
hits.forEach(function(r){matched.push(r.id);});
const predicate=data.matchField+" = "+(data.matchField==="student_id"?Number(data.matchValue):sqlString(String(data.matchValue).toUpperCase()));
if(operation==="update"){
let newValue=String(data.changeValue).trim();
if(data.changeField==="cgpa"){newValue=Number(newValue);if(Number.isNaN(newValue)||newValue<0||newValue>10)return setMessage("danger","CHECK constraint failed","CGPA must be between 0 and 10.");}
else{newValue=newValue.toUpperCase();if(data.changeField==="branch"&&["AIML","CSE","ECE","IT"].indexOf(newValue)===-1)return setMessage("danger","Invalid branch","Use AIML, CSE, ECE or IT in this classroom schema.");if(data.changeField==="status"&&["ACTIVE","INACTIVE","WITHDRAWN"].indexOf(newValue)===-1)return setMessage("danger","Invalid status","Use ACTIVE, INACTIVE or WITHDRAWN in this classroom schema.");}
after.forEach(function(r){if(matched.indexOf(r.id)!==-1)r[data.changeField]=newValue;});
sql="UPDATE students\nSET "+data.changeField+" = "+(typeof newValue==="number"?newValue:sqlString(newValue))+"\nWHERE "+predicate+"\nRETURNING *;";
setMessage(hits.length===1?"safe":"warning",hits.length+" row"+(hits.length===1?"":"s")+" will change",hits.length===1?"The predicate has a narrow preview. Verify the highlighted identity.":"A non-key predicate affects multiple rows. Confirm that this full set is intentional.");
}else{
if(!document.querySelector('[name="confirmDelete"]').checked)return setMessage("danger","Deletion not confirmed","Review the rows, then select the confirmation checkbox.");
for(let i=after.length-1;i>=0;i--)if(matched.indexOf(after[i].id)!==-1)after.splice(i,1);
sql="DELETE FROM students\nWHERE "+predicate+"\nRETURNING *;";
setMessage(hits.length===1?"warning":"danger",hits.length+" row"+(hits.length===1?"":"s")+" will be deleted","Deleted rows disappear after Apply. Use Undo to restore this simulated dataset.");
}
}
pending={before:before,after:after,kind:operation,matched:matched};document.getElementById("generatedDml").textContent=sql;document.getElementById("applyDmlButton").disabled=false;
if(operation==="delete")renderTable(before,"delete",matched);else renderTable(after,operation,matched);
}
function applyPreview(){if(!pending)return;undoStack.push(clone(pending.before));rows=clone(pending.after);const count=pending.matched.length;pending=null;document.getElementById("applyDmlButton").disabled=true;document.getElementById("undoDmlButton").disabled=false;setMessage("safe","Change applied in the simulator",count+" row"+(count===1?" was":"s were")+" affected. Verify the current dataset and generated statement.");renderTable(rows);}
function initDmlLab(){
const form=document.getElementById("dmlLabForm"),fields=document.getElementById("dmlControlFields");if(!form||!fields)return;
function choose(next){operation=next;pending=null;fields.innerHTML=controlMarkup();document.querySelectorAll("[data-dml-operation]").forEach(function(b){b.setAttribute("aria-selected",String(b.dataset.dmlOperation===next));});document.getElementById("applyDmlButton").disabled=true;document.getElementById("generatedDml").textContent="Complete the fields and choose Preview change.";setMessage("neutral","Preview required","No simulated data changes until you preview and apply.");renderTable(rows);}
document.querySelectorAll("[data-dml-operation]").forEach(function(button){button.addEventListener("click",function(){choose(button.dataset.dmlOperation);});});
form.addEventListener("submit",preview);document.getElementById("applyDmlButton").addEventListener("click",applyPreview);
document.getElementById("undoDmlButton").addEventListener("click",function(){if(!undoStack.length)return;rows=undoStack.pop();pending=null;this.disabled=undoStack.length===0;document.getElementById("applyDmlButton").disabled=true;setMessage("warning","Last change undone","The previous classroom dataset has been restored.");renderTable(rows);});
document.getElementById("resetDmlButton").addEventListener("click",function(){rows=clone(initialRows);pending=null;undoStack=[];document.getElementById("applyDmlButton").disabled=true;document.getElementById("undoDmlButton").disabled=true;setMessage("neutral","Dataset reset","The original five classroom rows are restored.");renderTable(rows);});
choose("insert");
}
function initSafety(){const buttons=Array.from(document.querySelectorAll("[data-safety-case]")),result=document.getElementById("safetyResult");if(!buttons.length||!result)return;function render(key){const item=safetyCases[key];result.className="dml-safety-result "+item.tone;result.innerHTML="<span>"+item.decision+"</span><h3>"+item.title+"</h3><pre><code>"+escapeHtml(item.statement)+"</code></pre><p>"+item.reason+"</p><ol>"+item.steps.map(function(step){return"<li>"+escapeHtml(step)+"</li>";}).join("")+"</ol>";buttons.forEach(function(b){b.setAttribute("aria-selected",String(b.dataset.safetyCase===key));});}buttons.forEach(function(b){b.addEventListener("click",function(){render(b.dataset.safetyCase);});});render("keyed");}
function initChecks(){const checks=Array.from(document.querySelectorAll(".concept-check")),score=document.getElementById("conceptScore"),answered=new Map();function update(){let correct=0;answered.forEach(function(v){if(v)correct++;});if(score)score.textContent="Answered correctly: "+correct+" of "+checks.length;}checks.forEach(function(check,index){const answer=check.dataset.answer,feedback=check.querySelector(".check-feedback"),buttons=Array.from(check.querySelectorAll("[data-option]"));buttons.forEach(function(button){button.addEventListener("click",function(){const correct=button.dataset.option===answer;answered.set(index,correct);buttons.forEach(function(item){item.classList.remove("is-correct","is-wrong");if(item.dataset.option===answer)item.classList.add("is-correct");});if(!correct)button.classList.add("is-wrong");feedback.innerHTML=correct?"<strong>Correct.</strong> "+explanations[index]:"Not quite. Review the highlighted answer. "+explanations[index];update();});});});}
function readProgress(){try{const v=JSON.parse(localStorage.getItem(STORAGE_KEY)||"[]");return Array.isArray(v)?v.map(Number):[];}catch(e){return[];}}
function initCompletion(){const button=document.getElementById("completeLessonButton"),status=document.getElementById("lessonSidebarStatus");if(!button)return;let completed=readProgress();function render(){const done=completed.indexOf(11)!==-1;button.classList.toggle("is-complete",done);button.setAttribute("aria-pressed",String(done));button.textContent=done?"✓ Level 11 completed":"Mark Level 11 complete";if(status){status.textContent=done?"Level 11 completed":"Not completed";status.parentElement.classList.toggle("is-complete",done);}}button.addEventListener("click",function(){const i=completed.indexOf(11);if(i===-1)completed.push(11);else completed.splice(i,1);completed.sort(function(a,b){return a-b;});try{localStorage.setItem(STORAGE_KEY,JSON.stringify(completed));}catch(e){}render();});render();}
function initReading(){const bar=document.getElementById("lessonReadingBar"),links=Array.from(document.querySelectorAll(".lesson-section-link")),sections=links.map(function(l){return document.querySelector(l.getAttribute("href"));}).filter(Boolean);function update(){const max=document.documentElement.scrollHeight-window.innerHeight;if(bar)bar.style.width=(max>0?Math.min(100,Math.max(0,window.scrollY/max*100)):0)+"%";}window.addEventListener("scroll",update,{passive:true});update();if("IntersectionObserver"in window){const observer=new IntersectionObserver(function(entries){entries.forEach(function(entry){if(!entry.isIntersecting)return;links.forEach(function(link){link.classList.toggle("active",link.getAttribute("href")==="#"+entry.target.id);});});},{rootMargin:"-20% 0px -70% 0px"});sections.forEach(function(s){observer.observe(s);});}}
function init(){initDmlLab();initSafety();initChecks();initCompletion();initReading();}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init,{once:true});else init();
}());
