(function () {
    "use strict";

    const input = document.getElementById("growthInput");
    const pattern = document.getElementById("growthPattern");
    const analyzeButton = document.getElementById("analyzeGrowthButton");
    const prompt = document.getElementById("growthExplorerPrompt");
    const result = document.getElementById("growthExplorerResult");

    const complexityOutput =
        document.getElementById("selectedComplexity");

    const operationsOutput =
        document.getElementById("selectedOperations");

    const doublingOutput =
        document.getElementById("doublingEffect");

    const explanationOutput =
        document.getElementById("growthExplanation");

    const barsOutput =
        document.getElementById("growthBars");

    const growthTypes = {
        constant: {
            label: "O(1)",
            name: "Constant",

            calculate: function () {
                return 1;
            },

            explanation:
                "The amount of work remains constant even when the input grows."
        },

        logarithmic: {
            label: "O(log n)",
            name: "Logarithmic",

            calculate: function (n) {
                return Math.max(1, Math.ceil(Math.log2(n)));
            },

            explanation:
                "Each step removes a constant fraction of the remaining problem, such as repeated halving."
        },

        linear: {
            label: "O(n)",
            name: "Linear",

            calculate: function (n) {
                return n;
            },

            explanation:
                "The algorithm performs approximately one unit of work for every input element."
        },

        linearithmic: {
            label: "O(n log n)",
            name: "Linearithmic",

            calculate: function (n) {
                return n * Math.max(1, Math.log2(n));
            },

            explanation:
                "There are logarithmic levels, with approximately n total work across each level."
        },

        quadratic: {
            label: "O(n²)",
            name: "Quadratic",

            calculate: function (n) {
                return n * n;
            },

            explanation:
                "Two full nested dimensions create approximately n × n operations."
        },

        cubic: {
            label: "O(n³)",
            name: "Cubic",

            calculate: function (n) {
                return n * n * n;
            },

            explanation:
                "Three full nested dimensions create approximately n × n × n operations."
        },

        exponential: {
            label: "O(2ⁿ)",
            name: "Exponential",

            calculate: function (n) {
                return Math.pow(2, n);
            },

            explanation:
                "Each level creates two recursive choices, causing the work to double with every added input unit."
        }
    };

    function formatNumber(value) {
        if (!Number.isFinite(value)) {
            return "Extremely large";
        }

        if (value < 1000000) {
            return Math.round(value).toLocaleString("en-IN");
        }

        return value
            .toExponential(3)
            .replace("e+", " × 10^");
    }

    function resetExplorer() {
        if (result) {
            result.hidden = true;
        }

        if (prompt) {
            prompt.hidden = false;
        }
    }

    function createGrowthBars(n, selectedKey) {
        if (!barsOutput) {
            return;
        }

        const entries = Object.keys(growthTypes).map(function (key) {
            const type = growthTypes[key];
            const value = type.calculate(n);

            const logValue = Number.isFinite(value)
                ? Math.log10(Math.max(1, value))
                : 309;

            return {
                key: key,
                type: type,
                value: value,
                logValue: logValue
            };
        });

        const maxLog = Math.max.apply(
            null,
            entries.map(function (entry) {
                return entry.logValue;
            })
        );

        barsOutput.innerHTML = "";

        entries.forEach(function (entry) {
            const row = document.createElement("div");
            row.className = "ads-growth-row";

            if (entry.key === selectedKey) {
                row.classList.add("selected-growth-row");
            }

            const label = document.createElement("span");
            label.className = "ads-growth-label";
            label.textContent = entry.type.label;

            const track = document.createElement("div");
            track.className = "ads-growth-track";

            const fill = document.createElement("div");
            fill.className = "ads-growth-fill";

            const width =
                maxLog === 0
                    ? 8
                    : 8 + (entry.logValue / maxLog) * 92;

            fill.style.width =
                Math.min(100, Math.max(8, width)) + "%";

            track.appendChild(fill);

            const count = document.createElement("strong");
            count.textContent = formatNumber(entry.value);

            row.appendChild(label);
            row.appendChild(track);
            row.appendChild(count);

            barsOutput.appendChild(row);
        });
    }

    function analyzeGrowth() {
        if (!input || !pattern) {
            return;
        }

        let n = Number(input.value);

        if (!Number.isFinite(n) || n < 1) {
            n = 1;
        }

        n = Math.min(1000, Math.floor(n));
        input.value = String(n);

        const selectedKey = pattern.value;
        const selectedType = growthTypes[selectedKey];

        const currentValue =
            selectedType.calculate(n);

        const doubledValue =
            selectedType.calculate(n * 2);

        const ratio =
            currentValue === 0
                ? 1
                : doubledValue / currentValue;

        if (complexityOutput) {
            complexityOutput.textContent =
                selectedType.label +
                " — " +
                selectedType.name;
        }

        if (operationsOutput) {
            operationsOutput.textContent =
                formatNumber(currentValue);
        }

        if (doublingOutput) {
            doublingOutput.textContent =
                Number.isFinite(ratio)
                    ? ratio.toLocaleString("en-IN", {
                          maximumFractionDigits: 2
                      }) + "×"
                    : "Extremely large";
        }

        if (explanationOutput) {
            explanationOutput.textContent =
                selectedType.explanation;
        }

        createGrowthBars(n, selectedKey);

        if (prompt) {
            prompt.hidden = true;
        }

        if (result) {
            result.hidden = false;
        }
    }

    if (analyzeButton) {
        analyzeButton.addEventListener(
            "click",
            analyzeGrowth
        );
    }

    [input, pattern].forEach(function (control) {
        if (!control) {
            return;
        }

        control.addEventListener(
            "input",
            resetExplorer
        );

        control.addEventListener(
            "change",
            resetExplorer
        );
    });

    document
        .querySelectorAll("[data-growth-example]")
        .forEach(function (button) {
            button.addEventListener("click", function () {
                const values =
                    button.dataset.growthExample.split(",");

                if (input) {
                    input.value = values[0];
                }

                if (pattern) {
                    pattern.value = values[1];
                }

                resetExplorer();

                if (input) {
                    input.focus();
                }
            });
        });

    document
        .querySelectorAll("[data-toggle-target]")
        .forEach(function (button) {
            const target = document.getElementById(
                button.dataset.toggleTarget
            );

            if (!target) {
                return;
            }

            target.hidden = true;

            button.dataset.originalLabel =
                button.textContent.trim();

            button.setAttribute(
                "aria-expanded",
                "false"
            );

            button.setAttribute(
                "aria-controls",
                target.id
            );

            button.addEventListener(
                "click",
                function () {
                    const willOpen = target.hidden;

                    target.hidden = !willOpen;

                    button.setAttribute(
                        "aria-expanded",
                        String(willOpen)
                    );

                    if (willOpen) {
                        button.textContent =
                            target.classList.contains(
                                "ads-hint-box"
                            )
                                ? "Hide Hint"
                                : "Hide Answer";
                    } else {
                        button.textContent =
                            button.dataset.originalLabel;
                    }
                }
            );
        });

    resetExplorer();
}());
