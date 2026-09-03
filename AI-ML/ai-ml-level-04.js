(function () {
    "use strict";

    const LEVEL_PROGRESS_KEY = "codebhavya-aiml-level-04-progress-v1";

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

    function frequencyGrid(mode) {
        const cells = [];
        let index;

        for (index = 0; index < 100; index += 1) {
            let className = "good";

            if (index < 10) {
                className = mode === "alerts" && index < 8
                    ? "true-alert"
                    : "defective";
            } else if (mode === "alerts" && index < 28) {
                className = "false-alert";
            }

            cells.push('<i class="' + className + '"></i>');
        }

        return '<div class="aiml-frequency-grid">' +
            cells.join("") +
            "</div>";
    }

    function statCards(items) {
        return '<div class="aiml-bayes-stat-cards">' +
            items.map(function (item) {
                return "<article><span>" +
                    escapeHtml(item[0]) +
                    "</span><strong>" +
                    escapeHtml(item[1]) +
                    "</strong><p>" +
                    escapeHtml(item[2]) +
                    "</p></article>";
            }).join("") +
            "</div>";
    }

    function initBayesVisualizer() {
        const stepContainer = byId("bayesStepNodes");

        if (!stepContainer) {
            return;
        }

        const steps = [
            {
                short: "Population",
                sub: "100 items",
                title: "Begin with 100 items",
                description: "Natural frequencies turn percentages into countable cases and make Bayes reasoning easier.",
                insight: "Using 100 items preserves the given percentages: 10 defective and 90 good.",
                graphic: frequencyGrid("population") +
                    '<div class="aiml-frequency-legend">' +
                    '<span class="good">100 inspected items</span>' +
                    "</div>"
            },
            {
                short: "Prior",
                sub: "10 defective",
                title: "Apply the 10% prior",
                description: "Before observing the detector, 10 of the 100 items are expected to be defective.",
                insight: "P(defective) = 0.10 is the base rate or prior probability.",
                graphic: frequencyGrid("prior") +
                    '<div class="aiml-frequency-legend">' +
                    '<span class="defective">10 defective</span>' +
                    '<span class="good">90 good</span>' +
                    "</div>"
            },
            {
                short: "True alerts",
                sub: "80% of 10",
                title: "Find alerts among defective items",
                description: "The detector catches 80% of the 10 defective items, producing 8 true alerts.",
                insight: "P(alert | defective) = 0.80, so 10 × 0.80 = 8.",
                graphic: statCards([
                    ["DEFECTIVE", "10", "prior cases"],
                    ["SENSITIVITY", "80%", "caught by detector"],
                    ["TRUE ALERTS", "8", "10 × 0.80"]
                ])
            },
            {
                short: "False alerts",
                sub: "20% of 90",
                title: "Find alerts among good items",
                description: "The 20% false-positive rate incorrectly alerts on 18 of the 90 good items.",
                insight: "P(alert | good) = 0.20, so 90 × 0.20 = 18 false alerts.",
                graphic: statCards([
                    ["GOOD", "90", "non-defective cases"],
                    ["FALSE-POSITIVE RATE", "20%", "incorrectly alerted"],
                    ["FALSE ALERTS", "18", "90 × 0.20"]
                ])
            },
            {
                short: "All alerts",
                sub: "8 + 18 = 26",
                title: "Combine every route to an alert",
                description: "An alert can come from a defective item or a good item. There are 26 alerts in total.",
                insight: "P(alert) = 0.08 + 0.18 = 0.26 by the law of total probability.",
                graphic: frequencyGrid("alerts") +
                    '<div class="aiml-frequency-legend">' +
                    '<span class="true-alert">8 true alerts</span>' +
                    '<span class="false-alert">18 false alerts</span>' +
                    '<span class="good">74 no alerts</span>' +
                    "</div>"
            },
            {
                short: "Posterior",
                sub: "8 of 26",
                title: "Calculate the probability after an alert",
                description: "Among all 26 alerted items, only 8 are actually defective.",
                insight: "P(defective | alert) = 8 / 26 ≈ 0.3077, or 30.8%.",
                graphic:
                    '<div class="aiml-posterior-stage">' +
                    "<span>TRUE ALERTS<strong>8</strong></span>" +
                    "<b>÷</b>" +
                    "<span>ALL ALERTS<strong>26</strong></span>" +
                    "<b>=</b>" +
                    "<em>30.8%</em>" +
                    "</div>"
            },
            {
                short: "Meaning",
                sub: "Base rates matter",
                title: "Interpret the result correctly",
                description: "Even with 80% sensitivity, most alerts are false because good items are far more common and the false-positive rate is substantial.",
                insight: "Never confuse P(alert | defective) with P(defective | alert). Bayes’ theorem reverses the condition using the base rate.",
                graphic:
                    '<div class="aiml-bayes-lesson">' +
                    "<strong>80%</strong>" +
                    "<span>P(alert | defective)</span>" +
                    "<b>IS NOT</b>" +
                    "<strong>30.8%</strong>" +
                    "<span>P(defective | alert)</span>" +
                    "</div>"
            }
        ];

        const previousButton = byId("bayesPrevious");
        const nextButton = byId("bayesNext");
        const autoButton = byId("bayesAuto");
        const pauseButton = byId("bayesPause");
        const resetButton = byId("bayesReset");
        const progress = byId("bayesProgress");
        const eyebrow = byId("bayesStageEyebrow");
        const title = byId("bayesStageTitle");
        const description = byId("bayesStageDescription");
        const insight = byId("bayesStageInsight");
        const graphic = byId("bayesStageGraphic");

        let currentStep = 0;
        let timer = null;

        stepContainer.innerHTML = steps.map(function (step, index) {
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
                "<strong>BAYES INSIGHT</strong><span>" +
                escapeHtml(step.insight) +
                "</span>";

            graphic.innerHTML = step.graphic;

            progress.textContent =
                "Step " + (currentStep + 1) + " of " + steps.length;

            previousButton.disabled = currentStep === 0;
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
            } else {
                stopAutoRun();
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

    function buildTraceStates() {
        const rolls = [2, 6, 4, 1, 6, 3];
        const states = [];
        let successes = 0;

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
                output: output || "Waiting for print(...)"
            });
        }

        add(
            1,
            "Trials loaded",
            "Store six recorded outcomes so this learning trace is reproducible.",
            "rolls = [2, 6, 4, 1, 6, 3]",
            {
                rolls: "[2, 6, 4, 1, 6, 3]"
            }
        );

        add(
            2,
            "Counter initialized",
            "No successful sixes have been counted yet.",
            "successes = 0",
            {
                successes: 0
            }
        );

        rolls.forEach(function (roll, index) {
            add(
                3,
                "Loop iteration " + (index + 1),
                "Read the next die result. The cursor returns to this loop line for every trial.",
                "roll = " + roll,
                {
                    trial: index + 1,
                    roll: roll,
                    successes: successes
                }
            );

            add(
                4,
                "Condition checked",
                roll === 6
                    ? "The result equals 6, so the event occurred."
                    : "The result is not 6, so the event did not occur.",
                roll + " == 6 → " + (roll === 6),
                {
                    trial: index + 1,
                    roll: roll,
                    event: roll === 6,
                    successes: successes
                }
            );

            if (roll === 6) {
                successes += 1;

                add(
                    5,
                    "Success recorded",
                    "Increase the event counter because this roll is a six.",
                    "successes = " + successes,
                    {
                        trial: index + 1,
                        roll: roll,
                        successes: successes
                    }
                );
            }
        });

        add(
            6,
            "Trial count",
            "Count the number of repeated experiments.",
            "trials = len(rolls) = 6",
            {
                successes: successes,
                trials: 6
            }
        );

        add(
            7,
            "Probability estimated",
            "Divide observed successes by total trials to obtain the relative frequency.",
            "estimate = 2 / 6 = 0.3333...",
            {
                successes: successes,
                trials: 6,
                estimate: "0.3333..."
            }
        );

        add(
            8,
            "Complete",
            "Round and display the Monte Carlo estimate.",
            "round(estimate, 2)",
            {
                estimate: "0.33"
            },
            "0.33"
        );

        return states;
    }

    function initProgramTracer() {
        const codeContainer = byId("tracerCode");

        if (!codeContainer) {
            return;
        }

        const codeLines = [
            "rolls = [2, 6, 4, 1, 6, 3]",
            "successes = 0",
            "for roll in rolls:",
            "    if roll == 6:",
            "        successes += 1",
            "trials = len(rolls)",
            "estimate = successes / trials",
            "print(round(estimate, 2))"
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

        codeContainer.innerHTML = codeLines.map(function (line, index) {
            return '<div class="aiml-code-line" data-code-line="' +
                (index + 1) +
                '"><span>' +
                String(index + 1).padStart(2, "0") +
                "</span><code>" +
                escapeHtml(line) +
                "</code></div>";
        }).join("");

        function stopAutoRun() {
            if (timer !== null) {
                window.clearInterval(timer);
                timer = null;
            }

            pauseButton.disabled = true;
        }

        function renderVariables(variables) {
            const entries = Object.entries(variables || {});

            byId("tracerVariables").innerHTML = entries.length
                ? entries.map(function (entry) {
                    return '<article class="aiml-variable"><span>' +
                        escapeHtml(entry[0]) +
                        "</span><strong>" +
                        escapeHtml(entry[1]) +
                        "</strong></article>";
                }).join("")
                : '<article class="aiml-variable">' +
                    "<span>STATE</span>" +
                    "<strong>Not started</strong>" +
                    "</article>";
        }

        function render() {
            const atStart = currentStep === 0;
            const atEnd = currentStep === traceStates.length;
            const state = atStart ? null : traceStates[currentStep - 1];

            codeContainer
                .querySelectorAll(".aiml-code-line")
                .forEach(function (line) {
                    line.classList.toggle(
                        "is-active",
                        Boolean(state) &&
                            Number(line.dataset.codeLine) === state.line
                    );
                });

            if (state) {
                byId("tracerStatus").textContent = state.status;
                byId("tracerExplanation").textContent = state.explanation;
                byId("tracerExpression").textContent = state.expression;
                byId("tracerOutput").textContent = state.output;

                renderVariables(state.variables);

                const activeLine = codeContainer.querySelector(
                    '[data-code-line="' + state.line + '"]'
                );

                if (activeLine) {
                    activeLine.scrollIntoView({
                        behavior: "smooth",
                        block: "nearest"
                    });
                }
            } else {
                byId("tracerStatus").textContent = "Ready";
                byId("tracerExplanation").textContent =
                    "Press Next to execute the first statement.";
                byId("tracerExpression").textContent = "—";
                byId("tracerOutput").textContent =
                    "Waiting for print(...)";

                renderVariables({});
            }

            byId("tracerProgress").textContent =
                "Step " + currentStep + " of " + traceStates.length;

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
            if (currentStep < traceStates.length) {
                currentStep += 1;
                render();
            } else {
                stopAutoRun();
                render();
            }
        }

        panelToggle.addEventListener("click", function () {
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
                window.setTimeout(function () {
                    panel.scrollIntoView({
                        behavior: "smooth",
                        block: "nearest"
                    });
                }, 50);
            } else {
                stopAutoRun();
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
            timer = window.setInterval(goNext, 780);
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
                title: "Estimate an Event Probability",
                description: "Use NumPy to estimate the probability of rolling a six from the displayed observations.",
                sampleInput: "[2, 6, 4, 1, 6, 3]",
                expected: "0.33",
                hint: "Compare the array with 6 and calculate the mean of the Boolean values.",
                starter:
                    "import numpy as np\n" +
                    "rolls = np.array([2, 6, 4, 1, 6, 3])\n" +
                    "# Estimate and print the probability\n",
                solution:
                    "import numpy as np\n" +
                    "rolls = np.array([2, 6, 4, 1, 6, 3])\n" +
                    "estimate = np.mean(rolls == 6)\n" +
                    "print(round(estimate, 2))",
                required: [
                    ["np.array("],
                    ["== 6", "==6"],
                    ["np.mean(", ".mean("],
                    ["print("]
                ]
            },
            {
                title: "Calculate Conditional Probability",
                description: "Of 30 mobile users, 18 purchased. Calculate P(purchase | mobile).",
                sampleInput: "mobile=30, mobile_and_purchase=18",
                expected: "0.6",
                hint: "Divide the intersection count by the condition count.",
                starter:
                    "mobile_users = 30\n" +
                    "mobile_purchases = 18\n" +
                    "# Calculate P(purchase | mobile)\n",
                solution:
                    "mobile_users = 30\n" +
                    "mobile_purchases = 18\n" +
                    "conditional_probability = mobile_purchases / mobile_users\n" +
                    "print(conditional_probability)",
                required: [
                    ["mobile_purchases"],
                    ["/ mobile_users", "/mobile_users"],
                    ["print("]
                ]
            },
            {
                title: "Apply Bayes’ Theorem",
                description: "Calculate P(defective | alert) using prior 0.10, sensitivity 0.80 and false-positive rate 0.20.",
                sampleInput: "prior=0.10, sensitivity=0.80, fpr=0.20",
                expected: "0.3077",
                hint: "Divide prior × sensitivity by that value plus (1 − prior) × fpr.",
                starter:
                    "prior = 0.10\n" +
                    "sensitivity = 0.80\n" +
                    "false_positive_rate = 0.20\n" +
                    "# Calculate the posterior\n",
                solution:
                    "prior = 0.10\n" +
                    "sensitivity = 0.80\n" +
                    "false_positive_rate = 0.20\n" +
                    "true_alert = sensitivity * prior\n" +
                    "false_alert = false_positive_rate * (1 - prior)\n" +
                    "posterior = true_alert / (true_alert + false_alert)\n" +
                    "print(round(posterior, 4))",
                required: [
                    ["sensitivity * prior", "sensitivity*prior"],
                    ["1 - prior", "1-prior"],
                    ["false_positive_rate"],
                    ["/"],
                    ["print("]
                ]
            },
            {
                title: "Find a Binomial Probability",
                description: "Calculate the probability of exactly 3 successes in 5 independent trials when p=0.6.",
                sampleInput: "n=5, k=3, p=0.6",
                expected: "0.3456",
                hint: "Use comb(n, k) × p**k × (1-p)**(n-k).",
                starter:
                    "from math import comb\n" +
                    "n = 5\n" +
                    "k = 3\n" +
                    "p = 0.6\n" +
                    "# Calculate P(X = 3)\n",
                solution:
                    "from math import comb\n" +
                    "n = 5\n" +
                    "k = 3\n" +
                    "p = 0.6\n" +
                    "probability = comb(n, k) * p ** k * " +
                    "(1 - p) ** (n - k)\n" +
                    "print(round(probability, 4))",
                required: [
                    ["comb("],
                    ["p ** k", "p**k"],
                    ["1 - p", "1-p"],
                    ["n - k", "n-k"],
                    ["print("]
                ]
            },
            {
                title: "Summarize Centre and Spread",
                description: "Print the mean, population variance and population standard deviation of the values.",
                sampleInput: "[2, 4, 4, 4, 5, 5, 7, 9]",
                expected: "Mean: 5.0 · Variance: 4.0 · Std: 2.0",
                hint: "Use np.mean, np.var and np.std with their population defaults.",
                starter:
                    "import numpy as np\n" +
                    "values = np.array([2, 4, 4, 4, 5, 5, 7, 9])\n" +
                    "# Print mean, variance and standard deviation\n",
                solution:
                    "import numpy as np\n" +
                    "values = np.array([2, 4, 4, 4, 5, 5, 7, 9])\n" +
                    'print("Mean:", np.mean(values))\n' +
                    'print("Variance:", np.var(values))\n' +
                    'print("Std:", np.std(values))',
                required: [
                    ["np.mean("],
                    ["np.var("],
                    ["np.std("],
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

        list.innerHTML = problems.map(function (problem, index) {
            const number = index + 1;

            return '<article class="aiml-problem-card' +
                (solved.has(index) ? " is-solved" : "") +
                '" data-problem="' +
                index +
                '">' +
                '<div class="aiml-problem-head">' +
                '<span class="aiml-problem-number">' +
                String(number).padStart(2, "0") +
                "</span>" +
                "<div><h3>" +
                number +
                ". " +
                escapeHtml(problem.title) +
                "</h3><p>" +
                escapeHtml(problem.description) +
                "</p></div></div>" +
                '<div class="aiml-problem-data">' +
                "<span><strong>Sample input:</strong> " +
                escapeHtml(problem.sampleInput) +
                "</span>" +
                "<span><strong>Expected output:</strong> <code>" +
                escapeHtml(problem.expected) +
                "</code></span></div>" +
                '<div class="aiml-problem-actions">' +
                '<button type="button" class="primary" ' +
                'data-action="workspace">💻 Solve It Yourself</button>' +
                '<button type="button" class="hint" ' +
                'data-action="hint">Hint</button>' +
                '<button type="button" data-action="solution">' +
                "Show Program</button></div>" +
                '<div class="aiml-problem-reveal" ' +
                'data-panel="hint" hidden>' +
                "<strong>Hint</strong><p>" +
                escapeHtml(problem.hint) +
                "</p></div>" +
                '<div class="aiml-problem-reveal" ' +
                'data-panel="solution" hidden>' +
                "<strong>Model program</strong><pre><code>" +
                escapeHtml(problem.solution) +
                "</code></pre></div>" +
                '<div class="aiml-workspace" ' +
                'data-panel="workspace" hidden>' +
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
                "Check Answer</button>" +
                '<button type="button" data-action="reset">' +
                "Reset</button>" +
                '<span class="aiml-check-result" data-result>' +
                "Write your solution, then check its structure." +
                "</span></div></div></article>";
        }).join("");

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
            button.textContent = opening ? closeLabel : openLabel;
        }

        list.addEventListener("click", function (event) {
            const button = event.target.closest("button[data-action]");

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
                        return !alternatives.some(function (token) {
                            return normalized.includes(
                                token.toLowerCase()
                            );
                        });
                    }
                );

                if (
                    !textarea.value.trim() ||
                    textarea.value.trim() === problem.starter.trim()
                ) {
                    result.className = "aiml-check-result error";
                    result.textContent =
                        "Add your solution before checking.";
                    return;
                }

                if (missing.length > 0) {
                    result.className = "aiml-check-result error";
                    result.textContent =
                        "Not complete yet. Recheck the required " +
                        "probability formula, operation and output.";
                    return;
                }

                const score = revealed.has(problemIndex) ? 60 : 100;

                solved.add(problemIndex);

                scores[problemIndex] = Math.max(
                    Number(scores[problemIndex] || 0),
                    score
                );

                card.classList.add("is-solved");
                result.className = "aiml-check-result success";

                result.textContent = revealed.has(problemIndex)
                    ? "Logic recognized — completed after viewing " +
                        "the model program. Score: 60/100."
                    : "Logic recognized — solved independently. " +
                        "Score: 100/100.";

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
                question: "If P(A)=0.35, what is P(not A)?",
                options: [
                    "0.35",
                    "0.65",
                    "1.35",
                    "0"
                ],
                answer: 1,
                explanation: "The complement rule gives P(Aᶜ)=1−P(A)=1−0.35=0.65."
            },
            {
                question: "If independent events have P(A)=0.5 and P(B)=0.4, what is P(A∩B)?",
                options: [
                    "0.9",
                    "0.1",
                    "0.2",
                    "0.45"
                ],
                answer: 2,
                explanation: "For independent events, multiply their probabilities: 0.5×0.4=0.2."
            },
            {
                question: "Which distribution models one success-or-failure trial?",
                options: [
                    "Normal",
                    "Poisson",
                    "Bernoulli",
                    "Uniform"
                ],
                answer: 2,
                explanation: "A Bernoulli random variable has two outcomes, commonly encoded as 0 and 1."
            },
            {
                question: "What does standard deviation measure?",
                options: [
                    "Spread in the original units",
                    "Only the maximum",
                    "Causal strength",
                    "Sample size"
                ],
                answer: 0,
                explanation: "Standard deviation is the square root of variance and measures spread in the variable’s original units."
            },
            {
                question: "Which statement about correlation is correct?",
                options: [
                    "Correlation proves causation",
                    "Zero correlation always means independence",
                    "Correlation measures standardized linear association",
                    "Correlation can exceed 1"
                ],
                answer: 2,
                explanation: "Correlation is a scale-free measure of linear association bounded between −1 and +1."
            },
            {
                question: "What does the Central Limit Theorem primarily describe?",
                options: [
                    "Every dataset is normal",
                    "The distribution of suitably standardized sample means approaches normality",
                    "All samples have the same mean",
                    "Variance becomes exactly zero"
                ],
                answer: 1,
                explanation: "Under common conditions, the sampling distribution of standardized means approaches a normal distribution as n grows."
            },
            {
                question: "What is a p-value?",
                options: [
                    "The probability H₀ is true",
                    "The probability the result happened by accident",
                    "The probability under H₀ of data at least this extreme",
                    "The effect size"
                ],
                answer: 2,
                explanation: "A p-value is computed assuming H₀ and measures how extreme the observed evidence is under that assumption."
            },
            {
                question: "How does MAP differ from MLE?",
                options: [
                    "MAP includes a prior over parameters",
                    "MLE always uses more data",
                    "MAP cannot optimize likelihood",
                    "They are unrelated to probability"
                ],
                answer: 0,
                explanation: "MAP combines likelihood with a prior, while MLE selects parameters using likelihood alone."
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
                    item.options.map(function (option, optionIndex) {
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
                            String.fromCharCode(65 + optionIndex) +
                            ". " +
                            escapeHtml(option) +
                            "</span></label>";
                    }).join("") +
                    "</div>" +
                    '<div class="aiml-quiz-explanation" hidden></div>' +
                    "</article>";
            }
        ).join("");

        container.addEventListener("change", function (event) {
            if (!event.target.matches('input[type="radio"]')) {
                return;
            }

            event.target
                .closest(".aiml-quiz-question")
                .querySelectorAll(".aiml-quiz-option")
                .forEach(function (option) {
                    option.classList.toggle(
                        "is-selected",
                        option.contains(event.target)
                    );
                });
        });

        byId("checkQuiz").addEventListener("click", function () {
            let correct = 0;
            let answered = 0;

            questions.forEach(function (item, questionIndex) {
                const question = container.querySelector(
                    '[data-quiz-question="' + questionIndex + '"]'
                );

                const selected = question.querySelector(
                    'input[type="radio"]:checked'
                );

                const options = Array.from(
                    question.querySelectorAll(".aiml-quiz-option")
                );

                const explanation = question.querySelector(
                    ".aiml-quiz-explanation"
                );

                options.forEach(function (option, optionIndex) {
                    option.classList.remove(
                        "is-correct",
                        "is-wrong"
                    );

                    if (optionIndex === item.answer) {
                        option.classList.add("is-correct");
                    }
                });

                if (selected) {
                    const selectedIndex = Number(selected.value);
                    answered += 1;

                    if (selectedIndex === item.answer) {
                        correct += 1;
                    } else {
                        options[selectedIndex].classList.add("is-wrong");
                    }
                }

                explanation.hidden = false;

                explanation.innerHTML =
                    "<strong>" +
                    (
                        selected
                            ? "Your answer: " +
                                escapeHtml(
                                    item.options[Number(selected.value)]
                                )
                            : "Your answer: Not attempted"
                    ) +
                    "</strong><br>" +
                    "<strong>Correct answer: " +
                    escapeHtml(item.options[item.answer]) +
                    "</strong><br>" +
                    escapeHtml(item.explanation);
            });

            byId("quizScore").textContent =
                correct +
                " / " +
                questions.length +
                " correct" +
                (
                    answered < questions.length
                        ? " • " +
                            (questions.length - answered) +
                            " not attempted"
                        : ""
                );

            let progress = {};

            try {
                progress = JSON.parse(
                    window.localStorage.getItem(LEVEL_PROGRESS_KEY) ||
                    "{}"
                );
            } catch (error) {
                progress = {};
            }

            progress.bestQuizScore = Math.max(
                Number(progress.bestQuizScore || 0),
                correct
            );

            window.localStorage.setItem(
                LEVEL_PROGRESS_KEY,
                JSON.stringify(progress)
            );
        });

        byId("resetQuiz").addEventListener("click", function () {
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
                .querySelectorAll(".aiml-quiz-explanation")
                .forEach(function (explanation) {
                    explanation.hidden = true;
                    explanation.textContent = "";
                });

            byId("quizScore").textContent = "Not checked yet";
        });
    }

    function initInterviewQuestions() {
        const container = byId("interviewList");

        if (!container) {
            return;
        }

        const questions = [
            {
                question: "What is the difference between probability and likelihood?",
                answer: "Probability treats parameters as fixed and evaluates possible data, such as P(data|θ). Likelihood treats observed data as fixed and compares parameter values through L(θ|data). The same mathematical expression is viewed for a different purpose."
            },
            {
                question: "What is conditional probability?",
                answer: "Conditional probability restricts attention to cases where B occurred: P(A|B)=P(A∩B)/P(B), provided P(B)>0. It measures how evidence B changes the chance of A."
            },
            {
                question: "How are mutually exclusive events different from independent events?",
                answer: "Mutually exclusive events cannot happen together, so their intersection probability is zero. Independent events do not change each other’s probabilities. Positive-probability mutually exclusive events are therefore dependent."
            },
            {
                question: "Explain Bayes’ theorem and base-rate neglect.",
                answer: "Bayes combines likelihood, prior and evidence: P(A|B)=P(B|A)P(A)/P(B). Base-rate neglect happens when someone focuses on test accuracy or likelihood but ignores how uncommon the underlying condition is."
            },
            {
                question: "What is the difference between variance and standard deviation?",
                answer: "Variance is the average squared deviation from the mean and is expressed in squared units. Standard deviation is its square root, so it describes spread in the original units and is easier to interpret."
            },
            {
                question: "What do covariance and correlation measure?",
                answer: "Covariance indicates the direction of joint movement but depends on units. Correlation standardizes covariance by both standard deviations, producing a scale-free linear association between −1 and +1."
            },
            {
                question: "What is the Central Limit Theorem?",
                answer: "Under common regularity conditions, the suitably standardized sum or mean of many independent observations approaches a normal distribution as sample size grows, even when individual observations are not normal."
            },
            {
                question: "What does a 95% confidence interval mean?",
                answer: "Across repeated samples, about 95% of intervals produced by the same valid procedure would contain the true parameter. It does not mean a fixed parameter has a 95% probability of lying in one already-calculated frequentist interval."
            },
            {
                question: "Explain p-value, Type I error and Type II error.",
                answer: "A p-value is the probability under H₀ of evidence at least as extreme as observed. Type I error rejects a true H₀; Type II error fails to reject a false H₀. Power is one minus the Type II error probability."
            },
            {
                question: "Why are log-likelihoods used in machine learning?",
                answer: "Products of many probabilities can underflow numerically. Taking logs converts products into sums, improves stability and preserves the maximizing parameter because logarithm is strictly increasing."
            }
        ];

        container.innerHTML = questions.map(function (item, index) {
            return '<article class="aiml-interview-item">' +
                '<div class="aiml-interview-question">' +
                "<span>" +
                (index + 1) +
                ".</span>" +
                "<strong>" +
                escapeHtml(item.question) +
                "</strong>" +
                '<button type="button" aria-expanded="false">' +
                "Show Answer</button>" +
                "</div>" +
                '<div class="aiml-interview-answer" hidden>' +
                escapeHtml(item.answer) +
                "</div></article>";
        }).join("");

        container.addEventListener("click", function (event) {
            const button = event.target.closest("button");

            if (!button) {
                return;
            }

            const answer = button
                .closest(".aiml-interview-item")
                .querySelector(".aiml-interview-answer");

            const opening = answer.hidden;

            answer.hidden = !opening;
            button.textContent =
                opening ? "Hide Answer" : "Show Answer";

            button.setAttribute(
                "aria-expanded",
                String(opening)
            );
        });
    }

    function initSmoothLocalLinks() {
        document.addEventListener("click", function (event) {
            const link = event.target.closest('a[href^="#"]');

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

    function initLevelFour() {
        initBayesVisualizer();
        initProgramTracer();
        initProgrammingProblems();
        initQuiz();
        initInterviewQuestions();
        initSmoothLocalLinks();
    }

    if (document.readyState === "loading") {
        document.addEventListener(
            "DOMContentLoaded",
            initLevelFour
        );
    } else {
        initLevelFour();
    }
}());
