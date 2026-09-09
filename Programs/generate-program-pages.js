"use strict";

const fs = require("fs");
const path = require("path");

const programs = [
  {
    id: "c-hello-world",
    file: "hello-world.html",
    title: "Display Hello World",
    description: "Understand the smallest complete C program and trace how printf() produces output.",
    difficulty: "Beginner",
    topic: "Program Structure & Output",
    concepts: ["main()", "printf()", "Header files"],
    sourceLines: ["#include <stdio.h>", "", "int main(void)", "{", "    printf(\"Hello, World!\\n\");", "    return 0;", "}"],
    inputs: [],
    sampleInput: "No input required",
    sampleOutput: "Hello, World!",
    algorithm: ["Start the main() function.", "Call printf() with the required message.", "Return 0 to finish successfully."],
    explanation: "stdio.h declares printf(). Execution begins in main(), printf() writes the message, and return 0 reports successful completion.",
    time: "O(1)",
    space: "O(1)",
    errors: ["Writing Printf instead of printf; C is case-sensitive.", "Missing the semicolon after printf()."]
  },
  {
    id: "c-add-two-numbers",
    file: "add-two-numbers.html",
    title: "Add Two Integers",
    description: "Read two integers, add them and inspect how the result variable receives the calculated value.",
    difficulty: "Beginner",
    topic: "Input, Output & Operators",
    concepts: ["scanf()", "Addition", "Variables"],
    sourceLines: ["#include <stdio.h>", "", "int main(void)", "{", "    int first, second, sum;", "    printf(\"Enter two integers: \" );", "    scanf(\"%d %d\", &first, &second);", "    sum = first + second;", "    printf(\"Sum = %d\\n\", sum);", "    return 0;", "}"],
    inputs: [{ key: "first", label: "First integer", value: 12 }, { key: "second", label: "Second integer", value: 8 }],
    sampleInput: "12 8",
    sampleOutput: "Enter two integers: 12 8\nSum = 20",
    algorithm: ["Read two integers.", "Add the values and store the result in sum.", "Print sum."],
    explanation: "scanf() stores the entered integers in first and second. The + operator produces a new value, which is assigned to sum before printf() displays it.",
    time: "O(1)",
    space: "O(1)",
    errors: ["Forgetting & before variables in scanf().", "Using the wrong format specifier for an integer."]
  },
  {
    id: "c-swap-two-numbers",
    file: "swap-two-numbers.html",
    title: "Swap Two Numbers Using a Temporary Variable",
    description: "Preserve the first value in temporary storage before exchanging two integers.",
    difficulty: "Beginner",
    topic: "Variables & Assignment",
    concepts: ["Assignment", "Temporary variable", "Input"],
    sourceLines: ["#include <stdio.h>", "", "int main(void)", "{", "    int first, second, temp;", "    printf(\"Enter two integers: \" );", "    scanf(\"%d %d\", &first, &second);", "    temp = first;", "    first = second;", "    second = temp;", "    printf(\"After swapping: %d %d\\n\", first, second);", "    return 0;", "}"],
    inputs: [{ key: "first", label: "First integer", value: 10 }, { key: "second", label: "Second integer", value: 25 }],
    sampleInput: "10 25",
    sampleOutput: "Enter two integers: 10 25\nAfter swapping: 25 10",
    algorithm: ["Read first and second.", "Copy first into temp.", "Copy second into first.", "Copy temp into second.", "Print the exchanged values."],
    explanation: "The temporary variable protects the original first value. Without temp, assigning second to first would destroy the value needed for the final assignment.",
    time: "O(1)",
    space: "O(1)",
    errors: ["Assigning first = second before saving first.", "Printing the original variables before performing all three assignments."]
  },
  {
    id: "c-even-or-odd",
    file: "even-or-odd.html",
    title: "Check Whether a Number Is Even or Odd",
    description: "Use the remainder operator and an if-else decision to classify an integer.",
    difficulty: "Beginner",
    topic: "Decision Making",
    concepts: ["if-else", "Modulus", "Condition"],
    sourceLines: ["#include <stdio.h>", "", "int main(void)", "{", "    int number;", "    printf(\"Enter an integer: \" );", "    scanf(\"%d\", &number);", "    if (number % 2 == 0)", "        printf(\"%d is even.\\n\", number);", "    else", "        printf(\"%d is odd.\\n\", number);", "    return 0;", "}"],
    inputs: [{ key: "number", label: "Integer", value: 17 }],
    sampleInput: "17",
    sampleOutput: "Enter an integer: 17\n17 is odd.",
    algorithm: ["Read an integer.", "Calculate number % 2.", "If the remainder is zero, print even; otherwise print odd."],
    explanation: "An even integer is exactly divisible by 2. Therefore number % 2 gives 0 for even values and a non-zero remainder for odd values.",
    time: "O(1)",
    space: "O(1)",
    errors: ["Using = instead of == in the condition.", "Using division instead of the remainder operator."]
  },
  {
    id: "c-largest-of-three",
    file: "largest-of-three.html",
    title: "Find the Largest of Three Numbers",
    description: "Track a current largest value and update it after comparing each remaining number.",
    difficulty: "Beginner",
    topic: "Decision Making",
    concepts: ["if statement", "Comparison", "Running maximum"],
    sourceLines: ["#include <stdio.h>", "", "int main(void)", "{", "    int first, second, third, largest;", "    printf(\"Enter three integers: \" );", "    scanf(\"%d %d %d\", &first, &second, &third);", "", "    largest = first;", "    if (second > largest)", "        largest = second;", "    if (third > largest)", "        largest = third;", "    printf(\"Largest = %d\\n\", largest);", "    return 0;", "}"],
    inputs: [{ key: "first", label: "First integer", value: 14 }, { key: "second", label: "Second integer", value: 39 }, { key: "third", label: "Third integer", value: 27 }],
    sampleInput: "14 39 27",
    sampleOutput: "Enter three integers: 14 39 27\nLargest = 39",
    algorithm: ["Read three integers.", "Assume first is the largest.", "Replace largest when second is greater.", "Replace largest when third is greater.", "Print largest."],
    explanation: "The variable largest stores the best value seen so far. Each independent if statement compares one remaining input with that current value.",
    time: "O(1)",
    space: "O(1)",
    errors: ["Using else-if when independent comparisons are intended.", "Forgetting to initialize largest before comparing values."]
  }
];

