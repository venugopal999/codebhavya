"use strict";

const WS_URL = window.CODEBHAVYA_CONFIG?.compilerWebSocketUrl || "wss://online-compiler-srho.onrender.com";
const LANGUAGE_KEY = "codebhavya.compiler.v2.language";
const languageInfo = {
  c: { monaco: "c", filename: "program.c", label: "C program", template: `#include <stdio.h>

int main(void) {
    printf("Hello, CodeBhavya!\\n");
    return 0;
}
` },
  cpp: { monaco: "cpp", filename: "program.cpp", label: "C++ program", template: `#include <iostream>
using namespace std;

int main() {
    cout << "Hello, CodeBhavya!\\n";
    return 0;
}
` },
  python: { monaco: "python", filename: "program.py", label: "Python program", template: `print("Hello, CodeBhavya!")
` },
  java: { monaco: "java", filename: "Program.java", label: "Java program", template: `public class Program {
    public static void main(String[] args) {
        System.out.println("Hello, CodeBhavya!");
    }
}
` },
  javascript: { monaco: "javascript", filename: "program.js", label: "JavaScript program", template: `console.log("Hello, CodeBhavya!");
` }
};

const $ = (id) => document.getElementById(id);
const elements = {
  language: $("language"), filename: $("filename"), sourceTitle: $("sourceTitle"), saveState: $("saveState"),
  terminal: $("terminal"), consoleInput: $("consoleInput"), inputPreview: $("inputPreview"),
  runButton: $("runButton"), stopButton: $("stopButton"), resetButton: $("resetButton"),
  downloadButton: $("downloadButton"), clearButton: $("clearButton"), copyButton: $("copyButton"),
  copyCodeButton: $("copyCodeButton"), statusBadge: $("statusBadge"), serverDot: $("serverDot"),
  serverText: $("serverText"), historyDrawer: $("historyDrawer"), historyList: $("historyList"),
  outputNotice: $("outputNotice"), menuButton: $("menuButton"), siteNav: $("siteNav"),
  workspace: $("workspace"), sideStack: $("sideStack"), verticalSplitter: $("verticalSplitter"),
  horizontalSplitter: $("horizontalSplitter"), sourcePanel: document.querySelector(".source-panel"),
  sourceHeader: document.querySelector(".source-panel .panel-header"), mobileEditorShell: $("mobileEditorShell"),
  mobileSource: $("mobileSource"), mobileLineNumbers: $("mobileLineNumbers"), mobileHighlight: $("mobileHighlight")
};

let editor, socket, wakeTimer;
let currentLanguage = languageInfo[localStorage.getItem(LANGUAGE_KEY)] ? localStorage.getItem(LANGUAGE_KEY) : "c";
const sessionDrafts = {};
let inputHistory = [];
let isRunning = false;
let finalStatusSeen = false;
let editorIsComposing = false;
const mobileEditor = window.matchMedia("(max-width: 760px)");
let syncingEditors = false;

function usingMobileSource() {
  return mobileEditor.matches && elements.mobileSource;
}

function getSource() {
  return usingMobileSource() ? elements.mobileSource.value : (editor?.getValue() ?? elements.mobileSource.value);
}

const mobileKeywordGroups = {
  c: "auto break case char const continue default do double else enum extern float for goto if inline int long register return short signed sizeof static struct switch typedef union unsigned void volatile while _Bool",
  cpp: "alignas alignof and asm auto bool break case catch char class const constexpr continue default delete do double else enum explicit export extern false float for friend if inline int long namespace new noexcept nullptr operator private protected public register reinterpret_cast return short signed sizeof static struct switch template this throw true try typedef typename union unsigned using virtual void volatile while",
  java: "abstract assert boolean break byte case catch char class const continue default do double else enum extends final finally float for if implements import instanceof int interface long native new null package private protected public record return sealed short static strictfp super switch synchronized this throw throws transient true try var void volatile while yield false",
  javascript: "async await break case catch class const continue debugger default delete do else export extends false finally for function if import in instanceof let new null of return static super switch this throw true try typeof undefined var void while with yield",
  python: "False None True and as assert async await break class continue def del elif else except finally for from global if import in is lambda nonlocal not or pass raise return try while with yield"
};
const mobileKeywords = Object.fromEntries(Object.entries(mobileKeywordGroups).map(([language, words]) => [language, new Set(words.split(" "))]));

