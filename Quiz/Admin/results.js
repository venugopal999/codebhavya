(async()=>{
 const {client,$,requireAdmin,esc,localDate,fmtDuration}=CBQuiz;try{await requireAdmin()}catch{return}
 const id=new URLSearchParams(location.search).get("id");
 const {data,error}=await client.rpc("quiz_admin_results_v1",{p_quiz_id:id});
 if(error){$("rows").innerHTML=`<tr><td colspan="9">${esc(error.message)}</td></tr>`;return}

 $("title").textContent=data.title+" - Results";
 const submitted=data.participants.filter(x=>x.status==="submitted");
 const avg=submitted.length?submitted.reduce((s,x)=>s+Number(x.score||0),0)/submitted.length:0;

 $("stats").innerHTML=`
   <div class="stat"><strong>${data.participants.length}</strong><span>Joined</span></div>
   <div class="stat"><strong>${submitted.length}</strong><span>Submitted</span></div>
   <div class="stat"><strong>${avg.toFixed(1)}</strong><span>Average Score</span></div>
   <div class="stat"><strong>${data.max_score}</strong><span>Maximum</span></div>`;

 $("rows").innerHTML=data.participants.map(p=>`<tr>
   <td><a class="student-result-link" href="student-result.html?attempt=${encodeURIComponent(p.attempt_id)}">${esc(p.student_label)}</a></td>
   <td>${esc(p.status)}</td>
   <td>${p.score==null?"—":p.score}</td>
   <td>${Number(p.fullscreen_exit_count||0)} / 3</td><td>${Number(p.focus_exit_count||0)} / ${Number(p.focus_warning_limit||3)}</td>
   <td>${esc(localDate(p.joined_at))}</td>
   <td>${esc(localDate(p.submitted_at))}</td>
   <td>${p.duration_seconds==null?"—":fmtDuration(p.duration_seconds)}</td>
   <td><a class="btn ghost detail-btn" href="student-result.html?attempt=${encodeURIComponent(p.attempt_id)}">View</a></td>
 </tr>`).join("")||`<tr><td colspan="9">No attempts yet.</td></tr>`;

 const fs=data.feedback_summary||{};
 const entries=data.feedback_entries||[];
 const section=document.createElement("section");
 section.className="panel feedback-admin";
 section.innerHTML=`<h2>Student Feedback</h2>
   <div class="statrow">
     <div class="stat"><strong>${Number(fs.count||0)}</strong><span>Responses</span></div>
     <div class="stat"><strong>${Number(fs.avg_ui||0).toFixed(1)}</strong><span>UI / 5</span></div>
     <div class="stat"><strong>${Number(fs.avg_questions||0).toFixed(1)}</strong><span>Questions / 5</span></div>
     <div class="stat"><strong>${Number(fs.avg_overall||0).toFixed(1)}</strong><span>Overall / 5</span></div>
   </div>
   <div class="tablewrap"><table class="table"><thead><tr><th>Student</th><th>UI</th><th>Questions</th><th>Overall</th><th>Difficulty</th><th>Comment</th></tr></thead>
   <tbody>${entries.map(f=>`<tr><td>${esc(f.student_label)}</td><td>${f.ui_rating}/5</td><td>${f.question_rating}/5</td><td>${f.overall_rating}/5</td><td>${esc((f.difficulty||"—").replaceAll("_"," "))}</td><td>${esc(f.comment||"—")}</td></tr>`).join("")||'<tr><td colspan="6">No feedback submitted yet.</td></tr>'}</tbody></table></div>`;
 document.querySelector("main.shell").appendChild(section);
 $("analyticsLink").href=`analytics.html?id=${encodeURIComponent(id)}`;

 const attendancePanel=document.createElement("section");
 attendancePanel.className="panel attendance-panel";
 attendancePanel.innerHTML="<h2>Section Attendance</h2><p>Loading assigned rosters…</p>";
 document.querySelector("main.shell").appendChild(attendancePanel);
 const {data:attendance,error:attendanceError}=await client.rpc("quiz_admin_attendance_v10",{p_quiz_id:id});
 if(attendanceError){attendancePanel.innerHTML=`<h2>Section Attendance</h2><div class="notice bad">${esc(attendanceError.message)}</div>`}
 else if(!(attendance.sections||[]).length){attendancePanel.innerHTML='<h2>Section Attendance</h2><div class="notice">No sections were assigned to this quiz. The results above show students who joined by code.</div>'}
 else {
   const summary=(attendance.sections||[]).map(s=>`<tr><td>${esc(s.class_name)} · ${esc(s.section_name)}</td><td>${esc(s.course)}</td><td>${Number(s.assigned)}</td><td>${Number(s.joined)}</td><td>${Number(s.submitted)}</td><td>${Number(s.absent)}</td><td>${s.average_score==null?"—":Number(s.average_score).toFixed(2)}</td></tr>`).join("");
   const students=(attendance.students||[]).map(s=>`<tr><td>${esc(s.student_name||s.email)}<br><small>${esc(s.email)}</small></td><td>${esc(s.class_name)} · ${esc(s.section_name)}</td><td>${esc(s.status)}</td><td>${s.score==null?"—":Number(s.score)}</td><td>${esc(localDate(s.joined_at))}</td><td>${s.attempt_id?`<a class="btn ghost detail-btn" href="student-result.html?attempt=${encodeURIComponent(s.attempt_id)}">View</a>`:"—"}</td></tr>`).join("");
   attendancePanel.innerHTML=`<div class="section-head"><div><h2>Section Attendance</h2><p class="muted">Roster captured when sections were assigned to this quiz.</p></div><button class="btn teal" id="exportAttendance">Export Attendance CSV</button></div><h3>Section comparison</h3><div class="tablewrap"><table class="table"><thead><tr><th>Class / Section</th><th>Course</th><th>Assigned</th><th>Joined</th><th>Submitted</th><th>Absent</th><th>Average Score</th></tr></thead><tbody>${summary}</tbody></table></div><h3>Student register</h3><div class="tablewrap"><table class="table"><thead><tr><th>Student</th><th>Class / Section</th><th>Status</th><th>Score</th><th>Joined at</th><th>Details</th></tr></thead><tbody>${students||'<tr><td colspan="6">The assigned sections have no students.</td></tr>'}</tbody></table></div>`;
   $("exportAttendance").onclick=()=>{
     const heads=["Course","Class","Section","Student","Email","Status","Score","Joined","Submitted"];
     const rows=(attendance.students||[]).map(s=>[attendance.sections.find(x=>x.section_id===s.section_id)?.course||"",s.class_name,s.section_name,s.student_name,s.email,s.status,s.score??"",s.joined_at||"",s.submitted_at||""]);
     const field=v=>{let x=String(v??"");if(/^[\s]*[=+@\-]/.test(x))x="'"+x;return `"${x.replaceAll('"','""')}"`};
     const blob=new Blob(["\uFEFF"+[heads,...rows].map(row=>row.map(field).join(",")).join("\r\n")],{type:"text/csv;charset=utf-8"});
     const link=document.createElement("a");link.href=URL.createObjectURL(blob);link.download=`${attendance.title.replace(/[^a-z0-9_-]+/gi,"-")}-attendance.csv`;link.click();setTimeout(()=>URL.revokeObjectURL(link.href),1000);
   };
 }

 const participantExport=data.participants.map(p=>({
   Student:p.student_label,Status:p.status,Score:p.score??"",Max_Score:data.max_score,
   Fullscreen_Warnings:Number(p.fullscreen_exit_count||0),Tab_Window_Warnings:Number(p.focus_exit_count||0),Joined:localDate(p.joined_at),
   Submitted:localDate(p.submitted_at),Time_Seconds:p.duration_seconds??""
 }));
 const feedbackExport=(data.feedback_entries||[]).map(f=>({
   Student:f.student_label,UI_Rating:f.ui_rating,Question_Rating:f.question_rating,Overall_Rating:f.overall_rating,
   Difficulty:(f.difficulty||"").replaceAll("_"," "),Comment:f.comment||"",Submitted:localDate(f.created_at)
 }));

 function csvDownload(rows,name){
   if(!rows.length)rows=[{Info:"No data"}];
   const heads=Object.keys(rows[0]),lines=[heads.join(",")];
   rows.forEach(r=>lines.push(heads.map(h=>`"${String(r[h]??"").replaceAll('"','""')}"`).join(",")));
   const blob=new Blob([lines.join("\n")],{type:"text/csv;charset=utf-8"}),a=document.createElement("a");
   a.href=URL.createObjectURL(blob);a.download=name;a.click();URL.revokeObjectURL(a.href);
 }
 $("exportResultsCsv").onclick=()=>csvDownload(participantExport,`${data.title}-results.csv`);
 $("exportResultsXlsx").onclick=()=>{
   const wb=XLSX.utils.book_new();
   XLSX.utils.book_append_sheet(wb,XLSX.utils.json_to_sheet(participantExport),"Results");
   XLSX.utils.book_append_sheet(wb,XLSX.utils.json_to_sheet(feedbackExport.length?feedbackExport:[{Info:"No feedback"}]),"Feedback");
   XLSX.writeFile(wb,`${data.title}-results.xlsx`);
 };

})();