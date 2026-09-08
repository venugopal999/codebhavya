"use strict";

(() => {
  const PUBLIC_JUDGE0_ENDPOINT =
    "https://ce.judge0.com/submissions?base64_encoded=false&wait=true";

  const languages = {
    c: {
      label: "C program",
      fileName: "main.c",
      mode: "ace/mode/c_cpp",
      languageId: 103,
      starter: `#include <stdio.h>

int main(void) {
    printf("Hello, CodeBhavya!\\n");
    return 0;
}
`,
      input: ""
    },
    cpp: {
      label: "C++ program",
      fileName: "main.cpp",
      mode: "ace/mode/c_cpp",
      languageId: 105,
      starter: `#include <iostream>
using namespace std;

int main() {
    cout << "Hello, CodeBhavya!\\n";
    return 0;
}
`,
      input: ""
    },
    python: {
      label: "Python program",
      fileName: "main.py",
      mode: "ace/mode/python",
      languageId: 109,
      starter: `print("Hello, CodeBhavya!")
`,
      input: ""
    },
    java: {
      label: "Java program",
      fileName: "Main.java",
      mode: "ace/mode/java",
      languageId: 91,
      starter: `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, CodeBhavya!");
    }
}
`,
      input: ""
    },
    javascript: {
      label: "JavaScript program",
      fileName: "main.js",
      mode: "ace/mode/javascript",
      languageId: 102,
      starter: `console.log("Hello, CodeBhavya!");
`,
      input: ""
    }
  };

  const elements = {
    language: document.querySelector("#languageSelect"),
    fileName: document.querySelector("#fileName"),
    editorLanguage: document.querySelector("#editorLanguage"),
    fallbackEditor: document.querySelector("#fallbackEditor"),
    stdin: document.querySelector("#stdin"),
    outputBody: document.querySelector("#outputBody"),
    output: document.querySelector("#output"),
    outputEmpty: document.querySelector("#outputEmpty"),
    outputIndicator: document.querySelector("#outputIndicator"),
    runtimeStatus: document.querySelector("#runtimeStatus"),
    runtimeNote: document.querySelector(".runtime-note"),
    metricStatus: document.querySelector("#metricStatus"),
    metricTime: document.querySelector("#metricTime"),
    metricMemory: document.querySelector("#metricMemory"),
    saveState: document.querySelector("#saveState"),
    cursorPosition: document.querySelector("#cursorPosition"),
    copyCode: document.querySelector("#copyCode"),
    copyOutput: document.querySelector("#copyOutput"),
    clearOutput: document.querySelector("#clearOutput"),
    clearInput: document.querySelector("#clearInput"),
    toast: document.querySelector("#toast"),
    inputDialog: document.querySelector("#inputDialog"),
    inputDialogForm: document.querySelector("#inputDialogForm"),
    dialogInput: document.querySelector("#dialogInput"),
    cancelInputDialog: document.querySelector("#cancelInputDialog"),
    workspaceGrid: document.querySelector(".workspace-grid"),
    workspaceResizer: document.querySelector("#workspaceResizer"),
    tabs: [...document.querySelectorAll(".mobile-tab")],
    panels: [...document.querySelectorAll(".mobile-panel")],
    runButtons: [...document.querySelectorAll('[data-action="run"]')],
    stopButtons: [...document.querySelectorAll('[data-action="stop"]')],
    resetButtons: [...document.querySelectorAll('[data-action="reset"]')],
    downloadButtons: [...document.querySelectorAll('[data-action="download"]')]
  };

  let editor = null;
  let currentLanguage = elements.language.value;
  let activeRequest = null;
  let saveTimer = null;
  let toastTimer = null;
  let isRunning = false;
  let editorRatio = Number(readStored("codebhavya-compiler:editor-ratio")) || 0.67;

  function sourceKey(language) {
    return `codebhavya-compiler:${language}:source`;
  }

  function readStored(key) {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      return null;
    }
  }

  function writeStored(key, value) {
    try {
      localStorage.setItem(key, value);
      return true;
    } catch (error) {
      return false;
    }
  }

  function getSource() {
    return editor ? editor.getValue() : elements.fallbackEditor.value;
  }

  function setSource(value, cursorToStart = true) {
    if (editor) {
      editor.setValue(value, cursorToStart ? -1 : 1);
      editor.clearSelection();
      editor.resize();
    } else {
      elements.fallbackEditor.value = value;
    }
  }

  function scheduleSave() {
    window.clearTimeout(saveTimer);
    elements.saveState?.classList.add("is-saving");

    saveTimer = window.setTimeout(() => {
      const sourceSaved = writeStored(sourceKey(currentLanguage), getSource());

      if (elements.saveState) {
        elements.saveState.lastChild.textContent = sourceSaved
          ? " Code saved on this device"
          : " Could not save locally";
        elements.saveState.classList.remove("is-saving");
      }
    }, 350);
  }

  function saveImmediately() {
    window.clearTimeout(saveTimer);
    writeStored(sourceKey(currentLanguage), getSource());
  }

  function showToast(message) {
    window.clearTimeout(toastTimer);
    elements.toast.textContent = message;
    elements.toast.hidden = false;
    toastTimer = window.setTimeout(() => {
      elements.toast.hidden = true;
    }, 2200);
  }

  async function copyText(value, successMessage) {
    if (!value) {
      showToast("There is nothing to copy yet.");
      return;
    }

    try {
      await navigator.clipboard.writeText(value);
    } catch (error) {
      const helper = document.createElement("textarea");
      helper.value = value;
      helper.setAttribute("readonly", "");
      helper.style.position = "fixed";
      helper.style.opacity = "0";
      document.body.appendChild(helper);
      helper.select();
      document.execCommand("copy");
      helper.remove();
    }

    showToast(successMessage);
  }

  function initializeEditor() {
    if (!window.ace) {
      elements.fallbackEditor.hidden = false;
      document.querySelector("#editor").hidden = true;
      elements.fallbackEditor.addEventListener("input", scheduleSave);
      return;
    }

    window.ace.config.set(
      "basePath",
      "https://cdn.jsdelivr.net/npm/ace-builds@1.44.0/src-min-noconflict"
    );

    editor = window.ace.edit("editor");
    editor.setTheme("ace/theme/tomorrow_night_bright");
    editor.setOptions({
      fontSize: window.matchMedia("(max-width: 820px)").matches ? "16px" : "15px",
      showPrintMargin: false,
      displayIndentGuides: true,
      highlightActiveLine: true,
      highlightGutterLine: true,
      useSoftTabs: true,
      tabSize: 4,
      wrap: true,
      enableMobileMenu: true,
      scrollPastEnd: 0.2
    });
    editor.session.setUseWorker(false);
    editor.session.on("change", scheduleSave);
    editor.selection.on("changeCursor", updateCursorPosition);

    editor.commands.addCommand({
      name: "runCode",
      bindKey: { win: "Ctrl-Enter", mac: "Command-Enter" },
      exec: runCode
    });
  }

  function updateCursorPosition() {
    if (!editor) {
      return;
    }

    const cursor = editor.getCursorPosition();
    elements.cursorPosition.textContent = `Ln ${cursor.row + 1}, Col ${cursor.column + 1}`;
  }

  function sourceReadsInput(source, language) {
    const patterns = {
      c: /\b(?:scanf|fscanf|gets|fgets|getchar)\s*\(/,
      cpp: /\bcin\s*(?:>>|\.)|\bgetline\s*\(\s*cin\b/,
      python: /\binput\s*\(|\bsys\.stdin\b|\bopen\s*\(\s*0\s*[,)]/,
      java: /\bSystem\.in\b|\bScanner\s*\(|\bBufferedReader\s*\(/,
      javascript: /\bprocess\.stdin\b|\breadFileSync\s*\(\s*0\s*[,)]|\bprompt\s*\(/
    };

    return patterns[language]?.test(source) ?? false;
  }

  function openInputRequest() {
    elements.dialogInput.value = elements.stdin.value;

    if (typeof elements.inputDialog.showModal === "function") {
      elements.inputDialog.showModal();
      window.setTimeout(() => elements.dialogInput.focus(), 0);
      return;
    }

    activatePanel("inputPanel");
    showToast("Add the values your program reads, then press Run again.");
    elements.stdin.focus();
  }

  function applyEditorRatio(value, persist = false) {
    editorRatio = Math.min(0.75, Math.max(0.35, Number(value) || 0.67));
    const sideRatio = 1 - editorRatio;
    elements.workspaceGrid.style.gridTemplateColumns =
      `minmax(380px, ${editorRatio}fr) 10px minmax(320px, ${sideRatio}fr)`;
    elements.workspaceResizer.setAttribute("aria-valuenow", String(Math.round(editorRatio * 100)));

    if (persist) {
      writeStored("codebhavya-compiler:editor-ratio", String(editorRatio));
    }

    editor?.resize();
  }

  function resizeFromPointer(event) {
    const bounds = elements.workspaceGrid.getBoundingClientRect();
    const availableWidth = bounds.width - 10;
    const minimumEditor = Math.min(380, availableWidth - 320);
    const editorWidth = Math.min(
      availableWidth - 320,
      Math.max(minimumEditor, event.clientX - bounds.left)
    );
    applyEditorRatio(editorWidth / availableWidth);
  }

  function loadLanguage(language) {
    const config = languages[language];
    const savedSource = readStored(sourceKey(language));

    currentLanguage = language;
    elements.fileName.textContent = config.fileName;
    elements.editorLanguage.textContent = config.label;
    elements.stdin.value = config.input;
    setSource(savedSource ?? config.starter);

    if (editor) {
      editor.session.setMode(config.mode);
      editor.focus();
      updateCursorPosition();
    }

    clearOutput(false);
  }

  function switchLanguage() {
    saveImmediately();
    loadLanguage(elements.language.value);
    showToast(`${languages[currentLanguage].label} loaded.`);
  }

  function setRunning(running) {
    isRunning = running;
    elements.runButtons.forEach(button => {
      button.disabled = running;
      button.setAttribute("aria-busy", String(running));
    });
    elements.stopButtons.forEach(button => {
      button.disabled = !running;
    });

    elements.runtimeNote.classList.toggle("is-running", running);
    if (running) {
      elements.runtimeNote.classList.remove("is-error");
      elements.runtimeStatus.textContent = "Running your program…";
    } else if (elements.runtimeStatus.textContent === "Running your program…") {
      elements.runtimeStatus.textContent = "Ready to run";
    }
  }

  function setOutput(text, type = "normal") {
    elements.outputEmpty.hidden = true;
    elements.output.hidden = false;
    elements.output.textContent = text || "Program finished without producing output.";
    elements.output.classList.toggle("is-error", type === "error");
    elements.output.classList.toggle("is-running", type === "running");
    elements.outputIndicator.hidden = false;
    elements.outputBody.scrollTop = 0;
  }

  function clearOutput(resetMetrics = true) {
    elements.output.textContent = "";
    elements.output.hidden = true;
    elements.output.classList.remove("is-error", "is-running");
    elements.outputEmpty.hidden = false;
    elements.outputIndicator.hidden = true;
    elements.outputBody.scrollTop = 0;

    if (resetMetrics) {
      elements.metricStatus.textContent = "Not run";
      elements.metricTime.textContent = "—";
      elements.metricMemory.textContent = "—";
    }
  }

  function activatePanel(panelId) {
    elements.tabs.forEach(tab => {
      const selected = tab.dataset.panel === panelId;
      tab.classList.toggle("is-active", selected);
      tab.setAttribute("aria-selected", String(selected));
      tab.tabIndex = selected ? 0 : -1;
    });

    elements.panels.forEach(panel => {
      panel.classList.toggle("is-active", panel.id === panelId);
    });

    if (panelId === "editorPanel" && editor) {
      window.setTimeout(() => {
        editor.resize();
        editor.focus();
      }, 0);
    }
  }

  function getApiUrl() {
    const configured = document.documentElement.dataset.compilerApi?.trim();
    return configured || PUBLIC_JUDGE0_ENDPOINT;
  }

  function formatMemory(kilobytes) {
    if (kilobytes === null || kilobytes === undefined || Number.isNaN(Number(kilobytes))) {
      return "—";
    }

    const value = Number(kilobytes);
    return value >= 1024 ? `${(value / 1024).toFixed(1)} MB` : `${value} KB`;
  }

  function executionText(result) {
    const sections = [];

    if (result.compile_output) {
      sections.push(`Compiler output\n${result.compile_output.trimEnd()}`);
    }
    if (result.stderr) {
      sections.push(`Error output\n${result.stderr.trimEnd()}`);
    }
    if (result.stdout) {
      sections.push(result.stdout.trimEnd());
    }
    if (result.message && !result.compile_output && !result.stderr) {
      sections.push(result.message.trimEnd());
    }

    return sections.join("\n\n") || "Program finished without producing output.";
  }

  async function pollSubmission(apiUrl, token, signal) {
    const baseUrl = apiUrl.split("/submissions")[0];

    for (let attempt = 0; attempt < 12; attempt += 1) {
      await new Promise(resolve => window.setTimeout(resolve, 700));
      const response = await fetch(
        `${baseUrl}/submissions/${encodeURIComponent(token)}?base64_encoded=false`,
        { signal, headers: { Accept: "application/json" } }
      );
      if (!response.ok) {
        throw new Error(`Execution service returned ${response.status}.`);
      }
      const result = await response.json();
      if (result.status?.id > 2) {
        return result;
      }
    }

    throw new Error("The program is still running. Please try again in a moment.");
  }

  function runCode() {
    if (isRunning) {
      return;
    }

    if (elements.inputDialog.open) {
      return;
    }

    const source = getSource();
    if (source.trim() && sourceReadsInput(source, currentLanguage)) {
      openInputRequest();
      return;
    }

    executeCode();
  }

  async function executeCode() {
    if (isRunning) {
      return;
    }

    const source = getSource();
    if (!source.trim()) {
      showToast("Write some code before running the program.");
      activatePanel("editorPanel");
      return;
    }

    if (source.length > 65000) {
      showToast("The program is too large. Keep the source below 65,000 characters.");
      return;
    }

    if (elements.stdin.value.length > 16000) {
      showToast("Standard input must stay below 16,000 characters.");
      return;
    }

    saveImmediately();
    setRunning(true);
    setOutput("Compiling and running…", "running");
    elements.metricStatus.textContent = "Running";
    elements.metricTime.textContent = "—";
    elements.metricMemory.textContent = "—";

    if (window.matchMedia("(max-width: 820px)").matches) {
      activatePanel("outputPanel");
    }

    activeRequest = new AbortController();
    const timeout = window.setTimeout(() => activeRequest?.abort("timeout"), 22000);

    try {
      const apiUrl = getApiUrl();
      const payload = {
        language_id: languages[currentLanguage].languageId,
        source_code: source,
        stdin: elements.stdin.value
      };

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload),
        signal: activeRequest.signal
      });

      let result;
      try {
        result = await response.json();
      } catch (error) {
        result = null;
      }

      if (!response.ok) {
        const detail = result?.message || result?.error || `Execution service returned ${response.status}.`;
        throw new Error(detail);
      }

      if (result?.token && !result.status) {
        if (apiUrl.includes("/execute")) {
          throw new Error("The execution gateway returned before the program finished.");
        }
        result = await pollSubmission(apiUrl, result.token, activeRequest.signal);
      }

      if (!result?.status) {
        throw new Error("The execution service returned an incomplete result.");
      }

      const success = result.status.id === 3;
      const statusText = result.status.description || (success ? "Completed" : "Failed");
      setOutput(executionText(result), success ? "normal" : "error");
      elements.metricStatus.textContent = statusText;
      elements.metricTime.textContent = result.time ? `${result.time} s` : "—";
      elements.metricMemory.textContent = formatMemory(result.memory);
      elements.runtimeStatus.textContent = success ? "Program completed" : statusText;
      elements.runtimeNote.classList.toggle("is-error", !success);
    } catch (error) {
      const stopped = error.name === "AbortError";
      const message = stopped
        ? "Execution stopped in this browser."
        : `${error.message}\n\nIf the public service is busy, deploy the included compiler gateway and place its URL in index.html.`;

      setOutput(message, stopped ? "normal" : "error");
      elements.metricStatus.textContent = stopped ? "Stopped" : "Service error";
      elements.runtimeStatus.textContent = stopped ? "Execution stopped" : "Could not run program";
      elements.runtimeNote.classList.toggle("is-error", !stopped);
    } finally {
      window.clearTimeout(timeout);
      activeRequest = null;
      setRunning(false);
    }
  }

  function stopCode() {
    if (activeRequest) {
      activeRequest.abort("stopped");
    }
  }

  function resetCode() {
    const config = languages[currentLanguage];
    const current = getSource();
    if (current !== config.starter && !window.confirm("Replace your current code with the starter program?")) {
      return;
    }

    setSource(config.starter);
    elements.stdin.value = config.input;
    writeStored(sourceKey(currentLanguage), config.starter);
    clearOutput();
    showToast("Starter program restored.");
  }

  function downloadCode() {
    const blob = new Blob([getSource()], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = languages[currentLanguage].fileName;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    showToast(`${languages[currentLanguage].fileName} downloaded.`);
  }

  function bindEvents() {
    elements.language.addEventListener("change", switchLanguage);
    elements.copyCode.addEventListener("click", () => copyText(getSource(), "Source code copied."));
    elements.copyOutput.addEventListener("click", () => copyText(elements.output.textContent, "Output copied."));
    elements.clearOutput.addEventListener("click", () => clearOutput());
    elements.clearInput.addEventListener("click", () => {
      elements.stdin.value = "";
      scheduleSave();
      elements.stdin.focus();
    });

    elements.inputDialogForm.addEventListener("submit", event => {
      event.preventDefault();
      elements.stdin.value = elements.dialogInput.value;
      elements.inputDialog.close();
      executeCode();
    });
    elements.dialogInput.addEventListener("keydown", event => {
      if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
        event.preventDefault();
        event.stopPropagation();
        elements.inputDialogForm.requestSubmit();
      }
    });
    elements.cancelInputDialog.addEventListener("click", () => elements.inputDialog.close());

    elements.workspaceResizer.addEventListener("pointerdown", event => {
      if (window.matchMedia("(max-width: 820px)").matches) {
        return;
      }
      event.preventDefault();
      elements.workspaceResizer.setPointerCapture(event.pointerId);
      document.body.classList.add("is-resizing");
      resizeFromPointer(event);
    });
    elements.workspaceResizer.addEventListener("pointermove", event => {
      if (!elements.workspaceResizer.hasPointerCapture(event.pointerId)) {
        return;
      }
      resizeFromPointer(event);
    });
    elements.workspaceResizer.addEventListener("pointerup", event => {
      if (elements.workspaceResizer.hasPointerCapture(event.pointerId)) {
        elements.workspaceResizer.releasePointerCapture(event.pointerId);
      }
      document.body.classList.remove("is-resizing");
      applyEditorRatio(editorRatio, true);
    });
    elements.workspaceResizer.addEventListener("pointercancel", () => {
      document.body.classList.remove("is-resizing");
    });
    elements.workspaceResizer.addEventListener("keydown", event => {
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") {
        return;
      }
      event.preventDefault();
      applyEditorRatio(editorRatio + (event.key === "ArrowRight" ? 0.03 : -0.03), true);
    });
    elements.workspaceResizer.addEventListener("dblclick", () => applyEditorRatio(0.67, true));

    elements.runButtons.forEach(button => button.addEventListener("click", runCode));
    elements.stopButtons.forEach(button => button.addEventListener("click", stopCode));
    elements.resetButtons.forEach(button => button.addEventListener("click", resetCode));
    elements.downloadButtons.forEach(button => button.addEventListener("click", downloadCode));

    elements.tabs.forEach((tab, index) => {
      tab.addEventListener("click", () => activatePanel(tab.dataset.panel));
      tab.addEventListener("keydown", event => {
        if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") {
          return;
        }
        event.preventDefault();
        const direction = event.key === "ArrowRight" ? 1 : -1;
        const nextIndex = (index + direction + elements.tabs.length) % elements.tabs.length;
        elements.tabs[nextIndex].focus();
        activatePanel(elements.tabs[nextIndex].dataset.panel);
      });
    });

    document.addEventListener("keydown", event => {
      if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
        event.preventDefault();
        runCode();
      }
    });

    window.addEventListener("resize", () => editor?.resize());
    window.addEventListener("beforeunload", saveImmediately);
  }

  initializeEditor();
  bindEvents();
  applyEditorRatio(editorRatio);
  loadLanguage(currentLanguage);
})();
