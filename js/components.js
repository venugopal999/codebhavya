"use strict";

/* =========================================================
   CODEBHAVYA SHARED COMPONENT LOADER
   Loads:
   - components/header.html
   - components/footer.html

   This file does NOT build or modify navigation.
   The navigation is already contained inside header.html.
   ========================================================= */

(function () {

    const HEADER_CONTAINER_ID = "codebhavya-header-container";
    const FOOTER_CONTAINER_ID = "codebhavya-footer-container";

    const HEADER_URL = "/components/header.html";
    const FOOTER_URL = "/components/footer.html";


    /* ---------------------------------------------------------
       Load HTML component
       --------------------------------------------------------- */

    async function loadComponent(url, containerId, loadedEventName) {

        const container = document.getElementById(containerId);

        if (!container) {
            console.warn(
                "CodeBhavya component container not found:",
                containerId
            );
            return false;
        }

        try {

            const response = await fetch(url, {
                method: "GET",
                cache: "no-cache"
            });

            if (!response.ok) {
                throw new Error(
                    `HTTP ${response.status} while loading ${url}`
                );
            }

            const html = await response.text();

            if (!html.trim()) {
                throw new Error(
                    `Empty component received from ${url}`
                );
            }

            container.innerHTML = html;

            document.dispatchEvent(
                new CustomEvent(loadedEventName)
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


    /* ---------------------------------------------------------
       Load header
       --------------------------------------------------------- */

    async function loadHeader() {

        return await loadComponent(
            HEADER_URL,
            HEADER_CONTAINER_ID,
            "codebhavya:headerLoaded"
        );
    }


    /* ---------------------------------------------------------
       Load footer
       --------------------------------------------------------- */

    async function loadFooter() {

        return await loadComponent(
            FOOTER_URL,
            FOOTER_CONTAINER_ID,
            "codebhavya:footerLoaded"
        );
    }


    /* ---------------------------------------------------------
       Load all components
       --------------------------------------------------------- */

    async function loadAllComponents() {

        const headerLoaded = await loadHeader();

        const footerLoaded = await loadFooter();

        document.dispatchEvent(
            new CustomEvent("codebhavya:componentsLoaded", {
                detail: {
                    headerLoaded: headerLoaded,
                    footerLoaded: footerLoaded
                }
            })
        );
    }


    /* ---------------------------------------------------------
       Start after DOM is ready
       --------------------------------------------------------- */

    if (document.readyState === "loading") {

        document.addEventListener(
            "DOMContentLoaded",
            loadAllComponents,
            { once: true }
        );

    } else {

        loadAllComponents();
    }


    /* ---------------------------------------------------------
       Optional public API
       Useful if another CodeBhavya page needs to reload
       the shared components.
       --------------------------------------------------------- */

    window.CodeBhavyaComponents = {
        loadHeader,
        loadFooter,
        loadAllComponents
    };

})();
