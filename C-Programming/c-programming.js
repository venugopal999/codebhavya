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
            index: 0,
            timer: null
        };

        vizStates.set(id, state);

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

        dots.innerHTML = s.frames.map((_, i) =>
            `<span class="cb-viz-dot${i === s.index ? " active" : ""}"></span>`
        ).join("");

        const next = document.getElementById(`cbVizNext-${id}`);
        const auto = document.getElementById(`cbVizAuto-${id}`);

        const done = s.index >= s.frames.length - 1;

        next.disabled = done;
        next.textContent = done ? "✓ Completed" : "Next →";

        auto.disabled = done;

        const percent =
            s.frames.length <= 1
                ? 100
                : Math.round(
                    s.index /
                    (s.frames.length - 1) *
                    100
                );

        document.getElementById(
            `cbVizProgress-${id}`
        ).style.width = `${percent}%`;
    }

    window.CBConceptViz = {

        toggle(id) {
            const panel =
                document.getElementById(
                    `cbVizPanel-${id}`
                );

            if (!panel)
                return;

            panel.hidden = !panel.hidden;

            if (!panel.hidden)
                renderViz(id);
        },

        next(id) {
            const s = getViz(id);

            if (
                !s ||
                s.index >= s.frames.length - 1
            )
                return;

            s.index++;

            renderViz(id);
        },

        prev(id) {
            const s = getViz(id);

            if (!s || s.index <= 0)
                return;

            this.pause(id);

            s.index--;

            renderViz(id);
        },

        reset(id) {
            const s = getViz(id);

            if (!s)
                return;

            this.pause(id);

            s.index = 0;

            renderViz(id);
        },

        auto(id) {
            const s = getViz(id);

            if (
                !s ||
                s.timer ||
                s.index >= s.frames.length - 1
            )
                return;

            s.timer = setInterval(() => {

                if (
                    s.index >=
                    s.frames.length - 1
                ) {
                    this.pause(id);
                    renderViz(id);
                    return;
                }

                s.index++;

                renderViz(id);

            }, 900);
        },

        pause(id) {
            const s = getViz(id);

            if (s?.timer) {
                clearInterval(s.timer);
                s.timer = null;
            }
        }
    };


    /* =========================================
       PROGRAM TRACING
       ========================================= */

    const traceStates = new Map();

    function escapeHtml(value) {
        return String(value ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;");
    }

    function getTrace(id) {
        if (traceStates.has(id))
            return traceStates.get(id);

        const root =
            document.querySelector(
                `[data-cb-trace="${id}"]`
            );

        if (!root)
            return null;

        let config = {
            code: [],
            steps: []
        };

        try {
            config =
                JSON.parse(
                    root.dataset.config || "{}"
                );
        } catch {}

        const state = {
            root,
            config,
            index: 0,
            timer: null
        };

        traceStates.set(id, state);

        return state;
    }

    function displayValue(value) {

        if (Array.isArray(value))
            return `[${value
                .map(displayValue)
                .join(", ")}]`;

        if (
            value &&
            typeof value === "object"
        )
            return JSON.stringify(value);

        return String(value ?? "—");
    }

    function renderTrace(id) {

        const s = getTrace(id);

        if (
            !s ||
            !s.config.steps?.length
        )
            return;

        const stepIndex =
            Math.max(
                0,
                s.index - 1
            );

        const step =
            s.config.steps[stepIndex];

        const code =
            document.getElementById(
                `cbTraceCode-${id}`
            );

        code.innerHTML =
            s.config.code
                .map((line, i) =>

                    `<span class="cb-trace-line${
                        i === step.line
                            ? " active"
                            : ""
                    }">${escapeHtml(line)}</span>`

                )
                .join("");

        requestAnimationFrame(() => {

            const active =
                code.querySelector(
                    ".cb-trace-line.active"
                );

            if (!active)
                return;

            const codeRect =
                code.getBoundingClientRect();

            const activeRect =
                active.getBoundingClientRect();

            const activeTopInsideCode =
                code.scrollTop +
                (
                    activeRect.top -
                    codeRect.top
                );

            const activeBottomInsideCode =
                activeTopInsideCode +
                activeRect.height;

            const topSafe =
                code.scrollTop + 34;

            const bottomSafe =
                code.scrollTop +
                code.clientHeight -
                34;

            let newTop =
                code.scrollTop;

            if (
                activeTopInsideCode <
                topSafe
            ) {
                newTop =
                    Math.max(
                        0,
                        activeTopInsideCode -
                        34
                    );
            }
            else if (
                activeBottomInsideCode >
                bottomSafe
            ) {
                newTop =
                    Math.max(
                        0,
                        activeBottomInsideCode -
                        code.clientHeight +
                        34
                    );
            }

            if (
                Math.abs(
                    newTop -
                    code.scrollTop
                ) > 1
            ) {
                code.scrollTo({
                    top: newTop,
                    left: code.scrollLeft,
                    behavior: "smooth"
                });
            }
        });

        document.getElementById(
            `cbTraceNote-${id}`
        ).textContent =
            s.index === 0
                ? "Press Next to start tracing the executable logic."
                : step.note || "";

        const stateHost =
            document.getElementById(
                `cbTraceState-${id}`
            );

        const entries =
            Object.entries(
                step.state || {}
            )
            .filter(
                ([key]) =>
                    key !== "output"
            );

        stateHost.innerHTML =
            entries.map(
                ([key, value]) =>

                    `<div class="cb-state-item">

                        <strong>
                            ${escapeHtml(key)}
                        </strong>

                        <span>
                            ${escapeHtml(
                                displayValue(value)
                            )}
                        </span>

                    </div>`

            ).join("");

        document.getElementById(
            `cbTraceOutput-${id}`
        ).textContent =
            step.state?.output || "—";

        const done =
            s.index >=
            s.config.steps.length;

        const next =
            document.getElementById(
                `cbTraceNext-${id}`
            );

        const auto =
            document.getElementById(
                `cbTraceAuto-${id}`
            );

        next.disabled = done;

        next.textContent =
            done
                ? "✓ Completed"
                : "Next →";

        auto.disabled = done;

        document.getElementById(
            `cbTraceStatus-${id}`
        ).textContent =

            done
                ? `✓ Completed — ${
                    s.config.steps.length
                } steps`
                : `Step ${
                    s.index
                } of ${
                    s.config.steps.length
                }`;
    }

    window.CBProgramTrace = {

        toggle(id) {

            const panel =
                document.getElementById(
                    `cbTracePanel-${id}`
                );

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

            if (
                !s ||
                s.index >=
                s.config.steps.length
            )
                return;

            s.index++;

            renderTrace(id);
        },

        prev(id) {

            const s =
                getTrace(id);

            if (
                !s ||
                s.index <= 0
            )
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

            s.index = 0;

            renderTrace(id);

            requestAnimationFrame(() => {

                document.getElementById(
                    `cbTraceCode-${id}`
                )?.scrollTo({

                    top: 0,
                    left: 0,
                    behavior: "auto"

                });
            });
        },

        auto(id) {

            const s =
                getTrace(id);

            if (
                !s ||
                s.timer ||
                s.index >=
                s.config.steps.length
            )
                return;

            s.timer =
                setInterval(() => {

                    if (
                        s.index >=
                        s.config.steps.length
                    ) {
                        this.pause(id);
                        renderTrace(id);
                        return;
                    }

                    s.index++;

                    renderTrace(id);

                    if (
                        s.index >=
                        s.config.steps.length
                    )
                        this.pause(id);

                }, 700);
        },

        pause(id) {

            const s =
                getTrace(id);

            if (s?.timer) {

                clearInterval(
                    s.timer
                );

                s.timer = null;
            }
        }
    };


    /* =========================================
       SIDEBAR / FOOTER COLLISION
       ========================================= */

    function updateSidebarHeight() {

        const sidebar =
            document.querySelector(
                ".docs-layout > .sidebar"
            );

        const footer =
            document.querySelector(
                ".footer"
            );

        const header =
            document.querySelector(
                ".top-header"
            );

        if (
            !sidebar ||
            !footer
        )
            return;

        if (
            window.innerWidth <= 768
        ) {

            sidebar.style.removeProperty(
                "height"
            );

            sidebar.style.removeProperty(
                "max-height"
            );

            return;
        }

        const headerHeight =
            header
                ? header
                    .getBoundingClientRect()
                    .height
                : 72;

        const footerTop =
            footer
                .getBoundingClientRect()
                .top;

        const normalHeight =
            window.innerHeight -
            headerHeight;

        let height =
            normalHeight;

        if (
            footerTop <
            window.innerHeight
        ) {
            height =
                footerTop -
                headerHeight;
        }

        height =
            Math.max(
                0,
                height
            );

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

    let sidebarRaf = null;

    function queueSidebarUpdate() {

        if (sidebarRaf)
            cancelAnimationFrame(
                sidebarRaf
            );

        sidebarRaf =
            requestAnimationFrame(() => {

                updateSidebarHeight();

                sidebarRaf = null;
            });
    }

    document.addEventListener(
        "DOMContentLoaded",
        () => {

            document
                .querySelectorAll(
                    "[data-cb-viz]"
                )
                .forEach(el => {

                    renderViz(
                        el.dataset.cbViz
                    );
                });

            document
                .querySelectorAll(
                    "[data-cb-trace]"
                )
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
            passive: true
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
   INTRODUCTION TO C
   SHOW ANSWER + BEGINNER PRACTICE
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


/* =========================================
   INTRODUCTION PRACTICE
   ========================================= */

window.CBIntroPractice = (() => {

    const judge0Base =
        "https://ce.judge0.com";

    const cLanguageId = 103;

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
            byId(
                `cbIntroWorkspace-${key}`
            );

        if (!workspace)
            return "";

        try {

            return JSON.parse(
                workspace.dataset.starter ||
                '""'
            );

        }
        catch {

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
                    method: "POST",

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

        if (!response.ok) {

            throw new Error(
                `Judge0 request failed (${response.status})`
            );
        }

        return await response.json();
    }

    function errorText(result) {

        if (
            result.compile_output
        ) {
            return (
                "Compilation Error:\n" +
                result.compile_output
            );
        }

        if (result.stderr) {

            return (
                "Runtime Error:\n" +
                result.stderr
            );
        }

        return (
            result.status?.description ||
            "Execution failed."
        );
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
                byId(
                    `cbIntroCode-${key}`
                );

            const output =
                byId(
                    `cbIntroOutput-${key}`
                );

            if (code) {

                code.value =
                    starterFor(key);
            }

            if (output) {

                output.textContent =
                    "Run your program to see the output.";
            }
        },

        async run(key) {

            const code =
                byId(
                    `cbIntroCode-${key}`
                )?.value || "";

            const stdin =
                byId(
                    `cbIntroInput-${key}`
                )?.value || "";

            const output =
                byId(
                    `cbIntroOutput-${key}`
                );

            const button =
                byId(
                    `cbIntroRun-${key}`
                );

            if (
                !code.trim()
            ) {

                if (output) {

                    output.textContent =
                        "Write your C program first.";
                }

                return;
            }

            if (button)
                button.disabled = true;

            if (output)
                output.textContent =
                    "Running...";

            try {

                const result =
                    await execute(
                        code,
                        stdin
                    );

                if (
                    result.status?.id === 3
                ) {

                    if (output) {

                        output.textContent =
                            result.stdout ?? "";
                    }
                }
                else if (output) {

                    output.textContent =
                        errorText(result);
                }
            }
            catch (error) {

                if (output) {

                    output.textContent =
                        "Could not contact the code execution service.\n" +
                        "Check your internet connection and try again.\n\n" +
                        error.message;
                }
            }
            finally {

                if (button)
                    button.disabled = false;
            }
        }
    };

})();
