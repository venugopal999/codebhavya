(async()=>{
  const {client,$,requireAdmin,esc,localDate,session,toast}=CBQuiz;
  try{await requireAdmin()}catch{return}
  const s=await session(); const me=s?.user?.id;

  async function load(){
    const {data,error}=await client.rpc("quiz_admin_faculty_list_v2");
    if(error){$("facultyRows").innerHTML=`<tr><td colspan="3">${esc(error.message)}</td></tr>`;return}
    $("facultyRows").innerHTML=(data||[]).map(f=>`<tr><td><strong>${esc(f.display_name||f.email||"Faculty")}</strong><br><span class="muted">${esc(f.email||"")}</span></td><td>${esc(localDate(f.created_at))}</td><td>${f.user_id===me?'<span class="badge live">You</span>':`<button class="btn danger removeFaculty" data-id="${esc(f.user_id)}" data-email="${esc(f.email||"")}">Remove</button>`}</td></tr>`).join("");
    document.querySelectorAll(".removeFaculty").forEach(b=>b.onclick=async()=>{
      if(!confirm(`Remove faculty access for ${b.dataset.email}?`))return;
      const {error}=await client.rpc("quiz_admin_remove_faculty_v2",{p_user_id:b.dataset.id});
      if(error){toast(error.message,"error");return} toast("Faculty access removed."); await load();
    });
  }

  $("addFacultyBtn").onclick=async()=>{
    const email=$("facultyEmail").value.trim(); if(!email){return}
    const {data,error}=await client.rpc("quiz_admin_add_faculty_v2",{p_email:email});
    if(error){$("facultyMessage").innerHTML=`<div class="notice bad">${esc(error.message)}</div>`;return}
    $("facultyMessage").innerHTML=`<div class="notice">Faculty access added for <strong>${esc(data.email)}</strong>.</div>`; $("facultyEmail").value=""; await load();
  };
  await load();
})();
