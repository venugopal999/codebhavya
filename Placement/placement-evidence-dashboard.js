(function () {
    "use strict";
    const client = (window.CodeBhavyaSupabase || {}).client || null;
    const $ = (id) => document.getElementById(id);
    let dashboard = null;

    function state(name) {
        ["evidenceLoading", "evidenceSignedOut", "evidenceError", "evidenceDashboard"].forEach((id) => { $(id).hidden = id !== name; });
    }
    function safeUrl(value) {
        try { const url = new URL(String(value)); return ["http:", "https:"].includes(url.protocol) ? url.href : ""; } catch (_error) { return ""; }
    }
    function empty(container, message) {
        container.replaceChildren(); const p = document.createElement("p"); p.className = "empty-note"; p.textContent = message; container.append(p);
    }
    function action(number, title, note, href, label) {
        const article = document.createElement("article"); article.className = "action-item";
        const count = document.createElement("b"); count.textContent = String(number).padStart(2, "0");
        const copy = document.createElement("div"); const strong = document.createElement("strong"); strong.textContent = title; const span = document.createElement("span"); span.textContent = note; copy.append(strong, span);
        const link = document.createElement("a"); link.href = href; link.textContent = label; article.append(count, copy, link); return article;
    }
    function renderActions(summary) {
        const list = $("nextEvidenceActions"); list.replaceChildren(); const actions = [];
        if (summary.resume_score < 65) actions.push(["Build an evidence-first resume", "Complete the missing sections, then use the audit corrections.", "resume-builder.html", "Build resume →"]);
        if (summary.project_count < 2) actions.push(["Prepare two project stories", "Show your ownership, decisions, testing and measurable outcomes.", "project-story.html", "Build a story →"]);
        else if (summary.defensible_projects < 1) actions.push(["Strengthen one project above 70", "Use the project audit to replace vague claims with evidence.", "project-story.html", "Improve project →"]);
        if (summary.evidence_count < 2) actions.push(["Attach verifiable proof", "Add a certificate, repository, internship or achievement link below.", "#proofForm", "Add proof ↓"]);
        if (actions.length < 3) actions.push(["Practise defending your evidence", "Answer tailored project follow-ups without memorising a script.", "project-story.html", "Open defence →"]);
        if (actions.length < 3) actions.push(["Use your resume in a guided interview", "Practise project and resume questions, then correct weak answers.", "interview.html?category=resume-projects", "Practise interview →"]);
        actions.slice(0, 3).forEach((item, index) => list.append(action(index + 1, ...item)));
    }
    function renderResume(resume, score) {
        const summary = $("resumeSummary"); const recommendations = $("resumeRecommendations"); summary.replaceChildren(); recommendations.replaceChildren();
        if (!resume) { empty(summary, "No resume has been saved. Start with your strongest role, projects and measurable evidence."); return; }
        const box = document.createElement("div"); box.className = "project-card"; const copy = document.createElement("div"); const title = document.createElement("strong"); title.textContent = resume.resume_data?.target_role || "Placement resume"; const note = document.createElement("p"); note.textContent = `Latest audit: ${score}/100 · ${resume.audit?.level || "Audit complete"}`; copy.append(title, note); const link = document.createElement("a"); link.href = "resume-builder.html"; link.textContent = "Improve →"; box.append(copy, link); summary.append(box);
        const recs = Array.isArray(resume.audit?.recommendations) ? resume.audit.recommendations : [];
        if (!recs.length) { const li = document.createElement("li"); li.textContent = "Strong evidence coverage. Proofread carefully and tailor the target role before applying."; recommendations.append(li); }
        else recs.slice(0, 3).forEach((value) => { const li = document.createElement("li"); li.textContent = value; recommendations.append(li); });
    }
    function renderProjects(projects) {
        const list = $("projectList"); list.replaceChildren();
        if (!projects.length) { empty(list, "No project story yet. Build one complete story before collecting random interview answers."); return; }
        projects.slice(0, 5).forEach((project) => { const card = document.createElement("article"); card.className = "project-card"; const copy = document.createElement("div"); const title = document.createElement("strong"); title.textContent = project.title; const note = document.createElement("p"); note.textContent = [project.domain, project.target_role].filter(Boolean).join(" · ") || "Project defence story"; copy.append(title, note); const side = document.createElement("div"); const score = document.createElement("span"); score.className = "score-pill"; score.textContent = `${project.audit_score}/100`; const link = document.createElement("a"); link.href = `project-story.html?project=${encodeURIComponent(project.id)}`; link.textContent = "Open →"; side.append(score, document.createElement("br"), link); card.append(copy, side); list.append(card); });
    }
    function renderProof(items) {
        const list = $("proofList"); list.replaceChildren();
        if (!items.length) { empty(list, "No proof links saved yet. Add only evidence that supports a real claim."); return; }
        items.forEach((item) => { const card = document.createElement("article"); card.className = "proof-card"; const copy = document.createElement("div"); const title = document.createElement("strong"); title.textContent = item.title; const note = document.createElement("p"); note.textContent = [item.evidence_type.replace("-", " "), item.organization, item.evidence_date].filter(Boolean).join(" · "); copy.append(title, note); const url = safeUrl(item.evidence_url); const link = document.createElement("a"); link.textContent = url ? "Verify ↗" : "Invalid link"; if (url) { link.href = url; link.target = "_blank"; link.rel = "noopener noreferrer"; } card.append(copy, link); list.append(card); });
    }
    function render(data) {
        dashboard = data || {}; const summary = dashboard.summary || {};
        $("readinessMetric").textContent = `${summary.readiness || 0}%`; $("resumeMetric").textContent = `${summary.resume_score || 0} / 100`;
        $("resumeMetricNote").textContent = dashboard.resume?.audit?.level || "Not audited"; $("projectMetric").textContent = String(summary.project_count || 0); $("projectMetricNote").textContent = summary.project_count ? `${summary.project_average || 0}/100 average audit` : "No stories yet";
        $("defensibleMetric").textContent = String(summary.defensible_projects || 0); $("proofMetric").textContent = String(summary.evidence_count || 0);
        renderActions(summary); renderResume(dashboard.resume, summary.resume_score || 0); renderProjects(dashboard.projects || []); renderProof(dashboard.evidence_items || []); state("evidenceDashboard");
    }
    async function load() {
        state("evidenceLoading");
        if (!client) { $("evidenceErrorMessage").textContent = "Supabase client is unavailable. Confirm the existing Supabase files are uploaded."; state("evidenceError"); return; }
        try {
            const auth = await client.auth.getUser(); if (!auth.data?.user) { state("evidenceSignedOut"); return; }
            const result = await client.rpc("get_placement_evidence_dashboard"); if (result.error) throw result.error; render(result.data);
        } catch (error) { $("evidenceErrorMessage").textContent = error.message || "Please run the V24 Evidence Lab schema, then try again."; state("evidenceError"); }
    }
    async function saveProof(event) {
        event.preventDefault(); const button = $("saveProof"); const status = $("proofStatus"); status.textContent = ""; button.disabled = true; button.textContent = "Saving…";
        const item = { evidence_type: $("proofType").value, title: $("proofTitle").value.trim(), organization: $("proofOrganization").value.trim(), evidence_date: $("proofDate").value, evidence_url: $("proofUrl").value.trim(), description: $("proofDescription").value.trim() };
        try { const result = await client.rpc("save_placement_evidence", { p_item: item }); if (result.error) throw result.error; $("proofForm").reset(); status.style.color = "#087a5b"; status.textContent = "Proof item saved privately."; await load(); }
        catch (error) { status.style.color = "#b42318"; status.textContent = error.message || "Proof could not be saved."; }
        finally { button.disabled = false; button.textContent = "Save proof item"; }
    }
    $("retryEvidence").addEventListener("click", load); $("proofForm").addEventListener("submit", saveProof); load();
}());
