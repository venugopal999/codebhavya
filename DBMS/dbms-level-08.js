(function () {
    "use strict";

    const STORAGE_KEY = "codebhavya.dbms.course.progress.v1";
    const bcnfCases = {
        "student-course": {
            determinant: "{student, course}",
            closure: "{student, course, instructor}",
            missing: "none",
            verdict: "Satisfies BCNF",
            pass: true,
            explanation: "The determinant closure contains every TEACHING attribute. It is a super key, so this non-trivial FD does not violate BCNF."
        },
        instructor: {
            determinant: "{instructor}",
            closure: "{instructor, course}",
            missing: "student",
            verdict: "Violates BCNF",
            pass: false,
            explanation: "Instructor determines course but cannot determine student. Because instructor is not a super key, this non-trivial FD violates BCNF even though course is prime and the FD passes 3NF."
        }
    };

    const safetyCases = {
        both: {
            label: "LOSSLESS + DEPENDENCY-PRESERVING",
            title: "R(A,B,C) → R₁(A,B), R₂(B,C)",
            schema: "R(A,B,C)",
            fds: "A → B; B → C",
            intersection: "R₁ ∩ R₂ = {B}. Since B → BC, the intersection determines all of R₂.",
            lossless: true,
            preservation: true,
            normal: "The projected FDs A → B and B → C are both locally enforceable.",
            conclusion: "This is the preferred outcome: information is reconstructed exactly and every original dependency can be checked without a join."
        },
        "not-preserved": {
            label: "LOSSLESS, NOT DEPENDENCY-PRESERVING",
            title: "R(A,B,C) → R₁(A,B), R₂(A,C)",
            schema: "R(A,B,C)",
            fds: "A → B; B → C",
            intersection: "R₁ ∩ R₂ = {A}. Since A → AB, the intersection determines all of R₁.",
            lossless: true,
            preservation: false,
            normal: "A → B is projected onto R₁, but B → C is contained in neither component.",
            conclusion: "The data can be reconstructed exactly, but enforcing B → C requires joining the relations. Lossless and preservation are separate tests."
        },
        lossy: {
            label: "LOSSY DECOMPOSITION",
            title: "R(A,B,C) → R₁(A,B), R₂(B,C)",
            schema: "R(A,B,C)",
            fds: "A → B",
            intersection: "R₁ ∩ R₂ = {B}. Under F, B determines neither AB nor BC.",
            lossless: false,
            preservation: true,
            normal: "A → B remains enforceable in R₁, but that alone does not protect reconstruction.",
            conclusion: "Joining the components may create spurious A–C combinations. Do not accept a decomposition merely because it preserves the visible FD."
        },
        "bcnf-tradeoff": {
            label: "BCNF TRADE-OFF",
            title: "TEACHING → INSTRUCTOR_COURSE + STUDENT_INSTRUCTOR",
            schema: "TEACHING(student, course, instructor)",
            fds: "{student, course} → instructor; instructor → course",
            intersection: "The common attribute is instructor, which determines the complete INSTRUCTOR_COURSE relation.",
            lossless: true,
            preservation: false,
            normal: "Both components satisfy BCNF, but {student, course} → instructor is not contained in either component.",
            conclusion: "The BCNF decomposition is lossless but loses direct enforcement of one original dependency. A design decision must weigh stronger form against enforcement cost."
        },
        "four-nf": {
            label: "FOURTH NORMAL FORM",
            title: "STUDENT_HOBBY_LANGUAGE → STUDENT_HOBBY + STUDENT_LANGUAGE",
            schema: "R(student, hobby, language)",
            fds: "student ↠ hobby; student ↠ language",
            intersection: "The common student attribute carries the independent hobby and language sets during reconstruction.",
            lossless: true,
            preservation: true,
            normal: "Each component stores one independent multi-valued fact and satisfies 4NF for this example.",
            conclusion: "The decomposition removes the hobby × language cross-product while allowing the original combinations to be reconstructed."
        }
    };

    const explanations = [
        "BCNF permits a non-trivial FD only when its determinant is a super key.",
        "BCNF is stronger than 3NF, so BCNF implies 3NF but the reverse is not guaranteed.",
        "Losslessness means the decomposed projections join back to exactly the original relation.",
        "For two components, their shared attributes must determine all attributes of at least one component.",
        "Dependency preservation allows each original rule to be enforced from projected dependencies without a join.",
        "The double arrow represents an independent multivalued set rather than one determined value.",
        "4NF requires the left side of every non-trivial MVD to be a super key.",
        "5NF addresses non-trivial join dependencies that are not consequences of candidate keys."
    ];

    function initBcnfLab() {
        const result = document.getElementById("bcnfLabResult");
        const buttons = Array.from(document.querySelectorAll("[data-bcnf-fd]"));
        if (!result || !buttons.length) return;
        function render(key) {
            const item = bcnfCases[key];
            result.className = "bcnf-lab-result " + (item.pass ? "is-pass" : "is-fail");
            result.innerHTML = "<span>" + item.verdict.toUpperCase() + "</span><h3>" + item.determinant + "⁺ = " + item.closure + "</h3><div class=\"closure-audit\"><p><b>Complete schema:</b> {student, course, instructor}</p><p><b>Missing from closure:</b> " + item.missing + "</p></div><p>" + item.explanation + "</p>";
            buttons.forEach(function (button) { button.setAttribute("aria-selected", String(button.dataset.bcnfFd === key)); });
        }
        buttons.forEach(function (button) { button.addEventListener("click", function () { render(button.dataset.bcnfFd); }); });
        render("student-course");
    }

    function statusCard(label, pass) {
        return "<div class=\"safety-status " + (pass ? "pass" : "fail") + "\"><span>" + label + "</span><strong>" + (pass ? "YES" : "NO") + "</strong></div>";
    }

    function initSafetyLab() {
        const result = document.getElementById("safetyResult");
        const buttons = Array.from(document.querySelectorAll("[data-safety-case]"));
        if (!result || !buttons.length) return;
        function render(key) {
            const item = safetyCases[key];
            result.innerHTML = "<header><span>" + item.label + "</span><h3>" + item.title + "</h3></header><div class=\"safety-definition\"><p><b>Original:</b> " + item.schema + "</p><p><b>Dependencies:</b> " + item.fds + "</p></div><div class=\"safety-status-grid\">" + statusCard("Lossless join", item.lossless) + statusCard("Dependency preservation", item.preservation) + "</div><div class=\"safety-reasoning\"><article><span>LOSSLESS REASONING</span><p>" + item.intersection + "</p></article><article><span>DEPENDENCY / NORMAL-FORM REASONING</span><p>" + item.normal + "</p></article></div><div class=\"safety-conclusion\"><strong>CONCLUSION</strong><p>" + item.conclusion + "</p></div>";
            buttons.forEach(function (button) { button.setAttribute("aria-selected", String(button.dataset.safetyCase === key)); });
        }
        buttons.forEach(function (button) { button.addEventListener("click", function () { render(button.dataset.safetyCase); }); });
        render("both");
    }

    function initChecks() {
        const checks = Array.from(document.querySelectorAll(".concept-check"));
        const score = document.getElementById("conceptScore");
        const answered = new Map();
        function update() {
            let correct = 0;
            answered.forEach(function (value) { if (value) correct += 1; });
            if (score) score.textContent = "Answered correctly: " + correct + " of " + checks.length;
        }
        checks.forEach(function (check, index) {
            const answer = check.dataset.answer;
            const feedback = check.querySelector(".check-feedback");
            const buttons = Array.from(check.querySelectorAll("[data-option]"));
            buttons.forEach(function (button) {
                button.addEventListener("click", function () {
                    const correct = button.dataset.option === answer;
                    answered.set(index, correct);
                    buttons.forEach(function (item) { item.classList.remove("is-correct", "is-wrong"); if (item.dataset.option === answer) item.classList.add("is-correct"); });
                    if (!correct) button.classList.add("is-wrong");
                    feedback.innerHTML = correct ? "<strong>Correct.</strong> " + explanations[index] : "Not quite. Review the highlighted answer. " + explanations[index];
                    update();
                });
            });
        });
    }

    function readProgress() {
        try { const value = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"); return Array.isArray(value) ? value.map(Number) : []; }
        catch (error) { return []; }
    }

    function initCompletion() {
        const button = document.getElementById("completeLessonButton");
        const status = document.getElementById("lessonSidebarStatus");
        if (!button) return;
        let completed = readProgress();
        function render() {
            const done = completed.indexOf(8) !== -1;
            button.classList.toggle("is-complete", done);
            button.setAttribute("aria-pressed", String(done));
            button.textContent = done ? "✓ Level 8 completed" : "Mark Level 8 complete";
            if (status) { status.textContent = done ? "Level 8 completed" : "Not completed"; status.parentElement.classList.toggle("is-complete", done); }
        }
        button.addEventListener("click", function () {
            const index = completed.indexOf(8);
            if (index === -1) completed.push(8); else completed.splice(index, 1);
            completed.sort(function (a, b) { return a - b; });
            try { localStorage.setItem(STORAGE_KEY, JSON.stringify(completed)); } catch (error) {}
            render();
        });
        render();
    }

    function initReading() {
        const bar = document.getElementById("lessonReadingBar");
        const links = Array.from(document.querySelectorAll(".lesson-section-link"));
        const sections = links.map(function (link) { return document.querySelector(link.getAttribute("href")); }).filter(Boolean);
        function update() {
            const max = document.documentElement.scrollHeight - window.innerHeight;
            const percent = max > 0 ? Math.min(100, Math.max(0, window.scrollY / max * 100)) : 0;
            if (bar) bar.style.width = percent + "%";
        }
        window.addEventListener("scroll", update, { passive: true });
        update();
        if ("IntersectionObserver" in window) {
            const observer = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (!entry.isIntersecting) return;
                    links.forEach(function (link) { link.classList.toggle("active", link.getAttribute("href") === "#" + entry.target.id); });
                });
            }, { rootMargin: "-20% 0px -70% 0px" });
            sections.forEach(function (section) { observer.observe(section); });
        }
    }

    function init() {
        initBcnfLab();
        initSafetyLab();
        initChecks();
        initCompletion();
        initReading();
    }

    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true });
    else init();
}());
