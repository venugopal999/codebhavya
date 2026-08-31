(function () {
    "use strict";

    const STORAGE_KEY = "codebhavya.python.level4.practice.v1";

    const problems = {
        "decision-p1": {
            starter: [
                "# Sample input: 0",
                "number = int(input())",
                "# Write an if / elif / else decision below",
                "print(\"Change this output\")"
            ].join("\n"),
            inputs: ["0"],
            expected: "Zero"
        },
        "decision-p2": {
            starter: [
                "# Sample input: 27",
                "number = int(input())",
                "# Decide whether number is even or odd",
                "print(\"Change this output\")"
            ].join("\n"),
            inputs: ["27"],
            expected: "Odd"
        },
        "decision-p3": {
            starter: [
                "# Sample input: 86",
                "mark = int(input())",
                "grade = \"?\"",
                "# Replace ? using an ordered decision chain",
                "print(\"Grade =\", grade)"
            ].join("\n"),
            inputs: ["86"],
            expected: "Grade = B"
        },
        "decision-p4": {
            starter: [
                "# Sample inputs: 18, 42 and 31",
                "a = int(input())",
                "b = int(input())",
                "c = int(input())",
                "largest = 0",
                "# Compare the three values",
                "print(\"Largest =\", largest)"
            ].join("\n"),
            inputs: ["18", "42", "31"],
            expected: "Largest = 42"
        },
        "decision-p5": {
            starter: [
                "# Sample inputs: age 20, percentage 72, backlogs 0",
                "age = int(input())",
                "percentage = int(input())",
                "backlogs = int(input())",
                "# Print Eligible only when every requirement is met",
                "print(\"Change this output\")"
            ].join("\n"),
            inputs: ["20", "72", "0"],
            expected: "Eligible"
        }
    };

    function normalizeSearch(value) {
        return value.toLowerCase().replace(/[–—&]/g, " ")
            .replace(/[^a-z0-9+# ]/g, " ").replace(/\s+/g, " ").trim();
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
            document.querySelectorAll(".sidebar .python-sidebar-group")
        );

        if (!input) {
            return;
        }

        input.addEventListener("input", function () {
            const query = normalizeSearch(input.value);
            let matches = 0;

            links.forEach(function (link) {
                const text = normalizeSearch(
                    (link.dataset.search || "") + " " + link.textContent
                );
                const visible = !query || text.indexOf(query) !== -1;

                link.classList.toggle("is-search-hidden", !visible);

                if (visible) {
                    matches += 1;
                }
            });

            groups.forEach(function (group, index) {
                if (!query) {
                    group.classList.remove("is-search-hidden");
                } else if (index < 3) {
                    const first = index * 4 + 1;
                    const visible = levelLinks.some(function (link) {
                        const level = Number(link.dataset.level);

                        return level >= first &&
                            level <= first + 3 &&
                            !link.classList.contains("is-search-hidden");
                    });

                    group.classList.toggle(
                        "is-search-hidden",
                        !visible
                    );
                } else {
                    const practice = document.querySelector(
                        ".python-practice-link"
                    );

                    group.classList.toggle(
                        "is-search-hidden",
                        !practice ||
                        practice.classList.contains("is-search-hidden")
                    );
                }
            });

            if (empty) {
                empty.hidden = !query || matches > 0;
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

        if (navigator.clipboard && navigator.clipboard.writeText) {
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

        const area = document.createElement("textarea");

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
        document.querySelectorAll("[data-copy-target]")
            .forEach(function (button) {
                button.addEventListener("click", function () {
                    const target = document.getElementById(
                        button.dataset.copyTarget
                    );

                    if (target) {
                        copyText(target.textContent, button);
                    }
                });
            });
    }

    function initializeReveals() {
        document.querySelectorAll("[data-reveal-target]")
            .forEach(function (button) {
                button.dataset.closedLabel = button.textContent;

                button.addEventListener("click", function () {
                    const target = document.getElementById(
                        button.dataset.revealTarget
                    );

                    if (!target) {
                        return;
                    }

                    const show = target.hidden;

                    target.hidden = !show;
                    button.setAttribute("aria-expanded", String(show));
                    button.textContent = show
                        ? (button.dataset.hideLabel || "Hide Solution")
                        : button.dataset.closedLabel;
                });
            });
    }

    function initializeQuiz() {
        const quiz = document.querySelector("[data-python-quiz]");

        if (!quiz) {
            return;
        }

        const questions = Array.from(
            quiz.querySelectorAll("[data-correct]")
        );
        const result = quiz.querySelector(".python-quiz-result");

        function clear(question) {
            const feedback = question.querySelector(
                ".python-quiz-feedback"
            );

            question.classList.remove("is-correct", "is-wrong");
            feedback.hidden = true;
            feedback.textContent = "";
        }

        quiz.querySelector("[data-check-quiz]")
            .addEventListener("click", function () {
                let score = 0;
                let answered = 0;

                questions.forEach(function (question) {
                    const selected = question.querySelector(
                        "input:checked"
                    );
                    const feedback = question.querySelector(
                        ".python-quiz-feedback"
                    );
                    const correct = Boolean(
                        selected &&
                        selected.value === question.dataset.correct
                    );

                    clear(question);

                    if (selected) {
                        answered += 1;
                    }

                    if (correct) {
                        score += 1;
                    }

                    question.classList.add(
                        correct ? "is-correct" : "is-wrong"
                    );

                    feedback.textContent = correct
                        ? "✓ Correct"
                        : (
                            selected
                                ? "✕ Review the decision rule and try again."
                                : "Please select an answer."
                        );

                    feedback.hidden = false;
                });

                if (answered < questions.length) {
                    result.textContent =
                        "Answered " + answered +
                        " of " + questions.length +
                        ". Score: " + score +
                        "/" + questions.length;
                } else if (score === questions.length) {
                    result.textContent =
                        "Excellent! " + score +
                        "/" + questions.length +
                        " — your decision-making concepts are clear.";
                } else if (
                    score >= Math.ceil(questions.length * 0.6)
                ) {
                    result.textContent =
                        "Good work! " + score +
                        "/" + questions.length +
                        " — review the marked question(s).";
                } else {
                    result.textContent =
                        "Score: " + score +
                        "/" + questions.length +
                        " — revise branch order, indentation and " +
                        "boundaries, then try again.";
                }
            });

        quiz.querySelector("[data-reset-quiz]")
            .addEventListener("click", function () {
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
                window.localStorage.getItem(STORAGE_KEY) || "{}"
            );

            return value && typeof value === "object"
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
            /* Exercises continue without persistent storage. */
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
        let changed = true;

        while (
            changed &&
            expression[0] === "(" &&
            expression[expression.length - 1] === ")"
        ) {
            changed = false;

            let depth = 0;
            let quote = "";

            for (
                let index = 0;
                index < expression.length;
                index += 1
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
                    changed = true;
                }
            }

            if (changed) {
                expression = expression.slice(1, -1).trim();
            }
        }

        return expression;
    }

    function findTopLevelOperator(
        expression,
        operators,
        rightToLeft
    ) {
        let quote = "";
        let depth = 0;
        const indices = [];

        for (
            let index = 0;
            index < expression.length;
            index += 1
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

            if (character === "(") {
                depth += 1;
                continue;
            }

            if (character === ")") {
                depth -= 1;
                continue;
            }

            if (depth !== 0) {
                continue;
            }

            operators.forEach(function (operator) {
                if (
                    expression.slice(
                        index,
                        index + operator.length
                    ) === operator
                ) {
                    indices.push({
                        index: index,
                        operator: operator
                    });
                }
            });
        }

        if (!indices.length) {
            return null;
        }

        return rightToLeft
            ? indices[0]
            : indices[indices.length - 1];
    }

    function evaluateExpression(
        source,
        variables,
        inputQueue
    ) {
        const expression = stripOuterParentheses(source);

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

        const stringValue = decodeString(expression);

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

        if (/^input\s*\((.*)\)$/.test(expression)) {
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
                    !/^[+-]?\d+$/.test(value.trim())
                ) {
                    throw new Error(
                        "ValueError: int() requires a whole-number value."
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
                !Object.prototype.hasOwnProperty.call(
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
            /^[+-]?(?:\d+\.?\d*|\.\d+)$/.test(expression)
        ) {
            return Number(expression);
        }

        let translated = expression.replace(
            /\b[A-Za-z_]\w*\b/g,
            function (name) {
                if (
                    ["and", "or", "not", "in", "is"]
                        .indexOf(name) !== -1
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
                    !Object.prototype.hasOwnProperty.call(
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

                return JSON.stringify(variables[name]);
            }
        );

        translated = translated
            .replace(/\bis\s+not\b/g, "!==")
            .replace(/\bis\b/g, "===")
            .replace(/\band\b/g, "&&")
            .replace(/\bor\b/g, "||")
            .replace(/\bnot\b/g, "!");

        if (/\bin\b/.test(translated)) {
            throw new Error(
                "This practice runner does not require the in operator."
            );
        }

        const floor = findTopLevelOperator(
            translated,
            ["//"],
            false
        );

        if (floor) {
            const left = evaluateExpression(
                expression.slice(0, floor.index),
                variables,
                inputQueue
            );
            const right = evaluateExpression(
                expression.slice(floor.index + 2),
                variables,
                inputQueue
            );

            if (
                typeof left !== "number" ||
                typeof right !== "number" ||
                right === 0
            ) {
                throw new Error(
                    "Floor division requires numbers and " +
                    "a non-zero divisor."
                );
            }

            return Math.floor(left / right);
        }

        const stripped = translated
            .replace(/\b(?:true|false|null)\b/g, "")
            .replace(
                /"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'/g,
                ""
            );

        if (
            !/^[0-9+\-*/%().\s<>=!&|]+$/.test(stripped)
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
                "Check the expression syntax and parentheses."
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
                        return "    ".repeat(tabs.length);
                    }
                );
                const withoutComment =
                    removeInlineComment(expanded);

                if (!withoutComment.trim()) {
                    return;
                }

                const indent =
                    withoutComment.match(/^ */)[0].length;

                if (indent % 4 !== 0) {
                    throw new Error(
                        "Line " +
                        (index + 1) +
                        ": use indentation in groups of four spaces."
                    );
                }

                records.push({
                    text: withoutComment.trim(),
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
            const values = splitArguments(printMatch[1])
                .map(function (part) {
                    return displayValue(
                        evaluateExpression(
                            part,
                            context.variables,
                            context.inputs
                        )
                    );
                });

            context.output.push(values.join(" "));
            return;
        }

        const augmented = line.match(
            /^([A-Za-z_]\w*)\s*(\*\*=|\/\/=|\+=|-=|\*=|\/=|%=)\s*(.+)$/
        );

        if (augmented) {
            if (
                !Object.prototype.hasOwnProperty.call(
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
                    context.variables[augmented[1]],
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
            "pass or decision statement."
        );
    }

    function parseHeader(record, first) {
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

        if (/^else\s*:\s*$/.test(record.text)) {
            return {
                type: "else",
                condition: null
            };
        }

        return null;
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
                return cursor;
            }

            if (record.indent > indent) {
                throw new Error(
                    "Line " +
                    record.line +
                    ": unexpected indentation."
                );
            }

            const firstHeader = parseHeader(record, true);

            if (!firstHeader) {
                if (/^(elif|else)\b/.test(record.text)) {
                    throw new Error(
                        "Line " +
                        record.line +
                        ": this branch has no matching if statement."
                    );
                }

                executeStatement(record, context);
                cursor += 1;
                continue;
            }

            const branches = [];
            let branchCursor = cursor;
            let first = true;

            while (branchCursor < end) {
                const headerRecord =
                    records[branchCursor];

                if (headerRecord.indent !== indent) {
                    break;
                }

                const header = parseHeader(
                    headerRecord,
                    first
                );

                if (!header) {
                    break;
                }

                const bodyStart = branchCursor + 1;

                if (
                    bodyStart >= end ||
                    records[bodyStart].indent <= indent
                ) {
                    throw new Error(
                        "Line " +
                        headerRecord.line +
                        ": the decision block needs an " +
                        "indented statement."
                    );
                }

                const childIndent =
                    records[bodyStart].indent;

                let bodyEnd = bodyStart;

                while (
                    bodyEnd < end &&
                    records[bodyEnd].indent > indent
                ) {
                    bodyEnd += 1;
                }

                branches.push({
                    header: header,
                    start: bodyStart,
                    end: bodyEnd,
                    indent: childIndent,
                    line: headerRecord.line
                });

                branchCursor = bodyEnd;
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
                const branch = branches[index];

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
                executeRange(
                    records,
                    selected.start,
                    selected.end,
                    selected.indent,
                    context
                );
            }

            cursor = branchCursor;
        }

        return cursor;
    }

    function runDecisionCode(
        source,
        configuredInputs
    ) {
        const context = {
            variables: {},
            inputs: configuredInputs.slice(),
            output: []
        };

        try {
            const records = prepareRecords(source);

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

            executeRange(
                records,
                0,
                records.length,
                0,
                context
            );

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

            const solved = keys.filter(function (key) {
                return getState(key).best > 0;
            }).length;

            const completed = keys.filter(function (key) {
                return Boolean(
                    getState(key).completedWithSolution
                );
            }).length;

            const total = keys.reduce(
                function (sum, key) {
                    return sum +
                        Number(getState(key).best || 0);
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
            ).textContent = String(completed);

            document.getElementById(
                "pythonPracticeScore"
            ).textContent =
                total + " / " + (keys.length * 100);

            document.getElementById(
                "pythonPracticePercent"
            ).textContent = percent + "%";

            document.getElementById(
                "pythonPracticeProgressBar"
            ).style.width = percent + "%";
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
                String(Number(current.attempts || 0));

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

            const row = document.createElement("div");
            const label = document.createElement("span");
            const result = document.createElement("strong");

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
            const key = card.dataset.pythonProblem;
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
                current.code || config.starter;

            editor.addEventListener(
                "input",
                function () {
                    current.code = editor.value;
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
                            const show = workspace.hidden;

                            workspace.hidden = !show;
                            button.textContent = show
                                ? "✕ Close Workspace"
                                : "💻 Solve It Yourself";
                        } else if (action === "hint") {
                            const show = hint.hidden;

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
                            const show = solution.hidden;

                            solution.hidden = !show;
                            button.textContent = show
                                ? "Hide Program"
                                : "Show Program";

                            if (show) {
                                current.solutionViewed = true;
                                saveState(state);
                            }
                        } else if (action === "run") {
                            const execution =
                                runDecisionCode(
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
                                    ? "Program executed using the " +
                                      "displayed sample input."
                                    : "Fix the displayed error, " +
                                      "then run the program again.";
                        } else if (action === "check") {
                            current.attempts =
                                Number(
                                    current.attempts || 0
                                ) + 1;

                            const execution =
                                runDecisionCode(
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
                                        ? "The program ran, but its " +
                                          "output does not exactly " +
                                          "match the expected output."
                                        : "Correct the program error " +
                                          "and check again.";

                                setTest(
                                    card,
                                    false,
                                    execution.ok
                                        ? "Output mismatch"
                                        : "Program error"
                                );
                            }

                            current.code = editor.value;

                            saveState(state);
                            renderCard(card);
                            updateOverall();
                        } else if (action === "reset") {
                            editor.value = config.starter;
                            current.code = config.starter;

                            output.textContent =
                                "Run your program to see the output.";

                            setTest(
                                card,
                                false,
                                "No test checked yet."
                            );

                            const row = card.querySelector(
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
                    const panel = document.getElementById(
                        button.dataset.pythonPanelToggle
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
            disabled ? "grayscale(0.55)" : "";

        button.style.transform =
            disabled ? "none" : "";

        button.style.boxShadow =
            disabled ? "none" : "";
    }

    function initializeVisualizer() {
        const visualizer = document.querySelector(
            "[data-python-visualizer]"
        );

        if (!visualizer) {
            return;
        }

        const frames = [
            {
                title: "1. Read the Current Value",
                detail:
                    "Python stores score = 72 before " +
                    "reaching the decision chain."
            },
            {
                title: "2. Test the First Rule",
                detail:
                    "The condition score >= 75 is False, " +
                    "so Python skips the Distinction block."
            },
            {
                title: "3. Test the Next Rule",
                detail:
                    "The elif condition score >= 60 is True, " +
                    "so this becomes the selected branch."
            },
            {
                title: "4. Run the Matching Block",
                detail:
                    "Python assigns the text Good. Remaining " +
                    "elif and else paths are skipped."
            },
            {
                title: "5. Continue After the Chain",
                detail:
                    "Execution resumes after the decision " +
                    "and displays Good."
            }
        ];

        const steps = Array.from(
            visualizer.querySelectorAll(
                "[data-visual-step]"
            )
        );

        const stepText = document.getElementById(
            "pythonDecisionVisualStep"
        );
        const title = document.getElementById(
            "pythonDecisionVisualTitle"
        );
        const detail = document.getElementById(
            "pythonDecisionVisualDetail"
        );
        const dots = document.getElementById(
            "pythonDecisionVisualDots"
        );
        const progress = document.getElementById(
            "pythonDecisionVisualProgress"
        );

        const previous = visualizer.querySelector(
            '[data-visual-action="previous"]'
        );
        const next = visualizer.querySelector(
            '[data-visual-action="next"]'
        );
        const auto = visualizer.querySelector(
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
                ((index + 1) /
                    frames.length *
                    100) + "%";

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

            frames.forEach(function (_, dotIndex) {
                const dot = document.createElement("i");

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
                    } else if (action === "next") {
                        index = Math.min(
                            frames.length - 1,
                            index + 1
                        );
                    } else if (action === "reset") {
                        index = 0;
                    } else if (action === "pause") {
                        stop();
                    } else if (action === "auto") {
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
        const tracer = document.querySelector(
            "[data-python-tracer]"
        );

        if (!tracer) {
            return;
        }

        const codeLines = [
            "marks = 72",
            "attendance = 80",
            "eligible = marks >= 60 and attendance >= 75",
            "if eligible:",
            "    status = \"Eligible\"",
            "else:",
            "    status = \"Not eligible\"",
            "print(status)"
        ];

        const frames = [
            {
                line: 0,
                state: {
                    marks: "72",
                    attendance: "—"
                },
                output: "",
                note: "Store 72 in marks."
            },
            {
                line: 1,
                state: {
                    marks: "72",
                    attendance: "80"
                },
                output: "",
                note: "Store 80 in attendance."
            },
            {
                line: 2,
                state: {
                    marks: "72",
                    attendance: "80",
                    eligible: "True"
                },
                output: "",
                note:
                    "Both comparisons are true, " +
                    "so eligible becomes True."
            },
            {
                line: 3,
                state: {
                    eligible: "True",
                    branch: "if"
                },
                output: "",
                note:
                    "The if condition is true. Python " +
                    "selects its indented block and skips else."
            },
            {
                line: 4,
                state: {
                    eligible: "True",
                    status: "Eligible"
                },
                output: "",
                note:
                    "Assign Eligible to status inside " +
                    "the selected branch."
            },
            {
                line: 7,
                state: {
                    eligible: "True",
                    status: "Eligible"
                },
                output: "Eligible",
                note:
                    "Display status. Program execution " +
                    "is complete."
            }
        ];

        const code = document.getElementById(
            "pythonDecisionTraceCode"
        );
        const note = document.getElementById(
            "pythonDecisionTraceNote"
        );
        const live = document.getElementById(
            "pythonDecisionTraceState"
        );
        const output = document.getElementById(
            "pythonDecisionTraceOutput"
        );
        const status = document.getElementById(
            "pythonDecisionTraceStatus"
        );

        const previous = tracer.querySelector(
            '[data-trace-action="previous"]'
        );
        const next = tracer.querySelector(
            '[data-trace-action="next"]'
        );
        const auto = tracer.querySelector(
            '[data-trace-action="auto"]'
        );

        let index = -1;
        let timer = null;

        codeLines.forEach(function (
            line,
            lineIndex
        ) {
            const row = document.createElement("span");

            row.dataset.traceLine =
                String(lineIndex);

            row.textContent =
                String(lineIndex + 1).padStart(2, "0") +
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

                    if (action === "previous") {
                        index = Math.max(
                            -1,
                            index - 1
                        );
                    } else if (action === "next") {
                        index = Math.min(
                            frames.length - 1,
                            index + 1
                        );
                    } else if (action === "reset") {
                        index = -1;
                    } else if (action === "pause") {
                        stop();
                    } else if (action === "auto") {
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

    function initializeLevelFour() {
        initializeSidebarSearch();
        initializeCopyButtons();
        initializeReveals();
        initializeQuiz();
        initializeProblems();
        initializePanels();
        initializeVisualizer();
        initializeTracer();
    }

    window.CodeBhavyaDecisionRunner =
        runDecisionCode;

    if (document.readyState === "loading") {
        document.addEventListener(
            "DOMContentLoaded",
            initializeLevelFour
        );
    } else {
        initializeLevelFour();
    }
}());
