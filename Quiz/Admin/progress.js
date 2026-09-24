(async()=>{
  const {client,$,requireAdmin,esc,localDate}=CBQuiz;
  try{await requireAdmin()}catch{return}
  let report=null,requestNumber=0;
  const pct=value=>value==null?'—':`${Number(value).toFixed(1)}%`;
  const csvCell=value=>{let s=String(value??'');if(/^\s*[=+@-]/.test(s))s="'"+s;return `"${s.replaceAll('"','""')}"`};
  function downloadCSV(headers,rows,name){
    const csv='\uFEFF'+[headers,...rows].map(row=>row.map(csvCell).join(',')).join('\r\n');
    const link=document.createElement('a');link.href=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8'}));
    link.download=name;link.click();setTimeout(()=>URL.revokeObjectURL(link.href),1000);
  }
  function renderStudents(){
    const search=$('studentSearch').value.trim().toLowerCase();
    const students=(report.students||[]).filter(s=>!search||[s.student_name,s.email,s.roll_number].some(v=>String(v||'').toLowerCase().includes(search)));
    $('progressStudentRows').innerHTML=students.map(s=>{
      const trend=Number(s.submitted)>=2&&s.first_percentage!=null&&s.latest_percentage!=null
        ?Number(s.latest_percentage)-Number(s.first_percentage):null;
      return `<tr><td>${esc(s.roll_number||'—')}</td><td><strong>${esc(s.student_name||s.email)}</strong><br><span class="muted">${esc(s.email)}</span></td>
        <td>${Number(s.assigned)}</td><td>${Number(s.joined)}</td><td>${Number(s.submitted)}</td><td>${Number(s.absent)}</td>
        <td>${pct(s.average_percentage)}</td><td>${pct(s.latest_percentage)}</td>
        <td><span class="progress-change ${trend==null?'':trend>0?'up':trend<0?'down':''}">${trend==null?'—':`${trend>0?'+':''}${trend.toFixed(1)} pts`}</span></td></tr>`;
    }).join('')||'<tr><td colspan="9">No students match this search.</td></tr>';
  }
  function render(){
    const s=report.section,summary=report.summary,quizzes=report.quizzes||[];
    $('progressContent').hidden=false;
    $('progressTitle').textContent=`${s.class_name} · ${s.section_name}`;
    $('progressSubtitle').textContent=s.course;
    $('gradebookLink').href=`gradebook.html?section=${encodeURIComponent(s.id)}`;
    $('progressStats').innerHTML=`<div class="stat"><strong>${Number(summary.quizzes)}</strong><span>Quizzes</span></div>
      <div class="stat"><strong>${Number(summary.students)}</strong><span>Students in current roster</span></div>
      <div class="stat"><strong>${pct(summary.average_percentage)}</strong><span>Average submitted score</span></div>`;
    $('progressChart').innerHTML=quizzes.map(q=>{
      const score=q.average_percentage==null?0:Math.max(0,Math.min(100,Number(q.average_percentage)||0));
      return `<div class="progress-chart-row"><div><strong>${esc(q.title)}</strong><span>${esc(localDate(q.event_at))} · ${Number(q.submitted)}/${Number(q.assigned)} submitted</span></div>
        <div class="progress-track" role="progressbar" aria-valuenow="${score}" aria-valuemin="0" aria-valuemax="100" aria-label="Average score for ${esc(q.title)}"><i style="width:${score}%"></i></div>
        <strong>${pct(q.average_percentage)}</strong></div>`;
    }).join('')||'<div class="notice">No open, live or closed assigned quizzes yet. Assign a section and open a quiz to begin tracking progress.</div>';
    $('progressQuizRows').innerHTML=quizzes.map(q=>`<tr><td><strong>${esc(q.title)}</strong><br><span class="muted">${esc(q.quiz_status)}</span></td>
      <td>${esc(localDate(q.event_at))}</td><td>${Number(q.assigned)}</td><td>${Number(q.joined)}</td><td>${Number(q.submitted)}</td><td>${Number(q.absent)}</td>
      <td>${pct(q.average_percentage)}</td><td><a class="btn ghost detail-btn" href="results.html?id=${encodeURIComponent(q.quiz_id)}">View</a></td></tr>`).join('')||'<tr><td colspan="8">No quizzes for this section yet.</td></tr>';
    renderStudents();
  }
  async function loadSection(){
    const id=$('progressSection').value,serial=++requestNumber;
    if(!id){$('progressContent').hidden=true;return}
    $('progressMessage').innerHTML='<div class="notice">Loading section progress…</div>';
    const {data,error}=await client.rpc('quiz_admin_section_progress_v12',{p_section_id:id});
    if(serial!==requestNumber)return;
    if(error){$('progressMessage').innerHTML=`<div class="notice bad">${esc(error.message)}</div>`;$('progressContent').hidden=true;return}
    report=data;$('progressMessage').textContent='';$('studentSearch').value='';render();
  }
  const {data:sections,error}=await client.rpc('quiz_admin_progress_sections_v12');
  if(error){$('progressMessage').innerHTML=`<div class="notice bad">${esc(error.message)}</div>`;return}
  if(!(sections||[]).length){$('progressSection').innerHTML='<option value="">No sections created yet</option>';
    $('progressMessage').innerHTML='<div class="notice">Create a section under Classes &amp; Sections to start tracking progress.</div>';return}
  $('progressSection').innerHTML=sections.map(s=>`<option value="${esc(s.id)}">${esc(s.course)} · ${esc(s.class_name)} · ${esc(s.section_name)} (${Number(s.quiz_count)} quizzes)</option>`).join('');
  const initial=new URLSearchParams(location.search).get('section');
  if(initial&&sections.some(s=>s.id===initial))$('progressSection').value=initial;
  $('progressSection').onchange=loadSection;
  $('studentSearch').oninput=()=>{if(report)renderStudents()};
  $('exportStudents').onclick=()=>{
    if(!report)return;
    const headers=['Course','Class','Section','Roll_Number','Student','Email','Assigned','Joined','Submitted','Absent','Average_Percent','First_Percent','Latest_Percent','Change_Points'];
    const rows=(report.students||[]).map(s=>[report.section.course,report.section.class_name,report.section.section_name,s.roll_number||'',s.student_name||'',s.email,s.assigned,s.joined,s.submitted,s.absent,s.average_percentage??'',s.first_percentage??'',s.latest_percentage??'',Number(s.submitted)>=2&&s.first_percentage!=null&&s.latest_percentage!=null?(Number(s.latest_percentage)-Number(s.first_percentage)).toFixed(2):'']);
    downloadCSV(headers,rows,`${report.section.section_name.replace(/[^a-z0-9_-]+/gi,'-')}-student-progress.csv`);
  };
  $('exportQuizzes').onclick=()=>{
    if(!report)return;
    const headers=['Quiz','Course','Date','Status','Assigned','Joined','Submitted','Absent','Max_Score','Average_Percent'];
    const rows=(report.quizzes||[]).map(q=>[q.title,q.course||'',q.event_at||'',q.quiz_status,q.assigned,q.joined,q.submitted,q.absent,q.max_score,q.average_percentage??'']);
    downloadCSV(headers,rows,`${report.section.section_name.replace(/[^a-z0-9_-]+/gi,'-')}-quiz-progress.csv`);
  };
  await loadSection();
})();
