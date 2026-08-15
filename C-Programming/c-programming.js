(() => {
    "use strict";

    /* ============================================================
       C PROGRAMMING TOPIC NAVIGATION
       ============================================================ */

    const topicMap = {
        "introduction": "introduction.html",
        "structure": "structure.html",
        "variables": "variables.html",
        "datatypes": "data-types.html",
        "input-output": "input-output.html",
        "operators": "operators.html",
        "expressions": "expressions.html",
        "decision-making": "decision-making.html",
        "loops": "loops.html",
        "arrays": "arrays.html",
        "strings": "strings.html",
        "functions": "functions.html",
        "pointers": "pointers.html",
        "structures": "structures-unions.html",
        "preprocessor": "preprocessor.html",
        "files": "file-handling.html",
        "file-handling": "file-handling.html",
        "dynamic-memory": "dynamic-memory.html",
        "command-line": "command-line.html",
        "bitwise": "bitwise.html",
        "enum-typedef": "enum-typedef.html",
        "precedence": "precedence.html",
        "storage-classes": "storage-classes.html",
        "advanced-preprocessor": "advanced-preprocessor.html",
        "practice": "practice.html"
    };


    /* ============================================================
       SIDEBAR TOPIC SEARCH
       ============================================================ */

    window.searchTopics = function () {

        const input =
            document.getElementById("topicSearch");

        const value =
            String(input?.value || "")
                .toLowerCase();


        document
            .querySelectorAll(".cb-topic-link")
            .forEach(link => {

                const matched =
                    link.textContent
                        .toLowerCase()
                        .includes(value);

                link.style.display =
                    matched
                        ? ""
                        : "none";
            });
    };


    /* ============================================================
       OLD HASH LINK SUPPORT
       ============================================================ */

    document.addEventListener(
        "click",
        event => {

            const link =
                event.target.closest(
                    'a[href^="#"]'
                );

            if (!link)
                return;


            const id =
                link
                    .getAttribute("href")
                    .slice(1);


            if (
                !id ||
                document.getElementById(id)
            )
                return;


            if (topicMap[id]) {

                event.preventDefault();

                window.location.href =
                    topicMap[id];
            }
        }
    );


    /* ============================================================
       CONCEPT VISUALIZER
       Previous | Next | Auto Run | Pause | Reset
       ============================================================ */

    const vizStates =
        new Map();


    function getViz(id) {

        if (
            vizStates.has(id)
        ) {

            return vizStates.get(id);
        }


        const root =
            document.querySelector(
                `[data-cb-viz="${id}"]`
            );


        if (!root)
            return null;


        let frames = [];


        try {

            frames =
                JSON.parse(
                    root.dataset.frames ||
                    "[]"
                );

        } catch (error) {

            console.error(
                "Visualizer data error:",
                error
            );
        }


        const state = {

            root: root,

            frames: frames,

            index: 0,

            timer: null
        };


        vizStates.set(
            id,
            state
        );


        return state;
    }


    function renderViz(id) {

        const state =
            getViz(id);


        if (
            !state ||
            !state.frames.length
        )
            return;


        const frame =
            state.frames[
                state.index
            ];


        const step =
            document.getElementById(
                `cbVizStep-${id}`
            );


        const title =
            document.getElementById(
                `cbVizTitle-${id}`
            );


        const detail =
            document.getElementById(
                `cbVizDetail-${id}`
            );


        const dots =
            document.getElementById(
                `cbVizDots-${id}`
            );


        const next =
            document.getElementById(
                `cbVizNext-${id}`
            );


        const auto =
            document.getElementById(
                `cbVizAuto-${id}`
            );


        const progress =
            document.getElementById(
                `cbVizProgress-${id}`
            );


        /* Step counter */

        if (step) {

            step.textContent =
                `Step ${
                    state.index + 1
                } of ${
                    state.frames.length
                }`;
        }


        /* Current explanation */

        if (title) {

            title.textContent =
                frame.title || "";
        }


        if (detail) {

            detail.textContent =
                frame.detail || "";
        }


        /* Progress dots */

        if (dots) {

            dots.innerHTML =

                state.frames
                    .map(
                        (_, index) =>

                            `<span class="cb-viz-dot${
                                index === state.index
                                    ? " active"
                                    : ""
                            }"></span>`
                    )
                    .join("");
        }


        /* ========================================================
           ACTIVE FLOW BOX

           If main() is currently explained,
           main() box becomes active.

           data-cb-flow-step="0"
           data-cb-flow-step="1"
           etc.
           ======================================================== */

        state.root
            .querySelectorAll(
                "[data-cb-flow-step]"
            )
            .forEach(
                element => {

                    const isActive =

                        Number(
                            element.dataset.cbFlowStep
                        ) ===
                        state.index;


                    element.classList.toggle(
                        "active",
                        isActive
                    );


                    if (isActive) {

                        element.setAttribute(
                            "aria-current",
                            "step"
                        );

                    } else {

                        element.removeAttribute(
                            "aria-current"
                        );
                    }
                }
            );


        const completed =

            state.index >=
            state.frames.length - 1;


        /* Next button */

        if (next) {

            next.disabled =
                completed;


            next.textContent =

                completed

                    ? "✓ Completed"

                    : "Next →";
        }


        /* Auto Run */

        if (auto) {

            auto.disabled =
                completed;
        }


        /* Progress bar */

        if (progress) {

            const percentage =

                state.frames.length <= 1

                    ? 100

                    : Math.round(

                        state.index /

                        (
                            state.frames.length -
                            1
                        )

                        * 100
                    );


            progress.style.width =
                `${percentage}%`;
        }
    }


    window.CBConceptViz = {

        toggle(id) {

            const panel =
                document.getElementById(
                    `cbVizPanel-${id}`
                );


            if (!panel)
                return;


            panel.hidden =
                !panel.hidden;


            if (
                !panel.hidden
            ) {

                renderViz(id);
            }
        },


        next(id) {

            const state =
                getViz(id);


            if (
                !state ||
                state.index >=
                state.frames.length - 1
            )
                return;


            state.index++;


            renderViz(id);
        },


        prev(id) {

            const state =
                getViz(id);


            if (
                !state ||
                state.index <= 0
            )
                return;


            this.pause(id);


            state.index--;


            renderViz(id);
        },


        reset(id) {

            const state =
                getViz(id);


            if (!state)
                return;


            this.pause(id);


            state.index = 0;


            renderViz(id);
        },


        auto(id) {

            const state =
                getViz(id);


            if (
                !state ||
                state.timer ||
                state.index >=
                state.frames.length - 1
            )
                return;


            state.timer =

                setInterval(
                    () => {

                        if (
                            state.index >=
                            state.frames.length - 1
                        ) {

                            this.pause(id);


                            renderViz(id);


                            return;
                        }


                        state.index++;


                        renderViz(id);

                    },
                    900
                );
        },


        pause(id) {

            const state =
                getViz(id);


            if (
                state &&
                state.timer
            ) {

                clearInterval(
                    state.timer
                );


                state.timer =
                    null;
            }
        }
    };


    /* ============================================================
       PROGRAM TRACING
       ============================================================ */

    const traceStates =
        new Map();


    function escapeHtml(value) {

        return String(
            value ?? ""
        )

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        );
    }


    function displayValue(value) {

        if (
            Array.isArray(value)
        ) {

            return `[${

                value
                    .map(
                        displayValue
                    )
                    .join(", ")

            }]`;
        }


        if (
            value &&
            typeof value ===
            "object"
        ) {

            return JSON.stringify(
                value
            );
        }


        return String(
            value ?? "—"
        );
    }


    function getTrace(id) {

        if (
            traceStates.has(id)
        ) {

            return traceStates.get(id);
        }


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
                    root.dataset.config ||
                    "{}"
                );

        } catch (error) {

            console.error(
                "Tracer configuration error:",
                error
            );
        }


        const state = {

            root: root,

            config: config,

            index: 0,

            timer: null
        };


        traceStates.set(
            id,
            state
        );


        return state;
    }


    function renderTrace(id) {

        const state =
            getTrace(id);


        if (
            !state ||
            !state.config.steps ||
            !state.config.steps.length
        )
            return;


        const stepIndex =

            Math.max(
                0,
                state.index - 1
            );


        const step =

            state.config.steps[
                stepIndex
            ];


        const code =
            document.getElementById(
                `cbTraceCode-${id}`
            );


        const note =
            document.getElementById(
                `cbTraceNote-${id}`
            );


        const stateHost =
            document.getElementById(
                `cbTraceState-${id}`
            );


        const output =
            document.getElementById(
                `cbTraceOutput-${id}`
            );


        const next =
            document.getElementById(
                `cbTraceNext-${id}`
            );


        const auto =
            document.getElementById(
                `cbTraceAuto-${id}`
            );


        const status =
            document.getElementById(
                `cbTraceStatus-${id}`
            );


        /* ========================================================
           CODE DISPLAY
           ======================================================== */

        if (code) {

            code.innerHTML =

                state.config.code
                    .map(
                        (line, index) =>

                            `<span class="cb-trace-line${
                                index === step.line
                                    ? " active"
                                    : ""
                            }">${escapeHtml(
                                line
                            )}</span>`
                    )
                    .join("");


            /* ====================================================
               AUTO-SCROLL ONLY INSIDE CODE PANE
               Never moves the complete webpage.
               ==================================================== */

            requestAnimationFrame(
                () => {

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

                        code.scrollTop +
                        34;


                    const bottomSafe =

                        code.scrollTop +

                        code.clientHeight -

                        34;


                    let newScrollTop =

                        code.scrollTop;


                    if (
                        activeTopInsideCode <
                        topSafe
                    ) {

                        newScrollTop =

                            Math.max(
                                0,
                                activeTopInsideCode -
                                34
                            );

                    } else if (
                        activeBottomInsideCode >
                        bottomSafe
                    ) {

                        newScrollTop =

                            Math.max(

                                0,

                                activeBottomInsideCode -

                                code.clientHeight +

                                34
                            );
                    }


                    if (
                        Math.abs(

                            newScrollTop -

                            code.scrollTop

                        ) > 1
                    ) {

                        code.scrollTo({

                            top:
                                newScrollTop,

                            left:
                                code.scrollLeft,

                            behavior:
                                "smooth"
                        });
                    }
                }
            );
        }


        /* Current Operation */

        if (note) {

            note.textContent =

                state.index === 0

                    ? "Press Next to start tracing the executable logic."

                    : step.note || "";
        }


        /* Live Variables */

        if (stateHost) {

            const entries =

                Object.entries(
                    step.state || {}
                )

                .filter(
                    ([key]) =>
                        key !== "output"
                );


            stateHost.innerHTML =

                entries
                    .map(
                        ([key, value]) =>

                            `<div class="cb-state-item">

                                <strong>
                                    ${escapeHtml(
                                        key
                                    )}
                                </strong>

                                <span>
                                    ${escapeHtml(
                                        displayValue(
                                            value
                                        )
                                    )}
                                </span>

                            </div>`
                    )
                    .join("");
        }


        /* Program Output */

        if (output) {

            output.textContent =

                step.state?.output ||
                "—";
        }


        const completed =

            state.index >=
            state.config.steps.length;


        /* Next button */

        if (next) {

            next.disabled =
                completed;


            next.textContent =

                completed

                    ? "✓ Completed"

                    : "Next →";
        }


        /* Auto Run */

        if (auto) {

            auto.disabled =
                completed;
        }


        /* Status */

        if (status) {

            status.textContent =

                completed

                    ? `✓ Completed — ${
                        state.config.steps.length
                    } steps`

                    : `Step ${
                        state.index
                    } of ${
                        state.config.steps.length
                    }`;
        }
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


            if (
                !panel.hidden
            ) {

                renderTrace(id);
            }
        },


        next(id) {

            const state =
                getTrace(id);


            if (
                !state ||
                state.index >=
                state.config.steps.length
            )
                return;


            state.index++;


            renderTrace(id);
        },


        prev(id) {

            const state =
                getTrace(id);


            if (
                !state ||
                state.index <= 0
            )
                return;


            this.pause(id);


            state.index--;


            renderTrace(id);
        },


        reset(id) {

            const state =
                getTrace(id);


            if (!state)
                return;


            this.pause(id);


            state.index = 0;


            renderTrace(id);


            requestAnimationFrame(
                () => {

                    document
                        .getElementById(
                            `cbTraceCode-${id}`
                        )
                        ?.scrollTo({

                            top: 0,

                            left: 0,

                            behavior:
                                "auto"
                        });
                }
            );
        },


        auto(id) {

            const state =
                getTrace(id);


            if (
                !state ||
                state.timer ||
                state.index >=
                state.config.steps.length
            )
                return;


            state.timer =

                setInterval(
                    () => {

                        if (
                            state.index >=
                            state.config.steps.length
                        ) {

                            this.pause(id);


                            renderTrace(id);


                            return;
                        }


                        state.index++;


                        renderTrace(id);


                        if (
                            state.index >=
                            state.config.steps.length
                        ) {

                            this.pause(id);
                        }

                    },
                    700
                );
        },


        pause(id) {

            const state =
                getTrace(id);


            if (
                state &&
                state.timer
            ) {

                clearInterval(
                    state.timer
                );


                state.timer =
                    null;
            }
        }
    };


    /* ============================================================
       SIDEBAR / FOOTER COLLISION FIX
       ============================================================ */

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


        /* Mobile */

        if (
            window.innerWidth <=
            768
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


        /*
         When the footer enters the viewport,
         shorten the sidebar so it ends exactly
         above the footer.
        */

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


    let sidebarRaf =
        null;


    function queueSidebarUpdate() {

        if (sidebarRaf) {

            cancelAnimationFrame(
                sidebarRaf
            );
        }


        sidebarRaf =

            requestAnimationFrame(
                () => {

                    updateSidebarHeight();


                    sidebarRaf =
                        null;
                }
            );
    }


    /* ============================================================
       PAGE INITIALIZATION
       ============================================================ */

    document.addEventListener(

        "DOMContentLoaded",

        () => {

            /* Initialize Visualizers */

            document
                .querySelectorAll(
                    "[data-cb-viz]"
                )
                .forEach(
                    element => {

                        renderViz(
                            element.dataset.cbViz
                        );
                    }
                );


            /* Initialize Program Tracers */

            document
                .querySelectorAll(
                    "[data-cb-trace]"
                )
                .forEach(
                    element => {

                        renderTrace(
                            element.dataset.cbTrace
                        );
                    }
                );


            /* Sidebar */

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
   SHOW ANSWER / HIDE ANSWER

   Used by:
   - Practice Questions
   - Interview Questions
   ============================================================ */

window.CBShowAnswer = {

    toggle(id, button) {

        const answer =
            document.getElementById(
                id
            );


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



/* ============================================================
   LEGACY C TOPIC PRACTICE SUPPORT

   Kept so older C pages continue to work.
   ============================================================ */

window.CBIntroPractice = (() => {

    const judge0Base =
        "https://ce.judge0.com";


    const cLanguageId =
        103;


    function byId(id) {

        return document.getElementById(
            id
        );
    }


    function toggleHidden(id) {

        const element =
            byId(id);


        if (element) {

            element.hidden =
                !element.hidden;
        }
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


        if (
            result.stderr
        ) {

            return (

                "Runtime Error:\n" +

                result.stderr
            );
        }


        if (
            result.message
        ) {

            return result.message;
        }


        return (

            result.status
                ?.description ||

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


            if (button) {

                button.disabled =
                    true;
            }


            if (output) {

                output.textContent =
                    "Running...";
            }


            try {

                const result =

                    await execute(
                        code,
                        stdin
                    );


                if (
                    result.status?.id ===
                    3
                ) {

                    if (output) {

                        output.textContent =

                            result.stdout ??
                            "";
                    }

                } else if (output) {

                    output.textContent =

                        errorText(
                            result
                        );
                }

            } catch (error) {

                if (output) {

                    output.textContent =

                        "Could not contact the code execution service.\n" +

                        "Check your internet connection and try again.\n\n" +

                        error.message;
                }

            } finally {

                if (button) {

                    button.disabled =
                        false;
                }
            }
        }
    };

})();


/* ============================================================
   GENERIC OLD C TOPIC SUPPORT
   ============================================================ */

window.CBTopicPractice =
    window.CBIntroPractice;



/* ============================================================
   CODEBHAVYA C PRACTICE — DSA-STYLE PRACTICE ENGINE

   Features:

   ✓ Solve It Yourself
   ✓ Hint
   ✓ Show Program
   ✓ Run Code
   ✓ Check Answer
   ✓ Sample Test
   ✓ Hidden Tests
   ✓ Best Score
   ✓ Attempts
   ✓ Solved Status
   ✓ Completed With Solution
   ✓ Overall Score
   ✓ Completion Percentage
   ✓ LocalStorage Progress
   ============================================================ */

window.CodeBhavyaCPractice = (() => {

    const judge0Base =
        "https://ce.judge0.com";


    const cLanguageId =
        103;


    const configs = {};


    /* ============================================================
       ELEMENT HELPER
       ============================================================ */

    const el = (
        name,
        key
    ) =>

        document.getElementById(
            `${name}-${key}`
        );


    /* ============================================================
       SAFE LOCAL STORAGE
       ============================================================ */

    function safeStorageGet(key) {

        try {

            return JSON.parse(

                localStorage.getItem(
                    key
                ) ||

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

                JSON.stringify(
                    value
                )
            );

        } catch {

            /* Ignore storage errors */
        }
    }


    /* ============================================================
       OUTPUT NORMALIZATION
       ============================================================ */

    function normalizeOutput(value) {

        return String(
            value ?? ""
        )

        .replace(
            /\r\n/g,
            "\n"
        )

        .trim()

        .replace(
            /[ \t]+$/gm,
            ""
        );
    }


    /* ============================================================
       DEFAULT PROGRESS
       ============================================================ */

    function defaultProgress() {

        return {

            attempts: 0,

            bestScore: 0,

            solved: false,

            completedWithSolution:
                false,

            hintUsed:
                false,

            solutionViewed:
                false
        };
    }


    const progressKey = key =>

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


    /* ============================================================
       OVERALL PRACTICE PROGRESS
       ============================================================ */

    function updateOverallProgress() {

        const keys =
            Object.keys(
                configs
            );


        const total =
            keys.length;


        if (!total)
            return;


        let solved = 0;

        let completed = 0;

        let totalScore = 0;


        keys.forEach(
            key => {

                const progress =
                    getProgress(key);


                totalScore +=

                    Number(
                        progress.bestScore
                    ) || 0;


                if (
                    progress.solved
                ) {

                    solved++;

                } else if (
                    progress.completedWithSolution
                ) {

                    completed++;
                }
            }
        );


        const finished =

            solved +
            completed;


        const percentage =

            Math.round(

                finished /

                total *

                100
            );


        const solvedElement =

            document.getElementById(
                "cbPracticeOverallSolved"
            );


        const completedElement =

            document.getElementById(
                "cbPracticeOverallCompleted"
            );


        const scoreElement =

            document.getElementById(
                "cbPracticeOverallScore"
            );


        const percentageElement =

            document.getElementById(
                "cbPracticeOverallPercent"
            );


        const barElement =

            document.getElementById(
                "cbPracticeOverallBar"
            );


        if (solvedElement) {

            solvedElement.textContent =

                `${solved} / ${total}`;
        }


        if (completedElement) {

            completedElement.textContent =

                String(
                    completed
                );
        }


        if (scoreElement) {

            scoreElement.textContent =

                `${totalScore} / ${
                    total * 100
                }`;
        }


        if (percentageElement) {

            percentageElement.textContent =

                `${percentage}%`;
        }


        if (barElement) {

            barElement.style.width =

                `${percentage}%`;
        }
    }


    /* ============================================================
       REGISTER ONE PROBLEM
       ============================================================ */

    function register(config) {

        if (
            !config ||
            !config.key
        )
            return;


        configs[
            config.key
        ] = config;


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


        /* Starter code */

        if (code) {

            code.value =
                config.starterCode ||
                "";
        }


        /* Sample input */

        if (input) {

            input.value =
                config.sampleInput ||
                "";
        }


        /* ========================================================
           TAB KEY INSIDE CODE EDITOR
           ======================================================== */

        if (
            code &&
            !code.dataset.cbTabReady
        ) {

            code.dataset.cbTabReady =
                "true";


            code.addEventListener(

                "keydown",

                event => {

                    if (
                        event.key !==
                        "Tab"
                    )
                        return;


                    event.preventDefault();


                    const start =

                        code.selectionStart;


                    const end =

                        code.selectionEnd;


                    code.value =

                        code.value.substring(
                            0,
                            start
                        )

                        +

                        "    "

                        +

                        code.value.substring(
                            end
                        );


                    code.selectionStart =

                        code.selectionEnd =

                        start + 4;
                }
            );
        }


        renderProgress(
            config.key
        );
    }


    /* ============================================================
       REGISTER ALL PROBLEMS
       ============================================================ */

    function registerAll(list) {

        if (
            !Array.isArray(list)
        )
            return;


        list.forEach(
            register
        );


        updateOverallProgress();
    }


    /* ============================================================
       SOLVE IT YOURSELF
       ============================================================ */

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


    /* ============================================================
       HINT
       ============================================================ */

    function markHint(key) {

        const hint =

            el(
                "practiceHint",
                key
            );


        if (hint) {

            hint.hidden =
                !hint.hidden;
        }


        const progress =

            getProgress(key);


        progress.hintUsed =
            true;


        saveProgress(
            key,
            progress
        );


        renderProgress(key);
    }


    /* ============================================================
       SHOW PROGRAM
       ============================================================ */

    function markSolution(key) {

        const solution =

            el(
                "practiceSolution",
                key
            );


        if (solution) {

            solution.hidden =
                !solution.hidden;
        }


        const progress =

            getProgress(key);


        progress.solutionViewed =
            true;


        saveProgress(
            key,
            progress
        );


        renderProgress(key);
    }


    /* ============================================================
       EXECUTE C USING JUDGE0
       ============================================================ */

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

        } catch {

            /* Ignore JSON error */
        }


        if (
            !response.ok
        ) {

            throw new Error(

                result?.message ||

                result?.error ||

                `Judge0 returned HTTP ${
                    response.status
                }.`
            );
        }


        const description =

            String(

                result?.status
                    ?.description ||

                ""
            )

            .trim();


        const stdout =

            result?.stdout ??
            "";


        const stderr =

            result?.stderr ??
            "";


        const compileOutput =

            result?.compile_output ??
            "";


        const message =

            result?.message ??
            "";


        /* Successful execution */

        if (
            description ===
            "Accepted"
        ) {

            return {

                ok:
                    true,

                type:
                    "success",

                output:
                    stdout
            };
        }


        /* Compilation error */

        if (
            /compilation/i.test(
                description
            ) ||

            compileOutput
        ) {

            return {

                ok:
                    false,

                type:
                    "compile",

                output:

                    compileOutput ||

                    stderr ||

                    message ||

                    description ||

                    "Compilation failed."
            };
        }


        /* Runtime / other error */

        return {

            ok:
                false,

            type:
                "runtime",

            output:

                stderr ||

                message ||

                description ||

                "Program execution failed."
        };
    }


    /* ============================================================
       ENABLE / DISABLE RUN BUTTONS
       ============================================================ */

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


        if (run) {

            run.disabled =
                busy;
        }


        if (check) {

            check.disabled =
                busy;
        }
    }


    /* ============================================================
       RUN CODE
       Runs only with student's current input.
       ============================================================ */

    async function runSample(key) {

        const config =
            configs[key];


        if (!config)
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


        if (
            !code.trim()
        ) {

            if (output) {

                output.textContent =

                    "Please write your C program first.";
            }


            return;
        }


        setBusy(
            key,
            true
        );


        if (output) {

            output.textContent =

                "Compiling and running...";
        }


        try {

            const result =

                await executeC(
                    code,
                    stdin
                );


            if (output) {

                output.textContent =

                    result.output ||

                    "(Program finished with no output)";
            }

        } catch (error) {

            if (output) {

                output.textContent =

                    "Unable to run code: " +

                    error.message +

                    "\n\nThe online compiler may be temporarily unavailable. Please try again.";
            }

        } finally {

            setBusy(
                key,
                false
            );
        }
    }


    /* ============================================================
       ADD TEST RESULT ROW
       ============================================================ */

    function addTestRow(
        testsElement,
        label,
        passed,
        text
    ) {

        if (!testsElement)
            return;


        const row =

            document.createElement(
                "div"
            );


        row.className =

            `cb-c-test-row ${
                passed
                    ? "pass"
                    : "fail"
            }`;


        row.innerHTML =

            `<span>${label}</span>
             <strong>${text}</strong>`;


        testsElement.appendChild(
            row
        );
    }


    /* ============================================================
       CHECK ANSWER
       ============================================================ */

    async function checkAnswer(key) {

        const config =
            configs[key];


        if (!config)
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


        const testsElement =

            el(
                "practiceTests",
                key
            );


        if (
            !code.trim()
        ) {

            if (output) {

                output.textContent =

                    "Please write your C program first.";
            }


            return;
        }


        /* Count attempt */

        const startingProgress =

            getProgress(key);


        startingProgress.attempts++;


        saveProgress(
            key,
            startingProgress
        );


        setBusy(
            key,
            true
        );


        if (testsElement) {

            testsElement.innerHTML =
                "";
        }


        if (output) {

            output.textContent =

                "Checking your program against the test cases...";
        }


        let passed =
            0;


        let stoppedByError =
            false;


        try {

            for (
                let index = 0;

                index <
                config.tests.length;

                index++
            ) {

                const test =

                    config.tests[
                        index
                    ];


                const result =

                    await executeC(

                        code,

                        test.input
                    );


                const label =

                    index === 0

                        ? "Sample Test"

                        : `Hidden Test ${index}`;


                /* =================================================
                   COMPILATION / RUNTIME ERROR
                   ================================================= */

                if (
                    !result.ok
                ) {

                    stoppedByError =
                        true;


                    addTestRow(

                        testsElement,

                        label,

                        false,

                        result.type ===
                        "compile"

                            ? "❌ Compile Error"

                            : "❌ Runtime Error"
                    );


                    if (output) {

                        output.textContent =
                            result.output;
                    }


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


                const passedTest =

                    actual ===
                    expected;


                if (
                    passedTest
                ) {

                    passed++;
                }


                addTestRow(

                    testsElement,

                    label,

                    passedTest,

                    passedTest

                        ? "✅ Passed"

                        : "❌ Failed"
                );


                /* Show expected output only for sample test */

                if (
                    !passedTest &&
                    index === 0 &&
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
                config.tests.length;


            const progress =

                getProgress(key);


            /* =====================================================
               SCORING

               No help       = max 100
               Hint used     = max 90
               Solution seen = competitive score 0
               ===================================================== */

            const competitiveMaximum =

                progress.solutionViewed

                    ? 0

                    : (

                        progress.hintUsed

                            ? 90

                            : 100
                    );


            const score =

                competitiveMaximum === 0

                    ? 0

                    : Math.round(

                        passed /

                        config.tests.length *

                        competitiveMaximum
                    );


            /* Save best score */

            if (
                competitiveMaximum >
                0
            ) {

                progress.bestScore =

                    Math.max(

                        progress.bestScore,

                        score
                    );
            }


            /* =====================================================
               SOLVED / COMPLETED STATUS
               ===================================================== */

            if (
                allPassed
            ) {

                if (
                    progress.solutionViewed
                ) {

                    progress.completedWithSolution =
                        true;

                } else {

                    progress.solved =
                        true;
                }
            }


            saveProgress(
                key,
                progress
            );


            renderProgress(

                key,

                {

                    passed:
                        passed,

                    total:
                        config.tests.length,

                    score:
                        score,

                    allPassed:
                        allPassed
                }
            );


            /* =====================================================
               FINAL OUTPUT MESSAGE
               ===================================================== */

            if (
                allPassed &&
                output
            ) {

                output.textContent =

                    progress.solutionViewed

                        ? "All test cases passed. You completed the problem after viewing the solution."

                        : "All test cases passed successfully. 🎉";

            } else if (

                !stoppedByError &&

                output &&

                output.textContent ===
                "Checking your program against the test cases..."

            ) {

                output.textContent =

                    `${passed} of ${
                        config.tests.length
                    } test cases passed. ` +

                    "Review your logic and try again.";
            }

        } catch (error) {

            if (
                testsElement
            ) {

                testsElement.innerHTML =

                    '<div class="cb-c-test-row fail">' +

                    '<span>Code execution service</span>' +

                    '<strong>❌ Unavailable</strong>' +

                    '</div>';
            }


            if (output) {

                output.textContent =

                    "Unable to check your answer: " +

                    error.message +

                    "\n\nThe online compiler may be temporarily unavailable. Please try again.";
            }


            renderProgress(key);

        } finally {

            setBusy(
                key,
                false
            );
        }
    }


    /* ============================================================
       RENDER INDIVIDUAL PROBLEM PROGRESS
       ============================================================ */

    function renderProgress(
        key,
        session
    ) {

        const progress =
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


        /* Best Score */

        if (score) {

            score.textContent =

                `${progress.bestScore} / 100`;
        }


        /* Attempts */

        if (attempts) {

            attempts.textContent =

                String(
                    progress.attempts
                );
        }


        /* ========================================================
           SOLVED
           ======================================================== */

        if (
            progress.solved
        ) {

            if (status) {

                status.textContent =
                    "Solved";
            }


            if (badge) {

                badge.className =

                    "cb-practice-badge solved";


                badge.textContent =

                    "✅ SOLVED";
            }

        }

        /* ========================================================
           COMPLETED AFTER VIEWING SOLUTION
           ======================================================== */

        else if (
            progress.completedWithSolution
        ) {

            if (status) {

                status.textContent =
                    "Completed";
            }


            if (badge) {

                badge.className =

                    "cb-practice-badge completed";


                badge.textContent =

                    "📘 COMPLETED";
            }

        }

        /* ========================================================
           NOT SOLVED
           ======================================================== */

        else {

            if (status) {

                status.textContent =
                    "Not Solved";
            }


            if (badge) {

                badge.className =

                    "cb-practice-badge";


                badge.textContent =
                    "";
            }
        }


        /* Update dashboard */

        updateOverallProgress();


        if (!message)
            return;


        /* ========================================================
           ALL TEST CASES PASSED
           ======================================================== */

        if (
            session &&
            session.allPassed
        ) {

            if (
                progress.solutionViewed
            ) {

                message.textContent =

                    "✅ Problem completed! You passed every test case after studying the solution.";

            } else if (
                progress.hintUsed
            ) {

                message.textContent =

                    "🎉 All test cases passed. You solved it with a hint and can earn up to 90 marks.";

            } else {

                message.textContent =

                    "🏆 Congratulations! All test cases passed — excellent work!";
            }


            return;
        }


        /* ========================================================
           PARTIAL RESULT
           ======================================================== */

        if (session) {

            const ratio =

                session.total

                    ? session.passed /
                      session.total

                    : 0;


            if (
                ratio >= 0.8
            ) {

                message.textContent =

                    "👏 Very good! You are almost there. Fix the remaining case and try again.";

            } else if (
                ratio >= 0.4
            ) {

                message.textContent =

                    "💪 Good attempt! Some cases are working. Review your logic and try again.";

            } else {

                message.textContent =

                    "🔍 Keep trying. Test your logic carefully with different inputs.";
            }


            return;
        }


        /* ========================================================
           DEFAULT STATUS MESSAGES
           ======================================================== */

        if (
            progress.solved
        ) {

            message.textContent =

                "🏆 You have already solved this problem. Try rewriting it without looking at your previous code.";

        } else if (
            progress.solutionViewed
        ) {

            message.textContent =

                "📘 You viewed the solution. You can still practice and complete the problem, but it will not receive a competitive score.";

        } else if (
            progress.hintUsed
        ) {

            message.textContent =

                "💡 Hint used. Solve the problem now — you can still earn up to 90 marks.";

        } else {

            message.textContent =

                "Write your C program and test it. You can do it! 💪";
        }
    }


    /* ============================================================
       RESET EDITOR
       ============================================================ */

    function resetEditor(key) {

        const config =
            configs[key];


        if (!config)
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


        /* Reset starter code */

        if (code) {

            code.value =
                config.starterCode ||
                "";
        }


        /* Reset sample input */

        if (input) {

            input.value =
                config.sampleInput ||
                "";
        }


        /* Reset output */

        if (output) {

            output.textContent =

                "Run your program to see the output.";
        }


        /* Reset visible test results */

        if (tests) {

            tests.innerHTML =

                '<div class="cb-c-test-row">' +

                '<span>No tests checked yet.</span>' +

                '<strong>—</strong>' +

                '</div>';
        }


        /*
         Important:
         Reset Editor does NOT delete the student's
         saved score, attempts, solved status, etc.
        */

        renderProgress(key);
    }


    /* ============================================================
       PUBLIC FUNCTIONS
       ============================================================ */

    return {

        register:

            register,


        registerAll:

            registerAll,


        toggle:

            toggle,


        markHint:

            markHint,


        markSolution:

            markSolution,


        runSample:

            runSample,


        checkAnswer:

            checkAnswer,


        resetEditor:

            resetEditor
    };

})();
