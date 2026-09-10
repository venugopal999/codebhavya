(function () {
    "use strict";

    const STORAGE_KEY = "codebhavya.dbms.course.progress.v1";
    const baseRows = [
        ["101", "Anu", "D10", "CSE", "C101", "DBMS", "A"],
        ["101", "Anu", "D10", "CSE", "C102", "C Programming", "B"],
        ["102", "Bala", "D10", "CSE", "C101", "DBMS", "B"],
        ["103", "Charan", "D20", "AIML", "C103", "Python", "A"]
    ];

    const explanations = [
        "An update anomaly occurs when one fact is duplicated and every copy must be updated consistently.",
        "1NF requires atomic cell values and removes repeating groups such as course_1, course_2 or a comma-separated list.",
        "student_name depends on student_id, which is only part of the composite enrolment key.",
        "2NF removes partial dependencies after the relation already satisfies 1NF.",
        "The key determines dept_id, which then determines dept_name, creating a transitive path.",
        "A 2NF relation without a transitive non-key dependency satisfies 3NF under the learning test.",
        "A proper subset cannot exist for a one-attribute key, so partial dependency on that key is impossible.",
        "Good decomposition follows real dependencies and must later be checked for lossless join and dependency preservation."
    ];

    const stages = ["unf", "1nf", "2nf", "3nf"];
    const stageContent = {
        unf: {
            badge: "UNNORMALIZED FORM",
            title: "Repeating course groups live inside each student record",
            copy: "Courses and grades are multi-valued groups. The design cannot reliably filter, constrain or update one course occurrence.",
            issue: "First correction: convert each repeated course occurrence into a separate row with atomic values.",
            tables: [
                { name: "STUDENT_COURSES", columns: ["student_id", "student_name", "courses", "grades"], rows: [["101", "Anu", "{C101, C102}", "{A, B}"], ["102", "Bala", "{C101}", "{B}"]] }
            ]
        },
        "1nf": {
            badge: "FIRST NORMAL FORM",
            title: "Values are atomic, but independent facts still repeat",
            copy: "The composite key is {student_id, course_id}. Student facts repeat for every course and course facts repeat for every student.",
            issue: "Remaining violation: partial dependencies on student_id and course_id prevent 2NF.",
            dependencies: ["student_id → student_name, dept_id, dept_name", "course_id → course_title, instructor", "student_id, course_id → grade"],
            tables: [
                { name: "ENROLMENT_RECORD", columns: ["student_id", "course_id", "student_name", "dept_id", "dept_name", "course_title", "grade"], rows: [["101", "C101", "Anu", "D10", "CSE", "DBMS", "A"], ["101", "C102", "Anu", "D10", "CSE", "C Programming", "B"], ["102", "C101", "Bala", "D10", "CSE", "DBMS", "B"]] }
            ]
        },
        "2nf": {
            badge: "SECOND NORMAL FORM",
            title: "Partial dependencies have their own relations",
            copy: "Student facts depend on student_id, course facts depend on course_id, and grade depends on the full enrolment key.",
            issue: "Remaining violation: STUDENT_2NF contains student_id → dept_id → dept_name, a transitive dependency.",
            dependencies: ["student_id → student_name, dept_id, dept_name", "course_id → course_title, instructor", "student_id, course_id → grade"],
            tables: [
                { name: "STUDENT_2NF", columns: ["student_id (PK)", "student_name", "dept_id", "dept_name"], rows: [["101", "Anu", "D10", "CSE"], ["102", "Bala", "D10", "CSE"]] },
                { name: "COURSE", columns: ["course_id (PK)", "course_title", "instructor"], rows: [["C101", "DBMS", "Meera"], ["C102", "C Programming", "Kiran"]] },
                { name: "ENROLMENT", columns: ["student_id (PK, FK)", "course_id (PK, FK)", "grade"], rows: [["101", "C101", "A"], ["101", "C102", "B"], ["102", "C101", "B"]] }
            ]
        },
        "3nf": {
            badge: "THIRD NORMAL FORM",
            title: "Every independent fact is stored with its determinant",
            copy: "Department is separated because dept_id—not student_id—directly determines dept_name. Foreign keys preserve the relationships.",
            issue: "Result: no partial or transitive dependency remains in these relations. Level 8 will test decomposition safety and stronger normal forms.",
            dependencies: ["student_id → student_name, dept_id", "dept_id → dept_name", "course_id → course_title, instructor", "student_id, course_id → grade"],
            tables: [
                { name: "STUDENT", columns: ["student_id (PK)", "student_name", "dept_id (FK)"], rows: [["101", "Anu", "D10"], ["102", "Bala", "D10"]] },
                { name: "DEPARTMENT", columns: ["dept_id (PK)", "dept_name"], rows: [["D10", "CSE"], ["D20", "AIML"]] },
                { name: "COURSE", columns: ["course_id (PK)", "course_title", "instructor"], rows: [["C101", "DBMS", "Meera"], ["C102", "C Programming", "Kiran"]] },
                { name: "ENROLMENT", columns: ["student_id (PK, FK)", "course_id (PK, FK)", "grade"], rows: [["101", "C101", "A"], ["101", "C102", "B"], ["102", "C101", "B"]] }
            ]
        }
    };

    function escapeHtml(value) {
        return String(value).replace(/[&<>"']/g, function (character) {
            return { "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;" }[character];
        });
    }

    function renderRows(rows, highlighted) {
        return rows.map(function (row, index) {
            const className = highlighted && highlighted.indexOf(index) !== -1 ? " class=\"is-anomaly\"" : "";
            return "<tr" + className + ">" + row.map(function (cell) { return "<td>" + escapeHtml(cell) + "</td>"; }).join("") + "</tr>";
        }).join("");
    }

    function initAnomalyLab() {
        const body = document.getElementById("anomalyTableBody");
        const explanation = document.getElementById("anomalyExplanation");
        const buttons = Array.from(document.querySelectorAll("[data-anomaly]"));
        if (!body || !explanation) return;

        function show(type) {
            let rows = baseRows.map(function (row) { return row.slice(); });
            let highlighted = [];
            let content = "";
            if (type === "update") {
                rows[0][3] = "Computer Science";
                highlighted = [0, 1, 2];
                content = "<span>UPDATE ANOMALY</span><h3>One department now has two names</h3><p>Only one occurrence of D10 was changed. Other rows still say CSE, so the database contradicts itself. In 3NF, DEPARTMENT stores this name once.</p>";
            } else if (type === "insert") {
                rows.push(["—", "—", "—", "—", "C404", "Cloud Computing", "—"]);
                highlighted = [rows.length - 1];
                content = "<span>INSERTION ANOMALY</span><h3>A course cannot exist independently</h3><p>The design requires a student part of the composite key before a new course can be recorded. Course facts should live in COURSE even when nobody has enrolled yet.</p>";
            } else if (type === "delete") {
                rows = rows.slice(0, 3);
                highlighted = [];
                content = "<span>DELETION ANOMALY</span><h3>Deleting one enrolment erased unrelated facts</h3><p>Removing Charan’s only enrolment also removed the only stored facts about course C103 and student 103. Separate STUDENT and COURSE relations preserve them.</p>";
            } else {
                content = "<span>ORIGINAL STATE</span><h3>The table is restored</h3><p>Choose an operation to see how duplicated student, department and course facts create an anomaly.</p>";
            }
            body.innerHTML = renderRows(rows, highlighted);
            explanation.className = "anomaly-explanation" + (type === "reset" ? "" : " is-warning");
            explanation.innerHTML = content;
            buttons.forEach(function (button) {
                if (button.dataset.anomaly !== "reset") button.setAttribute("aria-pressed", String(button.dataset.anomaly === type));
            });
        }

        buttons.forEach(function (button) { button.addEventListener("click", function () { show(button.dataset.anomaly); }); });
        show("reset");
    }

    function renderMiniTable(table) {
        return "<div class=\"nf-mini-table\"><h4>" + escapeHtml(table.name) + "</h4><div><table><thead><tr>" + table.columns.map(function (column) { return "<th>" + escapeHtml(column) + "</th>"; }).join("") + "</tr></thead><tbody>" + table.rows.map(function (row) { return "<tr>" + row.map(function (cell) { return "<td>" + escapeHtml(cell) + "</td>"; }).join("") + "</tr>"; }).join("") + "</tbody></table></div></div>";
    }

    function initDecomposition() {
        const stage = document.getElementById("decompositionStage");
        const tabs = Array.from(document.querySelectorAll("[data-nf-stage]"));
        const previous = document.getElementById("previousNfStage");
        const next = document.getElementById("nextNfStage");
        if (!stage || !tabs.length || !previous || !next) return;
        let current = 0;

        function render() {
            const key = stages[current];
            const item = stageContent[key];
            const dependencies = item.dependencies ? "<div class=\"nf-dependencies\"><span>FUNCTIONAL DEPENDENCIES</span>" + item.dependencies.map(function (dependency) { return "<code>" + escapeHtml(dependency) + "</code>"; }).join("") + "</div>" : "";
            stage.innerHTML = "<header><span>" + item.badge + "</span><h3>" + item.title + "</h3><p>" + item.copy + "</p></header>" + dependencies + "<div class=\"nf-table-grid\">" + item.tables.map(renderMiniTable).join("") + "</div><div class=\"stage-verdict\"><strong>DIAGNOSIS</strong><p>" + item.issue + "</p></div>";
            tabs.forEach(function (tab) { tab.setAttribute("aria-selected", String(tab.dataset.nfStage === key)); });
            previous.disabled = current === 0;
            next.disabled = current === stages.length - 1;
            next.textContent = current === stages.length - 1 ? "3NF reached ✓" : "Next stage →";
        }

        tabs.forEach(function (tab) { tab.addEventListener("click", function () { current = stages.indexOf(tab.dataset.nfStage); render(); }); });
        previous.addEventListener("click", function () { if (current > 0) { current -= 1; render(); } });
        next.addEventListener("click", function () { if (current < stages.length - 1) { current += 1; render(); } });
        render();
    }

    function initDiagnostic() {
        const form = document.getElementById("nfDiagnosticForm");
        const result = document.getElementById("nfDiagnosticResult");
        if (!form || !result) return;
        form.addEventListener("submit", function (event) {
            event.preventDefault();
            const data = new FormData(form);
            const atomic = data.get("atomic");
            const partial = data.get("partial");
            const transitive = data.get("transitive");
            let level, title, copy, steps;
            if (atomic === "no") {
                level = "UNF"; title = "The relation has not reached 1NF";
                copy = "Repeating groups or multi-valued cells must first become atomic rows and columns.";
                steps = ["Separate each repeated occurrence into a row.", "Choose a key for the resulting relation.", "Then test partial and transitive dependencies."];
            } else if (partial === "yes") {
                level = "1NF"; title = "The highest guaranteed form is 1NF";
                copy = "Atomic values pass 1NF, but a non-prime attribute depends on only part of a candidate key.";
                steps = ["Move the partially dependent attributes to a relation with their determinant.", "Retain the determinant as a key.", "Recheck every resulting relation for transitive dependencies."];
            } else if (transitive === "yes") {
                level = "2NF"; title = "The highest guaranteed form is 2NF";
                copy = "No partial dependency remains, but one non-prime attribute determines another non-prime attribute.";
                steps = ["Create a relation for the non-key determinant and its dependents.", "Keep that determinant as a foreign key in the original subject relation.", "Verify that every resulting relation satisfies 3NF."];
            } else {
                level = "3NF"; title = "The relation satisfies the Level 7 test for 3NF";
                copy = partial === "na" ? "Atomic values pass 1NF; a single-attribute key prevents partial dependency; no transitive non-key dependency remains." : "Atomic values pass 1NF, and neither partial nor transitive non-key dependency remains.";
                steps = ["Confirm the formal condition for every non-trivial FD.", "Document primary and foreign keys.", "Next test lossless join, dependency preservation and BCNF."];
            }
            result.className = "nf-diagnostic-result level-" + level.toLowerCase();
            result.innerHTML = "<span>" + level + " RESULT</span><h3>" + title + "</h3><p>" + copy + "</p><ol>" + steps.map(function (step) { return "<li>" + step + "</li>"; }).join("") + "</ol>";
        });
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
            const done = completed.indexOf(7) !== -1;
            button.classList.toggle("is-complete", done);
            button.setAttribute("aria-pressed", String(done));
            button.textContent = done ? "✓ Level 7 completed" : "Mark Level 7 complete";
            if (status) { status.textContent = done ? "Level 7 completed" : "Not completed"; status.parentElement.classList.toggle("is-complete", done); }
        }
        button.addEventListener("click", function () {
            const index = completed.indexOf(7);
            if (index === -1) completed.push(7); else completed.splice(index, 1);
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
        initAnomalyLab();
        initDecomposition();
        initDiagnostic();
        initChecks();
        initCompletion();
        initReading();
    }

    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true });
    else init();
}());
