"use strict";

const { cMain, clean, makeProgram } = require("../c-library/helpers");

function makeDsa(options) {
  return makeProgram({
    course: "dsa",
    courseLabel: "Data Structures",
    language: "c",
    learnHref: "../Data-Structures/index.html",
    ...options
  });
}

module.exports = { cMain, clean, makeDsa };
