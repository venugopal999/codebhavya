"use strict";

/* =========================================================
   CodeBhavya Full Stack MERN
   Level 02 — Detailed / Beginner First
   Semantic HTML, Document Structure & Accessibility
   ========================================================= */

window.FULLSTACK_LESSONS = window.FULLSTACK_LESSONS || {};

window.FULLSTACK_LESSONS[2] = {
    n: 2,

    kicker: "WEB FOUNDATIONS",

    title: "Semantic HTML & Document Structure",

    summary:
        "Learn how to build meaningful HTML instead of using elements only because they look right. Understand elements, attributes, landmarks, headings, navigation, articles, sections, images, tables, links, buttons, the DOM and accessibility, then apply those ideas to real CodeBhavya-style pages.",

    duration: "Estimated learning time: 3–4 hours",

    difficulty: "Beginner",

    concepts: 24,

    outcomes: [
        "Explain what semantic HTML means and why it matters.",
        "Distinguish an HTML element, opening tag, closing tag and attribute.",
        "Choose meaningful structural elements such as header, nav, main, article, section, aside and footer.",
        "Understand when a generic div is appropriate and when a semantic element is better.",
        "Build a logical heading hierarchy with h1 through h6.",
        "Choose correctly between links and buttons.",
        "Use lists, figures, images, captions and tables appropriately.",
        "Understand how HTML source becomes a DOM tree in the browser.",
        "Explain how source order and document structure affect accessibility.",
        "Write useful alternative text for informative images and empty alt text for decorative images.",
        "Understand native HTML controls and why they are usually preferable to custom controls.",
        "Understand the purpose and limits of ARIA.",
        "Audit a real page for semantic structure and accessibility problems.",
        "Build an HTML-only foundation that remains understandable before CSS is added."
    ],

    sections: [

        {
            title: "What are we actually learning?",
            intro:
                "HTML is not simply a way to make text appear on a page. It describes the structure and meaning of a document.",
            explanation: [
                "A browser can display a page even when the HTML is poorly structured, but a page that merely looks correct is not necessarily a well-designed document.",
                "Semantic HTML means choosing elements according to the meaning and purpose of their content or interaction rather than choosing elements only for visual appearance.",
                "Good HTML gives the browser, assistive technologies, developers and other tools a clearer model of what the page contains."
            ],
            points: [
                "Structure comes before visual styling.",
                "Meaningful elements are easier to understand and maintain.",
                "Accessibility starts with correct native HTML semantics."
            ],
            keyIdea:
                "Do not ask only, 'How can I make this look like a button?' Ask, 'What is this thing supposed to mean or do?'"
        },

        {
            title: "HTML Element, Tag and Attribute",
            intro:
                "Before learning semantic elements, you must understand the basic parts of HTML markup.",
            explanation: [
                "An element is the complete HTML node. A normal element can contain an opening tag, content and a closing tag.",
                "An attribute provides additional information about an element. Attributes are written in the opening tag.",
                "Some HTML elements are void elements and do not have a normal closing tag, such as img and input."
            ],
            comparison: [
                {
                    term: "Element",
                    meaning: "Complete HTML node",
                    example: "<p>Hello</p>"
                },
                {
                    term: "Opening tag",
                    meaning: "Starts an element",
                    example: "<p>"
                },
                {
                    term: "Closing tag",
                    meaning: "Ends a normal element",
                    example: "</p>"
                },
                {
                    term: "Attribute",
                    meaning: "Additional element information",
                    example: 'href="/courses"'
                }
            ],
            code:
`<a href="/Full-Stack/lesson.html?level=2">
    Open Level 02
</a>`,
            keyIdea:
                "Tags describe the element; attributes provide additional information about that element."
        },

        {
            title: "Semantic HTML",
            intro:
                "Semantic HTML uses elements that communicate what a region or piece of content represents.",
            explanation: [
                "Elements such as header, nav, main, article, section, aside and footer communicate structural roles more clearly than a page made entirely from div elements.",
                "Semantic HTML does not mean that every div is bad. A div is useful when a neutral grouping is actually what you need.",
                "The goal is not to use as many semantic elements as possible. The goal is to choose the element whose meaning matches the content or interaction."
            ],
            comparison: [
                {
                    term: "Semantic element",
                    meaning: "Communicates a meaningful role or purpose",
                    example: "<main>"
                },
                {
                    term: "Generic element",
                    meaning: "Neutral grouping with no built-in meaning",
                    example: "<div>"
                }
            ],
            example:
                "A course lesson's primary content can be placed inside main, while an individual self-contained lesson article can use article."
        },

        {
            title: "The Main Document Landmarks",
            intro:
                "A well-structured page normally has identifiable major regions.",
            explanation: [
                "header commonly contains introductory content or navigation for a page or region.",
                "nav identifies a section whose purpose is navigation.",
                "main contains the dominant content of the page.",
                "aside contains content that is complementary to the main content.",
                "footer contains footer information for the page or a section."
            ],
            comparison: [
                {
                    term: "header",
                    meaning: "Introductory or navigational content",
                    example: "Site branding and course navigation"
                },
                {
                    term: "nav",
                    meaning: "Important navigation links",
                    example: "Course levels"
                },
                {
                    term: "main",
                    meaning: "Primary page content",
                    example: "Lesson content"
                },
                {
                    term: "aside",
                    meaning: "Complementary content",
                    example: "Related topics"
                },
                {
                    term: "footer",
                    meaning: "Footer information",
                    example: "Copyright and related links"
                }
            ],
            flow: [
                { title: "Document", text: "The html element contains the document." },
                { title: "Site header", text: "Branding and primary navigation appear in the header." },
                { title: "Main content", text: "The main landmark contains the primary lesson." },
                { title: "Article", text: "The lesson itself can be represented as a self-contained composition." },
                { title: "Sections", text: "Major topics are grouped into meaningful sections." },
                { title: "Aside", text: "Related learning material can be complementary content." },
                { title: "Footer", text: "The page ends with site-level footer information." }
            ]
        },

        {
            title: "header — More Than Just a Top Bar",
            intro:
                "header represents introductory content for a page or section. It is not simply a CSS instruction meaning 'put this at the top'.",
            explanation: [
                "A site header may contain branding and primary navigation.",
                "An article can also have its own header containing the article title, author or introductory information.",
                "Therefore, header is about the role of the content, not only its visual position."
            ],
            code:
`<header>
    <a href="/">CodeBhavya</a>
    <nav aria-label="Primary navigation">
        <a href="/Full-Stack/">Full Stack</a>
        <a href="/Placement/">Placement</a>
    </nav>
</header>`,
            commonMistake:
                "Using header only because a box happens to appear at the top. The element should describe the content's role, not its CSS position."
        },

        {
            title: "nav — Navigation Has Meaning",
            intro:
                "Use nav for a section containing important navigation links.",
            explanation: [
                "A navigation region can contain links to major pages or important areas of the current site.",
                "A page can contain more than one nav when there are multiple meaningful navigation regions.",
                "When several navigation regions exist, accessible labels can help distinguish them."
            ],
            code:
`<nav aria-label="Course navigation">
    <a href="lesson.html?level=1">Level 01</a>
    <a href="lesson.html?level=2">Level 02</a>
    <a href="lesson.html?level=3">Level 03</a>
</nav>`,
            keyIdea:
                "nav describes an important navigation region; it is not required around every individual link."
        },

        {
            title: "main — The Primary Content",
            intro:
                "main identifies the dominant content of the document.",
            explanation: [
                "The lesson material a student came to read is normally part of the main content.",
                "Using main helps establish a clear landmark structure for users and assistive technologies.",
                "Navigation, related material and site-level information should not be confused with the primary content simply because they are visible on the same screen."
            ],
            code:
`<main>
    <h1>Semantic HTML</h1>
    <p>Learn how document structure communicates meaning.</p>
</main>`,
            warning:
                "Do not treat main as a generic wrapper just because it is convenient. It represents the page's dominant content."
        },

        {
            title: "section vs article vs div",
            intro:
                "These three elements are frequently confused because all can group content visually.",
            explanation: [
                "section represents a thematic grouping of content, normally with a heading that identifies the topic.",
                "article represents a self-contained composition that can potentially stand independently.",
                "div is a neutral container with no semantic meaning of its own and is appropriate when no more meaningful element fits."
            ],
            comparison: [
                {
                    term: "Chapter topic inside a lesson",
                    meaning: "section",
                    example: "The HTTP Methods section"
                },
                {
                    term: "Independent blog post",
                    meaning: "article",
                    example: "A complete article about HTTP"
                },
                {
                    term: "News story card",
                    meaning: "article",
                    example: "A self-contained story"
                },
                {
                    term: "Neutral layout wrapper",
                    meaning: "div",
                    example: "A CSS-only grouping"
                }
            ],
            keyIdea:
                "Use section for thematic grouping, article for self-contained content, and div when a neutral container is genuinely needed."
        },

        {
            title: "Heading Hierarchy",
            intro:
                "Headings communicate document structure. Their visual size should not be the reason you choose a heading level.",
            explanation: [
                "h1 normally identifies the main subject of the page, while h2, h3 and deeper levels represent nested topics.",
                "A logical heading hierarchy makes the document easier to scan and helps users understand relationships between sections.",
                "If a heading needs to look smaller or larger, use CSS for visual presentation instead of selecting a heading only for its size."
            ],
            code:
`<h1>Full Stack MERN</h1>

<h2>HTML</h2>
<h3>Semantic HTML</h3>
<h3>Forms</h3>

<h2>CSS</h2>
<h3>Flexbox</h3>
<h3>Grid</h3>`,
            points: [
                "Do not skip heading levels simply to obtain a desired font size.",
                "Use headings to describe the structure of the content.",
                "Use CSS to control appearance."
            ],
            commonMistake:
                "Writing h1, h4 and h2 based on visual size rather than document hierarchy."
        },

        {
            title: "Anchor vs Button",
            intro:
                "One of the most important semantic decisions in frontend development is choosing the correct interactive element.",
            explanation: [
                "An anchor is normally used for navigation to another URL or resource.",
                "A button performs an action such as opening a menu, submitting information, toggling a panel or copying code.",
                "The distinction is about the user's intended action, not how the control looks."
            ],
            comparison: [
                {
                    term: "Open Level 02",
                    meaning: "a",
                    example: '<a href="lesson.html?level=2">'
                },
                {
                    term: "Open mobile menu",
                    meaning: "button",
                    example: '<button type="button">'
                },
                {
                    term: "Copy code",
                    meaning: "button",
                    example: '<button type="button">Copy</button>'
                },
                {
                    term: "Visit GitHub",
                    meaning: "a",
                    example: '<a href="...">'
                }
            ],
            keyIdea:
                "Navigation changes where the user goes; an action changes something or performs an operation."
        },

        {
            title: "Lists — Ordered, Unordered and Description Lists",
            intro:
                "Lists communicate relationships between multiple items.",
            explanation: [
                "Use ul when the order of the items is not important.",
                "Use ol when the sequence or ranking is meaningful.",
                "Use dl when you have terms and corresponding descriptions."
            ],
            comparison: [
                {
                    term: "ul",
                    meaning: "Unordered list",
                    example: "Course features"
                },
                {
                    term: "ol",
                    meaning: "Ordered list",
                    example: "Setup steps"
                },
                {
                    term: "dl",
                    meaning: "Description list",
                    example: "Term and meaning"
                }
            ],
            code:
`<ol>
    <li>Install Node.js</li>
    <li>Create the project</li>
    <li>Run the development server</li>
</ol>`,
            example:
                "A list of installation steps is naturally ordered because the sequence matters."
        },

        {
            title: "Images and Alternative Text",
            intro:
                "An image can carry useful information, decorative meaning or no meaningful information at all.",
            explanation: [
                "Informative images need alternative text that communicates their useful meaning.",
                "Decorative images can generally use an empty alt attribute so they do not add unnecessary information for assistive technology users.",
                "Alt text should describe the image's purpose in the context of the page rather than simply listing visible objects."
            ],
            comparison: [
                {
                    term: "Informative diagram",
                    meaning: "Describe the useful information",
                    example: 'alt="Browser to server request flow"'
                },
                {
                    term: "Decorative icon",
                    meaning: "Use empty alternative text when appropriate",
                    example: 'alt=""'
                },
                {
                    term: "Course thumbnail",
                    meaning: "Describe the useful course context",
                    example: 'alt="Full Stack MERN course"'
                }
            ],
            code:
`<img
    src="web-flow.png"
    alt="Browser sends a request to a web server"
>`,
            commonMistake:
                "Writing alt text such as 'image' or 'picture' without communicating what the image is useful for."
        },

        {
            title: "figure and figcaption",
            intro:
                "Use figure when content such as an image, diagram or code example is treated as a referenced or self-contained unit.",
            explanation: [
                "figcaption provides a caption associated with the figure.",
                "This is useful for diagrams, screenshots, illustrations and other content that benefits from a visible explanation.",
                "The caption should add useful context rather than repeat meaningless labels."
            ],
            code:
`<figure>
    <img
        src="dom-tree.png"
        alt="DOM tree showing html, body and main"
    >
    <figcaption>
        A simplified DOM tree for a lesson page.
    </figcaption>
</figure>`
        },

        {
            title: "Tables Are for Tabular Data",
            intro:
                "Tables should represent relationships between rows and columns of data, not be used as a general page-layout mechanism.",
            explanation: [
                "A table is useful when a reader needs to compare related values across rows and columns.",
                "A caption can identify what the table represents.",
                "Header cells should identify the meaning of their corresponding data cells."
            ],
            comparison: [
                {
                    term: "Placement results",
                    meaning: "Good table use",
                    example: "Student, CGPA, Company, Status"
                },
                {
                    term: "Page columns",
                    meaning: "Not a table's purpose",
                    example: "Use CSS layout"
                }
            ],
            code:
`<table>
    <caption>Placement Results</caption>
    <thead>
        <tr>
            <th scope="col">Student</th>
            <th scope="col">CGPA</th>
            <th scope="col">Company</th>
            <th scope="col">Status</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>Student A</td>
            <td>8.7</td>
            <td>Company X</td>
            <td>Placed</td>
        </tr>
    </tbody>
</table>`,
            warning:
                "Do not build the visual layout of a website with table cells. CSS layout systems are designed for that purpose."
        },

        {
            title: "The DOM — What the Browser Builds",
            intro:
                "The HTML source file is text, but the browser turns that markup into a structured document model.",
            explanation: [
                "The DOM, or Document Object Model, is the browser's structured in-memory representation of the parsed document.",
                "Elements become nodes in a tree, and parent-child relationships represent the document structure.",
                "JavaScript can later use DOM APIs to read, modify, create and remove nodes."
            ],
            architecture: [
                { title: "HTML Source", items: ["Developer-written markup", "Elements and attributes"] },
                { title: "HTML Parser", items: ["Reads markup", "Creates nodes", "Builds relationships"] },
                { title: "DOM Tree", items: ["Document", "Elements", "Text nodes", "Attributes"] },
                { title: "Browser", items: ["CSS styles the DOM", "JavaScript interacts with it", "Users interact with the result"] }
            ],
            code:
`<main>
    <h1>Semantic HTML</h1>
    <p>Meaningful structure matters.</p>
</main>`,
            keyIdea:
                "Think of the DOM as the browser's structured model of your document, not as the raw HTML text itself."
        },

        {
            title: "Parent, Child and Sibling Relationships",
            intro:
                "The DOM is a tree, so every element can participate in parent-child and sibling relationships.",
            explanation: [
                "An element containing another element is its parent.",
                "An element directly contained by another element is its child.",
                "Elements that share the same parent are siblings.",
                "Understanding these relationships becomes essential when JavaScript later queries and modifies the DOM."
            ],
            code:
`<main>
    <h1>Semantic HTML</h1>
    <p>Learn meaningful structure.</p>
</main>`,
            comparison: [
                {
                    term: "main",
                    meaning: "Parent of h1 and p",
                    example: "main → h1"
                },
                {
                    term: "h1 and p",
                    meaning: "Sibling elements",
                    example: "h1 ↔ p"
                }
            ]
        },

        {
            title: "Source Order Matters",
            intro:
                "The order of elements in the HTML document is not merely a coding preference.",
            explanation: [
                "Before CSS changes the visual arrangement, the document already has a logical sequence.",
                "Keyboard navigation, screen readers and other technologies can rely on the underlying structure and source order.",
                "A page should remain understandable when CSS is disabled. This is a useful test of whether the HTML structure itself makes sense."
            ],
            flow: [
                { title: "Write HTML", text: "Describe the content and its meaning." },
                { title: "Browser parses", text: "The browser reads the markup." },
                { title: "DOM is created", text: "Elements become nodes in a document tree." },
                { title: "CSS is applied", text: "Presentation rules style the structure." },
                { title: "JavaScript runs", text: "Behavior can read and modify the DOM." },
                { title: "Users interact", text: "Keyboard, mouse, touch and assistive technologies consume the result." }
            ],
            keyIdea:
                "Good HTML should make sense before CSS turns it into a visual design."
        },

        {
            title: "Accessibility Starts with Native HTML",
            intro:
                "Accessibility is not a separate layer added only at the end of development.",
            explanation: [
                "Native HTML elements already provide semantics and browser behavior that assistive technologies can understand.",
                "Correct headings, landmarks, links, buttons, labels and form controls give users meaningful structure and interaction.",
                "The earlier you choose the correct native element, the less custom accessibility behavior you have to recreate later."
            ],
            comparison: [
                {
                    term: "Native button",
                    meaning: "Built-in button semantics and interaction",
                    example: "<button>Copy</button>"
                },
                {
                    term: "div role=button",
                    meaning: "Custom semantics requiring additional interaction work",
                    example: '<div role="button">Copy</div>'
                }
            ],
            warning:
                "A role attribute does not automatically recreate all browser behavior expected from the native element."
        },

        {
            title: "ARIA — Useful, but Not a Replacement for HTML",
            intro:
                "ARIA provides accessibility semantics for dynamic or custom interfaces, but it should not be the first solution when a native HTML element already provides the needed behavior.",
            explanation: [
                "ARIA can communicate roles, states and properties when native HTML alone cannot express the required interface behavior.",
                "A native button is usually preferable to a div with role=button when the interaction is simply a button.",
                "Using ARIA incorrectly can make an interface harder rather than easier to understand."
            ],
            points: [
                "Prefer native HTML when it already provides the required semantics.",
                "Use ARIA to fill genuine semantic gaps in custom interfaces.",
                "Do not add ARIA attributes just because they look professional."
            ],
            commonMistake:
                "Thinking that adding role=button automatically turns a div into a fully equivalent native button."
        },

        {
            title: "A Complete Semantic CodeBhavya Lesson Structure",
            intro:
                "Now combine the individual semantic elements into a realistic page structure.",
            explanation: [
                "A course lesson can have a site header, course navigation, main lesson content, self-contained article content, thematic sections, a complementary sidebar and a site footer.",
                "The exact nesting depends on the page, but every element should have a reason for being there.",
                "This structure is useful because it can remain understandable before CSS is added."
            ],
            architecture: [
                { title: "header", items: ["CodeBhavya branding", "Primary navigation"] },
                { title: "nav", items: ["Course levels", "Learning navigation"] },
                { title: "main", items: ["Primary lesson"] },
                { title: "article", items: ["Self-contained lesson composition"] },
                { title: "section", items: ["Concept groups", "Practice", "Knowledge check"] },
                { title: "aside", items: ["Related learning material"] },
                { title: "footer", items: ["Site-level information"] }
            ],
            code:
`<body>
    <header>...</header>

    <nav aria-label="Course navigation">...</nav>

    <main>
        <article>
            <header>...</header>

            <section>
                <h2>Semantic HTML</h2>
                <p>...</p>
            </section>

            <section>
                <h2>Accessibility</h2>
                <p>...</p>
            </section>
        </article>

        <aside>...</aside>
    </main>

    <footer>...</footer>
</body>`
        },

        {
            title: "A Practical Semantic Decision Process",
            intro:
                "When you are unsure which element to use, do not guess from appearance. Ask what the content or interaction actually represents.",
            explanation: [
                "First identify whether you are describing content, navigation or an action.",
                "Then ask whether a native semantic element already exists.",
                "If the content is a thematic grouping, consider section. If it is self-contained, consider article. If it is simply a neutral wrapper, div may be appropriate.",
                "For interactions, decide whether the user is navigating somewhere or performing an action."
            ],
            flow: [
                { title: "What is this?", text: "Content, navigation, action or neutral grouping?" },
                { title: "Does a native element exist?", text: "Prefer the element whose built-in meaning matches the purpose." },
                { title: "Does it have a clear role?", text: "Choose the element according to meaning, not appearance." },
                { title: "Will the structure make sense without CSS?", text: "If yes, the HTML foundation is becoming stronger." }
            ]
        },

        {
            title: "Semantic HTML and SEO",
            intro:
                "Semantic HTML can help machines understand document structure, but semantic HTML by itself is not a complete SEO strategy.",
            explanation: [
                "Meaningful document structure can make the content easier for tools to interpret.",
                "However, SEO depends on many factors, including content quality, links, performance and technical implementation.",
                "Therefore, do not promise that replacing every div with a semantic element will automatically produce better rankings."
            ],
            keyIdea:
                "Semantic HTML supports understandable structure; it is one part of a larger web-development and SEO system."
        },

        {
            title: "Why div Is Not the Enemy",
            intro:
                "Beginners sometimes learn that semantic HTML means 'never use div'. That is not the goal.",
            explanation: [
                "div is a generic neutral container and is useful when no more specific semantic element matches the purpose.",
                "For example, a wrapper used only to create a CSS grid may have no additional semantic meaning.",
                "The problem is not using div. The problem is using div for everything even when the content clearly has another semantic role."
            ],
            code:
`<div class="course-grid">
    <article>...</article>
    <article>...</article>
    <article>...</article>
</div>`,
            commonMistake:
                "Replacing every div mechanically without understanding whether the replacement actually communicates a more useful meaning."
        },

        {
            title: "HTML Validation and Structural Thinking",
            intro:
                "Semantic thinking also means checking whether the document is logically structured rather than only checking whether it renders.",
            explanation: [
                "A browser may recover from many markup mistakes, so visual success is not proof that the source is correct.",
                "Look for logical nesting, appropriate elements, meaningful headings, useful link text and valid relationships between table headers and data.",
                "Validation and accessibility checks are most useful when combined with human review of the actual document meaning."
            ],
            points: [
                "Does every major region have a clear purpose?",
                "Can the page be understood from source order?",
                "Are links and buttons chosen according to their purpose?",
                "Do images communicate useful alternative information when required?",
                "Do tables represent data rather than layout?"
            ]
        },

        {
            title: "Build Without CSS",
            intro:
                "One of the strongest beginner exercises is to build a page using HTML only and temporarily ignore visual styling.",
            explanation: [
                "If the page still has a sensible title, headings, navigation, content order, lists and meaningful regions without CSS, the document structure is doing real work.",
                "CSS should then improve presentation rather than rescue a meaningless structure.",
                "This exercise prepares you for the next level, where CSS will control visual presentation without changing the meaning of the document."
            ],
            tryIt: {
                title: "HTML-only test",
                steps: [
                    "Create a CodeBhavya-style lesson page using HTML only.",
                    "Add header, nav, main, article, sections, aside and footer where appropriate.",
                    "Add a logical heading hierarchy.",
                    "Add links, buttons, lists, an image and a small data table.",
                    "Disable CSS and read the page from top to bottom.",
                    "Ask whether another developer could understand the page structure from the HTML alone."
                ]
            },
            keyIdea:
                "Good HTML should provide the document's meaning; CSS should provide the visual presentation."
        }
    ],

    trace: {
        title: "Follow the HTML-to-DOM process step by step",
        code: [
            "<!doctype html>",
            "<html>",
            "  <body>",
            "    <main>",
            "      <h1>Semantic HTML</h1>",
            "      <p>Meaningful structure matters.</p>",
            "    </main>",
            "  </body>",
            "</html>"
        ],
        steps: [
            { state: "Document type", explain: "The browser recognizes the document as HTML." },
            { state: "html element", explain: "The root element represents the HTML document." },
            { state: "body", explain: "The visible document content is placed inside body." },
            { state: "main", explain: "The browser creates a main element node representing the primary content region." },
            { state: "h1", explain: "The heading becomes a child node inside main." },
            { state: "Text node", explain: "The heading's text becomes a text node associated with the h1 element." },
            { state: "p", explain: "The paragraph becomes another child of main." },
            { state: "DOM relationships", explain: "Parent-child and sibling relationships are established in the document tree." },
            { state: "CSS and JavaScript later", explain: "CSS can style the structure and JavaScript can interact with the DOM." }
        ]
    },

    revision: [
        ["Semantic HTML", "Choose elements according to meaning and purpose."],
        ["Element", "Complete HTML node."],
        ["Attribute", "Additional information supplied on an element."],
        ["header", "Introductory or navigational content for a page or section."],
        ["nav", "Important navigation region."],
        ["main", "Dominant primary content of the page."],
        ["article", "Self-contained composition."],
        ["section", "Thematic grouping of related content."],
        ["aside", "Complementary content."],
        ["footer", "Footer information for a page or section."],
        ["div", "Neutral generic container."],
        ["DOM", "Browser's structured in-memory representation of the parsed document."],
        ["Alt text", "Alternative representation of useful image meaning."],
        ["Native control", "Built-in HTML control with standard browser semantics and behavior."],
        ["ARIA", "Accessibility semantics for custom or dynamic interfaces when needed."],
        ["Tabular data", "Data organized into meaningful rows and columns."]
    ],

    interview: [
        {
            q: "What is semantic HTML?",
            a: "Semantic HTML means choosing HTML elements according to the meaning and purpose of their content or interaction rather than choosing elements only for visual appearance. Examples include main, nav, article, section, button and footer."
        },
        {
            q: "Why is semantic HTML important?",
            a: "It improves document structure, accessibility, maintainability and machine understanding. Assistive technologies can use native semantics to help users navigate the page."
        },
        {
            q: "What is the difference between div and section?",
            a: "div is a neutral generic container. section represents a meaningful thematic grouping of content, normally associated with a heading."
        },
        {
            q: "What is the difference between section and article?",
            a: "section groups related content within a larger document, while article represents a self-contained composition that can potentially stand independently."
        },
        {
            q: "What is the difference between an anchor and a button?",
            a: "An anchor is normally used for navigation to a URL or resource. A button performs an action such as opening a menu, submitting a form or copying content."
        },
        {
            q: "Why should we not use headings only for their visual size?",
            a: "Heading levels communicate document hierarchy. Visual appearance should be controlled with CSS."
        },
        {
            q: "What is the DOM?",
            a: "The DOM, or Document Object Model, is the browser's structured in-memory representation of the parsed document. JavaScript and browser APIs can interact with it."
        },
        {
            q: "What is the purpose of alt text?",
            a: "Alt text provides an alternative representation of an image's useful meaning when the image cannot be perceived. Decorative images can generally use an empty alt attribute."
        },
        {
            q: "Why is a div with role=button usually inferior to a native button?",
            a: "The native button already provides appropriate semantics and browser interaction behavior. A custom role does not automatically recreate all expected keyboard and interaction behavior."
        },
        {
            q: "Can a page contain more than one nav element?",
            a: "Yes. A page may contain multiple meaningful navigation regions, such as primary navigation and course navigation. Appropriate labels can distinguish them when necessary."
        },
        {
            q: "Does semantic HTML guarantee good SEO?",
            a: "No. Semantic HTML helps search engines understand document structure, but SEO depends on many factors including content quality, accessibility, performance, links and technical implementation."
        },
        {
            q: "Why should tables not be used for page layout?",
            a: "Tables are designed to represent relationships among tabular data. Page layout should normally be handled with CSS layout systems rather than table markup."
        }
    ],

    practice: [
        {
            title: "Build a CodeBhavya Lesson",
            difficulty: "Easy",
            prompt: "Create an HTML page for a CodeBhavya lesson using header, nav, main, article, section and footer. Do not use CSS initially.",
            hints: [
                "Start with html, head and body.",
                "Create the primary site region with header and navigation.",
                "Place the lesson inside main and article.",
                "Use sections for major lesson topics."
            ]
        },
        {
            title: "Semantic Refactoring",
            difficulty: "Easy",
            prompt: "Take a page containing only div elements and replace appropriate containers with header, nav, main, article, section, aside and footer.",
            hints: [
                "Do not replace every div automatically.",
                "Ask what each container means.",
                "Keep div where a neutral wrapper is actually appropriate."
            ]
        },
        {
            title: "Heading Hierarchy",
            difficulty: "Easy",
            prompt: "Create the heading hierarchy for a Full Stack MERN course page containing HTML, CSS, JavaScript, React and Node.js sections.",
            hints: [
                "Start with one clear page subject.",
                "Use h2 for major course areas.",
                "Use h3 for topics nested inside those areas."
            ]
        },
        {
            title: "Link or Button?",
            difficulty: "Medium",
            prompt: "For each action, decide whether it should use an anchor or button: Open Level 3, Copy Code, Open Menu, Visit GitHub, Submit Answer, Go to Practice.",
            hints: [
                "Ask whether the user is navigating to a resource or performing an action.",
                "Navigation normally uses an anchor with href.",
                "Actions normally use button."
            ]
        },
        {
            title: "Accessible Image",
            difficulty: "Medium",
            prompt: "Create three image examples: an informative diagram, a decorative icon and a course thumbnail. Write appropriate alt text for each.",
            hints: [
                "Describe useful meaning, not just visual appearance.",
                "Decorative imagery may use alt=\"\".",
                "Consider the image's purpose in the surrounding content."
            ]
        },
        {
            title: "Placement Results Table",
            difficulty: "Medium",
            prompt: "Create an accessible table containing Student Name, CGPA, Company and Placement Status. Add a caption and appropriate headers.",
            hints: [
                "Use caption to identify the table.",
                "Use thead for column headings.",
                "Use th for headers and td for data."
            ]
        },
        {
            title: "Semantic Blog Article",
            difficulty: "Medium",
            prompt: "Build a blog article about 'How HTTP Works' using article, header, sections, headings, paragraphs, figure, figcaption and footer.",
            hints: [
                "Make the article independently understandable.",
                "Use sections for major topics.",
                "Use figure and figcaption for the explanatory diagram."
            ]
        },
        {
            title: "Keyboard-First Audit",
            difficulty: "Medium",
            prompt: "Open a website and navigate through its interactive controls using only the keyboard. Record every place where focus becomes confusing or an interaction cannot be performed.",
            hints: [
                "Pay attention to links, buttons and menus.",
                "Check whether the focus order makes sense.",
                "Look for controls that can be seen but cannot be reached."
            ]
        },
        {
            title: "DOM Structure Investigation",
            difficulty: "Hard",
            prompt: "Open a CodeBhavya lesson in DevTools and draw the DOM hierarchy from html to main content. Identify the parent-child relationship of at least ten elements.",
            hints: [
                "Start at html and follow child nodes.",
                "Identify siblings that share the same parent.",
                "Compare the DOM tree with the page's visible regions."
            ]
        },
        {
            title: "Semantic CodeBhavya Homepage",
            difficulty: "Hard",
            prompt: "Build the HTML-only structure of a CodeBhavya homepage containing branding, navigation, course categories, featured course cards, practice links, an aside and footer.",
            hints: [
                "Use article for self-contained course cards when appropriate.",
                "Use nav for important navigation.",
                "Keep the page understandable without CSS."
            ]
        },
        {
            title: "Refactor a Real Page",
            difficulty: "Placement",
            prompt: "Choose any page you previously created and perform a semantic audit. List every div, heading, link, button, image and table. Explain whether each element is semantically appropriate.",
            hints: [
                "Do not judge elements only by appearance.",
                "Explain the intended meaning or interaction of each element.",
                "Record specific replacements only when they improve semantic clarity."
            ]
        },
        {
            title: "Build Without CSS",
            difficulty: "Placement",
            prompt: "Create a complete Full Stack course lesson using HTML only. Then disable CSS and ask whether the page is still understandable from top to bottom.",
            hints: [
                "Check heading hierarchy.",
                "Check navigation and source order.",
                "Check landmarks, lists, links, buttons, images and tables.",
                "If the page becomes meaningless without CSS, revisit the HTML structure."
            ]
        }
    ],

    quiz: [
        {
            q: "What is the primary purpose of HTML?",
            options: [
                "Database management",
                "Document structure and meaning",
                "Image editing",
                "Server deployment"
            ],
            answer: 1,
            explanation: "HTML primarily describes the structure and meaning of web documents."
        },
        {
            q: "Which element represents the primary content of a page?",
            options: ["aside", "main", "footer", "span"],
            answer: 1,
            explanation: "main identifies the dominant content of the document."
        },
        {
            q: "Which element is normally used for important navigation links?",
            options: ["nav", "section", "div", "figure"],
            answer: 0,
            explanation: "nav identifies a navigation region."
        },
        {
            q: "Which element is best for an action such as opening a menu?",
            options: ["a", "button", "p", "article"],
            answer: 1,
            explanation: "Opening a menu is an action, so button is normally the appropriate native control."
        },
        {
            q: "Which element is normally used to navigate to another page?",
            options: ["button", "a", "span", "strong"],
            answer: 1,
            explanation: "An anchor is normally used to navigate to another URL or resource."
        },
        {
            q: "What is div?",
            options: ["A database element", "A generic neutral container", "A heading", "A navigation control"],
            answer: 1,
            explanation: "div is a neutral generic container without a specific semantic role."
        },
        {
            q: "What does article generally represent?",
            options: ["Only images", "A self-contained composition", "A CSS file", "A database record"],
            answer: 1,
            explanation: "article represents a self-contained composition that can potentially stand independently."
        },
        {
            q: "Why should headings be chosen according to hierarchy?",
            options: ["Only to change colors", "To communicate document structure", "To reduce JavaScript", "To create databases"],
            answer: 1,
            explanation: "Heading levels communicate the structural hierarchy of the document."
        },
        {
            q: "What is the purpose of alt text?",
            options: ["To change image color", "To provide alternative meaning for an image", "To create CSS", "To make an image larger"],
            answer: 1,
            explanation: "Alt text communicates useful image meaning when the image itself cannot be perceived."
        },
        {
            q: "What should tables normally represent?",
            options: ["Page layout", "Tabular data relationships", "Navigation buttons", "CSS animations"],
            answer: 1,
            explanation: "Tables are designed for meaningful relationships among rows and columns of data."
        },
        {
            q: "What does DOM stand for?",
            options: ["Data Object Machine", "Document Object Model", "Dynamic Output Method", "Document Order Manager"],
            answer: 1,
            explanation: "DOM stands for Document Object Model."
        },
        {
            q: "Which is usually preferable for a normal button interaction?",
            options: ["div role=button", "Native button", "Clickable paragraph", "Clickable heading"],
            answer: 1,
            explanation: "A native button already provides standard semantics and browser interaction behavior."
        },
        {
            q: "Which element represents a thematic grouping?",
            options: ["section", "button", "img", "a"],
            answer: 0,
            explanation: "section represents a thematic grouping of related content."
        },
        {
            q: "What should CSS primarily control?",
            options: ["Document meaning", "Visual presentation", "Database records", "DNS"],
            answer: 1,
            explanation: "CSS primarily controls visual presentation, while HTML communicates document structure and meaning."
        },
        {
            q: "What should you normally use for an action?",
            options: ["button", "a without href", "div", "span"],
            answer: 0,
            explanation: "A native button is normally appropriate for an action."
        }
    ],

    commonMistakes: [
        "Using div for every region even when a semantic element clearly matches the purpose.",
        "Choosing heading levels based only on visual size.",
        "Using an anchor for an action that should be a button.",
        "Using a button for simple navigation when an anchor is appropriate.",
        "Writing useless alt text such as 'image' or 'picture'.",
        "Using tables to create page layout instead of representing tabular data.",
        "Assuming semantic HTML automatically guarantees good SEO.",
        "Assuming role=button makes a div fully equivalent to a native button.",
        "Adding ARIA everywhere without understanding whether native HTML already provides the required semantics.",
        "Building a page that only makes sense after CSS is applied.",
        "Ignoring source order because CSS can visually rearrange the page.",
        "Treating visual rendering as proof that the HTML structure is correct."
    ],

    glossary: [
        ["HTML", "HyperText Markup Language; the structural language used to describe web documents."],
        ["Semantic HTML", "HTML that communicates the meaning and purpose of content through appropriate elements."],
        ["Element", "A complete HTML node consisting of markup and its content where applicable."],
        ["Tag", "Markup syntax used to identify an HTML element."],
        ["Attribute", "Additional information supplied on an HTML element."],
        ["Landmark", "A major region of a page that helps users and assistive technologies navigate."],
        ["DOM", "The browser's structured in-memory representation of the parsed HTML document."],
        ["Accessibility", "Designing interfaces so people with different abilities and interaction methods can use them."],
        ["ARIA", "Accessible Rich Internet Applications; a set of accessibility semantics for dynamic or custom interfaces."],
        ["Heading hierarchy", "The structural relationship between h1, h2, h3 and deeper heading levels."],
        ["Alternative text", "Text that communicates the useful meaning of an image when the image itself cannot be perceived."],
        ["Tabular data", "Data organized into rows and columns with meaningful relationships."],
        ["Native control", "A built-in HTML control such as button, input or select that already provides standard browser behavior."],
        ["Source order", "The order in which elements appear in the document source and underlying structure."],
        ["Self-contained composition", "Content that can potentially stand independently, such as an article."],
        ["Thematic grouping", "Related content organized around a meaningful topic, commonly represented by section."]
    ],

    completion: {
        title: "You now understand the structure beneath the interface",
        message:
            "Before moving to CSS and advanced frontend development, you should be able to look at an HTML page and explain what every major region means, why each element was selected and how the browser turns the document into a DOM tree.",
        challenge:
            "Build one complete CodeBhavya-style lesson using HTML only. Before adding CSS, check the document hierarchy, heading structure, navigation, links, buttons, images, lists and landmarks. If the page is understandable without styling, your HTML foundation is becoming strong."
    }
};
