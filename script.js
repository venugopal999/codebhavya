/* =========================================
   CODEBHAVYA - COMMON JAVASCRIPT
   ========================================= */


/* =========================================
   SHOW / HIDE SOLUTIONS
   ========================================= */

function toggleSolution(id) {

    const element =
        document.getElementById(id);

    if (!element) {
        return;
    }

    if (element.style.display === "block") {

        element.style.display = "none";

    } else {

        element.style.display = "block";

    }

}


/* =========================================
   SIDEBAR SEARCH
   ========================================= */

function searchTopics() {

    const input =
        document.getElementById("topicSearch");

    if (!input) {
        return;
    }

    const searchText =
        input.value.toLowerCase();

    const links =
        document.querySelectorAll(
            ".sidebar a"
        );

    links.forEach(function(link) {

        const text =
            link.textContent.toLowerCase();

        if (text.includes(searchText)) {

            link.style.display = "block";

        } else {

            link.style.display = "none";

        }

    });

}


/* =========================================
   SIDEBAR MUST STOP ABOVE FOOTER
   ========================================= */

(function () {

    "use strict";

    let ticking = false;


    function updateSidebarHeight() {

        const sidebar =
            document.querySelector(
                ".docs-layout > .sidebar"
            );

        const footer =
            document.querySelector(
                ".footer"
            );

        const header =
            document.querySelector(
                ".top-header"
            );


        if (!sidebar || !footer) {
            return;
        }


        /* MOBILE */

        if (
            window.matchMedia(
                "(max-width: 768px)"
            ).matches
        ) {

            sidebar.style.removeProperty(
                "height"
            );

            sidebar.style.removeProperty(
                "max-height"
            );

            return;
        }


        /* HEADER HEIGHT */

        let headerHeight = 72;

        if (header) {

            const measuredHeight =
                Math.round(
                    header
                        .getBoundingClientRect()
                        .height
                );

            if (measuredHeight > 0) {

                headerHeight =
                    measuredHeight;

            }

        }


        /*
        Find where the footer currently begins
        relative to the browser window.
        */

        const footerTop =
            footer
                .getBoundingClientRect()
                .top;


        /*
        Normally the sidebar can use the complete
        visible area below the header.
        */

        let availableHeight =
            window.innerHeight -
            headerHeight;


        /*
        Once footer enters the viewport,
        reduce sidebar height.

        Example:

        Header
        ────────────────
        Sidebar | Main
        Sidebar | Main
        Sidebar | Main
        ──────────────── ← Footer starts here
        Footer full width
        */

        if (
            footerTop <
            window.innerHeight
        ) {

            availableHeight =
                footerTop -
                headerHeight;

        }


        /*
        Prevent negative height when we scroll
        deeply into the footer.
        */

        availableHeight =
            Math.max(
                0,
                Math.floor(
                    availableHeight
                )
            );


        sidebar.style.setProperty(
            "height",
            availableHeight + "px",
            "important"
        );


        sidebar.style.setProperty(
            "max-height",
            availableHeight + "px",
            "important"
        );

    }


    /* =========================================
       SCROLL
       ========================================= */

    function onScroll() {

        if (ticking) {
            return;
        }

        ticking = true;


        requestAnimationFrame(
            function () {

                updateSidebarHeight();

                ticking = false;

            }
        );

    }


    /* =========================================
       START
       ========================================= */

    function initialize() {

        updateSidebarHeight();


        window.addEventListener(
            "scroll",
            onScroll,
            {
                passive: true
            }
        );


        window.addEventListener(
            "resize",
            updateSidebarHeight,
            {
                passive: true
            }
        );


        window.addEventListener(
            "orientationchange",
            updateSidebarHeight,
            {
                passive: true
            }
        );

    }


    if (
        document.readyState ===
        "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            initialize
        );

    } else {

        initialize();

    }

})();
