/* =========================================
   CODEBHAVYA - COMMON JAVASCRIPT
   Layout is handled only by style.css.
   ========================================= */

function toggleSolution(id) {
    const element = document.getElementById(id);

    if (!element) {
        return;
    }

    if (element.style.display === "block") {
        element.style.display = "none";
    } else {
        element.style.display = "block";
    }
}

function searchTopics() {
    const input = document.getElementById("topicSearch");

    if (!input) {
        return;
    }

    const searchText = input.value.toLowerCase();
    const links = document.querySelectorAll(".sidebar a");

    links.forEach(function(link) {
        const text = link.textContent.toLowerCase();

        link.style.display =
            text.includes(searchText)
                ? "block"
                : "none";
    });
}
