(function () {
    "use strict";

    const cloud = window.CodeBhavyaSupabase || {};
    const client = cloud.client || null;
    const $ = (id) => document.getElementById(id);
    const profiles = [
        { key:"tcs", name:"TCS", monogram:"TCS", category:"foundation", role:"NQT-aligned graduate preparation", summary:"Build dependable fundamentals first, then add timed reasoning and implementation practice for the specific role tier.", rounds:["Quantitative and reasoning readiness","Programming logic and coding","Role-dependent interview preparation"], topics:["Number logic","Loops","Arrays","Strings","Matrices"], source:"https://www.tcsion.com/hub/national-qualifier-test/", sourceLabel:"TCS iON NQT", evidence:"Use the current NQT or job notification to confirm the exact cognitive and coding sections." },
        { key:"infosys", name:"Infosys", monogram:"INF", category:"foundation", role:"Graduate roles and HackWithInfy preparation", summary:"Strengthen clear implementation and debugging, then increase algorithmic depth for specialised programming opportunities.", rounds:["Fundamentals and coding readiness","Timed coding qualifiers for coding programmes","Technical and role-fit discussion"], topics:["Loops","Strings","Arrays","Functions","Sorting"], source:"https://www.infosys.com/careers/hackwithinfy.html", sourceLabel:"Infosys HackWithInfy", evidence:"HackWithInfy publishes programme-specific qualifier stages; other graduate roles can use different assessments." },
        { key:"wipro", name:"Wipro", monogram:"WIP", category:"foundation", role:"Graduate engineering preparation", summary:"Prioritise accurate easy-to-medium solutions, tracing, strings, arrays and clear explanation of fundamentals.", rounds:["Aptitude and communication readiness","Programming fundamentals","Coding and technical discussion"], topics:["Input/output","Conditions","Arrays","Strings","Debugging"], source:"https://careers.wipro.com/", sourceLabel:"Wipro Careers", evidence:"Verify the current role notification because assessment providers and sections can change by drive." },
        { key:"cognizant", name:"Cognizant", monogram:"CTS", category:"foundation", role:"GenC-family preparation", summary:"Prepare broad programming foundations and practise translating simple requirements into correct, testable programs.", rounds:["Foundational screening","Coding or technical assessment","Technical and behavioural interview"], topics:["Loops","Functions","Arrays","Strings","SQL thinking"], source:"https://careers.cognizant.com/global/en", sourceLabel:"Cognizant Careers", evidence:"Treat GenC variants as separate role profiles and confirm which variant appears in the current drive." },
        { key:"accenture", name:"Accenture", monogram:"ACN", category:"foundation", role:"Associate software engineering preparation", summary:"Combine programming basics with pseudocode, debugging, communication and consistent performance under time limits.", rounds:["Cognitive and technical readiness","Coding implementation","Communication and interview"], topics:["Operators","Control flow","Arrays","Strings","Debugging"], source:"https://www.accenture.com/in-en/careers", sourceLabel:"Accenture Careers", evidence:"Use this as a skill map, then check the assessment instructions supplied for the specific application." },
        { key:"capgemini", name:"Capgemini", monogram:"CAP", category:"foundation", role:"Campus engineering preparation", summary:"Focus on precise fundamentals, common data transformations and readable solutions before attempting harder patterns.", rounds:["Reasoning and technical concepts","Pseudocode or coding","Technical and behavioural interview"], topics:["Number logic","Arrays","Strings","Functions","Sorting"], source:"https://www.capgemini.com/in-en/careers/", sourceLabel:"Capgemini Careers", evidence:"Campus patterns vary across business units and locations; verify the latest invitation or job description." },
        { key:"hcltech", name:"HCLTech", monogram:"HCL", category:"foundation", role:"Graduate engineer preparation", summary:"Develop a reliable core in C syntax, problem decomposition, arrays, strings and basic data structures.", rounds:["Foundational assessment","Programming and technical screening","Role-fit interview"], topics:["C basics","Arrays","Strings","Pointers","Data structures"], source:"https://www.hcltech.com/careers", sourceLabel:"HCLTech Careers", evidence:"The profile is a preparation guide, not a claim about one permanent HCLTech test pattern." },
        { key:"amazon", name:"Amazon", monogram:"AMZ", category:"product", role:"Software development engineering preparation", summary:"Move beyond syntax into data-structure choice, algorithm correctness, complexity and careful edge-case handling.", rounds:["Online coding assessment","Technical problem-solving rounds","Role and behavioural discussion"], topics:["Arrays","Strings","Hashing","Trees","Optimisation"], source:"https://www.amazon.jobs/content/en/how-we-hire/interviewing-at-amazon", sourceLabel:"Amazon Jobs", evidence:"Role level and location affect the process. Pair the problem set with the current job description and interview guidance." },
        { key:"microsoft", name:"Microsoft", monogram:"MS", category:"product", role:"Software engineering preparation", summary:"Practise explaining the approach, selecting structures, proving complexity and refining a working solution.", rounds:["Coding and problem solving","Technical design and fundamentals","Collaboration and role-fit discussion"], topics:["Arrays","Strings","Linked lists","Trees","Dynamic programming"], source:"https://careers.microsoft.com/v2/global/en/hiring-tips.html", sourceLabel:"Microsoft Careers", evidence:"Interview loops differ by team and level; use the mapped collection for skill coverage rather than prediction." },
        { key:"adobe", name:"Adobe", monogram:"ADB", category:"product", role:"Software engineering preparation", summary:"Combine strong C fundamentals with data structures, memory reasoning, algorithms and disciplined debugging.", rounds:["Coding or technical assessment","Data structures and problem solving","Technical and role-fit interviews"], topics:["Pointers","Memory","Strings","Trees","Algorithms"], source:"https://careers.adobe.com/us/en/interviewing-at-adobe", sourceLabel:"Adobe Careers", evidence:"Confirm the expectations for the exact internship or graduate role before scheduling a mock." },
        { key:"zoho", name:"Zoho", monogram:"ZHO", category:"product", role:"Software developer preparation", summary:"Build solutions progressively from strong programming logic to structured data, recursion and multi-step implementation.", rounds:["Programming and logic screening","Progressive coding exercises","Technical and role discussion"], topics:["Patterns","Strings","Matrices","Recursion","Data structures"], source:"https://www.zoho.com/careers/", sourceLabel:"Zoho Careers", evidence:"Use original practice patterns and verify the current recruitment instructions; do not rely on copied question lists." }
    ];
    const problemCounts = new Map();

    function createCard(profile) {
        const article = document.createElement("article");
        article.className = "company-card " + profile.category;
        const head = document.createElement("header"); head.className = "company-card-head";
        const monogram = document.createElement("span"); monogram.className = "company-monogram"; monogram.textContent = profile.monogram;
        const count = document.createElement("span"); count.className = "company-problem-count";
        const mapped = problemCounts.get(profile.key);
        count.textContent = Number.isFinite(mapped) ? `${mapped} mapped problems` : "Curated collection";
        head.append(monogram, count);
        const title = document.createElement("h3"); title.textContent = profile.name;
        const role = document.createElement("p"); role.className = "company-role"; role.textContent = profile.role;
        const summary = document.createElement("p"); summary.textContent = profile.summary;
        const roundsTitle = document.createElement("h4"); roundsTitle.textContent = "Preparation sequence";
        const rounds = document.createElement("ol"); rounds.className = "company-rounds";
        profile.rounds.forEach((item) => { const li = document.createElement("li"); li.textContent = item; rounds.append(li); });
        const topicsTitle = document.createElement("h4"); topicsTitle.textContent = "Priority skills";
        const topics = document.createElement("div"); topics.className = "company-topics";
        profile.topics.forEach((item) => { const tag = document.createElement("span"); tag.textContent = item; topics.append(tag); });
        const evidence = document.createElement("div"); evidence.className = "company-evidence";
        evidence.append(document.createTextNode(profile.evidence + " "));
        const source = document.createElement("a"); source.href = profile.source; source.target = "_blank"; source.rel = "noopener noreferrer"; source.textContent = "Official reference ↗"; evidence.append(source);
        const footer = document.createElement("footer");
        const reviewed = document.createElement("span"); reviewed.textContent = "Reviewed September 2026";
        const link = document.createElement("a"); link.href = `coding.html?topic=c&mode=company&company=${profile.key}`; link.textContent = "Open problem set →";
        footer.append(reviewed, link);
        article.append(head, title, role, summary, roundsTitle, rounds, topicsTitle, topics, evidence, footer);
        return article;
    }

    function render() {
        const category = $("companyCategory").value;
        const search = $("companySearch").value.trim().toLowerCase();
        const visible = profiles.filter((profile) => {
            if (category !== "all" && profile.category !== category) return false;
            return !search || [profile.name, profile.role, profile.summary, ...profile.topics].join(" ").toLowerCase().includes(search);
        });
        const grid = $("companyGrid"); grid.replaceChildren(); visible.forEach((profile) => grid.append(createCard(profile)));
        $("companyEmpty").hidden = visible.length > 0;
        grid.hidden = visible.length === 0;
        $("companyResultsTitle").textContent = category === "foundation" ? "Foundation and high-volume profiles" : category === "product" ? "Product engineering profiles" : "All company profiles";
        $("companyResultsCount").textContent = `${visible.length} profile${visible.length === 1 ? "" : "s"}`;
    }

    async function loadProblemCounts() {
        if (!client) return;
        const result = await client.from("coding_problems").select("company_tags").eq("topic", "c").eq("is_published", true).limit(1000);
        if (result.error) return;
        const uniqueProblems = result.data || [];
        profiles.forEach((profile) => problemCounts.set(profile.key, uniqueProblems.filter((problem) => Array.isArray(problem.company_tags) && problem.company_tags.includes(profile.key)).length));
        $("mappedProblemCount").textContent = String(uniqueProblems.length);
        render();
    }

    function initialize() {
        $("companyCount").textContent = String(profiles.length);
        $("companyCategory").addEventListener("change", render);
        $("companySearch").addEventListener("input", render);
        render(); loadProblemCounts();
    }

    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initialize); else initialize();
}());
