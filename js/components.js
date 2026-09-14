"use strict";

/* =========================================================
   CODEBHAVYA SHARED COMPONENT LOADER
   ========================================================= */

(function () {

    const HEADER_CONTAINER_ID =
        "codebhavya-header-container";

    const FOOTER_CONTAINER_ID =
        "codebhavya-footer-container";


    const HEADER_URL =
        "/components/header.html";

    const FOOTER_URL =
        "/components/footer.html";


    /* =====================================================
       LOAD COMPONENT
       ===================================================== */

    async function loadComponent(
        url,
        containerId,
        eventName
    ) {

        const container =
            document.getElementById(containerId);

        if (!container) {

            console.warn(
                "CodeBhavya component container not found:",
                containerId
            );

            return false;
        }


        try {

            const response =
                await fetch(
                    url,
                    {
                        method: "GET",
                        cache: "no-cache"
                    }
                );


            if (!response.ok) {

                throw new Error(
                    `HTTP ${response.status} while loading ${url}`
                );
            }


            const html =
                await response.text();


            if (!html.trim()) {

                throw new Error(
                    `Empty component received from ${url}`
                );
            }


            container.innerHTML =
                html;


            document.dispatchEvent(
                new CustomEvent(
                    eventName
                )
            );


            return true;

        } catch (error) {

            console.error(
                "CodeBhavya component loading failed:",
                url,
                error
            );

            return false;
        }
    }


    /* =====================================================
       MOBILE MENU
       ===================================================== */

    function initializeMobileNavigation() {

        const navigation =
            document.querySelector(
                ".cb-mobile-navigation"
            );


        if (!navigation) {
            return;
        }


        const button =
            navigation.querySelector(
                ".cb-mobile-menu-button"
            );


        if (!button) {
            return;
        }


        if (
            button.dataset.cbMobileReady ===
            "true"
        ) {
            return;
        }


        button.dataset.cbMobileReady =
            "true";


        button.addEventListener(
            "click",
            function () {

                const isOpen =
                    navigation.classList.contains(
                        "cb-mobile-open"
                    );


                if (isOpen) {

                    navigation.classList.remove(
                        "cb-mobile-open"
                    );


                    button.setAttribute(
                        "aria-expanded",
                        "false"
                    );


                    button.setAttribute(
                        "aria-label",
                        "Open navigation menu"
                    );

                } else {

                    navigation.classList.add(
                        "cb-mobile-open"
                    );


                    button.setAttribute(
                        "aria-expanded",
                        "true"
                    );


                    button.setAttribute(
                        "aria-label",
                        "Close navigation menu"
                    );
                }

            }
        );


        /* Close when a normal mobile link is clicked */

        navigation
            .querySelectorAll(
                ".cb-mobile-menu > a, .cb-mobile-submenu a"
            )
            .forEach(
                function (link) {

                    link.addEventListener(
                        "click",
                        function () {

                            navigation.classList.remove(
                                "cb-mobile-open"
                            );

                            button.setAttribute(
                                "aria-expanded",
                                "false"
                            );

                            button.setAttribute(
                                "aria-label",
                                "Open navigation menu"
                            );

                        }
                    );

                }
            );


        /* Close when clicking outside */

        document.addEventListener(
            "click",
            function (event) {

                if (
                    !navigation.contains(
                        event.target
                    )
                ) {

                    navigation.classList.remove(
                        "cb-mobile-open"
                    );

                    button.setAttribute(
                        "aria-expanded",
                        "false"
                    );

                    button.setAttribute(
                        "aria-label",
                        "Open navigation menu"
                    );
                }

            }
        );


        /* Escape key */

        document.addEventListener(
            "keydown",
            function (event) {

                if (
                    event.key !== "Escape"
                ) {
                    return;
                }


                navigation.classList.remove(
                    "cb-mobile-open"
                );


                button.setAttribute(
                    "aria-expanded",
                    "false"
                );


                button.setAttribute(
                    "aria-label",
                    "Open navigation menu"
                );

            }
        );

    }


    /* =====================================================
       LOAD HEADER
       ===================================================== */

    async function loadHeader() {

        const loaded =
            await loadComponent(
                HEADER_URL,
                HEADER_CONTAINER_ID,
                "codebhavya:headerLoaded"
            );


        if (loaded) {

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
       LOAD ALL
       ===================================================== */

    async function loadAllComponents() {

        const headerLoaded =
            await loadHeader();


        const footerLoaded =
            await loadFooter();


        document.dispatchEvent(
            new CustomEvent(
                "codebhavya:componentsLoaded",
                {
                    detail: {
                        headerLoaded:
                            headerLoaded,

                        footerLoaded:
                            footerLoaded
                    }
                }
            )
        );

    }


    /* =====================================================
       INITIALIZATION
       ===================================================== */

    if (
        document.readyState ===
        "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            loadAllComponents,
            {
                once: true
            }
        );

    } else {

        loadAllComponents();

    }


    /* =====================================================
       PUBLIC API
       ===================================================== */

    window.CodeBhavyaComponents = {

        loadHeader,

        loadFooter,

        loadAllComponents

    };

})();
