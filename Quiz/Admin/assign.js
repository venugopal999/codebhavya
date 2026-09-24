(async()=>{
  const {client,$,requireAdmin,esc,toast}=CBQuiz;try{await requireAdmin()}catch{return}
  const id=new URLSearchParams(location.search).get("id");if(!id){$("sectionChoices").textContent="Missing quiz ID";return}
  $("editLink").href=`edit.html?id=${encodeURIComponent(id)}`;$("resultsLink").href=`results.html?id=${encodeURIComponent(id)}`;
  async function load(){
    const [a,b]=await Promise.all([client.rpc("quiz_admin_quiz_sections_v10",{p_quiz_id:id}),client.rpc("quiz_admin_sections_v10")]);
    if(a.error||b.error){$("sectionChoices").textContent=(a.error||b.error).message;$("saveAssignment").disabled=true;return}
    const assigned=new Set((a.data.sections||[]).map(x=>x.id)),locked=a.data.has_attempts||!["draft","waiting"].includes(a.data.status);
    $("sectionChoices").innerHTML=(b.data||[]).map(s=>`<label class="section-choice"><input type="checkbox" value="${esc(s.id)}" ${assigned.has(s.id)?"checked":""} ${locked?"disabled":""}><span><strong>${esc(s.class_name)} · ${esc(s.section_name)}</strong><small>${esc(s.course)} · ${Number(s.student_count)} students</small></span></label>`).join("")||'<div class="notice warn">Create a section and add students before assigning this quiz.</div>';
    $("saveAssignment").disabled=locked;
    $("assignmentMessage").innerHTML=locked?'<div class="notice warn">Assignments are locked because the quiz started or a student joined. The saved roster remains available for attendance.</div>':`<div class="notice">${assigned.size} section${assigned.size===1?"":"s"} assigned. Save to capture the current roster.</div>`;
  }
  $("saveAssignment").onclick=async()=>{
    const ids=[...document.querySelectorAll('#sectionChoices input:checked')].map(x=>x.value);
    if(!ids.length&&!confirm("Remove all section restrictions? Anyone with the quiz code can join."))return;
    $("saveAssignment").disabled=true;
    const {data,error}=await client.rpc("quiz_admin_assign_sections_v10",{p_quiz_id:id,p_section_ids:ids});
    if(error){toast(error.message,"error");$("saveAssignment").disabled=false;return}
    toast(`${data.section_count} sections, ${data.student_count} students assigned.`);await load();
  };
  await load();
})();
