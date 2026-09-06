(function () {
    "use strict";

    const LEVEL_PROGRESS_KEY = "codebhavya-aiml-level-13-progress-v1";
    const CLUSTER_COLORS = ["#22d3ee", "#fbbf24", "#a78bfa", "#34d399", "#fb7185"];

    function byId(id) {
        return document.getElementById(id);
    }

    function escapeHtml(value) {
        return String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/\"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    function clamp(value, minimum, maximum) {
        return Math.min(maximum, Math.max(minimum, value));
    }

    function fixed(value, digits) {
        return Number(value).toFixed(digits === undefined ? 3 : digits);
    }

    function mean(values) {
        return values.length
            ? values.reduce(function (sum, value) {
                return sum + value;
            }, 0) / values.length
            : 0;
    }

    function distance(a, b) {
        return Math.hypot(a.x - b.x, a.y - b.y);
    }

    function prepareCanvas(canvas, desktopHeight, mobileHeight) {
        const width = Math.max(280, canvas.clientWidth || 720);
        const height = width < 560 ? mobileHeight : desktopHeight;
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

    function roundedRect(context, x, y, width, height, radius) {
        const size = Math.min(
            radius,
            Math.abs(width) / 2,
            Math.abs(height) / 2
        );

        context.beginPath();
        context.moveTo(x + size, y);
        context.arcTo(x + width, y, x + width, y + height, size);
        context.arcTo(x + width, y + height, x, y + height, size);
        context.arcTo(x, y + height, x, y, size);
        context.arcTo(x, y, x + width, y, size);
        context.closePath();
    }

    function initKMeansVisualizer() {
        const canvas = byId("kmeansCanvas");
        if (!canvas) return;

        const datasets = {
            students: [
                [.13, .22], [.18, .29], [.23, .18],
                [.27, .32], [.31, .24],
                [.42, .71], [.48, .79], [.52, .68],
                [.57, .75], [.61, .64],
                [.70, .29], [.75, .21], [.79, .34],
                [.84, .27], [.88, .38]
            ],
            customers: [
                [.12, .72], [.18, .81], [.24, .68],
                [.29, .76], [.33, .86],
                [.43, .34], [.48, .43], [.54, .28],
                [.58, .38], [.62, .48],
                [.72, .72], [.77, .82], [.82, .67],
                [.87, .76], [.91, .86]
            ],
            unequal: [
                [.12, .23], [.16, .30], [.20, .18],
                [.23, .27], [.27, .21], [.30, .32],
                [.34, .25],
                [.55, .68], [.58, .76], [.62, .63],
                [.66, .71], [.69, .80], [.72, .66],
                [.76, .74],
                [.79, .58], [.83, .69], [.86, .81],
                [.89, .61], [.92, .74], [.68, .55]
            ]
        };

        const datasetInput = byId("kmeansDataset");
        const kInput = byId("kmeansK");
        const initInput = byId("kmeansInit");
        const nextButton = byId("kmeansNext");
        const autoButton = byId("kmeansAuto");
        const pauseButton = byId("kmeansPause");

        let points = [];
        let centroids = [];
        let assignments = [];
        let phase = "assign";
        let iteration = 0;
        let inertia = null;
        let movement = null;
        let timer = null;

        function asPoints(source) {
            return source.map(function (item) {
                return {
                    x: item[0],
                    y: item[1]
                };
            });
        }

        function chooseInitialCentroids() {
            const k = Number(kInput.value);
            const chosen = [];

            if (initInput.value === "spread") {
                const ordered = points.slice().sort(function (a, b) {
                    return a.x - b.x || a.y - b.y;
                });

                for (let index = 0; index < k; index += 1) {
                    chosen.push(
                        ordered[
                            Math.round(
                                index *
                                (ordered.length - 1) /
                                Math.max(1, k - 1)
                            )
                        ]
                    );
                }
            } else if (initInput.value === "random") {
                const offsets = [3, 10, 6, 13];

                for (let index = 0; index < k; index += 1) {
                    chosen.push(
                        points[offsets[index] % points.length]
                    );
                }
            } else {
                chosen.push(points[0]);

                while (chosen.length < k) {
                    let bestPoint = points[0];
                    let bestDistance = -1;

                    points.forEach(function (point) {
                        const nearest = Math.min.apply(
                            null,
                            chosen.map(function (centre) {
                                return distance(point, centre);
                            })
                        );

                        if (nearest > bestDistance) {
                            bestDistance = nearest;
                            bestPoint = point;
                        }
                    });

                    chosen.push(bestPoint);
                }
            }

            centroids = chosen.map(function (point) {
                return {
                    x: point.x,
                    y: point.y
                };
            });
        }

        function stopAuto() {
            if (timer !== null) {
                window.clearInterval(timer);
            }

            timer = null;
            pauseButton.disabled = true;
            autoButton.disabled = phase === "complete";
        }

        function assignPoints() {
            assignments = points.map(function (point) {
                let bestIndex = 0;
                let bestDistance = Infinity;

                centroids.forEach(function (centroid, index) {
                    const current = distance(point, centroid);

                    if (current < bestDistance) {
                        bestDistance = current;
                        bestIndex = index;
                    }
                });

                return bestIndex;
            });

            inertia = points.reduce(function (sum, point, index) {
                const currentDistance = distance(
                    point,
                    centroids[assignments[index]]
                );

                return sum + currentDistance * currentDistance;
            }, 0);

            phase = "update";
        }

        function updateCentroids() {
            const oldCentroids = centroids.map(function (centroid) {
                return {
                    x: centroid.x,
                    y: centroid.y
                };
            });

            centroids = centroids.map(function (centroid, clusterIndex) {
                const members = points.filter(function (_, pointIndex) {
                    return assignments[pointIndex] === clusterIndex;
                });

                if (!members.length) return centroid;

                return {
                    x: mean(members.map(function (point) {
                        return point.x;
                    })),
                    y: mean(members.map(function (point) {
                        return point.y;
                    }))
                };
            });

            movement = Math.max.apply(
                null,
                centroids.map(function (centroid, index) {
                    return distance(
                        centroid,
                        oldCentroids[index]
                    );
                })
            );

            iteration += 1;

            phase =
                movement < .002 || iteration >= 15
                    ? "complete"
                    : "assign";

            if (phase === "complete") {
                assignPoints();
                phase = "complete";
                stopAuto();
            }
        }

        function runStep() {
            if (phase === "complete") return;

            if (phase === "assign") {
                assignPoints();
            } else {
                updateCentroids();
            }

            render();
        }

        function clusterCounts() {
            return centroids.map(function (_, clusterIndex) {
                return assignments.filter(function (value) {
                    return value === clusterIndex;
                }).length;
            });
        }

        function draw() {
            const prepared = prepareCanvas(canvas, 455, 380);
            const context = prepared.context;
            const width = prepared.width;
            const height = prepared.height;
            const padding = width < 560 ? 28 : 40;
            const plotWidth = width - padding * 2;
            const plotHeight = height - padding * 2;

            const toCanvas = function (point) {
                return {
                    x: padding + point.x * plotWidth,
                    y: height - padding - point.y * plotHeight
                };
            };

            context.clearRect(0, 0, width, height);
            context.fillStyle = "#061426";
            context.fillRect(0, 0, width, height);

            context.strokeStyle = "#163651";
            context.lineWidth = 1;

            for (let step = 0; step <= 10; step += 1) {
                const x = padding + plotWidth * step / 10;
                const y = padding + plotHeight * step / 10;

                context.beginPath();
                context.moveTo(x, padding);
                context.lineTo(x, height - padding);
                context.stroke();

                context.beginPath();
                context.moveTo(padding, y);
                context.lineTo(width - padding, y);
                context.stroke();
            }

            if (assignments.length) {
                points.forEach(function (point, index) {
                    const pointPosition = toCanvas(point);
                    const centrePosition = toCanvas(
                        centroids[assignments[index]]
                    );

                    context.strokeStyle =
                        CLUSTER_COLORS[assignments[index]] + "44";

                    context.beginPath();
                    context.moveTo(
                        pointPosition.x,
                        pointPosition.y
                    );
                    context.lineTo(
                        centrePosition.x,
                        centrePosition.y
                    );
                    context.stroke();
                });
            }

            points.forEach(function (point, index) {
                const position = toCanvas(point);
                const cluster = assignments.length
                    ? assignments[index]
                    : -1;

                context.beginPath();
                context.arc(
                    position.x,
                    position.y,
                    7,
                    0,
                    Math.PI * 2
                );

                context.fillStyle =
                    cluster >= 0
                        ? CLUSTER_COLORS[cluster]
                        : "#94a3b8";

                context.fill();
                context.strokeStyle = "#eaf7ff";
                context.lineWidth = 2;
                context.stroke();
            });

            centroids.forEach(function (centroid, index) {
                const position = toCanvas(centroid);

                context.save();
                context.translate(position.x, position.y);
                context.rotate(Math.PI / 4);
                context.fillStyle = "#061426";
                context.strokeStyle = CLUSTER_COLORS[index];
                context.lineWidth = 4;
                context.fillRect(-11, -11, 22, 22);
                context.strokeRect(-11, -11, 22, 22);
                context.restore();

                context.fillStyle = "#ffffff";
                context.font =
                    "900 11px system-ui, sans-serif";
                context.textAlign = "center";

                context.fillText(
                    "C" + (index + 1),
                    position.x,
                    position.y + 4
                );
            });

            context.textAlign = "left";
        }

        function render() {
            byId("kmeansKValue").textContent =
                kInput.value;

            byId("kmeansPhase").textContent =
                phase === "assign"
                    ? "Assignment"
                    : phase === "update"
                        ? "Centroid update"
                        : "Converged";

            byId("kmeansIteration").textContent =
                String(iteration);

            byId("kmeansInertia").textContent =
                inertia === null
                    ? "—"
                    : fixed(inertia, 4);

            byId("kmeansMovement").textContent =
                movement === null
                    ? "—"
                    : fixed(movement, 4);

            nextButton.textContent =
                phase === "assign"
                    ? "Run Assignment"
                    : phase === "update"
                        ? "Update Centroids"
                        : "Converged";

            nextButton.disabled = phase === "complete";

            autoButton.disabled =
                phase === "complete" ||
                timer !== null;

            pauseButton.disabled = timer === null;

            const counts = clusterCounts();

            byId("kmeansClusterStats").innerHTML =
                centroids.map(function (_, index) {
                    return (
                        '<article>' +
                        '<i style="background:' +
                        CLUSTER_COLORS[index] +
                        '"></i>' +
                        "<b>Cluster " +
                        (index + 1) +
                        "</b>" +
                        "<span>" +
                        (
                            assignments.length
                                ? counts[index]
                                : "—"
                        ) +
                        " points</span>" +
                        "</article>"
                    );
                }).join("");

            if (phase === "complete") {
                const smallest = Math.min.apply(
                    null,
                    counts
                );

                const largest = Math.max.apply(
                    null,
                    counts
                );

                byId("kmeansVerdict").textContent =
                    "Converged after " +
                    iteration +
                    " update" +
                    (iteration === 1 ? "" : "s") +
                    " with inertia " +
                    fixed(inertia, 4) +
                    ".";

                byId("kmeansExplanation").textContent =
                    "Every point is assigned to its nearest final centroid. The compactness score is meaningful only relative to the same transformed dataset and K.";

                byId("kmeansNextCheck").textContent =
                    largest > smallest * 2
                        ? "Cluster sizes are imbalanced. Inspect geometry, outliers and whether K-Means assumptions are suitable."
                        : "Compare another K or initialization, then inspect silhouette, stability and original-feature profiles.";
            } else if (phase === "update") {
                byId("kmeansVerdict").textContent =
                    "Assignments are complete. The coloured lines show each nearest-centroid decision.";

                byId("kmeansExplanation").textContent =
                    "The next phase replaces each centroid with the mean position of its assigned observations.";

                byId("kmeansNextCheck").textContent =
                    "Predict the direction each centroid will move before selecting Update Centroids.";
            } else {
                byId("kmeansVerdict").textContent =
                    iteration
                        ? "Centroids moved. Reassign points using their new nearest centre."
                        : "Initial centroids are ready. Begin the assignment phase.";

                byId("kmeansExplanation").textContent =
                    "K-Means alternates two exact optimization steps; it does not move points gradually or use their hidden labels.";

                byId("kmeansNextCheck").textContent =
                    "Run assignment and inspect which boundaries changed.";
            }

            draw();
        }

        function reset() {
            stopAuto();

            points = asPoints(
                datasets[datasetInput.value]
            );

            assignments = [];
            phase = "assign";
            iteration = 0;
            inertia = null;
            movement = null;

            chooseInitialCentroids();
            render();
        }

        [datasetInput, initInput].forEach(function (input) {
            input.addEventListener("change", reset);
        });

        kInput.addEventListener("input", reset);
        nextButton.addEventListener("click", runStep);

        autoButton.addEventListener("click", function () {
            if (
                timer !== null ||
                phase === "complete"
            ) {
                return;
            }

            autoButton.disabled = true;
            pauseButton.disabled = false;

            timer = window.setInterval(runStep, 720);
        });

        pauseButton.addEventListener("click", function () {
            stopAuto();
            render();
        });

        byId("kmeansReset").addEventListener(
            "click",
            reset
        );

        canvas.addEventListener("click", function (event) {
            const bounds =
                canvas.getBoundingClientRect();

            const padding =
                bounds.width < 560 ? 28 : 40;

            const x = clamp(
                (
                    event.clientX -
                    bounds.left -
                    padding
                ) /
                Math.max(
                    1,
                    bounds.width - padding * 2
                ),
                .02,
                .98
            );

            const y = clamp(
                1 -
                (
                    event.clientY -
                    bounds.top -
                    padding
                ) /
                Math.max(
                    1,
                    bounds.height - padding * 2
                ),
                .02,
                .98
            );

            points.push({
                x: x,
                y: y
            });

            stopAuto();
            assignments = [];
            phase = "assign";
            iteration = 0;
            inertia = null;
            movement = null;

            chooseInitialCentroids();
            render();
        });

        window.addEventListener("resize", draw);

        reset();
    }

    function initDensityVisualizer() {
        const canvas = byId("densityCanvas");
        if (!canvas) return;

        const datasets = {
            moons: [
                [.13, .56], [.17, .66], [.23, .73],
                [.30, .77], [.38, .75], [.44, .68],
                [.48, .58], [.47, .47], [.42, .39],
                [.35, .34], [.28, .35],
                [.39, .52], [.44, .43], [.51, .37],
                [.59, .34], [.67, .36], [.74, .43],
                [.79, .53], [.80, .64], [.76, .72],
                [.69, .77], [.61, .76],
                [.12, .18], [.88, .20], [.88, .88]
            ],
            blobs: [
                [.16, .20], [.20, .27], [.23, .17],
                [.27, .25], [.30, .20], [.24, .31],
                [.43, .70], [.48, .78], [.52, .68],
                [.57, .74], [.60, .65], [.54, .82],
                [.72, .28], [.77, .35], [.81, .24],
                [.85, .32], [.89, .26], [.82, .40],
                [.08, .87], [.92, .79]
            ],
            variable: [
                [.16, .23], [.19, .28], [.22, .20],
                [.25, .25], [.20, .33], [.27, .31],
                [.30, .24],
                [.55, .60], [.61, .72], [.67, .58],
                [.72, .69], [.78, .56], [.83, .74],
                [.88, .63],
                [.58, .84], [.73, .42], [.91, .90],
                [.42, .20]
            ]
        };

        const datasetInput = byId("densityDataset");
        const epsilonInput = byId("densityEpsilon");
        const minPtsInput = byId("densityMinPts");
        const nextButton = byId("densityNext");
        const autoButton = byId("densityAuto");
        const pauseButton = byId("densityPause");

        let points = [];
        let roles = [];
        let steps = [];
        let position = 0;
        let selected = null;
        let timer = null;

        function epsilon() {
            return Number(epsilonInput.value) / 500;
        }

        function neighboursOf(index) {
            return points.map(function (point, otherIndex) {
                return distance(points[index], point) <= epsilon()
                    ? otherIndex
                    : -1;
            }).filter(function (indexValue) {
                return indexValue >= 0;
            });
        }

        function buildSteps() {
            const minPts = Number(minPtsInput.value);

            const neighbourhoods = points.map(function (_, index) {
                return neighboursOf(index);
            });

            roles = neighbourhoods.map(function (neighbours) {
                return neighbours.length >= minPts
                    ? "core"
                    : "unknown";
            });

            const visited = new Set();
            const labels =
                new Array(points.length).fill(-2);

            const snapshots = [{
                visited: [],
                labels: labels.slice(),
                message: "No point has been visited."
            }];

            let cluster = 0;

            for (
                let seed = 0;
                seed < points.length;
                seed += 1
            ) {
                if (visited.has(seed)) continue;

                visited.add(seed);

                const seedNeighbours =
                    neighbourhoods[seed];

                if (seedNeighbours.length < minPts) {
                    labels[seed] = -1;

                    snapshots.push({
                        visited: Array.from(visited),
                        labels: labels.slice(),
                        seed: seed,
                        message:
                            "Point " +
                            (seed + 1) +
                            " has only " +
                            seedNeighbours.length +
                            " neighbours, so it is temporarily noise."
                    });

                    continue;
                }

                labels[seed] = cluster;

                const queue = seedNeighbours.slice();
                const queued = new Set(queue);

                while (queue.length) {
                    const current = queue.shift();

                    if (!visited.has(current)) {
                        visited.add(current);

                        if (
                            neighbourhoods[current].length >=
                            minPts
                        ) {
                            neighbourhoods[current]
                                .forEach(function (candidate) {
                                    if (!queued.has(candidate)) {
                                        queue.push(candidate);
                                        queued.add(candidate);
                                    }
                                });
                        }
                    }

                    if (labels[current] < 0) {
                        labels[current] = cluster;
                    }
                }

                snapshots.push({
                    visited: Array.from(visited),
                    labels: labels.slice(),
                    seed: seed,
                    cluster: cluster,
                    message:
                        "Expanded density-connected cluster " +
                        (cluster + 1) +
                        " from core point " +
                        (seed + 1) +
                        "."
                });

                cluster += 1;
            }

            labels.forEach(function (label, index) {
                if (roles[index] !== "core") {
                    roles[index] =
                        label >= 0
                            ? "border"
                            : "noise";
                }
            });

            steps = snapshots;
        }

        function stopAuto() {
            if (timer !== null) {
                window.clearInterval(timer);
            }

            timer = null;
            pauseButton.disabled = true;

            autoButton.disabled =
                position >= steps.length - 1;
        }

        function draw() {
            const prepared =
                prepareCanvas(canvas, 455, 380);

            const context = prepared.context;
            const width = prepared.width;
            const height = prepared.height;
            const padding = width < 560 ? 28 : 40;
            const plotWidth = width - padding * 2;
            const plotHeight = height - padding * 2;
            const scale = Math.min(plotWidth, plotHeight);
            const currentState = steps[position];
            const visited =
                new Set(currentState.visited);

            const toCanvas = function (point) {
                return {
                    x: padding + point.x * plotWidth,
                    y: height -
                        padding -
                        point.y * plotHeight
                };
            };

            context.clearRect(0, 0, width, height);
            context.fillStyle = "#061426";
            context.fillRect(0, 0, width, height);

            context.strokeStyle = "#163651";

            for (let step = 0; step <= 10; step += 1) {
                const x =
                    padding + plotWidth * step / 10;

                const y =
                    padding + plotHeight * step / 10;

                context.beginPath();
                context.moveTo(x, padding);
                context.lineTo(x, height - padding);
                context.stroke();

                context.beginPath();
                context.moveTo(padding, y);
                context.lineTo(width - padding, y);
                context.stroke();
            }

            if (selected !== null) {
                const selectedPosition =
                    toCanvas(points[selected]);

                context.beginPath();

                context.arc(
                    selectedPosition.x,
                    selectedPosition.y,
                    epsilon() * scale,
                    0,
                    Math.PI * 2
                );

                context.fillStyle =
                    "rgba(34, 211, 238, .10)";

                context.fill();
                context.strokeStyle = "#22d3ee";
                context.setLineDash([6, 5]);
                context.stroke();
                context.setLineDash([]);
            }

            points.forEach(function (point, index) {
                const pointPosition = toCanvas(point);
                const label =
                    currentState.labels[index];

                const isVisited = visited.has(index);
                let color = "#64748b";

                if (isVisited && label >= 0) {
                    color =
                        CLUSTER_COLORS[
                            label %
                            CLUSTER_COLORS.length
                        ];
                } else if (
                    isVisited &&
                    label === -1
                ) {
                    color = "#fb7185";
                }

                context.beginPath();

                context.arc(
                    pointPosition.x,
                    pointPosition.y,
                    roles[index] === "core" ? 9 : 7,
                    0,
                    Math.PI * 2
                );

                context.fillStyle = color;
                context.fill();

                context.strokeStyle =
                    selected === index
                        ? "#ffffff"
                        : roles[index] === "core"
                            ? "#fde047"
                            : "#dbeafe";

                context.lineWidth =
                    selected === index ? 4 : 2;

                context.stroke();
                context.fillStyle = "#dbeafe";
                context.font =
                    "700 9px system-ui, sans-serif";
                context.textAlign = "center";

                context.fillText(
                    String(index + 1),
                    pointPosition.x,
                    pointPosition.y - 13
                );
            });

            context.textAlign = "left";
        }

        function render() {
            const currentState = steps[position];
            const visited =
                new Set(currentState.visited);

            const labels = currentState.labels;

            const clusterCount = new Set(
                labels.filter(function (label) {
                    return label >= 0;
                })
            ).size;

            const noiseCount = labels.filter(
                function (label, index) {
                    return (
                        visited.has(index) &&
                        label === -1
                    );
                }
            ).length;

            const coreCount = roles.filter(
                function (role, index) {
                    return (
                        role === "core" &&
                        visited.has(index)
                    );
                }
            ).length;

            byId("densityEpsilonValue").textContent =
                epsilonInput.value;

            byId("densityMinPtsValue").textContent =
                minPtsInput.value;

            byId("densityVisited").textContent =
                visited.size +
                " / " +
                points.length;

            byId("densityClusters").textContent =
                String(clusterCount);

            byId("densityCore").textContent =
                String(coreCount);

            byId("densityNoise").textContent =
                String(noiseCount);

            byId("densityVerdict").textContent =
                currentState.message;

            nextButton.disabled =
                position >= steps.length - 1;

            autoButton.disabled =
                position >= steps.length - 1 ||
                timer !== null;

            pauseButton.disabled = timer === null;

            if (selected === null) {
                byId("densityPointInfo").textContent =
                    "Select a point on the plot to inspect its ε-neighbourhood.";
            } else {
                const neighbours =
                    neighboursOf(selected);

                byId("densityPointInfo").innerHTML =
                    "<strong>Point " +
                    (selected + 1) +
                    "</strong><br>" +
                    "Neighbours including itself: " +
                    neighbours.length +
                    "<br>" +
                    "Final density role: " +
                    escapeHtml(roles[selected]) +
                    "<br>" +
                    "Neighbour IDs: " +
                    neighbours.map(function (index) {
                        return index + 1;
                    }).join(", ");
            }

            if (position >= steps.length - 1) {
                byId("densityExplanation").textContent =
                    "Expansion is complete. Core points create dense connectivity, border points attach to it and remaining observations stay noise.";

                byId("densityWarning").textContent =
                    clusterCount <= 1
                        ? "These settings merge most density into one group. Try a smaller ε or larger MinPts."
                        : noiseCount > points.length / 3
                            ? "Many points are noise. Inspect scaling and consider a larger ε or smaller MinPts."
                            : "Compare nearby settings and verify that the discovered shapes remain stable and useful.";

                stopAuto();
            } else {
                byId("densityExplanation").textContent =
                    "Each step processes an unvisited seed and, when it is core, expands through all density-connected core neighbourhoods.";

                byId("densityWarning").textContent =
                    "One global ε assumes reasonably comparable density.";
            }

            draw();
        }

        function advance() {
            if (position < steps.length - 1) {
                position += 1;
            }

            render();
        }

        function reset() {
            stopAuto();

            points = datasets[datasetInput.value].map(
                function (point) {
                    return {
                        x: point[0],
                        y: point[1]
                    };
                }
            );

            selected = null;
            position = 0;

            buildSteps();
            render();
        }

        datasetInput.addEventListener("change", reset);
        epsilonInput.addEventListener("input", reset);
        minPtsInput.addEventListener("input", reset);
        nextButton.addEventListener("click", advance);

        autoButton.addEventListener("click", function () {
            if (
                timer !== null ||
                position >= steps.length - 1
            ) {
                return;
            }

            autoButton.disabled = true;
            pauseButton.disabled = false;

            timer = window.setInterval(
                advance,
                760
            );
        });

        pauseButton.addEventListener("click", function () {
            stopAuto();
            render();
        });

        byId("densityReset").addEventListener(
            "click",
            reset
        );

        canvas.addEventListener("click", function (event) {
            const bounds =
                canvas.getBoundingClientRect();

            const padding =
                bounds.width < 560 ? 28 : 40;

            const clickPoint = {
                x: clamp(
                    (
                        event.clientX -
                        bounds.left -
                        padding
                    ) /
                    Math.max(
                        1,
                        bounds.width - padding * 2
                    ),
                    0,
                    1
                ),
                y: clamp(
                    1 -
                    (
                        event.clientY -
                        bounds.top -
                        padding
                    ) /
                    Math.max(
                        1,
                        bounds.height - padding * 2
                    ),
                    0,
                    1
                )
            };

            let closest = null;
            let closestDistance = Infinity;

            points.forEach(function (point, index) {
                const current =
                    distance(point, clickPoint);

                if (current < closestDistance) {
                    closestDistance = current;
                    closest = index;
                }
            });

            selected =
                closestDistance < .08
                    ? closest
                    : null;

            render();
        });

        window.addEventListener("resize", draw);

        reset();
    }

    function initProgramTracer() {
        const codeContainer = byId("tracerCode");
        const panel = byId("tracerPanel");
        const toggle = byId("tracerPanelToggle");

        if (!codeContainer || !panel || !toggle) return;

        const lines = [
            "points = [1, 2, 8, 9]",
            "centroids = [1, 8]",
            "for iteration in range(2):",
            "    clusters = [[], []]",
            "    for point in points:",
            "        distances = [abs(point - c) for c in centroids]",
            "        cluster = distances.index(min(distances))",
            "        clusters[cluster].append(point)",
            "    centroids = [sum(group) / len(group) for group in clusters]",
            "print(centroids)"
        ];

        function state(
            line,
            explanation,
            variables,
            expression,
            output
        ) {
            return {
                line: line,
                explanation: explanation,
                variables: variables || {},
                expression: expression || "—",
                output: output || ""
            };
        }

        function buildStates() {
            const states = [];
            const points = [1, 2, 8, 9];
            let centroids = [1, 8];

            states.push(
                state(
                    0,
                    "Create four one-dimensional observations.",
                    { points: points },
                    "[1, 2, 8, 9]"
                )
            );

            states.push(
                state(
                    1,
                    "Initialize two centroids at 1 and 8.",
                    {
                        points: points,
                        centroids: centroids
                    },
                    "K = 2"
                )
            );

            for (
                let iteration = 0;
                iteration < 2;
                iteration += 1
            ) {
                const clusters = [[], []];

                states.push(
                    state(
                        2,
                        "Enter K-Means iteration " +
                            (iteration + 1) +
                            ".",
                        {
                            iteration: iteration,
                            centroids:
                                centroids.slice()
                        },
                        "range(2)"
                    )
                );

                states.push(
                    state(
                        3,
                        "Create one empty member list per centroid.",
                        {
                            iteration: iteration,
                            centroids:
                                centroids.slice(),
                            clusters: [[], []]
                        },
                        "clusters = [[], []]"
                    )
                );

                points.forEach(
                    function (point, pointIndex) {
                        states.push(
                            state(
                                4,
                                "Read point " +
                                    point +
                                    " from the inner loop.",
                                {
                                    iteration:
                                        iteration,
                                    point_index:
                                        pointIndex,
                                    point: point,
                                    centroids:
                                        centroids.slice(),
                                    clusters:
                                        clusters.map(
                                            function (
                                                group
                                            ) {
                                                return group.slice();
                                            }
                                        )
                                },
                                "point = " + point
                            )
                        );

                        const distances =
                            centroids.map(
                                function (centroid) {
                                    return Math.abs(
                                        point -
                                        centroid
                                    );
                                }
                            );

                        states.push(
                            state(
                                5,
                                "Calculate the distance from point " +
                                    point +
                                    " to every centroid.",
                                {
                                    point: point,
                                    centroids:
                                        centroids.slice(),
                                    distances:
                                        distances.slice()
                                },
                                "[" +
                                    distances.join(", ") +
                                    "]"
                            )
                        );

                        const cluster =
                            distances.indexOf(
                                Math.min.apply(
                                    null,
                                    distances
                                )
                            );

                        states.push(
                            state(
                                6,
                                "Choose cluster " +
                                    cluster +
                                    " because it has the minimum distance.",
                                {
                                    point: point,
                                    distances:
                                        distances.slice(),
                                    cluster: cluster
                                },
                                "argmin = " +
                                    cluster
                            )
                        );

                        clusters[cluster].push(point);

                        states.push(
                            state(
                                7,
                                "Append point " +
                                    point +
                                    " to cluster " +
                                    cluster +
                                    ".",
                                {
                                    point: point,
                                    cluster: cluster,
                                    clusters:
                                        clusters.map(
                                            function (
                                                group
                                            ) {
                                                return group.slice();
                                            }
                                        )
                                },
                                "clusters[" +
                                    cluster +
                                    "].append(" +
                                    point +
                                    ")"
                            )
                        );
                    }
                );

                centroids = clusters.map(
                    function (group) {
                        return mean(group);
                    }
                );

                states.push(
                    state(
                        8,
                        "Update every centroid to the arithmetic mean of its assigned group.",
                        {
                            iteration: iteration,
                            clusters:
                                clusters.map(
                                    function (group) {
                                        return group.slice();
                                    }
                                ),
                            centroids:
                                centroids.slice()
                        },
                        "centroids = [" +
                            centroids.join(", ") +
                            "]"
                    )
                );
            }

            states.push(
                state(
                    9,
                    "Print the final centroids. Program execution is complete.",
                    {
                        centroids: centroids.slice()
                    },
                    "print(centroids)",
                    "[" +
                        centroids.join(", ") +
                        "]"
                )
            );

            return states;
        }

        const states = buildStates();
        const previous = byId("tracerPrevious");
        const next = byId("tracerNext");
        const auto = byId("tracerAuto");
        const pause = byId("tracerPause");
        const reset = byId("tracerReset");

        let step = 0;
        let timer = null;

        codeContainer.innerHTML = lines.map(
            function (line, index) {
                return (
                    '<div class="aiml-code-line" data-line="' +
                    index +
                    '">' +
                    "<span>" +
                    String(index + 1).padStart(
                        2,
                        "0"
                    ) +
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

        function formatValue(value) {
            if (value === null) return "None";

            if (typeof value === "number") {
                return Number.isInteger(value)
                    ? String(value)
                    : fixed(value, 3);
            }

            return JSON.stringify(value);
        }

        function render() {
            const atStart = step === 0;
            const atEnd = step >= states.length;

            const current =
                atStart
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

            byId("tracerStatus").textContent =
                atStart
                    ? "Ready"
                    : atEnd
                        ? "Complete"
                        : "Running";

            byId("tracerExplanation").textContent =
                current
                    ? current.explanation
                    : "Press Next to evaluate the first statement.";

            byId("tracerExpression").textContent =
                current
                    ? current.expression
                    : "—";

            byId("tracerOutput").textContent =
                current && current.output
                    ? current.output
                    : "Waiting for print(...)";

            const variables =
                current
                    ? current.variables
                    : {};

            byId("tracerVariables").innerHTML =
                Object.keys(variables).length
                    ? Object.keys(variables).map(
                        function (key) {
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
                        }
                    ).join("")
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

            pause.disabled = timer === null;

            byId("tracerProgress").textContent =
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

        previous.addEventListener(
            "click",
            function () {
                stop();
                step = Math.max(0, step - 1);
                render();
            }
        );

        next.addEventListener("click", advance);

        auto.addEventListener("click", function () {
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
                720
            );
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

    function initProgrammingProblems() {
        const list = byId("problemList");
        if (!list) return;

        const problems = [
            {
                title: "Assign Points to the Nearest Centroid",
                description: "Read one-dimensional points and centroids, then print the nearest centroid index for every point.",
                sampleInput: "points=[1,2,8,9], centroids=[1,8]",
                expected: "[0, 0, 1, 1]",
                hint: "For each point, build absolute distances and use the index of the minimum value.",
                starter: "points = [1, 2, 8, 9]\ncentroids = [1, 8]\n# Build nearest-centroid assignments\n",
                solution: "points = [1, 2, 8, 9]\ncentroids = [1, 8]\nassignments = []\nfor point in points:\n    distances = [abs(point - centroid) for centroid in centroids]\n    assignments.append(distances.index(min(distances)))\nprint(assignments)",
                required: [
                    ["for point in"],
                    ["abs("],
                    ["min("],
                    ["index("],
                    ["append("],
                    ["print("]
                ]
            },
            {
                title: "Update Cluster Centroids",
                description: "Given points and assignments, calculate the new mean position of every cluster.",
                sampleInput: "points=[1,2,8,9], labels=[0,0,1,1]",
                expected: "[1.5, 8.5]",
                hint: "Collect members for each cluster, then divide each group sum by its length.",
                starter: "points = [1, 2, 8, 9]\nlabels = [0, 0, 1, 1]\nk = 2\n# Recompute centroids\n",
                solution: "points = [1, 2, 8, 9]\nlabels = [0, 0, 1, 1]\nk = 2\nclusters = [[] for _ in range(k)]\nfor point, label in zip(points, labels):\n    clusters[label].append(point)\ncentroids = [sum(group) / len(group) for group in clusters]\nprint(centroids)",
                required: [
                    ["range(k)"],
                    ["zip("],
                    ["append("],
                    ["sum("],
                    ["len("],
                    ["centroids"],
                    ["print("]
                ]
            },
            {
                title: "Calculate K-Means Inertia",
                description: "Calculate the sum of squared distances from points to their assigned centroids.",
                sampleInput: "points=[1,2,8,9], labels=[0,0,1,1], centres=[1.5,8.5]",
                expected: "1.0",
                hint: "For every point, subtract the centroid selected by its label and square the difference.",
                starter: "points = [1, 2, 8, 9]\nlabels = [0, 0, 1, 1]\ncentroids = [1.5, 8.5]\n# Calculate inertia\n",
                solution: "points = [1, 2, 8, 9]\nlabels = [0, 0, 1, 1]\ncentroids = [1.5, 8.5]\ninertia = sum((point - centroids[label]) ** 2 for point, label in zip(points, labels))\nprint(inertia)",
                required: [
                    ["sum("],
                    ["centroids[label]"],
                    ["** 2", "**2"],
                    ["zip("],
                    ["inertia"],
                    ["print("]
                ]
            },
            {
                title: "Silhouette Value for One Point",
                description: "Calculate a point’s silhouette value from its mean within-cluster distance a and nearest-cluster distance b.",
                sampleInput: "a=2.0, b=5.0",
                expected: "0.6",
                hint: "Use (b-a)/max(a,b) and handle the zero-denominator case.",
                starter: "a = 2.0\nb = 5.0\n# Calculate the silhouette value\n",
                solution: "a = 2.0\nb = 5.0\ndenominator = max(a, b)\nsilhouette = (b - a) / denominator if denominator else 0.0\nprint(round(silhouette, 3))",
                required: [
                    ["max("],
                    ["b - a", "b-a"],
                    ["silhouette"],
                    ["round("],
                    ["print("]
                ]
            },
            {
                title: "Detect DBSCAN Core Points",
                description: "For one-dimensional observations, print which points have at least MinPts neighbours within epsilon.",
                sampleInput: "points=[1.0,1.2,1.4,4.8,5.0], eps=0.3, min_pts=2",
                expected: "Core point flags",
                hint: "Count observations whose absolute distance from the current point is at most eps.",
                starter: "points = [1.0, 1.2, 1.4, 4.8, 5.0]\neps = 0.3\nmin_pts = 2\n# Detect core points\n",
                solution: "points = [1.0, 1.2, 1.4, 4.8, 5.0]\neps = 0.3\nmin_pts = 2\ncore_flags = []\nfor point in points:\n    neighbours = sum(1 for other in points if abs(point - other) <= eps)\n    core_flags.append(neighbours >= min_pts)\nprint(core_flags)",
                required: [
                    ["for point in"],
                    ["abs("],
                    ["<= eps"],
                    ["sum("],
                    [">= min_pts"],
                    ["append("],
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

        function updateSummary() {
            const total = Object.values(scores)
                .reduce(function (sum, score) {
                    return sum +
                        Number(score || 0);
                }, 0);

            byId("problemSolvedCount").textContent =
                solved.size +
                " / " +
                problems.length;

            byId("problemScore").textContent =
                total +
                " / " +
                (problems.length * 100);

            byId("problemProgressBar").style.width =
                solved.size /
                problems.length *
                100 +
                "%";
        }

        list.innerHTML = problems.map(
            function (problem, index) {
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
                    "</code></span>" +
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
            }
        ).join("");

        function togglePanel(
            card,
            name,
            button,
            closedText,
            openText
        ) {
            const panel = card.querySelector(
                '[data-panel="' +
                name +
                '"]'
            );

            if (!panel) return;

            const opening = panel.hidden;
            panel.hidden = !opening;

            button.textContent =
                opening
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
                        "Not complete yet. Recheck the required loop, distance, update or output logic.";

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
                updateSummary();
            }
        });

        updateSummary();
    }

    function initQuiz() {
        const container = byId("quizQuestions");
        if (!container) return;

        const questions = [
            {
                question: "What makes clustering different from supervised classification?",
                options: [
                    "Clustering always uses more features",
                    "Clustering has no training target labels",
                    "Clustering cannot use distance",
                    "Clustering always produces probabilities"
                ],
                answer: 1,
                explanation: "Clustering receives feature representations without a target column and searches for internal organization."
            },
            {
                question: "Why is feature scaling important before Euclidean-distance clustering?",
                options: [
                    "It creates labels",
                    "It guarantees the global optimum",
                    "Large-unit features can dominate distance",
                    "It removes every outlier"
                ],
                answer: 2,
                explanation: "Distance depends on numerical scale. A large-range feature can control assignments even when that dominance is not meaningful."
            },
            {
                question: "Which two steps repeat in ordinary K-Means?",
                options: [
                    "Sort and prune",
                    "Assign and update",
                    "Encode and decode",
                    "Split and vote"
                ],
                answer: 1,
                explanation: "Points are assigned to their nearest centroid, then every centroid is updated to the mean of its assigned group."
            },
            {
                question: "What does K-Means inertia measure?",
                options: [
                    "Number of clusters",
                    "Sum of squared point-to-centroid distances",
                    "Classification accuracy",
                    "Probability calibration"
                ],
                answer: 1,
                explanation: "Inertia or WCSS measures within-cluster squared distance. It should only be compared for the same representation."
            },
            {
                question: "Why are several K-Means initializations useful?",
                options: [
                    "K-Means has local solutions",
                    "They remove the need for K",
                    "They convert hard labels to probabilities",
                    "They make scaling unnecessary"
                ],
                answer: 0,
                explanation: "The objective is non-convex, so different starting centroids can converge to different local minima."
            },
            {
                question: "Which linkage considers the farthest cross-cluster pair?",
                options: [
                    "Single",
                    "Complete",
                    "Average",
                    "Centroid initialization"
                ],
                answer: 1,
                explanation: "Complete linkage defines inter-cluster distance using the farthest pair and tends to favour compact clusters."
            },
            {
                question: "Which DBSCAN point independently satisfies the density condition?",
                options: [
                    "Core point",
                    "Border point",
                    "Noise point",
                    "Centroid"
                ],
                answer: 0,
                explanation: "A core point has at least MinPts observations in its epsilon neighbourhood."
            },
            {
                question: "What can happen when DBSCAN epsilon is increased strongly?",
                options: [
                    "Clusters can merge",
                    "Every core point disappears",
                    "K must increase",
                    "The data automatically rescales"
                ],
                answer: 0,
                explanation: "Larger neighbourhoods connect more points and can merge regions that were separate at a smaller epsilon."
            },
            {
                question: "What is the main output advantage of a Gaussian mixture model?",
                options: [
                    "It requires no component count",
                    "It gives soft membership probabilities",
                    "It always detects arbitrary shapes",
                    "It cannot model covariance"
                ],
                answer: 1,
                explanation: "GMM responsibilities express uncertainty by assigning a probability of component membership to every observation."
            },
            {
                question: "Which is the strongest way to evaluate an unlabeled clustering?",
                options: [
                    "Use inertia alone",
                    "Use only the largest cluster",
                    "Combine geometry, stability, profiling and domain utility",
                    "Treat cluster IDs as ground truth"
                ],
                answer: 2,
                explanation: "No single internal metric proves usefulness. Strong evaluation combines multiple quantitative and domain forms of evidence."
            }
        ];

        container.innerHTML = questions.map(
            function (item, questionIndex) {
                return (
                    '<article class="aiml-quiz-question" data-quiz-question="' +
                    questionIndex +
                    '">' +
                    "<strong>" +
                    (questionIndex + 1) +
                    ". " +
                    escapeHtml(item.question) +
                    "</strong>" +
                    '<div class="aiml-quiz-options">' +
                    item.options.map(
                        function (
                            option,
                            optionIndex
                        ) {
                            const id =
                                "quiz-thirteen-" +
                                questionIndex +
                                "-" +
                                optionIndex;

                            return (
                                '<label class="aiml-quiz-option" for="' +
                                id +
                                '">' +
                                '<input type="radio" id="' +
                                id +
                                '" name="quiz-thirteen-' +
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
                    '<div class="aiml-quiz-explanation" hidden></div>' +
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
                    .forEach(function (explanation) {
                        explanation.hidden = true;
                        explanation.textContent = "";
                    });

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
                question: "What is clustering, and how does it differ from classification?",
                answer: "Clustering discovers groups from feature structure without training labels. Classification learns a decision boundary from labelled examples and predicts known classes. Cluster IDs have no predefined semantic meaning and must be profiled after fitting."
            },
            {
                question: "Explain K-Means step by step.",
                answer: "Prepare scaled numerical features, initialize K centroids, assign each observation to its nearest centroid, update each centroid to the mean of its members and repeat until movement or assignments stabilize. Use K-Means++, several starts and a convergence limit."
            },
            {
                question: "Why can K-Means produce different answers on the same data?",
                answer: "Its objective is non-convex. Different initial centroids can place the algorithm in different local minima. K-Means++ and multiple initializations reduce this risk but do not prove a global optimum."
            },
            {
                question: "What are the main limitations of K-Means?",
                answer: "It requires K, depends strongly on feature scale, assumes the mean and squared Euclidean distance are meaningful, prefers compact roughly spherical groups, is sensitive to outliers and can struggle with unequal sizes, unequal densities and curved shapes."
            },
            {
                question: "How do you choose the number of clusters?",
                answer: "Compare inertia or elbow behaviour, silhouette, stability across seeds or resamples, cluster-size reasonableness, original-feature profiles and downstream utility. No single internal metric proves the correct K."
            },
            {
                question: "What is silhouette score?",
                answer: "For a point, a is its average distance to members of its own cluster and b is its smallest average distance to another cluster. The score is (b-a)/max(a,b), ranging approximately from -1 to 1. It measures cohesion relative to separation."
            },
            {
                question: "Compare single, complete, average and Ward linkage.",
                answer: "Single uses the nearest cross-pair and may chain. Complete uses the farthest pair and favours compact groups. Average uses mean cross-pair distance. Ward merges the pair producing the smallest increase in within-cluster variance and is commonly paired with Euclidean features."
            },
            {
                question: "Define core, border and noise points in DBSCAN.",
                answer: "A core point satisfies MinPts within epsilon. A border point lies in a core point’s epsilon neighbourhood but is not itself core. A noise point is not density-reachable from any core region under the selected settings."
            },
            {
                question: "How do epsilon and MinPts affect DBSCAN?",
                answer: "Larger epsilon or smaller MinPts makes density easier to satisfy, usually reducing noise and possibly merging clusters. Smaller epsilon or larger MinPts demands denser evidence, which may split groups or mark more points as noise."
            },
            {
                question: "Compare K-Means with Gaussian mixture models.",
                answer: "K-Means gives hard nearest-centroid assignments and represents each group by a mean under spherical squared-distance geometry. GMM estimates component means, covariance shapes and mixing weights, producing soft membership probabilities. Both need a component count and can reach local solutions."
            },
            {
                question: "How do you evaluate clustering without labels?",
                answer: "Use internal geometry such as silhouette or Davies–Bouldin, stability across seeds, samples and time, cluster-size and original-feature profiles, expert interpretation, fairness checks and measured downstream usefulness. Internal scores alone are insufficient."
            },
            {
                question: "How would you deploy a customer-segmentation model?",
                answer: "Freeze preprocessing and clustering together, version the representation, define how new customers receive a cluster or low-confidence flag, store profiles rather than treating IDs as permanent identities, monitor drift and cluster sizes, revalidate actions and fairness, and schedule evidence-based retraining."
            }
        ];

        container.innerHTML = questions.map(
            function (item, index) {
                return (
                    '<article class="aiml-interview-item">' +
                    '<div class="aiml-interview-question">' +
                    "<span>" +
                    (index + 1) +
                    ".</span>" +
                    "<strong>" +
                    escapeHtml(item.question) +
                    "</strong>" +
                    '<button type="button" aria-expanded="false">' +
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
                    event.target.closest("button");

                if (!button) return;

                const answer = button
                    .closest(".aiml-interview-item")
                    .querySelector(
                        ".aiml-interview-answer"
                    );

                const opening = answer.hidden;

                answer.hidden = !opening;

                button.textContent = opening
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

    function initLevelThirteen() {
        initKMeansVisualizer();
        initDensityVisualizer();
        initProgramTracer();
        initProgrammingProblems();
        initQuiz();
        initInterviewQuestions();
        initSmoothLocalLinks();
    }

    if (document.readyState === "loading") {
        document.addEventListener(
            "DOMContentLoaded",
            initLevelThirteen
        );
    } else {
        initLevelThirteen();
    }
}());
