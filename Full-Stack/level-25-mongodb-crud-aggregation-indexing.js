"use strict";

/* =========================================================
CODEBHAVYA FULL STACK / MERN
LEVEL 25 — MONGODB CRUD, AGGREGATION & INDEXING
========================================================= */

window.FULLSTACK_LESSONS = window.FULLSTACK_LESSONS || {};

window.FULLSTACK_LESSONS[25] = {
  n: 25,

  kicker: "PART 5 • MONGODB • LEVEL 25",

  title: "MongoDB CRUD, Aggregation & Indexing",

  summary:
    "Move beyond MongoDB basics and learn practical database operations: advanced CRUD, projections, sorting, pagination, array queries, aggregation pipelines, grouping, filtering, computed fields, indexes, explain plans and performance-aware MongoDB queries.",

  duration: "4–5 Hours",

  difficulty: "Intermediate",

  concepts: 17,

  outcomes: [
    "Perform practical MongoDB CRUD operations.",
    "Select only required document fields.",
    "Sort MongoDB query results.",
    "Limit and skip query results.",
    "Build basic pagination.",
    "Query arrays and nested documents.",
    "Understand update operators in depth.",
    "Understand upsert operations.",
    "Understand the MongoDB aggregation pipeline.",
    "Use $match and $project.",
    "Use $group and accumulator operators.",
    "Use $sort, $limit and $skip in aggregation.",
    "Create computed fields with $set or $addFields.",
    "Understand $lookup at a conceptual level.",
    "Create useful indexes.",
    "Understand compound indexes.",
    "Use explain() to investigate query performance."
  ],

  sections: [

    /* =====================================================
       SECTION 1
    ===================================================== */

    {
      number: 1,

      title: "Advanced MongoDB CRUD",

      intro:
        "CRUD is the foundation of MongoDB application development. Real applications combine filtering, updating, sorting and field selection rather than using only basic operations.",

      points: [
        "Create documents with insertOne and insertMany.",
        "Read documents with find and findOne.",
        "Update documents with updateOne and updateMany.",
        "Delete documents with deleteOne and deleteMany.",
        "Use filters to target specific documents.",
        "Use update operators instead of replacing entire documents when appropriate."
      ],

      code:
`db.students.insertOne({
  name: "Bhavya",
  branch: "CSE-AI&ML",
  year: 4,
  marks: 87
})

db.students.find({
  branch: "CSE-AI&ML"
})

db.students.updateOne(
  { name: "Bhavya" },
  {
    $set: {
      marks: 92
    }
  }
)

db.students.deleteOne({
  name: "Temporary Student"
})`,

      keyIdea:
        "Most MongoDB applications are built by combining CRUD operations with carefully designed filters."
    },

    /* =====================================================
       SECTION 2
    ===================================================== */

    {
      number: 2,

      title: "Projection — Selecting Required Fields",

      intro:
        "Projection allows an application to retrieve only the fields it needs instead of returning the complete document.",

      points: [
        "Projection can reduce unnecessary data transfer.",
        "Projection can make API responses smaller.",
        "Fields can be included explicitly.",
        "Fields can be excluded.",
        "_id is included by default unless excluded.",
        "Projection is especially useful for large documents."
      ],

      code:
`db.students.find(
  {},
  {
    name: 1,
    branch: 1,
    _id: 0
  }
) 

db.users.find(
  {},
  {
    passwordHash: 0
  }
)`,

      keyIdea:
        "Return only the data required by the application."
    },

    /* =====================================================
       SECTION 3
    ===================================================== */

    {
      number: 3,

      title: "Sorting Query Results",

      intro:
        "Applications frequently need results ordered by marks, price, date, name or another field.",

      points: [
        "sort() controls result order.",
        "1 means ascending order.",
        "-1 means descending order.",
        "Sorting can be combined with filtering.",
        "Indexes can help supported sorting patterns."
      ],

      code:
`db.students.find({
  branch: "CSE"
}).sort({
  marks: -1
})

db.products.find().sort({
  price: 1
})

db.users.find().sort({
  createdAt: -1
})`,

      keyIdea:
        "Use sorting to make database results arrive in the order required by the application."
    },

    /* =====================================================
       SECTION 4
    ===================================================== */

    {
      number: 4,

      title: "Limit and Skip",

      intro:
        "limit() restricts the number of returned documents, while skip() moves past a specified number of documents.",

      points: [
        "limit() is useful for top-N queries.",
        "skip() can be used for basic pagination.",
        "Large skip values can become inefficient for large datasets.",
        "Sorting should normally be deterministic when implementing pagination."
      ],

      code:
`db.students.find()
  .sort({ marks: -1 })
  .limit(10)

db.students.find()
  .sort({ marks: -1 })
  .skip(10)
  .limit(10)`,

      keyIdea:
        "limit controls how many documents are returned; skip controls where the result window begins."
    },

    /* =====================================================
       SECTION 5
    ===================================================== */

    {
      number: 5,

      title: "Pagination",

      intro:
        "Pagination prevents an API from returning thousands of records in a single response.",

      points: [
        "The client commonly sends page and limit values.",
        "The server converts those values into database operations.",
        "Offset pagination commonly uses skip and limit.",
        "A stable sort order is important.",
        "Cursor-based pagination can be useful for large or frequently changing datasets."
      ],

      code:
`const page = 3;
const limit = 10;

const skip = (page - 1) * limit;

db.students.find()
  .sort({ _id: 1 })
  .skip(skip)
  .limit(limit);`,

      keyIdea:
        "Pagination controls how much data an API returns at one time."
    },

    /* =====================================================
       SECTION 6
    ===================================================== */

    {
      number: 6,

      title: "Querying Arrays and Nested Documents",

      intro:
        "MongoDB documents can contain arrays and nested objects. MongoDB provides query operators for working with these structures.",

      points: [
        "Array fields can be queried directly.",
        "$in can match any value from a list.",
        "$all can require multiple array values.",
        "$elemMatch can match multiple conditions against one array element.",
        "Dot notation can access nested fields."
      ],

      code:
`db.students.find({
  skills: "MongoDB"
})

db.students.find({
  skills: {
    $all: ["React", "Node.js"]
  }
})

db.students.find({
  "address.city": "Hyderabad"
})

db.students.find({
  projects: {
    $elemMatch: {
      technology: "React",
      completed: true
    }
  }
})`,

      keyIdea:
        "MongoDB's document model makes nested and array-based queries natural."
    },

    /* =====================================================
       SECTION 7
    ===================================================== */

    {
      number: 7,

      title: "Update Operators in Depth",

      intro:
        "MongoDB provides many update operators for changing numbers, arrays, strings and selected fields.",

      points: [
        "$set assigns a value.",
        "$unset removes a field.",
        "$inc changes a numeric value.",
        "$mul multiplies a numeric value.",
        "$push adds an array element.",
        "$addToSet adds an array element only if it is not already present.",
        "$pull removes matching array elements.",
        "$pop removes an array element from the beginning or end."
      ],

      code:
`db.students.updateOne(
  { name: "Bhavya" },
  {
    $inc: {
      marks: 3
    },
    $addToSet: {
      skills: "MongoDB"
    }
  }
)

db.students.updateOne(
  { name: "Bhavya" },
  {
    $unset: {
      temporaryField: ""
    }
  }
)`,

      keyIdea:
        "Use the smallest appropriate update operation rather than replacing an entire document unnecessarily."
    },

    /* =====================================================
       SECTION 8
    ===================================================== */

    {
      number: 8,

      title: "Upsert Operations",

      intro:
        "An upsert combines update and insert behavior. If a matching document exists, it is updated. If no document matches, a new document can be created.",

      points: [
        "upsert is useful for create-or-update workflows.",
        "It is enabled through the upsert option.",
        "The filter determines which document is matched.",
        "The update determines what data is stored."
      ],

      code:
`db.settings.updateOne(
  {
    userId: "user101"
  },
  {
    $set: {
      theme: "dark",
      language: "en"
    }
  },
  {
    upsert: true
  }
)`,

      keyIdea:
        "Upsert is useful when the application wants one operation to either update an existing record or create it."
    },

    /* =====================================================
       SECTION 9
    ===================================================== */

    {
      number: 9,

      title: "Aggregation Pipeline",

      intro:
        "Aggregation allows MongoDB to process documents through a sequence of stages and produce calculated results.",

      points: [
        "An aggregation pipeline contains stages.",
        "The output of one stage becomes the input of the next.",
        "$match filters documents.",
        "$project selects or transforms fields.",
        "$group groups documents.",
        "$sort orders results.",
        "$limit restricts results.",
        "$set creates or changes fields."
      ],

      code:
`db.students.aggregate([
  {
    $match: {
      branch: "CSE"
    }
  },
  {
    $sort: {
      marks: -1
    }
  },
  {
    $limit: 5
  }
])`,

      keyIdea:
        "Think of aggregation as a data-processing pipeline where documents move through multiple transformation stages."
    },

    /* =====================================================
       SECTION 10
    ===================================================== */

    {
      number: 10,

      title: "$match and $project",

      intro:
        "$match filters documents while $project controls the fields and computed expressions that continue through the pipeline.",

      points: [
        "$match is commonly placed early in a pipeline.",
        "Early filtering can reduce later processing.",
        "$project can include selected fields.",
        "$project can rename or calculate fields.",
        "Aggregation projection is different from ordinary query projection because it is a pipeline stage."
      ],

      code:
`db.students.aggregate([
  {
    $match: {
      branch: "CSE"
    }
  },
  {
    $project: {
      _id: 0,
      name: 1,
      marks: 1
    }
  }
])`,

      keyIdea:
        "Filter data first when possible, then shape the data required by the next stage."
    },

    /* =====================================================
       SECTION 11
    ===================================================== */

    {
      number: 11,

      title: "$group and Accumulators",

      intro:
        "$group combines documents according to a grouping key and can calculate values such as totals, averages, minimums and maximums.",

      points: [
        "$sum calculates totals.",
        "$avg calculates averages.",
        "$min finds the minimum.",
        "$max finds the maximum.",
        "$count can count documents in supported aggregation patterns.",
        "The _id field in $group defines the grouping key."
      ],

      code:
`db.students.aggregate([
  {
    $group: {
      _id: "$branch",
      averageMarks: {
        $avg: "$marks"
      },
      highestMarks: {
        $max: "$marks"
      },
      totalStudents: {
        $sum: 1
      }
    }
  }
])`,

      keyIdea:
        "$group turns individual documents into summarized groups."
    },

    /* =====================================================
       SECTION 12
    ===================================================== */

    {
      number: 12,

      title: "Computed Fields with $set",

      intro:
        "Aggregation can calculate new values without permanently modifying the original documents.",

      points: [
        "$set can create calculated fields.",
        "$addFields is an alternative aggregation stage for adding fields.",
        "Computed fields exist in the pipeline result unless explicitly written back.",
        "Expressions can combine existing document fields."
      ],

      code:
`db.products.aggregate([
  {
    $set: {
      discountedPrice: {
        $multiply: [
          "$price",
          0.90
        ]
      }
    }
  },
  {
    $project: {
      name: 1,
      price: 1,
      discountedPrice: 1
    }
  }
])`,

      keyIdea:
        "Aggregation can transform data for reporting or API responses without changing stored documents."
    },

    /* =====================================================
       SECTION 13
    ===================================================== */

    {
      number: 13,

      title: "$lookup and Cross-Collection Data",

      intro:
        "$lookup can combine documents from different collections inside an aggregation pipeline.",

      points: [
        "$lookup is conceptually similar to a database join.",
        "It can match documents using related fields.",
        "The result is normally represented as an array.",
        "$lookup should be used intentionally because complex pipelines can become expensive.",
        "Good data modeling can sometimes avoid unnecessary cross-collection operations."
      ],

      code:
`db.orders.aggregate([
  {
    $lookup: {
      from: "users",
      localField: "userId",
      foreignField: "_id",
      as: "user"
    }
  }
])`,

      keyIdea:
        "$lookup allows related data from another collection to participate in an aggregation pipeline."
    },

    /* =====================================================
       SECTION 14
    ===================================================== */

    {
      number: 14,

      title: "Indexes in Practice",

      intro:
        "Indexes become especially important when collections grow and APIs repeatedly query specific fields.",

      points: [
        "Indexes can accelerate supported query patterns.",
        "Indexes consume memory and storage.",
        "Every additional index can add write overhead.",
        "Unique indexes can enforce uniqueness.",
        "Compound indexes can support multiple-field query patterns."
      ],

      code:
`db.users.createIndex(
  {
    email: 1
  },
  {
    unique: true
  }
)

db.students.createIndex({
  branch: 1,
  marks: -1
})`,

      keyIdea:
        "Create indexes for important access patterns rather than indexing every field."
    },

    /* =====================================================
       SECTION 15
    ===================================================== */

    {
      number: 15,

      title: "Compound Indexes",

      intro:
        "A compound index contains multiple fields. The order of fields in the index matters.",

      points: [
        "Compound indexes can support queries involving multiple fields.",
        "Field order matters.",
        "Sort direction can matter for some query patterns.",
        "Index design should match actual queries.",
        "A compound index is not automatically better than separate indexes."
      ],

      code:
`db.students.createIndex({
  branch: 1,
  marks: -1
})

db.students.find({
  branch: "CSE"
}).sort({
  marks: -1
})`,

      keyIdea:
        "A compound index should reflect the application's important filter and sort patterns."
    },

    /* =====================================================
       SECTION 16
    ===================================================== */

    {
      number: 16,

      title: "Query Performance with explain()",

      intro:
        "MongoDB provides explain() to help developers understand how a query is executed.",

      points: [
        "explain() provides information about query execution.",
        "Developers can inspect whether an index is being used.",
        "COLLSCAN represents a collection scan.",
        "IXSCAN represents index scanning.",
        "Query performance should be measured rather than guessed."
      ],

      code:
`db.students.find({
  branch: "CSE"
}).explain("executionStats")`,

      keyIdea:
        "Use execution information to investigate slow queries instead of assuming an index is helping."
    },

    /* =====================================================
       SECTION 17
    ===================================================== */

    {
      number: 17,

      title: "Designing Efficient MongoDB Queries",

      intro:
        "Good MongoDB performance comes from combining appropriate data modeling, indexes and query design.",

      points: [
        "Understand the application's most frequent queries.",
        "Return only required fields.",
        "Filter early in aggregation pipelines.",
        "Create indexes for important access patterns.",
        "Avoid returning unnecessarily large documents.",
        "Use pagination for large result sets.",
        "Measure slow queries.",
        "Avoid creating excessive indexes.",
        "Review data growth over time."
      ],

      code:
`db.jobs.find(
  {
    branch: "CSE-AI&ML",
    status: "open"
  },
  {
    title: 1,
    company: 1,
    package: 1,
    _id: 0
  }
)
.sort({
  package: -1
})
.limit(10)`,

      keyIdea:
        "Efficient MongoDB development combines data modeling, query design, projection, pagination and indexes."
    }
  ],

  /* =========================================================
     PREMIUM VISUALIZER
  ========================================================= */

  visualizer: {
    title: "MongoDB Aggregation Pipeline",

    description:
      "Visualize how a collection of documents passes through multiple aggregation stages and becomes a smaller, transformed result.",

    steps: [
      {
        label: "Collection",
        detail:
          "MongoDB starts with documents stored in a collection."
      },
      {
        label: "$match",
        detail:
          "Documents that do not satisfy the filter are removed from the pipeline."
      },
      {
        label: "$project",
        detail:
          "Only required fields and calculated values continue."
      },
      {
        label: "$group",
        detail:
          "Documents are grouped and aggregate values are calculated."
      },
      {
        label: "$set",
        detail:
          "New calculated fields can be created."
      },
      {
        label: "$sort",
        detail:
          "The resulting documents are ordered."
      },
      {
        label: "$limit",
        detail:
          "Only the required number of documents continues."
      },
      {
        label: "API Result",
        detail:
          "The final transformed data can be returned by an Express API."
      }
    ]
  },

  /* =========================================================
     TRACE
  ========================================================= */

  trace: {
    title: "Trace a MongoDB Aggregation Query",

    description:
      "Follow student documents through a real aggregation pipeline that calculates branch-wise statistics.",

    steps: [
      {
        line: 1,
        code: "db.students.aggregate([",
        explanation:
          "MongoDB starts an aggregation pipeline."
      },
      {
        line: 2,
        code: '{ $match: { active: true } },',
        explanation:
          "Inactive students are removed from the pipeline."
      },
      {
        line: 3,
        code: '{ $group: { _id: "$branch", total: { $sum: 1 } } },',
        explanation:
          "Remaining students are grouped by branch and counted."
      },
      {
        line: 4,
        code: '{ $sort: { total: -1 } }',
        explanation:
          "Branches are sorted from the largest student count to the smallest."
      },
      {
        line: 5,
        code: "])",
        explanation:
          "MongoDB returns the final aggregated result."
      }
    ]
  },

  /* =========================================================
     REVISION
  ========================================================= */

  revision: [
    [
      "Projection",
      "Selecting which fields should appear in query results."
    ],
    [
      "sort()",
      "Orders MongoDB query results."
    ],
    [
      "limit()",
      "Restricts the number of returned documents."
    ],
    [
      "skip()",
      "Skips a specified number of documents."
    ],
    [
      "Pagination",
      "Returning a dataset in smaller pages."
    ],
    [
      "$set",
      "Sets or creates fields during updates or aggregation."
    ],
    [
      "$unset",
      "Removes a field from a document."
    ],
    [
      "$inc",
      "Increments a numeric field."
    ],
    [
      "$push",
      "Adds an element to an array."
    ],
    [
      "$addToSet",
      "Adds an array element only if it is not already present."
    ],
    [
      "$pull",
      "Removes matching elements from an array."
    ],
    [
      "Upsert",
      "Updates a matching document or inserts one when no match exists."
    ],
    [
      "Aggregation Pipeline",
      "Sequence of stages that processes MongoDB documents."
    ],
    [
      "$match",
      "Filters documents inside an aggregation pipeline."
    ],
    [
      "$project",
      "Shapes fields in aggregation output."
    ],
    [
      "$group",
      "Groups documents and calculates aggregate values."
    ],
    [
      "$lookup",
      "Combines related data from another collection."
    ],
    [
      "Index",
      "Data structure that can improve supported query performance."
    ],
    [
      "Compound Index",
      "Index containing multiple fields."
    ],
    [
      "COLLSCAN",
      "Execution strategy that scans collection documents."
    ],
    [
      "IXSCAN",
      "Execution strategy that scans an index."
    ],
    [
      "explain()",
      "Provides information about MongoDB query execution."
    ]
  ],

  /* =========================================================
     INTERVIEW
  ========================================================= */

  interview: [
    {
      question: "What is projection in MongoDB?",

      answer:
        "Projection controls which fields are returned by a query. It can reduce unnecessary data transfer and help prevent unwanted fields from being returned."
    },

    {
      question: "What is the difference between sort() and limit()?",

      answer:
        "sort() controls result order, while limit() controls the maximum number of documents returned."
    },

    {
      question: "How does pagination work with skip and limit?",

      answer:
        "A page number can be converted into an offset using skip, while limit determines the number of records returned for that page."
    },

    {
      question: "What is an aggregation pipeline?",

      answer:
        "It is a sequence of MongoDB stages that filter, transform, group, sort and otherwise process documents."
    },

    {
      question: "What does $match do?",

      answer:
        "$match filters documents in an aggregation pipeline according to specified conditions."
    },

    {
      question: "What does $group do?",

      answer:
        "$group combines documents according to a grouping key and can calculate values such as count, sum, average, minimum and maximum."
    },

    {
      question: "What is $lookup?",

      answer:
        "$lookup combines related documents from another collection inside an aggregation pipeline."
    },

    {
      question: "What is an upsert?",

      answer:
        "An upsert updates a matching document or inserts a new document when no matching document exists."
    },

    {
      question: "What is a compound index?",

      answer:
        "A compound index contains multiple fields. The order of those fields matters when MongoDB uses the index for queries and sorting."
    },

    {
      question: "What is COLLSCAN?",

      answer:
        "COLLSCAN indicates that MongoDB is scanning documents in the collection rather than using an index for that portion of query execution."
    },

    {
      question: "What is IXSCAN?",

      answer:
        "IXSCAN indicates that MongoDB is scanning an index as part of query execution."
    },

    {
      question: "Why should you not create an index on every field?",

      answer:
        "Indexes consume storage and can increase write overhead. Indexes should be based on important application query patterns."
    },

    {
      question: "Why is explain() useful?",

      answer:
        "explain() provides execution information that helps developers investigate query performance and determine how MongoDB is executing a query."
    }
  ],

  /* =========================================================
     PRACTICE
  ========================================================= */

  practice: [
    {
      title: "Top Five Students",

      task:
        "Find the five students with the highest marks.",

      hint:
        "Sort marks descending and use limit(5).",

      answer:
`db.students.find()
  .sort({
    marks: -1
  })
  .limit(5)`
    },

    {
      title: "Student Projection",

      task:
        "Return only student name and branch, excluding _id.",

      hint:
        "Use projection in find().",

      answer:
`db.students.find(
  {},
  {
    name: 1,
    branch: 1,
    _id: 0
  }
)`
    },

    {
      title: "Paginate Students",

      task:
        "Return page 2 with 10 students per page.",

      hint:
        "Calculate skip using (page - 1) * limit.",

      answer:
`const page = 2;
const limit = 10;

const skip = (page - 1) * limit;

db.students.find()
  .sort({ _id: 1 })
  .skip(skip)
  .limit(limit)`
    },

    {
      title: "Update Skills",

      task:
        "Add MongoDB to a student's skills only when it does not already exist.",

      hint:
        "Use $addToSet.",

      answer:
`db.students.updateOne(
  { name: "Bhavya" },
  {
    $addToSet: {
      skills: "MongoDB"
    }
  }
)`
    },

    {
      title: "Create an Upsert",

      task:
        "Create or update a user's theme setting.",

      hint:
        "Use updateOne with upsert: true.",

      answer:
`db.settings.updateOne(
  {
    userId: "user101"
  },
  {
    $set: {
      theme: "dark"
    }
  },
  {
    upsert: true
  }
)`
    },

    {
      title: "Branch Statistics",

      task:
        "Calculate the number of students in each branch using aggregation.",

      hint:
        "Use $group and $sum.",

      answer:
`db.students.aggregate([
  {
    $group: {
      _id: "$branch",
      totalStudents: {
        $sum: 1
      }
    }
  }
])`
    },

    {
      title: "Average Marks",

      task:
        "Calculate the average marks of students in each branch.",

      hint:
        "Use $group with $avg.",

      answer:
`db.students.aggregate([
  {
    $group: {
      _id: "$branch",
      averageMarks: {
        $avg: "$marks"
      }
    }
  }
])`
    },

    {
      title: "Create a Compound Index",

      task:
        "Create an index supporting queries that filter by branch and sort by marks descending.",

      hint:
        "Use two fields in the index.",

      answer:
`db.students.createIndex({
  branch: 1,
  marks: -1
})`
    },

    {
      title: "Inspect a Query",

      task:
        "Use explain() to inspect execution statistics for a branch query.",

      hint:
        "Use explain('executionStats').",

      answer:
`db.students.find({
  branch: "CSE"
}).explain("executionStats")`
    }
  ],

  /* =========================================================
     QUIZ
  ========================================================= */

  quiz: [
    {
      question:
        "Which method controls the number of documents returned?",

      options: [
        "sort()",
        "limit()",
        "group()",
        "index()"
      ],

      answer: 1,

      explanation:
        "limit() restricts the number of returned documents."
    },

    {
      question:
        "Which method is commonly used for ordering query results?",

      options: [
        "sort()",
        "orderBy()",
        "arrange()",
        "sequence()"
      ],

      answer: 0,

      explanation:
        "MongoDB uses sort() to order query results."
    },

    {
      question:
        "What does $addToSet do?",

      options: [
        "Deletes an array",
        "Adds an array value only if it is not already present",
        "Sorts an array",
        "Removes a field"
      ],

      answer: 1,

      explanation:
        "$addToSet prevents duplicate values from being added to an array."
    },

    {
      question:
        "What is an upsert?",

      options: [
        "Only an insert",
        "Only an update",
        "Update if found, otherwise insert",
        "Delete and recreate every document"
      ],

      answer: 2,

      explanation:
        "An upsert performs an update when a match exists and can insert when no match exists."
    },

    {
      question:
        "Which aggregation stage filters documents?",

      options: [
        "$match",
        "$group",
        "$sort",
        "$lookup"
      ],

      answer: 0,

      explanation:
        "$match filters documents in an aggregation pipeline."
    },

    {
      question:
        "Which aggregation stage groups documents?",

      options: [
        "$join",
        "$group",
        "$collect",
        "$combine"
      ],

      answer: 1,

      explanation:
        "$group creates groups and can calculate aggregate values."
    },

    {
      question:
        "Which operator can calculate an average in $group?",

      options: [
        "$avg",
        "$meanValue",
        "$average",
        "$middle"
      ],

      answer: 0,

      explanation:
        "$avg calculates an average."
    },

    {
      question:
        "What does $lookup do?",

      options: [
        "Creates an index",
        "Combines related data from another collection",
        "Deletes a database",
        "Encrypts documents"
      ],

      answer: 1,

      explanation:
        "$lookup can combine related documents from another collection."
    },

    {
      question:
        "What does an index primarily help with?",

      options: [
        "Query performance",
        "HTML rendering",
        "Password hashing",
        "React state"
      ],

      answer: 0,

      explanation:
        "Indexes can improve the performance of supported queries."
    },

    {
      question:
        "What does IXSCAN indicate?",

      options: [
        "Index scanning",
        "Collection deletion",
        "Document insertion",
        "Network failure"
      ],

      answer: 0,

      explanation:
        "IXSCAN indicates that MongoDB is scanning an index during query execution."
    },

    {
      question:
        "Why is explain() useful?",

      options: [
        "It creates React components",
        "It investigates query execution",
        "It encrypts MongoDB",
        "It deletes indexes"
      ],

      answer: 1,

      explanation:
        "explain() provides information about how MongoDB executes a query."
    },

    {
      question:
        "Which approach is useful for large API result sets?",

      options: [
        "Return every document",
        "Pagination",
        "Disable indexes",
        "Duplicate every document"
      ],

      answer: 1,

      explanation:
        "Pagination limits the amount of data returned in one API response."
    }
  ],

  /* =========================================================
     GLOSSARY
  ========================================================= */

  glossary: [
    {
      term: "Projection",
      definition:
        "Selection of fields returned by a MongoDB query or aggregation."
    },

    {
      term: "Sorting",
      definition:
        "Ordering query results according to one or more fields."
    },

    {
      term: "Pagination",
      definition:
        "Dividing a large result set into smaller pages."
    },

    {
      term: "Upsert",
      definition:
        "Operation that updates a matching document or inserts one when no match exists."
    },

    {
      term: "Aggregation",
      definition:
        "MongoDB mechanism for processing and transforming documents."
    },

    {
      term: "Aggregation Pipeline",
      definition:
        "Ordered sequence of aggregation stages."
    },

    {
      term: "$match",
      definition:
        "Aggregation stage used to filter documents."
    },

    {
      term: "$project",
      definition:
        "Aggregation stage used to shape fields."
    },

    {
      term: "$group",
      definition:
        "Aggregation stage used to group documents and calculate aggregate values."
    },

    {
      term: "$set",
      definition:
        "Stage or update operator used to create or modify fields."
    },

    {
      term: "$lookup",
      definition:
        "Aggregation stage used to combine related data from another collection."
    },

    {
      term: "Accumulator",
      definition:
        "Aggregation expression such as $sum or $avg that calculates values across grouped documents."
    },

    {
      term: "Index",
      definition:
        "Data structure that can improve supported query and sort operations."
    },

    {
      term: "Compound Index",
      definition:
        "Index containing multiple fields."
    },

    {
      term: "Unique Index",
      definition:
        "Index that prevents duplicate indexed values when configured as unique."
    },

    {
      term: "COLLSCAN",
      definition:
        "Query execution stage involving a collection scan."
    },

    {
      term: "IXSCAN",
      definition:
        "Query execution stage involving an index scan."
    },

    {
      term: "explain()",
      definition:
        "MongoDB method used to inspect query execution information."
    },

    {
      term: "Query Optimization",
      definition:
        "Process of improving database query efficiency using appropriate modeling, indexes and query design."
    }
  ],

  /* =========================================================
     COMPLETION
  ========================================================= */

  completion: {
    title: "MongoDB CRUD & Aggregation Complete!",

    message:
      "You can now work with MongoDB beyond basic CRUD. You understand projections, sorting, pagination, array queries, update operators, upserts, aggregation pipelines, grouping, lookups, indexes, compound indexes and query analysis.",

    achievements: [
      "Advanced MongoDB CRUD",
      "Projection",
      "Sorting",
      "Pagination",
      "Array Queries",
      "Nested Document Queries",
      "Advanced Update Operators",
      "Upsert",
      "Aggregation Pipelines",
      "$match",
      "$project",
      "$group",
      "Computed Fields",
      "$lookup",
      "Indexes",
      "Compound Indexes",
      "Query Performance Analysis"
    ],

    nextLevel:
      "Level 26 — Mongoose, Relationships & Transactions"
  }
};
