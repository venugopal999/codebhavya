(function () {
    "use strict";

    const cloud = window.CodeBhavyaSupabase || {};
    const client = cloud.client || null;
    const $ = (id) => document.getElementById(id);
    const PAGE_SIZE = 10;
    const ATTEMPT_KEY = "codebhavya-interview-attempts-v1";
    const DRAFT_KEY = "codebhavya-interview-drafts-v1";
    const categories = {
        technical: {
            label: "Technical Interview",
            help: "Explain concepts, compare alternatives and justify technical decisions.",
            groups: { all: "All technical topics", "systems-foundations": "Systems, Networks & Databases", "design-engineering": "OOP, APIs & Engineering Design" }
        },
        coding: {
            label: "Coding Explanation",
            help: "Turn a solution into a clear explanation of approach, correctness, complexity and edge cases.",
            groups: { all: "All coding explanation topics", "solution-reasoning": "Solution Reasoning & Complexity", "debugging-testing": "Debugging, Testing & Optimisation" }
        },
        "resume-projects": {
            label: "Resume & Project Defence",
            help: "Defend every claim with ownership, design decisions, results, limitations and learning.",
            groups: { all: "All resume and project topics", "resume-evidence": "Resume Claims & Evidence", "project-defence": "Project Decisions & Defence" }
        },
        communication: {
            label: "Technical Communication",
            help: "Clarify ambiguous problems, explain trade-offs and respond professionally under uncertainty.",
            groups: { all: "All communication topics", "clarity-tradeoffs": "Clarity, Questions & Trade-offs", "uncertainty-collaboration": "Uncertainty, Feedback & Collaboration" }
        },
        hr: {
            label: "HR & Behavioural",
            help: "Use specific evidence for motivation, teamwork, ownership, conflict, failure and growth.",
            groups: { all: "All HR topics", "motivation-fit": "Motivation, Strengths & Role Fit", "behavioural-ownership": "Behavioural Evidence & Ownership" }
        }
    };

    let page = 0;
    let total = 0;
    let prompts = [];
    let activeIndex = -1;
    let activePrompt = null;
    let assisted = false;
    let reviewComplete = false;
    let evidenceScore = null;
    let timerTotal = 0;
    let timerRemaining = 0;
    let timerInterval = null;
    let timerStarted = false;
    let attempts = readJson(ATTEMPT_KEY, []);
    let drafts = readJson(DRAFT_KEY, {});

    function readJson(key, fallback) {
        try {
            const parsed = JSON.parse(localStorage.getItem(key) || "null");
            return parsed === null ? fallback : parsed;
        } catch (_error) {
            return fallback;
        }
    }

    function writeJson(key, value) {
        try { localStorage.setItem(key, JSON.stringify(value)); }
        catch (_error) { /* The coach remains usable without device persistence. */ }
    }

    function listOf(value) {
        return Array.isArray(value) ? value : [];
    }

    function formatLabel(value) {
        return String(value || "").replace(/-/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
    }

    function currentCategory() {
        return categories[$("interviewCategory").value] || categories.technical;
    }

    function updateCategory() {
        const config = currentCategory();
        $("categoryHelp").textContent = config.help;
        const select = $("interviewGroup");
        const requested = select.value;
        select.replaceChildren();
        Object.entries(config.groups).forEach(([value, label]) => {
            const option = document.createElement("option");
            option.value = value;
            option.textContent = label;
            select.append(option);
        });
        if ([...select.options].some((option) => option.value === requested)) select.value = requested;
        page = 0;
        clearPromptResults("Filters changed. Select Load interview prompts to view the new set.");
    }

    function clearPromptResults(message) {
        prompts = [];
        total = 0;
        $("promptGrid").replaceChildren();
        $("promptGrid").hidden = true;
        $("promptPagination").hidden = true;
        $("promptEmpty").hidden = false;
        $("promptResultsTitle").textContent = "Choose filters to begin";
        $("promptResultsSummary").textContent = message || "Prompts load only when you request them.";
        $("promptError").textContent = "";
    }

    function filterValues() {
        return {
            category: $("interviewCategory").value,
            group: $("interviewGroup").value,
            difficulty: $("interviewDifficulty").value,
            target: $("interviewTarget").value,
            search: $("interviewSearch").value.trim()
        };
    }

    function completedQuestionIds() {
        return new Set(attempts.map((attempt) => String(attempt.questionId)));
    }

    function renderPromptCards() {
        const grid = $("promptGrid");
        const completed = completedQuestionIds();
        grid.replaceChildren();
        prompts.forEach((prompt, index) => {
            const card = document.createElement("article");
            card.className = "prompt-card";
            card.classList.toggle("is-complete", completed.has(String(prompt.id)));

            const meta = document.createElement("div");
            meta.className = "prompt-card-meta";
            [prompt.difficulty, prompt.target_path === "ai" ? "AI / Data" : formatLabel(prompt.target_path)].forEach((label) => {
                const tag = document.createElement("span");
                tag.textContent = label;
                meta.append(tag);
            });
            const title = document.createElement("h3");
            title.textContent = prompt.question_text;
            const detail = document.createElement("p");
            detail.textContent = `${formatLabel(prompt.topic_group)} · ${Number(prompt.recommended_seconds) || 60}-second response`;
            const button = document.createElement("button");
            button.type = "button";
            button.textContent = completed.has(String(prompt.id)) ? "Practise again" : "Open guided practice";
            button.addEventListener("click", () => openPrompt(index));
            card.append(meta, title, detail, button);
            grid.append(card);
        });

        grid.hidden = prompts.length === 0;
        $("promptEmpty").hidden = prompts.length > 0;
        const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
        $("promptPagination").hidden = total <= PAGE_SIZE;
        $("promptPageStatus").textContent = `Page ${page + 1} of ${pages} · ${total} matching prompts`;
        $("promptPrevious").disabled = page === 0;
        $("promptNext").disabled = (page + 1) * PAGE_SIZE >= total;
    }

    async function loadPrompts(event) {
        if (event) event.preventDefault();
        if (!client) {
            $("promptError").textContent = "Database connection is unavailable. Confirm the existing Supabase configuration.";
            return;
        }
        const values = filterValues();
        $("promptError").textContent = "";
        $("promptEmpty").hidden = true;
        $("promptGrid").hidden = true;
        $("promptPagination").hidden = true;
        $("promptLoading").hidden = false;
        $("loadPrompts").disabled = true;
        try {
            const result = await client.rpc("get_interview_question_page", {
                p_category: values.category,
                p_topic_group: values.group,
                p_difficulty: values.difficulty,
                p_target: values.target,
                p_search: values.search,
                p_limit: PAGE_SIZE,
                p_offset: page * PAGE_SIZE
            });
            if (result.error) throw result.error;
            total = Number(result.data?.total) || 0;
            prompts = listOf(result.data?.questions);
            $("promptResultsTitle").textContent = currentCategory().groups[values.group] || currentCategory().label;
            $("promptResultsSummary").textContent = total
                ? `${total} prompts match this focused library. Choose any question; practice does not start automatically.`
                : "No published interview prompts match these filters.";
            renderPromptCards();
        } catch (error) {
            prompts = [];
            total = 0;
            renderPromptCards();
            const message = String(error?.message || "");
            $("promptError").textContent = /get_interview_question_page|function.*does not exist/i.test(message)
                ? "Run interview-coach-schema-v21.sql first, then interview-coach-question-seed-v21.sql in Supabase."
                : "Interview prompts could not load: " + (message || "Unknown database error");
        } finally {
            $("promptLoading").hidden = true;
            $("loadPrompts").disabled = false;
        }
    }

    function stopTimer(reason) {
        if (timerInterval) clearInterval(timerInterval);
        timerInterval = null;
        if (reason === "guidance") {
            $("timerButton").textContent = "Stopped for guidance";
            $("timerButton").disabled = true;
            $("timerHint").textContent = "The timer stopped when guidance was revealed. It will not continue in the background.";
        } else if (reason === "review") {
            $("timerButton").textContent = "Answer submitted for review";
            $("timerButton").disabled = true;
            $("timerHint").textContent = "Thinking time ended when you started the evidence review.";
        } else if (timerRemaining <= 0) {
            $("timerButton").textContent = "Time complete";
            $("timerButton").disabled = true;
            $("timerHint").textContent = "Finish your current sentence, then review the answer.";
        }
    }

    function renderTimer() {
        if (!timerStarted) {
            $("timerDisplay").textContent = "Not started";
            return;
        }
        const minutes = Math.floor(timerRemaining / 60);
        const seconds = timerRemaining % 60;
        $("timerDisplay").textContent = `${minutes}:${String(seconds).padStart(2, "0")}`;
    }

    function startTimer() {
        if (timerStarted || assisted || reviewComplete) return;
        timerStarted = true;
        $("timerButton").textContent = "Thinking…";
        $("timerButton").disabled = true;
        $("timerHint").textContent = "Build your answer. The timer stops before any guidance is shown.";
        renderTimer();
        timerInterval = setInterval(() => {
            timerRemaining = Math.max(0, timerRemaining - 1);
            renderTimer();
            if (timerRemaining === 0) stopTimer("complete");
        }, 1000);
    }

    function renderFramework() {
        $("frameworkTitle").textContent = activePrompt.framework_title || "Structure your answer";
        const steps = $("frameworkSteps");
        steps.replaceChildren();
        listOf(activePrompt.framework_steps).forEach((text) => {
            const item = document.createElement("li");
            item.textContent = text;
            steps.append(item);
        });
        $("commonMistake").textContent = activePrompt.common_mistake || "Giving a generic answer without evidence or a clear decision.";
        $("frameworkPanel").hidden = false;
    }

    function revealFramework() {
        if (!activePrompt) return;
        assisted = true;
        stopTimer("guidance");
        renderFramework();
        $("revealFramework").disabled = true;
        $("revealFramework").textContent = "Framework revealed";
        $("answerActionNote").textContent = "This attempt is now assisted. Continue learning—the assistance label only keeps your progress honest.";
    }

    function renderRubric() {
        const list = $("rubricList");
        list.replaceChildren();
        listOf(activePrompt.rubric).forEach((text, index) => {
            const label = document.createElement("label");
            label.className = "rubric-item";
            const input = document.createElement("input");
            input.type = "checkbox";
            input.value = String(index);
            const span = document.createElement("span");
            span.textContent = text;
            label.append(input, span);
            list.append(label);
        });
    }

    function beginReview() {
        if (!activePrompt || reviewComplete) return;
        stopTimer("review");
        $("coachWelcome").hidden = true;
        $("reviewPanel").hidden = false;
        renderRubric();
        $("reviewPanel").scrollIntoView({ behavior: "smooth", block: "nearest" });
    }

    function calculateReview() {
        const checks = [...$("rubricList").querySelectorAll("input")];
        evidenceScore = checks.filter((input) => input.checked).length;
        const rubric = listOf(activePrompt.rubric);
        const missing = rubric.filter((_text, index) => !checks[index]?.checked);
        $("reviewWarning").textContent = "";
        $("reviewPanel").hidden = true;
        $("reviewResult").hidden = false;
        $("reviewScore").textContent = `${evidenceScore}/5`;

        if (evidenceScore <= 2) {
            $("reviewBand").textContent = "NEEDS A FULL REVIEW";
            $("reviewTitle").textContent = "Strengthen the answer before moving on.";
            $("reviewMessage").textContent = "The answer is missing important evidence. The next prompt stays locked until you rewrite the weakest part and practise it again.";
        } else if (evidenceScore <= 4) {
            $("reviewBand").textContent = "TARGETED IMPROVEMENT";
            $("reviewTitle").textContent = "Good foundation—repair the missing evidence.";
            $("reviewMessage").textContent = "Your answer has a useful structure, but the unchecked evidence could become the evaluator's next concern. Improve it before continuing.";
        } else {
            $("reviewBand").textContent = "SELF-REVIEW COMPLETE";
            $("reviewTitle").textContent = "You marked all five checks as covered.";
            $("reviewMessage").textContent = "Compare your answer with the model points and attempt the question-specific follow-up. This checklist records your judgement; it does not independently verify correctness or predict interview success.";
        }

        const missingList = $("missingEvidence");
        missingList.replaceChildren();
        (missing.length ? missing : ["No required evidence is missing. Use the follow-ups to deepen the answer."]).forEach((text) => {
            const item = document.createElement("li");
            item.textContent = text;
            missingList.append(item);
        });

        const remediation = listOf(activePrompt.remediation_steps);
        const remediationList = $("remediationSteps");
        remediationList.replaceChildren();
        remediation.forEach((text) => {
            const item = document.createElement("li");
            item.textContent = text;
            remediationList.append(item);
        });
        $("remediationBox").hidden = evidenceScore === 5;
        renderFollowups();
        $("followupPanel").hidden = false;
        $("reviewResult").scrollIntoView({ behavior: "smooth", block: "start" });
    }

    function showModelAnswer() {
        $("modelAnswer").textContent = activePrompt.model_answer || "Compare your answer against the framework and the five evidence criteria.";
        $("modelPanel").hidden = false;
        $("showModelAnswer").disabled = true;
        $("showModelAnswer").textContent = "Model points shown";
    }

    function renderFollowups() {
        const list = $("followupList");
        list.replaceChildren();
        listOf(activePrompt.follow_ups).forEach((followup, index) => {
            const box = document.createElement("article");
            box.className = "followup-item";
            const title = document.createElement("strong");
            title.textContent = `${index + 1}. ${followup.question}`;
            const button = document.createElement("button");
            button.type = "button";
            button.textContent = "Show answer guidance";
            const guidance = document.createElement("p");
            guidance.className = "followup-guidance";
            guidance.textContent = followup.guidance;
            guidance.hidden = true;
            button.addEventListener("click", () => {
                guidance.hidden = !guidance.hidden;
                button.textContent = guidance.hidden ? "Show answer guidance" : "Hide answer guidance";
            });
            box.append(title, button, guidance);
            list.append(box);
        });
    }

    function elapsedSeconds() {
        return timerStarted ? Math.max(0, timerTotal - timerRemaining) : 0;
    }

    async function syncAttempt(attempt) {
        if (!client) return;
        try {
            await client.rpc("record_interview_attempt", {
                p_question_id: activePrompt.id,
                p_evidence_count: attempt.score,
                p_assisted: attempt.assisted,
                p_duration_seconds: attempt.duration,
                p_revised: attempt.revised
            });
        } catch (_error) { /* Device history is the dependable fallback. */ }
    }

    function completeReview() {
        if (evidenceScore === null) return;
        const revisedText = $("improvedDraft").value.trim();
        const revised = $("retryComplete").checked;
        if (evidenceScore < 5 && (revisedText.length < 25 || !revised)) {
            $("completionWarning").textContent = "Complete the correction: write at least one improved point and confirm that you practised the answer again.";
            return;
        }
        $("completionWarning").textContent = "";
        reviewComplete = true;
        const attempt = {
            questionId: String(activePrompt.id),
            category: activePrompt.category,
            group: activePrompt.topic_group,
            score: evidenceScore,
            assisted,
            revised: evidenceScore < 5 && revised,
            duration: elapsedSeconds(),
            completedAt: new Date().toISOString()
        };
        attempts.push(attempt);
        writeJson(ATTEMPT_KEY, attempts);
        syncAttempt(attempt);
        renderProgress();
        $("completeReview").disabled = true;
        $("completeReview").textContent = "Review completed ✓";
        $("reviewMessage").textContent = evidenceScore < 5
            ? "Correction completed. Your improved answer is now part of this practice record."
            : "Review completed. You can now move to the next prompt in this loaded set.";
        $("nextPrompt").disabled = activeIndex >= prompts.length - 1;
        if (activeIndex >= prompts.length - 1) $("nextPrompt").textContent = "End of loaded set";
    }

    function resetCoachPanels() {
        assisted = false;
        reviewComplete = false;
        evidenceScore = null;
        stopTimer();
        timerStarted = false;
        timerTotal = Number(activePrompt?.recommended_seconds) || 60;
        timerRemaining = timerTotal;
        renderTimer();
        $("timerButton").disabled = false;
        $("timerButton").textContent = "Start thinking";
        $("timerHint").textContent = "Start it when you are ready. Revealing guidance pauses it.";
        $("coachWelcome").hidden = false;
        ["frameworkPanel", "reviewPanel", "reviewResult", "modelPanel", "followupPanel"].forEach((id) => { $(id).hidden = true; });
        $("revealFramework").disabled = false;
        $("revealFramework").textContent = "Reveal answer framework";
        $("reviewAnswer").disabled = false;
        $("calculateReview").disabled = false;
        $("showModelAnswer").disabled = false;
        $("showModelAnswer").textContent = "Show model answer points";
        $("completeReview").disabled = false;
        $("completeReview").textContent = "Complete this review";
        $("improvedDraft").value = "";
        $("retryComplete").checked = false;
        $("reviewWarning").textContent = "";
        $("completionWarning").textContent = "";
        $("answerActionNote").textContent = "The framework is optional. Using it marks this attempt as assisted, but it never blocks learning.";
    }

    function renderActivePrompt() {
        if (!activePrompt) return;
        const meta = $("activePromptMeta");
        meta.replaceChildren();
        [categories[activePrompt.category]?.label || formatLabel(activePrompt.category), formatLabel(activePrompt.topic_group), activePrompt.difficulty, `${Number(activePrompt.recommended_seconds) || 60} seconds`].forEach((label) => {
            const span = document.createElement("span");
            span.textContent = label;
            meta.append(span);
        });
        $("activeQuestion").textContent = activePrompt.question_text;
        $("activeContext").textContent = activePrompt.context_prompt || "Answer as if an interviewer asked this in a live placement round.";
        $("activeGoal").textContent = activePrompt.interviewer_goal || "Clear reasoning, relevant evidence and an honest conclusion.";
        $("workspacePosition").textContent = `Prompt ${activeIndex + 1} of ${prompts.length} in this loaded set`;
        $("answerDraft").value = drafts[String(activePrompt.id)] || "";
        updateDraftStatus();
        $("previousPrompt").disabled = activeIndex <= 0;
        $("nextPrompt").disabled = true;
        $("nextPrompt").textContent = activeIndex >= prompts.length - 1 ? "End of loaded set" : "Next →";
    }

    function openPrompt(index) {
        if (!prompts[index]) return;
        activeIndex = index;
        activePrompt = prompts[index];
        resetCoachPanels();
        renderActivePrompt();
        $("promptLibrary").hidden = true;
        $("practiceWorkspace").hidden = false;
        window.scrollTo({ top: $("practiceWorkspace").offsetTop - 90, behavior: "smooth" });
    }

    function returnToPrompts() {
        stopTimer();
        $("practiceWorkspace").hidden = true;
        $("promptLibrary").hidden = false;
        renderPromptCards();
        window.scrollTo({ top: $("promptLibrary").offsetTop - 90, behavior: "smooth" });
    }

    function updateDraftStatus() {
        if (!activePrompt) return;
        const value = $("answerDraft").value;
        $("draftCount").textContent = `${value.length} characters`;
        drafts[String(activePrompt.id)] = value;
        writeJson(DRAFT_KEY, drafts);
        $("draftStatus").textContent = "Saved on this device";
    }

    function renderProgress() {
        const latest = new Map();
        attempts.forEach((attempt) => latest.set(String(attempt.questionId), attempt));
        const records = [...latest.values()];
        $("metricPractised").textContent = String(records.length);
        $("metricIndependent").textContent = String(records.filter((attempt) => !attempt.assisted).length);
        $("metricImproved").textContent = String(records.filter((attempt) => attempt.revised).length);
        if (!records.length) {
            $("metricStrongest").textContent = "Start practising";
            $("metricStrongestDetail").textContent = "Evidence will appear here";
            return;
        }
        const byCategory = {};
        records.forEach((attempt) => {
            const key = attempt.category || "technical";
            byCategory[key] ||= { score: 0, count: 0 };
            byCategory[key].score += Number(attempt.score) || 0;
            byCategory[key].count += 1;
        });
        const strongest = Object.entries(byCategory).sort((a, b) => (b[1].score / b[1].count) - (a[1].score / a[1].count))[0];
        $("metricStrongest").textContent = categories[strongest[0]]?.label || formatLabel(strongest[0]);
        $("metricStrongestDetail").textContent = `${(strongest[1].score / strongest[1].count).toFixed(1)}/5 average evidence`;
    }

    function initialize() {
        const parameters = new URLSearchParams(location.search);
        const requestedCategory = parameters.get("category");
        if (categories[requestedCategory]) $("interviewCategory").value = requestedCategory;
        updateCategory();
        const requestedGroup = parameters.get("group");
        if ([...$("interviewGroup").options].some((option) => option.value === requestedGroup)) $("interviewGroup").value = requestedGroup;
        renderProgress();

        $("interviewCategory").addEventListener("change", updateCategory);
        ["interviewGroup", "interviewDifficulty", "interviewTarget"].forEach((id) => $(id).addEventListener("change", () => {
            page = 0;
            clearPromptResults("Filters changed. Select Load interview prompts to view the new set.");
        }));
        $("interviewSearch").addEventListener("input", () => { page = 0; });
        $("promptFilterForm").addEventListener("submit", (event) => { page = 0; loadPrompts(event); });
        $("promptPrevious").addEventListener("click", () => { if (page > 0) { page -= 1; loadPrompts(); } });
        $("promptNext").addEventListener("click", () => { if ((page + 1) * PAGE_SIZE < total) { page += 1; loadPrompts(); } });
        $("backToPrompts").addEventListener("click", returnToPrompts);
        $("previousPrompt").addEventListener("click", () => { if (activeIndex > 0) openPrompt(activeIndex - 1); });
        $("nextPrompt").addEventListener("click", () => { if (reviewComplete && activeIndex < prompts.length - 1) openPrompt(activeIndex + 1); });
        $("timerButton").addEventListener("click", startTimer);
        $("revealFramework").addEventListener("click", revealFramework);
        $("reviewAnswer").addEventListener("click", beginReview);
        $("calculateReview").addEventListener("click", calculateReview);
        $("showModelAnswer").addEventListener("click", showModelAnswer);
        $("completeReview").addEventListener("click", completeReview);
        $("answerDraft").addEventListener("input", updateDraftStatus);
        window.addEventListener("beforeunload", () => stopTimer());
    }

    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initialize); else initialize();
}());
