(function () {
    "use strict";

    const LEVEL_PROGRESS_KEY =
        "codebhavya-aiml-level-02-progress-v1";

    function byId(id) {
        return document.getElementById(id);
    }

    function escapeHtml(value) {
        return String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    function matrixMarkup(label, rows, cellClass) {
        const extraClass = cellClass
            ? " " + cellClass
            : "";

        return (
            '<div class="aiml-bmatrix-wrap">' +
            "<span>" +
            escapeHtml(label) +
            "</span>" +
            '<div class="aiml-bmatrix">' +
            rows
                .map(function (row) {
                    return (
                        '<div class="aiml-brow' +
                        (row.length === 1 ? " one" : "") +
                        '">' +
                        row
                            .map(function (value) {
                                return (
                                    '<i class="aiml-bcell' +
                                    extraClass +
                                    '">' +
                                    escapeHtml(value) +
                                    "</i>"
                                );
                            })
                            .join("") +
                        "</div>"
                    );
                })
                .join("") +
            "</div>" +
            "</div>"
        );
    }

    function initBroadcastingVisualizer() {
        const stepContainer = byId(
            "broadcastingStepNodes"
        );

        if (!stepContainer) {
            return;
        }

        const row = [[10, 20, 30, 40]];

        const column = [
            [1],
            [2],
            [3]
        ];

        const repeatedRow = [
            [10, 20, 30, 40],
            [10, 20, 30, 40],
            [10, 20, 30, 40]
        ];

        const repeatedColumn = [
            [1, 1, 1, 1],
            [2, 2, 2, 2],
            [3, 3, 3, 3]
        ];

        const result = [
            [11, 21, 31, 41],
            [12, 22, 32, 42],
            [13, 23, 33, 43]
        ];

        const steps = [
            {
                short: "Row",
                sub: "(1, 4)",
                title: "Create a row vector",
                description:
                    "Four feature values are arranged across columns with shape (1, 4).",
                insight:
                    "A two-dimensional row vector keeps its leading dimension. A one-dimensional array with shape (4,) can also broadcast across the last axis.",
                graphic:
                    '<div class="aiml-broadcast-visual">' +
                    matrixMarkup(
                        "ROW VECTOR • SHAPE (1, 4)",
                        row,
                        ""
                    ) +
                    "</div>"
            },
            {
                short: "Column",
                sub: "(3, 1)",
                title: "Create a column vector",
                description:
                    "Three sample offsets are arranged vertically with shape (3, 1).",
                insight:
                    "The length-one column dimension is intentional. A plain shape (3,) would align from the right and would not broadcast with shape (1, 4).",
                graphic:
                    '<div class="aiml-broadcast-visual">' +
                    matrixMarkup(
                        "COLUMN VECTOR • SHAPE (3, 1)",
                        column,
                        ""
                    ) +
                    "</div>"
            },
            {
                short: "Compare",
                sub: "Trailing axes",
                title: "Compare dimensions from the right",
                description:
                    "The shapes are (3, 1) and (1, 4). Each compared dimension is equal or one.",
                insight:
                    "Rightmost: 1 and 4 are compatible because one side is 1. Next: 3 and 1 are compatible for the same reason. Result shape: (3, 4).",
                graphic:
                    '<div class="aiml-broadcast-visual">' +
                    matrixMarkup(
                        "(3, 1)",
                        column,
                        ""
                    ) +
                    '<div class="aiml-bop">+</div>' +
                    matrixMarkup(
                        "(1, 4)",
                        row,
                        ""
                    ) +
                    '<div class="aiml-bop">✓</div>' +
                    "</div>"
            },
            {
                short: "Expand row",
                sub: "3 copies",
                title: "Stretch the row conceptually",
                description:
                    "The row vector behaves as if its values were repeated down three rows.",
                insight:
                    "NumPy normally uses strides and does not materialize these repeated values. The expansion is a useful reasoning model.",
                graphic:
                    '<div class="aiml-broadcast-visual">' +
                    matrixMarkup(
                        "BROADCAST ROW • SHAPE (3, 4)",
                        repeatedRow,
                        "repeat"
                    ) +
                    "</div>"
            },
            {
                short: "Expand col",
                sub: "4 copies",
                title: "Stretch the column conceptually",
                description:
                    "Each column value behaves as if it were repeated across four columns.",
                insight:
                    "Both conceptual operands now have the common result shape (3, 4), so elementwise addition is well defined.",
                graphic:
                    '<div class="aiml-broadcast-visual">' +
                    matrixMarkup(
                        "BROADCAST COLUMN • SHAPE (3, 4)",
                        repeatedColumn,
                        "repeat"
                    ) +
                    "</div>"
            },
            {
                short: "Add",
                sub: "Elementwise",
                title: "Add aligned elements",
                description:
                    "Every result cell combines the corresponding broadcast row value and column value.",
                insight:
                    "For example, result[1, 2] = 30 + 2 = 32. Broadcasting changes alignment, not the meaning of elementwise arithmetic.",
                graphic:
                    '<div class="aiml-broadcast-visual">' +
                    matrixMarkup(
                        "ROW",
                        repeatedRow,
                        "repeat"
                    ) +
                    '<div class="aiml-bop">+</div>' +
                    matrixMarkup(
                        "COLUMN",
                        repeatedColumn,
                        "repeat"
                    ) +
                    "</div>"
            },
            {
                short: "Result",
                sub: "(3, 4)",
                title: "Produce the broadcast result",
                description:
                    "The final array has three rows and four columns—the maximum compatible size of every axis.",
                insight:
                    "Always predict the output shape before running a broadcasting expression. This prevents silent calculations along an unintended axis.",
                graphic:
                    '<div class="aiml-broadcast-visual">' +
                    matrixMarkup(
                        "RESULT • SHAPE (3, 4)",
                        result,
                        "result"
                    ) +
                    "</div>"
            }
        ];

        const previousButton = byId(
            "broadcastingPrevious"
        );

        const nextButton = byId(
            "broadcastingNext"
        );

        const autoButton = byId(
            "broadcastingAuto"
        );

        const pauseButton = byId(
            "broadcastingPause"
        );

        const resetButton = byId(
            "broadcastingReset"
        );

        const progressText = byId(
            "broadcastingProgress"
        );

        const eyebrow = byId(
            "broadcastingStageEyebrow"
        );

        const title = byId(
            "broadcastingStageTitle"
        );

        const description = byId(
            "broadcastingStageDescription"
        );

        const insight = byId(
            "broadcastingStageInsight"
        );

        const graphic = byId(
            "broadcastingStageGraphic"
        );

        let currentStep = 0;
        let timer = null;

        stepContainer.innerHTML = steps
            .map(function (step, index) {
                return (
                    '<div class="aiml-visual-step" ' +
                    'data-visual-step="' +
                    index +
                    '">' +
                    "<b>" +
                    escapeHtml(step.short) +
                    "</b>" +
                    "<span>" +
                    escapeHtml(step.sub) +
                    "</span>" +
                    "</div>"
                );
            })
            .join("");

        function stopAutoRun() {
            if (timer !== null) {
                window.clearInterval(timer);
                timer = null;
            }

            pauseButton.disabled = true;
        }

        function render() {
            const step = steps[currentStep];

            const atStart =
                currentStep === 0;

            const atEnd =
                currentStep === steps.length - 1;

            Array.from(
                stepContainer.children
            ).forEach(function (node, index) {
                node.classList.toggle(
                    "is-active",
                    index === currentStep
                );

                node.classList.toggle(
                    "is-complete",
                    index < currentStep
                );

                node.setAttribute(
                    "aria-current",
                    index === currentStep
                        ? "step"
                        : "false"
                );
            });

            eyebrow.textContent =
                "STEP " +
                (currentStep + 1) +
                " OF " +
                steps.length;

            title.textContent = step.title;

            description.textContent =
                step.description;

            insight.innerHTML =
                "<strong>SHAPE INSIGHT</strong>" +
                escapeHtml(step.insight);

            graphic.innerHTML = step.graphic;

            progressText.textContent =
                "Step " +
                (currentStep + 1) +
                " of " +
                steps.length;

            previousButton.disabled = atStart;
            nextButton.disabled = atEnd;

            autoButton.disabled =
                atEnd || timer !== null;

            if (atEnd) {
                stopAutoRun();

                nextButton.disabled = true;
                autoButton.disabled = true;
            }
        }

        function goNext() {
            if (
                currentStep <
                steps.length - 1
            ) {
                currentStep += 1;
                render();
            }
        }

        previousButton.addEventListener(
            "click",
            function () {
                stopAutoRun();

                currentStep = Math.max(
                    0,
                    currentStep - 1
                );

                render();
            }
        );

        nextButton.addEventListener(
            "click",
            goNext
        );

        autoButton.addEventListener(
            "click",
            function () {
                if (
                    currentStep >=
                        steps.length - 1 ||
                    timer !== null
                ) {
                    return;
                }

                autoButton.disabled = true;
                pauseButton.disabled = false;

                timer = window.setInterval(
                    goNext,
                    1250
                );
            }
        );

        pauseButton.addEventListener(
            "click",
            function () {
                stopAutoRun();
                render();
            }
        );

        resetButton.addEventListener(
            "click",
            function () {
                stopAutoRun();
                currentStep = 0;
                render();
            }
        );

        render();
    }

    function initProgramTracer() {
        const panel = byId("tracerPanel");

        const toggle = byId(
            "tracerPanelToggle"
        );

        const codeContainer = byId(
            "tracerCode"
        );

        if (
            !panel ||
            !toggle ||
            !codeContainer
        ) {
            return;
        }

        const codeLines = [
            "import numpy as np",
            "scores = np.array([40., 55., 70., 85.])",
            "mean = scores.mean()",
            "std = scores.std()",
            "centered = scores - mean",
            "scaled = centered / std",
            "mask = scores >= 70",
            "selected = scaled[mask]",
            "print(np.round(selected, 2))"
        ];

        const traceStates = [
            {
                vars: {
                    np: "NumPy module"
                },
                expression:
                    "import numpy as np",
                explanation:
                    "Import NumPy using its conventional alias. Functions and array constructors are now available through np.",
                output: ""
            },
            {
                vars: {
                    scores:
                        "[40. 55. 70. 85.]",
                    shape: "(4,)",
                    dtype: "float64"
                },
                expression:
                    "np.array([40., 55., 70., 85.])",
                explanation:
                    "Create a one-dimensional floating-point array containing four score observations.",
                output: ""
            },
            {
                vars: {
                    scores:
                        "[40. 55. 70. 85.]",
                    mean: "62.5"
                },
                expression:
                    "(40 + 55 + 70 + 85) / 4 = 62.5",
                explanation:
                    "Reduce the array to its arithmetic mean. This is the centre used for standardization.",
                output: ""
            },
            {
                vars: {
                    mean: "62.5",
                    std: "16.7705"
                },
                expression:
                    "sqrt(mean((scores − 62.5)²)) = 16.7705",
                explanation:
                    "Calculate NumPy's default population standard deviation. It describes the typical distance from the mean.",
                output: ""
            },
            {
                vars: {
                    mean: "62.5",
                    centered:
                        "[-22.5 -7.5 7.5 22.5]"
                },
                expression:
                    "scores − 62.5",
                explanation:
                    "Broadcast the scalar mean across all four values. Centred values now have a mean of zero.",
                output: ""
            },
            {
                vars: {
                    std: "16.7705",
                    scaled:
                        "[-1.3416 -0.4472 0.4472 1.3416]"
                },
                expression:
                    "centered / 16.7705",
                explanation:
                    "Divide every centred value by the standard deviation. The resulting feature has unit-scale spread.",
                output: ""
            },
            {
                vars: {
                    scores:
                        "[40. 55. 70. 85.]",
                    mask:
                        "[False False True True]"
                },
                expression:
                    "scores >= 70",
                explanation:
                    "Apply the comparison elementwise. NumPy creates a Boolean mask with one value per score.",
                output: ""
            },
            {
                vars: {
                    mask:
                        "[False False True True]",
                    selected:
                        "[0.4472 1.3416]"
                },
                expression:
                    "scaled[mask]",
                explanation:
                    "Use Boolean indexing to copy only standardized values whose original scores are at least 70.",
                output: ""
            },
            {
                vars: {
                    selected:
                        "[0.4472 1.3416]",
                    rounded: "[0.45 1.34]"
                },
                expression:
                    "np.round(selected, 2)",
                explanation:
                    "Round the two selected values for display. Program execution is complete.",
                output: "[0.45 1.34]"
            }
        ];

        const previousButton = byId(
            "tracerPrevious"
        );

        const nextButton = byId(
            "tracerNext"
        );

        const autoButton = byId(
            "tracerAuto"
        );

        const pauseButton = byId(
            "tracerPause"
        );

        const resetButton = byId(
            "tracerReset"
        );

        const status = byId(
            "tracerStatus"
        );

        const explanation = byId(
            "tracerExplanation"
        );

        const variables = byId(
            "tracerVariables"
        );

        const expression = byId(
            "tracerExpression"
        );

        const output = byId(
            "tracerOutput"
        );

        const progress = byId(
            "tracerProgress"
        );

        let currentStep = 0;
        let timer = null;

        codeContainer.innerHTML = codeLines
            .map(function (line, index) {
                return (
                    '<div class="aiml-code-line" ' +
                    'data-trace-line="' +
                    (index + 1) +
                    '">' +
                    "<span>" +
                    String(index + 1).padStart(
                        2,
                        "0"
                    ) +
                    "</span>" +
                    "<code>" +
                    escapeHtml(line) +
                    "</code>" +
                    "</div>"
                );
            })
            .join("");

        function stopAutoRun() {
            if (timer !== null) {
                window.clearInterval(timer);
                timer = null;
            }

            pauseButton.disabled = true;
        }

        function renderVariables(values) {
            const entries = Object.entries(
                values || {}
            );

            if (entries.length === 0) {
                variables.innerHTML =
                    '<div class="aiml-variable">' +
                    "<span>STATE</span>" +
                    "<code>No variables yet</code>" +
                    "</div>";

                return;
            }

            variables.innerHTML = entries
                .map(function (entry) {
                    return (
                        '<div class="aiml-variable">' +
                        "<span>" +
                        escapeHtml(entry[0]) +
                        "</span>" +
                        "<code>" +
                        escapeHtml(entry[1]) +
                        "</code>" +
                        "</div>"
                    );
                })
                .join("");
        }

        function render() {
            const atStart =
                currentStep === 0;

            const atEnd =
                currentStep ===
                traceStates.length;

            const state =
                currentStep > 0
                    ? traceStates[
                          currentStep - 1
                      ]
                    : null;

            const lineNodes = Array.from(
                codeContainer.querySelectorAll(
                    ".aiml-code-line"
                )
            );

            lineNodes.forEach(
                function (line, index) {
                    line.classList.toggle(
                        "is-active",
                        currentStep > 0 &&
                            index ===
                                currentStep - 1
                    );

                    line.classList.toggle(
                        "is-complete",
                        index < currentStep
                    );
                }
            );

            if (state) {
                explanation.textContent =
                    state.explanation;

                expression.textContent =
                    state.expression;

                output.textContent =
                    state.output ||
                    "No output yet";

                renderVariables(state.vars);

                status.textContent = atEnd
                    ? "Complete"
                    : "Executing line " +
                      currentStep;
            } else {
                explanation.textContent =
                    "Press Next to execute the first statement.";

                expression.textContent = "—";

                output.textContent =
                    "Waiting for print(...)";

                renderVariables({});

                status.textContent = "Ready";
            }

            progress.textContent =
                "Step " +
                currentStep +
                " of " +
                traceStates.length;

            previousButton.disabled = atStart;
            nextButton.disabled = atEnd;

            autoButton.disabled =
                atEnd || timer !== null;

            if (currentStep > 0) {
                const activeLine =
                    lineNodes[
                        currentStep - 1
                    ];

                if (activeLine) {
                    activeLine.scrollIntoView({
                        behavior: "smooth",
                        block: "nearest"
                    });
                }
            } else {
                codeContainer.scrollTop = 0;
            }

            if (atEnd) {
                stopAutoRun();

                nextButton.disabled = true;
                autoButton.disabled = true;
            }
        }

        function goNext() {
            if (
                currentStep <
                traceStates.length
            ) {
                currentStep += 1;
                render();
            }
        }

        toggle.addEventListener(
            "click",
            function () {
                const opening = panel.hidden;

                panel.hidden = !opening;

                toggle.setAttribute(
                    "aria-expanded",
                    String(opening)
                );

                toggle.textContent = opening
                    ? "✕ Close Interactive Tracer"
                    : "Open Interactive Tracer";

                if (opening) {
                    render();
                } else {
                    stopAutoRun();
                    render();
                }
            }
        );

        previousButton.addEventListener(
            "click",
            function () {
                stopAutoRun();

                currentStep = Math.max(
                    0,
                    currentStep - 1
                );

                render();
            }
        );

        nextButton.addEventListener(
            "click",
            goNext
        );

        autoButton.addEventListener(
            "click",
            function () {
                if (
                    currentStep >=
                        traceStates.length ||
                    timer !== null
                ) {
                    return;
                }

                autoButton.disabled = true;
                pauseButton.disabled = false;

                timer = window.setInterval(
                    goNext,
                    900
                );
            }
        );

        pauseButton.addEventListener(
            "click",
            function () {
                stopAutoRun();
                render();
            }
        );

        resetButton.addEventListener(
            "click",
            function () {
                stopAutoRun();
                currentStep = 0;
                render();
            }
        );

        render();
    }

    function initProgrammingProblems() {
        const list = byId("problemList");

        if (!list) {
            return;
        }

        const problems = [
            {
                title: "Report Array Metadata",
                description:
                    "Create the displayed 2 × 3 NumPy array and print its dimension, shape and size.",
                sampleInput:
                    "[[2, 4, 6], [8, 10, 12]]",
                expected:
                    "Dimensions: 2\n" +
                    "Shape: (2, 3)\n" +
                    "Size: 6",
                hint:
                    "Use np.array(), then access ndim, shape and size.",
                starter:
                    "import numpy as np\n" +
                    "# Create the array and report its metadata\n",
                solution:
                    "import numpy as np\n" +
                    "values = np.array([[2, 4, 6], [8, 10, 12]])\n" +
                    'print("Dimensions:", values.ndim)\n' +
                    'print("Shape:", values.shape)\n' +
                    'print("Size:", values.size)',
                required: [
                    [
                        "import numpy",
                        "from numpy"
                    ],
                    ["np.array("],
                    [".ndim"],
                    [".shape"],
                    [".size"],
                    ["print("]
                ]
            },
            {
                title:
                    "Min–Max Normalize Values",
                description:
                    "Scale [10, 20, 30, 40] to the range 0 through 1 using vectorized NumPy operations.",
                sampleInput:
                    "[10, 20, 30, 40]",
                expected:
                    "[0.   0.33 0.67 1.  ]",
                hint:
                    "Use (x - x.min()) / (x.max() - x.min()), then round.",
                starter:
                    "import numpy as np\n" +
                    "values = np.array([10., 20., 30., 40.])\n" +
                    "# Normalize and print\n",
                solution:
                    "import numpy as np\n" +
                    "values = np.array([10., 20., 30., 40.])\n" +
                    "normalized = (values - values.min()) / (values.max() - values.min())\n" +
                    "print(np.round(normalized, 2))",
                required: [
                    ["np.array("],
                    [".min("],
                    [".max("],
                    [
                        "values -",
                        "values-"
                    ],
                    ["/"],
                    [
                        "np.round(",
                        "round("
                    ],
                    ["print("]
                ]
            },
            {
                title:
                    "Filter Passing Scores",
                description:
                    "Use a Boolean mask to select all scores greater than or equal to 60.",
                sampleInput:
                    "[42, 75, 63, 91, 58]",
                expected: "[75 63 91]",
                hint:
                    "Create mask = scores >= 60 and use scores[mask].",
                starter:
                    "import numpy as np\n" +
                    "scores = np.array([42, 75, 63, 91, 58])\n" +
                    "# Filter passing scores\n",
                solution:
                    "import numpy as np\n" +
                    "scores = np.array([42, 75, 63, 91, 58])\n" +
                    "mask = scores >= 60\n" +
                    "passing = scores[mask]\n" +
                    "print(passing)",
                required: [
                    ["np.array("],
                    [
                        ">= 60",
                        ">=60"
                    ],
                    ["mask"],
                    [
                        "scores[",
                        "[scores >="
                    ],
                    ["print("]
                ]
            },
            {
                title:
                    "Reshape and Sum Columns",
                description:
                    "Arrange values 1 through 12 as a 3 × 4 matrix and print the sum of each column.",
                sampleInput: "1 to 12",
                expected: "[15 18 21 24]",
                hint:
                    "Use np.arange(1, 13), reshape(3, 4), and sum(axis=0).",
                starter:
                    "import numpy as np\n" +
                    "# Build the matrix and calculate column sums\n",
                solution:
                    "import numpy as np\n" +
                    "matrix = np.arange(1, 13).reshape(3, 4)\n" +
                    "column_sums = matrix.sum(axis=0)\n" +
                    "print(column_sums)",
                required: [
                    ["np.arange("],
                    [
                        ".reshape(",
                        "np.reshape("
                    ],
                    [
                        "3, 4",
                        "3,4"
                    ],
                    [
                        ".sum(",
                        "np.sum("
                    ],
                    [
                        "axis=0",
                        "axis = 0"
                    ],
                    ["print("]
                ]
            },
            {
                title:
                    "Calculate Department Averages",
                description:
                    "Create the DataFrame, group by department and print each department's mean score.",
                sampleInput:
                    "department=[AI,CSE,AI,CSE], score=[80,70,90,80]",
                expected:
                    "AI 85.0\nCSE 75.0",
                hint:
                    "Create pd.DataFrame(data), then groupby('department')['score'].mean().",
                starter:
                    "import pandas as pd\n" +
                    "data = {\n" +
                    '    "department": ["AI", "CSE", "AI", "CSE"],\n' +
                    '    "score": [80, 70, 90, 80]\n' +
                    "}\n" +
                    "# Group and print averages\n",
                solution:
                    "import pandas as pd\n" +
                    "data = {\n" +
                    '    "department": ["AI", "CSE", "AI", "CSE"],\n' +
                    '    "score": [80, 70, 90, 80]\n' +
                    "}\n" +
                    "df = pd.DataFrame(data)\n" +
                    'averages = df.groupby("department")["score"].mean()\n' +
                    "for department, average in averages.items():\n" +
                    "    print(department, average)",
                required: [
                    [
                        "import pandas",
                        "from pandas"
                    ],
                    ["pd.dataframe("],
                    [".groupby("],
                    ["department"],
                    ["score"],
                    [".mean("],
                    ["print("]
                ]
            }
        ];

        let saved = {};

        try {
            saved = JSON.parse(
                window.localStorage.getItem(
                    LEVEL_PROGRESS_KEY
                ) || "{}"
            );
        } catch (error) {
            saved = {};
        }

        const solved = new Set(
            Array.isArray(
                saved.solvedProblems
            )
                ? saved.solvedProblems
                : []
        );

        const scores =
            saved.problemScores &&
            typeof saved.problemScores ===
                "object"
                ? saved.problemScores
                : {};

        const revealed = new Set();

        function saveProgress() {
            let current = {};

            try {
                current = JSON.parse(
                    window.localStorage.getItem(
                        LEVEL_PROGRESS_KEY
                    ) || "{}"
                );
            } catch (error) {
                current = {};
            }

            current.solvedProblems =
                Array.from(solved);

            current.problemScores = scores;

            window.localStorage.setItem(
                LEVEL_PROGRESS_KEY,
                JSON.stringify(current)
            );
        }

        function updateSummary() {
            const totalScore =
                Object.values(scores).reduce(
                    function (sum, score) {
                        return (
                            sum +
                            Number(score || 0)
                        );
                    },
                    0
                );

            byId(
                "problemSolvedCount"
            ).textContent =
                solved.size +
                " / " +
                problems.length;

            byId("problemScore").textContent =
                totalScore +
                " / " +
                problems.length * 100;

            byId(
                "problemProgressBar"
            ).style.width =
                (solved.size /
                    problems.length) *
                    100 +
                "%";
        }

        list.innerHTML = problems
            .map(function (problem, index) {
                const number = index + 1;

                return (
                    '<article class="aiml-problem-card' +
                    (solved.has(index)
                        ? " is-solved"
                        : "") +
                    '" data-problem="' +
                    index +
                    '">' +

                    '<div class="aiml-problem-head">' +
                    '<span class="aiml-problem-number">' +
                    String(number).padStart(
                        2,
                        "0"
                    ) +
                    "</span>" +
                    "<div>" +
                    "<h3>" +
                    number +
                    ". " +
                    escapeHtml(problem.title) +
                    "</h3>" +
                    "<p>" +
                    escapeHtml(
                        problem.description
                    ) +
                    "</p>" +
                    "</div>" +
                    "</div>" +

                    '<div class="aiml-problem-data">' +
                    "<span>" +
                    "<strong>Sample input:</strong> " +
                    escapeHtml(
                        problem.sampleInput
                    ) +
                    "</span>" +
                    "<span>" +
                    "<strong>Expected output:</strong> " +
                    "<code>" +
                    escapeHtml(
                        problem.expected
                    ).replace(/\n/g, " · ") +
                    "</code>" +
                    "</span>" +
                    "</div>" +

                    '<div class="aiml-problem-actions">' +
                    '<button type="button" class="primary" data-action="workspace">' +
                    "💻 Solve It Yourself" +
                    "</button>" +
                    '<button type="button" class="hint" data-action="hint">' +
                    "Hint" +
                    "</button>" +
                    '<button type="button" data-action="solution">' +
                    "Show Program" +
                    "</button>" +
                    "</div>" +

                    '<div class="aiml-problem-reveal" data-panel="hint" hidden>' +
                    "<strong>Hint</strong>" +
                    "<p>" +
                    escapeHtml(problem.hint) +
                    "</p>" +
                    "</div>" +

                    '<div class="aiml-problem-reveal" data-panel="solution" hidden>' +
                    "<strong>Model program</strong>" +
                    "<pre><code>" +
                    escapeHtml(
                        problem.solution
                    ) +
                    "</code></pre>" +
                    "</div>" +

                    '<div class="aiml-workspace" data-panel="workspace" hidden>' +
                    '<label for="problemCode' +
                    index +
                    '">' +
                    "Your Python code" +
                    "</label>" +
                    '<textarea id="problemCode' +
                    index +
                    '" spellcheck="false">' +
                    escapeHtml(
                        problem.starter
                    ) +
                    "</textarea>" +

                    '<div class="aiml-workspace-row">' +
                    '<button type="button" data-action="check">' +
                    "Check Answer" +
                    "</button>" +
                    '<button type="button" data-action="reset">' +
                    "Reset" +
                    "</button>" +
                    '<span class="aiml-check-result" data-result>' +
                    "Write your solution, then check its structure." +
                    "</span>" +
                    "</div>" +
                    "</div>" +
                    "</article>"
                );
            })
            .join("");

        function togglePanel(
            card,
            panelName,
            button,
            openLabel,
            closeLabel
        ) {
            const panel = card.querySelector(
                '[data-panel="' +
                    panelName +
                    '"]'
            );

            if (!panel) {
                return;
            }

            const opening = panel.hidden;

            panel.hidden = !opening;

            button.textContent = opening
                ? closeLabel
                : openLabel;
        }

        list.addEventListener(
            "click",
            function (event) {
                const button =
                    event.target.closest(
                        "button[data-action]"
                    );

                if (!button) {
                    return;
                }

                const card = button.closest(
                    ".aiml-problem-card"
                );

                const problemIndex = Number(
                    card.dataset.problem
                );

                const problem =
                    problems[problemIndex];

                const action =
                    button.dataset.action;

                if (
                    action === "workspace"
                ) {
                    togglePanel(
                        card,
                        "workspace",
                        button,
                        "💻 Solve It Yourself",
                        "✕ Close Workspace"
                    );

                    return;
                }

                if (action === "hint") {
                    togglePanel(
                        card,
                        "hint",
                        button,
                        "Hint",
                        "Hide Hint"
                    );

                    return;
                }

                if (
                    action === "solution"
                ) {
                    revealed.add(
                        problemIndex
                    );

                    togglePanel(
                        card,
                        "solution",
                        button,
                        "Show Program",
                        "Hide Program"
                    );

                    return;
                }

                const textarea =
                    card.querySelector(
                        "textarea"
                    );

                const result =
                    card.querySelector(
                        "[data-result]"
                    );

                if (action === "reset") {
                    textarea.value =
                        problem.starter;

                    result.className =
                        "aiml-check-result";

                    result.textContent =
                        "Workspace reset. Try the problem again.";

                    return;
                }

                if (action === "check") {
                    const normalized =
                        textarea.value
                            .toLowerCase()
                            .replace(
                                /\s+/g,
                                " "
                            );

                    const missing =
                        problem.required.filter(
                            function (
                                alternatives
                            ) {
                                return !alternatives.some(
                                    function (
                                        token
                                    ) {
                                        return normalized.includes(
                                            token.toLowerCase()
                                        );
                                    }
                                );
                            }
                        );

                    if (
                        !textarea.value.trim() ||
                        textarea.value.trim() ===
                            problem.starter.trim()
                    ) {
                        result.className =
                            "aiml-check-result error";

                        result.textContent =
                            "Add your solution before checking.";

                        return;
                    }

                    if (
                        missing.length > 0
                    ) {
                        result.className =
                            "aiml-check-result error";

                        result.textContent =
                            "Not complete yet. Recheck the required library call, shape or axis operation, and output.";

                        return;
                    }

                    const score =
                        revealed.has(
                            problemIndex
                        )
                            ? 60
                            : 100;

                    solved.add(
                        problemIndex
                    );

                    scores[problemIndex] =
                        Math.max(
                            Number(
                                scores[
                                    problemIndex
                                ] || 0
                            ),
                            score
                        );

                    card.classList.add(
                        "is-solved"
                    );

                    result.className =
                        "aiml-check-result success";

                    result.textContent =
                        revealed.has(
                            problemIndex
                        )
                            ? "Logic recognized — completed after viewing the model program. Score: 60/100."
                            : "Logic recognized — solved independently. Score: 100/100.";

                    saveProgress();
                    updateSummary();
                }
            }
        );

        updateSummary();
    }

    function initQuiz() {
        const container = byId(
            "quizQuestions"
        );

        if (!container) {
            return;
        }

        const questions = [
            {
                question:
                    "If X.shape is (5, 3), what does X.shape[0] represent?",
                options: [
                    "The number of features",
                    "The number of rows or samples",
                    "The array data type",
                    "The number of dimensions"
                ],
                answer: 1,
                explanation:
                    "For the usual samples-by-features convention, axis 0 contains five rows or samples and axis 1 contains three features."
            },
            {
                question:
                    "What is the result shape of arrays with shapes (3, 1) and (1, 4) when added?",
                options: [
                    "(3, 1)",
                    "(1, 4)",
                    "(3, 4)",
                    "They are incompatible"
                ],
                answer: 2,
                explanation:
                    "Both axes are compatible because one of the paired dimensions is 1. Each expands to the common shape (3, 4)."
            },
            {
                question:
                    "For a 2 × 3 array, what does sum(axis=0) return?",
                options: [
                    "One scalar",
                    "Two row sums",
                    "Three column sums",
                    "The unchanged array"
                ],
                answer: 2,
                explanation:
                    "axis=0 is reduced, so rows disappear and one sum remains for each of the three columns."
            },
            {
                question:
                    "Which operation normally returns a copy rather than a view?",
                options: [
                    "A basic slice such as X[1:4]",
                    "Boolean indexing such as X[X > 0]",
                    "Reading X.shape",
                    "Accessing one scalar"
                ],
                answer: 1,
                explanation:
                    "Boolean and fancy indexing generally produce copies. Basic slicing commonly returns a view that shares memory."
            },
            {
                question:
                    "Why is vectorized NumPy code usually faster than a Python loop?",
                options: [
                    "It changes O(n) work into O(1)",
                    "It always uses a GPU",
                    "Optimized compiled loops perform the bulk operation",
                    "It stores every value as text"
                ],
                answer: 2,
                explanation:
                    "Vectorization reduces Python interpreter overhead by delegating bulk numerical loops to optimized compiled implementations."
            },
            {
                question:
                    "Which is the safest way to fit standardization in an ML pipeline?",
                options: [
                    "Calculate mean and std using the complete dataset",
                    "Fit statistics on training data and reuse them elsewhere",
                    "Calculate separate statistics for every test row",
                    "Use the test set to improve the mean"
                ],
                answer: 1,
                explanation:
                    "Training-only statistics prevent information from validation or test data leaking into the model-building process."
            },
            {
                question:
                    "What is the main difference between concatenate and stack?",
                options: [
                    "Stack creates a new axis; concatenate joins an existing axis",
                    "Concatenate works only with strings",
                    "Stack always flattens data",
                    "There is no difference"
                ],
                answer: 0,
                explanation:
                    "Concatenate extends an existing dimension, while stack introduces a new dimension before combining arrays."
            },
            {
                question:
                    "What should you inspect first after loading a new DataFrame?",
                options: [
                    "Only the correlation matrix",
                    "Shape, sample rows, types, missingness and keys",
                    "Only model accuracy",
                    "The final deployment endpoint"
                ],
                answer: 1,
                explanation:
                    "Structural inspection catches wrong types, missing values, key problems and unexpected schema before deeper analysis."
            }
        ];

        container.innerHTML = questions
            .map(function (
                item,
                questionIndex
            ) {
                return (
                    '<article class="aiml-quiz-question" ' +
                    'data-quiz-question="' +
                    questionIndex +
                    '">' +
                    "<strong>" +
                    (questionIndex + 1) +
                    ". " +
                    escapeHtml(
                        item.question
                    ) +
                    "</strong>" +

                    '<div class="aiml-quiz-options">' +
                    item.options
                        .map(function (
                            option,
                            optionIndex
                        ) {
                            const inputId =
                                "quiz-" +
                                questionIndex +
                                "-" +
                                optionIndex;

                            return (
                                '<label class="aiml-quiz-option" for="' +
                                inputId +
                                '">' +
                                '<input type="radio" id="' +
                                inputId +
                                '" name="quiz-' +
                                questionIndex +
                                '" value="' +
                                optionIndex +
                                '">' +
                                "<span>" +
                                String.fromCharCode(
                                    65 +
                                        optionIndex
                                ) +
                                ". " +
                                escapeHtml(
                                    option
                                ) +
                                "</span>" +
                                "</label>"
                            );
                        })
                        .join("") +
                    "</div>" +

                    '<div class="aiml-quiz-explanation" hidden></div>' +
                    "</article>"
                );
            })
            .join("");

        container.addEventListener(
            "change",
            function (event) {
                if (
                    !event.target.matches(
                        'input[type="radio"]'
                    )
                ) {
                    return;
                }

                const question =
                    event.target.closest(
                        ".aiml-quiz-question"
                    );

                question
                    .querySelectorAll(
                        ".aiml-quiz-option"
                    )
                    .forEach(
                        function (option) {
                            option.classList.toggle(
                                "is-selected",
                                option.contains(
                                    event.target
                                )
                            );
                        }
                    );
            }
        );

        byId("checkQuiz").addEventListener(
            "click",
            function () {
                let correct = 0;
                let answered = 0;

                questions.forEach(
                    function (
                        item,
                        questionIndex
                    ) {
                        const question =
                            container.querySelector(
                                '[data-quiz-question="' +
                                    questionIndex +
                                    '"]'
                            );

                        const selected =
                            question.querySelector(
                                'input[type="radio"]:checked'
                            );

                        const options =
                            Array.from(
                                question.querySelectorAll(
                                    ".aiml-quiz-option"
                                )
                            );

                        const explanation =
                            question.querySelector(
                                ".aiml-quiz-explanation"
                            );

                        options.forEach(
                            function (
                                option,
                                optionIndex
                            ) {
                                option.classList.remove(
                                    "is-correct",
                                    "is-wrong"
                                );

                                if (
                                    optionIndex ===
                                    item.answer
                                ) {
                                    option.classList.add(
                                        "is-correct"
                                    );
                                }
                            }
                        );

                        if (selected) {
                            const selectedIndex =
                                Number(
                                    selected.value
                                );

                            answered += 1;

                            if (
                                selectedIndex ===
                                item.answer
                            ) {
                                correct += 1;
                            } else {
                                options[
                                    selectedIndex
                                ].classList.add(
                                    "is-wrong"
                                );
                            }
                        }

                        explanation.hidden =
                            false;

                        explanation.innerHTML =
                            "<strong>" +
                            (selected
                                ? "Your answer: " +
                                  escapeHtml(
                                      item.options[
                                          Number(
                                              selected.value
                                          )
                                      ]
                                  )
                                : "Your answer: Not attempted") +
                            "</strong><br>" +
                            "<strong>Correct answer: " +
                            escapeHtml(
                                item.options[
                                    item.answer
                                ]
                            ) +
                            "</strong><br>" +
                            escapeHtml(
                                item.explanation
                            );
                    }
                );

                byId(
                    "quizScore"
                ).textContent =
                    correct +
                    " / " +
                    questions.length +
                    " correct" +
                    (answered <
                    questions.length
                        ? " • " +
                          (questions.length -
                              answered) +
                          " not attempted"
                        : "");

                let progress = {};

                try {
                    progress = JSON.parse(
                        window.localStorage.getItem(
                            LEVEL_PROGRESS_KEY
                        ) || "{}"
                    );
                } catch (error) {
                    progress = {};
                }

                progress.bestQuizScore =
                    Math.max(
                        Number(
                            progress.bestQuizScore ||
                                0
                        ),
                        correct
                    );

                window.localStorage.setItem(
                    LEVEL_PROGRESS_KEY,
                    JSON.stringify(
                        progress
                    )
                );
            }
        );

        byId("resetQuiz").addEventListener(
            "click",
            function () {
                container
                    .querySelectorAll(
                        'input[type="radio"]'
                    )
                    .forEach(
                        function (input) {
                            input.checked =
                                false;
                        }
                    );

                container
                    .querySelectorAll(
                        ".aiml-quiz-option"
                    )
                    .forEach(
                        function (option) {
                            option.classList.remove(
                                "is-selected",
                                "is-correct",
                                "is-wrong"
                            );
                        }
                    );

                container
                    .querySelectorAll(
                        ".aiml-quiz-explanation"
                    )
                    .forEach(
                        function (
                            explanation
                        ) {
                            explanation.hidden =
                                true;

                            explanation.textContent =
                                "";
                        }
                    );

                byId(
                    "quizScore"
                ).textContent =
                    "Not checked yet";
            }
        );
    }

    function initInterviewQuestions() {
        const container = byId(
            "interviewList"
        );

        if (!container) {
            return;
        }

        const questions = [
            {
                question:
                    "Why are NumPy arrays generally faster and more memory-efficient than Python lists?",
                answer:
                    "NumPy arrays normally store one fixed dtype in contiguous or regularly strided memory and execute bulk operations in optimized compiled code. Python lists store references to Python objects and Python-level loops add interpreter overhead."
            },
            {
                question:
                    "Explain ndim, shape, size and dtype.",
                answer:
                    "ndim is the number of axes, shape gives the length of every axis, size is the total number of elements, and dtype describes how each element is represented in memory."
            },
            {
                question:
                    "How does NumPy broadcasting work?",
                answer:
                    "NumPy compares shapes from their trailing dimensions. Dimensions are compatible when equal or when one is 1; missing leading dimensions behave like 1. Compatible dimensions expand conceptually to a common result shape."
            },
            {
                question:
                    "What is the meaning of axis=0 and axis=1 in a two-dimensional array?",
                answer:
                    "The named axis is the dimension being reduced. For a samples-by-features matrix, reducing axis 0 produces one result per column, while reducing axis 1 produces one result per row."
            },
            {
                question:
                    "What is the difference between a NumPy view and a copy?",
                answer:
                    "A view shares underlying data, so a mutation can affect the original array. A copy owns independent data. Basic slices often return views, while Boolean and fancy indexing generally return copies."
            },
            {
                question:
                    "What is vectorization, and does it change time complexity?",
                answer:
                    "Vectorization expresses operations over complete arrays and delegates loops to optimized implementations. It often reduces constant overhead dramatically but normally does not change an O(n) operation into O(1)."
            },
            {
                question:
                    "What is the difference between reshape and resize?",
                answer:
                    "reshape returns an array with a new shape while preserving the element count and may return a view. resize can change storage and, depending on the API used, may modify the array or repeat or fill values."
            },
            {
                question:
                    "Why should scaling statistics be fitted only on training data?",
                answer:
                    "Using validation or test values to calculate means, standard deviations or ranges leaks information from evaluation data and makes reported performance optimistically biased."
            },
            {
                question:
                    "When would you use loc instead of iloc in Pandas?",
                answer:
                    "loc selects using index and column labels and includes both endpoints in label slices. iloc selects using zero-based integer positions and follows Python's exclusive stop convention."
            },
            {
                question:
                    "How would you make a data analysis workflow reproducible?",
                answer:
                    "Keep raw data immutable, encode transformations in functions or pipelines, validate schemas, record package versions, control random generators, save configuration and data lineage, and avoid hidden manual notebook state."
            }
        ];

        container.innerHTML = questions
            .map(function (item, index) {
                return (
                    '<article class="aiml-interview-item">' +
                    '<div class="aiml-interview-question">' +
                    "<span>" +
                    (index + 1) +
                    ".</span>" +
                    "<strong>" +
                    escapeHtml(
                        item.question
                    ) +
                    "</strong>" +
                    '<button type="button" aria-expanded="false">' +
                    "Show Answer" +
                    "</button>" +
                    "</div>" +
                    '<div class="aiml-interview-answer" hidden>' +
                    escapeHtml(
                        item.answer
                    ) +
                    "</div>" +
                    "</article>"
                );
            })
            .join("");

        container.addEventListener(
            "click",
            function (event) {
                const button =
                    event.target.closest(
                        "button"
                    );

                if (!button) {
                    return;
                }

                const item = button.closest(
                    ".aiml-interview-item"
                );

                const answer =
                    item.querySelector(
                        ".aiml-interview-answer"
                    );

                const opening =
                    answer.hidden;

                answer.hidden = !opening;

                button.textContent = opening
                    ? "Hide Answer"
                    : "Show Answer";

                button.setAttribute(
                    "aria-expanded",
                    String(opening)
                );
            }
        );
    }

    function initSmoothLocalLinks() {
        document.addEventListener(
            "click",
            function (event) {
                const link =
                    event.target.closest(
                        'a[href^="#"]'
                    );

                if (
                    !link ||
                    link.getAttribute(
                        "href"
                    ) === "#"
                ) {
                    return;
                }

                const target =
                    document.querySelector(
                        link.getAttribute(
                            "href"
                        )
                    );

                if (!target) {
                    return;
                }

                event.preventDefault();

                target.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            }
        );
    }

    function initLevelTwo() {
        initBroadcastingVisualizer();
        initProgramTracer();
        initProgrammingProblems();
        initQuiz();
        initInterviewQuestions();
        initSmoothLocalLinks();
    }

    if (
        document.readyState ===
        "loading"
    ) {
        document.addEventListener(
            "DOMContentLoaded",
            initLevelTwo
        );
    } else {
        initLevelTwo();
    }
}());
