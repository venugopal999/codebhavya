(function () {
    "use strict";

    const STORAGE_KEY = "codebhavya.python.course.progress.v1";
    const DEMO_KEY = "codebhavya.python.home.demo.v1";
    const TOTAL_LEVELS = 12;

    const levelFiles = {
        1: "level-01-python-foundations.html",
        2: "level-02-data-types-io.html",
        3: "level-03-operators-expressions.html",
        4: "level-04-decision-making.html",
        5: "level-05-loops-patterns.html",
        6: "level-06-strings.html",
        7: "level-07-lists-tuples-sets.html",
        8: "level-08-dictionaries.html",
        9: "level-09-functions-recursion.html",
        10: "level-10-modules-exceptions-files.html",
        11: "level-11-object-oriented-python.html",
        12: "level-12-advanced-python-placement.html"
    };

    const levelNames = {
        1: "Python Foundations",
        2: "Data Types & I/O",
        3: "Operators & Expressions",
        4: "Decision Making",
        5: "Loops & Patterns",
        6: "Strings",
        7: "Lists, Tuples & Sets",
        8: "Dictionaries",
        9: "Functions & Recursion",
        10: "Modules, Exceptions & Files",
        11: "Object-Oriented Python",
        12: "Advanced Python & Placement"
    };

    const demos = {
        hello: {
            title: "Hello, Python",
            code: [
                "# Python displays text with print()",
                "course = \"CodeBhavya Python\"",
                "print(\"Hello, Python!\")",
                "print(course)"
            ].join("\n"),
            output: "Hello, Python!\nCodeBhavya Python",
            explanation:
                "Python executes these statements from top to bottom. " +
                "The variable stores text, and each print() call writes one line."
        },

        variables: {
            title: "Variables and Expressions",
            code: [
                "price = 120",
                "quantity = 3",
                "discount = 30",
                "total = price * quantity - discount",
                "print(f\"Total: ₹{total}\")"
            ].join("\n"),
            output: "Total: ₹330",
            explanation:
                "The expression first multiplies price by quantity, then " +
                "subtracts the discount. The f-string inserts the calculated " +
                "value into the output."
        },

        decision: {
            title: "Decision Making",
            code: [
                "marks = 82",
                "",
                "if marks >= 75:",
                "    result = \"Distinction\"",
                "elif marks >= 40:",
                "    result = \"Pass\"",
                "else:",
                "    result = \"Try Again\"",
                "",
                "print(result)"
            ].join("\n"),
            output: "Distinction",
            explanation:
                "Because 82 is at least 75, the first condition is true. " +
                "Python enters that block and skips the remaining alternatives."
        },

        loop: {
            title: "Loop and Accumulator",
            code: [
                "numbers = [4, 7, 2, 9]",
                "total = 0",
                "",
                "for number in numbers:",
                "    total += number",
                "",
                "print(\"Sum =\", total)"
            ].join("\n"),
            output: "Sum = 22",
            explanation:
                "The loop visits every list element. During each iteration, " +
                "the current number is added to total, so total becomes " +
                "4, 11, 13 and finally 22."
        },

        collections: {
            title: "Dictionary Counting",
            code: [
                "letters = \"banana\"",
                "frequency = {}",
                "",
                "for letter in letters:",
                "    frequency[letter] = frequency.get(letter, 0) + 1",
                "",
                "print(frequency)"
            ].join("\n"),
            output: "{'b': 1, 'a': 3, 'n': 2}",
            explanation:
                "The dictionary maps each character to its count. " +
                "get(letter, 0) safely supplies zero the first time " +
                "a character appears."
        },

        function: {
            title: "Reusable Function",
            code: [
                "def is_even(number):",
                "    return number % 2 == 0",
                "",
                "values = [5, 8, 11, 14]",
                "even_values = [",
                "    value for value in values",
                "    if is_even(value)",
                "]",
                "print(even_values)"
            ].join("\n"),
            output: "[8, 14]",
            explanation:
                "is_even() returns a Boolean result. The list comprehension " +
                "calls it for each value and keeps only the numbers for which " +
                "it returns True."
        }
    };

    function safelyReadProgress() {
        try {
            const saved = JSON.parse(
                window.localStorage.getItem(STORAGE_KEY) || "[]"
            );

            if (!Array.isArray(saved)) {
                return [];
            }

            return saved
                .map(Number)
                .filter(function (level, index, values) {
                    return (
                        Number.isInteger(level) &&
                        level >= 1 &&
                        level <= TOTAL_LEVELS &&
                        values.indexOf(level) === index
                    );
                })
                .sort(function (first, second) {
                    return first - second;
                });
        } catch (error) {
            return [];
        }
    }

    function safelySaveProgress(progress) {
        try {
            window.localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(progress)
            );
        } catch (error) {
            /*
             * Progress remains active for the current page
             * when browser storage is unavailable.
             */
        }
    }

    function initializeCourseProgress() {
        const count =
            document.getElementById("pythonCompletedCount");

        const percentText =
            document.getElementById("pythonProgressPercent");

        const bar =
            document.getElementById("pythonProgressBar");

        const track =
            document.getElementById("pythonProgressTrack");

        const resumeLink =
            document.getElementById("pythonResumeLink");

        const reset =
            document.getElementById("pythonResetProgress");

        const buttons = Array.from(
            document.querySelectorAll("[data-complete-level]")
        );

        let completed = safelyReadProgress();

        function renderProgress() {
            const percent = Math.round(
                completed.length / TOTAL_LEVELS * 100
            );

            const nextLevel = Array.from(
                { length: TOTAL_LEVELS },
                function (_, index) {
                    return index + 1;
                }
            ).find(function (level) {
                return completed.indexOf(level) === -1;
            });

            if (count) {
                count.textContent = String(completed.length);
            }

            if (percentText) {
                percentText.textContent =
                    percent + "% complete";
            }

            if (bar) {
                bar.style.width = percent + "%";
            }

            if (track) {
                track.setAttribute(
                    "aria-valuenow",
                    String(percent)
                );
            }

            buttons.forEach(function (button) {
                const level =
                    Number(button.dataset.completeLevel);

                const isComplete =
                    completed.indexOf(level) !== -1;

                const card =
                    button.closest(".python-level-card");

                const sidebarLink =
                    document.querySelector(
                        '.python-topic-link[data-level="' +
                        level +
                        '"]'
                    );

                button.setAttribute(
                    "aria-pressed",
                    String(isComplete)
                );

                button.textContent = isComplete
                    ? "✓ Completed"
                    : "Mark Complete";

                if (card) {
                    card.classList.toggle(
                        "is-complete",
                        isComplete
                    );
                }

                if (sidebarLink) {
                    sidebarLink.classList.toggle(
                        "is-complete",
                        isComplete
                    );
                }
            });

            if (resumeLink) {
                if (nextLevel) {
                    resumeLink.href =
                        levelFiles[nextLevel];

                    resumeLink.textContent =
                        completed.length
                            ? "Continue Level " +
                              nextLevel +
                              " →"
                            : "Start Level 1 →";

                    resumeLink.setAttribute(
                        "aria-label",
                        "Continue with " +
                        levelNames[nextLevel]
                    );
                } else {
                    resumeLink.href =
                        "practice.html";

                    resumeLink.textContent =
                        "Open Practice Arena →";

                    resumeLink.setAttribute(
                        "aria-label",
                        "Open the Python Practice Arena"
                    );
                }
            }
        }

        buttons.forEach(function (button) {
            button.addEventListener(
                "click",
                function () {
                    const level = Number(
                        button.dataset.completeLevel
                    );

                    const position =
                        completed.indexOf(level);

                    if (position === -1) {
                        completed.push(level);

                        completed.sort(
                            function (first, second) {
                                return first - second;
                            }
                        );
                    } else {
                        completed.splice(position, 1);
                    }

                    safelySaveProgress(completed);
                    renderProgress();
                }
            );
        });

        if (reset) {
            reset.addEventListener(
                "click",
                function () {
                    const shouldReset =
                        !completed.length ||
                        window.confirm(
                            "Reset all saved Python course progress?"
                        );

                    if (shouldReset) {
                        completed = [];
                        safelySaveProgress(completed);
                        renderProgress();
                    }
                }
            );
        }

        renderProgress();
    }

    function normalizeSearch(value) {
        return value
            .toLowerCase()
            .replace(/[–—&]/g, " ")
            .replace(/[^a-z0-9+# ]/g, " ")
            .replace(/\s+/g, " ")
            .trim();
    }

    function initializeTopicSearch() {
        const input =
            document.getElementById("topicSearch");

        const empty =
            document.getElementById("pythonSearchEmpty");

        const cards = Array.from(
            document.querySelectorAll(
                ".python-level-card"
            )
        );

        const links = Array.from(
            document.querySelectorAll(
                ".python-topic-link[data-level]"
            )
        );

        const sections = Array.from(
            document.querySelectorAll(
                ".python-level-section"
            )
        );

        const groups = Array.from(
            document.querySelectorAll(
                ".sidebar .python-sidebar-group"
            )
        );

        if (!input) {
            return;
        }

        function filterTopics() {
            const query =
                normalizeSearch(input.value);

            let matches = 0;

            cards.forEach(function (card) {
                const searchable =
                    normalizeSearch(
                        (card.dataset.topic || "") +
                        " " +
                        card.textContent
                    );

                const matchesQuery =
                    !query ||
                    searchable.indexOf(query) !== -1;

                card.classList.toggle(
                    "is-search-hidden",
                    !matchesQuery
                );

                card.classList.toggle(
                    "is-search-match",
                    Boolean(query && matchesQuery)
                );

                if (matchesQuery) {
                    matches += 1;
                }
            });

            links.forEach(function (link) {
                const level =
                    link.dataset.level;

                const card =
                    document.querySelector(
                        '.python-level-card[data-level="' +
                        level +
                        '"]'
                    );

                link.classList.toggle(
                    "is-search-hidden",
                    Boolean(
                        card &&
                        card.classList.contains(
                            "is-search-hidden"
                        )
                    )
                );
            });

            sections.forEach(function (section) {
                const visibleCard =
                    section.querySelector(
                        ".python-level-card:not(" +
                        ".is-search-hidden)"
                    );

                section.classList.toggle(
                    "is-search-hidden",
                    Boolean(query && !visibleCard)
                );
            });

            groups.forEach(
                function (group, index) {
                    if (!query) {
                        group.classList.remove(
                            "is-search-hidden"
                        );
                        return;
                    }

                    if (index < 3) {
                        const startLevel =
                            index * 4 + 1;

                        const endLevel =
                            startLevel + 3;

                        const visibleInGroup =
                            links.some(
                                function (link) {
                                    const level =
                                        Number(
                                            link.dataset.level
                                        );

                                    return (
                                        level >=
                                            startLevel &&
                                        level <=
                                            endLevel &&
                                        !link.classList.contains(
                                            "is-search-hidden"
                                        )
                                    );
                                }
                            );

                        group.classList.toggle(
                            "is-search-hidden",
                            !visibleInGroup
                        );
                    }
                }
            );

            if (empty) {
                empty.hidden =
                    !query || matches > 0;
            }
        }

        input.addEventListener(
            "input",
            filterTopics
        );
    }

    function initializeSidebar() {
        const toggle =
            document.getElementById(
                "pythonSidebarToggle"
            );

        const sidebar =
            document.getElementById(
                "pythonSidebar"
            );

        if (!toggle || !sidebar) {
            return;
        }

        function setOpen(open) {
            sidebar.classList.toggle(
                "is-open",
                open
            );

            toggle.setAttribute(
                "aria-expanded",
                String(open)
            );

            toggle.textContent = open
                ? "✕ Close Python Topics"
                : "☰ Python Topics";
        }

        toggle.addEventListener(
            "click",
            function () {
                setOpen(
                    !sidebar.classList.contains(
                        "is-open"
                    )
                );
            }
        );

        sidebar.addEventListener(
            "click",
            function (event) {
                if (
                    event.target.closest("a") &&
                    window.innerWidth <= 880
                ) {
                    setOpen(false);
                }
            }
        );

        document.addEventListener(
            "keydown",
            function (event) {
                if (
                    event.key === "Escape" &&
                    sidebar.classList.contains(
                        "is-open"
                    )
                ) {
                    setOpen(false);
                    toggle.focus();
                }
            }
        );

        window.addEventListener(
            "resize",
            function () {
                if (window.innerWidth > 880) {
                    setOpen(false);
                }
            }
        );
    }

    function initializeStarterLab() {
        const tabs = Array.from(
            document.querySelectorAll(
                "[data-python-demo]"
            )
        );

        const title =
            document.getElementById(
                "pythonDemoTitle"
            );

        const code =
            document.getElementById(
                "pythonDemoCode"
            );

        const output =
            document.getElementById(
                "pythonDemoOutput"
            );

        const explanation =
            document.getElementById(
                "pythonDemoExplanation"
            );

        const run =
            document.getElementById(
                "pythonRunDemo"
            );

        const status =
            document.getElementById(
                "pythonRunStatus"
            );

        const copy =
            document.getElementById(
                "pythonCopyCode"
            );

        let activeDemo = "hello";
        let runTimer = null;

        if (
            !tabs.length ||
            !code ||
            !output ||
            !explanation
        ) {
            return;
        }

        try {
            const savedDemo =
                window.localStorage.getItem(
                    DEMO_KEY
                );

            if (
                savedDemo &&
                demos[savedDemo]
            ) {
                activeDemo = savedDemo;
            }
        } catch (error) {
            activeDemo = "hello";
        }

        function selectDemo(name) {
            const demo =
                demos[name] || demos.hello;

            activeDemo =
                demos[name]
                    ? name
                    : "hello";

            if (runTimer !== null) {
                window.clearTimeout(runTimer);
                runTimer = null;
            }

            tabs.forEach(function (tab) {
                tab.setAttribute(
                    "aria-selected",
                    String(
                        tab.dataset.pythonDemo ===
                        activeDemo
                    )
                );
            });

            if (title) {
                title.textContent =
                    demo.title;
            }

            code.textContent =
                demo.code;

            output.textContent =
                "Click Run Example to see the output.";

            explanation.textContent =
                demo.explanation;

            if (status) {
                status.textContent = "Ready";

                status.classList.remove(
                    "is-running",
                    "is-complete"
                );
            }

            try {
                window.localStorage.setItem(
                    DEMO_KEY,
                    activeDemo
                );
            } catch (error) {
                /*
                 * The selected example still works
                 * when storage is unavailable.
                 */
            }
        }

        tabs.forEach(function (tab) {
            tab.addEventListener(
                "click",
                function () {
                    selectDemo(
                        tab.dataset.pythonDemo
                    );
                }
            );
        });

        if (run) {
            run.addEventListener(
                "click",
                function () {
                    const demo =
                        demos[activeDemo];

                    if (runTimer !== null) {
                        window.clearTimeout(
                            runTimer
                        );
                    }

                    output.textContent =
                        "Running...";

                    if (status) {
                        status.textContent =
                            "Running";

                        status.classList.add(
                            "is-running"
                        );

                        status.classList.remove(
                            "is-complete"
                        );
                    }

                    run.disabled = true;

                    runTimer =
                        window.setTimeout(
                            function () {
                                output.textContent =
                                    demo.output;

                                run.disabled =
                                    false;

                                runTimer =
                                    null;

                                if (status) {
                                    status.textContent =
                                        "Completed";

                                    status.classList.remove(
                                        "is-running"
                                    );

                                    status.classList.add(
                                        "is-complete"
                                    );
                                }
                            },
                            360
                        );
                }
            );
        }

        if (copy) {
            copy.addEventListener(
                "click",
                function () {
                    const originalText =
                        copy.textContent;

                    if (
                        !navigator.clipboard ||
                        !navigator.clipboard
                            .writeText
                    ) {
                        copy.textContent =
                            "Select & Copy";

                        window.setTimeout(
                            function () {
                                copy.textContent =
                                    originalText;
                            },
                            1200
                        );

                        return;
                    }

                    navigator.clipboard
                        .writeText(
                            demos[activeDemo].code
                        )
                        .then(
                            function () {
                                copy.textContent =
                                    "Copied!";

                                window.setTimeout(
                                    function () {
                                        copy.textContent =
                                            originalText;
                                    },
                                    1200
                                );
                            },
                            function () {
                                copy.textContent =
                                    "Copy Failed";

                                window.setTimeout(
                                    function () {
                                        copy.textContent =
                                            originalText;
                                    },
                                    1200
                                );
                            }
                        );
                }
            );
        }

        selectDemo(activeDemo);
    }

    function initializeSmoothLinks() {
        document
            .querySelectorAll('a[href^="#"]')
            .forEach(function (link) {
                link.addEventListener(
                    "click",
                    function (event) {
                        const id =
                            link.getAttribute(
                                "href"
                            );

                        const target =
                            id && id.length > 1
                                ? document.querySelector(id)
                                : null;

                        if (!target) {
                            return;
                        }

                        event.preventDefault();

                        target.scrollIntoView({
                            behavior: "smooth",
                            block: "start"
                        });
                    }
                );
            });
    }

    function initializePythonHome() {
        initializeCourseProgress();
        initializeTopicSearch();
        initializeSidebar();
        initializeStarterLab();
        initializeSmoothLinks();
    }

    if (
        document.readyState === "loading"
    ) {
        document.addEventListener(
            "DOMContentLoaded",
            initializePythonHome
        );
    } else {
        initializePythonHome();
    }
}());
