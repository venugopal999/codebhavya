(function () {
    "use strict";

    const cloud = window.CodeBhavyaSupabase || {};
    const client = cloud.client || null;
    const $ = (id) => document.getElementById(id);
    const PAGE_SIZE = 10;
    const BOOKMARK_KEY = "codebhavya-mcq-revision-bookmarks-v1";
    const MASTERED_KEY = "codebhavya-mcq-revision-mastered-v1";
    const groupLabels = {
        all: "All C topics", fundamentals: "Fundamentals & Input/Output",
        "control-functions": "Control Flow & Functions", "arrays-strings": "Arrays & Strings",
        "pointers-memory": "Pointers & Memory", "structures-files": "Structures & Files",
        "debugging-tools": "Debugging, Complexity & Tools", "data-numerics": "Data & Numerical Computing"
    };
    let page = 0;
    let total = 0;
    let questions = [];
    let readingMode = "self-check";
    let bookmarks = readSet(BOOKMARK_KEY);
    let mastered = readSet(MASTERED_KEY);
    const revealed = new Set();
    const selections = new Map();

    function readSet(key) {
        try { return new Set(JSON.parse(localStorage.getItem(key) || "[]")); }
        catch (_error) { return new Set(); }
    }

    function writeSet(key, values) {
        try { localStorage.setItem(key, JSON.stringify([...values])); }
        catch (_error) { /* Material remains usable without local persistence. */ }
    }

    function optionsOf(value) {
        if (Array.isArray(value)) return value.map((item, index) => ({ key: item.key || String.fromCharCode(65 + index), text: item.text || String(item) }));
        return Object.keys(value || {}).sort().map((key) => ({ key, text: String(value[key]) }));
    }

    function filters() {
        return {
            group: $("revisionTopicGroup").value,
            difficulty: $("revisionDifficulty").value,
            search: $("revisionSearch").value.trim()
        };
    }

    function makeButton(text, label, active) {
        const button = document.createElement("button");
        button.type = "button";
        button.textContent = text;
        button.setAttribute("aria-label", label);
        button.classList.toggle("is-active", active);
        return button;
    }

    function createAnswer(question) {
        const answer = document.createElement("section");
        answer.className = "revision-answer";
        const heading = document.createElement("strong");
        heading.textContent = `Correct answer: ${question.correct_option}`;
        const explanation = document.createElement("p");
        explanation.textContent = question.explanation;
        const reasons = document.createElement("div");
        reasons.className = "option-reasons";
        optionsOf(question.options).forEach((option) => {
            const line = document.createElement("p");
            line.classList.toggle("correct-reason", option.key === question.correct_option);
            line.textContent = `${option.key}. ${question.option_explanations?.[option.key] || (option.key === question.correct_option ? "This is the correct choice." : "Review the governing rule.")}`;
            reasons.append(line);
        });
        const rule = document.createElement("p");
        rule.className = "revision-rule";
        rule.textContent = "Remember: " + question.correction_rule;
        answer.append(heading, explanation, reasons, rule);
        return answer;
    }

    function render() {
        const grid = $("revisionGrid");
        grid.replaceChildren();
        questions.forEach((question, index) => {
            const id = String(question.id);
            const showAnswer = readingMode === "fast" || revealed.has(id);
            const selected = selections.get(id);
            const card = document.createElement("article");
            card.className = "revision-card";
            card.classList.toggle("is-mastered", mastered.has(id));

            const head = document.createElement("header");
            head.className = "revision-card-head";
            const meta = document.createElement("div");
            meta.className = "revision-card-meta";
            [question.subtopic, question.difficulty].forEach((text) => {
                const tag = document.createElement("span"); tag.textContent = text; meta.append(tag);
            });
            const actions = document.createElement("div");
            actions.className = "revision-card-actions";
            const bookmark = makeButton(bookmarks.has(id) ? "★ Bookmarked" : "☆ Bookmark", `Bookmark question ${page * PAGE_SIZE + index + 1}`, bookmarks.has(id));
            bookmark.addEventListener("click", () => {
                if (bookmarks.has(id)) bookmarks.delete(id); else bookmarks.add(id);
                writeSet(BOOKMARK_KEY, bookmarks); render();
            });
            const master = makeButton(mastered.has(id) ? "✓ Mastered" : "Mark mastered", `Mark question ${page * PAGE_SIZE + index + 1} as mastered`, mastered.has(id));
            master.addEventListener("click", () => {
                if (mastered.has(id)) mastered.delete(id); else mastered.add(id);
                writeSet(MASTERED_KEY, mastered); render();
            });
            actions.append(bookmark, master);
            head.append(meta, actions);

            const title = document.createElement("h3");
            title.textContent = `${page * PAGE_SIZE + index + 1}. ${question.question_text}`;
            const optionBox = document.createElement("div");
            optionBox.className = "revision-options";
            optionsOf(question.options).forEach((option) => {
                const button = document.createElement("button");
                button.type = "button";
                button.className = "revision-option";
                button.disabled = showAnswer;
                if (showAnswer && option.key === question.correct_option) button.classList.add("is-correct");
                if (showAnswer && selected === option.key && option.key !== question.correct_option) button.classList.add("is-chosen-wrong");
                const key = document.createElement("b"); key.textContent = option.key;
                const text = document.createElement("span"); text.textContent = option.text;
                button.append(key, text);
                button.addEventListener("click", () => { selections.set(id, option.key); revealed.add(id); render(); });
                optionBox.append(button);
            });
            card.append(head, title, optionBox);
            if (!showAnswer) {
                const reveal = document.createElement("button");
                reveal.type = "button"; reveal.className = "revision-reveal"; reveal.textContent = "Show answer & explanation";
                reveal.addEventListener("click", () => { revealed.add(id); render(); });
                card.append(reveal);
            } else card.append(createAnswer(question));
            grid.append(card);
        });

        grid.hidden = questions.length === 0;
        $("revisionEmpty").hidden = questions.length > 0;
        const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
        $("revisionPagination").hidden = total <= PAGE_SIZE;
        $("revisionPageStatus").textContent = `Page ${page + 1} of ${pages} · ${total} questions`;
        $("revisionPrevious").disabled = page === 0;
        $("revisionNext").disabled = page + 1 >= pages;
    }

    async function loadRevision(event) {
        if (event) event.preventDefault();
        if (!client) {
            $("revisionError").textContent = "Database connection is unavailable. Confirm the existing Supabase configuration.";
            return;
        }
        const values = filters();
        $("revisionError").textContent = "";
        $("revisionEmpty").hidden = true;
        $("revisionGrid").hidden = true;
        $("revisionLoading").hidden = false;
        $("loadRevision").disabled = true;
        $("topicQuizLink").href = `quiz.html?topic=c&mode=topic&group=${encodeURIComponent(values.group === "all" ? "fundamentals" : values.group)}`;
        try {
            const result = await client.rpc("get_mcq_revision_page", {
                p_topic: "c", p_topic_group: values.group, p_difficulty: values.difficulty,
                p_search: values.search, p_limit: PAGE_SIZE, p_offset: page * PAGE_SIZE
            });
            if (result.error) throw result.error;
            total = Number(result.data?.total) || 0;
            questions = result.data?.questions || [];
            $("revisionTitle").textContent = groupLabels[values.group] || "C revision material";
            $("revisionSummary").textContent = total
                ? `${total} explained questions match this reading set. Showing ${page * PAGE_SIZE + 1}–${Math.min((page + 1) * PAGE_SIZE, total)}.`
                : "No published questions match these filters.";
            render();
        } catch (error) {
            total = 0; questions = []; render();
            const message = String(error?.message || "");
            $("revisionError").textContent = /get_mcq_revision_page|function.*does not exist/i.test(message)
                ? "Run the latest placement-v2-schema.sql once to enable the Revision Library."
                : "Revision material could not load: " + (message || "Unknown database error");
        } finally {
            $("revisionLoading").hidden = true;
            $("loadRevision").disabled = false;
        }
    }

    function setReadingMode(mode) {
        readingMode = mode === "fast" ? "fast" : "self-check";
        document.querySelectorAll("[data-reading-mode]").forEach((button) => button.setAttribute("aria-selected", String(button.dataset.readingMode === readingMode)));
        render();
    }

    function initialize() {
        const parameters = new URLSearchParams(location.search);
        const requestedGroup = parameters.get("group");
        if ([...$("revisionTopicGroup").options].some((option) => option.value === requestedGroup)) $("revisionTopicGroup").value = requestedGroup;
        $("revisionFilterForm").addEventListener("submit", (event) => { page = 0; loadRevision(event); });
        [$("revisionTopicGroup"), $("revisionDifficulty")].forEach((control) => control.addEventListener("change", () => { page = 0; }));
        document.querySelectorAll("[data-reading-mode]").forEach((button) => button.addEventListener("click", () => setReadingMode(button.dataset.readingMode)));
        $("revisionPrevious").addEventListener("click", () => { if (page > 0) { page -= 1; loadRevision(); } });
        $("revisionNext").addEventListener("click", () => { if ((page + 1) * PAGE_SIZE < total) { page += 1; loadRevision(); } });
    }

    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initialize); else initialize();
}());
