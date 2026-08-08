"use strict";

// Which term each course runs in, pulled from the Arts & Science timetable for
// the 2026-27 session (api.easi.utoronto.ca/ttb, sessions 20269 and 20271).
//
//   F  fall only        S  winter only
//   FS offered in both  Y  full year, runs across both terms
//   -  not offered in 2026-27
//
// This is a snapshot of one year, not a promise. Offerings rotate, so a course
// marked "-" may well run again, and a fall-only course can move. Refetch each
// summer rather than trusting these into later years; the plan labels the year
// the data came from for exactly that reason.
(function () {
  window.UOFT_TERM_SOURCE = "2026-27 timetable";

  window.UOFT_TERMS = Object.freeze({
    MAT158H1: "F",
    MAT159H1: "S",
    MAT240H1: "F",
    MAT247H1: "S",
    MAT257Y1: "Y",
    MAT267H1: "S",
    MAT301H1: "FS",
    MAT334H1: "FS",
    MAT337H1: "FS",
    MAT332H1: "F",
    MAT344H1: "FS",
    MAT351Y1: "Y",
    MAT377H1: "F",
    APM346H1: "FS",
    STA257H1: "F",
    STA261H1: "S",
    STA302H1: "FS",
    STA355H1: "F",
    STA410H1: "S",
    STA414H1: "S",
    STA437H1: "FS",
    STA442H1: "F",
    STA447H1: "S",
    STA452H1: "-",
    STA453H1: "-",
    CSC108H1: "FS",
    CSC148H1: "FS",
    PHY131H1: "FS",
    PHY132H1: "S",
    ENG140Y1: "Y"
  });
}());
