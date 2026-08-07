"use strict";

// Where these programs sit at St. George. Built to answer one question: what
// was the offer actually an offer to?
//
// Sizes are only given where the university publishes them. Faculty-level
// headcount is public; per-department and per-program counts are not, so those
// nodes carry no number rather than a guess. The useful signal further down is
// open vs limited enrolment, which is on each program row instead.
(function () {
  function node(name, tag, note, children) {
    return Object.freeze({
      name: name,
      tag: tag || "",
      note: note || "",
      children: Object.freeze(children || [])
    });
  }

  window.UOFT_STRUCTURE = node(
    "University of Toronto — St. George", "campus", "", [
      node("Faculty of Arts & Science", "faculty", "30,850+ undergraduates · 400+ programs", [
        node("Computer Science", "admission category",
          "separate OUAC code · supplemental application"),
        node("Humanities", "admission category", ""),
        node("Life Sciences", "admission category", ""),
        node("Mathematical & Physical Sciences", "admission category",
          "28 program areas across 6 departments", [
            node("Mathematics", "department", "9 program areas"),
            node("Statistical Sciences", "department", "4 program areas"),
            node("Physics", "department", ""),
            node("Chemistry", "department", ""),
            node("Astronomy & Astrophysics", "department", ""),
            node("Earth Sciences", "department", "")
          ]),
        node("Rotman Commerce", "admission category",
          "separate OUAC code · not available as a fallback"),
        node("Social Sciences", "admission category", "")
      ]),
      node("Applied Science & Engineering", "faculty", "separate admission, no shared programs"),
      node("Music", "faculty", ""),
      node("Kinesiology & Physical Education", "faculty", ""),
      node("Daniels — Architecture, Landscape and Design", "faculty", "")
    ]);

  // the branch a Mathematical & Physical Sciences offer actually lands on
  window.UOFT_STRUCTURE_PATH = Object.freeze([
    "Faculty of Arts & Science",
    "Mathematical & Physical Sciences",
    "Mathematics",
    "Statistical Sciences"
  ]);
}());