const escapeHtml = (value) => String(value)
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;");

const allLinks = [
  ["hello-world.html", "Display Hello World"],
  ["add-two-numbers.html", "Add Two Integers"],
  ["swap-two-numbers.html", "Swap Two Numbers"],
  ["even-or-odd.html", "Check Even or Odd"],
  ["largest-of-three.html", "Largest of Three Numbers"],
  ["gcd-recursion.html", "Find GCD Using Recursion"]
];

function navigation() {
  return `<header class="site-header">
    <a class="brand" href="../index.html" aria-label="CodeBhavya home"><img src="../images/codebhavya-main-logo.png" alt="" width="64" height="64"><span>Code<strong>Bhavya</strong></span></a>
    <nav class="desktop-nav" aria-label="Main navigation"><a href="../index.html">Home</a><a href="../C-Programming/index.html">Learn C</a><a class="active" href="index.html" aria-current="page">Programs</a><a href="../Online-Compiler/index.html">Compiler</a><a href="../Placement/index.html">Placement</a></nav>
    <details class="mobile-nav"><summary aria-label="Open navigation"><span></span><span></span><span></span></summary><nav aria-label="Mobile navigation"><a href="../index.html">Home</a><a href="../C-Programming/index.html">Learn C</a><a href="index.html">Program Library</a><a href="../Online-Compiler/index.html">Online Compiler</a><a href="../Placement/index.html">Placement</a></nav></details>
  </header>`;
}

function debuggerMarkup(program) {
  const inputs = program.inputs.length
    ? program.inputs.map((input) => `<label>${escapeHtml(input.label)}<input data-debug-input="${input.key}" type="number" step="1" value="${input.value}" inputmode="numeric"></label>`).join("")
    : `<p>This program does not require input. Select Start to trace it.</p>`;

  return `<section class="debug-lab" id="debugger" aria-labelledby="debugTitle">
    <div class="debug-toolbar"><div class="debug-title"><p class="panel-kicker">INTERACTIVE LEARNING</p><strong id="debugTitle">Debug this program line by line</strong><p>Watch the active line, variables and output.</p></div><div class="debug-controls"><button class="start-debug" id="startDebug" type="button">Start</button><button id="previousStep" type="button" disabled>Previous</button><button class="next-step" id="nextStep" type="button" disabled>Next</button><button id="autoDebug" type="button" disabled>Auto</button><button id="pauseDebug" type="button" disabled>Pause</button><button id="resetDebug" type="button">Reset</button></div></div>
    <div class="debug-inputs">${inputs}<p class="input-error" id="inputError" role="alert" hidden></p></div>
    <div class="debug-grid"><div class="debug-code" id="debugSource"></div><div class="debug-state"><section class="state-panel"><h3>CURRENT STEP</h3><p class="step-message" id="stepMessage" aria-live="polite">Select Start to trace this program.</p></section><section class="state-panel"><h3>VARIABLES</h3><table class="variable-table"><thead><tr><th>Scope</th><th>Name</th><th>Value</th></tr></thead><tbody id="variableBody"><tr><td colspan="3">Not started</td></tr></tbody></table></section><section class="state-panel"><h3>CALL STACK</h3><div class="call-flow"><span class="call-chip">main()</span></div></section><section class="state-panel"><h3>PROGRAM OUTPUT</h3><pre class="terminal" id="debugOutput">Waiting to run…</pre></section></div></div>
    <div class="progress-row"><progress id="debugProgress" max="1" value="0">0%</progress><span id="progressText">Step 0 of 0</span></div>
  </section>`;
}

