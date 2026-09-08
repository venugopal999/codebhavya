(function () {
    "use strict";

    const PROGRESS_KEY = "codebhavya-aiml-level-24-progress-v1";
    const get = function (id) { return document.getElementById(id); };
    const ACTIONS = [
        { id: "U", dr: -1, dc: 0, arrow: "↑" },
        { id: "R", dr: 0, dc: 1, arrow: "→" },
        { id: "D", dr: 1, dc: 0, arrow: "↓" },
        { id: "L", dr: 0, dc: -1, arrow: "←" }
    ];

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

    function keyOf(row, column) {
        return row + "," + column;
    }

    function parseKey(key) {
        return key.split(",").map(Number);
    }

    function actionById(id) {
        return ACTIONS.filter(function (action) { return action.id === id; })[0];
    }

    function leftOf(action) {
        return ACTIONS[(ACTIONS.indexOf(action) + 3) % 4];
    }

    function rightOf(action) {
        return ACTIONS[(ACTIONS.indexOf(action) + 1) % 4];
    }

    const MDP_WORLDS = {
        campus: {
            rows: 4, columns: 5, start: "3,0", step: -0.10,
            walls: ["1,1", "2,3"],
            terminals: { "0,4": 10, "1,4": -6 }
        },
        cliff: {
            rows: 4, columns: 6, start: "3,0", step: -0.12,
            walls: [],
            terminals: { "3,1": -10, "3,2": -10, "3,3": -10, "3,4": -10, "3,5": 12 }
        },
        maze: {
            rows: 5, columns: 5, start: "4,0", step: -0.08,
            walls: ["1,1", "1,2", "2,2", "3,2"],
            terminals: { "0,4": 12, "3,4": -5 }
        }
    };

    function validStates(world, includeTerminals) {
        const states = [];
        for (let row = 0; row < world.rows; row += 1) {
            for (let column = 0; column < world.columns; column += 1) {
                const key = keyOf(row, column);
                if (world.walls.indexOf(key) !== -1) continue;
                if (!includeTerminals && world.terminals[key] !== undefined) continue;
                states.push(key);
            }
        }
        return states;
    }

    function intendedNext(world, state, action) {
        const coordinates = parseKey(state);
        const row = coordinates[0] + action.dr;
        const column = coordinates[1] + action.dc;
        const candidate = keyOf(row, column);
        if (row < 0 || row >= world.rows || column < 0 || column >= world.columns || world.walls.indexOf(candidate) !== -1) return state;
        return candidate;
    }

    function transitionOutcomes(world, state, action, noise) {
        const candidates = noise ? [
            { action: action, probability: 1 - noise },
            { action: leftOf(action), probability: noise / 2 },
            { action: rightOf(action), probability: noise / 2 }
        ] : [{ action: action, probability: 1 }];
        const grouped = {};
        candidates.forEach(function (candidate) {
            const next = intendedNext(world, state, candidate.action);
            if (!grouped[next]) grouped[next] = { next: next, probability: 0 };
            grouped[next].probability += candidate.probability;
        });
        return Object.keys(grouped).map(function (next) {
            return {
                next: next,
                probability: grouped[next].probability,
                reward: world.terminals[next] !== undefined ? world.terminals[next] : world.step,
                terminal: world.terminals[next] !== undefined
            };
        });
    }

    function actionValue(world, state, action, values, gamma, noise) {
        return transitionOutcomes(world, state, action, noise).reduce(function (total, outcome) {
            const future = outcome.terminal ? 0 : (values[outcome.next] || 0);
            return total + outcome.probability * (outcome.reward + gamma * future);
        }, 0);
    }

    function greedyAction(world, state, values, gamma, noise) {
        const scored = ACTIONS.map(function (action) {
            return { action: action.id, value: actionValue(world, state, action, values, gamma, noise) };
        });
        scored.sort(function (left, right) { return right.value - left.value || left.action.localeCompare(right.action); });
        return { action: scored[0].action, value: scored[0].value, scored: scored };
    }

    function initialPolicy(world) {
        const policy = {};
        validStates(world, false).forEach(function (state) {
            const coordinates = parseKey(state);
            policy[state] = coordinates[1] < world.columns - 1 ? "R" : "U";
        });
        return policy;
    }

    function policyPath(world, policy) {
        const path = [world.start];
        const seen = {};
        seen[world.start] = true;
        let state = world.start;
        for (let step = 0; step < world.rows * world.columns * 2; step += 1) {
            if (world.terminals[state] !== undefined || !policy[state]) break;
            const next = intendedNext(world, state, actionById(policy[state]));
            path.push(next);
            if (world.terminals[next] !== undefined) break;
            if (seen[next]) break;
            seen[next] = true;
            state = next;
        }
        return path;
    }

    function buildMdpTrace(worldKey, method, gamma, noise) {
        const world = MDP_WORLDS[worldKey] || MDP_WORLDS.campus;
        const states = validStates(world, false);
        let values = {};
        let policy = initialPolicy(world);
        const events = [];

        validStates(world, true).forEach(function (state) { values[state] = 0; });

        function snapshot(phase, sweep, current, message, equation, actionScores, delta, next) {
            events.push({
                world: world,
                phase: phase,
                sweep: sweep,
                current: current,
                message: message,
                equation: equation,
                actionScores: clone(actionScores || []),
                delta: delta,
                next: next,
                values: clone(values),
                policy: clone(policy),
                path: policyPath(world, policy)
            });
        }

        snapshot("Ready", 0, world.start, "All non-terminal state values begin at zero.", method === "evaluation" ? "Vπ(s) ← E[r+γVπ(s′)]" : "V(s) ← maxₐ E[r+γV(s′)]", [], null, "Back up the first non-terminal state.");

        for (let sweep = 1; sweep <= 14; sweep += 1) {
            const oldValues = clone(values);
            const nextValues = clone(values);
            let maximumDelta = 0;
            states.forEach(function (state, index) {
                const scores = ACTIONS.map(function (action) {
                    return { action: action.id, value: actionValue(world, state, action, oldValues, gamma, noise) };
                });
                let selected;
                if (method === "evaluation" || method === "policy") {
                    selected = scores.filter(function (score) { return score.action === policy[state]; })[0];
                } else {
                    selected = scores.slice().sort(function (left, right) { return right.value - left.value || left.action.localeCompare(right.action); })[0];
                }
                nextValues[state] = selected.value;
                maximumDelta = Math.max(maximumDelta, Math.abs(selected.value - oldValues[state]));
                values = clone(nextValues);
                snapshot("Bellman backup", sweep, state, "Back up " + state + " using action " + selected.action + ".", "V(" + state + ")=" + fixed(selected.value) + " from " + selected.action, scores, maximumDelta, index === states.length - 1 ? "Finish the sweep and inspect convergence." : "Continue to the next state.");
            });
            values = nextValues;
            if (method === "value" || method === "policy") {
                let changes = 0;
                states.forEach(function (state) {
                    const improved = greedyAction(world, state, values, gamma, noise).action;
                    if (policy[state] !== improved) changes += 1;
                    policy[state] = improved;
                });
                snapshot("Policy improvement", sweep, world.start, changes ? "The greedy policy changes in " + changes + " state" + (changes === 1 ? "." : "s.") : "The greedy policy is stable.", "π(s)=argmaxₐ E[r+γV(s′)]", [], maximumDelta, "Begin another evaluation sweep or stop when values and policy stabilize.");
            }
            snapshot("Sweep complete", sweep, world.start, "Sweep " + sweep + " completes with maximum value change " + fixed(maximumDelta, 4) + ".", "Δ=" + fixed(maximumDelta, 4), [], maximumDelta, maximumDelta < 0.005 ? "Values have converged within tolerance." : "Run another complete sweep.");
            if (maximumDelta < 0.005 && (method !== "policy" || sweep > 2)) break;
        }
        const finalGreedy = {};
        states.forEach(function (state) { finalGreedy[state] = greedyAction(world, state, values, gamma, noise).action; });
        if (method !== "evaluation") policy = finalGreedy;
        snapshot("Complete", events[events.length - 1].sweep, world.start, method === "evaluation" ? "Policy evaluation has estimated the selected policy." : "Planning is complete; arrows show the current greedy policy.", method === "evaluation" ? "Vπ converged" : "π*(s)=argmaxₐ Q(s,a)", [], events[events.length - 1].delta, "Change uncertainty or γ and compare the resulting values and route.");
        return events;
    }

    function drawGrid(context, world, width, height, options) {
        const top = 24;
        const bottom = 36;
        const availableHeight = height - top - bottom;
        const cell = Math.min((width - 40) / world.columns, availableHeight / world.rows);
        const gridWidth = cell * world.columns;
        const gridHeight = cell * world.rows;
        const startX = (width - gridWidth) / 2;
        const startY = top + (availableHeight - gridHeight) / 2;
        const pathSet = {};
        (options.path || []).forEach(function (state) { pathSet[state] = true; });
        context.clearRect(0, 0, width, height);
        context.fillStyle = "#06182c";
        context.fillRect(0, 0, width, height);

        for (let row = 0; row < world.rows; row += 1) {
            for (let column = 0; column < world.columns; column += 1) {
                const state = keyOf(row, column);
                const x = startX + column * cell;
                const y = startY + row * cell;
                const isWall = world.walls.indexOf(state) !== -1;
                const terminal = world.terminals[state];
                const value = options.values[state] || 0;
                let fill = "#0b2038";
                if (value > 0) fill = "rgba(16, 185, 129, " + Math.min(.6, .15 + Math.abs(value) / 22) + ")";
                if (value < 0) fill = "rgba(239, 68, 68, " + Math.min(.6, .15 + Math.abs(value) / 22) + ")";
                if (pathSet[state]) fill = "#173d5d";
                if (terminal !== undefined) fill = terminal > 0 ? "#116545" : "#7f2532";
                if (isWall) fill = "#020a14";
                if (options.current === state) fill = "#6f3cc3";
                context.fillStyle = fill;
                context.strokeStyle = options.current === state ? "#d8b4fe" : "#31516f";
                context.lineWidth = options.current === state ? 3 : 1.5;
                context.fillRect(x + 2, y + 2, cell - 4, cell - 4);
                context.strokeRect(x + 2, y + 2, cell - 4, cell - 4);
                context.textAlign = "center";
                context.textBaseline = "middle";
                if (isWall) {
                    context.fillStyle = "#64748b";
                    context.font = "800 " + Math.max(14, cell * .22) + "px Arial";
                    context.fillText("■", x + cell / 2, y + cell / 2);
                    continue;
                }
                if (terminal !== undefined) {
                    context.fillStyle = "#fff";
                    context.font = "900 " + Math.max(13, cell * .17) + "px Arial";
                    context.fillText((terminal > 0 ? "+" : "") + terminal, x + cell / 2, y + cell / 2);
                    context.font = "700 " + Math.max(9, cell * .10) + "px Arial";
                    context.fillText("TERMINAL", x + cell / 2, y + cell * .72);
                    continue;
                }
                if (options.agent === state) {
                    context.fillStyle = "#facc15";
                    context.beginPath();
                    context.arc(x + cell / 2, y + cell / 2, Math.max(9, cell * .13), 0, Math.PI * 2);
                    context.fill();
                    context.fillStyle = "#061426";
                    context.font = "900 " + Math.max(9, cell * .11) + "px Arial";
                    context.fillText("A", x + cell / 2, y + cell / 2);
                } else {
                    context.fillStyle = "#dceeff";
                    context.font = "800 " + Math.max(12, cell * .15) + "px Arial";
                    const arrow = options.policy[state] ? actionById(options.policy[state]).arrow : "·";
                    context.fillText(arrow, x + cell / 2, y + cell * .39);
                    context.fillStyle = "#9adff8";
                    context.font = "700 " + Math.max(9, cell * .10) + "px Arial";
                    context.fillText(fixed(value), x + cell / 2, y + cell * .68);
                }
                if (state === world.start) {
                    context.fillStyle = "#67e8f9";
                    context.font = "800 " + Math.max(8, cell * .08) + "px Arial";
                    context.fillText("START", x + cell / 2, y + cell * .88);
                }
            }
        }
        context.textAlign = "left";
        context.fillStyle = "#8fb8d4";
        context.font = "600 12px Arial";
        context.fillText(options.legend, 18, height - 13);
    }

    function initMdpLab() {
        const canvas = get("mdpCanvas");
        if (!canvas || canvas.dataset.cbActive) return;
        canvas.dataset.cbActive = "true";
        const controls = ["mdpWorld", "mdpMethod", "mdpGamma", "mdpNoise"].map(get);
        const next = get("mdpNext");
        const auto = get("mdpAuto");
        const pause = get("mdpPause");
        const reset = get("mdpReset");
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
            events = buildMdpTrace(get("mdpWorld").value, get("mdpMethod").value, Number(get("mdpGamma").value), Number(get("mdpNoise").value));
            position = 0;
            render();
        }

        function render() {
            const state = events[Math.min(position, events.length - 1)];
            const prepared = prepareCanvas(canvas, 500, 430);
            drawGrid(prepared.context, state.world, prepared.width, prepared.height, {
                current: state.current,
                values: state.values,
                policy: state.policy,
                path: state.path,
                legend: "arrow = policy   number = value   purple = current backup   blue = current route"
            });
            get("mdpPhase").textContent = state.phase;
            get("mdpSweep").textContent = String(state.sweep);
            get("mdpCurrent").textContent = state.current;
            get("mdpDelta").textContent = state.delta === null ? "—" : fixed(state.delta, 4);
            get("mdpStartValue").textContent = fixed(state.values[state.world.start] || 0);
            get("mdpVerdict").textContent = state.message;
            get("mdpEquation").textContent = state.equation;
            get("mdpExplanation").textContent = state.phase === "Complete" ? "The arrows form a policy from the computed values; uncertainty can favor safer routes over shorter risky ones." : "The current backup reads values from the previous sweep and applies the selected Bellman operator.";
            get("mdpEvidence").textContent = state.actionScores.length ? state.actionScores.map(function (score) { return score.action + "=" + fixed(score.value); }).join(" • ") : "No action values calculated yet.";
            get("mdpNextCheck").textContent = state.next;
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
        auto.addEventListener("click", function () {
            if (timer !== null || position >= events.length - 1) return;
            timer = window.setInterval(advance, 250);
            render();
        });
        pause.addEventListener("click", function () { stop(); render(); });
        reset.addEventListener("click", rebuild);
        window.addEventListener("resize", render);
        rebuild();
    }

    const Q_WORLDS = {
        bridge: {
            rows: 3, columns: 5, start: "1,0", step: -0.10, noise: 0.04,
            walls: [], terminals: { "1,4": 8, "2,1": -6, "2,2": -6, "2,3": -6 }, rewards: {}
        },
        shortcut: {
            rows: 4, columns: 5, start: "3,0", step: -0.08, noise: 0.03,
            walls: ["1,1", "2,3"], terminals: { "0,4": 10, "3,4": -4 }, rewards: { "2,2": 1.5 }
        },
        frozen: {
            rows: 4, columns: 4, start: "3,0", step: -0.05, noise: 0.20,
            walls: [], terminals: { "0,3": 10, "1,1": -5, "2,2": -5 }, rewards: {}
        }
    };

    function seededRandom(seed) {
        let state = seed >>> 0;
        return function () {
            state = (1664525 * state + 1013904223) >>> 0;
            return state / 4294967296;
        };
    }

    function qKey(state, action) {
        return state + "|" + action;
    }

    function bestQAction(q, state) {
        return ACTIONS.map(function (action, index) {
            return { action: action.id, value: q[qKey(state, action.id)] || 0, order: index };
        }).sort(function (left, right) { return right.value - left.value || left.order - right.order; })[0];
    }

    function qPolicy(world, q) {
        const policy = {};
        validStates(world, false).forEach(function (state) { policy[state] = bestQAction(q, state).action; });
        return policy;
    }

    function sampledTransition(world, state, action, random) {
        let actual = action;
        const roll = random();
        if (roll < world.noise / 2) actual = leftOf(action);
        else if (roll < world.noise) actual = rightOf(action);
        const next = intendedNext(world, state, actual);
        const terminal = world.terminals[next] !== undefined;
        const reward = terminal ? world.terminals[next] : (world.rewards[next] !== undefined ? world.rewards[next] : world.step);
        return { next: next, reward: reward, terminal: terminal, actual: actual.id };
    }

    function buildQTrace(worldKey, alpha, gamma, epsilon) {
        const world = Q_WORLDS[worldKey] || Q_WORLDS.bridge;
        const random = seededRandom(24024 + world.rows * 31 + Math.round(alpha * 100) + Math.round(epsilon * 1000));
        const q = {};
        validStates(world, false).forEach(function (state) {
            ACTIONS.forEach(function (action) { q[qKey(state, action.id)] = 0; });
        });
        const events = [];

        function snapshot(data) {
            events.push({
                world: world,
                episode: data.episode,
                step: data.step,
                state: data.state,
                nextState: data.nextState || data.state,
                action: data.action || "—",
                actualAction: data.actualAction || data.action || "—",
                reward: data.reward || 0,
                totalReturn: data.totalReturn || 0,
                explored: Boolean(data.explored),
                oldQ: data.oldQ,
                target: data.target,
                error: data.error,
                newQ: data.newQ,
                terminal: Boolean(data.terminal),
                phase: data.phase,
                message: data.message,
                next: data.next,
                q: clone(q),
                policy: qPolicy(world, q),
                path: (data.path || [world.start]).slice()
            });
        }

        snapshot({ episode: 1, step: 0, state: world.start, phase: "Ready", message: "All state–action values begin at zero.", next: "Make the first epsilon-greedy decision.", path: [world.start] });
        for (let episode = 1; episode <= 12; episode += 1) {
            let state = world.start;
            let totalReturn = 0;
            let path = [state];
            for (let step = 1; step <= 28; step += 1) {
                const exploreRoll = random();
                const explored = exploreRoll < epsilon;
                const actionId = explored ? ACTIONS[Math.floor(random() * ACTIONS.length)].id : bestQAction(q, state).action;
                const action = actionById(actionId);
                const transition = sampledTransition(world, state, action, random);
                const oldQ = q[qKey(state, actionId)] || 0;
                const bestNext = transition.terminal ? 0 : bestQAction(q, transition.next).value;
                const target = transition.reward + gamma * bestNext;
                const error = target - oldQ;
                const newQ = oldQ + alpha * error;
                q[qKey(state, actionId)] = newQ;
                totalReturn += Math.pow(gamma, step - 1) * transition.reward;
                path.push(transition.next);
                snapshot({
                    episode: episode,
                    step: step,
                    state: state,
                    nextState: transition.next,
                    action: actionId,
                    actualAction: transition.actual,
                    reward: transition.reward,
                    totalReturn: totalReturn,
                    explored: explored,
                    oldQ: oldQ,
                    target: target,
                    error: error,
                    newQ: newQ,
                    terminal: transition.terminal,
                    phase: transition.terminal ? "Episode complete" : "Q update",
                    message: (explored ? "Explore" : "Exploit") + " with " + actionId + "; observe " + transition.reward + " and update Q(" + state + "," + actionId + ").",
                    next: transition.terminal ? "Reset to the start for the next episode." : "Continue from " + transition.next + ".",
                    path: path
                });
                state = transition.next;
                if (transition.terminal) break;
            }
        }
        const last = events[events.length - 1];
        snapshot({
            episode: last.episode,
            step: last.step,
            state: world.start,
            phase: "Training complete",
            message: "The final arrows show the greedy policy implied by the learned Q table.",
            next: "Change α, γ or ε and compare value propagation and episode returns.",
            path: policyPath(world, qPolicy(world, q))
        });
        return events;
    }

    function qValuesForState(q, state) {
        return ACTIONS.map(function (action) { return action.id + "=" + fixed(q[qKey(state, action.id)] || 0); }).join(" • ");
    }

    function initQLab() {
        const canvas = get("qCanvas");
        if (!canvas || canvas.dataset.cbActive) return;
        canvas.dataset.cbActive = "true";
        const controls = ["qWorld", "qAlpha", "qGamma", "qEpsilon"].map(get);
        const next = get("qNext");
        const auto = get("qAuto");
        const pause = get("qPause");
        const reset = get("qReset");
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
            events = buildQTrace(get("qWorld").value, Number(get("qAlpha").value), Number(get("qGamma").value), Number(get("qEpsilon").value));
            position = 0;
            render();
        }

        function render() {
            const state = events[Math.min(position, events.length - 1)];
            const values = {};
            validStates(state.world, true).forEach(function (gridState) {
                values[gridState] = state.world.terminals[gridState] !== undefined ? 0 : bestQAction(state.q, gridState).value;
            });
            const prepared = prepareCanvas(canvas, 500, 430);
            drawGrid(prepared.context, state.world, prepared.width, prepared.height, {
                current: state.nextState,
                agent: state.nextState,
                values: values,
                policy: state.policy,
                path: state.path,
                legend: "arrow = greedy action   number = max Q   yellow = agent   blue = episode path"
            });
            get("qEpisode").textContent = String(state.episode);
            get("qStep").textContent = String(state.step);
            get("qAction").textContent = state.action + (state.action !== state.actualAction ? "→" + state.actualAction : "");
            get("qReward").textContent = fixed(state.reward, 2);
            get("qReturn").textContent = fixed(state.totalReturn, 2);
            get("qVerdict").textContent = state.message;
            get("qEquation").textContent = state.oldQ === undefined ? "Q ← Q + α[target − Q]" : fixed(state.oldQ) + " + " + get("qAlpha").value + " × (" + fixed(state.target) + " − " + fixed(state.oldQ) + ") = " + fixed(state.newQ);
            get("qExplanation").textContent = state.phase === "Training complete" ? "The greedy arrows use argmax Q after all sampled transitions. Different exploration rates change which evidence enters the table." : (state.explored ? "This action was selected by exploration; the update still uses the greedy next-state target." : "This action exploited the largest current Q value, with deterministic tie-breaking.");
            get("qEvidence").textContent = state.oldQ === undefined ? "No transition sampled yet." : "target=" + fixed(state.target) + " • TD error=" + fixed(state.error) + " • new Q=" + fixed(state.newQ) + " • next-state values: " + qValuesForState(state.q, state.nextState);
            get("qNextCheck").textContent = state.next;
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
        auto.addEventListener("click", function () {
            if (timer !== null || position >= events.length - 1) return;
            timer = window.setInterval(advance, 160);
            render();
        });
        pause.addEventListener("click", function () { stop(); render(); });
        reset.addEventListener("click", rebuild);
        window.addEventListener("resize", render);
        rebuild();
    }

    const TRACER_CODE = [
        "states = ['S0', 'S1', 'S2', 'G']",
        "actions = ['RIGHT', 'WAIT']",
        "Q = {(s, a): 0.0 for s in states for a in actions}",
        "alpha, gamma = 0.5, 0.9",
        "for episode in range(3):",
        "    state = 'S0'",
        "    while state != 'G':",
        "        action = max(actions, key=lambda a: Q[state, a])",
        "        next_state = ({'S0':'S1', 'S1':'S2', 'S2':'G'}[state] if action == 'RIGHT' else state)",
        "        reward = 5 if next_state == 'G' else -0.1",
        "        best_next = 0 if next_state == 'G' else max(Q[next_state, a] for a in actions)",
        "        td_target = reward + gamma * best_next",
        "        td_error = td_target - Q[state, action]",
        "        Q[state, action] += alpha * td_error",
        "        state = next_state",
        "print(round(Q['S0','RIGHT'], 3), round(Q['S2','RIGHT'], 3))"
    ];

    function buildTracerStates() {
        const states = [];
        const q = {};
        const stateNames = ["S0", "S1", "S2", "G"];
        const actions = ["RIGHT", "WAIT"];
        stateNames.forEach(function (state) { actions.forEach(function (action) { q[state + "|" + action] = 0; }); });
        const alpha = 0.5;
        const gamma = 0.9;
        let episode = "—";
        let state = "—";
        let action = "—";
        let nextState = "—";
        let reward = "—";
        let bestNext = "—";
        let target = "—";
        let error = "—";
        let output = "";

        function formatQ() {
            return "S0:R " + fixed(q["S0|RIGHT"], 3) + " • S1:R " + fixed(q["S1|RIGHT"], 3) + " • S2:R " + fixed(q["S2|RIGHT"], 3);
        }

        function snapshot(line, explanation, expression) {
            states.push({
                line: line,
                explanation: explanation,
                expression: expression,
                output: output || "Waiting for print(...)",
                variables: {
                    episode: String(episode),
                    state: String(state),
                    action: String(action),
                    next_state: String(nextState),
                    reward: String(reward),
                    best_next: String(bestNext),
                    td_target: String(target),
                    td_error: String(error),
                    q_values: formatQ()
                }
            });
        }

        snapshot(1, "Create the ordered state sequence.", "states has 4 entries");
        snapshot(2, "Define two actions. Ties favor RIGHT because it appears first.", "actions=['RIGHT','WAIT']");
        snapshot(3, "Initialize every state–action value to zero.", "Q has 8 entries");
        snapshot(4, "Set the learning rate and discount factor.", "α=0.5, γ=0.9");
        for (let ep = 0; ep < 3; ep += 1) {
            episode = ep;
            snapshot(5, "Enter outer episode " + ep + ".", "episode=" + ep);
            state = "S0";
            snapshot(6, "Reset the environment to S0.", "state='S0'");
            while (state !== "G") {
                snapshot(7, "The while loop continues because the goal has not been reached.", state + " != G is True");
                action = q[state + "|RIGHT"] >= q[state + "|WAIT"] ? "RIGHT" : "WAIT";
                snapshot(8, "Choose the action with maximum current Q; ties select RIGHT.", "argmax Q(" + state + ",·) = " + action);
                nextState = action === "RIGHT" ? { S0: "S1", S1: "S2", S2: "G" }[state] : state;
                snapshot(9, action === "RIGHT" ? "Apply the deterministic RIGHT transition." : "WAIT leaves the agent in the same state.", state + " → " + nextState);
                reward = nextState === "G" ? 5 : -0.1;
                snapshot(10, "Read the reward produced by the transition.", "reward=" + reward);
                bestNext = nextState === "G" ? 0 : Math.max(q[nextState + "|RIGHT"], q[nextState + "|WAIT"]);
                snapshot(11, nextState === "G" ? "A terminal transition has no bootstrap value." : "Read the largest next-state action value.", "best_next=" + fixed(bestNext, 3));
                target = reward + gamma * bestNext;
                snapshot(12, "Build the one-step Q-learning target.", fixed(reward, 3) + " + " + gamma + " × " + fixed(bestNext, 3) + " = " + fixed(target, 3));
                error = target - q[state + "|" + action];
                snapshot(13, "Subtract the current estimate to obtain TD error.", fixed(target, 3) + " − " + fixed(q[state + "|" + action], 3) + " = " + fixed(error, 3));
                q[state + "|" + action] += alpha * error;
                snapshot(14, "Move the selected Q value halfway toward its target.", "Q(" + state + "," + action + ")=" + fixed(q[state + "|" + action], 3));
                state = nextState;
                snapshot(15, "Advance the agent to the observed next state.", "state=" + state);
                snapshot(7, "Return to the while-condition after the update.", state + " != G is " + (state !== "G"));
            }
            snapshot(5, "The episode is complete; control returns to the outer for loop.", "next episode");
        }
        output = fixed(q["S0|RIGHT"], 3) + " " + fixed(q["S2|RIGHT"], 3);
        snapshot(16, "Print early-state and near-goal action values after three episodes.", "print(round(...))");
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
            const state = position > 0 ? states[position - 1] : null;
            Array.prototype.forEach.call(code.querySelectorAll(".aiml-code-line"), function (line) {
                const lineNumber = Number(line.dataset.line);
                line.classList.toggle("is-active", Boolean(state) && lineNumber === state.line);
                line.classList.toggle("is-complete", Boolean(state) && lineNumber < state.line);
            });
            get("tracerStatus").textContent = !state ? "Ready" : (position === states.length ? "Complete" : "Running");
            get("tracerExplanation").textContent = state ? state.explanation : "Press Next to initialize the Q table.";
            get("tracerExpression").textContent = state ? state.expression : "—";
            get("tracerOutput").textContent = state ? state.output : "Waiting for print(...)";
            get("tracerVariables").innerHTML = state ? Object.keys(state.variables).map(function (key) {
                return '<article class="aiml-variable"><span>' + escapeHtml(key.replace(/_/g, " ")) + '</span><code>' + escapeHtml(state.variables[key]) + "</code></article>";
            }).join("") : '<article class="aiml-variable"><span>STATE</span><code>Not started</code></article>';
            previous.disabled = position === 0;
            next.disabled = position >= states.length;
            auto.disabled = position >= states.length || timer !== null;
            pause.disabled = timer === null;
            get("tracerProgress").textContent = "Step " + position + " of " + states.length;
            if (state) {
                const activeLine = code.querySelector('.aiml-code-line[data-line="' + state.line + '"]');
                if (activeLine) activeLine.scrollIntoView({ block: "nearest" });
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
            toggle.textContent = opening ? "✕ Close Interactive Tracer" : "Open Interactive Tracer";
            if (opening) window.setTimeout(function () { panel.scrollIntoView({ behavior: "smooth", block: "nearest" }); }, 50);
            else stop();
        });
        previous.addEventListener("click", function () { stop(); if (position > 0) position -= 1; render(); });
        next.addEventListener("click", function () { stop(); advance(); });
        auto.addEventListener("click", function () {
            if (position >= states.length || timer !== null) return;
            timer = window.setInterval(advance, 120);
            render();
        });
        pause.addEventListener("click", function () { stop(); render(); });
        reset.addEventListener("click", function () { stop(); position = 0; render(); });
        render();
    }

    const PROBLEMS = [
        {
            title: "Calculate a Discounted Return",
            difficulty: "BEGINNER",
            prompt: "Return G₀ for a sequence of rewards using discount factor gamma.",
            example: "rewards=[1,2,3], gamma=0.5\nOutput: 2.75",
            hint: "Traverse rewards in reverse and repeatedly set total = reward + gamma × total.",
            starter: "def discounted_return(rewards, gamma):\n    # Write your code\n    pass",
            solution: "def discounted_return(rewards, gamma):\n    total = 0.0\n    for reward in reversed(rewards):\n        total = reward + gamma * total\n    return total",
            all: [["def discounted_return"],["reversed"],["gamma"],["return"]],
            any: [["total = reward + gamma * total","total=reward+gamma*total"]]
        },
        {
            title: "Perform a Stochastic Bellman Backup",
            difficulty: "INTERMEDIATE",
            prompt: "Given outcomes as (probability, reward, next_value, terminal), calculate the expected one-step action value.",
            example: "outcomes=[(0.8,2,5,False),(0.2,-1,0,True)], gamma=0.9\nOutput: 5.0",
            hint: "A terminal outcome contributes reward only; otherwise add gamma times its next value.",
            starter: "def action_value(outcomes, gamma):\n    # Write your code\n    pass",
            solution: "def action_value(outcomes, gamma):\n    expected = 0.0\n    for probability, reward, next_value, terminal in outcomes:\n        bootstrap = 0 if terminal else gamma * next_value\n        expected += probability * (reward + bootstrap)\n    return expected",
            all: [["for"],["probability"],["terminal"],["gamma"],["return"]],
            any: [["expected +=","expected=expected+"],["0 if terminal","if terminal"]]
        },
        {
            title: "Choose an Epsilon-Greedy Action",
            difficulty: "INTERMEDIATE",
            prompt: "Choose a random action with probability epsilon; otherwise return an action with maximum Q value.",
            example: "actions=['L','R'], values={'L':1,'R':4}, epsilon=0\nOutput: 'R'",
            hint: "Use one random draw for the explore decision and random.choice for exploration.",
            starter: "import random\n\ndef epsilon_greedy(actions, values, epsilon):\n    # Write your code\n    pass",
            solution: "import random\n\ndef epsilon_greedy(actions, values, epsilon):\n    if random.random() < epsilon:\n        return random.choice(actions)\n    best = max(values[action] for action in actions)\n    choices = [action for action in actions if values[action] == best]\n    return random.choice(choices)",
            all: [["random.random"],["epsilon"],["max("],["return"]],
            any: [["random.choice"],["choice("]]
        },
        {
            title: "Run One Sweep of Value Iteration",
            difficulty: "ADVANCED",
            prompt: "Use a supplied transition model to return synchronously updated optimal values for every non-terminal state.",
            example: "states=['A','B'], actions=['L','R'], gamma=0.9\nOutput: one Bellman-optimality sweep",
            hint: "Calculate every new value from the unchanged old values and take the maximum action expectation.",
            starter: "def value_sweep(states, actions, outcomes, values, gamma):\n    # Write your code\n    pass",
            solution: "def value_sweep(states, actions, outcomes, values, gamma):\n    updated = values.copy()\n    for state in states:\n        action_values = []\n        for action in actions[state]:\n            total = 0.0\n            for probability, reward, next_state, terminal in outcomes(state, action):\n                future = 0 if terminal else values[next_state]\n                total += probability * (reward + gamma * future)\n            action_values.append(total)\n        updated[state] = max(action_values)\n    return updated",
            all: [["values.copy"],["for state"],["for action"],["probability"],["max("],["return"]],
            any: [["terminal"],["future = 0"]]
        },
        {
            title: "Apply a Tabular Q-Learning Update",
            difficulty: "ADVANCED",
            prompt: "Update Q[state,action] in place from reward, next state, alpha, gamma and a terminal flag. Return the TD error.",
            example: "Q(s,a)=4, reward=2, max Q(s′,·)=6, alpha=.5, gamma=.9\nOutput: Q(s,a)=5.7 and TD error=3.4",
            hint: "Terminal transitions use best_next=0. Construct target, subtract old Q and then apply alpha times the error.",
            starter: "def q_update(Q, state, action, reward, next_state, actions, alpha, gamma, terminal):\n    # Write your code\n    pass",
            solution: "def q_update(Q, state, action, reward, next_state, actions, alpha, gamma, terminal):\n    best_next = 0 if terminal else max(Q.get((next_state, a), 0.0) for a in actions)\n    old = Q.get((state, action), 0.0)\n    target = reward + gamma * best_next\n    error = target - old\n    Q[state, action] = old + alpha * error\n    return error",
            all: [["best_next"],["terminal"],["max("],["target"],["error"],["alpha"],["return"]],
            any: [["q[state, action]","q[(state, action)]"]]
        }
    ];

    function readProgress() {
        try { return JSON.parse(window.localStorage.getItem(PROGRESS_KEY)) || {}; } catch (error) { return {}; }
    }

    function writeProgress(update) {
        const current = readProgress();
        Object.keys(update).forEach(function (key) { current[key] = update[key]; });
        try { window.localStorage.setItem(PROGRESS_KEY, JSON.stringify(current)); } catch (error) { /* Storage may be unavailable. */ }
    }

    function codeMatches(code, problem) {
        const normalized = String(code).toLowerCase().replace(/\s+/g, " ");
        const missing = [];
        problem.all.forEach(function (group) {
            if (!group.some(function (token) { return normalized.indexOf(token.toLowerCase()) !== -1; })) missing.push(group[0]);
        });
        problem.any.forEach(function (group) {
            if (!group.some(function (token) { return normalized.indexOf(token.toLowerCase()) !== -1; })) missing.push(group.join(" or "));
        });
        return { pass: missing.length === 0, missing: missing };
    }

    function initProblems() {
        const list = get("problemList");
        if (!list || list.dataset.cbActive) return;
        list.dataset.cbActive = "true";
        const progress = readProgress();
        const records = progress.problems && typeof progress.problems === "object" ? progress.problems : {};

        function scoreFor(index) {
            return Number(records[index] || 0);
        }

        function renderSummary() {
            const scores = PROBLEMS.map(function (_, index) { return scoreFor(index); });
            const independent = scores.filter(function (score) { return score >= 100; }).length;
            const total = scores.reduce(function (sum, score) { return sum + score; }, 0);
            get("problemSolvedCount").textContent = independent + " / " + PROBLEMS.length;
            get("problemScore").textContent = total + " / " + (PROBLEMS.length * 100);
            get("problemProgressBar").style.width = (total / (PROBLEMS.length * 100) * 100) + "%";
        }

        list.innerHTML = PROBLEMS.map(function (problem, index) {
            const number = index + 1;
            const saved = scoreFor(index);
            const lines = problem.example.split("\n");
            return '<article class="aiml-problem-card' + (saved ? " is-solved" : "") + '" data-problem="' + index + '"><div class="aiml-problem-head"><span class="aiml-problem-number">' + String(number).padStart(2, "0") + '</span><div><h3>' + number + ". " + escapeHtml(problem.title) + '</h3><p>' + escapeHtml(problem.prompt) + '</p></div></div><div class="aiml-problem-data"><span><strong>Difficulty:</strong> ' + escapeHtml(problem.difficulty) + '</span><span><strong>Example:</strong> ' + escapeHtml(lines[0]) + '</span><span><strong>Expected:</strong> <code>' + escapeHtml(lines.slice(1).join(" ")) + '</code></span></div><div class="aiml-problem-actions"><button type="button" class="primary" data-action="workspace">💻 Solve It Yourself</button><button type="button" class="hint" data-action="hint">Hint</button><button type="button" data-action="solution">Show Program</button></div><div class="aiml-problem-reveal" data-panel="hint" hidden><strong>Hint</strong><p>' + escapeHtml(problem.hint) + '</p></div><div class="aiml-problem-reveal" data-panel="solution" hidden><strong>Model program</strong><pre><code>' + escapeHtml(problem.solution) + '</code></pre></div><div class="aiml-workspace" data-panel="workspace" hidden><label for="problemCode' + index + '">Your Python code</label><textarea id="problemCode' + index + '" spellcheck="false">' + escapeHtml(problem.starter) + '</textarea><div class="aiml-workspace-row"><button type="button" data-action="check">Check Answer</button><button type="button" data-action="reset">Reset</button><span class="aiml-check-result" data-result>' + (saved ? "Best saved score: " + saved + "/100" : "Write your solution, then check its structure.") + '</span></div></div></article>';
        }).join("");

        list.addEventListener("click", function (event) {
            const button = event.target.closest("button[data-action]");
            if (!button) return;
            const card = button.closest(".aiml-problem-card");
            const index = Number(card.dataset.problem);
            const action = button.dataset.action;
            const problem = PROBLEMS[index];
            if (action === "workspace" || action === "hint" || action === "solution") {
                const panel = card.querySelector('[data-panel="' + action + '"]');
                const opening = panel.hidden;
                panel.hidden = !opening;
                if (action === "workspace") button.textContent = opening ? "Close Workspace" : "💻 Solve It Yourself";
                if (action === "hint") button.textContent = opening ? "Hide Hint" : "Hint";
                if (action === "solution") {
                    button.textContent = opening ? "Hide Program" : "Show Program";
                    if (opening) card.dataset.usedSolution = "true";
                }
                return;
            }
            const textarea = card.querySelector("textarea");
            const result = card.querySelector("[data-result]");
            if (action === "reset") {
                textarea.value = problem.starter;
                result.textContent = "Workspace reset. Your saved best score is unchanged.";
                result.className = "aiml-check-result";
                delete card.dataset.usedSolution;
                return;
            }
            if (action === "check") {
                const check = codeMatches(textarea.value, problem);
                if (!check.pass) {
                    result.textContent = "Keep working. Missing structural evidence: " + check.missing.join(", ") + ".";
                    result.className = "aiml-check-result error";
                    return;
                }
                const earned = card.dataset.usedSolution === "true" ? 60 : 100;
                records[index] = Math.max(scoreFor(index), earned);
                writeProgress({ problems: records });
                card.classList.add("is-solved");
                result.textContent = earned === 100 ? "Independent solution pattern accepted — 100/100." : "Solution pattern accepted after viewing the model — 60/100.";
                result.className = "aiml-check-result success";
                renderSummary();
            }
        });
        renderSummary();
    }

    const QUIZ = [
        { q: "What does an RL agent maximize?", options: ["Only the next reward","Expected cumulative return","The number of actions","The size of its state table"], answer: 1, explanation: "RL optimizes expected return, which combines immediate and delayed rewards according to the task horizon and discount." },
        { q: "When is a state representation Markov?", options: ["It contains every past observation","The next-outcome distribution depends only on current state and action","It has two actions","Its rewards are positive"], answer: 1, explanation: "A state is Markov when it contains the information needed for the conditional distribution of the next outcome given the current action." },
        { q: "What does γ control in discounted return?", options: ["Learning-rate step size","Relative influence of later rewards","Exploration probability","Replay-buffer capacity"], answer: 1, explanation: "Gamma multiplies future rewards or bootstrap values and determines the effective planning horizon." },
        { q: "Which value conditions explicitly on the first action?", options: ["Vπ(s)","Qπ(s,a)","P(s)","R only"], answer: 1, explanation: "Qπ conditions on both the state and the selected first action, then follows policy π afterward." },
        { q: "What does value iteration use inside its Bellman backup?", options: ["A minimum over rewards","A maximum over action expectations","Only the sampled behavior action","No successor values"], answer: 1, explanation: "The Bellman optimality backup selects the action with maximum expected immediate reward plus discounted successor value." },
        { q: "Why can TD(0) update before an episode ends?", options: ["It ignores reward","It bootstraps from the next-state estimate","It knows the full model","It uses no target"], answer: 1, explanation: "TD forms a one-step target using the observed reward and current estimate V(S′), so a full trajectory return is unnecessary." },
        { q: "Why is Q-learning called off-policy?", options: ["It has no policy","Its greedy target can differ from the exploratory behavior action","It never explores","It requires a transition model"], answer: 1, explanation: "Behavior may be epsilon-greedy, but the update target uses max over next-state actions and therefore evaluates the greedy target policy." },
        { q: "What value should be bootstrapped after a truly terminal transition?", options: ["The largest next Q","The smallest next Q","Zero","The current reward twice"], answer: 2, explanation: "There is no future return after terminal completion, so the bootstrap term is zero." },
        { q: "Which DQN component reduces correlation between consecutive training samples?", options: ["Experience replay","A larger epsilon forever","Removing rewards","Terminal bootstrapping"], answer: 0, explanation: "Replay stores transitions and samples mini-batches, reusing experience and reducing temporal correlation." },
        { q: "Why is one high evaluation return insufficient evidence?", options: ["Returns never matter","RL results vary across seeds, starts and environment conditions","Policies cannot be measured","Only loss is valid"], answer: 1, explanation: "Evaluation should report distributions across seeds and relevant states, along with success, constraints and robustness." }
    ];

    function initQuiz() {
        const list = get("quizQuestions");
        if (!list || list.dataset.cbActive) return;
        list.dataset.cbActive = "true";
        list.innerHTML = QUIZ.map(function (item, index) {
            return '<article class="aiml-quiz-question" data-quiz-question="' + index + '"><strong>' + (index + 1) + ". " + escapeHtml(item.q) + '</strong><div class="aiml-quiz-options">' + item.options.map(function (option, optionIndex) {
                return '<label class="aiml-quiz-option"><input type="radio" name="quiz' + index + '" value="' + optionIndex + '"><span>' + String.fromCharCode(65 + optionIndex) + ". " + escapeHtml(option) + '</span></label>';
            }).join("") + '</div><div class="aiml-quiz-explanation" hidden></div></article>';
        }).join("");

        list.addEventListener("change", function (event) {
            const question = event.target.closest(".aiml-quiz-question");
            if (!question) return;
            question.querySelectorAll(".aiml-quiz-option").forEach(function (option) {
                option.classList.toggle("is-selected", option.querySelector("input").checked);
            });
        });

        get("checkQuiz").addEventListener("click", function () {
            let correct = 0;
            QUIZ.forEach(function (item, index) {
                const question = list.querySelector('[data-quiz-question="' + index + '"]');
                const selected = question.querySelector("input:checked");
                question.querySelectorAll(".aiml-quiz-option").forEach(function (option) {
                    const value = Number(option.querySelector("input").value);
                    option.classList.toggle("is-correct", value === item.answer);
                    option.classList.toggle("is-wrong", Boolean(selected) && option.querySelector("input").checked && value !== item.answer);
                });
                if (selected && Number(selected.value) === item.answer) correct += 1;
                const explanation = question.querySelector(".aiml-quiz-explanation");
                explanation.hidden = false;
                explanation.textContent = (selected ? "Correct answer: " : "Not answered. Correct answer: ") + String.fromCharCode(65 + item.answer) + ". " + item.options[item.answer] + " — " + item.explanation;
            });
            get("quizScore").textContent = correct + " / " + QUIZ.length + " correct";
            writeProgress({ quizScore: correct });
        });

        get("resetQuiz").addEventListener("click", function () {
            list.querySelectorAll("input").forEach(function (input) { input.checked = false; });
            list.querySelectorAll(".aiml-quiz-option").forEach(function (option) { option.className = "aiml-quiz-option"; });
            list.querySelectorAll(".aiml-quiz-explanation").forEach(function (explanation) { explanation.hidden = true; explanation.textContent = ""; });
            get("quizScore").textContent = "Not checked yet";
        });
    }

    const INTERVIEWS = [
        ["What distinguishes reinforcement learning from supervised learning?", "Supervised learning receives target outputs for sampled inputs. RL receives scalar rewards generated by sequential interaction, its actions affect future data, and credit may need to cross many steps. The goal is expected cumulative return under a policy."],
        ["Define a Markov decision process.", "An MDP consists of states, available actions, transition and reward probabilities, and a discount or horizon. The Markov property requires the state to contain the information needed to predict the next outcome given the action."],
        ["Explain reward, return and value.", "Reward scores one transition. Return aggregates current and future rewards, often with discounting. A value function is the conditional expectation of that return from a state or state–action pair under a policy."],
        ["What is the Bellman expectation equation?", "It states that Vπ(s) equals the policy-weighted expectation of immediate reward plus γ times the successor value. It evaluates a fixed policy by decomposing long-term return into one-step recursive backups."],
        ["Compare policy iteration and value iteration.", "Policy iteration alternates policy evaluation with greedy improvement until the policy is stable. Value iteration repeatedly applies the Bellman optimality operator, combining partial evaluation and improvement, then extracts a greedy policy."],
        ["Compare Monte Carlo and TD learning.", "MC waits for a sampled episode return and does not bootstrap, giving higher-variance targets. TD updates after one or a few transitions using a bootstrap estimate, enabling online and continuing-task learning but introducing target bias."],
        ["Why is Q-learning off-policy while SARSA is on-policy?", "Q-learning targets reward plus γ max Q at the next state, regardless of the exploratory next behavior action. SARSA targets the Q value of the action actually selected by the behavior policy."],
        ["What conditions support tabular Q-learning convergence?", "For a finite stationary MDP, every state–action pair must continue to be visited, learning rates must satisfy stochastic-approximation conditions, rewards should be bounded and the discount or episodic setup must make returns well-defined."],
        ["How do you choose an exploration strategy?", "Start from the cost of exploration and stationarity. Epsilon-greedy is a baseline; decaying schedules, optimistic initialization, UCB, entropy regularization or posterior methods may use uncertainty better. Unsafe actions require constraints, simulation or offline methods."],
        ["What is the deadly triad?", "Function approximation, bootstrapping and off-policy learning can interact to cause instability or divergence. Deep RL algorithms use replay design, target networks, conservative updates and other controls, but assumptions and diagnostics remain essential."],
        ["Why do DQN use replay memory and target networks?", "Replay reuses transitions and reduces consecutive-sample correlation. A delayed target network makes the bootstrap target change more slowly, reducing harmful feedback between the prediction and its own moving label."],
        ["How would you evaluate an RL system for deployment?", "Use a fixed evaluation policy and environment version across many seeds and initial states. Report return distribution, success, episode length, violations, worst-case outcomes and robustness. Compare baselines and keep action constraints, monitoring and rollback."]
    ];

    function initInterviews() {
        const list = get("interviewList");
        if (!list || list.dataset.cbActive) return;
        list.dataset.cbActive = "true";
        list.innerHTML = INTERVIEWS.map(function (item, index) {
            return '<article class="aiml-interview-item"><div class="aiml-interview-question"><span>' + (index + 1) + '.</span><strong>' + escapeHtml(item[0]) + '</strong><button type="button" aria-expanded="false">Show Answer</button></div><div class="aiml-interview-answer" hidden><p>' + escapeHtml(item[1]) + "</p></div></article>";
        }).join("");
        list.addEventListener("click", function (event) {
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
        initMdpLab();
        initQLab();
        initTracer();
        initProblems();
        initQuiz();
        initInterviews();
    }

    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
    else init();

}());
