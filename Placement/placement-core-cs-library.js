(function () {
    "use strict";

    const cloud = window.CodeBhavyaSupabase || {};
    const client = cloud.client || null;
    const $ = (id) => document.getElementById(id);
    const PAGE_SIZE = 12;
    const groupLabels = {
        all: "All Core CS topics",
        "os-processes-threads": "OS Processes, Threads & System Calls",
        "scheduling-concurrency": "Scheduling, Synchronization & Deadlocks",
        "memory-storage-files": "Memory, Storage & File Systems",
        "networking-addressing": "Networking Models, Addressing & Routing",
        "transport-app-security": "Transport, Application Protocols & Security",
        "oop-design": "Object-Oriented Programming & Design Principles",
        "software-engineering": "Software Engineering, SDLC & Agile",
        "testing-git-apis": "Testing, Git, APIs & System Fundamentals"
    };
    const targetLabels = { all: "All preparation tracks", general: "General placement", service: "Service-company screening", product: "Product & core systems", ai: "Data, cloud & platform" };
    let page = 0;
    let total = 0;

    function filters() {
        return {
            group: $("coreLabGroup").value,
            difficulty: $("coreLabDifficulty").value,
            target: $("coreLabTarget").value,
            search: $("coreLabSearch").value.trim()
        };
    }

    function updateUrl(values) {
        const params = new URLSearchParams();
        if (values.group !== "all") params.set("group", values.group);
        if (values.difficulty !== "all") params.set("difficulty", values.difficulty);
        if (values.target !== "all") params.set("target", values.target);
        if (values.search) params.set("search", values.search);
        const query = params.toString();
        history.replaceState(null, "", location.pathname + (query ? `?${query}` : "") + "#problemBuilder");
    }

    function statusText(problem) {
        if (problem.solved) return "Solved";
        if (problem.attempted) return "Attempted · improve it";
        return `${problem.estimated_minutes} min estimate`;
    }

    function cardFor(problem) {
        const card = document.createElement("article");
        card.className = "core-problem-card" + (problem.solved ? " is-solved" : problem.attempted ? " is-attempted" : "");
        const head = document.createElement("div");
        head.className = "core-problem-card-head";
        const badges = document.createElement("div");
        badges.className = "core-problem-badges";
        const difficulty = document.createElement("span");
        difficulty.className = "difficulty";
        difficulty.textContent = problem.difficulty;
        const track = document.createElement("span");
        track.textContent = targetLabels[problem.target_path] || problem.target_path;
        const points = document.createElement("span");
        points.className = "points";
        points.textContent = `${problem.points} points`;
        badges.append(difficulty, track, points);
        const number = document.createElement("b");
        number.textContent = `#${String(problem.display_order).padStart(3, "0")}`;
        head.append(badges, number);
        const subtopic = document.createElement("p");
        subtopic.className = "subtopic";
        subtopic.textContent = problem.subtopic;
        const title = document.createElement("h3");
        title.textContent = problem.title;
        const preview = document.createElement("p");
        preview.className = "scenario-preview";
        preview.textContent = problem.scenario;
        const footer = document.createElement("footer");
        const status = document.createElement("span");
        status.textContent = statusText(problem);
        const open = document.createElement("a");
        open.href = `core-cs-solve.html?problem=${encodeURIComponent(problem.slug)}`;
        open.textContent = problem.solved ? "Review problem →" : "Solve problem →";
        footer.append(status, open);
        card.append(head, subtopic, title, preview, footer);
        return card;
    }

    function render(problems) {
        const box = $("coreLabGrid");
        box.replaceChildren(...problems.map(cardFor));
        box.hidden = !problems.length;
        $("coreLabEmpty").hidden = Boolean(problems.length);
        const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));
        $("coreLabPagination").hidden = total <= PAGE_SIZE;
        $("coreLabPageStatus").textContent = `Page ${page + 1} of ${pageCount}`;
        $("coreLabPrevious").disabled = page === 0;
        $("coreLabNext").disabled = (page + 1) * PAGE_SIZE >= total;
        const values = filters();
        $("coreLabTitle").textContent = values.group === "all" ? "Core CS scenario problems" : groupLabels[values.group];
        $("coreLabSummary").textContent = total
            ? `${total} matching ${total === 1 ? "problem" : "problems"}. Showing ${page * PAGE_SIZE + 1}–${Math.min((page + 1) * PAGE_SIZE, total)}.`
            : "No problems match this exact selection. Change one filter and load again.";
        if (!problems.length) {
            $("coreLabEmpty").querySelector("h3").textContent = "No matching problems";
            $("coreLabEmpty").querySelector("p").textContent = "Try all preparation tracks, another difficulty or a broader search term.";
        }
    }

    function readableError(error) {
        const message = String(error?.message || "Unknown Core CS lab error");
        if (/get_core_cs_problem_page|function .* does not exist|schema cache/i.test(message)) return "Run Placement/core-cs-problem-lab-schema-v23.sql, then run Placement/core-cs-problem-seed-v23.sql in a separate Supabase query.";
        if (/failed to fetch|networkerror|load failed/i.test(message)) return "The browser cannot reach Supabase. Check the project status and internet connection, then try again.";
        return "Core CS problems could not load: " + message;
    }

    async function loadProblems(event) {
        event?.preventDefault();
        if (!client) {
            $("coreLabError").textContent = "Database connection is unavailable. Keep your existing Supabase configuration files beside this page.";
            return;
        }
        const values = filters();
        $("coreLabError").textContent = "";
        $("coreLabEmpty").hidden = true;
        $("coreLabGrid").hidden = true;
        $("coreLabPagination").hidden = true;
        $("coreLabLoading").hidden = false;
        $("loadCoreLab").disabled = true;
        try {
            const result = await client.rpc("get_core_cs_problem_page", {
                p_topic_group: values.group,
                p_difficulty: values.difficulty,
                p_target: values.target,
                p_search: values.search,
                p_limit: PAGE_SIZE,
                p_offset: page * PAGE_SIZE
            });
            if (result.error) throw result.error;
            total = Number(result.data?.total) || 0;
            render(Array.isArray(result.data?.problems) ? result.data.problems : []);
            updateUrl(values);
        } catch (error) {
            $("coreLabEmpty").hidden = false;
            $("coreLabEmpty").querySelector("h3").textContent = "The problem bank needs attention";
            $("coreLabEmpty").querySelector("p").textContent = "Use the installation message below, then reload this page.";
            $("coreLabError").textContent = readableError(error);
            console.error("Unable to load Core CS Scenario Lab", error);
        } finally {
            $("coreLabLoading").hidden = true;
            $("loadCoreLab").disabled = false;
        }
    }

    async function refreshAccountNote() {
        if (!client) return;
        const auth = await client.auth.getUser();
        if (auth.data?.user) $("coreLabAccount").textContent = "Signed in: solved problems, best points and activity will be added to your Core CS progress dashboard.";
    }

    function initialize() {
        const params = new URLSearchParams(location.search);
        const selections = [
            ["coreLabGroup", "group"], ["coreLabDifficulty", "difficulty"], ["coreLabTarget", "target"]
        ];
        selections.forEach(([id, name]) => {
            const requested = params.get(name);
            if ([...$(id).options].some((option) => option.value === requested)) $(id).value = requested;
        });
        $("coreLabSearch").value = params.get("search") || "";
        $("coreLabFilterForm").addEventListener("submit", (event) => { page = 0; loadProblems(event); });
        ["coreLabGroup", "coreLabDifficulty", "coreLabTarget"].forEach((id) => $(id).addEventListener("change", () => { page = 0; }));
        $("coreLabPrevious").addEventListener("click", () => { if (page > 0) { page -= 1; loadProblems(); } });
        $("coreLabNext").addEventListener("click", () => { if ((page + 1) * PAGE_SIZE < total) { page += 1; loadProblems(); } });
        refreshAccountNote();
    }

    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initialize); else initialize();
}());
