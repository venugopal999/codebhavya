(function () {
  'use strict';
  const actions = document.querySelector('.cn-hero-actions');
  const links = Array.from(document.querySelectorAll('.cn-nav a[href^="level-"]'));
  if (!actions || links.length !== 12) return;

  const CACHE = 'codebhavya-network-lessons-v1';
  const lessons = links.map(link => new URL(link.href).pathname);
  const files = [
    '/Computer-Networks/index.html', ...lessons,
    '/style.css', '/images/codebhavya-main-logo.png', '/images/codebhavya-icon-32.png',
    '/install-course.js', '/offline-networks.js',
    '/Computer-Networks/networks.css', '/Computer-Networks/networks.js'
  ];

  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'cn-secondary';
  button.textContent = 'Save 12 lessons for offline';
  const status = document.createElement('p');
  status.setAttribute('role', 'status');
  status.setAttribute('aria-live', 'polite');
  status.style.cssText = 'width:100%;margin:4px 0 0;color:#fff;line-height:1.5';
  actions.append(button, status);

  async function updateStatus() {
    if (!('caches' in window) || !('serviceWorker' in navigator)) {
      status.textContent = 'Offline saving is unavailable in this browser.';
      button.disabled = true;
      return;
    }
    const cache = await caches.open(CACHE);
    const complete = (await Promise.all(files.map(file => cache.match(file)))).every(Boolean);
    if (complete) {
      button.textContent = 'Refresh offline lessons';
      status.textContent = '12 lessons saved on this device. External links still need internet.';
    }
  }

  button.addEventListener('click', async function () {
    button.disabled = true;
    status.textContent = 'Saving lessons… stay online until complete.';
    try {
      const registration = await navigator.serviceWorker.register('/service-worker.js', {scope: '/'});
      await registration.update();
      await navigator.serviceWorker.ready;
      const cache = await caches.open(CACHE);
      let done = 0;
      for (const file of files) {
        const response = await fetch(file, {credentials: 'omit', cache: 'no-store'});
        const expected = file.endsWith('.html') ? 'text/html' :
          file.endsWith('.css') ? 'text/css' : file.endsWith('.js') ? 'javascript' : 'image/';
        if (!response.ok || response.redirected || response.type !== 'basic' ||
            !response.headers.get('content-type')?.includes(expected)) {
          throw new Error('Could not save ' + file);
        }
        await cache.put(file, response);
        done++;
        status.textContent = `Saving lessons… ${done} of ${files.length} files.`;
      }
      await updateStatus();
    } catch (error) {
      status.textContent = 'Could not finish saving. Check your connection and tap again to retry.';
    } finally {
      button.disabled = false;
    }
  });
  updateStatus().catch(() => { status.textContent = 'Offline storage is unavailable in this browser.'; });
})();
