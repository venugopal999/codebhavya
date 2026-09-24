(async()=>{
 const {client,$,requireAdmin,esc,fmtDuration}=CBQuiz;try{await requireAdmin()}catch{return}
 const id=new URLSearchParams(location.search).get("id");if(!id){location.href="index.html";return}
 $("resultsLink").href=`results.html?id=${encodeURIComponent(id)}`;

 const {data,error}=await client.rpc("quiz_admin_analytics_v6",{p_quiz_id:id});
 if(error){document.querySelector("main").innerHTML=`<section class="panel"><div class="notice bad">${esc(error.message)}</div></section>`;return}
 $("analyticsTitle").textContent=data.title+" - Analytics";
 const s=data.summary||{};
 $("analyticsStats").innerHTML=`
  <div class="analytics-stat"><span>Participants</span><strong>${s.participants||0}</strong></div>
  <div class="analytics-stat"><span>Submitted</span><strong>${s.submitted||0}</strong></div>
  <div class="analytics-stat"><span>Average</span><strong>${Number(s.average_score||0).toFixed(1)}</strong></div>
  <div class="analytics-stat"><span>Median</span><strong>${Number(s.median_score||0).toFixed(1)}</strong></div>
  <div class="analytics-stat"><span>Highest</span><strong>${Number(s.highest_score||0).toFixed(1)}</strong></div>
  <div class="analytics-stat"><span>Lowest</span><strong>${Number(s.lowest_score||0).toFixed(1)}</strong></div>
  <div class="analytics-stat"><span>≥ 40%</span><strong>${Number(s.pass_percentage_40||0).toFixed(1)}%</strong></div>
  <div class="analytics-stat"><span>Avg Time</span><strong>${fmtDuration(s.average_duration_seconds||0)}</strong></div>
  <div class="analytics-stat"><span>Full-screen Warnings</span><strong>${s.fullscreen_warning_total||0}</strong></div>
  <div class="analytics-stat"><span>Students FS Warned</span><strong>${s.students_with_warnings||0}</strong></div>
  <div class="analytics-stat"><span>Tab/Window Warnings</span><strong>${s.focus_warning_total||0}</strong></div>
  <div class="analytics-stat"><span>Students Focus Warned</span><strong>${s.students_with_focus_warnings||0}</strong></div>`;

 const topics=data.topics||[];
 $("topicStats").innerHTML=topics.map(t=>`<div class="topic-card">
   <div class="topic-card-head"><strong>${esc(t.topic)}</strong><span>${t.question_count} question${t.question_count===1?"":"s"}</span></div>
   <div class="topic-card-score">${Number(t.accuracy||0).toFixed(1)}%</div>
   <div class="topic-card-meta"><span>${t.correct_count} correct</span><span>${t.wrong_count} wrong</span><span>${t.unanswered_count} unanswered</span></div>
   <div class="topic-bar"><i style="width:${Math.max(0,Math.min(100,Number(t.accuracy||0)))}%"></i></div>
 </div>`).join("")||'<div class="notice">Add Topic values to quiz questions to see topic-wise performance.</div>';

 const qs=data.questions||[];
 $("analyticsRows").innerHTML=qs.map(q=>`<tr>
   <td>Q${q.position}</td>
   <td><strong>${esc(q.question_text)}</strong><br><span class="muted">${esc((q.question_type||"single_mcq").replaceAll("_"," "))}${q.topic?` · ${esc(q.topic)}`:""} · ${esc(q.difficulty||"Medium")}</span>${q.accuracy===data.easiest_accuracy?'<span class="analytics-label easy">Easiest</span>':""}${q.accuracy===data.hardest_accuracy?'<span class="analytics-label hard">Hardest</span>':""}</td>
   <td>${q.correct_count}</td><td>${q.wrong_count}</td><td>${q.unanswered_count}</td>
   <td><strong>${Number(q.accuracy||0).toFixed(1)}%</strong></td><td>${fmtDuration(q.average_time_seconds||0)}</td>
   <td><div class="option-dist">${(q.options||[]).map(o=>`<div><span>${esc(o.label)}${o.is_correct?" ✓":""}</span><strong>${o.count}</strong></div>`).join("")}</div></td>
 </tr>`).join("")||'<tr><td colspan="7">No questions.</td></tr>';

 const exportRows=qs.map(q=>({
   Question:`Q${q.position}`,
   Text:q.question_text,
   Correct:q.correct_count,
   Wrong:q.wrong_count,
   Unanswered:q.unanswered_count,
   Accuracy_Percent:Number(q.accuracy||0).toFixed(2),Average_Time_Seconds:Number(q.average_time_seconds||0),
   Option_Distribution:(q.options||[]).map(o=>`${o.label}: ${o.count}${o.is_correct?" (correct)":""}`).join(" | ")
 }));

 function saveCsv(){
   const headers=Object.keys(exportRows[0]||{Question:""}), lines=[headers.join(",")];
   exportRows.forEach(r=>lines.push(headers.map(h=>`"${String(r[h]??"").replaceAll('"','""')}"`).join(",")));
   const blob=new Blob([lines.join("\n")],{type:"text/csv;charset=utf-8"}),a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download=`${data.title}-analytics.csv`;a.click();URL.revokeObjectURL(a.href);
 }
 $("csvAnalytics").onclick=saveCsv;
 $("xlsxAnalytics").onclick=()=>{
   const wb=XLSX.utils.book_new();
   XLSX.utils.book_append_sheet(wb,XLSX.utils.json_to_sheet([{
     Quiz:data.title,Participants:s.participants,Submitted:s.submitted,Average:s.average_score,Median:s.median_score,
     Highest:s.highest_score,Lowest:s.lowest_score,Pass_Percentage_40:s.pass_percentage_40,
     Average_Time_Seconds:s.average_duration_seconds,Fullscreen_Warnings:s.fullscreen_warning_total
   }]),"Summary");
   XLSX.utils.book_append_sheet(wb,XLSX.utils.json_to_sheet(topics.map(t=>({
     Topic:t.topic,Questions:t.question_count,Correct:t.correct_count,Wrong:t.wrong_count,
     Unanswered:t.unanswered_count,Accuracy_Percent:t.accuracy
   }))),"Topics");
   XLSX.utils.book_append_sheet(wb,XLSX.utils.json_to_sheet(exportRows),"Questions");
   XLSX.writeFile(wb,`${data.title}-analytics.xlsx`);
 };
})();