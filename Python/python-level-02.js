(function () {
    "use strict";

    const PRACTICE_STORAGE_KEY =
        "codebhavya.python.level2.practice.v1";

    const dataIoProblems = {
        "dataio-p1": {
            starter: [
                "# Sample input: Venu",
                "name = input()",
                "print(\"\")",
                "print(\"Welcome to CodeBhavya.\")"
            ].join("\n"),
            inputs: ["Venu"],
            expected: "Hello, Venu!\nWelcome to CodeBhavya."
        },

        "dataio-p2": {
            starter: [
                "# Sample input: 20",
                "age = input()",
                "next_age = age",
                "print(\"Next age =\", next_age)"
            ].join("\n"),
            inputs: ["20"],
            expected: "Next age = 21"
        },

        "dataio-p3": {
            starter: [
                "# Sample inputs: 8 and 5",
                "length = int(input())",
                "width = int(input())",
                "area = 0",
                "print(\"Area =\", area)"
            ].join("\n"),
            inputs: ["8", "5"],
            expected: "Area = 40"
        },

        "dataio-p4": {
            starter: [
                "# Sample inputs: 249.5 and 2",
                "price = float(input())",
                "quantity = int(input())",
                "total = 0",
                "print(\"Total =\", total)"
            ].join("\n"),
            inputs: ["249.5", "2"],
            expected: "Total = 499"
        },

        "dataio-p5": {
            starter: [
                "# Sample input: 25",
                "celsius = float(input())",
                "fahrenheit = 0",
                "print(\"Fahrenheit =\", fahrenheit)"
            ].join("\n"),
            inputs: ["25"],
            expected: "Fahrenheit = 77"
        }
    };

    function normalizeSearch(value) {
        return value
            .toLowerCase()
            .replace(/[–—&]/g, " ")
            .replace(/[^a-z0-9+# ]/g, " ")
            .replace(/\s+/g, " ")
            .trim();
    }

    function initializeLessonSidebarSearch() {
        const input = document.getElementById("topicSearch");
        const empty = document.getElementById("pythonSearchEmpty");

        const links = Array.from(
            document.querySelectorAll(".python-topic-link")
        );

        const levelLinks = links.filter(function (link) {
            return Boolean(link.dataset.level);
        });

        const groups = Array.from(
            document.querySelectorAll(
                ".sidebar .python-sidebar-group"
            )
        );

        if (!input) {
            return;
        }

        input.addEventListener("input", function () {
            const query = normalizeSearch(input.value);
            let matches = 0;

            links.forEach(function (link) {
                const searchable = normalizeSearch(
                    (link.dataset.search || "") +
                    " " +
                    link.textContent
                );

                const matchesQuery =
                    !query ||
                    searchable.indexOf(query) !== -1;

                link.classList.toggle(
                    "is-search-hidden",
                    !matchesQuery
                );

                if (matchesQuery) {
                    matches += 1;
                }
            });

            groups.forEach(function (group, index) {
                if (!query) {
                    group.classList.remove(
                        "is-search-hidden"
                    );

                    return;
                }

                if (index < 3) {
                    const startLevel = index * 4 + 1;
                    const endLevel = startLevel + 3;

                    const visible = levelLinks.some(
                        function (link) {
                            const level =
                                Number(link.dataset.level);

                            return (
                                level >= startLevel &&
                                level <= endLevel &&
                                !link.classList.contains(
                                    "is-search-hidden"
                                )
                            );
                        }
                    );

                    group.classList.toggle(
                        "is-search-hidden",
                        !visible
                    );
                } else {
                    const practiceLink =
                        document.querySelector(
                            ".python-practice-link"
                        );

                    group.classList.toggle(
                        "is-search-hidden",
                        !practiceLink ||
                        practiceLink.classList.contains(
                            "is-search-hidden"
                        )
                    );
                }
            });

            if (empty) {
                empty.hidden =
                    !query || matches > 0;
            }
        });
    }

    function copyText(text, button) {
        const originalText = button.textContent;

        function showResult(message) {
            button.textContent = message;

            window.setTimeout(function () {
                button.textContent = originalText;
            }, 1200);
        }

        if (
            navigator.clipboard &&
            navigator.clipboard.writeText
        ) {
            navigator.clipboard.writeText(text).then(
                function () {
                    showResult("Copied!");
                },
                function () {
                    showResult("Copy Failed");
                }
            );

            return;
        }

        const textArea =
            document.createElement("textarea");

        textArea.value = text;
        textArea.setAttribute("readonly", "");
        textArea.style.position = "fixed";
        textArea.style.opacity = "0";

        document.body.appendChild(textArea);
        textArea.select();

        try {
            document.execCommand("copy");
            showResult("Copied!");
        } catch (error) {
            showResult("Select & Copy");
        }

        textArea.remove();
    }

    function initializeLessonCodeCopy() {
        document.querySelectorAll("[data-copy-target]")
            .forEach(function (button) {
                button.addEventListener(
                    "click",
                    function () {
                        const target =
                            document.getElementById(
                                button.dataset.copyTarget
                            );

                        if (target) {
                            copyText(
                                target.textContent,
                                button
                            );
                        }
                    }
                );
            });
    }

    function initializeLessonReveals() {
        document.querySelectorAll("[data-reveal-target]")
            .forEach(function (button) {
                button.dataset.closedLabel =
                    button.textContent;

                button.addEventListener(
                    "click",
                    function () {
                        const target =
                            document.getElementById(
                                button.dataset.revealTarget
                            );

                        if (!target) {
                            return;
                        }

                        const willShow = target.hidden;

                        target.hidden = !willShow;

                        button.setAttribute(
                            "aria-expanded",
                            String(willShow)
                        );

                        button.textContent = willShow
                            ? (
                                button.dataset.hideLabel ||
                                "Hide Solution"
                            )
                            : button.dataset.closedLabel;
                    }
                );
            });
    }

    function initializeLessonQuiz() {
        const quiz =
            document.querySelector(
                "[data-python-quiz]"
            );

        if (!quiz) {
            return;
        }

        const questions = Array.from(
            quiz.querySelectorAll("[data-correct]")
        );

        const checkButton =
            quiz.querySelector("[data-check-quiz]");

        const resetButton =
            quiz.querySelector("[data-reset-quiz]");

        const result =
            quiz.querySelector(".python-quiz-result");

        function clearQuestion(question) {
            const feedback =
                question.querySelector(
                    ".python-quiz-feedback"
                );

            question.classList.remove(
                "is-correct",
                "is-wrong"
            );

            if (feedback) {
                feedback.hidden = true;
                feedback.textContent = "";
            }
        }

        checkButton.addEventListener(
            "click",
            function () {
                let score = 0;
                let answered = 0;

                questions.forEach(function (question) {
                    const selected =
                        question.querySelector(
                            "input:checked"
                        );

                    const feedback =
                        question.querySelector(
                            ".python-quiz-feedback"
                        );

                    const correct = Boolean(
                        selected &&
                        selected.value ===
                            question.dataset.correct
                    );

                    clearQuestion(question);

                    if (selected) {
                        answered += 1;
                    }

                    question.classList.add(
                        correct
                            ? "is-correct"
                            : "is-wrong"
                    );

                    if (correct) {
                        score += 1;
                    }

                    if (feedback) {
                        feedback.textContent = correct
                            ? "✓ Correct"
                            : (
                                selected
                                    ? "✕ Review this concept and try again."
                                    : "Please select an answer."
                            );

                        feedback.hidden = false;
                    }
                });

                if (answered < questions.length) {
                    result.textContent =
                        "Answered " +
                        answered +
                        " of " +
                        questions.length +
                        ". Score: " +
                        score +
                        "/" +
                        questions.length;
                } else if (score === questions.length) {
                    result.textContent =
                        "Excellent! " +
                        score +
                        "/" +
                        questions.length +
                        " — your data and input concepts are clear.";
                } else if (
                    score >=
                    Math.ceil(
                        questions.length * 0.6
                    )
                ) {
                    result.textContent =
                        "Good work! " +
                        score +
                        "/" +
                        questions.length +
                        " — review the marked question(s).";
                } else {
                    result.textContent =
                        "Score: " +
                        score +
                        "/" +
                        questions.length +
                        " — revise the lesson and try again.";
                }
            }
        );

        resetButton.addEventListener(
            "click",
            function () {
                questions.forEach(function (question) {
                    question.querySelectorAll("input")
                        .forEach(function (input) {
                            input.checked = false;
                        });

                    clearQuestion(question);
                });

                result.textContent = "";

                if (questions[0]) {
                    questions[0].scrollIntoView({
                        behavior: "smooth",
                        block: "center"
                    });
                }
            }
        );
    }

    function safelyReadPracticeState() {
        try {
            const saved = JSON.parse(
                window.localStorage.getItem(
                    PRACTICE_STORAGE_KEY
                ) || "{}"
            );

            return (
                saved &&
                typeof saved === "object"
            )
                ? saved
                : {};
        } catch (error) {
            return {};
        }
    }

    function safelySavePracticeState(state) {
        try {
            window.localStorage.setItem(
                PRACTICE_STORAGE_KEY,
                JSON.stringify(state)
            );
        } catch (error) {
            /*
             * The current visit continues when
             * browser storage is unavailable.
             */
        }
    }

    function splitArguments(source) {
        const values = [];

        let current = "";
        let quote = "";
        let escaped = false;
        let depth = 0;

        for (
            let index = 0;
            index < source.length;
            index += 1
        ) {
            const character = source[index];

            if (escaped) {
                current += character;
                escaped = false;
                continue;
            }

            if (character === "\\") {
                current += character;
                escaped = true;
                continue;
            }

            if (quote) {
                current += character;

                if (character === quote) {
                    quote = "";
                }

                continue;
            }

            if (
                character === "\"" ||
                character === "'"
            ) {
                quote = character;
                current += character;
                continue;
            }

            if (character === "(") {
                depth += 1;
            } else if (character === ")") {
                depth -= 1;
            }

            if (
                character === "," &&
                depth === 0
            ) {
                values.push(current.trim());
                current = "";
                continue;
            }

            current += character;
        }

        if (quote) {
            throw new Error(
                "A string is missing its closing quote."
            );
        }

        if (
            current.trim() ||
            source.trim() === ""
        ) {
            values.push(current.trim());
        }

        return values;
    }

    function decodeString(token) {
        const value = token.trim();
        const quote = value[0];

        if (
            (
                quote !== "\"" &&
                quote !== "'"
            ) ||
            value[value.length - 1] !== quote
        ) {
            return null;
        }

        return value
            .slice(1, -1)
            .replace(/\\n/g, "\n")
            .replace(/\\t/g, "\t")
            .replace(/\\"/g, "\"")
            .replace(/\\'/g, "'")
            .replace(/\\\\/g, "\\");
    }

    function displayValue(value) {
        if (value === null) {
            return "None";
        }

        if (value === true) {
            return "True";
        }

        if (value === false) {
            return "False";
        }

        return String(value);
    }

    function evaluateExpression(
        source,
        variables,
        inputQueue
    ) {
        const expression = source.trim();

        const fString = expression.match(
            /^f(["'])([\s\S]*)\1$/
        );

        if (fString) {
            return fString[2].replace(
                /\{([^{}]+)\}/g,
                function (_, inner) {
                    return displayValue(
                        evaluateExpression(
                            inner,
                            variables,
                            inputQueue
                        )
                    );
                }
            );
        }

        const stringValue =
            decodeString(expression);

        if (stringValue !== null) {
            return stringValue;
        }

        if (expression === "True") {
            return true;
        }

        if (expression === "False") {
            return false;
        }

        if (expression === "None") {
            return null;
        }

        const inputMatch = expression.match(
            /^input\s*\((.*)\)$/
        );

        if (inputMatch) {
            if (!inputQueue.length) {
                throw new Error(
                    "The program requested more input values " +
                    "than the test provides."
                );
            }

            return inputQueue.shift();
        }

        const conversion = expression.match(
            /^(int|float|str|bool)\s*\(([\s\S]*)\)$/
        );

        if (conversion) {
            const value = evaluateExpression(
                conversion[2],
                variables,
                inputQueue
            );

            if (conversion[1] === "str") {
                return displayValue(value);
            }

            if (conversion[1] === "bool") {
                return Boolean(value);
            }

            if (conversion[1] === "int") {
                if (
                    typeof value === "string" &&
                    !/^[+-]?\d+$/.test(
                        value.trim()
                    )
                ) {
                    throw new Error(
                        "ValueError: int() requires text " +
                        "containing a whole number."
                    );
                }

                const number = Number(value);

                if (!Number.isFinite(number)) {
                    throw new Error(
                        "ValueError: cannot convert " +
                        "the value to int."
                    );
                }

                return Math.trunc(number);
            }

            const number = Number(value);

            if (!Number.isFinite(number)) {
                throw new Error(
                    "ValueError: cannot convert " +
                    "the value to float."
                );
            }

            return number;
        }

        if (/^[A-Za-z_]\w*$/.test(expression)) {
            if (
                !Object.prototype
                    .hasOwnProperty.call(
                        variables,
                        expression
                    )
            ) {
                throw new Error(
                    "NameError: " +
                    expression +
                    " is not defined."
                );
            }

            return variables[expression];
        }

        if (
            /^[+-]?(?:\d+\.?\d*|\.\d+)$/
                .test(expression)
        ) {
            return Number(expression);
        }

        const arithmetic = expression.replace(
            /\b[A-Za-z_]\w*\b/g,
            function (name) {
                if (
                    !Object.prototype
                        .hasOwnProperty.call(
                            variables,
                            name
                        )
                ) {
                    throw new Error(
                        "NameError: " +
                        name +
                        " is not defined."
                    );
                }

                const value = variables[name];

                if (typeof value !== "number") {
                    throw new Error(
                        "TypeError: arithmetic requires " +
                        "numeric values."
                    );
                }

                return "(" + String(value) + ")";
            }
        );

        if (
            !/^[0-9+\-*/%().\s]+$/
                .test(arithmetic)
        ) {
            throw new Error(
                "This Level 2 runner supports input, " +
                "conversion, arithmetic and print()."
            );
        }

        try {
            const result = Function(
                "\"use strict\"; return (" +
                arithmetic +
                ");"
            )();

            if (
                typeof result !== "number" ||
                !Number.isFinite(result)
            ) {
                throw new Error(
                    "The arithmetic result is not " +
                    "a finite number."
                );
            }

            return result;
        } catch (error) {
            if (
                /^(NameError|TypeError|ValueError)/
                    .test(error.message)
            ) {
                throw error;
            }

            throw new Error(
                "Check the arithmetic expression."
            );
        }
    }

    function runDataIoCode(
        source,
        configuredInputs
    ) {
        const variables = {};
        const output = [];

        const inputQueue =
            configuredInputs.slice();

        const lines = source
            .replace(/\r/g, "")
            .split("\n");

        try {
            lines.forEach(
                function (rawLine, index) {
                    const line = rawLine.trim();

                    if (
                        !line ||
                        line.startsWith("#")
                    ) {
                        return;
                    }

                    const assignment = line.match(
                        /^([A-Za-z_]\w*)\s*=\s*(.+)$/
                    );

                    if (assignment) {
                        variables[assignment[1]] =
                            evaluateExpression(
                                assignment[2],
                                variables,
                                inputQueue
                            );

                        return;
                    }

                    const printMatch = line.match(
                        /^print\s*\(([\s\S]*)\)\s*$/
                    );

                    if (printMatch) {
                        const parts = splitArguments(
                            printMatch[1]
                        );

                        const values = parts.map(
                            function (part) {
                                return displayValue(
                                    evaluateExpression(
                                        part,
                                        variables,
                                        inputQueue
                                    )
                                );
                            }
                        );

                        output.push(
                            values.join(" ")
                        );

                        return;
                    }

                    throw new Error(
                        "Line " +
                        (index + 1) +
                        ": use a supported assignment " +
                        "or print() statement."
                    );
                }
            );

            return {
                ok: true,
                output: output.join("\n")
            };
        } catch (error) {
            return {
                ok: false,
                output: "",
                error: error.message
            };
        }
    }

    function initializeProgrammingProblems() {
        const cards = Array.from(
            document.querySelectorAll(
                "[data-python-problem]"
            )
        );

        if (!cards.length) {
            return;
        }

        const state = safelyReadPracticeState();

        function problemState(key) {
            if (
                !state[key] ||
                typeof state[key] !== "object"
            ) {
                state[key] = {
                    attempts: 0,
                    best: 0,
                    hintViewed: false,
                    solutionViewed: false,
                    completedWithSolution: false,
                    code: dataIoProblems[key].starter
                };
            }

            return state[key];
        }

        function updateOverall() {
            const keys =
                Object.keys(dataIoProblems);

            const solved = keys.filter(
                function (key) {
                    return Number(
                        problemState(key).best
                    ) > 0;
                }
            ).length;

            const completed = keys.filter(
                function (key) {
                    return Boolean(
                        problemState(key)
                            .completedWithSolution
                    );
                }
            ).length;

            const score = keys.reduce(
                function (sum, key) {
                    return (
                        sum +
                        Number(
                            problemState(key).best ||
                            0
                        )
                    );
                },
                0
            );

            const percent = Math.round(
                (solved + completed) /
                keys.length *
                100
            );

            document.getElementById(
                "pythonPracticeSolved"
            ).textContent =
                solved + " / " + keys.length;

            document.getElementById(
                "pythonPracticeCompleted"
            ).textContent =
                String(completed);

            document.getElementById(
                "pythonPracticeScore"
            ).textContent =
                score +
                " / " +
                (keys.length * 100);

            document.getElementById(
                "pythonPracticePercent"
            ).textContent =
                percent + "%";

            document.getElementById(
                "pythonPracticeProgressBar"
            ).style.width =
                percent + "%";
        }

        function renderCard(card) {
            const current = problemState(
                card.dataset.pythonProblem
            );

            const badge = card.querySelector(
                "[data-problem-badge]"
            );

            card.classList.toggle(
                "is-solved",
                current.best > 0
            );

            card.classList.toggle(
                "is-completed",
                !current.best &&
                current.completedWithSolution
            );

            badge.className =
                "python-practice-badge";

            if (current.best > 0) {
                badge.textContent = "✓ Solved";
                badge.classList.add("solved");
            } else if (
                current.completedWithSolution
            ) {
                badge.textContent =
                    "✓ Completed with Solution";

                badge.classList.add("completed");
            } else {
                badge.textContent = "";
            }

            card.querySelector(
                "[data-problem-score]"
            ).textContent =
                Number(current.best || 0) +
                " / 100";

            card.querySelector(
                "[data-problem-attempts]"
            ).textContent =
                String(
                    Number(current.attempts || 0)
                );

            card.querySelector(
                "[data-problem-status]"
            ).textContent =
                current.best > 0
                    ? "Solved"
                    : (
                        current.completedWithSolution
                            ? "Completed with Solution"
                            : (
                                current.attempts
                                    ? "In Progress"
                                    : "Not Solved"
                            )
                    );
        }

        function setTestResult(
            card,
            passed,
            message
        ) {
            const tests = card.querySelector(
                "[data-problem-tests]"
            );

            tests.innerHTML = "";

            const row =
                document.createElement("div");

            const label =
                document.createElement("span");

            const result =
                document.createElement("strong");

            row.className =
                passed ? "pass" : "fail";

            label.textContent = message;

            result.textContent =
                passed ? "PASS" : "CHECK";

            row.append(label, result);
            tests.appendChild(row);
        }

        cards.forEach(function (card) {
            const key =
                card.dataset.pythonProblem;

            const config =
                dataIoProblems[key];

            const current =
                problemState(key);

            const editor = card.querySelector(
                "[data-problem-code]"
            );

            const output = card.querySelector(
                "[data-problem-output]"
            );

            const workspace =
                card.querySelector(
                    "[data-problem-workspace]"
                );

            const hint = card.querySelector(
                "[data-problem-hint]"
            );

            const solution =
                card.querySelector(
                    "[data-problem-solution]"
                );

            const message =
                card.querySelector(
                    "[data-problem-message]"
                );

            editor.value =
                current.code || config.starter;

            editor.addEventListener(
                "input",
                function () {
                    current.code = editor.value;
                    safelySavePracticeState(state);
                }
            );

            card.querySelectorAll(
                "[data-problem-action]"
            ).forEach(function (button) {
                button.addEventListener(
                    "click",
                    function () {
                        const action =
                            button.dataset
                                .problemAction;

                        if (action === "toggle") {
                            const willShow =
                                workspace.hidden;

                            workspace.hidden =
                                !willShow;

                            button.textContent =
                                willShow
                                    ? "✕ Close Workspace"
                                    : "💻 Solve It Yourself";
                        }

                        if (action === "hint") {
                            const willShow =
                                hint.hidden;

                            hint.hidden =
                                !willShow;

                            button.textContent =
                                willShow
                                    ? "Hide Hint"
                                    : "Hint";

                            if (willShow) {
                                current.hintViewed =
                                    true;

                                safelySavePracticeState(
                                    state
                                );
                            }
                        }

                        if (
                            action === "solution"
                        ) {
                            const willShow =
                                solution.hidden;

                            solution.hidden =
                                !willShow;

                            button.textContent =
                                willShow
                                    ? "Hide Program"
                                    : "Show Program";

                            if (willShow) {
                                current.solutionViewed =
                                    true;

                                safelySavePracticeState(
                                    state
                                );
                            }
                        }

                        if (action === "run") {
                            const execution =
                                runDataIoCode(
                                    editor.value,
                                    config.inputs
                                );

                            output.textContent =
                                execution.ok
                                    ? (
                                        execution.output ||
                                        "(No output)"
                                    )
                                    : (
                                        "Error: " +
                                        execution.error
                                    );

                            message.textContent =
                                execution.ok
                                    ? "Program executed using the displayed sample input."
                                    : "Fix the displayed error, then run the program again.";
                        }

                        if (action === "check") {
                            current.attempts =
                                Number(
                                    current.attempts ||
                                    0
                                ) + 1;

                            const execution =
                                runDataIoCode(
                                    editor.value,
                                    config.inputs
                                );

                            const passed =
                                execution.ok &&
                                execution.output
                                    .trim() ===
                                config.expected
                                    .trim();

                            output.textContent =
                                execution.ok
                                    ? (
                                        execution.output ||
                                        "(No output)"
                                    )
                                    : (
                                        "Error: " +
                                        execution.error
                                    );

                            if (passed) {
                                if (
                                    current.solutionViewed
                                ) {
                                    current.completedWithSolution =
                                        true;

                                    message.textContent =
                                        "✓ Correct output. Completed after studying the solution.";
                                } else {
                                    const earned =
                                        current.hintViewed
                                            ? 90
                                            : 100;

                                    current.best =
                                        Math.max(
                                            Number(
                                                current.best ||
                                                0
                                            ),
                                            earned
                                        );

                                    message.textContent =
                                        "✓ Excellent! Output matched. Score: " +
                                        earned +
                                        " / 100.";
                                }

                                setTestResult(
                                    card,
                                    true,
                                    "Sample output matched"
                                );
                            } else {
                                message.textContent =
                                    execution.ok
                                        ? "The program ran, but its output does not exactly match the expected output."
                                        : "Correct the program error and check again.";

                                setTestResult(
                                    card,
                                    false,
                                    execution.ok
                                        ? "Output mismatch"
                                        : "Program error"
                                );
                            }

                            current.code =
                                editor.value;

                            safelySavePracticeState(
                                state
                            );

                            renderCard(card);
                            updateOverall();
                        }

                        if (action === "reset") {
                            editor.value =
                                config.starter;

                            current.code =
                                config.starter;

                            output.textContent =
                                "Run your program to see the output.";

                            setTestResult(
                                card,
                                false,
                                "No test checked yet."
                            );

                            const row =
                                card.querySelector(
                                    "[data-problem-tests] > div"
                                );

                            if (row) {
                                row.className = "";

                                row.querySelector(
                                    "strong"
                                ).textContent = "—";
                            }

                            message.textContent =
                                "Editor reset. Write your solution and test it again.";

                            safelySavePracticeState(
                                state
                            );
                        }
                    }
                );
            });

            renderCard(card);
        });

        updateOverall();
    }

    function initializeStandardPanels() {
        document.querySelectorAll(
            "[data-python-panel-toggle]"
        ).forEach(function (button) {
            button.addEventListener(
                "click",
                function () {
                    const panel =
                        document.getElementById(
                            button.dataset
                                .pythonPanelToggle
                        );

                    if (!panel) {
                        return;
                    }

                    const willShow =
                        panel.hidden;

                    panel.hidden = !willShow;

                    button.setAttribute(
                        "aria-expanded",
                        String(willShow)
                    );

                    button.textContent = willShow
                        ? "✕ Close Interactive Panel"
                        : (
                            button.dataset
                                .pythonPanelToggle
                                .indexOf("Trace") !== -1
                                ? "▶ Open Program Tracer"
                                : "▶ Open Visualization"
                        );
                }
            );
        });
    }

    function setInteractiveButtonDisabled(
        button,
        disabled
    ) {
        if (!button) {
            return;
        }

        button.disabled = disabled;

        button.setAttribute(
            "aria-disabled",
            String(disabled)
        );

        button.classList.toggle(
            "is-disabled",
            disabled
        );

        button.style.opacity =
            disabled ? "0.42" : "";

        button.style.cursor =
            disabled ? "not-allowed" : "";

        button.style.pointerEvents =
            disabled ? "none" : "";

        button.style.filter =
            disabled
                ? "grayscale(0.55)"
                : "";

        button.style.transform =
            disabled ? "none" : "";

        button.style.boxShadow =
            disabled ? "none" : "";
    }

    function initializeDataVisualizer() {
        const visualizer =
            document.querySelector(
                "[data-python-visualizer]"
            );

        if (!visualizer) {
            return;
        }

        const frames = [
            {
                title:
                    "1. User Enters Data",
                detail:
                    "The user types a value using the keyboard, such as 20 for age."
            },
            {
                title:
                    "2. input() Reads Text",
                detail:
                    "Python receives the entered characters. The value returned by input() is the string \"20\"."
            },
            {
                title:
                    "3. Convert the Type",
                detail:
                    "int() converts the string \"20\" into the integer 20 required for arithmetic."
            },
            {
                title:
                    "4. Process the Value",
                detail:
                    "Python evaluates the expression age + 1 and stores the integer result 21."
            },
            {
                title:
                    "5. Display the Result",
                detail:
                    "print() combines a clear label with the processed value: Next age = 21."
            }
        ];

        const flowSteps = Array.from(
            visualizer.querySelectorAll(
                "[data-visual-step]"
            )
        );

        const stepText =
            document.getElementById(
                "pythonDataVisualStep"
            );

        const title =
            document.getElementById(
                "pythonDataVisualTitle"
            );

        const detail =
            document.getElementById(
                "pythonDataVisualDetail"
            );

        const dots =
            document.getElementById(
                "pythonDataVisualDots"
            );

        const progress =
            document.getElementById(
                "pythonDataVisualProgress"
            );

        const previous =
            visualizer.querySelector(
                '[data-visual-action="previous"]'
            );

        const next =
            visualizer.querySelector(
                '[data-visual-action="next"]'
            );

        const auto =
            visualizer.querySelector(
                '[data-visual-action="auto"]'
            );

        let index = 0;
        let timer = null;

        function stop() {
            if (timer !== null) {
                window.clearInterval(timer);
                timer = null;
            }
        }

        function render() {
            const frame = frames[index];

            stepText.textContent =
                "Step " +
                (index + 1) +
                " of " +
                frames.length;

            title.textContent =
                frame.title;

            detail.textContent =
                frame.detail;

            progress.style.width =
                (
                    (index + 1) /
                    frames.length *
                    100
                ) + "%";

            flowSteps.forEach(
                function (
                    step,
                    stepIndex
                ) {
                    step.classList.toggle(
                        "is-active",
                        stepIndex === index
                    );

                    step.classList.toggle(
                        "is-complete",
                        stepIndex < index
                    );
                }
            );

            dots.innerHTML = "";

            frames.forEach(
                function (_, dotIndex) {
                    const dot =
                        document.createElement(
                            "i"
                        );

                    dot.classList.toggle(
                        "active",
                        dotIndex === index
                    );

                    dots.appendChild(dot);
                }
            );

            const atEnd =
                index === frames.length - 1;

            setInteractiveButtonDisabled(
                previous,
                index === 0
            );

            setInteractiveButtonDisabled(
                next,
                atEnd
            );

            setInteractiveButtonDisabled(
                auto,
                atEnd
            );
        }

        visualizer.querySelectorAll(
            "[data-visual-action]"
        ).forEach(function (button) {
            button.addEventListener(
                "click",
                function () {
                    if (button.disabled) {
                        return;
                    }

                    const action =
                        button.dataset
                            .visualAction;

                    if (action !== "auto") {
                        stop();
                    }

                    if (
                        action === "previous"
                    ) {
                        index = Math.max(
                            0,
                            index - 1
                        );
                    } else if (
                        action === "next"
                    ) {
                        index = Math.min(
                            frames.length - 1,
                            index + 1
                        );
                    } else if (
                        action === "reset"
                    ) {
                        index = 0;
                    } else if (
                        action === "pause"
                    ) {
                        stop();
                    } else if (
                        action === "auto"
                    ) {
                        stop();

                        timer =
                            window.setInterval(
                                function () {
                                    if (
                                        index >=
                                        frames.length - 1
                                    ) {
                                        stop();
                                        return;
                                    }

                                    index += 1;
                                    render();

                                    if (
                                        index ===
                                        frames.length - 1
                                    ) {
                                        stop();
                                    }
                                },
                                1500
                            );
                    }

                    render();
                }
            );
        });

        render();
    }

    function initializeDataTracer() {
        const tracer =
            document.querySelector(
                "[data-python-tracer]"
            );

        if (!tracer) {
            return;
        }

        const codeLines = [
            "name = input()",
            "age = int(input())",
            "next_age = age + 1",
            "print(\"Student:\", name)",
            "print(\"Current age:\", age)",
            "print(\"Next age:\", next_age)"
        ];

        const steps = [
            {
                line: 0,
                state: {
                    input: "Venu",
                    name: "\"Venu\"",
                    type: "str"
                },
                output: "",
                note:
                    "Consume the first sample input and store it as the string name."
            },
            {
                line: 1,
                state: {
                    input: "20",
                    name: "\"Venu\"",
                    age: "20 (int)"
                },
                output: "",
                note:
                    "Read the second input as text, convert it with int(), and store 20."
            },
            {
                line: 2,
                state: {
                    name: "\"Venu\"",
                    age: "20",
                    next_age: "21"
                },
                output: "",
                note:
                    "Add 1 to age and store the integer result in next_age."
            },
            {
                line: 3,
                state: {
                    name: "\"Venu\"",
                    age: "20",
                    next_age: "21"
                },
                output:
                    "Student: Venu",
                note:
                    "Display the Student label and the string stored in name."
            },
            {
                line: 4,
                state: {
                    name: "\"Venu\"",
                    age: "20",
                    next_age: "21"
                },
                output:
                    "Student: Venu\n" +
                    "Current age: 20",
                note:
                    "Display the current integer age."
            },
            {
                line: 5,
                state: {
                    name: "\"Venu\"",
                    age: "20",
                    next_age: "21"
                },
                output:
                    "Student: Venu\n" +
                    "Current age: 20\n" +
                    "Next age: 21",
                note:
                    "Display next_age. Program execution is complete."
            }
        ];

        const code =
            document.getElementById(
                "pythonDataTraceCode"
            );

        const note =
            document.getElementById(
                "pythonDataTraceNote"
            );

        const liveState =
            document.getElementById(
                "pythonDataTraceState"
            );

        const output =
            document.getElementById(
                "pythonDataTraceOutput"
            );

        const status =
            document.getElementById(
                "pythonDataTraceStatus"
            );

        const previous =
            tracer.querySelector(
                '[data-trace-action="previous"]'
            );

        const next =
            tracer.querySelector(
                '[data-trace-action="next"]'
            );

        const auto =
            tracer.querySelector(
                '[data-trace-action="auto"]'
            );

        let index = -1;
        let timer = null;

        codeLines.forEach(
            function (line, lineIndex) {
                const row =
                    document.createElement(
                        "span"
                    );

                row.dataset.traceLine =
                    String(lineIndex);

                row.textContent =
                    String(lineIndex + 1)
                        .padStart(2, "0") +
                    "  " +
                    line;

                code.appendChild(row);
            }
        );

        function stop() {
            if (timer !== null) {
                window.clearInterval(timer);
                timer = null;
            }
        }

        function updateControls() {
            const atEnd =
                index === steps.length - 1;

            setInteractiveButtonDisabled(
                previous,
                index < 0
            );

            setInteractiveButtonDisabled(
                next,
                atEnd
            );

            setInteractiveButtonDisabled(
                auto,
                atEnd
            );
        }

        function render() {
            code.querySelectorAll(
                "[data-trace-line]"
            ).forEach(function (line) {
                line.classList.toggle(
                    "is-active",
                    index >= 0 &&
                    Number(
                        line.dataset.traceLine
                    ) ===
                    steps[index].line
                );
            });

            if (index < 0) {
                note.textContent =
                    "Click Next to begin tracing.";

                liveState.innerHTML = "";
                output.textContent = "—";

                status.textContent =
                    "Step 0 of " +
                    steps.length;

                updateControls();
                return;
            }

            const step = steps[index];

            note.textContent = step.note;

            output.textContent =
                step.output || "—";

            status.textContent =
                "Step " +
                (index + 1) +
                " of " +
                steps.length;

            liveState.innerHTML = "";

            Object.keys(step.state)
                .forEach(function (name) {
                    const item =
                        document.createElement(
                            "div"
                        );

                    const label =
                        document.createElement(
                            "strong"
                        );

                    const value =
                        document.createElement(
                            "span"
                        );

                    label.textContent = name;

                    value.textContent =
                        String(
                            step.state[name]
                        );

                    item.append(
                        label,
                        value
                    );

                    liveState.appendChild(
                        item
                    );
                });

            updateControls();
        }

        tracer.querySelectorAll(
            "[data-trace-action]"
        ).forEach(function (button) {
            button.addEventListener(
                "click",
                function () {
                    if (button.disabled) {
                        return;
                    }

                    const action =
                        button.dataset
                            .traceAction;

                    if (action !== "auto") {
                        stop();
                    }

                    if (
                        action === "previous"
                    ) {
                        index = Math.max(
                            -1,
                            index - 1
                        );
                    } else if (
                        action === "next"
                    ) {
                        index = Math.min(
                            steps.length - 1,
                            index + 1
                        );
                    } else if (
                        action === "reset"
                    ) {
                        index = -1;
                    } else if (
                        action === "pause"
                    ) {
                        stop();
                    } else if (
                        action === "auto"
                    ) {
                        stop();

                        timer =
                            window.setInterval(
                                function () {
                                    if (
                                        index >=
                                        steps.length - 1
                                    ) {
                                        stop();
                                        return;
                                    }

                                    index += 1;
                                    render();

                                    if (
                                        index ===
                                        steps.length - 1
                                    ) {
                                        stop();
                                    }
                                },
                                1400
                            );
                    }

                    render();
                }
            );
        });

        render();
    }

    function initializeLevelTwo() {
        initializeLessonSidebarSearch();
        initializeLessonCodeCopy();
        initializeLessonReveals();
        initializeLessonQuiz();
        initializeProgrammingProblems();
        initializeStandardPanels();
        initializeDataVisualizer();
        initializeDataTracer();
    }

    if (document.readyState === "loading") {
        document.addEventListener(
            "DOMContentLoaded",
            initializeLevelTwo
        );
    } else {
        initializeLevelTwo();
    }
}());
