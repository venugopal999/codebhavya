```javascript
"use strict";

/*
  CodeBhavya Full Stack
  LEVEL 11 — DOM & Events
  Rendering, event propagation and interface state
*/

window.FULLSTACK_LESSONS = window.FULLSTACK_LESSONS || {};

window.FULLSTACK_LESSONS[11] = {
  number: 11,
  title: "DOM & Events",
  kicker: "JavaScript Engineering · Level 11",
  subtitle: "Control browser content, respond to user actions and understand event propagation.",
  estimatedTime: "3–4 hours",
  difficulty: "Intermediate",

  hero: {
    badge: "LEVEL 11 · BROWSER INTERACTION",
    description:
      "The DOM connects JavaScript with the web page. In this level, you will learn how browsers " +
      "represent HTML as a tree, how JavaScript reads and changes that tree, and how events move " +
      "through the page. These concepts form the foundation of interactive web applications."
  },

  objectives: [
    "Understand the relationship between HTML, the DOM and JavaScript.",
    "Select and inspect DOM elements safely.",
    "Change text, attributes, classes and styles.",
    "Create, insert and remove elements dynamically.",
    "Respond to user interactions with event listeners.",
    "Understand event objects and common browser events.",
    "Explain preventDefault and event propagation.",
    "Understand bubbling, capturing and event delegation.",
    "Build dynamic interfaces using DOM state and application state.",
    "Debug browser interactions using DevTools."
  ],

  sections: [

    {
      number: 1,
      title: "What Is the DOM?",
      intro:
        "The DOM, or Document Object Model, is the browser's structured representation of an HTML document.",

      explanation:
        "When the browser loads HTML, it parses the document and creates a tree of objects. " +
        "JavaScript can use this tree to inspect and change the page.",

      flow: [
        "HTML source",
        "Browser parses HTML",
        "DOM tree is created",
        "JavaScript accesses DOM objects",
        "JavaScript changes DOM",
        "Browser updates the rendered page"
      ],

      code:
`<h1 id="title">Welcome</h1>

<script>
  const title = document.getElementById("title");
  title.textContent = "Welcome to CodeBhavya";
</script>`,

      output:
`The visible heading changes from:

Welcome

to:

Welcome to CodeBhavya`,

      realWorld:
        "Every interactive website uses this basic relationship between document structure and browser APIs.",

      keyIdea:
        "HTML describes the document, while the DOM is the browser's live object representation of that document."
    },

    {
      number: 2,
      title: "DOM Tree and Nodes",
      intro:
        "The DOM represents a document as a hierarchy of nodes.",

      explanation:
        "Elements, text and other document components become nodes in the DOM tree. Parent-child relationships allow JavaScript to navigate the document.",

      code:
`<main>
  <section>
    <h1>CodeBhavya</h1>
    <p>Learn JavaScript</p>
  </section>
</main>`,

      breakdown: [
        ["main", "Parent element"],
        ["section", "Child of main"],
        ["h1", "Child of section"],
        ["p", "Child of section"],
        ["text", "Text contained inside h1 and p"]
      ],

      architecture: [
        ["Document", "Root of the DOM"],
        ["main", "Application area"],
        ["section", "Content group"],
        ["h1 / p", "Content elements"],
        ["Text nodes", "Actual textual content"]
      ],

      keyIdea:
        "DOM relationships are hierarchical: parent, child and sibling."
    },

    {
      number: 3,
      title: "Selecting Elements",
      intro:
        "Before JavaScript can change a page, it normally needs to obtain a reference to the required element.",

      explanation:
        "Modern JavaScript commonly uses getElementById, querySelector and querySelectorAll.",

      code:
`const title = document.getElementById("title");

const button = document.querySelector(".save-button");

const cards = document.querySelectorAll(".card");

