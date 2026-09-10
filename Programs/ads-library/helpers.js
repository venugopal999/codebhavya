"use strict";

const { cMain, clean, makeProgram } = require("../c-library/helpers");

function makeAds(options) {
  return makeProgram({
    course: "ads",
    courseLabel: "Advanced Data Structures",
    language: "c",
    learnHref: "../Advanced-Data-Structures/index.html",
    difficulty: "Intermediate",
    sampleInput: "No input required",
    space: "O(1)",
    ...options
  });
}

module.exports = { cMain, clean, makeAds };
