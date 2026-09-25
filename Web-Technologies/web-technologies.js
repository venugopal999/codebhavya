/* ============================================================
   CODEBHAVYA — WEB TECHNOLOGIES
   Level 01 JavaScript
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {

    /* ========================================================
       COMMON COMPONENT LOADER
       ======================================================== */
   
    loadCommonComponents();

    /* ========================================================
       READING PROGRESS
       ======================================================== */

    updateReadingProgress();

    window.addEventListener(
        "scroll",
        updateReadingProgress,
        { passive: true }
    );


    /* ========================================================
       INTERVIEW ANSWERS
       ======================================================== */

    setupInterviewAnswers();


    /* ========================================================
       MCQs
       ======================================================== */

    setupMCQs();


    /* ========================================================
       REQUEST LIFECYCLE VISUALIZER
       ======================================================== */

    setupRequestLifecycleVisualizer();

    setupFlipCards();
    /* ========================================================
       COMPLETION
       ======================================================== */

    setupCompletion();

});


/* ============================================================
   COMMON HEADER / FOOTER
   ============================================================ */

async function loadCommonComponents() {

    const headerContainer =
        document.getElementById("site-header");

    const footerContainer =
        document.getElementById("site-footer");


    if (headerContainer) {

        try {

            const response =
                await fetch("/header.html", {
                    cache: "no-cache"
                });

            if (response.ok) {

                headerContainer.innerHTML =
                    await response.text();

            }

        } catch (error) {

            console.warn(
                "CodeBhavya header could not be loaded.",
                error
            );

        }

    }


    if (footerContainer) {

        try {

            const response =
                await fetch("/footer.html", {
                    cache: "no-cache"
                });

            if (response.ok) {

                footerContainer.innerHTML =
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


    const documentHeight =
        document.documentElement.scrollHeight -
        window.innerHeight;


    if (documentHeight <= 0) {

        progressBar.style.width = "100%";

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
                (scrollTop / documentHeight) * 100
            )
        );


    progressBar.style.width =
        `${percentage}%`;

}


/* ============================================================
   INTERVIEW ANSWERS
   ============================================================ */

function setupInterviewAnswers() {

    const buttons =
        document.querySelectorAll(
            ".show-answer"
        );


    buttons.forEach((button) => {

        button.addEventListener(
            "click",
            () => {

                const card =
                    button.closest(".qa-card");

                if (!card) {
                    return;
                }


                const isOpen =
                    card.classList.contains(
                        "answer-open"
                    );


                card.classList.toggle(
                    "answer-open"
                );


                button.textContent =
                    isOpen
                        ? "Show Answer"
                        : "Hide Answer";

            }
        );

    });

}


/* ============================================================
   MCQs
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
                            "✓ Correct. Well done!";

                    } else {

                        option.classList.add(
                            "wrong"
                        );

                        feedback.textContent =
                            "✗ Incorrect. Try reviewing this topic once more.";

                        const correctOption =
                            Array.from(options)
                                .find(
                                    (item) =>
                                        item.dataset.correct ===
                                        "true"
                                );

                        if (correctOption) {

                            correctOption.classList.add(
                                "correct"
                            );

                        }

                    }

                }
            );

        });

    });

}


/* ============================================================
   REQUEST LIFECYCLE VISUALIZER
   ============================================================ */

function setupRequestLifecycleVisualizer() {

    const title =
        document.getElementById(
            "traceTitle"
        );

    const description =
        document.getElementById(
            "traceDescription"
        );

    const code =
        document.getElementById(
            "traceCode"
        );

    const number =
        document.getElementById(
            "traceNumber"
        );

    const icon =
        document.getElementById(
            "traceIcon"
        );

    const status =
        document.getElementById(
            "traceStatus"
        );

    const progress =
        document.getElementById(
            "traceProgressBar"
        );

    const previous =
        document.getElementById(
            "tracePrevious"
        );

    const next =
        document.getElementById(
            "traceNext"
        );

    const auto =
        document.getElementById(
            "traceAuto"
        );

    const points =
        document.querySelectorAll(
            ".trace-point"
        );


    if (
        !title ||
        !description ||
        !code ||
        !number ||
        !icon ||
        !status ||
        !progress ||
        !previous ||
        !next ||
        !auto
    ) {
        return;
    }


    const steps = [

        {
            icon: "🔗",

            title: "Enter a URL",

            description:
                "The user enters a web address into the browser.",

            code:
                "https://codebhavya.com"
        },

        {
            icon: "🔎",

            title: "DNS Lookup",

            description:
                "The browser needs to identify the server associated with the domain name.",

            code:
                "codebhavya.com → server address"
        },

        {
            icon: "🔐",

            title: "Connection",

            description:
                "The browser establishes the required network connection. HTTPS also involves a secure TLS connection.",

            code:
                "Browser ⇄ Server"
        },

        {
            icon: "📤",

            title: "HTTP Request",

            description:
                "The browser sends an HTTP request asking the server for the required resource.",

            code:
                "GET / HTTP/HTTPS"
        },

        {
            icon: "⚙️",

            title: "Server Processing",

            description:
                "The server may locate files, execute application logic or communicate with other services and databases.",

            code:
                "Request → Application → Data"
        },

        {
            icon: "📥",

            title: "HTTP Response",

            description:
                "The server sends a response containing a status, headers and usually some content or data.",

            code:
                "HTTP 200 OK"
        },

        {
            icon: "🧩",

            title: "Browser Rendering",

            description:
                "The browser processes HTML, CSS, JavaScript and other resources to construct the page.",

            code:
                "HTML + CSS + JS → UI"
        },

        {
            icon: "👀",

            title: "Page Displayed",

            description:
                "The user can now see and interact with the rendered web page.",

            code:
                "User ↔ Web Application"
        }

    ];


    let currentStep = 0;

    let autoTimer = null;


    function renderStep(stepIndex) {

        currentStep =
            Math.max(
                0,
                Math.min(
                    steps.length - 1,
                    stepIndex
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


        const percentage =
            ((currentStep + 1) / steps.length) * 100;

        progress.style.width =
            `${percentage}%`;


        points.forEach((point, index) => {

            point.classList.toggle(
                "active",
                index === currentStep
            );

        });


        previous.disabled =
            currentStep === 0;

        next.disabled =
            currentStep === steps.length - 1;


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

                const stepIndex =
                    Number(
                        point.dataset.step
                    );

                stopAuto();

                renderStep(
                    stepIndex
                );

            }
        );

    });


    renderStep(0);

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
   COMPLETION
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
        "codebhavya-web-technologies-level-01-completed";


    let completed = false;


    try {

        completed =
            localStorage.getItem(
                storageKey
            ) === "true";

    } catch (error) {

        console.warn(
            "Local progress storage is unavailable.",
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
            "Great work! Level 01 has been marked as completed.";

    }


    if (completed) {

        showCompletedState();

    }


    button.addEventListener(
        "click",
        () => {

            if (button.classList.contains("completed")) {
                return;
            }


            try {

                localStorage.setItem(
                    storageKey,
                    "true"
                );

            } catch (error) {

                console.warn(
                    "Unable to save lesson progress.",
                    error
                );

            }


            showCompletedState();

        }
    );

}
