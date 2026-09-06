(function () {
    "use strict";

    function start() {
        const canvas = document.getElementById("pcaCanvas");
        if (!canvas) return;

        const testContext = canvas.getContext("2d");

        try {
            if (
                canvas.width > 300 &&
                canvas.height > 150 &&
                testContext.getImageData(0, 0, 1, 1).data[3] > 0
            ) {
                return;
            }
        } catch (error) {
            /* Continue with the independent renderer. */
        }

        const get = function (id) {
            return document.getElementById(id);
        };

        const datasetInput = get("pcaDataset");
        const preprocessInput = get("pcaPreprocess");
        const componentInput = get("pcaComponents");
        const nextButton = get("pcaNext");
        const autoButton = get("pcaAuto");
        const pauseButton = get("pcaPause");
        const resetButton = get("pcaReset");

        if (
            !datasetInput ||
            !preprocessInput ||
            !componentInput ||
            !nextButton ||
            !autoButton ||
            !pauseButton ||
            !resetButton
        ) {
            return;
        }

        const datasets = {
            correlated: [
                [1, 1.2, 0],
                [1.5, 1.7, 0],
                [2.1, 2, 0],
                [2.7, 2.9, 0],
                [3.2, 3, 0],
                [3.7, 3.9, 0],
                [4.3, 4.1, 0],
                [4.8, 5, 0],
                [5.4, 5.1, 0],
                [6, 6.2, 0]
            ],

            wide: [
                [1, 118, 0],
                [2, 155, 0],
                [3, 205, 0],
                [4, 238, 0],
                [5, 302, 0],
                [6, 347, 0],
                [7, 405, 0],
                [8, 442, 0],
                [9, 518, 0]
            ],

            outlier: [
                [1, 1.3, 0],
                [1.7, 1.6, 0],
                [2.2, 2.4, 0],
                [2.8, 2.6, 0],
                [3.4, 3.6, 0],
                [4, 3.8, 0],
                [4.7, 4.8, 0],
                [5.2, 5, 0],
                [8.6, 1, 1]
            ],

            classes: [
                [1, 1, 0],
                [2, 1.2, 0],
                [3, 1.1, 0],
                [4, 1.3, 0],
                [5, 1.2, 0],
                [1.2, 2, 1],
                [2.1, 2.2, 1],
                [3.2, 2.1, 1],
                [4.1, 2.3, 1],
                [5.2, 2.2, 1]
            ]
        };

        const phases = [
            "Raw geometry",
            "Preprocessed coordinates",
            "Covariance matrix",
            "Principal directions",
            "Projected scores",
            "Reconstruction",
            "Complete"
        ];

        const colors = [
            "#22d3ee",
            "#fbbf24",
            "#a78bfa",
            "#34d399"
        ];

        let step = 0;
        let timer = null;

        function mean(values) {
            return values.reduce(function (sum, value) {
                return sum + value;
            }, 0) / values.length;
        }

        function dot(a, b) {
            return a[0] * b[0] + a[1] * b[1];
        }

        function format(value, digits) {
            return Number(value).toFixed(digits);
        }

        function calculate() {
            const source =
                datasets[datasetInput.value] ||
                datasets.correlated;

            const raw = source.map(function (point) {
                return [point[0], point[1]];
            });

            const labels = source.map(function (point) {
                return point[2] || 0;
            });

            const means = [
                mean(raw.map(function (row) {
                    return row[0];
                })),
                mean(raw.map(function (row) {
                    return row[1];
                }))
            ];

            const scales = [0, 1].map(function (column) {
                const variance = raw.reduce(function (sum, row) {
                    return (
                        sum +
                        Math.pow(
                            row[column] - means[column],
                            2
                        )
                    );
                }, 0) / Math.max(1, raw.length - 1);

                return preprocessInput.value === "standardize"
                    ? Math.sqrt(variance) || 1
                    : 1;
            });

            const prepared = raw.map(function (row) {
                return [
                    (row[0] - means[0]) / scales[0],
                    (row[1] - means[1]) / scales[1]
                ];
            });

            const covariance = [
                [0, 0],
                [0, 0]
            ];

            const denominator = Math.max(
                1,
                prepared.length - 1
            );

            prepared.forEach(function (row) {
                covariance[0][0] +=
                    row[0] * row[0] / denominator;

                covariance[0][1] +=
                    row[0] * row[1] / denominator;

                covariance[1][0] +=
                    row[1] * row[0] / denominator;

                covariance[1][1] +=
                    row[1] * row[1] / denominator;
            });

            const a = covariance[0][0];
            const b = covariance[0][1];
            const d = covariance[1][1];

            const root = Math.sqrt(
                Math.pow(a - d, 2) + 4 * b * b
            );

            const eigenvalues = [
                (a + d + root) / 2,
                (a + d - root) / 2
            ];

            let pc1;

            if (Math.abs(b) > 1e-10) {
                pc1 = [
                    b,
                    eigenvalues[0] - a
                ];
            } else {
                pc1 = a >= d
                    ? [1, 0]
                    : [0, 1];
            }

            const length =
                Math.hypot(pc1[0], pc1[1]) || 1;

            pc1 = [
                pc1[0] / length,
                pc1[1] / length
            ];

            if (pc1[0] < 0) {
                pc1 = [
                    -pc1[0],
                    -pc1[1]
                ];
            }

            const vectors = [
                pc1,
                [-pc1[1], pc1[0]]
            ];

            const scores = prepared.map(function (row) {
                return [
                    dot(row, vectors[0]),
                    dot(row, vectors[1])
                ];
            });

            const retained =
                Number(componentInput.value);

            const reconstructedPrepared =
                scores.map(function (score) {
                    const output = [0, 0];

                    for (
                        let component = 0;
                        component < retained;
                        component += 1
                    ) {
                        output[0] +=
                            score[component] *
                            vectors[component][0];

                        output[1] +=
                            score[component] *
                            vectors[component][1];
                    }

                    return output;
                });

            const reconstructedRaw =
                reconstructedPrepared.map(function (row) {
                    return [
                        row[0] * scales[0] + means[0],
                        row[1] * scales[1] + means[1]
                    ];
                });

            const error = raw.reduce(
                function (sum, row, index) {
                    return (
                        sum +
                        Math.pow(
                            row[0] -
                            reconstructedRaw[index][0],
                            2
                        ) +
                        Math.pow(
                            row[1] -
                            reconstructedRaw[index][1],
                            2
                        )
                    );
                },
                0
            );

            const total = Math.max(
                1e-12,
                eigenvalues[0] + eigenvalues[1]
            );

            return {
                raw: raw,
                labels: labels,
                prepared: prepared,
                covariance: covariance,
                eigenvalues: eigenvalues,
                vectors: vectors,
                reconstructedPrepared:
                    reconstructedPrepared,
                reconstructedRaw:
                    reconstructedRaw,
                ratios: [
                    eigenvalues[0] / total,
                    eigenvalues[1] / total
                ],
                retained: retained,
                rmse: Math.sqrt(
                    error / (raw.length * 2)
                )
            };
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
            const result = calculate();
            const preparedCanvas = prepareCanvas();
            const context = preparedCanvas.context;
            const width = preparedCanvas.width;
            const height = preparedCanvas.height;

            const padding =
                width < 560 ? 38 : 50;

            const usePrepared = step >= 2;

            const points = usePrepared
                ? result.prepared
                : result.raw;

            const reconstructions = usePrepared
                ? result.reconstructedPrepared
                : result.reconstructedRaw;

            const allPoints = points.concat(
                step >= 6
                    ? reconstructions
                    : []
            );

            const xs = allPoints.map(function (row) {
                return row[0];
            });

            const ys = allPoints.map(function (row) {
                return row[1];
            });

            let minX = Math.min.apply(null, xs);
            let maxX = Math.max.apply(null, xs);
            let minY = Math.min.apply(null, ys);
            let maxY = Math.max.apply(null, ys);

            const xGap = Math.max(
                0.5,
                (maxX - minX) * 0.18
            );

            const yGap = Math.max(
                0.5,
                (maxY - minY) * 0.18
            );

            minX -= xGap;
            maxX += xGap;
            minY -= yGap;
            maxY += yGap;

            function mapPoint(row) {
                return {
                    x:
                        padding +
                        (row[0] - minX) /
                        Math.max(1e-9, maxX - minX) *
                        (width - padding * 2),

                    y:
                        height -
                        padding -
                        (row[1] - minY) /
                        Math.max(1e-9, maxY - minY) *
                        (height - padding * 2)
                };
            }

            context.fillStyle = "#061426";
            context.fillRect(
                0,
                0,
                width,
                height
            );

            context.strokeStyle = "#173852";
            context.lineWidth = 1;

            for (
                let index = 0;
                index <= 8;
                index += 1
            ) {
                const x =
                    padding +
                    (width - padding * 2) *
                    index / 8;

                const y =
                    padding +
                    (height - padding * 2) *
                    index / 8;

                context.beginPath();
                context.moveTo(x, padding);
                context.lineTo(
                    x,
                    height - padding
                );
                context.stroke();

                context.beginPath();
                context.moveTo(padding, y);
                context.lineTo(
                    width - padding,
                    y
                );
                context.stroke();
            }

            if (
                usePrepared &&
                minX < 0 &&
                maxX > 0
            ) {
                const x =
                    mapPoint([0, 0]).x;

                context.strokeStyle = "#54708a";
                context.lineWidth = 1.5;
                context.beginPath();
                context.moveTo(x, padding);
                context.lineTo(
                    x,
                    height - padding
                );
                context.stroke();
            }

            if (
                usePrepared &&
                minY < 0 &&
                maxY > 0
            ) {
                const y =
                    mapPoint([0, 0]).y;

                context.strokeStyle = "#54708a";
                context.beginPath();
                context.moveTo(padding, y);
                context.lineTo(
                    width - padding,
                    y
                );
                context.stroke();
            }

            if (step >= 4) {
                const span =
                    Math.max(
                        maxX - minX,
                        maxY - minY
                    ) * 0.55;

                result.vectors.forEach(
                    function (vector, index) {
                        const startPoint =
                            mapPoint([
                                -vector[0] * span,
                                -vector[1] * span
                            ]);

                        const endPoint =
                            mapPoint([
                                vector[0] * span,
                                vector[1] * span
                            ]);

                        context.strokeStyle =
                            index === 0
                                ? "#facc15"
                                : "#a78bfa";

                        context.lineWidth =
                            index === 0
                                ? 4
                                : 2.5;

                        context.beginPath();
                        context.moveTo(
                            startPoint.x,
                            startPoint.y
                        );
                        context.lineTo(
                            endPoint.x,
                            endPoint.y
                        );
                        context.stroke();

                        context.fillStyle =
                            context.strokeStyle;

                        context.font =
                            "800 13px Arial, sans-serif";

                        context.fillText(
                            "PC" + (index + 1),
                            endPoint.x - 16,
                            endPoint.y - 10
                        );
                    }
                );
            }

            if (step >= 5) {
                points.forEach(
                    function (row, index) {
                        const original =
                            mapPoint(row);

                        const projected =
                            mapPoint(
                                reconstructions[index]
                            );

                        context.strokeStyle =
                            "rgba(167,139,250,.72)";

                        context.setLineDash([5, 4]);
                        context.beginPath();
                        context.moveTo(
                            original.x,
                            original.y
                        );
                        context.lineTo(
                            projected.x,
                            projected.y
                        );
                        context.stroke();
                        context.setLineDash([]);

                        context.beginPath();
                        context.arc(
                            projected.x,
                            projected.y,
                            5,
                            0,
                            Math.PI * 2
                        );

                        context.fillStyle =
                            "#facc15";

                        context.fill();
                    }
                );
            }

            points.forEach(
                function (row, index) {
                    const position =
                        mapPoint(row);

                    context.beginPath();
                    context.arc(
                        position.x,
                        position.y,
                        7,
                        0,
                        Math.PI * 2
                    );

                    context.fillStyle =
                        colors[
                            result.labels[index] %
                            colors.length
                        ];

                    context.fill();

                    context.strokeStyle =
                        "#ecfeff";

                    context.lineWidth = 2;
                    context.stroke();
                }
            );

            context.fillStyle = "#9fc3df";
            context.font =
                "600 12px Arial, sans-serif";
            context.textAlign = "left";

            context.fillText(
                usePrepared
                    ? "Prepared feature 1"
                    : "Original feature 1",
                padding,
                height - 15
            );

            context.save();
            context.translate(
                15,
                height - padding
            );
            context.rotate(-Math.PI / 2);

            context.fillText(
                usePrepared
                    ? "Prepared feature 2"
                    : "Original feature 2",
                0,
                0
            );

            context.restore();

            if (step === 0) {
                const promptWidth = Math.min(
                    width - padding * 2,
                    390
                );

                context.fillStyle =
                    "rgba(6,20,38,.9)";

                context.fillRect(
                    (width - promptWidth) / 2,
                    18,
                    promptWidth,
                    48
                );

                context.strokeStyle = "#2b6389";

                context.strokeRect(
                    (width - promptWidth) / 2,
                    18,
                    promptWidth,
                    48
                );

                context.fillStyle = "#cfe7fb";
                context.font =
                    "700 15px Arial, sans-serif";
                context.textAlign = "center";

                context.fillText(
                    "Raw data preview • begin the PCA analysis",
                    width / 2,
                    48
                );
            }
        }

        function stopAuto() {
            if (timer !== null) {
                window.clearInterval(timer);
            }

            timer = null;
            pauseButton.disabled = true;
        }

        function render() {
            const result = calculate();

            const atEnd =
                step >= phases.length;

            const cumulative =
                result.ratios
                    .slice(0, result.retained)
                    .reduce(function (sum, value) {
                        return sum + value;
                    }, 0);

            const messages = [
                [
                    "Raw geometry is ready.",
                    "The selected observations are plotted immediately. Start the analysis to transform them.",
                    "Predict whether one component can reconstruct the selected geometry."
                ],
                [
                    "Raw units define the visible geometry.",
                    "Observe spread, correlation, scale and unusual points before transformation.",
                    "Decide whether centering alone gives both features a fair influence."
                ],
                [
                    preprocessInput.value === "standardize"
                        ? "Features now have comparable sample variance."
                        : "The feature means are now at the origin.",
                    "Preprocessing parameters were calculated and applied before covariance.",
                    "Predict the sign of the off-diagonal covariance."
                ],
                [
                    "Covariance summarizes joint variation.",
                    "Diagonal entries are variances; off-diagonal entries describe joint movement.",
                    "Predict the direction of the strongest component."
                ],
                [
                    "PC1 follows maximum variance.",
                    "PC2 is perpendicular and captures the remaining variation.",
                    "Compare the PC1 ratio with the plotted geometry."
                ],
                [
                    result.retained === 1
                        ? "Each point now has one retained score."
                        : "Both scores preserve the complete 2-D space.",
                    "Yellow points show reconstruction inside the retained principal subspace.",
                    "Explain which information one component discards."
                ],
                [
                    result.retained === 1
                        ? "Reconstruction exposes discarded information."
                        : "Two components reconstruct the original data.",
                    "Dashed residuals visualize information that the retained space cannot reproduce.",
                    "Use variance and RMSE together when choosing K."
                ],
                [
                    "PCA analysis is complete.",
                    "The result was calculated from the selected data and preprocessing rule.",
                    "Change the settings and explain why the basis rotates."
                ]
            ];

            const message =
                messages[
                    Math.min(
                        step,
                        messages.length - 1
                    )
                ];

            get("pcaComponentsValue").textContent =
                componentInput.value;

            get("pcaPhase").textContent =
                step === 0
                    ? "Ready"
                    : phases[
                        Math.min(
                            step - 1,
                            phases.length - 1
                        )
                    ];

            get("pcaVariance").textContent =
                step >= 4
                    ? format(
                        result.ratios[0] * 100,
                        1
                    ) + "%"
                    : "—";

            get("pcaCumulative").textContent =
                step >= 5
                    ? format(
                        cumulative * 100,
                        1
                    ) + "%"
                    : "—";

            get("pcaRmse").textContent =
                step >= 6
                    ? format(result.rmse, 3)
                    : "—";

            get("pcaCovariance").innerHTML =
                step >= 3
                    ? '<article><span>COVARIANCE ROW 1</span><code>[' +
                      format(result.covariance[0][0], 3) +
                      ", " +
                      format(result.covariance[0][1], 3) +
                      ']</code></article>' +
                      '<article><span>COVARIANCE ROW 2</span><code>[' +
                      format(result.covariance[1][0], 3) +
                      ", " +
                      format(result.covariance[1][1], 3) +
                      "]</code></article>"
                    : '<article><span>COVARIANCE</span><code>Waiting for Step 3</code></article>';

            get("pcaLoadings").innerHTML =
                step >= 4
                    ? result.vectors.map(
                        function (vector, index) {
                            return (
                                "<article><span>PC" +
                                (index + 1) +
                                " • λ=" +
                                format(
                                    result.eigenvalues[index],
                                    3
                                ) +
                                "</span><code>[" +
                                format(vector[0], 3) +
                                ", " +
                                format(vector[1], 3) +
                                "]</code></article>"
                            );
                        }
                    ).join("")
                    : '<article><span>LOADINGS</span><code>Waiting for eigenvectors</code></article>';

            get("pcaVerdict").textContent =
                message[0];

            get("pcaExplanation").textContent =
                message[1];

            get("pcaNextCheck").textContent =
                message[2];

            nextButton.textContent =
                atEnd
                    ? "Analysis Complete"
                    : step === 0
                        ? "Show Raw Geometry"
                        : "Next: " + phases[step];

            nextButton.disabled = atEnd;

            autoButton.disabled =
                atEnd || timer !== null;

            pauseButton.disabled =
                timer === null;

            if (atEnd) {
                stopAuto();
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
            stopAuto();
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

                autoButton.disabled = true;
                pauseButton.disabled = false;

                timer = window.setInterval(
                    advance,
                    850
                );
            }
        );

        pauseButton.addEventListener(
            "click",
            function () {
                stopAuto();
                render();
            }
        );

        resetButton.addEventListener(
            "click",
            reset
        );

        [
            datasetInput,
            preprocessInput,
            componentInput
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

        window.addEventListener(
            "resize",
            draw
        );

        canvas.dataset.cbPcaRenderer =
            "active";

        render();
        window.requestAnimationFrame(draw);
    }

    function scheduleStart() {
        window.requestAnimationFrame(
            function () {
                window.setTimeout(
                    start,
                    40
                );
            }
        );
    }

    if (document.readyState === "loading") {
        document.addEventListener(
            "DOMContentLoaded",
            scheduleStart
        );
    } else {
        scheduleStart();
    }
}());
