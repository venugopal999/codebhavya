/* =========================================================
   CodeBhavya Full Stack MERN — Lesson Engine
   V3 — Gray Dark / Structured Content Renderer
   ========================================================= */

"use strict";

const STORAGE_KEY = "codebhavya.fullstack.progress.v1";
const levels = Array.isArray(window.FULLSTACK_LEVELS) ? window.FULLSTACK_LEVELS : [];
const lessons = window.FULLSTACK_LESSONS || {};

const params = new URLSearchParams(window.location.search);
const levelNumber = Math.max(1, Math.min(30, Number(params.get("level")) || 1));
const lesson = lessons[levelNumber] || null;

let visualIndex = 0;
let visualTimer = null;
let traceIndex = 0;
let traceTimer = null;

/* ------------------------- helpers ------------------------- */

function esc(value) {
  return String(value ?? "").replace(/[&<>"']/g, char => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"
  })[char]);
}

function rich(value) {
  let text = String(value ?? "");

  /* Preserve only the small, intentional inline vocabulary
     used by CodeBhavya lesson data. */
  text = text
    .replace(/<strong>/gi, "%%STRONG_OPEN%%")
    .replace(/<\/strong>/gi, "%%STRONG_CLOSE%%")
    .replace(/<em>/gi, "%%EM_OPEN%%")
    .replace(/<\/em>/gi, "%%EM_CLOSE%%")
    .replace(/<code>/gi, "%%CODE_OPEN%%")
    .replace(/<\/code>/gi, "%%CODE_CLOSE%%");

  text = esc(text);

  return text
    .replace(/%%STRONG_OPEN%%/g, "<strong>")
    .replace(/%%STRONG_CLOSE%%/g, "</strong>")
    .replace(/%%EM_OPEN%%/g, "<em>")
    .replace(/%%EM_CLOSE%%/g, "</em>")
    .replace(/%%CODE_OPEN%%/g, "<code>")
    .replace(/%%CODE_CLOSE%%/g, "</code>");
}

function arr(value) {
  return Array.isArray(value) ? value : [];
}

function textOf(value) {
  if (typeof value === "string") return value;
  if (!value || typeof value !== "object") return "";
  return value.text || value.description || value.detail || value.content || "";
}

