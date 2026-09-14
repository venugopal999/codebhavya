"use strict";

/*
  CodeBhavya Full Stack
  LEVEL 10 — Arrays & Objects
  Data modelling and immutable transformations
*/

window.FULLSTACK_LESSONS = window.FULLSTACK_LESSONS || {};

window.FULLSTACK_LESSONS[10] = {
  number: 10,
  title: "Arrays & Objects",
  kicker: "JavaScript Engineering · Level 10",
  subtitle: "Model real-world data, transform collections and work safely with objects.",
  estimatedTime: "3–4 hours",
  difficulty: "Intermediate",

  hero: {
    badge: "LEVEL 10 · DATA MODELLING",
    description:
      "Arrays and objects are the main data structures used by JavaScript applications. " +
      "This level teaches you how to create, inspect, search, transform and model data, " +
      "while building the mental model needed for modern frontend and backend development."
  },

  objectives: [
    "Understand how arrays store ordered collections of values.",
    "Create, access, update and transform array data.",
    "Use important array methods such as map, filter, find and reduce.",
    "Understand JavaScript objects and property access.",
    "Model real application data using objects and arrays of objects.",
    "Use destructuring, spread and rest syntax confidently.",
    "Understand references, shallow copies and mutation.",
    "Write immutable transformations suitable for modern JavaScript applications."
  ],

  sections: [

    {
      number: 1,
      title: "What Arrays and Objects Represent",
      intro:
        "JavaScript applications rarely work with isolated values. They usually work with collections " +
        "of related data such as students, products, courses, employees and orders.",

      explanation:
        "An array represents an ordered collection. An object represents a collection of named properties. " +
        "Together they form the foundation of application data modelling.",

      points: [
        "Arrays are ordered collections.",
        "Array positions are identified using indexes starting from 0.",
        "Objects store data using property names.",
        "Arrays can contain objects.",
        "Objects can contain arrays.",
        "Real applications commonly combine both structures."
      ],

      example: {
        label: "Basic data model",
        code:
`const student = {
  name: "Bhavya",
  age: 20,
  skills: ["C", "JavaScript", "Python"]
};

const students = [
  { name: "Bhavya", marks: 88 },
  { name: "Ravi", marks: 76 }
];

console.log(student.skills);
console.log(students[0].name);`,
        output:
`["C", "JavaScript", "Python"]
Bhavya`
      },

      realWorld:
        "A placement application might represent one student as an object and all students as an array of objects.",

      keyIdea:
        "Think of arrays as collections and objects as structured records."
    },

    {
      number: 2,
      title: "Creating and Accessing Arrays",
      intro:
        "Arrays are created using square brackets. Every element receives a zero-based index.",

      explanation:
        "The first element is at index 0, the second at index 1, and so on. " +
        "The length property tells you how many elements currently exist.",

      code:
`const courses = ["C", "DSA", "Python", "JavaScript"];

console.log(courses[0]);
console.log(courses[2]);
console.log(courses.length);`,

      output:
`C
Python
4`,

      points: [
        "Indexing starts at 0.",
        "The last valid index is length - 1.",
        "Accessing a missing index normally returns undefined.",
        "Arrays can contain mixed JavaScript values, although consistent data is usually better."
      ],

      warning:
        "Do not confuse an array index with the number of an element. The first element has index 0, not 1.",

      commonMistake:
        "Using courses[courses.length] to access the final element. The correct index is courses.length - 1.",

      keyIdea:
        "For an array of length n, valid indexes range from 0 through n - 1."
    },

    {
      number: 3,
      title: "Updating, Adding and Removing Elements",
      intro:
        "Arrays can be changed using methods such as push, pop, shift and unshift.",

      explanation:
        "These methods mutate the original array. Understanding which operations mutate data becomes important later when working with React and predictable application state.",

      code:
`const tasks = ["Learn HTML", "Learn CSS"];

tasks.push("Learn JavaScript");
console.log(tasks);

tasks.pop();
console.log(tasks);

tasks.unshift("Open CodeBhavya");
console.log(tasks);

tasks.shift();
console.log(tasks);`,

      output:
`["Learn HTML", "Learn CSS", "Learn JavaScript"]
["Learn HTML", "Learn CSS"]
["Open CodeBhavya", "Learn HTML", "Learn CSS"]
["Learn HTML", "Learn CSS"]`,

      methods: [
        ["push()", "Adds one or more elements to the end."],
        ["pop()", "Removes and returns the last element."],
        ["unshift()", "Adds one or more elements to the beginning."],
        ["shift()", "Removes and returns the first element."]
      ],

      warning:
        "push, pop, shift and unshift modify the original array.",

      keyIdea:
        "Know whether an array method mutates the original collection."
    },

    {
      number: 4,
      title: "slice() and splice()",
      intro:
        "These two methods have similar names but very different behaviour.",

      explanation:
        "slice creates a new portion of an array without modifying the original array. " +
        "splice changes the original array by removing, replacing or inserting elements.",

      comparison: [
        ["slice()", "Does not mutate", "Creates a portion/copy"],
        ["splice()", "Mutates", "Adds, removes or replaces elements"]
      ],

      code:
`const numbers = [10, 20, 30, 40, 50];

const part = numbers.slice(1, 4);

console.log(part);
console.log(numbers);

numbers.splice(2, 1);

console.log(numbers);`,

      output:
`[20, 30, 40]
[10, 20, 30, 40, 50]
[10, 20, 40, 50]`,

      commonMistake:
        "Assuming the second argument of slice is a count. It is an ending index and is excluded.",

      keyIdea:
        "slice is commonly useful for non-mutating operations; splice changes the original array."
    },

    {
      number: 5,
      title: "Searching Arrays",
      intro:
        "Applications frequently need to determine whether data exists or locate a particular item.",

      explanation:
        "JavaScript provides several methods for searching arrays. The correct method depends on whether you need a boolean, an index or the actual element.",

      methods: [
        ["includes()", "Checks whether a value exists and returns true or false."],
        ["indexOf()", "Returns the first matching index or -1."],
        ["find()", "Returns the first element matching a condition."],
        ["findIndex()", "Returns the index of the first matching element."]
      ],

      code:
`const scores = [45, 72, 88, 91];

console.log(scores.includes(88));
console.log(scores.indexOf(72));

const firstHighScore = scores.find(score => score > 80);
const highScoreIndex = scores.findIndex(score => score > 80);

console.log(firstHighScore);
console.log(highScoreIndex);`,

      output:
`true
1
88
2`,

      keyIdea:
        "Choose the search method based on what information your application needs."
    },

    {
      number: 6,
      title: "map() — Transform Every Element",
      intro:
        "map is one of the most important array methods in modern JavaScript.",

      explanation:
        "map visits every element and creates a new array containing the returned result for each element.",

      code:
`const prices = [100, 200, 300];

const discounted = prices.map(price => price * 0.9);

console.log(prices);
console.log(discounted);`,

      output:
`[100, 200, 300]
[90, 180, 270]`,

      points: [
        "map returns a new array.",
        "The number of output elements normally matches the input.",
        "The callback decides what each output element becomes.",
        "map is ideal for transformation."
      ],

      commonMistake:
        "Using map when you actually want to remove elements. Use filter for selection.",

      keyIdea:
        "map answers: 'What should each element become?'"
    },

    {
      number: 7,
      title: "filter() — Select Matching Elements",
      intro:
        "filter creates a new array containing only elements that satisfy a condition.",

      explanation:
        "The callback should return a truthy or falsy result. Elements producing a truthy result are kept.",

      code:
`const marks = [42, 67, 81, 55, 93];

const passed = marks.filter(mark => mark >= 60);

console.log(passed);`,

      output:
`[67, 81, 93]`,

      points: [
        "filter returns a new array.",
        "The result can contain fewer elements than the input.",
        "The original array is not changed.",
        "The callback represents the selection rule."
      ],

      keyIdea:
        "filter answers: 'Which elements should remain?'"
    },

    {
      number: 8,
      title: "find() and findIndex()",
      intro:
        "When you only need the first matching item, find is often more appropriate than filter.",

      explanation:
        "find stops after locating the first matching element. findIndex similarly returns the position of that element.",

      code:
`const users = [
  { id: 101, name: "Anu" },
  { id: 102, name: "Ravi" },
  { id: 103, name: "Bhavya" }
];

const user = users.find(user => user.id === 103);
const index = users.findIndex(user => user.id === 103);

console.log(user);
console.log(index);`,

      output:
`{ id: 103, name: "Bhavya" }
2`,

      realWorld:
        "Finding a logged-in user, product by ID or student by roll number is a common use case.",

      keyIdea:
        "Use find when you need the first matching object rather than a collection of matches."
    },

    {
      number: 9,
      title: "reduce() — Build One Result",
      intro:
        "reduce processes an array and combines its elements into one final result.",

      explanation:
        "The result can be a number, string, object, array or another structure. " +
        "The accumulator stores the result built during the iteration.",

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
        ["Start", "sum = 0"],
        ["1st element", "0 + 70 = 70"],
        ["2nd element", "70 + 80 = 150"],
        ["3rd element", "150 + 90 = 240"]
      ],

      commonMistake:
        "Using reduce without understanding what the accumulator represents.",

      keyIdea:
        "reduce answers: 'How can I combine this collection into one result?'"
    },

    {
      number: 10,
      title: "forEach() and Iteration",
      intro:
        "forEach is useful when you want to perform an action for every element without creating a transformed array.",

      explanation:
        "Unlike map, forEach does not produce a useful transformed array. It is commonly used for side effects such as logging or updating an external system.",

      code:
`const names = ["Anu", "Ravi", "Bhavya"];

names.forEach((name, index) => {
  console.log(index, name);
});`,

      output:
`0 Anu
1 Ravi
2 Bhavya`,

      comparison: [
        ["forEach()", "Perform an action for each item"],
        ["map()", "Create a transformed array"],
        ["filter()", "Create a selected subset"],
        ["find()", "Return the first matching item"],
        ["reduce()", "Build one accumulated result"]
      ],

      keyIdea:
        "The array method should describe the intention of your operation."
    },

    {
      number: 11,
      title: "Sorting and Reversing Arrays",
      intro:
        "Sorting and reversing are common collection operations, but they have important mutation behaviour.",

      explanation:
        "sort and reverse mutate the original array. Also, sort compares values as strings by default, which can surprise beginners when sorting numbers.",

      code:
`const numbers = [10, 2, 30, 4];

numbers.sort();

console.log(numbers);

numbers.sort((a, b) => a - b);

console.log(numbers);`,

      output:
`[10, 2, 30, 4]
[2, 4, 10, 30]`,

      warning:
        "Array.prototype.sort() uses string-style comparison by default.",

      points: [
        "sort() mutates the array.",
        "For ascending numbers use (a, b) => a - b.",
        "For descending numbers use (a, b) => b - a.",
        "reverse() also mutates the original array."
      ],

      keyIdea:
        "Always provide a numeric comparator when sorting numbers."
    },

    {
      number: 12,
      title: "Objects and Properties",
      intro:
        "Objects allow related information to be represented using meaningful property names.",

      explanation:
        "Instead of remembering that index 0 means a student's name and index 1 means marks, an object explicitly names each value.",

      code:
`const student = {
  name: "Bhavya",
  rollNo: 101,
  branch: "CSE-AI",
  cgpa: 8.7
};

console.log(student.name);
console.log(student.cgpa);`,

      output:
`Bhavya
8.7`,

      points: [
        "Properties are key-value pairs.",
        "Property names identify the stored values.",
        "Values can be primitives, arrays, functions or other objects.",
        "Objects can model real-world entities."
      ],

      keyIdea:
        "An object describes an entity through named properties."
    },

    {
      number: 13,
      title: "Dot Notation vs Bracket Notation",
      intro:
        "JavaScript provides two main ways to access object properties.",

      explanation:
        "Dot notation is convenient when the property name is known directly. Bracket notation is useful when the property name comes from a variable or contains characters that make dot notation unsuitable.",

      code:
`const student = {
  name: "Bhavya",
  cgpa: 8.7
};

console.log(student.name);
console.log(student["cgpa"]);

const property = "name";

console.log(student[property]);`,

      output:
`Bhavya
8.7
Bhavya`,

      comparison: [
        ["student.name", "Direct property access"],
        ["student[property]", "Dynamic property access"]
      ],

      commonMistake:
        "Writing student.property when property is a variable. That looks for a property literally named 'property'.",

      keyIdea:
        "Bracket notation allows property names to be selected dynamically."
    },

    {
      number: 14,
      title: "Adding, Updating and Deleting Properties",
      intro:
        "Objects are flexible structures whose properties can be added or changed.",

      code:
`const user = {
  name: "Ravi"
};

user.age = 21;
user.name = "Rahul";

delete user.age;

console.log(user);`,

      output:
`{ name: "Rahul" }`,

      points: [
        "Assignment can create a new property.",
        "Assignment can update an existing property.",
        "delete removes an object property.",
        "In application code, unnecessary mutation should be avoided when predictable state matters."
      ],

      warning:
        "Deleting or changing shared objects can create difficult-to-track side effects.",

      keyIdea:
        "Objects are mutable by default, but application design can choose safer immutable patterns."
    },

    {
      number: 15,
      title: "Nested Objects and Arrays",
      intro:
        "Real application data is rarely flat. Objects often contain arrays and other objects.",

      code:
`const student = {
  name: "Bhavya",
  contact: {
    city: "Hyderabad",
    email: "student@example.com"
  },
  skills: ["C", "DSA", "JavaScript"],
  placement: {
    company: "CodeTech",
    package: 8
  }
};

console.log(student.contact.city);
console.log(student.skills[2]);
console.log(student.placement.package);`,

      output:
`Hyderabad
JavaScript
8`,

      points: [
        "Nested objects model related sub-information.",
        "Arrays can appear inside objects.",
        "Objects can appear inside arrays.",
        "Deeply nested data should be designed carefully for maintainability."
      ],

      keyIdea:
        "Use nesting when the data has a genuine hierarchical relationship."
    },

    {
      number: 16,
      title: "Arrays of Objects",
      intro:
        "Arrays of objects are among the most important structures in frontend development.",

      explanation:
        "APIs frequently return collections of records in this form. Learning to transform arrays of objects prepares you for React, REST APIs, databases and MERN applications.",

      code:
`const students = [
  { name: "Anu", marks: 72 },
  { name: "Ravi", marks: 58 },
  { name: "Bhavya", marks: 91 }
];

const toppers = students
  .filter(student => student.marks >= 80)
  .map(student => student.name);

console.log(toppers);`,

      output:
`["Bhavya"]`,

      flow: [
        "Start with all student objects.",
        "filter keeps students with marks >= 80.",
        "map converts the remaining objects into names.",
        "The final result is a new array of names."
      ],

      realWorld:
        "This pattern appears constantly when displaying products, students, employees, posts or API records in a user interface.",

      keyIdea:
        "Learn to combine array methods with object property access."
    },

    {
      number: 17,
      title: "Destructuring",
      intro:
        "Destructuring provides a concise way to extract values from arrays and objects.",

      code:
`const student = {
  name: "Bhavya",
  cgpa: 8.7,
  branch: "CSE-AI"
};

const { name, cgpa } = student;

console.log(name);
console.log(cgpa);

const marks = [88, 91, 84];

const [first, second] = marks;

console.log(first);
console.log(second);`,

      output:
`Bhavya
8.7
88
91`,

      points: [
        "Object destructuring uses property names.",
        "Array destructuring uses positions.",
        "Destructuring can make code easier to read.",
        "It is widely used in modern JavaScript and React."
      ],

      keyIdea:
        "Destructuring extracts the values you need from a larger structure."
    },

    {
      number: 18,
      title: "Spread and Rest Syntax",
      intro:
        "The same ... syntax can be used in two related but different ways.",

      explanation:
        "Spread expands values from an existing array or object. Rest collects remaining values into a new array or object.",

      code:
`const oldSkills = ["C", "DSA"];
const newSkills = [...oldSkills, "JavaScript"];

console.log(newSkills);

const student = {
  name: "Bhavya",
  cgpa: 8.7
};

const updatedStudent = {
  ...student,
  cgpa: 9.0
};

console.log(updatedStudent);`,

      output:
`["C", "DSA", "JavaScript"]
{ name: "Bhavya", cgpa: 9 }`,

      comparison: [
        ["Spread", "Expands an existing collection into another collection."],
        ["Rest", "Collects remaining values into a collection."]
      ],

      keyIdea:
        "Spread is especially important for creating updated arrays and objects without mutating the original."
    },

    {
      number: 19,
      title: "Reference Behaviour and Shallow Copies",
      intro:
        "One of the most important JavaScript concepts is that objects and arrays are reference values.",

      explanation:
        "When two variables refer to the same object, changing the object through one reference can be observed through the other.",

      code:
`const original = {
  name: "Bhavya"
};

const alias = original;

alias.name = "Ravi";

console.log(original.name);
console.log(alias.name);`,

      output:
`Ravi
Ravi`,

      explanation2:
        "The variables do not contain two independent objects. Both references point to the same object.",

      warning:
        "Assigning an object to another variable does not automatically create an independent copy.",

      keyIdea:
        "For objects and arrays, assignment copies the reference, not the complete structure."
    },

    {
      number: 20,
      title: "Immutable Array Transformations",
      intro:
        "Modern frontend applications often prefer creating new data instead of changing existing data directly.",

      explanation:
        "Immutable transformation means producing a new array or object while leaving the original value unchanged.",

      code:
`const students = [
  { name: "Anu", marks: 70 },
  { name: "Bhavya", marks: 85 }
];

const updatedStudents = students.map(student => ({
  ...student,
  marks: student.marks + 5
}));

console.log(students);
console.log(updatedStudents);`,

      output:
`[
  { name: "Anu", marks: 70 },
  { name: "Bhavya", marks: 85 }
]

[
  { name: "Anu", marks: 75 },
  { name: "Bhavya", marks: 90 }
]`,

      points: [
        "map creates a new array.",
        "The spread operator creates a new object for each student.",
        "The original students array remains unchanged.",
        "This approach is especially useful when managing UI state."
      ],

      commonMistake:
        "Changing student.marks directly inside a shared data structure when the goal is to create updated state.",

      keyIdea:
        "Immutable code makes changes explicit and reduces unexpected side effects."
    },

    {
      number: 21,
      title: "Combining Array Methods",
      intro:
        "Professional JavaScript frequently combines filter, map, sort and reduce to express data-processing pipelines.",

      code:
`const students = [
  { name: "Anu", marks: 72 },
  { name: "Ravi", marks: 88 },
  { name: "Bhavya", marks: 95 },
  { name: "Kiran", marks: 64 }
];

const result = students
  .filter(student => student.marks >= 70)
  .map(student => ({
    name: student.name,
    marks: student.marks
  }))
  .sort((a, b) => b.marks - a.marks);

console.log(result);`,

      output:
`[
  { name: "Bhavya", marks: 95 },
  { name: "Ravi", marks: 88 },
  { name: "Anu", marks: 72 }
]`,

      breakdown: [
        ["filter", "Remove students below 70."],
        ["map", "Create the output object structure."],
        ["sort", "Order the remaining students by marks."]
      ],

      keyIdea:
        "Readable data pipelines can express complex transformations without manual index management."
    },

    {
      number: 22,
      title: "Choosing the Right Array Method",
      intro:
        "Knowing syntax is not enough. Good JavaScript developers choose methods according to intent.",

      comparison: [
        ["Need to transform every item", "map()"],
        ["Need only matching items", "filter()"],
        ["Need first matching item", "find()"],
        ["Need first matching index", "findIndex()"],
        ["Need to check existence", "includes()"],
        ["Need one accumulated result", "reduce()"],
        ["Need to perform an action", "forEach()"],
        ["Need a portion without mutation", "slice()"]
      ],

      warning:
        "Do not choose a method only because you remember its syntax. Start by identifying the desired result.",

      keyIdea:
        "Good array code communicates intent."
    },

    {
      number: 23,
      title: "Real-World Data Modelling",
      intro:
        "A full-stack developer constantly converts real-world entities into structured data.",

      architecture: [
        ["Student", "Object representing one student"],
        ["Students", "Array containing many student objects"],
        ["Course", "Object representing one course"],
        ["Courses", "Array containing many course objects"],
        ["Enrollment", "Object connecting a student and course"]
      ],

      code:
`const course = {
  id: 101,
  title: "JavaScript",
  instructor: {
    name: "Bhavya",
    experience: 8
  },
  topics: [
    "Variables",
    "Functions",
    "Arrays",
    "Objects"
  ],
  students: [
    { id: 1, name: "Anu" },
    { id: 2, name: "Ravi" }
  ]
};

console.log(course.title);
console.log(course.topics.length);
console.log(course.students[1].name);`,

      output:
`JavaScript
4
Ravi`,

      realWorld:
        "This mental model becomes directly useful when consuming JSON APIs and working with MongoDB documents in later MERN levels.",

      keyIdea:
        "Good data modelling makes later frontend, API and database work easier."
    },

    {
      number: 24,
      title: "Safe Transformation Patterns",
      intro:
        "The most useful Level 10 skill is not memorising methods. It is learning to transform data predictably.",

      points: [
        "Prefer map for transformation.",
        "Prefer filter for selection.",
        "Prefer find for one matching item.",
        "Prefer reduce for accumulation.",
        "Use spread when creating updated arrays or objects.",
        "Be conscious of methods that mutate data.",
        "Keep transformation steps readable.",
        "Avoid unnecessary deeply nested data."
      ],

      warning:
        "Do not create complicated one-line pipelines just to make code shorter. Readability is more important than cleverness.",

      keyIdea:
        "Professional JavaScript balances concise syntax with clear intent."
    }

  ],

  visualizer: {
    title: "Array Transformation Visualizer",
    description:
      "Follow a collection as it moves through filter, map and sort operations.",
    steps: [
      {
        title: "Original data",
        operation: "students",
        detail:
          '[Anu:72, Ravi:88, Bhavya:95, Kiran:64]'
      },
      {
        title: "Filter",
        operation: "marks >= 70",
        detail:
          'Kiran is removed because 64 does not satisfy the condition.'
      },
      {
        title: "Remaining collection",
        operation: "filter result",
        detail:
          '[Anu:72, Ravi:88, Bhavya:95]'
      },
      {
        title: "Map",
        operation: "select name and marks",
        detail:
          'Each student object is transformed into the required output shape.'
      },
      {
        title: "Sort",
        operation: "marks descending",
        detail:
          '[Bhavya:95, Ravi:88, Anu:72]'
      }
    ]
  },

  trace: {
    title: "Array & Object Transformation Tracer",
    lines: [
      {
        line: 1,
        code: 'const students = ['
      },
      {
        line: 2,
        code: '  { name: "Anu", marks: 72 },'
      },
      {
        line: 3,
        code: '  { name: "Ravi", marks: 88 },'
      },
      {
        line: 4,
        code: '  { name: "Bhavya", marks: 95 }'
      },
      {
        line: 5,
        code: '];'
      },
      {
        line: 6,
        code: 'const toppers = students'
      },
      {
        line: 7,
        code: '  .filter(s => s.marks >= 80)'
      },
      {
        line: 8,
        code: '  .map(s => s.name);'
      },
      {
        line: 9,
        code: 'console.log(toppers);'
      }
    ],

    steps: [
      {
        line: 1,
        title: "Create the array",
        detail:
          "students is created as an array containing three student objects."
      },
      {
        line: 6,
        title: "Begin transformation",
        detail:
          "The students collection becomes the input to a transformation pipeline."
      },
      {
        line: 7,
        title: "Run filter",
        detail:
          "Only students whose marks are at least 80 are retained."
      },
      {
        line: 7,
        title: "Evaluate Anu",
        detail:
          "72 >= 80 is false, so Anu is excluded."
      },
      {
        line: 7,
        title: "Evaluate Ravi",
        detail:
          "88 >= 80 is true, so Ravi remains."
      },
      {
        line: 7,
        title: "Evaluate Bhavya",
        detail:
          "95 >= 80 is true, so Bhavya remains."
      },
      {
        line: 8,
        title: "Run map",
        detail:
          "The remaining student objects are transformed into their names."
      },
      {
        line: 9,
        title: "Final result",
        detail:
          'The result is ["Ravi", "Bhavya"].'
      }
    ]
  },

  revision: [
    ["Array", "An ordered collection of values."],
    ["Index", "Zero-based position of an array element."],
    ["Object", "A collection of named properties."],
    ["map()", "Creates a new array by transforming every element."],
    ["filter()", "Creates a new array containing matching elements."],
    ["find()", "Returns the first element satisfying a condition."],
    ["findIndex()", "Returns the index of the first matching element."],
    ["reduce()", "Combines array elements into one accumulated result."],
    ["forEach()", "Runs a function for every array element."],
    ["Destructuring", "Extracts values from arrays or objects."],
    ["Spread", "Expands values from an existing collection."],
    ["Rest", "Collects remaining values into a collection."],
    ["Mutation", "Changing an existing array or object."],
    ["Immutable transformation", "Creating updated data without changing the original."],
    ["Reference", "A value pointing to an object or array in memory."]
  ],

  interview: [
    {
      question: "What is the difference between an array and an object?",
      answer:
        "An array is an ordered collection accessed primarily through numeric indexes, while an object stores named properties."
    },
    {
      question: "Why does array indexing start at zero?",
      answer:
        "JavaScript arrays use zero-based indexing, so the first element is at position 0 and the last element is at length - 1."
    },
    {
      question: "What does map() return?",
      answer:
        "map returns a new array containing the transformed result for each input element."
    },
    {
      question: "What is the difference between map() and filter()?",
      answer:
        "map transforms every element, while filter selects only elements satisfying a condition."
    },
    {
      question: "What is the difference between find() and filter()?",
      answer:
        "find returns the first matching element, while filter returns a new array containing all matching elements."
    },
    {
      question: "What does reduce() do?",
      answer:
        "reduce processes a collection and builds one accumulated result."
    },
    {
      question: "Does forEach() return a new array?",
      answer:
        "No. forEach is intended for performing an action for each element."
    },
    {
      question: "Why can sort() produce unexpected numeric results?",
      answer:
        "sort compares values as strings by default. A numeric comparator such as (a, b) => a - b should be used for numeric sorting."
    },
    {
      question: "Does slice() mutate the original array?",
      answer:
        "No. slice creates a new array containing the requested portion."
    },
    {
      question: "Does splice() mutate the original array?",
      answer:
        "Yes. splice modifies the original array."
    },
    {
      question: "What is object destructuring?",
      answer:
        "It is syntax for extracting named properties from an object into variables."
    },
    {
      question: "What is array destructuring?",
      answer:
        "It extracts values from an array according to their positions."
    },
    {
      question: "What does the spread operator do with objects?",
      answer:
        "It expands an object's enumerable properties into another object."
    },
    {
      question: "What is the difference between spread and rest?",
      answer:
        "Spread expands values, while rest collects remaining values."
    },
    {
      question: "Why does const not make an object immutable?",
      answer:
        "const prevents reassignment of the binding, but properties of the referenced object can still be changed."
    },
    {
      question: "What happens when one object is assigned to another variable?",
      answer:
        "The reference is copied, so both variables can refer to the same object."
    },
    {
      question: "What is an immutable transformation?",
      answer:
        "It creates a new data structure instead of modifying the existing one."
    },
    {
      question: "Why are arrays of objects common in frontend applications?",
      answer:
        "They naturally represent collections of entities such as students, products, posts and users."
    },
    {
      question: "How would you find a student by ID?",
      answer:
        "Use find(), for example students.find(student => student.id === targetId)."
    },
    {
      question: "How would you get only the names of students scoring above 80?",
      answer:
        "Use filter() followed by map(), for example students.filter(s => s.marks > 80).map(s => s.name)."
    }
  ],

  practice: [
    {
      title: "Array Explorer",
      description:
        "Create an array of five course names. Display the first item, last item, length and every item using iteration."
    },
    {
      title: "Marks Filter",
      description:
        "Create an array of student marks and use filter() to create a new array containing only marks of 60 or above."
    },
    {
      title: "Price Transformer",
      description:
        "Create an array of product prices and use map() to apply a 10% discount without changing the original array."
    },
    {
      title: "Student Search",
      description:
        "Create an array of student objects and use find() to locate a student using a unique ID."
    },
    {
      title: "Topper List",
      description:
        "Given an array of student objects, use filter() and map() to produce the names of students scoring at least 80."
    },
    {
      title: "Marks Calculator",
      description:
        "Use reduce() to calculate the total and average marks of an array."
    },
    {
      title: "Object Destructuring",
      description:
        "Create a student object containing name, branch, CGPA and skills. Extract selected properties using destructuring."
    },
    {
      title: "Immutable Update",
      description:
        "Create an array of student objects and produce a new array where every student's marks increase by 5 without changing the original array."
    },
    {
      title: "Placement Shortlist",
      description:
        "Create student records containing CGPA and skills. Filter eligible students and map them into a shortlist containing only their names and CGPA."
    },
    {
      title: "Course Data Model",
      description:
        "Design an object representing a course with instructor details, topics and enrolled students. Access at least five nested values."
    }
  ],

  quiz: [
    {
      question: "What is the index of the first element in a JavaScript array?",
      options: ["0", "1", "-1", "first"],
      answer: 0
    },
    {
      question: "Which method creates a new array by transforming every element?",
      options: ["filter()", "map()", "find()", "forEach()"],
      answer: 1
    },
    {
      question: "Which method selects elements that satisfy a condition?",
      options: ["map()", "reduce()", "filter()", "sort()"],
      answer: 2
    },
    {
      question: "Which method returns the first matching element?",
      options: ["find()", "filter()", "includes()", "map()"],
      answer: 0
    },
    {
      question: "Which method is designed to build an accumulated result?",
      options: ["forEach()", "reduce()", "find()", "slice()"],
      answer: 1
    },
    {
      question: "Which operation mutates the original array?",
      options: ["slice()", "map()", "filter()", "splice()"],
      answer: 3
    },
    {
      question: "What does object destructuring do?",
      options: [
        "Deletes object properties",
        "Extracts object properties into variables",
        "Sorts an object",
        "Converts an object into an array"
      ],
      answer: 1
    },
    {
      question: "What does the spread operator commonly help with?",
      options: [
        "Creating updated arrays and objects",
        "Deleting variables",
        "Stopping loops",
        "Declaring functions"
      ],
      answer: 0
    },
    {
      question: "What does assignment of an object to another variable copy?",
      options: [
        "The complete object",
        "Only primitive properties",
        "The reference",
        "Nothing"
      ],
      answer: 2
    },
    {
      question: "What is the default comparison behaviour of sort()?",
      options: [
        "Numeric ascending",
        "Numeric descending",
        "String-style comparison",
        "Random ordering"
      ],
      answer: 2
    },
    {
      question: "Which method checks whether an array contains a value?",
      options: ["includes()", "contains()", "hasValue()", "exists()"],
      answer: 0
    },
    {
      question: "Which structure is best for representing one student with named fields?",
      options: ["Object", "String", "Number", "Boolean"],
      answer: 0
    }
  ],

  glossary: [
    {
      term: "Array",
      definition:
        "An ordered collection of values."
    },
    {
      term: "Object",
      definition:
        "A collection of named properties representing structured data."
    },
    {
      term: "Index",
      definition:
        "The numeric position of an element in an array."
    },
    {
      term: "Mutation",
      definition:
        "A change made directly to an existing array or object."
    },
    {
      term: "map",
      definition:
        "An array method that creates a transformed array."
    },
    {
      term: "filter",
      definition:
        "An array method that keeps elements satisfying a condition."
    },
    {
      term: "reduce",
      definition:
        "An array method that combines elements into an accumulated result."
    },
    {
      term: "Destructuring",
      definition:
        "Syntax used to extract values from arrays or objects."
    },
    {
      term: "Spread",
      definition:
        "Syntax that expands values from an existing iterable or object."
    },
    {
      term: "Reference",
      definition:
        "A value that identifies an object or array rather than containing an independent copy."
    },
    {
      term: "Immutable",
      definition:
        "A programming approach where existing data is not directly modified."
    },
    {
      term: "Data model",
      definition:
        "A structured representation of information used by an application."
    }
  ],

  completion: {
    title: "Level 10 Complete — Think in Data",
    message:
      "You can now model application data using arrays and objects, search and transform collections, " +
      "and create immutable updates. These skills are essential for React interfaces, REST APIs and MERN applications.",

    challenge:
      "Build a Student Placement Dashboard data model. Store at least 8 students as objects inside an array. " +
      "Each student should contain an ID, name, branch, CGPA, skills and placement status. " +
      "Then create separate derived collections for eligible students, placed students, top CGPA students " +
      "and a list containing only student names. Do not mutate the original collection."
  },

  takeaway:
    "Arrays manage collections. Objects model entities. " +
    "map transforms, filter selects, find locates, reduce accumulates, " +
    "and spread helps create immutable updates. " +
    "Mastering these patterns gives you the data-handling foundation required for React and MERN."
};

console.log(
  "CodeBhavya Full Stack Level 10 loaded: Arrays & Objects"
);
