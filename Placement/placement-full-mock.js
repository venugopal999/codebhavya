(function(){
  "use strict";
  const client=(window.CodeBhavyaSupabase||{}).client||null;
  const $=(id)=>document.getElementById(id);
  const topicLabels={c:"C Programming",python:"Python",dsa:"Data Structures & Algorithms",database:"Database & SQL","core-cs":"Core Computer Science","ai-ml":"AI & Machine Learning"};
  const trackLabels={general:"General Campus",service:"Foundation & High-Volume",product:"Product Engineering",ai:"Data, AI & Analytics"};
  function state(name){["fullLoading","fullSignedOut","fullError","fullWorkspace"].forEach((id)=>{$(id).hidden=id!==name;});}
  function text(parent,tag,value,className){const element=document.createElement(tag);element.textContent=value;if(className)element.className=className;parent.append(element);return element;}
  function renderHistory(rows){
    const list=$("fullHistory");list.replaceChildren();
    if(!rows.length){text(list,"p","No full assessment yet. Your first completed result becomes the comparison baseline.","mock-empty");return;}
    const formatter=new Intl.DateTimeFormat(undefined,{month:"short",day:"numeric",year:"numeric"});
    rows.forEach((row)=>{
      const card=document.createElement("article");card.className="history-row";
      const copy=document.createElement("div");text(copy,"strong",(trackLabels[row.target_path]||row.target_path)+" · "+(topicLabels[row.technical_topic]||row.technical_topic));
      text(copy,"p",formatter.format(new Date(row.created_at))+" · "+row.status.replaceAll("_"," ")+(row.score===null?"":" · "+row.score+"%"));
      const status=text(card,"span",row.status==="completed"?"Completed":row.status==="auto_submitted"?"Auto-submitted":row.status==="ready"?"Ready":"In progress","status-pill"+(row.status==="completed"?" completed":""));
      const link=document.createElement("a");const done=["completed","auto_submitted"].includes(row.status);link.href=done?"full-mock-result.html?session="+encodeURIComponent(row.id):"full-mock-session.html?session="+encodeURIComponent(row.id);link.textContent=done?"View result →":"Resume →";
      card.insertBefore(copy,status);card.append(link);list.append(card);
    });
  }
  async function load(){
    state("fullLoading");
    if(!client){$("fullErrorMessage").textContent="Supabase connection is unavailable.";state("fullError");return;}
    try{
      const auth=await client.auth.getUser();if(!auth.data?.user){state("fullSignedOut");return;}
      const result=await client.rpc("get_my_full_placement_assessments");if(result.error)throw result.error;
      renderHistory(result.data||[]);state("fullWorkspace");
    }catch(error){
      const missing=/get_my_full_placement_assessments|function .* does not exist|schema cache/i.test(String(error?.message||""));
      $("fullErrorMessage").textContent=missing?"Run Placement/full-placement-assessment-schema-v40.sql once in Supabase, then retry.":(error.message||"Assessment history could not load.");
      state("fullError");
    }
  }
  async function create(event){
    event.preventDefault();const button=$("createFull"),error=$("fullSetupError");error.textContent="";
    if(!$("fullConsent").checked){error.textContent="Accept the assessment rules before continuing.";return;}
    button.disabled=true;button.textContent="Building assessment…";
    try{
      const result=await client.rpc("create_full_placement_assessment",{p_target:$("fullTarget").value,p_technical_topic:$("fullTechnical").value,p_coding_topic:$("fullCoding").value});
      if(result.error)throw result.error;
      location.href="full-mock-session.html?session="+encodeURIComponent(result.data.session_id);
    }catch(failure){error.textContent=failure.message||"The full assessment could not be created.";button.disabled=false;button.textContent="Create secure assessment";}
  }
  $("fullSetupForm").addEventListener("submit",create);$("retryFull").addEventListener("click",load);load();
}());
