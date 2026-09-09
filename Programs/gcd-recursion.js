"use strict";

(function () {
  const sourceLines = [
    "#include <stdio.h>",
    "",
    "int gcd(int a, int b)",
    "{",
    "    if (b == 0)",
    "        return a;",
    "",
    "    return gcd(b, a % b);",
    "}",
    "",
    "int main(void)",
    "{",
    "    int first, second, result;",
    "",
    "    printf(\"Enter two positive integers: \" );",
    "    scanf(\"%d %d\", &first, &second);",
    "",
    "    result = gcd(first, second);",
    "    printf(\"GCD of %d and %d is %d.\\n\", first, second, result);",
    "",
    "    return 0;",
    "}"
  ];

  const source = sourceLines.join("\n");
  const sourceCode = document.querySelector("#sourceCode");
  const debugSource = document.querySelector("#debugSource");
  const firstInput = document.querySelector("#firstNumber");
  const secondInput = document.querySelector("#secondNumber");
  const error = document.querySelector("#inputError");
  const stepMessage = document.querySelector("#stepMessage");
  const variableBody = document.querySelector("#variableBody");
  const callFlow = document.querySelector("#callFlow");
  const output = document.querySelector("#debugOutput");
  const progress = document.querySelector("#debugProgress");
  const progressText = document.querySelector("#progressText");
  const startButton = document.querySelector("#startDebug");
  const previousButton = document.querySelector("#previousStep");
  const nextButton = document.querySelector("#nextStep");
  const autoButton = document.querySelector("#autoDebug");
  const pauseButton = document.querySelector("#pauseDebug");
  const resetButton = document.querySelector("#resetDebug");
  let frames = [];
  let frameIndex = -1;
  let timer = null;

  if (!sourceCode || !debugSource) return;

  sourceCode.textContent = source;

  sourceLines.forEach((line, index) => {
    const row = document.createElement("div");
    row.className = "code-line";
    row.dataset.line = String(index + 1);

    const number = document.createElement("span");
    number.className = "line-number";
    number.textContent = String(index + 1);

    const text = document.createElement("span");
    text.textContent = line || " ";
    row.append(number, text);
    debugSource.append(row);
  });

  function frame(line, message, variables, stack, terminalOutput) {
    return { line, message, variables, stack: [...stack], output: terminalOutput };
  }

  function buildTrace(first, second) {
    const trace = [];
    const stack = ["main()"];
    let terminalOutput = "";

    trace.push(frame(13, "Declare first, second and result in main().", [
      ["main", "first", "not assigned"],
      ["main", "second", "not assigned"],
      ["main", "result", "not assigned"]
    ], stack, terminalOutput));

    terminalOutput = "Enter two positive integers: ";
    trace.push(frame(15, "Display the input prompt.", [], stack, terminalOutput));
    trace.push(frame(16, `Read first = ${first} and second = ${second}.`, [
      ["main", "first", first],
      ["main", "second", second]
    ], stack, `${terminalOutput}${first} ${second}`));

    trace.push(frame(18, `Call gcd(${first}, ${second}).`, [
      ["main", "first", first],
      ["main", "second", second]
    ], stack, `${terminalOutput}${first} ${second}`));

    const calls = [];
    let a = first;
    let b = second;

    while (true) {
      const label = `gcd(${a}, ${b})`;
      stack.push(label);
      calls.push({ a, b, label });

      trace.push(frame(3, `Enter ${label}.`, [
        [label, "a", a],
        [label, "b", b]
      ], stack, `${terminalOutput}${first} ${second}`));

      trace.push(frame(5, `Check whether b is zero. Here b = ${b}, so the condition is ${b === 0 ? "true" : "false"}.`, [
        [label, "a", a],
        [label, "b", b]
      ], stack, `${terminalOutput}${first} ${second}`));

      if (b === 0) {
        trace.push(frame(6, `Base case reached. Return a = ${a}.`, [
          [label, "a", a],
          [label, "b", b],
          [label, "return", a]
        ], stack, `${terminalOutput}${first} ${second}`));
        break;
      }

      const remainder = a % b;
      trace.push(frame(8, `${label} calls gcd(${b}, ${remainder}) because ${a} % ${b} = ${remainder}.`, [
        [label, "a", a],
        [label, "b", b],
        [label, "a % b", remainder]
      ], stack, `${terminalOutput}${first} ${second}`));

      a = b;
      b = remainder;
    }

    const result = a;
    while (calls.length > 1) {
      const completed = calls.pop();
      stack.pop();
      const caller = calls[calls.length - 1];
      trace.push(frame(8, `${completed.label} returns ${result}; ${caller.label} now returns the same value.`, [
        [caller.label, "return", result]
      ], stack, `${terminalOutput}${first} ${second}`));
    }

    stack.pop();
    trace.push(frame(18, `Store the returned GCD ${result} in result.`, [
      ["main", "first", first],
      ["main", "second", second],
      ["main", "result", result]
    ], stack, `${terminalOutput}${first} ${second}`));

    terminalOutput = `Enter two positive integers: ${first} ${second}\nGCD of ${first} and ${second} is ${result}.`;
    trace.push(frame(19, "Print the final result.", [
      ["main", "first", first],
      ["main", "second", second],
      ["main", "result", result]
    ], stack, terminalOutput));

    trace.push(frame(21, "Return 0. The program has finished successfully.", [
      ["main", "return", 0]
    ], stack, terminalOutput));

    return trace;
  }

  function readInputs() {
    const first = Number(firstInput.value);
    const second = Number(secondInput.value);
    const valid = Number.isInteger(first) && Number.isInteger(second) && first > 0 && second > 0;

    error.hidden = valid;
    error.textContent = valid ? "" : "Enter two positive whole numbers before starting.";
    return valid ? { first, second } : null;
  }

  function stopAuto() {
    if (timer !== null) {
      window.clearInterval(timer);
      timer = null;
    }
    autoButton.disabled = frames.length === 0 || frameIndex >= frames.length - 1;
    pauseButton.disabled = true;
  }

  function updateButtons() {
    const started = frames.length > 0 && frameIndex >= 0;
    previousButton.disabled = !started || frameIndex === 0;
    nextButton.disabled = !started || frameIndex >= frames.length - 1;
    autoButton.disabled = !started || frameIndex >= frames.length - 1 || timer !== null;
    pauseButton.disabled = timer === null;
  }

  function renderVariables(variables) {
    variableBody.replaceChildren();
    if (!variables.length) {
      const row = document.createElement("tr");
      const cell = document.createElement("td");
      cell.colSpan = 3;
      cell.textContent = "No value changed in this step";
      row.append(cell);
      variableBody.append(row);
      return;
    }

    variables.forEach(([scope, name, value]) => {
      const row = document.createElement("tr");
      [scope, name, value].forEach((entry) => {
        const cell = document.createElement("td");
        cell.textContent = String(entry);
        row.append(cell);
      });
      variableBody.append(row);
    });
  }

  function renderStack(stack) {
    callFlow.replaceChildren();
    const displayStack = stack.length ? stack : ["empty"];
    displayStack.forEach((call, index) => {
      const chip = document.createElement("span");
      chip.className = "call-chip";
      chip.textContent = call;
      callFlow.append(chip);
      if (index < displayStack.length - 1) {
        const arrow = document.createElement("span");
        arrow.textContent = "→";
        arrow.setAttribute("aria-hidden", "true");
        callFlow.append(arrow);
      }
    });
  }

  function showFrame(index) {
    if (!frames[index]) return;
    frameIndex = index;
    const current = frames[index];

    debugSource.querySelectorAll(".code-line").forEach((line) => {
      line.classList.toggle("is-active", Number(line.dataset.line) === current.line);
    });

    const activeLine = debugSource.querySelector(".code-line.is-active");
    activeLine?.scrollIntoView({ block: "center", behavior: "smooth" });

    stepMessage.textContent = current.message;
    renderVariables(current.variables);
    renderStack(current.stack);
    output.textContent = current.output || "No output yet";
    progress.max = frames.length;
    progress.value = index + 1;
    progressText.textContent = `Step ${index + 1} of ${frames.length}`;

    if (index >= frames.length - 1) stopAuto();
    updateButtons();
  }

  function start() {
    stopAuto();
    const values = readInputs();
    if (!values) return;
    frames = buildTrace(values.first, values.second);
    showFrame(0);
  }

  function reset() {
    stopAuto();
    frames = [];
    frameIndex = -1;
    debugSource.querySelectorAll(".code-line").forEach((line) => line.classList.remove("is-active"));
    stepMessage.textContent = "Enter two values and select Start.";
    variableBody.innerHTML = "<tr><td colspan=\"3\">Not started</td></tr>";
    callFlow.innerHTML = "<span class=\"call-chip\">empty</span>";
    output.textContent = "Waiting to run…";
    progress.max = 1;
    progress.value = 0;
    progressText.textContent = "Step 0 of 0";
    error.hidden = true;
    updateButtons();
  }

  function notify(message) {
    const toast = document.querySelector("#toast");
    toast.textContent = message;
    toast.hidden = false;
    window.clearTimeout(notify.timeout);
    notify.timeout = window.setTimeout(() => { toast.hidden = true; }, 2600);
  }

  async function copySource(message) {
    try {
      await navigator.clipboard.writeText(source);
      notify(message);
      return true;
    } catch {
      notify("Copy was blocked. Select the code and copy it manually.");
      return false;
    }
  }

  function stageSourceForCompiler() {
    try {
      localStorage.setItem("codebhavya-compiler:incoming-program", JSON.stringify({
        language: "c",
        source,
        stdin: "",
        createdAt: Date.now()
      }));
      return true;
    } catch {
      return false;
    }
  }

  document.querySelector("#copyCode").addEventListener("click", () => {
    copySource("Program copied.");
  });

  document.querySelector("#copyOpenCompiler").addEventListener("click", async (event) => {
    event.preventDefault();
    const destination = event.currentTarget.href;
    const staged = stageSourceForCompiler();
    await copySource(staged
      ? "Program loaded for the compiler."
      : "Program copied. Paste it into the compiler.");
    window.setTimeout(() => { window.location.href = destination; }, 180);
  });

  startButton.addEventListener("click", start);
  previousButton.addEventListener("click", () => {
    stopAuto();
    showFrame(Math.max(0, frameIndex - 1));
  });
  nextButton.addEventListener("click", () => showFrame(Math.min(frames.length - 1, frameIndex + 1)));
  autoButton.addEventListener("click", () => {
    if (!frames.length || frameIndex >= frames.length - 1 || timer !== null) return;
    timer = window.setInterval(() => showFrame(frameIndex + 1), 900);
    updateButtons();
  });
  pauseButton.addEventListener("click", stopAuto);
  resetButton.addEventListener("click", reset);
})();
