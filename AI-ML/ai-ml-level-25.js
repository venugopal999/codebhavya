(function () {
    "use strict";

    const PROGRESS_KEY = "codebhavya-aiml-level-25-progress-v1";
    const get = function (id) { return document.getElementById(id); };

    function escapeHtml(value) {
        return String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
    }

    function fixed(value, digits) {
        return Number(value).toFixed(digits === undefined ? 2 : digits);
    }

    function clone(value) {
        return JSON.parse(JSON.stringify(value));
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

    function clamp(value, low, high) {
        return Math.max(low, Math.min(high, value));
    }

    const DEPLOY_SCENARIOS = {
        placement: { name: "Placement ranking", version: "ranker-4.2", baseline: 0.872, quality: 0.901, latency: 76, error: 0.005, gap: 0.052, risk: "medium" },
        credit: { name: "Credit screening", version: "credit-3.7", baseline: 0.842, quality: 0.858, latency: 92, error: 0.007, gap: 0.081, risk: "high" },
        triage: { name: "Medical triage support", version: "triage-2.4", baseline: 0.918, quality: 0.929, latency: 108, error: 0.004, gap: 0.057, risk: "critical" }
    };

    const DEPLOY_POLICIES = {
        strict: { name: "Strict", minGain: 0.006, maxLatency: 100, maxError: 0.008, maxGap: 0.060 },
        balanced: { name: "Balanced", minGain: 0.002, maxLatency: 130, maxError: 0.012, maxGap: 0.100 },
        fast: { name: "Fast", minGain: -0.002, maxLatency: 180, maxError: 0.020, maxGap: 0.150 }
    };

    const DEPLOY_STAGES = ["Contract", "Lineage", "Offline", "Package", "Release", "Observe", "Promote"];

    function deploymentRisk(metrics, policy, scenario) {
        const latencyPressure = metrics.latency / policy.maxLatency;
        const errorPressure = metrics.error / policy.maxError;
        const fairnessPressure = metrics.gap / policy.maxGap;
        const qualityPressure = metrics.gain >= policy.minGain ? 0.35 : 1.2;
        const impact = scenario.risk === "critical" ? 1.20 : (scenario.risk === "high" ? 1.08 : 0.92);
        return Math.round(clamp((latencyPressure + errorPressure + fairnessPressure + qualityPressure) / 4 * 100 * impact, 0, 100));
    }

    function deploymentPass(metrics, policy) {
        return metrics.gain >= policy.minGain && metrics.latency <= policy.maxLatency && metrics.error <= policy.maxError && metrics.gap <= policy.maxGap;
    }

    function buildDeploymentTrace(scenarioKey, strategy, policyKey, initialTraffic) {
        const scenario = DEPLOY_SCENARIOS[scenarioKey] || DEPLOY_SCENARIOS.placement;
        const policy = DEPLOY_POLICIES[policyKey] || DEPLOY_POLICIES.balanced;
        const trafficStart = Number(initialTraffic) || 5;
        const baseMetrics = {
            quality: scenario.quality,
            gain: scenario.quality - scenario.baseline,
            latency: scenario.latency,
            error: scenario.error,
            gap: scenario.gap
        };
        const events = [];

        function snapshot(stageIndex, phase, traffic, decision, message, equation, evidence, next, metrics, pass) {
            const values = clone(metrics || baseMetrics);
            events.push({
                scenario: scenario,
                strategy: strategy,
                policy: policy,
                stageIndex: stageIndex,
                stage: DEPLOY_STAGES[stageIndex],
                phase: phase,
                traffic: traffic,
                decision: decision,
                message: message,
                equation: equation,
                evidence: evidence,
                next: next,
                metrics: values,
                risk: deploymentRisk(values, policy, scenario),
                pass: pass
            });
        }

        snapshot(0, "Ready", 0, "Pending", "The candidate is registered but has not earned production traffic.", "contract ∧ lineage ∧ tests ∧ monitoring", "No release gate evaluated yet.", "Validate the prediction contract and lineage.", baseMetrics, null);
        snapshot(0, "Validation", 0, "Pass", "The typed input and output contract is compatible with the current service.", "schema(candidate) = schema(service)", "Required features: 12/12 • response fields: 4/4 • breaking changes: 0", "Verify reproducible lineage.", baseMetrics, true);
        snapshot(1, "Validation", 0, "Pass", "The artifact resolves to immutable code, data, configuration and environment versions.", "artifact = f(code, data, config, environment)", "Commit 8a43c1 • data v18 • image 3.4 • checksum verified", "Evaluate the candidate against production gates.", baseMetrics, true);

        const offlinePass = baseMetrics.gain >= policy.minGain && baseMetrics.gap <= policy.maxGap;
        snapshot(2, "Offline gates", 0, offlinePass ? "Pass" : "Block", offlinePass ? "Offline quality and subgroup evidence satisfy the selected policy." : "Offline evidence violates a required quality or fairness gate.", "gain ≥ " + fixed(policy.minGain, 3) + " ∧ gap ≤ " + fixed(policy.maxGap, 3), "Gain " + fixed(baseMetrics.gain, 3) + " • quality " + fixed(baseMetrics.quality, 3) + " • TPR gap " + fixed(baseMetrics.gap, 3), offlinePass ? "Package the exact approved artifact." : "Keep production on the champion and investigate the failed gate.", baseMetrics, offlinePass);
        if (!offlinePass) {
            snapshot(2, "Rollback", 0, "Rejected", "The candidate remains outside production; the champion continues serving all traffic.", "traffic(candidate)=0", "Release stopped before exposure • known-good version unchanged", "Improve evidence, register a new immutable candidate and repeat validation.", baseMetrics, false);
            return events;
        }

        const packagePass = baseMetrics.latency <= policy.maxLatency && baseMetrics.error <= policy.maxError;
        snapshot(3, "Package gates", 0, packagePass ? "Pass" : "Block", packagePass ? "Container, API contract, dependency scan and load test pass." : "The packaged service violates a latency or error budget.", "p95 ≤ " + policy.maxLatency + " ms ∧ error ≤ " + fixed(policy.maxError * 100, 1) + "%", "p95 " + baseMetrics.latency + " ms • errors " + fixed(baseMetrics.error * 100, 2) + "% • critical findings 0", packagePass ? "Begin controlled candidate exposure." : "Retain the champion and optimize or resize the service.", baseMetrics, packagePass);
        if (!packagePass) {
            snapshot(3, "Rollback", 0, "Rejected", "The release stops before candidate traffic because the serving SLO is not satisfied.", "traffic(candidate)=0", "No production decisions changed", "Register a corrected artifact and rerun every gate.", baseMetrics, false);
            return events;
        }

        let trafficSteps;
        if (strategy === "shadow") trafficSteps = [0, 0, 0, 0];
        else if (strategy === "bluegreen") trafficSteps = [0, 0, 100];
        else trafficSteps = [trafficStart, Math.max(10, trafficStart * 2), 25, 50, 100].filter(function (value, index, array) { return array.indexOf(value) === index; });

        snapshot(4, strategy === "shadow" ? "Shadow release" : "Controlled release", 0, "Observe", strategy === "shadow" ? "Requests are mirrored, but candidate outputs do not affect users." : "Traffic routing is ready to expose the candidate progressively.", strategy === "shadow" ? "decision = champion(request); observe(candidate(request))" : "traffic(candidate) ← guarded fraction", "Strategy " + strategy + " • rollback pointer verified • dashboards ready", "Process the first observation window.", baseMetrics, true);

        let failed = false;
        trafficSteps.forEach(function (traffic, index) {
            if (failed) return;
            const load = strategy === "shadow" ? 0.35 + index * 0.15 : traffic / 100;
            const metrics = {
                quality: baseMetrics.quality - load * (scenarioKey === "credit" ? 0.002 : 0.001),
                gain: baseMetrics.gain - load * (scenarioKey === "credit" ? 0.002 : 0.001),
                latency: baseMetrics.latency * (1 + load * 0.10),
                error: baseMetrics.error * (1 + load * 0.18),
                gap: baseMetrics.gap + load * (scenarioKey === "credit" ? 0.006 : 0.002)
            };
            const pass = deploymentPass(metrics, policy);
            const displayTraffic = strategy === "shadow" ? 0 : traffic;
            snapshot(5, "Live observation", displayTraffic, pass ? "Continue" : "Rollback", pass ? "The current window passes quality, reliability and fairness gates." : "A live gate fails; candidate exposure must stop.", "all live gates = " + (pass ? "True" : "False"), "Gain " + fixed(metrics.gain, 3) + " • p95 " + fixed(metrics.latency, 0) + " ms • errors " + fixed(metrics.error * 100, 2) + "% • gap " + fixed(metrics.gap, 3), pass ? (index === trafficSteps.length - 1 ? "Complete the release decision." : "Increase exposure only after enough evidence.") : "Route all decisions to the known-good champion.", metrics, pass);
            if (!pass) failed = true;
        });

        if (failed) {
            snapshot(5, "Rollback", 0, "Rolled back", "Traffic returns to the champion and the candidate is quarantined for investigation.", "route(candidate)=0; route(champion)=100", "Rollback complete • incident record opened • candidate version preserved", "Diagnose the failed signal before producing a new candidate.", events[events.length - 1].metrics, false);
        } else if (strategy === "shadow") {
            snapshot(6, "Shadow complete", 0, "Review", "Shadow evidence passes, but no real decision has been delegated to the candidate.", "shadow pass ≠ production approval", "Outputs compared across 4 windows • candidate traffic remained 0%", "Obtain approval for a canary or blue–green production release.", events[events.length - 1].metrics, true);
        } else {
            snapshot(6, "Promoted", 100, "Champion", "The candidate becomes the production champion after every required gate passes.", "champion ← " + scenario.version, "100% traffic • rollback version retained • monitoring remains active", "Continue monitoring and reopen evaluation when behavior or requirements change.", events[events.length - 1].metrics, true);
        }
        return events;
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

    function drawDeployment(context, width, height, event) {
        context.clearRect(0, 0, width, height);
        context.fillStyle = "#06182c";
        context.fillRect(0, 0, width, height);
        const compact = width < 560;
        const margin = compact ? 18 : 28;
        const gap = compact ? 7 : 10;
        const columns = compact ? 2 : 4;
        const rows = Math.ceil(DEPLOY_STAGES.length / columns);
        const cardWidth = (width - margin * 2 - gap * (columns - 1)) / columns;
        const cardHeight = compact ? 64 : 72;
        const startY = 28;

        DEPLOY_STAGES.forEach(function (stage, index) {
            const column = index % columns;
            const row = Math.floor(index / columns);
            const x = margin + column * (cardWidth + gap);
            const y = startY + row * (cardHeight + 12);
            const done = index < event.stageIndex || (index === event.stageIndex && event.pass === true);
            const current = index === event.stageIndex;
            const failed = current && event.pass === false;
            context.fillStyle = failed ? "#6f2635" : (current ? "#173f73" : (done ? "#0e5a46" : "#0b233c"));
            context.strokeStyle = failed ? "#fb7185" : (current ? "#60a5fa" : (done ? "#34d399" : "#31516f"));
            context.lineWidth = current ? 2.5 : 1.2;
            roundRect(context, x, y, cardWidth, cardHeight, 12);
            context.fill();
            context.stroke();
            context.textAlign = "center";
            context.fillStyle = "#f8fafc";
            context.font = "800 " + (compact ? 11 : 12) + "px Arial";
            context.fillText(stage.toUpperCase(), x + cardWidth / 2, y + 26);
            context.fillStyle = failed ? "#fda4af" : (done ? "#86efac" : "#93c5fd");
            context.font = "700 10px Arial";
            context.fillText(failed ? "BLOCK" : (done ? "PASS" : (current ? "ACTIVE" : "WAIT")), x + cardWidth / 2, y + 48);
        });

        const panelY = startY + rows * (cardHeight + 12) + 10;
        context.textAlign = "left";
        context.fillStyle = "#9bdcf6";
        context.font = "800 12px Arial";
        context.fillText(event.scenario.name.toUpperCase() + " • " + event.scenario.version, margin, panelY);
        context.fillStyle = "#dceeff";
        context.font = "700 11px Arial";
        context.fillText("Selected policy: " + event.policy.name + " gates", margin, panelY + 21);

        const bars = [
            { label: "QUALITY GAIN", value: clamp(event.metrics.gain / Math.max(0.001, event.policy.minGain || 0.01), 0, 1.5), text: (event.metrics.gain >= 0 ? "+" : "") + fixed(event.metrics.gain, 3), pass: event.metrics.gain >= event.policy.minGain },
            { label: "LATENCY", value: clamp(event.metrics.latency / event.policy.maxLatency, 0, 1.5), text: fixed(event.metrics.latency, 0) + " / " + event.policy.maxLatency + " ms", pass: event.metrics.latency <= event.policy.maxLatency },
            { label: "ERROR RATE", value: clamp(event.metrics.error / event.policy.maxError, 0, 1.5), text: fixed(event.metrics.error * 100, 2) + "%", pass: event.metrics.error <= event.policy.maxError },
            { label: "TPR GAP", value: clamp(event.metrics.gap / event.policy.maxGap, 0, 1.5), text: fixed(event.metrics.gap, 3), pass: event.metrics.gap <= event.policy.maxGap }
        ];
        const barTop = panelY + 55;
        const barGap = compact ? 54 : 47;
        bars.forEach(function (bar, index) {
            const y = barTop + index * barGap;
            context.fillStyle = "#92b7d0";
            context.font = "800 10px Arial";
            context.fillText(bar.label, margin, y);
            context.textAlign = "right";
            context.fillStyle = bar.pass ? "#86efac" : "#fda4af";
            context.fillText(bar.text, width - margin, y);
            context.textAlign = "left";
            const trackY = y + 10;
            const trackWidth = width - margin * 2;
            context.fillStyle = "#142f49";
            roundRect(context, margin, trackY, trackWidth, 12, 6);
            context.fill();
            context.fillStyle = bar.pass ? "#22c78a" : "#ef5d74";
            roundRect(context, margin, trackY, trackWidth * clamp(bar.value, 0.04, 1), 12, 6);
            context.fill();
            context.strokeStyle = "#facc15";
            context.lineWidth = 2;
            context.beginPath();
            context.moveTo(margin + trackWidth * Math.min(1, bar.label === "QUALITY GAIN" ? 1 : 1), trackY - 3);
            context.lineTo(margin + trackWidth * Math.min(1, bar.label === "QUALITY GAIN" ? 1 : 1), trackY + 15);
            context.stroke();
        });
        const trafficY = Math.min(height - 34, barTop + bars.length * barGap + 12);
        context.fillStyle = "#facc15";
        context.font = "900 18px Arial";
        context.fillText(event.traffic + "%", margin, trafficY);
        context.fillStyle = "#a9c6dc";
        context.font = "700 11px Arial";
        context.fillText("candidate traffic", margin + 54, trafficY);
        context.textAlign = "right";
        context.fillStyle = event.risk >= 80 ? "#fb7185" : (event.risk >= 60 ? "#fde047" : "#86efac");
        context.fillText("computed risk " + event.risk + "/100", width - margin, trafficY);
        context.textAlign = "left";
    }

    function initDeploymentLab() {
        const canvas = get("deployCanvas");
        if (!canvas || canvas.dataset.cbActive) return;
        canvas.dataset.cbActive = "true";
        const controls = ["deployScenario", "deployStrategy", "deployPolicy", "deployTraffic"].map(get);
        const next = get("deployNext");
        const auto = get("deployAuto");
        const pause = get("deployPause");
        const reset = get("deployReset");
        let events = [];
        let position = 0;
        let timer = null;

        function stop() {
            if (timer !== null) window.clearInterval(timer);
            timer = null;
            pause.disabled = true;
        }
        function rebuild() {
            stop();
            events = buildDeploymentTrace(get("deployScenario").value, get("deployStrategy").value, get("deployPolicy").value, Number(get("deployTraffic").value));
            position = 0;
            render();
        }
        function render() {
            const event = events[Math.min(position, events.length - 1)];
            const prepared = prepareCanvas(canvas, 500, 520);
            drawDeployment(prepared.context, prepared.width, prepared.height, event);
            get("deployPhase").textContent = event.phase;
            get("deployStage").textContent = event.stage;
            get("deployTrafficMetric").textContent = event.traffic + "%";
            get("deployRisk").textContent = event.risk + " / 100";
            get("deployDecision").textContent = event.decision;
            get("deployVerdict").textContent = event.message;
            get("deployEquation").textContent = event.equation;
            get("deployExplanation").textContent = event.phase === "Promoted" ? "Promotion changes the production alias while retaining an immutable known-good rollback target." : "Each stage evaluates evidence before the next stage can receive authority or traffic.";
            get("deployEvidence").textContent = event.evidence;
            get("deployNextCheck").textContent = event.next;
            next.disabled = position >= events.length - 1;
            auto.disabled = position >= events.length - 1 || timer !== null;
            pause.disabled = timer === null;
        }
        function advance() {
            if (position < events.length - 1) position += 1;
            render();
            if (position >= events.length - 1) stop();
        }
        controls.forEach(function (control) { control.addEventListener("change", rebuild); });
        next.addEventListener("click", function () { stop(); advance(); });
        auto.addEventListener("click", function () { if (timer !== null || position >= events.length - 1) return; timer = window.setInterval(advance, 650); render(); });
        pause.addEventListener("click", function () { stop(); render(); });
        reset.addEventListener("click", rebuild);
        window.addEventListener("resize", render);
        rebuild();
    }

    const MONITOR_SCENARIOS = {
        placement: { name: "Placement shortlisting", quality: 0.89, gap: 0.032, reference: [0.12, 0.20, 0.34, 0.22, 0.12] },
        credit: { name: "Credit eligibility", quality: 0.85, gap: 0.045, reference: [0.16, 0.24, 0.30, 0.19, 0.11] },
        triage: { name: "Triage prioritization", quality: 0.93, gap: 0.028, reference: [0.10, 0.18, 0.36, 0.23, 0.13] }
    };

    function normalizeDistribution(values) {
        const safe = values.map(function (value) { return Math.max(0.001, value); });
        const total = safe.reduce(function (sum, value) { return sum + value; }, 0);
        return safe.map(function (value) { return value / total; });
    }

    function psi(expected, actual) {
        return expected.reduce(function (total, value, index) {
            const e = Math.max(0.0001, value);
            const a = Math.max(0.0001, actual[index]);
            return total + (a - e) * Math.log(a / e);
        }, 0);
    }

    function liveDistribution(reference, condition, progress, windowIndex) {
        const wobble = Math.sin(windowIndex * 1.7) * 0.003;
        const live = reference.slice();
        if (condition === "stable") {
            live[0] += wobble; live[1] -= wobble; live[3] -= wobble / 2; live[4] += wobble / 2;
        } else if (condition === "covariate") {
            live[0] -= 0.090 * progress; live[1] -= 0.070 * progress; live[2] -= 0.020 * progress; live[3] += 0.070 * progress; live[4] += 0.110 * progress;
        } else if (condition === "concept") {
            live[0] -= 0.008 * progress; live[1] += 0.006 * progress; live[2] += wobble; live[3] -= wobble; live[4] += 0.002 * progress;
        } else {
            live[0] -= 0.025 * progress; live[1] -= 0.018 * progress; live[2] += 0.005 * progress; live[3] += 0.016 * progress; live[4] += 0.022 * progress;
        }
        return normalizeDistribution(live);
    }

    function buildMonitorTrace(scenarioKey, condition, psiThreshold, gapThreshold) {
        const scenario = MONITOR_SCENARIOS[scenarioKey] || MONITOR_SCENARIOS.placement;
        const events = [];
        const history = [];
        events.push({ scenario: scenario, condition: condition, window: 0, psi: 0, quality: scenario.quality, gap: scenario.gap, status: "Baseline", message: "The approved reference distribution is ready.", evidence: "Five reference bins sum to 1.000.", next: "Compare live traffic with the approved baseline.", reference: scenario.reference.slice(), live: scenario.reference.slice(), history: [] });
        for (let windowIndex = 1; windowIndex <= 14; windowIndex += 1) {
            const progress = windowIndex / 14;
            const live = liveDistribution(scenario.reference, condition, progress, windowIndex);
            const drift = psi(scenario.reference, live);
            let qualityDrop;
            let gapIncrease;
            if (condition === "stable") { qualityDrop = 0.004 * progress; gapIncrease = 0.010 * progress; }
            else if (condition === "covariate") { qualityDrop = 0.018 * progress + drift * 0.10; gapIncrease = 0.035 * progress; }
            else if (condition === "concept") { qualityDrop = 0.145 * progress; gapIncrease = 0.040 * progress; }
            else { qualityDrop = 0.045 * progress; gapIncrease = 0.205 * progress; }
            const quality = clamp(scenario.quality - qualityDrop + Math.sin(windowIndex * 0.9) * 0.0015, 0, 1);
            const gap = clamp(scenario.gap + gapIncrease, 0, 1);
            const driftAlert = drift >= psiThreshold;
            const qualityAlert = scenario.quality - quality >= 0.070;
            const fairnessAlert = gap >= gapThreshold;
            const alerts = [];
            if (driftAlert) alerts.push("DRIFT");
            if (qualityAlert) alerts.push("QUALITY");
            if (fairnessAlert) alerts.push("FAIRNESS");
            const status = alerts.length ? "Alert: " + alerts.join(" + ") : (drift >= psiThreshold * 0.65 || gap >= gapThreshold * 0.75 ? "Watch" : "Healthy");
            history.push({ window: windowIndex, psi: drift, qualityDrop: scenario.quality - quality, gap: gap });
            events.push({
                scenario: scenario,
                condition: condition,
                window: windowIndex,
                psi: drift,
                quality: quality,
                gap: gap,
                status: status,
                message: alerts.length ? "Window " + windowIndex + " opens an investigation for " + alerts.join(", ").toLowerCase() + "." : "Window " + windowIndex + " remains within the selected alert policy.",
                evidence: "PSI " + fixed(drift, 3) + " • quality " + fixed(quality, 3) + " • drop " + fixed(scenario.quality - quality, 3) + " • TPR gap " + fixed(gap, 3),
                next: alerts.length ? "Confirm data quality, segment the change and follow the alert runbook." : (windowIndex === 14 ? "Review the complete monitoring history." : "Process the next production window."),
                reference: scenario.reference.slice(),
                live: live,
                history: history.slice(),
                psiThreshold: psiThreshold,
                gapThreshold: gapThreshold
            });
        }
        return events;
    }

    function drawLine(context, points, color, x, y, width, height, maxValue) {
        if (!points.length) return;
        context.strokeStyle = color;
        context.lineWidth = 2.5;
        context.beginPath();
        points.forEach(function (point, index) {
            const px = x + (points.length === 1 ? 0 : index / 13) * width;
            const py = y + height - clamp(point / maxValue, 0, 1) * height;
            if (index === 0) context.moveTo(px, py); else context.lineTo(px, py);
        });
        context.stroke();
    }

    function drawMonitor(context, width, height, event) {
        context.clearRect(0, 0, width, height);
        context.fillStyle = "#06182c";
        context.fillRect(0, 0, width, height);
        const margin = width < 560 ? 38 : 54;
        const chartTop = 48;
        const chartHeight = height < 500 ? 190 : 235;
        const chartWidth = width - margin * 2;
        context.strokeStyle = "#24445f";
        context.lineWidth = 1;
        for (let row = 0; row <= 4; row += 1) {
            const y = chartTop + row / 4 * chartHeight;
            context.beginPath(); context.moveTo(margin, y); context.lineTo(width - margin, y); context.stroke();
        }
        context.fillStyle = "#a9c6dc";
        context.font = "700 11px Arial";
        context.fillText("PRODUCTION WINDOWS", margin, 24);
        context.textAlign = "right";
        context.fillText(event.scenario.name.toUpperCase(), width - margin, 24);
        context.textAlign = "left";

        const history = event.history;
        drawLine(context, history.map(function (item) { return item.psi; }), "#22d3ee", margin, chartTop, chartWidth, chartHeight, 0.50);
        drawLine(context, history.map(function (item) { return item.qualityDrop; }), "#facc15", margin, chartTop, chartWidth, chartHeight, 0.20);
        drawLine(context, history.map(function (item) { return item.gap; }), "#f472b6", margin, chartTop, chartWidth, chartHeight, 0.25);

        const legendY = chartTop + chartHeight + 25;
        [["#22d3ee", "PSI"], ["#facc15", "QUALITY DROP"], ["#f472b6", "TPR GAP"]].forEach(function (item, index) {
            const x = margin + index * Math.max(82, chartWidth / 3);
            context.fillStyle = item[0]; context.fillRect(x, legendY - 9, 15, 4);
            context.fillStyle = "#b9d3e6"; context.font = "800 9px Arial"; context.fillText(item[1], x + 21, legendY - 5);
        });

        const barTop = legendY + 33;
        const available = height - barTop - 36;
        const groupWidth = chartWidth / event.reference.length;
        const maxDistribution = Math.max.apply(null, event.reference.concat(event.live)) * 1.12;
        event.reference.forEach(function (value, index) {
            const x = margin + index * groupWidth + groupWidth * 0.12;
            const refHeight = value / maxDistribution * available;
            const liveHeight = event.live[index] / maxDistribution * available;
            context.fillStyle = "#31516f";
            context.fillRect(x, height - 28 - refHeight, groupWidth * 0.32, refHeight);
            context.fillStyle = "#22c78a";
            context.fillRect(x + groupWidth * 0.38, height - 28 - liveHeight, groupWidth * 0.32, liveHeight);
            context.fillStyle = "#87a9c0";
            context.font = "700 9px Arial";
            context.textAlign = "center";
            context.fillText("B" + (index + 1), x + groupWidth * 0.35, height - 12);
        });
        context.textAlign = "left";
        context.fillStyle = "#8fb8d4";
        context.font = "700 10px Arial";
        context.fillText("grey = reference   green = live distribution", margin, barTop - 12);
    }

    function initMonitorLab() {
        const canvas = get("monitorCanvas");
        if (!canvas || canvas.dataset.cbActive) return;
        canvas.dataset.cbActive = "true";
        const controls = ["monitorScenario", "monitorShift", "monitorThreshold", "monitorGap"].map(get);
        const next = get("monitorNext");
        const auto = get("monitorAuto");
        const pause = get("monitorPause");
        const reset = get("monitorReset");
        let events = [];
        let position = 0;
        let timer = null;
        function stop() { if (timer !== null) window.clearInterval(timer); timer = null; pause.disabled = true; }
        function rebuild() {
            stop();
            events = buildMonitorTrace(get("monitorScenario").value, get("monitorShift").value, Number(get("monitorThreshold").value), Number(get("monitorGap").value));
            position = 0;
            render();
        }
        function render() {
            const event = events[Math.min(position, events.length - 1)];
            const prepared = prepareCanvas(canvas, 500, 500);
            drawMonitor(prepared.context, prepared.width, prepared.height, event);
            get("monitorWindow").textContent = event.window + " / 14";
            get("monitorPsi").textContent = fixed(event.psi, 3);
            get("monitorQuality").textContent = fixed(event.quality, 3);
            get("monitorFairness").textContent = fixed(event.gap, 3);
            get("monitorStatus").textContent = event.status;
            get("monitorVerdict").textContent = event.message;
            get("monitorEquation").textContent = event.window ? "PSI=" + fixed(event.psi, 3) + "; alert when ≥ " + fixed(Number(get("monitorThreshold").value), 2) : "PSI = Σ(aᵢ−eᵢ) ln(aᵢ/eᵢ)";
            get("monitorExplanation").textContent = event.condition === "concept" ? "The score distribution can remain stable while the relationship between inputs and outcomes changes; delayed labels expose concept decay." : "Input drift is an investigation signal; combine it with performance, fairness and operational evidence.";
            get("monitorEvidence").textContent = event.evidence;
            get("monitorNextCheck").textContent = event.next;
            next.disabled = position >= events.length - 1;
            auto.disabled = position >= events.length - 1 || timer !== null;
            pause.disabled = timer === null;
        }
        function advance() { if (position < events.length - 1) position += 1; render(); if (position >= events.length - 1) stop(); }
        controls.forEach(function (control) { control.addEventListener("change", rebuild); });
        next.addEventListener("click", function () { stop(); advance(); });
        auto.addEventListener("click", function () { if (timer !== null || position >= events.length - 1) return; timer = window.setInterval(advance, 600); render(); });
        pause.addEventListener("click", function () { stop(); render(); });
        reset.addEventListener("click", rebuild);
        window.addEventListener("resize", render);
        rebuild();
    }

    const TRACER_CODE = [
        "from math import log",
        "reference = [0.10, 0.20, 0.40, 0.20, 0.10]",
        "windows = [[0.10,0.20,0.40,0.20,0.10],",
        "           [0.08,0.17,0.35,0.25,0.15],",
        "           [0.04,0.10,0.26,0.30,0.30]]",
        "threshold = 0.20",
        "alerts = []",
        "for window_id, live in enumerate(windows):",
        "    psi = 0.0",
        "    for expected, actual in zip(reference, live):",
        "        psi += (actual - expected) * log(actual / expected)",
        "    if psi >= threshold:",
        "        alerts.append(window_id)",
        "print(alerts)"
    ];

    function buildTracerStates() {
        const states = [];
        const reference = [0.10, 0.20, 0.40, 0.20, 0.10];
        const windows = [[0.10,0.20,0.40,0.20,0.10], [0.08,0.17,0.35,0.25,0.15], [0.04,0.10,0.26,0.30,0.30]];
        const threshold = 0.20;
        const alerts = [];
        let windowId = "—";
        let bin = "—";
        let expected = "—";
        let actual = "—";
        let contribution = "—";
        let currentPsi = 0;
        let output = "";

        function snapshot(line, explanation, expression) {
            states.push({ line: line, explanation: explanation, expression: expression, output: output || "Waiting for print(...)", variables: { window_id: String(windowId), bin: String(bin), expected: String(expected), actual: String(actual), contribution: String(contribution), psi: fixed(currentPsi, 4), threshold: fixed(threshold, 2), alerts: "[" + alerts.join(", ") + "]" } });
        }
        snapshot(1, "Import the natural logarithm used by PSI.", "from math import log");
        snapshot(2, "Create the approved five-bin reference distribution.", "sum(reference)=1.00");
        snapshot(3, "Begin the three production-window definitions.", "windows[0]");
        snapshot(4, "Add the second live probability distribution.", "windows[1]");
        snapshot(5, "Finish the production-window collection.", "len(windows)=3");
        snapshot(6, "Set the investigation threshold.", "threshold=0.20");
        snapshot(7, "Create the empty alert list.", "alerts=[]");
        windows.forEach(function (live, outerIndex) {
            windowId = outerIndex;
            snapshot(8, "Enter monitoring window " + outerIndex + ".", "window_id=" + outerIndex);
            currentPsi = 0;
            snapshot(9, "Reset PSI before accumulating this window.", "psi=0.0");
            live.forEach(function (value, innerIndex) {
                bin = innerIndex;
                expected = reference[innerIndex];
                actual = value;
                snapshot(10, "Pair reference and live proportions for bin " + (innerIndex + 1) + ".", "expected=" + fixed(expected, 2) + ", actual=" + fixed(actual, 2));
                contribution = (actual - expected) * Math.log(actual / expected);
                currentPsi += contribution;
                snapshot(11, "Calculate this bin contribution and add it to PSI.", "(" + fixed(actual, 2) + "−" + fixed(expected, 2) + ")×ln(" + fixed(actual, 2) + "/" + fixed(expected, 2) + ")=" + fixed(contribution, 4));
                snapshot(10, "Return to the inner loop for the next probability bin.", innerIndex === live.length - 1 ? "zip exhausted" : "next bin");
            });
            snapshot(12, "Compare the complete window PSI with the alert threshold.", fixed(currentPsi, 4) + " >= " + fixed(threshold, 2) + " is " + (currentPsi >= threshold));
            if (currentPsi >= threshold) {
                alerts.push(windowId);
                snapshot(13, "Append this window because its PSI reaches the threshold.", "alerts=[" + alerts.join(", ") + "]");
            }
            snapshot(8, "Return to the outer loop for the next production window.", outerIndex === windows.length - 1 ? "enumerate exhausted" : "next window");
        });
        output = "[" + alerts.join(", ") + "]";
        snapshot(14, "Print the production windows that require investigation.", "print(alerts)");
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
            get("tracerExplanation").textContent = state ? state.explanation : "Press Next to create the reference distribution.";
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
        { title: "Build Reproducible Model Metadata", difficulty: "BEGINNER", prompt: "Return one metadata dictionary containing model, code, data, config and environment versions.", example: "model='ranker-4.2', commit='8a43c1'\nOutput: a complete lineage dictionary", hint: "Create and return a dictionary; do not store the model alone.", starter: "def build_metadata(model, commit, data_version, config, environment):\n    # Write your code\n    pass", solution: "def build_metadata(model, commit, data_version, config, environment):\n    return {\n        'model_version': model,\n        'code_commit': commit,\n        'data_version': data_version,\n        'config': config.copy(),\n        'environment': environment\n    }", all: [["def build_metadata"], ["model_version"], ["code_commit"], ["data_version"], ["config"], ["environment"], ["return"]], any: [["{"], ["copy", "dict("]] },
        { title: "Calculate Population Stability Index", difficulty: "INTERMEDIATE", prompt: "Calculate PSI for equal-length expected and actual probability bins using a small epsilon for safety.", example: "expected=[.5,.5], actual=[.4,.6]\nOutput: approximately 0.0405", hint: "For each bin add (actual−expected) × log(actual/expected) after clipping both values.", starter: "from math import log\n\ndef population_stability_index(expected, actual, epsilon=1e-6):\n    # Write your code\n    pass", solution: "from math import log\n\ndef population_stability_index(expected, actual, epsilon=1e-6):\n    if len(expected) != len(actual):\n        raise ValueError('bin counts must match')\n    total = 0.0\n    for exp, act in zip(expected, actual):\n        exp = max(exp, epsilon)\n        act = max(act, epsilon)\n        total += (act - exp) * log(act / exp)\n    return total", all: [["def population_stability_index"], ["zip("], ["log("], ["epsilon"], ["return"]], any: [["act - exp", "actual - expected"], ["len(expected)"]] },
        { title: "Evaluate a Model-Promotion Gate", difficulty: "INTERMEDIATE", prompt: "Return True only when quality gain, latency, error rate and fairness gap all satisfy their limits.", example: "gain=.02, p95=80, error=.005, gap=.04\nOutput: True", hint: "A promotion gate is a conjunction: one failed non-negotiable condition blocks release.", starter: "def can_promote(metrics, policy):\n    # Write your code\n    pass", solution: "def can_promote(metrics, policy):\n    return (\n        metrics['quality_gain'] >= policy['min_gain'] and\n        metrics['p95_latency'] <= policy['max_latency'] and\n        metrics['error_rate'] <= policy['max_error'] and\n        metrics['tpr_gap'] <= policy['max_gap']\n    )", all: [["def can_promote"], ["quality_gain"], ["p95_latency"], ["error_rate"], ["tpr_gap"], ["return"]], any: [[" and ", "all("]] },
        { title: "Measure an Equal-Opportunity Gap", difficulty: "ADVANCED", prompt: "Given subgroup confusion counts, return each true-positive rate and the largest absolute TPR gap.", example: "groups={'A':(80,20),'B':(63,27)}\nOutput: rates and gap", hint: "TPR=TP/(TP+FN). Skip or mark groups with no actual positives explicitly.", starter: "def equal_opportunity_gap(groups):\n    # groups maps name to (true_positives, false_negatives)\n    pass", solution: "def equal_opportunity_gap(groups):\n    rates = {}\n    for name, (tp, fn) in groups.items():\n        denominator = tp + fn\n        if denominator == 0:\n            continue\n        rates[name] = tp / denominator\n    if len(rates) < 2:\n        return rates, 0.0\n    values = list(rates.values())\n    return rates, max(values) - min(values)", all: [["def equal_opportunity_gap"], ["groups.items"], ["tp + fn"], ["rates"], ["max("], ["min("], ["return"]], any: [["denominator == 0", "if denominator"]] },
        { title: "Generate Production Alert Records", difficulty: "ADVANCED", prompt: "Inspect monitoring windows and return structured alerts for PSI, quality drop or fairness gap breaches.", example: "window={'psi':.24,'quality':.82,'tpr_gap':.06}\nOutput: one drift alert", hint: "Evaluate every signal independently because one window can create multiple alerts.", starter: "def monitor_windows(windows, baseline_quality, limits):\n    # Write your code\n    pass", solution: "def monitor_windows(windows, baseline_quality, limits):\n    alerts = []\n    for window_id, window in enumerate(windows):\n        if window['psi'] >= limits['psi']:\n            alerts.append({'window': window_id, 'type': 'drift'})\n        if baseline_quality - window['quality'] >= limits['quality_drop']:\n            alerts.append({'window': window_id, 'type': 'quality'})\n        if window['tpr_gap'] >= limits['tpr_gap']:\n            alerts.append({'window': window_id, 'type': 'fairness'})\n    return alerts", all: [["def monitor_windows"], ["enumerate("], ["alerts"], ["psi"], ["quality"], ["tpr_gap"], ["append"], ["return"]], any: [["baseline_quality -", "quality_drop"]] }
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
        { q: "What makes an ML release reproducible?", options: ["Only a model filename", "Versioned code, data, configuration, environment and artifact", "A larger server", "One accuracy value"], answer: 1, explanation: "Reproduction needs complete lineage for everything that created and serves the artifact, not only its filename." },
        { q: "What is the main role of a model registry?", options: ["Store random notebooks", "Manage immutable versions, evidence and promotion state", "Replace monitoring", "Generate labels automatically"], answer: 1, explanation: "A registry connects immutable artifacts with lineage, evaluation, approval and deployment aliases or stages." },
        { q: "When is batch inference usually preferable?", options: ["Every request needs a millisecond response", "Predictions can be produced together on a schedule", "The model has no data", "Rollback is forbidden"], answer: 1, explanation: "Batch inference is efficient when decisions can wait for a scheduled run and do not require fresh synchronous output." },
        { q: "What does a shadow deployment do?", options: ["Routes all decisions to the candidate", "Runs the candidate on copied traffic without using its decisions", "Deletes the champion", "Disables telemetry"], answer: 1, explanation: "Shadowing measures candidate behavior on real request patterns while the current champion continues making decisions." },
        { q: "Why use a canary release?", options: ["To skip validation", "To limit initial exposure and expand only when live gates pass", "To hide model versions", "To remove rollback"], answer: 1, explanation: "Canary delivery controls risk by observing a small production slice before progressively increasing traffic." },
        { q: "What does PSI compare?", options: ["Two binned distributions", "Two source-code commits", "API response schemas only", "GPU memory and CPU memory"], answer: 0, explanation: "Population Stability Index aggregates differences between expected and actual proportions across corresponding bins." },
        { q: "Does input drift prove model performance loss?", options: ["Always", "Never measure it", "No; it is a signal that needs impact evidence", "Only when latency falls"], answer: 2, explanation: "P(X) can change without harming the decision, while concept drift can harm performance with little marginal input drift." },
        { q: "Which fairness metric compares true-positive rates across groups?", options: ["Demographic parity", "Equal opportunity", "Mean latency", "Population stability"], answer: 1, explanation: "Equal opportunity focuses on whether actual positives receive positive decisions at comparable rates." },
        { q: "Why is removing a protected attribute insufficient?", options: ["The model then has no features", "Other features can act as proxies and encode historical patterns", "Fairness is impossible to measure", "It guarantees identical outcomes"], answer: 1, explanation: "Proxy variables and structural patterns can preserve group information and unequal effects even without the explicit attribute." },
        { q: "What must an operational alert include to be useful?", options: ["A colorful chart only", "An owner, severity, evidence and response runbook", "A new model automatically", "Every raw personal value"], answer: 1, explanation: "An actionable alert identifies responsibility, meaning, urgency and the approved diagnosis or containment process." }
    ];

    function initQuiz() {
        const list = get("quizQuestions"); if (!list || list.dataset.cbActive) return; list.dataset.cbActive = "true";
        list.innerHTML = QUIZ.map(function (item, index) { return '<article class="aiml-quiz-question" data-quiz-question="' + index + '"><strong>' + (index + 1) + ". " + escapeHtml(item.q) + '</strong><div class="aiml-quiz-options">' + item.options.map(function (option, optionIndex) { return '<label class="aiml-quiz-option"><input type="radio" name="quiz' + index + '" value="' + optionIndex + '"><span>' + String.fromCharCode(65 + optionIndex) + ". " + escapeHtml(option) + "</span></label>"; }).join("") + '</div><div class="aiml-quiz-explanation" hidden></div></article>'; }).join("");
        list.addEventListener("change", function (event) { const question = event.target.closest(".aiml-quiz-question"); if (!question) return; question.querySelectorAll(".aiml-quiz-option").forEach(function (option) { option.classList.toggle("is-selected", option.querySelector("input").checked); }); });
        get("checkQuiz").addEventListener("click", function () { let correct = 0; QUIZ.forEach(function (item, index) { const question = list.querySelector('[data-quiz-question="' + index + '"]'); const selected = question.querySelector("input:checked"); question.querySelectorAll(".aiml-quiz-option").forEach(function (option) { const value = Number(option.querySelector("input").value); option.classList.toggle("is-correct", value === item.answer); option.classList.toggle("is-wrong", Boolean(selected) && option.querySelector("input").checked && value !== item.answer); }); if (selected && Number(selected.value) === item.answer) correct += 1; const explanation = question.querySelector(".aiml-quiz-explanation"); explanation.hidden = false; explanation.textContent = (selected ? "Correct answer: " : "Not answered. Correct answer: ") + String.fromCharCode(65 + item.answer) + ". " + item.options[item.answer] + " — " + item.explanation; }); get("quizScore").textContent = correct + " / " + QUIZ.length + " correct"; writeProgress({ quizScore: correct }); });
        get("resetQuiz").addEventListener("click", function () { list.querySelectorAll("input").forEach(function (input) { input.checked = false; }); list.querySelectorAll(".aiml-quiz-option").forEach(function (option) { option.className = "aiml-quiz-option"; }); list.querySelectorAll(".aiml-quiz-explanation").forEach(function (explanation) { explanation.hidden = true; explanation.textContent = ""; }); get("quizScore").textContent = "Not checked yet"; });
    }

    const INTERVIEWS = [
        ["What is MLOps?", "MLOps is the engineering discipline for reproducibly building, evaluating, releasing, operating and governing ML systems. It extends DevOps with data and model lineage, ML-specific validation, monitoring and controlled retraining."],
        ["What should an experiment tracker record?", "It should link parameters, code revision, data snapshot, environment, random seed, metrics, evaluation slices and artifacts for each run. Sensitive values and credentials should be replaced by secure references."],
        ["Experiment tracker versus model registry?", "A tracker compares training runs and their evidence. A registry manages immutable candidate versions, documentation, approval state and deployment aliases such as champion or staging."],
        ["How do you prevent training–serving skew?", "Share or verify feature definitions, serialize the complete preprocessing pipeline, enforce schemas and compare offline features or predictions with the online implementation on representative records."],
        ["Compare batch, online and streaming inference.", "Batch predicts many records on a schedule. Online inference answers synchronous requests under latency and availability SLOs. Streaming inference processes continuous events with ordering, window, state and duplicate-handling concerns."],
        ["Compare shadow, canary and blue–green deployment.", "Shadowing mirrors traffic without using candidate decisions. Canary sends a small real fraction and increases it gradually. Blue–green maintains complete old and new environments and switches routing when evidence passes."],
        ["What would you monitor in production?", "Monitor service latency, errors and availability; schema and data quality; feature and prediction drift; delayed performance and calibration; subgroup outcomes; business impact; and security or misuse signals."],
        ["Distinguish data, label and concept drift.", "Data drift changes P(X), label drift changes P(Y), and concept drift changes P(Y|X). Marginal input drift is a warning signal, whereas concept drift directly changes the mapping the model must learn."],
        ["What is PSI and what are its limitations?", "PSI sums (actual−expected) times log(actual/expected) across bins. It depends on binning and sample size, does not establish performance loss and should be interpreted with data quality and impact metrics."],
        ["How do you choose a fairness metric?", "Start from the decision, affected groups, label meaning, base rates and harm. Then select a metric such as selection-rate, TPR or error-rate gaps, report counts and uncertainty, and explain unavoidable trade-offs."],
        ["How would you secure an ML prediction API?", "Authenticate and authorize callers, validate and limit payloads, protect secrets and personal data, rate-limit requests, patch dependencies, log safely, test adversarial inputs and define a safe fallback and incident path."],
        ["Describe an ML incident-response plan.", "Define alert severity, owner and escalation; preserve evidence; contain by rollback, traffic block or human review; communicate appropriately; identify technical and organizational root causes; then update tests, gates and runbooks." ]
    ];

    function initInterviews() {
        const list = get("interviewList"); if (!list || list.dataset.cbActive) return; list.dataset.cbActive = "true";
        list.innerHTML = INTERVIEWS.map(function (item, index) { return '<article class="aiml-interview-card"><button type="button" class="aiml-interview-question" aria-expanded="false"><span>' + (index + 1) + '.</span><strong>' + escapeHtml(item[0]) + '</strong><b>+</b></button><div class="aiml-interview-answer" hidden><span>INTERVIEW ANSWER</span><p>' + escapeHtml(item[1]) + "</p></div></article>"; }).join("");
        list.addEventListener("click", function (event) { const button = event.target.closest(".aiml-interview-question"); if (!button) return; const answer = button.nextElementSibling; const opening = answer.hidden; answer.hidden = !opening; button.setAttribute("aria-expanded", String(opening)); button.querySelector("b").textContent = opening ? "−" : "+"; });
    }

    initDeploymentLab();
    initMonitorLab();
    initTracer();
    initProblems();
    initQuiz();
    initInterviews();
}());
