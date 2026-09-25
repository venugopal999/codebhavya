/* ============================================================
   CODEBHAVYA — WEB TECHNOLOGIES
   LEVEL 06 — WEB DEVELOPMENT TOOLS AND WORKFLOW
   ============================================================ */


/* ============================================================
   PAGE START
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {

    loadCommonComponents();

    updateReadingProgress();

    window.addEventListener(
        "scroll",
        updateReadingProgress,
        { passive: true }
    );

    setupFlipCards();

    setupMCQs();

    setupDebugVisualizer();

    setupWorkflowVisualizer();

    setupCompletion();

});


/* ============================================================
   COMMON HEADER / FOOTER
   ============================================================ */

async function loadCommonComponents() {

    const header =
        document.getElementById(
            "site-header"
        );


    const footer =
        document.getElementById(
            "site-footer"
        );


    if (header) {

        try {

            const response =
                await fetch(
                    "/header.html",
                    {
                        cache: "no-cache"
                    }
                );


            if (response.ok) {

                header.innerHTML =
                    await response.text();

            }

        } catch (error) {

            console.warn(
                "CodeBhavya header could not be loaded.",
                error
            );

        }

    }


    if (footer) {

        try {

            const response =
                await fetch(
                    "/footer.html",
                    {
                        cache: "no-cache"
                    }
                );


            if (response.ok) {

                footer.innerHTML =
                    await response.text();

            }

        } catch (error) {

            console.warn(
                "CodeBhavya footer could not be loaded.",
                error
            );

        }

    }

}


/* ============================================================
   READING PROGRESS
   ============================================================ */

function updateReadingProgress() {

    const progressBar =
        document.getElementById(
            "readingProgress"
        );


    if (!progressBar) {
        return;
    }


    const totalHeight =
        document.documentElement.scrollHeight -
        window.innerHeight;


    if (totalHeight <= 0) {

        progressBar.style.width =
            "100%";

        return;

    }


    const scrollTop =
        window.scrollY ||
        document.documentElement.scrollTop;


    const percentage =
        Math.min(
            100,
            Math.max(
                0,
                (scrollTop / totalHeight) * 100
            )
        );


    progressBar.style.width =
        `${percentage}%`;

}


/* ============================================================
   FLIP CARDS
   ============================================================ */

function setupFlipCards() {

    const cards =
        document.querySelectorAll(
            ".flip-card"
        );


    if (!cards.length) {
        return;
    }


    cards.forEach((card) => {

        function flipCard() {

            const flipped =
                card.classList.toggle(
                    "is-flipped"
                );


            card.setAttribute(
                "aria-pressed",
                String(flipped)
            );

        }


        card.addEventListener(
            "click",
            flipCard
        );


        card.addEventListener(
            "keydown",
            (event) => {

                if (
                    event.key === "Enter" ||
                    event.key === " "
                ) {

                    event.preventDefault();

                    flipCard();

                }

            }
        );

    });

}


/* ============================================================
   MCQ SYSTEM
   ============================================================ */

function setupMCQs() {

    const cards =
        document.querySelectorAll(
            ".mcq-card"
        );


    cards.forEach((card) => {

        const options =
            card.querySelectorAll(
                ".mcq-option"
            );


        const feedback =
            card.querySelector(
                ".mcq-feedback"
            );


        let answered = false;


        options.forEach((option) => {

            option.addEventListener(
                "click",
                () => {

                    if (answered) {
                        return;
                    }


                    answered = true;


                    const correct =
                        option.dataset.correct ===
                        "true";


                    if (correct) {

                        option.classList.add(
                            "correct"
                        );


                        feedback.textContent =
                            "✓ Correct. Excellent work!";

                    } else {

                        option.classList.add(
                            "wrong"
                        );


                        const correctOption =
                            Array.from(
                                options
                            ).find(
                                (item) =>
                                    item.dataset.correct ===
                                    "true"
                            );


                        if (correctOption) {

                            correctOption.classList.add(
                                "correct"
                            );

                        }


                        feedback.textContent =
                            "✗ Incorrect. Review the concept and continue.";

                    }

                }
            );

        });

    });

}


/* ============================================================
   GENERIC TRACE CONTROLLER
   ============================================================ */

