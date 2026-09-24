(async()=>{
  const {client,$,requireAdmin,esc,localDate}=CBQuiz;
  try{await requireAdmin()}catch{return}
  let report=null,requestNumber=0;
  const statusLabel={not_assigned:'Not assigned',absent:'Absent',joined:'Joined',submitted:'Submitted'};
  function matchedStudents(){
    const search=$('gradebookSearch').value.trim().toLowerCase();
    return (report.students||[]).filter(s=>!search||[s.student_name,s.email,s.roll_number]
      .some(v=>String(v||'').toLowerCase().includes(search)));
  }
  function dateKey(value){
    const date=new Date(value);
    if(Number.isNaN(date.getTime()))return '';
    return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
  }
  function orderedQuizzes(quizzes){
    const direction=$('quizOrder').value==='oldest'?1:-1;
    return [...quizzes].sort((a,b)=>direction*((Date.parse(a.event_at)||0)-(Date.parse(b.event_at)||0))||
      direction*String(a.quiz_id).localeCompare(String(b.quiz_id)));
  }
  function visibleQuizzes(){
    const text=$('quizSearch').value.trim().toLowerCase(),from=$('quizFrom').value,to=$('quizTo').value;
    return orderedQuizzes((report.quizzes||[]).filter(q=>{
      const date=dateKey(q.event_at);
      return (!text||String(q.title||'').toLowerCase().includes(text))&&(!from||date>=from)&&(!to||date<=to);
    }));
  }
  function cellHtml(cell,quiz){
    if(!cell)return '<span class="muted">Not assigned</span>';
    if(cell.status!=='submitted')return `<span class="gradebook-status ${esc(cell.status)}">${esc(statusLabel[cell.status]||'Not assigned')}</span>`;
    const score=cell.score==null?'—':Number(cell.score).toFixed(1);
    const max=Number(quiz.max_score).toFixed(1);
    const percent=cell.percentage==null?'':`<br><span class="muted">${Number(cell.percentage).toFixed(1)}%</span>`;
    return `<strong>${score} / ${max}</strong>${percent}`;
  }
  function renderRows(quizzes=visibleQuizzes()){
    const students=matchedStudents();
    $('gradebookCount').textContent=`Showing ${quizzes.length} of ${report.quizzes.length} assigned quizzes · ${students.length} of ${report.students.length} students`;
    $('gradebookRows').innerHTML=students.map(s=>{
      const byQuiz=new Map((s.cells||[]).map(c=>[c.quiz_id,c]));
      return `<tr><td>${esc(s.roll_number||'—')}</td><td><strong>${esc(s.student_name||s.email)}</strong></td><td>${esc(s.email)}</td>
        ${quizzes.map(q=>`<td>${cellHtml(byQuiz.get(q.quiz_id),q)}</td>`).join('')}</tr>`;
    }).join('')||`<tr><td colspan="${3+quizzes.length}">${report.students.length?'No students match the search.':'No students in this section roster yet.'}</td></tr>`;
  }
  function renderTable(){
    const quizzes=visibleQuizzes();
    $('gradebookHead').innerHTML='<th>Roll</th><th>Student</th><th>Email</th>'+quizzes.map((q,i)=>
      `<th title="${esc(q.title)} · ${esc(localDate(q.event_at))}">Q${i+1}: ${esc(q.title)}<br><span class="muted">${esc(localDate(q.event_at))} · / ${Number(q.max_score).toFixed(1)}</span></th>`).join('');
    $('exportVisible').disabled=!quizzes.length;
    renderRows(quizzes);
  }
  function render(){
    const s=report.section;
    $('gradebookContent').hidden=false;
    $('gradebookTitle').textContent=`${s.class_name} · ${s.section_name}`;
    $('gradebookSubtitle').textContent=`${s.course} · all assigned non-draft quizzes available`;
    for(const id of ['quizSearch','quizFrom','quizTo','gradebookSearch'])$(id).value='';
    $('quizOrder').value='newest';
    renderTable();
  }
  async function loadSection(){
    const id=$('gradebookSection').value,serial=++requestNumber;
    if(!id){$('gradebookContent').hidden=true;return}
    $('gradebookMessage').innerHTML='<div class="notice">Loading gradebook…</div>';
    const {data,error}=await client.rpc('quiz_admin_section_gradebook_v14',{p_section_id:id});
    if(serial!==requestNumber)return;
    if(error){$('gradebookMessage').innerHTML=`<div class="notice bad">${esc(error.message)}</div>`;$('gradebookContent').hidden=true;return}
    report=data;$('gradebookMessage').textContent='';render();
  }
  function exportGradebook(all){
    if(!report)return;
    const quizzes=all?orderedQuizzes(report.quizzes||[]):visibleQuizzes();
    if(!all&&!quizzes.length)return;
    const headers=['Course','Class','Section','Roll Number','Student','Email'];
    for(const [i,q] of quizzes.entries()){
      const label=`Q${i+1} ${q.title} (${q.quiz_id.slice(0,8)})`;
      headers.push(`${label} Status`,`${label} Score / ${Number(q.max_score)}`,`${label} Percent`);
    }
    const rows=(report.students||[]).map(s=>{
      const byQuiz=new Map((s.cells||[]).map(c=>[c.quiz_id,c]));
      const row=[report.section.course,report.section.class_name,report.section.section_name,s.roll_number||'',s.student_name||'',s.email];
      for(const q of quizzes){const c=byQuiz.get(q.quiz_id);row.push(statusLabel[c?.status]||'Not assigned',
        c?.status==='submitted'&&c.score!=null?Number(c.score):'',
        c?.status==='submitted'&&c.percentage!=null?Number(c.percentage):'')}
      return row;
    });
    const csvCell=value=>{
      if(typeof value==='number'&&Number.isFinite(value))return String(value);
      let text=String(value??'');if(/^\s*[=+@-]/.test(text))text="'"+text;
      return `"${text.replaceAll('"','""')}"`;
    };
    const csv='\uFEFF'+[headers,...rows].map(row=>row.map(csvCell).join(',')).join('\r\n');
    const url=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8'}));
    const link=document.createElement('a');link.href=url;
    link.download=`${report.section.section_name.replace(/[^a-z0-9_-]+/gi,'-')}-${all?'all':'shown'}-gradebook.csv`;
    link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
  }
  const {data:sections,error}=await client.rpc('quiz_admin_progress_sections_v12');
  if(error){$('gradebookMessage').innerHTML=`<div class="notice bad">${esc(error.message)}</div>`;return}
  if(!(sections||[]).length){$('gradebookSection').innerHTML='<option value="">No sections created yet</option>';
    $('gradebookMessage').innerHTML='<div class="notice">Create a section under Classes &amp; Sections first.</div>';return}
  $('gradebookSection').innerHTML=sections.map(s=>
    `<option value="${esc(s.id)}">${esc(s.course)} · ${esc(s.class_name)} · ${esc(s.section_name)}</option>`).join('');
  const initial=new URLSearchParams(location.search).get('section');
  if(initial&&sections.some(s=>s.id===initial))$('gradebookSection').value=initial;
  $('gradebookSection').onchange=loadSection;
  for(const id of ['quizSearch','quizFrom','quizTo'])$(id).oninput=()=>{if(report)renderTable()};
  $('quizOrder').onchange=()=>{if(report)renderTable()};
  $('resetQuizFilters').onclick=()=>{
    for(const id of ['quizSearch','quizFrom','quizTo'])$(id).value='';
    $('quizOrder').value='newest';if(report)renderTable();
  };
  $('gradebookSearch').oninput=()=>{if(report)renderRows()};
  $('exportVisible').onclick=()=>exportGradebook(false);
  $('exportAll').onclick=()=>exportGradebook(true);
  await loadSection();
})();
