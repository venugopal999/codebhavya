(function () {

    "use strict";

    const sourceQuestions =
        Array.isArray(window.CodeBhavyaMathQuestions)
            ? window.CodeBhavyaMathQuestions
            : (
                typeof questions !== "undefined" &&
                Array.isArray(questions)
                    ? questions
                    : []
            );

    if (sourceQuestions.length === 0) {
        return;
    }


    const topicSettings = {
        "mathematical-thinking": {
            name: "Mathematical Thinking",
            reviewHref: "../mathematical-thinking.html"
        },
        "truth-tables": {
            name: "Logic and Truth Tables",
            reviewHref: "../logic-and-truth-tables.html"
        },
        sets: {
            name: "Sets and Venn Diagrams",
            reviewHref: "../sets-and-venn-diagrams.html"
        },
        "number-system": {
            name: "Number System",
            reviewHref: "../number-system.html"
        }
    };


    const currentTopic =
        document.body.dataset.mathTopic ||
        "mathematical-thinking";

    const settings =
        topicSettings[currentTopic] ||
        topicSettings["mathematical-thinking"];

    const calculationToolsEnabled =
        document.body.dataset.calculationTools ===
        "true";

    const quiz =
        document.getElementById("quiz");

    const result =
        document.getElementById("result");

    const progressBar =
        document.getElementById("progressBar");

    if (!quiz || !result) {
        return;
    }


    function shuffle(values) {

        const shuffled = values.slice();

        for (
            let index = shuffled.length - 1;
            index > 0;
            index--
        ) {

            const randomIndex =
                Math.floor(
                    Math.random() * (index + 1)
                );

            const temporary =
                shuffled[index];

            shuffled[index] =
                shuffled[randomIndex];

            shuffled[randomIndex] =
                temporary;

        }

        return shuffled;

    }


    function createBalancedPositions(total) {

        const positions = [];

        for (let index = 0; index < total; index++) {
            positions.push(index % 4);
        }

        return shuffle(positions);

    }


    const balancedPositions =
        createBalancedPositions(
            sourceQuestions.length
        );


    const testQuestions =
        sourceQuestions.map(function (question, index) {

            const correctText =
                String(
                    question.options[question.answer]
                );

            const incorrectOptions =
                shuffle(
                    question.options
                        .filter(function (option, optionIndex) {
                            return optionIndex !== question.answer;
                        })
                        .map(String)
                );

            const correctPosition =
                Math.min(
                    balancedPositions[index],
                    incorrectOptions.length
                );

            const displayOptions =
                incorrectOptions.slice();

            displayOptions.splice(
                correctPosition,
                0,
                correctText
            );

            return {
                question: question.question,
                difficulty: question.difficulty,
                solution: question.solution,
                options: displayOptions,
                correctIndex: correctPosition
            };

        });


    const selectedAnswers =
        new Array(testQuestions.length)
            .fill(null);

    let answeredCount = 0;


    function createElement(tagName, className, textContent) {

        const element =
            document.createElement(tagName);

        if (className) {
            element.className = className;
        }

        if (typeof textContent === "string") {
            element.textContent = textContent;
        }

        return element;

    }


    function difficultyText(level) {

        if (level === "easy") {
            return "🟢 Easy";
        }

        if (level === "medium") {
            return "🟡 Medium";
        }

        return "🔴 Hard";

    }


    function updateProgress(countElement, notice) {

        answeredCount =
            selectedAnswers.filter(
                function (answer) {
                    return answer !== null;
                }
            ).length;

        countElement.textContent =
            answeredCount +
            " of " +
            testQuestions.length +
            " answered";

        if (progressBar) {
            progressBar.style.width =
                (answeredCount / testQuestions.length) *
                100 +
                "%";
        }

        if (answeredCount === testQuestions.length) {
            notice.textContent =
                "All questions are answered. You can now submit the test.";

            notice.classList.add("is-complete");
        } else {
            notice.textContent =
                "Answers and explanations remain locked until all questions are submitted.";

            notice.classList.remove("is-complete");
        }

    }


    function buildQuestionCard(
        question,
        questionIndex,
        countElement,
        notice
    ) {

        const card =
            createElement(
                "article",
                "math-test-question"
            );

        card.dataset.questionIndex =
            String(questionIndex);

        const header =
            createElement(
                "div",
                "math-test-question-header"
            );

        header.appendChild(
            createElement(
                "span",
                "math-test-question-number",
                "Question " +
                    (questionIndex + 1) +
                    " of " +
                    testQuestions.length
            )
        );

        header.appendChild(
            createElement(
                "span",
                "math-test-difficulty " +
                    question.difficulty,
                difficultyText(
                    question.difficulty
                )
            )
        );

        card.appendChild(header);

        card.appendChild(
            createElement(
                "p",
                "math-test-question-text",
                question.question
            )
        );

        const options =
            createElement(
                "div",
                "math-test-options"
            );

        question.options.forEach(
            function (option, optionIndex) {

                const label =
                    createElement(
                        "label",
                        "math-test-option"
                    );

                const input =
                    document.createElement("input");

                input.type = "radio";

                input.name =
                    "math-question-" +
                    questionIndex;

                input.value =
                    String(optionIndex);

                const optionText =
                    createElement(
                        "span",
                        "",
                        String.fromCharCode(
                            65 + optionIndex
                        ) +
                            ". " +
                            option
                    );

                input.addEventListener(
                    "change",
                    function () {

                        selectedAnswers[questionIndex] =
                            optionIndex;

                        options
                            .querySelectorAll(
                                ".math-test-option"
                            )
                            .forEach(function (item) {

                                item.classList.remove(
                                    "is-selected"
                                );

                            });

                        label.classList.add(
                            "is-selected"
                        );

                        card.classList.remove(
                            "is-unanswered"
                        );

                        updateProgress(
                            countElement,
                            notice
                        );

                    }
                );

                label.appendChild(input);
                label.appendChild(optionText);
                options.appendChild(label);

            }
        );

        card.appendChild(options);

        return card;

    }


    function scoreMessage(score) {

        const percentage =
            (score / testQuestions.length) * 100;

        if (percentage >= 90) {
            return "Excellent work. You have a very strong understanding of this topic.";
        }

        if (percentage >= 70) {
            return "Very good. Review the few missed answers and try for full marks.";
        }

        if (percentage >= 50) {
            return "Good start. Use the explanations below to strengthen the difficult areas.";
        }

        return "Keep practicing. Review the lesson and use each explanation as a learning step.";

    }


    function buildCalculationTools() {

        const panel =
            createElement(
                "details",
                "math-calculation-tools"
            );

        panel.open =
            typeof window.matchMedia !== "function" ||
            !window.matchMedia(
                "(max-width: 1050px)"
            ).matches;

        const summary =
            createElement(
                "summary",
                "math-calculation-tools-summary"
            );

        summary.appendChild(
            createElement(
                "span",
                "math-calculation-tools-title",
                "🧮 Calculation Workspace"
            )
        );

        summary.appendChild(
            createElement(
                "span",
                "math-calculation-tools-toggle",
                "Open / Close"
            )
        );

        panel.appendChild(summary);

        const body =
            createElement(
                "div",
                "math-calculation-tools-body"
            );

        body.appendChild(
            createElement(
                "p",
                "math-calculation-tools-note",
                "Use this space for rough calculations. It does not provide hints or answers."
            )
        );

        const workspaceLabel =
            createElement(
                "label",
                "math-workspace-label",
                "✍️ Rough Work"
            );

        workspaceLabel.htmlFor =
            "mathRoughWorkspace";

        body.appendChild(workspaceLabel);

        const workspace =
            createElement(
                "textarea",
                "math-rough-workspace"
            );

        workspace.id =
            "mathRoughWorkspace";

        workspace.rows = 7;

        workspace.placeholder =
            "Write your calculation steps here...";

        workspace.spellcheck = false;

        body.appendChild(workspace);

        const clearWorkspace =
            createElement(
                "button",
                "math-workspace-clear",
                "Clear Rough Work"
            );

        clearWorkspace.type = "button";

        clearWorkspace.addEventListener(
            "click",
            function () {

                workspace.value = "";
                workspace.focus();

            }
        );

        body.appendChild(clearWorkspace);

        const calculator =
            createElement(
                "section",
                "math-calculator"
            );

        calculator.appendChild(
            createElement(
                "h3",
                "",
                "🔢 Basic Calculator"
            )
        );

        const display =
            createElement(
                "input",
                "math-calculator-display"
            );

        display.type = "text";
        display.value = "0";
        display.readOnly = true;

        display.setAttribute(
            "aria-label",
            "Calculator display"
        );

        calculator.appendChild(display);

        const keypad =
            createElement(
                "div",
                "math-calculator-keypad"
            );

        const buttons = [

            {
                label: "C",
                action: "clear",
                className: "is-action"
            },

            {
                label: "⌫",
                action: "backspace",
                className: "is-action"
            },

            {
                label: "√",
                action: "sqrt",
                className: "is-operator"
            },

            {
                label: "÷",
                action: "operator",
                value: "/",
                className: "is-operator"
            },

            {
                label: "7",
                action: "digit",
                value: "7"
            },

            {
                label: "8",
                action: "digit",
                value: "8"
            },

            {
                label: "9",
                action: "digit",
                value: "9"
            },

            {
                label: "×",
                action: "operator",
                value: "*",
                className: "is-operator"
            },

            {
                label: "4",
                action: "digit",
                value: "4"
            },

            {
                label: "5",
                action: "digit",
                value: "5"
            },

            {
                label: "6",
                action: "digit",
                value: "6"
            },

            {
                label: "−",
                action: "operator",
                value: "-",
                className: "is-operator"
            },

            {
                label: "1",
                action: "digit",
                value: "1"
            },

            {
                label: "2",
                action: "digit",
                value: "2"
            },

            {
                label: "3",
                action: "digit",
                value: "3"
            },

            {
                label: "+",
                action: "operator",
                value: "+",
                className: "is-operator"
            },

            {
                label: "±",
                action: "sign",
                className: "is-action"
            },

            {
                label: "0",
                action: "digit",
                value: "0"
            },

            {
                label: ".",
                action: "decimal"
            },

            {
                label: "%",
                action: "percent",
                className: "is-operator"
            },

            {
                label: "=",
                action: "equals",
                className: "is-equals"
            }

        ];

        let displayValue = "0";
        let storedValue = null;
        let pendingOperator = null;
        let waitingForOperand = false;


        function showValue(value) {

            displayValue = value;
            display.value = value;

        }


        function formatNumber(value) {

            if (!Number.isFinite(value)) {
                return "Error";
            }

            const rounded =
                Math.round(
                    (value + Number.EPSILON) *
                    10000000000
                ) / 10000000000;

            return String(rounded);

        }


        function calculate(
            left,
            right,
            operator
        ) {

            if (operator === "+") {
                return left + right;
            }

            if (operator === "-") {
                return left - right;
            }

            if (operator === "*") {
                return left * right;
            }

            if (operator === "/") {

                return right === 0
                    ? NaN
                    : left / right;

            }

            return right;

        }


        function resetCalculator() {

            storedValue = null;
            pendingOperator = null;
            waitingForOperand = false;

            showValue("0");

        }


        function inputDigit(digit) {

            if (
                displayValue === "Error" ||
                waitingForOperand
            ) {

                showValue(digit);
                waitingForOperand = false;

                return;

            }

            showValue(
                displayValue === "0"
                    ? digit
                    : displayValue + digit
            );

        }


        function inputDecimal() {

            if (
                displayValue === "Error" ||
                waitingForOperand
            ) {

                showValue("0.");
                waitingForOperand = false;

                return;

            }

            if (!displayValue.includes(".")) {
                showValue(displayValue + ".");
            }

        }


        function chooseOperator(operator) {

            if (displayValue === "Error") {

                resetCalculator();
                return;

            }

            const inputValue =
                Number(displayValue);

            if (
                pendingOperator &&
                waitingForOperand
            ) {

                pendingOperator = operator;
                return;

            }

            if (storedValue === null) {

                storedValue = inputValue;

            } else if (pendingOperator) {

                const result =
                    calculate(
                        storedValue,
                        inputValue,
                        pendingOperator
                    );

                const formatted =
                    formatNumber(result);

                showValue(formatted);

                if (formatted === "Error") {

                    storedValue = null;
                    pendingOperator = null;
                    waitingForOperand = true;

                    return;

                }

                storedValue = result;

            }

            pendingOperator = operator;
            waitingForOperand = true;

        }


        function showResult() {

            if (
                !pendingOperator ||
                storedValue === null ||
                displayValue === "Error"
            ) {
                return;
            }

            const result =
                calculate(
                    storedValue,
                    Number(displayValue),
                    pendingOperator
                );

            showValue(
                formatNumber(result)
            );

            storedValue = null;
            pendingOperator = null;
            waitingForOperand = true;

        }


        buttons.forEach(function (buttonData) {

            const button =
                createElement(
                    "button",
                    "math-calculator-key " +
                        (buttonData.className || ""),
                    buttonData.label
                );

            button.type = "button";

            button.addEventListener(
                "click",
                function () {

                    if (
                        buttonData.action ===
                        "digit"
                    ) {

                        inputDigit(
                            buttonData.value
                        );

                    } else if (
                        buttonData.action ===
                        "decimal"
                    ) {

                        inputDecimal();

                    } else if (
                        buttonData.action ===
                        "operator"
                    ) {

                        chooseOperator(
                            buttonData.value
                        );

                    } else if (
                        buttonData.action ===
                        "equals"
                    ) {

                        showResult();

                    } else if (
                        buttonData.action ===
                        "clear"
                    ) {

                        resetCalculator();

                    } else if (
                        buttonData.action ===
                        "backspace"
                    ) {

                        if (
                            displayValue !== "Error" &&
                            !waitingForOperand
                        ) {

                            showValue(
                                displayValue.length > 1
                                    ? displayValue.slice(
                                        0,
                                        -1
                                    )
                                    : "0"
                            );

                        }

                    } else if (
                        buttonData.action ===
                        "percent"
                    ) {

                        if (
                            displayValue !== "Error"
                        ) {

                            showValue(
                                formatNumber(
                                    Number(
                                        displayValue
                                    ) / 100
                                )
                            );

                        }

                    } else if (
                        buttonData.action ===
                        "sqrt"
                    ) {

                        const value =
                            Number(displayValue);

                        showValue(
                            value < 0
                                ? "Error"
                                : formatNumber(
                                    Math.sqrt(value)
                                )
                        );

                        waitingForOperand = true;

                    } else if (
                        buttonData.action ===
                        "sign"
                    ) {

                        if (
                            displayValue !== "0" &&
                            displayValue !== "Error"
                        ) {

                            showValue(
                                formatNumber(
                                    Number(
                                        displayValue
                                    ) * -1
                                )
                            );

                        }

                    }

                }
            );

            keypad.appendChild(button);

        });

        calculator.appendChild(keypad);
        body.appendChild(calculator);
        panel.appendChild(body);

        return panel;

    }


    function appendReview(
        review,
        question,
        questionIndex
    ) {

        const selectedIndex =
            selectedAnswers[questionIndex];

        const isCorrect =
            selectedIndex ===
            question.correctIndex;

        const card =
            createElement(
                "article",
                "math-review-card" +
                    (isCorrect
                        ? ""
                        : " is-wrong")
            );

        card.appendChild(
            createElement(
                "h3",
                "",
                (isCorrect
                    ? "✅ "
                    : "❌ ") +
                    "Question " +
                    (questionIndex + 1)
            )
        );

        card.appendChild(
            createElement(
                "p",
                "math-review-question",
                question.question
            )
        );

        const optionReview =
            createElement(
                "div",
                "math-review-options"
            );

        question.options.forEach(
            function (option, optionIndex) {

                const isCorrectOption =
                    optionIndex ===
                    question.correctIndex;

                const isSelectedOption =
                    optionIndex ===
                    selectedIndex;

                let optionClass =
                    "math-review-option";

                if (isCorrectOption) {

                    optionClass +=
                        " is-correct-answer";

                }

                if (
                    isSelectedOption &&
                    !isCorrectOption
                ) {

                    optionClass +=
                        " is-selected-wrong";

                }

                if (
                    isSelectedOption &&
                    isCorrectOption
                ) {

                    optionClass +=
                        " is-selected-correct";

                }

                const optionRow =
                    createElement(
                        "div",
                        optionClass
                    );

                optionRow.appendChild(
                    createElement(
                        "span",
                        "math-review-option-letter",
                        String.fromCharCode(
                            65 + optionIndex
                        )
                    )
                );

                optionRow.appendChild(
                    createElement(
                        "span",
                        "math-review-option-text",
                        option
                    )
                );

                let statusText = "";

                if (
                    isSelectedOption &&
                    isCorrectOption
                ) {

                    statusText =
                        "✓ Your answer • Correct";

                } else if (
                    isCorrectOption
                ) {

                    statusText =
                        "✓ Correct answer";

                } else if (
                    isSelectedOption
                ) {

                    statusText =
                        "✕ Your answer";

                }

                if (statusText) {

                    optionRow.appendChild(
                        createElement(
                            "span",
                            "math-review-option-status",
                            statusText
                        )
                    );

                }

                optionReview.appendChild(
                    optionRow
                );

            }
        );

        card.appendChild(optionReview);

        card.appendChild(
            createElement(
                "p",
                "math-review-explanation",
                "Explanation: " +
                    question.solution
            )
        );

        review.appendChild(card);

    }


    function showResult() {

        const score =
            testQuestions.reduce(
                function (
                    total,
                    question,
                    index
                ) {

                    return total +
                        (
                            selectedAnswers[index] ===
                            question.correctIndex
                                ? 1
                                : 0
                        );

                },
                0
            );

        quiz.hidden = true;
        quiz.style.display = "none";

        result.hidden = false;
        result.style.display = "block";

        result.className =
            "result math-test-result";

        result.innerHTML = "";

        const summary =
            createElement(
                "div",
                "math-test-result-summary"
            );

        summary.appendChild(
            createElement(
                "h2",
                "",
                "🎉 Test Submitted"
            )
        );

        summary.appendChild(
            createElement(
                "div",
                "math-test-score",
                score +
                    " / " +
                    testQuestions.length
            )
        );

        summary.appendChild(
            createElement(
                "p",
                "",
                scoreMessage(score)
            )
        );

        result.appendChild(summary);

        const review =
            createElement(
                "div",
                "math-answer-review"
            );

        review.appendChild(
            createElement(
                "h2",
                "",
                "📘 Answers and Explanations"
            )
        );

        testQuestions.forEach(
            function (question, index) {

                appendReview(
                    review,
                    question,
                    index
                );

            }
        );

        result.appendChild(review);

        const actions =
            createElement(
                "div",
                "math-test-result-actions"
            );

        const restartButton =
            createElement(
                "button",
                "quiz-button restart-button",
                "🔄 Try Again"
            );

        restartButton.type = "button";

        restartButton.addEventListener(
            "click",
            function () {

                window.location.reload();

            }
        );

        const reviewLink =
            createElement(
                "a",
                "primary-button",
                "← Review " +
                    settings.name
            );

        reviewLink.href =
            settings.reviewHref;

        actions.appendChild(restartButton);
        actions.appendChild(reviewLink);

        result.appendChild(actions);

        if (progressBar) {
            progressBar.style.width = "100%";
        }

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    }


    function buildTest() {

        quiz.className =
            "content-card math-test-shell";

        quiz.innerHTML = "";

        result.hidden = true;
        result.style.display = "none";

        if (progressBar) {
            progressBar.style.width = "0%";
        }

        const instructions =
            createElement(
                "div",
                "math-test-instructions"
            );

        const instructionText =
            createElement("div");

        instructionText.appendChild(
            createElement(
                "h2",
                "",
                "📝 Complete the Full Test"
            )
        );

        instructionText.appendChild(
            createElement(
                "p",
                "",
                "Choose one answer for every question. Correct answers and explanations are shown only after final submission."
            )
        );

        const countElement =
            createElement(
                "span",
                "math-test-count",
                "0 of " +
                    testQuestions.length +
                    " answered"
            );

        instructions.appendChild(
            instructionText
        );

        instructions.appendChild(
            countElement
        );

        quiz.appendChild(instructions);

        const questionsContainer =
            createElement(
                "div",
                "math-test-questions"
            );

        const testContent =
            createElement(
                "div",
                "math-test-content" +
                    (
                        calculationToolsEnabled
                            ? " has-calculation-tools"
                            : ""
                    )
            );

        const submitPanel =
            createElement(
                "div",
                "math-test-submit-panel"
            );

        const notice =
            createElement(
                "p",
                "math-test-notice",
                "Answers and explanations remain locked until all questions are submitted."
            );

        testQuestions.forEach(
            function (question, index) {

                questionsContainer.appendChild(
                    buildQuestionCard(
                        question,
                        index,
                        countElement,
                        notice
                    )
                );

            }
        );

        testContent.appendChild(
            questionsContainer
        );

        if (calculationToolsEnabled) {

            testContent.appendChild(
                buildCalculationTools()
            );

        }

        quiz.appendChild(testContent);

        const submitButton =
            createElement(
                "button",
                "quiz-button check-button math-test-submit-button",
                "Submit All Answers"
            );

        submitButton.type = "button";

        submitButton.addEventListener(
            "click",
            function () {

                const unansweredIndex =
                    selectedAnswers.findIndex(
                        function (answer) {

                            return answer === null;

                        }
                    );

                if (unansweredIndex !== -1) {

                    const remaining =
                        selectedAnswers.filter(
                            function (answer) {

                                return answer === null;

                            }
                        ).length;

                    notice.textContent =
                        "Please answer the remaining " +
                        remaining +
                        (
                            remaining === 1
                                ? " question"
                                : " questions"
                        ) +
                        " before submitting.";

                    const firstUnanswered =
                        questionsContainer.querySelector(
                            "[data-question-index='" +
                                unansweredIndex +
                                "']"
                        );

                    if (firstUnanswered) {

                        firstUnanswered.classList.add(
                            "is-unanswered"
                        );

                        firstUnanswered.scrollIntoView({
                            behavior: "smooth",
                            block: "center"
                        });

                    }

                    return;

                }

                showResult();

            }
        );

        submitPanel.appendChild(notice);
        submitPanel.appendChild(submitButton);

        quiz.appendChild(submitPanel);

    }


    buildTest();

})();
