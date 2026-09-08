(function () {
    "use strict";

    const PROGRESS_KEY = "codebhavya-aiml-level-22-progress-v1";
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

    function dot(left, right) {
        return left.reduce(function (total, value, index) { return total + value * right[index]; }, 0);
    }

    function magnitude(vector) {
        return Math.sqrt(dot(vector, vector));
    }

    function cosine(left, right) {
        const denominator = magnitude(left) * magnitude(right);
        return denominator ? dot(left, right) / denominator : 0;
    }

    function tokenize(text) {
        const stopWords = { a: 1, an: 1, and: 1, are: 1, as: 1, at: 1, be: 1, by: 1, for: 1, from: 1, in: 1, is: 1, it: 1, of: 1, on: 1, or: 1, the: 1, to: 1, who: 1, which: 1 };
        return String(text).toLowerCase().replace(/[^a-z0-9]+/g, " ").trim().split(/\s+/).filter(function (term) {
            return term && !stopWords[term];
        });
    }

    function unique(values) {
        return values.filter(function (value, index) { return values.indexOf(value) === index; });
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

    function drawTextBlock(context, text, x, y, width, lineHeight, maximumLines) {
        const lines = wrapLines(context, text, width).slice(0, maximumLines || 4);
        lines.forEach(function (line, index) { context.fillText(line, x, y + index * lineHeight); });
        return lines.length;
    }

    const RAG_CORPORA = {
        placement: {
            label: "Placement policies",
            chunks: [
                { id: "P1", source: "Eligibility Policy", text: "Students with CGPA 7.0 or higher and no active backlogs may attend company interviews." },
                { id: "P2", source: "Document Schedule", text: "Eligible students must submit resume and identity documents by Friday at 5 PM." },
                { id: "P3", source: "Exception Process", text: "The placement coordinator approves an exception with the department placement committee." },
                { id: "P4", source: "Training Notice", text: "Interview practice sessions are available every Wednesday for registered students." }
            ],
            queries: [
                { text: "Which students can attend company interviews?", answer: "Students with CGPA 7.0 or higher and no active backlogs may attend company interviews.", relevant: "P1" },
                { text: "When must documents be submitted?", answer: "Resume and identity documents must be submitted by Friday at 5 PM.", relevant: "P2" },
                { text: "Who approves an exception?", answer: "The placement coordinator approves an exception with the department placement committee.", relevant: "P3" }
            ]
        },
        course: {
            label: "CodeBhavya course guide",
            chunks: [
                { id: "C1", source: "Lab Access", text: "Premium computational labs unlock after the learner completes the required quick revision." },
                { id: "C2", source: "Completion Rule", text: "A level is complete after theory, both interactive labs and the knowledge check are finished." },
                { id: "C3", source: "Mentor Exception", text: "A CodeBhavya mentor may approve alternative practice when accessibility needs prevent a standard activity." },
                { id: "C4", source: "Progress Storage", text: "Practice scores and solved challenges are stored in the learner browser on the current device." }
            ],
            queries: [
                { text: "Who can use the premium computational labs?", answer: "Learners unlock premium computational labs after completing the required quick revision.", relevant: "C1" },
                { text: "When is a level complete?", answer: "A level is complete after theory, both interactive labs and the knowledge check are finished.", relevant: "C2" },
                { text: "Who approves alternative practice?", answer: "A CodeBhavya mentor may approve alternative practice for accessibility needs.", relevant: "C3" }
            ]
        },
        college: {
            label: "College academic rules",
            chunks: [
                { id: "A1", source: "Exam Eligibility", text: "Students need at least 75 percent attendance and cleared examination fees to receive a hall ticket." },
                { id: "A2", source: "Submission Calendar", text: "Final project reports must be submitted to the department office before 4 PM on 20 April." },
                { id: "A3", source: "Academic Exception", text: "The academic committee approves attendance exceptions after receiving evidence from the department head." },
                { id: "A4", source: "Library Circular", text: "Library books should be renewed every fourteen days unless another student has requested the title." }
            ],
            queries: [
                { text: "Which students receive an exam hall ticket?", answer: "Students with at least 75 percent attendance and cleared examination fees receive a hall ticket.", relevant: "A1" },
                { text: "When must final project reports be submitted?", answer: "Final project reports are due at the department office before 4 PM on 20 April.", relevant: "A2" },
                { text: "Who approves an attendance exception?", answer: "The academic committee approves attendance exceptions after evidence from the department head.", relevant: "A3" }
            ]
        }
    };

    function calculateRetrieval(corpusKey, queryIndex, method) {
        const corpus = RAG_CORPORA[corpusKey] || RAG_CORPORA.placement;
        const question = corpus.queries[clamp(Number(queryIndex), 0, corpus.queries.length - 1)];
        const docTokens = corpus.chunks.map(function (chunk) { return tokenize(chunk.text); });
        const queryTokens = tokenize(question.text);
        const vocabulary = unique([].concat.apply([], docTokens.concat([queryTokens]))).sort();
        const documentFrequency = {};
        const idf = {};
        vocabulary.forEach(function (term) {
            documentFrequency[term] = docTokens.filter(function (tokens) { return tokens.indexOf(term) !== -1; }).length;
            idf[term] = Math.log((1 + docTokens.length) / (1 + documentFrequency[term])) + 1;
        });
        function tfidf(tokens) {
            return vocabulary.map(function (term) { return tokens.filter(function (token) { return token === term; }).length * idf[term]; });
        }
        const queryVector = tfidf(queryTokens);
        const docVectors = docTokens.map(tfidf);
        const cosineScores = docVectors.map(function (vector) { return cosine(vector, queryVector); });
        const averageLength = sum(docTokens.map(function (tokens) { return tokens.length; })) / docTokens.length;
        const bm25Scores = docTokens.map(function (tokens) {
            return unique(queryTokens).reduce(function (score, term) {
                const frequency = tokens.filter(function (token) { return token === term; }).length;
                if (!frequency) return score;
                const termIdf = Math.log(1 + (docTokens.length - documentFrequency[term] + 0.5) / (documentFrequency[term] + 0.5));
                const denominator = frequency + 1.5 * (1 - 0.75 + 0.75 * tokens.length / averageLength);
                return score + termIdf * (frequency * 2.5) / denominator;
            }, 0);
        });
        const maximumBm25 = Math.max.apply(null, bm25Scores) || 1;
        const normalizedBm25 = bm25Scores.map(function (score) { return score / maximumBm25; });
        const finalScores = cosineScores.map(function (score, index) {
            if (method === "tfidf") return score;
            if (method === "bm25") return normalizedBm25[index];
            return 0.55 * score + 0.45 * normalizedBm25[index];
        });
        const rankings = corpus.chunks.map(function (chunk, index) {
            return { chunk: chunk, index: index, cosine: cosineScores[index], bm25: bm25Scores[index], bm25Normalized: normalizedBm25[index], score: finalScores[index] };
        }).sort(function (left, right) { return right.score - left.score; });
        return { corpus: corpus, question: question, docTokens: docTokens, queryTokens: queryTokens, vocabulary: vocabulary, documentFrequency: documentFrequency, idf: idf, queryVector: queryVector, docVectors: docVectors, rankings: rankings, method: method };
    }

    function initRagLab() {
        const canvas = get("ragCanvas");
        if (!canvas || canvas.dataset.cbActive) return;
        canvas.dataset.cbActive = "true";
        const corpusInput = get("ragCorpus");
        const queryInput = get("ragQuery");
        const methodInput = get("ragMethod");
        const topKInput = get("ragTopK");
        const nextButton = get("ragNext");
        const autoButton = get("ragAuto");
        const pauseButton = get("ragPause");
        const resetButton = get("ragReset");
        const phases = ["Knowledge chunks", "Query terms", "Vector evidence", "Ranked evidence", "Context assembly", "Grounded answer"];
        let step = 0;
        let timer = null;

        function populateQueries(preferred) {
            const corpus = RAG_CORPORA[corpusInput.value] || RAG_CORPORA.placement;
            const selected = clamp(Number(preferred), 0, corpus.queries.length - 1);
            queryInput.innerHTML = corpus.queries.map(function (query, index) {
                return '<option value="' + index + '"' + (index === selected ? " selected" : "") + ">" + escapeHtml(query.text) + "</option>";
            }).join("");
        }

        function stop() {
            if (timer !== null) window.clearInterval(timer);
            timer = null;
            pauseButton.disabled = true;
        }

        function data() {
            return calculateRetrieval(corpusInput.value, queryInput.value, methodInput.value);
        }

        function drawChunkCard(context, item, x, y, width, height, active, rank) {
            roundRect(context, x, y, width, height, 15);
            context.fillStyle = active ? "rgba(16,185,129,.16)" : "rgba(8,25,45,.88)";
            context.fill();
            context.strokeStyle = active ? "#34d399" : "#31526d";
            context.lineWidth = active ? 2 : 1;
            context.stroke();
            context.textAlign = "left";
            context.fillStyle = active ? "#6ee7b7" : "#7dd3fc";
            context.font = "900 11px Arial";
            context.fillText((rank ? "#" + rank + " • " : "") + item.chunk.id + " • " + item.chunk.source.toUpperCase(), x + 14, y + 21);
            context.fillStyle = "#dbeafe";
            context.font = "600 11px Arial";
            drawTextBlock(context, item.chunk.text, x + 14, y + 42, width - 28, 15, 3);
        }

        function render() {
            const result = data();
            const topK = clamp(Number(topKInput.value), 1, result.rankings.length);
            const selected = result.rankings.slice(0, topK);
            const best = result.rankings[0];
            const prepared = prepareCanvas(canvas, 500, 650);
            const context = prepared.context;
            const width = prepared.width;
            const height = prepared.height;
            context.clearRect(0, 0, width, height);
            context.fillStyle = "#07192d";
            context.fillRect(0, 0, width, height);
            context.strokeStyle = "rgba(48,119,159,.18)";
            for (let x = 0; x < width; x += 38) { context.beginPath(); context.moveTo(x, 0); context.lineTo(x, height); context.stroke(); }
            for (let y = 0; y < height; y += 38) { context.beginPath(); context.moveTo(0, y); context.lineTo(width, y); context.stroke(); }

            context.textAlign = "left";
            context.fillStyle = "#67e8f9";
            context.font = "900 11px Arial";
            context.fillText("RAG PIPELINE • " + (step ? phases[Math.min(step - 1, phases.length - 1)].toUpperCase() : "READY"), 22, 28);
            context.fillStyle = "#f8fafc";
            context.font = "800 15px Arial";
            drawTextBlock(context, result.question.text, 22, 54, width - 44, 20, 2);

            if (step <= 1) {
                const columns = width < 560 ? 1 : 2;
                const gap = 14;
                const cardWidth = (width - 44 - gap * (columns - 1)) / columns;
                result.corpus.chunks.forEach(function (chunk, index) {
                    const row = Math.floor(index / columns);
                    const column = index % columns;
                    drawChunkCard(context, { chunk: chunk }, 22 + column * (cardWidth + gap), 96 + row * 120, cardWidth, 104, false, 0);
                });
                context.fillStyle = "#94a3b8";
                context.font = "600 12px Arial";
                context.fillText(step === 0 ? "Press Inspect Knowledge Base to expose the indexed chunks." : "Four authorized chunks are available to retrieval.", 22, height - 26);
            } else if (step === 2) {
                const terms = result.queryTokens;
                const chipWidth = Math.max(82, Math.min(140, (width - 56) / Math.max(1, Math.min(terms.length, 4))));
                terms.forEach(function (term, index) {
                    const column = index % Math.max(1, Math.floor((width - 44) / chipWidth));
                    const row = Math.floor(index / Math.max(1, Math.floor((width - 44) / chipWidth)));
                    const x = 22 + column * chipWidth;
                    const y = 112 + row * 64;
                    roundRect(context, x, y, chipWidth - 10, 44, 12);
                    context.fillStyle = "rgba(14,165,233,.14)";
                    context.fill();
                    context.strokeStyle = "#38bdf8";
                    context.stroke();
                    context.fillStyle = "#e0f2fe";
                    context.font = "800 12px Arial";
                    context.textAlign = "center";
                    context.fillText(term, x + (chipWidth - 10) / 2, y + 19);
                    context.fillStyle = "#facc15";
                    context.font = "700 10px Arial";
                    context.fillText("idf " + fixed(result.idf[term], 2), x + (chipWidth - 10) / 2, y + 35);
                });
                context.textAlign = "left";
                context.fillStyle = "#cbd5e1";
                context.font = "600 12px Arial";
                drawTextBlock(context, "Rare query terms receive larger inverse-document-frequency weights; common words were removed before scoring.", 22, height - 54, width - 44, 17, 3);
            } else if (step === 3 || step === 4) {
                const rows = result.rankings;
                const startY = 106;
                const rowHeight = Math.min(84, (height - 145) / rows.length);
                rows.forEach(function (item, index) {
                    const y = startY + index * rowHeight;
                    const rank = step === 4 ? index + 1 : item.index + 1;
                    context.textAlign = "left";
                    context.fillStyle = index < topK && step === 4 ? "#6ee7b7" : "#e2e8f0";
                    context.font = "900 11px Arial";
                    context.fillText((step === 4 ? "#" + rank + " " : "") + item.chunk.id, 22, y + 16);
                    const barX = 75;
                    const barWidth = Math.max(80, width - 212);
                    context.fillStyle = "#17324c";
                    context.fillRect(barX, y + 5, barWidth, 15);
                    context.fillStyle = step === 4 && index < topK ? "#34d399" : "#38bdf8";
                    context.fillRect(barX, y + 5, barWidth * item.score, 15);
                    context.fillStyle = "#f8fafc";
                    context.textAlign = "right";
                    context.font = "800 11px Arial";
                    context.fillText(fixed(item.score, 3), width - 22, y + 16);
                    context.fillStyle = "#94a3b8";
                    context.font = "600 10px Arial";
                    context.textAlign = "left";
                    context.fillText("cos " + fixed(item.cosine, 2) + " • BM25 " + fixed(item.bm25, 2), barX, y + 37);
                    context.fillText(item.chunk.source, barX, y + 54);
                });
            } else if (step === 5) {
                const gap = 12;
                const cardHeight = Math.min(128, (height - 142 - gap * (selected.length - 1)) / selected.length);
                selected.forEach(function (item, index) {
                    drawChunkCard(context, item, 22, 100 + index * (cardHeight + gap), width - 44, cardHeight, true, index + 1);
                });
                context.fillStyle = "#facc15";
                context.font = "800 11px Arial";
                context.textAlign = "left";
                context.fillText("ONLY THESE TOP-" + topK + " CHUNKS ENTER THE MODEL CONTEXT", 22, height - 24);
            } else {
                roundRect(context, 22, 98, width - 44, Math.min(218, height - 170), 18);
                context.fillStyle = "rgba(16,185,129,.12)";
                context.fill();
                context.strokeStyle = best.chunk.id === result.question.relevant ? "#34d399" : "#f59e0b";
                context.lineWidth = 2;
                context.stroke();
                context.fillStyle = "#6ee7b7";
                context.font = "900 11px Arial";
                context.textAlign = "left";
                context.fillText(best.chunk.id === result.question.relevant ? "SUPPORTED ANSWER" : "REVIEW REQUIRED", 44, 128);
                context.fillStyle = "#f8fafc";
                context.font = "800 15px Arial";
                drawTextBlock(context, result.question.answer, 44, 159, width - 88, 23, 5);
                context.fillStyle = "#67e8f9";
                context.font = "800 11px Arial";
                context.fillText("Citation: [" + best.chunk.id + "] " + best.chunk.source, 44, Math.min(291, height - 92));
                context.fillStyle = "#cbd5e1";
                context.font = "600 12px Arial";
                drawTextBlock(context, "The answer is returned only after the highest-ranked authorized chunk supports the claim.", 22, height - 56, width - 44, 17, 3);
            }

            topKInput.nextElementSibling.textContent = "Top " + topK;
            get("ragPhase").textContent = step === 0 ? "Ready" : phases[Math.min(step - 1, phases.length - 1)];
            get("ragChunks").textContent = String(result.corpus.chunks.length);
            get("ragQueryTerms").textContent = String(result.queryTokens.length);
            get("ragBestChunk").textContent = step >= 4 ? best.chunk.id : "—";
            get("ragBestScore").textContent = step >= 3 ? fixed(best.score, 3) : "—";

            const methodLabel = methodInput.options[methodInput.selectedIndex].text;
            const inspector = {
                0: ["Choose a question and inspect the knowledge base.", "query → evidence", "The workbench begins before retrieval so corpus contents and access boundaries remain visible.", "No chunks selected yet.", "Predict which chunk should rank first."],
                1: ["The authorized knowledge collection contains " + result.corpus.chunks.length + " chunks.", "corpus = {" + result.corpus.chunks.map(function (chunk) { return chunk.id; }).join(", ") + "}", "Each chunk retains text, source and identity for later citation.", "All chunks are candidates; none is evidence yet.", "Tokenize the user question and inspect term rarity."],
                2: ["The query contains " + result.queryTokens.length + " useful terms after normalization.", "idf(t) = log((1 + N) / (1 + df(t))) + 1", "Query and chunks share one vocabulary. Rare terms influence TF-IDF more strongly.", result.queryTokens.map(function (term) { return term + "=" + fixed(result.idf[term], 2); }).join(" • "), "Compare vector similarity and BM25 lexical evidence."],
                3: [methodLabel + " scores have been calculated for every chunk.", methodInput.value === "hybrid" ? "score = 0.55 × cosine + 0.45 × normalized BM25" : (methodInput.value === "tfidf" ? "score = cosine(q, d)" : "score = normalized BM25(q, d)"), "Scoring is complete, but the model still has no context until results are sorted and selected.", result.rankings.map(function (item) { return item.chunk.id + "=" + fixed(item.score, 3); }).join(" • "), "Sort by score and select Top-" + topK + "."],
                4: [best.chunk.id + " ranks first with score " + fixed(best.score, 3) + ".", "rank = argsort(score, descending=True)", "Ranking converts independent chunk scores into an ordered candidate list.", selected.map(function (item, index) { return "#" + (index + 1) + " " + item.chunk.id + " • " + item.chunk.source; }).join(" | "), "Build a bounded context from selected evidence."],
                5: ["Top-" + topK + " authorized chunks form the generation context.", "context = join(rankings[:" + topK + "])", "Only selected text should influence the evidence-bound answer; lower-ranked chunks remain outside the model context.", selected.map(function (item) { return "[" + item.chunk.id + "] " + item.chunk.text; }).join(" "), "Generate, cite and verify the factual claim."],
                6: [best.chunk.id === result.question.relevant ? "The answer is supported by the highest-ranked chunk." : "The expected evidence was not ranked first; review retrieval.", "answer ← generate(question, context) + citation", "Claim support is checked against the cited chunk before returning the answer.", result.question.answer + " [" + best.chunk.id + "]", "Change corpus, question, method or Top-K and compare the trace."]
            }[step];
            get("ragVerdict").textContent = inspector[0];
            get("ragEquation").textContent = inspector[1];
            get("ragExplanation").textContent = inspector[2];
            get("ragEvidence").innerHTML = "<span>RETRIEVED EVIDENCE</span><strong>" + escapeHtml(inspector[3]) + "</strong>";
            get("ragNextCheck").textContent = inspector[4];
            nextButton.textContent = step === 0 ? "Inspect Knowledge Base" : (step < 6 ? "Next: " + phases[step] : "Analysis Complete");
            nextButton.disabled = step >= 6;
        }

        function advance() {
            if (step < 6) step += 1;
            render();
            if (step >= 6) stop();
        }

        function reset() {
            stop();
            step = 0;
            render();
        }

        nextButton.addEventListener("click", advance);
        autoButton.addEventListener("click", function () {
            if (step >= 6) step = 0;
            stop();
            pauseButton.disabled = false;
            advance();
            timer = window.setInterval(advance, 850);
        });
        pauseButton.addEventListener("click", stop);
        resetButton.addEventListener("click", reset);
        corpusInput.addEventListener("change", function () { populateQueries(0); reset(); });
        queryInput.addEventListener("change", reset);
        methodInput.addEventListener("change", reset);
        topKInput.addEventListener("input", reset);
        let resizeTimer = null;
        window.addEventListener("resize", function () { window.clearTimeout(resizeTimer); resizeTimer = window.setTimeout(render, 120); });
        populateQueries(0);
        render();
    }

    const AGENT_TASKS = {
        eligibility: {
            goal: "Decide whether student CB102 may attend the NovaTech placement interview.",
            final: "CB102 is eligible: CGPA 7.8 exceeds 7.0 and active backlogs equal 0.",
            calls: [
                { tool: "get_student_record", args: '{"student_id":"CB102"}', observation: "CGPA 7.8 • active backlogs 0" },
                { tool: "get_company_rule", args: '{"company":"NovaTech"}', observation: "minimum CGPA 7.0 • no active backlogs" },
                { tool: "calculate_eligibility", args: '{"cgpa":7.8,"backlogs":0}', observation: "eligible = true" },
                { tool: "verify_evidence", args: '{"student":"CB102","company":"NovaTech"}', observation: "record and rule are current and mutually consistent" }
            ]
        },
        learning: {
            goal: "Create a three-week machine-learning revision plan for learner Asha.",
            final: "A three-week plan prioritizes linear algebra, supervised ML and model evaluation with weekly checks.",
            calls: [
                { tool: "get_skill_profile", args: '{"learner":"Asha"}', observation: "strong Python • weak linear algebra • 6 hours/week" },
                { tool: "get_course_map", args: '{"track":"AI-ML"}', observation: "Levels 3, 6–12 match the requested revision goal" },
                { tool: "build_schedule", args: '{"weeks":3,"hours_per_week":6}', observation: "18-hour schedule created with theory, lab and review blocks" },
                { tool: "verify_plan", args: '{"check":"coverage_and_capacity"}', observation: "all priority topics covered within 18 hours" }
            ]
        },
        budget: {
            goal: "Recommend a training plan that stays within a ₹12,000 budget.",
            final: "The selected course, practice tests and travel allocation total ₹11,450, leaving ₹550 contingency.",
            calls: [
                { tool: "get_training_costs", args: '{"location":"Hyderabad"}', observation: "course ₹8,000 • tests ₹1,450 • travel estimate ₹2,000" },
                { tool: "calculator", args: '{"values":[8000,1450,2000],"operation":"sum"}', observation: "total = ₹11,450" },
                { tool: "compare_budget", args: '{"total":11450,"budget":12000}', observation: "within budget • remaining ₹550" },
                { tool: "verify_costs", args: '{"require_current_prices":true}', observation: "all cost entries dated this month" }
            ]
        }
    };

    function initAgentLab() {
        const canvas = get("agentCanvas");
        if (!canvas || canvas.dataset.cbActive) return;
        canvas.dataset.cbActive = "true";
        const taskInput = get("agentTask");
        const strategyInput = get("agentStrategy");
        const verificationInput = get("agentVerification");
        const budgetInput = get("agentBudget");
        const nextButton = get("agentNext");
        const autoButton = get("agentAuto");
        const pauseButton = get("agentPause");
        const resetButton = get("agentReset");
        let step = 0;
        let timer = null;

        function task() { return AGENT_TASKS[taskInput.value] || AGENT_TASKS.eligibility; }
        function requiredCalls() { return verificationInput.value === "strict" || strategyInput.value === "verify" ? task().calls : task().calls.slice(0, 3); }
        function maximumStep() { return 2 + Math.min(requiredCalls().length, Number(budgetInput.value)) + 1; }
        function callsExecuted() { return clamp(step - 2, 0, Math.min(requiredCalls().length, Number(budgetInput.value))); }
        function stoppedByBudget() { return callsExecuted() >= Number(budgetInput.value) && callsExecuted() < requiredCalls().length; }
        function completed() { return callsExecuted() >= requiredCalls().length && step >= 2 + requiredCalls().length + 1; }

        function stop() {
            if (timer !== null) window.clearInterval(timer);
            timer = null;
            pauseButton.disabled = true;
        }

        function drawNode(context, x, y, width, height, label, detail, state) {
            roundRect(context, x, y, width, height, 14);
            context.fillStyle = state === "done" ? "rgba(16,185,129,.17)" : (state === "active" ? "rgba(250,204,21,.17)" : "rgba(8,25,45,.9)");
            context.fill();
            context.strokeStyle = state === "done" ? "#34d399" : (state === "active" ? "#facc15" : "#31526d");
            context.lineWidth = state === "active" ? 2 : 1;
            context.stroke();
            context.textAlign = "left";
            context.fillStyle = state === "active" ? "#fde047" : (state === "done" ? "#6ee7b7" : "#7dd3fc");
            context.font = "900 10px Arial";
            context.fillText(label.toUpperCase(), x + 13, y + 20);
            context.fillStyle = "#e2e8f0";
            context.font = "600 10px Arial";
            drawTextBlock(context, detail, x + 13, y + 40, width - 26, 14, 3);
        }

        function render() {
            const selectedTask = task();
            const calls = requiredCalls();
            const used = callsExecuted();
            const budget = Number(budgetInput.value);
            const budgetStop = stoppedByBudget();
            const isComplete = completed();
            const prepared = prepareCanvas(canvas, 500, 660);
            const context = prepared.context;
            const width = prepared.width;
            const height = prepared.height;
            context.clearRect(0, 0, width, height);
            context.fillStyle = "#07192d";
            context.fillRect(0, 0, width, height);
            context.strokeStyle = "rgba(48,119,159,.18)";
            for (let x = 0; x < width; x += 38) { context.beginPath(); context.moveTo(x, 0); context.lineTo(x, height); context.stroke(); }
            for (let y = 0; y < height; y += 38) { context.beginPath(); context.moveTo(0, y); context.lineTo(width, y); context.stroke(); }
            context.fillStyle = "#67e8f9";
            context.font = "900 11px Arial";
            context.textAlign = "left";
            context.fillText("BOUNDED AGENT • PLAN → ACT → OBSERVE → VERIFY", 20, 26);

            const compact = width < 560;
            const startY = 50;
            drawNode(context, 20, startY, width - 40, 78, "Goal", selectedTask.goal, step === 0 ? "active" : "done");
            drawNode(context, 20, startY + 94, width - 40, 66, "Plan", strategyInput.value === "reactive" ? "Choose only the next useful action from current state." : calls.map(function (call) { return call.tool; }).join(" → "), step === 1 ? "active" : (step > 1 ? "done" : "waiting"));

            const callStart = startY + 180;
            const gap = 12;
            const columns = compact ? 1 : 2;
            const nodeWidth = (width - 40 - gap * (columns - 1)) / columns;
            const nodeHeight = compact ? 77 : 89;
            calls.forEach(function (call, index) {
                const column = index % columns;
                const row = Math.floor(index / columns);
                const x = 20 + column * (nodeWidth + gap);
                const y = callStart + row * (nodeHeight + gap);
                const callNumber = index + 1;
                const state = callNumber <= used ? "done" : (step === 2 + index ? "active" : "waiting");
                const detail = callNumber <= used ? call.observation : (strategyInput.value === "reactive" && callNumber > used + 1 ? "Hidden until prior observation" : call.args);
                drawNode(context, x, y, nodeWidth, nodeHeight, "Tool " + callNumber + " • " + call.tool, detail, state);
            });

            const rows = Math.ceil(calls.length / columns);
            const finalY = callStart + rows * (nodeHeight + gap) + 4;
            const finalState = budgetStop || isComplete ? "done" : (used >= calls.length ? "active" : "waiting");
            drawNode(context, 20, finalY, width - 40, Math.max(70, height - finalY - 20), budgetStop ? "Safe stop" : "Verification", budgetStop ? "Tool-call budget exhausted before sufficient evidence. Escalate without claiming completion." : (isComplete ? selectedTask.final : "Check evidence, goal, permissions, result and stop condition."), finalState);

            budgetInput.nextElementSibling.textContent = budget + (budget === 1 ? " call" : " calls");
            let phase = "Ready";
            if (step === 1) phase = "Goal understood";
            else if (step === 2) phase = "Plan selected";
            else if (budgetStop) phase = "Budget stop";
            else if (isComplete) phase = "Complete";
            else if (used > 0 && used <= calls.length) phase = "Observe";
            else if (used >= calls.length) phase = "Verify";
            const currentCall = step >= 3 && step <= 2 + calls.length ? calls[step - 3] : null;
            get("agentPhase").textContent = phase;
            get("agentStep").textContent = String(step);
            get("agentTool").textContent = currentCall ? currentCall.tool : "—";
            get("agentBudgetUsed").textContent = used + " / " + budget;
            get("agentStatus").textContent = budgetStop ? "Stopped safely" : (isComplete ? "Verified" : "In progress");

            let verdict = "Choose a task and inspect its execution boundary.";
            let equation = "goal → next action";
            let explanation = "The laboratory separates model-selected actions from deterministic validation and tool execution.";
            let evidence = "No observations recorded yet.";
            let nextCheck = "Predict which information the first tool must retrieve.";
            if (step === 1) {
                verdict = "The goal and completion condition are now explicit.";
                equation = "goal = " + selectedTask.goal;
                explanation = "A bounded agent should know what success means before selecting any tool.";
                evidence = "Required result: " + selectedTask.final;
                nextCheck = "Choose a plan that gathers every required fact without unnecessary access.";
            } else if (step === 2) {
                verdict = strategyInput.options[strategyInput.selectedIndex].text + " selected with a " + budget + "-call limit.";
                equation = "next = policy(goal, state, allowed_tools)";
                explanation = strategyInput.value === "reactive" ? "Only the immediate action is exposed; later actions depend on observations." : "The intended tool sequence is visible, but each call still requires validation.";
                evidence = calls.map(function (call, index) { return (index + 1) + ". " + call.tool; }).join(" → ");
                nextCheck = "Validate the first tool name, permission and arguments.";
            } else if (currentCall) {
                verdict = currentCall.tool + " returned a deterministic observation.";
                equation = currentCall.tool + "(" + currentCall.args + ")";
                explanation = "Application code validates the proposed call before execution; the returned observation is data, not trusted instruction.";
                evidence = currentCall.observation;
                nextCheck = used < calls.length ? "Use this observation to select and validate the next action." : "Verify goal completion against all recorded evidence.";
            } else if (budgetStop) {
                verdict = "The agent stopped because its tool-call budget was exhausted.";
                equation = "calls_used = " + used + " = budget";
                explanation = "The missing evidence prevents a reliable final answer, so the safe response is to stop and escalate.";
                evidence = calls.slice(0, used).map(function (call) { return call.observation; }).join(" | ");
                nextCheck = "Increase the budget deliberately or simplify the task; do not silently bypass verification.";
            } else if (isComplete) {
                verdict = "The goal is complete and the result is supported by recorded observations.";
                equation = "verified(goal, evidence, policy) = true";
                explanation = "The agent returns only after evidence, rule consistency, budget and stop conditions pass.";
                evidence = selectedTask.final;
                nextCheck = "Change strategy, verification policy or budget and compare behavior.";
            } else if (used >= calls.length) {
                verdict = "All required calls are complete; final verification remains.";
                equation = "verify(observations, goal, policy)";
                explanation = "A plausible result is not returned until evidence and completion conditions have been checked.";
                evidence = calls.map(function (call) { return call.observation; }).join(" | ");
                nextCheck = "Run the verification gate and decide whether to return or stop.";
            }
            get("agentVerdict").textContent = verdict;
            get("agentEquation").textContent = equation;
            get("agentExplanation").textContent = explanation;
            get("agentEvidence").innerHTML = "<span>WORKING STATE</span><strong>" + escapeHtml(evidence) + "</strong>";
            get("agentNextCheck").textContent = nextCheck;
            nextButton.textContent = step === 0 ? "Inspect Goal" : (step === 1 ? "Create Plan" : (budgetStop || isComplete ? "Execution Complete" : (used < calls.length ? "Run Next Tool" : "Verify Result")));
            nextButton.disabled = budgetStop || isComplete;
        }

        function advance() {
            if (stoppedByBudget() || completed()) { stop(); return; }
            if (step < maximumStep()) step += 1;
            render();
            if (stoppedByBudget() || completed()) stop();
        }

        function reset() {
            stop();
            step = 0;
            render();
        }

        nextButton.addEventListener("click", advance);
        autoButton.addEventListener("click", function () {
            if (stoppedByBudget() || completed()) step = 0;
            stop();
            pauseButton.disabled = false;
            advance();
            timer = window.setInterval(advance, 900);
        });
        pauseButton.addEventListener("click", stop);
        resetButton.addEventListener("click", reset);
        taskInput.addEventListener("change", reset);
        strategyInput.addEventListener("change", reset);
        verificationInput.addEventListener("change", reset);
        budgetInput.addEventListener("input", reset);
        let resizeTimer = null;
        window.addEventListener("resize", function () { window.clearTimeout(resizeTimer); resizeTimer = window.setTimeout(render, 120); });
        render();
    }

    const TRACER_CODE = [
        "documents = [\"students cgpa 7 no backlogs may attend interviews\", \"documents due friday\", \"interview practice\"]",
        "query = \"who may attend interviews\"",
        "doc_tokens = [text.split() for text in documents]",
        "query_tokens = query.split()",
        "vocabulary = sorted(set(sum(doc_tokens, []) + query_tokens))",
        "document_frequency = {}",
        "for term in vocabulary:",
        "    count = 0",
        "    for tokens in doc_tokens:",
        "        if term in tokens:",
        "            count += 1",
        "    document_frequency[term] = count",
        "idf = {}",
        "for term in vocabulary:",
        "    idf[term] = log((1 + len(documents)) / (1 + document_frequency[term])) + 1",
        "vectors = []",
        "for tokens in doc_tokens:",
        "    row = []",
        "    for term in vocabulary:",
        "        row.append(tokens.count(term) * idf[term])",
        "    vectors.append(row)",
        "query_vector = [query_tokens.count(term) * idf[term] for term in vocabulary]",
        "scores = []",
        "for vector in vectors:",
        "    numerator = sum(a * b for a, b in zip(vector, query_vector))",
        "    denominator = sqrt(sum(a*a for a in vector) * sum(b*b for b in query_vector))",
        "    scores.append(numerator / denominator if denominator else 0)",
        "average_length = sum(map(len, doc_tokens)) / len(doc_tokens)",
        "bm25_scores = []",
        "for tokens in doc_tokens:",
        "    score = 0",
        "    for term in query_tokens:",
        "        frequency = tokens.count(term)",
        "        if frequency:",
        "            term_idf = log(1 + (len(documents) - document_frequency[term] + .5) / (document_frequency[term] + .5))",
        "            normalizer = frequency + 1.5 * (.25 + .75 * len(tokens) / average_length)",
        "            score += term_idf * frequency * 2.5 / normalizer",
        "    bm25_scores.append(score)",
        "bm25_max = max(bm25_scores) or 1",
        "hybrid = [.55 * cosine + .45 * lexical / bm25_max for cosine, lexical in zip(scores, bm25_scores)]",
        "best = max(range(len(hybrid)), key=lambda i: hybrid[i])",
        "print(best, round(hybrid[best], 3), documents[best])"
    ];

    function buildTracerStates() {
        const documents = ["students cgpa 7 no backlogs may attend interviews", "documents due friday", "interview practice"];
        const query = "who may attend interviews";
        let docTokens = [];
        let queryTokens = [];
        let vocabulary = [];
        const documentFrequency = {};
        const idf = {};
        const vectors = [];
        let queryVector = [];
        const scores = [];
        let term = "—";
        let tokens = [];
        let count = 0;
        let row = [];
        let numerator = 0;
        let denominator = 0;
        const bm25Scores = [];
        let best = null;
        const states = [];

        function snapshot(line, explanation, expression, output, extra) {
            const variables = {
                term: term,
                count: count,
                tokens: tokens.length ? "[" + tokens.join(", ") + "]" : "—",
                vocabulary_size: vocabulary.length || "—",
                vectors_built: vectors.length,
                scores: scores.length ? "[" + scores.map(function (score) { return fixed(score, 3); }).join(", ") + "]" : "[]"
            };
            if (extra) Object.keys(extra).forEach(function (key) { variables[key] = extra[key]; });
            states.push({ line: line, explanation: explanation, expression: expression, variables: variables, output: output || "Waiting for print(...)" });
        }

        snapshot(1, "Create the three searchable document chunks.", "documents = 3 chunks", "", { documents: documents.length });
        snapshot(2, "Store the user query that retrieval must match.", 'query = "' + query + '"', "", { query: query });
        docTokens = documents.map(function (text) { return text.split(" "); });
        snapshot(3, "Split every document into tokens.", "doc_tokens = [text.split() ...]", "", { doc_tokens: docTokens.map(function (values) { return values.join("|"); }).join(" ; ") });
        queryTokens = query.split(" ");
        snapshot(4, "Split the query using the same tokenization rule.", "query_tokens = query.split()", "", { query_tokens: queryTokens.join("|") });
        vocabulary = unique([].concat.apply([], docTokens).concat(queryTokens)).sort();
        snapshot(5, "Build one sorted vocabulary shared by documents and query.", "vocabulary = sorted(unique terms)", "", { vocabulary: vocabulary.join(", ") });
        snapshot(6, "Initialize the document-frequency dictionary.", "document_frequency = {}", "");

        vocabulary.forEach(function (currentTerm) {
            term = currentTerm;
            snapshot(7, "Enter the outer loop for term '" + term + "'.", "term = " + term, "");
            count = 0;
            snapshot(8, "Reset this term's document counter.", "count = 0", "");
            docTokens.forEach(function (currentTokens, documentIndex) {
                tokens = currentTokens;
                snapshot(9, "Visit document " + documentIndex + " for term '" + term + "'.", "tokens = doc_tokens[" + documentIndex + "]", "", { document_index: documentIndex });
                const present = tokens.indexOf(term) !== -1;
                snapshot(10, present ? "The term occurs in this document." : "The term is absent, so count is unchanged.", term + (present ? " in " : " not in ") + "tokens", "", { condition: present });
                if (present) {
                    count += 1;
                    snapshot(11, "Increment document frequency for the matching document.", "count = " + count, "");
                }
            });
            documentFrequency[term] = count;
            snapshot(12, "Store how many documents contain '" + term + "'.", "document_frequency[" + term + "] = " + count, "", { document_frequency: JSON.stringify(documentFrequency) });
        });

        snapshot(13, "Initialize the inverse-document-frequency table.", "idf = {}", "");
        vocabulary.forEach(function (currentTerm) {
            term = currentTerm;
            count = documentFrequency[term];
            snapshot(14, "Return to the loop to calculate IDF for '" + term + "'.", "term = " + term, "");
            idf[term] = Math.log((1 + documents.length) / (1 + count)) + 1;
            snapshot(15, "Apply smoothed IDF. Terms in fewer documents receive larger values.", "log(4 / " + (1 + count) + ") + 1 = " + fixed(idf[term], 3), "", { idf_term: fixed(idf[term], 3) });
        });

        snapshot(16, "Initialize the document-vector list.", "vectors = []", "");
        docTokens.forEach(function (currentTokens, documentIndex) {
            tokens = currentTokens;
            snapshot(17, "Begin TF-IDF vector construction for document " + documentIndex + ".", "tokens = doc_tokens[" + documentIndex + "]", "", { document_index: documentIndex });
            row = [];
            snapshot(18, "Start an empty feature row for this document.", "row = []", "");
            vocabulary.forEach(function (currentTerm) {
                term = currentTerm;
                snapshot(19, "Visit vocabulary feature '" + term + "'.", "term = " + term, "");
                const value = tokens.filter(function (token) { return token === term; }).length * idf[term];
                row.push(value);
                snapshot(20, "Append term frequency multiplied by IDF.", "tf(" + term + ") × idf = " + fixed(value, 3), "", { row_length: row.length });
            });
            vectors.push(row.slice());
            snapshot(21, "The completed document vector joins the matrix.", "vectors.append(row)", "", { vectors_built: vectors.length });
        });

        queryVector = vocabulary.map(function (currentTerm) {
            return queryTokens.filter(function (token) { return token === currentTerm; }).length * idf[currentTerm];
        });
        snapshot(22, "Build the query vector in the identical vocabulary space.", "query_vector = TF × IDF", "", { query_nonzero: queryVector.filter(Boolean).length });
        snapshot(23, "Initialize the cosine-score list.", "scores = []", "");
        vectors.forEach(function (vector, documentIndex) {
            snapshot(24, "Enter the scoring loop for document vector " + documentIndex + ".", "vector = vectors[" + documentIndex + "]", "", { document_index: documentIndex });
            numerator = dot(vector, queryVector);
            snapshot(25, "Calculate the dot-product numerator feature by feature.", "numerator = " + fixed(numerator, 3), "", { numerator: fixed(numerator, 3) });
            denominator = magnitude(vector) * magnitude(queryVector);
            snapshot(26, "Multiply document and query vector magnitudes.", "denominator = " + fixed(denominator, 3), "", { denominator: fixed(denominator, 3) });
            const score = denominator ? numerator / denominator : 0;
            scores.push(score);
            snapshot(27, "Append cosine similarity for this document.", "score = " + fixed(score, 3), "", { document_score: fixed(score, 3) });
        });
        const averageLength = sum(docTokens.map(function (values) { return values.length; })) / docTokens.length;
        snapshot(28, "Calculate average document length for BM25 normalization.", "average_length = " + fixed(averageLength, 3), "", { average_length: fixed(averageLength, 3) });
        snapshot(29, "Initialize the BM25 lexical-score list.", "bm25_scores = []", "", { bm25_scores: "[]" });
        docTokens.forEach(function (currentTokens, documentIndex) {
            tokens = currentTokens;
            snapshot(30, "Begin BM25 scoring for document " + documentIndex + ".", "tokens = doc_tokens[" + documentIndex + "]", "", { document_index: documentIndex, bm25_scores: "[" + bm25Scores.map(function (value) { return fixed(value, 3); }).join(", ") + "]" });
            let lexicalScore = 0;
            snapshot(31, "Reset this document's lexical score.", "score = 0", "");
            queryTokens.forEach(function (currentTerm) {
                term = currentTerm;
                snapshot(32, "Visit query term '" + term + "'.", "term = " + term, "");
                const frequency = tokens.filter(function (token) { return token === term; }).length;
                snapshot(33, "Count occurrences of the query term in this document.", "frequency = " + frequency, "", { frequency: frequency });
                snapshot(34, frequency ? "The term contributes to BM25." : "The term is absent, so it contributes zero.", "frequency > 0 is " + Boolean(frequency), "");
                if (frequency) {
                    const termIdf = Math.log(1 + (documents.length - documentFrequency[term] + 0.5) / (documentFrequency[term] + 0.5));
                    snapshot(35, "Calculate BM25 inverse document frequency.", "term_idf = " + fixed(termIdf, 3), "", { term_idf: fixed(termIdf, 3) });
                    const normalizer = frequency + 1.5 * (0.25 + 0.75 * tokens.length / averageLength);
                    snapshot(36, "Normalize term frequency using document length.", "normalizer = " + fixed(normalizer, 3), "", { normalizer: fixed(normalizer, 3) });
                    const contribution = termIdf * frequency * 2.5 / normalizer;
                    lexicalScore += contribution;
                    snapshot(37, "Add this term's BM25 contribution.", "score += " + fixed(contribution, 3) + " → " + fixed(lexicalScore, 3), "", { lexical_score: fixed(lexicalScore, 3) });
                }
            });
            bm25Scores.push(lexicalScore);
            snapshot(38, "Append the complete BM25 score for this document.", "bm25_scores.append(" + fixed(lexicalScore, 3) + ")", "", { bm25_scores: "[" + bm25Scores.map(function (value) { return fixed(value, 3); }).join(", ") + "]" });
        });
        const bm25Maximum = Math.max.apply(null, bm25Scores) || 1;
        snapshot(39, "Find the maximum lexical score for normalization.", "bm25_max = " + fixed(bm25Maximum, 3), "", { bm25_max: fixed(bm25Maximum, 3) });
        const hybrid = scores.map(function (score, index) { return 0.55 * score + 0.45 * bm25Scores[index] / bm25Maximum; });
        snapshot(40, "Fuse semantic cosine and normalized BM25 evidence.", "hybrid = 0.55 × cosine + 0.45 × normalized BM25", "", { hybrid: "[" + hybrid.map(function (value) { return fixed(value, 3); }).join(", ") + "]" });
        best = hybrid.indexOf(Math.max.apply(null, hybrid));
        snapshot(41, "Find the index with maximum hybrid relevance.", "best = " + best, "", { best: best });
        const output = best + " " + fixed(hybrid[best], 3) + " " + documents[best];
        snapshot(42, "Print the winning chunk and fused score. Program execution is complete.", "print(best, round(hybrid[best], 3), documents[best])", output, { best: best, winning_chunk: documents[best] });
        return states;
    }

    function initTracer() {
        const toggle = get("tracerPanelToggle");
        const panel = get("tracerPanel");
        if (!toggle || !panel || toggle.dataset.cbActive) return;
        toggle.dataset.cbActive = "true";
        const states = buildTracerStates();
        const code = get("tracerCode");
        const previous = get("tracerPrevious");
        const next = get("tracerNext");
        const auto = get("tracerAuto");
        const pause = get("tracerPause");
        const reset = get("tracerReset");
        let position = 0;
        let timer = null;

        code.innerHTML = TRACER_CODE.map(function (line, index) {
            return '<div class="aiml-code-line" data-line="' + (index + 1) + '"><span>' + String(index + 1).padStart(2, "0") + '</span><code>' + escapeHtml(line) + "</code></div>";
        }).join("");

        function stop() {
            if (timer !== null) window.clearInterval(timer);
            timer = null;
            pause.disabled = true;
        }

        function render() {
            const hasState = position > 0;
            const state = hasState ? states[position - 1] : null;
            Array.prototype.forEach.call(code.querySelectorAll(".aiml-code-line"), function (line) {
                line.classList.toggle("active", Boolean(state) && Number(line.dataset.line) === state.line);
            });
            get("tracerStatus").textContent = !state ? "Ready" : (position === states.length ? "Complete" : "Running");
            get("tracerExplanation").textContent = state ? state.explanation : "Press Next to evaluate the first statement.";
            get("tracerExpression").textContent = state ? state.expression : "—";
            get("tracerOutput").textContent = state ? state.output : "Waiting for print(...)";
            get("tracerVariables").innerHTML = state ? Object.keys(state.variables).map(function (key) {
                return '<article><span>' + escapeHtml(key.replace(/_/g, " ").toUpperCase()) + '</span><strong>' + escapeHtml(state.variables[key]) + "</strong></article>";
            }).join("") : '<article><span>STATE</span><strong>Not started</strong></article>';
            previous.disabled = position === 0;
            next.disabled = position >= states.length;
            get("tracerProgress").textContent = "Step " + position + " of " + states.length;
            if (state) {
                const activeLine = code.querySelector('.aiml-code-line[data-line="' + state.line + '"]');
                if (activeLine) activeLine.scrollIntoView({ block: "nearest", behavior: "smooth" });
            }
        }

        function advance() {
            if (position < states.length) position += 1;
            render();
            if (position >= states.length) stop();
        }

        toggle.addEventListener("click", function () {
            const opening = panel.hidden;
            panel.hidden = !opening;
            toggle.setAttribute("aria-expanded", String(opening));
            toggle.textContent = opening ? "Close Interactive Tracer" : "Open Interactive Tracer";
        });
        previous.addEventListener("click", function () { stop(); if (position > 0) position -= 1; render(); });
        next.addEventListener("click", function () { stop(); advance(); });
        auto.addEventListener("click", function () {
            if (position >= states.length) position = 0;
            stop();
            pause.disabled = false;
            advance();
            timer = window.setInterval(advance, 90);
        });
        pause.addEventListener("click", stop);
        reset.addEventListener("click", function () { stop(); position = 0; render(); });
        render();
    }

    const PROBLEMS = [
        {
            title: "Build Overlapping Text Chunks",
            difficulty: "BEGINNER",
            prompt: "Split a list of words into chunks of size four with an overlap of two. Return every non-empty chunk.",
            example: "Input: ['a','b','c','d','e','f','g']\nOutput: [['a','b','c','d'], ['c','d','e','f'], ['e','f','g']]",
            hint: "Advance by chunk_size - overlap, and stop after the final token is included.",
            starter: "def make_chunks(words, size=4, overlap=2):\n    # Write your code\n    pass",
            solution: "def make_chunks(words, size=4, overlap=2):\n    if size <= 0 or overlap < 0 or overlap >= size:\n        raise ValueError('require 0 <= overlap < size')\n    step = size - overlap\n    return [words[i:i + size] for i in range(0, len(words), step) if words[i:i + size]]"
        },
        {
            title: "Calculate a TF-IDF Vector",
            difficulty: "INTERMEDIATE",
            prompt: "Given document tokens, a vocabulary and precomputed IDF values, return the unnormalized TF-IDF vector.",
            example: "tokens=['rag','uses','evidence','evidence']\nvocabulary=['evidence','rag','tool']\nidf=[1.2,1.5,2.0]\nOutput: [2.4,1.5,0.0]",
            hint: "For every vocabulary term, multiply tokens.count(term) by the aligned IDF value.",
            starter: "def tfidf_vector(tokens, vocabulary, idf):\n    # Write your code\n    pass",
            solution: "def tfidf_vector(tokens, vocabulary, idf):\n    return [tokens.count(term) * idf[i]\n            for i, term in enumerate(vocabulary)]"
        },
        {
            title: "Rank Chunks by Cosine Similarity",
            difficulty: "INTERMEDIATE",
            prompt: "Calculate cosine similarity between a query vector and every chunk vector, then return indices ordered from best to worst.",
            example: "query=[1,1]\nchunks=[[1,0],[1,1],[0,2]]\nOutput: [1,0,2]",
            hint: "Protect against zero magnitudes, store (score,index) pairs and sort descending by score.",
            starter: "def rank_chunks(query, chunks):\n    # Write your code\n    pass",
            solution: "from math import sqrt\n\ndef rank_chunks(query, chunks):\n    qnorm = sqrt(sum(x*x for x in query))\n    scored = []\n    for index, chunk in enumerate(chunks):\n        cnorm = sqrt(sum(x*x for x in chunk))\n        denom = qnorm * cnorm\n        score = sum(a*b for a,b in zip(query,chunk)) / denom if denom else 0\n        scored.append((score,index))\n    return [index for score,index in sorted(scored, reverse=True)]"
        },
        {
            title: "Validate Agent Tool Arguments",
            difficulty: "ADVANCED",
            prompt: "Validate a proposed transfer tool call. Amount must be numeric, positive and at most the allowed maximum; account must be in the allow-list.",
            example: "args={'account':'fees','amount':900}\nallowed={'fees','books'}, maximum=1000\nOutput: True",
            hint: "Reject missing keys and remember that bool is a subclass of int in Python.",
            starter: "def valid_transfer(args, allowed, maximum):\n    # Write your code\n    pass",
            solution: "def valid_transfer(args, allowed, maximum):\n    if set(args) != {'account', 'amount'}:\n        return False\n    amount = args['amount']\n    numeric = isinstance(amount, (int, float)) and not isinstance(amount, bool)\n    return numeric and 0 < amount <= maximum and args['account'] in allowed"
        },
        {
            title: "Run a Bounded Agent Loop",
            difficulty: "ADVANCED",
            prompt: "Execute a deterministic policy until it returns done or the maximum number of steps is reached. Return the final status and trace.",
            example: "policy states: lookup → calculate → done, max_steps=4\nOutput: ('complete', ['lookup','calculate'])",
            hint: "Check completion before calling a tool, append every action, and return a safe budget status when the loop ends.",
            starter: "def run_agent(policy, execute, state, max_steps):\n    # Write your code\n    pass",
            solution: "def run_agent(policy, execute, state, max_steps):\n    trace = []\n    for _ in range(max_steps):\n        decision = policy(state)\n        if decision['type'] == 'done':\n            return 'complete', trace\n        action = decision['action']\n        observation = execute(action)\n        trace.append(action)\n        state = {**state, 'last_observation': observation}\n    return 'budget_exhausted', trace"
        }
    ];

    function readProgress() {
        try { return JSON.parse(window.localStorage.getItem(PROGRESS_KEY)) || {}; } catch (error) { return {}; }
    }

    function writeProgress(update) {
        const progress = readProgress();
        Object.keys(update).forEach(function (key) { progress[key] = update[key]; });
        try { window.localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress)); } catch (error) { /* Storage is optional. */ }
    }

    function initProblems() {
        const list = get("problemList");
        if (!list || list.dataset.cbActive) return;
        list.dataset.cbActive = "true";
        const progress = readProgress();
        const solved = progress.solved || {};
        list.innerHTML = PROBLEMS.map(function (problem, index) {
            return '<article class="aiml-problem-card" data-problem="' + index + '"><div class="aiml-problem-head"><div><span>PROBLEM ' + String(index + 1).padStart(2, "0") + ' • ' + problem.difficulty + '</span><h3>' + escapeHtml(problem.title) + '</h3></div><strong>100 points</strong></div><p>' + escapeHtml(problem.prompt) + '</p><pre class="aiml-problem-example">' + escapeHtml(problem.example) + '</pre><div class="aiml-problem-actions"><button type="button" data-action="workspace">Open Workspace</button><button type="button" data-action="hint">Show Hint</button><button type="button" data-action="solution">Show Model Program</button><label><input type="checkbox" data-action="solved" ' + (solved[index] ? "checked" : "") + '> Solved independently</label></div><div class="aiml-problem-reveal" data-panel="workspace" hidden><span>YOUR PYTHON WORKSPACE</span><textarea spellcheck="false">' + escapeHtml(problem.starter) + '</textarea></div><div class="aiml-problem-reveal" data-panel="hint" hidden><span>HINT</span><p>' + escapeHtml(problem.hint) + '</p></div><div class="aiml-problem-reveal" data-panel="solution" hidden><span>MODEL PROGRAM</span><pre><code>' + escapeHtml(problem.solution) + '</code></pre></div></article>';
        }).join("");

        function updateSummary() {
            const checked = list.querySelectorAll('input[data-action="solved"]:checked').length;
            get("problemSolvedCount").textContent = checked + " / " + PROBLEMS.length;
            get("problemScore").textContent = (checked * 100) + " / " + (PROBLEMS.length * 100);
            get("problemProgressBar").style.width = (checked / PROBLEMS.length * 100) + "%";
        }

        list.addEventListener("click", function (event) {
            const button = event.target.closest("button[data-action]");
            if (!button) return;
            const card = button.closest(".aiml-problem-card");
            const panel = card.querySelector('[data-panel="' + button.dataset.action + '"]');
            if (!panel) return;
            panel.hidden = !panel.hidden;
            button.textContent = panel.hidden ? (button.dataset.action === "workspace" ? "Open Workspace" : (button.dataset.action === "hint" ? "Show Hint" : "Show Model Program")) : (button.dataset.action === "workspace" ? "Close Workspace" : (button.dataset.action === "hint" ? "Hide Hint" : "Hide Model Program"));
        });
        list.addEventListener("change", function (event) {
            if (event.target.dataset.action !== "solved") return;
            const values = {};
            Array.prototype.forEach.call(list.querySelectorAll('input[data-action="solved"]'), function (checkbox, index) { if (checkbox.checked) values[index] = true; });
            writeProgress({ solved: values });
            updateSummary();
        });
        updateSummary();
    }

    const QUIZ = [
        { q: "What does a generative model learn?", options: ["A fixed lookup table only", "A representation of how data may be produced", "Only class boundaries", "A database permission policy"], answer: 1, why: "Generative models learn or approximate a data distribution so they can create or score possible observations." },
        { q: "Which statement best describes RAG?", options: ["It permanently retrains a model for every question", "It retrieves external evidence before generation", "It removes the need for evaluation", "It is another name for beam search"], answer: 1, why: "RAG constructs request-time context from external retrieved evidence; it does not necessarily change model parameters." },
        { q: "Why can small chunks hurt retrieval?", options: ["They always increase cost", "They can separate a fact from required context", "They prevent metadata filtering", "They make embeddings impossible"], answer: 1, why: "Small chunks may be precise but can lose definitions, conditions or neighbouring sentences needed to answer correctly." },
        { q: "When is hybrid retrieval useful?", options: ["When exact terms and semantic paraphrases both matter", "Only when no index exists", "Only for image generation", "When authorization should be bypassed"], answer: 0, why: "Lexical and dense retrieval offer complementary evidence, so hybrid fusion can improve candidate recall." },
        { q: "A cited source mentions the topic but does not support the claim. What failed?", options: ["Only latency", "Citation correctness and faithfulness", "Tokenization only", "Model compression"], answer: 1, why: "A citation must directly support the nearby factual claim; topic similarity alone is insufficient." },
        { q: "What should happen when authorized evidence is insufficient?", options: ["Invent a likely answer", "Reveal private evidence", "Abstain or ask for clarification", "Increase temperature"], answer: 2, why: "An honest missing-evidence path is safer and more useful than an unsupported fluent completion." },
        { q: "Where should tool authorization be enforced?", options: ["Only inside the model prompt", "In deterministic application code", "Inside retrieved documents", "By increasing context length"], answer: 1, why: "The application must validate actual identity, permissions and arguments independently of model text." },
        { q: "Why does an agent need a maximum-step budget?", options: ["To guarantee model truth", "To bound loops, cost and repeated actions", "To remove all tool errors", "To train embeddings"], answer: 1, why: "Budgets provide an enforceable stop condition when the agent fails to make progress or tools return errors." },
        { q: "How should retrieved instructions be treated?", options: ["As higher priority than system rules", "As untrusted data", "As tool authorization", "As a guaranteed answer"], answer: 1, why: "Retrieved content may contain prompt injection, stale statements or malicious instructions and must remain untrusted evidence." },
        { q: "Which evaluation is most complete?", options: ["One model benchmark", "Only answer fluency", "Retrieval, generation, agent traces, safety, cost and human impact", "Only token count"], answer: 2, why: "The product depends on multiple components and operational boundaries, so evaluation must cover them and the end-to-end outcome." }
    ];

    function initQuiz() {
        const list = get("quizQuestions");
        const checkButton = get("checkQuiz");
        const resetButton = get("resetQuiz");
        if (!list || !checkButton || list.dataset.cbActive) return;
        list.dataset.cbActive = "true";
        list.innerHTML = QUIZ.map(function (item, index) {
            return '<article class="aiml-quiz-question" data-question="' + index + '"><h3>' + (index + 1) + ". " + escapeHtml(item.q) + '</h3><div>' + item.options.map(function (option, optionIndex) { return '<label><input type="radio" name="level22q' + index + '" value="' + optionIndex + '"><span>' + String.fromCharCode(65 + optionIndex) + ". " + escapeHtml(option) + "</span></label>"; }).join("") + '</div><p class="aiml-quiz-feedback" hidden></p></article>';
        }).join("");

        checkButton.addEventListener("click", function () {
            let correct = 0;
            QUIZ.forEach(function (item, index) {
                const card = list.querySelector('[data-question="' + index + '"]');
                const selected = card.querySelector("input:checked");
                const feedback = card.querySelector(".aiml-quiz-feedback");
                const selectedValue = selected ? Number(selected.value) : -1;
                const isCorrect = selectedValue === item.answer;
                if (isCorrect) correct += 1;
                card.classList.toggle("correct", isCorrect);
                card.classList.toggle("incorrect", !isCorrect);
                feedback.hidden = false;
                feedback.innerHTML = '<strong>' + (isCorrect ? "Correct." : "Correct answer: " + String.fromCharCode(65 + item.answer) + ".") + '</strong> ' + escapeHtml(item.why);
            });
            get("quizScore").textContent = correct + " / " + QUIZ.length + " correct";
            writeProgress({ quizScore: correct });
        });
        resetButton.addEventListener("click", function () {
            list.querySelectorAll("input").forEach(function (input) { input.checked = false; });
            list.querySelectorAll(".aiml-quiz-question").forEach(function (card) { card.classList.remove("correct", "incorrect"); card.querySelector(".aiml-quiz-feedback").hidden = true; });
            get("quizScore").textContent = "Not checked yet";
        });
    }

    const INTERVIEWS = [
        ["Compare autoregressive models, VAEs, GANs and diffusion models.", "Autoregressive models factorize probability across an ordered sequence and generate one element at a time. VAEs optimize reconstruction plus latent-distribution regularization and enable smooth latent sampling. GANs train a generator against a discriminator in an adversarial game. Diffusion models learn to reverse a gradual noising process. Compare objectives, likelihood access, sample quality, stability, controllability and inference cost."],
        ["What is retrieval-augmented generation?", "RAG retrieves authorized external evidence for the current query, assembles a bounded context and conditions generation on that context. It can improve freshness and provenance without changing model weights, but still needs ingestion quality, filters, retrieval evaluation, grounding checks and citations."],
        ["How do BM25 and dense retrieval differ?", "BM25 uses lexical term frequency, inverse document frequency and document-length normalization, so it is strong for exact names and rare tokens. Dense retrieval compares learned embeddings and can connect semantic paraphrases. Hybrid systems combine their complementary candidate sets and may apply a cross-encoder reranker."],
        ["How do you choose chunk size and overlap?", "Start from the information unit users need, source structure and model context budget. Small chunks improve precision but may lose conditions; large chunks preserve context but dilute relevance. Overlap protects facts near boundaries but increases index size and duplicate retrieval. Evaluate recall, redundancy and answer support on realistic queries."],
        ["What is the difference between relevance, correctness and faithfulness?", "Relevance asks whether retrieved context is useful for the question. Correctness asks whether the response matches reality or a trusted reference. Faithfulness asks whether the response's factual claims are supported by the supplied evidence. A response can be correct from model memory but unfaithful to its cited context."],
        ["How would you evaluate citations?", "Check citation existence, valid source identity, placement near the claim, source authority and freshness, and whether the cited passage directly entails the claim. Evaluate at claim level, include unsupported and conflicting cases, and distinguish retrieval failure from citation-selection failure."],
        ["What makes a system an agent?", "An agent maintains task state and repeatedly selects actions, invokes bounded tools, observes results, updates state and tests a completion condition. A reliable agent also has permission checks, typed tools, budgets, timeouts, retry and idempotency policies, trace logging and human approval for high-impact actions."],
        ["Reactive versus plan-first agents?", "Reactive agents choose the next action from current state and can adapt quickly but may wander. Plan-first agents expose a sequence that improves inspectability but can become stale after observations. A practical design uses a short revisable plan, executes one validated action, then replans or verifies from updated state."],
        ["How do you defend an agent against prompt injection?", "Separate trusted instructions from untrusted user, retrieved and tool content; apply least-privilege tools; validate identity, target and arguments in application code; restrict data flow; require approval for dangerous side effects; bound steps and cost; log decisions; and test attacks. A prompt warning alone is not an authorization control."],
        ["Why are idempotency and budgets important?", "Idempotency prevents a retried side-effecting call from creating duplicate transfers, emails or records. Step, time, token and cost budgets force termination when the agent repeats or errors. Together with checkpoints and approval, they make recovery observable and limit blast radius."],
        ["How would you evaluate a complete RAG agent?", "Freeze model, prompt, corpus, index and tools; build normal, slice, unanswerable, conflicting and adversarial cases; measure retrieval recall and ranking, claim support, task success, tool selection and arguments, safety, latency and cost; inspect traces; calibrate automated judges against humans; then monitor the same failure taxonomy in production."],
        ["When should you fine-tune instead of using RAG or prompting?", "Use prompting for task instructions and output contracts, RAG for refreshable external facts and provenance, and fine-tuning for durable behavior, style or specialized patterns demonstrated by examples. They can be combined. Decide using measurable failure cause, maintenance needs, privacy, latency, data quality and total cost." ]
    ];

    function initInterviews() {
        const list = get("interviewList");
        if (!list || list.dataset.cbActive) return;
        list.dataset.cbActive = "true";
        list.innerHTML = INTERVIEWS.map(function (item, index) {
            return '<article><button type="button" aria-expanded="false"><span>' + (index + 1) + '.</span><strong>' + escapeHtml(item[0]) + '</strong><b>+</b></button><div hidden><p>' + escapeHtml(item[1]) + "</p></div></article>";
        }).join("");
        list.addEventListener("click", function (event) {
            const button = event.target.closest("button");
            if (!button) return;
            const answer = button.nextElementSibling;
            const opening = answer.hidden;
            answer.hidden = !opening;
            button.setAttribute("aria-expanded", String(opening));
            button.querySelector("b").textContent = opening ? "−" : "+";
        });
    }

    function init() {
        initRagLab();
        initAgentLab();
        initTracer();
        initProblems();
        initQuiz();
        initInterviews();
    }

    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
    else init();
}());
