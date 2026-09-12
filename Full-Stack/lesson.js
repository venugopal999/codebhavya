"use strict";

const KEY = "codebhavya.fullstack.progress.v1";

const levels = window.FULLSTACK_LEVELS || [];
const lessons = window.FULLSTACK_LESSONS || {};

const esc = (s) =>
    String(s ?? "").replace(/[&<>"']/g, (c) => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[c]);

const n = Math.max(
    1,
    Math.min(
        30,
        Number(new URLSearchParams(location.search).get("level")) || 1
    )
);

const lesson = lessons[n];

let traceIndex = 0;
let timer = null;


/* =========================================================
   HELPERS
========================================================= */

function getProgress() {
    try {
        return JSON.parse(localStorage.getItem(KEY) || "[]");
    } catch {
        return [];
    }
}

function codeBox(code, label = "Example") {
    return `
        <div class="code-box">
            <header>
                <span>${esc(label)}</span>
                <button data-copy="${esc(code)}">Copy</button>
            </header>

            <pre><code>${esc(code)}</code></pre>
        </div>
    `;
}

function bulletList(items = []) {
    if (!items.length) return "";

    return `
        <ul class="detail-list">
            ${items.map(item => `<li>${esc(item)}</li>`).join("")}
        </ul>
    `;
}

function paragraphList(items = []) {
    if (!items.length) return "";

    return items
        .map(item => `<p>${esc(item)}</p>`)
        .join("");
}

function flowBlock(items = []) {
    if (!items.length) return "";

    return `
        <div class="learning-flow">
            ${items.map((item, i) => `
                <div class="flow-item">
                    <span class="flow-number">${String(i + 1).padStart(2, "0")}</span>
                    <strong>${esc(item)}</strong>
                </div>
            `).join("")}
        </div>
    `;
}

function comparisonBlock(items = []) {
    if (!items.length) return "";

    return `
        <div class="comparison-table">
            ${items.map(item => `
                <div class="comparison-row">
                    <div class="comparison-term">
                        ${esc(item.term)}
                    </div>

                    <div class="comparison-definition">
                        ${esc(item.meaning)}
                    </div>
                </div>
            `).join("")}
        </div>
    `;
}

function methodCards(items = []) {
    if (!items.length) return "";

    return `
        <div class="method-grid">
            ${items.map(item => `
                <article class="method-card">
                    <strong>${esc(item.name)}</strong>
                    <p>${esc(item.meaning)}</p>
                </article>
            `).join("")}
        </div>
    `;
}

function groupCards(items = []) {
    if (!items.length) return "";

    return `
        <div class="status-grid">
            ${items.map(item => `
                <article>
                    <strong>${esc(item.range)}</strong>
                    <span>${esc(item.meaning)}</span>
                </article>
            `).join("")}
        </div>
    `;
}

function urlBreakdown(items = []) {
    if (!items.length) return "";

    return `
        <div class="url-breakdown">
            ${items.map(item => `
                <div>
                    <code>${esc(item.part)}</code>
                    <span>${esc(item.meaning)}</span>
                </div>
            `).join("")}
        </div>
    `;
}

function architecture(items = []) {
    if (!items.length) return "";

    return `
        <div class="architecture-flow">
            ${items.map((item, i) => `
                <div class="architecture-node">
                    <strong>${esc(item)}</strong>
                </div>

                ${i < items.length - 1
                    ? `<span class="architecture-arrow">↓</span>`
                    : ""}
            `).join("")}
        </div>
    `;
}


/* =========================================================
   SIDEBAR
========================================================= */

function nav() {
    const nav = document.getElementById("levelNav");

    if (!nav) return;

    nav.innerHTML = levels.map(level => `
        <a
            class="${level.n === n ? "active" : ""} ${level.available ? "" : "locked"}"
            href="${level.available
                ? `lesson.html?level=${level.n}`
                : "#"}"
        >
            <b>${String(level.n).padStart(2, "0")}</b>
            ${esc(level.title)}
            ${level.available ? "" : " · planned"}
        </a>
    `).join("");
}


/* =========================================================
   LESSON HERO
========================================================= */

function renderHero() {
    return `
        <section class="lesson-hero premium-hero">

            <div class="hero-badge">
                LEVEL ${String(n).padStart(2, "0")}
            </div>

            <p class="eyebrow">
                ${esc(lesson.kicker)}
            </p>

            <h1>${esc(lesson.title)}</h1>

            <p class="hero-description">
                ${esc(lesson.summary)}
            </p>

            <div class="lesson-meta">

                <span>
                    ${esc(lesson.duration)}
                </span>

                <span>
                    ${esc(lesson.difficulty || "Foundation")}
                </span>

                <span>
                    ${lesson.sections
                        ? lesson.sections.length + " learning sections"
                        : (lesson.concepts?.length || 0) + " core concepts"}
                </span>

            </div>

        </section>
    `;
}


/* =========================================================
   LEARNING OUTCOMES
========================================================= */

function renderOutcomes() {
    return `
        <section class="lesson-section outcomes-section">

            <p class="section-label">
                LEARNING OBJECTIVES
            </p>

            <h2>
                What you will understand by the end
            </h2>

            <p class="section-intro">
                Don't memorize these topics. By the end of the lesson,
                you should be able to explain them in your own words,
                connect them to real websites and use them while debugging.
            </p>

            <div class="objectives">

                ${lesson.outcomes.map((item, i) => `
                    <div class="objective-card">

                        <span>
                            ${String(i + 1).padStart(2, "0")}
                        </span>

                        <p>
                            ${esc(item)}
                        </p>

                    </div>
                `).join("")}

            </div>

        </section>
    `;
}


/* =========================================================
   SECTION RENDERER
========================================================= */

function renderSection(section, index) {

    let html = `
        <section class="lesson-section deep-section">

            <div class="section-number">
                ${String(index + 1).padStart(2, "0")}
            </div>

            <p class="section-label">
                CONCEPT ${String(index + 1).padStart(2, "0")}
            </p>

            <h2>
                ${esc(section.title)}
            </h2>
    `;

    if (section.intro) {
        html += `
            <div class="concept-intro">
                ${esc(section.intro)}
            </div>
        `;
    }

    if (section.explanation) {
        html += paragraphList(section.explanation);
    }

    if (section.points) {
        html += bulletList(section.points);
    }

    if (section.keyIdea) {
        html += `
            <div class="key-idea">
                <span>KEY IDEA</span>
                <p>${esc(section.keyIdea)}</p>
            </div>
        `;
    }

    if (section.warning) {
        html += `
            <div class="warning-box">
                <strong>Important</strong>
                <p>${esc(section.warning)}</p>
            </div>
        `;
    }

    if (section.commonMistake) {
        html += `
            <div class="mistake-box">
                <strong>Common Mistake</strong>
                <p>${esc(section.commonMistake)}</p>
            </div>
        `;
    }

    if (section.example) {
        html += `
            <div class="real-example">
                <span>REAL-WORLD EXAMPLE</span>
                <p>${esc(section.example)}</p>
            </div>
        `;
    }

    if (section.code) {
        html += codeBox(
            section.code,
            section.label || "WORKED EXAMPLE"
        );
    }

    if (section.output) {
        html += `
            <div class="output-box">
                <span>EXPECTED RESULT</span>
                <pre>${esc(section.output)}</pre>
            </div>
        `;
    }

    if (section.comparison) {
        html += comparisonBlock(section.comparison);
    }

    if (section.flow) {
        html += flowBlock(section.flow);
    }

    if (section.methods) {
        html += methodCards(section.methods);
    }

    if (section.groups) {
        html += groupCards(section.groups);
    }

    if (section.breakdown) {
        html += urlBreakdown(section.breakdown);
    }

    if (section.request) {
        html += `
            <div class="message-panel request-panel">

                <div class="message-title">
                    HTTP REQUEST
                </div>

                ${flowBlock(section.request)}

            </div>
        `;
    }

    if (section.response) {
        html += `
            <div class="message-panel response-panel">

                <div class="message-title">
                    HTTP RESPONSE
                </div>

                ${flowBlock(section.response)}

            </div>
        `;
    }

    if (section.serverResponsibilities) {
        html += `
            <h3>Typical server responsibilities</h3>
            ${bulletList(section.serverResponsibilities)}
        `;
    }

    if (section.frontend) {
        html += `
            <div class="role-panel">

                <div>
                    <span>FRONTEND</span>
                    ${bulletList(section.frontend)}
                </div>

                <div>
                    <span>BACKEND</span>
                    ${bulletList(section.backend || [])}
                </div>

            </div>
        `;
    }

    if (section.practice) {
        html += `
            <div class="try-it-box">
                <strong>TRY IT YOURSELF</strong>
                <p>${esc(section.practice)}</p>
            </div>
        `;
    }

    html += `</section>`;

    return html;
}


/* =========================================================
   VISUALIZER
========================================================= */

function renderArchitecture() {

    if (!lesson.sections) return "";

    const finalSection =
        lesson.sections.find(section => section.architecture);

    if (!finalSection) return "";

    return `
        <section class="lesson-section visualizer-section">

            <p class="section-label">
                INTERACTIVE SYSTEM VIEW
            </p>

            <h2>
                See how the pieces connect
            </h2>

            <p class="section-intro">
                Don't learn these technologies as isolated topics.
                Follow the direction in which information actually moves.
            </p>

            ${architecture(finalSection.architecture)}

        </section>
    `;
}


/* =========================================================
   TRACE
========================================================= */

function renderTrace() {

    if (!lesson.trace) return "";

    return `
        <section class="lesson-section trace-section">

            <p class="section-label">
                SYSTEM TRACE
            </p>

            <h2>
                Follow the process step by step
            </h2>

            <p class="section-intro">
                Move through the system one operation at a time.
                The highlighted step shows what is currently happening.
            </p>

            <div class="trace">

                <div>

                    <div
                        class="trace-code"
                        id="traceCode"
                    >
                        ${lesson.trace.code.map((line, i) => `
                            <div data-line="${i}">
                                ${esc(line) || " "}
                            </div>
                        `).join("")}
                    </div>

                    <div class="trace-controls">

                        <button id="traceReset">
                            Reset
                        </button>

                        <button id="traceNext">
                            Next step
                        </button>

                        <button id="traceAuto">
                            Auto run
                        </button>

                    </div>

                </div>

                <div class="trace-state">

                    <span class="trace-state-label">
                        CURRENT STATE
                    </span>

                    <strong id="traceState">
                        Ready
                    </strong>

                    <p id="traceExplain">
                        Press “Next step” to begin the trace.
                    </p>

                </div>

            </div>

        </section>
    `;
}


/* =========================================================
   REVISION
========================================================= */

function renderRevision() {

    if (!lesson.revision) return "";

    return `
        <section class="lesson-section">

            <p class="section-label">
                QUICK REVISION
            </p>

            <h2>
                Essential ideas to remember
            </h2>

            <div class="revision-grid">

                ${lesson.revision.map(item => `
                    <div>
                        <b>${esc(item[0])}</b>
                        <span>${esc(item[1])}</span>
                    </div>
                `).join("")}

            </div>

        </section>
    `;
}


/* =========================================================
   COMMON MISTAKES
========================================================= */

function renderMistakes() {

    if (!lesson.commonMistakes?.length) return "";

    return `
        <section class="lesson-section mistakes-section">

            <p class="section-label">
                AVOID THESE MISTAKES
            </p>

            <h2>
                Common beginner misunderstandings
            </h2>

            <div class="mistake-list">

                ${lesson.commonMistakes.map((item, i) => `
                    <div>

                        <span>
                            ${String(i + 1).padStart(2, "0")}
                        </span>

                        <p>
                            ${esc(item)}
                        </p>

                    </div>
                `).join("")}

            </div>

        </section>
    `;
}


/* =========================================================
   INTERVIEW
========================================================= */

function renderInterview() {

    if (!lesson.interview) return "";

    return `
        <section class="lesson-section interview">

            <p class="section-label">
                PLACEMENT PREPARATION
            </p>

            <h2>
                Interview questions
            </h2>

            <p class="section-intro">
                A strong developer should be able to explain concepts,
                not simply remember definitions.
            </p>

            ${lesson.interview.map((item, i) => `
                <details>

                    <summary>
                        <span>
                            ${String(i + 1).padStart(2, "0")}
                        </span>

                        ${esc(item.q)}
                    </summary>

                    <div>
                        <p>${esc(item.a)}</p>
                    </div>

                </details>
            `).join("")}

        </section>
    `;
}


/* =========================================================
   PRACTICE
========================================================= */

function renderPractice() {

    if (!lesson.practice) return "";

    return `
        <section class="lesson-section practice-section">

            <p class="section-label">
                PRACTICE ARENA
            </p>

            <h2>
                Now use what you learned
            </h2>

            <p class="section-intro">
                Try these without copying the examples above.
                The goal is to make the concept yours.
            </p>

            <div class="practice-grid">

                ${lesson.practice.map((item, i) => `
                    <article class="practice-card">

                        <span>
                            CHALLENGE ${String(i + 1).padStart(2, "0")}
                        </span>

                        <h3>
                            ${esc(item.title)}
                        </h3>

                        <p>
                            ${esc(item.prompt)}
                        </p>

                    </article>
                `).join("")}

            </div>

        </section>
    `;
}


/* =========================================================
   QUIZ
========================================================= */

function renderQuiz() {

    if (!lesson.quiz) return "";

    return `
        <section class="lesson-section quiz">

            <p class="section-label">
                KNOWLEDGE CHECK
            </p>

            <h2>
                Can you reason about it?
            </h2>

            ${lesson.quiz.map((q, i) => `
                <article
                    class="quiz-question"
                    data-question="${i}"
                >

                    <p>
                        ${i + 1}. ${esc(q.q)}
                    </p>

                    <div class="quiz-options">

                        ${q.options.map((option, j) => `
                            <button data-option="${j}">
                                <span>${String.fromCharCode(65 + j)}</span>
                                ${esc(option)}
                            </button>
                        `).join("")}

                    </div>

                    <div
                        class="quiz-result"
                        hidden
                    ></div>

                </article>
            `).join("")}

        </section>
    `;
}


/* =========================================================
   GLOSSARY
========================================================= */

function renderGlossary() {

    if (!lesson.glossary) return "";

    return `
        <section class="lesson-section">

            <p class="section-label">
                GLOSSARY
            </p>

            <h2>
                Important terms
            </h2>

            <div class="glossary-grid">

                ${lesson.glossary.map(item => `
                    <div>
                        <strong>${esc(item[0])}</strong>
                        <span>${esc(item[1])}</span>
                    </div>
                `).join("")}

            </div>

        </section>
    `;
}


/* =========================================================
   COMPLETE
========================================================= */

function renderComplete() {

    return `
        <section class="lesson-section completion-section">

            <p class="section-label">
                LEVEL COMPLETE
            </p>

            <h2>
                ${esc(lesson.takeaway)}
            </h2>

            <p>
                Before moving forward, make sure you can explain
                the major ideas without looking at the lesson.
            </p>

            <button
                class="complete-button"
                id="completeLevel"
            >
                Mark Level ${n} complete
            </button>

        </section>
    `;
}


/* =========================================================
   LEGACY CONCEPT SUPPORT
========================================================= */

function renderLegacyConcepts() {

    if (!lesson.concepts) return "";

    return lesson.concepts.map((concept, i) => `
        <section class="lesson-section deep-section">

            <p class="section-label">
                CONCEPT ${i + 1}
            </p>

            <h2>
                ${esc(concept.title)}
            </h2>

            <p>
                ${esc(concept.text)}
            </p>

            ${bulletList(concept.points || [])}

            ${concept.code
                ? codeBox(
                    concept.code,
                    concept.label || "WORKED EXAMPLE"
                )
                : ""}

            ${concept.output
                ? `
                    <div class="output-box">
                        <span>EXPECTED RESULT</span>
                        <pre>${esc(concept.output)}</pre>
                    </div>
                `
                : ""}

        </section>
    `).join("");
}


/* =========================================================
   RENDER
========================================================= */

function render() {

    if (!lesson) {

        document.getElementById("lessonMain").innerHTML = `
            <section class="lesson-section">

                <p class="section-label">
                    PLANNED LEVEL
                </p>

                <h2>
                    ${esc(levels[n - 1]?.title || "Coming Soon")}
                </h2>

                <p>
                    This level is part of the complete MERN roadmap
                    and will be developed after the current stage
                    is validated.
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

    document.title =
        `Level ${String(n).padStart(2, "0")}: ${lesson.title} | CodeBhavya`;

    let content = "";

    content += renderHero();
    content += renderOutcomes();

    if (lesson.sections) {

        content += lesson.sections
            .map((section, index) =>
                renderSection(section, index)
            )
            .join("");

    } else {

        content += renderLegacyConcepts();

    }

    content += renderArchitecture();
    content += renderTrace();
    content += renderMistakes();
    content += renderRevision();
    content += renderInterview();
    content += renderPractice();
    content += renderQuiz();
    content += renderGlossary();
    content += renderComplete();

    content += `
        <nav class="lesson-nav">

            ${
                n > 1
                    ? `<a href="lesson.html?level=${n - 1}">
                        ← Previous level
                       </a>`
                    : "<span></span>"
            }

            ${
                n < 30
                    ? `<a href="lesson.html?level=${n + 1}">
                        Next level →
                       </a>`
                    : `<a href="index.html#roadmap">
                        Return to roadmap →
                       </a>`
            }

        </nav>
    `;

    document.getElementById("lessonMain").innerHTML = content;

    initTrace();
    drawComplete();
}


/* =========================================================
   TRACE ENGINE
========================================================= */

function traceDraw() {

    if (!lesson?.trace) return;

    document
        .querySelectorAll("[data-line]")
        .forEach(line => line.classList.remove("active"));

    const step = lesson.trace.steps[traceIndex];

    if (!step) {

        document.getElementById("traceState").textContent =
            "Trace complete";

        document.getElementById("traceExplain").textContent =
            "You reached the end of the process. Reset to trace it again.";

        document.getElementById("traceNext").disabled = true;
        document.getElementById("traceAuto").disabled = true;

        clearInterval(timer);

        return;
    }

    const currentLine =
        document.querySelector(
            `[data-line="${step.line}"]`
        );

    if (currentLine) {
        currentLine.classList.add("active");
        currentLine.scrollIntoView({
            block: "nearest",
            behavior: "smooth"
        });
    }

    document.getElementById("traceState").textContent =
        step.state;

    document.getElementById("traceExplain").textContent =
        step.explain;

    traceIndex++;
}


function initTrace() {

    const next = document.getElementById("traceNext");
    const reset = document.getElementById("traceReset");
    const auto = document.getElementById("traceAuto");

    if (!next || !reset || !auto || !lesson?.trace) return;

    next.onclick = traceDraw;

    reset.onclick = () => {

        clearInterval(timer);

        traceIndex = 0;

        document
            .querySelectorAll("[data-line]")
            .forEach(line => line.classList.remove("active"));

        document.getElementById("traceState").textContent =
            "Ready";

        document.getElementById("traceExplain").textContent =
            "Press “Next step” to begin.";

        next.disabled = false;
        auto.disabled = false;
    };

    auto.onclick = () => {

        clearInterval(timer);

        timer = setInterval(() => {

            traceDraw();

            if (traceIndex >= lesson.trace.steps.length) {
                clearInterval(timer);
            }

        }, 1100);
    };
}


/* =========================================================
   COMPLETION
========================================================= */

function drawComplete() {

    const done = getProgress();

    const button =
        document.getElementById("completeLevel");

    if (!button) return;

    button.textContent =
        done.includes(n)
            ? `✓ Level ${n} completed`
            : `Mark Level ${n} complete`;
}


/* =========================================================
   CLICK EVENTS
========================================================= */

document.addEventListener("click", async (event) => {

    const button = event.target.closest("button");

    if (!button) return;


    /* COPY */

    if (button.dataset.copy !== undefined) {

        try {

            await navigator.clipboard.writeText(
                button.dataset.copy
            );

            toast("Code copied");

        } catch {

            toast("Select the code manually");

        }
    }


    /* QUIZ */

    if (button.dataset.option !== undefined) {

        const questionBox =
            button.closest(".quiz-question");

        const questionIndex =
            Number(questionBox.dataset.question);

        const question =
            lesson.quiz[questionIndex];

        const selected =
            Number(button.dataset.option);

        questionBox
            .querySelectorAll("[data-option]")
            .forEach((optionButton, index) => {

                optionButton.disabled = true;

                if (index === question.answer) {
                    optionButton.classList.add("correct");
                }

                if (
                    index === selected &&
                    selected !== question.answer
                ) {
                    optionButton.classList.add("wrong");
                }

            });

        const result =
            questionBox.querySelector(".quiz-result");

        result.hidden = false;

        result.textContent =
            selected === question.answer
                ? `Correct. ${question.explanation}`
                : `Not quite. ${question.explanation}`;
    }


    /* COMPLETE */

    if (button.id === "completeLevel") {

        let done = getProgress();

        if (done.includes(n)) {
            done = done.filter(x => x !== n);
        } else {
            done = [...done, n];
        }

        localStorage.setItem(
            KEY,
            JSON.stringify(done)
        );

        drawComplete();
    }


    /* MOBILE NAV */

    if (button.id === "navToggle") {

        const navElement =
            document.getElementById("siteNav");

        navElement.classList.toggle("open");
    }

});


/* =========================================================
   TOAST
========================================================= */

function toast(message) {

    const element =
        document.getElementById("toast");

    if (!element) return;

    element.textContent = message;

    element.classList.add("show");

    setTimeout(() => {
        element.classList.remove("show");
    }, 1300);
}


/* =========================================================
   SIDEBAR
========================================================= */

function sidebar(open) {

    const sidebarElement =
        document.getElementById("sidebar");

    const shade =
        document.getElementById("shade");

    sidebarElement.classList.toggle(
        "open",
        open
    );

    shade.hidden = !open;
}


const lessonMenu =
    document.getElementById("lessonMenu");

if (lessonMenu) {

    lessonMenu.onclick = () => {

        sidebar(
            !document
                .getElementById("sidebar")
                .classList.contains("open")
        );

    };

}


const shade =
    document.getElementById("shade");

if (shade) {
    shade.onclick = () => sidebar(false);
}


const levelSearch =
    document.getElementById("levelSearch");

if (levelSearch) {

    levelSearch.oninput = (event) => {

        const query =
            event.target.value.toLowerCase();

        document
            .querySelectorAll("#levelNav a")
            .forEach(link => {

                link.hidden =
                    !link.textContent
                        .toLowerCase()
                        .includes(query);

            });

    };

}


/* =========================================================
   READING PROGRESS
========================================================= */

window.addEventListener("scroll", () => {

    const documentElement =
        document.documentElement;

    const max =
        documentElement.scrollHeight -
        window.innerHeight;

    const bar =
        document.getElementById("readingBar");

    if (!bar) return;

    bar.style.width =
        (max > 0
            ? (window.scrollY / max) * 100
            : 0) + "%";

});


/* =========================================================
   INITIALIZE
========================================================= */

nav();
render();

const year =
    document.getElementById("year");

if (year) {
    year.textContent =
        new Date().getFullYear();
}
