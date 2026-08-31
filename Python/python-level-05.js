(function () {
    "use strict";

    const STORAGE_KEY = "codebhavya.python.level5.practice.v1";
    const MAX_ITERATIONS = 20000;

    const problems = {
        "loops-p1": {
            starter: [
                "# Sample input: 10",
                "n = int(input())",
                "total = 0",
                "# Add every number from 1 through n",
                "print(\"Sum =\", total)"
            ].join("\n"),
            inputs: ["10"],
            expected: "Sum = 55"
        },
        "loops-p2": {
            starter: [
                "# Sample input: 7",
                "number = int(input())",
                "# Display the table from 1 through 10",
                "print(\"Write your loop\")"
            ].join("\n"),
            inputs: ["7"],
            expected: [
                "7 x 1 = 7",
                "7 x 2 = 14",
                "7 x 3 = 21",
                "7 x 4 = 28",
                "7 x 5 = 35",
                "7 x 6 = 42",
                "7 x 7 = 49",
                "7 x 8 = 56",
                "7 x 9 = 63",
                "7 x 10 = 70"
            ].join("\n")
        },
        "loops-p3": {
            starter: [
                "# Sample input: 50821",
                "number = int(input())",
                "count = 0",
                "# Use a while loop to remove one digit at a time",
                "print(\"Digits =\", count)"
            ].join("\n"),
            inputs: ["50821"],
            expected: "Digits = 5"
        },
        "loops-p4": {
            starter: [
                "# Sample input: 5",
                "n = int(input())",
                "factorial = 1",
                "# Multiply factorial by every value from 1 through n",
                "print(\"Factorial =\", factorial)"
            ].join("\n"),
            inputs: ["5"],
            expected: "Factorial = 120"
        },
        "loops-p5": {
            starter: [
                "# Sample input: 4",
                "rows = int(input())",
                "stars = \"\"",
                "# Add one star and print each new row",
                "print(\"Write your loop\")"
            ].join("\n"),
            inputs: ["4"],
            expected: "*\n**\n***\n****"
        }
    };

    function normalizeSearch(value) {
        return value.toLowerCase()
            .replace(/[–—&]/g, " ")
            .replace(/[^a-z0-9+# ]/g, " ")
            .replace(/\s+/g, " ")
            .trim();
    }

    function initializeSidebarSearch() {
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

            groups.forEach(function (group, index) {
                if (!query) {
                    group.classList.remove(
                        "is-search-hidden"
                    );
                } else if (index < 3) {
                    const first = index * 4 + 1;

                    const visible = levelLinks.some(
                        function (link) {
                            const level = Number(
                                link.dataset.level
                            );

                            return level >= first &&
                                level <= first + 3 &&
                                !link.classList.contains(
                                    "is-search-hidden"
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
                        practice.classList.contains(
                            "is-search-hidden"
                        )
                    );
                }
            });

            if (empty) {
                empty.hidden =
                    !query ||
                    matches > 0;
            }
        });
    }

    function copyText(value, button) {
        const original = button.textContent;

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
            navigator.clipboard.writeText(value).then(
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

        area.value = value;
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
                            button.dataset.revealTarget
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
                            "Hide Answer"
                        )
                        : button.dataset.closedLabel;
                }
            );
        });
    }

    function initializeQuiz() {
        const quiz = document.querySelector(
            "[data-python-quiz]"
        );

        if (!quiz) {
            return;
        }

        const questions = Array.from(
            quiz.querySelectorAll("[data-correct]")
        );
        const result = quiz.querySelector(
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
                            ? "✕ Review the loop rule and try again."
                            : "Please select an answer."
                    );

                feedback.hidden = false;
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
            } else if (
                score === questions.length
            ) {
                result.textContent =
                    "Excellent! " +
                    score +
                    "/" +
                    questions.length +
                    " — your loop concepts are clear.";
            } else if (
                score >=
                Math.ceil(questions.length * 0.6)
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
                    " — revise ranges, updates and " +
                    "loop control, then try again.";
            }
        });

        quiz.querySelector(
            "[data-reset-quiz]"
        ).addEventListener("click", function () {
            questions.forEach(function (question) {
                question.querySelectorAll("input")
                    .forEach(function (input) {
                        input.checked = false;
                    });

                clear(question);
            });

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

            return value &&
                typeof value === "object"
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
            /* Continue without persistent storage. */
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
            }

            if (character === ")") {
                depth -= 1;
            }

            if (
                character === "," &&
                depth === 0
            ) {
                result.push(current.trim());
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
            (quote !== "\"" && quote !== "'") ||
            value[value.length - 1] !== quote
        ) {
            return null;
        }

        return value.slice(1, -1)
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

    function stripOuterParentheses(source) {
        let expression = source.trim();
        let repeat = true;

        while (
            repeat &&
            expression[0] === "(" &&
            expression[
                expression.length - 1
            ] === ")"
        ) {
            repeat = false;

            let quote = "";
            let depth = 0;

            for (
                let index = 0;
                index < expression.length;
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
                }

                if (character === ")") {
                    depth -= 1;
                }

                if (
                    depth === 0 &&
                    index < expression.length - 1
                ) {
                    break;
                }

                if (
                    index === expression.length - 1 &&
                    depth === 0
                ) {
                    repeat = true;
                }
            }

            if (repeat) {
                expression =
                    expression.slice(1, -1).trim();
            }
        }

        return expression;
    }

    function findFloorDivision(expression) {
        let quote = "";
        let depth = 0;

        for (
            let index = expression.length - 2;
            index >= 0;
            index -= 1
        ) {
            const character = expression[index];

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

            if (character === ")") {
                depth += 1;
                continue;
            }

            if (character === "(") {
                depth -= 1;
                continue;
            }

            if (
                depth === 0 &&
                expression.slice(
                    index,
                    index + 2
                ) === "//"
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
        const expression =
            stripOuterParentheses(source);

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
            /^input\s*\((.*)\)$/.test(expression)
        ) {
            if (!inputQueue.length) {
                throw new Error(
                    "The program requested more input " +
                    "values than the test provides."
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
                    !/^[+-]?\d+$/.test(value.trim())
                ) {
                    throw new Error(
                        "ValueError: int() requires " +
                        "a whole-number value."
                    );
                }

                const integer = Number(value);

                if (!Number.isFinite(integer)) {
                    throw new Error(
                        "ValueError: invalid integer."
                    );
                }

                return Math.trunc(integer);
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
            findFloorDivision(expression);

        if (floorIndex !== -1) {
            const left = evaluateExpression(
                expression.slice(0, floorIndex),
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
                    "Floor division requires numeric " +
                    "values and a non-zero divisor."
                );
            }

            return Math.floor(left / right);
        }

        let translated = expression.replace(
            /\b[A-Za-z_]\w*\b/g,
            function (name) {
                if (
                    [
                        "and",
                        "or",
                        "not",
                        "is"
                    ].indexOf(name) !== -1
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
            .replace(/\bis\s+not\b/g, "!==")
            .replace(/\bis\b/g, "===")
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
                "This runner supports values, arithmetic, " +
                "comparisons and logical conditions."
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
                "Check the expression syntax " +
                "and parentheses."
            );
        }
    }

    function removeInlineComment(source) {
        let quote = "";

        for (
            let index = 0;
            index < source.length;
            index += 1
        ) {
            const character = source[index];

            if (quote) {
                if (
                    character === quote &&
                    source[index - 1] !== "\\"
                ) {
                    quote = "";
                }
            } else if (
                character === "\"" ||
                character === "'"
            ) {
                quote = character;
            } else if (character === "#") {
                return source
                    .slice(0, index)
                    .replace(/\s+$/, "");
            }
        }

        return source.replace(/\s+$/, "");
    }

    function prepareRecords(source) {
        const records = [];

        source.replace(/\r/g, "")
            .split("\n")
            .forEach(function (raw, index) {
                const expanded = raw.replace(
                    /^\t+/,
                    function (tabs) {
                        return "    ".repeat(
                            tabs.length
                        );
                    }
                );
                const clean =
                    removeInlineComment(expanded);

                if (!clean.trim()) {
                    return;
                }

                const indent =
                    clean.match(/^ */)[0].length;

                if (indent % 4 !== 0) {
                    throw new Error(
                        "Line " +
                        (index + 1) +
                        ": use indentation in groups " +
                        "of four spaces."
                    );
                }

                records.push({
                    text: clean.trim(),
                    indent: indent,
                    line: index + 1
                });
            });

        return records;
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
            return Math.floor(current / right);
        }

        throw new Error(
            "Unsupported assignment operator."
        );
    }

    function executeStatement(record, context) {
        const line = record.text;

        if (line === "pass") {
            return;
        }

        const printMatch = line.match(
            /^print\s*\(([\s\S]*)\)\s*$/
        );

        if (printMatch) {
            const values =
                splitArguments(printMatch[1])
                    .map(function (part) {
                        return displayValue(
                            evaluateExpression(
                                part,
                                context.variables,
                                context.inputs
                            )
                        );
                    });

            context.output.push(
                values.join(" ")
            );

            return;
        }

        const augmented = line.match(
            /^([A-Za-z_]\w*)\s*(\*\*=|\/\/=|\+=|-=|\*=|\/=|%=)\s*(.+)$/
        );

        if (augmented) {
            if (
                !Object.prototype
                    .hasOwnProperty.call(
                        context.variables,
                        augmented[1]
                    )
            ) {
                throw new Error(
                    "NameError: " +
                    augmented[1] +
                    " is not defined."
                );
            }

            context.variables[augmented[1]] =
                applyAugmented(
                    context.variables[
                        augmented[1]
                    ],
                    augmented[2],
                    evaluateExpression(
                        augmented[3],
                        context.variables,
                        context.inputs
                    )
                );

            return;
        }

        const assignment = line.match(
            /^([A-Za-z_]\w*)\s*=\s*(.+)$/
        );

        if (assignment) {
            context.variables[assignment[1]] =
                evaluateExpression(
                    assignment[2],
                    context.variables,
                    context.inputs
                );

            return;
        }

        throw new Error(
            "Line " +
            record.line +
            ": use a supported assignment, print(), " +
            "decision or loop statement."
        );
    }

    function getBody(
        records,
        cursor,
        end,
        indent
    ) {
        const bodyStart = cursor + 1;

        if (
            bodyStart >= end ||
            records[bodyStart].indent <= indent
        ) {
            throw new Error(
                "Line " +
                records[cursor].line +
                ": this block needs at least one " +
                "indented statement."
            );
        }

        let bodyEnd = bodyStart;

        while (
            bodyEnd < end &&
            records[bodyEnd].indent > indent
        ) {
            bodyEnd += 1;
        }

        return {
            start: bodyStart,
            end: bodyEnd,
            indent: records[bodyStart].indent
        };
    }

    function parseDecisionHeader(
        record,
        first
    ) {
        let match;

        if (first) {
            match = record.text.match(
                /^if\s+(.+)\s*:\s*$/
            );

            return match
                ? {
                    type: "if",
                    condition: match[1]
                }
                : null;
        }

        match = record.text.match(
            /^elif\s+(.+)\s*:\s*$/
        );

        if (match) {
            return {
                type: "elif",
                condition: match[1]
            };
        }

        if (
            /^else\s*:\s*$/.test(record.text)
        ) {
            return {
                type: "else",
                condition: null
            };
        }

        return null;
    }

    function makeRange(
        argumentsSource,
        context
    ) {
        const parts =
            splitArguments(argumentsSource);

        if (
            parts.length < 1 ||
            parts.length > 3 ||
            (
                parts.length === 1 &&
                !parts[0]
            )
        ) {
            throw new Error(
                "range() expects one, two or " +
                "three integer arguments."
            );
        }

        const numbers = parts.map(
            function (part) {
                const value = evaluateExpression(
                    part,
                    context.variables,
                    context.inputs
                );

                if (!Number.isInteger(value)) {
                    throw new Error(
                        "range() arguments must be integers."
                    );
                }

                return value;
            }
        );

        let start = 0;
        let stop = numbers[0];
        let step = 1;

        if (numbers.length >= 2) {
            start = numbers[0];
            stop = numbers[1];
        }

        if (numbers.length === 3) {
            step = numbers[2];
        }

        if (step === 0) {
            throw new Error(
                "ValueError: range() step cannot be zero."
            );
        }

        const values = [];

        for (
            let value = start;
            step > 0
                ? value < stop
                : value > stop;
            value += step
        ) {
            values.push(value);

            if (
                values.length > MAX_ITERATIONS
            ) {
                throw new Error(
                    "The generated range is too large " +
                    "for this practice runner."
                );
            }
        }

        return values;
    }

    function executeRange(
        records,
        start,
        end,
        indent,
        context
    ) {
        let cursor = start;

        while (cursor < end) {
            const record = records[cursor];

            if (record.indent < indent) {
                return {
                    cursor: cursor,
                    signal: null
                };
            }

            if (record.indent > indent) {
                throw new Error(
                    "Line " +
                    record.line +
                    ": unexpected indentation."
                );
            }

            if (
                record.text === "break" ||
                record.text === "continue"
            ) {
                return {
                    cursor: cursor + 1,
                    signal: record.text
                };
            }

            const decision =
                parseDecisionHeader(
                    record,
                    true
                );

            if (decision) {
                const branches = [];
                let branchCursor = cursor;
                let first = true;

                while (branchCursor < end) {
                    const headerRecord =
                        records[branchCursor];

                    if (
                        headerRecord.indent !== indent
                    ) {
                        break;
                    }

                    const header =
                        parseDecisionHeader(
                            headerRecord,
                            first
                        );

                    if (!header) {
                        break;
                    }

                    const body = getBody(
                        records,
                        branchCursor,
                        end,
                        indent
                    );

                    branches.push({
                        header: header,
                        body: body
                    });

                    branchCursor = body.end;
                    first = false;

                    if (header.type === "else") {
                        break;
                    }
                }

                let selected = null;

                for (
                    let index = 0;
                    index < branches.length;
                    index += 1
                ) {
                    const branch =
                        branches[index];

                    if (
                        branch.header.type === "else" ||
                        Boolean(
                            evaluateExpression(
                                branch.header.condition,
                                context.variables,
                                context.inputs
                            )
                        )
                    ) {
                        selected = branch;
                        break;
                    }
                }

                if (selected) {
                    const result = executeRange(
                        records,
                        selected.body.start,
                        selected.body.end,
                        selected.body.indent,
                        context
                    );

                    if (result.signal) {
                        return result;
                    }
                }

                cursor = branchCursor;
                continue;
            }

            const forMatch = record.text.match(
                /^for\s+([A-Za-z_]\w*)\s+in\s+range\s*\(([\s\S]*)\)\s*:\s*$/
            );

            if (forMatch) {
                const body = getBody(
                    records,
                    cursor,
                    end,
                    indent
                );
                const values = makeRange(
                    forMatch[2],
                    context
                );

                for (
                    let index = 0;
                    index < values.length;
                    index += 1
                ) {
                    context.iterations += 1;

                    if (
                        context.iterations >
                        MAX_ITERATIONS
                    ) {
                        throw new Error(
                            "Loop stopped: the iteration " +
                            "safety limit was reached."
                        );
                    }

                    context.variables[
                        forMatch[1]
                    ] = values[index];

                    const result = executeRange(
                        records,
                        body.start,
                        body.end,
                        body.indent,
                        context
                    );

                    if (
                        result.signal === "break"
                    ) {
                        break;
                    }

                    if (
                        result.signal === "continue"
                    ) {
                        continue;
                    }
                }

                cursor = body.end;
                continue;
            }

            const whileMatch =
                record.text.match(
                    /^while\s+(.+)\s*:\s*$/
                );

            if (whileMatch) {
                const body = getBody(
                    records,
                    cursor,
                    end,
                    indent
                );

                while (
                    Boolean(
                        evaluateExpression(
                            whileMatch[1],
                            context.variables,
                            context.inputs
                        )
                    )
                ) {
                    context.iterations += 1;

                    if (
                        context.iterations >
                        MAX_ITERATIONS
                    ) {
                        throw new Error(
                            "Loop stopped: check whether " +
                            "the while condition can become false."
                        );
                    }

                    const result = executeRange(
                        records,
                        body.start,
                        body.end,
                        body.indent,
                        context
                    );

                    if (
                        result.signal === "break"
                    ) {
                        break;
                    }

                    if (
                        result.signal === "continue"
                    ) {
                        continue;
                    }
                }

                cursor = body.end;
                continue;
            }

            if (
                /^(elif|else)\b/.test(
                    record.text
                )
            ) {
                throw new Error(
                    "Line " +
                    record.line +
                    ": this branch has no matching " +
                    "if statement."
                );
            }

            executeStatement(record, context);
            cursor += 1;
        }

        return {
            cursor: cursor,
            signal: null
        };
    }

    function runLoopCode(
        source,
        configuredInputs
    ) {
        const context = {
            variables: {},
            inputs: configuredInputs.slice(),
            output: [],
            iterations: 0
        };

        try {
            const records =
                prepareRecords(source);

            if (
                records.length &&
                records[0].indent !== 0
            ) {
                throw new Error(
                    "Line " +
                    records[0].line +
                    ": the program must start at " +
                    "indentation level zero."
                );
            }

            const result = executeRange(
                records,
                0,
                records.length,
                0,
                context
            );

            if (result.signal) {
                throw new Error(
                    result.signal +
                    " can be used only inside a loop."
                );
            }

            return {
                ok: true,
                output: context.output.join("\n"),
                variables: context.variables
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
            const keys = Object.keys(problems);

            const solved = keys.filter(
                function (key) {
                    return getState(key).best > 0;
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
                    return sum +
                        Number(
                            getState(key).best || 0
                        );
                },
                0
            );

            const percent = Math.round(
                (
                    solved +
                    completed
                ) /
                keys.length *
                100
            );

            document.getElementById(
                "pythonPracticeSolved"
            ).textContent =
                solved +
                " / " +
                keys.length;

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

        function setTest(
            card,
            passed,
            labelText
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

            row.className = passed
                ? "pass"
                : "fail";

            label.textContent = labelText;
            result.textContent = passed
                ? "PASS"
                : "CHECK";

            row.append(label, result);
            tests.appendChild(row);
        }

        cards.forEach(function (card) {
            const key =
                card.dataset.pythonProblem;
            const config = problems[key];
            const current = getState(key);

            const editor = card.querySelector(
                "[data-problem-code]"
            );
            const output = card.querySelector(
                "[data-problem-output]"
            );
            const workspace = card.querySelector(
                "[data-problem-workspace]"
            );
            const hint = card.querySelector(
                "[data-problem-hint]"
            );
            const solution = card.querySelector(
                "[data-problem-solution]"
            );
            const message = card.querySelector(
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
                            button.dataset.problemAction;

                        if (action === "toggle") {
                            const show =
                                workspace.hidden;

                            workspace.hidden = !show;

                            button.textContent = show
                                ? "✕ Close Workspace"
                                : "💻 Solve It Yourself";
                        } else if (
                            action === "hint"
                        ) {
                            const show =
                                hint.hidden;

                            hint.hidden = !show;

                            button.textContent = show
                                ? "Hide Hint"
                                : "Hint";

                            if (show) {
                                current.hintViewed = true;
                                saveState(state);
                            }
                        } else if (
                            action === "solution"
                        ) {
                            const show =
                                solution.hidden;

                            solution.hidden = !show;

                            button.textContent = show
                                ? "Hide Program"
                                : "Show Program";

                            if (show) {
                                current.solutionViewed = true;
                                saveState(state);
                            }
                        } else if (
                            action === "run"
                        ) {
                            const execution =
                                runLoopCode(
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
                                    ? "Program executed using " +
                                      "the displayed sample input."
                                    : "Fix the displayed error, " +
                                      "then run the program again.";
                        } else if (
                            action === "check"
                        ) {
                            current.attempts =
                                Number(
                                    current.attempts || 0
                                ) + 1;

                            const execution =
                                runLoopCode(
                                    editor.value,
                                    config.inputs
                                );

                            const passed =
                                execution.ok &&
                                execution.output.trim() ===
                                config.expected.trim();

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
                                        "✓ Correct output. " +
                                        "Completed after studying " +
                                        "the solution.";
                                } else {
                                    const earned =
                                        current.hintViewed
                                            ? 90
                                            : 100;

                                    current.best = Math.max(
                                        Number(
                                            current.best || 0
                                        ),
                                        earned
                                    );

                                    message.textContent =
                                        "✓ Excellent! Output matched. " +
                                        "Score: " +
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
                                        ? "The program ran, but " +
                                          "its output does not " +
                                          "exactly match the " +
                                          "expected output."
                                        : "Correct the program " +
                                          "error and check again.";

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
                                "Run your program to " +
                                "see the output.";

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
                                "Editor reset. Write your " +
                                "solution and test it again.";

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

    function setDisabled(button, disabled) {
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
                title: "1. Create the Sequence",
                detail:
                    "range(1, 4) prepares the values " +
                    "1, 2 and 3. The stop value 4 is excluded."
            },
            {
                title: "2. Take the First Value",
                detail:
                    "Python assigns 1 to number and enters " +
                    "the indented loop body."
            },
            {
                title: "3. Execute the Loop Body",
                detail:
                    "The statements inside the loop use " +
                    "the current value number = 1."
            },
            {
                title: "4. Repeat with Remaining Values",
                detail:
                    "Python assigns 2 and then 3, executing " +
                    "the body once for each value."
            },
            {
                title: "5. Finish the Loop",
                detail:
                    "No values remain. Python leaves the loop " +
                    "and continues with the next unindented statement."
            }
        ];

        const steps = Array.from(
            visualizer.querySelectorAll(
                "[data-visual-step]"
            )
        );

        const stepText =
            document.getElementById(
                "pythonLoopVisualStep"
            );
        const title =
            document.getElementById(
                "pythonLoopVisualTitle"
            );
        const detail =
            document.getElementById(
                "pythonLoopVisualDetail"
            );
        const dots =
            document.getElementById(
                "pythonLoopVisualDots"
            );
        const progress =
            document.getElementById(
                "pythonLoopVisualProgress"
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

            title.textContent = frame.title;
            detail.textContent = frame.detail;

            progress.style.width =
                (
                    (index + 1) /
                    frames.length *
                    100
                ) + "%";

            steps.forEach(function (
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
            });

            dots.innerHTML = "";

            frames.forEach(function (
                _,
                dotIndex
            ) {
                const dot =
                    document.createElement("i");

                dot.classList.toggle(
                    "active",
                    dotIndex === index
                );

                dots.appendChild(dot);
            });

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
                        button.dataset.visualAction;

                    if (action !== "auto") {
                        stop();
                    }

                    if (action === "previous") {
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
                        timer = window.setInterval(
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
            "total = 0",
            "for number in range(1, 4):",
            "    total += number",
            "    print(\"Added\", number)",
            "print(\"Total =\", total)"
        ];

        const frames = [
            {
                line: 0,
                state: {
                    total: "0",
                    number: "—"
                },
                output: "",
                note:
                    "Initialize the accumulator total to zero."
            },
            {
                line: 1,
                state: {
                    total: "0",
                    range: "1, 2, 3"
                },
                output: "",
                note:
                    "Prepare the range and assign its first " +
                    "value to number."
            },
            {
                line: 2,
                state: {
                    number: "1",
                    total: "1"
                },
                output: "Added 1",
                note:
                    "Iteration 1: add 1 to total and display " +
                    "the current number."
            },
            {
                line: 2,
                state: {
                    number: "2",
                    total: "3"
                },
                output:
                    "Added 1\nAdded 2",
                note:
                    "Iteration 2: add 2. The running total becomes 3."
            },
            {
                line: 2,
                state: {
                    number: "3",
                    total: "6"
                },
                output:
                    "Added 1\nAdded 2\nAdded 3",
                note:
                    "Iteration 3: add 3. The running total becomes 6."
            },
            {
                line: 1,
                state: {
                    number: "3",
                    total: "6",
                    range: "exhausted"
                },
                output:
                    "Added 1\nAdded 2\nAdded 3",
                note:
                    "No range values remain, so Python exits the loop."
            },
            {
                line: 4,
                state: {
                    number: "3",
                    total: "6"
                },
                output:
                    "Added 1\n" +
                    "Added 2\n" +
                    "Added 3\n" +
                    "Total = 6",
                note:
                    "Display the completed total. " +
                    "Program execution is complete."
            }
        ];

        const code =
            document.getElementById(
                "pythonLoopTraceCode"
            );
        const note =
            document.getElementById(
                "pythonLoopTraceNote"
            );
        const live =
            document.getElementById(
                "pythonLoopTraceState"
            );
        const output =
            document.getElementById(
                "pythonLoopTraceOutput"
            );
        const status =
            document.getElementById(
                "pythonLoopTraceStatus"
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

        codeLines.forEach(function (
            line,
            lineIndex
        ) {
            const row =
                document.createElement("span");

            row.dataset.traceLine =
                String(lineIndex);

            row.textContent =
                String(lineIndex + 1)
                    .padStart(2, "0") +
                "  " +
                line;

            code.appendChild(row);
        });

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
                    ) === frames[index].line
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
                        document.createElement("div");
                    const label =
                        document.createElement("strong");
                    const value =
                        document.createElement("span");

                    label.textContent = name;
                    value.textContent =
                        String(frame.state[name]);

                    item.append(label, value);
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
                        button.dataset.traceAction;

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
                        timer = window.setInterval(
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

    function initializeLevelFive() {
        initializeSidebarSearch();
        initializeCopyButtons();
        initializeReveals();
        initializeQuiz();
        initializeProblems();
        initializePanels();
        initializeVisualizer();
        initializeTracer();
    }

    window.CodeBhavyaLoopRunner =
        runLoopCode;

    if (document.readyState === "loading") {
        document.addEventListener(
            "DOMContentLoaded",
            initializeLevelFive
        );
    } else {
        initializeLevelFive();
    }
}());
