
"use strict";

window.FULLSTACK_LESSONS = window.FULLSTACK_LESSONS || {};

window.FULLSTACK_LESSONS[5] = {
    n: 5,
    kicker: "WEB FOUNDATIONS",
    title: "Responsive Layouts",
    summary:
        "Learn how professional websites adapt to different screen sizes using mobile-first thinking, fluid sizing, Flexbox, Grid, media queries, responsive typography and careful overflow control.",
    duration: "Estimated learning time: 4–5 hours",
    difficulty: "Beginner → Intermediate",
    concepts: 20,

    outcomes: [
        "Explain what responsive web design means.",
        "Understand why mobile-first development is useful.",
        "Build fluid layouts using percentages and max-width.",
        "Understand the difference between width, min-width and max-width.",
        "Use Flexbox for one-dimensional layouts.",
        "Understand the main axis and cross axis.",
        "Control alignment using justify-content and align-items.",
        "Use flex-wrap and gap effectively.",
        "Build responsive card layouts using CSS Grid.",
        "Use repeat() and minmax() to create flexible grids.",
        "Write useful media queries.",
        "Choose breakpoints based on content instead of device names.",
        "Create responsive navigation and cards.",
        "Build responsive typography and images.",
        "Identify and prevent horizontal overflow.",
        "Use browser DevTools to test multiple viewport sizes.",
        "Understand the difference between adaptive and fluid behaviour.",
        "Debug common responsive-layout problems.",
        "Prepare layouts that can later be used inside React applications.",
        "Build a complete responsive CodeBhavya-style learning page."
    ],

    sections: [

        {
            title: "1. What Is Responsive Design?",
            explanation:
                "Responsive design means creating interfaces that adapt to the available screen and interaction space. A responsive website should remain usable on phones, tablets, laptops and large displays without requiring a separate website for every device.",
            points: [
                "The layout can change according to available width.",
                "Columns can become rows on smaller screens.",
                "Navigation can change presentation.",
                "Images and text can scale within reasonable limits.",
                "Controls should remain usable with touch and keyboard input.",
                "Responsive design is about the interface, not about targeting specific phone models."
            ],
            code: `.container {
    width: 100%;
    max-width: 1100px;
    margin-inline: auto;
    padding-inline: 20px;
}`,
            note:
                "The goal is not to make everything smaller. The goal is to make the interface appropriate for the available space."
        },

        {
            title: "2. The Viewport",
            explanation:
                "The viewport is the visible area in which a webpage is displayed. Responsive CSS commonly reacts to the viewport width.",
            points: [
                "Desktop screens usually provide more horizontal space.",
                "Mobile screens provide much less horizontal space.",
                "The same content may need different arrangements.",
                "Browser DevTools can simulate different viewport dimensions."
            ],
            code: `/* The layout can respond to viewport width */

@media (max-width: 700px) {
    .course-grid {
        grid-template-columns: 1fr;
    }
}`,
            note:
                "Responsive behaviour should be tested across a range of widths, not just one phone and one laptop."
        },

        {
            title: "3. Mobile-First CSS",
            explanation:
                "Mobile-first development starts with a layout that works well in a narrow viewport and then enhances it for larger screens.",
            points: [
                "Start with the simplest usable layout.",
                "Add larger-screen improvements through media queries.",
                "Avoid assuming that desktop is the default.",
                "Mobile-first CSS often produces cleaner responsive rules."
            ],
            code: `.course-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 16px;
}

@media (min-width: 800px) {
    .course-grid {
        grid-template-columns: repeat(3, 1fr);
    }
}`,
            note:
                "Notice that the base layout works on mobile. The media query adds the larger-screen arrangement."
        },

        {
            title: "4. Fluid Widths",
            explanation:
                "A fluid layout allows elements to use available space instead of forcing a fixed width everywhere.",
            points: [
                "Percentages can create fluid widths.",
                "width: 100% allows an element to fill its containing block.",
                "max-width prevents content from becoming excessively wide.",
                "margin-inline: auto can center a constrained container."
            ],
            code: `.content {
    width: 100%;
    max-width: 900px;
    margin-inline: auto;
}`,
            example:
                "The content can shrink on a mobile screen while remaining comfortably constrained on a large desktop screen."
        },

        {
            title: "5. width, min-width and max-width",
            explanation:
                "These three properties provide different forms of size control.",
            points: [
                "width defines a preferred size.",
                "min-width defines the smallest allowed size.",
                "max-width defines the largest allowed size.",
                "Combining width: 100% with max-width is a common responsive pattern."
            ],
            code: `.article {
    width: 100%;
    max-width: 760px;
    min-width: 0;
}`,
            note:
                "min-width: 0 is especially useful for preventing flex and grid children from refusing to shrink because of long content."
        },

        {
            title: "6. Flexbox — The One-Dimensional Layout System",
            explanation:
                "Flexbox is designed for arranging items along one primary axis. It is excellent for navigation bars, toolbars, button groups, card rows and many component-level layouts.",
            points: [
                "display: flex activates Flexbox.",
                "flex-direction chooses row or column.",
                "justify-content controls the main axis.",
                "align-items controls the cross axis.",
                "gap creates space between flex items.",
                "flex-wrap allows items to move onto additional lines."
            ],
            code: `.actions {
    display: flex;
    align-items: center;
    gap: 12px;
}`,
            note:
                "Flexbox is usually easiest to understand when you identify the main axis first."
        },

        {
            title: "7. Main Axis and Cross Axis",
            explanation:
                "Flexbox alignment depends on the direction of the flex container.",
            points: [
                "With flex-direction: row, the main axis is horizontal.",
                "With flex-direction: column, the main axis is vertical.",
                "justify-content operates on the main axis.",
                "align-items operates on the cross axis."
            ],
            code: `.menu {
    display: flex;
    flex-direction: row;

    justify-content: space-between;
    align-items: center;
}`,
            example:
                "For a row-based menu, justify-content distributes items horizontally while align-items controls vertical alignment."
        },

        {
            title: "8. justify-content",
            explanation:
                "justify-content distributes flex items along the main axis.",
            points: [
                "flex-start places items toward the beginning.",
                "center places items in the center.",
                "flex-end places items toward the end.",
                "space-between distributes free space between items.",
                "space-around and space-evenly distribute free space in different ways."
            ],
            code: `.toolbar {
    display: flex;
    justify-content: space-between;
}`,
            note:
                "Use justify-content according to the layout requirement instead of memorizing one preferred value."
        },

        {
            title: "9. align-items",
            explanation:
                "align-items controls how flex items are aligned across the cross axis.",
            points: [
                "center is common for navigation bars and toolbars.",
                "flex-start aligns items toward the beginning.",
                "flex-end aligns items toward the end.",
                "stretch can make items fill the available cross-axis space."
            ],
            code: `.header {
    display: flex;
    align-items: center;
    min-height: 64px;
}`,
            example:
                "A centered header logo and navigation items commonly use align-items: center."
        },

        {
            title: "10. flex-wrap and gap",
            explanation:
                "Flex items can overflow when there is not enough horizontal space. flex-wrap allows them to move onto another line.",
            points: [
                "nowrap is the default.",
                "wrap allows multiple flex lines.",
                "gap creates consistent spacing between items.",
                "gap is often cleaner than applying margins to every child."
            ],
            code: `.tags {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
}`,
            note:
                "Wrapping is useful for tags, filters, buttons and compact navigation groups."
        },

        {
            title: "11. Flexible Flex Items",
            explanation:
                "Flex items can grow, shrink and use a preferred basis. These controls help create layouts that adapt to available space.",
            points: [
                "flex-grow controls how an item can consume extra space.",
                "flex-shrink controls whether it can shrink.",
                "flex-basis provides the starting size.",
                "The shorthand flex combines these ideas."
            ],
            code: `.sidebar {
    flex: 0 0 240px;
}

.content {
    flex: 1;
    min-width: 0;
}`,
            note:
                "The min-width: 0 pattern is important when a flex child contains long text or wide content."
        },

        {
            title: "12. CSS Grid",
            explanation:
                "CSS Grid is a two-dimensional layout system. It is particularly useful when a design needs rows and columns to work together.",
            points: [
                "display: grid activates Grid.",
                "grid-template-columns defines columns.",
                "grid-template-rows defines rows.",
                "gap controls spacing.",
                "fr represents a flexible fraction of available space."
            ],
            code: `.course-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
}`,
            example:
                "A three-column course-card layout can be expressed naturally with Grid."
        },

        {
            title: "13. repeat() and minmax()",
            explanation:
                "repeat() reduces repetitive grid declarations. minmax() allows a track to have a minimum and maximum size.",
            code: `.course-grid {
    display: grid;
    grid-template-columns:
        repeat(
            auto-fit,
            minmax(240px, 1fr)
        );
    gap: 20px;
}`,
            points: [
                "repeat() avoids writing the same track repeatedly.",
                "minmax() defines a lower and upper bound.",
                "auto-fit allows the browser to fit as many columns as practical.",
                "This pattern can create highly flexible card grids."
            ],
            note:
                "Grid can sometimes provide responsive behaviour with fewer explicit breakpoints."
        },

        {
            title: "14. Media Queries",
            explanation:
                "Media queries apply CSS conditionally when the environment satisfies a condition.",
            code: `/* Base mobile layout */

.course-grid {
    grid-template-columns: 1fr;
}

/* Larger screens */

@media (min-width: 768px) {
    .course-grid {
        grid-template-columns: repeat(2, 1fr);
    }
}

@media (min-width: 1100px) {
    .course-grid {
        grid-template-columns: repeat(3, 1fr);
    }
}`,
            points: [
                "max-width applies rules below a threshold.",
                "min-width applies rules above a threshold.",
                "Media queries can respond to more than just width.",
                "Use breakpoints where the content needs them."
            ]
        },

        {
            title: "15. Breakpoints Should Follow Content",
            explanation:
                "A common mistake is creating breakpoints only for named devices. Professional responsive design starts with the content and changes the layout when the content begins to fail.",
            points: [
                "Do not design only for one specific phone model.",
                "Do not assume every tablet has the same width.",
                "Watch for cramped navigation.",
                "Watch for unreadably narrow columns.",
                "Introduce a breakpoint when the design needs one."
            ],
            code: `@media (min-width: 820px) {
    .layout {
        grid-template-columns: 240px 1fr;
    }
}`,
            note:
                "820px is not a magical tablet number. It is simply an example breakpoint chosen because the layout may need two columns at that width."
        },

        {
            title: "16. Responsive Typography",
            explanation:
                "Text should remain readable across different viewport sizes. Responsive typography can use relative units and controlled scaling.",
            points: [
                "rem provides predictable root-relative sizing.",
                "max-width can control paragraph line length.",
                "clamp() can create fluid but bounded font sizes.",
                "Line-height should remain comfortable at every size."
            ],
            code: `h1 {
    font-size: clamp(2rem, 5vw, 4rem);
    line-height: 1.1;
}

p {
    max-width: 70ch;
}`,
            example:
                "clamp() allows the heading to scale with the viewport while remaining between a minimum and maximum size."
        },

        {
            title: "17. Responsive Images",
            explanation:
                "Images should normally remain inside their containing area instead of creating horizontal overflow.",
            code: `img {
    display: block;
    max-width: 100%;
    height: auto;
}`,
            points: [
                "max-width: 100% prevents the image from exceeding its container.",
                "height: auto preserves the aspect ratio.",
                "display: block can remove unexpected inline spacing.",
                "For important responsive image delivery, HTML also provides srcset and sizes."
            ]
        },

        {
            title: "18. Preventing Horizontal Overflow",
            explanation:
                "Horizontal scrolling is one of the most common responsive-layout problems.",
            points: [
                "Check fixed-width elements.",
                "Check large images.",
                "Check long unbroken strings.",
                "Check flex children that refuse to shrink.",
                "Check wide tables and code blocks.",
                "Use min-width: 0 where appropriate.",
                "Do not blindly hide overflow before finding the real cause."
            ],
            code: `.content {
    min-width: 0;
}

pre {
    max-width: 100%;
    overflow-x: auto;
}`,
            note:
                "overflow-x: hidden can hide symptoms without fixing the underlying layout problem. Diagnose first."
        },

        {
            title: "19. Responsive Navigation",
            explanation:
                "Navigation is often one of the first components that becomes crowded on smaller screens.",
            points: [
                "Navigation links may wrap.",
                "Links may move into a vertical layout.",
                "A menu button can reveal navigation on small screens.",
                "Interactive controls must remain keyboard accessible.",
                "The mobile navigation should not leave large empty areas."
            ],
            code: `.site-nav {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
}

@media (max-width: 650px) {
    .site-nav {
        flex-direction: column;
    }
}`,
            note:
                "Responsive navigation is not simply about hiding links. The alternative interaction must remain understandable and accessible."
        },

        {
            title: "20. Testing Responsive Interfaces",
            explanation:
                "Responsive development requires repeated testing. Browser DevTools provides viewport simulation and inspection tools.",
            points: [
                "Test narrow mobile widths.",
                "Test medium tablet-like widths.",
                "Test normal desktop widths.",
                "Test very wide screens.",
                "Look for overflow.",
                "Look for cramped text.",
                "Check interactive controls.",
                "Inspect layout rules in DevTools."
            ],
            code: `/* A useful testing sequence

320px
375px
480px
768px
1024px
1440px
1600px

The exact widths are examples,
not required breakpoints. */`,
            note:
                "Testing several widths exposes problems that may remain invisible at one chosen screen size."
        },

        {
            title: "21. Flexbox vs Grid",
            explanation:
                "Flexbox and Grid are complementary rather than competing technologies.",
            points: [
                "Flexbox is primarily one-dimensional.",
                "Grid is primarily two-dimensional.",
                "Flexbox is excellent for component internals and alignment.",
                "Grid is excellent for page sections and card matrices.",
                "Real interfaces often use both."
            ],
            code: `.page {
    display: grid;
    grid-template-columns: 240px 1fr;
}

.toolbar {
    display: flex;
    align-items: center;
    gap: 12px;
}`,
            example:
                "A page can use Grid for the major structure and Flexbox inside each component."
        },

        {
            title: "22. Adaptive vs Fluid Layouts",
            explanation:
                "Fluid layouts continuously use available space, while adaptive layouts may switch between defined arrangements at specific thresholds. Modern interfaces commonly combine both strategies.",
            points: [
                "Fluid sizing responds continuously.",
                "Media queries can introduce structural changes.",
                "Grid's minmax() can provide fluid columns.",
                "Breakpoints can change navigation or major page structure.",
                "Good responsive design combines the approaches when useful."
            ]
        },

        {
            title: "23. Responsive CSS in React",
            explanation:
                "Responsive CSS remains CSS even when the UI is rendered by React. Components should expose sensible structure and classes while CSS handles most visual adaptation.",
            points: [
                "React manages component structure and behaviour.",
                "CSS manages presentation and layout.",
                "Avoid using JavaScript for every visual breakpoint.",
                "Use CSS media queries for purely visual changes.",
                "Use JavaScript only when the interaction genuinely depends on viewport information."
            ],
            code: `function CourseCard() {
    return (
        <article className="course-card">
            <h2>React</h2>
            <p>Component-based UI development.</p>
            <button>Start</button>
        </article>
    );
}`,
            note:
                "This separation makes React components easier to reuse across different screen sizes."
        }
    ],

    visualizer: {
        title: "Responsive Layout Visualizer",
        subtitle:
            "Follow how a responsive course grid changes as available width changes.",
        type: "responsive",
        steps: [
            {
                title: "Narrow viewport",
                description:
                    "The available width is small, so the layout begins with a single column.",
                code: `.course-grid {
    grid-template-columns: 1fr;
}`,
                width: "320px",
                columns: 1
            },
            {
                title: "Medium viewport",
                description:
                    "More horizontal space becomes available, so the layout can safely introduce two columns.",
                code: `@media (min-width: 700px) {
    .course-grid {
        grid-template-columns:
            repeat(2, 1fr);
    }
}`,
                width: "700px",
                columns: 2
            },
            {
                title: "Wide viewport",
                description:
                    "At a wider size, three cards can fit comfortably.",
                code: `@media (min-width: 1050px) {
    .course-grid {
        grid-template-columns:
            repeat(3, 1fr);
    }
}`,
                width: "1050px",
                columns: 3
            },
            {
                title: "Fluid alternative",
                description:
                    "Grid can sometimes determine the number of practical columns automatically.",
                code: `.course-grid {
    grid-template-columns:
        repeat(
            auto-fit,
            minmax(240px, 1fr)
        );
}`,
                width: "fluid",
                columns: "auto"
            },
            {
                title: "Final responsive system",
                description:
                    "The final interface combines fluid sizing, Grid or Flexbox, typography controls and targeted breakpoints.",
                code: `Mobile
  ↓
Flexible width
  ↓
Grid / Flexbox
  ↓
Breakpoint when needed
  ↓
Desktop`
            }
        ]
    },

    revision: [
        [
            "Responsive Design",
            "A design approach where the interface adapts to different available screen sizes and interaction conditions."
        ],
        [
            "Mobile-First",
            "Starting with a narrow-screen layout and progressively enhancing it for larger screens."
        ],
        [
            "Viewport",
            "The visible area of the browser in which a webpage is displayed."
        ],
        [
            "max-width",
            "Sets the largest size an element is allowed to reach."
        ],
        [
            "Flexbox",
            "A one-dimensional CSS layout system for arranging and aligning items along a main axis."
        ],
        [
            "Main Axis",
            "The primary direction in which Flexbox items are laid out."
        ],
        [
            "Cross Axis",
            "The axis perpendicular to the Flexbox main axis."
        ],
        [
            "flex-wrap",
            "Allows flex items to move onto additional lines when necessary."
        ],
        [
            "CSS Grid",
            "A two-dimensional layout system based on rows and columns."
        ],
        [
            "minmax()",
            "A Grid function that defines a minimum and maximum size for a track."
        ],
        [
            "Media Query",
            "A CSS condition that applies rules when specified environmental conditions are satisfied."
        ],
        [
            "Breakpoint",
            "A point where the layout changes because the current arrangement no longer works well."
        ],
        [
            "Fluid Layout",
            "A layout that continuously adapts its dimensions to available space."
        ],
        [
            "Horizontal Overflow",
            "Content extending beyond the available horizontal space and potentially causing unwanted scrolling."
        ],
        [
            "gap",
            "A CSS property used to create consistent space between items in Flexbox and Grid layouts."
        ]
    ],

    interview: [
        {
            q: "What is responsive web design?",
            a: "Responsive web design creates interfaces that adapt to different available screen sizes and interaction environments while keeping content usable and accessible."
        },
        {
            q: "What is mobile-first development?",
            a: "Mobile-first development starts with a narrow-screen layout and then adds enhancements for larger screens using progressive CSS rules."
        },
        {
            q: "What is the difference between Flexbox and Grid?",
            a: "Flexbox is primarily a one-dimensional layout system, while Grid is primarily a two-dimensional system for rows and columns. They are often used together."
        },
        {
            q: "Explain justify-content and align-items.",
            a: "In Flexbox, justify-content controls alignment along the main axis, while align-items controls alignment along the cross axis."
        },
        {
            q: "What happens to the main axis when flex-direction changes?",
            a: "With row, the main axis is horizontal. With column, the main axis becomes vertical."
        },
        {
            q: "Why is min-width: 0 useful in responsive layouts?",
            a: "Flex and Grid children can otherwise refuse to shrink because of their content's minimum size. min-width: 0 allows the item to shrink within its available space."
        },
        {
            q: "Why use max-width with width: 100%?",
            a: "width: 100% allows the element to use available space while max-width prevents it from becoming unnecessarily wide on large screens."
        },
        {
            q: "What is a media query?",
            a: "A media query conditionally applies CSS rules according to environmental conditions such as viewport width."
        },
        {
            q: "Why should breakpoints follow content rather than device names?",
            a: "Device dimensions vary widely. A content-based breakpoint is more reliable because it changes the layout when the current arrangement actually becomes unsuitable."
        },
        {
            q: "How can horizontal overflow be debugged?",
            a: "Inspect wide elements, fixed widths, images, long strings, tables and flex or grid children. Use DevTools to identify which element exceeds the viewport before deciding how to fix it."
        },
        {
            q: "What does minmax() do in CSS Grid?",
            a: "minmax() defines a lower and upper size for a Grid track, allowing flexible but controlled column dimensions."
        },
        {
            q: "Why should JavaScript not control every responsive visual change?",
            a: "CSS is designed to handle presentation and media-query changes efficiently. Using JavaScript for every visual breakpoint adds unnecessary complexity and can create synchronization problems."
        }
    ],

    practice: [
        {
            title: "Practice 01 — Mobile-First Course Card",
            task:
                "Create a course card that works comfortably on a narrow mobile screen and then enhance its spacing and typography for larger screens.",
            difficulty: "Easy",
            hints: [
                "Start with the mobile layout as the default CSS.",
                "Use width: 100% with a sensible max-width.",
                "Add a min-width media query for larger screens.",
                "Test the card at several viewport widths."
            ],
            skills: ["Mobile-first", "Fluid sizing", "Media queries"]
        },

        {
            title: "Practice 02 — Flexbox Toolbar",
            task:
                "Build a toolbar containing a logo, search area and action buttons. Use Flexbox to align the items and make the toolbar wrap when space becomes limited.",
            difficulty: "Easy",
            hints: [
                "Start with display: flex.",
                "Use align-items: center for vertical alignment.",
                "Use gap instead of individual margins where possible.",
                "Add flex-wrap: wrap and test a narrow viewport."
            ],
            skills: ["Flexbox", "Alignment", "Wrapping"]
        },

        {
            title: "Practice 03 — Flexbox Axis Challenge",
            task:
                "Create the same navigation component using both flex-direction: row and flex-direction: column. Explain how justify-content and align-items change meaning when the direction changes.",
            difficulty: "Easy",
            hints: [
                "First identify the main axis.",
                "Test justify-content with row.",
                "Change flex-direction to column.",
                "Observe that the main axis has changed."
            ],
            skills: ["Main axis", "Cross axis", "Flexbox"]
        },

        {
            title: "Practice 04 — Three-Column Course Grid",
            task:
                "Create six CodeBhavya course cards using CSS Grid. Display three columns on wide screens, two on medium screens and one on narrow screens.",
            difficulty: "Medium",
            hints: [
                "Start with grid-template-columns: 1fr.",
                "Add a medium breakpoint with repeat(2, 1fr).",
                "Add a larger breakpoint with repeat(3, 1fr).",
                "Use gap to maintain consistent spacing."
            ],
            skills: ["Grid", "Breakpoints", "Responsive cards"]
        },

        {
            title: "Practice 05 — Auto-Fit Grid",
            task:
                "Rebuild the course grid using repeat(auto-fit, minmax(...)). Try to make the browser choose a practical number of columns without explicitly specifying every breakpoint.",
            difficulty: "Medium",
            hints: [
                "Activate CSS Grid first.",
                "Use repeat(auto-fit, ...).",
                "Give minmax() a reasonable minimum card width.",
                "Resize the viewport and observe when columns appear or disappear."
            ],
            skills: ["Grid", "auto-fit", "minmax"]
        },

        {
            title: "Practice 06 — Responsive Typography",
            task:
                "Create a hero heading that scales between a minimum and maximum size while remaining readable on mobile and desktop.",
            difficulty: "Medium",
            hints: [
                "Use rem for the minimum and maximum values.",
                "Use clamp() to create a fluid middle value.",
                "Keep line-height comfortable.",
                "Test both very narrow and very wide screens."
            ],
            skills: ["Typography", "clamp", "Responsive design"]
        },

        {
            title: "Practice 07 — Responsive Image",
            task:
                "Create a course banner image that never exceeds its container and keeps its original aspect ratio.",
            difficulty: "Easy",
            hints: [
                "Start with max-width: 100%.",
                "Use height: auto.",
                "Try display: block to remove inline-image spacing.",
                "Test with both a small and large image."
            ],
            skills: ["Images", "Fluid sizing", "Overflow"]
        },

        {
            title: "Practice 08 — Overflow Detective",
            task:
                "Build a page that intentionally creates horizontal overflow. Use DevTools to find the element causing it and fix the actual cause instead of simply hiding overflow on the body.",
            difficulty: "Hard",
            hints: [
                "Look for fixed-width elements.",
                "Inspect images and long text.",
                "Check flex and grid children.",
                "Try min-width: 0 on the affected component when appropriate."
            ],
            skills: ["Debugging", "Overflow", "DevTools"]
        },

        {
            title: "Practice 09 — Responsive Navigation",
            task:
                "Create a navigation bar that displays links horizontally on wide screens and changes to a vertical arrangement on smaller screens.",
            difficulty: "Medium",
            hints: [
                "Use Flexbox for the navigation.",
                "Start with a row layout.",
                "Use a media query to change the direction.",
                "Make sure links remain keyboard accessible."
            ],
            skills: ["Navigation", "Flexbox", "Media queries"]
        },

        {
            title: "Practice 10 — Sidebar to Stacked Layout",
            task:
                "Create a dashboard with a sidebar and content area on desktop. On smaller screens, change it to a single-column layout.",
            difficulty: "Medium",
            hints: [
                "Grid is a good choice for the desktop structure.",
                "Give the sidebar a controlled column size.",
                "Give the content column min-width: 0.",
                "At a smaller breakpoint, change the layout to one column."
            ],
            skills: ["Grid", "Responsive structure", "Dashboard layout"]
        },

        {
            title: "Practice 11 — Breakpoint Investigation",
            task:
                "Create a layout that becomes cramped at a particular width. Resize the browser and determine the width at which a breakpoint should be introduced based on the content rather than a device category.",
            difficulty: "Hard",
            hints: [
                "Resize the viewport gradually instead of jumping between phone and desktop.",
                "Look for the first point where content becomes uncomfortable.",
                "Place the breakpoint near that point.",
                "Do not call the breakpoint 'tablet' just because of the chosen width."
            ],
            skills: ["Breakpoints", "Design reasoning", "Responsive debugging"]
        },

        {
            title: "Practice 12 — Responsive CodeBhavya Page",
            task:
                "Build a complete CodeBhavya-style learning page containing a header, hero, course cards, practice section and footer. The entire page must remain usable from mobile through large desktop widths.",
            difficulty: "Hard",
            hints: [
                "Start with a mobile-first single-column structure.",
                "Use Grid for major card collections and Flexbox for component-level alignment.",
                "Use max-width containers to prevent excessive line lengths.",
                "Test the complete page at multiple viewport widths and fix overflow before adding decorative styling."
            ],
            skills: ["Complete responsive design", "Flexbox", "Grid", "Debugging"]
        }
    ],

    quiz: [
        {
            q: "What is the main goal of responsive design?",
            options: [
                "Make every element smaller",
                "Create separate HTML for every device",
                "Adapt the interface to available space",
                "Remove mobile users"
            ],
            answer: 2,
            explanation:
                "Responsive design adapts the interface to different available screen sizes and interaction conditions."
        },

        {
            q: "What does mobile-first mean?",
            options: [
                "Only design for mobile",
                "Start with a narrow-screen layout and enhance it for larger screens",
                "Use JavaScript for mobile",
                "Hide desktop content"
            ],
            answer: 1,
            explanation:
                "Mobile-first starts with the narrow layout and progressively adds larger-screen enhancements."
        },

        {
            q: "Which property activates Flexbox?",
            options: [
                "display: flex",
                "position: flex",
                "layout: flex",
                "flex: display"
            ],
            answer: 0,
            explanation:
                "display: flex turns an element into a flex container."
        },

        {
            q: "Which property controls the Flexbox main axis?",
            options: [
                "align-items",
                "justify-content",
                "text-align",
                "vertical-align"
            ],
            answer: 1,
            explanation:
                "justify-content distributes items along the main axis."
        },

        {
            q: "Which property controls the Flexbox cross axis?",
            options: [
                "align-items",
                "justify-content",
                "float",
                "position"
            ],
            answer: 0,
            explanation:
                "align-items controls alignment along the cross axis."
        },

        {
            q: "What does flex-wrap do?",
            options: [
                "Changes font size",
                "Allows items to move onto additional lines",
                "Creates Grid columns",
                "Hides overflow"
            ],
            answer: 1,
            explanation:
                "flex-wrap allows flex items to form multiple lines when necessary."
        },

        {
            q: "Which system is primarily two-dimensional?",
            options: [
                "Flexbox",
                "CSS Grid",
                "Inline layout",
                "Positioning"
            ],
            answer: 1,
            explanation:
                "CSS Grid is designed for two-dimensional row-and-column layouts."
        },

        {
            q: "What does 1fr represent in CSS Grid?",
            options: [
                "One fixed pixel",
                "One flexible fraction of available space",
                "One viewport",
                "One font size"
            ],
            answer: 1,
            explanation:
                "fr represents a flexible fraction of the available grid space."
        },

        {
            q: "What does minmax() provide?",
            options: [
                "A minimum and maximum track size",
                "A color range",
                "A font range only",
                "Two breakpoints automatically"
            ],
            answer: 0,
            explanation:
                "minmax() defines minimum and maximum sizes for Grid tracks."
        },

        {
            q: "Which unit is based on viewport width?",
            options: [
                "rem",
                "em",
                "vw",
                "px"
            ],
            answer: 2,
            explanation:
                "vw is based on viewport width."
        },

        {
            q: "What is a media query used for?",
            options: [
                "Writing HTML",
                "Conditionally applying CSS",
                "Creating JavaScript functions",
                "Storing data"
            ],
            answer: 1,
            explanation:
                "Media queries conditionally apply CSS rules based on environmental conditions."
        },

        {
            q: "Why should breakpoints follow content?",
            options: [
                "All devices have identical widths",
                "Content determines when a layout becomes unsuitable",
                "Device names are required by CSS",
                "Breakpoints are only for phones"
            ],
            answer: 1,
            explanation:
                "Content-based breakpoints respond to actual layout needs rather than arbitrary device categories."
        },

        {
            q: "Which rule helps an image remain within its container?",
            options: [
                "max-width: 100%",
                "width: 5000px",
                "min-width: 1000px",
                "position: fixed"
            ],
            answer: 0,
            explanation:
                "max-width: 100% prevents the image from exceeding its containing width."
        },

        {
            q: "What is a common cause of horizontal overflow?",
            options: [
                "A fixed-width element wider than its container",
                "Using gap",
                "Using semantic HTML",
                "Using rem"
            ],
            answer: 0,
            explanation:
                "Fixed-width elements, oversized images, long strings and inflexible children can create horizontal overflow."
        },

        {
            q: "Which CSS function can create bounded fluid typography?",
            options: [
                "clamp()",
                "repeat()",
                "minmax()",
                "calc-grid()"
            ],
            answer: 0,
            explanation:
                "clamp() allows a value to scale between a minimum and maximum."
        }
    ],

    glossary: [
        {
            term: "Responsive Design",
            definition:
                "A design approach where the interface adapts to different available screen sizes."
        },
        {
            term: "Viewport",
            definition:
                "The visible area of a browser window used to display a webpage."
        },
        {
            term: "Mobile-First",
            definition:
                "A development strategy that starts with the narrow-screen layout and enhances it for larger screens."
        },
        {
            term: "Fluid Layout",
            definition:
                "A layout that adjusts continuously according to available space."
        },
        {
            term: "Flexbox",
            definition:
                "A CSS layout system primarily designed for one-dimensional alignment and distribution."
        },
        {
            term: "Main Axis",
            definition:
                "The primary axis along which Flexbox items are arranged."
        },
        {
            term: "Cross Axis",
            definition:
                "The axis perpendicular to the Flexbox main axis."
        },
        {
            term: "Flex Wrap",
            definition:
                "A Flexbox feature that allows items to move onto additional lines."
        },
        {
            term: "CSS Grid",
            definition:
                "A CSS layout system designed for two-dimensional rows and columns."
        },
        {
            term: "fr",
            definition:
                "A Grid unit representing a flexible fraction of available space."
        },
        {
            term: "minmax()",
            definition:
                "A Grid function that defines minimum and maximum track sizes."
        },
        {
            term: "Media Query",
            definition:
                "A conditional CSS rule based on characteristics of the browsing environment."
        },
        {
            term: "Breakpoint",
            definition:
                "A point where the layout changes because the existing arrangement is no longer suitable."
        },
        {
            term: "Overflow",
            definition:
                "Content extending beyond the available dimensions of its containing box."
        },
        {
            term: "clamp()",
            definition:
                "A CSS function that constrains a value between a minimum and maximum while allowing a preferred fluid value."
        }
    ],

    completion: {
        title: "Level 05 Completion Challenge",
        description:
            "Build a complete responsive CodeBhavya learning dashboard. The page should contain a responsive header, hero section, course-card grid, practice section and footer. It must remain usable across narrow mobile, tablet-like and desktop widths.",
        requirements: [
            "Use a mobile-first CSS structure.",
            "Create a centered max-width content container.",
            "Use Flexbox for at least one component.",
            "Use CSS Grid for the course-card section.",
            "Use gap for consistent spacing.",
            "Use at least one responsive media query.",
            "Use a responsive image with max-width: 100%.",
            "Use responsive typography.",
            "Prevent unnecessary horizontal overflow.",
            "Test the page at multiple viewport widths.",
            "Use browser DevTools to inspect at least one responsive layout problem.",
            "Explain why each breakpoint exists."
        ],
        success:
            "You have completed Level 05 when the same page remains readable, usable and visually balanced across mobile and desktop widths, and you can explain why Flexbox, Grid, fluid sizing and breakpoints were chosen."
    }
};
