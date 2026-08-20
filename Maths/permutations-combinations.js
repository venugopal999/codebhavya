(function () {
    "use strict";

    function factorial(n) {
        let result = 1n;
        for (let value = 2n; value <= BigInt(n); value++) {
            result *= value;
        }
        return result;
    }

    function permutation(n, r) {
        let result = 1n;
        for (let value = 0; value < r; value++) {
            result *= BigInt(n - value);
        }
        return result;
    }

    function combination(n, r) {
        const smaller = Math.min(r, n - r);
        let result = 1n;
        for (let value = 1; value <= smaller; value++) {
            result = result * BigInt(n - smaller + value) / BigInt(value);
        }
        return result;
    }

    function power(base, exponent) {
        let result = 1n;
        for (let value = 0; value < exponent; value++) {
            result *= BigInt(base);
        }
        return result;
    }

    function formatCount(value) {
        return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    function hideResult(text) {
        const result = document.getElementById("countExplorerResult");
        const message = document.getElementById("countExplorerMessage");
        if (result) { result.hidden = true; }
        if (message) { message.hidden = false; message.textContent = text || "Values are ready. Click Calculate Count to display the result."; }
    }

    function updateControls() {
        const mode = document.getElementById("countingMode");
        const r = document.getElementById("countingR");
        const rLabel = document.getElementById("countingRLabel");
        if (!mode || !r || !rLabel) { return; }
        const needsR = mode.value === "permutation" || mode.value === "combination" || mode.value === "repetition";
        r.disabled = !needsR;
        rLabel.textContent = mode.value === "repetition" ? "Number of positions r" : "Selected objects r";
        hideResult();
    }

    function calculateCount() {
        const mode = document.getElementById("countingMode");
        const nInput = document.getElementById("countingN");
        const rInput = document.getElementById("countingR");
        const result = document.getElementById("countExplorerResult");
        const message = document.getElementById("countExplorerMessage");
        const title = document.getElementById("countResultTitle");
        const number = document.getElementById("countResultNumber");
        const formula = document.getElementById("countResultFormula");
        const explanation = document.getElementById("countResultExplanation");
        if (!mode || !nInput || !rInput || !result || !message || !title || !number || !formula || !explanation) { return; }

        const n = Number(nInput.value);
        const r = Number(rInput.value);
        if (!Number.isInteger(n) || n < 0 || n > 100) { hideResult("Enter n as a whole number from 0 to 100."); return; }
        const needsR = mode.value === "permutation" || mode.value === "combination" || mode.value === "repetition";
        if (needsR && (!Number.isInteger(r) || r < 0 || r > 100)) { hideResult("Enter r as a whole number from 0 to 100."); return; }
        if ((mode.value === "permutation" || mode.value === "combination") && r > n) { hideResult("For nPr or nCr, r cannot be greater than n."); return; }
        if (mode.value === "circular" && n < 1) { hideResult("A circular arrangement requires at least one object."); return; }

        let count;
        if (mode.value === "factorial") {
            count = factorial(n); title.textContent = "Factorial Arrangement"; formula.textContent = n + "! = " + formatCount(count); explanation.textContent = "All " + n + " distinct objects are arranged.";
        } else if (mode.value === "permutation") {
            count = permutation(n, r); title.textContent = "Permutation Result"; formula.textContent = n + "P" + r + " = " + n + "! / (" + n + " − " + r + ")!"; explanation.textContent = "Order matters, so different positions create different outcomes.";
        } else if (mode.value === "combination") {
            count = combination(n, r); title.textContent = "Combination Result"; formula.textContent = n + "C" + r + " = " + n + "! / [" + r + "!(" + n + " − " + r + ")!]"; explanation.textContent = "Only the selected group matters; rearranging the same selection does not create a new outcome.";
        } else if (mode.value === "repetition") {
            count = power(n, r); title.textContent = "Repetition-Allowed Result"; formula.textContent = n + "^" + r + " = " + formatCount(count); explanation.textContent = "Each of the " + r + " positions independently has " + n + " choices.";
        } else {
            count = factorial(n - 1); title.textContent = "Circular Arrangement Result"; formula.textContent = "(" + n + " − 1)! = " + formatCount(count); explanation.textContent = "Rotations are identical, so one position is fixed and the remaining objects are arranged.";
        }
        number.textContent = formatCount(count);
        message.hidden = true;
        result.hidden = false;
    }

    function fillExample(button) {
        const mode = document.getElementById("countingMode");
        const n = document.getElementById("countingN");
        const r = document.getElementById("countingR");
        if (!mode || !n || !r) { return; }
        mode.value = button.dataset.mode; n.value = button.dataset.n; r.value = button.dataset.r; updateControls();
    }

    function initialiseSolutions() {
        document.querySelectorAll(".solution-toggle").forEach(function (button) {
            button.addEventListener("click", function () {
                const answer = document.getElementById(button.dataset.target);
                if (!answer) { return; }
                const willOpen = answer.hidden;
                answer.hidden = !willOpen;
                button.setAttribute("aria-expanded", String(willOpen));
                button.textContent = willOpen ? "Hide Solution" : "Show Solution";
            });
        });
    }

    document.addEventListener("DOMContentLoaded", function () {
        const mode = document.getElementById("countingMode");
        const calculate = document.getElementById("calculateCountButton");
        if (mode) { mode.addEventListener("change", updateControls); }
        if (calculate) { calculate.addEventListener("click", calculateCount); }
        document.querySelectorAll(".explorer-example-button").forEach(function (button) { button.addEventListener("click", function () { fillExample(button); }); });
        ["countingN", "countingR"].forEach(function (id) { const input = document.getElementById(id); if (input) { input.addEventListener("input", function () { hideResult(); }); } });
        initialiseSolutions(); updateControls();
        const initial = document.getElementById("countExplorerMessage");
        if (initial) { initial.textContent = "Select a model or example, then click Calculate Count."; }
    });
}());
