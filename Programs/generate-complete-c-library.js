"use strict";

const fs = require("fs");
const path = require("path");

const root = __dirname;
const cSourceDirectory = path.join(root, "c-source");
const dsaSourceDirectory = path.join(root, "dsa-source");
const adsSourceDirectory = path.join(root, "ads-source");
const pythonSourceDirectory = path.join(root, "python-source");
const aiMlSourceDirectory = path.join(root, "ai-ml-source");

function loadModules(directory) {
  return fs.readdirSync(directory)
    .filter((file) => /^\d.*\.js$/.test(file))
    .sort()
    .flatMap((file) => require(path.join(directory, file)));
}

const cPrograms = loadModules(path.join(root, "c-library")).map((program) => ({
  course: "c",
  courseLabel: "C Programming",
  language: "c",
  learnHref: "../C-Programming/index.html",
  ...program
}));
const dsaPrograms = loadModules(path.join(root, "dsa-library"));
const adsPrograms = loadModules(path.join(root, "ads-library"));
const pythonPrograms = loadModules(path.join(root, "python-library"));
const aiMlPrograms = loadModules(path.join(root, "ai-ml-library"));
const programs = [...cPrograms, ...dsaPrograms, ...adsPrograms, ...pythonPrograms, ...aiMlPrograms];

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function validatePrograms() {
  const slugs = new Set();
  const titles = new Set();
  const required = ["slug", "title", "topic", "difficulty", "summary", "source", "sampleInput", "sampleOutput", "time", "space"];

  if (cPrograms.length !== 200 || dsaPrograms.length !== 106 || adsPrograms.length !== 112 || pythonPrograms.length !== 150 || aiMlPrograms.length !== 130) {
    throw new Error(`Expected 200 C, 106 DSA, 112 ADS, 150 Python and 130 AI/ML programs; received ${cPrograms.length}, ${dsaPrograms.length}, ${adsPrograms.length}, ${pythonPrograms.length} and ${aiMlPrograms.length}.`);
  }

  programs.forEach((program, index) => {
    required.forEach((key) => {
      if (typeof program[key] !== "string" || !program[key].trim()) {
        throw new Error(`Program ${index + 1} is missing ${key}.`);
      }
    });
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(program.slug)) {
      throw new Error(`Invalid slug: ${program.slug}`);
    }
    if (slugs.has(program.slug)) throw new Error(`Duplicate slug: ${program.slug}`);
    if (titles.has(program.title)) throw new Error(`Duplicate title: ${program.title}`);
    slugs.add(program.slug);
    titles.add(program.title);
  });
}

function navigation(program) {
  return `<header class="site-header">
    <a class="brand" href="../index.html" aria-label="CodeBhavya home"><img src="../images/codebhavya-main-logo.png" alt="" width="64" height="64"><span>Code<strong>Bhavya</strong></span></a>
    <nav class="desktop-nav" aria-label="Main navigation"><a href="../index.html">Home</a><a href="${program.learnHref}">Learn ${escapeHtml(program.courseLabel)}</a><a class="active" href="index.html" aria-current="page">Programs</a><a href="../Online-Compiler/index.html">Compiler</a><a href="../Placement/index.html">Placement</a></nav>
    <details class="mobile-nav"><summary aria-label="Open navigation"><span></span><span></span><span></span></summary><nav aria-label="Mobile navigation"><a href="../index.html">Home</a><a href="${program.learnHref}">Learn ${escapeHtml(program.courseLabel)}</a><a href="index.html">Program Library</a><a href="../Online-Compiler/index.html">Online Compiler</a><a href="../Placement/index.html">Placement</a></nav></details>
  </header>`;
}

function topicSidebar(program, previous, next) {
  const links = [];
  if (previous) links.push(`<a href="${previous.slug}.html">← ${escapeHtml(previous.title)}</a>`);
  links.push(`<a href="index.html">View all ${programs.length} programs</a>`);
  links.push(`<a href="../Online-Compiler/index.html">Open online compiler</a>`);
  if (next) links.push(`<a href="${next.slug}.html">${escapeHtml(next.title)} →</a>`);

  return `<aside class="example-sidebar">
    <h2 class="sidebar-title">${escapeHtml(program.courseLabel)} Programs</h2>
    <div class="example-links">
      <p class="sidebar-section">CURRENT TOPIC</p>
      <a class="active" href="index.html">${escapeHtml(program.topic)}</a>
      <p class="sidebar-section">PROGRAM NAVIGATION</p>
      ${links.join("\n")}
    </div>
  </aside>`;
}