function getProgress() {
  try {
    const value = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

function setProgress(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

/* ------------------------- sidebar ------------------------- */

function renderSidebar() {
  const nav = document.getElementById("levelNav");
  if (!nav) return;

  nav.innerHTML = levels.map(level => {
    const n = Number(level.n);
    const available = level.available !== false;

    return `
      <a class="${n === levelNumber ? "active" : ""} ${available ? "" : "locked"}"
         href="${available ? `lesson.html?level=${n}` : "#"}"
         ${available ? "" : 'aria-disabled="true" tabindex="-1"'}>
        <b>${String(n).padStart(2, "0")}</b>
        <span>${esc(level.title || `Level ${n}`)}</span>
        ${available ? "" : "<small>planned</small>"}
      </a>
    `;
  }).join("");
}

/* ------------------------- reusable blocks ------------------------- */

function renderCode(code, label = "WORKED EXAMPLE") {
  if (!code) return "";

  return `
    <div class="code-box premium-code-box">
      <header>
        <span>${esc(label)}</span>
        <button type="button" data-copy="${esc(code)}">Copy</button>
      </header>
      <pre><code>${esc(code)}</code></pre>
    </div>
  `;
}

function renderPoints(points) {
  const items = arr(points);
  if (!items.length) return "";

  return `
    <div class="content-list-wrap">
      <ul class="content-points">
        ${items.map(point => `<li>${rich(textOf(point) || point)}</li>`).join("")}
      </ul>
    </div>
  `;
}

function renderKeyIdea(text) {
  if (!text) return "";
  return `
    <aside class="key-idea">
      <div class="callout-icon">!</div>
      <div>
        <span class="callout-label">KEY IDEA</span>
        <p>${rich(text)}</p>
      </div>
    </aside>
  `;
}

function renderWarning(text) {
  if (!text) return "";
  return `
    <aside class="warning-box">
      <div class="callout-icon">!</div>
      <div>
        <span class="callout-label">IMPORTANT</span>
        <p>${rich(text)}</p>
      </div>
    </aside>
  `;
}

function renderCommonMistake(text) {
  if (!text) return "";
  return `
    <aside class="mistake-box">
      <div class="callout-icon">×</div>
      <div>
        <span class="callout-label">COMMON MISTAKE</span>
        <p>${rich(text)}</p>
      </div>
    </aside>
  `;
}

function renderExample(example) {
  if (!example) return "";

  return `
    <div class="real-example">
      <div class="block-heading">
        <span>REAL-WORLD EXAMPLE</span>
        <strong>${esc(example.title || "Example")}</strong>
      </div>
      ${example.text ? `<p>${rich(example.text)}</p>` : ""}
      ${arr(example.steps).length ? `
        <ol class="numbered-list">
          ${example.steps.map(step => `<li>${rich(step)}</li>`).join("")}
        </ol>
      ` : ""}
      ${example.code ? renderCode(example.code, "EXAMPLE CODE") : ""}
      ${example.output ? `
        <div class="output-box">
          <span>EXPECTED RESULT</span>
          <pre>${esc(example.output)}</pre>
        </div>
      ` : ""}
    </div>
  `;
}

/* ------------------------- tables ------------------------- */

function renderComparison(data) {
  if (!data) return "";

  const headers = arr(data.headers);
  const rows = arr(data.rows);
  if (!headers.length || !rows.length) return "";

  return `
    <div class="structured-table-wrap">
      ${data.title ? `<h3 class="sub-block-title">${esc(data.title)}</h3>` : ""}
      <div class="table-scroll">
        <table class="structured-table">
          <thead>
            <tr>
              ${headers.map(h => `<th scope="col">${rich(h)}</th>`).join("")}
            </tr>
          </thead>
          <tbody>
            ${rows.map(row => {
              const cells = Array.isArray(row) ? row : [];
              return `
                <tr>
                  ${cells.map((cell, i) =>
                    `<td ${i === 0 ? 'data-label=""' : ""}>${rich(cell)}</td>`
                  ).join("")}
                </tr>
              `;
            }).join("")}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

/* ------------------------- flows ------------------------- */

function normalizeFlowItem(item) {
  if (typeof item === "string") return { title: item, detail: "" };
  return {
    title: item?.title || item?.name || item?.label || "",
    detail: item?.detail || item?.description || item?.explain || ""
  };
}

function renderFlow(flow, title = "Step-by-Step Flow") {
  const items = arr(flow).map(normalizeFlowItem).filter(item => item.title);
  if (!items.length) return "";

  return `
    <div class="learning-flow">
      <h3 class="sub-block-title">${esc(title)}</h3>
      <div class="flow-list">
        ${items.map((item, index) => `
          <div class="flow-stage">
            <article class="flow-card">
              <div class="flow-number">${String(index + 1).padStart(2, "0")}</div>
              <div class="flow-card-body">
                <h4>${rich(item.title)}</h4>
                ${item.detail ? `<p>${rich(item.detail)}</p>` : ""}
              </div>
            </article>
            ${index < items.length - 1 ? `<div class="flow-connector" aria-hidden="true">↓</div>` : ""}
          </div>
        `).join("")}
      </div>
    </div>
  `;
}

/* ------------------------- methods / grouped content ------------------------- */

function renderMethods(methods) {
  const items = arr(methods);
  if (!items.length) return "";

  return `
    <div class="method-grid">
      ${items.map(method => `
        <article class="method-card">
          <span class="card-kicker">${esc(method.category || "CONCEPT")}</span>
          <h3>${esc(method.name || method.title || "")}</h3>
          ${method.purpose ? `<p>${rich(method.purpose)}</p>` : ""}
          ${method.example ? `<code class="inline-code-block">${esc(method.example)}</code>` : ""}
        </article>
      `).join("")}
    </div>
  `;
}

function renderGroups(groups) {
  const items = arr(groups);
  if (!items.length) return "";

  return `
    <div class="status-grid">
      ${items.map(group => `
        <article class="status-card">
          ${group.code ? `<div class="status-code">${esc(group.code)}</div>` : ""}
          <h3>${esc(group.title || group.name || "")}</h3>
          ${group.description ? `<p>${rich(group.description)}</p>` : ""}
          ${arr(group.examples).length ? `
            <ul>
              ${group.examples.map(example => `<li>${rich(example)}</li>`).join("")}
            </ul>
          ` : ""}
        </article>
      `).join("")}
    </div>
  `;
}

function renderBreakdown(items) {
  const rows = arr(items);
  if (!rows.length) return "";

  return `
    <div class="url-breakdown">
      ${rows.map(item => `
        <article>
          <div class="url-part">${esc(item.label || item.part || "")}</div>
          <div>
            ${item.value ? `<code>${esc(item.value)}</code>` : ""}
            <p>${rich(item.description || item.detail || "")}</p>
          </div>
        </article>
      `).join("")}
    </div>
  `;
}

function renderArchitecture(items) {
  const rows = arr(items);
  if (!rows.length) return "";

  return `
    <div class="architecture-flow">
      ${rows.map((item, index) => `
        <article class="architecture-card">
          <div class="architecture-number">${String(index + 1).padStart(2, "0")}</div>
          <div>
            <h3>${esc(item.title || item.name || "")}</h3>
            ${arr(item.items).length ? `
              <ul>${item.items.map(v => `<li>${rich(v)}</li>`).join("")}</ul>
            ` : ""}
            ${item.description ? `<p>${rich(item.description)}</p>` : ""}
          </div>
        </article>
        ${index < rows.length - 1 ? `<div class="architecture-arrow">↓</div>` : ""}
      `).join("")}
    </div>
  `;
}

function renderMessage(message, type) {
  if (!message) return "";

  return `
    <div class="message-panel ${esc(type || "")}">
      <span class="message-title">${type === "request-message" ? "REQUEST" : "RESPONSE"}</span>
      ${message.title ? `<h3>${esc(message.title)}</h3>` : ""}
      <div class="message-grid">
        ${message.method ? `<div><span>METHOD</span><strong>${esc(message.method)}</strong></div>` : ""}
        ${message.path ? `<div><span>PATH</span><code>${esc(message.path)}</code></div>` : ""}
        ${message.status ? `<div><span>STATUS</span><strong>${esc(message.status)}</strong></div>` : ""}
      </div>
      ${arr(message.headers).length ? `
        <div class="message-section">
          <strong>Headers</strong>
          <ul>${message.headers.map(h => `<li><code>${esc(h)}</code></li>`).join("")}</ul>
        </div>
      ` : ""}
      ${message.body ? `
        <div class="message-section">
          <strong>Body</strong>
          <pre>${esc(typeof message.body === "string" ? message.body : JSON.stringify(message.body, null, 2))}</pre>
        </div>
      ` : ""}
      ${arr(message.steps).length ? `
        <ol class="numbered-list">${message.steps.map(step => `<li>${rich(step)}</li>`).join("")}</ol>
      ` : ""}
    </div>
  `;
}

function renderRolePanel(title, items, icon) {
  const values = arr(items);
  if (!values.length) return "";

  return `
    <article class="role-card">
      <div class="role-heading">
        <span>${icon}</span>
        <h3>${esc(title)}</h3>
      </div>
      <ul>${values.map(item => `<li>${rich(item)}</li>`).join("")}</ul>
    </article>
  `;
}

function renderTryIt(data) {
  if (!data) return "";

  return `
    <div class="try-it-box">
      <span class="callout-label">TRY IT YOURSELF</span>
      <h3>${esc(data.title || "Try It Yourself")}</h3>
      ${arr(data.steps).length ? `
        <ol class="numbered-list">${data.steps.map(step => `<li>${rich(step)}</li>`).join("")}</ol>
      ` : ""}
    </div>
  `;
}

function renderMistakes(mistakes) {
  const items = arr(mistakes);
  if (!items.length) return "";

  return `
    <div class="mistake-list">
      ${items.map((mistake, index) => `
        <article>
          <div class="mistake-index">${String(index + 1).padStart(2, "0")}</div>
          <div>
            ${mistake.wrong ? `<div class="wrong-answer"><span>×</span><strong>${rich(mistake.wrong)}</strong></div>` : ""}
            ${mistake.correct ? `<div class="correct-answer"><span>✓</span><p>${rich(mistake.correct)}</p></div>` : ""}
          </div>
        </article>
      `).join("")}
    </div>
  `;
}

/* ------------------------- concept ------------------------- */

function renderConcept(concept, index) {
  const number = concept.number || index + 1;
  const intro = concept.intro || concept.text || concept.explanation || "";

  return `
    <section class="lesson-section concept-section deep-section">
      <div class="concept-heading">
        <div class="concept-number">${String(number).padStart(2, "0")}</div>
        <div>
          <p class="section-label">CONCEPT ${String(number).padStart(2, "0")}</p>
          <h2>${esc(concept.title || "Concept")}</h2>
        </div>
      </div>

      ${intro ? `<div class="concept-intro">${rich(intro)}</div>` : ""}
      ${renderPoints(concept.points)}
      ${renderKeyIdea(concept.keyIdea)}
      ${renderWarning(concept.warning)}
      ${renderCommonMistake(concept.commonMistake)}
      ${renderExample(concept.example)}

      ${concept.code ? renderCode(concept.code, concept.label || "WORKED EXAMPLE") : ""}
      ${concept.output ? `
        <div class="output-box">
          <span>EXPECTED RESULT</span>
          <pre>${esc(concept.output)}</pre>
        </div>
      ` : ""}

      ${renderComparison(concept.comparison)}
      ${renderMethods(concept.methods)}
      ${renderGroups(concept.groups)}
      ${renderBreakdown(concept.breakdown)}
      ${renderFlow(concept.flow, concept.flowTitle || "Step-by-Step Flow")}
      ${renderMessage(concept.request, "request-message")}
      ${renderMessage(concept.response, "response-message")}

      ${
        concept.frontend || concept.backend
          ? `<div class="role-grid">
               ${renderRolePanel("Frontend", concept.frontend, "01")}
               ${renderRolePanel("Backend", concept.backend, "02")}
             </div>`
          : ""
      }

      ${renderExample(concept.backendExample)}
      ${renderArchitecture(concept.architecture)}
      ${renderTryIt(concept.tryIt)}
      ${renderMistakes(concept.mistakes)}
    </section>
  `;
}

/* ------------------------- sections ------------------------- */

function renderObjectives(items) {
  const values = arr(items);
  if (!values.length) return "";

  return `
    <section class="lesson-section objectives-section">
      <p class="section-label">LEARNING OBJECTIVES</p>
      <h2>What you will learn</h2>
      <div class="objective-card-grid">
        ${values.map((item, index) => `
          <article class="objective-card">
            <div class="objective-number">${String(index + 1).padStart(2, "0")}</div>
            <p>${rich(item)}</p>
          </article>
        `).join("")}
      </div>
    </section>
  `;
}

function renderVisualizer(data) {
  if (!data || !arr(data.steps).length) return "";

  return `
    <section class="lesson-section visualizer-section">
      <p class="section-label">PREMIUM VISUALIZER</p>
      <h2>${esc(data.title || "Interactive Visualizer")}</h2>
      ${data.description ? `<p class="section-description">${rich(data.description)}</p>` : ""}

      <div class="visualizer-premium">
        <div class="visualizer-steps">
          ${data.steps.map((step, index) => `
            <article class="visualizer-step" data-visual-step="${index}">
              <div class="visual-step-number">${String(index + 1).padStart(2, "0")}</div>
              <div>
                <h3>${esc(step.title || `Step ${index + 1}`)}</h3>
                ${step.operation ? `<div class="visual-operation">${rich(step.operation)}</div>` : ""}
                ${step.detail ? `<p>${rich(step.detail)}</p>` : ""}
              </div>
            </article>
          `).join("")}
        </div>
        <div class="visualizer-state">
          <div>
            <span class="trace-state-label">CURRENT STEP</span>
            <strong id="visualState">Ready</strong>
            <p id="visualExplain">Press Next step to begin.</p>
          </div>
          <div class="visualizer-controls">
            <button type="button" id="visualReset">Reset</button>
            <button type="button" id="visualNext" class="primary">Next step</button>
            <button type="button" id="visualAuto">Auto Run</button>
          </div>
        </div>
      </div>
    </section>
  `;
}

function normalizeTrace(trace) {
  if (!trace) return null;

  if (Array.isArray(trace.lines) && trace.lines.length) {
    return {
      lines: trace.lines.map((line, index) => ({
        line: Number.isInteger(line?.line) ? line.line : index + 1,
        code: line?.code || "",
        explanation: line?.explanation || line?.explain || line?.detail || ""
      })),
      title: trace.title || "Follow the execution step by step"
    };
  }

  /* Legacy trace:
     { code: [...], steps: [{line, state, explain}] } */
  if (Array.isArray(trace.code) && trace.code.length) {
    const steps = arr(trace.steps);
    return {
      title: trace.title || "Follow the execution step by step",
      lines: steps.length
        ? steps.map((step, index) => ({
            line: Number.isInteger(step.line) ? step.line + 1 : index + 1,
            code: trace.code[Number.isInteger(step.line) ? step.line : index] || "",
            explanation: step.explain || step.explanation || step.detail || step.state || ""
          }))
        : trace.code.map((code, index) => ({
            line: index + 1,
            code,
            explanation: ""
          }))
    };
  }

  return null;
}

function renderTrace(trace) {
  const normalized = normalizeTrace(trace);
  if (!normalized || !normalized.lines.length) return "";

  return `
    <section class="lesson-section trace-section">
      <p class="section-label">PROGRAM / SYSTEM TRACING</p>
      <h2>${esc(normalized.title)}</h2>

      <div class="premium-trace">
        <div class="trace-left">
          <div class="trace-code" id="traceCode">
            ${normalized.lines.map((line, index) => `
              <div data-trace-line="${index}">
                <span class="trace-line-number">${String(line.line).padStart(2, "0")}</span>
                <code>${esc(line.code)}</code>
              </div>
            `).join("")}
          </div>

          <div class="trace-controls">
            <button type="button" id="traceReset">Reset</button>
            <button type="button" id="traceNext" class="primary">Next step</button>
            <button type="button" id="traceAuto">Auto Run</button>
          </div>
        </div>

        <aside class="trace-state">
          <span class="trace-state-label">CURRENT STEP</span>
          <strong id="traceState">Ready</strong>
          <p id="traceExplain">Press Next step to begin.</p>
        </aside>
      </div>
    </section>
  `;
}

function renderRevision(items) {
  const values = arr(items);
  if (!values.length) return "";

  return `
    <section class="lesson-section revision-section">
      <p class="section-label">QUICK REVISION</p>
      <h2>Remember these essential ideas</h2>
      <div class="revision-grid">
        ${values.map((item, index) => {
          if (Array.isArray(item)) {
            return `
              <article>
                <div class="revision-number">${String(index + 1).padStart(2, "0")}</div>
                <div>
                  <strong>${rich(item[0])}</strong>
                  <p>${rich(item[1])}</p>
                </div>
              </article>
            `;
          }
          return `
            <article>
              <div class="revision-number">${String(index + 1).padStart(2, "0")}</div>
              <p>${rich(item)}</p>
            </article>
          `;
        }).join("")}
      </div>
    </section>
  `;
}

function renderInterview(items) {
  const values = arr(items);
  if (!values.length) return "";

  return `
    <section class="lesson-section interview-section">
      <p class="section-label">PLACEMENT & INTERVIEW</p>
      <h2>Explain the concept, don't just memorize it</h2>
      <div class="interview-list">
        ${values.map((item, index) => {
          const question = item.question || item.q || "";
          const answer = item.answer || item.a || "";
          return `
            <details class="interview-item">
              <summary>
                <span class="interview-number">${String(index + 1).padStart(2, "0")}</span>
                <span>${esc(question)}</span>
                <span class="interview-chevron">+</span>
              </summary>
              <div class="interview-answer">${rich(answer)}</div>
            </details>
          `;
        }).join("")}
      </div>
    </section>
  `;
}

function renderPractice(items) {
  const values = arr(items);
  if (!values.length) return "";

  return `
    <section class="lesson-section practice-section">
      <p class="section-label">PRACTICE ARENA</p>
      <h2>Now apply what you learned</h2>
      <p class="section-description">
        Try these problems without immediately looking at the solution.
        The goal is to build understanding, not just finish questions.
      </p>

      <div class="practice-grid">
        ${values.map((item, index) => `
          <article class="practice-card">
            <div class="practice-top">
              <span>CHALLENGE ${String(index + 1).padStart(2, "0")}</span>
              ${item.difficulty ? `<b>${esc(item.difficulty)}</b>` : ""}
            </div>
            <h3>${esc(item.title || "Practice Challenge")}</h3>
            <p>${rich(item.task || item.prompt || "")}</p>
            ${arr(item.hints).length ? `
              <details class="hint-box">
                <summary>Need a hint?</summary>
                <ul>${item.hints.map(h => `<li>${rich(h)}</li>`).join("")}</ul>
              </details>
            ` : ""}
          </article>
        `).join("")}
      </div>
    </section>
  `;
}

function renderQuiz(items) {
  const values = arr(items);
  if (!values.length) return "";

  return `
    <section class="lesson-section quiz-section">
      <p class="section-label">KNOWLEDGE CHECK</p>
      <h2>Test your understanding</h2>
      <div class="quiz">
        ${values.map((question, index) => `
          <article class="quiz-question" data-question="${index}">
            <div class="quiz-question-number">QUESTION ${String(index + 1).padStart(2, "0")}</div>
            <h3>${esc(question.question || question.q || "")}</h3>
            <div class="quiz-options">
              ${arr(question.options).map((option, optionIndex) => `
                <button type="button" data-option="${optionIndex}">
                  <span>${String.fromCharCode(65 + optionIndex)}</span>
                  ${esc(option)}
                </button>
              `).join("")}
            </div>
            <div class="quiz-result" hidden></div>
          </article>
        `).join("")}
      </div>
    </section>
  `;
}

function renderGlossary(items) {
  const values = arr(items);
  if (!values.length) return "";

  return `
    <section class="lesson-section glossary-section">
      <p class="section-label">GLOSSARY</p>
      <h2>Important terms from this level</h2>
      <div class="glossary-grid">
        ${values.map(item => `
          <article class="glossary-card">
            <h3>${esc(item.term || "")}</h3>
            <p>${rich(item.definition || "")}</p>
          </article>
        `).join("")}
      </div>
    </section>
  `;
}

function renderCompletion(data) {
  if (!data) return "";

  return `
    <section class="lesson-section completion-section">
      <div class="completion-icon">✓</div>
      <p class="section-label">LEVEL COMPLETE</p>
      <h2>${esc(data.title || `Level ${levelNumber} Complete`)}</h2>
      ${data.message ? `<p class="completion-message">${rich(data.message)}</p>` : ""}
      ${data.challenge ? `
        <div class="completion-challenge">
          <span>FINAL CHALLENGE</span>
          <p>${rich(data.challenge)}</p>
        </div>
      ` : ""}
      <button type="button" class="complete-button" id="completeLevel">
        Mark Level ${levelNumber} complete
      </button>
    </section>
  `;
}

/* ------------------------- data normalization ------------------------- */

function normalizeLesson(data) {
  if (!data) return null;

  return {
    objectives: data.objectives || data.outcomes || [],
    concepts: Array.isArray(data.sections) ? data.sections : (data.concepts || []),
    visualizer: data.visualizer || null,
    trace: data.trace || null,
    flow: data.flow || null,
    flowTitle: data.flowTitle || "Step-by-Step Flow",
    architecture: data.architecture || null,
    revision: data.revision || [],
    interview: data.interview || [],
    practice: data.practice || [],
    quiz: data.quiz || [],
    glossary: data.glossary || [],
    completion: data.completion || (data.takeaway ? {
      title: "Key Takeaway",
      message: data.takeaway
    } : null)
  };
}

/* ------------------------- main render ------------------------- */

function renderLesson() {
  const main = document.getElementById("lessonMain");
  if (!main) return;

  if (!lesson) {
    const level = levels.find(item => Number(item.n) === levelNumber);
    main.innerHTML = `
      <section class="lesson-section">
        <p class="section-label">PLANNED LEVEL</p>
        <h2>${esc(level?.title || `Level ${levelNumber}`)}</h2>
        <p>This level is part of the CodeBhavya Full Stack MERN roadmap and will be released after the required foundation stages are completed.</p>
        <a class="button primary" href="lesson.html?level=1">Open Level 01</a>
      </section>
    `;
    return;
  }

  const data = normalizeLesson(lesson);
  document.title = `Level ${levelNumber}: ${lesson.title || ""} | CodeBhavya`;

  const conceptCount = arr(data.concepts).length;
  const quizCount = arr(data.quiz).length;

  const hero = `
    <section class="lesson-hero premium-hero">
      <div class="hero-level-number">${String(levelNumber).padStart(2, "0")}</div>
      <div class="hero-content">
        <p class="eyebrow">${esc(
          lesson.hero?.badge || lesson.kicker || `LEVEL ${String(levelNumber).padStart(2, "0")}`
        )}</p>
        <h1>${esc(lesson.title || "")}</h1>
        <p class="hero-description">${rich(
          lesson.hero?.description || lesson.subtitle || lesson.summary || ""
        )}</p>
        ${lesson.hero?.note ? `<div class="hero-note">! ${rich(lesson.hero.note)}</div>` : ""}
        <div class="lesson-meta">
          ${(lesson.estimatedTime || lesson.duration) ? `<span>TIME · ${esc(lesson.estimatedTime || lesson.duration)}</span>` : ""}
          ${lesson.difficulty ? `<span>LEVEL · ${esc(lesson.difficulty)}</span>` : ""}
          <span>${conceptCount} CONCEPTS</span>
          <span>${quizCount} CHECKS</span>
        </div>
      </div>
    </section>
  `;

  const concepts = arr(data.concepts).map(renderConcept).join("");

  const lessonFlow = data.flow ? `
    <section class="lesson-section flow-section">
      <p class="section-label">SYSTEM / LEARNING FLOW</p>
      ${renderFlow(data.flow, data.flowTitle)}
    </section>
  ` : "";

  const architecture = data.architecture ? `
    <section class="lesson-section architecture-section">
      <p class="section-label">ARCHITECTURE</p>
      <h2>See how the pieces connect</h2>
      ${renderArchitecture(data.architecture)}
    </section>
  ` : "";

  const previous = levelNumber > 1
    ? `<a href="lesson.html?level=${levelNumber - 1}">← Previous level</a>`
    : `<span></span>`;

  const nextAvailable = levelNumber < 30 &&
    levels.some(item => Number(item.n) === levelNumber + 1 && item.available !== false);

  const next = nextAvailable
    ? `<a href="lesson.html?level=${levelNumber + 1}">Next level →</a>`
    : `<a href="index.html#roadmap">Return to roadmap →</a>`;

  main.innerHTML = `
    ${hero}
    ${renderObjectives(data.objectives)}
    ${concepts}
    ${data.visualizer ? renderVisualizer(data.visualizer) : ""}
    ${data.trace ? renderTrace(data.trace) : ""}
    ${lessonFlow}
    ${architecture}
    ${renderRevision(data.revision)}
    ${renderInterview(data.interview)}
    ${renderPractice(data.practice)}
    ${renderQuiz(data.quiz)}
    ${renderGlossary(data.glossary)}
    ${renderCompletion(data.completion)}
    <nav class="lesson-nav">${previous}${next}</nav>
  `;

  resetVisualizer();
  resetTrace();
  updateCompletionButton();
}

/* ------------------------- visualizer ------------------------- */

function drawVisualizer() {
  const steps = arr(lesson?.visualizer?.steps);
  const next = document.getElementById("visualNext");
  const auto = document.getElementById("visualAuto");
  const state = document.getElementById("visualState");
  const explain = document.getElementById("visualExplain");

  if (!steps.length) return;

  document.querySelectorAll("[data-visual-step]").forEach(el => {
    el.classList.remove("active", "completed");
  });

  if (visualIndex >= steps.length) {
    document.querySelectorAll("[data-visual-step]").forEach(el => el.classList.add("completed"));
    if (state) state.textContent = "Visualizer complete";
    if (explain) explain.textContent = "Reset to follow the process again.";
    if (next) next.disabled = true;
    if (auto) auto.disabled = true;
    clearInterval(visualTimer);
    return;
  }

  const current = steps[visualIndex];
  const element = document.querySelector(`[data-visual-step="${visualIndex}"]`);

  if (element) {
    element.classList.add("active");
    element.scrollIntoView({behavior:"smooth", block:"nearest"});
  }

  if (state) state.textContent = current.title || `Step ${visualIndex + 1}`;
  if (explain) explain.textContent = current.detail || current.operation || "";
  visualIndex++;
}

function resetVisualizer() {
  clearInterval(visualTimer);
  visualIndex = 0;
  document.querySelectorAll("[data-visual-step]").forEach(el => el.classList.remove("active","completed"));

  const state = document.getElementById("visualState");
  const explain = document.getElementById("visualExplain");
  const next = document.getElementById("visualNext");
  const auto = document.getElementById("visualAuto");

  if (state) state.textContent = "Ready";
  if (explain) explain.textContent = "Press Next step to begin.";
  if (next) next.disabled = false;
  if (auto) auto.disabled = false;
}

function initVisualizer() {
  const next = document.getElementById("visualNext");
  const reset = document.getElementById("visualReset");
  const auto = document.getElementById("visualAuto");
  if (!next) return;

  next.onclick = drawVisualizer;
  if (reset) reset.onclick = resetVisualizer;
  if (auto) {
    auto.onclick = () => {
      clearInterval(visualTimer);
      visualTimer = setInterval(() => {
        drawVisualizer();
        if (visualIndex >= arr(lesson?.visualizer?.steps).length) clearInterval(visualTimer);
      }, 900);
    };
  }
}

/* ------------------------- trace ------------------------- */

function getTraceLines() {
  return normalizeTrace(lesson?.trace)?.lines || [];
}

function drawTrace() {
  const lines = getTraceLines();
  const next = document.getElementById("traceNext");
  const auto = document.getElementById("traceAuto");
  const state = document.getElementById("traceState");
  const explain = document.getElementById("traceExplain");

  document.querySelectorAll("[data-trace-line]").forEach(el => el.classList.remove("active","completed"));

  if (!lines.length || traceIndex >= lines.length) {
    document.querySelectorAll("[data-trace-line]").forEach(el => el.classList.add("completed"));
    if (state) state.textContent = "Trace complete";
    if (explain) explain.textContent = "Reset to follow the execution again.";
    if (next) next.disabled = true;
    if (auto) auto.disabled = true;
    clearInterval(traceTimer);
    return;
  }

  const step = lines[traceIndex];
  const lineIndex = Math.max(0, Math.min(lines.length - 1, Number(step.line) - 1));
  const current = document.querySelector(`[data-trace-line="${lineIndex}"]`);

  if (current) {
    current.classList.add("active");
    current.scrollIntoView({behavior:"smooth", block:"center"});
  }

  if (state) state.textContent = `Step ${traceIndex + 1}`;
  if (explain) explain.textContent = step.explanation || "";
  traceIndex++;
}

function resetTrace() {
  clearInterval(traceTimer);
  traceIndex = 0;
  document.querySelectorAll("[data-trace-line]").forEach(el => el.classList.remove("active","completed"));

  const state = document.getElementById("traceState");
  const explain = document.getElementById("traceExplain");
  const next = document.getElementById("traceNext");
  const auto = document.getElementById("traceAuto");

  if (state) state.textContent = "Ready";
  if (explain) explain.textContent = "Press Next step to begin.";
  if (next) next.disabled = false;
  if (auto) auto.disabled = false;
}

function initTrace() {
  const next = document.getElementById("traceNext");
  const reset = document.getElementById("traceReset");
  const auto = document.getElementById("traceAuto");
  if (!next) return;

  next.onclick = drawTrace;
  if (reset) reset.onclick = resetTrace;
  if (auto) {
    auto.onclick = () => {
      clearInterval(traceTimer);
      traceTimer = setInterval(() => {
        drawTrace();
        if (traceIndex >= getTraceLines().length) clearInterval(traceTimer);
      }, 900);
    };
  }
}

/* ------------------------- interactions ------------------------- */

async function copyCode(code) {
  try {
    await navigator.clipboard.writeText(code);
    showToast("Code copied successfully");
  } catch {
    showToast("Copy failed — select the code manually");
  }
}

function showToast(message) {
  const toast = document.getElementById("toast");
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 1500);
}

function handleQuiz(button) {
  const question = button.closest(".quiz-question");
  if (!question) return;

  const index = Number(question.dataset.question);
  const selected = Number(button.dataset.option);
  const current = arr(lesson?.quiz)[index];
  if (!current) return;

  const correct = Number(current.answer);

  question.querySelectorAll("[data-option]").forEach(option => {
    option.disabled = true;
    const n = Number(option.dataset.option);
    if (n === correct) option.classList.add("correct");
    if (n === selected && n !== correct) option.classList.add("wrong");
  });

  const result = question.querySelector(".quiz-result");
  if (!result) return;

  result.hidden = false;
  result.innerHTML = selected === correct
    ? `<strong>✓ Correct!</strong> ${rich(current.explanation || "Good work.")}`
    : `<strong>✗ Not quite.</strong> ${rich(current.explanation || "Review the concept and try again.")}`;
  result.classList.toggle("success", selected === correct);
  result.classList.toggle("failure", selected !== correct);
}

function updateCompletionButton() {
  const button = document.getElementById("completeLevel");
  if (!button) return;

  const completed = getProgress().includes(levelNumber);
  button.textContent = completed
    ? `✓ Level ${levelNumber} completed`
    : `Mark Level ${levelNumber} complete`;
  button.classList.toggle("completed", completed);
}

function toggleCompletion() {
  let progress = getProgress();

  if (progress.includes(levelNumber)) {
    progress = progress.filter(value => value !== levelNumber);
    showToast("Completion removed");
  } else {
    progress = [...progress, levelNumber];
    showToast("Level completed 🎉");
  }

  setProgress(progress);
  updateCompletionButton();
}

/* ------------------------- page shell ------------------------- */

function openSidebar() {
  const sidebar = document.getElementById("sidebar");
  const shade = document.getElementById("shade");
  if (!sidebar) return;
  sidebar.classList.add("open");
  if (shade) shade.hidden = false;
}

function closeSidebar() {
  const sidebar = document.getElementById("sidebar");
  const shade = document.getElementById("shade");
  if (!sidebar) return;
  sidebar.classList.remove("open");
  if (shade) shade.hidden = true;
}

function initSidebar() {
  const menu = document.getElementById("lessonMenu");
  const shade = document.getElementById("shade");
  const search = document.getElementById("levelSearch");

  if (menu) {
    menu.addEventListener("click", () => {
      const sidebar = document.getElementById("sidebar");
      sidebar?.classList.contains("open") ? closeSidebar() : openSidebar();
    });
  }

  if (shade) shade.addEventListener("click", closeSidebar);

  if (search) {
    search.addEventListener("input", event => {
      const query = event.target.value.trim().toLowerCase();
      document.querySelectorAll("#levelNav a").forEach(link => {
        link.hidden = !link.textContent.toLowerCase().includes(query);
      });
    });
  }

  document.addEventListener("click", event => {
    if (event.target.closest("#levelNav a") && window.innerWidth <= 900) {
      closeSidebar();
    }
  });
}

function initTopNavigation() {
  const button = document.getElementById("navToggle");
  const nav = document.getElementById("siteNav");
  if (!button || !nav) return;

  button.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    button.setAttribute("aria-expanded", String(open));
  });
}

function initGlobalClicks() {
  document.addEventListener("click", event => {
    const copyButton = event.target.closest("[data-copy]");
    if (copyButton) {
      copyCode(copyButton.dataset.copy);
      return;
    }

    const quizButton = event.target.closest("[data-option]");
    if (quizButton) {
      handleQuiz(quizButton);
      return;
    }

    if (event.target.closest("#completeLevel")) {
      toggleCompletion();
    }
  });
}

function initReadingProgress() {
  const bar = document.getElementById("readingBar");
  if (!bar) return;

  const update = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const value = max > 0 ? (window.scrollY / max) * 100 : 0;
    bar.style.width = `${Math.max(0, Math.min(100, value))}%`;
  };

  window.addEventListener("scroll", update, {passive:true});
  window.addEventListener("resize", update);
  update();
}

function setYear() {
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
}

function initializeLessonPage() {
  renderSidebar();
  renderLesson();
  initVisualizer();
  initTrace();
  initSidebar();
  initTopNavigation();
  initGlobalClicks();
  initReadingProgress();
  setYear();
}

initializeLessonPage();
