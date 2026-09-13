"use strict";

/* =========================================================
   CodeBhavya Full Stack MERN
   Lesson Engine
   Version 2 — Detailed / Beginner First
   ========================================================= */

const STORAGE_KEY = "codebhavya.fullstack.progress.v1";

const levels = window.FULLSTACK_LEVELS || [];
const lessons = window.FULLSTACK_LESSONS || {};

const params = new URLSearchParams(window.location.search);
const levelNumber = Math.max(
  1,
  Math.min(30, Number(params.get("level")) || 1)
);

const lesson = lessons[levelNumber];

let traceIndex = 0;
let traceTimer = null;


/* =========================================================
   BASIC HELPERS
   ========================================================= */

function esc(value) {
  return String(value ?? "").replace(/[&<>"']/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[char]);
}


/*
 * Content files are authored by CodeBhavya.
 * This allows small formatting tags such as <strong>
 * inside lesson points.
 */
function rich(value) {
  return String(value ?? "")
    .replace(/<strong>/gi, "%%STRONG_OPEN%%")
    .replace(/<\/strong>/gi, "%%STRONG_CLOSE%%")
    .replace(/<em>/gi, "%%EM_OPEN%%")
    .replace(/<\/em>/gi, "%%EM_CLOSE%%")
    .replace(/<code>/gi, "%%CODE_OPEN%%")
    .replace(/<\/code>/gi, "%%CODE_CLOSE%%")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/%%STRONG_OPEN%%/g, "<strong>")
    .replace(/%%STRONG_CLOSE%%/g, "</strong>")
    .replace(/%%EM_OPEN%%/g, "<em>")
    .replace(/%%EM_CLOSE%%/g, "</em>")
    .replace(/%%CODE_OPEN%%/g, "<code>")
    .replace(/%%CODE_CLOSE%%/g, "</code>");
}


function getProgress() {
  try {
    const value = JSON.parse(
      localStorage.getItem(STORAGE_KEY) || "[]"
    );

    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}


function setProgress(list) {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(list)
  );
}


/* =========================================================
   SIDEBAR
   ========================================================= */

function renderSidebar() {
  const navElement = document.getElementById("levelNav");

  if (!navElement) return;

  navElement.innerHTML = levels.map(level => {

    const number = Number(level.n);
    const available = level.available !== false;

    return `
      <a
        class="${number === levelNumber ? "active" : ""} ${available ? "" : "locked"}"
        href="${available ? `lesson.html?level=${number}` : "#"}"
        ${available ? "" : 'aria-disabled="true"'}
      >
        <b>${String(number).padStart(2, "0")}</b>
        <span>${esc(level.title || `Level ${number}`)}</span>
        ${available ? "" : "<small>planned</small>"}
      </a>
    `;
  }).join("");
}


/* =========================================================
   CODE BOX
   ========================================================= */

function renderCode(code, label = "WORKED EXAMPLE") {

  if (!code) return "";

  return `
    <div class="code-box premium-code-box">

      <header>
        <span>${esc(label)}</span>

        <button
          type="button"
          data-copy="${esc(code)}"
          aria-label="Copy code"
        >
          Copy
        </button>
      </header>

      <pre><code>${esc(code)}</code></pre>

    </div>
  `;
}


/* =========================================================
   BULLET POINTS
   ========================================================= */

function renderPoints(points) {

  if (!Array.isArray(points) || !points.length) {
    return "";
  }

  return `
    <ul class="content-points">
      ${points.map(point => `
        <li>${rich(point)}</li>
      `).join("")}
    </ul>
  `;
}


/* =========================================================
   KEY IDEA
   ========================================================= */

function renderKeyIdea(text) {

  if (!text) return "";

  return `
    <div class="key-idea">
      <div class="key-idea-icon">💡</div>

      <div>
        <strong>Key Idea</strong>
        <p>${rich(text)}</p>
      </div>
    </div>
  `;
}


/* =========================================================
   WARNING
   ========================================================= */

function renderWarning(text) {

  if (!text) return "";

  return `
    <div class="warning-box">

      <div class="warning-icon">⚠️</div>

      <div>
        <strong>Important</strong>
        <p>${rich(text)}</p>
      </div>

    </div>
  `;
}


/* =========================================================
   COMMON MISTAKE
   ========================================================= */

function renderCommonMistake(text) {

  if (!text) return "";

  return `
    <div class="mistake-box">

      <div class="mistake-icon">❌</div>

      <div>
        <strong>Common Mistake</strong>
        <p>${rich(text)}</p>
      </div>

    </div>
  `;
}


/* =========================================================
   REAL WORLD EXAMPLE
   ========================================================= */

function renderExample(example) {

  if (!example) return "";

  return `
    <div class="real-example">

      <div class="real-example-heading">
        <span>🌍</span>
        <strong>${esc(example.title || "Real-World Example")}</strong>
      </div>

      ${
        example.text
          ? `<p>${rich(example.text)}</p>`
          : ""
      }

      ${
        Array.isArray(example.steps)
          ? `
            <ol class="example-steps">
              ${example.steps.map(step => `
                <li>${rich(step)}</li>
              `).join("")}
            </ol>
          `
          : ""
      }

      ${
        example.code
          ? renderCode(
              example.code,
              "EXAMPLE CODE"
            )
          : ""
      }

      ${
        example.output
          ? `
            <div class="output-box">
              <strong>Expected Result</strong>
              <pre>${esc(example.output)}</pre>
            </div>
          `
          : ""
      }

    </div>
  `;
}


/* =========================================================
   FLOW
   ========================================================= */

function renderFlow(flow, title = "Step-by-Step Flow") {

  if (!Array.isArray(flow) || !flow.length) {
    return "";
  }

  return `
    <div class="learning-flow">

      <h3>${esc(title)}</h3>

      <div class="flow-track">

        ${flow.map((item, index) => {

          const name =
            typeof item === "string"
              ? item
              : item.name || item.title || "";

          const detail =
            typeof item === "string"
              ? ""
              : item.detail || item.description || "";

          return `
            <div class="flow-item">

              <div class="flow-number">
                ${String(index + 1).padStart(2, "0")}
              </div>

              <div class="flow-content">
                <strong>${rich(name)}</strong>

                ${
                  detail
                    ? `<span>${rich(detail)}</span>`
                    : ""
                }
              </div>

            </div>

            ${
              index < flow.length - 1
                ? `<div class="flow-arrow">↓</div>`
                : ""
            }
          `;

        }).join("")}

      </div>

    </div>
  `;
}


/* =========================================================
   COMPARISON TABLE
   ========================================================= */

function renderComparison(data) {

  if (
    !data ||
    !Array.isArray(data.headers) ||
    !Array.isArray(data.rows)
  ) {
    return "";
  }

  return `
    <div class="comparison-table">

      <table>

        <thead>
          <tr>
            ${data.headers.map(header => `
              <th>${rich(header)}</th>
            `).join("")}
          </tr>
        </thead>

        <tbody>
          ${data.rows.map(row => `
            <tr>
              ${row.map(cell => `
                <td>${rich(cell)}</td>
              `).join("")}
            </tr>
          `).join("")}
        </tbody>

      </table>

    </div>
  `;
}


/* =========================================================
   METHODS
   ========================================================= */

function renderMethods(methods) {

  if (!Array.isArray(methods) || !methods.length) {
    return "";
  }

  return `
    <div class="method-grid">

      ${methods.map(method => `
        <article class="method-card">

          <div class="method-name">
            ${esc(method.name)}
          </div>

          <p>
            ${rich(method.purpose)}
          </p>

          ${
            method.example
              ? `
                <code>
                  ${esc(method.example)}
                </code>
              `
              : ""
          }

        </article>
      `).join("")}

    </div>
  `;
}


/* =========================================================
   GROUPS
   ========================================================= */

function renderGroups(groups) {

  if (!Array.isArray(groups) || !groups.length) {
    return "";
  }

  return `
    <div class="status-grid">

      ${groups.map(group => `
        <article class="status-card">

          ${
            group.code
              ? `<div class="status-code">${esc(group.code)}</div>`
              : ""
          }

          <h3>${esc(group.title || "")}</h3>

          ${
            group.description
              ? `<p>${rich(group.description)}</p>`
              : ""
          }

          ${
            Array.isArray(group.examples)
              ? `
                <ul>
                  ${group.examples.map(example => `
                    <li>${rich(example)}</li>
                  `).join("")}
                </ul>
              `
              : ""
          }

        </article>
      `).join("")}

    </div>
  `;
}


/* =========================================================
   URL BREAKDOWN
   ========================================================= */

function renderBreakdown(items) {

  if (!Array.isArray(items) || !items.length) {
    return "";
  }

  return `
    <div class="url-breakdown">

      ${items.map(item => `
        <article>

          <div class="url-part">
            ${esc(item.label)}
          </div>

          <p>
            ${rich(item.description)}
          </p>

        </article>
      `).join("")}

    </div>
  `;
}


/* =========================================================
   ARCHITECTURE
   ========================================================= */

function renderArchitecture(items) {

  if (!Array.isArray(items) || !items.length) {
    return "";
  }

  return `
    <div class="architecture-flow">

      ${items.map((item, index) => `
        <article class="architecture-card">

          <div class="architecture-number">
            ${String(index + 1).padStart(2, "0")}
          </div>

          <h3>${esc(item.title)}</h3>

          ${
            Array.isArray(item.items)
              ? `
                <ul>
                  ${item.items.map(value => `
                    <li>${rich(value)}</li>
                  `).join("")}
                </ul>
              `
              : ""
          }

        </article>
      `).join("")}

    </div>
  `;
}


/* =========================================================
   REQUEST / RESPONSE
   ========================================================= */

function renderMessage(message, type) {

  if (!message) return "";

  return `
    <div class="message-panel ${type || ""}">

      ${
        message.title
          ? `<h3>${esc(message.title)}</h3>`
          : ""
      }

      ${
        message.method
          ? `
            <div class="message-line">
              <span>Method</span>
              <strong>${esc(message.method)}</strong>
            </div>
          `
          : ""
      }

      ${
        message.path
          ? `
            <div class="message-line">
              <span>Path</span>
              <code>${esc(message.path)}</code>
            </div>
          `
          : ""
      }

      ${
        message.status
          ? `
            <div class="message-line">
              <span>Status</span>
              <strong>${esc(message.status)}</strong>
            </div>
          `
          : ""
      }

      ${
        Array.isArray(message.headers)
          ? `
            <div class="message-section">

              <strong>Headers</strong>

              <ul>
                ${message.headers.map(header => `
                  <li>
                    <code>${esc(header)}</code>
                  </li>
                `).join("")}
              </ul>

            </div>
          `
          : ""
      }

      ${
        message.body
          ? `
            <div class="message-section">

              <strong>Body</strong>

              <pre>${
                typeof message.body === "string"
                  ? esc(message.body)
                  : esc(JSON.stringify(message.body, null, 2))
              }</pre>

            </div>
          `
          : ""
      }

      ${
        Array.isArray(message.steps)
          ? `
            <ol class="message-steps">
              ${message.steps.map(step => `
                <li>${rich(step)}</li>
              `).join("")}
            </ol>
          `
          : ""
      }

    </div>
  `;
}


/* =========================================================
   FRONTEND / BACKEND PANELS
   ========================================================= */

function renderRolePanel(title, items, icon) {

  if (!Array.isArray(items) || !items.length) {
    return "";
  }

  return `
    <article class="role-panel">

      <div class="role-heading">
        <span>${icon}</span>
        <h3>${esc(title)}</h3>
      </div>

      <ul>
        ${items.map(item => `
          <li>${rich(item)}</li>
        `).join("")}
      </ul>

    </article>
  `;
}


/* =========================================================
   TRY IT
   ========================================================= */

function renderTryIt(data) {

  if (!data) return "";

  return `
    <div class="try-it-box">

      <div class="try-it-heading">
        <span>🧪</span>
        <strong>${esc(data.title || "Try It Yourself")}</strong>
      </div>

      ${
        Array.isArray(data.steps)
          ? `
            <ol>
              ${data.steps.map(step => `
                <li>${rich(step)}</li>
              `).join("")}
            </ol>
          `
          : ""
      }

    </div>
  `;
}


/* =========================================================
   MISTAKE LIST
   ========================================================= */

function renderMistakes(mistakes) {

  if (!Array.isArray(mistakes) || !mistakes.length) {
    return "";
  }

  return `
    <div class="mistake-list">

      ${mistakes.map((mistake, index) => `
        <article>

          <div class="mistake-index">
            ${String(index + 1).padStart(2, "0")}
          </div>

          <div>

            <div class="wrong-answer">
              <span>❌</span>
              <strong>${rich(mistake.wrong)}</strong>
            </div>

            <div class="correct-answer">
              <span>✅</span>
              <p>${rich(mistake.correct)}</p>
            </div>

          </div>

        </article>
      `).join("")}

    </div>
  `;
}


/* =========================================================
   CONCEPT RENDERER
   ========================================================= */

function renderConcept(concept, index) {

  /*
   * New detailed format.
   * Legacy format is also supported.
   */

  const intro =
    concept.intro ||
    concept.text ||
    "";

  return `
    <section class="lesson-section concept-section">

      <div class="concept-heading">

        <div class="concept-number">
          ${String(concept.number || index + 1).padStart(2, "0")}
        </div>

        <div>
          <p class="section-label">
            CONCEPT ${concept.number || index + 1}
          </p>

          <h2>
            ${esc(concept.title || "Concept")}
          </h2>
        </div>

      </div>

      ${
        intro
          ? `<div class="concept-intro">${rich(intro)}</div>`
          : ""
      }

      ${renderPoints(concept.points)}

      ${renderKeyIdea(concept.keyIdea)}

      ${renderWarning(concept.warning)}

      ${renderCommonMistake(concept.commonMistake)}

      ${renderExample(concept.example)}

      ${
        concept.code
          ? renderCode(
              concept.code,
              concept.label || "WORKED EXAMPLE"
            )
          : ""
      }

      ${
        concept.output
          ? `
            <div class="output-box">

              <strong>Expected Result</strong>

              <pre>${esc(concept.output)}</pre>

            </div>
          `
          : ""
      }

      ${renderComparison(concept.comparison)}

      ${renderMethods(concept.methods)}

      ${renderGroups(concept.groups)}

      ${renderBreakdown(concept.breakdown)}

      ${renderFlow(concept.flow)}

      ${
        concept.request
          ? renderMessage(
              concept.request,
              "request-message"
            )
          : ""
      }

      ${
        concept.response
          ? renderMessage(
              concept.response,
              "response-message"
            )
          : ""
      }

      ${
        concept.frontend || concept.backend
          ? `
            <div class="role-grid">

              ${renderRolePanel(
                "Frontend",
                concept.frontend,
                "🖥️"
              )}

              ${renderRolePanel(
                "Backend",
                concept.backend,
                "⚙️"
              )}

            </div>
          `
          : ""
      }

      ${
        concept.backendExample
          ? renderExample(concept.backendExample)
          : ""
      }

      ${
        concept.architecture
          ? renderArchitecture(concept.architecture)
          : ""
      }

      ${
        concept.tryIt
          ? renderTryIt(concept.tryIt)
          : ""
      }

      ${
        concept.mistakes
          ? renderMistakes(concept.mistakes)
          : ""
      }

    </section>
  `;
}


/* =========================================================
   OBJECTIVES
   ========================================================= */

function renderObjectives(items) {

  if (!Array.isArray(items) || !items.length) {
    return "";
  }

  return `
    <section class="lesson-section objectives-section">

      <p class="section-label">
        LEARNING OBJECTIVES
      </p>

      <h2>
        What you will learn
      </h2>

      <div class="objective-card-grid">

        ${items.map((item, index) => `
          <article class="objective-card">

            <div class="objective-number">
              ${String(index + 1).padStart(2, "0")}
            </div>

            <p>${rich(item)}</p>

          </article>
        `).join("")}

      </div>

    </section>
  `;
}


/* =========================================================
   VISUALIZER
   ========================================================= */

function renderVisualizer(data) {

  if (
    !data ||
    !Array.isArray(data.steps) ||
    !data.steps.length
  ) {
    return "";
  }

  return `
    <section class="lesson-section visualizer-section">

      <p class="section-label">
        PREMIUM VISUALIZER
      </p>

      <h2>
        ${esc(data.title || "Interactive Visualizer")}
      </h2>

      ${
        data.description
          ? `<p class="section-description">${rich(data.description)}</p>`
          : ""
      }

      <div class="visualizer-premium">

        <div class="visualizer-steps">

          ${data.steps.map((step, index) => `
            <article
              class="visualizer-step"
              data-visual-step="${index}"
            >

              <div class="visual-step-number">
                ${String(index + 1).padStart(2, "0")}
              </div>

              <div class="visual-step-content">

                <h3>${esc(step.title || "")}</h3>

                ${
                  step.operation
                    ? `
                      <div class="visual-operation">
                        ${rich(step.operation)}
                      </div>
                    `
                    : ""
                }

                ${
                  step.detail
                    ? `<p>${rich(step.detail)}</p>`
                    : ""
                }

              </div>

            </article>
          `).join("")}

        </div>

        <div class="visualizer-controls">

          <button
            type="button"
            id="visualReset"
          >
            Reset
          </button>

          <button
            type="button"
            id="visualNext"
            class="primary"
          >
            Next step
          </button>

          <button
            type="button"
            id="visualAuto"
          >
            Auto Run
          </button>

        </div>

        <div class="visualizer-state">

          <strong id="visualState">
            Ready
          </strong>

          <p id="visualExplain">
            Press Next step to begin.
          </p>

        </div>

      </div>

    </section>
  `;
}


/* =========================================================
   TRACE
   ========================================================= */

function renderTrace(trace) {

  if (
    !trace ||
    !Array.isArray(trace.lines) ||
    !trace.lines.length
  ) {
    return "";
  }

  return `
    <section class="lesson-section trace-section">

      <p class="section-label">
        PROGRAM TRACING
      </p>

      <h2>
        ${esc(trace.title || "Follow the execution step by step")}
      </h2>

      <div class="trace premium-trace">

        <div class="trace-left">

          <div
            class="trace-code"
            id="traceCode"
          >
            ${trace.lines.map((line, index) => `
              <div
                data-trace-line="${index}"
              >
                <span class="trace-line-number">
                  ${String(line.line || index + 1).padStart(2, "0")}
                </span>

                <code>${esc(line.code || "")}</code>
              </div>
            `).join("")}
          </div>

          <div class="trace-controls">

            <button
              type="button"
              id="traceReset"
            >
              Reset
            </button>

            <button
              type="button"
              id="traceNext"
              class="primary"
            >
              Next step
            </button>

            <button
              type="button"
              id="traceAuto"
            >
              Auto Run
            </button>

          </div>

        </div>

        <div class="trace-state">

          <span class="trace-state-label">
            CURRENT STEP
          </span>

          <strong id="traceState">
            Ready
          </strong>

          <p id="traceExplain">
            Press Next step to begin.
          </p>

        </div>

      </div>

    </section>
  `;
}


/* =========================================================
   REVISION
   ========================================================= */

function renderRevision(items) {

  if (!Array.isArray(items) || !items.length) {
    return "";
  }

  return `
    <section class="lesson-section revision-section">

      <p class="section-label">
        QUICK REVISION
      </p>

      <h2>
        Remember these essential ideas
      </h2>

      <div class="revision-grid">

        ${items.map((item, index) => {

          /*
           * Supports both:
           * ["Term", "Explanation"]
           * and plain strings.
           */

          if (Array.isArray(item)) {
            return `
              <article>

                <div class="revision-number">
                  ${String(index + 1).padStart(2, "0")}
                </div>

                <div>
                  <strong>${rich(item[0])}</strong>
                  <p>${rich(item[1])}</p>
                </div>

              </article>
            `;
          }

          return `
            <article>

              <div class="revision-number">
                ${String(index + 1).padStart(2, "0")}
              </div>

              <p>${rich(item)}</p>

            </article>
          `;

        }).join("")}

      </div>

    </section>
  `;
}


/* =========================================================
   INTERVIEW
   ========================================================= */

function renderInterview(items) {

  if (!Array.isArray(items) || !items.length) {
    return "";
  }

  return `
    <section class="lesson-section interview-section">

      <p class="section-label">
        PLACEMENT & INTERVIEW
      </p>

      <h2>
        Explain the concept, don't just memorize it
      </h2>

      <div class="interview-list">

        ${items.map((item, index) => {

          const question =
            item.question ||
            item.q ||
            "";

          const answer =
            item.answer ||
            item.a ||
            "";

          return `
            <details class="interview-item">

              <summary>

                <span class="interview-number">
                  ${String(index + 1).padStart(2, "0")}
                </span>

                <span>
                  ${esc(question)}
                </span>

              </summary>

              <div class="interview-answer">
                ${rich(answer)}
              </div>

            </details>
          `;

        }).join("")}

      </div>

    </section>
  `;
}


/* =========================================================
   PRACTICE
   ========================================================= */

function renderPractice(items) {

  if (!Array.isArray(items) || !items.length) {
    return "";
  }

  return `
    <section class="lesson-section practice-section">

      <p class="section-label">
        PRACTICE ARENA
      </p>

      <h2>
        Now apply what you learned
      </h2>

      <p class="section-description">
        Try these problems without immediately looking at the solution.
        The goal is to build understanding, not just finish questions.
      </p>

      <div class="practice-grid">

        ${items.map((item, index) => {

          const prompt =
            item.task ||
            item.prompt ||
            "";

          return `
            <article class="practice-card">

              <div class="practice-top">

                <span>
                  CHALLENGE ${String(index + 1).padStart(2, "0")}
                </span>

                ${
                  item.difficulty
                    ? `<b>${esc(item.difficulty)}</b>`
                    : ""
                }

              </div>

              <h3>
                ${esc(item.title || "Practice Challenge")}
              </h3>

              <p>
                ${rich(prompt)}
              </p>

              ${
                Array.isArray(item.hints)
                  ? `
                    <details class="hint-box">

                      <summary>
                        Need a hint?
                      </summary>

                      <ul>
                        ${item.hints.map(hint => `
                          <li>${rich(hint)}</li>
                        `).join("")}
                      </ul>

                    </details>
                  `
                  : ""
              }

            </article>
          `;

        }).join("")}

      </div>

    </section>
  `;
}


/* =========================================================
   QUIZ
   ========================================================= */

function renderQuiz(items) {

  if (!Array.isArray(items) || !items.length) {
    return "";
  }

  return `
    <section class="lesson-section quiz-section">

      <p class="section-label">
        KNOWLEDGE CHECK
      </p>

      <h2>
        Test your understanding
      </h2>

      <div class="quiz">

        ${items.map((question, index) => {

          const text =
            question.question ||
            question.q ||
            "";

          const answer =
            Number.isInteger(question.answer)
              ? question.answer
              : 0;

          return `
            <article
              class="quiz-question"
              data-question="${index}"
              data-answer="${answer}"
            >

              <div class="quiz-question-number">
                QUESTION ${String(index + 1).padStart(2, "0")}
              </div>

              <h3>
                ${esc(text)}
              </h3>

              <div class="quiz-options">

                ${
                  Array.isArray(question.options)
                    ? question.options.map((option, optionIndex) => `
                        <button
                          type="button"
                          data-option="${optionIndex}"
                        >
                          <span>
                            ${String.fromCharCode(65 + optionIndex)}
                          </span>

                          ${esc(option)}
                        </button>
                      `).join("")
                    : ""
                }

              </div>

              <div
                class="quiz-result"
                hidden
              ></div>

            </article>
          `;

        }).join("")}

      </div>

    </section>
  `;
}


/* =========================================================
   GLOSSARY
   ========================================================= */

function renderGlossary(items) {

  if (!Array.isArray(items) || !items.length) {
    return "";
  }

  return `
    <section class="lesson-section glossary-section">

      <p class="section-label">
        GLOSSARY
      </p>

      <h2>
        Important terms from this level
      </h2>

      <div class="glossary-grid">

        ${items.map(item => `
          <article class="glossary-card">

            <h3>
              ${esc(item.term)}
            </h3>

            <p>
              ${rich(item.definition)}
            </p>

          </article>
        `).join("")}

      </div>

    </section>
  `;
}


/* =========================================================
   COMPLETION
   ========================================================= */

function renderCompletion(data) {

  if (!data) return "";

  return `
    <section class="lesson-section completion-section">

      <div class="completion-icon">
        ✓
      </div>

      <p class="section-label">
        LEVEL COMPLETE
      </p>

      <h2>
        ${esc(data.title || `Level ${levelNumber} Complete`)}
      </h2>

      ${
        data.message
          ? `<p class="completion-message">${rich(data.message)}</p>`
          : ""
      }

      ${
        data.challenge
          ? `
            <div class="completion-challenge">

              <strong>Final Challenge</strong>

              <p>
                ${rich(data.challenge)}
              </p>

            </div>
          `
          : ""
      }

      <button
        type="button"
        class="complete-button"
        id="completeLevel"
      >
        Mark Level ${levelNumber} complete
      </button>

    </section>
  `;
}


/* =========================================================
   LEGACY LESSON SUPPORT
   ========================================================= */

function getLegacyLessonData(data) {

  if (!data) return null;

  /*
   * Old lessons used:
   * kicker
   * summary
   * duration
   * outcomes
   * concepts
   * flowTitle
   * flow
   * trace
   * revision
   * interview
   * practice
   * quiz
   * takeaway
   */

  return {
    objectives:
      data.objectives ||
      data.outcomes ||
      [],

    concepts:
      data.concepts ||
      [],

    visualizer:
      data.visualizer ||
      null,

    trace:
      data.trace ||
      null,

    revision:
      data.revision ||
      [],

    interview:
      data.interview ||
      [],

    practice:
      data.practice ||
      [],

    quiz:
      data.quiz ||
      [],

    glossary:
      data.glossary ||
      [],

    completion:
      data.completion ||
      (
        data.takeaway
          ? {
              title: "Key Takeaway",
              message: data.takeaway
            }
          : null
      )
  };
}


/* =========================================================
   MAIN RENDER
   ========================================================= */

function renderLesson() {

  const main = document.getElementById("lessonMain");

  if (!main) return;

  if (!lesson) {

    const currentLevel =
      levels.find(
        item => Number(item.n) === levelNumber
      );

    main.innerHTML = `
      <section class="lesson-section">

        <p class="section-label">
          PLANNED LEVEL
        </p>

        <h2>
          ${esc(
            currentLevel?.title ||
            `Level ${levelNumber}`
          )}
        </h2>

        <p>
          This level is part of the complete CodeBhavya
          Full Stack MERN roadmap and will be released
          after the required foundation stages are completed.
        </p>

        <a
          class="button primary"
          href="lesson.html?level=1"
        >
          Open Level 01
        </a>

      </section>
    `;

    return;
  }


  const data = getLegacyLessonData(lesson);

  const conceptCount =
    Array.isArray(data.concepts)
      ? data.concepts.length
      : 0;

  const quizCount =
    Array.isArray(data.quiz)
      ? data.quiz.length
      : 0;


  document.title =
    `Level ${levelNumber}: ${
      lesson.title || ""
    } | CodeBhavya`;


  /* =======================================================
     HERO
     ======================================================= */

  const hero = `
    <section class="lesson-hero premium-hero">

      <div class="hero-level-number">
        ${String(levelNumber).padStart(2, "0")}
      </div>

      <div class="hero-content">

        <p class="eyebrow">

          ${
            esc(
              lesson.hero?.badge ||
              lesson.kicker ||
              `LEVEL ${String(levelNumber).padStart(2, "0")}`
            )
          }

        </p>

        <h1>
          ${esc(lesson.title || "")}
        </h1>

        <p class="hero-description">

          ${
            rich(
              lesson.hero?.description ||
              lesson.subtitle ||
              lesson.summary ||
              ""
            )
          }

        </p>

        ${
          lesson.hero?.note
            ? `
              <div class="hero-note">
                💡 ${rich(lesson.hero.note)}
              </div>
            `
            : ""
        }

        <div class="lesson-meta">

          ${
            lesson.estimatedTime ||
            lesson.duration
              ? `
                <span>
                  ⏱️ ${
                    esc(
                      lesson.estimatedTime ||
                      lesson.duration
                    )
                  }
                </span>
              `
              : ""
          }

          ${
            lesson.difficulty
              ? `
                <span>
                  📈 ${esc(lesson.difficulty)}
                </span>
              `
              : ""
          }

          <span>
            📚 ${conceptCount} concepts
          </span>

          <span>
            ❓ ${quizCount} knowledge checks
          </span>

        </div>

      </div>

    </section>
  `;


  /* =======================================================
     OBJECTIVES
     ======================================================= */

  const objectives =
    renderObjectives(data.objectives);


  /* =======================================================
     CONCEPTS
     ======================================================= */

  const concepts =
    data.concepts
      .map(renderConcept)
      .join("");


  /* =======================================================
     VISUALIZER
     ======================================================= */

  const visualizer =
    renderVisualizer(data.visualizer);


  /* =======================================================
     TRACE
     ======================================================= */

  const trace =
    renderTrace(data.trace);


  /* =======================================================
     REVISION
     ======================================================= */

  const revision =
    renderRevision(data.revision);


  /* =======================================================
     INTERVIEW
     ======================================================= */

  const interview =
    renderInterview(data.interview);


  /* =======================================================
     PRACTICE
     ======================================================= */

  const practice =
    renderPractice(data.practice);


  /* =======================================================
     QUIZ
     ======================================================= */

  const quiz =
    renderQuiz(data.quiz);


  /* =======================================================
     GLOSSARY
     ======================================================= */

  const glossary =
    renderGlossary(data.glossary);


  /* =======================================================
     COMPLETION
     ======================================================= */

  const completion =
    renderCompletion(data.completion);


  /* =======================================================
     NAVIGATION
     ======================================================= */

  const previousLevel =
    levelNumber > 1
      ? `
        <a
          href="lesson.html?level=${levelNumber - 1}"
        >
          ← Previous level
        </a>
      `
      : `<span></span>`;


  const nextAvailable =
    levelNumber < 30 &&
    levels.some(
      item =>
        Number(item.n) === levelNumber + 1 &&
        item.available !== false
    );


  const nextLevel =
    nextAvailable
      ? `
        <a
          href="lesson.html?level=${levelNumber + 1}"
        >
          Next level →
        </a>
      `
      : `
        <a href="index.html#roadmap">
          Return to roadmap →
        </a>
      `;


  main.innerHTML = `
    ${hero}

    ${objectives}

    ${concepts}

    ${visualizer}

    ${trace}

    ${revision}

    ${interview}

    ${practice}

    ${quiz}

    ${glossary}

    ${completion}

    <nav class="lesson-nav">
      ${previousLevel}
      ${nextLevel}
    </nav>
  `;


  initVisualizer();
  initTrace();
  updateCompletionButton();
}


/* =========================================================
   VISUALIZER LOGIC
   ========================================================= */

let visualIndex = 0;
let visualTimer = null;


function drawVisualizer() {

  const steps =
    lesson?.visualizer?.steps || [];

  const state =
    document.getElementById("visualState");

  const explain =
    document.getElementById("visualExplain");

  const next =
    document.getElementById("visualNext");

  const auto =
    document.getElementById("visualAuto");

  if (!steps.length) return;


  document
    .querySelectorAll("[data-visual-step]")
    .forEach(element => {
      element.classList.remove("active");
      element.classList.remove("completed");
    });


  if (visualIndex >= steps.length) {

    document
      .querySelectorAll("[data-visual-step]")
      .forEach(element => {
        element.classList.add("completed");
      });

    if (state) {
      state.textContent = "Visualizer complete";
    }

    if (explain) {
      explain.textContent =
        "You reached the end. Press Reset to follow the process again.";
    }

    if (next) {
      next.disabled = true;
    }

    if (auto) {
      auto.disabled = true;
    }

    clearInterval(visualTimer);

    return;
  }


  const current =
    steps[visualIndex];

  const element =
    document.querySelector(
      `[data-visual-step="${visualIndex}"]`
    );


  if (element) {

    element.classList.add("active");

    element.scrollIntoView({
      behavior: "smooth",
      block: "nearest"
    });

  }


  if (state) {
    state.textContent =
      current.title || `Step ${visualIndex + 1}`;
  }


  if (explain) {
    explain.textContent =
      current.detail ||
      current.operation ||
      "";
  }


  visualIndex++;
}


function resetVisualizer() {

  clearInterval(visualTimer);

  visualIndex = 0;

  document
    .querySelectorAll("[data-visual-step]")
    .forEach(element => {
      element.classList.remove("active");
      element.classList.remove("completed");
    });

  const state =
    document.getElementById("visualState");

  const explain =
    document.getElementById("visualExplain");

  const next =
    document.getElementById("visualNext");

  const auto =
    document.getElementById("visualAuto");

  if (state) {
    state.textContent = "Ready";
  }

  if (explain) {
    explain.textContent =
      "Press Next step to begin.";
  }

  if (next) {
    next.disabled = false;
  }

  if (auto) {
    auto.disabled = false;
  }
}


function initVisualizer() {

  const next =
    document.getElementById("visualNext");

  const reset =
    document.getElementById("visualReset");

  const auto =
    document.getElementById("visualAuto");

  if (!next) return;

  next.onclick = drawVisualizer;

  reset.onclick =
    resetVisualizer;

  auto.onclick = () => {

    clearInterval(visualTimer);

    visualTimer =
      setInterval(() => {

        drawVisualizer();

        if (
          visualIndex >=
          (lesson?.visualizer?.steps?.length || 0)
        ) {
          clearInterval(visualTimer);
        }

      }, 1000);

  };
}


/* =========================================================
   PROGRAM TRACE
   ========================================================= */

function drawTrace() {

  const lines =
    lesson?.trace?.lines || [];

  const next =
    document.getElementById("traceNext");

  const auto =
    document.getElementById("traceAuto");

  const state =
    document.getElementById("traceState");

  const explain =
    document.getElementById("traceExplain");


  document
    .querySelectorAll("[data-trace-line]")
    .forEach(line => {
      line.classList.remove("active");
      line.classList.remove("completed");
    });


  if (
    !lines.length ||
    traceIndex >= lines.length
  ) {

    document
      .querySelectorAll("[data-trace-line]")
      .forEach(line => {
        line.classList.add("completed");
      });

    if (state) {
      state.textContent = "Trace complete";
    }

    if (explain) {
      explain.textContent =
        "Reset to follow the execution again.";
    }

    if (next) {
      next.disabled = true;
    }

    if (auto) {
      auto.disabled = true;
    }

    clearInterval(traceTimer);

    return;
  }


  const step =
    lines[traceIndex];


  /*
   * New trace format:
   *
   * line
   * code
   * explanation
   *
   * Old trace format:
   *
   * code[]
   * steps[]
   *
   * The new renderer primarily uses the new format.
   */


  let lineIndex =
    Number.isInteger(step.line)
      ? step.line - 1
      : traceIndex;


  if (lineIndex < 0) {
    lineIndex = 0;
  }


  const currentLine =
    document.querySelector(
      `[data-trace-line="${lineIndex}"]`
    );


  if (currentLine) {

    currentLine.classList.add("active");

    currentLine.scrollIntoView({
      behavior: "smooth",
      block: "center"
    });

  }


  if (state) {
    state.textContent =
      `Step ${traceIndex + 1}`;
  }


  if (explain) {
    explain.textContent =
      step.explanation ||
      step.explain ||
      "";
  }


  traceIndex++;
}


function resetTrace() {

  clearInterval(traceTimer);

  traceIndex = 0;

  document
    .querySelectorAll("[data-trace-line]")
    .forEach(line => {
      line.classList.remove("active");
      line.classList.remove("completed");
    });

  const state =
    document.getElementById("traceState");

  const explain =
    document.getElementById("traceExplain");

  const next =
    document.getElementById("traceNext");

  const auto =
    document.getElementById("traceAuto");

  if (state) {
    state.textContent = "Ready";
  }

  if (explain) {
    explain.textContent =
      "Press Next step to begin.";
  }

  if (next) {
    next.disabled = false;
  }

  if (auto) {
    auto.disabled = false;
  }
}


function initTrace() {

  const next =
    document.getElementById("traceNext");

  const reset =
    document.getElementById("traceReset");

  const auto =
    document.getElementById("traceAuto");


  if (!next) return;


  next.onclick =
    drawTrace;


  reset.onclick =
    resetTrace;


  auto.onclick = () => {

    clearInterval(traceTimer);

    traceTimer =
      setInterval(() => {

        drawTrace();

        if (
          traceIndex >=
          (lesson?.trace?.lines?.length || 0)
        ) {
          clearInterval(traceTimer);
        }

      }, 900);

  };
}


/* =========================================================
   COPY CODE
   ========================================================= */

async function copyCode(code) {

  try {

    await navigator.clipboard.writeText(code);

    showToast("Code copied successfully");

  } catch {

    showToast(
      "Copy failed — select the code manually"
    );

  }
}


/* =========================================================
   TOAST
   ========================================================= */

function showToast(message) {

  const toast =
    document.getElementById("toast");

  if (!toast) return;

  toast.textContent = message;

  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 1500);
}


