(function () {
    "use strict";

    function numberText(value) {
        if (Number.isInteger(value)) {
            return String(value);
        }

        return String(Math.round((value + Number.EPSILON) * 1000000) / 1000000);
    }

    function hideExplorerResult(messageText) {
        const result = document.getElementById("explorerResult");
        const message = document.getElementById("explorerMessage");

        if (result) {
            result.hidden = true;
        }

        if (message) {
            message.hidden = false;
            message.textContent = messageText || "Values are ready. Click Analyze to display the result.";
        }
    }

    function updateExplorerLabels() {
        const type = document.getElementById("explorerType");
        const labelA = document.getElementById("explorerLabelA");
        const labelB = document.getElementById("explorerLabelB");
        const labelC = document.getElementById("explorerLabelC");

        if (!type || !labelA || !labelB || !labelC) {
            return;
        }

        if (type.value === "linear") {
            labelA.textContent = "Coefficient a";
            labelB.textContent = "Constant b";
            labelC.textContent = "Right side c";
        } else if (type.value === "ap") {
            labelA.textContent = "First term a";
            labelB.textContent = "Common difference d";
            labelC.textContent = "Term number n";
        } else {
            labelA.textContent = "First term a";
            labelB.textContent = "Common ratio r";
            labelC.textContent = "Term number n";
        }

        hideExplorerResult();
    }

    function renderSequence(values) {
        const chips = document.getElementById("explorerSequenceChips");

        if (!chips) {
            return;
        }

        chips.innerHTML = "";
        values.forEach(function (value) {
            const chip = document.createElement("span");
            chip.className = "sequence-chip";
            chip.textContent = numberText(value);
            chips.appendChild(chip);
        });
    }

    function analyzeExplorer() {
        const type = document.getElementById("explorerType");
        const inputA = document.getElementById("explorerValueA");
        const inputB = document.getElementById("explorerValueB");
        const inputC = document.getElementById("explorerValueC");
        const result = document.getElementById("explorerResult");
        const message = document.getElementById("explorerMessage");
        const title = document.getElementById("explorerResultTitle");
        const formula = document.getElementById("explorerResultFormula");
        const explanation = document.getElementById("explorerResultExplanation");

        if (!type || !inputA || !inputB || !inputC || !result || !message ||
            !title || !formula || !explanation) {
            return;
        }

        const a = Number(inputA.value);
        const b = Number(inputB.value);
        const c = Number(inputC.value);

        if (!Number.isFinite(a) || !Number.isFinite(b) || !Number.isFinite(c)) {
            hideExplorerResult("Enter valid numbers in all three fields.");
            return;
        }

        if (type.value === "linear") {
            if (a === 0) {
                hideExplorerResult("Coefficient a must not be zero for a linear equation.");
                return;
            }

            const x = (c - b) / a;
            title.textContent = "Linear Equation Solution";
            renderSequence([]);
            formula.textContent = "x = (c − b) / a = (" + numberText(c) + " − " +
                numberText(b) + ") / " + numberText(a) + " = " + numberText(x);
            explanation.textContent = "Verification: " + numberText(a) + "(" +
                numberText(x) + ") + " + numberText(b) + " = " + numberText(c) + ".";
        } else {
            if (!Number.isInteger(c) || c < 1 || c > 12) {
                hideExplorerResult("Term number n must be a whole number from 1 to 12.");
                return;
            }

            const terms = [];
            let nthTerm;
            let sum;

            if (type.value === "ap") {
                for (let index = 0; index < c; index++) {
                    terms.push(a + index * b);
                }
                nthTerm = a + (c - 1) * b;
                sum = c * (2 * a + (c - 1) * b) / 2;
                title.textContent = "Arithmetic Progression Result";
                formula.textContent = "aₙ = a + (n − 1)d = " + numberText(nthTerm) +
                    "; Sₙ = n/2[2a + (n − 1)d] = " + numberText(sum) + ".";
                explanation.textContent = "Every term changes by the constant difference " +
                    numberText(b) + ".";
            } else {
                for (let index = 0; index < c; index++) {
                    terms.push(a * Math.pow(b, index));
                }
                nthTerm = a * Math.pow(b, c - 1);
                sum = b === 1 ? a * c : a * (Math.pow(b, c) - 1) / (b - 1);
                title.textContent = "Geometric Progression Result";
                formula.textContent = "aₙ = ar^(n − 1) = " + numberText(nthTerm) +
                    "; finite sum Sₙ = " + numberText(sum) + ".";
                explanation.textContent = "Every term is multiplied by the constant ratio " +
                    numberText(b) + ".";
            }

            renderSequence(terms);
        }

        message.hidden = true;
        result.hidden = false;
    }

    function prepareExample(button) {
        const type = document.getElementById("explorerType");
        const inputA = document.getElementById("explorerValueA");
        const inputB = document.getElementById("explorerValueB");
        const inputC = document.getElementById("explorerValueC");

        if (!type || !inputA || !inputB || !inputC) {
            return;
        }

        type.value = button.dataset.type;
        inputA.value = button.dataset.a;
        inputB.value = button.dataset.b;
        inputC.value = button.dataset.c;
        updateExplorerLabels();
    }

    function initialiseSolutionButtons() {
        document.querySelectorAll(".solution-toggle").forEach(function (button) {
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
        const type = document.getElementById("explorerType");
        const analyze = document.getElementById("analyzeExplorerButton");

        if (type) {
            type.addEventListener("change", updateExplorerLabels);
        }

        if (analyze) {
            analyze.addEventListener("click", analyzeExplorer);
        }

        document.querySelectorAll(".explorer-example-button").forEach(function (button) {
            button.addEventListener("click", function () {
                prepareExample(button);
            });
        });

        initialiseSolutionButtons();
        updateExplorerLabels();

        const initialMessage = document.getElementById("explorerMessage");
        if (initialMessage) {
            initialMessage.textContent = "Select a model or example, then click Analyze.";
        }
    });
}());
