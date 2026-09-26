/* Shared course navigation on the course home and every lesson. */
document.addEventListener('DOMContentLoaded', () => {
    const main = document.querySelector('main.wt-page');
    let layout = document.querySelector('.wt-index-layout');
    let sidebar = document.getElementById('cb-sidebar');
    if (main && !layout) {
        layout = document.createElement('div');
        layout.className = 'wt-lesson-layout';
        sidebar = document.createElement('aside');
        sidebar.id = 'cb-sidebar';
        sidebar.className = 'wt-sidebar-host';
        sidebar.setAttribute('aria-label', 'Web Technologies course topics');
        main.before(layout);
        layout.append(sidebar, main);
    }
    if (!layout || !sidebar) return;

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'wt-mobile-course-toggle';
    button.textContent = '☰ Web Technologies Course';
    button.setAttribute('aria-controls', 'cb-sidebar');
    button.setAttribute('aria-expanded', 'false');
    layout.before(button);

    const backdrop = document.createElement('div');
    backdrop.className = 'wt-mobile-course-backdrop';
    backdrop.hidden = true;
    layout.before(backdrop);
    document.body.classList.add('wt-course-nav-enhanced');

    const updateDrawerTop = () => {
        const bottom = Math.max(0, Math.ceil(button.getBoundingClientRect().bottom));
        document.documentElement.style.setProperty('--wt-course-drawer-top', bottom + 'px');
    };
    const setOpen = open => {
        if (open) updateDrawerTop();
        sidebar.classList.toggle('wt-sidebar-mobile-open', open);
        button.setAttribute('aria-expanded', String(open));
        backdrop.hidden = !open;
        document.body.classList.toggle('wt-course-drawer-open', open);
    };
    button.addEventListener('click', () => setOpen(!sidebar.classList.contains('wt-sidebar-mobile-open')));
    backdrop.addEventListener('click', () => { setOpen(false); button.focus(); });
    document.addEventListener('keydown', event => {
        if (event.key === 'Escape' && sidebar.classList.contains('wt-sidebar-mobile-open')) {
            setOpen(false);
            button.focus();
        }
    });
    sidebar.addEventListener('click', event => {
        if (event.target.closest('a')) setOpen(false);
    });
    window.addEventListener('resize', () => {
        if (window.innerWidth > 760) setOpen(false);
        else if (sidebar.classList.contains('wt-sidebar-mobile-open')) updateDrawerTop();
    }, {passive: true});

    const markCurrent = () => {
        const current = location.pathname.replace(/\/$/, '/index.html');
        sidebar.querySelectorAll('a[href]').forEach(link => {
            const path = new URL(link.getAttribute('href'), location.href).pathname.replace(/\/$/, '/index.html');
            if (path === current) {
                link.classList.add('current');
                link.setAttribute('aria-current', 'page');
            }
        });
    };
    if (main) {
        fetch('sidebar.html', {cache: 'no-cache'}).then(response => {
            if (!response.ok) throw new Error('Sidebar unavailable');
            return response.text();
        }).then(html => { sidebar.innerHTML = html; markCurrent(); })
          .catch(() => {
              const links = [
                  ['index.html','Course Home'],
                  ['introduction.html','01 Introduction to Web Technologies'],
                  ['internet-web-architecture.html','02 Internet and Web Architecture'],
                  ['urls-http-https.html','03 URLs, HTTP and HTTPS'],
                  ['browsers-and-web-servers.html','04 Browsers and Web Servers'],
                  ['html-fundamentals.html','05 HTML Fundamentals'],
                  ['web-application-architecture.html','06 Web Application Architecture'],
                  ['web-development-tools-and-workflow.html','07 Web Development Tools and Workflow']
              ];
              const list = document.createElement('nav');
              list.className = 'wt-sidebar wt-sidebar-fallback';
              list.setAttribute('aria-label', 'Available course topics');
              links.forEach(([href, title]) => {
                  const link = document.createElement('a');
                  link.className = 'wt-sidebar-level available';
                  link.href = href;
                  link.textContent = title;
                  list.append(link);
              });
              sidebar.append(list);
              markCurrent();
          });
    } else {
        sidebar.addEventListener('componentloaded', markCurrent);
        if (sidebar.querySelector('a')) markCurrent();
    }
});
