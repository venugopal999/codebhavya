(() => {
    "use strict";

    const topicMap = {
        "introduction":"introduction.html",
        "structure":"structure.html",
        "variables":"variables.html",
        "datatypes":"data-types.html",
        "input-output":"input-output.html",
        "operators":"operators.html",
        "expressions":"expressions.html",
        "decision-making":"decision-making.html",
        "loops":"loops.html",
        "arrays":"arrays.html",
        "strings":"strings.html",
        "functions":"functions.html",
        "pointers":"pointers.html",
        "structures":"structures-unions.html",
        "preprocessor":"preprocessor.html",
        "files":"file-handling.html",
        "file-handling":"file-handling.html",
        "dynamic-memory":"dynamic-memory.html",
        "command-line":"command-line.html",
        "bitwise":"bitwise.html",
        "enum-typedef":"enum-typedef.html",
        "precedence":"precedence.html",
        "storage-classes":"storage-classes.html",
        "advanced-preprocessor":"advanced-preprocessor.html",
        "practice":"practice.html"
    };

    window.searchTopics = function() {
        const input = document.getElementById("topicSearch");
        const value = String(input?.value || "").toLowerCase();

        document.querySelectorAll(".cb-topic-link").forEach(link => {
            const match = link.textContent.toLowerCase().includes(value);
            link.style.display = match ? "" : "none";
        });
    };

    document.addEventListener("click", event => {
        const link = event.target.closest('a[href^="#"]');

        if (!link)
            return;

        const id = link.getAttribute("href").slice(1);

        if (!id || document.getElementById(id))
            return;

        if (topicMap[id]) {
            event.preventDefault();
            window.location.href = topicMap[id];
        }
    });

    const vizStates = new Map();

    function getViz(id) {
        if (vizStates.has(id))
            return vizStates.get(id);

        const root = document.querySelector(`[data-cb-viz="${id}"]`);

        if (!root)
            return null;

        let frames = [];

        try {
            frames = JSON.parse(root.dataset.frames || "[]");
        } catch {}

        const state = {
            root,
            frames,
            index:0,
            timer:null
        };

        vizStates.set(id,state);
        return state;
    }

    function renderViz(id) {
        const s = getViz(id);

        if (!s || !s.frames.length)
            return;

        const frame = s.frames[s.index];

        document.getElementById(`cbVizStep-${id}`).textContent =
            `Step ${s.index + 1} of ${s.frames.length}`;

        document.getElementById(`cbVizTitle-${id}`).textContent =
            frame.title || "";

        document.getElementById(`cbVizDetail-${id}`).textContent =
            frame.detail || "";

        const dots = document.getElementById(`cbVizDots-${id}`);
        dots.innerHTML = s.frames.map((_,i) =>
            `<span class="cb-viz-dot${i===s.index?" active":""}"></span>`
        ).join("");

        /* Highlight the visual flow box that matches the current explanation. */
        s.root.querySelectorAll("[data-cb-flow-step]").forEach(element => {
            const isActive = Number(element.dataset.cbFlowStep) === s.index;
            element.classList.toggle("active", isActive);

            if (isActive)
                element.setAttribute("aria-current", "step");
            else
                element.removeAttribute("aria-current");
        });

        const next = document.getElementById(`cbVizNext-${id}`);
        const auto = document.getElementById(`cbVizAuto-${id}`);
        const done = s.index >= s.frames.length - 1;

        next.disabled = done;
        next.textContent = done ? "✓ Completed" : "Next →";
        auto.disabled = done;

        const pct = s.frames.length <= 1
            ? 100
            : Math.round(s.index / (s.frames.length - 1) * 100);

        document.getElementById(`cbVizProgress-${id}`).style.width = `${pct}%`;
    }

    window.CBConceptViz = {
        toggle(id) {
            const panel = document.getElementById(`cbVizPanel-${id}`);
            if (!panel) return;
            panel.hidden = !panel.hidden;
            if (!panel.hidden) renderViz(id);
        },

        next(id) {
            const s=getViz(id);
            if (!s || s.index >= s.frames.length - 1) return;
            s.index++;
            renderViz(id);
        },

        prev(id) {
            const s=getViz(id);
            if (!s || s.index <= 0) return;
            this.pause(id);
            s.index--;
            renderViz(id);
        },

        reset(id) {
            const s=getViz(id);
            if (!s) return;
            this.pause(id);
            s.index=0;
            renderViz(id);
        },

        auto(id) {
            const s=getViz(id);
            if (!s || s.timer || s.index >= s.frames.length - 1) return;

            s.timer=setInterval(() => {
                if (s.index >= s.frames.length - 1) {
                    this.pause(id);
                    renderViz(id);
                    return;
                }

                s.index++;
                renderViz(id);
            },900);
        },

        pause(id) {
            const s=getViz(id);

            if (s?.timer) {
                clearInterval(s.timer);
                s.timer=null;
            }
        }
    };

    const traceStates = new Map();

    function escapeHtml(value) {
        return String(value ?? "")
            .replace(/&/g,"&amp;")
            .replace(/</g,"&lt;")
            .replace(/>/g,"&gt;")
            .replace(/"/g,"&quot;");
    }

    function getTrace(id) {
        if (traceStates.has(id))
            return traceStates.get(id);

        const root = document.querySelector(`[data-cb-trace="${id}"]`);

        if (!root)
            return null;

        let config = {
            code:[],
            steps:[]
        };

        try {
            config = JSON.parse(root.dataset.config || "{}");
        } catch {}

        const state = {
            root,
            config,
            index:0,
            timer:null
        };

        traceStates.set(id,state);
        return state;
    }

    function displayValue(value) {
        if (Array.isArray(value))
            return `[${value.map(displayValue).join(", ")}]`;

        if (value && typeof value === "object")
            return JSON.stringify(value);

        return String(value ?? "—");
    }

    function renderTrace(id) {
        const s=getTrace(id);

        if (!s || !s.config.steps?.length)
            return;

        const stepIndex = Math.max(0,s.index - 1);
        const step = s.config.steps[stepIndex];
        const code = document.getElementById(`cbTraceCode-${id}`);

        code.innerHTML = s.config.code.map((line,i) =>
            `<span class="cb-trace-line${i===step.line?" active":""}">${escapeHtml(line)}</span>`
        ).join("");

        requestAnimationFrame(() => {
            const active = code.querySelector(".cb-trace-line.active");

            if (!active)
                return;

            const codeRect = code.getBoundingClientRect();
            const activeRect = active.getBoundingClientRect();

            const activeTopInsideCode =
                code.scrollTop + (activeRect.top - codeRect.top);

            const activeBottomInsideCode =
                activeTopInsideCode + activeRect.height;

            const topSafe =
                code.scrollTop + 34;

            const bottomSafe =
                code.scrollTop + code.clientHeight - 34;

            let newTop =
                code.scrollTop;

            if (activeTopInsideCode < topSafe) {

                newTop =
                    Math.max(
                        0,
                        activeTopInsideCode - 34
                    );

            } else if (activeBottomInsideCode > bottomSafe) {

                newTop =
                    Math.max(
                        0,
                        activeBottomInsideCode - code.clientHeight + 34
                    );
            }

            if (Math.abs(newTop - code.scrollTop) > 1) {

                code.scrollTo({
                    top:newTop,
                    left:code.scrollLeft,
                    behavior:"smooth"
                });
            }
        });

        document.getElementById(`cbTraceNote-${id}`).textContent =
            s.index === 0
                ? "Press Next to start tracing the executable logic."
                : step.note || "";

        const stateHost =
            document.getElementById(`cbTraceState-${id}`);

        const entries =
            Object.entries(step.state || {})
                .filter(([key]) => key !== "output");

        stateHost.innerHTML =
            entries.map(([key,value]) =>
                `<div class="cb-state-item">
                    <strong>${escapeHtml(key)}</strong>
                    <span>${escapeHtml(displayValue(value))}</span>
                </div>`
            ).join("");

        document.getElementById(`cbTraceOutput-${id}`).textContent =
            step.state?.output || "—";

        const done =
            s.index >= s.config.steps.length;

        const next =
            document.getElementById(`cbTraceNext-${id}`);

        const auto =
            document.getElementById(`cbTraceAuto-${id}`);

        next.disabled =
            done;

        next.textContent =
            done
                ? "✓ Completed"
                : "Next →";

        auto.disabled =
            done;

        document.getElementById(`cbTraceStatus-${id}`).textContent =
            done
                ? `✓ Completed — ${s.config.steps.length} steps`
                : `Step ${s.index} of ${s.config.steps.length}`;
    }

    window.CBProgramTrace = {

        toggle(id) {
            const panel =
                document.getElementById(`cbTracePanel-${id}`);

            if (!panel)
                return;

            panel.hidden =
                !panel.hidden;

            if (!panel.hidden)
                renderTrace(id);
        },

        next(id) {
            const s =
                getTrace(id);

            if (!s || s.index >= s.config.steps.length)
                return;

            s.index++;

            renderTrace(id);
        },

        prev(id) {
            const s =
                getTrace(id);

            if (!s || s.index <= 0)
                return;

            this.pause(id);

            s.index--;

            renderTrace(id);
        },

        reset(id) {
            const s =
                getTrace(id);

            if (!s)
                return;

            this.pause(id);

            s.index=0;

            renderTrace(id);

            requestAnimationFrame(() => {

                document
                    .getElementById(`cbTraceCode-${id}`)
                    ?.scrollTo({
                        top:0,
                        left:0,
                        behavior:"auto"
                    });
            });
        },

        auto(id) {
            const s =
                getTrace(id);

            if (!s || s.timer || s.index >= s.config.steps.length)
                return;

            s.timer =
                setInterval(() => {

                    if (s.index >= s.config.steps.length) {

                        this.pause(id);

                        renderTrace(id);

                        return;
                    }

                    s.index++;

                    renderTrace(id);

                    if (s.index >= s.config.steps.length)
                        this.pause(id);

                },700);
        },

        pause(id) {
            const s =
                getTrace(id);

            if (s?.timer) {

                clearInterval(s.timer);

                s.timer=null;
            }
        }
    };

    function updateSidebarHeight() {

        const sidebar =
            document.querySelector(".docs-layout > .sidebar");

        const footer =
            document.querySelector(".footer");

        const header =
            document.querySelector(".top-header");

        if (!sidebar || !footer)
            return;

        if (window.innerWidth <= 768) {

            sidebar.style.removeProperty("height");

            sidebar.style.removeProperty("max-height");

            return;
        }

        const headerHeight =
            header
                ? header.getBoundingClientRect().height
                : 72;

        const footerTop =
            footer.getBoundingClientRect().top;

        const normalHeight =
            window.innerHeight - headerHeight;

        let height =
            normalHeight;

        if (footerTop < window.innerHeight)
            height = footerTop - headerHeight;

        height =
            Math.max(0,height);

        sidebar.style.setProperty(
            "height",
            `${height}px`,
            "important"
        );

        sidebar.style.setProperty(
            "max-height",
            `${height}px`,
            "important"
        );
    }

    let sidebarRaf=null;

    function queueSidebarUpdate() {

        if (sidebarRaf)
            cancelAnimationFrame(sidebarRaf);

        sidebarRaf =
            requestAnimationFrame(() => {

                updateSidebarHeight();

                sidebarRaf=null;
            });
    }

    document.addEventListener(
        "DOMContentLoaded",
        () => {

            document
                .querySelectorAll("[data-cb-viz]")
                .forEach(el => {

                    renderViz(
                        el.dataset.cbViz
                    );
                });

            document
                .querySelectorAll("[data-cb-trace]")
                .forEach(el => {

                    renderTrace(
                        el.dataset.cbTrace
                    );
                });

            queueSidebarUpdate();
        }
    );

    window.addEventListener(
        "scroll",
        queueSidebarUpdate,
        {
            passive:true
        }
    );

    window.addEventListener(
        "resize",
        queueSidebarUpdate
    );

    window.addEventListener(
        "orientationchange",
        queueSidebarUpdate
    );

})();


/* ============================================================
   INTRODUCTION TO C — SHOW ANSWER + BEGINNER PRACTICE
   ============================================================ */

window.CBShowAnswer = {

    toggle(id, button) {

        const answer =
            document.getElementById(id);

        if (!answer)
            return;

        answer.hidden =
            !answer.hidden;

        if (button) {

            button.textContent =
                answer.hidden
                    ? "Show Answer"
                    : "Hide Answer";
        }
    }
};


window.CBIntroPractice = (() => {

    const judge0Base =
        "https://ce.judge0.com";

    const cLanguageId =
        103;

    function byId(id) {

        return document.getElementById(id);
    }

    function toggleHidden(id) {

        const element =
            byId(id);

        if (element)
            element.hidden =
                !element.hidden;
    }

    function starterFor(key) {

        const workspace =
            byId(`cbIntroWorkspace-${key}`);

        if (!workspace)
            return "";

        try {

            return JSON.parse(
                workspace.dataset.starter ||
                '""'
            );

        } catch {

            return "";
        }
    }

    async function execute(
        code,
        stdin
    ) {

        const response =
            await fetch(
                `${judge0Base}/submissions?base64_encoded=false&wait=true`,
                {
                    method:
                        "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify({
                            source_code:
                                code,

                            language_id:
                                cLanguageId,

                            stdin:
                                stdin
                        })
                }
            );

        if (!response.ok)
            throw new Error(
                `Judge0 request failed (${response.status})`
            );

        return await response.json();
    }

    function errorText(result) {

        if (result.compile_output)
            return `Compilation Error:\n${result.compile_output}`;

        if (result.stderr)
            return `Runtime Error:\n${result.stderr}`;

        return result.status?.description ||
            "Execution failed.";
    }

    return {

        toggleWorkspace(key) {

            toggleHidden(
                `cbIntroWorkspace-${key}`
            );
        },

        toggleHint(key) {

            toggleHidden(
                `cbIntroHint-${key}`
            );
        },

        toggleSolution(key) {

            toggleHidden(
                `cbIntroSolution-${key}`
            );
        },

        reset(key) {

            const code =
                byId(`cbIntroCode-${key}`);

            const output =
                byId(`cbIntroOutput-${key}`);

            if (code)
                code.value =
                    starterFor(key);

            if (output)
                output.textContent =
                    "Run your program to see the output.";
        },

        async run(key) {

            const code =
                byId(`cbIntroCode-${key}`)?.value ||
                "";

            const stdin =
                byId(`cbIntroInput-${key}`)?.value ||
                "";

            const output =
                byId(`cbIntroOutput-${key}`);

            const button =
                byId(`cbIntroRun-${key}`);

            if (!code.trim()) {

                if (output)
                    output.textContent =
                        "Write your C program first.";

                return;
            }

            if (button)
                button.disabled =
                    true;

            if (output)
                output.textContent =
                    "Running...";

            try {

                const result =
                    await execute(
                        code,
                        stdin
                    );

                if (result.status?.id === 3) {

                    if (output)
                        output.textContent =
                            result.stdout ?? "";

                } else if (output) {

                    output.textContent =
                        errorText(result);
                }

            } catch (error) {

                if (output) {

                    output.textContent =
                        "Could not contact the code execution service.\n" +
                        "Check your internet connection and try again.\n\n" +
                        error.message;
                }

            } finally {

                if (button)
                    button.disabled =
                        false;
            }
        }
    };

})();


