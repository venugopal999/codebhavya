(function () {
    "use strict";

    function numberText(value) {
        if (Number.isInteger(value)) {
            return String(value);
        }
        return String(Math.round((value + Number.EPSILON) * 1000000) / 1000000);
    }

    function readMatrix(prefix) {
        const ids = ["11", "12", "21", "22"];
        const values = ids.map(function (position) {
            const input = document.getElementById(prefix + position);
            return input ? Number(input.value) : NaN;
        });
        return [[values[0], values[1]], [values[2], values[3]]];
    }

    function validMatrix(matrix) {
        return matrix.every(function (row) {
            return row.every(Number.isFinite);
        });
    }

    function hideResult(messageText) {
        const result = document.getElementById("matrixExplorerResult");
        const message = document.getElementById("matrixExplorerMessage");
        if (result) {
            result.hidden = true;
        }
        if (message) {
            message.hidden = false;
            message.textContent = messageText || "Values are ready. Click Calculate Matrix to display the result.";
        }
    }

    function setMatrixBState() {
        const operation = document.getElementById("matrixOperation");
        const card = document.getElementById("matrixBInputCard");
        if (!operation || !card) {
            return;
        }
        const needsOnlyA = operation.value === "transposeA" || operation.value === "determinantA";
        card.style.opacity = needsOnlyA ? "0.55" : "1";
        card.querySelectorAll("input").forEach(function (input) {
            input.disabled = needsOnlyA;
        });
        hideResult();
    }

    function add(A, B, sign) {
        return A.map(function (row, i) {
            return row.map(function (value, j) {
                return value + sign * B[i][j];
            });
        });
    }

    function multiply(A, B) {
        return [
            [A[0][0] * B[0][0] + A[0][1] * B[1][0], A[0][0] * B[0][1] + A[0][1] * B[1][1]],
            [A[1][0] * B[0][0] + A[1][1] * B[1][0], A[1][0] * B[0][1] + A[1][1] * B[1][1]]
        ];
    }

    function renderMatrix(matrix) {
        const container = document.createElement("div");
        container.className = "matrix-result-display";
        container.style.gridTemplateColumns = "repeat(" + matrix[0].length + ", minmax(46px, auto))";
        matrix.forEach(function (row) {
            row.forEach(function (value) {
                const cell = document.createElement("span");
                cell.textContent = numberText(value);
                container.appendChild(cell);
            });
        });
        return container;
    }

    function calculateMatrix() {
        const operation = document.getElementById("matrixOperation");
        const result = document.getElementById("matrixExplorerResult");
        const message = document.getElementById("matrixExplorerMessage");
        const title = document.getElementById("matrixResultTitle");
        const valueBox = document.getElementById("matrixResultValue");
        const explanation = document.getElementById("matrixResultExplanation");
        if (!operation || !result || !message || !title || !valueBox || !explanation) {
            return;
        }

        const A = readMatrix("matrixA");
        const B = readMatrix("matrixB");
        if (!validMatrix(A) || ((operation.value === "add" || operation.value === "subtract" || operation.value === "multiply") && !validMatrix(B))) {
            hideResult("Enter valid numbers in every required matrix cell.");
            return;
        }

        valueBox.innerHTML = "";
        let matrix;
        if (operation.value === "add") {
            matrix = add(A, B, 1);
            title.textContent = "A + B";
            explanation.textContent = "Corresponding elements were added.";
        } else if (operation.value === "subtract") {
            matrix = add(A, B, -1);
            title.textContent = "A − B";
            explanation.textContent = "Each element of B was subtracted from the corresponding element of A.";
        } else if (operation.value === "multiply") {
            matrix = multiply(A, B);
            title.textContent = "A × B";
            explanation.textContent = "Each result element is the dot product of a row from A and a column from B.";
        } else if (operation.value === "transposeA") {
            matrix = [[A[0][0], A[1][0]], [A[0][1], A[1][1]]];
            title.textContent = "Transpose of A";
            explanation.textContent = "Rows of A became columns of Aᵀ.";
        } else {
            const determinant = A[0][0] * A[1][1] - A[0][1] * A[1][0];
            title.textContent = "Determinant of A";
            const strong = document.createElement("strong");
            strong.textContent = "det(A) = " + numberText(determinant);
            valueBox.appendChild(strong);
            explanation.textContent = numberText(A[0][0]) + " × " + numberText(A[1][1]) + " − " + numberText(A[0][1]) + " × " + numberText(A[1][0]) + " = " + numberText(determinant) + (determinant === 0 ? ". A is singular." : ". A is non-singular and has an inverse.");
        }

        if (matrix) {
            valueBox.appendChild(renderMatrix(matrix));
        }
        message.hidden = true;
        result.hidden = false;
    }

    function fillExample(button) {
        const operation = document.getElementById("matrixOperation");
        const positions = ["11", "12", "21", "22"];
        const aValues = button.dataset.a.split(",");
        const bValues = button.dataset.b.split(",");
        if (!operation) {
            return;
        }
        operation.value = button.dataset.operation;
        positions.forEach(function (position, index) {
            document.getElementById("matrixA" + position).value = aValues[index];
            document.getElementById("matrixB" + position).value = bValues[index];
        });
        setMatrixBState();
    }

    function initialiseSolutionButtons() {
        document.querySelectorAll(".matrix-solution-toggle").forEach(function (button) {
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
        const operation = document.getElementById("matrixOperation");
        const calculate = document.getElementById("calculateMatrixButton");
        if (operation) {
            operation.addEventListener("change", setMatrixBState);
        }
        if (calculate) {
            calculate.addEventListener("click", calculateMatrix);
        }
        document.querySelectorAll(".matrix-example-button").forEach(function (button) {
            button.addEventListener("click", function () { fillExample(button); });
        });
        document.querySelectorAll(".matrix-input-grid input").forEach(function (input) {
            input.addEventListener("input", function () { hideResult(); });
        });
        initialiseSolutionButtons();
        setMatrixBState();
        const initialMessage = document.getElementById("matrixExplorerMessage");
        if (initialMessage) {
            initialMessage.textContent = "Select an operation or example, then click Calculate Matrix.";
        }
    });
}());
