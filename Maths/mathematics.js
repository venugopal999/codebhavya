/* =========================================
   CODEBHAVYA - MATHEMATICS COURSE JAVASCRIPT
   ========================================= */

(function () {

    "use strict";

    const progressKey =
        "codebhavya-mathematics-visited-topics";


    function readVisitedTopics() {

        try {

            const saved =
                window.localStorage.getItem(progressKey);

            const topics =
                saved ? JSON.parse(saved) : [];

            return Array.isArray(topics)
                ? topics
                : [];

        } catch (error) {

            return [];

        }

    }


    function saveVisitedTopics(topics) {

        try {

            window.localStorage.setItem(
                progressKey,
                JSON.stringify(topics)
            );

        } catch (error) {

            /* Progress storage is optional. */

        }

    }


    function rememberCurrentTopic(visitedTopics) {

        const currentTopic =
            document.body.dataset.mathTopic;

        if (
            !currentTopic ||
            visitedTopics.includes(currentTopic)
        ) {
            return visitedTopics;
        }

        const updatedTopics =
            visitedTopics.concat(currentTopic);

        saveVisitedTopics(updatedTopics);

        return updatedTopics;

    }


    function markVisitedCards(visitedTopics) {

        const topicCards =
            document.querySelectorAll(
                ".topic-card[data-topic-id]"
            );

        topicCards.forEach(function (card) {

            const topicId =
                card.dataset.topicId;

            if (visitedTopics.includes(topicId)) {

                card.classList.add(
                    "visited-topic"
                );

            }

        });

    }


    function updateCourseProgress(visitedTopics) {

        const progress =
            document.querySelector(
                "[data-math-progress]"
            );

        if (!progress) {
            return;
        }

        const availableTopics =
            document.querySelectorAll(
                ".topic-card[data-topic-available='true']"
            );

        const availableIds =
            Array.from(availableTopics)
                .map(function (card) {
                    return card.dataset.topicId;
                });

        const visitedAvailable =
            availableIds.filter(function (topicId) {
                return visitedTopics.includes(topicId);
            }).length;

        const totalAvailable =
            availableIds.length;

        const percentage =
            totalAvailable === 0
                ? 0
                : (visitedAvailable / totalAvailable) * 100;

        const progressText =
            progress.querySelector(
                "[data-math-progress-text]"
            );

        const progressFill =
            progress.querySelector(
                "[data-math-progress-fill]"
            );

        if (progressText) {

            progressText.textContent =
                visitedAvailable +
                " of " +
                totalAvailable +
                " available topics visited";

        }

        if (progressFill) {

            progressFill.style.width =
                percentage + "%";

        }

    }


    function prepareComingSoonLinks() {

        const links =
            document.querySelectorAll(
                "a.coming-soon-link"
            );

        links.forEach(function (link) {

            link.setAttribute(
                "aria-disabled",
                "true"
            );

            link.setAttribute(
                "tabindex",
                "-1"
            );

            link.addEventListener(
                "click",
                function (event) {
                    event.preventDefault();
                }
            );

        });

    }


    function initializeMathematics() {

        let visitedTopics =
            readVisitedTopics();

        visitedTopics =
            rememberCurrentTopic(
                visitedTopics
            );

        markVisitedCards(
            visitedTopics
        );

        updateCourseProgress(
            visitedTopics
        );

        prepareComingSoonLinks();

    }


    if (
        document.readyState ===
        "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            initializeMathematics
        );

    } else {

        initializeMathematics();

    }

})();
