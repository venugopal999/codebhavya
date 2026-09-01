(function () {
    "use strict";

    const ARENA_STORAGE_KEY = "codebhavya.python.arena.v1";
    const PROBLEMS_PER_LEVEL = 5;
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

    const problemPrefixes = {
        1: "foundation",
        2: "dataio",
        3: "operators",
        4: "decision",
        5: "loops",
        6: "strings",
        7: "collections",
        8: "dictionaries",
        9: "functions",
        10: "applied",
        11: "oop",
        12: "placement"
    };

    const challenges = [
        {
            id: "arena-01",
            level: 1,
            topic: "Foundations",
            difficulty: "Easy",
            title: "Three-Line Learner Card",
            prompt: "Display a learner's name, course and goal on three separate lines using clear labels.",
            sample: "Name: Asha\nCourse: Python\nGoal: Placement",
            hint: "Use three print() calls or one string containing newline escape sequences.",
            solution: "print(\"Name: Asha\")\nprint(\"Course: Python\")\nprint(\"Goal: Placement\")"
        },
        {
            id: "arena-02",
            level: 1,
            topic: "Foundations",
            difficulty: "Easy",
            title: "Comment and Output Repair",
            prompt: "Write one valid single-line comment followed by a statement that prints CodeBhavya.",
            sample: "CodeBhavya",
            hint: "A Python single-line comment begins with # and is ignored during execution.",
            solution: "# Display the learning platform name\nprint(\"CodeBhavya\")"
        },
        {
            id: "arena-03",
            level: 2,
            topic: "Data Types & I/O",
            difficulty: "Easy",
            title: "Student Total and Average",
            prompt: "Read three integer marks, then display their total and average rounded to two decimal places.",
            sample: "Input: 75, 82, 91\nOutput: Total = 248\nAverage = 82.67",
            hint: "Convert every input to int, add the values and divide the total by 3.",
            solution: "a = int(input())\nb = int(input())\nc = int(input())\ntotal = a + b + c\nprint(\"Total =\", total)\nprint(f\"Average = {total / 3:.2f}\")"
        },
        {
            id: "arena-04",
            level: 2,
            topic: "Data Types & I/O",
            difficulty: "Easy",
            title: "Temperature Converter",
            prompt: "Read a Celsius value and convert it to Fahrenheit using F = C × 9/5 + 32.",
            sample: "Input: 25\nOutput: Fahrenheit = 77.0",
            hint: "Use float(input()) so decimal temperatures are also accepted.",
            solution: "celsius = float(input())\nfahrenheit = celsius * 9 / 5 + 32\nprint(\"Fahrenheit =\", fahrenheit)"
        },
        {
            id: "arena-05",
            level: 3,
            topic: "Operators",
            difficulty: "Easy",
            title: "Digit Extraction",
            prompt: "Read a positive three-digit integer and display its hundreds, tens and ones digits.",
            sample: "Input: 472\nOutput: 4 7 2",
            hint: "Use integer division for the leading digits and remainder for the final digit.",
            solution: "number = int(input())\nhundreds = number // 100\ntens = number // 10 % 10\nones = number % 10\nprint(hundreds, tens, ones)"
        },
        {
            id: "arena-06",
            level: 3,
            topic: "Operators",
            difficulty: "Medium",
            title: "Range Membership",
            prompt: "Read an integer and display True only when it lies from 10 through 50 inclusive and is not divisible by 5.",
            sample: "Input: 27\nOutput: True",
            hint: "Combine a chained comparison with a remainder test using and.",
            solution: "number = int(input())\nprint(10 <= number <= 50 and number % 5 != 0)"
        },
        {
            id: "arena-07",
            level: 4,
            topic: "Decision Making",
            difficulty: "Easy",
            title: "Scholarship Eligibility",
            prompt: "A learner is eligible when percentage is at least 75 and annual income is at most 300000. Display Eligible or Not Eligible.",
            sample: "Input: 82, 250000\nOutput: Eligible",
            hint: "Both comparisons must be true, so join them with and.",
            solution: "percentage = float(input())\nincome = float(input())\nif percentage >= 75 and income <= 300000:\n    print(\"Eligible\")\nelse:\n    print(\"Not Eligible\")"
        },
        {
            id: "arena-08",
            level: 4,
            topic: "Decision Making",
            difficulty: "Medium",
            title: "Electricity Bill Band",
            prompt: "Classify consumption as Low for 0–100 units, Medium for 101–300 and High above 300.",
            sample: "Input: 245\nOutput: Medium",
            hint: "Test the upper limits from smallest to largest with if and elif.",
            solution: "units = int(input())\nif units <= 100:\n    print(\"Low\")\nelif units <= 300:\n    print(\"Medium\")\nelse:\n    print(\"High\")"
        },
        {
            id: "arena-09",
            level: 5,
            topic: "Loops",
            difficulty: "Medium",
            title: "Sum of Even Digits",
            prompt: "Read a positive integer and calculate the sum of only its even digits.",
            sample: "Input: 48271\nOutput: Sum = 14",
            hint: "Extract the last digit with % 10 and remove it with // 10 inside a while loop.",
            solution: "number = int(input())\ntotal = 0\nwhile number > 0:\n    digit = number % 10\n    if digit % 2 == 0:\n        total += digit\n    number //= 10\nprint(\"Sum =\", total)"
        },
        {
            id: "arena-10",
            level: 5,
            topic: "Loops",
            difficulty: "Medium",
            title: "Number Triangle",
            prompt: "Read n and display rows 1 through n, where row i contains the value i repeated i times.",
            sample: "Input: 4\nOutput:\n1\n22\n333\n4444",
            hint: "The outer loop selects the row; string repetition can create each row clearly.",
            solution: "n = int(input())\nfor row in range(1, n + 1):\n    print(str(row) * row)"
        },
        {
            id: "arena-11",
            level: 6,
            topic: "Strings",
            difficulty: "Medium",
            title: "Vowel Frequency",
            prompt: "Read text and display how many vowels it contains, treating uppercase and lowercase letters equally.",
            sample: "Input: CodeBhavya\nOutput: Vowels = 4",
            hint: "Convert the text to lowercase and test every character against 'aeiou'.",
            solution: "text = input().lower()\ncount = 0\nfor character in text:\n    if character in \"aeiou\":\n        count += 1\nprint(\"Vowels =\", count)"
        },
        {
            id: "arena-12",
            level: 6,
            topic: "Strings",
            difficulty: "Medium",
            title: "Normalised Palindrome",
            prompt: "Check whether a phrase is a palindrome after ignoring spaces and letter case.",
            sample: "Input: Never odd or even\nOutput: Palindrome",
            hint: "Build a lowercase version without spaces, then compare it with its reverse.",
            solution: "text = input().replace(\" \", \"\").lower()\nprint(\"Palindrome\" if text == text[::-1] else \"Not Palindrome\")"
        },
        {
            id: "arena-13",
            level: 7,
            topic: "Collections",
            difficulty: "Medium",
            title: "Remove Duplicates in Order",
            prompt: "Create a new list containing only the first occurrence of every value while preserving input order.",
            sample: "Input list: [3, 1, 3, 2, 1, 5]\nOutput: [3, 1, 2, 5]",
            hint: "Append a value only when it is not already present in the result list.",
            solution: "numbers = [3, 1, 3, 2, 1, 5]\nunique = []\nfor number in numbers:\n    if number not in unique:\n        unique.append(number)\nprint(unique)"
        },
        {
            id: "arena-14",
            level: 7,
            topic: "Collections",
            difficulty: "Medium",
            title: "Common Unique Values",
            prompt: "Find the sorted distinct values common to two lists.",
            sample: "Input: [1, 2, 2, 3] and [2, 3, 4]\nOutput: [2, 3]",
            hint: "Convert both lists to sets, intersect them and sort the result.",
            solution: "first = [1, 2, 2, 3]\nsecond = [2, 3, 4]\nprint(sorted(set(first) & set(second)))"
        },
        {
            id: "arena-15",
            level: 8,
            topic: "Dictionaries",
            difficulty: "Medium",
            title: "Word Frequency Table",
            prompt: "Read a sentence and build a dictionary that counts each lowercase word.",
            sample: "Input: learn build learn\nOutput: {'learn': 2, 'build': 1}",
            hint: "Split the lowercase sentence and update each count with get(word, 0) + 1.",
            solution: "words = input().lower().split()\nfrequency = {}\nfor word in words:\n    frequency[word] = frequency.get(word, 0) + 1\nprint(frequency)"
        },
        {
            id: "arena-16",
            level: 8,
            topic: "Dictionaries",
            difficulty: "Medium",
            title: "Highest Scoring Student",
            prompt: "Given a name-to-mark dictionary, display the name and mark of the highest-scoring student.",
            sample: "Input data: {'Asha': 82, 'Ravi': 75, 'Bhavya': 91}\nOutput: Bhavya 91",
            hint: "Use max with scores.get as the key function.",
            solution: "scores = {'Asha': 82, 'Ravi': 75, 'Bhavya': 91}\nname = max(scores, key=scores.get)\nprint(name, scores[name])"
        },
        {
            id: "arena-17",
            level: 9,
            topic: "Functions",
            difficulty: "Medium",
            title: "Reusable Prime Checker",
            prompt: "Write is_prime(n) and use it to display all prime numbers from 2 through a supplied limit.",
            sample: "Input: 10\nOutput: 2 3 5 7",
            hint: "A divisor only needs to be tested through the square root of n.",
            solution: "def is_prime(n):\n    if n < 2:\n        return False\n    for divisor in range(2, int(n ** 0.5) + 1):\n        if n % divisor == 0:\n            return False\n    return True\n\nlimit = int(input())\nprint(*[n for n in range(2, limit + 1) if is_prime(n)])"
        },
        {
            id: "arena-18",
            level: 9,
            topic: "Recursion",
            difficulty: "Medium",
            title: "Recursive Digit Sum",
            prompt: "Write a recursive function that returns the sum of the digits of a non-negative integer.",
            sample: "Input: 5724\nOutput: 18",
            hint: "Use n == 0 as the base case; otherwise add n % 10 to the result for n // 10.",
            solution: "def digit_sum(n):\n    if n == 0:\n        return 0\n    return n % 10 + digit_sum(n // 10)\n\nprint(digit_sum(int(input())))"
        },
        {
            id: "arena-19",
            level: 10,
            topic: "Files & Exceptions",
            difficulty: "Medium",
            title: "Safe Integer Reader",
            prompt: "Read a value, convert it to an integer and display Invalid integer when conversion fails.",
            sample: "Input: twelve\nOutput: Invalid integer",
            hint: "Place int(input()) inside try and catch ValueError with except.",
            solution: "try:\n    number = int(input())\n    print(\"Number =\", number)\nexcept ValueError:\n    print(\"Invalid integer\")"
        },
        {
            id: "arena-20",
            level: 10,
            topic: "Files & Exceptions",
            difficulty: "Medium",
            title: "Count Non-Empty File Lines",
            prompt: "Open notes.txt safely and count only lines that contain non-whitespace text.",
            sample: "Output: Non-empty lines = 6",
            hint: "Use with open(...), iterate through the file and test line.strip().",
            solution: "with open(\"notes.txt\", \"r\", encoding=\"utf-8\") as file:\n    count = sum(1 for line in file if line.strip())\nprint(\"Non-empty lines =\", count)"
        },
        {
            id: "arena-21",
            level: 11,
            topic: "OOP",
            difficulty: "Medium",
            title: "Student Result Class",
            prompt: "Create a Student class that stores a name and three marks and provides an average() method.",
            sample: "Asha average = 82.67",
            hint: "Store the marks in a list so sum() and len() can calculate the average.",
            solution: "class Student:\n    def __init__(self, name, marks):\n        self.name = name\n        self.marks = marks\n\n    def average(self):\n        return sum(self.marks) / len(self.marks)\n\nstudent = Student(\"Asha\", [75, 82, 91])\nprint(f\"{student.name} average = {student.average():.2f}\")"
        },
        {
            id: "arena-22",
            level: 11,
            topic: "OOP",
            difficulty: "Hard",
            title: "Polymorphic Area Report",
            prompt: "Define Circle and Rectangle classes that both provide area(), then process both objects through one loop.",
            sample: "Circle: 78.54\nRectangle: 24.00",
            hint: "The loop only needs to call shape.area(); each object decides how to calculate it.",
            solution: "import math\n\nclass Circle:\n    def __init__(self, radius):\n        self.radius = radius\n    def area(self):\n        return math.pi * self.radius ** 2\n\nclass Rectangle:\n    def __init__(self, length, width):\n        self.length = length\n        self.width = width\n    def area(self):\n        return self.length * self.width\n\nfor shape in [Circle(5), Rectangle(6, 4)]:\n    print(f\"{type(shape).__name__}: {shape.area():.2f}\")"
        },
        {
            id: "arena-23",
            level: 12,
            topic: "Advanced Python",
            difficulty: "Hard",
            title: "First Non-Repeating Character",
            prompt: "Find the first character that occurs exactly once in a supplied string; display None when no such character exists.",
            sample: "Input: swiss\nOutput: w",
            hint: "Count characters first, then scan the original string again to preserve order.",
            solution: "text = input()\ncounts = {}\nfor character in text:\n    counts[character] = counts.get(character, 0) + 1\nanswer = next((c for c in text if counts[c] == 1), None)\nprint(answer)"
        },
        {
            id: "arena-24",
            level: 12,
            topic: "Placement",
            difficulty: "Hard",
            title: "Pair Sum in Linear Time",
            prompt: "Read a list and target, then find one pair whose sum equals the target using O(n) expected time.",
            sample: "Input: [2, 7, 11, 15], target 9\nOutput: 2 7",
            hint: "Store values already seen in a set and check whether target - value exists.",
            solution: "numbers = [2, 7, 11, 15]\ntarget = 9\nseen = set()\nfor number in numbers:\n    needed = target - number\n    if needed in seen:\n        print(needed, number)\n        break\n    seen.add(number)"
        }
    ];

    function safelyParse(value, fallback) {
        try {
            const parsed = JSON.parse(value);
            return parsed && typeof parsed === "object" ? parsed : fallback;
        } catch (error) {
            return fallback;
        }
    }

    function readLevelState(level) {
        return safelyParse(
            window.localStorage.getItem(
                "codebhavya.python.level" + level + ".practice.v1"
            ) || "{}",
            {}
        );
    }

    function getLevelProgress(level) {
        const state = readLevelState(level);
        const prefix = problemPrefixes[level];
        let solved = 0;
        let completedWithSolution = 0;
        let score = 0;

        for (let index = 1; index <= PROBLEMS_PER_LEVEL; index += 1) {
            const record = state[prefix + "-p" + index] || {};
            const best = Number(record.best || 0);
            const completed = Boolean(record.completedWithSolution);

            if (best > 0) {
                solved += 1;
                score += best;
            } else if (completed) {
                completedWithSolution += 1;
            }
        }

        return {
            solved: solved,
            completedWithSolution: completedWithSolution,
            completed: solved + completedWithSolution,
            score: score
        };
    }

    function initializeProgress() {
        const cards = Array.from(
            document.querySelectorAll("[data-arena-level]")
        );

        let totalSolved = 0;
        let totalCompletedWithSolution = 0;
        let totalScore = 0;
        let completeLevels = 0;

        cards.forEach(function (card) {
            const level = Number(card.dataset.arenaLevel);
            const progress = getLevelProgress(level);
            const percent = Math.round(
                progress.completed / PROBLEMS_PER_LEVEL * 100
            );

            totalSolved += progress.solved;
            totalCompletedWithSolution +=
                progress.completedWithSolution;
            totalScore += progress.score;

            if (progress.completed === PROBLEMS_PER_LEVEL) {
                completeLevels += 1;
                card.dataset.status = "complete";
            } else if (progress.completed > 0) {
                card.dataset.status = "progress";
            } else {
                card.dataset.status = "not-started";
            }

            card.querySelector("[data-level-count]").textContent =
                progress.completed + " / " +
                PROBLEMS_PER_LEVEL + " complete";

            card.querySelector("[data-level-percent]").textContent =
                percent + "%";

            card.querySelector("[data-level-bar]").style.width =
                percent + "%";
        });

        const totalCompleted =
            totalSolved + totalCompletedWithSolution;

        const totalProblems =
            TOTAL_LEVELS * PROBLEMS_PER_LEVEL;

        const percent = Math.round(
            totalCompleted / totalProblems * 100
        );

        document.getElementById("pythonArenaSolved").textContent =
            totalSolved + " / " + totalProblems;

        document.getElementById("pythonArenaCompleted").textContent =
            String(totalCompletedWithSolution);

        document.getElementById("pythonArenaScore").textContent =
            totalScore + " / " + (totalProblems * 100);

        document.getElementById("pythonArenaLevels").textContent =
            completeLevels + " / " + TOTAL_LEVELS;

        document.getElementById("pythonArenaPercent").textContent =
            percent + "%";

        document.getElementById(
            "pythonArenaProgressBar"
        ).style.width = percent + "%";
    }

    function initializeFilters() {
        const search =
            document.getElementById("pythonArenaSearch");

        const stage =
            document.getElementById("pythonArenaStage");

        const status =
            document.getElementById("pythonArenaStatus");

        const cards = Array.from(
            document.querySelectorAll("[data-arena-level]")
        );

        const empty =
            document.getElementById("pythonArenaEmpty");

        function applyFilters() {
            const query =
                search.value.toLowerCase().trim();

            let visible = 0;

            cards.forEach(function (card) {
                const searchable = (
                    card.dataset.search + " " +
                    card.textContent
                ).toLowerCase();

                const matchesSearch =
                    !query ||
                    searchable.indexOf(query) !== -1;

                const matchesStage =
                    stage.value === "all" ||
                    card.dataset.stage === stage.value;

                const matchesStatus =
                    status.value === "all" ||
                    card.dataset.status === status.value;

                const show =
                    matchesSearch &&
                    matchesStage &&
                    matchesStatus;

                card.hidden = !show;

                if (show) {
                    visible += 1;
                }
            });

            empty.hidden = visible > 0;
        }

        search.addEventListener("input", applyFilters);
        stage.addEventListener("change", applyFilters);
        status.addEventListener("change", applyFilters);
    }

    function shuffle(values) {
        const copy = values.slice();

        for (
            let index = copy.length - 1;
            index > 0;
            index -= 1
        ) {
            const randomIndex =
                Math.floor(Math.random() * (index + 1));

            const temporary = copy[index];
            copy[index] = copy[randomIndex];
            copy[randomIndex] = temporary;
        }

        return copy;
    }

    function readArenaState() {
        const state = safelyParse(
            window.localStorage.getItem(
                ARENA_STORAGE_KEY
            ) || "{}",
            {}
        );

        if (!Array.isArray(state.practised)) {
            state.practised = [];
        }

        return state;
    }

    function saveArenaState(state) {
        try {
            window.localStorage.setItem(
                ARENA_STORAGE_KEY,
                JSON.stringify(state)
            );
        } catch (error) {
            /* Arena works when storage is unavailable. */
        }
    }

    function setButtonDisabled(button, disabled) {
        button.disabled = disabled;
        button.setAttribute(
            "aria-disabled",
            String(disabled)
        );
    }

    function initializeChallengeGenerator() {
        const title =
            document.getElementById("pythonChallengeTitle");

        const prompt =
            document.getElementById("pythonChallengePrompt");

        const sample =
            document.getElementById("pythonChallengeSample");

        const level =
            document.getElementById("pythonChallengeLevel");

        const topic =
            document.getElementById("pythonChallengeTopic");

        const difficulty =
            document.getElementById(
                "pythonChallengeDifficulty"
            );

        const deckStatus =
            document.getElementById(
                "pythonChallengeDeckStatus"
            );

        const hintPanel =
            document.getElementById("pythonChallengeHint");

        const solutionPanel =
            document.getElementById(
                "pythonChallengeSolution"
            );

        const next =
            document.getElementById("pythonNewChallenge");

        const showHint =
            document.getElementById(
                "pythonShowChallengeHint"
            );

        const showSolution =
            document.getElementById(
                "pythonShowChallengeSolution"
            );

        const mark =
            document.getElementById(
                "pythonMarkChallenge"
            );

        const openLevel =
            document.getElementById(
                "pythonOpenChallengeLevel"
            );

        const reset =
            document.getElementById(
                "pythonResetChallengeDeck"
            );

        const state = readArenaState();
        let deck = shuffle(challenges);
        let position = 0;

        function currentChallenge() {
            return deck[position];
        }

        function render() {
            const challenge = currentChallenge();

            const alreadyPractised =
                state.practised.indexOf(
                    challenge.id
                ) !== -1;

            title.textContent = challenge.title;
            prompt.textContent = challenge.prompt;
            sample.textContent = challenge.sample;
            level.textContent =
                "Level " + challenge.level;
            topic.textContent = challenge.topic;
            difficulty.textContent =
                challenge.difficulty;

            hintPanel.querySelector("p").textContent =
                challenge.hint;

            solutionPanel.querySelector(
                "pre"
            ).textContent = challenge.solution;

            hintPanel.hidden = true;
            solutionPanel.hidden = true;

            showHint.textContent = "Show Hint";
            showSolution.textContent = "Show Approach";

            openLevel.href =
                levelFiles[challenge.level] +
                "#programmingProblems";

            deckStatus.textContent =
                "Challenge " + (position + 1) +
                " of " + deck.length +
                " • Practised " +
                state.practised.length;

            const atEnd =
                position === deck.length - 1;

            setButtonDisabled(next, atEnd);

            next.textContent = atEnd
                ? "End of Challenge Deck"
                : "Next Challenge →";

            setButtonDisabled(
                mark,
                alreadyPractised
            );

            mark.textContent = alreadyPractised
                ? "✓ Already Practised"
                : "✓ Mark Practised";
        }

        next.addEventListener("click", function () {
            if (position < deck.length - 1) {
                position += 1;
                render();
            }
        });

        showHint.addEventListener(
            "click",
            function () {
                const show = hintPanel.hidden;
                hintPanel.hidden = !show;

                showHint.textContent = show
                    ? "Hide Hint"
                    : "Show Hint";
            }
        );

        showSolution.addEventListener(
            "click",
            function () {
                const show = solutionPanel.hidden;
                solutionPanel.hidden = !show;

                showSolution.textContent = show
                    ? "Hide Approach"
                    : "Show Approach";
            }
        );

        mark.addEventListener("click", function () {
            const challenge = currentChallenge();

            if (
                state.practised.indexOf(
                    challenge.id
                ) === -1
            ) {
                state.practised.push(challenge.id);
                saveArenaState(state);
                render();
            }
        });

        reset.addEventListener("click", function () {
            deck = shuffle(challenges);
            position = 0;
            render();

            title.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });
        });

        render();
    }

    function initializeQuiz() {
        const quiz = document.querySelector(
            "[data-python-arena-quiz]"
        );

        if (!quiz) {
            return;
        }

        const questions = Array.from(
            quiz.querySelectorAll("[data-correct]")
        );

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

            feedback.hidden = true;
            feedback.textContent = "";
        }

        quiz.querySelector(
            "[data-check-arena-quiz]"
        ).addEventListener("click", function () {
            let score = 0;

            questions.forEach(function (question) {
                const selected =
                    question.querySelector(
                        "input:checked"
                    );

                const feedback =
                    question.querySelector(
                        ".python-quiz-feedback"
                    );

                const correct =
                    selected &&
                    selected.value ===
                    question.dataset.correct;

                question.classList.toggle(
                    "is-correct",
                    Boolean(correct)
                );

                question.classList.toggle(
                    "is-wrong",
                    !correct
                );

                feedback.hidden = false;

                if (correct) {
                    score += 1;
                    feedback.textContent = "✓ Correct";
                } else if (!selected) {
                    feedback.textContent =
                        "Choose an answer before checking.";
                } else {
                    feedback.textContent =
                        "Review this topic and try again.";
                }
            });

            result.textContent =
                "Score: " + score +
                " / " + questions.length;
        });

        quiz.querySelector(
            "[data-reset-arena-quiz]"
        ).addEventListener("click", function () {
            questions.forEach(function (question) {
                question.querySelectorAll(
                    "input"
                ).forEach(function (input) {
                    input.checked = false;
                });

                clearQuestion(question);
            });

            result.textContent = "";

            questions[0].scrollIntoView({
                behavior: "smooth",
                block: "center"
            });
        });
    }

    function initializeArena() {
        initializeProgress();
        initializeFilters();
        initializeChallengeGenerator();
        initializeQuiz();

        window.addEventListener(
            "storage",
            initializeProgress
        );
    }

    if (document.readyState === "loading") {
        document.addEventListener(
            "DOMContentLoaded",
            initializeArena
        );
    } else {
        initializeArena();
    }
}());
