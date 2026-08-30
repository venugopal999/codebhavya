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
                        ? "Hide Solution"
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

    function initializeLevelOne() {
        initializeLessonSidebarSearch();
        initializeLessonCodeCopy();
        initializeLessonReveals();
        initializeLessonQuiz();
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
