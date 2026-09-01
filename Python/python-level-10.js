(function () {
    "use strict";

    const STORAGE_KEY = "codebhavya.python.level10.practice.v1";
    const MAX_ITERATIONS = 20000;

    const problems = {
        "applied-p1": {
            starter: [
                "# Sample input: 4",
                "import math",
                "",
                "radius = float(input())",
                "# Calculate the area using math.pi",
                "area = radius",
                "print(\"Area =\", round(area, 2))"
            ].join("\n"),
            inputs: ["4"],
            files: {},
            expected: "Area = 50.27"
        },
        "applied-p2": {
            starter: [
                "# Sample inputs: 18 and 0",
                "first = int(input())",
                "second = int(input())",
                "",
                "try:",
                "    print(\"Quotient =\", first // second)",
                "except ZeroDivisionError:",
                "    # Display the required recovery message",
                "    print(\"Division failed\")"
            ].join("\n"),
            inputs: ["18", "0"],
            files: {},
            expected: "Cannot divide by zero"
        },
        "applied-p3": {
            starter: [
                "# Virtual file: notes.txt",
                "with open(\"notes.txt\", \"r\") as file:",
                "    text = file.read()",
                "",
                "print(\"Lines =\", 0)",
                "print(\"Words =\", 0)"
            ].join("\n"),
            inputs: [],
            files: {
                "notes.txt": "Learn Python\nPractice daily\nBuild projects"
            },
            expected: "Lines = 3\nWords = 6"
        },
        "applied-p4": {
            starter: [
                "# Virtual file: marks.csv",
                "import csv",
                "",
                "total = 0",
                "count = 0",
                "with open(\"marks.csv\", \"r\") as file:",
                "    reader = csv.reader(file)",
                "    for row in reader:",
                "        # Add the mark in row[1]",
                "        total += 0",
                "        count += 1",
                "",
                "print(\"Average =\", total // count)"
            ].join("\n"),
            inputs: [],
            files: {
                "marks.csv": "Asha,84\nRavi,90\nMina,96"
            },
            expected: "Average = 90"
        },
        "applied-p5": {
            starter: [
                "# Virtual file: profile.json",
                "import json",
                "",
                "with open(\"profile.json\", \"r\") as file:",
                "    profile = json.load(file)",
                "",
                "print(\"Name =\", profile[\"name\"])",
                "# Display the number of skills",
                "print(\"Skills =\", 0)"
            ].join("\n"),
            inputs: [],
            files: {
                "profile.json":
                    "{\"name\":\"Bhavya\",\"skills\":[\"Python\",\"C\",\"DSA\"]}"
            },
            expected: "Name = Bhavya\nSkills = 3"
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
                        : selected
                            ? "✕ Review the applied Python rule and try again."
                            : "Please select an answer.";

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
                } else if (score === questions.length) {
                    result.textContent =
                        "Excellent! " +
                        score +
                        "/" +
                        questions.length +
                        " — your modules, exceptions and files concepts are clear.";
                } else if (
                    score >= Math.ceil(questions.length * 0.6)
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
                        " — revise imports, exception flow and file operations, then try again.";
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
            splitArguments(
                expression.slice(1, -1)
            ).length <= 1
        ) {
            expression = expression
                .slice(1, -1)
                .trim();
        }

        return expression;
    }

    function decodeString(source) {
        const value = source.trim();
        const quote = value[0];

        if (
            quote !== "\"" &&
            quote !== "'"
        ) {
            return null;
        }

        if (value[value.length - 1] !== quote) {
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
            return (
                "[" +
                value.map(function (item) {
                    return typeof item === "string"
                        ? "'" +
                            item.replace(/'/g, "\\'") +
                            "'"
                        : displayValue(item);
                }).join(", ") +
                "]"
            );
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
            "NameError: " +
            name +
            " is not defined."
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

                const name = expression.slice(
                    index,
                    end
                );

                if (name === "True") {
                    result += "true";
                } else if (name === "False") {
                    result += "false";
                } else if (name === "None") {
                    result += "null";
                } else if (
                    ["and", "or", "not", "is"].indexOf(name) !== -1
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
            operand +
            "\\s*//\\s*" +
            operand
        );

        let guard = 0;

        while (
            pattern.test(result) &&
            guard < 20
        ) {
            result = result.replace(
                pattern,
                function (_, left, right) {
                    return (
                        "(Math.floor((" +
                        left +
                        ") / (" +
                        right +
                        ")))"
                    );
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

    function createVirtualFile(name, mode, context) {
        const readable =
            mode.indexOf("r") !== -1 ||
            mode.indexOf("+") !== -1;

        const writable = /[wax+]/.test(mode);

        if (
            readable &&
            !Object.prototype.hasOwnProperty.call(
                context.files,
                name
            )
        ) {
            throw new Error(
                "FileNotFoundError: " +
                name +
                " was not found."
            );
        }

        if (
            mode.indexOf("x") !== -1 &&
            Object.prototype.hasOwnProperty.call(
                context.files,
                name
            )
        ) {
            throw new Error(
                "FileExistsError: " +
                name +
                " already exists."
            );
        }

        if (
            mode.indexOf("w") !== -1 ||
            mode.indexOf("x") !== -1
        ) {
            context.files[name] = "";
        }

        if (
            mode.indexOf("a") !== -1 &&
            !Object.prototype.hasOwnProperty.call(
                context.files,
                name
            )
        ) {
            context.files[name] = "";
        }

        return {
            __pythonFile: true,
            name: name,
            mode: mode,
            position:
                mode.indexOf("a") !== -1
                    ? context.files[name].length
                    : 0,
            readable: readable,
            writable: writable,
            closed: false,
            context: context
        };
    }

    function ensureOpenFile(file, action) {
        if (!file || !file.__pythonFile) {
            throw new Error(
                "TypeError: " +
                action +
                " requires an open file."
            );
        }

        if (file.closed) {
            throw new Error(
                "ValueError: I/O operation on closed file."
            );
        }
    }

    function readFileText(file) {
        ensureOpenFile(file, "read");

        if (!file.readable) {
            throw new Error(
                "UnsupportedOperation: file is not readable."
            );
        }

        const text =
            file.context.files[file.name] || "";

        const value = text.slice(file.position);

        file.position = text.length;

        return value;
    }

    function callModuleMethod(module, method, values) {
        if (module.__pythonModule === "math") {
            if (
                method === "sqrt" &&
                values.length === 1
            ) {
                if (values[0] < 0) {
                    throw new Error(
                        "ValueError: math domain error."
                    );
                }

                return Math.sqrt(values[0]);
            }

            if (
                method === "ceil" &&
                values.length === 1
            ) {
                return Math.ceil(values[0]);
            }

            if (
                method === "floor" &&
                values.length === 1
            ) {
                return Math.floor(values[0]);
            }

            if (
                method === "factorial" &&
                values.length === 1 &&
                Number.isInteger(values[0]) &&
                values[0] >= 0
            ) {
                let answer = 1;

                for (
                    let value = 2;
                    value <= values[0];
                    value += 1
                ) {
                    answer *= value;
                }

                return answer;
            }
        }

        if (
            module.__pythonModule === "csv" &&
            method === "reader" &&
            values.length === 1
        ) {
            const text = readFileText(values[0]);

            if (!text) {
                return [];
            }

            return text
                .replace(/\r/g, "")
                .split("\n")
                .map(function (line) {
                    return line
                        .split(",")
                        .map(function (field) {
                            return field.trim();
                        });
                });
        }

        if (
            module.__pythonModule === "json" &&
            method === "load" &&
            values.length === 1
        ) {
            try {
                return JSON.parse(
                    readFileText(values[0])
                );
            } catch (error) {
                throw new Error(
                    "JSONDecodeError: invalid JSON data."
                );
            }
        }

        if (
            module.__pythonModule === "json" &&
            method === "loads" &&
            values.length === 1
        ) {
            try {
                return JSON.parse(values[0]);
            } catch (error) {
                throw new Error(
                    "JSONDecodeError: invalid JSON data."
                );
            }
        }

        throw new Error(
            "Unsupported module call: " +
            module.__pythonModule +
            "." +
            method +
            "()."
        );
    }

    function callBuiltIn(name, args, context) {
        const values = args.positional;

        if (name === "open") {
            const filename = values[0];
            const mode =
                values.length >= 2
                    ? values[1]
                    : "r";

            if (
                typeof filename !== "string" ||
                typeof mode !== "string"
            ) {
                throw new Error(
                    "TypeError: open() requires a filename and text mode."
                );
            }

            if (!/^[rwax](?:\+)?$/.test(mode)) {
                throw new Error(
                    "ValueError: this runner supports text modes r, w, a and x."
                );
            }

            return createVirtualFile(
                filename,
                mode,
                context
            );
        }

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

        if (
            name === "int" &&
            values.length === 1
        ) {
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

        if (
            name === "float" &&
            values.length === 1
        ) {
            const value = Number(values[0]);

            if (!Number.isFinite(value)) {
                throw new Error(
                    "ValueError: invalid float."
                );
            }

            return value;
        }

        if (
            name === "str" &&
            values.length === 1
        ) {
            return displayValue(values[0]);
        }

        if (
            name === "bool" &&
            values.length === 1
        ) {
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

        if (
            name === "abs" &&
            values.length === 1
        ) {
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
                values.length === 2
                    ? values[1]
                    : 0;

            const factor = 10 ** places;

            return (
                Math.round(values[0] * factor) /
                factor
            );
        }

        if (
            name === "pow" &&
            values.length === 2
        ) {
            return values[0] ** values[1];
        }

        if (
            name === "max" &&
            values.length
        ) {
            return Math.max.apply(null, values);
        }

        if (
            name === "min" &&
            values.length
        ) {
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

    function evaluateCall(name, source, scope, context) {
        const args = parseCallArguments(
            source,
            scope,
            context
        );

        let imported = null;

        try {
            imported = lookupName(
                name,
                scope,
                context
            );
        } catch (error) {
            imported = null;
        }

        if (
            imported &&
            imported.__pythonImportedFunction
        ) {
            return callModuleMethod(
                {
                    __pythonModule: imported.module
                },
                imported.method,
                args.positional
            );
        }

        return callBuiltIn(
            name,
            args,
            context
        );
    }

    function replaceEmbeddedCalls(expression, scope, context) {
        let prepared = expression;
        let guard = 0;

        const methodPattern =
            /\b([A-Za-z_]\w*(?:\[[^\[\]]+\])?)\.([A-Za-z_]\w*)\(([^()]*)\)/;

        while (
            methodPattern.test(prepared) &&
            guard < 100
        ) {
            const match = prepared.match(
                methodPattern
            );

            const value = evaluateExpression(
                match[0],
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

        const pattern =
            /\b([A-Za-z_]\w*)\(([^()]*)\)/;

        while (
            pattern.test(prepared) &&
            guard < 100
        ) {
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

        if (/\bmath\.pi\b/.test(expression)) {
            const mathModule = lookupName(
                "math",
                scope,
                context
            );

            if (
                !mathModule ||
                mathModule.__pythonModule !== "math"
            ) {
                throw new Error(
                    "NameError: math is not defined."
                );
            }

            expression = expression.replace(
                /\bmath\.pi\b/g,
                String(Math.PI)
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
            const inside = expression
                .slice(1, -1)
                .trim();

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

        const indexed = expression.match(
            /^(.+)\[([^\[\]]+)\]$/
        );

        if (indexed) {
            const collection = evaluateExpression(
                indexed[1],
                scope,
                context
            );

            const key = evaluateExpression(
                indexed[2],
                scope,
                context
            );

            if (
                collection === null ||
                collection === undefined ||
                (
                    typeof collection !== "object" &&
                    typeof collection !== "string"
                )
            ) {
                throw new Error(
                    "TypeError: this value cannot be indexed."
                );
            }

            if (
                !Object.prototype.hasOwnProperty.call(
                    collection,
                    key
                ) &&
                !(
                    typeof collection === "string" &&
                    Number.isInteger(key) &&
                    key >= 0 &&
                    key < collection.length
                )
            ) {
                throw new Error(
                    Array.isArray(collection)
                        ? "IndexError: list index out of range."
                        : "KeyError: " + key + "."
                );
            }

            return collection[key];
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

            if (
                typeof base === "string" &&
                method[2] === "split" &&
                args.length <= 1
            ) {
                if (!args.length) {
                    const trimmed = base.trim();

                    return trimmed
                        ? trimmed.split(/\s+/)
                        : [];
                }

                return base.split(args[0]);
            }

            if (
                typeof base === "string" &&
                method[2] === "splitlines" &&
                !args.length
            ) {
                return base
                    ? base.replace(/\r/g, "").split("\n")
                    : [];
            }

            if (
                base &&
                base.__pythonFile &&
                method[2] === "read" &&
                !args.length
            ) {
                return readFileText(base);
            }

            if (
                base &&
                base.__pythonModule
            ) {
                return callModuleMethod(
                    base,
                    method[2],
                    args
                );
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
                "This runner supports module calls, arithmetic and conditions."
            );
        }

        try {
            const value = Function(
                "\"use strict\"; return (" +
                translated +
                ");"
            )();

            if (
                typeof value === "number" &&
                !Number.isFinite(value)
            ) {
                throw new Error(
                    "ZeroDivisionError: division by zero."
                );
            }

            return value;
        } catch (error) {
            if (
                /^(ZeroDivisionError|ValueError|TypeError|KeyError|IndexError|File)/
                    .test(error.message)
            ) {
                throw error;
            }

            throw new Error(
                "Check the expression syntax and parentheses."
            );
        }
    }

    function executeStatement(record, context, scope) {
        const line = record.text;

        if (line === "pass") {
            return null;
        }

        const importMatch = line.match(
            /^import\s+(math|csv|json)(?:\s+as\s+([A-Za-z_]\w*))?$/
        );

        if (importMatch) {
            scope[importMatch[2] || importMatch[1]] = {
                __pythonModule: importMatch[1]
            };

            return null;
        }

        const fromImport = line.match(
            /^from\s+math\s+import\s+(sqrt|ceil|floor|factorial)(?:\s+as\s+([A-Za-z_]\w*))?$/
        );

        if (fromImport) {
            const method = fromImport[1];

            scope[fromImport[2] || method] = {
                __pythonImportedFunction: true,
                module: "math",
                method: method
            };

            return null;
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
                scope[augmented[1]] = Math.floor(
                    current / right
                );
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
            ": use a supported assignment, call, print, decision or loop."
        );
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

            const withMatch = record.text.match(
                /^with\s+open\((.*)\)\s+as\s+([A-Za-z_]\w*)\s*:\s*$/
            );

            if (withMatch) {
                const body = getBody(
                    records,
                    cursor,
                    end,
                    indent
                );

                const file = evaluateCall(
                    "open",
                    withMatch[1],
                    scope,
                    context
                );

                scope[withMatch[2]] = file;

                try {
                    executeRange(
                        records,
                        body.start,
                        body.end,
                        body.indent,
                        context,
                        scope
                    );
                } finally {
                    file.closed = true;
                }

                cursor = body.end;
                continue;
            }

            if (/^try\s*:\s*$/.test(record.text)) {
                const tryBody = getBody(
                    records,
                    cursor,
                    end,
                    indent
                );

                let branchCursor = tryBody.end;

                const handlers = [];

                while (
                    branchCursor < end &&
                    records[branchCursor].indent === indent
                ) {
                    const header =
                        records[branchCursor].text;

                    const exceptMatch = header.match(
                        /^except(?:\s+([A-Za-z_]\w*))?(?:\s+as\s+[A-Za-z_]\w*)?\s*:\s*$/
                    );

                    if (!exceptMatch) {
                        break;
                    }

                    const body = getBody(
                        records,
                        branchCursor,
                        end,
                        indent
                    );

                    handlers.push({
                        type: exceptMatch[1] || null,
                        body: body
                    });

                    branchCursor = body.end;
                }

                if (!handlers.length) {
                    throw new Error(
                        "Line " +
                        record.line +
                        ": try requires an except block."
                    );
                }

                try {
                    executeRange(
                        records,
                        tryBody.start,
                        tryBody.end,
                        tryBody.indent,
                        context,
                        scope
                    );
                } catch (error) {
                    const handler = handlers.find(
                        function (item) {
                            return (
                                !item.type ||
                                error.message.indexOf(
                                    item.type + ":"
                                ) === 0
                            );
                        }
                    );

                    if (!handler) {
                        throw error;
                    }

                    executeRange(
                        records,
                        handler.body.start,
                        handler.body.end,
                        handler.body.indent,
                        context,
                        scope
                    );
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

                const iterable = evaluateExpression(
                    forMatch[2],
                    scope,
                    context
                );

                if (
                    !Array.isArray(iterable) &&
                    typeof iterable !== "string"
                ) {
                    throw new Error(
                        "A for loop requires a list or string."
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

                    executeRange(
                        records,
                        body.start,
                        body.end,
                        body.indent,
                        context,
                        scope
                    );
                }

                cursor = body.end;
                continue;
            }

            if (
                /^(except|else|finally)\b/.test(
                    record.text
                )
            ) {
                throw new Error(
                    "Line " +
                    record.line +
                    ": this branch has no matching block."
                );
            }

            executeStatement(
                record,
                context,
                scope
            );

            cursor += 1;
        }

        return {
            cursor: cursor,
            signal: null
        };
    }

    function runAppliedCode(
        source,
        configuredInputs,
        configuredFiles
    ) {
        const context = {
            globals: {},
            inputs: configuredInputs.slice(),
            files: Object.assign(
                {},
                configuredFiles || {}
            ),
            output: [],
            iterations: 0
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

            executeRange(
                records,
                0,
                records.length,
                0,
                context,
                context.globals
            );

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

            const solved = keys.filter(
                function (key) {
                    return getState(key).best > 0;
                }
            ).length;

            const completed = keys.filter(
                function (key) {
                    return Boolean(
                        getState(key).completedWithSolution
                    );
                }
            ).length;

            const total = keys.reduce(
                function (sum, key) {
                    return (
                        sum +
                        Number(
                            getState(key).best || 0
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
            ).textContent = String(completed);

            document.getElementById(
                "pythonPracticeScore"
            ).textContent =
                total +
                " / " +
                keys.length * 100;

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

            const row =
                document.createElement("div");

            const label =
                document.createElement("span");

            const result =
                document.createElement("strong");

            row.className =
                passed ? "pass" : "fail";

            label.textContent = labelText;

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
                            const show =
                                workspace.hidden;

                            workspace.hidden = !show;

                            button.textContent = show
                                ? "✕ Close Workspace"
                                : "💻 Solve It Yourself";
                        } else if (
                            action === "hint"
                        ) {
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
                            const show =
                                solution.hidden;

                            solution.hidden = !show;

                            button.textContent = show
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
                                runAppliedCode(
                                    editor.value,
                                    config.inputs,
                                    config.files
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
                                runAppliedCode(
                                    editor.value,
                                    config.inputs,
                                    config.files
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

                                    current.best =
                                        Math.max(
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
                title:
                    "1. Choose the Path and Mode",
                detail:
                    "Identify the target file and select a mode that matches the intended read, write or append operation."
            },
            {
                title:
                    "2. Open with a Context Manager",
                detail:
                    "The with statement opens the resource and guarantees that Python closes it when the block ends."
            },
            {
                title:
                    "3. Read or Write the Data",
                detail:
                    "Use a method such as read(), iteration or write() that fits the required amount and direction of data."
            },
            {
                title:
                    "4. Parse or Format",
                detail:
                    "Transform raw text with the correct parser, such as csv.reader() or json.load(), instead of manual shortcuts."
            },
            {
                title:
                    "5. Close or Handle an Error",
                detail:
                    "The context manager closes the file automatically, while a focused except block can recover from an expected failure."
            }
        ];

        const steps = Array.from(
            visualizer.querySelectorAll(
                "[data-visual-step]"
            )
        );

        const stepText =
            document.getElementById(
                "pythonAppliedVisualStep"
            );

        const title =
            document.getElementById(
                "pythonAppliedVisualTitle"
            );

        const detail =
            document.getElementById(
                "pythonAppliedVisualDetail"
            );

        const dots =
            document.getElementById(
                "pythonAppliedVisualDots"
            );

        const progress =
            document.getElementById(
                "pythonAppliedVisualProgress"
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
                        document.createElement("i");

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
        const tracer = document.querySelector(
            "[data-python-tracer]"
        );

        if (!tracer) {
            return;
        }

        const codeLines = [
            "first = 18",
            "second = 0",
            "try:",
            "    print(first // second)",
            "except ZeroDivisionError:",
            "    print(\"Cannot divide by zero\")"
        ];

        const frames = [
            {
                line: 0,
                state: {
                    first: "18",
                    second: "not assigned",
                    control: "normal"
                },
                output: "",
                note:
                    "The first value 18 is assigned before entering the protected operation."
            },
            {
                line: 1,
                state: {
                    first: "18",
                    second: "0",
                    control: "normal"
                },
                output: "",
                note:
                    "The divisor receives 0, which makes the upcoming floor division unsafe."
            },
            {
                line: 2,
                state: {
                    first: "18",
                    second: "0",
                    control: "enter try"
                },
                output: "",
                note:
                    "Execution enters the try block because this operation may raise a known runtime exception."
            },
            {
                line: 3,
                state: {
                    expression: "18 // 0",
                    exception: "ZeroDivisionError",
                    control: "interrupted"
                },
                output: "",
                note:
                    "Division by zero raises ZeroDivisionError, so the remaining try statements would be skipped."
            },
            {
                line: 4,
                state: {
                    match: "ZeroDivisionError",
                    control: "except selected",
                    recovered: "yes"
                },
                output: "",
                note:
                    "Python compares the exception type and transfers control to the matching except block."
            },
            {
                line: 5,
                state: {
                    status: "handled",
                    control:
                        "continue after handler",
                    exception: "cleared"
                },
                output:
                    "Cannot divide by zero",
                note:
                    "The handler prints a useful message. Program execution is complete without a crash."
            }
        ];

        const code =
            document.getElementById(
                "pythonAppliedTraceCode"
            );

        const note =
            document.getElementById(
                "pythonAppliedTraceNote"
            );

        const live =
            document.getElementById(
                "pythonAppliedTraceState"
            );

        const output =
            document.getElementById(
                "pythonAppliedTraceOutput"
            );

        const status =
            document.getElementById(
                "pythonAppliedTraceStatus"
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
                    document.createElement("span");

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
                        document.createElement(
                            "strong"
                        );

                    const value =
                        document.createElement(
                            "span"
                        );

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

    function initializeLevelTen() {
        initializeSidebarSearch();
        initializeCopyButtons();
        initializeReveals();
        initializeQuiz();
        initializeProblems();
        initializePanels();
        initializeVisualizer();
        initializeTracer();
    }

    window.CodeBhavyaAppliedRunner =
        runAppliedCode;

    if (document.readyState === "loading") {
        document.addEventListener(
            "DOMContentLoaded",
            initializeLevelTen
        );
    } else {
        initializeLevelTen();
    }
}());
