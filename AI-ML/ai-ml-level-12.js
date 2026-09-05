(function () {
    "use strict";

    const LEVEL_PROGRESS_KEY = "codebhavya-aiml-level-12-progress-v1";

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

    function clamp(value, minimum, maximum) {
        return Math.min(maximum, Math.max(minimum, value));
    }

    function fixed(value, digits) {
        return Number(value).toFixed(digits === undefined ? 3 : digits);
    }

    function mean(values) {
        if (!values.length) return 0;
        return values.reduce(function (total, value) {
            return total + value;
        }, 0) / values.length;
    }

    function standardDeviation(values) {
        if (!values.length) return 0;
        const average = mean(values);
        return Math.sqrt(mean(values.map(function (value) {
            return Math.pow(value - average, 2);
        })));
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

    function roundedRect(context, x, y, width, height, radius) {
        const size = Math.min(radius, Math.abs(width) / 2, Math.abs(height) / 2);

        context.beginPath();
        context.moveTo(x + size, y);
        context.arcTo(x + width, y, x + width, y + height, size);
        context.arcTo(x + width, y + height, x, y + height, size);
        context.arcTo(x, y + height, x, y, size);
        context.arcTo(x, y, x + width, y, size);
        context.closePath();
    }

    function initMetricVisualizer() {
        const canvas = byId("metricCanvas");
        if (!canvas) return;

        const datasets = {
            screening: {
                name: "Medical screening",
                scores: [
                    0.96, 0.91, 0.88, 0.83, 0.79,
                    0.75, 0.69, 0.64, 0.58, 0.54,
                    0.49, 0.45, 0.41, 0.36, 0.32,
                    0.28, 0.23, 0.18, 0.12, 0.07
                ],
                labels: [
                    1, 1, 1, 0, 1,
                    1, 0, 1, 1, 0,
                    1, 0, 0, 1, 0,
                    0, 0, 0, 0, 0
                ],
                fpCost: 1,
                fnCost: 8
            },
            placement: {
                name: "Placement shortlisting",
                scores: [
                    0.94, 0.89, 0.86, 0.81, 0.77,
                    0.72, 0.68, 0.63, 0.59, 0.55,
                    0.51, 0.47, 0.42, 0.38, 0.34,
                    0.29, 0.24, 0.19, 0.13, 0.08
                ],
                labels: [
                    1, 1, 0, 1, 1,
                    0, 1, 1, 0, 1,
                    0, 1, 0, 0, 1,
                    0, 0, 0, 0, 0
                ],
                fpCost: 2,
                fnCost: 5
            },
            fraud: {
                name: "Rare fraud detection",
                scores: [
                    0.98, 0.93, 0.87, 0.82, 0.76,
                    0.71, 0.66, 0.61, 0.56, 0.50,
                    0.46, 0.42, 0.37, 0.33, 0.29,
                    0.25, 0.20, 0.16, 0.11, 0.05
                ],
                labels: [
                    1, 1, 0, 1, 0,
                    0, 1, 0, 0, 0,
                    1, 0, 0, 0, 0,
                    0, 0, 0, 0, 0
                ],
                fpCost: 1,
                fnCost: 15
            }
        };

        const datasetInput = byId("metricDataset");
        const thresholdInput = byId("metricThreshold");
        const fpCostInput = byId("falsePositiveCost");
        const fnCostInput = byId("falseNegativeCost");

        let lastMode = "manual";

        function safeDivide(numerator, denominator) {
            return denominator ? numerator / denominator : 0;
        }

        function calculate(threshold) {
            const data = datasets[datasetInput.value];

            let tp = 0;
            let fp = 0;
            let fn = 0;
            let tn = 0;

            data.scores.forEach(function (score, index) {
                const predicted = score >= threshold ? 1 : 0;
                const actual = data.labels[index];

                if (predicted === 1 && actual === 1) tp += 1;
                else if (predicted === 1 && actual === 0) fp += 1;
                else if (predicted === 0 && actual === 1) fn += 1;
                else tn += 1;
            });

            const precision = safeDivide(tp, tp + fp);
            const recall = safeDivide(tp, tp + fn);
            const specificity = safeDivide(tn, tn + fp);
            const accuracy = safeDivide(tp + tn, data.scores.length);
            const f1 = safeDivide(
                2 * precision * recall,
                precision + recall
            );

            const cost =
                fp * Number(fpCostInput.value) +
                fn * Number(fnCostInput.value);

            return {
                threshold: threshold,
                tp: tp,
                fp: fp,
                fn: fn,
                tn: tn,
                precision: precision,
                recall: recall,
                specificity: specificity,
                accuracy: accuracy,
                f1: f1,
                cost: cost
            };
        }

        function chooseBest(objective) {
            let best = null;

            for (let value = 5; value <= 95; value += 1) {
                const result = calculate(value / 100);

                if (
                    !best ||
                    (
                        objective === "f1" &&
                        result.f1 > best.f1 + 1e-12
                    ) ||
                    (
                        objective === "cost" &&
                        result.cost < best.cost
                    )
                ) {
                    best = result;
                }
            }

            thresholdInput.value =
                String(Math.round(best.threshold * 100));

            lastMode = objective;
            render();
        }

        function draw(result) {
            const prepared = prepareCanvas(canvas, 430, 365);
            const context = prepared.context;
            const width = prepared.width;
            const height = prepared.height;
            const mobile = width < 560;

            const left = mobile ? 34 : 54;
            const right = mobile ? 18 : 34;
            const plotWidth = width - left - right;
            const positiveY = mobile ? 78 : 98;
            const negativeY = mobile ? 160 : 200;
            const axisY = mobile ? 218 : 262;
            const data = datasets[datasetInput.value];

            context.clearRect(0, 0, width, height);
            context.fillStyle = "#061426";
            context.fillRect(0, 0, width, height);

            context.font = "700 12px system-ui, sans-serif";
            context.fillStyle = "#7dd3fc";
            context.fillText("ACTUAL +", left, positiveY - 32);
            context.fillText("ACTUAL −", left, negativeY - 32);

            [positiveY, negativeY, axisY].forEach(function (y) {
                context.strokeStyle = "#25445f";
                context.lineWidth = 1;
                context.beginPath();
                context.moveTo(left, y);
                context.lineTo(width - right, y);
                context.stroke();
            });

            data.scores.forEach(function (score, index) {
                const x = left + score * plotWidth;
                const y = data.labels[index] ? positiveY : negativeY;
                const predicted = score >= result.threshold;

                context.beginPath();
                context.arc(x, y, 8, 0, Math.PI * 2);
                context.fillStyle =
                    data.labels[index] ? "#34d399" : "#60a5fa";
                context.fill();

                context.lineWidth = 3;
                context.strokeStyle =
                    predicted ? "#fde047" : "#64748b";
                context.stroke();
            });

            const thresholdX =
                left + result.threshold * plotWidth;

            context.strokeStyle = "#fbbf24";
            context.lineWidth = 3;
            context.setLineDash([7, 5]);
            context.beginPath();
            context.moveTo(thresholdX, 42);
            context.lineTo(thresholdX, axisY + 10);
            context.stroke();
            context.setLineDash([]);

            context.fillStyle = "#fde047";
            context.font = "800 12px system-ui, sans-serif";
            context.textAlign =
                thresholdX > width - 110 ? "right" : "left";

            context.fillText(
                "threshold " + fixed(result.threshold, 2),
                thresholdX + (thresholdX > width - 110 ? -7 : 7),
                34
            );

            context.textAlign = "center";
            context.font = "700 10px system-ui, sans-serif";
            context.fillStyle = "#8fa9c1";

            [0, 0.25, 0.5, 0.75, 1].forEach(function (tick) {
                const x = left + tick * plotWidth;
                context.fillText(
                    fixed(tick, 2),
                    x,
                    axisY + 21
                );
            });

            const boxY = mobile ? 272 : 315;
            const gap = 9;
            const boxWidth =
                (plotWidth - gap * 3) / 4;

            [
                {
                    label: "TP",
                    value: result.tp,
                    color: "#34d399"
                },
                {
                    label: "FP",
                    value: result.fp,
                    color: "#fb7185"
                },
                {
                    label: "FN",
                    value: result.fn,
                    color: "#fbbf24"
                },
                {
                    label: "TN",
                    value: result.tn,
                    color: "#60a5fa"
                }
            ].forEach(function (item, index) {
                const x =
                    left + index * (boxWidth + gap);

                roundedRect(
                    context,
                    x,
                    boxY,
                    boxWidth,
                    62,
                    10
                );

                context.fillStyle = "#0c223b";
                context.fill();

                context.strokeStyle = "#2b4d69";
                context.stroke();

                context.fillStyle = item.color;
                context.font =
                    "900 10px system-ui, sans-serif";

                context.fillText(
                    item.label,
                    x + boxWidth / 2,
                    boxY + 21
                );

                context.fillStyle = "#f8fafc";
                context.font =
                    "900 20px system-ui, sans-serif";

                context.fillText(
                    String(item.value),
                    x + boxWidth / 2,
                    boxY + 47
                );
            });

            context.textAlign = "left";
        }

        function render() {
            const result = calculate(
                Number(thresholdInput.value) / 100
            );

            byId("metricThresholdValue").textContent =
                fixed(result.threshold, 2);

            byId("falsePositiveCostValue").textContent =
                fpCostInput.value;

            byId("falseNegativeCostValue").textContent =
                fnCostInput.value;

            byId("metricTP").textContent = result.tp;
            byId("metricFP").textContent = result.fp;
            byId("metricFN").textContent = result.fn;
            byId("metricTN").textContent = result.tn;

            byId("metricPrecision").textContent =
                fixed(result.precision * 100, 1) + "%";

            byId("metricRecall").textContent =
                fixed(result.recall * 100, 1) + "%";

            byId("metricF1").textContent =
                fixed(result.f1 * 100, 1) + "%";

            byId("metricCost").textContent = result.cost;

            let verdict;
            let nextCheck;

            if (
                result.fn > 0 &&
                Number(fnCostInput.value) >=
                    Number(fpCostInput.value) * 5
            ) {
                verdict =
                    "This policy still misses " +
                    result.fn +
                    " costly positive case" +
                    (result.fn === 1 ? "" : "s") +
                    ". Recall is the main risk.";

                nextCheck =
                    "Lower the threshold or improve positive-class evidence, then measure the added review workload.";
            } else if (result.fp > result.tp) {
                verdict =
                    "False alarms exceed true detections. The positive queue may be inefficient.";

                nextCheck =
                    "Inspect precision and raise the threshold only if the resulting missed-positive cost is acceptable.";
            } else {
                verdict =
                    "The current threshold balances retrieved positives and false alarms for the selected costs.";

                nextCheck =
                    "Validate this operating point on protected data and inspect subgroup confusion counts.";
            }

            if (lastMode === "f1") {
                verdict =
                    "Best displayed F1 operating point: threshold " +
                    fixed(result.threshold, 2) +
                    " with F1 " +
                    fixed(result.f1 * 100, 1) +
                    "%.";
            }

            if (lastMode === "cost") {
                verdict =
                    "Minimum displayed cost operating point: threshold " +
                    fixed(result.threshold, 2) +
                    " with cost " +
                    result.cost +
                    ".";
            }

            byId("metricVerdict").textContent = verdict;

            byId("metricExplanation").textContent =
                "Accuracy " +
                fixed(result.accuracy * 100, 1) +
                "%, specificity " +
                fixed(result.specificity * 100, 1) +
                "%. The model ranking is unchanged; only the decision threshold changed.";

            byId("metricNextCheck").textContent = nextCheck;

            draw(result);
        }

        function resetForDataset() {
            const data = datasets[datasetInput.value];

            thresholdInput.value = "50";
            fpCostInput.value = String(data.fpCost);
            fnCostInput.value = String(data.fnCost);
            lastMode = "manual";

            render();
        }

        datasetInput.addEventListener(
            "change",
            resetForDataset
        );

        [
            thresholdInput,
            fpCostInput,
            fnCostInput
        ].forEach(function (input) {
            input.addEventListener("input", function () {
                lastMode = "manual";
                render();
            });
        });

        byId("metricBestF1").addEventListener(
            "click",
            function () {
                chooseBest("f1");
            }
        );

        byId("metricBestCost").addEventListener(
            "click",
            function () {
                chooseBest("cost");
            }
        );

        byId("metricReset").addEventListener(
            "click",
            resetForDataset
        );

        window.addEventListener("resize", render);

        resetForDataset();
    }

    function initCrossValidationLab() {
        const canvas = byId("cvCanvas");
        if (!canvas) return;

        const candidates = [
            {
                name: "C=0.05 · γ=scale",
                base: 0.742,
                stability: 0.010
            },
            {
                name: "C=0.10 · γ=scale",
                base: 0.761,
                stability: 0.012
            },
            {
                name: "C=0.50 · γ=scale",
                base: 0.792,
                stability: 0.014
            },
            {
                name: "C=1.00 · γ=scale",
                base: 0.807,
                stability: 0.016
            },
            {
                name: "C=2.00 · γ=0.10",
                base: 0.814,
                stability: 0.019
            },
            {
                name: "C=5.00 · γ=0.10",
                base: 0.809,
                stability: 0.025
            },
            {
                name: "C=10.0 · γ=0.20",
                base: 0.797,
                stability: 0.034
            },
            {
                name: "C=25.0 · γ=0.50",
                base: 0.778,
                stability: 0.046
            }
        ];

        const searchOrders = {
            grid: [0, 1, 2, 3, 4, 5, 6, 7],
            random: [4, 0, 6, 2, 7, 3, 1, 5],
            halving: [0, 2, 4, 6, 5, 3]
        };

        const strategyInput = byId("cvStrategy");
        const foldsInput = byId("cvFolds");
        const searchInput = byId("cvSearch");
        const metricInput = byId("cvMetric");
        const nextButton = byId("cvNext");
        const autoButton = byId("cvAuto");
        const pauseButton = byId("cvPause");

        let results = [];
        let position = 0;
        let fits = 0;
        let timer = null;

        function currentOrder() {
            return searchOrders[searchInput.value];
        }

        function metricAdjustment() {
            if (metricInput.value === "recall") return -0.012;
            if (metricInput.value === "accuracy") return 0.018;
            return 0;
        }

        function strategyAdjustment(strategy) {
            if (strategy === "group") return -0.025;
            if (strategy === "time") return -0.041;
            if (strategy === "kfold") return 0.008;
            return 0;
        }

        function evaluateCandidate(candidateIndex) {
            const candidate = candidates[candidateIndex];
            const folds = Number(foldsInput.value);
            const strategy = strategyInput.value;
            const scores = [];

            for (let fold = 0; fold < folds; fold += 1) {
                const wave =
                    Math.sin(
                        (candidateIndex + 1) * 1.7 +
                        (fold + 1) * 2.1
                    ) * candidate.stability;

                const structure =
                    strategy === "time"
                        ? -fold * 0.004
                        : strategy === "group" &&
                          fold === folds - 1
                            ? -0.018
                            : 0;

                scores.push(
                    clamp(
                        candidate.base +
                            metricAdjustment() +
                            strategyAdjustment(strategy) +
                            wave +
                            structure,
                        0.50,
                        0.94
                    )
                );
            }

            return {
                index: candidateIndex,
                candidate: candidate,
                scores: scores,
                mean: mean(scores),
                std: standardDeviation(scores)
            };
        }

        function bestResult() {
            if (!results.length) return null;

            return results.slice().sort(function (a, b) {
                if (Math.abs(b.mean - a.mean) > 0.002) {
                    return b.mean - a.mean;
                }

                return a.std - b.std;
            })[0];
        }

        function stopAuto() {
            if (timer !== null) {
                window.clearInterval(timer);
            }

            timer = null;
            pauseButton.disabled = true;
            autoButton.disabled =
                position >= currentOrder().length;
        }

        function evaluateNext() {
            const order = currentOrder();

            if (position >= order.length) {
                stopAuto();
                render();
                return;
            }

            const result =
                evaluateCandidate(order[position]);

            results.push(result);
            position += 1;
            fits += Number(foldsInput.value);

            if (position >= order.length) {
                stopAuto();
            }

            render();
        }

        function draw() {
            const prepared =
                prepareCanvas(canvas, 430, 390);

            const context = prepared.context;
            const width = prepared.width;
            const height = prepared.height;
            const mobile = width < 560;
            const folds = Number(foldsInput.value);
            const left = mobile ? 18 : 42;
            const right = mobile ? 16 : 28;
            const usable = width - left - right;
            const dataCount = mobile ? 18 : 30;
            const cellGap = 2;

            const cellWidth = Math.max(
                5,
                (
                    usable -
                    cellGap * (dataCount - 1)
                ) / dataCount
            );

            const rowHeight = mobile ? 22 : 25;
            const startY = 54;

            context.clearRect(0, 0, width, height);
            context.fillStyle = "#061426";
            context.fillRect(0, 0, width, height);

            context.fillStyle = "#7dd3fc";
            context.font =
                "900 11px system-ui, sans-serif";

            context.fillText(
                strategyInput.options[
                    strategyInput.selectedIndex
                ].text + " · fold map",
                left,
                28
            );

            for (let fold = 0; fold < folds; fold += 1) {
                const y =
                    startY + fold * (rowHeight + 8);

                for (
                    let index = 0;
                    index < dataCount;
                    index += 1
                ) {
                    let validation;

                    if (strategyInput.value === "time") {
                        validation =
                            index >=
                                Math.floor(
                                    dataCount *
                                    (fold + 1) /
                                    (folds + 1)
                                ) &&
                            index <
                                Math.floor(
                                    dataCount *
                                    (fold + 2) /
                                    (folds + 1)
                                );
                    } else if (
                        strategyInput.value === "group"
                    ) {
                        validation =
                            Math.floor(index / 3) %
                                folds === fold;
                    } else {
                        validation =
                            index % folds === fold;
                    }

                    const x =
                        left +
                        index * (cellWidth + cellGap);

                    roundedRect(
                        context,
                        x,
                        y,
                        cellWidth,
                        rowHeight,
                        3
                    );

                    context.fillStyle =
                        validation
                            ? "#fbbf24"
                            : "#1d4e78";

                    context.fill();
                }

                context.fillStyle = "#8ba6bf";
                context.font =
                    "700 9px system-ui, sans-serif";

                context.fillText(
                    "F" + (fold + 1),
                    3,
                    y + rowHeight - 6
                );
            }

            const chartTop =
                startY +
                folds * (rowHeight + 8) +
                25;

            const chartBottom = height - 36;
            const chartHeight =
                Math.max(95, chartBottom - chartTop);

            context.strokeStyle = "#294967";
            context.beginPath();
            context.moveTo(left, chartBottom);
            context.lineTo(width - right, chartBottom);
            context.stroke();

            const visibleResults = results.slice(-8);
            const barGap = mobile ? 6 : 10;

            const barWidth = visibleResults.length
                ? Math.min(
                    62,
                    (
                        usable -
                        barGap *
                            (visibleResults.length - 1)
                    ) / visibleResults.length
                )
                : 40;

            const best = bestResult();

            visibleResults.forEach(
                function (result, index) {
                    const x =
                        left +
                        index * (barWidth + barGap);

                    const normalized = clamp(
                        (result.mean - 0.5) / 0.45,
                        0,
                        1
                    );

                    const barHeight =
                        normalized * (chartHeight - 30);

                    const y = chartBottom - barHeight;

                    const gradient =
                        context.createLinearGradient(
                            0,
                            y,
                            0,
                            chartBottom
                        );

                    gradient.addColorStop(
                        0,
                        best &&
                        best.index === result.index
                            ? "#22d3ee"
                            : "#8b5cf6"
                    );

                    gradient.addColorStop(
                        1,
                        best &&
                        best.index === result.index
                            ? "#0f766e"
                            : "#312e81"
                    );

                    roundedRect(
                        context,
                        x,
                        y,
                        barWidth,
                        barHeight,
                        8
                    );

                    context.fillStyle = gradient;
                    context.fill();

                    context.fillStyle = "#f8fafc";
                    context.font =
                        "800 10px system-ui, sans-serif";
                    context.textAlign = "center";

                    context.fillText(
                        fixed(result.mean, 3),
                        x + barWidth / 2,
                        y - 7
                    );

                    context.fillStyle = "#8fa9c1";

                    context.fillText(
                        "C" + (result.index + 1),
                        x + barWidth / 2,
                        chartBottom + 17
                    );
                }
            );

            if (!visibleResults.length) {
                context.fillStyle = "#8fa9c1";
                context.font =
                    "700 14px system-ui, sans-serif";
                context.textAlign = "center";

                context.fillText(
                    "Evaluate a candidate to build the leaderboard",
                    width / 2,
                    chartTop + chartHeight / 2
                );
            }

            context.textAlign = "left";
        }

        function renderLeaderboard() {
            const container = byId("cvLeaderboard");
            const best = bestResult();

            if (!results.length) {
                container.innerHTML =
                    '<p class="aiml-empty-state">' +
                    "No candidates evaluated yet." +
                    "</p>";

                return;
            }

            const ranked = results.slice().sort(
                function (a, b) {
                    return b.mean - a.mean;
                }
            );

            container.innerHTML = ranked.map(
                function (result, index) {
                    return (
                        '<article class="' +
                        (
                            best &&
                            best.index === result.index
                                ? "is-best"
                                : ""
                        ) +
                        '">' +
                        "<span>" +
                        (index + 1) +
                        "</span>" +
                        "<b>" +
                        escapeHtml(result.candidate.name) +
                        "</b>" +
                        "<strong>" +
                        fixed(result.mean, 3) +
                        " ± " +
                        fixed(result.std, 3) +
                        "</strong>" +
                        "</article>"
                    );
                }
            ).join("");
        }

        function render() {
            const order = currentOrder();

            const latest = results.length
                ? results[results.length - 1]
                : null;

            const best = bestResult();

            byId("cvFoldsValue").textContent =
                foldsInput.value;

            byId("cvCandidate").textContent =
                position + " / " + order.length;

            byId("cvMean").textContent =
                latest ? fixed(latest.mean, 3) : "—";

            byId("cvStd").textContent =
                latest ? fixed(latest.std, 3) : "—";

            byId("cvFits").textContent = String(fits);

            byId("cvBest").textContent = best
                ? best.candidate.name +
                  " · " +
                  fixed(best.mean, 3) +
                  " ± " +
                  fixed(best.std, 3)
                : "No candidate evaluated.";

            byId("cvExplanation").textContent = best
                ? "Current winner uses the highest validation evidence, with standard deviation exposing fold sensitivity. Final selection still requires a protected test or outer loop."
                : "Evaluate candidates to compare validation mean, instability and computational cost.";

            nextButton.disabled =
                position >= order.length;

            autoButton.disabled =
                position >= order.length ||
                timer !== null;

            pauseButton.disabled = timer === null;

            renderLeaderboard();
            draw();
        }

        function reset() {
            stopAuto();
            results = [];
            position = 0;
            fits = 0;
            render();
        }

        [
            strategyInput,
            searchInput,
            metricInput
        ].forEach(function (input) {
            input.addEventListener("change", reset);
        });

        foldsInput.addEventListener("input", reset);
        nextButton.addEventListener("click", evaluateNext);

        autoButton.addEventListener("click", function () {
            if (
                timer !== null ||
                position >= currentOrder().length
            ) {
                return;
            }

            autoButton.disabled = true;
            pauseButton.disabled = false;

            timer = window.setInterval(
                evaluateNext,
                720
            );
        });

        pauseButton.addEventListener(
            "click",
            function () {
                stopAuto();
                render();
            }
        );

        byId("cvReset").addEventListener(
            "click",
            reset
        );

        window.addEventListener("resize", draw);

        reset();
    }

    function initProgramTracer() {
        const codeContainer = byId("tracerCode");
        const panel = byId("tracerPanel");
        const toggle = byId("tracerPanelToggle");

        if (!codeContainer || !panel || !toggle) return;

        const lines = [
            "candidates = [0.1, 1.0, 10.0]",
            "fold_scores = [[0.72, 0.75, 0.74],",
            "               [0.80, 0.82, 0.79],",
            "               [0.76, 0.71, 0.73]]",
            "best_c = None",
            "best_mean = -1.0",
            "for index, c in enumerate(candidates):",
            "    scores = []",
            "    for fold_score in fold_scores[index]:",
            "        scores.append(fold_score)",
            "    mean_score = sum(scores) / len(scores)",
            "    if mean_score > best_mean:",
            "        best_mean = mean_score",
            "        best_c = c",
            "print(best_c)",
            "print(round(best_mean, 3))"
        ];

        const candidates = [0.1, 1.0, 10.0];

        const allFoldScores = [
            [0.72, 0.75, 0.74],
            [0.80, 0.82, 0.79],
            [0.76, 0.71, 0.73]
        ];

        function makeState(
            line,
            explanation,
            variables,
            expression,
            output
        ) {
            return {
                line: line,
                explanation: explanation,
                variables: variables || {},
                expression: expression || "—",
                output: output || ""
            };
        }

        function buildStates() {
            const states = [];

            let bestC = null;
            let bestMean = -1;

            states.push(
                makeState(
                    0,
                    "Create the hyperparameter candidates that will be compared on identical folds.",
                    { candidates: candidates },
                    "[0.1, 1.0, 10.0]"
                )
            );

            states.push(
                makeState(
                    1,
                    "Begin defining the validation scores produced by the protected folds.",
                    { candidates: candidates },
                    "fold_scores = [...]"
                )
            );

            states.push(
                makeState(
                    2,
                    "Store fold scores for candidate C=1.0.",
                    { candidates: candidates },
                    "[0.80, 0.82, 0.79]"
                )
            );

            states.push(
                makeState(
                    3,
                    "Complete the score table for all three candidates.",
                    { fold_scores: allFoldScores },
                    "3 candidates × 3 folds"
                )
            );

            states.push(
                makeState(
                    4,
                    "No candidate has been selected yet.",
                    { best_c: null },
                    "best_c = None"
                )
            );

            states.push(
                makeState(
                    5,
                    "Initialize the best mean below every valid score.",
                    {
                        best_c: null,
                        best_mean: -1
                    },
                    "best_mean = -1.0"
                )
            );

            candidates.forEach(
                function (candidate, candidateIndex) {
                    const scores = [];

                    states.push(
                        makeState(
                            6,
                            "Enter the outer loop for candidate C=" +
                                candidate +
                                ".",
                            {
                                index: candidateIndex,
                                c: candidate,
                                best_c: bestC,
                                best_mean: bestMean
                            },
                            "enumerate(candidates)"
                        )
                    );

                    states.push(
                        makeState(
                            7,
                            "Create an empty list for this candidate's fold scores.",
                            {
                                index: candidateIndex,
                                c: candidate,
                                scores: []
                            },
                            "scores = []"
                        )
                    );

                    allFoldScores[candidateIndex]
                        .forEach(
                            function (
                                foldScore,
                                foldIndex
                            ) {
                                states.push(
                                    makeState(
                                        8,
                                        "Read validation fold " +
                                            (foldIndex + 1) +
                                            " for C=" +
                                            candidate +
                                            ".",
                                        {
                                            index:
                                                candidateIndex,
                                            c: candidate,
                                            fold:
                                                foldIndex + 1,
                                            fold_score:
                                                foldScore,
                                            scores:
                                                scores.slice()
                                        },
                                        "fold_scores[" +
                                            candidateIndex +
                                            "][" +
                                            foldIndex +
                                            "]"
                                    )
                                );

                                scores.push(foldScore);

                                states.push(
                                    makeState(
                                        9,
                                        "Append " +
                                            fixed(
                                                foldScore,
                                                2
                                            ) +
                                            " to this candidate's evidence.",
                                        {
                                            index:
                                                candidateIndex,
                                            c: candidate,
                                            fold:
                                                foldIndex + 1,
                                            scores:
                                                scores.slice()
                                        },
                                        "scores.append(" +
                                            fixed(
                                                foldScore,
                                                2
                                            ) +
                                            ")"
                                    )
                                );
                            }
                        );

                    const candidateMean = mean(scores);

                    states.push(
                        makeState(
                            10,
                            "Aggregate fold evidence for C=" +
                                candidate +
                                ".",
                            {
                                c: candidate,
                                scores: scores.slice(),
                                mean_score:
                                    candidateMean,
                                best_mean: bestMean
                            },
                            "sum(scores) / len(scores) = " +
                                fixed(candidateMean, 3)
                        )
                    );

                    const improves =
                        candidateMean > bestMean;

                    states.push(
                        makeState(
                            11,
                            improves
                                ? "This candidate improves the current best validation mean."
                                : "This candidate does not improve the current best mean.",
                            {
                                c: candidate,
                                mean_score:
                                    candidateMean,
                                best_mean: bestMean
                            },
                            fixed(candidateMean, 3) +
                                " > " +
                                fixed(bestMean, 3) +
                                " → " +
                                String(improves)
                        )
                    );

                    if (improves) {
                        bestMean = candidateMean;

                        states.push(
                            makeState(
                                12,
                                "Update the best validation score.",
                                {
                                    c: candidate,
                                    best_c: bestC,
                                    best_mean:
                                        bestMean
                                },
                                "best_mean = " +
                                    fixed(
                                        bestMean,
                                        3
                                    )
                            )
                        );

                        bestC = candidate;

                        states.push(
                            makeState(
                                13,
                                "Store C=" +
                                    candidate +
                                    " as the current selected hyperparameter.",
                                {
                                    c: candidate,
                                    best_c: bestC,
                                    best_mean:
                                        bestMean
                                },
                                "best_c = " +
                                    candidate
                            )
                        );
                    }
                }
            );

            states.push(
                makeState(
                    14,
                    "Print the hyperparameter selected by validation evidence.",
                    {
                        best_c: bestC,
                        best_mean: bestMean
                    },
                    "print(best_c)",
                    String(bestC)
                )
            );

            states.push(
                makeState(
                    15,
                    "Print the selected mean validation score. Program execution is complete.",
                    {
                        best_c: bestC,
                        best_mean: bestMean
                    },
                    "round(best_mean, 3)",
                    String(bestC) +
                        "\n" +
                        fixed(bestMean, 3)
                )
            );

            return states;
        }

        const states = buildStates();
        const previous = byId("tracerPrevious");
        const next = byId("tracerNext");
        const auto = byId("tracerAuto");
        const pause = byId("tracerPause");
        const reset = byId("tracerReset");

        let step = 0;
        let timer = null;

        codeContainer.innerHTML = lines.map(
            function (line, index) {
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
            }
        ).join("");

        function stop() {
            if (timer !== null) {
                window.clearInterval(timer);
            }

            timer = null;
            pause.disabled = true;
        }

        function formatVariable(value) {
            if (value === null) return "None";

            if (typeof value === "number") {
                return Number.isInteger(value)
                    ? String(value)
                    : fixed(value, 3);
            }

            return JSON.stringify(value);
        }

        function render() {
            const atStart = step === 0;
            const atEnd = step >= states.length;
            const state =
                atStart ? null : states[step - 1];

            codeContainer
                .querySelectorAll(".aiml-code-line")
                .forEach(function (line, index) {
                    line.classList.toggle(
                        "is-active",
                        !!state &&
                        index === state.line
                    );

                    line.classList.toggle(
                        "is-complete",
                        !!state &&
                        index < state.line
                    );
                });

            if (state) {
                const activeLine =
                    codeContainer.querySelector(
                        '[data-line="' +
                        state.line +
                        '"]'
                    );

                if (activeLine) {
                    activeLine.scrollIntoView({
                        block: "nearest"
                    });
                }
            }

            byId("tracerStatus").textContent =
                atStart
                    ? "Ready"
                    : atEnd
                        ? "Complete"
                        : "Running";

            byId("tracerExplanation").textContent =
                state
                    ? state.explanation
                    : "Press Next to evaluate the first statement.";

            byId("tracerExpression").textContent =
                state ? state.expression : "—";

            byId("tracerOutput").textContent =
                state && state.output
                    ? state.output
                    : "Waiting for print(...)";

            const variables =
                state ? state.variables : {};

            byId("tracerVariables").innerHTML =
                Object.keys(variables).length
                    ? Object.keys(variables).map(
                        function (key) {
                            return (
                                '<article class="aiml-variable">' +
                                "<span>" +
                                escapeHtml(key) +
                                "</span>" +
                                "<code>" +
                                escapeHtml(
                                    formatVariable(
                                        variables[key]
                                    )
                                ) +
                                "</code>" +
                                "</article>"
                            );
                        }
                    ).join("")
                    : (
                        '<article class="aiml-variable">' +
                        "<span>STATE</span>" +
                        "<code>Not started</code>" +
                        "</article>"
                    );

            previous.disabled = atStart;
            next.disabled = atEnd;
            auto.disabled =
                atEnd || timer !== null;
            pause.disabled = timer === null;

            byId("tracerProgress").textContent =
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

        toggle.addEventListener("click", function () {
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
        });

        previous.addEventListener(
            "click",
            function () {
                stop();
                step = Math.max(0, step - 1);
                render();
            }
        );

        next.addEventListener("click", advance);

        auto.addEventListener("click", function () {
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
                720
            );
        });

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
        if (!list) return;

        const problems = [
            {
                title: "Classification Metrics from Scratch",
                description: "Read actual and predicted binary labels. Calculate TP, TN, FP, FN, precision, recall and F1 without a metrics library.",
                sampleInput: "y=[1,1,1,0,0,0], pred=[1,0,1,1,0,0]",
                expected: "TP=2 FP=1 FN=1 TN=2 F1=0.667",
                hint: "Traverse paired labels once, update one confusion count, then use safe divisions.",
                starter: "y = [1, 1, 1, 0, 0, 0]\npred = [1, 0, 1, 1, 0, 0]\n# Calculate confusion counts and metrics\n",
                solution: "y = [1, 1, 1, 0, 0, 0]\npred = [1, 0, 1, 1, 0, 0]\ntp = tn = fp = fn = 0\nfor actual, predicted in zip(y, pred):\n    if actual == 1 and predicted == 1: tp += 1\n    elif actual == 0 and predicted == 1: fp += 1\n    elif actual == 1 and predicted == 0: fn += 1\n    else: tn += 1\nprecision = tp / (tp + fp) if tp + fp else 0\nrecall = tp / (tp + fn) if tp + fn else 0\nf1 = 2 * precision * recall / (precision + recall) if precision + recall else 0\nprint(tp, fp, fn, tn, round(f1, 3))",
                required: [
                    ["zip("],
                    ["tp"],
                    ["fp"],
                    ["fn"],
                    ["tn"],
                    ["precision"],
                    ["recall"],
                    ["f1"],
                    ["print("]
                ]
            },
            {
                title: "Find the Lowest-Cost Threshold",
                description: "Test candidate thresholds and select the one minimizing false-positive and false-negative cost.",
                sampleInput: "scores=[.9,.7,.6,.4,.2], y=[1,0,1,0,1], FP=1, FN=5",
                expected: "Best threshold and cost",
                hint: "For each threshold, convert scores to 0/1 decisions and calculate fp*1 + fn*5.",
                starter: "scores = [0.9, 0.7, 0.6, 0.4, 0.2]\ny = [1, 0, 1, 0, 1]\nthresholds = [0.3, 0.5, 0.7]\n# Select the minimum-cost threshold\n",
                solution: "scores = [0.9, 0.7, 0.6, 0.4, 0.2]\ny = [1, 0, 1, 0, 1]\nthresholds = [0.3, 0.5, 0.7]\nbest_threshold = None\nbest_cost = float('inf')\nfor threshold in thresholds:\n    pred = [1 if score >= threshold else 0 for score in scores]\n    fp = sum(1 for actual, guess in zip(y, pred) if actual == 0 and guess == 1)\n    fn = sum(1 for actual, guess in zip(y, pred) if actual == 1 and guess == 0)\n    cost = fp + 5 * fn\n    if cost < best_cost:\n        best_cost = cost\n        best_threshold = threshold\nprint(best_threshold, best_cost)",
                required: [
                    ["for threshold in"],
                    [">= threshold"],
                    ["zip("],
                    ["fp"],
                    ["fn"],
                    ["cost"],
                    ["best_threshold"],
                    ["print("]
                ]
            },
            {
                title: "Regression Metric Calculator",
                description: "Calculate MAE, MSE and RMSE from paired targets and predictions.",
                sampleInput: "y=[3,5,8,10], pred=[2,6,7,12]",
                expected: "MAE=1.25 MSE=1.75 RMSE=1.323",
                hint: "Build residuals once. MAE averages absolute values; MSE averages squares; RMSE is the square root.",
                starter: "from math import sqrt\ny = [3, 5, 8, 10]\npred = [2, 6, 7, 12]\n# Calculate MAE, MSE and RMSE\n",
                solution: "from math import sqrt\ny = [3, 5, 8, 10]\npred = [2, 6, 7, 12]\nerrors = [actual - guess for actual, guess in zip(y, pred)]\nmae = sum(abs(error) for error in errors) / len(errors)\nmse = sum(error ** 2 for error in errors) / len(errors)\nrmse = sqrt(mse)\nprint(round(mae, 3), round(mse, 3), round(rmse, 3))",
                required: [
                    ["zip("],
                    ["abs("],
                    ["** 2", "**2"],
                    ["sqrt("],
                    ["mae"],
                    ["mse"],
                    ["rmse"],
                    ["print("]
                ]
            },
            {
                title: "Leakage-Safe Cross-Validation Pipeline",
                description: "Evaluate imputation, scaling and logistic regression together with stratified cross-validation.",
                sampleInput: "X, y with missing values and imbalanced classes",
                expected: "Mean and standard deviation of F1",
                hint: "Place SimpleImputer, StandardScaler and LogisticRegression inside one Pipeline passed to cross_val_score.",
                starter: "from sklearn.pipeline import Pipeline\nfrom sklearn.model_selection import StratifiedKFold, cross_val_score\n# Build and evaluate the complete pipeline\n",
                solution: "from sklearn.impute import SimpleImputer\nfrom sklearn.linear_model import LogisticRegression\nfrom sklearn.model_selection import StratifiedKFold, cross_val_score\nfrom sklearn.pipeline import Pipeline\nfrom sklearn.preprocessing import StandardScaler\nmodel = Pipeline([\n    ('imputer', SimpleImputer(strategy='median')),\n    ('scaler', StandardScaler()),\n    ('classifier', LogisticRegression(max_iter=2000))\n])\ncv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)\nscores = cross_val_score(model, X, y, cv=cv, scoring='f1')\nprint(round(scores.mean(), 3), round(scores.std(), 3))",
                required: [
                    ["pipeline("],
                    ["simpleimputer("],
                    ["standardscaler("],
                    ["logisticregression("],
                    ["stratifiedkfold("],
                    ["cross_val_score("],
                    ["scoring='f1'", "scoring=\"f1\""],
                    ["print("]
                ]
            },
            {
                title: "Grid Search with Protected Final Test",
                description: "Tune an SVM pipeline on development folds, then evaluate the selected pipeline once on the untouched test set.",
                sampleInput: "X_train, X_test, y_train, y_test",
                expected: "Best parameters, CV score and final test F1",
                hint: "Pass the pipeline and parameter grid to GridSearchCV. Fit only training data before predicting X_test.",
                starter: "from sklearn.model_selection import GridSearchCV\nfrom sklearn.pipeline import Pipeline\n# Tune on training folds and test once\n",
                solution: "from sklearn.metrics import f1_score\nfrom sklearn.model_selection import GridSearchCV, StratifiedKFold\nfrom sklearn.pipeline import Pipeline\nfrom sklearn.preprocessing import StandardScaler\nfrom sklearn.svm import SVC\npipe = Pipeline([('scale', StandardScaler()), ('svc', SVC())])\nparams = {'svc__C': [0.1, 1, 10], 'svc__gamma': ['scale', 0.1, 0.01]}\ncv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)\nsearch = GridSearchCV(pipe, params, scoring='f1', cv=cv, n_jobs=-1)\nsearch.fit(X_train, y_train)\ntest_pred = search.best_estimator_.predict(X_test)\nprint(search.best_params_)\nprint(round(search.best_score_, 3))\nprint(round(f1_score(y_test, test_pred), 3))",
                required: [
                    ["pipeline("],
                    ["gridsearchcv("],
                    ["stratifiedkfold("],
                    ["scoring='f1'", "scoring=\"f1\""],
                    [".fit(x_train"],
                    ["best_estimator_"],
                    ["predict(x_test"],
                    ["f1_score("],
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
            typeof saved.problemScores === "object"
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
            const total = Object.values(scores)
                .reduce(function (sum, score) {
                    return sum + Number(score || 0);
                }, 0);

            byId("problemSolvedCount").textContent =
                solved.size + " / " + problems.length;

            byId("problemScore").textContent =
                total +
                " / " +
                (problems.length * 100);

            byId("problemProgressBar").style.width =
                solved.size /
                problems.length *
                100 +
                "%";
        }

        list.innerHTML = problems.map(
            function (problem, index) {
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
            }
        ).join("");

        function togglePanel(
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

            if (!panel) return;

            const opening = panel.hidden;
            panel.hidden = !opening;
            button.textContent =
                opening ? closeText : openText;
        }

        list.addEventListener("click", function (event) {
            const button = event.target.closest(
                "button[data-action]"
            );

            if (!button) return;

            const card = button.closest(
                ".aiml-problem-card"
            );

            const index = Number(
                card.dataset.problem
            );

            const problem = problems[index];
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
                textarea.value = problem.starter;
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
                        "Not complete yet. Recheck the required metric, validation or output logic.";

                    return;
                }

                const score =
                    revealed.has(index) ? 60 : 100;

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
                        ? "Logic recognized — completed after viewing the model program. Score: 60/100."
                        : "Logic recognized — solved independently. Score: 100/100.";

                save();
                updateSummary();
            }
        });

        updateSummary();
    }

    function initQuiz() {
        const container = byId("quizQuestions");
        if (!container) return;

        const questions = [
            {
                question: "What is the correct role of a final test set?",
                options: [
                    "Tune hyperparameters repeatedly",
                    "Fit preprocessing statistics",
                    "Estimate the locked selection procedure once",
                    "Choose features after every result"
                ],
                answer: 2,
                explanation: "The test set is protected until the model family, preprocessing, hyperparameters and threshold are fixed."
            },
            {
                question: "Which metric asks: of all actual positives, how many were found?",
                options: [
                    "Precision",
                    "Recall",
                    "Specificity",
                    "R²"
                ],
                answer: 1,
                explanation: "Recall = TP/(TP+FN), so it measures coverage of the actual positive class."
            },
            {
                question: "When the positive class is rare, which view is usually more informative than accuracy alone?",
                options: [
                    "Precision–recall behaviour and confusion counts",
                    "Training loss only",
                    "Number of features",
                    "Test-set size without labels"
                ],
                answer: 0,
                explanation: "Accuracy may be dominated by the majority class. Precision, recall, PR-AUC and counts reveal rare-positive performance."
            },
            {
                question: "What usually happens when a binary decision threshold is lowered?",
                options: [
                    "Predicted positives decrease",
                    "Recall tends to rise and false positives may rise",
                    "The ranking model retrains automatically",
                    "ROC-AUC must become zero"
                ],
                answer: 1,
                explanation: "More scores pass a lower threshold, increasing positive predictions; this can capture positives and also add false alarms."
            },
            {
                question: "Which splitter is safest when several rows belong to the same patient?",
                options: [
                    "Ordinary shuffled K-fold",
                    "Group-aware cross-validation",
                    "Leave labels in both sides",
                    "Randomly duplicate patients"
                ],
                answer: 1,
                explanation: "All rows from one entity must remain on one side to prevent identity-specific leakage."
            },
            {
                question: "Why should scaling be placed inside a cross-validation pipeline?",
                options: [
                    "To make the test set larger",
                    "So each scaler learns only from its training fold",
                    "To eliminate all variance",
                    "To guarantee perfect scores"
                ],
                answer: 1,
                explanation: "Global scaling lets validation rows influence the fitted mean and variance. A pipeline refits scaling inside every training fold."
            },
            {
                question: "Which search is often efficient when only a few dimensions strongly affect performance?",
                options: [
                    "Random search over useful distributions",
                    "Checking one arbitrary point",
                    "Using the final test set",
                    "Removing validation"
                ],
                answer: 0,
                explanation: "Random search explores more distinct values of influential parameters under the same trial budget."
            },
            {
                question: "What does nested cross-validation estimate with its outer folds?",
                options: [
                    "Training accuracy",
                    "The complete model-selection procedure",
                    "Only one preprocessing value",
                    "Guaranteed future performance"
                ],
                answer: 1,
                explanation: "Inner folds select hyperparameters; untouched outer folds estimate the generalization of that selection procedure."
            },
            {
                question: "A model has good ROC-AUC but predicted 0.8 cases are positive only 50% of the time. What is weak?",
                options: [
                    "Ranking must be perfect",
                    "Calibration",
                    "Dataset storage",
                    "Feature count"
                ],
                answer: 1,
                explanation: "The ranking can be useful while probabilities are overconfident. Calibration measures agreement between predicted probability and observed frequency."
            },
            {
                question: "Which is the strongest production model-selection argument?",
                options: [
                    "Highest training score",
                    "Newest algorithm",
                    "Reproducible protected evaluation shows useful gain that justifies cost",
                    "Largest parameter count"
                ],
                answer: 2,
                explanation: "A production decision balances generalization evidence, uncertainty, calibration, subgroup behaviour and operational cost."
            }
        ];

        container.innerHTML = questions.map(
            function (item, questionIndex) {
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
                    item.options.map(
                        function (
                            option,
                            optionIndex
                        ) {
                            const id =
                                "quiz-twelve-" +
                                questionIndex +
                                "-" +
                                optionIndex;

                            return (
                                '<label class="aiml-quiz-option" for="' +
                                id +
                                '">' +
                                '<input type="radio" id="' +
                                id +
                                '" name="quiz-twelve-' +
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
                    .closest(".aiml-quiz-question")
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

                byId("quizScore").textContent =
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
                    Number(
                        progress.bestQuizScore || 0
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
        if (!container) return;

        const questions = [
            {
                question: "Why is accuracy misleading for imbalanced classification?",
                answer: "Accuracy weights every correct prediction equally and can be dominated by the majority class. A model predicting only the majority class may appear accurate while detecting no rare positives. Inspect confusion counts, precision, recall, specificity, F1 or PR-AUC according to the decision cost."
            },
            {
                question: "Explain precision and recall using a real application.",
                answer: "In disease screening, recall is the proportion of truly affected patients detected, while precision is the proportion of positive alerts that are truly affected. High recall reduces missed disease; high precision reduces unnecessary follow-up. The operating threshold should balance those consequences and available review capacity."
            },
            {
                question: "What is the difference between ROC-AUC and PR-AUC?",
                answer: "ROC-AUC measures ranking through true-positive rate versus false-positive rate across thresholds. PR-AUC summarizes precision versus recall and focuses directly on positive retrieval. With rare positives, a low false-positive rate can still create many false alarms, so PR behaviour is often more operationally revealing."
            },
            {
                question: "Why should a classification threshold be tuned separately from model parameters?",
                answer: "Model training learns a score or probability function, while the threshold converts it into an action. The same ranking model can support different cost or capacity policies. Tune the threshold on validation evidence after fitting, then evaluate the locked model-plus-threshold procedure on protected data."
            },
            {
                question: "Compare K-fold, stratified, group and time-series cross-validation.",
                answer: "K-fold suits approximately independent rows. Stratification preserves class ratios. Group validation keeps related entities entirely within one side. Time-series validation preserves chronology and trains on past data before later validation. The dependency structure determines the splitter; no splitter is universally best."
            },
            {
                question: "How does a pipeline prevent data leakage?",
                answer: "A pipeline delays fitting learned transformations until each training fold is supplied. Imputation values, scaling statistics, selected features and resampling decisions are therefore learned without the current validation fold. The cross-validator evaluates the complete sequence rather than a model trained on globally prepared features."
            },
            {
                question: "Compare grid search and random search.",
                answer: "Grid search evaluates every listed Cartesian combination and is useful for a small focused space. Random search samples parameter distributions and can explore more distinct values in influential dimensions under a fixed budget. Both optimize validation evidence and can overfit it after many trials."
            },
            {
                question: "What problem does nested cross-validation solve?",
                answer: "Selecting the best hyperparameters makes ordinary cross-validation performance optimistic because its folds influenced the choice. Nested CV tunes inside each outer-training portion and evaluates the selected configuration on an untouched outer fold, estimating the generalization of the full selection procedure."
            },
            {
                question: "Can cross-validation replace a final test set?",
                answer: "Cross-validation can provide strong development evidence and nested CV can estimate a selection procedure, especially with limited data. A final test set remains valuable when available because it gives one untouched assessment after all decisions. Neither approach protects against an invalid sampling design or future distribution shift."
            },
            {
                question: "How do you report model performance responsibly?",
                answer: "Report the dataset and split logic, complete pipeline, primary and secondary metrics, confusion counts or residual summaries, fold scores and uncertainty, calibration where probabilities matter, subgroup and temporal behaviour, baseline comparison, computational cost and known limitations. Avoid presenting one rounded mean as certainty."
            },
            {
                question: "Why can a validation winner fail on the test set?",
                answer: "The candidate may have fitted validation noise, the validation sample may be small or unrepresentative, many trials may have amplified selection optimism, or leakage may be present. A lower test score is not automatically an error; it can reveal normal uncertainty or a flawed evaluation process."
            },
            {
                question: "How would you evaluate a placement-shortlisting model?",
                answer: "Define the role of the model as decision support, protect sensitive attributes, split by the deployment cohort or time, choose metrics reflecting qualified-candidate recall and review precision, inspect subgroup confusion rates and calibration, compare with a transparent baseline, include human review and monitor outcomes after deployment."
            }
        ];

        container.innerHTML = questions.map(
            function (item, index) {
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
            }
        ).join("");

        container.addEventListener(
            "click",
            function (event) {
                const button =
                    event.target.closest("button");

                if (!button) return;

                const answer = button
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

    function initSmoothLocalLinks() {
        document.addEventListener(
            "click",
            function (event) {
                const link = event.target.closest(
                    'a[href^="#"]'
                );

                if (
                    !link ||
                    link.getAttribute("href") === "#"
                ) {
                    return;
                }

                const target =
                    document.querySelector(
                        link.getAttribute("href")
                    );

                if (!target) return;

                event.preventDefault();

                target.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            }
        );
    }

    function initLevelTwelve() {
        initMetricVisualizer();
        initCrossValidationLab();
        initProgramTracer();
        initProgrammingProblems();
        initQuiz();
        initInterviewQuestions();
        initSmoothLocalLinks();
    }

    if (document.readyState === "loading") {
        document.addEventListener(
            "DOMContentLoaded",
            initLevelTwelve
        );
    } else {
        initLevelTwelve();
    }
}());
