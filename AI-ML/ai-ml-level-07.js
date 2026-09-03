(function () {
    "use strict";

    const LEVEL_PROGRESS_KEY =
        "codebhavya-aiml-level-07-progress-v1";

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

    function boundaryPlane(mode) {
        const points = [
            [14, 21, 0],
            [26, 34, 0],
            [35, 18, 0],
            [42, 42, 0],
            [60, 57, 1],
            [69, 72, 1],
            [78, 51, 1],
            [87, 80, 1]
        ];

        return '<div class="aiml-stage-boundary ' +
            mode +
            '">' +
            '<span class="zone zero">CLASS 0</span>' +
            '<span class="zone one">CLASS 1</span>' +
            "<b></b>" +
            points.map(function (point, index) {
                return '<i class="c' +
                    point[2] +
                    " p" +
                    (index + 1) +
                    '" style="--x:' +
                    point[0] +
                    "%;--y:" +
                    point[1] +
                    '%"></i>';
            }).join("") +
            "<em>x₁</em><strong>x₂</strong></div>";
    }

    function probabilityRows(threshold) {
        const values = [
            ["A", 0, 0.12],
            ["B", 0, 0.38],
            ["C", 1, 0.64],
            ["D", 1, 0.87]
        ];

        return '<div class="aiml-probability-table">' +
            '<div class="head">' +
            "<span>ID</span>" +
            "<span>ACTUAL</span>" +
            "<span>p(y=1)</span>" +
            "<span>PREDICT</span></div>" +
            values.map(function (row) {
                const prediction =
                    row[2] >= threshold ? 1 : 0;

                const correct =
                    prediction === row[1];

                return "<div><span>" +
                    row[0] +
                    "</span><span>" +
                    row[1] +
                    "</span><span>" +
                    row[2].toFixed(2) +
                    '</span><strong class="' +
                    (correct ? "correct" : "wrong") +
                    '">' +
                    prediction +
                    "</strong></div>";
            }).join("") +
            "<b>threshold = " +
            threshold.toFixed(2) +
            "</b></div>";
    }

    function initBoundaryVisualizer() {
        const stepContainer =
            byId("boundaryStepNodes");

        if (!stepContainer) {
            return;
        }

        const steps = [
            {
                short: "Labels",
                sub: "Observe",
                title: "Observe labeled examples",
                description:
                    "Training examples show two outcomes across the feature space.",
                insight:
                    "The positive class must be defined before metrics or error costs can be interpreted.",
                graphic: boundaryPlane("labels-only")
            },
            {
                short: "Score",
                sub: "Combine",
                title:
                    "Combine features into a linear score",
                description:
                    "Weights and bias summarize evidence as z = wᵀx + b.",
                insight:
                    "The score is unrestricted. It represents log-odds, not yet a probability.",
                graphic:
                    '<div class="aiml-score-stage">' +
                    "<div><span>FEATURES</span>" +
                    "<strong>x₁ = 0.7<br>x₂ = 0.4</strong></div>" +
                    "<b>× weights + bias →</b>" +
                    "<div><span>LINEAR SCORE</span>" +
                    "<code>z = 1.25</code></div></div>"
            },
            {
                short: "Sigmoid",
                sub: "Probability",
                title: "Map the score to probability",
                description:
                    "Sigmoid compresses the score into the interval from zero to one.",
                insight:
                    "Probability quality should be checked with log loss, Brier score and calibration—not accuracy alone.",
                graphic:
                    '<div class="aiml-sigmoid-stage">' +
                    '<div class="curve">' +
                    "<i></i><b></b><span>0.5</span></div>" +
                    "<code>σ(1.25) = 0.777</code>" +
                    "<strong>77.7% estimated probability of class 1</strong>" +
                    "</div>"
            },
            {
                short: "Boundary",
                sub: "Separate",
                title: "Learn a decision boundary",
                description:
                    "At threshold 0.5, the boundary occurs where the linear score equals zero.",
                insight:
                    "A linear logistic model produces a linear boundary unless nonlinear features are added.",
                graphic:
                    boundaryPlane("with-boundary") +
                    '<div class="aiml-boundary-formula">' +
                    "w₁x₁ + w₂x₂ + b = 0</div>"
            },
            {
                short: "Threshold",
                sub: "Decide",
                title: "Apply a validated threshold",
                description:
                    "A probability becomes an operational class decision only after a threshold is chosen.",
                insight:
                    "Lowering the threshold usually increases recall and false positives. Choose using validation data and costs.",
                graphic: probabilityRows(0.50)
            },
            {
                short: "Matrix",
                sub: "Count",
                title: "Count every prediction outcome",
                description:
                    "The confusion matrix separates correct decisions from the two different error types.",
                insight:
                    "False positives and false negatives should never be merged when their consequences differ.",
                graphic:
                    '<div class="aiml-stage-confusion">' +
                    "<span></span>" +
                    "<strong>PRED +</strong>" +
                    "<strong>PRED −</strong>" +
                    "<strong>ACTUAL +</strong>" +
                    '<b class="tp">TP<br>42</b>' +
                    '<b class="fn">FN<br>8</b>' +
                    "<strong>ACTUAL −</strong>" +
                    '<b class="fp">FP<br>6</b>' +
                    '<b class="tn">TN<br>44</b></div>'
            },
            {
                short: "Metrics",
                sub: "Validate",
                title:
                    "Evaluate the decisions that matter",
                description:
                    "Use the confusion counts to calculate recall, precision, specificity and F1.",
                insight:
                    "The final threshold and metric must match deployment costs, prevalence and human review capacity.",
                graphic:
                    '<div class="aiml-stage-metrics">' +
                    "<article><span>PRECISION</span>" +
                    "<strong>87.5%</strong>" +
                    "<code>42 / (42+6)</code></article>" +
                    "<article><span>RECALL</span>" +
                    "<strong>84.0%</strong>" +
                    "<code>42 / (42+8)</code></article>" +
                    "<article><span>SPECIFICITY</span>" +
                    "<strong>88.0%</strong>" +
                    "<code>44 / (44+6)</code></article>" +
                    "<article><span>F1</span>" +
                    "<strong>85.7%</strong>" +
                    "<code>2PR / (P+R)</code></article>" +
                    "<b>✓ VALIDATED OPERATING POINT</b></div>"
            }
        ];

        const previousButton =
            byId("boundaryPrevious");

        const nextButton =
            byId("boundaryNext");

        const autoButton =
            byId("boundaryAuto");

        const pauseButton =
            byId("boundaryPause");

        const resetButton =
            byId("boundaryReset");

        const progress =
            byId("boundaryProgress");

        const eyebrow =
            byId("boundaryStageEyebrow");

        const title =
            byId("boundaryStageTitle");

        const description =
            byId("boundaryStageDescription");

        const insight =
            byId("boundaryStageInsight");

        const graphic =
            byId("boundaryStageGraphic");

        let currentStep = 0;
        let timer = null;

        stepContainer.innerHTML =
            steps.map(function (step, index) {
                return '<div class="aiml-visual-step" data-visual-step="' +
                    index +
                    '"><b>' +
                    escapeHtml(step.short) +
                    "</b><span>" +
                    escapeHtml(step.sub) +
                    "</span></div>";
            }).join("");

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
                "<strong>CLASSIFIER INSIGHT</strong>" +
                "<span>" +
                escapeHtml(step.insight) +
                "</span>";

            graphic.innerHTML = step.graphic;

            progress.textContent =
                "Step " +
                (currentStep + 1) +
                " of " +
                steps.length;

            previousButton.disabled =
                currentStep === 0;

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

    function buildTraceStates() {
        const x = [-1, 0, 1];
        const y = [0, 0, 1];
        const states = [];

        let weight = 0;
        let bias = 0;

        const rate = 0.5;

        let epoch = null;
        let dw = null;
        let db = null;
        let xi = null;
        let yi = null;
        let score = null;
        let probability = null;
        let error = null;

        function fixed(value) {
            return typeof value === "number"
                ? Number(value.toFixed(4))
                : value;
        }

        function snapshot() {
            const values = {
                x: "[-1.0, 0.0, 1.0]",
                y: "[0, 0, 1]",
                weight: fixed(weight),
                bias: fixed(bias),
                rate: rate
            };

            if (epoch !== null) {
                values.epoch = epoch;
            }

            if (dw !== null) {
                values.dw = fixed(dw);
            }

            if (db !== null) {
                values.db = fixed(db);
            }

            if (xi !== null) {
                values.xi = xi;
            }

            if (yi !== null) {
                values.yi = yi;
            }

            if (score !== null) {
                values.score = fixed(score);
            }

            if (probability !== null) {
                values.probability =
                    fixed(probability);
            }

            if (error !== null) {
                values.error = fixed(error);
            }

            return values;
        }

        function add(
            line,
            status,
            explanation,
            expression,
            output
        ) {
            states.push({
                line: line,
                status: status,
                explanation: explanation,
                expression: expression,
                variables: snapshot(),
                output:
                    output ||
                    "Waiting for print(...)"
            });
        }

        add(
            1,
            "Features loaded",
            "Store three ordered feature values.",
            "x = [-1.0, 0.0, 1.0]"
        );

        add(
            2,
            "Labels loaded",
            "Store binary labels for the three observations.",
            "y = [0, 0, 1]"
        );

        add(
            3,
            "Weight initialized",
            "Start with a zero feature coefficient.",
            "weight = 0.0"
        );

        add(
            4,
            "Bias initialized",
            "Start with a zero intercept.",
            "bias = 0.0"
        );

        add(
            5,
            "Learning rate set",
            "Use 0.5 as the batch update step size.",
            "rate = 0.5"
        );

        for (
            let epochIndex = 0;
            epochIndex < 2;
            epochIndex += 1
        ) {
            epoch = epochIndex;

            dw = null;
            db = null;
            xi = null;
            yi = null;
            score = null;
            probability = null;
            error = null;

            add(
                6,
                "Epoch " + (epochIndex + 1),
                "Enter the outer loop. The cursor returns here before every complete training pass.",
                "epoch = " + epochIndex
            );

            dw = 0;

            add(
                7,
                "Weight gradient reset",
                "Reset the accumulated weight gradient for this epoch.",
                "dw = 0.0"
            );

            db = 0;

            add(
                8,
                "Bias gradient reset",
                "Reset the accumulated bias gradient for this epoch.",
                "db = 0.0"
            );

            for (
                let index = 0;
                index < x.length;
                index += 1
            ) {
                xi = x[index];
                yi = y[index];

                score = null;
                probability = null;
                error = null;

                add(
                    9,
                    "Epoch " +
                        (epochIndex + 1) +
                        " • sample " +
                        (index + 1),
                    "Read the next feature and label. The cursor returns to this inner loop for every sample.",
                    "xi, yi = " +
                        xi +
                        ", " +
                        yi
                );

                score =
                    weight * xi + bias;

                add(
                    10,
                    "Linear score calculated",
                    "Combine the current weight, feature and bias.",
                    "score = " +
                        fixed(weight) +
                        " × " +
                        xi +
                        " + " +
                        fixed(bias) +
                        " = " +
                        fixed(score)
                );

                probability =
                    1 /
                    (1 + Math.exp(-score));

                add(
                    11,
                    "Sigmoid probability calculated",
                    "Convert the score into a class-1 probability.",
                    "probability = σ(" +
                        fixed(score) +
                        ") = " +
                        fixed(probability)
                );

                error =
                    probability - yi;

                add(
                    12,
                    "Probability error calculated",
                    "Subtract the actual label from the predicted probability.",
                    "error = " +
                        fixed(probability) +
                        " − " +
                        yi +
                        " = " +
                        fixed(error)
                );

                dw += error * xi;

                add(
                    13,
                    "Weight gradient accumulated",
                    "Add probability error × feature.",
                    "dw += " +
                        fixed(error) +
                        " × " +
                        xi +
                        " → " +
                        fixed(dw)
                );

                db += error;

                add(
                    14,
                    "Bias gradient accumulated",
                    "Add this sample's probability error.",
                    "db += " +
                        fixed(error) +
                        " → " +
                        fixed(db)
                );
            }

            weight -=
                rate * dw / x.length;

            add(
                15,
                "Weight updated",
                "Move the coefficient opposite the mean batch gradient.",
                "weight -= 0.5 × " +
                    fixed(dw) +
                    " / 3 → " +
                    fixed(weight)
            );

            bias -=
                rate * db / x.length;

            add(
                16,
                "Bias updated",
                "Move the intercept opposite the mean batch gradient.",
                "bias -= 0.5 × " +
                    fixed(db) +
                    " / 3 → " +
                    fixed(bias)
            );
        }

        xi = null;
        yi = null;
        score = null;
        probability = null;
        error = null;

        add(
            17,
            "Complete",
            "Round and display the parameters learned after two epochs.",
            "print(round(weight, 2), round(bias, 2))",
            "0.32 -0.16"
        );

        return states;
    }

    function initProgramTracer() {
        const codeContainer =
            byId("tracerCode");

        if (!codeContainer) {
            return;
        }

        const codeLines = [
            "x = [-1.0, 0.0, 1.0]",
            "y = [0, 0, 1]",
            "weight = 0.0",
            "bias = 0.0",
            "rate = 0.5",
            "for epoch in range(2):",
            "    dw = 0.0",
            "    db = 0.0",
            "    for xi, yi in zip(x, y):",
            "        score = weight * xi + bias",
            "        probability = 1 / (1 + exp(-score))",
            "        error = probability - yi",
            "        dw += error * xi",
            "        db += error",
            "    weight -= rate * dw / len(x)",
            "    bias -= rate * db / len(x)",
            "print(round(weight, 2), round(bias, 2))"
        ];

        const traceStates =
            buildTraceStates();

        const panel =
            byId("tracerPanel");

        const panelToggle =
            byId("tracerPanelToggle");

        const previousButton =
            byId("tracerPrevious");

        const nextButton =
            byId("tracerNext");

        const autoButton =
            byId("tracerAuto");

        const pauseButton =
            byId("tracerPause");

        const resetButton =
            byId("tracerReset");

        let currentStep = 0;
        let timer = null;

        codeContainer.innerHTML =
            codeLines.map(
                function (line, index) {
                    return '<div class="aiml-code-line" data-code-line="' +
                        (index + 1) +
                        '"><span>' +
                        String(index + 1)
                            .padStart(2, "0") +
                        "</span><code>" +
                        escapeHtml(line) +
                        "</code></div>";
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
                Object.entries(
                    variables || {}
                );

            byId("tracerVariables").innerHTML =
                entries.length
                    ? entries.map(
                        function (entry) {
                            return '<article class="aiml-variable">' +
                                "<span>" +
                                escapeHtml(entry[0]) +
                                "</span><strong>" +
                                escapeHtml(entry[1]) +
                                "</strong></article>";
                        }
                    ).join("")
                    : '<article class="aiml-variable">' +
                      "<span>STATE</span>" +
                      "<strong>Not started</strong>" +
                      "</article>";
        }

        function render() {
            const atStart =
                currentStep === 0;

            const atEnd =
                currentStep ===
                traceStates.length;

            const state = atStart
                ? null
                : traceStates[
                    currentStep - 1
                ];

            codeContainer
                .querySelectorAll(
                    ".aiml-code-line"
                )
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
                byId("tracerStatus")
                    .textContent =
                    state.status;

                byId("tracerExplanation")
                    .textContent =
                    state.explanation;

                byId("tracerExpression")
                    .textContent =
                    state.expression;

                byId("tracerOutput")
                    .textContent =
                    state.output;

                renderVariables(
                    state.variables
                );

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
                byId("tracerStatus")
                    .textContent =
                    "Ready";

                byId("tracerExplanation")
                    .textContent =
                    "Press Next to execute the first statement.";

                byId("tracerExpression")
                    .textContent =
                    "—";

                byId("tracerOutput")
                    .textContent =
                    "Waiting for print(...)";

                renderVariables({});
            }

            previousButton.disabled =
                atStart;

            nextButton.disabled =
                atEnd;

            autoButton.disabled =
                atEnd || timer !== null;

            byId("tracerProgress")
                .textContent =
                atStart
                    ? "Step 0 of " +
                      traceStates.length
                    : "Step " +
                      currentStep +
                      " of " +
                      traceStates.length;

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
            } else {
                stopAutoRun();
                render();
            }
        }

        panelToggle.addEventListener(
            "click",
            function () {
                const opening =
                    panel.hidden;

                panel.hidden = !opening;

                panelToggle.textContent =
                    opening
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

                currentStep =
                    Math.max(
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
                    850
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
        const list =
            byId("problemList");

        if (!list) {
            return;
        }

        const problems = [
            {
                title:
                    "Calculate a Sigmoid Probability",
                description:
                    "Read a linear score and print sigmoid(score) rounded to four decimals.",
                sampleInput: "1.5",
                expected: "0.8176",
                hint:
                    "Use 1 / (1 + math.exp(-score)).",
                starter:
                    "import math\n" +
                    "# Read score and calculate sigmoid\n",
                solution:
                    "import math\n" +
                    "score = float(input())\n" +
                    "probability = 1 / (1 + math.exp(-score))\n" +
                    "print(round(probability, 4))",
                required: [
                    ["import math", "from math"],
                    ["input("],
                    ["exp("],
                    ["1 +"],
                    ["print("]
                ]
            },
            {
                title:
                    "Apply a Decision Threshold",
                description:
                    "Read probabilities and a threshold; print the resulting 0/1 predictions.",
                sampleInput:
                    "0.2 0.55 0.8 | 0.6",
                expected: "0 0 1",
                hint:
                    "Each prediction is int(probability >= threshold).",
                starter:
                    "probabilities = list(map(float, input().split()))\n" +
                    "threshold = float(input())\n",
                solution:
                    "probabilities = list(map(float, input().split()))\n" +
                    "threshold = float(input())\n" +
                    "predictions = [int(p >= threshold) for p in probabilities]\n" +
                    "print(*predictions)",
                required: [
                    [">= threshold"],
                    [
                        "for p in probabilities",
                        "for probability in probabilities"
                    ],
                    ["int("],
                    ["print("]
                ]
            },
            {
                title:
                    "Compute Precision, Recall and F1",
                description:
                    "Read TP, FP and FN; print precision, recall and F1 rounded to three decimals.",
                sampleInput: "42 6 8",
                expected:
                    "0.875 0.84 0.857",
                hint:
                    "Precision=TP/(TP+FP), recall=TP/(TP+FN), then use their harmonic mean.",
                starter:
                    "tp, fp, fn = map(int, input().split())\n",
                solution:
                    "tp, fp, fn = map(int, input().split())\n" +
                    "precision = tp / (tp + fp)\n" +
                    "recall = tp / (tp + fn)\n" +
                    "f1 = 2 * precision * recall / (precision + recall)\n" +
                    "print(round(precision, 3), round(recall, 3), round(f1, 3))",
                required: [
                    ["tp + fp", "tp+fp"],
                    ["tp + fn", "tp+fn"],
                    ["precision"],
                    ["recall"],
                    ["f1"],
                    ["print("]
                ]
            },
            {
                title:
                    "Perform One Logistic Gradient Update",
                description:
                    "For one sample, calculate probability error and update weight and bias.",
                sampleInput:
                    "x=1, y=1, w=0, b=0, rate=0.2",
                expected:
                    "w=0.1 b=0.1",
                hint:
                    "At score 0, sigmoid is 0.5; error is probability-y.",
                starter:
                    "import math\n" +
                    "x, y = 1.0, 1\n" +
                    "weight = bias = 0.0\n" +
                    "rate = 0.2\n",
                solution:
                    "import math\n" +
                    "x, y = 1.0, 1\n" +
                    "weight = bias = 0.0\n" +
                    "rate = 0.2\n" +
                    "score = weight * x + bias\n" +
                    "probability = 1 / (1 + math.exp(-score))\n" +
                    "error = probability - y\n" +
                    "weight -= rate * error * x\n" +
                    "bias -= rate * error\n" +
                    "print(round(weight, 2), round(bias, 2))",
                required: [
                    ["exp("],
                    ["probability"],
                    ["error"],
                    ["weight -="],
                    ["bias -="],
                    ["print("]
                ]
            },
            {
                title:
                    "Build and Evaluate a Classifier Pipeline",
                description:
                    "Create a scaled logistic-regression pipeline and print a classification report.",
                sampleInput:
                    "X_train, X_test, y_train, y_test",
                expected:
                    "Precision, recall and F1 report",
                hint:
                    "Combine StandardScaler and LogisticRegression in Pipeline, fit, predict and call classification_report.",
                starter:
                    "from sklearn.pipeline import Pipeline\n" +
                    "# Add the classifier workflow\n",
                solution:
                    "from sklearn.pipeline import Pipeline\n" +
                    "from sklearn.preprocessing import StandardScaler\n" +
                    "from sklearn.linear_model import LogisticRegression\n" +
                    "from sklearn.metrics import classification_report\n" +
                    'model = Pipeline([("scale", StandardScaler()), ' +
                    '("classifier", LogisticRegression())])\n' +
                    "model.fit(X_train, y_train)\n" +
                    "predictions = model.predict(X_test)\n" +
                    "print(classification_report(y_test, predictions))",
                required: [
                    ["pipeline("],
                    ["standardscaler("],
                    ["logisticregression("],
                    [".fit("],
                    [".predict("],
                    ["classification_report("]
                ]
            }
        ];

        let saved = {};

        try {
            saved = JSON.parse(
                window.localStorage
                    .getItem(
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
                    window.localStorage
                        .getItem(
                            LEVEL_PROGRESS_KEY
                        ) || "{}"
                );
            } catch (error) {
                current = {};
            }

            current.solvedProblems =
                Array.from(solved);

            current.problemScores =
                scores;

            window.localStorage.setItem(
                LEVEL_PROGRESS_KEY,
                JSON.stringify(current)
            );
        }

        function updateSummary() {
            const totalScore =
                Object.values(scores).reduce(
                    function (sum, value) {
                        return sum +
                            Number(value || 0);
                    },
                    0
                );

            byId("problemSolvedCount")
                .textContent =
                solved.size +
                " / " +
                problems.length;

            byId("problemScore")
                .textContent =
                totalScore +
                " / " +
                problems.length * 100;

            byId("problemProgressBar")
                .style.width =
                (
                    solved.size /
                    problems.length
                ) *
                100 +
                "%";
        }

        list.innerHTML =
            problems.map(
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
                        String(number)
                            .padStart(2, "0") +
                        "</span><div><h3>" +
                        number +
                        ". " +
                        escapeHtml(
                            problem.title
                        ) +
                        "</h3><p>" +
                        escapeHtml(
                            problem.description
                        ) +
                        "</p></div></div>" +
                        '<div class="aiml-problem-data">' +
                        "<span><strong>Sample input:</strong> " +
                        escapeHtml(
                            problem.sampleInput
                        ) +
                        "</span>" +
                        "<span><strong>Expected output:</strong> " +
                        "<code>" +
                        escapeHtml(
                            problem.expected
                        ) +
                        "</code></span></div>" +
                        '<div class="aiml-problem-actions">' +
                        '<button type="button" class="primary" data-action="workspace">' +
                        "💻 Solve It Yourself</button>" +
                        '<button type="button" class="hint" data-action="hint">' +
                        "Hint</button>" +
                        '<button type="button" data-action="solution">' +
                        "Show Program</button></div>" +
                        '<div class="aiml-problem-reveal" data-panel="hint" hidden>' +
                        "<strong>Hint</strong><p>" +
                        escapeHtml(
                            problem.hint
                        ) +
                        "</p></div>" +
                        '<div class="aiml-problem-reveal" data-panel="solution" hidden>' +
                        "<strong>Model program</strong>" +
                        "<pre><code>" +
                        escapeHtml(
                            problem.solution
                        ) +
                        "</code></pre></div>" +
                        '<div class="aiml-workspace" data-panel="workspace" hidden>' +
                        '<label for="problemCode' +
                        index +
                        '">Your Python code</label>' +
                        '<textarea id="problemCode' +
                        index +
                        '" spellcheck="false">' +
                        escapeHtml(
                            problem.starter
                        ) +
                        "</textarea>" +
                        '<div class="aiml-workspace-row">' +
                        '<button type="button" data-action="check">' +
                        "Check Answer</button>" +
                        '<button type="button" data-action="reset">' +
                        "Reset</button>" +
                        '<span class="aiml-check-result" data-result>' +
                        "Write your solution, then check its structure." +
                        "</span></div></div></article>";
                }
            ).join("");

        function togglePanel(
            card,
            panelName,
            button,
            openLabel,
            closeLabel
        ) {
            const panel =
                card.querySelector(
                    '[data-panel="' +
                    panelName +
                    '"]'
                );

            if (!panel) {
                return;
            }

            const opening = panel.hidden;

            panel.hidden = !opening;

            button.textContent =
                opening
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

                const card =
                    button.closest(
                        ".aiml-problem-card"
                    );

                const problemIndex =
                    Number(
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
                                return !alternatives
                                    .some(
                                        function (
                                            token
                                        ) {
                                            return normalized
                                                .includes(
                                                    token.toLowerCase()
                                                );
                                        }
                                    );
                            }
                        );

                    if (
                        !textarea.value.trim() ||
                        textarea.value.trim() ===
                            problem.starter
                                .trim()
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
                            "Not complete yet. Recheck the required formula, metric or pipeline steps.";

                        return;
                    }

                    const scoreValue =
                        revealed.has(
                            problemIndex
                        )
                            ? 60
                            : 100;

                    solved.add(problemIndex);

                    scores[problemIndex] =
                        Math.max(
                            Number(
                                scores[
                                    problemIndex
                                ] || 0
                            ),
                            scoreValue
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
        const container =
            byId("quizQuestions");

        if (!container) {
            return;
        }

        const questions = [
            {
                question:
                    "What does logistic regression model as a linear function?",
                options: [
                    "Probability directly",
                    "Log-odds",
                    "Predicted class only",
                    "Accuracy"
                ],
                answer: 1,
                explanation:
                    "The logit log(p/(1−p)) is modeled as wᵀx+b; sigmoid then produces probability."
            },
            {
                question:
                    "What probability does sigmoid return when z=0?",
                options: [
                    "0",
                    "0.25",
                    "0.5",
                    "1"
                ],
                answer: 2,
                explanation:
                    "σ(0)=1/(1+e⁰)=1/2."
            },
            {
                question:
                    "What usually happens when the classification threshold is lowered?",
                options: [
                    "Recall rises and false positives may rise",
                    "Recall always falls",
                    "All probabilities change",
                    "Training data increases"
                ],
                answer: 0,
                explanation:
                    "More observations qualify as positive, often catching more positives while also creating more false alarms."
            },
            {
                question:
                    "Which metric asks: of predicted positives, how many were correct?",
                options: [
                    "Recall",
                    "Specificity",
                    "Precision",
                    "Accuracy"
                ],
                answer: 2,
                explanation:
                    "Precision is TP/(TP+FP)."
            },
            {
                question:
                    "Which metric is commonly emphasized when missing a positive is costly?",
                options: [
                    "Recall",
                    "Specificity only",
                    "Training accuracy",
                    "R²"
                ],
                answer: 0,
                explanation:
                    "Recall measures the fraction of real positives detected, although the complete decision should also consider false positives and costs."
            },
            {
                question:
                    "Why can accuracy mislead on imbalanced data?",
                options: [
                    "Accuracy uses logarithms",
                    "The majority class can dominate the score",
                    "It requires scaled features",
                    "It cannot count correct predictions"
                ],
                answer: 1,
                explanation:
                    "Predicting only the majority class can achieve high accuracy while completely failing the rare class."
            },
            {
                question:
                    "Which curve is often more informative for rare positive classes?",
                options: [
                    "PR curve",
                    "Only residual plot",
                    "Learning-rate curve",
                    "Histogram of IDs"
                ],
                answer: 0,
                explanation:
                    "Precision–recall analysis focuses on positive detection quality when negatives dominate."
            },
            {
                question:
                    "What does good probability calibration mean?",
                options: [
                    "Every probability is above 0.5",
                    "Predicted probabilities match observed frequencies",
                    "Accuracy is 100%",
                    "All coefficients are zero"
                ],
                answer: 1,
                explanation:
                    "Among cases predicted near 0.7, approximately 70% should be positive over repeated comparable cases."
            }
        ];

        container.innerHTML =
            questions.map(
                function (
                    item,
                    questionIndex
                ) {
                    return '<article class="aiml-quiz-question" data-quiz-question="' +
                        questionIndex +
                        '"><strong>' +
                        (questionIndex + 1) +
                        ". " +
                        escapeHtml(
                            item.question
                        ) +
                        '</strong><div class="aiml-quiz-options">' +
                        item.options.map(
                            function (
                                option,
                                optionIndex
                            ) {
                                const inputId =
                                    "quiz-" +
                                    questionIndex +
                                    "-" +
                                    optionIndex;

                                return '<label class="aiml-quiz-option" for="' +
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
                                    "</span></label>";
                            }
                        ).join("") +
                        '</div><div class="aiml-quiz-explanation" hidden></div></article>';
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
                    .closest(
                        ".aiml-quiz-question"
                    )
                    .querySelectorAll(
                        ".aiml-quiz-option"
                    )
                    .forEach(
                        function (option) {
                            option.classList
                                .toggle(
                                    "is-selected",
                                    option.contains(
                                        event.target
                                    )
                                );
                        }
                    );
            }
        );

        byId("checkQuiz")
            .addEventListener(
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
                                    option.classList
                                        .remove(
                                            "is-correct",
                                            "is-wrong"
                                        );

                                    if (
                                        optionIndex ===
                                        item.answer
                                    ) {
                                        option.classList
                                            .add(
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
                                (
                                    selected
                                        ? "Your answer: " +
                                          escapeHtml(
                                              item.options[
                                                  Number(
                                                      selected.value
                                                  )
                                              ]
                                          )
                                        : "Your answer: Not attempted"
                                ) +
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

                    byId("quizScore")
                        .textContent =
                        correct +
                        " / " +
                        questions.length +
                        " correct" +
                        (
                            answered <
                            questions.length
                                ? " • " +
                                  (
                                      questions.length -
                                      answered
                                  ) +
                                  " not attempted"
                                : ""
                        );

                    let progress = {};

                    try {
                        progress =
                            JSON.parse(
                                window
                                    .localStorage
                                    .getItem(
                                        LEVEL_PROGRESS_KEY
                                    ) ||
                                "{}"
                            );
                    } catch (error) {
                        progress = {};
                    }

                    progress.bestQuizScore =
                        Math.max(
                            Number(
                                progress
                                    .bestQuizScore ||
                                0
                            ),
                            correct
                        );

                    window.localStorage
                        .setItem(
                            LEVEL_PROGRESS_KEY,
                            JSON.stringify(
                                progress
                            )
                        );
                }
            );

        byId("resetQuiz")
            .addEventListener(
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
                                option.classList
                                    .remove(
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

                                explanation
                                    .textContent =
                                    "";
                            }
                        );

                    byId("quizScore")
                        .textContent =
                        "Not checked yet";
                }
            );
    }

    function initInterviewQuestions() {
        const container =
            byId("interviewList");

        if (!container) {
            return;
        }

        const questions = [
            {
                question:
                    "Why is logistic regression called regression when it performs classification?",
                answer:
                    "It regresses the log-odds of the positive class on a linear combination of features. Sigmoid converts that score into probability, and a separate threshold creates the class prediction."
            },
            {
                question:
                    "What are odds, log-odds and sigmoid?",
                answer:
                    "Odds are p/(1−p). Log-odds are log(p/(1−p)), which range across all real numbers. Logistic regression models log-odds linearly; sigmoid is the inverse-logit that maps the linear score back to probability."
            },
            {
                question:
                    "Why use binary cross-entropy instead of MSE?",
                answer:
                    "Cross-entropy is the Bernoulli negative log-likelihood, directly rewards probability assigned to the true class, penalizes confident errors strongly and gives a well-behaved convex objective for ordinary linear logistic regression."
            },
            {
                question:
                    "Explain precision and recall with a practical example.",
                answer:
                    "Precision asks how many flagged cases are truly positive; recall asks how many real positives were found. In disease screening, high recall reduces missed disease, while precision determines how many follow-up tests are spent on real cases."
            },
            {
                question:
                    "When is accuracy inappropriate?",
                answer:
                    "Accuracy is inappropriate when classes are severely imbalanced or FP and FN costs differ. Always inspect class counts, confusion matrix, per-class metrics, PR-AUC and the operational cost at a chosen threshold."
            },
            {
                question:
                    "How would you select a classification threshold?",
                answer:
                    "Train the model without using test data, produce validation probabilities, compare thresholds using cost, recall, precision, capacity or policy constraints, lock the operating point, then estimate final performance once on the held-out test set."
            },
            {
                question:
                    "ROC-AUC or PR-AUC—which should you report?",
                answer:
                    "ROC-AUC measures ranking through TPR versus FPR and can be useful broadly. PR-AUC focuses on precision and recall and is often more revealing for rare positives. Report the metric relevant to deployment and also report performance at the chosen threshold."
            },
            {
                question:
                    "How does regularization affect logistic regression?",
                answer:
                    "L2 shrinks coefficients smoothly and helps with correlated features; L1 can create sparse coefficients. Scaling is important, the intercept is usually not penalized, and strength must be selected inside cross-validation."
            },
            {
                question:
                    "What is probability calibration and why does it matter?",
                answer:
                    "Calibration means predicted probabilities agree with observed frequencies. It matters when probabilities drive risk, pricing or resource allocation. Check reliability diagrams and Brier/log loss; calibrate using held-out or cross-validated predictions."
            },
            {
                question:
                    "How would you productionize an imbalanced classifier?",
                answer:
                    "Define the positive class and costs, split by the real data structure, use training-only weights or resampling, tune the threshold on validation data, verify calibration and subgroup performance, then monitor prevalence, feature drift, delayed outcomes and capacity impact."
            }
        ];

        container.innerHTML =
            questions.map(
                function (item, index) {
                    return '<article class="aiml-interview-item">' +
                        '<div class="aiml-interview-question">' +
                        "<span>" +
                        (index + 1) +
                        ".</span><strong>" +
                        escapeHtml(
                            item.question
                        ) +
                        "</strong>" +
                        '<button type="button" aria-expanded="false">' +
                        "Show Answer</button></div>" +
                        '<div class="aiml-interview-answer" hidden>' +
                        escapeHtml(
                            item.answer
                        ) +
                        "</div></article>";
                }
            ).join("");

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

                const answer =
                    button
                        .closest(
                            ".aiml-interview-item"
                        )
                        .querySelector(
                            ".aiml-interview-answer"
                        );

                const opening =
                    answer.hidden;

                answer.hidden =
                    !opening;

                button.textContent =
                    opening
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

    function initLevelSeven() {
        initBoundaryVisualizer();
        initProgramTracer();
        initProgrammingProblems();
        initQuiz();
        initInterviewQuestions();
        initSmoothLocalLinks();
    }

    if (
        document.readyState === "loading"
    ) {
        document.addEventListener(
            "DOMContentLoaded",
            initLevelSeven
        );
    } else {
        initLevelSeven();
    }
}());
