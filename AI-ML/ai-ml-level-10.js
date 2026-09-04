(function () {
    "use strict";

    const LEVEL_PROGRESS_KEY = "codebhavya-aiml-level-10-progress-v1";

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
        return { context: context, width: width, height: height };
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

    function initMarginLab() {
        const canvas = byId("marginCanvas");
        if (!canvas) return;

        const datasets = {
            clean: [
                { x: -3.5, y: 1.6, label: -1 }, { x: -3.0, y: -0.1, label: -1 },
                { x: -2.3, y: -1.6, label: -1 }, { x: -1.7, y: 0.3, label: -1 },
                { x: -0.8, y: -2.4, label: -1 }, { x: 0.7, y: 2.5, label: 1 },
                { x: 1.6, y: 0.7, label: 1 }, { x: 2.0, y: 2.0, label: 1 },
                { x: 2.8, y: -0.1, label: 1 }, { x: 3.4, y: 1.1, label: 1 }
            ],
            overlap: [
                { x: -3.4, y: 1.5, label: -1 }, { x: -2.8, y: -0.7, label: -1 },
                { x: -2.0, y: -2.1, label: -1 }, { x: -1.4, y: 0.4, label: -1 },
                { x: 0.8, y: 1.7, label: -1 }, { x: -0.7, y: 1.6, label: 1 },
                { x: 1.3, y: 0.1, label: 1 }, { x: 1.8, y: 2.2, label: 1 },
                { x: 2.7, y: -1.2, label: 1 }, { x: 3.4, y: 1.0, label: 1 },
                { x: -1.1, y: -1.4, label: 1 }, { x: 2.2, y: 0.5, label: -1 }
            ],
            imbalanced: [
                { x: -3.4, y: 1.6, label: -1 }, { x: -2.6, y: -0.6, label: -1 },
                { x: -1.5, y: -1.8, label: -1 }, { x: 0.5, y: 2.4, label: 1 },
                { x: 1.0, y: 0.8, label: 1 }, { x: 1.4, y: -0.8, label: 1 },
                { x: 1.8, y: 1.6, label: 1 }, { x: 2.1, y: -2.1, label: 1 },
                { x: 2.4, y: 0.2, label: 1 }, { x: 2.7, y: 2.5, label: 1 },
                { x: 3.0, y: -0.8, label: 1 }, { x: 3.3, y: 1.2, label: 1 },
                { x: 3.6, y: -2.3, label: 1 }
            ]
        };

        const datasetInput = byId("marginDataset");
        const cInput = byId("marginC");
        const angleInput = byId("marginAngle");
        const offsetInput = byId("marginOffset");
        const normInput = byId("marginNorm");
        let query = { x: 0.4, y: 0.2 };
        let geometry = null;

        function modelFromControls() {
            const angle = Number(angleInput.value) * Math.PI / 180;
            return {
                angle: angle,
                nx: Math.cos(angle),
                ny: Math.sin(angle),
                offset: Number(offsetInput.value),
                norm: Number(normInput.value),
                c: Math.pow(10, Number(cInput.value))
            };
        }

        function evaluate(model) {
            const rows = datasets[datasetInput.value].map(function (point, index) {
                const score = model.norm * (model.nx * point.x + model.ny * point.y - model.offset);
                const margin = point.label * score;
                const loss = Math.max(0, 1 - margin);
                const prediction = score >= 0 ? 1 : -1;
                return {
                    index: index,
                    x: point.x,
                    y: point.y,
                    label: point.label,
                    score: score,
                    margin: margin,
                    loss: loss,
                    prediction: prediction,
                    correct: prediction === point.label,
                    support: margin <= 1.05,
                    violation: margin < 1
                };
            });
            const sumLoss = rows.reduce(function (sum, row) { return sum + row.loss; }, 0);
            const correct = rows.filter(function (row) { return row.correct; }).length;
            return {
                rows: rows,
                sumLoss: sumLoss,
                meanLoss: sumLoss / rows.length,
                correct: correct,
                accuracy: correct / rows.length,
                supports: rows.filter(function (row) { return row.support; }).length,
                violations: rows.filter(function (row) { return row.violation; }).length,
                objective: 0.5 * model.norm * model.norm + model.c * sumLoss
            };
        }

        function draw(model, result) {
            const prepared = prepareCanvas(canvas, 470, 360);
            const context = prepared.context;
            const width = prepared.width;
            const height = prepared.height;
            const pad = width < 560 ? 38 : 48;
            const xMin = -4.2;
            const xMax = 4.2;
            const yMin = -3.4;
            const yMax = 3.4;
            const sx = function (x) { return pad + (x - xMin) / (xMax - xMin) * (width - pad * 2); };
            const sy = function (y) { return height - pad - (y - yMin) / (yMax - yMin) * (height - pad * 2); };
            geometry = { pad: pad, width: width, height: height, xMin: xMin, xMax: xMax, yMin: yMin, yMax: yMax };

            context.fillStyle = "#041526";
            context.fillRect(0, 0, width, height);

            const tile = 12;
            for (let py = pad; py < height - pad; py += tile) {
                for (let px = pad; px < width - pad; px += tile) {
                    const x = xMin + (px - pad) / (width - pad * 2) * (xMax - xMin);
                    const y = yMax - (py - pad) / (height - pad * 2) * (yMax - yMin);
                    const score = model.norm * (model.nx * x + model.ny * y - model.offset);
                    context.fillStyle = score >= 0 ? "rgba(45,212,191,.065)" : "rgba(251,113,133,.06)";
                    context.fillRect(px, py, tile, tile);
                }
            }

            context.strokeStyle = "rgba(125,211,252,.12)";
            context.lineWidth = 1;
            [-4, -3, -2, -1, 0, 1, 2, 3, 4].forEach(function (x) {
                context.beginPath(); context.moveTo(sx(x), pad); context.lineTo(sx(x), height - pad); context.stroke();
            });
            [-3, -2, -1, 0, 1, 2, 3].forEach(function (y) {
                context.beginPath(); context.moveTo(pad, sy(y)); context.lineTo(width - pad, sy(y)); context.stroke();
            });

            function lineForLevel(level, color, dashed, lineWidth) {
                context.save();
                context.beginPath();
                if (Math.abs(model.ny) > 0.08) {
                    const leftY = (level - model.nx * xMin) / model.ny;
                    const rightY = (level - model.nx * xMax) / model.ny;
                    context.moveTo(sx(xMin), sy(leftY));
                    context.lineTo(sx(xMax), sy(rightY));
                } else {
                    const x = level / model.nx;
                    context.moveTo(sx(x), sy(yMin));
                    context.lineTo(sx(x), sy(yMax));
                }
                context.rect(pad, pad, width - pad * 2, height - pad * 2);
                context.clip();
                context.beginPath();
                if (Math.abs(model.ny) > 0.08) {
                    context.moveTo(sx(xMin), sy((level - model.nx * xMin) / model.ny));
                    context.lineTo(sx(xMax), sy((level - model.nx * xMax) / model.ny));
                } else {
                    const x = level / model.nx;
                    context.moveTo(sx(x), sy(yMin));
                    context.lineTo(sx(x), sy(yMax));
                }
                context.strokeStyle = color;
                context.lineWidth = lineWidth;
                context.setLineDash(dashed ? [8, 6] : []);
                context.stroke();
                context.restore();
            }

            lineForLevel(model.offset - 1 / model.norm, "#7dd3fc", true, 2);
            lineForLevel(model.offset + 1 / model.norm, "#7dd3fc", true, 2);
            lineForLevel(model.offset, "#f6cc35", false, 4);

            result.rows.forEach(function (row) {
                const x = sx(row.x);
                const y = sy(row.y);
                if (row.support) {
                    context.beginPath();
                    context.arc(x, y, 14, 0, Math.PI * 2);
                    context.fillStyle = "rgba(246,204,53,.2)";
                    context.fill();
                    context.strokeStyle = "#f6cc35";
                    context.lineWidth = 2;
                    context.stroke();
                }
                context.beginPath();
                context.arc(x, y, 8, 0, Math.PI * 2);
                context.fillStyle = row.label === 1 ? "#2dd4bf" : "#fb7185";
                context.fill();
                context.strokeStyle = row.correct ? "#f8fbff" : "#f6cc35";
                context.lineWidth = row.correct ? 2 : 4;
                context.stroke();
                context.fillStyle = "#dcecff";
                context.font = "700 10px system-ui";
                context.fillText(String(row.index + 1), x + 11, y - 8);
            });

            const queryScore = model.norm * (model.nx * query.x + model.ny * query.y - model.offset);
            context.beginPath();
            context.arc(sx(query.x), sy(query.y), 11, 0, Math.PI * 2);
            context.fillStyle = "#f6cc35";
            context.fill();
            context.strokeStyle = "#ffffff";
            context.lineWidth = 3;
            context.stroke();
            context.fillStyle = "#06172a";
            context.font = "950 13px system-ui";
            context.fillText("?", sx(query.x) - 4, sy(query.y) + 5);

            context.fillStyle = "#c6d9eb";
            context.font = "700 12px system-ui";
            context.fillText("feature x₁", width - 104, height - 13);
            context.fillText("feature x₂", 8, 20);
            return queryScore;
        }

        function render() {
            const model = modelFromControls();
            const result = evaluate(model);
            const queryScore = draw(model, result);
            byId("marginCValue").textContent = model.c < 1 ? fixed(model.c, 2) : fixed(model.c, 1);
            byId("marginAngleValue").textContent = angleInput.value + "°";
            byId("marginOffsetValue").textContent = fixed(model.offset, 1);
            byId("marginNormValue").textContent = fixed(model.norm, 2);
            byId("marginAccuracy").textContent = fixed(result.accuracy * 100, 1) + "%";
            byId("marginWidth").textContent = fixed(2 / model.norm, 2);
            byId("marginSupport").textContent = result.supports + " / " + result.violations;
            byId("marginLoss").textContent = fixed(result.meanLoss, 3);
            byId("marginObjective").textContent = fixed(result.objective, 3);
            byId("marginQuery").textContent = (queryScore >= 0 ? "Positive" : "Negative") + " (" + fixed(queryScore, 2) + ")";
            byId("marginRows").innerHTML = result.rows.map(function (row) {
                return '<article class="aiml-ten-margin-row' + (row.support ? " support" : "") +
                    (row.violation ? " violation" : "") + '"><span>#' + (row.index + 1) + " • " +
                    (row.label === 1 ? "Positive" : "Negative") + " • loss " + fixed(row.loss, 2) +
                    '</span><strong>margin ' + fixed(row.margin, 2) + '</strong></article>';
            }).join("");
            const datasetText = datasetInput.value === "clean"
                ? "The clean set can support a wide separator with no classification errors."
                : datasetInput.value === "overlap"
                    ? "The overlapping set cannot satisfy every desired margin simultaneously, so C changes the compromise."
                    : "Accuracy can hide minority behavior; inspect class-aware metrics and consider class weights in a real pipeline.";
            byId("marginExplanation").textContent = datasetText + " The objective shown is ½||w||² + CΣ hinge loss. Gold rings mark points on or inside the margin.";
        }

        function fit() {
            const c = Math.pow(10, Number(cInput.value));
            let best = null;
            for (let angleDegrees = -80; angleDegrees <= 80; angleDegrees += 4) {
                const angle = angleDegrees * Math.PI / 180;
                const nx = Math.cos(angle);
                const ny = Math.sin(angle);
                for (let offset = -2.4; offset <= 2.4001; offset += 0.2) {
                    for (let norm = 0.4; norm <= 3.0001; norm += 0.2) {
                        const model = { angle: angle, nx: nx, ny: ny, offset: offset, norm: norm, c: c };
                        const result = evaluate(model);
                        if (!best || result.objective < best.objective - 1e-9 ||
                            (Math.abs(result.objective - best.objective) < 1e-9 && result.accuracy > best.accuracy)) {
                            best = {
                                angle: angleDegrees,
                                offset: offset,
                                norm: norm,
                                objective: result.objective,
                                accuracy: result.accuracy
                            };
                        }
                    }
                }
            }
            angleInput.value = String(best.angle);
            offsetInput.value = fixed(best.offset, 1);
            normInput.value = fixed(best.norm, 2);
            render();
        }

        [datasetInput, cInput, angleInput, offsetInput, normInput].forEach(function (input) {
            input.addEventListener("input", render);
            input.addEventListener("change", render);
        });
        byId("fitMargin").addEventListener("click", fit);
        byId("marginReset").addEventListener("click", function () {
            datasetInput.value = "clean";
            cInput.value = "0";
            angleInput.value = "35";
            offsetInput.value = "0";
            normInput.value = "1.2";
            query = { x: 0.4, y: 0.2 };
            render();
        });
        canvas.addEventListener("click", function (event) {
            if (!geometry) return;
            const rect = canvas.getBoundingClientRect();
            const px = (event.clientX - rect.left) / rect.width * geometry.width;
            const py = (event.clientY - rect.top) / rect.height * geometry.height;
            query.x = clamp(geometry.xMin + (px - geometry.pad) / (geometry.width - geometry.pad * 2) * (geometry.xMax - geometry.xMin), geometry.xMin, geometry.xMax);
            query.y = clamp(geometry.yMax - (py - geometry.pad) / (geometry.height - geometry.pad * 2) * (geometry.yMax - geometry.yMin), geometry.yMin, geometry.yMax);
            render();
        });
        window.addEventListener("resize", render);
        render();
    }

    function initKernelLab() {
        const canvas = byId("kernelCanvas");
        if (!canvas) return;

        const datasets = {
            xor: [
                { x: -2.8, y: -2.3, label: 1 }, { x: -2.1, y: -1.2, label: 1 },
                { x: -1.2, y: -2.7, label: 1 }, { x: 1.1, y: 1.7, label: 1 },
                { x: 2.0, y: 2.6, label: 1 }, { x: 2.9, y: 1.1, label: 1 },
                { x: -2.8, y: 2.1, label: -1 }, { x: -1.7, y: 1.2, label: -1 },
                { x: -1.1, y: 2.8, label: -1 }, { x: 1.2, y: -1.8, label: -1 },
                { x: 2.2, y: -2.6, label: -1 }, { x: 2.9, y: -1.0, label: -1 }
            ],
            circles: [
                { x: 0.0, y: 0.2, label: 1 }, { x: 0.8, y: 0.1, label: 1 },
                { x: -0.7, y: 0.4, label: 1 }, { x: 0.1, y: -0.9, label: 1 },
                { x: -0.4, y: -0.5, label: 1 }, { x: 0.6, y: 0.8, label: 1 },
                { x: 3.0, y: 0.2, label: -1 }, { x: 2.0, y: 2.1, label: -1 },
                { x: 0.1, y: 3.0, label: -1 }, { x: -2.2, y: 2.0, label: -1 },
                { x: -3.0, y: -0.4, label: -1 }, { x: -1.8, y: -2.4, label: -1 },
                { x: 0.4, y: -3.1, label: -1 }, { x: 2.3, y: -1.9, label: -1 }
            ],
            linear: [
                { x: -3.0, y: 1.8, label: -1 }, { x: -2.7, y: -0.2, label: -1 },
                { x: -1.9, y: -1.8, label: -1 }, { x: -1.1, y: 0.7, label: -1 },
                { x: -0.4, y: -2.7, label: -1 }, { x: 0.5, y: 2.5, label: 1 },
                { x: 1.1, y: 0.3, label: 1 }, { x: 1.8, y: -1.8, label: 1 },
                { x: 2.4, y: 1.7, label: 1 }, { x: 3.1, y: -0.2, label: 1 }
            ]
        };

        const datasetInput = byId("kernelDataset");
        const typeInput = byId("kernelType");
        const gammaInput = byId("kernelGamma");
        const degreeInput = byId("kernelDegree");
        const epochsInput = byId("kernelEpochs");
        let query = { x: 0.6, y: 0.5 };
        let trained = null;
        let geometry = null;

        function dot(first, second) {
            return first.x * second.x + first.y * second.y;
        }

        function kernel(first, second, type, gamma, degree) {
            if (type === "polynomial") return Math.pow(gamma * dot(first, second) + 1, degree);
            if (type === "rbf") {
                const dx = first.x - second.x;
                const dy = first.y - second.y;
                return Math.exp(-gamma * (dx * dx + dy * dy));
            }
            return dot(first, second);
        }

        function scorePoint(point, model) {
            return model.samples.reduce(function (sum, sample, index) {
                if (!model.alphas[index]) return sum;
                return sum + model.alphas[index] * sample.label * kernel(sample, point, model.type, model.gamma, model.degree);
            }, 0);
        }

        function train() {
            const samples = datasets[datasetInput.value];
            const type = typeInput.value;
            const gamma = Math.pow(10, Number(gammaInput.value));
            const degree = Number(degreeInput.value);
            const epochs = Number(epochsInput.value);
            const alphas = samples.map(function () { return 0; });
            let updates = 0;
            let finalMistakes = 0;

            for (let epoch = 0; epoch < epochs; epoch += 1) {
                let mistakes = 0;
                samples.forEach(function (sample, index) {
                    const model = { samples: samples, alphas: alphas, type: type, gamma: gamma, degree: degree };
                    const score = scorePoint(sample, model);
                    const prediction = score >= 0 ? 1 : -1;
                    if (prediction !== sample.label) {
                        alphas[index] += 1;
                        updates += 1;
                        mistakes += 1;
                    }
                });
                finalMistakes = mistakes;
                if (mistakes === 0) break;
            }
            trained = { samples: samples, alphas: alphas, type: type, gamma: gamma, degree: degree, epochs: epochs, updates: updates, finalMistakes: finalMistakes };
            render();
        }

        function draw(model) {
            const prepared = prepareCanvas(canvas, 470, 360);
            const context = prepared.context;
            const width = prepared.width;
            const height = prepared.height;
            const pad = width < 560 ? 38 : 48;
            const min = -4;
            const max = 4;
            const sx = function (x) { return pad + (x - min) / (max - min) * (width - pad * 2); };
            const sy = function (y) { return height - pad - (y - min) / (max - min) * (height - pad * 2); };
            geometry = { pad: pad, width: width, height: height, min: min, max: max };
            context.fillStyle = "#041526";
            context.fillRect(0, 0, width, height);

            const tile = width < 560 ? 10 : 9;
            for (let py = pad; py < height - pad; py += tile) {
                for (let px = pad; px < width - pad; px += tile) {
                    const point = {
                        x: min + (px - pad) / (width - pad * 2) * (max - min),
                        y: max - (py - pad) / (height - pad * 2) * (max - min)
                    };
                    const score = scorePoint(point, model);
                    const opacity = 0.09 + Math.min(0.16, Math.abs(Math.tanh(score)) * 0.14);
                    context.fillStyle = score >= 0
                        ? "rgba(45,212,191," + opacity + ")"
                        : "rgba(251,113,133," + opacity + ")";
                    context.fillRect(px, py, tile + 1, tile + 1);
                }
            }

            context.strokeStyle = "rgba(125,211,252,.13)";
            context.lineWidth = 1;
            [-3, -2, -1, 0, 1, 2, 3].forEach(function (value) {
                context.beginPath(); context.moveTo(sx(value), pad); context.lineTo(sx(value), height - pad); context.stroke();
                context.beginPath(); context.moveTo(pad, sy(value)); context.lineTo(width - pad, sy(value)); context.stroke();
            });

            model.samples.forEach(function (sample, index) {
                const active = model.alphas[index] > 0;
                if (active) {
                    context.beginPath();
                    context.arc(sx(sample.x), sy(sample.y), 14, 0, Math.PI * 2);
                    context.fillStyle = "rgba(246,204,53,.2)";
                    context.fill();
                    context.strokeStyle = "#f6cc35";
                    context.lineWidth = 2;
                    context.stroke();
                }
                context.beginPath();
                context.arc(sx(sample.x), sy(sample.y), 8, 0, Math.PI * 2);
                context.fillStyle = sample.label === 1 ? "#2dd4bf" : "#fb7185";
                context.fill();
                context.strokeStyle = "#ffffff";
                context.lineWidth = 2;
                context.stroke();
                context.fillStyle = "#dcecff";
                context.font = "700 10px system-ui";
                context.fillText(String(index + 1), sx(sample.x) + 11, sy(sample.y) - 8);
            });

            const queryScore = scorePoint(query, model);
            context.beginPath();
            context.arc(sx(query.x), sy(query.y), 11, 0, Math.PI * 2);
            context.fillStyle = "#f6cc35";
            context.fill();
            context.strokeStyle = "#ffffff";
            context.lineWidth = 3;
            context.stroke();
            context.fillStyle = "#06172a";
            context.font = "950 13px system-ui";
            context.fillText("?", sx(query.x) - 4, sy(query.y) + 5);
            context.fillStyle = "#c6d9eb";
            context.font = "700 12px system-ui";
            context.fillText("feature x₁", width - 104, height - 13);
            context.fillText("feature x₂", 8, 20);
            return queryScore;
        }

        function render() {
            if (!trained) return;
            const queryScore = draw(trained);
            const correct = trained.samples.filter(function (sample) {
                return (scorePoint(sample, trained) >= 0 ? 1 : -1) === sample.label;
            }).length;
            const active = trained.alphas.filter(function (alpha) { return alpha > 0; }).length;
            byId("kernelGammaValue").textContent = fixed(trained.gamma, 2);
            byId("kernelDegreeValue").textContent = String(trained.degree);
            byId("kernelEpochsValue").textContent = String(Number(epochsInput.value));
            byId("kernelAccuracy").textContent = fixed(correct / trained.samples.length * 100, 1) + "%";
            byId("kernelSupport").textContent = active + " / " + trained.samples.length;
            byId("kernelUpdates").textContent = String(trained.updates);
            byId("kernelScore").textContent = fixed(queryScore, 3) + " • " + (queryScore >= 0 ? "Positive" : "Negative");
            const contributions = trained.samples.map(function (sample, index) {
                const similarity = kernel(sample, query, trained.type, trained.gamma, trained.degree);
                return {
                    index: index,
                    similarity: similarity,
                    contribution: trained.alphas[index] * sample.label * similarity,
                    alpha: trained.alphas[index],
                    label: sample.label
                };
            }).filter(function (row) { return row.alpha > 0; }).sort(function (first, second) {
                return Math.abs(second.contribution) - Math.abs(first.contribution);
            }).slice(0, 6);
            byId("kernelSimilarities").innerHTML = contributions.length ? contributions.map(function (row) {
                return '<article class="aiml-ten-similarity-row"><span>#' + (row.index + 1) + " • α=" + row.alpha +
                    " • K=" + fixed(row.similarity, 3) + '</span><strong>' +
                    (row.contribution >= 0 ? "+" : "") + fixed(row.contribution, 3) + '</strong></article>';
            }).join("") : '<article class="aiml-ten-similarity-row"><span>No active vectors</span><strong>—</strong></article>';

            if (trained.type === "linear") {
                byId("kernelFormula").textContent = "K(x,z) = xᵀz";
            } else if (trained.type === "polynomial") {
                byId("kernelFormula").textContent = "K(x,z) = (" + fixed(trained.gamma, 2) + "xᵀz + 1)^" + trained.degree;
            } else {
                byId("kernelFormula").textContent = "K(x,z) = exp(−" + fixed(trained.gamma, 2) + "||x−z||²)";
            }

            let diagnosis = "The model learned the training set with a compact similarity-weighted representation.";
            if (correct < trained.samples.length) {
                diagnosis = "This kernel and setting cannot fully express the current pattern within the selected epochs. Compare the decision regions before increasing complexity.";
            } else if (active > trained.samples.length * 0.75) {
                diagnosis = "Training accuracy is high, but many active vectors are retained. The boundary may be sensitive and prediction will require more similarity calculations.";
            }
            if (datasetInput.value === "xor" && trained.type === "linear") {
                diagnosis = "A single linear score cannot separate XOR quadrants. Switch to polynomial degree 2 or RBF and compare the learned regions.";
            }
            if (datasetInput.value === "circles" && trained.type === "linear") {
                diagnosis = "Concentric classes are not linearly separable in the original two-dimensional space. RBF similarity is a natural comparison.";
            }
            byId("kernelExplanation").textContent = diagnosis + " Gold rings identify training points with nonzero kernel-perceptron coefficients.";
        }

        function syncControlsAndTrain() {
            const type = typeInput.value;
            degreeInput.disabled = type !== "polynomial";
            gammaInput.disabled = type === "linear";
            byId("kernelGammaValue").textContent = fixed(Math.pow(10, Number(gammaInput.value)), 2);
            byId("kernelDegreeValue").textContent = degreeInput.value;
            byId("kernelEpochsValue").textContent = epochsInput.value;
            train();
        }

        [datasetInput, typeInput, gammaInput, degreeInput, epochsInput].forEach(function (input) {
            input.addEventListener("input", syncControlsAndTrain);
            input.addEventListener("change", syncControlsAndTrain);
        });
        byId("trainKernel").addEventListener("click", train);
        byId("kernelReset").addEventListener("click", function () {
            datasetInput.value = "xor";
            typeInput.value = "linear";
            gammaInput.value = "0";
            degreeInput.value = "2";
            epochsInput.value = "12";
            query = { x: 0.6, y: 0.5 };
            syncControlsAndTrain();
        });
        canvas.addEventListener("click", function (event) {
            if (!geometry || !trained) return;
            const rect = canvas.getBoundingClientRect();
            const px = (event.clientX - rect.left) / rect.width * geometry.width;
            const py = (event.clientY - rect.top) / rect.height * geometry.height;
            query.x = clamp(geometry.min + (px - geometry.pad) / (geometry.width - geometry.pad * 2) * (geometry.max - geometry.min), geometry.min, geometry.max);
            query.y = clamp(geometry.max - (py - geometry.pad) / (geometry.height - geometry.pad * 2) * (geometry.max - geometry.min), geometry.min, geometry.max);
            render();
        });
        window.addEventListener("resize", render);
        syncControlsAndTrain();
    }

    function buildTraceStates() {
        const states = [];
        let w = 0.5;
        let b = 0;
        const learningRate = 0.2;
        let totalLoss = 0;
        const samples = [{ x: 2, y: 1 }, { x: 0.5, y: 1 }, { x: -1, y: -1 }];

        function add(line, status, explanation, expression, output, variables) {
            states.push({ line: line, status: status, explanation: explanation, expression: expression, output: output, variables: variables });
        }

        add(1, "Initialize samples", "Create three one-dimensional labeled training examples.", "samples = [(2, 1), (0.5, 1), (-1, -1)]", "", { samples: "[(2,+1), (0.5,+1), (-1,-1)]" });
        add(2, "Initialize weight", "Start with a scalar weight of 0.5.", "w = 0.5", "", { w: "0.500" });
        add(3, "Initialize bias", "Start the decision boundary with zero bias.", "b = 0.0", "", { w: "0.500", b: "0.000" });
        add(4, "Set learning rate", "The learning rate controls the size of each corrective update.", "learning_rate = 0.2", "", { w: "0.500", b: "0.000", learning_rate: "0.200" });
        add(5, "Initialize loss", "Accumulate hinge loss across the pass.", "total_loss = 0.0", "", { w: "0.500", b: "0.000", total_loss: "0.000" });

        samples.forEach(function (sample, index) {
            const valuesBefore = { index: index, x: sample.x, y: sample.y, w: fixed(w, 3), b: fixed(b, 3), total_loss: fixed(totalLoss, 3) };
            add(6, "Loop sample " + (index + 1), "The loop cursor now points to x=" + sample.x + " with label y=" + sample.y + ".", "x, y = samples[" + index + "]", "", valuesBefore);
            const score = w * sample.x + b;
            add(7, "Compute score", "Calculate the signed decision-function value before using the label.", "score = " + fixed(w, 3) + " × " + sample.x + " + " + fixed(b, 3), fixed(score, 3), { index: index, x: sample.x, y: sample.y, w: fixed(w, 3), b: fixed(b, 3), score: fixed(score, 3) });
            const margin = sample.y * score;
            add(8, "Compute signed margin", "Multiply the decision score by the true ±1 label. Positive means correct side.", "margin = " + sample.y + " × " + fixed(score, 3), fixed(margin, 3), { index: index, y: sample.y, score: fixed(score, 3), margin: fixed(margin, 3) });
            const loss = Math.max(0, 1 - margin);
            add(9, "Compute hinge loss", margin >= 1 ? "The sample reaches the protected margin, so its hinge loss is zero." : "The sample is inside or across the margin, so it receives a positive penalty.", "max(0, 1 − " + fixed(margin, 3) + ")", fixed(loss, 3), { index: index, margin: fixed(margin, 3), loss: fixed(loss, 3) });
            totalLoss += loss;
            add(10, "Accumulate loss", "Add this sample's hinge loss to the running total.", "total_loss += " + fixed(loss, 3), fixed(totalLoss, 3), { index: index, loss: fixed(loss, 3), total_loss: fixed(totalLoss, 3) });
            add(11, "Test violation", margin < 1 ? "The margin is below one, so corrective weight and bias updates will run." : "The margin is at least one. No hinge-loss correction is needed for this sample.", fixed(margin, 3) + " < 1", String(margin < 1), { index: index, margin: fixed(margin, 3), violates: String(margin < 1) });
            if (margin < 1) {
                const oldW = w;
                w = w + learningRate * sample.y * sample.x;
                add(12, "Update weight", "Move the weight in the direction that raises this sample's signed margin.", fixed(oldW, 3) + " + " + learningRate + " × " + sample.y + " × " + sample.x, fixed(w, 3), { index: index, old_w: fixed(oldW, 3), new_w: fixed(w, 3) });
                const oldB = b;
                b = b + learningRate * sample.y;
                add(13, "Update bias", "Shift the boundary using the sample label.", fixed(oldB, 3) + " + " + learningRate + " × " + sample.y, fixed(b, 3), { index: index, old_b: fixed(oldB, 3), new_b: fixed(b, 3) });
            }
        });
        add(14, "Complete", "Display the weight, bias and accumulated hinge loss after one pass.", "print(round(w,2), round(b,2), round(total_loss,2))", fixed(w, 2) + " " + fixed(b, 2) + " " + fixed(totalLoss, 2), { w: fixed(w, 3), b: fixed(b, 3), total_loss: fixed(totalLoss, 3) });
        return states;
    }

    function initProgramTracer() {
        const codeContainer = byId("tracerCode");
        if (!codeContainer) return;

        const codeLines = [
            "samples = [(2, 1), (0.5, 1), (-1, -1)]",
            "w = 0.5",
            "b = 0.0",
            "learning_rate = 0.2",
            "total_loss = 0.0",
            "for x, y in samples:",
            "    score = w * x + b",
            "    margin = y * score",
            "    loss = max(0, 1 - margin)",
            "    total_loss += loss",
            "    if margin < 1:",
            "        w = w + learning_rate * y * x",
            "        b = b + learning_rate * y",
            "print(round(w, 2), round(b, 2), round(total_loss, 2))"
        ];
        const states = buildTraceStates();
        const panel = byId("tracerPanel");
        const toggle = byId("tracerPanelToggle");
        const previous = byId("tracerPrevious");
        const next = byId("tracerNext");
        const auto = byId("tracerAuto");
        const pause = byId("tracerPause");
        const reset = byId("tracerReset");
        let step = 0;
        let timer = null;

        codeContainer.innerHTML = codeLines.map(function (line, index) {
            return '<div class="aiml-code-line" data-code-line="' + (index + 1) + '"><span>' +
                String(index + 1).padStart(2, "0") + '</span><code>' + escapeHtml(line) + '</code></div>';
        }).join("");

        function stop() {
            if (timer !== null) window.clearInterval(timer);
            timer = null;
            pause.disabled = true;
        }

        function renderVariables(values) {
            const entries = Object.entries(values || {});
            byId("tracerVariables").innerHTML = entries.length ? entries.map(function (entry) {
                return '<article class="aiml-variable"><span>' + escapeHtml(entry[0]) +
                    '</span><strong>' + escapeHtml(entry[1]) + '</strong></article>';
            }).join("") : '<article class="aiml-variable"><span>STATE</span><strong>Not started</strong></article>';
        }

        function render() {
            const atStart = step === 0;
            const atEnd = step === states.length;
            const state = atStart ? null : states[step - 1];
            codeContainer.querySelectorAll(".aiml-code-line").forEach(function (line) {
                line.classList.toggle("is-active", Boolean(state) && Number(line.dataset.codeLine) === state.line);
            });
            if (state) {
                byId("tracerStatus").textContent = state.status;
                byId("tracerExplanation").textContent = state.explanation;
                byId("tracerExpression").textContent = state.expression;
                byId("tracerOutput").textContent = state.output || "No printed output yet";
                renderVariables(state.variables);
                const active = codeContainer.querySelector('[data-code-line="' + state.line + '"]');
                if (active) active.scrollIntoView({ behavior: "smooth", block: "nearest" });
            } else {
                byId("tracerStatus").textContent = "Ready";
                byId("tracerExplanation").textContent = "Press Next to execute the first statement.";
                byId("tracerExpression").textContent = "—";
                byId("tracerOutput").textContent = "Waiting for print(...)";
                renderVariables({});
            }
            previous.disabled = atStart;
            next.disabled = atEnd;
            auto.disabled = atEnd || timer !== null;
            byId("tracerProgress").textContent = "Step " + step + " of " + states.length;
            if (atEnd) {
                stop();
                next.disabled = true;
                auto.disabled = true;
            }
        }

        function advance() {
            if (step < states.length) {
                step += 1;
                render();
            } else {
                stop();
                render();
            }
        }

        toggle.addEventListener("click", function () {
            const opening = panel.hidden;
            panel.hidden = !opening;
            toggle.textContent = opening ? "✕ Close Interactive Tracer" : "Open Interactive Tracer";
            toggle.setAttribute("aria-expanded", String(opening));
            if (opening) window.setTimeout(function () {
                panel.scrollIntoView({ behavior: "smooth", block: "nearest" });
            }, 50);
            else stop();
        });
        previous.addEventListener("click", function () {
            stop();
            step = Math.max(0, step - 1);
            render();
        });
        next.addEventListener("click", advance);
        auto.addEventListener("click", function () {
            if (step >= states.length || timer !== null) return;
            auto.disabled = true;
            pause.disabled = false;
            timer = window.setInterval(advance, 850);
        });
        pause.addEventListener("click", function () { stop(); render(); });
        reset.addEventListener("click", function () { stop(); step = 0; render(); });
        render();
    }

    function initProgrammingProblems() {
        const list = byId("problemList");
        if (!list) return;
        const problems = [
            {
                title: "Signed and Geometric Margin",
                description: "Read w, b, x and y for a one-dimensional classifier. Print signed functional margin and geometric margin rounded to three decimals.",
                sampleInput: "2 -1 1.5 1",
                expected: "2.0 1.0",
                hint: "First compute score=w*x+b, then y*score. Divide the absolute signed margin by abs(w).",
                starter: "w, b, x, y = map(float, input().split())\n# Calculate both margins\n",
                solution: "w, b, x, y = map(float, input().split())\nscore = w * x + b\nsigned_margin = y * score\ngeometric_margin = abs(signed_margin) / abs(w)\nprint(round(signed_margin, 3), round(geometric_margin, 3))",
                required: [["score"], ["signed_margin", "margin ="], ["abs("], ["/ abs(w)", "/abs(w)"], ["print("]]
            },
            {
                title: "Mean Hinge Loss",
                description: "Read ±1 labels and decision scores, calculate every hinge loss and print their mean.",
                sampleInput: "1:1.4 1:0.2 -1:0.5",
                expected: "0.767",
                hint: "For each pair use max(0, 1-y*score), then divide the total by the number of pairs.",
                starter: "pairs = [(1, 1.4), (1, 0.2), (-1, 0.5)]\n# Calculate mean hinge loss\n",
                solution: "pairs = [(1, 1.4), (1, 0.2), (-1, 0.5)]\nlosses = [max(0, 1 - y * score) for y, score in pairs]\nmean_loss = sum(losses) / len(losses)\nprint(round(mean_loss, 3))",
                required: [["max(0"], ["1 -", "1-"], ["for "], ["sum("], ["len("], ["print("]]
            },
            {
                title: "Leakage-Safe Linear SVM",
                description: "Split data, standardize numeric features inside a pipeline and evaluate LinearSVC.",
                sampleInput: "X, y",
                expected: "Validation accuracy",
                hint: "Combine StandardScaler and LinearSVC in Pipeline before fitting the training split.",
                starter: "from sklearn.pipeline import Pipeline\n# Build and evaluate a linear SVM pipeline\n",
                solution: "from sklearn.model_selection import train_test_split\nfrom sklearn.pipeline import Pipeline\nfrom sklearn.preprocessing import StandardScaler\nfrom sklearn.svm import LinearSVC\nX_train, X_test, y_train, y_test = train_test_split(X, y, stratify=y, random_state=42)\nmodel = Pipeline([('scale', StandardScaler()), ('svm', LinearSVC(C=1.0, dual='auto', random_state=42))])\nmodel.fit(X_train, y_train)\nprint(round(model.score(X_test, y_test), 3))",
                required: [["train_test_split("], ["pipeline("], ["standardscaler("], ["linearsvc("], [".fit("], [".score("], ["print("]]
            },
            {
                title: "Tune an RBF SVM",
                description: "Use GridSearchCV to tune logarithmic C and gamma values for a scaled RBF SVC pipeline.",
                sampleInput: "X_train, y_train",
                expected: "Best parameters and CV score",
                hint: "Name the pipeline step, then use svm__C and svm__gamma parameter keys.",
                starter: "from sklearn.model_selection import GridSearchCV\n# Create a scaled SVC pipeline and parameter grid\n",
                solution: "from sklearn.model_selection import GridSearchCV, StratifiedKFold\nfrom sklearn.pipeline import Pipeline\nfrom sklearn.preprocessing import StandardScaler\nfrom sklearn.svm import SVC\npipe = Pipeline([('scale', StandardScaler()), ('svm', SVC(kernel='rbf'))])\nparams = {'svm__C': [0.1, 1, 10, 100], 'svm__gamma': [0.01, 0.1, 1, 10]}\ncv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)\nsearch = GridSearchCV(pipe, params, cv=cv, scoring='f1_macro', n_jobs=-1)\nsearch.fit(X_train, y_train)\nprint(search.best_params_)\nprint(round(search.best_score_, 3))",
                required: [["pipeline("], ["standardscaler("], ["svc("], ["kernel='rbf'", "kernel=\"rbf\""], ["svm__c"], ["svm__gamma"], ["gridsearchcv("], [".fit("], ["best_params_"], ["best_score_"]]
            },
            {
                title: "RBF Kernel Matrix from Scratch",
                description: "Implement the RBF kernel and print the pairwise kernel matrix for one-dimensional points.",
                sampleInput: "0 1 2 | gamma=0.5",
                expected: "3 × 3 symmetric matrix",
                hint: "Each entry is exp(-gamma*(x-z)**2). Use math.exp inside nested iteration.",
                starter: "from math import exp\npoints = [0.0, 1.0, 2.0]\ngamma = 0.5\n# Build and print the kernel matrix\n",
                solution: "from math import exp\npoints = [0.0, 1.0, 2.0]\ngamma = 0.5\n\ndef rbf(x, z):\n    return exp(-gamma * (x - z) ** 2)\n\nmatrix = [[round(rbf(x, z), 3) for z in points] for x in points]\nfor row in matrix:\n    print(*row)",
                required: [["def rbf"], ["exp("], ["gamma"], ["** 2", "**2"], ["for "], ["matrix"], ["print("]]
            }
        ];

        let saved = {};
        try { saved = JSON.parse(window.localStorage.getItem(LEVEL_PROGRESS_KEY) || "{}"); }
        catch (error) { saved = {}; }
        const solved = new Set(Array.isArray(saved.solvedProblems) ? saved.solvedProblems : []);
        const scores = saved.problemScores && typeof saved.problemScores === "object" ? saved.problemScores : {};
        const revealed = new Set();

        function save() {
            let current = {};
            try { current = JSON.parse(window.localStorage.getItem(LEVEL_PROGRESS_KEY) || "{}"); }
            catch (error) { current = {}; }
            current.solvedProblems = Array.from(solved);
            current.problemScores = scores;
            window.localStorage.setItem(LEVEL_PROGRESS_KEY, JSON.stringify(current));
        }

        function summary() {
            const total = Object.values(scores).reduce(function (sum, score) {
                return sum + Number(score || 0);
            }, 0);
            byId("problemSolvedCount").textContent = solved.size + " / " + problems.length;
            byId("problemScore").textContent = total + " / " + problems.length * 100;
            byId("problemProgressBar").style.width = solved.size / problems.length * 100 + "%";
        }

        list.innerHTML = problems.map(function (problem, index) {
            const number = index + 1;
            return '<article class="aiml-problem-card' + (solved.has(index) ? " is-solved" : "") +
                '" data-problem="' + index + '"><div class="aiml-problem-head"><span class="aiml-problem-number">' +
                String(number).padStart(2, "0") + '</span><div><h3>' + number + ". " +
                escapeHtml(problem.title) + '</h3><p>' + escapeHtml(problem.description) +
                '</p></div></div><div class="aiml-problem-data"><span><strong>Sample input:</strong> ' +
                escapeHtml(problem.sampleInput) + '</span><span><strong>Expected output:</strong> <code>' +
                escapeHtml(problem.expected) + '</code></span></div><div class="aiml-problem-actions"><button type="button" class="primary" data-action="workspace">💻 Solve It Yourself</button><button type="button" class="hint" data-action="hint">Hint</button><button type="button" data-action="solution">Show Program</button></div><div class="aiml-problem-reveal" data-panel="hint" hidden><strong>Hint</strong><p>' +
                escapeHtml(problem.hint) + '</p></div><div class="aiml-problem-reveal" data-panel="solution" hidden><strong>Model program</strong><pre><code>' + escapeHtml(problem.solution) +
                '</code></pre></div><div class="aiml-workspace" data-panel="workspace" hidden><label for="problemCode' +
                index + '">Your Python code</label><textarea id="problemCode' + index + '" spellcheck="false">' +
                escapeHtml(problem.starter) + '</textarea><div class="aiml-workspace-row"><button type="button" data-action="check">Check Answer</button><button type="button" data-action="reset">Reset</button><span class="aiml-check-result" data-result>Write your solution, then check its structure.</span></div></div></article>';
        }).join("");

        function toggle(card, name, button, openText, closeText) {
            const panel = card.querySelector('[data-panel="' + name + '"]');
            if (!panel) return;
            const opening = panel.hidden;
            panel.hidden = !opening;
            button.textContent = opening ? closeText : openText;
        }

        list.addEventListener("click", function (event) {
            const button = event.target.closest("button[data-action]");
            if (!button) return;
            const card = button.closest(".aiml-problem-card");
            const index = Number(card.dataset.problem);
            const problem = problems[index];
            const action = button.dataset.action;
            if (action === "workspace") {
                toggle(card, "workspace", button, "💻 Solve It Yourself", "✕ Close Workspace");
                return;
            }
            if (action === "hint") {
                toggle(card, "hint", button, "Hint", "Hide Hint");
                return;
            }
            if (action === "solution") {
                revealed.add(index);
                toggle(card, "solution", button, "Show Program", "Hide Program");
                return;
            }
            const textarea = card.querySelector("textarea");
            const result = card.querySelector("[data-result]");
            if (action === "reset") {
                textarea.value = problem.starter;
                result.className = "aiml-check-result";
                result.textContent = "Workspace reset. Try the problem again.";
                return;
            }
            if (action === "check") {
                const normalized = textarea.value.toLowerCase().replace(/\s+/g, " ");
                const missing = problem.required.filter(function (alternatives) {
                    return !alternatives.some(function (token) {
                        return normalized.includes(token.toLowerCase());
                    });
                });
                if (!textarea.value.trim() || textarea.value.trim() === problem.starter.trim()) {
                    result.className = "aiml-check-result error";
                    result.textContent = "Add your solution before checking.";
                    return;
                }
                if (missing.length) {
                    result.className = "aiml-check-result error";
                    result.textContent = "Not complete yet. Recheck the required calculation, model steps and output.";
                    return;
                }
                const score = revealed.has(index) ? 60 : 100;
                solved.add(index);
                scores[index] = Math.max(Number(scores[index] || 0), score);
                card.classList.add("is-solved");
                result.className = "aiml-check-result success";
                result.textContent = revealed.has(index)
                    ? "Logic recognized — completed after viewing the model program. Score: 60/100."
                    : "Logic recognized — solved independently. Score: 100/100.";
                save();
                summary();
            }
        });
        summary();
    }

    function initQuiz() {
        const container = byId("quizQuestions");
        if (!container) return;
        const questions = [
            { question: "Which vector is perpendicular to the SVM decision boundary?", options: ["The input vector x", "The weight vector w", "The bias b", "The label vector y"], answer: 1, explanation: "The hyperplane wᵀx+b=0 has w as its normal vector." },
            { question: "What is the full canonical margin width?", options: ["||w||", "1/||w||", "2/||w||", "C||w||"], answer: 2, explanation: "The supporting planes are wᵀx+b=±1, whose perpendicular distance is 2/||w||." },
            { question: "A correctly classified point has signed margin 0.3. What is its hinge loss?", options: ["0", "0.3", "0.7", "1.3"], answer: 2, explanation: "Hinge loss is max(0,1−0.3)=0.7; correct classification alone is not enough for zero loss." },
            { question: "What usually happens as C becomes very large?", options: ["Violations become cheaper", "The model emphasizes a wider margin over fit", "Violations become expensive and the fit may tighten", "Gamma automatically decreases"], answer: 2, explanation: "Large C increases the relative cost of hinge-loss violations, which can narrow the margin and increase variance." },
            { question: "Why should numeric features normally be scaled before SVM training?", options: ["SVM accepts only integers", "Dot products and distances are sensitive to units", "Scaling guarantees linear separability", "Scaling creates probabilities"], answer: 1, explanation: "Unscaled large-range features can dominate norms, distances and the learned geometry." },
            { question: "What does the kernel trick avoid?", options: ["All pairwise comparisons", "Choosing hyperparameters", "Explicitly constructing the transformed feature coordinates", "Using support vectors"], answer: 2, explanation: "A kernel directly computes inner products in the implicit mapped space." },
            { question: "What does a larger RBF gamma imply?", options: ["Longer-range similarity", "More local influence and potentially intricate boundaries", "A linear boundary", "Stronger probability calibration"], answer: 1, explanation: "Similarity exp(−γdistance²) decays faster when gamma is large." },
            { question: "How many one-vs-one classifiers are required for five classes?", options: ["5", "10", "20", "25"], answer: 1, explanation: "K(K−1)/2 = 5×4/2 = 10 pairwise classifiers." }
        ];

        container.innerHTML = questions.map(function (item, questionIndex) {
            return '<article class="aiml-quiz-question" data-quiz-question="' + questionIndex + '"><strong>' +
                (questionIndex + 1) + ". " + escapeHtml(item.question) + '</strong><div class="aiml-quiz-options">' +
                item.options.map(function (option, optionIndex) {
                    const id = "quiz-ten-" + questionIndex + "-" + optionIndex;
                    return '<label class="aiml-quiz-option" for="' + id + '"><input type="radio" id="' + id +
                        '" name="quiz-ten-' + questionIndex + '" value="' + optionIndex + '"><span>' +
                        String.fromCharCode(65 + optionIndex) + ". " + escapeHtml(option) + '</span></label>';
                }).join("") + '</div><div class="aiml-quiz-explanation" hidden></div></article>';
        }).join("");

        container.addEventListener("change", function (event) {
            if (!event.target.matches('input[type="radio"]')) return;
            event.target.closest(".aiml-quiz-question").querySelectorAll(".aiml-quiz-option").forEach(function (option) {
                option.classList.toggle("is-selected", option.contains(event.target));
            });
        });
        byId("checkQuiz").addEventListener("click", function () {
            let correct = 0;
            let answered = 0;
            questions.forEach(function (item, index) {
                const question = container.querySelector('[data-quiz-question="' + index + '"]');
                const selected = question.querySelector('input[type="radio"]:checked');
                const options = Array.from(question.querySelectorAll(".aiml-quiz-option"));
                const explanation = question.querySelector(".aiml-quiz-explanation");
                options.forEach(function (option, optionIndex) {
                    option.classList.remove("is-correct", "is-wrong");
                    if (optionIndex === item.answer) option.classList.add("is-correct");
                });
                if (selected) {
                    answered += 1;
                    if (Number(selected.value) === item.answer) correct += 1;
                    else options[Number(selected.value)].classList.add("is-wrong");
                }
                explanation.hidden = false;
                explanation.innerHTML = '<strong>Your answer: ' +
                    (selected ? escapeHtml(item.options[Number(selected.value)]) : "Not attempted") +
                    '</strong><br><strong>Correct answer: ' + escapeHtml(item.options[item.answer]) +
                    '</strong><br>' + escapeHtml(item.explanation);
            });
            byId("quizScore").textContent = correct + " / " + questions.length + " correct" +
                (answered < questions.length ? " • " + (questions.length - answered) + " not attempted" : "");
            let progress = {};
            try { progress = JSON.parse(window.localStorage.getItem(LEVEL_PROGRESS_KEY) || "{}"); }
            catch (error) { progress = {}; }
            progress.bestQuizScore = Math.max(Number(progress.bestQuizScore || 0), correct);
            window.localStorage.setItem(LEVEL_PROGRESS_KEY, JSON.stringify(progress));
        });
        byId("resetQuiz").addEventListener("click", function () {
            container.querySelectorAll('input[type="radio"]').forEach(function (input) { input.checked = false; });
            container.querySelectorAll(".aiml-quiz-option").forEach(function (option) {
                option.classList.remove("is-selected", "is-correct", "is-wrong");
            });
            container.querySelectorAll(".aiml-quiz-explanation").forEach(function (explanation) {
                explanation.hidden = true;
                explanation.textContent = "";
            });
            byId("quizScore").textContent = "Not checked yet";
        });
    }

    function initInterviewQuestions() {
        const container = byId("interviewList");
        if (!container) return;
        const questions = [
            { question: "What is the central idea of a Support Vector Machine?", answer: "SVM selects a separating hyperplane with maximum geometric margin. In the soft-margin formulation it balances a small weight norm against hinge-loss violations, producing a regularized boundary rather than merely seeking zero training error." },
            { question: "Why is the weight vector perpendicular to the decision boundary?", answer: "The boundary is the level set wᵀx+b=0. Any movement d that stays along the boundary keeps the score unchanged, so wᵀd=0. Therefore w is orthogonal to every direction lying in the hyperplane." },
            { question: "What are support vectors, and why do they matter?", answer: "Support vectors are training samples with nonzero dual coefficients, normally on or inside the margin. They directly determine the boundary. Kernel prediction evaluates similarities with them, so their number also influences memory and inference cost." },
            { question: "Compare hard-margin and soft-margin SVM.", answer: "Hard margin requires perfect linear separability and enforces yᵢf(xᵢ)≥1 for every row. Soft margin introduces slack or hinge loss, allowing margin violations and misclassification while C controls their cost relative to boundary simplicity." },
            { question: "Explain the effect of C.", answer: "C multiplies the violation penalty. Large C makes training violations expensive and may produce a tighter, higher-variance boundary. Small C applies stronger regularization, accepting more violations for a wider or smoother separator. Select it by validation." },
            { question: "What is hinge loss, and can a correct prediction have positive hinge loss?", answer: "Hinge loss is max(0,1−yᵢf(xᵢ)). Yes. A point with the correct score sign but signed margin between zero and one lies inside the desired margin and therefore has positive loss." },
            { question: "Explain the kernel trick without saying only 'higher dimension'.", answer: "The SVM dual depends on pairwise inner products. A valid kernel computes K(x,z)=φ(x)ᵀφ(z) directly, so the algorithm can use a rich implicit feature map without constructing and storing every transformed coordinate." },
            { question: "How do C and gamma differ for an RBF SVM?", answer: "C controls the cost of margin violations relative to regularization. Gamma controls how quickly RBF similarity decays with distance. Large gamma creates short-range influence and potentially intricate regions; the two parameters interact and should be tuned together." },
            { question: "Why is feature scaling important, and how do you avoid leakage?", answer: "SVM geometry uses norms, dot products and distances, so numeric units strongly affect the model. Put StandardScaler and SVC in one Pipeline so each cross-validation training fold learns its own scaling statistics and applies them to its validation fold." },
            { question: "When would you avoid a kernel SVM?", answer: "Avoid or carefully benchmark it for very large row counts, strict low-latency inference with many support vectors, online learning, or cases demanding simple native probabilities and direct explanations. Linear solvers, tree ensembles or SGD-based models may be better fits." }
        ];

        container.innerHTML = questions.map(function (item, index) {
            return '<article class="aiml-interview-item"><div class="aiml-interview-question"><span>' +
                (index + 1) + '.</span><strong>' + escapeHtml(item.question) +
                '</strong><button type="button" aria-expanded="false">Show Answer</button></div><div class="aiml-interview-answer" hidden>' +
                escapeHtml(item.answer) + '</div></article>';
        }).join("");
        container.addEventListener("click", function (event) {
            const button = event.target.closest("button");
            if (!button) return;
            const answer = button.closest(".aiml-interview-item").querySelector(".aiml-interview-answer");
            const opening = answer.hidden;
            answer.hidden = !opening;
            button.textContent = opening ? "Hide Answer" : "Show Answer";
            button.setAttribute("aria-expanded", String(opening));
        });
    }

    function initSmoothLocalLinks() {
        document.addEventListener("click", function (event) {
            const link = event.target.closest('a[href^="#"]');
            if (!link || link.getAttribute("href") === "#") return;
            const target = document.querySelector(link.getAttribute("href"));
            if (!target) return;
            event.preventDefault();
            target.scrollIntoView({ behavior: "smooth", block: "start" });
        });
    }

    function initLevelTen() {
        initMarginLab();
        initKernelLab();
        initProgramTracer();
        initProgrammingProblems();
        initQuiz();
        initInterviewQuestions();
        initSmoothLocalLinks();
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initLevelTen);
    } else {
        initLevelTen();
    }
}());
