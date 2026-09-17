(function(){
    'use strict';
    const root=new URL('./',document.currentScript.src);
    function mount(){
        const main=document.querySelector('main');
        if(!main||document.getElementById('placementAccessGuide'))return;
        const sheet=document.createElement('link');sheet.rel='stylesheet';sheet.href=new URL('placement-access-guide.css?v=36',root).href;document.head.append(sheet);
        const section=document.createElement('section');section.id='placementAccessGuide';section.className='pag-guide';section.setAttribute('aria-labelledby','pagTitle');
        const title=document.createElement('h2');title.id='pagTitle';title.textContent='What can I use without signing in?';section.append(title);
        const intro=document.createElement('p');intro.textContent='An account is optional for exploring and planning. Some tools require sign-in to run assessments or keep your work private.';section.append(intro);
        const grid=document.createElement('div');grid.className='pag-grid';section.append(grid);
        const groups=[
            {kind:'guest',label:'Available without sign-in',description:'Explore, revise and plan.',items:[['Preparation plan and readiness check',null],['MCQ revision material','mcq-library.html'],['Company preparation','company-prep.html'],['Coding problem browsing','coding.html']]},
            {kind:'save',label:'Sign in to save results',description:'Guest practice works. Sign in before attempting if you want results saved to your account.',items:[['Timed quizzes','quiz.html'],['Core CS Scenario Lab','core-cs-problems.html']]},
            {kind:'account',label:'Sign-in required',description:'These actions currently need an account.',items:[['Run sample code and submit solutions','coding.html'],['Complete Mock Drive','mock-drive.html'],['Evidence Lab','evidence-lab.html'],['Resume Builder','resume-builder.html'],['Project Story Builder','project-story.html'],['Saved progress dashboard','dashboard.html']]}
        ];
        groups.forEach(group=>{const card=document.createElement('article');card.className='pag-card pag-'+group.kind;const h=document.createElement('h3');h.textContent=group.label;card.append(h);const p=document.createElement('p');p.textContent=group.description;card.append(p);const ul=document.createElement('ul');group.items.forEach(([name,path])=>{const li=document.createElement('li');if(path){const a=document.createElement('a');a.href=new URL(path,root).href;a.textContent=name;li.append(a);}else li.textContent=name;ul.append(li);});card.append(ul);grid.append(card);});
        const note=document.createElement('p');note.className='pag-note';note.textContent='Device-local progress stays in this browser. It is different from account-saved assessment results. Guest attempts are not promised to transfer automatically after sign-in.';section.append(note);
        const cloud=document.getElementById('placementCloudPanel');
        if(cloud&&main.contains(cloud))cloud.insertAdjacentElement('afterend',section);else main.prepend(section);
        const rules={
            'mcq-library.html':'Available without sign-in',
            'company-prep.html':'Available without sign-in',
            'coding.html':'Browse as guest · sign in to run code',
            'solve.html':'Sign-in required to run code',
            'quiz.html':'Guest quiz · sign in to save',
            'core-cs-problems.html':'Guest practice · sign in to save',
            'core-cs-solve.html':'Guest practice · sign in to save',
            'mock-drive.html':'Sign-in required',
            'evidence-lab.html':'Sign-in required',
            'resume-builder.html':'Sign-in required',
            'project-story.html':'Sign-in required',
            'dashboard.html':'Sign-in required',
            'progress.html':'Sign-in required'
        };
        main.querySelectorAll('a[href]').forEach(a=>{
            if(section.contains(a)||a.closest('nav')||a.querySelector('.pag-badge'))return;
            const url=new URL(a.href);if(url.origin!==root.origin||!url.pathname.startsWith(root.pathname))return;
            const label=rules[url.pathname.slice(root.pathname.length)];if(!label)return;
            const badge=document.createElement('span');badge.className='pag-badge';badge.textContent=label;a.append(badge);
        });
    }
    if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount,{once:true});else mount();
})();