/* =========================================================
   QUIZ HANDLER
   ========================================================= */

function handleQuiz(button) {

  const question =
    button.closest(".quiz-question");

  if (!question) return;


  const questionIndex =
    Number(question.dataset.question);

  const selected =
    Number(button.dataset.option);


  const currentQuestion =
    lesson?.quiz?.[questionIndex];

  if (!currentQuestion) return;


  const correct =
    Number(currentQuestion.answer);


  question
    .querySelectorAll("[data-option]")
    .forEach(option => {

      option.disabled = true;

      const optionNumber =
        Number(option.dataset.option);

      if (optionNumber === correct) {
        option.classList.add("correct");
      }

      if (
        optionNumber === selected &&
        selected !== correct
      ) {
        option.classList.add("wrong");
      }

    });


  const result =
    question.querySelector(".quiz-result");


  if (result) {

    result.hidden = false;

    result.classList.toggle(
      "success",
      selected === correct
    );

    result.classList.toggle(
      "failure",
      selected !== correct
    );


    const explanation =
      currentQuestion.explanation ||
      "Review this concept and try again.";


    result.innerHTML =
      selected === correct
        ? `<strong>✓ Correct!</strong> ${rich(explanation)}`
        : `<strong>✗ Not quite.</strong> ${rich(explanation)}`;

  }
}