function page(program) {
  const sidebar = allLinks.map(([href, title]) => `<a${href === program.file ? ' class="active" aria-current="page"' : ""} href="${href}">${escapeHtml(title)}</a>`).join("");
  const concepts = program.concepts.map((concept) => `<span class="meta-chip">${escapeHtml(concept)}</span>`).join("");
  const steps = program.algorithm.map((step) => `<li>${escapeHtml(step)}</li>`).join("");
  const errors = program.errors.map((error) => `<div class="mistake-box"><strong>Check this</strong><p>${escapeHtml(error)}</p></div>`).join("");
  const config = JSON.stringify({ id: program.id, sourceLines: program.sourceLines }).replaceAll("<", "\\u003c");

  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="theme-color" content="#06192c"><meta name="description" content="${escapeHtml(program.description)}"><link rel="canonical" href="https://codebhavya.com/Programs/${program.file}"><title>C Program to ${escapeHtml(program.title)} | CodeBhavya</title><link rel="stylesheet" href="programs.css"><script defer src="programs.js"></script><script defer src="simple-program-debugger.js"></script></head>
<body><a class="skip-link" href="#programContent">Skip to program</a>${navigation()}
<main class="program-main" id="programContent"><nav class="breadcrumbs" aria-label="Breadcrumb"><a href="../index.html">Home</a><span>›</span><a href="index.html">Program Library</a><span>›</span><span>C Programming</span><span>›</span><span aria-current="page">${escapeHtml(program.title)}</span></nav>
<div class="program-page-layout"><aside class="example-sidebar"><h2 class="sidebar-title">C Examples</h2><div class="example-links"><a href="index.html">← All programs</a><p class="sidebar-section">BASIC PROGRAMS</p>${sidebar}</div></aside>
<article class="program-article"><header class="program-hero"><p class="eyebrow">C PROGRAM • ${escapeHtml(program.topic.toUpperCase())}</p><h1>${escapeHtml(program.title)}</h1><p>${escapeHtml(program.description)}</p><div class="meta-row"><span class="meta-chip">${escapeHtml(program.difficulty)}</span>${concepts}</div></header>
<section class="content-card"><p class="section-kicker">PROBLEM UNDERSTANDING</p><h2>Input and expected output</h2><div class="info-grid"><div class="info-box"><strong>Sample input</strong><pre class="io-code">${escapeHtml(program.sampleInput)}</pre></div><div class="info-box"><strong>Sample output</strong><pre class="io-code">${escapeHtml(program.sampleOutput)}</pre></div></div></section>
<section class="content-card" id="programCode"><p class="section-kicker">C PROGRAM</p><h2>Complete program</h2><div class="code-window"><div class="code-toolbar"><strong>${program.file.replace(".html", ".c")}</strong><div class="code-actions"><button id="copyCode" type="button">Copy code</button><a id="copyOpenCompiler" href="../Online-Compiler/index.html">Copy &amp; open compiler</a></div></div><pre class="source-code" id="sourceCode" tabindex="0">${escapeHtml(program.sourceLines.join("\n"))}</pre></div></section>
${debuggerMarkup(program)}
<section class="content-card" id="explanation"><p class="section-kicker">PROGRAM EXPLANATION</p><h2>Algorithm and explanation</h2><ol>${steps}</ol><p>${escapeHtml(program.explanation)}</p></section>
<section class="content-card" id="complexity"><p class="section-kicker">EFFICIENCY</p><h2>Time and space complexity</h2><div class="complexity-grid"><div class="complexity-box"><strong>Time complexity</strong><p><code>${program.time}</code></p></div><div class="complexity-box"><strong>Auxiliary space</strong><p><code>${program.space}</code></p></div></div></section>
<section class="content-card" id="commonErrors"><p class="section-kicker">DEBUGGING CHECKLIST</p><h2>Common mistakes</h2><div class="mistake-grid">${errors}</div></section></article></div></main>
<footer class="site-footer"><div><a class="footer-brand" href="../index.html">Code<strong>Bhavya</strong></a><p>From Learning to Limitless Possibilities.</p></div><nav><a href="index.html">Program Library</a><a href="../Online-Compiler/index.html">Compiler</a><a href="../C-Programming/index.html">Learn C</a></nav><p>© 2026 CodeBhavya. All Rights Reserved.</p></footer><div class="toast" id="toast" role="status" aria-live="polite" hidden></div><script id="programConfig" type="application/json">${config}</script></body></html>`;
}

programs.forEach((program) => {
  fs.writeFileSync(path.join(__dirname, program.file), page(program));
});

console.log(`Generated ${programs.length} program pages.`);
