/* =========================================================
   CODEBHAVYA · FULL STACK · MERN
   LEVEL 10 — JAVASCRIPT ARRAYS & OBJECTS
   ========================================================= */

window.FULLSTACK_LESSONS = window.FULLSTACK_LESSONS || {};

window.FULLSTACK_LESSONS[10] = {

  id: 10,

  title: "JavaScript Arrays & Objects",

  kicker: "LEVEL 10 · JAVASCRIPT ENGINEERING",

  summary:
    "Learn how JavaScript stores, organizes, transforms and processes collections of data using arrays and objects.",

  hero: {
    title: "Arrays & Objects",
    subtitle:
      "Move from individual values to real-world data structures used in applications, APIs and MERN projects."
  },

  objectives: [
    "Create, access and modify JavaScript arrays.",
    "Understand indexing, length and array mutation.",
    "Add and remove array elements safely.",
    "Iterate through arrays using modern JavaScript techniques.",
    "Use forEach(), for...of and traditional loops appropriately.",
    "Search and filter collections of data.",
    "Transform data using map().",
    "Aggregate data using reduce().",
    "Understand JavaScript objects and key-value data.",
    "Use dot notation and bracket notation.",
    "Work with nested objects.",
    "Create and use object methods.",
    "Use destructuring with arrays and objects.",
    "Understand spread and rest syntax.",
    "Process arrays of objects like real application data.",
    "Choose appropriate data structures for practical problems."
  ],

  outcomes: [
    "Build programs that process collections of values.",
    "Transform raw data into useful application data.",
    "Work confidently with arrays of objects.",
    "Understand common data-processing patterns used in frontend and backend JavaScript.",
    "Be ready for common placement questions involving arrays, objects and higher-order methods."
  ],

  concepts: [

    /* =====================================================
       CONCEPT 01
       ===================================================== */

    {
      id: 1,

      title: "Why Arrays & Objects Matter",

      explanation: `
        Real applications rarely work with only one value.

        A placement portal may contain hundreds of students.
        An e-commerce application may contain thousands of products.
        A college management system may contain students, marks,
        departments and courses.

        JavaScript mainly uses two structures to organize such data:

        1. Arrays
        2. Objects

        An array is useful when we have an ordered collection.

        An object is useful when we want to describe an entity
        using named properties.

        Example:

        const marks = [78, 85, 91];

        const student = {
          name: "Ravi",
          branch: "CSE",
          cgpa: 8.7
        };

        Arrays answer:
        "What values are in this collection?"

        Objects answer:
        "What properties describe this entity?"
      `,

      example: `const students = ["Ravi", "Anita", "Kiran"];

const student = {
  name: "Ravi",
  branch: "CSE",
  cgpa: 8.7
};

console.log(students);
console.log(student);`,

      keyPoints: [
        "Arrays represent collections.",
        "Objects represent entities or structured records.",
        "Real applications commonly combine arrays and objects.",
        "Arrays and objects are fundamental to JSON and API data."
      ]
    },

    /* =====================================================
       CONCEPT 02
       ===================================================== */

    {
      id: 2,

      title: "Creating Arrays & Indexing",

      explanation: `
        An array is created using square brackets.

        const languages = ["C", "Python", "JavaScript"];

        JavaScript arrays use zero-based indexing.

        languages[0] → "C"
        languages[1] → "Python"
        languages[2] → "JavaScript"

        The first element is always at index 0.

        The last element can be accessed using:

        array[array.length - 1]

        Example:

        const scores = [70, 82, 95];

        scores.length is 3.

        Therefore:

        scores[scores.length - 1]

        gives 95.
      `,

      example: `const languages = ["C", "Python", "JavaScript"];

console.log(languages[0]);
console.log(languages[1]);
console.log(languages[2]);

console.log("Total:", languages.length);
console.log("Last:", languages[languages.length - 1]);`,

      visualizer: {
        type: "array",
        title: "Array Index Visualizer",
        steps: [
          {
            array: ["C", "Python", "JavaScript"],
            active: 0,
            message: "Index 0 contains C."
          },
          {
            array: ["C", "Python", "JavaScript"],
            active: 1,
            message: "Index 1 contains Python."
          },
          {
            array: ["C", "Python", "JavaScript"],
            active: 2,
            message: "Index 2 contains JavaScript."
          }
        ]
      },

      keyPoints: [
        "Arrays start at index 0.",
        "length gives the number of elements.",
        "The last index is length - 1.",
        "Accessing an invalid index normally gives undefined."
      ]
    },

    /* =====================================================
       CONCEPT 03
       ===================================================== */

    {
      id: 3,

      title: "Updating Array Elements",

      explanation: `
        Array elements can be changed using their indexes.

        Example:

        const marks = [70, 80, 90];

        marks[1] = 85;

        The array becomes:

        [70, 85, 90]

        Arrays declared using const can still have their
        individual elements changed.

        const values = [10, 20];

        values[0] = 50;

        This is valid.

        const prevents reassignment of the array variable itself,
        not mutation of the array contents.
      `,

      example: `const marks = [70, 80, 90];

marks[1] = 85;

console.log(marks);`,

      keyPoints: [
        "Array elements can be changed through indexes.",
        "const does not make an array immutable.",
        "Use careful mutation when sharing data across application components."
      ]
    },

    /* =====================================================
       CONCEPT 04
       ===================================================== */

    {
      id: 4,

      title: "Adding & Removing Elements",

      explanation: `
        JavaScript provides methods for changing array size.

        push()
        Adds an element to the end.

        pop()
        Removes the last element.

        unshift()
        Adds an element to the beginning.

        shift()
        Removes the first element.

        Example:

        const queue = ["A", "B"];

        queue.push("C");

        ["A", "B", "C"]

        queue.pop();

        ["A", "B"]

        These methods mutate the original array.
      `,

      example: `const queue = ["A", "B"];

queue.push("C");
console.log(queue);

queue.pop();
console.log(queue);

queue.unshift("X");
console.log(queue);

queue.shift();
console.log(queue);`,

      keyPoints: [
        "push adds at the end.",
        "pop removes from the end.",
        "unshift adds at the beginning.",
        "shift removes from the beginning.",
        "These operations mutate the original array."
      ]
    },

    /* =====================================================
       CONCEPT 05
       ===================================================== */

    {
      id: 5,

      title: "Looping Through Arrays",

      explanation: `
        Arrays can be processed using different looping techniques.

        Traditional for loop:

        for (let i = 0; i < numbers.length; i++) {
          console.log(numbers[i]);
        }

        for...of:

        for (const number of numbers) {
          console.log(number);
        }

        for...of is usually easier when we only need the values.

        Traditional for loops are useful when we need the index
        or more precise control over execution.
      `,

      example: `const numbers = [10, 20, 30];

for (let i = 0; i < numbers.length; i++) {
  console.log("Index:", i, "Value:", numbers[i]);
}

for (const number of numbers) {
  console.log("Value:", number);
}`,

      tracer: {
        title: "Array Loop Trace",
        steps: [
          {
            line: 1,
            message: "numbers contains three values."
          },
          {
            line: 3,
            message: "i starts at 0."
          },
          {
            line: 4,
            message: "numbers[0] is 10."
          },
          {
            line: 3,
            message: "i becomes 1."
          },
          {
            line: 4,
            message: "numbers[1] is 20."
          },
          {
            line: 3,
            message: "i becomes 2."
          },
          {
            line: 4,
            message: "numbers[2] is 30."
          }
        ]
      },

      keyPoints: [
        "Use for when index/control is important.",
        "Use for...of when you mainly need values.",
        "Avoid unnecessary index management when for...of is enough."
      ]
    },

    /* =====================================================
       CONCEPT 06
       ===================================================== */

    {
      id: 6,

      title: "forEach()",

      explanation: `
        forEach() executes a function once for every array element.

        Example:

        const marks = [70, 80, 90];

        marks.forEach(mark => {
          console.log(mark);
        });

        The callback receives the current value.

        It can also receive:

        value
        index
        array

        Example:

        marks.forEach((mark, index) => {
          console.log(index, mark);
        });

        forEach() is useful when we want to perform an action
        for every element.
      `,

      example: `const marks = [70, 80, 90];

marks.forEach((mark, index) => {
  console.log("Index:", index);
  console.log("Mark:", mark);
});`,

      keyPoints: [
        "forEach processes every element.",
        "It receives a callback function.",
        "The callback can receive value and index.",
        "forEach does not create a new transformed array."
      ]
    },

    /* =====================================================
       CONCEPT 07
       ===================================================== */

    {
      id: 7,

      title: "Searching with includes(), indexOf() & find()",

      explanation: `
        Applications frequently need to search data.

        includes()
        Checks whether a value exists.

        indexOf()
        Returns the position of a value.

        find()
        Returns the first element satisfying a condition.

        Example:

        const numbers = [10, 20, 30];

        numbers.includes(20)
        → true

        numbers.indexOf(30)
        → 2

        For objects, find() is more useful.

        const students = [
          { name: "Ravi", cgpa: 8.5 },
          { name: "Anita", cgpa: 9.1 }
        ];

        students.find(student => student.cgpa > 9);
      `,

      example: `const numbers = [10, 20, 30];

console.log(numbers.includes(20));
console.log(numbers.indexOf(30));

const students = [
  { name: "Ravi", cgpa: 8.5 },
  { name: "Anita", cgpa: 9.1 }
];

const topper = students.find(student => student.cgpa > 9);

console.log(topper);`,

      keyPoints: [
        "includes checks for existence.",
        "indexOf returns an index.",
        "find returns the first matching element.",
        "find is especially useful with arrays of objects."
      ]
    },

    /* =====================================================
       CONCEPT 08
       ===================================================== */

    {
      id: 8,

      title: "filter() — Selecting Data",

      explanation: `
        filter() creates a new array containing elements
        that satisfy a condition.

        Example:

        const marks = [45, 72, 88, 31, 95];

        const passed = marks.filter(mark => mark >= 40);

        Result:

        [45, 72, 88, 95]

        filter() is extremely common in real applications.

        Examples:

        Active users
        Products below a price
        Students above a CGPA
        Jobs matching a location
        Employees belonging to a department
      `,

      example: `const marks = [45, 72, 88, 31, 95];

const passed = marks.filter(mark => mark >= 40);

console.log(passed);`,

      visualizer: {
        type: "filter",
        title: "Filter Visualizer",
        steps: [
          {
            input: [45, 72, 88, 31, 95],
            active: 0,
            accepted: false,
            output: [],
            message: "45 is checked."
          },
          {
            input: [45, 72, 88, 31, 95],
            active: 1,
            accepted: true,
            output: [72],
            message: "72 satisfies mark >= 40."
          },
          {
            input: [45, 72, 88, 31, 95],
            active: 2,
            accepted: true,
            output: [72, 88],
            message: "88 is accepted."
          },
          {
            input: [45, 72, 88, 31, 95],
            active: 3,
            accepted: false,
            output: [72, 88],
            message: "31 is rejected."
          },
          {
            input: [45, 72, 88, 31, 95],
            active: 4,
            accepted: true,
            output: [72, 88, 95],
            message: "95 is accepted."
          }
        ]
      },

      keyPoints: [
        "filter returns a new array.",
        "The original array remains unchanged.",
        "The callback must produce a truthy/falsy result.",
        "Use filter when selecting multiple matching items."
      ]
    },

    /* =====================================================
       CONCEPT 09
       ===================================================== */

    {
      id: 9,

      title: "map() — Transforming Data",

      explanation: `
        map() creates a new array by transforming every element.

        Example:

        const prices = [100, 200, 300];

        const discounted = prices.map(price => price * 0.9);

        Result:

        [90, 180, 270]

        map() is one of the most important methods in React
        because React interfaces frequently render arrays
        of data.

        Example:

        students.map(student => student.name)

        converts student objects into student names.
      `,

      example: `const prices = [100, 200, 300];

const discounted = prices.map(price => price * 0.9);

console.log(discounted);`,

      visualizer: {
        type: "map",
        title: "Map Transformation",
        steps: [
          {
            input: [100, 200, 300],
            active: 0,
            output: [90],
            message: "100 becomes 90."
          },
          {
            input: [100, 200, 300],
            active: 1,
            output: [90, 180],
            message: "200 becomes 180."
          },
          {
            input: [100, 200, 300],
            active: 2,
            output: [90, 180, 270],
            message: "300 becomes 270."
          }
        ]
      },

      keyPoints: [
        "map transforms every element.",
        "map returns a new array.",
        "The output array normally has the same length.",
        "map is heavily used in React rendering."
      ]
    },

    /* =====================================================
       CONCEPT 10
       ===================================================== */

    {
      id: 10,

      title: "reduce() — Producing One Result",

      explanation: `
        reduce() processes an array and builds one final result.

        Example:

        const numbers = [10, 20, 30];

        const total = numbers.reduce(
          (sum, number) => sum + number,
          0
        );

        Result:

        60

        The second argument, 0, is the initial accumulator value.

        reduce() can calculate:

        totals
        averages
        counts
        maximum values
        grouped information
        summaries

        It is one of the most powerful array methods,
        but it should be used only when aggregation is actually
        required.
      `,

      example: `const marks = [70, 80, 90];

const total = marks.reduce(
  (sum, mark) => sum + mark,
  0
);

console.log("Total:", total);`,

      tracer: {
        title: "Reduce Accumulator Trace",
        steps: [
          {
            accumulator: 0,
            current: 70,
            result: 70,
            message: "0 + 70 = 70"
          },
          {
            accumulator: 70,
            current: 80,
            result: 150,
            message: "70 + 80 = 150"
          },
          {
            accumulator: 150,
            current: 90,
            result: 240,
            message: "150 + 90 = 240"
          }
        ]
      },

      keyPoints: [
        "reduce combines many values into a result.",
        "The accumulator stores the running result.",
        "Always choose a meaningful initial value.",
        "Do not use reduce when map or filter communicates the intent better."
      ]
    },

    /* =====================================================
       CONCEPT 11
       ===================================================== */

    {
      id: 11,

      title: "some() & every()",

      explanation: `
        some() checks whether at least one element satisfies
        a condition.

        every() checks whether all elements satisfy a condition.

        Example:

        const marks = [70, 80, 90];

        marks.some(mark => mark < 40)
        → false

        marks.every(mark => mark >= 40)
        → true

        These methods are useful for validation and business rules.

        Example:

        Are there any failed students?

        Has every student submitted the assignment?
      `,

      example: `const marks = [70, 80, 90];

const hasFailure = marks.some(mark => mark < 40);
const allPassed = marks.every(mark => mark >= 40);

console.log("Has failure:", hasFailure);
console.log("All passed:", allPassed);`,

      keyPoints: [
        "some means at least one.",
        "every means all.",
        "Both return boolean values.",
        "They are useful for validation."
      ]
    },

    /* =====================================================
       CONCEPT 12
       ===================================================== */

    {
      id: 12,

      title: "Creating JavaScript Objects",

      explanation: `
        Objects store data using key-value pairs.

        Example:

        const student = {
          name: "Ravi",
          branch: "CSE",
          cgpa: 8.7
        };

        Here:

        name → key
        "Ravi" → value

        Objects can store strings, numbers, booleans,
        arrays, nested objects and functions.

        Objects are ideal for representing real-world entities.
      `,

      example: `const student = {
  name: "Ravi",
  branch: "CSE",
  cgpa: 8.7,
  placed: true
};

console.log(student);`,

      visualizer: {
        type: "object",
        title: "Object Property Visualizer",
        steps: [
          {
            object: {
              name: "Ravi",
              branch: "CSE",
              cgpa: 8.7
            },
            active: "name",
            message: "The name property stores Ravi."
          },
          {
            object: {
              name: "Ravi",
              branch: "CSE",
              cgpa: 8.7
            },
            active: "branch",
            message: "The branch property stores CSE."
          },
          {
            object: {
              name: "Ravi",
              branch: "CSE",
              cgpa: 8.7
            },
            active: "cgpa",
            message: "The cgpa property stores 8.7."
          }
        ]
      },

      keyPoints: [
        "Objects use key-value pairs.",
        "Keys identify properties.",
        "Values can have different data types.",
        "Objects are used to represent structured entities."
      ]
    },

    /* =====================================================
       CONCEPT 13
       ===================================================== */

    {
      id: 13,

      title: "Dot Notation & Bracket Notation",

      explanation: `
        Object properties can be accessed in two major ways.

        Dot notation:

        student.name

        Bracket notation:

        student["name"]

        Bracket notation becomes especially useful when
        the property name is stored in a variable.

        Example:

        const property = "cgpa";

        student[property]

        This dynamically accesses the cgpa property.
      `,

      example: `const student = {
  name: "Ravi",
  cgpa: 8.7
};

console.log(student.name);
console.log(student["name"]);

const property = "cgpa";

console.log(student[property]);`,

      keyPoints: [
        "Dot notation is concise.",
        "Bracket notation supports dynamic property access.",
        "Bracket notation is required for many unusual property names."
      ]
    },

    /* =====================================================
       CONCEPT 14
       ===================================================== */

    {
      id: 14,

      title: "Nested Objects & Nested Data",

      explanation: `
        Objects can contain other objects.

        This allows applications to represent complex information.

        Example:

        const student = {
          name: "Ravi",
          contact: {
            city: "Hyderabad",
            phone: "9999999999"
          }
        };

        Access:

        student.contact.city

        Arrays can also exist inside objects.

        Example:

        const student = {
          name: "Ravi",
          skills: ["C", "Python", "JavaScript"]
        };

        Real API responses often contain deeply nested
        combinations of arrays and objects.
      `,

      example: `const student = {
  name: "Ravi",
  contact: {
    city: "Hyderabad",
    phone: "9999999999"
  },
  skills: ["C", "Python", "JavaScript"]
};

console.log(student.contact.city);
console.log(student.skills[1]);`,

      keyPoints: [
        "Objects can contain objects.",
        "Objects can contain arrays.",
        "Nested data is common in APIs.",
        "Read nested structures carefully to avoid undefined errors."
      ]
    },

    /* =====================================================
       CONCEPT 15
       ===================================================== */

    {
      id: 15,

      title: "Object Methods",

      explanation: `
        An object can contain functions.

        A function stored inside an object is commonly called
        a method.

        Example:

        const student = {
          name: "Ravi",

          introduce() {
            return "Hello, I am " + this.name;
          }
        };

        student.introduce();

        The keyword this refers to the object that invokes
        the method in this context.

        Object methods are useful when behavior belongs naturally
        to an object.
      `,

      example: `const student = {
  name: "Ravi",

  introduce() {
    return "Hello, I am " + this.name;
  }
};

console.log(student.introduce());`,

      keyPoints: [
        "Methods are functions stored on objects.",
        "this commonly refers to the object calling the method.",
        "Use methods when behavior belongs to an object."
      ]
    },

    /* =====================================================
       CONCEPT 16
       ===================================================== */

    {
      id: 16,

      title: "Destructuring Arrays & Objects",

      explanation: `
        Destructuring provides a concise way to extract values.

        Array destructuring:

        const colors = ["red", "blue"];

        const [first, second] = colors;

        Object destructuring:

        const student = {
          name: "Ravi",
          cgpa: 8.7
        };

        const { name, cgpa } = student;

        Destructuring is heavily used in modern JavaScript
        and React.

        It improves readability when we need selected properties.
      `,

      example: `const colors = ["red", "blue"];

const [first, second] = colors;

console.log(first);
console.log(second);

const student = {
  name: "Ravi",
  cgpa: 8.7
};

const { name, cgpa } = student;

console.log(name);
console.log(cgpa);`,

      keyPoints: [
        "Array destructuring extracts by position.",
        "Object destructuring extracts by property name.",
        "Destructuring is common in React and modern JavaScript."
      ]
    },

    /* =====================================================
       CONCEPT 17
       ===================================================== */

    {
      id: 17,

      title: "Spread Syntax",

      explanation: `
        Spread syntax (...) expands the contents of an array
        or object.

        Array example:

        const first = [1, 2];
        const second = [3, 4];

        const combined = [...first, ...second];

        Result:

        [1, 2, 3, 4]

        Object example:

        const student = {
          name: "Ravi",
          cgpa: 8.5
        };

        const updated = {
          ...student,
          cgpa: 9.0
        };

        Spread is frequently used to create updated copies
        without directly mutating the original structure.
      `,

      example: `const first = [1, 2];
const second = [3, 4];

const combined = [...first, ...second];

console.log(combined);

const student = {
  name: "Ravi",
  cgpa: 8.5
};

const updated = {
  ...student,
  cgpa: 9.0
};

console.log(updated);`,

      keyPoints: [
        "Spread expands values.",
        "It is useful for copying arrays and objects.",
        "Later properties can override earlier object properties.",
        "Spread is fundamental to React state updates."
      ]
    },

    /* =====================================================
       CONCEPT 18
       ===================================================== */

    {
      id: 18,

      title: "Rest Syntax",

      explanation: `
        Rest syntax also uses ...

        Its meaning depends on position.

        Spread expands a structure.

        Rest collects remaining values.

        Example:

        function total(...numbers) {
          return numbers.reduce(
            (sum, number) => sum + number,
            0
          );
        }

        total(10, 20, 30);

        The rest parameter collects all arguments into an array.

        Rest can also be used during destructuring.
      `,

      example: `function total(...numbers) {
  return numbers.reduce(
    (sum, number) => sum + number,
    0
  );
}

console.log(total(10, 20, 30));`,

      keyPoints: [
        "Rest collects remaining values.",
        "Rest parameters are arrays.",
        "Spread expands values.",
        "Remember: same syntax, different purpose."
      ]
    },

    /* =====================================================
       CONCEPT 19
       ===================================================== */

    {
      id: 19,

      title: "Arrays of Objects",

      explanation: `
        This is one of the most important structures in
        frontend and backend development.

        Example:

        const students = [
          {
            name: "Ravi",
            branch: "CSE",
            cgpa: 8.7
          },
          {
            name: "Anita",
            branch: "CSE",
            cgpa: 9.2
          }
        ];

        We can combine array methods with object properties.

        students.filter(student => student.cgpa >= 9)

        students.map(student => student.name)

        students.find(student => student.name === "Ravi")

        This pattern appears everywhere in MERN applications.
      `,

      example: `const students = [
  { name: "Ravi", branch: "CSE", cgpa: 8.7 },
  { name: "Anita", branch: "CSE", cgpa: 9.2 },
  { name: "Kiran", branch: "ECE", cgpa: 8.1 }
];

const toppers = students.filter(
  student => student.cgpa >= 9
);

const names = students.map(
  student => student.name
);

console.log(toppers);
console.log(names);`,

      visualizer: {
        type: "array-object",
        title: "Array of Objects Visualizer",
        steps: [
          {
            active: 0,
            message: "Read Ravi's record.",
            output: "Ravi · CSE · 8.7"
          },
          {
            active: 1,
            message: "Read Anita's record.",
            output: "Anita · CSE · 9.2"
          },
          {
            active: 2,
            message: "Read Kiran's record.",
            output: "Kiran · ECE · 8.1"
          },
          {
            active: 1,
            message: "Anita satisfies cgpa >= 9.",
            output: "Selected: Anita"
          }
        ]
      },

      keyPoints: [
        "Arrays can contain objects.",
        "This is common in API responses.",
        "map/filter/find work naturally with arrays of objects.",
        "Mastering this structure is essential for MERN development."
      ]
    },

    /* =====================================================
       CONCEPT 20
       ===================================================== */

    {
      id: 20,

      title: "Practical Data Processing Pipeline",

      explanation: `
        Real applications often combine several array operations.

        Example requirement:

        From a list of students:

        1. Select CSE students.
        2. Keep students with CGPA >= 8.5.
        3. Extract their names.
        4. Sort the resulting names.

        A clean solution can use a pipeline:

        filter()
        filter()
        map()
        sort()

        This is much closer to the type of JavaScript
        data processing used in real applications.

        Important:

        Do not blindly chain methods.

        First understand the data and desired result.
        Then choose the smallest set of operations that clearly
        expresses the requirement.
      `,

      example: `const students = [
  { name: "Ravi", branch: "CSE", cgpa: 8.7 },
  { name: "Anita", branch: "CSE", cgpa: 9.2 },
  { name: "Kiran", branch: "ECE", cgpa: 8.9 },
  { name: "Meena", branch: "CSE", cgpa: 8.2 }
];

const result = students
  .filter(student => student.branch === "CSE")
  .filter(student => student.cgpa >= 8.5)
  .map(student => student.name)
  .sort();

console.log(result);`,

      tracer: {
        title: "Student Data Processing Pipeline",
        steps: [
          {
            stage: "Input",
            data: 4,
            message: "Four student records are available."
          },
          {
            stage: "Filter Branch",
            data: 3,
            message: "Three students belong to CSE."
          },
          {
            stage: "Filter CGPA",
            data: 2,
            message: "Two CSE students have CGPA >= 8.5."
          },
          {
            stage: "Map",
            data: ["Anita", "Ravi"],
            message: "Only student names are extracted."
          },
          {
            stage: "Sort",
            data: ["Anita", "Ravi"],
            message: "Names are sorted alphabetically."
          }
        ]
      },

      keyPoints: [
        "Real applications process collections in stages.",
        "filter selects data.",
        "map transforms data.",
        "reduce aggregates data.",
        "Combining methods creates readable data pipelines."
      ]
    }

  ],

  /* =======================================================
     PREMIUM VISUALIZER
     ======================================================= */

  visualizer: {

    title: "Premium Array & Object Visualizer",

    description:
      "Explore how JavaScript processes arrays, objects and collections step by step.",

    type: "data-structures",

    examples: [

      {
        title: "Array Indexing",

        code: `const numbers = [10, 20, 30];

console.log(numbers[1]);`,

        steps: [
          {
            operation: "Create array",
            state: ["10", "20", "30"],
            active: -1,
            message: "Array is created with three elements."
          },
          {
            operation: "Access index 1",
            state: ["10", "20", "30"],
            active: 1,
            message: "Index 1 contains 20."
          }
        ]
      },

      {
        title: "Map Transformation",

        code: `const numbers = [1, 2, 3];

const doubled = numbers.map(
  number => number * 2
);`,

        steps: [
          {
            operation: "Read 1",
            input: 1,
            output: [2],
            message: "1 becomes 2."
          },
          {
            operation: "Read 2",
            input: 2,
            output: [2, 4],
            message: "2 becomes 4."
          },
          {
            operation: "Read 3",
            input: 3,
            output: [2, 4, 6],
            message: "3 becomes 6."
          }
        ]
      },

      {
        title: "Filter Students",

        code: `const students = [
  { name: "Ravi", cgpa: 8.7 },
  { name: "Anita", cgpa: 9.2 },
  { name: "Kiran", cgpa: 8.1 }
];

const toppers = students.filter(
  student => student.cgpa >= 9
);`,

        steps: [
          {
            operation: "Check Ravi",
            active: 0,
            output: [],
            message: "8.7 is below 9."
          },
          {
            operation: "Check Anita",
            active: 1,
            output: ["Anita"],
            message: "9.2 satisfies the condition."
          },
          {
            operation: "Check Kiran",
            active: 2,
            output: ["Anita"],
            message: "8.1 is below 9."
          }
        ]
      },

      {
        title: "Reduce Total",

        code: `const marks = [70, 80, 90];

const total = marks.reduce(
  (sum, mark) => sum + mark,
  0
);`,

        steps: [
          {
            active: 0,
            accumulator: 0,
            current: 70,
            result: 70,
            message: "Initial accumulator 0 + 70."
          },
          {
            active: 1,
            accumulator: 70,
            current: 80,
            result: 150,
            message: "70 + 80."
          },
          {
            active: 2,
            accumulator: 150,
            current: 90,
            result: 240,
            message: "150 + 90."
          }
        ]
      }

    ]
  },

  /* =======================================================
     PROGRAM TRACE
     ======================================================= */

  trace: {

    title: "Program Trace · Student Data Processing",

    code: `const students = [
  { name: "Ravi", cgpa: 8.7 },
  { name: "Anita", cgpa: 9.2 },
  { name: "Kiran", cgpa: 8.1 }
];

const toppers = students
  .filter(student => student.cgpa >= 9)
  .map(student => student.name);

console.log(toppers);`,

    steps: [

      {
        line: 1,
        operation: "Create students array.",
        variables: {
          students: "3 records"
        },
        message: "The collection contains three student objects."
      },

      {
        line: 7,
        operation: "Start filter().",
        variables: {
          students: "3 records"
        },
        message: "Each student will be checked."
      },

      {
        line: 7,
        operation: "Check Ravi.",
        variables: {
          student: "Ravi",
          cgpa: 8.7
        },
        message: "8.7 >= 9 is false. Ravi is rejected."
      },

      {
        line: 7,
        operation: "Check Anita.",
        variables: {
          student: "Anita",
          cgpa: 9.2
        },
        message: "9.2 >= 9 is true. Anita is selected."
      },

      {
        line: 7,
        operation: "Check Kiran.",
        variables: {
          student: "Kiran",
          cgpa: 8.1
        },
        message: "8.1 >= 9 is false. Kiran is rejected."
      },

      {
        line: 8,
        operation: "Run map().",
        variables: {
          student: "Anita"
        },
        message: "The selected object is transformed into its name."
      },

      {
        line: 8,
        operation: "Create final array.",
        variables: {
          toppers: ["Anita"]
        },
        message: "The final array contains Anita."
      },

      {
        line: 10,
        operation: "Print result.",
        variables: {
          output: ["Anita"]
        },
        message: "The result is displayed."
      }

    ]
  },

  /* =======================================================
     REVISION
     ======================================================= */

  revision: [

    {
      question: "What is the first index of a JavaScript array?",
      answer: "0"
    },

    {
      question: "How do you access the last array element?",
      answer: "array[array.length - 1]"
    },

    {
      question: "Which method adds an element to the end?",
      answer: "push()"
    },

    {
      question: "Which method removes the last element?",
      answer: "pop()"
    },

    {
      question: "Which method creates a new array by selecting matching elements?",
      answer: "filter()"
    },

    {
      question: "Which method transforms every element?",
      answer: "map()"
    },

    {
      question: "Which method is commonly used to aggregate an array into one result?",
      answer: "reduce()"
    },

    {
      question: "What does find() return?",
      answer: "The first element that satisfies the supplied condition."
    },

    {
      question: "What does some() return?",
      answer: "true if at least one element satisfies the condition."
    },

    {
      question: "What does every() return?",
      answer: "true if every element satisfies the condition."
    },

    {
      question: "How are object properties accessed?",
      answer: "Using dot notation or bracket notation."
    },

    {
      question: "What does object destructuring do?",
      answer: "It extracts selected properties into variables."
    },

    {
      question: "What does spread syntax do?",
      answer: "It expands elements or properties from an iterable/object."
    },

    {
      question: "What does rest syntax do?",
      answer: "It collects remaining values into a structure."
    },

    {
      question: "Why are arrays of objects important?",
      answer:
        "They represent collections of real-world records and are extremely common in APIs and MERN applications."
    }

  ],

  /* =======================================================
     INTERVIEW QUESTIONS
     ======================================================= */

  interview: [

    {
      question: "What is the difference between an array and an object?",
      answer:
        "Arrays represent ordered collections accessed mainly by index, while objects represent named properties using key-value pairs."
    },

    {
      question: "Are JavaScript arrays zero-based?",
      answer:
        "Yes. The first element is at index 0."
    },

    {
      question: "What is the difference between map() and forEach()?",
      answer:
        "map() returns a new transformed array, while forEach() performs an action for each element and does not produce a transformed array."
    },

    {
      question: "What is the difference between map() and filter()?",
      answer:
        "map transforms every element, while filter selects elements that satisfy a condition."
    },

    {
      question: "What is reduce() used for?",
      answer:
        "reduce() processes an array and builds a single accumulated result such as a sum, count, maximum or grouped structure."
    },

    {
      question: "What is the difference between find() and filter()?",
      answer:
        "find() returns the first matching element, while filter() returns an array containing all matching elements."
    },

    {
      question: "What is the difference between some() and every()?",
      answer:
        "some() checks whether at least one element satisfies a condition; every() checks whether all elements satisfy it."
    },

    {
      question: "What is bracket notation useful for?",
      answer:
        "It allows dynamic property access using expressions or variables."
    },

    {
      question: "What is object destructuring?",
      answer:
        "It extracts object properties into variables using concise syntax."
    },

    {
      question: "What is the difference between spread and rest?",
      answer:
        "Spread expands values, while rest collects remaining values."
    },

    {
      question: "Why are arrays of objects common in web applications?",
      answer:
        "They naturally represent collections of records returned from databases and APIs."
    },

    {
      question: "Why is map() important in React?",
      answer:
        "React commonly uses map() to transform arrays of application data into lists of UI elements."
    },

    {
      question: "Does filter() mutate the original array?",
      answer:
        "No. filter() creates and returns a new array."
    },

    {
      question: "Does map() mutate the original array?",
      answer:
        "map() itself does not mutate the original array."
    },

    {
      question: "What does this refer to inside an object method?",
      answer:
        "In a normal method call such as object.method(), this generally refers to the object that invoked the method."
    }

  ],

  /* =======================================================
     PRACTICE
     ======================================================= */

  practice: [

    {
      id: 1,
      title: "Student Marks Filter",
      difficulty: "Easy",
      problem:
        "Given an array of marks, create a new array containing only marks greater than or equal to 60.",
      hint:
        "Use filter().",
      expected:
        "A new array containing only marks >= 60."
    },

    {
      id: 2,
      title: "Double the Values",
      difficulty: "Easy",
      problem:
        "Given an array of numbers, create another array containing twice each number.",
      hint:
        "Use map().",
      expected:
        "A new array with every value multiplied by 2."
    },

    {
      id: 3,
      title: "Calculate Total",
      difficulty: "Easy",
      problem:
        "Calculate the total of all values in an array.",
      hint:
        "Use reduce().",
      expected:
        "The sum of all array elements."
    },

    {
      id: 4,
      title: "Find a Student",
      difficulty: "Easy",
      problem:
        "Given an array of student objects, find the student whose name is 'Anita'.",
      hint:
        "Use find().",
      expected:
        "The first matching student object."
    },

    {
      id: 5,
      title: "Placement Eligible Students",
      difficulty: "Medium",
      problem:
        "Given student objects containing name, branch and CGPA, find students whose CGPA is at least 7.5.",
      hint:
        "Use filter().",
      expected:
        "An array containing all eligible students."
    },

    {
      id: 6,
      title: "Student Names",
      difficulty: "Easy",
      problem:
        "Convert an array of student objects into an array containing only their names.",
      hint:
        "Use map().",
      expected:
        "An array of names."
    },

    {
      id: 7,
      title: "Highest Mark",
      difficulty: "Medium",
      problem:
        "Find the highest value in an array of marks.",
      hint:
        "You can use reduce().",
      expected:
        "The highest mark."
    },

    {
      id: 8,
      title: "Department Filter",
      difficulty: "Medium",
      problem:
        "From an array of employee objects, select only employees belonging to the CSE department.",
      hint:
        "Use filter() and compare the department property.",
      expected:
        "An array containing only CSE employees."
    },

    {
      id: 9,
      title: "Average CGPA",
      difficulty: "Medium",
      problem:
        "Calculate the average CGPA of a collection of students.",
      hint:
        "Use reduce() to calculate the total, then divide by length.",
      expected:
        "The average CGPA."
    },

    {
      id: 10,
      title: "Active Users",
      difficulty: "Medium",
      problem:
        "Given users with an active property, create an array containing only active users.",
      hint:
        "Use filter().",
      expected:
        "Only users whose active property is true."
    },

    {
      id: 11,
      title: "Salary Increment",
      difficulty: "Medium",
      problem:
        "Given employee objects, create a new array where each employee receives a 10% salary increase.",
      hint:
        "Use map() and object spread.",
      expected:
        "New employee objects with updated salary values."
    },

    {
      id: 12,
      title: "Placement Data Pipeline",
      difficulty: "Hard",
      problem:
        "From a student array, select CSE students with CGPA >= 8, extract their names and sort the names alphabetically.",
      hint:
        "Use filter(), filter(), map() and sort().",
      expected:
        "A sorted array of eligible CSE student names."
    },

    {
      id: 13,
      title: "Course Skill Analyzer",
      difficulty: "Hard",
      problem:
        "Given students with skills arrays, determine whether at least one student knows JavaScript.",
      hint:
        "Combine some() with includes().",
      expected:
        "true or false."
    },

    {
      id: 14,
      title: "Complete Assignment Check",
      difficulty: "Medium",
      problem:
        "Given assignment objects with a submitted property, determine whether every student has submitted the assignment.",
      hint:
        "Use every().",
      expected:
        "A boolean value."
    },

    {
      id: 15,
      title: "Mini Placement Report",
      difficulty: "Hard",
      problem:
        "Create a report from student data showing eligible students, their names, total eligible count and average CGPA.",
      hint:
        "Combine filter(), map() and reduce().",
      expected:
        "A structured placement report object."
    }

  ],

  /* =======================================================
     QUIZ
     ======================================================= */

  quiz: [

    {
      question: "What is the index of the first array element?",
      options: ["0", "1", "-1", "undefined"],
      answer: 0,
      explanation:
        "JavaScript arrays use zero-based indexing."
    },

    {
      question: "Which method adds an element to the end of an array?",
      options: ["shift()", "push()", "add()", "append()"],
      answer: 1,
      explanation:
        "push() adds one or more elements to the end."
    },

    {
      question: "Which method removes the last element?",
      options: ["pop()", "remove()", "delete()", "shift()"],
      answer: 0,
      explanation:
        "pop() removes the final array element."
    },

    {
      question: "Which method returns a new array containing matching elements?",
      options: ["find()", "filter()", "some()", "every()"],
      answer: 1,
      explanation:
        "filter() creates a new array from elements satisfying a condition."
    },

    {
      question: "Which method transforms every array element?",
      options: ["filter()", "map()", "find()", "includes()"],
      answer: 1,
      explanation:
        "map() transforms each element and returns a new array."
    },

    {
      question: "Which method is commonly used to calculate a total?",
      options: ["map()", "filter()", "reduce()", "find()"],
      answer: 2,
      explanation:
        "reduce() is commonly used for accumulation."
    },

    {
      question: "What does find() return?",
      options: [
        "All matching elements",
        "The first matching element",
        "A boolean",
        "The array length"
      ],
      answer: 1,
      explanation:
        "find() returns the first element that satisfies the condition."
    },

    {
      question: "What does every() return?",
      options: [
        "An array",
        "The first match",
        "A boolean",
        "An object"
      ],
      answer: 2,
      explanation:
        "every() returns true only when all elements satisfy the condition."
    },

    {
      question: "Which syntax accesses an object property dynamically?",
      options: [
        "object.property",
        "object[property]",
        "object->property",
        "object::property"
      ],
      answer: 1,
      explanation:
        "Bracket notation allows expressions or variables to determine the property name."
    },

    {
      question: "What does object destructuring do?",
      options: [
        "Deletes an object",
        "Extracts properties into variables",
        "Sorts an object",
        "Converts an object into JSON"
      ],
      answer: 1,
      explanation:
        "Destructuring extracts selected properties into variables."
    },

    {
      question: "What does spread syntax generally do?",
      options: [
        "Deletes values",
        "Expands values",
        "Sorts values",
        "Encrypts values"
      ],
      answer: 1,
      explanation:
        "Spread expands iterable elements or object properties."
    },

    {
      question: "What does rest syntax generally do?",
      options: [
        "Collects remaining values",
        "Deletes remaining values",
        "Sorts values",
        "Freezes values"
      ],
      answer: 0,
      explanation:
        "Rest collects remaining values into an array or object structure."
    },

    {
      question: "Which structure is commonly used for API collections?",
      options: [
        "Only strings",
        "Only numbers",
        "Array of objects",
        "Single boolean"
      ],
      answer: 2,
      explanation:
        "Arrays of objects naturally represent collections of records."
    },

    {
      question: "Which method checks whether at least one element satisfies a condition?",
      options: ["every()", "some()", "findAll()", "check()"],
      answer: 1,
      explanation:
        "some() returns true when at least one element passes the test."
    },

    {
      question: "Which method is commonly used to render a list in React?",
      options: ["reduce()", "map()", "shift()", "indexOf()"],
      answer: 1,
      explanation:
        "React commonly uses map() to transform data into UI elements."
    }

  ],

  /* =======================================================
     GLOSSARY
     ======================================================= */

  glossary: [

    {
      term: "Array",
      definition:
        "An ordered collection of values accessed primarily using numeric indexes."
    },

    {
      term: "Index",
      definition:
        "The numeric position of an element inside an array."
    },

    {
      term: "Object",
      definition:
        "A collection of named key-value properties."
    },

    {
      term: "Property",
      definition:
        "A named value stored inside an object."
    },

    {
      term: "Method",
      definition:
        "A function stored as an object property."
    },

    {
      term: "Callback",
      definition:
        "A function passed to another function to be executed later or during processing."
    },

    {
      term: "Mutation",
      definition:
        "Changing the existing contents of an array or object."
    },

    {
      term: "map()",
      definition:
        "Creates a new array by transforming each element."
    },

    {
      term: "filter()",
      definition:
        "Creates a new array containing elements that satisfy a condition."
    },

    {
      term: "reduce()",
      definition:
        "Processes an array and accumulates its values into a final result."
    },

    {
      term: "Destructuring",
      definition:
        "A syntax for extracting values from arrays or properties from objects."
    },

    {
      term: "Spread",
      definition:
        "Syntax that expands elements or properties from an existing structure."
    },

    {
      term: "Rest",
      definition:
        "Syntax that collects remaining values."
    },

    {
      term: "Array of Objects",
      definition:
        "An array whose elements are objects, commonly used for collections of records."
    },

    {
      term: "Accumulator",
      definition:
        "The running value maintained by reduce() while processing an array."
    }

  ],

  /* =======================================================
     COMPLETION
     ======================================================= */

  completion: {

    title: "Level 10 Complete",

    message:
      "You can now model real-world data using arrays and objects, search and transform collections, process arrays of objects and build practical JavaScript data pipelines.",

    takeaway: [
      "Arrays organize ordered collections.",
      "Objects represent structured entities.",
      "map() transforms data.",
      "filter() selects data.",
      "reduce() aggregates data.",
      "find(), some() and every() support powerful data checks.",
      "Destructuring makes modern JavaScript cleaner.",
      "Spread and rest are essential for modern application development.",
      "Arrays of objects are fundamental to API and MERN development."
    ],

    nextLevel:
      "Level 11 — DOM & Browser Interaction"
  }

};
