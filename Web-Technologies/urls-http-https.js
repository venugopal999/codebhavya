/* ============================================================
   CODEBHAVYA — WEB TECHNOLOGIES
   LEVEL 03 — URLs, HTTP AND HTTPS
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {

    loadCommonComponents();

    updateReadingProgress();

    window.addEventListener(
        "scroll",
        updateReadingProgress,
        { passive: true }
    );

    setupMCQs();

    setupFlipCards();

    setupHTTPSVisualizer();

    setupHTTPSimulator();

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


                    const isCorrect =
                        option.dataset.correct === "true";


                    if (isCorrect) {

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
   HTTPS VISUALIZER
   ============================================================ */

function setupHTTPSVisualizer() {

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
        points.length !== 8
    ) {

        return;

    }


    const steps = [

        {
            icon: "🌐",

            title:
                "Browser Requests HTTPS",

            description:
                "The browser begins communication with the secure endpoint.",

            code:
                "https://codebhavya.com"
        },


        {
            icon: "👋",

            title:
                "Secure Connection Setup Begins",

            description:
                "The client and server exchange information needed to negotiate the secure connection.",

            code:
                "ClientHello → Server"
        },


        {
            icon: "📜",

            title:
                "Server Certificate",

            description:
                "The server provides certificate information as part of the TLS handshake.",

            code:
                "Certificate → Browser"
        },


        {
            icon: "✅",

            title:
                "Certificate Validation",

            description:
                "The browser validates the certificate and relevant identity information according to its trust model.",

            code:
                "Certificate → Trust Checks"
        },


        {
            icon: "🔑",

            title:
                "Cryptographic Parameters",

            description:
                "The TLS handshake establishes the cryptographic parameters required to protect subsequent application data.",

            code:
                "Handshake → Session Keys"
        },


        {
            icon: "🔒",

            title:
                "Protected Channel",

            description:
                "The endpoints now have a protected communication channel for application data.",

            code:
                "Secure Channel Established"
        },


        {
            icon: "📤",

            title:
                "HTTP Request",

            description:
                "HTTP request data is exchanged through the protected TLS channel.",

            code:
                "GET / HTTP"
        },


        {
            icon: "📥",

            title:
                "HTTP Response",

            description:
                "The server returns the HTTP response through the protected connection.",

            code:
                "HTTP/HTTPS Response"
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
            currentStep > 0
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
   HTTP REQUEST / RESPONSE SIMULATOR
   ============================================================ */

function setupHTTPSimulator() {

    const methodSelect =
        document.getElementById(
            "httpMethod"
        );


    const sendButton =
        document.getElementById(
            "simulateRequest"
        );


    const resetButton =
        document.getElementById(
            "resetSimulator"
        );


    const requestPreview =
        document.getElementById(
            "requestPreview"
        );


    const responsePreview =
        document.getElementById(
            "responsePreview"
        );


    const status =
        document.getElementById(
            "simStatus"
        );


    if (
        !methodSelect ||
        !sendButton ||
        !resetButton ||
        !requestPreview ||
        !responsePreview ||
        !status
    ) {

        return;

    }


    const scenarios = {

        GET: {

            request:
`GET /api/students/101 HTTP/1.1
Host: codebhavya.com
Accept: application/json`,

            response:
`HTTP/1.1 200 OK
Content-Type: application/json

{
  "studentId": 101,
  "name": "Student",
  "result": "Available"
}`

        },


        POST: {

            request:
`POST /api/students HTTP/1.1
Host: codebhavya.com
Content-Type: application/json

{
  "name": "Student",
  "branch": "CSE"
}`,

            response:
`HTTP/1.1 201 Created
Content-Type: application/json

{
  "message": "Student created",
  "studentId": 102
}`

        },


        PUT: {

            request:
`PUT /api/students/101 HTTP/1.1
Host: codebhavya.com
Content-Type: application/json

{
  "branch": "CSE-AI&ML"
}`,

            response:
`HTTP/1.1 200 OK
Content-Type: application/json

{
  "message": "Student updated"
}`

        },


        PATCH: {

            request:
`PATCH /api/students/101 HTTP/1.1
Host: codebhavya.com
Content-Type: application/json

{
  "branch": "CSE"
}`,

            response:
`HTTP/1.1 200 OK
Content-Type: application/json

{
  "message": "Student partially updated"
}`

        },


        DELETE: {

            request:
`DELETE /api/students/101 HTTP/1.1
Host: codebhavya.com
Accept: application/json`,

            response:
`HTTP/1.1 204 No Content`

        }

    };


    function renderScenario(method) {

        const scenario =
            scenarios[method];


        if (!scenario) {
            return;
        }


        requestPreview.textContent =
            scenario.request;


        responsePreview.textContent =
            scenario.response;

    }


    methodSelect.addEventListener(
        "change",
        () => {

            status.textContent =
                `${methodSelect.value} selected`;

            renderScenario(
                methodSelect.value
            );

        }
    );


    sendButton.addEventListener(
        "click",
        () => {

            const method =
                methodSelect.value;


            renderScenario(method);


            status.textContent =
                `${method} request simulated`;

        }
    );


    resetButton.addEventListener(
        "click",
        () => {

            methodSelect.value =
                "GET";


            renderScenario(
                "GET"
            );


            status.textContent =
                "Ready";

        }
    );


    renderScenario("GET");

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
        "codebhavya-web-technologies-level-03-completed";


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
            "Excellent! Level 03 has been marked as completed.";

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
