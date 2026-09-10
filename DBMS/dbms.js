(function () {
    "use strict";

    const STORAGE_KEY = "codebhavya.dbms.course.progress.v1";
    const TOTAL_LEVELS = 18;

    function readProgress() {
        try {
            const saved = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "[]");
            if (!Array.isArray(saved)) return [];
            return saved.map(Number).filter(function (level, index, values) {
                return Number.isInteger(level) && level >= 1 && level <= TOTAL_LEVELS && values.indexOf(level) === index;
            }).sort(function (a, b) { return a - b; });
        } catch (error) {
            return [];
        }
    }

    function saveProgress(progress) {
        try {
            window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
        } catch (error) {
            /* The checklist still works for this page visit. */
        }
    }

    function initializeProgress() {
        const count = document.getElementById("dbmsCompletedCount");
        const percentText = document.getElementById("dbmsProgressPercent");
        const track = document.getElementById("dbmsProgressTrack");
        const bar = document.getElementById("dbmsProgressBar");
        const resume = document.getElementById("dbmsResumeLink");
        const reset = document.getElementById("dbmsResetProgress");
        const buttons = Array.from(document.querySelectorAll("[data-complete-level]"));
        let completed = readProgress();

        function render() {
            const percent = Math.round(completed.length / TOTAL_LEVELS * 100);
            const next = Array.from({ length: TOTAL_LEVELS }, function (_, index) { return index + 1; })
                .find(function (level) { return completed.indexOf(level) === -1; });
            if (count) count.textContent = String(completed.length);
            if (percentText) percentText.textContent = percent + "% complete";
            if (bar) bar.style.width = percent + "%";
            if (track) track.setAttribute("aria-valuenow", String(percent));
            if (resume) {
                const lessonFiles = { 1: "level-01-database-foundations.html", 2: "level-02-architecture-data-models.html" };
                resume.href = next && lessonFiles[next] ? lessonFiles[next] : (next ? "#level-" + next : "#roadmap");
                resume.textContent = next ? "Continue Level " + next + " →" : "Review completed roadmap →";
            }
            buttons.forEach(function (button) {
                const level = Number(button.dataset.completeLevel);
                const isComplete = completed.indexOf(level) !== -1;
                button.classList.toggle("is-complete", isComplete);
                button.setAttribute("aria-pressed", String(isComplete));
                button.textContent = isComplete ? "✓ Checkpoint complete" : "Mark checkpoint complete";
                const sidebarLink = document.querySelector('.dbms-topic-link[data-level="' + level + '"]');
                if (sidebarLink) sidebarLink.classList.toggle("is-complete", isComplete);
            });
        }

        buttons.forEach(function (button) {
            button.addEventListener("click", function () {
                const level = Number(button.dataset.completeLevel);
                const index = completed.indexOf(level);
                if (index === -1) completed.push(level); else completed.splice(index, 1);
                completed.sort(function (a, b) { return a - b; });
                saveProgress(completed);
                render();
            });
        });

        if (reset) {
            reset.addEventListener("click", function () {
                if (completed.length && window.confirm("Reset all DBMS roadmap checkpoints saved in this browser?")) {
                    completed = [];
                    saveProgress(completed);
                    render();
                }
            });
        }
        render();
    }

    function initializeSearch() {
        const search = document.getElementById("dbmsTopicSearch");
        const empty = document.getElementById("dbmsSearchEmpty");
        const links = Array.from(document.querySelectorAll(".dbms-topic-link"));
        const cards = Array.from(document.querySelectorAll(".dbms-level-card"));
        if (!search) return;

        search.addEventListener("input", function () {
            const term = search.value.trim().toLowerCase();
            let matches = 0;
            links.forEach(function (link) {
                const card = document.getElementById("level-" + link.dataset.level);
                const haystack = ((link.textContent || "") + " " + (card ? card.dataset.topic || "" : "")).toLowerCase();
                const visible = !term || haystack.indexOf(term) !== -1;
                link.hidden = !visible;
                if (visible && term) matches += 1;
            });
            cards.forEach(function (card) {
                const haystack = ((card.textContent || "") + " " + (card.dataset.topic || "")).toLowerCase();
                card.hidden = !!term && haystack.indexOf(term) === -1;
            });
            if (empty) empty.hidden = !term || matches > 0;
            document.querySelectorAll(".dbms-sidebar-group").forEach(function (heading) {
                let next = heading.nextElementSibling;
                let hasVisible = false;
                while (next && !next.classList.contains("dbms-sidebar-group")) {
                    if (next.classList.contains("dbms-topic-link") && !next.hidden) hasVisible = true;
                    next = next.nextElementSibling;
                }
                if (heading.textContent.indexOf("Practice") === -1) heading.hidden = !!term && !hasVisible;
            });
        });
    }

    function initializeSidebar() {
        const toggle = document.getElementById("dbmsSidebarToggle");
        const sidebar = document.getElementById("dbmsSidebar");
        const backdrop = document.getElementById("dbmsSidebarBackdrop");
        if (!toggle || !sidebar || !backdrop) return;

        function setOpen(open) {
            sidebar.classList.toggle("is-open", open);
            backdrop.hidden = !open;
            toggle.setAttribute("aria-expanded", String(open));
            document.body.classList.toggle("dbms-drawer-open", open);
        }
        toggle.addEventListener("click", function () { setOpen(!sidebar.classList.contains("is-open")); });
        backdrop.addEventListener("click", function () { setOpen(false); });
        sidebar.addEventListener("click", function (event) { if (event.target.closest("a")) setOpen(false); });
        document.addEventListener("keydown", function (event) { if (event.key === "Escape") setOpen(false); });
    }

    function initializeAnchorHighlight() {
        const links = Array.from(document.querySelectorAll(".dbms-topic-link"));
        if (!("IntersectionObserver" in window) || !links.length) return;
        const observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                links.forEach(function (link) { link.classList.toggle("is-current", link.dataset.level === entry.target.dataset.level); });
            });
        }, { rootMargin: "-20% 0px -70% 0px", threshold: 0 });
        document.querySelectorAll(".dbms-level-card").forEach(function (card) { observer.observe(card); });
    }

    function initialize() {
        initializeProgress();
        initializeSearch();
        initializeSidebar();
        initializeAnchorHighlight();
    }

    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initialize, { once: true });
    else initialize();
})();
