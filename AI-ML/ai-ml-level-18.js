(function () {
    "use strict";

    const PROGRESS_KEY = "codebhavya-aiml-level-18-progress-v1";
    const get = function (id) { return document.getElementById(id); };

    function escapeHtml(value) {
        return String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\"/g, "&quot;").replace(/'/g, "&#039;");
    }

    function fixed(value, digits) {
        return Number(value).toFixed(digits === undefined ? 2 : digits);
    }

    function clamp(value, minimum, maximum) {
        return Math.max(minimum, Math.min(maximum, value));
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
        return { context: context, width: width, height: height };
    }

    function matrixPattern(name) {
        const size = 7;
        const matrix = Array.from({ length: size }, function () {
            return new Array(size).fill(0);
        });

        for (let row = 0; row < size; row += 1) {
            for (let column = 0; column < size; column += 1) {
                if (name === "vertical") {
                    matrix[row][column] = column < 3 ? 1 : 8;
                }

                if (name === "horizontal") {
                    matrix[row][column] = row < 3 ? 1 : 8;
                }

                if (name === "cross") {
                    matrix[row][column] = row === 3 || column === 3 ? 9 : 1;
                }

                if (name === "checker") {
                    matrix[row][column] = (row + column) % 2 ? 8 : 1;
                }

                if (name === "spot") {
                    matrix[row][column] =
                        Math.abs(row - 3) <= 1 &&
                        Math.abs(column - 3) <= 1
                            ? 9
                            : 1;
                }
            }
        }

        return matrix;
    }

    function selectedKernel(name) {
        if (name === "horizontal") {
            return [
                [-1, -1, -1],
                [0, 0, 0],
                [1, 1, 1]
            ];
        }

        if (name === "sharpen") {
            return [
                [0, -1, 0],
                [-1, 5, -1],
                [0, -1, 0]
            ];
        }

        if (name === "blur") {
            return [
                [1 / 9, 1 / 9, 1 / 9],
                [1 / 9, 1 / 9, 1 / 9],
                [1 / 9, 1 / 9, 1 / 9]
            ];
        }

        return [
            [-1, 0, 1],
            [-1, 0, 1],
            [-1, 0, 1]
        ];
    }

    function convolve(image, kernel, stride, padding, relu) {
        const paddedSize = image.length + padding * 2;
        const padded = Array.from({ length: paddedSize }, function () {
            return new Array(paddedSize).fill(0);
        });

        image.forEach(function (row, rowIndex) {
            row.forEach(function (value, columnIndex) {
                padded[rowIndex + padding][columnIndex + padding] = value;
            });
        });

        const outputSize =
            Math.floor((paddedSize - kernel.length) / stride) + 1;

        const raw = [];
        const output = [];
        const positions = [];

        for (let row = 0; row < outputSize; row += 1) {
            const rawRow = [];
            const outputRow = [];

            for (let column = 0; column < outputSize; column += 1) {
                let sum = 0;
                const terms = [];

                for (let kr = 0; kr < kernel.length; kr += 1) {
                    for (let kc = 0; kc < kernel.length; kc += 1) {
                        const sourceRow = row * stride + kr;
                        const sourceColumn = column * stride + kc;
                        const imageValue = padded[sourceRow][sourceColumn];
                        const kernelValue = kernel[kr][kc];

                        sum += imageValue * kernelValue;

                        terms.push({
                            image: imageValue,
                            kernel: kernelValue
                        });
                    }
                }

                rawRow.push(sum);
                outputRow.push(relu ? Math.max(0, sum) : sum);

                positions.push({
                    row: row,
                    column: column,
                    inputRow: row * stride,
                    inputColumn: column * stride,
                    raw: sum,
                    output: relu ? Math.max(0, sum) : sum,
                    terms: terms
                });
            }

            raw.push(rawRow);
            output.push(outputRow);
        }

        return {
            padded: padded,
            raw: raw,
            output: output,
            positions: positions,
            outputSize: outputSize
        };
    }

    function heatColor(value, minimum, maximum) {
        const range = maximum - minimum || 1;
        const ratio = clamp((value - minimum) / range, 0, 1);
        const red = Math.round(25 + ratio * 225);
        const blue = Math.round(235 - ratio * 185);
        const green = Math.round(
            95 + (1 - Math.abs(ratio - 0.5) * 2) * 90
        );

        return "rgb(" + red + "," + green + "," + blue + ")";
    }

    function drawMatrix(
        context,
        matrix,
        x,
        y,
        availableWidth,
        title,
        activeCell,
        patch
    ) {
        const rows = matrix.length;
        const columns = matrix[0].length;
        const cell = Math.min(36, availableWidth / columns);
        const width = cell * columns;
        const values = matrix.flat();
        const minimum = Math.min.apply(null, values);
        const maximum = Math.max.apply(null, values);

        context.fillStyle = "#7dd3fc";
        context.font = "900 11px Arial";
        context.textAlign = "left";
        context.fillText(title, x, y - 14);

        for (let row = 0; row < rows; row += 1) {
            for (let column = 0; column < columns; column += 1) {
                const px = x + column * cell;
                const py = y + row * cell;

                context.fillStyle = heatColor(
                    matrix[row][column],
                    minimum,
                    maximum
                );

                context.fillRect(
                    px + 1,
                    py + 1,
                    cell - 2,
                    cell - 2
                );

                context.fillStyle = "#061426";
                context.textAlign = "center";
                context.font =
                    "800 " + (cell < 27 ? 9 : 11) + "px Arial";

                context.fillText(
                    Math.abs(matrix[row][column]) < 1 &&
                    matrix[row][column] !== 0
                        ? fixed(matrix[row][column], 1)
                        : fixed(matrix[row][column], 0),
                    px + cell / 2,
                    py + cell / 2 + 4
                );
            }
        }

        if (activeCell) {
            context.strokeStyle = "#facc15";
            context.lineWidth = 3;

            context.strokeRect(
                x + activeCell.column * cell + 1,
                y + activeCell.row * cell + 1,
                cell - 2,
                cell - 2
            );
        }

        if (patch) {
            context.strokeStyle = "#f472b6";
            context.lineWidth = 4;

            context.strokeRect(
                x + patch.column * cell,
                y + patch.row * cell,
                patch.size * cell,
                patch.size * cell
            );
        }

        context.textAlign = "left";

        return {
            width: width,
            height: rows * cell,
            cell: cell
        };
    }

    function initKernelLab() {
        const canvas = get("kernelCanvas");

        if (!canvas || canvas.dataset.cbActive) {
            return;
        }

        canvas.dataset.cbActive = "true";

        const imageInput = get("kernelImage");
        const typeInput = get("kernelType");
        const strideInput = get("kernelStride");
        const paddingInput = get("kernelPadding");
        const reluInput = get("kernelRelu");
        const nextButton = get("kernelNext");
        const autoButton = get("kernelAuto");
        const pauseButton = get("kernelPause");
        const resetButton = get("kernelReset");

        let step = 0;
        let timer = null;

        function calculation() {
            const image = matrixPattern(imageInput.value);
            const kernel = selectedKernel(typeInput.value);

            return {
                image: image,
                kernel: kernel,
                result: convolve(
                    image,
                    kernel,
                    Number(strideInput.value),
                    Number(paddingInput.value),
                    reluInput.checked
                )
            };
        }

        function stop() {
            if (timer !== null) {
                window.clearInterval(timer);
            }

            timer = null;
            pauseButton.disabled = true;
        }

        function draw() {
            const data = calculation();
            const prepared = prepareCanvas(canvas, 500, 870);
            const context = prepared.context;
            const width = prepared.width;
            const mobile = width < 560;

            context.fillStyle = "#061426";
            context.fillRect(
                0,
                0,
                prepared.width,
                prepared.height
            );

            const current = step
                ? data.result.positions[
                    Math.min(
                        step - 1,
                        data.result.positions.length - 1
                    )
                ]
                : null;

            const padding = Number(paddingInput.value);

            if (mobile) {
                const imageX = Math.max(
                    20,
                    (width - Math.min(294, width - 40)) / 2
                );

                const imageDrawn = drawMatrix(
                    context,
                    data.result.padded,
                    imageX,
                    55,
                    width - 40,
                    "PADDED INPUT",
                    null,
                    current
                        ? {
                            row: current.inputRow,
                            column: current.inputColumn,
                            size: 3
                        }
                        : null
                );

                const kernelX =
                    (width - Math.min(150, width - 60)) / 2;

                drawMatrix(
                    context,
                    data.kernel,
                    kernelX,
                    55 + imageDrawn.height + 70,
                    Math.min(150, width - 60),
                    "SHARED 3 × 3 KERNEL"
                );

                const outputX = Math.max(
                    20,
                    (width - Math.min(250, width - 40)) / 2
                );

                drawMatrix(
                    context,
                    data.result.output,
                    outputX,
                    55 + imageDrawn.height + 235,
                    Math.min(250, width - 40),
                    "CALCULATED FEATURE MAP",
                    current
                        ? {
                            row: current.row,
                            column: current.column
                        }
                        : null
                );
            } else {
                const inputX = 28;

                const inputDrawn = drawMatrix(
                    context,
                    data.result.padded,
                    inputX,
                    80,
                    width * 0.38,
                    "PADDED INPUT",
                    null,
                    current
                        ? {
                            row: current.inputRow,
                            column: current.inputColumn,
                            size: 3
                        }
                        : null
                );

                const kernelX =
                    inputX + inputDrawn.width + 38;

                const kernelDrawn = drawMatrix(
                    context,
                    data.kernel,
                    kernelX,
                    130,
                    Math.min(125, width * 0.18),
                    "SHARED KERNEL"
                );

                context.fillStyle = "#facc15";
                context.font = "900 22px Arial";

                context.fillText(
                    "→",
                    kernelX + kernelDrawn.width + 13,
                    190
                );

                const outputX =
                    kernelX + kernelDrawn.width + 55;

                drawMatrix(
                    context,
                    data.result.output,
                    outputX,
                    80,
                    width - outputX - 25,
                    "FEATURE MAP",
                    current
                        ? {
                            row: current.row,
                            column: current.column
                        }
                        : null
                );

                drawRounded(
                    context,
                    28,
                    390,
                    width - 56,
                    78,
                    14
                );

                context.fillStyle = "#0b2038";
                context.fill();
                context.strokeStyle = "#315775";
                context.stroke();

                context.fillStyle = "#9fc3df";
                context.font = "700 13px Arial";

                context.fillText(
                    "Padding " +
                    padding +
                    " • stride " +
                    strideInput.value +
                    " • kernel 3×3 • ReLU " +
                    (reluInput.checked ? "on" : "off"),
                    48,
                    421
                );

                context.fillStyle = "#fde047";
                context.font = "900 14px Arial";

                context.fillText(
                    current
                        ? "Current output [" +
                            current.row +
                            ", " +
                            current.column +
                            "] = " +
                            fixed(current.output, 2)
                        : "Press Inspect First Patch to begin the calculation.",
                    48,
                    449
                );
            }
        }

        function render() {
            const data = calculation();
            const complete =
                step >= data.result.positions.length;

            const current = step
                ? data.result.positions[
                    Math.min(
                        step - 1,
                        data.result.positions.length - 1
                    )
                ]
                : null;

            get("kernelPatch").textContent = current
                ? "[" + current.row + ", " + current.column + "]"
                : "Ready";

            get("kernelRaw").textContent = current
                ? fixed(current.raw, 2)
                : "—";

            get("kernelOutput").textContent = current
                ? fixed(current.output, 2)
                : "—";

            get("kernelShape").textContent =
                data.result.outputSize +
                " × " +
                data.result.outputSize;

            if (!current) {
                get("kernelVerdict").textContent =
                    "Choose a pattern and inspect its first patch.";

                get("kernelEquation").textContent =
                    "Waiting for convolution";

                get("kernelExplanation").textContent =
                    "The kernel will reuse the same weights at every spatial position.";

                get("kernelNextCheck").textContent =
                    "Predict where the strongest filter response will appear.";
            } else {
                const terms = current.terms.map(function (term) {
                    return (
                        fixed(term.image, 1) +
                        "×" +
                        fixed(term.kernel, 1)
                    );
                });

                get("kernelEquation").textContent =
                    terms.join(" + ") +
                    " = " +
                    fixed(current.raw, 2);

                get("kernelVerdict").textContent = complete
                    ? "The complete feature map has been calculated."
                    : "The shared filter is evaluating patch " +
                        step +
                        " of " +
                        data.result.positions.length +
                        ".";

                get("kernelExplanation").textContent =
                    reluInput.checked && current.raw < 0
                        ? "The raw response is negative, so ReLU clips it to zero."
                        : "The aligned patch values were multiplied by the kernel and summed.";

                get("kernelNextCheck").textContent = complete
                    ? "Change the image or kernel and compare the response geometry."
                    : "Predict whether the next patch will produce a stronger or weaker response.";
            }

            nextButton.textContent = complete
                ? "Feature Map Complete"
                : step === 0
                    ? "Inspect First Patch"
                    : "Next Patch";

            nextButton.disabled = complete;
            autoButton.disabled = complete || timer !== null;
            pauseButton.disabled = timer === null;

            if (complete) {
                stop();
            }

            draw();
        }

        function advance() {
            const count =
                calculation().result.positions.length;

            if (step < count) {
                step += 1;
            }

            render();
        }

        function reset() {
            stop();
            step = 0;
            render();
        }

        nextButton.addEventListener("click", advance);

        autoButton.addEventListener("click", function () {
            if (timer !== null || nextButton.disabled) {
                return;
            }

            timer = window.setInterval(advance, 500);
            render();
        });

        pauseButton.addEventListener("click", function () {
            stop();
            render();
        });

        resetButton.addEventListener("click", reset);

        [
            imageInput,
            typeInput,
            strideInput,
            paddingInput,
            reluInput
        ].forEach(function (input) {
            input.addEventListener("change", reset);
        });

        window.addEventListener("resize", draw);
        render();
        window.requestAnimationFrame(draw);
    }

    function architectureDefinition(name) {
        if (name === "deep") {
            return [
                {
                    name: "Conv 3×3",
                    type: "conv",
                    out: 32,
                    kernel: 3,
                    stride: 1,
                    padding: 1
                },
                {
                    name: "Conv 3×3",
                    type: "conv",
                    out: 32,
                    kernel: 3,
                    stride: 1,
                    padding: 1
                },
                {
                    name: "MaxPool",
                    type: "pool",
                    kernel: 2,
                    stride: 2,
                    padding: 0
                },
                {
                    name: "Conv 3×3",
                    type: "conv",
                    out: 64,
                    kernel: 3,
                    stride: 1,
                    padding: 1
                },
                {
                    name: "Conv 3×3",
                    type: "conv",
                    out: 64,
                    kernel: 3,
                    stride: 1,
                    padding: 1
                },
                {
                    name: "MaxPool",
                    type: "pool",
                    kernel: 2,
                    stride: 2,
                    padding: 0
                },
                {
                    name: "Conv 3×3",
                    type: "conv",
                    out: 128,
                    kernel: 3,
                    stride: 1,
                    padding: 1
                },
                {
                    name: "Global AvgPool",
                    type: "gap"
                },
                {
                    name: "Dense 10",
                    type: "dense",
                    out: 10
                }
            ];
        }

        if (name === "mobile") {
            return [
                {
                    name: "Conv 3×3 /2",
                    type: "conv",
                    out: 16,
                    kernel: 3,
                    stride: 2,
                    padding: 1
                },
                {
                    name: "Depthwise 3×3",
                    type: "depthwise",
                    kernel: 3,
                    stride: 1,
                    padding: 1
                },
                {
                    name: "Pointwise 1×1",
                    type: "conv",
                    out: 32,
                    kernel: 1,
                    stride: 1,
                    padding: 0
                },
                {
                    name: "Depthwise 3×3 /2",
                    type: "depthwise",
                    kernel: 3,
                    stride: 2,
                    padding: 1
                },
                {
                    name: "Pointwise 1×1",
                    type: "conv",
                    out: 64,
                    kernel: 1,
                    stride: 1,
                    padding: 0
                },
                {
                    name: "Global AvgPool",
                    type: "gap"
                },
                {
                    name: "Dense 10",
                    type: "dense",
                    out: 10
                }
            ];
        }

        return [
            {
                name: "Conv 3×3",
                type: "conv",
                out: 16,
                kernel: 3,
                stride: 1,
                padding: 1
            },
            {
                name: "MaxPool",
                type: "pool",
                kernel: 2,
                stride: 2,
                padding: 0
            },
            {
                name: "Conv 3×3",
                type: "conv",
                out: 32,
                kernel: 3,
                stride: 1,
                padding: 1
            },
            {
                name: "MaxPool",
                type: "pool",
                kernel: 2,
                stride: 2,
                padding: 0
            },
            {
                name: "Conv 3×3",
                type: "conv",
                out: 64,
                kernel: 3,
                stride: 1,
                padding: 1
            },
            {
                name: "Global AvgPool",
                type: "gap"
            },
            {
                name: "Dense 10",
                type: "dense",
                out: 10
            }
        ];
    }

    function inputDefinition(name) {
        if (name === "mnist") {
            return {
                channels: 1,
                height: 28,
                width: 28
            };
        }

        if (name === "imagenet") {
            return {
                channels: 3,
                height: 224,
                width: 224
            };
        }

        return {
            channels: 3,
            height: 32,
            width: 32
        };
    }

    function calculateArchitecture(input, layers, batch) {
        let current = {
            channels: input.channels,
            height: input.height,
            width: input.width
        };

        let parameters = 0;
        let receptive = 1;
        let jump = 1;

        return layers.map(function (layer, index) {
            const before = {
                channels: current.channels,
                height: current.height,
                width: current.width
            };

            let layerParameters = 0;

            if (
                layer.type === "conv" ||
                layer.type === "depthwise"
            ) {
                const outChannels =
                    layer.type === "depthwise"
                        ? current.channels
                        : layer.out;

                current.height =
                    Math.floor(
                        (
                            current.height +
                            2 * layer.padding -
                            layer.kernel
                        ) / layer.stride
                    ) + 1;

                current.width =
                    Math.floor(
                        (
                            current.width +
                            2 * layer.padding -
                            layer.kernel
                        ) / layer.stride
                    ) + 1;

                layerParameters =
                    layer.type === "depthwise"
                        ? (
                            layer.kernel *
                            layer.kernel +
                            1
                        ) * current.channels
                        : (
                            layer.kernel *
                            layer.kernel *
                            current.channels +
                            1
                        ) * outChannels;

                receptive +=
                    (layer.kernel - 1) * jump;

                jump *= layer.stride;
                current.channels = outChannels;
            } else if (layer.type === "pool") {
                current.height =
                    Math.floor(
                        (
                            current.height +
                            2 * layer.padding -
                            layer.kernel
                        ) / layer.stride
                    ) + 1;

                current.width =
                    Math.floor(
                        (
                            current.width +
                            2 * layer.padding -
                            layer.kernel
                        ) / layer.stride
                    ) + 1;

                receptive +=
                    (layer.kernel - 1) * jump;

                jump *= layer.stride;
            } else if (layer.type === "gap") {
                receptive +=
                    (
                        Math.max(
                            current.height,
                            current.width
                        ) - 1
                    ) * jump;

                current.height = 1;
                current.width = 1;
            } else if (layer.type === "dense") {
                layerParameters =
                    (
                        current.channels *
                        current.height *
                        current.width +
                        1
                    ) * layer.out;

                current = {
                    channels: layer.out,
                    height: 1,
                    width: 1
                };
            }

            parameters += layerParameters;

            const activations =
                batch *
                current.channels *
                current.height *
                current.width;

            return {
                index: index,
                name: layer.name,
                type: layer.type,
                before: before,
                after: {
                    channels: current.channels,
                    height: current.height,
                    width: current.width
                },
                layerParameters: layerParameters,
                parameters: parameters,
                receptive: receptive,
                jump: jump,
                memoryMB:
                    activations *
                    4 /
                    (1024 * 1024)
            };
        });
    }

    function shapeText(shape) {
        return (
            shape.channels +
            "×" +
            shape.height +
            "×" +
            shape.width
        );
    }

    function formatInteger(value) {
        return Math.round(value).toLocaleString("en-US");
    }

    function initArchitectureLab() {
        const canvas = get("cnnCanvas");

        if (!canvas || canvas.dataset.cbActive) {
            return;
        }

        canvas.dataset.cbActive = "true";

        const inputSelect = get("cnnInput");
        const architectureSelect = get("cnnArchitecture");
        const batchSelect = get("cnnBatch");
        const nextButton = get("cnnNext");
        const autoButton = get("cnnAuto");
        const pauseButton = get("cnnPause");
        const resetButton = get("cnnReset");

        let step = 0;
        let timer = null;

        function values() {
            const input =
                inputDefinition(inputSelect.value);

            const layers =
                architectureDefinition(
                    architectureSelect.value
                );

            const calculations =
                calculateArchitecture(
                    input,
                    layers,
                    Number(batchSelect.value)
                );

            return {
                input: input,
                layers: layers,
                calculations: calculations
            };
        }

        function stop() {
            if (timer !== null) {
                window.clearInterval(timer);
            }

            timer = null;
            pauseButton.disabled = true;
        }

        function draw() {
            const data = values();
            const prepared = prepareCanvas(
                canvas,
                500,
                760
            );

            const context = prepared.context;
            const width = prepared.width;
            const mobile = width < 560;

            context.fillStyle = "#061426";

            context.fillRect(
                0,
                0,
                prepared.width,
                prepared.height
            );

            const nodes = [
                {
                    name: "Input",
                    shape: shapeText(data.input),
                    type: "input"
                }
            ].concat(
                data.calculations.map(function (layer) {
                    return {
                        name: layer.name,
                        shape: shapeText(layer.after),
                        type: layer.type
                    };
                })
            );

            if (mobile) {
                nodes.forEach(function (node, index) {
                    const y = 28 + index * 70;

                    drawRounded(
                        context,
                        30,
                        y,
                        width - 60,
                        52,
                        12
                    );

                    context.fillStyle =
                        index === step
                            ? "#173d5e"
                            : "#0b2038";

                    context.fill();

                    context.strokeStyle =
                        index === step
                            ? "#facc15"
                            : index < step
                                ? "#22d3ee"
                                : "#315775";

                    context.lineWidth =
                        index === step ? 3 : 1.5;

                    context.stroke();

                    context.fillStyle = "#f8fafc";
                    context.font = "900 12px Arial";

                    context.fillText(
                        node.name,
                        48,
                        y + 21
                    );

                    context.fillStyle = "#7dd3fc";
                    context.font = "800 11px Arial";

                    context.fillText(
                        node.shape,
                        48,
                        y + 40
                    );
                });
            } else {
                const columns =
                    Math.min(5, nodes.length);

                const cardWidth =
                    Math.min(
                        145,
                        (width - 76) / columns - 12
                    );

                nodes.forEach(function (node, index) {
                    const row =
                        Math.floor(index / columns);

                    const column =
                        index % columns;

                    const x =
                        30 +
                        column *
                        ((width - 60) / columns) +
                        4;

                    const y =
                        75 + row * 165;

                    drawRounded(
                        context,
                        x,
                        y,
                        cardWidth,
                        105,
                        14
                    );

                    context.fillStyle =
                        index === step
                            ? "#173d5e"
                            : "#0b2038";

                    context.fill();

                    context.strokeStyle =
                        index === step
                            ? "#facc15"
                            : index < step
                                ? "#22d3ee"
                                : "#315775";

                    context.lineWidth =
                        index === step ? 3 : 1.5;

                    context.stroke();

                    context.fillStyle = "#f8fafc";
                    context.font = "900 12px Arial";

                    context.fillText(
                        node.name,
                        x + 14,
                        y + 32
                    );

                    context.fillStyle = "#7dd3fc";
                    context.font = "800 12px Arial";

                    context.fillText(
                        node.shape,
                        x + 14,
                        y + 59
                    );

                    context.fillStyle = "#91a9c0";
                    context.font = "700 10px Arial";

                    context.fillText(
                        node.type.toUpperCase(),
                        x + 14,
                        y + 84
                    );

                    if (
                        column < columns - 1 &&
                        index < nodes.length - 1
                    ) {
                        context.fillStyle = "#facc15";
                        context.font = "900 18px Arial";

                        context.fillText(
                            "→",
                            x + cardWidth + 3,
                            y + 58
                        );
                    }
                });

                const current = step
                    ? data.calculations[step - 1]
                    : null;

                drawRounded(
                    context,
                    30,
                    415,
                    width - 60,
                    58,
                    12
                );

                context.fillStyle = "#0b2038";
                context.fill();
                context.strokeStyle = "#315775";
                context.stroke();

                context.fillStyle = "#9fc3df";
                context.font = "700 12px Arial";

                context.fillText(
                    current
                        ? "Current layer: " +
                            current.name +
                            " • jump " +
                            current.jump +
                            " • receptive field " +
                            current.receptive +
                            "×" +
                            current.receptive
                        : "Start with " +
                            shapeText(data.input) +
                            " and propagate one layer at a time.",
                    48,
                    450
                );
            }
        }

        function render() {
            const data = values();
            const complete =
                step >= data.calculations.length;

            const current = step
                ? data.calculations[
                    Math.min(
                        step - 1,
                        data.calculations.length - 1
                    )
                ]
                : null;

            get("cnnLayer").textContent =
                current ? current.name : "Input";

            get("cnnOutputShape").textContent =
                current
                    ? shapeText(current.after)
                    : shapeText(data.input);

            get("cnnParameters").textContent =
                current
                    ? formatInteger(current.parameters)
                    : "0";

            get("cnnReceptive").textContent =
                current
                    ? current.receptive +
                        " × " +
                        current.receptive
                    : "1 × 1";

            const inputMemory =
                Number(batchSelect.value) *
                data.input.channels *
                data.input.height *
                data.input.width *
                4 /
                (1024 * 1024);

            get("cnnMemory").textContent =
                fixed(
                    current
                        ? current.memoryMB
                        : inputMemory,
                    2
                ) + " MB";

            get("cnnLayerDetails").innerHTML =
                data.calculations.map(
                    function (layer, index) {
                        const stateClass =
                            index === step - 1
                                ? ' class="is-active"'
                                : "";

                        return (
                            "<article" +
                            stateClass +
                            "><span>" +
                            (index + 1) +
                            ". " +
                            escapeHtml(layer.name) +
                            "</span><strong>" +
                            shapeText(layer.after) +
                            " • " +
                            formatInteger(
                                layer.layerParameters
                            ) +
                            " params</strong></article>"
                        );
                    }
                ).join("");

            if (!current) {
                get("cnnVerdict").textContent =
                    "The input tensor is ready.";

                get("cnnExplanation").textContent =
                    "Propagate the first layer to begin calculating the spatial hierarchy.";

                get("cnnNextCheck").textContent =
                    "Predict which layers change spatial size and which change only channels.";
            } else if (complete) {
                get("cnnVerdict").textContent =
                    "The complete architecture has been shape-checked.";

                get("cnnExplanation").textContent =
                    "The network ends at " +
                    shapeText(current.after) +
                    " with " +
                    formatInteger(current.parameters) +
                    " trainable parameters.";

                get("cnnNextCheck").textContent =
                    "Compare architectures and explain the accuracy–memory–latency trade-off.";
            } else {
                get("cnnVerdict").textContent =
                    current.name +
                    " produced " +
                    shapeText(current.after) +
                    ".";

                get("cnnExplanation").textContent =
                    "This layer added " +
                    formatInteger(
                        current.layerParameters
                    ) +
                    " parameters and expanded the receptive field to " +
                    current.receptive +
                    "×" +
                    current.receptive +
                    ".";

                get("cnnNextCheck").textContent =
                    "Predict the next output shape before propagating it.";
            }

            nextButton.textContent = complete
                ? "Architecture Complete"
                : step === 0
                    ? "Propagate First Layer"
                    : "Propagate Next Layer";

            nextButton.disabled = complete;
            autoButton.disabled =
                complete || timer !== null;

            pauseButton.disabled =
                timer === null;

            if (complete) {
                stop();
            }

            draw();
        }

        function advance() {
            const count =
                values().calculations.length;

            if (step < count) {
                step += 1;
            }

            render();
        }

        function reset() {
            stop();
            step = 0;
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
                    timer !== null ||
                    nextButton.disabled
                ) {
                    return;
                }

                timer = window.setInterval(
                    advance,
                    720
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
            inputSelect,
            architectureSelect,
            batchSelect
        ].forEach(function (input) {
            input.addEventListener(
                "change",
                reset
            );
        });

        window.addEventListener("resize", draw);
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
        ) {
            return;
        }

        codeContainer.dataset.cbActive = "true";

        const lines = [
            "image = [[1,2,0,1], [3,1,2,2], [0,1,3,1], [2,2,1,0]]",
            "kernel = [[1,0], [0,-1]]",
            "output = []",
            "for row in range(3):",
            "    output_row = []",
            "    for col in range(3):",
            "        total = 0",
            "        for kr in range(2):",
            "            for kc in range(2):",
            "                value = image[row+kr][col+kc]",
            "                total += value * kernel[kr][kc]",
            "        output_row.append(total)",
            "    output.append(output_row)",
            "print(output)"
        ];

        function clone(value) {
            return JSON.parse(
                JSON.stringify(value)
            );
        }

        function buildStates() {
            const states = [];

            const image = [
                [1, 2, 0, 1],
                [3, 1, 2, 2],
                [0, 1, 3, 1],
                [2, 2, 1, 0]
            ];

            const kernel = [
                [1, 0],
                [0, -1]
            ];

            const output = [];

            function add(
                line,
                explanation,
                variables,
                expression,
                printed
            ) {
                states.push({
                    line: line,
                    explanation: explanation,
                    variables: clone(variables || {}),
                    expression: expression || "—",
                    output: printed || ""
                });
            }

            add(
                0,
                "Create the 4×4 grayscale input image.",
                { image: image },
                "shape(image) = 4 × 4"
            );

            add(
                1,
                "Create the 2×2 edge-sensitive kernel.",
                { kernel: kernel },
                "shape(kernel) = 2 × 2"
            );

            add(
                2,
                "Create an empty output feature map.",
                { output: output },
                "output = []"
            );

            for (let row = 0; row < 3; row += 1) {
                add(
                    3,
                    "Enter the output-row loop with row = " +
                    row +
                    ".",
                    {
                        row: row,
                        output: output
                    },
                    "range(3) gives output row " + row
                );

                const outputRow = [];

                add(
                    4,
                    "Create a fresh list for this output row.",
                    {
                        row: row,
                        output_row: outputRow
                    },
                    "output_row = []"
                );

                for (
                    let column = 0;
                    column < 3;
                    column += 1
                ) {
                    add(
                        5,
                        "Enter the output-column loop with col = " +
                        column +
                        ".",
                        {
                            row: row,
                            col: column,
                            output_row: outputRow
                        },
                        "calculate output[" +
                        row +
                        "][" +
                        column +
                        "]"
                    );

                    let total = 0;

                    add(
                        6,
                        "Reset the patch dot product to zero.",
                        {
                            row: row,
                            col: column,
                            total: total
                        },
                        "total = 0"
                    );

                    for (
                        let kr = 0;
                        kr < 2;
                        kr += 1
                    ) {
                        add(
                            7,
                            "Enter kernel row kr = " +
                            kr +
                            ".",
                            {
                                row: row,
                                col: column,
                                kr: kr,
                                total: total
                            },
                            "kernel row " + kr
                        );

                        for (
                            let kc = 0;
                            kc < 2;
                            kc += 1
                        ) {
                            add(
                                8,
                                "Enter kernel column kc = " +
                                kc +
                                ".",
                                {
                                    row: row,
                                    col: column,
                                    kr: kr,
                                    kc: kc,
                                    total: total
                                },
                                "kernel[" +
                                kr +
                                "][" +
                                kc +
                                "]"
                            );

                            const value =
                                image[
                                    row + kr
                                ][
                                    column + kc
                                ];

                            add(
                                9,
                                "Read the aligned input value from the current patch.",
                                {
                                    row: row,
                                    col: column,
                                    kr: kr,
                                    kc: kc,
                                    value: value
                                },
                                "image[" +
                                (row + kr) +
                                "][" +
                                (column + kc) +
                                "] = " +
                                value
                            );

                            const product =
                                value *
                                kernel[kr][kc];

                            total += product;

                            add(
                                10,
                                "Multiply by the kernel weight and accumulate.",
                                {
                                    value: value,
                                    weight:
                                        kernel[kr][kc],
                                    product: product,
                                    total: total
                                },
                                value +
                                " × " +
                                kernel[kr][kc] +
                                " → total " +
                                total
                            );
                        }
                    }

                    outputRow.push(total);

                    add(
                        11,
                        "Append the completed patch response to the current row.",
                        {
                            row: row,
                            col: column,
                            total: total,
                            output_row: outputRow
                        },
                        "output_row.append(" +
                        total +
                        ")"
                    );
                }

                output.push(outputRow);

                add(
                    12,
                    "Append the completed row to the feature map.",
                    {
                        row: row,
                        output_row: outputRow,
                        output: output
                    },
                    "output now has " +
                    output.length +
                    " row(s)"
                );
            }

            add(
                13,
                "Print the calculated 3×3 feature map.",
                { output: output },
                "print(output)",
                JSON.stringify(output)
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

        codeContainer.innerHTML = lines.map(
            function (line, index) {
                return (
                    '<div class="aiml-code-line" data-line="' +
                    index +
                    '"><span>' +
                    String(index + 1).padStart(2, "0") +
                    "</span><code>" +
                    escapeHtml(line) +
                    "</code></div>"
                );
            }
        ).join("");

        function stop() {
            if (timer !== null) {
                window.clearInterval(timer);
            }

            timer = null;
            pause.disabled = true;
        }

        function formatValue(value) {
            if (typeof value === "number") {
                return String(value);
            }

            return JSON.stringify(value);
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
                    ? Object.keys(variables).map(
                        function (key) {
                            return (
                                '<article class="aiml-variable"><span>' +
                                escapeHtml(key) +
                                "</span><code>" +
                                escapeHtml(
                                    formatValue(
                                        variables[key]
                                    )
                                ) +
                                "</code></article>"
                            );
                        }
                    ).join("")
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
                    window.setTimeout(function () {
                        panel.scrollIntoView({
                            behavior: "smooth",
                            block: "nearest"
                        });
                    }, 50);
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

        next.addEventListener("click", advance);

        auto.addEventListener(
            "click",
            function () {
                if (
                    step >= states.length ||
                    timer !== null
                ) {
                    return;
                }

                timer = window.setInterval(
                    advance,
                    230
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

        if (!list || list.dataset.cbActive) {
            return;
        }

        list.dataset.cbActive = "true";

        const problems = [
            {
                title: "Calculate One Convolution Output",
                description: "Calculate the dot product between a 2×2 image patch and kernel.",
                sampleInput: "patch=[[1,2],[3,4]], kernel=[[1,0],[0,-1]]",
                expected: "-3",
                hint: "Use two nested loops and add patch[row][col] * kernel[row][col].",
                starter: "patch = [[1, 2], [3, 4]]\nkernel = [[1, 0], [0, -1]]\n# Calculate the convolution response\n",
                solution: "patch = [[1, 2], [3, 4]]\nkernel = [[1, 0], [0, -1]]\ntotal = 0\nfor row in range(2):\n    for col in range(2):\n        total += patch[row][col] * kernel[row][col]\nprint(total)",
                required: [
                    ["for"],
                    ["range("],
                    ["patch[row][col]"],
                    ["kernel[row][col]"],
                    ["total +=", "total+="],
                    ["print("]
                ]
            },
            {
                title: "Calculate Convolution Output Size",
                description: "Calculate output height for input, kernel, padding and stride.",
                sampleInput: "H=32, K=3, P=1, S=2",
                expected: "16",
                hint: "Use floor((H + 2P − K) / S) + 1.",
                starter: "height, kernel, padding, stride = 32, 3, 1, 2\n# Calculate output height\n",
                solution: "height, kernel, padding, stride = 32, 3, 1, 2\noutput_height = (height + 2 * padding - kernel) // stride + 1\nprint(output_height)",
                required: [
                    ["padding"],
                    ["kernel"],
                    ["stride"],
                    ["//"],
                    ["+ 1", "+1"],
                    ["print("]
                ]
            },
            {
                title: "Run 2×2 Max Pooling",
                description: "Reduce a 4×4 feature map using non-overlapping max pooling.",
                sampleInput: "4×4 feature map",
                expected: "[[6,8],[7,9]]",
                hint: "Move by two rows and columns and take max from every 2×2 region.",
                starter: "feature = [[1, 3, 2, 4], [5, 6, 7, 8], [2, 1, 4, 3], [6, 7, 8, 9]]\n# Apply 2x2 max pooling\n",
                solution: "feature = [[1, 3, 2, 4], [5, 6, 7, 8], [2, 1, 4, 3], [6, 7, 8, 9]]\npooled = []\nfor row in range(0, 4, 2):\n    output_row = []\n    for col in range(0, 4, 2):\n        values = [feature[row+i][col+j] for i in range(2) for j in range(2)]\n        output_row.append(max(values))\n    pooled.append(output_row)\nprint(pooled)",
                required: [
                    [
                        "range(0, 4, 2)",
                        "range(0,4,2)"
                    ],
                    ["max("],
                    ["append("],
                    ["pooled"],
                    ["print("]
                ]
            },
            {
                title: "Count Convolution Parameters",
                description: "Count weights and biases for a convolutional layer.",
                sampleInput: "Cin=3, Cout=32, K=3",
                expected: "896",
                hint: "Each of 32 filters contains 3×3×3 weights and one bias.",
                starter: "input_channels = 3\noutput_channels = 32\nkernel_size = 3\n# Count trainable parameters\n",
                solution: "input_channels = 3\noutput_channels = 32\nkernel_size = 3\nweights = kernel_size * kernel_size * input_channels * output_channels\nbiases = output_channels\nparameters = weights + biases\nprint(parameters)",
                required: [
                    ["input_channels"],
                    ["output_channels"],
                    [
                        "kernel_size * kernel_size",
                        "kernel_size*kernel_size"
                    ],
                    ["biases"],
                    ["print("]
                ]
            },
            {
                title: "Calculate Bounding-Box IoU",
                description: "Calculate intersection over union for two axis-aligned boxes.",
                sampleInput: "A=(0,0,4,4), B=(2,2,6,6)",
                expected: "4/28 ≈ 0.143",
                hint: "Calculate intersection width and height, then divide intersection area by union area.",
                starter: "box_a = (0, 0, 4, 4)\nbox_b = (2, 2, 6, 6)\n# Calculate intersection over union\n",
                solution: "box_a = (0, 0, 4, 4)\nbox_b = (2, 2, 6, 6)\nleft = max(box_a[0], box_b[0])\ntop = max(box_a[1], box_b[1])\nright = min(box_a[2], box_b[2])\nbottom = min(box_a[3], box_b[3])\nintersection = max(0, right-left) * max(0, bottom-top)\narea_a = (box_a[2]-box_a[0]) * (box_a[3]-box_a[1])\narea_b = (box_b[2]-box_b[0]) * (box_b[3]-box_b[1])\nunion = area_a + area_b - intersection\nprint(round(intersection / union, 3))",
                required: [
                    ["max("],
                    ["min("],
                    ["intersection"],
                    ["union"],
                    ["area_a"],
                    ["area_b"],
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

            current.problemScores =
                scores;

            window.localStorage.setItem(
                PROGRESS_KEY,
                JSON.stringify(current)
            );
        }

        function updateSummary() {
            const total =
                Object.values(scores).reduce(
                    function (sum, score) {
                        return (
                            sum +
                            Number(score || 0)
                        );
                    },
                    0
                );

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

        list.innerHTML =
            problems.map(function (problem, index) {
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
                    '<button type="button" class="primary" data-action="workspace">💻 Solve It Yourself</button>' +
                    '<button type="button" class="hint" data-action="hint">Hint</button>' +
                    '<button type="button" data-action="solution">Show Program</button>' +
                    "</div>" +
                    '<div class="aiml-problem-reveal" data-panel="hint" hidden>' +
                    "<strong>Hint</strong><p>" +
                    escapeHtml(problem.hint) +
                    "</p></div>" +
                    '<div class="aiml-problem-reveal" data-panel="solution" hidden>' +
                    "<strong>Model program</strong><pre><code>" +
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
            }).join("");

        function togglePanel(
            card,
            name,
            button,
            closedText,
            openText
        ) {
            const section =
                card.querySelector(
                    '[data-panel="' +
                    name +
                    '"]'
                );

            if (!section) {
                return;
            }

            const opening = section.hidden;
            section.hidden = !opening;

            button.textContent =
                opening
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

                const problem =
                    problems[index];

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
                            "Not complete yet. Recheck the required computer-vision logic.";

                        return;
                    }

                    const score =
                        revealed.has(index)
                            ? 60
                            : 100;

                    solved.add(index);

                    scores[index] = Math.max(
                        Number(scores[index] || 0),
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
            container.dataset.cbActive
        ) {
            return;
        }

        container.dataset.cbActive = "true";

        const questions = [
            [
                "What does one convolution filter produce?",
                [
                    "One feature map",
                    "One complete dataset",
                    "Only a class label",
                    "One training epoch"
                ],
                0,
                "One filter reuses its weights across spatial locations and produces one output feature map."
            ],
            [
                "What controls convolution output spatial size?",
                [
                    "Input size, kernel, padding, stride and dilation",
                    "Only output channels",
                    "Only batch size",
                    "Only learning rate"
                ],
                0,
                "Spatial dimensions follow the convolution output formula using input, kernel, padding, stride and dilation."
            ],
            [
                "Why does convolution use fewer parameters than a dense image layer?",
                [
                    "Weights are shared across locations and connectivity is local",
                    "Images contain no numbers",
                    "CNNs have no biases",
                    "Pooling learns all weights"
                ],
                0,
                "A small filter is reused across the image instead of learning an independent weight for every pixel-to-unit connection."
            ],
            [
                "What does max pooling preserve from a window?",
                [
                    "The largest activation",
                    "The mean colour always",
                    "Every original pixel",
                    "The gradient only"
                ],
                0,
                "Max pooling keeps the strongest regional response and discards the remaining values."
            ],
            [
                "What is a receptive field?",
                [
                    "The input region that can influence a feature",
                    "The number of classes",
                    "The optimizer state",
                    "The validation split"
                ],
                0,
                "A unit’s receptive field is the region of the original input capable of affecting that unit."
            ],
            [
                "When is horizontal flipping unsafe?",
                [
                    "When left–right orientation changes the label or meaning",
                    "Whenever images are RGB",
                    "Only when using Adam",
                    "Never"
                ],
                0,
                "Augmentation must preserve the target; text, anatomy and directional scenes can make flips invalid."
            ],
            [
                "What is transfer learning?",
                [
                    "Adapting features learned on a source task to a target task",
                    "Copying validation labels",
                    "Increasing image resolution only",
                    "Replacing every pixel with zero"
                ],
                0,
                "Transfer learning reuses pretrained representations and adapts a task-specific head or part of the backbone."
            ],
            [
                "Which task predicts a class for every pixel?",
                [
                    "Semantic segmentation",
                    "Image classification",
                    "Ranking",
                    "Linear regression only"
                ],
                0,
                "Semantic segmentation produces a dense per-pixel class map."
            ],
            [
                "What does IoU compare?",
                [
                    "Overlap area divided by union area",
                    "Training loss divided by epochs",
                    "Channels divided by pixels",
                    "Precision plus recall"
                ],
                0,
                "Intersection over union measures geometric overlap between predicted and reference regions."
            ],
            [
                "What is a serious vision-data leakage risk?",
                [
                    "Near-duplicate frames or patient images crossing the split",
                    "Using a 3×3 kernel",
                    "Applying ReLU",
                    "Calculating a confusion matrix"
                ],
                0,
                "Related images can make validation artificially easy, so grouping must occur before splitting and augmentation."
            ]
        ];

        container.innerHTML =
            questions.map(
                function (item, questionIndex) {
                    return (
                        '<article class="aiml-quiz-question" data-quiz-question="' +
                        questionIndex +
                        '">' +
                        "<strong>" +
                        (questionIndex + 1) +
                        ". " +
                        escapeHtml(item[0]) +
                        "</strong>" +
                        '<div class="aiml-quiz-options">' +
                        item[1].map(
                            function (
                                option,
                                optionIndex
                            ) {
                                const id =
                                    "quiz-eighteen-" +
                                    questionIndex +
                                    "-" +
                                    optionIndex;

                                return (
                                    '<label class="aiml-quiz-option" for="' +
                                    id +
                                    '">' +
                                    '<input type="radio" id="' +
                                    id +
                                    '" name="quiz-eighteen-' +
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
                            }
                        ).join("") +
                        "</div>" +
                        '<div class="aiml-quiz-explanation" hidden></div>' +
                        "</article>"
                    );
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
                                    item[2]
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
                                Number(selected.value) ===
                                item[2]
                            ) {
                                correct += 1;
                            } else {
                                options[
                                    Number(selected.value)
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
                                        item[1][
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
                                item[1][item[2]]
                            ) +
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

                get("resetQuiz").disabled =
                    false;

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
                    .forEach(
                        function (explanation) {
                            explanation.hidden = true;
                            explanation.textContent = "";
                        }
                    );

                get("quizScore").textContent =
                    "Not checked yet";

                get("resetQuiz").disabled =
                    true;
            }
        );
    }

    function initInterviews() {
        const container = get("interviewList");

        if (
            !container ||
            container.dataset.cbActive
        ) {
            return;
        }

        container.dataset.cbActive = "true";

        const questions = [
            [
                "Why are CNNs effective for images?",
                "They exploit local connectivity, weight sharing and spatial hierarchy. The same filter can detect a pattern across locations while deeper layers compose simple features into complex ones."
            ],
            [
                "Convolution versus cross-correlation?",
                "Mathematical convolution flips the kernel before sliding. Deep-learning libraries generally perform cross-correlation without flipping, but the operation is conventionally called convolution because the weights are learned."
            ],
            [
                "Explain stride and padding.",
                "Stride controls how far the kernel moves and therefore downsampling. Padding adds border values, controlling output size and allowing border pixels to participate in more receptive fields."
            ],
            [
                "How do you calculate convolution parameters?",
                "For standard convolution with bias: (kernel height × kernel width × input channels + 1) × output channels. Spatial input dimensions do not affect the parameter count."
            ],
            [
                "What is a receptive field and why does it matter?",
                "It is the original input region capable of influencing a feature. It must be large enough to capture useful context without destroying the spatial detail required by the task."
            ],
            [
                "Pooling versus strided convolution?",
                "Pooling uses a fixed aggregation rule and adds no parameters. Strided convolution learns the downsampling operation but adds parameters and computation."
            ],
            [
                "Explain transfer learning and fine-tuning.",
                "Transfer learning reuses a pretrained backbone. Begin by training a replacement head, then optionally unfreeze selected backbone layers and fine-tune with a smaller learning rate."
            ],
            [
                "How should image augmentation be selected?",
                "Choose transformations that reflect plausible target-domain variation and preserve labels. Apply geometric transformations consistently to images, boxes and masks."
            ],
            [
                "Classification versus detection versus segmentation?",
                "Classification predicts image-level labels, detection predicts object classes and bounding boxes, and segmentation predicts dense pixel-level regions or individual instance masks."
            ],
            [
                "What is IoU?",
                "Intersection over union is overlap area divided by combined union area. It evaluates boxes or masks and is also used to decide whether detections match ground truth."
            ],
            [
                "How do you diagnose a vision model using background shortcuts?",
                "Inspect saliency and counterfactual examples, remove or vary the background, test objects in new contexts and add data that breaks the spurious correlation."
            ],
            [
                "Design a reliable computer-vision experiment.",
                "Define the image and label contract, split grouped sources safely, establish a transfer-learning baseline, use valid augmentation, track task-specific metrics, inspect errors, test domain shifts and record preprocessing with the checkpoint."
            ]
        ];

        container.innerHTML =
            questions.map(function (item, index) {
                return (
                    '<article class="aiml-interview-item">' +
                    '<div class="aiml-interview-question">' +
                    "<span>" +
                    (index + 1) +
                    ".</span>" +
                    "<strong>" +
                    escapeHtml(item[0]) +
                    "</strong>" +
                    '<button type="button" aria-expanded="false">Show Answer</button>' +
                    "</div>" +
                    '<div class="aiml-interview-answer" hidden>' +
                    "<p>" +
                    escapeHtml(item[1]) +
                    "</p></div></article>"
                );
            }).join("");

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
                    button.closest(
                        ".aiml-interview-item"
                    ).querySelector(
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
        initKernelLab();
        initArchitectureLab();
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
