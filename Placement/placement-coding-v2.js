(function () {
    "use strict";

    const cloud = window.CodeBhavyaSupabase || {};
    const client = cloud.client || null;
    const $ = (id) => document.getElementById(id);
    const targetLabels = {
        general: "General Campus",
        service: "Foundation Hiring",
        product: "Product Engineering",
        ai: "Data, AI & Analytics"
    };

    let user = null;
    let problems = [];
    let active = null;
    let busy = false;
    let editor = null;
    let lastSubmissionId = null;
    let draftTimer = null;
    const problemLoadTimeoutMs = 15000;

    function setStatus(text, tone = "neutral") {
        $("judgeStatus").textContent = text;
        $("judgeStatus").dataset.tone = tone;
    }

    function setEmpty(title, text) {
        const empty = $("codingEmpty");
        empty.querySelector("h2").textContent = title;
        empty.querySelector("p").textContent = text;
    }

    function showWorkspace(hasProblem) {
        const empty = $("codingEmpty");
        const workspace = $("codingActive");
        empty.hidden = hasProblem;
        workspace.hidden = !hasProblem;
        empty.style.display = hasProblem ? "none" : "";
        workspace.style.display = hasProblem ? "grid" : "none";
    }

    function starter(problem) {
        const value = problem?.starter_code || {};
        return value.c || "#include <stdio.h>\n\nint main(void) {\n    // Write your solution here\n    return 0;\n}\n";
    }

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

    function withTimeout(request, milliseconds, message) {
        let timer;
        const timeout = new Promise((_resolve, reject) => {
            timer = window.setTimeout(() => reject(new Error(message)), milliseconds);
        });
        return Promise.race([Promise.resolve(request), timeout]).finally(() => window.clearTimeout(timer));
    }

    function readableProblemError(error) {
        const message = String(error?.message || "Unknown database error");
        if (/timed out/i.test(message)) {
            return "The database did not respond within 15 seconds. Check that the Supabase project is active, then reload this challenge.";
        }
        if (/failed to fetch|networkerror|load failed/i.test(message)) {
            return "The browser cannot reach Supabase. Check the project URL, internet connection and Supabase project status.";
        }
        if (/column .* does not exist/i.test(message)) {
            return "The Coding Arena database schema is older than the page. Run the latest placement-v2-schema.sql file.";
        }
        if (/permission|row-level security|401|403/i.test(message)) {
            return "Supabase blocked the problem query. Confirm the published-problems read policy and anon access from the placement schema.";
        }
        return "Supabase returned: " + message;
    }

    function updateFallbackLines() {
        if (editor) return;
        const textarea = $("codeEditor");
        const count = textarea.value.split("\n").length;
        $("lineNumbers").textContent = Array.from({ length: count }, (_, index) => index + 1).join("\n");
        $("lineNumbers").scrollTop = textarea.scrollTop;
    }

    function initializeEditor() {
        const textarea = $("codeEditor");
        if (window.CodeMirror) {
            editor = window.CodeMirror.fromTextArea(textarea, {
                mode: "text/x-csrc",
                lineNumbers: true,
                matchBrackets: true,
                autoCloseBrackets: true,
                indentUnit: 4,
                tabSize: 4,
                indentWithTabs: false,
                lineWrapping: false
            });
            textarea.closest(".editor-shell").classList.add("has-codemirror");
            editor.getWrapperElement().setAttribute("data-gramm", "false");
            editor.getInputField().setAttribute("data-gramm", "false");
            editor.setSize("100%", "100%");

            if (typeof editor.addOverlay === "function") {
                const builtins = /^(?:printf|scanf|fgets|puts|putchar|getchar|strlen|strcmp|strcpy|strncpy|malloc|calloc|realloc|free|abs|labs|sqrt|pow|tolower|toupper|isdigit|isalpha|qsort)\b/;
                editor.addOverlay({
                    token(stream) {
                        if (stream.match(builtins)) return "builtin";
                        stream.next();
                        while (!stream.eol()) {
                            if (stream.match(builtins, false)) break;
                            stream.next();
                        }
                        return null;
                    }
                });
            }
            editor.on("change", scheduleDraftSave);
            return;
        }

        textarea.addEventListener("input", () => {
            updateFallbackLines();
            scheduleDraftSave();
        });
        textarea.addEventListener("scroll", () => {
            $("lineNumbers").scrollTop = textarea.scrollTop;
        });
        textarea.addEventListener("keydown", (event) => {
            if (event.key !== "Tab") return;
            event.preventDefault();
            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;
            textarea.setRangeText("    ", start, end, "end");
            updateFallbackLines();
        });
    }

    function editorValue() {
        return editor ? editor.getValue() : $("codeEditor").value;
    }

    function setEditorValue(value) {
        if (editor) {
            editor.setValue(value);
            window.setTimeout(() => editor.refresh(), 0);
        } else {
            $("codeEditor").value = value;
            updateFallbackLines();
        }
    }

    function draftKey() {
        if (!active?.slug) return null;
        return `codebhavya-c-draft:${user?.id || "guest"}:${active.slug}`;
    }

    function storedDraft() {
        const key = draftKey();
        if (!key) return null;
        try {
            return localStorage.getItem(key);
        } catch (_error) {
            return null;
        }
    }

    function scheduleDraftSave() {
        if (!active) return;
        window.clearTimeout(draftTimer);
        const status = $("draftStatus");
        if (status) status.textContent = "Saving draft…";
        draftTimer = window.setTimeout(() => {
            const key = draftKey();
            if (!key) return;
            try {
                localStorage.setItem(key, editorValue());
                if (status) status.textContent = "Draft saved on this device";
            } catch (_error) {
                if (status) status.textContent = "Draft could not be saved";
            }
        }, 450);
    }

    function collapseProblems(collapsed) {
        const layout = document.querySelector(".coding-layout");
        const sidebar = document.querySelector(".problem-sidebar");
        const toggle = $("toggleProblems");
        if (!layout || !sidebar || !toggle) return;
        layout.classList.toggle("problems-collapsed", collapsed);
        sidebar.hidden = collapsed;
        toggle.textContent = collapsed ? "Show problems" : "Hide problems";
        toggle.setAttribute("aria-expanded", String(!collapsed));
        if (editor) window.setTimeout(() => editor.refresh(), 210);
    }

    function collapseStatement(collapsed) {
        $("codingActive").classList.toggle("statement-collapsed", collapsed);
        $("toggleStatement").textContent = collapsed ? "Show problem" : "Hide problem";
        $("toggleStatement").setAttribute("aria-expanded", String(!collapsed));
        if (editor) window.setTimeout(() => editor.refresh(), 0);
    }

    function resetResultState() {
        lastSubmissionId = null;
        $("revealCase").hidden = true;
        $("revealCase").disabled = false;
        $("assistanceNote").hidden = true;
        $("assistanceNote").textContent = "";
        $("testResults").replaceChildren();
        $("testSummary").textContent = "Run your code to see results.";
        setStatus("Ready");
    }

    function renderList() {
        const box = $("problemList");
        box.replaceChildren();
        $("problemCount").textContent = String(problems.length);
        if (!problems.length) {
            const message = document.createElement("p");
            message.className = "coding-muted";
            message.textContent = "No problems match this filter.";
            box.append(message);
            return;
        }

        problems.forEach((problem) => {
            const button = document.createElement("button");
            button.type = "button";
            button.className = "problem-card" + (active?.id === problem.id ? " active" : "");
            button.dataset.problemSlug = problem.slug;
            button.setAttribute("aria-pressed", String(active?.id === problem.id));
            const title = document.createElement("strong");
            title.textContent = problem.title;
            const meta = document.createElement("span");
            meta.textContent = problem.difficulty + " · " + (targetLabels[problem.target_path] || problem.target_path || "General");
            const points = document.createElement("i");
            points.textContent = problem.points + " points";
            button.append(title, meta, points);
            button.onclick = (event) => {
                event.stopPropagation();
                selectProblem(problem);
            };
            box.append(button);
        });
    }

    function openProblemFromList(event) {
        const button = event.target.closest("button[data-problem-slug]");
        if (!button || !$("problemList").contains(button)) return;
        const problem = problems.find((item) => item.slug === button.dataset.problemSlug);
        if (!problem) {
            setEmpty("Problem unavailable", "Reload the problem list and try again.");
            return;
        }
        selectProblem(problem);
    }

    function showProblemMessage(text) {
        const message = document.createElement("p");
        message.className = "coding-muted";
        message.textContent = text;
        $("problemList").replaceChildren(message);
    }

    function filtersChanged() {
        problems = [];
        active = null;
        $("problemCount").textContent = "0";
        $("toggleProblems").hidden = true;
        collapseProblems(false);
        showWorkspace(false);
        setEmpty("Filters changed", "Click Load problems to fetch this exact company and difficulty selection.");
        showProblemMessage("Filters changed. Click Load problems when you are ready.");
    }

    async function loadProblems() {
        if (!client) {
            showProblemMessage("Database connection unavailable.");
            return;
        }

        const button = $("reloadProblems");
        button.disabled = true;
        button.textContent = "Loading…";
        showProblemMessage("Loading the selected problem set…");
        collapseProblems(false);
        active = null;
        showWorkspace(false);

        try {
            const target = $("codingTarget").value;
            const difficulty = $("codingDifficulty").value;
            let query = client.from("coding_problems")
                .select("id,slug,title,topic,difficulty,target_path,statement,input_format,output_format,constraints,examples,starter_code,points,time_limit_seconds,memory_limit_kb")
                .eq("is_published", true)
                .eq("topic", "c")
                .eq("target_path", target);
            if (difficulty !== "all") query = query.eq("difficulty", difficulty);
            const result = await withTimeout(
                query.order("difficulty").order("title").limit(100),
                problemLoadTimeoutMs,
                "Problem loading timed out"
            );
            if (result.error) throw result.error;
            problems = result.data || [];
            renderList();
            $("toggleProblems").hidden = problems.length === 0;
            if (problems.length) {
                collapseProblems(false);
                showWorkspace(false);
                setEmpty(
                    "Select a C problem",
                    `Choose one of the ${problems.length} matching ${problems.length === 1 ? "problem" : "problems"} from the list.`
                );
            } else {
                setEmpty("No matching problems", "Choose another company or difficulty and load the problem set again.");
            }
        } catch (error) {
            problems = [];
            $("problemCount").textContent = "0";
            $("toggleProblems").hidden = true;
            const message = readableProblemError(error);
            showProblemMessage(message);
            setEmpty("Problems could not load", message);
            console.error("Unable to load coding problems", error);
        } finally {
            button.disabled = false;
            button.textContent = "Load problems";
        }
    }

    function configureBackLinks(parameters) {
        const query = new URLSearchParams({ topic: "c" });
        if (parameters.get("mode")) query.set("mode", parameters.get("mode"));
        if (parameters.get("group")) query.set("group", parameters.get("group"));
        if (parameters.get("track")) query.set("track", parameters.get("track"));
        if (parameters.get("company")) query.set("company", parameters.get("company"));
        if (parameters.get("difficulty")) query.set("difficulty", parameters.get("difficulty"));
        const destination = "coding.html?" + query.toString();
        if ($("backToProblems")) $("backToProblems").href = destination;
        if ($("toolbarBack")) $("toolbarBack").href = destination;
    }

    async function loadRequestedProblem() {
        const parameters = new URLSearchParams(location.search);
        configureBackLinks(parameters);
        const slug = String(parameters.get("problem") || "").trim();
        if (!slug || !/^[a-z0-9-]+$/i.test(slug)) {
            showWorkspace(false);
            setEmpty("Choose a C problem first", "Return to the Problem Library and select the challenge you want to solve.");
            return;
        }
        if (!client) {
            showWorkspace(false);
            setEmpty("Database connection unavailable", "Confirm the existing Supabase configuration, then reload this challenge.");
            return;
        }

        showWorkspace(false);
        setEmpty("Loading your C challenge…", "Preparing the problem statement, editor and saved draft.");
        try {
            const result = await withTimeout(
                client.from("coding_problems")
                    .select("id,slug,title,topic,topic_group,subtopic,problem_type,skill_tags,difficulty,target_path,statement,input_format,output_format,constraints,examples,starter_code,points,time_limit_seconds,memory_limit_kb")
                    .eq("is_published", true)
                    .eq("topic", "c")
                    .eq("slug", slug)
                    .single(),
                problemLoadTimeoutMs,
                "Problem loading timed out"
            );
            if (result.error) throw result.error;
            selectProblem(result.data);
        } catch (error) {
            const message = readableProblemError(error);
            showWorkspace(false);
            setEmpty("Problem could not load", message);
            console.error("Unable to load requested coding problem", error);
        }
    }

    function renderExamples(values) {
        const box = $("problemExamples");
        box.replaceChildren();
        arrayValue(values).forEach((example, index) => {
            const card = document.createElement("article");
            card.className = "example-card";
            const heading = document.createElement("strong");
            heading.textContent = "Example " + (index + 1);
            const input = document.createElement("pre");
            input.textContent = "Input\n" + (example.input || "");
            const output = document.createElement("pre");
            output.textContent = "Output\n" + (example.output || "");
            card.append(heading, input, output);
            if (example.explanation) {
                const explanation = document.createElement("p");
                explanation.textContent = example.explanation;
                card.append(explanation);
            }
            box.append(card);
        });
    }

    function selectProblem(problem) {
        try {
            active = problem;
            showWorkspace(true);
            collapseStatement(false);
            $("problemDifficulty").textContent = problem.difficulty || "beginner";
            $("problemTarget").textContent = targetLabels[problem.target_path] || problem.target_path || "General";
            $("problemPoints").textContent = Number(problem.points || 0) + " points";
            if ($("problemSubtopic")) $("problemSubtopic").textContent = problem.subtopic || "C programming";
            if ($("problemType")) $("problemType").textContent = String(problem.problem_type || "complete-program").replaceAll("-", " ");
            $("problemTitle").textContent = problem.title || "C problem";
            $("problemText").textContent = problem.statement || "Problem statement unavailable.";
            $("inputFormat").textContent = problem.input_format || "See the examples.";
            $("outputFormat").textContent = problem.output_format || "See the examples.";
            if ($("solveCrumb")) $("solveCrumb").textContent = problem.title || "Coding Workspace";
            document.title = (problem.title || "C Coding Workspace") + " | CodeBhavya";

            const constraints = $("problemConstraints");
            constraints.replaceChildren();
            arrayValue(problem.constraints).forEach((value) => {
                const item = document.createElement("li");
                item.textContent = value;
                constraints.append(item);
            });

            renderExamples(problem.examples);
            const draft = storedDraft();
            setEditorValue(draft === null ? starter(problem) : draft);
            if ($("draftStatus")) $("draftStatus").textContent = draft === null ? "New draft" : "Saved draft restored";
            resetResultState();
            if ($("problemList")) renderList();
            if (document.querySelector(".problem-sidebar")) collapseProblems(true);
        } catch (error) {
            console.error("Unable to open coding problem", error);
            active = null;
            showWorkspace(false);
            setEmpty("Problem could not open", "Refresh the page and load the problems again. If this continues, check the browser console for the reported field.");
            if (document.querySelector(".problem-sidebar")) collapseProblems(false);
            if ($("problemList")) renderList();
        }
    }

    function renderTests(result, mode) {
        const box = $("testResults");
        box.replaceChildren();
        const tests = result.tests || [];
        tests.forEach((test, index) => {
            const row = document.createElement("article");
            row.className = "test-row " + (test.passed ? "pass" : "fail");
            const icon = document.createElement("b");
            icon.textContent = test.passed ? "✓" : "!";
            const title = document.createElement("strong");
            title.textContent = (mode === "run" ? "Sample " : "Test ") + (index + 1);
            const status = document.createElement("span");
            status.textContent = test.status || (test.passed ? "Passed" : "Failed");
            row.append(icon, title, status);
            if (mode === "run") {
                const detail = document.createElement("pre");
                detail.textContent = "Input: " + (test.input || "(empty)") + "\nExpected: " + (test.expected_output || "") + "\nYour output: " + (test.actual_output || "");
                row.append(detail);
            }
            box.append(row);
        });

        if (result.compile_output || result.stderr) {
            const row = document.createElement("article");
            row.className = "test-row fail";
            const output = document.createElement("pre");
            output.textContent = result.compile_output || result.stderr;
            row.append(document.createTextNode("Compiler / runtime output"), output);
            box.prepend(row);
        }

        const pointText = result.points_awarded !== undefined ? " · " + result.points_awarded + " points" + (result.assisted ? " (assisted)" : "") : "";
        $("testSummary").textContent = (result.passed_tests || 0) + " of " + (result.total_tests || 0) + " tests passed" + pointText;

        if (mode === "submit") {
            lastSubmissionId = result.submission_id || null;
            $("revealCase").hidden = !(result.reveal_available && lastSubmissionId);
            $("revealCase").disabled = false;
        }
    }

    function renderRevealedCase(result) {
        const test = result.test;
        if (!test) return;
        const row = document.createElement("article");
        row.className = "test-row revealed";
        const icon = document.createElement("b");
        icon.textContent = "?";
        const title = document.createElement("strong");
        title.textContent = "Revealed failed hidden case";
        const status = document.createElement("span");
        status.textContent = test.status || "Wrong Answer";
        const detail = document.createElement("pre");
        detail.textContent = "Input:\n" + (test.input || "(empty)") + "\n\nExpected output:\n" + (test.expected_output || "") + "\n\nYour output:\n" + (test.actual_output || "");
        row.append(icon, title, status, detail);
        $("testResults").prepend(row);

        const assistedPoints = Math.ceil(Number(active?.points || 0) / 2);
        const note = $("assistanceNote");
        note.textContent = "Learning reveal used. This problem is now assisted: a future accepted solution can earn up to " + assistedPoints + " points (50%) so the leaderboard remains fair.";
        note.hidden = false;
        $("problemPoints").textContent = (active?.points || 0) + " points · assisted max " + assistedPoints;
        $("revealCase").hidden = true;
    }

    async function readableFunctionError(error) {
        const fallback = "The judge could not run this submission.";
        if (error?.context) {
            try {
                const payload = await error.context.clone().json();
                if (payload?.error) return String(payload.error);
            } catch (_ignored) {
                // The error response did not contain JSON.
            }
        }
        const message = String(error?.message || fallback);
        if (/failed to send a request/i.test(message)) return "Cannot reach the judge-submission Edge Function. Confirm that the latest function is deployed.";
        if (/non-2xx/i.test(message)) return "The Edge Function responded with an error. Open Supabase → Edge Functions → judge-submission → Logs for the exact cause.";
        return message;
    }

    async function invokeJudge(body) {
        const sessionResult = await client.auth.getSession();
        const accessToken = sessionResult.data?.session?.access_token;
        if (!accessToken) throw new Error("Your sign-in session expired. Sign in again, then retry.");
        const response = await client.functions.invoke("judge-submission", {
            headers: { Authorization: "Bearer " + accessToken },
            body
        });
        if (response.error) throw response.error;
        return response.data;
    }

    function setJudgeBusy(isBusy) {
        busy = isBusy;
        $("runSamples").disabled = isBusy;
        $("submitCode").disabled = isBusy;
        $("revealCase").disabled = isBusy;
    }

    async function judge(mode) {
        if (busy || !active || !client) return;
        if (!user) {
            setStatus("Sign in from the Placement page before running or submitting code.", "error");
            return;
        }
        const code = editorValue();
        if (code.trim().length < 20) {
            setStatus("Write a complete C program before running.", "error");
            return;
        }

        setJudgeBusy(true);
        setStatus(mode === "run" ? "Running sample tests…" : "Running 10 protected tests…");
        try {
            const result = await invokeJudge({
                problem_slug: active.slug,
                language: "c",
                source_code: code,
                mode
            });
            renderTests(result, mode);
            setStatus(result.status || "Finished", result.passed_tests === result.total_tests ? "success" : "error");
            if (mode === "submit") loadMyScore();
        } catch (error) {
            setStatus(await readableFunctionError(error), "error");
        } finally {
            setJudgeBusy(false);
        }
    }

    async function revealFailedCase() {
        if (busy || !active || !lastSubmissionId || !client) return;
        const accepted = window.confirm("Reveal one failed hidden case from your last submission? This is learning assistance, so future accepted attempts for this problem will earn at most 50% of its points.");
        if (!accepted) return;

        setJudgeBusy(true);
        setStatus("Finding a useful failed hidden case…");
        try {
            const result = await invokeJudge({
                problem_slug: active.slug,
                language: "c",
                submission_id: lastSubmissionId,
                mode: "reveal"
            });
            renderRevealedCase(result);
            setStatus("Failed hidden case revealed", "neutral");
            loadMyScore();
        } catch (error) {
            setStatus(await readableFunctionError(error), "error");
        } finally {
            setJudgeBusy(false);
        }
    }

    async function loadMyScore() {
        if (!client || !user) {
            $("myCodingScore").textContent = "0";
            return;
        }
        const result = await client.from("coding_submissions")
            .select("problem_id,points_awarded")
            .eq("user_id", user.id);
        if (result.error) return;
        const best = {};
        (result.data || []).forEach((entry) => {
            best[entry.problem_id] = Math.max(best[entry.problem_id] || 0, entry.points_awarded || 0);
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
            const tableRow = document.createElement("tr");
            const cell = document.createElement("td");
            cell.colSpan = 4;
            cell.textContent = "No accepted submissions yet.";
            tableRow.append(cell);
            body.append(tableRow);
        }
        $("leaderboardDialog").showModal();
    }

    async function initialize() {
        initializeEditor();
        if (client) {
            const auth = await client.auth.getUser();
            user = auth.data?.user || null;
            client.auth.onAuthStateChange((_event, session) => {
                user = session?.user || null;
                loadMyScore();
            });
        }

        $("runSamples").addEventListener("click", () => judge("run"));
        $("submitCode").addEventListener("click", () => judge("submit"));
        $("revealCase").addEventListener("click", revealFailedCase);
        $("resetCode").addEventListener("click", () => {
            if (active && window.confirm("Reset your code to the starter template? Your saved draft for this problem will be replaced.")) {
                setEditorValue(starter(active));
                scheduleDraftSave();
            }
        });
        $("toggleStatement").addEventListener("click", () => {
            collapseStatement(!$("codingActive").classList.contains("statement-collapsed"));
        });
        $("openLeaderboard").addEventListener("click", showLeaderboard);

        updateFallbackLines();
        loadMyScore();
        loadRequestedProblem();
    }

    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initialize);
    else initialize();
}());
