(function () {
    "use strict";

    const STORAGE_KEY = "codebhavya.python.level3.practice.v1";

    const problems = {
        "operators-p1": {
            starter: [
                "# Sample inputs: 120 and 3",
                "price = int(input())",
                "quantity = int(input())",
                "total = 0",
                "print(\"Total =\", total)"
            ].join("\n"),
            inputs: ["120", "3"],
            expected: "Total = 360"
        },

        "operators-p2": {
            starter: [
                "# Sample inputs: 78, 85 and 92",
                "mark1 = int(input())",
                "mark2 = int(input())",
                "mark3 = int(input())",
                "average = 0",
                "print(\"Average =\", average)"
            ].join("\n"),
            inputs: ["78", "85", "92"],
            expected: "Average = 85"
        },

        "operators-p3": {
            starter: [
                "# Sample inputs: 10000, 5 and 2",
                "principal = float(input())",
                "rate = float(input())",
                "time = float(input())",
                "interest = 0",
                "print(\"Simple interest =\", interest)"
            ].join("\n"),
            inputs: ["10000", "5", "2"],
            expected: "Simple interest = 1000"
        },

        "operators-p4": {
            starter: [
                "# Sample input: 3672",
                "total = int(input())",
                "hours = 0",
                "remaining = 0",
                "minutes = 0",
                "seconds = 0",
                "print(\"Hours =\", hours)",
                "print(\"Minutes =\", minutes)",
                "print(\"Seconds =\", seconds)"
            ].join("\n"),
            inputs: ["3672"],
            expected:
                "Hours = 1\nMinutes = 1\nSeconds = 12"
        },

        "operators-p5": {
            starter: [
                "# Sample inputs: 20 and 75",
                "age = int(input())",
                "score = int(input())",
                "eligible = False",
                "print(\"Eligible =\", eligible)"
            ].join("\n"),
            inputs: ["20", "75"],
            expected: "Eligible = True"
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

    function initializeSidebarSearch() {
        const input =
            document.getElementById("topicSearch");

        const empty =
            document.getElementById(
                "pythonSearchEmpty"
            );

        const links = Array.from(
            document.querySelectorAll(
                ".python-topic-link"
            )
        );

        const levelLinks = links.filter(
            function (link) {
                return Boolean(
                    link.dataset.level
                );
            }
        );

        const groups = Array.from(
            document.querySelectorAll(
                ".sidebar .python-sidebar-group"
            )
        );

        if (!input) {
            return;
        }

        input.addEventListener("input", function () {
            const query =
                normalizeSearch(input.value);

            let matches = 0;

            links.forEach(function (link) {
                const text = normalizeSearch(
                    (link.dataset.search || "") +
                    " " +
                    link.textContent
                );

                const visible =
                    !query ||
                    text.indexOf(query) !== -1;

                link.classList.toggle(
                    "is-search-hidden",
                    !visible
                );

                if (visible) {
                    matches += 1;
                }
            });

            groups.forEach(
                function (group, index) {
                    if (!query) {
                        group.classList.remove(
                            "is-search-hidden"
                        );
                    } else if (index < 3) {
                        const first =
                            index * 4 + 1;

                        const visible =
                            levelLinks.some(
                                function (link) {
                                    const level =
                                        Number(
                                            link.dataset
                                                .level
                                        );

                                    return (
                                        level >= first &&
                                        level <= first + 3 &&
                                        !link.classList
                                            .contains(
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
                        const practice =
                            document.querySelector(
                                ".python-practice-link"
                            );

                        group.classList.toggle(
                            "is-search-hidden",
                            !practice ||
                            practice.classList
                                .contains(
                                    "is-search-hidden"
                                )
                        );
                    }
                }
            );

            if (empty) {
                empty.hidden =
                    !query || matches > 0;
            }
        });
    }

    function copyText(text, button) {
        const original =
            button.textContent;

        function show(message) {
            button.textContent = message;

            window.setTimeout(function () {
                button.textContent = original;
            }, 1200);
        }

        if (
            navigator.clipboard &&
            navigator.clipboard.writeText
        ) {
            navigator.clipboard
                .writeText(text)
                .then(
                    function () {
                        show("Copied!");
                    },
                    function () {
                        show("Copy Failed");
                    }
                );

            return;
        }

        const area =
            document.createElement("textarea");

        area.value = text;
        area.setAttribute("readonly", "");
        area.style.position = "fixed";
        area.style.opacity = "0";

        document.body.appendChild(area);
        area.select();

        try {
            document.execCommand("copy");
            show("Copied!");
        } catch (error) {
            show("Select & Copy");
        }

        area.remove();
    }

    function initializeCopyButtons() {
        document.querySelectorAll(
            "[data-copy-target]"
        ).forEach(function (button) {
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

    function initializeReveals() {
        document.querySelectorAll(
            "[data-reveal-target]"
        ).forEach(function (button) {
            button.dataset.closedLabel =
                button.textContent;

            button.addEventListener(
                "click",
                function () {
                    const target =
                        document.getElementById(
                            button.dataset
                                .revealTarget
                        );

                    if (!target) {
                        return;
                    }

                    const show = target.hidden;

                    target.hidden = !show;

                    button.setAttribute(
                        "aria-expanded",
                        String(show)
                    );

                    button.textContent = show
                        ? (
                            button.dataset.hideLabel ||
                            "Hide Solution"
                        )
                        : button.dataset
                            .closedLabel;
                }
            );
        });
    }

    function initializeQuiz() {
        const quiz =
            document.querySelector(
                "[data-python-quiz]"
            );

        if (!quiz) {
            return;
        }

        const questions = Array.from(
            quiz.querySelectorAll(
                "[data-correct]"
            )
        );

        const result =
            quiz.querySelector(
                ".python-quiz-result"
            );

        function clear(question) {
            const feedback =
                question.querySelector(
                    ".python-quiz-feedback"
                );

            question.classList.remove(
                "is-correct",
                "is-wrong"
            );

            feedback.hidden = true;
            feedback.textContent = "";
        }

        quiz.querySelector(
            "[data-check-quiz]"
        ).addEventListener("click", function () {
            let score = 0;
            let answered = 0;

            questions.forEach(
                function (question) {
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

                    clear(question);

                    if (selected) {
                        answered += 1;
                    }

                    if (correct) {
                        score += 1;
                    }

                    question.classList.add(
                        correct
                            ? "is-correct"
                            : "is-wrong"
                    );

                    feedback.textContent = correct
                        ? "✓ Correct"
                        : (
                            selected
                                ? "✕ Review the operator rule and try again."
                                : "Please select an answer."
                        );

                    feedback.hidden = false;
                }
            );

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
            } else if (
                score === questions.length
            ) {
                result.textContent =
                    "Excellent! " +
                    score +
                    "/" +
                    questions.length +
                    " — your operator concepts are clear.";
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
                    " — revise precedence and operator meanings, then try again.";
            }
        });

        quiz.querySelector(
            "[data-reset-quiz]"
        ).addEventListener("click", function () {
            questions.forEach(
                function (question) {
                    question.querySelectorAll(
                        "input"
                    ).forEach(function (input) {
                        input.checked = false;
                    });

                    clear(question);
                }
            );

            result.textContent = "";

            questions[0].scrollIntoView({
                behavior: "smooth",
                block: "center"
            });
        });
    }

    function readState() {
        try {
            const value = JSON.parse(
                window.localStorage.getItem(
                    STORAGE_KEY
                ) || "{}"
            );

            return (
                value &&
                typeof value === "object"
            )
                ? value
                : {};
        } catch (error) {
            return {};
        }
    }

    function saveState(state) {
        try {
            window.localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(state)
            );
        } catch (error) {
            /*
             * Continue without persistent
             * browser storage.
             */
        }
    }

    function splitArguments(source) {
        const result = [];

        let current = "";
        let quote = "";
        let escaped = false;
        let depth = 0;

        for (
            let index = 0;
            index < source.length;
            index += 1
        ) {
            const character =
                source[index];

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
            }

            if (character === ")") {
                depth -= 1;
            }

            if (
                character === "," &&
                depth === 0
            ) {
                result.push(
                    current.trim()
                );

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
            result.push(current.trim());
        }

        return result;
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

    function findTopLevelFloorDivision(
        expression
    ) {
        let quote = "";
        let depth = 0;

        for (
            let index = 0;
            index < expression.length - 1;
            index += 1
        ) {
            const character =
                expression[index];

            if (quote) {
                if (
                    character === quote &&
                    expression[index - 1] !== "\\"
                ) {
                    quote = "";
                }

                continue;
            }

            if (
                character === "\"" ||
                character === "'"
            ) {
                quote = character;
                continue;
            }

            if (character === "(") {
                depth += 1;
                continue;
            }

            if (character === ")") {
                depth -= 1;
                continue;
            }

            if (
                depth === 0 &&
                character === "/" &&
                expression[index + 1] === "/"
            ) {
                return index;
            }
        }

        return -1;
    }

    function evaluateExpression(
        source,
        variables,
        inputQueue
    ) {
        let expression = source.trim();

        while (
            expression[0] === "(" &&
            expression[
                expression.length - 1
            ] === ")"
        ) {
            expression = expression
                .slice(1, -1)
                .trim();
        }

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

        if (
            /^input\s*\((.*)\)$/
                .test(expression)
        ) {
            if (!inputQueue.length) {
                throw new Error(
                    "The program requested more input values than the test provides."
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
                        "ValueError: int() requires a whole-number value."
                    );
                }

                const number = Number(value);

                if (!Number.isFinite(number)) {
                    throw new Error(
                        "ValueError: invalid integer."
                    );
                }

                return Math.trunc(number);
            }

            const number = Number(value);

            if (!Number.isFinite(number)) {
                throw new Error(
                    "ValueError: invalid float."
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

        const floorIndex =
            findTopLevelFloorDivision(
                expression
            );

        if (floorIndex !== -1) {
            const left = evaluateExpression(
                expression.slice(
                    0,
                    floorIndex
                ),
                variables,
                inputQueue
            );

            const right = evaluateExpression(
                expression.slice(
                    floorIndex + 2
                ),
                variables,
                inputQueue
            );

            if (
                typeof left !== "number" ||
                typeof right !== "number" ||
                right === 0
            ) {
                throw new Error(
                    "Floor division requires numeric values and a non-zero divisor."
                );
            }

            return Math.floor(left / right);
        }

        let translated = expression.replace(
            /\b[A-Za-z_]\w*\b/g,
            function (name) {
                if (
                    name === "and" ||
                    name === "or" ||
                    name === "not"
                ) {
                    return name;
                }

                if (name === "True") {
                    return "true";
                }

                if (name === "False") {
                    return "false";
                }

                if (name === "None") {
                    return "null";
                }

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

                return JSON.stringify(
                    variables[name]
                );
            }
        );

        translated = translated
            .replace(/\band\b/g, "&&")
            .replace(/\bor\b/g, "||")
            .replace(/\bnot\b/g, "!");

        const stripped = translated
            .replace(
                /\b(?:true|false|null)\b/g,
                ""
            )
            .replace(
                /"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'/g,
                ""
            );

        if (
            !/^[0-9+\-*/%().\s<>=!&|]+$/
                .test(stripped)
        ) {
            throw new Error(
                "This runner supports arithmetic, comparison and logical expressions."
            );
        }

        try {
            return Function(
                "\"use strict\"; return (" +
                translated +
                ");"
            )();
        } catch (error) {
            throw new Error(
                "Check the expression syntax and parentheses."
            );
        }
    }

    function applyAugmented(
        current,
        operator,
        right
    ) {
        if (operator === "+=") {
            return current + right;
        }

        if (operator === "-=") {
            return current - right;
        }

        if (operator === "*=") {
            return current * right;
        }

        if (operator === "/=") {
            return current / right;
        }

        if (operator === "%=") {
            return current % right;
        }

        if (operator === "**=") {
            return current ** right;
        }

        if (operator === "//=") {
            return Math.floor(
                current / right
            );
        }

        throw new Error(
            "Unsupported assignment operator."
        );
    }

    function runOperatorCode(
        source,
        configuredInputs
    ) {
        const variables = {};

        const inputQueue =
            configuredInputs.slice();

        const output = [];

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

                    const augmented = line.match(
                        /^([A-Za-z_]\w*)\s*(\*\*=|\/\/=|\+=|-=|\*=|\/=|%=)\s*(.+)$/
                    );

                    if (augmented) {
                        if (
                            !Object.prototype
                                .hasOwnProperty.call(
                                    variables,
                                    augmented[1]
                                )
                        ) {
                            throw new Error(
                                "NameError: " +
                                augmented[1] +
                                " is not defined."
                            );
                        }

                        variables[augmented[1]] =
                            applyAugmented(
                                variables[
                                    augmented[1]
                                ],
                                augmented[2],
                                evaluateExpression(
                                    augmented[3],
                                    variables,
                                    inputQueue
                                )
                            );

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
                        const values =
                            splitArguments(
                                printMatch[1]
                            ).map(
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
                        ": use a supported assignment or print() statement."
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

    function initializeProblems() {
        const cards = Array.from(
            document.querySelectorAll(
                "[data-python-problem]"
            )
        );

        if (!cards.length) {
            return;
        }

        const state = readState();

        function getState(key) {
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
                    code: problems[key].starter
                };
            }

            return state[key];
        }

        function updateOverall() {
            const keys =
                Object.keys(problems);

            const solved = keys.filter(
                function (key) {
                    return (
                        getState(key).best > 0
                    );
                }
            ).length;

            const completed = keys.filter(
                function (key) {
                    return Boolean(
                        getState(key)
                            .completedWithSolution
                    );
                }
            ).length;

            const total = keys.reduce(
                function (sum, key) {
                    return (
                        sum +
                        Number(
                            getState(key).best ||
                            0
                        )
                    );
                },
                0
            );

            const percent = Math.round(
                (
                    solved + completed
                ) /
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
                total +
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
            const current = getState(
                card.dataset.pythonProblem
            );

            const badge =
                card.querySelector(
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

                badge.classList.add(
                    "completed"
                );
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
                    Number(
                        current.attempts ||
                        0
                    )
                );

            card.querySelector(
                "[data-problem-status]"
            ).textContent =
                current.best > 0
                    ? "Solved"
                    : (
                        current
                            .completedWithSolution
                            ? "Completed with Solution"
                            : (
                                current.attempts
                                    ? "In Progress"
                                    : "Not Solved"
                            )
                    );
        }

        function setTest(
            card,
            passed,
            text
        ) {
            const tests =
                card.querySelector(
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

            label.textContent = text;

            result.textContent =
                passed ? "PASS" : "CHECK";

            row.append(label, result);
            tests.appendChild(row);
        }

        cards.forEach(function (card) {
            const key =
                card.dataset.pythonProblem;

            const config = problems[key];
            const current = getState(key);

            const editor =
                card.querySelector(
                    "[data-problem-code]"
                );

            const output =
                card.querySelector(
                    "[data-problem-output]"
                );

            const workspace =
                card.querySelector(
                    "[data-problem-workspace]"
                );

            const hint =
                card.querySelector(
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
                current.code ||
                config.starter;

            editor.addEventListener(
                "input",
                function () {
                    current.code =
                        editor.value;

                    saveState(state);
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
                            const show =
                                workspace.hidden;

                            workspace.hidden =
                                !show;

                            button.textContent =
                                show
                                    ? "✕ Close Workspace"
                                    : "💻 Solve It Yourself";
                        } else if (
                            action === "hint"
                        ) {
                            const show =
                                hint.hidden;

                            hint.hidden = !show;

                            button.textContent =
                                show
                                    ? "Hide Hint"
                                    : "Hint";

                            if (show) {
                                current.hintViewed =
                                    true;

                                saveState(state);
                            }
                        } else if (
                            action === "solution"
                        ) {
                            const show =
                                solution.hidden;

                            solution.hidden =
                                !show;

                            button.textContent =
                                show
                                    ? "Hide Program"
                                    : "Show Program";

                            if (show) {
                                current.solutionViewed =
                                    true;

                                saveState(state);
                            }
                        } else if (
                            action === "run"
                        ) {
                            const execution =
                                runOperatorCode(
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
                        } else if (
                            action === "check"
                        ) {
                            current.attempts =
                                Number(
                                    current.attempts ||
                                    0
                                ) + 1;

                            const execution =
                                runOperatorCode(
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
                                    current
                                        .solutionViewed
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

                                setTest(
                                    card,
                                    true,
                                    "Sample output matched"
                                );
                            } else {
                                message.textContent =
                                    execution.ok
                                        ? "The program ran, but its output does not exactly match the expected output."
                                        : "Correct the program error and check again.";

                                setTest(
                                    card,
                                    false,
                                    execution.ok
                                        ? "Output mismatch"
                                        : "Program error"
                                );
                            }

                            current.code =
                                editor.value;

                            saveState(state);
                            renderCard(card);
                            updateOverall();
                        } else if (
                            action === "reset"
                        ) {
                            editor.value =
                                config.starter;

                            current.code =
                                config.starter;

                            output.textContent =
                                "Run your program to see the output.";

                            setTest(
                                card,
                                false,
                                "No test checked yet."
                            );

                            const row =
                                card.querySelector(
                                    "[data-problem-tests] > div"
                                );

                            row.className = "";

                            row.querySelector(
                                "strong"
                            ).textContent = "—";

                            message.textContent =
                                "Editor reset. Write your solution and test it again.";

                            saveState(state);
                        }
                    }
                );
            });

            renderCard(card);
        });

        updateOverall();
    }

    function initializePanels() {
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

                    const show = panel.hidden;

                    panel.hidden = !show;

                    button.setAttribute(
                        "aria-expanded",
                        String(show)
                    );

                    button.textContent = show
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

    function setDisabled(
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

    function initializeVisualizer() {
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
                    "1. Read the Complete Expression",
                detail:
                    "Python receives 10 + 2 * 3 ** 2 and identifies the available operators."
            },
            {
                title:
                    "2. Evaluate Exponentiation",
                detail:
                    "Exponentiation has the highest precedence here: 3 ** 2 becomes 9."
            },
            {
                title:
                    "3. Evaluate Multiplication",
                detail:
                    "The expression is now 10 + 2 * 9. Multiplication produces 18."
            },
            {
                title:
                    "4. Evaluate Addition",
                detail:
                    "The remaining expression is 10 + 18, which produces 28."
            },
            {
                title:
                    "5. Use the Final Value",
                detail:
                    "Python stores or displays the completed expression value 28."
            }
        ];

        const steps = Array.from(
            visualizer.querySelectorAll(
                "[data-visual-step]"
            )
        );

        const stepText =
            document.getElementById(
                "pythonOperatorVisualStep"
            );

        const title =
            document.getElementById(
                "pythonOperatorVisualTitle"
            );

        const detail =
            document.getElementById(
                "pythonOperatorVisualDetail"
            );

        const dots =
            document.getElementById(
                "pythonOperatorVisualDots"
            );

        const progress =
            document.getElementById(
                "pythonOperatorVisualProgress"
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

            steps.forEach(
                function (step, stepIndex) {
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

            setDisabled(
                previous,
                index === 0
            );

            setDisabled(next, atEnd);
            setDisabled(auto, atEnd);
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

    function initializeTracer() {
        const tracer =
            document.querySelector(
                "[data-python-tracer]"
            );

        if (!tracer) {
            return;
        }

        const codeLines = [
            "a = 10",
            "b = 3",
            "total = a + b * 2",
            "remainder = total % 4",
            "is_large = total > 15",
            "print(total, remainder, is_large)"
        ];

        const frames = [
            {
                line: 0,
                state: {
                    a: "10",
                    b: "—",
                    total: "—"
                },
                output: "",
                note:
                    "Store integer 10 in a."
            },
            {
                line: 1,
                state: {
                    a: "10",
                    b: "3",
                    total: "—"
                },
                output: "",
                note:
                    "Store integer 3 in b."
            },
            {
                line: 2,
                state: {
                    a: "10",
                    b: "3",
                    expression:
                        "10 + 3 * 2",
                    total: "16"
                },
                output: "",
                note:
                    "Multiply first, then add: 10 + 6 produces 16."
            },
            {
                line: 3,
                state: {
                    total: "16",
                    expression: "16 % 4",
                    remainder: "0"
                },
                output: "",
                note:
                    "Calculate the remainder when 16 is divided by 4."
            },
            {
                line: 4,
                state: {
                    total: "16",
                    remainder: "0",
                    is_large: "True"
                },
                output: "",
                note:
                    "Compare 16 > 15 and store the Boolean result True."
            },
            {
                line: 5,
                state: {
                    total: "16",
                    remainder: "0",
                    is_large: "True"
                },
                output: "16 0 True",
                note:
                    "Display all three values. Program execution is complete."
            }
        ];

        const code =
            document.getElementById(
                "pythonOperatorTraceCode"
            );

        const note =
            document.getElementById(
                "pythonOperatorTraceNote"
            );

        const live =
            document.getElementById(
                "pythonOperatorTraceState"
            );

        const output =
            document.getElementById(
                "pythonOperatorTraceOutput"
            );

        const status =
            document.getElementById(
                "pythonOperatorTraceStatus"
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
                index === frames.length - 1;

            setDisabled(
                previous,
                index < 0
            );

            setDisabled(next, atEnd);
            setDisabled(auto, atEnd);
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
                    frames[index].line
                );
            });

            if (index < 0) {
                note.textContent =
                    "Click Next to begin tracing.";

                live.innerHTML = "";
                output.textContent = "—";

                status.textContent =
                    "Step 0 of " +
                    frames.length;

                updateControls();
                return;
            }

            const frame = frames[index];

            note.textContent = frame.note;

            output.textContent =
                frame.output || "—";

            status.textContent =
                "Step " +
                (index + 1) +
                " of " +
                frames.length;

            live.innerHTML = "";

            Object.keys(frame.state)
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
                            frame.state[name]
                        );

                    item.append(
                        label,
                        value
                    );

                    live.appendChild(item);
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
                            frames.length - 1,
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
                                1400
                            );
                    }

                    render();
                }
            );
        });

        render();
    }

    function initializeLevelThree() {
        initializeSidebarSearch();
        initializeCopyButtons();
        initializeReveals();
        initializeQuiz();
        initializeProblems();
        initializePanels();
        initializeVisualizer();
        initializeTracer();
    }

    if (document.readyState === "loading") {
        document.addEventListener(
            "DOMContentLoaded",
            initializeLevelThree
        );
    } else {
        initializeLevelThree();
    }
}());