console.log(title);
console.log(button);
console.log(cards);`,

      methods: [
        ["getElementById()", "Selects one element using its id."],
        ["querySelector()", "Returns the first element matching a CSS selector."],
        ["querySelectorAll()", "Returns all elements matching a CSS selector."]
      ],

      commonMistake:
        "Using querySelector when you actually need all matching elements.",

      keyIdea:
        "DOM selection converts a document element into a JavaScript reference you can work with."
    },

    {
      number: 4,
      title: "Changing Text and Content",
      intro:
        "JavaScript can update what the user sees without reloading the page.",

      explanation:
        "textContent is generally the safest choice when you want to insert plain text.",

      code:
`const message = document.querySelector("#message");

message.textContent = "Registration successful!";`,

      output:
`Registration successful!`,

      comparison: [
        ["textContent", "Sets or reads text content."],
        ["innerHTML", "Parses and inserts HTML markup."]
      ],

      warning:
        "Do not use innerHTML with untrusted user input. Inserting untrusted HTML can create security vulnerabilities.",

      keyIdea:
        "Use textContent when you need text rather than HTML markup."
    },

    {
      number: 5,
      title: "Attributes and Properties",
      intro:
        "HTML elements expose attributes and JavaScript properties that can be inspected or changed.",

      code:
`const link = document.querySelector("#profile");

console.log(link.getAttribute("href"));

link.setAttribute("href", "/profile.html");

console.log(link.href);`,

      methods: [
        ["getAttribute()", "Reads an HTML attribute."],
        ["setAttribute()", "Creates or updates an HTML attribute."],
        ["removeAttribute()", "Removes an attribute."],
        ["hasAttribute()", "Checks whether an attribute exists."]
      ],

      points: [
        "HTML attributes are part of the document markup.",
        "DOM properties provide JavaScript access to element state.",
        "Some properties reflect or correspond to HTML attributes."
      ],

      keyIdea:
        "Attributes describe markup; DOM properties expose programmable element behaviour and state."
    },

    {
      number: 6,
      title: "Classes and Styles",
      intro:
        "Changing classes is usually preferable to manually changing many individual CSS properties.",

      code:
`const card = document.querySelector(".card");

card.classList.add("active");

card.classList.remove("hidden");

card.classList.toggle("selected");

console.log(card.classList.contains("active"));`,

      methods: [
        ["classList.add()", "Adds one or more classes."],
        ["classList.remove()", "Removes classes."],
        ["classList.toggle()", "Adds a class if absent or removes it if present."],
        ["classList.contains()", "Checks whether a class exists."]
      ],

      realWorld:
        "Menus, modals, tabs, alerts, dark mode controls and validation messages commonly use class changes.",

      keyIdea:
        "Let CSS handle presentation while JavaScript controls which state classes are active."
    },

    {
      number: 7,
      title: "Creating DOM Elements",
      intro:
        "JavaScript can create entirely new elements while the application is running.",

      code:
`const item = document.createElement("li");

item.textContent = "Learn DOM";

document.querySelector("#tasks").append(item);`,

      flow: [
        "Create element",
        "Set its content",
        "Configure attributes/classes",
        "Insert it into the document"
      ],

      methods: [
        ["createElement()", "Creates a new element object."],
        ["append()", "Adds nodes or text at the end."],
        ["prepend()", "Adds nodes or text at the beginning."],
        ["remove()", "Removes an element from its parent."]
      ],

      keyIdea:
        "Dynamic interfaces can construct and modify DOM nodes while the page is running."
    },

    {
      number: 8,
      title: "Rendering Dynamic Lists",
      intro:
        "A common application task is converting an array of data into visible DOM elements.",

      code:
`const courses = ["C", "DSA", "Python"];

const list = document.querySelector("#courses");

courses.forEach(course => {
  const item = document.createElement("li");
  item.textContent = course;
  list.append(item);
});`,

      output:
`• C
• DSA
• Python`,

      breakdown: [
        ["Data", "courses array contains the source data."],
        ["Iteration", "forEach visits every course."],
        ["Creation", "A new li is created for each item."],
        ["Content", "textContent receives the course name."],
        ["Rendering", "The item is appended to the list."]
      ],

      realWorld:
        "Product lists, student lists, course cards and search results can all be rendered using this pattern.",

      keyIdea:
        "A UI list is often a visual representation of an underlying data collection."
    },

    {
      number: 9,
      title: "Event Listeners",
      intro:
        "Events allow JavaScript to respond when users interact with the browser.",

      explanation:
        "addEventListener registers a function that the browser can execute when a specified event occurs.",

      code:
`const button = document.querySelector("#save");

