(function () {
    "use strict";

    const cloud = window.CodeBhavyaSupabase || {};
    const client = cloud.client || null;
    const $ = (id) => document.getElementById(id);
    const parameters = new URLSearchParams(location.search);
    const requestedTopic = parameters.get("topic");
    if (!requestedTopic) { location.replace("dashboard.html"); return; }
    const topic = ["python", "dsa", "database", "core-cs", "aptitude", "ai-ml"].includes(requestedTopic) ? requestedTopic : "c";
    const topicLabel = { c: "C", python: "Python", dsa: "DSA", database: "Database & SQL", "core-cs": "Core CS", aptitude: "Aptitude & Reasoning", "ai-ml": "AI & ML" }[topic];
    const coreCsTopic = topic === "core-cs";
    const aptitudeTopic = topic === "aptitude";
    const aiMlTopic = topic === "ai-ml";
    const assessmentOnly = aptitudeTopic;
    const BOOKMARK_KEY = topic === "c" ? "codebhavya-mcq-revision-bookmarks-v1" : `codebhavya-mcq-revision-bookmarks-${topic}-v1`;
    const MASTERED_KEY = topic === "c" ? "codebhavya-mcq-revision-mastered-v1" : `codebhavya-mcq-revision-mastered-${topic}-v1`;
    const companyLabels = {
        tcs: "TCS", infosys: "Infosys", wipro: "Wipro", cognizant: "Cognizant",
        accenture: "Accenture", capgemini: "Capgemini", hcltech: "HCLTech",
        amazon: "Amazon", microsoft: "Microsoft", adobe: "Adobe", zoho: "Zoho"
    };
    const cMcqLabels = {
        fundamentals: "Fundamentals & I/O",
        "control-functions": "Control Flow & Functions",
        "arrays-strings": "Arrays & Strings",
        "pointers-memory": "Pointers & Memory",
        "structures-files": "Structures & Files",
        "debugging-tools": "Debugging & Tools",
        "data-numerics": "Data & Numerics"
    };
    const cCodingLabels = {
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
    const cSkillOrder = ["fundamentals", "control-functions", "arrays-strings", "pointers-memory", "structures-files", "data-numerics", "searching-sorting", "data-structures", "algorithms", "debugging-tools"];
    const cSkillLabels = {
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
    const cCodingToSkill = {
        fundamentals: "fundamentals", "control-functions": "control-functions",
        "arrays-matrices": "arrays-strings", strings: "arrays-strings",
        "searching-sorting": "searching-sorting", "pointers-memory": "pointers-memory",
        "structures-files": "structures-files", "data-structures": "data-structures",
        algorithms: "algorithms", "data-numerics": "data-numerics"
    };
    const cSkillToMcq = {
        fundamentals: "fundamentals", "control-functions": "control-functions",
        "arrays-strings": "arrays-strings", "pointers-memory": "pointers-memory",
        "structures-files": "structures-files", "data-numerics": "data-numerics",
        "searching-sorting": "arrays-strings", "data-structures": "arrays-strings",
        algorithms: "debugging-tools", "debugging-tools": "debugging-tools"
    };
    const cSkillToCoding = {
        fundamentals: "fundamentals", "control-functions": "control-functions",
        "arrays-strings": "arrays-matrices", "pointers-memory": "pointers-memory",
        "structures-files": "structures-files", "data-numerics": "data-numerics",
        "searching-sorting": "searching-sorting", "data-structures": "data-structures",
        algorithms: "algorithms", "debugging-tools": "fundamentals"
    };
    const pythonLabels = {
        "python-basics": "Python Basics", "control-functions": "Control Flow & Functions",
        collections: "Collections", strings: "Strings & Parsing", oop: "Object-Oriented Python",
        "exceptions-files": "Exceptions & Files", "iterators-functional": "Iteration, Functional Tools & Algorithms",
        "data-ai": "Data & AI Foundations"
    };
    const pythonOrder = ["python-basics", "control-functions", "collections", "strings", "oop", "exceptions-files", "iterators-functional", "data-ai"];
    const identityMap = Object.fromEntries(pythonOrder.map((key) => [key, key]));
    const pythonCodingToSkill = { ...identityMap, algorithms: "iterators-functional" };
    const pythonSkillToCoding = { ...identityMap, "iterators-functional": "algorithms" };
    const dsaLabels = {
        "foundations-complexity": "Foundations & Complexity", "arrays-strings": "Arrays & Strings",
        "linked-lists": "Linked Lists", "stacks-queues": "Stacks, Queues & Deques",
        "trees-heaps": "Trees, BSTs, Heaps & Tries", graphs: "Graphs",
        "hashing-sorting": "Hashing, Searching & Sorting", "greedy-dp": "Greedy Methods & Dynamic Programming"
    };
    const dsaOrder = Object.keys(dsaLabels);
    const dsaIdentityMap = Object.fromEntries(dsaOrder.map((key) => [key, key]));
    const dsaCodingToSkill = {
        "arrays-prefix": "arrays-strings", "strings-patterns": "arrays-strings",
        "linked-lists": "linked-lists", "stacks-queues": "stacks-queues",
        "trees-bst": "trees-heaps", "heaps-hashing": "trees-heaps",
        graphs: "graphs", "searching-sorting": "hashing-sorting",
        greedy: "greedy-dp", "dynamic-programming": "greedy-dp"
    };
    const dsaSkillToCoding = {
        "foundations-complexity": "arrays-prefix", "arrays-strings": "arrays-prefix",
        "linked-lists": "linked-lists", "stacks-queues": "stacks-queues",
        "trees-heaps": "trees-bst", graphs: "graphs",
        "hashing-sorting": "searching-sorting", "greedy-dp": "dynamic-programming"
    };
    const databaseLabels = {
        "relational-foundations": "Relational Foundations", "sql-retrieval-filtering": "SQL Retrieval & Filtering",
        "joins-set-operations": "Joins & Set Operations", "grouping-subqueries-ctes": "Grouping, Subqueries & CTEs",
        "schema-normalization": "Schema Design & Normalization", "indexes-optimization": "Indexes & Query Optimization",
        "transactions-concurrency": "Transactions & Concurrency", "views-security-reliability": "Views, Security & Reliability"
    };
    const databaseOrder = Object.keys(databaseLabels);
    const databaseIdentityMap = Object.fromEntries(databaseOrder.map((key) => [key, key]));
    const databaseCodingLabels = {
        "sql-basics": "Basic SELECT & Projection", "filtering-sorting": "Filtering & Sorting",
        "aggregates-grouping": "Aggregates & Grouping", joins: "Joins & Relationships",
        "subqueries-ctes": "Subqueries & CTEs", "strings-dates-case": "Strings, Dates & CASE",
        "set-operations": "Set Operations", "window-functions": "Window Functions",
        "data-quality": "Data Quality & Validation", "advanced-analytics": "Advanced SQL Analytics"
    };
    const databaseCodingToSkill = {
        "sql-basics": "relational-foundations", "filtering-sorting": "sql-retrieval-filtering",
        "aggregates-grouping": "grouping-subqueries-ctes", joins: "joins-set-operations",
        "subqueries-ctes": "grouping-subqueries-ctes", "strings-dates-case": "sql-retrieval-filtering",
        "set-operations": "joins-set-operations", "window-functions": "indexes-optimization",
        "data-quality": "views-security-reliability", "advanced-analytics": "indexes-optimization"
    };
    const databaseSkillToCoding = {
        "relational-foundations": "sql-basics", "sql-retrieval-filtering": "filtering-sorting",
        "joins-set-operations": "joins", "grouping-subqueries-ctes": "subqueries-ctes",
        "schema-normalization": "data-quality", "indexes-optimization": "advanced-analytics",
        "transactions-concurrency": "data-quality", "views-security-reliability": "data-quality"
    };
    const coreCsLabels = {
        "os-processes-threads": "OS Processes, Threads & System Calls",
        "scheduling-concurrency": "Scheduling, Synchronization & Deadlocks",
        "memory-storage-files": "Memory, Storage & File Systems",
        "networking-addressing": "Networking Models, Addressing & Routing",
        "transport-app-security": "Transport, Application Protocols & Security",
        "oop-design": "Object-Oriented Programming & Design Principles",
        "software-engineering": "Software Engineering, SDLC & Agile",
        "testing-git-apis": "Testing, Git, APIs & System Fundamentals"
    };
    const coreCsOrder = Object.keys(coreCsLabels);
    const coreCsIdentityMap = Object.fromEntries(coreCsOrder.map((key) => [key, key]));
    const aptitudeLabels = {
        "percentages-change": "Percentages, Change & Comparisons", "ratio-average-mixtures": "Ratios, Averages & Mixtures",
        "profit-interest": "Profit, Discount & Interest", "time-work-pipes": "Time, Work & Pipes",
        "speed-distance-trains": "Speed, Distance, Trains & Boats", "numbers-algebra": "Number Systems, Series & Algebra",
        "logical-patterns": "Logical Patterns, Coding & Clocks", "arrangements-deductions": "Arrangements, Relations & Deductions",
        "data-interpretation": "Data Interpretation & Sufficiency", "verbal-ability": "Verbal Ability & Comprehension"
    };
    const aptitudeOrder = Object.keys(aptitudeLabels);
    const aptitudeIdentityMap = Object.fromEntries(aptitudeOrder.map((key) => [key, key]));
    const aiMlLabels = {
        "ai-foundations": "AI Foundations & Intelligent Systems", "math-probability": "Math, Probability & Statistics",
        "data-preparation": "Data Preparation & Feature Engineering", regression: "Regression Models & Regularisation",
        "classification-metrics": "Classification & Performance Metrics",
        "unsupervised-learning": "Unsupervised Learning & Dimensionality Reduction",
        "neural-networks": "Neural Networks & Deep Learning",
        "evaluation-responsible-ai": "Evaluation, Deployment & Responsible AI"
    };
    const aiMlOrder = Object.keys(aiMlLabels);
    const aiMlIdentityMap = Object.fromEntries(aiMlOrder.map((key) => [key, key]));
    const aiMlCodingLabels = {
        "vectors-matrices": "Vectors, Matrices & Linear Models", statistics: "Statistics & Information Measures",
        probability: "Probability & Probabilistic Models", "data-preparation": "Data Preparation & Feature Engineering",
        regression: "Regression & Optimisation", classification: "Classification & Metrics",
        clustering: "Clustering & Unsupervised Learning", "model-evaluation": "Model Evaluation & Selection",
        "neural-networks": "Neural Networks & Deep Learning", "responsible-production": "Responsible AI & Production Monitoring"
    };
    const aiMlCodingToSkill = {
        "vectors-matrices": "math-probability", statistics: "math-probability", probability: "ai-foundations",
        "data-preparation": "data-preparation", regression: "regression", classification: "classification-metrics",
        clustering: "unsupervised-learning", "model-evaluation": "evaluation-responsible-ai",
        "neural-networks": "neural-networks", "responsible-production": "evaluation-responsible-ai"
    };
    const aiMlSkillToCoding = {
        "ai-foundations": "probability", "math-probability": "vectors-matrices", "data-preparation": "data-preparation",
        regression: "regression", "classification-metrics": "classification", "unsupervised-learning": "clustering",
        "neural-networks": "neural-networks", "evaluation-responsible-ai": "model-evaluation"
    };
    const mcqLabels = topic === "python" ? pythonLabels : topic === "dsa" ? dsaLabels : topic === "database" ? databaseLabels : coreCsTopic ? coreCsLabels : aptitudeTopic ? aptitudeLabels : aiMlTopic ? aiMlLabels : cMcqLabels;
    const codingLabels = topic === "python" ? pythonLabels : topic === "dsa" ? dsaLabels : topic === "database" ? databaseCodingLabels : coreCsTopic ? coreCsLabels : aptitudeTopic ? aptitudeLabels : aiMlTopic ? aiMlCodingLabels : cCodingLabels;
    const skillOrder = topic === "python" ? pythonOrder : topic === "dsa" ? dsaOrder : topic === "database" ? databaseOrder : coreCsTopic ? coreCsOrder : aptitudeTopic ? aptitudeOrder : aiMlTopic ? aiMlOrder : cSkillOrder;
    const skillLabels = topic === "python" ? pythonLabels : topic === "dsa" ? dsaLabels : topic === "database" ? databaseLabels : coreCsTopic ? coreCsLabels : aptitudeTopic ? aptitudeLabels : aiMlTopic ? aiMlLabels : cSkillLabels;
    const codingToSkill = topic === "python" ? pythonCodingToSkill : topic === "dsa" ? dsaCodingToSkill : topic === "database" ? databaseCodingToSkill : coreCsTopic ? coreCsIdentityMap : aptitudeTopic ? aptitudeIdentityMap : aiMlTopic ? aiMlCodingToSkill : cCodingToSkill;
    const skillToMcq = topic === "python" ? identityMap : topic === "dsa" ? dsaIdentityMap : topic === "database" ? databaseIdentityMap : coreCsTopic ? coreCsIdentityMap : aptitudeTopic ? aptitudeIdentityMap : aiMlTopic ? aiMlIdentityMap : cSkillToMcq;
    const skillToCoding = topic === "python" ? pythonSkillToCoding : topic === "dsa" ? dsaSkillToCoding : topic === "database" ? databaseSkillToCoding : coreCsTopic ? coreCsIdentityMap : aptitudeTopic ? aptitudeIdentityMap : aiMlTopic ? aiMlSkillToCoding : cSkillToCoding;

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
        if (coreCsTopic && value >= 85) return ["Your Core CS evidence is interview-ready.", "Keep explanations precise and revisit the few remaining weak scenarios."];
        if (coreCsTopic && value >= 65) return ["Your Core CS foundation is taking shape.", "Increase scenario depth and repeat the weakest topic until the reasoning is reliable."];
        if (coreCsTopic && value >= 40) return ["You are building useful Core CS evidence.", "Follow the recommended revision, scenario and assessment actions in order."];
        if (coreCsTopic && value >= 15) return ["Your Core CS foundation has started.", "Build one topic at a time with revision, assessment and automatically checked scenario evidence."];
        if (coreCsTopic) return ["Build the Core CS foundation.", "Complete your first topic quiz and one Scenario Lab problem to start measuring progress."];
        if (value >= 85) return ["Interview-ready evidence is strong.", "Keep accuracy stable and close the final weak areas with timed practice."];
        if (value >= 65) return ["Your placement foundation is taking shape.", "Increase practice depth and repeat the weakest topic until it becomes reliable."];
        if (value >= 40) return ["You are building useful evidence.", "Follow the three recommended actions instead of jumping between unrelated topics."];
        if (value >= 15) return ["Your foundation has started.", assessmentOnly ? "Build one topic at a time with revision, timed assessment and consistent review." : "Build one topic at a time with revision, assessment and coding evidence."];
        return ["Build the foundation.", assessmentOnly ? `Complete your first ${topicLabel} topic quiz to start measuring learning readiness.` : topic === "database" ? "Complete your first topic quiz and SQL query challenge to start measuring your progress." : "Complete your first topic quiz and coding challenge to start measuring your progress."];
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
            skill.evidence.push(`${number(row.solved)}/${number(row.total)} ${coreCsTopic ? "scenarios" : "problems"} solved`);
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
        if (assessmentOnly) {
            const groups = Array.isArray(data.mcq_groups) ? data.mcq_groups : [];
            const completedGroups = groups.filter((row) => number(row.total) > 0 && number(row.mastered) >= number(row.total)).length;
            $("codingSolvedValue").textContent = `${completedGroups} / ${groups.length}`;
            $("codingSolvedNote").textContent = `${groups.length - completedGroups} topic groups still developing`;
            $("pointsValue").textContent = `${number(summary.active_days_14)} active days`;
            $("rankValue").textContent = `${number(summary.quiz_sessions)} submitted ${number(summary.quiz_sessions) === 1 ? "quiz" : "quizzes"}`;
        } else {
            $("codingSolvedValue").textContent = `${number(summary.solved_problems)} / ${number(summary.total_problems)}`;
            $("codingSolvedNote").textContent = number(summary.total_problems) === 0
                ? `Install the ${coreCsTopic ? "Core CS Scenario Lab" : topic === "database" ? "SQL Query Arena" : topicLabel + " coding"} seed to enable this evidence`
                : `${number(summary.attempted_problems)} attempted · ${newProblems} new`;
            $("pointsValue").textContent = `${number(summary.points)} points`;
            $("rankValue").textContent = summary.rank ? `Current ${topicLabel} leaderboard rank #${summary.rank}` : `Rank begins after a ${coreCsTopic ? "correct scenario" : topic === "database" ? "SQL query" : "coding"} submission`;
        }
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
        const fallbackKey = skillOrder[0];
        const first = weakest[0] || { key: fallbackKey, label: skillLabels[fallbackKey] };
        const second = weakest[1] || first;
        const third = weakest[2] || first;
        const summary = data.summary || {};
        const codingDifficulty = number(summary.solved_problems) >= 40 ? "advanced" : number(summary.solved_problems) >= 12 ? "intermediate" : "beginner";
        const box = $("nextActions");
        if (coreCsTopic) {
            box.replaceChildren(
                makeAction(1, "REVISE", `Strengthen ${first.label}`, "Read five explained MCQs and mark only concepts you can recall.", `mcq-library.html?topic=core-cs&group=${encodeURIComponent(skillToMcq[first.key])}`),
                makeAction(2, "SCENARIO", `Apply ${second.label}`, `Solve ${codingDifficulty} scenarios and verify the exact result or decision.`, `core-cs-problems.html?group=${encodeURIComponent(skillToCoding[second.key])}&difficulty=${codingDifficulty}`),
                makeAction(3, "ASSESS", `Test ${third.label}`, "Take a focused quiz; explanations appear after submission.", `quiz.html?topic=core-cs&mode=topic&group=${encodeURIComponent(skillToMcq[third.key])}`)
            );
            return;
        }
        if (number(summary.total_problems) === 0) {
            box.replaceChildren(
                makeAction(1, "REVISE", `Strengthen ${first.label}`, "Read five explained MCQs and mark only the concepts you can recall.", `mcq-library.html?topic=${topic}&group=${encodeURIComponent(skillToMcq[first.key])}`),
                makeAction(2, "ASSESS", `Test ${second.label}`, "Take a focused quiz and review every option after submission.", `quiz.html?topic=${topic}&mode=topic&group=${encodeURIComponent(skillToMcq[second.key])}`),
                makeAction(3, "MOCK", `${topicLabel} mixed placement check`, "Combine all topics under time pressure after focused revision.", `quiz.html?topic=${topic}&mode=mock`)
            );
            return;
        }
        box.replaceChildren(
            makeAction(1, "REVISE", `Strengthen ${first.label}`, "Read five explained MCQs and mark only the concepts you can recall.", `mcq-library.html?topic=${topic}&group=${encodeURIComponent(skillToMcq[first.key])}`),
            makeAction(2, topic === "database" ? "QUERY" : "CODE", `Solve ${second.label}`, `Continue with ${codingDifficulty} ${topic === "database" ? "SQL problems" : "problems"} and submit against all protected tests.`, `coding.html?topic=${topic}&mode=topic&group=${encodeURIComponent(skillToCoding[second.key])}&difficulty=${codingDifficulty}`),
            makeAction(3, "ASSESS", `Test ${third.label}`, "Take a focused quiz; explanations appear only after you submit it.", `quiz.html?topic=${topic}&mode=topic&group=${encodeURIComponent(skillToMcq[third.key])}`)
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
        if (!rows?.length) {
            const note = document.createElement("p");
            note.className = "recent-empty";
            note.textContent = coreCsTopic ? "Core CS scenario evidence will appear after the V23 schema and problem seed are installed." : `${topicLabel} execution evidence will appear after the coding seed is installed and a query is submitted.`;
            box.append(note);
            return;
        }
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
        $("companyReadinessLink").href = `coding.html?topic=${topic}&mode=company&company=${encodeURIComponent(row.company || "tcs")}`;
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
            option.value = "";
            option.textContent = "Coding collections not installed";
            option.disabled = true;
            select.append(option);
            $("companyReadinessValue").textContent = "—";
            $("companyReadinessCount").textContent = "MCQ path available";
            $("companyReadinessBar").style.width = "0%";
            $("companyReadinessMessage").textContent = `Install the ${topicLabel} coding seed to enable company-linked execution evidence.`;
            $("companyReadinessLink").href = `mcq-library.html?topic=${topic}`;
            $("companyReadinessLink").textContent = `Continue ${topicLabel} revision →`;
            return;
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
        while (weak.length < 3) weak.push({ key: skillOrder[0], label: skillLabels[skillOrder[0]] });
        const company = data.companies?.[0]?.company || "tcs";
        const box = $("studyPlan");
        if (coreCsTopic) {
            box.replaceChildren(
                planItem("1", "READ", weak[0].label, "Review five explained MCQs.", `mcq-library.html?topic=core-cs&group=${encodeURIComponent(weak[0].key)}`),
                planItem("2", "SCENARIO", weak[0].label, "Solve two beginner diagnostic problems.", `core-cs-problems.html?group=${encodeURIComponent(weak[0].key)}&difficulty=beginner`),
                planItem("3", "ASSESS", weak[0].label, "Take a focused ten-question quiz.", `quiz.html?topic=core-cs&mode=topic&group=${encodeURIComponent(weak[0].key)}&count=10`),
                planItem("4", "READ", weak[1].label, "Revise the next weakest concept.", `mcq-library.html?topic=core-cs&group=${encodeURIComponent(weak[1].key)}`),
                planItem("5", "SCENARIO", weak[1].label, "Submit two automatically checked answers.", `core-cs-problems.html?group=${encodeURIComponent(weak[1].key)}`),
                planItem("6", "TRACK", "Systems preparation", "Practise a product and core-systems set.", "core-cs-problems.html?target=product"),
                planItem("7", "REVIEW", "Mixed Core CS check", "Finish with a mixed quiz and review mistakes.", "quiz.html?topic=core-cs&mode=mock")
            );
            return;
        }
        if (number(data.summary?.total_problems) === 0) {
            box.replaceChildren(
                planItem("1", "READ", weak[0].label, "Review five explained MCQs.", `mcq-library.html?topic=${topic}&group=${encodeURIComponent(skillToMcq[weak[0].key])}`),
                planItem("2", "ASSESS", weak[0].label, "Take a focused five-question quiz.", `quiz.html?topic=${topic}&mode=topic&group=${encodeURIComponent(skillToMcq[weak[0].key])}&count=5`),
                planItem("3", "READ", weak[1].label, "Build the next weakest concept.", `mcq-library.html?topic=${topic}&group=${encodeURIComponent(skillToMcq[weak[1].key])}`),
                planItem("4", "ASSESS", weak[1].label, "Take a focused topic quiz.", `quiz.html?topic=${topic}&mode=topic&group=${encodeURIComponent(skillToMcq[weak[1].key])}`),
                planItem("5", "READ", weak[2].label, "Review explanations and correction rules.", `mcq-library.html?topic=${topic}&group=${encodeURIComponent(skillToMcq[weak[2].key])}`),
                planItem("6", "TRACK", "Placement pattern", "Take a preparation-track assessment.", `quiz.html?topic=${topic}&mode=track&track=general`),
                planItem("7", "MOCK", `Mixed ${topicLabel} check`, "Finish with a mixed quiz and review mistakes.", `quiz.html?topic=${topic}&mode=mock`)
            );
            return;
        }
        box.replaceChildren(
            planItem("1", "READ", weak[0].label, "Review five explained MCQs.", `mcq-library.html?topic=${topic}&group=${encodeURIComponent(skillToMcq[weak[0].key])}`),
            planItem("2", topic === "database" ? "QUERY" : "CODE", weak[0].label, `Solve two beginner ${topic === "database" ? "SQL problems" : "problems"}.`, `coding.html?topic=${topic}&mode=topic&group=${encodeURIComponent(skillToCoding[weak[0].key])}&difficulty=beginner`),
            planItem("3", "ASSESS", weak[0].label, "Take a focused 10-question quiz.", `quiz.html?topic=${topic}&mode=topic&group=${encodeURIComponent(skillToMcq[weak[0].key])}&count=10`),
            planItem("4", "READ", weak[1].label, "Revise the next weakest skill.", `mcq-library.html?topic=${topic}&group=${encodeURIComponent(skillToMcq[weak[1].key])}`),
            planItem("5", topic === "database" ? "QUERY" : "CODE", weak[1].label, `Submit two ${topic === "database" ? "SQL queries" : "coding solutions"}.`, `coding.html?topic=${topic}&mode=topic&group=${encodeURIComponent(skillToCoding[weak[1].key])}`),
            planItem("6", "TARGET", companyLabels[company] || company, "Explore one company-mapped collection.", `coding.html?topic=${topic}&mode=company&company=${encodeURIComponent(company)}`),
            planItem("7", "REVIEW", "Mixed placement check", "Take a mixed quiz and review mistakes.", `quiz.html?topic=${topic}&mode=mock`)
        );
    }

    function friendlyActivityTitle(row) {
        if (row.kind === "core-lab") return row.title || "Core CS scenario";
        if (row.kind !== "quiz") return row.title || "Coding submission";
        return mcqLabels[row.title] ? `${mcqLabels[row.title]} quiz` : (row.title || `Mixed ${topicLabel} assessment`);
    }

    function renderRecent(rows) {
        const box = $("recentActivity");
        box.replaceChildren();
        if (!rows?.length) {
            const empty = document.createElement("p");
            empty.className = "recent-empty";
            empty.textContent = coreCsTopic
                ? "No submitted activity yet. Complete a Core CS quiz or Scenario Lab problem to begin your evidence trail."
                : assessmentOnly
                ? `No submitted activity yet. Complete ${aptitudeTopic ? "an" : "a"} ${topicLabel} topic quiz to begin your evidence trail.`
                : `No submitted activity yet. Complete a quiz or submit a ${topic === "database" ? "SQL query" : "coding solution"} to begin your evidence trail.`;
            box.append(empty);
            return;
        }
        const formatter = new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
        rows.forEach((row) => {
            const item = document.createElement("article");
            item.className = "recent-row";
            const icon = document.createElement("span");
            icon.textContent = row.kind === "quiz" ? "Q" : row.kind === "core-lab" ? "CS" : topic === "database" ? "SQL" : aiMlTopic ? "ML" : topic === "python" ? "Py" : topic === "dsa" ? "DS" : "C";
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

    async function loadCareerEvidence() {
        const panel = $("careerEvidencePanel");
        if (!panel || !client || !currentUser) return;
        try {
            const result = await client.rpc("get_placement_evidence_summary");
            if (result.error) throw result.error;
            const summary = result.data || {};
            $("careerReadiness").textContent = `${number(summary.readiness)}%`;
            $("careerResume").textContent = `${number(summary.resume_score)} / 100`;
            $("careerProjects").textContent = String(number(summary.project_count));
            $("careerProof").textContent = String(number(summary.evidence_count));
            $("careerAdvice").textContent = number(summary.resume_score) < 65
                ? "Build and audit your resume before adding more application claims."
                : number(summary.defensible_projects) < 1
                    ? "Turn one project into a defensible story with ownership, testing and measurable results."
                    : number(summary.evidence_count) < 2
                        ? "Attach verifiable links for the strongest claims on your resume."
                        : "Your career evidence is taking shape. Practise the tailored project-defence questions next.";
            panel.hidden = false;
        } catch (error) {
            panel.hidden = true;
            if (!/function .* does not exist|schema cache/i.test(String(error?.message || ""))) console.warn("Career evidence summary is unavailable", error);
        }
    }

    async function loadLatestMock() {
        const panel = $("latestMockPanel");
        if (!panel || !client || !currentUser) return;
        try {
            const history = await client.rpc("get_my_placement_mocks");
            if (history.error) throw history.error;
            const latest = Array.isArray(history.data) ? history.data[0] : null;
            const rounds = $("latestMockRounds");
            rounds.replaceChildren();
            if (!latest) {
                $("latestMockScore").textContent = "No baseline yet";
                $("latestMockNote").textContent = "Complete aptitude, technical, coding and interview rounds in one connected session.";
                $("latestMockLink").href = "mock-drive.html";
                $("latestMockLink").textContent = "Build a mock drive →";
                panel.hidden = false;
                return;
            }
            if (latest.status === "abandoned") {
                $("latestMockScore").textContent = "Previous mock expired";
                $("latestMockNote").textContent = "Start a new short diagnostic to establish a current four-round baseline.";
                $("latestMockLink").href = "mock-drive.html";
                $("latestMockLink").textContent = "Build a new mock →";
                panel.hidden = false;
                return;
            }
            if (latest.status !== "completed") {
                $("latestMockScore").textContent = "Mock in progress";
                $("latestMockNote").textContent = `Continue from the ${String(latest.current_round || "aptitude").replace("-", " ")} round.`;
                $("latestMockLink").href = `mock-session.html?session=${encodeURIComponent(latest.id)}`;
                $("latestMockLink").textContent = "Resume mock →";
                panel.hidden = false;
                return;
            }
            const detail = await client.rpc("get_placement_mock_session", { p_session_id: latest.id });
            if (detail.error) throw detail.error;
            const report = detail.data?.report || {};
            $("latestMockScore").textContent = `${number(report.application_readiness)}% application readiness`;
            $("latestMockNote").textContent = `${report.band || "Diagnostic complete"} · Mock performance ${number(report.mock_score)}% · Career evidence ${number(report.evidence_readiness)}%.`;
            const labels = { aptitude: "Aptitude", technical: "Technical", coding: "Coding", interview: "Interview" };
            Object.entries(labels).forEach(([key, label]) => {
                const item = document.createElement("span");
                item.textContent = `${label} ${number(report.round_scores?.[key])}%`;
                rounds.append(item);
            });
            $("latestMockLink").href = `mock-result.html?session=${encodeURIComponent(latest.id)}`;
            $("latestMockLink").textContent = "View diagnostic →";
            panel.hidden = false;
        } catch (error) {
            panel.hidden = true;
            if (!/function .* does not exist|schema cache/i.test(String(error?.message || ""))) console.warn("Mock summary is unavailable", error);
        }
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
        loadCareerEvidence();
        loadLatestMock();
    }

    function readableError(error) {
        const message = String(error?.message || "Unknown dashboard error");
        if (/get_core_cs_lab_summary|core_cs_/i.test(message)) return "Run Placement/core-cs-problem-lab-schema-v23.sql, then Placement/core-cs-problem-seed-v23.sql in a separate Supabase query, and retry.";
        if (/get_placement_dashboard|function .* does not exist|schema cache/i.test(message)) return "Run the latest Placement/placement-v2-schema.sql once in Supabase SQL Editor, then retry.";
        if (/jwt|sign in|auth|permission|401|403/i.test(message)) return "Your sign-in session is unavailable. Return to the Placement page, sign in again, then open My Progress.";
        if (/failed to fetch|networkerror|load failed/i.test(message)) return "The browser cannot reach Supabase. Check the project status and internet connection, then retry.";
        return "Supabase returned: " + message;
    }

    function mergeCoreCsDashboard(base, lab) {
        const baseData = base || {};
        const baseSummary = baseData.summary || {};
        const labSummary = lab?.summary || {};
        const activeDays = number(labSummary.active_days_14);
        const readiness = Math.min(100, Math.round(
            (number(baseSummary.total_mcq) ? 35 * number(baseSummary.mastered_mcq) / number(baseSummary.total_mcq) : 0) +
            (number(labSummary.total_problems) ? 45 * number(labSummary.solved_problems) / number(labSummary.total_problems) : 0) +
            (10 * number(baseSummary.quiz_accuracy) / 100) +
            (10 * Math.min(activeDays, 7) / 7)
        ));
        return {
            ...baseData,
            summary: { ...baseSummary, ...labSummary, readiness },
            coding_groups: Array.isArray(lab?.problem_groups) ? lab.problem_groups : [],
            difficulties: Array.isArray(lab?.difficulties) ? lab.difficulties : [],
            daily_activity: Array.isArray(lab?.daily_activity) ? lab.daily_activity : [],
            recent_activity: Array.isArray(lab?.recent_activity) ? lab.recent_activity : [],
            companies: []
        };
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
            const result = await client.rpc("get_placement_dashboard", { p_topic: topic });
            if (result.error) throw result.error;
            if (coreCsTopic) {
                const labResult = await client.rpc("get_core_cs_lab_summary");
                if (labResult.error) throw labResult.error;
                renderDashboard(mergeCoreCsDashboard(result.data, labResult.data));
            } else {
                renderDashboard(result.data);
            }
        } catch (error) {
            $("progressErrorMessage").textContent = readableError(error);
            displayState("progressError");
            console.error("Unable to load placement progress", error);
        }
    }

    function initialize() {
        document.title = `My ${topicLabel} Placement Progress | CodeBhavya`;
        if ($("progressTopicLabel")) $("progressTopicLabel").textContent = `${topicLabel} Progress`;
        if ($("progressIntroEyebrow")) $("progressIntroEyebrow").textContent = `YOUR ${topicLabel.toUpperCase()} PLACEMENT COMMAND CENTRE`;
        if ($("progressProblemLink")) {
            $("progressProblemLink").href = coreCsTopic ? "core-cs-problems.html" : assessmentOnly ? `mcq-library.html?topic=${topic}` : `coding.html?topic=${topic}`;
            if (coreCsTopic) $("progressProblemLink").textContent = "Open Scenario Lab →";
            if (assessmentOnly) $("progressProblemLink").textContent = "Open MCQ revision →";
        }
        if ($("navMcq")) $("navMcq").href = `mcq-library.html?topic=${topic}`;
        if ($("navQuiz")) { $("navQuiz").href = `quiz.html?topic=${topic}`; $("navQuiz").textContent = `${topicLabel} Quiz`; }
        if ($("navCoding")) {
            $("navCoding").href = coreCsTopic ? "core-cs-problems.html" : assessmentOnly ? `practice.html#${topic}-practice` : `coding.html?topic=${topic}`;
            $("navCoding").textContent = coreCsTopic ? "Scenario Lab" : assessmentOnly ? "Practice Hub" : topic === "database" ? "SQL Arena" : aiMlTopic ? "AI/ML Lab" : "Coding Arena";
        }
        if ($("navProgress")) $("navProgress").href = `progress.html?topic=${topic}`;
        if (assessmentOnly) {
            const signedOutCopy = $("progressSignedOut")?.querySelector("p");
            if (signedOutCopy) signedOutCopy.textContent = `Your submitted ${topicLabel} quizzes, mastery and study consistency are securely connected to your account.`;
            const activityNote = document.querySelector(".activity-note");
            if (activityNote) activityNote.textContent = "A day counts when you submit a scored quiz.";
        }
        if (topic === "database") {
            const formula = document.querySelectorAll(".readiness-formula span");
            if (formula[1]) formula[1].innerHTML = "<b>45%</b> SQL execution";
            const codingHeading = $("codingSolvedValue")?.closest("article")?.querySelector("small");
            if (codingHeading) codingHeading.textContent = "SQL QUERY PROGRESS";
            const skillEvidence = $("skillProgressGrid")?.closest("section")?.querySelector("header > span");
            if (skillEvidence) skillEvidence.textContent = "MCQ + query evidence";
            const difficultyHeading = $("difficultyTitle");
            if (difficultyHeading) difficultyHeading.textContent = "SQL difficulty completion";
        } else if (coreCsTopic) {
            const formula = document.querySelectorAll(".readiness-formula span");
            if (formula[0]) formula[0].innerHTML = "<b>35%</b> MCQ mastery";
            if (formula[1]) formula[1].innerHTML = "<b>45%</b> scenario evidence";
            if (formula[2]) formula[2].innerHTML = "<b>10%</b> quiz accuracy";
            if (formula[3]) { formula[3].innerHTML = "<b>10%</b> consistency"; formula[3].hidden = false; }
            const evidenceCards = document.querySelectorAll(".evidence-grid article");
            const topicHeading = evidenceCards[2]?.querySelector("small");
            const routineHeading = evidenceCards[3]?.querySelector("small");
            if (topicHeading) topicHeading.textContent = "SCENARIO PROGRESS";
            if (routineHeading) routineHeading.textContent = "LAB POINTS & RANK";
            const topicIcon = evidenceCards[2]?.querySelector(".evidence-icon");
            const routineIcon = evidenceCards[3]?.querySelector(".evidence-icon");
            if (topicIcon) topicIcon.textContent = "CS";
            if (routineIcon) routineIcon.textContent = "★";
            const skillEvidence = $("skillProgressGrid")?.closest("section")?.querySelector("header > span");
            if (skillEvidence) skillEvidence.textContent = "MCQ + scenario evidence";
            const intro = document.querySelector(".progress-intro p");
            if (intro) intro.textContent = "Every number below combines Core CS knowledge with automatically checked scenario reasoning. Strengthen the weakest evidence first.";
            const loadingCopy = $("progressLoading")?.querySelector("p");
            if (loadingCopy) loadingCopy.textContent = "Combining MCQ mastery, scenario solutions, quiz accuracy and learning consistency.";
            const lowerColumns = document.querySelector(".lower-columns");
            if (lowerColumns) lowerColumns.classList.add("core-lab-only");
            const companyPanel = document.querySelector(".company-readiness");
            if (companyPanel) companyPanel.hidden = true;
            const codingHeading = $("codingSolvedValue")?.closest("article")?.querySelector("small");
            if (codingHeading) codingHeading.textContent = "SCENARIO PROGRESS";
            const difficultyHeading = $("difficultyTitle");
            if (difficultyHeading) difficultyHeading.textContent = "Scenario difficulty completion";
            const activityNote = document.querySelector(".activity-note");
            if (activityNote) activityNote.textContent = "A day counts when you submit a scored quiz or Scenario Lab answer.";
        } else if (aptitudeTopic) {
            const formula = document.querySelectorAll(".readiness-formula span");
            if (formula[0]) formula[0].innerHTML = "<b>75%</b> question mastery";
            if (formula[1]) formula[1].innerHTML = "<b>15%</b> timed accuracy";
            if (formula[2]) formula[2].innerHTML = "<b>10%</b> consistency";
            if (formula[3]) formula[3].hidden = true;
            const evidenceCards = document.querySelectorAll(".evidence-grid article");
            const topicHeading = evidenceCards[2]?.querySelector("small");
            const routineHeading = evidenceCards[3]?.querySelector("small");
            if (topicHeading) topicHeading.textContent = "TOPIC GROUPS";
            if (routineHeading) routineHeading.textContent = "PRACTICE ROUTINE";
            const topicIcon = evidenceCards[2]?.querySelector(".evidence-icon");
            const routineIcon = evidenceCards[3]?.querySelector(".evidence-icon");
            if (topicIcon) topicIcon.textContent = "10";
            if (routineIcon) routineIcon.textContent = "↻";
            const skillEvidence = $("skillProgressGrid")?.closest("section")?.querySelector("header > span");
            if (skillEvidence) skillEvidence.textContent = "revision + timed quiz evidence";
            const intro = document.querySelector(".progress-intro p");
            if (intro) intro.textContent = "Every number below comes from completed Aptitude & Reasoning assessments and practice activity. Strengthen accuracy first, then speed.";
            const loadingCopy = $("progressLoading")?.querySelector("p");
            if (loadingCopy) loadingCopy.textContent = "Combining question mastery, timed accuracy and practice consistency.";
            const lowerColumns = document.querySelector(".lower-columns");
            if (lowerColumns) lowerColumns.hidden = true;
        } else if (aiMlTopic) {
            const codingHeading = $("codingSolvedValue")?.closest("article")?.querySelector("small");
            if (codingHeading) codingHeading.textContent = "APPLIED LAB PROGRESS";
            const skillEvidence = $("skillProgressGrid")?.closest("section")?.querySelector("header > span");
            if (skillEvidence) skillEvidence.textContent = "MCQ + applied Python evidence";
            const difficultyHeading = $("difficultyTitle");
            if (difficultyHeading) difficultyHeading.textContent = "AI & ML problem completion";
            const intro = document.querySelector(".progress-intro p");
            if (intro) intro.textContent = "Every number below combines AI & ML knowledge with submitted pure-Python implementations. Strengthen the weakest evidence first.";
        }
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
