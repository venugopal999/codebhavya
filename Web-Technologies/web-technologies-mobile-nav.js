/* Reveal the existing course sidebar only when requested on narrow screens. */
document.addEventListener('DOMContentLoaded', () => {
    const sidebar = document.getElementById('cb-sidebar');
    if (!sidebar || !sidebar.parentElement) return;

    const toggle = document.createElement('button');
    toggle.type = 'button';
    toggle.className = 'wt-mobile-course-toggle';
    toggle.textContent = 'Browse course topics';
    toggle.setAttribute('aria-controls', 'cb-sidebar');
    toggle.setAttribute('aria-expanded', 'false');
    sidebar.before(toggle);
    document.body.classList.add('wt-mobile-nav-ready');

    const close = () => {
        sidebar.classList.remove('wt-sidebar-mobile-open');
        toggle.setAttribute('aria-expanded', 'false');
    };
    toggle.addEventListener('click', () => {
        const open = sidebar.classList.toggle('wt-sidebar-mobile-open');
        toggle.setAttribute('aria-expanded', String(open));
    });
    sidebar.addEventListener('click', event => {
        if (event.target.closest('a')) close();
    });
    window.matchMedia('(min-width: 761px)').addEventListener('change', event => {
        if (event.matches) close();
    });
});
