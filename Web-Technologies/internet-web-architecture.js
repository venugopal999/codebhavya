/* ============================================================
   CODEBHAVYA — WEB TECHNOLOGIES
   LEVEL 02 — INTERNET AND WEB ARCHITECTURE
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {

    loadCommonComponents();

    updateReadingProgress();

    window.addEventListener(
        "scroll",
        updateReadingProgress,
        { passive: true }
    );

    setupInterviewAnswers();

    setupMCQs();

    setupArchitectureVisualizer();

    setupCompletion();

});


/* ============================================================
   COMMON HEADER / FOOTER
   ============================================================ */

async function loadCommonComponents() {

    const header =
        document.getElementById("site-header");

    const footer =
        document.getElementById("site-footer");


    if (header) {

        try {

            const response =
                await fetch(
                    "/header.html",
                    { cache: "no-cache" }
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
                    { cache: "no-cache" }
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


                const opened =
                    card.classList.contains(
                        "answer-open"
                    );


                card.classList.toggle(
                    "answer-open"
                );


                button.textContent =
                    opened
                        ? "Show Answer"
                        : "Hide Answer";

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
                        option.dataset.correct === "true";


                    if (correct) {

                        option.classList.add(
                            "correct"
                        );

                        feedback.textContent =
                            "✓ Correct. Excellent!";

                    } else {

                        option.classList.add(
                            "wrong"
                        );

                        const correctOption =
                            Array.from(options).find(
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
                            "✗ Incorrect. Review the concept and try the next question.";

                    }

                }
            );

        });

    });

}


/* ============================================================
   INTERNET ARCHITECTURE VISUALIZER
   ============================================================ */

function setupArchitectureVisualizer() {

    const icon =
        document.getElementById(
            "traceIcon"
        );

    const number =
        document.getElementById(
            "traceNumber"
        );

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
        points.length === 0
    ) {
        return;
    }


    const steps = [

        {
            icon: "👤",

            title: "User Requests a Website",

            description:
                "The user enters a domain name or selects a web link in a browser.",

            code:
                "https://codebhavya.com"
        },


        {
            icon: "🔎",

            title: "DNS Resolution",

            description:
                "The client uses DNS-related mechanisms to resolve the domain name to addressing information.",

            code:
                "codebhavya.com → address information"
        },


        {
            icon: "📍",

            title: "Destination Address",

            description:
                "The browser now has the network destination needed to continue communication.",

            code:
                "Destination → IP address"
        },


        {
            icon: "🔐",

            title: "Network Connection",

            description:
                "The client establishes the required network communication. HTTPS also involves a secure TLS setup.",

            code:
                "Client ⇄ Server"
        },


        {
            icon: "🖥️",

            title: "Web Server",

            description:
                "The web-facing server receives the request and may serve files or forward the request to an application.",

            code:
                "HTTP Request → Web Server"
        },


        {
            icon: "⚙️",

            title: "Application Processing",

            description:
                "Dynamic requests can be passed to application logic such as PHP, Servlets, JSP, APIs or other server-side technologies.",

            code:
                "Web Server → Application"
        },


        {
            icon: "🗄️",

            title: "Database Access",

            description:
                "The application may read or write persistent data using database technologies and appropriate connectivity layers.",

            code:
                "Application ⇄ Database"
        },


        {
            icon: "📥",

            title: "Response Returns to the Browser",

            description:
                "The server-side system produces a response and sends it back through the network to the browser.",

            code:
                "Server → HTTP Response → Browser"
        }

    ];


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


        const percentage =
            ((currentStep + 1) / steps.length) *
            100;


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
                1850
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
                        point.dataset.step
                    );


                stopAuto();

                renderStep(index);

            }
        );

    });


    renderStep(0);

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
        "codebhavya-web-technologies-level-02-completed";


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
            "Excellent! Level 02 has been marked as completed.";

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
