/* ============================================================
   CODEBHAVYA — WEB TECHNOLOGIES
   LEVEL 07 — HTML FUNDAMENTALS
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
        {
            passive: true
        }
    );

    setupFlipCards();

    setupMCQs();

    setupHTMLTrace();

    setupHTMLBuilder();

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


    cards.forEach(
        (card) => {

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

        }
    );

}



/* ============================================================
   MCQs
   ============================================================ */

function setupMCQs() {

    const cards =
        document.querySelectorAll(
            ".mcq-card"
        );


    cards.forEach(
        (card) => {

            const options =
                card.querySelectorAll(
                    ".mcq-option"
                );


            const feedback =
                card.querySelector(
                    ".mcq-feedback"
                );


            let answered = false;


            options.forEach(
                (option) => {

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

                }
            );

        }
    );

}



/* ============================================================
   GENERIC HTML VISUALIZER
   ============================================================ */

function createHTMLVisualizer(config) {

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
        pointAttribute,
        steps

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


    let currentStep =
        0;


    let autoTimer =
        null;



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
            `STEP ${String(
                currentStep + 1
            ).padStart(
                2,
                "0"
            )}`;


        titleElement.textContent =
            step.title;


        descriptionElement.textContent =
            step.description;


        codeElement.textContent =
            step.code;


        statusElement.textContent =
            `Step ${
                currentStep + 1
            } of ${
                steps.length
            }`;


        progressElement.style.width =
            `${
                (
                    (currentStep + 1) /
                    steps.length
                ) * 100
            }%`;


        points.forEach(
            (point, index) => {

                point.classList.toggle(
                    "active",
                    index === currentStep
                );

            }
        );


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

            autoTimer =
                null;

        }


        autoButton.textContent =
            currentStep <
            steps.length - 1
                ? "▶ Auto Run"
                : "✓ Completed";

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


    points.forEach(
        (point) => {

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

                    renderStep(
                        index
                    );

                }
            );

        }
    );


    renderStep(0);

}



/* ============================================================
   HTML DOCUMENT TRACE
   ============================================================ */

function setupHTMLTrace() {

    createHTMLVisualizer({

        iconElement:
            document.getElementById(
                "htmlTraceIcon"
            ),

        numberElement:
            document.getElementById(
                "htmlTraceNumber"
            ),

        titleElement:
            document.getElementById(
                "htmlTraceTitle"
            ),

        descriptionElement:
            document.getElementById(
                "htmlTraceDescription"
            ),

        codeElement:
            document.getElementById(
                "htmlTraceCode"
            ),

        statusElement:
            document.getElementById(
                "htmlTraceStatus"
            ),

        progressElement:
            document.getElementById(
                "htmlTraceProgress"
            ),

        previousButton:
            document.getElementById(
                "htmlTracePrevious"
            ),

        nextButton:
            document.getElementById(
                "htmlTraceNext"
            ),

        autoButton:
            document.getElementById(
                "htmlTraceAuto"
            ),

        points:
            document.querySelectorAll(
                "[data-html-step]"
            ),

        pointAttribute:
            "data-html-step",


        steps: [


            {
                icon:
                    "📄",

                title:
                    "DOCTYPE detected",

                description:
                    "The browser identifies the document as an HTML document and uses standards-oriented parsing.",

                code:
                    "<!DOCTYPE html>"
            },


            {
                icon:
                    "🌐",

                title:
                    "HTML root opened",

                description:
                    "The html element becomes the root of the document tree.",

                code:
                    '<html lang="en">'
            },


            {
                icon:
                    "🧠",

                title:
                    "Head begins",

                description:
                    "The browser processes metadata and document information in the head.",

                code:
                    "<head> ... </head>"
            },


            {
                icon:
                    "⚙️",

                title:
                    "Metadata processed",

                description:
                    "Character encoding, viewport information and the document title can be processed.",

                code:
                    '<meta charset="UTF-8">\n<title>CodeBhavya</title>'
            },


            {
                icon:
                    "👁️",

                title:
                    "Body begins",

                description:
                    "The body contains the content that forms the page presented to the user.",

                code:
                    "<body> ... </body>"
            },


            {
                icon:
                    "📰",

                title:
                    "Heading processed",

                description:
                    "The browser creates a heading node in the document structure.",

                code:
                    "<h1>Web Technologies</h1>"
            },


            {
                icon:
                    "🧱",

                title:
                    "Content processed",

                description:
                    "Paragraphs, lists, links, images and other elements become structured nodes.",

                code:
                    '<p>Learn HTML.</p>\n<a href="...">Learn</a>'
            },


            {
                icon:
                    "🔚",

                title:
                    "Document closes",

                description:
                    "Closing tags complete the nested document structure.",

                code:
                    "</body>\n</html>"
            },


            {
                icon:
                    "🖥️",

                title:
                    "Page rendered",

                description:
                    "The browser uses the resulting document structure together with CSS and other resources to render the page.",

                code:
                    "HTML → DOM → Rendered Page"
            }

        ]

    });

}



