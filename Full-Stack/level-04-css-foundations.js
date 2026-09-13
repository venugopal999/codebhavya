
"use strict";

window.FULLSTACK_LESSONS = window.FULLSTACK_LESSONS || {};

window.FULLSTACK_LESSONS[4] = {
    n: 4,
    kicker: "WEB FOUNDATIONS",
    title: "CSS Foundations",
    summary:
        "Understand how CSS transforms semantic HTML into structured, readable and responsive interfaces by mastering selectors, cascade, specificity, inheritance, units, typography and the complete box model.",
    duration: "Estimated learning time: 4–5 hours",
    difficulty: "Beginner → Intermediate",
    concepts: 18,

    outcomes: [
        "Understand how CSS rules are written and applied.",
        "Use element, class, ID, attribute and combinator selectors correctly.",
        "Understand the cascade, inheritance, specificity and source order.",
        "Choose appropriate CSS units for different design situations.",
        "Build readable typography systems with CSS.",
        "Understand the complete CSS box model.",
        "Use padding, border, margin, width and height correctly.",
        "Understand why box-sizing: border-box is important.",
        "Control element rendering with display and overflow.",
        "Debug CSS using browser DevTools and computed styles.",
        "Understand how CSS decisions affect later responsive and React development.",
        "Build a clean CSS component without relying on accidental styling."
    ],

    sections: [

        {
            title: "1. Why CSS Exists",
            explanation:
                "HTML gives a page structure and meaning. CSS controls how that structure looks and behaves visually. A professional web application separates content from presentation so that the same HTML can be presented in different ways.",
            points: [
                "HTML answers: What is this?",
                "CSS answers: How should this look?",
                "JavaScript answers: What should this do?",
                "CSS can control color, spacing, typography, layout, borders and visual states.",
                "Good CSS should be predictable, maintainable and reusable."
            ],
            code: `<h1>Student Dashboard</h1>
<p class="message">Welcome back!</p>

/* CSS */

h1 {
    color: #2563eb;
}

.message {
    color: #475569;
    font-size: 1rem;
}`,
            note:
                "Keeping HTML structure and CSS presentation separate becomes especially important when building React and large MERN applications."
        },

        {
            title: "2. CSS Syntax",
            explanation:
                "A CSS rule contains a selector followed by one or more declarations. Each declaration has a property and a value.",
            points: [
                "Selector chooses the element.",
                "Property identifies what you want to change.",
                "Value specifies how it should be changed.",
                "Declarations are normally separated by semicolons.",
                "The declaration block is surrounded by curly braces."
            ],
            code: `p {
    color: blue;
    font-size: 18px;
    line-height: 1.6;
}`,
            example:
                "Here p is the selector. color, font-size and line-height are properties. Their assigned values determine the final appearance."
        },

        {
            title: "3. Element, Class and ID Selectors",
            explanation:
                "Selectors determine which HTML elements receive a CSS rule. Classes are the most reusable selector for application styling.",
            points: [
                "Element selector: targets all matching elements.",
                "Class selector: begins with a dot.",
                "ID selector: begins with #.",
                "Classes are generally preferred for reusable styling.",
                "IDs are more specific and should not normally be used as the main styling mechanism."
            ],
            code: `/* Element selector */
p {
    line-height: 1.6;
}

/* Class selector */
.card {
    padding: 20px;
}

/* ID selector */
#main-title {
    font-size: 32px;
}`,
            note:
                "In component-based systems such as React, reusable classes or component-scoped styling are usually easier to maintain than styling large sections through IDs."
        },

        {
            title: "4. Attribute Selectors",
            explanation:
                "Attribute selectors allow CSS to target elements according to their HTML attributes. They are particularly useful for forms and semantic interfaces.",
            points: [
                "input[type=\"email\"] targets email inputs.",
                "[disabled] targets elements containing the disabled attribute.",
                "[required] targets required controls.",
                "[data-state=\"open\"] targets a specific custom data value."
            ],
            code: `input[type="email"] {
    border-color: #2563eb;
}

input[required] {
    background: #f8fafc;
}

button[disabled] {
    opacity: 0.5;
}`,
            example:
                "Attribute selectors are useful when styling different kinds of form controls without adding a separate class to every element."
        },

        {
            title: "5. Combinators and Relationships",
            explanation:
                "CSS can select elements based on their relationship with other elements.",
            points: [
                "Descendant: .card p",
                "Child: .card > p",
                "Adjacent sibling: h2 + p",
                "General sibling: h2 ~ p"
            ],
            code: `.card p {
    color: #475569;
}

.card > p {
    margin-top: 10px;
}

h2 + p {
    margin-top: 4px;
}

h2 ~ p {
    color: #64748b;
}`,
            note:
                "Prefer selectors that describe meaningful structure without becoming unnecessarily deep or fragile."
        },

        {
            title: "6. The Cascade",
            explanation:
                "The word CSS contains the idea of cascading. Multiple rules can target the same element, so the browser needs a system for deciding which declaration wins.",
            points: [
                "CSS rules can come from different stylesheets.",
                "Multiple selectors can match the same element.",
                "Later rules can override earlier rules when their priority is otherwise equal.",
                "Specificity influences which selector wins.",
                "Importance and origin can also affect the final result."
            ],
            code: `p {
    color: black;
}

p {
    color: blue;
}

/* Final color: blue */`,
            note:
                "The cascade is not random. The browser evaluates competing declarations according to defined priority rules."
        },

        {
            title: "7. Specificity",
            explanation:
                "Specificity is the selector priority used when competing CSS declarations target the same property.",
            points: [
                "Inline styles have very high priority.",
                "ID selectors are more specific than classes.",
                "Classes, attributes and pseudo-classes are more specific than elements.",
                "Element selectors have lower specificity.",
                "If specificity is equal, later source order can decide the winner."
            ],
            code: `p {
    color: black;
}

.notice {
    color: blue;
}

#warning {
    color: red;
}`,
            example:
                "If the same paragraph has class=\"notice\" and id=\"warning\", the ID rule wins over the class and element rules."
        },

        {
            title: "8. Specificity Is Not a Competition to Win",
            explanation:
                "A common beginner mistake is continuously increasing selector specificity until the stylesheet becomes difficult to control. Professional CSS aims for simple, predictable selectors.",
            points: [
                "Avoid unnecessary IDs for styling.",
                "Avoid extremely deep selectors.",
                "Avoid using !important as a normal solution.",
                "Use component classes with clear responsibilities.",
                "Fix the underlying cascade problem instead of fighting it."
            ],
            code: `/* Fragile */
main section div.card article p span {
    color: red;
}

/* Better */
.card-title {
    color: red;
}`,
            note:
                "Low-specificity CSS is easier to override and maintain."
        },

        {
            title: "9. Inheritance",
            explanation:
                "Some CSS properties naturally inherit from a parent element to its descendants.",
            points: [
                "color commonly inherits.",
                "font-family commonly inherits.",
                "font-size can inherit through relative sizing.",
                "margin and padding do not normally inherit.",
                "Inheritance can reduce repeated declarations."
            ],
            code: `body {
    color: #1e293b;
    font-family: Arial, sans-serif;
}

article {
    /* Text inside inherits these values */
}`,
            note:
                "Inheritance is one reason global typography rules can be powerful, but global rules should still be chosen carefully."
        },

        {
            title: "10. Source Order",
            explanation:
                "When competing declarations have the same relevant priority and specificity, the declaration appearing later can win.",
            code: `.button {
    background: gray;
}

.button {
    background: blue;
}

/* Final background: blue */`,
            points: [
                "Earlier rule → overridden.",
                "Later rule → wins when priority and specificity are otherwise equal.",
                "Source order is part of the cascade.",
                "Do not depend on source order when a clearer selector structure would be better."
            ]
        },

        {
            title: "11. Inline, Internal and External CSS",
            explanation:
                "CSS can be written directly on an element, inside a style element, or in a separate stylesheet.",
            points: [
                "Inline CSS is attached directly to an element.",
                "Internal CSS lives inside a style element.",
                "External CSS lives in a separate .css file.",
                "External CSS is generally preferred for maintainable websites."
            ],
            code: `<!-- Inline -->
<p style="color: blue;">Hello</p>

<!-- Internal -->
<style>
    p {
        color: blue;
    }
</style>

<!-- External -->
<link rel="stylesheet" href="styles.css">`,
            note:
                "CodeBhavya course pages use separate CSS files because separation makes large educational websites easier to maintain."
        },

        {
            title: "12. CSS Units",
            explanation:
                "CSS supports several units. Choosing the right unit helps interfaces remain readable and adaptable.",
            points: [
                "px: fixed CSS pixel measurement.",
                "%: relative to a containing value.",
                "em: relative to the current element's font size.",
                "rem: relative to the root element's font size.",
                "vw: relative to viewport width.",
                "vh: relative to viewport height."
            ],
            code: `.container {
    width: 80%;
    max-width: 1100px;
}

.title {
    font-size: 2rem;
}

.hero {
    min-height: 60vh;
}`,
            note:
                "For scalable typography and spacing systems, rem is often easier to reason about than repeatedly hard-coding pixel values."
        },

        {
            title: "13. Colors",
            explanation:
                "CSS supports named colors, hexadecimal values, RGB, HSL and modern color functions.",
            points: [
                "Named colors are simple but limited.",
                "Hexadecimal notation is common in design systems.",
                "rgb() describes red, green and blue channels.",
                "hsl() separates hue, saturation and lightness.",
                "Alpha values can create transparency."
            ],
            code: `.primary {
    color: #2563eb;
}

.soft {
    background: rgb(241 245 249);
}

.badge {
    background: hsl(220 90% 56%);
}`,
            example:
                "A design system normally defines a controlled palette instead of using unrelated colors throughout a project."
        },

        {
            title: "14. Typography Foundations",
            explanation:
                "Typography strongly influences readability and visual hierarchy.",
            points: [
                "font-family chooses the typeface.",
                "font-size controls text size.",
                "font-weight controls visual thickness.",
                "line-height controls vertical rhythm.",
                "letter-spacing changes character spacing.",
                "text-align controls horizontal alignment."
            ],
            code: `body {
    font-family: system-ui, sans-serif;
    font-size: 16px;
    line-height: 1.6;
}

h1 {
    font-size: 2.25rem;
    line-height: 1.15;
    font-weight: 800;
}

p {
    max-width: 70ch;
}`,
            note:
                "Readable typography is not only about making text large. Line length, line height, hierarchy and contrast all matter."
        },

        {
            title: "15. The CSS Box Model",
            explanation:
                "Every normal HTML element can be understood as a rectangular box made from content, padding, border and margin.",
            points: [
                "Content is the actual text, image or child content.",
                "Padding creates space inside the border.",
                "Border surrounds padding and content.",
                "Margin creates space outside the border."
            ],
            code: `.card {
    width: 300px;
    padding: 20px;
    border: 2px solid #cbd5e1;
    margin: 24px;
}`,
            note:
                "Understanding the box model is one of the most important foundations for debugging CSS layout."
        },

        {
            title: "16. Width, Height, Padding, Border and Margin",
            explanation:
                "These properties control different parts of an element's box. Confusing them is a major source of layout bugs.",
            points: [
                "width → content width under the default box model.",
                "height → content height under the default box model.",
                "padding → internal spacing.",
                "border → visible boundary.",
                "margin → external spacing."
            ],
            code: `.profile {
    width: 320px;
    height: 180px;

    padding: 20px;
    border: 2px solid #334155;
    margin: 16px;
}`,
            example:
                "If you want text farther away from the card edge, use padding. If you want two cards farther apart, use margin or a layout gap."
        },

        {
            title: "17. box-sizing: border-box",
            explanation:
                "The default content-box model can make width calculations surprising because padding and border are added outside the declared width. border-box makes the declared width include padding and border.",
            code: `*,
*::before,
*::after {
    box-sizing: border-box;
}

.card {
    width: 300px;
    padding: 20px;
    border: 2px solid #334155;
}`,
            points: [
                "content-box: width applies to content only.",
                "border-box: width includes content, padding and border.",
                "border-box makes component sizing easier to predict.",
                "Many modern CSS projects use a global border-box reset."
            ]
        },

        {
            title: "18. Display and Overflow",
            explanation:
                "The display property controls how an element participates in layout. Overflow controls what happens when content exceeds its box.",
            points: [
                "block normally occupies its own line.",
                "inline participates in text flow.",
                "inline-block combines useful characteristics of both.",
                "none removes the element from layout.",
                "overflow: hidden clips overflowing content.",
                "overflow: auto allows scrolling when needed."
            ],
            code: `.panel {
    display: block;
    overflow: auto;
    max-height: 300px;
}

.hidden {
    display: none;
}`,
            note:
                "Flexbox and Grid will become the main layout systems in the next level, but understanding display is essential before learning them."
        },

        {
            title: "19. Debugging CSS with DevTools",
            explanation:
                "Professional CSS development involves debugging, not guessing. Browser DevTools shows which rules matched, which rules lost and what the final computed values are.",
            points: [
                "Inspect the element.",
                "Check matched CSS rules.",
                "Look for crossed-out declarations.",
                "Inspect computed values.",
                "Check the box model diagram.",
                "Temporarily toggle declarations.",
                "Test dimensions and overflow.",
                "Use the browser's responsive viewport tools."
            ],
            code: `/* If this rule appears crossed out:

.card {
    width: 300px;
}

check whether another rule has:
.card {
    width: 100%;
}

or a more specific selector is winning. */`,
            note:
                "A crossed-out CSS declaration is often the browser telling you that another declaration won the cascade."
        },

        {
            title: "20. From CSS Foundations to Full Stack",
            explanation:
                "CSS foundations are not isolated frontend knowledge. They become the visual layer of every application you build later.",
            points: [
                "HTML provides semantic structure.",
                "CSS controls presentation and layout.",
                "JavaScript controls browser behaviour.",
                "React organizes UI into components.",
                "Node.js and Express provide backend services.",
                "MongoDB stores application data.",
                "The frontend and backend meet through APIs."
            ],
            code: `HTML
  ↓
CSS
  ↓
JavaScript
  ↓
React
  ↓
HTTP / API
  ↓
Node.js + Express
  ↓
MongoDB`,
            note:
                "A strong Full Stack developer should understand how each layer contributes to the complete application."
        }
    ],

    visualizer: {
        title: "CSS Foundations Visualizer",
        subtitle:
            "See how the browser resolves competing CSS rules and how the box model builds an element's final size.",
        type: "css",
        steps: [
            {
                title: "HTML element",
                description:
                    "The browser starts with an element in the document.",
                code: `<div class="card" id="featured">
    CSS Foundations
</div>`
            },
            {
                title: "Matching selectors",
                description:
                    "The browser finds every CSS rule whose selector matches the element.",
                code: `div { ... }
.card { ... }
#featured { ... }`
            },
            {
                title: "Specificity comparison",
                description:
                    "Competing declarations are compared according to their priority and specificity.",
                code: `div       → lower
.card     → higher
#featured → highest`
            },
            {
                title: "Winning declaration",
                description:
                    "The browser keeps the declaration that wins the cascade.",
                code: `#featured {
    color: #2563eb;
}`
            },
            {
                title: "Build the box",
                description:
                    "The browser calculates content, padding, border and margin.",
                code: `content
   ↓
padding
   ↓
border
   ↓
margin`
            },
            {
                title: "Final rendered element",
                description:
                    "The browser paints the element using the resolved styles and calculated dimensions.",
                code: `┌──────────────────────────┐
│          margin          │
│  ┌────────────────────┐  │
│  │      border        │  │
│  │ ┌────────────────┐ │  │
│  │ │    padding     │ │  │
│  │ │  CSS content   │ │  │
│  │ └────────────────┘ │  │
│  └────────────────────┘  │
└──────────────────────────┘`
            }
        ]
    },

    revision: [
        {
            q: "What does CSS control?",
            a: "CSS controls presentation such as colors, typography, spacing, borders and layout."
        },
        {
            q: "What is a selector?",
            a: "A selector identifies which HTML elements a CSS rule should target."
        },
        {
            q: "Why are classes useful?",
            a: "Classes provide reusable styling hooks and are well suited to component-based interfaces."
        },
        {
            q: "What is the cascade?",
            a: "The cascade is the browser's system for resolving competing CSS declarations."
        },
        {
            q: "What is specificity?",
            a: "Specificity determines the relative priority of selectors when their declarations compete."
        },
        {
            q: "What is inheritance?",
            a: "Inheritance allows certain properties from a parent element to be passed to descendants."
        },
        {
            q: "What does rem represent?",
            a: "rem is relative to the root element's font size."
        },
        {
            q: "What are the four parts of the box model?",
            a: "Content, padding, border and margin."
        },
        {
            q: "What is padding?",
            a: "Padding creates space between an element's content and its border."
        },
        {
            q: "What is margin?",
            a: "Margin creates space outside an element's border."
        },
        {
            q: "Why use box-sizing: border-box?",
            a: "It makes declared width and height include padding and border, making sizing more predictable."
        },
        {
            q: "How should CSS normally be debugged?",
            a: "Use browser DevTools to inspect matched rules, computed styles, box dimensions and overridden declarations."
        }
    ],

    interview: [
        {
            q: "Explain the CSS cascade.",
            a: "The cascade resolves competing declarations by considering origin, importance, specificity and source order. The winning declaration becomes the computed style for that property."
        },
        {
            q: "What is CSS specificity?",
            a: "Specificity is the priority of a selector in the cascade. IDs are more specific than classes, while classes are more specific than element selectors."
        },
        {
            q: "Why should excessive specificity be avoided?",
            a: "Highly specific selectors are difficult to override and maintain. Simple, predictable selectors make large stylesheets easier to manage."
        },
        {
            q: "Explain the difference between padding and margin.",
            a: "Padding creates internal space between content and border. Margin creates external space outside the border."
        },
        {
            q: "Explain content-box versus border-box.",
            a: "With content-box, declared width normally applies to the content area. With border-box, the declared width includes content, padding and border."
        },
        {
            q: "What is CSS inheritance?",
            a: "Inheritance allows selected properties, such as color and font-family, to flow from parent elements to descendants unless overridden."
        },
        {
            q: "What is the difference between em and rem?",
            a: "em is relative to the relevant element's font size, while rem is relative to the root element's font size."
        },
        {
            q: "When would you use an attribute selector?",
            a: "Attribute selectors are useful when styling elements according to meaningful HTML attributes, such as input types or required controls."
        },
        {
            q: "Why is !important usually discouraged?",
            a: "It bypasses normal cascade reasoning and can create specificity conflicts that become difficult to maintain."
        },
        {
            q: "How do you find why a CSS rule is not working?",
            a: "Inspect the element in DevTools, check whether the rule matched, look for crossed-out declarations, inspect specificity and source order, and examine computed styles."
        },
        {
            q: "What is the box model?",
            a: "It describes an element as content surrounded by padding, border and margin."
        },
        {
            q: "Why is CSS knowledge important for React developers?",
            a: "React organizes UI structure and behaviour, but CSS still determines the visual presentation, spacing, responsive behaviour and usability of the interface."
        }
    ],

    practice: [
        {
            title: "Practice 01 — Selector Laboratory",
            task:
                "Create a page containing headings, paragraphs, cards and buttons. Style them using element, class, ID and attribute selectors. Identify which selector wins when multiple rules target the same element.",
            skills: ["Selectors", "Specificity", "Cascade"]
        },
        {
            title: "Practice 02 — Cascade Challenge",
            task:
                "Create three competing rules for the same button. Change selector specificity and source order and predict which background color the browser will display before testing it.",
            skills: ["Cascade", "Specificity", "Source order"]
        },
        {
            title: "Practice 03 — Typography Card",
            task:
                "Build a course card with a heading, description, metadata and button. Create a consistent typography hierarchy using font-family, font-size, font-weight and line-height.",
            skills: ["Typography", "Spacing", "Hierarchy"]
        },
        {
            title: "Practice 04 — Box Model Calculator",
            task:
                "Create an element with width, padding and border. Calculate its final rendered width using content-box and then repeat using border-box. Verify both results in DevTools.",
            skills: ["Box model", "box-sizing", "DevTools"]
        },
        {
            title: "Practice 05 — Spacing System",
            task:
                "Build three cards using a consistent spacing scale. Use padding inside cards and margin or gap between cards. Explain why each type of spacing was selected.",
            skills: ["Padding", "Margin", "Spacing"]
        },
        {
            title: "Practice 06 — Overflow Debugger",
            task:
                "Create a fixed-height content panel containing more text than the panel can display. Experiment with visible, hidden, scroll and auto overflow.",
            skills: ["Overflow", "Dimensions", "Debugging"]
        },
        {
            title: "Practice 07 — Form Styling",
            task:
                "Style a registration form using attribute selectors for email, password and required inputs. Provide clear focus and disabled states.",
            skills: ["Forms", "Attribute selectors", "States"]
        },
        {
            title: "Practice 08 — DevTools Investigation",
            task:
                "Create an intentionally broken card layout. Use DevTools to identify the overridden rule, inspect computed styles and correct the issue without using !important.",
            skills: ["DevTools", "Cascade", "Debugging"]
        },
        {
            title: "Practice 09 — Course Component",
            task:
                "Build a reusable course card containing title, level, description and action button. Keep the selectors simple enough to reuse the component multiple times.",
            skills: ["Reusable CSS", "Components", "Selectors"]
        },
        {
            title: "Practice 10 — CSS Cleanup",
            task:
                "Take a stylesheet containing deeply nested selectors and repeated declarations. Refactor it into simple reusable classes while keeping the same visual output.",
            skills: ["Maintainability", "Refactoring", "Specificity"]
        },
        {
            title: "Practice 11 — CSS Inspection Challenge",
            task:
                "Create an element whose width is unexpectedly larger than expected. Use DevTools to determine whether padding, border, box-sizing or another rule caused the issue.",
            skills: ["Box model", "DevTools", "Debugging"]
        },
        {
            title: "Practice 12 — Foundation Component",
            task:
                "Create a polished CodeBhavya-style learning card using only the CSS concepts learned in this level. Document the selector, typography, spacing and box-model decisions.",
            skills: ["Complete CSS foundation", "Design systems", "Component thinking"]
        }
    ],

    quiz: [
        {
            q: "Which symbol starts a CSS class selector?",
            options: [".", "#", "@", ":"],
            answer: 0,
            explanation: "A class selector begins with a dot, such as .card."
        },
        {
            q: "Which selector has higher specificity?",
            options: ["p", ".card", "#main", "*"],
            answer: 2,
            explanation: "An ID selector has higher specificity than a class, element or universal selector."
        },
        {
            q: "Which property creates space inside the border?",
            options: ["margin", "padding", "gap", "outline"],
            answer: 1,
            explanation: "Padding creates internal space between content and border."
        },
        {
            q: "Which property creates space outside the border?",
            options: ["padding", "margin", "border-spacing", "line-height"],
            answer: 1,
            explanation: "Margin creates external space around an element."
        },
        {
            q: "What does rem depend on?",
            options: [
                "The viewport width",
                "The parent width",
                "The root element's font size",
                "The border size"
            ],
            answer: 2,
            explanation: "rem is relative to the root element's font size."
        },
        {
            q: "Which declaration makes width calculations easier to predict?",
            options: [
                "display: block",
                "overflow: hidden",
                "box-sizing: border-box",
                "position: relative"
            ],
            answer: 2,
            explanation: "border-box includes padding and border inside the declared width and height."
        },
        {
            q: "Which CSS rule usually wins when specificity is equal?",
            options: [
                "The first rule",
                "The later rule",
                "The shorter rule",
                "The rule with more spaces"
            ],
            answer: 1,
            explanation: "When relevant priority and specificity are equal, later source order wins."
        },
        {
            q: "Which property normally inherits?",
            options: ["margin", "padding", "color", "border"],
            answer: 2,
            explanation: "color commonly inherits from a parent."
        },
        {
            q: "Which selector targets an email input?",
            options: [
                "input.email",
                "input[type=\"email\"]",
                "email.input",
                "#input-email"
            ],
            answer: 1,
            explanation: "The attribute selector targets inputs whose type attribute is email."
        },
        {
            q: "Which DevTools feature shows the final calculated CSS values?",
            options: [
                "Computed styles",
                "Bookmarks",
                "Console history",
                "Page source only"
            ],
            answer: 0,
            explanation: "Computed styles show the values the browser ultimately applies."
        },
        {
            q: "Which box-model layer surrounds the content?",
            options: ["Margin", "Padding", "Viewport", "Grid"],
            answer: 1,
            explanation: "Padding directly surrounds the content area."
        },
        {
            q: "Which declaration hides an element from layout?",
            options: [
                "visibility: visible",
                "display: none",
                "overflow: auto",
                "opacity: 1"
            ],
            answer: 1,
            explanation: "display: none removes the element from the document layout."
        },
        {
            q: "Which unit is relative to viewport width?",
            options: ["rem", "em", "vw", "px"],
            answer: 2,
            explanation: "vw represents a percentage of the viewport width."
        },
        {
            q: "What should normally be preferred over increasing specificity repeatedly?",
            options: [
                "More !important",
                "Clearer selector structure",
                "More IDs",
                "Inline styles everywhere"
            ],
            answer: 1,
            explanation: "Clear, low-specificity selector structures are easier to maintain."
        },
        {
            q: "Which four parts form the basic box model?",
            options: [
                "Content, padding, border, margin",
                "Width, height, grid, flex",
                "Header, body, footer, nav",
                "Color, font, shadow, radius"
            ],
            answer: 0,
            explanation: "The standard box model consists of content, padding, border and margin."
        }
    ],

    glossary: [
        {
            term: "CSS",
            definition:
                "Cascading Style Sheets, the language used to control the visual presentation of web documents."
        },
        {
            term: "Selector",
            definition:
                "A CSS pattern used to identify elements that should receive a rule."
        },
        {
            term: "Declaration",
            definition:
                "A property-value pair such as color: blue."
        },
        {
            term: "Cascade",
            definition:
                "The system used by the browser to resolve competing CSS declarations."
        },
        {
            term: "Specificity",
            definition:
                "The relative priority of a selector when declarations compete."
        },
        {
            term: "Inheritance",
            definition:
                "The mechanism by which certain CSS properties pass from parent to descendant."
        },
        {
            term: "Source Order",
            definition:
                "The position of rules in the stylesheet, which can decide the winner when other priorities are equal."
        },
        {
            term: "Box Model",
            definition:
                "The model describing content, padding, border and margin around an element."
        },
        {
            term: "Padding",
            definition:
                "Space between an element's content and its border."
        },
        {
            term: "Margin",
            definition:
                "Space outside an element's border."
        },
        {
            term: "Border",
            definition:
                "The visible boundary surrounding the padding and content."
        },
        {
            term: "rem",
            definition:
                "A relative unit based on the root element's font size."
        },
        {
            term: "Viewport",
            definition:
                "The visible area of the browser window used to display a webpage."
        },
        {
            term: "Computed Style",
            definition:
                "The final CSS values calculated and applied by the browser."
        },
        {
            term: "Specificity Conflict",
            definition:
                "A situation where multiple matching CSS rules compete to control the same property."
        }
    ],

    completion: {
        title: "Level 04 Completion Challenge",
        description:
            "Build a polished CodeBhavya-style Course Dashboard card using semantic HTML and external CSS. The component must demonstrate selectors, typography, spacing, the complete box model, border-box sizing, states and clean low-specificity CSS.",
        requirements: [
            "Create a semantic course card.",
            "Use at least one element selector and multiple reusable class selectors.",
            "Use an attribute selector for a form or button state.",
            "Create a clear heading and body typography hierarchy.",
            "Use padding, border and margin intentionally.",
            "Apply box-sizing: border-box.",
            "Include a hover or focus state.",
            "Verify the final dimensions using browser DevTools.",
            "Avoid unnecessary IDs and !important.",
            "Explain why each major CSS rule exists."
        ],
        success:
            "You have completed Level 04 when you can predict why a CSS rule wins, calculate an element's box-model dimensions, and debug a styling problem using DevTools instead of guessing."
    }
};

