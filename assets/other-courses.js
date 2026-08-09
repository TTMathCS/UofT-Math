"use strict";

// Courses outside MAT/APM/STA that the programs lean on: the programming,
// physics, economics and philosophy requirements, plus the first-year calculus
// streams this library does not write guides for.
//
// Titles are filled in where they are certain. Where they are not, the row
// carries the code and its calendar link only, which is enough to look up and
// saves inventing a title that later turns out wrong. Fill one in whenever you
// have the calendar open.
(function () {
  var DEPARTMENTS = Object.freeze({
    AST: "Astronomy",
    CSC: "Computer Science",
    ECO: "Economics",
    ENG: "English",
    ENV: "Environment",
    HPS: "History and Philosophy of Science",
    MAT: "Mathematics",
    PHL: "Philosophy",
    PHY: "Physics",
    PSL: "Physiology",
    STA: "Statistical Sciences"
  });

  // path and chapters are set once a course has a written guide in this repo;
  // without them the row still appears, linking only to the calendar
  function course(code, title, path, chapters) {
    return Object.freeze({
      code: code,
      title: title || "",
      subject: DEPARTMENTS[code.slice(0, 3)] || "Other",
      credits: /Y1$/.test(code) ? 1 : 0.5,
      path: path || "",
      chapters: chapters || 0
    });
  }

  window.UOFT_OTHER_COURSES = Object.freeze([
    course("AST221H1", "Stars and Planets"),
    course("CSC108H1", "Introduction to Computer Programming", "CSC108H1/index.html", 10),
    course("CSC110Y1", "Foundations of Computer Science I"),
    course("CSC111H1", "Foundations of Computer Science II"),
    course("CSC148H1", "Introduction to Computer Science", "CSC148H1/index.html", 10),
    course("CSC207H1", "Software Design"),
    course("CSC300H1", "Computers and Society"),
    course("CSC336H1", "Numerical Methods"),
    course("CSC436H1"),
    course("CSC446H1"),
    course("CSC456H1"),
    course("ECO101H1", "Principles of Microeconomics"),
    course("ECO102H1", "Principles of Macroeconomics"),
    course("ECO206Y1", "Microeconomic Theory"),
    course("ECO220Y1", "Quantitative Methods in Economics"),
    course("ECO227Y1", "Foundations of Econometrics"),
    course("ECO358H1", "Financial Economics I"),
    course("ECO359H1", "Financial Economics II"),
    course("ECO375H1", "Applied Econometrics I"),
    course("ENG140Y1", "Literature for our Time"),
    course("ENV200H1"),
    course("HPS390H1"),
    course("HPS391H1"),
    course("MAT130H1"),
    course("MAT133Y1", "Calculus and Linear Algebra for Commerce"),
    course("MAT135H1", "Calculus I"),
    course("MAT136H1", "Calculus II"),
    course("MAT148H1"),
    course("MAT149H1"),
    course("MAT157Y1", "Analysis I"),
    course("MAT221H1", "Applied Linear Algebra"),
    course("MAT235Y1", "Multivariable Calculus"),
    course("MAT329Y1", "Concepts in Elementary Mathematics"),
    course("MAT390H1"),
    course("MAT391H1"),
    course("PHL232H1"),
    course("PHL233H1"),
    course("PHL255H1"),
    course("PHL265H1"),
    course("PHL271H1"),
    course("PHL275H1"),
    course("PHL345H1"),
    course("PHL348H1"),
    course("PHY131H1", "Introduction to Physics I", "PHY131H1/index.html", 10),
    course("PHY132H1", "Introduction to Physics II"),
    course("PHY151H1", "Foundations of Physics I"),
    course("PHY152H1", "Foundations of Physics II"),
    course("PHY224H1", "Practical Physics I"),
    course("PHY250H1", "Electricity and Magnetism"),
    course("PHY252H1", "Thermal Physics"),
    course("PHY254H1", "Classical Mechanics"),
    course("PHY256H1", "Introduction to Quantum Mechanics"),
    course("PHY324H1", "Practical Physics II"),
    course("PHY350H1", "Electromagnetic Theory"),
    course("PHY354H1", "Advanced Classical Mechanics"),
    course("PHY356H1", "Quantum Mechanics I"),
    course("PHY424H1"),
    course("PHY450H1"),
    course("PHY452H1", "Basic Statistical Mechanics"),
    course("PHY454H1"),
    course("PHY456H1", "Quantum Mechanics II"),
    course("PHY460H1"),
    course("PHY478H1"),
    course("PHY479Y1"),
    course("PSL432H1"),
    course("STA130H1", "An Introduction to Statistical Reasoning and Data Science"),
    course("STA220H1", "The Practice of Statistics I"),
    course("STA221H1", "The Practice of Statistics II")
  ]);
}());
