(function () {
    "use strict";

    const PROGRESS_KEY = "codebhavya-aiml-level-26-progress-v1";
    const get = function (id) { return document.getElementById(id); };

    function escapeHtml(value) {
        return String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\"/g, "&quot;").replace(/'/g, "&#039;");
    }

    function fixed(value, digits) {
        return Number(value).toFixed(digits === undefined ? 2 : digits);
    }

    function clamp(value, low, high) {
        return Math.max(low, Math.min(high, value));
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

    const PROJECT_SCENARIOS = {
        placement: {
            name: "Placement opportunity ranker",
            user: "student placement team",
            action: "rank relevant opportunities",
            metric: "NDCG@10",
            baseline: "popularity ranking",
            candidate: "hybrid skill + behavior ranker",
            evidence: 5,
            complexity: 1.00
        },
        churn: {
            name: "Subscription churn intervention",
            user: "retention operations team",
            action: "prioritize customers for outreach",
            metric: "PR-AUC + recall at capacity",
            baseline: "recency heuristic",
            candidate: "calibrated gradient boosting",
            evidence: 6,
            complexity: 1.06
        },
        rag: {
            name: "Grounded support assistant",
            user: "customer support agent",
            action: "retrieve evidence and draft an answer",
            metric: "retrieval recall + faithfulness",
            baseline: "keyword retrieval",
            candidate: "hybrid retrieval + cited generation",
            evidence: 7,
            complexity: 1.13
        }
    };

    const PROJECT_STAGES = [
        { name: "Problem", artifact: "Decision contract", next: "Validate the available data and leakage boundary." },
        { name: "Data", artifact: "Data card + validation report", next: "Create the simplest meaningful baseline." },
        { name: "Baseline", artifact: "Baseline experiment", next: "Train one justified candidate under the same protocol." },
        { name: "Model", artifact: "Versioned candidate + experiment log", next: "Measure generalization, slices and failure modes." },
        { name: "Evaluate", artifact: "Evaluation + error-analysis report", next: "Package one reliable demonstration path." },
        { name: "Ship", artifact: "Runnable demo + tests + monitoring plan", next: "Prepare the project story and difficult trade-offs." },
        { name: "Defend", artifact: "README + architecture + two-minute defence", next: "Use mock feedback to strengthen the weakest evidence." }
    ];

    const SCOPE_RULES = {
        guided: { label: "Focused", target: 78, risk: 0.82, requirements: "training + evaluation + README" },
        balanced: { label: "Placement-ready", target: 90, risk: 1.00, requirements: "pipeline + demo + tests + evidence" },
        advanced: { label: "Advanced", target: 96, risk: 1.18, requirements: "service + monitoring + governance" }
    };

    function projectConstraintText(constraint) {
        const values = {
            quality: "compare models and errors under one protected protocol",
            latency: "measure p95 response time and define a safe fallback",
            interpretability: "justify features and provide local or global explanations",
            lowdata: "report cross-validation variation and control model capacity"
        };
        return values[constraint] || values.quality;
    }

    function buildProjectTrace(scenarioKey, scopeKey, constraint) {
        const scenario = PROJECT_SCENARIOS[scenarioKey] || PROJECT_SCENARIOS.placement;
        const scope = SCOPE_RULES[scopeKey] || SCOPE_RULES.balanced;
        const events = [{
            stageIndex: -1,
            phase: "Ready",
            readiness: 0,
            evidence: 0,
            risk: 92,
            decision: "Frame",
            message: "The idea exists, but no decision contract has been defined.",
            equation: "user + decision + cost + success",
            explanation: "Predict what evidence an interviewer needs before accepting the project claim.",
            artifact: "No project artifact produced yet.",
            next: "Define the user, action, prediction horizon and costly error.",
            scenario: scenario,
            scope: scope
        }];
        PROJECT_STAGES.forEach(function (stage, index) {
            const completion = (index + 1) / PROJECT_STAGES.length;
            const scopePressure = scopeKey === "advanced" ? 4 : (scopeKey === "guided" ? -2 : 0);
            const readiness = Math.round(clamp(completion * scope.target - scopePressure * (1 - completion), 0, 100));
            const risk = Math.round(clamp((88 - completion * 67) * scenario.complexity * scope.risk, 9, 98));
            let message;
            let equation;
            let explanation;
            if (index === 0) {
                message = "The project now connects a real user to one measurable decision.";
                equation = scenario.user + " → " + scenario.action;
                explanation = "The decision contract defines prediction horizon, error cost and success evidence before modeling begins.";
            } else if (index === 1) {
                message = "The data boundary is documented and the split can represent future use.";
                equation = "train data ∩ protected evaluation = ∅";
                explanation = "Schema checks, label definition, consent and leakage risks are reviewable.";
            } else if (index === 2) {
                message = "A simple baseline establishes the minimum evidence the candidate must beat.";
                equation = scenario.baseline + " → " + scenario.metric;
                explanation = "The baseline uses the same split and metric as every later experiment.";
            } else if (index === 3) {
                message = "One justified candidate is trained with reproducible configuration and lineage.";
                equation = scenario.candidate + " vs " + scenario.baseline;
                explanation = "Each change answers one experiment question instead of creating an uncontrolled model search.";
            } else if (index === 4) {
                message = "The project claim is supported by metrics, slices, uncertainty and error analysis.";
                equation = scenario.metric + " + slices + errors + uncertainty";
                explanation = "The primary constraint requires you to " + projectConstraintText(constraint) + ".";
            } else if (index === 5) {
                message = "A reviewer can run the primary flow and observe safe behavior under failure.";
                equation = "artifact + interface + tests + fallback";
                explanation = "The demonstration includes the approved preprocessing, decision policy and one bounded operating path.";
            } else {
                message = "The project is placement-ready because every major claim points to reviewable evidence.";
                equation = "problem × evidence × ownership × communication";
                explanation = "The final defence includes the strongest result, a limitation, a failed attempt and the next experiment.";
            }
            events.push({
                stageIndex: index,
                phase: stage.name,
                readiness: readiness,
                evidence: index + 1,
                risk: risk,
                decision: index === PROJECT_STAGES.length - 1 ? "Defend" : "Continue",
                message: message,
                equation: equation,
                explanation: explanation,
                artifact: stage.artifact + " • " + scope.requirements,
                next: stage.next,
                scenario: scenario,
                scope: scope
            });
        });
        return events;
    }

    function drawProject(context, width, height, event) {
        context.clearRect(0, 0, width, height);
        context.fillStyle = "#06182c";
        context.fillRect(0, 0, width, height);
        const compact = width < 560;
        const margin = compact ? 20 : 34;
        const columns = compact ? 2 : 4;
        const gap = compact ? 9 : 12;
        const cardWidth = (width - margin * 2 - gap * (columns - 1)) / columns;
        const cardHeight = compact ? 67 : 78;
        context.fillStyle = "#b9d8ef";
        context.font = "800 11px Arial";
        context.fillText(event.scenario.name.toUpperCase(), margin, 24);
        context.textAlign = "right";
        context.fillText(event.scope.label.toUpperCase() + " SCOPE", width - margin, 24);
        context.textAlign = "left";
        PROJECT_STAGES.forEach(function (stage, index) {
            const column = index % columns;
            const row = Math.floor(index / columns);
            const x = margin + column * (cardWidth + gap);
            const y = 45 + row * (cardHeight + 15);
            const complete = index <= event.stageIndex;
            const current = index === event.stageIndex;
            context.fillStyle = current ? "#173f73" : (complete ? "#0d5d4c" : "#0a263f");
            context.strokeStyle = current ? "#facc15" : (complete ? "#34d399" : "#31516d");
            context.lineWidth = current ? 2.5 : 1;
            roundRect(context, x, y, cardWidth, cardHeight, 12);
            context.fill();
            context.stroke();
            context.fillStyle = current ? "#fde047" : "#f0f8ff";
            context.font = "900 " + (compact ? 10 : 11) + "px Arial";
            context.fillText((index + 1) + ". " + stage.name.toUpperCase(), x + 10, y + 24);
            context.fillStyle = complete ? "#a7f3d0" : "#86a9c2";
            context.font = "700 " + (compact ? 8 : 9) + "px Arial";
            context.fillText(complete ? "EVIDENCE READY" : "NOT REVIEWED", x + 10, y + 48);
        });
        const chartY = compact ? 390 : 250;
        const chartHeight = compact ? 205 : 205;
        const chartWidth = width - margin * 2;
        context.fillStyle = "#0a2037";
        roundRect(context, margin, chartY, chartWidth, chartHeight, 14);
        context.fill();
        context.strokeStyle = "#31516d";
        context.stroke();
        context.fillStyle = "#7dd3fc";
        context.font = "900 10px Arial";
        context.fillText("PLACEMENT EVIDENCE COVERAGE", margin + 16, chartY + 25);
        const bars = [
            ["Problem clarity", event.stageIndex >= 0 ? 92 : 12],
            ["Data + baseline", event.stageIndex >= 2 ? 86 : Math.max(8, (event.stageIndex + 1) * 24)],
            ["Evaluation", event.stageIndex >= 4 ? 88 : Math.max(6, event.stageIndex * 16)],
            ["Demo + defence", event.stageIndex >= 6 ? 91 : Math.max(5, (event.stageIndex - 3) * 24)]
        ];
        bars.forEach(function (bar, index) {
            const y = chartY + 49 + index * 33;
            const labelWidth = compact ? 105 : 125;
            const available = chartWidth - labelWidth - 50;
            context.fillStyle = "#b8d3e8";
            context.font = "700 10px Arial";
            context.fillText(bar[0], margin + 16, y + 8);
            context.fillStyle = "#1d3a54";
            roundRect(context, margin + labelWidth, y, available, 10, 5);
            context.fill();
            context.fillStyle = index === 3 ? "#facc15" : "#22d3ee";
            roundRect(context, margin + labelWidth, y, available * bar[1] / 100, 10, 5);
            context.fill();
            context.fillStyle = "#e6f3fc";
            context.textAlign = "right";
            context.fillText(bar[1] + "%", width - margin - 13, y + 9);
            context.textAlign = "left";
        });
    }

    function initProjectLab() {
        const canvas = get("projectCanvas");
        if (!canvas || canvas.dataset.cbActive) return;
        canvas.dataset.cbActive = "true";
        const controls = ["projectScenario", "projectScope", "projectConstraint"].map(get);
        const next = get("projectNext");
        const auto = get("projectAuto");
        const pause = get("projectPause");
        const reset = get("projectReset");
        let events = [];
        let position = 0;
        let timer = null;
        function stop() { if (timer !== null) window.clearInterval(timer); timer = null; pause.disabled = true; }
        function rebuild() {
            stop();
            events = buildProjectTrace(get("projectScenario").value, get("projectScope").value, get("projectConstraint").value);
            position = 0;
            render();
        }
        function render() {
            const event = events[Math.min(position, events.length - 1)];
            const prepared = prepareCanvas(canvas, 500, 650);
            drawProject(prepared.context, prepared.width, prepared.height, event);
            get("projectPhase").textContent = event.phase;
            get("projectReadiness").textContent = event.readiness + "%";
            get("projectEvidence").textContent = event.evidence + " / 7";
            get("projectRisk").textContent = event.risk >= 65 ? "High" : (event.risk >= 35 ? "Medium" : "Low");
            get("projectDecision").textContent = event.decision;
            get("projectVerdict").textContent = event.message;
            get("projectEquation").textContent = event.equation;
            get("projectExplanation").textContent = event.explanation;
            get("projectEvidenceText").textContent = event.artifact;
            get("projectNextCheck").textContent = event.next;
            next.disabled = position >= events.length - 1;
            auto.disabled = position >= events.length - 1 || timer !== null;
            pause.disabled = timer === null;
        }
        function advance() { if (position < events.length - 1) position += 1; render(); if (position >= events.length - 1) stop(); }
        controls.forEach(function (control) { control.addEventListener("change", rebuild); });
        next.addEventListener("click", function () { stop(); advance(); });
        auto.addEventListener("click", function () { if (timer !== null || position >= events.length - 1) return; timer = window.setInterval(advance, 650); render(); });
        pause.addEventListener("click", function () { stop(); render(); });
        reset.addEventListener("click", rebuild);
        window.addEventListener("resize", render);
        rebuild();
    }

    const INTERVIEW_ROUNDS = ["Screening", "Coding", "SQL / Data", "ML Theory", "Project Defence", "System Design", "Behavioural"];
    const ROLE_WEIGHTS = {
        analyst: [0.08, 0.13, 0.27, 0.18, 0.16, 0.08, 0.10],
        engineer: [0.06, 0.22, 0.12, 0.18, 0.17, 0.17, 0.08],
        applied: [0.06, 0.16, 0.08, 0.21, 0.20, 0.21, 0.08]
    };
    const PROFILE_SCORES = {
        balanced: [78, 75, 73, 76, 79, 72, 80],
        coding: [77, 88, 81, 61, 69, 70, 74],
        theory: [82, 62, 65, 90, 72, 77, 78],
        project: [76, 60, 66, 74, 91, 82, 84]
    };
    const COMPANY_MODIFIERS = {
        services: [3, 0, 2, 4, 0, -3, 2],
        product: [0, 1, 0, 0, 2, 3, 0],
        startup: [-1, 2, -2, -1, 4, 5, 1]
    };
    const ROUND_DRILLS = [
        "State your role fit using two verified examples, not generic enthusiasm.",
        "Clarify inputs, derive the approach, discuss complexity and test edge cases aloud.",
        "Write the table grain first; then reason about joins, nulls, duplicates and validation.",
        "Explain one concept through intuition, mechanism, assumption, failure mode and example.",
        "Defend the split, baseline, metric and strongest trade-off using measured evidence.",
        "Begin with the decision and scale; connect data, model, serving, monitoring and fallback.",
        "Use situation, responsibility, action, evidence and learning in one concise story."
    ];

    function buildPlacementTrace(role, profile, company, difficulty) {
        const weights = ROLE_WEIGHTS[role] || ROLE_WEIGHTS.engineer;
        const base = PROFILE_SCORES[profile] || PROFILE_SCORES.balanced;
        const modifiers = COMPANY_MODIFIERS[company] || COMPANY_MODIFIERS.product;
        const penalty = difficulty === "competitive" ? 5 : 0;
        const events = [{ roundIndex: -1, score: null, weighted: 0, confidence: "Low", status: "Ready", message: "Choose a role and begin the first mock round.", evidence: "No round attempted yet.", next: "Attempt screening fundamentals without notes.", scores: [], weights: weights }];
        let cumulative = 0;
        const scores = [];
        INTERVIEW_ROUNDS.forEach(function (round, index) {
            const variation = ((index * 7 + profile.length + company.length) % 7) - 3;
            const score = Math.round(clamp(base[index] + modifiers[index] + variation - penalty, 35, 96));
            scores.push(score);
            cumulative += score * weights[index];
            const attemptedWeight = weights.slice(0, index + 1).reduce(function (sum, value) { return sum + value; }, 0);
            const attemptedAverage = cumulative / attemptedWeight;
            const projectedRemaining = weights.slice(index + 1).reduce(function (sum, weight, offset) { return sum + base[index + 1 + offset] * weight; }, 0);
            const projected = Math.round(cumulative + projectedRemaining);
            const confidence = index < 2 ? "Developing" : (attemptedAverage >= 80 ? "High" : (attemptedAverage >= 68 ? "Moderate" : "Low"));
            const pass = score >= (difficulty === "competitive" ? 72 : 65);
            events.push({
                roundIndex: index,
                score: score,
                weighted: projected,
                confidence: confidence,
                status: index === INTERVIEW_ROUNDS.length - 1 ? (projected >= 74 ? "Placement ready" : "Targeted practice") : (pass ? "Round pass" : "Practice required"),
                message: pass ? round + " evidence meets the current practice threshold." : round + " is the present bottleneck and needs a focused drill.",
                evidence: "Score " + score + "/100 × role weight " + Math.round(weights[index] * 100) + "% • projected readiness " + projected + "%",
                next: index === INTERVIEW_ROUNDS.length - 1 ? "Repeat the lowest-scoring round under timed conditions." : ROUND_DRILLS[index + 1],
                scores: scores.slice(),
                weights: weights
            });
        });
        return events;
    }

    function drawPlacement(context, width, height, event) {
        context.clearRect(0, 0, width, height);
        context.fillStyle = "#06182c";
        context.fillRect(0, 0, width, height);
        const margin = width < 560 ? 28 : 48;
        const chartTop = 48;
        const chartBottom = height - 72;
        const chartHeight = chartBottom - chartTop;
        const chartWidth = width - margin * 2;
        context.fillStyle = "#b9d8ef";
        context.font = "800 11px Arial";
        context.fillText("ROLE-WEIGHTED MOCK PERFORMANCE", margin, 24);
        context.strokeStyle = "#24445f";
        context.lineWidth = 1;
        [50, 70, 90].forEach(function (mark) {
            const y = chartBottom - mark / 100 * chartHeight;
            context.beginPath(); context.moveTo(margin, y); context.lineTo(width - margin, y); context.stroke();
            context.fillStyle = mark === 70 ? "#facc15" : "#6f91aa";
            context.font = "700 9px Arial";
            context.fillText(mark + "%", margin + 3, y - 5);
        });
        const groupWidth = chartWidth / INTERVIEW_ROUNDS.length;
        INTERVIEW_ROUNDS.forEach(function (round, index) {
            const score = event.scores[index];
            const x = margin + index * groupWidth + groupWidth * 0.18;
            const barWidth = groupWidth * 0.62;
            context.fillStyle = "#102d48";
            roundRect(context, x, chartTop, barWidth, chartHeight, 7);
            context.fill();
            if (score !== undefined) {
                const barHeight = score / 100 * chartHeight;
                const color = score >= 80 ? "#34d399" : (score >= 70 ? "#22d3ee" : "#fb7185");
                context.fillStyle = color;
                roundRect(context, x, chartBottom - barHeight, barWidth, barHeight, 7);
                context.fill();
                context.fillStyle = "#ffffff";
                context.font = "900 10px Arial";
                context.textAlign = "center";
                context.fillText(score, x + barWidth / 2, chartBottom - barHeight - 8);
            }
            context.save();
            context.translate(x + barWidth / 2, chartBottom + 15);
            context.rotate(-0.45);
            context.fillStyle = index === event.roundIndex ? "#fde047" : "#9dbbd0";
            context.font = "800 " + (width < 560 ? 8 : 9) + "px Arial";
            context.textAlign = "right";
            context.fillText(round.toUpperCase(), 0, 0);
            context.restore();
        });
        context.textAlign = "left";
        const ringX = width - margin - 38;
        const ringY = 27;
        context.strokeStyle = "#31516d";
        context.lineWidth = 5;
        context.beginPath(); context.arc(ringX, ringY, 18, 0, Math.PI * 2); context.stroke();
        context.strokeStyle = "#facc15";
        context.beginPath(); context.arc(ringX, ringY, 18, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * event.weighted / 100); context.stroke();
    }

    function initPlacementLab() {
        const canvas = get("placementCanvas");
        if (!canvas || canvas.dataset.cbActive) return;
        canvas.dataset.cbActive = "true";
        const controls = ["placementRole", "placementProfile", "placementCompany", "placementDifficulty"].map(get);
        const next = get("placementNext");
        const auto = get("placementAuto");
        const pause = get("placementPause");
        const reset = get("placementReset");
        let events = [];
        let position = 0;
        let timer = null;
        function stop() { if (timer !== null) window.clearInterval(timer); timer = null; pause.disabled = true; }
        function rebuild() {
            stop();
            events = buildPlacementTrace(get("placementRole").value, get("placementProfile").value, get("placementCompany").value, get("placementDifficulty").value);
            position = 0;
            render();
        }
        function render() {
            const event = events[Math.min(position, events.length - 1)];
            const prepared = prepareCanvas(canvas, 500, 500);
            drawPlacement(prepared.context, prepared.width, prepared.height, event);
            get("placementRound").textContent = Math.max(0, event.roundIndex + 1) + " / 7";
            get("placementScore").textContent = event.score === null ? "—" : event.score + "%";
            get("placementWeighted").textContent = event.weighted + "%";
            get("placementConfidence").textContent = event.confidence;
            get("placementStatus").textContent = event.status;
            get("placementVerdict").textContent = event.message;
            get("placementEquation").textContent = event.roundIndex < 0 ? "Σ(round score × role weight)" : fixed(event.score / 100, 2) + " × " + fixed(event.weights[event.roundIndex], 2) + " contributes to readiness";
            get("placementExplanation").textContent = event.roundIndex < 0 ? "The score combines correctness, structured reasoning, testing and communication for the selected role." : "Role weights change which weakness is most urgent; use the score as a practice diagnosis rather than a hiring prediction.";
            get("placementEvidence").textContent = event.evidence;
            get("placementNextCheck").textContent = event.next;
            next.disabled = position >= events.length - 1;
            auto.disabled = position >= events.length - 1 || timer !== null;
            pause.disabled = timer === null;
        }
        function advance() { if (position < events.length - 1) position += 1; render(); if (position >= events.length - 1) stop(); }
        controls.forEach(function (control) { control.addEventListener("change", rebuild); });
        next.addEventListener("click", function () { stop(); advance(); });
        auto.addEventListener("click", function () { if (timer !== null || position >= events.length - 1) return; timer = window.setInterval(advance, 650); render(); });
        pause.addEventListener("click", function () { stop(); render(); });
        reset.addEventListener("click", rebuild);
        window.addEventListener("resize", render);
        rebuild();
    }

    const TRACER_CODE = [
        "projects = {'churn': [8, 9, 7, 8],",
        "            'vision': [7, 8, 9, 6],",
        "            'rag': [9, 7, 8, 9]}",
        "weights = [0.20, 0.30, 0.30, 0.20]",
        "best_name = None",
        "best_score = -1",
        "for name, evidence in projects.items():",
        "    score = 0.0",
        "    for value, weight in zip(evidence, weights):",
        "        score += value * weight",
        "    if score > best_score:",
        "        best_name, best_score = name, score",
        "print(best_name, round(best_score, 2))"
    ];

    function buildTracerStates() {
        const states = [];
        const projects = { churn: [8, 9, 7, 8], vision: [7, 8, 9, 6], rag: [9, 7, 8, 9] };
        const weights = [0.20, 0.30, 0.30, 0.20];
        let bestName = "None";
        let bestScore = -1;
        let name = "—";
        let criterion = "—";
        let value = "—";
        let weight = "—";
        let contribution = "—";
        let score = 0;
        let output = "";
        function snapshot(line, explanation, expression) {
            states.push({ line: line, explanation: explanation, expression: expression, output: output || "Waiting for print(...)", variables: { name: String(name), criterion: String(criterion), value: String(value), weight: String(weight), contribution: String(contribution), score: fixed(score, 2), best_name: String(bestName), best_score: fixed(bestScore, 2) } });
        }
        snapshot(1, "Create the first row of project evidence scores.", "churn=[8,9,7,8]");
        snapshot(2, "Add the computer-vision project evidence.", "vision=[7,8,9,6]");
        snapshot(3, "Finish the project dictionary with the RAG project.", "len(projects)=3");
        snapshot(4, "Assign weights to problem, evaluation, engineering and communication evidence.", "sum(weights)=1.00");
        snapshot(5, "No best project has been selected yet.", "best_name=None");
        snapshot(6, "Initialize below every possible project score.", "best_score=-1");
        Object.keys(projects).forEach(function (projectName, outerIndex) {
            name = projectName;
            snapshot(7, "Enter project " + projectName + " in dictionary insertion order.", "name='" + projectName + "'");
            score = 0;
            snapshot(8, "Reset the weighted score for this project.", "score=0.0");
            projects[projectName].forEach(function (projectValue, innerIndex) {
                criterion = innerIndex;
                value = projectValue;
                weight = weights[innerIndex];
                snapshot(9, "Pair evidence criterion " + (innerIndex + 1) + " with its weight.", "value=" + value + ", weight=" + fixed(weight, 2));
                contribution = value * weight;
                score += contribution;
                snapshot(10, "Add this criterion's weighted evidence to the project score.", value + " × " + fixed(weight, 2) + " = " + fixed(contribution, 2));
                snapshot(9, "Return to the inner loop for the next criterion.", innerIndex === weights.length - 1 ? "zip exhausted" : "next criterion");
            });
            snapshot(11, "Compare this complete project score with the best score so far.", fixed(score, 2) + " > " + fixed(bestScore, 2) + " is " + (score > bestScore));
            if (score > bestScore) {
                bestName = name;
                bestScore = score;
                snapshot(12, "Store this project because it is the strongest complete evidence package so far.", "best=('" + bestName + "', " + fixed(bestScore, 2) + ")");
            }
            snapshot(7, "Return to the outer loop for the next project.", outerIndex === Object.keys(projects).length - 1 ? "items exhausted" : "next project");
        });
        output = bestName + " " + fixed(bestScore, 2);
        snapshot(13, "Print the highest-ranked project and its weighted score.", "print(best_name, round(best_score, 2))");
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
        code.innerHTML = TRACER_CODE.map(function (line, index) { return '<div class="aiml-code-line" data-line="' + (index + 1) + '"><span>' + String(index + 1).padStart(2, "0") + '</span><code>' + escapeHtml(line) + "</code></div>"; }).join("");
        function stop() { if (timer !== null) window.clearInterval(timer); timer = null; pause.disabled = true; }
        function render() {
            const state = position > 0 ? states[position - 1] : null;
            code.querySelectorAll(".aiml-code-line").forEach(function (line) { const number = Number(line.dataset.line); line.classList.toggle("is-active", Boolean(state) && number === state.line); line.classList.toggle("is-complete", Boolean(state) && number < state.line); });
            get("tracerStatus").textContent = !state ? "Ready" : (position === states.length ? "Complete" : "Running");
            get("tracerExplanation").textContent = state ? state.explanation : "Press Next to create the project evidence table.";
            get("tracerExpression").textContent = state ? state.expression : "—";
            get("tracerOutput").textContent = state ? state.output : "Waiting for print(...)";
            get("tracerVariables").innerHTML = state ? Object.keys(state.variables).map(function (key) { return '<article class="aiml-variable"><span>' + escapeHtml(key.replace(/_/g, " ")) + '</span><code>' + escapeHtml(state.variables[key]) + "</code></article>"; }).join("") : '<article class="aiml-variable"><span>STATE</span><code>Not started</code></article>';
            previous.disabled = position === 0;
            next.disabled = position >= states.length;
            auto.disabled = position >= states.length || timer !== null;
            pause.disabled = timer === null;
            get("tracerProgress").textContent = "Step " + position + " of " + states.length;
            if (state) { const active = code.querySelector('.aiml-code-line[data-line="' + state.line + '"]'); if (active) active.scrollIntoView({ block: "nearest" }); }
        }
        function advance() { if (position < states.length) position += 1; render(); if (position >= states.length) stop(); }
        toggle.addEventListener("click", function () { const opening = panel.hidden; panel.hidden = !opening; toggle.setAttribute("aria-expanded", String(opening)); toggle.textContent = opening ? "✕ Close Interactive Tracer" : "Open Interactive Tracer"; if (opening) window.setTimeout(function () { panel.scrollIntoView({ behavior: "smooth", block: "nearest" }); }, 50); else stop(); });
        previous.addEventListener("click", function () { stop(); if (position > 0) position -= 1; render(); });
        next.addEventListener("click", function () { stop(); advance(); });
        auto.addEventListener("click", function () { if (position >= states.length || timer !== null) return; timer = window.setInterval(advance, 150); render(); });
        pause.addEventListener("click", function () { stop(); render(); });
        reset.addEventListener("click", function () { stop(); position = 0; render(); });
        render();
    }

    const PROBLEMS = [
        { title: "Summarize Binary-Classification Evidence", difficulty: "BEGINNER", prompt: "Return precision, recall and F1 from true-positive, false-positive and false-negative counts without dividing by zero.", example: "tp=18, fp=6, fn=2\nOutput: (0.75, 0.90, 0.8182)", hint: "Precision uses predicted positives; recall uses actual positives. Set a metric to zero when its denominator is zero.", starter: "def classification_evidence(tp, fp, fn):\n    # Write your code\n    pass", solution: "def classification_evidence(tp, fp, fn):\n    precision = tp / (tp + fp) if tp + fp else 0.0\n    recall = tp / (tp + fn) if tp + fn else 0.0\n    f1 = 2 * precision * recall / (precision + recall) if precision + recall else 0.0\n    return precision, recall, f1", all: [["def classification_evidence"], ["precision"], ["recall"], ["f1"], ["return"]], any: [["tp + fp"], ["tp + fn"], ["if", "max("]] },
        { title: "Rank Portfolio Projects by Evidence", difficulty: "INTERMEDIATE", prompt: "Calculate a weighted evidence score for every project and return names ordered from strongest to weakest.", example: "projects={'a':[8,7],'b':[6,9]}, weights=[.4,.6]\nOutput: ['b','a']", hint: "Use zip for the dot product, then sort name-score pairs by descending score and name for deterministic ties.", starter: "def rank_projects(projects, weights):\n    # Write your code\n    pass", solution: "def rank_projects(projects, weights):\n    scored = []\n    for name, evidence in projects.items():\n        if len(evidence) != len(weights):\n            raise ValueError('dimension mismatch')\n        score = sum(value * weight for value, weight in zip(evidence, weights))\n        scored.append((name, score))\n    scored.sort(key=lambda item: (-item[1], item[0]))\n    return [name for name, _ in scored]", all: [["def rank_projects"], ["projects.items"], ["zip("], ["sort"], ["return"]], any: [["value * weight", "weight * value"], ["len(evidence)"]] },
        { title: "Detect Train–Validation Entity Leakage", difficulty: "INTERMEDIATE", prompt: "Return sorted entity IDs appearing in both training and validation rows.", example: "train=[('u1',1),('u2',0)], valid=[('u2',1)]\nOutput: ['u2']", hint: "Build one set of entity IDs per split and take their intersection.", starter: "def leaked_entities(train_rows, validation_rows):\n    # Write your code\n    pass", solution: "def leaked_entities(train_rows, validation_rows):\n    train_ids = {row[0] for row in train_rows}\n    validation_ids = {row[0] for row in validation_rows}\n    return sorted(train_ids & validation_ids)", all: [["def leaked_entities"], ["train_rows"], ["validation_rows"], ["sorted("], ["return"]], any: [["&", "intersection"]] },
        { title: "Select a Stable Cross-Validation Candidate", difficulty: "ADVANCED", prompt: "Choose the model with the largest mean score minus a stability penalty times its population standard deviation.", example: "scores={'linear':[.80,.82], 'tree':[.86,.70]}, penalty=1\nOutput: 'linear'", hint: "Compute mean and population variance for each model; maximize mean − penalty × standard deviation.", starter: "from math import sqrt\n\ndef select_stable_model(scores, penalty=1.0):\n    # Write your code\n    pass", solution: "from math import sqrt\n\ndef select_stable_model(scores, penalty=1.0):\n    best_name, best_utility = None, float('-inf')\n    for name, values in scores.items():\n        mean = sum(values) / len(values)\n        variance = sum((value - mean) ** 2 for value in values) / len(values)\n        utility = mean - penalty * sqrt(variance)\n        if utility > best_utility:\n            best_name, best_utility = name, utility\n    return best_name", all: [["def select_stable_model"], ["scores.items"], ["mean"], ["variance"], ["sqrt("], ["utility"], ["return"]], any: [["best_utility"], ["sum("]] },
        { title: "Create a Targeted Placement Drill Plan", difficulty: "ADVANCED", prompt: "Allocate a fixed number of practice sessions to skills in proportion to their gaps from role-specific targets.", example: "scores={'coding':60,'ml':80}, targets={'coding':80,'ml':85}, sessions=5\nOutput: allocations summing to 5", hint: "Calculate non-negative gaps, distribute floor shares, then assign remaining sessions by largest fractional remainder.", starter: "def allocate_practice(scores, targets, sessions):\n    # Write your code\n    pass", solution: "def allocate_practice(scores, targets, sessions):\n    gaps = {name: max(0, targets[name] - scores.get(name, 0)) for name in targets}\n    total_gap = sum(gaps.values())\n    if total_gap == 0:\n        return {name: 0 for name in targets}\n    raw = {name: sessions * gap / total_gap for name, gap in gaps.items()}\n    plan = {name: int(value) for name, value in raw.items()}\n    remaining = sessions - sum(plan.values())\n    order = sorted(raw, key=lambda name: (-(raw[name] - plan[name]), name))\n    for name in order[:remaining]:\n        plan[name] += 1\n    return plan", all: [["def allocate_practice"], ["gaps"], ["total_gap"], ["sessions"], ["remaining"], ["sorted("], ["return"]], any: [["max(0"], ["sum("]] }
    ];

    function readProgress() { try { return JSON.parse(window.localStorage.getItem(PROGRESS_KEY)) || {}; } catch (error) { return {}; } }
    function writeProgress(update) { const current = readProgress(); Object.keys(update).forEach(function (key) { current[key] = update[key]; }); try { window.localStorage.setItem(PROGRESS_KEY, JSON.stringify(current)); } catch (error) { /* Storage may be unavailable. */ } }
    function codeMatches(code, problem) {
        const normalized = String(code).toLowerCase().replace(/\s+/g, " ");
        const missing = [];
        problem.all.forEach(function (group) { if (!group.some(function (token) { return normalized.indexOf(token.toLowerCase()) !== -1; })) missing.push(group[0]); });
        problem.any.forEach(function (group) { if (!group.some(function (token) { return normalized.indexOf(token.toLowerCase()) !== -1; })) missing.push(group.join(" or ")); });
        return { pass: missing.length === 0, missing: missing };
    }

    function initProblems() {
        const list = get("problemList");
        if (!list || list.dataset.cbActive) return;
        list.dataset.cbActive = "true";
        const progress = readProgress();
        const records = progress.problems && typeof progress.problems === "object" ? progress.problems : {};
        function scoreFor(index) { return Number(records[index] || 0); }
        function renderSummary() { const scores = PROBLEMS.map(function (_, index) { return scoreFor(index); }); const independent = scores.filter(function (score) { return score >= 100; }).length; const total = scores.reduce(function (sum, score) { return sum + score; }, 0); get("problemSolvedCount").textContent = independent + " / " + PROBLEMS.length; get("problemScore").textContent = total + " / " + (PROBLEMS.length * 100); get("problemProgressBar").style.width = (total / (PROBLEMS.length * 100) * 100) + "%"; }
        list.innerHTML = PROBLEMS.map(function (problem, index) { const number = index + 1; const saved = scoreFor(index); const lines = problem.example.split("\n"); return '<article class="aiml-problem-card' + (saved ? " is-solved" : "") + '" data-problem="' + index + '"><div class="aiml-problem-head"><span class="aiml-problem-number">' + String(number).padStart(2, "0") + '</span><div><h3>' + number + ". " + escapeHtml(problem.title) + '</h3><p>' + escapeHtml(problem.prompt) + '</p></div></div><div class="aiml-problem-data"><span><strong>Difficulty:</strong> ' + escapeHtml(problem.difficulty) + '</span><span><strong>Example:</strong> ' + escapeHtml(lines[0]) + '</span><span><strong>Expected:</strong> <code>' + escapeHtml(lines.slice(1).join(" ")) + '</code></span></div><div class="aiml-problem-actions"><button type="button" class="primary" data-action="workspace">💻 Solve It Yourself</button><button type="button" class="hint" data-action="hint">Hint</button><button type="button" data-action="solution">Show Program</button></div><div class="aiml-problem-reveal" data-panel="hint" hidden><strong>Hint</strong><p>' + escapeHtml(problem.hint) + '</p></div><div class="aiml-problem-reveal" data-panel="solution" hidden><strong>Model program</strong><pre><code>' + escapeHtml(problem.solution) + '</code></pre></div><div class="aiml-workspace" data-panel="workspace" hidden><label for="problemCode' + index + '">Your Python code</label><textarea id="problemCode' + index + '" spellcheck="false">' + escapeHtml(problem.starter) + '</textarea><div class="aiml-workspace-row"><button type="button" data-action="check">Check Answer</button><button type="button" data-action="reset">Reset</button><span class="aiml-check-result" data-result>' + (saved ? "Best saved score: " + saved + "/100" : "Write your solution, then check its structure.") + '</span></div></div></article>'; }).join("");
        list.addEventListener("click", function (event) {
            const button = event.target.closest("button[data-action]"); if (!button) return;
            const card = button.closest(".aiml-problem-card"); const index = Number(card.dataset.problem); const action = button.dataset.action; const problem = PROBLEMS[index];
            if (action === "workspace" || action === "hint" || action === "solution") { const panel = card.querySelector('[data-panel="' + action + '"]'); const opening = panel.hidden; panel.hidden = !opening; if (action === "workspace") button.textContent = opening ? "Close Workspace" : "💻 Solve It Yourself"; if (action === "hint") button.textContent = opening ? "Hide Hint" : "Hint"; if (action === "solution") { button.textContent = opening ? "Hide Program" : "Show Program"; if (opening) card.dataset.usedSolution = "true"; } return; }
            const textarea = card.querySelector("textarea"); const result = card.querySelector("[data-result]");
            if (action === "reset") { textarea.value = problem.starter; result.textContent = "Workspace reset. Your saved best score is unchanged."; result.className = "aiml-check-result"; delete card.dataset.usedSolution; return; }
            if (action === "check") { const check = codeMatches(textarea.value, problem); if (!check.pass) { result.textContent = "Keep working. Missing structural evidence: " + check.missing.join(", ") + "."; result.className = "aiml-check-result error"; return; } const earned = card.dataset.usedSolution === "true" ? 60 : 100; records[index] = Math.max(scoreFor(index), earned); writeProgress({ problems: records }); card.classList.add("is-solved"); result.textContent = earned === 100 ? "Independent solution pattern accepted — 100/100." : "Solution pattern accepted after viewing the model — 60/100."; result.className = "aiml-check-result success"; renderSummary(); }
        });
        renderSummary();
    }

    const QUIZ = [
        { q: "What should define a capstone before model selection?", options: ["A fashionable algorithm", "A user, decision, constraint and measurable success condition", "A large notebook", "A cloud provider"], answer: 1, explanation: "Decision framing determines the label, data boundary, cost, metrics and system requirements before a model is chosen." },
        { q: "Why include a simple baseline?", options: ["To avoid evaluation", "To prove whether added complexity creates value", "To increase repository size", "To replace the final model automatically"], answer: 1, explanation: "A baseline establishes the minimum performance and makes the incremental value of the candidate measurable." },
        { q: "Which split is safest for predicting future customer churn?", options: ["Randomly mix future and past rows", "Train on earlier periods and validate on later periods", "Use the test set for tuning", "Duplicate rare customers across splits"], answer: 1, explanation: "A temporal split preserves the direction of deployment and reduces future-information leakage." },
        { q: "What does an ablation test?", options: ["Whether one component contributes measurable value", "Whether all metrics are equal", "Whether the README is long", "Whether the dataset can be deleted"], answer: 0, explanation: "Removing or replacing one component under the same protocol isolates its contribution." },
        { q: "What makes a resume project bullet credible?", options: ["Many tool names", "An owned action, evaluation method and quantified evidence", "An unsupported business claim", "A copied project title"], answer: 1, explanation: "A credible bullet identifies what you built or changed and attaches a verifiable measurement without exaggerating impact." },
        { q: "How should you answer a coding-round problem?", options: ["Code immediately without questions", "Clarify, derive, analyze, implement and test", "Memorize one solution", "Ignore edge cases"], answer: 1, explanation: "The interviewer needs to observe problem clarification, algorithmic reasoning, complexity awareness and validation." },
        { q: "What comes first in an ML system-design interview?", options: ["Choose a transformer", "Clarify the decision, scale, latency, errors and success", "Draw every cloud service", "Tune hyperparameters"], answer: 1, explanation: "Requirements and constraints determine the data, model, serving and monitoring design." },
        { q: "Why report evaluation slices?", options: ["To hide the global metric", "To reveal uneven behavior across meaningful groups or conditions", "To guarantee fairness", "To replace sample counts"], answer: 1, explanation: "Slices expose important failure patterns that a global average can hide; counts and uncertainty are still required." },
        { q: "What is the strongest response when you do not know an answer?", options: ["Invent a confident explanation", "State what is known, identify uncertainty and propose how to test it", "Change the topic", "Say the question is irrelevant"], answer: 1, explanation: "Clear boundaries and a disciplined investigation plan demonstrate trustworthy engineering judgment." },
        { q: "What makes a mock interview useful?", options: ["Completing it once", "Turning observed weakness into a focused drill and retest", "Receiving only a total score", "Reading answers during the attempt"], answer: 1, explanation: "Practice improves when specific evidence becomes a targeted action and the same skill is tested again under constraint." }
    ];

    function initQuiz() {
        const list = get("quizQuestions"); if (!list || list.dataset.cbActive) return; list.dataset.cbActive = "true";
        list.innerHTML = QUIZ.map(function (item, index) { return '<article class="aiml-quiz-question" data-quiz-question="' + index + '"><strong>' + (index + 1) + ". " + escapeHtml(item.q) + '</strong><div class="aiml-quiz-options">' + item.options.map(function (option, optionIndex) { return '<label class="aiml-quiz-option"><input type="radio" name="quiz' + index + '" value="' + optionIndex + '"><span>' + String.fromCharCode(65 + optionIndex) + ". " + escapeHtml(option) + "</span></label>"; }).join("") + '</div><div class="aiml-quiz-explanation" hidden></div></article>'; }).join("");
        list.addEventListener("change", function (event) { const question = event.target.closest(".aiml-quiz-question"); if (!question) return; question.querySelectorAll(".aiml-quiz-option").forEach(function (option) { option.classList.toggle("is-selected", option.querySelector("input").checked); }); });
        get("checkQuiz").addEventListener("click", function () { let correct = 0; QUIZ.forEach(function (item, index) { const question = list.querySelector('[data-quiz-question="' + index + '"]'); const selected = question.querySelector("input:checked"); question.querySelectorAll(".aiml-quiz-option").forEach(function (option) { const value = Number(option.querySelector("input").value); option.classList.toggle("is-correct", value === item.answer); option.classList.toggle("is-wrong", Boolean(selected) && option.querySelector("input").checked && value !== item.answer); }); if (selected && Number(selected.value) === item.answer) correct += 1; const explanation = question.querySelector(".aiml-quiz-explanation"); explanation.hidden = false; explanation.textContent = (selected ? "Correct answer: " : "Not answered. Correct answer: ") + String.fromCharCode(65 + item.answer) + ". " + item.options[item.answer] + " — " + item.explanation; }); get("quizScore").textContent = correct + " / " + QUIZ.length + " correct"; writeProgress({ quizScore: correct }); });
        get("resetQuiz").addEventListener("click", function () { list.querySelectorAll("input").forEach(function (input) { input.checked = false; }); list.querySelectorAll(".aiml-quiz-option").forEach(function (option) { option.className = "aiml-quiz-option"; }); list.querySelectorAll(".aiml-quiz-explanation").forEach(function (explanation) { explanation.hidden = true; explanation.textContent = ""; }); get("quizScore").textContent = "Not checked yet"; });
    }

    const INTERVIEWS = [
        ["Walk me through your strongest ML project.", "Use a compact structure: the user and decision, data and leakage boundary, baseline, decisive experiment, evaluation and error analysis, deployed or demo path, your ownership, one limitation and the next test. Lead with evidence instead of a technology list."],
        ["How did you choose the problem and success metric?", "Explain the action that follows the model output, prediction horizon, error costs and operational constraint. Then connect the metric to that decision—for example recall at a fixed review capacity or NDCG for ranked recommendations."],
        ["Why did you choose this train–validation split?", "Match the split to deployment. Use temporal separation for future prediction, grouped separation when the same entity repeats and stratification when class balance matters. State how preprocessing was fitted only on training data."],
        ["Why is your baseline appropriate?", "A good baseline is simple, reproducible and meaningful for the decision: majority class, heuristic, current business rule or linear model. It defines the minimum value the candidate must exceed under the same evaluation protocol."],
        ["Your model score improved. How do you know the gain is real?", "Compare repeated folds or bootstrap intervals, keep the test set untouched, inspect variation and important slices, control experiment changes and confirm that improvement exceeds measurement noise and does not violate latency or fairness constraints."],
        ["Describe a failed experiment.", "State the hypothesis, controlled change, observed evidence, root-cause investigation and decision. A useful failure story shows that measurement changed your approach—for example a complex model improved training score but hurt temporal validation."],
        ["How would you productionize this project?", "Define the prediction contract, package preprocessing and model together, version the artifact, add schema and integration tests, choose batch or online serving from the deadline, release gradually, monitor service and model health and preserve a fallback."],
        ["How would you improve this project with more time?", "Prioritize one next experiment from current error analysis or product risk. Explain the expected value, required evidence and stopping condition. Avoid listing unrelated technologies that do not address a measured weakness."],
        ["How do you approach an unfamiliar coding problem?", "Clarify inputs and constraints, work through a small example, propose a straightforward solution, improve it if needed, state time and space complexity, implement incrementally and test normal, boundary and invalid cases."],
        ["How do you structure an ML case interview?", "Clarify goal, user, decision, scale, latency and error cost; define target and training example; identify data and leakage; choose a baseline, split and metrics; propose the model and system; then discuss experiment, monitoring, risk and fallback."],
        ["What would make you reject your own model?", "Reject it when evidence violates a non-negotiable requirement: leakage, unstable validation, harmful subgroup behavior, poor calibration, latency or cost budget, privacy risk, inability to reproduce, or no meaningful gain over the baseline."],
        ["Why should we hire you for this role?", "Connect two or three role responsibilities to concise evidence from your work. Show the fundamentals you can apply, the systems or projects you owned, how you respond to uncertainty and the specific contribution you can make—without unsupported claims." ]
    ];

    function initInterviews() {
        const list = get("interviewList"); if (!list || list.dataset.cbActive) return; list.dataset.cbActive = "true";
        list.innerHTML = INTERVIEWS.map(function (item, index) { return '<article class="aiml-interview-item"><div class="aiml-interview-question"><span>' + (index + 1) + '.</span><strong>' + escapeHtml(item[0]) + '</strong><button type="button" aria-expanded="false">Show Answer</button></div><div class="aiml-interview-answer" hidden><p>' + escapeHtml(item[1]) + "</p></div></article>"; }).join("");
        list.addEventListener("click", function (event) { const button = event.target.closest(".aiml-interview-question button"); if (!button) return; const answer = button.closest(".aiml-interview-item").querySelector(".aiml-interview-answer"); const opening = answer.hidden; answer.hidden = !opening; button.textContent = opening ? "Hide Answer" : "Show Answer"; button.setAttribute("aria-expanded", String(opening)); });
    }

    initProjectLab();
    initPlacementLab();
    initTracer();
    initProblems();
    initQuiz();
    initInterviews();
}());
