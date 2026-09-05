(function () {
    "use strict";

    const cloud = window.CodeBhavyaSupabase || {};
    const client = cloud.client || null;
    const $ = (id) => document.getElementById(id);
    const targetLabels = {
        general: "General Campus Placement",
        service: "Foundation & High-Volume Hiring",
        product: "Product Engineering & DSA",
        ai: "Data, AI & Analytics"
    };
    const companyLabels = {
        tcs: "TCS", infosys: "Infosys", wipro: "Wipro", cognizant: "Cognizant",
        accenture: "Accenture", capgemini: "Capgemini", hcltech: "HCLTech",
        amazon: "Amazon", microsoft: "Microsoft", adobe: "Adobe", zoho: "Zoho"
    };
    const topicLabels = {
        all: "All C topics",
        fundamentals: "Fundamentals & Number Logic",
        "control-functions": "Control Flow & Functions",
        "arrays-matrices": "Arrays & Matrices",
        strings: "Strings & Characters",
        "searching-sorting": "Searching & Sorting",
        "pointers-memory": "Pointers & Dynamic Memory",
        "structures-files": "Structures & Record Processing",
        "data-structures": "Data Structures",
        algorithms: "Algorithms & Optimisation",
        "data-numerics": "Data & Numerical Computing"
    };
    const difficultyOrder = { beginner: 1, intermediate: 2, advanced: 3 };
    const PAGE_SIZE = 12;
    let user = null;
    let loadedProblems = [];
    let attemptStates = new Map();
    let currentPage = 1;

    function arrayValue(value) {
        if (Array.isArray(value)) return value;
        if (typeof value !== "string") return [];
        try {
            const parsed = JSON.parse(value);
            return Array.isArray(parsed) ? parsed : [];
        } catch (_error) {
            return [];
        }
    }

    function mode() {
        return $("libraryMode").value;
    }

    function setMode(value) {
        const selected = ["topic", "track", "company"].includes(value) ? value : "topic";
        $("libraryMode").value = selected;
        document.querySelectorAll("[data-library-mode]").forEach((button) => {
            button.setAttribute("aria-selected", String(button.dataset.libraryMode === selected));
        });
        $("libraryTopicField").hidden = selected !== "topic";
        $("libraryTrackField").hidden = selected !== "track";
        $("libraryCompanyField").hidden = selected !== "company";
        $("libraryModeHelp").textContent = selected === "topic"
            ? "Choose a C topic and practise its patterns in increasing difficulty."
            : selected === "track"
                ? "Choose an understandable preparation track based on the hiring pattern you expect."
                : "Choose a company profile to see original CodeBhavya problems mapped to its likely emphasis. Verify the current role notification too.";
        resetResults("Learning path changed", "Select Load problems to build the new practice set.");
    }

    function resetResults(title, text) {
        loadedProblems = [];
        attemptStates = new Map();
        currentPage = 1;
        $("libraryProblemCount").textContent = "0";
        $("problemResultsTitle").textContent = title;
        $("problemLibraryGrid").replaceChildren();
        $("problemLibraryGrid").hidden = true;
        $("problemPagination").hidden = true;
        const empty = $("problemLibraryEmpty");
        empty.querySelector("h3").textContent = title;
        empty.querySelector("p").textContent = text;
        empty.hidden = false;
    }

    function currentFocus() {
        if (mode() === "topic") return topicLabels[$("libraryTopic").value] || "Selected C topic";
        if (mode() === "track") return targetLabels[$("libraryTrack").value] || "Selected preparation track";
        return (companyLabels[$("libraryCompany").value] || "Selected company") + " preparation collection";
    }

    function problemUrl(problem) {
        const query = new URLSearchParams({ topic: "c", problem: problem.slug });
        query.set("mode", mode());
        query.set("difficulty", $("libraryDifficulty").value);
        if (mode() === "topic") query.set("group", $("libraryTopic").value);
        else if (mode() === "track") query.set("track", $("libraryTrack").value);
        else query.set("company", $("libraryCompany").value);
        return "solve.html?" + query.toString();
    }

    function makeTag(text, className) {
        const tag = document.createElement("span");
        tag.className = className || "";
        tag.textContent = text;
        return tag;
    }

    function renderProblems() {
        const search = $("librarySearch").value.trim().toLowerCase();
        const filtered = loadedProblems.filter((problem) => {
            if (!search) return true;
            const searchable = [
                problem.title,
                problem.subtopic,
                problem.problem_type,
                targetLabels[problem.target_path],
                ...arrayValue(problem.company_tags).map((company) => companyLabels[company] || company),
                ...arrayValue(problem.skill_tags)
            ].join(" ").toLowerCase();
            return searchable.includes(search);
        });

        const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
        currentPage = Math.min(currentPage, totalPages);
        const visible = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
        const grid = $("problemLibraryGrid");
        grid.replaceChildren();
        $("libraryProblemCount").textContent = String(filtered.length);
        $("problemResultsTitle").textContent = search
            ? `Search results in ${currentFocus()}`
            : currentFocus();

        if (!filtered.length) {
            grid.hidden = true;
            const empty = $("problemLibraryEmpty");
            empty.querySelector("h3").textContent = "No matching problems";
            empty.querySelector("p").textContent = search
                ? "Try a broader search or remove the search text."
                : "Choose another topic, preparation track or difficulty.";
            empty.hidden = false;
            $("problemPagination").hidden = true;
            return;
        }

        $("problemLibraryEmpty").hidden = true;
        grid.hidden = false;
        visible.forEach((problem) => {
            const state = attemptStates.get(problem.id) || { attempted: false, solved: false, best: 0 };
            const card = document.createElement("article");
            card.className = "library-problem-card";

            const top = document.createElement("div");
            top.className = "library-card-top";
            const tags = document.createElement("div");
            tags.className = "library-card-tags";
            tags.append(
                makeTag(problem.difficulty || "beginner", "difficulty-tag " + (problem.difficulty || "beginner")),
                makeTag(problem.subtopic || "C programming", "topic-tag")
            );
            const status = makeTag(state.solved ? "Solved" : (state.attempted ? "Attempted" : "New"), "progress-tag " + (state.solved ? "solved" : (state.attempted ? "attempted" : "new")));
            top.append(tags, status);

            const heading = document.createElement("h3");
            heading.textContent = problem.title;
            const description = document.createElement("p");
            description.className = "library-card-description";
            description.textContent = problem.statement;

            const skills = document.createElement("div");
            skills.className = "library-skill-list";
            arrayValue(problem.skill_tags).slice(0, 3).forEach((skill) => skills.append(makeTag(skill)));

            const footer = document.createElement("footer");
            const metadata = document.createElement("div");
            metadata.append(
                makeTag(`${problem.points} points`),
                makeTag((problem.problem_type || "complete-program").replaceAll("-", " ")),
                makeTag(mode() === "company"
                    ? (companyLabels[$("libraryCompany").value] || "Company collection")
                    : (targetLabels[problem.target_path] || "General Campus Placement"))
            );
            const link = document.createElement("a");
            link.href = problemUrl(problem);
            link.textContent = state.solved ? "Solve again →" : "Open challenge →";
            link.setAttribute("aria-label", `${state.solved ? "Solve again" : "Open challenge"}: ${problem.title}`);
            footer.append(metadata, link);

            card.append(top, heading, description, skills, footer);
            grid.append(card);
        });

        const pagination = $("problemPagination");
        pagination.hidden = filtered.length <= PAGE_SIZE;
        $("problemPageStatus").textContent = `Page ${currentPage} of ${totalPages} · showing ${(currentPage - 1) * PAGE_SIZE + 1}–${Math.min(currentPage * PAGE_SIZE, filtered.length)} of ${filtered.length}`;
        $("previousProblemPage").disabled = currentPage === 1;
        $("nextProblemPage").disabled = currentPage === totalPages;
    }

    async function loadAttemptStates(problemIds) {
        attemptStates = new Map();
        if (!client || !user || !problemIds.length) return;
        const result = await client.from("coding_submissions")
            .select("problem_id,status,points_awarded")
            .eq("user_id", user.id)
            .in("problem_id", problemIds)
            .limit(5000);
        if (result.error) return;
        (result.data || []).forEach((row) => {
            const state = attemptStates.get(row.problem_id) || { attempted: false, solved: false, best: 0 };
            state.attempted = true;
            state.solved = state.solved || String(row.status).toLowerCase() === "accepted" || Number(row.points_awarded) > 0;
            state.best = Math.max(state.best, Number(row.points_awarded) || 0);
            attemptStates.set(row.problem_id, state);
        });
    }

    function readableError(error) {
        const message = String(error?.message || "Unknown database error");
        if (/topic_group|subtopic|problem_type|skill_tags|column/i.test(message)) {
            return "Run the latest placement-v2-schema.sql and C coding seed to enable the new problem library.";
        }
        if (/failed to fetch|networkerror|load failed/i.test(message)) {
            return "The browser cannot reach the database. Check the Supabase project and internet connection.";
        }
        return "Problems could not load: " + message;
    }

    async function loadProblems(event) {
        event.preventDefault();
        if (!client) {
            resetResults("Database connection unavailable", "Confirm the existing Supabase configuration and try again.");
            return;
        }

        const button = $("loadLibraryProblems");
        button.disabled = true;
        button.textContent = "Loading…";
        $("problemResultsTitle").textContent = "Building your practice set…";
        $("problemLibraryEmpty").hidden = false;
        $("problemLibraryGrid").hidden = true;

        try {
            let query = client.from("coding_problems")
                .select("id,slug,title,topic,topic_group,subtopic,problem_type,skill_tags,company_tags,difficulty,target_path,statement,points")
                .eq("is_published", true)
                .eq("topic", "c");
            if (mode() === "topic" && $("libraryTopic").value !== "all") {
                query = query.eq("topic_group", $("libraryTopic").value);
            }
            if (mode() === "track") query = query.eq("target_path", $("libraryTrack").value);
            if (mode() === "company") query = query.contains("company_tags", [$("libraryCompany").value]);
            if ($("libraryDifficulty").value !== "all") query = query.eq("difficulty", $("libraryDifficulty").value);

            const result = await query.limit(500);
            if (result.error) throw result.error;
            loadedProblems = (result.data || []).sort((a, b) => {
                const difficultyDifference = (difficultyOrder[a.difficulty] || 9) - (difficultyOrder[b.difficulty] || 9);
                return difficultyDifference || a.title.localeCompare(b.title);
            });
            currentPage = 1;
            await loadAttemptStates(loadedProblems.map((problem) => problem.id));
            renderProblems();
        } catch (error) {
            loadedProblems = [];
            resetResults("Problems could not load", readableError(error));
            console.error("Unable to load problem library", error);
        } finally {
            button.disabled = false;
            button.textContent = "Load problems";
        }
    }

    async function loadMyScore() {
        if (!client || !user) {
            $("myCodingScore").textContent = "0";
            return;
        }
        const result = await client.from("coding_submissions")
            .select("problem_id,points_awarded")
            .eq("user_id", user.id)
            .limit(5000);
        if (result.error) return;
        const best = {};
        (result.data || []).forEach((entry) => {
            best[entry.problem_id] = Math.max(best[entry.problem_id] || 0, Number(entry.points_awarded) || 0);
        });
        $("myCodingScore").textContent = String(Object.values(best).reduce((sum, value) => sum + value, 0));
    }

    async function showLeaderboard() {
        if (!client) return;
        const result = await client.rpc("get_coding_leaderboard", { p_topic: "c" });
        const body = $("leaderboardRows");
        body.replaceChildren();
        (result.data || []).forEach((row) => {
            const tableRow = document.createElement("tr");
            [row.rank, row.student_alias, row.solved, row.points].forEach((value) => {
                const cell = document.createElement("td");
                cell.textContent = String(value);
                tableRow.append(cell);
            });
            body.append(tableRow);
        });
        if (!body.children.length) {
            const row = document.createElement("tr");
            const cell = document.createElement("td");
            cell.colSpan = 4;
            cell.textContent = "No accepted submissions yet.";
            row.append(cell);
            body.append(row);
        }
        $("leaderboardDialog").showModal();
    }

    async function initialize() {
        if (client) {
            const auth = await client.auth.getUser();
            user = auth.data?.user || null;
            client.auth.onAuthStateChange((_event, session) => {
                user = session?.user || null;
                loadMyScore();
            });
        }

        document.querySelectorAll("[data-library-mode]").forEach((button) => {
            button.addEventListener("click", () => setMode(button.dataset.libraryMode));
        });
        $("problemFilterForm").addEventListener("submit", loadProblems);
        $("librarySearch").addEventListener("input", () => {
            if (loadedProblems.length) {
                currentPage = 1;
                renderProblems();
            }
        });
        [$("libraryTopic"), $("libraryTrack"), $("libraryCompany"), $("libraryDifficulty")].forEach((control) => {
            control.addEventListener("change", () => resetResults("Filters changed", "Select Load problems to build the new practice set."));
        });
        $("openTrackGuide").addEventListener("click", () => $("trackGuideDialog").showModal());
        $("openLeaderboard").addEventListener("click", showLeaderboard);
        $("previousProblemPage").addEventListener("click", () => {
            if (currentPage > 1) {
                currentPage -= 1;
                renderProblems();
                $("problemResultsTitle").scrollIntoView({ behavior: "smooth", block: "start" });
            }
        });
        $("nextProblemPage").addEventListener("click", () => {
            currentPage += 1;
            renderProblems();
            $("problemResultsTitle").scrollIntoView({ behavior: "smooth", block: "start" });
        });

        const parameters = new URLSearchParams(location.search);
        const requestedMode = ["topic", "track", "company"].includes(parameters.get("mode")) ? parameters.get("mode") : "topic";
        if ([...$("libraryTopic").options].some((option) => option.value === parameters.get("group"))) {
            $("libraryTopic").value = parameters.get("group");
        }
        if ([...$("libraryTrack").options].some((option) => option.value === parameters.get("track"))) {
            $("libraryTrack").value = parameters.get("track");
        }
        if ([...$("libraryCompany").options].some((option) => option.value === parameters.get("company"))) {
            $("libraryCompany").value = parameters.get("company");
        }
        if ([...$("libraryDifficulty").options].some((option) => option.value === parameters.get("difficulty"))) {
            $("libraryDifficulty").value = parameters.get("difficulty");
        }
        setMode(requestedMode);
        resetResults("Choose filters to begin", "Select Load problems to build your focused C practice set.");
        loadMyScore();
    }

    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initialize);
    else initialize();
}());
