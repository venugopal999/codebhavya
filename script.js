/* =========================================
   VENU LEARNING - COMMON JAVASCRIPT
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


/* ============================================================
   CODEBHAVYA GLOBAL FIXED SIDEBAR CONTROLLER
   Desktop:
   - one browser/page scrollbar
   - sidebar remains stationary while main content scrolls
   - footer spans full width and sits above the fixed sidebar
   Mobile:
   - normal document flow
   ============================================================ */
(function () {
    "use strict";

    const MANAGED = [
        "position",
        "left",
        "top",
        "bottom",
        "width",
        "height",
        "min-height",
        "max-height",
        "margin",
        "padding",
        "overflow-y",
        "overflow-x",
        "z-index",
        "box-sizing",
        "display",
        "max-width",
        "min-width",
        "margin-left",
        "background",
        "border",
        "border-right",
        "border-bottom",
        "border-radius",
        "flex",
        "align-self"
    ];

    function clearManagedStyles(el) {

        if (!el) {
            return;
        }

        MANAGED.forEach(function(prop) {
            el.style.removeProperty(prop);
        });

    }


    function setImportant(el, prop, value) {

        if (el) {
            el.style.setProperty(
                prop,
                value,
                "important"
            );
        }

    }


    function applyCodeBhavyaLayout() {

        const docs =
            document.querySelector(".docs-layout");

        const sidebar =
            document.querySelector(
                ".docs-layout > .sidebar"
            );

        const main =
            document.querySelector(
                ".docs-layout > .main-content"
            );

        const header =
            document.querySelector(".top-header");

        const footer =
            document.querySelector(".footer");


        if (!docs || !sidebar || !main) {
            return;
        }


        const mobile =
            window.matchMedia(
                "(max-width: 768px)"
            ).matches;


        /* ==============================
           MOBILE
           ============================== */

        if (mobile) {

            [
                docs,
                sidebar,
                main,
                footer
            ].forEach(clearManagedStyles);

            return;
        }


        /* ==============================
           DESKTOP
           ============================== */

        const headerHeight =
            header
                ? Math.max(
                    0,
                    Math.round(
                        header
                            .getBoundingClientRect()
                            .height
                    )
                )
                : 72;


        const sidebarWidth =
            window.innerWidth <= 1100
                ? 215
                : 235;


        /* ==============================
           PAGE WRAPPER
           ============================== */

        setImportant(
            docs,
            "display",
            "block"
        );

        setImportant(
            docs,
            "width",
            "100%"
        );

        setImportant(
            docs,
            "max-width",
            "none"
        );

        setImportant(
            docs,
            "min-height",
            "calc(100vh - " +
                headerHeight +
                "px)"
        );

        setImportant(
            docs,
            "margin",
            "0"
        );

        setImportant(
            docs,
            "padding",
            "0"
        );

        setImportant(
            docs,
            "background",
            "#f5f7fb"
        );


        /* ==============================
           FIXED SIDEBAR
           ============================== */

        setImportant(
            sidebar,
            "position",
            "fixed"
        );

        setImportant(
            sidebar,
            "left",
            "0"
        );

        setImportant(
            sidebar,
            "top",
            headerHeight + "px"
        );

        setImportant(
            sidebar,
            "bottom",
            "0"
        );

        setImportant(
            sidebar,
            "width",
            sidebarWidth + "px"
        );

        setImportant(
            sidebar,
            "height",
            "auto"
        );

        setImportant(
            sidebar,
            "min-height",
            "0"
        );

        setImportant(
            sidebar,
            "max-height",
            "none"
        );

        setImportant(
            sidebar,
            "margin",
            "0"
        );

        setImportant(
            sidebar,
            "padding",
            "20px 12px"
        );

        setImportant(
            sidebar,
            "overflow-y",
            "auto"
        );

        setImportant(
            sidebar,
            "overflow-x",
            "hidden"
        );

        setImportant(
            sidebar,
            "z-index",
            "50"
        );

        setImportant(
            sidebar,
            "box-sizing",
            "border-box"
        );

        setImportant(
            sidebar,
            "background",
            "#ffffff"
        );

        setImportant(
            sidebar,
            "border",
            "0"
        );

        setImportant(
            sidebar,
            "border-right",
            "1px solid #e2e8f0"
        );

        setImportant(
            sidebar,
            "border-radius",
            "0"
        );


        /* ==============================
           MAIN CONTENT
           ============================== */

        setImportant(
            main,
            "display",
            "block"
        );

        setImportant(
            main,
            "width",
            "calc(100% - " +
                sidebarWidth +
                "px)"
        );

        setImportant(
            main,
            "max-width",
            "none"
        );

        setImportant(
            main,
            "min-width",
            "0"
        );

        setImportant(
            main,
            "margin",
            "0 0 0 " +
                sidebarWidth +
                "px"
        );

        setImportant(
            main,
            "padding",
            "24px 16px 36px 14px"
        );

        setImportant(
            main,
            "box-sizing",
            "border-box"
        );


        /* ==============================
           FULL WIDTH FOOTER
           ============================== */

        if (footer) {

            setImportant(
                footer,
                "position",
                "relative"
            );

            setImportant(
                footer,
                "z-index",
                "1000"
            );

            setImportant(
                footer,
                "width",
                "100%"
            );

            setImportant(
                footer,
                "max-width",
                "none"
            );

            setImportant(
                footer,
                "margin-left",
                "0"
            );

            setImportant(
                footer,
                "box-sizing",
                "border-box"
            );

        }

    }


    /* =========================================
       INITIALIZE LAYOUT
       ========================================= */

    function initCodeBhavyaLayout() {

        applyCodeBhavyaLayout();


        window.addEventListener(
            "resize",
            applyCodeBhavyaLayout,
            {
                passive: true
            }
        );


        window.addEventListener(
            "orientationchange",
            applyCodeBhavyaLayout,
            {
                passive: true
            }
        );


        /*
        Re-apply after the page finishes
        loading fonts, images and other scripts.
        */

        setTimeout(
            applyCodeBhavyaLayout,
            100
        );

        setTimeout(
            applyCodeBhavyaLayout,
            600
        );

    }


    if (
        document.readyState ===
        "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            initCodeBhavyaLayout
        );

    } else {

        initCodeBhavyaLayout();

    }

})();
