"use strict";

// Courses already registered for, by term. Anything listed here shows as taken
// in the plan table and drops out of what is still owed.
//
// Codes that exist in courses.js link to their guide; the rest just need a
// title and credit value here. Y-coded courses are full year and worth 1.0.
// Clear the terms array to turn the whole thing off.
(function () {
  // A Y course runs both terms, so it gets a row in each. Mark the second one
  // continued: it still shows in winter but the credit is only counted once.
  function course(code, title, credits, continued) {
    return Object.freeze({
      code: code,
      title: title,
      credits: credits,
      continued: Boolean(continued)
    });
  }

  function term(name, span, courses) {
    return Object.freeze({ name: name, span: span, courses: Object.freeze(courses) });
  }

  window.UOFT_ENROLLED = Object.freeze({
    year: "Year 1",
    label: "2026-27",
    terms: Object.freeze([
      term("Fall 2026", "", [
        course("MAT158H1", "Analysis 1A", 0.5),
        course("MAT240H1", "Algebra I", 0.5),
        course("CSC108H1", "Introduction to Computer Programming", 0.5),
        course("PHY131H1", "Introduction to Physics I", 0.5),
        course("ENG140Y1", "Literature for our Time", 1)
      ]),
      term("Winter 2027", "", [
        course("MAT159H1", "Analysis 1B", 0.5),
        course("MAT247H1", "Algebra II", 0.5),
        course("CSC148H1", "Introduction to Computer Science", 0.5),
        course("PHY132H1", "Introduction to Physics II", 0.5),
        course("ENG140Y1", "Literature for our Time", 1, true)
      ])
    ])
  });
}());
