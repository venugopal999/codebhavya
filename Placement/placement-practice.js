(function () {
    "use strict";

    const cloud = window.CodeBhavyaSupabase || {};
    const client = cloud.client || null;
    const MISTAKES_KEY = "codebhavya-placement-mistakes-v1";
    const PLAN_KEY = "codebhavya-placement-plan-v1";
    const READINESS_KEY = "codebhavya-placement-readiness-v1";
    const MOBILE_BREAKPOINT = 920;

    const categoryLabels = {
        aptitude: "Aptitude & Reasoning",
        programming: "Programming Fundamentals",
        coding: "Coding & Problem Solving",
        dsa: "Data Structures & Algorithms",
        "core-cs": "Core Computer Science",
        "resume-projects": "Resume & Projects",
        communication: "Technical Communication",
        hr: "HR & Professional Readiness"
    };

    const targetLabels = {
        general: "General",
        service: "Service Company",
        product: "Product Company",
        ai: "AI / ML / Data"
    };

    const categoryAliases = {
        "aptitude & reasoning": "aptitude",
        aptitude: "aptitude",
        reasoning: "aptitude",
        "programming fundamentals": "programming",
        programming: "programming",
        "coding & problem solving": "coding",
        coding: "coding",
        "problem solving": "coding",
        "data structures": "dsa",
        "data structures & algorithms": "dsa",
        dsa: "dsa",
        "core computer science": "core-cs",
        "core cs": "core-cs",
        "core-cs": "core-cs",
        "resume & projects": "resume-projects",
        "resume and projects": "resume-projects",
        "resume-projects": "resume-projects",
        proof: "resume-projects",
        "technical communication": "communication",
        communication: "communication",
        "hr & professional readiness": "hr",
        "hr and professional readiness": "hr",
        interview: "hr",
        hr: "hr"
    };

    const followupAnswerBank = {
        "successive-percentage-price": ["An increase from 100 to 120 needs a 20/120 reduction, so the exact reversing discount is 16⅔%.", "100 becomes 110 and then 88, so the final result is a 12% decrease."],
        "ratio-profit-share": ["A contributes 3×6 + 6×6 = 54 capital-months; B contributes 5×6 + 2.5×6 = 45, giving a 6:5 ratio.", "Profit follows the amount of capital available for the length of time it was used, so capital × time measures each partner's contribution."],
        "average-after-replacement": ["Adjust the old total by the sum of both replacement differences, then divide by the unchanged count.", "Yes. If one or more values change while the count remains fixed, the total—and therefore the average—can change."],
        "combined-time-and-work": ["Their combined rate is 5/36 per day, so the full task takes 36/5 days, or 7.2 days.", "After four days 5/9 remains. A alone needs (5/9) ÷ (1/12) = 20/3 days, or 6⅔ days."],
        "relative-speed-platform": ["The train speed is 15 m/s, so crossing its own 180 m length takes 12 seconds.", "For opposite directions, add the two speeds after converting them to the same unit."],
        "logical-ordering-constraints": ["Treat SQ as one block, enumerate placements of SQ, P, R and T, then discard arrangements where P follows R or T is first.", "For example, requiring Q before S directly contradicts the existing rule that Q is immediately after S."],
        "scope-lifetime-and-memory": ["An inner declaration hides a same-named outer declaration within the inner scope.", "Automatic local variables are commonly stored in a function's stack frame, although the language standard does not require a particular physical location."],
        "pointer-pass-by-value": ["No. A single pointer lets the function modify the pointed-to object, but assigning a new address only changes the function's copied pointer.", "Use a pointer-to-pointer when the function must update the caller's pointer value, such as allocating memory and returning its address."],
        "recursion-base-case-proof": ["Factorial takes O(n) time and O(n) call-stack space for n recursive calls.", "Prefer iteration when recursion depth may overflow the stack, when a loop is clearer, or when the language cannot optimize the recursion."],
        "debug-array-boundary": ["For indexes 1 through n, allocate or model that range explicitly; a normal n-element zero-based C array still uses 0 through n−1.", "Compiler warnings plus AddressSanitizer, Valgrind or similar runtime memory tools can expose the out-of-bounds access."],
        "safe-file-processing": ["A with-statement or RAII object closes the resource automatically when control leaves the scope, including on errors.", "Discard partial output when consumers require an all-or-nothing result; write to a temporary destination and publish it only after success."],
        "python-mutable-default-argument": ["Immutable defaults are normally safe from this mutation problem, though a default whose behavior depends on current time or state can still be semantically wrong.", "It can deliberately retain a cache or shared accumulator, but that state should be explicit and documented because it surprises callers."],
        "two-sum-tradeoffs": ["With sorted input, use two pointers from both ends for O(n) time and O(1) extra space.", "Store all positions for each value or scan all valid complements carefully; define whether duplicate index pairs and ordering count as distinct."],
        "normalized-palindrome": ["Use Unicode-aware character iteration, normalization and case folding; byte-wise ASCII rules can split or miscompare characters.", "Create a normalized O(n)-space string and compare it with its reverse, which is simpler but uses extra memory."],
        "first-non-repeating-character": ["Yes. Maintain counts plus a queue of candidates and remove items from the front once their count exceeds one.", "For a truly fixed-size alphabet the count table uses O(1) auxiliary space; otherwise space grows with the number of distinct characters."],
        "merge-overlapping-intervals": ["With bounded integer endpoints, a difference array or bitmap can approach O(n + range), trading time for range-sized memory.", "Binary-search the insertion point, merge the new interval with overlapping neighbors, and leave the remaining sorted intervals unchanged."],
        "missing-number-xor": ["One XOR value cannot identify two missing numbers; use extra equations such as sum and sum of squares, or partition by a distinguishing bit when constraints allow.", "The basic XOR trick no longer isolates the answer because duplicates do not represent the expected set; use counting, a hash set or a frequency-aware method."],
        "longest-unique-substring": ["Track the best window's start and length, then return the slice after the scan.", "Maintain character frequencies in a sliding window and shrink it while the number of distinct characters exceeds k."],
        "array-vs-linked-list": ["A dynamic array keeps O(1) indexing and amortized O(1) append, but middle insertion shifts elements and resizing can relocate storage.", "If references must survive insertions and growth, a node-based or stability-guaranteeing container may be preferable despite poorer locality."],
        "balanced-parentheses-stack": ["Keep each character's index with the stack entry and report the closing index on a mismatch or the stored opening index left at the end.", "For arbitrary nesting depth, any one-pass validator needs enough state to remember unmatched openings, so worst-case auxiliary space is O(n)."],
        "bfs-unweighted-shortest-path": ["Weighted edges break level-equals-cost reasoning; use Dijkstra for non-negative weights or another weight-appropriate algorithm.", "With adjacency lists, BFS takes O(V + E) time and O(V) auxiliary space."],
        "skewed-bst-complexity": ["AVL trees enforce tighter height balance and often faster lookup; red-black trees allow looser balance and usually fewer rotations on updates.", "No. Random insertion gives good expected height under assumptions, but a particular order can still create a tall tree."],
        "hash-collision-strategies": ["A tombstone preserves probe chains after deletion; clearing the slot outright could make later keys unreachable.", "Resize before the chosen load-factor threshold causes long chains or probe sequences, and use measurements appropriate to the collision strategy."],
        "sort-nearly-sorted-data": ["At k=0 the input is already sorted; as k approaches n, O(n log k) approaches ordinary O(n log n) sorting.", "Yes. Very small displacement gives insertion sort few shifts, so its simple constants can make it competitive despite the O(nk) bound."],
        "database-index-tradeoff": ["If a predicate matches much of the table, index lookups plus table reads may cost more than a sequential scan.", "Composite indexes primarily support predicates following their leading-column order, so order must match actual filters, joins and sorts."],
        "normalization-orders-schema": ["For read-heavy measured bottlenecks, selective duplication or materialized views can be reasonable when consistency and refresh costs are controlled.", "Store the shipping address as an order snapshot so later customer-address changes do not rewrite the historical order."],
        "transaction-isolation-ticketing": ["A serializable transaction may be aborted when the database detects a conflict, so the application must retry the entire transaction safely.", "Update only when a version or available-count condition still matches; if zero rows change, reload and retry or report that inventory is gone."],
        "process-vs-thread": ["Threads share writable memory, so unsynchronized interleaving of reads and writes can produce results that depend on timing.", "User-level threads are managed by a runtime with cheap scheduling; kernel threads are scheduled by the OS and can run independently on cores, with higher management cost."],
        "deadlock-four-conditions": ["Deadlock is a cycle of tasks waiting on one another; starvation is indefinite delay because a task repeatedly loses access even though the system continues.", "Timeouts can recover from long waits but may abort healthy slow work, require rollback/retry logic and do not prove a deadlock existed."],
        "tcp-vs-udp-video-call": ["TCP fits media downloads or buffered streaming where complete ordered delivery matters more than immediate playback latency.", "Use sequence numbers, jitter buffers, concealment, forward error correction or selective retransmission only when a packet can still meet its deadline."],
        "two-minute-project-story": ["Find the first measured constraint—database queries, memory, CPU, external APIs or architecture—and explain the evidence, not a guessed buzzword.", "Choose a decision whose original constraint changed, explain the replacement, its trade-off and how you would validate the redesign."],
        "defend-technology-choice": ["Name the real dominant constraint, such as relational consistency, delivery time, expected query shape or team operational skill, and support it with evidence.", "Define a measurable trigger such as latency, write volume, cost or feature mismatch; migration should respond to evidence, not an arbitrary user count."],
        "measurable-resume-bullet": ["A repository, demonstration, test result, issue history or clear explanation of your exact contribution should support every claim.", "Remove vague phrases such as worked on, helped with, familiar with and various; replace them with a precise action you can defend."],
        "ml-project-limitation": ["Split before learned preprocessing, remove post-outcome features, audit feature availability at prediction time and compare suspiciously strong validation with a clean pipeline.", "It should beat a relevant simple rule, majority/class-prior baseline or current human/process baseline on the metric tied to real error costs."],
        "think-aloud-unfamiliar-problem": ["State the failed assumption, return to the last verified point, update the example or invariant, and continue without hiding the correction.", "Ask after showing concrete progress and naming the exact blockage; a focused hint request reveals reasoning better than requesting the solution."],
        "professional-i-do-not-know": ["Use authoritative documentation, a minimal reproducible experiment, logs or measurements, then compare the evidence with the stated prediction.", "Name the related principle, explain what transfers and explicitly mark where the analogy may stop."],
        "explain-technical-tradeoff": ["Give a range or scenarios, state assumptions and confidence, and identify the measurement that would resolve the uncertainty.", "Engineers may need traces, benchmarks or architecture diagrams; stakeholders may benefit from a small cost/risk/time comparison tied to the same evidence."],
        "role-focused-self-introduction": ["Connect the role's responsibilities to one or two demonstrated strengths and explain why this work is the next logical direction for you.", "Choose the project with the strongest relevant ownership, decision and result—not necessarily the project using the most technologies."],
        "team-conflict-with-evidence": ["Present their concern fairly, including its valid part, and avoid claiming that only your view was rational.", "Name one earlier action such as agreeing on decision criteria, documenting assumptions or testing both proposals, and explain the expected improvement."],
        "failure-feedback-growth": ["Compare later evidence—fewer defects, faster feedback, a completed result or peer review—with the original failure using a credible measure.", "Describe a concrete checklist, automated test, review gate, monitoring signal or communication habit now built into the process."]
    };

    const fallbackQuestions = [
        {
            id: "starter-aptitude-work",
            slug: "starter-combined-work",
            question_type: "practice",
            category: "aptitude",
            topic: "Time and Work",
            difficulty: "intermediate",
            target_path: "general",
            question: "A can complete a task in 12 days and B in 18 days. They work together for 4 days, then A leaves. How many more days will B need, and how would you verify the result?",
            answer_framework: ["Convert each person's rate into work per day.", "Calculate the combined work completed in four days.", "Find the remaining fraction and divide it by B's daily rate.", "Verify that completed work plus remaining work equals one whole task."],
            hint: "Use rates of 1/12 and 1/18 of the task per day.",
            common_mistake: "Adding the numbers of days instead of adding work rates.",
            follow_up_questions: [
                { question: "What changes if B leaves instead?", answer: "After four joint days, 4/9 of the work is complete and 5/9 remains. A alone works at 1/12 per day, so A needs (5/9) ÷ (1/12) = 20/3 days, or 6⅔ days." },
                { question: "Can you solve it using an LCM-based total-work method?", answer: "Use 36 units as total work. A completes 3 units/day and B completes 2 units/day. Together they finish 20 units in four days; the remaining 16 units take B 8 days." }
            ],
            isDatabaseQuestion: false
        },
        {
            id: "starter-programming-scope",
            slug: "starter-variable-scope",
            question_type: "interview",
            category: "programming",
            topic: "Scope and Memory",
            difficulty: "beginner",
            target_path: "general",
            question: "Explain local, global and static variables. Where does each live, how long does it remain available, and what bug can careless use create?",
            answer_framework: ["Define visibility separately from lifetime.", "Use one small code example for each variable kind.", "Explain initialization and retention of values.", "Name a realistic risk such as hidden shared state or unintended coupling."],
            hint: "Scope answers where a name is visible; lifetime answers how long its storage exists.",
            common_mistake: "Treating scope and lifetime as the same property.",
            follow_up_questions: [
                { question: "What is variable shadowing?", answer: "A declaration in an inner scope uses the same name as one in an outer scope, so references inside the inner scope resolve to the nearer declaration." },
                { question: "How is a static local variable different from a global variable?", answer: "Both usually live for the program's lifetime, but a static local name is visible only inside its function or block while a global name has wider file or program visibility." }
            ],
            isDatabaseQuestion: false
        },
        {
            id: "starter-coding-palindrome",
            slug: "starter-normalized-palindrome",
            question_type: "practice",
            category: "coding",
            topic: "String Processing",
            difficulty: "beginner",
            target_path: "general",
            question: "Design a function that decides whether a sentence is a palindrome while ignoring spaces, punctuation and letter case. Explain the complexity and edge cases.",
            answer_framework: ["Clarify which characters count and how case is normalized.", "Use two pointers that skip non-alphanumeric characters.", "Compare normalized characters and stop on the first mismatch.", "State O(n) time, O(1) extra space, and test empty or punctuation-only input."],
            hint: "Two pointers can avoid building a second string.",
            common_mistake: "Checking the raw sentence without defining normalization rules.",
            follow_up_questions: [
                { question: "How would Unicode affect your solution?", answer: "Byte-by-byte checks may split multibyte characters. Use Unicode-aware character iteration and a documented normalization/case-folding rule before comparing." },
                { question: "What changes if extra memory is allowed?", answer: "Build a normalized string containing only accepted characters, then compare it with its reverse or use two pointers. The code is simpler but uses O(n) extra space." }
            ],
            isDatabaseQuestion: false
        },
        {
            id: "starter-dsa-choice",
            slug: "starter-array-linked-list",
            question_type: "interview",
            category: "dsa",
            topic: "Choosing a Data Structure",
            difficulty: "intermediate",
            target_path: "general",
            question: "For a collection with frequent indexed reads and occasional insertions, would you choose an array or linked list? Defend the decision and state when you would change it.",
            answer_framework: ["Begin with the dominant operations and constraints.", "Compare indexed access, insertion cost, memory overhead and cache locality.", "Choose an array when indexed reads dominate.", "State the workload change that would justify a linked structure or another alternative."],
            hint: "The best structure follows the most frequent costly operation, not one operation in isolation.",
            common_mistake: "Saying linked-list insertion is always O(1) without accounting for locating the position.",
            follow_up_questions: [
                { question: "How does a dynamic array change the trade-off?", answer: "It preserves O(1) indexed reads and offers amortized O(1) append, but a resize can copy all elements and insertion in the middle still shifts elements." },
                { question: "What if stable references to elements are required?", answer: "A growing dynamic array may relocate its storage and invalidate references. A node-based structure or a container designed for stable references may then be more suitable." }
            ],
            isDatabaseQuestion: false
        },
        {
            id: "starter-core-index",
            slug: "starter-database-index",
            question_type: "interview",
            category: "core-cs",
            topic: "DBMS Indexes",
            difficulty: "intermediate",
            target_path: "general",
            question: "A query on a large table is slow. Explain when an index can help, what it costs, and how you would confirm that the database actually uses it.",
            answer_framework: ["Identify the filter, join or ordering columns used by the query.", "Explain how an index reduces scanning for selective access.", "State write, storage and maintenance costs.", "Use an execution plan and measured query timing to verify the effect."],
            hint: "An index is useful only when its access path is more selective than a table scan.",
            common_mistake: "Claiming that adding an index always makes every query faster.",
            follow_up_questions: [
                { question: "Why might a low-cardinality index be ignored?", answer: "If a value matches a large share of rows, reading the index plus table pages can cost more than a sequential scan, so the optimizer may correctly ignore it." },
                { question: "How does column order matter in a composite index?", answer: "The leading columns determine which query predicates can efficiently narrow the search. Put columns in an order that matches real filters, joins and sorting—not a universal formula." }
            ],
            isDatabaseQuestion: false
        },
        {
            id: "starter-project-story",
            slug: "starter-project-story",
            question_type: "interview",
            category: "resume-projects",
            topic: "Project Defence",
            difficulty: "intermediate",
            target_path: "general",
            question: "Give a two-minute explanation of one project that proves your contribution, engineering judgment and result—not merely the technologies you used.",
            answer_framework: ["State the problem and intended user.", "Separate your responsibility from the team's work.", "Explain one important design choice and its trade-off.", "Describe a challenge, how you tested the solution, the result and one next improvement."],
            hint: "Use Problem → My Role → Decision → Challenge → Result → Next Step.",
            common_mistake: "Listing technologies without explaining decisions, ownership or evidence.",
            follow_up_questions: [
                { question: "What failed during development?", answer: "Give one real failure, its observable impact, the evidence used to isolate the cause, the change you made and how you verified that the problem was resolved." },
                { question: "What would you redesign for ten times more users?", answer: "Identify the measured bottleneck first. Then discuss likely changes such as caching, indexing, queues or horizontal scaling and name the trade-off introduced by the chosen change." }
            ],
            isDatabaseQuestion: false
        },
        {
            id: "starter-communication-unknown",
            slug: "starter-professional-unknown",
            question_type: "interview",
            category: "communication",
            topic: "Reasoning Under Uncertainty",
            difficulty: "beginner",
            target_path: "general",
            question: "An interviewer asks about a concept you do not know. Demonstrate how you would respond professionally while still showing useful reasoning.",
            answer_framework: ["State honestly which part you do not know.", "Share the related facts or principles you do understand.", "Reason cautiously from those facts without pretending certainty.", "Ask a focused clarifying question or describe how you would verify the answer."],
            hint: "Honesty plus structured reasoning is stronger than a confident guess.",
            common_mistake: "Stopping at 'I do not know' or inventing an answer.",
            follow_up_questions: [
                { question: "How would you verify your hypothesis?", answer: "State the smallest reliable check: consult authoritative documentation, build a minimal test, inspect logs or measurements, and compare the result with your prediction." },
                { question: "Can you connect the question to a concept you already know?", answer: "Name the related principle, explain the part that transfers, and clearly mark where the analogy may stop so you do not present an inference as a fact." }
            ],
            isDatabaseQuestion: false
        },
        {
            id: "starter-hr-conflict",
            slug: "starter-team-conflict",
            question_type: "interview",
            category: "hr",
            topic: "Behavioural Evidence",
            difficulty: "intermediate",
            target_path: "general",
            question: "Tell me about a genuine disagreement in a team. How did you keep the discussion productive, what action did you take, and what changed afterward?",
            answer_framework: ["Give concise context and the shared goal.", "Describe the disagreement without blaming the other person.", "Explain the specific listening, evidence or experiment you used.", "State the result and what you learned for future teamwork."],
            hint: "Use Situation → Tension → Action → Result → Learning, with a real example.",
            common_mistake: "Claiming you never experience conflict or presenting yourself as the only reasonable person.",
            follow_up_questions: [
                { question: "What would the other person say about the situation?", answer: "A strong response fairly states their concern and acknowledges any valid point. It shows perspective-taking instead of rewriting the story to make you blameless." },
                { question: "What would you do differently now?", answer: "Name one earlier or clearer action—such as agreeing on decision criteria, documenting assumptions or testing both proposals—and explain how it would improve the outcome." }
            ],
            isDatabaseQuestion: false
        }
    ];

    let allQuestions = fallbackQuestions.slice();
    let questionSource = "starter";
    let currentUser = null;
    let attemptHistory = new Map();
    let sessionQuestions = [];
    let sessionResults = [];
    let currentIndex = 0;
    let questionStartedAt = 0;
    let currentQuestionDuration = 0;
    let remediationResultIndex = null;
    let timerId = null;
    let questionBankPromise = null;

    function element(id) {
        return document.getElementById(id);
    }

    function readJson(key, fallback) {
        try {
            const value = window.localStorage.getItem(key);
            return value ? JSON.parse(value) : fallback;
        } catch (error) {
            return fallback;
        }
    }

    function writeJson(key, value) {
        try {
            window.localStorage.setItem(key, JSON.stringify(value));
            window.dispatchEvent(new CustomEvent("codebhavya:local-progress-changed", {
                detail: { key: key, value: value, changedAt: new Date().toISOString() }
            }));
            return true;
        } catch (error) {
            return false;
        }
    }

    function normalizeCategory(value) {
        const key = String(value || "").trim().toLowerCase();
        return categoryAliases[key] || key.replace(/\s+/g, "-");
    }

    function normalizeArray(value) {
        if (Array.isArray(value)) {
            return value.map(function (item) { return String(item); }).filter(Boolean);
        }
        if (typeof value === "string") {
            try {
                const parsed = JSON.parse(value);
                return Array.isArray(parsed) ? parsed.map(String).filter(Boolean) : [];
            } catch (error) {
                return value.trim() ? [value.trim()] : [];
            }
        }
        return [];
    }

    function normalizeFollowups(value, slug) {
        let parsed = value;
        if (typeof value === "string") {
            try {
                parsed = JSON.parse(value);
            } catch (error) {
                parsed = value.trim() ? [value.trim()] : [];
            }
        }
        if (!Array.isArray(parsed)) {
            return [];
        }
        const knownAnswers = followupAnswerBank[String(slug || "")] || [];
        return parsed.map(function (item, index) {
            if (item && typeof item === "object") {
                return {
                    question: String(item.question || item.prompt || "").trim(),
                    answer: String(item.answer || item.guidance || knownAnswers[index] || "").trim()
                };
            }
            return { question: String(item || "").trim(), answer: knownAnswers[index] || "" };
        }).filter(function (item) { return item.question; });
    }

    function normalizeQuestion(row) {
        return {
            id: row.id,
            slug: row.slug || String(row.id),
            question_type: row.question_type || "practice",
            category: normalizeCategory(row.category),
            topic: row.topic || "Placement Practice",
            difficulty: String(row.difficulty || "intermediate").toLowerCase(),
            target_path: String(row.target_path || "general").toLowerCase(),
            question: row.question || "",
            answer_framework: normalizeArray(row.answer_framework),
            hint: row.hint || "Break the question into known facts, the required result and one verifiable next step.",
            common_mistake: row.common_mistake || "Giving a conclusion without explaining the reasoning.",
            follow_up_questions: normalizeFollowups(row.follow_up_questions, row.slug),
            isDatabaseQuestion: true
        };
    }

    function setSourceNote(source, message) {
        const note = element("practiceSourceNote");
        note.dataset.source = source;
        note.lastElementChild.textContent = message;
    }

    async function loadQuestionBank() {
        if (!client) {
            questionSource = "starter";
            setSourceNote("starter", "Starter set active. Add the Supabase question seed to unlock the complete bank.");
            return allQuestions;
        }

        try {
            const result = await client
                .from("question_bank")
                .select("id,slug,question_type,category,topic,difficulty,target_path,question,answer_framework,hint,common_mistake,follow_up_questions")
                .eq("is_published", true)
                .order("category", { ascending: true });

            if (result.error) {
                throw result.error;
            }

            const questions = (result.data || []).map(normalizeQuestion).filter(function (item) {
                return item.question && categoryLabels[item.category];
            });

            if (!questions.length) {
                throw new Error("No published questions are available.");
            }

            allQuestions = questions;
            questionSource = "cloud";
            setSourceNote("cloud", questions.length + " reviewed questions ready from the CodeBhavya bank.");
        } catch (error) {
            allQuestions = fallbackQuestions.slice();
            questionSource = "starter";
            setSourceNote("starter", "Starter set active. The complete question bank could not be reached, but practice still works.");
        }

        return allQuestions;
    }

    function getRecommendedCategory() {
        const answers = readJson(READINESS_KEY, []);
        const order = ["aptitude", "programming", "coding", "dsa", "core-cs", "resume-projects", "communication", "hr"];

        if (!Array.isArray(answers) || !answers.some(Boolean)) {
            return { category: "coding", hasAssessment: false, score: 0 };
        }

        let lowest = { category: order[0], score: 3 };
        order.forEach(function (category, index) {
            const score = [answers[index * 2], answers[index * 2 + 1]].filter(Boolean).length;
            if (score < lowest.score) {
                lowest = { category: category, score: score };
            }
        });
        return { category: lowest.category, hasAssessment: true, score: lowest.score };
    }

    function updateRecommendation() {
        const recommendation = getRecommendedCategory();
        const message = recommendation.hasAssessment
            ? "Recommended focus: " + categoryLabels[recommendation.category] + " (your lowest evidence score)."
            : "No readiness result yet; Recommended will begin with Coding & Problem Solving.";
        element("practiceRecommendation").textContent = message;
    }

    async function loadAttemptHistory() {
        attemptHistory = new Map();
        if (!client || !currentUser) {
            return;
        }

        try {
            const result = await client
                .from("practice_attempts")
                .select("question_id,created_at")
                .eq("user_id", currentUser.id)
                .order("created_at", { ascending: false })
                .limit(500);

            if (result.error) {
                throw result.error;
            }

            (result.data || []).forEach(function (attempt) {
                if (!attemptHistory.has(attempt.question_id)) {
                    attemptHistory.set(attempt.question_id, Date.parse(attempt.created_at) || 0);
                }
            });
        } catch (error) {
            attemptHistory = new Map();
        }
    }

    function shuffle(items) {
        const copy = items.slice();
        for (let index = copy.length - 1; index > 0; index -= 1) {
            const target = Math.floor(Math.random() * (index + 1));
            const hold = copy[index];
            copy[index] = copy[target];
            copy[target] = hold;
        }
        return copy;
    }

    function prioritizeQuestions(items) {
        return shuffle(items).sort(function (first, second) {
            const firstSeen = attemptHistory.has(first.id) ? attemptHistory.get(first.id) : -1;
            const secondSeen = attemptHistory.has(second.id) ? attemptHistory.get(second.id) : -1;
            return firstSeen - secondSeen;
        });
    }

    function balancedQuestions(items, limit) {
        const groups = {};
        items.forEach(function (question) {
            groups[question.category] = groups[question.category] || [];
            groups[question.category].push(question);
        });
        Object.keys(groups).forEach(function (category) {
            groups[category] = prioritizeQuestions(groups[category]);
        });

        const selected = [];
        const categoryOrder = shuffle(Object.keys(groups));
        while (selected.length < limit && categoryOrder.some(function (category) { return groups[category].length; })) {
            categoryOrder.forEach(function (category) {
                if (selected.length < limit && groups[category].length) {
                    selected.push(groups[category].shift());
                }
            });
        }
        return selected;
    }

    function selectQuestions(filters) {
        const recommended = getRecommendedCategory().category;
        const resolvedCategory = filters.category === "recommended" ? recommended : filters.category;
        const pool = allQuestions.filter(function (question) {
            const categoryMatches = resolvedCategory === "all" || question.category === resolvedCategory;
            const targetMatches = filters.target === "general"
                ? question.target_path === "general"
                : question.target_path === "general" || question.target_path === filters.target;
            const difficultyMatches = filters.difficulty === "all" || question.difficulty === filters.difficulty;
            return categoryMatches && targetMatches && difficultyMatches;
        });

        return {
            questions: resolvedCategory === "all"
                ? balancedQuestions(pool, filters.length)
                : prioritizeQuestions(pool).slice(0, filters.length),
            resolvedCategory: resolvedCategory,
            available: pool.length
        };
    }

    function formatDuration(seconds) {
        const safeSeconds = Math.max(0, Number(seconds) || 0);
        const minutes = Math.floor(safeSeconds / 60);
        const remainder = safeSeconds % 60;
        return String(minutes).padStart(2, "0") + ":" + String(remainder).padStart(2, "0");
    }

    function updateTimer() {
        if (!questionStartedAt) {
            return;
        }
        element("practiceTimer").textContent = formatDuration(Math.floor((Date.now() - questionStartedAt) / 1000));
    }

    function startTimer() {
        window.clearInterval(timerId);
        updateTimer();
        timerId = window.setInterval(updateTimer, 1000);
    }

    function resetQuestionForm() {
        element("practiceNotes").value = "";
        element("practiceHint").hidden = true;
        element("practiceFramework").hidden = true;
        element("practiceAssessment").hidden = true;
        element("practiceRemediation").hidden = true;
        element("practiceShowHint").disabled = false;
        element("practiceShowHint").textContent = "Show one hint";
        element("practiceRevealFramework").disabled = false;
        element("practiceRevealFramework").textContent = "Reveal Interview Framework";
        element("practiceAssessment").reset();
        element("practiceCorrectionWrap").hidden = true;
        element("practiceSaveMessage").textContent = "";
        element("practiceSaveMessage").dataset.tone = "neutral";
        element("practiceSaveNext").disabled = false;
        element("practiceContinueAfterReview").disabled = false;
    }

    function renderQuestion() {
        const question = sessionQuestions[currentIndex];
        if (!question) {
            renderSummary();
            return;
        }

        resetQuestionForm();
        element("practiceProgressText").textContent = "QUESTION " + (currentIndex + 1) + " OF " + sessionQuestions.length;
        element("practiceProgress").setAttribute("aria-valuemax", String(sessionQuestions.length));
        element("practiceProgress").setAttribute("aria-valuenow", String(currentIndex + 1));
        element("practiceProgressBar").style.width = (((currentIndex + 1) / sessionQuestions.length) * 100) + "%";
        element("practiceQuestionCategory").textContent = categoryLabels[question.category] || question.category;
        element("practiceQuestionDifficulty").textContent = question.difficulty;
        element("practiceQuestionTarget").textContent = targetLabels[question.target_path] || question.target_path;
        element("practiceQuestionTopic").textContent = question.topic;
        element("practiceQuestionText").textContent = question.question;
        element("practiceHintText").textContent = question.hint;
        element("practiceCommonMistake").textContent = question.common_mistake;

        const steps = element("practiceFrameworkSteps");
        steps.replaceChildren();
        question.answer_framework.forEach(function (step) {
            const item = document.createElement("li");
            item.textContent = step;
            steps.append(item);
        });

        const followups = element("practiceFollowups");
        followups.replaceChildren();
        (question.follow_up_questions.length ? question.follow_up_questions : [{
            question: "Can you justify the trade-off in your answer?",
            answer: "Name the alternative you considered, compare the most important cost or constraint, and explain why your choice fits this situation."
        }]).forEach(function (followup) {
            const item = document.createElement("li");
            const details = document.createElement("details");
            const summary = document.createElement("summary");
            const answer = document.createElement("p");
            summary.textContent = followup.question;
            answer.textContent = followup.answer || "Use the framework above to answer this follow-up, then compare your response with the correction rule before continuing.";
            details.append(summary, answer);
            item.append(details);
            followups.append(item);
        });

        currentQuestionDuration = 0;
        questionStartedAt = Date.now();
        element("practiceTimer").textContent = "00:00";
        startTimer();
        element("practiceQuestionText").setAttribute("tabindex", "-1");
        element("practiceQuestionText").focus({ preventScroll: true });
    }

    function getFilters() {
        return {
            target: element("practiceTarget").value,
            category: element("practiceCategory").value,
            difficulty: element("practiceDifficulty").value,
            length: Number(element("practiceLength").value) || 5
        };
    }

    async function startSession(event) {
        if (event) {
            event.preventDefault();
        }

        element("practiceEmptyState").hidden = true;
        element("practiceQuestionCard").hidden = true;
        element("practiceSummary").hidden = true;
        element("practiceLoadingState").hidden = false;
        element("practiceStartButton").disabled = true;

        await questionBankPromise;
        await loadAttemptHistory();

        const filters = getFilters();
        const selection = selectQuestions(filters);
        sessionQuestions = selection.questions;
        sessionResults = [];
        currentIndex = 0;

        element("practiceLoadingState").hidden = true;
        element("practiceStartButton").disabled = false;

        if (!sessionQuestions.length) {
            element("practiceEmptyState").hidden = false;
            element("workspaceTitle").textContent = "No questions match this exact combination yet.";
            element("practiceEmptyState").querySelector("p").textContent = "Choose Balanced difficulty or another skill. Your current filters were not changed.";
            setSourceNote(questionSource, "No exact match. Choose Balanced difficulty or a different skill to continue.");
            return;
        }

        if (selection.available < filters.length) {
            setSourceNote(questionSource, "This focused session contains all " + selection.available + " matching questions. More are being added without lowering your filter quality.");
        } else if (questionSource === "cloud") {
            setSourceNote("cloud", allQuestions.length + " reviewed questions ready. Unseen questions are prioritised when signed in.");
        }

        element("practiceTimer").textContent = "00:00";
        element("practiceQuestionCard").hidden = false;
        renderQuestion();
        element("practiceWorkspace").scrollIntoView({ behavior: "smooth", block: "start" });
    }

    function revealHint() {
        element("practiceHint").hidden = false;
        element("practiceShowHint").disabled = true;
        element("practiceShowHint").textContent = "Hint visible";
    }

    function revealFramework() {
        currentQuestionDuration = Math.max(1, Math.round((Date.now() - questionStartedAt) / 1000));
        window.clearInterval(timerId);
        element("practiceTimer").textContent = formatDuration(currentQuestionDuration);
        element("practiceFramework").hidden = false;
        element("practiceAssessment").hidden = false;
        element("practiceRevealFramework").disabled = true;
        element("practiceRevealFramework").textContent = "Framework revealed";
        element("practiceFramework").setAttribute("tabindex", "-1");
        element("practiceFramework").focus({ preventScroll: true });
    }

    function prerequisiteFor(category) {
        const destinations = {
            aptitude: { href: "../Maths/index.html", label: "Review the Maths foundation" },
            programming: { href: "quiz.html?topic=c", label: "Practise C fundamentals" },
            coding: { href: "practice.html", label: "Choose a problem-solving practice" },
            dsa: { href: "../Data-Structures/index.html", label: "Review Data Structures" },
            "core-cs": { href: "quiz.html?topic=core-cs", label: "Practise Core CS concepts" },
            "resume-projects": { href: "index.html#proof", label: "Review the proof checklist" },
            communication: { href: "index.html#interviewStudio", label: "Review the answer structure" },
            hr: { href: "index.html#interviewStudio", label: "Review interview preparation" }
        };
        return destinations[category] || { href: "practice.html", label: "Choose another practice mode" };
    }

    function showRemediation(question, result, correctionRule) {
        const rule = String(correctionRule || "Rebuild the answer using the framework, then explain each step without reading it.").trim();
        const destination = prerequisiteFor(question.category);
        remediationResultIndex = sessionResults.length - 1;
        element("practiceAssessment").hidden = true;
        element("practiceRemediationTitle").textContent = result.outcome === "correct"
            ? "Build independent confidence before continuing."
            : "Correct this answer before continuing.";
        element("practiceRemediationMessage").textContent = result.confidence <= 2
            ? "You marked low confidence. Review the exact gap below, then retry now or continue only after completing the review."
            : "Your outcome shows a gap. Convert it into one clear rule and use the framework to make a stronger second attempt.";
        element("practiceRemediationRule").textContent = rule;

        const steps = element("practiceRemediationSteps");
        steps.replaceChildren();
        question.answer_framework.forEach(function (step) {
            const item = document.createElement("li");
            item.textContent = step;
            steps.append(item);
        });

        const link = element("practicePrerequisiteLink");
        link.href = destination.href;
        link.textContent = destination.label;
        element("practiceRemediation").hidden = false;
        element("practiceRemediation").setAttribute("tabindex", "-1");
        element("practiceRemediation").focus({ preventScroll: true });
    }

    function retryCurrentQuestion() {
        if (remediationResultIndex === sessionResults.length - 1) {
            sessionResults.splice(remediationResultIndex, 1);
        }
        remediationResultIndex = null;
        resetQuestionForm();
        currentQuestionDuration = 0;
        questionStartedAt = Date.now();
        element("practiceTimer").textContent = "00:00";
        startTimer();
        element("practiceQuestionText").focus({ preventScroll: true });
    }

    function continueAfterReview() {
        element("practiceContinueAfterReview").disabled = true;
        remediationResultIndex = null;
        currentIndex += 1;
        renderQuestion();
    }

    function handleOutcomeChange() {
        const selected = document.querySelector('input[name="outcome"]:checked');
        const needsCorrection = selected && ["partial", "incorrect", "skipped"].includes(selected.value);
        element("practiceCorrectionWrap").hidden = !needsCorrection;
    }

    function addMistake(question, outcome, customRule) {
        if (outcome === "correct") {
            return null;
        }

        const stored = readJson(MISTAKES_KEY, []);
        const entries = Array.isArray(stored) ? stored : [];
        const id = "practice-" + String(question.slug || question.id) + "-" + Date.now();
        const reasonLabels = {
            partial: "Incomplete explanation",
            incorrect: "Concept gap",
            skipped: "Could not begin"
        };
        const entry = {
            id: id,
            topic: question.topic + ": " + question.question.slice(0, 90),
            category: categoryLabels[question.category] || question.category,
            reason: reasonLabels[outcome] || "Concept gap",
            rule: String(customRule || "Review " + question.topic + " and explain the correct approach before the next mock.").trim().slice(0, 140)
        };

        const withoutDuplicate = entries.filter(function (item) {
            return !(item && item.topic === entry.topic && item.rule === entry.rule);
        });
        withoutDuplicate.unshift(entry);
        writeJson(MISTAKES_KEY, withoutDuplicate.slice(0, 12));
        return entry;
    }

    async function saveCloudAttempt(question, result) {
        if (!client || !currentUser || !question.isDatabaseQuestion) {
            return { saved: false, reason: "local" };
        }

        try {
            const response = await client.from("practice_attempts").insert({
                user_id: currentUser.id,
                question_id: question.id,
                outcome: result.outcome,
                confidence: result.confidence,
                duration_seconds: result.durationSeconds,
                explanation: result.explanation || null
            });
            if (response.error) {
                throw response.error;
            }
            attemptHistory.set(question.id, Date.now());
            return { saved: true };
        } catch (error) {
            return { saved: false, reason: "error" };
        }
    }

    async function saveAssessment(event) {
        event.preventDefault();
        const selected = document.querySelector('input[name="outcome"]:checked');
        const confidence = Number(element("practiceConfidence").value);
        const message = element("practiceSaveMessage");

        if (!selected || !confidence) {
            message.textContent = "Choose an honest outcome and confidence level before continuing.";
            message.dataset.tone = "error";
            return;
        }

        const question = sessionQuestions[currentIndex];
        const result = {
            questionId: question.id,
            category: question.category,
            outcome: selected.value,
            confidence: confidence,
            durationSeconds: currentQuestionDuration || Math.max(1, Math.round((Date.now() - questionStartedAt) / 1000)),
            explanation: element("practiceNotes").value.trim().slice(0, 1000)
        };

        element("practiceSaveNext").disabled = true;
        message.textContent = currentUser ? "Saving this attempt…" : "Recording this session result…";
        message.dataset.tone = "neutral";
        sessionResults.push(result);
        addMistake(question, result.outcome, element("practiceCorrection").value);

        const cloudSave = await saveCloudAttempt(question, result);
        if (cloudSave.saved) {
            message.textContent = "Attempt saved to your practice history.";
            message.dataset.tone = "success";
        } else if (cloudSave.reason === "error") {
            message.textContent = "The session continues, but this attempt could not reach cloud history.";
            message.dataset.tone = "error";
        } else {
            message.textContent = "Result recorded for this session. Sign in to build cross-device history.";
            message.dataset.tone = "neutral";
        }

        const needsRemediation = result.outcome !== "correct" || result.confidence <= 2;
        if (needsRemediation) {
            showRemediation(question, result, element("practiceCorrection").value);
            return;
        }

        window.setTimeout(function () {
            currentIndex += 1;
            renderQuestion();
        }, cloudSave.reason === "error" ? 650 : 250);
    }

    function getWeakestSessionCategory() {
        const scores = {};
        sessionResults.forEach(function (result) {
            const weight = result.outcome === "correct" ? 0 : (result.outcome === "partial" ? 1 : 2);
            scores[result.category] = (scores[result.category] || 0) + weight;
        });
        return Object.keys(scores).sort(function (first, second) { return scores[second] - scores[first]; })[0] || null;
    }

    function renderSummary() {
        window.clearInterval(timerId);
        const totalSeconds = sessionResults.reduce(function (total, result) {
            return total + (Number(result.durationSeconds) || 0);
        }, 0);
        const correct = sessionResults.filter(function (result) { return result.outcome === "correct"; }).length;
        const needsWork = sessionResults.length - correct;
        const average = sessionResults.length
            ? sessionResults.reduce(function (total, result) { return total + result.confidence; }, 0) / sessionResults.length
            : 0;
        const weakest = getWeakestSessionCategory();

        element("practiceQuestionCard").hidden = true;
        element("practiceSummary").hidden = false;
        element("summaryCorrect").textContent = String(correct);
        element("summaryNeedsWork").textContent = String(needsWork);
        element("summaryConfidence").textContent = average.toFixed(1);
        element("summaryTime").textContent = formatDuration(totalSeconds);
        element("practiceSummaryMessage").textContent = correct + " of " + sessionResults.length + " answers were clear and defensible today.";

        if (needsWork > 0 && weakest) {
            element("summaryNextTitle").textContent = "Correct one " + categoryLabels[weakest] + " gap";
            element("summaryNextText").textContent = "Open your Mistake Bank, rehearse the saved correction rule, then repeat this skill in your next session.";
        } else if (average >= 4) {
            element("summaryNextTitle").textContent = "Increase difficulty, not session length";
            element("summaryNextText").textContent = "Keep the same deliberate method and choose the next difficulty level for stronger evidence.";
        } else {
            element("summaryNextTitle").textContent = "Repeat for independent recall";
            element("summaryNextText").textContent = "Your answers were correct; repeat this skill until you can explain it with confidence without prompts.";
        }

        element("practiceSummary").setAttribute("tabindex", "-1");
        element("practiceSummary").focus({ preventScroll: true });
        element("practiceSummary").scrollIntoView({ behavior: "smooth", block: "start" });
    }

    function applySavedPreferences() {
        const savedPlan = readJson(PLAN_KEY, {});
        if (savedPlan && targetLabels[savedPlan.target]) {
            element("practiceTarget").value = savedPlan.target;
        }

        const params = new URLSearchParams(window.location.search);
        const category = normalizeCategory(params.get("category"));
        const target = String(params.get("target") || "").toLowerCase();
        const difficulty = String(params.get("difficulty") || "").toLowerCase();

        if (["recommended", "all"].concat(Object.keys(categoryLabels)).includes(category)) {
            element("practiceCategory").value = category;
        }
        if (targetLabels[target]) {
            element("practiceTarget").value = target;
        }
        if (["all", "beginner", "intermediate", "advanced"].includes(difficulty)) {
            element("practiceDifficulty").value = difficulty;
        }
    }

    function initializeDrawer() {
        const toggle = element("placementSidebarToggle");
        const sidebar = element("placementSidebar");
        const backdrop = element("placementDrawerBackdrop");

        function setOpen(open) {
            sidebar.classList.toggle("is-open", open);
            backdrop.classList.toggle("is-open", open);
            document.body.classList.toggle("placement-drawer-open", open);
            toggle.setAttribute("aria-expanded", String(open));
            toggle.textContent = open ? "✕ Close Interview Navigator" : "☰ Interview Navigator";
            backdrop.tabIndex = open ? 0 : -1;
        }

        toggle.addEventListener("click", function () { setOpen(!sidebar.classList.contains("is-open")); });
        backdrop.addEventListener("click", function () { setOpen(false); toggle.focus(); });
        sidebar.addEventListener("click", function (event) { if (event.target.closest("a")) { setOpen(false); } });
        document.addEventListener("keydown", function (event) {
            if (event.key === "Escape" && sidebar.classList.contains("is-open")) {
                setOpen(false);
                toggle.focus();
            }
        });
        window.addEventListener("resize", function () { if (window.innerWidth > MOBILE_BREAKPOINT) { setOpen(false); } });
    }

    function initializeSectionNavigation() {
        const links = Array.from(document.querySelectorAll('.placement-section-nav a[href^="#"]'));
        const sections = links.map(function (link) { return document.querySelector(link.getAttribute("href")); }).filter(Boolean);
        if (!("IntersectionObserver" in window) || !sections.length) {
            return;
        }
        const observer = new IntersectionObserver(function (entries) {
            const visible = entries.filter(function (entry) { return entry.isIntersecting; });
            if (!visible.length) {
                return;
            }
            const id = visible[0].target.id;
            links.forEach(function (link) { link.classList.toggle("active", link.getAttribute("href") === "#" + id); });
        }, { rootMargin: "-18% 0px -68% 0px", threshold: [0, 0.15] });
        sections.forEach(function (section) { observer.observe(section); });
    }

    function handleAuthentication(detail) {
        currentUser = detail && detail.user ? detail.user : null;
        loadAttemptHistory();
    }

    function initialize() {
        applySavedPreferences();
        updateRecommendation();
        initializeDrawer();
        initializeSectionNavigation();

        questionBankPromise = loadQuestionBank();
        currentUser = window.CodeBhavyaAuth && window.CodeBhavyaAuth.getUser
            ? window.CodeBhavyaAuth.getUser()
            : null;

        window.addEventListener("codebhavya:auth-changed", function (event) {
            handleAuthentication(event.detail || {});
        });
        window.addEventListener("codebhavya:cloud-progress-loaded", function () {
            updateRecommendation();
        });
        window.addEventListener("storage", function (event) {
            if (event.key === READINESS_KEY) {
                updateRecommendation();
            }
        });

        element("practiceSetupForm").addEventListener("submit", startSession);
        element("practiceShowHint").addEventListener("click", revealHint);
        element("practiceRevealFramework").addEventListener("click", revealFramework);
        element("practiceAssessment").addEventListener("change", handleOutcomeChange);
        element("practiceAssessment").addEventListener("submit", saveAssessment);
        element("practiceRetryQuestion").addEventListener("click", retryCurrentQuestion);
        element("practiceContinueAfterReview").addEventListener("click", continueAfterReview);
        element("practiceNewSession").addEventListener("click", startSession);
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initialize);
    } else {
        initialize();
    }
}());
