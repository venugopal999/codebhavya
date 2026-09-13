"use strict";

/* =========================================================
   CodeBhavya Full Stack MERN
   Level 02 — Semantic HTML
   Version 2
   ========================================================= */

window.FULLSTACK_LESSONS =
  window.FULLSTACK_LESSONS || {};

window.FULLSTACK_LESSONS[2] = {

  title: "Semantic HTML",
  kicker: "WEB FOUNDATIONS",
  duration: "100–130 minutes",

  summary:
    "Learn how professional HTML describes the meaning and structure of a web page. You will learn semantic elements, headings, links, images, lists, tables, landmarks, accessibility basics and the difference between HTML structure and visual styling.",

  difficulty: "Beginner → Intermediate",

  estimatedTime: "100–130 minutes",

  hero: {
    badge: "LEVEL 02 • HTML FOUNDATIONS",
    description:
      "HTML is not simply a collection of tags. It is the structural language that tells the browser, search engines and assistive technologies what each part of a page means.",
    note:
      "Before React, CSS frameworks and component libraries, understand the document underneath them."
  },


  /* =======================================================
     LEARNING OBJECTIVES
     ======================================================= */

  objectives: [

    "Explain the difference between HTML, CSS and JavaScript.",

    "Understand what semantic HTML means and why it matters.",

    "Build a meaningful page structure using header, nav, main, section, article, aside and footer.",

    "Create correct heading hierarchies instead of choosing headings only because of their visual size.",

    "Understand the difference between links and buttons and choose the correct element.",

    "Use lists, images, figures and captions appropriately.",

    "Create accessible tables with meaningful headers.",

    "Understand the relationship between HTML, the DOM and accessibility technologies.",

    "Recognize when a generic div is appropriate and when a semantic element is better.",

    "Inspect and improve an HTML document using browser developer tools.",

    "Build a complete semantic structure for a CodeBhavya learning page.",

    "Avoid common HTML mistakes that create accessibility, SEO and maintenance problems."

  ],


  /* =======================================================
     CONCEPTS
     ======================================================= */

  concepts: [

    {
      number: 1,
      title: "What HTML actually does",

      intro:
        "HTML stands for HyperText Markup Language. It describes the structure and meaning of content in a web document. HTML does not primarily decide how beautiful the page looks and it does not provide application logic.",

      points: [
        "<strong>HTML</strong> describes structure and meaning.",
        "<strong>CSS</strong> controls presentation and visual layout.",
        "<strong>JavaScript</strong> provides behavior and application logic.",
        "A professional web application normally uses all three layers together.",
        "React does not replace HTML concepts; React ultimately produces DOM elements based on HTML semantics."
      ],

      keyIdea:
        "Think of HTML as the skeleton and meaning of the page, CSS as presentation, and JavaScript as behavior.",

      example: {
        title: "CodeBhavya lesson page",

        text:
          "A lesson page may contain a site header, navigation, main lesson content, practice area, related information and a footer. HTML gives each part a meaningful structure.",

        code:
`<header>
  <h1>CodeBhavya</h1>
</header>

<main>
  <article>
    <h2>Semantic HTML</h2>
    <p>Learn how meaningful HTML creates better web pages.</p>
  </article>
</main>

<footer>
  <p>CodeBhavya</p>
</footer>`
      },

      commonMistake:
        "Thinking HTML tags are mainly visual controls. A heading is not important because it looks large; it is important because it identifies a heading in the document structure."
    },


    {
      number: 2,
      title: "Elements, tags and attributes",

      intro:
        "HTML documents are made from elements. Tags are the markup syntax used to create elements, while attributes provide additional information about an element.",

      points: [
        "An opening tag normally begins an element.",
        "A closing tag normally ends an element.",
        "Some elements are void elements and do not have closing tags.",
        "Attributes provide additional information such as a URL, identifier, language or input purpose.",
        "Attribute values are normally written inside quotes."
      ],

      code:
`<a href="/courses/full-stack" class="course-link">
  Full Stack MERN
</a>

<img
  src="lesson.png"
  alt="Semantic HTML lesson illustration"
>

<input
  id="email"
  type="email"
  autocomplete="email"
>`,
      
      keyIdea:
        "The tag identifies what the element is; attributes provide additional information about that element.",

      comparison: {
        headers: [
          "Term",
          "Meaning",
          "Example"
        ],

        rows: [
          [
            "Element",
            "Complete HTML node",
            "<p>Hello</p>"
          ],
          [
            "Opening tag",
            "Starts an element",
            "<p>"
          ],
          [
            "Closing tag",
            "Ends a normal element",
            "</p>"
          ],
          [
            "Attribute",
            "Additional element information",
            'href="/courses"'
          ]
        ]
      }
    },


    {
      number: 3,
      title: "The HTML document skeleton",

      intro:
        "Every normal HTML document should have a predictable top-level structure. This gives the browser important information about the document and its language.",

      points: [
        "<strong>DOCTYPE</strong> tells the browser to use standards mode.",
        "<strong>html</strong> is the root element.",
        "<strong>head</strong> contains document metadata and resource references.",
        "<strong>body</strong> contains the document content shown or used by the page.",
        "The lang attribute communicates the primary language of the document."
      ],

      code:
`<!doctype html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport"
        content="width=device-width, initial-scale=1">

  <title>Semantic HTML | CodeBhavya</title>
</head>

<body>

  <header>
    <h1>CodeBhavya</h1>
  </header>

  <main>
    <h2>Semantic HTML</h2>
  </main>

</body>
</html>`,

      warning:
        "Do not copy the document skeleton blindly. Understand what each part is responsible for.",

      tryIt: {
        title: "Try It Yourself",
        steps: [
          "Create a file named index.html.",
          "Write the document skeleton manually instead of using an editor shortcut.",
          "Change the lang value and observe what it represents.",
          "Change the title and open the page in a browser.",
          "Inspect the document using browser DevTools."
        ]
      }
    },


    {
      number: 4,
      title: "What semantic HTML means",

      intro:
        "Semantic HTML means choosing an element because of what the content or interaction means, rather than choosing an element only because of how it looks.",

      points: [
        "<strong>nav</strong> communicates navigation.",
        "<strong>main</strong> communicates the primary content of the document.",
        "<strong>article</strong> communicates a self-contained composition.",
        "<strong>section</strong> groups related content into a meaningful thematic region.",
        "<strong>footer</strong> communicates footer information for a page or section.",
        "<strong>button</strong> communicates an action.",
        "<strong>a</strong> communicates a link to another location or resource."
      ],

      keyIdea:
        "Semantic HTML gives meaning to the structure. CSS can change appearance, but CSS cannot turn a meaningless element into the correct interaction or document semantics.",

      comparison: {
        headers: [
          "Generic",
          "Semantic",
          "Why semantic is useful"
        ],

        rows: [
          [
            "<div>",
            "<nav>",
            "Identifies navigation"
          ],
          [
            "<div>",
            "<main>",
            "Identifies primary content"
          ],
          [
            "<div>",
            "<article>",
            "Identifies self-contained content"
          ],
          [
            "<div>",
            "<button>",
            "Provides native action semantics"
          ]
        ]
      }
    },


    {
      number: 5,
      title: "The div element — useful, but neutral",

      intro:
        "div is a generic block container. It is not a bad element. The problem occurs when developers use div for everything even when a more meaningful element exists.",

      points: [
        "Use div when you need a neutral grouping container.",
        "Do not replace meaningful navigation with div elements unnecessarily.",
        "Do not create fake buttons from div elements.",
        "Do not use div merely because it is convenient.",
        "Semantic elements should communicate meaning; div remains available when no semantic meaning fits."
      ],

      code:
`<div class="card">
  <h3>JavaScript</h3>
  <p>Learn JavaScript fundamentals.</p>
</div>`,

      commonMistake:
        "The mistake is not using div. The mistake is using div when the content has a stronger semantic element.",

      example: {
        title: "Neutral wrapper vs meaningful content",

        text:
          "A div may be appropriate around several cards for layout. But each individual article may be better represented by article if each card can stand on its own."
      }
    },


    {
      number: 6,
      title: "Page landmarks",

      intro:
        "Landmark elements describe major regions of a page. They help people and assistive technologies understand the page without reading every piece of content sequentially.",

      points: [
        "<strong>header</strong> usually contains introductory content or site/section branding.",
        "<strong>nav</strong> contains major navigation links.",
        "<strong>main</strong> contains the primary content.",
        "<strong>aside</strong> contains related or complementary information.",
        "<strong>footer</strong> contains footer information.",
        "A page should normally have one primary main landmark."
      ],

      code:
`<header>
  <a href="/">CodeBhavya</a>
</header>

<nav aria-label="Primary">
  <a href="/courses">Courses</a>
  <a href="/practice">Practice</a>
</nav>

<main>
  <article>
    <h1>Semantic HTML</h1>
  </article>

  <aside>
    Related lessons
  </aside>
</main>

<footer>
  CodeBhavya
</footer>`,

      keyIdea:
        "Landmarks create a high-level map of the page."
    },


    {
      number: 7,
      title: "Header and footer are not only page-level elements",

      intro:
        "header and footer can describe the beginning and ending information of the whole page or of a meaningful section such as an article.",

      points: [
        "A page can have a header and footer.",
        "An article can also have its own header and footer.",
        "The meaning depends on the element's context.",
        "Do not assume header always means the website's top bar.",
        "Do not assume footer always means the final element of the entire body."
      ],

      code:
`<article>

  <header>
    <h2>Understanding DNS</h2>
    <p>Web Foundations</p>
  </header>

  <p>
    DNS translates human-readable domain names
    into network addressing information.
  </p>

  <footer>
    <p>Level 01 — Web Foundations</p>
  </footer>

</article>`
    },


    {
      number: 8,
      title: "Headings create document hierarchy",

      intro:
        "Headings communicate the structure of content. They should be selected according to hierarchy and meaning, not simply because one heading looks visually attractive.",

      points: [
        "<strong>h1</strong> identifies the primary page heading.",
        "<strong>h2</strong> identifies major sections under the page topic.",
        "<strong>h3</strong> identifies subsections under an h2.",
        "Continue the hierarchy when the content requires deeper levels.",
        "Do not choose h4 simply because it looks smaller.",
        "CSS should control visual size."
      ],

      code:
`<h1>Full Stack MERN</h1>

<h2>HTML Foundations</h2>

<h3>Semantic HTML</h3>

<h3>Forms</h3>

<h2>CSS Foundations</h2>

<h3>Selectors</h3>

<h3>Responsive Design</h3>`,

      warning:
        "A visually large paragraph is still a paragraph. A heading should identify an actual heading in the content.",

      commonMistake:
        "Using h1, h2 and h3 as font-size controls instead of document-structure controls."
    },


    {
      number: 9,
      title: "Heading hierarchy in a real CodeBhavya lesson",

      intro:
        "A course lesson is a good example of nested document structure.",

      points: [
        "The lesson title can be the h1.",
        "Major lesson sections can use h2.",
        "Subtopics inside those sections can use h3.",
        "Practice questions should have a logical relationship to their containing section.",
        "Do not skip hierarchy only to obtain a preferred visual size."
      ],

      code:
`<article>

  <h1>Semantic HTML</h1>

  <section>
    <h2>Semantic Elements</h2>

    <h3>Navigation</h3>
    <p>...</p>

    <h3>Articles</h3>
    <p>...</p>
  </section>

  <section>
    <h2>Accessibility</h2>

    <h3>Keyboard Navigation</h3>
    <p>...</p>
  </section>

</article>`
    },


    {
      number: 10,
      title: "section vs article",

      intro:
        "section and article are often confused because both group content. Their purposes are different.",

      points: [
        "<strong>section</strong> represents a thematic grouping within a larger document.",
        "<strong>article</strong> represents a self-contained composition that could potentially stand on its own.",
        "A section normally benefits from a heading.",
        "Articles can contain their own headings and internal structure.",
        "A course lesson can contain sections, while an individual blog post can be an article."
      ],

      comparison: {
        headers: [
          "Situation",
          "Better choice",
          "Reason"
        ],

        rows: [
          [
            "Chapter topic inside a lesson",
            "section",
            "Thematic grouping"
          ],
          [
            "Independent blog post",
            "article",
            "Self-contained composition"
          ],
          [
            "News story card",
            "article",
            "Can stand as its own content"
          ],
          [
            "Neutral layout wrapper",
            "div",
            "No semantic meaning required"
          ]
        ]
      },

      keyIdea:
        "Ask: Can this content be understood as its own composition? If yes, article may be appropriate. If it is a thematic part of a larger document, section is often more suitable."
    },


    {
      number: 11,
      title: "Navigation with nav",

      intro:
        "The nav element identifies a major collection of navigation links.",

      points: [
        "Use nav for important navigation blocks.",
        "Not every group of links needs nav.",
        "A page can contain more than one nav when the navigation purposes are different.",
        "aria-label can distinguish multiple navigation regions when necessary.",
        "The links inside nav should normally be real anchors."
      ],

      code:
`<nav aria-label="Course navigation">

  <a href="/Full-Stack/">Course Home</a>

  <a href="/Full-Stack/lesson.html?level=1">
    Level 1
  </a>

  <a href="/Full-Stack/lesson.html?level=2">
    Level 2
  </a>

</nav>`,

      commonMistake:
        "Putting every random collection of links inside nav. Use it for meaningful navigation regions."
    },


    {
      number: 12,
      title: "Links vs buttons",

      intro:
        "One of the most important HTML decisions is choosing between an anchor and a button.",

      points: [
        "Use <strong>a</strong> when the user is going somewhere or opening a resource.",
        "Use <strong>button</strong> when the user is performing an action.",
        "A link should normally have an href.",
        "A button should be keyboard accessible by default.",
        "Do not create fake buttons using clickable div elements."
      ],

      comparison: {
        headers: [
          "User intention",
          "Element",
          "Example"
        ],

        rows: [
          [
            "Open Level 02",
            "a",
            '<a href="lesson.html?level=2">'
          ],
          [
            "Open mobile menu",
            "button",
            '<button type="button">'
          ],
          [
            "Copy code",
            "button",
            '<button type="button">Copy</button>'
          ],
          [
            "Visit GitHub",
            "a",
            '<a href="...">'
          ]
        ]
      },

      keyIdea:
        "Destination → link. Action → button."
    },


    {
      number: 13,
      title: "Lists communicate collections",

      intro:
        "HTML has dedicated elements for ordered and unordered collections. Choosing the correct list helps communicate the relationship between items.",

      points: [
        "<strong>ul</strong> represents an unordered list.",
        "<strong>ol</strong> represents an ordered list.",
        "<strong>li</strong> represents an item inside a list.",
        "Navigation menus are often naturally represented using lists.",
        "Use ordered lists when sequence or ranking matters."
      ],

      code:
`<h2>Learning Path</h2>

<ol>
  <li>HTML</li>
  <li>CSS</li>
  <li>JavaScript</li>
  <li>React</li>
  <li>Node.js</li>
</ol>

<h2>Topics in Level 02</h2>

<ul>
  <li>Semantic elements</li>
  <li>Headings</li>
  <li>Links</li>
  <li>Accessibility</li>
</ul>`
    },


    {
      number: 14,
      title: "Images and alternative text",

      intro:
        "Images are content. The alt attribute tells assistive technology what an image means when the image itself cannot be perceived.",

      points: [
        "Meaningful images should have useful alternative text.",
        "Decorative images can use an empty alt attribute.",
        "Do not put the image filename into alt unless that is actually meaningful.",
        "Do not repeat surrounding text unnecessarily.",
        "Alt text should describe the purpose or meaning of the image in context."
      ],

      code:
`<img
  src="dns-flow.png"
  alt="Browser resolves codebhavya.com through DNS before connecting to the server."
>`,

      example: {
        title: "Decorative vs informative",

        steps: [
          "A diagram explaining DNS is informative, so its alt text should communicate the relevant meaning.",
          "A purely decorative background shape adds no information, so assistive technology should generally ignore it.",
          "Do not describe every visual detail when the surrounding text already communicates the same information."
        ]
      },

      warning:
        "Never use alt text as a place to insert keywords for SEO. Write it for meaning and users."
    },


    {
      number: 15,
      title: "figure and figcaption",

      intro:
        "When an image, diagram, code illustration or other content has a caption or belongs together as one unit, figure and figcaption can express that relationship.",

      code:
`<figure>

  <img
    src="request-flow.png"
    alt="Diagram showing browser request and server response."
  >

  <figcaption>
    Figure 1: Basic browser-to-server request flow.
  </figcaption>

</figure>`,

      points: [
        "figure represents a self-contained piece of content.",
        "figcaption provides its caption.",
        "The figure does not have to be an image; it can contain other self-contained content."
      ]
    },


    {
      number: 16,
      title: "Strong, emphasis and ordinary text",

      intro:
        "HTML provides elements that communicate meaning, not merely font appearance.",

      points: [
        "<strong> communicates strong importance.",
        "<em> communicates emphasis.",
        "<p> represents a paragraph.",
        "<span> is an inline generic container when no more meaningful element fits.",
        "Visual boldness or italics can be controlled separately with CSS."
      ],

      code:
`<p>
  <strong>Important:</strong>
  Never trust user input on the server.
</p>

<p>
  This point is <em>especially important</em>
  for authentication.
</p>`,

      commonMistake:
        "Using strong simply because you want bold text everywhere. Choose it when the content has stronger importance."
    },


    {
      number: 17,
      title: "Tables are for relationships between data",

      intro:
        "Tables should represent tabular data where rows and columns have meaningful relationships. They should not be used to create page layouts.",

      points: [
        "<strong>table</strong> contains the table.",
        "<strong>caption</strong> gives the table a title or description.",
        "<strong>thead</strong> groups header rows.",
        "<strong>tbody</strong> groups body rows.",
        "<strong>th</strong> represents a header cell.",
        "<strong>td</strong> represents a data cell.",
        "<strong>scope</strong> can communicate whether a header applies to a column or row."
      ],

      code:
`<table>

  <caption>
    Student Placement Results
  </caption>

  <thead>
    <tr>
      <th scope="col">Student</th>
      <th scope="col">CGPA</th>
      <th scope="col">Status</th>
    </tr>
  </thead>

  <tbody>
    <tr>
      <th scope="row">Student A</th>
      <td>8.7</td>
      <td>Placed</td>
    </tr>

    <tr>
      <th scope="row">Student B</th>
      <td>8.2</td>
      <td>Preparing</td>
    </tr>
  </tbody>

</table>`,

      keyIdea:
        "Tables describe data relationships. CSS grid and flexbox describe layout."
    },


    {
      number: 18,
      title: "HTML forms begin with semantics",

      intro:
        "Forms will be covered deeply in the next level, but semantic HTML requires understanding the basic relationship between labels and controls.",

      points: [
        "Every important form control should have a meaningful label.",
        "The label should remain understandable when the user starts typing.",
        "The name attribute matters for form submission.",
        "Buttons should have clear action names.",
        "Native controls provide keyboard and browser behavior that custom controls must recreate."
      ],

      code:
`<label for="studentName">
  Student name
</label>

<input
  id="studentName"
  name="studentName"
  type="text"
>

<button type="submit">
  Save student
</button>`,

      warning:
        "We will study validation, error handling, autocomplete and advanced accessibility for forms in Level 03."
    },


    {
      number: 19,
      title: "HTML and accessibility",

      intro:
        "Accessibility means designing interfaces that can be used by people with different abilities and different ways of interacting with technology.",

      points: [
        "Semantic HTML provides useful information to assistive technologies.",
        "Keyboard users depend on proper focusable controls.",
        "Screen readers can use headings and landmarks to navigate.",
        "Native buttons and links provide expected interaction behavior.",
        "Good HTML improves accessibility before additional ARIA is considered."
      ],

      keyIdea:
        "The first accessibility tool you should learn is correct HTML.",

      commonMistake:
        "Adding ARIA attributes to repair an element that should have been a native semantic element in the first place."
    },


    {
      number: 20,
      title: "What ARIA is — and what it is not",

      intro:
        "ARIA stands for Accessible Rich Internet Applications. It provides additional semantic information for situations where native HTML semantics alone are insufficient.",

      points: [
        "ARIA can communicate roles, names and states.",
        "ARIA should not automatically replace native HTML.",
        "A native button is normally preferable to a div with role=button.",
        "ARIA does not magically provide all keyboard behavior.",
        "When building custom widgets, ARIA and keyboard behavior must be implemented correctly."
      ],

      code:
`<!-- Prefer this -->

<button type="button">
  Open menu
</button>

<!-- Rather than creating a fake button -->

<div role="button">
  Open menu
</div>`,

      warning:
        "A role tells assistive technology what something is; it does not automatically implement the behavior expected from that control."
    },


    {
      number: 21,
      title: "The DOM — HTML becomes a tree",

      intro:
        "When the browser parses HTML, it creates an in-memory representation called the Document Object Model, or DOM.",

      points: [
        "HTML source is text.",
        "The browser parses that text.",
        "The result becomes a tree of nodes.",
        "JavaScript can read and modify the DOM.",
        "CSS can select elements in the DOM.",
        "Developer Tools can show the resulting DOM structure."
      ],

      code:
`<main>
  <h1>Semantic HTML</h1>

  <p>
    Meaningful structure improves the page.
  </p>
</main>`,

      architecture: [
        {
          title: "HTML Source",
          items: [
            "Text written by the developer",
            "Elements and attributes",
            "Downloaded by the browser"
          ]
        },
        {
          title: "HTML Parser",
          items: [
            "Reads markup",
            "Creates nodes",
            "Builds relationships"
          ]
        },
        {
          title: "DOM Tree",
          items: [
            "Document",
            "Elements",
            "Text nodes",
            "Attributes"
          ]
        },
        {
          title: "Browser",
          items: [
            "CSS styles the DOM",
            "JavaScript interacts with it",
            "User interacts with the resulting page"
          ]
        }
      ],

      keyIdea:
        "The DOM is not simply the original HTML file. It is the browser's structured representation of the document."
    },


    {
      number: 22,
      title: "HTML structure vs visual appearance",

      intro:
        "A major professional habit is separating meaning from presentation.",

      points: [
        "HTML answers: What is this?",
        "CSS answers: How should this look?",
        "JavaScript answers: What should happen when something changes?",
        "A heading can be visually small.",
        "A paragraph can be visually large.",
        "A button can be styled like a card, but it remains a button semantically."
      ],

      comparison: {
        headers: [
          "Question",
          "Technology",
          "Example"
        ],

        rows: [
          [
            "What is this content?",
            "HTML",
            "article"
          ],
          [
            "How should it look?",
            "CSS",
            "display: grid"
          ],
          [
            "What happens when clicked?",
            "JavaScript",
            "event listener"
          ]
        ]
      }
    },


    {
      number: 23,
      title: "Semantic HTML and SEO",

      intro:
        "Search engines need to understand the structure and meaning of a page. Semantic HTML can make that structure clearer, although SEO depends on many factors beyond HTML.",

      points: [
        "Meaningful headings communicate content hierarchy.",
        "Descriptive titles help identify pages.",
        "Descriptive links communicate destinations.",
        "Semantic structure can improve machine understanding.",
        "Good SEO is not achieved by inserting keywords everywhere.",
        "Useful content, accessibility, performance and technical quality also matter."
      ],

      warning:
        "Semantic HTML supports discoverability and understanding, but there is no single HTML tag that guarantees a high search ranking."
    },


    {
      number: 24,
      title: "Readable link text",

      intro:
        "A link should tell the user where it goes or what resource it represents.",

      points: [
        "Prefer descriptive link text.",
        "Avoid large numbers of links saying only 'Click here'.",
        "The destination should make sense when the link is read independently.",
        "Use href for actual navigation.",
        "If an action does not have a destination, it is probably a button."
      ],

      code:
`<!-- Weak -->

<a href="/Full-Stack/lesson.html?level=2">
  Click here
</a>

<!-- Better -->

<a href="/Full-Stack/lesson.html?level=2">
  Learn Semantic HTML
</a>`,

      keyIdea:
        "A user should be able to understand the purpose of a link without needing to inspect surrounding paragraphs."
    },


    {
      number: 25,
      title: "A complete semantic CodeBhavya page",

      intro:
        "Now combine the major concepts into one realistic page structure.",

      code:
`<!doctype html>
<html lang="en">

<head>

  <meta charset="UTF-8">

  <meta
    name="viewport"
    content="width=device-width, initial-scale=1"
  >

  <title>
    Semantic HTML | CodeBhavya
  </title>

</head>

<body>

  <header>

    <a href="/">
      CodeBhavya
    </a>

    <nav aria-label="Primary navigation">

      <a href="/courses">
        Courses
      </a>

      <a href="/practice">
        Practice
      </a>

    </nav>

  </header>


  <main>

    <article>

      <header>

        <p>WEB FOUNDATIONS</p>

        <h1>
          Semantic HTML
        </h1>

        <p>
          Learn how meaningful HTML
          creates better web pages.
        </p>

      </header>


      <section>

        <h2>
          What is Semantic HTML?
        </h2>

        <p>
          Semantic HTML describes
          the meaning of content.
        </p>

      </section>


      <section>

        <h2>
          Practice
        </h2>

        <ol>
          <li>Create a semantic page.</li>
          <li>Check the heading hierarchy.</li>
          <li>Test the page with keyboard navigation.</li>
        </ol>

      </section>


      <footer>

        <p>
          Continue to Level 03.
        </p>

      </footer>

    </article>


    <aside>

      <h2>
        Related Lessons
      </h2>

      <ul>

        <li>
          <a href="?level=1">
            How the Web Works
          </a>
        </li>

        <li>
          <a href="?level=3">
            Forms & Accessibility
          </a>
        </li>

      </ul>

    </aside>

  </main>


  <footer>

    <p>
      CodeBhavya
    </p>

  </footer>

</body>

</html>`,

      flow: [
        {
          name: "Document",
          detail: "The html element contains the document."
        },
        {
          name: "Site header",
          detail: "Branding and primary navigation appear in the header."
        },
        {
          name: "Main content",
          detail: "The main landmark contains the primary lesson."
        },
        {
          name: "Article",
          detail: "The lesson itself is represented as a self-contained composition."
        },
        {
          name: "Sections",
          detail: "Major topics are grouped into meaningful sections."
        },
        {
          name: "Aside",
          detail: "Related learning material is complementary content."
        },
        {
          name: "Footer",
          detail: "The page ends with site-level footer information."
        }
      ],

      keyIdea:
        "Good semantic HTML makes the page understandable as a document before CSS and JavaScript are added."
    },


    {
      number: 26,
      title: "Inspect semantic structure with DevTools",

      intro:
        "Browser Developer Tools are not only for debugging JavaScript. They are also excellent for understanding the actual DOM structure produced by the browser.",

      points: [
        "Open Developer Tools with F12 or the browser's developer-tools command.",
        "Open the Elements panel.",
        "Inspect the html, head and body hierarchy.",
        "Expand main, article, section and footer elements.",
        "Check whether the actual DOM structure matches your intended document structure.",
        "Use the accessibility information provided by browser tools when available."
      ],

      tryIt: {
        title: "DevTools Investigation",
        steps: [
          "Open any CodeBhavya lesson page.",
          "Open DevTools → Elements.",
          "Find the main element.",
          "Find the lesson heading.",
          "Expand one section.",
          "Identify its heading and content.",
          "Inspect the navigation.",
          "Ask yourself whether the DOM structure communicates the page correctly."
        ]
      }
    },


    {
      number: 27,
      title: "Putting everything together",

      intro:
        "Now connect the concepts into one mental model.",

      points: [
        "<strong>HTML</strong> describes the document.",
        "<strong>Semantic elements</strong> communicate meaning.",
        "<strong>Headings</strong> communicate hierarchy.",
        "<strong>Landmarks</strong> communicate major page regions.",
        "<strong>Links</strong> communicate destinations.",
        "<strong>Buttons</strong> communicate actions.",
        "<strong>Lists</strong> communicate collections.",
        "<strong>Images and figures</strong> communicate visual content and context.",
        "<strong>Tables</strong> communicate relationships between data.",
        "<strong>DOM</strong> represents the parsed document in the browser.",
        "<strong>Accessibility</strong> benefits from correct native semantics.",
        "<strong>CSS</strong> controls presentation without changing the underlying meaning."
      ],

      flow: [
        {
          name: "Write HTML",
          detail: "Describe the content and its meaning."
        },
        {
          name: "Browser parses",
          detail: "The browser reads the markup."
        },
        {
          name: "DOM is created",
          detail: "Elements become nodes in a document tree."
        },
        {
          name: "CSS is applied",
          detail: "Presentation rules style the structure."
        },
        {
          name: "JavaScript runs",
          detail: "Behavior can read and modify the DOM."
        },
        {
          name: "Users interact",
          detail: "Keyboard, mouse, touch and assistive technologies consume the result."
        }
      ],

      keyIdea:
        "Semantic HTML is the foundation on which accessible, maintainable and professional frontend applications are built."
    }

  ],


  /* =======================================================
     PREMIUM VISUALIZER
     ======================================================= */

  visualizer: {

    title: "Build a Semantic Web Page",

    description:
      "Follow how a simple HTML document becomes a structured page in the browser.",

    steps: [

      {
        title: "HTML source arrives",

        operation:
          "<code>&lt;main&gt;...&lt;/main&gt;</code>",

        detail:
          "The browser receives HTML text from the server."
      },

      {
        title: "Parser reads the markup",

        operation:
          "Read → identify elements → build relationships",

        detail:
          "The HTML parser identifies elements, attributes and text."
      },

      {
        title: "DOM tree is created",

        operation:
          "Document → main → article → section → h2",

        detail:
          "The browser creates an in-memory tree representing the document."
      },

      {
        title: "CSS finds elements",

        operation:
          "main { ... }  section { ... }",

        detail:
          "CSS selectors match elements in the DOM and provide presentation."
      },

      {
        title: "JavaScript can interact",

        operation:
          "document.querySelector(...)",

        detail:
          "JavaScript can read, modify and respond to events involving the DOM."
      },

      {
        title: "User receives the interface",

        operation:
          "Visual UI + semantic structure + interaction",

        detail:
          "The browser presents the page to the user and exposes its semantics to relevant technologies."
      }

    ]
  },


  /* =======================================================
     PROGRAM TRACING
     ======================================================= */

  trace: {

    title: "Trace how HTML becomes a DOM tree",

    lines: [

      {
        line: 1,
        code: "<main>",
        explanation:
          "The browser encounters the main element and creates a main node."
      },

      {
        line: 2,
        code: "  <article>",
        explanation:
          "The article becomes a child of the main element."
      },

      {
        line: 3,
        code: "    <h1>Semantic HTML</h1>",
        explanation:
          "An h1 element is created inside the article and its text becomes a child text node."
      },

      {
        line: 4,
        code: "    <section>",
        explanation:
          "A section node is created as another child of the article."
      },

      {
        line: 5,
        code: "      <h2>Landmarks</h2>",
        explanation:
          "The h2 becomes a child of the section and represents the section's heading."
      },

      {
        line: 6,
        code: "      <p>Meaningful structure</p>",
        explanation:
          "The paragraph becomes another child of the section."
      },

      {
        line: 7,
        code: "    </section>",
        explanation:
          "The section subtree is complete."
      },

      {
        line: 8,
        code: "  </article>",
        explanation:
          "The article subtree is complete."
      },

      {
        line: 9,
        code: "</main>",
        explanation:
          "The main subtree is now complete and forms part of the document tree."
      }

    ]
  },


  /* =======================================================
     QUICK REVISION
     ======================================================= */

  revision: [

    [
      "HTML",
      "Describes the structure and meaning of web content."
    ],

    [
      "Semantic HTML",
      "Uses elements according to their meaning and purpose."
    ],

    [
      "div",
      "A neutral generic container."
    ],

    [
      "main",
      "Contains the primary content of the page."
    ],

    [
      "nav",
      "Represents an important navigation region."
    ],

    [
      "article",
      "Represents a self-contained composition."
    ],

    [
      "section",
      "Groups related content into a thematic region."
    ],

    [
      "Heading",
      "Communicates document hierarchy."
    ],

    [
      "Anchor",
      "Represents navigation to another resource or location."
    ],

    [
      "Button",
      "Represents an action."
    ],

    [
      "alt",
      "Provides alternative text for an image."
    ],

    [
      "DOM",
      "The browser's structured in-memory representation of the document."
    ],

    [
      "ARIA",
      "Additional accessibility semantics used when native HTML is insufficient."
    ]

  ],


  /* =======================================================
     COMMON MISTAKES
     ======================================================= */

  mistakes: [

    {
      wrong:
        "Using div for every part of the page.",

      correct:
        "Use semantic elements when they communicate the actual purpose of the content. Keep div for neutral grouping."
    },

    {
      wrong:
        "Using headings because they look large or small.",

      correct:
        "Choose heading levels according to document hierarchy and use CSS for visual sizing."
    },

    {
      wrong:
        "Using a clickable div instead of a button.",

      correct:
        "Use a native button for actions because it provides appropriate semantics and keyboard behavior."
    },

    {
      wrong:
        "Using an anchor without href for an action.",

      correct:
        "Use a button when the interaction performs an action instead of navigating to a destination."
    },

    {
      wrong:
        "Writing alt=\"image.png\".",

      correct:
        "Describe the useful meaning of the image, or use empty alt when the image is purely decorative."
    },

    {
      wrong:
        "Using tables for page layout.",

      correct:
        "Use tables for tabular data. Use CSS layout systems such as grid and flexbox for page layout."
    },

    {
      wrong:
        "Adding ARIA everywhere.",

      correct:
        "Prefer correct native HTML semantics first. Add ARIA only when it provides necessary additional semantics."
    },

    {
      wrong:
        "Creating links that all say 'Click here'.",

      correct:
        "Use descriptive link text that communicates the destination or resource."
    }

  ],


  /* =======================================================
     INTERVIEW QUESTIONS
     ======================================================= */

  interview: [

    {
      q:
        "What is semantic HTML?",

      a:
        "Semantic HTML means choosing HTML elements according to the meaning and purpose of their content or interaction rather than choosing elements only for visual appearance. Examples include main, nav, article, section, button and footer."
    },

    {
      q:
        "Why is semantic HTML important?",

      a:
        "It improves document structure, accessibility, maintainability and machine understanding. Assistive technologies can use native semantics to help users navigate the page."
    },

    {
      q:
        "What is the difference between div and section?",

      a:
        "div is a neutral generic container. section represents a meaningful thematic grouping of content, normally associated with a heading."
    },

    {
      q:
        "What is the difference between section and article?",

      a:
        "section groups related content within a larger document, while article represents a self-contained composition that can potentially stand independently."
    },

    {
      q:
        "What is the difference between an anchor and a button?",

      a:
        "An anchor is normally used for navigation to a URL or resource. A button performs an action such as opening a menu, submitting a form or copying content."
    },

    {
      q:
        "Why should we not use headings only for their visual size?",

      a:
        "Heading levels communicate document hierarchy. Visual appearance should be controlled with CSS."
    },

    {
      q:
        "What is the DOM?",

      a:
        "The DOM, or Document Object Model, is the browser's structured in-memory representation of the parsed document. JavaScript and browser APIs can interact with it."
    },

    {
      q:
        "What is the purpose of alt text?",

      a:
        "Alt text provides an alternative representation of an image's useful meaning when the image cannot be perceived. Decorative images can generally use an empty alt attribute."
    },

    {
      q:
        "Why is a div with role=button usually inferior to a native button?",

      a:
        "The native button already provides appropriate semantics and browser interaction behavior. A custom role does not automatically recreate all expected keyboard and interaction behavior."
    },

    {
      q:
        "Can a page contain more than one nav element?",

      a:
        "Yes. A page may contain multiple meaningful navigation regions, such as primary navigation and course navigation. Appropriate labels can distinguish them when necessary."
    },

    {
      q:
        "Does semantic HTML guarantee good SEO?",

      a:
        "No. Semantic HTML helps search engines understand document structure, but SEO depends on many factors including content quality, accessibility, performance, links and technical implementation."
    },

    {
      q:
        "Why should tables not be used for page layout?",

      a:
        "Tables communicate relationships between rows and columns of data. Using them for layout gives the document incorrect semantics and makes responsive and accessible design harder."
    }

  ],


  /* =======================================================
     PRACTICE ARENA
     ======================================================= */

  practice: [

    {
      title:
        "Build a CodeBhavya Lesson",

      difficulty:
        "Easy",

      task:
        "Create an HTML page for a CodeBhavya lesson using header, nav, main, article, section and footer. Do not use CSS initially.",

      hints: [
        "Start with the document skeleton.",
        "Create one clear h1.",
        "Use h2 for major lesson sections.",
        "Use nav only for meaningful navigation."
      ]
    },

    {
      title:
        "Semantic Refactoring",

      difficulty:
        "Easy",

      task:
        "Take a page containing only div elements and replace appropriate containers with header, nav, main, article, section, aside and footer.",

      hints: [
        "First identify what each region means.",
        "Do not replace every div automatically.",
        "Keep div where no semantic element is appropriate."
      ]
    },

    {
      title:
        "Heading Hierarchy",

      difficulty:
        "Easy",

      task:
        "Create the heading hierarchy for a Full Stack MERN course page containing HTML, CSS, JavaScript, React and Node.js sections.",

      hints: [
        "Start with one primary page topic.",
        "Use h2 for major topics.",
        "Use h3 for topics inside an h2 section."
      ]
    },

    {
      title:
        "Link or Button?",

      difficulty:
        "Medium",

      task:
        "For each action, decide whether it should use an anchor or button: Open Level 3, Copy Code, Open Menu, Visit GitHub, Submit Answer, Go to Practice.",

      hints: [
        "Ask whether the user is navigating somewhere.",
        "If the user is performing an action on the current interface, a button is usually appropriate."
      ]
    },

    {
      title:
        "Accessible Image",

      difficulty:
        "Medium",

      task:
        "Create three image examples: an informative diagram, a decorative icon and a course thumbnail. Write appropriate alt text for each.",

      hints: [
        "Think about what information would be lost if the image disappeared.",
        "Do not describe decorative details unnecessarily."
      ]
    },

    {
      title:
        "Placement Results Table",

      difficulty:
        "Medium",

      task:
        "Create an accessible table containing Student Name, CGPA, Company and Placement Status. Add a caption and appropriate headers.",

      hints: [
        "Use caption.",
        "Use th for headers.",
        "Think about whether each header describes a row or column."
      ]
    },

    {
      title:
        "Semantic Blog Article",

      difficulty:
        "Medium",

      task:
        "Build a blog article about 'How HTTP Works' using article, header, sections, headings, paragraphs, figure, figcaption and footer.",

      hints: [
        "The article should make sense independently.",
        "Each major topic should have its own heading."
      ]
    },

    {
      title:
        "Keyboard-First Audit",

      difficulty:
        "Medium",

      task:
        "Open a website and navigate through its interactive controls using only the keyboard. Record every place where focus becomes confusing or an interaction cannot be performed.",

      hints: [
        "Use Tab and Shift+Tab.",
        "Watch the visible focus indicator.",
        "Try Enter and Space on interactive controls."
      ]
    },

    {
      title:
        "DOM Structure Investigation",

      difficulty:
        "Hard",

      task:
        "Open a CodeBhavya lesson in DevTools and draw the DOM hierarchy from html to main content. Identify the parent-child relationship of at least ten elements.",

      hints: [
        "Start at html.",
        "Move through body.",
        "Identify header, nav, main, article and footer.",
        "Inspect nested headings and sections."
      ]
    },

    {
      title:
        "Semantic CodeBhavya Homepage",

      difficulty:
        "Hard",

      task:
        "Build the HTML-only structure of a CodeBhavya homepage containing branding, navigation, course categories, featured course cards, practice links, an aside and footer.",

      hints: [
        "Do not think about colors yet.",
        "First make the document understandable without CSS.",
        "Use links for destinations and buttons only for actions."
      ]
    },

    {
      title:
        "Refactor a Real Page",

      difficulty:
        "Placement",

      task:
        "Choose any page you previously created and perform a semantic audit. List every div, heading, link, button, image and table. Explain whether each element is semantically appropriate.",

      hints: [
        "Do not change an element just to make the code look different.",
        "Every change should have a reason."
      ]
    },

    {
      title:
        "Build Without CSS",

      difficulty:
        "Placement",

      task:
        "Create a complete Full Stack course lesson using HTML only. Then disable CSS and ask whether the page is still understandable from top to bottom.",

      hints: [
        "Correct document order matters.",
        "Headings should still communicate hierarchy.",
        "Navigation should still be understandable.",
        "The page should remain usable before styling."
      ]
    }

  ],


  /* =======================================================
     KNOWLEDGE CHECK
     ======================================================= */

  quiz: [

    {
      q:
        "What is the primary purpose of HTML?",

      options: [
        "Database management",
        "Document structure and meaning",
        "Image editing",
        "Server deployment"
      ],

      answer: 1,

      explanation:
        "HTML describes the structure and meaning of web content."
    },

    {
      q:
        "Which element represents the primary content of a page?",

      options: [
        "aside",
        "main",
        "footer",
        "span"
      ],

      answer: 1,

      explanation:
        "The main element identifies the primary content of the document."
    },

    {
      q:
        "Which element is normally used for important navigation links?",

      options: [
        "nav",
        "section",
        "div",
        "figure"
      ],

      answer: 0,

      explanation:
        "nav identifies a major navigation region."
    },

    {
      q:
        "Which element is best for an action such as opening a menu?",

      options: [
        "a",
        "button",
        "p",
        "article"
      ],

      answer: 1,

      explanation:
        "Opening a menu is an action, so a button is the appropriate native control."
    },

    {
      q:
        "Which element is normally used to navigate to another page?",

      options: [
        "button",
        "a",
        "span",
        "strong"
      ],

      answer: 1,

      explanation:
        "An anchor represents navigation to another URL or resource."
    },

    {
      q:
        "What is div?",

      options: [
        "A database element",
        "A generic neutral container",
        "A heading",
        "A navigation control"
      ],

      answer: 1,

      explanation:
        "div is a generic container with no specific semantic meaning."
    },

    {
      q:
        "What does article generally represent?",

      options: [
        "Only images",
        "A self-contained composition",
        "A CSS file",
        "A database record"
      ],

      answer: 1,

      explanation:
        "article represents a self-contained composition that can potentially stand independently."
    },

    {
      q:
        "Why should headings be chosen according to hierarchy?",

      options: [
        "Only to change colors",
        "To communicate document structure",
        "To reduce JavaScript",
        "To create databases"
      ],

      answer: 1,

      explanation:
        "Heading levels communicate the hierarchy of the document."
    },

    {
      q:
        "What is the purpose of alt text?",

      options: [
        "To change image color",
        "To provide alternative meaning for an image",
        "To create CSS",
        "To make an image larger"
      ],

      answer: 1,

      explanation:
        "Alternative text communicates useful image meaning when the image cannot be perceived."
    },

    {
      q:
        "What should tables normally represent?",

      options: [
        "Page layout",
        "Tabular data relationships",
        "Navigation buttons",
        "CSS animations"
      ],

      answer: 1,

      explanation:
        "Tables are intended for data organized into meaningful rows and columns."
    },

    {
      q:
        "What does DOM stand for?",

      options: [
        "Data Object Machine",
        "Document Object Model",
        "Dynamic Output Method",
        "Document Order Manager"
      ],

      answer: 1,

      explanation:
        "DOM stands for Document Object Model."
    },

    {
      q:
        "Which is usually preferable?",

      options: [
        "div role=button",
        "Native button",
        "Clickable paragraph",
        "Clickable heading"
      ],

      answer: 1,

      explanation:
        "Native controls provide appropriate semantics and expected interaction behavior."
    },

    {
      q:
        "Which element represents a thematic grouping?",

      options: [
        "section",
        "button",
        "img",
        "a"
      ],

      answer: 0,

      explanation:
        "section represents a thematic grouping of content."
    },

    {
      q:
        "What should CSS primarily control?",

      options: [
        "Document meaning",
        "Visual presentation",
        "Database records",
        "DNS"
      ],

      answer: 1,

      explanation:
        "CSS primarily controls presentation and layout."
    },

    {
      q:
        "What should you normally use for an action?",

      options: [
        "button",
        "a without href",
        "div",
        "span"
      ],

      answer: 0,

      explanation:
        "Use a native button for an action."
    }

  ],


  /* =======================================================
     GLOSSARY
     ======================================================= */

  glossary: [

    {
      term: "HTML",
      definition:
        "HyperText Markup Language; the structural language used to describe web documents."
    },

    {
      term: "Semantic HTML",
      definition:
        "HTML that communicates the meaning and purpose of content through appropriate elements."
    },

    {
      term: "Element",
      definition:
        "A complete HTML node consisting of markup and its content where applicable."
    },

    {
      term: "Attribute",
      definition:
        "Additional information supplied on an HTML element."
    },

    {
      term: "Landmark",
      definition:
        "A major region of a page that helps users and assistive technologies navigate."
    },

    {
      term: "DOM",
      definition:
        "The browser's structured in-memory representation of the parsed HTML document."
    },

    {
      term: "Accessibility",
      definition:
        "Designing interfaces so people with different abilities and interaction methods can use them."
    },

    {
      term: "ARIA",
      definition:
        "Accessible Rich Internet Applications; a set of accessibility semantics for dynamic or custom interfaces."
    },

    {
      term: "Heading hierarchy",
      definition:
        "The structural relationship between h1, h2, h3 and deeper heading levels."
    },

    {
      term: "Alternative text",
      definition:
        "Text that communicates the useful meaning of an image when the image itself cannot be perceived."
    },

    {
      term: "Tabular data",
      definition:
        "Data organized into rows and columns with meaningful relationships."
    },

    {
      term: "Native control",
      definition:
        "A built-in HTML control such as button, input or select that already provides standard browser behavior."
    }

  ],


  /* =======================================================
     COMPLETION
     ======================================================= */

  completion: {

    title:
      "You now understand the structure beneath the interface.",

    message:
      "Before moving to advanced frontend development, you should be able to look at an HTML page and explain what every major region means, why each element was selected and how the browser turns the document into a DOM tree.",

    challenge:
      "Build one complete CodeBhavya-style lesson using HTML only. Before adding CSS, check the document hierarchy, heading structure, navigation, links, buttons, images, lists and landmarks. If the page is understandable without styling, your HTML foundation is becoming strong."

  }

};
