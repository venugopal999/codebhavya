(function () {
    "use strict";

    const LEVEL_PROGRESS_KEY = "codebhavya-aiml-level-14-progress-v1";
    const POINT_COLORS = ["#22d3ee", "#fbbf24", "#a78bfa", "#34d399"];

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

    function dot(a, b) {
        return a.reduce(function (sum, value, index) {
            return sum + value * b[index];
        }, 0);
    }

    function identity(size) {
        return Array.from({ length: size }, function (_, row) {
            return Array.from({ length: size }, function (__, column) {
                return row === column ? 1 : 0;
            });
        });
    }

    function transpose(matrix) {
        return matrix[0].map(function (_, column) {
            return matrix.map(function (row) {
                return row[column];
            });
        });
    }

    function multiplyMatrices(a, b) {
        const bt = transpose(b);

        return a.map(function (row) {
            return bt.map(function (column) {
                return dot(row, column);
            });
        });
    }

    function prepareCanvas(canvas, desktopHeight, mobileHeight) {
        const width = Math.max(280, canvas.clientWidth || 700);
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

    function calculatePca(source, preprocessing, retained) {
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

        const sampleScales = [0, 1].map(function (column) {
            const variance = raw.reduce(function (sum, row) {
                return sum + Math.pow(row[column] - means[column], 2);
            }, 0) / Math.max(1, raw.length - 1);

            return preprocessing === "standardize"
                ? Math.sqrt(variance) || 1
                : 1;
        });

        const prepared = raw.map(function (row) {
            return [
                (row[0] - means[0]) / sampleScales[0],
                (row[1] - means[1]) / sampleScales[1]
            ];
        });

        const denominator = Math.max(1, prepared.length - 1);
        const covariance = [[0, 0], [0, 0]];

        prepared.forEach(function (row) {
            covariance[0][0] += row[0] * row[0] / denominator;
            covariance[0][1] += row[0] * row[1] / denominator;
            covariance[1][0] += row[1] * row[0] / denominator;
            covariance[1][1] += row[1] * row[1] / denominator;
        });

        const a = covariance[0][0];
        const b = covariance[0][1];
        const d = covariance[1][1];
        const root = Math.sqrt(Math.pow(a - d, 2) + 4 * b * b);

        const eigenvalues = [
            (a + d + root) / 2,
            (a + d - root) / 2
        ];

        let first;

        if (Math.abs(b) > 1e-10) {
            first = [b, eigenvalues[0] - a];
        } else {
            first = a >= d ? [1, 0] : [0, 1];
        }

        const norm = Math.hypot(first[0], first[1]) || 1;
        first = [first[0] / norm, first[1] / norm];

        if (first[0] < 0) {
            first = [-first[0], -first[1]];
        }

        const second = [-first[1], first[0]];
        const vectors = [first, second];

        const scores = prepared.map(function (row) {
            return vectors.map(function (vector) {
                return dot(row, vector);
            });
        });

        const reconstructedPrepared = scores.map(function (score) {
            const output = [0, 0];

            for (let component = 0; component < retained; component += 1) {
                output[0] += score[component] * vectors[component][0];
                output[1] += score[component] * vectors[component][1];
            }

            return output;
        });

        const reconstructedRaw = reconstructedPrepared.map(function (row) {
            return [
                row[0] * sampleScales[0] + means[0],
                row[1] * sampleScales[1] + means[1]
            ];
        });

        const squaredError = raw.reduce(function (sum, row, index) {
            return sum
                + Math.pow(row[0] - reconstructedRaw[index][0], 2)
                + Math.pow(row[1] - reconstructedRaw[index][1], 2);
        }, 0);

        const total = Math.max(
            1e-12,
            eigenvalues[0] + eigenvalues[1]
        );

        return {
            raw: raw,
            labels: labels,
            means: means,
            scales: sampleScales,
            prepared: prepared,
            covariance: covariance,
            eigenvalues: eigenvalues,
            vectors: vectors,
            scores: scores,
            reconstructedPrepared: reconstructedPrepared,
            reconstructedRaw: reconstructedRaw,
            ratios: [
                eigenvalues[0] / total,
                eigenvalues[1] / total
            ],
            retained: retained,
            rmse: Math.sqrt(squaredError / (raw.length * 2))
        };
    }

    function initPcaVisualizer() {
        const canvas = byId("pcaCanvas");

        if (!canvas) {
            return;
        }

        const datasets = {
            correlated: [
                [1.0, 1.2, 0],
                [1.5, 1.7, 0],
                [2.1, 2.0, 0],
                [2.7, 2.9, 0],
                [3.2, 3.0, 0],
                [3.7, 3.9, 0],
                [4.3, 4.1, 0],
                [4.8, 5.0, 0],
                [5.4, 5.1, 0],
                [6.0, 6.2, 0]
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
                [1.0, 1.3, 0],
                [1.7, 1.6, 0],
                [2.2, 2.4, 0],
                [2.8, 2.6, 0],
                [3.4, 3.6, 0],
                [4.0, 3.8, 0],
                [4.7, 4.8, 0],
                [5.2, 5.0, 0],
                [8.6, 1.0, 1]
            ],

            classes: [
                [1.0, 1.0, 0],
                [2.0, 1.2, 0],
                [3.0, 1.1, 0],
                [4.0, 1.3, 0],
                [5.0, 1.2, 0],
                [1.2, 2.0, 1],
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

        const datasetInput = byId("pcaDataset");
        const preprocessInput = byId("pcaPreprocess");
        const componentInput = byId("pcaComponents");
        const nextButton = byId("pcaNext");
        const autoButton = byId("pcaAuto");
        const pauseButton = byId("pcaPause");

        let step = 0;
        let timer = null;

        function result() {
            return calculatePca(
                datasets[datasetInput.value],
                preprocessInput.value,
                Number(componentInput.value)
            );
        }

        function stopAuto() {
            if (timer !== null) {
                window.clearInterval(timer);
            }

            timer = null;
            pauseButton.disabled = true;
        }

        function phaseText() {
            return step === 0
                ? "Ready"
                : phases[Math.min(step - 1, phases.length - 1)];
        }

        function draw() {
            const calculation = result();
            const preparedCanvas = prepareCanvas(
                canvas,
                465,
                385
            );

            const context = preparedCanvas.context;
            const width = preparedCanvas.width;
            const height = preparedCanvas.height;
            const padding = width < 560 ? 38 : 50;
            const usePrepared = step >= 2;

            const points = usePrepared
                ? calculation.prepared
                : calculation.raw;

            const reconstructions = usePrepared
                ? calculation.reconstructedPrepared
                : calculation.reconstructedRaw;

            const allPoints = points.concat(
                step >= 6 ? reconstructions : []
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

            const mapPoint = function (row) {
                return {
                    x: padding
                        + (row[0] - minX)
                        / Math.max(1e-9, maxX - minX)
                        * (width - padding * 2),

                    y: height
                        - padding
                        - (row[1] - minY)
                        / Math.max(1e-9, maxY - minY)
                        * (height - padding * 2)
                };
            };

            context.clearRect(0, 0, width, height);
            context.fillStyle = "#061426";
            context.fillRect(0, 0, width, height);

            context.strokeStyle = "#173852";
            context.lineWidth = 1;

            for (let index = 0; index <= 8; index += 1) {
                const x = padding
                    + (width - padding * 2)
                    * index / 8;

                const y = padding
                    + (height - padding * 2)
                    * index / 8;

                context.beginPath();
                context.moveTo(x, padding);
                context.lineTo(x, height - padding);
                context.stroke();

                context.beginPath();
                context.moveTo(padding, y);
                context.lineTo(width - padding, y);
                context.stroke();
            }

            if (step === 0) {
                context.fillStyle = "#cfe7fb";
                context.font = "700 17px Inter, sans-serif";
                context.textAlign = "center";

                context.fillText(
                    "Press Show Raw Geometry to begin PCA",
                    width / 2,
                    height / 2
                );

                return;
            }

            if (usePrepared && minX < 0 && maxX > 0) {
                const originX = mapPoint([0, 0]).x;

                context.strokeStyle = "#54708a";
                context.lineWidth = 1.5;
                context.beginPath();
                context.moveTo(originX, padding);
                context.lineTo(originX, height - padding);
                context.stroke();
            }

            if (usePrepared && minY < 0 && maxY > 0) {
                const originY = mapPoint([0, 0]).y;

                context.strokeStyle = "#54708a";
                context.beginPath();
                context.moveTo(padding, originY);
                context.lineTo(width - padding, originY);
                context.stroke();
            }

            if (step >= 4) {
                const span = Math.max(
                    maxX - minX,
                    maxY - minY
                ) * 0.55;

                calculation.vectors.forEach(function (
                    vector,
                    index
                ) {
                    const start = mapPoint([
                        -vector[0] * span,
                        -vector[1] * span
                    ]);

                    const end = mapPoint([
                        vector[0] * span,
                        vector[1] * span
                    ]);

                    context.strokeStyle = index === 0
                        ? "#facc15"
                        : "#a78bfa";

                    context.lineWidth = index === 0
                        ? 4
                        : 2.5;

                    context.beginPath();
                    context.moveTo(start.x, start.y);
                    context.lineTo(end.x, end.y);
                    context.stroke();

                    context.fillStyle = context.strokeStyle;
                    context.font = "800 13px Inter, sans-serif";

                    context.fillText(
                        "PC" + (index + 1),
                        end.x - 16,
                        end.y - 10
                    );
                });
            }

            if (step >= 5) {
                points.forEach(function (row, index) {
                    const original = mapPoint(row);
                    const projected = mapPoint(
                        reconstructions[index]
                    );

                    context.strokeStyle =
                        "rgba(167, 139, 250, .72)";

                    context.setLineDash([5, 4]);
                    context.beginPath();
                    context.moveTo(original.x, original.y);
                    context.lineTo(projected.x, projected.y);
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

                    context.fillStyle = "#facc15";
                    context.fill();
                });
            }

            points.forEach(function (row, index) {
                const position = mapPoint(row);

                context.beginPath();
                context.arc(
                    position.x,
                    position.y,
                    7,
                    0,
                    Math.PI * 2
                );

                context.fillStyle = POINT_COLORS[
                    calculation.labels[index]
                    % POINT_COLORS.length
                ];

                context.fill();
                context.strokeStyle = "#ecfeff";
                context.lineWidth = 2;
                context.stroke();
            });

            context.fillStyle = "#9fc3df";
            context.font = "600 12px Inter, sans-serif";
            context.textAlign = "left";

            context.fillText(
                usePrepared
                    ? "Prepared feature 1"
                    : "Original feature 1",
                padding,
                height - 15
            );

            context.save();
            context.translate(15, height - padding);
            context.rotate(-Math.PI / 2);

            context.fillText(
                usePrepared
                    ? "Prepared feature 2"
                    : "Original feature 2",
                0,
                0
            );

            context.restore();
        }

        function render() {
            const calculation = result();
            const atEnd = step >= phases.length;

            const cumulative = calculation.ratios
                .slice(0, calculation.retained)
                .reduce(function (sum, value) {
                    return sum + value;
                }, 0);

            byId("pcaComponentsValue").textContent =
                componentInput.value;

            byId("pcaPhase").textContent =
                phaseText();

            byId("pcaVariance").textContent =
                step >= 4
                    ? fixed(
                        calculation.ratios[0] * 100,
                        1
                    ) + "%"
                    : "—";

            byId("pcaCumulative").textContent =
                step >= 5
                    ? fixed(cumulative * 100, 1) + "%"
                    : "—";

            byId("pcaRmse").textContent =
                step >= 6
                    ? fixed(calculation.rmse, 3)
                    : "—";

            byId("pcaCovariance").innerHTML =
                step >= 3
                    ? '<article><span>COVARIANCE ROW 1</span><code>['
                        + fixed(
                            calculation.covariance[0][0],
                            3
                        )
                        + ", "
                        + fixed(
                            calculation.covariance[0][1],
                            3
                        )
                        + ']</code></article>'
                        + '<article><span>COVARIANCE ROW 2</span><code>['
                        + fixed(
                            calculation.covariance[1][0],
                            3
                        )
                        + ", "
                        + fixed(
                            calculation.covariance[1][1],
                            3
                        )
                        + ']</code></article>'
                    : '<article><span>COVARIANCE</span>'
                        + '<code>Waiting for Step 3</code>'
                        + '</article>';

            byId("pcaLoadings").innerHTML =
                step >= 4
                    ? calculation.vectors.map(function (
                        vector,
                        index
                    ) {
                        return '<article><span>PC'
                            + (index + 1)
                            + " • λ="
                            + fixed(
                                calculation.eigenvalues[index],
                                3
                            )
                            + '</span><code>['
                            + fixed(vector[0], 3)
                            + ", "
                            + fixed(vector[1], 3)
                            + ']</code></article>';
                    }).join("")
                    : '<article><span>LOADINGS</span>'
                        + '<code>Waiting for eigenvectors</code>'
                        + '</article>';

            const messages = [
                [
                    "Choose settings and begin the analysis.",
                    "The laboratory will fit preprocessing, find principal directions and rebuild observations from retained components.",
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
                    "Preprocessing parameters were calculated from the selected data and applied before covariance.",
                    "Predict the sign of the off-diagonal covariance."
                ],
                [
                    "Covariance summarizes joint variation.",
                    "Diagonal entries are feature variances; off-diagonal entries show how the two features move together.",
                    "Identify whether the strongest component should be horizontal, vertical or diagonal."
                ],
                [
                    "PC1 follows the direction of greatest variance.",
                    "PC2 is perpendicular and captures the remaining variance. Their eigenvalues quantify the two spreads.",
                    "Compare the PC1 ratio with the geometry on the plot."
                ],
                [
                    calculation.retained === 1
                        ? "Points are represented by one score each."
                        : "Both component scores preserve the complete 2-D subspace.",
                    "Yellow points are projected coordinates reconstructed inside the retained principal subspace.",
                    "Explain which distances are lost when only PC1 is retained."
                ],
                [
                    calculation.retained === 1
                        ? "Reconstruction exposes discarded information."
                        : "Two components reconstruct the original 2-D data.",
                    "Dashed residuals show what the retained subspace cannot reproduce.",
                    "Use cumulative variance and RMSE together before choosing K."
                ],
                [
                    "PCA analysis is complete.",
                    "The result came from the selected observations, preprocessing rule and retained dimension.",
                    "Change the dataset or scaling rule and explain why the basis rotates."
                ]
            ];

            const message = messages[
                Math.min(step, messages.length - 1)
            ];

            byId("pcaVerdict").textContent =
                message[0];

            byId("pcaExplanation").textContent =
                message[1];

            byId("pcaNextCheck").textContent =
                message[2];

            nextButton.textContent = atEnd
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

        autoButton.addEventListener("click", function () {
            if (
                step >= phases.length
                || timer !== null
            ) {
                return;
            }

            autoButton.disabled = true;
            pauseButton.disabled = false;

            timer = window.setInterval(
                advance,
                850
            );
        });

        pauseButton.addEventListener("click", function () {
            stopAuto();
            render();
        });

        byId("pcaReset").addEventListener(
            "click",
            reset
        );

        [
            datasetInput,
            preprocessInput,
            componentInput
        ].forEach(function (input) {
            input.addEventListener("input", reset);
        });

        window.addEventListener("resize", draw);
        render();
    }

    function jacobiEigen(matrix) {
        const size = matrix.length;
        const a = matrix.map(function (row) {
            return row.slice();
        });

        const vectors = identity(size);

        for (
            let sweep = 0;
            sweep < 120;
            sweep += 1
        ) {
            let p = 0;
            let q = 1;
            let largest = 0;

            for (
                let row = 0;
                row < size;
                row += 1
            ) {
                for (
                    let column = row + 1;
                    column < size;
                    column += 1
                ) {
                    if (
                        Math.abs(a[row][column])
                        > largest
                    ) {
                        largest =
                            Math.abs(a[row][column]);

                        p = row;
                        q = column;
                    }
                }
            }

            if (largest < 1e-10) {
                break;
            }

            const angle = 0.5 * Math.atan2(
                2 * a[p][q],
                a[q][q] - a[p][p]
            );

            const cosine = Math.cos(angle);
            const sine = Math.sin(angle);

            for (
                let index = 0;
                index < size;
                index += 1
            ) {
                if (
                    index !== p
                    && index !== q
                ) {
                    const aip = a[index][p];
                    const aiq = a[index][q];

                    a[index][p] =
                        a[p][index] =
                            cosine * aip - sine * aiq;

                    a[index][q] =
                        a[q][index] =
                            sine * aip + cosine * aiq;
                }
            }

            const app = a[p][p];
            const aqq = a[q][q];
            const apq = a[p][q];

            a[p][p] =
                cosine * cosine * app
                - 2 * sine * cosine * apq
                + sine * sine * aqq;

            a[q][q] =
                sine * sine * app
                + 2 * sine * cosine * apq
                + cosine * cosine * aqq;

            a[p][q] = 0;
            a[q][p] = 0;

            for (
                let row = 0;
                row < size;
                row += 1
            ) {
                const vip = vectors[row][p];
                const viq = vectors[row][q];

                vectors[row][p] =
                    cosine * vip - sine * viq;

                vectors[row][q] =
                    sine * vip + cosine * viq;
            }
        }

        return Array.from(
            { length: size },
            function (_, index) {
                return {
                    value: Math.max(
                        0,
                        a[index][index]
                    ),
                    vector: vectors.map(function (row) {
                        return row[index];
                    })
                };
            }
        ).sort(function (left, right) {
            return right.value - left.value;
        });
    }

    function calculateSvd(matrix, retained) {
        const gram = multiplyMatrices(
            transpose(matrix),
            matrix
        );

        const eigenpairs = jacobiEigen(gram);

        const factors = eigenpairs
            .filter(function (pair) {
                return pair.value > 1e-9;
            })
            .map(function (pair) {
                const singular =
                    Math.sqrt(pair.value);

                const av = matrix.map(function (row) {
                    return dot(row, pair.vector);
                });

                return {
                    singular: singular,
                    v: pair.vector,
                    u: av.map(function (value) {
                        return value / singular;
                    })
                };
            });

        const reconstruction = matrix.map(function (row) {
            return row.map(function () {
                return 0;
            });
        });

        factors
            .slice(0, retained)
            .forEach(function (factor) {
                for (
                    let row = 0;
                    row < matrix.length;
                    row += 1
                ) {
                    for (
                        let column = 0;
                        column < matrix[0].length;
                        column += 1
                    ) {
                        reconstruction[row][column] +=
                            factor.singular
                            * factor.u[row]
                            * factor.v[column];
                    }
                }
            });

        let squaredError = 0;

        matrix.forEach(function (row, rowIndex) {
            row.forEach(function (
                value,
                columnIndex
            ) {
                squaredError += Math.pow(
                    value
                        - reconstruction[rowIndex][columnIndex],
                    2
                );
            });
        });

        const energies = factors.map(function (factor) {
            return factor.singular * factor.singular;
        });

        const totalEnergy = Math.max(
            1e-12,
            energies.reduce(function (sum, value) {
                return sum + value;
            }, 0)
        );

        return {
            gram: gram,
            factors: factors,
            reconstruction: reconstruction,
            rmse: Math.sqrt(
                squaredError
                / (matrix.length * matrix[0].length)
            ),
            energy: energies
                .slice(0, retained)
                .reduce(function (sum, value) {
                    return sum + value;
                }, 0) / totalEnergy
        };
    }

    function initSvdVisualizer() {
        const originalCanvas = byId("svdOriginal");

        if (!originalCanvas) {
            return;
        }

        const baseBands = [
            [.05, .05, .82, .82, .82, .05, .05],
            [.05, .08, .85, .9, .85, .08, .05],
            [.08, .1, .88, .95, .88, .1, .08],
            [.08, .12, .9, 1, .9, .12, .08],
            [.08, .1, .88, .95, .88, .1, .08],
            [.05, .08, .85, .9, .85, .08, .05],
            [.05, .05, .82, .82, .82, .05, .05]
        ];

        const datasets = {
            bands: baseBands,

            gradient: Array.from(
                { length: 7 },
                function (_, row) {
                    return Array.from(
                        { length: 7 },
                        function (__, column) {
                            return 0.08
                                + 0.075 * row
                                + 0.065 * column;
                        }
                    );
                }
            ),

            symbol: [
                [.05, .75, .95, .95, .8, .2, .05],
                [.65, .95, .35, .12, .12, .08, .05],
                [.9, .45, .08, .05, .05, .05, .05],
                [.95, .35, .05, .05, .05, .05, .05],
                [.9, .45, .08, .05, .05, .05, .05],
                [.65, .95, .35, .12, .12, .08, .05],
                [.05, .75, .95, .95, .8, .2, .05]
            ],

            noise: baseBands.map(function (
                row,
                rowIndex
            ) {
                return row.map(function (
                    value,
                    columnIndex
                ) {
                    return clamp(
                        value
                            + (
                                (
                                    rowIndex * 11
                                    + columnIndex * 7
                                ) % 9 - 4
                            ) * 0.035,
                        0,
                        1
                    );
                });
            })
        };

        const phases = [
            "Original matrix",
            "Gram matrix XᵀX",
            "Singular spectrum",
            "Rank selection",
            "Reconstruction",
            "Complete"
        ];

        const datasetInput = byId("svdDataset");
        const rankInput = byId("svdRank");
        const nextButton = byId("svdNext");
        const autoButton = byId("svdAuto");
        const pauseButton = byId("svdPause");

        let step = 0;
        let timer = null;

        function stopAuto() {
            if (timer !== null) {
                window.clearInterval(timer);
            }

            timer = null;
            pauseButton.disabled = true;
        }

        function drawHeatmap(
            canvas,
            matrix,
            mode,
            placeholder
        ) {
            const width = Math.max(
                180,
                canvas.clientWidth || 220
            );

            const ratio =
                window.devicePixelRatio || 1;

            canvas.width =
                Math.round(width * ratio);

            canvas.height =
                Math.round(width * ratio);

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

            context.fillStyle = "#061426";
            context.fillRect(0, 0, width, width);

            if (placeholder) {
                context.fillStyle = "#8facbf";
                context.font =
                    "700 13px Inter, sans-serif";

                context.textAlign = "center";

                context.fillText(
                    placeholder,
                    width / 2,
                    width / 2
                );

                return;
            }

            const rows = matrix.length;
            const columns = matrix[0].length;
            const cellWidth = width / columns;
            const cellHeight = width / rows;

            let maximum = 1;

            if (mode === "error") {
                maximum = Math.max(
                    0.001,
                    Math.max.apply(
                        null,
                        matrix.flat()
                    )
                );
            }

            matrix.forEach(function (
                row,
                rowIndex
            ) {
                row.forEach(function (
                    value,
                    columnIndex
                ) {
                    const normalized = clamp(
                        Math.abs(value) / maximum,
                        0,
                        1
                    );

                    if (mode === "error") {
                        context.fillStyle =
                            "rgb("
                            + Math.round(
                                25 + 225 * normalized
                            )
                            + ", "
                            + Math.round(
                                35
                                + 85 * (1 - normalized)
                            )
                            + ", "
                            + Math.round(
                                65
                                + 80 * (1 - normalized)
                            )
                            + ")";
                    } else {
                        context.fillStyle =
                            "rgb("
                            + Math.round(
                                6 + 244 * normalized
                            )
                            + ", "
                            + Math.round(
                                24 + 185 * normalized
                            )
                            + ", "
                            + Math.round(
                                44
                                + 40 * (1 - normalized)
                            )
                            + ")";
                    }

                    context.fillRect(
                        columnIndex * cellWidth,
                        rowIndex * cellHeight,
                        cellWidth + 0.5,
                        cellHeight + 0.5
                    );

                    context.strokeStyle =
                        "rgba(255,255,255,.14)";

                    context.strokeRect(
                        columnIndex * cellWidth,
                        rowIndex * cellHeight,
                        cellWidth,
                        cellHeight
                    );
                });
            });
        }

        function render() {
            const matrix =
                datasets[datasetInput.value];

            const rank =
                Number(rankInput.value);

            const calculation =
                calculateSvd(matrix, rank);

            const atEnd =
                step >= phases.length;

            byId("svdRankValue").textContent =
                rankInput.value;

            byId("svdPhase").textContent =
                step === 0
                    ? "Ready"
                    : phases[
                        Math.min(
                            step - 1,
                            phases.length - 1
                        )
                    ];

            byId("svdEnergy").textContent =
                step >= 4
                    ? fixed(
                        calculation.energy * 100,
                        1
                    ) + "%"
                    : "—";

            byId("svdRmse").textContent =
                step >= 5
                    ? fixed(calculation.rmse, 4)
                    : "—";

            const originalStorage =
                matrix.length * matrix[0].length;

            const compressedStorage =
                rank * (
                    matrix.length
                    + matrix[0].length
                    + 1
                );

            byId("svdStorage").textContent =
                step >= 4
                    ? compressedStorage
                        + " vs "
                        + originalStorage
                    : "—";

            drawHeatmap(
                originalCanvas,
                matrix,
                "value",
                step === 0
                    ? "Begin analysis"
                    : ""
            );

            drawHeatmap(
                byId("svdReconstructed"),
                calculation.reconstruction,
                "value",
                step < 5
                    ? "Available at Step 5"
                    : ""
            );

            const errors = matrix.map(function (
                row,
                rowIndex
            ) {
                return row.map(function (
                    value,
                    columnIndex
                ) {
                    return Math.abs(
                        value
                            - calculation
                                .reconstruction[rowIndex][columnIndex]
                    );
                });
            });

            drawHeatmap(
                byId("svdError"),
                errors,
                "error",
                step < 5
                    ? "Available at Step 5"
                    : ""
            );

            const largest =
                calculation.factors.length
                    ? calculation.factors[0].singular
                    : 1;

            byId("svdSpectrum").innerHTML =
                step >= 3
                    ? calculation.factors
                        .slice(0, 7)
                        .map(function (factor, index) {
                            const retained =
                                index < rank;

                            return '<article><span>σ'
                                + (index + 1)
                                + '</span><i><b style="width:'
                                + fixed(
                                    factor.singular
                                        / largest
                                        * 100,
                                    1
                                )
                                + "%;opacity:"
                                + (
                                    retained
                                        ? "1"
                                        : ".28"
                                )
                                + '"></b></i><strong>'
                                + fixed(
                                    factor.singular,
                                    3
                                )
                                + "</strong></article>";
                        }).join("")
                    : '<article><span>σ</span>'
                        + '<i><b style="width:0%"></b></i>'
                        + '<strong>Waiting</strong></article>';

            const messages = [
                [
                    "Begin with the full matrix.",
                    "Dominant singular values represent strong reusable structure across rows and columns.",
                    "Predict which pattern will compress most accurately at rank 1."
                ],
                [
                    "The original matrix contains 49 values.",
                    "Look for repeated rows, columns, symmetry or smooth change; these often indicate low effective rank.",
                    "Explain why random detail is harder to compress."
                ],
                [
                    "XᵀX measures relationships among columns.",
                    "Its eigenvectors become right singular vectors and its eigenvalues become squared singular values.",
                    "Connect the largest Gram eigenvalue to σ₁."
                ],
                [
                    "The spectrum ranks reusable matrix patterns.",
                    "A steep singular-value drop suggests that a small number of factors captures most energy.",
                    "Identify the first weak factor from the displayed spectrum."
                ],
                [
                    "Rank K selects the retained singular triplets.",
                    "Energy uses squared singular values; storage counts U, Σ and V factor values.",
                    "Compare energy retained with the storage requirement."
                ],
                [
                    "The matrix is reconstructed from retained factors.",
                    "Bright error cells expose details that the selected rank cannot reproduce.",
                    "Decide whether the discarded detail is acceptable for the task."
                ],
                [
                    "Low-rank analysis is complete.",
                    "Change the pattern or rank to see when structural compression succeeds or fails.",
                    "Validate reconstruction and downstream usefulness before deployment."
                ]
            ];

            const message = messages[
                Math.min(step, messages.length - 1)
            ];

            byId("svdVerdict").textContent =
                message[0];

            byId("svdExplanation").textContent =
                message[1];

            byId("svdNextCheck").textContent =
                message[2];

            nextButton.textContent = atEnd
                ? "Compression Complete"
                : step === 0
                    ? "Inspect Matrix"
                    : "Next: " + phases[step];

            nextButton.disabled = atEnd;

            autoButton.disabled =
                atEnd || timer !== null;

            pauseButton.disabled =
                timer === null;

            if (atEnd) {
                stopAuto();
            }
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

        autoButton.addEventListener("click", function () {
            if (
                step >= phases.length
                || timer !== null
            ) {
                return;
            }

            autoButton.disabled = true;
            pauseButton.disabled = false;

            timer = window.setInterval(
                advance,
                900
            );
        });

        pauseButton.addEventListener("click", function () {
            stopAuto();
            render();
        });

        byId("svdReset").addEventListener(
            "click",
            reset
        );

        [
            datasetInput,
            rankInput
        ].forEach(function (input) {
            input.addEventListener("input", reset);
        });

        window.addEventListener("resize", render);
        render();
    }

    function initProgramTracer() {
        const codeContainer = byId("tracerCode");
        const toggle = byId("tracerPanelToggle");
        const panel = byId("tracerPanel");

        if (!codeContainer || !toggle || !panel) {
            return;
        }

        const lines = [
            "X = [[2, 1], [3, 2], [4, 2], [5, 4]]",
            "n = len(X)",
            "means = [0.0, 0.0]",
            "for row in X:",
            "    for j in range(2):",
            "        means[j] += row[j] / n",
            "centered = []",
            "for row in X:",
            "    centered.append([row[j] - means[j] for j in range(2)])",
            "covariance = [[0.0, 0.0], [0.0, 0.0]]",
            "for row in centered:",
            "    for i in range(2):",
            "        for j in range(2):",
            "            covariance[i][j] += row[i] * row[j] / (n - 1)",
            "vector = [1.0, 0.0]",
            "for iteration in range(4):",
            "    product = [sum(covariance[i][j] * vector[j] for j in range(2)) for i in range(2)]",
            "    length = sum(value ** 2 for value in product) ** 0.5",
            "    vector = [value / length for value in product]",
            "scores = []",
            "for row in centered:",
            "    scores.append(sum(row[j] * vector[j] for j in range(2)))",
            "print([round(score, 2) for score in scores])"
        ];

        function clone(value) {
            return JSON.parse(
                JSON.stringify(value)
            );
        }

        function buildStates() {
            const states = [];
            const X = [
                [2, 1],
                [3, 2],
                [4, 2],
                [5, 4]
            ];

            let n = 0;
            let means = [];
            let centered = [];
            let covariance = [];
            let vector = [];
            let product = [];
            let length = 0;
            let scores = [];

            function state(
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

            state(
                0,
                "Create four observations with two features each.",
                { X: X },
                "X has shape 4 × 2"
            );

            n = X.length;

            state(
                1,
                "Store the number of observations.",
                { n: n },
                "len(X) = " + n
            );

            means = [0, 0];

            state(
                2,
                "Initialize one running mean for each feature.",
                { means: means },
                "means = [0.0, 0.0]"
            );

            X.forEach(function (row, rowIndex) {
                state(
                    3,
                    "Enter the outer mean loop for row "
                        + rowIndex + ".",
                    {
                        row_index: rowIndex,
                        row: row,
                        means: means
                    },
                    "row = " + JSON.stringify(row)
                );

                for (let j = 0; j < 2; j += 1) {
                    state(
                        4,
                        "Enter the inner feature loop with j = "
                            + j + ".",
                        {
                            row_index: rowIndex,
                            j: j,
                            means: means
                        },
                        "range(2) gives " + j
                    );

                    const addition = row[j] / n;
                    means[j] += addition;

                    state(
                        5,
                        "Add one observation's contribution to feature "
                            + j + " mean.",
                        {
                            row_index: rowIndex,
                            j: j,
                            addition: addition,
                            means: means
                        },
                        fixed(row[j], 1)
                            + " / "
                            + n
                            + " = "
                            + fixed(addition, 3)
                    );
                }
            });

            centered = [];

            state(
                6,
                "Create the list that will store centred observations.",
                {
                    means: means,
                    centered: centered
                },
                "centered = []"
            );

            X.forEach(function (row, rowIndex) {
                state(
                    7,
                    "Return to the centering loop for row "
                        + rowIndex + ".",
                    {
                        row_index: rowIndex,
                        row: row,
                        means: means
                    },
                    "row = " + JSON.stringify(row)
                );

                const centeredRow = [
                    row[0] - means[0],
                    row[1] - means[1]
                ];

                centered.push(centeredRow);

                state(
                    8,
                    "Subtract both training means and append the centred row.",
                    {
                        row_index: rowIndex,
                        centered_row: centeredRow,
                        centered: centered
                    },
                    JSON.stringify(row)
                        + " − "
                        + JSON.stringify(means)
                );
            });

            covariance = [
                [0, 0],
                [0, 0]
            ];

            state(
                9,
                "Initialize the 2 × 2 covariance accumulator.",
                { covariance: covariance },
                "covariance = zeros(2, 2)"
            );

            centered.forEach(function (row, rowIndex) {
                state(
                    10,
                    "Enter the covariance row loop for centred row "
                        + rowIndex + ".",
                    {
                        row_index: rowIndex,
                        row: row,
                        covariance: covariance
                    },
                    "row = " + JSON.stringify(row)
                );

                for (let i = 0; i < 2; i += 1) {
                    state(
                        11,
                        "Select covariance output row i = "
                            + i + ".",
                        {
                            row_index: rowIndex,
                            i: i,
                            covariance: covariance
                        },
                        "i = " + i
                    );

                    for (let j = 0; j < 2; j += 1) {
                        state(
                            12,
                            "Select covariance output column j = "
                                + j + ".",
                            {
                                row_index: rowIndex,
                                i: i,
                                j: j,
                                covariance: covariance
                            },
                            "j = " + j
                        );

                        const contribution =
                            row[i] * row[j] / (n - 1);

                        covariance[i][j] +=
                            contribution;

                        state(
                            13,
                            "Accumulate the outer-product contribution into covariance["
                                + i
                                + "]["
                                + j
                                + "].",
                            {
                                row_index: rowIndex,
                                i: i,
                                j: j,
                                contribution: contribution,
                                covariance: covariance
                            },
                            fixed(row[i], 2)
                                + " × "
                                + fixed(row[j], 2)
                                + " / "
                                + (n - 1)
                        );
                    }
                }
            });

            vector = [1, 0];

            state(
                14,
                "Initialize a unit direction for power iteration.",
                {
                    covariance: covariance,
                    vector: vector
                },
                "vector = [1.0, 0.0]"
            );

            for (
                let iteration = 0;
                iteration < 4;
                iteration += 1
            ) {
                state(
                    15,
                    "Begin power-iteration pass "
                        + (iteration + 1) + ".",
                    {
                        iteration: iteration,
                        vector: vector
                    },
                    "iteration = " + iteration
                );

                product = [
                    covariance[0][0] * vector[0]
                        + covariance[0][1] * vector[1],

                    covariance[1][0] * vector[0]
                        + covariance[1][1] * vector[1]
                ];

                state(
                    16,
                    "Multiply the covariance matrix by the current direction.",
                    {
                        iteration: iteration,
                        vector: vector,
                        product: product
                    },
                    "C × v = "
                        + JSON.stringify(
                            product.map(function (value) {
                                return Number(
                                    fixed(value, 3)
                                );
                            })
                        )
                );

                length = Math.hypot(
                    product[0],
                    product[1]
                );

                state(
                    17,
                    "Calculate the Euclidean length used for normalization.",
                    {
                        iteration: iteration,
                        product: product,
                        length: length
                    },
                    "‖product‖ = "
                        + fixed(length, 4)
                );

                vector = [
                    product[0] / length,
                    product[1] / length
                ];

                state(
                    18,
                    "Normalize the product. Repetition moves the vector toward PC1.",
                    {
                        iteration: iteration,
                        length: length,
                        vector: vector
                    },
                    "vector = "
                        + JSON.stringify(
                            vector.map(function (value) {
                                return Number(
                                    fixed(value, 4)
                                );
                            })
                        )
                );
            }

            scores = [];

            state(
                19,
                "Create the list of one-dimensional PCA scores.",
                {
                    vector: vector,
                    scores: scores
                },
                "scores = []"
            );

            centered.forEach(function (row, rowIndex) {
                state(
                    20,
                    "Return to the projection loop for centred row "
                        + rowIndex + ".",
                    {
                        row_index: rowIndex,
                        row: row,
                        vector: vector,
                        scores: scores
                    },
                    "row = " + JSON.stringify(row)
                );

                const score = dot(row, vector);
                scores.push(score);

                state(
                    21,
                    "Project the centred row onto the estimated principal direction.",
                    {
                        row_index: rowIndex,
                        score: score,
                        scores: scores
                    },
                    "row · vector = "
                        + fixed(score, 4)
                );
            });

            const output = "["
                + scores.map(function (score) {
                    return fixed(score, 2);
                }).join(", ")
                + "]";

            state(
                22,
                "Round and print the four one-dimensional scores. Program execution is complete.",
                {
                    vector: vector,
                    scores: scores
                },
                "print(round(scores, 2))",
                output
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

        codeContainer.innerHTML = lines.map(function (
            line,
            index
        ) {
            return '<div class="aiml-code-line" data-line="'
                + index
                + '"><span>'
                + String(index + 1).padStart(2, "0")
                + "</span><code>"
                + escapeHtml(line)
                + "</code></div>";
        }).join("");

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

            const current = atStart
                ? null
                : states[step - 1];

            codeContainer
                .querySelectorAll(".aiml-code-line")
                .forEach(function (line, index) {
                    line.classList.toggle(
                        "is-active",
                        Boolean(current)
                            && index === current.line
                    );
                });

            if (current) {
                const activeLine =
                    codeContainer.querySelector(
                        '[data-line="'
                            + current.line
                            + '"]'
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
                current ? current.variables : {};

            byId("tracerVariables").innerHTML =
                Object.keys(variables).length
                    ? Object.keys(variables)
                        .map(function (key) {
                            return '<article class="aiml-variable"><span>'
                                + escapeHtml(key)
                                + "</span><code>"
                                + escapeHtml(
                                    formatValue(
                                        variables[key]
                                    )
                                )
                                + "</code></article>";
                        }).join("")
                    : '<article class="aiml-variable">'
                        + '<span>STATE</span>'
                        + '<code>Not started</code>'
                        + "</article>";

            previous.disabled = atStart;
            next.disabled = atEnd;

            auto.disabled =
                atEnd || timer !== null;

            pause.disabled =
                timer === null;

            byId("tracerProgress").textContent =
                "Step "
                + step
                + " of "
                + states.length;

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
                step >= states.length
                || timer !== null
            ) {
                return;
            }

            auto.disabled = true;
            pause.disabled = false;

            timer = window.setInterval(
                advance,
                650
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

        if (!list) {
            return;
        }

        const problems = [
            {
                title: "Centre Every Feature Column",
                description: "Calculate column means and print the centred 2-D observations.",
                sampleInput: "X=[[2,1],[4,3],[6,5]]",
                expected: "[[-2.0,-2.0],[0.0,0.0],[2.0,2.0]]",
                hint: "Find one mean per column, then subtract means[j] from every row[j].",
                starter: "X = [[2, 1], [4, 3], [6, 5]]\n# Calculate feature means and centred rows\n",
                solution: "X = [[2, 1], [4, 3], [6, 5]]\nn = len(X)\nmeans = [sum(row[j] for row in X) / n for j in range(2)]\ncentered = [[row[j] - means[j] for j in range(2)] for row in X]\nprint(centered)",
                required: [
                    ["len("],
                    ["sum("],
                    ["for j in range"],
                    [
                        "row[j] - means[j]",
                        "row[j]-means[j]"
                    ],
                    ["print("]
                ]
            },
            {
                title: "Build a Sample Covariance Matrix",
                description: "Use centred rows to calculate the complete 2 × 2 sample covariance matrix.",
                sampleInput: "centered=[[-2,-1],[0,0],[2,1]]",
                expected: "[[4.0,2.0],[2.0,1.0]]",
                hint: "Accumulate row[i] * row[j] and divide by n-1 for each matrix cell.",
                starter: "centered = [[-2, -1], [0, 0], [2, 1]]\nn = len(centered)\n# Build the covariance matrix\n",
                solution: "centered = [[-2, -1], [0, 0], [2, 1]]\nn = len(centered)\ncovariance = [[0.0, 0.0], [0.0, 0.0]]\nfor row in centered:\n    for i in range(2):\n        for j in range(2):\n            covariance[i][j] += row[i] * row[j] / (n - 1)\nprint(covariance)",
                required: [
                    ["for row in"],
                    ["for i in range"],
                    ["for j in range"],
                    [
                        "row[i] * row[j]",
                        "row[i]*row[j]"
                    ],
                    ["n - 1", "n-1"],
                    ["print("]
                ]
            },
            {
                title: "Calculate Explained Variance Ratios",
                description: "Convert sorted PCA eigenvalues into per-component and cumulative explained-variance ratios.",
                sampleInput: "eigenvalues=[6.0,3.0,1.0]",
                expected: "ratios=[0.6,0.3,0.1], cumulative=[0.6,0.9,1.0]",
                hint: "Divide each eigenvalue by their total and maintain a running sum.",
                starter: "eigenvalues = [6.0, 3.0, 1.0]\n# Calculate ratios and cumulative ratios\n",
                solution: "eigenvalues = [6.0, 3.0, 1.0]\ntotal = sum(eigenvalues)\nratios = [value / total for value in eigenvalues]\ncumulative = []\nrunning = 0.0\nfor ratio in ratios:\n    running += ratio\n    cumulative.append(running)\nprint(ratios)\nprint(cumulative)",
                required: [
                    ["sum("],
                    ["value / total", "value/total"],
                    ["for ratio in"],
                    [
                        "running += ratio",
                        "running=running+ratio"
                    ],
                    ["append("],
                    ["print("]
                ]
            },
            {
                title: "Project Rows onto One Component",
                description: "Calculate one PCA score per centred observation using a supplied unit vector.",
                sampleInput: "Xc=[[-2,-1],[0,0],[2,1]], component=[0.8944,0.4472]",
                expected: "[-2.236,0.0,2.236]",
                hint: "Each score is the dot product of one centred row and the component vector.",
                starter: "Xc = [[-2, -1], [0, 0], [2, 1]]\ncomponent = [0.8944, 0.4472]\n# Project each row\n",
                solution: "Xc = [[-2, -1], [0, 0], [2, 1]]\ncomponent = [0.8944, 0.4472]\nscores = []\nfor row in Xc:\n    score = sum(row[j] * component[j] for j in range(2))\n    scores.append(round(score, 3))\nprint(scores)",
                required: [
                    ["for row in"],
                    ["sum("],
                    [
                        "row[j] * component[j]",
                        "row[j]*component[j]"
                    ],
                    ["append("],
                    ["round("],
                    ["print("]
                ]
            },
            {
                title: "Reconstruct and Measure RMSE",
                description: "Rebuild 2-D centred rows from one score and component, then calculate reconstruction RMSE.",
                sampleInput: "scores=[-2.236,0,2.236], component=[0.8944,0.4472]",
                expected: "reconstructed rows and RMSE",
                hint: "Reconstruction is score * component for every feature; average all squared cell errors before the square root.",
                starter: "Xc = [[-2, -1], [0, 0], [2, 1]]\nscores = [-2.236, 0.0, 2.236]\ncomponent = [0.8944, 0.4472]\n# Reconstruct and calculate RMSE\n",
                solution: "Xc = [[-2, -1], [0, 0], [2, 1]]\nscores = [-2.236, 0.0, 2.236]\ncomponent = [0.8944, 0.4472]\nreconstructed = [[score * component[j] for j in range(2)] for score in scores]\nsquared_error = 0.0\nfor row, rebuilt in zip(Xc, reconstructed):\n    for original, estimate in zip(row, rebuilt):\n        squared_error += (original - estimate) ** 2\nrmse = (squared_error / (len(Xc) * 2)) ** 0.5\nprint(reconstructed)\nprint(round(rmse, 4))",
                required: [
                    [
                        "score * component[j]",
                        "score*component[j]"
                    ],
                    ["zip("],
                    ["** 2", "**2"],
                    ["len("],
                    ["** 0.5", "**0.5"],
                    ["round("],
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
            saved.problemScores
            && typeof saved.problemScores === "object"
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
                    return sum
                        + Number(score || 0);
                }, 0);

            byId("problemSolvedCount").textContent =
                solved.size
                + " / "
                + problems.length;

            byId("problemScore").textContent =
                total
                + " / "
                + (problems.length * 100);

            byId("problemProgressBar").style.width =
                solved.size
                / problems.length
                * 100
                + "%";
        }

        list.innerHTML = problems.map(function (
            problem,
            index
        ) {
            const number = index + 1;

            constrains. The code block is extremely large. It may be truncated by the interface. The full JS file is available through the linked file above.
