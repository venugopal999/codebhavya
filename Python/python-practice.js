(function () {
    "use strict";

    var JUDGE0_BASE = "https://ce.judge0.com";
    var PYTHON_LANGUAGE_ID = 71;
    var POINTS = 100;
    var dataElement = document.getElementById("pythonPracticeData");
    var practiceData = dataElement ? JSON.parse(dataElement.textContent) : {levels: [], problems: []};
    var LEVELS = practiceData.levels;
    var PROBLEMS = practiceData.problems;

    function html(value) {
        return String(value == null ? "" : value)
            .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;").replace(/'/g, "&#039;");
    }

    function levelCardsMarkup() {
        var stages = [];

        LEVELS.forEach(function (level) {
            if (stages.indexOf(level.stage) === -1) stages.push(level.stage);
        });

        return stages.map(function (stage) {
            var stageLevels = LEVELS.filter(function (level) {
                return level.stage === stage;
            });

            var intro = stageLevels[0].stageText;

            return '<section class="cb-stage-block">' +
                '<div class="cb-stage-heading"><h2>' + html(stage) +
                '</h2><p>' + html(intro) + '</p></div>' +
                '<div class="cb-level-card-grid">' +

                stageLevels.map(function (level) {
                    var placement = level.id === 12
                        ? " cb-level-placement"
                        : "";

                    return '<a class="cb-level-card' + placement +
                        '" href="#practice-level-' + level.id + '">' +

                        '<div class="cb-level-card-top">' +
                        '<span class="cb-level-number">LEVEL ' +
                        String(level.id).padStart(2, "0") +
                        '</span><span class="cb-level-icon">' +
                        level.icon + '</span></div>' +

                        '<h3>' + html(level.name) + '</h3>' +
                        '<p>' + html(level.desc) + '</p>' +

                        '<div class="cb-level-meta">' +
                        '<span>20 Challenges</span>' +
                        '<span>' + html(stage.replace(" Practice", "")) + '</span>' +
                        '<span>2000 Points</span></div>' +

                        '<span class="cb-level-start">Open Level →</span></a>';
                }).join("") +

                '</div></section>';
        }).join("");
    }

    function onlineWorkspace(problem) {
        var key = problem.key;

        return '<div class="cb-challenge-actions">' +

            '<button type="button" class="cb-practice-start-button" ' +
            'onclick="CodeBhavyaPythonPractice.toggle(\'' + key + '\')">' +
            '💻 Solve It Yourself</button>' +

            '<button type="button" class="cb-practice-hint-button" ' +
            'onclick="CodeBhavyaPythonPractice.markHint(\'' + key + '\')">' +
            'Hint</button>' +

            '<button type="button" class="cb-practice-program-button" ' +
            'onclick="CodeBhavyaPythonPractice.markSolution(\'' + key + '\')">' +
            'Show Program</button></div>' +

            '<div class="cb-c-practice-hint" id="practiceHint-' +
            key + '" hidden>💡 <strong>Hint:</strong> ' +
            html(problem.hint) + '</div>' +

            '<div class="cb-c-practice-workspace" id="practiceWorkspace-' +
            key + '" hidden>' +

            '<div class="cb-c-practice-workspace-title">' +
            '💻 Solve It Yourself — ' + html(problem.title) + '</div>' +

            '<div class="cb-c-practice-grid">' +

            '<div class="cb-c-practice-panel">' +
            '<h4>Python Code Editor</h4>' +

            '<textarea id="practiceCode-' + key +
            '" class="cb-c-code-editor" spellcheck="false" ' +
            'aria-label="Python code editor"></textarea>' +

            '<div class="cb-c-practice-actions">' +

            '<button type="button" id="practiceRun-' + key +
            '" class="cb-c-run-btn" ' +
            'onclick="CodeBhavyaPythonPractice.runSample(\'' + key + '\')">' +
            '▶ Run Code</button>' +

            '<button type="button" id="practiceCheck-' + key +
            '" class="cb-c-check-btn" ' +
            'onclick="CodeBhavyaPythonPractice.checkAnswer(\'' + key + '\')">' +
            '✓ Check Answer</button>' +

            '<button type="button" class="cb-c-reset-btn" ' +
            'onclick="CodeBhavyaPythonPractice.resetEditor(\'' + key + '\')">' +
            '↺ Reset</button></div>' +

            '<p class="cb-c-practice-note">' +
            'Run uses the sample input. Check Answer runs the sample plus hidden test cases.' +
            '</p></div>' +

            '<div class="cb-c-practice-panel">' +
            '<h4>Sample Input</h4>' +

            '<textarea id="practiceInput-' + key +
            '" class="cb-c-practice-input" spellcheck="false" ' +
            'aria-label="Sample input"></textarea>' +

            '<h4 class="cb-c-output-heading">Output</h4>' +

            '<pre id="practiceOutput-' + key +
            '" class="cb-c-practice-output" aria-live="polite">' +
            'Run your program to see the output.</pre>' +

            '<h4 class="cb-c-tests-heading">Test Cases</h4>' +

            '<div id="practiceTests-' + key +
            '" class="cb-c-test-results">' +
            '<div class="cb-c-test-row">' +
            '<span>No tests checked yet.</span><strong>—</strong></div></div>' +

            '<div class="cb-c-practice-score">' +
            '<div class="cb-c-practice-score-grid">' +

            '<div class="cb-c-score-item"><strong>Best Score</strong>' +
            '<span id="practiceScore-' + key + '">0 / 100</span></div>' +

            '<div class="cb-c-score-item"><strong>Attempts</strong>' +
            '<span id="practiceAttempts-' + key + '">0</span></div>' +

            '<div class="cb-c-score-item"><strong>Status</strong>' +
            '<span id="practiceStatus-' + key + '">Not Solved</span></div>' +

            '</div>' +

            '<div id="practiceMessage-' + key +
            '" class="cb-c-practice-message">' +
            'Write your Python program and test it. You can do it! 💪' +
            '</div></div></div></div></div>' +

            '<div class="cb-c-practice-solution" id="practiceSolution-' +
            key + '" hidden>' +

            '<div class="cb-c-practice-solution-title">' +
            'Official Python Program</div>' +

            '<pre><code>' + html(problem.solution) +
            '</code></pre></div>';
    }

    function localWorkspace(problem) {
        return '<div class="cb-local-lab-banner">' +
            '<strong>🖥️ Local File Lab</strong>' +

            '<p>This challenge intentionally uses real files on disk. ' +
            'Practise it in your local Python environment so file creation, ' +
            'append/copy operations, paths and persistent data behaviour are ' +
            'genuine rather than simulated as standard input.</p></div>' +

            '<div class="cb-c-practice-hint" ' +
            'style="display:block;margin-top:10px">' +
            '💡 <strong>Hint:</strong> ' + html(problem.hint) + '</div>' +

            '<details class="cb-local-program-details">' +
            '<summary>Show Program</summary>' +
            '<pre><code>' + html(problem.solution) +
            '</code></pre></details>';
    }

    function challengeMarkup(problem, level) {
        var diffClass = "cb-diff-" +
            problem.difficulty.toLowerCase().replace("+", "plus");

        var mode = problem.local
            ? "Local File Lab"
            : "Online Judge";

        return '<details class="cb-challenge-card"><summary>' +

            '<div class="cb-challenge-topline">' +
            '<span class="cb-challenge-number">CHALLENGE ' +
            String(problem.number).padStart(2, "0") + '</span>' +

            '<span><span id="practiceBadge-' + problem.key +
            '" class="cb-practice-badge"></span> ' +

            '<span class="cb-difficulty ' + diffClass + '">' +
            html(problem.difficulty) + '</span></span></div>' +

            '<h3>' + html(problem.title) + '</h3>' +

            '<p class="cb-core-skill">Core Skill: ' +
            html(problem.skill) + '</p>' +

            '<div class="cb-challenge-summary-meta">' +
            '<span>' + html(level.topic) + '</span>' +
            '<span>' + mode + '</span>' +
            '<span>100 Points</span></div>' +

            '<span class="cb-view-challenge">View Challenge →</span>' +
            '</summary>' +

            '<div class="cb-challenge-body">' +

            '<div class="cb-challenge-hero">' +
            '<span class="cb-challenge-label">' +
            'CODEBHAVYA ORIGINAL CHALLENGE</span>' +

            '<h2>' + html(problem.title) + '</h2>' +
            '<p>' + html(problem.story) + '</p></div>' +

            '<div class="cb-challenge-spec-grid">' +

            '<div class="cb-challenge-spec">' +
            '<h4>🎯 Your Task</h4>' +
            '<p>' + html(problem.task) + '</p></div>' +

            '<div class="cb-challenge-spec">' +
            '<h4>📥 Input Format</h4>' +
            '<p>' + html(problem.inputFormat) + '</p></div>' +

            '<div class="cb-challenge-spec">' +
            '<h4>📤 Output Format</h4>' +
            '<p>' + html(problem.outputFormat) + '</p></div>' +

            '<div class="cb-challenge-spec">' +
            '<h4>📏 Constraints</h4>' +
            '<p>' + html(problem.constraints) + '</p></div>' +

            '</div>' +

            '<div class="cb-example-grid">' +

            '<div class="cb-example-box">' +
            '<strong>Example Input</strong>' +
            '<pre>' + html(problem.sampleInput) + '</pre></div>' +

            '<div class="cb-example-box">' +
            '<strong>Example Output</strong>' +
            '<pre>' + html(problem.sampleOutput) + '</pre></div>' +

            '</div>' +

            '<div class="cb-explanation-box">' +
            '<strong>Explanation:</strong> ' +
            html(problem.explanation) + '</div>' +

            '<div class="cb-concept-row">' +

            problem.concepts.map(function (concept) {
                return "<span>" + html(concept) + "</span>";
            }).join("") +

            '<span>' + html(problem.difficulty) + '</span>' +
            '<span>100 Points</span></div>' +

            (problem.local
                ? localWorkspace(problem)
                : onlineWorkspace(problem)) +

            '</div></details>';
    }

    function levelsMarkup() {
        return LEVELS.map(function (level) {
            var problems = PROBLEMS.filter(function (problem) {
                return problem.level === level.id;
            });

            return '<details class="cb-level-section" ' +
                'id="practice-level-' + level.id + '">' +

                '<summary><div class="cb-level-summary-row">' +

                '<div class="cb-level-summary-main">' +
                '<span class="cb-level-summary-icon">' +
                level.icon + '</span>' +

                '<span class="cb-level-summary-text">' +
                '<strong>Level ' + level.id + ' — ' +
                html(level.name) + '</strong>' +

                '<span>' + html(level.desc) +
                ' • 20 original CodeBhavya challenges</span></span></div>' +

                '<span class="cb-level-open-pill">' +
                'Open 20 Challenges</span></div></summary>' +

                '<div class="cb-level-content">' +

                '<p class="cb-level-content-intro">' +
                'Every challenge preserves the learning objective of this level ' +
                'while using CodeBhavya story framing, explicit requirements and ' +
                'progressive difficulty.</p>' +

                '<div class="cb-challenge-grid">' +

                problems.map(function (problem) {
                    return challengeMarkup(problem, level);
                }).join("") +

                '</div></div></details>';
        }).join("");
    }

    function renderArena() {
        var cardRoot = document.getElementById(
            "pythonPracticeLevelCards"
        );

        var levelRoot = document.getElementById(
            "pythonPracticeLevels"
        );

        if (!cardRoot || !levelRoot) return;

        cardRoot.innerHTML = levelCardsMarkup();
        levelRoot.innerHTML = levelsMarkup();

        cardRoot.addEventListener("click", function (event) {
            var link = event.target.closest(
                'a[href^="#practice-level-"]'
            );

            if (!link) return;

            var section = document.querySelector(
                link.getAttribute("href")
            );

            if (section) {
                section.open = true;
            }
        });
    }

    var configs = {};

    function element(name, key) {
        return document.getElementById(
            name + "-" + key
        );
    }

    function storageGet(key) {
        try {
            return JSON.parse(
                localStorage.getItem(key) || "null"
            );
        } catch (error) {
            return null;
        }
    }

    function storageSet(key, value) {
        try {
            localStorage.setItem(
                key,
                JSON.stringify(value)
            );
        } catch (error) {}
    }

    function progressKey(key) {
        return "codebhavya.pythonpractice." + key;
    }

    function defaultProgress() {
        return {
            attempts: 0,
            bestScore: 0,
            solved: false,
            completedWithSolution: false,
            hintUsed: false,
            solutionViewed: false
        };
    }

    function getProgress(key) {
        return Object.assign(
            defaultProgress(),
            storageGet(progressKey(key)) || {}
        );
    }

    function saveProgress(key, value) {
        storageSet(progressKey(key), value);
    }

    function normalizeOutput(value) {
        return String(value == null ? "" : value)
            .replace(/\r\n/g, "\n")
            .trim()
            .replace(/[ \t]+$/gm, "");
    }

    function updateOverallProgress() {
        var keys = Object.keys(configs);
        var total = keys.length;
        var solved = 0;
        var completed = 0;
        var score = 0;

        keys.forEach(function (key) {
            var progress = getProgress(key);

            score += Number(progress.bestScore) || 0;

            if (progress.solved) {
                solved += 1;
            } else if (progress.completedWithSolution) {
                completed += 1;
            }
        });

        var finished = solved + completed;

        var percent = total
            ? Math.round(finished / total * 100)
            : 0;

        var solvedElement = document.getElementById(
            "cbPracticeOverallSolved"
        );

        var completedElement = document.getElementById(
            "cbPracticeOverallCompleted"
        );

        var scoreElement = document.getElementById(
            "cbPracticeOverallScore"
        );

        var percentElement = document.getElementById(
            "cbPracticeOverallPercent"
        );

        var barElement = document.getElementById(
            "cbPracticeOverallBar"
        );

        if (solvedElement) {
            solvedElement.textContent =
                solved + " / " + total;
        }

        if (completedElement) {
            completedElement.textContent =
                String(completed);
        }

        if (scoreElement) {
            scoreElement.textContent =
                score + " / " + (total * POINTS);
        }

        if (percentElement) {
            percentElement.textContent =
                percent + "%";
        }

        if (barElement) {
            barElement.style.width =
                percent + "%";
        }
    }

    function register(config) {
        configs[config.key] = config;

        var code = element(
            "practiceCode",
            config.key
        );

        var input = element(
            "practiceInput",
            config.key
        );

        if (code) {
            code.value = config.starterCode;
        }

        if (input) {
            input.value = config.sampleInput === "No input"
                ? ""
                : config.sampleInput;
        }

        if (code) {
            code.addEventListener(
                "keydown",
                function (event) {
                    if (event.key !== "Tab") return;

                    event.preventDefault();

                    var start = code.selectionStart;
                    var end = code.selectionEnd;

                    code.value =
                        code.value.substring(0, start) +
                        "    " +
                        code.value.substring(end);

                    code.selectionStart =
                        code.selectionEnd =
                        start + 4;
                }
            );
        }

        renderProgress(config.key);
    }

    function registerAll(list) {
        list.filter(function (item) {
            return !item.local;
        }).forEach(register);

        updateOverallProgress();
    }

    function toggle(key) {
        var workspace = element(
            "practiceWorkspace",
            key
        );

        if (!workspace) return;

        workspace.hidden = !workspace.hidden;

        if (!workspace.hidden) {
            var editor = element(
                "practiceCode",
                key
            );

            if (editor) {
                window.setTimeout(function () {
                    editor.focus();
                }, 0);
            }
        }

        renderProgress(key);
    }

    function markHint(key) {
        var hint = element(
            "practiceHint",
            key
        );

        if (hint) {
            hint.hidden = !hint.hidden;
        }

        var progress = getProgress(key);
        progress.hintUsed = true;

        saveProgress(key, progress);
        renderProgress(key);
    }

    function markSolution(key) {
        var solution = element(
            "practiceSolution",
            key
        );

        if (solution) {
            solution.hidden = !solution.hidden;
        }

        var progress = getProgress(key);
        progress.solutionViewed = true;

        saveProgress(key, progress);
        renderProgress(key);
    }

    async function executePython(code, stdin) {
        var response = await fetch(
            JUDGE0_BASE +
            "/submissions?base64_encoded=false&wait=true",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    language_id: PYTHON_LANGUAGE_ID,
                    source_code: code,
                    stdin: stdin,
                    cpu_time_limit: 3,
                    wall_time_limit: 6,
                    memory_limit: 128000
                })
            }
        );

        var result = null;

        try {
            result = await response.json();
        } catch (error) {}

        if (!response.ok) {
            throw new Error(
                result && (
                    result.message ||
                    result.error
                ) ||
                "Judge0 returned HTTP " +
                response.status + "."
            );
        }

        var description = String(
            result &&
            result.status &&
            result.status.description ||
            ""
        ).trim();

        var stdout =
            result && result.stdout != null
                ? result.stdout
                : "";

        var stderr =
            result && result.stderr != null
                ? result.stderr
                : "";

        var compileOutput =
            result && result.compile_output != null
                ? result.compile_output
                : "";

        var message =
            result && result.message != null
                ? result.message
                : "";

        if (description === "Accepted") {
            return {
                ok: true,
                type: "success",
                output: stdout
            };
        }

        if (
            /compilation/i.test(description) ||
            compileOutput
        ) {
            return {
                ok: false,
                type: "compile",
                output:
                    compileOutput ||
                    stderr ||
                    message ||
                    description ||
                    "Compilation failed."
            };
        }

        return {
            ok: false,
            type: "runtime",
            output:
                stderr ||
                message ||
                description ||
                "Program execution failed."
        };
    }

    function setBusy(key, busy) {
        var run = element(
            "practiceRun",
            key
        );

        var check = element(
            "practiceCheck",
            key
        );

        if (run) {
            run.disabled = busy;
        }

        if (check) {
            check.disabled = busy;
        }
    }

    async function runSample(key) {
        var config = configs[key];

        if (!config) return;

        var codeElement = element(
            "practiceCode",
            key
        );

        var inputElement = element(
            "practiceInput",
            key
        );

        var output = element(
            "practiceOutput",
            key
        );

        var code = codeElement
            ? codeElement.value
            : "";

        var stdin = inputElement
            ? inputElement.value
            : "";

        if (!code.trim()) {
            if (output) {
                output.textContent =
                    "Please write your Python program first.";
            }

            return;
        }

        setBusy(key, true);

        if (output) {
            output.textContent =
                "Running your Python program...";
        }

        try {
            var result = await executePython(
                code,
                stdin
            );

            if (output) {
                output.textContent =
                    result.output ||
                    "(Program finished with no output)";
            }
        } catch (error) {
            if (output) {
                output.textContent =
                    "Unable to run code: " +
                    error.message +
                    "\n\nThe online judge may be temporarily unavailable. " +
                    "Please try again.";
            }
        } finally {
            setBusy(key, false);
        }
    }

    async function checkAnswer(key) {
        var config = configs[key];

        if (!config) return;

        var codeElement = element(
            "practiceCode",
            key
        );

        var output = element(
            "practiceOutput",
            key
        );

        var testsElement = element(
            "practiceTests",
            key
        );

        var code = codeElement
            ? codeElement.value
            : "";

        if (!code.trim()) {
            if (output) {
                output.textContent =
                    "Please write your Python program first.";
            }

            return;
        }

        var progress = getProgress(key);
        progress.attempts += 1;

        saveProgress(key, progress);
        setBusy(key, true);

        if (testsElement) {
            testsElement.innerHTML = "";
        }

        if (output) {
            output.textContent =
                "Checking your program against the test cases...";
        }

        var passed = 0;
        var stopped = false;

        try {
            for (
                var index = 0;
                index < config.tests.length;
                index += 1
            ) {
                var test = config.tests[index];

                var result = await executePython(
                    code,
                    test.input
                );

                if (!result.ok) {
                    stopped = true;

                    if (testsElement) {
                        testsElement.insertAdjacentHTML(
                            "beforeend",
                            '<div class="cb-c-test-row fail">' +
                            '<span>' +
                            (
                                index === 0
                                    ? "Sample Test"
                                    : "Hidden Test " + index
                            ) +
                            '</span><strong>❌ ' +
                            (
                                result.type === "compile"
                                    ? "Compile Error"
                                    : "Runtime Error"
                            ) +
                            '</strong></div>'
                        );
                    }

                    if (output) {
                        output.textContent =
                            result.output;
                    }

                    break;
                }

                var actual = normalizeOutput(
                    result.output
                );

                var expected = normalizeOutput(
                    test.expected
                );

                var passedTest =
                    actual === expected;

                if (passedTest) {
                    passed += 1;
                }

                if (testsElement) {
                    testsElement.insertAdjacentHTML(
                        "beforeend",
                        '<div class="cb-c-test-row ' +
                        (
                            passedTest
                                ? "pass"
                                : "fail"
                        ) +
                        '">' +

                        '<span>' +
                        (
                            index === 0
                                ? "Sample Test"
                                : "Hidden Test " + index
                        ) +
                        '</span>' +

                        '<strong>' +
                        (
                            passedTest
                                ? "✅ Passed"
                                : "❌ Failed"
                        ) +
                        '</strong></div>'
                    );
                }

                if (
                    !passedTest &&
                    index === 0 &&
                    output
                ) {
                    output.textContent =
                        "Your output:\n" +
                        (
                            result.output ||
                            "(no output)"
                        ) +
                        "\nExpected:\n" +
                        test.expected;
                }
            }

            var allPassed =
                !stopped &&
                passed === config.tests.length;

            var latest = getProgress(key);

            var competitiveMaximum =
                latest.solutionViewed
                    ? 0
                    : (
                        latest.hintUsed
                            ? 90
                            : 100
                    );

            var sessionScore =
                competitiveMaximum === 0
                    ? 0
                    : Math.round(
                        passed /
                        config.tests.length *
                        competitiveMaximum
                    );

            if (competitiveMaximum > 0) {
                latest.bestScore = Math.max(
                    latest.bestScore,
                    sessionScore
                );
            }

            if (allPassed) {
                if (latest.solutionViewed) {
                    latest.completedWithSolution =
                        true;
                } else {
                    latest.solved = true;
                }
            }

            saveProgress(key, latest);

            renderProgress(
                key,
                {
                    passed: passed,
                    total: config.tests.length,
                    score: sessionScore,
                    allPassed: allPassed
                }
            );

            if (allPassed && output) {
                output.textContent =
                    latest.solutionViewed
                        ? "All test cases passed. You completed the problem after viewing the solution."
                        : "All test cases passed successfully. 🎉";
            } else if (
                !stopped &&
                output &&
                output.textContent ===
                "Checking your program against the test cases..."
            ) {
                output.textContent =
                    passed + " of " +
                    config.tests.length +
                    " test cases passed. " +
                    "Review your logic and try again.";
            }
        } catch (error) {
            if (testsElement) {
                testsElement.innerHTML =
                    '<div class="cb-c-test-row fail">' +
                    '<span>Code execution service</span>' +
                    '<strong>❌ Unavailable</strong></div>';
            }

            if (output) {
                output.textContent =
                    "Unable to check your answer: " +
                    error.message +
                    "\n\nThe online judge may be temporarily unavailable. " +
                    "Please try again.";
            }

            renderProgress(key);
        } finally {
            setBusy(key, false);
        }
    }

    function renderProgress(key, session) {
        var progress = getProgress(key);

        var score = element(
            "practiceScore",
            key
        );

        var attempts = element(
            "practiceAttempts",
            key
        );

        var status = element(
            "practiceStatus",
            key
        );

        var message = element(
            "practiceMessage",
            key
        );

        var badge = element(
            "practiceBadge",
            key
        );

        if (score) {
            score.textContent =
                progress.bestScore + " / 100";
        }

        if (attempts) {
            attempts.textContent =
                String(progress.attempts);
        }

        if (progress.solved) {
            if (status) {
                status.textContent = "Solved";
            }

            if (badge) {
                badge.className =
                    "cb-practice-badge solved";

                badge.textContent =
                    "✅ SOLVED";
            }
        } else if (
            progress.completedWithSolution
        ) {
            if (status) {
                status.textContent =
                    "Completed";
            }

            if (badge) {
                badge.className =
                    "cb-practice-badge completed";

                badge.textContent =
                    "📘 COMPLETED";
            }
        } else {
            if (status) {
                status.textContent =
                    "Not Solved";
            }

            if (badge) {
                badge.className =
                    "cb-practice-badge";

                badge.textContent = "";
            }
        }

        updateOverallProgress();

        if (!message) return;

        if (
            session &&
            session.allPassed
        ) {
            if (progress.solutionViewed) {
                message.textContent =
                    "✅ Problem completed after studying the solution.";
            } else if (progress.hintUsed) {
                message.textContent =
                    "🎉 All tests passed. Hint used; " +
                    "maximum competitive score is 90.";
            } else {
                message.textContent =
                    "🏆 All tests passed — excellent work!";
            }
        } else if (session) {
            var ratio =
                session.passed /
                session.total;

            if (ratio >= 0.8) {
                message.textContent =
                    "👏 Almost there. Fix the remaining case and try again.";
            } else if (ratio >= 0.4) {
                message.textContent =
                    "💪 Some cases work. Review the logic and try again.";
            } else {
                message.textContent =
                    "🔍 Keep trying. Test the logic with different inputs.";
            }
        } else if (progress.solved) {
            message.textContent =
                "🏆 You have already solved this problem. " +
                "Try rewriting it from memory.";
        } else if (progress.solutionViewed) {
            message.textContent =
                "📘 Solution viewed. You can complete the problem, " +
                "but it will not receive a competitive score.";
        } else if (progress.hintUsed) {
            message.textContent =
                "💡 Hint used. You can still earn up to 90 marks.";
        } else {
            message.textContent =
                "Write your Python program and test it. You can do it! 💪";
        }
    }

    function resetEditor(key) {
        var config = configs[key];

        if (!config) return;

        var code = element(
            "practiceCode",
            key
        );

        var input = element(
            "practiceInput",
            key
        );

        var output = element(
            "practiceOutput",
            key
        );

        var testsArea = element(
            "practiceTests",
            key
        );

        if (code) {
            code.value =
                config.starterCode;
        }

        if (input) {
            input.value =
                config.sampleInput === "No input"
                    ? ""
                    : config.sampleInput;
        }

        if (output) {
            output.textContent =
                "Run your program to see the output.";
        }

        if (testsArea) {
            testsArea.innerHTML =
                '<div class="cb-c-test-row">' +
                '<span>No tests checked yet.</span>' +
                '<strong>—</strong></div>';
        }

        renderProgress(key);
    }

    window.CodeBhavyaPythonPractice = {
        toggle: toggle,
        markHint: markHint,
        markSolution: markSolution,
        runSample: runSample,
        checkAnswer: checkAnswer,
        resetEditor: resetEditor
    };

    document.addEventListener(
        "DOMContentLoaded",
        function () {
            renderArena();
            registerAll(PROBLEMS);
        }
    );
})();
