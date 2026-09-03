(function () {
    "use strict";

    const LEVEL_PROGRESS_KEY = "codebhavya-aiml-level-09-progress-v1";

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
        return Number(value).toFixed(digits === undefined ? 3 : digits);
    }

    function clamp(value, minimum, maximum) {
        return Math.min(maximum, Math.max(minimum, value));
    }

    function prepareCanvas(canvas) {
        const width = Math.max(280, canvas.clientWidth || 720);
        const height = width < 560 ? 350 : 430;
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

    function classCounts(rows) {
        return rows.reduce(function (counts, row) {
            counts[row.label] =
                (counts[row.label] || 0) + 1;

            return counts;
        }, {
            Placed: 0,
            "Not Placed": 0
        });
    }

    function impurity(rows, criterion) {
        if (!rows.length) return 0;

        const counts = classCounts(rows);

        const probabilities =
            Object.values(counts).map(
                function (count) {
                    return count / rows.length;
                }
            );

        if (criterion === "entropy") {
            return probabilities.reduce(
                function (total, probability) {
                    return probability > 0
                        ? total -
                          probability *
                          Math.log2(probability)
                        : total;
                },
                0
            );
        }

        return 1 - probabilities.reduce(
            function (total, probability) {
                return total +
                    probability * probability;
            },
            0
        );
    }

    function majority(rows) {
        const counts = classCounts(rows);

        return (
            counts.Placed >=
            counts["Not Placed"]
        )
            ? "Placed"
            : "Not Placed";
    }

    function initSplitLab() {
        const canvas = byId("splitCanvas");
        if (!canvas) return;

        const samples = [
            {
                hours: 2,
                score: 42,
                label: "Not Placed"
            },
            {
                hours: 3,
                score: 51,
                label: "Not Placed"
            },
            {
                hours: 4,
                score: 58,
                label: "Not Placed"
            },
            {
                hours: 5,
                score: 62,
                label: "Not Placed"
            },
            {
                hours: 6,
                score: 66,
                label: "Not Placed"
            },
            {
                hours: 4.5,
                score: 70,
                label: "Not Placed"
            },
            {
                hours: 7,
                score: 63,
                label: "Not Placed"
            },
            {
                hours: 3.5,
                score: 75,
                label: "Placed"
            },
            {
                hours: 5,
                score: 78,
                label: "Placed"
            },
            {
                hours: 6,
                score: 73,
                label: "Placed"
            },
            {
                hours: 7,
                score: 82,
                label: "Placed"
            },
            {
                hours: 8,
                score: 88,
                label: "Placed"
            },
            {
                hours: 9,
                score: 91,
                label: "Placed"
            },
            {
                hours: 7.5,
                score: 76,
                label: "Placed"
            }
        ];

        const featureInput =
            byId("splitFeature");

        const thresholdInput =
            byId("splitThreshold");

        const criterionInput =
            byId("splitCriterion");

        let query = {
            hours: 6,
            score: 72
        };

        let lastGeometry = null;

        function configureThreshold() {
            if (featureInput.value === "hours") {
                thresholdInput.min = "2";
                thresholdInput.max = "8.5";
                thresholdInput.step = "0.5";
                thresholdInput.value = "5.5";
            } else {
                thresholdInput.min = "42";
                thresholdInput.max = "90";
                thresholdInput.step = "1";
                thresholdInput.value = "70";
            }
        }

        function splitAt(feature, threshold) {
            const left = samples.filter(
                function (row) {
                    return (
                        row[feature] <= threshold
                    );
                }
            );

            const right = samples.filter(
                function (row) {
                    return (
                        row[feature] > threshold
                    );
                }
            );

            return {
                left: left,
                right: right
            };
        }

        function scoreSplit(
            feature,
            threshold,
            criterion
        ) {
            const partition =
                splitAt(feature, threshold);

            const parent =
                impurity(samples, criterion);

            const weighted = (
                partition.left.length *
                impurity(
                    partition.left,
                    criterion
                ) +
                partition.right.length *
                impurity(
                    partition.right,
                    criterion
                )
            ) / samples.length;

            return {
                feature: feature,
                threshold: threshold,
                left: partition.left,
                right: partition.right,
                parent: parent,
                weighted: weighted,
                gain: parent - weighted
            };
        }

        function candidates(feature, criterion) {
            const unique = Array.from(
                new Set(
                    samples.map(function (row) {
                        return row[feature];
                    })
                )
            ).sort(function (a, b) {
                return a - b;
            });

            return unique
                .slice(0, -1)
                .map(function (value, index) {
                    return scoreSplit(
                        feature,
                        (
                            value +
                            unique[index + 1]
                        ) / 2,
                        criterion
                    );
                })
                .filter(function (candidate) {
                    return (
                        candidate.left.length &&
                        candidate.right.length
                    );
                })
                .sort(function (a, b) {
                    return (
                        b.gain - a.gain ||
                        a.threshold - b.threshold
                    );
                });
        }

        function draw(active) {
            const prepared =
                prepareCanvas(canvas);

            const context = prepared.context;
            const width = prepared.width;
            const height = prepared.height;
            const pad = width < 560 ? 38 : 48;

            const sx = function (hours) {
                return (
                    pad +
                    (hours - 1) / 9 *
                    (width - pad * 2)
                );
            };

            const sy = function (score) {
                return (
                    height -
                    pad -
                    (score - 35) / 60 *
                    (height - pad * 2)
                );
            };

            lastGeometry = {
                width: width,
                height: height,
                pad: pad
            };

            context.fillStyle = "#071b30";
            context.fillRect(
                0,
                0,
                width,
                height
            );

            context.strokeStyle =
                "rgba(125,211,252,.13)";

            context.lineWidth = 1;

            for (
                let x = 1;
                x <= 10;
                x += 1
            ) {
                context.beginPath();
                context.moveTo(sx(x), pad);
                context.lineTo(
                    sx(x),
                    height - pad
                );
                context.stroke();
            }

            for (
                let score = 40;
                score <= 90;
                score += 10
            ) {
                context.beginPath();
                context.moveTo(
                    pad,
                    sy(score)
                );
                context.lineTo(
                    width - pad,
                    sy(score)
                );
                context.stroke();
            }

            context.fillStyle =
                "rgba(56,189,248,.07)";

            if (active.feature === "hours") {
                const lineX =
                    sx(active.threshold);

                context.fillRect(
                    pad,
                    pad,
                    lineX - pad,
                    height - pad * 2
                );

                context.strokeStyle =
                    "#f6cc35";

                context.lineWidth = 3;
                context.setLineDash([8, 6]);
                context.beginPath();

                context.moveTo(
                    lineX,
                    pad
                );

                context.lineTo(
                    lineX,
                    height - pad
                );

                context.stroke();
            } else {
                const lineY =
                    sy(active.threshold);

                context.fillRect(
                    pad,
                    lineY,
                    width - pad * 2,
                    height - pad - lineY
                );

                context.strokeStyle =
                    "#f6cc35";

                context.lineWidth = 3;
                context.setLineDash([8, 6]);
                context.beginPath();

                context.moveTo(
                    pad,
                    lineY
                );

                context.lineTo(
                    width - pad,
                    lineY
                );

                context.stroke();
            }

            context.setLineDash([]);

            samples.forEach(
                function (row, index) {
                    context.fillStyle =
                        row.label === "Placed"
                            ? "#34d399"
                            : "#fb7185";

                    context.strokeStyle =
                        "#ffffff";

                    context.lineWidth = 2;
                    context.beginPath();

                    context.arc(
                        sx(row.hours),
                        sy(row.score),
                        8,
                        0,
                        Math.PI * 2
                    );

                    context.fill();
                    context.stroke();

                    context.fillStyle =
                        "#dcecff";

                    context.font =
                        "700 10px system-ui";

                    context.fillText(
                        String(index + 1),
                        sx(row.hours) + 11,
                        sy(row.score) - 8
                    );
                }
            );

            context.fillStyle = "#f6cc35";
            context.strokeStyle = "#ffffff";
            context.lineWidth = 3;
            context.beginPath();

            context.arc(
                sx(query.hours),
                sy(query.score),
                11,
                0,
                Math.PI * 2
            );

            context.fill();
            context.stroke();

            context.fillStyle = "#06172a";
            context.font =
                "950 13px system-ui";

            context.fillText(
                "?",
                sx(query.hours) - 4,
                sy(query.score) + 5
            );

            context.fillStyle = "#dcecff";
            context.font =
                "700 12px system-ui";

            context.fillText(
                "study hours",
                width - 112,
                height - 13
            );

            context.fillText(
                "mock score",
                7,
                22
            );
        }

        function distributionCard(
            title,
            rows,
            operator
        ) {
            const counts = classCounts(rows);
            const total = rows.length || 1;

            return (
                "<article>" +
                "<span>" +
                escapeHtml(title) +
                "</span>" +

                "<strong>" +
                escapeHtml(operator) +
                "</strong>" +

                "<div>" +
                '<b class="placed">' +
                counts.Placed +
                " Placed</b>" +

                '<b class="not">' +
                counts["Not Placed"] +
                " Not</b>" +
                "</div>" +

                "<i><b style=\"width:" +
                counts.Placed / total * 100 +
                '%"></b></i>' +

                "<small>" +
                rows.length +
                " samples • predicts " +
                escapeHtml(majority(rows)) +
                "</small>" +
                "</article>"
            );
        }

        function update() {
            const feature =
                featureInput.value;

            const threshold =
                Number(thresholdInput.value);

            const criterion =
                criterionInput.value;

            const active = scoreSplit(
                feature,
                threshold,
                criterion
            );

            const ranked =
                candidates(feature, criterion);

            const featureLabel =
                feature === "score"
                    ? "Mock score"
                    : "Study hours";

            const goesLeft =
                query[feature] <= threshold;

            const queryRows =
                goesLeft
                    ? active.left
                    : active.right;

            const queryPrediction =
                majority(queryRows);

            byId(
                "splitThresholdValue"
            ).textContent =
                feature === "hours"
                    ? fixed(threshold, 1)
                    : fixed(threshold, 0);

            byId(
                "parentImpurity"
            ).textContent =
                fixed(active.parent, 3);

            byId(
                "childImpurity"
            ).textContent =
                fixed(active.weighted, 3);

            byId(
                "splitGain"
            ).textContent =
                fixed(active.gain, 3);

            byId(
                "queryPath"
            ).textContent =
                (
                    goesLeft
                        ? "Left"
                        : "Right"
                ) +
                " → " +
                queryPrediction;

            byId(
                "splitChildren"
            ).innerHTML =
                distributionCard(
                    "LEFT CHILD",
                    active.left,
                    featureLabel +
                    " ≤ " +
                    threshold
                ) +
                distributionCard(
                    "RIGHT CHILD",
                    active.right,
                    featureLabel +
                    " > " +
                    threshold
                );

            byId(
                "candidateSplits"
            ).innerHTML = ranked
                .slice(0, 5)
                .map(function (
                    candidate,
                    index
                ) {
                    const activeRow =
                        Math.abs(
                            candidate.threshold -
                            threshold
                        ) < 0.001;

                    return (
                        '<button type="button" ' +
                        'data-threshold="' +
                        candidate.threshold +
                        '" class="' +
                        (
                            activeRow
                                ? "active"
                                : ""
                        ) +
                        '">' +

                        "<span>#" +
                        (index + 1) +
                        " • " +
                        featureLabel +
                        "</span>" +

                        "<strong>" +
                        fixed(
                            candidate.threshold,
                            feature === "hours"
                                ? 1
                                : 0
                        ) +
                        "</strong>" +

                        "<small>gain " +
                        fixed(
                            candidate.gain,
                            3
                        ) +
                        "</small>" +
                        "</button>"
                    );
                })
                .join("");

            const best = ranked[0];

            byId(
                "splitExplanation"
            ).textContent = best
                ? (
                    "Best " +
                    criterion +
                    " split for this feature is " +
                    featureLabel +
                    " ≤ " +
                    fixed(
                        best.threshold,
                        feature === "hours"
                            ? 1
                            : 0
                    ) +
                    " with gain " +
                    fixed(best.gain, 3) +
                    ". The active query follows the " +
                    (
                        goesLeft
                            ? "left"
                            : "right"
                    ) +
                    " child."
                )
                : "No valid split is available.";

            draw(active);
        }

        featureInput.addEventListener(
            "change",
            function () {
                configureThreshold();
                update();
            }
        );

        criterionInput.addEventListener(
            "change",
            update
        );

        thresholdInput.addEventListener(
            "input",
            update
        );

        byId(
            "candidateSplits"
        ).addEventListener(
            "click",
            function (event) {
                const button =
                    event.target.closest(
                        "button[data-threshold]"
                    );

                if (!button) return;

                thresholdInput.value =
                    button.dataset.threshold;

                update();
            }
        );

        byId(
            "findBestSplit"
        ).addEventListener(
            "click",
            function () {
                const ranked = candidates(
                    featureInput.value,
                    criterionInput.value
                );

                if (ranked.length) {
                    thresholdInput.value =
                        ranked[0].threshold;
                }

                update();
            }
        );

        byId(
            "splitReset"
        ).addEventListener(
            "click",
            function () {
                featureInput.value = "score";
                criterionInput.value = "gini";

                query = {
                    hours: 6,
                    score: 72
                };

                configureThreshold();
                update();
            }
        );

        canvas.addEventListener(
            "click",
            function (event) {
                if (!lastGeometry) return;

                const rect =
                    canvas.getBoundingClientRect();

                const localX =
                    event.clientX - rect.left;

                const localY =
                    event.clientY - rect.top;

                const pad =
                    lastGeometry.pad;

                query.hours = clamp(
                    1 +
                    (
                        localX - pad
                    ) /
                    (
                        lastGeometry.width -
                        pad * 2
                    ) *
                    9,
                    1,
                    10
                );

                query.score = clamp(
                    35 +
                    (
                        lastGeometry.height -
                        pad -
                        localY
                    ) /
                    (
                        lastGeometry.height -
                        pad * 2
                    ) *
                    60,
                    35,
                    95
                );

                update();
            }
        );

        window.addEventListener(
            "resize",
            update,
            { passive: true }
        );

        configureThreshold();
        update();
    }

    function seededRandom(seed) {
        let state = seed >>> 0;

        return function () {
            state = (
                state * 1664525 +
                1013904223
            ) >>> 0;

            return state / 4294967296;
        };
    }

    function initForestLab() {
        const container =
            byId("forestTreeVotes");

        if (!container) return;

        const hoursInput =
            byId("forestHours");

        const scoreInput =
            byId("forestScore");

        const projectsInput =
            byId("forestProjects");

        const sizeInput =
            byId("forestSize");

        const seedInput =
            byId("forestSeed");

        const featureLabels = {
            hours: "hours",
            score: "mock score",
            projects: "projects"
        };

        const thresholdPools = {
            hours: [
                3.5,
                4.5,
                5.5,
                6.5,
                7.5
            ],
            score: [
                55,
                62,
                68,
                72,
                78,
                84
            ],
            projects: [
                1,
                2,
                3
            ]
        };

        function generateTrees(count, seed) {
            const random =
                seededRandom(seed);

            const features =
                Object.keys(thresholdPools);

            return Array.from(
                { length: count },
                function (_, index) {
                    const firstFeature =
                        features[
                            Math.floor(
                                random() *
                                features.length
                            )
                        ];

                    let secondFeature =
                        features[
                            Math.floor(
                                random() *
                                features.length
                            )
                        ];

                    if (
                        secondFeature ===
                        firstFeature
                    ) {
                        secondFeature =
                            features[
                                (
                                    features.indexOf(
                                        firstFeature
                                    ) + 1
                                ) %
                                features.length
                            ];
                    }

                    const firstPool =
                        thresholdPools[
                            firstFeature
                        ];

                    const secondPool =
                        thresholdPools[
                            secondFeature
                        ];

                    return {
                        id: index + 1,
                        firstFeature:
                            firstFeature,
                        firstThreshold:
                            firstPool[
                                Math.floor(
                                    random() *
                                    firstPool.length
                                )
                            ],
                        secondFeature:
                            secondFeature,
                        secondThreshold:
                            secondPool[
                                Math.floor(
                                    random() *
                                    secondPool.length
                                )
                            ],
                        mode:
                            random() > 0.34
                                ? "and"
                                : "or",
                        bootstrap:
                            58 +
                            Math.floor(
                                random() * 14
                            )
                    };
                }
            );
        }

        function treePrediction(
            tree,
            candidate
        ) {
            const first =
                candidate[
                    tree.firstFeature
                ] >= tree.firstThreshold;

            const second =
                candidate[
                    tree.secondFeature
                ] >= tree.secondThreshold;

            return tree.mode === "and"
                ? first && second
                : first || second;
        }

        function formatThreshold(
            feature,
            value
        ) {
            return feature === "hours"
                ? fixed(value, 1)
                : fixed(value, 0);
        }

        function update() {
            const candidate = {
                hours:
                    Number(hoursInput.value),
                score:
                    Number(scoreInput.value),
                projects:
                    Number(projectsInput.value)
            };

            const count =
                Number(sizeInput.value);

            const seed =
                Number(seedInput.value);

            const trees =
                generateTrees(count, seed);

            const results = trees.map(
                function (tree) {
                    return {
                        tree: tree,
                        placed:
                            treePrediction(
                                tree,
                                candidate
                            )
                    };
                }
            );

            const placedVotes =
                results.filter(
                    function (result) {
                        return result.placed;
                    }
                ).length;

            const notVotes =
                count - placedVotes;

            const prediction =
                placedVotes >= notVotes
                    ? "Placed"
                    : "Not Placed";

            const confidence =
                Math.max(
                    placedVotes,
                    notVotes
                ) / count * 100;

            const disagreement =
                Math.min(
                    placedVotes,
                    notVotes
                ) / count * 100;

            const ruleFamilies =
                new Set(
                    trees.map(
                        function (tree) {
                            return (
                                tree.firstFeature +
                                "+" +
                                tree.secondFeature
                            );
                        }
                    )
                ).size;

            byId(
                "forestHoursValue"
            ).textContent =
                fixed(candidate.hours, 1);

            byId(
                "forestScoreValue"
            ).textContent =
                fixed(candidate.score, 0);

            byId(
                "forestProjectsValue"
            ).textContent =
                fixed(candidate.projects, 0);

            byId(
                "forestSizeValue"
            ).textContent = count;

            byId(
                "forestSeedValue"
            ).textContent = seed;

            byId(
                "forestPrediction"
            ).textContent = prediction;

            byId(
                "forestPrediction"
            ).className =
                prediction === "Placed"
                    ? "placed"
                    : "not";

            byId(
                "forestConfidence"
            ).textContent =
                fixed(confidence, 1) +
                "% vote confidence";

            byId(
                "forestPlacedVotes"
            ).textContent = placedVotes;

            byId(
                "forestNotVotes"
            ).textContent = notVotes;

            byId(
                "forestPlacedBar"
            ).style.width =
                placedVotes /
                count *
                100 +
                "%";

            byId(
                "forestNotBar"
            ).style.width =
                notVotes /
                count *
                100 +
                "%";

            byId(
                "forestDiversity"
            ).textContent =
                ruleFamilies +
                " rule families";

            byId(
                "forestAgreement"
            ).textContent =
                "Trees disagree on " +
                fixed(disagreement, 1) +
                "% of votes";

            container.innerHTML =
                results.map(
                    function (result) {
                        const tree =
                            result.tree;

                        const conjunction =
                            tree.mode === "and"
                                ? "AND"
                                : "OR";

                        return (
                            '<article class="' +
                            (
                                result.placed
                                    ? "placed"
                                    : "not"
                            ) +
                            '">' +

                            "<div>" +
                            "<span>TREE " +
                            String(
                                tree.id
                            ).padStart(
                                2,
                                "0"
                            ) +
                            "</span>" +

                            "<small>bootstrap ≈ " +
                            tree.bootstrap +
                            "% unique rows</small>" +
                            "</div>" +

                            "<code>" +
                            escapeHtml(
                                featureLabels[
                                    tree.firstFeature
                                ]
                            ) +
                            " ≥ " +
                            formatThreshold(
                                tree.firstFeature,
                                tree.firstThreshold
                            ) +
                            "</code>" +

                            "<b>" +
                            conjunction +
                            "</b>" +

                            "<code>" +
                            escapeHtml(
                                featureLabels[
                                    tree.secondFeature
                                ]
                            ) +
                            " ≥ " +
                            formatThreshold(
                                tree.secondFeature,
                                tree.secondThreshold
                            ) +
                            "</code>" +

                            "<strong>" +
                            (
                                result.placed
                                    ? "✓ Placed"
                                    : "✕ Not Placed"
                            ) +
                            "</strong>" +
                            "</article>"
                        );
                    }
                ).join("");
        }

        [
            hoursInput,
            scoreInput,
            projectsInput,
            sizeInput,
            seedInput
        ].forEach(function (input) {
            input.addEventListener(
                "input",
                update
            );
        });

        byId(
            "growForest"
        ).addEventListener(
            "click",
            function () {
                seedInput.value =
                    Number(seedInput.value) >= 93
                        ? 7
                        : Number(
                            seedInput.value
                        ) + 7;

                update();
            }
        );

        byId(
            "forestReset"
        ).addEventListener(
            "click",
            function () {
                hoursInput.value = 6;
                scoreInput.value = 72;
                projectsInput.value = 2;
                sizeInput.value = 7;
                seedInput.value = 42;
                update();
            }
        );

        update();
    }

    function giniFromLabels(rows) {
        if (!rows.length) return 0;

        const counts = rows.reduce(
            function (result, row) {
                result[row[1]] =
                    (result[row[1]] || 0) + 1;

                return result;
            },
            {}
        );

        return 1 -
            Object.values(counts).reduce(
                function (total, count) {
                    const probability =
                        count / rows.length;

                    return total +
                        probability *
                        probability;
                },
                0
            );
    }

    function buildTraceStates() {
        const rows = [
            [2, "No"],
            [3, "No"],
            [5, "Yes"],
            [6, "Yes"]
        ];

        const thresholds = [
            2.5,
            4.0,
            5.5
        ];

        const parentGini =
            giniFromLabels(rows);

        let bestGain = -1;
        let bestThreshold = null;

        const states = [];
        let current = {};

        function view(value) {
            return JSON.stringify(value)
                .replace(/"/g, "'");
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
                variables: Object.assign(
                    {
                        parent_gini:
                            fixed(
                                parentGini,
                                3
                            ),
                        best_gain:
                            fixed(
                                bestGain,
                                3
                            ),
                        best_threshold:
                            bestThreshold === null
                                ? "None"
                                : bestThreshold
                    },
                    current,
                    extra || {}
                )
            });
        }

        add(
            1,
            "Rows loaded",
            "Store one numeric feature with four class labels.",
            "rows = [(2,'No'), (3,'No'), (5,'Yes'), (6,'Yes')]",
            null,
            { rows: view(rows) }
        );

        add(
            2,
            "Candidates loaded",
            "These midpoints are the possible split boundaries.",
            "thresholds = [2.5, 4.0, 5.5]",
            null,
            { thresholds: view(thresholds) }
        );

        add(
            3,
            "Function declared",
            "Define a helper that measures class mixing.",
            "def gini(group):"
        );

        add(
            4,
            "Labels collected",
            "The helper extracts the target label from every row.",
            "labels = [label for _, label in group]"
        );

        add(
            5,
            "Gini returned",
            "Sum squared class proportions and subtract from one.",
            "return 1 - Σ(count/len(group))²"
        );

        add(
            6,
            "Parent impurity",
            "The root has two Yes and two No labels.",
            "parent_gini = 1 - (2/4)² - (2/4)² = 0.500"
        );

        add(
            7,
            "Best gain initialized",
            "Any valid gain will exceed negative one.",
            "best_gain = -1"
        );

        add(
            8,
            "Best threshold initialized",
            "No candidate has been accepted yet.",
            "best_threshold = None"
        );

        thresholds.forEach(
            function (threshold, index) {
                current = {
                    loop: index + 1,
                    threshold: threshold
                };

                add(
                    9,
                    "Candidate " +
                    (index + 1),
                    "Read the next threshold. The cursor returns here for each candidate.",
                    "threshold = " +
                    threshold
                );

                const left = rows.filter(
                    function (row) {
                        return (
                            row[0] <= threshold
                        );
                    }
                );

                add(
                    10,
                    "Left child created",
                    "Keep rows whose feature is at most the threshold.",
                    "left = " + view(left),
                    null,
                    { left: view(left) }
                );

                const right = rows.filter(
                    function (row) {
                        return (
                            row[0] > threshold
                        );
                    }
                );

                add(
                    11,
                    "Right child created",
                    "Keep rows whose feature is above the threshold.",
                    "right = " + view(right),
                    null,
                    { right: view(right) }
                );

                const leftGini =
                    giniFromLabels(left);

                const rightGini =
                    giniFromLabels(right);

                const weighted = (
                    left.length * leftGini +
                    right.length * rightGini
                ) / rows.length;

                current.left_gini =
                    fixed(leftGini, 3);

                current.right_gini =
                    fixed(rightGini, 3);

                current.weighted =
                    fixed(weighted, 3);

                add(
                    12,
                    "Weighted impurity",
                    "Weight each child by the fraction of records it contains.",
                    "weighted = (" +
                    left.length +
                    "/4×" +
                    fixed(leftGini, 3) +
                    ") + (" +
                    right.length +
                    "/4×" +
                    fixed(rightGini, 3) +
                    ") = " +
                    fixed(weighted, 3)
                );

                const gain =
                    parentGini - weighted;

                current.gain =
                    fixed(gain, 3);

                add(
                    13,
                    "Gain calculated",
                    "Subtract weighted child impurity from parent impurity.",
                    "gain = 0.500 - " +
                    fixed(weighted, 3) +
                    " = " +
                    fixed(gain, 3)
                );

                add(
                    14,
                    gain > bestGain
                        ? "Better split found"
                        : "Split rejected",
                    "Compare this candidate with the strongest gain already stored.",
                    fixed(gain, 3) +
                    " > " +
                    fixed(bestGain, 3) +
                    " → " +
                    String(gain > bestGain)
                );

                if (gain > bestGain) {
                    bestGain = gain;

                    add(
                        15,
                        "Best gain updated",
                        "Keep the stronger impurity reduction.",
                        "best_gain = " +
                        fixed(bestGain, 3)
                    );

                    bestThreshold =
                        threshold;

                    add(
                        16,
                        "Best threshold updated",
                        "Remember which boundary produced the gain.",
                        "best_threshold = " +
                        bestThreshold
                    );
                }
            }
        );

        current = {};

        add(
            17,
            "Complete",
            "Display the best threshold and its information gain.",
            "print(best_threshold, round(best_gain, 3))",
            "4.0 0.5",
            {
                best_gain:
                    fixed(bestGain, 3),
                best_threshold:
                    bestThreshold
            }
        );

        return states;
    }

    function initProgramTracer() {
        const codeContainer =
            byId("tracerCode");

        if (!codeContainer) return;

        const codeLines = [
            "rows = [(2,'No'), (3,'No'), (5,'Yes'), (6,'Yes')]",
            "thresholds = [2.5, 4.0, 5.5]",
            "def gini(group):",
            "    labels = [label for _, label in group]",
            "    return 1 - sum((labels.count(c)/len(group))**2 for c in set(labels))",
            "parent_gini = gini(rows)",
            "best_gain = -1",
            "best_threshold = None",
            "for threshold in thresholds:",
            "    left = [row for row in rows if row[0] <= threshold]",
            "    right = [row for row in rows if row[0] > threshold]",
            "    weighted = (len(left)*gini(left) + len(right)*gini(right)) / len(rows)",
            "    gain = parent_gini - weighted",
            "    if gain > best_gain:",
            "        best_gain = gain",
            "        best_threshold = threshold",
            "print(best_threshold, round(best_gain, 3))"
        ];

        const states =
            buildTraceStates();

        const panel =
            byId("tracerPanel");

        const toggle =
            byId("tracerPanelToggle");

        const previous =
            byId("tracerPrevious");

        const next =
            byId("tracerNext");

        const auto =
            byId("tracerAuto");

        const pause =
            byId("tracerPause");

        const reset =
            byId("tracerReset");

        let step = 0;
        let timer = null;

        codeContainer.innerHTML =
            codeLines.map(
                function (line, index) {
                    return (
                        '<div class="aiml-code-line" ' +
                        'data-code-line="' +
                        (index + 1) +
                        '">' +
                        "<span>" +
                        String(
                            index + 1
                        ).padStart(2, "0") +
                        "</span>" +
                        "<code>" +
                        escapeHtml(line) +
                        "</code>" +
                        "</div>"
                    );
                }
            ).join("");

        function stop() {
            if (timer !== null) {
                window.clearInterval(timer);
            }

            timer = null;
            pause.disabled = true;
        }

        function renderVariables(values) {
            const entries =
                Object.entries(values || {});

            byId(
                "tracerVariables"
            ).innerHTML =
                entries.length
                    ? entries.map(
                        function (entry) {
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
                        }
                    ).join("")
                    : (
                        '<article class="aiml-variable">' +
                        "<span>STATE</span>" +
                        "<strong>Not started</strong>" +
                        "</article>"
                    );
        }

        function render() {
            const atStart = step === 0;
            const atEnd =
                step === states.length;

            const state =
                atStart
                    ? null
                    : states[step - 1];

            codeContainer
                .querySelectorAll(
                    ".aiml-code-line"
                )
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
                byId(
                    "tracerStatus"
                ).textContent =
                    state.status;

                byId(
                    "tracerExplanation"
                ).textContent =
                    state.explanation;

                byId(
                    "tracerExpression"
                ).textContent =
                    state.expression;

                byId(
                    "tracerOutput"
                ).textContent =
                    state.output;

                renderVariables(
                    state.variables
                );

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
                byId(
                    "tracerStatus"
                ).textContent =
                    "Ready";

                byId(
                    "tracerExplanation"
                ).textContent =
                    "Press Next to execute the first statement.";

                byId(
                    "tracerExpression"
                ).textContent = "—";

                byId(
                    "tracerOutput"
                ).textContent =
                    "Waiting for print(...)";

                renderVariables({});
            }

            previous.disabled = atStart;
            next.disabled = atEnd;

            auto.disabled =
                atEnd || timer !== null;

            byId(
                "tracerProgress"
            ).textContent =
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
                const opening =
                    panel.hidden;

                panel.hidden = !opening;

                toggle.textContent =
                    opening
                        ? "✕ Close Interactive Tracer"
                        : "Open Interactive Tracer";

                toggle.setAttribute(
                    "aria-expanded",
                    String(opening)
                );

                if (opening) {
                    window.setTimeout(
                        function () {
                            panel.scrollIntoView({
                                behavior: "smooth",
                                block: "nearest"
                            });
                        },
                        50
                    );
                } else {
                    stop();
                }
            }
        );

        previous.addEventListener(
            "click",
            function () {
                stop();

                step = Math.max(
                    0,
                    step - 1
                );

                render();
            }
        );

        next.addEventListener(
            "click",
            advance
        );

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
                    850
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
                title:
                    "Gini Impurity from Class Counts",
                description:
                    "Read class counts and print Gini impurity rounded to three decimals.",
                sampleInput: "6 2",
                expected: "0.375",
                hint:
                    "Convert each count into a proportion, square the proportions and subtract their sum from one.",
                starter:
                    "counts = list(map(int, input().split()))\n" +
                    "# Calculate Gini impurity\n",
                solution:
                    "counts = list(map(int, input().split()))\n" +
                    "total = sum(counts)\n" +
                    "gini = 1 - sum((count / total) ** 2 for count in counts)\n" +
                    "print(round(gini, 3))",
                required: [
                    ["sum("],
                    ["** 2", "**2"],
                    ["1 -", "1-"],
                    ["print("]
                ]
            },
            {
                title:
                    "Best Decision-Stump Threshold",
                description:
                    "Evaluate midpoint thresholds and print the split producing maximum Gini gain.",
                sampleInput:
                    "2:N 3:N 5:Y 6:Y",
                expected: "4.0",
                hint:
                    "Sort the rows, form adjacent midpoints, partition the labels and compare weighted impurities.",
                starter:
                    "rows = [(2, 'N'), (3, 'N'), (5, 'Y'), (6, 'Y')]\n" +
                    "# Search all midpoint thresholds\n",
                solution:
                    "rows = [(2, 'N'), (3, 'N'), (5, 'Y'), (6, 'Y')]\n\n" +
                    "def gini(group):\n" +
                    "    labels = [label for _, label in group]\n" +
                    "    return 1 - sum((labels.count(c)/len(labels))**2 for c in set(labels))\n\n" +
                    "parent = gini(rows)\n" +
                    "best_gain, best_threshold = -1, None\n" +
                    "for i in range(len(rows)-1):\n" +
                    "    threshold = (rows[i][0] + rows[i+1][0]) / 2\n" +
                    "    left = [row for row in rows if row[0] <= threshold]\n" +
                    "    right = [row for row in rows if row[0] > threshold]\n" +
                    "    weighted = (len(left)*gini(left) + len(right)*gini(right)) / len(rows)\n" +
                    "    gain = parent - weighted\n" +
                    "    if gain > best_gain:\n" +
                    "        best_gain, best_threshold = gain, threshold\n" +
                    "print(best_threshold)",
                required: [
                    ["def gini"],
                    ["for "],
                    ["threshold"],
                    ["left"],
                    ["right"],
                    ["weighted"],
                    ["gain"],
                    ["print("]
                ]
            },
            {
                title:
                    "Trace a Tree Prediction",
                description:
                    "Implement nested decisions for score, projects and attendance, then print the class.",
                sampleInput: "75 2 80",
                expected: "Placed",
                hint:
                    "Follow only one root-to-leaf path using if, elif or nested conditions.",
                starter:
                    "score, projects, attendance = map(int, input().split())\n" +
                    "# Follow the decision path\n",
                solution:
                    "score, projects, attendance = map(int, input().split())\n" +
                    "if score >= 70:\n" +
                    "    if projects >= 2 or attendance >= 85:\n" +
                    "        prediction = 'Placed'\n" +
                    "    else:\n" +
                    "        prediction = 'Review'\n" +
                    "else:\n" +
                    "    prediction = 'Not Placed'\n" +
                    "print(prediction)",
                required: [
                    ["if "],
                    ["else"],
                    ["score"],
                    ["projects", "attendance"],
                    ["prediction"],
                    ["print("]
                ]
            },
            {
                title:
                    "Leakage-Safe Decision Tree Pipeline",
                description:
                    "Split mixed data, preprocess it in a pipeline and fit a controlled DecisionTreeClassifier.",
                sampleInput: "X, y",
                expected:
                    "Validation predictions",
                hint:
                    "Use train_test_split, a ColumnTransformer and a pipeline ending with DecisionTreeClassifier.",
                starter:
                    "from sklearn.pipeline import Pipeline\n" +
                    "# Build the preprocessing and tree pipeline\n",
                solution:
                    "from sklearn.model_selection import train_test_split\n" +
                    "from sklearn.compose import ColumnTransformer\n" +
                    "from sklearn.preprocessing import OneHotEncoder\n" +
                    "from sklearn.impute import SimpleImputer\n" +
                    "from sklearn.pipeline import Pipeline\n" +
                    "from sklearn.tree import DecisionTreeClassifier\n" +
                    "X_train, X_test, y_train, y_test = train_test_split(X, y, stratify=y, random_state=42)\n" +
                    "preprocess = ColumnTransformer([('cat', OneHotEncoder(handle_unknown='ignore'), categorical_columns)], remainder=SimpleImputer(strategy='median'))\n" +
                    "model = Pipeline([('prepare', preprocess), ('tree', DecisionTreeClassifier(max_depth=5, min_samples_leaf=5, random_state=42))])\n" +
                    "model.fit(X_train, y_train)\n" +
                    "print(model.predict(X_test))",
                required: [
                    ["train_test_split("],
                    ["columntransformer("],
                    ["pipeline("],
                    ["decisiontreeclassifier("],
                    ["max_depth"],
                    ["min_samples_leaf"],
                    [".fit("],
                    ["predict("]
                ]
            },
            {
                title:
                    "Random Forest with OOB Evaluation",
                description:
                    "Train a RandomForestClassifier with OOB scoring and print validation accuracy and OOB score.",
                sampleInput:
                    "X_train, X_test, y_train, y_test",
                expected:
                    "Validation and OOB scores",
                hint:
                    "Enable bootstrap and oob_score, fit the forest, then use score and oob_score_.",
                starter:
                    "from sklearn.ensemble import RandomForestClassifier\n" +
                    "# Configure, fit and evaluate the forest\n",
                solution:
                    "from sklearn.ensemble import RandomForestClassifier\n" +
                    "model = RandomForestClassifier(n_estimators=300, max_features='sqrt', min_samples_leaf=3, bootstrap=True, oob_score=True, random_state=42, n_jobs=-1)\n" +
                    "model.fit(X_train, y_train)\n" +
                    "print(round(model.score(X_test, y_test), 3))\n" +
                    "print(round(model.oob_score_, 3))",
                required: [
                    ["randomforestclassifier("],
                    ["n_estimators"],
                    ["max_features"],
                    ["bootstrap"],
                    ["oob_score"],
                    [".fit("],
                    [".score("],
                    ["oob_score_"]
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

            current.problemScores =
                scores;

            window.localStorage.setItem(
                LEVEL_PROGRESS_KEY,
                JSON.stringify(current)
            );
        }

        function summary() {
            const total =
                Object.values(scores).reduce(
                    function (sum, score) {
                        return (
                            sum +
                            Number(score || 0)
                        );
                    },
                    0
                );

            byId(
                "problemSolvedCount"
            ).textContent =
                solved.size +
                " / " +
                problems.length;

            byId(
                "problemScore"
            ).textContent =
                total +
                " / " +
                problems.length * 100;

            byId(
                "problemProgressBar"
            ).style.width =
                solved.size /
                problems.length *
                100 +
                "%";
        }

        list.innerHTML = problems
            .map(function (
                problem,
                index
            ) {
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
                    String(number).padStart(
                        2,
                        "0"
                    ) +
                    "</span>" +

                    "<div>" +
                    "<h3>" +
                    number +
                    ". " +
                    escapeHtml(problem.title) +
                    "</h3>" +

                    "<p>" +
                    escapeHtml(
                        problem.description
                    ) +
                    "</p>" +
                    "</div>" +
                    "</div>" +

                    '<div class="aiml-problem-data">' +
                    "<span>" +
                    "<strong>Sample input:</strong> " +
                    escapeHtml(
                        problem.sampleInput
                    ) +
                    "</span>" +

                    "<span>" +
                    "<strong>Expected output:</strong> " +
                    "<code>" +
                    escapeHtml(
                        problem.expected
                    ) +
                    "</code>" +
                    "</span>" +
                    "</div>" +

                    '<div class="aiml-problem-actions">' +
                    '<button type="button" ' +
                    'class="primary" ' +
                    'data-action="workspace">' +
                    "💻 Solve It Yourself" +
                    "</button>" +

                    '<button type="button" ' +
                    'class="hint" ' +
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
            name,
            button,
            openText,
            closeText
        ) {
            const panel =
                card.querySelector(
                    '[data-panel="' +
                    name +
                    '"]'
                );

            if (!panel) return;

            const opening = panel.hidden;
            panel.hidden = !opening;

            button.textContent =
                opening
                    ? closeText
                    : openText;
        }

        list.addEventListener(
            "click",
            function (event) {
                const button =
                    event.target.closest(
                        "button[data-action]"
                    );

                if (!button) return;

                const card = button.closest(
                    ".aiml-problem-card"
                );

                const index =
                    Number(
                        card.dataset.problem
                    );

                const problem =
                    problems[index];

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
                    card.querySelector(
                        "textarea"
                    );

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
                            function (
                                alternatives
                            ) {
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
                        Number(
                            scores[index] || 0
                        ),
                        score
                    );

                    card.classList.add(
                        "is-solved"
                    );

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
        const container =
            byId("quizQuestions");

        if (!container) return;

        const questions = [
            {
                question:
                    "What does a classification-tree leaf usually store?",
                options: [
                    "Only a threshold",
                    "A class distribution and prediction",
                    "A scaled feature",
                    "A bootstrap index"
                ],
                answer: 1,
                explanation:
                    "The samples reaching a leaf define class counts or proportions, from which a class and probability-like distribution are produced."
            },
            {
                question:
                    "What is the Gini impurity of a pure node?",
                options: [
                    "0",
                    "0.5",
                    "1",
                    "It depends on depth"
                ],
                answer: 0,
                explanation:
                    "One class has probability one and all others zero, so 1 − Σp² equals zero."
            },
            {
                question:
                    "Why are child impurities weighted?",
                options: [
                    "To reward deeper nodes",
                    "Because children may contain different sample counts",
                    "To scale features",
                    "To create bootstrap rows"
                ],
                answer: 1,
                explanation:
                    "A large child should contribute more to the post-split impurity than a tiny child."
            },
            {
                question:
                    "What usually happens when a tree grows without restrictions?",
                options: [
                    "Training bias increases",
                    "It becomes linear",
                    "Training fit improves but variance can become high",
                    "It no longer uses thresholds"
                ],
                answer: 2,
                explanation:
                    "A deep tree can isolate small groups and noise, producing low training error and unstable unseen predictions."
            },
            {
                question:
                    "What extra randomness distinguishes a random forest from ordinary tree bagging?",
                options: [
                    "Random labels",
                    "A random candidate-feature subset at each split",
                    "Random test data",
                    "Random target scaling"
                ],
                answer: 1,
                explanation:
                    "Feature subsampling at each node reduces correlation between the bootstrap-trained trees."
            },
            {
                question:
                    "Approximately what fraction of records is omitted from one large bootstrap sample?",
                options: [
                    "10%",
                    "25%",
                    "36.8%",
                    "63.2%"
                ],
                answer: 2,
                explanation:
                    "The omission probability approaches (1−1/n)^n ≈ e⁻¹ ≈ 0.368."
            },
            {
                question:
                    "Why do standard decision trees usually not require feature scaling?",
                options: [
                    "They ignore numeric features",
                    "Monotonic scaling preserves value ordering and partitions",
                    "They always normalize internally",
                    "Gini cancels every feature"
                ],
                answer: 1,
                explanation:
                    "Tree splits depend on order and thresholds; monotonic rescaling changes threshold units but preserves equivalent partitions."
            },
            {
                question:
                    "Which statement about feature importance is correct?",
                options: [
                    "It proves causality",
                    "It is identical across random seeds",
                    "It describes model reliance and requires careful interpretation",
                    "Correlated features cannot both be important"
                ],
                answer: 2,
                explanation:
                    "Importance is predictive-model evidence. Correlation, split opportunity and evaluation method affect the ranking."
            }
        ];

        container.innerHTML =
            questions.map(
                function (
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
                        escapeHtml(
                            item.question
                        ) +
                        "</strong>" +

                        '<div class="aiml-quiz-options">' +

                        item.options.map(
                            function (
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
                            }
                        ).join("") +

                        "</div>" +

                        '<div class="aiml-quiz-explanation" ' +
                        "hidden></div>" +

                        "</article>"
                    );
                }
            ).join("");

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
                    .forEach(
                        function (option) {
                            option.classList.toggle(
                                "is-selected",
                                option.contains(
                                    event.target
                                )
                            );
                        }
                    );
            }
        );

        byId(
            "checkQuiz"
        ).addEventListener(
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

                        const options =
                            Array.from(
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
                                Number(
                                    selected.value
                                ) === item.answer
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

                byId(
                    "quizScore"
                ).textContent =
                    correct +
                    " / " +
                    questions.length +
                    " correct" +
                    (
                        answered <
                        questions.length
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

                progress.bestQuizScore =
                    Math.max(
                        Number(
                            progress.bestQuizScore ||
                            0
                        ),
                        correct
                    );

                window.localStorage.setItem(
                    LEVEL_PROGRESS_KEY,
                    JSON.stringify(progress)
                );
            }
        );

        byId(
            "resetQuiz"
        ).addEventListener(
            "click",
            function () {
                container
                    .querySelectorAll(
                        'input[type="radio"]'
                    )
                    .forEach(
                        function (input) {
                            input.checked = false;
                        }
                    );

                container
                    .querySelectorAll(
                        ".aiml-quiz-option"
                    )
                    .forEach(
                        function (option) {
                            option.classList.remove(
                                "is-selected",
                                "is-correct",
                                "is-wrong"
                            );
                        }
                    );

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

                byId(
                    "quizScore"
                ).textContent =
                    "Not checked yet";
            }
        );
    }

    function initInterviewQuestions() {
        const container =
            byId("interviewList");

        if (!container) return;

        const questions = [
            {
                question:
                    "How does a decision tree choose its best classification split?",
                answer:
                    "It evaluates permitted feature–threshold candidates, computes the weighted impurity of their children and chooses the split with the largest impurity reduction. The search is greedy and repeats separately inside each child node."
            },
            {
                question:
                    "Compare Gini impurity and entropy.",
                answer:
                    "Both are zero for pure nodes and favor homogeneous children. Gini uses 1−Σp², while entropy uses −Σp log₂p. Entropy has an information interpretation and is slightly more computationally involved; they often select similar splits."
            },
            {
                question:
                    "Why do decision trees overfit?",
                answer:
                    "Recursive growth can isolate noise, outliers and tiny sample groups. This produces low training bias but high variance. Control depth, leaf support or impurity decrease, or select a cost-complexity-pruned subtree using validation."
            },
            {
                question:
                    "Explain cost-complexity pruning.",
                answer:
                    "It minimizes a combination of subtree error and α times the number of leaves. Larger α requires additional branches to justify their complexity. Cross-validation selects α from the pruning path."
            },
            {
                question:
                    "Why does a random forest reduce variance?",
                answer:
                    "Bootstrap row samples and random candidate-feature subsets create diverse trees. Voting or averaging cancels part of their uncorrelated error, making predictions less sensitive to changes in the training sample."
            },
            {
                question:
                    "What is out-of-bag evaluation?",
                answer:
                    "Each bootstrap tree omits roughly 36.8% of training rows. A row is predicted using only trees that did not train on it, and these votes are aggregated into an internal generalization estimate."
            },
            {
                question:
                    "Why do tree models generally not require scaling?",
                answer:
                    "Axis-aligned splits use ordering. A monotonic transformation changes numeric threshold values but preserves possible sample partitions. Imputation, encoding and leakage-safe preprocessing may still be necessary."
            },
            {
                question:
                    "How is a regression-tree split evaluated?",
                answer:
                    "A regression tree predicts the mean target in each node and selects a split that minimizes weighted squared error or variance, equivalently maximizing reduction from parent error to child error."
            },
            {
                question:
                    "What are limitations of impurity-based feature importance?",
                answer:
                    "It can favor continuous or high-cardinality features with many split opportunities and can distribute credit unpredictably among correlated features. Compare it with validation-set permutation importance and stability checks."
            },
            {
                question:
                    "When would you choose one tree instead of a random forest?",
                answer:
                    "Choose a shallow tree when a compact, directly inspectable decision policy and low inference cost are primary requirements. Choose a forest when stronger stability and tabular predictive performance justify additional memory, latency and explanation complexity."
            }
        ];

        container.innerHTML =
            questions.map.map(
                function (item, index) {
                    return (
                        '<article class="aiml-interview-item">' +

                        '<div class="aiml-interview-question">' +

                        "<span>" +
                        (index + 1) +
                        ".</span>" +

                        "<strong>" +
                        escapeHtml(
                            item.question
                        ) +
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
                }
            ).join("");

        container.addEventListener(
            "click",
            function (event) {
                const button =
                    event.target.closest(
                        "button"
                    );

                if (!button) return;

                const answer =
                    button
                        .closest(
                            ".aiml-interview-item"
                        )
                        .querySelector(
                            ".aiml-interview-answer"
                        );

                const opening =
                    answer.hidden;

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
                const link =
                    event.target.closest(
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

    function initLevelNine() {
        initSplitLab();
        initForestLab();
        initProgramTracer();
        initProgrammingProblems();
        initQuiz();
        initInterviewQuestions();
        initSmoothLocalLinks();
    }

    if (document.readyState === "loading") {
        document.addEventListener(
            "DOMContentLoaded",
            initLevelNine
        );
    } else {
        initLevelNine();
    }
}());
