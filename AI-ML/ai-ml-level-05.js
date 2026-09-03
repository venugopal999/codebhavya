(function () {
    "use strict";

    const LEVEL_PROGRESS_KEY =
        "codebhavya-aiml-level-05-progress-v1";

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

    function dataTable(rows, mode) {
        return '<div class="aiml-stage-table ' + mode + '">' +
            rows.map(function (row, rowIndex) {
                return "<div" +
                    (rowIndex === 0 ? ' class="head"' : "") +
                    ">" +
                    row.map(function (cell) {
                        const value =
                            typeof cell === "object"
                                ? cell.value
                                : cell;

                        const state =
                            typeof cell === "object"
                                ? " " + cell.state
                                : "";

                        return '<span class="' +
                            state.trim() +
                            '">' +
                            escapeHtml(value) +
                            "</span>";
                    }).join("") +
                    "</div>";
            }).join("") +
            "</div>";
    }

    function initPipelineVisualizer() {
        const stepContainer = byId("pipelineStepNodes");

        if (!stepContainer) {
            return;
        }

        const rawRows = [
            ["age", "city", "score"],
            ["21", "Hyd", "82"],
            [
                {
                    value: "?",
                    state: "missing"
                },
                "hyd ",
                {
                    value: "120",
                    state: "invalid"
                }
            ],
            ["24", "Vij", "95"],
            ["21", "Hyd", "82"]
        ];

        const cleanRows = [
            ["age", "city", "score"],
            ["21", "hyderabad", "82"],
            [
                {
                    value: "22",
                    state: "fixed"
                },
                "hyderabad",
                {
                    value: "100",
                    state: "fixed"
                }
            ],
            ["24", "vijayawada", "95"]
        ];

        const readyRows = [
            [
                "age_z",
                "city_hyd",
                "city_vij",
                "score_z"
            ],
            ["−1.0", "1", "0", "−1.3"],
            ["0.0", "1", "0", "0.2"],
            ["1.0", "0", "1", "1.1"]
        ];

        const steps = [
            {
                short: "Raw",
                sub: "Observe",
                title: "Start with raw observations",
                description:
                    "The source contains one missing age, " +
                    "inconsistent city labels, an impossible " +
                    "score and a duplicate row.",
                insight:
                    "Preserve this raw version. Cleaning should " +
                    "create a reproducible derivative, not " +
                    "overwrite the evidence.",
                graphic: dataTable(rawRows, "raw")
            },
            {
                short: "Split",
                sub: "Protect test",
                title: "Split before learning transformations",
                description:
                    "Separate evaluation evidence before " +
                    "calculating medians, categories, scales " +
                    "or selected features.",
                insight:
                    "The test set imitates unseen production " +
                    "data. Its information must not influence " +
                    "training decisions.",
                graphic:
                    '<div class="aiml-stage-split">' +
                    "<span>RAW DATA<strong>100%</strong></span>" +
                    "<b>→</b>" +
                    '<span class="train">' +
                    "TRAIN<strong>70%</strong></span>" +
                    '<span class="validation">' +
                    "VALIDATION<strong>15%</strong></span>" +
                    '<span class="test">' +
                    "TEST<strong>15%</strong></span>" +
                    "</div>"
            },
            {
                short: "Audit",
                sub: "Diagnose",
                title: "Audit the training data",
                description:
                    "Measure quality issues and inspect them " +
                    "in the context of the prediction problem.",
                insight:
                    "Detection comes before treatment. Missing " +
                    "values and outliers may contain useful " +
                    "process information.",
                graphic:
                    '<div class="aiml-stage-audit">' +
                    "<article>" +
                    "<span>MISSING</span>" +
                    "<strong>1</strong>" +
                    "<i>age</i>" +
                    "</article>" +
                    "<article>" +
                    "<span>INVALID</span>" +
                    "<strong>1</strong>" +
                    "<i>score &gt; 100</i>" +
                    "</article>" +
                    "<article>" +
                    "<span>ALIASES</span>" +
                    "<strong>2</strong>" +
                    "<i>Hyd / hyd</i>" +
                    "</article>" +
                    "<article>" +
                    "<span>DUPLICATES</span>" +
                    "<strong>1</strong>" +
                    "<i>repeated row</i>" +
                    "</article>" +
                    "</div>"
            },
            {
                short: "Clean",
                sub: "Repair",
                title: "Apply documented cleaning rules",
                description:
                    "Impute the age from training statistics, " +
                    "standardize city labels, cap the invalid " +
                    "score and remove the exact duplicate.",
                insight:
                    "Every rule needs a reason, fitted value " +
                    "and audit trail. Do not delete unusual " +
                    "cases automatically.",
                graphic: dataTable(cleanRows, "clean")
            },
            {
                short: "Transform",
                sub: "Encode & scale",
                title:
                    "Learn model-compatible representations",
                description:
                    "Fit numeric scaling and category encoding " +
                    "on training data, then reuse those fitted " +
                    "transformers.",
                insight:
                    "One-hot encoding avoids artificial " +
                    "category order; standardization supports " +
                    "magnitude-sensitive models.",
                graphic:
                    '<div class="aiml-stage-transform">' +
                    "<span>age" +
                    "<strong>StandardScaler</strong></span>" +
                    "<b>+</b>" +
                    "<span>city" +
                    "<strong>OneHotEncoder</strong></span>" +
                    "<b>+</b>" +
                    "<span>score" +
                    "<strong>StandardScaler</strong></span>" +
                    "<i>→ ColumnTransformer →</i>" +
                    "</div>"
            },
            {
                short: "Validate",
                sub: "Assert",
                title: "Validate transformed output",
                description:
                    "Check schema, finite values, column order, " +
                    "category handling and transformation " +
                    "consistency.",
                insight:
                    "A pipeline is not complete until it fails " +
                    "clearly on invalid input and behaves safely " +
                    "on unseen categories.",
                graphic:
                    '<div class="aiml-stage-checks">' +
                    "<span>✓ Expected columns</span>" +
                    "<span>✓ No NaN or infinity</span>" +
                    "<span>✓ Stable feature order</span>" +
                    "<span>✓ Unknown categories handled</span>" +
                    "<span>✓ Train-fitted parameters</span>" +
                    "<span>✓ Reproducible version</span>" +
                    "</div>"
            },
            {
                short: "Ready",
                sub: "Model input",
                title:
                    "Deliver a model-ready feature matrix",
                description:
                    "The estimator receives a numeric, " +
                    "validated matrix generated by one " +
                    "reproducible pipeline.",
                insight:
                    "Keep the preprocessing pipeline with the " +
                    "trained model so inference follows the " +
                    "identical transformation path.",
                graphic:
                    dataTable(readyRows, "ready") +
                    '<div class="aiml-stage-ready-badge">' +
                    "✓ MODEL-READY X" +
                    "</div>"
            }
        ];

        const previousButton = byId("pipelinePrevious");
        const nextButton = byId("pipelineNext");
        const autoButton = byId("pipelineAuto");
        const pauseButton = byId("pipelinePause");
        const resetButton = byId("pipelineReset");
        const progress = byId("pipelineProgress");
        const eyebrow = byId("pipelineStageEyebrow");
        const title = byId("pipelineStageTitle");
        const description = byId(
            "pipelineStageDescription"
        );
        const insight = byId("pipelineStageInsight");
        const graphic = byId("pipelineStageGraphic");

        let currentStep = 0;
        let timer = null;

        stepContainer.innerHTML = steps.map(
            function (step, index) {
                return '<div class="aiml-visual-step" ' +
                    'data-visual-step="' +
                    index +
                    '">' +
                    "<b>" +
                    escapeHtml(step.short) +
                    "</b>" +
                    "<span>" +
                    escapeHtml(step.sub) +
                    "</span>" +
                    "</div>";
            }
        ).join("");

        function stopAutoRun() {
            if (timer !== null) {
                window.clearInterval(timer);
                timer = null;
            }

            pauseButton.disabled = true;
        }

        function render() {
            const step = steps[currentStep];
            const atEnd =
                currentStep === steps.length - 1;

            Array.from(stepContainer.children).forEach(
                function (node, index) {
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
                }
            );

            eyebrow.textContent =
                "STEP " +
                (currentStep + 1) +
                " OF " +
                steps.length;

            title.textContent = step.title;
            description.textContent = step.description;

            insight.innerHTML =
                "<strong>PIPELINE INSIGHT</strong>" +
                "<span>" +
                escapeHtml(step.insight) +
                "</span>";

            graphic.innerHTML = step.graphic;

            progress.textContent =
                "Step " +
                (currentStep + 1) +
                " of " +
                steps.length;

            previousButton.disabled = currentStep === 0;
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
            if (currentStep < steps.length - 1) {
                currentStep += 1;
                render();
            } else {
                stopAutoRun();
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
                    currentStep >= steps.length - 1 ||
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

    function buildTraceStates() {
        const rawScores = [
            82,
            null,
            95,
            120,
            76
        ];

        const states = [];
        const cleanScores = [];

        function snapshot(extra) {
            return Object.assign(
                {
                    raw_scores:
                        "[82, None, 95, 120, 76]",
                    clean_scores:
                        "[" +
                        cleanScores.join(", ") +
                        "]"
                },
                extra || {}
            );
        }

        function add(
            line,
            status,
            explanation,
            expression,
            variables,
            output
        ) {
            states.push({
                line: line,
                status: status,
                explanation: explanation,
                expression: expression,
                variables: variables || {},
                output:
                    output ||
                    "Waiting for print(...)"
            });
        }

        add(
            1,
            "Raw values loaded",
            "Store the five scores, including one " +
                "missing value and one impossible value.",
            "raw_scores = [82, None, 95, 120, 76]",
            snapshot()
        );

        add(
            2,
            "Output list created",
            "Start with an empty list for valid " +
                "cleaned scores.",
            "clean_scores = []",
            snapshot()
        );

        rawScores.forEach(
            function (rawScore, index) {
                let score = rawScore;

                const shown =
                    score === null
                        ? "None"
                        : score;

                add(
                    3,
                    "Loop iteration " + (index + 1),
                    "Read the next raw value. The cursor " +
                        "returns to the loop line for " +
                        "every score.",
                    "score = " + shown,
                    snapshot({
                        index: index,
                        score: shown
                    })
                );

                add(
                    4,
                    "Missing check",
                    score === null
                        ? "The value is missing, so run " +
                            "the documented imputation step."
                        : "The value is present, so skip " +
                            "the imputation assignment.",
                    shown +
                        " is None → " +
                        (score === null),
                    snapshot({
                        score: shown,
                        missing: score === null
                    })
                );

                if (score === null) {
                    score = 80;

                    add(
                        5,
                        "Value imputed",
                        "Replace the missing score with " +
                            "the chosen training-data " +
                            "fallback of 80.",
                        "score = 80",
                        snapshot({
                            score: score,
                            imputed: true
                        })
                    );
                }

                const valid =
                    score >= 0 &&
                    score <= 100;

                add(
                    6,
                    "Range checked",
                    valid
                        ? "The score is inside the valid " +
                            "0–100 range."
                        : "The score is outside the valid " +
                            "0–100 range and will be rejected.",
                    "0 <= " +
                        score +
                        " <= 100 → " +
                        valid,
                    snapshot({
                        score: score,
                        valid: valid
                    })
                );

                if (valid) {
                    cleanScores.push(score);

                    add(
                        7,
                        "Score retained",
                        "Append the valid score to the " +
                            "cleaned list.",
                        "clean_scores.append(" +
                            score +
                            ")",
                        snapshot({
                            score: score
                        })
                    );
                }
            }
        );

        add(
            8,
            "Complete",
            "Display the four valid, model-ready scores.",
            "print(clean_scores)",
            snapshot(),
            "[82, 80, 95, 76]"
        );

        return states;
    }

    function initProgramTracer() {
        const codeContainer = byId("tracerCode");

        if (!codeContainer) {
            return;
        }

        const codeLines = [
            "raw_scores = [82, None, 95, 120, 76]",
            "clean_scores = []",
            "for score in raw_scores:",
            "    if score is None:",
            "        score = 80",
            "    if 0 <= score <= 100:",
            "        clean_scores.append(score)",
            "print(clean_scores)"
        ];

        const traceStates = buildTraceStates();
        const panel = byId("tracerPanel");
        const panelToggle = byId("tracerPanelToggle");
        const previousButton = byId("tracerPrevious");
        const nextButton = byId("tracerNext");
        const autoButton = byId("tracerAuto");
        const pauseButton = byId("tracerPause");
        const resetButton = byId("tracerReset");

        let currentStep = 0;
        let timer = null;

        codeContainer.innerHTML = codeLines.map(
            function (line, index) {
                return '<div class="aiml-code-line" ' +
                    'data-code-line="' +
                    (index + 1) +
                    '">' +
                    "<span>" +
                    String(index + 1).padStart(2, "0") +
                    "</span>" +
                    "<code>" +
                    escapeHtml(line) +
                    "</code>" +
                    "</div>";
            }
        ).join("");

        function stopAutoRun() {
            if (timer !== null) {
                window.clearInterval(timer);
                timer = null;
            }

            pauseButton.disabled = true;
        }

        function renderVariables(variables) {
            const entries =
                Object.entries(variables || {});

            byId("tracerVariables").innerHTML =
                entries.length
                    ? entries.map(function (entry) {
                        return '<article class="aiml-variable">' +
                            "<span>" +
                            escapeHtml(entry[0]) +
                            "</span>" +
                            "<strong>" +
                            escapeHtml(entry[1]) +
                            "</strong>" +
                            "</article>";
                    }).join("")
                    : '<article class="aiml-variable">' +
                        "<span>STATE</span>" +
                        "<strong>Not started</strong>" +
                        "</article>";
        }

        function render() {
            const atStart = currentStep === 0;

            const atEnd =
                currentStep === traceStates.length;

            const state = atStart
                ? null
                : traceStates[currentStep - 1];

            codeContainer
                .querySelectorAll(".aiml-code-line")
                .forEach(function (line) {
                    line.classList.toggle(
                        "is-active",
                        Boolean(state) &&
                            Number(
                                line.dataset.codeLine
                            ) === state.line
                    );
                });

            if (state) {
                byId("tracerStatus").textContent =
                    state.status;

                byId("tracerExplanation").textContent =
                    state.explanation;

                byId("tracerExpression").textContent =
                    state.expression;

                byId("tracerOutput").textContent =
                    state.output;

                renderVariables(state.variables);

                const activeLine =
                    codeContainer.querySelector(
                        '[data-code-line="' +
                            state.line +
                            '"]'
                    );

                if (activeLine) {
                    activeLine.scrollIntoView({
                        behavior: "smooth",
                        block: "nearest"
                    });
                }
            } else {
                byId("tracerStatus").textContent =
                    "Ready";

                byId("tracerExplanation").textContent =
                    "Press Next to execute the first statement.";

                byId("tracerExpression").textContent =
                    "—";

                byId("tracerOutput").textContent =
                    "Waiting for print(...)";

                renderVariables({});
            }

            byId("tracerProgress").textContent =
                "Step " +
                currentStep +
                " of " +
                traceStates.length;

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
            if (currentStep < traceStates.length) {
                currentStep += 1;
                render();
            } else {
                stopAutoRun();
                render();
            }
        }

        panelToggle.addEventListener(
            "click",
            function () {
                const opening = panel.hidden;

                panel.hidden = !opening;

                panelToggle.textContent = opening
                    ? "✕ Close Interactive Tracer"
                    : "Open Interactive Tracer";

                panelToggle.setAttribute(
                    "aria-expanded",
                    String(opening)
                );

                if (opening) {
                    window.setTimeout(
                        function () {
                            panel.scrollIntoView({
                                behavior: "smooth",
                                block: "nearest"
                            });
                        },
                        50
                    );
                } else {
                    stopAutoRun();
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
                    currentStep >= traceStates.length ||
                    timer !== null
                ) {
                    return;
                }

                autoButton.disabled = true;
                pauseButton.disabled = false;

                timer = window.setInterval(
                    goNext,
                    780
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
                title: "Median Imputation",
                description:
                    "Fill missing values in the age column " +
                    "using the column median.",
                sampleInput:
                    "age = [20, NaN, 24, 22, NaN]",
                expected:
                    "[20.0, 22.0, 24.0, 22.0, 22.0]",
                hint:
                    "Use fillna with the median calculated " +
                    "from the same training column.",
                starter:
                    "import pandas as pd\n" +
                    "ages = pd.Series([20, None, 24, 22, None])\n" +
                    "# Fill missing ages with the median\n",
                solution:
                    "import pandas as pd\n" +
                    "ages = pd.Series([20, None, 24, 22, None])\n" +
                    "filled = ages.fillna(ages.median())\n" +
                    "print(filled.tolist())",
                required: [
                    [".median("],
                    [".fillna("],
                    ["print("]
                ]
            },
            {
                title: "Filter Values with the IQR Rule",
                description:
                    "Remove values outside the standard " +
                    "1.5×IQR limits.",
                sampleInput:
                    "[10, 11, 12, 13, 14, 100]",
                expected:
                    "[10, 11, 12, 13, 14]",
                hint:
                    "Calculate Q1, Q3 and IQR, then keep " +
                    "values between the lower and upper limits.",
                starter:
                    "import numpy as np\n" +
                    "values = np.array([10, 11, 12, 13, 14, 100])\n" +
                    "# Keep only values inside the IQR limits\n",
                solution:
                    "import numpy as np\n" +
                    "values = np.array([10, 11, 12, 13, 14, 100])\n" +
                    "q1, q3 = np.percentile(values, [25, 75])\n" +
                    "iqr = q3 - q1\n" +
                    "lower = q1 - 1.5 * iqr\n" +
                    "upper = q3 + 1.5 * iqr\n" +
                    "clean = values[(values >= lower) & " +
                    "(values <= upper)]\n" +
                    "print(clean.tolist())",
                required: [
                    ["np.percentile("],
                    ["iqr"],
                    ["1.5"],
                    ["values >=", "values>="],
                    ["values <=", "values<="],
                    ["print("]
                ]
            },
            {
                title: "Min–Max Scaling",
                description:
                    "Scale the values to the interval from " +
                    "0 to 1 using the formula directly.",
                sampleInput:
                    "[10, 20, 30]",
                expected:
                    "[0.0, 0.5, 1.0]",
                hint:
                    "Subtract the minimum and divide by " +
                    "maximum minus minimum.",
                starter:
                    "import numpy as np\n" +
                    "values = np.array([10, 20, 30], dtype=float)\n" +
                    "# Scale to [0, 1]\n",
                solution:
                    "import numpy as np\n" +
                    "values = np.array([10, 20, 30], dtype=float)\n" +
                    "scaled = (values - values.min()) / " +
                    "(values.max() - values.min())\n" +
                    "print(scaled.tolist())",
                required: [
                    [".min("],
                    [".max("],
                    ["values -", "values-"],
                    ["/"],
                    ["print("]
                ]
            },
            {
                title: "One-Hot Encode a Category",
                description:
                    "Convert the city column into numeric " +
                    "indicator columns.",
                sampleInput:
                    "['Hyderabad', 'Vijayawada', 'Hyderabad']",
                expected:
                    "city_Hyderabad and city_Vijayawada",
                hint:
                    "Use pandas.get_dummies with a city prefix.",
                starter:
                    "import pandas as pd\n" +
                    'cities = pd.Series(["Hyderabad", ' +
                    '"Vijayawada", "Hyderabad"])\n' +
                    "# One-hot encode the cities\n",
                solution:
                    "import pandas as pd\n" +
                    'cities = pd.Series(["Hyderabad", ' +
                    '"Vijayawada", "Hyderabad"])\n' +
                    "encoded = pd.get_dummies(" +
                    'cities, prefix="city", dtype=int)\n' +
                    "print(encoded)",
                required: [
                    ["pd.get_dummies("],
                    ["prefix"],
                    ["print("]
                ]
            },
            {
                title: "Build a Leakage-Safe Pipeline",
                description:
                    "Split the data, then combine median " +
                    "imputation and standardization in one " +
                    "scikit-learn pipeline.",
                sampleInput:
                    "X with missing numeric values",
                expected:
                    "Fit pipeline on X_train only",
                hint:
                    "Use train_test_split followed by " +
                    "Pipeline containing SimpleImputer " +
                    "and StandardScaler.",
                starter:
                    "from sklearn.model_selection " +
                    "import train_test_split\n" +
                    "from sklearn.pipeline import Pipeline\n" +
                    "# Add the required preprocessing steps\n",
                solution:
                    "from sklearn.model_selection " +
                    "import train_test_split\n" +
                    "from sklearn.pipeline import Pipeline\n" +
                    "from sklearn.impute import SimpleImputer\n" +
                    "from sklearn.preprocessing " +
                    "import StandardScaler\n" +
                    "X_train, X_test = train_test_split(" +
                    "X, test_size=0.2, random_state=42)\n" +
                    "preprocess = Pipeline([\n" +
                    '    ("impute", SimpleImputer(' +
                    'strategy="median")),\n' +
                    '    ("scale", StandardScaler())\n' +
                    "])\n" +
                    "X_train_ready = " +
                    "preprocess.fit_transform(X_train)\n" +
                    "X_test_ready = " +
                    "preprocess.transform(X_test)",
                required: [
                    ["train_test_split("],
                    ["pipeline("],
                    ["simpleimputer("],
                    ["standardscaler("],
                    ["fit_transform("],
                    [".transform("]
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
            Array.isArray(saved.solvedProblems)
                ? saved.solvedProblems
                : []
        );

        const scores =
            saved.problemScores &&
            typeof saved.problemScores === "object"
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
                        return sum +
                            Number(score || 0);
                    },
                    0
                );

            byId("problemSolvedCount").textContent =
                solved.size +
                " / " +
                problems.length;

            byId("problemScore").textContent =
                totalScore +
                " / " +
                problems.length * 100;

            byId("problemProgressBar").style.width =
                (
                    solved.size /
                    problems.length
                ) * 100 +
                "%";
        }

        list.innerHTML = problems.map(
            function (problem, index) {
                const number = index + 1;

                return '<article class="aiml-problem-card' +
                    (
                        solved.has(index)
                            ? " is-solved"
                            : ""
                    ) +
                    '" data-problem="' +
                    index +
                    '">' +
                    '<div class="aiml-problem-head">' +
                    '<span class="aiml-problem-number">' +
                    String(number).padStart(2, "0") +
                    "</span>" +
                    "<div>" +
                    "<h3>" +
                    number +
                    ". " +
                    escapeHtml(problem.title) +
                    "</h3>" +
                    "<p>" +
                    escapeHtml(problem.description) +
                    "</p>" +
                    "</div>" +
                    "</div>" +
                    '<div class="aiml-problem-data">' +
                    "<span>" +
                    "<strong>Sample input:</strong> " +
                    escapeHtml(problem.sampleInput) +
                    "</span>" +
                    "<span>" +
                    "<strong>Expected output:</strong> " +
                    "<code>" +
                    escapeHtml(problem.expected) +
                    "</code>" +
                    "</span>" +
                    "</div>" +
                    '<div class="aiml-problem-actions">' +
                    '<button type="button" ' +
                    'class="primary" ' +
                    'data-action="workspace">' +
                    "💻 Solve It Yourself" +
                    "</button>" +
                    '<button type="button" ' +
                    'class="hint" data-action="hint">' +
                    "Hint" +
                    "</button>" +
                    '<button type="button" ' +
                    'data-action="solution">' +
                    "Show Program" +
                    "</button>" +
                    "</div>" +
                    '<div class="aiml-problem-reveal" ' +
                    'data-panel="hint" hidden>' +
                    "<strong>Hint</strong>" +
                    "<p>" +
                    escapeHtml(problem.hint) +
                    "</p>" +
                    "</div>" +
                    '<div class="aiml-problem-reveal" ' +
                    'data-panel="solution" hidden>' +
                    "<strong>Model program</strong>" +
                    "<pre><code>" +
                    escapeHtml(problem.solution) +
                    "</code></pre>" +
                    "</div>" +
                    '<div class="aiml-workspace" ' +
                    'data-panel="workspace" hidden>' +
                    '<label for="problemCode' +
                    index +
                    '">' +
                    "Your Python code" +
                    "</label>" +
                    '<textarea id="problemCode' +
                    index +
                    '" spellcheck="false">' +
                    escapeHtml(problem.starter) +
                    "</textarea>" +
                    '<div class="aiml-workspace-row">' +
                    '<button type="button" ' +
                    'data-action="check">' +
                    "Check Answer" +
                    "</button>" +
                    '<button type="button" ' +
                    'data-action="reset">' +
                    "Reset" +
                    "</button>" +
                    '<span class="aiml-check-result" ' +
                    "data-result>" +
                    "Write your solution, then check " +
                    "its structure." +
                    "</span>" +
                    "</div>" +
                    "</div>" +
                    "</article>";
            }
        ).join("");

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
                const button = event.target.closest(
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

                if (action === "workspace") {
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

                if (action === "solution") {
                    revealed.add(problemIndex);

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
                    card.querySelector("textarea");

                const result =
                    card.querySelector("[data-result]");

                if (action === "reset") {
                    textarea.value = problem.starter;

                    result.className =
                        "aiml-check-result";

                    result.textContent =
                        "Workspace reset. Try the " +
                        "problem again.";

                    return;
                }

                if (action === "check") {
                    const normalized = textarea.value
                        .toLowerCase()
                        .replace(/\s+/g, " ");

                    const missing =
                        problem.required.filter(
                            function (alternatives) {
                                return !alternatives.some(
                                    function (token) {
                                        return normalized
                                            .includes(
                                                token
                                                    .toLowerCase()
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

                    if (missing.length > 0) {
                        result.className =
                            "aiml-check-result error";

                        result.textContent =
                            "Not complete yet. Recheck " +
                            "the required preprocessing " +
                            "steps and output.";

                        return;
                    }

                    const score =
                        revealed.has(problemIndex)
                            ? 60
                            : 100;

                    solved.add(problemIndex);

                    scores[problemIndex] = Math.max(
                        Number(
                            scores[problemIndex] || 0
                        ),
                        score
                    );

                    card.classList.add("is-solved");

                    result.className =
                        "aiml-check-result success";

                    result.textContent =
                        revealed.has(problemIndex)
                            ? "Logic recognized — completed " +
                                "after viewing the model " +
                                "program. Score: 60/100."
                            : "Logic recognized — solved " +
                                "independently. Score: 100/100.";

                    saveProgress();
                    updateSummary();
                }
            }
        );

        updateSummary();
    }

    function initQuiz() {
        const container = byId("quizQuestions");

        if (!container) {
            return;
        }

        const questions = [
            {
                question:
                    "When should a scaler be fitted?",
                options: [
                    "Before splitting on all data",
                    "Only on training data",
                    "Separately on every test row",
                    "After deployment"
                ],
                answer: 1,
                explanation:
                    "Learn scaling parameters only from " +
                    "training data, then reuse them to " +
                    "transform validation, test and " +
                    "production inputs."
            },
            {
                question:
                    "Which statistic is usually more robust " +
                    "for imputing a highly skewed numeric feature?",
                options: [
                    "Maximum",
                    "Mean",
                    "Median",
                    "Variance"
                ],
                answer: 2,
                explanation:
                    "The median is less affected by extreme " +
                    "values and is a strong baseline for " +
                    "skewed numeric data."
            },
            {
                question:
                    "What is target leakage?",
                options: [
                    "A target contains missing values",
                    "A feature contains information " +
                        "unavailable at prediction time " +
                        "that reveals the target",
                    "The training set is small",
                    "A category is unseen"
                ],
                answer: 1,
                explanation:
                    "Target leakage lets the model use " +
                    "answer-related information that would " +
                    "not be available when a real prediction " +
                    "is made."
            },
            {
                question:
                    "Which encoder is appropriate for a " +
                    "low-cardinality nominal feature?",
                options: [
                    "One-hot encoding",
                    "Ordinal encoding with arbitrary ranks",
                    "No representation",
                    "Sorting alphabetically"
                ],
                answer: 0,
                explanation:
                    "One-hot encoding represents nominal " +
                    "categories without inventing an " +
                    "artificial numeric order."
            },
            {
                question:
                    "Which models are most sensitive to " +
                    "feature scale?",
                options: [
                    "Only decision trees",
                    "Distance-based and gradient-based models",
                    "All models equally",
                    "Rule-based programs only"
                ],
                answer: 1,
                explanation:
                    "Distance calculations and gradient " +
                    "optimization can be dominated by " +
                    "large-magnitude features."
            },
            {
                question:
                    "Where should SMOTE be applied?",
                options: [
                    "Before splitting",
                    "To the test set",
                    "Only within training data or training folds",
                    "After final predictions"
                ],
                answer: 2,
                explanation:
                    "Applying SMOTE before splitting can " +
                    "create related synthetic information " +
                    "across evaluation boundaries and " +
                    "produce optimistic scores."
            },
            {
                question:
                    "What should happen to an outlier " +
                    "immediately after detection?",
                options: [
                    "Always delete it",
                    "Always replace it with zero",
                    "Investigate its validity and meaning",
                    "Move it to the test set"
                ],
                answer: 2,
                explanation:
                    "An outlier may be an error, a rare " +
                    "valid case or the most valuable signal. " +
                    "Treatment depends on that diagnosis."
            },
            {
                question:
                    "Why combine preprocessing and a model " +
                    "in one Pipeline?",
                options: [
                    "To increase row count",
                    "To guarantee identical leakage-safe " +
                        "transformations during validation " +
                        "and inference",
                    "To remove the need for testing",
                    "To convert every task to classification"
                ],
                answer: 1,
                explanation:
                    "A pipeline keeps fitted preprocessing " +
                    "with the model and applies the correct " +
                    "sequence inside cross-validation and " +
                    "production."
            }
        ];

        container.innerHTML = questions.map(
            function (item, questionIndex) {
                return '<article class="aiml-quiz-question" ' +
                    'data-quiz-question="' +
                    questionIndex +
                    '">' +
                    "<strong>" +
                    (questionIndex + 1) +
                    ". " +
                    escapeHtml(item.question) +
                    "</strong>" +
                    '<div class="aiml-quiz-options">' +
                    item.options.map(
                        function (option, optionIndex) {
                            const inputId =
                                "quiz-" +
                                questionIndex +
                                "-" +
                                optionIndex;

                            return '<label class="aiml-quiz-option" ' +
                                'for="' +
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
                                    65 + optionIndex
                                ) +
                                ". " +
                                escapeHtml(option) +
                                "</span>" +
                                "</label>";
                        }
                    ).join("") +
                    "</div>" +
                    '<div class="aiml-quiz-explanation" ' +
                    "hidden></div>" +
                    "</article>";
            }
        ).join("");

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

                event.target
                    .closest(".aiml-quiz-question")
                    .querySelectorAll(
                        ".aiml-quiz-option"
                    )
                    .forEach(function (option) {
                        option.classList.toggle(
                            "is-selected",
                            option.contains(event.target)
                        );
                    });
            }
        );

        byId("checkQuiz").addEventListener(
            "click",
            function () {
                let correct = 0;
                let answered = 0;

                questions.forEach(
                    function (item, questionIndex) {
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

                        const options = Array.from(
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
                           
