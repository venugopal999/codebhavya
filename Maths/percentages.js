(function () {
    "use strict";

    const modeDetails = {
        part: {
            a: "Percentage p",
            b: "Value",
            title: "Percentage of a Value"
        },
        percent: {
            a: "Part",
            b: "Whole",
            title: "Part as a Percentage"
        },
        increase: {
            a: "Percentage increase p",
            b: "Original value",
            title: "Value After Increase"
        },
        decrease: {
            a: "Percentage decrease p",
            b: "Original value",
            title: "Value After Decrease"
        },
        change: {
            a: "Original value",
            b: "New value",
            title: "Percentage Change"
        },
        reverseIncrease: {
            a: "Percentage increase p",
            b: "Final value",
            title: "Original Before Increase"
        },
        reverseDecrease: {
            a: "Percentage decrease p",
            b: "Final value",
            title: "Original Before Decrease"
        },
        successive: {
            a: "First change %",
            b: "Second change %",
            title: "Successive Percentage Change"
        }
    };

    function rounded(value) {
        return String(
            Math.round((value + Number.EPSILON) * 1000000) / 1000000
        );
    }

    function hideResult(text) {
        const result = document.getElementById(
            "percentageExplorerResult"
        );

        const message = document.getElementById(
            "percentageExplorerMessage"
        );

        if (result) {
            result.hidden = true;
        }

        if (message) {
            message.hidden = false;

            message.textContent =
                text ||
                "Values are ready. Click Calculate Percentage to display the result.";
        }
    }

    function updateLabels() {
        const mode = document.getElementById("percentageMode");

        const labelA = document.getElementById(
            "percentageLabelA"
        );

        const labelB = document.getElementById(
            "percentageLabelB"
        );

        if (!mode || !labelA || !labelB) {
            return;
        }

        const details = modeDetails[mode.value];

        labelA.textContent = details.a;
        labelB.textContent = details.b;

        hideResult();
    }

    function calculate() {
        const mode = document.getElementById(
            "percentageMode"
        );

        const inputA = document.getElementById(
            "percentageValueA"
        );

        const inputB = document.getElementById(
            "percentageValueB"
        );

        const result = document.getElementById(
            "percentageExplorerResult"
        );

        const message = document.getElementById(
            "percentageExplorerMessage"
        );

        const title = document.getElementById(
            "percentageResultTitle"
        );

        const number = document.getElementById(
            "percentageResultNumber"
        );

        const formula = document.getElementById(
            "percentageResultFormula"
        );

        const explanation = document.getElementById(
            "percentageResultExplanation"
        );

        if (
            !mode ||
            !inputA ||
            !inputB ||
            !result ||
            !message ||
            !title ||
            !number ||
            !formula ||
            !explanation
        ) {
            return;
        }

        const a = Number(inputA.value);
        const b = Number(inputB.value);

        if (!Number.isFinite(a) || !Number.isFinite(b)) {
            hideResult(
                "Enter valid numeric values in both fields."
            );
            return;
        }

        let value;
        let formulaText;
        let explanationText;
        let suffix = "";

        if (mode.value === "part") {
            value = (a / 100) * b;

            formulaText =
                rounded(a) +
                "/100 × " +
                rounded(b) +
                " = " +
                rounded(value);

            explanationText =
                "The percentage was converted to a decimal multiplier and applied to the value.";
        }

        else if (mode.value === "percent") {
            if (b === 0) {
                hideResult(
                    "The whole must be greater than 0."
                );
                return;
            }

            value = (a / b) * 100;
            suffix = "%";

            formulaText =
                "(" +
                rounded(a) +
                " / " +
                rounded(b) +
                ") × 100 = " +
                rounded(value) +
                "%";

            explanationText =
                "The part was divided by the whole and multiplied by 100.";
        }

        else if (
            mode.value === "increase" ||
            mode.value === "decrease"
        ) {
            if (a < 0) {
                hideResult(
                    "Enter a non-negative percentage."
                );
                return;
            }

            const factor =
                mode.value === "increase"
                    ? 1 + a / 100
                    : 1 - a / 100;

            if (factor < 0) {
                hideResult(
                    "A decrease cannot exceed 100% for this calculation."
                );
                return;
            }

            value = b * factor;

            formulaText =
                rounded(b) +
                " × " +
                rounded(factor) +
                " = " +
                rounded(value);

            explanationText =
                mode.value === "increase"
                    ? "The original was multiplied by 1 + p/100."
                    : "The original was multiplied by 1 − p/100.";
        }

        else if (mode.value === "change") {
            if (a === 0) {
                hideResult(
                    "The original value must not be 0."
                );
                return;
            }

            const difference = b - a;

            value = (difference / a) * 100;
            suffix = "%";

            formulaText =
                "(" +
                rounded(b) +
                " − " +
                rounded(a) +
                ") / " +
                rounded(a) +
                " × 100 = " +
                rounded(value) +
                "%";

            explanationText =
                value >= 0
                    ? "The positive result is a percentage increase."
                    : "The negative result is a percentage decrease.";
        }

        else if (
            mode.value === "reverseIncrease" ||
            mode.value === "reverseDecrease"
        ) {
            if (a < 0) {
                hideResult(
                    "Enter a non-negative percentage."
                );
                return;
            }

            const factor =
                mode.value === "reverseIncrease"
                    ? 1 + a / 100
                    : 1 - a / 100;

            if (factor <= 0) {
                hideResult(
                    "The reverse multiplier must be greater than 0."
                );
                return;
            }

            value = b / factor;

            formulaText =
                rounded(b) +
                " / " +
                rounded(factor) +
                " = " +
                rounded(value);

            explanationText =
                "The final value was divided by the percentage multiplier to recover the original.";
        }

        else {
            value = a + b + (a * b) / 100;
            suffix = "%";

            formulaText =
                rounded(a) +
                " + " +
                rounded(b) +
                " + (" +
                rounded(a) +
                " × " +
                rounded(b) +
                " / 100) = " +
                rounded(value) +
                "%";

            explanationText =
                value >= 0
                    ? "The combined multiplier gives a net increase."
                    : "The combined multiplier gives a net decrease.";
        }

        title.textContent =
            modeDetails[mode.value].title;

        number.textContent =
            rounded(value) + suffix;

        formula.textContent = formulaText;
        explanation.textContent = explanationText;

        message.hidden = true;
        result.hidden = false;
    }

    function fillExample(button) {
        const mode = document.getElementById(
            "percentageMode"
        );

        const a = document.getElementById(
            "percentageValueA"
        );

        const b = document.getElementById(
            "percentageValueB"
        );

        if (!mode || !a || !b) {
            return;
        }

        mode.value = button.dataset.mode;
        a.value = button.dataset.a;
        b.value = button.dataset.b;

        updateLabels();
    }

    function initialiseSolutions() {
        document
            .querySelectorAll(".solution-toggle")
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

                        const opening = answer.hidden;

                        answer.hidden = !opening;

                        button.setAttribute(
                            "aria-expanded",
                            String(opening)
                        );

                        button.textContent = opening
                            ? "Hide Solution"
                            : "Show Solution";
                    }
                );
            });
    }

    document.addEventListener(
        "DOMContentLoaded",
        function () {
            const mode = document.getElementById(
                "percentageMode"
            );

            const calculateButton =
                document.getElementById(
                    "calculatePercentageButton"
                );

            if (mode) {
                mode.addEventListener(
                    "change",
                    updateLabels
                );
            }

            if (calculateButton) {
                calculateButton.addEventListener(
                    "click",
                    calculate
                );
            }

            document
                .querySelectorAll(
                    ".explorer-example-button"
                )
                .forEach(function (button) {
                    button.addEventListener(
                        "click",
                        function () {
                            fillExample(button);
                        }
                    );
                });

            [
                "percentageValueA",
                "percentageValueB"
            ].forEach(function (id) {
                const input =
                    document.getElementById(id);

                if (input) {
                    input.addEventListener(
                        "input",
                        function () {
                            hideResult();
                        }
                    );
                }
            });

            initialiseSolutions();
            updateLabels();

            const initial =
                document.getElementById(
                    "percentageExplorerMessage"
                );

            if (initial) {
                initial.textContent =
                    "Select a calculation or example, then click Calculate Percentage.";
            }
        }
    );
}());
