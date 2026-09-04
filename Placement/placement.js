(function () {
    "use strict";

    const MOBILE_BREAKPOINT = 920;
    const STORAGE_KEYS = {
        plan: "codebhavya-placement-plan-v1",
        readiness: "codebhavya-placement-readiness-v1",
        sprint: "codebhavya-placement-sprint-v1",
        mistakes: "codebhavya-placement-mistakes-v1",
        proof: "codebhavya-placement-proof-v1"
    };

    const targetProfiles = {
        general: {
            label: "General Placement",
            description: "Build balanced readiness across aptitude, coding, technical knowledge and interview communication.",
            priorityTitle: "Find your weakest round",
            priorityText: "Complete the readiness check before beginning random preparation. Use the lowest pillar as your first priority.",
            weekOutcome: "Build a reliable daily rhythm",
            weekTasks: [
                "Complete the readiness check",
                "Finish five aptitude practice sets",
                "Solve five coding problems",
                "Record one technical explanation"
            ],
            sprint: [
                "Revise one aptitude concept and solve five questions.",
                "Solve one coding problem and trace the logic.",
                "Explain your solution aloud without reading."
            ]
        },
        service: {
            label: "Service-Company",
            description: "Prioritise screening accuracy, programming fundamentals, SQL awareness and clear professional communication.",
            priorityTitle: "Secure the screening rounds",
            priorityText: "Build reliable aptitude accuracy and programming fundamentals before increasing question difficulty.",
            weekOutcome: "Improve speed without sacrificing accuracy",
            weekTasks: [
                "Complete two timed aptitude sections",
                "Revise programming and output questions",
                "Practise common array and string programs",
                "Rehearse self-introduction and HR examples"
            ],
            sprint: [
                "Complete a timed aptitude mini-set and review errors.",
                "Write one common array or string program from memory.",
                "Practise one concise HR answer using a real example."
            ]
        },
        product: {
            label: "Product-Company",
            description: "Build deeper DSA judgment, coding consistency, complexity analysis, core-CS understanding and project defence.",
            priorityTitle: "Strengthen problem-solving depth",
            priorityText: "Solve fewer problems with better analysis: approach, alternatives, complexity, edge cases and testing.",
            weekOutcome: "Produce five interview-quality solutions",
            weekTasks: [
                "Solve five carefully selected DSA problems",
                "Write complexity and edge cases for every solution",
                "Review one DBMS or operating-system concept daily",
                "Explain two project design decisions aloud"
            ],
            sprint: [
                "Review one DSA pattern and identify when to use it.",
                "Solve one coding problem with tests and complexity.",
                "Explain one alternative approach and its trade-off."
            ]
        },
        ai: {
            label: "AI, ML & Data",
            description: "Connect Python, SQL, statistics, model evaluation and one end-to-end project into defensible role evidence.",
            priorityTitle: "Connect concepts to project evidence",
            priorityText: "Do not list models without understanding. Explain the data, baseline, metric, failure mode and improvement.",
            weekOutcome: "Defend one complete ML workflow",
            weekTasks: [
                "Revise Python, NumPy or SQL foundations",
                "Trace one ML algorithm or evaluation metric",
                "Review leakage, imbalance and baseline choices",
                "Explain one project decision and limitation"
            ],
            sprint: [
                "Practise one Python, SQL or statistics task.",
                "Trace one ML concept from input to evaluation.",
                "Explain one project choice, result and limitation."
            ]
        }
    };

    const roadmapData = {
        15: {
            badge: "15 DAYS â€¢ PRIORITY RESCUE",
            title: "Protect the highest-value fundamentals",
            description: "Use a strict rescue plan: diagnose quickly, repair essential gaps and practise the exact rounds you are likely to face.",
            rule: "Every day must contain revision, timed practice and spoken explanation.",
            phases: [
                ["DAYS 1â€“3", "Diagnose & Prioritise", "Readiness check, resume correction and high-frequency aptitude/programming revision."],
                ["DAYS 4â€“7", "Repair the Core", "Arrays, strings, basic DSA, SQL/DBMS essentials and common screening questions."],
                ["DAYS 8â€“11", "Practise Under Time", "Timed aptitude, coding mini-mocks and focused mistake correction."],
                ["DAYS 12â€“15", "Simulate & Rehearse", "Full mock, project defence, technical questions and HR rehearsal."]
            ]
        },
        30: {
            badge: "30 DAYS â€¢ BALANCED PREPARATION",
            title: "Build consistency, then add realistic practice",
            description: "Use four focused weeks to strengthen foundations, solve timed problems and rehearse interview communication.",
            rule: "Five preparation days, one mock day and one review day.",
            phases: [
                ["WEEK 1", "Diagnose & Repair", "Readiness check, aptitude basics, programming revision and resume audit."],
                ["WEEK 2", "Build Core Strength", "Coding patterns, essential DSA, DBMS/OS revision and one project story."],
                ["WEEK 3", "Practise Under Time", "Sectional tests, coding sets, technical questions and answer recording."],
                ["WEEK 4", "Simulate & Improve", "Full mocks, interview rehearsals, mistake review and company-focused revision."]
            ]
        },
        60: {
            badge: "60 DAYS â€¢ FOUNDATION BUILDER",
            title: "Learn deeply before increasing pressure",
            description: "Use the first month for concept strength and the second month for mixed practice, mocks and interview readiness.",
            rule: "Measure weekly outputsâ€”problems solved, mistakes corrected and answers explainedâ€”not only study hours.",
            phases: [
                ["WEEKS 1â€“2", "Foundation Repair", "Mathematics, programming, SQL and core-CS concepts with short daily practice."],
                ["WEEKS 3â€“4", "DSA & Problem Solving", "Core structures, common patterns, complexity and clean implementations."],
                ["WEEKS 5â€“6", "Role Evidence", "Projects, resume bullets, GitHub clarity and role-specific depth."],
                ["WEEKS 7â€“8", "Mocks & Interviews", "Timed assessments, technical simulation, HR stories and final gap repair."]
            ]
        },
        90: {
            badge: "90 DAYS â€¢ COMPLETE MASTERY",
            title: "Build a durable placement system",
            description: "Move through foundations, deliberate practice and realistic simulation without rushing past weak concepts.",
            rule: "Use a three-cycle week: learn, practise, then prove through a timed or spoken task.",
            phases: [
                ["DAYS 1â€“30", "Build Foundations", "Aptitude, programming, core DSA, DBMS/OS and consistent problem-solving habits."],
                ["DAYS 31â€“55", "Increase Depth", "Medium problems, advanced structures, SQL, role knowledge and project improvement."],
                ["DAYS 56â€“75", "Build Evidence", "Resume, GitHub, project defence, communication and company/role alignment."],
                ["DAYS 76â€“90", "Perform Under Pressure", "Mocks, contests, interview simulations, mistake review and targeted revision."]
            ]
        }
    };

    const roundData = {
        eligibility: {
            number: "ROUND 01",
            icon: "ðŸ“„",
            title: "Eligibility & Resume Screening",
            intro: "Your first task is to make your eligibility clear and every important resume claim defensible.",
            examines: ["Eligibility and academic details", "Relevant skills and evidence", "Projects, internships and achievements"],
            prepares: ["Checking every fact and date", "Adding measurable project outcomes", "Removing skills you cannot explain"],
            proof: "Pick any resume line and explain what you did, why it mattered and how you verified the result."
        },
        aptitude: {
            number: "ROUND 02",
            icon: "ðŸ“",
            title: "Aptitude & Reasoning Assessment",
            intro: "This round tests accurate reasoning under time pressure, not formula memorisation alone.",
            examines: ["Numerical accuracy and speed", "Logical pattern recognition", "Verbal comprehension and attention"],
            prepares: ["Learning one concept at a time", "Using timed sectional sets", "Reviewing the reason for every error"],
            proof: "Complete a timed set and classify every wrong answer as a concept, reading, calculation or time error."
        },
        coding: {
            number: "ROUND 03",
            icon: "âŒ¨ï¸",
            title: "Programming & Coding Round",
            intro: "Evaluators want correct reasoning, readable code and appropriate testsâ€”not a memorised final program.",
            examines: ["Problem decomposition", "Algorithm and data-structure choice", "Correctness, complexity and edge cases"],
            prepares: ["Solving from examples and constraints", "Tracing before submitting", "Testing normal, boundary and invalid cases"],
            proof: "Solve one problem and produce the approach, pseudocode, code, dry run, complexity and three test cases."
        },
        technical: {
            number: "ROUND 04",
            icon: "ðŸ§ ",
            title: "Technical Interview",
            intro: "The interviewer explores the depth of your fundamentals and how clearly you reason when the answer is not immediate.",
            examines: ["Programming, DSA and core CS", "Project ownership and decisions", "Ability to reason and learn"],
            prepares: ["Explaining why, not only what", "Connecting concepts to projects", "Practising follow-up questions aloud"],
            proof: "Record a two-minute explanation of one technical concept, then remove jargon and unsupported claims."
        },
        hr: {
            number: "ROUND 05",
            icon: "ðŸ¤",
            title: "HR & Professional Interview",
            intro: "This conversation checks self-awareness, communication, motivation and whether your examples support your claims.",
            examines: ["Role motivation and preparation", "Teamwork, ownership and resilience", "Clarity, honesty and professionalism"],
            prepares: ["Using real examples instead of adjectives", "Structuring stories with STAR", "Researching the role and organisation"],
            proof: "Answer one behaviour question with Situation, Task, Action, Result and what you would improve next time."
        }
    };

    const interviewQuestions = {
        technical: [
            {
                question: "How would you choose between an array and a linked list for a given problem?",
                title: "Requirement â†’ Comparison â†’ Decision",
                steps: [
                    ["Clarify", "Ask whether fast indexing or frequent insertion is more important."],
                    ["Compare", "Explain access cost, insertion cost and memory layout."],
                    ["Choose", "Select one structure for the stated requirement."],
                    ["Qualify", "Mention the condition that could change your choice."]
                ],
                warning: "Declaring one structure â€œbetterâ€ without describing the requirement."
            },
            {
                question: "What happens from the moment you enter a URL until a web page appears?",
                title: "Journey â†’ Components â†’ Failure Points",
                steps: [
                    ["Scope", "State that you will give a high-level client-to-server journey."],
                    ["Trace", "Cover DNS, connection, HTTP request, server response and browser rendering."],
                    ["Connect", "Name the role of caching, TLS and status codes where relevant."],
                    ["Verify", "Mention how developer tools can inspect the request and response."]
                ],
                warning: "Listing isolated networking terms without connecting them into an ordered flow."
            },
            {
                question: "Why does a database index improve some queries but make some operations more expensive?",
                title: "Structure â†’ Benefit â†’ Cost â†’ Use Case",
                steps: [
                    ["Define", "Describe an index as an additional search structure over selected columns."],
                    ["Benefit", "Explain reduced scanning for suitable lookups and ordering."],
                    ["Cost", "Explain extra storage and maintenance during insert, update and delete."],
                    ["Choose", "Relate the decision to query frequency and selectivity."]
                ],
                warning: "Saying indexes always make a database faster."
            },
            {
                question: "How would you explain process versus thread using a practical application?",
                title: "Definition â†’ Example â†’ Trade-off",
                steps: [
                    ["Define", "Separate an executing program from units of execution within it."],
                    ["Example", "Use one application with multiple concurrent activities."],
                    ["Compare", "Discuss address-space sharing, communication and isolation."],
                    ["Trade-off", "Explain when isolation or lighter concurrency matters."]
                ],
                warning: "Giving textbook definitions without showing the consequence in a real program."
            }
        ],
        coding: [
            {
                question: "Given a list of values, how would you find the first repeated element?",
                title: "Clarify â†’ Baseline â†’ Optimise â†’ Test",
                steps: [
                    ["Clarify", "Ask what â€œfirstâ€ means and whether extra memory is allowed."],
                    ["Baseline", "Describe the simple pair-comparison solution."],
                    ["Optimise", "Use a set while preserving the required order."],
                    ["Test", "Cover no repetition, immediate repetition and multiple repetitions."]
                ],
                warning: "Changing the order by sorting before clarifying what â€œfirstâ€ means."
            },
            {
                question: "How would you check whether brackets in an expression are balanced?",
                title: "Invariant â†’ Structure â†’ Trace â†’ Complexity",
                steps: [
                    ["Invariant", "An unmatched opening bracket must be remembered."],
                    ["Choose", "Use a stack because the latest opening bracket closes first."],
                    ["Trace", "Push openings and match each closing bracket with the stack top."],
                    ["Finish", "The stack must be empty after the complete scan."]
                ],
                warning: "Checking only equal counts without validating order and bracket type."
            },
            {
                question: "Design a function that returns the second-largest distinct value.",
                title: "Contract â†’ State â†’ Edge Cases",
                steps: [
                    ["Contract", "Clarify whether duplicates count and what happens when no answer exists."],
                    ["State", "Track the largest and second-largest distinct values in one pass."],
                    ["Update", "Explain the order in which both values change."],
                    ["Test", "Use duplicates, negative values and a one-value input."]
                ],
                warning: "Returning the largest duplicate as the second-largest distinct value."
            },
            {
                question: "How would you find the middle node of a singly linked list in one traversal?",
                title: "Observation â†’ Pointers â†’ Proof",
                steps: [
                    ["Observation", "One pointer can move twice as fast as another."],
                    ["Method", "Move slow by one and fast by two until fast reaches the end."],
                    ["Result", "Slow has travelled half the distance."],
                    ["Clarify", "State which middle is returned for an even-length list."]
                ],
                warning: "Ignoring the even-length definition or dereferencing beyond the list."
            }
        ],
        project: [
            {
                question: "Explain your strongest project without starting with the technology stack.",
                title: "Problem â†’ User â†’ Contribution â†’ Result",
                steps: [
                    ["Problem", "Describe the real need and who experienced it."],
                    ["Contribution", "Separate your decisions and work from the teamâ€™s contribution."],
                    ["Design", "Explain only the technologies that solved an important constraint."],
                    ["Evidence", "Give a measured result, test outcome or honest limitation."]
                ],
                warning: "Opening with a list of frameworks before explaining why the project exists."
            },
            {
                question: "What was the hardest technical decision in your project?",
                title: "Constraint â†’ Options â†’ Choice â†’ Result",
                steps: [
                    ["Constraint", "Identify the specific problem that required a decision."],
                    ["Options", "Name at least two reasonable alternatives."],
                    ["Choice", "Explain the trade-off that led to your decision."],
                    ["Result", "Describe what worked, what did not and what you learned."]
                ],
                warning: "Calling implementation difficulty a design decision without comparing alternatives."
            },
            {
                question: "How did you test your project, and what can still fail?",
                title: "Risk â†’ Test â†’ Evidence â†’ Limitation",
                steps: [
                    ["Risk", "Name the most important behaviour that had to remain correct."],
                    ["Test", "Explain normal, boundary and failure scenarios."],
                    ["Evidence", "Describe the observable result or metric."],
                    ["Limitation", "Acknowledge a remaining risk and the next test you would add."]
                ],
                warning: "Saying â€œwe tested everythingâ€ without examples or evidence."
            },
            {
                question: "If you rebuilt the project today, what would you change first?",
                title: "Evidence â†’ Priority â†’ Improvement",
                steps: [
                    ["Evidence", "Identify a limitation discovered through use or testing."],
                    ["Priority", "Explain why it matters more than other improvements."],
                    ["Change", "Describe the technical or process change."],
                    ["Verify", "State how you would measure whether the change helped."]
                ],
                warning: "Naming fashionable technology without connecting it to an observed problem."
            }
        ],
        hr: [
            {
                question: "Tell me about yourself in a way that is relevant to this role.",
                title: "Present â†’ Evidence â†’ Direction",
                steps: [
                    ["Present", "State your current academic or professional identity."],
                    ["Evidence", "Choose two strengths supported by projects, practice or responsibility."],
                    ["Direction", "Connect what you are learning to this role."],
                    ["Close", "End with the value you are ready to contribute and develop."]
                ],
                warning: "Reciting personal history or every item already visible on the resume."
            },
            {
                question: "Describe a failure that changed how you work.",
                title: "Situation â†’ Ownership â†’ Change â†’ Evidence",
                steps: [
                    ["Situation", "Choose a real, specific failure with meaningful consequences."],
                    ["Ownership", "State your contribution without blaming others."],
                    ["Change", "Explain the new behaviour, process or check you adopted."],
                    ["Evidence", "Show a later situation where the change improved the result."]
                ],
                warning: "Using a disguised strength or ending the story before explaining the change."
            },
            {
                question: "Why are you interested in this role?",
                title: "Role â†’ Evidence â†’ Contribution â†’ Growth",
                steps: [
                    ["Role", "Name specific work or responsibilities that interest you."],
                    ["Evidence", "Connect that interest to preparation you have already done."],
                    ["Contribution", "Explain the capability you can bring now."],
                    ["Growth", "Identify the capability you want to deepen through the role."]
                ],
                warning: "Giving an answer that could be used unchanged for any role or organisation."
            },
            {
                question: "Tell me about a disagreement in a team and how you handled it.",
                title: "Goal â†’ Difference â†’ Action â†’ Outcome",
                steps: [
                    ["Goal", "Begin with the shared outcome the team needed."],
                    ["Difference", "Describe the disagreement neutrally."],
                    ["Action", "Explain how you listened, tested options or built agreement."],
                    ["Outcome", "State the result and what you would repeat or improve."]
                ],
                warning: "Presenting yourself as entirely right and the other person as the problem."
            }
        ]
    };

    let interviewCategory = "technical";
    const interviewIndexes = {
        technical: 0,
        coding: 0,
        project: 0,
        hr: 0
    };

    function readStorage(key, fallback) {
        try {
            const value = window.localStorage.getItem(key);
            return value ? JSON.parse(value) : fallback;
        } catch (error) {
            return fallback;
        }
    }

    function writeStorage(key, value) {
        try {
            window.localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            return;
        }
    }

    function escapeText(value) {
        return String(value || "").trim();
    }

    function setSelectedButton(buttons, selectedButton) {
        buttons.forEach(function (button) {
            const selected = button === selectedButton;
            button.classList.toggle("active", selected);
            button.setAttribute("aria-selected", String(selected));
        });
    }

    function initializeSidebar() {
        const toggle = document.getElementById("placementSidebarToggle");
        const sidebar = document.getElementById("placementSidebar");
        const backdrop = document.getElementById("placementDrawerBackdrop");

        if (!toggle || !sidebar || !backdrop) {
            return;
        }

        function setOpen(open) {
            const shouldOpen = Boolean(open && window.innerWidth <= MOBILE_BREAKPOINT);
            sidebar.classList.toggle("is-open", shouldOpen);
            backdrop.classList.toggle("is-open", shouldOpen);
            document.body.classList.toggle("placement-drawer-open", shouldOpen);
            toggle.setAttribute("aria-expanded", String(shouldOpen));
            toggle.textContent = shouldOpen ? "âœ• Close Placement Navigator" : "â˜° Placement Navigator";
            backdrop.tabIndex = shouldOpen ? 0 : -1;
        }

        toggle.addEventListener("click", function () {
            setOpen(!sidebar.classList.contains("is-open"));
        });

        backdrop.addEventListener("click", function () {
            setOpen(false);
            toggle.focus();
        });

        sidebar.addEventListener("click", function (event) {
            if (event.target.closest("a")) {
                setOpen(false);
            }
        });

        document.addEventListener("keydown", function (event) {
            if (event.key === "Escape" && sidebar.classList.contains("is-open")) {
                setOpen(false);
                toggle.focus();
            }
        });

        window.addEventListener("resize", function () {
            if (window.innerWidth > MOBILE_BREAKPOINT) {
                setOpen(false);
            }
        });
    }

    function initializeSectionNavigation() {
        const links = Array.from(document.querySelectorAll(".placement-section-nav a"));
        const sections = links.map(function (link) {
            return document.querySelector(link.getAttribute("href"));
        }).filter(Boolean);

        if (!("IntersectionObserver" in window) || sections.length === 0) {
            return;
        }

        const observer = new IntersectionObserver(function (entries) {
            const visible = entries.filter(function (entry) {
                return entry.isIntersecting;
            }).sort(function (a, b) {
                return b.intersectionRatio - a.intersectionRatio;
            });

            if (!visible.length) {
                return;
            }

            const id = visible[0].target.id;
            links.forEach(function (link) {
                link.classList.toggle("active", link.getAttribute("href") === "#" + id);
            });
        }, {
            rootMargin: "-18% 0px -68% 0px",
            threshold: [0, 0.15, 0.35]
        });

        sections.forEach(function (section) {
            observer.observe(section);
        });
    }

    function sprintTimes(minutes) {
        if (minutes === 30) {
            return [10, 15, 5];
        }

        if (minutes === 120) {
            return [35, 65, 20];
        }

        return [20, 30, 10];
    }

    function updateSprint(profileKey, minutes) {
        const profile = targetProfiles[profileKey];
        const list = document.getElementById("sprintList");
        const title = document.getElementById("sprintTitle");
        const times = sprintTimes(minutes);
        const signature = profileKey + "-" + minutes;
        const saved = readStorage(STORAGE_KEYS.sprint, {});
        const completed = saved.signature === signature && Array.isArray(saved.completed)
            ? saved.completed
            : [false, false, false];

        title.textContent = minutes === 60 ? "One focused hour" : "One focused " + minutes + "-minute session";
        list.replaceChildren();

        profile.sprint.forEach(function (task, index) {
            const label = document.createElement("label");
            const input = document.createElement("input");
            const span = document.createElement("span");
            const time = document.createElement("b");

            input.type = "checkbox";
            input.checked = Boolean(completed[index]);
            input.dataset.sprintItem = String(index);
            time.textContent = times[index] + " min";
            span.append(time, document.createTextNode(" " + task));
            label.append(input, span);
            list.append(label);

            input.addEventListener("change", function () {
                const state = Array.from(list.querySelectorAll("input")).map(function (item) {
                    return item.checked;
                });
                writeStorage(STORAGE_KEYS.sprint, { signature: signature, completed: state });
                updateSprintProgress();
            });
        });

        writeStorage(STORAGE_KEYS.sprint, { signature: signature, completed: completed });
        updateSprintProgress();
    }

    function updateSprintProgress() {
        const checkboxes = Array.from(document.querySelectorAll("#sprintList input"));
        const completed = checkboxes.filter(function (input) {
            return input.checked;
        }).length;
        const percent = checkboxes.length ? Math.round((completed / checkboxes.length) * 100) : 0;
        const progress = document.getElementById("sprintProgress");

        document.getElementById("sprintProgressText").textContent = completed + "/" + checkboxes.length + " done";
        document.getElementById("sprintProgressBar").style.width = percent + "%";
        progress.setAttribute("aria-valuemax", String(checkboxes.length));
        progress.setAttribute("aria-valuenow", String(completed));
    }

    function applyPlan(plan, shouldSave) {
        const profileKey = targetProfiles[plan.target] ? plan.target : "general";
        const profile = targetProfiles[profileKey];
        const days = roadmapData[plan.days] ? Number(plan.days) : 30;
        const minutes = [30, 60, 120].includes(Number(plan.minutes)) ? Number(plan.minutes) : 60;

        document.getElementById("targetPath").value = profileKey;
        document.getElementById("preparationDays").value = String(days);
        document.getElementById("dailyMinutes").value = String(minutes);
        document.getElementById("planTitle").textContent = days + "-Day " + profile.label + " Plan";
        document.getElementById("planDescription").textContent = profile.description;
        document.getElementById("planPace").textContent = minutes === 60 ? "1 hour/day" : minutes + " minutes/day";
        document.getElementById("priorityTitle").textContent = profile.priorityTitle;
        document.getElementById("priorityText").textContent = profile.priorityText;
        document.getElementById("weekOutcome").textContent = profile.weekOutcome;

        const weekTasks = document.getElementById("weekTasks");
        weekTasks.replaceChildren();
        profile.weekTasks.forEach(function (task) {
            const item = document.createElement("li");
            item.textContent = task;
            weekTasks.append(item);
        });

        updateSprint(profileKey, minutes);
        selectRoadmap(days);

        if (shouldSave) {
            writeStorage(STORAGE_KEYS.plan, {
                target: profileKey,
                days: days,
                minutes: minutes
            });
        }
    }

    function initializePlanBuilder() {
        const form = document.getElementById("planBuilder");
        const storedPlan = readStorage(STORAGE_KEYS.plan, null);
        const saved = storedPlan && typeof storedPlan === "object" ? storedPlan : {
            target: "general",
            days: 30,
            minutes: 60
        };

        applyPlan(saved, false);

        form.addEventListener("submit", function (event) {
            event.preventDefault();
            applyPlan({
                target: document.getElementById("targetPath").value,
                days: Number(document.getElementById("preparationDays").value),
                minutes: Number(document.getElementById("dailyMinutes").value)
            }, true);

            document.getElementById("personalPlan").scrollIntoView({
                behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
                block: "start"
            });
        });

        document.querySelectorAll("[data-apply-path]").forEach(function (button) {
            button.addEventListener("click", function () {
                const target = button.dataset.applyPath;
                document.getElementById("targetPath").value = target;
                applyPlan({
                    target: target,
                    days: Number(document.getElementById("preparationDays").value),
                    minutes: Number(document.getElementById("dailyMinutes").value)
                }, true);
                document.getElementById("launchpad").scrollIntoView({ behavior: "smooth" });
                document.getElementById("targetPath").focus({ preventScroll: true });
            });
        });
    }

    function readinessCopy(score) {
        if (score >= 90) {
            return {
                level: "Strong evidence",
                message: "You have a strong base. Test it under pressure.",
                advice: "Move from preparation to simulation: timed assessments, unfamiliar questions and realistic interview follow-ups."
            };
        }

        if (score >= 75) {
            return {
                level: "Interview-ready with gaps",
                message: "Your foundation is useful, but a few gaps can still affect selection.",
                advice: "Prioritise the weakest pillars and prove improvement through a mock, project explanation or timed practice set."
            };
        }

        if (score >= 50) {
            return {
                level: "Developing readiness",
                message: "You have working knowledge that needs consistency.",
                advice: "Strengthen one weak pillar at a time, then connect it to timed practice and spoken explanation."
            };
        }

        if (score >= 25) {
            return {
                level: "Foundation builder",
                message: "Your next gains will come from focused fundamentals.",
                advice: "Avoid random mocks for now. Learn the essential concepts, solve small sets and maintain a mistake bank."
            };
        }

        return {
            level: "Starting point",
            message: "Begin with a small, honest foundation plan.",
            advice: "Choose one programming language, strengthen basic mathematics and build a daily 30-minute preparation habit."
        };
    }

    function calculateReadiness() {
        const inputs = Array.from(document.querySelectorAll("[data-readiness]"));
        const checked = inputs.filter(function (input) {
            return input.checked;
        }).length;
        const score = Math.round((checked / inputs.length) * 100);
        const copy = readinessCopy(score);
        const pillarTotals = {};

        inputs.forEach(function (input) {
            const pillar = input.dataset.pillar;
            if (!pillarTotals[pillar]) {
                pillarTotals[pillar] = { total: 0, checked: 0 };
            }
            pillarTotals[pillar].total += 1;
            pillarTotals[pillar].checked += input.checked ? 1 : 0;
        });

        const ranked = Object.keys(pillarTotals).map(function (pillar) {
            const data = pillarTotals[pillar];
            return {
                pillar: pillar,
                percent: Math.round((data.checked / data.total) * 100)
            };
        }).sort(function (a, b) {
            return a.percent - b.percent;
        });

        const weakest = ranked.filter(function (item) {
            return item.percent === ranked[0].percent;
        }).slice(0, 2).map(function (item) {
            return item.pillar;
        });

        document.getElementById("scoreRing").style.setProperty("--score", String(score));
        document.getElementById("readinessScore").textContent = score + "%";
        document.getElementById("readinessLevel").textContent = copy.level;
        document.getElementById("readinessMessage").textContent = copy.message;
        document.getElementById("readinessAdvice").textContent = copy.advice;
        document.getElementById("readinessFocus").textContent = score === 100
            ? "Maintain your evidence through unfamiliar mocks and follow-up questions"
            : weakest.join(" and ") + (weakest.length > 1 ? " need" : " needs") + " your next evidence task";

        const bars = document.getElementById("pillarBars");
        bars.replaceChildren();
        ranked.forEach(function (item) {
            const row = document.createElement("div");
            const name = document.createElement("span");
            const track = document.createElement("i");
            const fill = document.createElement("b");
            const value = document.createElement("b");

            row.className = "placement-mini-bar";
            name.textContent = item.pillar;
            fill.style.width = item.percent + "%";
            value.textContent = item.percent + "%";
            track.append(fill);
            row.append(name, track, value);
            bars.append(row);
        });

        writeStorage(STORAGE_KEYS.readiness, inputs.map(function (input) {
            return input.checked;
        }));
    }

    function initializeReadiness() {
        const form = document.getElementById("readinessForm");
        const inputs = Array.from(document.querySelectorAll("[data-readiness]"));
        const saved = readStorage(STORAGE_KEYS.readiness, []);

        inputs.forEach(function (input, index) {
            input.checked = Boolean(saved[index]);
            input.addEventListener("change", calculateReadiness);
        });

        form.addEventListener("submit", function (event) {
            event.preventDefault();
            calculateReadiness();
            document.getElementById("readinessScore").focus({ preventScroll: true });
        });

        document.getElementById("resetReadiness").addEventListener("click", function () {
            inputs.forEach(function (input) {
                input.checked = false;
            });
            calculateReadiness();
            inputs[0].focus();
        });

        document.getElementById("readinessScore").setAttribute("tabindex", "-1");
        calculateReadiness();
    }

    function renderRound(key) {
        const data = roundData[key];
        const panel = document.getElementById("roundPanel");
        panel.replaceChildren();

        const icon = document.createElement("div");
        icon.className = "placement-round-icon";
        icon.setAttribute("aria-hidden", "true");
        icon.textContent = data.icon;

        const copy = document.createElement("div");
        copy.className = "placement-round-copy";
        const number = document.createElement("span");
        const title = document.createElement("h3");
        const intro = document.createElement("p");
        const columns = document.createElement("div");

        number.textContent = data.number;
        title.textContent = data.title;
        intro.textContent = data.intro;
        columns.className = "placement-round-columns";

        [
            ["They examine", data.examines],
            ["Prepare by", data.prepares]
        ].forEach(function (group) {
            const wrapper = document.createElement("div");
            const heading = document.createElement("strong");
            const list = document.createElement("ul");
            heading.textContent = group[0];
            group[1].forEach(function (text) {
                const item = document.createElement("li");
                item.textContent = text;
                list.append(item);
            });
            wrapper.append(heading, list);
            columns.append(wrapper);
        });

        const proof = document.createElement("div");
        const proofHeading = document.createElement("strong");
        const proofText = document.createElement("p");
        proofHeading.textContent = "Proof task";
        proofText.textContent = data.proof;
        proof.append(proofHeading, proofText);
        columns.append(proof);

        copy.append(number, title, intro, columns);
        panel.append(icon, copy);
    }

    function initializeRounds() {
        const buttons = Array.from(document.querySelectorAll("[data-round]"));
        buttons.forEach(function (button) {
            button.addEventListener("click", function () {
                setSelectedButton(buttons, button);
                renderRound(button.dataset.round);
            });
        });
    }

    function renderRoadmap(days) {
        const data = roadmapData[days];
        const panel = document.getElementById("roadmapPanel");
        panel.replaceChildren();

        const summary = document.createElement("div");
        const badge = document.createElement("span");
        const title = document.createElement("h3");
        const description = document.createElement("p");
        const rule = document.createElement("div");
        const ruleHeading = document.createElement("strong");
        const ruleText = document.createElement("p");
        const phases = document.createElement("div");

        summary.className = "placement-roadmap-summary";
        phases.className = "placement-roadmap-weeks";
        badge.textContent = data.badge;
        title.textContent = data.title;
        description.textContent = data.description;
        ruleHeading.textContent = "Roadmap rule";
        ruleText.textContent = data.rule;
        rule.append(ruleHeading, ruleText);
        summary.append(badge, title, description, rule);

        data.phases.forEach(function (phase) {
            const article = document.createElement("article");
            const time = document.createElement("span");
            const heading = document.createElement("h4");
            const copy = document.createElement("p");
            time.textContent = phase[0];
            heading.textContent = phase[1];
            copy.textContent = phase[2];
            article.append(time, heading, copy);
            phases.append(article);
        });

        panel.append(summary, phases);
    }

    function selectRoadmap(days) {
        const buttons = Array.from(document.querySelectorAll("[data-roadmap]"));
        const selected = buttons.find(function (button) {
            return Number(button.dataset.roadmap) === Number(days);
        }) || buttons[1];
        setSelectedButton(buttons, selected);
        renderRoadmap(Number(selected.dataset.roadmap));
    }

    function initializeRoadmaps() {
        const buttons = Array.from(document.querySelectorAll("[data-roadmap]"));
        buttons.forEach(function (button) {
            button.addEventListener("click", function () {
                selectRoadmap(Number(button.dataset.roadmap));
            });
        });
    }

    function renderInterviewQuestion() {
        const list = interviewQuestions[interviewCategory];
        const index = interviewIndexes[interviewCategory] % list.length;
        const data = list[index];
        const framework = document.getElementById("frameworkCard");
        const steps = document.getElementById("frameworkSteps");

        document.getElementById("questionCategory").textContent = interviewCategory.toUpperCase() + " INTERVIEW";
        document.getElementById("questionCounter").textContent = "Question " + (index + 1) + " of " + list.length;
        document.getElementById("interviewQuestion").textContent = data.question;
        document.getElementById("frameworkTitle").textContent = data.title;
        document.getElementById("frameworkWarning").textContent = "Avoid: " + data.warning;
        steps.replaceChildren();

        data.steps.forEach(function (step) {
            const item = document.createElement("li");
            const label = document.createElement("strong");
            label.textContent = step[0] + ": ";
            item.append(label, document.createTextNode(step[1]));
            steps.append(item);
        });

        framework.classList.add("is-hidden");
        document.getElementById("showFramework").setAttribute("aria-expanded", "false");
        document.getElementById("showFramework").textContent = "Show Answer Framework";
    }

    function initializeInterviewStudio() {
        const categoryButtons = Array.from(document.querySelectorAll("[data-interview-category]"));
        const framework = document.getElementById("frameworkCard");
        const showButton = document.getElementById("showFramework");

        categoryButtons.forEach(function (button) {
            button.addEventListener("click", function () {
                interviewCategory = button.dataset.interviewCategory;
                setSelectedButton(categoryButtons, button);
                renderInterviewQuestion();
            });
        });

        showButton.addEventListener("click", function () {
            const hidden = framework.classList.toggle("is-hidden");
            showButton.setAttribute("aria-expanded", String(!hidden));
            showButton.textContent = hidden ? "Show Answer Framework" : "Hide Answer Framework";
            if (!hidden) {
                framework.focus({ preventScroll: true });
            }
        });

        framework.setAttribute("tabindex", "-1");

        document.getElementById("nextQuestion").addEventListener("click", function () {
            interviewIndexes[interviewCategory] = (interviewIndexes[interviewCategory] + 1) % interviewQuestions[interviewCategory].length;
            renderInterviewQuestion();
            document.getElementById("interviewQuestion").focus({ preventScroll: true });
        });

        document.getElementById("interviewQuestion").setAttribute("tabindex", "-1");
        renderInterviewQuestion();
    }

    function renderMistakes() {
        const storedEntries = readStorage(STORAGE_KEYS.mistakes, []);
        const entries = Array.isArray(storedEntries) ? storedEntries : [];
        const list = document.getElementById("mistakeList");
        const empty = document.getElementById("mistakeEmpty");
        const count = document.getElementById("mistakeCount");

        list.replaceChildren();
        empty.hidden = entries.length > 0;
        count.textContent = entries.length + " saved";

        entries.forEach(function (entry) {
            const article = document.createElement("article");
            const content = document.createElement("div");
            const category = document.createElement("small");
            const reason = document.createElement("small");
            const problem = document.createElement("p");
            const rule = document.createElement("strong");
            const remove = document.createElement("button");

            article.className = "placement-mistake-entry";
            category.textContent = entry.category;
            reason.textContent = entry.reason;
            problem.textContent = entry.topic;
            rule.textContent = "Next-time rule: " + entry.rule;
            remove.type = "button";
            remove.textContent = "Remove";
            remove.setAttribute("aria-label", "Remove learning rule: " + entry.rule);
            remove.addEventListener("click", function () {
                const storedLatest = readStorage(STORAGE_KEYS.mistakes, []);
                const latest = Array.isArray(storedLatest) ? storedLatest : [];
                writeStorage(STORAGE_KEYS.mistakes, latest.filter(function (item) {
                    return item.id !== entry.id;
                }));
                renderMistakes();
            });

            content.append(category, reason, problem, rule);
            article.append(content, remove);
            list.append(article);
        });
    }

    function initializeMistakeBank() {
        const form = document.getElementById("mistakeForm");
        form.addEventListener("submit", function (event) {
            event.preventDefault();
            const storedEntries = readStorage(STORAGE_KEYS.mistakes, []);
            const entries = Array.isArray(storedEntries) ? storedEntries : [];
            const entry = {
                id: String(Date.now()),
                topic: escapeText(document.getElementById("mistakeTopic").value),
                category: escapeText(document.getElementById("mistakeCategory").value),
                reason: escapeText(document.getElementById("mistakeReason").value),
                rule: escapeText(document.getElementById("correctionRule").value)
            };

            if (!entry.topic || !entry.rule) {
                return;
            }

            entries.unshift(entry);
            writeStorage(STORAGE_KEYS.mistakes, entries.slice(0, 12));
            form.reset();
            renderMistakes();
            document.getElementById("mistakeCount").focus({ preventScroll: true });
        });

        document.getElementById("mistakeCount").setAttribute("tabindex", "-1");
        renderMistakes();
    }

    function updateProofProgress() {
        const inputs = Array.from(document.querySelectorAll("[data-proof-item]"));
        const completed = inputs.filter(function (input) {
            return input.checked;
        }).length;
        const percent = Math.round((completed / inputs.length) * 100);
        const saved = {};

        inputs.forEach(function (input) {
            saved[input.dataset.proofItem] = input.checked;
        });

        document.getElementById("proofProgressText").textContent = completed + "/" + inputs.length + " complete";
        document.getElementById("proofProgressBar").style.width = percent + "%";
        document.getElementById("proofProgress").setAttribute("aria-valuenow", String(completed));
        writeStorage(STORAGE_KEYS.proof, saved);
    }

    function initializeProofChecklist() {
        const inputs = Array.from(document.querySelectorAll("[data-proof-item]"));
        const saved = readStorage(STORAGE_KEYS.proof, {});
        inputs.forEach(function (input) {
            input.checked = Boolean(saved[input.dataset.proofItem]);
            input.addEventListener("change", updateProofProgress);
        });
        updateProofProgress();
    }

    function initialize() {
        initializeSidebar();
        initializeSectionNavigation();
        initializeRoadmaps();
        initializePlanBuilder();
        initializeReadiness();
        initializeRounds();
        initializeInterviewStudio();
        initializeMistakeBank();
        initializeProofChecklist();
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initialize);
    } else {
        initialize();
    }
}());
