/* ============================================================
   CODEBHAVYA — WEB TECHNOLOGIES
   LEVEL 04 — BROWSERS AND WEB SERVERS
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

    setupRenderingVisualizer();

    setupServerVisualizer();

    setupDevToolsTabs();

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
   GENERIC VISUALIZER CONTROLLER
   ============================================================ */

function createVisualizerController(config) {

    const {

        iconElement,
        numberElement,
        titleElement,
        descriptionElement,
        codeElement,
        statusElement,
        progressElement,
        previousButton,
        nextButton,
        autoButton,
        points,
        steps,
        pointAttribute

    } = config;


    if (
        !iconElement ||
        !numberElement ||
        !titleElement ||
        !descriptionElement ||
        !codeElement ||
        !statusElement ||
        !progressElement ||
        !previousButton ||
        !nextButton ||
        !autoButton ||
        !steps.length
    ) {

        return null;

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


        iconElement.textContent =
            step.icon;


        numberElement.textContent =
            `STEP ${String(currentStep + 1).padStart(2, "0")}`;


        titleElement.textContent =
            step.title;


        descriptionElement.textContent =
            step.description;


        codeElement.textContent =
            step.code;


        statusElement.textContent =
            `Step ${currentStep + 1} of ${steps.length}`;


        const percentage =
            ((currentStep + 1) / steps.length) *
            100;


        progressElement.style.width =
            `${percentage}%`;


        points.forEach((point, index) => {

            point.classList.toggle(
                "active",
                index === currentStep
            );

        });


        previousButton.disabled =
            currentStep === 0;


        nextButton.disabled =
            currentStep ===
            steps.length - 1;


        if (
            currentStep ===
            steps.length - 1
        ) {

            stopAuto();

            autoButton.textContent =
                "✓ Completed";

        } else if (!autoTimer) {

            autoButton.textContent =
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


        autoButton.textContent =
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

            autoButton.textContent =
                "▶ Auto Run";

        } else {

            autoButton.textContent =
                "✓ Completed";

        }

    }


    previousButton.addEventListener(
        "click",
        previousStep
    );


    nextButton.addEventListener(
        "click",
        nextStep
    );


    autoButton.addEventListener(
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


    return {
        renderStep,
        nextStep,
        previousStep,
        startAuto,
        stopAuto
    };

}


/* ============================================================
   BROWSER RENDERING VISUALIZER
   ============================================================ */

function setupRenderingVisualizer() {

    createVisualizerController({

        iconElement:
            document.getElementById(
                "renderIcon"
            ),

        numberElement:
            document.getElementById(
                "renderNumber"
            ),

        titleElement:
            document.getElementById(
                "renderTitle"
            ),

        descriptionElement:
            document.getElementById(
                "renderDescription"
            ),

        codeElement:
            document.getElementById(
                "renderCode"
            ),

        statusElement:
            document.getElementById(
                "renderStatus"
            ),

        progressElement:
            document.getElementById(
                "renderProgress"
            ),

        previousButton:
            document.getElementById(
                "renderPrevious"
            ),

        nextButton:
            document.getElementById(
                "renderNext"
            ),

        autoButton:
            document.getElementById(
                "renderAuto"
            ),

        points:
            document.querySelectorAll(
                "[data-render-step]"
            ),

        pointAttribute:
            "data-render-step",

        steps: [

            {
                icon: "📄",

                title:
                    "Receive HTML",

                description:
                    "The browser receives the HTML resource and begins processing it.",

                code:
                    "<html> ... </html>"
            },


            {
                icon: "🌳",

                title:
                    "Build the DOM",

                description:
                    "The browser parses HTML and creates a document object representation.",

                code:
                    "HTML → DOM Tree"
            },


            {
                icon: "🎨",

                title:
                    "Receive and Parse CSS",

                description:
                    "Stylesheets are obtained and parsed into browser-usable styling information.",

                code:
                    "style.css → CSS Rules"
            },


            {
                icon: "🧩",

                title:
                    "Build the CSSOM",

                description:
                    "CSS is represented in the CSS Object Model so the browser can reason about styles.",

                code:
                    "CSS Rules → CSSOM"
            },


            {
                icon: "🔗",

                title:
                    "Combine Style Information",

                description:
                    "The browser matches the relevant style information with the document's visible content.",

                code:
                    "DOM + CSSOM → Render Information"
            },


            {
                icon: "📐",

                title:
                    "Layout",

                description:
                    "The browser calculates the size and position of rendered elements.",

                code:
                    "Width + Height + Position"
            },


            {
                icon: "🖌️",

                title:
                    "Paint",

                description:
                    "The browser draws the visual content into paint operations.",

                code:
                    "Text + Borders + Images + Backgrounds"
            },


            {
                icon: "🖥️",

                title:
                    "Display the Page",

                description:
                    "The rendered result is composed and displayed in the browser viewport.",

                code:
                    "Pixels → Screen"
            }

        ]

    });

}


/* ============================================================
   WEB SERVER VISUALIZER
   ============================================================ */

function setupServerVisualizer() {

    createVisualizerController({

        iconElement:
            document.getElementById(
                "serverTraceIcon"
            ),

        numberElement:
            document.getElementById(
                "serverTraceNumber"
            ),

        titleElement:
            document.getElementById(
                "serverTraceTitle"
            ),

        descriptionElement:
            document.getElementById(
                "serverTraceDescription"
            ),

        codeElement:
            document.getElementById(
                "serverTraceCode"
            ),

        statusElement:
            document.getElementById(
                "serverTraceStatus"
            ),

        progressElement:
            document.getElementById(
                "serverProgress"
            ),

        previousButton:
            document.getElementById(
                "serverTracePrevious"
            ),

        nextButton:
            document.getElementById(
                "serverTraceNext"
            ),

        autoButton:
            document.getElementById(
                "serverTraceAuto"
            ),

        points:
            document.querySelectorAll(
                "[data-server-step]"
            ),

        pointAttribute:
            "data-server-step",

        steps: [

            {
                icon: "📩",

                title:
                    "Receive Request",

                description:
                    "The server receives the client's HTTP request.",

                code:
                    "GET /index.html HTTP/1.1"
            },


            {
                icon: "🏷️",

                title:
                    "Identify the Host",

                description:
                    "The server uses information such as the host and request target to determine what is being requested.",

                code:
                    "Host: codebhavya.com"
            },


            {
                icon: "🔗",

                title:
                    "Inspect the Resource Path",

                description:
                    "The server examines the requested path or route.",

                code:
                    "/Web-Technologies/index.html"
            },


            {
                icon: "📂",

                title:
                    "Locate File or Route",

                description:
                    "The server may find a static file or route the request into application logic.",

                code:
                    "File? → Serve\nRoute? → Application"
            },


            {
                icon: "⚙️",

                title:
                    "Process the Request",

                description:
                    "Static requests may return a stored resource; dynamic requests may involve application processing and data access.",

                code:
                    "Application → Data / Services"
            },


            {
                icon: "📤",

                title:
                    "Build the Response",

                description:
                    "The server prepares an HTTP response with a status and optional headers and body.",

                code:
                    "HTTP/1.1 200 OK"
            },


            {
                icon: "🌐",

                title:
                    "Return to Browser",

                description:
                    "The HTTP response is sent back through the network to the client.",

                code:
                    "Server → Response → Browser"
            }

        ]

    });

}


/* ============================================================
   DEVTOOLS TABS
   ============================================================ */

function setupDevToolsTabs() {

    const tabs =
        document.querySelectorAll(
            ".devtools-tab"
        );


    const panels =
        document.querySelectorAll(
            ".devtools-panel"
        );


    if (
        !tabs.length ||
        !panels.length
    ) {

        return;

    }


    tabs.forEach((tab) => {

        tab.addEventListener(
            "click",
            () => {

                const target =
                    tab.dataset.devtool;


                tabs.forEach((item) => {

                    item.classList.toggle(
                        "active",
                        item === tab
                    );

                });


                panels.forEach((panel) => {

                    panel.classList.toggle(
                        "active",
                        panel.dataset.panel === target
                    );

                });

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
        "codebhavya-web-technologies-level-04-completed";


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
            "Excellent! Level 04 has been marked as completed.";

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
