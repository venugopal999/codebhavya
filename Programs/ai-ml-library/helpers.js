"use strict";

const { makePython } = require("../python-library/helpers");

function makeAiMl(options) {
  return makePython({
    course: "ai-ml",
    courseLabel: "AI & Machine Learning",
    learnHref: "../AI-ML/index.html",
    difficulty: "Intermediate",
    ...options
  });
}

module.exports = { makeAiMl };
