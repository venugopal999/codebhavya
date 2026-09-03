(function () {
    "use strict";

    const LEVEL_PROGRESS_KEY = "codebhavya-aiml-level-08-progress-v1";

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
        return Number(value).toFixed(digits === undefined ? 2 : digits);
    }

    function clamp(value, minimum, maximum) {
        return Math.min(maximum, Math.max(minimum, value));
    }

    function prepareCanvas(canvas) {
        const width = Math.max(280, canvas.clientWidth || 700);
        const height = width < 560 ? 330 : 420;
        const ratio = window.devicePixelRatio || 1;

        canvas.style.height = height + "px";
        canvas.width = Math.round(width * ratio);
        canvas.height = Math.round(height * ratio);

        const context = canvas.getContext("2d");
        context.setTransform(ratio, 0, 0, ratio, 0, 0);

        return {
            context: context,
            width: width,
            height: height
        };
    }

    function initKnnLab() {
        const canvas = byId("knnCanvas");
        if (!canvas) return;

        const points = [
            { x: 1.2, y: 1.6, label: "Blue", id: "B1" },
            { x: 2.1, y: 3.2, label: "Blue", id: "B2" },
            { x: 3.0, y: 2.1, label: "Blue", id: "B3" },
            { x: 3.5, y: 5.5, label: "Blue", id: "B4" },
            { x: 4.3, y: 3.8, label: "Blue", id: "B5" },
            { x: 5.7, y: 6.4, label: "Pink", id: "P1" },
            { x: 6.3, y: 4.8, label: "Pink", id: "P2" },
            { x: 7.1, y: 7.5, label: "Pink", id: "P3" },
            { x: 7.8, y: 5.8, label: "Pink", id: "P4" },
            { x: 8.7, y: 8.2, label: "Pink", id: "P5" }
        ];

        const kInput = byId("knnK");
        const metricInput = byId("knnMetric");
        const weightInput = byId("knnWeight");
        const xInput = byId("knnX");
        const yInput = byId("knnY");

        let lastGeometry = null;

        function distance(point, query, metric) {
            const dx = Math.abs(point.x - query.x);
            const dy = Math.abs(point.y - query.y);

            return metric === "manhattan"
                ? dx + dy
                : Math.sqrt(dx * dx + dy * dy);
        }

        function draw(query, ranked, k) {
            const prepared = prepareCanvas(canvas);
            const context = prepared.context;
            const width = prepared.width;
            const height = prepared.height;
            const pad = width < 560 ? 36 : 48;

            const sx = function (x) {
                return pad + x / 10 * (width - 2 * pad);
            };

            const sy = function (y) {
                return height - pad - y / 10 * (height - 2 * pad);
            };

            lastGeometry = {
                width: width,
                height: height,
                pad: pad
            };

            context.fillStyle = "#071b30";
            context.fillRect(0, 0, width, height);

            context.strokeStyle = "rgba(125,211,252,.12)";
            context.lineWidth = 1;

            for (let value = 0; value <= 10; value += 1) {
                context.beginPath();
                context.moveTo(sx(value), pad);
                context.lineTo(sx(value), height - pad);
                context.stroke();

                context.beginPath();
                context.moveTo(pad, sy(value));
                context.lineTo(width - pad, sy(value));
                context.stroke();
            }

            const radius = ranked[Math.max(0, k - 1)].distance;

            if (metricInput.value === "euclidean") {
                const pixelRadius = radius / 10 * (width - 2 * pad);

                context.fillStyle = "rgba(246,204,53,.08)";
                context.strokeStyle = "rgba(246,204,53,.65)";
                context.lineWidth = 2;
                context.setLineDash([7, 6]);

                context.beginPath();
                context.arc(
                    sx(query.x),
                    sy(query.y),
                    pixelRadius,
                    0,
                    Math.PI * 2
                );
                context.fill();
                context.stroke();
                context.setLineDash([]);
            }

            ranked.slice(0, k).forEach(function (item) {
                context.strokeStyle = item.point.label === "Blue"
                    ? "rgba(56,189,248,.55)"
                    : "rgba(251,113,133,.55)";

                context.lineWidth = 2;
                context.beginPath();
                context.moveTo(sx(query.x), sy(query.y));
                context.lineTo(sx(item.point.x), sy(item.point.y));
                context.stroke();
            });

            points.forEach(function (point) {
                const selectedIndex = ranked.findIndex(function (item) {
                    return item.point.id === point.id;
                });

                const selected =
                    selectedIndex >= 0 &&
                    selectedIndex < k;

                context.fillStyle =
                    point.label === "Blue"
                        ? "#38bdf8"
                        : "#fb7185";

                context.strokeStyle =
                    selected
                        ? "#ffffff"
                        : "rgba(255,255,255,.35)";

                context.lineWidth = selected ? 4 : 1.5;

                context.beginPath();
                context.arc(
                    sx(point.x),
                    sy(point.y),
                    selected ? 9 : 7,
                    0,
                    Math.PI * 2
                );
                context.fill();
                context.stroke();

                context.fillStyle = "#dcecff";
                context.font = "700 11px system-ui";
                context.fillText(
                    point.id,
                    sx(point.x) + 11,
                    sy(point.y) - 8
                );
            });

            context.fillStyle = "#f6cc35";
            context.strokeStyle = "#ffffff";
            context.lineWidth = 3;

            context.beginPath();
            context.arc(
                sx(query.x),
                sy(query.y),
                11,
                0,
                Math.PI * 2
            );
            context.fill();
            context.stroke();

            context.fillStyle = "#07182c";
            context.font = "950 14px system-ui";
            context.fillText(
                "?",
                sx(query.x) - 4,
                sy(query.y) + 5
            );

            context.fillStyle = "#dcecff";
            context.font = "700 12px system-ui";
            context.fillText(
                "feature x",
                width - 94,
                height - 13
            );
            context.fillText("feature y", 7, 22);
        }

        function update() {
            const query = {
                x: Number(xInput.value),
                y: Number(yInput.value)
            };

            const k = Number(kInput.value);
            const metricName = metricInput.value;
            const weighted = weightInput.value === "distance";

            const ranked = points
                .map(function (point) {
                    return {
                        point: point,
                        distance: distance(
                            point,
                            query,
                            metricName
                        )
                    };
                })
                .sort(function (a, b) {
                    return a.distance - b.distance;
                });

            const selected = ranked.slice(0, k);
            const votes = {
                Blue: 0,
                Pink: 0
            };

            selected.forEach(function (item) {
                votes[item.point.label] += weighted
                    ? 1 / Math.max(item.distance, 0.001)
                    : 1;
            });

            let prediction;

            if (Math.abs(votes.Blue - votes.Pink) < 1e-9) {
                prediction = selected[0].point.label;
            } else {
                prediction =
                    votes.Blue > votes.Pink
                        ? "Blue"
                        : "Pink";
            }

            const voteTotal =
                votes.Blue + votes.Pink || 1;

            const confidence =
                Math.max(votes.Blue, votes.Pink) /
                voteTotal *
                100;

            byId("knnKValue").textContent = k;
            byId("knnXValue").textContent =
                fixed(query.x, 1);
            byId("knnYValue").textContent =
                fixed(query.y, 1);

            byId("knnBlueVote").textContent =
                fixed(votes.Blue, weighted ? 2 : 0);

            byId("knnPinkVote").textContent =
                fixed(votes.Pink, weighted ? 2 : 0);

            byId("knnBlueBar").style.width =
                votes.Blue / voteTotal * 100 + "%";

            byId("knnPinkBar").style.width =
                votes.Pink / voteTotal * 100 + "%";

            byId("knnPrediction").textContent =
                prediction + " class";

            byId("knnPrediction").className =
                prediction.toLowerCase();

            byId("knnConfidence").textContent =
                fixed(confidence, 1) +
                "% of selected vote weight";

            byId("knnNeighbourRows").innerHTML =
                selected
                    .map(function (item, index) {
                        const contribution = weighted
                            ? 1 / Math.max(
                                item.distance,
                                0.001
                            )
                            : 1;

                        return (
                            '<article class="' +
                            item.point.label.toLowerCase() +
                            '">' +
                            "<span>#" +
                            (index + 1) +
                            " • " +
                            item.point.id +
                            "</span>" +
                            "<strong>" +
                            escapeHtml(item.point.label) +
                            "</strong>" +
                            "<code>d = " +
                            fixed(item.distance, 3) +
                            "</code>" +
                            "<small>vote " +
                            fixed(
                                contribution,
                                weighted ? 3 : 0
                            ) +
                            "</small>" +
                            "</article>"
                        );
                    })
                    .join("");

            byId("knnExplanation").textContent =
                weighted
                    ? "The same k nearest samples were selected, but closer neighbours received larger inverse-distance votes."
                    : "Each selected neighbour contributed one equal vote. A tie is resolved using the single closest neighbour.";

            draw(query, ranked, k);
        }

        [
            kInput,
            metricInput,
            weightInput,
            xInput,
            yInput
        ].forEach(function (control) {
            control.addEventListener("input", update);
            control.addEventListener("change", update);
        });

        byId("knnReset").addEventListener(
            "click",
            function () {
                kInput.value = 3;
                metricInput.value = "euclidean";
                weightInput.value = "uniform";
                xInput.value = 5.2;
                yInput.value = 4.8;
                update();
            }
        );

        canvas.addEventListener("click", function (event) {
            if (!lastGeometry) return;

            const rect = canvas.getBoundingClientRect();
            const localX = event.clientX - rect.left;
            const localY = event.clientY - rect.top;
            const pad = lastGeometry.pad;

            const x =
                (localX - pad) /
                (lastGeometry.width - 2 * pad) *
                10;

            const y =
                (lastGeometry.height - pad - localY) /
                (lastGeometry.height - 2 * pad) *
                10;

            xInput.value = fixed(
                clamp(x, 0.5, 9.5),
                1
            );

            yInput.value = fixed(
                clamp(y, 0.5, 9.5),
                1
            );

            update();
        });

        window.addEventListener(
            "resize",
            update,
            { passive: true }
        );

        update();
    }

    function initBayesLab() {
        const tokenContainer = byId("bayesTokens");
        if (!tokenContainer) return;

        const counts = {
            free: {
                spam: 14,
                normal: 1
            },
            winner: {
                spam: 10,
                normal: 1
            },
            click: {
                spam: 12,
                normal: 2
            },
            meeting: {
                spam: 1,
                normal: 16
            },
            project: {
                spam: 2,
                normal: 18
            },
            report: {
                spam: 3,
                normal: 15
            }
        };

        const totals = {
            spam: 60,
            normal: 70
        };

        const vocabularySize =
            Object.keys(counts).length;

        const selected =
            new Set(["free", "winner"]);

        const priorInput = byId("bayesPrior");
        const alphaInput = byId("bayesAlpha");

        function likelihood(token, category, alpha) {
            return (
                counts[token][category] + alpha
            ) / (
                totals[category] +
                alpha * vocabularySize
            );
        }

        function update() {
            const spamPrior =
                Number(priorInput.value) / 100;

            const normalPrior = 1 - spamPrior;
            const alpha = Number(alphaInput.value);

            let spamScore = Math.log(spamPrior);
            let normalScore = Math.log(normalPrior);

            const tokens = Array.from(selected);

            tokens.forEach(function (token) {
                spamScore += Math.log(
                    likelihood(
                        token,
                        "spam",
                        alpha
                    )
                );

                normalScore += Math.log(
                    likelihood(
                        token,
                        "normal",
                        alpha
                    )
                );
            });

            const maximum =
                Math.max(spamScore, normalScore);

            const spamPower =
                Math.exp(spamScore - maximum);

            const normalPower =
                Math.exp(normalScore - maximum);

            const spamPosterior =
                spamPower /
                (spamPower + normalPower);

            const normalPosterior =
                1 - spamPosterior;

            const decision =
                spamPosterior >= normalPosterior
                    ? "SPAM"
                    : "NORMAL";

            byId("bayesPriorValue").textContent =
                fixed(spamPrior * 100, 0) + "%";

            byId("bayesAlphaValue").textContent =
                fixed(alpha, 1);

            byId("bayesSpamPosterior").textContent =
                fixed(spamPosterior * 100, 1) + "%";

            byId("bayesNormalPosterior").textContent =
                fixed(normalPosterior * 100, 1) + "%";

            byId("bayesSpamBar").style.width =
                spamPosterior * 100 + "%";

            byId("bayesNormalBar").style.width =
                normalPosterior * 100 + "%";

            byId("bayesSpamScore").textContent =
                fixed(spamScore, 4);

            byId("bayesNormalScore").textContent =
                fixed(normalScore, 4);

            byId("bayesDecision").textContent =
                decision;

            byId("bayesDecision").className =
                decision.toLowerCase();

            byId("bayesLikelihoodRows").innerHTML =
                tokens.length
                    ? tokens
                        .map(function (token) {
                            const spamLikelihood =
                                likelihood(
                                    token,
                                    "spam",
                                    alpha
                                );

                            const normalLikelihood =
                                likelihood(
                                    token,
                                    "normal",
                                    alpha
                                );

                            const direction =
                                spamLikelihood >
                                normalLikelihood
                                    ? "spam"
                                    : "normal";

                            return (
                                "<article>" +
                                "<strong>" +
                                escapeHtml(token) +
                                "</strong>" +
                                "<span>P(word|spam) " +
                                "<b>" +
                                fixed(
                                    spamLikelihood,
                                    4
                                ) +
                                "</b></span>" +
                                "<span>P(word|normal) " +
                                "<b>" +
                                fixed(
                                    normalLikelihood,
                                    4
                                ) +
                                "</b></span>" +
                                '<em class="' +
                                direction +
                                '">' +
                                "supports " +
                                direction +
                                "</em>" +
                                "</article>"
                            );
                        })
                        .join("")
                    : (
                        '<article class="empty">' +
                        "<strong>No words selected</strong>" +
                        "<span>The prediction now uses " +
                        "class priors only.</span>" +
                        "</article>"
                    );

            if (!tokens.length) {
                byId("bayesExplanation").textContent =
                    "With no selected evidence, posterior preference follows the class priors.";
            } else {
                const strongest = tokens
                    .slice()
                    .sort(function (a, b) {
                        const ratioA = Math.abs(
                            Math.log(
                                likelihood(
                                    a,
                                    "spam",
                                    alpha
                                ) /
                                likelihood(
                                    a,
                                    "normal",
                                    alpha
                                )
                            )
                        );

                        const ratioB = Math.abs(
                            Math.log(
                                likelihood(
                                    b,
                                    "spam",
                                    alpha
                                ) /
                                likelihood(
                                    b,
                                    "normal",
                                    alpha
                                )
                            )
                        );

                        return ratioB - ratioA;
                    })[0];

                byId("bayesExplanation").textContent =
                    "The model added log-prior and word " +
                    "log-likelihoods. “" +
                    strongest +
                    "” supplied the strongest selected " +
                    "likelihood ratio.";
            }
        }

        tokenContainer.addEventListener(
            "click",
            function (event) {
                const button = event.target.closest(
                    "button[data-token]"
                );

                if (!button) return;

                const token = button.dataset.token;

                if (selected.has(token)) {
                    selected.delete(token);
                } else {
                    selected.add(token);
                }

                button.classList.toggle(
                    "active",
                    selected.has(token)
                );

                button.setAttribute(
                    "aria-pressed",
                    String(selected.has(token))
                );

                update();
            }
        );

        [priorInput, alphaInput].forEach(
            function (control) {
                control.addEventListener(
                    "input",
                    update
                );
            }
        );

        byId("bayesReset").addEventListener(
            "click",
            function () {
                selected.clear();
                selected.add("free");
                selected.add("winner");

                priorInput.value = 40;
                alphaInput.value = 1;

                tokenContainer
                    .querySelectorAll(
                        "button[data-token]"
                    )
                    .forEach(function (button) {
                        const active = selected.has(
                            button.dataset.token
                        );

                        button.classList.toggle(
                            "active",
                            active
                        );

                        button.setAttribute(
                            "aria-pressed",
                            String(active)
                        );
                    });

                update();
            }
        );

        update();
    }

    function buildTraceStates() {
        const points = [
            [1, 1, "Blue"],
            [2, 2, "Blue"],
            [5, 4, "Pink"],
            [6, 5, "Pink"]
        ];

        const query = [3, 3];
        const k = 3;
        const distances = [];
        const votes = {};
        const states = [];

        let current = {};

        function view(value) {
            if (Array.isArray(value)) {
                return JSON.stringify(value)
                    .replace(/"/g, "'");
            }

            if (
                value &&
                typeof value === "object"
            ) {
                return JSON.stringify(value)
                    .replace(/"/g, "'");
            }

            return value;
        }

        function snapshot(extra) {
            return Object.assign(
                {
                    query: view(query),
                    k: k,
                    distances: view(
                        distances.map(
                            function (item) {
                                return [
                                    Number(
                                        item[0].toFixed(3)
                                    ),
                                    item[1]
                                ];
                            }
                        )
                    ),
                    votes: view(votes)
                },
                current,
                extra || {}
            );
        }

        function add(
            line,
            status,
            explanation,
            expression,
            output,
            extra
        ) {
            states.push({
                line: line,
                status: status,
                explanation: explanation,
                expression: expression,
                output:
                    output ||
                    "Waiting for print(...)",
                variables: snapshot(extra)
            });
        }

        add(
            1,
            "Function imported",
            "Import square root for Euclidean distance.",
            "from math import sqrt"
        );

        add(
            2,
            "Training points loaded",
            "Store four labelled examples.",
            "points = four labelled coordinates",
            null,
            { points: "4 samples" }
        );

        add(
            3,
            "Query created",
            "This unlabelled point must be classified.",
            "query = (3, 3)"
        );

        add(
            4,
            "k selected",
            "Use the three closest training samples.",
            "k = 3"
        );

        add(
            5,
            "Distance list created",
            "Start with an empty distance table.",
            "distances = []"
        );

        points.forEach(function (point, index) {
            current = {
                x: point[0],
                y: point[1],
                label: point[2],
                sample: index + 1
            };

            add(
                6,
                "Sample " + (index + 1),
                "Read the next coordinate and label. " +
                "The cursor returns to the loop for " +
                "every point.",
                "x, y, label = " + view(point)
            );

            const dx = point[0] - query[0];
            const dy = point[1] - query[1];

            const calculatedDistance =
                Math.sqrt(dx * dx + dy * dy);

            current.distance =
                Number(calculatedDistance.toFixed(4));

            add(
                7,
                "Distance calculated",
                "Subtract query coordinates, square, " +
                "add and take the square root.",
                "sqrt((" +
                point[0] +
                "−3)² + (" +
                point[1] +
                "−3)²) = " +
                fixed(calculatedDistance, 3)
            );

            distances.push([
                calculatedDistance,
                point[2]
            ]);

            add(
                8,
                "Distance stored",
                "Append distance with its class label.",
                "distances.append((" +
                fixed(calculatedDistance, 3) +
                ", '" +
                point[2] +
                "'))"
            );
        });

        current = {};

        distances.sort(function (a, b) {
            return a[0] - b[0];
        });

        add(
            9,
            "Distances sorted",
            "Arrange candidates from nearest to farthest.",
            "distances.sort()",
            null,
            {
                sorted: view(
                    distances.map(function (item) {
                        return [
                            Number(item[0].toFixed(3)),
                            item[1]
                        ];
                    })
                )
            }
        );

        const neighbors = distances.slice(0, k);

        add(
            10,
            "Neighbours selected",
            "Keep the first three sorted records.",
            "neighbors = distances[:3]",
            null,
            {
                neighbors: view(
                    neighbors.map(function (item) {
                        return [
                            Number(item[0].toFixed(3)),
                            item[1]
                        ];
                    })
                )
            }
        );

        add(
            11,
            "Vote table created",
            "Start an empty count for class labels.",
            "votes = {}"
        );

        neighbors.forEach(
            function (neighbor, index) {
                current = {
                    neighbor: index + 1,
                    distance: Number(
                        neighbor[0].toFixed(3)
                    ),
                    label: neighbor[1]
                };

                add(
                    12,
                    "Neighbour vote " + (index + 1),
                    "Read the next selected neighbour.",
                    "distance, label = " +
                    view([
                        Number(
                            neighbor[0].toFixed(3)
                        ),
                        neighbor[1]
                    ])
                );

                votes[neighbor[1]] =
                    (votes[neighbor[1]] || 0) + 1;

                add(
                    13,
                    "Vote counted",
                    "Increment this neighbour's class count.",
                    "votes['" +
                    neighbor[1] +
                    "'] = " +
                    votes[neighbor[1]]
                );
            }
        );

        current = {};

        const prediction = Object.keys(votes)
            .sort(function (a, b) {
                return votes[b] - votes[a];
            })[0];

        add(
            14,
            "Majority selected",
            "Choose the label with the largest vote count.",
            "prediction = max(votes, key=votes.get) → " +
            prediction,
            null,
            { prediction: prediction }
        );

        add(
            15,
            "Complete",
            "Display the predicted class.",
            "print(prediction)",
            prediction,
            { prediction: prediction }
        );

        return states;
    }

    function initProgramTracer() {
        const codeContainer = byId("tracerCode");
        if (!codeContainer) return;

        const codeLines = [
            "from math import sqrt",
            "points = [(1,1,'Blue'), (2,2,'Blue'), (5,4,'Pink'), (6,5,'Pink')]",
            "query = (3, 3)",
            "k = 3",
            "distances = []",
            "for x, y, label in points:",
            "    distance = sqrt((x-query[0])**2 + (y-query[1])**2)",
            "    distances.append((distance, label))",
            "distances.sort()",
            "neighbors = distances[:k]",
            "votes = {}",
            "for distance, label in neighbors:",
            "    votes[label] = votes.get(label, 0) + 1",
            "prediction = max(votes, key=votes.get)",
            "print(prediction)"
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

        codeContainer.innerHTML =
            codeLines
                .map(function (line, index) {
                    return (
                        '<div class="aiml-code-line" ' +
                        'data-code-line="' +
                        (index + 1) +
                        '">' +
                        "<span>" +
                        String(index + 1).padStart(2, "0") +
                        "</span>" +
                        "<code>" +
                        escapeHtml(line) +
                        "</code>" +
                        "</div>"
                    );
                })
                .join("");

        function stop() {
            if (timer !== null) {
                window.clearInterval(timer);
            }

            timer = null;
            pause.disabled = true;
        }

        function variables(values) {
            const entries =
                Object.entries(values || {});

            byId("tracerVariables").innerHTML =
                entries.length
                    ? entries
                        .map(function (entry) {
                            return (
                                '<article class="aiml-variable">' +
                                "<span>" +
                                escapeHtml(entry[0]) +
                                "</span>" +
                                "<strong>" +
                                escapeHtml(entry[1]) +
                                "</strong>" +
                                "</article>"
                            );
                        })
                        .join("")
                    : (
                        '<article class="aiml-variable">' +
                        "<span>STATE</span>" +
                        "<strong>Not started</strong>" +
                        "</article>"
                    );
        }

        function render() {
            const atStart = step === 0;
            const atEnd = step === states.length;
            const state =
                atStart ? null : states[step - 1];

            codeContainer
                .querySelectorAll(".aiml-code-line")
                .forEach(function (line) {
                    line.classList.toggle(
                        "is-active",
                        Boolean(state) &&
                        Number(
                            line.dataset.codeLine
                        ) === state.line
                    );
                });

            if (state) {
                byId("tracerStatus").textContent =
                    state.status;

                byId("tracerExplanation").textContent =
                    state.explanation;

                byId("tracerExpression").textContent =
                    state.expression;

                byId("tracerOutput").textContent =
                    state.output;

                variables(state.variables);

                const active =
                    codeContainer.querySelector(
                        '[data-code-line="' +
                        state.line +
                        '"]'
                    );

                if (active) {
                    active.scrollIntoView({
                        behavior: "smooth",
                        block: "nearest"
                    });
                }
            } else {
                byId("tracerStatus").textContent =
                    "Ready";

                byId("tracerExplanation").textContent =
                    "Press Next to execute the first statement.";

                byId("tracerExpression").textContent =
                    "—";

                byId("tracerOutput").textContent =
                    "Waiting for print(...)";

                variables({});
            }

            previous.disabled = atStart;
            next.disabled = atEnd;
            auto.disabled =
                atEnd || timer !== null;

            byId("tracerProgress").textContent =
                "Step " +
                step +
                " of " +
                states.length;

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

        toggle.addEventListener(
            "click",
            function () {
                const opening = panel.hidden;

                panel.hidden = !opening;

                toggle.textContent = opening
                    ? "✕ Close Interactive Tracer"
                    : "Open Interactive Tracer";

                toggle.setAttribute(
                    "aria-expanded",
                    String(opening)
                );

                if (opening) {
                    window.setTimeout(function () {
                        panel.scrollIntoView({
                            behavior: "smooth",
                            block: "nearest"
                        });
                    }, 50);
                } else {
                    stop();
                }
            }
        );

        previous.addEventListener(
            "click",
            function () {
                stop();
                step = Math.max(0, step - 1);
                render();
            }
        );

        next.addEventListener("click", advance);

        auto.addEventListener(
            "click",
            function () {
                if (
                    step >= states.length ||
                    timer !== null
                ) {
                    return;
                }

                auto.disabled = true;
                pause.disabled = false;

                timer = window.setInterval(
                    advance,
                    800
                );
            }
        );

        pause.addEventListener(
            "click",
            function () {
                stop();
                render();
            }
        );

        reset.addEventListener(
            "click",
            function () {
                stop();
                step = 0;
                render();
            }
        );

        render();
    }

    function initProgrammingProblems() {
        const list = byId("problemList");
        if (!list) return;

        const problems = [
            {
                title: "Euclidean Distance",
                description:
                    "Read two 2D points and print their Euclidean distance rounded to three decimals.",
                sampleInput: "1 2 | 4 6",
                expected: "5.0",
                hint:
                    "Square both coordinate differences, add them and take the square root.",
                starter:
                    "from math import sqrt\n" +
                    "# Read or define both points\n",
                solution:
                    "from math import sqrt\n" +
                    "x1, y1 = map(float, input().split())\n" +
                    "x2, y2 = map(float, input().split())\n" +
                    "distance = sqrt((x1-x2)**2 + (y1-y2)**2)\n" +
                    "print(round(distance, 3))",
                required: [
                    ["sqrt("],
                    ["**2", "** 2"],
                    ["print("]
                ]
            },
            {
                title: "k-NN Majority Prediction",
                description:
                    "Calculate all distances, select k nearest labels and print the majority class.",
                sampleInput:
                    "query=(3,3), k=3",
                expected: "Blue",
                hint:
                    "Store (distance, label), sort, slice [:k], then count labels.",
                starter:
                    "from math import sqrt\n" +
                    "points = [(1,1,'Blue'), (2,2,'Blue'), (5,4,'Pink')]\n" +
                    "query = (3,3)\n" +
                    "k = 3\n",
                solution:
                    "from math import sqrt\n" +
                    "points = [(1,1,'Blue'), (2,2,'Blue'), (5,4,'Pink')]\n" +
                    "query = (3,3)\n" +
                    "k = 3\n" +
                    "distances = []\n" +
                    "for x, y, label in points:\n" +
                    "    d = sqrt((x-query[0])**2 + (y-query[1])**2)\n" +
                    "    distances.append((d, label))\n" +
                    "distances.sort()\n" +
                    "votes = {}\n" +
                    "for d, label in distances[:k]:\n" +
                    "    votes[label] = votes.get(label, 0) + 1\n" +
                    "print(max(votes, key=votes.get))",
                required: [
                    ["for "],
                    ["sqrt("],
                    ["append("],
                    ["sort("],
                    [":k"],
                    ["votes"],
                    ["max("],
                    ["print("]
                ]
            },
            {
                title:
                    "Inverse-Distance Weighted Vote",
                description:
                    "Give each neighbour weight 1/(distance+epsilon) and select the largest class score.",
                sampleInput:
                    "[(0.5,'A'), (1.5,'B'), (2.0,'B')]",
                expected: "A",
                hint:
                    "Accumulate a floating score for every label instead of adding one.",
                starter:
                    "neighbors = [(0.5, 'A'), (1.5, 'B'), (2.0, 'B')]\n" +
                    "scores = {}\n",
                solution:
                    "neighbors = [(0.5, 'A'), (1.5, 'B'), (2.0, 'B')]\n" +
                    "scores = {}\n" +
                    "for distance, label in neighbors:\n" +
                    "    weight = 1 / (distance + 1e-9)\n" +
                    "    scores[label] = scores.get(label, 0) + weight\n" +
                    "prediction = max(scores, key=scores.get)\n" +
                    "print(prediction)",
                required: [
                    ["for "],
                    ["1 /", "1/"],
                    ["scores.get("],
                    ["max("],
                    ["print("]
                ]
            },
            {
                title:
                    "Gaussian Naive Bayes Pipeline",
                description:
                    "Split numeric data, standardize it safely and fit GaussianNB.",
                sampleInput: "X, y",
                expected: "Validation predictions",
                hint:
                    "Use train_test_split and a Pipeline with StandardScaler and GaussianNB.",
                starter:
                    "from sklearn.pipeline import Pipeline\n" +
                    "# Build a leakage-safe Gaussian NB model\n",
                solution:
                    "from sklearn.model_selection import train_test_split\n" +
                    "from sklearn.pipeline import Pipeline\n" +
                    "from sklearn.preprocessing import StandardScaler\n" +
                    "from sklearn.naive_bayes import GaussianNB\n" +
                    "X_train, X_test, y_train, y_test = train_test_split(" +
                    "X, y, test_size=0.2, stratify=y, random_state=42)\n" +
                    "model = Pipeline([('scale', StandardScaler()), " +
                    "('nb', GaussianNB())])\n" +
                    "model.fit(X_train, y_train)\n" +
                    "print(model.predict(X_test))",
                required: [
                    ["train_test_split("],
                    ["pipeline("],
                    ["standardscaler("],
                    ["gaussiannb("],
                    [".fit("],
                    ["predict("],
                    ["print("]
                ]
            },
            {
                title:
                    "Multinomial Naive Bayes for Text",
                description:
                    "Vectorize messages with counts and train a MultinomialNB classifier in one pipeline.",
                sampleInput:
                    "messages and spam labels",
                expected:
                    "Predicted class for a new message",
                hint:
                    "Combine CountVectorizer and MultinomialNB in a Pipeline.",
                starter:
                    "from sklearn.pipeline import Pipeline\n" +
                    "# Add text vectorization and the classifier\n",
                solution:
                    "from sklearn.pipeline import Pipeline\n" +
                    "from sklearn.feature_extraction.text import CountVectorizer\n" +
                    "from sklearn.naive_bayes import MultinomialNB\n" +
                    "model = Pipeline([('count', CountVectorizer()), " +
                    "('nb', MultinomialNB(alpha=1.0))])\n" +
                    "model.fit(messages, labels)\n" +
                    "print(model.predict(['free project meeting']))",
                required: [
                    ["pipeline("],
                    ["countvectorizer("],
                    ["multinomialnb("],
                    ["alpha"],
                    [".fit("],
                    ["predict("],
                    ["print("]
                ]
            }
        ];

        let saved = {};

        try {
            saved = JSON.parse(
                window.localStorage.getItem(
                    LEVEL_PROGRESS_KEY
                ) || "{}"
            );
        } catch (error) {
            saved = {};
        }

        const solved = new Set(
            Array.isArray(saved.solvedProblems)
                ? saved.solvedProblems
                : []
        );

        const scores =
            saved.problemScores &&
            typeof saved.problemScores === "object"
                ? saved.problemScores
                : {};

        const revealed = new Set();

        function save() {
            let current = {};

            try {
                current = JSON.parse(
                    window.localStorage.getItem(
                        LEVEL_PROGRESS_KEY
                    ) || "{}"
                );
            } catch (error) {
                current = {};
            }

            current.solvedProblems =
                Array.from(solved);

            current.problemScores = scores;

            window.localStorage.setItem(
                LEVEL_PROGRESS_KEY,
                JSON.stringify(current)
            );
        }

        function summary() {
            const total = Object
                .values(scores)
                .reduce(function (sum, score) {
                    return (
                        sum +
                        Number(score || 0)
                    );
                }, 0);

            byId("problemSolvedCount").textContent =
                solved.size +
                " / " +
                problems.length;

            byId("problemScore").textContent =
                total +
                " / " +
                problems.length * 100;

            byId("problemProgressBar").style.width =
                solved.size /
                problems.length *
                100 +
                "%";
        }

        list.innerHTML = problems
            .map(function (problem, index) {
                const displayNumber = index + 1;

                return (
                    '<article class="aiml-problem-card' +
                    (
                        solved.has(index)
                            ? " is-solved"
                            : ""
                    ) +
                    '" data-problem="' +
                    index +
                    '">' +

                    '<div class="aiml-problem-head">' +
                    '<span class="aiml-problem-number">' +
                    String(displayNumber).padStart(
                        2,
                        "0"
                    ) +
                    "</span>" +

                    "<div>" +
                    "<h3>" +
                    displayNumber +
                    ". " +
                    escapeHtml(problem.title) +
                    "</h3>" +
                    "<p>" +
                    escapeHtml(problem.description) +
                    "</p>" +
                    "</div>" +
                    "</div>" +

                    '<div class="aiml-problem-data">' +
                    "<span><strong>Sample input:</strong> " +
                    escapeHtml(problem.sampleInput) +
                    "</span>" +
                    "<span><strong>Expected output:</strong> " +
                    "<code>" +
                    escapeHtml(problem.expected) +
                    "</code></span>" +
                    "</div>" +

                    '<div class="aiml-problem-actions">' +
                    '<button type="button" class="primary" ' +
                    'data-action="workspace">' +
                    "💻 Solve It Yourself" +
                    "</button>" +
                    '<button type="button" class="hint" ' +
                    'data-action="hint">' +
                    "Hint" +
                    "</button>" +
                    '<button type="button" ' +
                    'data-action="solution">' +
                    "Show Program" +
                    "</button>" +
                    "</div>" +

                    '<div class="aiml-problem-reveal" ' +
                    'data-panel="hint" hidden>' +
                    "<strong>Hint</strong>" +
                    "<p>" +
                    escapeHtml(problem.hint) +
                    "</p>" +
                    "</div>" +

                    '<div class="aiml-problem-reveal" ' +
                    'data-panel="solution" hidden>' +
                    "<strong>Model program</strong>" +
                    "<pre><code>" +
                    escapeHtml(problem.solution) +
                    "</code></pre>" +
                    "</div>" +

                    '<div class="aiml-workspace" ' +
                    'data-panel="workspace" hidden>' +

                    '<label for="problemCode' +
                    index +
                    '">' +
                    "Your Python code" +
                    "</label>" +

                    '<textarea id="problemCode' +
                    index +
                    '" spellcheck="false">' +
                    escapeHtml(problem.starter) +
                    "</textarea>" +

                    '<div class="aiml-workspace-row">' +
                    '<button type="button" ' +
                    'data-action="check">' +
                    "Check Answer" +
                    "</button>" +

                    '<button type="button" ' +
                    'data-action="reset">' +
                    "Reset" +
                    "</button>" +

                    '<span class="aiml-check-result" ' +
                    "data-result>" +
                    "Write your solution, then check its structure." +
                    "</span>" +
                    "</div>" +
                    "</div>" +
                    "</article>"
                );
            })
            .join("");

        function toggle(
            card,
            panelName,
            button,
            openLabel,
            closeLabel
        ) {
            const panel = card.querySelector(
                '[data-panel="' +
                panelName +
                '"]'
            );

            if (!panel) return;

            const opening = panel.hidden;
            panel.hidden = !opening;

            button.textContent =
                opening
                    ? closeLabel
                    : openLabel;
        }

        list.addEventListener(
            "click",
            function (event) {
                const button = event.target.closest(
                    "button[data-action]"
                );

                if (!button) return;

                const card = button.closest(
                    ".aiml-problem-card"
                );

                const index =
                    Number(card.dataset.problem);

                const problem = problems[index];
                const action =
                    button.dataset.action;

                if (action === "workspace") {
                    toggle(
                        card,
                        "workspace",
                        button,
                        "💻 Solve It Yourself",
                        "✕ Close Workspace"
                    );
                    return;
                }

                if (action === "hint") {
                    toggle(
                        card,
                        "hint",
                        button,
                        "Hint",
                        "Hide Hint"
                    );
                    return;
                }

                if (action === "solution") {
                    revealed.add(index);

                    toggle(
                        card,
                        "solution",
                        button,
                        "Show Program",
                        "Hide Program"
                    );
                    return;
                }

                const textarea =
                    card.querySelector("textarea");

                const result =
                    card.querySelector(
                        "[data-result]"
                    );

                if (action === "reset") {
                    textarea.value =
                        problem.starter;

                    result.className =
                        "aiml-check-result";

                    result.textContent =
                        "Workspace reset. Try the problem again.";

                    return;
                }

                if (action === "check") {
                    const normalized =
                        textarea.value
                            .toLowerCase()
                            .replace(/\s+/g, " ");

                    const missing =
                        problem.required.filter(
                            function (alternatives) {
                                return !alternatives.some(
                                    function (token) {
                                        return normalized.includes(
                                            token.toLowerCase()
                                        );
                                    }
                                );
                            }
                        );

                    if (
                        !textarea.value.trim() ||
                        textarea.value.trim() ===
                        problem.starter.trim()
                    ) {
                        result.className =
                            "aiml-check-result error";

                        result.textContent =
                            "Add your solution before checking.";

                        return;
                    }

                    if (missing.length) {
                        result.className =
                            "aiml-check-result error";

                        result.textContent =
                            "Not complete yet. Recheck the required calculation, model steps and output.";

                        return;
                    }

                    const score =
                        revealed.has(index)
                            ? 60
                            : 100;

                    solved.add(index);

                    scores[index] = Math.max(
                        Number(scores[index] || 0),
                        score
                    );

                    card.classList.add("is-solved");

                    result.className =
                        "aiml-check-result success";

                    result.textContent =
                        revealed.has(index)
                            ? "Logic recognized — completed after viewing the model program. Score: 60/100."
                            : "Logic recognized — solved independently. Score: 100/100.";

                    save();
                    summary();
                }
            }
        );

        summary();
    }

    function initQuiz() {
        const container = byId("quizQuestions");
        if (!container) return;

        const questions = [
            {
                question:
                    "Why should numeric features usually be scaled before k-NN?",
                options: [
                    "To increase sample count",
                    "Large-range features otherwise dominate distance",
                    "To make labels continuous",
                    "To remove every outlier"
                ],
                answer: 1,
                explanation:
                    "Distance uses numeric differences, so a large-unit feature can overwhelm smaller-unit features without being more informative."
            },
            {
                question:
                    "What usually happens when k increases greatly?",
                options: [
                    "The boundary becomes more flexible",
                    "The model stores less data",
                    "The boundary becomes smoother and bias can increase",
                    "Distances are no longer needed"
                ],
                answer: 2,
                explanation:
                    "More neighbours average a wider region, usually reducing variance but increasing bias."
            },
            {
                question:
                    "Which distance equals Σ|xᵢ−qᵢ|?",
                options: [
                    "Euclidean",
                    "Manhattan",
                    "Cosine similarity",
                    "Jaccard"
                ],
                answer: 1,
                explanation:
                    "Manhattan or L1 distance adds absolute coordinate differences."
            },
            {
                question:
                    "What does Naive Bayes assume?",
                options: [
                    "Features are conditionally independent given the class",
                    "All classes have equal priors",
                    "Every feature is Gaussian",
                    "Training samples are neighbours"
                ],
                answer: 0,
                explanation:
                    "The naive factorization assumes conditional feature independence after the class is known."
            },
            {
                question:
                    "Which variant naturally models word-count features?",
                options: [
                    "Gaussian NB",
                    "Multinomial NB",
                    "k-NN regression",
                    "Linear regression"
                ],
                answer: 1,
                explanation:
                    "Multinomial NB models non-negative event counts such as bag-of-words token frequencies."
            },
            {
                question:
                    "Why is additive smoothing used?",
                options: [
                    "To scale features",
                    "To prevent unseen events from producing zero likelihood",
                    "To remove priors",
                    "To increase k"
                ],
                answer: 1,
                explanation:
                    "A positive pseudocount assigns non-zero probability to events missing from a class's training counts."
            },
            {
                question:
                    "Why calculate Naive Bayes scores in log space?",
                options: [
                    "To change the winning class",
                    "To turn small-probability products into stable sums",
                    "To create more features",
                    "To avoid validation"
                ],
                answer: 1,
                explanation:
                    "Logarithms preserve ordering, convert products to sums and reduce floating-point underflow."
            },
            {
                question:
                    "Which statement best compares prediction cost?",
                options: [
                    "k-NN is always faster",
                    "Naive Bayes usually predicts from compact statistics, while naive k-NN searches stored samples",
                    "Both have identical memory and latency",
                    "Naive Bayes stores every training distance"
                ],
                answer: 1,
                explanation:
                    "Naive Bayes prediction uses learned class statistics, while straightforward k-NN calculates distances to stored training examples."
            }
        ];

        container.innerHTML = questions
            .map(function (
                item,
                questionIndex
            ) {
                return (
                    '<article class="aiml-quiz-question" ' +
                    'data-quiz-question="' +
                    questionIndex +
                    '">' +

                    "<strong>" +
                    (questionIndex + 1) +
                    ". " +
                    escapeHtml(item.question) +
                    "</strong>" +

                    '<div class="aiml-quiz-options">' +

                    item.options
                        .map(function (
                            option,
                            optionIndex
                        ) {
                            const id =
                                "quiz-" +
                                questionIndex +
                                "-" +
                                optionIndex;

                            return (
                                '<label class="aiml-quiz-option" ' +
                                'for="' +
                                id +
                                '">' +
                                '<input type="radio" ' +
                                'id="' +
                                id +
                                '" name="quiz-' +
                                questionIndex +
                                '" value="' +
                                optionIndex +
                                '">' +

                                "<span>" +
                                String.fromCharCode(
                                    65 + optionIndex
                                ) +
                                ". " +
                                escapeHtml(option) +
                                "</span>" +
                                "</label>"
                            );
                        })
                        .join("") +

                    "</div>" +

                    '<div class="aiml-quiz-explanation" ' +
                    "hidden></div>" +

                    "</article>"
                );
            })
            .join("");

        container.addEventListener(
            "change",
            function (event) {
                if (
                    !event.target.matches(
                        'input[type="radio"]'
                    )
                ) {
                    return;
                }

                event.target
                    .closest(
                        ".aiml-quiz-question"
                    )
                    .querySelectorAll(
                        ".aiml-quiz-option"
                    )
                    .forEach(function (option) {
                        option.classList.toggle(
                            "is-selected",
                            option.contains(
                                event.target
                            )
                        );
                    });
            }
        );

        byId("checkQuiz").addEventListener(
            "click",
            function () {
                let correct = 0;
                let answered = 0;

                questions.forEach(
                    function (item, index) {
                        const question =
                            container.querySelector(
                                '[data-quiz-question="' +
                                index +
                                '"]'
                            );

                        const selected =
                            question.querySelector(
                                'input[type="radio"]:checked'
                            );

                        const options = Array.from(
                            question.querySelectorAll(
                                ".aiml-quiz-option"
                            )
                        );

                        const explanation =
                            question.querySelector(
                                ".aiml-quiz-explanation"
                            );

                        options.forEach(
                            function (
                                option,
                                optionIndex
                            ) {
                                option.classList.remove(
                                    "is-correct",
                                    "is-wrong"
                                );

                                if (
                                    optionIndex ===
                                    item.answer
                                ) {
                                    option.classList.add(
                                        "is-correct"
                                    );
                                }
                            }
                        );

                        if (selected) {
                            answered += 1;

                            if (
                                Number(selected.value) ===
                                item.answer
                            ) {
                                correct += 1;
                            } else {
                                options[
                                    Number(
                                        selected.value
                                    )
                                ].classList.add(
                                    "is-wrong"
                                );
                            }
                        }

                        explanation.hidden = false;

                        explanation.innerHTML =
                            "<strong>Your answer: " +
                            (
                                selected
                                    ? escapeHtml(
                                        item.options[
                                            Number(
                                                selected.value
                                            )
                                        ]
                                    )
                                    : "Not attempted"
                            ) +
                            "</strong><br>" +
                            "<strong>Correct answer: " +
                            escapeHtml(
                                item.options[
                                    item.answer
                                ]
                            ) +
                            "</strong><br>" +
                            escapeHtml(
                                item.explanation
                            );
                    }
                );

                byId("quizScore").textContent =
                    correct +
                    " / " +
                    questions.length +
                    " correct" +
                    (
                        answered < questions.length
                            ? " • " +
                            (
                                questions.length -
                                answered
                            ) +
                            " not attempted"
                            : ""
                    );

                let progress = {};

                try {
                    progress = JSON.parse(
                        window.localStorage.getItem(
                            LEVEL_PROGRESS_KEY
                        ) || "{}"
                    );
                } catch (error) {
                    progress = {};
                }

                progress.bestQuizScore = Math.max(
                    Number(
                        progress.bestQuizScore || 0
                    ),
                    correct
                );

                window.localStorage.setItem(
                    LEVEL_PROGRESS_KEY,
                    JSON.stringify(progress)
                );
            }
        );

        byId("resetQuiz").addEventListener(
            "click",
            function () {
                container
                    .querySelectorAll(
                        'input[type="radio"]'
                    )
                    .forEach(function (input) {
                        input.checked = false;
                    });

                container
                    .querySelectorAll(
                        ".aiml-quiz-option"
                    )
                    .forEach(function (option) {
                        option.classList.remove(
                            "is-selected",
                            "is-correct",
                            "is-wrong"
                        );
                    });

                container
                    .querySelectorAll(
                        ".aiml-quiz-explanation"
                    )
                    .forEach(
                        function (explanation) {
                            explanation.hidden = true;
                            explanation.textContent = "";
                        }
                    );

                byId("quizScore").textContent =
                    "Not checked yet";
            }
        );
    }

    function initInterviewQuestions() {
        const container = byId("interviewList");
        if (!container) return;

        const questions = [
            {
                question:
                    "Why is k-NN called a lazy learner?",
                answer:
                    "It postpones generalization until prediction time. Training mainly stores prepared examples, while each query triggers distance calculation, neighbour selection and voting. Preprocessing and optional indexing still require fitted work."
            },
            {
                question:
                    "How do you select k and the distance metric?",
                answer:
                    "Put imputation and scaling inside a pipeline, then compare meaningful combinations with cross-validation using the deployment metric. Inspect stability, ties, latency and whether the metric represents domain similarity."
            },
            {
                question:
                    "What is the bias–variance effect of k?",
                answer:
                    "Small k creates highly local flexible boundaries with low bias and high variance. Larger k averages wider neighbourhoods, usually reducing variance and increasing bias. Excessively large k can ignore minority or local structure."
            },
            {
                question:
                    "Explain the curse of dimensionality for k-NN.",
                answer:
                    "High-dimensional space has rapidly increasing volume, so finite samples become sparse and distances often concentrate. Nearest and farthest points become less distinguishable. Remove irrelevant features, use suitable representation or reduction, and validate again."
            },
            {
                question:
                    "What are k-NN training, storage and prediction complexities?",
                answer:
                    "Storing n samples with d features requires O(nd) memory. Basic training has little model fitting beyond preparation. A naive query calculates O(nd) distance work; full sorting adds O(n log n), though partial selection and neighbour indexes can reduce selection or search cost."
            },
            {
                question:
                    "State the Naive Bayes assumption precisely.",
                answer:
                    "Features are assumed conditionally independent given the class: P(x₁,…,x_d|C) is approximated by the product of individual P(xᵢ|C). It does not claim that features are unconditionally independent in the complete population."
            },
            {
                question:
                    "Compare Gaussian, Multinomial and Bernoulli Naive Bayes.",
                answer:
                    "Gaussian NB models continuous feature values with class-specific means and variances. Multinomial NB models non-negative event counts or frequencies. Bernoulli NB models binary presence and absence, so absent events also contribute."
            },
            {
                question:
                    "What are the zero-frequency problem and Laplace smoothing?",
                answer:
                    "An event unseen in a class has maximum-likelihood probability zero, which destroys the complete likelihood product. Add-α smoothing uses (count+α)/(total+αV), assigning every vocabulary event a non-zero pseudocount."
            },
            {
                question:
                    "Why use log-probabilities in Naive Bayes?",
                answer:
                    "Multiplying many probabilities can underflow to zero. Logarithms convert products into numerically stable sums, and because log is monotonic, the class with the maximum probability also has the maximum log-score."
            },
            {
                question:
                    "When would you choose k-NN over Naive Bayes?",
                answer:
                    "Prefer k-NN when local geometric similarity is meaningful, dimensions are manageable and prediction latency/storage are acceptable. Prefer a matching Naive Bayes variant when compact training statistics, fast inference or sparse high-dimensional counts are advantageous. Validate both rather than deciding only from theory."
            }
        ];

        container.innerHTML = questions
            .map(function (item, index) {
                return (
                    '<article class="aiml-interview-item">' +
                    '<div class="aiml-interview-question">' +
                    "<span>" +
                    (index + 1) +
                    ".</span>" +
                    "<strong>" +
                    escapeHtml(item.question) +
                    "</strong>" +
                    '<button type="button" ' +
                    'aria-expanded="false">' +
                    "Show Answer" +
                    "</button>" +
                    "</div>" +
                    '<div class="aiml-interview-answer" hidden>' +
                    escapeHtml(item.answer) +
                    "</div>" +
                    "</article>"
                );
            })
            .join("");

        container.addEventListener(
            "click",
            function (event) {
                const button =
                    event.target.closest("button");

                if (!button) return;

                const answer = button
                    .closest(
                        ".aiml-interview-item"
                    )
                    .querySelector(
                        ".aiml-interview-answer"
                    );

                const opening = answer.hidden;
                answer.hidden = !opening;

                button.textContent =
                    opening
                        ? "Hide Answer"
                        : "Show Answer";

                button.setAttribute(
                    "aria-expanded",
                    String(opening)
                );
            }
        );
    }

    function initSmoothLocalLinks() {
        document.addEventListener(
            "click",
            function (event) {
                const link = event.target.closest(
                    'a[href^="#"]'
                );

                if (
                    !link ||
                    link.getAttribute("href") === "#"
                ) {
                    return;
                }

                const target =
                    document.querySelector(
                        link.getAttribute("href")
                    );

                if (!target) return;

                event.preventDefault();

                target.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            }
        );
    }

    function initLevelEight() {
        initKnnLab();
        initBayesLab();
        initProgramTracer();
        initProgrammingProblems();
        initQuiz();
        initInterviewQuestions();
        initSmoothLocalLinks();
    }

    if (document.readyState === "loading") {
        document.addEventListener(
            "DOMContentLoaded",
            initLevelEight
        );
    } else {
        initLevelEight();
    }
}());