button.addEventListener("click", () => {
  console.log("Save button clicked");
});`,

      methods: [
        ["click", "Mouse or pointer activation of a clickable element."],
        ["input", "Value changes while the user is entering text."],
        ["change", "A control's committed value changes."],
        ["submit", "A form is submitted."],
        ["keydown", "A keyboard key is pressed."],
        ["focus", "An element receives focus."],
        ["blur", "An element loses focus."]
      ],

      warning:
        "Avoid placing large amounts of application logic directly inside event handlers. Keep handlers focused and delegate reusable work to functions.",

      keyIdea:
        "An event listener connects a browser event to JavaScript behaviour."
    },

    {
      number: 10,
      title: "The Event Object",
      intro:
        "Browser event handlers receive an event object containing information about what happened.",

      code:
`const input = document.querySelector("#name");

input.addEventListener("input", event => {
  console.log(event.target.value);
});`,

      points: [
        "event describes the event.",
        "event.target is the element that initiated the event.",
        "event.currentTarget is the element whose listener is currently running.",
        "Keyboard events provide information such as the pressed key.",
        "Mouse events provide pointer-related information."
      ],

      keyIdea:
        "The event object gives your handler context about the interaction."
    },

    {
      number: 11,
      title: "Forms and preventDefault()",
      intro:
        "Forms have built-in browser behaviour. JavaScript can intercept that behaviour when an application needs custom handling.",

      code:
`const form = document.querySelector("#loginForm");

form.addEventListener("submit", event => {
  event.preventDefault();

  console.log("Form handled by JavaScript");
});`,

      explanation:
        "Calling preventDefault stops the browser's default action for that event. " +
        "It does not stop the event from propagating through the DOM.",

      commonMistake:
        "Thinking preventDefault stops event bubbling. It does not. Use stopPropagation only when controlling propagation is genuinely necessary.",

      realWorld:
        "Client-side form validation commonly prevents the default submission, validates data and then sends it through an API.",

      keyIdea:
        "preventDefault controls the browser's default action; it is different from controlling propagation."
    },

    {
      number: 12,
      title: "Event Bubbling",
      intro:
        "When an event occurs on a nested element, it can propagate from the target toward its ancestors.",

      code:
`<div id="card">
  <button id="buy">Buy</button>
</div>

<script>
  card.addEventListener("click", () => {
    console.log("Card clicked");
  });

  buy.addEventListener("click", () => {
    console.log("Button clicked");
  });
</script>`,

      output:
`Button clicked
Card clicked`,

      explanation:
        "The click begins at the button. After the target handler runs, the event bubbles toward the parent card.",

      flow: [
        "User clicks button",
        "Button becomes event target",
        "Button listener runs",
        "Event bubbles upward",
        "Card listener runs"
      ],

      keyIdea:
        "Bubbling allows an event that occurs on a child to be observed by ancestors."
    },

    {
      number: 13,
      title: "Capturing Phase",
      intro:
        "Event propagation can also travel downward toward the target during the capturing phase.",

      explanation:
        "The complete propagation model is commonly described as capturing, target and bubbling.",

      flow: [
        "Capturing: window → document → ancestors",
        "Target: event reaches the target",
        "Bubbling: target → ancestors → document → window"
      ],

      code:
`parent.addEventListener(
  "click",
  () => console.log("Parent capture"),
  true
);

