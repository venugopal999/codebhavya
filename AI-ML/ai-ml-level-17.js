(function () {
    "use strict";

    const PROGRESS_KEY = "codebhavya-aiml-level-17-progress-v1";
    const get = function (id) { return document.getElementById(id); };

    function escapeHtml(value) {
        return String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\"/g, "&quot;").replace(/'/g, "&#039;");
    }

    function fixed(value, digits) {
        return Number(value).toFixed(digits === undefined ? 3 : digits);
    }

    function clamp(value, minimum, maximum) {
        return Math.max(minimum, Math.min(maximum, value));
    }

    function sigmoid(value) {
        return 1 / (1 + Math.exp(-clamp(value, -40, 40)));
    }

    function seededRandom(seed) {
        let state = seed >>> 0;
        return function () {
            state = (state * 1664525 + 1013904223) >>> 0;
            return state / 4294967296;
        };
    }

    function activationValue(name, value) {
        if (name === "sigmoid") return sigmoid(value);
        if (name === "tanh") return Math.tanh(value);
        if (name === "relu") return Math.max(0, value);
        return value;
    }

    function activationDerivative(name, value, output) {
        if (name === "sigmoid") return output * (1 - output);
        if (name === "tanh") return 1 - output * output;
        if (name === "relu") return value > 0 ? 1 : 0;
        return 1;
    }

    function drawRounded(context, x, y, width, height, radius) {
        const r = Math.min(radius, width / 2, height / 2);
        context.beginPath();
        context.moveTo(x + r, y);
        context.arcTo(x + width, y, x + width, y + height, r);
        context.arcTo(x + width, y + height, x, y + height, r);
        context.arcTo(x, y + height, x, y, r);
        context.arcTo(x, y, x + width, y, r);
        context.closePath();
    }

    function prepareCanvas(canvas, desktopHeight, mobileHeight) {
        const width = Math.max(290, canvas.clientWidth || 720);
        const height = width < 560 ? mobileHeight : desktopHeight;
        const ratio = window.devicePixelRatio || 1;

        canvas.style.height = height + "px";
        canvas.width = Math.round(width * ratio);
        canvas.height = Math.round(height * ratio);

        const context = canvas.getContext("2d");
        context.setTransform(ratio, 0, 0, ratio, 0, 0);

        return {
            context: context,
            width: width,
            height: height
        };
    }

    function initNeuronLab() {
        const canvas = get("neuronCanvas");

        if (!canvas || canvas.dataset.cbActive) return;

        canvas.dataset.cbActive = "true";

        const x1Input = get("neuronX1");
        const x2Input = get("neuronX2");
        const activationInput = get("neuronActivation");
        const targetInput = get("neuronTarget");
        const rateInput = get("neuronRate");
        const nextButton = get("neuronNext");
        const autoButton = get("neuronAuto");
        const pauseButton = get("neuronPause");
        const resetButton = get("neuronReset");

        const phaseNames = [
            "Weighted sum",
            "Activation",
            "Loss",
            "Gradients",
            "Parameter update"
        ];

        let parameters;
        let step = 0;
        let timer = null;

        function initialize() {
            parameters = {
                w1: 0.7,
                w2: -0.4,
                bias: 0.1
            };
        }

        function calculate() {
            const x1 = Number(x1Input.value);
            const x2 = Number(x2Input.value);
            const target = Number(targetInput.value);
            const activation = activationInput.value;

            const z = parameters.w1 * x1 +
                parameters.w2 * x2 +
                parameters.bias;

            const output = activationValue(activation, z);
            const loss = 0.5 * Math.pow(output - target, 2);
            const dLossOutput = output - target;
            const dOutputZ = activationDerivative(
                activation,
                z,
                output
            );
            const dLossZ = dLossOutput * dOutputZ;

            return {
                x1: x1,
                x2: x2,
                target: target,
                activation: activation,
                z: z,
                output: output,
                loss: loss,
                dLossOutput: dLossOutput,
                dOutputZ: dOutputZ,
                dLossZ: dLossZ,
                dw1: dLossZ * x1,
                dw2: dLossZ * x2,
                db: dLossZ
            };
        }

        function updateParameters(values) {
            const rate = Number(rateInput.value);

            parameters.w1 -= rate * values.dw1;
            parameters.w2 -= rate * values.dw2;
            parameters.bias -= rate * values.db;
        }

        function drawNode(
            context,
            x,
            y,
            radius,
            label,
            value,
            active,
            color
        ) {
            context.beginPath();
            context.arc(x, y, radius, 0, Math.PI * 2);
            context.fillStyle = active ? color : "#0b2038";
            context.fill();

            context.strokeStyle = active ? "#facc15" : "#365675";
            context.lineWidth = active ? 3 : 1.5;
            context.stroke();

            context.fillStyle = active ? "#061426" : "#f8fafc";
            context.textAlign = "center";
            context.font = "900 12px Arial";
            context.fillText(label, x, y - 3);

            context.font = "700 11px Arial";
            context.fillText(value, x, y + 15);
        }

        function drawArrow(
            context,
            x1,
            y1,
            x2,
            y2,
            active,
            backward
        ) {
            const angle = Math.atan2(y2 - y1, x2 - x1);

            context.strokeStyle = active
                ? (backward ? "#f472b6" : "#22d3ee")
                : "#294967";

            context.fillStyle = context.strokeStyle;
            context.lineWidth = active ? 3 : 1.5;

            context.beginPath();
            context.moveTo(x1, y1);
            context.lineTo(x2, y2);
            context.stroke();

            context.beginPath();
            context.moveTo(x2, y2);
            context.lineTo(
                x2 - 10 * Math.cos(angle - 0.45),
                y2 - 10 * Math.sin(angle - 0.45)
            );
            context.lineTo(
                x2 - 10 * Math.cos(angle + 0.45),
                y2 - 10 * Math.sin(angle + 0.45)
            );
            context.closePath();
            context.fill();
        }

        function draw() {
            const values = calculate();
            const prepared = prepareCanvas(canvas, 465, 520);
            const context = prepared.context;
            const width = prepared.width;
            const height = prepared.height;
            const mobile = width < 560;

            context.fillStyle = "#061426";
            context.fillRect(0, 0, width, height);

            const xInput = mobile ? 58 : 75;
            const xSum = mobile ? width * 0.43 : width * 0.43;
            const xActivation = mobile ? width * 0.75 : width * 0.69;
            const outputX = mobile ? width * 0.75 : width - 75;
            const y1 = mobile ? 90 : 120;
            const y2 = mobile ? 215 : 300;
            const centreY = mobile ? 155 : 210;

            drawArrow(
                context,
                xInput + 34,
                y1,
                xSum - 43,
                centreY - 8,
                step >= 1,
                false
            );

            drawArrow(
                context,
                xInput + 34,
                y2,
                xSum - 43,
                centreY + 8,
                step >= 1,
                false
            );

            drawArrow(
                context,
                xSum + 43,
                centreY,
                xActivation - 43,
                centreY,
                step >= 2,
                false
            );

            if (!mobile) {
                drawArrow(
                    context,
                    xActivation + 43,
                    centreY,
                    outputX - 38,
                    centreY,
                    step >= 2,
                    false
                );
            }

            drawNode(
                context,
                xInput,
                y1,
                32,
                "x₁",
                fixed(values.x1, 1),
                step >= 1,
                "#67e8f9"
            );

            drawNode(
                context,
                xInput,
                y2,
                32,
                "x₂",
                fixed(values.x2, 1),
                step >= 1,
                "#67e8f9"
            );

            drawNode(
                context,
                xSum,
                centreY,
                40,
                "Σ + b",
                step >= 1 ? fixed(values.z, 3) : "?",
                step >= 1,
                "#fde047"
            );

            drawNode(
                context,
                xActivation,
                centreY,
                40,
                values.activation.toUpperCase(),
                step >= 2 ? fixed(values.output, 3) : "?",
                step >= 2,
                "#a78bfa"
            );

            if (!mobile) {
                drawNode(
                    context,
                    outputX,
                    centreY,
                    34,
                    "ŷ",
                    step >= 2 ? fixed(values.output, 3) : "?",
                    step >= 2,
                    "#34d399"
                );
            }

            context.textAlign = "center";
            context.fillStyle = "#9fc3df";
            context.font = "700 11px Arial";

            context.fillText(
                "w₁ = " + fixed(parameters.w1, 3),
                (xInput + xSum) / 2,
                mobile ? 76 : 90
            );

            context.fillText(
                "w₂ = " + fixed(parameters.w2, 3),
                (xInput + xSum) / 2,
                mobile ? 250 : 337
            );

            context.fillText(
                "bias = " + fixed(parameters.bias, 3),
                xSum,
                centreY + 65
            );

            if (step >= 3) {
                const boxY = mobile ? 315 : 350;

                drawRounded(
                    context,
                    28,
                    boxY,
                    width - 56,
                    mobile ? 150 : 82,
                    14
                );

                context.fillStyle = "rgba(15,37,64,.96)";
                context.fill();
                context.strokeStyle = step >= 4
                    ? "#f472b6"
                    : "#365675";
                context.stroke();

                context.textAlign = "left";
                context.fillStyle = "#7dd3fc";
                context.font = "900 11px Arial";
                context.fillText(
                    step >= 4
                        ? "BACKWARD SIGNAL"
                        : "LOSS SIGNAL",
                    48,
                    boxY + 27
                );

                context.fillStyle = "#f8fafc";
                context.font = "800 13px Arial";
                context.fillText(
                    "L = ½(ŷ − y)² = " + fixed(values.loss, 4),
                    48,
                    boxY + 52
                );

                if (step >= 4) {
                    const gradientText =
                        "∂L/∂z=" + fixed(values.dLossZ, 4) +
                        "   ∂L/∂w₁=" + fixed(values.dw1, 4) +
                        "   ∂L/∂w₂=" + fixed(values.dw2, 4);

                    context.fillStyle = "#f9a8d4";
                    context.fillText(
                        gradientText,
                        48,
                        boxY + (mobile ? 82 : 70)
                    );
                }

                if (step >= 5) {
                    context.fillStyle = "#fde047";
                    context.fillText(
                        "Updated: w₁=" +
                        fixed(parameters.w1, 3) +
                        "  w₂=" +
                        fixed(parameters.w2, 3) +
                        "  b=" +
                        fixed(parameters.bias, 3),
                        48,
                        boxY + (mobile ? 112 : 70)
                    );
                }
            }
        }

        function stop() {
            if (timer !== null) {
                window.clearInterval(timer);
            }

            timer = null;
            pauseButton.disabled = true;
        }

        function render() {
            const values = calculate();
            const complete = step >= phaseNames.length;

            const messages = [
                [
                    "The neuron is ready with trainable parameters.",
                    "The forward pass has not started.",
                    "Predict whether the weighted sum will be positive or negative."
                ],
                [
                    "The weighted evidence and bias have been combined.",
                    "z = (" +
                    fixed(parameters.w1, 2) +
                    " × " +
                    fixed(values.x1, 1) +
                    ") + (" +
                    fixed(parameters.w2, 2) +
                    " × " +
                    fixed(values.x2, 1) +
                    ") + " +
                    fixed(parameters.bias, 2) +
                    " = " +
                    fixed(values.z, 3) +
                    ".",
                    "Predict how " +
                    values.activation +
                    " will transform this value."
                ],
                [
                    "The activation produced the neuron output.",
                    values.activation +
                    "(" +
                    fixed(values.z, 3) +
                    ") = " +
                    fixed(values.output, 3) +
                    ".",
                    "Compare the output with target " +
                    values.target +
                    " before calculating loss."
                ],
                [
                    "The prediction error has become a scalar loss.",
                    "Half squared error is " +
                    fixed(values.loss, 5) +
                    ".",
                    "Predict the sign of ∂L/∂z."
                ],
                [
                    "The chain rule assigned responsibility to every parameter.",
                    "∂L/∂z = (a−y)φ′(z) = " +
                    fixed(values.dLossZ, 5) +
                    ".",
                    "A positive gradient makes gradient descent reduce the parameter; a negative gradient makes it increase."
                ],
                [
                    "One gradient-descent update is complete.",
                    "The parameters moved opposite their gradients using learning rate " +
                    fixed(Number(rateInput.value), 2) +
                    ".",
                    "Reset and compare another activation, target or learning rate."
                ]
            ];

            const message = messages[
                Math.min(step, messages.length - 1)
            ];

            get("neuronX1Value").textContent =
                fixed(values.x1, 1);

            get("neuronX2Value").textContent =
                fixed(values.x2, 1);

            get("neuronPhase").textContent = step === 0
                ? "Ready"
                : phaseNames[
                    Math.min(step - 1, phaseNames.length - 1)
                ];

            get("neuronZ").textContent = step >= 1
                ? fixed(values.z, 3)
                : "—";

            get("neuronOutput").textContent = step >= 2
                ? fixed(values.output, 3)
                : "—";

            get("neuronLoss").textContent = step >= 3
                ? fixed(values.loss, 4)
                : "—";

            get("neuronGradient").textContent = step >= 4
                ? fixed(values.dLossZ, 4)
                : "—";

            get("neuronVerdict").textContent = message[0];
            get("neuronExplanation").textContent = message[1];
            get("neuronNextCheck").textContent = message[2];

            get("neuronEquation").innerHTML =
                step < 1
                    ? "<code>z = w₁x₁ + w₂x₂ + b</code>"
                    : step < 3
                        ? "<code>a = " +
                          escapeHtml(values.activation) +
                          "(z)</code>"
                        : step < 4
                            ? "<code>L = ½(a − y)²</code>"
                            : "<code>∂L/∂wᵢ = ∂L/∂z · xᵢ</code>";

            nextButton.textContent = complete
                ? "Update Complete"
                : step === 0
                    ? "Run Forward Pass"
                    : "Next: " + phaseNames[step];

            nextButton.disabled = complete;
            autoButton.disabled = complete || timer !== null;
            pauseButton.disabled = timer === null;

            if (complete) stop();

            draw();
        }

        function advance() {
            if (step >= phaseNames.length) return;

            step += 1;

            if (step === phaseNames.length) {
                const before = calculate();
                updateParameters(before);
            }

            render();
        }

        function reset() {
            stop();
            step = 0;
            initialize();
            render();
        }

        nextButton.addEventListener("click", advance);

        autoButton.addEventListener("click", function () {
            if (
                step >= phaseNames.length ||
                timer !== null
            ) return;

            timer = window.setInterval(advance, 900);
            render();
        });

        pauseButton.addEventListener("click", function () {
            stop();
            render();
        });

        resetButton.addEventListener("click", reset);

        [
            x1Input,
            x2Input,
            activationInput,
            targetInput,
            rateInput
        ].forEach(function (input) {
            input.addEventListener("input", reset);
            input.addEventListener("change", reset);
        });

        window.addEventListener("resize", draw);

        initialize();
        render();
        window.requestAnimationFrame(draw);
    }

    function initNetworkLab() {
        const canvas = get("networkCanvas");

        if (!canvas || canvas.dataset.cbActive) return;

        canvas.dataset.cbActive = "true";

        const hiddenInput = get("networkHidden");
        const activationInput = get("networkActivation");
        const rateInput = get("networkRate");
        const batchInput = get("networkBatch");
        const nextButton = get("networkNext");
        const autoButton = get("networkAuto");
        const pauseButton = get("networkPause");
        const resetButton = get("networkReset");

        const samples = [
            [0, 0],
            [0, 1],
            [1, 0],
            [1, 1]
        ];

        const targets = [0, 1, 1, 0];
        const maximumEpochs = 1000;

        let state;
        let timer = null;

        function initialize() {
            const hidden = Number(hiddenInput.value);

            const random = seededRandom(
                1700 +
                hidden * 41 +
                activationInput.selectedIndex * 103
            );

            state = {
                hidden: hidden,

                w1: Array.from(
                    { length: hidden },
                    function () {
                        return [
                            (random() - 0.5) * 1.6,
                            (random() - 0.5) * 1.6
                        ];
                    }
                ),

                b1: Array.from(
                    { length: hidden },
                    function () {
                        return (random() - 0.5) * 0.2;
                    }
                ),

                w2: Array.from(
                    { length: hidden },
                    function () {
                        return (random() - 0.5) * 1.6;
                    }
                ),

                b2: (random() - 0.5) * 0.2,
                epoch: 0,
                gradientNorm: 0,
                history: []
            };
        }

        function forward(input) {
            const hiddenZ = [];
            const hiddenA = [];

            for (
                let neuron = 0;
                neuron < state.hidden;
                neuron += 1
            ) {
                const z =
                    state.w1[neuron][0] * input[0] +
                    state.w1[neuron][1] * input[1] +
                    state.b1[neuron];

                hiddenZ.push(z);

                hiddenA.push(
                    activationValue(
                        activationInput.value,
                        z
                    )
                );
            }

            let outputZ = state.b2;

            for (
                let neuron = 0;
                neuron < state.hidden;
                neuron += 1
            ) {
                outputZ +=
                    hiddenA[neuron] *
                    state.w2[neuron];
            }

            return {
                hiddenZ: hiddenZ,
                hiddenA: hiddenA,
                outputZ: outputZ,
                output: sigmoid(outputZ)
            };
        }

        function evaluate() {
            let loss = 0;
            let correct = 0;

            const predictions = samples.map(
                function (sample, index) {
                    const result = forward(sample);

                    const probability = clamp(
                        result.output,
                        1e-8,
                        1 - 1e-8
                    );

                    loss += -(
                        targets[index] * Math.log(probability) +
                        (1 - targets[index]) *
                        Math.log(1 - probability)
                    );

                    if (
                        (probability >= 0.5 ? 1 : 0) ===
                        targets[index]
                    ) {
                        correct += 1;
                    }

                    return probability;
                }
            );

            return {
                loss: loss / samples.length,
                accuracy: correct / samples.length,
                predictions: predictions
            };
        }

        function trainEpoch() {
            const learningRate = Number(rateInput.value);

            const gradW1 = Array.from(
                { length: state.hidden },
                function () {
                    return [0, 0];
                }
            );

            const gradB1 =
                new Array(state.hidden).fill(0);

            const gradW2 =
                new Array(state.hidden).fill(0);

            let gradB2 = 0;

            samples.forEach(function (sample, index) {
                const result = forward(sample);

                const outputDelta =
                    result.output - targets[index];

                gradB2 += outputDelta;

                for (
                    let neuron = 0;
                    neuron < state.hidden;
                    neuron += 1
                ) {
                    gradW2[neuron] +=
                        outputDelta *
                        result.hiddenA[neuron];

                    const hiddenDelta =
                        outputDelta *
                        state.w2[neuron] *
                        activationDerivative(
                            activationInput.value,
                            result.hiddenZ[neuron],
                            result.hiddenA[neuron]
                        );

                    gradB1[neuron] += hiddenDelta;

                    gradW1[neuron][0] +=
                        hiddenDelta * sample[0];

                    gradW1[neuron][1] +=
                        hiddenDelta * sample[1];
                }
            });

            let squaredNorm = gradB2 * gradB2;
            const scale = 1 / samples.length;

            for (
                let neuron = 0;
                neuron < state.hidden;
                neuron += 1
            ) {
                gradW2[neuron] *= scale;
                gradB1[neuron] *= scale;
                gradW1[neuron][0] *= scale;
                gradW1[neuron][1] *= scale;

                squaredNorm +=
                    gradW2[neuron] * gradW2[neuron] +
                    gradB1[neuron] * gradB1[neuron] +
                    gradW1[neuron][0] *
                    gradW1[neuron][0] +
                    gradW1[neuron][1] *
                    gradW1[neuron][1];

                state.w2[neuron] -=
                    learningRate * gradW2[neuron];

                state.b1[neuron] -=
                    learningRate * gradB1[neuron];

                state.w1[neuron][0] -=
                    learningRate * gradW1[neuron][0];

                state.w1[neuron][1] -=
                    learningRate * gradW1[neuron][1];
            }

            gradB2 *= scale;
            state.b2 -= learningRate * gradB2;

            state.gradientNorm =
                Math.sqrt(squaredNorm) * scale;

            state.epoch += 1;
        }

        function trainBlock() {
            const count = Math.min(
                Number(batchInput.value),
                maximumEpochs - state.epoch
            );

            for (
                let index = 0;
                index < count;
                index += 1
            ) {
                trainEpoch();
            }

            const metrics = evaluate();

            state.history.push({
                epoch: state.epoch,
                loss: metrics.loss
            });

            if (state.history.length > 101) {
                state.history.shift();
            }
        }

        function draw() {
            const prepared = prepareCanvas(
                canvas,
                485,
                610
            );

            const context = prepared.context;
            const width = prepared.width;
            const height = prepared.height;
            const mobile = width < 560;
            const metrics = evaluate();

            context.fillStyle = "#061426";
            context.fillRect(0, 0, width, height);

            const surfaceSize = mobile
                ? Math.min(width - 60, 300)
                : Math.min(285, width * 0.42);

            const surfaceX = mobile
                ? (width - surfaceSize) / 2
                : 34;

            const surfaceY = 55;
            const cells = 22;
            const cell = surfaceSize / cells;

            for (
                let row = 0;
                row < cells;
                row += 1
            ) {
                for (
                    let column = 0;
                    column < cells;
                    column += 1
                ) {
                    const x1 =
                        column / (cells - 1);

                    const x2 =
                        1 - row / (cells - 1);

                    const probability =
                        forward([x1, x2]).output;

                    const red =
                        Math.round(25 + 115 * probability);

                    const blue =
                        Math.round(
                            125 +
                            100 * (1 - probability)
                        );

                    context.fillStyle =
                        "rgba(" +
                        red +
                        ",78," +
                        blue +
                        ",0.78)";

                    context.fillRect(
                        surfaceX + column * cell,
                        surfaceY + row * cell,
                        cell + 0.5,
                        cell + 0.5
                    );
                }
            }

            context.strokeStyle = "#6ba2cc";
            context.lineWidth = 1.5;
            context.strokeRect(
                surfaceX,
                surfaceY,
                surfaceSize,
                surfaceSize
            );

            context.fillStyle = "#7dd3fc";
            context.font = "900 11px Arial";
            context.fillText(
                "LEARNED XOR DECISION SURFACE",
                surfaceX,
                32
            );

            samples.forEach(function (sample, index) {
                const x =
                    surfaceX +
                    sample[0] * (surfaceSize - 20) +
                    10;

                const y =
                    surfaceY +
                    (1 - sample[1]) *
                    (surfaceSize - 20) +
                    10;

                context.beginPath();
                context.arc(
                    x,
                    y,
                    10,
                    0,
                    Math.PI * 2
                );

                context.fillStyle =
                    targets[index]
                        ? "#fde047"
                        : "#22d3ee";

                context.fill();

                context.strokeStyle = "#ffffff";
                context.lineWidth = 2;
                context.stroke();

                context.fillStyle = "#061426";
                context.textAlign = "center";
                context.font = "900 10px Arial";
                context.fillText(
                    String(targets[index]),
                    x,
                    y + 3
                );
            });

            context.textAlign = "left";

            const networkX = mobile
                ? 28
                : surfaceX + surfaceSize + 35;

            const networkY = mobile
                ? surfaceY + surfaceSize + 55
                : 75;

            const networkWidth = mobile
                ? width - 56
                : width - networkX - 28;

            const networkHeight = mobile
                ? 115
                : 190;

            drawRounded(
                context,
                networkX,
                networkY,
                networkWidth,
                networkHeight,
                14
            );

            context.fillStyle = "#0b2038";
            context.fill();
            context.strokeStyle = "#294967";
            context.stroke();

            context.fillStyle = "#7dd3fc";
            context.font = "900 11px Arial";
            context.fillText(
                "2 → " +
                state.hidden +
                " → 1 NETWORK",
                networkX + 18,
                networkY + 25
            );

            const layerY =
                networkY + (mobile ? 73 : 105);

            const inputX = networkX + 42;

            const hiddenX =
                networkX + networkWidth * 0.52;

            const outputX =
                networkX + networkWidth - 42;

            const inputPositions = [
                layerY - 28,
                layerY + 28
            ];

            const hiddenPositions = Array.from(
                { length: state.hidden },
                function (_, index) {
                    return (
                        layerY -
                        (state.hidden - 1) * 24 +
                        index * 48
                    );
                }
            );

            inputPositions.forEach(function (inputY) {
                hiddenPositions.forEach(
                    function (hiddenY) {
                        context.beginPath();
                        context.moveTo(
                            inputX,
                            inputY
                        );
                        context.lineTo(
                            hiddenX,
                            hiddenY
                        );
                        context.strokeStyle = "#315372";
                        context.lineWidth = 1;
                        context.stroke();
                    }
                );
            });

            hiddenPositions.forEach(
                function (hiddenY) {
                    context.beginPath();
                    context.moveTo(
                        hiddenX,
                        hiddenY
                    );
                    context.lineTo(
                        outputX,
                        layerY
                    );
                    context.strokeStyle = "#315372";
                    context.stroke();
                }
            );

            inputPositions.forEach(function (y) {
                context.beginPath();
                context.arc(
                    inputX,
                    y,
                    11,
                    0,
                    Math.PI * 2
                );
                context.fillStyle = "#22d3ee";
                context.fill();
            });

            hiddenPositions.forEach(function (y) {
                context.beginPath();
                context.arc(
                    hiddenX,
                    y,
                    12,
                    0,
                    Math.PI * 2
                );
                context.fillStyle = "#a78bfa";
                context.fill();
            });

            context.beginPath();
            context.arc(
                outputX,
                layerY,
                13,
                0,
                Math.PI * 2
            );
            context.fillStyle = "#fde047";
            context.fill();

            const chartX = mobile
                ? 35
                : networkX;

            const chartY = mobile
                ? networkY + networkHeight + 55
                : 320;

            const chartWidth = mobile
                ? width - 70
                : networkWidth;

            const chartHeight = mobile
                ? 85
                : 115;

            context.fillStyle = "#7dd3fc";
            context.font = "900 11px Arial";
            context.fillText(
                "BINARY CROSS-ENTROPY",
                chartX,
                chartY - 13
            );

            context.strokeStyle = "#294967";
            context.strokeRect(
                chartX,
                chartY,
                chartWidth,
                chartHeight
            );

            if (state.history.length > 1) {
                const maximum = Math.max.apply(
                    null,
                    state.history
                        .map(function (entry) {
                            return entry.loss;
                        })
                        .concat([0.7])
                );

                context.beginPath();

                state.history.forEach(
                    function (entry, index) {
                        const x =
                            chartX +
                            index /
                            Math.max(
                                1,
                                state.history.length - 1
                            ) *
                            chartWidth;

                        const y =
                            chartY +
                            chartHeight -
                            entry.loss /
                            maximum *
                            chartHeight;

                        if (index === 0) {
                            context.moveTo(x, y);
                        } else {
                            context.lineTo(x, y);
                        }
                    }
                );

                context.strokeStyle = "#facc15";
                context.lineWidth = 3;
                context.stroke();
            } else {
                context.fillStyle = "#91a9c0";
                context.font = "700 12px Arial";
                context.fillText(
                    "Train the network to reveal the loss curve.",
                    chartX + 14,
                    chartY + 35
                );
            }

            context.fillStyle = "#9fc3df";
            context.font = "700 11px Arial";

            context.fillText(
                "Current loss " +
                fixed(metrics.loss, 4) +
                " • accuracy " +
                Math.round(metrics.accuracy * 100) +
                "%",
                chartX,
                chartY + chartHeight + 22
            );
        }

        function stop() {
            if (timer !== null) {
                window.clearInterval(timer);
            }

            timer = null;
            pauseButton.disabled = true;
        }

        function render() {
            const metrics = evaluate();
            const complete =
                state.epoch >= maximumEpochs;

            get("networkEpoch").textContent =
                state.epoch +
                " / " +
                maximumEpochs;

            get("networkLoss").textContent =
                fixed(metrics.loss, 4);

            get("networkAccuracy").textContent =
                Math.round(
                    metrics.accuracy * 100
                ) + "%";

            get("networkGradient").textContent =
                state.epoch
                    ? fixed(state.gradientNorm, 4)
                    : "—";

            get("networkPredictions").innerHTML =
                metrics.predictions
                    .map(function (probability, index) {
                        const correct =
                            (
                                probability >= 0.5
                                    ? 1
                                    : 0
                            ) === targets[index];

                        return (
                            "<article" +
                            (
                                correct
                                    ? " class=\"is-active\""
                                    : ""
                            ) +
                            "><span>[" +
                            samples[index].join(", ") +
                            "] → " +
                            targets[index] +
                            "</span><strong>p=" +
                            fixed(probability, 3) +
                            "</strong></article>"
                        );
                    })
                    .join("");

            if (state.epoch === 0) {
                get("networkVerdict").textContent =
                    "The nonlinear network is initialized.";

                get("networkExplanation").textContent =
                    "Small asymmetric weights allow hidden neurons to begin learning different features.";

                get("networkNextCheck").textContent =
                    "Predict why a single linear neuron cannot separate XOR.";
            } else if (
                metrics.accuracy === 1 &&
                metrics.loss < 0.12
            ) {
                get("networkVerdict").textContent =
                    "The hidden representation now separates all XOR classes.";

                get("networkExplanation").textContent =
                    "Nonlinear hidden features allow the output neuron to classify four corners that are not linearly separable in input space.";

                get("networkNextCheck").textContent =
                    "Change activation or width and compare convergence speed—not only final accuracy.";
            } else if (
                state.epoch >= 300 &&
                metrics.accuracy < 1
            ) {
                get("networkVerdict").textContent =
                    "Training is progressing slowly or has reached a weak solution.";

                get("networkExplanation").textContent =
                    "The current initialization, activation and learning rate have not yet formed a clean nonlinear representation.";

                get("networkNextCheck").textContent =
                    "Reset with a different activation, width or learning rate and compare the loss curve.";
            } else {
                get("networkVerdict").textContent =
                    "Backpropagation is reshaping the decision surface.";

                get("networkExplanation").textContent =
                    "Epoch " +
                    state.epoch +
                    " has loss " +
                    fixed(metrics.loss, 4) +
                    " and classifies " +
                    Math.round(metrics.accuracy * 4) +
                    " of 4 points correctly.";

                get("networkNextCheck").textContent =
                    "Watch whether loss falls consistently and all four probabilities move away from 0.5.";
            }

            const block = Number(batchInput.value);

            nextButton.textContent = complete
                ? "Training Complete"
                : "Train " +
                  Math.min(
                      block,
                      maximumEpochs - state.epoch
                  ) +
                  (
                      block === 1
                          ? " Epoch"
                          : " Epochs"
                  );

            nextButton.disabled = complete;
            autoButton.disabled =
                complete || timer !== null;
            pauseButton.disabled =
                timer === null;

            if (complete) stop();

            draw();
        }

        function advance() {
            if (state.epoch < maximumEpochs) {
                trainBlock();
            }

            render();
        }

        function reset() {
            stop();
            initialize();
            render();
        }

        nextButton.addEventListener(
            "click",
            advance
        );

        autoButton.addEventListener(
            "click",
            function () {
                if (
                    state.epoch >= maximumEpochs ||
                    timer !== null
                ) return;

                timer = window.setInterval(
                    advance,
                    220
                );

                render();
            }
        );

        pauseButton.addEventListener(
            "click",
            function () {
                stop();
                render();
            }
        );

        resetButton.addEventListener(
            "click",
            reset
        );

        [
            hiddenInput,
            activationInput,
            rateInput,
            batchInput
        ].forEach(function (input) {
            input.addEventListener(
                "change",
                reset
            );
        });

        window.addEventListener(
            "resize",
            draw
        );

        initialize();
        render();
        window.requestAnimationFrame(draw);
    }

    function initTracer() {
        const codeContainer = get("tracerCode");
        const toggle = get("tracerPanelToggle");
        const panel = get("tracerPanel");

        if (
            !codeContainer ||
            !toggle ||
            !panel ||
            codeContainer.dataset.cbActive
        ) return;

        codeContainer.dataset.cbActive = "true";

        const lines = [
            "x, target = [1.0, 0.5], 1",
            "w1 = [[0.4, -0.2], [0.1, 0.3]]",
            "b1, w2, lr = [0, 0], [0.6, -0.5], 0.1",
            "z1, hidden = [], []",
            "for j in range(2):",
            "    total = b1[j]",
            "    for i in range(2):",
            "        total += x[i] * w1[j][i]",
            "    z1.append(total)",
            "    hidden.append(max(0, total))",
            "z2 = 0",
            "for j in range(2):",
            "    z2 += hidden[j] * w2[j]",
            "prediction = 1 / (1 + exp(-z2))",
            "error = prediction - target",
            "for j in range(2):",
            "    old_w2 = w2[j]",
            "    w2[j] -= lr * error * hidden[j]",
            "    grad_hidden = error * old_w2 * (z1[j] > 0)",
            "    for i in range(2):",
            "        w1[j][i] -= lr * grad_hidden * x[i]",
            "print(round(prediction, 3), w1, w2)"
        ];

        function clone(value) {
            return JSON.parse(
                JSON.stringify(value)
            );
        }

        function buildStates() {
            const states = [];
            const x = [1, 0.5];
            const target = 1;

            const w1 = [
                [0.4, -0.2],
                [0.1, 0.3]
            ];

            const b1 = [0, 0];
            const w2 = [0.6, -0.5];
            const lr = 0.1;
            const z1 = [];
            const hidden = [];

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
                "Create the input vector and binary target.",
                {
                    x: x,
                    target: target
                },
                "two input features"
            );

            add(
                1,
                "Initialize two hidden neurons with two weights each.",
                {
                    w1: w1
                },
                "shape(w1) = 2 × 2"
            );

            add(
                2,
                "Initialize hidden biases, output weights and learning rate.",
                {
                    b1: b1,
                    w2: w2,
                    lr: lr
                },
                "two hidden outputs feed one output neuron"
            );

            add(
                3,
                "Create empty containers for hidden pre-activations and activations.",
                {
                    z1: z1,
                    hidden: hidden
                },
                "z1 = [], hidden = []"
            );

            for (
                let j = 0;
                j < 2;
                j += 1
            ) {
                add(
                    4,
                    "Enter the hidden-neuron loop with j = " +
                    j +
                    ".",
                    {
                        j: j,
                        z1: z1,
                        hidden: hidden
                    },
                    "range(2) gives " + j
                );

                let total = b1[j];

                add(
                    5,
                    "Start this neuron’s weighted sum from its bias.",
                    {
                        j: j,
                        total: total,
                        bias: b1[j]
                    },
                    "total = " + fixed(total, 3)
                );

                for (
                    let i = 0;
                    i < 2;
                    i += 1
                ) {
                    add(
                        6,
                        "Enter the input loop with i = " +
                        i +
                        ".",
                        {
                            j: j,
                            i: i,
                            total: total
                        },
                        "process x[" + i + "]"
                    );

                    const contribution =
                        x[i] * w1[j][i];

                    total += contribution;

                    add(
                        7,
                        "Multiply the input by its connection weight and accumulate it.",
                        {
                            j: j,
                            i: i,
                            x_i: x[i],
                            weight: w1[j][i],
                            contribution: contribution,
                            total: total
                        },
                        fixed(x[i], 2) +
                        " × " +
                        fixed(w1[j][i], 2) +
                        " → total " +
                        fixed(total, 3)
                    );
                }

                z1.push(total);

                add(
                    8,
                    "Store the hidden pre-activation for later backpropagation.",
                    {
                        j: j,
                        z1: z1
                    },
                    "z1.append(" +
                    fixed(total, 3) +
                    ")"
                );

                const active =
                    Math.max(0, total);

                hidden.push(active);

                add(
                    9,
                    "Apply ReLU and store the hidden feature.",
                    {
                        j: j,
                        total: total,
                        hidden: hidden
                    },
                    "max(0, " +
                    fixed(total, 3) +
                    ") = " +
                    fixed(active, 3)
                );
            }

            let z2 = 0;

            add(
                10,
                "Reset the output neuron’s weighted sum.",
                {
                    z2: z2,
                    hidden: hidden
                },
                "z2 = 0"
            );

            for (
                let j = 0;
                j < 2;
                j += 1
            ) {
                add(
                    11,
                    "Enter the output connection loop with j = " +
                    j +
                    ".",
                    {
                        j: j,
                        z2: z2
                    },
                    "process hidden[" + j + "]"
                );

                const contribution =
                    hidden[j] * w2[j];

                z2 += contribution;

                add(
                    12,
                    "Accumulate the hidden feature times its output weight.",
                    {
                        j: j,
                        hidden_j: hidden[j],
                        w2_j: w2[j],
                        contribution: contribution,
                        z2: z2
                    },
                    fixed(hidden[j], 3) +
                    " × " +
                    fixed(w2[j], 3) +
                    " → z2 " +
                    fixed(z2, 3)
                );
            }

            const prediction = sigmoid(z2);

            add(
                13,
                "Convert the output logit to a probability with sigmoid.",
                {
                    z2: z2,
                    prediction: prediction
                },
                "sigmoid(" +
                fixed(z2, 3) +
                ") = " +
                fixed(prediction, 4)
            );

            const error =
                prediction - target;

            add(
                14,
                "For sigmoid plus binary cross-entropy, calculate the output delta.",
                {
                    prediction: prediction,
                    target: target,
                    error: error
                },
                fixed(prediction, 4) +
                " − " +
                target +
                " = " +
                fixed(error, 4)
            );

            for (
                let j = 0;
                j < 2;
                j += 1
            ) {
                add(
                    15,
                    "Enter the backward hidden-neuron loop with j = " +
                    j +
                    ".",
                    {
                        j: j,
                        error: error,
                        w1: w1,
                        w2: w2
                    },
                    "backpropagate through hidden neuron " +
                    j
                );

                const oldW2 = w2[j];

                add(
                    16,
                    "Save the output weight before updating it.",
                    {
                        j: j,
                        old_w2: oldW2
                    },
                    "old_w2 = " +
                    fixed(oldW2, 4)
                );

                const outputChange =
                    lr * error * hidden[j];

                w2[j] -= outputChange;

                add(
                    17,
                    "Update the hidden-to-output weight opposite its gradient.",
                    {
                        j: j,
                        output_change: outputChange,
                        w2: w2
                    },
                    "w2[" +
                    j +
                    "] = " +
                    fixed(w2[j], 4)
                );

                const reluDerivative =
                    z1[j] > 0 ? 1 : 0;

                const gradHidden =
                    error *
                    oldW2 *
                    reluDerivative;

                add(
                    18,
                    "Propagate the output delta through the saved weight and ReLU derivative.",
                    {
                        j: j,
                        relu_derivative: reluDerivative,
                        grad_hidden: gradHidden
                    },
                    fixed(error, 4) +
                    " × " +
                    fixed(oldW2, 3) +
                    " × " +
                    reluDerivative +
                    " = " +
                    fixed(gradHidden, 4)
                );

                for (
                    let i = 0;
                    i < 2;
                    i += 1
                ) {
                    add(
                        19,
                        "Enter the hidden input-weight loop with i = " +
                        i +
                        ".",
                        {
                            j: j,
                            i: i,
                            grad_hidden: gradHidden
                        },
                        "update w1[" +
                        j +
                        "][" +
                        i +
                        "]"
                    );

                    const change =
                        lr * gradHidden * x[i];

                    w1[j][i] -= change;

                    add(
                        20,
                        "Apply the chain-rule gradient to this input weight.",
                        {
                            j: j,
                            i: i,
                            change: change,
                            w1: w1
                        },
                        "new weight = " +
                        fixed(w1[j][i], 4)
                    );
                }
            }

            add(
                21,
                "Print the original prediction and updated parameters.",
                {
                    prediction: prediction,
                    w1: w1,
                    w2: w2
                },
                "round prediction to 3 decimals",
                fixed(prediction, 3) +
                "\n" +
                JSON.stringify(w1) +
                "\n" +
                JSON.stringify(w2)
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
                    '"><span>' +
                    String(index + 1).padStart(2, "0") +
                    "</span><code>" +
                    escapeHtml(line) +
                    "</code></div>"
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
            if (value === null) return "None";

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

                    line.classList.toggle(
                        "is-complete",
                        !!current &&
                        index < current.line
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
                                '<article class="aiml-variable"><span>' +
                                escapeHtml(key) +
                                "</span><code>" +
                                escapeHtml(
                                    formatValue(variables[key])
                                ) +
                                "</code></article>"
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

            if (atEnd) stop();
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
                step = Math.max(0, step - 1);
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
                ) return;

                timer = window.setInterval(
                    advance,
                    650
                );

                render();
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

        if (!list || list.dataset.cbActive) return;

        list.dataset.cbActive = "true";

        const problems = [
            {
                title: "Calculate a Neuron Forward Pass",
                description: "Calculate the weighted sum and ReLU output for three inputs.",
                sampleInput: "x=[2,-1,3], w=[0.4,0.2,-0.1], b=0.5",
                expected: "z=0.8 output=0.8",
                hint: "Use zip to calculate the dot product, add bias, then apply max(0,z).",
                starter: "x = [2, -1, 3]\nw = [0.4, 0.2, -0.1]\nbias = 0.5\n# Calculate z and ReLU output\n",
                solution: "x = [2, -1, 3]\nw = [0.4, 0.2, -0.1]\nbias = 0.5\nz = sum(value * weight for value, weight in zip(x, w)) + bias\noutput = max(0, z)\nprint(round(z, 3), round(output, 3))",
                required: [
                    ["zip("],
                    ["sum("],
                    ["bias"],
                    ["max(0"],
                    ["print("]
                ]
            },
            {
                title: "Run a Dense Layer",
                description: "Calculate outputs of two neurons for one input vector.",
                sampleInput: "x=[1,2], W=[[.5,.2],[-.3,.8]], b=[.1,-.2]",
                expected: "[1.0, 1.1]",
                hint: "Use one outer loop for neurons and one dot product per row.",
                starter: "x = [1, 2]\nweights = [[0.5, 0.2], [-0.3, 0.8]]\nbiases = [0.1, -0.2]\n# Calculate dense-layer outputs\n",
                solution: "x = [1, 2]\nweights = [[0.5, 0.2], [-0.3, 0.8]]\nbiases = [0.1, -0.2]\noutputs = []\nfor row, bias in zip(weights, biases):\n    total = sum(value * weight for value, weight in zip(x, row)) + bias\n    outputs.append(max(0, total))\nprint(outputs)",
                required: [
                    ["for"],
                    ["zip("],
                    ["sum("],
                    ["outputs.append"],
                    ["print("]
                ]
            },
            {
                title: "Calculate Binary Cross-Entropy",
                description: "Calculate the mean binary cross-entropy for four probabilities.",
                sampleInput: "y=[1,0,1,1], p=[.9,.2,.7,.6]",
                expected: "approximately 0.299",
                hint: "Use −[y log(p)+(1−y)log(1−p)] and average all samples.",
                starter: "import math\ny = [1, 0, 1, 1]\np = [0.9, 0.2, 0.7, 0.6]\n# Calculate mean binary cross-entropy\n",
                solution: "import math\ny = [1, 0, 1, 1]\np = [0.9, 0.2, 0.7, 0.6]\nlosses = []\nfor target, probability in zip(y, p):\n    loss = -(target * math.log(probability) + (1 - target) * math.log(1 - probability))\n    losses.append(loss)\nprint(round(sum(losses) / len(losses), 3))",
                required: [
                    ["math.log"],
                    ["zip("],
                    ["1 - target", "1-target"],
                    ["sum("],
                    ["len("],
                    ["print("]
                ]
            },
            {
                title: "Perform One Sigmoid Weight Update",
                description: "Calculate a prediction, gradient and one gradient-descent update.",
                sampleInput: "x=2, w=.4, b=.1, y=1, lr=.1",
                expected: "updated w and b",
                hint: "For sigmoid plus BCE, output delta is prediction−target.",
                starter: "import math\nx, weight, bias = 2, 0.4, 0.1\ntarget, learning_rate = 1, 0.1\n# Forward, gradient and update\n",
                solution: "import math\nx, weight, bias = 2, 0.4, 0.1\ntarget, learning_rate = 1, 0.1\nz = weight * x + bias\nprediction = 1 / (1 + math.exp(-z))\nerror = prediction - target\ngrad_weight = error * x\ngrad_bias = error\nweight -= learning_rate * grad_weight\nbias -= learning_rate * grad_bias\nprint(round(weight, 3), round(bias, 3))",
                required: [
                    ["math.exp"],
                    ["prediction"],
                    ["error"],
                    ["grad_weight"],
                    ["learning_rate"],
                    ["print("]
                ]
            },
            {
                title: "Count Network Parameters",
                description: "Count weights and biases in a 5–8–4–2 dense network.",
                sampleInput: "layers=[5,8,4,2]",
                expected: "98",
                hint: "Each connection contributes input×output weights plus output biases.",
                starter: "layers = [5, 8, 4, 2]\n# Count all dense weights and biases\n",
                solution: "layers = [5, 8, 4, 2]\nparameters = 0\nfor input_size, output_size in zip(layers, layers[1:]):\n    weights = input_size * output_size\n    biases = output_size\n    parameters += weights + biases\nprint(parameters)",
                required: [
                    ["zip("],
                    ["layers[1:]"],
                    [
                        "input_size * output_size",
                        "input_size*output_size"
                    ],
                    ["biases"],
                    ["parameters +=", "parameters+="],
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
                    return sum + Number(score || 0);
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
                    '<button type="button" class="primary" data-action="workspace">💻 Solve It Yourself</button>' +
                    '<button type="button" class="hint" data-action="hint">Hint</button>' +
                    '<button type="button" data-action="solution">Show Program</button>' +
                    "</div>" +
                    '<div class="aiml-problem-reveal" data-panel="hint" hidden><strong>Hint</strong><p>' +
                    escapeHtml(problem.hint) +
                    "</p></div>" +
                    '<div class="aiml-problem-reveal" data-panel="solution" hidden><strong>Model program</strong><pre><code>' +
                    escapeHtml(problem.solution) +
                    "</code></pre></div>" +
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
                    '<button type="button" data-action="check">Check Answer</button>' +
                    '<button type="button" data-action="reset">Reset</button>' +
                    '<span class="aiml-check-result" data-result>Write your solution, then check its structure.</span>' +
                    "</div></div></article>"
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
                '[data-panel="' + name + '"]'
            );

            if (!section) return;

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

                if (!button) return;

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
                    card.querySelector("[data-result]");

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
                            "Not complete yet. Recheck the required neural-network logic.";

                        return;
                    }

                    const score = revealed.has(index)
                        ? 60
                        : 100;

                    solved.add(index);

                    scores[index] = Math.max(
                        Number(scores[index] || 0),
                        score
                    );

                    card.classList.add("is-solved");

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

        if (!container || container.dataset.cbActive) {
            return;
        }

        container.dataset.cbActive = "true";

        const questions = [
            [
                "Why does a multilayer network need nonlinear activations?",
                [
                    "Without them, stacked dense layers collapse into one linear map",
                    "They remove all parameters",
                    "They guarantee zero loss",
                    "They make labels unnecessary"
                ],
                0,
                "A composition of linear transformations remains linear; nonlinear activations allow curved and piecewise decision functions."
            ],
            [
                "What is the role of bias in a neuron?",
                [
                    "Shift the activation or decision boundary",
                    "Store the complete dataset",
                    "Normalize every batch",
                    "Choose the number of epochs"
                ],
                0,
                "Bias provides a trainable offset so the neuron is not forced through the origin."
            ],
            [
                "Which hidden activation is a common efficient default?",
                [
                    "ReLU or one of its variants",
                    "Softmax for every hidden layer",
                    "Hard accuracy",
                    "Argmax"
                ],
                0,
                "ReLU-style activations are computationally simple and preserve gradients on their active side."
            ],
            [
                "What does backpropagation calculate?",
                [
                    "Gradients of loss with respect to parameters",
                    "The test labels",
                    "The train–test split",
                    "Only final predictions"
                ],
                0,
                "Backpropagation applies the chain rule in reverse to calculate parameter gradients efficiently."
            ],
            [
                "What does gradient descent do with a positive gradient?",
                [
                    "Reduce the parameter when using θ←θ−η∇L",
                    "Always set it to zero",
                    "Increase the loss deliberately",
                    "Delete the layer"
                ],
                0,
                "The update subtracts learning rate times gradient, so a positive gradient reduces the parameter."
            ],
            [
                "Why should all hidden-layer weights not start at zero?",
                [
                    "Hidden neurons would remain symmetric and learn identical features",
                    "Zero is not a number",
                    "Bias cannot be used",
                    "Loss requires negative weights"
                ],
                0,
                "Identical hidden neurons receive identical gradients, so random initialization is required to break symmetry."
            ],
            [
                "Which output and loss pairing suits multiclass classification?",
                [
                    "Class logits with cross-entropy",
                    "One ReLU output with MSE only",
                    "Argmax with accuracy as loss",
                    "No output activation and no loss"
                ],
                0,
                "Stable cross-entropy operates on one logit per class and internally handles the probability calculation."
            ],
            [
                "What usually indicates overfitting?",
                [
                    "Training improves while validation worsens",
                    "Both losses fall together",
                    "Weights are initialized randomly",
                    "The batch contains labels"
                ],
                0,
                "A widening train–validation gap indicates memorization that does not transfer to unseen data."
            ],
            [
                "What must be done before each ordinary PyTorch batch backward pass?",
                [
                    "Clear accumulated gradients",
                    "Recreate the entire dataset",
                    "Call model.eval()",
                    "Delete the optimizer"
                ],
                0,
                "PyTorch gradients accumulate by default, so optimizer.zero_grad() is normally required before backward()."
            ],
            [
                "Why use model.eval() during validation?",
                [
                    "Switch dropout and normalization layers to inference behaviour",
                    "Train the model faster",
                    "Automatically disable all gradients",
                    "Change the target values"
                ],
                0,
                "eval() changes stateful layer behaviour; torch.no_grad() separately disables gradient tracking."
            ]
        ];

        container.innerHTML = questions
            .map(function (item, questionIndex) {
                return (
                    '<article class="aiml-quiz-question" data-quiz-question="' +
                    questionIndex +
                    '"><strong>' +
                    (questionIndex + 1) +
                    ". " +
                    escapeHtml(item[0]) +
                    '</strong><div class="aiml-quiz-options">' +
                    item[1]
                        .map(function (option, optionIndex) {
                            const id =
                                "quiz-seventeen-" +
                                questionIndex +
                                "-" +
                                optionIndex;

                            return (
                                '<label class="aiml-quiz-option" for="' +
                                id +
                                '">' +
                                '<input type="radio" id="' +
                                id +
                                '" name="quiz-seventeen-' +
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
                                "</span></label>"
                            );
                        })
                        .join("") +
                    '</div><div class="aiml-quiz-explanation" hidden></div></article>'
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
                ) return;

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
                            function (option, optionIndex) {
                                option.classList.remove(
                                    "is-correct",
                                    "is-wrong"
                                );

                                if (optionIndex === item[2]) {
                                    option.classList.add(
                                        "is-correct"
                                    );
                                }
                            }
                        );

                        if (selected) {
                            answered += 1;

                            if (
                                Number(selected.value) ===
                                item[2]
                            ) {
                                correct += 1;
                            } else {
                                options[
                                    Number(selected.value)
                                ].classList.add("is-wrong");
                            }
                        }

                        explanation.hidden = false;

                        explanation.innerHTML =
                            "<strong>Your answer: " +
                            (
                                selected
                                    ? escapeHtml(
                                        item[1][
                                            Number(selected.value)
                                        ]
                                    )
                                    : "Not attempted"
                            ) +
                            "</strong><br>" +
                            "<strong>Correct answer: " +
                            escapeHtml(item[1][item[2]]) +
                            "</strong><br>" +
                            escapeHtml(item[3]);
                    }
                );

                get("quizScore").textContent =
                    correct +
                    " / " +
                    questions.length +
                    " correct" +
                    (
                        answered < questions.length
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

                progress.bestQuizScore = Math.max(
                    Number(
                        progress.bestQuizScore || 0
                    ),
                    correct
                );

                window.localStorage.setItem(
                    PROGRESS_KEY,
                    JSON.stringify(progress)
                );
            }
        );

        get("resetQuiz").disabled = true;

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
                    .forEach(function (explanation) {
                        explanation.hidden = true;
                        explanation.textContent = "";
                    });

                get("quizScore").textContent =
                    "Not checked yet";

                get("resetQuiz").disabled = true;
            }
        );
    }

    function initInterviews() {
        const container = get("interviewList");

        if (!container || container.dataset.cbActive) {
            return;
        }

        container.dataset.cbActive = "true";

        const questions = [
            [
                "What does an artificial neuron calculate?",
                "It calculates a weighted sum of inputs, adds a bias and applies an activation function. During training, its weights and bias are updated using gradients of the loss."
            ],
            [
                "Why are nonlinear activation functions necessary?",
                "Without nonlinear activations, any number of dense layers is equivalent to one linear transformation. Nonlinearity allows the network to learn curved, piecewise and hierarchical functions."
            ],
            [
                "Compare sigmoid, tanh and ReLU.",
                "Sigmoid maps to 0–1 and suits binary probability outputs but saturates. Tanh is zero-centred and bounded but also saturates. ReLU is efficient and preserves positive gradients but may create inactive neurons."
            ],
            [
                "What is forward propagation?",
                "It passes a batch through each layer in order, calculating affine transformations and activations until the network produces logits or predictions used by the loss."
            ],
            [
                "What is backpropagation?",
                "It is reverse-mode differentiation of the computational graph. Starting at scalar loss, it applies the chain rule and reuses intermediate derivatives to calculate every parameter gradient efficiently."
            ],
            [
                "Backpropagation versus gradient descent?",
                "Backpropagation calculates gradients. Gradient descent, momentum or Adam uses those gradients to decide how model parameters should be updated."
            ],
            [
                "What causes vanishing gradients?",
                "Long products of derivatives smaller than one, especially through saturated sigmoid or tanh activations, make gradients reaching early layers extremely small."
            ],
            [
                "What causes exploding gradients?",
                "Long products involving large weights or derivatives can make gradients grow rapidly, causing unstable updates, overflow and sharply changing loss."
            ],
            [
                "Why not initialize all weights to zero?",
                "Hidden neurons would be symmetric: they produce identical outputs, receive identical gradients and continue learning the same feature. Random variance-aware initialization breaks this symmetry."
            ],
            [
                "How do you diagnose overfitting?",
                "Compare training and validation curves. If training improves while validation stops improving or worsens, inspect leakage and use suitable capacity, weight decay, dropout, augmentation or early stopping."
            ],
            [
                "Explain a correct PyTorch training step.",
                "Set training mode, clear gradients, run the forward pass, calculate scalar loss, call loss.backward() and then optimizer.step(). Aggregate metrics without retaining unnecessary graphs."
            ],
            [
                "Design a neural-network experiment.",
                "Define input and target shapes, establish a simple baseline, choose output and loss together, split data correctly, record initialization and hyperparameters, monitor train and validation curves, save the best checkpoint and perform error analysis."
            ]
        ];

        container.innerHTML = questions
            .map(function (item, index) {
                return (
                    '<article class="aiml-interview-item">' +
                    '<div class="aiml-interview-question">' +
                    "<span>" +
                    (index + 1) +
                    ".</span><strong>" +
                    escapeHtml(item[0]) +
                    "</strong>" +
                    '<button type="button" aria-expanded="false">Show Answer</button>' +
                    "</div>" +
                    '<div class="aiml-interview-answer" hidden><p>' +
                    escapeHtml(item[1]) +
                    "</p></div></article>"
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

                if (!button) return;

                const answer =
                    button
                        .closest(".aiml-interview-item")
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
        initNeuronLab();
        initNetworkLab();
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