/* ============================================================
   GENERIC C TOPIC PROGRAMMING PRACTICE
   Reuses the same tested Judge0 workspace used by Introduction.
   ============================================================ */

window.CBTopicPractice =
    window.CBIntroPractice;


/* ============================================================
   CODEBHAVYA C PRACTICE — DSA-STYLE PRACTICE ENGINE
   Progress + Hint/Solution tracking + Run Code + Check Answer
   ============================================================ */

window.CodeBhavyaCPractice = (() => {

    const judge0Base =
        "https://ce.judge0.com";

    const cLanguageId =
        103;

    const configs =
        {};

    const el =
        (name, key) =>
            document.getElementById(
                `${name}-${key}`
            );

    function safeStorageGet(key) {

        try {

            return JSON.parse(
                localStorage.getItem(key) ||
                "null"
            );

        } catch {

            return null;
        }
    }

    function safeStorageSet(
        key,
        value
    ) {

        try {

            localStorage.setItem(
                key,
                JSON.stringify(value)
            );

        } catch {}
    }

    function normalizeOutput(value) {

        return String(value ?? "")
            .replace(/\r\n/g, "\n")
            .trim()
            .replace(/[ \t]+$/gm, "");
    }

    function defaultProgress() {

        return {
            attempts: 0,
            bestScore: 0,
            solved: false,
            completedWithSolution: false,
            hintUsed: false,
            solutionViewed: false
        };
    }

    const progressKey =
        key =>
            `codebhavya.cpractice.${key}`;

    function getProgress(key) {

        return Object.assign(
            defaultProgress(),
            safeStorageGet(
                progressKey(key)
            ) || {}
        );
    }

    function saveProgress(
        key,
        progress
    ) {

        safeStorageSet(
            progressKey(key),
            progress
        );
    }

    function totalProblemCount() {

        return Object.keys(configs).length;
    }

    function updateOverallProgress() {

        const total =
            totalProblemCount();

        if (!total)
            return;

        let solved = 0;

        let completed = 0;

        let totalScore = 0;

        Object.keys(configs)
            .forEach(key => {

                const p =
                    getProgress(key);

                totalScore +=
                    Number(p.bestScore) ||
                    0;

                if (p.solved)
                    solved++;

                else if (p.completedWithSolution)
                    completed++;
            });

        const finished =
            solved + completed;

        const percent =
            Math.round(
                (finished / total) *
                100
            );

        const solvedEl =
            document.getElementById(
                "cbPracticeOverallSolved"
            );

        const completedEl =
            document.getElementById(
                "cbPracticeOverallCompleted"
            );

        const scoreEl =
            document.getElementById(
                "cbPracticeOverallScore"
            );

        const percentEl =
            document.getElementById(
                "cbPracticeOverallPercent"
            );

        const barEl =
            document.getElementById(
                "cbPracticeOverallBar"
            );

        if (solvedEl)
            solvedEl.textContent =
                `${solved} / ${total}`;

        if (completedEl)
            completedEl.textContent =
                String(completed);

        if (scoreEl)
            scoreEl.textContent =
                `${totalScore} / ${total * 100}`;

        if (percentEl)
            percentEl.textContent =
                `${percent}%`;

        if (barEl)
            barEl.style.width =
                `${percent}%`;
    }

    function register(config) {

        configs[config.key] =
            config;

        const code =
            el(
                "practiceCode",
                config.key
            );

        const input =
            el(
                "practiceInput",
                config.key
            );

        if (code)
            code.value =
                config.starterCode;

        if (input)
            input.value =
                config.sampleInput;

        if (code) {

            code.addEventListener(
                "keydown",
                event => {

                    if (event.key === "Tab") {

                        event.preventDefault();

                        const start =
                            code.selectionStart;

                        const end =
                            code.selectionEnd;

                        code.value =
                            code.value.substring(
                                0,
                                start
                            ) +
                            "    " +
                            code.value.substring(
                                end
                            );

                        code.selectionStart =
                            code.selectionEnd =
                            start + 4;
                    }
                }
            );
        }

        renderProgress(
            config.key
        );
    }

    function registerAll(list) {

        list.forEach(register);

        updateOverallProgress();
    }

    function toggle(key) {

        const workspace =
            el(
                "practiceWorkspace",
                key
            );

        if (!workspace)
            return;

        workspace.hidden =
            !workspace.hidden;

        renderProgress(key);
    }

    function markHint(key) {

        const hint =
            el(
                "practiceHint",
                key
            );

        if (hint)
            hint.hidden =
                !hint.hidden;

        const p =
            getProgress(key);

        p.hintUsed =
            true;

        saveProgress(
            key,
            p
        );

        renderProgress(key);
    }

    function markSolution(key) {

        const solution =
            el(
                "practiceSolution",
                key
            );

        if (solution)
            solution.hidden =
                !solution.hidden;

        const p =
            getProgress(key);

        p.solutionViewed =
            true;

        saveProgress(
            key,
            p
        );

        renderProgress(key);
    }

    async function executeC(
        code,
        stdin
    ) {

        const response =
            await fetch(
                `${judge0Base}/submissions?base64_encoded=false&wait=true`,
                {
                    method:
                        "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify({
                            language_id:
                                cLanguageId,

                            source_code:
                                code,

                            stdin:
                                stdin,

                            cpu_time_limit:
                                2,

                            wall_time_limit:
                                5,

                            memory_limit:
                                128000
                        })
                }
            );

        let result =
            null;

        try {

            result =
                await response.json();

        } catch {}

        if (!response.ok) {

            throw new Error(
                result?.message ||
                result?.error ||
                `Judge0 returned HTTP ${response.status}.`
            );
        }

        const description =
            String(
                result?.status?.description ||
                ""
            ).trim();

        const stdout =
            result?.stdout ?? "";

        const stderr =
            result?.stderr ?? "";

        const compileOutput =
            result?.compile_output ?? "";

        const message =
            result?.message ?? "";

        if (description === "Accepted") {

            return {
                ok: true,
                type: "success",
                output: stdout
            };
        }

        if (
            /compilation/i.test(description) ||
            compileOutput
        ) {

            return {
                ok: false,
                type: "compile",
                output:
                    compileOutput ||
                    stderr ||
                    message ||
                    description ||
                    "Compilation failed."
            };
        }

        return {
            ok: false,
            type: "runtime",
            output:
                stderr ||
                message ||
                description ||
                "Program execution failed."
        };
    }

    function setBusy(
        key,
        busy
    ) {

        const run =
            el(
                "practiceRun",
                key
            );

        const check =
            el(
                "practiceCheck",
                key
            );

        if (run)
            run.disabled =
                busy;

        if (check)
            check.disabled =
                busy;
    }

    async function runSample(key) {

        const cfg =
            configs[key];

        if (!cfg)
            return;

        const code =
            el(
                "practiceCode",
                key
            )?.value || "";

        const stdin =
            el(
                "practiceInput",
                key
            )?.value || "";

        const output =
            el(
                "practiceOutput",
                key
            );

        if (!code.trim()) {

            if (output)
                output.textContent =
                    "Please write your C program first.";

            return;
        }

        setBusy(
            key,
            true
        );

        if (output)
            output.textContent =
                "Compiling and running...";

        try {

            const result =
                await executeC(
                    code,
                    stdin
                );

            if (output)
                output.textContent =
                    result.output ||
                    "(Program finished with no output)";

        } catch (error) {

            if (output)
                output.textContent =
                    "Unable to run code: " +
                    error.message +
                    "\n\nThe online compiler may be temporarily unavailable. Please try again.";

        } finally {

            setBusy(
                key,
                false
            );
        }
    }

    async function checkAnswer(key) {

        const cfg =
            configs[key];

        if (!cfg)
            return;

        const code =
            el(
                "practiceCode",
                key
            )?.value || "";

        const output =
            el(
                "practiceOutput",
                key
            );

        const testsEl =
            el(
                "practiceTests",
                key
            );

        if (!code.trim()) {

            if (output)
                output.textContent =
                    "Please write your C program first.";

            return;
        }

        const p =
            getProgress(key);

        p.attempts +=
            1;

        saveProgress(
            key,
            p
        );

        setBusy(
            key,
            true
        );

        if (testsEl)
            testsEl.innerHTML =
                "";

        if (output)
            output.textContent =
                "Checking your program against the test cases...";

        let passed =
            0;

        let stoppedByError =
            false;

        try {

            for (
                let i = 0;
                i < cfg.tests.length;
                i++
            ) {

                const test =
                    cfg.tests[i];

                const result =
                    await executeC(
                        code,
                        test.input
                    );

                if (!result.ok) {

                    stoppedByError =
                        true;

                    const row =
                        document.createElement(
                            "div"
                        );

                    row.className =
                        "cb-c-test-row fail";

                    row.innerHTML =
                        `<span>${
                            i === 0
                                ? "Sample Test"
                                : "Hidden Test " + i
                        }</span>` +
                        `<strong>❌ ${
                            result.type === "compile"
                                ? "Compile Error"
                                : "Runtime Error"
                        }</strong>`;

                    testsEl?.appendChild(
                        row
                    );

                    if (output)
                        output.textContent =
                            result.output;

                    break;
                }

                const actual =
                    normalizeOutput(
                        result.output
                    );

                const expected =
                    normalizeOutput(
                        test.expected
                    );

                const ok =
                    actual === expected;

                if (ok)
                    passed++;

                const row =
                    document.createElement(
                        "div"
                    );

                row.className =
                    "cb-c-test-row " +
                    (
                        ok
                            ? "pass"
                            : "fail"
                    );

                row.innerHTML =
                    `<span>${
                        i === 0
                            ? "Sample Test"
                            : "Hidden Test " + i
                    }</span>` +
                    `<strong>${
                        ok
                            ? "✅ Passed"
                            : "❌ Failed"
                    }</strong>`;

                testsEl?.appendChild(
                    row
                );

                if (
                    !ok &&
                    i === 0 &&
                    output
                ) {

                    output.textContent =
                        `Your output:\n${
                            result.output ||
                            "(no output)"
                        }\nExpected:\n${
                            test.expected
                        }`;
                }
            }

            const allPassed =
                !stoppedByError &&
                passed ===
                cfg.tests.length;

            const latest =
                getProgress(key);

            const competitiveMax =
                latest.solutionViewed
                    ? 0
                    : (
                        latest.hintUsed
                            ? 90
                            : 100
                    );

            const score =
                competitiveMax === 0
                    ? 0
                    : Math.round(
                        (
                            passed /
                            cfg.tests.length
                        ) *
                        competitiveMax
                    );

            if (
                competitiveMax >
                0
            ) {

                latest.bestScore =
                    Math.max(
                        latest.bestScore,
                        score
                    );
            }

            if (allPassed) {

                if (latest.solutionViewed)

                    latest.completedWithSolution =
                        true;

                else

                    latest.solved =
                        true;
            }

            saveProgress(
                key,
                latest
            );

            renderProgress(
                key,
                {
                    passed,
                    total:
                        cfg.tests.length,
                    score,
                    allPassed
                }
            );

            if (
                allPassed &&
                output
            ) {

                output.textContent =
                    latest.solutionViewed
                        ? "All test cases passed. You completed the problem after viewing the solution."
                        : "All test cases passed successfully. 🎉";

            } else if (
                !stoppedByError &&
                output &&
                output.textContent ===
                "Checking your program against the test cases..."
            ) {

                output.textContent =
                    `${passed} of ${cfg.tests.length} test cases passed. Review your logic and try again.`;
            }

        } catch (error) {

            if (testsEl)
                testsEl.innerHTML =
                    '<div class="cb-c-test-row fail"><span>Code execution service</span><strong>❌ Unavailable</strong></div>';

            if (output)
                output.textContent =
                    "Unable to check your answer: " +
                    error.message +
                    "\n\nThe online compiler may be temporarily unavailable. Please try again.";

            renderProgress(key);

        } finally {

            setBusy(
                key,
                false
            );
        }
    }

    function renderProgress(
        key,
        session
    ) {

        const p =
            getProgress(key);

        const score =
            el(
                "practiceScore",
                key
            );

        const attempts =
            el(
                "practiceAttempts",
                key
            );

        const status =
            el(
                "practiceStatus",
                key
            );

        const message =
            el(
                "practiceMessage",
                key
            );

        const badge =
            el(
                "practiceBadge",
                key
            );

        if (score)
            score.textContent =
                `${p.bestScore} / 100`;

        if (attempts)
            attempts.textContent =
                String(
                    p.attempts
                );

        if (p.solved) {

            if (status)
                status.textContent =
                    "Solved";

            if (badge) {

                badge.className =
                    "cb-practice-badge solved";

                badge.textContent =
                    "✅ SOLVED";
            }

        } else if (
            p.completedWithSolution
        ) {

            if (status)
                status.textContent =
                    "Completed";

            if (badge) {

                badge.className =
                    "cb-practice-badge completed";

                badge.textContent =
                    "📘 COMPLETED";
            }

        } else {

            if (status)
                status.textContent =
                    "Not Solved";

            if (badge) {

                badge.className =
                    "cb-practice-badge";

                badge.textContent =
                    "";
            }
        }

        updateOverallProgress();

        if (!message)
            return;

        if (
            session &&
            session.allPassed
        ) {

            if (p.solutionViewed)

                message.textContent =
                    "✅ Problem completed! You passed every test case after studying the solution.";

            else if (p.hintUsed)

                message.textContent =
                    "🎉 All test cases passed. You solved it with a hint and can earn up to 90 marks.";

            else

                message.textContent =
                    "🏆 Congratulations! All test cases passed — excellent work!";

        } else if (session) {

            const ratio =
                session.passed /
                session.total;

            if (ratio >= .8)

                message.textContent =
                    "👏 Very good! You are almost there. Fix the remaining case and try again.";

            else if (ratio >= .4)

                message.textContent =
                    "💪 Good attempt! Some cases are working. Review your logic and try again.";

            else

                message.textContent =
                    "🔍 Keep trying. Test your logic carefully with different inputs.";

        } else if (p.solved) {

            message.textContent =
                "🏆 You have already solved this problem. Try rewriting it without looking at your previous code.";

        } else if (
            p.solutionViewed
        ) {

            message.textContent =
                "📘 You viewed the solution. You can still practice and complete the problem, but it will not receive a competitive score.";

        } else if (
            p.hintUsed
        ) {

            message.textContent =
                "💡 Hint used. Solve the problem now — you can still earn up to 90 marks.";

        } else {

            message.textContent =
                "Write your C program and test it. You can do it! 💪";
        }
    }

    function resetEditor(key) {

        const cfg =
            configs[key];

        if (!cfg)
            return;

        const code =
            el(
                "practiceCode",
                key
            );

        const input =
            el(
                "practiceInput",
                key
            );

        const output =
            el(
                "practiceOutput",
                key
            );

        const tests =
            el(
                "practiceTests",
                key
            );

        if (code)
            code.value =
                cfg.starterCode;

        if (input)
            input.value =
                cfg.sampleInput;

        if (output)
            output.textContent =
                "Run your program to see the output.";

        if (tests)
            tests.innerHTML =
                '<div class="cb-c-test-row"><span>No tests checked yet.</span><strong>—</strong></div>';

        renderProgress(key);
    }

    return {
        register,
        registerAll,
        toggle,
        markHint,
        markSolution,
        runSample,
        checkAnswer,
        resetEditor
    };

})();
