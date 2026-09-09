"use strict";

(function () {
  const configNode = document.querySelector("#programConfig");
  if (!configNode) return;

  const config = JSON.parse(configNode.textContent);
  const source = config.sourceLines.join("\n");
  const sourceCode = document.querySelector("#sourceCode");
  const tourSource = document.querySelector("#tourSource");
  const tourMessage = document.querySelector("#tourMessage");
  const tourLine = document.querySelector("#tourLine");
  const tourOutput = document.querySelector("#tourOutput");
  const progress = document.querySelector("#tourProgress");
  const progressText = document.querySelector("#tourProgressText");
  const startButton = document.querySelector("#startTour");
  const previousButton = document.querySelector("#previousTourStep");
  const nextButton = document.querySelector("#nextTourStep");
  const autoButton = document.querySelector("#autoTour");
  const pauseButton = document.querySelector("#pauseTour");
  const resetButton = document.querySelector("#resetTour");
  const executableLines = [];
  let currentStep = -1;
  let timer = null;

  function closeNavigationMenus(except) {
    document.querySelectorAll(".nav-dropdown[open], .mobile-nav[open]").forEach((menu) => {
      if (menu !== except) menu.removeAttribute("open");
    });
  }

  document.querySelectorAll(".nav-dropdown, .mobile-nav").forEach((menu) => {
    menu.addEventListener("toggle", () => {
      if (menu.open) closeNavigationMenus(menu);
    });
  });

  document.addEventListener("click", (event) => {
    if (!event.target.closest(".nav-dropdown, .mobile-nav")) closeNavigationMenus();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeNavigationMenus();
  });

  function notify(message) {
    const toast = document.querySelector("#toast");
    toast.textContent = message;
    toast.hidden = false;
    window.clearTimeout(notify.timeout);
    notify.timeout = window.setTimeout(() => { toast.hidden = true; }, 2400);
  }

  async function copyText(value, message) {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      const helper = document.createElement("textarea");
      helper.value = value;
      helper.setAttribute("readonly", "");
      helper.style.position = "fixed";
      helper.style.opacity = "0";
      document.body.append(helper);
      helper.select();
      document.execCommand("copy");
      helper.remove();
    }
    notify(message);
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

  function downloadSource() {
    const blob = new Blob([source], { type: "text/x-c;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = config.fileName;
    document.body.append(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    notify(`${config.fileName} downloaded.`);
  }

  function explainLine(line) {
    const trimmed = line.trim();
    if (trimmed.startsWith("#include")) return "The preprocessor includes declarations from a standard C header.";
    if (/^(?:int|void|long|double|float|char|unsigned|struct)\s+\w+\s*\([^;]*\)$/.test(trimmed)) return "This line begins a function definition and declares its parameters and return type.";
    if (/\b(?:scanf|fgets|fgetc)\s*\(/.test(trimmed)) return "This statement reads data. Check that the entered values match the expected type and order.";
    if (/\b(?:printf|puts|putchar)\s*\(/.test(trimmed)) return "This statement formats and writes information to the output.";
    if (/^if\s*\(/.test(trimmed)) return "This condition decides whether the following branch should execute.";
    if (/^else\b/.test(trimmed)) return "This alternate branch runs when the preceding condition is false.";
    if (/^(?:for|while)\s*\(/.test(trimmed) || /^do\b/.test(trimmed)) return "This loop controls repeated execution. Watch its condition and update carefully.";
    if (/^return\b/.test(trimmed)) return "The function returns this value and finishes its current call.";
    if (/^(?:break|continue)\b/.test(trimmed)) return "This statement changes the normal flow of the surrounding loop.";
    if (/\b(?:malloc|realloc|calloc)\s*\(/.test(trimmed)) return "This statement requests memory at runtime; always verify that allocation succeeded.";
    if (/\bfree\s*\(/.test(trimmed)) return "This releases dynamically allocated memory after its final use.";
    if (/\b(?:fopen|fclose|fputs|fputc)\s*\(/.test(trimmed)) return "This statement performs a file operation; check both the mode and error handling.";
    if (/^(?:int|long|double|float|char|unsigned|FILE|struct)\b/.test(trimmed)) return "This line declares the variables or storage used by the program.";
    if (/=/.test(trimmed)) return "This statement calculates or assigns a value. Inspect both sides of the assignment.";
    if (trimmed === "{" || trimmed === "}") return "This brace marks the beginning or end of a C block.";
    return "Read this statement in context and identify how it changes the program's control flow or data.";
  }

  function stopAuto() {
    if (timer !== null) {
      window.clearInterval(timer);
      timer = null;
    }
    updateButtons();
  }

  function updateButtons() {
    const started = currentStep >= 0;
    const atEnd = started && currentStep >= executableLines.length - 1;
    startButton.disabled = started;
    previousButton.disabled = !started || currentStep === 0 || timer !== null;
    nextButton.disabled = !started || atEnd || timer !== null;
    autoButton.disabled = !started || atEnd || timer !== null;
    pauseButton.disabled = timer === null;
  }

  function showStep(index) {
    if (index < 0 || index >= executableLines.length) return;
    currentStep = index;
    tourSource.querySelectorAll(".code-line").forEach((line) => line.classList.remove("is-active"));
    const active = tourSource.querySelector(`[data-step="${index}"]`);
    active?.classList.add("is-active");
    active?.scrollIntoView({ block: "nearest", behavior: "smooth" });

    const item = executableLines[index];
    tourMessage.textContent = explainLine(item.text);
    tourLine.textContent = `Line ${item.lineNumber}: ${item.text.trim() || "blank line"}`;
    progress.max = executableLines.length;
    progress.value = index + 1;
    progressText.textContent = `Step ${index + 1} of ${executableLines.length}`;

    if (index === executableLines.length - 1) stopAuto();
    updateButtons();
  }

  function startTour() {
    stopAuto();
    showStep(0);
  }

  function resetTour() {
    stopAuto();
    currentStep = -1;
    tourSource.querySelectorAll(".code-line").forEach((line) => line.classList.remove("is-active"));
    tourMessage.textContent = "Select Start to walk through the important lines.";
    tourLine.textContent = "No line selected";
    progress.max = executableLines.length || 1;
    progress.value = 0;
    progressText.textContent = `Step 0 of ${executableLines.length}`;
    updateButtons();
  }

  sourceCode.textContent = source;
  config.sourceLines.forEach((line, lineIndex) => {
    const row = document.createElement("div");
    row.className = "code-line";

    const number = document.createElement("span");
    number.className = "line-number";
    number.textContent = String(lineIndex + 1);

    const text = document.createElement("span");
    text.textContent = line || " ";
    row.append(number, text);

    if (line.trim()) {
      const stepIndex = executableLines.length;
      row.dataset.step = String(stepIndex);
      executableLines.push({ lineNumber: lineIndex + 1, text: line });
    }
    tourSource.append(row);
  });

  tourOutput.textContent = config.sampleOutput;
  document.querySelector("#copyCode").addEventListener("click", () => copyText(source, "Program copied."));
  document.querySelector("#downloadCode").addEventListener("click", downloadSource);
  document.querySelector("#copyOpenCompiler").addEventListener("click", async (event) => {
    event.preventDefault();
    const destination = event.currentTarget.href;
    const staged = stageSourceForCompiler();
    await copyText(source, staged ? "Program loaded for the compiler." : "Program copied. Paste it into the compiler.");
    window.setTimeout(() => { window.location.href = destination; }, 180);
  });

  startButton.addEventListener("click", startTour);
  previousButton.addEventListener("click", () => { stopAuto(); showStep(currentStep - 1); });
  nextButton.addEventListener("click", () => showStep(currentStep + 1));
  autoButton.addEventListener("click", () => {
    if (currentStep < 0 || currentStep >= executableLines.length - 1 || timer !== null) return;
    timer = window.setInterval(() => showStep(currentStep + 1), 850);
    updateButtons();
  });
  pauseButton.addEventListener("click", stopAuto);
  resetButton.addEventListener("click", resetTour);
  resetTour();
})();