/* ============================================================
   HTML PAGE BUILDER
   ============================================================ */

function setupHTMLBuilder() {

    const choices =
        document.querySelectorAll(
            ".builder-choice"
        );


    const canvas =
        document.getElementById(
            "htmlBuilderCanvas"
        );


    const description =
        document.getElementById(
            "htmlBuilderDescription"
        );


    const status =
        document.getElementById(
            "htmlBuilderStatus"
        );


    if (
        !choices.length ||
        !canvas ||
        !description ||
        !status
    ) {

        return;

    }


    const structures = {


        document: {

            name:
                "Complete HTML document selected",

            description:
                "DOCTYPE → html → head + body → page content",

            nodes: [

                [
                    "📄",
                    "DOCTYPE",
                    "Document declaration"
                ],

                [
                    "🌐",
                    "HTML",
                    "Document root"
                ],

                [
                    "🧠",
                    "HEAD",
                    "Metadata"
                ],

                [
                    "👁️",
                    "BODY",
                    "Visible content"
                ]

            ]

        },


        head: {

            name:
                "Head selected",

            description:
                "Metadata → title → linked resources → document information",

            nodes: [

                [
                    "🧠",
                    "HEAD",
                    "Metadata container"
                ],

                [
                    "🏷️",
                    "TITLE",
                    "Document title"
                ],

                [
                    "⚙️",
                    "META",
                    "Document metadata"
                ],

                [
                    "🎨",
                    "LINK",
                    "External resources"
                ]

            ]

        },


        body: {

            name:
                "Body selected",

            description:
                "Body → headings → paragraphs → lists → links → images",

            nodes: [

                [
                    "👁️",
                    "BODY",
                    "Page content"
                ],

                [
                    "📰",
                    "HEADING",
                    "Content hierarchy"
                ],

                [
                    "¶",
                    "PARAGRAPH",
                    "Text content"
                ],

                [
                    "🧱",
                    "ELEMENTS",
                    "Other content"
                ]

            ]

        },


        content: {

            name:
                "Content elements selected",

            description:
                "Meaningful elements become children in the document tree.",

            nodes: [

                [
                    "📰",
                    "HEADING",
                    "h1–h6"
                ],

                [
                    "¶",
                    "PARAGRAPH",
                    "p"
                ],

                [
                    "📋",
                    "LIST",
                    "ul / ol / li"
                ],

                [
                    "🔗",
                    "LINK",
                    "a"
                ],

                [
                    "🖼️",
                    "IMAGE",
                    "img"
                ]

            ]

        },


        link: {

            name:
                "Anchor selected",

            description:
                "a + href → destination → navigation request",

            nodes: [

                [
                    "🔗",
                    "ANCHOR",
                    "<a>"
                ],

                [
                    "🏷️",
                    "HREF",
                    "Destination"
                ],

                [
                    "🌐",
                    "URL",
                    "Target resource"
                ],

                [
                    "➡️",
                    "NAVIGATION",
                    "Browser request"
                ]

            ]

        }

    };



    function nodeElement(node) {

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



    function arrowElement() {

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



    function render(key) {

        const structure =
            structures[key];


        if (!structure) {

            return;

        }


        canvas.innerHTML =
            "";


        structure.nodes.forEach(
            (node, index) => {

                canvas.appendChild(
                    nodeElement(node)
                );


                if (
                    index <
                    structure.nodes.length - 1
                ) {

                    canvas.appendChild(
                        arrowElement()
                    );

                }

            }
        );


        description.textContent =
            structure.description;


        status.textContent =
            structure.name;

    }



    choices.forEach(
        (choice) => {

            choice.addEventListener(
                "click",
                () => {

                    choices.forEach(
                        (item) => {

                            item.classList.toggle(
                                "active",
                                item === choice
                            );

                        }
                    );


                    render(
                        choice.dataset.htmlBuilder
                    );

                }
            );

        }
    );


    render(
        "document"
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


    if (
        !button ||
        !message
    ) {

        return;

    }


    const storageKey =
        "codebhavya-web-technologies-level-07-completed";


    let completed =
        false;


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
            "Excellent! Level 07 has been marked as completed.";

    }



    if (completed) {

        showCompletedState();

    }



    button.addEventListener(
        "click",
        () => {

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
