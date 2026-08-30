(function () {
    "use strict";

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
            document.querySelectorAll(".sidebar .python-sidebar-group")
        );

        if (!input) {
            return;
        }

        function filterLessonTopics() {
            const query = normalizeSearch(input.value);
            let matches = 0;

            links.forEach(function (link) {
                const searchable = normalizeSearch(
                    (link.dataset.search || "") + " " + link.textContent
                );

                const matchesQuery =
                    !query || searchable.indexOf(query) !== -1;

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
                    group.classList.remove("is-search-hidden");
                    return;
                }

                if (index < 3) {
                    const startLevel = index * 4 + 1;
                    const endLevel = startLevel + 3;

                    const visibleInGroup = levelLinks.some(function (link) {
                        const level = Number(link.dataset.level);

                        return (
                            level >= startLevel &&
                            level <= endLevel &&
                            !link.classList.contains("is-search-hidden")
                        );
                    });

                    group.classList.toggle(
                        "is-search-hidden",
                        !visibleInGroup
                    );
                } else {
                    const practiceLink =
                        document.querySelector(".python-practice-link");

                    group.classList.toggle(
                        "is-search-hidden",
                        !practiceLink ||
                        practiceLink.classList.contains("is-search-hidden")
                    );
                }
            });

            if (empty) {
                empty.hidden = !query || matches > 0;
            }
        }

        input.addEventListener("input", filterLessonTopics);
    }

    function copyText(text, button) {
        const originalText = button.textContent;

        function showResult(message) {
            button.textContent = message;

            window.setTimeout(function () {
                button.textContent = originalText;
            }, 1200);
        }

        if (navigator.clipboard && navigator.clipboard.writeText) {
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

        const textArea = document.createElement("textarea");

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
        document
            .querySelectorAll("[data-copy-target]")
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

    function initializeLessonReveals() {
        document
            .querySelectorAll("[data-reveal-target]")
            .forEach(function (button) {
                button.dataset.closedLabel = button.textContent;

                button.addEventListener("click", function () {
                    const target = document.getElementById(
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
                        ? button.dataset.hideLabel || "Hide Solution"
                        : button.dataset.closedLabel;
                });
            });
    }

    function initializeLessonQuiz() {
        const quiz = document.querySelector("[data-python-quiz]");

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
            const feedback = question.querySelector(
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

        if (checkButton) {
            checkButton.addEventListener("click", function () {
                let score = 0;
                let answered = 0;

                questions.forEach(function (question) {
                    const selected =
                        question.querySelector("input:checked");

                    const feedback =
                        question.querySelector(
                            ".python-quiz-feedback"
                        );

                    const isCorrect = Boolean(
                        selected &&
                        selected.value === question.dataset.correct
                    );

                    clearQuestion(question);

                    if (selected) {
                        answered += 1;
                    }

                    if (isCorrect) {
                        score += 1;

                        question.classList.add("is-correct");

                        if (feedback) {
                            feedback.textContent = "✓ Correct";
                            feedback.hidden = false;
                        }
                    } else {
                        question.classList.add("is-wrong");

                        if (feedback) {
                            feedback.textContent = selected
                                ? "✕ Not correct. Review the concept and try again."
                                : "Please select an answer.";

                            feedback.hidden = false;
                        }
                    }
                });

                if (result) {
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
                            " — Level 1 concepts are clear.";
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
                            " — revisit the lesson and try again.";
                    }
                }
            });
        }

        if (resetButton) {
            resetButton.addEventListener("click", function () {
                questions.forEach(function (question) {
                    question
                        .querySelectorAll("input")
                        .forEach(function (input) {
                            input.checked = false;
                        });

                    clearQuestion(question);
                });

                if (result) {
                    result.textContent = "";
                }

                if (questions[0]) {
                    questions[0].scrollIntoView({
                        behavior: "smooth",
                        block: "center"
                    });
                }
            });
        }
    }

    const PRACTICE_STORAGE_KEY =
        "codebhavya.python.level1.practice.v1";

    const foundationProblems = {
        "foundation-p1": {
            starter: [
                "# Display the exact welcome message",
                "print(\"\")"
            ].join("\n"),

            expected: "Hello, Python!"
        },

        "foundation-p2": {
            starter: [
                "# Display the details on three separate lines",
                "print(\"Name: \")",
                "print(\"Course: \")",
                "print(\"Goal: \")"
            ].join("\n"),

            expected: [
                "Name: Venu",
                "Course: Python Foundations",
                "Goal: Build strong basics"
            ].join("\n")
        },

        "foundation-p3": {
            starter: [
                "# Display the label and calculated result",
                "print(\"10 + 5 =\", 0)"
            ].join("\n"),

            expected: "10 + 5 = 15"
        },

        "foundation-p4": {
            starter: [
                "# Create the three-line course banner",
                "print(\"\")",
                "print(\"\")",
                "print(\"\")"
            ].join("\n"),

            expected: [
                "====================",
                " CODEBHAVYA PYTHON",
                "===================="
            ].join("\n")
        },

        "foundation-p5": {
            starter: [
                "if True:",
                "print(\"Ready\")",
                "Print(\"Program finished\")"
            ].join("\n"),

            expected: [
                "Ready",
                "Program finished"
            ].join("\n")
        }
    };

    function safelyReadPracticeState() {
        try {
            const saved = JSON.parse(
                window.localStorage.getItem(
                    PRACTICE_STORAGE_KEY
                ) || "{}"
            );

            return saved && typeof saved === "object"
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
             * Practice continues during the current visit
             * if browser storage is unavailable.
             */
        }
    }

    function splitPythonArguments(source) {
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
                current += character;
                continue;
            }

            if (character === ")") {
                depth -= 1;
                current += character;
                continue;
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
                "The string is missing a closing quote."
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

    function decodePythonString(token) {
        const quote = token[0];

        if (
            (quote !== "\"" && quote !== "'") ||
            token[token.length - 1] !== quote
        ) {
            return null;
        }

        return token
            .slice(1, -1)
            .replace(/\\n/g, "\n")
            .replace(/\\t/g, "\t")
            .replace(/\\"/g, "\"")
            .replace(/\\'/g, "'")
            .replace(/\\\\/g, "\\");
    }

    function evaluateFoundationExpression(token) {
        const value = token.trim();

        if (!value) {
            return "";
        }

        const stringValue =
            decodePythonString(value);

        if (stringValue !== null) {
            return stringValue;
        }

        const repetition = value.match(
            /^((?:"[^"]*"|'[^']*'))\s*\*\s*(\d+)$/
        );

        if (repetition) {
            const repeated =
                decodePythonString(repetition[1]);

            return repeated.repeat(
                Number(repetition[2])
            );
        }

        if (/^[0-9+\-*/().\s]+$/.test(value)) {
            try {
                const result = Function(
                    "\"use strict\"; return (" +
                    value +
                    ");"
                )();

                if (
                    typeof result === "number" &&
                    Number.isFinite(result)
                ) {
                    return String(result);
                }
            } catch (error) {
                throw new Error(
                    "The arithmetic expression is incomplete."
                );
            }
        }

        if (
            value === "True" ||
            value === "False"
        ) {
            return value;
        }

        throw new Error(
            "This Level 1 runner currently supports strings, " +
            "numbers, simple arithmetic and print()."
        );
    }

    function runFoundationCode(source) {
        const output = [];

        const lines = source
            .replace(/\r/g, "")
            .split("\n");

        let activeBlock = null;

        try {
            lines.forEach(function (rawLine, index) {
                const indentation = rawLine
                    .match(/^\s*/)[0]
                    .replace(/\t/g, "    ")
                    .length;

                const line = rawLine.trim();

                if (
                    !line ||
                    line.startsWith("#")
                ) {
                    return;
                }

                const condition = line.match(
                    /^if\s+(True|False)\s*:\s*$/
                );

                if (condition) {
                    activeBlock = {
                        indentation: indentation,
                        execute: condition[1] === "True",
                        line: index + 1,
                        hasStatement: false
                    };

                    return;
                }

                if (activeBlock) {
                    if (
                        indentation <=
                        activeBlock.indentation
                    ) {
                        if (!activeBlock.hasStatement) {
                            throw new Error(
                                "Line " +
                                (index + 1) +
                                ": an indented block is required " +
                                "after the if statement."
                            );
                        }

                        activeBlock = null;
                    } else {
                        activeBlock.hasStatement = true;

                        if (!activeBlock.execute) {
                            return;
                        }
                    }
                }

                const printMatch = line.match(
                    /^print\s*\((.*)\)\s*$/
                );

                if (!printMatch) {
                    throw new Error(
                        "Line " +
                        (index + 1) +
                        ": check the function name, " +
                        "parentheses and indentation."
                    );
                }

                const argumentsList =
                    splitPythonArguments(
                        printMatch[1]
                    );

                const printedValues =
                    argumentsList.map(
                        evaluateFoundationExpression
                    );

                output.push(
                    printedValues.join(" ")
                );
            });

            if (
                activeBlock &&
                !activeBlock.hasStatement
            ) {
                throw new Error(
                    "Line " +
                    activeBlock.line +
                    ": an indented block is required " +
                    "after the if statement."
                );
            }

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

        const state =
            safelyReadPracticeState();

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
                    code: foundationProblems[key].starter
                };
            }

            return state[key];
        }

        function updateOverall() {
            const keys =
                Object.keys(foundationProblems);

            const solved = keys.filter(
                function (key) {
                    return (
                        Number(
                            problemState(key).best
                        ) > 0
                    );
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

            const totalScore = keys.reduce(
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

            const solvedElement =
                document.getElementById(
                    "pythonPracticeSolved"
                );

            const completedElement =
                document.getElementById(
                    "pythonPracticeCompleted"
                );

            const scoreElement =
                document.getElementById(
                    "pythonPracticeScore"
                );

            const percentElement =
                document.getElementById(
                    "pythonPracticePercent"
                );

            const progress =
                document.getElementById(
                    "pythonPracticeProgressBar"
                );

            if (solvedElement) {
                solvedElement.textContent =
                    solved + " / " + keys.length;
            }

            if (completedElement) {
                completedElement.textContent =
                    String(completed);
            }

            if (scoreElement) {
                scoreElement.textContent =
                    totalScore +
                    " / " +
                    keys.length * 100;
            }

            if (percentElement) {
                percentElement.textContent =
                    percent + "%";
            }

            if (progress) {
                progress.style.width =
                    percent + "%";
            }
        }

        function renderCard(card) {
            const key =
                card.dataset.pythonProblem;

            const current =
                problemState(key);

            const badge =
                card.querySelector(
                    "[data-problem-badge]"
                );

            const score =
                card.querySelector(
                    "[data-problem-score]"
                );

            const attempts =
                card.querySelector(
                    "[data-problem-attempts]"
                );

            const status =
                card.querySelector(
                    "[data-problem-status]"
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

            if (badge) {
                badge.className =
                    "python-practice-badge";

                if (current.best > 0) {
                    badge.textContent =
                        "✓ Solved";

                    badge.classList.add(
                        "solved"
                    );
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
            }

            if (score) {
                score.textContent =
                    Number(current.best || 0) +
                    " / 100";
            }

            if (attempts) {
                attempts.textContent =
                    String(
                        Number(
                            current.attempts || 0
                        )
                    );
            }

            if (status) {
                status.textContent =
                    current.best > 0
                        ? "Solved"
                        : current.completedWithSolution
                            ? "Completed with Solution"
                            : current.attempts
                                ? "In Progress"
                                : "Not Solved";
            }
        }

        function setTestResult(
            card,
            passed,
            message
        ) {
            const tests =
                card.querySelector(
                    "[data-problem-tests]"
                );

            if (!tests) {
                return;
            }

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
                foundationProblems[key];

            const current =
                problemState(key);

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

            if (!config || !editor) {
                return;
            }

            editor.value =
                current.code ||
                config.starter;

            editor.addEventListener(
                "input",
                function () {
                    current.code =
                        editor.value;

                    safelySavePracticeState(
                        state
                    );
                }
            );

            card
                .querySelectorAll(
                    "[data-problem-action]"
                )
                .forEach(function (button) {
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
                                    runFoundationCode(
                                        editor.value
                                    );

                                if (execution.ok) {
                                    output.textContent =
                                        execution.output ||
                                        "(No output)";

                                    if (message) {
                                        message.textContent =
                                            "Program executed in the Level 1 browser practice runner.";
                                    }
                                } else {
                                    output.textContent =
                                        "Error: " +
                                        execution.error;

                                    if (message) {
                                        message.textContent =
                                            "Fix the displayed error, then run the program again.";
                                    }
                                }
                            }

                            if (action === "check") {
                                current.attempts =
                                    Number(
                                        current.attempts ||
                                        0
                                    ) + 1;

                                const execution =
                                    runFoundationCode(
                                        editor.value
                                    );

                                const actual =
                                    execution.ok
                                        ? execution.output.trim()
                                        : "";

                                const expected =
                                    config.expected.trim();

                                const passed =
                                    execution.ok &&
                                    actual === expected;

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

                                        if (message) {
                                            message.textContent =
                                                "✓ Correct output. Completed after studying the solution.";
                                        }
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

                                        if (message) {
                                            message.textContent =
                                                "✓ Excellent! All expected output matched. Score: " +
                                                earned +
                                                " / 100.";
                                        }
                                    }

                                    setTestResult(
                                        card,
                                        true,
                                        "Expected output matched"
                                    );
                                } else {
                                    if (message) {
                                        message.textContent =
                                            execution.ok
                                                ? "The program ran, but the output does not exactly match the expected output."
                                                : "Correct the program error and check again.";
                                    }

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

                                    const result =
                                        row.querySelector(
                                            "strong"
                                        );

                                    if (result) {
                                        result.textContent =
                                            "—";
                                    }
                                }

                                if (message) {
                                    message.textContent =
                                        "Editor reset. Write your solution and test it again.";
                                }

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
        document
            .querySelectorAll(
                "[data-python-panel-toggle]"
            )
            .forEach(function (button) {
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

                        panel.hidden =
                            !willShow;

                        button.setAttribute(
                            "aria-expanded",
                            String(willShow)
                        );

                        button.textContent =
                            willShow
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

    function initializeFoundationVisualizer() {
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
                    "1. Write Clear Source Code",

                detail:
                    "Create readable Python instructions using correct syntax, matching quotes and consistent indentation."
            },
            {
                title:
                    "2. Save the Program",

                detail:
                    "Store the source code in a file with the .py extension, such as first_program.py."
            },
            {
                title:
                    "3. Interpreter Reads the Code",

                detail:
                    "The Python interpreter reads the program and checks whether its instructions follow Python syntax."
            },
            {
                title:
                    "4. Statements Execute in Order",

                detail:
                    "Python normally performs statements from top to bottom, evaluating expressions and calling functions such as print()."
            },
            {
                title:
                    "5. Inspect Output or Error",

                detail:
                    "The program displays its result. If something is invalid, Python reports an error type, line and message for debugging."
            }
        ];

        const flowSteps = Array.from(
            visualizer.querySelectorAll(
                "[data-visual-step]"
            )
        );

        const stepText =
            document.getElementById(
                "pythonVisualStep"
            );

        const title =
            document.getElementById(
                "pythonVisualTitle"
            );

        const detail =
            document.getElementById(
                "pythonVisualDetail"
            );

        const dots =
            document.getElementById(
                "pythonVisualDots"
            );

        const progress =
            document.getElementById(
                "pythonVisualProgress"
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
                (index + 1) /
                frames.length *
                100 +
                "%";

            flowSteps.forEach(
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
        }

        visualizer
            .querySelectorAll(
                "[data-visual-action]"
            )
            .forEach(function (button) {
                button.addEventListener(
                    "click",
                    function () {
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
                        }

                        if (action === "next") {
                            index = Math.min(
                                frames.length - 1,
                                index + 1
                            );
                        }

                        if (action === "reset") {
                            index = 0;
                        }

                        if (action === "pause") {
                            stop();
                        }

                        if (action === "auto") {
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

    function initializeFoundationTracer() {
        const tracer =
            document.querySelector(
                "[data-python-tracer]"
            );

        if (!tracer) {
            return;
        }

        const codeLines = [
            "course = \"CodeBhavya\"",
            "lessons = 3",
            "print(course)",
            "lessons = lessons + 1",
            "print(\"Lessons =\", lessons)",
            "print(\"Ready to learn!\")"
        ];

        const steps = [
            {
                line: 0,

                state: {
                    course: "\"CodeBhavya\"",
                    lessons: "—",
                    expression: "—"
                },

                output: "",

                note:
                    "Create course and store the string CodeBhavya."
            },
            {
                line: 1,

                state: {
                    course: "\"CodeBhavya\"",
                    lessons: "3",
                    expression: "—"
                },

                output: "",

                note:
                    "Create lessons and store the integer 3."
            },
            {
                line: 2,

                state: {
                    course: "\"CodeBhavya\"",
                    lessons: "3",
                    expression: "print(course)"
                },

                output:
                    "CodeBhavya",

                note:
                    "Read course and display its value."
            },
            {
                line: 3,

                state: {
                    course: "\"CodeBhavya\"",
                    lessons: "4",
                    expression: "3 + 1"
                },

                output:
                    "CodeBhavya",

                note:
                    "Calculate lessons + 1 and store the new value 4."
            },
            {
                line: 4,

                state: {
                    course: "\"CodeBhavya\"",
                    lessons: "4",
                    expression: "print(...)"
                },

                output:
                    "CodeBhavya\nLessons = 4",

                note:
                    "Display the label and current value of lessons."
            },
            {
                line: 5,

                state: {
                    course: "\"CodeBhavya\"",
                    lessons: "4",
                    expression: "print(...)"
                },

                output:
                    "CodeBhavya\n" +
                    "Lessons = 4\n" +
                    "Ready to learn!",

                note:
                    "Display the final message. Program execution is complete."
            }
        ];

        const code =
            document.getElementById(
                "pythonTraceCode"
            );

        const note =
            document.getElementById(
                "pythonTraceNote"
            );

        const liveState =
            document.getElementById(
                "pythonTraceState"
            );

        const output =
            document.getElementById(
                "pythonTraceOutput"
            );

        const status =
            document.getElementById(
                "pythonTraceStatus"
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

        function render() {
            code
                .querySelectorAll(
                    "[data-trace-line]"
                )
                .forEach(function (line) {
                    line.classList.toggle(
                        "is-active",
                        index >= 0 &&
                        Number(
                            line.dataset.traceLine
                        ) === steps[index].line
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

                return;
            }

            const step = steps[index];

            note.textContent =
                step.note;

            output.textContent =
                step.output || "—";

            status.textContent =
                "Step " +
                (index + 1) +
                " of " +
                steps.length;

            liveState.innerHTML = "";

            Object.keys(step.state).forEach(
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
                        String(
                            step.state[name]
                        );

                    item.append(label, value);

                    liveState.appendChild(item);
                }
            );
        }

        tracer
            .querySelectorAll(
                "[data-trace-action]"
            )
            .forEach(function (button) {
                button.addEventListener(
                    "click",
                    function () {
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
                        }

                        if (action === "next") {
                            index = Math.min(
                                steps.length - 1,
                                index + 1
                            );
                        }

                        if (action === "reset") {
                            index = -1;
                        }

                        if (action === "pause") {
                            stop();
                        }

                        if (action === "auto") {
                            stop();

                            if (
                                index >=
                                steps.length - 1
                            ) {
                                index = -1;
                            }

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

    function initializeLevelOne() {
        initializeLessonSidebarSearch();
        initializeLessonCodeCopy();
        initializeLessonReveals();
        initializeLessonQuiz();
        initializeProgrammingProblems();
        initializeStandardPanels();
        initializeFoundationVisualizer();
        initializeFoundationTracer();
    }

    if (document.readyState === "loading") {
        document.addEventListener(
            "DOMContentLoaded",
            initializeLevelOne
        );
    } else {
        initializeLevelOne();
    }
}());

/* =========================================================
   FINAL-STEP BUTTON LOCK — VISUALIZER AND PROGRAM TRACER
   ========================================================= */

(function () {
    "use strict";

    function setButtonDisabled(button, disabled) {
        if (!button) {
            return;
        }

        button.disabled = disabled;
        button.setAttribute("aria-disabled", String(disabled));
        button.classList.toggle("is-disabled", disabled);

        button.style.opacity = disabled ? "0.42" : "";
        button.style.cursor = disabled ? "not-allowed" : "";
        button.style.pointerEvents = disabled ? "none" : "";
        button.style.filter = disabled ? "grayscale(0.55)" : "";
        button.style.transform = disabled ? "none" : "";
        button.style.boxShadow = disabled ? "none" : "";
    }

    function readStepInformation(statusElement) {
        if (!statusElement) {
            return null;
        }

        const match = statusElement.textContent.match(
            /Step\s+(\d+)\s+of\s+(\d+)/i
        );

        if (!match) {
            return null;
        }

        return {
            current: Number(match[1]),
            total: Number(match[2])
        };
    }

    function connectButtonState(options) {
        const container = document.querySelector(options.container);
        const statusElement = document.querySelector(options.status);

        if (!container || !statusElement) {
            return;
        }

        const previousButton = container.querySelector(
            "[" + options.attribute + '="previous"]'
        );

        const nextButton = container.querySelector(
            "[" + options.attribute + '="next"]'
        );

        const autoButton = container.querySelector(
            "[" + options.attribute + '="auto"]'
        );

        function updateButtons() {
            const step = readStepInformation(statusElement);

            if (!step) {
                return;
            }

            const atBeginning = step.current <= options.firstStep;
            const atEnd = step.current >= step.total;

            setButtonDisabled(previousButton, atBeginning);
            setButtonDisabled(nextButton, atEnd);
            setButtonDisabled(autoButton, atEnd);
        }

        const observer = new MutationObserver(updateButtons);

        observer.observe(statusElement, {
            childList: true,
            characterData: true,
            subtree: true
        });

        container.addEventListener("click", function () {
            window.setTimeout(updateButtons, 0);
        });

        updateButtons();
    }

    function initializeFinalButtonLocks() {
        connectButtonState({
            container: "[data-python-visualizer]",
            status: "#pythonVisualStep",
            attribute: "data-visual-action",
            firstStep: 1
        });

        connectButtonState({
            container: "[data-python-tracer]",
            status: "#pythonTraceStatus",
            attribute: "data-trace-action",
            firstStep: 0
        });
    }

    if (document.readyState === "loading") {
        document.addEventListener(
            "DOMContentLoaded",
            initializeFinalButtonLocks
        );
    } else {
        initializeFinalButtonLocks();
    }
}());