function codeTour(program) {
  return `<section class="debug-lab code-tour" id="codeTour" aria-labelledby="tourTitle">
    <div class="debug-toolbar">
      <div class="debug-title"><p class="panel-kicker">GUIDED CODE TOUR • NOT LIVE EXECUTION</p><strong id="tourTitle">Study the program line by line</strong><p>Use the real compiler button above to run and debug with different inputs.</p></div>
      <div class="debug-controls"><button class="start-debug" id="startTour" type="button">Start</button><button id="previousTourStep" type="button" disabled>Previous</button><button class="next-step" id="nextTourStep" type="button" disabled>Next</button><button id="autoTour" type="button" disabled>Auto</button><button id="pauseTour" type="button" disabled>Pause</button><button id="resetTour" type="button">Reset</button></div>
    </div>
    <div class="debug-grid tour-grid">
      <div class="debug-code" id="tourSource" aria-label="Guided source code"></div>
      <div class="debug-state tour-state">
        <section class="state-panel"><h3>CURRENT STEP</h3><p class="step-message" id="tourMessage" aria-live="polite">Select Start to walk through the important lines.</p></section>
        <section class="state-panel"><h3>SELECTED LINE</h3><p class="step-message tour-selected-line" id="tourLine">No line selected</p></section>
        <section class="state-panel tour-output-panel"><h3>EXPECTED OUTPUT FOR THE SAMPLE</h3><pre class="terminal" id="tourOutput">${escapeHtml(program.sampleOutput)}</pre></section>
      </div>
    </div>
    <div class="progress-row"><progress id="tourProgress" max="1" value="0">0%</progress><span id="tourProgressText">Step 0 of 0</span></div>
  </section>`;
}

function pageNavigation(program, previous, next) {
  return `<nav class="program-navigation" aria-label="Program navigation">
    ${previous ? `<a href="${previous.slug}.html"><span>← Previous</span><strong>${escapeHtml(previous.title)}</strong></a>` : `<a href="index.html"><span>← Library</span><strong>All ${escapeHtml(program.courseLabel)} programs</strong></a>`}
    ${next ? `<a class="next-program" href="${next.slug}.html"><span>Next →</span><strong>${escapeHtml(next.title)}</strong></a>` : `<a class="next-program" href="index.html"><span>Complete</span><strong>Return to the library</strong></a>`}
  </nav>`;
}

