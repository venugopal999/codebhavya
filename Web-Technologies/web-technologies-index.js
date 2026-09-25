"use strict";

/*
=========================================================
CODEBHAVYA WEB TECHNOLOGIES
Index + Header + Sidebar + Footer Loader
=========================================================
*/

document.addEventListener("DOMContentLoaded", function () {

    loadComponent(
        "cb-header",
        "header.html"
    );

    loadComponent(
        "cb-sidebar",
        "sidebar.html"
    );

    loadComponent(
        "cb-footer",
        "footer.html"
    );

    setupMobileSidebar();
});


/* =========================================================
   LOAD HTML COMPONENT
========================================================= */

async function loadComponent(targetId, filePath) {

    const target = document.getElementById(targetId);

    if (!target) {
        return;
    }

    try {

        const response = await fetch(filePath, {
            cache: "no-cache"
        });

        if (!response.ok) {
            throw new Error(
                "Unable to load " + filePath
            );
        }

        const html = await response.text();

        target.innerHTML = html;

        target.dispatchEvent(
            new CustomEvent("componentloaded", {
                detail: {
                    file: filePath
                }
            })
        );

        if (filePath === "header.html") {
            setupMobileMenu();
        }

    } catch (error) {

        console.error(
            "CodeBhavya component error:",
            error
        );

        target.innerHTML = "";

    }
}


/* =========================================================
   MOBILE HEADER MENU
========================================================= */

function setupMobileMenu() {

    const button =
        document.getElementById(
            "wtMobileMenuBtn"
        );

    const menu =
        document.getElementById(
            "wtMobileMenu"
        );

    if (!button || !menu) {
        return;
    }

    button.addEventListener(
        "click",
        function () {

            const isOpen =
                button.getAttribute(
                    "aria-expanded"
                ) === "true";

            button.setAttribute(
                "aria-expanded",
                String(!isOpen)
            );

            menu.hidden = isOpen;

            button.innerHTML =
                isOpen
                    ? "☰ <span>Menu</span>"
                    : "✕ <span>Close</span>";

        }
    );


    menu.querySelectorAll("a")
        .forEach(function (link) {

            link.addEventListener(
                "click",
                function () {

                    button.setAttribute(
                        "aria-expanded",
                        "false"
                    );

                    menu.hidden = true;

                    button.innerHTML =
                        "☰ <span>Menu</span>";

                }
            );

        });

}


/* =========================================================
   MOBILE SIDEBAR
========================================================= */

function setupMobileSidebar() {

    const sidebar =
        document.getElementById(
            "cb-sidebar"
        );

    if (!sidebar) {
        return;
    }

    sidebar.addEventListener(
        "componentloaded",
        function () {

            const levels =
                sidebar.querySelectorAll(
                    ".wt-sidebar-level.available"
                );

            levels.forEach(function (item) {

                item.addEventListener(
                    "click",
                    function () {

                        levels.forEach(
                            function (other) {

                                other.classList.remove(
                                    "current"
                                );

                            }
                        );

                        item.classList.add(
                            "current"
                        );

                    }
                );

            });

        }
    );

}


/* =========================================================
   SMOOTH SCROLL
========================================================= */

document.addEventListener(
    "click",
    function (event) {

        const link =
            event.target.closest(
                'a[href^="#"]'
            );

        if (!link) {
            return;
        }

        const targetId =
            link.getAttribute("href");

        if (
            !targetId ||
            targetId === "#"
        ) {
            return;
        }

        const target =
            document.querySelector(
                targetId
            );

        if (!target) {
            return;
        }

        event.preventDefault();

        target.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    }
);