function escapeToken(value) {
  return value.replace(/[&<>]/g, character => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" })[character]);
}

function highlightMobileSource(source) {
  const keywords = mobileKeywords[currentLanguage] || mobileKeywords.c;
  let result = "", index = 0;
  const add = (kind, value) => { result += kind ? `<span class="tok-${kind}">${escapeToken(value)}</span>` : escapeToken(value); };
  while (index < source.length) {
    const rest = source.slice(index);
    const lineStart = index === 0 || source[index - 1] === "\n";
    if ((currentLanguage === "c" || currentLanguage === "cpp") && lineStart && source[index] === "#") {
      const end = source.indexOf("\n", index); const stop = end < 0 ? source.length : end;
      add("preprocessor", source.slice(index, stop)); index = stop; continue;
    }
    if (rest.startsWith("//") || (currentLanguage === "python" && rest[0] === "#")) {
      const end = source.indexOf("\n", index); const stop = end < 0 ? source.length : end;
      add("comment", source.slice(index, stop)); index = stop; continue;
    }
    if (rest.startsWith("/*")) {
      const end = source.indexOf("*/", index + 2); const stop = end < 0 ? source.length : end + 2;
      add("comment", source.slice(index, stop)); index = stop; continue;
    }
    const quote = source[index];
    if (quote === "\"" || quote === "'" || (quote === "`" && currentLanguage === "javascript")) {
      let stop = index + 1;
      while (stop < source.length) {
        if (source[stop] === "\\") { stop += 2; continue; }
        if (source[stop++] === quote) break;
      }
      add("string", source.slice(index, stop)); index = stop; continue;
    }
    const number = rest.match(/^(?:0[xX][\da-fA-F]+|0[bB][01]+|\d+(?:\.\d+)?(?:[eE][+-]?\d+)?[fFdDlL]?)/);
    if (number) { add("number", number[0]); index += number[0].length; continue; }
    const identifier = rest.match(/^[A-Za-z_$][\w$]*/);
    if (identifier) {
      const word = identifier[0];
      add(keywords.has(word) ? "keyword" : /^[A-Z]/.test(word) ? "type" : "", word);
      index += word.length; continue;
    }
    if (/[{}()[\];,.?:+\-*\/%=!<>|&^~]/.test(source[index])) add("operator", source[index]);
    else add("", source[index]);
    index++;
  }
  return result + (source.endsWith("\n") ? "\n" : "");
}

function updateMobileEditorView() {
  const count = Math.max(1, elements.mobileSource.value.split("\n").length);
  elements.mobileLineNumbers.textContent = Array.from({ length: count }, (_, index) => index + 1).join("\n");
  elements.mobileHighlight.innerHTML = highlightMobileSource(elements.mobileSource.value);
  elements.mobileHighlight.style.transform = `translate(${-elements.mobileSource.scrollLeft}px, ${-elements.mobileSource.scrollTop}px)`;
}

function setSource(value, focus = false) {
  syncingEditors = true;
  if (elements.mobileSource.value !== value) elements.mobileSource.value = value;
  if (editor && editor.getValue() !== value) editor.setValue(value);
  syncingEditors = false;
  updateMobileEditorView();
  if (focus) (usingMobileSource() ? elements.mobileSource : editor)?.focus();
}

function syncEditorMode() {
  if (mobileEditor.matches) {
    if (editor) elements.mobileSource.value = editor.getValue();
    elements.mobileEditorShell.hidden = false;
    $("editor").hidden = true;
    updateMobileEditorView();
  } else {
    if (editor && elements.mobileSource.value !== editor.getValue()) editor.setValue(elements.mobileSource.value);
    elements.mobileEditorShell.hidden = true;
    $("editor").hidden = false;
    requestAnimationFrame(() => editor?.layout());
  }
}

function refreshMobileEditor(revealCursor = false, relayout = false) {
  if (!editor || !mobileEditor.matches || editorIsComposing) return;
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      if (relayout) editor.layout();
      if (revealCursor) editor.revealPositionInCenterIfOutsideViewport(editor.getPosition());
    });
  });
}

