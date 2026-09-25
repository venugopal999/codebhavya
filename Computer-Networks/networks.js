(() => {
  'use strict';
  const storageKey = 'codebhavya-cn-completed-v1';
  const readCompleted = () => {
    try {
      const value = JSON.parse(localStorage.getItem(storageKey) || '[]');
      return Array.isArray(value) ? value.filter(Number.isInteger) : [];
    } catch (_) { return []; }
  };
  const completed = readCompleted();
  document.querySelectorAll('.cn-nav a[href^="level-"]').forEach(link => {
    const number = Number(link.querySelector('span')?.textContent);
    if (completed.includes(number)) link.setAttribute('title', 'Completed');
  });
  const resume = document.getElementById('cnResume');
  if (resume) {
    const next = Array.from(document.querySelectorAll('.cn-nav a[href^="level-"]'))
      .find(link => !completed.includes(Number(link.querySelector('span')?.textContent)));
    if (next) { resume.href = next.getAttribute('href'); resume.textContent = 'Continue: ' + next.textContent.trim() + ' →'; }
    else if (completed.length >= 12) { resume.textContent = 'Review lesson 1 →'; }
  }
  const lesson = document.querySelector('.cn-lesson[data-lesson]');
  if (lesson) {
    lesson.querySelector('.cn-check-button')?.addEventListener('click', () => {
      const answer = lesson.querySelector('input[name="cn-answer"]:checked');
      const feedback = lesson.querySelector('.cn-feedback');
      if (!answer) { feedback.textContent = 'Choose an answer first.'; feedback.className = 'cn-feedback incorrect'; return; }
      const correct = Number(answer.value) === Number(lesson.dataset.correct);
      feedback.textContent = (correct ? 'Correct. ' : 'Try again. ') + lesson.dataset.explanation;
      feedback.className = 'cn-feedback ' + (correct ? 'correct' : 'incorrect');
      if (correct) {
        const number = Number(lesson.dataset.lesson);
        if (!completed.includes(number)) {
          completed.push(number);
          try { localStorage.setItem(storageKey, JSON.stringify(completed)); } catch (_) { /* browser storage may be disabled */ }
        }
      }
    });
  }
  const form = document.getElementById('cnSubnetForm');
  if (form) {
    const output = document.getElementById('cnSubnetResult');
    const address = number => [24, 16, 8, 0].map(shift => (number >>> shift) & 255).join('.');
    form.addEventListener('submit', event => {
      event.preventDefault();
      const parts = document.getElementById('cnIp').value.trim().split('.');
      const prefix = Number(document.getElementById('cnPrefix').value);
      if (parts.length !== 4 || parts.some(part => !/^\d{1,3}$/.test(part) || Number(part) > 255) || !Number.isInteger(prefix) || prefix < 1 || prefix > 30) {
        output.textContent = 'Enter four IPv4 octets from 0 to 255 and a prefix from /1 to /30.';
        return;
      }
      const value = parts.reduce((acc, part) => ((acc << 8) | Number(part)) >>> 0, 0);
      const mask = (0xffffffff << (32 - prefix)) >>> 0;
      const network = (value & mask) >>> 0;
      const broadcast = (network | (~mask >>> 0)) >>> 0;
      output.textContent = 'Network: ' + address(network) + '/' + prefix + ' · Mask: ' + address(mask) + ' · Broadcast: ' + address(broadcast) + ' · Usual host range: ' + address(network + 1) + ' – ' + address(broadcast - 1) + ' (' + (2 ** (32 - prefix) - 2) + ' addresses).';
    });
    form.requestSubmit();
  }
})();
