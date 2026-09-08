(function () {
    "use strict";

    const PROGRESS_KEY = "codebhavya-aiml-level-23-progress-v1";
    const get = function (id) { return document.getElementById(id); };

    function escapeHtml(value) {
        return String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
    }

    function fixed(value, digits) {
        return Number(value).toFixed(digits === undefined ? 1 : digits);
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

    const SEARCH_MAPS = {
        campus: {
            start: "S",
            goal: "G",
            nodes: {
                S: { x: 8, y: 52, h1: 8, h2: 9 },
                A: { x: 25, y: 18, h1: 6, h2: 7 },
                B: { x: 25, y: 82, h1: 7, h2: 7 },
                C: { x: 46, y: 32, h1: 4, h2: 5 },
                D: { x: 46, y: 70, h1: 5, h2: 4 },
                E: { x: 68, y: 34, h1: 2, h2: 2 },
                F: { x: 69, y: 76, h1: 1, h2: 1 },
                G: { x: 91, y: 51, h1: 0, h2: 0 }
            },
            edges: [["S","A",4],["S","B",2],["A","C",2],["A","D",5],["B","D",4],["B","C",6],["C","E",3],["C","G",8],["D","E",2],["D","F",5],["E","G",4],["F","G",2]]
        },
        grid: {
            start: "S",
            goal: "G",
            nodes: {
                S: { x: 8, y: 22, h1: 8, h2: 8 },
                A: { x: 28, y: 22, h1: 7, h2: 7 },
                B: { x: 48, y: 22, h1: 5, h2: 5 },
                C: { x: 68, y: 22, h1: 3, h2: 3 },
                D: { x: 28, y: 72, h1: 6, h2: 6 },
                E: { x: 48, y: 72, h1: 4, h2: 4 },
                F: { x: 68, y: 72, h1: 2, h2: 2 },
                G: { x: 90, y: 48, h1: 0, h2: 0 }
            },
            edges: [["S","A",2],["S","D",5],["A","B",2],["A","D",3],["B","C",2],["B","E",4],["D","E",2],["E","F",2],["C","G",3],["F","G",2]]
        },
        weighted: {
            start: "S",
            goal: "G",
            nodes: {
                S: { x: 8, y: 50, h1: 7, h2: 8 },
                A: { x: 27, y: 15, h1: 5, h2: 6 },
                B: { x: 27, y: 50, h1: 6, h2: 6 },
                C: { x: 27, y: 85, h1: 6, h2: 7 },
                D: { x: 52, y: 23, h1: 3, h2: 4 },
                E: { x: 52, y: 67, h1: 4, h2: 4 },
                F: { x: 73, y: 48, h1: 2, h2: 2 },
                G: { x: 92, y: 48, h1: 0, h2: 0 }
            },
            edges: [["S","A",3],["S","B",2],["S","C",4],["A","D",4],["B","D",7],["B","E",3],["C","E",2],["D","F",3],["E","F",2],["D","G",7],["F","G",3]]
        }
    };

    function adjacencyOf(map) {
        const adjacency = {};
        Object.keys(map.nodes).forEach(function (node) { adjacency[node] = []; });
        map.edges.forEach(function (edge) {
            adjacency[edge[0]].push({ node: edge[1], cost: edge[2] });
            adjacency[edge[1]].push({ node: edge[0], cost: edge[2] });
        });
        Object.keys(adjacency).forEach(function (node) {
            adjacency[node].sort(function (left, right) { return left.node.localeCompare(right.node); });
        });
        return adjacency;
    }

    function heuristic(map, node, kind) {
        if (kind === "zero") return 0;
        return map.nodes[node][kind === "manhattan" ? "h2" : "h1"];
    }

    function searchPriority(algorithm, g, h, depth) {
        if (algorithm === "bfs") return depth;
        if (algorithm === "ucs") return g;
        if (algorithm === "greedy") return h;
        return g + h;
    }

    function reconstruct(parent, goal) {
        const path = [goal];
        while (parent[path[path.length - 1]] !== undefined) path.push(parent[path[path.length - 1]]);
        return path.reverse();
    }

    function buildSearchTrace(mapKey, algorithm, heuristicKind) {
        const map = SEARCH_MAPS[mapKey] || SEARCH_MAPS.campus;
        const adjacency = adjacencyOf(map);
        const bestG = {};
        const parent = {};
        const frontier = [];
        const expanded = [];
        const events = [];
        let order = 0;
        bestG[map.start] = 0;
        frontier.push({ node: map.start, g: 0, h: heuristic(map, map.start, heuristicKind), depth: 0, order: order++ });

        function priority(entry) {
            return searchPriority(algorithm, entry.g, entry.h, entry.depth);
        }

        function orderedFrontier() {
            if (algorithm === "bfs") return frontier.slice();
            return frontier.slice().sort(function (left, right) {
                return priority(left) - priority(right) || left.order - right.order;
            });
        }

        function snapshot(phase, current, message, equation, next, path) {
            const visibleFrontier = orderedFrontier();
            events.push({
                phase: phase,
                current: current || "—",
                message: message,
                equation: equation,
                next: next,
                frontier: clone(visibleFrontier),
                expanded: expanded.slice(),
                bestG: clone(bestG),
                parent: clone(parent),
                path: path ? path.slice() : [],
                cost: path && path.length ? bestG[path[path.length - 1]] : null,
                evidence: visibleFrontier.length ? visibleFrontier.map(function (item) {
                    return item.node + ": p=" + fixed(priority(item), 0) + ", g=" + fixed(item.g, 0) + ", h=" + fixed(item.h, 0);
                }).join(" • ") : "Frontier empty"
            });
        }

        snapshot("Ready", map.start, "The start state enters the frontier with zero accumulated cost.", algorithm === "astar" ? "f(S)=0+h(S)" : "priority(S)=" + fixed(priority(frontier[0]), 0), "Pop the state with the smallest permitted priority.");

        while (frontier.length) {
            let entry;
            if (algorithm === "bfs") entry = frontier.shift();
            else {
                frontier.sort(function (left, right) { return priority(left) - priority(right) || left.order - right.order; });
                entry = frontier.shift();
            }
            snapshot("Select", entry.node, "Remove " + entry.node + " from the frontier.", "priority=" + fixed(priority(entry), 0) + " • g=" + fixed(entry.g, 0) + " • h=" + fixed(entry.h, 0), "Check whether this queue entry is stale.");
            if (entry.g !== bestG[entry.node]) {
                snapshot("Skip stale", entry.node, "A cheaper route to " + entry.node + " is already known, so this entry is ignored.", fixed(entry.g, 0) + " ≠ best_g[" + entry.node + "]=" + fixed(bestG[entry.node], 0), "Return to the frontier.");
                continue;
            }
            if (expanded.indexOf(entry.node) === -1) expanded.push(entry.node);
            snapshot("Expand", entry.node, "Expand " + entry.node + " and reveal its outgoing edges.", "best_g[" + entry.node + "]=" + fixed(entry.g, 0), entry.node === map.goal ? "The goal is safely popped; reconstruct the path." : "Relax each neighbouring edge.");
            if (entry.node === map.goal) {
                const path = reconstruct(parent, map.goal);
                snapshot("Complete", entry.node, "The goal has the minimum permitted frontier priority. Follow parents to reconstruct the answer.", path.join(" → ") + " • cost=" + fixed(bestG[map.goal], 0), "Compare this route with the algorithms under other controls.", path);
                break;
            }
            adjacency[entry.node].forEach(function (edge) {
                const tentative = entry.g + edge.cost;
                const known = bestG[edge.node];
                const edgeH = heuristic(map, edge.node, heuristicKind);
                snapshot("Inspect edge", entry.node, "Consider " + entry.node + " → " + edge.node + " with cost " + edge.cost + ".", "tentative_g=" + fixed(entry.g, 0) + "+" + edge.cost + "=" + fixed(tentative, 0), "Compare tentative_g with the best known cost.");
                const shouldAdd = algorithm === "bfs" ? known === undefined : known === undefined || tentative < known;
                if (shouldAdd) {
                    bestG[edge.node] = tentative;
                    parent[edge.node] = entry.node;
                    const candidate = { node: edge.node, g: tentative, h: edgeH, depth: entry.depth + 1, order: order++ };
                    frontier.push(candidate);
                    snapshot("Relax edge", edge.node, "Record the improved route to " + edge.node + " and add it to the frontier.", "priority=" + fixed(priority(candidate), 0) + " • g=" + fixed(tentative, 0) + " • h=" + fixed(edgeH, 0), "Continue with the remaining neighbours.");
                } else {
                    snapshot("Reject edge", edge.node, "The proposed route does not improve the recorded state.", known === undefined ? "state already discovered" : fixed(tentative, 0) + " ≥ " + fixed(known, 0), "Continue with the remaining neighbours.");
                }
            });
            snapshot("Loop", entry.node, "All neighbours of " + entry.node + " are processed. Return to the frontier.", "frontier size=" + frontier.length, "Select the next state by the algorithm’s priority.");
        }
        if (!events.some(function (event) { return event.phase === "Complete"; })) {
            snapshot("No path", "—", "The frontier is empty, so the goal is unreachable.", "frontier=∅", "Change the map or inspect graph connectivity.");
        }
        return events;
    }

    function drawSearch(canvas, mapKey, state) {
        const prepared = prepareCanvas(canvas, 480, 410);
        const context = prepared.context;
        const width = prepared.width;
        const height = prepared.height;
        const map = SEARCH_MAPS[mapKey] || SEARCH_MAPS.campus;
        const marginX = 34;
        const marginY = 42;
        const graphWidth = width - marginX * 2;
        const graphHeight = height - marginY * 2;
        const point = function (node) {
            return { x: marginX + map.nodes[node].x / 100 * graphWidth, y: marginY + map.nodes[node].y / 100 * graphHeight };
        };
        const pathEdges = {};
        (state.path || []).forEach(function (node, index, path) {
            if (!index) return;
            pathEdges[[path[index - 1], node].sort().join("|")] = true;
        });
        context.clearRect(0, 0, width, height);
        context.fillStyle = "#06182c";
        context.fillRect(0, 0, width, height);
        context.lineCap = "round";
        map.edges.forEach(function (edge) {
            const from = point(edge[0]);
            const to = point(edge[1]);
            const isPath = pathEdges[[edge[0], edge[1]].sort().join("|")];
            context.strokeStyle = isPath ? "#45e3a2" : "#31516f";
            context.lineWidth = isPath ? 6 : 2;
            context.beginPath();
            context.moveTo(from.x, from.y);
            context.lineTo(to.x, to.y);
            context.stroke();
            const mx = (from.x + to.x) / 2;
            const my = (from.y + to.y) / 2;
            context.fillStyle = "#071a31";
            context.beginPath();
            context.arc(mx, my, 12, 0, Math.PI * 2);
            context.fill();
            context.fillStyle = "#bfd8ee";
            context.font = "700 12px Arial";
            context.textAlign = "center";
            context.textBaseline = "middle";
            context.fillText(String(edge[2]), mx, my);
        });
        const frontierNodes = state.frontier.map(function (item) { return item.node; });
        Object.keys(map.nodes).forEach(function (node) {
            const p = point(node);
            let fill = "#102a45";
            let stroke = "#4f718e";
            if (state.expanded.indexOf(node) !== -1) { fill = "#0d6072"; stroke = "#39d9f3"; }
            if (frontierNodes.indexOf(node) !== -1) { fill = "#725c08"; stroke = "#ffd83d"; }
            if (state.path.indexOf(node) !== -1) { fill = "#106547"; stroke = "#45e3a2"; }
            if (state.current === node) { fill = "#6f3cc3"; stroke = "#cba4ff"; }
            if (node === map.start) stroke = "#36d9ff";
            if (node === map.goal) stroke = "#45e3a2";
            context.shadowColor = stroke;
            context.shadowBlur = state.current === node ? 18 : 7;
            context.fillStyle = fill;
            context.strokeStyle = stroke;
            context.lineWidth = 3;
            context.beginPath();
            context.arc(p.x, p.y, width < 560 ? 20 : 24, 0, Math.PI * 2);
            context.fill();
            context.stroke();
            context.shadowBlur = 0;
            context.fillStyle = "#ffffff";
            context.font = "800 15px Arial";
            context.textAlign = "center";
            context.textBaseline = "middle";
            context.fillText(node, p.x, p.y);
            if (state.bestG[node] !== undefined) {
                context.fillStyle = "#9adff8";
                context.font = "700 11px Arial";
                context.fillText("g=" + fixed(state.bestG[node], 0), p.x, p.y + 37);
            }
        });
        context.textAlign = "left";
        context.fillStyle = "#8fb8d4";
        context.font = "600 12px Arial";
        context.fillText("cyan = expanded   yellow = frontier   purple = current   green = final path", 18, height - 14);
    }

    function initSearchLab() {
        const canvas = get("searchCanvas");
        if (!canvas || canvas.dataset.cbActive) return;
        canvas.dataset.cbActive = "true";
        const controls = ["searchMap", "searchAlgorithm", "searchHeuristic"].map(get);
        const next = get("searchNext");
        const auto = get("searchAuto");
        const pause = get("searchPause");
        const reset = get("searchReset");
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
            events = buildSearchTrace(get("searchMap").value, get("searchAlgorithm").value, get("searchHeuristic").value);
            position = 0;
            render();
        }

        function render() {
            const state = events[Math.min(position, events.length - 1)];
            drawSearch(canvas, get("searchMap").value, state);
            get("searchPhase").textContent = state.phase;
            get("searchExpanded").textContent = String(state.expanded.length);
            get("searchFrontier").textContent = String(state.frontier.length);
            get("searchCost").textContent = state.cost === null ? "—" : fixed(state.cost, 0);
            get("searchCurrent").textContent = state.current;
            get("searchVerdict").textContent = state.message;
            get("searchEquation").textContent = state.equation;
            get("searchExplanation").textContent = state.phase === "Complete" ? "The green route follows the parent map from goal to start and is shown in forward order." : "The canvas is a live view of expanded states, the frontier and best-known path costs.";
            get("searchEvidence").textContent = state.evidence;
            get("searchNextCheck").textContent = state.next;
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
            timer = window.setInterval(advance, 520);
            render();
        });
        pause.addEventListener("click", function () { stop(); render(); });
        reset.addEventListener("click", rebuild);
        window.addEventListener("resize", render);
        rebuild();
    }

    const GAME_TREES = {
        balanced: [3, 5, 6, 9, 1, 2, 0, -1, 7, 4, 5, 8],
        tactical: [5, 6, 2, 9, 4, 4, 8, 7, -2, 10, 3, 1],
        pruning: [8, 9, 7, 6, 5, 4, 3, 2, 1, 0, -1, -2]
    };

    function makeGameTree(key) {
        const utilities = GAME_TREES[key] || GAME_TREES.balanced;
        let leafIndex = 0;
        return {
            id: "R", label: "MAX", level: 0, children: ["A", "B", "C"].map(function (move) {
                return {
                    id: move, label: "MOVE " + move, level: 1, children: [move + "1", move + "2"].map(function (reply) {
                        return {
                            id: reply, label: "MAX", level: 2, children: [0, 1].map(function () {
                                const value = utilities[leafIndex];
                                return { id: "L" + leafIndex++, label: String(value), level: 3, value: value, children: [] };
                            })
                        };
                    })
                };
            })
        };
    }

    function trueMinimax(node, maximizing) {
        if (!node.children.length) return node.value;
        const values = node.children.map(function (child) { return trueMinimax(child, !maximizing); });
        return maximizing ? Math.max.apply(null, values) : Math.min.apply(null, values);
    }

    function descendants(node) {
        return node.children.reduce(function (all, child) { return all.concat([child.id], descendants(child)); }, []);
    }

    function orderChildren(node, maximizing, mode) {
        if (mode === "left") return node.children.slice();
        const ranked = node.children.map(function (child, index) {
            return { child: child, index: index, value: trueMinimax(child, !maximizing) };
        });
        ranked.sort(function (left, right) {
            const direction = maximizing ? right.value - left.value : left.value - right.value;
            return (mode === "best" ? direction : -direction) || left.index - right.index;
        });
        return ranked.map(function (item) { return item.child; });
    }

    function buildGameTrace(treeKey, algorithm, orderMode) {
        const root = makeGameTree(treeKey);
        const events = [];
        const values = {};
        const pruned = [];
        let visited = 0;

        function snapshot(phase, active, message, equation, alpha, beta, next) {
            events.push({
                phase: phase,
                active: active,
                message: message,
                equation: equation,
                alpha: alpha,
                beta: beta,
                next: next,
                values: clone(values),
                pruned: pruned.slice(),
                visited: visited,
                rootValue: values.R,
                bestMove: values.R === undefined ? "—" : root.children.filter(function (child) { return values[child.id] === values.R; }).map(function (child) { return child.id; })[0] || "—",
                tree: root
            });
        }

        snapshot("Ready", "R", "MAX must compare the opponent’s best replies.", "V(MAX)=max V(child)", -Infinity, Infinity, "Enter the root and follow the selected move order.");

        function evaluate(node, maximizing, alpha, beta) {
            snapshot("Enter " + node.id, node.id, "Enter " + node.label + (maximizing ? " as a MAX node." : " as a MIN node."), maximizing ? "value=−∞" : "value=+∞", alpha, beta, node.children.length ? "Evaluate its first ordered child." : "Read the terminal utility.");
            if (!node.children.length) {
                values[node.id] = node.value;
                visited += 1;
                snapshot("Read leaf", node.id, "Terminal utility " + node.value + " is evaluated from MAX’s perspective.", "V(" + node.id + ")=" + node.value, alpha, beta, "Return this value to the parent.");
                return node.value;
            }
            let best = maximizing ? -Infinity : Infinity;
            const ordered = orderChildren(node, maximizing, orderMode);
            for (let index = 0; index < ordered.length; index += 1) {
                const child = ordered[index];
                const childValue = evaluate(child, !maximizing, alpha, beta);
                best = maximizing ? Math.max(best, childValue) : Math.min(best, childValue);
                values[node.id] = best;
                if (algorithm === "alphabeta") {
                    if (maximizing) alpha = Math.max(alpha, best);
                    else beta = Math.min(beta, best);
                }
                snapshot("Back up", node.id, (maximizing ? "MAX" : "MIN") + " updates " + node.id + " after child " + child.id + ".", "V(" + node.id + ")=" + best + (algorithm === "alphabeta" ? " • α=" + (alpha === -Infinity ? "−∞" : alpha) + " • β=" + (beta === Infinity ? "+∞" : beta) : ""), alpha, beta, "Check the remaining children and the α–β cutoff.");
                if (algorithm === "alphabeta" && alpha >= beta && index < ordered.length - 1) {
                    const skipped = ordered.slice(index + 1);
                    skipped.forEach(function (remaining) {
                        if (pruned.indexOf(remaining.id) === -1) pruned.push(remaining.id);
                        descendants(remaining).forEach(function (id) { if (pruned.indexOf(id) === -1) pruned.push(id); });
                    });
                    snapshot("Prune", node.id, "α ≥ β proves that " + skipped.length + " remaining branch" + (skipped.length === 1 ? "" : "es") + " cannot change the ancestor’s choice.", "α=" + alpha + " ≥ β=" + beta, alpha, beta, "Return the current bound without reading pruned leaves.");
                    break;
                }
            }
            snapshot("Return " + node.id, node.id, node.id + " returns its backed-up value " + best + ".", "V(" + node.id + ")=" + best, alpha, beta, node.id === "R" ? "Choose the child whose value equals the root value." : "Continue at the parent.");
            return best;
        }

        evaluate(root, true, -Infinity, Infinity);
        const rootValue = values.R;
        const bestMove = root.children.filter(function (child) { return values[child.id] === rootValue; })[0];
        snapshot("Complete", "R", "MAX chooses move " + (bestMove ? bestMove.id : "—") + " with guaranteed value " + rootValue + ".", "max(" + root.children.map(function (child) { return values[child.id] === undefined ? "?" : values[child.id]; }).join(", ") + ")=" + rootValue, -Infinity, Infinity, "Change move order and compare the number of evaluated leaves.");
        return events;
    }

    function layoutGameTree(root, width, height) {
        const positions = {};
        const leaves = [];
        function collect(node) {
            if (!node.children.length) leaves.push(node);
            else node.children.forEach(collect);
        }
        collect(root);
        leaves.forEach(function (leaf, index) {
            positions[leaf.id] = { x: 28 + index * (width - 56) / Math.max(1, leaves.length - 1), y: height - 62 };
        });
        function place(node) {
            if (!node.children.length) return positions[node.id];
            const children = node.children.map(place);
            positions[node.id] = {
                x: children.reduce(function (total, position) { return total + position.x; }, 0) / children.length,
                y: 42 + node.level * (height - 112) / 3
            };
            return positions[node.id];
        }
        place(root);
        return positions;
    }

    function drawGame(canvas, state) {
        const prepared = prepareCanvas(canvas, 500, 430);
        const context = prepared.context;
        const width = prepared.width;
        const height = prepared.height;
        const positions = layoutGameTree(state.tree, width, height);
        context.clearRect(0, 0, width, height);
        context.fillStyle = "#06182c";
        context.fillRect(0, 0, width, height);
        function drawEdges(node) {
            node.children.forEach(function (child) {
                const from = positions[node.id];
                const to = positions[child.id];
                const isPruned = state.pruned.indexOf(child.id) !== -1;
                context.strokeStyle = isPruned ? "#334155" : "#315f7e";
                context.lineWidth = isPruned ? 1 : 2;
                context.setLineDash(isPruned ? [5, 7] : []);
                context.beginPath();
                context.moveTo(from.x, from.y + 17);
                context.lineTo(to.x, to.y - 17);
                context.stroke();
                drawEdges(child);
            });
        }
        drawEdges(state.tree);
        context.setLineDash([]);
        function drawNodes(node) {
            const p = positions[node.id];
            const isLeaf = !node.children.length;
            const isPruned = state.pruned.indexOf(node.id) !== -1;
            const isActive = state.active === node.id;
            const hasValue = state.values[node.id] !== undefined;
            const w = isLeaf ? 38 : (node.level === 1 ? 72 : 52);
            const h = isLeaf ? 34 : 38;
            context.fillStyle = isPruned ? "#162435" : (isActive ? "#6f3cc3" : hasValue ? "#0d6072" : "#102a45");
            context.strokeStyle = isPruned ? "#45576a" : (isActive ? "#cba4ff" : hasValue ? "#39d9f3" : "#557b98");
            context.lineWidth = isActive ? 3 : 2;
            roundRect(context, p.x - w / 2, p.y - h / 2, w, h, 10);
            context.fill();
            context.stroke();
            context.fillStyle = isPruned ? "#6f8192" : "#ffffff";
            context.textAlign = "center";
            context.textBaseline = "middle";
            context.font = "800 " + (isLeaf ? 12 : 11) + "px Arial";
            let label = isLeaf ? node.label : (hasValue ? node.id + "=" + state.values[node.id] : node.id);
            context.fillText(label, p.x, p.y);
            if (node.level === 1) {
                context.fillStyle = "#8fb8d4";
                context.font = "700 10px Arial";
                context.fillText("MIN", p.x, p.y - 28);
            } else if (node.level === 2) {
                context.fillStyle = "#8fb8d4";
                context.font = "700 9px Arial";
                context.fillText("MAX", p.x, p.y - 27);
            }
            node.children.forEach(drawNodes);
        }
        drawNodes(state.tree);
        context.textAlign = "left";
        context.fillStyle = "#8fb8d4";
        context.font = "600 12px Arial";
        context.fillText("purple = active   cyan = backed up   dashed = pruned", 18, height - 14);
    }

    function initGameLab() {
        const canvas = get("gameCanvas");
        if (!canvas || canvas.dataset.cbActive) return;
        canvas.dataset.cbActive = "true";
        const controls = ["gameTree", "gameAlgorithm", "gameOrder"].map(get);
        const next = get("gameNext");
        const auto = get("gameAuto");
        const pause = get("gamePause");
        const reset = get("gameReset");
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
            events = buildGameTrace(get("gameTree").value, get("gameAlgorithm").value, get("gameOrder").value);
            position = 0;
            render();
        }

        function render() {
            const state = events[Math.min(position, events.length - 1)];
            drawGame(canvas, state);
            get("gamePhase").textContent = state.phase;
            get("gameVisited").textContent = String(state.visited);
            get("gamePruned").textContent = String(state.pruned.filter(function (id) { return id.charAt(0) === "L"; }).length);
            get("gameRootValue").textContent = state.rootValue === undefined ? "—" : String(state.rootValue);
            get("gameBestMove").textContent = state.bestMove;
            get("gameVerdict").textContent = state.message;
            get("gameEquation").textContent = state.equation;
            get("gameExplanation").textContent = state.phase === "Complete" ? "The chosen move maximizes the minimum response value. Pruned leaves were unnecessary proofs, not guessed values." : "Values are backed up from terminal utilities while α and β summarize guaranteed alternatives.";
            get("gameEvidence").textContent = "α = " + (state.alpha === -Infinity ? "−∞" : state.alpha) + " • β = " + (state.beta === Infinity ? "+∞" : state.beta) + " • leaves read = " + state.visited;
            get("gameNextCheck").textContent = state.next;
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
            timer = window.setInterval(advance, 460);
            render();
        });
        pause.addEventListener("click", function () { stop(); render(); });
        reset.addEventListener("click", rebuild);
        window.addEventListener("resize", render);
        rebuild();
    }

    const TRACER_CODE = [
        "graph = {'S':[('A',4),('B',2)], 'A':[('C',2),('D',5)],",
        "         'B':[('D',4),('C',6)], 'C':[('E',3),('G',8)],",
        "         'D':[('E',2),('F',5)], 'E':[('G',4)], 'F':[('G',2)], 'G':[]}",
        "heuristic = {'S':8,'A':6,'B':7,'C':4,'D':5,'E':2,'F':1,'G':0}",
        "start, goal = 'S', 'G'",
        "frontier = [(heuristic[start], 0, start)]",
        "best_g = {start: 0}",
        "parent = {}",
        "while frontier:",
        "    priority, g, node = heappop(frontier)",
        "    if g != best_g[node]:",
        "        continue",
        "    if node == goal:",
        "        break",
        "    for neighbour, cost in graph[node]:",
        "        tentative_g = g + cost",
        "        if tentative_g < best_g.get(neighbour, inf):",
        "            best_g[neighbour] = tentative_g",
        "            parent[neighbour] = node",
        "            heappush(frontier, (tentative_g + heuristic[neighbour], tentative_g, neighbour))",
        "path = [goal]",
        "while path[-1] != start:",
        "    path.append(parent[path[-1]])",
        "path.reverse()",
        "print(path, best_g[goal])"
    ];

    function buildTracerStates() {
        const graph = {
            S: [["A",4],["B",2]], A: [["C",2],["D",5]], B: [["D",4],["C",6]],
            C: [["E",3],["G",8]], D: [["E",2],["F",5]], E: [["G",4]], F: [["G",2]], G: []
        };
        const h = { S:8, A:6, B:7, C:4, D:5, E:2, F:1, G:0 };
        const states = [];
        const frontier = [];
        const bestG = {};
        const parent = {};
        let node = "—";
        let neighbour = "—";
        let g = "—";
        let tentative = "—";
        let path = [];
        let output = "";

        function formatFrontier() {
            return "[" + frontier.slice().sort(function (a, b) { return a[0] - b[0] || a[2].localeCompare(b[2]); }).map(function (item) {
                return "(" + item[0] + "," + item[1] + "," + item[2] + ")";
            }).join(", ") + "]";
        }

        function snapshot(line, explanation, expression, extras) {
            const variables = {
                node: String(node),
                neighbour: String(neighbour),
                g: String(g),
                tentative_g: String(tentative),
                frontier: formatFrontier(),
                best_g: JSON.stringify(bestG),
                parent: JSON.stringify(parent),
                path: "[" + path.join(", ") + "]"
            };
            Object.keys(extras || {}).forEach(function (key) { variables[key] = String(extras[key]); });
            states.push({ line: line, explanation: explanation, expression: expression, output: output || "Waiting for print(...)", variables: variables });
        }

        snapshot(1, "Create the directed weighted graph.", "graph has 8 states", { graph_edges: "12" });
        snapshot(4, "Store an admissible remaining-cost estimate for each state.", "heuristic['S'] = 8", { heuristic_S: 8 });
        snapshot(5, "Choose S as the start and G as the goal.", "start='S', goal='G'", { start: "S", goal: "G" });
        frontier.push([h.S, 0, "S"]);
        snapshot(6, "Push the start with f=g+h=8.", "(8, 0, 'S')", {});
        bestG.S = 0;
        snapshot(7, "Record the best discovered start cost.", "best_g={'S':0}", {});
        snapshot(8, "Begin with an empty parent map.", "parent={}", {});

        let finished = false;
        while (frontier.length && !finished) {
            snapshot(9, "The while loop checks that the frontier is non-empty.", "bool(frontier) is True", {});
            frontier.sort(function (a, b) { return a[0] - b[0] || a[2].localeCompare(b[2]); });
            const entry = frontier.shift();
            const priority = entry[0];
            g = entry[1];
            node = entry[2];
            neighbour = "—";
            tentative = "—";
            snapshot(10, "Pop the entry with minimum A* priority.", "heappop → (" + priority + "," + g + "," + node + ")", { priority: priority });
            snapshot(11, "Compare the popped cost with the authoritative best cost.", g + " != " + bestG[node] + " is " + (g !== bestG[node]), {});
            if (g !== bestG[node]) {
                snapshot(12, "This entry is stale, so execution continues at the while condition.", "continue", {});
                continue;
            }
            snapshot(13, "Check whether the safely popped state is the goal.", node + " == G is " + (node === "G"), {});
            if (node === "G") {
                snapshot(14, "The goal has minimum frontier priority, so the search loop stops.", "break", {});
                finished = true;
                break;
            }
            const edges = graph[node];
            for (let index = 0; index < edges.length; index += 1) {
                neighbour = edges[index][0];
                const cost = edges[index][1];
                snapshot(15, "Enter the for loop for neighbour " + neighbour + ".", "(" + neighbour + "," + cost + ")", { cost: cost, edge_index: index });
                tentative = Number(g) + cost;
                snapshot(16, "Add the edge cost to the current best path.", tentative + " = " + g + " + " + cost, { cost: cost });
                const known = bestG[neighbour] === undefined ? Infinity : bestG[neighbour];
                snapshot(17, "Accept only a strictly cheaper discovered route.", tentative + " < " + (known === Infinity ? "∞" : known) + " is " + (tentative < known), { known_g: known === Infinity ? "∞" : known });
                if (tentative < known) {
                    bestG[neighbour] = tentative;
                    snapshot(18, "Update the neighbour’s best path cost.", "best_g[" + neighbour + "]=" + tentative, {});
                    parent[neighbour] = node;
                    snapshot(19, "Remember which state produced that improved route.", "parent[" + neighbour + "]=" + node, {});
                    frontier.push([tentative + h[neighbour], tentative, neighbour]);
                    snapshot(20, "Push a fresh A* entry using f=g+h.", "(" + (tentative + h[neighbour]) + "," + tentative + "," + neighbour + ")", { heuristic: h[neighbour] });
                }
                snapshot(15, "Return to the for loop for the next outgoing edge.", "next neighbour of " + node, { processed_edges: index + 1 });
            }
            snapshot(9, "The for loop is complete; control returns to the while condition.", "frontier size = " + frontier.length, {});
        }

        path = ["G"];
        snapshot(21, "Initialize reconstruction from the goal.", "path=['G']", {});
        while (path[path.length - 1] !== "S") {
            snapshot(22, "The current first-principles path has not reached the start.", path[path.length - 1] + " != S", {});
            const predecessor = parent[path[path.length - 1]];
            path.push(predecessor);
            snapshot(23, "Append the recorded predecessor.", "append(" + predecessor + ")", { predecessor: predecessor });
        }
        snapshot(22, "The start is reached, so reconstruction stops.", "S != S is False", {});
        path.reverse();
        snapshot(24, "Reverse the parent chain into start-to-goal order.", "[" + path.join(", ") + "]", {});
        output = "['" + path.join("', '") + "'] " + bestG.G;
        snapshot(25, "Print the optimal route and its total cost.", "print(path, best_g[goal])", {});
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
            get("tracerExplanation").textContent = state ? state.explanation : "Press Next to initialize the graph.";
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
            timer = window.setInterval(advance, 110);
            render();
        });
        pause.addEventListener("click", function () { stop(); render(); });
        reset.addEventListener("click", function () { stop(); position = 0; render(); });
        render();
    }

    const PROBLEMS = [
        {
            title: "Traverse a Graph with BFS",
            difficulty: "BEGINNER",
            prompt: "Return nodes in breadth-first order from a start state. The graph may contain cycles.",
            example: "graph={'A':['B','C'],'B':['D'],'C':['D'],'D':[]}, start='A'\nOutput: ['A','B','C','D']",
            hint: "Use a deque and add a node to seen when it enters the queue, not after it leaves.",
            starter: "from collections import deque\n\ndef bfs(graph, start):\n    # Write your code\n    pass",
            solution: "from collections import deque\n\ndef bfs(graph, start):\n    queue = deque([start])\n    seen = {start}\n    order = []\n    while queue:\n        node = queue.popleft()\n        order.append(node)\n        for neighbour in graph.get(node, []):\n            if neighbour not in seen:\n                seen.add(neighbour)\n                queue.append(neighbour)\n    return order",
            all: [["deque"],["while"],["popleft"],["return"]],
            any: [["seen","visited"],["for neighbour","for neighbor"]]
        },
        {
            title: "Compute Uniform-Cost Shortest Distances",
            difficulty: "INTERMEDIATE",
            prompt: "Given a non-negative weighted adjacency list, return the minimum cost from start to every reachable state.",
            example: "graph={'A':[('B',4),('C',1)],'C':[('B',2)],'B':[]}\nOutput: {'A':0,'C':1,'B':3}",
            hint: "Push improved distances into a min-heap and ignore a popped entry when its cost no longer equals dist[node].",
            starter: "from heapq import heappush, heappop\n\ndef shortest_costs(graph, start):\n    # Write your code\n    pass",
            solution: "from heapq import heappush, heappop\n\ndef shortest_costs(graph, start):\n    frontier = [(0, start)]\n    dist = {start: 0}\n    while frontier:\n        cost, node = heappop(frontier)\n        if cost != dist[node]:\n            continue\n        for neighbour, weight in graph.get(node, []):\n            candidate = cost + weight\n            if candidate < dist.get(neighbour, float('inf')):\n                dist[neighbour] = candidate\n                heappush(frontier, (candidate, neighbour))\n    return dist",
            all: [["heappush"],["heappop"],["while"],["continue"],["return"]],
            any: [["dist","distance"],["float('inf')","float(\"inf\")","inf"]]
        },
        {
            title: "Find an Optimal Path with A*",
            difficulty: "ADVANCED",
            prompt: "Return the optimal start-to-goal path using edge costs, an admissible heuristic and parent reconstruction.",
            example: "start='S', goal='G', heuristic={'S':3,'A':1,'G':0}\nOutput: ['S','A','G']",
            hint: "Prioritize tentative_g + heuristic[neighbour], update parents only with a cheaper g and stop when the goal is popped.",
            starter: "from heapq import heappush, heappop\n\ndef astar(graph, heuristic, start, goal):\n    # Write your code\n    pass",
            solution: "from heapq import heappush, heappop\n\ndef astar(graph, heuristic, start, goal):\n    frontier = [(heuristic[start], 0, start)]\n    best_g = {start: 0}\n    parent = {}\n    while frontier:\n        _, g, node = heappop(frontier)\n        if g != best_g[node]:\n            continue\n        if node == goal:\n            path = [goal]\n            while path[-1] != start:\n                path.append(parent[path[-1]])\n            return path[::-1]\n        for neighbour, cost in graph.get(node, []):\n            candidate = g + cost\n            if candidate < best_g.get(neighbour, float('inf')):\n                best_g[neighbour] = candidate\n                parent[neighbour] = node\n                heappush(frontier, (candidate + heuristic[neighbour], candidate, neighbour))\n    return []",
            all: [["heappush"],["heappop"],["while"],["parent"],["heuristic"],["return"]],
            any: [["best_g","bestg"],["candidate + heuristic","tentative_g + heuristic","tentative + heuristic"]]
        },
        {
            title: "Evaluate a Minimax Tree",
            difficulty: "INTERMEDIATE",
            prompt: "A nested list represents alternating MAX and MIN layers and integers are utilities. Return the backed-up minimax value.",
            example: "tree=[[[3,5],[6,9]],[[1,2],[0,-1]]]\nOutput: 5",
            hint: "Pass a maximizing flag through recursion and alternate it for every child.",
            starter: "def minimax(tree, maximizing=True):\n    # Write your code\n    pass",
            solution: "def minimax(tree, maximizing=True):\n    if isinstance(tree, (int, float)):\n        return tree\n    values = [minimax(child, not maximizing) for child in tree]\n    return max(values) if maximizing else min(values)",
            all: [["def minimax"],["return"],["max("],["min("]],
            any: [["not maximizing","maximizing == false"],["isinstance","type("]]
        },
        {
            title: "Color a Constraint Graph",
            difficulty: "ADVANCED",
            prompt: "Assign one available color to every node so adjacent nodes differ. Return a valid assignment or None.",
            example: "graph={'A':['B','C'],'B':['A','C'],'C':['A','B']}, colors=['R','G','B']\nOutput: a valid three-color assignment",
            hint: "Choose an unassigned variable, try every color, check assigned neighbours and undo a failed choice.",
            starter: "def color_graph(graph, colors):\n    assignment = {}\n    # Write your backtracking code\n    pass",
            solution: "def color_graph(graph, colors):\n    assignment = {}\n    def backtrack():\n        if len(assignment) == len(graph):\n            return assignment.copy()\n        node = min((n for n in graph if n not in assignment),\n                   key=lambda n: sum(m not in assignment for m in graph[n]))\n        for color in colors:\n            if all(assignment.get(neighbour) != color for neighbour in graph[node]):\n                assignment[node] = color\n                result = backtrack()\n                if result is not None:\n                    return result\n                del assignment[node]\n        return None\n    return backtrack()",
            all: [["assignment"],["backtrack"],["for color"],["del assignment"],["return"]],
            any: [["all(","not in assignment"],["copy()","dict(assignment)"]]
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
        { q: "Which component defines whether a current state solves the task?", options: ["Transition model","Goal test","Heuristic","Frontier"], answer: 1, explanation: "The goal test is a predicate over a state. It determines successful termination independently of how that state was found." },
        { q: "All step costs are equal and the objective is the fewest actions. Which uninformed strategy is optimal?", options: ["Depth-first search","Greedy best-first","Breadth-first search","Hill climbing"], answer: 2, explanation: "BFS expands by depth and therefore finds a shallowest goal first. Equal costs make shallowest equivalent to cheapest." },
        { q: "What does uniform-cost search use as its queue priority?", options: ["h(n)","Depth only","g(n)","g(n)−h(n)"], answer: 2, explanation: "UCS expands the frontier state with the lowest accumulated path cost g(n)." },
        { q: "When does A* reduce exactly to uniform-cost search?", options: ["h(n)=0 for every n","g(n)=0 for every n","All goals have h(n)=1","The graph is a tree"], answer: 0, explanation: "With a zero heuristic, f(n)=g(n)+0, which is the UCS priority." },
        { q: "Why should A* normally stop when the goal is popped rather than generated?", options: ["Generation is slower","A cheaper frontier path may still reach the goal","Parents do not exist before popping","Heuristics are always negative"], answer: 1, explanation: "A generated goal may not yet have the minimum achievable cost. Under the usual conditions, a safely popped goal has the required minimum priority." },
        { q: "What does alpha–beta pruning change compared with full minimax at the same depth?", options: ["The selected optimal move","The terminal utilities","The number of nodes evaluated","MAX into a chance node"], answer: 2, explanation: "Alpha–beta proves some branches irrelevant, reducing work while preserving the exact minimax result." },
        { q: "Which CSP heuristic chooses the variable with the fewest legal values?", options: ["LCV","MRV","Alpha–beta","Uniform cost"], answer: 1, explanation: "Minimum remaining values exposes constrained variables early, often detecting contradictions sooner." },
        { q: "What does forward checking do after assigning a CSP variable?", options: ["Restarts search","Removes inconsistent values from neighbouring domains","Changes the goal test","Calculates a heuristic path cost"], answer: 1, explanation: "Forward checking propagates the new assignment one step to unassigned neighbours and detects empty domains." },
        { q: "A sound inference procedure guarantees what?", options: ["Every true statement is found","Only entailed conclusions are derived","All probabilities sum to zero","Missing facts are false"], answer: 1, explanation: "Soundness prevents derivation of a conclusion that is not entailed by the knowledge base." },
        { q: "What is required before interpreting a Bayesian-network edge causally?", options: ["A larger font","Additional causal assumptions","Only binary variables","A zero heuristic"], answer: 1, explanation: "A directed probabilistic dependency does not by itself prove causation. Causal use requires assumptions about the data-generating structure and interventions." }
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
        ["How do you formulate a problem for graph search?", "Define a state containing all decision-relevant information, the initial state, legal actions, a transition model, goal predicate and path-cost function. Then state observability, determinism, branching, repeated-state behavior and the guarantee required."],
        ["Compare BFS, DFS and uniform-cost search.", "BFS expands shallowest first and is optimal for equal step costs, but can consume exponential memory. DFS expands deepest first and uses much less memory, but is neither generally complete nor optimal. UCS expands lowest accumulated cost and is complete and optimal under positive-cost conditions."],
        ["What makes a heuristic admissible and consistent?", "Admissibility means h(n) never exceeds the true optimal remaining cost. Consistency means h(n) is at most an edge cost plus the successor heuristic. Consistency implies admissibility when the goal heuristic is zero and makes f-values non-decreasing along paths."],
        ["Explain a production-quality A* implementation.", "Use a min-heap of f, tie-break, g and state; a best_g map; and a parent map. Push a fresh entry after every strict relaxation, skip stale pops, stop when the goal is safely popped under the stated assumptions, and reconstruct by following parents."],
        ["Why can greedy best-first search return a poor route?", "Greedy search uses only h(n) and ignores cost already paid. A node may look close to the goal while lying behind an expensive route or heuristic trap, so greedy search has no general optimality guarantee."],
        ["How does alpha–beta pruning preserve the minimax answer?", "Alpha records the best guaranteed value already available to MAX and beta the best guaranteed value available to MIN. When alpha is at least beta, remaining siblings cannot affect an ancestor’s choice, so they can be skipped without changing the backed-up root value."],
        ["Why does move ordering matter in alpha–beta search?", "Good moves tighten alpha or beta early, creating earlier cutoffs. It changes the number of evaluated nodes but not the final minimax value for the same tree, depth and evaluation function."],
        ["How would you improve a slow CSP backtracker?", "Use MRV to choose a constrained variable, degree to break ties, LCV to preserve neighbour flexibility, forward checking or arc consistency for propagation, and global constraints or decomposition to exploit structure."],
        ["Differentiate forward and backward chaining.", "Forward chaining is data-driven: start from facts and fire applicable rules until saturation or the query appears. Backward chaining is goal-driven: start from the query and recursively prove premises of rules that could establish it."],
        ["What are soundness and completeness in logical inference?", "Soundness means every derived statement is entailed by the knowledge base. Completeness means every entailed statement expressible in the target logic can in principle be derived by the procedure."],
        ["What conditional independencies does a Bayesian network encode?", "Under the local Markov property, each variable is conditionally independent of its non-descendants given its parents. D-separation provides a graphical test for broader conditional independencies."],
        ["How do classical search and modern machine learning complement each other?", "Learning can estimate heuristics, evaluation functions, transition outcomes or candidate rankings, while search enforces explicit actions, constraints and long-horizon objectives. A reliable hybrid keeps the search state and guarantees observable and validates learned estimates against task outcomes."]
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
        initSearchLab();
        initGameLab();
        initTracer();
        initProblems();
        initQuiz();
        initInterviews();
    }

    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
    else init();

}());
