"use strict";

/*
  CodeBhavya Full Stack
  LEVEL 10 — ARRAYS & OBJECTS
  Data modelling and immutable transformations
*/

window.FULLSTACK_LESSONS = window.FULLSTACK_LESSONS || {};

window.FULLSTACK_LESSONS[10] = {
  number: 10,
  title: "Arrays & Objects",
  kicker: "JavaScript Engineering · Level 10",
  subtitle: "Model collections, represent real-world data and transform it predictably.",
  estimatedTime: "3–4 hours",
  difficulty: "Intermediate",

  hero: {
    badge: "LEVEL 10 · DATA & COLLECTIONS",
    description:
      "Arrays and objects are the everyday data structures of JavaScript applications. " +
      "In this level, you will learn how to model real-world information, search and transform " +
      "collections, work safely with nested data, and understand why immutable transformations " +
      "matter in modern frontend development."
  },

  objectives: [
    "Understand arrays and indexed collections.",
    "Create, read, update and iterate over arrays.",
    "Use common array methods effectively.",
    "Understand map, filter and reduce.",
    "Search and test array contents with find, some and every.",
    "Understand objects as key-value data structures.",
    "Create, read, update and remove object properties.",
    "Work with nested objects and arrays.",
    "Use destructuring and spread syntax.",
    "Understand references and shallow copies.",
    "Transform data without accidentally mutating the original collection.",
    "Prepare for data handling patterns used heavily in React and APIs."
  ],

  sections: [

    {
      number: 1,
      title: "Why Arrays and Objects Matter",
      intro:
        "Most real applications work with collections of information. JavaScript arrays and objects provide the basic building blocks for representing that information.",

      explanation:
        "A student record, shopping cart, product catalogue, API response or list of courses " +
        "can all be represented using combinations of arrays and objects.",

      code:
`const student = {
  name: "Ravi",
  branch: "CSE",
  cgpa: 8.7
};

const courses = [
  "C",
  "DSA",
  "Python",
  "JavaScript"
];

console.log(student.name);
console.log(courses[2]);`,

      output:
`Ravi
Python`,

      comparison: {
        headers: ["Structure", "Best used for", "Example"],
        rows: [
          ["Array", "Ordered collection", "[10, 20, 30]"],
          ["Object", "Named properties", "{ name: " + '"Ravi"' + ", cgpa: 8.7 }"],
          ["Array of objects", "Collection of records", "[{...}, {...}]"],
          ["Object containing arrays", "Grouped related data", "{ courses: [...] }"]
        ]
      },

      keyIdea:
        "Arrays organize collections; objects organize named information about an entity."
    },

    {
      number: 2,
      title: "Creating and Accessing Arrays",
      intro:
        "An array stores multiple values in an ordered collection.",

      code:
`const marks = [82, 91, 76, 88];

console.log(marks[0]);
console.log(marks[2]);
console.log(marks.length);`,

      output:
`82
76
4`,

      points: [
        "Array indexes start at 0.",
        "The first element is at index 0.",
        "The second element is at index 1.",
        "length gives the number of elements.",
        "The last valid index is length - 1."
      ],

      methods: [
        {
          name: "arr[index]",
          purpose: "Reads or updates an element at a particular index.",
          example: "marks[0]"
        },
        {
          name: "length",
          purpose: "Returns the number of elements in the array.",
          example: "marks.length"
        },
        {
          name: "at()",
          purpose: "Reads an element using an index and can conveniently access from the end.",
          example: "marks.at(-1)"
        }
      ],

      warning:
        "Accessing an index outside the array does not throw an error; it normally produces undefined.",

      keyIdea:
        "JavaScript arrays are zero-indexed ordered collections."
    },

    {
      number: 3,
      title: "Adding and Removing Array Elements",
      intro:
        "JavaScript provides methods for changing the contents of an array.",

      code:
`const courses = ["C", "DSA"];

courses.push("Python");

courses.unshift("Maths");

console.log(courses);

courses.pop();

console.log(courses);`,

      output:
`["Maths", "C", "DSA", "Python"]
["Maths", "C", "DSA"]`,

      methods: [
        {
          name: "push()",
          purpose: "Adds one or more elements to the end of an array.",
          example: "courses.push('Python')"
        },
        {
          name: "pop()",
          purpose: "Removes and returns the last element.",
          example: "courses.pop()"
        },
        {
          name: "unshift()",
          purpose: "Adds one or more elements to the beginning.",
          example: "courses.unshift('Maths')"
        },
        {
          name: "shift()",
          purpose: "Removes and returns the first element.",
          example: "courses.shift()"
        }
      ],

      commonMistake:
        "Assuming methods such as push and pop create a new array. They mutate the existing array.",

      keyIdea:
        "push, pop, shift and unshift are convenient but directly change the original array."
    },

    {
      number: 4,
      title: "Iterating Through Arrays",
      intro:
        "Iteration means processing each element in a collection.",

      code:
`const marks = [80, 90, 75, 88];

for (const mark of marks) {
  console.log(mark);
}

marks.forEach(mark => {
  console.log(mark);
});`,

      comparison: {
        headers: ["Technique", "Use", "Important point"],
        rows: [
          ["for", "Maximum control", "Can use index and break/continue"],
          ["for...of", "Read each value", "Simple and readable"],
          ["forEach()", "Run a function for each value", "Cannot break normally from the callback"]
        ]
      },

      keyIdea:
        "Choose the iteration style based on whether you need indexes, early termination or simple processing."
    },

    {
      number: 5,
      title: "map(): Transform Every Element",
      intro:
        "map creates a new array by transforming every element of the original array.",

      code:
`const marks = [70, 80, 90];

const bonusMarks = marks.map(mark => mark + 5);

console.log(marks);
console.log(bonusMarks);`,

      output:
`[70, 80, 90]
[75, 85, 95]`,

      flow: [
        "Read original element",
        "Run transformation function",
        "Produce new value",
        "Store new value in result array"
      ],

      keyIdea:
        "Use map when the result should contain one transformed value for each original value."
    },

    {
      number: 6,
      title: "filter(): Select Matching Elements",
      intro:
        "filter creates a new array containing only elements that satisfy a condition.",

      code:
`const marks = [45, 72, 91, 58, 84];

const passed = marks.filter(mark => mark >= 60);

console.log(passed);`,

      output:
`[72, 91, 84]`,

      flow: [
        "Read an element",
        "Run condition",
        "Condition true → keep element",
        "Condition false → discard element",
        "Return new array"
      ],

      comparison: {
        headers: ["Method", "Question it answers", "Result"],
        rows: [
          ["map()", "What should each value become?", "New transformed array"],
          ["filter()", "Which values should remain?", "New selected array"],
          ["forEach()", "What action should happen for each value?", "Usually no returned collection"]
        ]
      },

      keyIdea:
        "Use filter when the output should contain a subset of the original collection."
    },

    {
      number: 7,
      title: "reduce(): Combine Values",
      intro:
        "reduce processes a collection and combines its values into one accumulated result.",

      code:
`const marks = [70, 80, 90];

const total = marks.reduce(
  (sum, mark) => sum + mark,
  0
);

console.log(total);`,

      output:
`240`,

      breakdown: [
        {
          label: "Initial value",
          description: "The accumulator starts at 0."
        },
        {
          label: "First step",
          description: "0 + 70 becomes 70."
        },
        {
          label: "Second step",
          description: "70 + 80 becomes 150."
        },
        {
          label: "Third step",
          description: "150 + 90 becomes 240."
        }
      ],

      keyIdea:
        "reduce is useful when many values must be combined into one result such as a sum, count or grouped structure."
    },

    {
      number: 8,
      title: "Searching Arrays",
      intro:
        "JavaScript provides several methods for asking questions about array contents.",

      code:
`const students = [
  { name: "Ravi", cgpa: 8.7 },
  { name: "Anu", cgpa: 9.1 },
  { name: "Kiran", cgpa: 7.9 }
];

const topper = students.find(
  student => student.cgpa > 9
);

console.log(topper.name);`,

      output:
`Anu`,

      methods: [
        {
          name: "find()",
          purpose: "Returns the first element that satisfies a condition.",
          example: "students.find(s => s.cgpa > 9)"
        },
        {
          name: "findIndex()",
          purpose: "Returns the index of the first matching element.",
          example: "students.findIndex(s => s.cgpa > 9)"
        },
        {
          name: "some()",
          purpose: "Checks whether at least one element satisfies a condition.",
          example: "students.some(s => s.cgpa > 9)"
        },
        {
          name: "every()",
          purpose: "Checks whether all elements satisfy a condition.",
          example: "students.every(s => s.cgpa >= 7)"
        },
        {
          name: "includes()",
          purpose: "Checks whether an array contains a specific value.",
          example: "courses.includes('DSA')"
        }
      ],

      keyIdea:
        "Use find when you need a matching element, some/every when you need a boolean answer."
    },

    {
      number: 9,
      title: "Objects: Named Data",
      intro:
        "Objects store related information using named properties.",

      code:
`const student = {
  name: "Ravi",
  age: 21,
  branch: "CSE",
  cgpa: 8.7
};

console.log(student.name);
console.log(student.cgpa);`,

      output:
`Ravi
8.7`,

      comparison: {
        headers: ["Access style", "Example", "When useful"],
        rows: [
          ["Dot notation", "student.name", "Known property name"],
          ["Bracket notation", "student['name']", "Dynamic property names"],
          ["Nested access", "student.address.city", "Related structured data"]
        ]
      },

      keyIdea:
        "Objects are ideal for describing an entity through named properties."
    },

    {
      number: 10,
      title: "Adding, Updating and Removing Properties",
      intro:
        "Objects are dynamic: properties can be added, changed or removed during program execution.",

      code:
`const student = {
  name: "Ravi",
  cgpa: 8.2
};

student.cgpa = 8.7;

student.branch = "CSE";

delete student.cgpa;

console.log(student);`,

      output:
`{
  name: "Ravi",
  branch: "CSE"
}`,

      methods: [
        {
          name: "object.property",
          purpose: "Reads or updates a known property.",
          example: "student.cgpa = 8.7"
        },
        {
          name: "object[key]",
          purpose: "Reads or updates a property using a variable key.",
          example: "student[key]"
        },
        {
          name: "delete",
          purpose: "Removes a property from an object.",
          example: "delete student.cgpa"
        }
      ],

      warning:
        "Deleting properties repeatedly can make application data harder to reason about. Often it is clearer to create a new object with the required shape.",

      keyIdea:
        "Object properties are named pieces of data and can be accessed dynamically."
    },

    {
      number: 11,
      title: "Objects Inside Arrays",
      intro:
        "Real applications usually store collections of records as arrays of objects.",

      code:
`const students = [
  {
    name: "Ravi",
    branch: "CSE",
    cgpa: 8.7
  },
  {
    name: "Anu",
    branch: "AIML",
    cgpa: 9.1
  },
  {
    name: "Kiran",
    branch: "CSE",
    cgpa: 7.9
  }
];

const cseStudents =
  students.filter(student => student.branch === "CSE");

console.log(cseStudents);`,

      output:
`Ravi
Kiran`,

      architecture: [
        {
          title: "Collection",
          items: [
            "The outer array represents many students.",
            "Array order can represent display order."
          ]
        },
        {
          title: "Record",
          items: [
            "Each object represents one student.",
            "Each record has its own properties."
          ]
        },
        {
          title: "Properties",
          items: [
            "name identifies the student.",
            "branch describes the department.",
            "cgpa stores academic performance."
          ]
        },
        {
          title: "Transformation",
          items: [
            "filter can select matching students.",
            "map can create display-ready data."
          ]
        },
        {
          title: "Application",
          items: [
            "The resulting data can be rendered into cards, tables or dashboards."
          ]
        }
      ],

      keyIdea:
        "Arrays of objects are one of the most important data shapes in frontend and backend JavaScript."
    },

    {
      number: 12,
      title: "Nested Objects and Arrays",
      intro:
        "Objects and arrays can be nested to represent more complex relationships.",

      code:
`const student = {
  name: "Ravi",
  contact: {
    city: "Hyderabad",
    pincode: 500001
  },
  skills: ["C", "DSA", "JavaScript"]
};

console.log(student.contact.city);
console.log(student.skills[1]);`,

      output:
`Hyderabad
DSA`,

      breakdown: [
        {
          label: "student",
          description: "The outer object represents the complete student record."
        },
        {
          label: "contact",
          description: "A nested object groups related contact information."
        },
        {
          label: "city",
          description: "A property inside the contact object."
        },
        {
          label: "skills",
          description: "An array stores multiple skills."
        },
        {
          label: "skills[1]",
          description: "The second skill is accessed using an array index."
        }
      ],

      commonMistake:
        "Forgetting that each level must be accessed in the correct order: student → contact → city.",

      keyIdea:
        "Nested data allows related information to be grouped without losing structure."
    },

    {
      number: 13,
      title: "Object Destructuring",
      intro:
        "Destructuring extracts properties from objects into variables.",

      code:
`const student = {
  name: "Ravi",
  cgpa: 8.7,
  branch: "CSE"
};

const { name, cgpa } = student;

console.log(name);
console.log(cgpa);`,

      output:
`Ravi
8.7`,

      comparison: {
        headers: ["Without destructuring", "With destructuring"],
        rows: [
          ["const name = student.name;", "const { name } = student;"],
          ["const cgpa = student.cgpa;", "const { cgpa } = student;"],
          ["Repeated object prefix", "Concise extraction"]
        ]
      },

      keyIdea:
        "Destructuring makes it easier to work with selected properties from objects."
    },

    {
      number: 14,
      title: "Array Destructuring",
      intro:
        "Array destructuring extracts values according to their positions.",

      code:
`const colors = ["red", "green", "blue"];

const [first, second, third] = colors;

console.log(first);
console.log(second);
console.log(third);`,

      output:
`red
green
blue`,

      points: [
        "Object destructuring uses property names.",
        "Array destructuring uses positions.",
        "The first array value goes to the first variable.",
        "Skipped values can be ignored using commas."
      ],

      code:
`const values = [10, 20, 30];

const [first, , third] = values;

console.log(first);
console.log(third);`,

      output:
`10
30`,

      keyIdea:
        "Object destructuring is name-based; array destructuring is position-based."
    },

    {
      number: 15,
      title: "Spread Syntax",
      intro:
        "The spread syntax expands values from arrays or objects into a new collection.",

      code:
`const oldCourses = ["C", "DSA"];

const newCourses = [
  ...oldCourses,
  "Python",
  "JavaScript"
];

console.log(newCourses);`,

      output:
`["C", "DSA", "Python", "JavaScript"]`,

      comparison: {
        headers: ["Operation", "Example", "Purpose"],
        rows: [
          ["Copy array", "[...items]", "Create a new array with the same elements"],
          ["Merge arrays", "[...a, ...b]", "Combine array contents"],
          ["Copy object", "{...student}", "Create a shallow object copy"],
          ["Add property", "{...student, cgpa: 9}", "Create updated object data"]
        ]
      },

      keyIdea:
        "Spread is one of the main tools for creating new collections without directly mutating the original."
    },

    {
      number: 16,
      title: "References and Shallow Copies",
      intro:
        "Objects and arrays are reference values, so assigning them to another variable does not automatically create an independent copy.",

      code:
`const original = {
  name: "Ravi"
};

const alias = original;

alias.name = "Anu";

console.log(original.name);`,

      output:
`Anu`,

      explanation:
        "Both variables refer to the same object. Changing the object through one reference is visible through the other reference.",

      comparison: {
        headers: ["Operation", "Meaning", "Independent top-level object?"],
        rows: [
          ["const b = a", "Both variables refer to same object", "No"],
          ["const b = {...a}", "Creates shallow object copy", "Yes"],
          ["const b = [...a]", "Creates shallow array copy", "Yes"]
        ]
      },

      warning:
        "Spread creates only a shallow copy. Nested objects or arrays can still be shared.",

      keyIdea:
        "Understanding references is essential for avoiding accidental state changes."
    },

    {
      number: 17,
      title: "Immutable Array Transformations",
      intro:
        "An immutable transformation creates a new collection instead of changing the original collection.",

      code:
`const marks = [70, 80, 90];

const updatedMarks =
  marks.map(mark => mark + 5);

console.log(marks);
console.log(updatedMarks);`,

      output:
`[70, 80, 90]
[75, 85, 95]`,

      comparison: {
        headers: ["Mutating approach", "Immutable approach"],
        rows: [
          ["marks.push(95)", "[...marks, 95]"],
          ["marks[0] = 100", "[100, ...marks.slice(1)]"],
          ["marks.splice(...)", "filter/map/slice depending on goal"],
          ["Changes existing collection", "Creates a new collection"]
        ]
      },

      realWorld:
        "Immutable data patterns are especially important in React because predictable state updates make rendering and debugging easier.",

      keyIdea:
        "Prefer clear immutable transformations when application state should remain predictable."
    },

    {
      number: 18,
      title: "Sorting and Copying Before Sorting",
      intro:
        "sort changes the original array, so developers often create a copy when the original order must remain unchanged.",

      code:
`const scores = [80, 40, 95, 60];

const sortedScores =
  [...scores].sort((a, b) => b - a);

console.log(scores);
console.log(sortedScores);`,

      output:
`[80, 40, 95, 60]
[95, 80, 60, 40]`,

      warning:
        "Calling sort() directly changes the array. Also remember that the default sort behaviour compares values as strings, so numeric sorting normally needs a comparison function.",

      methods: [
        {
          name: "sort()",
          purpose: "Sorts the array in place.",
          example: "scores.sort((a, b) => a - b)"
        },
        {
          name: "slice()",
          purpose: "Creates a shallow copy of part or all of an array.",
          example: "scores.slice()"
        },
        {
          name: "toSorted()",
          purpose: "Returns a sorted copy without changing the original array.",
          example: "scores.toSorted((a, b) => a - b)"
        }
      ],

      keyIdea:
        "Know which array methods mutate and which return new collections."
    },

    {
      number: 19,
      title: "Practical Data Pipeline",
      intro:
        "Real applications often combine multiple array methods to transform raw data into useful results.",

      code:
`const students = [
  { name: "Ravi", cgpa: 8.7 },
  { name: "Anu", cgpa: 9.2 },
  { name: "Kiran", cgpa: 7.8 },
  { name: "Meena", cgpa: 8.9 }
];

const toppers = students
  .filter(student => student.cgpa >= 8.5)
  .map(student => student.name);

console.log(toppers);`,

      output:
`["Ravi", "Anu", "Meena"]`,

      flow: [
        "Start with student records",
        "filter students with CGPA >= 8.5",
        "Keep only matching records",
        "map each record to its name",
        "Produce final names array"
      ],

      keyIdea:
        "Small, composable transformations are often easier to understand than one large loop."
    },

    {
      number: 20,
      title: "Arrays and Objects in Real Applications",
      intro:
        "The data structures learned here appear everywhere in full-stack development.",

      architecture: [
        {
          title: "API Response",
          items: [
            "Servers commonly return JSON objects and arrays.",
            "Frontend code receives this data as JavaScript values."
          ]
        },
        {
          title: "Application State",
          items: [
            "UI state can contain arrays of records.",
            "Objects can represent the current selected item or form data."
          ]
        },
        {
          title: "Transformation",
          items: [
            "filter selects records.",
            "map prepares display data.",
            "reduce calculates totals or summaries."
          ]
        },
        {
          title: "Rendering",
          items: [
            "JavaScript converts data into visible UI.",
            "React later provides a declarative version of this idea."
          ]
        },
        {
          title: "Backend Data",
          items: [
            "Node.js APIs also receive and return objects and arrays.",
            "Database records are commonly represented as objects."
          ]
        }
      ],

      keyIdea:
        "Arrays and objects form the common language connecting frontend UI, APIs and backend data."
    }

  ],

  visualizer: {
    title: "Array Transformation Visualizer",
    description:
      "Follow a collection through filter and map operations to understand how data changes step by step.",

    steps: [
      {
        title: "Original data",
        operation: "students",
        detail:
          '[Ravi: 8.7, Anu: 9.2, Kiran: 7.8, Meena: 8.9]'
      },
      {
        title: "Apply filter",
        operation: "student => student.cgpa >= 8.5",
        detail:
          "Kiran is removed because 7.8 is below the required CGPA."
      },
      {
        title: "Filtered collection",
        operation: "toppers",
        detail:
          "[Ravi, Anu, Meena] records remain."
      },
      {
        title: "Apply map",
        operation: "student => student.name",
        detail:
          "Each remaining student object is transformed into its name."
      },
      {
        title: "Final result",
        operation: "names",
        detail:
          '["Ravi", "Anu", "Meena"]'
      }
    ]
  },

  trace: {
    title: "Array Transformation Tracer",

    lines: [
      {
        line: 1,
        code: 'const marks = [65, 80, 92, 55];'
      },
      {
        line: 2,
        code: 'const passed = marks.filter(mark => mark >= 60);'
      },
      {
        line: 3,
        code: 'const bonus = passed.map(mark => mark + 5);'
      },
      {
        line: 4,
        code: 'console.log(marks);'
      },
      {
        line: 5,
        code: 'console.log(passed);'
      },
      {
        line: 6,
        code: 'console.log(bonus);'
      }
    ],

    steps: [
      {
        line: 1,
        title: "Create marks",
        detail:
          "marks contains [65, 80, 92, 55]."
      },
      {
        line: 2,
        title: "Filter 65",
        detail:
          "65 >= 60 is true, so 65 enters passed."
      },
      {
        line: 2,
        title: "Filter 80",
        detail:
          "80 >= 60 is true, so 80 enters passed."
      },
      {
        line: 2,
        title: "Filter 92",
        detail:
          "92 >= 60 is true, so 92 enters passed."
      },
      {
        line: 2,
        title: "Filter 55",
        detail:
          "55 >= 60 is false, so 55 is excluded."
      },
      {
        line: 3,
        title: "Map 65",
        detail:
          "65 becomes 70."
      },
      {
        line: 3,
        title: "Map 80",
        detail:
          "80 becomes 85."
      },
      {
        line: 3,
        title: "Map 92",
        detail:
          "92 becomes 97."
      },
      {
        line: 6,
        title: "Final result",
        detail:
          "bonus is [70, 85, 97]. The original marks array remains unchanged."
      }
    ]
  },

  revision: [
    ["Array", "An ordered collection of values indexed from zero."],
    ["Object", "A collection of named properties representing related information."],
    ["Index", "The numeric position of an array element."],
    ["map()", "Creates a new array by transforming every element."],
    ["filter()", "Creates a new array containing elements that pass a condition."],
    ["reduce()", "Combines array values into an accumulated result."],
    ["find()", "Returns the first element that satisfies a condition."],
    ["some()", "Checks whether at least one element satisfies a condition."],
    ["every()", "Checks whether all elements satisfy a condition."],
    ["Destructuring", "Extracts values from arrays or properties from objects."],
    ["Spread", "Expands values into a new array or object."],
    ["Mutation", "Changing an existing object or array directly."],
    ["Immutable transformation", "Creating new data instead of changing the original collection."],
    ["Reference", "A value that points to an object or array in memory."],
    ["Shallow copy", "A new top-level collection whose nested references may still be shared."]
  ],

  interview: [
    {
      question: "What is an array in JavaScript?",
      answer:
        "An array is an ordered collection of values. Its elements are accessed using zero-based numeric indexes."
    },
    {
      question: "What is the difference between an array and an object?",
      answer:
        "Arrays are primarily ordered collections accessed by indexes, while objects organize data using named properties."
    },
    {
      question: "What does map() return?",
      answer:
        "map() returns a new array containing the value produced by the callback for every original element."
    },
    {
      question: "What is the difference between map() and filter()?",
      answer:
        "map transforms every element, while filter keeps only elements whose condition returns true."
    },
    {
      question: "What is reduce() used for?",
      answer:
        "reduce() combines collection values into an accumulated result such as a total, count or grouped object."
    },
    {
      question: "What does find() return when nothing matches?",
      answer:
        "It returns undefined."
    },
    {
      question: "What is the difference between some() and every()?",
      answer:
        "some() checks whether at least one element passes the condition, while every() checks whether all elements pass."
    },
    {
      question: "What is array destructuring?",
      answer:
        "It extracts array elements into variables according to their positions."
    },
    {
      question: "What is object destructuring?",
      answer:
        "It extracts object properties into variables using their property names."
    },
    {
      question: "What does the spread operator do?",
      answer:
        "Spread expands values from an iterable or object into another array or object expression."
    },
    {
      question: "Does const make an object immutable?",
      answer:
        "No. const prevents reassignment of the variable binding, but properties of the referenced object can still be changed."
    },
    {
      question: "What is a shallow copy?",
      answer:
        "A shallow copy creates a new top-level array or object, but nested objects and arrays may still be shared."
    },
    {
      question: "Why can const a = b cause unexpected changes?",
      answer:
        "If b is an object or array, both variables can refer to the same underlying object."
    },
    {
      question: "Why is immutable data useful in frontend development?",
      answer:
        "It makes state changes easier to reason about, compare and debug, and supports predictable UI update patterns."
    },
    {
      question: "Does filter() modify the original array?",
      answer:
        "No. filter() returns a new array and leaves the original array unchanged."
    },
    {
      question: "Does sort() modify the original array?",
      answer:
        "Yes. sort() sorts the array in place. Use a copy or toSorted() when the original should remain unchanged."
    },
    {
      question: "How do you sort numbers correctly?",
      answer:
        "Provide a numeric comparison function such as (a, b) => a - b for ascending order."
    },
    {
      question: "What is an array of objects?",
      answer:
        "It is an array where each element is an object, commonly used to represent collections of records."
    },
    {
      question: "How can you find a student with a CGPA above 9?",
      answer:
        "Use find(), for example: students.find(student => student.cgpa > 9)."
    },
    {
      question: "Why are arrays of objects important in MERN applications?",
      answer:
        "API responses, database records and UI collections are frequently represented as arrays of objects."
    }
  ],

  practice: [
    {
      title: "Marks Transformation",
      difficulty: "Basic",
      task:
        "Create an array of five marks. Use map() to add 5 bonus marks to every value without changing the original array.",
      hints: [
        "map() creates a new array.",
        "Return mark + 5 from the callback.",
        "Print both arrays to confirm the original is unchanged."
      ]
    },
    {
      title: "Passed Students",
      difficulty: "Basic",
      task:
        "Create an array of student objects and use filter() to find students whose CGPA is at least 8.0.",
      hints: [
        "Each student should be an object.",
        "The condition can be student.cgpa >= 8.",
        "filter() returns a new array."
      ]
    },
    {
      title: "Student Names",
      difficulty: "Basic",
      task:
        "Given an array of student objects, use map() to create a new array containing only student names.",
      hints: [
        "map() should return one value for each student.",
        "Return student.name from the callback."
      ]
    },
    {
      title: "Find the Topper",
      difficulty: "Basic",
      task:
        "Use find() to locate the first student whose CGPA is greater than 9.0.",
      hints: [
        "find() returns an object, not an array.",
        "Check student.cgpa inside the callback.",
        "If no student matches, the result will be undefined."
      ]
    },
    {
      title: "Total Marks",
      difficulty: "Intermediate",
      task:
        "Use reduce() to calculate the total of an array containing student marks.",
      hints: [
        "Start the accumulator at 0.",
        "Add the current mark to the accumulator.",
        "The final reduce result should be one number."
      ]
    },
    {
      title: "Course Search",
      difficulty: "Basic",
      task:
        "Create a courses array and use includes() to check whether JavaScript is available.",
      hints: [
        "includes() returns a boolean.",
        "Use the exact value stored in the array."
      ]
    },
    {
      title: "Topper Names",
      difficulty: "Intermediate",
      task:
        "Use filter() followed by map() to create an array containing the names of all students with CGPA 8.5 or higher.",
      hints: [
        "First filter the student objects.",
        "Then map the remaining objects to student.name.",
        "The final result should be an array of strings."
      ]
    },
    {
      title: "Immutable Course Update",
      difficulty: "Intermediate",
      task:
        "Create a courses array and produce a new array with JavaScript added to the end without changing the original array.",
      hints: [
        "Use spread syntax.",
        "Start with ...courses inside a new array.",
        "Add the new course after the spread values."
      ]
    },
    {
      title: "Student Profile",
      difficulty: "Intermediate",
      task:
        "Create a nested student object containing contact information and skills. Access the city and second skill.",
      hints: [
        "Use an object inside the student object.",
        "Store skills in an array.",
        "Remember that array indexes start at 0."
      ]
    },
    {
      title: "Placement Dashboard Data",
      difficulty: "Advanced",
      task:
        "Create an array of student placement records. Filter students above a selected CGPA, map their names, and reduce their package values to calculate the total package amount.",
      hints: [
        "Keep each student as an object.",
        "Use filter() and map() as separate transformations.",
        "Use reduce() when you need one final numeric total.",
        "Keep the original records unchanged."
      ]
    }
  ],

  quiz: [
    {
      question: "What is the first index of a JavaScript array?",
      options: ["0", "1", "-1", "undefined"],
      answer: 0
    },
    {
      question: "Which method creates a new array by transforming every element?",
      options: ["filter()", "map()", "find()", "reduce()"],
      answer: 1
    },
    {
      question: "Which method selects only elements satisfying a condition?",
      options: ["map()", "filter()", "forEach()", "sort()"],
      answer: 1
    },
    {
      question: "Which method commonly combines many values into one result?",
      options: ["reduce()", "find()", "includes()", "slice()"],
      answer: 0
    },
    {
      question: "What does find() return?",
      options: [
        "All matching elements",
        "The first matching element",
        "A boolean only",
        "The array length"
      ],
      answer: 1
    },
    {
      question: "Which method checks whether at least one element passes a condition?",
      options: ["every()", "some()", "map()", "reduce()"],
      answer: 1
    },
    {
      question: "Which syntax accesses the name property?",
      options: [
        "student->name",
        "student.name",
        "student::name",
        "student/name"
      ],
      answer: 1
    },
    {
      question: "What does object destructuring do?",
      options: [
        "Deletes object properties",
        "Extracts properties into variables",
        "Sorts an object",
        "Converts an object to JSON"
      ],
      answer: 1
    },
    {
      question: "What does [...items] generally create?",
      options: [
        "A reference to the same array",
        "A shallow copy of the array",
        "A deep copy of the array",
        "A string"
      ],
      answer: 1
    },
    {
      question: "Does sort() mutate the original array?",
      options: ["Yes", "No", "Only with numbers", "Only with strings"],
      answer: 0
    },
    {
      question: "What does const prevent?",
      options: [
        "All object changes",
        "Reassignment of the binding",
        "Reading the value",
        "Calling methods"
      ],
      answer: 1
    },
    {
      question: "Which structure is commonly used for a collection of student records?",
      options: [
        "Array of objects",
        "Single string",
        "Single number",
        "Boolean only"
      ],
      answer: 0
    }
  ],

  glossary: [
    {
      term: "Array",
      definition:
        "An ordered collection of values accessed using numeric indexes."
    },
    {
      term: "Object",
      definition:
        "A collection of named properties used to represent structured information."
    },
    {
      term: "Index",
      definition:
        "The numeric position of an array element."
    },
    {
      term: "map()",
      definition:
        "Creates a new array by transforming every element."
    },
    {
      term: "filter()",
      definition:
        "Creates a new array containing elements that pass a condition."
    },
    {
      term: "reduce()",
      definition:
        "Processes an array into an accumulated result."
    },
    {
      term: "find()",
      definition:
        "Returns the first element satisfying a condition."
    },
    {
      term: "Destructuring",
      definition:
        "Syntax for extracting values from arrays or properties from objects."
    },
    {
      term: "Spread syntax",
      definition:
        "Syntax that expands array or object values into another collection."
    },
    {
      term: "Mutation",
      definition:
        "Directly changing an existing object or array."
    },
    {
      term: "Immutable transformation",
      definition:
        "Creating new data rather than changing the original collection."
    },
    {
      term: "Reference",
      definition:
        "A value that refers to an object or array rather than containing an independent copy."
    },
    {
      term: "Shallow copy",
      definition:
        "A new top-level object or array whose nested references may still be shared."
    }
  ],

  completion: {
    title: "Level 10 Complete — Think in Data",
    message:
      "You can now model real-world information using arrays and objects, transform collections with " +
      "map/filter/reduce, search structured data and create safer immutable updates.",

    challenge:
      "Build a Placement Dashboard data layer using an array of at least 10 student objects. " +
      "Each student should contain name, branch, CGPA, skills and package information. " +
      "Use filter() to find eligible students, map() to generate display-ready names, " +
      "find() to locate a topper, reduce() to calculate the average or total package, " +
      "some() and every() for validation checks, and spread syntax to create updated records " +
      "without mutating the original data."
  },

  takeaway:
    "Arrays and objects are the core data structures behind JavaScript applications. " +
    "Once you understand how to model data and transform it predictably, you are ready to work " +
    "with the DOM, APIs and eventually React state."
};

console.log(
  "CodeBhavya Full Stack Level 10 loaded: Arrays & Objects"
);
