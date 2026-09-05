(function () {
    "use strict";

    const LEVEL_PROGRESS_KEY = "codebhavya-aiml-level-11-progress-v1";

    function byId(id) {
        return document.getElementById(id);
    }

    function escapeHtml(value) {
        return String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/\"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    function fixed(value, digits) {
        return Number(value).toFixed(digits === undefined ? 3 : digits);
    }

    function clamp(value, minimum, maximum) {
        return Math.min(maximum, Math.max(minimum, value));
    }

    function prepareCanvas(canvas, desktopHeight, mobileHeight) {
        const width = Math.max(280, canvas.clientWidth || 720);
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

    function drawRoundedRect(context, x, y, width, height, radius) {
        const size = Math.min(radius, Math.abs(width) / 2, Math.abs(height) / 2);

        context.beginPath();
        context.moveTo(x + size, y);
        context.arcTo(x + width, y, x + width, y + height, size);
        context.arcTo(x + width, y + height, x, y + height, size);
        context.arcTo(x, y + height, x, y, size);
        context.arcTo(x, y, x + width, y, size);
        context.closePath();
    }

    function initBoostVisualizer() {
        const canvas = byId("boostCanvas");

        if (!canvas) {
            return;
        }

        const datasets = {
            balanced: {
                name: "Balanced with one difficult point",
                labels: [-1, -1, -1, 1, -1, 1, 1, 1, 1, 1]
            },
            noisy: {
                name: "Noisy alternating evidence",
                labels: [-1, 1, -1, -1, 1, 1, -1, 1, 1, -1]
            },
            imbalanced: {
                name: "Imbalanced positive class",
                labels: [-1, -1, 1, 1, 1, 1, -1, 1, 1, 1]
            }
        };

        const datasetInput = byId("boostDataset");
        const thresholdInput = byId("boostThreshold");
        const directionInput = byId("boostDirection");
        const learningRateInput = byId("boostLearningRate");
        const applyButton = byId("boostApply");
        const bestButton = byId("boostBest");
        const autoButton = byId("boostAuto");
        const pauseButton = byId("boostPause");
        const resetButton = byId("boostReset");

        const maximumRounds = 8;

        let samples = [];
        let round = 0;
        let history = [];
        let timer = null;
        let canvasGeometry = null;

        function prediction(x, threshold, direction) {
            const positive =
                direction === "right"
                    ? x >= threshold
                    : x < threshold;

            return positive ? 1 : -1;
        }

        function stopAuto() {
            if (timer !== null) {
                window.clearInterval(timer);
            }

            timer = null;
            pauseButton.disabled = true;
            autoButton.disabled = round >= maximumRounds;
        }

        function resetSamples() {
            const selected = datasets[datasetInput.value];

            samples = selected.labels.map(function (label, index) {
                return {
                    id: index + 1,
                    x: index + 1,
                    label: label,
                    weight: 1 / selected.labels.length,
                    score: 0
                };
            });

            round = 0;
            history = [];
            thresholdInput.value = "5.5";
            directionInput.value = "right";

            stopAuto();
        }

        function selectedStump() {
            return {
                threshold: Number(thresholdInput.value),
                direction: directionInput.value
            };
        }

        function evaluateStump(stump) {
            const rows = samples.map(function (sample) {
                const predicted = prediction(
                    sample.x,
                    stump.threshold,
                    stump.direction
                );

                return {
                    sample: sample,
                    prediction: predicted,
                    mistake: predicted !== sample.label
                };
            });

            const error = rows.reduce(function (total, row) {
                return total + (row.mistake ? row.sample.weight : 0);
            }, 0);

            return {
                stump: stump,
                rows: rows,
                error: error
            };
        }

        function findBestStump() {
            let best = null;

            for (
                let threshold = 1.5;
                threshold <= 9.5;
                threshold += 0.5
            ) {
                ["right", "left"].forEach(function (direction) {
                    const result = evaluateStump({
                        threshold: threshold,
                        direction: direction
                    });

                    if (
                        !best ||
                        result.error < best.error - 1e-12
                    ) {
                        best = result;
                    }
                });
            }

            return best;
        }

        function ensembleMetrics() {
            let correct = 0;
            let loss = 0;

            samples.forEach(function (sample) {
                const ensemblePrediction =
                    sample.score >= 0 ? 1 : -1;

                if (ensemblePrediction === sample.label) {
                    correct += 1;
                }

                loss += Math.exp(
                    -sample.label * sample.score
                );
            });

            return {
                accuracy: correct / samples.length,
                loss: loss / samples.length
            };
        }

        function selectBestStump(showExplanation) {
            const result = findBestStump();

            thresholdInput.value =
                String(result.stump.threshold);

            directionInput.value =
                result.stump.direction;

            if (showExplanation) {
                byId("boostExplanation").textContent =
                    "Every threshold and prediction direction was tested using the current sample weights. This stump has the smallest weighted error for the next boosting round.";
            }

            render();
        }

        function applyRound() {
            if (round >= maximumRounds) {
                stopAuto();
                render();
                return;
            }

            const result =
                evaluateStump(selectedStump());

            if (result.error >= 0.5 - 1e-12) {
                byId("boostExplanation").textContent =
                    "This stump is not better than random under the current weights. Select Find Best Weighted Stump before applying the round.";

                stopAuto();
                render();
                return;
            }

            const safeError = clamp(
                result.error,
                0.000001,
                0.499999
            );

            const learningRate =
                Number(learningRateInput.value);

            const alpha =
                0.5 *
                Math.log(
                    (1 - safeError) / safeError
                ) *
                learningRate;

            let normalizer = 0;

            result.rows.forEach(function (row) {
                row.sample.score +=
                    alpha * row.prediction;

                row.unnormalized =
                    row.sample.weight *
                    Math.exp(
                        -alpha *
                        row.sample.label *
                        row.prediction
                    );

                normalizer += row.unnormalized;
            });

            result.rows.forEach(function (row) {
                row.sample.weight =
                    row.unnormalized / normalizer;
            });

            round += 1;

            history.push({
                round: round,
                threshold: result.stump.threshold,
                direction: result.stump.direction,
                error: result.error,
                alpha: alpha,
                normalizer: normalizer,
                mistakes: result.rows
                    .filter(function (row) {
                        return row.mistake;
                    })
                    .map(function (row) {
                        return row.sample.id;
                    })
            });

            if (round >= maximumRounds) {
                stopAuto();
            }

            render();
        }

        function draw(result) {
            const prepared =
                prepareCanvas(canvas, 430, 340);

            const context = prepared.context;
            const width = prepared.width;
            const height = prepared.height;
            const compact = width < 560;

            const left = compact ? 34 : 54;
            const right = compact ? 22 : 34;
            const top = compact ? 48 : 58;
            const bottom = compact ? 60 : 68;

            const plotWidth =
                width - left - right;

            const positiveY =
                top +
                (height - top - bottom) * 0.28;

            const negativeY =
                top +
                (height - top - bottom) * 0.73;

            function scaleX(value) {
                return (
                    left +
                    ((value - 1) / 9) * plotWidth
                );
            }

            const thresholdX =
                left +
                ((result.stump.threshold - 1) / 9) *
                    plotWidth;

            canvasGeometry = {
                left: left,
                plotWidth: plotWidth
            };

            context.fillStyle = "#061426";
            context.fillRect(0, 0, width, height);

            const positiveStart =
                result.stump.direction === "right"
                    ? thresholdX
                    : left;

            const positiveEnd =
                result.stump.direction === "right"
                    ? left + plotWidth
                    : thresholdX;

            context.fillStyle =
                "rgba(34, 211, 238, .07)";

            context.fillRect(
                positiveStart,
                top - 22,
                Math.max(
                    0,
                    positiveEnd - positiveStart
                ),
                height - top - bottom + 44
            );

            context.fillStyle =
                "rgba(251, 113, 133, .055)";

            if (result.stump.direction === "right") {
                context.fillRect(
                    left,
                    top - 22,
                    Math.max(0, thresholdX - left),
                    height - top - bottom + 44
                );
            } else {
                context.fillRect(
                    thresholdX,
                    top - 22,
                    Math.max(
                        0,
                        left +
                            plotWidth -
                            thresholdX
                    ),
                    height - top - bottom + 44
                );
            }

            context.strokeStyle =
                "rgba(125, 211, 252, .16)";

            context.lineWidth = 1;

            for (let i = 1; i <= 10; i += 1) {
                context.beginPath();
                context.moveTo(
                    scaleX(i),
                    top - 22
                );
                context.lineTo(
                    scaleX(i),
                    height - bottom + 22
                );
                context.stroke();
            }

            context.strokeStyle = "#35546f";
            context.lineWidth = 2;

            context.beginPath();
            context.moveTo(left, positiveY);
            context.lineTo(
                left + plotWidth,
                positiveY
            );
            context.stroke();

            context.beginPath();
            context.moveTo(left, negativeY);
            context.lineTo(
                left + plotWidth,
                negativeY
            );
            context.stroke();

            context.fillStyle = "#7dd3fc";
            context.font =
                "800 12px Inter, Arial";

            context.textAlign = "left";
            context.fillText(
                "TRUE CLASS +1",
                left,
                22
            );

            context.fillStyle = "#fda4af";
            context.fillText(
                "TRUE CLASS −1",
                left,
                height - 20
            );

            context.strokeStyle = "#fde047";
            context.lineWidth = 3;
            context.setLineDash([8, 6]);

            context.beginPath();
            context.moveTo(
                thresholdX,
                top - 30
            );
            context.lineTo(
                thresholdX,
                height - bottom + 30
            );
            context.stroke();

            context.setLineDash([]);

            context.fillStyle = "#fde047";
            context.textAlign = "center";
            context.font =
                "900 11px Inter, Arial";

            context.fillText(
                "threshold " +
                    fixed(
                        result.stump.threshold,
                        1
                    ),
                thresholdX,
                top - 36
            );

            const maximumWeight =
                Math.max.apply(
                    null,
                    samples.map(function (sample) {
                        return sample.weight;
                    })
                );

            result.rows.forEach(function (row) {
                const sample = row.sample;
                const x = scaleX(sample.x);

                const y =
                    sample.label === 1
                        ? positiveY
                        : negativeY;

                const radius =
                    7 +
                    Math.sqrt(
                        sample.weight /
                            maximumWeight
                    ) *
                        (compact ? 12 : 16);

                context.beginPath();
                context.arc(
                    x,
                    y,
                    radius,
                    0,
                    Math.PI * 2
                );

                context.fillStyle =
                    sample.label === 1
                        ? "#22d3ee"
                        : "#fb7185";

                context.fill();

                context.strokeStyle =
                    row.mistake
                        ? "#fde047"
                        : "#e2e8f0";

                context.lineWidth =
                    row.mistake ? 4 : 2;

                context.stroke();

                context.fillStyle = "#061426";
                context.font =
                    "900 10px Inter, Arial";

                context.textAlign = "center";
                context.fillText(
                    String(sample.id),
                    x,
                    y + 3
                );

                const ensemblePrediction =
                    sample.score >= 0 ? 1 : -1;

                const markerY =
                    height - bottom + 43;

                context.fillStyle =
                    ensemblePrediction === 1
                        ? "#67e8f9"
                        : "#fda4af";

                context.beginPath();
                context.moveTo(
                    x,
                    markerY - 6
                );
                context.lineTo(
                    x + 6,
                    markerY
                );
                context.lineTo(
                    x,
                    markerY + 6
                );
                context.lineTo(
                    x - 6,
                    markerY
                );
                context.closePath();
                context.fill();
            });

            context.fillStyle = "#94a3b8";
            context.font =
                "700 10px Inter, Arial";

            context.textAlign = "center";

            context.fillText(
                "DIAMONDS = CURRENT ENSEMBLE PREDICTIONS",
                left + plotWidth / 2,
                height - 7
            );
        }

        function renderWeightRows(result) {
            const maximumWeight =
                Math.max.apply(
                    null,
                    samples.map(function (sample) {
                        return sample.weight;
                    })
                );

            byId("boostWeightRows").innerHTML =
                samples
                    .map(function (sample, index) {
                        const row =
                            result.rows[index];

                        const percentage =
                            Math.max(
                                5,
                                (sample.weight /
                                    maximumWeight) *
                                    100
                            );

                        const sign =
                            sample.label === 1
                                ? "+1"
                                : "−1";

                        const state =
                            row.mistake
                                ? "mistake"
                                : "correct";

                        return (
                            '<div title="Selected stump: ' +
                            state +
                            '">' +
                            "<span>#" +
                            sample.id +
                            " " +
                            sign +
                            "</span>" +
                            '<i style="--weight:' +
                            fixed(percentage, 1) +
                            '%"></i>' +
                            "<b>" +
                            fixed(sample.weight, 3) +
                            "</b>" +
                            "</div>"
                        );
                    })
                    .join("");
        }

        function render() {
            const result =
                evaluateStump(selectedStump());

            const metrics = ensembleMetrics();

            const recent =
                history.length
                    ? history[history.length - 1]
                    : null;

            byId("boostThresholdValue").textContent =
                fixed(
                    result.stump.threshold,
                    1
                );

            byId("boostLearningRateValue").textContent =
                fixed(
                    Number(
                        learningRateInput.value
                    ),
                    2
                );

            byId("boostRound").textContent =
                round + " / " + maximumRounds;

            byId("boostError").textContent =
                fixed(result.error * 100, 1) +
                "%";

            byId("boostAlpha").textContent =
                recent
                    ? fixed(recent.alpha, 3)
                    : "preview";

            byId("boostAccuracy").textContent =
                fixed(metrics.accuracy * 100, 1) +
                "%";

            byId("boostLoss").textContent =
                fixed(metrics.loss, 3);

            if (recent) {
                byId("boostFormula").textContent =
                    "α" +
                    recent.round +
                    " = ½ ln((1−" +
                    fixed(recent.error, 3) +
                    ")/" +
                    fixed(recent.error, 3) +
                    ") × η = " +
                    fixed(recent.alpha, 3);

                byId("boostExplanation").textContent =
                    "Round " +
                    recent.round +
                    " used threshold " +
                    fixed(recent.threshold, 1) +
                    " with positive predictions on the " +
                    recent.direction +
                    ". Mistaken samples " +
                    (recent.mistakes.length
                        ? recent.mistakes.join(", ")
                        : "none") +
                    " received relatively more weight after normalization.";
            } else {
                byId("boostFormula").textContent =
                    "ε = Σ wᵢ I(yᵢ ≠ h(xᵢ)) = " +
                    fixed(result.error, 3);
            }

            renderWeightRows(result);
            draw(result);

            const ended =
                round >= maximumRounds;

            applyButton.disabled = ended;
            bestButton.disabled = ended;

            autoButton.disabled =
                ended || timer !== null;

            pauseButton.disabled =
                timer === null;
        }

        thresholdInput.addEventListener(
            "input",
            render
        );

        directionInput.addEventListener(
            "change",
            render
        );

        learningRateInput.addEventListener(
            "input",
            render
        );

        datasetInput.addEventListener(
            "change",
            function () {
                resetSamples();
                render();
            }
        );

        applyButton.addEventListener(
            "click",
            applyRound
        );

        bestButton.addEventListener(
            "click",
            function () {
                selectBestStump(true);
            }
        );

        autoButton.addEventListener(
            "click",
            function () {
                if (
                    round >= maximumRounds ||
                    timer !== null
                ) {
                    return;
                }

                autoButton.disabled = true;
                pauseButton.disabled = false;

                function nextRound() {
                    if (
                        round >= maximumRounds
                    ) {
                        stopAuto();
                        render();
                        return;
                    }

                    selectBestStump(false);
                    applyRound();
                }

                nextRound();

                if (round < maximumRounds) {
                    timer = window.setInterval(
                        nextRound,
                        1000
                    );
                }
            }
        );

        pauseButton.addEventListener(
            "click",
            function () {
                stopAuto();
                render();
            }
        );

        resetButton.addEventListener(
            "click",
            function () {
                resetSamples();
                render();
            }
        );

        canvas.addEventListener(
            "click",
            function (event) {
                if (
                    !canvasGeometry ||
                    round >= maximumRounds
                ) {
                    return;
                }

                const bounds =
                    canvas.getBoundingClientRect();

                const localX =
                    event.clientX - bounds.left;

                const raw =
                    1 +
                    ((localX -
                        canvasGeometry.left) /
                        canvasGeometry.plotWidth) *
                        9;

                const threshold = clamp(
                    Math.round(raw * 2) / 2,
                    1.5,
                    9.5
                );

                thresholdInput.value =
                    String(threshold);

                render();
            }
        );

        window.addEventListener(
            "resize",
            render
        );

        resetSamples();
        render();
    }

    function initModelBattle() {
        const canvas = byId("battleCanvas");

        if (!canvas) {
            return;
        }

        const methodInput =
            byId("battleMethod");

        const strengthInput =
            byId("battleStrength");

        const correlationInput =
            byId("battleCorrelation");

        const noiseInput =
            byId("battleNoise");

        const sizeInput =
            byId("battleSize");

        function calculate() {
            const method =
                methodInput.value;

            const accuracy =
                Number(strengthInput.value) / 100;

            const correlation =
                Number(correlationInput.value) /
                100;

            const noise =
                Number(noiseInput.value) / 100;

            const members =
                Number(sizeInput.value);

            const baseError = 1 - accuracy;
            const independentShare =
                1 - correlation;

            const sizeGain =
                1 - 1 / Math.sqrt(members);

            let gain = 0;
            let noisePenalty = 0;
            let verdict = "";
            let explanation = "";
            let nextCheck = "";

            if (method === "voting") {
                gain =
                    baseError *
                    independentShare *
                    sizeGain *
                    0.55;

                noisePenalty = noise * 0.08;

                verdict =
                    correlation < 0.55
                        ? "Voting gains from complementary calibrated views."
                        : "Similar errors limit the value of voting.";

                explanation =
                    "Soft voting benefits when component probabilities are calibrated and residual errors differ. Increasing members cannot remove the correlated error floor.";

                nextCheck =
                    "Measure calibration and residual disagreement for every member.";
            } else if (method === "bagging") {
                gain =
                    baseError *
                    independentShare *
                    sizeGain *
                    0.72;

                noisePenalty = noise * 0.05;

                verdict =
                    correlation < 0.65
                        ? "Bagging is reducing unstable variance."
                        : "The members are too correlated for strong variance reduction.";

                explanation =
                    "Bootstrap perturbations average the independent component of model variance. Row and feature randomness help only when the base learner is sufficiently sensitive to the data.";

                nextCheck =
                    "Compare out-of-bag error with cross-validation and inspect tree correlation.";
            } else if (method === "boosting") {
                gain =
                    baseError *
                    (0.28 + 0.48 * sizeGain) *
                    (1 - noise * 0.7);

                noisePenalty =
                    noise *
                    (0.18 + members / 180);

                verdict =
                    noise < 0.16
                        ? "Sequential correction can reduce remaining bias strongly."
                        : "Noise is beginning to attract repeated boosting attention.";

                explanation =
                    "Boosting adds corrections stage by stage. More rounds can improve structured residuals, but noisy labels may repeatedly receive attention and require shrinkage, shallow trees and early stopping.";

                nextCheck =
                    "Plot validation loss by round and stop before the generalization gap grows.";
            } else {
                gain =
                    baseError *
                        independentShare *
                        sizeGain *
                        0.65 +
                    baseError * 0.08;

                noisePenalty =
                    noise * 0.11 +
                    Math.max(0, members - 19) *
                        0.001;

                verdict =
                    correlation < 0.6
                        ? "Stacking can learn which model family to trust."
                        : "Base predictions may be too redundant for a useful meta-model.";

                explanation =
                    "Stacking can exploit complementary model families, but its training features must be out-of-fold predictions. Complexity and meta-model variance grow with unnecessary members.";

                nextCheck =
                    "Generate out-of-fold meta-features and compare against simple averaging.";
            }

            const ensembleError = clamp(
                baseError -
                    gain +
                    noisePenalty,
                0.015,
                0.49
            );

            const varianceIndex =
                correlation * 0.7 +
                0.3 / Math.sqrt(members);

            const noiseIndex =
                method === "boosting"
                    ? noise * 1.55
                    : method === "stacking"
                      ? noise * 1.15
                      : noise * 0.8;

            return {
                method: method,
                methodName: {
                    voting: "Soft Voting",
                    bagging: "Bagging",
                    boosting: "Boosting",
                    stacking: "Stacking"
                }[method],
                accuracy: accuracy,
                correlation: correlation,
                noise: noise,
                members: members,
                baseError: baseError,
                gain: gain,
                noisePenalty: noisePenalty,
                ensembleError: ensembleError,
                varianceIndex: varianceIndex,
                noiseIndex: noiseIndex,
                verdict: verdict,
                explanation: explanation,
                nextCheck: nextCheck
            };
        }

        function pressure(value) {
            if (value < 0.28) {
                return "Low";
            }

            if (value < 0.56) {
                return "Moderate";
            }

            return "High";
        }

        function draw(result) {
            const prepared =
                prepareCanvas(canvas, 430, 340);

            const context = prepared.context;
            const width = prepared.width;
            const height = prepared.height;
            const compact = width < 560;

            const left = compact ? 46 : 70;
            const right = compact ? 18 : 30;
            const top = compact ? 58 : 70;
            const bottom = compact ? 82 : 76;

            const maximumValue = 0.5;

            const chartHeight =
                height - top - bottom;

            const values = [
                {
                    name: "BASE ERROR",
                    value: result.baseError,
                    color: "#fb7185"
                },
                {
                    name: "REDUCED",
                    value: Math.max(
                        0,
                        result.gain
                    ),
                    color: "#22d3ee"
                },
                {
                    name: "NOISE COST",
                    value: result.noisePenalty,
                    color: "#f59e0b"
                },
                {
                    name: "FINAL ERROR",
                    value: result.ensembleError,
                    color: "#a78bfa"
                }
            ];

            context.fillStyle = "#061426";
            context.fillRect(
                0,
                0,
                width,
                height
            );

            context.fillStyle = "#7dd3fc";
            context.font =
                "900 12px Inter, Arial";

            context.textAlign = "left";

            context.fillText(
                result.methodName.toUpperCase() +
                    " • MECHANISM ESTIMATE",
                left,
                26
            );

            context.fillStyle = "#94a3b8";
            context.font =
                "600 10px Inter, Arial";

            context.fillText(
                result.members +
                    " members • " +
                    fixed(
                        result.correlation * 100,
                        0
                    ) +
                    "% error correlation • " +
                    fixed(
                        result.noise * 100,
                        0
                    ) +
                    "% label noise",
                left,
                44
            );

            [0, 0.1, 0.2, 0.3, 0.4, 0.5]
                .forEach(function (tick) {
                    const y =
                        top +
                        chartHeight -
                        (tick / maximumValue) *
                            chartHeight;

                    context.strokeStyle =
                        "rgba(125, 211, 252, .14)";

                    context.lineWidth = 1;
                    context.beginPath();
                    context.moveTo(left, y);
                    context.lineTo(
                        width - right,
                        y
                    );
                    context.stroke();

                    context.fillStyle =
                        "#64748b";

                    context.font =
                        "700 10px Inter, Arial";

                    context.textAlign =
                        "right";

                    context.fillText(
                        fixed(tick * 100, 0) +
                            "%",
                        left - 7,
                        y + 3
                    );
                });

            const areaWidth =
                width - left - right;

            const slot =
                areaWidth / values.length;

            const barWidth = Math.min(
                compact ? 42 : 68,
                slot * 0.56
            );

            values.forEach(
                function (item, index) {
                    const barHeight = clamp(
                        (item.value /
                            maximumValue) *
                            chartHeight,
                        2,
                        chartHeight
                    );

                    const x =
                        left +
                        slot * index +
                        (slot - barWidth) / 2;

                    const y =
                        top +
                        chartHeight -
                        barHeight;

                    const gradient =
                        context.createLinearGradient(
                            0,
                            y,
                            0,
                            y + barHeight
                        );

                    gradient.addColorStop(
                        0,
                        item.color
                    );

                    gradient.addColorStop(
                        1,
                        "rgba(30, 64, 175, .36)"
                    );

                    drawRoundedRect(
                        context,
                        x,
                        y,
                        barWidth,
                        barHeight,
                        9
                    );

                    context.fillStyle =
                        gradient;

                    context.fill();

                    context.fillStyle =
                        "#f8fafc";

                    context.font =
                        "900 11px Inter, Arial";

                    context.textAlign =
                        "center";

                    context.fillText(
                        fixed(
                            item.value * 100,
                            1
                        ) + "%",
                        x + barWidth / 2,
                        Math.max(
                            top + 13,
                            y - 8
                        )
                    );

                    context.save();

                    context.translate(
                        x + barWidth / 2,
                        height - bottom + 20
                    );

                    if (compact) {
                        context.rotate(-0.42);
                    }

                    context.fillStyle =
                        "#bfdbfe";

                    context.font =
                        "800 10px Inter, Arial";

                    context.textAlign =
                        compact
                            ? "right"
                            : "center";

                    context.fillText(
                        item.name,
                        0,
                        0
                    );

                    context.restore();
                }
            );

            context.fillStyle = "#fde047";
            context.font =
                "800 10px Inter, Arial";

            context.textAlign = "center";

            context.fillText(
                "Illustrative mechanism model — confirm with cross-validation on real data",
                width / 2,
                height - 10
            );
        }

        function render() {
            const result = calculate();

            byId("battleStrengthValue").textContent =
                fixed(result.accuracy * 100, 0) +
                "%";

            byId("battleCorrelationValue").textContent =
                fixed(
                    result.correlation * 100,
                    0
                ) + "%";

            byId("battleNoiseValue").textContent =
                fixed(result.noise * 100, 0) +
                "%";

            byId("battleSizeValue").textContent =
                String(result.members);

            byId("battleBaseError").textContent =
                fixed(
                    result.baseError * 100,
                    1
                ) + "%";

            byId("battleEnsembleError").textContent =
                fixed(
                    result.ensembleError * 100,
                    1
                ) + "%";

            byId("battleVariance").textContent =
                pressure(result.varianceIndex);

            byId("battleNoiseRisk").textContent =
                pressure(result.noiseIndex);

            byId("battleVerdict").textContent =
                result.verdict;

            byId("battleExplanation").textContent =
                result.explanation +
                " The displayed error is an educational estimate, not a substitute for measured validation.";

            byId("battleNextCheck").textContent =
                result.nextCheck;

            draw(result);
        }

        [
            methodInput,
            strengthInput,
            correlationInput,
            noiseInput,
            sizeInput
        ].forEach(function (input) {
            input.addEventListener(
                input.tagName === "SELECT"
                    ? "change"
                    : "input",
                render
            );
        });

        byId("battleRun").addEventListener(
            "click",
            render
        );

        byId("battleReset").addEventListener(
            "click",
            function () {
                methodInput.value = "voting";
                strengthInput.value = "68";
                correlationInput.value = "45";
                noiseInput.value = "10";
                sizeInput.value = "11";
                render();
            }
        );

        window.addEventListener(
            "resize",
            render
        );

        render();
    }

    function buildTraceStates() {
        const states = [];
        let output = "";

        function add(
            line,
            status,
            explanation,
            expression,
            result,
            variables
        ) {
            states.push({
                line: line,
                status: status,
                explanation: explanation,
                expression:
                    expression +
                    (result !== undefined
                        ? " → " + result
                        : ""),
                output: output,
                variables: variables || {}
            });
        }

        add(
            1,
            "Import functions",
            "Load exponential and logarithm operations used by AdaBoost.",
            "from math import exp, log",
            "ready",
            {
                exp: "loaded",
                log: "loaded"
            }
        );

        const x = [1, 2, 3, 4];

        add(
            2,
            "Create features",
            "Store four one-dimensional training values.",
            "x = [1, 2, 3, 4]",
            "4 samples",
            {
                x: "[1, 2, 3, 4]"
            }
        );

        const y = [-1, -1, 1, -1];

        add(
            3,
            "Create labels",
            "Use ±1 labels because the exponential update multiplies the label and stump prediction.",
            "y = [-1, -1, 1, -1]",
            "labels ready",
            {
                x: "[1, 2, 3, 4]",
                y: "[-1, -1, 1, -1]"
            }
        );

        let weights = [
            0.25,
            0.25,
            0.25,
            0.25
        ];

        add(
            4,
            "Initialize weights",
            "Assign equal importance 1/n to every training sample.",
            "w = [0.25] * 4",
            "[0.25, 0.25, 0.25, 0.25]",
            {
                w: "[0.25, 0.25, 0.25, 0.25]",
                sum_w: "1.00"
            }
        );

        const threshold = 2.5;

        add(
            5,
            "Choose stump",
            "The decision stump predicts +1 at or to the right of 2.5 and −1 otherwise.",
            "threshold = 2.5",
            "left: −1, right: +1",
            {
                threshold: "2.5"
            }
        );

        const predictions = [];

        add(
            6,
            "Create predictions",
            "Prepare an empty list for the stump decisions.",
            "predictions = []",
            "[]",
            {
                predictions: "[]"
            }
        );

        let error = 0;

        add(
            7,
            "Initialize error",
            "Weighted error begins at zero and receives only the weights of mistakes.",
            "error = 0.0",
            "0.0",
            {
                error: "0.000"
            }
        );

        x.forEach(function (xi, index) {
            const yi = y[index];
            const wi = weights[index];

            add(
                8,
                "Loop sample " + (index + 1),
                "Read the next feature, label and current sample weight.",
                "xi, yi, wi",
                xi +
                    ", " +
                    yi +
                    ", " +
                    fixed(wi, 2),
                {
                    index: index,
                    xi: xi,
                    yi: yi,
                    wi: fixed(wi, 3),
                    error: fixed(error, 3)
                }
            );

            const pred =
                xi >= threshold ? 1 : -1;

            add(
                9,
                "Predict sample " + (index + 1),
                "Apply the threshold rule to the current x value.",
                xi +
                    " >= " +
                    threshold +
                    " ? +1 : −1",
                pred,
                {
                    xi: xi,
                    yi: yi,
                    pred: pred,
                    threshold: threshold
                }
            );

            predictions.push(pred);

            add(
                10,
                "Store prediction",
                "Append this stump decision to the prediction list.",
                "predictions.append(" +
                    pred +
                    ")",
                "[" +
                    predictions.join(", ") +
                    "]",
                {
                    predictions:
                        "[" +
                        predictions.join(", ") +
                        "]"
                }
            );

            const mistake = pred !== yi;

            add(
                11,
                "Test mistake",
                mistake
                    ? "The prediction differs from the label, so this sample contributes its weight to the error."
                    : "The prediction matches the label, so weighted error does not change.",
                pred + " != " + yi,
                String(mistake),
                {
                    pred: pred,
                    yi: yi,
                    mistake: String(mistake),
                    error: fixed(error, 3)
                }
            );

            if (mistake) {
                error += wi;

                add(
                    12,
                    "Accumulate weighted error",
                    "Add this misclassified sample's current importance.",
                    fixed(error - wi, 3) +
                        " + " +
                        fixed(wi, 3),
                    fixed(error, 3),
                    {
                        added_weight:
                            fixed(wi, 3),
                        error: fixed(error, 3)
                    }
                );
            }
        });

        const alpha =
            0.5 *
            Math.log((1 - error) / error);

        add(
            13,
            "Compute learner influence",
            "Convert weighted error into the stump's vote strength. Error 0.25 gives a positive influence.",
            "0.5 × log((1 − " +
                fixed(error, 2) +
                ") / " +
                fixed(error, 2) +
                ")",
            fixed(alpha, 3),
            {
                error: fixed(error, 3),
                alpha: fixed(alpha, 3)
            }
        );

        const updated = [];

        add(
            14,
            "Prepare weight update",
            "Create a list for unnormalized next-round weights.",
            "updated = []",
            "[]",
            {
                updated: "[]"
            }
        );

        y.forEach(function (yi, index) {
            const pred = predictions[index];
            const wi = weights[index];

            add(
                15,
                "Update loop " + (index + 1),
                "Read one label, prediction and old weight.",
                "yi, pred, wi",
                yi +
                    ", " +
                    pred +
                    ", " +
                    fixed(wi, 2),
                {
                    index: index,
                    yi: yi,
                    pred: pred,
                    wi: fixed(wi, 3)
                }
            );

            const factor =
                Math.exp(
                    -alpha * yi * pred
                );

            const nextWeight = wi * factor;

            updated.push(nextWeight);

            add(
                16,
                "Apply exponential factor",
                yi === pred
                    ? "Correct prediction: exp(−α) shrinks relative importance."
                    : "Mistake: exp(+α) increases relative importance.",
                fixed(wi, 3) +
                    " × exp(−" +
                    fixed(alpha, 3) +
                    " × " +
                    yi +
                    " × " +
                    pred +
                    ")",
                fixed(nextWeight, 3),
                {
                    factor: fixed(factor, 3),
                    unnormalized:
                        fixed(nextWeight, 3),
                    updated:
                        "[" +
                        updated
                            .map(function (value) {
                                return fixed(
                                    value,
                                    3
                                );
                            })
                            .join(", ") +
                        "]"
                }
            );
        });

        const normalizer =
            updated.reduce(function (
                sum,
                value
            ) {
                return sum + value;
            }, 0);

        add(
            17,
            "Find normalizer",
            "Sum the unnormalized values so the next weights can again total one.",
            "sum(updated)",
            fixed(normalizer, 3),
            {
                Z: fixed(normalizer, 3)
            }
        );

        weights = updated.map(
            function (value) {
                return value / normalizer;
            }
        );

        add(
            18,
            "Normalize weights",
            "Divide every value by Z. The misclassified fourth sample now carries half of the total importance.",
            "[value / Z for value in updated]",
            "[" +
                weights
                    .map(function (value) {
                        return fixed(value, 3);
                    })
                    .join(", ") +
                "]",
            {
                w:
                    "[" +
                    weights
                        .map(function (value) {
                            return fixed(value, 3);
                        })
                        .join(", ") +
                    "]",
                sum_w: fixed(
                    weights.reduce(function (
                        first,
                        second
                    ) {
                        return first + second;
                    }, 0),
                    3
                )
            }
        );

        const ensemble =
            predictions.map(function (pred) {
                return alpha * pred;
            });

        add(
            19,
            "Build ensemble scores",
            "With one learner, each additive score is alpha multiplied by the stump prediction.",
            "[alpha * pred for pred in predictions]",
            "[" +
                ensemble
                    .map(function (value) {
                        return fixed(value, 3);
                    })
                    .join(", ") +
                "]",
            {
                predictions:
                    "[" +
                    predictions.join(", ") +
                    "]",
                scores:
                    "[" +
                    ensemble
                        .map(function (value) {
                            return fixed(value, 3);
                        })
                        .join(", ") +
                    "]"
            }
        );

        output =
            fixed(error, 2) +
            " " +
            fixed(alpha, 3) +
            " [" +
            weights
                .map(function (value) {
                    return fixed(value, 3);
                })
                .join(", ") +
            "]";

        add(
            20,
            "Complete",
            "Print weighted error, learner influence and normalized next-round weights.",
            "print(round(error,2), round(alpha,3), ...)",
            output,
            {
                error: fixed(error, 3),
                alpha: fixed(alpha, 3),
                next_focus: "sample 4"
            }
        );

        states[states.length - 1].output =
            output;

        return states;
    }

    function initProgramTracer() {
        const codeContainer =
            byId("tracerCode");

        if (!codeContainer) {
            return;
        }

        const codeLines = [
            "from math import exp, log",
            "x = [1, 2, 3, 4]",
            "y = [-1, -1, 1, -1]",
            "w = [0.25] * 4",
            "threshold = 2.5",
            "predictions = []",
            "error = 0.0",
            "for xi, yi, wi in zip(x, y, w):",
            "    pred = 1 if xi >= threshold else -1",
            "    predictions.append(pred)",
            "    if pred != yi:",
            "        error += wi",
            "alpha = 0.5 * log((1 - error) / error)",
            "updated = []",
            "for yi, pred, wi in zip(y, predictions, w):",
            "    updated.append(wi * exp(-alpha * yi * pred))",
            "z = sum(updated)",
            "w = [value / z for value in updated]",
            "ensemble = [alpha * pred for pred in predictions]",
            "print(round(error, 2), round(alpha, 3), w)"
        ];

        const states = buildTraceStates();
        const panel = byId("tracerPanel");
        const toggle =
            byId("tracerPanelToggle");
        const previous =
            byId("tracerPrevious");
        const next = byId("tracerNext");
        const auto = byId("tracerAuto");
        const pause = byId("tracerPause");
        const reset = byId("tracerReset");

        let step = 0;
        let timer = null;

        codeContainer.innerHTML =
            codeLines
                .map(function (line, index) {
                    return (
                        '<div class="aiml-code-line" data-code-line="' +
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

        function stop() {
            if (timer !== null) {
                window.clearInterval(timer);
            }

            timer = null;
            pause.disabled = true;
        }

        function renderVariables(values) {
            const entries =
                Object.entries(values || {});

            byId("tracerVariables").innerHTML =
                entries.length
                    ? entries
                          .map(function (entry) {
                              return (
                                  '<article class="aiml-variable">' +
                                  "<span>" +
                                  escapeHtml(
                                      entry[0]
                                  ) +
                                  "</span>" +
                                  "<strong>" +
                                  escapeHtml(
                                      entry[1]
                                  ) +
                                  "</strong>" +
                                  "</article>"
                              );
                          })
                          .join("")
                    : '<article class="aiml-variable"><span>STATE</span><strong>Not started</strong></article>';
        }

        function render() {
            const atStart = step === 0;
            const atEnd =
                step === states.length;

            const state = atStart
                ? null
                : states[step - 1];

            codeContainer
                .querySelectorAll(
                    ".aiml-code-line"
                )
                .forEach(function (line) {
                    line.classList.toggle(
                        "is-active",
                        Boolean(state) &&
                            Number(
                                line.dataset
                                    .codeLine
                            ) === state.line
                    );
                });

            if (state) {
                byId("tracerStatus").textContent =
                    atEnd
                        ? "Complete"
                        : state.status;

                byId(
                    "tracerExplanation"
                ).textContent =
                    state.explanation;

                byId(
                    "tracerExpression"
                ).textContent =
                    state.expression;

                byId("tracerOutput").textContent =
                    state.output ||
                    "No printed output yet";

                renderVariables(
                    state.variables
                );

                const active =
                    codeContainer.querySelector(
                        '[data-code-line="' +
                            state.line +
                            '"]'
                    );

                if (active) {
                    active.scrollIntoView({
                        behavior: "smooth",
                        block: "nearest"
                    });
                }
            } else {
                byId("tracerStatus").textContent =
                    "Ready";

                byId(
                    "tracerExplanation"
                ).textContent =
                    "Press Next to execute the first statement.";

                byId(
                    "tracerExpression"
                ).textContent = "—";

                byId("tracerOutput").textContent =
                    "Waiting for print(...)";

                renderVariables({});
            }

            previous.disabled = atStart;
            next.disabled = atEnd;

            auto.disabled =
                atEnd || timer !== null;

            pause.disabled =
                timer === null;

            byId("tracerProgress").textContent =
                "Step " +
                step +
                " of " +
                states.length;

            if (atEnd) {
                stop();
                next.disabled = true;
                auto.disabled = true;
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
                ) {
                    return;
                }

                auto.disabled = true;
                pause.disabled = false;

                timer = window.setInterval(
                    advance,
                    760
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

    function initProgrammingProblems() {
        const list = byId("problemList");

        if (!list) {
            return;
        }

        const problems = [
            {
                title: "Weighted Majority Vote",
                description:
                    "Read model predictions and their vote weights. Print the final ±1 class using the sign of the weighted sum.",
                sampleInput:
                    "predictions: 1 -1 1 | weights: 0.8 0.3 0.6",
                expected: "1",
                hint:
                    "Multiply corresponding prediction and learner weight, sum the products and test whether the result is non-negative.",
                starter:
                    "predictions = [1, -1, 1]\nweights = [0.8, 0.3, 0.6]\n# Compute the weighted vote\n",
                solution:
                    "predictions = [1, -1, 1]\nweights = [0.8, 0.3, 0.6]\nscore = sum(alpha * pred for alpha, pred in zip(weights, predictions))\nfinal_class = 1 if score >= 0 else -1\nprint(final_class)",
                required: [
                    ["sum("],
                    ["zip("],
                    [
                        "alpha * pred",
                        "pred * alpha"
                    ],
                    [">= 0", ">=0"],
                    ["print("]
                ]
            },
            {
                title: "One AdaBoost Update",
                description:
                    "Given labels, stump predictions and current weights, calculate weighted error, alpha and normalized next-round weights.",
                sampleInput:
                    "y=[-1,-1,1,-1], pred=[-1,-1,1,1]",
                expected:
                    "error=0.25, alpha=0.549, weights=[0.167,0.167,0.167,0.5]",
                hint:
                    "Sum weights where y differs from pred. Apply exp(-alpha*y*pred), then divide by the new total.",
                starter:
                    "from math import exp, log\ny = [-1, -1, 1, -1]\npred = [-1, -1, 1, 1]\nw = [0.25] * 4\n# Complete one AdaBoost update\n",
                solution:
                    "from math import exp, log\ny = [-1, -1, 1, -1]\npred = [-1, -1, 1, 1]\nw = [0.25] * 4\nerror = sum(wi for yi, pi, wi in zip(y, pred, w) if yi != pi)\nalpha = 0.5 * log((1 - error) / error)\nupdated = [wi * exp(-alpha * yi * pi) for yi, pi, wi in zip(y, pred, w)]\nz = sum(updated)\nupdated = [value / z for value in updated]\nprint(round(error, 3), round(alpha, 3), [round(value, 3) for value in updated])",
                required: [
                    ["log("],
                    ["exp("],
                    ["zip("],
                    [
                        "if yi != pi",
                        "if pi != yi"
                    ],
                    ["sum(updated)"],
                    ["/ z", "/z"],
                    ["print("]
                ]
            },
            {
                title:
                    "Bootstrap and Out-of-Bag Rows",
                description:
                    "Draw n bootstrap indices with a fixed seed and print the training indices and rows omitted from that sample.",
                sampleInput:
                    "n=8, random_state=42",
                expected:
                    "Bootstrap indices and OOB indices",
                hint:
                    "Use random.choices(range(n), k=n). OOB rows are the indices not present in the drawn set.",
                starter:
                    "import random\nrandom.seed(42)\nn = 8\n# Draw bootstrap indices and find OOB rows\n",
                solution:
                    "import random\nrandom.seed(42)\nn = 8\nbootstrap = random.choices(range(n), k=n)\nselected = set(bootstrap)\noob = [index for index in range(n) if index not in selected]\nprint(bootstrap)\nprint(oob)",
                required: [
                    ["random.seed("],
                    ["random.choices("],
                    ["range(n)"],
                    ["set("],
                    ["not in"],
                    ["print("]
                ]
            },
            {
                title:
                    "Leakage-Safe Bagging Pipeline",
                description:
                    "Build preprocessing and a bagged decision-tree classifier as one evaluable pipeline.",
                sampleInput:
                    "X_train, X_test, y_train, y_test",
                expected: "Test accuracy",
                hint:
                    "Put ColumnTransformer before BaggingClassifier inside Pipeline; fit only X_train and y_train.",
                starter:
                    "from sklearn.pipeline import Pipeline\nfrom sklearn.ensemble import BaggingClassifier\n# Build and evaluate the complete pipeline\n",
                solution:
                    "from sklearn.compose import ColumnTransformer\nfrom sklearn.impute import SimpleImputer\nfrom sklearn.pipeline import Pipeline\nfrom sklearn.preprocessing import OneHotEncoder\nfrom sklearn.tree import DecisionTreeClassifier\nfrom sklearn.ensemble import BaggingClassifier\npreprocess = ColumnTransformer([('num', SimpleImputer(strategy='median'), numeric_columns), ('cat', OneHotEncoder(handle_unknown='ignore'), categorical_columns)])\nbase = DecisionTreeClassifier(max_depth=6, random_state=42)\nmodel = Pipeline([('preprocess', preprocess), ('bag', BaggingClassifier(estimator=base, n_estimators=100, random_state=42, n_jobs=-1))])\nmodel.fit(X_train, y_train)\nprint(round(model.score(X_test, y_test), 3))",
                required: [
                    ["columntransformer("],
                    ["pipeline("],
                    ["baggingclassifier("],
                    ["decisiontreeclassifier("],
                    [".fit("],
                    [".score("],
                    ["print("]
                ]
            },
            {
                title:
                    "Out-of-Fold Stacking Classifier",
                description:
                    "Create a stacking classifier whose meta-model trains on cross-validated base predictions.",
                sampleInput:
                    "X, y with mixed predictive patterns",
                expected:
                    "Cross-validated F1 score",
                hint:
                    "Use StackingClassifier with diverse estimators, a regularized logistic final estimator and StratifiedKFold.",
                starter:
                    "from sklearn.ensemble import StackingClassifier\n# Define diverse base learners and a meta-model\n",
                solution:
                    "from sklearn.ensemble import RandomForestClassifier, StackingClassifier\nfrom sklearn.linear_model import LogisticRegression\nfrom sklearn.model_selection import StratifiedKFold, cross_val_score\nfrom sklearn.pipeline import make_pipeline\nfrom sklearn.preprocessing import StandardScaler\nfrom sklearn.svm import SVC\nbase_models = [('linear', make_pipeline(StandardScaler(), LogisticRegression(max_iter=2000))), ('forest', RandomForestClassifier(n_estimators=200, random_state=42)), ('svm', make_pipeline(StandardScaler(), SVC(probability=True, random_state=42)))]\ninner_cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)\nstack = StackingClassifier(estimators=base_models, final_estimator=LogisticRegression(max_iter=2000), cv=inner_cv, stack_method='predict_proba')\nscores = cross_val_score(stack, X, y, cv=5, scoring='f1_macro')\nprint(round(scores.mean(), 3))",
                required: [
                    ["stackingclassifier("],
                    ["estimators="],
                    ["final_estimator="],
                    ["stratifiedkfold("],
                    ["cross_val_score("],
                    [
                        "scoring='f1_macro'",
                        'scoring="f1_macro"'
                    ],
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
            Array.isArray(saved.solvedProblems)
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

        function save() {
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

            byId(
                "problemSolvedCount"
            ).textContent =
                solved.size +
                " / " +
                problems.length;

            byId("problemScore").textContent =
                total +
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
                    "<div><h3>" +
                    number +
                    ". " +
                    escapeHtml(problem.title) +
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
                    "<span><strong>Expected output:</strong> <code>" +
                    escapeHtml(
                        problem.expected
                    ) +
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
                    '<button type="button" data-action="check">Check Answer</button>' +
                    '<button type="button" data-action="reset">Reset</button>' +
                    '<span class="aiml-check-result" data-result>Write your solution, then check its structure.</span>' +
                    "</div></div></article>"
                );
            })
            .join("");

        function toggle(
            card,
            panelName,
            button,
            openText,
            closeText
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
                ? closeText
                : openText;
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

                const index = Number(
                    card.dataset.problem
                );

                const problem =
                    problems[index];

                const action =
                    button.dataset.action;

                if (action === "workspace") {
                    toggle(
                        card,
                        "workspace",
                        button,
                        "💻 Solve It Yourself",
                        "✕ Close Workspace"
                    );
                    return;
                }

                if (action === "hint") {
                    toggle(
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

                    toggle(
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

                    if (missing.length) {
                        result.className =
                            "aiml-check-result error";

                        result.textContent =
                            "Not complete yet. Recheck the required calculation, model steps and output.";

                        return;
                    }

                    const score = revealed.has(
                        index
                    )
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
                            ? "Logic recognized — completed after viewing the model program. Score: 60/100."
                            : "Logic recognized — solved independently. Score: 100/100.";

                    save();
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
                    "What is the most important reason averaging several models can reduce variance?",
                options: [
                    "Every member is identical",
                    "Member errors are not perfectly correlated",
                    "Training error becomes zero",
                    "Labels are removed"
                ],
                answer: 1,
                explanation:
                    "Averaging cancels part of the error that varies independently across members; a perfectly correlated component remains."
            },
            {
                question:
                    "Which statement best distinguishes bagging from boosting?",
                options: [
                    "Bagging is sequential and boosting is parallel",
                    "Bagging averages independently trained members; boosting adds corrective members sequentially",
                    "Only bagging uses trees",
                    "Only boosting supports classification"
                ],
                answer: 1,
                explanation:
                    "Bagging perturbs data and aggregates parallel members, while boosting makes each stage depend on the current ensemble's errors or loss gradient."
            },
            {
                question:
                    "A binary AdaBoost stump has weighted error 0.25. Approximately what is alpha?",
                options: [
                    "0.000",
                    "0.250",
                    "0.549",
                    "1.386"
                ],
                answer: 2,
                explanation:
                    "α = ½ ln((1−0.25)/0.25) = ½ ln(3) ≈ 0.549."
            },
            {
                question:
                    "What happens to a misclassified sample in the AdaBoost exponential update?",
                options: [
                    "Its relative weight increases",
                    "Its label is changed",
                    "It is removed",
                    "Its weight must become one"
                ],
                answer: 0,
                explanation:
                    "For a mistake, y·h(x)=−1, so exp(−αyh)=exp(+α), increasing its importance relative to correct samples."
            },
            {
                question:
                    "For squared-error gradient boosting, what does a new tree fit?",
                options: [
                    "Random labels",
                    "Current residuals, which equal the negative loss gradient",
                    "Only the original features",
                    "Bootstrap frequencies"
                ],
                answer: 1,
                explanation:
                    "The negative derivative of squared loss with respect to the prediction is proportional to y−F(x), the current residual."
            },
            {
                question:
                    "Why must stacking use out-of-fold base predictions for training the meta-model?",
                options: [
                    "To reduce the number of features to zero",
                    "To prevent the meta-model from learning from unrealistically optimistic in-sample predictions",
                    "To avoid base models",
                    "To guarantee perfect calibration"
                ],
                answer: 1,
                explanation:
                    "Each training row's meta-features must be produced by base learners that did not fit that row; otherwise target leakage encourages overfitting."
            },
            {
                question:
                    "Which mechanism most directly reduces correlation among random-forest trees?",
                options: [
                    "Using one identical bootstrap sample",
                    "Considering random feature subsets at splits",
                    "Increasing labels",
                    "Removing aggregation"
                ],
                answer: 1,
                explanation:
                    "Random feature subsets force trees to explore different predictive routes and reduce repeated reliance on the same dominant features."
            },
            {
                question:
                    "What is the safest reason to accept an ensemble in production?",
                options: [
                    "It contains the most models",
                    "It uses the newest library",
                    "Leakage-safe validation shows meaningful gain that justifies operational cost",
                    "Its training score is highest"
                ],
                answer: 2,
                explanation:
                    "Deployment decisions must balance reproducible generalization with latency, memory, calibration, monitoring and maintenance."
            }
        ];

        container.innerHTML =
            questions
                .map(function (
                    item,
                    questionIndex
                ) {
                    return (
                        '<article class="aiml-quiz-question" data-quiz-question="' +
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
                                const id =
                                    "quiz-eleven-" +
                                    questionIndex +
                                    "-" +
                                    optionIndex;

                                return (
                                    '<label class="aiml-quiz-option" for="' +
                                    id +
                                    '">' +
                                    '<input type="radio" id="' +
                                    id +
                                    '" name="quiz-eleven-' +
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
                                    "</span></label>"
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
                    .forEach(function (
                        option
                    ) {
                        option.classList.toggle(
                            "is-selected",
                            option.contains(
                                event.target
                            )
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
                            (selected
                                ? escapeHtml(
                                      item.options[
                                          Number(
                                              selected.value
                                          )
                                      ]
                                  )
                                : "Not attempted") +
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

                byId("quizScore").textContent =
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
                    JSON.stringify(progress)
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
                    .forEach(function (input) {
                        input.checked = false;
                    });

                container
                    .querySelectorAll(
                        ".aiml-quiz-option"
                    )
                    .forEach(function (
                        option
                    ) {
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
                    .forEach(function (
                        explanation
                    ) {
                        explanation.hidden = true;
                        explanation.textContent =
                            "";
                    });

                byId("quizScore").textContent =
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
                    "Why can an ensemble outperform its individual members?",
                answer:
                    "An ensemble can reduce error when its members are individually competent and their residual errors are not perfectly correlated. Voting or averaging cancels part of the independent error, while sequential boosting can add functions that correct systematic residual structure. More models alone are not sufficient; diversity, strength and leakage-safe validation matter."
            },
            {
                question:
                    "Compare bagging and boosting in terms of training and error reduction.",
                answer:
                    "Bagging trains members independently on perturbed samples and aggregates them, so it primarily reduces variance and can be parallelized. Boosting trains sequentially, making each new learner respond to current mistakes or the negative loss gradient; it can reduce bias strongly but is more sensitive to noise and stage-wise hyperparameters."
            },
            {
                question:
                    "Why are deep decision trees suitable base learners for bagging?",
                answer:
                    "Deep trees have low bias but high variance: small changes in training rows can produce different structures. Bootstrap samples create varied trees, and averaging reduces their sample sensitivity. A stable learner that changes little across bootstrap samples usually gains less from bagging."
            },
            {
                question:
                    "What is out-of-bag evaluation?",
                answer:
                    "Each bootstrap member omits some training rows. A row can be predicted by only the members for which it was out of bag, and those predictions can be aggregated into an internal estimate. OOB evaluation is useful for diagnosis but does not replace a protected final test set or all cross-validation needs."
            },
            {
                question:
                    "Explain one AdaBoost round mathematically.",
                answer:
                    "Fit a weak learner h using current weights and compute weighted error ε=ΣwᵢI(yᵢ≠h(xᵢ)). For ε<0.5, calculate α=½ln((1−ε)/ε). Update wᵢ←wᵢexp(−αyᵢh(xᵢ)), normalize, and add αh(x) to the ensemble score. Mistakes therefore receive greater relative attention."
            },
            {
                question:
                    "How does gradient boosting generalize the idea of fitting residuals?",
                answer:
                    "Gradient boosting chooses a differentiable loss and fits each new learner to the negative derivative of that loss with respect to the current prediction. For squared error this negative gradient is the residual y−F(x), but for logistic and other losses it is a different pseudo-residual. The learner is then scaled and added to the existing function."
            },
            {
                question:
                    "Which hyperparameters interact most strongly in tree boosting?",
                answer:
                    "Learning rate and number of estimators form the central shrinkage–rounds trade-off. Tree depth or number of leaves controls interaction complexity, while row/column subsampling and L1/L2 or leaf penalties regulate variance. Tune them with an appropriate metric and early stopping on separate validation evidence."
            },
            {
                question:
                    "Why are out-of-fold predictions essential in stacking?",
                answer:
                    "A meta-model trained on base predictions from models that already fitted the same rows sees unrealistically accurate features and can learn overconfident combinations. Out-of-fold construction ensures that every training row's meta-features come from base learners that did not train on that row, preventing this leakage."
            },
            {
                question:
                    "When would you prefer simple voting to stacking?",
                answer:
                    "Prefer voting when base models are already strong and reasonably calibrated, data is limited, operational simplicity matters, or stacking does not show reproducible validation gain. Voting is easier to train, explain, monitor and serve. Stacking is justified when complementary patterns support a stable leakage-safe meta-model."
            },
            {
                question:
                    "How do you decide whether an ensemble is production-worthy?",
                answer:
                    "Compare it with a tuned single-model baseline using identical leakage-safe folds and task-appropriate metrics. Examine uncertainty, calibration, subgroup failures and drift risk, then measure latency, throughput, memory, model size and maintenance burden. Accept the ensemble only when its repeatable benefit justifies the complete operational cost."
            }
        ];

        container.innerHTML =
            questions
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
                        '<button type="button" aria-expanded="false">Show Answer</button>' +
                        "</div>" +
                        '<div class="aiml-interview-answer" hidden>' +
                        escapeHtml(item.answer) +
                        "</div></article>"
                    );
                })
                .join("");

        container.addEventListener(
            "click",
            function (event) {
                const button =
                    event.target.closest("button");

                if (!button) {
                    return;
                }

                const answer = button
                    .closest(
                        ".aiml-interview-item"
                    )
                    .querySelector(
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
                    link.getAttribute("href") ===
                        "#"
                ) {
                    return;
                }

                const target =
                    document.querySelector(
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
            }
        );
    }

    function initLevelEleven() {
        initBoostVisualizer();
        initModelBattle();
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
            initLevelEleven
        );
    } else {
        initLevelEleven();
    }
}());
