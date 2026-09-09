(async function(){
    'use strict';
    const status=document.getElementById('overallStatus'),grid=document.getElementById('overallTopics');
    const topics=[['aptitude','Aptitude'],['c','C Programming'],['python','Python'],['dsa','DSA'],['database','Database & SQL'],['core-cs','Core CS'],['ai-ml','AI & ML']];
    const client=window.CodeBhavyaSupabase?.client;
    const assetRoot=new URL('./',document.currentScript.src);
    const n=value=>Number.isFinite(Number(value))?Number(value):0;
    try{
        if(!client)throw new Error('Database connection is unavailable.');
        const auth=await client.auth.getUser();
        if(!auth.data?.user){status.replaceChildren(document.createTextNode('Sign in to see your saved progress across all topics. '));const a=document.createElement('a');a.href='index.html#cloudProgress';a.textContent='Go to sign in';status.append(a);return;}
        const evidenceScript=document.createElement('script');evidenceScript.src=new URL('placement-dashboard-evidence.js?v=37',assetRoot).href;document.head.append(evidenceScript);
        let loaded=0;
        function text(parent,tag,value,cls){const el=document.createElement(tag);el.textContent=value;if(cls)el.className=cls;parent.append(el);return el;}
        function report(){status.textContent=`${loaded} of ${topics.length} topic summaries available. Mastery shows MCQs answered correctly; open a topic for coding, scenario and activity details.`;}
        await Promise.all(topics.map(async([topic,label])=>{
            const card=document.createElement('article');card.className='overall-card';grid.append(card);
            const heading=document.createElement('div');heading.className='od-head';card.append(heading);
            const symbol={aptitude:'QA',c:'C',python:'Py',dsa:'DS',database:'SQL','core-cs':'CS','ai-ml':'AI'}[topic];
            const icon=text(heading,'span',symbol,'od-icon');icon.setAttribute('aria-hidden','true');text(heading,'h2',label);
            const body=document.createElement('div');card.append(body);
            const actions=document.createElement('div');actions.className='od-action';card.append(actions);
            text(actions,'a','View progress →').href=`progress.html?topic=${topic}`;
            text(actions,'a','Practise').href=`quiz.html?topic=${topic}`;
            async function fetchTopic(){
                body.replaceChildren();text(body,'p','Loading saved results…','od-state');
                try{
                    const controller=new AbortController();const timer=setTimeout(()=>controller.abort(),15000);
                    let result;try{result=await client.rpc('get_placement_dashboard',{p_topic:topic}).abortSignal(controller.signal);}finally{clearTimeout(timer);}
                    if(result.error)throw result.error;
                    const s=result.data?.summary;if(!s)throw new Error('Missing summary');
                    for(const key of ['mastered_mcq','total_mcq','quiz_sessions','quiz_accuracy'])if(s[key]==null||!Number.isFinite(Number(s[key])))throw new Error('Incomplete summary');
                    body.replaceChildren();loaded++;report();
                    const total=Math.max(0,n(s.total_mcq)),mastered=Math.max(0,n(s.mastered_mcq));
                    const row=document.createElement('div');row.className='od-mastery';body.append(row);text(row,'span','MCQ mastery');text(row,'strong',`${mastered} / ${total}`);
                    if(total>0){const bar=document.createElement('progress');bar.max=total;bar.value=Math.min(total,mastered);bar.setAttribute('aria-label',`${label}: ${mastered} of ${total} MCQs mastered`);body.append(bar);}
                    const stats=document.createElement('dl');stats.className='od-stats';body.append(stats);
                    [['Quizzes submitted',n(s.quiz_sessions)],['Quiz accuracy',n(s.quiz_sessions)>0?`${n(s.quiz_accuracy)}%`:'—']].forEach(([title,value])=>{const box=document.createElement('div');text(box,'dt',title);text(box,'dd',String(value));stats.append(box);});
                    if(!['aptitude','core-cs'].includes(topic)){
                        const available=['solved_problems','total_problems'].every(key=>s[key]!=null&&Number.isFinite(Number(s[key])));
                        const label=topic==='database'?'SQL problems solved':topic==='ai-ml'?'Applied problems solved':'Coding problems solved';
                        const p=text(body,'p',available?`${label}: ${n(s.solved_problems)} / ${n(s.total_problems)}`:'Coding summary unavailable. Open topic progress for details.','od-state');
                        if(available&&n(s.total_problems)>0){const bar=document.createElement('progress');bar.max=n(s.total_problems);bar.value=Math.max(0,Math.min(n(s.total_problems),n(s.solved_problems)));bar.setAttribute('aria-label',`${label}: ${n(s.solved_problems)} of ${n(s.total_problems)}`);p.after(bar);}
                    }
                    text(body,'p',total===0?'No published MCQs available.':n(s.quiz_sessions)===0?'Take your first quiz to establish a baseline.':mastered>=total?'All published MCQs mastered. Keep practising to retain them.':'Continue with a focused topic quiz.','od-state');
                }catch{body.replaceChildren();text(body,'p','This topic could not load. Your saved work has not changed.','od-state');const retry=text(body,'button','Retry','od-retry');retry.type='button';retry.addEventListener('click',fetchTopic);}
            }
            await fetchTopic();
        }));
        report();
    }catch(error){status.textContent=error.message+' Refresh this page to retry.';}
})();