button.addEventListener("click", () => {
  console.log("Button target");
});`,

      output:
`Parent capture
Button target`,

      points: [
        "The third addEventListener argument can enable capture.",
        "Most everyday event handlers use the default bubbling phase.",
        "Understanding capture helps with advanced event handling and debugging."
      ],

      keyIdea:
        "Capture travels toward the target; bubbling travels away from it."
    },

    {
      number: 14,
      title: "Event Propagation",
      intro:
        "Event propagation describes how an event travels through the DOM.",

      explanation:
        "The browser determines the propagation path before invoking relevant listeners. " +
        "Understanding that path makes nested interactive components easier to reason about.",

      architecture: [
        ["window", "Top-level browser context"],
        ["document", "Document root"],
        ["body", "Document body"],
        ["parent", "Ancestor element"],
        ["button", "Event target"]
      ],

      flow: [
        "Capture phase moves downward.",
        "Target phase reaches the clicked element.",
        "Bubble phase moves upward."
      ],

      warning:
        "Do not use stopPropagation everywhere. It can make components difficult to compose and debug.",

      keyIdea:
        "Event propagation is a predictable journey through the DOM tree."
    },

    {
      number: 15,
      title: "stopPropagation()",
      intro:
        "Sometimes an application needs to prevent an event from reaching another listener in the propagation path.",

      code:
`card.addEventListener("click", () => {
  console.log("Card clicked");
});

button.addEventListener("click", event => {
  event.stopPropagation();

  console.log("Button clicked");
});`,

      output:
`Button clicked`,

      explanation:
        "stopPropagation prevents the event from continuing through the propagation path.",

      warning:
        "Use it carefully. Stopping propagation can interfere with parent components, accessibility behaviours or application-level event handling.",

      keyIdea:
        "stopPropagation controls propagation; preventDefault controls the default browser action."
    },

    {
      number: 16,
      title: "Event Delegation",
      intro:
        "Event delegation uses bubbling to handle events from many child elements through one parent listener.",

      code:
`const list = document.querySelector("#courses");

list.addEventListener("click", event => {
  const button = event.target.closest("button");

  if (!button) return;

  console.log("Selected:", button.dataset.course);
});`,

      explanation:
        "Instead of adding separate listeners to every button, the parent handles clicks and determines which child initiated the event.",

      points: [
        "Uses event bubbling.",
        "Can reduce the number of event listeners.",
        "Works well for dynamic lists.",
        "New child elements can automatically participate.",
        "closest() can help locate the relevant ancestor."
      ],

      realWorld:
        "Shopping carts, task lists, tables and dynamically generated menus frequently benefit from event delegation.",

      keyIdea:
        "Delegate events when many similar dynamic elements share behaviour."
    },

    {
      number: 17,
      title: "Dynamic Elements and Delegation",
      intro:
        "A listener attached directly to an element does not automatically appear on elements created later.",

      code:
`const list = document.querySelector("#tasks");

list.addEventListener("click", event => {
  if (!event.target.matches(".delete")) return;

  event.target.closest("li").remove();
});`,

      explanation:
        "Because the listener belongs to the list, newly created delete buttons can still be handled through bubbling.",

      comparison: [
        ["Direct listener", "Best when a small number of stable elements need independent behaviour."],
        ["Delegated listener", "Useful for many or dynamically created child elements."]
      ],

      keyIdea:
        "Delegation is especially powerful when the DOM changes after initial page load."
    },

    {
      number: 18,
      title: "DOM State vs Application State",
      intro:
        "A page can contain visual state in the DOM and logical state in JavaScript data.",

      explanation:
        "For simple interfaces, DOM state may be enough. Larger applications benefit from keeping a clear source of truth in application data.",

      code:
`const state = {
  count: 0
};

function render() {
  document.querySelector("#count").textContent =
    state.count;
}

state.count++;
render();`,

      points: [
        "State represents current application information.",
        "Rendering converts state into visible UI.",
        "Events can update state.",
        "A render step can synchronize the DOM with state."
      ],

      flow: [
        "User interaction",
        "Event handler",
        "Update state",
        "Render UI",
        "User sees new state"
      ],

      keyIdea:
        "A predictable interface separates what the application knows from how that information is displayed."
    },

    {
      number: 19,
      title: "DOM Performance Basics",
      intro:
        "DOM operations can be more expensive than ordinary JavaScript calculations, especially when large amounts of UI are changed repeatedly.",

      points: [
        "Avoid unnecessary repeated DOM queries.",
        "Cache frequently used element references.",
        "Avoid rebuilding large sections when only a small part changed.",
        "Batch related DOM changes when practical.",
        "Use browser DevTools to investigate actual performance problems.",
        "Do not optimise blindly before measuring."
      ],

      code:
`const output = document.querySelector("#output");

