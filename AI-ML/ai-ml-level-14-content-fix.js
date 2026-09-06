(function () {
    "use strict";

    const PROGRESS_KEY =
        "codebhavya-aiml-level-14-progress-v1";

    const get = function (id) {
        return document.getElementById(id);
    };

    function escapeHtml(value) {
        return String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/\"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    function fixed(value, digits) {
        return Number(value).toFixed(
            digits === undefined ? 3 : digits
        );
    }

    function dot(a, b) {
        return a.reduce(function (sum, value, index) {
            return sum + value * b[index];
        }, 0);
    }

    function initTracer() {
        const codeContainer = get("tracerCode");
        const toggle = get("tracerPanelToggle");
        const panel = get("tracerPanel");

        if (
            !codeContainer ||
            !toggle ||
            !panel ||
            codeContainer.dataset.cbTracerActive
        ) {
            return;
        }

        codeContainer.dataset.cbTracerActive = "true";

        const lines = [
            "X = [[2, 1], [3, 2], [4, 2], [5, 4]]",
            "n = len(X)",
            "means = [0.0, 0.0]",
            "for row in X:",
            "    for j in range(2):",
            "        means[j] += row[j] / n",
            "centered = []",
            "for row in X:",
            "    centered.append([row[j] - means[j] for j in range(2)])",
            "covariance = [[0.0, 0.0], [0.0, 0.0]]",
            "for row in centered:",
            "    for i in range(2):",
            "        for j in range(2):",
            "            covariance[i][j] += row[i] * row[j] / (n - 1)",
            "vector = [1.0, 0.0]",
            "for iteration in range(4):",
            "    product = [sum(covariance[i][j] * vector[j] for j in range(2)) for i in range(2)]",
            "    length = sum(value ** 2 for value in product) ** 0.5",
            "    vector = [value / length for value in product]",
            "scores = []",
            "for row in centered:",
            "    scores.append(sum(row[j] * vector[j] for j in range(2)))",
            "print([round(score, 2) for score in scores])"
        ];

        function clone(value) {
            return JSON.parse(JSON.stringify(value));
        }

        function buildStates() {
            const states = [];
            const X = [
                [2, 1],
                [3, 2],
                [4, 2],
                [5, 4]
            ];

            const n = X.length;
            const means = [0, 0];
            const centered = [];
            const covariance = [
                [0, 0],
                [0, 0]
            ];

            let vector = [1, 0];
            let scores = [];

            function add(
                line,
                explanation,
                variables,
                expression,
                output
            ) {
                states.push({
                    line: line,
                    explanation: explanation,
                    variables: clone(variables || {}),
                    expression: expression || "—",
                    output: output || ""
                });
            }

            add(
                0,
                "Create four observations with two features each.",
                { X: X },
                "X has shape 4 × 2"
            );

            add(
                1,
                "Store the number of observations.",
                { n: n },
                "len(X) = " + n
            );

            add(
                2,
                "Initialize one running mean for each feature.",
                { means: means },
                "means = [0.0, 0.0]"
            );

            X.forEach(function (row, rowIndex) {
                add(
                    3,
                    "Enter the outer mean loop for row " +
                        rowIndex +
                        ".",
                    {
                        row_index: rowIndex,
                        row: row,
                        means: means
                    },
                    "row = " + JSON.stringify(row)
                );

                for (let j = 0; j < 2; j += 1) {
                    add(
                        4,
                        "Enter the inner feature loop with j = " +
                            j +
                            ".",
                        {
                            row_index: rowIndex,
                            j: j,
                            means: means
                        },
                        "range(2) gives " + j
                    );

                    const contribution = row[j] / n;
                    means[j] += contribution;

                    add(
                        5,
                        "Add this observation's contribution to feature " +
                            j +
                            " mean.",
                        {
                            row_index: rowIndex,
                            j: j,
                            contribution: contribution,
                            means: means
                        },
                        fixed(row[j], 1) +
                            " / " +
                            n +
                            " = " +
                            fixed(contribution, 3)
                    );
                }
            });

            add(
                6,
                "Create the list for centred observations.",
                {
                    means: means,
                    centered: centered
                },
                "centered = []"
            );

            X.forEach(function (row, rowIndex) {
                add(
                    7,
                    "Return to the centering loop for row " +
                        rowIndex +
                        ".",
                    {
                        row_index: rowIndex,
                        row: row,
                        means: means
                    },
                    "row = " + JSON.stringify(row)
                );

                const centeredRow = [
                    row[0] - means[0],
                    row[1] - means[1]
                ];

                centered.push(centeredRow);

                add(
                    8,
                    "Subtract both feature means and append the centred row.",
                    {
                        row_index: rowIndex,
                        centered_row: centeredRow,
                        centered: centered
                    },
                    JSON.stringify(row) +
                        " − " +
                        JSON.stringify(means)
                );
            });

            add(
                9,
                "Initialize the 2 × 2 covariance accumulator.",
                { covariance: covariance },
                "covariance = zeros(2, 2)"
            );

            centered.forEach(function (row, rowIndex) {
                add(
                    10,
                    "Enter the covariance row loop for centred row " +
                        rowIndex +
                        ".",
                    {
                        row_index: rowIndex,
                        row: row,
                        covariance: covariance
                    },
                    "row = " + JSON.stringify(row)
                );

                for (let i = 0; i < 2; i += 1) {
                    add(
                        11,
                        "Select covariance output row i = " +
                            i +
                            ".",
                        {
                            row_index: rowIndex,
                            i: i,
                            covariance: covariance
                        },
                        "i = " + i
                    );

                    for (let j = 0; j < 2; j += 1) {
                        add(
                            12,
                            "Select covariance output column j = " +
                                j +
                                ".",
                            {
                                row_index: rowIndex,
                                i: i,
                                j: j,
                                covariance: covariance
                            },
                            "j = " + j
                        );

                        const contribution =
                            row[i] *
                            row[j] /
                            (n - 1);

                        covariance[i][j] += contribution;

                        add(
                            13,
                            "Accumulate the outer-product contribution.",
                            {
                                row_index: rowIndex,
                                i: i,
                                j: j,
                                contribution: contribution,
                                covariance: covariance
                            },
                            fixed(row[i], 2) +
                                " × " +
                                fixed(row[j], 2) +
                                " / " +
                                (n - 1)
                        );
                    }
                }
            });

            add(
                14,
                "Initialize a direction for power iteration.",
                {
                    covariance: covariance,
                    vector: vector
                },
                "vector = [1.0, 0.0]"
            );

            for (
                let iteration = 0;
                iteration < 4;
                iteration += 1
            ) {
                add(
                    15,
                    "Begin power-iteration pass " +
                        (iteration + 1) +
                        ".",
                    {
                        iteration: iteration,
                        vector: vector
                    },
                    "iteration = " + iteration
                );

                const product = [
                    covariance[0][0] * vector[0] +
                        covariance[0][1] * vector[1],

                    covariance[1][0] * vector[0] +
                        covariance[1][1] * vector[1]
                ];

                add(
                    16,
                    "Multiply covariance by the current direction.",
                    {
                        iteration: iteration,
                        vector: vector,
                        product: product
                    },
                    "C × v = " +
                        JSON.stringify(
                            product.map(function (value) {
                                return Number(
                                    fixed(value, 3)
                                );
                            })
                        )
                );

                const length = Math.hypot(
                    product[0],
                    product[1]
                );

                add(
                    17,
                    "Calculate the Euclidean normalization length.",
                    {
                        iteration: iteration,
                        product: product,
                        length: length
                    },
                    "‖product‖ = " +
                        fixed(length, 4)
                );

                vector = [
                    product[0] / length,
                    product[1] / length
                ];

                add(
                    18,
                    "Normalize the vector. Repetition moves it toward PC1.",
                    {
                        iteration: iteration,
                        length: length,
                        vector: vector
                    },
                    "vector = " +
                        JSON.stringify(
                            vector.map(function (value) {
                                return Number(
                                    fixed(value, 4)
                                );
                            })
                        )
                );
            }

            add(
                19,
                "Create the list of one-dimensional PCA scores.",
                {
                    vector: vector,
                    scores: scores
                },
                "scores = []"
            );

            centered.forEach(function (row, rowIndex) {
                add(
                    20,
                    "Return to the projection loop for centred row " +
                        rowIndex +
                        ".",
                    {
                        row_index: rowIndex,
                        row: row,
                        vector: vector,
                        scores: scores
                    },
                    "row = " + JSON.stringify(row)
                );

                const score = dot(row, vector);
                scores.push(score);

                add(
                    21,
                    "Project the centred row onto the estimated PC1 direction.",
                    {
                        row_index: rowIndex,
                        score: score,
                        scores: scores
                    },
                    "row · vector = " +
                        fixed(score, 4)
                );
            });

            const output =
                "[" +
                scores
                    .map(function (score) {
                        return fixed(score, 2);
                    })
                    .join(", ") +
                "]";

            add(
                22,
                "Round and print the four PCA scores. Execution is complete.",
                {
                    vector: vector,
                    scores: scores
                },
                "print(round(scores, 2))",
                output
            );

            return states;
        }

        const states = buildStates();

        const previous = get("tracerPrevious");
        const next = get("tracerNext");
        const auto = get("tracerAuto");
        const pause = get("tracerPause");
        const reset = get("tracerReset");

        let step = 0;
        let timer = null;

        codeContainer.innerHTML = lines
            .map(function (line, index) {
                return (
                    '<div class="aiml-code-line" data-line="' +
                    index +
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

        function stop() {
            if (timer !== null) {
                window.clearInterval(timer);
            }

            timer = null;
            pause.disabled = true;
        }

        function formatValue(value) {
            if (value === null) {
                return "None";
            }

            if (typeof value === "number") {
                return Number.isInteger(value)
                    ? String(value)
                    : fixed(value, 4);
            }

            return JSON.stringify(
                value,
                function (_, item) {
                    return typeof item === "number"
                        ? Number(fixed(item, 4))
                        : item;
                }
            );
        }

        function render() {
            const atStart = step === 0;
            const atEnd = step >= states.length;

            const current = atStart
                ? null
                : states[step - 1];

            codeContainer
                .querySelectorAll(".aiml-code-line")
                .forEach(function (line, index) {
                    line.classList.toggle(
                        "is-active",
                        !!current &&
                            index === current.line
                    );
                });

            if (current) {
                const activeLine =
                    codeContainer.querySelector(
                        '[data-line="' +
                            current.line +
                            '"]'
                    );

                if (activeLine) {
                    activeLine.scrollIntoView({
                        block: "nearest"
                    });
                }
            }

            get("tracerStatus").textContent =
                atStart
                    ? "Ready"
                    : atEnd
                        ? "Complete"
                        : "Running";

            get("tracerExplanation").textContent =
                current
                    ? current.explanation
                    : "Press Next to evaluate the first statement.";

            get("tracerExpression").textContent =
                current
                    ? current.expression
                    : "—";

            get("tracerOutput").textContent =
                current && current.output
                    ? current.output
                    : "Waiting for print(...)";

            const variables =
                current ? current.variables : {};

            get("tracerVariables").innerHTML =
                Object.keys(variables).length
                    ? Object.keys(variables)
                        .map(function (key) {
                            return (
                                '<article class="aiml-variable">' +
                                "<span>" +
                                escapeHtml(key) +
                                "</span>" +
                                "<code>" +
                                escapeHtml(
                                    formatValue(
                                        variables[key]
                                    )
                                ) +
                                "</code>" +
                                "</article>"
                            );
                        })
                        .join("")
                    : '<article class="aiml-variable"><span>STATE</span><code>Not started</code></article>';

            previous.disabled = atStart;
            next.disabled = atEnd;

            auto.disabled =
                atEnd || timer !== null;

            pause.disabled =
                timer === null;

            get("tracerProgress").textContent =
                "Step " +
                step +
                " of " +
                states.length;

            if (atEnd) {
                stop();
            }
        }

        function advance() {
            if (step < states.length) {
                step += 1;
            }

            render();
        }

        toggle.addEventListener(
            "click",
            function () {
                const opening = panel.hidden;

                panel.hidden = !opening;

                toggle.textContent = opening
                    ? "✕ Close Interactive Tracer"
                    : "Open Interactive Tracer";

                toggle.setAttribute(
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
                    stop();
                }
            }
        );

        previous.addEventListener(
            "click",
            function () {
                stop();

                step = Math.max(
                    0,
                    step - 1
                );

                render();
            }
        );

        next.addEventListener(
            "click",
            advance
        );

        auto.addEventListener(
            "click",
            function () {
                if (
                    step >= states.length ||
                    timer !== null
                ) {
                    return;
                }

                auto.disabled = true;
                pause.disabled = false;

                timer = window.setInterval(
                    advance,
                    650
                );
            }
        );

        pause.addEventListener(
            "click",
            function () {
                stop();
                render();
            }
        );

        reset.addEventListener(
            "click",
            function () {
                stop();
                step = 0;
                render();
            }
        );

        render();
    }

    function initProblems() {
        const list = get("problemList");

        if (
            !list ||
            list.dataset.cbProblemsActive
        ) {
            return;
        }

        list.dataset.cbProblemsActive = "true";

        const problems = [
            {
                title: "Centre Every Feature Column",
                description:
                    "Calculate column means and print the centred 2-D observations.",
                sampleInput:
                    "X=[[2,1],[4,3],[6,5]]",
                expected:
                    "[[-2.0,-2.0],[0.0,0.0],[2.0,2.0]]",
                hint:
                    "Find one mean per column, then subtract means[j] from every row[j].",
                starter:
                    "X = [[2, 1], [4, 3], [6, 5]]\n" +
                    "# Calculate feature means and centred rows\n",
                solution:
                    "X = [[2, 1], [4, 3], [6, 5]]\n" +
                    "n = len(X)\n" +
                    "means = [sum(row[j] for row in X) / n for j in range(2)]\n" +
                    "centered = [[row[j] - means[j] for j in range(2)] for row in X]\n" +
                    "print(centered)",
                required: [
                    ["len("],
                    ["sum("],
                    ["for j in range"],
                    [
                        "row[j] - means[j]",
                        "row[j]-means[j]"
                    ],
                    ["print("]
                ]
            },
            {
                title:
                    "Build a Sample Covariance Matrix",
                description:
                    "Use centred rows to calculate the complete 2 × 2 sample covariance matrix.",
                sampleInput:
                    "centered=[[-2,-1],[0,0],[2,1]]",
                expected:
                    "[[4.0,2.0],[2.0,1.0]]",
                hint:
                    "Accumulate row[i] * row[j] and divide by n-1 for each matrix cell.",
                starter:
                    "centered = [[-2, -1], [0, 0], [2, 1]]\n" +
                    "n = len(centered)\n" +
                    "# Build the covariance matrix\n",
                solution:
                    "centered = [[-2, -1], [0, 0], [2, 1]]\n" +
                    "n = len(centered)\n" +
                    "covariance = [[0.0, 0.0], [0.0, 0.0]]\n" +
                    "for row in centered:\n" +
                    "    for i in range(2):\n" +
                    "        for j in range(2):\n" +
                    "            covariance[i][j] += row[i] * row[j] / (n - 1)\n" +
                    "print(covariance)",
                required: [
                    ["for row in"],
                    ["for i in range"],
                    ["for j in range"],
                    [
                        "row[i] * row[j]",
                        "row[i]*row[j]"
                    ],
                    [
                        "n - 1",
                        "n-1"
                    ],
                    ["print("]
                ]
            },
            {
                title:
                    "Calculate Explained Variance Ratios",
                description:
                    "Convert sorted eigenvalues into component and cumulative explained-variance ratios.",
                sampleInput:
                    "eigenvalues=[6.0,3.0,1.0]",
                expected:
                    "ratios=[0.6,0.3,0.1], cumulative=[0.6,0.9,1.0]",
                hint:
                    "Divide each eigenvalue by the total and maintain a running sum.",
                starter:
                    "eigenvalues = [6.0, 3.0, 1.0]\n" +
                    "# Calculate ratios and cumulative ratios\n",
                solution:
                    "eigenvalues = [6.0, 3.0, 1.0]\n" +
                    "total = sum(eigenvalues)\n" +
                    "ratios = [value / total for value in eigenvalues]\n" +
                    "cumulative = []\n" +
                    "running = 0.0\n" +
                    "for ratio in ratios:\n" +
                    "    running += ratio\n" +
                    "    cumulative.append(running)\n" +
                    "print(ratios)\n" +
                    "print(cumulative)",
                required: [
                    ["sum("],
                    [
                        "value / total",
                        "value/total"
                    ],
                    ["for ratio in"],
                    [
                        "running += ratio",
                        "running=running+ratio"
                    ],
                    ["append("],
                    ["print("]
                ]
            },
            {
                title:
                    "Project Rows onto One Component",
                description:
                    "Calculate one PCA score per centred observation using a supplied unit vector.",
                sampleInput:
                    "Xc=[[-2,-1],[0,0],[2,1]], component=[0.8944,0.4472]",
                expected:
                    "[-2.236,0.0,2.236]",
                hint:
                    "Each score is the dot product of one centred row and the component vector.",
                starter:
                    "Xc = [[-2, -1], [0, 0], [2, 1]]\n" +
                    "component = [0.8944, 0.4472]\n" +
                    "# Project each row\n",
                solution:
                    "Xc = [[-2, -1], [0, 0], [2, 1]]\n" +
                    "component = [0.8944, 0.4472]\n" +
                    "scores = []\n" +
                    "for row in Xc:\n" +
                    "    score = sum(row[j] * component[j] for j in range(2))\n" +
                    "    scores.append(round(score, 3))\n" +
                    "print(scores)",
                required: [
                    ["for row in"],
                    ["sum("],
                    [
                        "row[j] * component[j]",
                        "row[j]*component[j]"
                    ],
                    ["append("],
                    ["round("],
                    ["print("]
                ]
            },
            {
                title:
                    "Reconstruct and Measure RMSE",
                description:
                    "Rebuild centred rows from one component and calculate reconstruction RMSE.",
                sampleInput:
                    "scores=[-2.236,0,2.236], component=[0.8944,0.4472]",
                expected:
                    "reconstructed rows and RMSE",
                hint:
                    "Reconstruction is score × component; average all squared cell errors before the square root.",
                starter:
                    "Xc = [[-2, -1], [0, 0], [2, 1]]\n" +
                    "scores = [-2.236, 0.0, 2.236]\n" +
                    "component = [0.8944, 0.4472]\n" +
                    "# Reconstruct and calculate RMSE\n",
                solution:
                    "Xc = [[-2, -1], [0, 0], [2, 1]]\n" +
                    "scores = [-2.236, 0.0, 2.236]\n" +
                    "component = [0.8944, 0.4472]\n" +
                    "reconstructed = [[score * component[j] for j in range(2)] for score in scores]\n" +
                    "squared_error = 0.0\n" +
                    "for row, rebuilt in zip(Xc, reconstructed):\n" +
                    "    for original, estimate in zip(row, rebuilt):\n" +
                    "        squared_error += (original - estimate) ** 2\n" +
                    "rmse = (squared_error / (len(Xc) * 2)) ** 0.5\n" +
                    "print(reconstructed)\n" +
                    "print(round(rmse, 4))",
                required: [
                    [
                        "score * component[j]",
                        "score*component[j]"
                    ],
                    ["zip("],
                    [
                        "** 2",
                        "**2"
                    ],
                    ["len("],
                    [
                        "** 0.5",
                        "**0.5"
                    ],
                    ["round("],
                    ["print("]
                ]
            }
        ];

        let saved = {};

        try {
            saved = JSON.parse(
                window.localStorage.getItem(
                    PROGRESS_KEY
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

        function save() {
            let current = {};

            try {
                current = JSON.parse(
                    window.localStorage.getItem(
                        PROGRESS_KEY
                    ) || "{}"
                );
            } catch (error) {
                current = {};
            }

            current.solvedProblems =
                Array.from(solved);

            current.problemScores = scores;

            window.localStorage.setItem(
                PROGRESS_KEY,
                JSON.stringify(current)
            );
        }

        function updateSummary() {
            const total = Object.values(scores)
                .reduce(function (sum, score) {
                    return (
                        sum +
                        Number(score || 0)
                    );
                }, 0);

            get("problemSolvedCount").textContent =
                solved.size +
                " / " +
                problems.length;

            get("problemScore").textContent =
                total +
                " / " +
                problems.length * 100;

            get("problemProgressBar").style.width =
                solved.size /
                problems.length *
                100 +
                "%";
        }

        list.innerHTML = problems
            .map(function (problem, index) {
                const number = index + 1;

                return (
                    '<article class="aiml-problem-card' +
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
                    "<span><strong>Sample input:</strong> " +
                    escapeHtml(problem.sampleInput) +
                    "</span>" +
                    "<span><strong>Expected output:</strong> " +
                    "<code>" +
                    escapeHtml(problem.expected) +
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
                    escapeHtml(problem.solution) +
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
            name,
            button,
            closedText,
            openText
        ) {
            const section = card.querySelector(
                '[data-panel="' +
                    name +
                    '"]'
            );

            if (!section) {
                return;
            }

            const opening = section.hidden;
            section.hidden = !opening;

            button.textContent = opening
                ? openText
                : closedText;
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

                const index =
                    Number(card.dataset.problem);

                const problem = problems[index];
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
                    revealed.add(index);

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
                            .replace(/\s+/g, " ");

                    const missing =
                        problem.required.filter(
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

                    if (missing.length) {
                        result.className =
                            "aiml-check-result error";

                        result.textContent =
                            "Not complete yet. Recheck the required reduction logic.";

                        return;
                    }

                    const score =
                        revealed.has(index)
                            ? 60
                            : 100;

                    solved.add(index);

                    scores[index] = Math.max(
                        Number(
                            scores[index] || 0
                        ),
                        score
                    );

                    card.classList.add(
                        "is-solved"
                    );

                    result.className =
                        "aiml-check-result success";

                    result.textContent =
                        revealed.has(index)
                            ? "Logic recognized after viewing the model program. Score: 60/100."
                            : "Logic recognized — solved independently. Score: 100/100.";

                    save();
                    updateSummary();
                }
            }
        );

        updateSummary();
    }

    function initQuiz() {
        const container = get("quizQuestions");

        if (
            !container ||
            container.dataset.cbQuizActive
        ) {
            return;
        }

        container.dataset.cbQuizActive = "true";

        const questions = [
            {
                question:
                    "What does the curse of dimensionality describe?",
                options: [
                    "Every new feature improves accuracy",
                    "Data becomes sparse and neighbourhood evidence weakens as dimensions grow",
                    "PCA requires labels",
                    "Covariance becomes zero"
                ],
                answer: 1,
                explanation:
                    "A fixed sample covers a rapidly growing feature space poorly, weakening distance and density evidence."
            },
            {
                question:
                    "What preprocessing step is always part of ordinary PCA?",
                options: [
                    "Target encoding",
                    "Feature centering",
                    "Class balancing",
                    "Decision threshold tuning"
                ],
                answer: 1,
                explanation:
                    "PCA operates on variation around the mean, so training feature means are subtracted."
            },
            {
                question:
                    "What does a PCA eigenvector represent?",
                options: [
                    "A principal direction in feature space",
                    "A class label",
                    "A missing value",
                    "A validation fold"
                ],
                answer: 0,
                explanation:
                    "Covariance eigenvectors form orthogonal principal directions."
            },
            {
                question:
                    "How is one component's explained-variance ratio calculated?",
                options: [
                    "λj divided by the sum of all eigenvalues",
                    "λj multiplied by sample count",
                    "Mean divided by standard deviation",
                    "Accuracy divided by loss"
                ],
                answer: 0,
                explanation:
                    "Dividing a component eigenvalue by the total eigenvalue sum gives its variance share."
            },
            {
                question:
                    "Why is 95% cumulative variance not a universal rule?",
                options: [
                    "PCA cannot calculate variance",
                    "Variance and predictive information are not identical",
                    "It always retains every feature",
                    "It requires class labels"
                ],
                answer: 1,
                explanation:
                    "Low-variance directions can be predictive, while high variance can represent nuisance variation."
            },
            {
                question:
                    "How is PCA related to SVD for centred X?",
                options: [
                    "PCA directions are right singular vectors of X",
                    "PCA directions are target labels",
                    "All singular values equal one",
                    "SVD requires a square covariance matrix"
                ],
                answer: 0,
                explanation:
                    "For centred X=UΣVᵀ, columns of V are PCA directions."
            },
            {
                question:
                    "What is special about truncated SVD?",
                options: [
                    "It gives the optimal rank-K approximation under common matrix norms",
                    "It always has zero error",
                    "It uses labels",
                    "It cannot process rectangular matrices"
                ],
                answer: 0,
                explanation:
                    "Leading singular triplets provide the best rank-K approximation under common norms."
            },
            {
                question:
                    "What is the central difference between PCA and LDA?",
                options: [
                    "PCA is supervised and LDA is unsupervised",
                    "PCA preserves variance; LDA uses labels to preserve class separation",
                    "LDA has unlimited components",
                    "PCA only works on images"
                ],
                answer: 1,
                explanation:
                    "PCA ignores labels; LDA uses them to favour class separation."
            },
            {
                question:
                    "Which conclusion is unsafe from a t-SNE plot alone?",
                options: [
                    "Some displayed points are neighbours",
                    "Visible islands prove true natural classes",
                    "The layout is two-dimensional",
                    "Settings can influence the result"
                ],
                answer: 1,
                explanation:
                    "Nonlinear embeddings can create apparent islands; validate patterns in original space."
            },
            {
                question:
                    "How do you avoid PCA leakage during cross-validation?",
                options: [
                    "Fit PCA once on all rows",
                    "Fit PCA independently inside each training fold",
                    "Remove the estimator",
                    "Use test labels to choose K"
                ],
                answer: 1,
                explanation:
                    "Means, scales and components must be fitted only inside each training fold."
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
                        .map(function (
                            option,
                            optionIndex
                        ) {
                            const id =
                                "quiz-fourteen-" +
                                questionIndex +
                                "-" +
                                optionIndex;

                            return (
                                '<label class="aiml-quiz-option" for="' +
                                id +
                                '">' +
                                '<input type="radio" id="' +
                                id +
                                '" name="quiz-fourteen-' +
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
                    .forEach(function (option) {
                        option.classList.toggle(
                            "is-selected",
                            option.contains(
                                event.target
                            )
                        );
                    });
            }
        );

        get("checkQuiz").addEventListener(
            "click",
            function () {
                let correct = 0;
                let answered = 0;

                questions.forEach(
                    function (item, index) {
                        const question =
                            container.querySelector(
                                '[data-quiz-question="' +
                                    index +
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
                            answered += 1;

                            if (
                                Number(
                                    selected.value
                                ) === item.answer
                            ) {
                                correct += 1;
                            } else {
                                options[
                                    Number(
                                        selected.value
                                    )
                                ].classList.add(
                                    "is-wrong"
                                );
                            }
                        }

                        explanation.hidden = false;

                        explanation.innerHTML =
                            "<strong>Your answer: " +
                            (
                                selected
                                    ? escapeHtml(
                                        item.options[
                                            Number(
                                                selected.value
                                            )
                                        ]
                                    )
                                    : "Not attempted"
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

                get("quizScore").textContent =
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

                get("resetQuiz").disabled = false;

                let progress = {};

                try {
                    progress = JSON.parse(
                        window.localStorage.getItem(
                            PROGRESS_KEY
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
                    PROGRESS_KEY,
                    JSON.stringify(progress)
                );
            }
        );

        get("resetQuiz").addEventListener(
            "click",
            function () {
                container
                    .querySelectorAll(
                        'input[type="radio"]'
                    )
                    .forEach(function (input) {
                        input.checked = false;
                    });

                container
                    .querySelectorAll(
                        ".aiml-quiz-option"
                    )
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
                    .forEach(
                        function (explanation) {
                            explanation.hidden = true;
                            explanation.textContent = "";
                        }
                    );

                get("quizScore").textContent =
                    "Not checked yet";

                get("resetQuiz").disabled = true;
            }
        );
    }

    function initInterviews() {
        const container = get("interviewList");

        if (
            !container ||
            container.dataset.cbInterviewsActive
        ) {
            return;
        }

        container.dataset.cbInterviewsActive = "true";

        const questions = [
            {
                question:
                    "Why do we use dimensionality reduction?",
                answer:
                    "We reduce redundancy, noise, storage, training cost and visualization difficulty while trying to preserve task-relevant information. Validate the retained representation against reconstruction, stability and the downstream objective."
            },
            {
                question:
                    "Explain PCA step by step.",
                answer:
                    "Split the data, fit centering or scaling on training rows, compute covariance eigendecomposition or SVD, sort components by variance, retain K directions and project the centred observations."
            },
            {
                question:
                    "Why must data be centred before PCA?",
                answer:
                    "PCA models variation around feature means. Without centering, components can describe distance from an arbitrary origin instead of covariance around the data centre."
            },
            {
                question:
                    "Should features be standardized before PCA?",
                answer:
                    "Standardize when units or scales should have comparable influence. Centre only when raw variance is meaningful and features are already comparable."
            },
            {
                question:
                    "What do PCA eigenvectors and eigenvalues mean?",
                answer:
                    "Eigenvectors are orthonormal feature-space directions. The corresponding eigenvalue is the sample variance along that direction."
            },
            {
                question:
                    "How do you choose the number of PCA components?",
                answer:
                    "Use scree and cumulative-variance plots, reconstruction error, component stability, cross-validated model performance, latency, storage and interpretability."
            },
            {
                question:
                    "What is reconstruction error in PCA?",
                answer:
                    "Project to K scores, reconstruct X̂, and measure the residual X−X̂. RMSE or squared Frobenius norm summarizes lost information."
            },
            {
                question:
                    "How are PCA and SVD related?",
                answer:
                    "For centred X=UΣVᵀ, columns of V are PCA loadings, scores are UΣ, and covariance eigenvalues are σ²/(n−1)."
            },
            {
                question:
                    "Compare PCA and LDA.",
                answer:
                    "PCA is unsupervised and preserves variance. LDA is supervised and seeks high between-class scatter relative to within-class scatter."
            },
            {
                question:
                    "What cautions apply to t-SNE?",
                answer:
                    "t-SNE is stochastic and setting-sensitive. Island size, gap distance and global axes may not be meaningful. Repeat runs and validate claims in original space."
            },
            {
                question:
                    "PCA vs TruncatedSVD: when would you choose each?",
                answer:
                    "Use PCA for centred dense numerical data. Use TruncatedSVD for large sparse matrices because explicit centering would make them dense."
            },
            {
                question:
                    "How do you prevent reduction leakage?",
                answer:
                    "Split first and put imputation, scaling, reduction and estimation in one pipeline. Fit every transformation only inside each training fold."
            }
        ];

        container.innerHTML = questions
            .map(function (item, index) {
                return (
                    '<article class="aiml-interview-card">' +
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
                    "<p>" +
                    escapeHtml(item.answer) +
                    "</p>" +
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
                        ".aiml-interview-question button"
                    );

                if (!button) {
                    return;
                }

                const answer =
                    button
                        .closest(
                            ".aiml-interview-card"
                        )
                        .querySelector(
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
            }
        );
    }

    function init() {
        initTracer();
        initProblems();
        initQuiz();
        initInterviews();
    }

    if (document.readyState === "loading") {
        document.addEventListener(
            "DOMContentLoaded",
            init
        );
    } else {
        init();
    }
}());
