(async function(){
    'use strict';
    const root=new URL('./',document.currentScript.src);
    const cards=[...document.querySelectorAll('.hub-topic')].map(card=>{
        const link=card.querySelector('a[href*="mcq-library.html?topic="]');
        const line=card.querySelector('li');
        if(!link||!line)return null;
        const topic=new URL(link.href).searchParams.get('topic');
        line.textContent='Explained MCQ library · checking published question count…';
        return {topic,line};
    }).filter(Boolean);
    function load(src){return new Promise((resolve,reject)=>{
        const script=document.createElement('script');script.src=src;script.onload=resolve;script.onerror=()=>reject(new Error('Could not load question count connection'));
        const timer=setTimeout(()=>reject(new Error('Connection timed out')),12000);
        script.addEventListener('load',()=>clearTimeout(timer));script.addEventListener('error',()=>clearTimeout(timer));document.head.append(script);
    });}
    function fallback(){cards.forEach(({line})=>line.textContent='Explained MCQ library · open the library to view available questions');}
    try{
        if(!window.CodeBhavyaSupabase?.client){
            await load(new URL('supabase-config.js',root).href);
            if(!window.supabase?.createClient)await load('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2');
            await load(new URL('supabase-client.js',root).href);
        }
        const client=window.CodeBhavyaSupabase?.client;if(!client)throw new Error('No client');
        await Promise.all(cards.map(async({topic,line})=>{
            try{
                const controller=new AbortController();const timer=setTimeout(()=>controller.abort(),12000);
                let result;
                try{result=await client.from('mcq_questions').select('id',{count:'exact',head:true}).eq('topic',topic).eq('is_published',true).abortSignal(controller.signal);}finally{clearTimeout(timer);}
                if(result.error||!Number.isInteger(result.count))throw new Error('Count unavailable');
                line.textContent=`${result.count} published MCQ${result.count===1?'':'s'} in reading and assessment modes`;
            }catch{line.textContent='Explained MCQ library · open the library to view available questions';}
        }));
    }catch{fallback();}
})();
