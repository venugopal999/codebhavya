(function () {
    "use strict";

    const cloud = window.CodeBhavyaSupabase || {};
    const client = cloud.client || null;
    const HISTORY_KEY = "codebhavya-placement-mcq-history-v1";
    const READINESS_KEY = "codebhavya-placement-readiness-v1";
    const MOBILE_BREAKPOINT = 920;

    function element(id) {
        return document.getElementById(id);
    }

    function readJson(key, fallback) {
        try {
            const value = window.localStorage.getItem(key);
            return value ? JSON.parse(value) : fallback;
        } catch (error) {
            return fallback;
        }
    }

    function recommendedTopic() {
        const answers = readJson(READINESS_KEY, []);
        const topics = ["aptitude", "c", "c", "dsa", "core-cs", "database", "core-cs", "interview"];
        if (!Array.isArray(answers) || !answers.some(Boolean)) {
            return "aptitude";
        }

        let lowestIndex = 0;
        let lowestScore = 3;
        topics.forEach(function (topic, index) {
            const score = [answers[index * 2], answers[index * 2 + 1]].filter(Boolean).length;
            if (score < lowestScore) {
                lowestIndex = index;
                lowestScore = score;
            }
        });
        return topics[lowestIndex];
    }

    function updateRecommendedLink() {
        const link = document.querySelector(".hub-recommended-link");
        const topic = recommendedTopic();
        link.href = topic === "interview" ? "interview.html?category=recommended" : "quiz.html?topic=" + topic;
    }

    function renderSolved(attempts) {
        const solvedByTopic = {};
        (Array.isArray(attempts) ? attempts : []).forEach(function (attempt) {
            if (!attempt || !attempt.topic || !attempt.is_correct) {
                return;
            }
            solvedByTopic[attempt.topic] = solvedByTopic[attempt.topic] || new Set();
            solvedByTopic[attempt.topic].add(String(attempt.question_id || attempt.questionId));
        });

        document.querySelectorAll("[data-topic-solved]").forEach(function (node) {
            const solved = solvedByTopic[node.dataset.topicSolved]
                ? solvedByTopic[node.dataset.topicSolved].size
                : 0;
            node.textContent = solved + " solved";
        });
    }

    async function loadQuestionCounts() {
        if (!client) {
            return;
        }
        try {
            const result = await client.from("mcq_questions").select("topic").eq("is_published", true).limit(1000);
            if (result.error) {
                throw result.error;
            }
            const counts = {};
            (result.data || []).forEach(function (question) {
                counts[question.topic] = (counts[question.topic] || 0) + 1;
            });
            document.querySelectorAll("[data-topic-count]").forEach(function (node) {
                const count = counts[node.dataset.topicCount] || 0;
                node.textContent = count ? count + " questions" : "Starter bank";
            });
        } catch (error) {
            return;
        }
    }

    async function loadCloudSolved(user) {
        if (!client || !user) {
            renderSolved(readJson(HISTORY_KEY, []));
            return;
        }

        try {
            const result = await client
                .from("mcq_attempts")
                .select("question_id,topic,is_correct")
                .eq("user_id", user.id)
                .eq("is_correct", true)
                .limit(1000);
            if (result.error) {
                throw result.error;
            }
            renderSolved(result.data || []);
        } catch (error) {
            renderSolved(readJson(HISTORY_KEY, []));
        }
    }

    function initializeDrawer() {
        const toggle = element("placementSidebarToggle");
        const sidebar = element("placementSidebar");
        const backdrop = element("placementDrawerBackdrop");

        function setOpen(open) {
            sidebar.classList.toggle("is-open", open);
            backdrop.classList.toggle("is-open", open);
            document.body.classList.toggle("placement-drawer-open", open);
            toggle.setAttribute("aria-expanded", String(open));
            toggle.textContent = open ? "✕ Close Practice Topics" : "☰ Practice Topics";
            backdrop.tabIndex = open ? 0 : -1;
        }

        toggle.addEventListener("click", function () { setOpen(!sidebar.classList.contains("is-open")); });
        backdrop.addEventListener("click", function () { setOpen(false); toggle.focus(); });
        sidebar.addEventListener("click", function (event) { if (event.target.closest("a")) { setOpen(false); } });
        document.addEventListener("keydown", function (event) {
            if (event.key === "Escape" && sidebar.classList.contains("is-open")) {
                setOpen(false);
                toggle.focus();
            }
        });
        window.addEventListener("resize", function () { if (window.innerWidth > MOBILE_BREAKPOINT) { setOpen(false); } });
    }

    function initialize() {
        initializeDrawer();
        updateRecommendedLink();
        renderSolved(readJson(HISTORY_KEY, []));
        loadQuestionCounts();

        window.addEventListener("codebhavya:auth-changed", function (event) {
            loadCloudSolved(event.detail && event.detail.user ? event.detail.user : null);
        });
        window.addEventListener("storage", function (event) {
            if (event.key === HISTORY_KEY) {
                renderSolved(readJson(HISTORY_KEY, []));
            }
            if (event.key === READINESS_KEY) {
                updateRecommendedLink();
            }
        });

        const existingUser = window.CodeBhavyaAuth && window.CodeBhavyaAuth.getUser
            ? window.CodeBhavyaAuth.getUser()
            : null;
        loadCloudSolved(existingUser);
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initialize);
    } else {
        initialize();
    }
}());
