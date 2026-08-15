(() => {
    "use strict";

    /* =========================================
       C PROGRAMMING TOPIC NAVIGATION
       ========================================= */

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


    /* =========================================
       SIDEBAR SEARCH
       ========================================= */

    window.searchTopics = function () {

        const input =
            document.getElementById("topicSearch");

        const value =
            String(input?.value || "")
                .toLowerCase();

        document
            .querySelectorAll(".cb-topic-link")
            .forEach(link => {

                const match =
                    link.textContent
                        .toLowerCase()
                        .includes(value);

                link.style.display =
                    match ? "" : "none";
            });
    };


    /* =========================================
       OLD #TOPIC LINK SUPPORT
       ========================================= */

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


    /* =========================================
       COMPACT CONCEPT VISUALIZATION
       ========================================= */

    const vizStates =
        new Map();


    function getViz(id) {

        if (vizStates.has(id))
            return vizStates.get(id);

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
                    root.dataset.frames || "[]"
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


        if (step) {

            step.textContent =
                `Step ${
                    state.index + 1
                } of ${
                    state.frames.length
                }`;
        }


        if (title) {

            title.textContent =
                frame.title || "";
        }


        if (detail) {

            detail.textContent =
                frame.detail || "";
        }


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


        const next =
            document.getElementById(
                `cbVizNext-${id}`
            );

        const auto =
            document.getElementById(
                `cbVizAuto-${id}`
            );


        const completed =
            state.index >=
            state.frames.length - 1;


        if (next) {

            next.disabled =
                completed;

            next.textContent =
                completed
                    ? "✓ Completed"
                    : "Next →";
        }


        if (auto) {

            auto.disabled =
                completed;
        }


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


        const progress =
            document.getElementById(
                `cbVizProgress-${id}`
            );

        if (progress) {

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

            if (!panel.hidden) {

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


    /* =========================================
       PROGRAM TRACING
       ========================================= */

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


    function getTrace(id) {

        if (
            traceStates.has(id)
        )
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
                    }

                    else if (
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


        const note =
            document.getElementById(
                `cbTraceNote-${id}`
            );


        if (note) {

            note.textContent =

                state.index === 0

                    ? "Press Next to start tracing the executable logic."

                    : step.note || "";
        }


        const stateHost =
            document.getElementById(
                `cbTraceState-${id}`
            );


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


        const output =
            document.getElementById(
                `cbTraceOutput-${id}`
            );


        if (output) {

            output.textContent =
                step.state?.output ||
                "—";
        }


        const completed =

            state.index >=
            state.config.steps.length;


        const next =
            document.getElementById(
                `cbTraceNext-${id}`
            );


        const auto =
            document.getElementById(
                `cbTraceAuto-${id}`
            );


        if (next) {

            next.disabled =
                completed;


            next.textContent =

                completed

                    ? "✓ Completed"

                    : "Next →";
        }


        if (auto) {

            auto.disabled =
                completed;
        }


        const status =
            document.getElementById(
                `cbTraceStatus-${id}`
            );


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


            if (!panel.hidden) {

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


    /* =========================================
       SIDEBAR / FOOTER COLLISION FIX
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
         When footer enters viewport,
         shorten sidebar so it stops
         exactly above footer.
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


    document.addEventListener(

        "DOMContentLoaded",

        () => {

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
   1.13 PRACTICE QUESTIONS
   SHOW ANSWER / HIDE ANSWER
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
   1.14 BEGINNER PROGRAMMING PROBLEMS
   SOLVE IT YOURSELF
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

        }

        catch (error) {

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

        /* =====================================
           OPEN / CLOSE SOLVE WORKSPACE
           ===================================== */

        toggleWorkspace(key) {

            toggleHidden(
                `cbIntroWorkspace-${key}`
            );
        },


        /* =====================================
           OPEN / CLOSE HINT
           ===================================== */

        toggleHint(key) {

            toggleHidden(
                `cbIntroHint-${key}`
            );
        },


        /* =====================================
           OPEN / CLOSE OFFICIAL PROGRAM
           ===================================== */

        toggleSolution(key) {

            toggleHidden(
                `cbIntroSolution-${key}`
            );
        },


        /* =====================================
           RESET EDITOR
           ===================================== */

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


        /* =====================================
           RUN C PROGRAM
           ===================================== */

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


                /*
                 Judge0 status 3 =
                 Accepted / successfully executed
                */

                if (
                    result.status?.id === 3
                ) {

                    if (output) {

                        output.textContent =

                            result.stdout ??
                            "";
                    }
                }

                else if (output) {

                    output.textContent =

                        errorText(
                            result
                        );
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

                if (button) {

                    button.disabled =
                        false;
                }
            }
        }
    };

})();