for (let i = 1; i <= 3; i++) {
  const item = document.createElement("p");
  item.textContent = "Item " + i;
  output.append(item);
}`,

      realWorld:
        "Large tables, dashboards and frequently updated interfaces require careful DOM work.",

      keyIdea:
        "Measure real bottlenecks instead of assuming every DOM operation is slow."
    },

    {
      number: 20,
      title: "Debugging DOM and Events",
      intro:
        "Browser DevTools provides powerful tools for understanding DOM and event behaviour.",

      points: [
        "Inspect the Elements panel.",
        "Use the Console to inspect selected values.",
        "Set breakpoints inside event handlers.",
        "Inspect event objects.",
        "Check listeners attached to elements.",
        "Use the Network panel when events trigger API calls.",
        "Verify that the correct element is selected."
      ],

      code:
`const button = document.querySelector("#save");

console.log("Button:", button);

button.addEventListener("click", event => {
  console.log("Event:", event);
  console.log("Target:", event.target);
});`,

      commonMistake:
        "Debugging only the final visible result instead of checking whether the event fired, which element was selected and what state was available.",

      keyIdea:
        "Debug the complete chain: selection → event → handler → state → DOM update."
    },

    {
      number: 21,
      title: "Building Interactive Components",
      intro:
        "The concepts in this level combine into reusable interface patterns.",

      example:
        {
          label: "Simple task component",
          code:
`const state = {
  tasks: ["Learn DOM", "Practice Events"]
};

function renderTasks() {
  const list = document.querySelector("#tasks");

  list.textContent = "";

  state.tasks.forEach(task => {
    const item = document.createElement("li");
    item.textContent = task;
    list.append(item);
  });
}

