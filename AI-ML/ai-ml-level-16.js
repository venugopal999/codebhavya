(function () {
    "use strict";

    const PROGRESS_KEY = "codebhavya-aiml-level-16-progress-v1";
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

    function cosine(a, b) {
        let dot = 0;
        let normA = 0;
        let normB = 0;

        for (let index = 0; index < a.length; index += 1)) {
            dot += a[index] * b[index];
            normA += a[index] * a[index];
            normB += b[index] * b[index];
        }

        return normA && normB ? dot / Math.sqrt(normA * normB) : 0;
    }

    function seededRandom(seed) {
        let state = seed >>> 0;

        return function () {
            state = (state * 1664525 + 1013904223) >>> 0;
            return state / 4294967296;
        };
    }

    function initRankingLab() {
        const canvas = get("recommendationCanvas");

        if (!canvas || canvas.dataset.cbActive) return;
        canvas.dataset.cbActive = "true";

        const domains = {
            movies: {
                items: ["Orbit", "Laugh", "Quest", "Pulse", "Roots", "Code"],
                features: [
                    [1, 0, 0.2],
                    [0.05, 1, 0.15],
                    [0.8, 0.05, 0.5],
                    [0.25, 0.7, 0.1],
                    [0.1, 0.2, 1],
                    [0.65, 0.1, 0.7]
                ],
                ratings: [
                    [5, 1, 4, null, null, null],
                    [4, 1, 5, null, 2, null],
                    [1, 5, null, 4, null, 1],
                    [null, 4, 1, 5, 4, null],
                    [4, null, 4, 1, null, 5]
                ],
                relevant: [
                    [5, 3],
                    [5, 3],
                    [2, 4],
                    [0, 5],
                    [1, 4]
                ]
            },

            courses: {
                items: ["Python", "Stats", "SQL", "ML", "Cloud", "DSA"],
                features: [
                    [1, 0.1, 0.2],
                    [0.1, 1, 0.25],
                    [0.65, 0.35, 0.1],
                    [0.55, 0.8, 0.65],
                    [0.35, 0.15, 1],
                    [0.8, 0.2, 0.35]
                ],
                ratings: [
                    [5, 3, 4, null, null, null],
                    [4, 5, null, null, 2, 3],
                    [2, 5, 3, 5, null, null],
                    [null, 2, 4, 4, 5, null],
                    [5, null, 4, null, 3, 5]
                ],
                relevant: [
                    [3, 5],
                    [3, 2],
                    [4, 5],
                    [0, 5],
                    [1, 3]
                ]
            },

            jobs: {
                items: ["Data", "Web", "QA", "ML", "Cloud", "Analyst"],
                features: [
                    [0.7, 0.8, 0.2],
                    [0.85, 0.15, 0.25],
                    [0.55, 0.3, 0.15],
                    [0.45, 1, 0.55],
                    [0.5, 0.35, 1],
                    [0.65, 0.75, 0.2]
                ],
                ratings: [
                    [5, 3, null, 4, null, null],
                    [2, 5, 4, null, 3, null],
                    [4, null, 3, 5, null, 4],
                    [null, 4, 5, 2, 4, null],
                    [5, 2, null, null, 3, 5]
                ],
                relevant: [
                    [5, 4],
                    [3, 5],
                    [1, 4],
                    [0, 5],
                    [2, 3]
                ]
            }
        };

        const domainInput = get("recommendationDomain");
        const userInput = get("recommendationUser");
        const methodInput = get("recommendationMethod");
        const kInput = get("recommendationK");
        const nextButton = get("recommendationNext");
        const autoButton = get("recommendationAuto");
        const pauseButton = get("recommendationPause");
        const resetButton = get("recommendationReset");

        const phases = [
            "Interactions",
            "Candidates",
            "Preference evidence",
            "Scores",
            "Ranking",
            "Top-K decision",
            "Evaluation"
        ];

        let step = 0;
        let timer = null;

        function popularity(data, candidate) {
            const values = data.ratings
                .map(function (row) {
                    return row[candidate];
                })
                .filter(function (value) {
                    return value !== null;
                });

            const mean = values.reduce(function (sum, value) {
                return sum + value;
            }, 0) / Math.max(1, values.length);

            return (values.length * mean + 3.3 * 2) / (values.length + 2);
        }

        function contentScores(data, user) {
            const profile = new Array(data.features[0].length).fill(0);
            let weightTotal = 0;

            data.ratings[user].forEach(function (rating, item) {
                if (rating === null) return;

                const weight = Math.max(0, rating - 2.5);

                data.features[item].forEach(function (value, feature) {
                    profile[feature] += value * weight;
                });

                weightTotal += weight;
            });

            if (weightTotal) {
                profile.forEach(function (_, index) {
                    profile[index] /= weightTotal;
                });
            }

            return data.items.map(function (_, item) {
                return cosine(profile, data.features[item]) * 5;
            });
        }

        function userScores(data, user) {
            const similarities = data.ratings.map(function (row, neighbour) {
                if (neighbour === user) return 0;

                const a = [];
                const b = [];

                row.forEach(function (rating, item) {
                    if (
                        rating !== null &&
                        data.ratings[user][item] !== null
                    ) {
                        a.push(data.ratings[user][item]);
                        b.push(rating);
                    }
                });

                if (a.length < 2) return 0;

                const raw = cosine(a, b);
                return raw * a.length / (a.length + 2);
            });

            return data.items.map(function (_, item) {
                let numerator = 0;
                let denominator = 0;

                similarities.forEach(function (similarity, neighbour) {
                    const rating = data.ratings[neighbour][item];

                    if (rating === null || similarity <= 0) return;

                    numerator += similarity * rating;
                    denominator += similarity;
                });

                return denominator
                    ? numerator / denominator
                    : popularity(data, item);
            });
        }

        function itemScores(data, user) {
            const itemVectors = data.items.map(function (_, item) {
                return data.ratings.map(function (row) {
                    return row[item] === null ? 0 : row[item];
                });
            });

            return data.items.map(function (_, candidate) {
                let numerator = 0;
                let denominator = 0;

                data.ratings[user].forEach(function (rating, seenItem) {
                    if (rating === null) return;

                    const similarity = Math.max(
                        0,
                        cosine(
                            itemVectors[candidate],
                            itemVectors[seenMultiUser]
                        )
                    );

                    numerator += similarity * rating;
                    denominator += similarity;
                });

                return denominator
                    ? numerator / denominator
                    : popularity(data, candidate);
            });
        }

        function normalize(values) {
            const minimum = Math.min.apply(null, values);
            const maximum = Math.max.apply(null, values);

            return values.map(function (value) {
                return (
                    (value - minimum) /
                    Math.max(1e-9, maximum - minimum)
                );
            });
        }

        function calculateForUser(data, user, method) {
            const content = contentScores(data, user);
            const users = userScores(data, user);
            const items = itemScores(data, user);
            const popular = data.items.map(function (_, item) {
                return popularity(data, item);
            });

            const components = {
                popularity: popular,
                content: content,
                user: users,
                item: items
            };

            let scores = components[method];

            if (method === "hybrid") {
                const p = normalize(popular);
                const c = normalize(content);
                const u = normalize(users);
                const i = normalize(items);

                scores = data.items.map(function (_, item) {
                    return 5 * (
                        0.15 * p[item] +
                        0.25 * c[item] +
                        0.3 * u[item] +
                        0.3 * i[item]
                    );
                });
            }

            const ranking = scores
                .map(function (score, item) {
                    return {
                        item: item,
                        score: score
                    };
                })
                .filter(function (entry) {
                    return data.ratings[user][entry.item] === null;
                })
                .sort(function (a, b) {
                    return b.score - a.score;
                });

            return {
                scores: scores,
                ranking: ranking
            };
        }

        function calculate() {
            const data = domains[domainInput.value] || domains.movies;
            const user = Number(userInput.value);
            const k = Number(kInput.value);
            const result = calculateForUser(
                data,
                user,
                methodInput.value
            );

            const top = result.ranking.slice(0, k);
            const relevant = new Set(data.relevant[user]);

            const hits = top.filter(function (entry) {
                return relevant.has(entry.item);
            }).length;

            const precision = hits / Math.max(1, k);
            const recall = hits / Math.max(1, relevant.size);

            let pairDistance = 0;
            let pairs = 0;

            for (let first = 0; first < top.length; first += 1) {
                for (
                    let second = first + 1;
                    second < top.length;
                    second += 1
                ) {
                    pairDistance += 1 - cosine(
                        data.features[top[first].item],
                        data.features[top[second].item]
                    );

                    pairs += 1;
                }
            }

            const diversity = pairs
                ? pairDistance / pairs
                : 1;

            const catalog = new Set();

            data.ratings.forEach(function (_, otherUser) {
                calculateForUser(
                    data,
                    otherUser,
                    methodInput.value
                ).ranking
                    .slice(0, k)
                    .forEach(function (entry) {
                        catalog.add(entry.item);
                    });
            });

            return {
                data: data,
                user: user,
                k: k,
                scores: result.scores,
                ranking: result.ranking,
                top: top,
                relevant: relevant,
                precision: precision,
                recall: recall,
                diversity: diversity,
                coverage: catalog.size / data.items.length
            };
        }

        function prepareCanvas() {
            const width = Math.max(
                290,
                canvas.clientWidth || 720
            );

            const height = width < 560 ? 470 : 465;
            const ratio = window.devicePixelRatio || 1;

            canvas.style.height = height + "px";
            canvas.width = Math.round(width * ratio);
            canvas.height = Math.round(height * ratio);

            const context = canvas.getContext("2d");

            context.setTransform(
                ratio,
                0,
                0,
                ratio,
                0,
                0
            );

            return {
                context: context,
                width: width,
                height: height
            };
        }

        function drawRounded(context, x, y, width, height, radius) {
            const r = Math.min(
                radius,
                width / 2,
                height / 2
            );

            context.beginPath();
            context.moveTo(x + r, y);
            context.arcTo(
                x + width,
                y,
                x + width,
                y + height,
                r
            );
            context.arcTo(
                x + width,
                y + height,
                x,
                y + height,
                r
            );
            context.arcTo(
                x,
                y + height,
                x,
                y,
                r
            );
            context.arcTo(
                x,
                y,
                x + width,
                y,
                r
            );
            context.closePath();
        }

        function draw() {
            const result = calculate();
            const prepared = prepareCanvas();
            const context = prepared.context;
            const width = prepared.width;
            const height = prepared.height;
            const mobile = width < 560;

            context.fillStyle = "#061426";
            context.fillRect(0, 0, width, height);

            const matrixX = 34;
            const matrixY = 70;
            const matrixWidth = mobile
                ? width - 68
                : Math.min(390, width * 0.53);

            const cellWidth =
                matrixWidth / result.data.items.length;

            const cellHeight = mobile ? 34 : 48;

            context.fillStyle = "#7dd3fc";
            context.font = "800 12px Arial";
            context.fillText(
                "USER–ITEM INTERACTIONS",
                matrixX,
                30
            );

            result.data.items.forEach(function (name, item) {
                context.save();
                context.translate(
                    matrixX +
                        item * cellWidth +
                        cellWidth / 2,
                    matrixY - 8
                );
                context.rotate(-0.45);
                context.fillStyle = "#9fc3df";
                context.font = "700 10px Arial";
                context.textAlign = "center";
                context.fillText(name.slice(0, 8), 0, 0);
                context.restore();
            });

            result.data.ratings.forEach(function (row, user) {
                row.forEach(function (rating, item) {
                    const x =
                        matrixX +
                        item * cellWidth +
                        2;

                    const y =
                        matrixY +
                        user * cellHeight +
                        2;

                    drawRounded(
                        context,
                        x,
                        y,
                        cellWidth - 4,
                        cellHeight - 4,
                        7
                    );

                    if (rating === null) {
                        context.fillStyle =
                            user === result.user &&
                            step >= 2
                                ? "rgba(250,204,21,.13)"
                                : "#0b2038";
                    } else {
                        context.fillStyle =
                            "rgba(34,211,238," +
                            (0.16 + rating * 0.12) +
                            ")";
                    }

                    context.fill();

                    context.strokeStyle =
                        user === result.user
                            ? "#facc15"
                            : "#294967";

                    context.lineWidth =
                        user === result.user
                            ? 1.6
                            : 1;

                    context.stroke();

                    context.fillStyle =
                        rating === null
                            ? "#5d7790"
                            : "#f8fafc";

                    context.font = "800 11px Arial";
                    context.textAlign = "center";

                    context.fillText(
                        rating === null ? "·" : String(rating),
                        x + (cellWidth - 4) / 2,
                        y + cellHeight / 2 + 2
                    );
                });

                context.fillStyle =
                    user === result.user
                        ? "#fde047"
                        : "#93c5fd";

                context.textAlign = "right";

                context.fillText(
                    String.fromCharCode(65 + user),
                    matrixX - 8,
                    matrixY +
                        user * cellHeight +
                        cellHeight / 2 +
                        4
                );
            });

            context.textAlign = "left";

            const rankX = mobile
                ? 34
                : matrixX + matrixWidth + 40;

            const rankY = mobile
                ? matrixY +
                  result.data.ratings.length * cellHeight +
                  55
                : 70;

            const rankWidth = mobile
                ? width - 68
                : width - rankX - 30;

            context.fillStyle = "#7dd3fc";
            context.font = "800 12px Arial";

            context.fillText(
                "PERSONALIZED CANDIDATE RANKING",
                rankX,
                rankY - 25
            );

            const maximum = Math.max.apply(
                null,
                result.ranking
                    .map(function (entry) {
                        return entry.score;
                    })
                    .concat([1])
            );

            result.ranking
                .slice(0, 4)
                .forEach(function (entry, index) {
                    const selected =
                        index < result.k &&
                        step >= 6;

                    const y = rankY + index * 62;

                    drawRounded(
                        context,
                        rankX,
                        y,
                        rankWidth,
                        46,
                        9
                    );

                    context.fillStyle = selected
                        ? "rgba(250,204,21,.12)"
                        : "#0b2038";

                    context.fill();

                    context.strokeStyle = selected
                        ? "#facc15"
                        : "#294967";

                    context.stroke();

                    const barWidth = Math.max(
                        8,
                        (rankWidth - 118) *
                            entry.score /
                            maximum
                    );

                    drawRounded(
                        context,
                        rankX + 80,
                        y + 16,
                        barWidth,
                        12,
                        6
                    );

                    context.fillStyle =
                        step >= 4
                            ? "#22d3ee"
                            : "#27455f";

                    context.fill();

                    context.fillStyle = "#f8fafc";
                    context.font = "800 12px Arial";

                    context.fillText(
                        "#" +
                            (index + 1) +
                            " " +
                            result.data.items[entry.item],
                        rankX + 10,
                        y + 29
                    );

                    context.fillStyle =
                        step >= 4
                            ? "#fde047"
                            : "#668099";

                    context.textAlign = "right";

                    context.fillText(
                        step >= 4
                            ? fixed(entry.score, 2)
                            : "?",
                        rankX + rankWidth - 10,
                        y + 29
                    );

                    context.textAlign = "left";
                });

            context.fillStyle = "#91a9c0";
            context.font = "600 11px Arial";

            context.fillText(
                "Yellow row = target user • empty cells = unseen candidates",
                34,
                height - 18
            );
        }

        function stop() {
            if (timer !== null) {
                window.clearInterval(timer);
            }

            timer = null;
            pauseButton.disabled = true;
        }

        function render() {
            const result = calculate();
            const atEnd = step >= phases.length;

            const methodNames = {
                popularity: "popularity",
                content: "content similarity",
                user: "user-neighbour",
                item: "item-neighbour",
                hybrid: "hybrid"
            };

            const messages = [
                [
                    "Historical interaction evidence is ready.",
                    "Filled cells are observed ratings; empty cells are candidate opportunities, not confirmed dislikes.",
                    "Which unseen item best matches the target user’s established pattern?"
                ],
                [
                    "The target user’s interaction row is highlighted.",
                    "Inspect both strong and weak preferences before building candidates.",
                    "Which observations are reliable preference evidence?"
                ],
                [
                    "Seen and ineligible items have been removed.",
                    result.ranking.length +
                        " unseen items remain eligible for scoring.",
                    "Would a popularity fallback or personalization be safer for this user?"
                ],
                [
                    "Preference evidence has been constructed.",
                    "The selected method uses " +
                        methodNames[methodInput.value] +
                        " evidence from available users, items and features.",
                    "Predict the highest score before revealing the ranking."
                ],
                [
                    "Every candidate now has a comparable score.",
                    "The bars expose relative evidence; their values are not calibrated satisfaction probabilities.",
                    "Check whether the strongest candidate is novel or only popular."
                ],
                [
                    "Candidates are ordered from strongest to weakest evidence.",
                    "Ranking matters because users rarely inspect the whole candidate set.",
                    "Choose K using the available screen space and decision goal."
                ],
                [
                    "The Top-" +
                        result.k +
                        " operating list is selected.",
                    "Yellow outlines show the items that receive exposure.",
                    "Inspect relevance, catalog coverage and within-list diversity together."
                ],
                [
                    "Ranking evaluation is complete.",
                    "Change the user, method or K and explain why the list and metrics change.",
                    "Which method remains useful for a new user or a new item?"
                ]
            ];

            const message =
                messages[Math.min(step, messages.length - 1)];

            get("recommendationKValue").textContent =
                "Top " + result.k;

            get("recommendationPhase").textContent =
                step === 0
                    ? "Ready"
                    : phases[
                          Math.min(
                              step - 1,
                              phases.length - 1
                          )
                      ];

            get("recommendationPrecision").textContent =
                step >= 7
                    ? fixed(result.precision, 2)
                    : "—";

            get("recommendationRecall").textContent =
                step >= 7
                    ? fixed(result.recall, 2)
                    : "—";

            get("recommendationCoverage").textContent =
                step >= 7
                    ? Math.round(result.coverage * 100) + "%"
                    : "—";

            get("recommendationDiversity").textContent =
                step >= 7
                    ? fixed(result.diversity, 2)
                    : "—";

            get("recommendationVerdict").textContent =
                message[0];

            get("recommendationExplanation").textContent =
                message[1];

            get("recommendationNextCheck").textContent =
                message[2];

            get("recommendationRanking").innerHTML =
                step >= 4
                    ? result.ranking
                          .slice(0, 5)
                          .map(function (entry, index) {
                              const selected =
                                  step >= 6 &&
                                  index < result.k;

                              return (
                                  '<article class="' +
                                  (selected
                                      ? "is-alert"
                                      :"") +
                                  '">' +
                                  "<b>#" +
                                  (index + 1) +
                                  "</b>" +
                                  '<i><span style="width:' +
                                  clamp(
                                      Math.round(
                                          entry.score /
                                              5 *
                                              100
                                      ),
                                      4,
                                      100
                                  ) +
                                  '%"></span></i>' +
                                  "<strong>" +
                                  escapeHtml(
                                      result.data.items[
                                          entry.item
                                      ]
                                  ) +
                                  "</strong>" +
                                  "</article>"
                              );
                          })
                          .join("")
                    : '<article><b>RANK</b><i><span style="width:0"></span></i><strong>Waiting</strong></article>';

            nextButton.textContent = atEnd
                ? "Ranking Complete"
                : step === 0
                    ? "Inspect Interactions"
                    : "Next: " + phases[step];

            nextButton.disabled = atEnd;
            autoButton.disabled =
                atEnd || timer !== null;

            pauseButton.disabled = timer === null;

            if (atEnd) stop();
            draw();
        }

        function advance() {
            if (step < phases.length) {
                step += 1;
            }

            render();
        }

        function reset() {
            stop();
            step = 0;
            render();
        }

        nextButton.addEventListener("click", advance);

        autoButton.addEventListener("click", function () {
            if (
                step >= phases.length ||
                timer !== null
            ) {
                return;
            }

            timer = window.setInterval(
                advance,
                850
            );

            render();
        });

        pauseButton.addEventListener("click", function () {
            stop();
            render();
        });

        resetButton.addEventListener("click",click", reset);

        [
            domainInput,
            userInput,
            methodInput,
            kInput
        ].forEach(function (input) {
            input.addEventListener("input", reset);
            input.addEventListener("change", reset);
        });

        window.addEventListener("resize", draw);

        render();
        window.requestAnimationFrame(draw);
    }

    function initFactorLab() {
        const canvas = get("factorCanvas");

        if (!canvas || canvas.dataset.cbActive) return;
        canvas.dataset.cbActive = "true";

        const datasets = {
            balanced: {
                users: 4,
                items: 5,
                ratings: [
                    [0, 0, 5],
                    [0, 1, 4],
                    [0, 3, 1],
                    [1, 0, 4],
                    [1, 2, 5],
                    [1, 4, 2],
                    [2, 1, 1],
                    [2, 3, 5],
                    [2, 4, 4],
                    [3, 0, 2],
                    [3, 2, 4],
                    [3, 3, 5]
                ]
            },

            sparse: {
                users: 4,
                items: 5,
                ratings: [
                    [0, 0, 5],
                    [0, 3, 2],
                    [1, 1, 4],
                    [1, 4, 1],
                    [2, 2, 5],
                    [2, 3, 4],
                    [3, 0, 2],
                    [3, 4, 5]
                ]
            },

            biased: {
                users: 4,
                items: 5,
                ratings: [
                    [0, 0, 5],
                    [0, 1, 5],
                    [0, 2, 4],
                    [1, 0, 2],
                    [1, 3, 1],
                    [1, 4, 2],
                    [2, 1, 4],
                    [2, 2, 5],
                    [2, 4, 4],
                    [3, 0, 1],
                    [3, 3, 5],
                    [3, 4, 4]
                ]
            }
        };

        const datasetInput = get("factorDataset");
        const factorInput = get("factorCount");
        const rateInput = get("factorRate");
        const nextButton = get("factorNext");
        const autoButton = get("factorAuto");
        const pauseButton = get("factorPause");
        const resetButton = get("factorReset");

        let state;
        let timer = null;

        function initialize() {
            const data =
                datasets[datasetInput.value] ||
                datasets.balanced;

            const factors = Number(factorInput.value);

            const random = seededRandom(
                1600 +
                    datasetInput.selectedIndex * 97 +
                    factors * 13
            );

            const users = Array.from(
                { length: data.users },
                function () {
                    return Array.from(
                        { length: factors },
                        function () {
                            return 0.15 + random() * 0.55;
                        }
                    );
                }
            );

            const items = Array.from(
                { length: data.items },
                function () {
                    return Array.from(
                        { length: factors },
                        function () {
                            return 0.15 + random() * 0.55;
                        }
                    );
                }
            );

            state = {
                data: data,
                factors: factors,
                users: users,
                items: items,
                update: 0,
                epoch: 0,
                maxUpdates: data.ratings.length * 6,
                error: null,
                current: null,
                history: []
            };
        }

        function predict(user, item) {
            let value = 0;

            for (
                let factor = 0;
                factor < state.factors;
                factor += 1
            ) {
                value +=
                    state.users[user][factor] *
                    state.items[item][factor];
            }

            return value;
        }

        function rmse() {
            const squared =
                state.data.ratings.reduce(function (sum, row) {
                    const error =
                        row[2] -
                        predict(row[0], row[1]);

                    return sum + error * error;
                }, 0);

            return Math.sqrt(
                squared /
                    state.data.ratings.length
            );
        }

        function trainOne() {
            if (state.update >= state.maxUpdates) return;

            const rowIndex =
                state.update %
                state.data.ratings.length;

            const row =
                state.data.ratings[rowIndex];

            const user = row[0];
            const item = row[1];
            const actual = row[2];
            const before = predict(user, item);
            const error = actual - before;
            const learningRate = Number(rateInput.value);
            const regularization = 0.025;

            for (
                let factor = 0;
                factor < state.factors;
                factor += 1
            ) {
                const oldUser =
                    state.users[user][factor];

                const oldItem =
                    state.items[item][factor];

                state.users[user][factor] +=
                    learningRate *
                    (
                        error * oldItem -
                        regularization * oldUser
                    );

                state.items[item][factor] +=
                    learningRate *
                    (
                        error * oldUser -
                        regularization * oldItem
                    );
            }

            state.update += 1;

            state.epoch =
                Math.floor(
                    (state.update - 1) /
                        state.data.ratings.length
                ) + 1;

            state.error = error;

            state.current = {
                user: user,
                item: item,
                actual: actual,
                before: before,
                after: predict(user, item)
            };

            if (
                state.update %
                    state.data.ratings.length ===
                    0 ||
                state.update === 1
            ) {
                state.history.push({
                    update: state.update,
                    rmse: rmse()
                });
            }
        }

        function prepareCanvas() {
            const width = Math.max(
                290,
                canvas.clientWidth || 720
            );

            const height = width < 560 ? 510 : 465;
            const ratio = window.devicePixelRatio || 1;

            canvas.style.height = height + "px";
            canvas.width = Math.round(width * ratio);
            canvas.height = Math.round(height * ratio);

            const context = canvas.getContext("2d");

            context.setTransform(
                ratio,
                0,
                0,
                ratio,
                0,
                0
            );

            return {
                context: context,
                width: width,
                height: height
            };
        }

        function drawMatrix(
            context,
            values,
            x,
            y,
            width,
            title,
            observedOnly
        ) {
            const rows = state.data.users;
            const columns = state.data.items;
            const cellWidth = width / columns;
            const cellHeight = 34;

            context.fillStyle = "#7dd3fc";
            context.font = "800 11px Arial";
            context.fillText(title, x, y - 12);

            for (
                let user = 0;
                user < rows;
                user += 1
            ) {
                for (
                    let item = 0;
                    item < columns;
                    item += 1
                ) {
                    const left =
                        x + item * cellWidth;

                    const top =
                        y + user * cellHeight;

                    const observed =
                        state.data.ratings.find(
                            function (row) {
                                return (
                                    row[0] === user &&
                                    row[1] === item
                                );
                            }
                        );

                    const value = observedOnly
                        ? observed
                            ? observed[2]
                            : null
                        : values[user][item];

                    context.fillStyle =
                        value === null
                            ? "#0b2038"
                            : "rgba(34,211,238," +
                              clamp(
                                  0.12 +
                                      Number(value) *
                                          0.12,
                                  0.12,
                                  0.72
                              ) +
                              ")";

                    context.fillRect(
                        left + 2,
                        top + 2,
                        cellWidth - 4,
                        cellHeight - 4
                    );

                    context.strokeStyle =
                        state.current &&
                        state.current.user === user &&
                        state.current.item === item
                            ? "#facc15"
                            : "#294967";

                    context.lineWidth =
                        state.current &&
                        state.current.user === user &&
                        state.current.item === item
                            ? 2
                            : 1;

                    context.strokeRect(
                        left + 2,
                        top + 2,
                        cellWidth - 4,
                        cellHeight - 4
                    );

                    context.fillStyle =
                        value === null
                            ? "#58728b"
                            : "#f8fafc";

                    context.font = "800 10px Arial";
                    context.textAlign = "center";

                    context.fillText(
                        value === null
                            ? "·"
                            : fixed(
                                  value,
                                  observedOnly ? 0 : 1
                              ),
                        left + cellWidth / 2,
                        top + 22
                    );
                }
            }

            context.textAlign = "left";
        }

        function draw() {
            const prepared = prepareCanvas();
            const context = prepared.context;
            const width = prepared.width;
            const height = prepared.height;
            const mobile = width < 560;

            context.fillStyle = "#061426";
            context.fillRect(0, 0, width, height);

            const predictions = Array.from(
                { length: state.data.users },
                function (_, user) {
                    return Array.from(
                        { length: state.data.items },
                        function (_, item) {
                            return clamp(
                                predict(user, item),
                                0,
                                5
                            );
                        }
                    );
                }
            );

            if (mobile) {
                drawMatrix(
                    context,
                    predictions,
                    28,
                    58,
                    width - 56,
                    "OBSERVED RATINGS",
                    true
                );

                drawMatrix(
                    context,
                    predictions,
                    28,
                    250,
                    width - 56,
                    "CURRENT PREDICTIONS",
                    false
                );
            } else {
                const matrixWidth =
                    (width - 84) / 2;

                drawMatrix(
                    context,
                    predictions,
                    28,
                    68,
                    matrixWidth,
                    "OBSERVED RATINGS",
                    true
                );

                drawMatrix(
                    context,
                    predictions,
                    56 + matrixWidth,
                    68,
                    matrixWidth,
                    "CURRENT PREDICTIONS",
                    false
                );
            }

            const chartX = 40;
            const chartY = mobile ? 430 : 300;
            const chartWidth = width - 80;
            const chartHeight = mobile ? 55 : 115;

            context.strokeStyle = "#294967";
            context.lineWidth = 1;

            for (let line = 0; line <= 4; line += 1) {
                const y =
                    chartY +
                    chartHeight * line / 4;

                context.beginPath();
                context.moveTo(chartX, y);
                context.lineTo(
                    chartX + chartWidth,
                    y
                );
                context.stroke();
            }

            context.fillStyle = "#7dd3fc";
            context.font = "800 11px Arial";

            context.fillText(
                "TRAINING RMSE",
                chartX,
                chartY - 12
            );

            if (state.history.length) {
                const maximum = Math.max.apply(
                    null,
                    state.history
                        .map(function (entry) {
                            return entry.rmse;
                        })
                        .concat([1])
                );

                context.strokeStyle = "#facc15";
                context.lineWidth = 3;
                context.beginPath();

                state.history.forEach(
                    function (entry, index) {
                        const x =
                            chartX +
                            (
                                state.history.length === 1
                                    ? 0
                                    : index /
                                      (
                                          state.history.length -
                                          1
                                      ) *
                                      chartWidth
                            );

                        const y =
                            chartY +
                            chartHeight -
                            entry.rmse /
                                maximum *
                                chartHeight;

                        if (index === 0) {
                            context.moveTo(x, y);
                        } else {
                            context.lineTo(x, y);
                        }
                    }
                );

                context.stroke();
            } else {
                context.fillStyle = "#91a9c0";

                context.fillText(
                    "Run an SGD update to begin the loss curve.",
                    chartX,
                    chartY + 31
                );
            }
        }

        function stop() {
            if (timer !== null) {
                window.clearInterval(timer);
            }

            timer = null;
            pauseButton.disabled = true;
        }

        function render() {
            const complete =
                state.update >= state.maxUpdates;

            const current = state.current;
            const currentRmse = rmse();

            get("factorEpoch").textContent =
                state.epoch + " / 6";

            get("factorUpdate").textContent =
                state.update +
                " / " +
                state.maxUpdates;

            get("factorRmse").textContent =
                fixed(currentRmse, 3);

            get("factorError").textContent =
                current
                    ? fixed(
                          current.actual -
                              current.before,
                          3
                      )
                    : "—";

            get("factorVerdict").textContent =
                !current
                    ? "The factors are initialized but have not learned."
                    : complete
                        ? "Training completed after six passes through observed ratings."
                        : "Updated User " +
                          String.fromCharCode(
                              65 + current.user
                          ) +
                          " and Item " +
                          (current.item + 1) +
                          ".";

            get("factorExplanation").textContent =
                !current
                    ? "Press the first update to predict an observed rating and apply its gradient."
                    : "Observed " +
                      current.actual +
                      ", predicted " +
                      fixed(current.before, 3) +
                      ", residual " +
                      fixed(
                          current.actual -
                              current.before,
                          3
                      ) +
                      ", new pair prediction " +
                      fixed(current.after, 3) +
                      ".";

            get("factorNextCheck").textContent =
                complete
                    ? "Compare another factor count and explain the bias–variance trade-off."
                    : current
                        ? "Predict how the next observed pair will move its dot-product score."
                        : "Predict whether the first correction will increase or decrease the dot product.";

            get("factorHistory").innerHTML =
                state.history.length
                    ? state.history
                          .slice(-5)
                          .map(function (entry) {
                              return (
                                  "<article>" +
                                  "Update " +
                                  entry.update +
                                  " • RMSE " +
                                  fixed(entry.rmse, 3) +
                                  "</article>"
                              );
                          })
                          .join("")
                    : "<article>Waiting for the first observed rating.</article>";

            nextButton.textContent = complete
                ? "Training Complete"
                : state.update === 0
                    ? "Run First SGD Update"
                    : "Run Next SGD Update";

            nextButton.disabled = complete;

            autoButton.disabled =
                complete || timer !== null;

            pauseButton.disabled =
                timer === null;

            if (complete) stop();

            draw();
        }

        function advance() {
            if (state.update < state.maxUpdates) {
                trainOne();
            }

            render();
        }

        function reset() {
            stop();
            initialize();
            render();
        }

        nextButton.addEventListener("click", advance);

        autoButton.addEventListener("click", function () {
            if (
                state.update >= state.maxUpdates ||
                timer !== null
            ) {
                return;
            }

            timer = window.setInterval(
                advance,
                230
            );

            render();
        });

        pauseButton.addEventListener("click", function () {
            stop();
            render();
        });

        resetButton.addEventListener("click", reset);

        [
            datasetInput,
            factorInput,
            rateInput
        ].forEach(function (input) {
            input.addEventListener("change", reset);
        });

        window.addEventListener("resize", draw);

        initialize();
        render();
        window.requestAnimationFrame(draw);
    }

    function initTracer() {
        const codeContainer = get("tracerCode");
        const toggle = get("tracerPanelToggle");
        const panel = get("tracerPanel");

        if (
            !codeContainer ||
            !toggle ||
            !panel ||
            codeContainer.dataset.cbActive
        ) {
            return;
        }

        codeContainer.dataset.cbActive = "true";

        const lines = [
            "ratings = [(0, 0, 5), (0, 1, 3)]",
            "p = [0.4, 0.2]",
            "q = [[0.3, 0.5], [0.6, 0.1]]",
            "lr, reg = 0.05, 0.02",
            "for u, i, actual in ratings:",
            "    pred = 0",
            "    for f in range(2):",
            "        pred += p[f] * q[i][f]",
            "    error = actual - pred",
            "    for f in range(2):",
            "        old_p = p[f]",
            "        p[f] += lr * (error * q[i][f] - reg * p[f])",
            "        q[i][f] += lr * (error * old_p - reg * q[i][f])",
            "print([round(value, 3) for value in p])"
        ];

        function clone(value) {
            return JSON.parse(JSON.stringify(value));
        }

        function buildStates() {
            const states = [];
            const ratings = [
                [0, 0, 5],
                [0, 1, 3]
            ];

            const p = [0.4, 0.2];

            const q = [
                [0.3, 0.5],
                [0.6, 0.1]
            ];

            const lr = 0.05;
            const reg = 0.02;

            function add(
                line,
                explanation,
                variables,
                expression,
                output
            ) {
                states.push({
                    line: line,
                    explanation: explanation,
                    variables: clone(variables || {}),
                    expression: expression || "—",
                    output: output || ""
                });
            }

            add(
                0,
                "Create two observed user–item ratings.",
                { ratings: ratings },
                "2 observed pairs"
            );

            add(
                1,
                "Initialize the user’s two latent factors.",
                { p: p },
                "p = [0.4, 0.2]"
            );

            add(
                2,
                "Initialize two item-factor vectors.",
                { q: q },
                "q has 2 item rows"
            );

            add(
                3,
                "Set the learning rate and regularization strength.",
                {
                    lr: lr,
                    reg: reg
                },
                "lr = 0.05, reg = 0.02"
            );

            ratings.forEach(function (rating) {
                const u = rating[0];
                const i = rating[1];
                const actual = rating[2];

                add(
                    4,
                    "Enter the observed-rating loop for user " +
                        u +
                        ", item " +
                        i +
                        ".",
                    {
                        u: u,
                        i: i,
                        actual: actual,
                        p: p,
                        q_i: q[i]
                    },
                    "actual = " + actual
                );

                let pred = 0;

                add(
                    5,
                    "Reset the dot-product prediction for this pair.",
                    {
                        u: u,
                        i: i,
                        pred: pred
                    },
                    "pred = 0"
                );

                for (let f = 0; f < 2; f += 1) {
                    add(
                        6,
                        "Enter the prediction factor loop with f = " +
                            f +
                            ".",
                        {
                            u: u,
                            i: i,
                            f: f,
                            pred: pred
                        },
                        "range(2) gives " + f
                    );

                    const product =
                        p[f] * q[i][f];

                    pred += product;

                    add(
                        7,
                        "Multiply matching user and item factors, then add the product.",
                        {
                            f: f,
                            p_f: p[f],
                            q_f: q[i][f],
                            product: product,
                            pred: pred
                        },
                        fixed(p[f], 4) +
                            " × " +
                            fixed(q[i][f], 4) +
                            " → pred " +
                            fixed(pred, 4)
                    );
                }

                const error = actual - pred;

                add(
                    8,
                    "Calculate the residual between observed and predicted preference.",
                    {
                        actual: actual,
                        pred: pred,
                        error: error
                    },
                    actual +
                        " - " +
                        fixed(pred, 4) +
                        " = " +
                        fixed(error, 4)
                );

                for (let f = 0; f < 2; f += 1) {
                    add(
                        9,
                        "Enter the update factor loop with f = " +
                            f +
                            ".",
                        {
                            f: f,
                            error: error,
                            p: p,
                            q_i: q[i]
                        },
                        "update factor " + f
                    );

                    const oldP = p[f];
                    const oldQ = q[i][f];

                    add(
                        10,
                        "Save the user factor before changing it.",
                        {
                            f: f,
                            old_p: oldP,
                            old_q: oldQ
                        },
                        "old_p = " + fixed(oldP, 4)
                    );

                    const userChange =
                        lr *
                        (
                            error * oldQ -
                            reg * oldP
                        );

                    p[f] += userChange;

                    add(
                        11,
                        "Apply the regularized user-factor gradient.",
                        {
                            f: f,
                            user_change: userChange,
                            p: p
                        },
                        fixed(oldP, 4) +
                            " + " +
                            fixed(userChange, 4) +
                            " = " +
                            fixed(p[f], 4)
                    );

                    const itemChange =
                        lr *
                        (
                            error * oldP -
                            reg * oldQ
                        );

                    q[i][f] += itemChange;

                    add(
                        12,
                        "Apply the item-factor gradient using the saved user value.",
                        {
                            f: f,
                            item_change: itemChange,
                            q_i: q[i]
                        },
                        fixed(oldQ, 4) +
                            " + " +
                            fixed(itemChange, 4) +
                            " = " +
                            fixed(q[i][f], 4)
                    );
                }
            });

            add(
                13,
                "Print the learned user factors after both observed ratings.",
                {
                    p: p,
                    q: q
                },
                "round each p value to 3 decimals",
                JSON.stringify(
                    p.map(function (value) {
                        return Number(
                            fixed(value, 3)
                        );
                    })
                )
            );

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

        codeContainer.innerHTML = lines
            .map(function (line, index) {
                return (
                    '<div class="aiml-code-line" data-line="' +
                    index +
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

        function formatValue(value) {
            if (value === null) return "None";

            if (typeof value === "number") {
                return Number.isInteger(value)
                    ? String(value)
                    : fixed(value, 4);
            }

            return JSON.stringify(
                value,
                function (_, item) {
                    return typeof item === "number"
                        ? Number(fixed(item, 4))
                        : item;
                }
            );
        }

        function render() {
            const atStart = step === 0;
            const atEnd = step >= states.length;

            const current = atStart
                ? null
                : states[step - 1];

            codeContainer
                .querySelectorAll(".aiml-code-line")
                .forEach(function (line, index) {
                    line.classList.toggle(
                        "is-active",
                        !!current &&
                            index === current.line
                    );

                    line.classList.toggle(
                        "is-complete",
                        !!current &&
                            index < current.line
                    );
                });

            if (current) {
                const activeLine =
                    codeContainer.querySelector(
                        '[data-line="' +
                            current.line +
                            '"]'
                    );

                if (activeLine) {
                    activeLine.scrollIntoView({
                        block: "nearest"
                    });
                }
            }

            get("tracerStatus").textContent =
                atStart
                    ? "Ready"
                    : atEnd
                        ? "Complete"
                        : "Running";

            get("tracerExplanation").textContent =
                current
                    ? current.explanation
                    : "Press Next to evaluate the first statement.";

            get("tracerExpression").textContent =
                current
                    ? current.expression
                    : "—";

            get("tracerOutput").textContent =
                current && current.output
                    ? current.output
                    : "Waiting for print(...)";

            const variables =
                current ? current.variables : {};

            get("tracerVariables").innerHTML =
                Object.keys(variables).length
                    ? Object.keys(variables)
                          .map(function (key) {
                              return (
                                  '<article class="aiml-variable">' +
                                  "<span>" +
                                  escapeHtml(key) +
                                  "</span>" +
                                  "<code>" +
                                  escapeHtml(
                                      formatValue(
                                          variables[key]
                                      )
                                  ) +
                                  "</code>" +
                                  "</article>"
                              );
                          })
                          .join("")
                    : '<article class="aiml-variable"><span>STATE</span><code>Not started</code></article>';

            previous.disabled = atStart;
            next.disabled = atEnd;
            auto.disabled =
                atEnd || timer !== null;

            pause.disabled =
                timer === null;

            get("tracerProgress").textContent =
                "Step " +
                step +
                " of " +
                states.length;

            if (atEnd) stop();
        }

        function advance() {
            if (step < states.length) {
                step += 1;
            }

            render();
        }

        toggle.addEventListener("click", function () {
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
        });

        previous.addEventListener("click", function () {
            stop();
            step = Math.max(0, step - 1);
            render();
        });

        next.addEventListener("click", advance);

        auto.addEventListener("click", function () {
            if (
                step >= states.length ||
                timer !== null
            ) {
                return;
            }

            timer = window.setInterval(
                advance,
                650
            );

            render();
        });

        pause.addEventListener("click", function () {
            stop();
            render();
        });

        reset.addEventListener("click", function () {
            stop();
            step = 0;
            render();
        });

        render();
    }

    function initProblems() {
        const list = get("problemList");

        if (!list || list.dataset.cbActive) return;
        list.dataset.cbActive = "true";

        const problems = [
            {
                title: "Calculate Cosine Similarity",
                description: "Calculate similarity between a user profile and one item vector.",
                sampleInput: "user=[1,2,1], item=[2,1,1]",
                expected: "0.833",
                hint: "Calculate dot product and both Euclidean norms.",
                starter: "user = [1, 2, 1]\nitem = [2, 1, 1]\n# Calculate cosine similarity\n",
                solution: "user = [1, 2, 1]\nitem = [2, 1, 1]\ndot = sum(a * b for a, b in zip(user, item))\nnorm_user = sum(value ** 2 for value in user) ** 0.5\nnorm_item = sum(value ** 2 for value in item) ** 0.5\nsimilarity = dot / (norm_user * norm_item)\nprint(round(similarity, 3))",
                required: [
                    ["zip("],
                    ["sum("],
                    ["** 2", "**2"],
                    ["dot"],
                    ["norm"],
                    ["print("]
                ]
            },
            {
                title: "Build a Content-Based Ranking",
                description: "Rank unseen items by similarity to a user profile.",
                sampleInput: "profile=[1,0], items=[[1,0],[0.8,0.2],[0,1]]",
                expected: "[0,1,2]",
                hint: "Calculate one similarity per item, then sort indexes by score descending.",
                starter: "profile = [1, 0]\nitems = [[1, 0], [0.8, 0.2], [0, 1]]\n# Rank item indexes by cosine similarity\n",
                solution: "profile = [1, 0]\nitems = [[1, 0], [0.8, 0.2], [0, 1]]\nscores = []\nfor item in items:\n    dot = sum(a * b for a, b in zip(profile, item))\n    norm_p = sum(a ** 2 for a in profile) ** 0.5\n    norm_i = sum(b ** 2 for b in item) ** 0.5\n    scores.append(dot / (norm_p * norm_i))\nranking = sorted(range(len(items)), key=lambda i: scores[i], reverse=True)\nprint(ranking)",
                required: [
                    ["for item in items"],
                    ["zip("],
                    ["scores.append"],
                    ["sorted("],
                    ["key="],
                    ["reverse=true"],
                    ["print("]
                ]
            },
            {
                title: "Predict with User Neighbours",
                description: "Calculate a similarity-weighted rating from three neighbours.",
                sampleInput: "sim=[0.9,0.6,0.2], ratings=[5,4,1]",
                expected: "4.294",
                hint: "Divide the weighted rating sum by the sum of similarities.",
                starter: "similarities = [0.9, 0.6, 0.2]\nratings = [5, 4, 1]\n# Calculate weighted collaborative prediction\n",
                solution: "similarities = [0.9, 0.6, 0.2]\nratings = [5, 4, 1]\nnumerator = sum(sim * rating for sim, rating in zip(similarities, ratings))\ndenominator = sum(similarities)\nprediction = numerator / denominator\nprint(round(prediction, 3))",
                required: [
                    ["zip("],
                    ["sum("],
                    ["numerator"],
                    ["denominator"],
                    ["prediction"],
                    ["print("]
                ]
            },
            {
                title: "Perform One Factor Update",
                description: "Update one user and item latent factor using an observed rating.",
                sampleInput: "p=0.4, q=0.3, actual=5, lr=0.05",
                expected: "updated p and q",
                hint: "Predict p*q, calculate error, save old p, then update both values.",
                starter: "p, q = 0.4, 0.3\nactual, lr, reg = 5, 0.05, 0.02\n# Perform one regularized SGD update\n",
                solution: "p, q = 0.4, 0.3\nactual, lr, reg = 5, 0.05, 0.02\nprediction = p * q\nerror = actual - prediction\nold_p = p\np += lr * (error * q - reg * p)\nq += lr * (error * old_p - reg * q)\nprint(round(p, 3), round(q, 3))",
                required: [
                    ["prediction"],
                    ["error"],
                    ["old_p"],
                    ["lr *", "lr*"],
                    ["reg"],
                    ["print("]
                ]
            },
            {
                title: "Evaluate Precision@K and Recall@K",
                description: "Compare a Top-K list with known relevant items.",
                sampleInput: "recommended=[4,2,7], relevant={2,7,9,10}",
                expected: "precision=0.667 recall=0.5",
                hint: "Count the intersection, then divide by K and by total relevant items.",
                starter: "recommended = [4, 2, 7]\nrelevant = {2, 7, 9, 10}\n# Calculate Precision@K and Recall@K\n",
                solution: "recommended = [4, 2, 7]\nrelevant = {2, 7, 9, 10}\nhits = sum(item in relevant for item in recommended)\nprecision = hits / len(recommended)\nrecall = hits / len(relevant)\nprint(round(precision, 3), round(recall, 3))",
                required: [
                    ["item in relevant"],
                    ["sum("],
                    ["len(recommended)"],
                    ["len(relevant)"],
                    ["precision"],
                    ["recall"],
                    ["print("]
                ]
            }
        ];

        let saved = {};

        try {
            saved = JSON.parse(
                window.localStorage.getItem(PROGRESS_KEY) ||
                "{}"
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
                        PROGRESS_KEY
                    ) || "{}"
                );
            } catch (error) {
                current = {};
            }

            current.solvedProblems =
                Array.from(solved);

            current.problemScores = scores;

            window.localStorage.setItem(
                PROGRESS_KEY,
                JSON.stringify(current)
            );
        }

        function updateSummary() {
            const total = Object.values(scores).reduce(
                function (sum, score) {
                    return sum + Number(score || 0);
                },
                0
            );

            get("problemSolvedCount").textContent =
                solved.size +
                " / " +
                problems.length;

            get("problemScore").textContent =
                total +
                " / " +
                problems.length * 100;

            get("problemProgressBar").style.width =
                solved.size /
                    problems.length *
                    100 +
                "%";
        }

        list.innerHTML = problems
            .map(function (problem, index) {
                const number = index + 1;

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
                    String(number).padStart(2, "0") +
                    "</span>" +
                    "<div>" +
                    "<h3>" +
                    number +
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
                    "<span><strong>Expected output:</strong> <code>" +
                    escapeHtml(problem.expected) +
                    "</code></span>" +
                    "</div>" +
                    '<div class="aiml-problem-actions">' +
                    '<button type="button" class="primary" data-action="workspace">💻 Solve It Yourself</button>' +
                    '<button type="button" class="hint" data-action="hint">Hint</button>' +
                    '<button type="button" data-action="solution">Show Program</button>' +
                    "</div>" +
                    '<div class="aiml-problem-reveal" data-panel="hint" hidden>' +
                    "<strong>Hint</strong>" +
                    "<p>" +
                    escapeHtml(problem.hint) +
                    "</p>" +
                    "</div>" +
                    '<div class="aiml-problem-reveal" data-panel="solution" hidden>' +
                    "<strong>Model program</strong>" +
                    "<pre><code>" +
                    escapeHtml(problem.solution) +
                    "</code></pre>" +
                    "</div>" +
                    '<div class="aiml-workspace" data-panel="workspace" hidden>' +
                    '<label for="problemCode' +
                    index +
                    '">Your Python code</label>' +
                    '<textarea id="problemCode' +
                    index +
                    '" spellcheck="false">' +
                    escapeHtml(problem.starter) +
                    "</textarea>" +
                    '<div class="aiml-workspace-row">' +
                    '<button type="button" data-action="check">Check Answer</button>' +
                    '<button type="button" data-action="reset">Reset</button>' +
                    '<span class="aiml-check-result" data-result>Write your solution, then check its structure.</span>' +
                    "</div>" +
                    "</div>" +
                    "</article>"
                );
            })
            .join("");

        function togglePanel(
            card,
            name,
            button,
            closedText,
            openText
        ) {
            const section = card.querySelector(
                '[data-panel="' + name + '"]'
            );

            if (!section) return;

            const opening = section.hidden;
            section.hidden = !opening;

            button.textContent = opening
                ? openText
                : closedText;
        }

        list.addEventListener("click", function (event) {
            const button = event.target.closest(
                "button[data-action]"
            );

            if (!button) return;

            const card = button.closest(
                ".aiml-problem-card"
            );

            const index = Number(
                card.dataset.problem
            );

            const problem = problems[index];
            const action = button.dataset.action;

            if (action === "workspace") {
                togglePanel(
                    card,
                    "workspace",
                    button,
                    "💻 Solve It Yourself",
                    "✕ Close Workspace"
                );
                return;
            }

            if (action === "hint") {
                togglePanel(
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

                togglePanel(
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
                card.querySelector("[data-result]");

            if (action === "reset") {
                textarea.value = problem.starter;
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
                        "Not complete yet. Recheck the required recommendation logic.";
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
                        ? "Logic recognized after viewing the model program. Score: 60/100."
                        : "Logic recognized — solved independently. Score: 100/100.";

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
            [
                "What is candidate retrieval designed to maximize?",
                [
                    "Recall of potentially useful items",
                    "Only prediction RMSE",
                    "The number of user features",
                    "The final page latency alone"
                ],
                0,
                "Candidate retrieval reduces the catalog while attempting to preserve most items that could be valuable."
            ],
            [
                "Why is an unobserved interaction not automatically negative?",
                [
                    "The item may never have been exposed",
                    "All users like every item",
                    "Ratings cannot be stored",
                    "Recommendation has no labels"
                ],
                0,
                "A user cannot interact with an item they did not see, and non-action can have several meanings."
            ],
            [
                "What does a content-based recommender compare?",
                [
                    "User profile and item features",
                    "Only global item counts",
                    "Two loss functions",
                    "Train and test file sizes"
                ],
                0,
                "Content-based systems construct profiles and item vectors in a shared feature space."
            ],
            [
                "When is item-based CF often more stable?",
                [
                    "When item relationships change more slowly than user activity",
                    "When no interactions exist",
                    "When every item is new",
                    "When features are never scaled"
                ],
                0,
                "Item-neighbour relationships can be cached and may change more slowly than user neighbourhoods."
            ],
            [
                "What does pᵤᵀqᵢ represent in matrix factorization?",
                [
                    "User–item interaction in latent space",
                    "Catalog coverage",
                    "A random threshold",
                    "Number of epochs"
                ],
                0,
                "The dot product combines the user and item latent-factor strengths into a prediction."
            ],
            [
                "Why add regularization to factorization?",
                [
                    "Limit factor growth and overfitting",
                    "Remove all missing entries",
                    "Guarantee fairness",
                    "Increase catalog size"
                ],
                0,
                "Regularization discourages extreme vectors that fit sparse observed interactions too closely."
            ],
            [
                "Which metric rewards relevant items more near the top?",
                [
                    "NDCG@K",
                    "Training loss only",
                    "MAE without ranking",
                    "Catalog size"
                ],
                0,
                "NDCG discounts gains at lower ranks and normalizes by the ideal ordering."
            ],
            [
                "What is a new-item cold-start solution?",
                [
                    "Use content metadata and controlled exposure",
                    "Delete the item",
                    "Assign random permanent factors",
                    "Treat missing feedback as dislike"
                ],
                0,
                "Content features can place a new item before collaborative interactions accumulate."
            ],
            [
                "Why diversify a recommendation list?",
                [
                    "Reduce redundancy and improve discovery",
                    "Make every score equal",
                    "Remove all popular items",
                    "Avoid evaluation"
                ],
                0,
                "A list of near-duplicates wastes positions even when each item has a high individual score."
            ],
            [
                "Why should recommendation tests use chronological splits?",
                [
                    "To simulate recommending future items from past evidence",
                    "To increase duplicate sessions",
                    "To expose test data during training",
                    "To make all users equally active"
                ],
                0,
                "Time-aware evaluation prevents later interactions from leaking into the training history."
            ]
        ];

        container.innerHTML = questions
            .map(function (item, questionIndex) {
                return (
                    '<article class="aiml-quiz-question" data-quiz-question="' +
                    questionIndex +
                    '">' +
                    "<strong>" +
                    (questionIndex + 1) +
                    ". " +
                    escapeHtml(item[0]) +
                    "</strong>" +
                    '<div class="aiml-quiz-options">' +
                    item[1]
                        .map(function (
                            option,
                            optionIndex
                        ) {
                            const id =
                                "quiz-sixteen-" +
                                questionIndex +
                                "-" +
                                optionIndex;

                            return (
                                '<label class="aiml-quiz-option" for="' +
                                id +
                                '">' +
                                '<input type="radio" id="' +
                                id +
                                '" name="quiz-sixteen-' +
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
                    '<div class="aiml-quiz-explanation" hidden></div>' +
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
                    .closest(".aiml-quiz-question")
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

        get("checkQuiz").addEventListener(
            "click",
            function () {
                let correct = 0;
                let answered = 0;

                questions.forEach(function (
                    item,
                    index
                ) {
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

                    options.forEach(function (
                        option,
                        optionIndex
                    ) {
                        option.classList.remove(
                            "is-correct",
                            "is-wrong"
                        );

                        if (optionIndex === item[2]) {
                            option.classList.add(
                                "is-correct"
                            );
                        }
                    });

                    if (selected) {
                        answered += 1;

                        if (
                            Number(selected.value) ===
                            item[2]
                        ) {
                            correct += 1;
                        } else {
                            options[
                                Number(selected.value)
                            ].classList.add("is-wrong");
                        }
                    }

                    explanation.hidden = false;

                    explanation.innerHTML =
                        "<strong>Your answer: " +
                        (
                            selected
                                ? escapeHtml(
                                      item[1][
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
                            item[1][item[2]]
                        ) +
                        "</strong><br>" +
                        escapeHtml(item[3]);
                });

                get("quizScore").textContent =
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

                get("resetQuiz").disabled = false;

                let progress = {};

                try {
                    progress = JSON.parse(
                        window.localStorage.getItem(
                            PROGRESS_KEY
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
                    PROGRESS_KEY,
                    JSON.stringify(progress)
                );
            }
        );

        get("resetQuiz").disabled = true;

        get("resetQuiz").addEventListener(
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
                    .forEach(function (explanation) {
                        explanation.hidden = true;
                        explanation.textContent = "";
                    });

                get("quizScore").textContent =
                    "Not checked yet";

                get("resetQuiz").disabled = true;
            }
        );
    }

    function initInterviews() {
        const container = get("interviewList");

        if (!container || container.dataset.cbActive) return;
        container.dataset.cbActive = "true";

        const questions = [
            [
                "What is a recommendation system?",
                "It is a decision system that retrieves, scores and ranks eligible items for a user and context, then learns from outcomes while respecting product constraints."
            ],
            [
                "Content-based versus collaborative filtering?",
                "Content methods match user profiles with item attributes and can serve new items. Collaborative methods use shared behaviour to discover relationships not explicitly present in metadata, but suffer from cold start."
            ],
            [
                "User-based versus item-based collaborative filtering?",
                "User-based CF aggregates preferences from similar users. Item-based CF recommends items similar to what the target user consumed and is often more stable and cacheable."
            ],
            [
                "How do you calculate a collaborative prediction?",
                "Select neighbours with sufficient overlap, calculate adjusted similarities, take a similarity-weighted preference aggregate and normalize by total absolute similarity."
            ],
            [
                "Explain matrix factorization.",
                "It learns low-dimensional user and item vectors so their dot product, optionally with global and bias terms, reconstructs observed preference while regularization limits overfitting."
            ],
            [
                "How is implicit feedback different from explicit ratings?",
                "An observed implicit action gives positive evidence with varying confidence, while an unobserved pair is not a confirmed dislike. Training often uses confidence weighting or sampled ranking objectives."
            ],
            [
                "What is BPR?",
                "Bayesian Personalized Ranking is a pairwise objective that increases the score of an observed positive item relative to a sampled unobserved item for the same user."
            ],
            [
                "How do you solve cold start?",
                "For new users use onboarding, context and segment popularity. For new items use metadata and controlled exploration. A hybrid system shifts toward collaborative evidence as interactions grow."
            ],
            [
                "Precision@K versus Recall@K?",
                "Precision@K measures the relevant fraction of the displayed K items. Recall@K measures how much of the user’s known relevant set appears within those K positions."
            ],
            [
                "Why use NDCG?",
                "NDCG supports graded relevance and discounts items at lower ranks, so it evaluates whether the strongest relevant items appear early in the list."
            ],
            [
                "How would you add diversity?",
                "Retrieve a high-recall candidate set, then re-rank using relevance minus similarity to already-selected items, with category, creator, freshness and fairness constraints."
            ],
            [
                "How should a recommender be evaluated online?",
                "Use controlled experiments with guardrails such as click-through rate, conversion, retention, diversity, latency, complaints and long-term satisfaction."
            ]
        ];

        container.innerHTML = questions
            .map(function (question, index) {
                return (
                    '<article class="aiml-interview-item">' +
                    '<button type="button" class="aiml-interview-question" aria-expanded="false">' +
                    '<span class="aiml-interview-number">' +
                    (index + 1) +
                    ".</span>" +
                    "<strong>" +
                    escapeHtml(question[0]) +
                    "</strong>" +
                    '<span class="aiml-interview-toggle">+</span>' +
                    "</button>" +
                    '<div class="aiml-interview-answer" hidden>' +
                    "<p>" +
                    escapeHtml(question[1]) +
                    "</p>" +
                    "</div>" +
                    "</article>"
                );
            })
            .join("");

        container.addEventListener(
            "click",
            function (event) {
                const button = event.target.closest(
                    ".aiml-interview-question"
                );

                if (!button) return;

                const item = button.closest(
                    ".aiml-interview-item"
                );

                const answer = item.querySelector(
                    ".aiml-interview-answer"
                );

                const toggle = button.querySelector(
                    ".aiml-interview-toggle"
                );

                const opening = answer.hidden;
                answer.hidden = !opening;

                button.setAttribute(
                    "aria-expanded",
                    String(opening)
                );

                toggle.textContent =
                    opening ? "−" : "+";
            }
        );
    }

    function init() {
        initRankingLab();
        initFactorLab();
        initTracer();
        initProblems();
        initQuiz();
        initInterviews();
    }

    if (document.readyState === "loading") {
        document.addEventListener(
            "DOMContentLoaded",
            init
        );
    } else {
        init();
    }
}());