function draftFor(language) { return sessionDrafts[language] ?? languageInfo[language].template; }
function scheduleSave() {
  if (syncingEditors) return;
  sessionDrafts[currentLanguage] = getSource();
  elements.saveState.textContent = "Session only";
}

elements.mobileSource.value = draftFor(currentLanguage);
syncEditorMode();

require.config({ paths: { vs: "https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.52.2/min/vs" } });
require(["vs/editor/editor.main"], () => {
  elements.language.value = currentLanguage;
  editor = monaco.editor.create($("editor"), {
    value: draftFor(currentLanguage), language: languageInfo[currentLanguage].monaco, theme: "vs-dark",
    automaticLayout: true, fontSize: 14, lineHeight: 21, minimap: { enabled: false }, padding: { top: 12 },
    scrollBeyondLastLine: false, smoothScrolling: !mobileEditor.matches,
    cursorSmoothCaretAnimation: mobileEditor.matches ? "off" : "on",
    wordWrap: "on", wrappingIndent: "same", tabSize: 4,
    glyphMargin: false, overviewRulerLanes: 0,
    renderLineHighlight: mobileEditor.matches ? "line" : "all"
  });
  editor.onDidChangeModelContent(() => {
    scheduleSave();
  });
  const editorNode = editor.getDomNode();
  editorNode?.addEventListener("compositionstart", () => { editorIsComposing = true; }, true);
  editorNode?.addEventListener("compositionend", () => {
    editorIsComposing = false;
    refreshMobileEditor(true, true);
  }, true);
  updateLanguageMeta();
  syncEditorMode();
  refreshMobileEditor(false, true);
});

elements.mobileSource.addEventListener("input", () => {
  updateMobileEditorView();
  scheduleSave();
});
elements.mobileSource.addEventListener("scroll", () => {
  elements.mobileLineNumbers.scrollTop = elements.mobileSource.scrollTop;
  elements.mobileHighlight.style.transform = `translate(${-elements.mobileSource.scrollLeft}px, ${-elements.mobileSource.scrollTop}px)`;
});

const mobilePairs = { "(": ")", "[": "]", "{": "}", "\"": "\"", "'": "'" };
const mobileClosers = new Set(Object.values(mobilePairs));

function replaceMobileSelection(text, selectionStart, selectionEnd = selectionStart) {
  elements.mobileSource.setRangeText(text, elements.mobileSource.selectionStart, elements.mobileSource.selectionEnd, "end");
  elements.mobileSource.setSelectionRange(selectionStart, selectionEnd);
  updateMobileEditorView();
  scheduleSave();
}

elements.mobileSource.addEventListener("beforeinput", event => {
  if (event.isComposing) return;
  const input = elements.mobileSource;
  const start = input.selectionStart, end = input.selectionEnd;
  const value = input.value;
  if (event.inputType === "insertText" && event.data && mobilePairs[event.data]) {
    event.preventDefault();
    const open = event.data, close = mobilePairs[open], selected = value.slice(start, end);
    if ((open === "\"" || open === "'") && start > 0 && value[start - 1] === "\\") {
      replaceMobileSelection(open, start + 1); return;
    }
    if (!selected && open === close && value[start] === close) {
      input.setSelectionRange(start + 1, start + 1); return;
    }
    replaceMobileSelection(open + selected + close, start + 1, selected ? end + 1 : start + 1);
    return;
  }
  if (event.inputType === "insertText" && event.data && mobileClosers.has(event.data) && start === end && value[start] === event.data) {
    event.preventDefault(); input.setSelectionRange(start + 1, start + 1); return;
  }
  if (event.inputType === "deleteContentBackward" && start === end && start > 0 && mobilePairs[value[start - 1]] === value[start]) {
    event.preventDefault(); input.setSelectionRange(start - 1, start + 1); replaceMobileSelection("", start - 1); return;
  }
  if (event.inputType === "insertLineBreak" || event.inputType === "insertParagraph") {
    event.preventDefault();
    const lineStart = value.lastIndexOf("\n", start - 1) + 1;
    const indent = (value.slice(lineStart, start).match(/^\s*/) || [""])[0];
    const closer = mobilePairs[value[start - 1]];
    if (closer && value[start] === closer) replaceMobileSelection(`\n${indent}    \n${indent}`, start + indent.length + 5);
    else replaceMobileSelection(`\n${indent}`, start + indent.length + 1);
  }
});

