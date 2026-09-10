(function () {
    "use strict";

    const COURSE_KEY = "codebhavya.os.course.progress.v1";
    const LEVEL = 1;

    const traces = {
        file: {
            summary: "An editor needs bytes from notes.txt.",
            steps: [
                ["Application", "The application identifies the work", "The editor decides that it needs data stored in a named file. It does not know the disk location or control the storage device directly.", "user"],
                ["Library / API", "A familiar function prepares the request", "A library function packages the filename, access mode and other arguments for the operating system.", "user"],
                ["System-call interface", "The process enters a protected gateway", "An open/read system call transfers control through a defined entry point. The CPU changes from user mode to kernel mode.", "kernel"],
                ["File-system subsystem", "The kernel resolves and validates the file", "The OS checks the path, permissions and metadata, then determines which stored blocks contain the requested bytes.", "kernel"],
                ["Device driver", "The driver requests physical I/O", "If the data is not already cached, the storage driver sends a command to the device controller and the process may wait.", "kernel"],
                ["Completion handler", "The device reports completion", "A hardware interrupt tells the kernel that the bytes are ready. The kernel records the result and can wake the waiting process.", "kernel"],
                ["Application", "Control and data return", "The kernel returns a byte count or error code, restores user mode and the editor can use the data.", "user"]
            ]
        },
        process: {
            summary: "A shell starts a command as a new process.",
            steps: [
                ["Shell", "The shell parses the command", "The shell identifies the requested program and its arguments while running as an ordinary user process.", "user"],
                ["Process API", "A process-creation API is called", "The shell uses its platform API to request a new execution context.", "user"],
                ["System-call interface", "The request crosses the privilege boundary", "A process-creation system call enters the kernel through a controlled entry point.", "kernel"],
                ["Process manager", "The kernel creates process state", "The OS assigns an identifier, creates a process control block and prepares address-space and resource information.", "kernel"],
                ["Program loader", "Executable code is mapped", "The loader maps program segments and required libraries into the new virtual address space.", "kernel"],
                ["Scheduler", "The process becomes ready", "The scheduler places the new process in a ready queue and eventually assigns it CPU time.", "kernel"],
                ["New program", "The first user instruction runs", "The CPU restores the new process context, changes to user mode and begins its entry routine.", "user"]
            ]
        },
        memory: {
            summary: "A program needs a larger region for runtime data.",
            steps: [
                ["Application", "The program needs more space", "A data structure grows beyond the space currently available to the process.", "user"],
                ["Memory library", "The allocator checks its own pool", "A routine such as malloc may reuse free user-space blocks before it needs any kernel service.", "user"],
                ["System-call interface", "The allocator requests address-space change", "When its pool is insufficient, the allocator asks the kernel to map or extend virtual memory.", "kernel"],
                ["Memory manager", "The kernel validates the mapping", "The OS reserves a permitted virtual-address range and records protection and ownership information.", "kernel"],
                ["Page-table manager", "Translation state is prepared", "Page-table entries are created immediately or on demand; physical frames may not yet be assigned.", "kernel"],
                ["Return path", "The mapping result is returned", "The kernel restores user mode and reports the address or an allocation failure.", "user"],
                ["Application", "The program uses the region", "The first access may trigger a normal page fault so the OS can supply a physical page lazily.", "user"]
            ]
        },
        network: {
            summary: "A browser sends an HTTP request over a socket.",
            steps: [
                ["Browser", "The browser prepares application data", "The browser constructs request bytes according to an application protocol.", "user"],
                ["Socket API", "The process calls a networking API", "A socket function receives the buffer, length and connection information.", "user"],
                ["System-call interface", "The send request enters the kernel", "The system call validates the descriptor and safely accesses the process buffer.", "kernel"],
                ["Network stack", "Protocols add their control information", "Kernel networking code applies transport and network protocol rules and selects a route.", "kernel"],
                ["Network driver", "The interface is given packets", "A driver arranges transmission using the network controller.", "kernel"],
                ["Hardware completion", "The controller signals progress", "The device transmits data and later generates an interrupt or completion event.", "kernel"],
                ["Browser", "The call completes", "The browser resumes in user mode with a count or error; delivery to the remote application is a separate protocol concern.", "user"]
            ]
        },
        sleep: {
            summary: "A program asks to pause for a duration.",
            steps: [
                ["Application", "The program requests a delay", "The program calls a sleep API rather than wasting CPU cycles in a busy loop.", "user"],
                ["Time API", "The duration is converted", "A library prepares the requested interval in the form expected by the operating system.", "user"],
                ["System-call interface", "The sleep request enters the kernel", "The controlled transition allows the OS to change scheduling state.", "kernel"],
                ["Scheduler / timer", "The process becomes waiting", "The kernel records a wake-up time, blocks the process and lets another ready process use the CPU.", "kernel"],
                ["Timer interrupt", "Hardware reports that time advanced", "A periodic or programmed timer interrupt lets the kernel update time and inspect expired waits.", "kernel"],
                ["Scheduler", "The process becomes ready", "After the interval expires, the process moves from waiting to ready; it may still wait briefly for CPU time.", "kernel"],
                ["Application", "Execution resumes", "When scheduled, the process returns from the sleep call in user mode and continues after it.", "user"]
            ]
        }
    };

    const classifierCases = [
        { title: "A storage controller reports that a disk read has finished.", answer: "interrupt", result: "Hardware interrupt", explanation: "The controller is external to the currently executing instruction and reports completion asynchronously. It is not an exception caused by that instruction." },
        { title: "A program executes an instruction that divides an integer by zero.", answer: "exception", result: "Synchronous exception", explanation: "The CPU detects the fault while executing the current instruction. Its occurrence is therefore synchronous with that instruction." },
        { title: "A C program deliberately asks the OS to write bytes to an open file.", answer: "syscall", result: "System call / trap", explanation: "The program intentionally enters a defined kernel service. The eventual device completion may create an interrupt, but the original request is a system call." },
        { title: "The hardware timer signals that the current time slice has expired.", answer: "interrupt", result: "Hardware interrupt", explanation: "A timer device produces an asynchronous event, allowing the scheduler to regain control even if the running program never calls the OS." },
        { title: "A process accesses a valid virtual page that has not yet been loaded into RAM.", answer: "exception", result: "Page-fault exception", explanation: "The memory access instruction synchronously causes a page fault. The OS may resolve it normally by loading or assigning a page." },
        { title: "A debugger places a breakpoint that deliberately transfers control when reached.", answer: "syscall", result: "Software trap", explanation: "A breakpoint is an intentional synchronous trap. It is grouped here with software traps, although it requests debugging control rather than an ordinary file or process service." }
    ];

    const checks = [
        { q: "Which description best captures the purpose of an operating system?", a: "b", options: ["A graphical program used to open applications", "System software that manages resources and provides protected services", "A processor that executes application instructions", "A database of installed hardware"], why: ["A graphical interface can be part of an OS environment, but servers may have no GUI and still require an OS.", "Correct. This includes both resource management and useful, protected abstractions.", "The CPU is hardware managed by the OS; it is not the operating system.", "Hardware information is only a small piece of system state, not the OS itself."] },
        { q: "Why should an application not update page tables directly?", a: "c", options: ["Page tables exist only on disk", "Applications never use virtual addresses", "Arbitrary updates could access or corrupt another process’s memory", "A compiler always updates them first"], why: ["Active page-table structures are used by hardware memory translation, not kept only on disk.", "Applications normally do use virtual addresses.", "Correct. Page-table updates require privilege because they enforce memory isolation.", "Compilers generate programs; they do not perform privileged runtime page-table changes."] },
        { q: "Which event is asynchronous to the currently executing instruction?", a: "a", options: ["A keyboard controller reports a key press", "An integer divide-by-zero instruction", "A program executes a system-call instruction", "A breakpoint instruction is reached"], why: ["Correct. The external device can signal independently of the current instruction stream.", "Divide by zero is caused by the current instruction and is synchronous.", "The program deliberately executes the system-call transition, so it is synchronous.", "The breakpoint is reached because of the current instruction flow, so it is synchronous."] },
        { q: "A program calls a library function. Must a system call occur?", a: "d", options: ["Yes, every function call enters kernel mode", "Yes, but only for arithmetic functions", "No, because library functions can never call the kernel", "Not necessarily; it may run in user space or use one or more system calls"], why: ["Ordinary function calls remain in the current mode unless they explicitly request a kernel service.", "Arithmetic generally needs no kernel call, and the rule is not based on function category alone.", "Libraries often provide wrappers that do invoke system calls.", "Correct. API calls and system calls are not one-to-one."] },
        { q: "What is the main safety benefit of user mode?", a: "b", options: ["It makes every program execute faster", "It restricts privileged operations and limits damage", "It guarantees that programs have no bugs", "It gives each application direct device access"], why: ["Privilege transitions may add overhead; speed is not the primary safety benefit.", "Correct. Hardware-enforced restrictions protect the system and other processes.", "Modes constrain effects but cannot guarantee bug-free programs.", "Direct device access is generally restricted—the opposite of this answer."] },
        { q: "Which component normally transfers control to the kernel during initial boot?", a: "c", options: ["A word processor", "The first user account", "The bootloader", "The CPU scheduler"], why: ["An application runs only after a usable OS environment exists.", "Login happens after the kernel and services start.", "Correct. Firmware locates boot code, and the bootloader loads and starts the kernel.", "The scheduler is initialized by the kernel; it cannot load the kernel before it exists."] },
        { q: "Why does multiprogramming improve CPU utilization?", a: "a", options: ["The CPU can run another ready job while one waits for I/O", "Every job permanently receives a separate CPU", "It removes all context switches", "It forces all programs to use the same memory"], why: ["Correct. Overlapping one job’s I/O wait with another job’s CPU work reduces idle time.", "Multiple jobs can share even one CPU; a separate processor is not required.", "Switching among jobs requires context changes rather than removing them.", "Processes require protected address spaces, not identical memory."] },
        { q: "Which statement about a page fault is accurate?", a: "d", options: ["It always means the application must terminate", "It is an asynchronous hardware interrupt", "It can occur only while booting", "It may be a normal demand-paging event handled by the OS"], why: ["Invalid accesses can terminate a process, but a missing valid page can be loaded normally.", "It is caused synchronously by a memory-access instruction.", "Page faults occur during ordinary execution after boot.", "Correct. Demand paging intentionally loads valid pages when first referenced."] },
        { q: "Which is the clearest real-time-system requirement?", a: "c", options: ["The highest possible average throughput", "A graphical interface with animations", "Predictable completion within required deadlines", "The largest possible number of installed applications"], why: ["Throughput matters in many systems, but real-time correctness centers on timing bounds.", "A GUI does not define real-time behaviour.", "Correct. A correct result that arrives too late may be a system failure.", "Application count is unrelated to the defining timing requirement."] },
        { q: "What happens immediately after a system call completes successfully?", a: "b", options: ["The application permanently remains in kernel mode", "A result is returned and execution resumes in user mode", "The computer must reboot", "Every other process is terminated"], why: ["The kernel restores restricted execution; applications do not keep kernel privilege.", "Correct. The return path provides a value or status and restores the process context.", "Normal service completion requires no reboot.", "Other processes continue according to scheduling; they are not terminated."] }
    ];

    function initSidebar() {
        const button = document.getElementById("osSidebarToggle");
        const sidebar = document.getElementById("osSidebar");
        const backdrop = document.getElementById("osSidebarBackdrop");
        if (!button || !sidebar || !backdrop) return;
        function setOpen(open) { sidebar.classList.toggle("is-open", open); button.setAttribute("aria-expanded", String(open)); backdrop.hidden = !open; }
        button.addEventListener("click", function () { setOpen(!sidebar.classList.contains("is-open")); });
        backdrop.addEventListener("click", function () { setOpen(false); });
        sidebar.addEventListener("click", function (event) { if (event.target.closest("a")) setOpen(false); });
    }

    function initReading() {
        const bar = document.getElementById("lessonReadingBar");
        const links = Array.from(document.querySelectorAll(".lesson-section-link"));
        const sections = links.map(function (link) { return document.querySelector(link.getAttribute("href")); }).filter(Boolean);
        function draw() {
            const root = document.documentElement;
            const total = root.scrollHeight - root.clientHeight;
            bar.style.width = (total > 0 ? Math.min(100, root.scrollTop / total * 100) : 0) + "%";
            let active = sections[0];
            sections.forEach(function (section) { if (section.getBoundingClientRect().top <= 180) active = section; });
            links.forEach(function (link) { link.classList.toggle("active", link.getAttribute("href") === "#" + active.id); });
        }
        window.addEventListener("scroll", draw, { passive: true });
        draw();
    }

    function initTracer() {
        const select = document.getElementById("traceScenario");
        if (!select) return;
        const summary = document.getElementById("traceScenarioText");
        const counter = document.getElementById("traceCounter");
        const mode = document.getElementById("traceMode");
        const path = document.getElementById("tracePath");
        const layer = document.getElementById("traceLayer");
        const title = document.getElementById("traceTitle");
        const explanation = document.getElementById("traceExplanation");
        const next = document.getElementById("traceNext");
        let step = 0;
        function draw() {
            const trace = traces[select.value];
            const current = trace.steps[step];
            summary.textContent = trace.summary;
            counter.textContent = "STEP " + (step + 1) + " OF " + trace.steps.length;
            mode.textContent = current[3] === "kernel" ? "KERNEL MODE" : "USER MODE";
            mode.classList.toggle("kernel-mode", current[3] === "kernel");
            layer.textContent = current[0].toUpperCase(); title.textContent = current[1]; explanation.textContent = current[2];
            path.innerHTML = "";
            trace.steps.forEach(function (item, index) {
                const node = document.createElement("div"); node.className = "trace-node";
                if (index < step) node.classList.add("is-past");
                if (index === step) node.classList.add("is-current");
                node.textContent = item[0]; path.appendChild(node);
            });
            next.textContent = step === trace.steps.length - 1 ? "Restart trace ↻" : "Next step →";
        }
        select.addEventListener("change", function () { step = 0; draw(); });
        next.addEventListener("click", function () { const count = traces[select.value].steps.length; step = step === count - 1 ? 0 : step + 1; draw(); });
        document.getElementById("traceReset").addEventListener("click", function () { step = 0; draw(); });
        draw();
    }

    function initClassifier() {
        const options = document.getElementById("classifierOptions");
        if (!options) return;
        const number = document.getElementById("classifierNumber");
        const title = document.getElementById("classifierTitle");
        const result = document.getElementById("classifierResult");
        let index = 0;
        function load() {
            const item = classifierCases[index];
            number.textContent = "CASE " + (index + 1) + " OF " + classifierCases.length;
            title.textContent = item.title;
            Array.from(options.children).forEach(function (button) { button.classList.remove("is-selected"); });
            result.className = "classifier-result";
            result.innerHTML = "<span>YOUR REASONING</span><h3>Choose a category</h3><p>Use the source and timing of the event, not only the fact that kernel code eventually runs.</p>";
        }
        options.addEventListener("click", function (event) {
            const button = event.target.closest("button[data-kind]"); if (!button) return;
            const item = classifierCases[index]; const correct = button.dataset.kind === item.answer;
            Array.from(options.children).forEach(function (entry) { entry.classList.toggle("is-selected", entry === button); });
            result.className = "classifier-result " + (correct ? "correct" : "wrong");
            const heading = correct ? "Correct — " + item.result : "Not quite — this is " + item.result;
            result.innerHTML = "<span>" + (correct ? "CORRECT CLASSIFICATION" : "REVISIT THE SOURCE") + "</span><h3>" + heading + "</h3><p>" + item.explanation + "</p><button type=\"button\" id=\"nextClassifierCase\">Next case →</button>";
            result.querySelector("button").addEventListener("click", function () { index = (index + 1) % classifierCases.length; load(); });
        });
        load();
    }

    function initChecks() {
        const container = document.getElementById("conceptChecks"); if (!container) return;
        const score = document.getElementById("conceptScore");
        const correct = new Set();
        checks.forEach(function (item, index) {
            const article = document.createElement("article"); article.className = "concept-check";
            const heading = document.createElement("h3"); heading.textContent = (index + 1) + ". " + item.q; article.appendChild(heading);
            const options = document.createElement("div"); options.className = "check-options";
            item.options.forEach(function (option, optionIndex) {
                const button = document.createElement("button"); const key = String.fromCharCode(97 + optionIndex);
                button.type = "button"; button.dataset.option = key; button.textContent = String.fromCharCode(65 + optionIndex) + ". " + option;
                button.addEventListener("click", function () {
                    const isCorrect = key === item.a;
                    Array.from(options.children).forEach(function (entry) { entry.classList.remove("correct", "wrong"); });
                    button.classList.add(isCorrect ? "correct" : "wrong");
                    if (isCorrect) correct.add(index); else correct.delete(index);
                    feedback.innerHTML = "<strong>" + (isCorrect ? "Correct." : "Review this.") + "</strong> " + item.why[optionIndex];
                    score.textContent = "Answered correctly: " + correct.size + " of " + checks.length;
                }); options.appendChild(button);
            });
            const feedback = document.createElement("p"); feedback.className = "check-feedback"; feedback.setAttribute("aria-live", "polite");
            article.appendChild(options); article.appendChild(feedback); container.appendChild(article);
        });
    }

    function initCompletion() {
        const button = document.getElementById("completeLessonButton"); const status = document.getElementById("lessonSidebarStatus"); if (!button) return;
        function read() { try { const value = JSON.parse(localStorage.getItem(COURSE_KEY) || "[]"); return Array.isArray(value) ? value.map(Number) : []; } catch (error) { return []; } }
        function draw() { const done = read().indexOf(LEVEL) !== -1; button.classList.toggle("is-complete", done); button.setAttribute("aria-pressed", String(done)); button.textContent = done ? "✓ Level 1 completed" : "Mark Level 1 complete"; status.textContent = done ? "Completed" : "Not completed"; }
        button.addEventListener("click", function () { let progress = read(); progress = progress.indexOf(LEVEL) === -1 ? progress.concat(LEVEL) : progress.filter(function (item) { return item !== LEVEL; }); localStorage.setItem(COURSE_KEY, JSON.stringify(progress)); draw(); });
        draw();
    }

    function init() { initSidebar(); initReading(); initTracer(); initClassifier(); initChecks(); initCompletion(); }
    document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", init, { once: true }) : init();

    window.OSLevel01Test = { traces: traces, classifierCases: classifierCases, checks: checks };
}());
