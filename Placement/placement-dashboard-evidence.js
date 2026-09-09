(function(){
    'use strict';
    const client=window.CodeBhavyaSupabase?.client,main=document.querySelector('.overall-main');
    if(!client||!main||document.getElementById('overallEvidence'))return;
    const section=document.createElement('section');section.id='overallEvidence';section.className='overall-career';
    function text(parent,tag,value,cls){const el=document.createElement(tag);el.textContent=value;if(cls)el.className=cls;parent.append(el);return el;}
    text(section,'h2','Your saved practice evidence');
    text(section,'p','Scenario scores, mock assessments and career audits measure different skills. Review them separately before choosing your next task.');
    const grid=document.createElement('div');grid.className='overall-grid';section.append(grid);
    document.getElementById('overallTopics').after(section);
    async function rpc(name){const abort=new AbortController();const timer=setTimeout(()=>abort.abort(),15000);try{const result=await client.rpc(name).abortSignal(abort.signal);if(result.error)throw result.error;return result.data;}finally{clearTimeout(timer);}}
    function metric(parent,label,value){const box=document.createElement('div');text(box,'dt',label);text(box,'dd',value==null?'—':String(value));parent.append(box);}
    function number(data,key){return data[key]!=null&&Number.isFinite(Number(data[key]))?Number(data[key]):null;}
    function panel(title,href,action,load){
        const card=document.createElement('article');card.className='overall-card';text(card,'h3',title);const body=document.createElement('div');card.append(body);const actions=document.createElement('div');actions.className='od-action';text(actions,'a',action).href=href;card.append(actions);grid.append(card);
        async function render(){body.replaceChildren();text(body,'p','Loading saved evidence…','od-state');try{const data=await load();body.replaceChildren();data(body);}catch{body.replaceChildren();text(body,'p','This evidence could not load. Other dashboard results remain available.','od-state');const retry=text(body,'button','Retry','od-retry');retry.type='button';retry.addEventListener('click',render);}}
        render();
    }
    panel('Core CS scenarios','core-cs-problems.html','Practise scenarios →',async()=>{
        const data=await rpc('get_core_cs_lab_summary');if(!data?.summary)throw Error('Missing summary');const s=data.summary;
        return body=>{const dl=document.createElement('dl');dl.className='od-stats';body.append(dl);const solved=number(s,'solved_problems'),total=number(s,'total_problems');metric(dl,'Scenarios solved',solved==null||total==null?null:`${solved} / ${total}`);metric(dl,'Scenario points',number(s,'points'));text(body,'p',solved===0?'Start with one scenario to build your baseline.':'Open Core CS progress to review weak scenario groups.','od-state');text(body,'a','View Core CS progress').href='progress.html?topic=core-cs';};
    });
    panel('Resume & project evidence','evidence-lab.html','Improve career evidence →',async()=>{
        const s=await rpc('get_placement_evidence_summary');if(!s||typeof s!=='object')throw Error('Missing summary');
        return body=>{const dl=document.createElement('dl');dl.className='od-stats';body.append(dl);const score=number(s,'resume_score');metric(dl,'Resume audit score',score==null?null:`${score} / 100`);metric(dl,'Saved projects',number(s,'project_count'));metric(dl,'Proof links',number(s,'evidence_count'));metric(dl,'Defensible projects',number(s,'defensible_projects'));text(body,'p',score===0?'No positive resume audit score yet. Open Evidence Lab to check or build your resume.':'Audit scores assess supplied evidence; they do not guarantee recruitment outcomes.','od-state');};
    });
    panel('Recent mock drives','mock-drive.html','Open Mock Drive →',async()=>{
        const rows=await rpc('get_my_placement_mocks');if(!Array.isArray(rows))throw Error('Missing history');
        return body=>{if(!rows.length){text(body,'p','No saved mock drives yet. Complete a short drive to establish your baseline.','od-state');return;}
            const list=document.createElement('ul');list.style.paddingLeft='1.1rem';body.append(list);
            rows.slice(0,3).forEach(row=>{const li=document.createElement('li');li.style.marginBottom='1rem';const done=row.status==='completed',active=row.status==='active';const score=number(row,'mock_score');const date=new Date(row.started_at);text(li,'strong',done?`Completed · ${score==null?'Score unavailable':score+'% mock score'}`:active?'In progress':'Expired or ended');text(li,'p',Number.isNaN(date.getTime())?'Date unavailable':date.toLocaleDateString(undefined,{year:'numeric',month:'short',day:'numeric'}),'od-state');if(row.id&&(done||active)){text(li,'a',done?'View report':'Resume mock').href=`${done?'mock-result':'mock-session'}.html?session=${encodeURIComponent(row.id)}`;}list.append(li);});
            text(body,'p','Showing up to three recent drives. Mock scores include a self-reviewed interview round.','od-state');};
    });
})();