elements.mobileSource.addEventListener("keydown", event => {
  if (event.key !== "Tab") return;
  event.preventDefault();
  const start = elements.mobileSource.selectionStart;
  const lineStart = elements.mobileSource.value.lastIndexOf("\n", start - 1) + 1;
  const spaces = " ".repeat(4 - ((start - lineStart) % 4));
  replaceMobileSelection(spaces, start + spaces.length);
});

elements.mobileSource.addEventListener("compositionupdate", () => requestAnimationFrame(updateMobileEditorView));

function updateLanguageMeta() {
  elements.filename.textContent = languageInfo[currentLanguage].filename;
  elements.sourceTitle.textContent = languageInfo[currentLanguage].label;
}
function changeLanguage() {
  if (!editor) return;
  sessionDrafts[currentLanguage] = getSource();
  currentLanguage = elements.language.value;
  localStorage.setItem(LANGUAGE_KEY, currentLanguage);
  setSource(draftFor(currentLanguage));
  monaco.editor.setModelLanguage(editor.getModel(), languageInfo[currentLanguage].monaco);
  updateLanguageMeta();
  elements.saveState.textContent = "Session only";
}
function clearTerminal(showMessage = false) {
  elements.terminal.textContent = "";
  if (showMessage) appendOutput("Ready for output. Run the program to see the result here.", "muted");
}
function appendOutput(text, kind = "output") {
  const span = document.createElement("span");
  const classes = { stderr: "terminal-error", error: "terminal-error", success: "terminal-success", input: "terminal-input", system: "terminal-system", muted: "terminal-muted" };
  span.className = classes[kind] || "";
  span.textContent = text;
  elements.terminal.appendChild(span);
  elements.terminal.scrollTop = elements.terminal.scrollHeight;
  if (window.matchMedia("(max-width: 760px)").matches && !$("terminalTab").classList.contains("active")) elements.outputNotice.classList.add("visible");
}
function setStatus(status, message) {
  const labels = { ready: "Ready", connecting: "Connecting", compiling: "Compiling", running: "Running", success: "Success", "compile-error": "Compile error", "runtime-error": "Runtime error", stopped: "Stopped", timeout: "Time limit", error: "Connection error" };
  elements.statusBadge.className = `status-badge ${status}`;
  elements.statusBadge.textContent = labels[status] || status;
  const busy = ["connecting", "compiling", "running"].includes(status);
  const failed = ["compile-error", "runtime-error", "timeout", "error"].includes(status);
  elements.serverDot.className = `server-dot ${busy ? "busy" : failed ? "error" : "live"}`;
  elements.serverText.textContent = message || labels[status] || status;
  if (["success", "compile-error", "runtime-error", "stopped", "timeout", "error"].includes(status)) {
    isRunning = false; elements.runButton.disabled = false; elements.stopButton.disabled = true; elements.consoleInput.disabled = true; elements.consoleInput.placeholder = "Run a program to enable input";
  } else if (busy) {
    isRunning = true; elements.runButton.disabled = true; elements.stopButton.disabled = false; elements.consoleInput.disabled = status !== "running";
    if (status === "running") { elements.consoleInput.placeholder = "Type one response and press Enter"; if (window.matchMedia("(min-width: 761px)").matches) elements.consoleInput.focus(); }
  }
}
function selectPanel(panelName) {
  document.querySelectorAll(".tab").forEach((tab) => { const active = tab.dataset.panel === panelName; tab.classList.toggle("active", active); tab.setAttribute("aria-selected", String(active)); });
  document.querySelectorAll("[data-panel-name]").forEach((panel) => panel.classList.toggle("active", panel.dataset.panelName === panelName));
  if (panelName === "terminal") elements.outputNotice.classList.remove("visible");
  requestAnimationFrame(() => { editor?.layout(); editor?.render(true); });
}

