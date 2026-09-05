(function () {
    "use strict";

    const cloud = window.CodeBhavyaSupabase || {};
    const client = cloud.client || null;
    const $ = (id) => document.getElementById(id);
    const BOOKMARK_KEY = "codebhavya-mcq-revision-bookmarks-v1";
    const MASTERED_KEY = "codebhavya-mcq-revision-mastered-v1";
    const companyLabels = {
        tcs: "TCS", infosys: "Infosys", wipro: "Wipro", cognizant: "Cognizant",
        accenture: "Accenture", capgemini: "Capgemini", hcltech: "HCLTech",
        amazon: "Amazon", microsoft: "Microsoft", adobe: "Adobe", zoho: "Zoho"
    };
    const mcqLabels = {
        fundamentals: "Fundamentals & I/O",
        "control-functions": "Control Flow & Functions",
        "arrays-strings": "Arrays & Strings",
        "pointers-memory": "Pointers & Memory",
        "structures-files": "Structures & Files",
        "debugging-tools": "Debugging & Tools",
        "data-numerics": "Data & Numerics"
    };
    const codingLabels = {
        fundamentals: "Fundamentals & Number Logic",
        "control-functions": "Control Flow & Functions",
        "arrays-matrices": "Arrays & Matrices",
        strings: "Strings & Characters",
        "searching-sorting": "Searching & Sorting",
        "pointers-memory": "Pointers & Memory",
        "structures-files": "Structures & Records",
        "data-structures": "Data Structures",
        algorithms: "Algorithms & Optimisation",
        "data-numerics": "Data & Numerical Computing"
    };
    const skillOrder = ["fundamentals", "control-functions", "arrays-strings", "pointers-memory", "structures-files", "data-numerics", "searching-sorting", "data-structures", "algorithms", "debugging-tools"];
    const skillLabels = {
        fundamentals: "Fundamentals & Number Logic",
        "control-functions": "Control Flow & Functions",
        "arrays-strings": "Arrays, Matrices & Strings",
        "pointers-memory": "Pointers & Dynamic Memory",
        "structures-files": "Structures, Records & Files",
        "data-numerics": "Data & Numerical Computing",
        "searching-sorting": "Searching & Sorting",
        "data-structures": "Data Structures",
        algorithms: "Algorithms & Optimisation",
        "debugging-tools": "Debugging & Tools"
    };
    const codingToSkill = {
        fundamentals: "fundamentals", "control-functions": "control-functions",
        "arrays-matrices": "arrays-strings", strings: "arrays-strings",
        "searching-sorting": "searching-sorting", "pointers-memory": "pointers-memory",
        "structures-files": "structures-files", "data-structures": "data-structures",
        algorithms: "algorithms", "data-numerics": "data-numerics"
    };
    const skillToMcq = {
        fundamentals: "fundamentals", "control-functions": "control-functions",
        "arrays-strings": "arrays-strings", "pointers-memory": "pointers-memory",
        "structures-files": "structures-files", "data-numerics": "data-numerics",
        "searching-sorting": "arrays-strings", "data-structures": "arrays-strings",
        algorithms: "debugging-tools", "debugging-tools": "debugging-tools"
    };
    const skillToCoding = {
        fundamentals: "fundamentals", "control-functions": "control-functions",
        "arrays-strings": "arrays-matrices", "pointers-memory": "pointers-memory",
        "structures-files": "structures-files", "data-numerics": "data-numerics",
        "searching-sorting": "searching-sorting", "data-structures": "data-structures",
        algorithms: "algorithms", "debugging-tools": "fundamentals"
    };

    let currentDashboard = null;
    let currentUser = null;

    function number(value) { return Number(value) || 0; }
    function percent(part, total) { return total > 0 ? Math.round(100 * number(part) / number(total)) : 0; }

    function readDeviceSet(key) {
        try {
            const value = JSON.parse(localStorage.getItem(key) || "[]");
            return Array.isArray(value) ? new Set(value) : new Set();
        } catch (_error) {
            return new Set();
        }
    }

    function displayState(name) {
        ["progressLoading", "progressSignedOut", "progressError", "progressDashboard"].forEach((id) => {
            $(id).hidden = id !== name;
        });
    }

    function studentLabel(user) {
        const metadata = user?.user_metadata || {};
        const given = metadata.display_name || metadata.full_name || metadata.name;
        if (given) return String(given).trim().split(/\s+/)[0];
        const prefix = String(user?.email || "Student").split("@")[0].replace(/[._-]+/g, " ").trim();
        return prefix ? prefix.replace(/\b\w/g, (letter) => letter.toUpperCase()) : "Student";
    }

    function readinessText(value) {
        if (value >= 85) return ["Interview-ready evidence is strong.", "Keep accuracy stable and close the final weak areas with timed practice."];
        if (value >= 65) return ["Your placement foundation is taking shape.", "Increase solved-problem depth and repeat the weakest topic until it becomes reliable."];
        if (value >= 40) return ["You are building useful evidence.", "Follow the three recommended actions instead of jumping between unrelated topics."];
        if (value >= 15) return ["Your foundation has started.", "Build one topic at a time with revision, assessment and coding evidence."];
        return ["Build the foundation.", "Complete your first topic quiz and coding challenge to start measuring your progress."];
    }

    function milestone(value) {
        const targets = [25, 50, 75, 90, 100];
        const target = targets.find((candidate) => value < candidate) || 100;
        return { target, gap: Math.max(0, target - value) };
    }

    function buildSkillData(data) {
        const skills = new Map(skillOrder.map((key) => [key, { key, label: skillLabels[key], total: 0, completed: 0, evidence: [] }]));
        (data.mcq_groups || []).forEach((row) => {
            const key = row.group;
            if (!skills.has(key)) return;
            const skill = skills.get(key);
            skill.total += number(row.total);
            skill.completed += number(row.mastered);
            skill.evidence.push(`${number(row.mastered)}/${number(row.total)} MCQs mastered`);
        });
        (data.coding_groups || []).forEach((row) => {
            const key = codingToSkill[row.group];
            if (!skills.has(key)) return;
            const skill = skills.get(key);
            skill.total += number(row.total);
            skill.completed += number(row.solved);
            skill.evidence.push(`${number(row.solved)}/${number(row.total)} problems solved`);
        });
        return skillOrder.map((key) => {
            const skill = skills.get(key);
            skill.rate = percent(skill.completed, skill.total);
            if (!skill.evidence.length) skill.evidence.push("No evidence yet");
            return skill;
        });
    }

    function renderSummary(data) {
        const summary = data.summary || {};
        const readiness = Math.max(0, Math.min(100, number(summary.readiness)));
        const ring = $("readinessRing");
        ring.style.setProperty("--readiness", readiness);
        ring.setAttribute("aria-label", `Placement readiness ${readiness} percent`);
        $("readinessValue").textContent = readiness + "%";
        const copy = readinessText(readiness);
        $("readinessTitle").textContent = copy[0];
        $("readinessMessage").textContent = copy[1];
        const next = milestone(readiness);
        $("nextMilestone").textContent = next.target === 100 ? "Complete the readiness path" : `Reach ${next.target}% readiness`;
        $("milestoneGap").textContent = next.gap ? `${next.gap} readiness points to go` : "Milestone reached";

        $("mcqMasteryValue").textContent = `${number(summary.mastered_mcq)} / ${number(summary.total_mcq)}`;
        $("mcqMasteryNote").textContent = `${number(summary.mcq_correct)} correct across ${number(summary.mcq_attempts)} scored answers`;
        $("quizAccuracyValue").textContent = number(summary.quiz_accuracy) + "%";
        $("quizAccuracyNote").textContent = `${number(summary.quiz_sessions)} submitted ${number(summary.quiz_sessions) === 1 ? "quiz" : "quizzes"}`;
        const newProblems = Math.max(0, number(summary.total_problems) - number(summary.attempted_problems));
        $("codingSolvedValue").textContent = `${number(summary.solved_problems)} / ${number(summary.total_problems)}`;
        $("codingSolvedNote").textContent = `${number(summary.attempted_problems)} attempted · ${newProblems} new`;
        $("pointsValue").textContent = `${number(summary.points)} points`;
        $("rankValue").textContent = summary.rank ? `Current C leaderboard rank #${summary.rank}` : "Rank begins after a coding submission";
        $("activeDaysValue").textContent = `${number(summary.active_days_14)} active ${number(summary.active_days_14) === 1 ? "day" : "days"} in 14 days`;

        const bookmarks = readDeviceSet(BOOKMARK_KEY).size;
        const masteredSet = readDeviceSet(MASTERED_KEY);
        const mastered = masteredSet.size;
        const uniqueMarkers = new Set([...readDeviceSet(BOOKMARK_KEY), ...masteredSet]).size;
        $("deviceMarkersValue").textContent = `${uniqueMarkers} marked`;
        $("deviceMarkersNote").textContent = `${bookmarks} bookmarks · ${mastered} mastered (this device)`;
    }

    function renderSkills(skills) {
        const box = $("skillProgressGrid");
        box.replaceChildren();
        skills.forEach((skill) => {
            const card = document.createElement("article");
            card.className = "skill-card";
            const top = document.createElement("div");
            top.className = "skill-card-top";
            const title = document.createElement("strong");
            title.textContent = skill.label;
            const rate = document.createElement("b");
            rate.textContent = skill.rate + "%";
            top.append(title, rate);
            const progress = document.createElement("div");
            progress.className = "skill-progress";
            const bar = document.createElement("span");
            bar.style.width = skill.rate + "%";
            progress.append(bar);
            const note = document.createElement("p");
            note.textContent = skill.evidence.join(" · ");
            card.append(top, progress, note);
            box.append(card);
        });
    }

    function makeAction(index, eyebrow, title, note, href) {
        const link = document.createElement("a");
        link.className = "next-action";
        link.href = href;
        const numberBadge = document.createElement("span");
        numberBadge.textContent = String(index).padStart(2, "0");
        const copy = document.createElement("div");
        const small = document.createElement("small");
        small.textContent = eyebrow;
        const strong = document.createElement("strong");
        strong.textContent = title;
        const paragraph = document.createElement("p");
        paragraph.textContent = note;
        copy.append(small, strong, paragraph);
        const arrow = document.createElement("i");
        arrow.textContent = "→";
        link.append(numberBadge, copy, arrow);
        return link;
    }

    function renderActions(skills, data) {
        const weakest = [...skills].sort((a, b) => a.rate - b.rate || b.total - a.total).slice(0, 3);
        const first = weakest[0] || { key: "fundamentals", label: skillLabels.fundamentals };
        const second = weakest[1] || first;
        const third = weakest[2] || first;
        const summary = data.summary || {};
        const codingDifficulty = number(summary.solved_problems) >= 40 ? "advanced" : number(summary.solved_problems) >= 12 ? "intermediate" : "beginner";
        const box = $("nextActions");
        box.replaceChildren(
            makeAction(1, "REVISE", `Strengthen ${first.label}`, "Read five explained MCQs and mark only the concepts you can recall.", `mcq-library.html?topic=c&group=${encodeURIComponent(skillToMcq[first.key])}`),
            makeAction(2, "CODE", `Solve ${second.label}`, `Continue with ${codingDifficulty} problems and submit against all protected tests.`, `coding.html?topic=c&mode=topic&group=${encodeURIComponent(skillToCoding[second.key])}&difficulty=${codingDifficulty}`),
            makeAction(3, "ASSESS", `Test ${third.label}`, "Take a focused quiz; explanations appear only after you submit it.", `quiz.html?topic=c&mode=topic&group=${encodeURIComponent(skillToMcq[third.key])}`)
        );
    }

    function renderActivity(rows) {
        const values = Array.isArray(rows) ? rows : [];
        const max = Math.max(1, ...values.map((row) => number(row.count)));
        const box = $("activityChart");
        box.replaceChildren();
        values.forEach((row) => {
            const day = document.createElement("div");
            day.className = "activity-day";
            const wrap = document.createElement("div");
            wrap.className = "activity-bar-wrap";
            const bar = document.createElement("span");
            bar.className = "activity-bar";
            bar.style.height = Math.max(4, Math.round(100 * number(row.count) / max)) + "%";
            bar.title = `${row.label}: ${number(row.count)} submitted activities`;
            wrap.append(bar);
            const count = document.createElement("b");
            count.textContent = String(number(row.count));
            const label = document.createElement("small");
            label.textContent = row.label || "Day";
            day.append(wrap, count, label);
            box.append(day);
        });
    }

    function renderDifficulties(rows) {
        const box = $("difficultyGrid");
        box.replaceChildren();
        (rows || []).forEach((row) => {
            const item = document.createElement("article");
            item.className = "difficulty-row";
            const title = document.createElement("strong");
            title.textContent = row.difficulty;
            const progress = document.createElement("div");
            progress.className = "mini-progress";
            const bar = document.createElement("span");
            const rate = percent(row.solved, row.total);
            bar.style.width = rate + "%";
            progress.append(bar);
            const value = document.createElement("b");
            value.textContent = `${number(row.solved)} / ${number(row.total)}`;
            const note = document.createElement("p");
            note.textContent = `${number(row.attempted)} attempted · ${rate}% complete`;
            item.append(title, progress, value, note);
            box.append(item);
        });
    }

    function updateCompanyCard() {
        const selected = $("companyReadinessSelect").value;
        const row = (currentDashboard?.companies || []).find((company) => company.company === selected) || { company: selected, total: 0, solved: 0, readiness: 0 };
        const label = companyLabels[row.company] || row.company || "Company";
        const readiness = number(row.readiness);
        $("companyReadinessValue").textContent = readiness + "%";
        $("companyReadinessCount").textContent = `${number(row.solved)} of ${number(row.total)} solved`;
        $("companyReadinessBar").style.width = readiness + "%";
        $("companyReadinessMessage").textContent = readiness >= 80 ? `Strong coverage for the ${label} practice collection. Keep it fresh.` : readiness >= 40 ? `Your ${label} collection is developing. Complete the remaining patterns.` : `Start the ${label} mapped collection to build topic evidence.`;
        $("companyReadinessLink").href = `coding.html?topic=c&mode=company&company=${encodeURIComponent(row.company || "tcs")}`;
    }

    function renderCompanies(rows) {
        const select = $("companyReadinessSelect");
        select.replaceChildren();
        (rows || []).forEach((row) => {
            const option = document.createElement("option");
            option.value = row.company;
            option.textContent = companyLabels[row.company] || row.company;
            select.append(option);
        });
        if (!select.options.length) {
            const option = document.createElement("option");
            option.value = "tcs";
            option.textContent = "TCS";
            select.append(option);
        }
        updateCompanyCard();
    }

    function planItem(day, label, title, note, href) {
        const link = document.createElement("a");
        link.className = "plan-day";
        link.href = href;
        const numberBadge = document.createElement("span");
        numberBadge.textContent = day;
        const small = document.createElement("small");
        small.textContent = label;
        const strong = document.createElement("strong");
        strong.textContent = title;
        const paragraph = document.createElement("p");
        paragraph.textContent = note;
        const action = document.createElement("i");
        action.textContent = "Start →";
        link.append(numberBadge, small, strong, paragraph, action);
        return link;
    }

    function renderPlan(skills, data) {
        const weak = [...skills].sort((a, b) => a.rate - b.rate).slice(0, 3);
        while (weak.length < 3) weak.push({ key: "fundamentals", label: skillLabels.fundamentals });
        const company = data.companies?.[0]?.company || "tcs";
        const box = $("studyPlan");
        box.replaceChildren(
            planItem("1", "READ", weak[0].label, "Review five explained MCQs.", `mcq-library.html?topic=c&group=${encodeURIComponent(skillToMcq[weak[0].key])}`),
            planItem("2", "CODE", weak[0].label, "Solve two beginner problems.", `coding.html?topic=c&mode=topic&group=${encodeURIComponent(skillToCoding[weak[0].key])}&difficulty=beginner`),
            planItem("3", "ASSESS", weak[0].label, "Take a focused 10-question quiz.", `quiz.html?topic=c&mode=topic&group=${encodeURIComponent(skillToMcq[weak[0].key])}&count=10`),
            planItem("4", "READ", weak[1].label, "Revise the next weakest skill.", `mcq-library.html?topic=c&group=${encodeURIComponent(skillToMcq[weak[1].key])}`),
            planItem("5", "CODE", weak[1].label, "Submit two coding solutions.", `coding.html?topic=c&mode=topic&group=${encodeURIComponent(skillToCoding[weak[1].key])}`),
            planItem("6", "TARGET", companyLabels[company] || company, "Explore one company-mapped collection.", `coding.html?topic=c&mode=company&company=${encodeURIComponent(company)}`),
            planItem("7", "REVIEW", "Mixed placement check", "Take a mixed quiz and review mistakes.", "quiz.html?topic=c&mode=mock")
        );
    }

    function friendlyActivityTitle(row) {
        if (row.kind !== "quiz") return row.title || "Coding submission";
        return mcqLabels[row.title] ? `${mcqLabels[row.title]} quiz` : (row.title || "Mixed C assessment");
    }

    function renderRecent(rows) {
        const box = $("recentActivity");
        box.replaceChildren();
        if (!rows?.length) {
            const empty = document.createElement("p");
            empty.className = "recent-empty";
            empty.textContent = "No submitted activity yet. Complete a quiz or submit a coding solution to begin your evidence trail.";
            box.append(empty);
            return;
        }
        const formatter = new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
        rows.forEach((row) => {
            const item = document.createElement("article");
            item.className = "recent-row";
            const icon = document.createElement("span");
            icon.textContent = row.kind === "quiz" ? "Q" : "C";
            const copy = document.createElement("div");
            const title = document.createElement("strong");
            title.textContent = friendlyActivityTitle(row);
            const detail = document.createElement("p");
            detail.textContent = row.detail || "Submitted activity";
            copy.append(title, detail);
            const time = document.createElement("time");
            const date = new Date(row.occurred_at);
            time.textContent = Number.isNaN(date.getTime()) ? "Recently" : formatter.format(date);
            item.append(icon, copy, time);
            box.append(item);
        });
    }

    function renderDashboard(data) {
        currentDashboard = data || {};
        $("studentName").textContent = studentLabel(currentUser);
        $("lastUpdated").textContent = "Updated " + new Intl.DateTimeFormat(undefined, { hour: "numeric", minute: "2-digit" }).format(new Date());
        renderSummary(currentDashboard);
        const skills = buildSkillData(currentDashboard);
        renderSkills(skills);
        renderActions(skills, currentDashboard);
        renderActivity(currentDashboard.daily_activity);
        renderDifficulties(currentDashboard.difficulties);
        renderCompanies(currentDashboard.companies);
        renderPlan(skills, currentDashboard);
        renderRecent(currentDashboard.recent_activity);
        displayState("progressDashboard");
    }

    function readableError(error) {
        const message = String(error?.message || "Unknown dashboard error");
        if (/get_placement_dashboard|function .* does not exist|schema cache/i.test(message)) return "Run the latest Placement/placement-v2-schema.sql once in Supabase SQL Editor, then retry.";
        if (/jwt|sign in|auth|permission|401|403/i.test(message)) return "Your sign-in session is unavailable. Return to the Placement page, sign in again, then open My Progress.";
        if (/failed to fetch|networkerror|load failed/i.test(message)) return "The browser cannot reach Supabase. Check the project status and internet connection, then retry.";
        return "Supabase returned: " + message;
    }

    async function loadProgress() {
        displayState("progressLoading");
        if (!client) {
            $("progressErrorMessage").textContent = "The database connection is unavailable. Keep your existing Supabase configuration file beside this page.";
            displayState("progressError");
            return;
        }
        try {
            const auth = await client.auth.getUser();
            currentUser = auth.data?.user || null;
            if (!currentUser) {
                displayState("progressSignedOut");
                return;
            }
            const result = await client.rpc("get_placement_dashboard", { p_topic: "c" });
            if (result.error) throw result.error;
            renderDashboard(result.data);
        } catch (error) {
            $("progressErrorMessage").textContent = readableError(error);
            displayState("progressError");
            console.error("Unable to load placement progress", error);
        }
    }

    function initialize() {
        $("retryProgress").addEventListener("click", loadProgress);
        $("refreshProgress").addEventListener("click", loadProgress);
        $("companyReadinessSelect").addEventListener("change", updateCompanyCard);
        if (client) client.auth.onAuthStateChange((event, session) => {
            if (event === "INITIAL_SESSION") return;
            const nextUser = session?.user || null;
            if (nextUser?.id !== currentUser?.id) window.setTimeout(loadProgress, 0);
        });
        loadProgress();
    }

    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initialize);
    else initialize();
}());
