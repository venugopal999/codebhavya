(function(){"use strict";
const COURSE_KEY="codebhavya.dbms.course.progress.v1",PLANNER_KEY="codebhavya.dbms.level18.project.v1";
const explanations=[
"Authentication verifies a claimed identity; authorization evaluates what that verified identity may access or change.",
"Least privilege limits an identity to the minimum operations, objects and scope required for its current responsibility.",
"Parameterized execution keeps untrusted values separate from SQL structure and is the primary defense for input values.",
"Identifiers usually cannot be bound like values, so map a constrained user choice to a trusted table, column or direction.",
"At-rest encryption protects stored database files and backups against some offline-access threats; it does not replace authorization.",
"RPO is the tolerated data-loss window. An RPO of 15 minutes requires a recovery design capable of reaching approximately that point.",
"Replication can faithfully copy accidental deletion, corruption or malicious changes, so independent recoverable backups remain necessary.",
"Only an actual restore and verification proves that backup data, keys, procedures and recovery timing work together.",
"Strong evidence includes requirements, models, scripts, tests, plans, security decisions and honest trade-offs—not only screenshots.",
"A clear explanation starts with the problem, users, constraints and success criterion before discussing implementation choices."
];
const permissions={
student:{"own-profile":["select","update"],grades:["select"]},
faculty:{grades:["select","insert","update"]},
analyst:{"sales-view":["select"]},
operator:{"audit-log":["select"]}
};
const roleNames={student:"student_portal",faculty:"faculty_portal",analyst:"report_analyst",operator:"db_operator"};
const objectNames={"own-profile":"own_student_profile","grades":"grades","sales-view":"monthly_sales","audit-log":"audit_log"};
const rolePurposes={student:"A student can read personal academic data and update only the permitted profile surface.",faculty:"Faculty can record and revise grades but cannot delete the academic record through this role.",analyst:"The analyst reads an approved reporting view without direct business-table write access.",operator:"The operator can inspect audit events but cannot alter or erase them through this role."};
const projects={
campus:{level:"FOUNDATION PROJECT",title:"Campus Course & Results System",goal:"Prove data modelling, normalization, constraints and role-specific reporting.",items:[
["requirements","Document users, workflows, scope and five business rules"],
["model","Create an ER diagram with keys and cardinalities"],
["schema","Map to tables and justify a 3NF design"],
["integrity","Implement PK, FK, UNIQUE, CHECK and nullability rules"],
["queries","Prepare eight representative joins, aggregates and subqueries"],
["security","Provide student, faculty and administrator role matrix"],
["tests","Show valid, invalid and edge-case results"],
["demo","Record a reproducible enrolment-to-result demonstration"]]},
commerce:{level:"INTERMEDIATE PROJECT",title:"E-commerce Orders & Inventory",goal:"Prove transaction correctness, concurrency handling and evidence-based performance.",items:[
["requirements","Define order, payment, cancellation and stock invariants"],
["model","Create customer, product, inventory, order and payment model"],
["transaction","Implement atomic order placement and rollback path"],
["concurrency","Prevent overselling under two simultaneous orders"],
["analytics","Build sales, cohort and ranking queries"],
["indexes","Justify indexes with before-and-after plan evidence"],
["tests","Test failure, retry, insufficient stock and duplicate payment"],
["demo","Demonstrate successful order and controlled failure"]]},
hospital:{level:"ADVANCED PROJECT",title:"Hospital Access & Audit Platform",goal:"Prove least privilege, sensitive-data handling, auditing and recoverability.",items:[
["requirements","Classify patient, clinical, billing and operational data"],
["model","Design patient, visit, prescription, staff and consent schema"],
["roles","Create least-privilege doctor, nurse, billing and auditor matrix"],
["injection","Use parameterized application access and allow-listed identifiers"],
["protection","Document encryption, secrets and retention decisions"],
["audit","Capture meaningful access/change events without logging secrets"],
["recovery","Run a backup restoration and measure achieved RPO/RTO"],
["demo","Present authorized access, denied access and an audit trail"]]}
};
function esc(value){return String(value).replace(/[&<>"']/g,function(char){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char]})}
function checkAccess(role,object,action){const allowed=Boolean(permissions[role]&&permissions[role][object]&&permissions[role][object].indexOf(action)!==-1);return{allowed:allowed,role:roleNames[role],object:objectNames[object],action:action.toUpperCase(),reason:allowed?rolePurposes[role]:"This capability is outside the selected role's defined responsibility, so default-deny applies.",sql:allowed?"GRANT "+action.toUpperCase()+" ON "+objectNames[object]+" TO "+roleNames[role]+";":"-- No GRANT: keep access denied\nREVOKE "+action.toUpperCase()+" ON "+objectNames[object]+" FROM "+roleNames[role]+";"}}
function initPrivilege(){const role=document.getElementById("securityRole"),object=document.getElementById("securityObject"),action=document.getElementById("securityAction"),verdict=document.getElementById("securityVerdict"),policy=document.getElementById("securityPolicy"),sql=document.getElementById("securitySql");if(!role)return;function draw(){const result=checkAccess(role.value,object.value,action.value);verdict.className="security-page__access-verdict "+(result.allowed?"is-allowed":"is-denied");verdict.innerHTML="<span>"+(result.allowed?"ACCESS ALLOWED":"ACCESS DENIED")+"</span><h3>"+result.role+" → "+result.action+" → "+result.object+"</h3><p>"+result.reason+"</p>";const steps=[["Identity",result.role],["Role policy",result.action+" on "+result.object],["Decision",result.allowed?"Explicit permission found":"No explicit permission"]];policy.innerHTML=steps.map(function(step,index){return'<div><span>'+step[0]+'</span><b>'+step[1]+'</b></div>'+(index<steps.length-1?"<i>→</i>":"")}).join("");sql.textContent=result.sql}[role,object,action].forEach(function(control){control.addEventListener("change",draw)});draw()}
function loadPlanner(){try{return JSON.parse(localStorage.getItem(PLANNER_KEY)||"{}")}catch(error){return{}}}
function initPlanner(){const tabs=[].slice.call(document.querySelectorAll("[data-project]")),level=document.getElementById("plannerLevel"),title=document.getElementById("plannerTitle"),goal=document.getElementById("plannerGoal"),percent=document.getElementById("plannerPercent"),bar=document.getElementById("plannerBar"),checklist=document.getElementById("plannerChecklist"),next=document.getElementById("plannerNext");if(!tabs.length)return;let active="campus",saved=loadPlanner();
function key(project,item){return project+":"+item}
function draw(){const project=projects[active],done=project.items.filter(function(item){return Boolean(saved[key(active,item[0])])}).length,value=Math.round(done/project.items.length*100);level.textContent=project.level;title.textContent=project.title;goal.textContent=project.goal;percent.textContent=value+"%";bar.style.width=value+"%";checklist.innerHTML=project.items.map(function(item,index){const checked=Boolean(saved[key(active,item[0])]);return'<label class="'+(checked?"is-ready":"")+'"><input type="checkbox" data-evidence="'+esc(item[0])+'" '+(checked?"checked":"")+'><span><b>'+(index+1)+'. '+esc(item[1])+'</b><small>'+esc(item[0].toUpperCase())+' EVIDENCE</small></span></label>'}).join("");const missing=project.items.find(function(item){return !saved[key(active,item[0])]});next.innerHTML=value===100?"<strong>Portfolio-ready checklist complete</strong><p>Verify every checked item can be opened, executed or explained before claiming completion.</p>":"<strong>Next evidence task</strong><p>"+esc(missing[1])+"</p>";[].slice.call(checklist.querySelectorAll("[data-evidence]")).forEach(function(input){input.addEventListener("change",function(){saved[key(active,input.dataset.evidence)]=input.checked;localStorage.setItem(PLANNER_KEY,JSON.stringify(saved));draw()})});tabs.forEach(function(tab){tab.setAttribute("aria-selected",String(tab.dataset.project===active))})}
tabs.forEach(function(tab){tab.addEventListener("click",function(){active=tab.dataset.project;draw()})});draw()}
function initChecks(){const checks=[].slice.call(document.querySelectorAll(".concept-check")),score=document.getElementById("conceptScore"),answered=new Map();checks.forEach(function(check,index){[].slice.call(check.querySelectorAll("[data-option]")).forEach(function(button){button.addEventListener("click",function(){const correct=button.dataset.option===check.dataset.answer;answered.set(index,correct);[].slice.call(check.querySelectorAll("[data-option]")).forEach(function(option){option.classList.remove("is-correct","is-wrong");if(option.dataset.option===check.dataset.answer)option.classList.add("is-correct")});if(!correct)button.classList.add("is-wrong");check.querySelector(".check-feedback").innerHTML=(correct?"<strong>Correct.</strong> ":"Not quite. Review the highlighted answer. ")+explanations[index];score.textContent="Answered correctly: "+Array.from(answered.values()).filter(Boolean).length+" of "+checks.length})})})}
function readProgress(){try{return JSON.parse(localStorage.getItem(COURSE_KEY)||"[]").map(Number)}catch(error){return[]}}
function initComplete(){const button=document.getElementById("completeLessonButton"),status=document.getElementById("lessonSidebarStatus");if(!button)return;let progress=readProgress();function draw(){const done=progress.indexOf(18)!==-1;button.textContent=done?"✓ Level 18 and DBMS course completed":"Mark Level 18 complete";button.classList.toggle("is-complete",done);button.setAttribute("aria-pressed",String(done));status.textContent=done?"Course completed":"Not completed"}button.addEventListener("click",function(){progress=progress.indexOf(18)!==-1?progress.filter(function(item){return item!==18}):progress.concat(18);localStorage.setItem(COURSE_KEY,JSON.stringify(progress));draw()});draw()}
function initReading(){const bar=document.getElementById("lessonReadingBar"),links=[].slice.call(document.querySelectorAll(".lesson-section-link")),sections=links.map(function(link){return document.querySelector(link.getAttribute("href"))}).filter(Boolean);function update(){const maximum=document.documentElement.scrollHeight-innerHeight;bar.style.width=(maximum?Math.min(100,scrollY/maximum*100):0)+"%"}addEventListener("scroll",update,{passive:true});update();if("IntersectionObserver"in window){const observer=new IntersectionObserver(function(entries){entries.forEach(function(entry){if(entry.isIntersecting)links.forEach(function(link){link.classList.toggle("active",link.hash==="#"+entry.target.id)})})},{rootMargin:"-20% 0px -70% 0px"});sections.forEach(function(section){observer.observe(section)})}}
function init(){initPrivilege();initPlanner();initChecks();initComplete();initReading()}
if(typeof window!=="undefined")window.DBMSLevel18Test={permissions:permissions,projects:projects,checkAccess:checkAccess};
document.readyState==="loading"?document.addEventListener("DOMContentLoaded",init,{once:true}):init();
})();