function runCode() {
  if (!editor || isRunning) return;
  if (socket && socket.readyState < WebSocket.CLOSING) socket.close();
  clearTerminal(); inputHistory = []; renderHistory(); finalStatusSeen = false;
  setStatus("connecting", "Connecting to compiler server");
  appendOutput("Connecting to the compiler server…\n", "system");
  if (window.matchMedia("(max-width: 760px)").matches) selectPanel("terminal");
  const startedConnecting = performance.now();
  wakeTimer = setTimeout(() => {
    if (socket?.readyState === WebSocket.CONNECTING) { elements.serverText.textContent = "Waking Render server — first run may take a moment"; appendOutput("The server is waking up. A free Render service can take 30–60 seconds on the first run.\n", "system"); }
  }, 2500);
  socket = new WebSocket(WS_URL);
  socket.addEventListener("open", () => {
    clearTimeout(wakeTimer);
    appendOutput(`Connected in ${((performance.now() - startedConnecting) / 1000).toFixed(1)}s.\n`, "system");
    socket.send(JSON.stringify({ type: "run", language: currentLanguage, code: getSource() }));
  });
  socket.addEventListener("message", (event) => {
    let data;
    try { data = JSON.parse(event.data); } catch (_error) { appendOutput(String(event.data)); return; }
    if (data.type === "output" || Object.hasOwn(data, "output")) appendOutput(data.output || "", data.stream || "output");
    if (data.type === "error") appendOutput(`\n${data.message}\n`, "error");
    if (data.type === "exit" && data.phase !== "compile") appendOutput(`\n[Process finished${data.code === null ? "" : ` with exit code ${data.code}`} in ${(data.durationMs / 1000).toFixed(2)}s]\n`, data.code === 0 ? "success" : "error");
    if (data.type === "status") { setStatus(data.status, data.message); if (["success", "compile-error", "runtime-error", "stopped", "timeout", "error"].includes(data.status)) finalStatusSeen = true; }
  });
  socket.addEventListener("error", () => { clearTimeout(wakeTimer); appendOutput("\nUnable to connect to the compiler server. Check the Render service and frontend config.\n", "error"); finalStatusSeen = true; setStatus("error", "Compiler server unavailable"); });
  socket.addEventListener("close", () => { clearTimeout(wakeTimer); if (isRunning && !finalStatusSeen) { appendOutput("\n[Connection closed before the program finished]\n", "error"); setStatus("error", "Connection closed"); } });
}
function stopCode() {
  if (!isRunning) return;
  if (socket?.readyState === WebSocket.OPEN) socket.send(JSON.stringify({ type: "stop" })); else socket?.close();
  appendOutput("\nStopping process…\n", "system");
}
function submitInput() {
  const value = elements.consoleInput.value;
  if (socket?.readyState !== WebSocket.OPEN || !isRunning) return;
  socket.send(JSON.stringify({ type: "input", value }));
  inputHistory.push(value); appendOutput(`${value}\n`, "input"); elements.consoleInput.value = ""; renderHistory();
}
function renderHistory() {
  [elements.historyList, elements.inputPreview].forEach((list) => {
    list.textContent = "";
    if (!inputHistory.length) { const empty = document.createElement("li"); empty.className = "empty-history"; empty.textContent = "No input submitted yet."; list.appendChild(empty); return; }
    inputHistory.forEach((value) => { const item = document.createElement("li"); item.textContent = value || "(blank line)"; list.appendChild(item); });
  });
}
function toggleHistory(open) {
  elements.historyDrawer.classList.toggle("open", open); elements.historyDrawer.setAttribute("aria-hidden", String(!open)); document.body.style.overflow = open ? "hidden" : "";
}
function resetCode() {
  if (!editor || !window.confirm(`Reset ${languageInfo[currentLanguage].filename} to the greeting program?`)) return;
  delete sessionDrafts[currentLanguage]; setSource(languageInfo[currentLanguage].template, true);
}
function downloadCode() {
  if (!editor) return;
  const url = URL.createObjectURL(new Blob([getSource()], { type: "text/plain;charset=utf-8" }));
  const link = document.createElement("a"); link.href = url; link.download = languageInfo[currentLanguage].filename; link.click(); URL.revokeObjectURL(url);
}
async function copyText(text, button, normalLabel) {
  if (!text) return;
  try { await navigator.clipboard.writeText(text); button.textContent = "Copied!"; setTimeout(() => { button.textContent = normalLabel; }, 1300); }
  catch (_error) { appendOutput("\nCopy failed. Select the text manually.\n", "error"); }
}

const SPLIT_STORAGE_KEY = "codebhavya.compiler.v3.panel-sizes";
const DEFAULT_SPLITS = { editor: 64, output: 58 };