function createTraceController(config) {

    const {

        icon,
        number,
        title,
        description,
        code,
        status,
        progress,
        previous,
        next,
        auto,
        points,
        pointAttribute,
        steps

    } = config;


    if (
        !icon ||
        !number ||
        !title ||
        !description ||
        !code ||
        !status ||
        !progress ||
        !previous ||
        !next ||
        !auto ||
        !points.length ||
        !steps.length
    ) {

        return;

    }


    let currentStep = 0;

    let autoTimer = null;


    function renderStep(index) {

        currentStep =
            Math.max(
                0,
                Math.min(
                    steps.length - 1,
                    index
                )
            );


        const step =
            steps[currentStep];


        icon.textContent =
            step.icon;


        number.textContent =
            `STEP ${String(currentStep + 1).padStart(2, "0")}`;


        title.textContent =
            step.title;


        description.textContent =
            step.description;


        code.textContent =
            step.code;


        status.textContent =
            `Step ${currentStep + 1} of ${steps.length}`;


        progress.style.width =
            `${((currentStep + 1) / steps.length) * 100}%`;


        points.forEach((point, index) => {

            point.classList.toggle(
                "active",
                index === currentStep
            );

        });


        previous.disabled =
            currentStep === 0;


        next.disabled =
            currentStep ===
            steps.length - 1;


        if (
            currentStep ===
            steps.length - 1
        ) {

            stopAuto();

            auto.textContent =
                "✓ Completed";

        } else if (!autoTimer) {

            auto.textContent =
                "▶ Auto Run";

        }

    }


    function nextStep() {

        if (
            currentStep <
            steps.length - 1
        ) {

            renderStep(
                currentStep + 1
            );

        } else {

            stopAuto();

        }

    }


    function previousStep() {

        if (
            currentStep >
            0
        ) {

            renderStep(
                currentStep - 1
            );

        }

    }


    function startAuto() {

        if (autoTimer) {
            return;
        }


        if (
            currentStep >=
            steps.length - 1
        ) {

            renderStep(0);

        }


        auto.textContent =
            "⏸ Pause";


        autoTimer =
            window.setInterval(
                () => {

                    if (
                        currentStep >=
                        steps.length - 1
                    ) {

                        stopAuto();

                        return;

                    }


                    nextStep();

                },
                1800
            );

    }


    function stopAuto() {

        if (autoTimer) {

            window.clearInterval(
                autoTimer
            );

            autoTimer = null;

        }


        if (
            currentStep <
            steps.length - 1
        ) {

            auto.textContent =
                "▶ Auto Run";

        } else {

            auto.textContent =
                "✓ Completed";

        }

    }


    previous.addEventListener(
        "click",
        previousStep
    );


    next.addEventListener(
        "click",
        nextStep
    );


    auto.addEventListener(
        "click",
        () => {

            if (autoTimer) {

                stopAuto();

            } else {

                startAuto();

            }

        }
    );


    points.forEach((point) => {

        point.addEventListener(
            "click",
            () => {

                const index =
                    Number(
                        point.getAttribute(
                            pointAttribute
                        )
                    );


                stopAuto();

                renderStep(index);

            }
        );

    });


    renderStep(0);

}


/* ============================================================
   DEBUGGING VISUALIZER
   ============================================================ */

function setupDebugVisualizer() {

    createTraceController({

        icon:
            document.getElementById(
                "debugIcon"
            ),

        number:
            document.getElementById(
                "debugNumber"
            ),

        title:
            document.getElementById(
                "debugTitle"
            ),

        description:
            document.getElementById(
                "debugDescription"
            ),

        code:
            document.getElementById(
                "debugCode"
            ),

        status:
            document.getElementById(
                "debugStatus"
            ),

        progress:
            document.getElementById(
                "debugProgress"
            ),

        previous:
            document.getElementById(
                "debugPrevious"
            ),

        next:
            document.getElementById(
                "debugNext"
            ),

        auto:
            document.getElementById(
                "debugAuto"
            ),

        points:
            document.querySelectorAll(
                "[data-debug-step]"
            ),

        pointAttribute:
            "data-debug-step",

        steps: [

            {
                icon: "🐞",

                title:
                    "Problem Reported",

                description:
                    "The developer notices that the submit button does not respond.",

                code:
                    '"Submit button does nothing"'
            },


            {
                icon: "🔁",

                title:
                    "Reproduce the Problem",

                description:
                    "Perform the same action and confirm that the failure can be reproduced.",

                code:
                    "Click → Failure"
            },


            {
                icon: "⚠️",

                title:
                    "Inspect the Console",

                description:
                    "Check for JavaScript runtime errors, warnings or other useful evidence.",

                code:
                    "Console → Error"
            },


            {
                icon: "🔍",

                title:
                    "Inspect the Application",

                description:
                    "Check the relevant DOM element, selector, event handler and source code.",

                code:
                    "Button → Selector → Event Listener"
            },


            {
                icon: "🎯",

                title:
                    "Isolate the Cause",

                description:
                    "Identify the smallest failing part instead of changing unrelated code.",

                code:
                    "Failing selector"
            },


            {
                icon: "🔧",

                title:
                    "Apply the Fix",

                description:
                    "Make the targeted change that addresses the identified cause.",

                code:
                    'querySelector("#submit")'
            },


            {
                icon: "🧪",

                title:
                    "Test Again",

                description:
                    "Repeat the original action and check whether the behavior has changed.",

                code:
                    "Click → Expected Result"
            },


            {
                icon: "✅",

                title:
                    "Verify the Requirement",

                description:
                    "Confirm that the complete feature works and that the fix did not introduce a new problem.",

                code:
                    "Feature → Verified"
            }

        ]

    });

}


