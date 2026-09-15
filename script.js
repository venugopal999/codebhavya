/*  =========================================================
CODEBHAVYA — GLOBAL SCRIPT
script.js
========================================================= */

(function () {

"use strict";


/* =====================================================
   1. SOLUTION TOGGLE
   ===================================================== */

window.toggleSolution = function (id) {

    const element = document.getElementById(id);

    if (!element) {
        return;
    }

    if (element.style.display === "block") {
        element.style.display = "none";
    } else {
        element.style.display = "block";
    }
};


/* =====================================================
   2. SIDEBAR SEARCH
   ===================================================== */

window.searchTopics = function () {

    const input =
        document.getElementById("topicSearch");

    if (!input) {
        return;
    }

    const searchText =
        input.value.toLowerCase().trim();

    const links =
        document.querySelectorAll(".sidebar a");

    links.forEach(function (link) {

        const text =
            link.textContent.toLowerCase();

        if (text.includes(searchText)) {

            link.style.display = "block";

        } else {

            link.style.display = "none";

        }

    });
};


/* =====================================================
   3. SIDEBAR / FOOTER POSITIONING
   ===================================================== */

function initializeSidebarBehavior() {

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


    function updateSidebarHeight() {

        const width =
            window.innerWidth;

        /*
           Mobile:
           Sidebar becomes a normal full-width block.
        */

        if (width <= 768) {

            sidebar.style.height = "auto";
            sidebar.style.maxHeight = "none";

            return;
        }


        /*
           Desktop:
           Sticky sidebar occupies the available
           viewport below the fixed header.
        */

        const headerHeight =
            header
                ? header.getBoundingClientRect().height
                : 72;

        sidebar.style.top =
            headerHeight + "px";

        sidebar.style.height =
            "calc(100vh - " +
            headerHeight +
            "px)";

        sidebar.style.maxHeight =
            "calc(100vh - " +
            headerHeight +
            "px)";
    }


    updateSidebarHeight();


    window.addEventListener(
        "resize",
        updateSidebarHeight,
        {
            passive: true
        }
    );
}


/* =====================================================
   4. CODEBHAVYA GLOBAL MEGA NAVIGATION
   ===================================================== */

const learningGroups = [

    {
        title: "Programming",
        items: [

            {
                label: "C Programming",
                path: "C-Programming/index.html",
                icon: "C"
            },

            {
                label: "Python",
                path: "Python/index.html",
                icon: "Py"
            },

            {
                label: "Java",
                path: "Java/index.html",
                icon: "J"
            },

            {
                label: "Programs Library",
                path: "Programs/index.html",
                icon: "{}"
            }

        ]
    },


    {
        title: "Data & Algorithms",
        items: [

            {
                label: "Data Structures",
                path: "Data-Structures/index.html",
                icon: "DS"
            },

            {
                label: "Advanced Data Structures",
                path: "Advanced-Data-Structures/index.html",
                icon: "AD"
            }

        ]
    },


    {
        title: "AI & Mathematics",
        items: [

            {
                label: "Mathematics",
                path: "Maths/index.html",
                icon: "M"
            },

            {
                label: "AI & ML",
                path: "AI-ML/index.html",
                icon: "AI"
            }

        ]
    },


    {
        title: "Core Computer Science & Web Development",
        items: [

            {
                label: "DBMS & SQL",
                path: "DBMS/index.html",
                icon: "DB"
            },

            {
                label: "Operating Systems",
                path: "Operating-Systems/index.html",
                icon: "OS"
            },

            {
                label: "Full Stack MERN",
                path: "Full-Stack/index.html",
                icon: "FSM"
            },

            {
                label: "Core CS Practice",
                path: "Placement/mcq-library.html?topic=core-cs",
                icon: "CS"
            },

            {
                label: "Scenario Problem Lab",
                path: "Placement/core-cs-problems.html",
                icon: "Lab"
            }

        ]
    }

];


const practiceGroups = [

    {
        title: "Learn & Review",
        items: [

            {
                label: "Practice Hub",
                path: "Placement/practice.html",
                icon: "Hub"
            },

            {
                label: "MCQ Learning Library",
                path: "Placement/mcq-library.html?topic=c",
                icon: "MCQ"
            },

            {
                label: "Company Preparation",
                path: "Placement/company-prep.html",
                icon: "Co"
            }

        ]
    },


    {
        title: "Assess & Code",
        items: [

            {
                label: "Timed Quiz",
                path: "Placement/quiz.html?topic=c",
                icon: "Q"
            },

            {
                label: "Coding Arena",
                path: "Placement/coding.html?topic=c",
                icon: "</>"
            },

            {
                label: "Online Compiler",
                path: "Online-Compiler/",
                icon: "Run"
            },

            {
                label: "Complete Mock Drive",
                path: "Placement/mock-drive.html",
                icon: "4R"
            }

        ]
    },


    {
        title: "Interview & Evidence",
        items: [

            {
                label: "Interview Coach",
                path: "Placement/interview.html",
                icon: "IV"
            },

            {
                label: "Resume & Project Evidence",
                path: "Placement/evidence-lab.html",
                icon: "CV"
            },

            {
                label: "My Progress",
                path: "Placement/progress.html",
                icon: "%"
            }

        ]
    }

];


/* =====================================================
   5. ROOT URL
   ===================================================== */

function getSiteRoot() {

    return new URL(
        "/",
        window.location.origin
    );
}


const siteRoot = getSiteRoot();


function siteUrl(path) {

    return new URL(
        path,
        siteRoot
    ).href;
}


/* =====================================================
   6. LOAD COMMON NAVIGATION CSS
   ===================================================== */

function addNavigationStyles() {

    if (
        document.getElementById(
            "codebhavya-navigation-css"
        )
    ) {
        return;
    }

    const link =
        document.createElement("link");

    link.id =
        "codebhavya-navigation-css";

    link.rel =
        "stylesheet";

    link.href =
        siteUrl(
            "site-navigation.css?v=4"
        );

    document.head.appendChild(link);
}


/* =====================================================
   7. CURRENT SECTION
   ===================================================== */

function currentSection() {

    const path =
        window.location.pathname
            .toLowerCase()
            .replace(/\/+/g, "/");


    if (
        path.includes(
            "/placement/progress"
        )
    ) {
        return "progress";
    }


    if (
        path === "/placement/" ||
        path.endsWith("/placement/index.html")
    ) {
        return "placement";
    }


    if (
        path.includes("/placement/")
    ) {
        return "practice";
    }


    if (
        path.includes("/maths/") ||
        path.includes("/c-programming/") ||
        path.includes("/programs/") ||
        path.includes("/data-structures/") ||
        path.includes("/advanced-data-structures/") ||
        path.includes("/python/") ||
        path.includes("/java/") ||
        path.includes("/ai-ml/") ||
        path.includes("/dbms/") ||
        path.includes("/operating-systems/") ||
        path.includes("/full-stack/")
    ) {
        return "learn";
    }


    return "home";
}


/* =====================================================
   8. CREATE NAV ICON
   ===================================================== */

function createNavIcon(text) {

    const icon =
        document.createElement("span");

    icon.className =
        "cb-nav-icon";

    icon.textContent =
        text;

    return icon;
}


/* =====================================================
   9. CREATE NAV LINK
   ===================================================== */

function createNavLink(item) {

    const link =
        document.createElement("a");

    link.className =
        "cb-nav-card";

    link.href =
        siteUrl(item.path);

    link.setAttribute(
        "data-nav-label",
        item.label
    );


    const icon =
        createNavIcon(item.icon);


    const text =
        document.createElement("span");

    text.className =
        "cb-nav-card-text";

    text.textContent =
        item.label;


    link.appendChild(icon);
    link.appendChild(text);


    return link;
}


/* =====================================================
   10. BUILD MEGA PANEL
   ===================================================== */

function buildPanel(id, groups) {

    const panel =
        document.createElement("div");

    panel.className =
        "cb-mega-panel";

    panel.id =
        id;

    panel.setAttribute(
        "role",
        "menu"
    );


    groups.forEach(function (group) {

        const section =
            document.createElement("section");

        section.className =
            "cb-mega-section";


        const heading =
            document.createElement("h3");

        heading.className =
            "cb-mega-section-title";

        heading.textContent =
            group.title;


        const grid =
            document.createElement("div");

        grid.className =
            "cb-mega-grid";


        group.items.forEach(function (item) {

            grid.appendChild(
                createNavLink(item)
            );

        });


        section.appendChild(
            heading
        );

        section.appendChild(
            grid
        );

        panel.appendChild(
            section
        );

    });


    return panel;
}


/* =====================================================
   11. CREATE DROPDOWN BUTTON
   ===================================================== */

function createDropdownButton(
    label,
    panel
) {

    const wrapper =
        document.createElement("div");

    wrapper.className =
        "cb-nav-dropdown";


    const button =
        document.createElement("button");

    button.type =
        "button";

    button.className =
        "cb-nav-link cb-dropdown-trigger";

    button.setAttribute(
        "aria-haspopup",
        "true"
    );

    button.setAttribute(
        "aria-expanded",
        "false"
    );


    const labelSpan =
        document.createElement("span");

    labelSpan.textContent =
        label;


    const arrow =
        document.createElement("span");

    arrow.className =
        "cb-dropdown-arrow";

    arrow.textContent =
        "▾";

    arrow.setAttribute(
        "aria-hidden",
        "true"
    );


    button.appendChild(
        labelSpan
    );

    button.appendChild(
        arrow
    );


    wrapper.appendChild(
        button
    );

    wrapper.appendChild(
        panel
    );


    function openDropdown() {

        closeAllDropdowns(
            wrapper
        );

        wrapper.classList.add(
            "cb-dropdown-open"
        );

        button.setAttribute(
            "aria-expanded",
            "true"
        );
    }


    function closeDropdown() {

        wrapper.classList.remove(
            "cb-dropdown-open"
        );

        button.setAttribute(
            "aria-expanded",
            "false"
        );
    }


    button.addEventListener(
        "click",
        function (event) {

            event.preventDefault();

            if (
                wrapper.classList.contains(
                    "cb-dropdown-open"
                )
            ) {
                closeDropdown();
            } else {
                openDropdown();
            }
        }
    );


    wrapper.addEventListener(
        "mouseenter",
        function () {

            if (
                window.innerWidth > 768
            ) {
                openDropdown();
            }
        }
    );


    wrapper.addEventListener(
        "mouseleave",
        function () {

            if (
                window.innerWidth > 768
            ) {
                closeDropdown();
            }
        }
    );


    return wrapper;
}


/* =====================================================
   12. CLOSE DROPDOWNS
   ===================================================== */

function closeAllDropdowns(
    exceptWrapper
) {

    document
        .querySelectorAll(
            ".cb-nav-dropdown"
        )
        .forEach(function (dropdown) {

            if (
                dropdown === exceptWrapper
            ) {
                return;
            }


            dropdown.classList.remove(
                "cb-dropdown-open"
            );


            const button =
                dropdown.querySelector(
                    ".cb-dropdown-trigger"
                );

            if (button) {

                button.setAttribute(
                    "aria-expanded",
                    "false"
                );
            }

        });
}


/* =====================================================
   13. BUILD GLOBAL NAVIGATION
   ===================================================== */

function enhanceNavigation() {

    const header =
        document.querySelector(
            ".top-header"
        );

    if (!header) {
        return;
    }


    /*
       Prevent duplicate initialization.
    */

    if (
        header.dataset.cbNavigationReady ===
        "true"
    ) {
        return;
    }


    const existingNav =
        header.querySelector(
            ".top-nav"
        );


    if (!existingNav) {
        return;
    }


    addNavigationStyles();


    const section =
        currentSection();


    /* =================================================
       CREATE NEW NAV
       ================================================= */

    const nav =
        document.createElement("nav");

    nav.className =
        "top-nav cb-site-nav";

    nav.setAttribute(
        "aria-label",
        "Main Navigation"
    );


    /* =================================================
       MOBILE TOGGLE
       ================================================= */

    const menuButton =
        document.createElement("button");

    menuButton.type =
        "button";

    menuButton.className =
        "cb-menu-toggle";

    menuButton.setAttribute(
        "aria-label",
        "Open navigation menu"
    );

    menuButton.setAttribute(
        "aria-expanded",
        "false"
    );


    const menuIcon =
        document.createElement("span");

    menuIcon.className =
        "cb-menu-icon";

    menuIcon.innerHTML =
        "☰";


    menuButton.appendChild(
        menuIcon
    );


    /* =================================================
       NAV LINKS CONTAINER
       ================================================= */

    const navLinks =
        document.createElement("div");

    navLinks.className =
        "cb-nav-links";


    /* =================================================
       HOME
       ================================================= */

    const homeLink =
        document.createElement("a");

    homeLink.className =
        "cb-nav-link";

    homeLink.href =
        siteUrl("index.html");

    homeLink.textContent =
        "Home";


    if (section === "home") {

        homeLink.classList.add(
            "cb-active"
        );
    }


    navLinks.appendChild(
        homeLink
    );


    /* =================================================
       LEARN
       ================================================= */

    const learnPanel =
        buildPanel(
            "cbLearnMenu",
            learningGroups
        );


    const learnDropdown =
        createDropdownButton(
            "Learn",
            learnPanel
        );


    if (section === "learn") {

        learnDropdown.classList.add(
            "cb-section-active"
        );
    }


    navLinks.appendChild(
        learnDropdown
    );


    /* =================================================
       PRACTICE
       ================================================= */

    const practicePanel =
        buildPanel(
            "cbPracticeMenu",
            practiceGroups
        );


    const practiceDropdown =
        createDropdownButton(
            "Practice",
            practicePanel
        );


    if (
        section === "practice"
    ) {

        practiceDropdown.classList.add(
            "cb-section-active"
        );
    }


    navLinks.appendChild(
        practiceDropdown
    );


    /* =================================================
       PLACEMENT
       ================================================= */

    const placementLink =
        document.createElement("a");

    placementLink.className =
        "cb-nav-link";

    placementLink.href =
        siteUrl(
            "Placement/"
        );

    placementLink.textContent =
        "Placement";


    if (
        section === "placement"
    ) {

        placementLink.classList.add(
            "cb-active"
        );
    }


    navLinks.appendChild(
        placementLink
    );


    /* =================================================
       MY PROGRESS
       ================================================= */

    const progressLink =
        document.createElement("a");

    progressLink.className =
        "cb-nav-link";

    progressLink.href =
        siteUrl(
            "Placement/progress.html"
        );

    progressLink.textContent =
        "My Progress";


    if (
        section === "progress"
    ) {

        progressLink.classList.add(
            "cb-active"
        );
    }


    navLinks.appendChild(
        progressLink
    );


    /* =================================================
       ADD TO NAV
       ================================================= */

    nav.appendChild(
        navLinks
    );

    nav.appendChild(
        menuButton
    );


    /* =================================================
       MOBILE MENU
       ================================================= */

    menuButton.addEventListener(
        "click",
        function () {

            const isOpen =
                nav.classList.contains(
                    "cb-mobile-open"
                );


            if (isOpen) {

                nav.classList.remove(
                    "cb-mobile-open"
                );

                menuButton.setAttribute(
                    "aria-expanded",
                    "false"
                );

                menuButton.setAttribute(
                    "aria-label",
                    "Open navigation menu"
                );

            } else {

                nav.classList.add(
                    "cb-mobile-open"
                );

                menuButton.setAttribute(
                    "aria-expanded",
                    "true"
                );

                menuButton.setAttribute(
                    "aria-label",
                    "Close navigation menu"
                );
            }

        }
    );


    /* =================================================
       CLOSE WHEN NAV LINK IS SELECTED ON MOBILE
       ================================================= */

    navLinks.addEventListener(
        "click",
        function (event) {

            const target =
                event.target.closest(
                    "a"
                );

            if (!target) {
                return;
            }


            if (
                window.innerWidth <= 768
            ) {

                nav.classList.remove(
                    "cb-mobile-open"
                );

                menuButton.setAttribute(
                    "aria-expanded",
                    "false"
                );
            }

        }
    );


    /* =================================================
       REPLACE OLD NAVIGATION
       ================================================= */

    const compatibilityHooks =
        document.createElement("div");

    compatibilityHooks.className =
        "cb-navigation-hooks";

    compatibilityHooks.setAttribute(
        "aria-hidden",
        "true"
    );


    while (
        existingNav.firstChild
    ) {

        compatibilityHooks.appendChild(
            existingNav.firstChild
        );
    }


    header.replaceChild(
        nav,
        existingNav
    );


    header.appendChild(
        compatibilityHooks
    );


    header.dataset.cbNavigationReady =
        "true";


    header.classList.add(
        "cb-nav-ready"
    );


    /* =================================================
       GLOBAL OUTSIDE CLICK
       ================================================= */

    if (
        !window.CodeBhavyaNavigationGlobalClick
    ) {

        document.addEventListener(
            "click",
            function (event) {

                if (
                    !event.target.closest(
                        ".cb-site-nav"
                    )
                ) {

                    closeAllDropdowns();

                }

            }
        );


        window.CodeBhavyaNavigationGlobalClick =
            true;
    }


    /* =================================================
       ESCAPE KEY
       ================================================= */

    if (
        !window.CodeBhavyaNavigationEscape
    ) {

        document.addEventListener(
            "keydown",
            function (event) {

                if (
                    event.key !== "Escape"
                ) {
                    return;
                }


                closeAllDropdowns();


                const activeNav =
                    document.querySelector(
                        ".cb-site-nav"
                    );


                if (activeNav) {

                    activeNav.classList.remove(
                        "cb-mobile-open"
                    );


                    const button =
                        activeNav.querySelector(
                            ".cb-menu-toggle"
                        );


                    if (button) {

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

            }
        );


        window.CodeBhavyaNavigationEscape =
            true;
    }
}


/* =====================================================
   14. PUBLIC NAVIGATION API
   ===================================================== */

window.CodeBhavyaNavigation = {

    init: function () {

        enhanceNavigation();

    }

};


/* =====================================================
   15. COMPONENT EVENTS
   ===================================================== */

/*
   components.js loads header.html asynchronously.

   Therefore the navigation must wait until the
   header is actually present.
*/

document.addEventListener(
    "codebhavya:headerLoaded",
    function () {

        if (
            window.CodeBhavyaNavigation
        ) {

            window.CodeBhavyaNavigation.init();

        }

    }
);


/*
   If components.js initializes navigation before
   this script is ready, this event gives us another
   safe initialization path.
*/

document.addEventListener(
    "codebhavya:navigationReady",
    function () {

        if (
            window.CodeBhavyaNavigation
        ) {

            window.CodeBhavyaNavigation.init();

        }

    }
);


/* =====================================================
   16. INITIALIZATION
   ===================================================== */

function initializeGlobalFeatures() {

    initializeSidebarBehavior();


    /*
       If the header already exists, initialize
       navigation immediately.

       This is useful for pages that temporarily
       contain the header directly in their HTML.
    */

    if (
        document.querySelector(
            ".top-header"
        )
    ) {

        enhanceNavigation();

    }

}


if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        initializeGlobalFeatures,
        {
            once: true
        }
    );

} else {

    initializeGlobalFeatures();

}

})();
