"use strict";

/* =========================================================
   CODEBHAVYA FULL STACK / MERN
   LEVEL 18 — REACT PERFORMANCE & TESTING
   ========================================================= */

window.FULLSTACK_LESSONS = window.FULLSTACK_LESSONS || {};

window.FULLSTACK_LESSONS[18] = {

    n: 18,

    kicker: "PART 3 • REACT • LEVEL 18",

    title: "React Performance & Testing",

    summary:
        "Learn how React renders, why components re-render, how memoization works, how to avoid unnecessary work, and how to test React applications from the user's point of view.",

    duration: "Estimated learning time: 3–4 hours",

    difficulty: "Intermediate",

    concepts: 14,


    /* =====================================================
       LEARNING OUTCOMES
       ===================================================== */

    outcomes: [

        "Explain what causes a React component to render again.",

        "Distinguish rendering from DOM updates.",

        "Explain parent and child re-render behaviour.",

        "Understand referential equality for objects and functions.",

        "Use React.memo when a component benefits from memoization.",

        "Use useMemo for expensive derived calculations.",

        "Use useCallback when stable function references are useful.",

        "Understand why memoization should not be added everywhere.",

        "Use stable keys correctly when rendering lists.",

        "Explain lazy loading and Suspense.",

        "Identify practical performance problems in React applications.",

        "Understand the role of React DevTools Profiler.",

        "Write user-focused tests with React Testing Library.",

        "Test loading, success, error and interaction states."

    ],


    /* =====================================================
       MAIN CONCEPTS
       ===================================================== */

    sections: [

        {
            number: 1,

            title: "Rendering Is Not the Same as Updating the DOM",

            intro:
                "One of the most important React performance ideas is understanding what a render actually means.",

            points: [

                "<strong>Rendering</strong> means React calculates what the UI should look like.",

                "React can render a component without changing every corresponding DOM node.",

                "After rendering, React compares the new result with the previous result and commits only the necessary DOM changes.",

                "Therefore, saying 'the component rendered' does not automatically mean 'the browser rebuilt everything'."

            ],

            keyIdea:
                "A React render is a calculation. DOM changes happen later during the commit phase when React determines that an actual update is required.",

            comparison: {

                headers: [

                    "Stage",

                    "What happens",

                    "Example"

                ],

                rows: [

                    [

                        "State update",

                        "Something requests new UI state",

                        "setCount(2)"

                    ],

                    [

                        "Render",

                        "React calculates the next UI result",

                        "Component function runs"

                    ],

                    [

                        "Comparison",

                        "React compares the new result with the previous result",

                        "Identify changed values"

                    ],

                    [

                        "Commit",

                        "Required DOM changes are applied",

                        "Update text node"

                    ]

                ]

            },

            flow: [

                "State or props change",

                "React schedules work",

                "Component renders",

                "React calculates the next UI",

                "React compares results",

                "Required DOM changes are committed",

                "Browser displays the updated UI"

            ]

        },


        {
            number: 2,

            title: "What Causes a Component to Re-render?",

            intro:
                "A component can render again for several reasons. Understanding these triggers is more useful than memorizing optimization tricks.",

            points: [

                "A component normally renders again when its own state changes.",

                "A component can render again when its parent renders.",

                "A component can render again when its props change.",

                "Context updates can cause consumers of that context to render again.",

                "External state libraries may introduce their own subscription-based update behaviour."

            ],

            example: {

                title: "Simple State Update",

                text:
                    "Clicking the button updates count. The state update causes App to render again.",

                code:
`function App() {
    const [count, setCount] = useState(0);

    return (
        <button onClick={() => setCount(count + 1)}>
            Count: {count}
        </button>
    );
}`

            },

            commonMistake:
                "A re-render is not automatically a performance bug. Rendering is normal React behaviour. The real question is whether the resulting work is unnecessarily expensive."

        },


        {
            number: 3,

            title: "Parent and Child Rendering",

            intro:
                "A parent rendering can cause its child components to render as part of the new component tree.",

            points: [

                "When a parent component renders, React normally evaluates its child elements again.",

                "This does not necessarily mean every child causes expensive DOM work.",

                "React.memo can allow a child component to skip rendering when its props are considered equal.",

                "Memoization is most useful when the skipped work is meaningful."

            ],

            code:
`function Child({ name }) {
    console.log("Child rendered");

    return <p>Hello {name}</p>;
}

function Parent() {
    const [count, setCount] = useState(0);

    return (
        <>
            <button onClick={() => setCount(count + 1)}>
                {count}
            </button>

            <Child name="Anita" />
        </>
    );
}`,

            keyIdea:
                "A parent state update can cause Child to render again even when Child's visible data has not changed.",

            warning:
                "Do not interpret every console.log('rendered') as a problem. First determine whether the rendering is expensive or actually affecting user experience."

        },


        {
            number: 4,

            title: "React.memo",

            intro:
                "React.memo allows React to skip rendering a function component when its props have not meaningfully changed according to its comparison.",

            points: [

                "<code>React.memo(Component)</code> returns a memoized version of a component.",

                "The default comparison is based on shallow comparison of props.",

                "Primitive values such as strings and numbers are straightforward to compare.",

                "Objects, arrays and functions are references, so creating new ones can defeat memoization.",

                "React.memo is an optimization, not a correctness requirement."

            ],

            code:
`const ProductRow = React.memo(function ProductRow({ product }) {
    console.log("ProductRow rendered");

    return (
        <li>
            {product.name} — ₹{product.price}
        </li>
    );
});`,

            comparison: {

                headers: [

                    "Prop",

                    "Example",

                    "Reference behaviour"

                ],

                rows: [

                    [

                        "Number",

                        "price={500}",

                        "Primitive value"

                    ],

                    [

                        "String",

                        "name=\"Laptop\"", 

                        "Primitive value"

                    ],

                    [

                        "Object",

                        "product={{ name: \"Laptop\" }}",

                        "New object reference"

                    ],

                    [

                        "Function",

                        "onSelect={() => ...}",

                        "New function reference"

                    ]

                ]

            },

            commonMistake:
                "Wrapping every component with React.memo does not automatically make an application faster. It adds comparison work and can make code harder to reason about."

        },


        {
            number: 5,

            title: "Referential Equality",

            intro:
                "JavaScript compares objects, arrays and functions by reference rather than by their contents.",

            points: [

                "Two separately created objects can contain identical data but still have different references.",

                "React.memo can therefore see two object props as different even when their contents look identical.",

                "The same idea applies to arrays and functions.",

                "This is why useMemo and useCallback can sometimes be useful together with React.memo."

            ],

            code:
`const first = { name: "Anita" };

const second = { name: "Anita" };

console.log(first === second);
// false

const same = first;

console.log(first === same);
// true`,

            keyIdea:
                "Same-looking object does not mean same object reference.",

            flow: [

                "Component renders",

                "New object is created",

                "Object reference changes",

                "Memoized child receives a different reference",

                "Shallow comparison detects a difference",

                "Child may render again"

            ]

        },


        {
            number: 6,

            title: "useMemo — Cache an Expensive Calculation",

            intro:
                "useMemo can cache the result of a calculation and recompute it only when its dependencies change.",

            points: [

                "useMemo returns a memoized value.",

                "The calculation function runs during rendering when React needs to calculate the memoized value.",

                "Dependencies determine when React should calculate it again.",

                "It is useful for genuinely expensive derived calculations.",

                "It should not be added simply because a value is calculated."

            ],

            code:
`const filteredProducts = useMemo(() => {

    return products.filter(product =>
        product.name
            .toLowerCase()
            .includes(search.toLowerCase())
    );

}, [products, search]);`,

            comparison: {

                headers: [

                    "Without useMemo",

                    "With useMemo"

                ],

                rows: [

                    [

                        "Calculation may run on every render",

                        "Calculation can be reused while dependencies remain unchanged"

                    ],

                    [

                        "Simple implementation",

                        "More moving parts"

                    ],

                    [

                        "Often fine for cheap calculations",

                        "Useful when calculation is genuinely expensive"

                    ]

                ]

            },

            warning:
                "Memoization itself has a cost. Always ask whether the saved calculation is expensive enough to justify caching."

        },


        {
            number: 7,

            title: "useCallback — Stable Function References",

            intro:
                "Every time a component renders, functions declared inside it can receive a new reference.",

            points: [

                "useCallback can preserve a function reference between renders until its dependencies change.",

                "It is especially useful when passing callbacks to memoized children.",

                "The function still executes normally when called.",

                "useCallback does not magically make the function faster."

            ],

            code:
`const handleSelect = useCallback((id) => {
    setSelectedId(id);
}, []);

return (
    <ProductList
        onSelect={handleSelect}
    />
);`,

            keyIdea:
                "useCallback is primarily about function identity, not function execution speed.",

            commonMistake:
                "Do not use useCallback for every event handler automatically. Use it when stable identity has a practical benefit."

        },


        {
            number: 8,

            title: "React.memo + useMemo + useCallback Together",

            intro:
                "These tools solve related but different problems.",

            architecture: [

                {
                    title: "Parent",

                    items: [

                        "Owns application state",

                        "May render frequently",

                        "Creates derived values and callbacks"

                    ]

                },

                {
                    title: "useMemo",

                    items: [

                        "Caches expensive derived values",

                        "Depends on selected dependencies"

                    ]

                },

                {
                    title: "useCallback",

                    items: [

                        "Keeps callback reference stable",

                        "Depends on selected dependencies"

                    ]

                },

                {
                    title: "React.memo",

                    items: [

                        "Allows a child to skip rendering when props are equal",

                        "Uses shallow prop comparison by default"

                    ]

                }

            ],

            code:
`const ProductRow = React.memo(function ProductRow({
    product,
    onSelect
}) {
    return (
        <button onClick={() => onSelect(product.id)}>
            {product.name}
        </button>
    );
});

function ProductList({ products }) {

    const visibleProducts = useMemo(
        () => products.filter(product => product.active),
        [products]
    );

    const handleSelect = useCallback((id) => {
        console.log("Selected:", id);
    }, []);

    return visibleProducts.map(product => (
        <ProductRow
            key={product.id}
            product={product}
            onSelect={handleSelect}
        />
    ));
}`,

            keyIdea:
                "Optimization tools work best as a system: memoize expensive values, stabilize references when useful, and memoize components when skipped rendering has measurable value."

        },


        {
            number: 9,

            title: "Stable Keys in Lists",

            intro:
                "Keys help React identify which list items correspond to which previous items.",

            points: [

                "Keys should be stable and unique among siblings.",

                "A database ID is usually a good key.",

                "Using an array index as a key can create incorrect identity when items are inserted, removed or reordered.",

                "Keys are about identity, not simply suppressing a warning."

            ],

            code:
`{students.map(student => (
    <StudentCard
        key={student.id}
        student={student}
    />
))}`,

            comparison: {

                headers: [

                    "Key choice",

                    "Example",

                    "Recommendation"

                ],

                rows: [

                    [

                        "Stable ID",

                        "key={student.id}",

                        "Preferred when available"

                    ],

                    [

                        "Array index",

                        "key={index}",

                        "Can be problematic when order changes"

                    ],

                    [

                        "Random value",

                        "key={Math.random()}",

                        "Avoid"

                    ]

                ]

            },

            warning:
                "Changing keys can make React treat an existing component as a completely different component, which can reset local state."

        },


        {
            number: 10,

            title: "Code Splitting, lazy and Suspense",

            intro:
                "Large applications do not always need to download every JavaScript module before the user can see the first useful screen.",

            points: [

                "Code splitting divides application code into separately loaded chunks.",

                "React.lazy can load a component dynamically.",

                "Suspense provides fallback UI while the lazy component is loading.",

                "Route-level code splitting is a common practical use case."

            ],

            code:
`const ReportsPage = React.lazy(
    () => import("./ReportsPage")
);

function App() {
    return (
        <Suspense fallback={<p>Loading reports...</p>}>
            <ReportsPage />
        </Suspense>
    );
}`,

            flow: [

                "User requests application",

                "Initial bundle loads",

                "User navigates to Reports",

                "Reports chunk is requested",

                "Suspense shows fallback",

                "Chunk finishes loading",

                "ReportsPage renders"

            ],

            keyIdea:
                "Code splitting can reduce the amount of JavaScript that must be loaded before a particular feature becomes usable."

        },


        {
            number: 11,

            title: "Measuring Performance Instead of Guessing",

            intro:
                "Performance optimization should begin with evidence.",

            points: [

                "React DevTools Profiler can help identify components that render and how much time they consume.",

                "Browser performance tools can reveal long tasks, network delays and rendering problems.",

                "A slow API is not necessarily a React rendering problem.",

                "A large image is not necessarily fixed by useMemo.",

                "A component that renders often is not automatically slow."

            ],

            architecture: [

                {
                    title: "Observe",

                    items: [

                        "What feels slow?",

                        "Which interaction is affected?",

                        "How often does the work happen?"

                    ]

                },

                {
                    title: "Measure",

                    items: [

                        "Profiler",

                        "Browser DevTools",

                        "Network timing",

                        "Performance traces"

                    ]

                },

                {
                    title: "Identify",

                    items: [

                        "Expensive calculation",

                        "Large render tree",

                        "Unstable references",

                        "Network bottleneck"

                    ]

                },

                {

                    title: "Optimize",

                    items: [

                        "Memoization",

                        "Code splitting",

                        "Data strategy",

                        "Component restructuring"

                    ]

                }

            ],

            keyIdea:
                "Measure first. Optimize the actual bottleneck rather than applying React optimization hooks everywhere."

        },


        {
            number: 12,

            title: "Testing React from the User's Point of View",

            intro:
                "Good React tests should verify behaviour that matters to users instead of depending heavily on implementation details.",

            points: [

                "React Testing Library encourages testing through accessible user-facing behaviour.",

                "Tests can find elements by role, label, text and other user-relevant queries.",

                "A test should usually describe what the user can observe or do.",

                "Implementation details such as internal component state are usually less important than visible behaviour."

            ],

            example: {

                title: "User-Focused Test",

                text:
                    "The test verifies that clicking the button changes the visible result.",

                code:
`render(<Counter />);

const button = screen.getByRole(
    "button",
    { name: /increment/i }
);

await user.click(button);

expect(
    screen.getByText("Count: 1")
).toBeInTheDocument();`

            },

            keyIdea:
                "Test what the user can observe and interact with."

        },


        {
            number: 13,

            title: "Testing Loading, Success and Error States",

            intro:
                "Real applications have multiple UI states. Testing only the successful response is not enough.",

            points: [

                "Loading state should provide appropriate feedback.",

                "Success state should display the expected data.",

                "Error state should communicate failure clearly.",

                "Empty state should be considered separately when the request succeeds but returns no records.",

                "Tests should cover meaningful user journeys."

            ],

            architecture: [

                {

                    title: "Loading",

                    items: [

                        "Show loading indicator",

                        "Prevent confusing blank screen"

                    ]

                },

                {

                    title: "Success",

                    items: [

                        "Display returned data",

                        "Allow normal interaction"

                    ]

                },

                {

                    title: "Empty",

                    items: [

                        "Explain that no records exist",

                        "Provide useful next action"

                    ]

                },

                {

                    title: "Error",

                    items: [

                        "Display understandable error",

                        "Offer retry or recovery when appropriate"

                    ]

                }

            ],

            flow: [

                "Render page",

                "Request starts",

                "Show loading UI",

                "Receive response",

                "Success → show data",

                "Empty → show empty state",

                "Failure → show error state"

            ]

        },


        {
            number: 14,

            title: "Integration Thinking and Testing Strategy",

            intro:
                "A production React application is more than isolated components. Components work together with routing, APIs, state and user interactions.",

            points: [

                "Unit-style tests can focus on small pieces of behaviour.",

                "Component tests can verify a component's user-visible interaction.",

                "Integration tests can verify several components working together.",

                "End-to-end tests can verify larger user journeys through the real application.",

                "Not every possible implementation detail needs a test."

            ],

            comparison: {

                headers: [

                    "Test level",

                    "Focus",

                    "Example"

                ],

                rows: [

                    [

                        "Unit",

                        "Small isolated logic",

                        "formatCurrency()"

                    ],

                    [

                        "Component",

                        "One component's UI behaviour",

                        "Counter button"

                    ],

                    [

                        "Integration",

                        "Several pieces working together",

                        "Search + list + filtering"

                    ],

                    [

                        "End-to-end",

                        "Complete user journey",

                        "Login → dashboard → create record"

                    ]

                ]

            },

            keyIdea:
                "Use different levels of testing to gain confidence without forcing every test to exercise the entire application."

        }

    ],


    /* =====================================================
       PREMIUM VISUALIZER
       ===================================================== */

    visualizer: {

        title: "React Render & Memoization Laboratory",

        description:
            "Follow what happens when a parent updates while a child receives either stable or changing props.",

        steps: [

            {
                title: "Initial Render",

                operation:
                    "App renders for the first time.",

                detail:
                    "React evaluates the component tree and creates the initial UI."
            },

            {
                title: "State Update",

                operation:
                    "setCount(count + 1)",

                detail:
                    "The parent state changes. React schedules another render."
            },

            {
                title: "Parent Renders",

                operation:
                    "Parent() runs again.",

                detail:
                    "The parent calculates its next UI result."
            },

            {
                title: "New Child Props",

                operation:
                    "product={{ name: \"Laptop\" }}",

                detail:
                    "A new object reference is created during the parent render."
            },

            {
                title: "Memo Comparison",

                operation:
                    "previousProduct !== nextProduct",

                detail:
                    "React.memo performs its prop comparison and sees a different object reference."
            },

            {
                title: "Child Renders",

                operation:
                    "ProductRow() runs again.",

                detail:
                    "The memoized child cannot skip this render because its object prop changed."
            },

            {
                title: "Stable Value",

                operation:
                    "useMemo(() => product, [])",

                detail:
                    "A stable reference can be reused when the dependencies have not changed."
            },

            {
                title: "Memo Can Skip",

                operation:
                    "previousProduct === nextProduct",

                detail:
                    "React.memo can now skip the child's render when the relevant props remain equal."
            },

            {
                title: "DOM Commit",

                operation:
                    "React applies required DOM changes.",

                detail:
                    "Only the necessary browser DOM updates are committed."
            },

            {
                title: "Performance Result",

                operation:
                    "Less unnecessary work",

                detail:
                    "The optimization is useful only when the saved rendering or calculation work matters."
            }

        ]

    },


    /* =====================================================
       PROGRAM TRACING
       ===================================================== */

    trace: {

        title: "Trace a React Performance Decision",

        lines: [

            {
                line: 1,
                code: "function ProductList({ products }) {"
            },

            {
                line: 2,
                code: "    const [count, setCount] = useState(0);"
            },

            {
                line: 3,
                code: "    const visible = useMemo(() => filter(products), [products]);"
            },

            {
                line: 4,
                code: "    const select = useCallback(id => console.log(id), []);"
            },

            {
                line: 5,
                code: "    return visible.map(product => ("
            },

            {
                line: 6,
                code: "        <ProductRow"
            },

            {
                line: 7,
                code: "            key={product.id}"
            },

            {
                line: 8,
                code: "            product={product}"
            },

            {
                line: 9,
                code: "            onSelect={select}"
            },

            {
                line: 10,
                code: "        />"
            },

            {
                line: 11,
                code: "    ));"
            },

            {
                line: 12,
                code: "}"
            }

        ],

        steps: [

            {
                line: 1,
                state: "Component",

                explain:
                    "React begins evaluating ProductList."
            },

            {
                line: 2,
                state: "State",

                explain:
                    "The component reads its local count state."
            },

            {
                line: 3,
                state: "Memoized calculation",

                explain:
                    "The visible product list is calculated only when products changes."
            },

            {
                line: 4,
                state: "Stable callback",

                explain:
                    "useCallback keeps the select function reference stable while its dependency list remains unchanged."
            },

            {
                line: 5,
                state: "List",

                explain:
                    "React begins creating elements for the visible products."
            },

            {
                line: 6,
                state: "Child",

                explain:
                    "A ProductRow element is prepared."
            },

            {
                line: 7,
                state: "Identity",

                explain:
                    "The product ID gives the child a stable key."
            },

            {
                line: 8,
                state: "Data prop",

                explain:
                    "The product object is passed to ProductRow."
            },

            {
                line: 9,
                state: "Callback prop",

                explain:
                    "The stable select function is passed to the child."
            },

            {
                line: 10,
                state: "Memoized child",

                explain:
                    "If ProductRow is wrapped with React.memo and its props are equal, unnecessary rendering may be skipped."
            },

            {
                line: 11,
                state: "Result",

                explain:
                    "React finishes calculating the list of elements."
            },

            {
                line: 12,
                state: "Complete",

                explain:
                    "The component has produced its next UI description. React can now reconcile and commit required changes."
            }

        ]

    },


    /* =====================================================
       QUICK REVISION
       ===================================================== */

    revision: [

        [
            "Render",
            "React calculates the next UI representation."
        ],

        [
            "Re-render",
            "A component is evaluated again because its state, parent, props, context or another subscribed source changed."
        ],

        [
            "React.memo",
            "Can skip a child render when its props are considered equal."
        ],

        [
            "useMemo",
            "Caches a calculated value until dependencies change."
        ],

        [
            "useCallback",
            "Caches a function reference until dependencies change."
        ],

        [
            "Referential equality",
            "Objects, arrays and functions are compared by reference."
        ],

        [
            "Stable key",
            "Helps React identify list item identity across renders."
        ],

        [
            "Suspense",
            "Provides fallback UI while supported asynchronous/lazy content is loading."
        ],

        [
            "Profiler",
            "Helps investigate component rendering performance."
        ],

        [
            "React Testing Library",
            "Encourages testing behaviour from the user's perspective."
        ],

        [
            "Integration test",
            "Checks multiple application pieces working together."
        ],

        [
            "Performance rule",
            "Measure first, then optimize the actual bottleneck."
        ]

    ],


    /* =====================================================
       INTERVIEW QUESTIONS
       ===================================================== */

    interview: [

        {
            question:
                "What causes a React component to re-render?",

            answer:
                "Common causes include its own state changing, receiving changed props, a parent rendering, or subscribed context/external state changing."
        },

        {
            question:
                "Does a React re-render mean the whole DOM is rebuilt?",

            answer:
                "No. Rendering calculates the next UI result. React then compares it with the previous result and commits only the necessary DOM changes."
        },

        {
            question:
                "What is React.memo?",

            answer:
                "React.memo creates a memoized component that can skip rendering when its props are considered equal."
        },

        {
            question:
                "What is the difference between useMemo and useCallback?",

            answer:
                "useMemo memoizes a calculated value. useCallback memoizes a function reference."
        },

        {
            question:
                "Why can an object prop defeat React.memo?",

            answer:
                "A newly created object has a new reference even when its contents are identical, so shallow comparison can consider the prop changed."
        },

        {
            question:
                "Why should array indexes sometimes be avoided as keys?",

            answer:
                "When items are inserted, removed or reordered, an index can point to a different logical item and cause incorrect component identity."
        },

        {
            question:
                "When should you use useMemo?",

            answer:
                "When caching a derived calculation provides a meaningful performance benefit and the dependencies are well defined."
        },

        {
            question:
                "What is the purpose of React Testing Library?",

            answer:
                "It provides utilities for testing React interfaces through user-observable behaviour and accessible interactions."
        },

        {
            question:
                "Why test loading and error states?",

            answer:
                "Because production applications do not only have successful responses. Users also experience loading, empty and failure states."
        },

        {
            question:
                "Should every React component use React.memo?",

            answer:
                "No. Memoization is an optimization. It should be applied where measurements and component behaviour indicate that skipping work is useful."
        }

    ],


    /* =====================================================
       PRACTICE
       ===================================================== */

    practice: [

        {
            title: "Render Trigger Analysis",

            task:
                "A parent component contains a counter and a child component. Identify which state update causes the parent to render and whether the child is guaranteed to update the DOM.",

            hint:
                "Separate component rendering from actual DOM changes.",

            answer:
                "The parent's state update causes the parent to render again. The child may also render, but React can avoid unnecessary DOM changes when its resulting UI is unchanged."
        },

        {
            title: "Memoization Decision",

            task:
                "A component calculates a filtered list of 100,000 records on every render. Decide whether useMemo could be useful.",

            hint:
                "Think about the cost of repeating the calculation.",

            answer:
                "Yes. Because filtering a very large dataset can be expensive, useMemo may be appropriate if the dependencies are correctly defined."
        },

        {
            title: "Stable Callback",

            task:
                "A memoized child receives an onSelect callback from its parent. Explain why useCallback may help.",

            hint:
                "Functions are objects with identity.",

            answer:
                "A new function created during every parent render can have a different reference. useCallback can preserve the reference until its dependencies change."
        },

        {
            title: "List Key",

            task:
                "A student list supports inserting a student at the beginning. Should the array index be used as the key?",

            hint:
                "What happens to existing indexes after insertion?",

            answer:
                "A stable student ID should be used because inserting an item changes the indexes of existing students."
        },

        {
            title: "Testing State",

            task:
                "A search page displays Loading, Results, Empty and Error states. List the states that should be tested.",

            hint:
                "Think about all user-visible outcomes.",

            answer:
                "Loading, successful results, successful empty response and error states should all be tested."
        },

        {
            title: "Performance Investigation",

            task:
                "A React dashboard feels slow. Should you immediately add useMemo to every component?",

            hint:
                "Think about measurement.",

            answer:
                "No. First identify the actual bottleneck using profiling and browser performance tools, then optimize the expensive work."
        }

    ],


    /* =====================================================
       MCQ
       ===================================================== */

    quiz: [

        {
            question:
                "Which event normally causes a component to render again?",

            options: [

                "Changing its state",

                "Changing the CSS file name",

                "Opening DevTools",

                "Refreshing the browser tab only"

            ],

            answer: 0,

            explanation:
                "A state update schedules a new render for the component."
        },

        {
            question:
                "What does React.memo primarily optimize?",

            options: [

                "Database queries",

                "Network requests",

                "Unnecessary component rendering",

                "CSS parsing"

            ],

            answer: 2,

            explanation:
                "React.memo can skip a component render when its props are considered equal."
        },

        {
            question:
                "What does useMemo return?",

            options: [

                "A memoized value",

                "A DOM node",

                "A CSS class",

                "An HTTP response"

            ],

            answer: 0,

            explanation:
                "useMemo caches the result of a calculation."
        },

        {
            question:
                "What does useCallback primarily preserve?",

            options: [

                "A database connection",

                "A function reference",

                "A DOM element",

                "A network socket"

            ],

            answer: 1,

            explanation:
                "useCallback memoizes a function reference."
        },

        {
            question:
                "Which is generally the best key for a database-backed student list?",

            options: [

                "Math.random()",

                "The current time",

                "student.id",

                "Always the number 1"

            ],

            answer: 2,

            explanation:
                "A stable unique identifier provides consistent item identity."
        },

        {
            question:
                "What should performance optimization usually begin with?",

            options: [

                "Adding every available hook",

                "Removing all state",

                "Measuring the actual bottleneck",

                "Wrapping every component with React.memo"

            ],

            answer: 2,

            explanation:
                "Measurement helps identify the actual source of expensive work."
        },

        {
            question:
                "What is React Testing Library mainly designed to encourage?",

            options: [

                "Testing private component implementation details",

                "Testing user-observable behaviour",

                "Testing MongoDB indexes",

                "Testing CSS compilation"

            ],

            answer: 1,

            explanation:
                "React Testing Library encourages tests based on user-facing behaviour and accessible interactions."
        },

        {
            question:
                "Which state should normally be considered when testing an API-driven component?",

            options: [

                "Only success",

                "Only loading",

                "Loading, success, empty and error",

                "Only error"

            ],

            answer: 2,

            explanation:
                "Real applications need to handle multiple user-visible request states."
        }

    ],


    /* =====================================================
       GLOSSARY
       ===================================================== */

    glossary: [

        {
            term: "Render",
            definition:
                "React's process of calculating the next UI representation."
        },

        {
            term: "Reconciliation",
            definition:
                "React's process of comparing the new UI result with the previous result."
        },

        {
            term: "Commit",
            definition:
                "The stage where React applies required changes to the host environment such as the DOM."
        },

        {
            term: "React.memo",
            definition:
                "A component optimization that can skip rendering when props are considered equal."
        },

        {
            term: "useMemo",
            definition:
                "A Hook for memoizing a calculated value."
        },

        {
            term: "useCallback",
            definition:
                "A Hook for memoizing a function reference."
        },

        {
            term: "Referential Equality",
            definition:
                "Equality based on whether two objects, arrays or functions point to the same reference."
        },

        {
            term: "Stable Key",
            definition:
                "A consistent unique identifier used by React to track list item identity."
        },

        {
            term: "Code Splitting",
            definition:
                "Dividing application JavaScript into separately loaded pieces."
        },

        {
            term: "Suspense",
            definition:
                "A React mechanism that can display fallback UI while supported content is loading."
        },

        {
            term: "Profiler",
            definition:
                "A tool for investigating rendering performance and identifying expensive component work."
        },

        {
            term: "React Testing Library",
            definition:
                "A testing utility ecosystem focused on testing React interfaces through user-facing behaviour."
        },

        {
            term: "Integration Test",
            definition:
                "A test that verifies multiple application parts working together."
        }

    ],


    /* =====================================================
       COMPLETION
       ===================================================== */

    completion: {

        title: "React Performance & Testing Completed",

        message:
            "You now understand the core ideas behind React rendering, memoization, performance measurement and user-focused testing.",

        achievements: [

            "You can explain why React components re-render.",

            "You understand React.memo, useMemo and useCallback.",

            "You understand referential equality and stable keys.",

            "You can reason about code splitting and Suspense.",

            "You can investigate performance instead of guessing.",

            "You understand practical React testing strategy.",

            "You can test loading, success, empty and error states.",

            "You are ready to move from React fundamentals into the Node.js and Express backend layer."

        ],

        nextLevel:
            "Level 19 — Node.js Runtime & Server-Side JavaScript"

    }

};
