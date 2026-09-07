(function () {
    "use strict";

    const PROGRESS_KEY = "codebhavya-aiml-level-20-progress-v1";
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

    function sum(values) {
        return values.reduce(function (total, value) { return total + value; }, 0);
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

    function cosine(left, right) {
        let dot = 0;
        let leftMagnitude = 0;
        let rightMagnitude = 0;
        for (let index = 0; index < Math.max(left.length, right.length); index += 1) {
            const a = left[index] || 0;
            const b = right[index] || 0;
            dot += a * b;
            leftMagnitude += a * a;
            rightMagnitude += b * b;
        }
        return leftMagnitude && rightMagnitude ? dot / (Math.sqrt(leftMagnitude) * Math.sqrt(rightMagnitude)) : 0;
    }

    const TEXT_CORPORA = {
        reviews: {
            name: "Course reviews",
            documents: [
                "The Python course is clear, practical and beginner friendly.",
                "Clear Python examples make this practical course easy to follow.",
                "The statistics lessons are detailed but need more exercises.",
                "Practical machine learning projects improved my interview confidence."
            ]
        },
        support: {
            name: "Support tickets",
            documents: [
                "Payment failed while renewing my premium subscription.",
                "My card payment was charged but the subscription is inactive.",
                "The mobile lesson page freezes after opening the visualizer.",
                "Please reset my password because the login link expired."
            ]
        },
        placement: {
            name: "Placement statements",
            documents: [
                "The candidate explained Python data structures and algorithms clearly.",
                "Strong algorithm reasoning and clear communication impressed the panel.",
                "The candidate needs practice with SQL queries and database design.",
                "Machine learning project experience strengthened the interview profile."
            ]
        }
    };

    const STOP_WORDS = new Set(["a", "an", "and", "are", "as", "at", "be", "because", "but", "for", "from", "is", "it", "my", "of", "on", "the", "this", "to", "was", "while", "with"]);

    function simpleStem(token) {
        if (token.length > 5 && token.endsWith("ing")) return token.slice(0, -3);
        if (token.length > 4 && token.endsWith("ied")) return token.slice(0, -3) + "y";
        if (token.length > 4 && token.endsWith("ed")) return token.slice(0, -2);
        if (token.length > 4 && token.endsWith("ly")) return token.slice(0, -2);
        if (token.length > 4 && token.endsWith("s") && !token.endsWith("ss")) return token.slice(0, -1);
        return token;
    }

    function normalizeText(text, mode) {
        let tokens = String(text).normalize("NFKC").toLowerCase().match(/[a-z0-9]+/g) || [];
        if (mode === "stop" || mode === "stem") tokens = tokens.filter(function (token) { return !STOP_WORDS.has(token); });
        if (mode === "stem") tokens = tokens.map(simpleStem);
        return tokens;
    }

    function createTerms(tokens, ngram) {
        const terms = tokens.slice();
        if (Number(ngram) === 2) {
            for (let index = 0; index < tokens.length - 1; index += 1) terms.push(tokens[index] + "_" + tokens[index + 1]);
        }
        return terms;
    }

    function buildDocumentSpace(corpusKey, normalization, representation, ngram) {
        const corpus = TEXT_CORPORA[corpusKey] || TEXT_CORPORA.reviews;
        const tokens = corpus.documents.map(function (document) { return normalizeText(document, normalization); });
        const terms = tokens.map(function (documentTokens) { return createTerms(documentTokens, ngram); });
        const vocabulary = Array.from(new Set([].concat.apply([], terms))).sort();
        const documentFrequency = vocabulary.map(function (term) {
            return terms.reduce(function (count, documentTerms) { return count + (documentTerms.includes(term) ? 1 : 0); }, 0);
        });
        const idf = documentFrequency.map(function (frequency) { return Math.log((1 + terms.length) / (1 + frequency)) + 1; });
        const vectors = terms.map(function (documentTerms) {
            return vocabulary.map(function (term, termIndex) {
                const count = documentTerms.reduce(function (total, current) { return total + (current === term ? 1 : 0); }, 0);
                if (representation === "binary") return count > 0 ? 1 : 0;
                if (representation === "count") return count;
                return documentTerms.length ? count / documentTerms.length * idf[termIndex] : 0;
            });
        });
        if (representation === "tfidf") {
            vectors.forEach(function (vector) {
                const magnitude = Math.sqrt(sum(vector.map(function (value) { return value * value; }))) || 1;
                vector.forEach(function (value, index) { vector[index] = value / magnitude; });
            });
        }
        return { corpus: corpus, tokens: tokens, terms: terms, vocabulary: vocabulary, documentFrequency: documentFrequency, idf: idf, vectors: vectors };
    }

    function initTokenLab() {
        const canvas = get("tokenCanvas");
        if (!canvas || canvas.dataset.cbActive) return;
        canvas.dataset.cbActive = "true";
        const corpusInput = get("nlpCorpus");
        const documentInput = get("nlpDocument");
        const normalizationInput = get("nlpNormalization");
        const representationInput = get("nlpRepresentation");
        const ngramInput = get("nlpNgram");
        const nextButton = get("tokenNext");
        const autoButton = get("tokenAuto");
        const pauseButton = get("tokenPause");
        const resetButton = get("tokenReset");
        const phaseNames = ["Normalized text", "Tokens", "Vocabulary", "Document vector", "Cosine comparison"];
        let step = 0;
        let timer = null;

        function data() {
            const space = buildDocumentSpace(corpusInput.value, normalizationInput.value, representationInput.value, ngramInput.value);
            const selected = clamp(Number(documentInput.value), 0, space.corpus.documents.length - 1);
            const similarities = space.vectors.map(function (vector, index) { return index === selected ? -1 : cosine(space.vectors[selected], vector); });
            const bestIndex = similarities.indexOf(Math.max.apply(null, similarities));
            const topTerms = space.vocabulary.map(function (term, index) { return { term: term, value: space.vectors[selected][index], idf: space.idf[index] }; }).filter(function (item) { return item.value > 0; }).sort(function (left, right) { return right.value - left.value || left.term.localeCompare(right.term); });
            return { space: space, selected: selected, similarities: similarities, bestIndex: bestIndex, topTerms: topTerms };
        }

        function stop() {
            if (timer !== null) window.clearInterval(timer);
            timer = null;
            pauseButton.disabled = true;
        }

        function drawChip(context, label, x, y, color, maximumX) {
            const width = Math.min(maximumX - x, Math.max(54, context.measureText(label).width + 22));
            roundRect(context, x, y, width, 30, 9);
            context.fillStyle = color;
            context.fill();
            context.fillStyle = "#061426";
            context.textAlign = "center";
            context.fillText(label, x + width / 2, y + 20);
            return width;
        }

        function draw() {
            const current = data();
            const prepared = prepareCanvas(canvas, 470, 570);
            const context = prepared.context;
            const width = prepared.width;
            const height = prepared.height;
            context.clearRect(0, 0, width, height);
            context.fillStyle = "#061426";
            context.fillRect(0, 0, width, height);
            context.fillStyle = "#61d7ff";
            context.font = "900 12px Arial";
            context.textAlign = "left";
            context.fillText("DOCUMENT " + (current.selected + 1) + " • " + current.space.corpus.name.toUpperCase(), 24, 30);
            context.fillStyle = "#c8d8e8";
            context.font = "600 15px Arial";
            const rawLines = wrapLines(context, current.space.corpus.documents[current.selected], width - 48).slice(0, 3);
            rawLines.forEach(function (line, index) { context.fillText(line, 24, 58 + index * 23); });
            context.strokeStyle = "#1f4667";
            context.beginPath();
            context.moveTo(24, 122);
            context.lineTo(width - 24, 122);
            context.stroke();

            if (step === 0) {
                context.fillStyle = "#facc15";
                context.font = "900 18px Arial";
                context.fillText("RAW LANGUAGE EVIDENCE", 24, 168);
                context.fillStyle = "#9ab7d1";
                context.font = "600 14px Arial";
                wrapLines(context, "Capitalization, punctuation and word order are still visible. Press Inspect Raw Document to start the transformation pipeline.", width - 48).forEach(function (line, index) { context.fillText(line, 24, 205 + index * 23); });
                ["TEXT", "?", "TOKENS", "?", "VECTOR", "?", "SIMILARITY"].forEach(function (label, index) {
                    const x = 24 + index * ((width - 48) / 7);
                    context.fillStyle = index % 2 ? "#facc15" : "#38bdf8";
                    context.font = index % 2 ? "900 17px Arial" : "900 10px Arial";
                    context.textAlign = "center";
                    context.fillText(label, x, height - 72);
                });
                context.textAlign = "left";
                return;
            }

            context.fillStyle = "#7dd3fc";
            context.font = "900 11px Arial";
            context.fillText(step >= 2 ? "TOKENS / N-GRAM TERMS" : "NORMALIZED TEXT", 24, 152);
            context.font = "800 12px Arial";
            if (step === 1) {
                context.fillStyle = "#e8f3ff";
                wrapLines(context, current.space.tokens[current.selected].join(" "), width - 48).forEach(function (line, index) { context.fillText(line, 24, 183 + index * 22); });
            } else {
                let chipX = 24;
                let chipY = 170;
                current.space.terms[current.selected].slice(0, 28).forEach(function (term, index) {
                    const estimate = Math.max(54, context.measureText(term).width + 22);
                    if (chipX + estimate > width - 24) { chipX = 24; chipY += 38; }
                    const chipWidth = drawChip(context, term, chipX, chipY, term.indexOf("_") >= 0 ? "#a78bfa" : "#38bdf8", width - 24);
                    chipX += chipWidth + 8;
                });
            }

            if (step >= 3) {
                const startY = width < 560 ? 300 : 278;
                context.fillStyle = "#7dd3fc";
                context.font = "900 11px Arial";
                context.textAlign = "left";
                context.fillText("FITTED VOCABULARY • " + current.space.vocabulary.length + " TERMS", 24, startY);
                context.fillStyle = "#8ba8c1";
                context.font = "600 11px Arial";
                wrapLines(context, current.space.vocabulary.slice(0, 24).join("  •  "), width - 48).slice(0, 3).forEach(function (line, index) { context.fillText(line, 24, startY + 24 + index * 18); });
            }

            if (step >= 4) {
                const startY = width < 560 ? 390 : 356;
                const available = Math.max(100, width - 186);
                const maximum = current.topTerms.length ? current.topTerms[0].value : 1;
                context.fillStyle = "#7dd3fc";
                context.font = "900 11px Arial";
                context.fillText(representationInput.options[representationInput.selectedIndex].text.toUpperCase() + " • NON-ZERO WEIGHTS", 24, startY);
                current.topTerms.slice(0, width < 560 ? 5 : 4).forEach(function (item, index) {
                    const y = startY + 25 + index * 25;
                    context.fillStyle = "#dbeafe";
                    context.font = "700 11px monospace";
                    context.textAlign = "right";
                    context.fillText(item.term, 132, y + 4);
                    context.fillStyle = "#17324c";
                    context.fillRect(145, y - 7, available, 13);
                    context.fillStyle = index === 0 ? "#facc15" : "#22d3ee";
                    context.fillRect(145, y - 7, available * item.value / (maximum || 1), 13);
                    context.fillStyle = "#e8f3ff";
                    context.textAlign = "left";
                    context.fillText(fixed(item.value, 3), 153 + available, y + 4);
                });
            }

            if (step >= 5) {
                const y = height - 48;
                context.fillStyle = "rgba(250,204,21,.1)";
                roundRect(context, 24, y - 28, width - 48, 48, 10);
                context.fill();
                context.fillStyle = "#facc15";
                context.font = "900 12px Arial";
                context.textAlign = "center";
                context.fillText("NEAREST: DOCUMENT " + (current.bestIndex + 1) + " • COSINE " + fixed(current.similarities[current.bestIndex], 3), width / 2, y + 2);
            }
        }

        function render() {
            const current = data();
            const complete = step >= phaseNames.length;
            const visiblePhase = step === 0 ? "Ready" : phaseNames[Math.min(step - 1, phaseNames.length - 1)];
            get("tokenPhase").textContent = complete ? "Complete" : visiblePhase;
            get("tokenDocumentValue").textContent = "D" + (current.selected + 1);
            get("tokenCount").textContent = step >= 2 ? current.space.terms[current.selected].length : "—";
            get("tokenVocabulary").textContent = step >= 3 ? current.space.vocabulary.length : "—";
            get("tokenSimilarity").textContent = step >= 5 ? fixed(current.similarities[current.bestIndex], 3) : "—";
            if (step === 0) {
                get("tokenVerdict").textContent = "The raw document is visible; its numerical representation has not been built.";
                get("tokenEquation").textContent = "raw text → ?";
                get("tokenExplanation").textContent = "Inspect capitalization, punctuation and repeated language before applying the selected normalization policy.";
                get("tokenEvidence").innerHTML = "<span>RAW EVIDENCE</span><strong>" + escapeHtml(current.space.corpus.documents[current.selected]) + "</strong>";
                get("tokenNextCheck").textContent = "Predict which surface forms will merge after normalization.";
            } else if (step === 1) {
                get("tokenVerdict").textContent = "Normalization has converted surface text into a consistent comparison form.";
                get("tokenEquation").textContent = "normalize(text) = " + current.space.tokens[current.selected].join(" ");
                get("tokenExplanation").textContent = "This policy changes the feature space. Removing or stemming a word is a modelling decision, not harmless formatting.";
                get("tokenEvidence").innerHTML = "<span>NORMALIZED TOKENS</span><strong>" + escapeHtml(current.space.tokens[current.selected].join(" • ")) + "</strong>";
                get("tokenNextCheck").textContent = "Predict how adding bigrams changes the number of terms.";
            } else if (step === 2) {
                get("tokenVerdict").textContent = "The document contains " + current.space.terms[current.selected].length + " selected terms.";
                get("tokenEquation").textContent = "terms = unigrams" + (Number(ngramInput.value) === 2 ? " ∪ adjacent bigrams" : "");
                get("tokenExplanation").textContent = "Bigrams retain limited local order, so phrases such as machine_learning become features instead of two independent words.";
                get("tokenEvidence").innerHTML = "<span>TERMS</span><strong>" + escapeHtml(current.space.terms[current.selected].join(" • ")) + "</strong>";
                get("tokenNextCheck").textContent = "Estimate how many unique terms occur across all four documents.";
            } else if (step === 3) {
                get("tokenVerdict").textContent = "The corpus vocabulary contains " + current.space.vocabulary.length + " unique terms.";
                get("tokenEquation").textContent = "V = sorted(unique(all training terms))";
                get("tokenExplanation").textContent = "Every vector coordinate now has a fixed meaning. A production vectorizer must reuse this fitted order at inference time.";
                get("tokenEvidence").innerHTML = "<span>VOCABULARY SAMPLE</span><strong>" + escapeHtml(current.space.vocabulary.slice(0, 18).join(" • ")) + "</strong>";
                get("tokenNextCheck").textContent = "Predict which selected-document term receives the largest weight.";
            } else if (step === 4) {
                const leader = current.topTerms[0] || { term: "none", value: 0 };
                get("tokenVerdict").textContent = leader.term + " has the largest selected-document weight.";
                get("tokenEquation").textContent = representationInput.value === "tfidf" ? "tf(t,d) × [log((1+N)/(1+df(t)))+1], then L2 normalize" : representationInput.value === "count" ? "x[t] = count(t in document)" : "x[t] = 1 when term occurs, otherwise 0";
                get("tokenExplanation").textContent = "The vector is sparse: only coordinates corresponding to observed terms are non-zero.";
                get("tokenEvidence").innerHTML = "<span>TOP WEIGHTS</span><strong>" + current.topTerms.slice(0, 6).map(function (item) { return escapeHtml(item.term) + "=" + fixed(item.value, 3); }).join(" • ") + "</strong>";
                get("tokenNextCheck").textContent = "Predict which other document points in the most similar direction.";
            } else {
                const best = current.bestIndex;
                get("tokenVerdict").textContent = "Document " + (best + 1) + " is nearest with cosine " + fixed(current.similarities[best], 3) + ".";
                get("tokenEquation").textContent = "cos(D" + (current.selected + 1) + ", D" + (best + 1) + ") = (x·y)/(‖x‖‖y‖) = " + fixed(current.similarities[best], 3);
                get("tokenExplanation").textContent = "Cosine compares vector direction, reducing the effect of document length while preserving term-overlap evidence.";
                get("tokenEvidence").innerHTML = "<span>ALL COMPARISONS</span><strong>" + current.similarities.map(function (value, index) { return index === current.selected ? "D" + (index + 1) + "=self" : "D" + (index + 1) + "=" + fixed(value, 3); }).join(" • ") + "</strong>";
                get("tokenNextCheck").textContent = "Change corpus or representation and explain why the nearest document changes.";
            }
            nextButton.textContent = complete ? "Pipeline Complete" : step === 0 ? "Inspect Raw Document" : "Build " + phaseNames[step];
            nextButton.disabled = complete;
            autoButton.disabled = complete || timer !== null;
            pauseButton.disabled = timer === null;
            if (complete) stop();
            draw();
        }

        function advance() { if (step < phaseNames.length) step += 1; render(); }
        function reset() { stop(); step = 0; render(); }
        nextButton.addEventListener("click", advance);
        autoButton.addEventListener("click", function () { if (timer !== null || nextButton.disabled) return; timer = window.setInterval(advance, 760); render(); });
        pauseButton.addEventListener("click", function () { stop(); render(); });
        resetButton.addEventListener("click", reset);
        [corpusInput, documentInput, normalizationInput, representationInput, ngramInput].forEach(function (input) { input.addEventListener("change", reset); });
        window.addEventListener("resize", draw);
        render();
        window.requestAnimationFrame(draw);
    }

    const SEMANTIC_CORPORA = {
        careers: {
            name: "Technology careers",
            target: "python",
            sentences: [
                "python developer builds data tools",
                "python engineer trains machine models",
                "software developer writes reliable code",
                "data engineer builds reliable pipelines",
                "machine learning models support predictions",
                "developer and engineer review code"
            ]
        },
        animals: {
            name: "Animals and habitats",
            target: "tiger",
            sentences: [
                "tiger hunts inside dense forest",
                "leopard hunts across forest habitat",
                "lion protects a wide grassland territory",
                "cheetah runs across open grassland",
                "forest habitat shelters tiger and leopard",
                "lion and tiger are powerful predators"
            ]
        },
        emotions: {
            name: "Emotions and reactions",
            target: "happy",
            sentences: [
                "happy people smile after good news",
                "joyful friends smile during celebrations",
                "sad people cry after difficult news",
                "angry customers react to unfair service",
                "happy and joyful feelings improve energy",
                "sad and angry feelings need support"
            ]
        },
        commerce: {
            name: "Products and customers",
            target: "phone",
            sentences: [
                "customer buys a phone after comparing price",
                "buyer reviews laptop price and quality",
                "phone customer values battery and camera",
                "laptop buyer values speed and battery",
                "store recommends products from customer history",
                "quality service improves buyer loyalty"
            ]
        }
    };

    function buildSemanticSpace(corpusKey, radius, weighting) {
        const corpus = SEMANTIC_CORPORA[corpusKey] || SEMANTIC_CORPORA.careers;
        const sentences = corpus.sentences.map(function (sentence) { return normalizeText(sentence, "stop"); });
        const vocabulary = Array.from(new Set([].concat.apply([], sentences))).sort();
        const indexByWord = {};
        vocabulary.forEach(function (word, index) { indexByWord[word] = index; });
        const matrix = vocabulary.map(function () { return vocabulary.map(function () { return 0; }); });
        const pairs = [];
        sentences.forEach(function (tokens, sentenceIndex) {
            tokens.forEach(function (centre, centreIndex) {
                const from = Math.max(0, centreIndex - radius);
                const to = Math.min(tokens.length - 1, centreIndex + radius);
                for (let contextIndex = from; contextIndex <= to; contextIndex += 1) {
                    if (contextIndex === centreIndex) continue;
                    const contextWord = tokens[contextIndex];
                    matrix[indexByWord[centre]][indexByWord[contextWord]] += 1;
                    pairs.push({ centre: centre, context: contextWord, sentence: sentenceIndex });
                }
            });
        });
        const weighted = matrix.map(function (row) { return row.slice(); });
        if (weighting === "ppmi") {
            const total = sum(matrix.map(sum));
            const rowTotals = matrix.map(sum);
            const columnTotals = vocabulary.map(function (_, columnIndex) { return sum(matrix.map(function (row) { return row[columnIndex]; })); });
            matrix.forEach(function (row, rowIndex) {
                row.forEach(function (count, columnIndex) {
                    if (!count || !rowTotals[rowIndex] || !columnTotals[columnIndex]) weighted[rowIndex][columnIndex] = 0;
                    else weighted[rowIndex][columnIndex] = Math.max(0, Math.log2(count * total / (rowTotals[rowIndex] * columnTotals[columnIndex])));
                });
            });
        }
        return { corpus: corpus, sentences: sentences, vocabulary: vocabulary, indexByWord: indexByWord, matrix: matrix, weighted: weighted, pairs: pairs };
    }

    function initSemanticLab() {
        const canvas = get("semanticCanvas");
        if (!canvas || canvas.dataset.cbActive) return;
        canvas.dataset.cbActive = "true";
        const corpusInput = get("semanticCorpus");
        const targetInput = get("semanticTarget");
        const windowInput = get("semanticWindow");
        const weightingInput = get("semanticWeighting");
        const nextButton = get("semanticNext");
        const autoButton = get("semanticAuto");
        const pauseButton = get("semanticPause");
        const resetButton = get("semanticReset");
        const phases = ["Read corpus", "Generate context pairs", "Build matrix", "Apply weighting", "Measure similarities"];
        let step = 0;
        let timer = null;

        function availableTargets(corpusKey) {
            const corpus = SEMANTIC_CORPORA[corpusKey] || SEMANTIC_CORPORA.careers;
            const frequency = {};
            corpus.sentences.forEach(function (sentence) { normalizeText(sentence, "stop").forEach(function (word) { frequency[word] = (frequency[word] || 0) + 1; }); });
            return Object.keys(frequency).sort(function (left, right) { return frequency[right] - frequency[left] || left.localeCompare(right); }).slice(0, 8);
        }

        function populateTargets(preferred) {
            const corpus = SEMANTIC_CORPORA[corpusInput.value] || SEMANTIC_CORPORA.careers;
            const targets = availableTargets(corpusInput.value);
            const selected = targets.includes(preferred) ? preferred : corpus.target;
            targetInput.innerHTML = targets.map(function (word) { return '<option value="' + escapeHtml(word) + '"' + (word === selected ? " selected" : "") + ">" + escapeHtml(word) + "</option>"; }).join("");
        }

        function data() {
            const space = buildSemanticSpace(corpusInput.value, Number(windowInput.value), weightingInput.value);
            let target = targetInput.value;
            if (space.indexByWord[target] === undefined) target = space.corpus.target;
            const targetIndex = space.indexByWord[target];
            const targetVector = space.weighted[targetIndex] || [];
            const similarities = space.vocabulary.map(function (word, index) { return { word: word, index: index, similarity: index === targetIndex ? -1 : cosine(targetVector, space.weighted[index]) }; }).filter(function (item) { return item.index !== targetIndex; }).sort(function (left, right) { return right.similarity - left.similarity || left.word.localeCompare(right.word); });
            const targetPairs = space.pairs.filter(function (pair) { return pair.centre === target; });
            const contexts = {};
            targetPairs.forEach(function (pair) { contexts[pair.context] = (contexts[pair.context] || 0) + 1; });
            const contextList = Object.keys(contexts).map(function (word) { return { word: word, count: contexts[word], value: space.weighted[targetIndex][space.indexByWord[word]] }; }).sort(function (left, right) { return right.value - left.value || right.count - left.count || left.word.localeCompare(right.word); });
            return { space: space, target: target, targetIndex: targetIndex, targetVector: targetVector, similarities: similarities, targetPairs: targetPairs, contextList: contextList };
        }

        function stop() {
            if (timer !== null) window.clearInterval(timer);
            timer = null;
            pauseButton.disabled = true;
        }

        function drawCorpus(context, current, width) {
            context.fillStyle = "#61d7ff";
            context.font = "900 12px Arial";
            context.textAlign = "left";
            context.fillText("MINI-CORPUS • " + current.space.corpus.name.toUpperCase(), 24, 31);
            const columns = width < 560 ? 1 : 2;
            const gap = 12;
            const cardWidth = (width - 48 - gap * (columns - 1)) / columns;
            current.space.corpus.sentences.forEach(function (sentence, index) {
                const row = Math.floor(index / columns);
                const column = index % columns;
                const x = 24 + column * (cardWidth + gap);
                const y = 52 + row * 64;
                roundRect(context, x, y, cardWidth, 50, 9);
                context.fillStyle = "#0d233a";
                context.fill();
                context.strokeStyle = "#244e70";
                context.stroke();
                context.fillStyle = "#dcecff";
                context.font = "600 11px Arial";
                wrapLines(context, (index + 1) + ". " + sentence, cardWidth - 20).slice(0, 2).forEach(function (line, lineIndex) { context.fillText(line, x + 10, y + 19 + lineIndex * 17); });
            });
        }

        function draw() {
            const current = data();
            const prepared = prepareCanvas(canvas, 500, 630);
            const context = prepared.context;
            const width = prepared.width;
            const height = prepared.height;
            context.clearRect(0, 0, width, height);
            context.fillStyle = "#061426";
            context.fillRect(0, 0, width, height);
            if (step === 0 || step === 1) {
                drawCorpus(context, current, width);
                context.fillStyle = step === 0 ? "#facc15" : "#7dd3fc";
                context.font = "900 13px Arial";
                context.textAlign = "center";
                context.fillText(step === 0 ? "RAW SENTENCES ARE VISIBLE • PRESS READ CORPUS" : "TARGET WORD: " + current.target.toUpperCase(), width / 2, height - 35);
                return;
            }

            context.fillStyle = "#61d7ff";
            context.font = "900 12px Arial";
            context.textAlign = "left";
            context.fillText("CONTEXT WINDOW • RADIUS " + windowInput.value, 24, 30);
            const sample = current.space.sentences.find(function (sentence) { return sentence.includes(current.target); }) || current.space.sentences[0];
            let x = 24;
            sample.forEach(function (word) {
                const labelWidth = Math.max(50, context.measureText(word).width + 20);
                if (x + labelWidth < width - 24) {
                    roundRect(context, x, 49, labelWidth, 32, 8);
                    context.fillStyle = word === current.target ? "#facc15" : current.targetPairs.some(function (pair) { return pair.context === word; }) ? "#38bdf8" : "#17324c";
                    context.fill();
                    context.fillStyle = word === current.target || current.targetPairs.some(function (pair) { return pair.context === word; }) ? "#061426" : "#b5cae0";
                    context.font = "800 11px Arial";
                    context.textAlign = "center";
                    context.fillText(word, x + labelWidth / 2, 70);
                    x += labelWidth + 7;
                }
            });

            if (step >= 3) {
                const topContexts = current.contextList.slice(0, 6);
                const chartY = 120;
                context.fillStyle = "#7dd3fc";
                context.font = "900 11px Arial";
                context.textAlign = "left";
                context.fillText((weightingInput.value === "ppmi" ? "PPMI" : "COUNT") + " TARGET VECTOR", 24, chartY);
                const maximum = topContexts.length ? Math.max.apply(null, topContexts.map(function (item) { return item.value; })) : 1;
                topContexts.forEach(function (item, index) {
                    const y = chartY + 25 + index * 27;
                    context.fillStyle = "#dcecff";
                    context.font = "700 11px monospace";
                    context.textAlign = "right";
                    context.fillText(item.word, 118, y + 4);
                    context.fillStyle = "#17324c";
                    context.fillRect(130, y - 7, Math.max(80, width * 0.31), 13);
                    context.fillStyle = index === 0 ? "#facc15" : "#22d3ee";
                    context.fillRect(130, y - 7, Math.max(80, width * 0.31) * item.value / (maximum || 1), 13);
                    context.fillStyle = "#dcecff";
                    context.textAlign = "left";
                    context.fillText(fixed(item.value, 2), 140 + Math.max(80, width * 0.31), y + 4);
                });
            }

            if (step >= 5) {
                const centreX = width < 560 ? width / 2 : width * 0.72;
                const centreY = width < 560 ? 455 : 245;
                const maximumRadius = width < 560 ? Math.min(145, width * 0.34) : Math.min(155, width * 0.21);
                context.strokeStyle = "#244e70";
                context.setLineDash([5, 5]);
                [0.33, 0.66, 1].forEach(function (scale) { context.beginPath(); context.arc(centreX, centreY, maximumRadius * scale, 0, Math.PI * 2); context.stroke(); });
                context.setLineDash([]);
                roundRect(context, centreX - 43, centreY - 20, 86, 40, 11);
                context.fillStyle = "#facc15";
                context.fill();
                context.fillStyle = "#061426";
                context.font = "900 12px Arial";
                context.textAlign = "center";
                context.fillText(current.target, centreX, centreY + 4);
                current.similarities.slice(0, 7).forEach(function (item, index) {
                    const angle = -Math.PI / 2 + index * (Math.PI * 2 / 7);
                    const similarity = clamp(item.similarity, 0, 1);
                    const radius = 45 + (1 - similarity) * (maximumRadius - 45);
                    const nodeX = centreX + Math.cos(angle) * radius;
                    const nodeY = centreY + Math.sin(angle) * radius;
                    context.strokeStyle = index === 0 ? "#facc15" : "#2b698e";
                    context.lineWidth = index === 0 ? 2.5 : 1.2;
                    context.beginPath();
                    context.moveTo(centreX, centreY);
                    context.lineTo(nodeX, nodeY);
                    context.stroke();
                    roundRect(context, nodeX - 34, nodeY - 15, 68, 30, 8);
                    context.fillStyle = index === 0 ? "#a78bfa" : "#0d2a43";
                    context.fill();
                    context.strokeStyle = index === 0 ? "#c4b5fd" : "#38bdf8";
                    context.stroke();
                    context.fillStyle = "#f8fafc";
                    context.font = "800 10px Arial";
                    context.fillText(item.word, nodeX, nodeY - 1);
                    context.fillStyle = "#b9d6ee";
                    context.font = "700 9px Arial";
                    context.fillText(fixed(item.similarity, 2), nodeX, nodeY + 11);
                });
            } else {
                context.fillStyle = "#8ba8c1";
                context.font = "700 12px Arial";
                context.textAlign = "center";
                context.fillText(step === 2 ? current.targetPairs.length + " DIRECTED TARGET–CONTEXT LINKS GENERATED" : "WORD × CONTEXT MATRIX: " + current.space.vocabulary.length + " × " + current.space.vocabulary.length, width / 2, height - 34);
            }
        }

        function render() {
            const current = data();
            const complete = step >= phases.length;
            const best = current.similarities[0] || { word: "none", similarity: 0 };
            get("semanticWindowValue").textContent = windowInput.value + (windowInput.value === "1" ? " token" : " tokens");
            get("semanticPhase").textContent = complete ? "Complete" : step === 0 ? "Ready" : phases[step - 1];
            get("semanticTargetValue").textContent = current.target;
            get("semanticContexts").textContent = step >= 2 ? current.targetPairs.length : "—";
            get("semanticBestNeighbor").textContent = step >= 5 ? best.word : "—";
            get("semanticSimilarity").textContent = step >= 5 ? fixed(best.similarity, 3) : "—";
            if (step === 0) {
                get("semanticVerdict").textContent = "The mini-corpus is visible; no distributional meaning has been calculated.";
                get("semanticEquation").textContent = "meaning(word) ≈ contexts(word)";
                get("semanticExplanation").textContent = "Read where the target appears and predict which words occur in similar neighbourhoods.";
                get("semanticNeighbors").innerHTML = "<span>CORPUS EVIDENCE</span><strong>" + current.space.corpus.sentences.length + " sentences • " + current.space.vocabulary.length + " unique content words</strong>";
                get("semanticNextCheck").textContent = "Predict which target contexts fall inside the selected radius.";
            } else if (step === 1) {
                get("semanticVerdict").textContent = "The target is “" + current.target + "”; context radius is " + windowInput.value + ".";
                get("semanticEquation").textContent = "context positions = [i−" + windowInput.value + ", i+" + windowInput.value + "] excluding i";
                get("semanticExplanation").textContent = "Window size defines the linguistic signal: smaller windows emphasize local syntax; wider windows capture broader topic association.";
                get("semanticNeighbors").innerHTML = "<span>TARGET OCCURRENCES</span><strong>" + current.space.sentences.reduce(function (count, sentence) { return count + sentence.filter(function (word) { return word === current.target; }).length; }, 0) + " occurrence(s)</strong>";
                get("semanticNextCheck").textContent = "Predict the most frequent target–context pair.";
            } else if (step === 2) {
                const frequent = current.contextList.slice().sort(function (left, right) { return right.count - left.count; })[0] || { word: "none", count: 0 };
                get("semanticVerdict").textContent = current.targetPairs.length + " directed context links were generated for “" + current.target + "”.";
                get("semanticEquation").textContent = "C[" + current.target + ", " + frequent.word + "] = " + frequent.count;
                get("semanticExplanation").textContent = "Each context occurrence increments a cell; repeated co-occurrence produces a stronger raw count.";
                get("semanticNeighbors").innerHTML = "<span>CONTEXT COUNTS</span><strong>" + current.contextList.map(function (item) { return escapeHtml(item.word) + "=" + item.count; }).join(" • ") + "</strong>";
                get("semanticNextCheck").textContent = "Predict the dimensions of the word–context matrix.";
            } else if (step === 3) {
                get("semanticVerdict").textContent = "A " + current.space.vocabulary.length + " × " + current.space.vocabulary.length + " co-occurrence matrix is ready.";
                get("semanticEquation").textContent = "C ∈ ℝ^" + current.space.vocabulary.length + "×" + current.space.vocabulary.length;
                get("semanticExplanation").textContent = "Every row represents a centre word; every column represents a context word in the fitted vocabulary.";
                get("semanticNeighbors").innerHTML = "<span>NON-ZERO TARGET CELLS</span><strong>" + current.contextList.length + " of " + current.space.vocabulary.length + " coordinates</strong>";
                get("semanticNextCheck").textContent = weightingInput.value === "ppmi" ? "Predict which common contexts PPMI will downweight." : "Predict which repeated context will dominate count weighting.";
            } else if (step === 4) {
                const leader = current.contextList[0] || { word: "none", value: 0 };
                get("semanticVerdict").textContent = weightingInput.value === "ppmi" ? "PPMI has emphasized informative target–context associations." : "Raw co-occurrence counts retain frequency as the signal.";
                get("semanticEquation").textContent = weightingInput.value === "ppmi" ? "PPMI(w,c) = max(0, log₂[P(w,c)/(P(w)P(c))])" : "vector[" + leader.word + "] = count = " + fixed(leader.value, 0);
                get("semanticExplanation").textContent = weightingInput.value === "ppmi" ? "PPMI compares observed co-occurrence with chance expectation, making unexpectedly strong associations more visible." : "Count vectors are direct and interpretable but can be dominated by very frequent contexts.";
                get("semanticNeighbors").innerHTML = "<span>STRONGEST DIMENSIONS</span><strong>" + current.contextList.slice(0, 5).map(function (item) { return escapeHtml(item.word) + "=" + fixed(item.value, 2); }).join(" • ") + "</strong>";
                get("semanticNextCheck").textContent = "Predict which other word vector has the smallest cosine angle.";
            } else {
                get("semanticVerdict").textContent = "“" + best.word + "” is the nearest distributional neighbour of “" + current.target + "”.";
                get("semanticEquation").textContent = "cos(" + current.target + ", " + best.word + ") = " + fixed(best.similarity, 3);
                get("semanticExplanation").textContent = "The result describes similarity inside this mini-corpus; it is learned from shared context, not from a dictionary definition.";
                get("semanticNeighbors").innerHTML = "<span>NEAREST WORDS</span><strong>" + current.similarities.slice(0, 6).map(function (item) { return escapeHtml(item.word) + " " + fixed(item.similarity, 3); }).join(" • ") + "</strong>";
                get("semanticNextCheck").textContent = "Change the domain, target, window or weighting and explain how the geometry moves.";
            }
            nextButton.textContent = complete ? "Geometry Complete" : step === 0 ? "Read Corpus" : phases[step];
            nextButton.disabled = complete;
            autoButton.disabled = complete || timer !== null;
            pauseButton.disabled = timer === null;
            if (complete) stop();
            draw();
        }

        function advance() { if (step < phases.length) step += 1; render(); }
        function reset() { stop(); step = 0; render(); }
        nextButton.addEventListener("click", advance);
        autoButton.addEventListener("click", function () { if (timer !== null || nextButton.disabled) return; timer = window.setInterval(advance, 780); render(); });
        pauseButton.addEventListener("click", function () { stop(); render(); });
        resetButton.addEventListener("click", reset);
        corpusInput.addEventListener("change", function () { populateTargets(SEMANTIC_CORPORA[corpusInput.value].target); reset(); });
        targetInput.addEventListener("change", reset);
        weightingInput.addEventListener("change", reset);
        windowInput.addEventListener("input", reset);
        window.addEventListener("resize", draw);
        populateTargets(SEMANTIC_CORPORA[corpusInput.value].target);
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
            "documents = ['good clear course', 'good practical lessons',",
            "             'bad confusing course', 'bad slow lessons']",
            "labels = ['positive', 'positive', 'negative', 'negative']",
            "classes = ['positive', 'negative']",
            "vocabulary = sorted(set(' '.join(documents).split()))",
            "word_counts, class_docs = {}, {}",
            "for label in classes:",
            "    word_counts[label], class_docs[label] = {}, 0",
            "    for document, target in zip(documents, labels):",
            "        if target == label:",
            "            class_docs[label] += 1",
            "            for token in document.split():",
            "                old = word_counts[label].get(token, 0)",
            "                word_counts[label][token] = old + 1",
            "query = 'clear practical'",
            "scores = {}",
            "for label in classes:",
            "    score = log(class_docs[label] / len(documents))",
            "    total = sum(word_counts[label].values())",
            "    for token in query.split():",
            "        count = word_counts[label].get(token, 0)",
            "        score += log((count + 1) / (total + len(vocabulary)))",
            "    scores[label] = score",
            "prediction = max(scores, key=scores.get)",
            "print(prediction, scores)"
        ];

        function clone(value) { return JSON.parse(JSON.stringify(value)); }
        function addState(states, line, explanation, variables, expression, output) {
            states.push({ line: line, explanation: explanation, variables: clone(variables || {}), expression: expression || "—", output: output || "" });
        }

        function buildStates() {
            const states = [];
            const documents = ["good clear course", "good practical lessons", "bad confusing course", "bad slow lessons"];
            const labels = ["positive", "positive", "negative", "negative"];
            const classes = ["positive", "negative"];
            const vocabulary = Array.from(new Set(documents.join(" ").split(" "))).sort();
            const wordCounts = {};
            const classDocs = {};
            addState(states, 0, "Create four normalized training documents.", { documents: documents }, "len(documents) = 4");
            addState(states, 1, "The second source line completes the document list.", { documents: documents }, "documents[3] = 'bad slow lessons'");
            addState(states, 2, "Assign one sentiment label to every training document.", { labels: labels }, "len(labels) = len(documents)");
            addState(states, 3, "Define the two classes that the classifier can predict.", { classes: classes }, "classes = positive, negative");
            addState(states, 4, "Join the training text, split it and retain every unique sorted token.", { vocabulary: vocabulary, vocabulary_size: vocabulary.length }, "V = {" + vocabulary.join(", ") + "}");
            addState(states, 5, "Create dictionaries for token counts and class-document counts.", { word_counts: wordCounts, class_docs: classDocs }, "{}, {}");
            classes.forEach(function (label) {
                addState(states, 6, "Enter the outer training loop for class “" + label + "”.", { label: label, word_counts: wordCounts, class_docs: classDocs }, "label = '" + label + "'");
                wordCounts[label] = {};
                classDocs[label] = 0;
                addState(states, 7, "Initialize independent counts for the current class.", { label: label, class_word_counts: wordCounts[label], class_document_count: classDocs[label] }, "word_counts['" + label + "'] = {}; class_docs['" + label + "'] = 0");
                documents.forEach(function (document, documentIndex) {
                    const target = labels[documentIndex];
                    addState(states, 8, "Visit training document " + (documentIndex + 1) + " while the outer class remains “" + label + "”.", { label: label, document: document, target: target }, "zip → ('" + document + "', '" + target + "')");
                    addState(states, 9, target === label ? "The document belongs to the current class, so its evidence is counted." : "The label does not match; skip this document for the current class.", { label: label, target: target, matches: target === label }, "'" + target + "' == '" + label + "' → " + String(target === label));
                    if (target === label) {
                        classDocs[label] += 1;
                        addState(states, 10, "Increment the number of training documents in class “" + label + "”.", { label: label, class_document_count: classDocs[label] }, "class_docs['" + label + "'] += 1 → " + classDocs[label]);
                        document.split(" ").forEach(function (token) {
                            addState(states, 11, "Enter the token loop for “" + token + "”.", { label: label, document: document, token: token }, "document.split() → token = '" + token + "'");
                            const old = wordCounts[label][token] || 0;
                            addState(states, 12, "Read the earlier class-specific count for “" + token + "”.", { label: label, token: token, old: old }, "get('" + token + "', 0) = " + old);
                            wordCounts[label][token] = old + 1;
                            addState(states, 13, "Store the incremented token count.", { label: label, token: token, new_count: wordCounts[label][token], class_word_counts: wordCounts[label] }, old + " + 1 = " + wordCounts[label][token]);
                        });
                    }
                });
            });
            const query = "clear practical";
            const scores = {};
            addState(states, 14, "Create the normalized query to classify.", { query: query, query_tokens: query.split(" ") }, "query.split() = ['clear', 'practical']");
            addState(states, 15, "Create an empty dictionary for class log scores.", { scores: scores }, "scores = {}");
            classes.forEach(function (label) {
                addState(states, 16, "Enter the prediction loop for class “" + label + "”.", { label: label, scores: scores }, "label = '" + label + "'");
                let score = Math.log(classDocs[label] / documents.length);
                addState(states, 17, "Start with the log prior for “" + label + "”.", { label: label, class_docs: classDocs[label], score: score }, "log(" + classDocs[label] + "/" + documents.length + ") = " + fixed(score, 4));
                const total = sum(Object.keys(wordCounts[label]).map(function (token) { return wordCounts[label][token]; }));
                addState(states, 18, "Count all token occurrences learned for this class.", { label: label, total_tokens: total }, "sum(counts) = " + total);
                query.split(" ").forEach(function (token) {
                    addState(states, 19, "Enter the query-token loop for “" + token + "”.", { label: label, token: token, score_before: score }, "token = '" + token + "'");
                    const count = wordCounts[label][token] || 0;
                    addState(states, 20, "Read how often “" + token + "” occurred in the current class.", { label: label, token: token, count: count }, "get('" + token + "', 0) = " + count);
                    const probability = (count + 1) / (total + vocabulary.length);
                    score += Math.log(probability);
                    addState(states, 21, "Apply Laplace smoothing and add the token log likelihood.", { label: label, token: token, smoothed_probability: probability, score: score }, "score += log((" + count + "+1)/(" + total + "+" + vocabulary.length + ")) → " + fixed(score, 4));
                });
                scores[label] = score;
                addState(states, 22, "Save the completed class log score.", { label: label, scores: scores }, "scores['" + label + "'] = " + fixed(score, 4));
            });
            const prediction = Object.keys(scores).sort(function (left, right) { return scores[right] - scores[left]; })[0];
            addState(states, 23, "Choose the class with the greatest log score.", { scores: scores, prediction: prediction }, "argmax(scores) = '" + prediction + "'");
            addState(states, 24, "Print the prediction and both auditable class scores.", { prediction: prediction, scores: scores }, "print(prediction, scores)", prediction + " " + JSON.stringify(Object.fromEntries(Object.keys(scores).map(function (key) { return [key, Number(fixed(scores[key], 4))]; }))));
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
        function formatValue(value) {
            if (typeof value === "number") return Number.isInteger(value) ? String(value) : fixed(value, 4);
            return JSON.stringify(value);
        }
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
        auto.addEventListener("click", function () { if (step >= states.length || timer !== null) return; timer = window.setInterval(advance, 230); render(); });
        pause.addEventListener("click", function () { stop(); render(); });
        reset.addEventListener("click", function () { stop(); step = 0; render(); });
        render();
    }

    function initProblems() {
        const list = get("problemList");
        if (!list || list.dataset.cbActive) return;
        list.dataset.cbActive = "true";
        const problems = [
            { title: "Build a Token Frequency Table", description: "Normalize a sentence and count every token without external libraries.", sampleInput: "Text models learn from text models", expected: "text=2, models=2, learn=1, from=1", hint: "Lowercase, split and update a dictionary with get(token, 0) + 1.", starter: "text = 'Text models learn from text models'\n# Normalize and count every token\n", solution: "text = 'Text models learn from text models'\ncounts = {}\nfor token in text.lower().split():\n    counts[token] = counts.get(token, 0) + 1\nprint(counts)", required: [["lower("], ["split("], ["for"], ["get("], ["+ 1", "+1"], ["print("]] },
            { title: "Generate Adjacent Bigrams", description: "Create every ordered two-token feature from a sentence.", sampleInput: "machine learning builds systems", expected: "machine_learning, learning_builds, builds_systems", hint: "Pair tokens at index i and i+1 while i is smaller than len(tokens)-1.", starter: "text = 'machine learning builds systems'\ntokens = text.split()\n# Create adjacent bigrams\n", solution: "text = 'machine learning builds systems'\ntokens = text.split()\nbigrams = []\nfor index in range(len(tokens) - 1):\n    bigrams.append(tokens[index] + '_' + tokens[index + 1])\nprint(bigrams)", required: [["range("], ["len(tokens)"], ["- 1", "-1"], ["index + 1", "index+1"], ["append("], ["print("]] },
            { title: "Calculate Smoothed IDF", description: "Compute smoothed inverse document frequency for one term.", sampleInput: "N=4, document_frequency=2", expected: "idf≈1.511", hint: "Use log((1 + N) / (1 + df)) + 1.", starter: "import math\ndocuments = 4\ndocument_frequency = 2\n# Calculate smoothed IDF\n", solution: "import math\ndocuments = 4\ndocument_frequency = 2\nidf = math.log((1 + documents) / (1 + document_frequency)) + 1\nprint(round(idf, 3))", required: [["math.log("], ["1 + documents", "1+documents"], ["1 + document_frequency", "1+document_frequency"], ["+ 1", "+1"], ["print("]] },
            { title: "Calculate Sparse Cosine Similarity", description: "Measure the angle between two document vectors from first principles.", sampleInput: "a=[1,1,0], b=[1,0,1]", expected: "cosine=0.5", hint: "Calculate dot product and both square-root magnitudes, then divide.", starter: "a = [1, 1, 0]\nb = [1, 0, 1]\n# Calculate cosine similarity without libraries\n", solution: "a = [1, 1, 0]\nb = [1, 0, 1]\ndot = 0\na_sq = 0\nb_sq = 0\nfor left, right in zip(a, b):\n    dot += left * right\n    a_sq += left ** 2\n    b_sq += right ** 2\ncosine = dot / ((a_sq ** 0.5) * (b_sq ** 0.5))\nprint(round(cosine, 3))", required: [["zip("], ["dot"], ["** 2", "**2"], ["** 0.5", "**0.5"], ["cosine"], ["print("]] },
            { title: "Predict with Multinomial Naive Bayes", description: "Use class token counts, Laplace smoothing and log probabilities to classify a query.", sampleInput: "query='clear practical'", expected: "positive", hint: "Begin with each class log prior, then add log((count+1)/(total+V)) for each query token.", starter: "import math\nquery = ['clear', 'practical']\ncounts = {\n    'positive': {'clear': 1, 'practical': 1, 'good': 2},\n    'negative': {'bad': 2, 'confusing': 1, 'slow': 1}\n}\npriors = {'positive': 0.5, 'negative': 0.5}\nvocabulary_size = 6\n# Calculate both log scores and predict\n", solution: "import math\nquery = ['clear', 'practical']\ncounts = {'positive': {'clear': 1, 'practical': 1, 'good': 2}, 'negative': {'bad': 2, 'confusing': 1, 'slow': 1}}\npriors = {'positive': 0.5, 'negative': 0.5}\nvocabulary_size = 6\nscores = {}\nfor label in counts:\n    total = sum(counts[label].values())\n    score = math.log(priors[label])\n    for token in query:\n        count = counts[label].get(token, 0)\n        score += math.log((count + 1) / (total + vocabulary_size))\n    scores[label] = score\nprediction = max(scores, key=scores.get)\nprint(prediction, scores)", required: [["for label"], ["sum("], ["math.log("], ["get("], ["count + 1", "count+1"], ["vocabulary_size"], ["max("], ["print("]] }
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
                if (missing.length) { result.className = "aiml-check-result error"; result.textContent = "Not complete yet. Recheck the required NLP logic."; return; }
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
            ["Why can aggressive text normalization reduce accuracy?", ["It may delete task-relevant capitalization, punctuation or word form", "It always increases vocabulary size", "It disables every classifier", "It adds future labels"], 0, "Normalization changes available evidence. Sentiment punctuation, named-entity capitalization and morphological distinctions can be predictive."],
            ["What information does a bag-of-words vector discard?", ["Most word order beyond term counts", "All token frequencies", "The vocabulary coordinates", "The number of documents"], 0, "Bag of words retains term presence or frequency but does not represent the normal order of those terms."],
            ["Why does TF-IDF downweight a token found in nearly every document?", ["It offers little evidence for distinguishing documents", "It is always misspelled", "It must be a label", "It has a negative count"], 0, "A term with high document frequency has lower inverse document frequency because it is less discriminative inside the corpus."],
            ["What does cosine similarity compare?", ["The angle between vector directions", "Only the longest document", "The alphabetical order of tokens", "The number of classes"], 0, "Cosine similarity divides the dot product by both vector magnitudes, measuring directional alignment."],
            ["Why are log probabilities used in Multinomial Naive Bayes?", ["Products become sums and numerical underflow is reduced", "They remove the need for token counts", "They guarantee perfect independence", "They create embeddings automatically"], 0, "Many small likelihoods multiply to an extremely small number. Logs convert multiplication into stable addition."],
            ["What does the Naive Bayes independence assumption state?", ["Features are conditionally independent given the class", "Documents are always identical", "All class priors are zero", "Tokenization is unnecessary"], 0, "The model factors the class-conditional joint likelihood into individual feature likelihoods, even though language features are not truly independent."],
            ["What is the distributional idea behind word embeddings?", ["Words appearing in similar contexts tend to have related representations", "Every word must have a one-hot label", "Meaning equals word length", "Only syntax can be represented"], 0, "Co-occurrence-based and predictive embeddings derive similarity from patterns of context usage."],
            ["Why is a subword tokenizer useful?", ["It composes rare and unseen words from reusable pieces", "It removes every spelling variation", "It guarantees one token per sentence", "It requires no vocabulary"], 0, "Subwords balance word-level meaning with character-level coverage and reduce unknown-word failures."],
            ["Which metric is most informative for imbalanced multi-class intent classification?", ["Macro F1 together with per-class precision and recall", "Accuracy alone", "Mean squared error only", "BLEU alone"], 0, "Macro F1 gives each class equal influence, while per-class metrics reveal which rare intents are being missed."],
            ["Which practice prevents text-vectorization leakage?", ["Fit vocabulary and IDF only on each training fold", "Fit IDF on the full dataset before splitting", "Copy validation labels into text", "Randomly duplicate documents across splits"], 0, "The vectorizer learns corpus statistics, so it belongs inside the training pipeline and must not inspect validation text during fitting."]
        ];
        container.innerHTML = questions.map(function (item, questionIndex) {
            return '<article class="aiml-quiz-question" data-quiz-question="' + questionIndex + '"><strong>' + (questionIndex + 1) + ". " + escapeHtml(item[0]) + '</strong><div class="aiml-quiz-options">' + item[1].map(function (option, optionIndex) {
                const id = "quiz-twenty-" + questionIndex + "-" + optionIndex;
                return '<label class="aiml-quiz-option" for="' + id + '"><input type="radio" id="' + id + '" name="quiz-twenty-' + questionIndex + '" value="' + optionIndex + '"><span>' + String.fromCharCode(65 + optionIndex) + ". " + escapeHtml(option) + "</span></label>";
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
                const selected = question.querySelector('input[type="radio"]:checked');
                const options = Array.from(question.querySelectorAll(".aiml-quiz-option"));
                const explanation = question.querySelector(".aiml-quiz-explanation");
                options.forEach(function (option, optionIndex) { option.classList.remove("is-correct", "is-wrong"); if (optionIndex === item[2]) option.classList.add("is-correct"); });
                if (selected) { answered += 1; if (Number(selected.value) === item[2]) correct += 1; else options[Number(selected.value)].classList.add("is-wrong"); }
                explanation.hidden = false;
                explanation.innerHTML = '<strong>Your answer: ' + (selected ? escapeHtml(item[1][Number(selected.value)]) : "Not attempted") + '</strong><br><strong>Correct answer: ' + escapeHtml(item[1][item[2]]) + "</strong><br>" + escapeHtml(item[3]);
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
            ["What is an NLP system?", "It is a pipeline that defines a language task, converts human language into machine-readable representations, learns or applies decision rules, and evaluates outputs against task and human-impact criteria. The data contract, tokenizer, representation and evaluation unit are as important as the model."],
            ["Tokenization versus normalization?", "Tokenization segments text into units such as words, subwords, characters or bytes. Normalization maps surface variants through choices such as Unicode normalization, lowercasing or punctuation policy. Each choice can remove or preserve task evidence."],
            ["Bag of words, n-grams and TF-IDF—how do they differ?", "Bag of words uses independent term presence or counts. N-grams add limited local order. TF-IDF scales term frequency by corpus rarity, then is often L2-normalized. These sparse representations are strong, fast and interpretable baselines."],
            ["Explain cosine similarity for text.", "Cosine is the dot product divided by both vector magnitudes. It measures direction rather than raw length, so documents with similar relative term weights can be close even if their token counts differ."],
            ["How does Multinomial Naive Bayes classify text?", "It estimates class priors and class-specific token likelihoods, applies smoothing for unseen events, adds the log prior and query-token log likelihoods, then selects the class with the greatest score. Its independence assumption is simplified but often effective for sparse counts."],
            ["Why can linear models work well for text?", "Sparse vocabularies create very high-dimensional spaces where class evidence can often be separated by a weighted sum. Logistic Regression and Linear SVM train efficiently, support strong word or character n-gram baselines and expose useful feature weights."],
            ["Word, subword, character and byte tokenization—when would you use each?", "Words are interpretable but struggle with rare forms. Subwords balance reusable meaning and coverage. Characters handle morphology, spelling noise and many unknown words. Bytes guarantee coverage across scripts but create longer sequences. Validate by language, domain, latency and task."],
            ["Static versus contextual embeddings?", "A static embedding assigns one learned vector to a word type, so bank has the same vector in every sentence. A contextual model builds a token vector from its sentence, allowing financial-bank and river-bank usages to differ."],
            ["How do you evaluate named-entity recognition?", "Use exact span-level precision, recall and F1, not token accuracy alone. Inspect each entity type, boundary errors, nested or overlapping spans, document sources, languages and difficult formats, while matching the production annotation policy."],
            ["How do you prevent NLP data leakage?", "Split by stable groups such as author, thread, customer, template or time before fitting text transforms; deduplicate near-identical text across splits; fit vocabulary and IDF on training only; remove label-revealing metadata; and reproduce the serving-time information boundary."],
            ["How would you debug a multilingual NLP model?", "Measure each language and script separately, inspect tokenizer fragmentation and unknown coverage, check translation or annotation consistency, examine code-mixed samples, compare per-language thresholds and include native-speaker review for high-impact errors."],
            ["Design a production support-ticket classifier.", "Define intents and routing actions; create annotation and escalation rules; split by customer and time; establish word and character TF-IDF baselines; compare contextual models; measure macro F1, class recall and calibration; add abstention and human review; then monitor language mix, drift, latency and downstream resolution outcomes."]
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
        initTokenLab();
        initSemanticLab();
        initTracer();
        initProblems();
        initQuiz();
        initInterviews();
    }

    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
    else init();
}());
