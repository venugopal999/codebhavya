(function () {
    "use strict";

    function numberText(value) {
        if (Number.isInteger(value)) {
            return String(value);
        }

        return String(
            Math.round((value + Number.EPSILON) * 1000000) / 1000000
        );
    }

    function resetExplorerResult() {
        const result = document.getElementById("patternExplorerResult");
        const message = document.getElementById("patternExplorerMessage");

        if (result) {
            result.hidden = true;
        }

        if (message) {
            message.hidden = false;
            message.textContent =
                "Values are ready. Click Generate Pattern to display the result.";
        }
    }

    function updateControlLabels() {
        const type = document.getElementById("patternType");
        const startLabel = document.getElementById("patternStartLabel");
        const parameterLabel = document.getElementById("patternParameterLabel");
        const start = document.getElementById("patternStart");
        const parameter = document.getElementById("patternParameter");

        if (!type || !startLabel || !parameterLabel || !start || !parameter) {
            return;
        }

        parameter.disabled = false;

        if (type.value === "arithmetic") {
            startLabel.textContent = "First term";
            parameterLabel.textContent = "Common difference";
        } else if (type.value === "geometric") {
            startLabel.textContent = "First term";
            parameterLabel.textContent = "Common ratio";
        } else if (type.value === "fibonacci") {
            startLabel.textContent = "First value";
            parameterLabel.textContent = "Second value";
        } else {
            startLabel.textContent = "Starting index";
            parameterLabel.textContent = "Not required";
            parameter.disabled = true;
        }

        resetExplorerResult();
    }

    function buildPattern(type, start, parameter, terms) {
        const values = [];
        let title = "";
        let explanation = "";

        if (type === "arithmetic") {
            for (let index = 0; index < terms; index++) {
                values.push(start + index * parameter);
            }
            title = "Arithmetic Pattern";
            explanation =
                "Each term adds the constant difference " +
                numberText(parameter) + ". The nth term is a + (n − 1)d.";
        } else if (type === "geometric") {
            for (let index = 0; index < terms; index++) {
                values.push(start * Math.pow(parameter, index));
            }
            title = "Geometric Pattern";
            explanation =
                "Each term multiplies by the constant ratio " +
                numberText(parameter) + ". The nth term is ar^(n − 1).";
        } else if (type === "square") {
            for (let index = 0; index < terms; index++) {
                const position = start + index;
                values.push(position * position);
            }
            title = "Square-Number Pattern";
            explanation =
                "Each displayed value is n², beginning with index " +
                numberText(start) + ". Consecutive differences are odd numbers.";
        } else if (type === "cube") {
            for (let index = 0; index < terms; index++) {
                const position = start + index;
                values.push(position * position * position);
            }
            title = "Cube-Number Pattern";
            explanation =
                "Each displayed value is n³, beginning with index " +
                numberText(start) + ".";
        } else if (type === "triangular") {
            for (let index = 0; index < terms; index++) {
                const position = start + index;
                values.push(position * (position + 1) / 2);
            }
            title = "Triangular-Number Pattern";
            explanation =
                "Each value is n(n + 1)/2. It represents the total 1 + 2 + ... + n.";
        } else {
            let first = start;
            let second = parameter;

            for (let index = 0; index < terms; index++) {
                values.push(first);
                const next = first + second;
                first = second;
                second = next;
            }
            title = "Fibonacci-Style Pattern";
            explanation =
                "Every new term is the sum of the previous two terms, beginning with " +
                numberText(start) + " and " + numberText(parameter) + ".";
        }

        return {
            title: title,
            values: values,
            explanation: explanation
        };
    }

    function generatePattern() {
        const type = document.getElementById("patternType");
        const startInput = document.getElementById("patternStart");
        const parameterInput = document.getElementById("patternParameter");
        const termsInput = document.getElementById("patternTerms");
        const message = document.getElementById("patternExplorerMessage");
        const result = document.getElementById("patternExplorerResult");
        const title = document.getElementById("patternResultTitle");
        const chips = document.getElementById("patternResultChips");
        const explanation = document.getElementById("patternResultExplanation");

        if (!type || !startInput || !parameterInput || !termsInput ||
            !message || !result || !title || !chips || !explanation) {
            return;
        }

        const start = Number(startInput.value);
        const parameter = Number(parameterInput.value);
        const terms = Number(termsInput.value);

        if (!Number.isFinite(start) || !Number.isFinite(parameter) ||
            !Number.isInteger(terms) || terms < 3 || terms > 12) {
            result.hidden = true;
            message.hidden = false;
            message.textContent =
                "Enter valid numbers and choose between 3 and 12 terms.";
            return;
        }

        const pattern = buildPattern(type.value, start, parameter, terms);

        title.textContent = pattern.title;
        chips.innerHTML = "";

        pattern.values.forEach(function (value) {
            const chip = document.createElement("span");
            chip.className = "pattern-chip";
            chip.textContent = numberText(value);
            chips.appendChild(chip);
        });

        explanation.textContent = pattern.explanation;
        message.hidden = true;
        result.hidden = false;
    }

    function prepareExample(button) {
        const type = document.getElementById("patternType");
        const start = document.getElementById("patternStart");
        const parameter = document.getElementById("patternParameter");
        const terms = document.getElementById("patternTerms");

        if (!type || !start || !parameter || !terms) {
            return;
        }

        type.value = button.dataset.pattern;
        start.value = button.dataset.start;
        parameter.value = button.dataset.parameter;
        terms.value = button.dataset.terms;
        updateControlLabels();
    }

    function initialiseSolutionButtons() {
        document.querySelectorAll(".pattern-solution-toggle")
            .forEach(function (button) {
                button.addEventListener("click", function () {
                    const answer = document.getElementById(button.dataset.target);

                    if (!answer) {
                        return;
                    }

                    const willOpen = answer.hidden;
                    answer.hidden = !willOpen;
                    button.setAttribute("aria-expanded", String(willOpen));
                    button.textContent = willOpen ? "Hide Solution" : "Show Solution";
                });
            });
    }

    document.addEventListener("DOMContentLoaded", function () {
        const type = document.getElementById("patternType");
        const generate = document.getElementById("generatePatternButton");

        if (type) {
            type.addEventListener("change", updateControlLabels);
        }

        if (generate) {
            generate.addEventListener("click", generatePattern);
        }

        document.querySelectorAll(".pattern-example-button")
            .forEach(function (button) {
                button.addEventListener("click", function () {
                    prepareExample(button);
                });
            });

        initialiseSolutionButtons();
        updateControlLabels();

        const initialMessage = document.getElementById("patternExplorerMessage");
        if (initialMessage) {
            initialMessage.textContent =
                "Select a pattern or example, then click Generate Pattern.";
        }
    });
}());