/* =========================================================
   COMPLETION
   ========================================================= */

function updateCompletionButton() {

  const button =
    document.getElementById("completeLevel");

  if (!button) return;


  const progress =
    getProgress();

  const completed =
    progress.includes(levelNumber);


  button.textContent =
    completed
      ? `✓ Level ${levelNumber} completed`
      : `Mark Level ${levelNumber} complete`;


  button.classList.toggle(
    "completed",
    completed
  );
}


function toggleCompletion() {

  let progress =
    getProgress();


  if (progress.includes(levelNumber)) {

    progress =
      progress.filter(
        value => value !== levelNumber
      );

  } else {

    progress = [
      ...progress,
      levelNumber
    ];

  }


  setProgress(progress);

  updateCompletionButton();

  showToast(
    progress.includes(levelNumber)
      ? "Level completed 🎉"
      : "Completion removed"
  );
}


/* =========================================================
   SIDEBAR
   ========================================================= */

function openSidebar() {

  const sidebar =
    document.getElementById("sidebar");

  const shade =
    document.getElementById("shade");

  if (!sidebar) return;

  sidebar.classList.add("open");

  if (shade) {
    shade.hidden = false;
  }
}


function closeSidebar() {

  const sidebar =
    document.getElementById("sidebar");

  const shade =
    document.getElementById("shade");

  if (!sidebar) return;

  sidebar.classList.remove("open");

  if (shade) {
    shade.hidden = true;
  }
}


