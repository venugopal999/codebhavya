(function () {
  'use strict';

  if (window.matchMedia('(display-mode: standalone)').matches || navigator.standalone === true) return;

  let installPrompt = null;
  window.addEventListener('beforeinstallprompt', function (event) {
    event.preventDefault();
    installPrompt = event;
  });

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
      navigator.serviceWorker.register('/service-worker.js', {scope: '/'}).catch(function () {});
    });
  }

  const banner = document.createElement('aside');
  banner.id = 'cb-course-install';
  banner.setAttribute('aria-label', 'Install CodeBhavya');
  banner.innerHTML = '<span>Keep CodeBhavya on your home screen</span>' +
    '<button type="button" class="cb-course-install-action">Install app</button>' +
    '<button type="button" class="cb-course-install-close" aria-label="Dismiss install suggestion">×</button>' +
    '<p class="cb-course-install-help" role="status" aria-live="polite" hidden></p>';

  const style = document.createElement('style');
  style.textContent =
    '#cb-course-install[hidden],#cb-course-install .cb-course-install-help[hidden]{display:none!important}' +
    '#cb-course-install{box-sizing:border-box;display:flex;flex-wrap:wrap;align-items:center;gap:8px 12px;padding:10px 16px;background:#0b2946;color:#fff;font:600 14px/1.4 system-ui,sans-serif}' +
    '#cb-course-install span{flex:1 1 130px}' +
    '#cb-course-install button{font:inherit;cursor:pointer;border-radius:7px;padding:7px 11px}' +
    '#cb-course-install .cb-course-install-action{background:#f3bd35;border:1px solid #f3bd35;color:#081e33}' +
    '#cb-course-install .cb-course-install-close{background:transparent;border:1px solid #b5c9d8;color:#fff;font-size:18px;padding:3px 9px}' +
    '#cb-course-install button:focus-visible{outline:3px solid #fff;outline-offset:2px}' +
    '#cb-course-install .cb-course-install-help{flex-basis:100%;margin:0;font-weight:400}' +
    '@media (min-width:768px),(display-mode:standalone){#cb-course-install{display:none!important}}';
  document.head.append(style);

  const header = document.querySelector('header.top-header') || document.querySelector('body > header');
  if (header) header.insertAdjacentElement('afterend', banner);
  else document.body.prepend(banner);

  try {
    if (sessionStorage.getItem('cb-install-dismissed') === '1') banner.hidden = true;
  } catch (error) { /* Some browsers disable storage; install stays optional. */ }

  const help = banner.querySelector('.cb-course-install-help');
  banner.querySelector('.cb-course-install-close').addEventListener('click', function () {
    banner.hidden = true;
    try { sessionStorage.setItem('cb-install-dismissed', '1'); } catch (error) {}
  });
  banner.querySelector('.cb-course-install-action').addEventListener('click', async function () {
    if (installPrompt) {
      const prompt = installPrompt;
      installPrompt = null;
      await prompt.prompt();
      const choice = await prompt.userChoice;
      if (choice.outcome !== 'accepted') {
        help.textContent = 'You can also install later from your browser menu.';
        help.hidden = false;
      }
      return;
    }
    const appleDevice = /iPhone|iPad|iPod/i.test(navigator.userAgent) ||
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    help.textContent = appleDevice
      ? 'In Safari, tap Share, then Add to Home Screen.'
      : 'In Chrome, tap ⋮ and choose Install app or Add to Home screen.';
    help.hidden = false;
  });
  window.addEventListener('appinstalled', function () { banner.hidden = true; });
})();
