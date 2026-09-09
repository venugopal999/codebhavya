"use strict";

function clean(text) {
  return String(text).replace(/^\n/, "").replace(/\s+$/, "");
}

function cMain(body, headers = ["stdio.h"], extra = "") {
  const includes = headers.map((header) => `#include <${header}>`).join("\n");
  return clean(`${includes}\n${extra ? `\n${clean(extra)}\n` : ""}\nint main(void)\n{\n${clean(body)}\n}\n`);
}

function indent(text, spaces = 4) {
  const padding = " ".repeat(spaces);
  return clean(text).split("\n").map((line) => line ? padding + line : "").join("\n");
}

function makeProgram(options) {
  const concepts = Array.isArray(options.concepts) && options.concepts.length
    ? options.concepts
    : [options.topic];
  const steps = Array.isArray(options.steps) && options.steps.length
    ? options.steps
    : [
        "Read the required input values.",
        options.method || `Apply the ${options.title.toLowerCase()} logic.`,
        "Display the computed result."
      ];

  return {
    difficulty: "Beginner",
    time: "O(1)",
    space: "O(1)",
    sampleInput: "No input required",
    sampleOutput: "Program completed.",
    summary: `Learn how to ${options.title.toLowerCase()} using a clear C program.`,
    explanation: options.method || `This program demonstrates ${options.title.toLowerCase()} with direct, readable C statements.`,
    errors: [
      "Use the correct format specifier for every variable.",
      "Initialize variables before using their values.",
      "Check braces, semicolons and input order carefully."
    ],
    ...options,
    concepts,
    steps,
    source: clean(options.source)
  };
}

module.exports = { cMain, clean, indent, makeProgram };
