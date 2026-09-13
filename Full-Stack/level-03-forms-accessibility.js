"use strict";

/* =========================================================
   CodeBhavya Full Stack MERN
   LEVEL 03 — FORMS & ACCESSIBILITY
   ========================================================= */

window.FULLSTACK_LESSONS = window.FULLSTACK_LESSONS || {};

window.FULLSTACK_LESSONS[3] = {
    n: 3,

    kicker: "WEB FOUNDATIONS",

    title: "Forms & Accessibility",

    summary:
        "Learn how websites collect user information correctly and inclusively. Build forms with semantic HTML, labels, input types, native validation, keyboard support, accessible descriptions, error handling and responsible ARIA usage.",

    duration: "Estimated learning time: 3–4 hours",

    difficulty: "Beginner → Intermediate",

    concepts: 15,

    outcomes: [
        "Explain the purpose of the HTML form element and how form submission works.",
        "Build forms using labels, inputs, buttons, textareas and select controls.",
        "Choose appropriate input types for different kinds of user data.",
        "Explain the difference between id, name, value, placeholder and autocomplete.",
        "Use fieldset and legend to group related controls.",
        "Use native HTML validation before reaching for JavaScript.",
        "Explain required, minlength, maxlength, min, max and pattern.",
        "Design forms that can be completed using only a keyboard.",
        "Understand focus, focus order and visible focus indicators.",
        "Create useful accessible error messages and descriptions.",
        "Explain the purpose of aria-describedby and aria-invalid.",
        "Understand when native HTML is better than custom ARIA widgets.",
        "Distinguish navigation links from action buttons.",
        "Audit a form for common accessibility and usability problems.",
        "Connect accessible frontend forms to future React, Express and API workflows."
    ],

    /* =====================================================
       CONCEPTS
       ===================================================== */

    sections: [

        {
            title: "Why Forms Matter",

            intro:
                "Forms are the bridge between a user's intention and an application's data. Almost every serious web application eventually needs to collect information.",

            points: [
                "Login pages collect credentials.",
                "Registration pages collect account information.",
                "Placement applications collect student and academic information.",
                "Search forms collect queries.",
                "Payment and checkout systems collect transaction information.",
                "Admin dashboards collect updates and configuration data.",
                "Feedback forms collect user responses."
            ],

            explanation: [
                "A form is not just a collection of text boxes. A good form communicates what information is required, how the user should provide it, what happens when something is wrong and what will happen after submission.",
                "In Full Stack development, the browser is only the first validation boundary. The backend must validate submitted data again because client-side validation can be bypassed.",
                "Accessibility is part of form quality. A form that looks beautiful but cannot be completed with a keyboard or understood by assistive technology is not a professionally complete form."
            ],

            keyIdea:
                "A professional form must be understandable, usable, validatable and accessible—not merely visually attractive.",

            example: {
                title: "Placement Registration",

                text:
                    "A college placement registration form might collect name, roll number, email, phone number, branch, CGPA, graduation year, skills and resume information.",

                steps: [
                    "The student reads the field label.",
                    "The student enters a value.",
                    "The browser may perform native validation.",
                    "The form is submitted.",
                    "The server validates the data again.",
                    "The application stores or processes the information."
                ]
            }
        },

        {
            title: "The Form Element",

            intro:
                "The <code>&lt;form&gt;</code> element identifies a group of controls whose values can be submitted as a unit.",

            points: [
                "<code>action</code> identifies the submission destination.",
                "<code>method</code> controls the HTTP submission method.",
                "<code>name</code> gives a control its submitted field name.",
                "<code>button type=\"submit\"</code> triggers form submission.",
                "<code>button type=\"button\"</code> performs an ordinary action without submitting the form.",
                "A form can contain multiple types of controls."
            ],

            code:
`<form action="/register" method="post">
    <label for="studentName">Student name</label>
    <input
        id="studentName"
        name="studentName"
        type="text"
        required
    >

    <button type="submit">
        Register
    </button>
</form>`,

            label: "BASIC FORM",

            explanation: [
                "The browser associates the label with the input because the label's <code>for</code> value matches the input's <code>id</code>.",
                "The <code>name</code> is important because it identifies the field when form data is submitted.",
                "The submit button tells the browser that the user wants to submit the form."
            ],

            commonMistake:
                "Using an input with an id but no name is a common mistake. The control may still appear and work visually, but its value may not be included in the submitted form data."
        },

        {
            title: "Labels Are Not Optional Decoration",

            intro:
                "Every user-facing form control should have a clear accessible name. For ordinary form controls, the native <code>&lt;label&gt;</code> element is usually the best solution.",

            code:
`<label for="email">
    College email
</label>

<input
    id="email"
    name="email"
    type="email"
>`,

            points: [
                "The label tells users what the control represents.",
                "Clicking an explicit label can move focus to the associated control.",
                "Screen readers can use the label as the control's accessible name.",
                "The label remains useful even when the placeholder disappears after typing.",
                "A placeholder is not a replacement for a proper label."
            ],

            comparison: {
                headers: [
                    "Technique",
                    "Good practice?",
                    "Reason"
                ],

                rows: [
                    [
                        "<code>&lt;label&gt;</code>",
                        "Yes",
                        "Provides a semantic accessible name."
                    ],
                    [
                        "Placeholder only",
                        "No",
                        "Disappears and should not carry the full labeling responsibility."
                    ],
                    [
                        "Visual text unrelated to control",
                        "Usually no",
                        "The relationship may not be exposed correctly."
                    ],
                    [
                        "aria-label",
                        "Sometimes",
                        "Useful when a visible label genuinely cannot be used."
                    ]
                ]
            },

            keyIdea:
                "A visible label and a programmatic relationship between label and control are two important parts of an accessible form."
        },

        {
            title: "id, name, value and placeholder",

            intro:
                "These attributes are often confused because they appear together in form examples, but they solve different problems.",

            comparison: {
                headers: [
                    "Attribute",
                    "Purpose",
                    "Example"
                ],

                rows: [
                    [
                        "<code>id</code>",
                        "Uniquely identifies the element in the document.",
                        "<code>id=\"email\"</code>"
                    ],
                    [
                        "<code>name</code>",
                        "Identifies the submitted field.",
                        "<code>name=\"email\"</code>"
                    ],
                    [
                        "<code>value</code>",
                        "Represents the control's current/submitted value when applicable.",
                        "<code>value=\"CSE\"</code>"
                    ],
                    [
                        "<code>placeholder</code>",
                        "Provides a short example or hint inside an empty control.",
                        "<code>placeholder=\"you@example.com\"</code>"
                    ]
                ]
            },

            code:
`<label for="email">
    College email
</label>

<input
    id="email"
    name="email"
    type="email"
    placeholder="you@example.com"
>`,

            warning:
                "Do not use placeholder text as the only label. Users can forget what a field means after entering a value, and placeholder contrast can also be difficult to read.",

            example: {
                title: "Student Profile",

                text:
                    "A student profile form might use id=\"cgpa\" to connect the label, name=\"cgpa\" to identify submitted data and placeholder=\"e.g. 8.42\" as an optional example."
            }
        },

        {
            title: "Choosing the Correct Input Type",

            intro:
                "HTML provides many input types that communicate the expected data and allow browsers to provide useful native behaviour.",

            comparison: {
                headers: [
                    "Type",
                    "Typical use",
                    "Example"
                ],

                rows: [
                    [
                        "<code>text</code>",
                        "Names and short text",
                        "Bhavya"
                    ],
                    [
                        "<code>email</code>",
                        "Email addresses",
                        "student@example.com"
                    ],
                    [
                        "<code>password</code>",
                        "Password entry",
                        "••••••••"
                    ],
                    [
                        "<code>number</code>",
                        "Numeric values",
                        "8.42"
                    ],
                    [
                        "<code>tel</code>",
                        "Telephone numbers",
                        "+91..."
                    ],
                    [
                        "<code>date</code>",
                        "Dates",
                        "2026-09-13"
                    ],
                    [
                        "<code>url</code>",
                        "Web addresses",
                        "https://..."
                    ],
                    [
                        "<code>search</code>",
                        "Search queries",
                        "React"
                    ]
                ]
            },

            keyIdea:
                "Choose the input type according to the meaning of the data, not merely according to how the control looks."
        },

        {
            title: "Radio Buttons, Checkboxes and Selects",

            intro:
                "Different controls communicate different selection models.",

            points: [
                "<strong>Radio buttons:</strong> choose one option from a related group.",
                "<strong>Checkboxes:</strong> choose zero, one or multiple independent options.",
                "<strong>Select:</strong> choose from a predefined list of options.",
                "<strong>Fieldset and legend:</strong> provide a semantic group and group name for related controls."
            ],

            code:
`<fieldset>
    <legend>Preferred learning mode</legend>

    <label>
        <input
            type="radio"
            name="mode"
            value="online"
        >
        Online
    </label>

    <label>
        <input
            type="radio"
            name="mode"
            value="classroom"
        >
        Classroom
    </label>
</fieldset>

<fieldset>
    <legend>Skills</legend>

    <label>
        <input
            type="checkbox"
            name="skills"
            value="html"
        >
        HTML
    </label>

    <label>
        <input
            type="checkbox"
            name="skills"
            value="javascript"
        >
        JavaScript
    </label>
</fieldset>`,

            warning:
                "Radio buttons representing one choice must normally share the same name. Otherwise the browser treats them as separate groups."
        },

        {
            title: "Textarea, Select and Button",

            intro:
                "Not every piece of information should be collected through a single-line text input.",

            code:
`<label for="branch">
    Branch
</label>

<select
    id="branch"
    name="branch"
    required
>
    <option value="">
        Select your branch
    </option>
    <option value="cse">
        CSE
    </option>
    <option value="aiml">
        CSE-AI & ML
    </option>
</select>

<label for="message">
    Career goal
</label>

<textarea
    id="message"
    name="message"
    rows="5"
></textarea>

<button type="submit">
    Submit profile
</button>`,

            points: [
                "Use <code>select</code> when the available choices are known and relatively small.",
                "Use <code>textarea</code> for multi-line input.",
                "Use <code>button</code> for actions.",
                "Use an anchor when the user is navigating to another resource."
            ],

            comparison: {
                headers: [
                    "Need",
                    "Preferred element"
                ],

                rows: [
                    [
                        "Navigate to another page",
                        "<code>&lt;a href=\"...\"&gt;</code>"
                    ],
                    [
                        "Submit a form",
                        "<code>&lt;button type=\"submit\"&gt;</code>"
                    ],
                    [
                        "Perform JavaScript action",
                        "<code>&lt;button type=\"button\"&gt;</code>"
                    ],
                    [
                        "Multi-line text",
                        "<code>&lt;textarea&gt;</code>"
                    ]
                ]
            }
        },

        {
            title: "Native HTML Validation",

            intro:
                "Browsers can perform useful validation before JavaScript or a backend receives the form.",

            code:
`<form>
    <label for="email">
        College email
    </label>

    <input
        id="email"
        name="email"
        type="email"
        required
    >

    <label for="cgpa">
        CGPA
    </label>

    <input
        id="cgpa"
        name="cgpa"
        type="number"
        min="0"
        max="10"
        step="0.01"
        required
    >

    <button type="submit">
        Continue
    </button>
</form>`,

            points: [
                "<code>required</code> prevents empty submission.",
                "<code>type=\"email\"</code> provides email-oriented validation.",
                "<code>min</code> and <code>max</code> define numeric boundaries.",
                "<code>minlength</code> and <code>maxlength</code> constrain text length.",
                "<code>pattern</code> applies a regular-expression constraint.",
                "<code>step</code> controls valid numeric increments."
            ],

            keyIdea:
                "Native validation is the first useful layer. It improves user feedback, but it never replaces server-side validation."
        },

        {
            title: "The Difference Between Client and Server Validation",

            intro:
                "A browser can help a user enter valid information, but the server must still treat incoming data as untrusted.",

            flow: [
                {
                    name: "User enters data",
                    detail: "The user fills the form."
                },
                {
                    name: "Browser validation",
                    detail: "Native constraints can catch obvious problems."
                },
                {
                    name: "Form submission",
                    detail: "The browser sends data to the server."
                },
                {
                    name: "Server validation",
                    detail: "The backend validates the data again."
                },
                {
                    name: "Business rules",
                    detail: "The application checks permissions and domain rules."
                },
                {
                    name: "Database",
                    detail: "Only acceptable data is stored."
                }
            ],

            warning:
                "Never trust client-side validation as a security boundary. A user can disable JavaScript, modify requests or call your API directly.",

            example: {
                title: "CGPA Validation",

                text:
                    "The browser can require a number between 0 and 10. The backend should independently verify that the submitted value is numeric and within the allowed range before storing it."
            }
        },

        {
            title: "Autocomplete and Better User Experience",

            intro:
                "The browser can help users fill common information by using the autocomplete attribute.",

            code:
`<label for="name">
    Full name
</label>

<input
    id="name"
    name="name"
    type="text"
    autocomplete="name"
>

<label for="email">
    Email
</label>

<input
    id="email"
    name="email"
    type="email"
    autocomplete="email"
>`,

            points: [
                "Autocomplete can reduce repetitive typing.",
                "Meaningful autocomplete values help browsers understand fields.",
                "Autocomplete is especially useful for names, email addresses, telephone numbers and addresses.",
                "Good form design respects the user's time as well as their accessibility needs."
            ],

            commonMistake:
                "Disabling autocomplete without a strong reason can make forms slower and less convenient."
        },

        {
            title: "Keyboard Accessibility",

            intro:
                "A user should be able to operate a form without relying on a mouse.",

            points: [
                "Use the Tab key to move through focusable controls.",
                "Use Shift + Tab to move backwards.",
                "Use Enter to submit forms when appropriate.",
                "Use Space or arrow keys where native controls provide those interactions.",
                "Do not remove the browser's visible focus indicator without replacing it with an equally clear indicator."
            ],

            flow: [
                "Keyboard focus enters the form",
                "Name field receives focus",
                "Email field receives focus",
                "Branch selector receives focus",
                "Submit button receives focus",
                "User submits the form"
            ],

            keyIdea:
                "If a form works with a mouse but becomes confusing or impossible with the keyboard, it is not fully accessible."
        },

        {
            title: "Focus Order and Focus Visibility",

            intro:
                "Focus tells keyboard users where they are. The order should follow a logical reading and interaction sequence.",

            points: [
                "Avoid positive tabindex values such as <code>tabindex=\"5\"</code> to manually force order.",
                "Prefer natural DOM order.",
                "Use <code>tabindex=\"0\"</code> only when a custom focusable element genuinely needs to participate in normal tab order.",
                "Use visible focus styles.",
                "Do not make interactive elements disappear from keyboard navigation accidentally."
            ],

            code:
`button:focus-visible,
input:focus-visible,
select:focus-visible,
textarea:focus-visible {
    outline: 3px solid #63d2da;
    outline-offset: 3px;
}`,

            warning:
                "Never use outline: none without providing another obvious focus indicator.",

            commonMistake:
                "Moving focus around with arbitrary tabindex values can create an order that is difficult to predict and maintain."
        },

        {
            title: "Accessible Descriptions and Error Messages",

            intro:
                "A field may need more information than its visible label provides. Descriptions and errors should be programmatically associated with the relevant control.",

            code:
`<label for="password">
    Password
</label>

<input
    id="password"
    name="password"
    type="password"
    aria-describedby="passwordHelp"
    aria-invalid="true"
>

<p id="passwordHelp">
    Use at least 8 characters.
</p>

<p id="passwordError">
    Password must contain at least 8 characters.
</p>`,

            points: [
                "<code>aria-describedby</code> can associate additional explanatory text with a control.",
                "<code>aria-invalid=\"true\"</code> can communicate that the current value is invalid.",
                "Error messages should explain what went wrong and, when useful, how to fix it.",
                "Do not rely only on red colour to communicate errors."
            ],

            keyIdea:
                "Accessible errors answer two questions: What is wrong? What should I do next?"
        },

        {
            title: "ARIA — Use It Carefully",

            intro:
                "ARIA adds accessibility semantics to interfaces, but it should not be the first tool you reach for when native HTML already provides the correct behaviour.",

            comparison: {
                headers: [
                    "Situation",
                    "Prefer"
                ],

                rows: [
                    [
                        "Clickable action",
                        "Native <code>&lt;button&gt;</code>"
                    ],
                    [
                        "Navigation",
                        "Native <code>&lt;a href&gt;</code>"
                    ],
                    [
                        "Text field",
                        "Native <code>&lt;input&gt;</code>"
                    ],
                    [
                        "Select menu",
                        "Native <code>&lt;select&gt;</code>"
                    ],
                    [
                        "Additional description",
                        "<code>aria-describedby</code> can be appropriate"
                    ],
                    [
                        "Dynamic invalid state",
                        "<code>aria-invalid</code> can be appropriate"
                    ]
                ]
            },

            warning:
                "ARIA does not automatically create keyboard behaviour, focus management or browser behaviour. A div with role=\"button\" is not automatically equivalent to a native button.",

            commonMistake:
                "Adding ARIA everywhere can make markup more complicated without improving accessibility. Start with correct native HTML."
        },

        {
            title: "A Complete Accessible Student Form",

            intro:
                "Now combine the concepts into a realistic CodeBhavya-style student profile form.",

            code:
`<form action="/students" method="post">

    <fieldset>
        <legend>Student profile</legend>

        <label for="studentName">
            Full name
        </label>
        <input
            id="studentName"
            name="studentName"
            type="text"
            autocomplete="name"
            required
        >

        <label for="email">
            College email
        </label>
        <input
            id="email"
            name="email"
            type="email"
            autocomplete="email"
            required
        >

        <label for="cgpa">
            CGPA
        </label>
        <input
            id="cgpa"
            name="cgpa"
            type="number"
            min="0"
            max="10"
            step="0.01"
            required
        >

        <label for="branch">
            Branch
        </label>
        <select
            id="branch"
            name="branch"
            required
        >
            <option value="">
                Select branch
            </option>
            <option value="cse">
                CSE
            </option>
            <option value="aiml">
                CSE-AI & ML
            </option>
        </select>

        <fieldset>
            <legend>Preferred track</legend>

            <label>
                <input
                    type="radio"
                    name="track"
                    value="development"
                    required
                >
                Web Development
            </label>

            <label>
                <input
                    type="radio"
                    name="track"
                    value="data"
                >
                Data & AI
            </label>
        </fieldset>

        <label for="goal">
            Career goal
        </label>
        <textarea
            id="goal"
            name="goal"
            rows="5"
            minlength="20"
            maxlength="500"
        ></textarea>

        <button type="submit">
            Save student profile
        </button>
    </fieldset>

</form>`,

            points: [
                "Every important control has a label.",
                "Related choices are grouped semantically.",
                "The browser can perform useful validation.",
                "The form remains meaningful without CSS.",
                "The structure can later be connected to a React frontend and Express API."
            ],

            keyIdea:
                "Good Full Stack forms begin with strong HTML. Frameworks should enhance the foundation, not hide or replace it."
        },

        {
            title: "From HTML Form to MERN Application",

            intro:
                "The same form concepts continue into React, Express and MongoDB.",

            architecture: [
                {
                    title: "Browser Form",
                    items: [
                        "Labels and controls",
                        "Client-side constraints",
                        "User interaction"
                    ]
                },
                {
                    title: "React UI",
                    items: [
                        "Controlled inputs",
                        "Component state",
                        "Client-side feedback"
                    ]
                },
                {
                    title: "Express API",
                    items: [
                        "Request parsing",
                        "Validation",
                        "Authentication and authorization"
                    ]
                },
                {
                    title: "Database",
                    items: [
                        "Validated records",
                        "Schema constraints",
                        "Persistent application data"
                    ]
                }
            ],

            example: {
                title: "Placement Management System",

                text:
                    "A student may fill a placement profile in React. The browser and React validate the interface, Express validates the API request, business rules check eligibility, and MongoDB stores the approved record."
            },

            keyIdea:
                "Accessibility starts in HTML and continues through every layer of the application."
        }

    ],

    /* =====================================================
       PREMIUM VISUALIZER
       ===================================================== */

    visualizer: {

        title: "Form Submission & Validation Flow",

        description:
            "Step through what happens when a user completes an accessible form. Notice where browser validation helps and where backend validation is still required.",

        steps: [

            {
                title: "01 · User focuses a field",
                detail:
                    "The browser gives the control focus. A visible focus indicator helps keyboard users understand where they are."
            },

            {
                title: "02 · Label identifies the field",
                detail:
                    "The associated label communicates the purpose of the control."
            },

            {
                title: "03 · User enters data",
                detail:
                    "The value becomes part of the control's current state."
            },

            {
                title: "04 · Native constraints apply",
                detail:
                    "Attributes such as required, type, min, max and minlength can detect obvious invalid input."
            },

            {
                title: "05 · User submits",
                detail:
                    "A submit button requests form submission."
            },

            {
                title: "06 · Browser checks validity",
                detail:
                    "If a native constraint fails, the browser can prevent submission and guide the user."
            },

            {
                title: "07 · Request reaches the server",
                detail:
                    "Valid client-side input is sent to the backend."
            },

            {
                title: "08 · Server validates again",
                detail:
                    "The backend must treat every incoming value as untrusted."
            },

            {
                title: "09 · Business rules run",
                detail:
                    "The application checks permissions, eligibility and domain-specific rules."
            },

            {
                title: "10 · Data is stored",
                detail:
                    "Only acceptable data should reach persistent storage."
            },

            {
                title: "11 · Response returns",
                detail:
                    "The backend reports success or useful validation errors."
            },

            {
                title: "12 · User receives feedback",
                detail:
                    "The interface communicates the result in a clear and accessible way."
            }

        ]
    },

    /* =====================================================
       QUICK REVISION
       ===================================================== */

    revision: [

        [
            "Form",
            "A semantic container for controls whose values can be submitted together."
        ],

        [
            "Label",
            "The semantic name of a form control."
        ],

        [
            "id",
            "Uniquely identifies an element and can connect it to a label."
        ],

        [
            "name",
            "Identifies a submitted form field."
        ],

        [
            "required",
            "A native constraint that prevents an empty value from satisfying the control."
        ],

        [
            "fieldset",
            "Groups related form controls."
        ],

        [
            "legend",
            "Provides the name or explanation for a fieldset."
        ],

        [
            "Focus",
            "The current interactive location for keyboard interaction."
        ],

        [
            "aria-describedby",
            "Associates additional descriptive content with a control."
        ],

        [
            "aria-invalid",
            "Communicates that the current value is invalid when appropriate."
        ],

        [
            "Native control",
            "A built-in browser control that already provides semantics and interaction behaviour."
        ],

        [
            "Server validation",
            "Independent validation performed by the backend before trusting submitted data."
        ]
    ],

    /* =====================================================
       PLACEMENT & INTERVIEW
       ===================================================== */

    interview: [

        {
            question: "Why should every important form control have a label?",

            answer:
                "A label communicates the purpose of the control and provides an accessible name. An explicit label can also move focus to its associated control when activated."
        },

        {
            question: "Why is placeholder text not a replacement for a label?",

            answer:
                "Placeholder text disappears when the user enters a value and is intended as a hint rather than the control's primary name."
        },

        {
            question: "What is the difference between id and name in a form?",

            answer:
                "<code>id</code> identifies an element in the document and can connect a label to it. <code>name</code> identifies the field when form data is submitted."
        },

        {
            question: "Why should radio buttons share the same name?",

            answer:
                "Radio buttons with the same name form one logical selection group, allowing the user to choose one option from that group."
        },

        {
            question: "Why is client-side validation not enough?",

            answer:
                "Client-side validation can be bypassed or modified. The server must independently validate incoming data before using or storing it."
        },

        {
            question: "What is the difference between a button and an anchor?",

            answer:
                "An anchor normally represents navigation to a URL or resource. A button normally performs an action such as submitting a form, opening a menu or triggering JavaScript."
        },

        {
            question: "What does aria-describedby do?",

            answer:
                "It associates additional descriptive text with a control so that assistive technology can expose that information along with the control."
        },

        {
            question: "Why is a native button usually better than div role=\"button\"?",

            answer:
                "A native button already provides semantics, keyboard interaction and browser behaviour. A custom role does not automatically reproduce all of that behaviour."
        },

        {
            question: "What is a visible focus indicator?",

            answer:
                "It is a visual indication showing which interactive element currently has keyboard focus."
        },

        {
            question: "What is the purpose of fieldset and legend?",

            answer:
                "<code>fieldset</code> groups related controls and <code>legend</code> provides the group's semantic name or explanation."
        },

        {
            question: "Should the backend trust required or pattern validation from HTML?",

            answer:
                "No. HTML validation improves the user experience, but backend validation is still required because requests can be sent without using the browser interface."
        },

        {
            question: "Why should positive tabindex values generally be avoided?",

            answer:
                "They can create a custom focus order that becomes difficult to understand and maintain. Natural DOM order is usually more predictable."
        }
    ],

    /* =====================================================
       PRACTICE ARENA
       ===================================================== */

    practice: [

        {
            title: "Build a Student Registration Form",

            difficulty: "Easy",

            task:
                "Create a registration form containing full name, email, password, branch and a submit button. Use explicit labels and meaningful name attributes.",

            hints: [
                "Connect each label using for and id.",
                "Use type=\"email\" for the email field.",
                "Use type=\"password\" for the password."
            ]
        },

        {
            title: "Repair the Missing Label",

            difficulty: "Easy",

            task:
                "You receive an input with placeholder=\"Enter email\" but no label. Refactor it so the field has a proper accessible name.",

            hints: [
                "Create a visible label.",
                "Give the input an id.",
                "Match the label's for attribute to the input id."
            ]
        },

        {
            title: "CGPA Validator",

            difficulty: "Easy",

            task:
                "Create a CGPA field that accepts values from 0 to 10 with up to two decimal places.",

            hints: [
                "Use type=\"number\".",
                "Use min and max.",
                "Use step=\"0.01\"."
            ]
        },

        {
            title: "Radio Group Repair",

            difficulty: "Easy",

            task:
                "Build a preferred-learning-mode group containing Online, Classroom and Hybrid. Only one option should be selectable.",

            hints: [
                "Use radio inputs.",
                "Give all three inputs the same name.",
                "Use fieldset and legend."
            ]
        },

        {
            title: "Accessible Feedback Form",

            difficulty: "Medium",

            task:
                "Create a feedback form with rating, subject and multi-line comments. Group the rating choices semantically.",

            hints: [
                "Use radio buttons for one rating.",
                "Use textarea for comments.",
                "Give the rating group a legend."
            ]
        },

        {
            title: "Keyboard-Only Audit",

            difficulty: "Medium",

            task:
                "Build a form and test it without a mouse. Record the focus order from the first field to the submit button.",

            hints: [
                "Use the Tab key.",
                "Check whether the order follows the visual reading order.",
                "Make sure focus remains visible."
            ]
        },

        {
            title: "Accessible Error Message",

            difficulty: "Medium",

            task:
                "Design a password field with help text explaining the minimum length and an error message for an invalid value.",

            hints: [
                "Use aria-describedby.",
                "Use aria-invalid when the field is invalid.",
                "Explain how the user can fix the problem."
            ]
        },

        {
            title: "Placement Application Form",

            difficulty: "Medium",

            task:
                "Build a placement form containing name, email, CGPA, graduation year, branch, skills and resume information.",

            hints: [
                "Use appropriate input types.",
                "Use fieldset for related choices.",
                "Use native constraints wherever appropriate."
            ]
        },

        {
            title: "Link or Button?",

            difficulty: "Medium",

            task:
                "Choose the correct HTML element for these actions: Open Level 3, Submit Form, Copy Code, Visit GitHub and Open Menu.",

            hints: [
                "Navigation normally uses an anchor.",
                "Actions normally use buttons."
            ]
        },

        {
            title: "Form Accessibility Audit",

            difficulty: "Hard",

            task:
                "Audit a form containing missing labels, placeholder-only instructions, poor focus order, colour-only errors and div-based buttons. List every issue and propose a semantic correction.",

            hints: [
                "Inspect semantics first.",
                "Then inspect keyboard interaction.",
                "Then inspect validation and error communication."
            ]
        },

        {
            title: "Client vs Server Validation",

            difficulty: "Hard",

            task:
                "For a student registration API, list which validation should happen in the browser and which validation must happen again on the server.",

            hints: [
                "Browser validation improves immediate feedback.",
                "Server validation is the trust boundary.",
                "Business rules belong to application logic."
            ]
        },

        {
            title: "Build Without CSS",

            difficulty: "Placement",

            task:
                "Create a complete student profile form using HTML only. Disable CSS and verify whether the form remains understandable, keyboard usable and logically ordered.",

            hints: [
                "Check labels.",
                "Check heading and grouping structure.",
                "Check keyboard focus order."
            ]
        }
    ],

    /* =====================================================
       KNOWLEDGE CHECK
       ===================================================== */

    quiz: [

        {
            question: "What is the primary purpose of the form element?",

            options: [
                "To create CSS layouts",
                "To group controls for user input and submission",
                "To create database tables",
                "To execute JavaScript"
            ],

            answer: 1
        },

        {
            question: "Which attribute connects an explicit label to a form control?",

            options: [
                "name",
                "value",
                "for",
                "placeholder"
            ],

            answer: 2
        },

        {
            question: "Which attribute identifies a submitted form field?",

            options: [
                "name",
                "style",
                "class",
                "title"
            ],

            answer: 0
        },

        {
            question: "Why should placeholder text not be the only label?",

            options: [
                "It prevents CSS",
                "It disappears when the user enters a value",
                "It creates a database",
                "It disables JavaScript"
            ],

            answer: 1
        },

        {
            question: "Which input type is most appropriate for an email address?",

            options: [
                "text",
                "email",
                "number",
                "search"
            ],

            answer: 1
        },

        {
            question: "Which control normally allows one choice from a group?",

            options: [
                "Checkbox",
                "Radio button",
                "Textarea",
                "File input"
            ],

            answer: 1
        },

        {
            question: "What is the purpose of fieldset?",

            options: [
                "To create a database",
                "To group related form controls",
                "To submit JSON",
                "To hide labels"
            ],

            answer: 1
        },

        {
            question: "What does required provide?",

            options: [
                "A native validation constraint",
                "A server connection",
                "A CSS class",
                "A database index"
            ],

            answer: 0
        },

        {
            question: "Which attribute can provide additional descriptive text to a control?",

            options: [
                "aria-describedby",
                "aria-hidden",
                "tabindex",
                "autocomplete"
            ],

            answer: 0
        },

        {
            question: "What does aria-invalid communicate?",

            options: [
                "That the page has no CSS",
                "That a current value is invalid",
                "That a field is hidden",
                "That a form is submitted"
            ],

            answer: 1
        },

        {
            question: "Which is normally preferred for navigation?",

            options: [
                "div",
                "button without action",
                "a with href",
                "span"
            ],

            answer: 2
        },

        {
            question: "Which is normally preferred for submitting a form?",

            options: [
                "button type=\"submit\"",
                "div",
                "span",
                "h3"
            ],

            answer: 0
        },

        {
            question: "Why is server-side validation necessary?",

            options: [
                "Browsers cannot display forms",
                "Client-side validation can be bypassed",
                "CSS cannot validate forms",
                "HTML cannot contain inputs"
            ],

            answer: 1
        },

        {
            question: "What should usually determine keyboard focus order?",

            options: [
                "Random tabindex values",
                "Natural DOM order",
                "Font size",
                "CSS colour"
            ],

            answer: 1
        },

        {
            question: "Which is usually preferable to div role=\"button\"?",

            options: [
                "Clickable paragraph",
                "Native button",
                "Clickable heading",
                "Styled span"
            ],

            answer: 1
        }
    ],

    /* =====================================================
       GLOSSARY
       ===================================================== */

    glossary: [

        {
            term: "Form",
            definition:
                "A semantic HTML container for controls whose values can be submitted together."
        },

        {
            term: "Form control",
            definition:
                "An interactive control such as input, textarea, select or button."
        },

        {
            term: "Label",
            definition:
                "Text that identifies the purpose of a form control."
        },

        {
            term: "Fieldset",
            definition:
                "An element used to group related form controls."
        },

        {
            term: "Legend",
            definition:
                "The semantic caption or name of a fieldset."
        },

        {
            term: "Constraint validation",
            definition:
                "Browser-supported validation based on rules such as required, type, min, max and pattern."
        },

        {
            term: "Focus",
            definition:
                "The current interactive location receiving keyboard input."
        },

        {
            term: "Focus order",
            definition:
                "The sequence in which interactive elements receive keyboard focus."
        },

        {
            term: "ARIA",
            definition:
                "Accessible Rich Internet Applications semantics used when native HTML does not sufficiently communicate a dynamic interface."
        },

        {
            term: "Accessible name",
            definition:
                "The name exposed to assistive technology for identifying an interactive control."
        },

        {
            term: "aria-describedby",
            definition:
                "An ARIA attribute used to associate a control with additional descriptive content."
        },

        {
            term: "aria-invalid",
            definition:
                "An ARIA state that can communicate that the current value of a control is invalid."
        },

        {
            term: "Client-side validation",
            definition:
                "Validation performed in the browser before or during submission."
        },

        {
            term: "Server-side validation",
            definition:
                "Independent validation performed by the backend before trusting submitted data."
        },

        {
            term: "Native control",
            definition:
                "A built-in HTML control that already provides browser semantics and interaction behaviour."
        }
    ],

    /* =====================================================
       COMPLETION
       ===================================================== */

    completion: {

        title: "You can now build forms people can actually use.",

        message:
            "You now understand how semantic form controls, labels, validation, keyboard interaction and accessibility work together. These principles will continue into React forms, API validation and production MERN applications.",

        challenge:
            "Build a complete accessible Student Placement Profile form using HTML only. Include full name, college email, phone number, CGPA, branch, graduation year, preferred placement track, skills, career goal and resume information. Give every control a meaningful accessible name, use appropriate native input types, group related choices with fieldset and legend, add useful validation constraints, test the entire form using only the keyboard and explain which validation must happen again on the server."
    }
};
