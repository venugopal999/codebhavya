(function () {
    "use strict";

    function start() {
        const get = function (id) {
            return document.getElementById(id);
        };

        const originalCanvas = get("svdOriginal");
        if (!originalCanvas) return;

        const testContext = originalCanvas.getContext("2d");

        try {
            if (
                originalCanvas.width > 300 &&
                originalCanvas.height > 150 &&
                testContext.getImageData(0, 0, 1, 1).data[3] > 0
            ) {
                return;
            }
        } catch (error) {
            /* Continue with the independent renderer. */
        }

        const datasetInput = get("svdDataset");
        const rankInput = get("svdRank");
        const nextButton = get("svdNext");
        const autoButton = get("svdAuto");
        const pauseButton = get("svdPause");
        const resetButton = get("svdReset");
        const reconstructedCanvas = get("svdReconstructed");
        const errorCanvas = get("svdError");

        if (
            !datasetInput ||
            !rankInput ||
            !nextButton ||
            !autoButton ||
            !pauseButton ||
            !resetButton ||
            !reconstructedCanvas ||
            !errorCanvas
        ) {
            return;
        }

        const baseBands = [
            [.05, .05, .82, .82, .82, .05, .05],
            [.05, .08, .85, .90, .85, .08, .05],
            [.08, .10, .88, .95, .88, .10, .08],
            [.08, .12, .90, 1.0, .90, .12, .08],
            [.08, .10, .88, .95, .88, .10, .08],
            [.05, .08, .85, .90, .85, .08, .05],
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
                            return (
                                .08 +
                                .075 * row +
                                .065 * column
                            );
                        }
                    );
                }
            ),

            symbol: [
                [.05, .75, .95, .95, .80, .20, .05],
                [.65, .95, .35, .12, .12, .08, .05],
                [.90, .45, .08, .05, .05, .05, .05],
                [.95, .35, .05, .05, .05, .05, .05],
                [.90, .45, .08, .05, .05, .05, .05],
                [.65, .95, .35, .12, .12, .08, .05],
                [.05, .75, .95, .95, .80, .20, .05]
            ],

            noise: baseBands.map(
                function (row, rowIndex) {
                    return row.map(
                        function (value, columnIndex) {
                            return clamp(
                                value +
                                (
                                    (
                                        rowIndex * 11 +
                                        columnIndex * 7
                                    ) % 9 - 4
                                ) * .035,
                                0,
                                1
                            );
                        }
                    );
                }
            )
        };

        const phases = [
            "Original matrix",
            "Gram matrix XᵀX",
            "Singular spectrum",
            "Rank selection",
            "Reconstruction",
            "Complete"
        ];

        let step = 0;
        let timer = null;

        function clamp(value, minimum, maximum) {
            return Math.min(
                maximum,
                Math.max(minimum, value)
            );
        }

        function fixed(value, digits) {
            return Number(value).toFixed(digits);
        }

        function dot(a, b) {
            return a.reduce(
                function (sum, value, index) {
                    return sum + value * b[index];
                },
                0
            );
        }

        function identity(size) {
            return Array.from(
                { length: size },
                function (_, row) {
                    return Array.from(
                        { length: size },
                        function (__, column) {
                            return row === column ? 1 : 0;
                        }
                    );
                }
            );
        }

        function transpose(matrix) {
            return matrix[0].map(
                function (_, column) {
                    return matrix.map(
                        function (row) {
                            return row[column];
                        }
                    );
                }
            );
        }

        function multiplyMatrices(a, b) {
            const transposedB = transpose(b);

            return a.map(function (row) {
                return transposedB.map(
                    function (column) {
                        return dot(row, column);
                    }
                );
            });
        }

        function jacobiEigen(matrix) {
            const size = matrix.length;

            const values = matrix.map(
                function (row) {
                    return row.slice();
                }
            );

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
                            Math.abs(
                                values[row][column]
                            ) > largest
                        ) {
                            largest = Math.abs(
                                values[row][column]
                            );

                            p = row;
                            q = column;
                        }
                    }
                }

                if (largest < 1e-10) {
                    break;
                }

                const angle = .5 * Math.atan2(
                    2 * values[p][q],
                    values[q][q] - values[p][p]
                );

                const cosine = Math.cos(angle);
                const sine = Math.sin(angle);

                for (
                    let index = 0;
                    index < size;
                    index += 1
                ) {
                    if (
                        index !== p &&
                        index !== q
                    ) {
                        const aip =
                            values[index][p];

                        const aiq =
                            values[index][q];

                        values[index][p] =
                        values[p][index] =
                            cosine * aip -
                            sine * aiq;

                        values[index][q] =
                        values[q][index] =
                            sine * aip +
                            cosine * aiq;
                    }
                }

                const app = values[p][p];
                const aqq = values[q][q];
                const apq = values[p][q];

                values[p][p] =
                    cosine * cosine * app -
                    2 * sine * cosine * apq +
                    sine * sine * aqq;

                values[q][q] =
                    sine * sine * app +
                    2 * sine * cosine * apq +
                    cosine * cosine * aqq;

                values[p][q] = 0;
                values[q][p] = 0;

                for (
                    let row = 0;
                    row < size;
                    row += 1
                ) {
                    const vip =
                        vectors[row][p];

                    const viq =
                        vectors[row][q];

                    vectors[row][p] =
                        cosine * vip -
                        sine * viq;

                    vectors[row][q] =
                        sine * vip +
                        cosine * viq;
                }
            }

            return Array.from(
                { length: size },
                function (_, index) {
                    return {
                        value: Math.max(
                            0,
                            values[index][index]
                        ),

                        vector: vectors.map(
                            function (row) {
                                return row[index];
                            }
                        )
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

                    const matrixVector =
                        matrix.map(function (row) {
                            return dot(
                                row,
                                pair.vector
                            );
                        });

                    return {
                        singular: singular,
                        v: pair.vector,

                        u: matrixVector.map(
                            function (value) {
                                return (
                                    value / singular
                                );
                            }
                        )
                    };
                });

            const reconstruction =
                matrix.map(function (row) {
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
                                factor.singular *
                                factor.u[row] *
                                factor.v[column];
                        }
                    }
                });

            let squaredError = 0;

            matrix.forEach(
                function (row, rowIndex) {
                    row.forEach(
                        function (
                            value,
                            columnIndex
                        ) {
                            squaredError += Math.pow(
                                value -
                                reconstruction[
                                    rowIndex
                                ][columnIndex],
                                2
                            );
                        }
                    );
                }
            );

            const energies = factors.map(
                function (factor) {
                    return (
                        factor.singular *
                        factor.singular
                    );
                }
            );

            const totalEnergy = Math.max(
                1e-12,
                energies.reduce(
                    function (sum, value) {
                        return sum + value;
                    },
                    0
                )
            );

            return {
                gram: gram,
                factors: factors,
                reconstruction: reconstruction,

                rmse: Math.sqrt(
                    squaredError /
                    (
                        matrix.length *
                        matrix[0].length
                    )
                ),

                energy:
                    energies
                        .slice(0, retained)
                        .reduce(
                            function (
                                sum,
                                value
                            ) {
                                return sum + value;
                            },
                            0
                        ) / totalEnergy
            };
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

            canvas.style.height =
                width + "px";

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

            context.fillRect(
                0,
                0,
                width,
                width
            );

            if (placeholder) {
                context.fillStyle = "#8facbf";

                context.font =
                    "700 13px Arial, sans-serif";

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

            const cellWidth =
                width / columns;

            const cellHeight =
                width / rows;

            let maximum = 1;

            if (mode === "error") {
                maximum = .001;

                matrix.forEach(function (row) {
                    row.forEach(function (value) {
                        maximum = Math.max(
                            maximum,
                            Math.abs(value)
                        );
                    });
                });
            }

            matrix.forEach(
                function (row, rowIndex) {
                    row.forEach(
                        function (
                            value,
                            columnIndex
                        ) {
                            const normalized =
                                clamp(
                                    Math.abs(value) /
                                    maximum,
                                    0,
                                    1
                                );

                            if (mode === "error") {
                                context.fillStyle =
                                    "rgb(" +
                                    Math.round(
                                        25 +
                                        225 * normalized
                                    ) +
                                    "," +
                                    Math.round(
                                        35 +
                                        85 *
                                        (
                                            1 -
                                            normalized
                                        )
                                    ) +
                                    "," +
                                    Math.round(
                                        65 +
                                        80 *
                                        (
                                            1 -
                                            normalized
                                        )
                                    ) +
                                    ")";
                            } else {
                                context.fillStyle =
                                    "rgb(" +
                                    Math.round(
                                        6 +
                                        244 * normalized
                                    ) +
                                    "," +
                                    Math.round(
                                        24 +
                                        185 * normalized
                                    ) +
                                    "," +
                                    Math.round(
                                        44 +
                                        40 *
                                        (
                                            1 -
                                            normalized
                                        )
                                    ) +
                                    ")";
                            }

                            context.fillRect(
                                columnIndex *
                                cellWidth,

                                rowIndex *
                                cellHeight,

                                cellWidth + .5,
                                cellHeight + .5
                            );

                            context.strokeStyle =
                                "rgba(255,255,255,.14)";

                            context.strokeRect(
                                columnIndex *
                                cellWidth,

                                rowIndex *
                                cellHeight,

                                cellWidth,
                                cellHeight
                            );
                        }
                    );
                }
            );
        }

        function stopAuto() {
            if (timer !== null) {
                window.clearInterval(timer);
            }

            timer = null;
            pauseButton.disabled = true;
        }

        function render() {
            const matrix =
                datasets[datasetInput.value] ||
                datasets.bands;

            const rank =
                Number(rankInput.value);

            const calculation =
                calculateSvd(matrix, rank);

            const atEnd =
                step >= phases.length;

            const originalStorage =
                matrix.length *
                matrix[0].length;

            const compressedStorage =
                rank *
                (
                    matrix.length +
                    matrix[0].length +
                    1
                );

            get("svdRankValue").textContent =
                rankInput.value;

            get("svdPhase").textContent =
                step === 0
                    ? "Ready"
                    : phases[
                        Math.min(
                            step - 1,
                            phases.length - 1
                        )
                    ];

            get("svdEnergy").textContent =
                step >= 4
                    ? fixed(
                        calculation.energy * 100,
                        1
                    ) + "%"
                    : "—";

            get("svdRmse").textContent =
                step >= 5
                    ? fixed(
                        calculation.rmse,
                        4
                    )
                    : "—";

            get("svdStorage").textContent =
                step >= 4
                    ? compressedStorage +
                      " vs " +
                      originalStorage
                    : "—";

            drawHeatmap(
                originalCanvas,
                matrix,
                "value",
                ""
            );

            drawHeatmap(
                reconstructedCanvas,
                calculation.reconstruction,
                "value",
                step < 5
                    ? "Available at Step 5"
                    : ""
            );

            const errors = matrix.map(
                function (row, rowIndex) {
                    return row.map(
                        function (
                            value,
                            columnIndex
                        ) {
                            return Math.abs(
                                value -
                                calculation
                                    .reconstruction[
                                        rowIndex
                                    ][columnIndex]
                            );
                        }
                    );
                }
            );

            drawHeatmap(
                errorCanvas,
                errors,
                "error",
                step < 5
                    ? "Available at Step 5"
                    : ""
            );

            const largest =
                calculation.factors.length
                    ? calculation
                        .factors[0]
                        .singular
                    : 1;

            if (step >= 3) {
                get("svdSpectrum").innerHTML =
                    calculation.factors
                        .slice(0, 7)
                        .map(
                            function (
                                factor,
                                index
                            ) {
                                const retained =
                                    index < rank;

                                return (
                                    "<article>" +
                                    "<span>σ" +
                                    (index + 1) +
                                    "</span>" +
                                    "<i><b style=\"width:" +
                                    fixed(
                                        factor.singular /
                                        largest *
                                        100,
                                        1
                                    ) +
                                    "%;opacity:" +
                                    (
                                        retained
                                            ? "1"
                                            : ".28"
                                    ) +
                                    "\"></b></i>" +
                                    "<strong>" +
                                    fixed(
                                        factor.singular,
                                        3
                                    ) +
                                    "</strong>" +
                                    "</article>"
                                );
                            }
                        )
                        .join("");
            } else {
                get("svdSpectrum").innerHTML =
                    "<article>" +
                    "<span>σ</span>" +
                    "<i><b style=\"width:0%\"></b></i>" +
                    "<strong>Waiting</strong>" +
                    "</article>";
            }

            const messages = [
                [
                    "Original matrix is ready.",
                    "The selected 7 × 7 matrix is displayed immediately. Dominant singular values will reveal reusable structure.",
                    "Predict which pattern will compress most accurately at rank 1."
                ],
                [
                    "The original matrix contains 49 values.",
                    "Repeated rows, columns, symmetry and smooth change often indicate low effective rank.",
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
                    "Identify the first weak factor from the spectrum."
                ],
                [
                    "Rank K selects the retained singular triplets.",
                    "Energy uses squared singular values; storage counts U, Σ and V factor values.",
                    "Compare retained energy with storage."
                ],
                [
                    "The matrix is reconstructed from retained factors.",
                    "Bright error cells expose details that the selected rank cannot reproduce.",
                    "Decide whether discarded detail is acceptable."
                ],
                [
                    "Low-rank analysis is complete.",
                    "Change the pattern or rank to see when structural compression succeeds or fails.",
                    "Validate reconstruction and downstream usefulness before deployment."
                ]
            ];

            const message =
                messages[
                    Math.min(
                        step,
                        messages.length - 1
                    )
                ];

            get("svdVerdict").textContent =
                message[0];

            get("svdExplanation").textContent =
                message[1];

            get("svdNextCheck").textContent =
                message[2];

            nextButton.textContent =
                atEnd
                    ? "Compression Complete"
                    : step === 0
                        ? "Inspect Matrix"
                        : "Next: " +
                          phases[step];

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
                    900
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
            rankInput
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
            render
        );

        originalCanvas.dataset.cbSvdRenderer =
            "active";

        render();
    }

    function scheduleStart() {
        window.requestAnimationFrame(
            function () {
                window.setTimeout(
                    start,
                    70
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
