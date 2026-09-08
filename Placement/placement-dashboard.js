(async function(){
    'use strict';
    const status=document.getElementById('overallStatus'),grid=document.getElementById('overallTopics');
    const topics=[['aptitude','Aptitude'],['c','C Programming'],['python','Python'],['dsa','DSA'],['database','Database & SQL'],['core-cs','Core CS'],['ai-ml','AI & ML']];
    const client=window.CodeBhavyaSupabase?.client;
    const n=value=>Number.isFinite(Number(value))?Number(value):0;
    try{
        if(!client)throw new Error('Database connection is unavailable.');
        const auth=await client.auth.getUser();
        if(!auth.data?.user){status.replaceChildren(document.createTextNode('Sign in to see your saved progress across all topics. '));const a=document.createElement('a');a.href='index.html#cloudProgress';a.textContent='Go to sign in';status.append(a);return;}
        let loaded=0;
        await Promise.all(topics.map(async([topic,label])=>{
            const card=document.createElement('article');card.className='overall-card';const h=document.createElement('h2');h.textContent=label;card.append(h);grid.append(card);
            const p=document.createElement('p');p.textContent='Loading…';card.append(p);
            const a=document.createElement('a');a.href=`progress.html?topic=${topic}`;a.textContent='View topic progress';card.append(a);
            try{const result=await client.rpc('get_placement_dashboard',{p_topic:topic});if(result.error)throw result.error;
                const s=result.data?.summary;if(!s)throw new Error('Missing summary');loaded++;
                p.textContent=`${n(s.mastered_mcq)} / ${n(s.total_mcq)} MCQs mastered · ${n(s.quiz_sessions)} quizzes submitted · ${n(s.quiz_accuracy)}% quiz accuracy`;
            }catch{p.textContent='This topic summary could not load. Open topic progress to retry.';}
        }));
        status.textContent=`${loaded} of ${topics.length} topic summaries loaded. These are saved quiz results, not a prediction of placement success. Coding and scenario details remain in each topic dashboard.`;
    }catch(error){status.textContent=error.message+' Refresh this page to retry.';}
})();
