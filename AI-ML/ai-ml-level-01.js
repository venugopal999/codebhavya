(function () {
    "use strict";

    const LEVEL_PROGRESS_KEY = "codebhavya-aiml-level-01-progress-v1";

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

    function setHidden(element, shouldHide) {
        if (element) {
            element.hidden = shouldHide;
        }
    }

    function initLearningVisualizer() {
        const stepContainer = byId("learningStepNodes");

        if (!stepContainer) {
            return;
        }

        const steps = [
            {
                short: "Examples",
                sub: "Collect",
                title: "Collect representative examples",
                description:
                    "Begin with examples that represent the people, conditions and edge where the model will actually be used.",
                insight:
                    "Poor coverage creates blind spots. More data is useful only when it is relevant, lawful and sufficiently representative.",
                graphic:
                    '<div class="aiml-stage-art">' +
                    '<div class="aiml-art-stack">' +
                    '<div class="aiml-art-card">1 hour <em>20</em></div>' +
                    '<div class="aiml-art-card">2 hours <em>35</em></div>' +
                    '<div class="aiml-art-card">3 hours <em>50</em></div>' +
                    '<div class="aiml-art-card">4 hours <em>65</em></div>' +
                    "</div>" +
                    '<div class="aiml-art-arrow">→</div>' +
                    '<div class="aiml-art-model">RAW<br>DATA</div>' +
                    "</div>"
            },
            {
                short: "X and y",
                sub: "Define",
                title: "Separate features and labels",
                description:
                    "Choose what the model may use as input and define the exact answer it must learn to predict.",
                insight:
                    "For score prediction, study hours is a feature (x) and exam score is the target (y). Never use information unavailable at prediction time.",
                graphic:
                    '<div class="aiml-stage-art">' +
                    '<div class="aiml-art-stack">' +
                    '<div class="aiml-art-card">FEATURE (x)<em>hours</em></div>' +
                    '<div class="aiml-art-card">LABEL (y)<em>score</em></div>' +
                    "</div>" +
                    '<div class="aiml-art-arrow">→</div>' +
                    '<div class="aiml-art-model">LEARNING<br>PROBLEM</div>' +
                    "</div>"
            },
            {
                short: "Split",
                sub: "Protect",
                title: "Create independent data splits",
                description:
                    "Keep separate evidence for learning, tuning and the final unbiased evaluation.",
                insight:
                    "Train data teaches the model. Validation data guides choices. Test data estimates how the finalized approach generalizes to unseen cases.",
                graphic:
                    '<div class="aiml-stage-art">' +
                    '<div class="aiml-art-stack">' +
                    '<div class="aiml-art-card">TRAIN<em>70%</em></div>' +
                    '<div class="aiml-art-card">VALIDATE<em>15%</em></div>' +
                    '<div class="aiml-art-card">TEST<em>15%</em></div>' +
                    "</div>" +
                    '<div class="aiml-art-arrow">→</div>' +
                    '<div class="aiml-art-model">HONEST<br>EVIDENCE</div>' +
                    "</div>"
            },
            {
                short: "Model",
                sub: "Initialize",
                title: "Start with a model and parameters",
                description:
                    "The model begins with a structure and initial parameter values before learning from errors.",
                insight:
                    "A simple line uses weight and bias. More complex algorithms have different structures, but training still adjusts internal parameters.",
                graphic:
                    '<div class="aiml-stage-art">' +
                    '<div class="aiml-art-stack">' +
                    '<div class="aiml-art-card">weight<em>0.0</em></div>' +
                    '<div class="aiml-art-card">bias<em>0.0</em></div>' +
                    "</div>" +
                    '<div class="aiml-art-arrow">→</div>' +
                    '<div class="aiml-art-model">ŷ = wx + b</div>' +
                    "</div>"
            },
            {
                short: "Learn",
                sub: "Train",
                title: "Reduce error and learn a pattern",
                description:
                    "Training compares predictions with known labels and changes parameters to reduce the selected loss.",
                insight:
                    "The loss guides learning; it is not automatically the final business metric. Training continues until improvement stops or a limit is reached.",
                graphic:
                    '<div class="aiml-stage-art">' +
                    '<div class="aiml-art-stack">' +
                    '<div class="aiml-art-card">PREDICT<em>ŷ</em></div>' +
                    '<div class="aiml-art-card">COMPARE<em>y − ŷ</em></div>' +
                    '<div class="aiml-art-card">UPDATE<em>w, b</em></div>' +
                    "</div>" +
                    '<div class="aiml-art-arrow">↻</div>' +
                    '<div class="aiml-art-model">LOSS<br>DECREASES</div>' +
                    "</div>"
            },
            {
                short: "Evaluate",
                sub: "Verify",
                title: "Test generalization on unseen data",
                description:
                    "Measure the finalized model on data that did not teach it or influence model-selection decisions.",
                insight:
                    "Inspect more than one aggregate score. Compare a baseline, relevant error types and performance across important data slices.",
                graphic:
                    '<div class="aiml-stage-art">' +
                    '<div class="aiml-art-model">UNSEEN<br>TEST DATA</div>' +
                    '<div class="aiml-art-arrow">→</div>' +
                    '<div class="aiml-art-metric">MAE 2.4' +
                    "<span>BETTER THAN BASELINE</span>" +
                    "</div>" +
                    "</div>"
            },
            {
                short: "Predict",
                sub: "Infer",
                title: "Use the trained model responsibly",
                description:
                    "Provide new input, generate a prediction, connect it to a decision and monitor what happens after deployment.",
                insight:
                    "A prediction is not the same as a decision. Production systems also need thresholds, fallbacks, human review, monitoring and retraining rules.",
                graphic:
                    '<div class="aiml-stage-art">' +
                    '<div class="aiml-art-card">NEW INPUT<br><em>6 hours</em></div>' +
                    '<div class="aiml-art-arrow">→</div>' +
                    '<div class="aiml-art-model">TRAINED<br>MODEL</div>' +
                    '<div class="aiml-art-arrow">→</div>' +
                    '<div class="aiml-art-metric">95' +
                    "<span>PREDICTED SCORE</span>" +
                    "</div>" +
                    "</div>"
            }
        ];

        const previousButton = byId("learningPrevious");
        const nextButton = byId("learningNext");
        const autoButton = byId("learningAuto");
        const pauseButton = byId("learningPause");
        const resetButton = byId("learningReset");
        const progressText = byId("learningProgress");
        const eyebrow = byId("learningStageEyebrow");
        const title = byId("learningStageTitle");
        const description = byId("learningStageDescription");
        const insight = byId("learningStageInsight");
        const graphic = byId("learningStageGraphic");

        let currentStep = 0;
        let timer = null;

        stepContainer.innerHTML = steps
            .map(function (step, index) {
                return (
                    '<div class="aiml-visual-step" data-visual-step="' +
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
            const atStart = currentStep === 0;
            const atEnd = currentStep === steps.length - 1;

            Array.from(stepContainer.children).forEach(function (node, index) {
                node.classList.toggle("is-active", index === currentStep);
                node.classList.toggle("is-complete", index < currentStep);
                node.setAttribute(
                    "aria-current",
                    index === currentStep ? "step" : "false"
                );
            });

            eyebrow.textContent =
                "STEP " + (currentStep + 1) + " OF " + steps.length;

            title.textContent = step.title;
            description.textContent = step.description;

            insight.innerHTML =
                "<strong>ENGINEERING INSIGHT</strong>" +
                escapeHtml(step.insight);

            graphic.innerHTML = step.graphic;

            progressText.textContent =
                "Step " + (currentStep + 1) + " of " + steps.length;

            previousButton.disabled = atStart;
            nextButton.disabled = atEnd;
            autoButton.disabled = atEnd || timer !== null;

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
            }
        }

        previousButton.addEventListener("click", function () {
            stopAutoRun();
            currentStep = Math.max(0, currentStep - 1);
            render();
        });

        nextButton.addEventListener("click", goNext);

        autoButton.addEventListener("click", function () {
            if (currentStep >= steps.length - 1 || timer !== null) {
                return;
            }

            autoButton.disabled = true;
            pauseButton.disabled = false;

            timer = window.setInterval(goNext, 1250);
        });

        pauseButton.addEventListener("click", function () {
            stopAutoRun();
            render();
        });

        resetButton.addEventListener("click", function () {
            stopAutoRun();
            currentStep = 0;
            render();
        });

        render();
    }

    function initProgramTracer() {
        const panel = byId("tracerPanel");
        const toggle = byId("tracerPanelToggle");
        const codeContainer = byId("tracerCode");

        if (!panel || !toggle || !codeContainer) {
            return;
        }

        const codeLines = [
            "hours = [1, 2, 3, 4, 5]",
            "scores = [20, 35, 50, 65, 80]",
            "mean_x = sum(hours) / len(hours)",
            "mean_y = sum(scores) / len(scores)",
            "numerator = sum((x - mean_x) * (y - mean_y) for x, y in zip(hours, scores))",
            "denominator = sum((x - mean_x) ** 2 for x in hours)",
            "weight = numerator / denominator",
            "bias = mean_y - weight * mean_x",
            "new_hours = 6",
            "prediction = weight * new_hours + bias",
            "print(round(prediction, 2))"
        ];

        const traceStates = [
            {
                vars: {
                    hours: "[1, 2, 3, 4, 5]"
                },
                expression: "[1, 2, 3, 4, 5]",
                explanation:
                    "Store five study-hour values. Each number is one feature value from a training sample.",
                output: ""
            },
            {
                vars: {
                    hours: "[1, 2, 3, 4, 5]",
                    scores: "[20, 35, 50, 65, 80]"
                },
                expression: "[20, 35, 50, 65, 80]",
                explanation:
                    "Store the known exam scores. These labels align position-by-position with the study-hour examples.",
                output: ""
            },
            {
                vars: {
                    hours: "[1, 2, 3, 4, 5]",
                    scores: "[20, 35, 50, 65, 80]",
                    mean_x: "3.0"
                },
                expression: "(1 + 2 + 3 + 4 + 5) / 5 = 3.0",
                explanation:
                    "Calculate the mean of the input feature. The regression formula uses deviations from this centre.",
                output: ""
            },
            {
                vars: {
                    mean_x: "3.0",
                    mean_y: "50.0"
                },
                expression: "(20 + 35 + 50 + 65 + 80) / 5 = 50.0",
                explanation:
                    "Calculate the mean target value. The learned line will pass through the point (mean_x, mean_y).",
                output: ""
            },
            {
                vars: {
                    mean_x: "3.0",
                    mean_y: "50.0",
                    numerator: "150.0"
                },
                expression: "Σ(x − 3)(y − 50) = 150",
                explanation:
                    "Measure how the input and target move together. Positive paired deviations create a positive numerator.",
                output: ""
            },
            {
                vars: {
                    numerator: "150.0",
                    denominator: "10.0"
                },
                expression: "Σ(x − 3)² = 10",
                explanation:
                    "Measure the spread of the input values around their mean.",
                output: ""
            },
            {
                vars: {
                    numerator: "150.0",
                    denominator: "10.0",
                    weight: "15.0"
                },
                expression: "150 / 10 = 15.0",
                explanation:
                    "Learn the weight (slope). The model estimates 15 additional score points for each extra study hour.",
                output: ""
            },
            {
                vars: {
                    mean_x: "3.0",
                    mean_y: "50.0",
                    weight: "15.0",
                    bias: "5.0"
                },
                expression: "50 − (15 × 3) = 5.0",
                explanation:
                    "Learn the bias (intercept), giving the model score = 15 × hours + 5.",
                output: ""
            },
            {
                vars: {
                    weight: "15.0",
                    bias: "5.0",
                    new_hours: "6"
                },
                expression: "new_hours = 6",
                explanation:
                    "Provide a new unseen input for inference. This value was not part of the training examples.",
                output: ""
            },
            {
                vars: {
                    weight: "15.0",
                    bias: "5.0",
                    new_hours: "6",
                    prediction: "95.0"
                },
                expression: "(15 × 6) + 5 = 95.0",
                explanation:
                    "Apply the learned line to the new input. Training is finished; this calculation is inference.",
                output: ""
            },
            {
                vars: {
                    weight: "15.0",
                    bias: "5.0",
                    new_hours: "6",
                    prediction: "95.0"
                },
                expression: "round(95.0, 2)",
                explanation:
                    "Display the final prediction. Program execution is complete.",
                output: "95.0"
            }
        ];

        const previousButton = byId("tracerPrevious");
        const nextButton = byId("tracerNext");
        const autoButton = byId("tracerAuto");
        const pauseButton = byId("tracerPause");
        const resetButton = byId("tracerReset");
        const status = byId("tracerStatus");
        const explanation = byId("tracerExplanation");
        const variables = byId("tracerVariables");
        const expression = byId("tracerExpression");
        const output = byId("tracerOutput");
        const progress = byId("tracerProgress");

        let currentStep = 0;
        let timer = null;

        codeContainer.innerHTML = codeLines
            .map(function (line, index) {
                return (
                    '<div class="aiml-code-line" data-trace-line="' +
                    (index + 1) +
                    '">' +
                    "<span>" +
                    String(index + 1).padStart(2, "0") +
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
            const entries = Object.entries(values || {});

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
            const atStart = currentStep === 0;
            const atEnd = currentStep === traceStates.length;

            const state =
                currentStep > 0
                    ? traceStates[currentStep - 1]
                    : null;

            const lineNodes = Array.from(
                codeContainer.querySelectorAll(".aiml-code-line")
            );

            lineNodes.forEach(function (line, index) {
                line.classList.toggle(
                    "is-active",
                    currentStep > 0 && index === currentStep - 1
                );

                line.classList.toggle(
                    "is-complete",
                    index < currentStep
                );
            });

            if (state) {
                explanation.textContent = state.explanation;
                expression.textContent = state.expression;
                output.textContent = state.output || "No output yet";
                renderVariables(state.vars);

                status.textContent = atEnd
                    ? "Complete"
                    : "Executing line " + currentStep;
            } else {
                explanation.textContent =
                    "Press Next to execute the first statement.";

                expression.textContent = "—";
                output.textContent = "Waiting for print(...)";
                renderVariables({});
                status.textContent = "Ready";
            }

            progress.textContent =
                "Step " + currentStep + " of " + traceStates.length;

            previousButton.disabled = atStart;
            nextButton.disabled = atEnd;
            autoButton.disabled = atEnd || timer !== null;

            if (currentStep > 0) {
                const activeLine = lineNodes[currentStep - 1];

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
            if (currentStep < traceStates.length) {
                currentStep += 1;
                render();
            }
        }

        toggle.addEventListener("click", function () {
            const opening = panel.hidden;

            setHidden(panel, !opening);

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
        });

        previousButton.addEventListener("click", function () {
            stopAutoRun();
            currentStep = Math.max(0, currentStep - 1);
            render();
        });

        nextButton.addEventListener("click", goNext);

        autoButton.addEventListener("click", function () {
            if (
                currentStep >= traceStates.length ||
                timer !== null
            ) {
                return;
            }

            autoButton.disabled = true;
            pauseButton.disabled = false;

            timer = window.setInterval(goNext, 900);
        });

        pauseButton.addEventListener("click", function () {
            stopAutoRun();
            render();
        });

        resetButton.addEventListener("click", function () {
            stopAutoRun();
            currentStep = 0;
            render();
        });

        render();
    }

    function initProgrammingProblems() {
        const list = byId("problemList");

        if (!list) {
            return;
        }

        const problems = [
            {
                title: "Name the Learning Components",
                description:
                    "Print the feature, target and model name on separate lines.",
                sampleInput: "No input",
                expected:
                    "Feature: hours_studied\n" +
                    "Target: exam_score\n" +
                    "Model: linear_regression",
                hint:
                    "Use three print() calls with the labels exactly as displayed.",
                starter:
                    "# Print the feature, target and model\n",
                solution:
                    'print("Feature: hours_studied")\n' +
                    'print("Target: exam_score")\n' +
                    'print("Model: linear_regression")',
                required: [
                    ["print("],
                    ["feature:"],
                    ["target:"],
                    ["model:"],
                    ["hours_studied"],
                    ["exam_score"],
                    ["linear_regression"]
                ]
            },
            {
                title: "Create a Train–Test Split Count",
                description:
                    "Read total samples and test percentage. Print the number of training and test samples.",
                sampleInput: "100 20",
                expected:
                    "Training samples: 80\n" +
                    "Test samples: 20",
                hint:
                    "test = total * percentage // 100, then training = total - test.",
                starter:
                    "total, percentage = map(int, input().split())\n" +
                    "# Calculate both counts\n",
                solution:
                    "total, percentage = map(int, input().split())\n" +
                    "test = total * percentage // 100\n" +
                    "training = total - test\n" +
                    'print("Training samples:", training)\n' +
                    'print("Test samples:", test)',
                required: [
                    ["input("],
                    ["split("],
                    ["//", "int("],
                    ["total - test", "total-test"],
                    ["print("],
                    ["training"],
                    ["test"]
                ]
            },
            {
                title: "Make a Linear Prediction",
                description:
                    "Read weight, bias and input x. Calculate y = weight × x + bias.",
                sampleInput: "15 5 6",
                expected: "Predicted value: 95.0",
                hint:
                    "Read three numbers, calculate weight * x + bias, and print the labelled result.",
                starter:
                    "weight, bias, x = map(float, input().split())\n" +
                    "# Calculate the prediction\n",
                solution:
                    "weight, bias, x = map(float, input().split())\n" +
                    "prediction = weight * x + bias\n" +
                    'print("Predicted value:", prediction)',
                required: [
                    ["input("],
                    ["float"],
                    ["weight * x", "weight*x"],
                    ["+ bias", "+bias"],
                    ["print("],
                    ["prediction"]
                ]
            },
            {
                title: "Identify the Learning Paradigm",
                description:
                    "Read a task name. For 'customer segmentation', print Unsupervised Learning.",
                sampleInput: "customer segmentation",
                expected: "Unsupervised Learning",
                hint:
                    "Normalize the text using strip() and lower(), then compare it in an if statement.",
                starter:
                    "task = input().strip().lower()\n" +
                    "# Identify the paradigm\n",
                solution:
                    "task = input().strip().lower()\n" +
                    'if task == "customer segmentation":\n' +
                    '    print("Unsupervised Learning")\n' +
                    "else:\n" +
                    '    print("Review the task")',
                required: [
                    ["input("],
                    ["lower("],
                    ["if "],
                    ["customer segmentation"],
                    ["unsupervised learning"],
                    ["print("]
                ]
            },
            {
                title: "Calculate Mean Absolute Error",
                description:
                    "For the given actual and predicted values, calculate and print their mean absolute error.",
                sampleInput:
                    "actual = [80, 70, 90], predicted = [75, 74, 88]",
                expected: "MAE: 3.67",
                hint:
                    "Pair values with zip(), sum abs(actual - predicted), divide by the number of samples, and round to 2 decimals.",
                starter:
                    "actual = [80, 70, 90]\n" +
                    "predicted = [75, 74, 88]\n" +
                    "# Calculate MAE\n",
                solution:
                    "actual = [80, 70, 90]\n" +
                    "predicted = [75, 74, 88]\n" +
                    "total_error = sum(abs(a - p) for a, p in zip(actual, predicted))\n" +
                    "mae = total_error / len(actual)\n" +
                    'print("MAE:", round(mae, 2))',
                required: [
                    ["abs("],
                    ["zip("],
                    ["sum("],
                    ["len("],
                    ["/"],
                    ["round("],
                    ["print("]
                ]
            }
        ];

        let saved = {};

        try {
            saved = JSON.parse(
                window.localStorage.getItem(LEVEL_PROGRESS_KEY) || "{}"
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
                    window.localStorage.getItem(LEVEL_PROGRESS_KEY) || "{}"
                );
            } catch (error) {
                current = {};
            }

            current.solvedProblems = Array.from(solved);
            current.problemScores = scores;

            window.localStorage.setItem(
                LEVEL_PROGRESS_KEY,
                JSON.stringify(current)
            );
        }

        function updateSummary() {
            const totalScore = Object.values(scores).reduce(
                function (sum, score) {
                    return sum + Number(score || 0);
                },
                0
            );

            byId("problemSolvedCount").textContent =
                solved.size + " / " + problems.length;

            byId("problemScore").textContent =
                totalScore + " / " + problems.length * 100;

            byId("problemProgressBar").style.width =
                (solved.size / problems.length) * 100 + "%";
        }

        list.innerHTML = problems
            .map(function (problem, index) {
                const number = index + 1;

                return (
                    '<article class="aiml-problem-card' +
                    (solved.has(index) ? " is-solved" : "") +
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
                    "<span><strong>Sample input:</strong> " +
                    escapeHtml(problem.sampleInput) +
                    "</span>" +
                    "<span><strong>Expected output:</strong> <code>" +
                    escapeHtml(problem.expected).replace(/\n/g, " · ") +
                    "</code></span>" +
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
                    escapeHtml(problem.solution) +
                    "</code></pre>" +
                    "</div>" +

                    '<div class="aiml-workspace" data-panel="workspace" hidden>' +
                    '<label for="problemCode' +
                    index +
                    '">Your Python code</label>' +
                    '<textarea id="problemCode' +
                    index +
                    '" spellcheck="false">' +
                    escapeHtml(problem.starter) +
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
                '[data-panel="' + panelName + '"]'
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

        list.addEventListener("click", function (event) {
            const button = event.target.closest(
                "button[data-action]"
            );

            if (!button) {
                return;
            }

            const card = button.closest(".aiml-problem-card");
            const problemIndex = Number(card.dataset.problem);
            const problem = problems[problemIndex];
            const action = button.dataset.action;

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

            const textarea = card.querySelector("textarea");
            const result = card.querySelector("[data-result]");

            if (action === "reset") {
                textarea.value = problem.starter;
                result.className = "aiml-check-result";
                result.textContent =
                    "Workspace reset. Try the problem again.";

                return;
            }

            if (action === "check") {
                const normalized = textarea.value
                    .toLowerCase()
                    .replace(/\s+/g, " ");

                const missing = problem.required.filter(
                    function (alternatives) {
                        return !alternatives.some(
                            function (token) {
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

                if (missing.length > 0) {
                    result.className =
                        "aiml-check-result error";

                    result.textContent =
                        "Not complete yet. Recheck the required calculation, input handling and exact output label.";

                    return;
                }

                const score = revealed.has(problemIndex)
                    ? 60
                    : 100;

                solved.add(problemIndex);

                scores[problemIndex] = Math.max(
                    Number(scores[problemIndex] || 0),
                    score
                );

                card.classList.add("is-solved");

                result.className =
                    "aiml-check-result success";

                result.textContent = revealed.has(problemIndex)
                    ? "Logic recognized — completed after viewing the model program. Score: 60/100."
                    : "Logic recognized — solved independently. Score: 100/100.";

                saveProgress();
                updateSummary();
            }
        });

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
                    "Which statement best describes machine learning?",
                options: [
                    "A system that always imitates human consciousness",
                    "A method that learns useful patterns from data",
                    "A database that stores large files",
                    "Any program containing an if statement"
                ],
                answer: 1,
                explanation:
                    "Machine learning builds a mapping or policy from data. It does not require consciousness and is more specific than ordinary programming."
            },
            {
                question:
                    "In a house-price prediction dataset, what is the house price?",
                options: [
                    "A feature",
                    "A hyperparameter",
                    "The target or label",
                    "The loss function"
                ],
                answer: 2,
                explanation:
                    "The desired value to predict is the target or label. Size, location and age may be features."
            },
            {
                question:
                    "Which task is naturally an unsupervised learning problem?",
                options: [
                    "Predicting a known disease label",
                    "Grouping customers with similar behaviour",
                    "Predicting tomorrow's temperature",
                    "Classifying email as spam or not spam"
                ],
                answer: 1,
                explanation:
                    "Customer grouping can be performed without predefined group labels, making clustering an unsupervised task."
            },
            {
                question:
                    "Why should the test set remain untouched during model selection?",
                options: [
                    "To make training faster",
                    "To reduce the dataset size",
                    "To preserve an unbiased final evaluation",
                    "To avoid choosing a metric"
                ],
                answer: 2,
                explanation:
                    "Repeated decisions based on test results indirectly fit the process to the test set, weakening its value as unseen evidence."
            },
            {
                question:
                    "Training performance is excellent but validation performance is poor. What is the likely issue?",
                options: [
                    "Underfitting",
                    "Overfitting",
                    "Successful generalization",
                    "Unsupervised learning"
                ],
                answer: 1,
                explanation:
                    "The gap suggests that the model learned training-specific detail or noise that does not generalize."
            },
            {
                question:
                    "Which is a model parameter rather than a hyperparameter?",
                options: [
                    "A learned regression weight",
                    "The chosen learning rate",
                    "The selected tree depth limit",
                    "The number of neighbours k"
                ],
                answer: 0,
                explanation:
                    "The model learns a regression weight from data. Learning rate, maximum depth and k are settings chosen outside parameter fitting."
            },
            {
                question:
                    "What happens during inference?",
                options: [
                    "The model learns new parameters from labels",
                    "The test set is merged into training",
                    "A trained model produces a prediction for new input",
                    "Every hyperparameter is randomized"
                ],
                answer: 2,
                explanation:
                    "Inference is the use phase: a trained model maps new input to an output without retraining for that individual prediction."
            },
            {
                question:
                    "What should be decided before selecting an algorithm?",
                options: [
                    "The measurable decision, target, metric and constraints",
                    "The most fashionable framework",
                    "The largest possible neural network",
                    "The final test score"
                ],
                answer: 0,
                explanation:
                    "Problem framing controls what data is valid, what outcome matters and how the resulting system should be evaluated."
            }
        ];

        container.innerHTML = questions
            .map(function (item, questionIndex) {
                return (
                    '<article class="aiml-quiz-question" data-quiz-question="' +
                    questionIndex +
                    '">' +
                    "<strong>" +
                    (questionIndex + 1) +
                    ". " +
                    escapeHtml(item.question) +
                    "</strong>" +

                    '<div class="aiml-quiz-options">' +
                    item.options
                        .map(function (option, optionIndex) {
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
                                    65 + optionIndex
                                ) +
                                ". " +
                                escapeHtml(option) +
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

        container.addEventListener("change", function (event) {
            if (
                !event.target.matches(
                    'input[type="radio"]'
                )
            ) {
                return;
            }

            const question = event.target.closest(
                ".aiml-quiz-question"
            );

            question
                .querySelectorAll(".aiml-quiz-option")
                .forEach(function (option) {
                    option.classList.toggle(
                        "is-selected",
                        option.contains(event.target)
                    );
                });
        });

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
                            const selectedIndex = Number(
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

                        explanation.hidden = false;

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
                                item.options[item.answer]
                            ) +
                            "</strong><br>" +
                            escapeHtml(item.explanation);
                    }
                );

                const score = byId("quizScore");

                score.textContent =
                    correct +
                    " / " +
                    questions.length +
                    " correct" +
                    (answered < questions.length
                        ? " • " +
                          (questions.length - answered) +
                          " not attempted"
                        : "");

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

                saved.bestQuizScore = Math.max(
                    Number(saved.bestQuizScore || 0),
                    correct
                );

                window.localStorage.setItem(
                    LEVEL_PROGRESS_KEY,
                    JSON.stringify(saved)
                );
            }
        );

        byId("resetQuiz").addEventListener(
            "click",
            function () {
                container
                    .querySelectorAll('input[type="radio"]')
                    .forEach(function (input) {
                        input.checked = false;
                    });

                container
                    .querySelectorAll(".aiml-quiz-option")
                    .forEach(function (option) {
                        option.classList.remove(
                            "is-selected",
                            "is-correct",
                            "is-wrong"
                        );
                    });

                container
                    .querySelectorAll(
                        ".aiml-quiz-explanation"
                    )
                    .forEach(function (explanation) {
                        explanation.hidden = true;
                        explanation.textContent = "";
                    });

                byId("quizScore").textContent =
                    "Not checked yet";
            }
        );
    }

    function initInterviewQuestions() {
        const container = byId("interviewList");

        if (!container) {
            return;
        }

        const questions = [
            {
                question:
                    "What is the difference between AI, machine learning and deep learning?",
                answer:
                    "AI is the broad goal of building systems that perform intelligent tasks. Machine learning is one approach within AI that learns patterns from data. Deep learning is a part of machine learning based on multilayer neural networks. A rule-based chess search can be AI without ML; linear regression is ML; a convolutional network is deep learning."
            },
            {
                question:
                    "What is the difference between a feature and a label?",
                answer:
                    "A feature is information available to the model as input. A label or target is the desired output the model learns to predict. In house-price prediction, floor area may be a feature and sale price is the target."
            },
            {
                question:
                    "How do supervised and unsupervised learning differ?",
                answer:
                    "Supervised learning uses examples paired with known targets and learns to predict them. Unsupervised learning has no predefined target and seeks structure such as clusters, low-dimensional representations or anomalies."
            },
            {
                question:
                    "What is the difference between training and inference?",
                answer:
                    "Training uses data and an objective to estimate model parameters. Inference uses the already-trained parameters to produce an output for new input. Training is usually more computationally expensive; inference often has strict latency and scale requirements."
            },
            {
                question:
                    "Why do we need train, validation and test sets?",
                answer:
                    "The training set fits parameters, the validation set supports model and hyperparameter choices, and the test set provides a final estimate on unseen evidence. Keeping these roles separate reduces optimistic bias."
            },
            {
                question:
                    "What is overfitting, and how can you detect it?",
                answer:
                    "Overfitting occurs when a model learns training-specific details or noise and fails to generalize. A common signal is strong training performance with substantially worse validation performance. Learning curves and error analysis help confirm it."
            },
            {
                question: "What is data leakage?",
                answer:
                    "Data leakage occurs when training uses information that would not legitimately be available at prediction time or when evaluation data influences training. It produces overly optimistic validation results and often severe production failure."
            },
            {
                question:
                    "What is the difference between a parameter and a hyperparameter?",
                answer:
                    "Parameters are learned from training data, such as a regression weight. Hyperparameters control the learning process or model structure and are selected externally, such as learning rate, tree depth or the number of neighbours."
            },
            {
                question:
                    "Why is a baseline model important?",
                answer:
                    "A baseline establishes the minimum performance a new approach must beat. It reveals whether complexity adds real value, helps detect pipeline mistakes and creates a clear reference for experiments."
            },
            {
                question:
                    "Why might a model degrade after deployment?",
                answer:
                    "The input distribution, target relationship, user behaviour or data pipeline can change. This is often described as data or concept drift. Monitoring inputs, predictions, outcomes and operational metrics is required to detect and respond to degradation."
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
                    escapeHtml(item.question) +
                    "</strong>" +
                    '<button type="button" aria-expanded="false">' +
                    "Show Answer" +
                    "</button>" +
                    "</div>" +
                    '<div class="aiml-interview-answer" hidden>' +
                    escapeHtml(item.answer) +
                    "</div>" +
                    "</article>"
                );
            })
            .join("");

        container.addEventListener("click", function (event) {
            const button = event.target.closest("button");

            if (!button) {
                return;
            }

            const item = button.closest(
                ".aiml-interview-item"
            );

            const answer = item.querySelector(
                ".aiml-interview-answer"
            );

            const opening = answer.hidden;

            answer.hidden = !opening;

            button.textContent = opening
                ? "Hide Answer"
                : "Show Answer";

            button.setAttribute(
                "aria-expanded",
                String(opening)
            );
        });
    }

    function initSmoothLocalLinks() {
        document.addEventListener("click", function (event) {
            const link = event.target.closest(
                'a[href^="#"]'
            );

            if (
                !link ||
                link.getAttribute("href") === "#"
            ) {
                return;
            }

            const target = document.querySelector(
                link.getAttribute("href")
            );

            if (!target) {
                return;
            }

            event.preventDefault();

            target.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        });
    }

    function initLevelOne() {
        initLearningVisualizer();
        initProgramTracer();
        initProgrammingProblems();
        initQuiz();
        initInterviewQuestions();
        initSmoothLocalLinks();
    }

    if (document.readyState === "loading") {
        document.addEventListener(
            "DOMContentLoaded",
            initLevelOne
        );
    } else {
        initLevelOne();
    }
}());