renderTasks();`,
          output:
`Learn DOM
Practice Events`
        },

      flow: [
        "Keep application data in state.",
        "Render state into DOM elements.",
        "Listen for user events.",
        "Update state.",
        "Render the new state."
      ],

      realWorld:
        "This pattern is a small version of the state-driven UI model that becomes much more powerful when you learn React.",

      keyIdea:
        "DOM programming teaches the fundamental ideas that modern UI libraries build upon."
    },

    {
      number: 22,
      title: "Choosing the Right Event Strategy",
      intro:
        "Professional browser code benefits from deliberate event design.",

      comparison: [
        ["One stable button", "Direct click listener"],
        ["Many dynamic buttons", "Consider event delegation"],
        ["Form submission", "Listen to submit and validate"],
        ["Live text input", "Use input"],
        ["Committed control value", "Use change"],
        ["Need to stop browser default", "preventDefault()"],
        ["Need to stop propagation", "stopPropagation() — use carefully"]
      ],

      warning:
        "Do not automatically use stopPropagation or preventDefault. Use them only when the application behaviour requires it.",

      keyIdea:
        "Event handling should be driven by application behaviour, not by memorised snippets."
    }

  ],

  visualizer: {
    title: "DOM Rendering Visualizer",
    description:
      "Follow how HTML becomes a DOM tree and how JavaScript changes what the user sees.",
    steps: [
      {
        title: "HTML source",
        operation: "Browser receives document",
        detail:
          '<button id="save">Save</button> exists in the HTML.'
      },
      {
        title: "DOM creation",
        operation: "Browser parses HTML",
        detail:
          "The browser creates a document tree containing a button element."
      },
      {
        title: "JavaScript selection",
        operation: 'document.querySelector("#save")',
        detail:
          "JavaScript receives a reference to the button DOM element."
      },
      {
        title: "Event registration",
        operation: 'addEventListener("click", handler)',
        detail:
          "The browser is instructed to run the handler when the button is clicked."
      },
      {
        title: "User interaction",
        operation: "click",
        detail:
          "The browser creates a click event and starts event propagation."
      },
      {
        title: "DOM update",
        operation: "element.textContent = ...",
        detail:
          "JavaScript changes the DOM, and the browser updates the rendered interface."
      }
    ]
  },

  trace: {
    title: "Event Propagation Tracer",
    lines: [
      {
        line: 1,
        code: 'const card = document.querySelector("#card");'
      },
      {
        line: 2,
        code: 'const button = document.querySelector("#buy");'
      },
      {
        line: 3,
        code: 'card.addEventListener("click", () => {'
      },
      {
        line: 4,
        code: '  console.log("Card clicked");'
      },
      {
        line: 5,
        code: '});'
      },
      {
        line: 6,
        code: 'button.addEventListener("click", () => {'
      },
      {
        line: 7,
        code: '  console.log("Button clicked");'
      },
      {
        line: 8,
        code: '});'
      },
      {
        line: 9,
        code: '// User clicks button'
      }
    ],

    steps: [
      {
        line: 1,
        title: "Select card",
        detail:
          "JavaScript stores a reference to the parent card element."
      },
      {
        line: 2,
        title: "Select button",
        detail:
          "JavaScript stores a reference to the nested button."
      },
      {
        line: 3,
        title: "Register card listener",
        detail:
          "The card is prepared to respond to click events."
      },
      {
        line: 6,
        title: "Register button listener",
        detail:
          "The button receives its own click listener."
      },
      {
        line: 9,
        title: "User clicks button",
        detail:
          "The button becomes the event target."
      },
      {
        line: 7,
        title: "Target handler",
        detail:
          'The button handler runs and prints "Button clicked".'
      },
      {
        line: 4,
        title: "Bubble to card",
        detail:
          'The click bubbles upward and the card handler prints "Card clicked".'
      }
    ]
  },

  revision: [
    ["DOM", "The browser's object representation of an HTML document."],
    ["Node", "A unit in the DOM tree such as an element or text node."],
    ["querySelector()", "Returns the first element matching a CSS selector."],
    ["querySelectorAll()", "Returns all elements matching a CSS selector."],
    ["textContent", "Reads or sets plain text content."],
    ["classList", "Provides methods for managing an element's CSS classes."],
    ["Event", "A browser notification that something happened."],
    ["Event listener", "A function registered to respond to an event."],
    ["event.target", "The element where the event originated."],
    ["event.currentTarget", "The element whose listener is currently executing."],
    ["preventDefault()", "Prevents an event's default browser action."],
    ["stopPropagation()", "Stops an event from continuing through its propagation path."],
    ["Bubbling", "Event propagation from target toward ancestors."],
    ["Capturing", "Event propagation from ancestors toward the target."],
    ["Event delegation", "Handling child events through a common ancestor listener."],
    ["State", "Information representing the current condition of an application."]
  ],

  interview: [
    {
      question: "What is the DOM?",
      answer:
        "The DOM is the browser's object representation of an HTML document, arranged as a tree that JavaScript can access and modify."
    },
    {
      question: "Is the DOM the same thing as HTML?",
      answer:
        "No. HTML is the document markup, while the DOM is the live object model created by the browser from that markup."
    },
    {
      question: "What does querySelector() return?",
      answer:
        "It returns the first element matching the supplied CSS selector, or null if no matching element exists."
    },
    {
      question: "What is the difference between querySelector() and querySelectorAll()?",
      answer:
        "querySelector returns the first matching element, while querySelectorAll returns all matching elements."
    },
    {
      question: "What is textContent used for?",
      answer:
        "It reads or sets the plain text content of a DOM element."
    },
    {
      question: "Why can innerHTML be dangerous?",
      answer:
        "Using innerHTML with untrusted content can allow malicious HTML or script injection, creating security vulnerabilities."
    },
    {
      question: "What does addEventListener() do?",
      answer:
        "It registers a function that the browser should execute when a specified event occurs."
    },
    {
      question: "What is an event object?",
      answer:
        "It contains information about the event, including its target and other event-specific details."
    },
    {
      question: "What is event.target?",
      answer:
        "It identifies the element on which the event originated."
    },
    {
      question: "What is event.currentTarget?",
      answer:
        "It identifies the element whose event listener is currently executing."
    },
    {
      question: "What does preventDefault() do?",
      answer:
        "It prevents the browser's default action for an event."
    },
    {
      question: "Does preventDefault() stop event bubbling?",
      answer:
        "No. preventDefault controls default browser behaviour; it does not stop event propagation."
    },
    {
      question: "What is event bubbling?",
      answer:
        "It is propagation of an event from the target element toward its ancestors."
    },
    {
      question: "What is event capturing?",
      answer:
        "It is the propagation phase where an event travels from ancestors toward the target."
    },
    {
      question: "What does stopPropagation() do?",
      answer:
        "It prevents an event from continuing through the propagation path."
    },
    {
      question: "What is event delegation?",
      answer:
        "It is a technique where a parent listener handles events originating from its child elements."
    },
    {
      question: "Why is event delegation useful for dynamic lists?",
      answer:
        "A listener on the stable parent can handle events from child elements created later."
    },
    {
      question: "What is the difference between DOM state and application state?",
      answer:
        "DOM state describes what is currently represented in the page, while application state represents the logical data and conditions of the application."
    },
    {
      question: "Why should JavaScript often change classes instead of many inline styles?",
      answer:
        "Classes keep presentation in CSS and allow JavaScript to control state without mixing large amounts of styling logic into JavaScript."
    },
    {
      question: "How would you handle a form without allowing the browser to reload the page?",
      answer:
        "Listen for the submit event and call event.preventDefault(), then perform validation and application-specific processing."
    }
  ],

  practice: [
    {
      title: "DOM Selector Lab",
      description:
        "Create a page containing headings, paragraphs, buttons and cards. Use getElementById, querySelector and querySelectorAll to select different elements."
    },
    {
      title: "Message Changer",
      description:
        "Create a button that changes a paragraph's textContent every time it is clicked."
    },
    {
      title: "Theme Toggle",
      description:
        "Create a button that toggles a dark-mode class on the document body using classList.toggle()."
    },
    {
      title: "Dynamic List",
      description:
        "Store five course names in an array and dynamically create li elements for every course."
    },
    {
      title: "Counter App",
      description:
        "Build a counter with Increment, Decrement and Reset buttons. Keep the count in JavaScript state and render it into the DOM."
    },
    {
      title: "Form Validator",
      description:
        "Create a registration form. Prevent default submission, validate required fields and display validation messages in the page."
    },
    {
      title: "Event Propagation Lab",
      description:
        "Create nested parent, child and button elements. Attach listeners and observe the order in which bubbling and capturing handlers execute."
    },
    {
      title: "Event Delegation",
      description:
        "Create a dynamic task list with delete buttons. Use one listener on the list to handle deletion for all current and future tasks."
    },
    {
      title: "Live Search",
      description:
        "Create a list of courses and a search input. Use the input event to filter visible courses as the user types."
    },
    {
      title: "Student Dashboard",
      description:
        "Store student objects in an array and render student cards dynamically. Add a button to filter the display to students above a selected CGPA."
    }
  ],

  quiz: [
    {
      question: "What does DOM stand for?",
      options: [
        "Document Object Model",
        "Data Object Method",
        "Document Order Manager",
        "Dynamic Object Model"
      ],
      answer: 0
    },
    {
      question: "Which method returns the first element matching a CSS selector?",
      options: [
        "querySelector()",
        "querySelectorAll()",
        "getElements()",
        "select()"
      ],
      answer: 0
    },
    {
      question: "Which property is commonly used to safely set plain text?",
      options: [
        "innerHTML",
        "textContent",
        "htmlText",
        "writeText"
      ],
      answer: 1
    },
    {
      question: "Which method adds an event listener?",
      options: [
        "addEventListener()",
        "listen()",
        "onEvent()",
        "attachEventListenerNow()"
      ],
      answer: 0
    },
    {
      question: "What is event.target?",
      options: [
        "The document",
        "The element where the event originated",
        "The browser window",
        "The event handler function"
      ],
      answer: 1
    },
    {
      question: "What does preventDefault() do?",
      options: [
        "Stops JavaScript execution",
        "Removes the event",
        "Prevents the default browser action",
        "Stops all event propagation"
      ],
      answer: 2
    },
    {
      question: "Which direction does bubbling travel?",
      options: [
        "Ancestor to target",
        "Target toward ancestors",
        "Window to browser",
        "Document to window only"
      ],
      answer: 1
    },
    {
      question: "Which phase travels toward the target?",
      options: [
        "Bubbling",
        "Capturing",
        "Rendering",
        "Delegation"
      ],
      answer: 1
    },
    {
      question: "What does stopPropagation() control?",
      options: [
        "Default form submission",
        "CSS rendering",
        "Event propagation",
        "DOM creation"
      ],
      answer: 2
    },
    {
      question: "What is event delegation?",
      options: [
        "Deleting events",
        "Handling child events through a parent listener",
        "Preventing every event",
        "Creating browser events manually"
      ],
      answer: 1
    },
    {
      question: "Which method adds a CSS class?",
      options: [
        "classList.add()",
        "class.add()",
        "addClassName()",
        "style.add()"
      ],
      answer: 0
    },
    {
      question: "Which event is generally suitable for a form submission?",
      options: [
        "click",
        "input",
        "submit",
        "load"
      ],
      answer: 2
    }
  ],

  glossary: [
    {
      term: "DOM",
      definition:
        "The browser's live object representation of an HTML document."
    },
    {
      term: "Element",
      definition:
        "A DOM node representing an HTML element."
    },
    {
      term: "Node",
      definition:
        "A unit in the DOM tree, such as an element or text node."
    },
    {
      term: "Selector",
      definition:
        "A CSS-style expression used to identify DOM elements."
    },
    {
      term: "Event",
      definition:
        "A notification that something happened in the browser."
    },
    {
      term: "Listener",
      definition:
        "A function registered to respond to an event."
    },
    {
      term: "Target",
      definition:
        "The element where an event originated."
    },
    {
      term: "Bubbling",
      definition:
        "Propagation from the event target toward ancestor elements."
    },
    {
      term: "Capturing",
      definition:
        "Propagation from ancestors toward the event target."
    },
    {
      term: "Delegation",
      definition:
        "Handling events for child elements through a parent listener."
    },
    {
      term: "preventDefault",
      definition:
        "A method that prevents an event's default browser behaviour."
    },
    {
      term: "stopPropagation",
      definition:
        "A method that stops an event from continuing through its propagation path."
    },
    {
      term: "State",
      definition:
        "Information describing the current condition of an application."
    },
    {
      term: "Rendering",
      definition:
        "The process of turning application data or DOM changes into visible interface output."
    }
  ],

  completion: {
    title: "Level 11 Complete — Make the Browser Respond",
    message:
      "You can now connect JavaScript with the browser DOM, create dynamic interfaces, handle user events " +
      "and reason about event propagation. These concepts prepare you directly for asynchronous APIs and modern UI frameworks.",

    challenge:
      "Build a Student Management Interface. Store at least 8 students as JavaScript objects. " +
      "Render them dynamically into cards or a table. Add a search box, a branch filter, a CGPA filter, " +
      "and a delete action using event delegation. Add a form for creating a new student, prevent the default " +
      "submission, validate the input and update the displayed list without reloading the page."
  },

  takeaway:
    "The DOM connects JavaScript to the browser interface. Events connect user actions to application behaviour. " +
    "Master selection, rendering, event handling, propagation and delegation now, because these same mental models " +
    "will make React and asynchronous browser programming much easier in the next levels."
};

console.log(
  "CodeBhavya Full Stack Level 11 loaded: DOM & Events"
);
```
