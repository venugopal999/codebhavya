/* =========================================================
   CODEBHAVYA
   COMMON HEADER & FOOTER COMPONENT LOADER
   js/components.js
   ========================================================= */

(function () {

    "use strict";


    /* =====================================================
       1. FIND CODEBHAVYA ROOT
       ===================================================== */

    /*
       components.js may be loaded from:

       /js/components.js

       or from pages such as:

       /C-Programming/
       /Python/
       /AI-ML/
       /Placement/
       /Full-Stack/

       Therefore, never build component paths relative
       to the current HTML page.

       Always use the website root.
    */

    const siteRoot = new URL("/", window.location.origin);


    /* =====================================================
       2. COMPONENT PATHS
       ===================================================== */

    const COMPONENTS = {

        header:
            new URL("components/header.html", siteRoot).href,

        footer:
            new URL("components/footer.html", siteRoot).href

    };


    /* =====================================================
       3. LOAD HTML COMPONENT
       ===================================================== */

    async function loadComponent(url, selector) {

        const container = document.querySelector(selector);

        if (!container) {
            return false;
        }

        try {

            const response = await fetch(url, {
                method: "GET",
                cache: "no-cache"
            });

            if (!response.ok) {
                throw new Error(
                    "HTTP " +
                    response.status +
                    " while loading " +
                    url
                );
            }

            const html = await response.text();

            if (!html.trim()) {
                throw new Error(
                    "Empty component received from " + url
                );
            }

            container.innerHTML = html;

            return true;

        } catch (error) {

            console.error(
                "CodeBhavya component loading error:",
                error
            );

            return false;
        }
    }


    /* =====================================================
       4. CREATE COMPONENT CONTAINERS
       ===================================================== */

    function createComponentContainers() {

        /*
           Header
           ------
           If a page already contains:

               <div id="codebhavya-header"></div>

           we use it.

           Otherwise we create the container automatically
           at the beginning of <body>.
        */

        let headerContainer =
            document.getElementById("codebhavya-header-container");

        if (!headerContainer) {

            headerContainer =
                document.createElement("div");

            headerContainer.id =
                "codebhavya-header-container";

            document.body.insertBefore(
                headerContainer,
                document.body.firstChild
            );
        }


        /*
           Footer
           ------
           If a page already contains:

               <div id="codebhavya-footer"></div>

           we use it.

           Otherwise we create it automatically
           at the end of <body>.
        */

        let footerContainer =
            document.getElementById("codebhavya-footer-container");

        if (!footerContainer) {

            footerContainer =
                document.createElement("div");

            footerContainer.id =
                "codebhavya-footer-container";

            document.body.appendChild(
                footerContainer
            );
        }


        return {
            header: headerContainer,
            footer: footerContainer
        };
    }


    /* =====================================================
       5. LOAD HEADER
       ===================================================== */

    async function loadHeader(container) {

        const loaded =
            await loadComponent(
                COMPONENTS.header,
                "#codebhavya-header-container"
            );

        if (!loaded) {
            return false;
        }


        /*
           Header is now actually present in the DOM.

           This event is important because the mega
           navigation must NOT initialize before the
           dynamically loaded header exists.
        */

        document.dispatchEvent(
            new CustomEvent(
                "codebhavya:headerLoaded"
            )
        );


        return true;
    }


    /* =====================================================
       6. LOAD FOOTER
       ===================================================== */

    async function loadFooter(container) {

        const loaded =
            await loadComponent(
                COMPONENTS.footer,
                "#codebhavya-footer-container"
            );

        if (!loaded) {
            return false;
        }


        /*
           Notify other CodeBhavya scripts that the
           footer is available.
        */

        document.dispatchEvent(
            new CustomEvent(
                "codebhavya:footerLoaded"
            )
        );


        return true;
    }


    /* =====================================================
       7. INITIALIZE CODEBHAVYA NAVIGATION
       ===================================================== */

    function initializeNavigation() {

        /*
           The actual mega-navigation implementation
           will be provided by script.js.

           This keeps:

               components.js
                   ↓
               component loading

           separate from:

               script.js
                   ↓
               global CodeBhavya functionality
               mega navigation
               sidebar behavior
               solution toggles
               search
        */

        if (
            window.CodeBhavyaNavigation &&
            typeof window.CodeBhavyaNavigation.init === "function"
        ) {

            window.CodeBhavyaNavigation.init();

        } else {

            /*
               script.js may be loaded after components.js.

               In that situation, notify it when it becomes
               available instead of producing an error.
            */

            document.dispatchEvent(
                new CustomEvent(
                    "codebhavya:navigationReady"
                )
            );
        }
    }


    /* =====================================================
       8. COMPLETE COMPONENT INITIALIZATION
       ===================================================== */

    async function initializeComponents() {

        const containers =
            createComponentContainers();


        /*
           Load header first.

           Navigation depends on the header, so header
           must finish before navigation initialization.
        */

        await loadHeader(containers.header);


        /*
           Initialize navigation immediately after the
           header becomes available.
        */

        initializeNavigation();


        /*
           Footer does not depend on navigation.
        */

        await loadFooter(containers.footer);


        /*
           Final event — all common components are ready.
        */

        document.dispatchEvent(
            new CustomEvent(
                "codebhavya:componentsLoaded"
            )
        );

    }


    /* =====================================================
       9. PUBLIC API
       ===================================================== */

    window.CodeBhavyaComponents = {

        root: siteRoot,

        paths: COMPONENTS,

        load: initializeComponents

    };


    /* =====================================================
       10. START
       ===================================================== */

    if (document.readyState === "loading") {

        document.addEventListener(
            "DOMContentLoaded",
            initializeComponents,
            {
                once: true
            }
        );

    } else {

        initializeComponents();

    }

})();
