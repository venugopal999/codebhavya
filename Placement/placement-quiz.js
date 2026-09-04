(function () {
    "use strict";

    const cloud = window.CodeBhavyaSupabase || {};
    const client = cloud.client || null;
    const HISTORY_KEY = "codebhavya-placement-mcq-history-v1";
    const PLAN_KEY = "codebhavya-placement-plan-v1";
    const READINESS_KEY = "codebhavya-placement-readiness-v1";
    const MOBILE_BREAKPOINT = 920;

    const topicProfiles = {
        aptitude: { label: "Maths & Aptitude", description: "Fresh quantitative and logical placement questions with speed-focused explanations." },
        c: { label: "C Practice", description: "Placement-exclusive C output, debugging, arrays, pointers, strings and memory questions." },
        python: { label: "Python Practice", description: "Fresh Python behaviour, collections, functions, exceptions and debugging questions." },
        dsa: { label: "DSA Practice", description: "Data-structure selection, algorithm tracing and complexity decisions for placements." },
        database: { label: "Database Practice", description: "SQL reasoning, keys, joins, normalization, indexes and transaction questions." },
        "core-cs": { label: "Core Computer Science", description: "Operating systems, networks, OOP and software-engineering placement questions." },
        "ai-ml": { label: "AI & ML Practice", description: "Data preparation, model evaluation, leakage, metrics and responsible-ML scenarios." }
    };

    const targetLabels = { general: "General", service: "Service Company", product: "Product Company", ai: "AI / ML / Data" };

    const fallbackQuestions = [
        {
            id: "starter-aptitude-1", slug: "starter-successive-percent", topic: "aptitude", subtopic: "Percentages", difficulty: "beginner", target_path: "general", time_limit_seconds: 60,
            question_text: "A salary is increased by 10% and then reduced by 10%. What is the net change?",
            options: [{ key: "A", text: "No change" }, { key: "B", text: "1% decrease" }, { key: "C", text: "1% increase" }, { key: "D", text: "2% decrease" }],
            correct_option: "B", explanation: "Using 100 as the original salary: 100 becomes 110, then a 10% reduction of 110 gives 99. The result is a 1% decrease.",
            option_explanations: { A: "The two percentages use different bases, so they do not cancel.", B: "Correct: the final value is 99% of the original.", C: "The second change reduces the increased value; it cannot create a net increase here.", D: "The decrease is 1%, not the sum of the two rates." },
            correction_rule: "Apply every successive percentage to the current value, not the original value.", isFallback: true
        },
        {
            id: "starter-aptitude-2", slug: "starter-average-change", topic: "aptitude", subtopic: "Averages", difficulty: "intermediate", target_path: "general", time_limit_seconds: 75,
            question_text: "The average of eight values is 24. One value 18 is replaced by 34. What is the new average?",
            options: [{ key: "A", text: "24" }, { key: "B", text: "25" }, { key: "C", text: "26" }, { key: "D", text: "28" }],
            correct_option: "C", explanation: "The total increases by 34 − 18 = 16. Dividing that increase by eight raises the average by 2, from 24 to 26.",
            option_explanations: { A: "The total changed, so the average must change.", B: "A 16-point total increase across eight values raises the average by 2, not 1.", C: "Correct: 24 + 16/8 = 26.", D: "This adds the full replacement difference to the average instead of distributing it." },
            correction_rule: "For a replacement, update the total by new minus old, then divide by the unchanged count.", isFallback: true
        },
        {
            id: "starter-c-1", slug: "starter-c-loop-bound", topic: "c", subtopic: "Arrays and Loops", difficulty: "beginner", target_path: "general", time_limit_seconds: 60,
            question_text: "For an array int a[5], which loop condition safely visits every valid index exactly once when i starts at 0?",
            options: [{ key: "A", text: "i <= 5" }, { key: "B", text: "i < 5" }, { key: "C", text: "i < 4" }, { key: "D", text: "i != 6" }],
            correct_option: "B", explanation: "A five-element zero-based array has valid indexes 0 through 4, so the loop must continue while i is less than 5.",
            option_explanations: { A: "This also accesses index 5, which is outside the array.", B: "Correct: it visits 0, 1, 2, 3 and 4.", C: "This stops before index 4 and misses the final element.", D: "It would reach index 5 before stopping at 6." },
            correction_rule: "For an array of n elements indexed from zero, use indexes 0 through n − 1.", isFallback: true
        },
        {
            id: "starter-c-2", slug: "starter-c-static", topic: "c", subtopic: "Storage Duration", difficulty: "intermediate", target_path: "general", time_limit_seconds: 75,
            question_text: "A function contains static int count = 0; and increments count on every call. What happens to count between calls?",
            options: [{ key: "A", text: "It returns to 0 before every call" }, { key: "B", text: "It keeps its previous value" }, { key: "C", text: "It becomes global and accessible everywhere" }, { key: "D", text: "Its value is undefined after the first call" }],
            correct_option: "B", explanation: "A static local variable has block scope but static storage duration, so its value persists across function calls.",
            option_explanations: { A: "Automatic locals are recreated; a static local retains storage.", B: "Correct: initialization occurs once and the value persists.", C: "Its lifetime is long, but its name still has local block scope.", D: "Incrementing a valid static integer does not make it undefined unless overflow occurs." },
            correction_rule: "Separate scope from lifetime: static local means local visibility with program-long storage.", isFallback: true
        },
        {
            id: "starter-python-1", slug: "starter-python-alias", topic: "python", subtopic: "Lists and Aliasing", difficulty: "beginner", target_path: "general", time_limit_seconds: 60,
            question_text: "After a = [1, 2], b = a and b.append(3), what is a?",
            options: [{ key: "A", text: "[1, 2]" }, { key: "B", text: "[1, 2, 3]" }, { key: "C", text: "[3]" }, { key: "D", text: "An error occurs" }],
            correct_option: "B", explanation: "Both names refer to the same mutable list. Appending through b changes the object that a also references.",
            option_explanations: { A: "This would require b to be a copy rather than an alias.", B: "Correct: a and b reference one list object.", C: "append adds to the existing elements; it does not replace them.", D: "Aliasing mutable objects is valid Python." },
            correction_rule: "Assignment copies a reference; use an explicit copy when independent mutable objects are required.", isFallback: true
        },
        {
            id: "starter-python-2", slug: "starter-python-default", topic: "python", subtopic: "Functions", difficulty: "intermediate", target_path: "ai", time_limit_seconds: 75,
            question_text: "Why is def add_item(x, items=[]) risky when the function appends to items?",
            options: [{ key: "A", text: "Lists cannot be function parameters" }, { key: "B", text: "The default list is shared across calls" }, { key: "C", text: "append creates a syntax error" }, { key: "D", text: "Default values are always converted to tuples" }],
            correct_option: "B", explanation: "Default argument objects are created when the function is defined, so calls that omit items reuse the same mutable list.",
            option_explanations: { A: "Lists are valid parameters.", B: "Correct: mutations persist because the same default object is reused.", C: "append is a normal list method.", D: "Python does not automatically convert the list to a tuple." },
            correction_rule: "Use None as a sentinel and create a new mutable object inside the function.", isFallback: true
        },
        {
            id: "starter-dsa-1", slug: "starter-dsa-brackets", topic: "dsa", subtopic: "Stacks", difficulty: "beginner", target_path: "general", time_limit_seconds: 60,
            question_text: "Which data structure most directly validates correctly nested brackets such as {[()] }?",
            options: [{ key: "A", text: "Queue" }, { key: "B", text: "Stack" }, { key: "C", text: "Binary search tree" }, { key: "D", text: "Min-heap" }],
            correct_option: "B", explanation: "The last bracket opened must be the first bracket closed, which is exactly last-in, first-out stack behaviour.",
            option_explanations: { A: "FIFO order does not match nested closing order.", B: "Correct: push openings and match each closing bracket with the stack top.", C: "Ordering keys is unrelated to bracket nesting.", D: "Priority order does not preserve nesting." },
            correction_rule: "Choose a stack when the most recent unfinished item must be handled first.", isFallback: true
        },
        {
            id: "starter-dsa-2", slug: "starter-dsa-bfs", topic: "dsa", subtopic: "Graphs", difficulty: "intermediate", target_path: "general", time_limit_seconds: 75,
            question_text: "Which algorithm finds a shortest path by number of edges in an unweighted graph?",
            options: [{ key: "A", text: "Depth-first search" }, { key: "B", text: "Breadth-first search" }, { key: "C", text: "Heap sort" }, { key: "D", text: "Binary search" }],
            correct_option: "B", explanation: "BFS explores vertices level by level, so the first discovery of a vertex uses the minimum number of edges from the source.",
            option_explanations: { A: "DFS may follow a long path before seeing a shorter one.", B: "Correct: queue-based level exploration gives unweighted shortest distance.", C: "Heap sort orders values rather than traversing paths.", D: "Binary search requires ordered searchable data, not a general graph." },
            correction_rule: "For unweighted shortest paths, think in BFS distance layers.", isFallback: true
        },
        {
            id: "starter-db-1", slug: "starter-db-primary-key", topic: "database", subtopic: "Keys", difficulty: "beginner", target_path: "general", time_limit_seconds: 60,
            question_text: "Which property must a primary key have?",
            options: [{ key: "A", text: "It may contain duplicate values" }, { key: "B", text: "It uniquely identifies each row" }, { key: "C", text: "It must always be a person's name" }, { key: "D", text: "It can identify only some rows" }],
            correct_option: "B", explanation: "A primary key provides a unique, non-null identity for every row in the table.",
            option_explanations: { A: "Duplicates would prevent unique row identification.", B: "Correct: uniqueness and non-null identity are essential.", C: "Names are often non-unique and changeable; a key is not required to be a name.", D: "Every row must have a valid primary-key value." },
            correction_rule: "A primary key must identify one and only one row.", isFallback: true
        },
        {
            id: "starter-db-2", slug: "starter-db-having", topic: "database", subtopic: "SQL Aggregation", difficulty: "intermediate", target_path: "general", time_limit_seconds: 75,
            question_text: "Which clause filters groups after GROUP BY and aggregate calculation?",
            options: [{ key: "A", text: "WHERE" }, { key: "B", text: "HAVING" }, { key: "C", text: "ORDER BY" }, { key: "D", text: "DISTINCT" }],
            correct_option: "B", explanation: "WHERE filters input rows before grouping, while HAVING filters the aggregated groups produced by GROUP BY.",
            option_explanations: { A: "WHERE acts before group aggregation and generally cannot filter an aggregate result.", B: "Correct: HAVING applies conditions to groups.", C: "ORDER BY sorts the result.", D: "DISTINCT removes duplicate result rows or values." },
            correction_rule: "Use WHERE for rows before grouping and HAVING for groups after aggregation.", isFallback: true
        },
        {
            id: "starter-core-1", slug: "starter-core-process-thread", topic: "core-cs", subtopic: "Operating Systems", difficulty: "beginner", target_path: "general", time_limit_seconds: 60,
            question_text: "Threads in the same process normally share which resource?",
            options: [{ key: "A", text: "The process address space" }, { key: "B", text: "Each thread's call stack" }, { key: "C", text: "Each thread's program counter" }, { key: "D", text: "Each thread's CPU registers" }],
            correct_option: "A", explanation: "Threads share their process code, data and heap, while each thread keeps its own stack, program counter and register state.",
            option_explanations: { A: "Correct: shared address space enables cheap communication but creates synchronization risks.", B: "Each thread needs an independent call stack.", C: "Each thread must track its own next instruction.", D: "Register state belongs to each independently scheduled thread." },
            correction_rule: "Threads share process resources but keep their own execution state.", isFallback: true
        },
        {
            id: "starter-core-2", slug: "starter-core-udp", topic: "core-cs", subtopic: "Computer Networks", difficulty: "intermediate", target_path: "general", time_limit_seconds: 75,
            question_text: "Why may a live voice application prefer UDP for media packets?",
            options: [{ key: "A", text: "UDP guarantees delivery order" }, { key: "B", text: "Late retransmitted audio may be less useful than timely new audio" }, { key: "C", text: "UDP automatically corrects every lost packet" }, { key: "D", text: "UDP requires a connection handshake" }],
            correct_option: "B", explanation: "Real-time media values timeliness. Applications may tolerate or conceal some loss rather than wait for retransmission of packets whose playback deadline has passed.",
            option_explanations: { A: "UDP does not guarantee ordering.", B: "Correct: timeliness can matter more than perfect delivery.", C: "Loss handling must be added by the application or higher protocol.", D: "UDP is connectionless and has no TCP-style handshake." },
            correction_rule: "Choose transport behaviour from application requirements: reliability, ordering and timeliness.", isFallback: true
        },
        {
            id: "starter-ai-1", slug: "starter-ai-leakage", topic: "ai-ml", subtopic: "Model Evaluation", difficulty: "beginner", target_path: "ai", time_limit_seconds: 60,
            question_text: "Which situation is a clear example of data leakage?",
            options: [{ key: "A", text: "Scaling training features using statistics calculated from the full dataset before splitting" }, { key: "B", text: "Evaluating once on a held-out test set" }, { key: "C", text: "Removing duplicate rows before splitting" }, { key: "D", text: "Recording the random seed" }],
            correct_option: "A", explanation: "Full-dataset scaling lets information from validation or test samples influence training preprocessing, producing an overly optimistic evaluation.",
            option_explanations: { A: "Correct: future evaluation information enters the training pipeline.", B: "A held-out test set is normal when it remains untouched during development.", C: "Careful duplicate handling reduces cross-split contamination.", D: "Recording a seed improves reproducibility." },
            correction_rule: "Fit every learned preprocessing step only on training data, then transform validation and test data.", isFallback: true
        },
        {
            id: "starter-ai-2", slug: "starter-ai-recall", topic: "ai-ml", subtopic: "Classification Metrics", difficulty: "intermediate", target_path: "ai", time_limit_seconds: 75,
            question_text: "In a medical screening task where missing a true case is very costly, which metric deserves special attention?",
            options: [{ key: "A", text: "Recall" }, { key: "B", text: "Training accuracy only" }, { key: "C", text: "Number of model parameters" }, { key: "D", text: "Mean squared error without context" }],
            correct_option: "A", explanation: "Recall measures the proportion of actual positive cases detected. When false negatives are especially costly, low recall directly exposes that risk.",
            option_explanations: { A: "Correct: recall = true positives divided by all actual positives.", B: "Training accuracy does not measure generalisation or the specific false-negative cost.", C: "Parameter count is not a detection-quality metric.", D: "MSE is not the direct classification metric for this requirement." },
            correction_rule: "Select metrics from the real cost of false positives and false negatives, not convenience.", isFallback: true
        }
    ];

    let currentTopic = "aptitude";
    let currentUser = null;
    let activeQuestions = [];
    let results = [];
    let currentIndex = 0;
    let secondsRemaining = 0;
    let questionLimit = 60;
    let timerId = null;
    let submitted = false;
    let history = [];
    let source = "starter";
    let availableCount = null;

    function element(id) { return document.getElementById(id); }

    function readJson(key, fallback) {
        try { const value = window.localStorage.getItem(key); return value ? JSON.parse(value) : fallback; } catch (error) { return fallback; }
    }

    function writeHistory(entry) {
        const stored = readJson(HISTORY_KEY, []);
        const entries = Array.isArray(stored) ? stored : [];
        entries.unshift(entry);
        try { window.localStorage.setItem(HISTORY_KEY, JSON.stringify(entries.slice(0, 1000))); } catch (error) { return; }
        history = entries.slice(0, 1000);
    }

    function recommendedTopic() {
        const answers = readJson(READINESS_KEY, []);
        const topics = ["aptitude", "c", "c", "dsa", "core-cs", "database", "core-cs", "aptitude"];
        if (!Array.isArray(answers) || !answers.some(Boolean)) { return "aptitude"; }
        let lowestIndex = 0;
        let lowestScore = 3;
        topics.forEach(function (topic, index) {
            const score = [answers[index * 2], answers[index * 2 + 1]].filter(Boolean).length;
            if (score < lowestScore) { lowestIndex = index; lowestScore = score; }
        });
        return topics[lowestIndex];
    }

    function resolveTopic() {
        const requested = String(new URLSearchParams(window.location.search).get("topic") || "aptitude").toLowerCase();
        return requested === "recommended" ? recommendedTopic() : (topicProfiles[requested] ? requested : "aptitude");
    }

    function applyTopic() {
        const profile = topicProfiles[currentTopic];
        document.title = profile.label + " Quiz | CodeBhavya";
        element("quizTitle").textContent = profile.label + " Quiz";
        element("quizDescription").textContent = profile.description;
        element("quizBreadcrumbTopic").textContent = profile.label;
        document.querySelectorAll("[data-quiz-topic]").forEach(function (link) { link.classList.toggle("active", link.dataset.quizTopic === currentTopic); });
    }

    function normalizeOptions(value) {
        const parsed = Array.isArray(value)
            ? value
            : (value && typeof value === "object"
                ? Object.keys(value).sort().map(function (key) { return { key: key, text: value[key] }; })
                : []);
        return parsed.map(function (option, index) {
            return typeof option === "object"
                ? { key: String(option.key || String.fromCharCode(65 + index)), text: String(option.text || "") }
                : { key: String.fromCharCode(65 + index), text: String(option) };
        }).filter(function (option) { return option.text; });
    }

    function normalizeQuestion(row) {
        return {
            id: row.id,
            slug: row.slug || String(row.id),
            topic: row.topic,
            subtopic: row.subtopic || topicProfiles[row.topic].label,
            difficulty: row.difficulty || "intermediate",
            target_path: row.target_path || "general",
            time_limit_seconds: Math.max(20, Math.min(180, Number(row.time_limit_seconds) || 60)),
            question_text: row.question_text,
            options: normalizeOptions(row.options),
            correction_rule: row.correction_rule || "Review the explanation and restate the deciding rule before continuing.",
            isFallback: false
        };
    }

    function setSource(kind, message) {
        source = kind;
        element("quizSourceNote").dataset.source = kind;
        element("quizSourceNote").querySelector("b").textContent = message;
    }

    function getFilters() {
        return { target: element("quizTarget").value, difficulty: element("quizDifficulty").value, length: Number(element("quizLength").value) || 5 };
    }

    async function loadHistory() {
        const local = readJson(HISTORY_KEY, []);
        history = Array.isArray(local) ? local : [];
        if (!client || !currentUser) { return history; }
        try {
            const result = await client.from("mcq_attempts").select("question_id,topic,is_correct,attempted_at,duration_seconds").eq("user_id", currentUser.id).eq("topic", currentTopic).order("attempted_at", { ascending: false }).limit(1000);
            if (result.error) { throw result.error; }
            const remote = (result.data || []).map(function (item) { return { question_id: item.question_id, topic: item.topic, is_correct: item.is_correct, attempted_at: item.attempted_at, duration_seconds: item.duration_seconds }; });
            history = remote.concat(history);
        } catch (error) { return history; }
        return history;
    }

    async function loadQuestions(filters) {
        if (!client) {
            const starter = fallbackQuestions.filter(function (question) { return question.topic === currentTopic && (filters.difficulty === "all" || question.difficulty === filters.difficulty); });
            setSource("starter", "Starter questions active. Run the Phase 1 Supabase SQL to unlock the complete bank.");
            return starter;
        }
        try {
            let query = client.from("mcq_questions").select("id,slug,topic,subtopic,difficulty,target_path,time_limit_seconds,question_text,options,correction_rule").eq("is_published", true).eq("topic", currentTopic);
            if (filters.target !== "general") { query = query.in("target_path", ["general", filters.target]); }
            if (filters.difficulty !== "all") { query = query.eq("difficulty", filters.difficulty); }
            const result = await query.order("created_at", { ascending: true }).limit(250);
            if (result.error) { throw result.error; }
            const questions = (result.data || []).map(normalizeQuestion).filter(function (question) { return question.options.length === 4; });
            if (!questions.length) { throw new Error("No questions found"); }
            setSource("cloud", questions.length + " matching questions ready. Unseen questions come first.");
            return questions;
        } catch (error) {
            const starter = fallbackQuestions.filter(function (question) { return question.topic === currentTopic && (filters.difficulty === "all" || question.difficulty === filters.difficulty); });
            setSource("starter", "Starter questions active. The complete MCQ bank could not be reached.");
            return starter;
        }
    }

    function prioritizeQuestions(questions, limit) {
        const latest = new Map();
        history.forEach(function (attempt) {
            const id = String(attempt.question_id || attempt.questionId || "");
            if (!latest.has(id)) { latest.set(id, attempt); }
        });
        return questions.slice().sort(function (first, second) {
            const a = latest.get(String(first.id));
            const b = latest.get(String(second.id));
            if (!a && b) { return -1; }
            if (a && !b) { return 1; }
            if (!a && !b) { return Math.random() - 0.5; }
            if (Boolean(a.is_correct) !== Boolean(b.is_correct)) { return a.is_correct ? 1 : -1; }
            return Date.parse(a.attempted_at || 0) - Date.parse(b.attempted_at || 0);
        }).slice(0, limit);
    }

    function updateHeadingStats(questions) {
        const topicAttempts = history.filter(function (attempt) { return attempt.topic === currentTopic; });
        const solved = new Set(topicAttempts.filter(function (attempt) { return attempt.is_correct; }).map(function (attempt) { return String(attempt.question_id || attempt.questionId); }));
        const accuracy = topicAttempts.length ? Math.round(topicAttempts.filter(function (attempt) { return attempt.is_correct; }).length / topicAttempts.length * 100) + "%" : "—";
        if (questions) { availableCount = questions.length; }
        element("quizAvailableCount").textContent = availableCount === null ? "—" : String(availableCount);
        element("quizSolvedCount").textContent = String(solved.size);
        element("quizAccuracy").textContent = accuracy;
    }

    function renderOptions(question) {
        const container = element("quizOptions");
        container.replaceChildren();
        question.options.forEach(function (option) {
            const label = document.createElement("label");
            const input = document.createElement("input");
            const content = document.createElement("span");
            const key = document.createElement("b");
            const text = document.createElement("i");
            label.className = "quiz-option";
            input.type = "radio";
            input.name = "quizOption";
            input.value = option.key;
            key.textContent = option.key;
            text.textContent = option.text;
            text.style.fontStyle = "normal";
            content.append(key, text);
            label.append(input, content);
            container.append(label);
        });
    }

    function updateTimer() {
        element("quizTimer").textContent = String(secondsRemaining);
        element("quizCountdownBox").classList.toggle("is-urgent", secondsRemaining <= 10);
    }

    function stopTimer() { window.clearInterval(timerId); timerId = null; }

    function startTimer() {
        stopTimer();
        updateTimer();
        timerId = window.setInterval(function () {
            secondsRemaining -= 1;
            updateTimer();
            if (secondsRemaining <= 0) { stopTimer(); submitCurrentAnswer(true); }
        }, 1000);
    }

    function renderQuestion() {
        const question = activeQuestions[currentIndex];
        if (!question) { renderSummary(); return; }
        submitted = false;
        element("quizAnswerForm").hidden = false;
        element("quizFeedback").hidden = true;
        element("quizAnswerMessage").textContent = "";
        element("quizSubmitButton").disabled = false;
        element("quizProgressText").textContent = "QUESTION " + (currentIndex + 1) + " OF " + activeQuestions.length;
        element("quizProgress").setAttribute("aria-valuemax", String(activeQuestions.length));
        element("quizProgress").setAttribute("aria-valuenow", String(currentIndex + 1));
        element("quizProgressBar").style.width = (((currentIndex + 1) / activeQuestions.length) * 100) + "%";
        element("quizQuestionTopic").textContent = question.subtopic;
        element("quizQuestionDifficulty").textContent = question.difficulty;
        element("quizQuestionTarget").textContent = targetLabels[question.target_path] || question.target_path;
        element("quizQuestionText").textContent = question.question_text;
        renderOptions(question);
        questionLimit = question.time_limit_seconds;
        secondsRemaining = questionLimit;
        startTimer();
        element("quizQuestionText").setAttribute("tabindex", "-1");
        element("quizQuestionText").focus({ preventScroll: true });
    }

    async function startQuiz(event) {
        if (event) { event.preventDefault(); }
        stopTimer();
        element("quizEmptyState").hidden = true;
        element("quizQuestionCard").hidden = true;
        element("quizSummary").hidden = true;
        element("quizLoadingState").hidden = false;
        element("quizStartButton").disabled = true;
        const filters = getFilters();
        await loadHistory();
        const questions = await loadQuestions(filters);
        updateHeadingStats(questions);
        activeQuestions = prioritizeQuestions(questions, filters.length);
        results = [];
        currentIndex = 0;
        element("quizLoadingState").hidden = true;
        element("quizStartButton").disabled = false;
        if (!activeQuestions.length) {
            element("quizEmptyState").hidden = false;
            element("quizWorkspaceTitle").textContent = "No questions match this exact filter yet.";
            element("quizEmptyState").querySelector("p").textContent = "Choose Balanced difficulty or another company target. Your filters were not changed.";
            return;
        }
        if (activeQuestions.length < filters.length) { setSource(source, "This session contains all " + activeQuestions.length + " matching questions without repeating one inside the quiz."); }
        element("quizQuestionCard").hidden = false;
        renderQuestion();
        element("quizWorkspace").scrollIntoView({ behavior: "smooth", block: "start" });
    }

    function localEvaluation(question, selected) {
        return {
            is_correct: selected === question.correct_option,
            correct_option: question.correct_option,
            explanation: question.explanation,
            option_explanations: question.option_explanations,
            correction_rule: question.correction_rule
        };
    }

    async function evaluate(question, selected, duration) {
        if (question.isFallback) { return localEvaluation(question, selected); }
        const response = await client.rpc("submit_mcq_answer", { p_question_id: question.id, p_selected_option: selected || null, p_duration_seconds: duration });
        if (response.error) { throw response.error; }
        return response.data;
    }

    function renderFeedback(question, selected, evaluation, timedOut) {
        const correct = Boolean(evaluation.is_correct);
        const heading = element("quizFeedbackHeading");
        heading.classList.toggle("is-wrong", !correct);
        element("quizFeedbackIcon").textContent = correct ? "✓" : "!";
        element("quizFeedbackLabel").textContent = correct ? "CORRECT" : (timedOut ? "TIME EXPIRED" : "NEEDS REVIEW");
        element("quizFeedbackTitle").textContent = correct ? "Your answer is correct." : "The deciding idea is explained below.";
        element("quizExplanation").textContent = evaluation.explanation;
        element("quizCorrectionRule").textContent = evaluation.correction_rule || question.correction_rule;
        const review = element("quizOptionExplanations");
        review.replaceChildren();
        question.options.forEach(function (option) {
            const row = document.createElement("div");
            const key = document.createElement("b");
            const text = document.createElement("span");
            row.className = "quiz-option-explanation";
            if (option.key === evaluation.correct_option) { row.classList.add("is-correct"); }
            if (!correct && option.key === selected) { row.classList.add("is-selected-wrong"); }
            key.textContent = option.key;
            text.textContent = evaluation.option_explanations && evaluation.option_explanations[option.key]
                ? evaluation.option_explanations[option.key]
                : (option.key === evaluation.correct_option ? "This is the correct choice." : "This choice does not satisfy the key condition.");
            row.append(key, text);
            review.append(row);
        });
        element("quizFeedback").hidden = false;
        element("quizFeedback").setAttribute("tabindex", "-1");
        element("quizFeedback").focus({ preventScroll: true });
    }

    async function submitCurrentAnswer(timedOut) {
        if (submitted) { return; }
        const question = activeQuestions[currentIndex];
        const selectedInput = document.querySelector('input[name="quizOption"]:checked');
        const selected = selectedInput ? selectedInput.value : null;
        if (!timedOut && !selected) { element("quizAnswerMessage").textContent = "Select one option before submitting."; return; }
        submitted = true;
        stopTimer();
        const duration = Math.max(1, questionLimit - Math.max(0, secondsRemaining));
        element("quizSubmitButton").disabled = true;
        element("quizAnswerMessage").textContent = "Checking your answer…";
        document.querySelectorAll('input[name="quizOption"]').forEach(function (input) { input.disabled = true; });
        try {
            const evaluation = await evaluate(question, selected, duration);
            const result = { question_id: question.id, questionId: question.id, topic: currentTopic, is_correct: Boolean(evaluation.is_correct), attempted_at: new Date().toISOString(), duration_seconds: duration, wasUnseen: !history.some(function (attempt) { return String(attempt.question_id || attempt.questionId) === String(question.id); }) };
            results.push(result);
            writeHistory(result);
            element("quizAnswerMessage").textContent = "";
            element("quizAnswerForm").hidden = true;
            renderFeedback(question, selected, evaluation, timedOut);
        } catch (error) {
            submitted = false;
            element("quizSubmitButton").disabled = false;
            document.querySelectorAll('input[name="quizOption"]').forEach(function (input) { input.disabled = false; });
            element("quizAnswerMessage").textContent = "The answer could not be checked. Please submit again; your question remains open.";
        }
    }

    function nextQuestion() { currentIndex += 1; renderQuestion(); }

    function formatDuration(seconds) { const minutes = Math.floor(seconds / 60); return String(minutes).padStart(2, "0") + ":" + String(seconds % 60).padStart(2, "0"); }

    function renderSummary() {
        stopTimer();
        const correct = results.filter(function (result) { return result.is_correct; }).length;
        const total = results.length;
        const accuracy = total ? Math.round(correct / total * 100) : 0;
        const duration = results.reduce(function (sum, result) { return sum + result.duration_seconds; }, 0);
        const unseen = results.filter(function (result) { return result.wasUnseen; }).length;
        element("quizQuestionCard").hidden = true;
        element("quizSummary").hidden = false;
        element("quizSummaryScore").textContent = correct + "/" + total;
        element("quizSummaryAccuracy").textContent = accuracy + "%";
        element("quizSummaryTime").textContent = formatDuration(duration);
        element("quizSummaryUnseen").textContent = String(unseen);
        element("quizSummaryMessage").textContent = "You answered " + correct + " of " + total + " questions correctly.";
        if (accuracy < 50) {
            element("quizSummaryNextTitle").textContent = "Review before increasing difficulty";
            element("quizSummaryNextText").textContent = "Restate the correction rules from incorrect questions, then take another short quiz at the same level.";
        } else if (accuracy < 80) {
            element("quizSummaryNextTitle").textContent = "Correct the remaining weak concepts";
            element("quizSummaryNextText").textContent = "Repeat only the missed concepts before attempting a longer assessment.";
        } else {
            element("quizSummaryNextTitle").textContent = "Move one level higher";
            element("quizSummaryNextText").textContent = "Your accuracy is strong. Increase difficulty while keeping the same careful reasoning.";
        }
        updateHeadingStats(null);
        element("quizSummary").setAttribute("tabindex", "-1");
        element("quizSummary").focus({ preventScroll: true });
    }

    function initializeDrawer() {
        const toggle = element("placementSidebarToggle"); const sidebar = element("placementSidebar"); const backdrop = element("placementDrawerBackdrop");
        function setOpen(open) { sidebar.classList.toggle("is-open", open); backdrop.classList.toggle("is-open", open); document.body.classList.toggle("placement-drawer-open", open); toggle.setAttribute("aria-expanded", String(open)); toggle.textContent = open ? "✕ Close Quiz Topics" : "☰ Quiz Topics"; backdrop.tabIndex = open ? 0 : -1; }
        toggle.addEventListener("click", function () { setOpen(!sidebar.classList.contains("is-open")); }); backdrop.addEventListener("click", function () { setOpen(false); toggle.focus(); }); sidebar.addEventListener("click", function (event) { if (event.target.closest("a")) { setOpen(false); } });
        document.addEventListener("keydown", function (event) { if (event.key === "Escape" && sidebar.classList.contains("is-open")) { setOpen(false); toggle.focus(); } }); window.addEventListener("resize", function () { if (window.innerWidth > MOBILE_BREAKPOINT) { setOpen(false); } });
    }

    function initialize() {
        currentTopic = resolveTopic();
        currentUser = window.CodeBhavyaAuth && window.CodeBhavyaAuth.getUser ? window.CodeBhavyaAuth.getUser() : null;
        const plan = readJson(PLAN_KEY, {});
        if (plan && targetLabels[plan.target]) { element("quizTarget").value = plan.target; }
        const requestedTarget = String(new URLSearchParams(window.location.search).get("target") || "").toLowerCase();
        if (targetLabels[requestedTarget]) { element("quizTarget").value = requestedTarget; }
        applyTopic();
        initializeDrawer();
        loadHistory().then(function () { updateHeadingStats(null); });
        window.addEventListener("codebhavya:auth-changed", function (event) { currentUser = event.detail && event.detail.user ? event.detail.user : null; loadHistory().then(function () { updateHeadingStats(null); }); });
        element("quizSetupForm").addEventListener("submit", startQuiz);
        element("quizAnswerForm").addEventListener("submit", function (event) { event.preventDefault(); submitCurrentAnswer(false); });
        element("quizNextButton").addEventListener("click", nextQuestion);
        element("quizNewSession").addEventListener("click", startQuiz);
    }

    if (document.readyState === "loading") { document.addEventListener("DOMContentLoaded", initialize); } else { initialize(); }
}());
