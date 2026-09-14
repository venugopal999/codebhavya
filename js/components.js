
/* =========================================================
   CODEBHAVYA COMMON COMPONENTS
   Header + Footer Loader
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    loadComponent(
        "/components/header.html",
        "site-header"
    );

    loadComponent(
        "/components/footer.html",
        "site-footer"
    );

});


/* =========================================================
   LOAD COMPONENT
   ========================================================= */

function loadComponent(file, targetId) {

    const target = document.getElementById(targetId);

    if (!target) {
        return;
    }

    fetch(file)
        .then(function (response) {

            if (!response.ok) {
                throw new Error(
                    "Unable to load component: " + file
                );
            }

            return response.text();
        })
        .then(function (html) {

            target.innerHTML = html;

            if (targetId === "site-header") {
                initializeHeader();
            }

            if (targetId === "site-footer") {
                initializeFooter();
            }

        })
        .catch(function (error) {

            console.error(
                "CodeBhavya component error:",
                error
            );

        });

}


/* =========================================================
   HEADER
   ========================================================= */

function initializeHeader() {

    const menuButton =
        document.getElementById("cb-menu-toggle");

    const navigation =
        document.getElementById("cb-navigation");

    if (!menuButton || !navigation) {
        return;
    }


    /* ---------- Mobile Menu ---------- */

    menuButton.addEventListener("click", function () {

        const isOpen =
            navigation.classList.toggle("cb-menu-open");

        menuButton.setAttribute(
            "aria-expanded",
            isOpen ? "true" : "false"
        );

    });


    /* ---------- Close Menu After Link Click ---------- */

    const navLinks =
        navigation.querySelectorAll(".cb-nav-link");

    navLinks.forEach(function (link) {

        link.addEventListener("click", function () {

            navigation.classList.remove("cb-menu-open");

            menuButton.setAttribute(
                "aria-expanded",
                "false"
            );

        });

    });


    /* ---------- Active Page ---------- */

    setActiveNavigation();

}


/* =========================================================
   ACTIVE NAVIGATION
   ========================================================= */

function setActiveNavigation() {

    const currentPath =
        window.location.pathname
            .replace(/\/+$/, "")
            .toLowerCase();

    const links =
        document.querySelectorAll(
            "#cb-navigation .cb-nav-link"
        );

    links.forEach(function (link) {

        const href =
            link.getAttribute("href");

        if (!href) {
            return;
        }

        const linkPath =
            new URL(
                href,
                window.location.origin
            ).pathname
                .replace(/\/+$/, "")
                .toLowerCase();

        if (
            linkPath === currentPath ||
            (
                linkPath !== "/" &&
                currentPath.startsWith(linkPath)
            )
        ) {

            link.classList.add("active");

        }

    });

}


/* =========================================================
   FOOTER
   ========================================================= */

function initializeFooter() {

    const yearElement =
        document.getElementById(
            "cb-current-year"
        );

    if (yearElement) {

        yearElement.textContent =
            new Date().getFullYear();

    }

}