/* ============================================================
   PROFESSIONAL WORKFLOW VISUALIZER
   ============================================================ */

function setupWorkflowVisualizer() {

    createTraceController({

        icon:
            document.getElementById(
                "workflowIcon"
            ),

        number:
            document.getElementById(
                "workflowNumber"
            ),

        title:
            document.getElementById(
                "workflowTitle"
            ),

        description:
            document.getElementById(
                "workflowDescription"
            ),

        code:
            document.getElementById(
                "workflowCode"
            ),

        status:
            document.getElementById(
                "workflowStatus"
            ),

        progress:
            document.getElementById(
                "workflowProgress"
            ),

        previous:
            document.getElementById(
                "workflowPrevious"
            ),

        next:
            document.getElementById(
                "workflowNext"
            ),

        auto:
            document.getElementById(
                "workflowAuto"
            ),

        points:
            document.querySelectorAll(
                "[data-workflow-step]"
            ),

        pointAttribute:
            "data-workflow-step",

        steps: [

            {
                icon: "📋",

                title:
                    "Understand Requirement",

                description:
                    "Define what the feature must accomplish and what the expected result is.",

                code:
                    "Requirement → Expected Result"
            },


            {
                icon: "📁",

                title:
                    "Plan Project Changes",

                description:
                    "Identify which files, components or resources need to change.",

                code:
                    "HTML + CSS + JS + Assets"
            },


            {
                icon: "💻",

                title:
                    "Implement",

                description:
                    "Write the smallest useful implementation that satisfies the requirement.",

                code:
                    "Source Code → Feature"
            },


            {
                icon: "▶️",

                title:
                    "Run the Application",

                description:
                    "Open or execute the project and observe the actual behavior.",

                code:
                    "Code → Browser"
            },


            {
                icon: "🛠️",

                title:
                    "Inspect",

                description:
                    "Use Developer Tools and other evidence to understand the runtime state.",

                code:
                    "DOM + Console + Network"
            },


            {
                icon: "🐞",

                title:
                    "Debug",

                description:
                    "Locate the cause and make a focused correction.",

                code:
                    "Problem → Cause → Fix"
            },


            {
                icon: "✅",

                title:
                    "Verify",

                description:
                    "Test the original requirement and nearby behavior after the fix.",

                code:
                    "Fix → Test → Confirm"
            },


            {
                icon: "🔀",

                title:
                    "Commit",

                description:
                    "Record a meaningful project change after verification.",

                code:
                    "git add → git commit"
            }

        ]

    });

}


/* ============================================================
   LESSON COMPLETION
   ============================================================ */

function setupCompletion() {

    const button =
        document.getElementById(
            "completeLesson"
        );


    const message =
        document.getElementById(
            "completionMessage"
        );


    if (!button || !message) {
        return;
    }


    const storageKey =
        "codebhavya-web-technologies-level-06-completed";


    let completed = false;


    try {

        completed =
            localStorage.getItem(
                storageKey
            ) === "true";

    } catch (error) {

        console.warn(
            "Lesson progress could not be read.",
            error
        );

    }


    function showCompletedState() {

        button.textContent =
            "✓ Lesson Completed";


        button.classList.add(
            "completed"
        );


        message.textContent =
            "Excellent! Level 06 has been marked as completed.";

    }


    if (completed) {

        showCompletedState();

    }


    button.addEventListener(
        "click",
        () => {

            if (
                button.classList.contains(
                    "completed"
                )
            ) {

                return;

            }


            try {

                localStorage.setItem(
                    storageKey,
                    "true"
                );

            } catch (error) {

                console.warn(
                    "Lesson progress could not be saved.",
                    error
                );

            }


            showCompletedState();

        }
    );

}
