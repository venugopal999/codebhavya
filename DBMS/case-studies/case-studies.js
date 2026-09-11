"use strict";

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

const menuButton = $("#menuToggle");
const nav = $("#siteNav");
menuButton?.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  menuButton.setAttribute("aria-expanded", String(open));
  menuButton.textContent = open ? "×" : "☰";
});

$$('[data-code-source]').forEach(async (code) => {
  try {
    const response = await fetch(code.dataset.codeSource);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    code.textContent = await response.text();
    code.classList.remove("loading");
  } catch (_error) {
    code.textContent = "Unable to load the source file. Open the programs folder directly.";
  }
});

$$('[data-copy-target]').forEach((button) => button.addEventListener("click", async () => {
  const code = $(button.dataset.copyTarget);
  if (!code || code.classList.contains("loading")) return;
  try {
    await navigator.clipboard.writeText(code.textContent);
    const label = button.textContent;
    button.textContent = "Copied!";
    setTimeout(() => { button.textContent = label; }, 1300);
  } catch (_error) {
    button.textContent = "Select code manually";
  }
}));

$$('.trace-box').forEach((box) => {
  const steps = $$('.trace-steps li', box);
  const state = $('.trace-state p', box);
  const counter = $('.trace-counter', box);
  let index = -1;
  let timer = null;
  const render = () => {
    steps.forEach((step, i) => step.classList.toggle('active', i === index));
    state.textContent = index < 0 ? "Press Next to begin." : steps[index].dataset.state || steps[index].textContent;
    counter.textContent = `${Math.max(index + 1, 0)} / ${steps.length}`;
    steps[index]?.scrollIntoView({block:'nearest'});
    $('[data-trace-next]', box).disabled = index >= steps.length - 1;
  };
  $('[data-trace-next]', box)?.addEventListener('click', () => { if (index < steps.length - 1) index++; render(); });
  $('[data-trace-reset]', box)?.addEventListener('click', () => { clearInterval(timer); timer=null; index=-1; render(); });
  $('[data-trace-auto]', box)?.addEventListener('click', (event) => {
    if (timer) { clearInterval(timer); timer=null; event.currentTarget.textContent='▶ Auto Run'; return; }
    event.currentTarget.textContent='Ⅱ Pause';
    timer=setInterval(() => { if (index >= steps.length - 1) { clearInterval(timer);timer=null;event.currentTarget.textContent='▶ Auto Run';return; } index++;render(); }, 900);
  });
  render();
});

$$('.quiz').forEach((quiz) => {
  $$('.quiz-option', quiz).forEach((option) => option.addEventListener('click', () => {
    if ($('.quiz-option.correct,.quiz-option.wrong', quiz)) return;
    const correct = option.dataset.correct === 'true';
    option.classList.add(correct ? 'correct' : 'wrong');
    if (!correct) $('.quiz-option[data-correct="true"]', quiz)?.classList.add('correct');
    $('.quiz-feedback', quiz).textContent = correct ? `Correct — ${quiz.dataset.explanation}` : `Not quite. ${quiz.dataset.explanation}`;
  }));
});

const tocLinks = $$('.toc a');
const observed = tocLinks.map(link => $(link.getAttribute('href'))).filter(Boolean);
if ('IntersectionObserver' in window && observed.length) {
  const observer = new IntersectionObserver((entries) => {
    entries.filter(e => e.isIntersecting).forEach(entry => {
      tocLinks.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`));
    });
  }, {rootMargin:'-15% 0px -70% 0px'});
  observed.forEach(section => observer.observe(section));
}

const backTop = $('#backTop');
window.addEventListener('scroll', () => backTop?.classList.toggle('show', scrollY > 600), {passive:true});
backTop?.addEventListener('click', () => scrollTo({top:0,behavior:'smooth'}));
$('#year') && ($('#year').textContent = new Date().getFullYear());
