(function () {
    "use strict";

    const configs = {
        simplify: [
            "First term",
            "Second term"
        ],
        equivalent: [
            "First term",
            "Second term",
            "Multiplier"
        ],
        proportion: [
            "a",
            "b",
            "c",
            "d"
        ],
        fourth: [
            "a",
            "b",
            "c"
        ],
        divide: [
            "Total",
            "Ratio terms (comma-separated)"
        ],
        direct: [
            "First x",
            "First y",
            "Second x"
        ],
        inverse: [
            "First x",
            "First y",
            "Second x"
        ]
    };

    function round(value) {
        return String(
            Math.round(
                (value + Number.EPSILON) *
                1000000
            ) / 1000000
        );
    }

    function list(text) {
        if (!String(text).trim()) {
            return null;
        }

        const values = String(text)
            .split(",")
            .map(function (value) {
                return Number(value.trim());
            });

        return (
            values.length &&
            values.every(Number.isFinite) &&
            values.every(function (value) {
                return value > 0;
            })
        ) ? values : null;
    }

    function gcd(a, b) {
        a = Math.abs(a);
        b = Math.abs(b);

        while (b) {
            const temporary = b;
            b = a % b;
            a = temporary;
        }

        return a || 1;
    }

    function simplePair(aText, bText) {
        const a = Number(aText);
        const b = Number(bText);

        if (
            !Number.isFinite(a) ||
            !Number.isFinite(b) ||
            a <= 0 ||
            b <= 0
        ) {
            return null;
        }

        const aDecimals =
            (
                String(aText).split(".")[1] ||
                ""
            ).length;

        const bDecimals =
            (
                String(bText).split(".")[1] ||
                ""
            ).length;

        const decimals =
            Math.max(
                aDecimals,
                bDecimals
            );

        const scale =
            Math.pow(10, decimals);

        const first =
            Math.round(a * scale);

        const second =
            Math.round(b * scale);

        const divisor =
            gcd(first, second);

        return [
            first / divisor,
            second / divisor
        ];
    }

    function hideResult(text) {
        const result =
            document.getElementById(
                "ratioExplorerResult"
            );

        const message =
            document.getElementById(
                "ratioExplorerMessage"
            );

        if (result) {
            result.hidden = true;
        }

        if (message) {
            message.hidden = false;

            message.textContent =
                text ||
                "Values are ready. Click Calculate to display the result.";
        }
    }

    function updateFields() {
        const mode =
            document.getElementById(
                "ratioMode"
            );

        if (!mode) {
            return;
        }

        const labels =
            configs[mode.value];

        ["A", "B", "C", "D"].forEach(
            function (letter, index) {
                const field =
                    document.getElementById(
                        "ratioField" + letter
                    );

                const label =
                    document.getElementById(
                        "ratioLabel" + letter
                    );

                if (!field || !label) {
                    return;
                }

                field.hidden =
                    index >= labels.length;

                if (index < labels.length) {
                    label.textContent =
                        labels[index];
                }
            }
        );

        hideResult();
    }

    function showResult(
        title,
        value,
        formula,
        explanation
    ) {
        document.getElementById(
            "ratioResultTitle"
        ).textContent = title;

        document.getElementById(
            "ratioResultNumber"
        ).textContent = value;

        document.getElementById(
            "ratioResultFormula"
        ).textContent = formula;

        document.getElementById(
            "ratioResultExplanation"
        ).textContent = explanation;

        document.getElementById(
            "ratioExplorerMessage"
        ).hidden = true;

        document.getElementById(
            "ratioExplorerResult"
        ).hidden = false;
    }

    function calculate() {
        const mode =
            document.getElementById(
                "ratioMode"
            ).value;

        const values =
            ["A", "B", "C", "D"].map(
                function (letter) {
                    return document
                        .getElementById(
                            "ratioValue" + letter
                        )
                        .value;
                }
            );

        const numbers =
            values.map(Number);

        if (mode === "simplify") {
            const pair =
                simplePair(
                    values[0],
                    values[1]
                );

            if (!pair) {
                hideResult(
                    "Enter two positive ratio terms."
                );
                return;
            }

            showResult(
                "Simplified Ratio",
                pair[0] + " : " + pair[1],
                values[0] +
                    " : " +
                    values[1] +
                    " = " +
                    pair[0] +
                    " : " +
                    pair[1],
                "Both terms were converted to whole numbers and divided by their greatest common divisor."
            );
        }

        else if (mode === "equivalent") {
            const required =
                numbers.slice(0, 3);

            if (
                required.some(function (value) {
                    return !Number.isFinite(
                        value
                    );
                }) ||
                required.some(function (value) {
                    return value <= 0;
                })
            ) {
                hideResult(
                    "Enter positive ratio terms and multiplier."
                );
                return;
            }

            showResult(
                "Equivalent Ratio",
                round(
                    numbers[0] *
                    numbers[2]
                ) +
                " : " +
                round(
                    numbers[1] *
                    numbers[2]
                ),
                round(numbers[0]) +
                "×" +
                round(numbers[2]) +
                " : " +
                round(numbers[1]) +
                "×" +
                round(numbers[2]),
                "Multiplying both terms by the same value preserves the ratio."
            );
        }

        else if (mode === "proportion") {
            if (
                numbers.some(function (value) {
                    return !Number.isFinite(
                        value
                    );
                }) ||
                numbers.some(function (value) {
                    return value <= 0;
                })
            ) {
                hideResult(
                    "Enter four positive values."
                );
                return;
            }

            const left =
                numbers[0] * numbers[3];

            const right =
                numbers[1] * numbers[2];

            const proportional =
                Math.abs(left - right) <
                0.000000001;

            showResult(
                "Proportion Check",
                proportional
                    ? "Yes — proportional"
                    : "No — not proportional",
                round(numbers[0]) +
                "×" +
                round(numbers[3]) +
                (
                    proportional
                        ? " = "
                        : " ≠ "
                ) +
                round(numbers[1]) +
                "×" +
                round(numbers[2]),
                proportional
                    ? "The cross products are equal."
                    : "The cross products are different."
            );
        }

        else if (mode === "fourth") {
            const required =
                numbers.slice(0, 3);

            if (
                required.some(function (value) {
                    return !Number.isFinite(
                        value
                    );
                }) ||
                required.some(function (value) {
                    return value <= 0;
                })
            ) {
                hideResult(
                    "Enter three positive values."
                );
                return;
            }

            const answer =
                (
                    numbers[1] *
                    numbers[2]
                ) /
                numbers[0];

            showResult(
                "Fourth Proportional",
                round(answer),
                round(numbers[1]) +
                "×" +
                round(numbers[2]) +
                " / " +
                round(numbers[0]) +
                " = " +
                round(answer),
                "For a:b = c:x, cross multiplication gives x = bc/a."
            );
        }

        else if (mode === "divide") {
            const total = numbers[0];
            const parts = list(values[1]);

            if (
                !Number.isFinite(total) ||
                total <= 0 ||
                !parts
            ) {
                hideResult(
                    "Enter a positive total and positive comma-separated ratio terms."
                );
                return;
            }

            const sum =
                parts.reduce(
                    function (a, b) {
                        return a + b;
                    },
                    0
                );

            const shares =
                parts.map(function (part) {
                    return (
                        total *
                        part /
                        sum
                    );
                });

            showResult(
                "Shares",
                shares
                    .map(round)
                    .join(" : "),
                "Total ratio parts = " +
                round(sum) +
                "; shares = " +
                shares
                    .map(round)
                    .join(", "),
                "Each share equals total × its ratio term ÷ sum of all ratio terms."
            );
        }

        else {
            const required =
                numbers.slice(0, 3);

            if (
                required.some(function (value) {
                    return !Number.isFinite(
                        value
                    );
                }) ||
                required.some(function (value) {
                    return value <= 0;
                })
            ) {
                hideResult(
                    "Enter three positive values."
                );
                return;
            }

            const answer =
                mode === "direct"
                    ? (
                        numbers[1] *
                        numbers[2]
                    ) /
                    numbers[0]
                    : (
                        numbers[0] *
                        numbers[1]
                    ) /
                    numbers[2];

            showResult(
                mode === "direct"
                    ? "Direct Proportion"
                    : "Inverse Proportion",
                round(answer),
                mode === "direct"
                    ? (
                        round(numbers[1]) +
                        "×" +
                        round(numbers[2]) +
                        " / " +
                        round(numbers[0]) +
                        " = " +
                        round(answer)
                    )
                    : (
                        round(numbers[0]) +
                        "×" +
                        round(numbers[1]) +
                        " / " +
                        round(numbers[2]) +
                        " = " +
                        round(answer)
                    ),
                mode === "direct"
                    ? "The quotient y/x remains constant."
                    : "The product xy remains constant."
            );
        }
    }

    function initialiseSolutions() {
        document
            .querySelectorAll(
                ".solution-toggle"
            )
            .forEach(function (button) {
                button.addEventListener(
                    "click",
                    function () {
                        const answer =
                            document.getElementById(
                                button.dataset.target
                            );

                        if (!answer) {
                            return;
                        }

                        const opening =
                            answer.hidden;

                        answer.hidden = !opening;

                        button.setAttribute(
                            "aria-expanded",
                            String(opening)
                        );

                        button.textContent =
                            opening
                                ? "Hide Solution"
                                : "Show Solution";
                    }
                );
            });
    }

    document.addEventListener(
        "DOMContentLoaded",
        function () {
            const mode =
                document.getElementById(
                    "ratioMode"
                );

            mode.addEventListener(
                "change",
                updateFields
            );

            document
                .getElementById(
                    "calculateRatioButton"
                )
                .addEventListener(
                    "click",
                    calculate
                );

            ["A", "B", "C", "D"].forEach(
                function (letter) {
                    document
                        .getElementById(
                            "ratioValue" + letter
                        )
                        .addEventListener(
                            "input",
                            function () {
                                hideResult();
                            }
                        );
                }
            );

            document
                .querySelectorAll(
                    ".explorer-example-button"
                )
                .forEach(function (button) {
                    button.addEventListener(
                        "click",
                        function () {
                            mode.value =
                                button.dataset.mode;

                            [
                                "a",
                                "b",
                                "c",
                                "d"
                            ].forEach(
                                function (letter) {
                                    document
                                        .getElementById(
                                            "ratioValue" +
                                            letter.toUpperCase()
                                        )
                                        .value =
                                        button.dataset[
                                            letter
                                        ] || "";
                                }
                            );

                            updateFields();
                        }
                    );
                });

            initialiseSolutions();
            updateFields();

            document.getElementById(
                "ratioExplorerMessage"
            ).textContent =
                "Select a calculation or example, then click Calculate.";
        }
    );
}());
