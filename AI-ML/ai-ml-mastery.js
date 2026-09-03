(() => {
    "use strict";

    const scriptSource = [...document.scripts]
        .map((script) => script.getAttribute("src") || "")
        .find((src) => /ai-ml-level-0[1-7]\.js/.test(src)) || "";
    const levelMatch = scriptSource.match(/level-(\d{2})/);
    const level = levelMatch ? Number(levelMatch[1]) : 0;
    if (!level) return;

    const escapeHTML = (value) => String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

    function number(value, fallback = 0) {
        const parsed = Number(value);
        return Number.isFinite(parsed) ? parsed : fallback;
    }

    function fixed(value, digits = 2) {
        return Number(value).toFixed(digits);
    }

    function clamp(value, minimum, maximum) {
        return Math.min(maximum, Math.max(minimum, value));
    }

    function labShell(title, description) {
        const visualizer = document.querySelector(".aiml-premium-interactive");
        if (!visualizer || visualizer.querySelector(".cb-experiment-lab")) return null;

        const lab = document.createElement("div");
        lab.className = "cb-experiment-lab";
        lab.innerHTML = `
            <div class="cb-lab-heading">
                <div>
                    <span>EXPERIMENT MODE • CHANGE VALUES AND OBSERVE</span>
                    <h3>${escapeHTML(title)}</h3>
                    <p>${escapeHTML(description)}</p>
                </div>
                <strong><i></i> LIVE CALCULATION</strong>
            </div>
            <div class="cb-lab-body"></div>`;

        visualizer.append(lab);
        return lab.querySelector(".cb-lab-body");
    }

    function metric(label, value, className = "") {
        return `
            <article class="cb-live-metric ${className}">
                <span>${escapeHTML(label)}</span>
                <strong>${escapeHTML(value)}</strong>
            </article>`;
    }

    function buildFoundationLab() {
        const root = labShell(
            "Machine-Learning Decision Laboratory",
            "Change the problem, data quality and model complexity. Compare training performance with unseen-data performance before deciding whether the system is ready."
        );

        if (!root) return;

        root.innerHTML = `
            <div class="cb-lab-controls">
                <label>Problem to solve
                    <select id="cb1Problem">
                        <option value="spam">Spam classification</option>
                        <option value="price">House-price regression</option>
                        <option value="segment">Customer segmentation</option>
                    </select>
                </label>

                <label>Data quality <output id="cb1QualityValue">75%</output>
                    <input id="cb1Quality" type="range" min="25" max="100" value="75">
                </label>

                <label>Model complexity <output id="cb1ComplexityValue">5 / 10</output>
                    <input id="cb1Complexity" type="range" min="1" max="10" value="5">
                </label>

                <label>Test evidence <output id="cb1TestValue">20%</output>
                    <input id="cb1Test" type="range" min="10" max="40" value="20">
                </label>

                <div class="cb-lab-presets">
                    <button type="button" data-cb1="underfit">Underfit case</button>
                    <button type="button" data-cb1="balanced">Balanced case</button>
                    <button type="button" data-cb1="overfit">Overfit case</button>
                </div>
            </div>

            <div class="cb-lab-workspace">
                <div class="cb-score-chart"
                     aria-label="Training and validation score comparison">
                    <div>
                        <span>Training</span>
                        <i id="cb1TrainBar"></i>
                        <strong id="cb1TrainText"></strong>
                    </div>
                    <div>
                        <span>Validation</span>
                        <i id="cb1ValidationBar"></i>
                        <strong id="cb1ValidationText"></strong>
                    </div>
                    <div>
                        <span>Baseline</span>
                        <i id="cb1BaselineBar"></i>
                        <strong id="cb1BaselineText"></strong>
                    </div>
                </div>

                <div class="cb-live-metrics" id="cb1Metrics"></div>
                <div class="cb-workflow-status" id="cb1Workflow"></div>
                <p class="cb-lab-explanation" id="cb1Explanation"></p>
            </div>`;

        const problem = root.querySelector("#cb1Problem");
        const quality = root.querySelector("#cb1Quality");
        const complexity = root.querySelector("#cb1Complexity");
        const test = root.querySelector("#cb1Test");

        const problemRules = {
            spam: {
                baseline: 62,
                optimum: 5,
                difficulty: 1,
                metric: "F1 score",
                paradigm: "Supervised classification"
            },
            price: {
                baseline: 48,
                optimum: 4,
                difficulty: 2,
                metric: "Explained accuracy",
                paradigm: "Supervised regression"
            },
            segment: {
                baseline: 35,
                optimum: 6,
                difficulty: 3,
                metric: "Cluster quality",
                paradigm: "Unsupervised learning"
            }
        };

        function update() {
            const rule = problemRules[problem.value];
            const q = number(quality.value);
            const c = number(complexity.value);
            const t = number(test.value);

            const train = clamp(
                48 + q * 0.36 + c * 3.2 - rule.difficulty * 2,
                20,
                99
            );

            const lowComplexity = Math.max(0, rule.optimum - c) * 4.2;
            const overfit =
                Math.max(0, c - rule.optimum) *
                (3.4 + (100 - q) / 25);
            const evidencePenalty = Math.max(0, 20 - t) * 0.18;

            const validation = clamp(
                train -
                lowComplexity -
                overfit -
                (100 - q) * 0.12 -
                evidencePenalty,
                12,
                97
            );

            const gap = train - validation;

            const readiness =
                validation >= rule.baseline + 8 &&
                gap < 10 &&
                q >= 60 &&
                t >= 15;

            root.querySelector("#cb1QualityValue").textContent = `${q}%`;
            root.querySelector("#cb1ComplexityValue").textContent =
                `${c} / 10`;
            root.querySelector("#cb1TestValue").textContent = `${t}%`;

            [
                ["Train", train],
                ["Validation", validation],
                ["Baseline", rule.baseline]
            ].forEach(([name, value]) => {
                root.querySelector(`#cb1${name}Bar`).style.width =
                    `${value}%`;
                root.querySelector(`#cb1${name}Text`).textContent =
                    `${fixed(value, 1)}%`;
            });

            root.querySelector("#cb1Metrics").innerHTML =
                metric("Learning paradigm", rule.paradigm) +
                metric(rule.metric, `${fixed(validation, 1)}%`) +
                metric(
                    "Generalization gap",
                    `${fixed(gap, 1)} points`,
                    gap > 10 ? "danger" : "good"
                ) +
                metric(
                    "Decision",
                    readiness
                        ? "Ready for final test"
                        : "Improve before testing",
                    readiness ? "good" : "warning"
                );

            const stages = [
                ["1. Frame", true],
                ["2. Inspect data", q >= 55],
                ["3. Protect test", t >= 15],
                ["4. Train", true],
                ["5. Generalize", gap < 10],
                ["6. Deploy", readiness]
            ];

            root.querySelector("#cb1Workflow").innerHTML = stages
                .map(([name, done]) => `
                    <span class="${done ? "done" : "pending"}">
                        ${done ? "✓" : "!"} ${name}
                    </span>`)
                .join("");

            let message =
                "The model is balanced: it improves over the baseline and training performance is close to validation performance.";

            if (c < rule.optimum) {
                message =
                    "The model is too simple for this problem. Both scores are limited: increase useful capacity or improve features.";
            } else if (gap >= 10) {
                message =
                    "Training performance is much higher than validation performance. This is an overfitting warning—reduce complexity, regularize or collect better data.";
            } else if (q < 60) {
                message =
                    "Model tuning cannot compensate for unreliable data. Improve labels, missing-value handling and representation before final evaluation.";
            } else if (t < 15) {
                message =
                    "The protected evidence is small, so the validation estimate is unstable. Reserve a more credible evaluation set.";
            }

            root.querySelector("#cb1Explanation").textContent = message;
        }

        root.addEventListener("input", update);

        root.querySelectorAll("[data-cb1]").forEach((button) => {
            button.addEventListener("click", () => {
                const presets = {
                    underfit: [72, 1, 20],
                    balanced: [88, 5, 20],
                    overfit: [55, 10, 10]
                };

                const [q, c, t] = presets[button.dataset.cb1];
                quality.value = q;
                complexity.value = c;
                test.value = t;
                update();
            });
        });

        update();
    }

    function parseVector(text) {
        const values = text
            .split(/[\s,]+/)
            .filter(Boolean)
            .map(Number);

        return values.every(Number.isFinite) ? values : [];
    }

    function buildNumPyLab() {
        const root = labShell(
            "Live NumPy Array Laboratory",
            "Edit both vectors and choose an operation. The result, shape reasoning and element-level calculation update immediately."
        );

        if (!root) return;

        root.innerHTML = `
            <div class="cb-lab-controls">
                <label>Vector A
                    <input id="cb2A" value="2, 4, 6, 8"
                           inputmode="decimal">
                </label>

                <label>Vector B
                    <input id="cb2B" value="1, 3, 5, 7"
                           inputmode="decimal">
                </label>

                <label>Operation
                    <select id="cb2Operation">
                        <option value="add">Elementwise addition</option>
                        <option value="multiply">
                            Elementwise multiplication
                        </option>
                        <option value="dot">Dot product</option>
                        <option value="standardize">Standardize A</option>
                        <option value="mask">
                            A values greater than mean
                        </option>
                    </select>
                </label>

                <div class="cb-lab-presets">
                    <button type="button" id="cb2Valid">
                        Compatible vectors
                    </button>
                    <button type="button" id="cb2Invalid">
                        Shape error example
                    </button>
                </div>
            </div>

            <div class="cb-lab-workspace">
                <div class="cb-array-view">
                    <div>
                        <span>A • <b id="cb2AShape"></b></span>
                        <div id="cb2ACells"></div>
                    </div>
                    <div>
                        <span>B • <b id="cb2BShape"></b></span>
                        <div id="cb2BCells"></div>
                    </div>
                </div>

                <div class="cb-formula-line">
                    <span>CALCULATION</span>
                    <code id="cb2Formula"></code>
                </div>

                <div class="cb-result-panel">
                    <span>RESULT</span>
                    <strong id="cb2Result"></strong>
                    <small id="cb2ResultShape"></small>
                </div>

                <p class="cb-lab-explanation" id="cb2Explanation"></p>
            </div>`;

        const aInput = root.querySelector("#cb2A");
        const bInput = root.querySelector("#cb2B");
        const operation = root.querySelector("#cb2Operation");

        const cells = (values) => values
            .map((value, index) => `
                <i>
                    <small>${index}</small>
                    ${escapeHTML(value)}
                </i>`)
            .join("");

        function update() {
            const a = parseVector(aInput.value);
            const b = parseVector(bInput.value);

            root.querySelector("#cb2AShape").textContent =
                `shape (${a.length},)`;
            root.querySelector("#cb2BShape").textContent =
                `shape (${b.length},)`;

            root.querySelector("#cb2ACells").innerHTML = cells(a);
            root.querySelector("#cb2BCells").innerHTML = cells(b);

            if (!a.length || !b.length) {
                root.querySelector("#cb2Result").textContent =
                    "Enter comma-separated numbers.";
                root.querySelector("#cb2ResultShape").textContent = "";
                return;
            }

            let result = [];
            let formula = "";
            let explanation = "";

            if (
                ["add", "multiply", "dot"].includes(operation.value) &&
                a.length !== b.length
            ) {
                root.querySelector("#cb2Formula").textContent =
                    `(${a.length},) and (${b.length},) are incompatible`;
                root.querySelector("#cb2Result").textContent = "ShapeError";
                root.querySelector("#cb2ResultShape").textContent =
                    "Elementwise and dot operations need equal vector lengths.";
                root.querySelector("#cb2Explanation").textContent =
                    "NumPy aligns one-dimensional arrays by their only axis. These lengths are unequal and neither length is 1, so broadcasting cannot resolve them.";
                return;
            }

            if (operation.value === "add") {
                result = a.map((value, i) => value + b[i]);
                formula = "result[i] = A[i] + B[i]";
                explanation =
                    "Corresponding positions are added. The output keeps the same one-dimensional shape.";
            } else if (operation.value === "multiply") {
                result = a.map((value, i) => value * b[i]);
                formula = "result[i] = A[i] × B[i]";
                explanation =
                    "This is elementwise multiplication, not a dot product, because the individual products are retained.";
            } else if (operation.value === "dot") {
                result = a.reduce(
                    (sum, value, i) => sum + value * b[i],
                    0
                );
                formula = a
                    .map((value, i) => `${value}×${b[i]}`)
                    .join(" + ");
                explanation =
                    "The elementwise products are reduced by addition, so the result is one scalar.";
            } else if (operation.value === "standardize") {
                const mean =
                    a.reduce((sum, value) => sum + value, 0) / a.length;

                const std = Math.sqrt(
                    a.reduce(
                        (sum, value) => sum + (value - mean) ** 2,
                        0
                    ) / a.length
                ) || 1;

                result = a.map((value) =>
                    Number(((value - mean) / std).toFixed(3))
                );

                formula = `z = (x − ${fixed(mean)}) / ${fixed(std)}`;
                explanation =
                    "The transformed vector has mean approximately 0 and standard deviation approximately 1. In ML, mean and standard deviation must be fitted on training data only.";
            } else {
                const mean =
                    a.reduce((sum, value) => sum + value, 0) / a.length;

                result = a.filter((value) => value > mean);
                formula =
                    `A[A > mean(A)] where mean = ${fixed(mean)}`;
                explanation =
                    "The comparison creates a Boolean mask, then advanced indexing returns only positions where the mask is true.";
            }

            root.querySelector("#cb2Formula").textContent = formula;

            root.querySelector("#cb2Result").textContent =
                Array.isArray(result)
                    ? `[${result.join(", ")}]`
                    : fixed(result, 3);

            root.querySelector("#cb2ResultShape").textContent =
                Array.isArray(result)
                    ? `shape (${result.length},)`
                    : "scalar result • shape ()";

            root.querySelector("#cb2Explanation").textContent =
                explanation;
        }

        root.addEventListener("input", update);

        root.querySelector("#cb2Valid").addEventListener("click", () => {
            aInput.value = "2, 4, 6, 8";
            bInput.value = "1, 3, 5, 7";
            update();
        });

        root.querySelector("#cb2Invalid").addEventListener("click", () => {
            aInput.value = "1, 2, 3";
            bInput.value = "10, 20";
            operation.value = "add";
            update();
        });

        update();
    }

    function canvasContext(canvas) {
        const cssWidth = Math.max(280, canvas.clientWidth || 720);
        const cssHeight = cssWidth < 520 ? 300 : 340;
        const ratio = window.devicePixelRatio || 1;

        canvas.style.height = `${cssHeight}px`;
        canvas.width = Math.round(cssWidth * ratio);
        canvas.height = Math.round(cssHeight * ratio);

        const context = canvas.getContext("2d");
        context.setTransform(ratio, 0, 0, ratio, 0, 0);

        return {
            context,
            width: cssWidth,
            height: cssHeight
        };
    }

    function drawArrow(
        context,
        originX,
        originY,
        endX,
        endY,
        color,
        label
    ) {
        const angle = Math.atan2(endY - originY, endX - originX);

        context.strokeStyle = color;
        context.fillStyle = color;
        context.lineWidth = 4;

        context.beginPath();
        context.moveTo(originX, originY);
        context.lineTo(endX, endY);
        context.stroke();

        context.beginPath();
        context.moveTo(endX, endY);
        context.lineTo(
            endX - 12 * Math.cos(angle - Math.PI / 6),
            endY - 12 * Math.sin(angle - Math.PI / 6)
        );
        context.lineTo(
            endX - 12 * Math.cos(angle + Math.PI / 6),
            endY - 12 * Math.sin(angle + Math.PI / 6)
        );
        context.closePath();
        context.fill();

        context.font = "700 15px system-ui";
        context.fillText(label, endX + 8, endY - 8);
    }

    function buildLinearAlgebraLab() {
        const root = labShell(
            "Interactive Matrix Transformation Plane",
            "Edit matrix A and vector v. The plane redraws v and Av, while every row–vector dot product is shown numerically."
        );

        if (!root) return;

        root.innerHTML = `
            <div class="cb-lab-controls cb-matrix-controls">
                <fieldset>
                    <legend>Matrix A</legend>
                    <div class="cb-number-grid">
                        <input id="cb3a" type="number"
                               value="2" step="0.1">
                        <input id="cb3b" type="number"
                               value="1" step="0.1">
                        <input id="cb3c" type="number"
                               value="1" step="0.1">
                        <input id="cb3d" type="number"
                               value="2" step="0.1">
                    </div>
                </fieldset>

                <fieldset>
                    <legend>Vector v</legend>
                    <div class="cb-number-grid">
                        <input id="cb3x" type="number"
                               value="2" step="0.1">
                        <input id="cb3y" type="number"
                               value="1" step="0.1">
                    </div>
                </fieldset>

                <div class="cb-lab-presets">
                    <button type="button" data-cb3="stretch">
                        Stretch
                    </button>
                    <button type="button" data-cb3="rotate">
                        Rotate 90°
                    </button>
                    <button type="button" data-cb3="shear">
                        Shear
                    </button>
                    <button type="button" data-cb3="reflect">
                        Reflect
                    </button>
                </div>
            </div>

            <div class="cb-lab-workspace">
                <canvas id="cb3Canvas"
                        class="cb-lab-canvas"
                        aria-label="Vector and transformed vector coordinate plane">
                </canvas>

                <div class="cb-live-metrics" id="cb3Metrics"></div>

                <div class="cb-formula-line">
                    <span>ROW CALCULATIONS</span>
                    <code id="cb3Formula"></code>
                </div>

                <p class="cb-lab-explanation" id="cb3Explanation"></p>
            </div>`;

        const inputIds = [
            "cb3a",
            "cb3b",
            "cb3c",
            "cb3d",
            "cb3x",
            "cb3y"
        ];

        function update() {
            const [a, b, c, d, x, y] = inputIds.map((id) =>
                number(root.querySelector(`#${id}`).value)
            );

            const tx = a * x + b * y;
            const ty = c * x + d * y;
            const determinant = a * d - b * c;

            const {context, width, height} =
                canvasContext(root.querySelector("#cb3Canvas"));

            context.clearRect(0, 0, width, height);
            context.fillStyle = "#071b30";
            context.fillRect(0, 0, width, height);

            const originX = width / 2;
            const originY = height / 2;

            const maxCoordinate =
                Math.max(
                    4,
                    Math.abs(x),
                    Math.abs(y),
                    Math.abs(tx),
                    Math.abs(ty)
                ) * 1.25;

            const scale =
                Math.min(width, height) / (2 * maxCoordinate);

            context.strokeStyle = "rgba(125, 211, 252, .12)";
            context.lineWidth = 1;

            for (
                let i = -Math.ceil(maxCoordinate);
                i <= Math.ceil(maxCoordinate);
                i += 1
            ) {
                context.beginPath();
                context.moveTo(originX + i * scale, 0);
                context.lineTo(originX + i * scale, height);
                context.stroke();

                context.beginPath();
                context.moveTo(0, originY + i * scale);
                context.lineTo(width, originY + i * scale);
                context.stroke();
            }

            context.strokeStyle = "#7890aa";
            context.lineWidth = 2;

            context.beginPath();
            context.moveTo(18, originY);
            context.lineTo(width - 18, originY);
            context.stroke();

            context.beginPath();
            context.moveTo(originX, 18);
            context.lineTo(originX, height - 18);
            context.stroke();

            drawArrow(
                context,
                originX,
                originY,
                originX + x * scale,
                originY - y * scale,
                "#39bdf8",
                "v"
            );

            drawArrow(
                context,
                originX,
                originY,
                originX + tx * scale,
                originY - ty * scale,
                "#f6cc35",
                "Av"
            );

            root.querySelector("#cb3Metrics").innerHTML =
                metric(
                    "Input vector",
                    `[${fixed(x, 1)}, ${fixed(y, 1)}]`
                ) +
                metric(
                    "Transformed vector",
                    `[${fixed(tx, 2)}, ${fixed(ty, 2)}]`,
                    "good"
                ) +
                metric(
                    "det(A)",
                    fixed(determinant, 2),
                    Math.abs(determinant) < 0.0001
                        ? "danger"
                        : ""
                ) +
                metric(
                    "Area effect",
                    Math.abs(determinant) < 0.0001
                        ? "Collapsed"
                        : `${fixed(Math.abs(determinant), 2)}×`
                );

            root.querySelector("#cb3Formula").textContent =
                `row 1: ${a}×${x} + ${b}×${y} = ${fixed(tx, 2)}  •  ` +
                `row 2: ${c}×${x} + ${d}×${y} = ${fixed(ty, 2)}`;

            root.querySelector("#cb3Explanation").textContent =
                Math.abs(determinant) < 0.0001
                    ? "The determinant is zero, so the transformation collapses the plane into a lower-dimensional line or point. A unique inverse does not exist."
                    : `${determinant < 0
                        ? "Orientation is reversed."
                        : "Orientation is preserved."
                    } The absolute determinant tells how every area is scaled.`;
        }

        root.addEventListener("input", update);

        root.querySelectorAll("[data-cb3]").forEach((button) => {
            button.addEventListener("click", () => {
                const presets = {
                    stretch: [2, 0, 0, 1.5],
                    rotate: [0, -1, 1, 0],
                    shear: [1, 1, 0, 1],
                    reflect: [-1, 0, 0, 1]
                };

                presets[button.dataset.cb3].forEach((value, index) => {
                    root.querySelector(
                        `#${inputIds[index]}`
                    ).value = value;
                });

                update();
            });
        });

        window.addEventListener("resize", update, {passive: true});
        update();
    }

    function buildProbabilityLab() {
        const root = labShell(
            "Bayes Evidence and Base-Rate Simulator",
            "Adjust prevalence, sensitivity and specificity. Observe real counts in 1,000 cases and see why a positive result is not automatically the posterior probability."
        );

        if (!root) return;

        root.innerHTML = `
            <div class="cb-lab-controls">
                <label>Prevalence
                    <output id="cb4PrevValue">5%</output>
                    <input id="cb4Prev" type="range"
                           min="1" max="50" value="5">
                </label>

                <label>Sensitivity
                    <output id="cb4SensValue">90%</output>
                    <input id="cb4Sens" type="range"
                           min="50" max="100" value="90">
                </label>

                <label>Specificity
                    <output id="cb4SpecValue">90%</output>
                    <input id="cb4Spec" type="range"
                           min="50" max="100" value="90">
                </label>

                <div class="cb-lab-presets">
                    <button type="button" data-cb4="rare">
                        Rare condition
                    </button>
                    <button type="button" data-cb4="accurate">
                        Highly accurate test
                    </button>
                    <button type="button" data-cb4="common">
                        Common outcome
                    </button>
                </div>
            </div>

            <div class="cb-lab-workspace">
                <div class="cb-bayes-grid" id="cb4Grid"></div>
                <div class="cb-live-metrics" id="cb4Metrics"></div>

                <div class="cb-formula-line">
                    <span>BAYES CALCULATION</span>
                    <code id="cb4Formula"></code>
                </div>

                <p class="cb-lab-explanation" id="cb4Explanation"></p>
            </div>`;

        const prev = root.querySelector("#cb4Prev");
        const sens = root.querySelector("#cb4Sens");
        const spec = root.querySelector("#cb4Spec");

        function update() {
            const p = number(prev.value) / 100;
            const se = number(sens.value) / 100;
            const sp = number(spec.value) / 100;

            const affected = 1000 * p;
            const healthy = 1000 - affected;
            const tp = affected * se;
            const fn = affected - tp;
            const tn = healthy * sp;
            const fp = healthy - tn;

            const posterior = tp / (tp + fp);
            const negativePosterior = tn / (tn + fn);

            root.querySelector("#cb4PrevValue").textContent =
                `${prev.value}%`;
            root.querySelector("#cb4SensValue").textContent =
                `${sens.value}%`;
            root.querySelector("#cb4SpecValue").textContent =
                `${spec.value}%`;

            root.querySelector("#cb4Grid").innerHTML = `
                <article class="tp">
                    <span>TRUE POSITIVE</span>
                    <strong>${fixed(tp, 0)}</strong>
                    <p>Affected and test positive</p>
                </article>
                <article class="fp">
                    <span>FALSE POSITIVE</span>
                    <strong>${fixed(fp, 0)}</strong>
                    <p>Healthy but test positive</p>
                </article>
                <article class="fn">
                    <span>FALSE NEGATIVE</span>
                    <strong>${fixed(fn, 0)}</strong>
                    <p>Affected but test negative</p>
                </article>
                <article class="tn">
                    <span>TRUE NEGATIVE</span>
                    <strong>${fixed(tn, 0)}</strong>
                    <p>Healthy and test negative</p>
                </article>`;

            root.querySelector("#cb4Metrics").innerHTML =
                metric(
                    "P(affected | positive)",
                    `${fixed(posterior * 100, 1)}%`,
                    posterior >= 0.7 ? "good" : "warning"
                ) +
                metric(
                    "P(healthy | negative)",
                    `${fixed(negativePosterior * 100, 1)}%`
                ) +
                metric("Positive results", fixed(tp + fp, 0)) +
                metric(
                    "False alarms",
                    fixed(fp, 0),
                    fp > tp ? "danger" : ""
                );

            root.querySelector("#cb4Formula").textContent =
                `${fixed(tp, 0)} true positives ÷ ` +
                `(${fixed(tp, 0)} TP + ${fixed(fp, 0)} FP) = ` +
                `${fixed(posterior * 100, 1)}%`;

            root.querySelector("#cb4Explanation").textContent =
                fp > tp
                    ? "False positives outnumber true positives because the condition is rare relative to the healthy population. This is the base-rate effect."
                    : "Most positive results are true positives under these settings, but the posterior still depends jointly on prevalence and test behaviour.";
        }

        root.addEventListener("input", update);

        root.querySelectorAll("[data-cb4]").forEach((button) => {
            button.addEventListener("click", () => {
                const presets = {
                    rare: [2, 90, 90],
                    accurate: [5, 98, 99],
                    common: [35, 90, 90]
                };

                [
                    prev.value,
                    sens.value,
                    spec.value
                ] = presets[button.dataset.cb4];

                update();
            });
        });

        update();
    }

    function buildDataLab() {
        const root = labShell(
            "Model-Ready Data Pipeline Laboratory",
            "Transform a deliberately dirty training table. Compare raw and processed values while the lab warns about leakage-prone choices."
        );

        if (!root) return;

        const rawRows = [
            {age: 22, income: 28000, city: "HYD", target: 0},
            {age: 35, income: null, city: "hyd", target: 1},
            {
                age: 41,
                income: 52000,
                city: "Vijayawada",
                target: 0
            },
            {age: 29, income: 999999, city: "HYD ", target: 1},
            {
                age: null,
                income: 46000,
                city: "vijayawada",
                target: 0
            }
        ];

        root.innerHTML = `
            <div class="cb-lab-controls">
                <label>Numeric imputation
                    <select id="cb5Impute">
                        <option value="median">Median</option>
                        <option value="mean">Mean</option>
                        <option value="zero">Constant zero</option>
                    </select>
                </label>

                <label>Outlier handling
                    <select id="cb5Outlier">
                        <option value="keep">Investigate and keep</option>
                        <option value="cap">Cap at 95,000</option>
                    </select>
                </label>

                <label>Scaling
                    <select id="cb5Scale">
                        <option value="standard">Standardize</option>
                        <option value="minmax">Min–max</option>
                        <option value="none">No scaling</option>
                    </select>
                </label>

                <label>Category encoding
                    <select id="cb5Encode">
                        <option value="onehot">One-hot</option>
                        <option value="ordinal">Ordinal IDs</option>
                    </select>
                </label>

                <label class="cb-check-label">
                    <input id="cb5Leak" type="checkbox">
                    Fit preprocessing before the split
                </label>

                <button class="cb-run-button"
                        id="cb5Run"
                        type="button">
                    ▶ Run Pipeline
                </button>
            </div>

            <div class="cb-lab-workspace">
                <div class="cb-table-scroll">
                    <table class="cb-data-table">
                        <caption>Raw training sample</caption>
                        <thead>
                            <tr>
                                <th>Age</th>
                                <th>Income</th>
                                <th>City</th>
                                <th>Target</th>
                            </tr>
                        </thead>
                        <tbody id="cb5Raw"></tbody>
                    </table>
                </div>

                <div class="cb-pipeline-strip"
                     id="cb5Pipeline"></div>

                <div class="cb-table-scroll">
                    <table class="cb-data-table">
                        <caption>Processed feature matrix</caption>
                        <thead id="cb5Head"></thead>
                        <tbody id="cb5Processed"></tbody>
                    </table>
                </div>

                <div class="cb-live-metrics" id="cb5Metrics"></div>
                <p class="cb-lab-explanation" id="cb5Explanation"></p>
            </div>`;

        root.querySelector("#cb5Raw").innerHTML = rawRows
            .map((row) => `
                <tr>
                    <td>${row.age ?? "Missing"}</td>
                    <td>${row.income ?? "Missing"}</td>
                    <td>${escapeHTML(row.city)}</td>
                    <td>${row.target}</td>
                </tr>`)
            .join("");

        function statistic(values, kind) {
            const sorted = [...values].sort((a, b) => a - b);

            if (kind === "mean") {
                return values.reduce(
                    (sum, value) => sum + value,
                    0
                ) / values.length;
            }

            if (kind === "zero") return 0;
            return sorted[Math.floor(sorted.length / 2)];
        }

        function run() {
            const impute =
                root.querySelector("#cb5Impute").value;

            const cap =
                root.querySelector("#cb5Outlier").value === "cap";

            const scale =
                root.querySelector("#cb5Scale").value;

            const encoding =
                root.querySelector("#cb5Encode").value;

            const leakage =
                root.querySelector("#cb5Leak").checked;

            const ages = rawRows
                .map((row) => row.age)
                .filter((value) => value !== null);

            const incomes = rawRows
                .map((row) => row.income)
                .filter((value) => value !== null)
                .map((value) =>
                    cap ? Math.min(value, 95000) : value
                );

            const ageFill = statistic(ages, impute);
            const incomeFill = statistic(incomes, impute);

            const normalizeCity = (city) =>
                city.trim().toLowerCase() === "hyd"
                    ? "Hyderabad"
                    : "Vijayawada";

            const rows = rawRows.map((row) => ({
                age: row.age ?? ageFill,
                income:
                    row.income === null
                        ? incomeFill
                        : cap
                            ? Math.min(row.income, 95000)
                            : row.income,
                city: normalizeCity(row.city)
            }));

            const scaleColumn = (values) => {
                if (scale === "none") return values;

                const min = Math.min(...values);
                const max = Math.max(...values);

                const mean =
                    values.reduce(
                        (sum, value) => sum + value,
                        0
                    ) / values.length;

                const std = Math.sqrt(
                    values.reduce(
                        (sum, value) =>
                            sum + (value - mean) ** 2,
                        0
                    ) / values.length
                ) || 1;

                return values.map((value) =>
                    scale === "minmax"
                        ? (value - min) / ((max - min) || 1)
                        : (value - mean) / std
                );
            };

            const scaledAge = scaleColumn(
                rows.map((row) => row.age)
            );

            const scaledIncome = scaleColumn(
                rows.map((row) => row.income)
            );

            const headers =
                encoding === "onehot"
                    ? ["Age", "Income", "City_HYD", "City_VJA"]
                    : ["Age", "Income", "City_ID"];

            const matrix = rows.map((row, index) => {
                const base = [
                    fixed(scaledAge[index], 2),
                    fixed(scaledIncome[index], 2)
                ];

                return encoding === "onehot"
                    ? [
                        ...base,
                        row.city === "Hyderabad" ? 1 : 0,
                        row.city === "Vijayawada" ? 1 : 0
                    ]
                    : [
                        ...base,
                        row.city === "Hyderabad" ? 0 : 1
                    ];
            });

            root.querySelector("#cb5Head").innerHTML = `
                <tr>
                    ${headers
                        .map((head) => `<th>${head}</th>`)
                        .join("")}
                </tr>`;

            root.querySelector("#cb5Processed").innerHTML =
                matrix.map((row) => `
                    <tr>
                        ${row
                            .map((value) => `<td>${value}</td>`)
                            .join("")}
                    </tr>`)
                .join("");

            const steps = [
                "Split",
                `Impute: ${impute}`,
                cap ? "Cap outlier" : "Keep outlier",
                `Encode: ${encoding}`,
                `Scale: ${scale}`,
                "Validate"
            ];

            root.querySelector("#cb5Pipeline").innerHTML =
                steps.map((step, index) => `
                    <span class="${
                        leakage && index === 0
                            ? "failed"
                            : "done"
                    }">
                        ${index + 1}. ${escapeHTML(step)}
                    </span>`)
                .join("");

            root.querySelector("#cb5Metrics").innerHTML =
                metric("Missing after pipeline", "0") +
                metric(
                    "Output shape",
                    `5 × ${headers.length}`
                ) +
                metric(
                    "Income range",
                    `${fixed(Math.min(...incomes), 0)}–` +
                    `${fixed(Math.max(...incomes), 0)}`
                ) +
                metric(
                    "Leakage check",
                    leakage ? "FAILED" : "PASSED",
                    leakage ? "danger" : "good"
                );

            root.querySelector("#cb5Explanation").textContent =
                leakage
                    ? "Leakage detected: fitting preprocessing before the split lets validation or test values influence learned statistics and category vocabularies. Split first and fit only on training rows."
                    : `The pipeline learned age=${fixed(ageFill, 1)} and income=${fixed(incomeFill, 1)} as imputation values from training data, normalized category spelling, then produced a numeric matrix.`;
        }

        root.querySelector("#cb5Run").addEventListener("click", run);
        root.addEventListener("change", run);
        run();
    }

    function drawRegression(canvas, points, weight, bias) {
        const {context, width, height} = canvasContext(canvas);
        const pad = 42;
        const xMax = 6;
        const yMax = 13;

        const sx = (x) =>
            pad + (x / xMax) * (width - 2 * pad);

        const sy = (y) =>
            height - pad - (y / yMax) * (height - 2 * pad);

        context.fillStyle = "#071b30";
        context.fillRect(0, 0, width, height);

        context.strokeStyle = "#7890aa";
        context.lineWidth = 2;
        context.beginPath();
        context.moveTo(pad, 18);
        context.lineTo(pad, height - pad);
        context.lineTo(width - 18, height - pad);
        context.stroke();

        points.forEach(([x, y]) => {
            const prediction = weight * x + bias;

            context.strokeStyle = "rgba(246, 204, 53, .65)";
            context.lineWidth = 2;
            context.beginPath();
            context.moveTo(sx(x), sy(y));
            context.lineTo(sx(x), sy(prediction));
            context.stroke();

            context.fillStyle = "#39bdf8";
            context.beginPath();
            context.arc(sx(x), sy(y), 7, 0, Math.PI * 2);
            context.fill();
        });

        context.strokeStyle = "#f6cc35";
        context.lineWidth = 4;
        context.beginPath();
        context.moveTo(sx(0), sy(bias));
        context.lineTo(sx(6), sy(weight * 6 + bias));
        context.stroke();

        context.fillStyle = "#dcecff";
        context.font = "600 13px system-ui";
        context.fillText("x", width - 25, height - 50);
        context.fillText("y", 22, 24);
    }

    function buildRegressionLab() {
        const root = labShell(
            "Gradient-Descent Regression Laboratory",
            "Control the line manually or execute real gradient updates. Residuals, MSE, gradients and the loss history recompute after every step."
        );

        if (!root) return;

        const points = [
            [1, 3],
            [2, 5],
            [3, 7],
            [4, 9],
            [5, 11]
        ];

        let history = [];
        let timer = null;
        let finished = false;

        root.innerHTML = `
            <div class="cb-lab-controls">
                <label>Weight w
                    <output id="cb6WValue">0.00</output>
                    <input id="cb6W" type="range"
                           min="-1" max="4"
                           step="0.05" value="0">
                </label>

                <label>Bias b
                    <output id="cb6BValue">0.00</output>
                    <input id="cb6B" type="range"
                           min="-2" max="5"
                           step="0.05" value="0">
                </label>

                <label>Learning rate α
                    <output id="cb6RateValue">0.05</output>
                    <input id="cb6Rate" type="range"
                           min="0.005" max="0.12"
                           step="0.005" value="0.05">
                </label>

                <div class="cb-lab-presets">
                    <button type="button" id="cb6Step">
                        One gradient step
                    </button>
                    <button type="button" id="cb6Train">
                        ▶ Auto train
                    </button>
                    <button type="button"
                            id="cb6Pause"
                            disabled>
                        Ⅱ Pause
                    </button>
                    <button type="button" id="cb6Reset">
                        ↻ Reset
                    </button>
                </div>
            </div>

            <div class="cb-lab-workspace">
                <canvas id="cb6Canvas"
                        class="cb-lab-canvas"
                        aria-label="Regression points, fitted line and residuals">
                </canvas>

                <div class="cb-live-metrics" id="cb6Metrics"></div>

                <div class="cb-loss-history">
                    <span>LOSS HISTORY</span>
                    <div id="cb6LossBars"></div>
                </div>

                <div class="cb-formula-line">
                    <span>UPDATE</span>
                    <code id="cb6Formula"></code>
                </div>

                <p class="cb-lab-explanation" id="cb6Explanation"></p>
            </div>`;

        const wInput = root.querySelector("#cb6W");
        const bInput = root.querySelector("#cb6B");
        const rateInput = root.querySelector("#cb6Rate");

        function state() {
            const w = number(wInput.value);
            const b = number(bInput.value);

            const predictions = points.map(([x]) => w * x + b);

            const errors = predictions.map(
                (prediction, i) => prediction - points[i][1]
            );

            const mse =
                errors.reduce(
                    (sum, error) => sum + error ** 2,
                    0
                ) / points.length;

            const dw =
                2 * errors.reduce(
                    (sum, error, i) =>
                        sum + error * points[i][0],
                    0
                ) / points.length;

            const db =
                2 * errors.reduce(
                    (sum, error) => sum + error,
                    0
                ) / points.length;

            return {
                w,
                b,
                predictions,
                errors,
                mse,
                dw,
                db
            };
        }

        function render(
            message = "Move the controls to test a line, or run one real batch-gradient update."
        ) {
            const current = state();

            root.querySelector("#cb6WValue").textContent =
                fixed(current.w);
            root.querySelector("#cb6BValue").textContent =
                fixed(current.b);
            root.querySelector("#cb6RateValue").textContent =
                fixed(rateInput.value, 3);

            drawRegression(
                root.querySelector("#cb6Canvas"),
                points,
                current.w,
                current.b
            );

            root.querySelector("#cb6Metrics").innerHTML =
                metric(
                    "Equation",
                    `ŷ = ${fixed(current.w)}x + ${fixed(current.b)}`
                ) +
                metric(
                    "MSE",
                    fixed(current.mse, 4),
                    current.mse < 0.05 ? "good" : ""
                ) +
                metric("Gradient dw", fixed(current.dw, 4)) +
                metric("Gradient db", fixed(current.db, 4));

            const visible = history.slice(-20);
            const maximum = Math.max(...visible, 1);

            root.querySelector("#cb6LossBars").innerHTML =
                visible.map((loss, index) => `
                    <i style="height:${
                        Math.max(4, loss / maximum * 100)
                    }%"
                       title="Step ${
                           history.length -
                           visible.length +
                           index +
                           1
                       }: ${fixed(loss, 4)}">
                    </i>`)
                .join("");

            root.querySelector("#cb6Explanation").textContent =
                message;
        }

        function step() {
            if (finished) return;

            const current = state();
            const rate = number(rateInput.value);
            const newW = current.w - rate * current.dw;
            const newB = current.b - rate * current.db;

            wInput.value = clamp(
                newW,
                number(wInput.min),
                number(wInput.max)
            );

            bInput.value = clamp(
                newB,
                number(bInput.min),
                number(bInput.max)
            );

            const next = state();
            history.push(next.mse);

            root.querySelector("#cb6Formula").textContent =
                `w ← ${fixed(current.w)} − ` +
                `${fixed(rate, 3)}(${fixed(current.dw, 3)}) = ` +
                `${fixed(newW)}  •  ` +
                `b ← ${fixed(current.b)} − ` +
                `${fixed(rate, 3)}(${fixed(current.db, 3)}) = ` +
                `${fixed(newB)}`;

            render(
                `Loss changed from ${fixed(current.mse, 4)} to ` +
                `${fixed(next.mse, 4)}. The negative gradient moved ` +
                "the line toward smaller squared residuals."
            );

            if (next.mse < 0.0005) {
                pause(true);
                render(
                    "Training complete: the line has reached the convergence target. Reset or change a parameter to begin another experiment."
                );
            }
        }

        function train() {
            if (timer || finished) return;

            root.querySelector("#cb6Train").disabled = true;
            root.querySelector("#cb6Pause").disabled = false;
            timer = window.setInterval(step, 350);
        }

        function pause(endReached = false) {
            if (timer) window.clearInterval(timer);

            timer = null;
            finished = endReached;

            root.querySelector("#cb6Train").disabled = endReached;
            root.querySelector("#cb6Step").disabled = endReached;
            root.querySelector("#cb6Pause").disabled = true;
        }

        root.addEventListener("input", () => {
            finished = false;
            history = [];

            root.querySelector("#cb6Train").disabled = false;
            root.querySelector("#cb6Step").disabled = false;

            render(
                "Manual mode: the yellow line and residuals respond to the selected parameters."
            );
        });

        root.querySelector("#cb6Step")
            .addEventListener("click", step);

        root.querySelector("#cb6Train")
            .addEventListener("click", train);

        root.querySelector("#cb6Pause")
            .addEventListener("click", pause);

        root.querySelector("#cb6Reset")
            .addEventListener("click", () => {
                pause(false);
                wInput.value = 0;
                bInput.value = 0;
                history = [];

                root.querySelector("#cb6Formula").textContent =
                    "Ready for the first update";

                render();
            });

        window.addEventListener(
            "resize",
            () => render(),
            {passive: true}
        );

        root.querySelector("#cb6Formula").textContent =
            "Ready for the first update";

        render();
    }

    function drawClassifier(
        canvas,
        points,
        weight,
        bias,
        threshold
    ) {
        const {context, width, height} = canvasContext(canvas);
        const pad = 42;

        const sx = (x) =>
            pad + ((x + 4) / 8) * (width - 2 * pad);

        const sy = (p) =>
            height - pad - p * (height - 2 * pad);

        context.fillStyle = "#071b30";
        context.fillRect(0, 0, width, height);

        context.strokeStyle = "rgba(125, 211, 252, .15)";

        for (let p = 0; p <= 1.001; p += 0.25) {
            context.beginPath();
            context.moveTo(pad, sy(p));
            context.lineTo(width - pad, sy(p));
            context.stroke();
        }

        context.strokeStyle = "#7890aa";
        context.lineWidth = 2;
        context.beginPath();
        context.moveTo(pad, 18);
        context.lineTo(pad, height - pad);
        context.lineTo(width - 18, height - pad);
        context.stroke();

        context.setLineDash([7, 6]);
        context.strokeStyle = "#f6cc35";
        context.beginPath();
        context.moveTo(pad, sy(threshold));
        context.lineTo(width - pad, sy(threshold));
        context.stroke();
        context.setLineDash([]);

        context.strokeStyle = "#39bdf8";
        context.lineWidth = 4;
        context.beginPath();

        for (let i = 0; i <= 160; i += 1) {
            const x = -4 + i / 20;
            const p =
                1 / (1 + Math.exp(-(weight * x + bias)));

            if (i === 0) {
                context.moveTo(sx(x), sy(p));
            } else {
                context.lineTo(sx(x), sy(p));
            }
        }

        context.stroke();

        points.forEach(([x, y]) => {
            context.fillStyle = y ? "#39f29d" : "#ff7891";
            context.beginPath();
            context.arc(sx(x), sy(y), 7, 0, Math.PI * 2);
            context.fill();
        });

        context.fillStyle = "#dcecff";
        context.font = "600 13px system-ui";
        context.fillText(
            "score input x",
            width - 95,
            height - 15
        );
        context.fillText("probability", 8, 20);
    }

    function buildClassificationLab() {
        const root = labShell(
            "Classification Threshold and Metrics Laboratory",
            "Change model parameters and decision threshold, or execute logistic-gradient updates. The sigmoid, predictions, confusion matrix and metrics remain synchronized."
        );

        if (!root) return;

        const points = [
            [-3, 0],
            [-2, 0],
            [-1, 0],
            [0, 0],
            [1, 1],
            [2, 1],
            [3, 1]
        ];

        let timer = null;
        let finished = false;

        root.innerHTML = `
            <div class="cb-lab-controls">
                <label>Weight w
                    <output id="cb7WValue">0.80</output>
                    <input id="cb7W" type="range"
                           min="-2" max="3"
                           step="0.05" value="0.8">
                </label>

                <label>Bias b
                    <output id="cb7BValue">-0.20</output>
                    <input id="cb7B" type="range"
                           min="-3" max="3"
                           step="0.05" value="-0.2">
                </label>

                <label>Threshold
                    <output id="cb7TValue">0.50</output>
                    <input id="cb7T" type="range"
                           min="0.1" max="0.9"
                           step="0.05" value="0.5">
                </label>

                <label>Learning rate
                    <output id="cb7RateValue">0.20</output>
                    <input id="cb7Rate" type="range"
                           min="0.02" max="0.5"
                           step="0.02" value="0.2">
                </label>

                <div class="cb-lab-presets">
                    <button type="button" id="cb7Step">
                        One training step
                    </button>
                    <button type="button" id="cb7Train">
                        ▶ Auto train
                    </button>
                    <button type="button"
                            id="cb7Pause"
                            disabled>
                        Ⅱ Pause
                    </button>
                    <button type="button" id="cb7Reset">
                        ↻ Reset
                    </button>
                </div>
            </div>

            <div class="cb-lab-workspace">
                <canvas id="cb7Canvas"
                        class="cb-lab-canvas"
                        aria-label="Sigmoid probability curve, threshold and labelled points">
                </canvas>

                <div class="cb-confusion-grid"
                     id="cb7Confusion"></div>

                <div class="cb-live-metrics"
                     id="cb7Metrics"></div>

                <div class="cb-formula-line">
                    <span>LIVE RULE</span>
                    <code id="cb7Formula"></code>
                </div>

                <p class="cb-lab-explanation" id="cb7Explanation"></p>
            </div>`;

        const wInput = root.querySelector("#cb7W");
        const bInput = root.querySelector("#cb7B");
        const tInput = root.querySelector("#cb7T");
        const rateInput = root.querySelector("#cb7Rate");

        function calculate() {
            const w = number(wInput.value);
            const b = number(bInput.value);
            const threshold = number(tInput.value);

            const probabilities = points.map(([x]) =>
                1 / (1 + Math.exp(-(w * x + b)))
            );

            const predictions = probabilities.map((p) =>
                p >= threshold ? 1 : 0
            );

            let tp = 0;
            let tn = 0;
            let fp = 0;
            let fn = 0;

            predictions.forEach((prediction, index) => {
                const actual = points[index][1];

                if (prediction && actual) {
                    tp += 1;
                } else if (prediction && !actual) {
                    fp += 1;
                } else if (!prediction && actual) {
                    fn += 1;
                } else {
                    tn += 1;
                }
            });

            const precision = tp / (tp + fp) || 0;
            const recall = tp / (tp + fn) || 0;
            const f1 =
                2 * precision * recall /
                (precision + recall) || 0;
            const accuracy = (tp + tn) / points.length;

            const loss = -probabilities.reduce(
                (sum, p, index) => {
                    const y = points[index][1];
                    const safe = clamp(
                        p,
                        1e-7,
                        1 - 1e-7
                    );

                    return sum +
                        y * Math.log(safe) +
                        (1 - y) * Math.log(1 - safe);
                },
                0
            ) / points.length;

            const errors = probabilities.map(
                (p, index) => p - points[index][1]
            );

            const dw = errors.reduce(
                (sum, error, index) =>
                    sum + error * points[index][0],
                0
            ) / points.length;

            const db = errors.reduce(
                (sum, error) => sum + error,
                0
            ) / points.length;

            return {
                w,
                b,
                threshold,
                probabilities,
                predictions,
                tp,
                tn,
                fp,
                fn,
                precision,
                recall,
                f1,
                accuracy,
                loss,
                dw,
                db
            };
        }

        function render(
            message = "Move the threshold to change decisions without retraining the probability model."
        ) {
            const s = calculate();

            root.querySelector("#cb7WValue").textContent =
                fixed(s.w);
            root.querySelector("#cb7BValue").textContent =
                fixed(s.b);
            root.querySelector("#cb7TValue").textContent =
                fixed(s.threshold);
            root.querySelector("#cb7RateValue").textContent =
                fixed(rateInput.value);

            drawClassifier(
                root.querySelector("#cb7Canvas"),
                points,
                s.w,
                s.b,
                s.threshold
            );

            root.querySelector("#cb7Confusion").innerHTML = `
                <article class="tp">
                    <span>TRUE POSITIVE</span>
                    <strong>${s.tp}</strong>
                </article>
                <article class="fp">
                    <span>FALSE POSITIVE</span>
                    <strong>${s.fp}</strong>
                </article>
                <article class="fn">
                    <span>FALSE NEGATIVE</span>
                    <strong>${s.fn}</strong>
                </article>
                <article class="tn">
                    <span>TRUE NEGATIVE</span>
                    <strong>${s.tn}</strong>
                </article>`;

            root.querySelector("#cb7Metrics").innerHTML =
                metric("Accuracy", fixed(s.accuracy, 3)) +
                metric("Precision", fixed(s.precision, 3)) +
                metric("Recall", fixed(s.recall, 3)) +
                metric("F1", fixed(s.f1, 3), "good") +
                metric(
                    "Cross-entropy",
                    fixed(s.loss, 4)
                );

            const boundary =
                s.w === 0
                    ? "undefined when w = 0"
                    : fixed(
                        (
                            Math.log(
                                s.threshold /
                                (1 - s.threshold)
                            ) - s.b
                        ) / s.w,
                        2
                    );

            root.querySelector("#cb7Formula").textContent =
                `p = sigmoid(${fixed(s.w)}x ` +
                `${s.b >= 0 ? "+" : "−"} ` +
                `${fixed(Math.abs(s.b))}); ` +
                `predict 1 when p ≥ ${fixed(s.threshold)}; ` +
                `boundary x = ${boundary}`;

            root.querySelector("#cb7Explanation").textContent =
                message;
        }

        function step() {
            if (finished) return;

            const s = calculate();
            const rate = number(rateInput.value);

            wInput.value = clamp(
                s.w - rate * s.dw,
                number(wInput.min),
                number(wInput.max)
            );

            bInput.value = clamp(
                s.b - rate * s.db,
                number(bInput.min),
                number(bInput.max)
            );

            const next = calculate();

            render(
                "Training used probability errors to update w and b. " +
                `Cross-entropy changed from ${fixed(s.loss, 4)} ` +
                `to ${fixed(next.loss, 4)}; the threshold itself ` +
                "was not trained."
            );

            if (next.loss < 0.08) {
                pause(true);

                render(
                    "Training complete: cross-entropy reached the convergence target. Reset or change a parameter to begin another experiment."
                );
            }
        }

        function train() {
            if (timer || finished) return;

            root.querySelector("#cb7Train").disabled = true;
            root.querySelector("#cb7Pause").disabled = false;
            timer = window.setInterval(step, 350);
        }

        function pause(endReached = false) {
            if (timer) window.clearInterval(timer);

            timer = null;
            finished = endReached;

            root.querySelector("#cb7Train").disabled =
                endReached;
            root.querySelector("#cb7Step").disabled =
                endReached;
            root.querySelector("#cb7Pause").disabled = true;
        }

        root.addEventListener("input", (event) => {
            finished = false;

            root.querySelector("#cb7Train").disabled = false;
            root.querySelector("#cb7Step").disabled = false;

            if (event.target === tInput) {
                render(
                    "The probability curve did not change—only the operating decision and its confusion-matrix consequences changed."
                );
            } else {
                render(
                    "The model parameters changed, so the probability curve and resulting decisions were recomputed."
                );
            }
        });

        root.querySelector("#cb7Step")
            .addEventListener("click", step);

        root.querySelector("#cb7Train")
            .addEventListener("click", train);

        root.querySelector("#cb7Pause")
            .addEventListener("click", pause);

        root.querySelector("#cb7Reset")
            .addEventListener("click", () => {
                pause(false);
                wInput.value = 0.8;
                bInput.value = -0.2;
                tInput.value = 0.5;
                render();
            });

        window.addEventListener(
            "resize",
            () => render(),
            {passive: true}
        );

        render();
    }

    const labBuilders = {
        1: buildFoundationLab,
        2: buildNumPyLab,
        3: buildLinearAlgebraLab,
        4: buildProbabilityLab,
        5: buildDataLab,
        6: buildRegressionLab,
        7: buildClassificationLab
    };

    window.CodeBhavyaMastery = {
        level,
        escapeHTML
    };

    document.addEventListener("DOMContentLoaded", () => {
        if (labBuilders[level]) {
            labBuilders[level]();
        }
    });
})();
