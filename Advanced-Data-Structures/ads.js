(function () {
    "use strict";

    const searchInput = document.getElementById("topicSearch");
    const topicCards = Array.from(document.querySelectorAll(".topic-card"));
    const sidebarLinks = Array.from(document.querySelectorAll(".ads-topic-link"));
    const levelSections = Array.from(document.querySelectorAll(".ads-level-section"));
    const noResults = document.getElementById("noTopicResults");

    function normalize(value) {
        return value.toLowerCase().trim();
    }

    function searchTopics() {
        const query = normalize(searchInput ? searchInput.value : "");
        let visibleCards = 0;

        topicCards.forEach(function (card) {
            const matches = !query || normalize(card.textContent).includes(query);
            card.hidden = !matches;

            if (matches) {
                visibleCards += 1;
            }
        });

        sidebarLinks.forEach(function (link) {
            link.hidden =
                Boolean(query) &&
                !normalize(link.textContent).includes(query);
        });

        levelSections.forEach(function (section) {
            const hasVisibleCard = Array.from(
                section.querySelectorAll(".topic-card")
            ).some(function (card) {
                return !card.hidden;
            });

            section.hidden = !hasVisibleCard;
        });

        if (noResults) {
            noResults.hidden = visibleCards !== 0;
        }
    }

    if (searchInput) {
        searchInput.addEventListener("input", searchTopics);
    }

    sidebarLinks
        .filter(function (link) {
            return !link.classList.contains("is-available");
        })
        .forEach(function (link) {
            link.classList.add("is-unavailable");
            link.setAttribute("aria-disabled", "true");
            link.setAttribute("tabindex", "-1");
            link.setAttribute(
                "title",
                "This ADS level will be activated after development."
            );

            link.addEventListener("click", function (event) {
                event.preventDefault();
            });
        });
}());
