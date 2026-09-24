/* ============================================================
   CODEBHAVYA — WEB TECHNOLOGIES
   LEVEL 07 — HTML FUNDAMENTALS
   ============================================================ */

window.WEB_TECH_LESSONS = window.WEB_TECH_LESSONS || {};

window.WEB_TECH_LESSONS[7] = {

    level: 7,

    title: "HTML Fundamentals",

    subtitle:
        "Build the structure of web pages using HTML elements, attributes, headings, paragraphs, links, lists and images.",

    category: "HTML",

    difficulty: "Beginner",

    duration: "45–60 minutes",

    objectives: [
        "Understand the purpose of HTML in web development.",
        "Understand the basic structure of an HTML document.",
        "Differentiate elements, tags and attributes.",
        "Create headings and paragraphs.",
        "Create links using the anchor element.",
        "Create ordered and unordered lists.",
        "Display images using the img element.",
        "Understand nesting and proper HTML structure.",
        "Identify common HTML mistakes.",
        "Build a small structured HTML page."
    ],

    why: {
        title: "Why HTML Matters",

        content: `
            <p>
                HTML stands for <strong>HyperText Markup Language</strong>.
                It is the standard markup language used to structure content
                on the Web.
            </p>

            <p>
                HTML does not primarily describe how a page should look.
                Instead, it describes what the content <strong>is</strong>:
                a heading, paragraph, link, list, image, form, table and so on.
            </p>

            <div class="info-grid">
                <div class="info-card">
                    <h3>HTML</h3>
                    <p>Provides the structure and meaning of a web page.</p>
                </div>

                <div class="info-card">
                    <h3>CSS</h3>
                    <p>Controls presentation, layout, colors and visual design.</p>
                </div>

                <div class="info-card">
                    <h3>JavaScript</h3>
                    <p>Adds behavior, interaction and dynamic functionality.</p>
                </div>
            </div>

            <p>
                A useful mental model is:
            </p>

            <div class="code-box">
                <pre><code>HTML       → Structure
CSS        → Presentation
JavaScript → Behavior</code></pre>
            </div>
        `
    },

    concepts: [

        {
            title: "1. What Is HTML?",

            explanation: `
                <p>
                    HTML is a markup language used to describe the structure
                    of information in a web document.
                </p>

                <p>
                    A browser reads the HTML document and constructs a
                    representation of the page that can be displayed to the user.
                </p>

                <div class="concept-grid">
                    <div class="concept-card">
                        <h3>H</h3>
                        <p>Hyper</p>
                    </div>

                    <div class="concept-card">
                        <h3>T</h3>
                        <p>Text</p>
                    </div>

                    <div class="concept-card">
                        <h3>M</h3>
                        <p>Markup</p>
                    </div>

                    <div class="concept-card">
                        <h3>L</h3>
                        <p>Language</p>
                    </div>
                </div>
            `,

            code: `<!DOCTYPE html>
<html>
<head>
    <title>My Page</title>
</head>
<body>
    <h1>Hello World</h1>
    <p>Welcome to CodeBhavya.</p>
</body>
</html>`
        },

        {
            title: "2. Basic HTML Document Structure",

            explanation: `
                <p>
                    A modern HTML document normally begins with
                    <code>&lt;!DOCTYPE html&gt;</code>.
                </p>

                <p>
                    The document then contains the root
                    <code>&lt;html&gt;</code> element with two major areas:
                    <code>&lt;head&gt;</code> and <code>&lt;body&gt;</code>.
                </p>

                <div class="table-wrap">
                    <table>
                        <thead>
                            <tr>
                                <th>Element</th>
                                <th>Purpose</th>
                            </tr>
                        </thead>

                        <tbody>
                            <tr>
                                <td>&lt;!DOCTYPE html&gt;</td>
                                <td>Declares an HTML document.</td>
                            </tr>

                            <tr>
                                <td>&lt;html&gt;</td>
                                <td>Root element of the document.</td>
                            </tr>

                            <tr>
                                <td>&lt;head&gt;</td>
                                <td>Contains metadata and document information.</td>
                            </tr>

                            <tr>
                                <td>&lt;title&gt;</td>
                                <td>Defines the browser/page title.</td>
                            </tr>

                            <tr>
                                <td>&lt;body&gt;</td>
                                <td>Contains visible page content.</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            `,

            code: `<!DOCTYPE html>

<html>
<head>
    <title>CodeBhavya</title>
</head>

<body>
    <h1>Web Technologies</h1>
    <p>Learn the Web step by step.</p>
</body>

</html>`
        },

        {
            title: "3. Tags, Elements and Content",

            explanation: `
                <p>
                    HTML terminology can initially be confusing.
                    The terms <strong>tag</strong> and <strong>element</strong>
                    are related but are not exactly the same.
                </p>

                <div class="code-box">
                    <pre><code>&lt;p&gt;Hello World&lt;/p&gt;</code></pre>
                </div>

                <ul>
                    <li><code>&lt;p&gt;</code> is the opening tag.</li>
                    <li><code>&lt;/p&gt;</code> is the closing tag.</li>
                    <li><code>Hello World</code> is the content.</li>
                    <li>The complete structure is the paragraph element.</li>
                </ul>

                <p>
                    Many HTML elements have an opening tag and closing tag,
                    although some elements are void elements and do not have
                    closing tags.
                </p>
            `,

            code: `<h1>Web Technologies</h1>

<p>Learn HTML fundamentals.</p>

<strong>Important content</strong>

<br>

<hr>`
        },

        {
            title: "4. HTML Attributes",

            explanation: `
                <p>
                    Attributes provide additional information about an HTML
                    element.
                </p>

                <p>
                    Attributes are normally written inside the opening tag.
                </p>

                <div class="code-box">
                    <pre><code>&lt;a href="https://codebhavya.com"&gt;
    CodeBhavya
&lt;/a&gt;</code></pre>
                </div>

                <p>
                    Here <code>href</code> is an attribute and its value is
                    <code>https://codebhavya.com</code>.
                </p>

                <div class="table-wrap">
                    <table>
                        <thead>
                            <tr>
                                <th>Attribute</th>
                                <th>Common Use</th>
                            </tr>
                        </thead>

                        <tbody>
                            <tr>
                                <td>href</td>
                                <td>Specifies a link destination.</td>
                            </tr>

                            <tr>
                                <td>src</td>
                                <td>Specifies a resource such as an image.</td>
                            </tr>

                            <tr>
                                <td>alt</td>
                                <td>Provides alternative text for an image.</td>
                            </tr>

                            <tr>
                                <td>id</td>
                                <td>Uniquely identifies an element.</td>
                            </tr>

                            <tr>
                                <td>class</td>
                                <td>Groups elements for styling or scripting.</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            `,

            code: `<p id="intro" class="highlight">
    Welcome to CodeBhavya.
</p>`
        },

        {
            title: "5. Headings",

            explanation: `
                <p>
                    HTML provides six heading levels:
                    <code>&lt;h1&gt;</code> through <code>&lt;h6&gt;</code>.
                </p>

                <p>
                    Headings should describe the hierarchy of the content,
                    rather than being selected only because of their default
                    visual size.
                </p>

                <div class="heading-demo">
                    <h1>Heading 1</h1>
                    <h2>Heading 2</h2>
                    <h3>Heading 3</h3>
                    <h4>Heading 4</h4>
                    <h5>Heading 5</h5>
                    <h6>Heading 6</h6>
                </div>

                <p>
                    A page normally has a clear primary heading, followed by
                    meaningful subheadings.
                </p>
            `,

            code: `<h1>Web Technologies</h1>

<h2>HTML</h2>

<h3>HTML Fundamentals</h3>

<h2>CSS</h2>

<h3>CSS Fundamentals</h3>`
        },

        {
            title: "6. Paragraphs and Text",

            explanation: `
                <p>
                    The <code>&lt;p&gt;</code> element represents a paragraph.
                </p>

                <p>
                    HTML also provides elements for expressing meaning or
                    emphasis within text.
                </p>

                <ul>
                    <li><code>&lt;strong&gt;</code> represents strong importance.</li>
                    <li><code>&lt;em&gt;</code> represents emphasis.</li>
                    <li><code>&lt;br&gt;</code> creates a line break.</li>
                    <li><code>&lt;hr&gt;</code> represents a thematic break.</li>
                </ul>
            `,

            code: `<p>
    HTML provides the structure of a web page.
</p>

<p>
    <strong>HTML</strong> is important for every web developer.
</p>

<p>
    Learn <em>step by step</em>.
</p>`
        },

        {
            title: "7. Links",

            explanation: `
                <p>
                    Links are created using the anchor element:
                    <code>&lt;a&gt;</code>.
                </p>

                <p>
                    The <code>href</code> attribute specifies where the link
                    should navigate.
                </p>

                <p>
                    Links may point to another website, another page in the
                    same website, a section of the current page, an email
                    address or other resources.
                </p>
            `,

            code: `<a href="https://codebhavya.com">
    Visit CodeBhavya
</a>

<br><br>

<a href="about.html">
    About
</a>

<br><br>

<a href="#contact">
    Contact Section
</a>`
        },

        {
            title: "8. Lists",

            explanation: `
                <p>
                    HTML provides several ways to represent lists.
                </p>

                <div class="table-wrap">
                    <table>
                        <thead>
                            <tr>
                                <th>Element</th>
                                <th>Purpose</th>
                            </tr>
                        </thead>

                        <tbody>
                            <tr>
                                <td>&lt;ul&gt;</td>
                                <td>Unordered list.</td>
                            </tr>

                            <tr>
                                <td>&lt;ol&gt;</td>
                                <td>Ordered list.</td>
                            </tr>

                            <tr>
                                <td>&lt;li&gt;</td>
                                <td>List item.</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            `,

            code: `<h2>Programming Languages</h2>

<ul>
    <li>C</li>
    <li>Python</li>
    <li>Java</li>
</ul>

<h2>Learning Order</h2>

<ol>
    <li>HTML</li>
    <li>CSS</li>
    <li>JavaScript</li>
</ol>`
        },

        {
            title: "9. Images",

            explanation: `
                <p>
                    The <code>&lt;img&gt;</code> element embeds an image into
                    a page.
                </p>

                <p>
                    The <code>src</code> attribute specifies the image source.
                    The <code>alt</code> attribute provides alternative text.
                </p>

                <p>
                    The <code>alt</code> attribute is important for accessibility
                    and also provides useful information when the image cannot
                    be displayed.
                </p>
            `,

            code: `<img
    src="images/student.jpg"
    alt="Student learning web technologies"
>`
        },

        {
            title: "10. Nesting HTML Elements",

            explanation: `
                <p>
                    HTML elements can contain other elements. This is called
                    <strong>nesting</strong>.
                </p>

                <p>
                    Proper nesting means that elements are closed in the
                    correct order.
                </p>

                <div class="code-box">
                    <pre><code>&lt;p&gt;
    Learn &lt;strong&gt;HTML&lt;/strong&gt; today.
&lt;/p&gt;</code></pre>
                </div>

                <p>
                    The <code>&lt;strong&gt;</code> element is inside the
                    paragraph element.
                </p>
            `,

            code: `<section>
    <h2>HTML</h2>

    <p>
        HTML creates
        <strong>page structure</strong>.
    </p>
</section>`
        },

        {
            title: "11. HTML Comments",

            explanation: `
                <p>
                    Comments are written using
                    <code>&lt;!-- --&gt;</code>.
                </p>

                <p>
                    Comments are ignored by the browser when rendering the
                    visible page.
                </p>

                <p>
                    Use comments to explain important sections of source code,
                    but avoid filling production code with unnecessary comments.
                </p>
            `,

            code: `<!-- Main page heading -->

<h1>CodeBhavya</h1>

<!-- Course introduction -->

<p>
    Learn Web Technologies.
</p>`
        },

        {
            title: "12. A Complete Small HTML Page",

            explanation: `
                <p>
                    The following example combines the fundamental HTML
                    concepts introduced in this level.
                </p>

                <p>
                    Notice how the document has a clear hierarchy:
                    document → heading → paragraph → list → link.
                </p>
            `,

            code: `<!DOCTYPE html>

<html lang="en">

<head>
    <meta charset="UTF-8">

    <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0"
    >

    <title>My Learning Page</title>
</head>

<body>

    <h1>My Web Development Journey</h1>

    <p>
        I am learning Web Technologies step by step.
    </p>

    <h2>Topics</h2>

    <ul>
        <li>HTML</li>
        <li>CSS</li>
        <li>JavaScript</li>
    </ul>

    <p>
        Visit
        <a href="https://codebhavya.com">
            CodeBhavya
        </a>
        to continue learning.
    </p>

</body>

</html>`
        }

    ],

    visualizer: {

        title: "HTML Document Structure Visualizer",

        description:
            "Follow how a browser interprets the major parts of a basic HTML document.",

        type: "flow",

        steps: [

            {
                title: "DOCTYPE",
                description:
                    "The browser identifies the document as an HTML document.",
                code: "<!DOCTYPE html>"
            },

            {
                title: "HTML Root",
                description:
                    "The html element becomes the root of the document.",
                code: "<html> ... </html>"
            },

            {
                title: "HEAD",
                description:
                    "Metadata and document information are processed.",
                code: "<head> ... </head>"
            },

            {
                title: "BODY",
                description:
                    "Visible page content is contained inside the body.",
                code: "<body> ... </body>"
            },

            {
                title: "Elements",
                description:
                    "The browser processes headings, paragraphs, links, lists and other elements.",
                code: "<h1>...</h1>\n<p>...</p>"
            },

            {
                title: "Rendered Page",
                description:
                    "The browser creates the visual representation of the document.",
                code: "HTML → DOM → Rendered Page"
            }
        ]
    },

    trace: {

        title: "HTML Parsing Trace",

        description:
            "Step through the basic processing order of a simple HTML document.",

        code: `<!DOCTYPE html>
<html>
<head>
    <title>CodeBhavya</title>
</head>
<body>
    <h1>Hello</h1>
    <p>Welcome.</p>
</body>
</html>`,

        steps: [
            {
                line: 1,
                operation: "Document type detected",
                explanation:
                    "The browser recognizes the document as HTML."
            },

            {
                line: 2,
                operation: "HTML root opened",
                explanation:
                    "The html element becomes the document root."
            },

            {
                line: 3,
                operation: "Head opened",
                explanation:
                    "Document metadata begins."
            },

            {
                line: 4,
                operation: "Title processed",
                explanation:
                    "The page title is identified."
            },

            {
                line: 5,
                operation: "Head closed",
                explanation:
                    "The metadata section ends."
            },

            {
                line: 6,
                operation: "Body opened",
                explanation:
                    "Visible page content begins."
            },

            {
                line: 7,
                operation: "Heading processed",
                explanation:
                    "The browser creates the heading element."
            },

            {
                line: 8,
                operation: "Paragraph processed",
                explanation:
                    "The browser creates the paragraph element."
            },

            {
                line: 9,
                operation: "Body closed",
                explanation:
                    "Visible content ends."
            },

            {
                line: 10,
                operation: "HTML document closed",
                explanation:
                    "The document structure is complete."
            }
        ]
    },

    mistakes: [

        {
            mistake: "Forgetting the DOCTYPE",
            wrong: `<html>
<body>
    <h1>Hello</h1>
</body>
</html>`,

            correct: `<!DOCTYPE html>
<html>
<body>
    <h1>Hello</h1>
</body>
</html>`,

            explanation:
                "Use a proper HTML document declaration so browsers interpret the document using modern HTML standards."
        },

        {
            mistake: "Incorrect nesting",
            wrong: `<p>
    <strong>Hello</p>
</strong>`,

            correct: `<p>
    <strong>Hello</strong>
</p>`,

            explanation:
                "Nested elements should be closed in the correct order."
        },

        {
            mistake: "Missing href on a link",
            wrong: `<a>Visit CodeBhavya</a>`,

            correct: `<a href="https://codebhavya.com">
    Visit CodeBhavya
</a>`,

            explanation:
                "An anchor needs a destination when it is intended to function as a link."
        },

        {
            mistake: "Missing alt text",
            wrong: `<img src="student.jpg">`,

            correct: `<img
    src="student.jpg"
    alt="Student learning"
>`,

            explanation:
                "Alternative text provides a textual description of meaningful images."
        },

        {
            mistake: "Using headings only for size",
            wrong: `<h1>Small Text</h1>
<h6>Main Topic</h6>`,

            correct: `<h1>Main Topic</h1>
<h2>Subtopic</h2>`,

            explanation:
                "Heading levels should communicate document hierarchy rather than simply visual size."
        }
    ],

    practice: [

        {
            title: "Practice 1 — Basic Profile Page",

            difficulty: "Easy",

            task:
                "Create an HTML page containing your name as the main heading, a short paragraph about yourself, and a list of three skills.",

            requirements: [
                "Use a valid HTML document structure.",
                "Use h1 for the main heading.",
                "Use p for the description.",
                "Use ul and li for the skills.",
                "Include a meaningful page title."
            ],

            expected:
                "A simple profile page containing a heading, paragraph and unordered list."
        },

        {
            title: "Practice 2 — Learning Resources",

            difficulty: "Easy",

            task:
                "Create a page containing a heading called Learning Resources and three links to useful learning websites.",

            requirements: [
                "Use h1 or h2 appropriately.",
                "Use the anchor element.",
                "Provide valid href attributes.",
                "Make the link text meaningful."
            ],

            expected:
                "A page containing three functional links."
        },

        {
            title: "Practice 3 — Student Profile",

            difficulty: "Medium",

            task:
                "Build a student profile page containing a name, course, skills list, profile image and a link to CodeBhavya.",

            requirements: [
                "Use a valid HTML structure.",
                "Use headings and paragraphs.",
                "Use an unordered list.",
                "Use an image with alt text.",
                "Use an anchor element."
            ],

            expected:
                "A structured student profile page using all major concepts from Level 07."
        }
    ],

    quiz: [

        {
            question:
                "What is the primary purpose of HTML?",

            options: [
                "To structure web content",
                "To create database tables",
                "To compile Java programs",
                "To manage operating system processes"
            ],

            answer: 0,

            explanation:
                "HTML defines the structure and meaning of web content."
        },

        {
            question:
                "Which element is the root element of an HTML document?",

            options: [
                "<body>",
                "<head>",
                "<html>",
                "<root>"
            ],

            answer: 2,

            explanation:
                "The html element is the root of an HTML document."
        },

        {
            question:
                "Which attribute specifies the destination of an anchor link?",

            options: [
                "src",
                "href",
                "alt",
                "target"
            ],

            answer: 1,

            explanation:
                "The href attribute specifies the URL or destination of a link."
        },

        {
            question:
                "Which element represents an unordered list?",

            options: [
                "<ol>",
                "<list>",
                "<ul>",
                "<li>"
            ],

            answer: 2,

            explanation:
                "The ul element creates an unordered list."
        },

        {
            question:
                "Which attribute provides alternative text for an image?",

            options: [
                "src",
                "title",
                "alt",
                "href"
            ],

            answer: 2,

            explanation:
                "The alt attribute provides alternative text for an image."
        },

        {
            question:
                "Which element represents the most important/main heading?",

            options: [
                "<h6>",
                "<heading>",
                "<h1>",
                "<head>"
            ],

            answer: 2,

            explanation:
                "h1 represents the highest-level heading in the normal heading hierarchy."
        },

        {
            question:
                "Which element contains visible page content?",

            options: [
                "<meta>",
                "<head>",
                "<body>",
                "<title>"
            ],

            answer: 2,

            explanation:
                "The body contains the document content displayed in the page."
        },

        {
            question:
                "What is an attribute?",

            options: [
                "A CSS file",
                "Additional information associated with an element",
                "A browser",
                "A programming language"
            ],

            answer: 1,

            explanation:
                "Attributes provide additional information or configuration for an HTML element."
        }
    ],

    interview: [

        {
            question: "What is HTML?",

            answer:
                "HTML is a markup language used to define the structure and meaning of content in web documents."
        },

        {
            question: "What is the difference between a tag and an element?",

            answer:
                "A tag is the markup syntax such as <p> or </p>. An element includes the complete structure, such as <p>Hello</p>, including its content."
        },

        {
            question: "What is an HTML attribute?",

            answer:
                "An attribute provides additional information about an HTML element and is normally written inside the opening tag."
        },

        {
            question: "Why is DOCTYPE used?",

            answer:
                "DOCTYPE tells the browser which document type and standards mode should be used to interpret the document."
        },

        {
            question: "What is the difference between head and body?",

            answer:
                "The head contains document metadata and resources, while the body contains the page content presented to the user."
        },

        {
            question: "What is the purpose of the alt attribute?",

            answer:
                "The alt attribute provides alternative text for an image, which is useful when the image cannot be displayed and for accessibility."
        },

        {
            question: "What is semantic meaning in HTML?",

            answer:
                "Semantic HTML uses elements according to their meaning and purpose rather than choosing elements only for their visual appearance."
        },

        {
            question: "What is nesting in HTML?",

            answer:
                "Nesting means placing one HTML element inside another element while maintaining the correct opening and closing order."
        }
    ],

    glossary: [

        {
            term: "HTML",
            definition:
                "HyperText Markup Language used to structure web content."
        },

        {
            term: "Element",
            definition:
                "A complete HTML structure consisting of tags and content where applicable."
        },

        {
            term: "Tag",
            definition:
                "Markup notation such as <p> or </p> used to define HTML elements."
        },

        {
            term: "Attribute",
            definition:
                "Additional information provided inside an HTML element's opening tag."
        },

        {
            term: "DOCTYPE",
            definition:
                "A declaration that identifies the document type and standards mode."
        },

        {
            term: "Heading",
            definition:
                "An HTML heading element from h1 through h6 used to represent content hierarchy."
        },

        {
            term: "Anchor",
            definition:
                "The a element used to create hyperlinks."
        },

        {
            term: "Nesting",
            definition:
                "Placing one HTML element inside another."
        },

        {
            term: "Alt Text",
            definition:
                "Alternative text that describes an image when it cannot be displayed and supports accessibility."
        },

        {
            term: "Void Element",
            definition:
                "An HTML element that does not use a closing tag, such as img and br."
        }
    ],

    revision: [

        "HTML provides the structure and meaning of web content.",

        "A standard document begins with <!DOCTYPE html>.",

        "The html element is the document root.",

        "The head contains metadata and document information.",

        "The body contains visible page content.",

        "Attributes provide additional information about elements.",

        "h1 through h6 represent heading levels.",

        "The p element represents a paragraph.",

        "The a element creates links and normally uses href.",

        "The ul element creates unordered lists.",

        "The ol element creates ordered lists.",

        "The li element represents a list item.",

        "The img element displays an image and should normally have meaningful alt text.",

        "Correct nesting is important for a well-structured document.",

        "HTML describes structure; CSS controls presentation; JavaScript provides behavior."
    ],

    completion: {

        title: "Level 07 Complete",

        message:
            "You have completed HTML Fundamentals. You can now create a basic structured HTML document using headings, paragraphs, links, lists and images.",

        nextLevel: 8,

        nextTitle: "Semantic HTML and Document Structure"
    }
};
