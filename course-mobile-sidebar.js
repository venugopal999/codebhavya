/* One Web Technologies style mobile menu, with links from the current course. */
(() => {
  'use strict';
  if (window.CodeBhavyaMobileCourseNav) return;
  window.CodeBhavyaMobileCourseNav = true;

  const courses = {
    'C-Programming': ['C Programming', '.docs-layout > .sidebar'],
    Maths: ['Mathematics', '.docs-layout > .sidebar'],
    'Data-Structures': ['Data Structures', '.docs-layout > .sidebar'],
    'Advanced-Data-Structures': ['Advanced Data Structures', '.docs-layout > .sidebar'],
    Python: ['Python', '.docs-layout > .sidebar'],
    'AI-ML': ['AI & ML', '.docs-layout > .sidebar'],
    DBMS: ['DBMS', '.docs-layout > .sidebar'],
    'Operating-Systems': ['Operating Systems', '.os-layout > .os-sidebar'],
    'Computer-Networks': ['Computer Networks', '.cn-layout > .cn-nav'],
    Java: ['Java', '.lesson-layout > .lesson-sidebar'],
    'Full-Stack': ['Full Stack', '.lesson-layout > aside#sidebar']
  };
  const folder = decodeURIComponent(location.pathname.split('/').filter(Boolean)[0] || '');
  const course = courses[folder];
  if (!course) return;

  function start() {
    const original = document.querySelector(course[1]);
    if (!original || document.querySelector('.cb-mobile-course-toggle')) return;
    const mobile = matchMedia('(max-width: 820px)');

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'cb-mobile-course-toggle';
    button.textContent = '☰ ' + course[0] + ' Course';
    button.setAttribute('aria-controls', 'cbMobileCourseSidebar');
    button.setAttribute('aria-expanded', 'false');
    const backdrop = document.createElement('div');
    backdrop.className = 'cb-mobile-course-backdrop';
    backdrop.hidden = true;
    const drawer = document.createElement('aside');
    drawer.id = 'cbMobileCourseSidebar';
    drawer.className = 'cb-mobile-course-sidebar';
    drawer.setAttribute('aria-label', course[0] + ' course topics');
    original.parentElement.before(button, backdrop, drawer);
    document.body.classList.add('cb-mobile-course-ready');

    const header = document.createElement('div');
    header.className = 'cb-mobile-course-header';
    const kicker = document.createElement('span');
    kicker.textContent = 'CODEBHAVYA COURSE';
    const heading = document.createElement('h2');
    heading.textContent = course[0];
    const description = document.createElement('p');
    description.textContent = 'Choose a topic to continue learning';
    header.append(kicker, heading, description);
    const home = document.createElement('a');
    home.className = 'cb-mobile-course-home';
    home.href = 'index.html';
    home.textContent = '⌂  Course Home';
    const search = document.createElement('input');
    search.type = 'search';
    search.className = 'cb-mobile-course-search';
    search.placeholder = 'Search course topics';
    search.setAttribute('aria-label', 'Search ' + course[0] + ' topics');
    const list = document.createElement('nav');
    list.className = 'cb-mobile-course-list';
    list.setAttribute('aria-label', 'Course topics');
    drawer.append(header, home, search, list);

    function close(focus = false) {
      drawer.classList.remove('is-open');
      document.body.classList.remove('cb-mobile-course-open');
      button.setAttribute('aria-expanded', 'false');
      backdrop.hidden = true;
      drawer.toggleAttribute('inert', mobile.matches);
      if (focus && mobile.matches) button.focus();
    }
    function open() {
      if (!mobile.matches) return;
      document.documentElement.style.setProperty('--cb-mobile-course-top', Math.max(0, Math.ceil(button.getBoundingClientRect().bottom)) + 'px');
      drawer.classList.add('is-open');
      drawer.removeAttribute('inert');
      document.body.classList.add('cb-mobile-course-open');
      button.setAttribute('aria-expanded', 'true');
      backdrop.hidden = false;
    }

    const indexPath = new URL('index.html', location.href).pathname;
    const currentPath = location.pathname.endsWith('/') ? indexPath : location.pathname;
    function isHome(link) {
      if (link.matches('.course-home,.os-home-link,.cn-nav-home') || link.getAttribute('href') === '#courseTop') return true;
      const path = new URL(link.getAttribute('href'), location.href).pathname;
      return path === indexPath || path === indexPath.replace(/index\.html$/, '');
    }
    function render() {
      const fragment = document.createDocumentFragment();
      let number = 0;
      let homeSource = null;
      const query = search.value.trim().toLocaleLowerCase();
      const nodes = original.querySelectorAll('a[href],.sidebar-title,.os-sidebar-group,.sidebar-part');
      nodes.forEach(node => {
        if (!node.matches('a[href]')) {
          const label = node.textContent.trim();
          if (!query && label && !label.toLocaleLowerCase().includes(course[0].toLocaleLowerCase())) {
            const group = document.createElement('div');
            group.className = 'cb-mobile-course-group';
            group.textContent = label;
            fragment.append(group);
          }
          return;
        }
        if (isHome(node)) { homeSource ||= node; return; }
        const label = node.textContent.trim().replace(/\s+/g, ' ');
        if (!label || query && !label.toLocaleLowerCase().includes(query)) return;
        number++;
        const link = document.createElement('a');
        link.className = 'cb-mobile-course-link';
        link.href = node.getAttribute('href');
        if (node.hasAttribute('aria-disabled')) link.setAttribute('aria-disabled', node.getAttribute('aria-disabled'));
        const badge = document.createElement('span');
        badge.className = 'cb-mobile-course-number';
        badge.textContent = String(node.dataset.level || node.getAttribute('href')?.match(/level-(\d+)/)?.[1] || number).padStart(2, '0');
        const title = document.createElement('strong');
        title.textContent = label;
        link.append(badge, title);
        const target = new URL(link.href);
        if (node.classList.contains('active') || node.hasAttribute('aria-current') || (target.pathname === currentPath && target.search === location.search && !target.hash)) {
          link.classList.add('current');
          link.setAttribute('aria-current', 'page');
        }
        link.addEventListener('click', event => {
          event.preventDefault();
          close();
          node.click(); // Run the existing link's navigation and any listeners.
        });
        fragment.append(link);
      });
      home.onclick = event => {
        if (!homeSource) { close(); return; }
        event.preventDefault();
        close();
        homeSource.click();
      };
      list.replaceChildren(fragment);
      search.hidden = !original.querySelector('input[type="search"],input.search-box') && nodes.length < 15;
    }

    search.addEventListener('input', render);
    new MutationObserver(() => {
      if (document.body.contains(original)) render();
    }).observe(original, { childList: true, subtree: true });
    render();
    button.addEventListener('click', () => drawer.classList.contains('is-open') ? close() : open());
    backdrop.addEventListener('click', () => close(true));
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && drawer.classList.contains('is-open')) close(true);
    });
    mobile.addEventListener('change', close);
    close();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
  else start();
})();
