"use strict";

function clean(text) {
  return String(text).replace(/^\n/, "").replace(/\s+$/, "");
}

function joinConcepts(concepts) {
  if (concepts.length === 1) return concepts[0];
  if (concepts.length === 2) return `${concepts[0]} and ${concepts[1]}`;
  return `${concepts.slice(0, -1).join(", ")}, and ${concepts.at(-1)}`;
}

function buildSteps(options, concepts) {
  const readsInput = /Scanner|BufferedReader/.test(options.source);
  const createsObject = /new\s+[A-Z][A-Za-z0-9_]*/.test(options.source);
  return [
    readsInput
      ? `Read the sample input and convert it into the Java values required for ${options.title.toLowerCase()}.`
      : `Initialize the deterministic sample values used for ${options.title.toLowerCase()}.`,
    createsObject
      ? `Create the required object and apply ${joinConcepts(concepts.slice(0, 2))} to its state or behavior.`
      : `Apply ${joinConcepts(concepts.slice(0, 2))} in the order shown by the program.`,
    `Print the final result and compare it with the documented sample output.`
  ];
}

function buildExplanation(options, concepts) {
  return `This Java 17 example demonstrates ${joinConcepts(concepts)} through a complete, executable program. The values are intentionally small so students can trace each statement, verify the output, and then modify the example safely in the online compiler.`;
}

function buildErrors(options, concepts) {
  const errors = [];
  if (/Scanner/.test(options.source)) errors.push("Create one Scanner for System.in, read values in the documented order, and use the correct next... method for each type.");
  else errors.push("Keep the class name Main and the entry method signature public static void main(String[] args) when using the online compiler.");
  if (/\bclass\s+(?!Main)/.test(options.source)) errors.push("Create an object before accessing instance members; static members can be accessed through the class name.");
  else if (/\bfor\b|\bwhile\b/.test(options.source)) errors.push("Check the loop boundary and update expression carefully to avoid skipping the final value or creating an infinite loop.");
  else errors.push(`Use ${concepts[0]} with compatible Java types; Java checks types and method signatures at compile time.`);
  errors.push("Java is case-sensitive, and every statement that requires a semicolon must end with one.");
  return errors;
}

function inferTime(options) {
  if (options.time) return options.time;
  if (/binary-search/.test(options.slug)) return "O(log n)";
  if (/sort|priority-queue|tree-map|tree-set/.test(options.slug)) return "O(n log n)";
  if (/matrix-multiplication/.test(options.slug)) return "O(n³)";
  if (/matrix|pattern|nested/.test(options.slug)) return "O(n²)";
  if (/recursive-fibonacci/.test(options.slug)) return "O(2ⁿ)";
  if (/prime/.test(options.slug)) return "O(√n)";
  if (/array|string|list|set|map|loop|factorial|fibonacci|stream|file|queue|stack/.test(options.slug)) return "O(n)";
  return "O(1)";
}

function inferSpace(options) {
  if (options.space) return options.space;
  if (/recursive/.test(options.slug)) return "O(n)";
  if (/matrix/.test(options.slug)) return "O(n²)";
  if (/array|list|set|map|queue|stack|file|stream/.test(options.slug)) return "O(n)";
  return "O(1)";
}

function makeJava(options) {
  const concepts = options.concepts?.length ? options.concepts : [options.topic];
  return {
    course: "java",
    courseLabel: "Java",
    language: "java",
    languageLabel: "Java 17",
    extension: "java",
    learnHref: "../Java/index.html",
    difficulty: "Beginner",
    sampleInput: "No input required",
    summary: `Learn ${options.title.toLowerCase()} with a complete, compiler-ready Java 17 example.`,
    time: inferTime(options),
    space: inferSpace(options),
    explanation: options.explanation || buildExplanation(options, concepts),
    errors: options.errors || buildErrors(options, concepts),
    steps: options.steps || buildSteps(options, concepts),
    ...options,
    concepts,
    source: clean(options.source)
  };
}

function main(body, imports = "") {
  return clean(`${imports}${imports ? "\n\n" : ""}class Main {
    public static void main(String[] args) throws Exception {
${String(body).split("\n").map((line) => `        ${line}`).join("\n")}
    }
}`);
}

module.exports = { clean, main, makeJava };
