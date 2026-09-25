/* Presentation-only lesson outline, built from existing section headings. */
document.addEventListener('DOMContentLoaded', () => {
    const main = document.querySelector('main.wt-page');
    if (!main || main.closest('.wt-lesson-layout')) return;

    const sections = Array.from(main.children).filter(node =>
        node.matches('section') && node.querySelector('.section-heading h2, h2')
    );
    if (!sections.length) return;

    const layout = document.createElement('div');
    layout.className = 'wt-lesson-layout';
    const sidebar = document.createElement('aside');
    sidebar.className = 'wt-lesson-sidebar';
    sidebar.setAttribute('aria-label', 'In this lesson');
    const back = document.createElement('a');
    back.className = 'wt-course-back';
    back.href = 'index.html';
    back.textContent = '← Web Technologies course';
    sidebar.append(back);

    const label = document.createElement('span');
    label.className = 'wt-outline-title';
    label.textContent = 'In this lesson';
    sidebar.append(label);
    const links = document.createElement('nav');
    links.className = 'wt-outline-links';
    links.setAttribute('aria-label', 'Lesson sections');
    sections.forEach((section, index) => {
        const heading = section.querySelector('.section-heading h2, h2');
        if (!section.id) section.id = 'wt-outline-section-' + (index + 1);
        const link = document.createElement('a');
        link.href = '#' + section.id;
        link.textContent = heading.textContent.trim().replace(/\s+/g, ' ');
        links.append(link);
    });
    sidebar.append(links);
    main.before(layout);
    layout.append(sidebar, main);

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver(entries => {
            for (const entry of entries) {
                if (!entry.isIntersecting) continue;
                links.querySelectorAll('a[aria-current]').forEach(link => link.removeAttribute('aria-current'));
                const active = Array.from(links.querySelectorAll('a')).find(link => link.hash === '#' + entry.target.id);
                if (active) active.setAttribute('aria-current', 'location');
            }
        }, {rootMargin: '-110px 0px -65% 0px'});
        sections.forEach(section => observer.observe(section));
    }
});
