(function () {
    "use strict";

    const PROGRESS_KEY = "codebhavya-aiml-level-15-progress-v1";
    const get = function (id) {
        return document.getElementById(id);
    };

    function escapeHtml(value) {
        return String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/\"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    function fixed(value, digits) {
        return Number(value).toFixed(digits === undefined ? 3 : digits);
    }

    function median(values) {
        const sorted = values.slice().sort(function (a, b) {
            return a - b;
        });
        const middle = Math.floor(sorted.length / 2);

        return sorted.length % 2
            ? sorted[middle]
            : (sorted[middle - 1] + sorted[middle]) / 2;
    }

    function distance(a, b) {
        return Math.hypot(a[0] - b[0], a[1] - b[1]);
    }

    function seededRandom(seed) {
        let state = seed >>> 0;

        return function () {
            state = (state * 1664525 + 1013904223) >>> 0;
            return state / 4294967296;
        };
    }

    function initScoreLab() {
        const canvas = get("anomalyCanvas");

        if (!canvas || canvas.dataset.cbActive) {
            return;
        }

        canvas.dataset.cbActive = "true";

        const datasets = {
            transactions: [
                [1.2, 2.0, 0],
                [1.7, 2.4, 0],
                [2.1, 1.8, 0],
                [2.4, 2.8, 0],
                [2.8, 2.3, 0],
                [3.1, 3.0, 0],
                [3.5, 2.6, 0],
                [3.8, 3.4, 0],
                [4.2, 3.0, 0],
                [4.5, 3.7, 0],
                [5.0, 3.5, 0],
                [5.3, 4.1, 0],
                [8.7, 8.2, 1],
                [9.2, 1.1, 1],
                [1.0, 8.7, 1]
            ],
            sensors: [
                [1.0, 1.2, 0],
                [1.5, 1.6, 0],
                [2.0, 2.1, 0],
                [2.4, 2.7, 0],
                [3.0, 3.1, 0],
                [3.4, 3.7, 0],
                [4.0, 4.1, 0],
                [4.4, 4.7, 0],
                [5.0, 5.1, 0],
                [5.6, 5.8, 0],
                [6.0, 6.1, 0],
                [6.5, 6.8, 0],
                [4.8, 1.0, 1],
                [8.7, 3.1, 1],
                [1.1, 7.9, 1]
            ],
            clusters: [
                [1.0, 1.2, 0],
                [1.3, 1.0, 0],
                [1.5, 1.4, 0],
                [1.7, 1.1, 0],
                [1.9, 1.5, 0],
                [2.1, 1.2, 0],
                [5.1, 5.2, 0],
                [5.8, 5.7, 0],
                [6.5, 5.0, 0],
                [7.1, 6.2, 0],
                [7.8, 5.5, 0],
                [8.4, 6.4, 0],
                [3.0, 1.4, 1],
                [5.9, 7.9, 1],
                [9.2, 2.0, 1]
            ],
            context: [
                [1.0, 2.0, 0],
                [1.6, 2.1, 0],
                [2.2, 2.0, 0],
                [2.8, 2.2, 0],
                [3.4, 2.1, 0],
                [4.0, 2.3, 0],
                [5.0, 6.5, 0],
                [5.7, 6.8, 0],
                [6.4, 6.6, 0],
                [7.1, 6.9, 0],
                [7.8, 6.7, 0],
                [8.5, 7.0, 0],
                [2.0, 6.7, 1],
                [6.8, 2.1, 1],
                [9.1, 4.0, 1]
            ]
        };

        const datasetInput = get("anomalyDataset");
        const methodInput = get("anomalyMethod");
        const contaminationInput = get("anomalyContamination");
        const nextButton = get("anomalyNext");
        const autoButton = get("anomalyAuto");
        const pauseButton = get("anomalyPause");
        const resetButton = get("anomalyReset");

        const phases = [
            "Raw events",
            "Reference geometry",
            "Neighbour evidence",
            "Anomaly scores",
            "Ranked candidates",
            "Threshold decision",
            "Complete"
        ];

        let step = 0;
        let timer = null;

        function pairwise(points) {
            return points.map(function (point, i) {
                return points.map(function (other, j) {
                    return i === j ? 0 : distance(point, other);
                });
            });
        }

        function robustScores(points) {
            const mx = median(points.map(function (point) {
                return point[0];
            }));

            const my = median(points.map(function (point) {
                return point[1];
            }));

            const madX = median(points.map(function (point) {
                return Math.abs(point[0] - mx);
            })) || 1;

            const madY = median(points.map(function (point) {
                return Math.abs(point[1] - my);
            })) || 1;

            return points.map(function (point) {
                const zx = (point[0] - mx) / (1.4826 * madX);
                const zy = (point[1] - my) / (1.4826 * madY);

                return Math.hypot(zx, zy);
            });
        }

        function knnScores(points) {
            const matrix = pairwise(points);

            return matrix.map(function (row, index) {
                return row
                    .filter(function (_, j) {
                        return j !== index;
                    })
                    .sort(function (a, b) {
                        return a - b;
                    })[2];
            });
        }

        function lofScores(points) {
            const k = 3;
            const matrix = pairwise(points);

            const neighbours = matrix.map(function (row, i) {
                return row
                    .map(function (value, j) {
                        return {
                            index: j,
                            value: value
                        };
                    })
                    .filter(function (item) {
                        return item.index !== i;
                    })
                    .sort(function (a, b) {
                        return a.value - b.value;
                    })
                    .slice(0, k);
            });

            const kDistance = neighbours.map(function (items) {
                return items[k - 1].value;
            });

            const lrd = neighbours.map(function (items, i) {
                const reachability = items.reduce(function (sum, item) {
                    return sum + Math.max(
                        kDistance[item.index],
                        matrix[i][item.index]
                    );
                }, 0);

                return k / Math.max(1e-9, reachability);
            });

            return neighbours.map(function (items, i) {
                return items.reduce(function (sum, item) {
                    return sum + (
                        lrd[item.index] / Math.max(1e-9, lrd[i])
                    );
                }, 0) / k;
            });
        }

        function expectedPathLength(size) {
            if (size <= 1) {
                return 0;
            }

            if (size === 2) {
                return 1;
            }

            return (
                2 * (Math.log(size - 1) + 0.5772156649) -
                2 * (size - 1) / size
            );
        }

        function isolationScores(points) {
            const trees = 36;
            const maxDepth = 8;
            const totalDepth = new Array(points.length).fill(0);

            for (let tree = 0; tree < trees; tree += 1) {
                const random = seededRandom(
                    997 + tree * 37 + datasetInput.selectedIndex * 101
                );

                points.forEach(function (_, targetIndex) {
                    let members = points.map(function (point, index) {
                        return {
                            point: point,
                            index: index
                        };
                    });

                    let depth = 0;

                    while (members.length > 1 && depth < maxDepth) {
                        const dimension = random() < 0.5 ? 0 : 1;

                        const values = members.map(function (item) {
                            return item.point[dimension];
                        });

                        const minimum = Math.min.apply(null, values);
                        const maximum = Math.max.apply(null, values);

                        if (maximum === minimum) {
                            break;
                        }

                        const split =
                            minimum +
                            (maximum - minimum) *
                            (0.15 + random() * 0.7);

                        const targetSide =
                            points[targetIndex][dimension] < split;

                        const selected = members.filter(function (item) {
                            return (
                                item.point[dimension] < split
                            ) === targetSide;
                        });

                        if (
                            !selected.length ||
                            selected.length === members.length
                        ) {
                            break;
                        }

                        members = selected;
                        depth += 1;
                    }

                    totalDepth[targetIndex] +=
                        depth + expectedPathLength(members.length);
                });
            }

            const normalizer =
                expectedPathLength(points.length) || 1;

            return totalDepth.map(function (total) {
                return Math.pow(
                    2,
                    -(total / trees) / normalizer
                );
            });
        }

        function calculate() {
            const source =
                datasets[datasetInput.value] ||
                datasets.transactions;

            const points = source.map(function (row) {
                return [row[0], row[1]];
            });

            const labels = source.map(function (row) {
                return row[2];
            });

            const methods = {
                robust: robustScores,
                knn: knnScores,
                lof: lofScores,
                isolation: isolationScores
            };

            const rawScores = methods[methodInput.value](points);
            const minimum = Math.min.apply(null, rawScores);
            const maximum = Math.max.apply(null, rawScores);

            const scores = rawScores.map(function (score) {
                return (
                    (score - minimum) /
                    Math.max(1e-9, maximum - minimum)
                );
            });

            const alertCount = Math.max(
                1,
                Math.ceil(
                    points.length *
                    Number(contaminationInput.value) /
                    100
                )
            );

            const ranking = scores
                .map(function (score, index) {
                    return {
                        index: index,
                        score: score
                    };
                })
                .sort(function (a, b) {
                    return b.score - a.score;
                });

            const alerts = new Set(
                ranking
                    .slice(0, alertCount)
                    .map(function (item) {
                        return item.index;
                    })
            );

            let tp = 0;
            let fp = 0;
            let fn = 0;

            labels.forEach(function (label, index) {
                if (alerts.has(index) && label === 1) {
                    tp += 1;
                }

                if (alerts.has(index) && label === 0) {
                    fp += 1;
                }

                if (!alerts.has(index) && label === 1) {
                    fn += 1;
                }
            });

            const precision = tp / Math.max(1, tp + fp);
            const recall = tp / Math.max(1, tp + fn);

            const f1 =
                2 * precision * recall /
                Math.max(1e-9, precision + recall);

            return {
                points: points,
                labels: labels,
                scores: scores,
                ranking: ranking,
                alerts: alerts,
                alertCount: alertCount,
                precision: precision,
                recall: recall,
                f1: f1
            };
        }

        function prepareCanvas() {
            const width = Math.max(
                280,
                canvas.clientWidth || 700
            );

            const height = width < 560 ? 385 : 465;
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

        function draw() {
            const result = calculate();
            const prepared = prepareCanvas();
            const context = prepared.context;
            const width = prepared.width;
            const height = prepared.height;
            const padding = width < 560 ? 38 : 50;

            const xs = result.points.map(function (point) {
                return point[0];
            });

            const ys = result.points.map(function (point) {
                return point[1];
            });

            const minX = Math.min.apply(null, xs) - 0.8;
            const maxX = Math.max.apply(null, xs) + 0.8;
            const minY = Math.min.apply(null, ys) - 0.8;
            const maxY = Math.max.apply(null, ys) + 0.8;

            function map(point) {
                return {
                    x:
                        padding +
                        (point[0] - minX) /
                        (maxX - minX) *
                        (width - padding * 2),

                    y:
                        height -
                        padding -
                        (point[1] - minY) /
                        (maxY - minY) *
                        (height - padding * 2)
                };
            }

            context.fillStyle = "#061426";
            context.fillRect(0, 0, width, height);

            context.strokeStyle = "#173852";
            context.lineWidth = 1;

            for (let line = 0; line <= 8; line += 1) {
                const x =
                    padding +
                    (width - padding * 2) *
                    line /
                    8;

                const y =
                    padding +
                    (height - padding * 2) *
                    line /
                    8;

                context.beginPath();
                context.moveTo(x, padding);
                context.lineTo(x, height - padding);
                context.stroke();

                context.beginPath();
                context.moveTo(padding, y);
                context.lineTo(width - padding, y);
                context.stroke();
            }

            if (step >= 3) {
                const focus = result.ranking[0].index;

                const neighbours = result.points
                    .map(function (point, index) {
                        return {
                            index: index,
                            value: distance(
                                result.points[focus],
                                point
                            )
                        };
                    })
                    .filter(function (item) {
                        return item.index !== focus;
                    })
                    .sort(function (a, b) {
                        return a.value - b.value;
                    })
                    .slice(0, 3);

                const from = map(result.points[focus]);

                context.setLineDash([6, 5]);
                context.strokeStyle =
                    "rgba(250,204,21,.7)";

                neighbours.forEach(function (item) {
                    const to = map(
                        result.points[item.index]
                    );

                    context.beginPath();
                    context.moveTo(from.x, from.y);
                    context.lineTo(to.x, to.y);
                    context.stroke();
                });

                context.setLineDash([]);
            }

            result.points.forEach(function (point, index) {
                const position = map(point);

                if (step >= 4) {
                    const radius =
                        13 + result.scores[index] * 18;

                    const gradient =
                        context.createRadialGradient(
                            position.x,
                            position.y,
                            2,
                            position.x,
                            position.y,
                            radius
                        );

                    gradient.addColorStop(
                        0,
                        "rgba(251,79,94," +
                        (
                            0.35 +
                            result.scores[index] * 0.4
                        ) +
                        ")"
                    );

                    gradient.addColorStop(
                        1,
                        "rgba(251,79,94,0)"
                    );

                    context.fillStyle = gradient;
                    context.beginPath();

                    context.arc(
                        position.x,
                        position.y,
                        radius,
                        0,
                        Math.PI * 2
                    );

                    context.fill();
                }

                context.beginPath();

                context.arc(
                    position.x,
                    position.y,
                    result.alerts.has(index) &&
                    step >= 6
                        ? 9
                        : 7,
                    0,
                    Math.PI * 2
                );

                context.fillStyle =
                    result.alerts.has(index) &&
                    step >= 6
                        ? "#fb4f5e"
                        : "#22d3ee";

                context.fill();

                context.strokeStyle = "#f8fafc";
                context.lineWidth = 2;
                context.stroke();

                context.fillStyle = "#cfe7fb";
                context.font = "700 11px Arial";

                context.fillText(
                    String(index + 1),
                    position.x + 10,
                    position.y - 8
                );
            });

            context.fillStyle = "#9fc3df";
            context.font = "600 12px Arial";

            context.fillText(
                datasetInput.value === "context"
                    ? "Context / time"
                    : "Feature 1",
                padding,
                height - 14
            );

            context.save();
            context.translate(15, height - padding);
            context.rotate(-Math.PI / 2);
            context.fillText("Feature 2", 0, 0);
            context.restore();

            if (step === 0) {
                context.fillStyle =
                    "rgba(6,20,38,.92)";

                context.fillRect(
                    width / 2 - 185,
                    18,
                    370,
                    48
                );

                context.strokeStyle = "#2b6389";

                context.strokeRect(
                    width / 2 - 185,
                    18,
                    370,
                    48
                );

                context.fillStyle = "#cfe7fb";
                context.font = "700 15px Arial";
                context.textAlign = "center";

                context.fillText(
                    "Raw event preview • begin the detection workflow",
                    width / 2,
                    48
                );

                context.textAlign = "left";
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
            const result = calculate();
            const atEnd = step >= phases.length;

            const methodNames = {
                robust: "Robust distance",
                knn: "k-NN distance",
                lof: "Local density ratio",
                isolation: "Isolation score"
            };

            const messages = [
                [
                    "Raw observations are ready.",
                    "Begin by inspecting geometry before trusting a score.",
                    "Which points are globally remote, and which are only locally unusual?"
                ],
                [
                    "Raw events reveal scale, groups and extreme values.",
                    "No anomaly decision has been made yet.",
                    "Predict whether a global or local method suits this geometry."
                ],
                [
                    "The reference geometry has been fitted.",
                    "Location, spread or pairwise distances now define normality evidence.",
                    "Check whether preprocessing lets both features contribute fairly."
                ],
                [
                    "Neighbour evidence has been calculated.",
                    "Dashed lines expose the nearest reference points for the strongest candidate.",
                    "Would a dense local group change the candidate’s interpretation?"
                ],
                [
                    methodNames[methodInput.value] +
                    " scores are available.",
                    "Larger normalized values indicate stronger abnormality under the selected method.",
                    "Compare the top candidates before applying a cut-off."
                ],
                [
                    "Candidates are ranked continuously.",
                    "Ranking preserves information that a binary alert label would hide.",
                    "Choose an alert fraction using cost and review capacity."
                ],
                [
                    result.alertCount +
                    " events cross the operating threshold.",
                    "Red alerts are the highest-ranked observations, not guaranteed errors.",
                    "Inspect precision and recall, then review false alerts."
                ],
                [
                    "Detection analysis is complete.",
                    "Change the method or alert fraction and explain why the decision changes.",
                    "Which detector remains stable across plausible settings?"
                ]
            ];

            const message =
                messages[
                    Math.min(
                        step,
                        messages.length - 1
                    )
                ];

            get("anomalyContaminationValue").textContent =
                contaminationInput.value + "%";

            get("anomalyPhase").textContent =
                step === 0
                    ? "Ready"
                    : phases[
                        Math.min(
                            step - 1,
                            phases.length - 1
                        )
                    ];

            get("anomalyAlerts").textContent =
                step >= 6
                    ? result.alertCount +
                    " / " +
                    result.points.length
                    : "—";

            get("anomalyPrecision").textContent =
                step >= 6
                    ? fixed(result.precision, 2)
                    : "—";

            get("anomalyRecall").textContent =
                step >= 6
                    ? fixed(result.recall, 2)
                    : "—";

            get("anomalyF1").textContent =
                step >= 6
                    ? fixed(result.f1, 2)
                    : "—";

            get("anomalyVerdict").textContent =
                message[0];

            get("anomalyExplanation").textContent =
                message[1];

            get("anomalyNextCheck").textContent =
                message[2];

            get("anomalyRanking").innerHTML =
                step >= 4
                    ? result.ranking
                        .slice(0, 6)
                        .map(function (item, rank) {
                            return (
                                '<article class="' +
                                (
                                    step >= 6 &&
                                    result.alerts.has(item.index)
                                        ? "is-alert"
                                        : ""
                                ) +
                                '">' +
                                "<b>#" +
                                (rank + 1) +
                                " • P" +
                                (item.index + 1) +
                                "</b>" +
                                '<i><span style="width:' +
                                Math.round(item.score * 100) +
                                '%"></span></i>' +
                                "<strong>" +
                                fixed(item.score, 2) +
                                "</strong>" +
                                "</article>"
                            );
                        })
                        .join("")
                    : (
                        "<article>" +
                        "<b>RANKING</b>" +
                        '<i><span style="width:0"></span></i>' +
                        "<strong>Waiting</strong>" +
                        "</article>"
                    );

            nextButton.textContent =
                atEnd
                    ? "Detection Complete"
                    : step === 0
                        ? "Inspect Raw Events"
                        : "Next: " + phases[step];

            nextButton.disabled = atEnd;
            autoButton.disabled =
                atEnd || timer !== null;

            pauseButton.disabled =
                timer === null;

            if (atEnd) {
                stop();
            }

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

        nextButton.addEventListener(
            "click",
            advance
        );

        autoButton.addEventListener(
            "click",
            function () {
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
            }
        );

        pauseButton.addEventListener(
            "click",
            function () {
                stop();
                render();
            }
        );

        resetButton.addEventListener(
            "click",
            reset
        );

        [
            datasetInput,
            methodInput,
            contaminationInput
        ].forEach(function (input) {
            input.addEventListener(
                "input",
                reset
            );

            input.addEventListener(
                "change",
                reset
            );
        });

        window.addEventListener("resize", draw);

        render();
        window.requestAnimationFrame(draw);
    }

    function initIsolationLab() {
        const canvas = get("isolationCanvas");

        if (
            !canvas ||
            canvas.dataset.cbActive
        ) {
            return;
        }

        canvas.dataset.cbActive = "true";

        const targetInput = get("isolationTarget");
        const seedInput = get("isolationSeed");
        const nextButton = get("isolationNext");
        const autoButton = get("isolationAuto");
        const pauseButton = get("isolationPause");
        const resetButton = get("isolationReset");

        const points = [
            [1.2, 2.1],
            [1.8, 2.5],
            [2.3, 1.8],
            [3.1, 3.0],
            [3.5, 2.4],
            [4.0, 3.6],
            [4.5, 3.0],
            [5.0, 3.8],
            [5.6, 4.3],
            [4.8, 4.8],
            [6.0, 3.5],
            [8.7, 1.0]
        ];

        const targets = {
            anomaly: 11,
            border: 8,
            normal: 3
        };

        let step = 0;
        let timer = null;
        let path = [];

        function buildPath() {
            const targetIndex =
                targets[targetInput.value];

            const random = seededRandom(
                Number(seedInput.value)
            );

            let members = points.map(
                function (_, index) {
                    return index;
                }
            );

            let bounds = {
                minX: 0.5,
                maxX: 9.3,
                minY: 0.5,
                maxY: 5.4
            };

            const output = [];

            for (
                let depth = 0;
                depth < 9 && members.length > 1;
                depth += 1
            ) {
                let dimension =
                    random() < 0.5 ? 0 : 1;

                let values = members.map(
                    function (index) {
                        return points[index][dimension];
                    }
                );

                let minimum =
                    Math.min.apply(null, values);

                let maximum =
                    Math.max.apply(null, values);

                if (minimum === maximum) {
                    dimension = 1 - dimension;

                    values = members.map(
                        function (index) {
                            return points[index][dimension];
                        }
                    );

                    minimum =
                        Math.min.apply(null, values);

                    maximum =
                        Math.max.apply(null, values);
                }

                if (minimum === maximum) {
                    break;
                }

                const split =
                    minimum +
                    (maximum - minimum) *
                    (0.18 + random() * 0.64);

                const goesLower =
                    points[targetIndex][dimension] <
                    split;

                const selected = members.filter(
                    function (index) {
                        return (
                            points[index][dimension] <
                            split
                        ) === goesLower;
                    }
                );

                if (
                    !selected.length ||
                    selected.length === members.length
                ) {
                    continue;
                }

                const nextBounds = {
                    minX: bounds.minX,
                    maxX: bounds.maxX,
                    minY: bounds.minY,
                    maxY: bounds.maxY
                };

                if (dimension === 0) {
                    if (goesLower) {
                        nextBounds.maxX = split;
                    } else {
                        nextBounds.minX = split;
                    }
                } else {
                    if (goesLower) {
                        nextBounds.maxY = split;
                    } else {
                        nextBounds.minY = split;
                    }
                }

                output.push({
                    depth: depth + 1,
                    dimension: dimension,
                    split: split,
                    before: members.slice(),
                    after: selected.slice(),
                    boundsBefore: bounds,
                    boundsAfter: nextBounds
                });

                members = selected;
                bounds = nextBounds;
            }

            return output;
        }

        function prepareCanvas() {
            const width = Math.max(
                280,
                canvas.clientWidth || 700
            );

            const height =
                width < 560 ? 385 : 465;

            const ratio =
                window.devicePixelRatio || 1;

            canvas.style.height =
                height + "px";

            canvas.width =
                Math.round(width * ratio);

            canvas.height =
                Math.round(height * ratio);

            const context =
                canvas.getContext("2d");

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

        function draw() {
            const prepared = prepareCanvas();
            const context = prepared.context;
            const width = prepared.width;
            const height = prepared.height;
            const padding = width < 560 ? 38 : 50;

            const targetIndex =
                targets[targetInput.value];

            const active = step
                ? path[
                    Math.min(step, path.length) - 1
                ]
                : null;

            function map(point) {
                return {
                    x:
                        padding +
                        (point[0] - 0.5) /
                        8.8 *
                        (width - padding * 2),

                    y:
                        height -
                        padding -
                        (point[1] - 0.5) /
                        4.9 *
                        (height - padding * 2)
                };
            }

            context.fillStyle = "#061426";
            context.fillRect(0, 0, width, height);

            context.strokeStyle = "#173852";
            context.lineWidth = 1;

            for (let line = 0; line <= 8; line += 1) {
                const x =
                    padding +
                    (width - padding * 2) *
                    line /
                    8;

                const y =
                    padding +
                    (height - padding * 2) *
                    line /
                    8;

                context.beginPath();
                context.moveTo(x, padding);
                context.lineTo(x, height - padding);
                context.stroke();

                context.beginPath();
                context.moveTo(padding, y);
                context.lineTo(width - padding, y);
                context.stroke();
            }

            if (active) {
                const topLeft = map([
                    active.boundsAfter.minX,
                    active.boundsAfter.maxY
                ]);

                const bottomRight = map([
                    active.boundsAfter.maxX,
                    active.boundsAfter.minY
                ]);

                context.fillStyle =
                    "rgba(34,211,238,.08)";

                context.fillRect(
                    topLeft.x,
                    topLeft.y,
                    bottomRight.x - topLeft.x,
                    bottomRight.y - topLeft.y
                );

                context.strokeStyle =
                    "rgba(34,211,238,.65)";

                context.lineWidth = 2;

                context.strokeRect(
                    topLeft.x,
                    topLeft.y,
                    bottomRight.x - topLeft.x,
                    bottomRight.y - topLeft.y
                );
            }

            path
                .slice(0, step)
                .forEach(function (item, index) {
                    context.strokeStyle =
                        index === step - 1
                            ? "#facc15"
                            : "rgba(167,139,250,.62)";

                    context.lineWidth =
                        index === step - 1
                            ? 3
                            : 1.5;

                    context.setLineDash(
                        index === step - 1
                            ? []
                            : [5, 4]
                    );

                    if (item.dimension === 0) {
                        const x = map([
                            item.split,
                            0
                        ]).x;

                        const y1 = map([
                            0,
                            item.boundsBefore.maxY
                        ]).y;

                        const y2 = map([
                            0,
                            item.boundsBefore.minY
                        ]).y;

                        context.beginPath();
                        context.moveTo(x, y1);
                        context.lineTo(x, y2);
                        context.stroke();
                    } else {
                        const y = map([
                            0,
                            item.split
                        ]).y;

                        const x1 = map([
                            item.boundsBefore.minX,
                            0
                        ]).x;

                        const x2 = map([
                            item.boundsBefore.maxX,
                            0
                        ]).x;

                        context.beginPath();
                        context.moveTo(x1, y);
                        context.lineTo(x2, y);
                        context.stroke();
                    }
                });

            context.setLineDash([]);

            points.forEach(function (point, index) {
                const position = map(point);

                context.beginPath();

                context.arc(
                    position.x,
                    position.y,
                    index === targetIndex ? 10 : 7,
                    0,
                    Math.PI * 2
                );

                context.fillStyle =
                    index === targetIndex
                        ? "#fb4f5e"
                        : "#22d3ee";

                context.fill();

                context.strokeStyle = "#f8fafc";

                context.lineWidth =
                    index === targetIndex ? 3 : 2;

                context.stroke();

                context.fillStyle = "#cfe7fb";
                context.font = "700 11px Arial";

                context.fillText(
                    "P" + (index + 1),
                    position.x + 10,
                    position.y - 8
                );
            });

            if (!step) {
                context.fillStyle =
                    "rgba(6,20,38,.92)";

                context.fillRect(
                    width / 2 - 170,
                    18,
                    340,
                    48
                );

                context.strokeStyle = "#2b6389";

                context.strokeRect(
                    width / 2 - 170,
                    18,
                    340,
                    48
                );

                context.fillStyle = "#cfe7fb";
                context.font = "700 15px Arial";
                context.textAlign = "center";

                context.fillText(
                    "Selected target is highlighted in red",
                    width / 2,
                    48
                );

                context.textAlign = "left";
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
            path = buildPath();

            if (step > path.length) {
                step = path.length;
            }

            const complete =
                path.length > 0 &&
                step >= path.length;

            const current =
                step ? path[step - 1] : null;

            const remaining =
                current
                    ? current.after.length
                    : points.length;

            get("isolationDepth").textContent =
                step;

            get("isolationRemaining").textContent =
                remaining;

            get("isolationPathVerdict").textContent =
                complete
                    ? (
                        path.length <= 3
                            ? "Short • suspicious"
                            : "Longer • normal-like"
                    )
                    : "In progress";

            get("isolationVerdict").textContent =
                !step
                    ? "The complete dataset is visible."
                    : complete
                        ? (
                            "The target is isolated after " +
                            path.length +
                            " splits."
                        )
                        : (
                            "Split " +
                            step +
                            " keeps " +
                            remaining +
                            " candidate points."
                        );

            get("isolationExplanation").textContent =
                !current
                    ? "Each step chooses a feature and random split inside the current region containing the target."
                    : (
                        "Depth " +
                        current.depth +
                        " uses feature " +
                        (current.dimension + 1) +
                        " < " +
                        fixed(current.split, 2) +
                        ". The target follows the " +
                        (
                            points[
                                targets[targetInput.value]
                            ][current.dimension] <
                            current.split
                                ? "lower"
                                : "upper"
                        ) +
                        " branch."
                    );

            get("isolationNextCheck").textContent =
                complete
                    ? "Compare this depth with another target and another tree seed."
                    : "Predict whether the next random partition will isolate the target.";

            get("isolationPath").innerHTML =
                path
                    .slice(0, Math.max(1, step))
                    .map(function (item, index) {
                        return (
                            '<article class="' +
                            (
                                index === step - 1
                                    ? "is-current"
                                    : ""
                            ) +
                            '">' +
                            "Depth " +
                            item.depth +
                            ": feature " +
                            (item.dimension + 1) +
                            " &lt; " +
                            fixed(item.split, 2) +
                            " • " +
                            item.after.length +
                            " point" +
                            (
                                item.after.length === 1
                                    ? ""
                                    : "s"
                            ) +
                            " remain" +
                            "</article>"
                        );
                    })
                    .join("");

            nextButton.textContent =
                complete
                    ? "Target Isolated"
                    : step === 0
                        ? "Apply First Split"
                        : "Apply Next Split";

            nextButton.disabled = complete;

            autoButton.disabled =
                complete || timer !== null;

            pauseButton.disabled =
                timer === null;

            if (complete) {
                stop();
            }

            draw();
        }

        function advance() {
            if (step < path.length) {
                step += 1;
            }

            render();
        }

        function reset() {
            stop();
            step = 0;
            render();
        }

        nextButton.addEventListener(
            "click",
            advance
        );

        autoButton.addEventListener(
            "click",
            function () {
                if (
                    step >= path.length ||
                    timer !== null
                ) {
                    return;
                }

                timer = window.setInterval(
                    advance,
                    850
                );

                render();
            }
        );

        pauseButton.addEventListener(
            "click",
            function () {
                stop();
                render();
            }
        );

        resetButton.addEventListener(
            "click",
            reset
        );

        [
            targetInput,
            seedInput
        ].forEach(function (input) {
            input.addEventListener(
                "change",
                reset
            );
        });

        window.addEventListener("resize", draw);

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
            "points = [[1, 1], [2, 1], [2, 2], [8, 8]]",
            "k = 2",
            "scores = []",
            "for i in range(len(points)):",
            "    distances = []",
            "    for j in range(len(points)):",
            "        if i == j:",
            "            continue",
            "        dx = points[i][0] - points[j][0]",
            "        dy = points[i][1] - points[j][1]",
            "        d = (dx ** 2 + dy ** 2) ** 0.5",
            "        distances.append(d)",
            "    distances.sort()",
            "    scores.append(distances[k - 1])",
            "threshold = max(scores)",
            "labels = []",
            "for score in scores:",
            "    labels.append(score >= threshold)",
            "print(labels)"
        ];

        function clone(value) {
            return JSON.parse(JSON.stringify(value));
        }

        function buildStates() {
            const states = [];

            const points = [
                [1, 1],
                [2, 1],
                [2, 2],
                [8, 8]
            ];

            const k = 2;
            const scores = [];

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
                "Create four two-dimensional observations.",
                {
                    points: points
                },
                "points has 4 rows"
            );

            add(
                1,
                "Use the second-nearest neighbour as the anomaly score.",
                {
                    k: k
                },
                "k = 2"
            );

            add(
                2,
                "Create the score list.",
                {
                    scores: scores
                },
                "scores = []"
            );

            for (
                let i = 0;
                i < points.length;
                i += 1
            ) {
                const distances = [];

                add(
                    3,
                    "Enter the outer loop for point i = " +
                    i +
                    ".",
                    {
                        i: i,
                        point: points[i],
                        scores: scores
                    },
                    "range(4) gives " + i
                );

                add(
                    4,
                    "Create a fresh distance list for this point.",
                    {
                        i: i,
                        distances: distances,
                        scores: scores
                    },
                    "distances = []"
                );

                for (
                    let j = 0;
                    j < points.length;
                    j += 1
                ) {
                    add(
                        5,
                        "Enter the inner loop with j = " +
                        j +
                        ".",
                        {
                            i: i,
                            j: j,
                            distances: distances
                        },
                        "compare P" +
                        (i + 1) +
                        " with P" +
                        (j + 1)
                    );

                    add(
                        6,
                        "Check whether both indexes refer to the same point.",
                        {
                            i: i,
                            j: j
                        },
                        i +
                        " == " +
                        j +
                        " is " +
                        String(i === j)
                    );

                    if (i === j) {
                        add(
                            7,
                            "Skip self-distance and return to the inner loop.",
                            {
                                i: i,
                                j: j,
                                distances: distances
                            },
                            "continue"
                        );

                        continue;
                    }

                    const dx =
                        points[i][0] -
                        points[j][0];

                    add(
                        8,
                        "Calculate the horizontal difference.",
                        {
                            i: i,
                            j: j,
                            dx: dx
                        },
                        points[i][0] +
                        " - " +
                        points[j][0] +
                        " = " +
                        dx
                    );

                    const dy =
                        points[i][1] -
                        points[j][1];

                    add(
                        9,
                        "Calculate the vertical difference.",
                        {
                            i: i,
                            j: j,
                            dx: dx,
                            dy: dy
                        },
                        points[i][1] +
                        " - " +
                        points[j][1] +
                        " = " +
                        dy
                    );

                    const d = Math.hypot(dx, dy);

                    add(
                        10,
                        "Calculate Euclidean distance.",
                        {
                            i: i,
                            j: j,
                            dx: dx,
                            dy: dy,
                            d: d
                        },
                        "sqrt(" +
                        dx +
                        "² + " +
                        dy +
                        "²) = " +
                        fixed(d, 3)
                    );

                    distances.push(d);

                    add(
                        11,
                        "Append the distance and return to the inner loop.",
                        {
                            i: i,
                            j: j,
                            distances: distances
                        },
                        "append(" +
                        fixed(d, 3) +
                        ")"
                    );
                }

                distances.sort(function (a, b) {
                    return a - b;
                });

                add(
                    12,
                    "Sort distances from nearest to farthest.",
                    {
                        i: i,
                        distances: distances
                    },
                    JSON.stringify(
                        distances.map(function (value) {
                            return Number(fixed(value, 3));
                        })
                    )
                );

                const score = distances[k - 1];

                scores.push(score);

                add(
                    13,
                    "Append the second-neighbour distance as this point's score.",
                    {
                        i: i,
                        score: score,
                        scores: scores
                    },
                    "distances[1] = " +
                    fixed(score, 3)
                );
            }

            const threshold =
                Math.max.apply(null, scores);

            add(
                14,
                "Use the largest score as a one-alert demonstration threshold.",
                {
                    scores: scores,
                    threshold: threshold
                },
                "max(scores) = " +
                fixed(threshold, 3)
            );

            const labels = [];

            add(
                15,
                "Create the anomaly label list.",
                {
                    threshold: threshold,
                    labels: labels
                },
                "labels = []"
            );

            scores.forEach(function (score) {
                add(
                    16,
                    "Enter the threshold loop for score " +
                    fixed(score, 3) +
                    ".",
                    {
                        score: score,
                        threshold: threshold,
                        labels: labels
                    },
                    fixed(score, 3) +
                    " >= " +
                    fixed(threshold, 3)
                );

                labels.push(score >= threshold);

                add(
                    17,
                    "Append the threshold decision and return to the loop.",
                    {
                        score: score,
                        threshold: threshold,
                        labels: labels
                    },
                    String(score >= threshold)
                );
            });

            add(
                18,
                "Print the labels. The remote fourth point is detected.",
                {
                    scores: scores,
                    threshold: threshold,
                    labels: labels
                },
                "print(labels)",
                JSON.stringify(labels)
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
            if (value === null) {
                return "None";
            }

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

            const current =
                atStart ? null : states[step - 1];

            codeContainer
                .querySelectorAll(".aiml-code-line")
                .forEach(function (line, index) {
                    line.classList.toggle(
                        "is-active",
                        Boolean(
                            current &&
                            index === current.line
                        )
                    );

                    line.classList.toggle(
                        "is-complete",
                        Boolean(
                            current &&
                            index < current.line
                        )
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
                                    formatValue(variables[key])
                                ) +
                                "</code>" +
                                "</article>"
                            );
                        })
                        .join("")
                    : (
                        '<article class="aiml-variable">' +
                        "<span>STATE</span>" +
                        "<code>Not started</code>" +
                        "</article>"
                    );

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

            if (atEnd) {
                stop();
            }
        }

        function advance() {
            if (step < states.length) {
                step += 1;
            }

            render();
        }

        toggle.addEventListener(
            "click",
            function () {
                const opening = panel.hidden;

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

                timer = window.setInterval(
                    advance,
                    650
                );

                render();
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

    function initProblems() {
        const list = get("problemList");

        if (
            !list ||
            list.dataset.cbActive
        ) {
            return;
        }

        list.dataset.cbActive = "true";

        const problems = [
            {
                title: "Flag Values with the IQR Rule",
                description: "Calculate quartile fences and print values outside them.",
                sampleInput: "values=[10,11,10,12,13,60]",
                expected: "[60]",
                hint: "Sort values, calculate Q1 and Q3, then test the lower and upper fences.",
                starter:
                    "values = [10, 11, 10, 12, 13, 60]\n" +
                    "# Calculate IQR fences and print anomalies\n",
                solution:
                    "values = [10, 11, 10, 12, 13, 60]\n" +
                    "ordered = sorted(values)\n" +
                    "q1 = 10\n" +
                    "q3 = 13\n" +
                    "iqr = q3 - q1\n" +
                    "lower = q1 - 1.5 * iqr\n" +
                    "upper = q3 + 1.5 * iqr\n" +
                    "anomalies = [value for value in values if value < lower or value > upper]\n" +
                    "print(anomalies)",
                required: [
                    ["sorted("],
                    ["q1"],
                    ["q3"],
                    ["iqr"],
                    ["lower"],
                    ["upper"],
                    ["print("]
                ]
            },
            {
                title: "Calculate Robust MAD Scores",
                description: "Use the median and MAD to score every observation.",
                sampleInput: "values=[10,11,10,12,60]",
                expected: "five robust scores",
                hint: "Find the median, then the median of absolute deviations.",
                starter:
                    "values = [10, 11, 10, 12, 60]\n" +
                    "# Calculate median, MAD and robust scores\n",
                solution:
                    "values = [10, 11, 10, 12, 60]\n" +
                    "ordered = sorted(values)\n" +
                    "median = ordered[len(ordered) // 2]\n" +
                    "deviations = [abs(value - median) for value in values]\n" +
                    "mad = sorted(deviations)[len(deviations) // 2]\n" +
                    "scores = [abs(value - median) / mad for value in values]\n" +
                    "print(scores)",
                required: [
                    ["sorted("],
                    ["median"],
                    ["abs("],
                    ["mad"],
                    ["for value in"],
                    ["print("]
                ]
            },
            {
                title: "Build k-NN Anomaly Scores",
                description: "Use the second-nearest distance as each 2-D point's score.",
                sampleInput: "points=[[1,1],[2,1],[2,2],[8,8]], k=2",
                expected: "one score per point",
                hint: "Skip self-comparisons, sort distances and select distances[k-1].",
                starter:
                    "points = [[1, 1], [2, 1], [2, 2], [8, 8]]\n" +
                    "k = 2\n" +
                    "# Calculate one k-NN score per point\n",
                solution:
                    "points = [[1, 1], [2, 1], [2, 2], [8, 8]]\n" +
                    "k = 2\n" +
                    "scores = []\n" +
                    "for i in range(len(points)):\n" +
                    "    distances = []\n" +
                    "    for j in range(len(points)):\n" +
                    "        if i == j:\n" +
                    "            continue\n" +
                    "        dx = points[i][0] - points[j][0]\n" +
                    "        dy = points[i][1] - points[j][1]\n" +
                    "        distances.append((dx ** 2 + dy ** 2) ** 0.5)\n" +
                    "    distances.sort()\n" +
                    "    scores.append(distances[k - 1])\n" +
                    "print(scores)",
                required: [
                    ["for i in range"],
                    ["for j in range"],
                    ["if i == j", "if i==j"],
                    ["continue"],
                    ["** 2", "**2"],
                    ["sort("],
                    ["k - 1", "k-1"],
                    ["print("]
                ]
            },
            {
                title: "Apply a Top-K Alert Budget",
                description: "Return indexes of the three largest anomaly scores.",
                sampleInput: "scores=[0.1,0.8,0.2,0.9,0.6], budget=3",
                expected: "[3,1,4]",
                hint: "Pair each score with its index and sort pairs in descending score order.",
                starter:
                    "scores = [0.1, 0.8, 0.2, 0.9, 0.6]\n" +
                    "budget = 3\n" +
                    "# Return indexes of the largest scores\n",
                solution:
                    "scores = [0.1, 0.8, 0.2, 0.9, 0.6]\n" +
                    "budget = 3\n" +
                    "ranked = sorted(range(len(scores)), key=lambda index: scores[index], reverse=True)\n" +
                    "alerts = ranked[:budget]\n" +
                    "print(alerts)",
                required: [
                    ["sorted("],
                    ["range(len(scores))"],
                    ["key="],
                    ["reverse=true"],
                    [":budget"],
                    ["print("]
                ]
            },
            {
                title: "Evaluate Rare-Event Alerts",
                description: "Calculate precision, recall and F1 from true and predicted labels.",
                sampleInput: "truth=[0,1,0,1,1], pred=[0,1,1,0,1]",
                expected: "precision=0.667 recall=0.667 f1=0.667",
                hint: "Count TP, FP and FN before applying the three formulas.",
                starter:
                    "truth = [0, 1, 0, 1, 1]\n" +
                    "pred = [0, 1, 1, 0, 1]\n" +
                    "# Calculate precision, recall and F1\n",
                solution:
                    "truth = [0, 1, 0, 1, 1]\n" +
                    "pred = [0, 1, 1, 0, 1]\n" +
                    "tp = sum(t == 1 and p == 1 for t, p in zip(truth, pred))\n" +
                    "fp = sum(t == 0 and p == 1 for t, p in zip(truth, pred))\n" +
                    "fn = sum(t == 1 and p == 0 for t, p in zip(truth, pred))\n" +
                    "precision = tp / (tp + fp)\n" +
                    "recall = tp / (tp + fn)\n" +
                    "f1 = 2 * precision * recall / (precision + recall)\n" +
                    "print(round(precision, 3), round(recall, 3), round(f1, 3))",
                required: [
                    ["zip("],
                    ["tp"],
                    ["fp"],
                    ["fn"],
                    ["precision"],
                    ["recall"],
                    ["f1"],
                    ["print("]
                ]
            }
        ];

        let saved = {};

        try {
            saved = JSON.parse(
                window.localStorage.getItem(
                    PROGRESS_KEY
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
            const total = Object.values(scores)
                .reduce(function (sum, score) {
                    return sum + Number(score || 0);
                }, 0);

            get("problemSolvedCount").textContent =
                solved.size +
                " / " +
                problems.length;

            get("problemScore").textContent =
                total +
                " / " +
                (problems.length * 100);

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

                    "<span><strong>Expected output:</strong> " +
                    "<code>" +
                    escapeHtml(problem.expected) +
                    "</code>" +
                    "</span>" +
                    "</div>" +

                    '<div class="aiml-problem-actions">' +
                    '<button type="button" class="primary" data-action="workspace">' +
                    "💻 Solve It Yourself" +
                    "</button>" +

                    '<button type="button" class="hint" data-action="hint">' +
                    "Hint" +
                    "</button>" +

                    '<button type="button" data-action="solution">' +
                    "Show Program" +
                    "</button>" +
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
                    '<button type="button" data-action="check">' +
                    "Check Answer" +
                    "</button>" +

                    '<button type="button" data-action="reset">' +
                    "Reset" +
                    "</button>" +

                    '<span class="aiml-check-result" data-result>' +
                    "Write your solution, then check its structure." +
                    "</span>" +
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
            const section =
                card.querySelector(
                    '[data-panel="' +
                    name +
                    '"]'
                );

            if (!section) {
                return;
            }

            const opening = section.hidden;

            section.hidden = !opening;

            button.textContent =
                opening
                    ? openText
                    : closedText;
        }

        list.addEventListener(
            "click",
            function (event) {
                const button =
                    event.target.closest(
                        "button[data-action]"
                    );

                if (!button) {
                    return;
                }

                const card =
                    button.closest(
                        ".aiml-problem-card"
                    );

                const index =
                    Number(card.dataset.problem);

                const problem =
                    problems[index];

                const action =
                    button.dataset.action;

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
                            "Not complete yet. Recheck the required detection logic.";

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
            }
        );

        updateSummary();
    }

    function initQuiz() {
        const container = get("quizQuestions");

        if (
            !container ||
            container.dataset.cbActive
        ) {
            return;
        }

        container.dataset.cbActive = "true";

        const questions = [
            [
                "What is a contextual anomaly?",
                [
                    "A value that is always invalid",
                    "An observation unusual only under particular conditions",
                    "Any missing value",
                    "The largest training row"
                ],
                1,
                "Context such as time, location or user history can make an otherwise ordinary value abnormal."
            ],
            [
                "Why can a classical z-score fail under heavy contamination?",
                [
                    "It uses no arithmetic",
                    "Outliers can distort the mean and standard deviation",
                    "It requires labels",
                    "It always returns zero"
                ],
                1,
                "Extreme observations pull the mean and inflate standard deviation, which can hide their own deviation."
            ],
            [
                "What does contamination usually represent?",
                [
                    "Expected abnormal fraction",
                    "Feature count",
                    "Tree depth",
                    "Learning rate"
                ],
                0,
                "Contamination is an estimate or assumption about the fraction of outliers used by some thresholding procedures."
            ],
            [
                "Why are shorter Isolation Forest paths suspicious?",
                [
                    "Rare extreme points are easier to isolate",
                    "They have more labels",
                    "They always have missing values",
                    "Short paths mean high density"
                ],
                0,
                "Unusual points often separate from the main data after fewer random partitions."
            ],
            [
                "What does LOF compare?",
                [
                    "Training and test accuracy",
                    "A point's local density with its neighbours' densities",
                    "Only global mean values",
                    "Two class probabilities"
                ],
                1,
                "LOF identifies points whose local reachability density is substantially below nearby observations."
            ],
            [
                "When is novelty detection most appropriate?",
                [
                    "Training data is largely clean normal behaviour",
                    "All anomalies are fully labelled",
                    "No reference data exists",
                    "Every point is abnormal"
                ],
                0,
                "Novelty detection learns a boundary from representative normal training examples."
            ],
            [
                "What is the anomaly score in a basic autoencoder detector?",
                [
                    "Number of layers",
                    "Reconstruction error",
                    "Batch size",
                    "Class count"
                ],
                1,
                "Inputs that the learned normal representation reconstructs poorly receive larger errors."
            ],
            [
                "Why is accuracy misleading for rare anomalies?",
                [
                    "It cannot be calculated",
                    "Predicting everything as normal can produce high accuracy",
                    "It equals recall",
                    "It ignores normal rows"
                ],
                1,
                "With very low prevalence, a useless all-normal predictor can still have excellent accuracy."
            ],
            [
                "What should control an operational alert threshold?",
                [
                    "Only the training mean",
                    "Missed-event cost, false-alert cost and review capacity",
                    "The alphabetic order of features",
                    "The number of code lines"
                ],
                1,
                "Thresholding is an operational decision that balances harm and available response resources."
            ],
            [
                "What is a safe production retraining practice?",
                [
                    "Treat all recent events as normal",
                    "Use guarded data and reviewed feedback while monitoring drift",
                    "Remove threshold monitoring",
                    "Train on future observations"
                ],
                1,
                "Unreviewed failures or attacks can contaminate the new definition of normal."
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
                        .map(function (option, optionIndex) {
                            const id =
                                "quiz-fifteen-" +
                                questionIndex +
                                "-" +
                                optionIndex;

                            return (
                                '<label class="aiml-quiz-option" for="' +
                                id +
                                '">' +

                                '<input type="radio" id="' +
                                id +
                                '" name="quiz-fifteen-' +
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
                            option.contains(event.target)
                        );
                    });
            }
        );

        get("checkQuiz").addEventListener(
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
                            function (option, optionIndex) {
                                option.classList.remove(
                                    "is-correct",
                                    "is-wrong"
                                );

                                if (
                                    optionIndex === item[2]
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
                                            Number(selected.value)
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
                    }
                );

                get("quizScore").textContent =
                    correct +
                    " / " +
                    questions.length +
                    " correct" +
                    (
                        answered < questions.length
                            ? (
                                " • " +
                                (
                                    questions.length -
                                    answered
                                ) +
                                " not attempted"
                            )
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

        if (
            !container ||
            container.dataset.cbActive
        ) {
            return;
        }

        container.dataset.cbActive = "true";

        const questions = [
            [
                "What is anomaly detection?",
                "It assigns evidence of abnormality relative to a defined reference population and context. A complete system turns that score into a cost-aware action and learns from reviewed outcomes."
            ],
            [
                "Differentiate point, contextual and collective anomalies.",
                "A point anomaly is individually unusual; a contextual anomaly is unusual only under conditions such as time or user; a collective anomaly is suspicious because a sequence or group pattern is unusual."
            ],
            [
                "Why use median and MAD instead of mean and standard deviation?",
                "Median and MAD resist extreme contamination, so the reference centre and scale are not pulled strongly toward the anomalies being detected."
            ],
            [
                "Explain Isolation Forest.",
                "It builds randomized partition trees. Rare, extreme points tend to be isolated with shorter paths. Scores are calculated from normalized average path length across many trees."
            ],
            [
                "How does LOF work?",
                "LOF estimates local reachability density and compares it with neighbour densities. Values substantially above one indicate that the point is less dense than its local neighbourhood."
            ],
            [
                "Isolation Forest versus LOF?",
                "Isolation Forest is efficient for general tabular anomalies and uses random partition depth. LOF is neighbour-based and can detect local outliers in varying-density data, but distance quality and prediction mode require care."
            ],
            [
                "What does ν mean in One-Class SVM?",
                "ν controls a bound related to the expected training outlier fraction and support-vector fraction. It influences boundary tightness but is not a guaranteed future anomaly rate."
            ],
            [
                "How do autoencoders detect anomalies?",
                "Train a constrained network to reconstruct representative normal inputs, use reconstruction error as the score, and validate a threshold on held-out evidence."
            ],
            [
                "Why is accuracy unsuitable for anomaly detection?",
                "Anomalies are usually rare, so predicting every case as normal can produce high accuracy. Use precision, recall, PR-AUC, top-K recall and operational cost."
            ],
            [
                "How would you choose an anomaly threshold?",
                "Use labelled validation where available, missed-event and false-alert costs, acceptable alert rate, review capacity and stability across time or segments."
            ],
            [
                "What is the difference between novelty and outlier detection?",
                "Novelty detection assumes fitting data represents normality and scores new observations. Outlier detection expects contaminated fitting data and identifies unusual rows within it."
            ],
            [
                "Design a production fraud-detection pipeline.",
                "Define transaction and context features, use chronological splits, fit preprocessing and scoring on protected data, rank alerts, choose a review-budget threshold, capture investigator feedback, monitor drift and keep safe escalation rules."
            ]
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
                    escapeHtml(item[0]) +
                    "</strong>" +

                    '<button type="button" aria-expanded="false">' +
                    "Show Answer" +
                    "</button>" +
                    "</div>" +

                    '<div class="aiml-interview-answer" hidden>' +
                    "<p>" +
                    escapeHtml(item[1]) +
                    "</p>" +
                    "</div>" +

                    "</article>"
                );
            })
            .join("");

        container.addEventListener(
            "click",
            function (event) {
                const button =
                    event.target.closest(
                        ".aiml-interview-question button"
                    );

                if (!button) {
                    return;
                }

                const answer =
                    button
                        .closest(".aiml-interview-item")
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

    function init() {
        initScoreLab();
        initIsolationLab();
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