function renderPage(program) {
  const coursePrograms = programs.filter((candidate) => candidate.course === program.course);
  const courseIndex = coursePrograms.indexOf(program);
  const previous = coursePrograms[courseIndex - 1] || null;
  const next = coursePrograms[courseIndex + 1] || null;
  const concepts = program.concepts.map((concept) => `<span class="meta-chip">${escapeHtml(concept)}</span>`).join("");
  const steps = program.steps.map((step) => `<li>${escapeHtml(step)}</li>`).join("");
  const errors = program.errors.map((error) => `<div class="mistake-box"><strong>Check this</strong><p>${escapeHtml(error)}</p></div>`).join("");
  const config = JSON.stringify({
    id: `${program.course}-${program.slug}`,
    fileName: `${program.slug}.${program.extension || "c"}`,
    language: program.language,
    sourceLines: program.source.split("\n"),
    sampleOutput: program.sampleOutput
  }).replaceAll("<", "\\u003c");

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="theme-color" content="#06192c">
  <meta name="description" content="${escapeHtml(program.summary)}">
  <link rel="canonical" href="https://codebhavya.com/Programs/${program.slug}.html">
  <title>${escapeHtml(program.title)} | ${escapeHtml(program.courseLabel)} Program | CodeBhavya</title>
  <link rel="stylesheet" href="programs.css">
  <script defer src="program-page.js?v=1"></script>
</head>
<body>
  <a class="skip-link" href="#programContent">Skip to program</a>
  ${navigation(program)}
  <main class="program-main" id="programContent">
    <nav class="breadcrumbs" aria-label="Breadcrumb"><a href="../index.html">Home</a><span>›</span><a href="index.html">Program Library</a><span>›</span><span>${escapeHtml(program.courseLabel)}</span><span>›</span><span aria-current="page">${escapeHtml(program.title)}</span></nav>
    <div class="program-page-layout">
      ${topicSidebar(program, previous, next)}
      <article class="program-article">
        <header class="program-hero">
          <p class="eyebrow">${escapeHtml(program.courseLabel.toUpperCase())} PROGRAM • ${escapeHtml(program.topic.toUpperCase())}</p>
          <h1>${escapeHtml(program.title)}</h1>
          <p>${escapeHtml(program.summary)}</p>
          <div class="meta-row"><span class="meta-chip">${escapeHtml(program.difficulty)}</span>${concepts}</div>
        </header>

        <section class="content-card">
          <p class="section-kicker">PROBLEM UNDERSTANDING</p>
          <h2>Input and expected output</h2>
          <div class="info-grid"><div class="info-box"><strong>Sample input</strong><pre class="io-code">${escapeHtml(program.sampleInput)}</pre></div><div class="info-box"><strong>Sample output</strong><pre class="io-code">${escapeHtml(program.sampleOutput)}</pre></div></div>
        </section>

        <section class="content-card" id="programCode">
          <p class="section-kicker">COMPLETE ${escapeHtml((program.languageLabel || "C").toUpperCase())} PROGRAM</p>
          <h2>Complete ${escapeHtml(program.languageLabel || "C")} implementation</h2>
          <div class="code-window"><div class="code-toolbar"><strong>${program.slug}.${program.extension || "c"}</strong><div class="code-actions"><button id="copyCode" type="button">Copy code</button><button id="downloadCode" type="button">Download .${program.extension || "c"}</button><a id="copyOpenCompiler" href="../Online-Compiler/index.html">Open in compiler</a></div></div><pre class="source-code" id="sourceCode" tabindex="0">${escapeHtml(program.source)}</pre></div>
        </section>

        ${codeTour(program)}

        <section class="content-card" id="explanation">
          <p class="section-kicker">PROGRAM EXPLANATION</p>
          <h2>Algorithm and explanation</h2>
          <ol>${steps}</ol>
          <p>${escapeHtml(program.explanation)}</p>
        </section>

        <section class="content-card" id="complexity">
          <p class="section-kicker">EFFICIENCY</p>
          <h2>Time and space complexity</h2>
          <div class="complexity-grid"><div class="complexity-box"><strong>Time complexity</strong><p><code>${escapeHtml(program.time)}</code></p></div><div class="complexity-box"><strong>Auxiliary space</strong><p><code>${escapeHtml(program.space)}</code></p></div></div>
        </section>

        <section class="content-card" id="commonErrors">
          <p class="section-kicker">DEBUGGING CHECKLIST</p>
          <h2>Common mistakes</h2>
          <div class="mistake-grid">${errors}</div>
          <h3>Try it yourself</h3>
          <div class="challenge-box"><strong>Practice:</strong> Run the program with the sample input, predict its output, and then test one boundary case of your own.</div>
        </section>

        ${pageNavigation(program, previous, next)}
      </article>
    </div>
  </main>
  <footer class="site-footer"><div><a class="footer-brand" href="../index.html">Code<strong>Bhavya</strong></a><p>From Learning to Limitless Possibilities.</p></div><nav><a href="index.html">Program Library</a><a href="../Online-Compiler/index.html">Compiler</a><a href="${program.learnHref}">Learn ${escapeHtml(program.courseLabel)}</a></nav><p>© 2026 CodeBhavya. All Rights Reserved.</p></footer>
  <div class="toast" id="toast" role="status" aria-live="polite" hidden></div>
  <script id="programConfig" type="application/json">${config}</script>
</body>
</html>`;
}

function writeCatalogData() {
  const catalog = programs.map((program) => ({
    id: `${program.course}-${program.slug}`,
    course: program.course,
    courseLabel: program.courseLabel,
    topic: program.topic,
    difficulty: program.difficulty,
    title: program.title,
    featured: Boolean(program.featured),
    summary: program.summary,
    concepts: program.concepts,
    href: `${program.slug}.html`,
    features: program.customPage
      ? ["Interactive debugger", "Variable table", "Output state"]
      : ["Compiler ready", "Guided code tour", "Common errors"]
  }));
  fs.writeFileSync(path.join(root, "programs-data.js"), `"use strict";\n\nwindow.CODEBHAVYA_PROGRAMS = ${JSON.stringify(catalog, null, 2)};\n`);
}

function writeSitemap() {
  const pages = ["https://codebhavya.com/Programs/", ...programs.map((program) => `https://codebhavya.com/Programs/${program.slug}.html`)];
  const body = pages.map((url) => `  <url>\n    <loc>${url}</loc>\n  </url>`).join("\n");
  fs.writeFileSync(path.join(root, "sitemap-programs.xml"), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`);
}

validatePrograms();
fs.mkdirSync(cSourceDirectory, { recursive: true });
fs.mkdirSync(dsaSourceDirectory, { recursive: true });
fs.mkdirSync(adsSourceDirectory, { recursive: true });
fs.mkdirSync(pythonSourceDirectory, { recursive: true });
fs.mkdirSync(aiMlSourceDirectory, { recursive: true });
writeCatalogData();
writeSitemap();

let generatedPages = 0;
programs.forEach((program) => {
  const sourceDirectory = {
    c: cSourceDirectory,
    dsa: dsaSourceDirectory,
    ads: adsSourceDirectory,
    python: pythonSourceDirectory,
    "ai-ml": aiMlSourceDirectory
  }[program.course];
  fs.writeFileSync(path.join(sourceDirectory, `${program.slug}.${program.extension || "c"}`), `${program.source}\n`);
  if (!program.customPage) {
    fs.writeFileSync(path.join(root, `${program.slug}.html`), renderPage(program));
    generatedPages++;
  }
});

console.log(`Prepared ${programs.length} programs: ${generatedPages} standard pages and ${programs.length - generatedPages} advanced debugger pages.`);
