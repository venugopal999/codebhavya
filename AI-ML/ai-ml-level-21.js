(function () {
    "use strict";

    const PROGRESS_KEY = "codebhavya-aiml-level-21-progress-v1";
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

    function sum(values) {
        return values.reduce(function (total, value) { return total + value; }, 0);
    }

    function softmax(values) {
        const finite = values.filter(Number.isFinite);
        const maximum = finite.length ? Math.max.apply(null, finite) : 0;
        const exponentials = values.map(function (value) { return Number.isFinite(value) ? Math.exp(value - maximum) : 0; });
        const denominator = sum(exponentials) || 1;
        return exponentials.map(function (value) { return value / denominator; });
    }

    function multiplyVectorMatrix(vector, matrix) {
        return matrix[0].map(function (_, column) {
            return vector.reduce(function (total, value, row) { return total + value * matrix[row][column]; }, 0);
        });
    }

    function dot(left, right) {
        return left.reduce(function (total, value, index) { return total + value * right[index]; }, 0);
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

    function roundRect(context, x, y, width, height, radius) {
        const r = Math.min(radius, width / 2, height / 2);
        context.beginPath();
        context.moveTo(x + r, y);
        context.arcTo(x + width, y, x + width, y + height, r);
        context.arcTo(x + width, y + height, x, y + height, r);
        context.arcTo(x, y + height, x, y, r);
        context.arcTo(x, y, x + width, y, r);
        context.closePath();
    }

    function wrapLines(context, text, maximumWidth) {
        const words = String(text).split(/\s+/);
        const lines = [];
        let line = "";
        words.forEach(function (word) {
            const trial = line ? line + " " + word : word;
            if (line && context.measureText(trial).width > maximumWidth) {
                lines.push(line);
                line = word;
            } else {
                line = trial;
            }
        });
        if (line) lines.push(line);
        return lines;
    }

    function colorMix(weight) {
        const bounded = clamp(weight, 0, 1);
        const red = Math.round(18 + 230 * bounded);
        const green = Math.round(62 + 142 * bounded);
        const blue = Math.round(92 - 55 * bounded);
        return "rgb(" + red + "," + green + "," + blue + ")";
    }

    const ATTENTION_SENTENCES = {
        context: {
            tokens: ["attention", "finds", "useful", "context"],
            states: [[1.00, 0.20, 0.10], [0.42, 0.92, 0.18], [0.16, 0.52, 0.96], [0.86, 0.24, 0.74]]
        },
        pronoun: {
            tokens: ["the", "model", "finished", "because", "it", "learned"],
            states: [[0.30, 0.16, 0.74], [0.92, 0.18, 0.63], [0.28, 0.82, 0.31], [0.13, 0.47, 0.78], [0.78, 0.12, 0.58], [0.42, 0.96, 0.27]]
        },
        sequence: {
            tokens: ["students", "build", "models", "step", "by", "step"],
            states: [[0.82, 0.26, 0.52], [0.37, 0.91, 0.28], [0.76, 0.43, 0.71], [0.18, 0.65, 0.89], [0.12, 0.39, 0.47], [0.23, 0.72, 0.94]]
        }
    };

    const WQ = [[0.72, 0.18, 0.10], [0.12, 0.84, 0.16], [0.24, 0.08, 0.76]];
    const WK = [[0.66, 0.12, 0.24], [0.20, 0.74, 0.08], [0.10, 0.22, 0.80]];
    const WV = [[0.82, 0.08, 0.14], [0.14, 0.78, 0.18], [0.06, 0.20, 0.86]];

    function calculateAttention(sentenceKey, maskMode, temperature) {
        const sentence = ATTENTION_SENTENCES[sentenceKey] || ATTENTION_SENTENCES.context;
        const queries = sentence.states.map(function (state) { return multiplyVectorMatrix(state, WQ); });
        const keys = sentence.states.map(function (state) { return multiplyVectorMatrix(state, WK); });
        const values = sentence.states.map(function (state) { return multiplyVectorMatrix(state, WV); });
        const rawScores = queries.map(function (query) { return keys.map(function (key) { return dot(query, key); }); });
        const scaledScores = rawScores.map(function (row, queryIndex) {
            return row.map(function (score, keyIndex) {
                if (maskMode === "causal" && keyIndex > queryIndex) return -Infinity;
                return score / Math.sqrt(queries[0].length) / temperature;
            });
        });
        const weights = scaledScores.map(softmax);
        const contexts = weights.map(function (row) {
            return values[0].map(function (_, dimension) {
                return row.reduce(function (total, weight, keyIndex) { return total + weight * values[keyIndex][dimension]; }, 0);
            });
        });
        return { sentence: sentence, queries: queries, keys: keys, values: values, rawScores: rawScores, scaledScores: scaledScores, weights: weights, contexts: contexts };
    }

    function initAttentionLab() {
        const canvas = get("attentionCanvas");
        if (!canvas || canvas.dataset.cbActive) return;
        canvas.dataset.cbActive = "true";
        const sentenceInput = get("attentionSentence");
        const queryInput = get("attentionQuery");
        const maskInput = get("attentionMask");
        const temperatureInput = get("attentionTemperature");
        const nextButton = get("attentionNext");
        const autoButton = get("attentionAuto");
        const pauseButton = get("attentionPause");
        const resetButton = get("attentionReset");
        const phases = ["Token states", "Q, K and V", "Raw scores", "Scale and mask", "Softmax weights", "Context vector"];
        let step = 0;
        let timer = null;

        function populateQueries(preferred) {
            const sentence = ATTENTION_SENTENCES[sentenceInput.value] || ATTENTION_SENTENCES.context;
            const selected = clamp(Number(preferred), 0, sentence.tokens.length - 1);
            queryInput.innerHTML = sentence.tokens.map(function (token, index) {
                return '<option value="' + index + '"' + (index === selected ? " selected" : "") + '>"' + escapeHtml(token) + '" • position ' + index + "</option>";
            }).join("");
        }

        function data() {
            const temperature = Number(temperatureInput.value) / 100;
            const calculation = calculateAttention(sentenceInput.value, maskInput.value, temperature);
            const queryIndex = clamp(Number(queryInput.value), 0, calculation.sentence.tokens.length - 1);
            const row = calculation.weights[queryIndex];
            let bestIndex = 0;
            row.forEach(function (weight, index) { if (weight > row[bestIndex]) bestIndex = index; });
            const legalKeys = row.filter(function (weight) { return weight > 0; }).length;
            return { calculation: calculation, queryIndex: queryIndex, row: row, bestIndex: bestIndex, legalKeys: legalKeys, temperature: temperature };
        }

        function stop() {
            if (timer !== null) window.clearInterval(timer);
            timer = null;
            pauseButton.disabled = true;
        }

        function drawVector(context, label, vector, x, y, width, color) {
            context.fillStyle = "#7dd3fc";
            context.font = "900 10px Arial";
            context.textAlign = "left";
            context.fillText(label, x, y);
            const maximum = Math.max.apply(null, vector.map(Math.abs)) || 1;
            vector.forEach(function (value, index) {
                const barY = y + 13 + index * 20;
                context.fillStyle = "#17324c";
                context.fillRect(x, barY, width, 11);
                context.fillStyle = color;
                context.fillRect(x, barY, width * Math.abs(value) / maximum, 11);
                context.fillStyle = "#dbeafe";
                context.font = "700 9px monospace";
                context.fillText(fixed(value, 2), x + width + 6, barY + 9);
            });
        }

        function draw() {
            const current = data();
            const calculation = current.calculation;
            const tokens = calculation.sentence.tokens;
            const prepared = prepareCanvas(canvas, 500, 620);
            const context = prepared.context;
            const width = prepared.width;
            const height = prepared.height;
            context.clearRect(0, 0, width, height);
            context.fillStyle = "#061426";
            context.fillRect(0, 0, width, height);
            context.fillStyle = "#61d7ff";
            context.font = "900 12px Arial";
            context.textAlign = "left";
            context.fillText("SELF-ATTENTION • " + (maskInput.value === "causal" ? "CAUSAL MASK" : "BIDIRECTIONAL"), 22, 29);

            const gap = 8;
            const cardWidth = Math.min(112, (width - 44 - gap * (tokens.length - 1)) / tokens.length);
            const totalWidth = cardWidth * tokens.length + gap * (tokens.length - 1);
            const startX = Math.max(22, (width - totalWidth) / 2);
            tokens.forEach(function (token, index) {
                const x = startX + index * (cardWidth + gap);
                roundRect(context, x, 48, cardWidth, 42, 10);
                context.fillStyle = index === current.queryIndex ? "#facc15" : "#12314f";
                context.fill();
                context.strokeStyle = index === current.queryIndex ? "#fde68a" : "#315775";
                context.stroke();
                context.fillStyle = index === current.queryIndex ? "#061426" : "#e8f3ff";
                context.font = "800 10px Arial";
                context.textAlign = "center";
                context.fillText(token, x + cardWidth / 2, 73);
            });

            if (step === 0) {
                context.fillStyle = "#facc15";
                context.font = "900 19px Arial";
                context.fillText("TOKEN STATES ARE READY", width / 2, 160);
                context.fillStyle = "#9ab7d1";
                context.font = "600 14px Arial";
                wrapLines(context, "Select a highlighted query token, then calculate how it retrieves evidence from every legal key position.", width - 70).forEach(function (line, index) { context.fillText(line, width / 2, 194 + index * 23); });
                ["X", "Q · K", "MASK", "SOFTMAX", "A · V"].forEach(function (label, index) {
                    const x = 40 + index * ((width - 80) / 4);
                    context.fillStyle = index % 2 ? "#a78bfa" : "#22d3ee";
                    context.font = "900 11px Arial";
                    context.fillText(label, x, height - 55);
                });
                return;
            }

            if (step <= 2) {
                const queryState = step === 1 ? calculation.sentence.states[current.queryIndex] : calculation.queries[current.queryIndex];
                const baseY = 132;
                drawVector(context, step === 1 ? "INPUT X" : "QUERY Q", queryState, 28, baseY, Math.max(65, width * 0.18), step === 1 ? "#38bdf8" : "#facc15");
                if (step >= 2) {
                    drawVector(context, "KEY K • " + tokens[current.bestIndex], calculation.keys[current.bestIndex], width * 0.38, baseY, Math.max(65, width * 0.18), "#a78bfa");
                    drawVector(context, "VALUE V • " + tokens[current.bestIndex], calculation.values[current.bestIndex], width * 0.72, baseY, Math.max(55, width * 0.13), "#22d3ee");
                }
                context.fillStyle = "#8ba8c1";
                context.font = "700 12px Arial";
                context.textAlign = "center";
                context.fillText(step === 1 ? "Each token begins as embedding + position information" : "Learned projections assign separate seeking, matching and evidence roles", width / 2, height - 35);
                return;
            }

            const matrix = step === 3 ? calculation.rawScores : step === 4 ? calculation.scaledScores : calculation.weights;
            const label = step === 3 ? "RAW QKᵀ SCORES" : step === 4 ? "SCALED + MASKED SCORES" : "ROW-WISE SOFTMAX ATTENTION";
            context.fillStyle = "#7dd3fc";
            context.font = "900 11px Arial";
            context.textAlign = "left";
            context.fillText(label, 22, 125);
            const matrixSize = Math.min(width - 90, height - 185);
            const cell = Math.min(58, matrixSize / tokens.length);
            const matrixWidth = cell * tokens.length;
            const matrixX = width < 560 ? Math.max(66, (width - matrixWidth) / 2) : 78;
            const matrixY = 165;
            tokens.forEach(function (token, index) {
                context.fillStyle = "#93c5fd";
                context.font = "800 9px Arial";
                context.textAlign = "center";
                context.fillText(token.slice(0, 8), matrixX + index * cell + cell / 2, matrixY - 10);
                context.save();
                context.translate(matrixX - 10, matrixY + index * cell + cell / 2);
                context.rotate(-Math.PI / 2);
                context.fillText(token.slice(0, 8), 0, 0);
                context.restore();
            });
            matrix.forEach(function (row, rowIndex) {
                row.forEach(function (value, columnIndex) {
                    const forbidden = !Number.isFinite(value);
                    const intensity = step >= 5 ? value : forbidden ? 0 : clamp((value + 0.25) / 1.35, 0, 1);
                    context.fillStyle = forbidden ? "#111827" : colorMix(intensity);
                    context.fillRect(matrixX + columnIndex * cell + 1, matrixY + rowIndex * cell + 1, cell - 2, cell - 2);
                    context.fillStyle = intensity > 0.55 ? "#071426" : "#f8fafc";
                    context.font = "800 9px monospace";
                    context.textAlign = "center";
                    context.fillText(forbidden ? "×" : fixed(value, step >= 5 ? 2 : 2), matrixX + columnIndex * cell + cell / 2, matrixY + rowIndex * cell + cell / 2 + 3);
                    if (rowIndex === current.queryIndex) {
                        context.strokeStyle = "#facc15";
                        context.lineWidth = 2;
                        context.strokeRect(matrixX + columnIndex * cell + 1, matrixY + rowIndex * cell + 1, cell - 2, cell - 2);
                    }
                });
            });

            if (step >= 6) {
                const vector = calculation.contexts[current.queryIndex];
                const vectorX = width < 560 ? 28 : matrixX + matrixWidth + 52;
                const vectorY = width < 560 ? matrixY + matrixWidth + 45 : matrixY + 25;
                drawVector(context, "OUTPUT CONTEXT H", vector, vectorX, vectorY, Math.max(70, Math.min(150, width - vectorX - 62)), "#22d3ee");
            }
        }

        function render() {
            const current = data();
            const calculation = current.calculation;
            const tokens = calculation.sentence.tokens;
            const query = tokens[current.queryIndex];
            const best = tokens[current.bestIndex];
            const complete = step >= phases.length;
            get("attentionTemperatureValue").textContent = fixed(current.temperature, 2) + "×";
            get("attentionPhase").textContent = complete ? "Complete" : step === 0 ? "Ready" : phases[step - 1];
            get("attentionQueryValue").textContent = query;
            get("attentionLegalKeys").textContent = step >= 4 ? current.legalKeys : "—";
            get("attentionBestKey").textContent = step >= 5 ? best : "—";
            get("attentionTopWeight").textContent = step >= 5 ? fixed(current.row[current.bestIndex], 3) : "—";
            if (step === 0) {
                get("attentionVerdict").textContent = "The selected sentence contains " + tokens.length + " token states.";
                get("attentionEquation").textContent = "X = token embedding + position information";
                get("attentionExplanation").textContent = "The highlighted position will become the destination query while every visible position can offer key and value evidence.";
                get("attentionEvidence").innerHTML = "<span>TOKENS</span><strong>" + tokens.map(escapeHtml).join(" • ") + "</strong>";
                get("attentionNextCheck").textContent = "Predict how one token state becomes three learned projections.";
            } else if (step === 1) {
                get("attentionVerdict").textContent = "Input state x for “" + query + "” combines lexical and positional evidence.";
                get("attentionEquation").textContent = "x[" + current.queryIndex + "] = [" + calculation.sentence.states[current.queryIndex].map(function (value) { return fixed(value, 2); }).join(", ") + "]";
                get("attentionExplanation").textContent = "The same initial state is projected differently for seeking information, advertising relevance and carrying content.";
                get("attentionEvidence").innerHTML = "<span>SELECTED STATE</span><strong>position " + current.queryIndex + " • token “" + escapeHtml(query) + "”</strong>";
                get("attentionNextCheck").textContent = "Predict which Q, K or V vector is used to calculate compatibility.";
            } else if (step === 2) {
                get("attentionVerdict").textContent = "Learned matrices created Q, K and V for every token.";
                get("attentionEquation").textContent = "q = xWQ = [" + calculation.queries[current.queryIndex].map(function (value) { return fixed(value, 3); }).join(", ") + "]";
                get("attentionExplanation").textContent = "Queries and keys determine attention weights; values do not participate in the compatibility score.";
                get("attentionEvidence").innerHTML = "<span>QUERY VECTOR</span><strong>" + calculation.queries[current.queryIndex].map(function (value) { return fixed(value, 3); }).join(" • ") + "</strong>";
                get("attentionNextCheck").textContent = "Predict which key produces the largest raw dot product.";
            } else if (step === 3) {
                const raw = calculation.rawScores[current.queryIndex];
                get("attentionVerdict").textContent = "Every query–key pair now has an unnormalized compatibility score.";
                get("attentionEquation").textContent = "q[" + current.queryIndex + "]·k[j] = [" + raw.map(function (value) { return fixed(value, 3); }).join(", ") + "]";
                get("attentionExplanation").textContent = "Large positive dot products indicate aligned learned features, but they are not probabilities and do not sum to one.";
                get("attentionEvidence").innerHTML = "<span>RAW SCORES FOR “" + escapeHtml(query) + "”</span><strong>" + tokens.map(function (token, index) { return escapeHtml(token) + "=" + fixed(raw[index], 3); }).join(" • ") + "</strong>";
                get("attentionNextCheck").textContent = "Apply √d scaling and predict which positions the mask removes.";
            } else if (step === 4) {
                const scaled = calculation.scaledScores[current.queryIndex];
                get("attentionVerdict").textContent = current.legalKeys + " of " + tokens.length + " keys remain legal for this query.";
                get("attentionEquation").textContent = "s[j] = q·k[j] / (√3 × " + fixed(current.temperature, 2) + ") + mask[j]";
                get("attentionExplanation").textContent = maskInput.value === "causal" ? "Future keys receive −∞ before softmax, so their final attention probability is exactly zero." : "Bidirectional attention allows this query to inspect every real token position.";
                get("attentionEvidence").innerHTML = "<span>SCALED SCORES</span><strong>" + scaled.map(function (value, index) { return escapeHtml(tokens[index]) + "=" + (Number.isFinite(value) ? fixed(value, 3) : "masked"); }).join(" • ") + "</strong>";
                get("attentionNextCheck").textContent = "Predict how softmax converts these scores into a row that sums to one.";
            } else if (step === 5) {
                get("attentionVerdict").textContent = "“" + best + "” receives the largest attention weight from “" + query + "”.";
                get("attentionEquation").textContent = "softmax(s)[" + current.bestIndex + "] = " + fixed(current.row[current.bestIndex], 4) + "; Σ weights = " + fixed(sum(current.row), 3);
                get("attentionExplanation").textContent = "Each row is a distribution over legal source positions. Temperature changes concentration without changing learned Q, K or V.";
                get("attentionEvidence").innerHTML = "<span>ATTENTION ROW</span><strong>" + tokens.map(function (token, index) { return escapeHtml(token) + "=" + fixed(current.row[index], 3); }).join(" • ") + "</strong>";
                get("attentionNextCheck").textContent = "Predict the output after these weights mix the value vectors.";
            } else {
                get("attentionVerdict").textContent = "The contextual output for “" + query + "” is a weighted mixture of legal value vectors.";
                get("attentionEquation").textContent = "h[" + current.queryIndex + "] = Σⱼ a[" + current.queryIndex + ",j]v[j] = [" + calculation.contexts[current.queryIndex].map(function (value) { return fixed(value, 3); }).join(", ") + "]";
                get("attentionExplanation").textContent = "This output now contains information routed from other positions and can enter residual, normalization and feed-forward operations.";
                get("attentionEvidence").innerHTML = "<span>STRONGEST ROUTE</span><strong>“" + escapeHtml(query) + "” ← “" + escapeHtml(best) + "” with weight " + fixed(current.row[current.bestIndex], 3) + "</strong>";
                get("attentionNextCheck").textContent = "Change query, mask or temperature and explain how legal evidence and concentration change.";
            }
            nextButton.textContent = complete ? "Attention Complete" : step === 0 ? "Inspect Token States" : "Calculate " + phases[step];
            nextButton.disabled = complete;
            autoButton.disabled = complete || timer !== null;
            pauseButton.disabled = timer === null;
            if (complete) stop();
            draw();
        }

        function advance() { if (step < phases.length) step += 1; render(); }
        function reset() { stop(); step = 0; render(); }
        sentenceInput.addEventListener("change", function () { populateQueries(0); reset(); });
        queryInput.addEventListener("change", reset);
        maskInput.addEventListener("change", reset);
        temperatureInput.addEventListener("input", reset);
        nextButton.addEventListener("click", advance);
        autoButton.addEventListener("click", function () { if (timer !== null || nextButton.disabled) return; timer = window.setInterval(advance, 760); render(); });
        pauseButton.addEventListener("click", function () { stop(); render(); });
        resetButton.addEventListener("click", reset);
        window.addEventListener("resize", draw);
        populateQueries(3);
        render();
        window.requestAnimationFrame(draw);
    }

    const GENERATION_MODELS = {
        learning: {
            prompt: ["Machine", "learning", "helps"],
            rows: [
                [["students", 3.1], ["systems", 2.6], ["people", 2.2], ["models", 1.7], ["quickly", 1.0], [".", 0.4]],
                [["understand", 3.0], ["solve", 2.7], ["build", 2.1], ["discover", 1.8], ["use", 1.3], [".", 0.3]],
                [["complex", 2.9], ["useful", 2.5], ["real", 2.2], ["new", 1.8], ["data", 1.4], [".", 0.5]],
                [["patterns", 3.2], ["problems", 2.8], ["systems", 2.3], ["evidence", 1.8], ["skills", 1.4], [".", 0.7]],
                [[".", 3.4], ["with", 2.1], ["from", 1.7], ["responsibly", 1.3], ["today", 0.9], ["and", 0.5]],
                [["</s>", 3.8], ["It", 1.8], ["Practice", 1.4], ["These", 1.0], ["Next", 0.6], [".", 0.3]]
            ]
        },
        placement: {
            prompt: ["A", "strong", "interview", "answer"],
            rows: [
                [["defines", 3.2], ["explains", 2.9], ["connects", 2.2], ["shows", 1.9], ["avoids", 1.1], [".", 0.4]],
                [["the", 3.0], ["a", 2.3], ["each", 1.9], ["clear", 1.5], ["relevant", 1.2], [".", 0.5]],
                [["concept", 3.3], ["problem", 2.7], ["trade-off", 2.4], ["metric", 1.9], ["system", 1.5], [".", 0.4]],
                [["clearly", 3.0], ["first", 2.6], ["with", 2.1], ["using", 1.8], ["before", 1.2], [".", 0.8]],
                [[".", 3.5], ["and", 2.0], ["then", 1.7], ["responsibly", 1.4], ["today", 0.7], ["because", 0.4]],
                [["</s>", 3.9], ["It", 1.7], ["This", 1.3], ["Next", 0.8], ["Practice", 0.5], [".", 0.2]]
            ]
        },
        responsible: {
            prompt: ["Responsible", "AI", "systems"],
            rows: [
                [["require", 3.3], ["measure", 2.5], ["protect", 2.2], ["support", 1.9], ["avoid", 1.4], [".", 0.4]],
                [["clear", 3.0], ["continuous", 2.7], ["human", 2.4], ["strong", 1.9], ["careful", 1.6], [".", 0.4]],
                [["evaluation", 3.2], ["monitoring", 2.9], ["oversight", 2.6], ["evidence", 2.0], ["testing", 1.7], [".", 0.5]],
                [["and", 3.1], ["before", 2.0], ["with", 1.7], [".", 1.2], ["for", 0.9], ["today", 0.4]],
                [["human", 3.0], ["safe", 2.5], ["measurable", 2.2], ["documented", 1.8], ["fair", 1.4], [".", 0.6]],
                [["oversight", 3.2], ["fallbacks", 2.8], ["review", 2.4], ["decisions", 1.8], ["impact", 1.4], [".", 0.9]]
            ]
        }
    };

    const SAMPLE_VALUES = [0.17, 0.63, 0.38, 0.82, 0.29, 0.54];

    function generationDistribution(row, temperature, strategy, filterValue) {
        const scaled = row.map(function (item) { return { token: item[0], logit: item[1], scaled: item[1] / temperature }; });
        const allProbabilities = softmax(scaled.map(function (item) { return item.scaled; }));
        scaled.forEach(function (item, index) { item.fullProbability = allProbabilities[index]; item.kept = true; });
        const ranked = scaled.slice().sort(function (left, right) { return right.fullProbability - left.fullProbability; });
        if (strategy === "greedy") {
            ranked.forEach(function (item, index) { item.kept = index === 0; });
        } else if (strategy === "topk") {
            ranked.forEach(function (item, index) { item.kept = index < filterValue; });
        } else if (strategy === "topp") {
            const threshold = 0.4 + filterValue / 10;
            let cumulative = 0;
            ranked.forEach(function (item, index) {
                item.kept = index === 0 || cumulative < threshold;
                if (item.kept) cumulative += item.fullProbability;
            });
        }
        const keptTotal = sum(scaled.map(function (item) { return item.kept ? item.fullProbability : 0; })) || 1;
        scaled.forEach(function (item) { item.probability = item.kept ? item.fullProbability / keptTotal : 0; });
        return scaled;
    }

    function selectGenerationToken(distribution, strategy, randomValue) {
        const ranked = distribution.slice().sort(function (left, right) { return right.probability - left.probability; });
        if (strategy === "greedy") return ranked[0];
        let cumulative = 0;
        for (let index = 0; index < ranked.length; index += 1) {
            cumulative += ranked[index].probability;
            if (randomValue <= cumulative) return ranked[index];
        }
        return ranked[0];
    }

    function initGenerationLab() {
        const canvas = get("generationCanvas");
        if (!canvas || canvas.dataset.cbActive) return;
        canvas.dataset.cbActive = "true";
        const promptInput = get("generationPrompt");
        const strategyInput = get("generationStrategy");
        const temperatureInput = get("generationTemperature");
        const filterInput = get("generationFilter");
        const lengthInput = get("generationLength");
        const nextButton = get("generationNext");
        const autoButton = get("generationAuto");
        const pauseButton = get("generationPause");
        const resetButton = get("generationReset");
        const phaseNames = ["Candidate logits", "Temperature scaling", "Candidate filtering", "Token probabilities", "Token selection"];
        let phase = 0;
        let generated = [];
        let selected = null;
        let timer = null;

        function settings() {
            const model = GENERATION_MODELS[promptInput.value] || GENERATION_MODELS.learning;
            const temperature = Number(temperatureInput.value) / 100;
            const filterValue = Number(filterInput.value);
            const maximum = Number(lengthInput.value);
            const visibleGenerationIndex = phase === 5 && generated.length ? generated.length - 1 : generated.length;
            const rowIndex = Math.min(visibleGenerationIndex, model.rows.length - 1);
            const distribution = generationDistribution(model.rows[rowIndex], temperature, strategyInput.value, filterValue);
            return { model: model, temperature: temperature, filterValue: filterValue, maximum: maximum, rowIndex: rowIndex, distribution: distribution };
        }

        function stop() {
            if (timer !== null) window.clearInterval(timer);
            timer = null;
            pauseButton.disabled = true;
        }

        function draw() {
            const current = settings();
            const prepared = prepareCanvas(canvas, 500, 600);
            const context = prepared.context;
            const width = prepared.width;
            const height = prepared.height;
            context.clearRect(0, 0, width, height);
            context.fillStyle = "#061426";
            context.fillRect(0, 0, width, height);
            context.fillStyle = "#61d7ff";
            context.font = "900 12px Arial";
            context.textAlign = "left";
            context.fillText("AUTOREGRESSIVE DECODING • " + strategyInput.options[strategyInput.selectedIndex].text.toUpperCase(), 22, 29);

            const allTokens = current.model.prompt.concat(generated);
            let tokenX = 22;
            let tokenY = 48;
            context.font = "800 11px Arial";
            allTokens.forEach(function (token, index) {
                const tokenWidth = Math.max(48, context.measureText(token).width + 22);
                if (tokenX + tokenWidth > width - 22) { tokenX = 22; tokenY += 40; }
                roundRect(context, tokenX, tokenY, tokenWidth, 30, 9);
                context.fillStyle = index < current.model.prompt.length ? "#17324c" : "#facc15";
                context.fill();
                context.fillStyle = index < current.model.prompt.length ? "#e8f3ff" : "#061426";
                context.textAlign = "center";
                context.fillText(token, tokenX + tokenWidth / 2, tokenY + 20);
                tokenX += tokenWidth + 7;
            });

            if (phase === 0) {
                context.fillStyle = "#facc15";
                context.font = "900 19px Arial";
                context.textAlign = "center";
                context.fillText("PROMPT CONTEXT IS READY", width / 2, 185);
                context.fillStyle = "#9ab7d1";
                context.font = "600 14px Arial";
                wrapLines(context, "The decoder will score one next-token distribution, apply the selected policy and append exactly one token at a time.", width - 70).forEach(function (line, index) { context.fillText(line, width / 2, 220 + index * 23); });
                context.fillStyle = "#22d3ee";
                context.font = "900 11px Arial";
                context.fillText("PROMPT → LOGITS → FILTER → PROBABILITY → TOKEN → REPEAT", width / 2, height - 45);
                return;
            }

            const chartTop = Math.max(145, tokenY + 68);
            const ranked = current.distribution.slice().sort(function (left, right) { return phase >= 4 ? right.probability - left.probability : right.logit - left.logit; });
            const maximumValue = phase >= 4 ? Math.max.apply(null, ranked.map(function (item) { return item.probability; })) : Math.max.apply(null, ranked.map(function (item) { return phase >= 2 ? item.scaled : item.logit; }));
            const barStart = width < 560 ? 100 : 130;
            const available = Math.max(105, width - barStart - 72);
            ranked.forEach(function (item, index) {
                const y = chartTop + index * 48;
                const value = phase >= 4 ? item.probability : phase >= 2 ? item.scaled : item.logit;
                context.fillStyle = item.kept || phase < 3 ? "#dbeafe" : "#64748b";
                context.font = "800 11px Arial";
                context.textAlign = "right";
                context.fillText(item.token, barStart - 12, y + 13);
                context.fillStyle = "#17324c";
                context.fillRect(barStart, y, available, 15);
                context.fillStyle = !item.kept && phase >= 3 ? "#334155" : selected && selected.token === item.token && phase >= 5 ? "#facc15" : index === 0 ? "#a78bfa" : "#22d3ee";
                context.fillRect(barStart, y, available * Math.max(0, value) / (maximumValue || 1), 15);
                context.fillStyle = item.kept || phase < 3 ? "#f8fafc" : "#64748b";
                context.font = "700 10px monospace";
                context.textAlign = "left";
                const label = phase >= 4 ? fixed(item.probability, 3) : fixed(value, 2);
                context.fillText(!item.kept && phase >= 3 ? "removed" : label, barStart + available + 8, y + 12);
            });
        }

        function render() {
            const current = settings();
            const complete = generated.length >= current.maximum || (generated.length && generated[generated.length - 1] === "</s>");
            const kept = current.distribution.filter(function (item) { return item.kept; });
            const top = current.distribution.slice().sort(function (left, right) { return right.probability - left.probability; })[0];
            get("generationTemperatureValue").textContent = fixed(current.temperature, 2);
            get("generationFilterValue").textContent = strategyInput.value === "topk" ? "K = " + current.filterValue : strategyInput.value === "topp" ? "P = " + fixed(0.4 + current.filterValue / 10, 1) : "Not used";
            get("generationLengthValue").textContent = current.maximum + (current.maximum === 1 ? " token" : " tokens");
            get("generationPhase").textContent = complete ? "Complete" : phase === 0 ? "Ready" : phaseNames[phase - 1];
            get("generationStep").textContent = generated.length + " / " + current.maximum;
            get("generationCandidates").textContent = phase >= 3 ? kept.length : phase >= 1 ? current.distribution.length : "—";
            get("generationSelected").textContent = phase >= 5 && selected ? selected.token : "—";
            get("generationProbability").textContent = phase >= 5 && selected ? fixed(selected.probability, 3) : "—";

            const displayed = current.model.prompt.concat(generated.map(function (token) { return token === "</s>" ? "[END]" : token; })).join(" ");
            if (phase === 0) {
                get("generationVerdict").textContent = "The prompt contains " + current.model.prompt.length + " input tokens.";
                get("generationEquation").textContent = "context = [" + current.model.prompt.join(", ") + "]";
                get("generationExplanation").textContent = "The causal decoder can use the prompt and tokens already generated, but it cannot inspect future outputs.";
                get("generationEvidence").innerHTML = "<span>PROMPT</span><strong>" + escapeHtml(displayed) + "</strong>";
                get("generationNextCheck").textContent = "Predict which vocabulary candidate receives the largest raw logit.";
            } else if (phase === 1) {
                get("generationVerdict").textContent = "The model produced one raw score for each next-token candidate.";
                get("generationEquation").textContent = "logits = [" + current.distribution.map(function (item) { return item.token + ":" + fixed(item.logit, 1); }).join(", ") + "]";
                get("generationExplanation").textContent = "Logits are relative scores, not probabilities. A constant could be added to all logits without changing softmax.";
                get("generationEvidence").innerHTML = "<span>HIGHEST LOGIT</span><strong>“" + escapeHtml(top.token) + "” before decoding policy</strong>";
                get("generationNextCheck").textContent = "Predict whether the selected temperature sharpens or flattens the distribution.";
            } else if (phase === 2) {
                get("generationVerdict").textContent = current.temperature < 1 ? "Temperature below 1 sharpens score differences." : current.temperature > 1 ? "Temperature above 1 reduces score differences." : "Temperature 1 leaves logits unchanged.";
                get("generationEquation").textContent = "scaled logit = z / T; T = " + fixed(current.temperature, 2);
                get("generationExplanation").textContent = "Temperature rescales the complete logit vector before softmax. It does not retrieve facts or modify model parameters.";
                get("generationEvidence").innerHTML = "<span>SCALED LEADER</span><strong>" + escapeHtml(top.token) + " = " + fixed(top.scaled, 3) + "</strong>";
                get("generationNextCheck").textContent = "Predict which candidates survive the selected filter.";
            } else if (phase === 3) {
                get("generationVerdict").textContent = strategyInput.options[strategyInput.selectedIndex].text + " retains " + kept.length + " candidate(s).";
                get("generationEquation").textContent = strategyInput.value === "greedy" ? "candidate set = {argmax(z)}" : strategyInput.value === "topk" ? "candidate set = highest " + current.filterValue + " logits" : "smallest ranked set with cumulative mass ≥ " + fixed(0.4 + current.filterValue / 10, 1);
                get("generationExplanation").textContent = "Removed candidates receive zero selection probability; surviving probabilities are renormalized.";
                get("generationEvidence").innerHTML = "<span>KEPT TOKENS</span><strong>" + kept.map(function (item) { return escapeHtml(item.token); }).join(" • ") + "</strong>";
                get("generationNextCheck").textContent = "Calculate the normalized probability of the leading retained token.";
            } else if (phase === 4) {
                get("generationVerdict").textContent = "The retained next-token probabilities now sum to " + fixed(sum(current.distribution.map(function (item) { return item.probability; })), 3) + ".";
                get("generationEquation").textContent = "P(" + top.token + ") = " + fixed(top.probability, 4);
                get("generationExplanation").textContent = "Greedy uses the largest value. Sampling maps a deterministic number into the cumulative probability intervals.";
                get("generationEvidence").innerHTML = "<span>PROBABILITIES</span><strong>" + kept.slice().sort(function (a, b) { return b.probability - a.probability; }).map(function (item) { return escapeHtml(item.token) + "=" + fixed(item.probability, 3); }).join(" • ") + "</strong>";
                get("generationNextCheck").textContent = strategyInput.value === "greedy" ? "Select the maximum-probability token." : "Use deterministic sample u=" + fixed(SAMPLE_VALUES[current.rowIndex], 2) + " to select a token.";
            } else {
                get("generationVerdict").textContent = "“" + (selected ? selected.token : "") + "” was appended as generated token " + generated.length + ".";
                get("generationEquation").textContent = strategyInput.value === "greedy" ? "token = argmax P(token|context)" : "u = " + fixed(SAMPLE_VALUES[Math.max(0, generated.length - 1)], 2) + " → token = “" + (selected ? selected.token : "") + "”";
                get("generationExplanation").textContent = "The new token becomes part of the next causal context. Generation repeats until a stop condition is reached.";
                get("generationEvidence").innerHTML = "<span>GENERATED TEXT</span><strong>" + escapeHtml(displayed) + "</strong>";
                get("generationNextCheck").textContent = complete ? "Compare another decoding strategy and explain the changed sequence." : "Predict the next distribution after adding this token.";
            }

            nextButton.textContent = complete ? "Generation Complete" : phase === 0 ? "Inspect Prompt" : phase < 5 ? phaseNames[phase] : "Score Next Token";
            nextButton.disabled = complete;
            autoButton.disabled = complete || timer !== null;
            pauseButton.disabled = timer === null;
            if (complete) stop();
            draw();
        }

        function advance() {
            const current = settings();
            if (generated.length >= current.maximum) { render(); return; }
            if (phase < 4) {
                phase += 1;
            } else if (phase === 4) {
                selected = selectGenerationToken(current.distribution, strategyInput.value, SAMPLE_VALUES[current.rowIndex]);
                generated.push(selected.token);
                phase = 5;
            } else {
                phase = 1;
                selected = null;
            }
            render();
        }

        function reset() { stop(); phase = 0; generated = []; selected = null; render(); }
        [promptInput, strategyInput].forEach(function (input) { input.addEventListener("change", reset); });
        [temperatureInput, filterInput, lengthInput].forEach(function (input) { input.addEventListener("input", reset); });
        nextButton.addEventListener("click", advance);
        autoButton.addEventListener("click", function () { if (timer !== null || nextButton.disabled) return; timer = window.setInterval(advance, 690); render(); });
        pauseButton.addEventListener("click", function () { stop(); render(); });
        resetButton.addEventListener("click", reset);
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
            "from math import exp, sqrt",
            "tokens = ['AI', 'learns', 'context']",
            "Q = [[1.0, 0.0], [0.6, 0.8], [0.8, 0.4]]",
            "K = [[0.9, 0.1], [0.4, 1.0], [1.0, 0.5]]",
            "V = [[1.0, 0.2], [0.1, 1.0], [0.8, 0.7]]",
            "scores = []",
            "for i in range(len(tokens)):",
            "    row = []",
            "    for j in range(len(tokens)):",
            "        dot = 0.0",
            "        for feature in range(2):",
            "            dot += Q[i][feature] * K[j][feature]",
            "        row.append(dot / sqrt(2))",
            "    scores.append(row)",
            "weights = []",
            "for row in scores:",
            "    maximum = max(row)",
            "    exponentials = []",
            "    for score in row:",
            "        exponentials.append(exp(score - maximum))",
            "    denominator = sum(exponentials)",
            "    probability_row = []",
            "    for value in exponentials:",
            "        probability_row.append(value / denominator)",
            "    weights.append(probability_row)",
            "context = []",
            "for i in range(len(tokens)):",
            "    output = []",
            "    for dimension in range(2):",
            "        total = 0.0",
            "        for j in range(len(tokens)):",
            "            total += weights[i][j] * V[j][dimension]",
            "        output.append(round(total, 3))",
            "    context.append(output)",
            "print(context)"
        ];

        function clone(value) { return JSON.parse(JSON.stringify(value)); }
        function addState(states, line, explanation, variables, expression, output) {
            states.push({ line: line, explanation: explanation, variables: clone(variables || {}), expression: expression || "—", output: output || "" });
        }

        function buildStates() {
            const states = [];
            const tokens = ["AI", "learns", "context"];
            const Q = [[1.0, 0.0], [0.6, 0.8], [0.8, 0.4]];
            const K = [[0.9, 0.1], [0.4, 1.0], [1.0, 0.5]];
            const V = [[1.0, 0.2], [0.1, 1.0], [0.8, 0.7]];
            addState(states, 0, "Import exponential and square-root functions.", { functions: ["exp", "sqrt"] }, "from math import exp, sqrt");
            addState(states, 1, "Create the three sequence positions.", { tokens: tokens }, "len(tokens) = 3");
            addState(states, 2, "Store one two-dimensional query for each token.", { Q: Q, shape: "3 × 2" }, "Q ∈ R^(3×2)");
            addState(states, 3, "Store one two-dimensional key for each token.", { K: K, shape: "3 × 2" }, "K ∈ R^(3×2)");
            addState(states, 4, "Store one two-dimensional value for each token.", { V: V, shape: "3 × 2" }, "V ∈ R^(3×2)");
            const scores = [];
            addState(states, 5, "Create the attention-score matrix.", { scores: scores }, "scores = []");
            for (let i = 0; i < tokens.length; i += 1) {
                addState(states, 6, "Enter the outer query loop for token “" + tokens[i] + "”.", { i: i, query_token: tokens[i], query: Q[i] }, "i = " + i);
                const row = [];
                addState(states, 7, "Create an empty score row for this query.", { i: i, row: row }, "row = []");
                for (let j = 0; j < tokens.length; j += 1) {
                    addState(states, 8, "Compare query “" + tokens[i] + "” with key “" + tokens[j] + "”.", { i: i, j: j, query_token: tokens[i], key_token: tokens[j] }, "j = " + j);
                    let product = 0;
                    addState(states, 9, "Initialize the dot product for this query–key pair.", { i: i, j: j, dot: product }, "dot = 0.0");
                    for (let feature = 0; feature < 2; feature += 1) {
                        addState(states, 10, "Enter feature " + feature + " of both vectors.", { i: i, j: j, feature: feature, dot_before: product }, "feature = " + feature);
                        const contribution = Q[i][feature] * K[j][feature];
                        product += contribution;
                        addState(states, 11, "Add the current feature product to the compatibility score.", { q_value: Q[i][feature], k_value: K[j][feature], contribution: contribution, dot: product }, fixed(Q[i][feature], 1) + " × " + fixed(K[j][feature], 1) + " → dot = " + fixed(product, 3));
                    }
                    const scaled = product / Math.sqrt(2);
                    row.push(scaled);
                    addState(states, 12, "Scale by √dₖ and append the score.", { i: i, j: j, raw_dot: product, scaled_score: scaled, row: row }, fixed(product, 3) + " / √2 = " + fixed(scaled, 4));
                }
                scores.push(row.slice());
                addState(states, 13, "Append the completed score row.", { i: i, scores: scores }, "scores.append(row)");
            }
            const weights = [];
            addState(states, 14, "Create the normalized attention-weight matrix.", { weights: weights }, "weights = []");
            scores.forEach(function (row, rowIndex) {
                addState(states, 15, "Enter the softmax loop for score row " + rowIndex + ".", { row_index: rowIndex, row: row }, "row = scores[" + rowIndex + "]");
                const maximum = Math.max.apply(null, row);
                addState(states, 16, "Find the row maximum for numerically stable softmax.", { row_index: rowIndex, maximum: maximum }, "max(row) = " + fixed(maximum, 4));
                const exponentials = [];
                addState(states, 17, "Create the exponential list.", { exponentials: exponentials }, "exponentials = []");
                row.forEach(function (score, scoreIndex) {
                    addState(states, 18, "Visit scaled score " + scoreIndex + ".", { score_index: scoreIndex, score: score }, "score = " + fixed(score, 4));
                    const exponential = Math.exp(score - maximum);
                    exponentials.push(exponential);
                    addState(states, 19, "Exponentiate after subtracting the maximum.", { score: score, maximum: maximum, exponential: exponential, exponentials: exponentials }, "exp(" + fixed(score, 4) + " − " + fixed(maximum, 4) + ") = " + fixed(exponential, 4));
                });
                const denominator = sum(exponentials);
                addState(states, 20, "Sum exponentials to form the softmax denominator.", { denominator: denominator, exponentials: exponentials }, "sum = " + fixed(denominator, 4));
                const probabilityRow = [];
                addState(states, 21, "Create the probability row.", { probability_row: probabilityRow }, "probability_row = []");
                exponentials.forEach(function (value, valueIndex) {
                    addState(states, 22, "Normalize exponential " + valueIndex + ".", { value_index: valueIndex, value: value, denominator: denominator }, "value = " + fixed(value, 4));
                    const probability = value / denominator;
                    probabilityRow.push(probability);
                    addState(states, 23, "Append its normalized attention probability.", { probability: probability, probability_row: probabilityRow }, fixed(value, 4) + " / " + fixed(denominator, 4) + " = " + fixed(probability, 4));
                });
                weights.push(probabilityRow.slice());
                addState(states, 24, "Append the completed attention row; it sums to one.", { row_index: rowIndex, weights: weights, row_sum: sum(probabilityRow) }, "sum(probability_row) = " + fixed(sum(probabilityRow), 3));
            });
            const context = [];
            addState(states, 25, "Create the final context matrix.", { context: context }, "context = []");
            for (let i = 0; i < tokens.length; i += 1) {
                addState(states, 26, "Enter the output loop for query “" + tokens[i] + "”.", { i: i, query_token: tokens[i], attention_row: weights[i] }, "i = " + i);
                const output = [];
                addState(states, 27, "Create its empty context vector.", { output: output }, "output = []");
                for (let dimension = 0; dimension < 2; dimension += 1) {
                    addState(states, 28, "Enter value dimension " + dimension + ".", { i: i, dimension: dimension }, "dimension = " + dimension);
                    let total = 0;
                    addState(states, 29, "Initialize the weighted sum for this dimension.", { total: total }, "total = 0.0");
                    for (let j = 0; j < tokens.length; j += 1) {
                        addState(states, 30, "Retrieve value position “" + tokens[j] + "”.", { i: i, j: j, dimension: dimension, total_before: total }, "j = " + j);
                        const contribution = weights[i][j] * V[j][dimension];
                        total += contribution;
                        addState(states, 31, "Add attention weight × value coordinate.", { weight: weights[i][j], value: V[j][dimension], contribution: contribution, total: total }, fixed(weights[i][j], 4) + " × " + fixed(V[j][dimension], 1) + " → " + fixed(total, 4));
                    }
                    output.push(Number(fixed(total, 3)));
                    addState(states, 32, "Round and append the completed output coordinate.", { dimension: dimension, output: output }, "round(" + fixed(total, 4) + ", 3) = " + fixed(total, 3));
                }
                context.push(output.slice());
                addState(states, 33, "Append the contextual output for this query.", { token: tokens[i], context: context }, "context.append(output)");
            }
            addState(states, 34, "Print all contextual token representations.", { context: context }, "print(context)", JSON.stringify(context));
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
        codeContainer.innerHTML = lines.map(function (line, index) { return '<div class="aiml-code-line" data-line="' + index + '"><span>' + String(index + 1).padStart(2, "0") + '</span><code>' + escapeHtml(line) + "</code></div>"; }).join("");

        function stop() { if (timer !== null) window.clearInterval(timer); timer = null; pause.disabled = true; }
        function formatValue(value) { if (typeof value === "number") return Number.isInteger(value) ? String(value) : fixed(value, 4); return JSON.stringify(value); }
        function render() {
            const atStart = step === 0;
            const atEnd = step >= states.length;
            const current = atStart ? null : states[step - 1];
            codeContainer.querySelectorAll(".aiml-code-line").forEach(function (line, index) {
                line.classList.toggle("is-active", !!current && index === current.line);
                line.classList.toggle("is-complete", !!current && index < current.line);
            });
            if (current) {
                const active = codeContainer.querySelector('[data-line="' + current.line + '"]');
                if (active) active.scrollIntoView({ block: "nearest" });
            }
            get("tracerStatus").textContent = atStart ? "Ready" : atEnd ? "Complete" : "Running";
            get("tracerExplanation").textContent = current ? current.explanation : "Press Next to evaluate the first statement.";
            get("tracerExpression").textContent = current ? current.expression : "—";
            get("tracerOutput").textContent = current && current.output ? current.output : "Waiting for print(...)";
            const variables = current ? current.variables : {};
            get("tracerVariables").innerHTML = Object.keys(variables).length ? Object.keys(variables).map(function (key) { return '<article class="aiml-variable"><span>' + escapeHtml(key) + '</span><code>' + escapeHtml(formatValue(variables[key])) + "</code></article>"; }).join("") : '<article class="aiml-variable"><span>STATE</span><code>Not started</code></article>';
            previous.disabled = atStart;
            next.disabled = atEnd;
            auto.disabled = atEnd || timer !== null;
            pause.disabled = timer === null;
            get("tracerProgress").textContent = "Step " + step + " of " + states.length;
            if (atEnd) stop();
        }
        function advance() { if (step < states.length) step += 1; render(); }
        toggle.addEventListener("click", function () {
            const opening = panel.hidden;
            panel.hidden = !opening;
            toggle.textContent = opening ? "✕ Close Interactive Tracer" : "Open Interactive Tracer";
            toggle.setAttribute("aria-expanded", String(opening));
            if (opening) window.setTimeout(function () { panel.scrollIntoView({ behavior: "smooth", block: "nearest" }); }, 50);
            else stop();
        });
        previous.addEventListener("click", function () { stop(); step = Math.max(0, step - 1); render(); });
        next.addEventListener("click", advance);
        auto.addEventListener("click", function () { if (step >= states.length || timer !== null) return; timer = window.setInterval(advance, 180); render(); });
        pause.addEventListener("click", function () { stop(); render(); });
        reset.addEventListener("click", function () { stop(); step = 0; render(); });
        render();
    }

    function initProblems() {
        const list = get("problemList");
        if (!list || list.dataset.cbActive) return;
        list.dataset.cbActive = "true";
        const problems = [
            { title: "Calculate a Scaled Attention Score", description: "Compute q·k/√dₖ without numerical libraries.", sampleInput: "q=[1,2], k=[3,1]", expected: "3.536", hint: "Accumulate the dot product, then divide by sqrt(len(q)).", starter: "from math import sqrt\nq = [1, 2]\nk = [3, 1]\n# Calculate the scaled dot-product score\n", solution: "from math import sqrt\nq = [1, 2]\nk = [3, 1]\ndot = 0\nfor left, right in zip(q, k):\n    dot += left * right\nscore = dot / sqrt(len(q))\nprint(round(score, 3))", required: [["sqrt("], ["zip("], ["dot"], ["left * right", "left*right"], ["len(q)"], ["print("]] },
            { title: "Implement Stable Softmax", description: "Convert three scores into probabilities without overflow.", sampleInput: "scores=[2,1,0]", expected: "[0.665, 0.245, 0.09]", hint: "Subtract max(scores) before calling exp, then divide every result by their sum.", starter: "from math import exp\nscores = [2, 1, 0]\n# Calculate stable softmax probabilities\n", solution: "from math import exp\nscores = [2, 1, 0]\nmaximum = max(scores)\nvalues = []\nfor score in scores:\n    values.append(exp(score - maximum))\ndenominator = sum(values)\nprobabilities = []\nfor value in values:\n    probabilities.append(round(value / denominator, 3))\nprint(probabilities)", required: [["max("], ["exp("], ["score - maximum", "score-maximum"], ["sum("], ["denominator"], ["print("]] },
            { title: "Build a Causal Attention Mask", description: "Create a matrix that allows position i to see only keys j≤i.", sampleInput: "length=4", expected: "[[0,-inf,-inf,-inf],[0,0,-inf,-inf],...]", hint: "Use two loops; append 0 when j <= i and float('-inf') otherwise.", starter: "length = 4\nmask = []\n# Build the causal visibility matrix\n", solution: "length = 4\nmask = []\nfor i in range(length):\n    row = []\n    for j in range(length):\n        if j <= i:\n            row.append(0)\n        else:\n            row.append(float('-inf'))\n    mask.append(row)\nprint(mask)", required: [["for i"], ["for j"], ["j <= i", "j<=i"], ["float('-inf')", "float(\"-inf\")"], ["append("], ["print("]] },
            { title: "Apply Top-K Filtering", description: "Retain only the K largest token logits and mark all others as impossible.", sampleInput: "logits=[1.2,3.4,0.8,2.1], k=2", expected: "[-inf,3.4,-inf,2.1]", hint: "Sort indices by their logit values and keep the first k in a set.", starter: "logits = [1.2, 3.4, 0.8, 2.1]\nk = 2\n# Retain only the top-k logits\n", solution: "logits = [1.2, 3.4, 0.8, 2.1]\nk = 2\nranked = sorted(range(len(logits)), key=lambda i: logits[i], reverse=True)\nkept = set(ranked[:k])\nfiltered = []\nfor i, value in enumerate(logits):\n    filtered.append(value if i in kept else float('-inf'))\nprint(filtered)", required: [["sorted("], ["range("], ["reverse=true", "reverse = true"], [":k", ": k"], ["float('-inf')", "float(\"-inf\")"], ["print("]] },
            { title: "Mix Value Vectors with Attention", description: "Calculate one contextual output as the weighted sum of value vectors.", sampleInput: "weights=[0.6,0.3,0.1]", expected: "[0.68,0.49]", hint: "Loop over value dimensions, then accumulate weights[j] * values[j][dimension].", starter: "weights = [0.6, 0.3, 0.1]\nvalues = [[1.0, 0.2], [0.2, 1.0], [0.2, 0.7]]\n# Calculate the context vector\n", solution: "weights = [0.6, 0.3, 0.1]\nvalues = [[1.0, 0.2], [0.2, 1.0], [0.2, 0.7]]\ncontext = []\nfor dimension in range(len(values[0])):\n    total = 0\n    for j in range(len(values)):\n        total += weights[j] * values[j][dimension]\n    context.append(round(total, 3))\nprint(context)", required: [["for dimension"], ["for j"], ["weights[j]"], ["values[j][dimension]"], ["append("], ["print("]] }
        ];
        let saved = {};
        try { saved = JSON.parse(window.localStorage.getItem(PROGRESS_KEY) || "{}"); } catch (error) { saved = {}; }
        const solved = new Set(Array.isArray(saved.solvedProblems) ? saved.solvedProblems : []);
        const scores = saved.problemScores && typeof saved.problemScores === "object" ? saved.problemScores : {};
        const revealed = new Set();
        function save() {
            let current = {};
            try { current = JSON.parse(window.localStorage.getItem(PROGRESS_KEY) || "{}"); } catch (error) { current = {}; }
            current.solvedProblems = Array.from(solved);
            current.problemScores = scores;
            window.localStorage.setItem(PROGRESS_KEY, JSON.stringify(current));
        }
        function updateSummary() {
            const total = Object.values(scores).reduce(function (result, score) { return result + Number(score || 0); }, 0);
            get("problemSolvedCount").textContent = solved.size + " / " + problems.length;
            get("problemScore").textContent = total + " / " + problems.length * 100;
            get("problemProgressBar").style.width = solved.size / problems.length * 100 + "%";
        }
        list.innerHTML = problems.map(function (problem, index) {
            const number = index + 1;
            return '<article class="aiml-problem-card' + (solved.has(index) ? " is-solved" : "") + '" data-problem="' + index + '"><div class="aiml-problem-head"><span class="aiml-problem-number">' + String(number).padStart(2, "0") + "</span><div><h3>" + number + ". " + escapeHtml(problem.title) + "</h3><p>" + escapeHtml(problem.description) + '</p></div></div><div class="aiml-problem-data"><span><strong>Sample input:</strong> ' + escapeHtml(problem.sampleInput) + '</span><span><strong>Expected output:</strong> <code>' + escapeHtml(problem.expected) + '</code></span></div><div class="aiml-problem-actions"><button type="button" class="primary" data-action="workspace">💻 Solve It Yourself</button><button type="button" class="hint" data-action="hint">Hint</button><button type="button" data-action="solution">Show Program</button></div><div class="aiml-problem-reveal" data-panel="hint" hidden><strong>Hint</strong><p>' + escapeHtml(problem.hint) + '</p></div><div class="aiml-problem-reveal" data-panel="solution" hidden><strong>Model program</strong><pre><code>' + escapeHtml(problem.solution) + '</code></pre></div><div class="aiml-workspace" data-panel="workspace" hidden><label for="problemCode' + index + '">Your Python code</label><textarea id="problemCode' + index + '" spellcheck="false">' + escapeHtml(problem.starter) + '</textarea><div class="aiml-workspace-row"><button type="button" data-action="check">Check Answer</button><button type="button" data-action="reset">Reset</button><span class="aiml-check-result" data-result>Write your solution, then check its structure.</span></div></div></article>';
        }).join("");
        function togglePanel(card, name, button, closedText, openText) {
            const section = card.querySelector('[data-panel="' + name + '"]');
            if (!section) return;
            const opening = section.hidden;
            section.hidden = !opening;
            button.textContent = opening ? openText : closedText;
        }
        list.addEventListener("click", function (event) {
            const button = event.target.closest("button[data-action]");
            if (!button) return;
            const card = button.closest(".aiml-problem-card");
            const index = Number(card.dataset.problem);
            const problem = problems[index];
            const action = button.dataset.action;
            if (action === "workspace") { togglePanel(card, "workspace", button, "💻 Solve It Yourself", "✕ Close Workspace"); return; }
            if (action === "hint") { togglePanel(card, "hint", button, "Hint", "Hide Hint"); return; }
            if (action === "solution") { revealed.add(index); togglePanel(card, "solution", button, "Show Program", "Hide Program"); return; }
            const textarea = card.querySelector("textarea");
            const result = card.querySelector("[data-result]");
            if (action === "reset") { textarea.value = problem.starter; result.className = "aiml-check-result"; result.textContent = "Workspace reset. Try the problem again."; return; }
            if (action === "check") {
                const normalized = textarea.value.toLowerCase().replace(/\s+/g, " ");
                const missing = problem.required.filter(function (alternatives) { return !alternatives.some(function (token) { return normalized.includes(token.toLowerCase()); }); });
                if (!textarea.value.trim() || textarea.value.trim() === problem.starter.trim()) { result.className = "aiml-check-result error"; result.textContent = "Add your solution before checking."; return; }
                if (missing.length) { result.className = "aiml-check-result error"; result.textContent = "Not complete yet. Recheck the required transformer logic."; return; }
                const score = revealed.has(index) ? 60 : 100;
                solved.add(index);
                scores[index] = Math.max(Number(scores[index] || 0), score);
                card.classList.add("is-solved");
                result.className = "aiml-check-result success";
                result.textContent = revealed.has(index) ? "Logic recognized after viewing the model program. Score: 60/100." : "Logic recognized — solved independently. Score: 100/100.";
                save();
                updateSummary();
            }
        });
        updateSummary();
    }

    function initQuiz() {
        const container = get("quizQuestions");
        if (!container || container.dataset.cbActive) return;
        container.dataset.cbActive = "true";
        const questions = [
            ["Why is attention divided by √dₖ before softmax?", ["To control dot-product scale and softmax saturation", "To remove the value vectors", "To shorten the vocabulary", "To create positional IDs"], 0, "As head dimension grows, unscaled dot products tend to grow in magnitude. Scaling preserves healthier softmax gradients and probability spread."],
            ["What does a query vector represent inside self-attention?", ["The learned evidence a destination token is seeking", "The final vocabulary probability", "Only the token ID", "A fixed class label"], 0, "A query is compared with source keys to determine which value vectors should contribute to the destination representation."],
            ["When is a causal attention mask required?", ["When future ground-truth tokens must remain invisible during left-to-right prediction", "For every completed-sentence classifier", "Only when padding is absent", "To increase vocabulary size"], 0, "Causal masking aligns training with autoregressive inference by blocking positions to the right of the current token."],
            ["What is the main purpose of positional information?", ["Distinguish token order and relative location", "Replace token embeddings", "Guarantee factual output", "Remove the softmax denominator"], 0, "Pure content self-attention is permutation-equivariant. Position mechanisms supply sequence-order information."],
            ["What does multi-head attention provide?", ["Several learned attention subspaces whose outputs are combined", "A guarantee that every head is interpretable", "One model per vocabulary token", "No quadratic computation"], 0, "Separate projections allow heads to learn different compatibility patterns, although useful specialization is not guaranteed."],
            ["Which model family naturally uses bidirectional self-attention for representation learning?", ["Encoder-only", "Causal decoder-only", "Autoregressive n-gram only", "K-Means"], 0, "Encoder models can inspect the full completed input and are natural for understanding and representation tasks."],
            ["What happens when sampling temperature is reduced below 1?", ["The next-token distribution usually becomes sharper", "The model learns new facts", "The context window expands", "All logits become equal"], 0, "Dividing logits by a smaller positive temperature increases their differences before softmax."],
            ["How does Top-P differ from Top-K?", ["Top-P keeps enough ranked tokens to reach a probability-mass threshold", "Top-P always keeps exactly P tokens", "Top-P changes model weights", "Top-P removes the largest score"], 0, "The nucleus size varies with distribution shape, while Top-K retains a fixed number of candidates."],
            ["What is the central efficiency idea of LoRA?", ["Learn low-rank weight updates while freezing the base matrix", "Delete all attention heads", "Store facts only in prompts", "Replace evaluation with training loss"], 0, "LoRA parameterizes a task update with two small trainable matrices, reducing trainable memory and adapter storage."],
            ["Which evaluation claim is correct?", ["The full LLM system needs task, safety, latency and cost evaluation", "Perplexity alone proves factuality", "Fluency is calibrated confidence", "One benchmark covers every deployment"], 0, "Production behavior depends on the model plus prompt, retrieval, tools, decoding and post-processing, so evaluation must cover the complete system." ]
        ];
        container.innerHTML = questions.map(function (item, questionIndex) {
            return '<article class="aiml-quiz-question" data-quiz-question="' + questionIndex + '"><strong>' + (questionIndex + 1) + ". " + escapeHtml(item[0]) + '</strong><div class="aiml-quiz-options">' + item[1].map(function (option, optionIndex) {
                const id = "quiz-twenty-one-" + questionIndex + "-" + optionIndex;
                return '<label class="aiml-quiz-option" for="' + id + '"><input type="radio" id="' + id + '" name="quiz-twenty-one-' + questionIndex + '" value="' + optionIndex + '"><span>' + String.fromCharCode(65 + optionIndex) + ". " + escapeHtml(option) + "</span></label>";
            }).join("") + '</div><div class="aiml-quiz-explanation" hidden></div></article>';
        }).join("");
        container.addEventListener("change", function (event) {
            if (!event.target.matches('input[type="radio"]')) return;
            event.target.closest(".aiml-quiz-question").querySelectorAll(".aiml-quiz-option").forEach(function (option) { option.classList.toggle("is-selected", option.contains(event.target)); });
        });
        get("checkQuiz").addEventListener("click", function () {
            let correct = 0;
            let answered = 0;
            questions.forEach(function (item, index) {
                const question = container.querySelector('[data-quiz-question="' + index + '"]');
                const selectedAnswer = question.querySelector('input[type="radio"]:checked');
                const options = Array.from(question.querySelectorAll(".aiml-quiz-option"));
                const explanation = question.querySelector(".aiml-quiz-explanation");
                options.forEach(function (option, optionIndex) { option.classList.remove("is-correct", "is-wrong"); if (optionIndex === item[2]) option.classList.add("is-correct"); });
                if (selectedAnswer) { answered += 1; if (Number(selectedAnswer.value) === item[2]) correct += 1; else options[Number(selectedAnswer.value)].classList.add("is-wrong"); }
                explanation.hidden = false;
                explanation.innerHTML = '<strong>Your answer: ' + (selectedAnswer ? escapeHtml(item[1][Number(selectedAnswer.value)]) : "Not attempted") + '</strong><br><strong>Correct answer: ' + escapeHtml(item[1][item[2]]) + "</strong><br>" + escapeHtml(item[3]);
            });
            get("quizScore").textContent = correct + " / " + questions.length + " correct" + (answered < questions.length ? " • " + (questions.length - answered) + " not attempted" : "");
            get("resetQuiz").disabled = false;
            let progress = {};
            try { progress = JSON.parse(window.localStorage.getItem(PROGRESS_KEY) || "{}"); } catch (error) { progress = {}; }
            progress.bestQuizScore = Math.max(Number(progress.bestQuizScore || 0), correct);
            window.localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
        });
        get("resetQuiz").disabled = true;
        get("resetQuiz").addEventListener("click", function () {
            container.querySelectorAll('input[type="radio"]').forEach(function (input) { input.checked = false; });
            container.querySelectorAll(".aiml-quiz-option").forEach(function (option) { option.classList.remove("is-selected", "is-correct", "is-wrong"); });
            container.querySelectorAll(".aiml-quiz-explanation").forEach(function (explanation) { explanation.hidden = true; explanation.textContent = ""; });
            get("quizScore").textContent = "Not checked yet";
            get("resetQuiz").disabled = true;
        });
    }

    function initInterviews() {
        const container = get("interviewList");
        if (!container || container.dataset.cbActive) return;
        container.dataset.cbActive = "true";
        const questions = [
            ["Why did transformers replace many recurrent architectures?", "Transformers shorten the path between distant positions and parallelize token processing during training. Self-attention directly routes information across a sequence. The trade-off is quadratic ordinary-attention cost and significant memory use for long contexts."],
            ["Explain query, key and value using both intuition and math.", "A destination query describes what evidence a token seeks. Each source key advertises what it matches, and its value carries retrievable information. Mathematically Q=XWQ, K=XWK and V=XWV; compatibility is QKᵀ/√dₖ, and the normalized matrix multiplies V."],
            ["Why do we need positional encoding?", "Content-only self-attention has no intrinsic token order. Positional information distinguishes permutations and supports distance reasoning. Approaches include fixed sinusoidal values, learned absolute embeddings, relative biases and rotary position embeddings."],
            ["Padding mask versus causal mask?", "A padding mask prevents artificial padding positions from contributing to attention in a batch. A causal mask blocks future tokens so position t can see only positions at or before t. Both are applied to scores before softmax."],
            ["Explain multi-head attention and the transformer block.", "Each head uses separate Q, K and V projections in a smaller subspace, then head outputs are concatenated and projected. Residual connections preserve information and gradient paths, normalization stabilizes activations, and a shared position-wise MLP transforms features at each token."],
            ["BERT versus GPT versus T5?", "BERT-style encoders use bidirectional context and masked or denoising objectives for representation tasks. GPT-style decoders use causal next-token prediction for generation. T5-style encoder–decoder models read a source bidirectionally and generate a causal target with cross-attention."],
            ["Describe autoregressive generation step by step.", "Tokenize the prompt, run the causal decoder, extract last-position logits, apply temperature and filtering, choose one token, append it and repeat. Stop on an end token, stop sequence or length limit. KV caching avoids recomputing earlier key and value projections."],
            ["Greedy, Top-K and Top-P decoding—how do they differ?", "Greedy always selects the largest probability and is deterministic. Top-K samples from a fixed number of leading candidates. Top-P samples from the smallest ranked set reaching probability mass p, so candidate-set size adapts to uncertainty."],
            ["Prompting, RAG or fine-tuning?", "Use prompting for instructions and temporary examples when the capability exists. Use retrieval for fresh, attributable external evidence. Use fine-tuning or PEFT for repeatable behavioral or domain adaptation supported by enough quality data. Many production systems combine them."],
            ["Explain LoRA.", "LoRA freezes a base weight W and learns a low-rank update BA, usually scaled by α/r. With rank r much smaller than model width, trainable parameters, optimizer memory and per-task storage fall substantially while the base model remains reusable."],
            ["How do you evaluate an LLM application?", "Define the task and failure costs; create representative, slice and adversarial cases; freeze the complete configuration; measure task quality, groundedness, safety, robustness, latency and cost; calibrate automated judges with human review; inspect failures and enforce release gates."],
            ["Design a reliable college-placement LLM assistant.", "Use approved placement documents and student-safe access controls; retrieve fresh policy and company evidence; require citations; separate private student records; use structured outputs for eligibility checks; evaluate each company and query type; add abstention and coordinator escalation; log privacy-safe traces and monitor cost, latency and unsupported claims."]
        ];
        container.innerHTML = questions.map(function (item, index) {
            return '<article class="aiml-interview-item"><div class="aiml-interview-question"><span>' + (index + 1) + '.</span><strong>' + escapeHtml(item[0]) + '</strong><button type="button" aria-expanded="false">Show Answer</button></div><div class="aiml-interview-answer" hidden><p>' + escapeHtml(item[1]) + "</p></div></article>";
        }).join("");
        container.addEventListener("click", function (event) {
            const button = event.target.closest(".aiml-interview-question button");
            if (!button) return;
            const answer = button.closest(".aiml-interview-item").querySelector(".aiml-interview-answer");
            const opening = answer.hidden;
            answer.hidden = !opening;
            button.textContent = opening ? "Hide Answer" : "Show Answer";
            button.setAttribute("aria-expanded", String(opening));
        });
    }

    function init() {
        initAttentionLab();
        initGenerationLab();
        initTracer();
        initProblems();
        initQuiz();
        initInterviews();
    }

    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
    else init();
}());
