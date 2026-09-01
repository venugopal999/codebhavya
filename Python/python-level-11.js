(function () {
    "use strict";

    const STORAGE_KEY = "codebhavya.python.level11.practice.v1";
    const MAX_CALL_DEPTH = 100;

    const problems = {
        "oop-p1": {
            starter: [
                "# Sample inputs: Bhavya and 78",
                "class Student:",
                "    def __init__(self, name, marks):",
                "        self.name = name",
                "        self.marks = marks",
                "",
                "    def result(self):",
                "        # Return Pass or Fail",
                "        return \"Check\"",
                "",
                "name = input()",
                "marks = int(input())",
                "student = Student(name, marks)",
                "print(student.name + \":\", student.result())"
            ].join("\n"),
            inputs: ["Bhavya", "78"],
            expected: "Bhavya: Pass"
        },
        "oop-p2": {
            starter: [
                "# Sample inputs: 8 and 5",
                "class Rectangle:",
                "    def __init__(self, length, width):",
                "        self.length = length",
                "        self.width = width",
                "",
                "    def area(self):",
                "        return self.length * self.width",
                "",
                "    def perimeter(self):",
                "        # Return the perimeter",
                "        return 0",
                "",
                "length = int(input())",
                "width = int(input())",
                "box = Rectangle(length, width)",
                "print(\"Area =\", box.area())",
                "print(\"Perimeter =\", box.perimeter())"
            ].join("\n"),
            inputs: ["8", "5"],
            expected: "Area = 40\nPerimeter = 26"
        },
        "oop-p3": {
            starter: [
                "# Sample inputs: 1000, 500 and 300",
                "class BankAccount:",
                "    def __init__(self, balance):",
                "        self.balance = balance",
                "",
                "    def deposit(self, amount):",
                "        self.balance += amount",
                "",
                "    def withdraw(self, amount):",
                "        # Subtract only when funds are sufficient",
                "        pass",
                "",
                "balance = int(input())",
                "deposit = int(input())",
                "withdraw = int(input())",
                "account = BankAccount(balance)",
                "account.deposit(deposit)",
                "account.withdraw(withdraw)",
                "print(\"Balance =\", account.balance)"
            ].join("\n"),
            inputs: ["1000", "500", "300"],
            expected: "Balance = 1200"
        },
        "oop-p4": {
            starter: [
                "# Sample inputs: Asha, 60000 and Python",
                "class Employee:",
                "    def __init__(self, name, salary):",
                "        self.name = name",
                "        self.salary = salary",
                "",
                "class Developer(Employee):",
                "    def __init__(self, name, salary, language):",
                "        super().__init__(name, salary)",
                "        self.language = language",
                "",
                "    def details(self):",
                "        # Return the complete summary",
                "        return self.name",
                "",
                "name = input()",
                "salary = int(input())",
                "language = input()",
                "developer = Developer(name, salary, language)",
                "print(developer.details())"
            ].join("\n"),
            inputs: ["Asha", "60000", "Python"],
            expected: "Asha | 60000 | Python"
        },
        "oop-p5": {
            starter: [
                "# Sample inputs: 6, 4 and 5",
                "class Shape:",
                "    def area(self):",
                "        return 0",
                "",
                "class Rectangle(Shape):",
                "    def __init__(self, length, width):",
                "        self.length = length",
                "        self.width = width",
                "",
                "    def area(self):",
                "        return self.length * self.width",
                "",
                "class Square(Shape):",
                "    def __init__(self, side):",
                "        self.side = side",
                "",
                "    def area(self):",
                "        # Override the base method",
                "        return 0",
                "",
                "length = int(input())",
                "width = int(input())",
                "side = int(input())",
                "rectangle = Rectangle(length, width)",
                "square = Square(side)",
                "print(\"Rectangle =\", rectangle.area())",
                "print(\"Square =\", square.area())"
            ].join("\n"),
            inputs: ["6", "4", "5"],
            expected: "Rectangle = 24\nSquare = 25"
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
                    const practice = document.querySelector(".python-practice-link");
                    group.classList.toggle(
                        "is-search-hidden",
                        !practice || practice.classList.contains("is-search-hidden")
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
        document.querySelectorAll("[data-copy-target]").forEach(function (button) {
            button.addEventListener("click", function () {
                const target = document.getElementById(button.dataset.copyTarget);

                if (target) {
                    copyText(target.textContent, button);
                }
            });
        });
    }

    function initializeReveals() {
        document.querySelectorAll("[data-reveal-target]").forEach(function (button) {
            button.dataset.closedLabel = button.textContent;

            button.addEventListener("click", function () {
                const target = document.getElementById(button.dataset.revealTarget);

                if (!target) {
                    return;
                }

                const show = target.hidden;
                target.hidden = !show;
                button.setAttribute("aria-expanded", String(show));
                button.textContent = show
                    ? (button.dataset.hideLabel || "Hide Answer")
                    : button.dataset.closedLabel;
            });
        });
    }

    function initializeQuiz() {
        const quiz = document.querySelector("[data-python-quiz]");

        if (!quiz) {
            return;
        }

        const questions = Array.from(quiz.querySelectorAll("[data-correct]"));
        const result = quiz.querySelector(".python-quiz-result");

        function clear(question) {
            const feedback = question.querySelector(".python-quiz-feedback");
            question.classList.remove("is-correct", "is-wrong");
            feedback.hidden = true;
            feedback.textContent = "";
        }

        quiz.querySelector("[data-check-quiz]").addEventListener("click", function () {
            let score = 0;
            let answered = 0;

            questions.forEach(function (question) {
                const selected = question.querySelector("input:checked");
                const feedback = question.querySelector(".python-quiz-feedback");
                const correct = Boolean(
                    selected && selected.value === question.dataset.correct
                );

                clear(question);

                if (selected) {
                    answered += 1;
                }

                if (correct) {
                    score += 1;
                }

                question.classList.add(correct ? "is-correct" : "is-wrong");
                feedback.textContent = correct
                    ? "✓ Correct"
                    : selected
                        ? "✕ Review the object-oriented rule and try again."
                        : "Please select an answer.";
                feedback.hidden = false;
            });

            if (answered < questions.length) {
                result.textContent =
                    "Answered " + answered + " of " + questions.length +
                    ". Score: " + score + "/" + questions.length;
            } else if (score === questions.length) {
                result.textContent =
                    "Excellent! " + score + "/" + questions.length +
                    " — your object-oriented concepts are clear.";
            } else if (score >= Math.ceil(questions.length * 0.6)) {
                result.textContent =
                    "Good work! " + score + "/" + questions.length +
                    " — review the marked question(s).";
            } else {
                result.textContent =
                    "Score: " + score + "/" + questions.length +
                    " — revise objects, self, inheritance and polymorphism, then try again.";
            }
        });

        quiz.querySelector("[data-reset-quiz]").addEventListener("click", function () {
            questions.forEach(function (question) {
                question.querySelectorAll("input").forEach(function (input) {
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
            return value && typeof value === "object" ? value : {};
        } catch (error) {
            return {};
        }
    }

    function saveState(state) {
        try {
            window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        } catch (error) {
            // Practice remains usable without local storage.
        }
    }

    function splitArguments(source) {
        const result = [];
        let current = "";
        let quote = "";
        let escaped = false;
        let parentheses = 0;
        let brackets = 0;

        for (let index = 0; index < source.length; index += 1) {
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

            if (character === "," && !parentheses && !brackets) {
                result.push(current.trim());
                current = "";
                continue;
            }

            current += character;
        }

        if (quote) {
            throw new Error("A string is missing its closing quote.");
        }

        if (current.trim() || source.trim()) {
            result.push(current.trim());
        }

        return result;
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

        return value.slice(1, -1)
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

        return String(value);
    }

    function removeInlineComment(source) {
        let quote = "";

        for (let index = 0; index < source.length; index += 1) {
            const character = source[index];

            if (quote) {
                if (
                    character === quote &&
                    source[index - 1] !== "\\"
                ) {
                    quote = "";
                }
            } else if (character === "\"" || character === "'") {
                quote = character;
            } else if (character === "#") {
                return source.slice(0, index).replace(/\s+$/, "");
            }
        }

        return source.replace(/\s+$/, "");
    }

    function prepareRecords(source) {
        const records = [];

        source.replace(/\r/g, "").split("\n").forEach(function (raw, index) {
            const expanded = raw.replace(/^\t+/, function (tabs) {
                return "    ".repeat(tabs.length);
            });
            const clean = removeInlineComment(expanded);

            if (!clean.trim()) {
                return;
            }

            const indent = clean.match(/^ */)[0].length;

            if (indent % 4 !== 0) {
                throw new Error(
                    "Line " + (index + 1) +
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

        if (start >= end || records[start].indent <= indent) {
            throw new Error(
                "Line " + records[cursor].line +
                ": this block needs an indented statement."
            );
        }

        let bodyEnd = start;

        while (bodyEnd < end && records[bodyEnd].indent > indent) {
            bodyEnd += 1;
        }

        return {
            start: start,
            end: bodyEnd,
            indent: records[start].indent
        };
    }

    function lookupName(name, scope, context) {
        if (Object.prototype.hasOwnProperty.call(scope, name)) {
            return scope[name];
        }

        if (Object.prototype.hasOwnProperty.call(context.globals, name)) {
            return context.globals[name];
        }

        throw new Error("NameError: " + name + " is not defined.");
    }

    function serialize(value) {
        if (value === null || value === undefined) {
            return "null";
        }

        if (typeof value === "string") {
            return JSON.stringify(value);
        }

        if (typeof value === "number" || typeof value === "boolean") {
            return String(value);
        }

        throw new Error("An object must be used through an attribute or method.");
    }

    function parseValues(source, scope, context) {
        return source.trim()
            ? splitArguments(source).map(function (part) {
                return evaluateExpression(part, scope, context);
            })
            : [];
    }

    function findMethod(context, className, methodName) {
        let current = className;

        while (current) {
            const definition = context.classes[current];

            if (!definition) {
                break;
            }

            if (
                Object.prototype.hasOwnProperty.call(
                    definition.methods,
                    methodName
                )
            ) {
                return {
                    owner: current,
                    method: definition.methods[methodName]
                };
            }

            current = definition.base;
        }

        return null;
    }

    function bindParameters(parameters, values, line) {
        if (values.length !== parameters.length) {
            throw new Error(
                "Line " + line + ": expected " + parameters.length +
                " argument(s), received " + values.length + "."
            );
        }

        const scope = {};

        parameters.forEach(function (name, index) {
            scope[name] = values[index];
        });

        return scope;
    }

    function callMethodFromClass(
        instance,
        className,
        methodName,
        values,
        context
    ) {
        const found = findMethod(context, className, methodName);

        if (!found) {
            throw new Error(
                "AttributeError: " + className +
                " has no method " + methodName + "()."
            );
        }

        if (context.callDepth >= MAX_CALL_DEPTH) {
            throw new Error(
                "RuntimeError: maximum method-call depth reached."
            );
        }

        const method = found.method;
        const parameters = method.parameters.slice(1);
        const local = bindParameters(parameters, values, method.line);

        local.self = instance;
        local.__currentClass = found.owner;
        context.callDepth += 1;

        try {
            const result = executeRange(
                method.records,
                method.body.start,
                method.body.end,
                method.body.indent,
                context,
                local
            );

            return result.signal && result.signal.type === "return"
                ? result.signal.value
                : null;
        } finally {
            context.callDepth -= 1;
        }
    }

    function callMethod(instance, methodName, values, context) {
        if (!instance || !instance.__pythonInstance) {
            throw new Error("TypeError: method call requires an object.");
        }

        return callMethodFromClass(
            instance,
            instance.className,
            methodName,
            values,
            context
        );
    }

    function instantiateClass(name, values, context) {
        const definition = context.classes[name];

        if (!definition) {
            return undefined;
        }

        const instance = {
            __pythonInstance: true,
            className: name,
            attributes: {}
        };

        const initializer = findMethod(context, name, "__init__");

        if (initializer) {
            callMethodFromClass(
                instance,
                name,
                "__init__",
                values,
                context
            );
        } else if (values.length) {
            throw new Error(
                name + "() does not accept constructor arguments."
            );
        }

        return instance;
    }

    function getAttribute(value, name, context) {
        if (value && value.__pythonInstance) {
            if (
                Object.prototype.hasOwnProperty.call(
                    value.attributes,
                    name
                )
            ) {
                return value.attributes[name];
            }

            let current = value.className;

            while (current) {
                const definition = context.classes[current];

                if (
                    definition &&
                    Object.prototype.hasOwnProperty.call(
                        definition.attributes,
                        name
                    )
                ) {
                    return definition.attributes[name];
                }

                current = definition ? definition.base : null;
            }

            throw new Error(
                "AttributeError: " + value.className +
                " object has no attribute " + name + "."
            );
        }

        throw new Error(
            "TypeError: attribute access requires an object."
        );
    }

    function callBuiltIn(name, values, context) {
        const object = instantiateClass(name, values, context);

        if (object !== undefined) {
            return object;
        }

        if (name === "input" && values.length === 0) {
            if (!context.inputs.length) {
                throw new Error(
                    "The program requested more input than the test provides."
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
                    "ValueError: int() requires a whole number."
                );
            }

            const value = Number(values[0]);

            if (!Number.isFinite(value)) {
                throw new Error("ValueError: invalid integer.");
            }

            return Math.trunc(value);
        }

        if (name === "float" && values.length === 1) {
            const value = Number(values[0]);

            if (!Number.isFinite(value)) {
                throw new Error("ValueError: invalid float.");
            }

            return value;
        }

        if (name === "str" && values.length === 1) {
            return displayValue(values[0]);
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
            name === "round" &&
            (values.length === 1 || values.length === 2)
        ) {
            const places = values.length === 2 ? values[1] : 0;
            const factor = 10 ** places;
            return Math.round(values[0] * factor) / factor;
        }

        throw new Error(
            "Unsupported or invalid call: " + name + "()."
        );
    }

    function replaceEmbedded(expression, scope, context) {
        let prepared = expression;
        let guard = 0;
        const methodPattern =
            /\b([A-Za-z_]\w*)\.([A-Za-z_]\w*)\(([^()]*)\)/;

        while (methodPattern.test(prepared) && guard < 100) {
            const match = prepared.match(methodPattern);
            const instance = lookupName(match[1], scope, context);
            const value = callMethod(
                instance,
                match[2],
                parseValues(match[3], scope, context),
                context
            );

            prepared =
                prepared.slice(0, match.index) +
                serialize(value) +
                prepared.slice(match.index + match[0].length);

            guard += 1;
        }

        const callPattern = /\b([A-Za-z_]\w*)\(([^()]*)\)/;

        while (callPattern.test(prepared) && guard < 100) {
            const match = prepared.match(callPattern);
            const value = callBuiltIn(
                match[1],
                parseValues(match[2], scope, context),
                context
            );

            prepared =
                prepared.slice(0, match.index) +
                serialize(value) +
                prepared.slice(match.index + match[0].length);

            guard += 1;
        }

        const attributePattern =
            /\b([A-Za-z_]\w*)\.([A-Za-z_]\w*)\b/;

        while (attributePattern.test(prepared) && guard < 200) {
            const match = prepared.match(attributePattern);
            const owner = lookupName(match[1], scope, context);
            const value = getAttribute(owner, match[2], context);

            prepared =
                prepared.slice(0, match.index) +
                serialize(value) +
                prepared.slice(match.index + match[0].length);

            guard += 1;
        }

        return prepared;
    }

    function replaceNames(expression, scope, context) {
        let result = "";
        let quote = "";

        for (let index = 0; index < expression.length;) {
            const character = expression[index];

            if (quote) {
                result += character;

                if (
                    character === quote &&
                    expression[index - 1] !== "\\"
                ) {
                    quote = "";
                }

                index += 1;
                continue;
            }

            if (character === "\"" || character === "'") {
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
                    ["and", "or", "not", "is"].indexOf(name) !== -1
                ) {
                    result += name;
                } else {
                    result += serialize(
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

    function evaluateExpression(source, scope, context) {
        let expression = source.trim();

        if (!expression) {
            return null;
        }

        while (
            expression[0] === "(" &&
            expression[expression.length - 1] === ")"
        ) {
            expression = expression.slice(1, -1).trim();
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

        if (/^[+-]?(?:\d+\.?\d*|\.\d+)$/.test(expression)) {
            return Number(expression);
        }

        const method = expression.match(
            /^([A-Za-z_]\w*)\.([A-Za-z_]\w*)\((.*)\)$/
        );

        if (method) {
            const instance = lookupName(method[1], scope, context);

            return callMethod(
                instance,
                method[2],
                parseValues(method[3], scope, context),
                context
            );
        }

        const attribute = expression.match(
            /^([A-Za-z_]\w*)\.([A-Za-z_]\w*)$/
        );

        if (attribute) {
            return getAttribute(
                lookupName(attribute[1], scope, context),
                attribute[2],
                context
            );
        }

        const call = expression.match(
            /^([A-Za-z_]\w*)\((.*)\)$/
        );

        if (call) {
            return callBuiltIn(
                call[1],
                parseValues(call[2], scope, context),
                context
            );
        }

        if (/^[A-Za-z_]\w*$/.test(expression)) {
            return lookupName(expression, scope, context);
        }

        expression = replaceEmbedded(expression, scope, context);

        let translated = replaceNames(expression, scope, context);

        translated = translated
            .replace(/\bis\s+not\b/g, "!==")
            .replace(/\bis\b/g, "===")
            .replace(/\band\b/g, "&&")
            .replace(/\bor\b/g, "||")
            .replace(/\bnot\b/g, "!");

        const stripped = translated
            .replace(
                /"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'/g,
                ""
            )
            .replace(/\b(?:true|false|null)\b/g, "");

        if (!/^[0-9+\-*/%().\s<>=!&|]+$/.test(stripped)) {
            throw new Error(
                "This runner supports object calls, attributes and arithmetic."
            );
        }

        try {
            return Function(
                "\"use strict\"; return (" + translated + ");"
            )();
        } catch (error) {
            throw new Error("Check the expression syntax.");
        }
    }

    function parseParameters(source, line) {
        const parameters = source.trim()
            ? splitArguments(source)
            : [];

        parameters.forEach(function (name) {
            if (!/^[A-Za-z_]\w*$/.test(name)) {
                throw new Error(
                    "Line " + line + ": invalid parameter name."
                );
            }
        });

        return parameters;
    }

    function parseClass(
        records,
        cursor,
        end,
        indent,
        name,
        base,
        context
    ) {
        if (base && !context.classes[base]) {
            throw new Error(
                "Line " + records[cursor].line +
                ": base class " + base + " is not defined."
            );
        }

        const body = getBody(records, cursor, end, indent);
        const definition = {
            name: name,
            base: base || null,
            methods: {},
            attributes: {}
        };

        let position = body.start;

        while (position < body.end) {
            const record = records[position];

            if (record.indent !== body.indent) {
                throw new Error(
                    "Line " + record.line +
                    ": unexpected class indentation."
                );
            }

            if (record.text === "pass") {
                position += 1;
                continue;
            }

            const method = record.text.match(
                /^def\s+([A-Za-z_]\w*)\s*\(([^()]*)\)\s*:\s*$/
            );

            if (method) {
                const methodBody = getBody(
                    records,
                    position,
                    body.end,
                    body.indent
                );
                const parameters = parseParameters(
                    method[2],
                    record.line
                );

                if (!parameters.length || parameters[0] !== "self") {
                    throw new Error(
                        "Line " + record.line +
                        ": instance methods must declare self first."
                    );
                }

                definition.methods[method[1]] = {
                    parameters: parameters,
                    records: records,
                    body: methodBody,
                    line: record.line
                };

                position = methodBody.end;
                continue;
            }

            const classAttribute = record.text.match(
                /^([A-Za-z_]\w*)\s*=\s*(.+)$/
            );

            if (classAttribute) {
                definition.attributes[classAttribute[1]] =
                    evaluateExpression(
                        classAttribute[2],
                        context.globals,
                        context
                    );

                position += 1;
                continue;
            }

            throw new Error(
                "Line " + record.line +
                ": class body supports methods and simple class attributes."
            );
        }

        context.classes[name] = definition;
        context.globals[name] = {
            __pythonClass: true,
            name: name
        };

        return body.end;
    }

    function parseDecision(record, first) {
        if (first) {
            const match = record.text.match(
                /^if\s+(.+)\s*:\s*$/
            );

            return match
                ? {
                    type: "if",
                    condition: match[1]
                }
                : null;
        }

        const match = record.text.match(
            /^elif\s+(.+)\s*:\s*$/
        );

        if (match) {
            return {
                type: "elif",
                condition: match[1]
            };
        }

        return /^else\s*:\s*$/.test(record.text)
            ? {
                type: "else",
                condition: null
            }
            : null;
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

        const superMatch = line.match(
            /^super\(\)\.([A-Za-z_]\w*)\((.*)\)$/
        );

        if (superMatch) {
            const current = context.classes[scope.__currentClass];

            if (!current || !current.base) {
                throw new Error(
                    "super() requires a base class."
                );
            }

            callMethodFromClass(
                scope.self,
                current.base,
                superMatch[1],
                parseValues(superMatch[2], scope, context),
                context
            );

            return null;
        }

        const printMatch = line.match(
            /^print\s*\((.*)\)\s*$/
        );

        if (printMatch) {
            const values = parseValues(
                printMatch[1],
                scope,
                context
            );

            context.output.push(
                values.map(displayValue).join(" ")
            );

            return null;
        }

        const attrAugmented = line.match(
            /^([A-Za-z_]\w*)\.([A-Za-z_]\w*)\s*(\+=|-=|\*=|\/=)\s*(.+)$/
        );

        if (attrAugmented) {
            const object = lookupName(
                attrAugmented[1],
                scope,
                context
            );
            const current = getAttribute(
                object,
                attrAugmented[2],
                context
            );
            const value = evaluateExpression(
                attrAugmented[4],
                scope,
                context
            );

            if (attrAugmented[3] === "+=") {
                object.attributes[attrAugmented[2]] =
                    current + value;
            } else if (attrAugmented[3] === "-=") {
                object.attributes[attrAugmented[2]] =
                    current - value;
            } else if (attrAugmented[3] === "*=") {
                object.attributes[attrAugmented[2]] =
                    current * value;
            } else {
                object.attributes[attrAugmented[2]] =
                    current / value;
            }

            return null;
        }

        const attrAssignment = line.match(
            /^([A-Za-z_]\w*)\.([A-Za-z_]\w*)\s*=\s*(.+)$/
        );

        if (attrAssignment) {
            const object = lookupName(
                attrAssignment[1],
                scope,
                context
            );

            if (!object || !object.__pythonInstance) {
                throw new Error(
                    "Attribute assignment requires an object."
                );
            }

            object.attributes[attrAssignment[2]] =
                evaluateExpression(
                    attrAssignment[3],
                    scope,
                    context
                );

            return null;
        }

        const augmented = line.match(
            /^([A-Za-z_]\w*)\s*(\+=|-=|\*=|\/=)\s*(.+)$/
        );

        if (augmented) {
            const current = lookupName(
                augmented[1],
                scope,
                context
            );
            const value = evaluateExpression(
                augmented[3],
                scope,
                context
            );

            if (augmented[2] === "+=") {
                scope[augmented[1]] = current + value;
            } else if (augmented[2] === "-=") {
                scope[augmented[1]] = current - value;
            } else if (augmented[2] === "*=") {
                scope[augmented[1]] = current * value;
            } else {
                scope[augmented[1]] = current / value;
            }

            return null;
        }

        const assignment = line.match(
            /^([A-Za-z_]\w*)\s*=\s*(.+)$/
        );

        if (assignment) {
            scope[assignment[1]] = evaluateExpression(
                assignment[2],
                scope,
                context
            );

            return null;
        }

        const methodCall = line.match(
            /^([A-Za-z_]\w*)\.([A-Za-z_]\w*)\((.*)\)$/
        );

        if (methodCall) {
            callMethod(
                lookupName(methodCall[1], scope, context),
                methodCall[2],
                parseValues(methodCall[3], scope, context),
                context
            );

            return null;
        }

        throw new Error(
            "Line " + record.line +
            ": use a supported assignment, method call, return, print or decision."
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
                    "Line " + record.line +
                    ": unexpected indentation."
                );
            }

            const classMatch = record.text.match(
                /^class\s+([A-Za-z_]\w*)(?:\(([A-Za-z_]\w*)\))?\s*:\s*$/
            );

            if (classMatch) {
                cursor = parseClass(
                    records,
                    cursor,
                    end,
                    indent,
                    classMatch[1],
                    classMatch[2] || null,
                    context
                );
                continue;
            }

            const decision = parseDecision(record, true);

            if (decision) {
                const branches = [];
                let branchCursor = cursor;
                let first = true;

                while (branchCursor < end) {
                    const headerRecord = records[branchCursor];

                    if (headerRecord.indent !== indent) {
                        break;
                    }

                    const header = parseDecision(
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
                    if (
                        branches[index].header.type === "else" ||
                        Boolean(
                            evaluateExpression(
                                branches[index].header.condition,
                                scope,
                                context
                            )
                        )
                    ) {
                        selected = branches[index];
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

            if (/^(elif|else)\b/.test(record.text)) {
                throw new Error(
                    "Line " + record.line +
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

    function runOopCode(source, configuredInputs) {
        const context = {
            globals: {},
            classes: {},
            inputs: configuredInputs.slice(),
            output: [],
            callDepth: 0
        };

        try {
            const records = prepareRecords(source);

            if (records.length && records[0].indent !== 0) {
                throw new Error(
                    "Line " + records[0].line +
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
                    "return can be used only inside a method."
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
            document.querySelectorAll("[data-python-problem]")
        );

        if (!cards.length) {
            return;
        }

        const state = readState();

        function getState(key) {
            if (!state[key] || typeof state[key] !== "object") {
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

            const total = keys.reduce(function (sum, key) {
                return sum + Number(getState(key).best || 0);
            }, 0);

            const percent = Math.round(
                (solved + completed) / keys.length * 100
            );

            document.getElementById(
                "pythonPracticeSolved"
            ).textContent = solved + " / " + keys.length;

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
                !current.best && current.completedWithSolution
            );

            badge.className = "python-practice-badge";

            if (current.best > 0) {
                badge.textContent = "✓ Solved";
                badge.classList.add("solved");
            } else if (current.completedWithSolution) {
                badge.textContent = "✓ Completed with Solution";
                badge.classList.add("completed");
            } else {
                badge.textContent = "";
            }

            card.querySelector(
                "[data-problem-score]"
            ).textContent =
                Number(current.best || 0) + " / 100";

            card.querySelector(
                "[data-problem-attempts]"
            ).textContent =
                String(Number(current.attempts || 0));

            card.querySelector(
                "[data-problem-status]"
            ).textContent = current.best > 0
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
            result.textContent = passed ? "PASS" : "CHECK";

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

            editor.value = current.code || config.starter;

            editor.addEventListener("input", function () {
                current.code = editor.value;
                saveState(state);
            });

            card.querySelectorAll(
                "[data-problem-action]"
            ).forEach(function (button) {
                button.addEventListener("click", function () {
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
                    } else if (action === "solution") {
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
                        const execution = runOopCode(
                            editor.value,
                            config.inputs
                        );

                        output.textContent = execution.ok
                            ? execution.output || "(No output)"
                            : "Error: " + execution.error;

                        message.textContent = execution.ok
                            ? "Program executed using the displayed sample input."
                            : "Fix the displayed error, then run the program again.";
                    } else if (action === "check") {
                        current.attempts =
                            Number(current.attempts || 0) + 1;

                        const execution = runOopCode(
                            editor.value,
                            config.inputs
                        );

                        const passed =
                            execution.ok &&
                            execution.output.trim() ===
                                config.expected.trim();

                        output.textContent = execution.ok
                            ? execution.output || "(No output)"
                            : "Error: " + execution.error;

                        if (passed) {
                            if (current.solutionViewed) {
                                current.completedWithSolution = true;
                                message.textContent =
                                    "✓ Correct output. Completed after studying the solution.";
                            } else {
                                const earned =
                                    current.hintViewed ? 90 : 100;

                                current.best = Math.max(
                                    Number(current.best || 0),
                                    earned
                                );

                                message.textContent =
                                    "✓ Excellent! Output matched. Score: " +
                                    earned + " / 100.";
                            }

                            setTest(
                                card,
                                true,
                                "Sample output matched"
                            );
                        } else {
                            message.textContent = execution.ok
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
                            "Editor reset. Write your solution and test it again.";

                        saveState(state);
                    }
                });
            });

            renderCard(card);
        });

        updateOverall();
    }

    function initializePanels() {
        document.querySelectorAll(
            "[data-python-panel-toggle]"
        ).forEach(function (button) {
            button.addEventListener("click", function () {
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
                    : button.dataset.pythonPanelToggle.indexOf(
                        "Trace"
                    ) !== -1
                        ? "▶ Open Program Tracer"
                        : "▶ Open Visualization";
            });
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
        button.style.opacity = disabled ? "0.42" : "";
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
                title: "1. Call the Class",
                detail:
                    "Student(\"Bhavya\", 78) asks the class to create a new instance using the supplied arguments."
            },
            {
                title: "2. Allocate the Instance",
                detail:
                    "Python creates a new Student object with its own identity and empty instance namespace."
            },
            {
                title: "3. Run __init__",
                detail:
                    "The new object becomes self while name and marks receive the caller’s argument values."
            },
            {
                title: "4. Store the Attributes",
                detail:
                    "Assignments create self.name = \"Bhavya\" and self.marks = 78 on this instance."
            },
            {
                title: "5. Return the Object",
                detail:
                    "The fully initialised Student object is returned and assigned to the student variable."
            }
        ];

        const steps = Array.from(
            visualizer.querySelectorAll("[data-visual-step]")
        );
        const stepText = document.getElementById(
            "pythonOopVisualStep"
        );
        const title = document.getElementById(
            "pythonOopVisualTitle"
        );
        const detail = document.getElementById(
            "pythonOopVisualDetail"
        );
        const dots = document.getElementById(
            "pythonOopVisualDots"
        );
        const progress = document.getElementById(
            "pythonOopVisualProgress"
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
                "Step " + (index + 1) +
                " of " + frames.length;

            title.textContent = frame.title;
            detail.textContent = frame.detail;

            progress.style.width =
                ((index + 1) / frames.length * 100) + "%";

            steps.forEach(function (step, stepIndex) {
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

            const atEnd = index === frames.length - 1;

            setDisabled(previous, index === 0);
            setDisabled(next, atEnd);
            setDisabled(auto, atEnd);
        }

        visualizer.querySelectorAll(
            "[data-visual-action]"
        ).forEach(function (button) {
            button.addEventListener("click", function () {
                if (button.disabled) {
                    return;
                }

                const action =
                    button.dataset.visualAction;

                if (action !== "auto") {
                    stop();
                }

                if (action === "previous") {
                    index = Math.max(0, index - 1);
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
                    timer = window.setInterval(function () {
                        if (index >= frames.length - 1) {
                            stop();
                            return;
                        }

                        index += 1;
                        render();

                        if (index === frames.length - 1) {
                            stop();
                        }
                    }, 1500);
                }

                render();
            });
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
            "class Rectangle:",
            "    def __init__(self, length, width):",
            "        self.length = length",
            "        self.width = width",
            "    def area(self): return self.length * self.width",
            "box = Rectangle(8, 5)",
            "print(box.area())"
        ];

        const frames = [
            {
                line: 5,
                state: {
                    action: "class call",
                    arguments: "8, 5",
                    box: "not assigned"
                },
                output: "",
                note:
                    "Rectangle(8, 5) requests a new Rectangle instance."
            },
            {
                line: 1,
                state: {
                    self: "new Rectangle object",
                    length: "8",
                    width: "5"
                },
                output: "",
                note:
                    "The constructor receives the new instance as self and binds both arguments."
            },
            {
                line: 2,
                state: {
                    "self.length": "8",
                    "self.width": "not stored",
                    object: "initialising"
                },
                output: "",
                note:
                    "The first assignment stores length on this object."
            },
            {
                line: 3,
                state: {
                    "self.length": "8",
                    "self.width": "5",
                    object: "ready"
                },
                output: "",
                note:
                    "The second assignment completes the instance state and box receives the object."
            },
            {
                line: 4,
                state: {
                    call: "box.area()",
                    calculation: "8 × 5",
                    result: "40"
                },
                output: "",
                note:
                    "The method reads the same object’s attributes and returns 40."
            },
            {
                line: 6,
                state: {
                    box: "Rectangle(8, 5)",
                    method: "complete",
                    result: "40"
                },
                output: "40",
                note:
                    "print receives the returned area. Program execution is complete."
            }
        ];

        const code = document.getElementById(
            "pythonOopTraceCode"
        );
        const note = document.getElementById(
            "pythonOopTraceNote"
        );
        const live = document.getElementById(
            "pythonOopTraceState"
        );
        const output = document.getElementById(
            "pythonOopTraceOutput"
        );
        const status = document.getElementById(
            "pythonOopTraceStatus"
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
                "  " + line;
            code.appendChild(row);
        });

        function stop() {
            if (timer !== null) {
                window.clearInterval(timer);
                timer = null;
            }
        }

        function updateControls() {
            const atEnd = index === frames.length - 1;

            setDisabled(previous, index < 0);
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
                    Number(line.dataset.traceLine) ===
                        frames[index].line
                );
            });

            if (index < 0) {
                note.textContent =
                    "Click Next to begin tracing.";
                live.innerHTML = "";
                output.textContent = "—";
                status.textContent =
                    "Step 0 of " + frames.length;
                updateControls();
                return;
            }

            const frame = frames[index];

            note.textContent = frame.note;
            output.textContent = frame.output || "—";
            status.textContent =
                "Step " + (index + 1) +
                " of " + frames.length;

            live.innerHTML = "";

            Object.keys(frame.state).forEach(function (name) {
                const item = document.createElement("div");
                const label = document.createElement("strong");
                const value = document.createElement("span");

                label.textContent = name;
                value.textContent = String(frame.state[name]);

                item.append(label, value);
                live.appendChild(item);
            });

            updateControls();
        }

        tracer.querySelectorAll(
            "[data-trace-action]"
        ).forEach(function (button) {
            button.addEventListener("click", function () {
                if (button.disabled) {
                    return;
                }

                const action =
                    button.dataset.traceAction;

                if (action !== "auto") {
                    stop();
                }

                if (action === "previous") {
                    index = Math.max(-1, index - 1);
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
                    timer = window.setInterval(function () {
                        if (index >= frames.length - 1) {
                            stop();
                            return;
                        }

                        index += 1;
                        render();

                        if (index === frames.length - 1) {
                            stop();
                        }
                    }, 1400);
                }

                render();
            });
        });

        render();
    }

    function initializeLevelEleven() {
        initializeSidebarSearch();
        initializeCopyButtons();
        initializeReveals();
        initializeQuiz();
        initializeProblems();
        initializePanels();
        initializeVisualizer();
        initializeTracer();
    }

    window.CodeBhavyaOopRunner = runOopCode;

    if (document.readyState === "loading") {
        document.addEventListener(
            "DOMContentLoaded",
            initializeLevelEleven
        );
    } else {
        initializeLevelEleven();
    }
}());
