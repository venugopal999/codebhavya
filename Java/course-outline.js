"use strict";
window.JAVA_OUTLINE = [
  { part: "Part 1", name: "Language Foundations", range: "Levels 01–06", description: "Build correct Java programs and reason about values, decisions, repetition and data.", levels: [
    [1,"Java Platform & First Program","JDK, JRE, JVM, source-to-bytecode flow and program structure","01","☕"],
    [2,"Variables, Types & Input","Primitive types, literals, conversions, scope and Scanner input","02","x"],
    [3,"Operators & Expressions","Arithmetic, comparison, logical, bitwise and expression evaluation","03","±"],
    [4,"Decision Making","if, if-else, nested decisions, switch expressions and validation","04","◇"],
    [5,"Loops & Pattern Reasoning","for, while, do-while, break, continue and loop design","05","↻"],
    [6,"Arrays & Matrices","One-dimensional arrays, traversal, searching, copying and 2D arrays","06","▦"]
  ]},
  { part: "Part 2", name: "Methods & Object-Oriented Java", range: "Levels 07–13", description: "Model responsibilities with methods, objects, inheritance, interfaces and packages.", levels: [
    [7,"Strings & Text Processing","String immutability, comparison, builders, parsing and common algorithms","07","Aa"],
    [8,"Methods, Overloading & Recursion","Parameters, returns, call stack, overloading, varargs and recursion","08","ƒ"],
    [9,"Classes & Objects","State, behaviour, references, object collaboration and cohesive design","09","◫"],
    [10,"Constructors, this & static","Initialization, constructor chaining, class members and immutability","10","⚙"],
    [11,"Inheritance & Composition","IS-A, HAS-A, overriding, super, final and substitutability","11","△"],
    [12,"Polymorphism, Abstraction & Interfaces","Dynamic dispatch, abstract classes, interfaces and contracts","12","◎"],
    [13,"Encapsulation, Packages & Access","Access control, packages, imports, records and API boundaries","13","▣"]
  ]},
  { part: "Part 3", name: "Reliable Java & Core Libraries", range: "Levels 14–20", description: "Handle failures, organize data, process streams, persist files and coordinate threads.", levels: [
    [14,"Exception Handling","Exception hierarchy, try/catch/finally, resources and domain errors","14","!"],
    [15,"Generics & Type Safety","Generic classes/methods, bounds, wildcards, invariance and erasure","15","<T>"],
    [16,"Collections Framework","List, Set, Map, Queue, iterators, ordering and complexity choices","16","{ }"],
    [17,"Lambdas & Functional Interfaces","Method references, closures, standard interfaces and composition","17","λ"],
    [18,"Stream API & Optional","Pipelines, map/filter/reduce, collectors, laziness and absence modelling","18","⇢"],
    [19,"File I/O, NIO & Serialization","Paths, buffered I/O, resources, object data and safe persistence","19","▤"],
    [20,"Multithreading & Concurrency","Threads, locks, executors, futures, atomics and concurrent collections","20","≋"]
  ]},
  { part: "Part 4", name: "Production & Placement", range: "Levels 21–24", description: "Understand the runtime, connect databases, test designs and present complete projects.", levels: [
    [21,"JVM Memory & Garbage Collection","Class loading, stacks, heap, reachability, GC and profiling","21","JVM"],
    [22,"Modern Java & Date/Time","Enums, records, sealed types, pattern matching, modules and java.time","22","J+"],
    [23,"JDBC & Database Programming","Connections, prepared statements, transactions, mapping and pooling","23","DB"],
    [24,"Testing, Debugging & Placement Projects","JUnit thinking, debugging, clean design, projects and interviews","24","★"]
  ]}
];
window.JAVA_LESSONS = window.JAVA_LESSONS || {};
window.buildJavaLesson = function (c) {
  const part = c.level <= 6 ? "PART 1 · LANGUAGE FOUNDATIONS" : c.level <= 13 ? "PART 2 · METHODS & OBJECT-ORIENTED DESIGN" : c.level <= 20 ? "PART 3 · RELIABLE JAVA & CORE LIBRARIES" : "PART 4 · PRODUCTION & PLACEMENT";
  return {part, title:c.title, intro:c.intro, difficulty:c.difficulty || "Intermediate", duration:c.duration || "110–150 minutes", goal:c.goal, outcomes:c.outcomes, conceptTitle:c.conceptTitle || c.title + ": Mental Models and Practice", conceptIntro:c.conceptIntro || "Learn the mechanism first, then use the API with clear assumptions, boundaries and tests.", sections:c.sections, examples:c.examples, visual:c.visual, revision:c.revision, interview:c.interview, practice:c.practice, quiz:c.quiz, summaryTitle:c.summaryTitle || "You can apply " + c.title + " deliberately", summary:c.summary || c.revision.slice(0,5)};
};