function clamp(value, minimum, maximum) {
  return Math.min(Math.max(value, minimum), maximum);
}

function syncSourceHeaderWidth() {
  if (!elements.sourcePanel || !elements.sourceHeader) return;
  elements.sourceHeader.style.width = `${elements.sourcePanel.clientWidth}px`;
}

function loadPanelSizes() {
  let sizes;
  try { sizes = JSON.parse(localStorage.getItem(SPLIT_STORAGE_KEY)); } catch (_error) { sizes = null; }
  if (!sizes) return;
  elements.workspace.style.setProperty("--editor-size", `${clamp(Number(sizes.editor) || DEFAULT_SPLITS.editor, 42, 74)}%`);
  elements.sideStack.style.setProperty("--output-size", `${clamp(Number(sizes.output) || DEFAULT_SPLITS.output, 33, 72)}%`);
}

function savePanelSizes() {
  const workspaceRect = elements.workspace.getBoundingClientRect();
  const editorRect = document.querySelector(".source-panel").getBoundingClientRect();
  const sideRect = elements.sideStack.getBoundingClientRect();
  const outputRect = document.querySelector(".output-panel").getBoundingClientRect();
  localStorage.setItem(SPLIT_STORAGE_KEY, JSON.stringify({
    editor: Math.round((editorRect.width / Math.max(workspaceRect.width - 10, 1)) * 1000) / 10,
    output: Math.round((outputRect.height / Math.max(sideRect.height - 10, 1)) * 1000) / 10
  }));
}

function resetPanelSizes() {
  localStorage.removeItem(SPLIT_STORAGE_KEY);
  elements.workspace.style.removeProperty("--editor-size");
  elements.sideStack.style.removeProperty("--output-size");
  requestAnimationFrame(() => { syncSourceHeaderWidth(); editor?.layout(); });
}

function setupSplitter(splitter, orientation) {
  const isVertical = orientation === "vertical";
  let dragging = false;

  function move(clientPosition) {
    if (window.matchMedia("(max-width: 760px)").matches) return;
    const container = (isVertical ? elements.workspace : elements.sideStack).getBoundingClientRect();
    const total = (isVertical ? container.width : container.height) - 10;
    const raw = clientPosition - (isVertical ? container.left : container.top);
    const minimum = isVertical ? 320 : 180;
    const trailingMinimum = isVertical ? 300 : 170;
    const pixels = clamp(raw, minimum, total - trailingMinimum);
    const percent = (pixels / Math.max(total, 1)) * 100;
    (isVertical ? elements.workspace : elements.sideStack).style.setProperty(isVertical ? "--editor-size" : "--output-size", `${percent}%`);
    if (isVertical) syncSourceHeaderWidth();
    editor?.layout();
  }

  splitter.addEventListener("pointerdown", (event) => {
    if (window.matchMedia("(max-width: 760px)").matches) return;
    dragging = true;
    splitter.classList.add("dragging");
    splitter.setPointerCapture(event.pointerId);
    document.documentElement.classList.add("resizing");
    document.documentElement.style.cursor = isVertical ? "col-resize" : "row-resize";
  });
  splitter.addEventListener("pointermove", (event) => { if (dragging) move(isVertical ? event.clientX : event.clientY); });
  splitter.addEventListener("pointerup", (event) => {
    if (!dragging) return;
    dragging = false;
    splitter.classList.remove("dragging");
    if (splitter.hasPointerCapture(event.pointerId)) splitter.releasePointerCapture(event.pointerId);
    document.documentElement.classList.remove("resizing");
    document.documentElement.style.cursor = "";
    savePanelSizes();
  });
  splitter.addEventListener("dblclick", resetPanelSizes);
  splitter.addEventListener("keydown", (event) => {
    const validKeys = isVertical ? ["ArrowLeft", "ArrowRight"] : ["ArrowUp", "ArrowDown"];
    if (!validKeys.includes(event.key)) return;
    event.preventDefault();
    const direction = ["ArrowRight", "ArrowDown"].includes(event.key) ? 1 : -1;
    const target = isVertical ? elements.workspace : elements.sideStack;
    const property = isVertical ? "--editor-size" : "--output-size";
    const current = parseFloat(getComputedStyle(target).getPropertyValue(property)) || (isVertical ? DEFAULT_SPLITS.editor : DEFAULT_SPLITS.output);
    target.style.setProperty(property, `${clamp(current + direction * 2, isVertical ? 42 : 33, isVertical ? 74 : 72)}%`);
    if (isVertical) syncSourceHeaderWidth();
    savePanelSizes();
    editor?.layout();
  });
}

