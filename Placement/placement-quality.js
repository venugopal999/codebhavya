(function(){
    'use strict';
    const page=location.pathname.split('/').pop();
    const finish=document.createElement('link');finish.rel='stylesheet';
    finish.href=new URL('placement-finish.css?v=30',document.currentScript.src).href;
    document.head.append(finish);
    if(page==='practice.html'){
        const counts=document.createElement('script');
        counts.src=new URL('placement-hub-counts.js?v=28',document.currentScript.src).href;
        document.head.append(counts);
    }
    const notes={
        'practice.html':['Choose how you practise','Read MCQ material and browse problems without signing in. Quizzes and Core CS practice support guest use; sign in to save results. Code execution, Mock Drive, Evidence Lab, Resume Builder and saved progress currently require sign-in.'],
        'quiz.html':['Sign in to save progress','You can take this quiz as a guest. Sign in before starting if you want results connected to your account.'],
        'solve.html':['Sign-in required for code execution','You can read the problem without signing in. Running sample tests and submitting code currently require an account.'],
        'mcq-library.html':['Available without sign-in','Read explanations without an account. Device-local bookmarks are not the same as saved assessment results.'],
        'interview.html':['Guided self-review','Checklist results are your self-assessment, not an independent assessment of technical correctness. Use the model points and follow-up answers to check your reasoning.']
    };
    const main=document.querySelector('main');
    if(main&&notes[page]){const box=document.createElement('aside');box.className='placement-access';const title=document.createElement('strong');title.textContent=notes[page][0];box.append(title,document.createTextNode(notes[page][1]));main.prepend(box);}
    if(!document.querySelector('body > footer, footer.footer')){
        const footer=document.createElement('footer');footer.className='placement-global-footer';
        footer.innerHTML='<div class="pf-columns"><div class="pf-brand"><div><span>Code</span><b>Bhavya</b></div><p class="pf-tagline">From Learning to Limitless Possibilities.</p><p>Learn, practice, build and grow with structured learning resources.</p></div></div>';
        const groups=[['Quick Links',[['Home','../index.html'],['Placement','index.html'],['Overall Progress','dashboard.html']]],['Learning',[['C Programming','../C-Programming/'],['Python','../Python/'],['Data Structures','../Data-Structures/'],['Advanced Data Structures','../Advanced-Data-Structures/'],['Maths','../Maths/'],['AI & Machine Learning','../AI-ML/']]],['Practice',[['Practice Hub','practice.html'],['MCQ Library','mcq-library.html'],['Coding Arena','coding.html'],['Mock Drive','mock-drive.html'],['Interview Coach','interview.html'],['Evidence Lab','evidence-lab.html']]]];
        groups.forEach(([heading,links])=>{const nav=document.createElement('nav');nav.setAttribute('aria-label',heading+' footer links');const h=document.createElement('h2');h.textContent=heading;nav.append(h);links.forEach(([name,url])=>{const a=document.createElement('a');a.textContent=name;a.href=url;nav.append(a);});footer.querySelector('.pf-columns').append(nav);});
        const bottom=document.createElement('div');bottom.className='pf-bottom';bottom.textContent=`© ${new Date().getFullYear()} CodeBhavya. All Rights Reserved.`;footer.append(bottom);document.body.append(footer);
    }
})();
