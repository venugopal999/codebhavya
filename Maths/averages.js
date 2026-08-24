(function () {
    "use strict";

    const configurations = {
        simple: {
            labels: ["Values (comma-separated)"]
        },
        weighted: {
            labels: [
                "Values (comma-separated)",
                "Weights (comma-separated)"
            ]
        },
        combined: {
            labels: [
                "Group 1 count",
                "Group 1 average",
                "Group 2 count",
                "Group 2 average"
            ]
        },
        missing: {
            labels: [
                "Total number of values",
                "Required average",
                "Known values (comma-separated)"
            ]
        },
        equalDistance: {
            labels: [
                "First speed",
                "Second speed"
            ]
        }
    };

    function round(value) {
        return String(
            Math.round(
                (value + Number.EPSILON) * 1000000
            ) / 1000000
        );
    }

    function parseList(text) {
        if (!String(text).trim()) {
            return null;
        }

        const values = String(text)
            .split(",")
            .map(function (item) {
                return Number(item.trim());
            });

        return values.length &&
            values.every(Number.isFinite)
            ? values
            : null;
    }

    function hideResult(text) {
        const result =
            document.getElementById(
                "averageExplorerResult"
            );

        const message =
            document.getElementById(
                "averageExplorerMessage"
            );

        if (result) {
            result.hidden = true;
        }

        if (message) {
            message.hidden = false;

            message.textContent =
                text ||
                "Values are ready. Click Calculate Average to display the result.";
        }
    }

    function updateFields() {
        const mode =
            document.getElementById(
                "averageMode"
            );

        if (!mode) {
            return;
        }

        const labels =
            configurations[mode.value].labels;

        ["A", "B", "C", "D"].forEach(
            function (letter, index) {
                const field =
                    document.getElementById(
                        "averageField" + letter
                    );

                const label =
                    document.getElementById(
                        "averageLabel" + letter
                    );

                const input =
                    document.getElementById(
                        "averageValue" + letter
                    );

                if (!field || !label || !input) {
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

    function show(
        titleText,
        value,
        formulaText,
        explanationText
    ) {
        const result =
            document.getElementById(
                "averageExplorerResult"
            );

        const message =
            document.getElementById(
                "averageExplorerMessage"
            );

        const title =
            document.getElementById(
                "averageResultTitle"
            );

        const number =
            document.getElementById(
                "averageResultNumber"
            );

        const formula =
            document.getElementById(
                "averageResultFormula"
            );

        const explanation =
            document.getElementById(
                "averageResultExplanation"
            );

        title.textContent = titleText;
        number.textContent = round(value);
        formula.textContent = formulaText;
        explanation.textContent =
            explanationText;

        message.hidden = true;
        result.hidden = false;
    }

    function calculate() {
        const mode =
            document.getElementById(
                "averageMode"
            );

        if (!mode) {
            return;
        }

        const values =
            ["A", "B", "C", "D"].map(
                function (letter) {
                    return document
                        .getElementById(
                            "averageValue" + letter
                        )
                        .value;
                }
            );

        if (mode.value === "simple") {
            const list =
                parseList(values[0]);

            if (!list) {
                hideResult(
                    "Enter at least one valid comma-separated number."
                );
                return;
            }

            const sum =
                list.reduce(function (a, b) {
                    return a + b;
                }, 0);

            const mean = sum / list.length;

            show(
                "Arithmetic Mean",
                mean,
                "(" +
                    list.join(" + ") +
                    ") / " +
                    list.length +
                    " = " +
                    round(mean),
                "The sum was divided by the number of observations."
            );
        }

        else if (mode.value === "weighted") {
            const list =
                parseList(values[0]);

            const weights =
                parseList(values[1]);

            if (
                !list ||
                !weights ||
                list.length !== weights.length ||
                weights.some(function (weight) {
                    return weight < 0;
                }) ||
                weights.reduce(function (a, b) {
                    return a + b;
                }, 0) === 0
            ) {
                hideResult(
                    "Enter equal-length value and non-negative weight lists with a positive total weight."
                );
                return;
            }

            const weightedSum =
                list.reduce(
                    function (
                        total,
                        value,
                        index
                    ) {
                        return total +
                            value *
                            weights[index];
                    },
                    0
                );

            const weightSum =
                weights.reduce(
                    function (a, b) {
                        return a + b;
                    },
                    0
                );

            const mean =
                weightedSum / weightSum;

            show(
                "Weighted Average",
                mean,
                round(weightedSum) +
                    " / " +
                    round(weightSum) +
                    " = " +
                    round(mean),
                "Each value was multiplied by its weight before division by the total weight."
            );
        }

        else if (mode.value === "combined") {
            const numbers =
                values.map(Number);

            if (
                numbers.some(function (value) {
                    return !Number.isFinite(
                        value
                    );
                }) ||
                numbers[0] <= 0 ||
                numbers[2] <= 0
            ) {
                hideResult(
                    "Enter positive group counts and valid group averages."
                );
                return;
            }

            const total =
                numbers[0] * numbers[1] +
                numbers[2] * numbers[3];

            const count =
                numbers[0] + numbers[2];

            const mean = total / count;

            show(
                "Combined Average",
                mean,
                "(" +
                    round(numbers[0]) +
                    "×" +
                    round(numbers[1]) +
                    " + " +
                    round(numbers[2]) +
                    "×" +
                    round(numbers[3]) +
                    ") / " +
                    round(count) +
                    " = " +
                    round(mean),
                "Each group average was converted into a total before the groups were combined."
            );
        }

        else if (mode.value === "missing") {
            const count =
                Number(values[0]);

            const target =
                Number(values[1]);

            const known =
                parseList(values[2]);

            if (
                !Number.isInteger(count) ||
                count < 2 ||
                !Number.isFinite(target) ||
                !known ||
                known.length !== count - 1
            ) {
                hideResult(
                    "Enter a total count and exactly one fewer known values."
                );
                return;
            }

            const knownSum =
                known.reduce(function (a, b) {
                    return a + b;
                }, 0);

            const missing =
                count * target - knownSum;

            show(
                "Missing Value",
                missing,
                round(count) +
                    "×" +
                    round(target) +
                    " − " +
                    round(knownSum) +
                    " = " +
                    round(missing),
                "The known total was subtracted from the total required by the target average."
            );
        }

        else {
            const firstSpeed =
                Number(values[0]);

            const secondSpeed =
                Number(values[1]);

            if (
                !Number.isFinite(firstSpeed) ||
                !Number.isFinite(secondSpeed) ||
                firstSpeed <= 0 ||
                secondSpeed <= 0
            ) {
                hideResult(
                    "Enter two positive speeds."
                );
                return;
            }

            const speed =
                (
                    2 *
                    firstSpeed *
                    secondSpeed
                ) /
                (
                    firstSpeed +
                    secondSpeed
                );

            show(
                "Average Speed for Equal Distances",
                speed,
                "2×" +
                    round(firstSpeed) +
                    "×" +
                    round(secondSpeed) +
                    " / (" +
                    round(firstSpeed) +
                    "+" +
                    round(secondSpeed) +
                    ") = " +
                    round(speed),
                "Equal distances require the harmonic-mean formula because the travel times differ."
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
                    "averageMode"
                );

            const button =
                document.getElementById(
                    "calculateAverageButton"
                );

            if (mode) {
                mode.addEventListener(
                    "change",
                    updateFields
                );
            }

            if (button) {
                button.addEventListener(
                    "click",
                    calculate
                );
            }

            ["A", "B", "C", "D"].forEach(
                function (letter) {
                    const input =
                        document.getElementById(
                            "averageValue" +
                                letter
                        );

                    if (input) {
                        input.addEventListener(
                            "input",
                            function () {
                                hideResult();
                            }
                        );
                    }
                }
            );

            document
                .querySelectorAll(
                    ".explorer-example-button"
                )
                .forEach(function (example) {
                    example.addEventListener(
                        "click",
                        function () {
                            mode.value =
                                example.dataset.mode;

                            [
                                "a",
                                "b",
                                "c",
                                "d"
                            ].forEach(
                                function (letter) {
                                    document
                                        .getElementById(
                                            "averageValue" +
                                                letter.toUpperCase()
                                        )
                                        .value =
                                        example.dataset[
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

            const message =
                document.getElementById(
                    "averageExplorerMessage"
                );

            if (message) {
                message.textContent =
                    "Select a calculation or example, then click Calculate Average.";
            }
        }
    );
}());
