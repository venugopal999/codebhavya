(async()=>{
  const {client,$,requireAdmin,esc,toast}=CBQuiz;try{await requireAdmin()}catch{return}
  let editing=null;
  const clear=()=>{editing=null;$("formTitle").textContent="New Section";["sectionCourse","className","sectionName","roster"].forEach(id=>$(id).value="");$("sectionMessage").textContent=""};
  function parseRoster(){
    const students=[],seen=new Set();
    for(const [i,line] of $("roster").value.split(/\r?\n/).entries()){
      if(!line.trim())continue;
      const comma=line.indexOf(","),email=(comma<0?line:line.slice(0,comma)).trim().toLowerCase(),name=comma<0?"":line.slice(comma+1).trim();
      if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)||seen.has(email))throw Error(`Line ${i+1}: invalid or duplicate email`);
      seen.add(email);students.push({email,student_name:name});
    }
    if(students.length>1000)throw Error("A section supports up to 1000 students");
    return students;
  }
  async function load(){
    const {data,error}=await client.rpc("quiz_admin_sections_v10");
    if(error){$("sectionRows").innerHTML=`<tr><td colspan="4">${esc(error.message)}</td></tr>`;return}
    $("sectionRows").innerHTML=(data||[]).map(s=>`<tr><td>${esc(s.course)}</td><td><strong>${esc(s.class_name)}</strong> · ${esc(s.section_name)}</td><td>${Number(s.student_count)}</td><td><div class="actions compact"><button class="btn ghost editSection" data-id="${esc(s.id)}">Edit roster</button><button class="btn danger deleteSection" data-id="${esc(s.id)}">Delete</button></div></td></tr>`).join("")||'<tr><td colspan="4">No sections yet.</td></tr>';
    document.querySelectorAll(".editSection").forEach(b=>b.onclick=async()=>{
      const {data,error}=await client.rpc("quiz_admin_section_v10",{p_section_id:b.dataset.id});if(error){toast(error.message,"error");return}
      editing=data.id;$("formTitle").textContent="Edit Section";$("sectionCourse").value=data.course;$("className").value=data.class_name;$("sectionName").value=data.section_name;
      $("roster").value=(data.students||[]).map(x=>`${x.email}${x.student_name?`, ${x.student_name}`:""}`).join("\n");window.scrollTo({top:0,behavior:"smooth"});
    });
    document.querySelectorAll(".deleteSection").forEach(b=>b.onclick=async()=>{
      if(!confirm("Delete this unassigned section and its reusable roster?"))return;
      const {error}=await client.rpc("quiz_admin_delete_section_v10",{p_section_id:b.dataset.id});if(error){toast(error.message,"error");return}if(editing===b.dataset.id)clear();toast("Section deleted.");await load();
    });
  }
  $("saveSection").onclick=async()=>{
    let students;try{students=parseRoster()}catch(e){$("sectionMessage").innerHTML=`<div class="notice bad">${esc(e.message)}</div>`;return}
    $("saveSection").disabled=true;
    const {data,error}=await client.rpc("quiz_admin_save_section_v10",{p_section_id:editing,p_course:$("sectionCourse").value,p_class_name:$("className").value,p_section_name:$("sectionName").value,p_students:students});
    $("saveSection").disabled=false;
    if(error){$("sectionMessage").innerHTML=`<div class="notice bad">${esc(error.message)}</div>`;return}
    editing=data;$("formTitle").textContent="Edit Section";$("sectionMessage").innerHTML='<div class="notice">Roster saved. Assign this section on a quiz before students join.</div>';await load();
  };
  $("newSection").onclick=clear;$("refreshSections").onclick=load;await load();
})();
