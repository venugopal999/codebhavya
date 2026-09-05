(function () {
    "use strict";

    const cloud = window.CodeBhavyaSupabase || {};
    const client = cloud.client || null;
    const HISTORY_KEY = "codebhavya-placement-mcq-history-v2";
    const $ = (id) => document.getElementById(id);

    const topicLabels = {
        c: "C",
        python: "Python",
        dsa: "DSA",
        database: "Database",
        "core-cs": "Core CS",
        aptitude: "Aptitude",
        "ai-ml": "AI & ML"
    };

    const topicGroupCatalog = {
        c: {
            fundamentals: "Fundamentals & Input/Output",
            "control-functions": "Control Flow & Functions",
            "arrays-strings": "Arrays & Strings",
            "pointers-memory": "Pointers & Memory",
            "structures-files": "Structures & Files",
            "debugging-tools": "Debugging, Complexity & Tools",
            "data-numerics": "Data & Numerical Computing"
        },
        python: {
            "python-basics": "Python Basics & Data Model",
            "control-functions": "Control Flow & Functions",
            collections: "Collections & Complexity",
            strings: "Strings & Text Processing",
            oop: "Object-Oriented Python",
            "exceptions-files": "Exceptions, Files & Serialisation",
            "iterators-functional": "Iteration & Functional Tools",
            "data-ai": "Python for Data & AI"
        }
    };
    let topicGroupLabels = topicGroupCatalog.c;

    const targetLabels = {
        all: "All preparation tracks",
        general: "General Campus Placement",
        service: "Foundation & High-Volume Hiring",
        product: "Product Engineering & DSA",
        ai: "Data, AI & Analytics"
    };

    function modeContentFor(label) { return {
        topic: {
            help: `Choose one ${label} topic and strengthen it from fundamentals through advanced reasoning.`,
            eyebrow: "TOPIC MASTERY",
            title: `Build complete confidence in one ${label} topic.`,
            text: "Questions stay inside the topic you select, so every result identifies a meaningful strength or gap.",
            button: "Start Topic Quiz"
        },
        track: {
            help: "Follow a clear assessment pattern without needing to understand company classifications.",
            eyebrow: "PREPARATION TRACK",
            title: "Prepare for the kind of screening you expect.",
            text: `Each track brings together the ${label} skills commonly emphasised in that hiring pattern.`,
            button: "Start Track Quiz"
        },
        mock: {
            help: "Mix topics under time pressure to measure placement readiness after topic practice.",
            eyebrow: "MOCK ASSESSMENT",
            title: "Test recall, judgement and speed together.",
            text: `The mock draws from multiple ${label} topics and keeps all explanations hidden until submission.`,
            button: "Start Mock Assessment"
        }
    }; }

    let topic = "c";
    let topicLabel = "C";
    let modeContent = modeContentFor(topicLabel);
    let user = null;
    let availableIds = [];
    let session = null;
    let sessionFocus = "";
    let questions = [];
    let answers = {};
    let current = 0;
    let timeLeft = 0;
    let timer = null;
    let startedAt = 0;
    let submitting = false;

    function readHistory() {
        try {
            return JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");
        } catch (_error) {
            return [];
        }
    }

    function writeHistory(results) {
        const previous = readHistory();
        const rows = results.map((result) => ({
            question_id: result.question_id,
            topic,
            is_correct: result.is_correct,
            attempted_at: new Date().toISOString()
        }));
        try {
            localStorage.setItem(HISTORY_KEY, JSON.stringify(rows.concat(previous).slice(0, 2000)));
        } catch (_error) {
            // Quiz completion still works when browser storage is unavailable.
        }
    }

    function normalizeOptions(value) {
        if (Array.isArray(value)) {
            return value.map((option, index) => typeof option === "object"
                ? { key: String(option.key || String.fromCharCode(65 + index)), text: String(option.text || "") }
                : { key: String.fromCharCode(65 + index), text: String(option) });
        }
        return Object.keys(value || {}).sort().map((key) => ({ key, text: String(value[key]) }));
    }

    function setMessage(text) {
        $("setupMessage").textContent = text || "";
    }

    function setLoading(on) {
        $("examLoading").hidden = !on;
        $("examEmpty").hidden = on || Boolean(session);
        $("examActive").hidden = on || !session;
        $("startQuiz").disabled = on;
    }

    function params() {
        return {
            mode: $("quizMode").value,
            topicGroup: $("quizTopicGroup").value,
            target: $("quizTarget").value,
            difficulty: $("quizDifficulty").value,
            count: Number($("quizCount").value)
        };
    }

    function scopeLabel(values) {
        if (values.mode === "topic") return topicGroupLabels[values.topicGroup] || `Selected ${topicLabel} topic`;
        if (values.mode === "track") return targetLabels[values.target] || "Selected preparation track";
        return values.target === "all" ? `Complete ${topicLabel} Placement Mock` : (targetLabels[values.target] + " Mock");
    }

    function configureMode(mode) {
        const selectedMode = modeContent[mode] ? mode : "topic";
        $("quizMode").value = selectedMode;
        document.querySelectorAll("[data-quiz-mode]").forEach((button) => {
            button.setAttribute("aria-selected", String(button.dataset.quizMode === selectedMode));
        });

        const topicMode = selectedMode === "topic";
        $("topicFields").hidden = !topicMode;
        $("trackFields").hidden = topicMode;

        const allOption = $("allTracksOption");
        allOption.hidden = selectedMode !== "mock";
        allOption.disabled = selectedMode !== "mock";
        if (selectedMode === "track" && $("quizTarget").value === "all") $("quizTarget").value = "general";
        if (selectedMode === "mock") $("quizTarget").value = "all";

        const content = modeContent[selectedMode];
        $("modeHelp").textContent = content.help;
        $("emptyEyebrow").textContent = content.eyebrow;
        $("emptyTitle").textContent = content.title;
        $("emptyText").textContent = content.text;
        $("startQuiz").textContent = content.button;
    }

    async function refreshAvailability() {
        const values = params();
        setMessage("");
        $("quizAvailability").textContent = "Checking the selected question pool…";
        $("quizAvailability").dataset.state = "";
        if (!client) {
            $("quizAvailability").textContent = "Database connection is unavailable.";
            $("quizAvailability").dataset.state = "limited";
            $("startQuiz").disabled = true;
            return;
        }

        try {
            let query = client.from("mcq_questions")
                .select("id")
                .eq("is_published", true)
                .eq("topic", topic);
            if (values.mode === "topic") query = query.eq("topic_group", values.topicGroup);
            if (values.mode === "track") query = query.eq("target_path", values.target);
            if (values.mode === "mock" && values.target !== "all") query = query.eq("target_path", values.target);
            if (values.difficulty !== "all") query = query.eq("difficulty", values.difficulty);

            const result = await query.limit(1000);
            if (result.error) throw result.error;

            const mastered = new Set(readHistory()
                .filter((entry) => entry.topic === topic && entry.is_correct)
                .map((entry) => String(entry.question_id)));
            if (user) {
                const history = await client.from("mcq_attempts")
                    .select("question_id")
                    .eq("user_id", user.id)
                    .eq("topic", topic)
                    .eq("is_correct", true)
                    .limit(2000);
                if (!history.error) (history.data || []).forEach((entry) => mastered.add(String(entry.question_id)));
            }

            availableIds = (result.data || [])
                .map((entry) => String(entry.id))
                .filter((id) => !mastered.has(id));

            const count = availableIds.length;
            [...$("quizCount").options].forEach((option) => {
                option.disabled = Number(option.value) > count;
            });
            const selected = $("quizCount").selectedOptions[0];
            if (selected && selected.disabled) {
                const allowed = [...$("quizCount").options].filter((option) => !option.disabled).pop();
                if (allowed) $("quizCount").value = allowed.value;
            }

            const requested = Number($("quizCount").value);
            const focus = scopeLabel(values);
            if (count >= 5) {
                $("quizAvailability").textContent = `${count} not-yet-mastered questions are available in ${focus}. This session will use ${requested}.`;
                $("quizAvailability").dataset.state = "ready";
            } else {
                $("quizAvailability").textContent = `${count} not-yet-mastered questions remain in ${focus}. At least 5 are required for a new session.`;
                $("quizAvailability").dataset.state = "limited";
            }
            $("startQuiz").disabled = count < 5;
        } catch (error) {
            availableIds = [];
            const schemaMissing = /topic_group|column/i.test(String(error?.message || ""));
            $("quizAvailability").textContent = schemaMissing
                ? `Run the latest placement-v2-schema.sql and ${topicLabel} question seed to enable learning modes.`
                : "The question pool could not be checked. Refresh the page and try again.";
            $("quizAvailability").dataset.state = "limited";
            $("startQuiz").disabled = true;
        }
    }

    function renderPalette() {
        const box = $("questionPalette");
        box.replaceChildren();
        questions.forEach((question, index) => {
            const button = document.createElement("button");
            button.type = "button";
            button.textContent = String(index + 1);
            button.classList.toggle("is-current", index === current);
            button.classList.toggle("is-answered", Boolean(answers[question.id]));
            button.setAttribute("aria-label", `Question ${index + 1}${answers[question.id] ? ", answered" : ""}`);
            button.addEventListener("click", () => {
                current = index;
                renderQuestion();
            });
            box.append(button);
        });
    }

    function updateCounts() {
        const answered = questions.filter((question) => answers[question.id]).length;
        $("answeredCount").textContent = String(answered);
        $("unansweredCount").textContent = String(questions.length - answered);
    }

    function renderQuestion() {
        const question = questions[current];
        if (!question) return;
        $("examProgress").textContent = `QUESTION ${current + 1} OF ${questions.length}`;
        $("examProgressFill").style.width = `${((current + 1) / questions.length) * 100}%`;
        $("questionSubtopic").textContent = question.subtopic;
        $("questionDifficulty").textContent = question.difficulty;
        $("questionText").textContent = question.question_text;

        const box = $("questionOptions");
        box.replaceChildren();
        normalizeOptions(question.options).forEach((option) => {
            const label = document.createElement("label");
            label.className = "exam-option";
            const radio = document.createElement("input");
            radio.type = "radio";
            radio.name = "examAnswer";
            radio.value = option.key;
            radio.checked = answers[question.id] === option.key;
            const text = document.createElement("span");
            const key = document.createElement("b");
            key.textContent = option.key;
            text.append(key, document.createTextNode(option.text));
            label.append(radio, text);
            box.append(label);
        });

        $("savedIndicator").textContent = answers[question.id]
            ? "Answer saved. You can change it before submission."
            : "Select one answer. It will not be graded until submission.";
        $("savedIndicator").classList.toggle("is-saved", Boolean(answers[question.id]));
        $("previousQuestion").disabled = current === 0;
        $("nextQuestion").textContent = current === questions.length - 1 ? "Finish & Review" : "Save & Next →";
        renderPalette();
        updateCounts();
        $("questionText").setAttribute("tabindex", "-1");
        $("questionText").focus({ preventScroll: true });
    }

    function formatTime(seconds) {
        return String(Math.floor(seconds / 60)).padStart(2, "0") + ":" + String(seconds % 60).padStart(2, "0");
    }

    function updateTimer() {
        timeLeft = Math.max(0, timeLeft);
        $("examTimer").textContent = formatTime(timeLeft);
        $("examClock").classList.toggle("is-urgent", timeLeft <= 60);
        if (timeLeft === 0) {
            clearInterval(timer);
            timer = null;
            submitQuiz(true);
        }
    }

    function beginTimer() {
        clearInterval(timer);
        updateTimer();
        timer = setInterval(() => {
            timeLeft -= 1;
            updateTimer();
        }, 1000);
    }

    async function startQuiz(event) {
        event.preventDefault();
        if (!client) return;
        const values = params();
        if (availableIds.length < values.count) {
            setMessage(`This selection does not have ${values.count} not-yet-mastered questions. Refresh the availability or choose a smaller count.`);
            return;
        }

        setLoading(true);
        setMessage("");
        try {
            const excluded = readHistory()
                .filter((entry) => entry.topic === topic && entry.is_correct)
                .map((entry) => String(entry.question_id || ""))
                .filter((id) => /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id));
            const response = await client.rpc("start_mcq_session_v2", {
                p_topic: topic,
                p_mode: values.mode,
                p_topic_group: values.topicGroup,
                p_target: values.target,
                p_difficulty: values.difficulty,
                p_count: values.count,
                p_exclude_ids: excluded
            });
            if (response.error) throw response.error;

            session = response.data;
            sessionFocus = scopeLabel(values);
            questions = (session.questions || []).sort((a, b) => a.position - b.position);
            if (questions.length !== values.count) throw new Error("The server did not return the exact requested count.");
            answers = {};
            current = 0;
            timeLeft = Number(session.total_seconds) || values.count * 60;
            startedAt = Date.now();
            $("examResults").hidden = true;
            setLoading(false);
            renderQuestion();
            beginTimer();
        } catch (error) {
            session = null;
            setLoading(false);
            $("examEmpty").hidden = false;
            const schemaMissing = /start_mcq_session_v2|function.*does not exist/i.test(String(error?.message || ""));
            setMessage(schemaMissing
                ? "Run the latest placement-v2-schema.sql before starting the new learning modes."
                : (error.message || "The exact quiz could not be created."));
        }
    }

    function openSubmit() {
        const answered = questions.filter((question) => answers[question.id]).length;
        $("submitDialogText").textContent = `You answered ${answered} of ${questions.length} questions. ${answered < questions.length ? `${questions.length - answered} unanswered questions will be marked incorrect.` : "All questions are answered."}`;
        $("submitDialog").showModal();
    }

    function renderResults(data) {
        const total = Number(data.total) || questions.length;
        const score = Number(data.score) || 0;
        const percent = total ? Math.round((score / total) * 100) : 0;
        const used = Math.max(0, Math.round((Date.now() - startedAt) / 1000));
        $("resultBadge").textContent = percent + "%";
        $("resultScore").textContent = `${score}/${total}`;
        $("resultTime").textContent = formatTime(used);
        $("resultAnswered").textContent = String(Object.keys(answers).length);
        $("resultTarget").textContent = sessionFocus;
        $("resultsSummary").textContent = `You answered ${score} of ${total} questions correctly. Review every decision below.`;

        const review = $("resultReview");
        review.replaceChildren();
        (data.results || []).forEach((result, index) => {
            const card = document.createElement("article");
            card.className = "review-card" + (result.is_correct ? "" : " is-wrong");
            const heading = document.createElement("h3");
            heading.textContent = `${index + 1}. ${result.question_text}`;
            const state = document.createElement("p");
            const stateStrong = document.createElement("strong");
            stateStrong.textContent = result.is_correct ? "Correct" : "Needs review";
            state.append(stateStrong, document.createTextNode(` · Your answer: ${result.selected_option || "Not answered"} · Correct answer: ${result.correct_option}`));
            const explanation = document.createElement("p");
            explanation.textContent = result.explanation;
            const options = document.createElement("div");
            options.className = "review-options";
            normalizeOptions(result.options).forEach((option) => {
                const optionLine = document.createElement("p");
                if (option.key === result.correct_option) optionLine.classList.add("is-correct");
                if (!result.is_correct && option.key === result.selected_option) optionLine.classList.add("is-selected-wrong");
                optionLine.textContent = `${option.key}. ${option.text} — ${result.option_explanations?.[option.key] || ""}`;
                options.append(optionLine);
            });
            const rule = document.createElement("p");
            rule.className = "correction-rule";
            rule.textContent = "Correction rule: " + result.correction_rule;
            card.append(heading, state, explanation, options, rule);
            review.append(card);
        });

        $("examActive").hidden = true;
        $("examResults").hidden = false;
        $("examResults").scrollIntoView({ behavior: "smooth", block: "start" });
        writeHistory(data.results || []);
        refreshAvailability();
    }

    async function submitQuiz(timedOut) {
        if (submitting || !session) return;
        submitting = true;
        clearInterval(timer);
        timer = null;
        $("reviewSubmit").disabled = true;
        try {
            const response = await client.rpc("submit_mcq_session", {
                p_session_id: session.session_id,
                p_access_token: session.access_token,
                p_answers: answers
            });
            if (response.error) throw response.error;
            renderResults(response.data);
        } catch (error) {
            setMessage(error.message || "Submission failed. Your answers remain available; please try again.");
            $("reviewSubmit").disabled = false;
            if (!timedOut) beginTimer();
        } finally {
            submitting = false;
        }
    }

    async function initialize() {
        const parameters = new URLSearchParams(location.search);
        const requested = parameters.get("topic") || "c";
        topic = topicLabels[requested] ? requested : "c";
        topicLabel = topicLabels[topic];
        topicGroupLabels = topicGroupCatalog[topic] || topicGroupCatalog.c;
        modeContent = modeContentFor(topicLabel);
        const groupSelect = $("quizTopicGroup");
        groupSelect.replaceChildren();
        Object.entries(topicGroupLabels).forEach(([value, label]) => {
            const option = document.createElement("option");
            option.value = value;
            option.textContent = label;
            groupSelect.append(option);
        });
        $("builderTitle").textContent = topicLabel + " Placement Quiz";
        $("topicCrumb").textContent = topicLabel + " Quiz";
        $("quizTopicLabel").textContent = topicLabel + " topic";
        $("quizNavCurrent").textContent = topicLabel + " Quiz";
        $("quizNavCurrent").href = `quiz.html?topic=${encodeURIComponent(topic)}`;
        $("quizRevisionNav").href = `mcq-library.html?topic=${encodeURIComponent(topic)}`;
        $("resultRevisionLink").href = `mcq-library.html?topic=${encodeURIComponent(topic)}`;
        $("resultCodingLink").href = `coding.html?topic=${encodeURIComponent(topic)}`;
        $("resultCodingLink").textContent = `Open ${topicLabel} Problem Library →`;
        $("resultCodingLink").hidden = topic === "python";
        document.title = topicLabel + " Placement Quiz | CodeBhavya";

        if (client) {
            const auth = await client.auth.getUser();
            user = auth.data?.user || null;
            client.auth.onAuthStateChange((_event, value) => {
                user = value?.user || null;
                refreshAvailability();
            });
        }

        document.querySelectorAll("[data-quiz-mode]").forEach((button) => {
            button.addEventListener("click", () => {
                configureMode(button.dataset.quizMode);
                refreshAvailability();
            });
        });
        $("quizSetupForm").addEventListener("submit", startQuiz);
        $("quizTopicGroup").addEventListener("change", refreshAvailability);
        $("quizTarget").addEventListener("change", refreshAvailability);
        $("quizDifficulty").addEventListener("change", refreshAvailability);
        $("quizCount").addEventListener("change", refreshAvailability);
        $("openTrackGuide").addEventListener("click", () => $("trackGuideDialog").showModal());
        $("answerForm").addEventListener("change", (event) => {
            if (event.target.name !== "examAnswer") return;
            answers[questions[current].id] = event.target.value;
            renderQuestion();
        });
        $("clearAnswer").addEventListener("click", () => {
            delete answers[questions[current].id];
            renderQuestion();
        });
        $("previousQuestion").addEventListener("click", () => {
            if (current > 0) {
                current -= 1;
                renderQuestion();
            }
        });
        $("nextQuestion").addEventListener("click", () => {
            if (current < questions.length - 1) {
                current += 1;
                renderQuestion();
            } else {
                openSubmit();
            }
        });
        $("reviewSubmit").addEventListener("click", openSubmit);
        $("submitDialog").addEventListener("close", () => {
            if ($("submitDialog").returnValue === "confirm") submitQuiz(false);
        });
        $("newQuiz").addEventListener("click", () => {
            session = null;
            questions = [];
            answers = {};
            $("reviewSubmit").disabled = false;
            $("examResults").hidden = true;
            $("examEmpty").hidden = false;
            refreshAvailability();
            $("examBuilder").scrollIntoView({ behavior: "smooth" });
        });

        const requestedMode = ["topic", "track", "mock"].includes(parameters.get("mode")) ? parameters.get("mode") : "topic";
        const requestedGroup = parameters.get("group");
        const requestedTarget = parameters.get("track");
        const requestedCount = parameters.get("count");
        if ([...$("quizTopicGroup").options].some((option) => option.value === requestedGroup)) $("quizTopicGroup").value = requestedGroup;
        if ([...$("quizTarget").options].some((option) => option.value === requestedTarget)) $("quizTarget").value = requestedTarget;
        if ([...$("quizCount").options].some((option) => option.value === requestedCount)) $("quizCount").value = requestedCount;
        configureMode(requestedMode);
        refreshAvailability();
    }

    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initialize);
    else initialize();
}());
