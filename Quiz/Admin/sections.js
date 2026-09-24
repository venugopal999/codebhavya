(async()=>{
  const {client,$,requireAdmin,esc,toast}=CBQuiz;try{await requireAdmin()}catch{return}
  let editing=null;
  const csvCell=value=>{const s=String(value??'');return /[",\r\n]/.test(s)?`"${s.replaceAll('"','""')}"`:s};
  const rosterText=students=>students.map(s=>[s.email,s.student_name||'',s.roll_number||''].map(csvCell).join(', ')).join('\n');
  function parseCSV(text){
    const rows=[];let row=[],cell='',quoted=false;
    text=String(text).replace(/^\uFEFF/,'');
    for(let i=0;i<text.length;i++){
      const c=text[i];
      if(c==='"'){
        if(quoted&&text[i+1]==='"'){cell+='"';i++}else if(quoted){quoted=false}else if(!cell.trim()){quoted=true}else{throw Error('Unexpected quote in roster file')}
      }else if(c===','&&!quoted){row.push(cell.trim());cell=''}
      else if((c==='\n'||c==='\r')&&!quoted){if(c==='\r'&&text[i+1]==='\n')i++;row.push(cell.trim());if(row.some(Boolean))rows.push(row);row=[];cell=''}
      else cell+=c;
    }
    if(quoted)throw Error('Unclosed quote in roster file');
    row.push(cell.trim());if(row.some(Boolean))rows.push(row);
    return rows;
  }
  function normalize(rows,headerRequired=false){
    if(!rows.length)throw Error('No student rows found');
    const canonical=s=>String(s??'').trim().toLowerCase().replace(/[^a-z0-9]+/g,'_').replace(/^_|_$/g,'');
    const header=(rows[0]||[]).map(canonical);
    const emailAt=header.findIndex(x=>['email','email_address','student_email'].includes(x));
    const nameAt=header.findIndex(x=>['student_name','name','full_name'].includes(x));
    const rollAt=header.findIndex(x=>['roll_number','roll_no','roll','registration_number','register_number'].includes(x));
    if(headerRequired&&emailAt<0)throw Error('The file needs an email column. Download the CSV Template for the required format.');
    const hasHeader=emailAt>=0;const columns=hasHeader?[emailAt,nameAt,rollAt]:[0,1,2];
    const students=[],emails=new Set(),rolls=new Set();
    for(let i=hasHeader?1:0;i<rows.length;i++){
      const cells=rows[i];if(!cells.some(x=>String(x??'').trim()))continue;
      const email=String(cells[columns[0]]??'').trim().toLowerCase();
      const student_name=columns[1]<0?'':String(cells[columns[1]]??'').trim();
      const roll_number=columns[2]<0?'':String(cells[columns[2]]??'').trim();
      const rowNumber=i+1;
      if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)||email.length>320)throw Error(`Row ${rowNumber}: invalid email address`);
      if(student_name.length>120)throw Error(`Row ${rowNumber}: name exceeds 120 characters`);
      if(roll_number.length>50)throw Error(`Row ${rowNumber}: roll number exceeds 50 characters`);
      if(emails.has(email))throw Error(`Row ${rowNumber}: duplicate email ${email}`);
      if(roll_number&&rolls.has(roll_number.toUpperCase()))throw Error(`Row ${rowNumber}: duplicate roll number ${roll_number}`);
      emails.add(email);if(roll_number)rolls.add(roll_number.toUpperCase());
      students.push({email,student_name,roll_number});
      if(students.length>1000)throw Error('A section supports up to 1000 students');
    }
    if(!students.length)throw Error('No student rows found');
    return students;
  }
  function preview(students){
    $('rosterPreview').innerHTML=`<div class="notice"><strong>${students.length}</strong> student${students.length===1?'':'s'} ready. Review the first five below, then click Save Section.</div>
      <div class="tablewrap"><table class="table"><thead><tr><th>Email</th><th>Name</th><th>Roll number</th></tr></thead><tbody>${students.slice(0,5).map(s=>`<tr><td>${esc(s.email)}</td><td>${esc(s.student_name||'—')}</td><td>${esc(s.roll_number||'—')}</td></tr>`).join('')}</tbody></table></div>`;
  }
  function clear(){editing=null;$('formTitle').textContent='New Section';['sectionCourse','className','sectionName','roster','importFile'].forEach(id=>$(id).value='');$('sectionMessage').textContent='';$('importStatus').textContent='';$('rosterPreview').textContent=''}
  async function load(){
    const {data,error}=await client.rpc('quiz_admin_sections_v10');
    if(error){$('sectionRows').innerHTML=`<tr><td colspan="4">${esc(error.message)}</td></tr>`;return}
    $('sectionRows').innerHTML=(data||[]).map(s=>`<tr><td>${esc(s.course)}</td><td><strong>${esc(s.class_name)}</strong> · ${esc(s.section_name)}</td><td>${Number(s.student_count)}</td><td><div class="actions compact"><button class="btn ghost editSection" data-id="${esc(s.id)}">Edit roster</button><button class="btn danger deleteSection" data-id="${esc(s.id)}">Delete</button></div></td></tr>`).join('')||'<tr><td colspan="4">No sections yet.</td></tr>';
    document.querySelectorAll('.editSection').forEach(b=>b.onclick=async()=>{
      const {data,error}=await client.rpc('quiz_admin_section_v11',{p_section_id:b.dataset.id});if(error){toast(error.message,'error');return}
      editing=data.id;$('formTitle').textContent='Edit Section';$('sectionCourse').value=data.course;$('className').value=data.class_name;$('sectionName').value=data.section_name;
      $('roster').value=rosterText(data.students||[]);$('importStatus').textContent='';$('rosterPreview').textContent='';window.scrollTo({top:0,behavior:'smooth'});
    });
    document.querySelectorAll('.deleteSection').forEach(b=>b.onclick=async()=>{
      if(!confirm('Delete this unassigned section and its reusable roster?'))return;
      const {error}=await client.rpc('quiz_admin_delete_section_v10',{p_section_id:b.dataset.id});if(error){toast(error.message,'error');return}
      if(editing===b.dataset.id)clear();toast('Section deleted.');await load();
    });
  }
  $('importBtn').onclick=async()=>{
    const file=$('importFile').files[0];if(!file){$('importStatus').innerHTML='<div class="notice bad">Select a CSV or Excel file first.</div>';return}
    try{
      if(file.size>5*1024*1024)throw Error('File is too large. Maximum 5 MB.');
      const ext=file.name.toLowerCase().split('.').pop();let rows;
      if(ext==='csv')rows=parseCSV(await file.text());
      else if(['xlsx','xls'].includes(ext)){
        if(!window.XLSX)throw Error('Excel reader did not load. Refresh and try again, or export your sheet as CSV.');
        const book=XLSX.read(await file.arrayBuffer(),{type:'array'});
        rows=XLSX.utils.sheet_to_json(book.Sheets[book.SheetNames[0]],{header:1,raw:false,defval:''});
      }else throw Error('Choose a .csv, .xlsx or .xls file.');
      const students=normalize(rows,true);$('roster').value=rosterText(students);preview(students);
      $('importStatus').innerHTML='<div class="notice">Import preview loaded into the roster box. Check it, then click Save Section to store it.</div>';
    }catch(e){$('importStatus').innerHTML=`<div class="notice bad">${esc(e.message)}</div>`;$('rosterPreview').textContent=''}
  };
  $('templateBtn').onclick=()=>{
    const csv='\uFEFFemail,student_name,roll_number\r\nstudent@example.com,Student Name,AIML001\r\n';
    const link=document.createElement('a');link.href=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8'}));link.download='CodeBhavya-Section-Roster-Template.csv';link.click();setTimeout(()=>URL.revokeObjectURL(link.href),1000);
  };
  $('saveSection').onclick=async()=>{
    let students;try{students=normalize(parseCSV($('roster').value))}catch(e){$('sectionMessage').innerHTML=`<div class="notice bad">${esc(e.message)}</div>`;return}
    $('saveSection').disabled=true;
    const {data,error}=await client.rpc('quiz_admin_save_section_v11',{p_section_id:editing,p_course:$('sectionCourse').value,p_class_name:$('className').value,p_section_name:$('sectionName').value,p_students:students});
    $('saveSection').disabled=false;
    if(error){$('sectionMessage').innerHTML=`<div class="notice bad">${esc(error.message)}</div>`;return}
    editing=data;$('formTitle').textContent='Edit Section';$('sectionMessage').innerHTML='<div class="notice">Roster saved. To update an assigned quiz, save its Sections assignment again before the first student joins.</div>';
    preview(students);await load();
  };
  $('newSection').onclick=clear;$('refreshSections').onclick=load;await load();
})();
