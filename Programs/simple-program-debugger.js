"use strict";

(function () {
  const configNode = document.querySelector("#programConfig");
  if (!configNode) return;

  const config = JSON.parse(configNode.textContent);
  const source = config.sourceLines.join("\n");
  const sourceCode = document.querySelector("#sourceCode");
  const debugSource = document.querySelector("#debugSource");
  const inputError = document.querySelector("#inputError");
  const stepMessage = document.querySelector("#stepMessage");
  const variableBody = document.querySelector("#variableBody");
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

  sourceCode.textContent = source;
  config.sourceLines.forEach((line, index) => {
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

  function f(line, message, variables, terminalOutput) {
    return { line, message, variables, output: terminalOutput };
  }

  const traceBuilders = {
    "c-hello-world": () => [
      f(3, "Execution enters the main() function.", [["main", "status", "running"]], ""),
      f(5, "printf() sends the text to the output window.", [["main", "text", "Hello, World!"]], "Hello, World!"),
      f(6, "Return 0 to indicate successful execution.", [["main", "return", 0]], "Hello, World!")
    ],

    "c-add-two-numbers": ({ first, second }) => {
      const sum = first + second;
      return [
        f(5, "Declare first, second and sum.", [["main", "first", "not assigned"], ["main", "second", "not assigned"], ["main", "sum", "not assigned"]], ""),
        f(6, "Display the input prompt.", [], "Enter two integers: "),
        f(7, `Read first = ${first} and second = ${second}.`, [["main", "first", first], ["main", "second", second]], `Enter two integers: ${first} ${second}`),
        f(8, `Calculate ${first} + ${second} and store ${sum} in sum.`, [["main", "first", first], ["main", "second", second], ["main", "sum", sum]], `Enter two integers: ${first} ${second}`),
        f(9, "Print the calculated sum.", [["main", "sum", sum]], `Enter two integers: ${first} ${second}\nSum = ${sum}`),
        f(10, "Return 0. The program has finished.", [["main", "return", 0]], `Enter two integers: ${first} ${second}\nSum = ${sum}`)
      ];
    },

    "c-swap-two-numbers": ({ first, second }) => [
      f(5, "Declare first, second and temp.", [["main", "first", "not assigned"], ["main", "second", "not assigned"], ["main", "temp", "not assigned"]], ""),
      f(6, "Display the input prompt.", [], "Enter two integers: "),
      f(7, `Read first = ${first} and second = ${second}.`, [["main", "first", first], ["main", "second", second]], `Enter two integers: ${first} ${second}`),
      f(8, `Copy first (${first}) into temp before overwriting first.`, [["main", "first", first], ["main", "second", second], ["main", "temp", first]], `Enter two integers: ${first} ${second}`),
      f(9, `Copy second (${second}) into first.`, [["main", "first", second], ["main", "second", second], ["main", "temp", first]], `Enter two integers: ${first} ${second}`),
      f(10, `Copy temp (${first}) into second.`, [["main", "first", second], ["main", "second", first], ["main", "temp", first]], `Enter two integers: ${first} ${second}`),
      f(11, "Print the swapped values.", [["main", "first", second], ["main", "second", first]], `Enter two integers: ${first} ${second}\nAfter swapping: ${second} ${first}`),
      f(12, "Return 0. The program has finished.", [["main", "return", 0]], `Enter two integers: ${first} ${second}\nAfter swapping: ${second} ${first}`)
    ],

    "c-even-or-odd": ({ number }) => {
      const isEven = number % 2 === 0;
      const result = isEven ? "even" : "odd";
      return [
        f(5, "Declare the number variable.", [["main", "number", "not assigned"]], ""),
        f(6, "Display the input prompt.", [], "Enter an integer: "),
        f(7, `Read number = ${number}.`, [["main", "number", number]], `Enter an integer: ${number}`),
        f(8, `Calculate ${number} % 2. The remainder is ${Math.abs(number % 2)}, so the condition is ${isEven}.`, [["main", "number", number], ["main", "number % 2", number % 2]], `Enter an integer: ${number}`),
        f(isEven ? 9 : 11, `The ${isEven ? "if" : "else"} branch prints that ${number} is ${result}.`, [["main", "result", result]], `Enter an integer: ${number}\n${number} is ${result}.`),
        f(13, "Return 0. The program has finished.", [["main", "return", 0]], `Enter an integer: ${number}\n${number} is ${result}.`)
      ];
    },

    "c-largest-of-three": ({ first, second, third }) => {
      let largest = first;
      const frames = [
        f(5, "Declare three inputs and largest.", [["main", "largest", "not assigned"]], ""),
        f(6, "Display the input prompt.", [], "Enter three integers: "),
        f(7, `Read ${first}, ${second} and ${third}.`, [["main", "first", first], ["main", "second", second], ["main", "third", third]], `Enter three integers: ${first} ${second} ${third}`),
        f(9, `Assume the first value ${first} is the largest.`, [["main", "largest", largest]], `Enter three integers: ${first} ${second} ${third}`)
      ];
      frames.push(f(10, `Check whether second (${second}) is greater than largest (${largest}).`, [["main", "second > largest", second > largest]], frames[2].output));
      if (second > largest) {
        largest = second;
        frames.push(f(11, `Update largest to ${largest}.`, [["main", "largest", largest]], frames[2].output));
      }
      frames.push(f(12, `Check whether third (${third}) is greater than largest (${largest}).`, [["main", "third > largest", third > largest]], frames[2].output));
      if (third > largest) {
        largest = third;
        frames.push(f(13, `Update largest to ${largest}.`, [["main", "largest", largest]], frames[2].output));
      }
      frames.push(f(14, "Print the final largest value.", [["main", "largest", largest]], `${frames[2].output}\nLargest = ${largest}`));
      frames.push(f(15, "Return 0. The program has finished.", [["main", "return", 0]], `${frames[2].output}\nLargest = ${largest}`));
      return frames;
    }
  };

  function readValues() {
    const values = {};
    let valid = true;
    document.querySelectorAll("[data-debug-input]").forEach((input) => {
      const value = Number(input.value);
      if (!Number.isInteger(value)) valid = false;
      values[input.dataset.debugInput] = value;
    });
    inputError.hidden = valid;
    inputError.textContent = valid ? "" : "Enter a whole number in every input box.";
    return valid ? values : null;
  }

  function stopAuto() {
    if (timer !== null) window.clearInterval(timer);
    timer = null;
    updateButtons();
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
    if (!variables.length) variables = [["main", "state", "unchanged"]];
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

  function showFrame(index) {
    if (!frames[index]) return;
    frameIndex = index;
    const current = frames[index];
    debugSource.querySelectorAll(".code-line").forEach((line) => {
      line.classList.toggle("is-active", Number(line.dataset.line) === current.line);
    });
    debugSource.querySelector(".code-line.is-active")?.scrollIntoView({ block: "center", behavior: "smooth" });
    stepMessage.textContent = current.message;
    renderVariables(current.variables);
    output.textContent = current.output || "No output yet";
    progress.max = frames.length;
    progress.value = index + 1;
    progressText.textContent = `Step ${index + 1} of ${frames.length}`;
    if (index >= frames.length - 1) stopAuto();
    updateButtons();
  }

  function start() {
    stopAuto();
    const values = readValues();
    if (!values) return;
    const builder = traceBuilders[config.id];
    frames = builder ? builder(values) : [];
    frameIndex = -1;
    if (frames.length) showFrame(0);
  }

  function reset() {
    stopAuto();
    frames = [];
    frameIndex = -1;
    debugSource.querySelectorAll(".code-line").forEach((line) => line.classList.remove("is-active"));
    stepMessage.textContent = "Select Start to trace this program.";
    variableBody.innerHTML = "<tr><td colspan=\"3\">Not started</td></tr>";
    output.textContent = "Waiting to run…";
    progress.max = 1;
    progress.value = 0;
    progressText.textContent = "Step 0 of 0";
    inputError.hidden = true;
    updateButtons();
  }

  function notify(message) {
    const toast = document.querySelector("#toast");
    toast.textContent = message;
    toast.hidden = false;
    window.clearTimeout(notify.timeout);
    notify.timeout = window.setTimeout(() => { toast.hidden = true; }, 2400);
  }

  async function copySource(message) {
    try {
      await navigator.clipboard.writeText(source);
      notify(message);
      return true;
    } catch {
      notify("Copy was blocked. Select and copy the code manually.");
      return false;
    }
  }

  document.querySelector("#copyCode").addEventListener("click", () => copySource("Program copied."));
  document.querySelector("#copyOpenCompiler").addEventListener("click", async (event) => {
    event.preventDefault();
    const destination = event.currentTarget.href;
    if (await copySource("Program copied. Paste it into the compiler.")) {
      window.setTimeout(() => { window.location.href = destination; }, 350);
    }
  });
  startButton.addEventListener("click", start);
  previousButton.addEventListener("click", () => { stopAuto(); showFrame(Math.max(0, frameIndex - 1)); });
  nextButton.addEventListener("click", () => showFrame(Math.min(frames.length - 1, frameIndex + 1)));
  autoButton.addEventListener("click", () => {
    if (!frames.length || frameIndex >= frames.length - 1 || timer !== null) return;
    timer = window.setInterval(() => showFrame(frameIndex + 1), 900);
    updateButtons();
  });
  pauseButton.addEventListener("click", stopAuto);
  resetButton.addEventListener("click", reset);
})();
