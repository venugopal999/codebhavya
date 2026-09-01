(function () {
    "use strict";

    const STORAGE_KEY = "codebhavya.python.level12.practice.v1";
    const MAX_ITERATIONS = 20000;

    const problems = {
        "placement-p1": {
            starter: [
                "# Sample input: level",
                "text = input()",
                "# Compare text with its reverse",
                "print(\"Check\")"
            ].join("\n"),
            inputs: ["level"],
            expected: "Palindrome"
        },
        "placement-p2": {
            starter: [
                "# Sample inputs: 4, 7, 4, 9, 7 and 2",
                "numbers = [int(input()), int(input()), int(input()), int(input()), int(input()), int(input())]",
                "# Remove duplicates and find the second largest value",
                "print(\"Second largest =\", 0)"
            ].join("\n"),
            inputs: ["4", "7", "4", "9", "7", "2"],
            expected: "Second largest = 7"
        },
        "placement-p3": {
            starter: [
                "# Sample inputs: 2, 7, 11, 15 and target 9",
                "numbers = [int(input()), int(input()), int(input()), int(input())]",
                "target = int(input())",
                "# Find and print the first matching pair",
                "print(\"Pair not found\")"
            ].join("\n"),
            inputs: ["2", "7", "11", "15", "9"],
            expected: "Pair = 2 7"
        },
        "placement-p4": {
            starter: [
                "# Sample inputs: 3, 1, 3, 2, 1 and 5",
                "numbers = [int(input()), int(input()), int(input()), int(input()), int(input()), int(input())]",
                "unique = []",
                "# Preserve only the first occurrence of each number",
                "print(\"Unique =\", unique)"
            ].join("\n"),
            inputs: ["3", "1", "3", "2", "1", "5"],
            expected: "Unique = [3, 1, 2, 5]"
        },
        "placement-p5": {
            starter: [
                "# First list: 1, 2, 3; second list: 2, 3, 4",
                "first = [int(input()), int(input()), int(input())]",
                "second = [int(input()), int(input()), int(input())]",
                "common = []",
                "# Find distinct common values and sort them",
                "print(\"Common =\", common)"
            ].join("\n"),
            inputs: ["1", "2", "3", "2", "3", "4"],
            expected: "Common = [2, 3]"
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
        document.querySelectorAll("[data-copy-target]").forEach(function (button) {
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
    document.querySelectorAll("[data-reveal-target]").forEach(function (button) {
        button.dataset.closedLabel = button.textContent;

        button.addEventListener("click", function () {
            const target = document.getElementById(
                button.dataset.revealTarget
            );
            const indicator = button.querySelector("span");

            if (!target) {
                return;
            }

            const show = target.hidden;

            target.hidden = !show;
            button.setAttribute("aria-expanded", String(show));

            if (indicator) {
                indicator.textContent = show ? "−" : "+";
            } else {
                button.textContent = show
                    ? (button.dataset.hideLabel || "Hide Answer")
                    : button.dataset.closedLabel;
            }
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
                            ? "✕ Review the advanced Python rule and try again."
                            : "Please select an answer.";

                    feedback.hidden = false;
                });

                if (answered < questions.length) {
                    result.textContent =
                        "Answered " + answered + " of " +
                        questions.length + ". Score: " +
                        score + "/" + questions.length;
                } else if (score === questions.length) {
                    result.textContent =
                        "Excellent! " + score + "/" +
                        questions.length +
                        " — your advanced Python concepts are clear.";
                } else if (
                    score >= Math.ceil(questions.length * 0.6)
                ) {
                    result.textContent =
                        "Good work! " + score + "/" +
                        questions.length +
                        " — review the marked question(s).";
                } else {
                    result.textContent =
                        "Score: " + score + "/" +
                        questions.length +
                        " — revise generators, standard tools and complexity, then try again.";
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
            // Practice remains usable when storage is unavailable.
        }
    }

    function makeTuple(values) {
        return {
            __collectionType: "tuple",
            values: values
        };
    }

    function makeSet(values) {
        const unique = [];

        values.forEach(function (value) {
            if (!unique.some(function (item) {
                return sameValue(item, value);
            })) {
                unique.push(value);
            }
        });

        return {
            __collectionType: "set",
            values: unique
        };
    }

    function isTuple(value) {
        return Boolean(
            value && value.__collectionType === "tuple"
        );
    }

    function isSet(value) {
        return Boolean(
            value && value.__collectionType === "set"
        );
    }

    function valuesOf(value) {
        if (Array.isArray(value)) {
            return value;
        }

        if (isTuple(value) || isSet(value)) {
            return value.values;
        }

        if (typeof value === "string") {
            return Array.from(value);
        }

        throw new Error(
            "This operation requires a collection."
        );
    }

    function sameValue(left, right) {
        if (Array.isArray(left) && Array.isArray(right)) {
            return left.length === right.length &&
                left.every(function (value, index) {
                    return sameValue(value, right[index]);
                });
        }

        if (isTuple(left) && isTuple(right)) {
            return sameValue(left.values, right.values);
        }

        return left === right;
    }

    function quoteString(value) {
        return "'" +
            value
                .replace(/\\/g, "\\\\")
                .replace(/'/g, "\\'") +
            "'";
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

        if (typeof value === "string") {
            return value;
        }

        if (Array.isArray(value)) {
            return "[" +
                value.map(displayCollectionItem).join(", ") +
                "]";
        }

        if (isTuple(value)) {
            const content = value.values
                .map(displayCollectionItem)
                .join(", ");

            return "(" + content +
                (value.values.length === 1 ? "," : "") +
                ")";
        }

        if (isSet(value)) {
            if (!value.values.length) {
                return "set()";
            }

            return "{" +
                value.values.map(displayCollectionItem).join(", ") +
                "}";
        }

        return String(value);
    }

    function displayCollectionItem(value) {
        return typeof value === "string"
            ? quoteString(value)
            : displayValue(value);
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
                parentheses === 0 &&
                brackets === 0 &&
                braces === 0
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

        if (current.trim() || source.trim() !== "") {
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
            } else if (character === close) {
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

    function hasTopLevelComma(source) {
        return splitArguments(source).length > 1 ||
            /,\s*$/.test(source);
    }

    function stripOuterParentheses(source) {
        let expression = source.trim();

        while (
            isFullyWrapped(expression, "(", ")") &&
            !hasTopLevelComma(
                expression.slice(1, -1)
            )
        ) {
            expression = expression.slice(1, -1).trim();
        }

        return expression;
    }

    function parseCollectionLiteral(
        expression,
        variables,
        inputQueue
    ) {
        if (isFullyWrapped(expression, "[", "]")) {
            const inside = expression.slice(1, -1).trim();

            if (!inside) {
                return [];
            }

            return splitArguments(inside).map(function (part) {
                return evaluateExpression(
                    part,
                    variables,
                    inputQueue
                );
            });
        }

        if (isFullyWrapped(expression, "{", "}")) {
            const inside = expression.slice(1, -1).trim();

            if (!inside) {
                throw new Error(
                    "{} creates a dictionary. Use set() for an empty set."
                );
            }

            return makeSet(
                splitArguments(inside).map(function (part) {
                    return evaluateExpression(
                        part,
                        variables,
                        inputQueue
                    );
                })
            );
        }

        if (
            isFullyWrapped(expression, "(", ")") &&
            hasTopLevelComma(expression.slice(1, -1))
        ) {
            let parts = splitArguments(
                expression.slice(1, -1)
            );

            if (
                parts.length &&
                parts[parts.length - 1] === ""
            ) {
                parts = parts.slice(0, -1);
            }

            return makeTuple(
                parts
                    .filter(function (part) {
                        return part !== "";
                    })
                    .map(function (part) {
                        return evaluateExpression(
                            part,
                            variables,
                            inputQueue
                        );
                    })
            );
        }

        return undefined;
    }

    function findMembership(expression) {
        let quote = "";
        let parentheses = 0;
        let brackets = 0;
        let braces = 0;

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

            if (character === "(") {
                parentheses += 1;
                continue;
            }

            if (character === ")") {
                parentheses -= 1;
                continue;
            }

            if (character === "[") {
                brackets += 1;
                continue;
            }

            if (character === "]") {
                brackets -= 1;
                continue;
            }

            if (character === "{") {
                braces += 1;
                continue;
            }

            if (character === "}") {
                braces -= 1;
                continue;
            }

            if (parentheses || brackets || braces) {
                continue;
            }

            const match = expression.slice(index).match(
                /^\s+(not\s+in|in)\s+/
            );

            if (match) {
                return {
                    index: index,
                    end: index + match[0].length,
                    operator: match[1].replace(/\s+/g, " ")
                };
            }
        }

        return null;
    }

    function findSetOperator(expression) {
        let quote = "";
        let parentheses = 0;
        let brackets = 0;
        let braces = 0;

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

            if (character === "(") {
                parentheses += 1;
                continue;
            }

            if (character === ")") {
                parentheses -= 1;
                continue;
            }

            if (character === "[") {
                brackets += 1;
                continue;
            }

            if (character === "]") {
                brackets -= 1;
                continue;
            }

            if (character === "{") {
                braces += 1;
                continue;
            }

            if (character === "}") {
                braces -= 1;
                continue;
            }

            if (parentheses || brackets || braces) {
                continue;
            }

            if (
                character === "&" ||
                character === "|" ||
                character === "^" ||
                (
                    character === "-" &&
                    /\s/.test(expression[index - 1] || "") &&
                    /\s/.test(expression[index + 1] || "")
                )
            ) {
                return {
                    index: index,
                    operator: character
                };
            }
        }

        return null;
    }

    function collectionContains(collection, target) {
        if (typeof collection === "string") {
            return collection.indexOf(String(target)) !== -1;
        }

        return valuesOf(collection).some(function (value) {
            return sameValue(value, target);
        });
    }

    function performSetOperation(left, operator, right) {
        if (!isSet(left) || !isSet(right)) {
            throw new Error(
                "Set operators require a set on both sides."
            );
        }

        if (operator === "&") {
            return makeSet(
                left.values.filter(function (value) {
                    return collectionContains(right, value);
                })
            );
        }

        if (operator === "|") {
            return makeSet(
                left.values.concat(right.values)
            );
        }

        if (operator === "-") {
            return makeSet(
                left.values.filter(function (value) {
                    return !collectionContains(right, value);
                })
            );
        }

        return makeSet(
            left.values
                .concat(right.values)
                .filter(function (value) {
                    return collectionContains(left, value) !==
                        collectionContains(right, value);
                })
        );
    }

    function sliceCollection(
        collection,
        specification,
        variables,
        inputQueue
    ) {
        const source = valuesOf(collection);
        const parts = specification.split(":");

        if (parts.length === 1) {
            const rawIndex = evaluateExpression(
                parts[0],
                variables,
                inputQueue
            );

            if (!Number.isInteger(rawIndex)) {
                throw new Error(
                    "Collection indexes must be integers."
                );
            }

            const index = rawIndex < 0
                ? source.length + rawIndex
                : rawIndex;

            if (index < 0 || index >= source.length) {
                throw new Error(
                    "IndexError: collection index out of range."
                );
            }

            return source[index];
        }

        if (isSet(collection)) {
            throw new Error(
                "Sets do not support indexing or slicing."
            );
        }

        if (parts.length > 3) {
            throw new Error(
                "A slice can contain at most two colons."
            );
        }

        function readPart(part) {
            if (part.trim() === "") {
                return null;
            }

            const value = evaluateExpression(
                part,
                variables,
                inputQueue
            );

            if (!Number.isInteger(value)) {
                throw new Error(
                    "Slice indexes must be integers."
                );
            }

            return value;
        }

        let start = readPart(parts[0]);
        let stop = readPart(parts[1]);
        let step = 1;

        if (parts.length === 3) {
            const stepValue = readPart(parts[2]);
            step = stepValue === null ? 1 : stepValue;
        }

        if (step === 0) {
            throw new Error(
                "ValueError: slice step cannot be zero."
            );
        }

        const result = [];
        const length = source.length;

        if (step > 0) {
            start = start === null
                ? 0
                : start < 0
                    ? length + start
                    : start;

            stop = stop === null
                ? length
                : stop < 0
                    ? length + stop
                    : stop;

            start = Math.max(0, Math.min(length, start));
            stop = Math.max(0, Math.min(length, stop));

            for (
                let index = start;
                index < stop;
                index += step
            ) {
                result.push(source[index]);
            }
        } else {
            const stopWasMissing = stop === null;

            start = start === null
                ? length - 1
                : start < 0
                    ? length + start
                    : start;

            stop = stopWasMissing
                ? -1
                : stop < 0
                    ? length + stop
                    : stop;

            start = Math.max(
                -1,
                Math.min(length - 1, start)
            );
            stop = Math.max(
                -1,
                Math.min(length - 1, stop)
            );

            for (
                let index = start;
                index > stop;
                index += step
            ) {
                result.push(source[index]);
            }
        }

        if (typeof collection === "string") {
            return result.join("");
        }

        if (isTuple(collection)) {
            return makeTuple(result);
        }

        return result;
    }

    function pythonSort(values) {
        return values.slice().sort(function (left, right) {
            if (
                typeof left === "number" &&
                typeof right === "number"
            ) {
                return left - right;
            }

            return String(left).localeCompare(String(right));
        });
    }

    function applyCollectionMethod(
        base,
        method,
        source,
        variables,
        inputQueue
    ) {
        const parts = source.trim()
            ? splitArguments(source)
            : [];

        const args = parts.map(function (part) {
            return evaluateExpression(
                part,
                variables,
                inputQueue
            );
        });

        if (Array.isArray(base)) {
            if (method === "append" && args.length === 1) {
                base.push(args[0]);
                return null;
            }

            if (method === "extend" && args.length === 1) {
                base.push.apply(base, valuesOf(args[0]));
                return null;
            }

            if (
                method === "insert" &&
                args.length === 2 &&
                Number.isInteger(args[0])
            ) {
                let index = args[0];

                if (index < 0) {
                    index = Math.max(0, base.length + index);
                }

                index = Math.min(base.length, index);
                base.splice(index, 0, args[1]);
                return null;
            }

            if (method === "remove" && args.length === 1) {
                const index = base.findIndex(function (value) {
                    return sameValue(value, args[0]);
                });

                if (index === -1) {
                    throw new Error(
                        "ValueError: list.remove(x): x not in list."
                    );
                }

                base.splice(index, 1);
                return null;
            }

            if (method === "pop" && args.length <= 1) {
                if (!base.length) {
                    throw new Error(
                        "IndexError: pop from empty list."
                    );
                }

                let index = args.length
                    ? args[0]
                    : base.length - 1;

                if (!Number.isInteger(index)) {
                    throw new Error(
                        "pop() index must be an integer."
                    );
                }

                if (index < 0) {
                    index = base.length + index;
                }

                if (index < 0 || index >= base.length) {
                    throw new Error(
                        "IndexError: pop index out of range."
                    );
                }

                return base.splice(index, 1)[0];
            }

            if (method === "sort" && !args.length) {
                const sorted = pythonSort(base);

                base.splice.apply(
                    base,
                    [0, base.length].concat(sorted)
                );

                return null;
            }

            if (method === "reverse" && !args.length) {
                base.reverse();
                return null;
            }

            if (method === "count" && args.length === 1) {
                return base.filter(function (value) {
                    return sameValue(value, args[0]);
                }).length;
            }

            if (method === "index" && args.length === 1) {
                const index = base.findIndex(function (value) {
                    return sameValue(value, args[0]);
                });

                if (index === -1) {
                    throw new Error(
                        "ValueError: value is not in list."
                    );
                }

                return index;
            }

            if (method === "copy" && !args.length) {
                return base.slice();
            }
        }

        if (isTuple(base)) {
            if (method === "count" && args.length === 1) {
                return base.values.filter(function (value) {
                    return sameValue(value, args[0]);
                }).length;
            }

            if (method === "index" && args.length === 1) {
                const index = base.values.findIndex(
                    function (value) {
                        return sameValue(value, args[0]);
                    }
                );

                if (index === -1) {
                    throw new Error(
                        "ValueError: tuple.index(x): x not in tuple."
                    );
                }

                return index;
            }
        }

        if (isSet(base)) {
            if (method === "add" && args.length === 1) {
                if (!collectionContains(base, args[0])) {
                    base.values.push(args[0]);
                }

                return null;
            }

            if (
                (method === "remove" || method === "discard") &&
                args.length === 1
            ) {
                const index = base.values.findIndex(
                    function (value) {
                        return sameValue(value, args[0]);
                    }
                );

                if (index === -1 && method === "remove") {
                    throw new Error(
                        "KeyError: value is not in set."
                    );
                }

                if (index !== -1) {
                    base.values.splice(index, 1);
                }

                return null;
            }

            if (
                method === "union" &&
                args.length === 1 &&
                isSet(args[0])
            ) {
                return performSetOperation(
                    base,
                    "|",
                    args[0]
                );
            }

            if (
                method === "intersection" &&
                args.length === 1 &&
                isSet(args[0])
            ) {
                return performSetOperation(
                    base,
                    "&",
                    args[0]
                );
            }

            if (
                method === "difference" &&
                args.length === 1 &&
                isSet(args[0])
            ) {
                return performSetOperation(
                    base,
                    "-",
                    args[0]
                );
            }

            if (method === "copy" && !args.length) {
                return makeSet(base.values);
            }
        }

        if (typeof base === "string") {
            if (method === "lower" && !args.length) {
                return base.toLowerCase();
            }

            if (method === "upper" && !args.length) {
                return base.toUpperCase();
            }

            if (method === "strip" && !args.length) {
                return base.trim();
            }

            if (method === "split" && args.length <= 1) {
                return args.length
                    ? base.split(String(args[0]))
                    : base.trim().split(/\s+/);
            }

            if (method === "count" && args.length === 1) {
                const needle = String(args[0]);

                if (!needle) {
                    return base.length + 1;
                }

                let count = 0;
                let position = 0;

                while (
                    (position = base.indexOf(
                        needle,
                        position
                    )) !== -1
                ) {
                    count += 1;
                    position += needle.length;
                }

                return count;
            }
        }

        throw new Error(
            "Unsupported collection method or incorrect arguments: " +
            method + "()."
        );
    }

    function evaluateExpression(
        source,
        variables,
        inputQueue
    ) {
        let expression = source.trim();

        const literal = parseCollectionLiteral(
            expression,
            variables,
            inputQueue
        );

        if (literal !== undefined) {
            return literal;
        }

        expression = stripOuterParentheses(expression);

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

        const earlySetOperator =
            findSetOperator(expression);

        if (earlySetOperator) {
            const left = evaluateExpression(
                expression.slice(
                    0,
                    earlySetOperator.index
                ),
                variables,
                inputQueue
            );

            const right = evaluateExpression(
                expression.slice(
                    earlySetOperator.index + 1
                ),
                variables,
                inputQueue
            );

            if (isSet(left) || isSet(right)) {
                return performSetOperation(
                    left,
                    earlySetOperator.operator,
                    right
                );
            }
        }

        if (/^input\s*\((.*)\)$/.test(expression)) {
            if (!inputQueue.length) {
                throw new Error(
                    "The program requested more input values than the test provides."
                );
            }

            return inputQueue.shift();
        }

        const conversion = expression.match(
            /^(int|float|str|bool|list|tuple|set)\s*\(([\s\S]*)\)$/
        );

        if (conversion) {
            const name = conversion[1];
            const inside = conversion[2].trim();

            if (name === "set" && inside === "") {
                return makeSet([]);
            }

            if (name === "list" && inside === "") {
                return [];
            }

            if (name === "tuple" && inside === "") {
                return makeTuple([]);
            }

            const value = evaluateExpression(
                inside,
                variables,
                inputQueue
            );

            if (name === "str") {
                return displayValue(value);
            }

            if (name === "bool") {
                if (Array.isArray(value)) {
                    return value.length > 0;
                }

                if (isTuple(value) || isSet(value)) {
                    return value.values.length > 0;
                }

                return Boolean(value);
            }

            if (name === "int") {
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

            if (name === "float") {
                const number = Number(value);

                if (!Number.isFinite(number)) {
                    throw new Error(
                        "ValueError: invalid float."
                    );
                }

                return number;
            }

            if (name === "list") {
                return valuesOf(value).slice();
            }

            if (name === "tuple") {
                return makeTuple(
                    valuesOf(value).slice()
                );
            }

            return makeSet(
                valuesOf(value).slice()
            );
        }

        const builtIn = expression.match(
            /^(len|sum|max|min|sorted)\s*\(([\s\S]*)\)$/
        );

        if (builtIn) {
            const value = evaluateExpression(
                builtIn[2],
                variables,
                inputQueue
            );
            const values = valuesOf(value);

            if (builtIn[1] === "len") {
                return values.length;
            }

            if (builtIn[1] === "sorted") {
                return pythonSort(values);
            }

            if (
                builtIn[1] === "sum" &&
                !values.length
            ) {
                return 0;
            }

            if (!values.length) {
                throw new Error(
                    builtIn[1] +
                    "() requires at least one value."
                );
            }

            if (builtIn[1] === "sum") {
                if (!values.every(function (item) {
                    return typeof item === "number";
                })) {
                    throw new Error(
                        "sum() requires numeric values."
                    );
                }

                return values.reduce(
                    function (total, item) {
                        return total + item;
                    },
                    0
                );
            }

            const sorted = pythonSort(values);

            return builtIn[1] === "min"
                ? sorted[0]
                : sorted[sorted.length - 1];
        }

        const methodMatch = expression.match(
            /^(.+)\.([A-Za-z_]\w*)\(([\s\S]*)\)$/
        );

        if (methodMatch) {
            const base = evaluateExpression(
                methodMatch[1],
                variables,
                inputQueue
            );

            return applyCollectionMethod(
                base,
                methodMatch[2],
                methodMatch[3],
                variables,
                inputQueue
            );
        }

        const indexMatch = expression.match(
            /^(.+)\[([^\[\]]*)\]$/
        );

        if (indexMatch) {
            const base = evaluateExpression(
                indexMatch[1],
                variables,
                inputQueue
            );

            return sliceCollection(
                base,
                indexMatch[2],
                variables,
                inputQueue
            );
        }

        const membership = findMembership(expression);

        if (membership) {
            const left = evaluateExpression(
                expression.slice(0, membership.index),
                variables,
                inputQueue
            );

            const right = evaluateExpression(
                expression.slice(membership.end),
                variables,
                inputQueue
            );

            const included = collectionContains(
                right,
                left
            );

            return membership.operator === "not in"
                ? !included
                : included;
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

        if (/^[+-]?(?:\d+\.?\d*|\.\d+)$/.test(expression)) {
            return Number(expression);
        }

        let preparedExpression = expression;
        const embeddedIndexPattern =
            /\b([A-Za-z_]\w*)\[([^\[\]]+)\]/;
        let indexGuard = 0;

        while (
            embeddedIndexPattern.test(preparedExpression) &&
            indexGuard < 100
        ) {
            const match = preparedExpression.match(
                embeddedIndexPattern
            );

            const base = evaluateExpression(
                match[1],
                variables,
                inputQueue
            );

            const value = sliceCollection(
                base,
                match[2],
                variables,
                inputQueue
            );

            preparedExpression =
                preparedExpression.slice(0, match.index) +
                (
                    typeof value === "string"
                        ? JSON.stringify(value)
                        : String(value)
                ) +
                preparedExpression.slice(
                    match.index + match[0].length
                );

            indexGuard += 1;
        }

        preparedExpression = preparedExpression.replace(
            /\b(len|sum|max|min)\s*\(\s*([A-Za-z_]\w*)\s*\)/g,
            function (_, functionName, variableName) {
                const value = evaluateExpression(
                    functionName +
                    "(" + variableName + ")",
                    variables,
                    inputQueue
                );

                return typeof value === "string"
                    ? JSON.stringify(value)
                    : String(value);
            }
        );

        let translated = preparedExpression.replace(
            /\b[A-Za-z_]\w*\b/g,
            function (name) {
                if (
                    ["and", "or", "not", "is"].indexOf(name) !== -1
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
                        "NameError: " + name +
                        " is not defined."
                    );
                }

                const value = variables[name];

                if (
                    Array.isArray(value) ||
                    isTuple(value) ||
                    isSet(value)
                ) {
                    throw new Error(
                        "Use a collection operation for " +
                        name + "."
                    );
                }

                return JSON.stringify(value);
            }
        );

        translated = translated
            .replace(/\bis\s+not\b/g, "!==")
            .replace(/\bis\b/g, "===")
            .replace(/\band\b/g, "&&")
            .replace(/\bor\b/g, "||")
            .replace(/\bnot\b/g, "!");

        const stripped = translated
            .replace(/\b(?:true|false|null)\b/g, "")
            .replace(
                /"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'/g,
                ""
            );

        if (!/^[0-9+\-*/%().\s<>=!&|]+$/.test(stripped)) {
            throw new Error(
                "This runner supports collection operations, arithmetic and conditions."
            );
        }

        try {
            return Function(
                "\"use strict\"; return (" +
                translated + ");"
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

    function applyAugmented(current, operator, right) {
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
            const parts = printMatch[1].trim()
                ? splitArguments(printMatch[1])
                : [];

            const values = parts.map(function (part) {
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

        const indexedAssignment = line.match(
            /^([A-Za-z_]\w*)\[([^\]]+)\]\s*=\s*(.+)$/
        );

        if (indexedAssignment) {
            const name = indexedAssignment[1];
            const collection = context.variables[name];

            if (!Array.isArray(collection)) {
                throw new Error(
                    "Indexed assignment requires a list."
                );
            }

            let index = evaluateExpression(
                indexedAssignment[2],
                context.variables,
                context.inputs
            );

            if (!Number.isInteger(index)) {
                throw new Error(
                    "List indexes must be integers."
                );
            }

            if (index < 0) {
                index = collection.length + index;
            }

            if (
                index < 0 ||
                index >= collection.length
            ) {
                throw new Error(
                    "IndexError: list assignment index out of range."
                );
            }

            collection[index] = evaluateExpression(
                indexedAssignment[3],
                context.variables,
                context.inputs
            );

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

        const unpacking = line.match(
            /^([A-Za-z_]\w*(?:\s*,\s*[A-Za-z_]\w*)+)\s*=\s*(.+)$/
        );

        if (unpacking) {
            const names = unpacking[1]
                .split(",")
                .map(function (name) {
                    return name.trim();
                });

            const value = evaluateExpression(
                unpacking[2],
                context.variables,
                context.inputs
            );

            const values = valuesOf(value);

            if (names.length !== values.length) {
                throw new Error(
                    "ValueError: unpacking requires the same number of variables and values."
                );
            }

            names.forEach(function (name, index) {
                context.variables[name] = values[index];
            });

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

        if (
            /^.+\.[A-Za-z_]\w*\(([\s\S]*)\)\s*$/.test(line)
        ) {
            evaluateExpression(
                line,
                context.variables,
                context.inputs
            );

            return;
        }

        throw new Error(
            "Line " + record.line +
            ": use a supported assignment, method, print(), decision or loop statement."
        );
    }

    function getBody(records, cursor, end, indent) {
        const bodyStart = cursor + 1;

        if (
            bodyStart >= end ||
            records[bodyStart].indent <= indent
        ) {
            throw new Error(
                "Line " + records[cursor].line +
                ": this block needs an indented statement."
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

    function makeRange(source, context) {
        const parts = splitArguments(source);

        const numbers = parts.map(function (part) {
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
        });

        if (
            numbers.length < 1 ||
            numbers.length > 3
        ) {
            throw new Error(
                "range() expects one, two or three arguments."
            );
        }

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
            step > 0 ? value < stop : value > stop;
            value += step
        ) {
            values.push(value);

            if (values.length > MAX_ITERATIONS) {
                throw new Error(
                    "The generated range is too large."
                );
            }
        }

        return values;
    }

    function evaluateIterable(source, context) {
        const rangeMatch = source.match(
            /^range\s*\(([\s\S]*)\)$/
        );

        if (rangeMatch) {
            return makeRange(rangeMatch[1], context);
        }

        const value = evaluateExpression(
            source,
            context.variables,
            context.inputs
        );

        return valuesOf(value).slice();
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
                    "Line " + record.line +
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

                    if (headerRecord.indent !== indent) {
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
                /^for\s+([A-Za-z_]\w*)\s+in\s+(.+)\s*:\s*$/
            );

            if (forMatch) {
                const body = getBody(
                    records,
                    cursor,
                    end,
                    indent
                );

                const values = evaluateIterable(
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
                            "Loop stopped: iteration safety limit reached."
                        );
                    }

                    context.variables[forMatch[1]] =
                        values[index];

                    const result = executeRange(
                        records,
                        body.start,
                        body.end,
                        body.indent,
                        context
                    );

                    if (result.signal === "break") {
                        break;
                    }

                    if (result.signal === "continue") {
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
                            "Loop stopped: check whether the condition can become false."
                        );
                    }

                    const result = executeRange(
                        records,
                        body.start,
                        body.end,
                        body.indent,
                        context
                    );

                    if (result.signal === "break") {
                        break;
                    }

                    if (result.signal === "continue") {
                        continue;
                    }
                }

                cursor = body.end;
                continue;
            }

            if (/^(elif|else)\b/.test(record.text)) {
                throw new Error(
                    "Line " + record.line +
                    ": this branch has no matching if statement."
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

    function runCollectionCode(
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
            const records = prepareRecords(source);

            if (
                records.length &&
                records[0].indent !== 0
            ) {
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

            const solved = keys.filter(function (key) {
                return getState(key).best > 0;
            }).length;

            const completed = keys.filter(function (key) {
                return Boolean(
                    getState(key).completedWithSolution
                );
            }).length;

            const total = keys.reduce(function (sum, key) {
                return sum +
                    Number(getState(key).best || 0);
            }, 0);

            const percent = Math.round(
                (solved + completed) /
                keys.length * 100
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
                total + " / " +
                (keys.length * 100);

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
                String(Number(current.attempts || 0));

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
                        const execution =
                            runCollectionCode(
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

                        const execution =
                            runCollectionCode(
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
                    : button.dataset.pythonPanelToggle
                        .indexOf("Trace") !== -1
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
                title: "1. Clarify the Requirement",
                detail:
                    "Confirm the input format, expected output, constraints and duplicate-handling rules."
            },
            {
                title: "2. Build Small Examples",
                detail:
                    "Try a normal example and identify edge cases such as empty input, duplicates and no result."
            },
            {
                title: "3. Choose a Strategy",
                detail:
                    "Select the data structure and algorithm, then state their expected time and space complexity."
            },
            {
                title: "4. Implement Clearly",
                detail:
                    "Translate the plan into readable Python with meaningful names and the exact required output."
            },
            {
                title: "5. Verify the Solution",
                detail:
                    "Dry-run the code, check boundaries and confirm that the complexity matches the explanation."
            }
        ];

        const steps = Array.from(
            visualizer.querySelectorAll(
                "[data-visual-step]"
            )
        );

        const stepText = document.getElementById(
            "pythonPlacementVisualStep"
        );
        const title = document.getElementById(
            "pythonPlacementVisualTitle"
        );
        const detail = document.getElementById(
            "pythonPlacementVisualDetail"
        );
        const dots = document.getElementById(
            "pythonPlacementVisualDots"
        );
        const progress = document.getElementById(
            "pythonPlacementVisualProgress"
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
                ((index + 1) /
                frames.length * 100) + "%";

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

            const atEnd =
                index === frames.length - 1;

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
            "numbers = [2, 7, 11, 15]",
            "target = 9",
            "for i in range(len(numbers)):",
            "    for j in range(i + 1, len(numbers)):",
            "        if numbers[i] + numbers[j] == target:",
            "            print(\"Pair =\", numbers[i], numbers[j])",
            "            break"
        ];

        const frames = [
            {
                line: 0,
                state: {
                    numbers: "[2, 7, 11, 15]",
                    target: "—",
                    pair: "—"
                },
                output: "",
                note:
                    "Create the input list containing four candidate values."
            },
            {
                line: 1,
                state: {
                    numbers: "[2, 7, 11, 15]",
                    target: "9",
                    pair: "—"
                },
                output: "",
                note:
                    "Store the required target sum as 9."
            },
            {
                line: 2,
                state: {
                    i: "0",
                    "numbers[i]": "2",
                    j: "not started"
                },
                output: "",
                note:
                    "The outer loop selects the first value at index 0."
            },
            {
                line: 3,
                state: {
                    i: "0",
                    j: "1",
                    candidate: "2 + 7"
                },
                output: "",
                note:
                    "The inner loop selects the next value, avoiding reuse of the same index."
            },
            {
                line: 4,
                state: {
                    calculation: "2 + 7",
                    result: "9",
                    condition: "True"
                },
                output: "",
                note:
                    "The candidate sum equals the target, so the condition succeeds."
            },
            {
                line: 5,
                state: {
                    pair: "2, 7",
                    target: "9",
                    status: "found"
                },
                output: "Pair = 2 7",
                note:
                    "Display the matching values and stop searching. Program execution is complete."
            }
        ];

        const code = document.getElementById(
            "pythonPlacementTraceCode"
        );
        const note = document.getElementById(
            "pythonPlacementTraceNote"
        );
        const live = document.getElementById(
            "pythonPlacementTraceState"
        );
        const output = document.getElementById(
            "pythonPlacementTraceOutput"
        );
        const status = document.getElementById(
            "pythonPlacementTraceStatus"
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
            const atEnd =
                index === frames.length - 1;

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

    function initializeLevelTwelve() {
        initializeSidebarSearch();
        initializeCopyButtons();
        initializeReveals();
        initializeQuiz();
        initializeProblems();
        initializePanels();
        initializeVisualizer();
        initializeTracer();
    }

    window.CodeBhavyaPlacementRunner =
        runCollectionCode;

    if (document.readyState === "loading") {
        document.addEventListener(
            "DOMContentLoaded",
            initializeLevelTwelve
        );
    } else {
        initializeLevelTwelve();
    }
}());
