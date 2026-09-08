(function () {
    "use strict";

    const cloud = window.CodeBhavyaSupabase || {};
    const client = cloud.client || null;
    const $ = (id) => document.getElementById(id);
    const groupLabels = {
        "os-processes-threads": "OS Processes, Threads & System Calls",
        "scheduling-concurrency": "Scheduling, Synchronization & Deadlocks",
        "memory-storage-files": "Memory, Storage & File Systems",
        "networking-addressing": "Networking Models, Addressing & Routing",
        "transport-app-security": "Transport, Application Protocols & Security",
        "oop-design": "Object-Oriented Programming & Design Principles",
        "software-engineering": "Software Engineering, SDLC & Agile",
        "testing-git-apis": "Testing, Git, APIs & System Fundamentals"
    };
    const targetLabels = { general: "General placement", service: "Service-company screening", product: "Product & core systems", ai: "Data, cloud & platform" };
    let problem = null;
    let hintsUsed = 0;
    let nextSlug = "";
    let previousSlug = "";

    function setState(name) {
        $("solveLoading").hidden = name !== "loading";
        $("solveError").hidden = name !== "error";
        $("solveWorkspace").hidden = name !== "workspace";
    }

    function readableError(error) {
        const message = String(error?.message || "Unknown Core CS problem error");
        if (/get_core_cs_problem|function .* does not exist|schema cache/i.test(message)) return "Run Placement/core-cs-problem-lab-schema-v23.sql, then run Placement/core-cs-problem-seed-v23.sql in a separate Supabase query.";
        if (/not found/i.test(message)) return "This problem was not found. Return to the Scenario Lab and choose a published problem.";
        if (/failed to fetch|networkerror|load failed/i.test(message)) return "The browser cannot reach Supabase. Check the project status and internet connection, then try again.";
        return "Supabase returned: " + message;
    }

    function addBadge(text, className) {
        const badge = document.createElement("span");
        badge.textContent = text;
        if (className) badge.className = className;
        $("solveMeta").append(badge);
    }

    function setNeighbour(linkId, slug, fallbackText) {
        const link = $(linkId);
        if (slug) {
            link.href = `core-cs-solve.html?problem=${encodeURIComponent(slug)}`;
            link.classList.remove("is-disabled");
        } else {
            link.href = "core-cs-problems.html";
            link.classList.add("is-disabled");
            link.setAttribute("aria-disabled", "true");
            link.title = fallbackText;
        }
    }

    async function loadNeighbours(displayOrder) {
        const requests = [];
        if (displayOrder > 1) requests.push(client.rpc("get_core_cs_problem_page", { p_topic_group: "all", p_difficulty: "all", p_target: "all", p_search: "", p_limit: 1, p_offset: displayOrder - 2 }));
        else requests.push(Promise.resolve({ data: { problems: [] } }));
        if (displayOrder < 100) requests.push(client.rpc("get_core_cs_problem_page", { p_topic_group: "all", p_difficulty: "all", p_target: "all", p_search: "", p_limit: 1, p_offset: displayOrder }));
        else requests.push(Promise.resolve({ data: { problems: [] } }));
        const [previous, next] = await Promise.all(requests);
        previousSlug = previous.data?.problems?.[0]?.slug || "";
        nextSlug = next.data?.problems?.[0]?.slug || "";
        setNeighbour("previousProblem", previousSlug, "This is the first problem");
        setNeighbour("nextProblem", nextSlug, "This is the final problem");
        $("continueProblem").href = nextSlug ? `core-cs-solve.html?problem=${encodeURIComponent(nextSlug)}` : "core-cs-problems.html";
        $("continueProblem").textContent = nextSlug ? "Continue to next problem →" : "Return to all problems →";
    }

    function renderProblem(value) {
        problem = value;
        document.title = `${problem.title} | Core CS Scenario Lab | CodeBhavya`;
        $("solveCrumb").textContent = problem.title;
        $("solveTitle").textContent = problem.title;
        $("solveNumber").textContent = `Problem ${problem.display_order} of 100`;
        $("solveScenario").textContent = problem.scenario;
        $("solveTask").textContent = problem.task;
        $("solveAnswerFormat").textContent = problem.answer_format;
        $("solveMeta").replaceChildren();
        addBadge(problem.difficulty, "difficulty");
        addBadge(`${problem.points} points`, "points");
        addBadge(targetLabels[problem.target_path] || problem.target_path);
        addBadge(groupLabels[problem.topic_group] || problem.topic_group);
        addBadge(`${problem.estimated_minutes} min estimate`);
        if (problem.solved) addBadge("Already solved", "points");
        setState("workspace");
        loadNeighbours(Number(problem.display_order)).catch(() => {
            setNeighbour("previousProblem", "", "Previous problem unavailable");
            setNeighbour("nextProblem", "", "Next problem unavailable");
        });
    }

    async function loadProblem() {
        setState("loading");
        const slug = new URLSearchParams(location.search).get("problem");
        if (!slug) {
            $("solveErrorMessage").textContent = "No problem was selected. Return to the Scenario Lab and choose one problem.";
            setState("error");
            return;
        }
        if (!client) {
            $("solveErrorMessage").textContent = "Database connection is unavailable. Keep your existing Supabase configuration files beside this page.";
            setState("error");
            return;
        }
        try {
            const [result, auth] = await Promise.all([client.rpc("get_core_cs_problem", { p_slug: slug }), client.auth.getUser()]);
            if (result.error) throw result.error;
            $("saveStatus").textContent = auth.data?.user ? "Progress saving enabled" : "Guest practice · result not saved";
            renderProblem(result.data);
        } catch (error) {
            $("solveErrorMessage").textContent = readableError(error);
            setState("error");
            console.error("Unable to open Core CS problem", error);
        }
    }

    async function showHint() {
        if (!problem || hintsUsed >= 2) return;
        const button = $("showHint");
        button.disabled = true;
        $("submitCoreError").textContent = "";
        try {
            const level = hintsUsed + 1;
            const result = await client.rpc("get_core_cs_problem_hint", { p_problem_id: problem.id, p_level: level });
            if (result.error) throw result.error;
            hintsUsed = level;
            const card = document.createElement("article");
            const title = document.createElement("strong");
            title.textContent = `Hint ${level} · ${Math.max(50, 100 - 20 * level)}% points remain`;
            const copy = document.createElement("p");
            copy.textContent = result.data?.hint || "No hint text was returned.";
            card.append(title, copy);
            $("coreHints").append(card);
            $("coreHints").hidden = false;
            button.textContent = hintsUsed < 2 ? "Use second hint" : "Both hints used";
            $("hintCost").textContent = hintsUsed < 2 ? "One more hint is available." : "You can still earn at least 50% of the problem points.";
        } catch (error) {
            $("submitCoreError").textContent = readableError(error);
        } finally {
            button.disabled = hintsUsed >= 2;
        }
    }

    function renderResult(result) {
        const correct = Boolean(result.correct);
        $("coreResult").classList.toggle("is-wrong", !correct);
        $("resultIcon").textContent = correct ? "✓" : "!";
        $("resultEyebrow").textContent = correct ? "VERIFIED" : "CORRECTION READY";
        $("resultTitle").textContent = correct ? "Correct reasoning" : "Not correct yet";
        $("resultPoints").textContent = correct
            ? `${Number(result.points_awarded) || 0} points ${result.saved ? "saved to your progress." : "earned in guest practice; sign in to save future points."}`
            : result.saved ? "This attempt is saved as learning evidence. A later correct answer can earn up to 50% after the revealed solution." : "Review the solution, then try again. Guest attempts are not saved.";
        $("resultAnswer").textContent = result.answer || "Answer unavailable";
        $("resultExplanation").textContent = result.explanation || "Explanation unavailable";
        $("resultRule").textContent = result.correction_rule || "Review the governing concept before retrying.";
        const steps = Array.isArray(result.solution_steps) ? result.solution_steps : [];
        $("resultSteps").replaceChildren(...steps.map((step) => {
            const item = document.createElement("li");
            item.textContent = step;
            return item;
        }));
        $("coreResult").hidden = false;
        $("coreResult").scrollIntoView({ behavior: "smooth", block: "nearest" });
    }

    async function submitAnswer(event) {
        event.preventDefault();
        const answer = $("coreAnswer").value.trim();
        if (!answer) {
            $("submitCoreError").textContent = "Enter an answer before submitting.";
            $("coreAnswer").focus();
            return;
        }
        $("submitCoreError").textContent = "";
        $("submitCoreAnswer").disabled = true;
        $("submitCoreAnswer").textContent = "Evaluating…";
        try {
            const result = await client.rpc("submit_core_cs_problem", { p_problem_id: problem.id, p_answer: answer, p_hints_used: hintsUsed });
            if (result.error) throw result.error;
            renderResult(result.data || {});
        } catch (error) {
            $("submitCoreError").textContent = readableError(error);
        } finally {
            $("submitCoreAnswer").disabled = false;
            $("submitCoreAnswer").textContent = "Submit for evaluation";
        }
    }

    function resetWorkspace() {
        $("coreAnswer").value = "";
        $("coreResult").hidden = true;
        $("submitCoreError").textContent = "";
        $("coreAnswer").focus();
    }

    function initialize() {
        $("showHint").addEventListener("click", showHint);
        $("coreAnswerForm").addEventListener("submit", submitAnswer);
        $("tryAgain").addEventListener("click", resetWorkspace);
        loadProblem();
    }

    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initialize); else initialize();
}());
