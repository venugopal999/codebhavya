(function () {
    "use strict";

    const PROGRESS_KEY = "codebhavya-aiml-level-19-progress-v1";
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

    function sigmoid(value) {
        return 1 / (1 + Math.exp(-value));
    }

    function average(values) {
        return values.length ? values.reduce(function (sum, value) { return sum + value; }, 0) / values.length : 0;
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

    function seriesDefinition(name) {
        if (name === "trend") return [18, 20, 21, 23, 24, 27, 28, 29, 32, 33, 35, 38, 39, 41, 44, 46, 47, 50, 52, 55, 56, 59, 61, 64, 66, 68, 71, 73];
        if (name === "volatile") return [40, 43, 37, 48, 35, 46, 42, 52, 39, 50, 45, 54, 43, 57, 49, 61, 47, 58, 53, 64, 50, 66, 55, 62, 58, 70, 57, 68];
        if (name === "shift") return [22, 24, 23, 25, 22, 24, 26, 23, 25, 24, 26, 25, 23, 24, 43, 45, 44, 46, 43, 47, 45, 48, 46, 49, 47, 50, 48, 51];
        return [30, 42, 35, 51, 32, 44, 37, 54, 34, 47, 39, 57, 36, 49, 41, 60, 38, 52, 43, 63, 40, 54, 45, 66, 42, 57, 47, 69];
    }

    function linearForecast(history) {
        const span = Math.min(history.length, 10);
        const values = history.slice(-span);
        const meanX = (span - 1) / 2;
        const meanY = average(values);
        let numerator = 0;
        let denominator = 0;
        values.forEach(function (value, index) {
            numerator += (index - meanX) * (value - meanY);
            denominator += Math.pow(index - meanX, 2);
        });
        const slope = denominator ? numerator / denominator : 0;
        const intercept = meanY - slope * meanX;
        return { prediction: intercept + slope * span, slope: slope, span: span };
    }

    function smoothingForecast(history, windowSize) {
        const alpha = 2 / (windowSize + 1);
        let level = history[0];
        history.slice(1).forEach(function (value) { level = alpha * value + (1 - alpha) * level; });
        return { prediction: level, alpha: alpha };
    }

    function oneForecast(history, method, windowSize) {
        if (method === "seasonal") {
            const index = Math.max(0, history.length - windowSize);
            return { prediction: history[index], equation: "ŷ = y[t−" + windowSize + "] = " + fixed(history[index], 1), source: "seasonal lag " + windowSize };
        }
        if (method === "moving") {
            const sample = history.slice(-windowSize);
            const prediction = average(sample);
            return { prediction: prediction, equation: "ŷ = mean(" + sample.map(function (value) { return fixed(value, 0); }).join(", ") + ") = " + fixed(prediction, 2), source: windowSize + "-step moving average" };
        }
        if (method === "trend") {
            const trend = linearForecast(history);
            return { prediction: trend.prediction, equation: "ŷ = intercept + " + fixed(trend.slope, 2) + " × next_index = " + fixed(trend.prediction, 2), source: "linear trend over " + trend.span + " points" };
        }
        if (method === "smooth") {
            const smooth = smoothingForecast(history, windowSize);
            return { prediction: smooth.prediction, equation: "ℓ[t] = " + fixed(smooth.alpha, 2) + "y[t] + " + fixed(1 - smooth.alpha, 2) + "ℓ[t−1] = " + fixed(smooth.prediction, 2), source: "exponential smoothing" };
        }
        const prediction = history[history.length - 1];
        return { prediction: prediction, equation: "ŷ = last observed value = " + fixed(prediction, 1), source: "last-value naive" };
    }

    function backtest(series, method, windowSize, horizon) {
        const trainEnd = series.length - horizon;
        const predictions = [];
        const details = [];
        for (let index = trainEnd; index < series.length; index += 1) {
            const history = series.slice(0, index);
            const forecast = oneForecast(history, method, windowSize);
            predictions.push(forecast.prediction);
            details.push({ index: index, actual: series[index], prediction: forecast.prediction, error: series[index] - forecast.prediction, equation: forecast.equation, source: forecast.source });
        }
        return { trainEnd: trainEnd, predictions: predictions, details: details };
    }

    function calculateMetrics(details) {
        if (!details.length) return { mae: null, rmse: null, mape: null };
        const absolute = details.map(function (item) { return Math.abs(item.error); });
        const squared = details.map(function (item) { return item.error * item.error; });
        const percentages = details.filter(function (item) { return Math.abs(item.actual) > 0.000001; }).map(function (item) { return Math.abs(item.error / item.actual) * 100; });
        return { mae: average(absolute), rmse: Math.sqrt(average(squared)), mape: average(percentages) };
    }

    function initForecastLab() {
        const canvas = get("forecastCanvas");
        if (!canvas || canvas.dataset.cbActive) return;
        canvas.dataset.cbActive = "true";
        const seriesInput = get("forecastSeries");
        const methodInput = get("forecastMethod");
        const windowInput = get("forecastWindow");
        const horizonInput = get("forecastHorizon");
        const nextButton = get("forecastNext");
        const autoButton = get("forecastAuto");
        const pauseButton = get("forecastPause");
        const resetButton = get("forecastReset");
        let step = 0;
        let timer = null;

        function values() {
            const series = seriesDefinition(seriesInput.value);
            const windowSize = Number(windowInput.value);
            const horizon = Number(horizonInput.value);
            return { series: series, windowSize: windowSize, horizon: horizon, test: backtest(series, methodInput.value, windowSize, horizon) };
        }

        function stop() {
            if (timer !== null) window.clearInterval(timer);
            timer = null;
            pauseButton.disabled = true;
        }

        function drawLine(context, points, color, width, dashed) {
            if (!points.length) return;
            context.save();
            context.strokeStyle = color;
            context.lineWidth = width;
            context.lineJoin = "round";
            context.lineCap = "round";
            context.setLineDash(dashed ? [7, 6] : []);
            context.beginPath();
            points.forEach(function (point, index) { if (index === 0) context.moveTo(point.x, point.y); else context.lineTo(point.x, point.y); });
            context.stroke();
            context.restore();
        }

        function draw() {
            const data = values();
            const prepared = prepareCanvas(canvas, 450, 470);
            const context = prepared.context;
            const width = prepared.width;
            const height = prepared.height;
            const margin = width < 560 ? { left: 44, right: 20, top: 40, bottom: 58 } : { left: 58, right: 30, top: 45, bottom: 62 };
            const chartWidth = width - margin.left - margin.right;
            const chartHeight = height - margin.top - margin.bottom;
            const shownPredictions = data.test.predictions.slice(0, step);
            const allValues = data.series.concat(shownPredictions);
            const minimum = Math.min.apply(null, allValues) - 5;
            const maximum = Math.max.apply(null, allValues) + 5;
            const xFor = function (index) { return margin.left + index / (data.series.length - 1) * chartWidth; };
            const yFor = function (value) { return margin.top + (maximum - value) / (maximum - minimum || 1) * chartHeight; };
            context.fillStyle = "#061426";
            context.fillRect(0, 0, width, height);
            context.strokeStyle = "#17324c";
            context.lineWidth = 1;
            context.fillStyle = "#82a7c5";
            context.font = "700 10px Arial";
            for (let line = 0; line <= 5; line += 1) {
                const y = margin.top + line / 5 * chartHeight;
                const label = maximum - line / 5 * (maximum - minimum);
                context.beginPath();
                context.moveTo(margin.left, y);
                context.lineTo(width - margin.right, y);
                context.stroke();
                context.textAlign = "right";
                context.fillText(fixed(label, 0), margin.left - 8, y + 4);
            }
            const originX = xFor(data.test.trainEnd - 0.5);
            context.fillStyle = "rgba(250, 204, 21, .06)";
            context.fillRect(originX, margin.top, width - margin.right - originX, chartHeight);
            context.setLineDash([5, 5]);
            context.strokeStyle = "#facc15";
            context.lineWidth = 2;
            context.beginPath();
            context.moveTo(originX, margin.top);
            context.lineTo(originX, margin.top + chartHeight);
            context.stroke();
            context.setLineDash([]);
            context.fillStyle = "#facc15";
            context.textAlign = "center";
            context.font = "900 10px Arial";
            context.fillText("FORECAST ORIGIN", originX, margin.top - 15);
            const historyPoints = data.series.slice(0, data.test.trainEnd).map(function (value, index) { return { x: xFor(index), y: yFor(value) }; });
            const actualPoints = data.series.slice(data.test.trainEnd - 1).map(function (value, offset) { return { x: xFor(data.test.trainEnd - 1 + offset), y: yFor(value) }; });
            const predictionPoints = shownPredictions.length ? [{ x: xFor(data.test.trainEnd - 1), y: yFor(data.series[data.test.trainEnd - 1]) }].concat(shownPredictions.map(function (value, offset) { return { x: xFor(data.test.trainEnd + offset), y: yFor(value) }; })) : [];
            drawLine(context, historyPoints, "#38bff8", 3, false);
            drawLine(context, actualPoints, "#f8fafc", 2.5, false);
            drawLine(context, predictionPoints, "#facc15", 3, true);
            historyPoints.concat(actualPoints.slice(1)).forEach(function (point) { context.fillStyle = "#e2e8f0"; context.beginPath(); context.arc(point.x, point.y, 3.2, 0, Math.PI * 2); context.fill(); });
            predictionPoints.slice(1).forEach(function (point) { context.fillStyle = "#facc15"; context.beginPath(); context.arc(point.x, point.y, 5, 0, Math.PI * 2); context.fill(); });
            if (step > 0) {
                const item = data.test.details[step - 1];
                const x = xFor(item.index);
                context.strokeStyle = "#f472b6";
                context.lineWidth = 2;
                context.beginPath();
                context.moveTo(x, yFor(item.actual));
                context.lineTo(x, yFor(item.prediction));
                context.stroke();
                drawRounded(context, clamp(x - 70, margin.left, width - margin.right - 140), margin.top + 15, 140, 48, 10);
                context.fillStyle = "#0b2038";
                context.fill();
                context.strokeStyle = "#315775";
                context.stroke();
                context.fillStyle = "#7dd3fc";
                context.textAlign = "center";
                context.font = "800 10px Arial";
                context.fillText("ACTUAL " + fixed(item.actual, 1) + " • PRED " + fixed(item.prediction, 1), clamp(x, margin.left + 70, width - margin.right - 70), margin.top + 35);
                context.fillStyle = "#facc15";
                context.fillText("ERROR " + fixed(item.error, 2), clamp(x, margin.left + 70, width - margin.right - 70), margin.top + 52);
            }
            context.fillStyle = "#82a7c5";
            context.textAlign = "center";
            context.font = "800 10px Arial";
            context.fillText("CHRONOLOGICAL TIME →", margin.left + chartWidth / 2, height - 22);
        }

        function render() {
            const data = values();
            const complete = step >= data.horizon;
            const revealed = data.test.details.slice(0, step);
            const current = step ? revealed[revealed.length - 1] : null;
            const metrics = calculateMetrics(revealed);
            get("forecastWindowValue").textContent = data.windowSize + " steps";
            get("forecastHorizonValue").textContent = data.horizon + " steps";
            get("forecastPhase").textContent = step === 0 ? "Ready" : complete ? "Complete" : "Testing";
            get("forecastOrigin").textContent = current ? "t = " + current.index : "—";
            get("forecastMae").textContent = metrics.mae === null ? "—" : fixed(metrics.mae, 2);
            get("forecastRmse").textContent = metrics.rmse === null ? "—" : fixed(metrics.rmse, 2);
            get("forecastMape").textContent = metrics.mape === null ? "—" : fixed(metrics.mape, 1) + "%";
            if (!current) {
                get("forecastVerdict").textContent = "Choose a method and begin the chronological test.";
                get("forecastEquation").textContent = "Waiting for forecast";
                get("forecastExplanation").textContent = "The first " + data.test.trainEnd + " observations form training history; the final " + data.horizon + " are held out.";
                get("forecastNextCheck").textContent = "Predict which baseline matches the visible structure.";
            } else {
                get("forecastVerdict").textContent = complete ? "The rolling backtest is complete." : "Forecast " + step + " of " + data.horizon + " has been evaluated.";
                get("forecastEquation").textContent = current.equation;
                get("forecastExplanation").textContent = "The " + current.source + " predicted " + fixed(current.prediction, 2) + "; actual was " + fixed(current.actual, 2) + ", giving absolute error " + fixed(Math.abs(current.error), 2) + ".";
                get("forecastNextCheck").textContent = complete ? "Change the method and compare both error size and residual pattern." : "Predict the next test value before revealing its forecast.";
            }
            nextButton.textContent = complete ? "Backtest Complete" : step === 0 ? "Forecast First Test Point" : "Forecast Next Test Point";
            nextButton.disabled = complete;
            autoButton.disabled = complete || timer !== null;
            pauseButton.disabled = timer === null;
            if (complete) stop();
            draw();
        }

        function advance() {
            const count = values().horizon;
            if (step < count) step += 1;
            render();
        }

        function reset() {
            stop();
            step = 0;
            render();
        }

        nextButton.addEventListener("click", advance);
        autoButton.addEventListener("click", function () { if (timer !== null || nextButton.disabled) return; timer = window.setInterval(advance, 720); render(); });
        pauseButton.addEventListener("click", function () { stop(); render(); });
        resetButton.addEventListener("click", reset);
        [seriesInput, methodInput].forEach(function (input) { input.addEventListener("change", reset); });
        [windowInput, horizonInput].forEach(function (input) { input.addEventListener("input", reset); });
        window.addEventListener("resize", draw);
        render();
        window.requestAnimationFrame(draw);
    }

    function sequenceDefinition(name) {
        if (name === "alternating") return [1, -1, 1, -1, 1, -1, 1, -1];
        if (name === "delayed") return [1.6, 0.1, 0.05, 0.1, 0.05, 0.1, 0.05, 0.1];
        if (name === "decay") return [1.6, 1.25, 0.95, 0.72, 0.52, 0.36, 0.22, 0.12];
        return [0.2, 0.45, 0.7, 0.95, 1.2, 1.45, 1.7, 1.95];
    }

    function calculateMemory(sequence, cellType, strength) {
        let hidden = 0;
        let cell = 0;
        return sequence.map(function (input, index) {
            const previousHidden = hidden;
            const previousCell = cell;
            let gates;
            let equation;
            if (cellType === "lstm") {
                const forget = sigmoid((strength * 2 - 1) + 0.25 * input + 0.2 * previousHidden);
                const write = sigmoid(0.55 * input - 0.15 * previousHidden);
                const candidate = Math.tanh(0.8 * input + 0.35 * previousHidden);
                const output = sigmoid(0.45 * input + 0.25 * previousHidden);
                cell = forget * previousCell + write * candidate;
                hidden = output * Math.tanh(cell);
                gates = { retain: forget, write: write, expose: output, candidate: candidate };
                equation = "cₜ = " + fixed(forget, 2) + "×" + fixed(previousCell, 2) + " + " + fixed(write, 2) + "×" + fixed(candidate, 2) + " = " + fixed(cell, 3);
            } else if (cellType === "gru") {
                const reset = sigmoid(0.5 * input + 0.25 * previousHidden);
                const update = sigmoid((strength * 2 - 1) + 0.3 * input);
                const candidate = Math.tanh(0.75 * input + 0.45 * reset * previousHidden);
                hidden = update * previousHidden + (1 - update) * candidate;
                cell = hidden;
                gates = { retain: reset, write: update, expose: 1, candidate: candidate };
                equation = "hₜ = " + fixed(update, 2) + "×" + fixed(previousHidden, 2) + " + " + fixed(1 - update, 2) + "×" + fixed(candidate, 2) + " = " + fixed(hidden, 3);
            } else {
                hidden = Math.tanh(0.75 * input + strength * previousHidden - 0.1);
                cell = hidden;
                gates = { retain: strength, write: 1 - strength, expose: 1, candidate: hidden };
                equation = "hₜ = tanh(0.75×" + fixed(input, 2) + " + " + fixed(strength, 2) + "×" + fixed(previousHidden, 2) + " − 0.1) = " + fixed(hidden, 3);
            }
            return { index: index, input: input, previousHidden: previousHidden, previousCell: previousCell, hidden: hidden, cell: cell, gates: gates, equation: equation, prediction: hidden * 10 + 5 };
        });
    }

    function initMemoryLab() {
        const canvas = get("memoryCanvas");
        if (!canvas || canvas.dataset.cbActive) return;
        canvas.dataset.cbActive = "true";
        const sequenceInput = get("memorySequence");
        const cellInput = get("memoryCell");
        const strengthInput = get("memoryStrength");
        const nextButton = get("memoryNext");
        const autoButton = get("memoryAuto");
        const pauseButton = get("memoryPause");
        const resetButton = get("memoryReset");
        let step = 0;
        let timer = null;

        function values() {
            const sequence = sequenceDefinition(sequenceInput.value);
            const strength = Number(strengthInput.value) / 100;
            return { sequence: sequence, strength: strength, states: calculateMemory(sequence, cellInput.value, strength) };
        }

        function stop() {
            if (timer !== null) window.clearInterval(timer);
            timer = null;
            pauseButton.disabled = true;
        }

        function draw() {
            const data = values();
            const prepared = prepareCanvas(canvas, 460, 600);
            const context = prepared.context;
            const width = prepared.width;
            const height = prepared.height;
            const mobile = width < 560;
            context.fillStyle = "#061426";
            context.fillRect(0, 0, width, height);
            const count = data.sequence.length;
            if (mobile) {
                const trackX = 34;
                const cardX = 88;
                const cardWidth = width - 116;
                data.sequence.forEach(function (input, index) {
                    const y = 38 + index * 58;
                    context.strokeStyle = index < step ? "#22d3ee" : "#284963";
                    context.lineWidth = 3;
                    if (index < count - 1) { context.beginPath(); context.moveTo(trackX, y + 18); context.lineTo(trackX, y + 62); context.stroke(); }
                    context.fillStyle = index === step - 1 ? "#facc15" : index < step ? "#22d3ee" : "#17324c";
                    context.beginPath(); context.arc(trackX, y + 15, 8, 0, Math.PI * 2); context.fill();
                    drawRounded(context, cardX, y, cardWidth, 43, 11);
                    context.fillStyle = index === step - 1 ? "#173d5e" : "#0b2038"; context.fill();
                    context.strokeStyle = index === step - 1 ? "#facc15" : index < step ? "#22d3ee" : "#315775"; context.stroke();
                    context.fillStyle = "#f8fafc"; context.font = "900 11px Arial"; context.textAlign = "left"; context.fillText("t" + (index + 1) + "   x = " + fixed(input, 2), cardX + 14, y + 18);
                    context.fillStyle = "#7dd3fc"; context.font = "800 10px Arial"; context.fillText(index < step ? "h = " + fixed(data.states[index].hidden, 3) : "waiting", cardX + 14, y + 35);
                });
                const current = step ? data.states[step - 1] : null;
                drawRounded(context, 28, 515, width - 56, 58, 13);
                context.fillStyle = "#0b2038"; context.fill(); context.strokeStyle = "#315775"; context.stroke();
                context.fillStyle = "#facc15"; context.font = "900 12px Arial"; context.textAlign = "center";
                context.fillText(current ? cellInput.options[cellInput.selectedIndex].text + " • state " + fixed(current.hidden, 3) : "Process the sequence to expose recurrent memory", width / 2, 550);
            } else {
                const left = 38;
                const gap = (width - 76) / (count - 1);
                const centreY = 95;
                context.strokeStyle = "#284963"; context.lineWidth = 3; context.beginPath(); context.moveTo(left, centreY); context.lineTo(width - left, centreY); context.stroke();
                data.sequence.forEach(function (input, index) {
                    const x = left + index * gap;
                    context.fillStyle = index === step - 1 ? "#facc15" : index < step ? "#22d3ee" : "#17324c";
                    context.beginPath(); context.arc(x, centreY, index === step - 1 ? 11 : 8, 0, Math.PI * 2); context.fill();
                    context.fillStyle = "#c4d9eb"; context.textAlign = "center"; context.font = "800 10px Arial"; context.fillText("x" + (index + 1), x, centreY - 24); context.fillText(fixed(input, 1), x, centreY + 28);
                });
                const current = step ? data.states[step - 1] : null;
                const boxWidth = Math.min(350, width - 80);
                const boxX = (width - boxWidth) / 2;
                drawRounded(context, boxX, 170, boxWidth, 170, 22);
                context.fillStyle = "#0b2038"; context.fill(); context.strokeStyle = current ? "#facc15" : "#315775"; context.lineWidth = 2; context.stroke();
                context.fillStyle = "#7dd3fc"; context.font = "950 12px Arial"; context.textAlign = "center"; context.fillText(cellInput.options[cellInput.selectedIndex].text.toUpperCase() + " RECURRENT CELL", width / 2, 202);
                context.fillStyle = "#f8fafc"; context.font = "900 25px Arial"; context.fillText(current ? "hₜ = " + fixed(current.hidden, 3) : "h₀ = 0.000", width / 2, 252);
                context.fillStyle = "#91a9c0"; context.font = "800 12px Arial"; context.fillText(current ? "xₜ " + fixed(current.input, 2) + "  •  previous h " + fixed(current.previousHidden, 3) : "Waiting for the first ordered input", width / 2, 283);
                context.fillStyle = "#facc15"; context.font = "900 14px Arial"; context.fillText(current ? "prediction " + fixed(current.prediction, 2) : "state will flow through time", width / 2, 316);
                context.strokeStyle = "#22d3ee"; context.lineWidth = 3; context.beginPath(); context.moveTo(width / 2, 340); context.lineTo(width / 2, 388); context.stroke();
                context.fillStyle = "#22d3ee"; context.beginPath(); context.moveTo(width / 2 - 7, 381); context.lineTo(width / 2 + 7, 381); context.lineTo(width / 2, 394); context.fill();
                context.fillStyle = "#82a7c5"; context.font = "800 11px Arial"; context.fillText("SHARED PARAMETERS • ORDERED STATE TRANSITION", width / 2, 430);
            }
        }

        function renderGates(current) {
            const labels = cellInput.value === "lstm" ? ["FORGET GATE", "INPUT GATE", "OUTPUT GATE"] : cellInput.value === "gru" ? ["RESET GATE", "UPDATE GATE", "EXPOSURE"] : ["RECURRENT WEIGHT", "NEW SIGNAL", "EXPOSURE"];
            const values = current ? [current.gates.retain, current.gates.write, current.gates.expose] : [null, null, null];
            get("memoryGates").innerHTML = labels.map(function (label, index) { return "<article><span>" + label + "</span><strong>" + (values[index] === null ? "—" : fixed(values[index], 3)) + "</strong></article>"; }).join("");
        }

        function render() {
            const data = values();
            const complete = step >= data.sequence.length;
            const current = step ? data.states[step - 1] : null;
            get("memoryStrengthValue").textContent = fixed(data.strength, 2);
            get("memoryStep").textContent = current ? (step + " / " + data.sequence.length) : "Ready";
            get("memoryInput").textContent = current ? fixed(current.input, 2) : "—";
            get("memoryHidden").textContent = current ? fixed(current.hidden, 3) : "0.000";
            get("memoryCellState").textContent = current && cellInput.value === "lstm" ? fixed(current.cell, 3) : "—";
            get("memoryPrediction").textContent = current ? fixed(current.prediction, 2) : "—";
            renderGates(current);
            if (!current) {
                get("memoryVerdict").textContent = "Choose a recurrent cell and process the sequence.";
                get("memoryEquation").textContent = "Waiting for input";
                get("memoryExplanation").textContent = "The hidden state begins at zero and changes as each ordered observation arrives.";
                get("memoryNextCheck").textContent = "Predict whether the selected cell will retain an early signal.";
            } else {
                get("memoryVerdict").textContent = complete ? "The complete sequence has passed through shared recurrent parameters." : "Time step " + step + " has updated the model state.";
                get("memoryEquation").textContent = current.equation;
                get("memoryExplanation").textContent = cellInput.value === "lstm" ? "The forget gate retained earlier cell memory while the input gate wrote part of the candidate." : cellInput.value === "gru" ? "The update gate blended earlier hidden state with the new candidate state." : "The simple RNN mixed current input and previous hidden state before tanh.";
                get("memoryNextCheck").textContent = complete ? "Change the sequence or cell and compare how its final memory changes." : "Predict whether the next input will strengthen, reverse or preserve the state.";
            }
            nextButton.textContent = complete ? "Sequence Complete" : step === 0 ? "Process First Step" : "Process Next Step";
            nextButton.disabled = complete;
            autoButton.disabled = complete || timer !== null;
            pauseButton.disabled = timer === null;
            if (complete) stop();
            draw();
        }

        function advance() { if (step < values().sequence.length) step += 1; render(); }
        function reset() { stop(); step = 0; render(); }
        nextButton.addEventListener("click", advance);
        autoButton.addEventListener("click", function () { if (timer !== null || nextButton.disabled) return; timer = window.setInterval(advance, 720); render(); });
        pauseButton.addEventListener("click", function () { stop(); render(); });
        resetButton.addEventListener("click", reset);
        [sequenceInput, cellInput].forEach(function (input) { input.addEventListener("change", reset); });
        strengthInput.addEventListener("input", reset);
        window.addEventListener("resize", draw);
        render();
        window.requestAnimationFrame(draw);
    }

    function initTracer() {
        const codeContainer = get("tracerCode");
        const toggle = get("tracerPanelToggle");
        const panel = get("tracerPanel");
        if (!codeContainer || !toggle || !panel || codeContainer.dataset.cbActive) return;
        codeContainer.dataset.cbActive = "true";
        const lines = [
            "series = [10, 12, 14, 18, 16, 20, 22]",
            "window = 3",
            "predictions = []",
            "absolute_error = 0",
            "for t in range(window, len(series)):",
            "    window_sum = 0",
            "    for j in range(t - window, t):",
            "        window_sum += series[j]",
            "    prediction = window_sum / window",
            "    predictions.append(prediction)",
            "    absolute_error += abs(series[t] - prediction)",
            "mae = absolute_error / len(predictions)",
            "print(predictions, round(mae, 2))"
        ];

        function clone(value) { return JSON.parse(JSON.stringify(value)); }

        function buildStates() {
            const states = [];
            const series = [10, 12, 14, 18, 16, 20, 22];
            const windowSize = 3;
            const predictions = [];
            let absoluteError = 0;
            function add(line, explanation, variables, expression, printed) { states.push({ line: line, explanation: explanation, variables: clone(variables || {}), expression: expression || "—", output: printed || "" }); }
            add(0, "Create the chronologically ordered numerical series.", { series: series }, "len(series) = 7");
            add(1, "Set the historical context window to three observations.", { window: windowSize }, "window = 3");
            add(2, "Create an empty list for walk-forward predictions.", { predictions: predictions }, "predictions = []");
            add(3, "Initialize the total absolute forecast error.", { absolute_error: absoluteError }, "absolute_error = 0");
            for (let t = windowSize; t < series.length; t += 1) {
                add(4, "Enter forecast origin t = " + t + ". Only positions before t may be used.", { t: t, actual: series[t], predictions: predictions }, "range(3, 7) → t = " + t);
                let windowSum = 0;
                add(5, "Reset the current rolling-window sum.", { t: t, window_sum: windowSum }, "window_sum = 0");
                for (let j = t - windowSize; j < t; j += 1) {
                    add(6, "Enter the inner loop at historical index j = " + j + ".", { t: t, j: j, window_sum: windowSum }, "j belongs to [" + (t - windowSize) + ", " + (t - 1) + "]");
                    windowSum += series[j];
                    add(7, "Add series[" + j + "] to the window sum.", { t: t, j: j, value: series[j], window_sum: windowSum }, "window_sum += " + series[j] + " → " + windowSum);
                }
                const prediction = windowSum / windowSize;
                add(8, "Divide by the window length to create the forecast.", { t: t, window_sum: windowSum, prediction: prediction }, windowSum + " / " + windowSize + " = " + fixed(prediction, 2));
                predictions.push(prediction);
                add(9, "Append the prediction before looking at later forecast origins.", { t: t, prediction: prediction, predictions: predictions }, "predictions.append(" + fixed(prediction, 2) + ")");
                const error = Math.abs(series[t] - prediction);
                absoluteError += error;
                add(10, "Compare this prediction with its current actual and accumulate absolute error.", { t: t, actual: series[t], prediction: prediction, error: error, absolute_error: absoluteError }, "|" + series[t] + " − " + fixed(prediction, 2) + "| = " + fixed(error, 2));
            }
            const mae = absoluteError / predictions.length;
            add(11, "Average all absolute errors.", { absolute_error: absoluteError, count: predictions.length, mae: mae }, fixed(absoluteError, 2) + " / " + predictions.length + " = " + fixed(mae, 2));
            add(12, "Print every forecast and the final MAE.", { predictions: predictions, mae: mae }, "print(predictions, round(mae, 2))", JSON.stringify(predictions) + " " + fixed(mae, 2));
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
        codeContainer.innerHTML = lines.map(function (line, index) { return '<div class="aiml-code-line" data-line="' + index + '"><span>' + String(index + 1).padStart(2, "0") + '</span><code>' + escapeHtml(line) + '</code></div>'; }).join("");
        function stop() { if (timer !== null) window.clearInterval(timer); timer = null; pause.disabled = true; }
        function formatValue(value) { return typeof value === "number" ? (Number.isInteger(value) ? String(value) : fixed(value, 3)) : JSON.stringify(value); }
        function render() {
            const atStart = step === 0;
            const atEnd = step >= states.length;
            const current = atStart ? null : states[step - 1];
            codeContainer.querySelectorAll(".aiml-code-line").forEach(function (line, index) { line.classList.toggle("is-active", !!current && index === current.line); line.classList.toggle("is-complete", !!current && index < current.line); });
            if (current) { const activeLine = codeContainer.querySelector('[data-line="' + current.line + '"]'); if (activeLine) activeLine.scrollIntoView({ block: "nearest" }); }
            get("tracerStatus").textContent = atStart ? "Ready" : atEnd ? "Complete" : "Running";
            get("tracerExplanation").textContent = current ? current.explanation : "Press Next to evaluate the first statement.";
            get("tracerExpression").textContent = current ? current.expression : "—";
            get("tracerOutput").textContent = current && current.output ? current.output : "Waiting for print(...)";
            const variables = current ? current.variables : {};
            get("tracerVariables").innerHTML = Object.keys(variables).length ? Object.keys(variables).map(function (key) { return '<article class="aiml-variable"><span>' + escapeHtml(key) + '</span><code>' + escapeHtml(formatValue(variables[key])) + '</code></article>'; }).join("") : '<article class="aiml-variable"><span>STATE</span><code>Not started</code></article>';
            previous.disabled = atStart;
            next.disabled = atEnd;
            auto.disabled = atEnd || timer !== null;
            pause.disabled = timer === null;
            get("tracerProgress").textContent = "Step " + step + " of " + states.length;
            if (atEnd) stop();
        }
        function advance() { if (step < states.length) step += 1; render(); }
        toggle.addEventListener("click", function () { const opening = panel.hidden; panel.hidden = !opening; toggle.textContent = opening ? "✕ Close Interactive Tracer" : "Open Interactive Tracer"; toggle.setAttribute("aria-expanded", String(opening)); if (opening) window.setTimeout(function () { panel.scrollIntoView({ behavior: "smooth", block: "nearest" }); }, 50); else stop(); });
        previous.addEventListener("click", function () { stop(); step = Math.max(0, step - 1); render(); });
        next.addEventListener("click", advance);
        auto.addEventListener("click", function () { if (step >= states.length || timer !== null) return; timer = window.setInterval(advance, 260); render(); });
        pause.addEventListener("click", function () { stop(); render(); });
        reset.addEventListener("click", function () { stop(); step = 0; render(); });
        render();
    }

    function initProblems() {
        const list = get("problemList");
        if (!list || list.dataset.cbActive) return;
        list.dataset.cbActive = "true";
        const problems = [
            { title: "Create Sliding Windows", description: "Convert a series into context-window and next-step target pairs.", sampleInput: "series=[4,7,9,12,13], window=3", expected: "[4,7,9]→12; [7,9,12]→13", hint: "Loop from window to len(series), slice the previous window values and use series[index] as target.", starter: "series = [4, 7, 9, 12, 13]\nwindow = 3\n# Build X windows and y targets\n", solution: "series = [4, 7, 9, 12, 13]\nwindow = 3\nX, y = [], []\nfor index in range(window, len(series)):\n    X.append(series[index-window:index])\n    y.append(series[index])\nprint(X)\nprint(y)", required: [["for"], ["range("], ["index-window:index", "index - window:index"], ["append("], ["print("]] },
            { title: "Seasonal Naive Forecast", description: "Forecast a future season by copying values from one seasonal period earlier.", sampleInput: "series=[20,30,22,35,21,31,23,36], period=4", expected: "[21,31,23,36]", hint: "The next four seasonal positions repeat the final complete period.", starter: "series = [20, 30, 22, 35, 21, 31, 23, 36]\nperiod = 4\n# Produce one seasonal-naive horizon\n", solution: "series = [20, 30, 22, 35, 21, 31, 23, 36]\nperiod = 4\nforecast = series[-period:]\nprint(forecast)", required: [["period"], ["-period", "- period"], ["forecast"], ["print("]] },
            { title: "Calculate Forecast Metrics", description: "Calculate MAE and RMSE for actual and predicted values.", sampleInput: "actual=[10,20], predicted=[12,16]", expected: "MAE=3.0, RMSE≈3.162", hint: "Accumulate absolute and squared errors, then divide by count; take the square root for RMSE.", starter: "actual = [10, 20]\npredicted = [12, 16]\n# Calculate MAE and RMSE without libraries\n", solution: "actual = [10, 20]\npredicted = [12, 16]\nabsolute = 0\nsquared = 0\nfor y, y_hat in zip(actual, predicted):\n    error = y - y_hat\n    absolute += abs(error)\n    squared += error ** 2\nmae = absolute / len(actual)\nrmse = (squared / len(actual)) ** 0.5\nprint(round(mae, 3), round(rmse, 3))", required: [["zip("], ["abs("], ["** 2", "**2"], ["mae"], ["rmse"], ["print("]] },
            { title: "Difference and Reconstruct a Series", description: "Remove a first-order trend and reconstruct the next level from a differenced forecast.", sampleInput: "series=[10,13,16,19], next_difference=3", expected: "differences=[3,3,3], next=22", hint: "Subtract each previous value, then add the predicted difference to the last level.", starter: "series = [10, 13, 16, 19]\nnext_difference = 3\n# Difference the series and reconstruct next value\n", solution: "series = [10, 13, 16, 19]\nnext_difference = 3\ndifferences = []\nfor index in range(1, len(series)):\n    differences.append(series[index] - series[index-1])\nnext_value = series[-1] + next_difference\nprint(differences)\nprint(next_value)", required: [["range(1", "range (1"], ["series[index]"], ["series[index-1]", "series[index - 1]"], ["next_difference"], ["print("]] },
            { title: "Trace a Simple Recurrent State", description: "Process a sequence with one shared tanh recurrence.", sampleInput: "sequence=[0.2,0.4,0.6], recurrent=0.5", expected: "One hidden state per step", hint: "Update hidden inside the loop using the current input and previous hidden value.", starter: "import math\nsequence = [0.2, 0.4, 0.6]\nhidden = 0.0\n# Apply h = tanh(0.8*x + 0.5*h)\n", solution: "import math\nsequence = [0.2, 0.4, 0.6]\nhidden = 0.0\nstates = []\nfor value in sequence:\n    hidden = math.tanh(0.8 * value + 0.5 * hidden)\n    states.append(round(hidden, 3))\nprint(states)", required: [["for"], ["math.tanh("], ["hidden"], ["0.8"], ["0.5"], ["append("], ["print("]] }
        ];
        let saved = {};
        try { saved = JSON.parse(window.localStorage.getItem(PROGRESS_KEY) || "{}"); } catch (error) { saved = {}; }
        const solved = new Set(Array.isArray(saved.solvedProblems) ? saved.solvedProblems : []);
        const scores = saved.problemScores && typeof saved.problemScores === "object" ? saved.problemScores : {};
        const revealed = new Set();
        function save() { let current = {}; try { current = JSON.parse(window.localStorage.getItem(PROGRESS_KEY) || "{}"); } catch (error) { current = {}; } current.solvedProblems = Array.from(solved); current.problemScores = scores; window.localStorage.setItem(PROGRESS_KEY, JSON.stringify(current)); }
        function updateSummary() { const total = Object.values(scores).reduce(function (sum, score) { return sum + Number(score || 0); }, 0); get("problemSolvedCount").textContent = solved.size + " / " + problems.length; get("problemScore").textContent = total + " / " + problems.length * 100; get("problemProgressBar").style.width = solved.size / problems.length * 100 + "%"; }
        list.innerHTML = problems.map(function (problem, index) { const number = index + 1; return '<article class="aiml-problem-card' + (solved.has(index) ? " is-solved" : "") + '" data-problem="' + index + '"><div class="aiml-problem-head"><span class="aiml-problem-number">' + String(number).padStart(2, "0") + '</span><div><h3>' + number + ". " + escapeHtml(problem.title) + '</h3><p>' + escapeHtml(problem.description) + '</p></div></div><div class="aiml-problem-data"><span><strong>Sample input:</strong> ' + escapeHtml(problem.sampleInput) + '</span><span><strong>Expected output:</strong> <code>' + escapeHtml(problem.expected) + '</code></span></div><div class="aiml-problem-actions"><button type="button" class="primary" data-action="workspace">💻 Solve It Yourself</button><button type="button" class="hint" data-action="hint">Hint</button><button type="button" data-action="solution">Show Program</button></div><div class="aiml-problem-reveal" data-panel="hint" hidden><strong>Hint</strong><p>' + escapeHtml(problem.hint) + '</p></div><div class="aiml-problem-reveal" data-panel="solution" hidden><strong>Model program</strong><pre><code>' + escapeHtml(problem.solution) + '</code></pre></div><div class="aiml-workspace" data-panel="workspace" hidden><label for="problemCode' + index + '">Your Python code</label><textarea id="problemCode' + index + '" spellcheck="false">' + escapeHtml(problem.starter) + '</textarea><div class="aiml-workspace-row"><button type="button" data-action="check">Check Answer</button><button type="button" data-action="reset">Reset</button><span class="aiml-check-result" data-result>Write your solution, then check its structure.</span></div></div></article>'; }).join("");
        function togglePanel(card, name, button, closedText, openText) { const section = card.querySelector('[data-panel="' + name + '"]'); if (!section) return; const opening = section.hidden; section.hidden = !opening; button.textContent = opening ? openText : closedText; }
        list.addEventListener("click", function (event) {
            const button = event.target.closest("button[data-action]"); if (!button) return;
            const card = button.closest(".aiml-problem-card"); const index = Number(card.dataset.problem); const problem = problems[index]; const action = button.dataset.action;
            if (action === "workspace") { togglePanel(card, "workspace", button, "💻 Solve It Yourself", "✕ Close Workspace"); return; }
            if (action === "hint") { togglePanel(card, "hint", button, "Hint", "Hide Hint"); return; }
            if (action === "solution") { revealed.add(index); togglePanel(card, "solution", button, "Show Program", "Hide Program"); return; }
            const textarea = card.querySelector("textarea"); const result = card.querySelector("[data-result]");
            if (action === "reset") { textarea.value = problem.starter; result.className = "aiml-check-result"; result.textContent = "Workspace reset. Try the problem again."; return; }
            if (action === "check") {
                const normalized = textarea.value.toLowerCase().replace(/\s+/g, " ");
                const missing = problem.required.filter(function (alternatives) { return !alternatives.some(function (token) { return normalized.includes(token.toLowerCase()); }); });
                if (!textarea.value.trim() || textarea.value.trim() === problem.starter.trim()) { result.className = "aiml-check-result error"; result.textContent = "Add your solution before checking."; return; }
                if (missing.length) { result.className = "aiml-check-result error"; result.textContent = "Not complete yet. Recheck the required time-series logic."; return; }
                const score = revealed.has(index) ? 60 : 100;
                solved.add(index); scores[index] = Math.max(Number(scores[index] || 0), score); card.classList.add("is-solved");
                result.className = "aiml-check-result success"; result.textContent = revealed.has(index) ? "Logic recognized after viewing the model program. Score: 60/100." : "Logic recognized — solved independently. Score: 100/100.";
                save(); updateSummary();
            }
        });
        updateSummary();
    }

    function initQuiz() {
        const container = get("quizQuestions");
        if (!container || container.dataset.cbActive) return;
        container.dataset.cbActive = "true";
        const questions = [
            ["Why is random train–test splitting usually unsafe for forecasting?", ["It can let future observations influence model development", "It always reduces the dataset size", "Time series cannot contain numbers", "Random splitting disables gradients"], 0, "Forecast evaluation must reproduce prediction into the future; random splitting can place later observations in training and earlier observations in testing."],
            ["Which component repeats at a fixed known period?", ["Seasonality", "Irregular noise", "One-time shock", "Structural break"], 0, "Seasonality repeats at a stable period such as daily, weekly or annual frequency."],
            ["What does first differencing calculate?", ["yₜ − yₜ₋₁", "yₜ + yₜ₋₁", "yₜ / every future value", "Only the global mean"], 0, "First differencing measures change from the previous observation and can remove a changing level."],
            ["What does the MA term in ARIMA model?", ["Earlier forecast errors", "A simple rolling average only", "Missing timestamps", "Future target values"], 0, "The moving-average component in ARIMA is a linear combination of current and lagged innovations or forecast errors."],
            ["What is a strong baseline for stable weekly seasonality?", ["Seasonal naive with period seven for daily observations", "Random predictions", "A shuffled validation target", "Always a very deep LSTM"], 0, "Seasonal naive copies the observation from the matching position in the previous period."],
            ["Why can MAPE fail near zero actual values?", ["Division by a very small value creates unstable percentages", "It squares every error", "It ignores predictions", "It requires image tensors"], 0, "MAPE divides by actual values, so zeros are undefined and small magnitudes create very large ratios."],
            ["What is the main role of an RNN hidden state?", ["Carry a learned summary of earlier sequence context", "Store the entire training dataset exactly", "Randomize timestamps", "Replace the loss function"], 0, "The hidden state is a learned finite representation passed from one sequence step to the next."],
            ["Which LSTM gate controls retention of the previous cell state?", ["Forget gate", "Output label", "Softmax class", "Pooling gate"], 0, "The forget gate multiplies the earlier cell state and determines how much is retained."],
            ["Why is a bidirectional RNN unsafe for causal forecasting?", ["Its backward direction can use future sequence positions", "It has no parameters", "It cannot process vectors", "It always predicts zero"], 0, "Bidirectional recurrence uses context from both directions, which leaks unavailable future values in causal forecasting."],
            ["What should residual autocorrelation suggest?", ["Some temporal structure may remain unmodelled", "The model is automatically perfect", "All timestamps should be shuffled", "MAE is undefined"], 0, "Systematic residual dependence indicates that lags, seasonality or other temporal structure may remain available to the model."]
        ];
        container.innerHTML = questions.map(function (item, questionIndex) { return '<article class="aiml-quiz-question" data-quiz-question="' + questionIndex + '"><strong>' + (questionIndex + 1) + ". " + escapeHtml(item[0]) + '</strong><div class="aiml-quiz-options">' + item[1].map(function (option, optionIndex) { const id = "quiz-nineteen-" + questionIndex + "-" + optionIndex; return '<label class="aiml-quiz-option" for="' + id + '"><input type="radio" id="' + id + '" name="quiz-nineteen-' + questionIndex + '" value="' + optionIndex + '"><span>' + String.fromCharCode(65 + optionIndex) + ". " + escapeHtml(option) + '</span></label>'; }).join("") + '</div><div class="aiml-quiz-explanation" hidden></div></article>'; }).join("");
        container.addEventListener("change", function (event) { if (!event.target.matches('input[type="radio"]')) return; event.target.closest(".aiml-quiz-question").querySelectorAll(".aiml-quiz-option").forEach(function (option) { option.classList.toggle("is-selected", option.contains(event.target)); }); });
        get("checkQuiz").addEventListener("click", function () {
            let correct = 0; let answered = 0;
            questions.forEach(function (item, index) {
                const question = container.querySelector('[data-quiz-question="' + index + '"]'); const selected = question.querySelector('input[type="radio"]:checked'); const options = Array.from(question.querySelectorAll(".aiml-quiz-option")); const explanation = question.querySelector(".aiml-quiz-explanation");
                options.forEach(function (option, optionIndex) { option.classList.remove("is-correct", "is-wrong"); if (optionIndex === item[2]) option.classList.add("is-correct"); });
                if (selected) { answered += 1; if (Number(selected.value) === item[2]) correct += 1; else options[Number(selected.value)].classList.add("is-wrong"); }
                explanation.hidden = false; explanation.innerHTML = '<strong>Your answer: ' + (selected ? escapeHtml(item[1][Number(selected.value)]) : "Not attempted") + '</strong><br><strong>Correct answer: ' + escapeHtml(item[1][item[2]]) + '</strong><br>' + escapeHtml(item[3]);
            });
            get("quizScore").textContent = correct + " / " + questions.length + " correct" + (answered < questions.length ? " • " + (questions.length - answered) + " not attempted" : ""); get("resetQuiz").disabled = false;
            let progress = {}; try { progress = JSON.parse(window.localStorage.getItem(PROGRESS_KEY) || "{}"); } catch (error) { progress = {}; } progress.bestQuizScore = Math.max(Number(progress.bestQuizScore || 0), correct); window.localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
        });
        get("resetQuiz").disabled = true;
        get("resetQuiz").addEventListener("click", function () { container.querySelectorAll('input[type="radio"]').forEach(function (input) { input.checked = false; }); container.querySelectorAll(".aiml-quiz-option").forEach(function (option) { option.classList.remove("is-selected", "is-correct", "is-wrong"); }); container.querySelectorAll(".aiml-quiz-explanation").forEach(function (explanation) { explanation.hidden = true; explanation.textContent = ""; }); get("quizScore").textContent = "Not checked yet"; get("resetQuiz").disabled = true; });
    }

    function initInterviews() {
        const container = get("interviewList");
        if (!container || container.dataset.cbActive) return;
        container.dataset.cbActive = "true";
        const questions = [
            ["What makes time-series validation different from ordinary random cross-validation?", "Temporal validation preserves order and reproduces prediction from past into future. Rolling or expanding origins measure performance across several historical decision times without training on later observations."],
            ["Trend, seasonality and cycles—how do they differ?", "Trend is persistent long-term direction, seasonality repeats at a stable known period, and cycles rise and fall without a fixed duration. The distinctions guide transformations, baselines and model structure."],
            ["Explain stationarity.", "Weak stationarity means stable mean and variance with covariance determined by lag rather than absolute time. It is assessed through plots, domain knowledge, rolling statistics, autocorrelation and formal tests."],
            ["ACF versus PACF?", "ACF measures correlation with each lag including indirect shorter-lag effects. PACF estimates the remaining relationship with a lag after controlling intervening shorter lags."],
            ["Explain ARIMA(p,d,q).", "p is autoregressive order, d is differencing order and q is moving-average error order. Fit on training history, inspect residuals and choose candidates using chronological validation rather than in-sample fit alone."],
            ["Why are forecasting baselines essential?", "They reveal whether complexity adds genuine value. Last-value, seasonal-naive, mean and drift baselines also diagnose level, seasonal and trend structure."],
            ["Direct versus recursive multi-step forecasting?", "Recursive forecasting repeatedly feeds earlier predictions into a one-step model and can accumulate error. Direct forecasting trains separate horizon models. Multi-output models predict the complete horizon jointly."],
            ["How does a simple RNN work?", "It applies one shared transition at every time step, combining current input with previous hidden state. Backpropagation through time differentiates the unrolled computation across positions."],
            ["Why do simple RNNs struggle with long dependencies?", "Repeated recurrent derivatives can shrink or grow exponentially, causing vanishing or exploding gradients. A limited hidden state can also overwrite early information."],
            ["LSTM versus GRU?", "LSTM uses separate cell and hidden states with forget, input and output gates. GRU merges state and typically uses reset and update gates, giving fewer parameters. Selection should be validated for accuracy, data and latency."],
            ["How do you prevent time-series leakage?", "Define the forecast origin, use point-in-time correct joins, split before feature fitting, calculate lags only from prior values, respect publication delays and reproduce the serving clock during backtesting."],
            ["Design a production demand-forecasting system.", "Define entity, frequency, origin and horizon; build point-in-time features; establish seasonal baselines; backtest across origins; compare models; quantify uncertainty; connect errors to inventory cost; deploy with freshness, residual, drift and interval-coverage monitoring."]
        ];
        container.innerHTML = questions.map(function (item, index) { return '<article class="aiml-interview-item"><div class="aiml-interview-question"><span>' + (index + 1) + '.</span><strong>' + escapeHtml(item[0]) + '</strong><button type="button" aria-expanded="false">Show Answer</button></div><div class="aiml-interview-answer" hidden><p>' + escapeHtml(item[1]) + '</p></div></article>'; }).join("");
        container.addEventListener("click", function (event) { const button = event.target.closest(".aiml-interview-question button"); if (!button) return; const answer = button.closest(".aiml-interview-item").querySelector(".aiml-interview-answer"); const opening = answer.hidden; answer.hidden = !opening; button.textContent = opening ? "Hide Answer" : "Show Answer"; button.setAttribute("aria-expanded", String(opening)); });
    }

    function init() {
        initForecastLab();
        initMemoryLab();
        initTracer();
        initProblems();
        initQuiz();
        initInterviews();
    }

    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
    else init();
}());
