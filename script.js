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

        const sidebar = document.querySelector(
            ".docs-layout > .sidebar"
        );

        if (sidebar) {
            /*
             * A sticky sidebar is naturally constrained by .docs-layout.
             * Keeping a fixed height lets the whole sidebar move upward when
             * the footer reaches it. Dynamically shrinking the height here
             * would clip the sidebar and make its bottom look interrupted.
             */
            sidebar.style.removeProperty("height");
            sidebar.style.removeProperty("max-height");
        }

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

/* =========================================
   CODEBHAVYA GLOBAL MEGA NAVIGATION
   One shared configuration for every course.
   Existing HTML links remain as a no-JavaScript fallback.
   ========================================= */

(function () {

    "use strict";

    const executingScript =
        document.currentScript ||
        Array.from(document.scripts).find(function (script) {
            return /(?:^|\/)script\.js(?:\?|$)/.test(script.src || "");
        });

    if (!executingScript || !executingScript.src) {
        return;
    }

    const siteRoot = new URL("./", executingScript.src);

    const learningGroups = [
        {
            title: "Programming",
            links: [
                { label: "C Programming", path: "C-Programming/index.html", icon: "C" },
                { label: "Python", path: "Python/index.html", icon: "Py" },
                { label: "Java", path: "Java/index.html", icon: "J" },
                { label: "Java Practice", path: "Java/practice.html", icon: "JP" },
                { label: "Programs Library", path: "Programs/index.html", icon: "{}" },
                { label: "Download PPT's", path: "PPTs/index.html", icon: "📥" }
            ]
        },
        {
            title: "Data & Algorithms",
            links: [
                { label: "Data Structures", path: "Data-Structures/index.html", icon: "DS" },
                { label: "Advanced Data Structures", path: "Advanced-Data-Structures/index.html", icon: "AD" }
            ]
        },
        {
            title: "AI & Mathematics",
            links: [
                { label: "Mathematics", path: "Maths/index.html", icon: "M" },
                { label: "AI & Machine Learning", path: "AI-ML/index.html", icon: "AI" }
            ]
        },
        {
            title: "Core Computer Science & Web Development",
            links: [
                { label: "DBMS & SQL", path: "DBMS/index.html", icon: "DB" },
                { label: "Operating Systems", path: "Operating-Systems/index.html", icon: "OS" },
                { label: "Full Stack MERN", path: "Full-Stack/index.html", icon: "FSM" },
                { label: "Web-Technologies", path: "Web-Technologies/introduction.html", icon: "WT" },
                { label: "Core CS Practice", path: "Placement/mcq-library.html?topic=core-cs", icon: "CS" },
                { label: "Scenario Problem Lab", path: "Placement/core-cs-problems.html", icon: "Lab" }
            ]
        }
    ];

    const practiceGroups = [
        {
            title: "Learn & Review",
            links: [
                { label: "Practice Hub", path: "Placement/practice.html", icon: "Hub" },
                { label: "MCQ Learning Library", path: "Placement/mcq-library.html?topic=c", icon: "MCQ" },
                { label: "Company Preparation", path: "Placement/company-prep.html", icon: "Co" }
            ]
        },
        {
            title: "Assess & Code",
            links: [
                { label: "Timed Quiz", path: "Placement/quiz.html?topic=c", icon: "Q" },
                { label: "Coding Arena", path: "Placement/coding.html?topic=c", icon: "</>" },
                { label: "Online Compiler", path: "Online-Compiler/", icon: "Run" },
                { label: "Complete Mock Drive", path: "Placement/mock-drive.html", icon: "4R" },
                { label: "Class Room Quiz", path: "Quiz/index.html", icon: "CQ" }
            ]
        },
        {
            title: "Interview & Evidence",
            links: [
                { label: "Interview Coach", path: "Placement/interview.html", icon: "IV" },
                { label: "Resume & Project Evidence", path: "Placement/evidence-lab.html", icon: "CV" },
                { label: "My Progress", path: "Placement/progress.html", icon: "%" }
            ]
        }
    ];

    const footerGroups = [
        {
            title: "Quick Links",
            links: [
                { label: "Home", path: "index.html" },
                { label: "Placement", path: "Placement/index.html" },
                { label: "Overall Progress", path: "Placement/progress.html" }
            ]
        },
        {
            title: "Learning",
            links: [
                { label: "Mathematics", path: "Maths/index.html" },
                { label: "C Programming", path: "C-Programming/index.html" },
                { label: "Python", path: "Python/index.html" },
                { label: "Java", path: "Java/index.html" },
                { label: "Data Structures", path: "Data-Structures/index.html" },
                { label: "AI & Machine Learning", path: "AI-ML/index.html" }
            ]
        },
        {
            title: "Core CS & Web",
            links: [
                { label: "Advanced Data Structures", path: "Advanced-Data-Structures/index.html" },
                { label: "DBMS & SQL", path: "DBMS/index.html" },
                { label: "Operating Systems", path: "Operating-Systems/index.html" },
                { label: "Full Stack MERN", path: "Full-Stack/index.html" },
                { label: "Web-Technologies", path: "Web-Technologies/introduction.html", icon: "WT" }
            ]
        },
        {
            title: "Practice",
            links: [
                { label: "Online Compiler", path: "Online-Compiler/" },
                { label: "Programs Library", path: "Programs/index.html" },
                { label: "Practice Hub", path: "Placement/practice.html" },
                { label: "MCQ Library", path: "Placement/mcq-library.html" },
                { label: "Coding Arena", path: "Placement/coding.html" },
                { label: "Mock Drive", path: "Placement/mock-drive.html" },
                { label: "Interview Coach", path: "Placement/interview.html" },
                { label: "Evidence Lab", path: "Placement/evidence-lab.html" }
            ]
        }
    ];

    function siteUrl(path) {
        return new URL(path, siteRoot).href;
    }

    function createElement(tag, className, text) {
        const element = document.createElement(tag);
        if (className) {
            element.className = className;
        }
        if (text !== undefined) {
            element.textContent = text;
        }
        return element;
    }

    function buildBrand() {
        const brand = createElement("a", "logo codebhavya-new-logo");
        brand.href = siteUrl("index.html");
        brand.setAttribute("aria-label", "CodeBhavya home");

        const image = createElement("img", "main-logo");
        image.src = siteUrl("images/codebhavya-main-logo.png");
        image.alt = "CodeBhavya Logo";

        const name = createElement("span", "brand-name");
        name.append(
            createElement("span", "logo-code", "Code"),
            createElement("span", "logo-bhavya", "Bhavya")
        );
        brand.append(image, name);
        return brand;
    }

    function addNavigationStyles() {
        if (document.querySelector("link[data-codebhavya-navigation]")) {
            return;
        }

        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = siteUrl("site-navigation.css?v=5");
        link.dataset.codebhavyaNavigation = "true";
        document.head.append(link);
    }

    function appendCourseLink(parent, item) {
        const link = createElement("a");
        link.href = siteUrl(item.path);
        const icon = createElement("span", "cb-menu-icon", item.icon);
        icon.setAttribute("aria-hidden", "true");
        link.append(icon, createElement("span", "cb-menu-label", item.label));
        parent.append(link);
    }

    function buildPanel(id, title, description, groups, className) {
        const panel = createElement("div", "cb-menu-panel");
        panel.id = id;
        panel.hidden = true;

        const intro = createElement("div", "cb-menu-intro");
        intro.append(
            createElement("strong", "", title),
            createElement("span", "", description)
        );
        panel.append(intro);

        const grid = createElement("div", "cb-menu-grid" + (className ? " " + className : ""));
        groups.forEach(function (group) {
            const section = createElement("section", "cb-menu-group");
            section.append(createElement("h2", "", group.title));
            group.links.forEach(function (item) {
                appendCourseLink(section, item);
            });
            if (group.comingSoon) {
                const coming = createElement("div", "cb-coming-soon");
                coming.append(
                    createElement("span", "", group.comingSoon),
                    createElement("small", "", "Coming next")
                );
                section.append(coming);
            }
            grid.append(section);
        });
        panel.append(grid);
        return panel;
    }

    function currentSection() {
        const path = decodeURIComponent(window.location.pathname).toLowerCase();
        if (path.includes("/placement/progress")) {
            return "progress";
        }
        if (path.includes("/placement/")) {
            return path.endsWith("/placement/") || path.endsWith("/placement/index.html")
                ? "placement"
                : "practice";
        }
        if (["/maths/", "/c-programming/", "/programs/", "/data-structures/", "/advanced-data-structures/", "/python/", "/ai-ml/", "/dbms/", "/operating-systems/"].some(function (part) {
            return path.includes(part);
        })) {
            return "learn";
        }
        return "home";
    }

    function enhanceNavigation() {
        let header = document.querySelector(".top-header");

        if (!header) {
            header = createElement("header", "top-header");
            document.body.insertBefore(header, document.body.firstChild);
        }

        const existingBrand = header.querySelector(".logo");
        const brand = buildBrand();
        if (existingBrand) {
            existingBrand.replaceWith(brand);
        } else {
            header.prepend(brand);
        }

        const existingNav = header.querySelector(".top-nav");

        if (existingNav && existingNav.dataset.codebhavyaNavigation === "true") {
            header.classList.add("cb-nav-ready");
            return;
        }

        addNavigationStyles();

        const activeSection = currentSection();
        const nav = createElement("nav", "top-nav cb-site-nav");
        nav.setAttribute("aria-label", "Main navigation");
        nav.dataset.codebhavyaNavigation = "true";

        const mobileToggle = createElement("button", "cb-menu-toggle");
        mobileToggle.type = "button";
        mobileToggle.setAttribute("aria-label", "Open navigation");
        mobileToggle.setAttribute("aria-controls", "cbPrimaryNavigation");
        mobileToggle.setAttribute("aria-expanded", "false");
        mobileToggle.append(createElement("span", "cb-menu-toggle-lines"));

        const links = createElement("div", "cb-nav-links");
        links.id = "cbPrimaryNavigation";
        links.dataset.open = "false";

        const home = createElement("a", "cb-nav-link" + (activeSection === "home" ? " is-active" : ""), "Home");
        home.href = siteUrl("index.html");
        if (activeSection === "home") {
            home.setAttribute("aria-current", "page");
        }
        links.append(home);

        function addDropdown(label, key, panel) {
            const item = createElement("div", "cb-nav-item");
            const trigger = createElement("button", "cb-nav-trigger" + (activeSection === key ? " is-active" : ""), label);
            trigger.type = "button";
            trigger.setAttribute("aria-expanded", "false");
            trigger.setAttribute("aria-controls", panel.id);
            item.append(trigger, panel);
            links.append(item);
            return { trigger: trigger, panel: panel };
        }

        const dropdowns = [
            addDropdown("Learn", "learn", buildPanel(
                "cbLearnMenu",
                "Choose a learning path",
                "Structured courses from foundations to placement-ready application.",
                learningGroups,
                ""
            )),
            addDropdown("Practice", "practice", buildPanel(
                "cbPracticeMenu",
                "Choose how you want to practise",
                "Review concepts, assess yourself, code and strengthen interview evidence.",
                practiceGroups,
                "practice"
            ))
        ];

        const placement = createElement("a", "cb-nav-link" + (activeSection === "placement" ? " is-active" : ""), "Placement");
        placement.href = siteUrl("Placement/index.html");
        const progress = createElement("a", "cb-nav-link cb-nav-cta" + (activeSection === "progress" ? " is-active" : ""), "My Progress");
        progress.href = siteUrl("Placement/progress.html");
        if (activeSection === "placement") {
            placement.setAttribute("aria-current", "page");
        }
        if (activeSection === "progress") {
            progress.setAttribute("aria-current", "page");
        }
        links.append(placement, progress);

        function closeDropdowns(except) {
            dropdowns.forEach(function (item) {
                if (item !== except) {
                    item.panel.hidden = true;
                    item.trigger.setAttribute("aria-expanded", "false");
                }
            });
        }

        dropdowns.forEach(function (item) {
            let hoverCloseTimer = 0;

            function openDropdown() {
                window.clearTimeout(hoverCloseTimer);
                closeDropdowns(item);
                item.panel.hidden = false;
                item.trigger.setAttribute("aria-expanded", "true");
            }

            function closeHoveredDropdown() {
                window.clearTimeout(hoverCloseTimer);
                hoverCloseTimer = window.setTimeout(function () {
                    item.panel.hidden = true;
                    item.trigger.setAttribute("aria-expanded", "false");
                }, 160);
            }

            item.trigger.addEventListener("click", function () {
                const willOpen = item.panel.hidden;
                closeDropdowns(item);
                item.panel.hidden = !willOpen;
                item.trigger.setAttribute("aria-expanded", String(willOpen));
            });
            item.trigger.addEventListener("keydown", function (event) {
                if (event.key === "ArrowDown") {
                    event.preventDefault();
                    closeDropdowns(item);
                    item.panel.hidden = false;
                    item.trigger.setAttribute("aria-expanded", "true");
                    const firstLink = item.panel.querySelector("a");
                    if (firstLink) {
                        firstLink.focus();
                    }
                }
            });

            if (window.matchMedia && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
                item.trigger.parentElement.addEventListener("mouseenter", openDropdown);
                item.trigger.parentElement.addEventListener("mouseleave", closeHoveredDropdown);
                item.panel.addEventListener("mouseenter", function () {
                    window.clearTimeout(hoverCloseTimer);
                });
            }
        });

        mobileToggle.addEventListener("click", function () {
            const willOpen = links.dataset.open !== "true";
            links.dataset.open = String(willOpen);
            mobileToggle.setAttribute("aria-expanded", String(willOpen));
            mobileToggle.setAttribute("aria-label", willOpen ? "Close navigation" : "Open navigation");
            if (!willOpen) {
                closeDropdowns();
            }
        });

        document.addEventListener("click", function (event) {
            if (!header.contains(event.target)) {
                closeDropdowns();
            }
        });

        document.addEventListener("keydown", function (event) {
            if (event.key === "Escape") {
                closeDropdowns();
                links.dataset.open = "false";
                mobileToggle.setAttribute("aria-expanded", "false");
                mobileToggle.setAttribute("aria-label", "Open navigation");
            }
        });

        nav.append(mobileToggle, links);
        // Course scripts still update IDs on the original navigation links.
        // Retain those nodes as hidden compatibility hooks when enhancing the header.
        // Removing them makes page initialization fail before filters and buttons bind.
        const navigationHooks = document.createElement("div");
        navigationHooks.hidden = true;
        navigationHooks.setAttribute("aria-hidden", "true");
        navigationHooks.setAttribute("inert", "");
        navigationHooks.style.setProperty("display", "none", "important");
        navigationHooks.className = "cb-navigation-hooks";
        if (existingNav) {
            while (existingNav.firstChild) navigationHooks.append(existingNav.firstChild);
            existingNav.replaceWith(nav);
            header.append(navigationHooks);
        } else {
            header.append(nav);
        }
        header.classList.add("cb-nav-ready");
    }

    function enhanceFooter() {
        const footer = createElement("footer", "footer cb-global-footer");
        footer.setAttribute("aria-label", "CodeBhavya footer");

        const container = createElement("div", "footer-container cb-footer-container");
        const brandSection = createElement("div", "footer-brand-section");
        const footerBrand = createElement("div", "footer-brand");
        footerBrand.append(
            createElement("span", "footer-code", "Code"),
            createElement("span", "footer-bhavya", "Bhavya")
        );
        brandSection.append(
            footerBrand,
            createElement("p", "footer-tagline", "From Learning to Limitless Possibilities."),
            createElement("p", "footer-description", "Learn, practise, build and grow with structured learning resources.")
        );
        container.append(brandSection);

        footerGroups.forEach(function (group) {
            const column = createElement("section", "footer-column");
            column.append(createElement("h2", "", group.title));
            group.links.forEach(function (item) {
                const link = createElement("a", "", item.label);
                link.href = siteUrl(item.path);
                column.append(link);
            });
            container.append(column);
        });

        const bottom = createElement("div", "footer-bottom");
        bottom.append(
            createElement("p", "", "© 2026 CodeBhavya. All Rights Reserved."),
            createElement("p", "", "From Learning to Limitless Possibilities.")
        );
        footer.append(container, bottom);

        const existingFooter = document.querySelector(".footer");
        if (existingFooter) {
            existingFooter.remove();
        }
        document.body.append(footer);
        document.body.classList.add("cb-global-shell");
    }

    function enhanceSiteShell() {
        addNavigationStyles();
        enhanceNavigation();
        enhanceFooter();
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", enhanceSiteShell, { once: true });
    } else {
        enhanceSiteShell();
    }

})();

/* Shared mobile course drawer, loaded only on supported course pages. */
if (/^\/(?:C-Programming|Maths|Data-Structures|Advanced-Data-Structures|Python|AI-ML|DBMS|Operating-Systems|Java|Full-Stack)\//.test(location.pathname) && !document.querySelector('script[data-cb-course-drawer]')) {
  const courseDrawer = document.createElement('script');
  courseDrawer.src = new URL('course-mobile-sidebar.js?v=3', document.currentScript?.src || location.href).href;
  courseDrawer.dataset.cbCourseDrawer = '';
  document.head.append(courseDrawer);
}
