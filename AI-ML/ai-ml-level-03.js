(function () {
    "use strict";

    const LEVEL_PROGRESS_KEY = "codebhavya-aiml-level-03-progress-v1";

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

    function matrixMarkup(label, values, columns, modifier) {
        return (
            '<div class="aiml-la-dynamic-matrix ' + (modifier || "") + '">' +
            "<span>" + escapeHtml(label) + "</span>" +
            '<div style="--matrix-columns:' + columns + '">' +
            values.map(function (value) {
                return "<b>" + escapeHtml(value) + "</b>";
            }).join("") +
            "</div></div>"
        );
    }

    function vectorPlane(showOriginal, showResult, transformGrid) {
        let grid = "";
        let position;

        for (position = 24; position <= 216; position += 24) {
            grid += '<line x1="' + position + '" y1="16" x2="' +
                position + '" y2="144"></line>';
        }

        for (position = 16; position <= 144; position += 16) {
            grid += '<line x1="24" y1="' + position +
                '" x2="216" y2="' + position + '"></line>';
        }

        return (
            '<div class="aiml-transform-plane' +
            (transformGrid ? " transformed" : "") + '">' +
            '<svg viewBox="0 0 240 160" role="img" ' +
            'aria-label="Input and transformed vectors on a coordinate plane">' +
            '<defs>' +
            '<marker id="arrowBlue" markerWidth="8" markerHeight="8" ' +
            'refX="7" refY="4" orient="auto">' +
            '<path d="M0,0 L8,4 L0,8 Z"></path></marker>' +
            '<marker id="arrowGold" markerWidth="8" markerHeight="8" ' +
            'refX="7" refY="4" orient="auto">' +
            '<path d="M0,0 L8,4 L0,8 Z"></path></marker>' +
            '</defs>' +
            '<g class="grid">' + grid + "</g>" +
            '<line class="axis" x1="18" y1="120" x2="222" y2="120"></line>' +
            '<line class="axis" x1="72" y1="150" x2="72" y2="10"></line>' +
            (showOriginal
                ? '<line class="original-vector" x1="72" y1="120" ' +
                  'x2="112" y2="100" marker-end="url(#arrowBlue)"></line>' +
                  '<text x="116" y="98">v = [2, 1]</text>'
                : "") +
            (showResult
                ? '<line class="result-vector" x1="72" y1="120" ' +
                  'x2="172" y2="40" marker-end="url(#arrowGold)"></line>' +
                  '<text class="result-label" x="154" y="30">Av = [5, 4]</text>'
                : "") +
            "</svg></div>"
        );
    }

    function initMatrixVisualizer() {
        const stepContainer = byId("matrixStepNodes");

        if (!stepContainer) {
            return;
        }

        const steps = [
            {
                short: "Vector",
                sub: "v = [2, 1]",
                title: "Read the input vector",
                description:
                    "The vector v contains two coordinates, so it lives " +
                    "in a two-dimensional input space.",
                insight:
                    "Shape: v is (2,). Geometrically, its arrow ends " +
                    "at the point (2, 1).",
                graphic: vectorPlane(true, false, false)
            },
            {
                short: "Matrix",
                sub: "A is 2 × 2",
                title: "Read the transformation matrix",
                description:
                    "A has two rows and two columns. It accepts a " +
                    "length-two vector and returns a length-two vector.",
                insight:
                    "Compatibility: (2 × 2)(2 × 1) → (2 × 1). " +
                    "The inner dimensions match.",
                graphic:
                    '<div class="aiml-la-operation">' +
                    matrixMarkup("A", [2, 1, 1, 2], 2, "active") +
                    "<b>×</b>" +
                    matrixMarkup("v", [2, 1], 1, "") +
                    "</div>"
            },
            {
                short: "Row 1",
                sub: "First output",
                title: "Take row 1 dot v",
                description:
                    "The first row [2, 1] meets the input vector [2, 1]. " +
                    "Multiply matching entries and add.",
                insight:
                    "First coordinate: (2 × 2) + (1 × 1) = 5.",
                graphic:
                    '<div class="aiml-la-dot-stage">' +
                    "<span>[2, 1]</span><b>·</b><span>[2, 1]</span>" +
                    "<i>= 5</i></div>"
            },
            {
                short: "Row 2",
                sub: "Second output",
                title: "Take row 2 dot v",
                description:
                    "The second row [1, 2] meets the same input vector.",
                insight:
                    "Second coordinate: (1 × 2) + (2 × 1) = 4.",
                graphic:
                    '<div class="aiml-la-dot-stage">' +
                    "<span>[1, 2]</span><b>·</b><span>[2, 1]</span>" +
                    "<i>= 4</i></div>"
            },
            {
                short: "Combine",
                sub: "Av = [5, 4]",
                title: "Combine both coordinates",
                description:
                    "Stack the two row–vector dot products in order " +
                    "to form the output vector.",
                insight:
                    "A matrix–vector product creates one output " +
                    "coordinate per matrix row.",
                graphic:
                    '<div class="aiml-la-operation">' +
                    matrixMarkup("A", [2, 1, 1, 2], 2, "") +
                    "<b>×</b>" +
                    matrixMarkup("v", [2, 1], 1, "") +
                    "<b>=</b>" +
                    matrixMarkup("Av", [5, 4], 1, "result") +
                    "</div>"
            },
            {
                short: "Geometry",
                sub: "Direction + scale",
                title: "See the geometric transformation",
                description:
                    "The matrix changes both the length and direction " +
                    "of v, moving its endpoint from (2, 1) to (5, 4).",
                insight:
                    "The same A transforms every vector consistently; " +
                    "grid lines remain straight and parallel.",
                graphic: vectorPlane(true, true, true)
            },
            {
                short: "ML meaning",
                sub: "Features → representation",
                title: "Connect the operation to machine learning",
                description:
                    "A learned weight matrix performs this transformation " +
                    "on features or hidden activations inside a model.",
                insight:
                    "A neural layer applies y = Wx + b: a linear " +
                    "transformation followed by a translation and usually " +
                    "a non-linear activation.",
                graphic:
                    '<div class="aiml-la-ml-stage">' +
                    "<span>INPUT FEATURES<br><b>[2, 1]</b></span>" +
                    "<i>W</i>" +
                    "<span>LEARNED SPACE<br><b>[5, 4]</b></span>" +
                    "<strong>MODEL REPRESENTATION</strong></div>"
            }
        ];

        const previousButton = byId("matrixPrevious");
        const nextButton = byId("matrixNext");
        const autoButton = byId("matrixAuto");
        const pauseButton = byId("matrixPause");
        const resetButton = byId("matrixReset");
        const progress = byId("matrixProgress");
        const eyebrow = byId("matrixStageEyebrow");
        const title = byId("matrixStageTitle");
        const description = byId("matrixStageDescription");
        const insight = byId("matrixStageInsight");
        const graphic = byId("matrixStageGraphic");

        let currentStep = 0;
        let timer = null;

        stepContainer.innerHTML = steps.map(function (step, index) {
            return (
                '<div class="aiml-visual-step" data-visual-step="' +
                index +
                '"><b>' +
                escapeHtml(step.short) +
                "</b><span>" +
                escapeHtml(step.sub) +
                "</span></div>"
            );
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
                "<strong>LINEAR ALGEBRA INSIGHT</strong><span>" +
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
            timer = window.setInterval(goNext, 1200);
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
        const A = [[1, 2], [3, 4]];
        const B = [[5, 6], [7, 8]];
        const result = [[0, 0], [0, 0]];
        const states = [];

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
                    "[[" +
                    result[0].join(", ") +
                    "], [" +
                    result[1].join(", ") +
                    "]]"
            });
        }

        add(
            1,
            "Matrix A created",
            "Store the first 2 × 2 matrix. Its rows will be paired " +
                "with columns from B.",
            "A = [[1, 2], [3, 4]]",
            { A: "[[1, 2], [3, 4]]" }
        );

        add(
            2,
            "Matrix B created",
            "Store the second 2 × 2 matrix. A has 2 columns and B has " +
                "2 rows, so multiplication is valid.",
            "B = [[5, 6], [7, 8]]",
            { A: "2 × 2", B: "2 × 2" }
        );

        add(
            3,
            "Result initialized",
            "Create a 2 × 2 zero matrix because the output shape is " +
                "A rows × B columns.",
            "result = zeros(2 × 2)",
            { result: "[[0, 0], [0, 0]]" }
        );

        A.forEach(function (row, i) {
            add(
                4,
                "Outer loop",
                "Choose row " +
                    i +
                    " from A. The cursor returns here when a complete " +
                    "output row is finished.",
                "i = " + i,
                {
                    i: i,
                    row: "[" + row.join(", ") + "]",
                    result: JSON.stringify(result)
                }
            );

            B[0].forEach(function (_, j) {
                add(
                    5,
                    "Middle loop",
                    "Choose column " +
                        j +
                        " from B. This determines output cell result[" +
                        i +
                        "][" +
                        j +
                        "].",
                    "j = " + j,
                    {
                        i: i,
                        j: j,
                        cell: "result[" + i + "][" + j + "]",
                        result: JSON.stringify(result)
                    }
                );

                row.forEach(function (value, k) {
                    const term = value * B[k][j];
                    const before = result[i][j];

                    add(
                        6,
                        "Inner loop",
                        "Choose matching component " +
                            k +
                            " from row " +
                            i +
                            " and column " +
                            j +
                            ".",
                        "k = " + k,
                        {
                            i: i,
                            j: j,
                            k: k,
                            activeCell: "[" + i + ", " + j + "]",
                            result: JSON.stringify(result)
                        }
                    );

                    result[i][j] += term;

                    add(
                        7,
                        "Accumulate cell",
                        "Multiply A[" +
                            i +
                            "][" +
                            k +
                            "] by B[" +
                            k +
                            "][" +
                            j +
                            "] and add the product to the active cell.",
                        before +
                            " + (" +
                            value +
                            " × " +
                            B[k][j] +
                            ") = " +
                            result[i][j],
                        {
                            i: i,
                            j: j,
                            k: k,
                            term: term,
                            activeCell: "[" + i + ", " + j + "]"
                        },
                        "[[" +
                            result[0].join(", ") +
                            "], [" +
                            result[1].join(", ") +
                            "]]"
                    );
                });
            });
        });

        add(
            8,
            "Complete",
            "Display the final product. Every output cell is a complete " +
                "row–column dot product.",
            "print(result)",
            { result: "[[19, 22], [43, 50]]" },
            "[[19, 22], [43, 50]]"
        );

        return states;
    }

    function initProgramTracer() {
        const codeContainer = byId("tracerCode");

        if (!codeContainer) {
            return;
        }

        const codeLines = [
            "A = [[1, 2], [3, 4]]",
            "B = [[5, 6], [7, 8]]",
            "result = [[0, 0], [0, 0]]",
            "for i in range(2):",
            "    for j in range(2):",
            "        for k in range(2):",
            "            result[i][j] += A[i][k] * B[k][j]",
            "print(result)"
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
            return (
                '<div class="aiml-code-line" data-code-line="' +
                (index + 1) +
                '"><span>' +
                String(index + 1).padStart(2, "0") +
                "</span><code>" +
                escapeHtml(line) +
                "</code></div>"
            );
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
                    return (
                        "<article><span>" +
                        escapeHtml(entry[0]) +
                        "</span><strong>" +
                        escapeHtml(entry[1]) +
                        "</strong></article>"
                    );
                }).join("")
                : "<article><span>STATE</span>" +
                  "<strong>Not started</strong></article>";
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
                byId("tracerOutput").textContent = "[[0, 0], [0, 0]]";
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

            panelToggle.setAttribute("aria-expanded", String(opening));

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
            if (currentStep >= traceStates.length || timer !== null) {
                return;
            }

            autoButton.disabled = true;
            pauseButton.disabled = false;
            timer = window.setInterval(goNext, 760);
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
                title: "Calculate a Dot Product",
                description:
                    "Use NumPy to calculate the dot product of the " +
                    "displayed vectors.",
                sampleInput: "a=[2, 3, 4], b=[5, 1, 2]",
                expected: "21",
                hint:
                    "Create both arrays and use np.dot(a, b) or a @ b.",
                starter:
                    "import numpy as np\n" +
                    "a = np.array([2, 3, 4])\n" +
                    "b = np.array([5, 1, 2])\n" +
                    "# Calculate and print the dot product\n",
                solution:
                    "import numpy as np\n" +
                    "a = np.array([2, 3, 4])\n" +
                    "b = np.array([5, 1, 2])\n" +
                    "dot_product = np.dot(a, b)\n" +
                    "print(dot_product)",
                required: [
                    ["np.array("],
                    ["np.dot(", "a @ b", "a@b"],
                    ["print("]
                ]
            },
            {
                title: "Measure Euclidean Distance",
                description:
                    "Find the straight-line distance between p and q " +
                    "and print it rounded to two decimals.",
                sampleInput: "p=[1, 2, 3], q=[4, 6, 3]",
                expected: "5.0",
                hint:
                    "Subtract the vectors, then use np.linalg.norm(...).",
                starter:
                    "import numpy as np\n" +
                    "p = np.array([1., 2., 3.])\n" +
                    "q = np.array([4., 6., 3.])\n" +
                    "# Calculate Euclidean distance\n",
                solution:
                    "import numpy as np\n" +
                    "p = np.array([1., 2., 3.])\n" +
                    "q = np.array([4., 6., 3.])\n" +
                    "distance = np.linalg.norm(p - q)\n" +
                    "print(round(distance, 2))",
                required: [
                    ["np.array("],
                    ["p - q", "p-q", "q - p", "q-p"],
                    ["np.linalg.norm("],
                    ["print("]
                ]
            },
            {
                title: "Transform a Feature Vector",
                description:
                    "Multiply the given 2 × 3 weight matrix by a " +
                    "length-three feature vector.",
                sampleInput:
                    "W=[[1,2,0],[0,-1,3]], x=[2,1,4]",
                expected: "[4, 11]",
                hint:
                    "Use W @ x. The inner dimension is 3.",
                starter:
                    "import numpy as np\n" +
                    "W = np.array([[1, 2, 0], [0, -1, 3]])\n" +
                    "x = np.array([2, 1, 4])\n" +
                    "# Transform x\n",
                solution:
                    "import numpy as np\n" +
                    "W = np.array([[1, 2, 0], [0, -1, 3]])\n" +
                    "x = np.array([2, 1, 4])\n" +
                    "y = W @ x\n" +
                    "print(y)",
                required: [
                    ["np.array("],
                    ["w @ x", "w@x", "np.matmul(", "np.dot(w"],
                    ["print("]
                ]
            },
            {
                title: "Compute Cosine Similarity",
                description:
                    "Calculate cosine similarity between two vectors " +
                    "and print it rounded to three decimals.",
                sampleInput: "a=[1,2,2], b=[2,1,2]",
                expected: "0.889",
                hint:
                    "Divide the dot product by the product of both L2 norms.",
                starter:
                    "import numpy as np\n" +
                    "a = np.array([1., 2., 2.])\n" +
                    "b = np.array([2., 1., 2.])\n" +
                    "# Calculate cosine similarity\n",
                solution:
                    "import numpy as np\n" +
                    "a = np.array([1., 2., 2.])\n" +
                    "b = np.array([2., 1., 2.])\n" +
                    "similarity = np.dot(a, b) / " +
                    "(np.linalg.norm(a) * np.linalg.norm(b))\n" +
                    "print(round(similarity, 3))",
                required: [
                    ["np.dot(", "a @ b", "a@b"],
                    ["np.linalg.norm(a)"],
                    ["np.linalg.norm(b)"],
                    ["/"],
                    ["print("]
                ]
            },
            {
                title: "Project One Vector onto Another",
                description:
                    "Project v onto u using the projection formula " +
                    "and print the resulting vector.",
                sampleInput: "v=[3,4], u=[1,0]",
                expected: "[3. 0.]",
                hint:
                    "Use (v @ u) / (u @ u) * u.",
                starter:
                    "import numpy as np\n" +
                    "v = np.array([3., 4.])\n" +
                    "u = np.array([1., 0.])\n" +
                    "# Project v onto u\n",
                solution:
                    "import numpy as np\n" +
                    "v = np.array([3., 4.])\n" +
                    "u = np.array([1., 0.])\n" +
                    "projection = (v @ u) / (u @ u) * u\n" +
                    "print(projection)",
                required: [
                    ["v @ u", "v@u", "np.dot(v"],
                    ["u @ u", "u@u", "np.dot(u"],
                    ["* u", "*u"],
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

            return (
                '<article class="aiml-problem-card' +
                (solved.has(index) ? " is-solved" : "") +
                '" data-problem="' +
                index +
                '">' +
                '<div class="aiml-problem-head">' +
                '<span class="aiml-problem-number">' +
                String(number).padStart(2, "0") +
                "</span><div><h3>" +
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
                'data-panel="hint" hidden><strong>Hint</strong><p>' +
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
                '<button type="button" data-action="reset">Reset</button>' +
                '<span class="aiml-check-result" data-result>' +
                "Write your solution, then check its structure." +
                "</span></div></div></article>"
            );
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
                        "Not complete yet. Recheck the required vector " +
                        "operation, formula and output.";
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
                    ? "Logic recognized — completed after viewing the " +
                      "model program. Score: 60/100."
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
                question: "What is the L2 norm of [3, 4]?",
                options: ["7", "5", "12", "1"],
                answer: 1,
                explanation:
                    "The Euclidean norm is √(3² + 4²) = √25 = 5."
            },
            {
                question:
                    "If x · y = 0 for two non-zero vectors, what is " +
                    "their relationship?",
                options: [
                    "Parallel",
                    "Identical",
                    "Orthogonal",
                    "Linearly dependent"
                ],
                answer: 2,
                explanation:
                    "A zero dot product means the angle is 90°, so " +
                    "the vectors are orthogonal."
            },
            {
                question: "Which matrix product is valid?",
                options: [
                    "(3, 4) @ (3, 2)",
                    "(3, 4) @ (4, 2)",
                    "(4, 3) @ (2, 4)",
                    "(2, 5) @ (3, 2)"
                ],
                answer: 1,
                explanation:
                    "The inner dimensions must match: (3 × 4)(4 × 2) " +
                    "produces shape (3 × 2)."
            },
            {
                question:
                    "What does det(A) = 0 imply for a square matrix?",
                options: [
                    "A is orthogonal",
                    "A has an inverse",
                    "A is singular and collapses a dimension",
                    "A is the identity"
                ],
                answer: 2,
                explanation:
                    "A zero determinant means the transformation loses " +
                    "dimension, so the matrix is not invertible."
            },
            {
                question:
                    "Why is cosine similarity useful for text embeddings?",
                options: [
                    "It compares direction while reducing the effect " +
                        "of magnitude",
                    "It always returns Euclidean distance",
                    "It requires binary vectors",
                    "It sorts each vector first"
                ],
                answer: 0,
                explanation:
                    "Cosine similarity normalizes by vector lengths and " +
                    "emphasizes directional alignment."
            },
            {
                question: "What does matrix rank measure?",
                options: [
                    "The total number of cells",
                    "The amount of independent row or column information",
                    "The largest value",
                    "The determinant only"
                ],
                answer: 1,
                explanation:
                    "Rank is the dimension of the row or column space " +
                    "and reveals independent information."
            },
            {
                question: "In Av = λv, what is λ?",
                options: [
                    "The inverse matrix",
                    "A singular vector only",
                    "The eigenvalue scaling v",
                    "The matrix rank"
                ],
                answer: 2,
                explanation:
                    "The eigenvalue λ states how strongly A scales the " +
                    "eigenvector v without changing its direction."
            },
            {
                question:
                    "What is the main value of truncated SVD?",
                options: [
                    "It converts every matrix to an identity",
                    "It keeps dominant components for low-rank approximation",
                    "It guarantees zero training loss",
                    "It removes every feature"
                ],
                answer: 1,
                explanation:
                    "Keeping the largest singular values captures dominant " +
                    "structure with fewer components."
            }
        ];

        container.innerHTML = questions.map(
            function (item, questionIndex) {
                return (
                    '<article class="aiml-quiz-question" ' +
                    'data-quiz-question="' +
                    questionIndex +
                    '"><strong>' +
                    (questionIndex + 1) +
                    ". " +
                    escapeHtml(item.question) +
                    '</strong><div class="aiml-quiz-options">' +
                    item.options.map(function (option, optionIndex) {
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
                            String.fromCharCode(65 + optionIndex) +
                            ". " +
                            escapeHtml(option) +
                            "</span></label>"
                        );
                    }).join("") +
                    '</div><div class="aiml-quiz-explanation" ' +
                    "hidden></div></article>"
                );
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
                    option.classList.remove("is-correct", "is-wrong");

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
                    (selected
                        ? "Your answer: " +
                          escapeHtml(
                              item.options[Number(selected.value)]
                          )
                        : "Your answer: Not attempted") +
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
                (answered < questions.length
                    ? " • " +
                      (questions.length - answered) +
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
                question:
                    "What is the difference between a scalar, vector, " +
                    "matrix and tensor?",
                answer:
                    "A scalar is one value, a vector has one axis, a " +
                    "matrix has two axes, and tensor is the general term " +
                    "for a multidimensional numerical array. Their shapes " +
                    "determine how they can interact."
            },
            {
                question:
                    "What does the dot product mean geometrically?",
                answer:
                    "The dot product measures directional alignment scaled " +
                    "by both vector lengths: x·y = ‖x‖‖y‖cosθ. It is " +
                    "positive for broadly aligned vectors, zero for " +
                    "orthogonal vectors and negative for opposing directions."
            },
            {
                question:
                    "What conditions make matrix multiplication valid?",
                answer:
                    "For A with shape (m, n) and B with shape (n, p), " +
                    "the inner dimensions must agree. The product has shape " +
                    "(m, p), and each cell is a row of A dotted with a " +
                    "column of B."
            },
            {
                question:
                    "What is the difference between elementwise and " +
                    "matrix multiplication?",
                answer:
                    "Elementwise multiplication combines values in " +
                    "corresponding positions and normally requires compatible " +
                    "shapes. Matrix multiplication performs row–column dot " +
                    "products and composes linear transformations."
            },
            {
                question:
                    "What does a zero determinant tell you?",
                answer:
                    "A zero determinant means a square matrix is singular: " +
                    "it collapses the space into a lower dimension, has " +
                    "dependent rows or columns, lacks an inverse and cannot " +
                    "uniquely solve every Ax=b system."
            },
            {
                question:
                    "What is rank, and why does it matter in machine learning?",
                answer:
                    "Rank counts independent directions in a matrix. Low " +
                    "rank reveals redundancy, affects whether systems have " +
                    "unique solutions and motivates compression methods such " +
                    "as truncated SVD and low-rank factorization."
            },
            {
                question:
                    "Why should code solve Ax=b instead of calculating " +
                    "inv(A) @ b?",
                answer:
                    "A direct linear-system solver is typically faster, " +
                    "uses less work and is more numerically stable than " +
                    "forming the inverse explicitly. The inverse is " +
                    "mathematically useful but often unnecessary in computation."
            },
            {
                question:
                    "What are eigenvectors and eigenvalues?",
                answer:
                    "For Av=λv, v is a non-zero direction that A does not " +
                    "rotate away from itself, and λ is its scaling factor. " +
                    "They are used in PCA, spectral methods and stability analysis."
            },
            {
                question:
                    "Explain SVD and one ML application.",
                answer:
                    "SVD writes A=UΣVᵀ, where U and V contain orthogonal " +
                    "directions and Σ contains their strengths. Truncating " +
                    "to dominant singular values creates low-rank " +
                    "approximations for compression, denoising and latent " +
                    "semantic analysis."
            },
            {
                question:
                    "How is a neural-network layer a linear algebra operation?",
                answer:
                    "A dense layer applies z=Wx+b: W linearly combines and " +
                    "transforms input features, b translates the result, " +
                    "and an activation then adds non-linearity. Batch inputs " +
                    "turn this into matrix–matrix multiplication."
            }
        ];

        container.innerHTML = questions.map(function (item, index) {
            return (
                '<article class="aiml-interview-item">' +
                '<div class="aiml-interview-question">' +
                "<span>" +
                (index + 1) +
                ".</span><strong>" +
                escapeHtml(item.question) +
                "</strong>" +
                '<button type="button" aria-expanded="false">' +
                "Show Answer</button></div>" +
                '<div class="aiml-interview-answer" hidden>' +
                escapeHtml(item.answer) +
                "</div></article>"
            );
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

            if (!link || link.getAttribute("href") === "#") {
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

    function initLevelThree() {
        initMatrixVisualizer();
        initProgramTracer();
        initProgrammingProblems();
        initQuiz();
        initInterviewQuestions();
        initSmoothLocalLinks();
    }

    if (document.readyState === "loading") {
        document.addEventListener(
            "DOMContentLoaded",
            initLevelThree
        );
    } else {
        initLevelThree();
    }
}());