function initSidebar() {

  const menu =
    document.getElementById("lessonMenu");

  const shade =
    document.getElementById("shade");

  if (menu) {
    menu.onclick = () => {

      const sidebar =
        document.getElementById("sidebar");

      if (
        sidebar?.classList.contains("open")
      ) {
        closeSidebar();
      } else {
        openSidebar();
      }

    };
  }


  if (shade) {
    shade.onclick =
      closeSidebar;
  }


  const search =
    document.getElementById("levelSearch");


  if (search) {

    search.addEventListener(
      "input",
      event => {

        const query =
          event.target.value
            .trim()
            .toLowerCase();


        document
          .querySelectorAll("#levelNav a")
          .forEach(link => {

            link.hidden =
              !link.textContent
                .toLowerCase()
                .includes(query);

          });

      }
    );

  }

}


/* =========================================================
   TOP NAVIGATION
   ========================================================= */

function initTopNavigation() {

  document.addEventListener(
    "click",
    event => {

      const button =
        event.target.closest(
          "#navToggle"
        );

      if (!button) return;

      const nav =
        document.getElementById("siteNav");

      if (nav) {
        nav.classList.toggle("open");
      }

    }
  );

}


/* =========================================================
   GLOBAL CLICK HANDLER
   ========================================================= */

