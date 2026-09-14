"use strict";

/*
=========================================================
 CODEBHAVYA SHARED COMPONENT LOADER
 Header + Footer

 Desktop dropdowns:
    PURE HOVER
    No click required
    No click-to-toggle behaviour
=========================================================
*/

(function () {

    const HEADER_CONTAINER_ID = "codebhavya-header-container";
    const FOOTER_CONTAINER_ID = "codebhavya-footer-container";

    const HEADER_URL = "/components/header.html";
    const FOOTER_URL = "/components/footer.html";


    /* =====================================================
       LOAD HTML COMPONENT
       ===================================================== */

    async function loadComponent(url, containerId, eventName) {

        const container = document.getElementById(containerId);

        if (!container) {
            return false;
        }

        try {

            const response = await fetch(url, {
                cache: "no-cache"
            });

            if (!response.ok) {
                throw new Error(
                    `Failed to load component: ${response.status}`
                );
            }

            const html = await response.text();

            container.innerHTML = html;

            document.dispatchEvent(
                new CustomEvent(eventName)
            );

            return true;

        } catch (error) {

            console.error(
                `CodeBhavya component loading error (${url}):`,
                error
            );

            return false;
        }
    }


    /* =====================================================
       INITIALIZE DESKTOP HOVER NAVIGATION
       ===================================================== */

    function initializeDesktopHoverNavigation() {

        const dropdowns =
            document.querySelectorAll(
                ".cb-nav-dropdown"
            );

        if (!dropdowns.length) {
            return;
        }


        /*
        Remove any old click-based open state.
        Desktop navigation is controlled entirely by CSS hover.
        */

        dropdowns.forEach(function (dropdown) {

            dropdown.classList.remove("is-open");

            const trigger =
                dropdown.querySelector(
                    ".cb-dropdown-trigger"
                );

            if (!trigger) {
                return;
            }


            /*
            Prevent the old click-to-toggle behaviour.

            The dropdown opens when the mouse enters
            the complete dropdown area through CSS.
            */

            trigger.addEventListener(
                "click",
                function (event) {

                    /*
                    On desktop, clicking the button should NOT
                    control the menu.

                    We prevent the click from changing the
                    dropdown state.
                    */

                    if (window.innerWidth > 1120) {

                        event.preventDefault();

                        dropdown.classList.remove(
                            "is-open"
                        );
                    }
                }
            );


            /*
            Whenever mouse enters the dropdown area,
            make sure no stale click state remains.
            */

            dropdown.addEventListener(
                "mouseenter",
                function () {

                    if (window.innerWidth > 1120) {

                        dropdown.classList.remove(
                            "is-open"
                        );
                    }
                }
            );


            /*
            When the mouse completely leaves the dropdown,
            remove any stale state.
            */

            dropdown.addEventListener(
                "mouseleave",
                function () {

                    dropdown.classList.remove(
                        "is-open"
                    );
                }
            );

        });
    }


    /* =====================================================
       MOBILE NAVIGATION
       ===================================================== */

    function initializeMobileNavigation() {

        const mobileNavigation =
            document.querySelector(
                ".cb-mobile-navigation"
            );

        if (!mobileNavigation) {
            return;
        }


        /*
        Mobile navigation uses the native <details>
        behaviour from header.html.

        No additional click logic is required.
        */

        const summaries =
            mobileNavigation.querySelectorAll(
                "summary"
            );

        summaries.forEach(function (summary) {

            summary.addEventListener(
                "click",
                function () {

                    /*
                    Allow native <details> behaviour.
                    This listener intentionally does not
                    prevent the click.
                    */

                }
            );

        });
    }


    /* =====================================================
       LOAD HEADER
       ===================================================== */

    async function loadHeader() {

        const loaded = await loadComponent(
            HEADER_URL,
            HEADER_CONTAINER_ID,
            "codebhavya:headerLoaded"
        );

        if (loaded) {

            initializeDesktopHoverNavigation();

            initializeMobileNavigation();
        }

        return loaded;
    }


    /* =====================================================
       LOAD FOOTER
       ===================================================== */

    async function loadFooter() {

        return await loadComponent(
            FOOTER_URL,
            FOOTER_CONTAINER_ID,
            "codebhavya:footerLoaded"
        );
    }


    /* =====================================================
       LOAD ALL COMPONENTS
       ===================================================== */

    async function loadAllComponents() {

        await loadHeader();

        await loadFooter();

        document.dispatchEvent(
            new CustomEvent(
                "codebhavya:componentsLoaded"
            )
        );
    }


    /* =====================================================
       PUBLIC API
       ===================================================== */

    window.CodeBhavyaComponents = {

        loadHeader,
        loadFooter,
        loadAllComponents

    };


    /* =====================================================
       START
       ===================================================== */

    if (document.readyState === "loading") {

        document.addEventListener(
            "DOMContentLoaded",
            loadAllComponents
        );

    } else {

        loadAllComponents();
    }

})();
