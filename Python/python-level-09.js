(function () {
    "use strict";

    const STORAGE_KEY = "codebhavya.python.level9.practice.v1";
    const MAX_ITERATIONS = 20000;
    const MAX_CALL_DEPTH = 120;

    const problems = {
        "functions-p1": {
            starter: [
                "# Sample input: Bhavya",
                "def welcome(name):",
                "    # Return the complete welcome message",
                "    return name",
                "",
                "student = input()",
                "print(welcome(student))"
            ].join("\n"),
            inputs: ["Bhavya"],
            expected: "Welcome, Bhavya!"
        },
        "functions-p2": {
            starter: [
                "# Sample inputs: 8 and 5",
                "def area(length, width):",
                "    return length * width",
                "",
                "def perimeter(length, width):",
                "    # Return the perimeter",
                "    return 0",
                "",
                "length = int(input())",
                "width = int(input())",
                "print(\"Area =\", area(length, width))",
                "print(\"Perimeter =\", perimeter(length, width))"
            ].join("\n"),
            inputs: ["8", "5"],
            expected: "Area = 40\nPerimeter = 26"
        },
        "functions-p3": {
            starter: [
                "# Sample input: -7",
                "def classify(number):",
                "    # Return Positive, Negative or Zero",
                "    return \"Check\"",
                "",
                "number = int(input())",
                "print(\"Result =\", classify(number))"
            ].join("\n"),
            inputs: ["-7"],
            expected: "Result = Negative"
        },
        "functions-p4": {
            starter: [
                "# Sample input: 5",
                "def factorial(number):",
                "    if number <= 1:",
                "        return 1",
                "    # Add the recursive return statement",
                "    return number",
                "",
                "number = int(input())",
                "print(\"Factorial =\", factorial(number))"
            ].join("\n"),
            inputs: ["5"],
            expected: "Factorial = 120"
        },
        "functions-p5": {
            starter: [
                "# Sample input: 472",
                "def digit_sum(number):",
                "    if number == 0:",
                "        return 0",
                "    # Add the last digit and recurse",
                "    return number",
                "",
                "number = int(input())",
                "print(\"Digit Sum =\", digit_sum(number))"
            ].join("\n"),
            inputs: ["472"],
            expected: "Digit Sum = 13"
        }
    };

    function normalizeSearch(value) {
        return value.toLowerCase().replace(/[–—&]/g, " ")
            .replace(/[^a-z0-9+# ]/g, " ").replace(/\s+/g, " ").trim();
    }

    function initializeSidebarSearch() {
        const input = document.getElementById("topicSearch");
        const empty = document.getElementById("pythonSearchEmpty");
        const links = Array.from(document.querySelectorAll(".python-topic-link"));
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

                    group.classList.toggle("is-search-hidden", !visible);
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
        document.querySelectorAll("[data-copy-target]").forEach(
            function (button) {
                button.addEventListener("click", function () {
                    const target = document.getElementById(
                        button.dataset.copyTarget
                    );

                    if (target) {
                        copyText(target.textContent, button);
                    }
                });
            }
        );
    }

    function initializeReveals() {
        document.querySelectorAll("[data-reveal-target]").forEach(
            function (button) {
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

                    button.setAttribute(
                        "aria-expanded",
                        String(show)
                    );

                    button.textContent = show
                        ? button.dataset.hideLabel || "Hide Answer"
                        : button.dataset.closedLabel;
                });
            }
        );
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

        quiz.querySelector("[data-check-quiz]").addEventListener(
            "click",
            function () {
                let score = 0;
                let answered = 0;

                questions.forEach(function (question) {
                    const selected = question.querySelector("input:checked");
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
                        : selected
                            ? "✕ Review the function rule and try again."
                            : "Please select an answer.";

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
                        " — your function and recursion concepts are clear.";
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
                        " — revise parameters, return, scope and base cases, then try again.";
                }
            }
        );

        quiz.querySelector("[data-reset-quiz]").addEventListener(
            "click",
            function () {
                questions.forEach(function (question) {
                    question.querySelectorAll("input").forEach(
                        function (input) {
                            input.checked = false;
                        }
                    );

                    clear(question);
                });

                result.textContent = "";

                questions[0].scrollIntoView({
                    behavior: "smooth",
                    block: "center"
                });
            }
        );
    }

    function readState() {
        try {
            const value = JSON.parse(
                window.localStorage.getItem(STORAGE_KEY) || "{}"
            );

            return value && typeof value === "object" ? value : {};
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
            /* Practice remains usable without local storage. */
        }
    }

    function splitArguments(source) {
        const result = [];
        let current = "";
        let quote = "";
        let escaped = false;
        let parentheses = 0;
        let brackets = 0;
        let braces = 0;

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

            if (character === "\"" || character === "'") {
                quote = character;
                current += character;
                continue;
            }

            if (character === "(") {
                parentheses += 1;
            }

            if (character === ")") {
                parentheses -= 1;
            }

            if (character === "[") {
                brackets += 1;
            }

            if (character === "]") {
                brackets -= 1;
            }

            if (character === "{") {
                braces += 1;
            }

            if (character === "}") {
                braces -= 1;
            }

            if (
                character === "," &&
                !parentheses &&
                !brackets &&
                !braces
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

        if (current.trim() || source.trim()) {
            result.push(current.trim());
        }

        return result;
    }

    function isFullyWrapped(expression, open, close) {
        if (
            expression[0] !== open ||
            expression[expression.length - 1] !== close
        ) {
            return false;
        }

        let quote = "";
        let depth = 0;

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

            if (character === "\"" || character === "'") {
                quote = character;
                continue;
            }

            if (character === open) {
                depth += 1;
            }

            if (character === close) {
                depth -= 1;

                if (
                    depth === 0 &&
                    index < expression.length - 1
                ) {
                    return false;
                }
            }
        }

        return depth === 0;
    }

    function stripOuterParentheses(source) {
        let expression = source.trim();

        while (
            isFullyWrapped(expression, "(", ")") &&
            splitArguments(expression.slice(1, -1)).length <= 1
        ) {
            expression = expression.slice(1, -1).trim();
        }

        return expression;
    }

    function decodeString(source) {
        const value = source.trim();
        const quote = value[0];

        if (
            (quote !== "\"" && quote !== "'") ||
            value[value.length - 1] !== quote
        ) {
            return null;
        }

        let escaped = false;

        for (
            let index = 1;
            index < value.length - 1;
            index += 1
        ) {
            if (escaped) {
                escaped = false;
                continue;
            }

            if (value[index] === "\\") {
                escaped = true;
                continue;
            }

            if (value[index] === quote) {
                return null;
            }
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
        if (value === null || value === undefined) {
            return "None";
        }

        if (value === true) {
            return "True";
        }

        if (value === false) {
            return "False";
        }

        if (Array.isArray(value)) {
            return "[" +
                value.map(function (item) {
                    return typeof item === "string"
                        ? "'" + item.replace(/'/g, "\\'") + "'"
                        : displayValue(item);
                }).join(", ") +
                "]";
        }

        return String(value);
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

        source
            .replace(/\r/g, "")
            .split("\n")
            .forEach(function (raw, index) {
                const expanded = raw.replace(
                    /^\t+/,
                    function (tabs) {
                        return "    ".repeat(tabs.length);
                    }
                );

                const clean = removeInlineComment(expanded);

                if (!clean.trim()) {
                    return;
                }

                const indent = clean.match(/^ */)[0].length;

                if (indent % 4 !== 0) {
                    throw new Error(
                        "Line " +
                        (index + 1) +
                        ": use indentation in groups of four spaces."
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

    function getBody(records, cursor, end, indent) {
        const start = cursor + 1;

        if (
            start >= end ||
            records[start].indent <= indent
        ) {
            throw new Error(
                "Line " +
                records[cursor].line +
                ": this block needs an indented statement."
            );
        }

        let bodyEnd = start;

        while (
            bodyEnd < end &&
            records[bodyEnd].indent > indent
        ) {
            bodyEnd += 1;
        }

        return {
            start: start,
            end: bodyEnd,
            indent: records[start].indent
        };
    }

    function lookupName(name, scope, context) {
        if (
            Object.prototype.hasOwnProperty.call(
                scope,
                name
            )
        ) {
            return scope[name];
        }

        if (
            Object.prototype.hasOwnProperty.call(
                context.globals,
                name
            )
        ) {
            return context.globals[name];
        }

        throw new Error(
            "NameError: " + name + " is not defined."
        );
    }

    function serializeForExpression(value) {
        if (value === null || value === undefined) {
            return "null";
        }

        if (typeof value === "string") {
            return JSON.stringify(value);
        }

        if (
            typeof value === "number" ||
            typeof value === "boolean"
        ) {
            return String(value);
        }

        return JSON.stringify(value);
    }

    function replaceIdentifiers(expression, scope, context) {
        let result = "";
        let quote = "";
        let escaped = false;

        for (
            let index = 0;
            index < expression.length;
        ) {
            const character = expression[index];

            if (escaped) {
                result += character;
                escaped = false;
                index += 1;
                continue;
            }

            if (quote) {
                result += character;

                if (character === "\\") {
                    escaped = true;
                } else if (character === quote) {
                    quote = "";
                }

                index += 1;
                continue;
            }

            if (
                character === "\"" ||
                character === "'"
            ) {
                quote = character;
                result += character;
                index += 1;
                continue;
            }

            if (/[A-Za-z_]/.test(character)) {
                let end = index + 1;

                while (
                    end < expression.length &&
                    /[A-Za-z0-9_]/.test(expression[end])
                ) {
                    end += 1;
                }

                const name = expression.slice(index, end);

                if (name === "True") {
                    result += "true";
                } else if (name === "False") {
                    result += "false";
                } else if (name === "None") {
                    result += "null";
                } else if (
                    ["and", "or", "not", "is"]
                        .indexOf(name) !== -1
                ) {
                    result += name;
                } else {
                    result += serializeForExpression(
                        lookupName(name, scope, context)
                    );
                }

                index = end;
                continue;
            }

            result += character;
            index += 1;
        }

        return result;
    }

    function replaceFloorDivision(expression) {
        let result = expression;
        const operand =
            "(-?(?:\\d+(?:\\.\\d+)?|\\([^()]+\\)))";
        const pattern = new RegExp(
            operand + "\\s*//\\s*" + operand
        );
        let guard = 0;

        while (pattern.test(result) && guard < 20) {
            result = result.replace(
                pattern,
                function (_, left, right) {
                    return "(Math.floor((" +
                        left +
                        ") / (" +
                        right +
                        ")))";
                }
            );

            guard += 1;
        }

        return result;
    }

    function parseCallArguments(source, scope, context) {
        const positional = [];
        const keywords = {};
        let keywordStarted = false;

        splitArguments(source).forEach(function (part) {
            const keyword = part.match(
                /^([A-Za-z_]\w*)\s*=\s*(.+)$/
            );

            if (
                keyword &&
                !/==|!=|<=|>=/.test(part)
            ) {
                keywordStarted = true;

                if (
                    Object.prototype.hasOwnProperty.call(
                        keywords,
                        keyword[1]
                    )
                ) {
                    throw new Error(
                        "The keyword argument " +
                        keyword[1] +
                        " was repeated."
                    );
                }

                keywords[keyword[1]] =
                    evaluateExpression(
                        keyword[2],
                        scope,
                        context
                    );
            } else {
                if (keywordStarted) {
                    throw new Error(
                        "Positional arguments must appear before keyword arguments."
                    );
                }

                positional.push(
                    evaluateExpression(
                        part,
                        scope,
                        context
                    )
                );
            }
        });

        return {
            positional: positional,
            keywords: keywords
        };
    }

    function callBuiltIn(name, args, context) {
        const values = args.positional;

        if (Object.keys(args.keywords).length) {
            throw new Error(
                name +
                "() does not use keyword arguments in this runner."
            );
        }

        if (name === "input") {
            if (!context.inputs.length) {
                throw new Error(
                    "The program requested more input values than the test provides."
                );
            }

            return context.inputs.shift();
        }

        if (name === "int" && values.length === 1) {
            if (
                typeof values[0] === "string" &&
                !/^[+-]?\d+$/.test(values[0].trim())
            ) {
                throw new Error(
                    "ValueError: int() requires a whole-number value."
                );
            }

            const value = Number(values[0]);

            if (!Number.isFinite(value)) {
                throw new Error(
                    "ValueError: invalid integer."
                );
            }

            return Math.trunc(value);
        }

        if (name === "float" && values.length === 1) {
            const value = Number(values[0]);

            if (!Number.isFinite(value)) {
                throw new Error(
                    "ValueError: invalid float."
                );
            }

            return value;
        }

        if (name === "str" && values.length === 1) {
            return displayValue(values[0]);
        }

        if (name === "bool" && values.length === 1) {
            return Boolean(values[0]);
        }

        if (
            name === "len" &&
            values.length === 1 &&
            (
                typeof values[0] === "string" ||
                Array.isArray(values[0])
            )
        ) {
            return values[0].length;
        }

        if (name === "abs" && values.length === 1) {
            return Math.abs(values[0]);
        }

        if (
            name === "round" &&
            (
                values.length === 1 ||
                values.length === 2
            )
        ) {
            const places =
                values.length === 2 ? values[1] : 0;
            const factor = 10 ** places;

            return Math.round(values[0] * factor) / factor;
        }

        if (name === "pow" && values.length === 2) {
            return values[0] ** values[1];
        }

        if (name === "max" && values.length) {
            return Math.max.apply(null, values);
        }

        if (name === "min" && values.length) {
            return Math.min.apply(null, values);
        }

        if (
            name === "sum" &&
            values.length === 1 &&
            Array.isArray(values[0])
        ) {
            return values[0].reduce(
                function (total, value) {
                    return total + value;
                },
                0
            );
        }

        throw new Error(
            "Unsupported or invalid built-in call: " +
            name +
            "()."
        );
    }

    function callUserFunction(name, args, context) {
        const definition = context.functions[name];

        if (!definition) {
            return undefined;
        }

        if (context.callDepth >= MAX_CALL_DEPTH) {
            throw new Error(
                "RecursionError: maximum function-call depth reached."
            );
        }

        if (
            args.positional.length >
            definition.parameters.length
        ) {
            throw new Error(
                name +
                "() received too many positional arguments."
            );
        }

        const local = {};

        definition.parameters.forEach(
            function (parameter, index) {
                if (index < args.positional.length) {
                    local[parameter.name] =
                        args.positional[index];
                }
            }
        );

        Object.keys(args.keywords).forEach(
            function (keyword) {
                const parameter =
                    definition.parameters.find(
                        function (item) {
                            return item.name === keyword;
                        }
                    );

                if (!parameter) {
                    throw new Error(
                        name +
                        "() has no parameter named " +
                        keyword +
                        "."
                    );
                }

                if (
                    Object.prototype.hasOwnProperty.call(
                        local,
                        keyword
                    )
                ) {
                    throw new Error(
                        name +
                        "() received multiple values for " +
                        keyword +
                        "."
                    );
                }

                local[keyword] = args.keywords[keyword];
            }
        );

        definition.parameters.forEach(function (parameter) {
            if (
                !Object.prototype.hasOwnProperty.call(
                    local,
                    parameter.name
                )
            ) {
                if (parameter.defaultSource === null) {
                    throw new Error(
                        name +
                        "() is missing the argument " +
                        parameter.name +
                        "."
                    );
                }

                local[parameter.name] =
                    evaluateExpression(
                        parameter.defaultSource,
                        context.globals,
                        context
                    );
            }
        });

        context.callDepth += 1;

        try {
            const result = executeRange(
                definition.records,
                definition.body.start,
                definition.body.end,
                definition.body.indent,
                context,
                local
            );

            if (
                result.signal &&
                result.signal.type === "return"
            ) {
                return result.signal.value;
            }

            if (result.signal) {
                throw new Error(
                    result.signal.type +
                    " can be used only inside a loop."
                );
            }

            return null;
        } finally {
            context.callDepth -= 1;
        }
    }

    function evaluateCall(name, source, scope, context) {
        const args = parseCallArguments(
            source,
            scope,
            context
        );
        const userValue = callUserFunction(
            name,
            args,
            context
        );

        if (
            userValue !== undefined ||
            Object.prototype.hasOwnProperty.call(
                context.functions,
                name
            )
        ) {
            return userValue;
        }

        return callBuiltIn(name, args, context);
    }

    function replaceEmbeddedCalls(
        expression,
        scope,
        context
    ) {
        let prepared = expression;
        let guard = 0;
        const pattern =
            /\b([A-Za-z_]\w*)\(([^()]*)\)/;

        while (pattern.test(prepared) && guard < 100) {
            const match = prepared.match(pattern);
            const value = evaluateCall(
                match[1],
                match[2],
                scope,
                context
            );

            prepared =
                prepared.slice(0, match.index) +
                serializeForExpression(value) +
                prepared.slice(
                    match.index + match[0].length
                );

            guard += 1;
        }

        if (/\b[A-Za-z_]\w*\s*\(/.test(prepared)) {
            throw new Error(
                "Check the function-call parentheses."
            );
        }

        return prepared;
    }

    function evaluateExpression(source, scope, context) {
        let expression = stripOuterParentheses(source);

        if (!expression) {
            return null;
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
                            scope,
                            context
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

        if (
            /^[+-]?(?:\d+\.?\d*|\.\d+)$/.test(
                expression
            )
        ) {
            return Number(expression);
        }

        if (isFullyWrapped(expression, "[", "]")) {
            const inside =
                expression.slice(1, -1).trim();

            return inside
                ? splitArguments(inside).map(
                    function (part) {
                        return evaluateExpression(
                            part,
                            scope,
                            context
                        );
                    }
                )
                : [];
        }

        const method = expression.match(
            /^(.+)\.([A-Za-z_]\w*)\(([^()]*)\)$/
        );

        if (method) {
            const base = evaluateExpression(
                method[1],
                scope,
                context
            );
            const args = splitArguments(
                method[3]
            ).map(function (part) {
                return evaluateExpression(
                    part,
                    scope,
                    context
                );
            });

            if (
                typeof base === "string" &&
                method[2] === "upper" &&
                !args.length
            ) {
                return base.toUpperCase();
            }

            if (
                typeof base === "string" &&
                method[2] === "lower" &&
                !args.length
            ) {
                return base.toLowerCase();
            }

            if (
                typeof base === "string" &&
                method[2] === "strip" &&
                !args.length
            ) {
                return base.trim();
            }

            throw new Error(
                "Unsupported method: " +
                method[2] +
                "()."
            );
        }

        const exactCall = expression.match(
            /^([A-Za-z_]\w*)\(([^()]*)\)$/
        );

        if (exactCall) {
            return evaluateCall(
                exactCall[1],
                exactCall[2],
                scope,
                context
            );
        }

        if (/^[A-Za-z_]\w*$/.test(expression)) {
            return lookupName(
                expression,
                scope,
                context
            );
        }

        expression = replaceEmbeddedCalls(
            expression,
            scope,
            context
        );

        let translated = replaceIdentifiers(
            expression,
            scope,
            context
        );

        translated = translated
            .replace(/\bis\s+not\b/g, "!==")
            .replace(/\bis\b/g, "===")
            .replace(/\band\b/g, "&&")
            .replace(/\bor\b/g, "||")
            .replace(/\bnot\b/g, "!");

        translated = replaceFloorDivision(translated);

        const stripped = translated
            .replace(/Math\.floor/g, "")
            .replace(
                /"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'/g,
                ""
            )
            .replace(
                /\b(?:true|false|null)\b/g,
                ""
            );

        if (
            !/^[0-9+\-*/%().\s<>=!&|]+$/.test(
                stripped
            )
        ) {
            throw new Error(
                "This runner supports function calls, arithmetic and conditions."
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

    function parseParameters(source, line) {
        const parameters = [];
        let defaultStarted = false;

        splitArguments(source).forEach(function (part) {
            const match = part.match(
                /^([A-Za-z_]\w*)(?:\s*=\s*(.+))?$/
            );

            if (!match) {
                throw new Error(
                    "Line " +
                    line +
                    ": invalid parameter syntax."
                );
            }

            const hasDefault =
                match[2] !== undefined;

            if (!hasDefault && defaultStarted) {
                throw new Error(
                    "Line " +
                    line +
                    ": required parameters must come before default parameters."
                );
            }

            if (hasDefault) {
                defaultStarted = true;
            }

            if (
                parameters.some(function (item) {
                    return item.name === match[1];
                })
            ) {
                throw new Error(
                    "Line " +
                    line +
                    ": duplicate parameter " +
                    match[1] +
                    "."
                );
            }

            parameters.push({
                name: match[1],
                defaultSource: hasDefault
                    ? match[2]
                    : null
            });
        });

        return parameters;
    }

    function parseDecisionHeader(record, first) {
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

    function executeStatement(record, context, scope) {
        const line = record.text;

        if (line === "pass") {
            return null;
        }

        const returnMatch = line.match(
            /^return(?:\s+(.+))?$/
        );

        if (returnMatch) {
            return {
                type: "return",
                value: returnMatch[1]
                    ? evaluateExpression(
                        returnMatch[1],
                        scope,
                        context
                    )
                    : null
            };
        }

        const printMatch = line.match(
            /^print\s*\(([\s\S]*)\)\s*$/
        );

        if (printMatch) {
            const parts = printMatch[1].trim()
                ? splitArguments(printMatch[1])
                : [];

            context.output.push(
                parts.map(function (part) {
                    return displayValue(
                        evaluateExpression(
                            part,
                            scope,
                            context
                        )
                    );
                }).join(" ")
            );

            return null;
        }

        const augmented = line.match(
            /^([A-Za-z_]\w*)\s*(\*\*=|\/\/=|\+=|-=|\*=|\/=|%=)\s*(.+)$/
        );

        if (augmented) {
            const current = lookupName(
                augmented[1],
                scope,
                context
            );
            const right = evaluateExpression(
                augmented[3],
                scope,
                context
            );

            if (augmented[2] === "+=") {
                scope[augmented[1]] = current + right;
            } else if (augmented[2] === "-=") {
                scope[augmented[1]] = current - right;
            } else if (augmented[2] === "*=") {
                scope[augmented[1]] = current * right;
            } else if (augmented[2] === "/=") {
                scope[augmented[1]] = current / right;
            } else if (augmented[2] === "%=") {
                scope[augmented[1]] = current % right;
            } else if (augmented[2] === "**=") {
                scope[augmented[1]] = current ** right;
            } else {
                scope[augmented[1]] =
                    Math.floor(current / right);
            }

            return null;
        }

        const assignment = line.match(
            /^([A-Za-z_]\w*)\s*=\s*(.+)$/
        );

        if (assignment) {
            scope[assignment[1]] =
                evaluateExpression(
                    assignment[2],
                    scope,
                    context
                );

            return null;
        }

        if (/^[A-Za-z_]\w*\s*\(.*\)$/.test(line)) {
            evaluateExpression(
                line,
                scope,
                context
            );

            return null;
        }

        throw new Error(
            "Line " +
            record.line +
            ": use a supported assignment, call, return, print, decision or loop."
        );
    }

    function makeRange(source, scope, context) {
        const values = splitArguments(source).map(
            function (part) {
                const value = evaluateExpression(
                    part,
                    scope,
                    context
                );

                if (!Number.isInteger(value)) {
                    throw new Error(
                        "range() arguments must be integers."
                    );
                }

                return value;
            }
        );

        if (
            values.length < 1 ||
            values.length > 3
        ) {
            throw new Error(
                "range() expects one, two or three arguments."
            );
        }

        let start = 0;
        let stop = values[0];
        let step = 1;

        if (values.length >= 2) {
            start = values[0];
            stop = values[1];
        }

        if (values.length === 3) {
            step = values[2];
        }

        if (!step) {
            throw new Error(
                "ValueError: range() step cannot be zero."
            );
        }

        const result = [];

        for (
            let value = start;
            step > 0 ? value < stop : value > stop;
            value += step
        ) {
            result.push(value);

            if (result.length > MAX_ITERATIONS) {
                throw new Error(
                    "The generated range is too large."
                );
            }
        }

        return result;
    }

    function executeRange(
        records,
        start,
        end,
        indent,
        context,
        scope
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
                    signal: {
                        type: record.text
                    }
                };
            }

            const definition = record.text.match(
                /^def\s+([A-Za-z_]\w*)\s*\(([^()]*)\)\s*:\s*$/
            );

            if (definition) {
                const body = getBody(
                    records,
                    cursor,
                    end,
                    indent
                );

                context.functions[definition[1]] = {
                    parameters: parseParameters(
                        definition[2],
                        record.line
                    ),
                    records: records,
                    body: body
                };

                cursor = body.end;
                continue;
            }

            const decision = parseDecisionHeader(
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

                    const header = parseDecisionHeader(
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
                    const branch = branches[index];

                    if (
                        branch.header.type === "else" ||
                        Boolean(
                            evaluateExpression(
                                branch.header.condition,
                                scope,
                                context
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
                        context,
                        scope
                    );

                    if (result.signal) {
                        return result;
                    }
                }

                cursor = branchCursor;
                continue;
            }

            const forMatch = record.text.match(
                /^for\s+([A-Za-z_]\w*)\s+in\s+(.+)\s*:\s*$/
            );

            if (forMatch) {
                const body = getBody(
                    records,
                    cursor,
                    end,
                    indent
                );
                const range = forMatch[2].match(
                    /^range\s*\((.*)\)$/
                );
                const iterable = range
                    ? makeRange(
                        range[1],
                        scope,
                        context
                    )
                    : evaluateExpression(
                        forMatch[2],
                        scope,
                        context
                    );

                if (
                    !Array.isArray(iterable) &&
                    typeof iterable !== "string"
                ) {
                    throw new Error(
                        "A for loop requires a range, list or string."
                    );
                }

                for (const value of iterable) {
                    context.iterations += 1;

                    if (
                        context.iterations >
                        MAX_ITERATIONS
                    ) {
                        throw new Error(
                            "Loop stopped: iteration safety limit reached."
                        );
                    }

                    scope[forMatch[1]] = value;

                    const result = executeRange(
                        records,
                        body.start,
                        body.end,
                        body.indent,
                        context,
                        scope
                    );

                    if (
                        result.signal &&
                        result.signal.type === "return"
                    ) {
                        return result;
                    }

                    if (
                        result.signal &&
                        result.signal.type === "break"
                    ) {
                        break;
                    }

                    if (
                        result.signal &&
                        result.signal.type === "continue"
                    ) {
                        continue;
                    }
                }

                cursor = body.end;
                continue;
            }

            const whileMatch = record.text.match(
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
                            scope,
                            context
                        )
                    )
                ) {
                    context.iterations += 1;

                    if (
                        context.iterations >
                        MAX_ITERATIONS
                    ) {
                        throw new Error(
                            "Loop stopped: check whether the condition becomes false."
                        );
                    }

                    const result = executeRange(
                        records,
                        body.start,
                        body.end,
                        body.indent,
                        context,
                        scope
                    );

                    if (
                        result.signal &&
                        result.signal.type === "return"
                    ) {
                        return result;
                    }

                    if (
                        result.signal &&
                        result.signal.type === "break"
                    ) {
                        break;
                    }

                    if (
                        result.signal &&
                        result.signal.type === "continue"
                    ) {
                        continue;
                    }
                }

                cursor = body.end;
                continue;
            }

            if (/^(elif|else)\b/.test(record.text)) {
                throw new Error(
                    "Line " +
                    record.line +
                    ": this branch has no matching if statement."
                );
            }

            const signal = executeStatement(
                record,
                context,
                scope
            );

            if (signal) {
                return {
                    cursor: cursor + 1,
                    signal: signal
                };
            }

            cursor += 1;
        }

        return {
            cursor: cursor,
            signal: null
        };
    }

    function runFunctionCode(source, configuredInputs) {
        const context = {
            globals: {},
            functions: {},
            inputs: configuredInputs.slice(),
            output: [],
            iterations: 0,
            callDepth: 0
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
                    ": the program must start at indentation level zero."
                );
            }

            const result = executeRange(
                records,
                0,
                records.length,
                0,
                context,
                context.globals
            );

            if (result.signal) {
                throw new Error(
                    result.signal.type +
                    " can be used only inside the correct block."
                );
            }

            return {
                ok: true,
                output: context.output.join("\n"),
                variables: context.globals
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
            ).textContent =
                String(completed);

            document.getElementById(
                "pythonPracticeScore"
            ).textContent =
                total + " / " +
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

            badge.className = "python-practice-badge";

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
                    : current.completedWithSolution
                        ? "Completed with Solution"
                        : current.attempts
                            ? "In Progress"
                            : "Not Solved";
        }

        function setTest(card, passed, labelText) {
            const tests = card.querySelector(
                "[data-problem-tests]"
            );

            tests.innerHTML = "";

            const row = document.createElement("div");
            const label = document.createElement("span");
            const result = document.createElement("strong");

            row.className = passed ? "pass" : "fail";
            label.textContent = labelText;
            result.textContent =
                passed ? "PASS" : "CHECK";

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
                                runFunctionCode(
                                    editor.value,
                                    config.inputs
                                );

                            output.textContent =
                                execution.ok
                                    ? execution.output ||
                                        "(No output)"
                                    : "Error: " +
                                        execution.error;

                            message.textContent =
                                execution.ok
                                    ? "Program executed using the displayed sample input."
                                    : "Fix the displayed error, then run the program again.";
                        } else if (
                            action === "check"
                        ) {
                            current.attempts =
                                Number(
                                    current.attempts || 0
                                ) + 1;

                            const execution =
                                runFunctionCode(
                                    editor.value,
                                    config.inputs
                                );

                            const passed =
                                execution.ok &&
                                execution.output.trim() ===
                                    config.expected.trim();

                            output.textContent =
                                execution.ok
                                    ? execution.output ||
                                        "(No output)"
                                    : "Error: " +
                                        execution.error;

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

                                    current.best = Math.max(
                                        Number(
                                            current.best || 0
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

                            current.code = editor.value;
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

                            const row = card.querySelector(
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
                        : button.dataset
                            .pythonPanelToggle
                            .indexOf("Trace") !== -1
                            ? "▶ Open Program Tracer"
                            : "▶ Open Visualization";
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
                title: "1. Define the Function",
                detail:
                    "Python records the function name, parameters and body when it executes the def statement."
            },
            {
                title: "2. Pass the Arguments",
                detail:
                    "The call area(8, 5) supplies 8 and 5 to the length and width parameters."
            },
            {
                title: "3. Create a Local Frame",
                detail:
                    "A new local scope stores length = 8 and width = 5 for this call only."
            },
            {
                title: "4. Calculate and Return",
                detail:
                    "The body calculates 8 × 5 and return sends the value 40 back to the caller."
            },
            {
                title: "5. Resume the Caller",
                detail:
                    "The caller receives 40, stores or displays it and continues with its next statement."
            }
        ];

        const steps = Array.from(
            visualizer.querySelectorAll(
                "[data-visual-step]"
            )
        );
        const stepText = document.getElementById(
            "pythonFunctionVisualStep"
        );
        const title = document.getElementById(
            "pythonFunctionVisualTitle"
        );
        const detail = document.getElementById(
            "pythonFunctionVisualDetail"
        );
        const dots = document.getElementById(
            "pythonFunctionVisualDots"
        );
        const progress = document.getElementById(
            "pythonFunctionVisualProgress"
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

            frames.forEach(function (_, dotIndex) {
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
            "def factorial(number):",
            "    if number <= 1:",
            "        return 1",
            "    return number * factorial(number - 1)",
            "print(factorial(4))"
        ];

        const frames = [
            {
                line: 4,
                state: {
                    call: "factorial(4)",
                    stack: "4",
                    returning: "—"
                },
                output: "",
                note:
                    "The caller requests factorial(4), creating the first function frame."
            },
            {
                line: 3,
                state: {
                    call: "factorial(3)",
                    stack: "4 → 3",
                    returning: "—"
                },
                output: "",
                note:
                    "4 is not the base case, so the function waits for factorial(3)."
            },
            {
                line: 3,
                state: {
                    call: "factorial(2)",
                    stack: "4 → 3 → 2",
                    returning: "—"
                },
                output: "",
                note:
                    "3 waits while a smaller factorial(2) frame is created."
            },
            {
                line: 3,
                state: {
                    call: "factorial(1)",
                    stack: "4 → 3 → 2 → 1",
                    returning: "—"
                },
                output: "",
                note:
                    "2 requests factorial(1), which reaches the base case."
            },
            {
                line: 2,
                state: {
                    call: "factorial(1)",
                    stack: "4 → 3 → 2",
                    returning: "1"
                },
                output: "",
                note:
                    "The base case returns 1 and its frame is removed."
            },
            {
                line: 3,
                state: {
                    call: "unwinding",
                    stack: "4",
                    returning:
                        "2 × 1 = 2; 3 × 2 = 6"
                },
                output: "",
                note:
                    "Waiting frames resume in reverse order and multiply their local number."
            },
            {
                line: 4,
                state: {
                    call: "complete",
                    stack: "empty",
                    returning: "4 × 6 = 24"
                },
                output: "24",
                note:
                    "factorial(4) returns 24 to print. Program execution is complete."
            }
        ];

        const code = document.getElementById(
            "pythonFunctionTraceCode"
        );
        const note = document.getElementById(
            "pythonFunctionTraceNote"
        );
        const live = document.getElementById(
            "pythonFunctionTraceState"
        );
        const output = document.getElementById(
            "pythonFunctionTraceOutput"
        );
        const status = document.getElementById(
            "pythonFunctionTraceStatus"
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

        codeLines.forEach(function (line, lineIndex) {
            const row = document.createElement("span");

            row.dataset.traceLine = String(lineIndex);
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

            Object.keys(frame.state).forEach(
                function (name) {
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
                }
            );

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

    function initializeLevelNine() {
        initializeSidebarSearch();
        initializeCopyButtons();
        initializeReveals();
        initializeQuiz();
        initializeProblems();
        initializePanels();
        initializeVisualizer();
        initializeTracer();
    }

    window.CodeBhavyaFunctionRunner =
        runFunctionCode;

    if (document.readyState === "loading") {
        document.addEventListener(
            "DOMContentLoaded",
            initializeLevelNine
        );
    } else {
        initializeLevelNine();
    }
}());
