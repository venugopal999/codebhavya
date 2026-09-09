"use strict";

(() => {
  const JDOODLE_SOCKET_URL = "https://api.jdoodle.com/v1/stomp";
  const EXECUTE_DESTINATION = "/app/execute-ws-api-token";
  const OUTPUT_DESTINATION = "/user/queue/execute-i";
  const MAX_SOURCE_CHARACTERS = 65_000;
  const TOKEN_REFRESH_MARGIN_MS = 15_000;

  const languages = {
    c: {
      label: "C program",
      fileName: "main.c",
      mode: "ace/mode/c_cpp",
      jdoodleLanguage: "c",
      versionIndex: "6",
      starter: `#include <stdio.h>

int main(void) {
    int first, second;

    printf("Enter first number: ");
    fflush(stdout);
    scanf("%d", &first);

    printf("Enter second number: ");
    fflush(stdout);
    scanf("%d", &second);

    printf("Sum = %d\\n", first + second);
    return 0;
}
`
    },
    cpp: {
      label: "C++17 program",
      fileName: "main.cpp",
      mode: "ace/mode/c_cpp",
      jdoodleLanguage: "cpp17",
      versionIndex: "2",
      starter: `#include <iostream>
using namespace std;

int main() {
    int first, second;

    cout << "Enter first number: " << flush;
    cin >> first;

    cout << "Enter second number: " << flush;
    cin >> second;

    cout << "Sum = " << first + second << '\\n';
    return 0;
}
`
    },
    python: {
      label: "Python program",
      fileName: "main.py",
      mode: "ace/mode/python",
      jdoodleLanguage: "python3",
      versionIndex: "5",
      starter: `first = int(input("Enter first number: "))
second = int(input("Enter second number: "))
print("Sum =", first + second)
`
    },
    java: {
      label: "Java program",
      fileName: "Main.java",
      mode: "ace/mode/java",
      jdoodleLanguage: "java",
      versionIndex: "4",
      starter: `import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner input = new Scanner(System.in);

        System.out.print("Enter first number: ");
        System.out.flush();
        int first = input.nextInt();

        System.out.print("Enter second number: ");
        System.out.flush();
        int second = input.nextInt();

        System.out.println("Sum = " + (first + second));
    }
}
`
    },
    javascript: {
      label: "JavaScript program",
      fileName: "main.js",
      mode: "ace/mode/javascript",
      jdoodleLanguage: "nodejs",
      versionIndex: "5",
      starter: `const readline = require("node:readline");
const terminal = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

terminal.question("Enter your name: ", name => {
    console.log(\`Hello, \${name}!\`);
    terminal.close();
});
`
    }
  };

  const elements = {
    language: document.querySelector("#languageSelect"),
    fileName: document.querySelector("#fileName"),
    editorLanguage: document.querySelector("#editorLanguage"),
    fallbackEditor: document.querySelector("#fallbackEditor"),
    outputBody: document.querySelector("#outputBody"),
    output: document.querySelector("#output"),
    outputEmpty: document.querySelector("#outputEmpty"),
    outputIndicator: document.querySelector("#outputIndicator"),
    runtimeStatus: document.querySelector("#runtimeStatus"),
    runtimeNote: document.querySelector(".runtime-note"),
    metricStatus: document.querySelector("#metricStatus"),
    metricTime: document.querySelector("#metricTime"),
    metricInput: document.querySelector("#metricInput"),
    saveState: document.querySelector("#saveState"),
    cursorPosition: document.querySelector("#cursorPosition"),
    copyCode: document.querySelector("#copyCode"),
    copyOutput: document.querySelector("#copyOutput"),
    clearOutput: document.querySelector("#clearOutput"),
    toast: document.querySelector("#toast"),
    terminalInputForm: document.querySelector("#terminalInputForm"),
    terminalInput: document.querySelector("#terminalInput"),
    terminalSend: document.querySelector("#terminalSend"),
    terminalHelp: document.querySelector("#terminalHelp"),
    terminalLiveBadge: document.querySelector("#terminalLiveBadge"),
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
  let stompClient = null;
  let socketConnection = null;
  let connectionPromise = null;
  let sessionToken = "";
  let tokenExpiresAt = 0;
  let isRunning = false;
  let runStartedAt = 0;
  let runClock = null;
  let saveTimer = null;
  let toastTimer = null;
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
    }, 2400);
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
    if (!editor) return;
    const cursor = editor.getCursorPosition();
    elements.cursorPosition.textContent = `Ln ${cursor.row + 1}, Col ${cursor.column + 1}`;
  }

  function applyEditorRatio(value, persist = false) {
    editorRatio = Math.min(0.75, Math.max(0.35, Number(value) || 0.67));
    const sideRatio = 1 - editorRatio;
    elements.workspaceGrid.style.gridTemplateColumns =
      `minmax(380px, ${editorRatio}fr) 10px minmax(320px, ${sideRatio}fr)`;
    elements.workspaceResizer.setAttribute("aria-valuenow", String(Math.round(editorRatio * 100)));
    if (persist) writeStored("codebhavya-compiler:editor-ratio", String(editorRatio));
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
    setSource(savedSource ?? config.starter);
    if (editor) {
      editor.session.setMode(config.mode);
      editor.focus();
      updateCursorPosition();
    }
    clearTerminal(true);
  }

  function switchLanguage() {
    if (isRunning) {
      elements.language.value = currentLanguage;
      showToast("Stop the running program before changing language.");
      return;
    }
    saveImmediately();
    loadLanguage(elements.language.value);
    showToast(`${languages[currentLanguage].label} loaded.`);
  }

  function setTerminalBadge(label, state = "") {
    elements.terminalLiveBadge.textContent = label;
    elements.terminalLiveBadge.className = "terminal-live-badge";
    if (state) elements.terminalLiveBadge.classList.add(`is-${state}`);
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
    elements.language.disabled = running;
    elements.terminalInput.disabled = !running;
    elements.terminalSend.disabled = !running;
    elements.metricInput.textContent = running ? "Ready" : "Inactive";
    elements.terminalInput.placeholder = running
      ? "Type a value and press Enter"
      : "Run a program to activate input";
    elements.runtimeNote.classList.toggle("is-running", running);
    if (running) {
      elements.runtimeNote.classList.remove("is-error");
      elements.runtimeStatus.textContent = "Program is running";
      elements.terminalHelp.textContent =
        "Watch for a prompt above, type one answer here, then press Enter. Repeat whenever the program asks.";
    } else {
      elements.terminalHelp.textContent =
        "Input becomes active while a program is running. Enter sends one line to the program.";
    }
  }

  function revealTerminal() {
    elements.outputEmpty.hidden = true;
    elements.output.hidden = false;
    elements.outputIndicator.hidden = false;
  }

  function sanitizeTerminalText(value) {
    return String(value ?? "")
      .replace(/\u001b\[[0-?]*[ -/]*[@-~]/g, "")
      .replace(/\r(?!\n)/g, "\n");
  }

  function appendTerminal(value, type = "normal") {
    const text = sanitizeTerminalText(value);
    if (!text) return;
    revealTerminal();
    elements.output.textContent += text;
    if (type === "error") elements.output.classList.add("is-error");
    elements.outputBody.scrollTop = elements.outputBody.scrollHeight;
  }

  function appendUserInput(value) {
    revealTerminal();
    const needsNewline = elements.output.textContent && !elements.output.textContent.endsWith("\n");
    elements.output.textContent += `${needsNewline ? "\n" : ""}❯ ${value || "[Enter]"}\n`;
    elements.outputBody.scrollTop = elements.outputBody.scrollHeight;
  }

  function setTerminalMessage(message, type = "normal") {
    elements.output.textContent = "";
    elements.output.classList.remove("is-error");
    appendTerminal(message, type);
  }

  function clearTerminal(resetMetrics = true) {
    elements.output.textContent = "";
    elements.output.hidden = true;
    elements.output.classList.remove("is-error");
    elements.outputEmpty.hidden = false;
    elements.outputIndicator.hidden = true;
    elements.outputBody.scrollTop = 0;
    if (resetMetrics) {
      elements.metricStatus.textContent = "Not run";
      elements.metricTime.textContent = "—";
      elements.metricInput.textContent = "Inactive";
      setTerminalBadge(stompClient?.connected ? "Ready" : "Offline", stompClient?.connected ? "ready" : "");
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
    if (panelId === "terminalPanel") elements.outputIndicator.hidden = true;
    if (panelId === "editorPanel" && editor) {
      window.setTimeout(() => {
        editor.resize();
        editor.focus();
      }, 0);
    }
  }

  function getTokenEndpoint() {
    return document.documentElement.dataset.tokenEndpoint?.trim() || "";
  }

  function configurationError() {
    const endpoint = getTokenEndpoint();
    return !endpoint || /your-account|your-subdomain|example/i.test(endpoint);
  }

  async function requestSessionToken() {
    const endpoint = getTokenEndpoint();
    if (configurationError()) {
      throw new Error(
        "Interactive execution is not connected yet. Deploy compiler-worker.js, add your JDoodle credentials there, then set data-token-endpoint in index.html."
      );
    }
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { Accept: "application/json" }
    });
    let result = null;
    try {
      result = await response.json();
    } catch (error) {
      result = null;
    }
    if (!response.ok || !result?.token) {
      throw new Error(result?.error || `Could not start an interactive session (${response.status}).`);
    }
    sessionToken = result.token;
    const lifetimeSeconds = Math.max(30, Number(result.expiresIn || 180));
    tokenExpiresAt = Date.now() + lifetimeSeconds * 1000 - TOKEN_REFRESH_MARGIN_MS;
    return sessionToken;
  }

  function disconnectSocket() {
    connectionPromise = null;
    const client = stompClient;
    stompClient = null;
    if (client?.connected) {
      try {
        client.disconnect(() => {});
      } catch (error) {
        // The browser socket may already be closed.
      }
    }
    if (socketConnection && socketConnection.readyState < 2) {
      try {
        socketConnection.close();
      } catch (error) {
        // SockJS may already be closing.
      }
    }
    socketConnection = null;
  }

  function elapsedTime() {
    if (!runStartedAt) return "—";
    return `${((performance.now() - runStartedAt) / 1000).toFixed(1)} s`;
  }

  function finishRun(status, options = {}) {
    window.clearInterval(runClock);
    runClock = null;
    setRunning(false);
    elements.metricStatus.textContent = status;
    elements.metricTime.textContent = options.time || elapsedTime();
    elements.runtimeStatus.textContent = options.runtime || status;
    elements.runtimeNote.classList.toggle("is-error", Boolean(options.error));
    setTerminalBadge(stompClient?.connected ? "Ready" : "Offline", stompClient?.connected ? "ready" : "");
  }

  function startRunClock() {
    window.clearInterval(runClock);
    elements.metricTime.textContent = "0.0 s";
    runClock = window.setInterval(() => {
      if (isRunning) elements.metricTime.textContent = elapsedTime();
    }, 200);
  }

  function handleExecutionMessage(message) {
    const statusCode = Number(message.headers?.statusCode || 0);
    if (statusCode === 201) {
      elements.metricStatus.textContent = "Running";
      setTerminalBadge("Live", "live");
      return;
    }
    if (statusCode === 204) {
      const reportedTime = sanitizeTerminalText(message.body).trim();
      finishRun("Completed", {
        time: reportedTime && /\d/.test(reportedTime) ? reportedTime : elapsedTime(),
        runtime: "Program completed"
      });
      if (!elements.output.textContent) appendTerminal("Program finished without producing output.\n");
      return;
    }
    if (statusCode === 206) {
      appendTerminal("\n[The program produced a file. File output is not displayed in this terminal.]\n");
      return;
    }
    if (statusCode >= 400) {
      const detail = sanitizeTerminalText(message.body).trim() || `Execution service error ${statusCode}.`;
      appendTerminal(`${detail}\n`, "error");
      finishRun(statusCode === 429 ? "Limit reached" : "Execution error", {
        runtime: statusCode === 429 ? "Daily execution limit reached" : "Program could not continue",
        error: true
      });
      return;
    }
    appendTerminal(message.body);
  }

  async function connectInteractiveSession() {
    if (stompClient?.connected && sessionToken && Date.now() < tokenExpiresAt) return stompClient;
    if (connectionPromise) return connectionPromise;
    disconnectSocket();
    setTerminalBadge("Connecting", "connecting");
    elements.runtimeStatus.textContent = "Opening terminal session…";
    connectionPromise = (async () => {
      const token = await requestSessionToken();
      if (!window.SockJS || !window.webstomp) {
        throw new Error("The interactive terminal libraries did not load. Refresh the page and try again.");
      }
      socketConnection = new window.SockJS(JDOODLE_SOCKET_URL);
      const client = window.webstomp.over(socketConnection);
      client.debug = () => {};
      await new Promise((resolve, reject) => {
        client.connect(
          {},
          () => {
            client.subscribe(OUTPUT_DESTINATION, handleExecutionMessage);
            resolve();
          },
          frame => reject(new Error(frame?.body || frame?.message || "The terminal connection failed."))
        );
      });
      stompClient = client;
      setTerminalBadge("Ready", "ready");
      return client;
    })();
    try {
      return await connectionPromise;
    } finally {
      connectionPromise = null;
    }
  }

  async function runCode() {
    if (isRunning) return;
    const source = getSource();
    if (!source.trim()) {
      showToast("Write some code before running the program.");
      activatePanel("editorPanel");
      return;
    }
    if (source.length > MAX_SOURCE_CHARACTERS) {
      showToast("The program is too large. Keep the source below 65,000 characters.");
      return;
    }
    saveImmediately();
    clearTerminal(false);
    setRunning(true);
    runStartedAt = performance.now();
    startRunClock();
    elements.metricStatus.textContent = "Connecting";
    elements.metricInput.textContent = "Preparing";
    setTerminalMessage("Connecting to the interactive compiler…\n");
    if (window.matchMedia("(max-width: 820px)").matches) activatePanel("terminalPanel");
    try {
      const client = await connectInteractiveSession();
      elements.output.textContent = "";
      elements.metricStatus.textContent = "Starting";
      elements.metricInput.textContent = "Ready";
      setTerminalBadge("Live", "live");
      const config = languages[currentLanguage];
      client.send(
        EXECUTE_DESTINATION,
        JSON.stringify({
          script: source,
          language: config.jdoodleLanguage,
          versionIndex: config.versionIndex
        }),
        { message_type: "execute", token: sessionToken }
      );
    } catch (error) {
      setTerminalMessage(`${error.message}\n`, "error");
      disconnectSocket();
      finishRun("Connection error", { runtime: "Could not open terminal", error: true });
    }
  }

  function sendTerminalInput(event) {
    event.preventDefault();
    if (!isRunning || !stompClient?.connected) {
      showToast("Run a program before sending input.");
      return;
    }
    const value = elements.terminalInput.value;
    try {
      stompClient.send(
        EXECUTE_DESTINATION,
        `${value}\n`,
        { message_type: "input", token: sessionToken }
      );
      appendUserInput(value);
      elements.terminalInput.value = "";
      elements.terminalInput.focus();
      elements.metricInput.textContent = "Sent";
      window.setTimeout(() => {
        if (isRunning) elements.metricInput.textContent = "Ready";
      }, 700);
    } catch (error) {
      appendTerminal(`\nCould not send input: ${error.message}\n`, "error");
    }
  }

  function stopCode() {
    if (!isRunning) return;
    disconnectSocket();
    appendTerminal("\n[Execution stopped by the student.]\n");
    finishRun("Stopped", { runtime: "Execution stopped" });
  }

  function resetCode() {
    const config = languages[currentLanguage];
    const current = getSource();
    if (current !== config.starter && !window.confirm("Replace your current code with the starter program?")) return;
    if (isRunning) stopCode();
    setSource(config.starter);
    writeStored(sourceKey(currentLanguage), config.starter);
    clearTerminal();
    showToast("Interactive starter program restored.");
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
    elements.copyOutput.addEventListener("click", () => copyText(elements.output.textContent, "Terminal copied."));
    elements.clearOutput.addEventListener("click", () => clearTerminal(false));
    elements.terminalInputForm.addEventListener("submit", sendTerminalInput);
    elements.workspaceResizer.addEventListener("pointerdown", event => {
      if (window.matchMedia("(max-width: 820px)").matches) return;
      event.preventDefault();
      elements.workspaceResizer.setPointerCapture(event.pointerId);
      document.body.classList.add("is-resizing");
      resizeFromPointer(event);
    });
    elements.workspaceResizer.addEventListener("pointermove", event => {
      if (elements.workspaceResizer.hasPointerCapture(event.pointerId)) resizeFromPointer(event);
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
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
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
        if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
        event.preventDefault();
        const direction = event.key === "ArrowRight" ? 1 : -1;
        const nextIndex = (index + direction + elements.tabs.length) % elements.tabs.length;
        elements.tabs[nextIndex].focus();
        activatePanel(elements.tabs[nextIndex].dataset.panel);
      });
    });
    document.addEventListener("keydown", event => {
      const terminalFocused = event.target === elements.terminalInput;
      if (!terminalFocused && (event.ctrlKey || event.metaKey) && event.key === "Enter") {
        event.preventDefault();
        runCode();
      }
    });
    window.addEventListener("resize", () => editor?.resize());
    window.addEventListener("beforeunload", () => {
      saveImmediately();
      disconnectSocket();
    });
  }

  initializeEditor();
  bindEvents();
  applyEditorRatio(editorRatio);
  loadLanguage(currentLanguage);
})();