elements.language.addEventListener("change", changeLanguage);
elements.runButton.addEventListener("click", runCode);
elements.stopButton.addEventListener("click", stopCode);
elements.resetButton.addEventListener("click", resetCode);
elements.downloadButton.addEventListener("click", downloadCode);
elements.clearButton.addEventListener("click", () => clearTerminal(true));
elements.copyButton.addEventListener("click", () => copyText(elements.terminal.innerText, elements.copyButton, "Copy output"));
elements.copyCodeButton.addEventListener("click", () => copyText(getSource(), elements.copyCodeButton, "Copy code"));
elements.consoleInput.addEventListener("keydown", (event) => { if (event.key === "Enter") { event.preventDefault(); submitInput(); } });
document.querySelectorAll(".tab").forEach((tab) => tab.addEventListener("click", () => selectPanel(tab.dataset.panel)));
$("historyButton").addEventListener("click", () => toggleHistory(true));
$("closeHistory").addEventListener("click", () => toggleHistory(false));
$("drawerBackdrop").addEventListener("click", () => toggleHistory(false));
$("clearHistory").addEventListener("click", () => { inputHistory = []; renderHistory(); });
elements.menuButton.addEventListener("click", () => { const open = elements.siteNav.classList.toggle("open"); elements.menuButton.setAttribute("aria-expanded", String(open)); elements.menuButton.textContent = open ? "×" : "☰"; });
document.querySelectorAll(".dropdown-toggle").forEach((button) => button.addEventListener("click", (event) => {
  event.stopPropagation();
  const dropdown = button.closest(".nav-dropdown");
  const willOpen = !dropdown.classList.contains("open");
  document.querySelectorAll(".nav-dropdown.open").forEach((item) => { item.classList.remove("open"); item.querySelector(".dropdown-toggle").setAttribute("aria-expanded", "false"); });
  dropdown.classList.toggle("open", willOpen); button.setAttribute("aria-expanded", String(willOpen));
}));
document.addEventListener("click", (event) => { if (!event.target.closest(".nav-dropdown")) document.querySelectorAll(".nav-dropdown.open").forEach((item) => { item.classList.remove("open"); item.querySelector(".dropdown-toggle").setAttribute("aria-expanded", "false"); }); });
elements.siteNav.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => { elements.siteNav.classList.remove("open"); elements.menuButton.setAttribute("aria-expanded", "false"); elements.menuButton.textContent = "☰"; }));
document.addEventListener("keydown", (event) => {
  if ((event.ctrlKey || event.metaKey) && event.key === "Enter") { event.preventDefault(); runCode(); }
  if (event.key === "Escape") { toggleHistory(false); document.querySelectorAll(".nav-dropdown.open").forEach((item) => item.classList.remove("open")); }
});
window.addEventListener("beforeunload", () => {
  if (socket?.readyState === WebSocket.OPEN && isRunning) socket.send(JSON.stringify({ type: "stop" }));
});

$("year").textContent = new Date().getFullYear();
renderHistory();
loadPanelSizes();
syncSourceHeaderWidth();
if ("ResizeObserver" in window) new ResizeObserver(syncSourceHeaderWidth).observe(elements.sourcePanel);
window.addEventListener("resize", syncSourceHeaderWidth);
window.visualViewport?.addEventListener("resize", () => {
  syncSourceHeaderWidth();
  refreshMobileEditor(true, true);
});
mobileEditor.addEventListener?.("change", () => {
  syncEditorMode();
  editor?.updateOptions({
    smoothScrolling: !mobileEditor.matches,
    cursorSmoothCaretAnimation: mobileEditor.matches ? "off" : "on",
    renderLineHighlight: mobileEditor.matches ? "line" : "all"
  });
  refreshMobileEditor(true, true);
});
setupSplitter(elements.verticalSplitter, "vertical");
setupSplitter(elements.horizontalSplitter, "horizontal");
