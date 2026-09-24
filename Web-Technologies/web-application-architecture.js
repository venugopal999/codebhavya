/* ============================================================
   CODEBHAVYA — WEB TECHNOLOGIES
   LEVEL 05 — WEB APPLICATION ARCHITECTURE
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

    setupArchitectureTrace();

    setupArchitectureBuilder();

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

function createArchitectureVisualizer(config) {

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

}


/* ============================================================
   ARCHITECTURE REQUEST TRACE
   ============================================================ */

function setupArchitectureTrace() {

    createArchitectureVisualizer({

        iconElement:
            document.getElementById(
                "architectureTraceIcon"
            ),

        numberElement:
            document.getElementById(
                "architectureTraceNumber"
            ),

        titleElement:
            document.getElementById(
                "architectureTraceTitle"
            ),

        descriptionElement:
            document.getElementById(
                "architectureTraceDescription"
            ),

        codeElement:
            document.getElementById(
                "architectureTraceCode"
            ),

        statusElement:
            document.getElementById(
                "architectureTraceStatus"
            ),

        progressElement:
            document.getElementById(
                "architectureTraceProgress"
            ),

        previousButton:
            document.getElementById(
                "architectureTracePrevious"
            ),

        nextButton:
            document.getElementById(
                "architectureTraceNext"
            ),

        autoButton:
            document.getElementById(
                "architectureTraceAuto"
            ),

        points:
            document.querySelectorAll(
                "[data-architecture-step]"
            ),

        pointAttribute:
            "data-architecture-step",

        steps: [

            {
                icon: "👤",

                title:
                    "User Starts the Request",

                description:
                    "A user opens a web application or performs an action that requires server communication.",

                code:
                    "User → Browser"
            },


            {
                icon: "🔐",

                title:
                    "HTTPS Request",

                description:
                    "The browser sends the request over the configured secure web connection.",

                code:
                    "Browser → HTTPS → Server"
            },


            {
                icon: "🔀",

                title:
                    "Reverse Proxy / Edge",

                description:
                    "A reverse proxy or edge layer can receive the request and route it toward the application.",

                code:
                    "Request → Reverse Proxy"
            },


            {
                icon: "⚖️",

                title:
                    "Load Balancer",

                description:
                    "If multiple application instances are available, a load balancer can select a backend instance.",

                code:
                    "Load Balancer → App Instance"
            },


            {
                icon: "🔐",

                title:
                    "Authentication / Authorization",

                description:
                    "The application verifies identity and checks whether the requested resource or action is allowed.",

                code:
                    "Identity → Permission Check"
            },


            {
                icon: "🔗",

                title:
                    "API Boundary",

                description:
                    "The request reaches the relevant application interface or route.",

                code:
                    "GET /api/results/101"
            },


            {
                icon: "🧠",

                title:
                    "Business Logic",

                description:
                    "Application logic validates input, applies rules and coordinates the required operations.",

                code:
                    "Request → Business Rules"
            },


            {
                icon: "🗄️",

                title:
                    "Data Layer",

                description:
                    "The application can retrieve or modify persistent data using the appropriate data-access mechanism.",

                code:
                    "Application ⇄ Database"
            },


            {
                icon: "📥",

                title:
                    "Response Returns",

                description:
                    "The application produces a response that travels back through the appropriate layers to the browser.",

                code:
                    "Database → Logic → API → Browser"
            }

        ]

    });

}


/* ============================================================
   ARCHITECTURE BUILDER
   ============================================================ */

function setupArchitectureBuilder() {

    const choices =
        document.querySelectorAll(
            ".builder-choice"
        );


    const canvas =
        document.getElementById(
            "builderCanvas"
        );


    const description =
        document.getElementById(
            "builderDescription"
        );


    const status =
        document.getElementById(
            "builderStatus"
        );


    if (
        !choices.length ||
        !canvas ||
        !description ||
        !status
    ) {

        return;

    }


    const architectures = {

        "three-tier": {

            name:
                "Three-Tier architecture selected",

            description:
                "Presentation → Application → Data",

            nodes: [
                [
                    "🌐",
                    "Presentation",
                    "Browser / UI"
                ],
                [
                    "⚙️",
                    "Application",
                    "Business Logic"
                ],
                [
                    "🗄️",
                    "Data",
                    "Database"
                ]
            ]

        },


        "api": {

            name:
                "API-driven architecture selected",

            description:
                "Frontend → API → Services / Database",

            nodes: [
                [
                    "🌐",
                    "Frontend",
                    "Browser / Client"
                ],
                [
                    "🔗",
                    "API",
                    "Communication Boundary"
                ],
                [
                    "⚙️",
                    "Backend",
                    "Application Services"
                ],
                [
                    "🗄️",
                    "Data",
                    "Database / External Services"
                ]
            ]

        },


        "scalable": {

            name:
                "Scalable architecture selected",

            description:
                "Clients → Edge → Load Balancer → Multiple App Instances",

            nodes: [
                [
                    "🌐",
                    "Clients",
                    "Browsers / Users"
                ],
                [
                    "⚡",
                    "CDN / Cache",
                    "Edge Delivery"
                ],
                [
                    "⚖️",
                    "Load Balancer",
                    "Traffic Distribution"
                ],
                [
                    "🖥️",
                    "App Cluster",
                    "Multiple Instances"
                ],
                [
                    "🗄️",
                    "Data",
                    "Persistent Storage"
                ]
            ]

        },


        "secure": {

            name:
                "Security-focused architecture selected",

            description:
                "Client → HTTPS → Edge → Authentication → Authorized Application",

            nodes: [
                [
                    "🌐",
                    "Client",
                    "Browser"
                ],
                [
                    "🔐",
                    "HTTPS",
                    "Protected Connection"
                ],
                [
                    "🔀",
                    "Edge",
                    "Reverse Proxy"
                ],
                [
                    "🔐",
                    "Authentication",
                    "Identity Check"
                ],
                [
                    "🛡️",
                    "Authorization",
                    "Permission Check"
                ],
                [
                    "⚙️",
                    "Application",
                    "Protected Resource"
                ]
            ]

        }

    };


    function createNode(node) {

        const element =
            document.createElement(
                "div"
            );


        element.className =
            "builder-node";


        element.innerHTML = `

            <span class="builder-node-icon">
                ${node[0]}
            </span>

            <strong>
                ${node[1]}
            </strong>

            <small>
                ${node[2]}
            </small>

        `;


        return element;

    }


    function createArrow() {

        const arrow =
            document.createElement(
                "div"
            );


        arrow.className =
            "builder-arrow";


        arrow.textContent =
            "↓";


        return arrow;

    }


    function renderArchitecture(key) {

        const architecture =
            architectures[key];


        if (!architecture) {
            return;
        }


        canvas.innerHTML =
            "";


        architecture.nodes.forEach(
            (node, index) => {

                canvas.appendChild(
                    createNode(node)
                );


                if (
                    index <
                    architecture.nodes.length - 1
                ) {

                    canvas.appendChild(
                        createArrow()
                    );

                }

            }
        );


        description.textContent =
            architecture.description;


        status.textContent =
            architecture.name;

    }


    choices.forEach((choice) => {

        choice.addEventListener(
            "click",
            () => {

                const key =
                    choice.dataset.architecture;


                choices.forEach((item) => {

                    item.classList.toggle(
                        "active",
                        item === choice
                    );

                });


                renderArchitecture(key);

            }
        );

    });


    renderArchitecture(
        "three-tier"
    );

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
        "codebhavya-web-technologies-level-05-completed";


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
            "Excellent! Level 05 has been marked as completed.";

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
