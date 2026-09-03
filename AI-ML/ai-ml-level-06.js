(function () {
"use strict";
const LEVEL_PROGRESS_KEY = "codebhavya-aiml-level-06-progress-v1";

function byId(id) {
return document.getElementById(id);
}

function escapeHtml(value) {
return String(value)
.replace(/&/g, "&amp;")
.replace(/</g, "&lt;")
.replace(/>/g, "&gt;")
.replace(/"/g, "&quot;")
.replace(/'/g, "&#039;");
}

function fitChart(lineClass, residuals) {
const points = [
[12, 18],
[25, 31],
[39, 39],
[53, 55],
[67, 66],
[82, 79]
];

const pointHtml = points.map(function (point, index) {
const residual = residuals
? '<em class="aiml-fit-residual r' +
(index + 1) + '"></em>'
: "";

return '<i class="aiml-fit-point p' +
(index + 1) +
'" style="--x:' + point[0] +
"%;--y:" + point[1] +
'%"></i>' + residual;
}).join("");

return '<div class="aiml-fit-chart ' +
lineClass +
'"><span class="axis x"></span>' +
'<span class="axis y"></span>' +
pointHtml +
'<b class="aiml-fit-line"></b>' +
"<label>x</label><label>y</label></div>";
}

function initFitVisualizer() {
const stepContainer = byId("fitStepNodes");
if (!stepContainer) return;

const steps = [
{
short: "Data",
sub: "Observe",
title: "Observe the training points",
description: "Each point pairs one study-hour value with an observed score.",
insight: "The upward pattern suggests a positive relationship, but the model must quantify it using training evidence.",
graphic: fitChart("points-only", false)
},
{
short: "Model",
sub: "Initialize",
title: "Start with an imperfect line",
description: "Initialize weight and bias. The first line makes inaccurate predictions.",
insight: "A model is a parameterized hypothesis. Training changes its parameters, not the observed targets.",
graphic: fitChart("line-initial", false) +
'<div class="aiml-fit-stats"><span>w = 0.45</span><span>b = 18</span></div>'
},
{
short: "Residuals",
sub: "Compare",
title: "Measure vertical prediction errors",
description: "Residuals connect each actual point to the value predicted by the current line.",
insight: "Positive and negative errors should not cancel before squaring or taking absolute values.",
graphic: fitChart(
"line-initial show-residuals",
true
) +
'<div class="aiml-fit-stats"><span>eᵢ = yᵢ − ŷᵢ</span></div>'
},
{
short: "Loss",
sub: "Summarize",
title: "Convert residuals into one objective",
description: "Mean squared error gives large mistakes extra weight and produces a differentiable objective.",
insight: "The loss is a training objective. The reporting metric should still match the real decision cost.",
graphic: '<div class="aiml-loss-stage"><span>RESIDUALS</span><strong>−9, −6, 2, 5, 8, 12</strong><b>↓ square and average ↓</b><code>MSE = 60.7</code></div>'
},
{
short: "Gradient",
sub: "Direction",
title: "Calculate how loss changes",
description: "The gradients show the uphill direction for weight and bias.",
insight: "Subtracting the gradient moves downhill. Its magnitude and the learning rate determine the update size.",
graphic: '<div class="aiml-gradient-stage"><div><span>∂J / ∂w</span><strong>−18.4</strong></div><div><span>∂J / ∂b</span><strong>−6.2</strong></div><b>PARAMETERS MOVE OPPOSITE THE GRADIENT</b><code>θ ← θ − α∇J(θ)</code></div>'
},
{
short: "Update",
sub: "Improve",
title: "Update weight and bias",
description: "One optimization step rotates and shifts the line toward the observations.",
insight: "Feature scaling makes the loss surface easier to navigate when predictors use very different units.",
graphic: fitChart("line-improved", true) +
'<div class="aiml-fit-stats"><span>w = 0.76</span><span>b = 12</span><span>MSE = 14.3</span></div>'
},
{
short: "Converge",
sub: "Validate",
title: "Stop at a validated best-fit model",
description: "After repeated updates, loss stabilizes and the final line is evaluated on unseen data.",
insight: "Convergence on training data is not enough. Inspect test error, residual patterns and subgroup performance.",
graphic: fitChart("line-final", false) +
'<div class="aiml-fit-stats success"><span>w = 0.93</span><span>b = 8.4</span><span>MSE = 3.8</span><span>✓ VALIDATE</span></div>'
}
];

const previousButton = byId("fitPrevious");
const nextButton = byId("fitNext");
const autoButton = byId("fitAuto");
const pauseButton = byId("fitPause");
const resetButton = byId("fitReset");
const progress = byId("fitProgress");
const eyebrow = byId("fitStageEyebrow");
const title = byId("fitStageTitle");
const description = byId("fitStageDescription");
const insight = byId("fitStageInsight");
const graphic = byId("fitStageGraphic");

let currentStep = 0;
let timer = null;

stepContainer.innerHTML = steps.map(function (step, index) {
return '<div class="aiml-visual-step" data-visual-step="' +
index + '"><b>' + escapeHtml(step.short) +
"</b><span>" + escapeHtml(step.sub) +
"</span></div>";
}).join("");

function stopAutoRun() {
if (timer !== null) {
window.clearInterval(timer);
timer = null;
}
pauseButton.disabled = true;
}

function render() {
const step = steps[currentStep];
const atEnd = currentStep === steps.length - 1;

Array.from(stepContainer.children)
.forEach(function (node, index) {
node.classList.toggle(
"is-active",
index === currentStep
);

node.classList.toggle(
"is-complete",
index < currentStep
);

node.setAttribute(
"aria-current",
index === currentStep ? "step" : "false"
);
});

eyebrow.textContent =
"STEP " + (currentStep + 1) +
" OF " + steps.length;

title.textContent = step.title;
description.textContent = step.description;

insight.innerHTML =
"<strong>MODEL INSIGHT</strong><span>" +
escapeHtml(step.insight) +
"</span>";

graphic.innerHTML = step.graphic;

progress.textContent =
"Step " + (currentStep + 1) +
" of " + steps.length;

previousButton.disabled = currentStep === 0;
nextButton.disabled = atEnd;
autoButton.disabled = atEnd || timer !== null;

if (atEnd) {
stopAutoRun();
nextButton.disabled = true;
autoButton.disabled = true;
}
}

function goNext() {
if (currentStep < steps.length - 1) {
currentStep += 1;
render();
} else {
stopAutoRun();
render();
}
}

previousButton.addEventListener("click", function () {
stopAutoRun();
currentStep = Math.max(0, currentStep - 1);
render();
});

nextButton.addEventListener("click", goNext);

autoButton.addEventListener("click", function () {
if (
currentStep >= steps.length - 1 ||
timer !== null
) {
return;
}

autoButton.disabled = true;
pauseButton.disabled = false;
timer = window.setInterval(goNext, 1250);
});

pauseButton.addEventListener("click", function () {
stopAutoRun();
render();
});

resetButton.addEventListener("click", function () {
stopAutoRun();
currentStep = 0;
render();
});

render();
}

function buildTraceStates() {
const x = [1, 2, 3];
const y = [3, 5, 7];
const states = [];

let weight = 0;
let bias = 0;
const rate = 0.1;
let epoch = null;
let dw = null;
let db = null;
let xi = null;
let yi = null;
let prediction = null;
let error = null;

function formatted(value) {
return typeof value === "number"
? Number(value.toFixed(4))
: value;
}

function snapshot(extra) {
const base = {
x: "[1, 2, 3]",
y: "[3, 5, 7]",
weight: formatted(weight),
bias: formatted(bias),
rate: rate
};

if (epoch !== null) base.epoch = epoch;
if (dw !== null) base.dw = formatted(dw);
if (db !== null) base.db = formatted(db);
if (xi !== null) base.xi = xi;
if (yi !== null) base.yi = yi;

if (prediction !== null) {
base.prediction = formatted(prediction);
}

if (error !== null) {
base.error = formatted(error);
}

return Object.assign(base, extra || {});
}

function add(
line,
status,
explanation,
expression,
output
) {
states.push({
line: line,
status: status,
explanation: explanation,
expression: expression,
variables: snapshot(),
output: output || "Waiting for print(...)"
});
}

add(
1,
"Features loaded",
"Store the three input values.",
"x = [1, 2, 3]"
);

add(
2,
"Targets loaded",
"Store targets generated by the pattern y = 2x + 1.",
"y = [3, 5, 7]"
);

add(
3,
"Weight initialized",
"Begin with a zero slope.",
"weight = 0.0"
);

add(
4,
"Bias initialized",
"Begin with a zero intercept.",
"bias = 0.0"
);

add(
5,
"Learning rate set",
"Use a step size of 0.1 for each batch update.",
"rate = 0.1"
);

for (
let epochIndex = 0;
epochIndex < 2;
epochIndex += 1
) {
epoch = epochIndex;
dw = null;
db = null;
xi = null;
yi = null;
prediction = null;
error = null;

add(
6,
"Epoch " + (epochIndex + 1),
"Enter the outer loop. The cursor returns here before each full pass through the data.",
"epoch = " + epochIndex
);

dw = 0;

add(
7,
"Weight gradient reset",
"Reset the accumulated weight derivative for this epoch.",
"dw = 0.0"
);

db = 0;

add(
8,
"Bias gradient reset",
"Reset the accumulated bias derivative for this epoch.",
"db = 0.0"
);

for (let index = 0; index < x.length; index += 1) {
xi = x[index];
yi = y[index];
prediction = null;
error = null;

add(
9,
"Epoch " + (epochIndex + 1) +
" • sample " + (index + 1),
"Read the next feature and target. The cursor returns to the inner loop for every sample.",
"xi, yi = " + xi + ", " + yi
);

prediction = weight * xi + bias;

add(
10,
"Prediction calculated",
"Apply the current weight and bias to this feature.",
"prediction = " +
formatted(weight) + " × " +
xi + " + " +
formatted(bias) + " = " +
formatted(prediction)
);

error = prediction - yi;

add(
11,
"Error calculated",
"Subtract the actual target from the prediction.",
"error = " +
formatted(prediction) +
" − " + yi +
" = " + formatted(error)
);

dw += error * xi;

add(
12,
"Weight gradient accumulated",
"Add this sample's error × feature contribution.",
"dw += " +
formatted(error) +
" × " + xi +
" → " + formatted(dw)
);

db += error;

add(
13,
"Bias gradient accumulated",
"Add this sample's error contribution.",
"db += " +
formatted(error) +
" → " + formatted(db)
);
}

const weightChange =
rate * (2 / x.length) * dw;

weight -= weightChange;

add(
14,
"Weight updated",
"Move the slope opposite the average batch gradient.",
"weight -= 0.1 × (2/3) × " +
formatted(dw) +
" → " + formatted(weight)
);

const biasChange =
rate * (2 / x.length) * db;

bias -= biasChange;

add(
15,
"Bias updated",
"Move the intercept opposite the average batch gradient.",
"bias -= 0.1 × (2/3) × " +
formatted(db) +
" → " + formatted(bias)
);
}

xi = null;
yi = null;
prediction = null;
error = null;

add(
16,
"Complete",
"Round and display the learned parameters after two epochs.",
"print(round(weight, 2), round(bias, 2))",
"2.02 0.89"
);

return states;
}

function initProgramTracer() {
const codeContainer = byId("tracerCode");
if (!codeContainer) return;

const codeLines = [
"x = [1, 2, 3]",
"y = [3, 5, 7]",
"weight = 0.0",
"bias = 0.0",
"rate = 0.1",
"for epoch in range(2):",
"    dw = 0.0",
"    db = 0.0",
"    for xi, yi in zip(x, y):",
"        prediction = weight * xi + bias",
"        error = prediction - yi",
"        dw += error * xi",
"        db += error",
"    weight -= rate * (2 / len(x)) * dw",
"    bias -= rate * (2 / len(x)) * db",
"print(round(weight, 2), round(bias, 2))"
];

const traceStates = buildTraceStates();
const panel = byId("tracerPanel");
const panelToggle = byId("tracerPanelToggle");
const previousButton = byId("tracerPrevious");
const nextButton = byId("tracerNext");
const autoButton = byId("tracerAuto");
const pauseButton = byId("tracerPause");
const resetButton = byId("tracerReset");

let currentStep = 0;
let timer = null;

codeContainer.innerHTML = codeLines.map(
function (line, index) {
return '<div class="aiml-code-line" data-code-line="' +
(index + 1) + '"><span>' +
String(index + 1).padStart(2, "0") +
"</span><code>" +
escapeHtml(line) +
"</code></div>";
}
).join("");

function stopAutoRun() {
if (timer !== null) {
window.clearInterval(timer);
timer = null;
}
pauseButton.disabled = true;
}

function renderVariables(variables) {
const entries = Object.entries(variables || {});

byId("tracerVariables").innerHTML = entries.length
? entries.map(function (entry) {
return '<article class="aiml-variable"><span>' +
escapeHtml(entry[0]) +
"</span><strong>" +
escapeHtml(entry[1]) +
"</strong></article>";
}).join("")
: '<article class="aiml-variable"><span>STATE</span><strong>Not started</strong></article>';
}

function render() {
const atStart = currentStep === 0;
const atEnd = currentStep === traceStates.length;
const state =
atStart ? null : traceStates[currentStep - 1];

codeContainer
.querySelectorAll(".aiml-code-line")
.forEach(function (line) {
line.classList.toggle(
"is-active",
Boolean(state) &&
Number(line.dataset.codeLine) === state.line
);
});

if (state) {
byId("tracerStatus").textContent = state.status;
byId("tracerExplanation").textContent =
state.explanation;
byId("tracerExpression").textContent =
state.expression;
byId("tracerOutput").textContent = state.output;

renderVariables(state.variables);

const activeLine = codeContainer.querySelector(
'[data-code-line="' + state.line + '"]'
);

if (activeLine) {
activeLine.scrollIntoView({
behavior: "smooth",
block: "nearest"
});
}
} else {
byId("tracerStatus").textContent = "Ready";

byId("tracerExplanation").textContent =
"Press Next to execute the first statement.";

byId("tracerExpression").textContent = "—";

byId("tracerOutput").textContent =
"Waiting for print(...)";

renderVariables({});
}

previousButton.disabled = atStart;
nextButton.disabled = atEnd;
autoButton.disabled = atEnd || timer !== null;

byId("tracerProgress").textContent = atStart
? "Step 0 of " + traceStates.length
: "Step " + currentStep +
" of " + traceStates.length;

if (atEnd) {
stopAutoRun();
nextButton.disabled = true;
autoButton.disabled = true;
}
}

function goNext() {
if (currentStep < traceStates.length) {
currentStep += 1;
render();
} else {
stopAutoRun();
render();
}
}

panelToggle.addEventListener("click", function () {
const opening = panel.hidden;
panel.hidden = !opening;

panelToggle.textContent = opening
? "✕ Close Interactive Tracer"
: "Open Interactive Tracer";

panelToggle.setAttribute(
"aria-expanded",
String(opening)
);

if (opening) {
window.setTimeout(function () {
panel.scrollIntoView({
behavior: "smooth",
block: "nearest"
});
}, 50);
} else {
stopAutoRun();
}
});

previousButton.addEventListener("click", function () {
stopAutoRun();
currentStep = Math.max(0, currentStep - 1);
render();
});

nextButton.addEventListener("click", goNext);

autoButton.addEventListener("click", function () {
if (
currentStep >= traceStates.length ||
timer !== null
) {
return;
}

autoButton.disabled = true;
pauseButton.disabled = false;
timer = window.setInterval(goNext, 850);
});

pauseButton.addEventListener("click", function () {
stopAutoRun();
render();
});

resetButton.addEventListener("click", function () {
stopAutoRun();
currentStep = 0;
render();
});

render();
}

function initProgrammingProblems() {
const list = byId("problemList");
if (!list) return;

const problems = [
{
title: "Predict with a Learned Line",
description: "Read x, weight and bias; print the prediction rounded to two decimals.",
sampleInput: "6 2.5 4",
expected: "19.0",
hint: "Use y_hat = weight * x + bias.",
starter: "# Read x, weight and bias\n",
solution: "x, weight, bias = map(float, input().split())\nprediction = weight * x + bias\nprint(round(prediction, 2))",
required: [
["input("],
["weight * x", "x * weight"],
["+ bias"],
["print("]
]
},
{
title: "Mean Squared Error with NumPy",
description: "Read two equal-length arrays and print their mean squared error.",
sampleInput: "10 15 20 | 12 14 19",
expected: "2.0",
hint: "Convert both lists to arrays, square their difference and take the mean.",
starter: "import numpy as np\n# Create actual and predicted arrays\n",
solution: "import numpy as np\nactual = np.array(list(map(float, input().split())))\npredicted = np.array(list(map(float, input().split())))\nmse = np.mean((actual - predicted) ** 2)\nprint(round(mse, 2))",
required: [
["numpy", "np"],
["array("],
["** 2", "np.square("],
["mean("],
["print("]
]
},
{
title: "Perform One Gradient Update",
description: "For one sample, update weight and bias using squared-error gradients.",
sampleInput: "x=2, y=5, w=0, b=0, rate=0.1",
expected: "w=2.0, b=1.0",
hint: "prediction = wx+b, error = prediction-y, dw = 2*error*x and db = 2*error.",
starter: "x, y = 2.0, 5.0\nweight = bias = 0.0\nrate = 0.1\n",
solution: "x, y = 2.0, 5.0\nweight = bias = 0.0\nrate = 0.1\nprediction = weight * x + bias\nerror = prediction - y\ndw = 2 * error * x\ndb = 2 * error\nweight -= rate * dw\nbias -= rate * db\nprint(round(weight, 2), round(bias, 2))",
required: [
["prediction"],
["error"],
["dw"],
["db"],
["weight -="],
["bias -="],
["print("]
]
},
{
title: "Fit OLS Slope and Intercept",
description: "Compute the best-fit line for x=[1,2,3] and y=[3,5,7] without sklearn.",
sampleInput: "[1, 2, 3] | [3, 5, 7]",
expected: "2.0 1.0",
hint: "Use centred cross-products for slope, then b = y_mean - w*x_mean.",
starter: "import numpy as np\nx = np.array([1., 2., 3.])\ny = np.array([3., 5., 7.])\n",
solution: "import numpy as np\nx = np.array([1., 2., 3.])\ny = np.array([3., 5., 7.])\nx_mean, y_mean = x.mean(), y.mean()\nweight = np.sum((x-x_mean)*(y-y_mean)) / np.sum((x-x_mean)**2)\nbias = y_mean - weight*x_mean\nprint(round(weight, 2), round(bias, 2))",
required: [
["mean("],
["sum("],
["x-x_mean", "x - x_mean"],
["y-y_mean", "y - y_mean"],
["bias"],
["print("]
]
},
{
title: "Build a Polynomial Ridge Pipeline",
description: "Create a leakage-safe degree-2 polynomial regression pipeline with scaling and Ridge.",
sampleInput: "X_train, y_train",
expected: "Fitted Pipeline",
hint: "Put PolynomialFeatures, StandardScaler and Ridge in one Pipeline, then fit it on training data.",
starter: "from sklearn.pipeline import Pipeline\n# Add the required steps\n",
solution: "from sklearn.pipeline import Pipeline\nfrom sklearn.preprocessing import PolynomialFeatures, StandardScaler\nfrom sklearn.linear_model import Ridge\nmodel = Pipeline([\n    (\"poly\", PolynomialFeatures(degree=2, include_bias=False)),\n    (\"scale\", StandardScaler()),\n    (\"ridge\", Ridge(alpha=1.0))\n])\nmodel.fit(X_train, y_train)",
required: [
["pipeline("],
["polynomialfeatures("],
["standardscaler("],
["ridge("],
[".fit("]
]
}
];

let saved = {};

try {
saved = JSON.parse(
window.localStorage.getItem(LEVEL_PROGRESS_KEY) || "{}"
);
} catch (error) {
saved = {};
}

const solved = new Set(
Array.isArray(saved.solvedProblems)
? saved.solvedProblems
: []
);

const scores =
saved.problemScores &&
typeof saved.problemScores === "object"
? saved.problemScores
: {};

const revealed = new Set();

function saveProgress() {
let current = {};

try {
current = JSON.parse(
window.localStorage.getItem(LEVEL_PROGRESS_KEY) || "{}"
);
} catch (error) {
current = {};
}

current.solvedProblems = Array.from(solved);
current.problemScores = scores;

window.localStorage.setItem(
LEVEL_PROGRESS_KEY,
JSON.stringify(current)
);
}

function updateSummary() {
const totalScore = Object.values(scores).reduce(
function (sum, score) {
return sum + Number(score || 0);
},
0
);

byId("problemSolvedCount").textContent =
solved.size + " / " + problems.length;

byId("problemScore").textContent =
totalScore + " / " + problems.length * 100;

byId("problemProgressBar").style.width =
(solved.size / problems.length) * 100 + "%";
}

list.innerHTML = problems.map(function (problem, index) {
const number = index + 1;

return '<article class="aiml-problem-card' +
(solved.has(index) ? " is-solved" : "") +
'" data-problem="' + index + '">' +

'<div class="aiml-problem-head">' +
'<span class="aiml-problem-number">' +
String(number).padStart(2, "0") +
"</span><div><h3>" +
number + ". " + escapeHtml(problem.title) +
"</h3><p>" +
escapeHtml(problem.description) +
"</p></div></div>" +

'<div class="aiml-problem-data">' +
'<span><strong>Sample input:</strong> ' +
escapeHtml(problem.sampleInput) +
"</span><span><strong>Expected output:</strong> <code>" +
escapeHtml(problem.expected) +
"</code></span></div>" +

'<div class="aiml-problem-actions">' +
'<button type="button" class="primary" data-action="workspace">💻 Solve It Yourself</button>' +
'<button type="button" class="hint" data-action="hint">Hint</button>' +
'<button type="button" data-action="solution">Show Program</button>' +
"</div>" +

'<div class="aiml-problem-reveal" data-panel="hint" hidden>' +
"<strong>Hint</strong><p>" +
escapeHtml(problem.hint) +
"</p></div>" +

'<div class="aiml-problem-reveal" data-panel="solution" hidden>' +
"<strong>Model program</strong><pre><code>" +
escapeHtml(problem.solution) +
"</code></pre></div>" +

'<div class="aiml-workspace" data-panel="workspace" hidden>' +
'<label for="problemCode' + index +
'">Your Python code</label>' +

'<textarea id="problemCode' + index +
'" spellcheck="false">' +
escapeHtml(problem.starter) +
"</textarea>" +

'<div class="aiml-workspace-row">' +
'<button type="button" data-action="check">Check Answer</button>' +
'<button type="button" data-action="reset">Reset</button>' +
'<span class="aiml-check-result" data-result>' +
"Write your solution, then check its structure." +
"</span></div></div></article>";
}).join("");

function togglePanel(
card,
panelName,
button,
openLabel,
closeLabel
) {
const panel = card.querySelector(
'[data-panel="' + panelName + '"]'
);

if (!panel) return;

const opening = panel.hidden;
panel.hidden = !opening;
button.textContent = opening ? closeLabel : openLabel;
}

list.addEventListener("click", function (event) {
const button = event.target.closest(
"button[data-action]"
);

if (!button) return;

const card = button.closest(".aiml-problem-card");
const problemIndex = Number(card.dataset.problem);
const problem = problems[problemIndex];
const action = button.dataset.action;

if (action === "workspace") {
togglePanel(
card,
"workspace",
button,
"💻 Solve It Yourself",
"✕ Close Workspace"
);
return;
}

if (action === "hint") {
togglePanel(
card,
"hint",
button,
"Hint",
"Hide Hint"
);
return;
}

if (action === "solution") {
revealed.add(problemIndex);

togglePanel(
card,
"solution",
button,
"Show Program",
"Hide Program"
);
return;
}

const textarea = card.querySelector("textarea");
const result = card.querySelector("[data-result]");

if (action === "reset") {
textarea.value = problem.starter;
result.className = "aiml-check-result";
result.textContent =
"Workspace reset. Try the problem again.";
return;
}

if (action === "check") {
const normalized = textarea.value
.toLowerCase()
.replace(/\s+/g, " ");

const missing = problem.required.filter(
function (alternatives) {
return !alternatives.some(function (token) {
return normalized.includes(token.toLowerCase());
});
}
);

if (
!textarea.value.trim() ||
textarea.value.trim() === problem.starter.trim()
) {
result.className = "aiml-check-result error";
result.textContent =
"Add your solution before checking.";
return;
}

if (missing.length > 0) {
result.className = "aiml-check-result error";
result.textContent =
"Not complete yet. Recheck the required formula, pipeline steps and output.";
return;
}

const score = revealed.has(problemIndex) ? 60 : 100;

solved.add(problemIndex);

scores[problemIndex] = Math.max(
Number(scores[problemIndex] || 0),
score
);

card.classList.add("is-solved");
result.className = "aiml-check-result success";

result.textContent = revealed.has(problemIndex)
? "Logic recognized — completed after viewing the model program. Score: 60/100."
: "Logic recognized — solved independently. Score: 100/100.";

saveProgress();
updateSummary();
}
});

updateSummary();
}

function initQuiz() {
const container = byId("quizQuestions");
if (!container) return;

const questions = [
{
question: "What does a positive residual y − ŷ mean?",
options: [
"The model overpredicted",
"The model underpredicted",
"The prediction is exact",
"The feature is missing"
],
answer: 1,
explanation: "When y is greater than ŷ, the actual value lies above the prediction, so the model underpredicted."
},
{
question: "Which metric penalizes large errors more strongly?",
options: [
"MAE",
"Median error",
"MSE",
"Count of predictions"
],
answer: 2,
explanation: "Squaring residuals makes large absolute errors contribute disproportionately to MSE."
},
{
question: "Why can test R² be negative?",
options: [
"R² is always negative",
"The model performs worse than predicting the reference mean",
"The target is continuous",
"The features are scaled"
],
answer: 1,
explanation: "R² compares residual variation with a mean-prediction baseline; poor unseen predictions can produce a value below zero."
},
{
question: "What direction does gradient descent move?",
options: [
"Along the positive gradient",
"Opposite the gradient",
"Randomly",
"Toward larger loss"
],
answer: 1,
explanation: "The gradient points toward steepest increase, so subtracting it moves parameters downhill."
},
{
question: "What may happen when the learning rate is too large?",
options: [
"Guaranteed convergence",
"Loss may oscillate or diverge",
"All coefficients become causal",
"MSE becomes MAE"
],
answer: 1,
explanation: "Oversized steps can repeatedly jump across the minimum or cause the loss to explode."
},
{
question: "Which regularizer can produce exactly zero coefficients?",
options: ["Ridge", "Lasso", "OLS only", "RMSE"],
answer: 1,
explanation: "The L1 penalty used by Lasso can drive some learned coefficients exactly to zero."
},
{
question: "Why is polynomial regression still called linear regression?",
options: [
"Its plot must be straight",
"It is linear in its learned coefficients",
"It has no intercept",
"It uses only one feature"
],
answer: 1,
explanation: "Polynomial feature values may be nonlinear in x, while the model remains a weighted linear combination of coefficients."
},
{
question: "Where should polynomial degree and regularization strength be chosen?",
options: [
"Using final test results",
"Inside training cross-validation",
"After deployment only",
"From the largest coefficient"
],
answer: 1,
explanation: "Model choices belong inside cross-validation; the held-out test set should provide one final generalization estimate."
}
];

container.innerHTML = questions.map(
function (item, questionIndex) {
return '<article class="aiml-quiz-question" data-quiz-question="' +
questionIndex + '"><strong>' +
(questionIndex + 1) + ". " +
escapeHtml(item.question) +
'</strong><div class="aiml-quiz-options">' +

item.options.map(function (option, optionIndex) {
const inputId =
"quiz-" + questionIndex + "-" + optionIndex;

return '<label class="aiml-quiz-option" for="' +
inputId + '"><input type="radio" id="' +
inputId + '" name="quiz-' +
questionIndex + '" value="' +
optionIndex + '"><span>' +
String.fromCharCode(65 + optionIndex) +
". " + escapeHtml(option) +
"</span></label>";
}).join("") +

'</div><div class="aiml-quiz-explanation" hidden></div></article>';
}
).join("");

container.addEventListener("change", function (event) {
if (!event.target.matches('input[type="radio"]')) return;

event.target
.closest(".aiml-quiz-question")
.querySelectorAll(".aiml-quiz-option")
.forEach(function (option) {
option.classList.toggle(
"is-selected",
option.contains(event.target)
);
});
});

byId("checkQuiz").addEventListener("click", function () {
let correct = 0;
let answered = 0;

questions.forEach(function (item, questionIndex) {
const question = container.querySelector(
'[data-quiz-question="' + questionIndex + '"]'
);

const selected = question.querySelector(
'input[type="radio"]:checked'
);

const options = Array.from(
question.querySelectorAll(".aiml-quiz-option")
);

const explanation = question.querySelector(
".aiml-quiz-explanation"
);

options.forEach(function (option, optionIndex) {
option.classList.remove("is-correct", "is-wrong");

if (optionIndex === item.answer) {
option.classList.add("is-correct");
}
});

if (selected) {
const selectedIndex = Number(selected.value);
answered += 1;

if (selectedIndex === item.answer) {
correct += 1;
} else {
options[selectedIndex].classList.add("is-wrong");
}
}

explanation.hidden = false;

explanation.innerHTML =
"<strong>" +
(selected
? "Your answer: " +
escapeHtml(item.options[Number(selected.value)])
: "Your answer: Not attempted") +
"</strong><br><strong>Correct answer: " +
escapeHtml(item.options[item.answer]) +
"</strong><br>" +
escapeHtml(item.explanation);
});

byId("quizScore").textContent =
correct + " / " + questions.length + " correct" +
(answered < questions.length
? " • " + (questions.length - answered) +
" not attempted"
: "");

let progress = {};

try {
progress = JSON.parse(
window.localStorage.getItem(LEVEL_PROGRESS_KEY) || "{}"
);
} catch (error) {
progress = {};
}

progress.bestQuizScore = Math.max(
Number(progress.bestQuizScore || 0),
correct
);

window.localStorage.setItem(
LEVEL_PROGRESS_KEY,
JSON.stringify(progress)
);
});

byId("resetQuiz").addEventListener("click", function () {
container.querySelectorAll('input[type="radio"]')
.forEach(function (input) {
input.checked = false;
});

container.querySelectorAll(".aiml-quiz-option")
.forEach(function (option) {
option.classList.remove(
"is-selected",
"is-correct",
"is-wrong"
);
});

container.querySelectorAll(".aiml-quiz-explanation")
.forEach(function (explanation) {
explanation.hidden = true;
explanation.textContent = "";
});

byId("quizScore").textContent = "Not checked yet";
});
}

function initInterviewQuestions() {
const container = byId("interviewList");
if (!container) return;

const questions = [
{
question: "What is the difference between a prediction, residual and loss?",
answer: "A prediction is the model output ŷ. A residual is an observation-level difference such as y−ŷ. A loss converts one or more errors into an optimization objective, such as mean squared error."
},
{
question: "Why does linear regression use squared errors?",
answer: "Squaring prevents sign cancellation, penalizes large errors, gives a smooth differentiable objective and leads to convenient closed-form and gradient-based optimization. It is also the maximum-likelihood objective under Gaussian error assumptions."
},
{
question: "What do slope and intercept mean?",
answer: "A slope is the expected change in prediction for one unit increase in its feature while other modeled features are fixed. The intercept is the prediction when all features equal zero, which may lie outside the meaningful data range."
},
{
question: "Derive the MSE gradients for simple linear regression.",
answer: "For J=(1/n)Σ(wxᵢ+b−yᵢ)², apply the chain rule: ∂J/∂w=(2/n)Σ(wxᵢ+b−yᵢ)xᵢ and ∂J/∂b=(2/n)Σ(wxᵢ+b−yᵢ)."
},
{
question: "Closed-form solution or gradient descent—which should you use?",
answer: "A stable least-squares solver is convenient for ordinary linear regression with manageable dimensions. Gradient methods are valuable for very large, streaming or more complex objectives. Avoid explicitly inverting XᵀX; use QR, SVD or a library solver."
},
{
question: "What are the main linear regression assumptions?",
answer: "For classical inference: correct linear mean structure, independent errors, constant error variance, limited multicollinearity and approximately normal residuals for small-sample tests and intervals. Prediction can still be useful when some inference assumptions fail, but diagnostics and validation remain essential."
},
{
question: "How do you detect and handle multicollinearity?",
answer: "Inspect domain redundancy, correlations, condition numbers or VIF. It inflates coefficient uncertainty and makes individual effects unstable. Remove redundant variables, combine them, collect more data or use Ridge; predictive accuracy may still remain strong."
},
{
question: "Compare Ridge, Lasso and Elastic Net.",
answer: "Ridge uses L2 shrinkage and is stable with correlated predictors. Lasso uses L1 and can select a sparse set of features. Elastic Net combines both and can retain groups of correlated predictors. Scale features and tune strengths inside cross-validation."
},
{
question: "Why can polynomial regression overfit?",
answer: "Higher degrees create many flexible, correlated terms that can follow noise and behave wildly outside the observed range. Choose degree and regularization with cross-validation, inspect learning curves and avoid unsupported extrapolation."
},
{
question: "How would you productionize a regression model?",
answer: "Define a leakage-safe prediction cutoff, keep preprocessing and the estimator in one versioned pipeline, validate schemas, report a relevant metric against baseline, inspect residual and subgroup errors, quantify uncertainty where required, and monitor feature drift and real outcome error."
}
];

container.innerHTML = questions.map(function (item, index) {
return '<article class="aiml-interview-item">' +
'<div class="aiml-interview-question">' +
"<span>" + (index + 1) + ".</span><strong>" +
escapeHtml(item.question) +
'</strong><button type="button" aria-expanded="false">' +
"Show Answer</button></div>" +
'<div class="aiml-interview-answer" hidden>' +
escapeHtml(item.answer) +
"</div></article>";
}).join("");

container.addEventListener("click", function (event) {
const button = event.target.closest("button");
if (!button) return;

const answer = button
.closest(".aiml-interview-item")
.querySelector(".aiml-interview-answer");

const opening = answer.hidden;
answer.hidden = !opening;

button.textContent =
opening ? "Hide Answer" : "Show Answer";

button.setAttribute(
"aria-expanded",
String(opening)
);
});
}

function initSmoothLocalLinks() {
document.addEventListener("click", function (event) {
const link = event.target.closest('a[href^="#"]');

if (
!link ||
link.getAttribute("href") === "#"
) {
return;
}

const target = document.querySelector(
link.getAttribute("href")
);

if (!target) return;

event.preventDefault();

target.scrollIntoView({
behavior: "smooth",
block: "start"
});
});
}

function initLevelSix() {
initFitVisualizer();
initProgramTracer();
initProgrammingProblems();
initQuiz();
initInterviewQuestions();
initSmoothLocalLinks();
}

if (document.readyState === "loading") {
document.addEventListener(
"DOMContentLoaded",
initLevelSix
);
} else {
initLevelSix();
}
}());
