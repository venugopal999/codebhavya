/* =========================================
   CODEBHAVYA - MATHEMATICS COURSE JAVASCRIPT
   ========================================= */

(function () {

    "use strict";

    const progressKey =
        "codebhavya-mathematics-visited-topics";


    function readVisitedTopics() {

        try {

            const saved =
                window.localStorage.getItem(progressKey);

            const topics =
                saved ? JSON.parse(saved) : [];

            return Array.isArray(topics)
                ? topics
                : [];

        } catch (error) {

            return [];

        }

    }


    function saveVisitedTopics(topics) {

        try {

            window.localStorage.setItem(
                progressKey,
                JSON.stringify(topics)
            );

        } catch (error) {

            /* Progress storage is optional. */

        }

    }


    function rememberCurrentTopic(visitedTopics) {

        const currentTopic =
            document.body.dataset.mathTopic;

        if (
            !currentTopic ||
            visitedTopics.includes(currentTopic)
        ) {
            return visitedTopics;
        }

        const updatedTopics =
            visitedTopics.concat(currentTopic);

        saveVisitedTopics(updatedTopics);

        return updatedTopics;

    }


    function markVisitedCards(visitedTopics) {

        const topicCards =
            document.querySelectorAll(
                ".topic-card[data-topic-id]"
            );

        topicCards.forEach(function (card) {

            const topicId =
                card.dataset.topicId;

            if (visitedTopics.includes(topicId)) {

                card.classList.add(
                    "visited-topic"
                );

            }

        });

    }


    function updateCourseProgress(visitedTopics) {

        const progress =
            document.querySelector(
                "[data-math-progress]"
            );

        if (!progress) {
            return;
        }

        const availableTopics =
            document.querySelectorAll(
                ".topic-card[data-topic-available='true']"
            );

        const availableIds =
            Array.from(availableTopics)
                .map(function (card) {
                    return card.dataset.topicId;
                });

        const visitedAvailable =
            availableIds.filter(function (topicId) {
                return visitedTopics.includes(topicId);
            }).length;

        const totalAvailable =
            availableIds.length;

        const percentage =
            totalAvailable === 0
                ? 0
                : (visitedAvailable / totalAvailable) * 100;

        const progressText =
            progress.querySelector(
                "[data-math-progress-text]"
            );

        const progressFill =
            progress.querySelector(
                "[data-math-progress-fill]"
            );

        if (progressText) {

            progressText.textContent =
                visitedAvailable +
                " of " +
                totalAvailable +
                " available topics visited";

        }

        if (progressFill) {

            progressFill.style.width =
                percentage + "%";

        }

    }


    function prepareComingSoonLinks() {

        const links =
            document.querySelectorAll(
                "a.coming-soon-link"
            );

        links.forEach(function (link) {

            link.setAttribute(
                "aria-disabled",
                "true"
            );

            link.setAttribute(
                "tabindex",
                "-1"
            );

            link.addEventListener(
                "click",
                function (event) {
                    event.preventDefault();
                }
            );

        });

    }



    function prepareSolutionButtons() {

        const buttons =
            document.querySelectorAll(
                "[data-math-solution]"
            );

        buttons.forEach(function (button) {

            const targetId =
                button.dataset.mathSolution;

            const solution =
                document.getElementById(targetId);

            if (!solution) {
                return;
            }

            button.setAttribute(
                "aria-controls",
                targetId
            );

            button.setAttribute(
                "aria-expanded",
                "false"
            );

            button.addEventListener(
                "click",
                function () {

                    const willShow =
                        solution.hasAttribute(
                            "hidden"
                        );

                    if (willShow) {

                        solution.removeAttribute(
                            "hidden"
                        );

                        button.textContent =
                            "Hide Solution";

                    } else {

                        solution.setAttribute(
                            "hidden",
                            ""
                        );

                        button.textContent =
                            "Show Solution";

                    }

                    button.setAttribute(
                        "aria-expanded",
                        String(willShow)
                    );

                }
            );

        });

    }


    function valuesAreEqual(first, second) {

        return Math.abs(first - second) <
            0.0000001;

    }


    function allValuesEqual(values) {

        return values.every(
            function (value) {
                return valuesAreEqual(
                    value,
                    values[0]
                );
            }
        );

    }


    function findPattern(numbers) {

        const differences =
            numbers.slice(1).map(
                function (value, index) {
                    return value -
                        numbers[index];
                }
            );

        if (allValuesEqual(differences)) {

            const difference =
                differences[0];

            const next =
                numbers[numbers.length - 1] +
                difference;

            return {
                name:
                    "Constant-difference pattern",
                explanation:
                    "Add " +
                    difference +
                    " each time. A possible next term is " +
                    next +
                    "."
            };

        }


        const roots =
            numbers.map(
                function (value) {
                    return Math.sqrt(value);
                }
            );

        const squarePattern =
            roots.every(
                function (root) {
                    return Number.isInteger(root);
                }
            ) &&
            roots.slice(1).every(
                function (root, index) {
                    return root ===
                        roots[index] + 1;
                }
            );

        if (squarePattern) {

            const nextRoot =
                roots[roots.length - 1] + 1;

            return {
                name: "Consecutive square numbers",
                explanation:
                    "The square roots are consecutive integers. A possible next term is " +
                    (nextRoot * nextRoot) +
                    "."
            };

        }


        const recursivePattern =
            numbers.length >= 4 &&
            numbers.slice(2).every(
                function (value, index) {
                    return valuesAreEqual(
                        value,
                        numbers[index] +
                        numbers[index + 1]
                    );
                }
            );

        if (recursivePattern) {

            const next =
                numbers[numbers.length - 1] +
                numbers[numbers.length - 2];

            return {
                name:
                    "Previous-two-terms pattern",
                explanation:
                    "Each term is the sum of the previous two terms. A possible next term is " +
                    next +
                    "."
            };

        }


        const canUseRatio =
            numbers.slice(0, -1).every(
                function (value) {
                    return value !== 0;
                }
            );

        if (canUseRatio) {

            const ratios =
                numbers.slice(1).map(
                    function (value, index) {
                        return value /
                            numbers[index];
                    }
                );

            if (allValuesEqual(ratios)) {

                const ratio =
                    ratios[0];

                const next =
                    numbers[numbers.length - 1] *
                    ratio;

                return {
                    name:
                        "Constant-ratio pattern",
                    explanation:
                        "Multiply by " +
                        ratio +
                        " each time. A possible next term is " +
                        next +
                        "."
                };

            }

        }


        if (differences.length >= 3) {

            const secondDifferences =
                differences.slice(1).map(
                    function (value, index) {
                        return value -
                            differences[index];
                    }
                );

            if (
                allValuesEqual(
                    secondDifferences
                )
            ) {

                const nextDifference =
                    differences[differences.length - 1] +
                    secondDifferences[0];

                const next =
                    numbers[numbers.length - 1] +
                    nextDifference;

                return {
                    name:
                        "Constant second-difference pattern",
                    explanation:
                        "The first differences change by " +
                        secondDifferences[0] +
                        ". The next difference is " +
                        nextDifference +
                        ", so a possible next term is " +
                        next +
                        "."
                };

            }

        }


        return {
            name:
                "No single common pattern detected",
            explanation:
                "Try checking alternating terms, repeating cycles or a rule that uses both position and value."
        };

    }


    function preparePatternExplorer() {

        const input =
            document.getElementById(
                "patternSequence"
            );

        const detectButton =
            document.getElementById(
                "detectPatternButton"
            );

        const result =
            document.getElementById(
                "patternResult"
            );

        if (
            !input ||
            !detectButton ||
            !result
        ) {
            return;
        }


        function detect() {

            const values =
                input.value
                    .split(",")
                    .map(function (value) {
                        return value.trim();
                    })
                    .filter(Boolean)
                    .map(Number);

            const valid =
                values.length >= 4 &&
                values.length <= 20 &&
                values.every(Number.isFinite);

            if (!valid) {

                result.classList.add(
                    "is-error"
                );

                result.textContent =
                    "Enter 4 to 20 valid numbers separated by commas.";

                return;

            }

            const pattern =
                findPattern(values);

            result.classList.remove(
                "is-error"
            );

            result.textContent =
                pattern.name +
                ": " +
                pattern.explanation;

        }


        detectButton.addEventListener(
            "click",
            detect
        );


        input.addEventListener(
            "keydown",
            function (event) {

                if (event.key === "Enter") {
                    detect();
                }

            }
        );


        const examples =
            document.querySelectorAll(
                "[data-pattern-example]"
            );

        examples.forEach(
            function (button) {

                button.addEventListener(
                    "click",
                    function () {

                        input.value =
                            button.dataset.patternExample;

                        detect();

                    }
                );

            }
        );

    }


    function prepareTruthTableBuilder() {

        const expressionSelect =
            document.getElementById(
                "logicExpression"
            );

        const buildButton =
            document.getElementById(
                "buildTruthTableButton"
            );

        const tableBody =
            document.getElementById(
                "logicTruthTableBody"
            );

        const resultHeading =
            document.getElementById(
                "logicResultHeading"
            );

        const meaning =
            document.getElementById(
                "logicExpressionMeaning"
            );

        if (
            !expressionSelect ||
            !buildButton ||
            !tableBody ||
            !resultHeading ||
            !meaning
        ) {
            return;
        }


        const expressions = {

            notP: {
                symbol: "¬P",
                meaning: "NOT reverses the truth value of P.",
                evaluate: function (p) {
                    return !p;
                }
            },

            and: {
                symbol: "P ∧ Q",
                meaning: "AND is true only when both P and Q are true.",
                evaluate: function (p, q) {
                    return p && q;
                }
            },

            or: {
                symbol: "P ∨ Q",
                meaning: "OR is true when at least one input is true.",
                evaluate: function (p, q) {
                    return p || q;
                }
            },

            xor: {
                symbol: "P ⊕ Q",
                meaning: "XOR is true when exactly one input is true.",
                evaluate: function (p, q) {
                    return p !== q;
                }
            },

            implies: {
                symbol: "P → Q",
                meaning: "Implication is false only when P is true and Q is false.",
                evaluate: function (p, q) {
                    return !p || q;
                }
            },

            biconditional: {
                symbol: "P ↔ Q",
                meaning: "The biconditional is true when P and Q have matching truth values.",
                evaluate: function (p, q) {
                    return p === q;
                }
            },

            nand: {
                symbol: "¬(P ∧ Q)",
                meaning: "NAND is the negation of AND.",
                evaluate: function (p, q) {
                    return !(p && q);
                }
            },

            deMorganAnd: {
                symbol: "¬P ∨ ¬Q",
                meaning: "De Morgan’s law makes this equivalent to ¬(P ∧ Q).",
                evaluate: function (p, q) {
                    return !p || !q;
                }
            }

        };


        const combinations = [
            [true, true],
            [true, false],
            [false, true],
            [false, false]
        ];


        function createTruthValue(value) {

            const badge =
                document.createElement("span");

            badge.className =
                "logic-value " +
                (value ? "is-true" : "is-false");

            badge.textContent =
                value ? "T" : "F";

            return badge;

        }


        function buildTable() {

            const selected =
                expressions[expressionSelect.value] ||
                expressions.and;

            resultHeading.textContent =
                selected.symbol;

            meaning.textContent =
                selected.symbol +
                ": " +
                selected.meaning;

            tableBody.innerHTML = "";

            combinations.forEach(
                function (combination) {

                    const p = combination[0];
                    const q = combination[1];

                    const row =
                        document.createElement("tr");

                    [p, q, selected.evaluate(p, q)]
                        .forEach(function (value) {

                            const cell =
                                document.createElement("td");

                            cell.appendChild(
                                createTruthValue(value)
                            );

                            row.appendChild(cell);

                        });

                    tableBody.appendChild(row);

                }
            );

        }


        buildButton.addEventListener(
            "click",
            buildTable
        );

        expressionSelect.addEventListener(
            "change",
            buildTable
        );

        buildTable();

    }

    function initializeMathematics() {

        let visitedTopics =
            readVisitedTopics();

        visitedTopics =
            rememberCurrentTopic(
                visitedTopics
            );

        markVisitedCards(
            visitedTopics
        );

        updateCourseProgress(
            visitedTopics
        );

        prepareComingSoonLinks();

        prepareSolutionButtons();

        preparePatternExplorer();

        prepareTruthTableBuilder();

    }


    if (
        document.readyState ===
        "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            initializeMathematics
        );

    } else {

        initializeMathematics();

    }

})();
