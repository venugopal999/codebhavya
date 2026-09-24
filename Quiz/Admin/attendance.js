(async()=>{
  const {client,$,requireAdmin,esc,localDate}=CBQuiz;
  try{await requireAdmin()}catch{return}
  const id=new URLSearchParams(location.search).get('id');if(!id)return;
  const panel=document.createElement('section');panel.className='panel';
  panel.innerHTML='<h2>Section Attendance</h2><p class="muted">Loading assigned rosters…</p>';
  document.querySelector('main.shell').appendChild(panel);
  const {data,error}=await client.rpc('quiz_admin_attendance_v11',{p_quiz_id:id});
  if(error){panel.innerHTML=`<h2>Section Attendance</h2><div class="notice bad">${esc(error.message)}</div>`;return}
  if(!(data.sections||[]).length){panel.innerHTML='<h2>Section Attendance</h2><div class="notice">This quiz has no assigned sections. Student results are shown above.</div>';return}
  const summary=data.sections.map(s=>`<tr><td>${esc(s.class_name)} · ${esc(s.section_name)}</td><td>${esc(s.course)}</td><td>${Number(s.assigned)}</td><td>${Number(s.joined)}</td><td>${Number(s.submitted)}</td><td>${Number(s.absent)}</td><td>${s.average_score==null?'—':Number(s.average_score).toFixed(2)}</td></tr>`).join('');
  panel.innerHTML=`<div class="section-head"><div><h2>Section Attendance</h2><p class="muted">Based on the roster saved when sections were assigned.</p></div><button class="btn teal" id="exportAttendance">Export Attendance CSV</button></div>
    <div class="tablewrap"><table class="table"><thead><tr><th>Class / Section</th><th>Course</th><th>Assigned</th><th>Joined</th><th>Submitted</th><th>Absent</th><th>Average Score</th></tr></thead><tbody>${summary}</tbody></table></div>
    <label for="attendanceSection">Student register</label><select id="attendanceSection"><option value="">All sections</option>${data.sections.map(s=>`<option value="${esc(s.section_id)}">${esc(s.class_name)} · ${esc(s.section_name)}</option>`).join('')}</select>
    <div class="tablewrap"><table class="table"><thead><tr><th>Student</th><th>Roll number</th><th>Class / Section</th><th>Status</th><th>Score</th><th>Joined</th><th>Details</th></tr></thead><tbody id="attendanceRows"></tbody></table></div>`;
  function render(){
    const selected=$('attendanceSection').value;
    const students=(data.students||[]).filter(s=>!selected||s.section_id===selected);
    $('attendanceRows').innerHTML=students.map(s=>`<tr><td><strong>${esc(s.student_name||s.email)}</strong><br><span class="muted">${esc(s.email)}</span></td><td>${esc(s.roll_number||'—')}</td><td>${esc(s.class_name)} · ${esc(s.section_name)}</td><td>${esc(s.status)}</td><td>${s.score==null?'—':Number(s.score)}</td><td>${esc(localDate(s.joined_at))}</td><td>${s.attempt_id?`<a class="btn ghost detail-btn" href="student-result.html?attempt=${encodeURIComponent(s.attempt_id)}">View</a>`:'—'}</td></tr>`).join('')||'<tr><td colspan="7">No students in this selection.</td></tr>';
  }
  $('attendanceSection').onchange=render;render();
  $('exportAttendance').onclick=()=>{
    const headers=['Course','Class','Section','Student','Roll_Number','Email','Status','Score','Joined','Submitted'];
    const rows=(data.students||[]).map(s=>[data.sections.find(x=>x.section_id===s.section_id)?.course||'',s.class_name,s.section_name,s.student_name,s.roll_number||'',s.email,s.status,s.score??'',s.joined_at||'',s.submitted_at||'']);
    const csvCell=value=>{let x=String(value??'');if(/^\s*[=+@-]/.test(x))x="'"+x;return `"${x.replaceAll('"','""')}"`};
    const csv='\uFEFF'+[headers,...rows].map(row=>row.map(csvCell).join(',')).join('\r\n');
    const link=document.createElement('a');link.href=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8'}));link.download=`${data.title.replace(/[^a-z0-9_-]+/gi,'-')}-attendance.csv`;link.click();setTimeout(()=>URL.revokeObjectURL(link.href),1000);
  };
})();
