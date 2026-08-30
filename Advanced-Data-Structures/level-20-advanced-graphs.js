(function () {
    "use strict";

    const SVG_NS = "http://www.w3.org/2000/svg";
    const INF = 1000000000;

    document.querySelectorAll("[data-toggle-target]").forEach(function (button) {
        const target = document.getElementById(button.dataset.toggleTarget);

        if (!target) {
            return;
        }

        target.hidden = true;
        button.dataset.originalLabel = button.textContent.trim();
        button.setAttribute("aria-expanded", "false");
        button.setAttribute("aria-controls", target.id);
    });

    document.addEventListener("click", function (event) {
        const button = event.target.closest
            ? event.target.closest("[data-toggle-target]")
            : null;

        if (!button) {
            return;
        }

        const target = document.getElementById(
            button.dataset.toggleTarget
        );

        if (!target) {
            return;
        }

        const open = target.hidden;

        target.hidden = !open;
        button.setAttribute("aria-expanded", String(open));

        button.textContent = open
            ? (
                target.classList.contains("ads-hint-box")
                    ? "Hide Hint"
                    : "Hide Answer"
            )
            : button.dataset.originalLabel;
    });

    const definitions = {
        prim: {
            label: "Prim MST",
            codeKey: "prim",
            directed: false
        },
        kruskal: {
            label: "Kruskal MST",
            codeKey: "kruskal",
            directed: false
        },
        dijkstra: {
            label: "Dijkstra",
            codeKey: "dijkstra",
            directed: false
        },
        bellman: {
            label: "Bellman–Ford",
            codeKey: "bellman",
            directed: true
        },
        floyd: {
            label: "Floyd–Warshall",
            codeKey: "floyd",
            directed: true
        },
        topological: {
            label: "Kahn Topological Sort",
            codeKey: "topological",
            directed: true
        },
        kosaraju: {
            label: "Kosaraju SCC",
            codeKey: "kosaraju",
            directed: true
        },
        "edmonds-karp": {
            label: "Edmonds–Karp Max Flow",
            codeKey: "edmonds-karp",
            directed: true
        }
    };

    const examples = {
        prim:
            "A-B:4, A-C:2, B-C:1, B-D:5, C-D:8, " +
            "C-E:10, D-E:2, D-F:6, E-F:3",

        kruskal:
            "A-B:4, A-C:2, B-C:1, B-D:5, C-D:8, " +
            "C-E:10, D-E:2, D-F:6, E-F:3",

        dijkstra:
            "A-B:4, A-C:2, B-C:1, B-D:5, C-D:8, " +
            "C-E:10, D-E:2, D-F:6, E-F:3",

        bellman:
            "A-B:4, A-C:2, B-C:-1, B-D:5, C-D:8, " +
            "C-E:10, D-E:2, D-F:6, E-F:3",

        floyd:
            "A-B:3, A-D:7, B-A:8, B-C:2, C-A:5, " +
            "C-D:1, D-A:2, D-E:4, E-C:1",

        topological:
            "A-D:1, B-D:1, B-E:1, C-E:1, " +
            "D-F:1, E-F:1",

        kosaraju:
            "A-B:1, B-C:1, C-A:1, C-D:1, " +
            "D-E:1, E-D:1, E-F:1",

        "edmonds-karp":
            "A-B:16, A-C:13, B-C:10, C-B:4, " +
            "B-D:12, D-C:9, C-E:14, E-D:7, " +
            "D-F:20, E-F:4"
    };

    function edgeId(from, to, index) {
        return from + "-" + to + "-" + index;
    }

    function parseVertex(input) {
        const value = input.value.trim().toUpperCase();

        if (!/^[A-H]$/.test(value)) {
            throw new Error(
                "Source and sink must be one letter from A to H."
            );
        }

        input.value = value;

        return value;
    }

    function parseGraph(
        edgeInput,
        sourceInput,
        sinkInput,
        algorithm
    ) {
        const definition = definitions[algorithm];
        const source = parseVertex(sourceInput);
        const sink = parseVertex(sinkInput);

        const parts = edgeInput.value
            .trim()
            .split(/\s*,\s*/)
            .filter(Boolean);

        if (parts.length < 2 || parts.length > 20) {
            throw new Error(
                "Enter 2 to 20 edges in U-V:weight format."
            );
        }

        const vertices = new Set();
        const duplicate = new Set();

        const edges = parts.map(function (part, index) {
            const match = part.match(
                /^([A-Ha-h])-([A-Ha-h]):(-?\d+)$/
            );

            if (!match) {
                throw new Error(
                    "Every edge must use U-V:weight format, " +
                    "for example A-B:4."
                );
            }

            const from = match[1].toUpperCase();
            const to = match[2].toUpperCase();
            const weight = Number(match[3]);

            if (from === to) {
                throw new Error(
                    "Self-loops are not used in this visualizer."
                );
            }

            if (
                !Number.isSafeInteger(weight) ||
                Math.abs(weight) > 999
            ) {
                throw new Error(
                    "Edge weights must be integers from -999 to 999."
                );
            }

            if (
                [
                    "prim",
                    "kruskal",
                    "dijkstra",
                    "edmonds-karp"
                ].indexOf(algorithm) !== -1 &&
                weight < 0
            ) {
                throw new Error(
                    definition.label +
                    " requires nonnegative edge weights."
                );
            }

            if (
                algorithm === "edmonds-karp" &&
                weight === 0
            ) {
                throw new Error(
                    "Flow capacities must be positive."
                );
            }

            const key = definition.directed
                ? from + ">" + to
                : [from, to].sort().join("-");

            if (duplicate.has(key)) {
                throw new Error(
                    "Do not enter duplicate edges."
                );
            }

            duplicate.add(key);
            vertices.add(from);
            vertices.add(to);

            return {
                id: edgeId(from, to, index),
                from: from,
                to: to,
                weight: weight
            };
        });

        const nodes = Array.from(vertices).sort();

        if (nodes.length < 2 || nodes.length > 8) {
            throw new Error(
                "Use a graph containing 2 to 8 vertices " +
                "named A through H."
            );
        }

        if (
            nodes.indexOf(source) === -1 ||
            nodes.indexOf(sink) === -1
        ) {
            throw new Error(
                "Source and sink must occur in the graph."
            );
        }

        edgeInput.value = edges.map(function (edge) {
            return (
                edge.from +
                "-" +
                edge.to +
                ":" +
                edge.weight
            );
        }).join(", ");

        return {
            nodes: nodes,
            edges: edges,
            source: source,
            sink: sink,
            directed: definition.directed
        };
    }

    function cloneObject(object) {
        return Object.assign({}, object || {});
    }

    function cloneMatrix(matrix) {
        return matrix
            ? matrix.map(function (row) {
                return row.slice();
            })
            : null;
    }

    function makeStep(
        graph,
        phase,
        message,
        needle,
        data
    ) {
        const details = data || {};

        return {
            graph: graph,
            phase: phase,
            message: message,
            needle: needle,
            activeNodes:
                (details.activeNodes || []).slice(),
            activeEdge:
                details.activeEdge || null,
            selectedEdges:
                (details.selectedEdges || []).slice(),
            rejectedEdges:
                (details.rejectedEdges || []).slice(),
            settledNodes:
                (details.settledNodes || []).slice(),
            frontier:
                (details.frontier || []).slice(),
            current:
                details.current || "—",
            cost:
                typeof details.cost === "number"
                    ? details.cost
                    : 0,
            result:
                details.result || "—",
            values:
                cloneObject(details.values),
            matrix:
                cloneMatrix(details.matrix),
            flows:
                cloneObject(details.flows),
            complete:
                Boolean(details.complete)
        };
    }

    function adjacency(graph, undirected) {
        const list = {};

        graph.nodes.forEach(function (node) {
            list[node] = [];
        });

        graph.edges.forEach(function (edge) {
            list[edge.from].push({
                to: edge.to,
                edge: edge,
                weight: edge.weight
            });

            if (undirected) {
                list[edge.to].push({
                    to: edge.from,
                    edge: edge,
                    weight: edge.weight
                });
            }
        });

        return list;
    }

    function displayValue(value) {
        return value >= INF / 2
            ? "∞"
            : String(value);
    }

    function valueMap(nodes, values) {
        const result = {};

        nodes.forEach(function (node) {
            result[node] = displayValue(values[node]);
        });

        return result;
    }

    function buildPrim(graph) {
        const steps = [];
        const list = adjacency(graph, true);
        const key = {};
        const parent = {};
        const used = {};
        const selectedEdges = [];

        let total = 0;

        graph.nodes.forEach(function (node) {
            key[node] = INF;
            parent[node] = null;
            used[node] = false;
        });

        key[graph.source] = 0;

        steps.push(makeStep(
            graph,
            "Initialize",
            "Set every key to infinity and source " +
                graph.source + " to 0.",
            "/* prim initialize */",
            {
                values: valueMap(graph.nodes, key),
                current: graph.source
            }
        ));

        for (
            let count = 0;
            count < graph.nodes.length;
            count += 1
        ) {
            steps.push(makeStep(
                graph,
                "Main Loop",
                "Begin MST iteration " + (count + 1) + ".",
                "/* prim main loop */",
                {
                    selectedEdges: selectedEdges,
                    settledNodes:
                        Object.keys(used).filter(
                            function (node) {
                                return used[node];
                            }
                        ),
                    values: valueMap(graph.nodes, key),
                    cost: total
                }
            ));

            let best = INF;
            let chosen = null;

            graph.nodes.forEach(function (node) {
                steps.push(makeStep(
                    graph,
                    "Select Scan",
                    "Inspect " + node +
                        ": key = " +
                        displayValue(key[node]) + ".",
                    "/* prim select loop */",
                    {
                        activeNodes: [node],
                        selectedEdges: selectedEdges,
                        settledNodes:
                            Object.keys(used).filter(
                                function (name) {
                                    return used[name];
                                }
                            ),
                        values: valueMap(graph.nodes, key),
                        current: node,
                        cost: total
                    }
                ));

                if (
                    !used[node] &&
                    key[node] < best
                ) {
                    best = key[node];
                    chosen = node;

                    steps.push(makeStep(
                        graph,
                        "New Minimum",
                        node +
                            " is the best unused vertex so far.",
                        "/* prim select compare */",
                        {
                            activeNodes: [node],
                            selectedEdges: selectedEdges,
                            values:
                                valueMap(graph.nodes, key),
                            current: node,
                            cost: total
                        }
                    ));
                }
            });

            if (chosen === null) {
                break;
            }

            steps.push(makeStep(
                graph,
                "Choose Vertex",
                "Choose " + chosen +
                    " with key " + best + ".",
                "/* prim choose */",
                {
                    activeNodes: [chosen],
                    selectedEdges: selectedEdges,
                    values: valueMap(graph.nodes, key),
                    current: chosen,
                    cost: total
                }
            ));

            used[chosen] = true;

            if (parent[chosen]) {
                const chosenEdge =
                    list[chosen].find(function (item) {
                        return item.to === parent[chosen];
                    }).edge;

                selectedEdges.push(chosenEdge.id);
                total += chosenEdge.weight;
            }

            steps.push(makeStep(
                graph,
                "Add Vertex",
                "Add " + chosen +
                    " and its cheapest connecting edge " +
                    "to the MST.",
                "/* prim add vertex */",
                {
                    activeNodes: [chosen],
                    selectedEdges: selectedEdges,
                    settledNodes:
                        Object.keys(used).filter(
                            function (node) {
                                return used[node];
                            }
                        ),
                    values: valueMap(graph.nodes, key),
                    current: chosen,
                    cost: total
                }
            ));

            list[chosen].forEach(function (item) {
                steps.push(makeStep(
                    graph,
                    "Inspect Edge",
                    "Inspect edge " + chosen +
                        "–" + item.to +
                        " with weight " +
                        item.weight + ".",
                    "/* prim edge loop */",
                    {
                        activeNodes: [chosen, item.to],
                        activeEdge: item.edge.id,
                        selectedEdges: selectedEdges,
                        values: valueMap(graph.nodes, key),
                        current:
                            chosen + "–" + item.to,
                        cost: total
                    }
                ));

                steps.push(makeStep(
                    graph,
                    "Compare Key",
                    used[item.to]
                        ? item.to +
                            " is already in the MST."
                        : "Compare edge weight " +
                            item.weight +
                            " with key[" +
                            item.to +
                            "] = " +
                            displayValue(key[item.to]) +
                            ".",
                    "/* prim relax compare */",
                    {
                        activeNodes: [chosen, item.to],
                        activeEdge: item.edge.id,
                        selectedEdges: selectedEdges,
                        values: valueMap(graph.nodes, key),
                        current: item.to,
                        cost: total
                    }
                ));

                if (
                    !used[item.to] &&
                    item.weight < key[item.to]
                ) {
                    key[item.to] = item.weight;
                    parent[item.to] = chosen;

                    steps.push(makeStep(
                        graph,
                        "Update Key",
                        "Set key[" + item.to +
                            "] = " + item.weight +
                            " and parent = " +
                            chosen + ".",
                        "/* prim relax update */",
                        {
                            activeNodes:
                                [chosen, item.to],
                            activeEdge: item.edge.id,
                            selectedEdges:
                                selectedEdges,
                            values:
                                valueMap(
                                    graph.nodes,
                                    key
                                ),
                            current: item.to,
                            cost: total
                        }
                    ));
                }
            });
        }

        const connected =
            selectedEdges.length ===
            graph.nodes.length - 1;

        steps.push(makeStep(
            graph,
            "Complete",
            connected
                ? "The minimum spanning tree is complete."
                : "The graph is disconnected; only a " +
                    "spanning forest exists.",
            "/* prim output */",
            {
                selectedEdges: selectedEdges,
                settledNodes: graph.nodes,
                values: valueMap(graph.nodes, key),
                cost: total,
                result: connected
                    ? "MST cost = " + total
                    : "Disconnected graph",
                complete: true
            }
        ));

        return steps;
    }

    function buildKruskal(graph) {
        const steps = [];
        const parent = {};
        const rank = {};
        const selected = [];
        const rejected = [];

        let total = 0;

        graph.nodes.forEach(function (node) {
            parent[node] = node;
            rank[node] = 0;
        });

        steps.push(makeStep(
            graph,
            "Initialize",
            "Create one disjoint set for every vertex.",
            "/* kruskal initialize */",
            {
                values: parent
            }
        ));

        const sorted = graph.edges
            .slice()
            .sort(function (first, second) {
                return first.weight - second.weight;
            });

        steps.push(makeStep(
            graph,
            "Sort Edges",
            "Sort edges: " +
                sorted.map(function (edge) {
                    return (
                        edge.from +
                        "–" +
                        edge.to +
                        "(" +
                        edge.weight +
                        ")"
                    );
                }).join(", ") +
                ".",
            "/* kruskal sort */",
            {
                values: parent
            }
        ));

        function find(node) {
            if (parent[node] !== node) {
                parent[node] = find(parent[node]);
            }

            return parent[node];
        }

        function unite(first, second) {
            let rootA = find(first);
            let rootB = find(second);

            if (rank[rootA] < rank[rootB]) {
                parent[rootA] = rootB;
            } else if (rank[rootA] > rank[rootB]) {
                parent[rootB] = rootA;
            } else {
                parent[rootB] = rootA;
                rank[rootA] += 1;
            }
        }

        for (
            let index = 0;
            index < sorted.length &&
                selected.length <
                    graph.nodes.length - 1;
            index += 1
        ) {
            const edge = sorted[index];

            steps.push(makeStep(
                graph,
                "Edge Loop",
                "Process sorted edge " +
                    (index + 1) + ".",
                "/* kruskal edge loop */",
                {
                    selectedEdges: selected,
                    rejectedEdges: rejected,
                    activeEdge: edge.id,
                    current:
                        edge.from + "–" + edge.to,
                    cost: total,
                    values: parent
                }
            ));

            steps.push(makeStep(
                graph,
                "Consider Edge",
                "Consider " + edge.from +
                    "–" + edge.to +
                    " with weight " +
                    edge.weight + ".",
                "/* kruskal consider */",
                {
                    activeNodes:
                        [edge.from, edge.to],
                    activeEdge: edge.id,
                    selectedEdges: selected,
                    rejectedEdges: rejected,
                    current:
                        edge.from + "–" + edge.to,
                    cost: total,
                    values: parent
                }
            ));

            const rootA = find(edge.from);
            const rootB = find(edge.to);

            steps.push(makeStep(
                graph,
                "Find Components",
                "Roots are " +
                    rootA + " and " + rootB + ".",
                "/* kruskal find */",
                {
                    activeNodes:
                        [edge.from, edge.to],
                    activeEdge: edge.id,
                    selectedEdges: selected,
                    rejectedEdges: rejected,
                    current:
                        rootA + " / " + rootB,
                    cost: total,
                    values: parent
                }
            ));

            steps.push(makeStep(
                graph,
                "Cycle Check",
                rootA !== rootB
                    ? "Different roots: the edge is safe."
                    : "Same root: accepting this edge " +
                        "would form a cycle.",
                "/* kruskal cycle check */",
                {
                    activeNodes:
                        [edge.from, edge.to],
                    activeEdge: edge.id,
                    selectedEdges: selected,
                    rejectedEdges: rejected,
                    current:
                        edge.from + "–" + edge.to,
                    cost: total,
                    values: parent
                }
            ));

            if (rootA !== rootB) {
                selected.push(edge.id);
                total += edge.weight;
                unite(rootA, rootB);

                steps.push(makeStep(
                    graph,
                    "Accept Edge",
                    "Accept the edge and union " +
                        "its components.",
                    "/* kruskal accept */",
                    {
                        activeNodes:
                            [edge.from, edge.to],
                        activeEdge: edge.id,
                        selectedEdges: selected,
                        rejectedEdges: rejected,
                        current:
                            edge.from + "–" + edge.to,
                        cost: total,
                        values: parent
                    }
                ));
            } else {
                rejected.push(edge.id);
            }
        }

        const connected =
            selected.length ===
            graph.nodes.length - 1;

        steps.push(makeStep(
            graph,
            "Complete",
            connected
                ? "Kruskal produced an MST."
                : "Kruskal produced a spanning forest.",
            "/* kruskal output */",
            {
                selectedEdges: selected,
                rejectedEdges: rejected,
                cost: total,
                values: parent,
                result: connected
                    ? "MST cost = " + total
                    : "Disconnected graph",
                complete: true
            }
        ));

        return steps;
    }

    function buildDijkstra(graph) {
        const steps = [];
        const list = adjacency(graph, true);
        const distance = {};
        const parent = {};
        const done = {};

        graph.nodes.forEach(function (node) {
            distance[node] = INF;
            parent[node] = null;
            done[node] = false;
        });

        distance[graph.source] = 0;

        steps.push(makeStep(
            graph,
            "Initialize",
            "Set source " + graph.source +
                " to 0 and all other distances " +
                "to infinity.",
            "/* dijkstra initialize */",
            {
                values:
                    valueMap(graph.nodes, distance),
                current: graph.source
            }
        ));

        for (
            let count = 0;
            count < graph.nodes.length;
            count += 1
        ) {
            steps.push(makeStep(
                graph,
                "Main Loop",
                "Begin settlement iteration " +
                    (count + 1) + ".",
                "/* dijkstra main loop */",
                {
                    values:
                        valueMap(
                            graph.nodes,
                            distance
                        ),
                    settledNodes:
                        Object.keys(done).filter(
                            function (node) {
                                return done[node];
                            }
                        )
                }
            ));

            let best = INF;
            let chosen = null;

            graph.nodes.forEach(function (node) {
                steps.push(makeStep(
                    graph,
                    "Select Scan",
                    "Inspect unsettled distance of " +
                        node + ".",
                    "/* dijkstra select loop */",
                    {
                        activeNodes: [node],
                        values:
                            valueMap(
                                graph.nodes,
                                distance
                            ),
                        settledNodes:
                            Object.keys(done).filter(
                                function (name) {
                                    return done[name];
                                }
                            ),
                        current: node
                    }
                ));

                if (
                    !done[node] &&
                    distance[node] < best
                ) {
                    best = distance[node];
                    chosen = node;

                    steps.push(makeStep(
                        graph,
                        "New Minimum",
                        node +
                            " has the smallest tentative " +
                            "distance so far.",
                        "/* dijkstra select compare */",
                        {
                            activeNodes: [node],
                            values:
                                valueMap(
                                    graph.nodes,
                                    distance
                                ),
                            current: node
                        }
                    ));
                }
            });

            if (chosen === null) {
                break;
            }

            steps.push(makeStep(
                graph,
                "Choose Vertex",
                "Choose " + chosen +
                    " with distance " + best + ".",
                "/* dijkstra choose */",
                {
                    activeNodes: [chosen],
                    values:
                        valueMap(graph.nodes, distance),
                    current: chosen
                }
            ));

            done[chosen] = true;

            steps.push(makeStep(
                graph,
                "Settle Vertex",
                "Distance to " + chosen +
                    " is now final.",
                "/* dijkstra settle */",
                {
                    activeNodes: [chosen],
                    settledNodes:
                        Object.keys(done).filter(
                            function (node) {
                                return done[node];
                            }
                        ),
                    values:
                        valueMap(graph.nodes, distance),
                    current: chosen
                }
            ));

            list[chosen].forEach(function (item) {
                steps.push(makeStep(
                    graph,
                    "Inspect Edge",
                    "Inspect " + chosen +
                        "–" + item.to + ".",
                    "/* dijkstra edge loop */",
                    {
                        activeNodes:
                            [chosen, item.to],
                        activeEdge: item.edge.id,
                        settledNodes:
                            Object.keys(done).filter(
                                function (node) {
                                    return done[node];
                                }
                            ),
                        values:
                            valueMap(
                                graph.nodes,
                                distance
                            ),
                        current:
                            chosen + "–" + item.to
                    }
                ));

                if (
                    !done[item.to] &&
                    distance[chosen] < INF
                ) {
                    const candidate =
                        distance[chosen] +
                        item.weight;

                    steps.push(makeStep(
                        graph,
                        "Compare Distance",
                        "Candidate " + candidate +
                            " versus distance[" +
                            item.to + "] = " +
                            displayValue(
                                distance[item.to]
                            ) + ".",
                        "/* dijkstra relax compare */",
                        {
                            activeNodes:
                                [chosen, item.to],
                            activeEdge: item.edge.id,
                            values:
                                valueMap(
                                    graph.nodes,
                                    distance
                                ),
                            current: item.to
                        }
                    ));

                    if (
                        candidate <
                        distance[item.to]
                    ) {
                        distance[item.to] =
                            candidate;

                        parent[item.to] = chosen;

                        steps.push(makeStep(
                            graph,
                            "Relax Edge",
                            "Update distance[" +
                                item.to +
                                "] = " +
                                candidate + ".",
                            "/* dijkstra relax update */",
                            {
                                activeNodes:
                                    [chosen, item.to],
                                activeEdge:
                                    item.edge.id,
                                values:
                                    valueMap(
                                        graph.nodes,
                                        distance
                                    ),
                                current: item.to
                            }
                        ));
                    }
                }
            });
        }

        steps.push(makeStep(
            graph,
            "Complete",
            "All reachable shortest distances are final.",
            "/* dijkstra output */",
            {
                settledNodes:
                    Object.keys(done).filter(
                        function (node) {
                            return done[node];
                        }
                    ),
                values:
                    valueMap(graph.nodes, distance),
                result:
                    graph.nodes.map(function (node) {
                        return (
                            node +
                            "=" +
                            displayValue(
                                distance[node]
                            )
                        );
                    }).join(", "),
                complete: true
            }
        ));

        return steps;
    }

    function buildBellman(graph) {
        const steps = [];
        const distance = {};
        const parent = {};

        graph.nodes.forEach(function (node) {
            distance[node] = INF;
            parent[node] = null;
        });

        distance[graph.source] = 0;

        steps.push(makeStep(
            graph,
            "Initialize",
            "Set source " + graph.source + " to 0.",
            "/* bellman initialize */",
            {
                values:
                    valueMap(graph.nodes, distance),
                current: graph.source
            }
        ));

        for (
            let pass = 1;
            pass < graph.nodes.length;
            pass += 1
        ) {
            let changed = false;

            steps.push(makeStep(
                graph,
                "Relaxation Pass",
                "Begin pass " + pass +
                    " of at most " +
                    (graph.nodes.length - 1) + ".",
                "/* bellman pass loop */",
                {
                    values:
                        valueMap(
                            graph.nodes,
                            distance
                        ),
                    current: "Pass " + pass
                }
            ));

            graph.edges.forEach(function (edge) {
                steps.push(makeStep(
                    graph,
                    "Read Edge",
                    "Read directed edge " +
                        edge.from + "→" +
                        edge.to + " (" +
                        edge.weight + ").",
                    "/* bellman read edge */",
                    {
                        activeNodes:
                            [edge.from, edge.to],
                        activeEdge: edge.id,
                        values:
                            valueMap(
                                graph.nodes,
                                distance
                            ),
                        current:
                            edge.from + "→" + edge.to
                    }
                ));

                const candidate =
                    distance[edge.from] >= INF
                        ? INF
                        : distance[edge.from] +
                            edge.weight;

                steps.push(makeStep(
                    graph,
                    "Compare Distance",
                    "Candidate is " +
                        displayValue(candidate) +
                        "; current distance to " +
                        edge.to + " is " +
                        displayValue(
                            distance[edge.to]
                        ) + ".",
                    "/* bellman relax compare */",
                    {
                        activeNodes:
                            [edge.from, edge.to],
                        activeEdge: edge.id,
                        values:
                            valueMap(
                                graph.nodes,
                                distance
                            ),
                        current: edge.to
                    }
                ));

                if (
                    candidate <
                    distance[edge.to]
                ) {
                    distance[edge.to] = candidate;
                    parent[edge.to] = edge.from;
                    changed = true;

                    steps.push(makeStep(
                        graph,
                        "Relax Edge",
                        "Update distance[" +
                            edge.to + "] = " +
                            candidate + ".",
                        "/* bellman relax update */",
                        {
                            activeNodes:
                                [edge.from, edge.to],
                            activeEdge: edge.id,
                            values:
                                valueMap(
                                    graph.nodes,
                                    distance
                                ),
                            current: edge.to
                        }
                    ));
                }
            });

            if (!changed) {
                steps.push(makeStep(
                    graph,
                    "Early Stop",
                    "No distance changed, so later " +
                        "passes cannot improve anything.",
                    "/* bellman early stop */",
                    {
                        values:
                            valueMap(
                                graph.nodes,
                                distance
                            ),
                        current: "Pass " + pass
                    }
                ));

                break;
            }
        }

        let negativeCycle = false;

        graph.edges.forEach(function (edge) {
            steps.push(makeStep(
                graph,
                "Cycle Test",
                "Test " + edge.from +
                    "→" + edge.to +
                    " for one more improvement.",
                "/* bellman cycle loop */",
                {
                    activeNodes:
                        [edge.from, edge.to],
                    activeEdge: edge.id,
                    values:
                        valueMap(
                            graph.nodes,
                            distance
                        ),
                    current:
                        edge.from + "→" + edge.to
                }
            ));

            if (
                distance[edge.from] < INF &&
                distance[edge.from] +
                    edge.weight <
                    distance[edge.to]
            ) {
                negativeCycle = true;

                steps.push(makeStep(
                    graph,
                    "Negative Cycle",
                    "A further improvement proves a " +
                        "reachable negative cycle.",
                    "/* bellman cycle check */",
                    {
                        activeNodes:
                            [edge.from, edge.to],
                        activeEdge: edge.id,
                        values:
                            valueMap(
                                graph.nodes,
                                distance
                            ),
                        result: "Negative cycle"
                    }
                ));
            }
        });

        steps.push(makeStep(
            graph,
            "Complete",
            negativeCycle
                ? "Shortest paths are undefined " +
                    "because of a negative cycle."
                : "Bellman–Ford is complete.",
            "/* bellman output */",
            {
                values:
                    valueMap(graph.nodes, distance),
                result: negativeCycle
                    ? "Negative cycle"
                    : graph.nodes.map(function (node) {
                        return (
                            node +
                            "=" +
                            displayValue(
                                distance[node]
                            )
                        );
                    }).join(", "),
                complete: true
            }
        ));

        return steps;
    }

    function buildFloyd(graph) {
        const steps = [];
        const index = {};
        const size = graph.nodes.length;

        graph.nodes.forEach(function (node, position) {
            index[node] = position;
        });

        const distance = Array.from(
            { length: size },
            function (_, row) {
                return Array.from(
                    { length: size },
                    function (_, column) {
                        return row === column
                            ? 0
                            : INF;
                    }
                );
            }
        );

        graph.edges.forEach(function (edge) {
            const row = index[edge.from];
            const column = index[edge.to];

            distance[row][column] = Math.min(
                distance[row][column],
                edge.weight
            );
        });

        steps.push(makeStep(
            graph,
            "Initialize Matrix",
            "Copy direct edge weights into the " +
                "distance matrix.",
            "/* floyd initialize */",
            {
                matrix: distance,
                current: "Direct edges"
            }
        ));

        for (
            let middle = 0;
            middle < size;
            middle += 1
        ) {
            steps.push(makeStep(
                graph,
                "Intermediate Vertex",
                "Allow " + graph.nodes[middle] +
                    " as an intermediate vertex.",
                "/* floyd k loop */",
                {
                    activeNodes:
                        [graph.nodes[middle]],
                    matrix: distance,
                    current:
                        "k = " + graph.nodes[middle]
                }
            ));

            for (
                let row = 0;
                row < size;
                row += 1
            ) {
                steps.push(makeStep(
                    graph,
                    "Source Row",
                    "Process source row " +
                        graph.nodes[row] + ".",
                    "/* floyd i loop */",
                    {
                        activeNodes: [
                            graph.nodes[row],
                            graph.nodes[middle]
                        ],
                        matrix: distance,
                        current: graph.nodes[row]
                    }
                ));

                for (
                    let column = 0;
                    column < size;
                    column += 1
                ) {
                    if (
                        distance[row][middle] >= INF ||
                        distance[middle][column] >= INF
                    ) {
                        continue;
                    }

                    const through =
                        distance[row][middle] +
                        distance[middle][column];

                    steps.push(makeStep(
                        graph,
                        "Compare Path",
                        "Compare " +
                            graph.nodes[row] +
                            "→" +
                            graph.nodes[column] +
                            " with route through " +
                            graph.nodes[middle] +
                            ": " + through + ".",
                        "/* floyd relax compare */",
                        {
                            activeNodes: [
                                graph.nodes[row],
                                graph.nodes[middle],
                                graph.nodes[column]
                            ],
                            matrix: distance,
                            current:
                                graph.nodes[row] +
                                "→" +
                                graph.nodes[column]
                        }
                    ));

                    if (
                        through <
                        distance[row][column]
                    ) {
                        distance[row][column] =
                            through;

                        steps.push(makeStep(
                            graph,
                            "Update Distance",
                            "Set distance[" +
                                graph.nodes[row] +
                                "][" +
                                graph.nodes[column] +
                                "] = " +
                                through + ".",
                            "/* floyd relax update */",
                            {
                                activeNodes: [
                                    graph.nodes[row],
                                    graph.nodes[middle],
                                    graph.nodes[column]
                                ],
                                matrix: distance,
                                current:
                                    graph.nodes[row] +
                                    "→" +
                                    graph.nodes[column]
                            }
                        ));
                    }
                }
            }
        }

        const negativeCycle =
            distance.some(function (row, rowIndex) {
                return row[rowIndex] < 0;
            });

        steps.push(makeStep(
            graph,
            "Complete",
            negativeCycle
                ? "A negative diagonal entry reveals " +
                    "a negative cycle."
                : "All-pairs shortest paths are complete.",
            "/* floyd output */",
            {
                matrix: distance,
                result: negativeCycle
                    ? "Negative cycle"
                    : "Distance matrix complete",
                complete: true
            }
        ));

        return steps;
    }

    function buildTopological(graph) {
        const steps = [];
        const list = adjacency(graph, false);
        const indegree = {};
        const queue = [];
        const output = [];

        graph.nodes.forEach(function (node) {
            indegree[node] = 0;
        });

        graph.edges.forEach(function (edge) {
            indegree[edge.to] += 1;

            steps.push(makeStep(
                graph,
                "Compute Indegree",
                "Edge " + edge.from +
                    "→" + edge.to +
                    " increases indegree[" +
                    edge.to + "] to " +
                    indegree[edge.to] + ".",
                "/* topo indegree update */",
                {
                    activeNodes:
                        [edge.from, edge.to],
                    activeEdge: edge.id,
                    values: indegree,
                    current: edge.to
                }
            ));
        });

        graph.nodes.forEach(function (node) {
            if (indegree[node] === 0) {
                queue.push(node);

                steps.push(makeStep(
                    graph,
                    "Initial Queue",
                    "Enqueue zero-indegree vertex " +
                        node + ".",
                    "/* topo enqueue initial */",
                    {
                        activeNodes: [node],
                        frontier: queue,
                        values: indegree,
                        current: node
                    }
                ));
            }
        });

        while (queue.length) {
            steps.push(makeStep(
                graph,
                "Queue Loop",
                "The queue contains " +
                    queue.join(", ") + ".",
                "/* topo queue loop */",
                {
                    frontier: queue,
                    values: indegree,
                    current: queue[0]
                }
            ));

            const node = queue.shift();

            output.push(node);

            steps.push(makeStep(
                graph,
                "Dequeue",
                "Remove " + node +
                    " from the queue.",
                "/* topo dequeue */",
                {
                    activeNodes: [node],
                    frontier: queue,
                    values: indegree,
                    current: node
                }
            ));

            steps.push(makeStep(
                graph,
                "Output Vertex",
                "Append " + node +
                    " to the topological order.",
                "/* topo output vertex */",
                {
                    activeNodes: [node],
                    settledNodes: output,
                    frontier: queue,
                    values: indegree,
                    current: node,
                    result: output.join(" → ")
                }
            ));

            list[node].forEach(function (item) {
                steps.push(makeStep(
                    graph,
                    "Outgoing Edge",
                    "Process " + node +
                        "→" + item.to + ".",
                    "/* topo edge loop */",
                    {
                        activeNodes:
                            [node, item.to],
                        activeEdge: item.edge.id,
                        settledNodes: output,
                        frontier: queue,
                        values: indegree,
                        current:
                            node + "→" + item.to
                    }
                ));

                indegree[item.to] -= 1;

                steps.push(makeStep(
                    graph,
                    "Reduce Indegree",
                    "Decrease indegree[" +
                        item.to + "] to " +
                        indegree[item.to] + ".",
                    "/* topo reduce indegree */",
                    {
                        activeNodes:
                            [node, item.to],
                        activeEdge: item.edge.id,
                        settledNodes: output,
                        frontier: queue,
                        values: indegree,
                        current: item.to
                    }
                ));

                if (indegree[item.to] === 0) {
                    queue.push(item.to);

                    steps.push(makeStep(
                        graph,
                        "Enqueue",
                        "Indegree is zero, so enqueue " +
                            item.to + ".",
                        "/* topo enqueue */",
                        {
                            activeNodes: [item.to],
                            settledNodes: output,
                            frontier: queue,
                            values: indegree,
                            current: item.to
                        }
                    ));
                }
            });
        }

        const acyclic =
            output.length === graph.nodes.length;

        steps.push(makeStep(
            graph,
            "Complete",
            acyclic
                ? "A complete topological order was produced."
                : "Some vertices remain, so the graph " +
                    "contains a cycle.",
            "/* topo cycle check */",
            {
                settledNodes: output,
                frontier: queue,
                values: indegree,
                result: acyclic
                    ? output.join(" → ")
                    : "Cycle detected",
                complete: true
            }
        ));

        return steps;
    }

    function buildKosaraju(graph) {
        const steps = [];
        const list = adjacency(graph, false);
        const reversed = {};
        const seen = {};
        const stack = [];
        const components = [];

        graph.nodes.forEach(function (node) {
            reversed[node] = [];
            seen[node] = false;
        });

        graph.edges.forEach(function (edge) {
            reversed[edge.to].push({
                to: edge.from,
                edge: edge
            });
        });

        function firstPass(node) {
            seen[node] = true;

            steps.push(makeStep(
                graph,
                "First DFS Visit",
                "Visit " + node +
                    " in the original graph.",
                "/* kosa first visit */",
                {
                    activeNodes: [node],
                    settledNodes:
                        Object.keys(seen).filter(
                            function (name) {
                                return seen[name];
                            }
                        ),
                    frontier: stack,
                    current: node
                }
            ));

            list[node].forEach(function (item) {
                steps.push(makeStep(
                    graph,
                    "First DFS Edge",
                    "Inspect " + node +
                        "→" + item.to + ".",
                    "/* kosa first edge loop */",
                    {
                        activeNodes:
                            [node, item.to],
                        activeEdge: item.edge.id,
                        frontier: stack,
                        current:
                            node + "→" + item.to
                    }
                ));

                if (!seen[item.to]) {
                    firstPass(item.to);
                }
            });

            stack.push(node);

            steps.push(makeStep(
                graph,
                "Finish Push",
                "Push " + node +
                    " after all outgoing DFS calls finish.",
                "/* kosa finish push */",
                {
                    activeNodes: [node],
                    frontier: stack,
                    current: node
                }
            ));
        }

        graph.nodes.forEach(function (node) {
            if (!seen[node]) {
                steps.push(makeStep(
                    graph,
                    "Start First DFS",
                    "Start a first-pass DFS at " +
                        node + ".",
                    "/* kosa first start */",
                    {
                        activeNodes: [node],
                        frontier: stack,
                        current: node
                    }
                ));

                firstPass(node);
            }
        });

        steps.push(makeStep(
            graph,
            "Transpose",
            "Reverse every directed edge.",
            "/* kosa transpose */",
            {
                frontier: stack,
                current: "Transpose"
            }
        ));

        graph.nodes.forEach(function (node) {
            seen[node] = false;
        });

        function secondPass(node, component) {
            seen[node] = true;
            component.push(node);

            steps.push(makeStep(
                graph,
                "Second DFS Visit",
                "Add " + node +
                    " to the current SCC.",
                "/* kosa second visit */",
                {
                    activeNodes: component,
                    settledNodes:
                        components.reduce(
                            function (all, part) {
                                return all.concat(part);
                            },
                            []
                        ),
                    frontier: stack,
                    current: node,
                    result: component.join(", ")
                }
            ));

            reversed[node].forEach(function (item) {
                steps.push(makeStep(
                    graph,
                    "Transpose Edge",
                    "Inspect transposed edge " +
                        node + "→" + item.to + ".",
                    "/* kosa second edge loop */",
                    {
                        activeNodes:
                            [node, item.to],
                        activeEdge: item.edge.id,
                        frontier: stack,
                        current:
                            node + "→" + item.to
                    }
                ));

                if (!seen[item.to]) {
                    secondPass(
                        item.to,
                        component
                    );
                }
            });
        }

        while (stack.length) {
            steps.push(makeStep(
                graph,
                "Stack Loop",
                "Pop the next finish-time vertex.",
                "/* kosa stack loop */",
                {
                    frontier: stack,
                    current:
                        stack[stack.length - 1]
                }
            ));

            const node = stack.pop();

            steps.push(makeStep(
                graph,
                "Pop Vertex",
                "Pop " + node + ".",
                "/* kosa pop */",
                {
                    activeNodes: [node],
                    frontier: stack,
                    current: node
                }
            ));

            if (!seen[node]) {
                const component = [];

                steps.push(makeStep(
                    graph,
                    "Start Component",
                    "Start a new SCC from " +
                        node + ".",
                    "/* kosa component */",
                    {
                        activeNodes: [node],
                        frontier: stack,
                        current: node
                    }
                ));

                secondPass(node, component);
                components.push(component);
            }
        }

        steps.push(makeStep(
            graph,
            "Complete",
            "Kosaraju found " +
                components.length +
                " strongly connected component(s).",
            "/* kosa component */",
            {
                settledNodes: graph.nodes,
                result:
                    components.map(function (component) {
                        return (
                            "{" +
                            component.join(",") +
                            "}"
                        );
                    }).join(" "),
                complete: true
            }
        ));

        return steps;
    }

    function buildFlow(graph) {
        const steps = [];
        const nodes = graph.nodes;
        const index = {};
        const size = nodes.length;

        nodes.forEach(function (node, position) {
            index[node] = position;
        });

        const residual = Array.from(
            { length: size },
            function () {
                return Array(size).fill(0);
            }
        );

        const flows = {};

        graph.edges.forEach(function (edge) {
            residual[index[edge.from]][index[edge.to]] =
                edge.weight;

            flows[edge.id] = 0;
        });

        steps.push(makeStep(
            graph,
            "Initialize Residual",
            "Copy every capacity into the residual graph.",
            "/* flow initialize */",
            {
                flows: flows,
                current: graph.source,
                cost: 0
            }
        ));

        let maximum = 0;

        while (true) {
            const parent = Array(size).fill(-1);
            const seen = Array(size).fill(false);
            const queue = [index[graph.source]];

            seen[index[graph.source]] = true;

            steps.push(makeStep(
                graph,
                "BFS Initialize",
                "Start residual BFS at " +
                    graph.source + ".",
                "/* flow bfs initialize */",
                {
                    activeNodes: [graph.source],
                    frontier: [graph.source],
                    flows: flows,
                    cost: maximum,
                    current: graph.source
                }
            ));

            while (queue.length) {
                steps.push(makeStep(
                    graph,
                    "BFS Loop",
                    "Residual BFS queue: " +
                        queue.map(function (position) {
                            return nodes[position];
                        }).join(", ") +
                        ".",
                    "/* flow bfs loop */",
                    {
                        frontier:
                            queue.map(
                                function (position) {
                                    return nodes[position];
                                }
                            ),
                        flows: flows,
                        cost: maximum,
                        current: nodes[queue[0]]
                    }
                ));

                const fromIndex = queue.shift();

                steps.push(makeStep(
                    graph,
                    "Dequeue",
                    "Dequeue " +
                        nodes[fromIndex] + ".",
                    "/* flow dequeue */",
                    {
                        activeNodes:
                            [nodes[fromIndex]],
                        frontier:
                            queue.map(
                                function (position) {
                                    return nodes[position];
                                }
                            ),
                        flows: flows,
                        cost: maximum,
                        current: nodes[fromIndex]
                    }
                ));

                for (
                    let toIndex = 0;
                    toIndex < size;
                    toIndex += 1
                ) {
                    if (
                        residual[fromIndex][toIndex] <= 0
                    ) {
                        continue;
                    }

                    const edge =
                        graph.edges.find(
                            function (item) {
                                return (
                                    item.from ===
                                        nodes[fromIndex] &&
                                    item.to ===
                                        nodes[toIndex]
                                );
                            }
                        ) ||
                        graph.edges.find(
                            function (item) {
                                return (
                                    item.from ===
                                        nodes[toIndex] &&
                                    item.to ===
                                        nodes[fromIndex]
                                );
                            }
                        );

                    steps.push(makeStep(
                        graph,
                        "Residual Check",
                        "Residual capacity " +
                            nodes[fromIndex] +
                            "→" +
                            nodes[toIndex] +
                            " = " +
                            residual[fromIndex][toIndex] +
                            ".",
                        "/* flow residual check */",
                        {
                            activeNodes: [
                                nodes[fromIndex],
                                nodes[toIndex]
                            ],
                            activeEdge:
                                edge ? edge.id : null,
                            frontier:
                                queue.map(
                                    function (position) {
                                        return nodes[position];
                                    }
                                ),
                            flows: flows,
                            cost: maximum,
                            current:
                                nodes[fromIndex] +
                                "→" +
                                nodes[toIndex]
                        }
                    ));

                    if (!seen[toIndex]) {
                        seen[toIndex] = true;
                        parent[toIndex] = fromIndex;
                        queue.push(toIndex);

                        steps.push(makeStep(
                            graph,
                            "Enqueue",
                            "Discover and enqueue " +
                                nodes[toIndex] + ".",
                            "/* flow enqueue */",
                            {
                                activeNodes:
                                    [nodes[toIndex]],
                                frontier:
                                    queue.map(
                                        function (position) {
                                            return nodes[position];
                                        }
                                    ),
                                flows: flows,
                                cost: maximum,
                                current: nodes[toIndex]
                            }
                        ));
                    }
                }
            }

            const reachedSink =
                seen[index[graph.sink]];

            steps.push(makeStep(
                graph,
                "BFS Result",
                reachedSink
                    ? "An augmenting path reaches " +
                        graph.sink + "."
                    : "No residual path reaches " +
                        graph.sink + ".",
                "/* flow bfs result */",
                {
                    activeNodes:
                        reachedSink
                            ? [graph.sink]
                            : [],
                    flows: flows,
                    cost: maximum,
                    current: graph.sink
                }
            ));

            if (!reachedSink) {
                break;
            }

            let pathFlow = INF;

            for (
                let vertex = index[graph.sink];
                vertex !== index[graph.source];
                vertex = parent[vertex]
            ) {
                const previous = parent[vertex];

                steps.push(makeStep(
                    graph,
                    "Bottleneck Loop",
                    "Inspect residual capacity on " +
                        nodes[previous] +
                        "→" +
                        nodes[vertex] + ".",
                    "/* flow bottleneck loop */",
                    {
                        activeNodes: [
                            nodes[previous],
                            nodes[vertex]
                        ],
                        flows: flows,
                        cost: maximum,
                        current:
                            nodes[previous] +
                            "→" +
                            nodes[vertex]
                    }
                ));

                pathFlow = Math.min(
                    pathFlow,
                    residual[previous][vertex]
                );

                steps.push(makeStep(
                    graph,
                    "Bottleneck",
                    "Current path bottleneck is " +
                        pathFlow + ".",
                    "/* flow bottleneck */",
                    {
                        activeNodes: [
                            nodes[previous],
                            nodes[vertex]
                        ],
                        flows: flows,
                        cost: maximum,
                        current: String(pathFlow)
                    }
                ));
            }

            for (
                let vertex = index[graph.sink];
                vertex !== index[graph.source];
                vertex = parent[vertex]
            ) {
                const previous = parent[vertex];

                residual[previous][vertex] -=
                    pathFlow;

                residual[vertex][previous] +=
                    pathFlow;

                const forward =
                    graph.edges.find(
                        function (item) {
                            return (
                                item.from ===
                                    nodes[previous] &&
                                item.to ===
                                    nodes[vertex]
                            );
                        }
                    );

                const reverse =
                    graph.edges.find(
                        function (item) {
                            return (
                                item.from ===
                                    nodes[vertex] &&
                                item.to ===
                                    nodes[previous]
                            );
                        }
                    );

                if (forward) {
                    flows[forward.id] =
                        (flows[forward.id] || 0) +
                        pathFlow;
                } else if (reverse) {
                    flows[reverse.id] =
                        (flows[reverse.id] || 0) -
                        pathFlow;
                }

                steps.push(makeStep(
                    graph,
                    "Augment Edge",
                    "Send " + pathFlow +
                        " units through " +
                        nodes[previous] +
                        "→" +
                        nodes[vertex] + ".",
                    "/* flow forward update */",
                    {
                        activeNodes: [
                            nodes[previous],
                            nodes[vertex]
                        ],
                        activeEdge: forward
                            ? forward.id
                            : (
                                reverse
                                    ? reverse.id
                                    : null
                            ),
                        flows: flows,
                        cost: maximum,
                        current:
                            nodes[previous] +
                            "→" +
                            nodes[vertex]
                    }
                ));
            }

            maximum += pathFlow;

            steps.push(makeStep(
                graph,
                "Increase Flow",
                "Increase total flow to " +
                    maximum + ".",
                "/* flow total update */",
                {
                    flows: flows,
                    cost: maximum,
                    current: String(maximum)
                }
            ));
        }

        steps.push(makeStep(
            graph,
            "Complete",
            "No augmenting path remains; " +
                "the flow is maximum.",
            "/* flow output */",
            {
                flows: flows,
                cost: maximum,
                result:
                    "Maximum flow = " + maximum,
                complete: true
            }
        ));

        return steps;
    }

    function buildSteps(graph, algorithm) {
        if (algorithm === "prim") {
            return buildPrim(graph);
        }

        if (algorithm === "kruskal") {
            return buildKruskal(graph);
        }

        if (algorithm === "dijkstra") {
            return buildDijkstra(graph);
        }

        if (algorithm === "bellman") {
            return buildBellman(graph);
        }

        if (algorithm === "floyd") {
            return buildFloyd(graph);
        }

        if (algorithm === "topological") {
            return buildTopological(graph);
        }

        if (algorithm === "kosaraju") {
            return buildKosaraju(graph);
        }

        return buildFlow(graph);
    }

    function svgElement(name, attributes) {
        const element =
            document.createElementNS(
                SVG_NS,
                name
            );

        Object.keys(attributes || {}).forEach(
            function (key) {
                element.setAttribute(
                    key,
                    attributes[key]
                );
            }
        );

        return element;
    }

    function renderGraph(svg, step) {
        svg.innerHTML = "";

        const graph = step.graph;
        const width = 760;
        const height = 430;
        const centerX = width / 2;
        const centerY = height / 2;

        const radiusX = Math.min(
            280,
            85 + graph.nodes.length * 34
        );

        const radiusY = 155;
        const positions = {};

        graph.nodes.forEach(function (node, index) {
            const angle =
                -Math.PI / 2 +
                index *
                2 *
                Math.PI /
                graph.nodes.length;

            positions[node] = {
                x:
                    centerX +
                    Math.cos(angle) * radiusX,
                y:
                    centerY +
                    Math.sin(angle) * radiusY
            };
        });

        const markerId =
            (svg.id || "graph") + "-arrow";

        const definitionsElement =
            svgElement("defs");

        const marker = svgElement("marker", {
            id: markerId,
            viewBox: "0 0 10 10",
            refX: "18",
            refY: "5",
            markerWidth: "7",
            markerHeight: "7",
            orient: "auto-start-reverse"
        });

        marker.appendChild(svgElement("path", {
            d: "M 0 0 L 10 5 L 0 10 z",
            class: "graph-arrow-head"
        }));

        definitionsElement.appendChild(marker);
        svg.appendChild(definitionsElement);

        graph.edges.forEach(function (edge) {
            const from = positions[edge.from];
            const to = positions[edge.to];

            const selected =
                step.selectedEdges.indexOf(
                    edge.id
                ) !== -1;

            const rejected =
                step.rejectedEdges.indexOf(
                    edge.id
                ) !== -1;

            const active =
                step.activeEdge === edge.id;

            const line = svgElement("line", {
                x1: from.x,
                y1: from.y,
                x2: to.x,
                y2: to.y,
                class:
                    "graph-edge" +
                    (
                        selected
                            ? " is-selected"
                            : ""
                    ) +
                    (
                        rejected
                            ? " is-rejected"
                            : ""
                    ) +
                    (
                        active
                            ? " is-active"
                            : ""
                    )
            });

            if (graph.directed) {
                line.setAttribute(
                    "marker-end",
                    "url(#" + markerId + ")"
                );
            }

            svg.appendChild(line);

            const label = svgElement("text", {
                x: (from.x + to.x) / 2,
                y: (from.y + to.y) / 2 - 8,
                class: "graph-edge-label"
            });

            label.textContent =
                Object.prototype.hasOwnProperty.call(
                    step.flows,
                    edge.id
                )
                    ? (
                        step.flows[edge.id] +
                        "/" +
                        edge.weight
                    )
                    : String(edge.weight);

            svg.appendChild(label);
        });

        graph.nodes.forEach(function (node) {
            const position = positions[node];

            const group = svgElement("g", {
                class:
                    "graph-node" +
                    (
                        step.settledNodes.indexOf(
                            node
                        ) !== -1
                            ? " is-settled"
                            : ""
                    ) +
                    (
                        step.frontier.indexOf(
                            node
                        ) !== -1
                            ? " is-frontier"
                            : ""
                    ) +
                    (
                        step.activeNodes.indexOf(
                            node
                        ) !== -1
                            ? " is-active"
                            : ""
                    )
            });

            group.appendChild(svgElement("circle", {
                cx: position.x,
                cy: position.y,
                r: "27"
            }));

            const text = svgElement("text", {
                x: position.x,
                y: position.y + 6,
                class: "graph-node-label"
            });

            text.textContent = node;

            group.appendChild(text);
            svg.appendChild(group);
        });

        svg.setAttribute(
            "viewBox",
            "0 0 " + width + " " + height
        );
    }

    function renderStateTable(container, step) {
        container.innerHTML = "";

        if (step.matrix) {
            const table =
                document.createElement("table");

            const body =
                document.createElement("tbody");

            const header =
                document.createElement("tr");

            header.appendChild(
                document.createElement("th")
            );

            step.graph.nodes.forEach(function (node) {
                const cell =
                    document.createElement("th");

                cell.textContent = node;
                header.appendChild(cell);
            });

            body.appendChild(header);

            step.matrix.forEach(function (row, index) {
                const tableRow =
                    document.createElement("tr");

                const rowHeading =
                    document.createElement("th");

                rowHeading.textContent =
                    step.graph.nodes[index];

                tableRow.appendChild(rowHeading);

                row.forEach(function (value) {
                    const cell =
                        document.createElement("td");

                    cell.textContent =
                        displayValue(value);

                    tableRow.appendChild(cell);
                });

                body.appendChild(tableRow);
            });

            table.appendChild(body);
            container.appendChild(table);

            return;
        }

        const keys =
            Object.keys(step.values || {});

        if (!keys.length) {
            return;
        }

        const grid =
            document.createElement("div");

        grid.className = "graph-value-grid";

        keys.forEach(function (key) {
            const card =
                document.createElement("div");

            const name =
                document.createElement("span");

            const value =
                document.createElement("strong");

            name.textContent = key;
            value.textContent =
                String(step.values[key]);

            card.appendChild(name);
            card.appendChild(value);
            grid.appendChild(card);
        });

        container.appendChild(grid);
    }

    const visualizer = {
        edges:
            document.getElementById("graphEdges"),
        source:
            document.getElementById("graphSource"),
        sink:
            document.getElementById("graphSink"),
        algorithm:
            document.getElementById("graphAlgorithm"),
        load:
            document.getElementById(
                "loadGraphVisualizer"
            ),
        prompt:
            document.getElementById("graphPrompt"),
        result:
            document.getElementById("graphResult"),
        svg:
            document.getElementById("graphSvg"),
        message:
            document.getElementById("graphMessage"),
        progress:
            document.getElementById("graphProgress"),
        algorithmValue:
            document.getElementById(
                "graphAlgorithmValue"
            ),
        phase:
            document.getElementById("graphPhase"),
        current:
            document.getElementById("graphCurrent"),
        frontier:
            document.getElementById("graphFrontier"),
        cost:
            document.getElementById("graphCost"),
        resultValue:
            document.getElementById(
                "graphResultValue"
            ),
        table:
            document.getElementById("graphTable"),
        previous:
            document.getElementById("graphPrevious"),
        next:
            document.getElementById("graphNext"),
        auto:
            document.getElementById("graphAuto"),
        pause:
            document.getElementById("graphPause"),
        reset:
            document.getElementById("graphReset"),
        status:
            document.getElementById("graphStatus")
    };

    let visualSteps = [];
    let visualIndex = 0;
    let visualTimer = null;

    function stopVisual() {
        if (visualTimer !== null) {
            window.clearInterval(visualTimer);
            visualTimer = null;
        }
    }

    function invalidateVisual() {
        stopVisual();
        visualSteps = [];

        if (visualizer.result) {
            visualizer.result.hidden = true;
            visualizer.prompt.hidden = false;
        }
    }

    function renderVisual() {
        if (!visualSteps.length) {
            return;
        }

        const step = visualSteps[visualIndex];

        renderGraph(visualizer.svg, step);
        renderStateTable(visualizer.table, step);

        visualizer.message.textContent =
            step.message;

        visualizer.algorithmValue.textContent =
            definitions[
                visualizer.algorithm.value
            ].label;

        visualizer.phase.textContent =
            step.phase;

        visualizer.current.textContent =
            step.current;

        visualizer.frontier.textContent =
            step.frontier.length
                ? step.frontier.join(", ")
                : "—";

        visualizer.cost.textContent =
            String(step.cost);

        visualizer.resultValue.textContent =
            step.result;

        visualizer.progress.style.width =
            (
                visualIndex /
                Math.max(
                    1,
                    visualSteps.length - 1
                ) *
                100
            ) + "%";

        visualizer.previous.disabled =
            visualIndex === 0;

        visualizer.next.disabled =
            visualIndex ===
            visualSteps.length - 1;

        visualizer.status.textContent =
            "Step " +
            visualIndex +
            " of " +
            (visualSteps.length - 1);
    }

    function loadVisual() {
        try {
            const graph = parseGraph(
                visualizer.edges,
                visualizer.source,
                visualizer.sink,
                visualizer.algorithm.value
            );

            visualSteps = buildSteps(
                graph,
                visualizer.algorithm.value
            );
        } catch (error) {
            window.alert(error.message);
            return;
        }

        stopVisual();

        visualIndex = 0;
        visualizer.prompt.hidden = true;
        visualizer.result.hidden = false;

        renderVisual();
    }

    function setExample(algorithm, controls) {
        controls.algorithm.value = algorithm;
        controls.edges.value = examples[algorithm];
        controls.source.value = "A";

        controls.sink.value =
            algorithm === "floyd"
                ? "E"
                : "F";
    }

    if (visualizer.load) {
        visualizer.load.addEventListener(
            "click",
            loadVisual
        );

        [
            visualizer.edges,
            visualizer.source,
            visualizer.sink
        ].forEach(function (control) {
            control.addEventListener(
                "input",
                invalidateVisual
            );
        });

        visualizer.algorithm.addEventListener(
            "change",
            function () {
                setExample(
                    visualizer.algorithm.value,
                    visualizer
                );

                invalidateVisual();
            }
        );

        document
            .querySelectorAll("[data-graph-example]")
            .forEach(function (button) {
                button.addEventListener(
                    "click",
                    function () {
                        setExample(
                            button.dataset.graphExample,
                            visualizer
                        );

                        invalidateVisual();
                    }
                );
            });

        visualizer.previous.addEventListener(
            "click",
            function () {
                stopVisual();

                visualIndex = Math.max(
                    0,
                    visualIndex - 1
                );

                renderVisual();
            }
        );

        visualizer.next.addEventListener(
            "click",
            function () {
                stopVisual();

                visualIndex = Math.min(
                    visualSteps.length - 1,
                    visualIndex + 1
                );

                renderVisual();
            }
        );

        visualizer.auto.addEventListener(
            "click",
            function () {
                stopVisual();

                if (
                    visualIndex ===
                    visualSteps.length - 1
                ) {
                    visualIndex = 0;
                    renderVisual();
                }

                visualTimer = window.setInterval(
                    function () {
                        if (
                            visualIndex >=
                            visualSteps.length - 1
                        ) {
                            stopVisual();
                            return;
                        }

                        visualIndex += 1;
                        renderVisual();
                    },
                    760
                );
            }
        );

        visualizer.pause.addEventListener(
            "click",
            stopVisual
        );

        visualizer.reset.addEventListener(
            "click",
            function () {
                stopVisual();
                visualIndex = 0;
                renderVisual();
            }
        );
    }

    const tracer = {
        edges:
            document.getElementById(
                "graphTraceEdges"
            ),
        source:
            document.getElementById(
                "graphTraceSource"
            ),
        sink:
            document.getElementById(
                "graphTraceSink"
            ),
        algorithm:
            document.getElementById(
                "graphTraceAlgorithm"
            ),
        load:
            document.getElementById(
                "loadGraphTracer"
            ),
        prompt:
            document.getElementById(
                "graphTracePrompt"
            ),
        result:
            document.getElementById(
                "graphTraceResult"
            ),
        title:
            document.getElementById(
                "graphTraceTitle"
            ),
        codeWindow:
            document.getElementById(
                "graphTraceCodeWindow"
            ),
        code:
            document.getElementById(
                "graphTraceCode"
            ),
        message:
            document.getElementById(
                "graphTraceMessage"
            ),
        variables:
            document.getElementById(
                "graphTraceVariables"
            ),
        svg:
            document.getElementById(
                "graphTraceSvg"
            ),
        table:
            document.getElementById(
                "graphTraceTable"
            ),
        output:
            document.getElementById(
                "graphTraceOutput"
            ),
        previous:
            document.getElementById(
                "graphTracePrevious"
            ),
        next:
            document.getElementById(
                "graphTraceNext"
            ),
        auto:
            document.getElementById(
                "graphTraceAuto"
            ),
        pause:
            document.getElementById(
                "graphTracePause"
            ),
        reset:
            document.getElementById(
                "graphTraceReset"
            ),
        status:
            document.getElementById(
                "graphTraceStatus"
            )
    };

    let traceSteps = [];
    let traceIndex = 0;
    let traceTimer = null;
    let traceLookupLines = [];
    let traceVisibleLines = [];
    let traceScrollFrame = null;
    let activeDefinition = null;

    function stopTrace() {
        if (traceTimer !== null) {
            window.clearInterval(traceTimer);
            traceTimer = null;
        }
    }

    function invalidateTrace() {
        stopTrace();
        traceSteps = [];

        if (tracer.result) {
            tracer.result.hidden = true;
            tracer.prompt.hidden = false;
        }
    }

    function loadCode(definition) {
        const source = document.querySelector(
            '[data-c-program="' +
            definition.codeKey +
            '"]'
        );

        if (!source) {
            throw new Error(
                "The selected C program could not be found."
            );
        }

        const text = source.textContent
            .replace(/\r/g, "")
            .replace(/^\n+|\n+$/g, "");

        traceLookupLines = text.split("\n");

        traceVisibleLines =
            traceLookupLines.map(function (line) {
                return line
                    .replace(
                        /\s*\/\*\s*(?:prim|kruskal|dijkstra|bellman|floyd|topo|kosa|flow)[^*]*\*\//g,
                        ""
                    )
                    .replace(/\s+$/g, "");
            });

        tracer.code.innerHTML = "";

        traceVisibleLines.forEach(
            function (line, index) {
                const row =
                    document.createElement("span");

                row.dataset.graphTraceLine =
                    String(index + 1);

                row.textContent =
                    String(index + 1).padStart(
                        3,
                        "0"
                    ) +
                    " │ " +
                    (line || " ");

                tracer.code.appendChild(row);
            }
        );

        tracer.codeWindow.style.scrollBehavior =
            "auto";

        tracer.codeWindow.scrollTop = 0;
    }

    function countCharacter(text, character) {
        return Array.from(text).reduce(
            function (count, current) {
                return (
                    count +
                    (
                        current === character
                            ? 1
                            : 0
                    )
                );
            },
            0
        );
    }

    function statementStart(lineIndex) {
        let balance = 0;

        for (
            let index = lineIndex;
            index >= 0;
            index -= 1
        ) {
            const line =
                traceVisibleLines[index].trim();

            if (!line) {
                continue;
            }

            balance +=
                countCharacter(line, ")") -
                countCharacter(line, "(");

            if (balance <= 0) {
                return index + 1;
            }
        }

        return lineIndex + 1;
    }

    function findLine(needle) {
        for (
            let index = 0;
            index < traceLookupLines.length;
            index += 1
        ) {
            if (
                traceLookupLines[index]
                    .indexOf(needle) === -1
            ) {
                continue;
            }

            let executable = index;

            while (
                executable >= 0 &&
                !traceVisibleLines[
                    executable
                ].trim()
            ) {
                executable -= 1;
            }

            if (executable >= 0) {
                return statementStart(executable);
            }

            executable = index + 1;

            while (
                executable <
                    traceVisibleLines.length &&
                !traceVisibleLines[
                    executable
                ].trim()
            ) {
                executable += 1;
            }

            return executable <
                traceVisibleLines.length
                ? statementStart(executable)
                : -1;
        }

        return -1;
    }

    function decorate(steps) {
        let previous = 1;

        return steps.map(function (step) {
            const line = findLine(step.needle);

            if (line > 0) {
                previous = line;
            }

            return Object.assign({}, step, {
                line:
                    line > 0
                        ? line
                        : previous
            });
        });
    }

    function appendVariable(label, value) {
        const card =
            document.createElement("div");

        const name =
            document.createElement("span");

        const data =
            document.createElement("strong");

        name.textContent = label;
        data.textContent = String(value);

        card.appendChild(name);
        card.appendChild(data);
        tracer.variables.appendChild(card);
    }

    function positionTraceLine(activeLine) {
        const codeWindow = tracer.codeWindow;

        function move() {
            if (
                !activeLine ||
                activeLine.isConnected === false
            ) {
                return;
            }

            const windowRectangle =
                codeWindow.getBoundingClientRect();

            const lineRectangle =
                activeLine.getBoundingClientRect();

            const lineHeight =
                lineRectangle.height ||
                activeLine.offsetHeight;

            const maximum = Math.max(
                0,
                codeWindow.scrollHeight -
                codeWindow.clientHeight
            );

            const target =
                codeWindow.scrollTop +
                lineRectangle.top -
                windowRectangle.top -
                (
                    codeWindow.clientHeight -
                    lineHeight
                ) / 2;

            codeWindow.style.scrollBehavior =
                "auto";

            codeWindow.scrollTop = Math.max(
                0,
                Math.min(maximum, target)
            );
        }

        if (
            traceScrollFrame !== null &&
            typeof window.cancelAnimationFrame ===
                "function"
        ) {
            window.cancelAnimationFrame(
                traceScrollFrame
            );
        }

        move();

        if (
            typeof window.requestAnimationFrame ===
                "function"
        ) {
            traceScrollFrame =
                window.requestAnimationFrame(
                    function () {
                        traceScrollFrame = null;
                        move();
                    }
                );
        }
    }

    function renderTrace() {
        if (!traceSteps.length) {
            return;
        }

        const step = traceSteps[traceIndex];
        let activeLine = null;

        tracer.code
            .querySelectorAll(
                "[data-graph-trace-line]"
            )
            .forEach(function (line) {
                const active =
                    Number(
                        line.dataset.graphTraceLine
                    ) === step.line;

                line.classList.toggle(
                    "is-active-line",
                    active
                );

                if (active) {
                    activeLine = line;
                }
            });

        tracer.message.textContent =
            step.message;

        tracer.variables.innerHTML = "";

        appendVariable(
            "Algorithm",
            activeDefinition.label
        );

        appendVariable(
            "Phase",
            step.phase
        );

        appendVariable(
            "Current",
            step.current
        );

        appendVariable(
            "Frontier",
            step.frontier.length
                ? step.frontier.join(", ")
                : "—"
        );

        appendVariable(
            "Cost / Flow",
            step.cost
        );

        appendVariable(
            "Step Result",
            step.result
        );

        renderGraph(tracer.svg, step);
        renderStateTable(tracer.table, step);

        tracer.output.textContent =
            step.complete
                ? step.result
                : "—";

        tracer.previous.disabled =
            traceIndex === 0;

        tracer.next.disabled =
            traceIndex ===
            traceSteps.length - 1;

        tracer.status.textContent =
            "Step " +
            traceIndex +
            " of " +
            (traceSteps.length - 1);

        if (activeLine) {
            positionTraceLine(activeLine);
        }
    }

    function loadTrace() {
        const definition =
            definitions[tracer.algorithm.value];

        try {
            const graph = parseGraph(
                tracer.edges,
                tracer.source,
                tracer.sink,
                tracer.algorithm.value
            );

            loadCode(definition);

            traceSteps = decorate(
                buildSteps(
                    graph,
                    tracer.algorithm.value
                )
            );
        } catch (error) {
            window.alert(error.message);
            return;
        }

        stopTrace();

        activeDefinition = definition;
        traceIndex = 0;

        tracer.title.textContent =
            "PROGRAM TRACING — " +
            definition.label.toUpperCase();

        tracer.prompt.hidden = true;
        tracer.result.hidden = false;

        renderTrace();
    }

    if (tracer.load) {
        tracer.load.addEventListener(
            "click",
            loadTrace
        );

        [
            tracer.edges,
            tracer.source,
            tracer.sink
        ].forEach(function (control) {
            control.addEventListener(
                "input",
                invalidateTrace
            );
        });

        tracer.algorithm.addEventListener(
            "change",
            function () {
                setExample(
                    tracer.algorithm.value,
                    tracer
                );

                invalidateTrace();
            }
        );

        tracer.previous.addEventListener(
            "click",
            function () {
                stopTrace();

                traceIndex = Math.max(
                    0,
                    traceIndex - 1
                );

                renderTrace();
            }
        );

        tracer.next.addEventListener(
            "click",
            function () {
                stopTrace();

                traceIndex = Math.min(
                    traceSteps.length - 1,
                    traceIndex + 1
                );

                renderTrace();
            }
        );

        tracer.auto.addEventListener(
            "click",
            function () {
                stopTrace();

                if (
                    traceIndex ===
                    traceSteps.length - 1
                ) {
                    traceIndex = 0;
                    renderTrace();
                }

                traceTimer = window.setInterval(
                    function () {
                        if (
                            traceIndex >=
                            traceSteps.length - 1
                        ) {
                            stopTrace();
                            return;
                        }

                        traceIndex += 1;
                        renderTrace();
                    },
                    800
                );
            }
        );

        tracer.pause.addEventListener(
            "click",
            stopTrace
        );

        tracer.reset.addEventListener(
            "click",
            function () {
                stopTrace();
                traceIndex = 0;
                renderTrace();
            }
        );
    }
}());
