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
   const cell=value=>{if(typeof value==='number'&&Number.isFinite(value))return String(value);let s=String(value??'');if(/^\s*[=+@-]/.test(s))s="'"+s;return `"${s.replaceAll('"','""')}"`};
   rows.forEach(r=>lines.push(heads.map(h=>cell(r[h])).join(",")));
   const blob=new Blob([lines.join("\n")],{type:"text/csv;charset=utf-8"}),a=document.createElement("a");
   a.href=URL.createObjectURL(blob);a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);
 }
 $("exportResultsCsv").onclick=()=>csvDownload(participantExport,`${data.title}-results.csv`);
 $("exportResultsXlsx").onclick=()=>{
   const wb=XLSX.utils.book_new();
   XLSX.utils.book_append_sheet(wb,XLSX.utils.json_to_sheet(participantExport),"Results");
   XLSX.utils.book_append_sheet(wb,XLSX.utils.json_to_sheet(feedbackExport.length?feedbackExport:[{Info:"No feedback"}]),"Feedback");
   XLSX.writeFile(wb,`${data.title}-results.xlsx`);
 };

})();