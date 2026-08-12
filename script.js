/* =========================================
   CODEBHAVYA - COMMON JAVASCRIPT
   ========================================= */


/* =========================================
   SHOW / HIDE SOLUTIONS
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


/* =========================================
   SIDEBAR SEARCH
   ========================================= */

function searchTopics() {

    const input = document.getElementById("topicSearch");

    if (!input) {
        return;
    }

    const searchText = input.value.toLowerCase();

    const links = document.querySelectorAll(".sidebar a");

    links.forEach(function(link) {

        const text = link.textContent.toLowerCase();

        if (text.includes(searchText)) {
            link.style.display = "block";
        } else {
            link.style.display = "none";
        }

    });

}


/* ============================================================
   CODEBHAVYA DESKTOP LAYOUT CONTROLLER

   DESKTOP:
   ✓ Header stays fixed
   ✓ Sidebar stays fixed
   ✓ Main content scrolls normally
   ✓ One normal page scrollbar
   ✓ Footer stays full width
   ✓ Sidebar stops ABOVE footer
   ✓ Footer never covers sidebar

   MOBILE:
   ✓ Normal page layout
   ✓ Header scrolls normally
   ✓ Sidebar returns to normal flow
   ============================================================ */

(function () {

    "use strict";


    let ticking = false;


    /* =========================================
       HELPER
       ========================================= */

    function setImportant(element, property, value) {

        if (!element) {
            return;
        }

        element.style.setProperty(
            property,
            value,
            "important"
        );
    }


    /* =========================================
       REMOVE DESKTOP INLINE STYLES
       ========================================= */

    function resetMobileLayout() {

        const header =
            document.querySelector(".top-header");

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

        const footer =
            document.querySelector(".footer");


        document.body.style.removeProperty(
            "padding-top"
        );


        if (header) {

            [
                "position",
                "top",
                "left",
                "right",
                "width",
                "z-index"
            ].forEach(function(property) {

                header.style.removeProperty(property);

            });

        }


        if (docs) {

            [
                "display",
                "width",
                "max-width",
                "margin",
                "padding",
                "background"
            ].forEach(function(property) {

                docs.style.removeProperty(property);

            });

        }


        if (sidebar) {

            [
                "position",
                "top",
                "left",
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
                "background",
                "border",
                "border-right",
                "border-radius",
                "box-sizing"
            ].forEach(function(property) {

                sidebar.style.removeProperty(property);

            });

        }


        if (main) {

            [
                "display",
                "width",
                "max-width",
                "min-width",
                "margin",
                "margin-left",
                "padding",
                "box-sizing"
            ].forEach(function(property) {

                main.style.removeProperty(property);

            });

        }


        if (footer) {

            [
                "position",
                "z-index",
                "width",
                "max-width",
                "margin-left"
            ].forEach(function(property) {

                footer.style.removeProperty(property);

            });

        }

    }


    /* =========================================
       MAIN DESKTOP LAYOUT
       ========================================= */

    function applyDesktopLayout() {

        const header =
            document.querySelector(".top-header");

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

        const footer =
            document.querySelector(".footer");


        /*
        Only documentation pages need
        this sidebar layout.
        */

        if (!docs || !sidebar || !main) {
            return;
        }


        const mobile =
            window.matchMedia(
                "(max-width: 768px)"
            ).matches;


        if (mobile) {

            resetMobileLayout();

            return;
        }


        /* =====================================
           HEADER
           ===================================== */

        let headerHeight = 72;


        if (header) {

            headerHeight =
                Math.round(
                    header.getBoundingClientRect()
                        .height
                );


            if (headerHeight <= 0) {
                headerHeight = 72;
            }


            setImportant(
                header,
                "position",
                "fixed"
            );

            setImportant(
                header,
                "top",
                "0"
            );

            setImportant(
                header,
                "left",
                "0"
            );

            setImportant(
                header,
                "right",
                "0"
            );

            setImportant(
                header,
                "width",
                "100%"
            );

            setImportant(
                header,
                "z-index",
                "2000"
            );

        }


        /*
        Because fixed header is removed
        from normal document flow,
        reserve its height.
        */

        document.body.style.setProperty(
            "padding-top",
            headerHeight + "px",
            "important"
        );


        /* =====================================
           SIDEBAR WIDTH
           ===================================== */

        const sidebarWidth =
            window.innerWidth <= 1100
                ? 215
                : 235;


        /* =====================================
           DOCUMENT LAYOUT
           ===================================== */

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


        /* =====================================
           FIXED SIDEBAR
           ===================================== */

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
            "width",
            sidebarWidth + "px"
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

        setImportant(
            sidebar,
            "box-sizing",
            "border-box"
        );

        setImportant(
            sidebar,
            "z-index",
            "100"
        );


        /* =====================================
           MAIN CONTENT
           ===================================== */

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


        /* =====================================
           FOOTER
           ===================================== */

        if (footer) {

            setImportant(
                footer,
                "position",
                "relative"
            );

            setImportant(
                footer,
                "z-index",
                "500"
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

        }


        /*
        Calculate sidebar bottom so it
        stops before the footer.
        */

        updateSidebarFooterPosition();

    }


    /* =========================================
       STOP SIDEBAR BEFORE FOOTER
       ========================================= */

    function updateSidebarFooterPosition() {

        const sidebar =
            document.querySelector(
                ".docs-layout > .sidebar"
            );

        const footer =
            document.querySelector(".footer");

        const header =
            document.querySelector(".top-header");


        if (!sidebar) {
            return;
        }


        if (
            window.matchMedia(
                "(max-width: 768px)"
            ).matches
        ) {
            return;
        }


        let headerHeight = 72;


        if (header) {

            headerHeight =
                Math.round(
                    header.getBoundingClientRect()
                        .height
                );

        }


        let bottomSpace = 0;


        if (footer) {

            const footerRect =
                footer.getBoundingClientRect();


            /*
            Footer starts entering screen.
            Increase sidebar bottom distance
            by exactly the amount occupied
            by the footer.
            */

            if (
                footerRect.top <
                window.innerHeight
            ) {

                bottomSpace =
                    window.innerHeight -
                    footerRect.top;

            }

        }


        /*
        Never allow the footer adjustment
        to make sidebar height negative.
        */

        const maximumBottom =
            window.innerHeight -
            headerHeight;


        bottomSpace =
            Math.min(
                Math.max(
                    bottomSpace,
                    0
                ),
                maximumBottom
            );


        setImportant(
            sidebar,
            "bottom",
            bottomSpace + "px"
        );


        setImportant(
            sidebar,
            "height",
            "auto"
        );


        setImportant(
            sidebar,
            "max-height",
            "none"
        );

    }


    /* =========================================
       SCROLL HANDLER
       ========================================= */

    function handleScroll() {

        if (ticking) {
            return;
        }


        ticking = true;


        window.requestAnimationFrame(
            function() {

                updateSidebarFooterPosition();

                ticking = false;

            }
        );

    }


    /* =========================================
       INITIALIZE
       ========================================= */

    function initializeCodeBhavyaLayout() {

        applyDesktopLayout();


        window.addEventListener(
            "scroll",
            handleScroll,
            {
                passive: true
            }
        );


        window.addEventListener(
            "resize",
            function() {

                applyDesktopLayout();

            },
            {
                passive: true
            }
        );


        window.addEventListener(
            "orientationchange",
            function() {

                setTimeout(
                    applyDesktopLayout,
                    100
                );

            },
            {
                passive: true
            }
        );


        /*
        Run again after fonts,
        images and page-specific JS
        finish loading.
        */

        setTimeout(
            applyDesktopLayout,
            100
        );


        setTimeout(
            applyDesktopLayout,
            500
        );

    }


    /* =========================================
       START
       ========================================= */

    if (
        document.readyState ===
        "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            initializeCodeBhavyaLayout
        );

    } else {

        initializeCodeBhavyaLayout();

    }

})();