function initGlobalClicks() {

  document.addEventListener(
    "click",
    event => {

      const copyButton =
        event.target.closest(
          "[data-copy]"
        );

      if (copyButton) {

        copyCode(
          copyButton.dataset.copy
        );

        return;
      }


      const quizButton =
        event.target.closest(
          "[data-option]"
        );

      if (quizButton) {

        handleQuiz(
          quizButton
        );

        return;
      }


      const completeButton =
        event.target.closest(
          "#completeLevel"
        );

      if (completeButton) {

        toggleCompletion();

      }

    }
  );

}


/* =========================================================
   READING PROGRESS
   ========================================================= */

function initReadingProgress() {

  const bar =
    document.getElementById("readingBar");

  if (!bar) return;


  function update() {

    const documentElement =
      document.documentElement;


    const max =
      documentElement.scrollHeight -
      window.innerHeight;


    const percentage =
      max > 0
        ? (window.scrollY / max) * 100
        : 0;


    bar.style.width =
      `${Math.min(100, Math.max(0, percentage))}%`;

  }


  window.addEventListener(
    "scroll",
    update,
    { passive: true }
  );


  window.addEventListener(
    "resize",
    update
  );


  update();

}


/* =========================================================
   CLOSE MOBILE SIDEBAR AFTER LEVEL CLICK
   ========================================================= */

function initSidebarLinks() {

  document.addEventListener(
    "click",
    event => {

      const link =
        event.target.closest(
          "#levelNav a"
        );

      if (!link) return;

      if (
        window.innerWidth <= 900
      ) {
        closeSidebar();
      }

    }
  );

}


/* =========================================================
   YEAR
   ========================================================= */

function setYear() {

  const year =
    document.getElementById("year");

  if (year) {
    year.textContent =
      new Date().getFullYear();
  }

}


/* =========================================================
   INITIALIZE
   ========================================================= */

function initializeLessonPage() {

  renderSidebar();

  renderLesson();

  initSidebar();

  initTopNavigation();

  initGlobalClicks();

  initReadingProgress();

  initSidebarLinks();

  setYear();

}


initializeLessonPage();
