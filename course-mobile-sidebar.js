/* A single mobile course drawer using each course's existing sidebar and links. */
(() => {
  'use strict';
  if (window.__cbCourseMobileSidebar) return;
  window.__cbCourseMobileSidebar = true;

  const courses = {
    'C-Programming': ['C Programming', '.docs-layout > .sidebar'],
    'Maths': ['Mathematics', '.docs-layout > .sidebar'],
    'Data-Structures': ['Data Structures', '.docs-layout > .sidebar'],
    'Advanced-Data-Structures': ['Advanced Data Structures', '.docs-layout > .sidebar'],
    'Python': ['Python', '.docs-layout > .sidebar'],
    'AI-ML': ['AI & ML', '.docs-layout > .sidebar'],
    'DBMS': ['DBMS', '.docs-layout > .sidebar'],
    'Operating-Systems': ['Operating Systems', '.os-layout > .os-sidebar'],
    'Computer-Networks': ['Computer Networks', '.cn-layout > .cn-nav'],
    'Java': ['Java', '.lesson-layout > .lesson-sidebar'],
    'Full-Stack': ['Full Stack', '.lesson-layout > aside']
  };
  const folder = decodeURIComponent(location.pathname.split('/').filter(Boolean)[0] || '');
  const course = courses[folder];
  if (!course) return;

  const css = document.createElement('link');
  css.rel = 'stylesheet';
  css.href = new URL('../course-mobile-sidebar.css?v=3', document.currentScript?.src || location.href).href;
  document.head.append(css);

  function init() {
    const sidebar = document.querySelector(course[1]);
    const layout = sidebar?.parentElement;
    if (!sidebar || !layout || document.querySelector('.cb-course-menu-button')) return;

    const oldToggle = document.querySelector('.os-sidebar-toggle, .aiml-sidebar-toggle, .dbms-sidebar-toggle, .python-sidebar-toggle, .lesson-menu');
    const oldBackdrop = document.querySelector('.os-sidebar-backdrop, .dbms-sidebar-backdrop, .aiml-sidebar-backdrop, .python-sidebar-backdrop, .sidebar-shade, .shade');
    if (oldToggle) oldToggle.hidden = true;
    if (oldBackdrop) oldBackdrop.hidden = true;

    if (!sidebar.id) sidebar.id = 'cbCourseSidebar';
    sidebar.classList.add('cb-course-sidebar');

    // Give each course's existing links the same visual structure as the Web
    // Technologies roadmap. Keep the original nodes, hrefs and listeners.
    const header = document.createElement('div');
    header.className = 'cb-course-drawer-header';
    const kicker = document.createElement('span');
    kicker.textContent = 'CODEBHAVYA COURSE';
    const heading = document.createElement('h2');
    heading.textContent = course[0];
    const subtitle = document.createElement('p');
    subtitle.textContent = 'Choose a topic to continue learning';
    header.append(kicker, heading, subtitle);
    sidebar.prepend(header);

    const originalTitle = sidebar.querySelector('.sidebar-title, .os-sidebar-title');
    if (originalTitle && originalTitle.textContent.trim().toLowerCase().includes(course[0].toLowerCase())) {
      originalTitle.classList.add('cb-course-original-title');
    }

    let home = sidebar.querySelector('a[href="index.html"], a[href="./"], a[href="#courseTop"], a.course-home');
    if (!home) {
      home = document.createElement('a');
      home.href = 'index.html';
      home.textContent = '⌂  Course Home';
      home.classList.add('cb-course-generated-home');
      header.after(home);
    }
    home.classList.add('cb-course-home-link');

    function decorateLinks() {
      sidebar.querySelectorAll('.sidebar-title, .os-sidebar-group').forEach(group => {
        if (!group.classList.contains('cb-course-original-title')) group.classList.add('cb-course-group');
      });
      sidebar.querySelectorAll('a[href]').forEach(link => {
        if (link === home) return;
        link.classList.add('cb-course-topic-link');
        if (link.getAttribute('href')?.startsWith('#')) link.classList.add('cb-course-section-link');
      });
    }
    decorateLinks();
    new MutationObserver(decorateLinks).observe(sidebar, { childList: true, subtree: true });

    const toggle = document.createElement('button');
    toggle.type = 'button';
    toggle.className = 'cb-course-menu-button';
    toggle.textContent = '☰ ' + course[0] + ' Course';
    toggle.setAttribute('aria-controls', sidebar.id);
    toggle.setAttribute('aria-expanded', 'false');

    const backdrop = document.createElement('div');
    backdrop.className = 'cb-course-menu-backdrop';
    backdrop.hidden = true;
    layout.before(toggle);
    layout.before(backdrop);
    document.body.classList.add('cb-course-menu-ready');

    const mobile = matchMedia('(max-width: 768px)');
    function setOpen(open, restoreFocus = false) {
      const shouldOpen = Boolean(open && mobile.matches);
      if (shouldOpen) {
        const bottom = Math.max(0, Math.min(innerHeight - 80, Math.ceil(toggle.getBoundingClientRect().bottom)));
        document.documentElement.style.setProperty('--cb-course-menu-top', bottom + 'px');
      }
      sidebar.classList.toggle('cb-course-menu-open', shouldOpen);
      document.body.classList.toggle('cb-course-menu-open', shouldOpen);
      backdrop.hidden = !shouldOpen;
      toggle.setAttribute('aria-expanded', String(shouldOpen));
      sidebar.toggleAttribute('inert', !shouldOpen && mobile.matches);
      if (restoreFocus && !shouldOpen && mobile.matches) toggle.focus();
    }

    toggle.addEventListener('click', () => setOpen(!sidebar.classList.contains('cb-course-menu-open')));
    backdrop.addEventListener('click', () => setOpen(false, true));
    sidebar.addEventListener('click', event => {
      if (event.target.closest('a[href]')) setOpen(false);
    });
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && sidebar.classList.contains('cb-course-menu-open')) setOpen(false, true);
    });
    function onViewportChange() {
      setOpen(false);
      sidebar.toggleAttribute('inert', mobile.matches);
    }
    mobile.addEventListener('change', onViewportChange);
    onViewportChange();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
