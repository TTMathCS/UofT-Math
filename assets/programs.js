"use strict";

// Program requirements, transcribed from the Arts & Science calendar.
//
//   required  courses you take no matter which options you pick
//   options   courses that appear in a choose-from list
//   tracks    2-3 hand-picked routes through those options
//   outside   requirements in departments this catalog does not cover
//
// Only codes that exist in courses.js belong in required/options/tracks;
// anything else goes in outside so the student still sees it. Track picks must
// come from that program's own options list. Recheck against the calendar each
// summer, the lists move.
(function () {
  // 400-level APM/MAT, the pool most specialists draw their advanced credits from
  var ADVANCED_400 = [
    "MAT401H1", "MAT402H1", "MAT403H1", "MAT409H1", "MAT415H1", "MAT417H1",
    "APM421H1", "MAT425H1", "APM426H1", "MAT436H1", "MAT437H1", "APM441H1",
    "MAT445H1", "APM446H1", "MAT448H1", "MAT449H1", "MAT454H1", "MAT457H1",
    "MAT458H1", "APM461H1", "MAT461H1", "APM462H1", "MAT464H1", "APM466H1",
    "MAT475H1", "MAT478H1"
  ];

  // the calculus/analysis entry sequences every non-specialist program lists
  var ENTRY_CALCULUS = [
    "MAT137", "MAT158H1", "MAT159H1", "MAT246H1",
    "MAT235H1", "MAT236H1", "MAT237Y1", "MAT257Y1"
  ];

  var ETHICS = "0.5 credit in ethics and social responsibility (CSC300H1, ENV200H1, PHL265H1, PHL271H1, ETH200-level, and others)";
  var ALT_CALC = "MAT157Y1, or MAT148H1 + MAT149H1, also satisfy the calculus requirement";

  // Verified against each calendar entry. Open means 4.0 credits and you are in;
  // limited means you compete on grades. Every Mathematics-department program
  // here is open; the Statistical Sciences ones are not.
  var LIMITED = ["ASSPE2290", "ASSPE2270", "ASMAJ2289"];

  function track(name, who, picks) {
    return Object.freeze({ name: name, who: who, picks: Object.freeze(picks) });
  }

  // A requirement from a department this catalog does not cover. Give it a year
  // and it lands in that year's Required column instead of being dropped to the
  // footnotes, which is what made Year 1 look empty for the statistics programs.
  // Leave the year off for anything that floats, like the ethics credit.
  function need(year, text, credits) {
    return Object.freeze({ year: year, text: text, credits: credits });
  }

  function program(id, code, name, kind, credits, summary, required, options, tracks, outside) {
    return Object.freeze({
      id: id,
      code: code,
      name: name,
      kind: kind,
      credits: credits,
      summary: summary,
      url: "https://artsci.calendar.utoronto.ca/program/" + code,
      entry: LIMITED.indexOf(code) === -1 ? "Open" : "Limited",
      required: Object.freeze(required),
      options: Object.freeze(options),
      tracks: Object.freeze(tracks),
      outside: Object.freeze(outside)
    });
  }

  window.UOFT_PROGRAMS = Object.freeze([
    program(
      "stats-theory-methods", "ASSPE2290", "Statistical Science: Theory and Methods", "Specialist", "11.0-12.0",
      "The theory-forward statistics specialist, and the strongest single path into a statistics or biostatistics PhD.",
      ["STA257H1", "STA261H1", "STA302H1"],
      ["MAT137", "MAT158H1", "MAT159H1", "MAT223H1", "MAT224H1", "MAT240H1",
       "MAT247H1", "MAT237Y1", "MAT257Y1", "STA303H1", "STA304H1", "STA305H1",
       "STA313H1", "STA314H1", "STA365H1", "STA357H1", "STA355H1", "STA410H1",
       "STA414H1", "STA437H1", "STA442H1", "STA457H1", "STA465H1", "STA475H1",
       "STA480H1", "STA447H1", "STA452H1", "STA453H1", "STA492H1", "STA496H1",
       "STA497H1", "STA498Y1", "STA499Y1"],
      [track("Graduate school", "Maximum theory. Proof-based analysis and algebra feeding mathematical statistics and stochastic processes.",
         ["MAT158H1", "MAT159H1", "MAT240H1", "MAT247H1", "MAT257Y1", "STA357H1",
          "STA355H1", "STA452H1", "STA453H1", "STA447H1", "STA414H1", "STA497H1"]),
       track("Balanced", "Strong but not punishing. Keeps the theory credit that graduate programs look for.",
         ["MAT137", "MAT223H1", "MAT224H1", "MAT237Y1", "STA303H1", "STA304H1",
          "STA314H1", "STA355H1", "STA452H1", "STA437H1", "STA496H1"]),
       track("Industry", "Computation, modelling and communication over proof. Aimed at work straight after the degree.",
         ["MAT137", "MAT223H1", "MAT224H1", "MAT237Y1", "STA303H1", "STA313H1",
          "STA314H1", "STA365H1", "STA457H1", "STA410H1", "STA447H1", "STA492H1"])],
      [need("Year 1", "STA130H1 An Introduction to Statistical Reasoning and Data Science", 0.5),
       need("Year 1", "One of CSC108H1, CSC110Y1, CSC111H1 or CSC148H1", 0.5),
       ALT_CALC,
       "1.0 credit from listed Mathematics, Actuarial Science, Computer Science or Statistics courses",
       "0.5-1.0 credit of research or seminar, or completion of the ASIP internship stream"]
    ),
    program(
      "stats-methods-practice", "ASSPE2270", "Statistical Science: Methods and Practice", "Specialist", "10.5-11.0",
      "The applied statistics specialist. Lighter mathematics, a capstone consulting year, and a disciplinary focus on top.",
      ["STA302H1", "STA490Y1"],
      ["MAT137", "MAT158H1", "MAT159H1", "MAT223H1", "MAT224H1", "MAT240H1",
       "MAT247H1", "MAT235H1", "MAT236H1", "MAT237Y1", "MAT257Y1", "STA237H1",
       "STA238H1", "STA247H1", "STA248H1", "STA257H1", "STA261H1", "STA303H1",
       "STA304H1", "STA305H1", "STA313H1", "STA314H1", "STA365H1", "STA355H1",
       "STA414H1", "STA437H1", "STA442H1", "STA457H1", "STA465H1", "STA475H1",
       "STA480H1", "STA410H1", "MAT337H1", "MAT357H1"],
      [track("Balanced", "The default route: the theory probability pair, regression, and a broad methods spread.",
         ["MAT137", "MAT223H1", "MAT237Y1", "STA257H1", "STA261H1", "STA303H1",
          "STA304H1", "STA314H1", "STA442H1", "STA457H1"]),
       track("Industry", "Lightest mathematics the program allows, weighted toward modelling and data work.",
         ["MAT137", "MAT223H1", "MAT235H1", "MAT236H1", "STA237H1", "STA238H1",
          "STA303H1", "STA313H1", "STA365H1", "STA410H1", "STA480H1"]),
       track("Graduate school", "Keeps the door to a research degree open by adding real analysis and theory credits.",
         ["MAT158H1", "MAT159H1", "MAT240H1", "MAT257Y1", "STA257H1", "STA261H1",
          "STA355H1", "STA314H1", "MAT357H1", "STA437H1"])],
      [need("Year 1", "STA130H1 An Introduction to Statistical Reasoning and Data Science", 0.5),
       need("Year 1", "Two of CSC108H1 + CSC148H1, CSC110Y1 + CSC111H1, or CSC110Y1 + CSC148H1", 1),
       need("Year 4", "A disciplinary focus, 2.0-3.5 credits depending which of the 21 you pick", 2),
       ALT_CALC, "CSC207H1 counts toward the upper-year elective credit"]
    ),
    program(
      "stats-major", "ASMAJ2289", "Statistics Major", "Major", "7.0-7.5",
      "Half the load of the specialist, so it pairs with a second subject. One 400-level statistics course is mandatory.",
      ["STA302H1"],
      ["MAT137", "MAT158H1", "MAT159H1", "MAT223H1", "MAT224H1", "MAT240H1",
       "MAT235H1", "MAT236H1", "MAT237Y1", "MAT257Y1", "STA237H1", "STA238H1",
       "STA247H1", "STA248H1", "STA257H1", "STA261H1", "STA303H1", "STA304H1",
       "STA305H1", "STA313H1", "STA314H1", "STA365H1", "STA347H1", "STA357H1",
       "STA355H1", "STA414H1", "STA437H1", "STA442H1", "STA457H1", "STA465H1",
       "STA475H1", "STA480H1"],
      [track("Balanced", "The common route, paired with a computer science or economics second program.",
         ["MAT137", "MAT223H1", "MAT237Y1", "STA237H1", "STA238H1", "STA314H1",
          "STA437H1", "STA303H1"]),
       track("Industry", "Applied probability and the modelling courses employers ask about.",
         ["MAT137", "MAT223H1", "MAT235H1", "MAT236H1", "STA247H1", "STA248H1",
          "STA365H1", "STA457H1", "STA313H1"]),
       track("Graduate school", "The theory probability pair and proof-based linear algebra, for applying out of a major.",
         ["MAT158H1", "MAT159H1", "MAT240H1", "MAT257Y1", "STA257H1", "STA261H1",
          "STA357H1", "STA414H1", "STA355H1"])],
      [need("Year 1", "STA130H1 An Introduction to Statistical Reasoning and Data Science", 0.5),
       need("Year 1", "One of CSC108H1, CSC110Y1, CSC111H1 or CSC148H1", 0.5),
       ALT_CALC, "ECO227Y1 also satisfies the second-year probability requirement"]
    ),

    program(
      "math-specialist", "ASSPE1165", "Mathematics Specialist", "Specialist", "12.5",
      "The research track. Every core analysis, algebra, topology and geometry course, capped by a research seminar.",
      ["MAT158H1", "MAT159H1", "MAT257Y1", "MAT240H1", "MAT247H1", "MAT267H1",
       "MAT327H1", "MAT347Y1", "MAT351Y1", "MAT354H1", "MAT357H1", "MAT477H1"],
      ["MAT363H1", "MAT367H1"].concat(ADVANCED_400),
      [track("Graduate school", "Analysis and geometry stacked at the 400 level, the standard profile for a mathematics PhD application.",
         ["MAT367H1", "MAT457H1", "MAT458H1", "MAT464H1", "MAT454H1", "MAT425H1"]),
       track("Balanced", "A spread across algebra, number theory and analysis rather than depth in one.",
         ["MAT363H1", "MAT445H1", "MAT415H1", "MAT454H1", "MAT401H1"]),
       track("Lighter load", "The least demanding way to finish the 400-level requirement.",
         ["MAT363H1", "MAT402H1", "MAT475H1", "MAT409H1", "MAT401H1"])],
      ["MAT157Y1 may replace the MAT158H1 + MAT159H1 pair", ETHICS,
       "4.0 credits of 300+ level APM/MAT, at least 2.5 of them at the 400 level"]
    ),
    program(
      "applied-math-specialist", "ASSPE2053", "Applied Mathematics Specialist", "Specialist", "13.0-13.5",
      "The Mathematics Specialist core plus programming, probability and a full credit of applied APM.",
      ["MAT158H1", "MAT159H1", "MAT257Y1", "MAT240H1", "MAT247H1", "MAT267H1",
       "MAT327H1", "MAT347Y1", "MAT351Y1", "MAT354H1", "MAT357H1", "MAT477H1"],
      ["MAT363H1", "MAT367H1", "STA237H1", "STA257H1", "STA238H1", "STA261H1",
       "STA347H1", "MAT370H1", "APM421H1", "APM426H1", "APM441H1", "APM446H1",
       "APM461H1", "APM462H1", "APM466H1", "MAT332H1", "MAT344H1", "MAT454H1",
       "MAT457H1", "MAT458H1", "MAT464H1", "STA302H1", "STA457H1"],
      [track("Graduate school", "Theory probability and mathematical physics, pointed at applied analysis research.",
         ["STA257H1", "STA261H1", "STA347H1", "MAT367H1", "APM421H1", "APM426H1", "MAT457H1"]),
       track("Balanced", "Keeps the theory probability pair while taking the more tractable APM courses.",
         ["STA257H1", "STA261H1", "STA347H1", "MAT363H1", "APM441H1", "APM462H1", "STA302H1"]),
       track("Industry", "Optimization and finance, with the lighter statistics sequence.",
         ["STA237H1", "STA238H1", "MAT370H1", "MAT363H1", "APM462H1", "APM466H1", "STA302H1"])],
      ["MAT157Y1 may replace the MAT158H1 + MAT159H1 pair",
       need("Year 1", "CSC108H1 + CSC148H1, or CSC110Y1", 1), ETHICS,
       "CSC336H1, CSC436H1, CSC446H1 or CSC456H1 also count toward Related Topics"]
    ),
    program(
      "math-physics-specialist", "ASSPE0397", "Mathematics and Physics Specialist", "Specialist", "14.5",
      "Joint with Physics. Full proof-based math core alongside the physics sequence, so the heaviest load here.",
      ["MAT158H1", "MAT159H1", "MAT257Y1", "MAT240H1", "MAT247H1", "MAT267H1", "MAT351Y1"],
      ["MAT334H1", "MAT354H1", "MAT357H1", "MAT327H1", "MAT347Y1", "MAT363H1",
       "MAT367H1", "APM421H1", "APM426H1", "APM446H1", "APM441H1", "MAT477H1"],
      [track("Graduate school", "Topology, differential geometry and the quantum/relativity pair, for theoretical physics or geometry research.",
         ["MAT354H1", "MAT357H1", "MAT327H1", "MAT367H1", "APM421H1", "APM426H1", "MAT477H1"]),
       track("Balanced", "Computational complex variables instead of the proof-based course, and lighter APM.",
         ["MAT334H1", "MAT354H1", "MAT363H1", "APM421H1", "APM441H1", "MAT477H1"])],
      ["MAT157Y1 may replace the MAT158H1 + MAT159H1 pair",
       need("Year 1", "PHY151H1 + PHY152H1 Foundations of Physics", 1),
       need("Year 2", "PHY224H1, PHY250H1, PHY252H1, PHY254H1, PHY256H1", 2.5),
       need("Year 3", "PHY324H1, PHY350H1, PHY354H1, PHY356H1", 2),
       need("Year 4", "1.0 credit from PHY450H1, PHY452H1, PHY454H1, PHY456H1, PHY460H1", 1),
       "Research: MAT477H1, PHY424H1, PHY478H1 or PHY479Y1", ETHICS]
    ),
    program(
      "math-philosophy-specialist", "ASSPE1361", "Mathematics and Philosophy Specialist", "Specialist", "12.0",
      "Analysis, algebra and topology paired with logic, history of philosophy and philosophy of science.",
      ["MAT158H1", "MAT159H1", "MAT257Y1", "MAT240H1", "MAT247H1", "MAT327H1", "MAT347Y1"],
      ["MAT354H1", "MAT357H1", "MAT309H1"].concat(ADVANCED_400),
      [track("Graduate school", "Set theory and measure-theoretic analysis, the route into logic or foundations research.",
         ["MAT357H1", "MAT354H1", "MAT409H1", "MAT457H1", "MAT445H1"]),
       track("Balanced", "Mathematical logic alongside complex analysis, the natural fit for this program.",
         ["MAT354H1", "MAT309H1", "MAT409H1", "MAT401H1"]),
       track("Lighter load", "Logic plus the more approachable 400-level courses.",
         ["MAT309H1", "MAT354H1", "MAT402H1", "MAT475H1"])],
      ["MAT157Y1 may replace the MAT158H1 + MAT159H1 pair",
       need("Year 2", "Philosophy of science: PHL232H1, PHL233H1 or PHL255H1", 0.5),
       need("Year 2", "Politics and ethics: PHL265H1 or PHL275H1", 0.5),
       need("Year 3", "Logic: MAT309H1, PHL348H1 or PHL345H1", 1),
       need("Year 3", "History of philosophy", 1),
       need("Year 4", "Philosophy topics", 2),
       "2.0 credits of 300+ level PHL/APM/MAT topics"]
    ),
    program(
      "maef-specialist", "ASSPE1700", "Mathematical Applications in Economics and Finance", "Specialist", "12.0-12.5",
      "Computational linear algebra rather than proof-based, then the finance sequence: PDEs, time series, optimization.",
      ["MAT223H1", "MAT224H1", "APM466H1", "APM346H1", "MAT337H1", "STA457H1", "APM462H1"],
      ENTRY_CALCULUS.concat([
        "MAT244H1", "MAT267H1", "STA237H1", "STA257H1", "STA238H1", "STA261H1",
        "STA347H1", "MAT370H1", "STA302H1", "MAT332H1", "MAT344H1", "MAT475H1"]),
      [track("Graduate school", "Proof-based analysis and theory probability, for a financial mathematics or economics PhD.",
         ["MAT158H1", "MAT159H1", "MAT257Y1", "MAT267H1", "STA257H1", "STA261H1",
          "STA347H1", "STA302H1", "MAT332H1"]),
       track("Balanced", "Standard calculus stream with the theory probability pair kept.",
         ["MAT137", "MAT246H1", "MAT237Y1", "MAT244H1", "STA257H1", "STA261H1",
          "STA347H1", "STA302H1", "MAT344H1"]),
       track("Industry", "Lightest route through the mathematics, aimed straight at quantitative finance work.",
         ["MAT137", "MAT246H1", "MAT237Y1", "MAT244H1", "STA237H1", "STA238H1",
          "MAT370H1", "STA302H1", "MAT475H1"])],
      [need("Year 1", "ECO101H1 + ECO102H1 Principles of Economics", 1),
       need("Year 2", "ECO206Y1 Microeconomic Theory", 1),
       need("Year 3", "ECO358H1 + ECO359H1 Financial Economics", 1),
       ALT_CALC, "Analyzing data for finance: STA302H1 or ECO375H1", ETHICS]
    ),
    program(
      "mia-probstat", "ASSPE1890", "Math & Its Applications: Probability/Statistics", "Specialist", "11.5-12.5",
      "A mathematics specialist with a statistics spine. Lighter core than the Mathematics Specialist, heavier statistics.",
      ["STA302H1", "MAT301H1", "MAT334H1", "MAT337H1"],
      ENTRY_CALCULUS.concat([
        "MAT223H1", "MAT240H1", "MAT224H1", "MAT247H1", "MAT244H1", "MAT267H1",
        "STA237H1", "STA257H1", "STA238H1", "STA261H1", "STA347H1", "MAT377H1",
        "MAT370H1", "STA355H1", "MAT332H1", "MAT344H1", "APM348H1", "APM461H1",
        "STA452H1", "STA453H1", "STA437H1", "STA442H1", "STA447H1", "STA465H1",
        "STA410H1", "APM346H1", "MAT351Y1", "APM462H1"]),
      [track("Graduate school", "Proof-based analysis, measure-theoretic probability and mathematical statistics.",
         ["MAT158H1", "MAT159H1", "MAT257Y1", "MAT240H1", "MAT247H1", "MAT267H1",
          "STA257H1", "STA261H1", "MAT377H1", "STA452H1", "STA453H1", "STA447H1"]),
       track("Balanced", "Theory probability with applied multivariate methods on top.",
         ["MAT158H1", "MAT159H1", "MAT237Y1", "MAT240H1", "MAT244H1", "STA257H1",
          "STA261H1", "STA347H1", "STA437H1", "STA442H1", "APM346H1", "STA355H1"]),
       track("Industry", "Lightest mathematics the program allows, with computation and modelling.",
         ["MAT137", "MAT246H1", "MAT237Y1", "MAT223H1", "MAT224H1", "MAT244H1",
          "STA237H1", "STA238H1", "MAT370H1", "STA410H1", "STA442H1", "MAT344H1"])],
      [need("Year 1", "CSC108H1 + CSC148H1, or CSC110Y1", 1), ALT_CALC, ETHICS,
       "1.0 credit of 300+ level APM/MAT advanced topics"]
    ),
    program(
      "mia-physical", "ASSPE1758", "Math & Its Applications: Physical Science", "Specialist", "12.5-13.0",
      "Applied math aimed at the physical sciences: PDEs and mathematical physics with a physics and astronomy base.",
      ["MAT301H1", "MAT334H1"],
      ENTRY_CALCULUS.concat([
        "MAT223H1", "MAT240H1", "MAT224H1", "MAT247H1", "MAT244H1", "MAT267H1",
        "STA237H1", "STA257H1", "APM346H1", "MAT351Y1", "APM421H1", "APM426H1",
        "APM441H1", "APM446H1"]),
      [track("Graduate school", "Proof-based core with the theoretical PDE course and mathematical physics.",
         ["MAT158H1", "MAT159H1", "MAT257Y1", "MAT247H1", "MAT267H1", "STA257H1",
          "MAT351Y1", "APM421H1", "APM426H1"]),
       track("Balanced", "Standard calculus stream, applied PDEs, asymptotic methods.",
         ["MAT137", "MAT246H1", "MAT237Y1", "MAT240H1", "MAT244H1", "STA257H1",
          "APM346H1", "APM441H1"]),
       track("Lighter load", "Vector calculus instead of the proof-based analysis sequence.",
         ["MAT137", "MAT235H1", "MAT236H1", "MAT223H1", "MAT244H1", "STA237H1",
          "APM346H1", "APM446H1"])],
      [need("Year 1", "CSC108H1, CSC148H1 or CSC110Y1", 0.5),
       need("Year 1", "PHY151H1 + PHY152H1 Foundations of Physics", 1),
       need("Year 2", "AST221H1 Stars and Planets", 0.5),
       need("Year 4", "1.5 credits physics topics, 1.5 credits additional topics", 3),
       ALT_CALC, ETHICS]
    ),
    program(
      "mia-teaching", "ASSPE1580", "Math & Its Applications: Teaching", "Specialist", "10.5-11.0",
      "Built for future teachers: elementary math concepts, history of mathematics, and breadth over depth.",
      ["MAT301H1", "MAT334H1"],
      ENTRY_CALCULUS.concat([
        "MAT223H1", "MAT240H1", "MAT224H1", "MAT247H1", "MAT244H1", "MAT267H1",
        "STA237H1", "STA257H1", "MAT309H1", "MAT315H1", "STA302H1", "STA347H1",
        "MAT370H1", "MAT332H1", "MAT335H1", "MAT337H1", "MAT344H1", "MAT363H1",
        "MAT367H1"]).concat(ADVANCED_400),
      [track("Graduate school", "Keeps the proof-based core, so a mathematics master's stays reachable after teacher's college.",
         ["MAT158H1", "MAT159H1", "MAT257Y1", "MAT247H1", "MAT267H1", "STA257H1",
          "MAT309H1", "MAT315H1", "MAT337H1", "MAT363H1", "MAT401H1"]),
       track("Balanced", "Number theory and chaos, the topics that carry into a secondary classroom.",
         ["MAT137", "MAT246H1", "MAT237Y1", "MAT240H1", "MAT244H1", "STA257H1",
          "MAT315H1", "MAT335H1", "MAT344H1", "MAT402H1"]),
       track("Lighter load", "Vector calculus route, weighted toward the courses that teach well.",
         ["MAT137", "MAT235H1", "MAT236H1", "MAT223H1", "MAT244H1", "STA237H1",
          "STA302H1", "MAT332H1", "MAT335H1", "MAT403H1"])],
      [need("Year 1", "CSC108H1 or CSC110Y1", 0.5),
       need("Year 3", "MAT329Y1 Concepts in Elementary Mathematics", 1),
       need("Year 3", "History of mathematics: HPS390H1/MAT390H1 or HPS391H1/MAT391H1", 1),
       ALT_CALC,
       "1.0 credit at the 400 level, MAT401H1 or MAT402H1 recommended", ETHICS]
    ),
    program(
      "math-major", "ASMAJ1165", "Mathematics Major", "Major", "7.5",
      "Every requirement is a choice, so the shape is yours. Pairs with a second subject.",
      [],
      ENTRY_CALCULUS.concat([
        "MAT223H1", "MAT240H1", "MAT224H1", "MAT247H1", "MAT244H1", "MAT267H1",
        "MAT301H1", "MAT315H1", "MAT332H1", "MAT344H1", "MAT334H1", "MAT337H1",
        "MAT336H1"]).concat(ADVANCED_400),
      [track("Graduate school", "Take the specialist courses inside the major, then apply out on the strength of them.",
         ["MAT158H1", "MAT159H1", "MAT257Y1", "MAT240H1", "MAT247H1", "MAT267H1",
          "MAT301H1", "MAT337H1", "MAT457H1"]),
       track("Balanced", "Standard calculus stream with group theory and complex variables.",
         ["MAT137", "MAT246H1", "MAT237Y1", "MAT240H1", "MAT224H1", "MAT244H1",
          "MAT315H1", "MAT334H1", "MAT401H1"]),
       track("Lighter load", "Vector calculus and the discrete courses, the gentlest way through.",
         ["MAT137", "MAT246H1", "MAT235H1", "MAT236H1", "MAT223H1", "MAT244H1",
          "MAT332H1", "MAT336H1", "MAT402H1"])],
      [ETHICS, "2.0 credits of 300+ level APM/MAT, at least 0.5 at the 400 level",
       "Minimum 2.5 credits at the 300+ level overall"]
    ),
    program(
      "math-minor", "ASMIN1165", "Mathematics Minor", "Minor", "4.0",
      "Two credits of calculus, one algebra course, one further fundamental, one credit at 300+.",
      [],
      ENTRY_CALCULUS.concat([
        "MAT223H1", "MAT240H1", "MAT224H1", "MAT244H1", "MAT247H1", "APM236H1",
        "MAT301H1", "MAT315H1", "MAT332H1", "MAT334H1", "MAT335H1", "MAT336H1",
        "MAT337H1", "MAT344H1"]),
      [track("Balanced", "The usual minor: standard calculus, one linear algebra course, group theory on top.",
         ["MAT137", "MAT237Y1", "MAT223H1", "MAT246H1", "MAT301H1", "MAT334H1"]),
       track("Lighter load", "Vector calculus and linear programming, the least demanding valid route.",
         ["MAT137", "MAT235H1", "MAT236H1", "MAT223H1", "APM236H1", "MAT332H1"]),
       track("Proof-based", "The specialist courses, for a minor that signals real mathematical maturity.",
         ["MAT158H1", "MAT159H1", "MAT257Y1", "MAT240H1", "MAT247H1", "MAT337H1"])],
      ["MAT157Y1, MAT148H1 + MAT149H1, MAT130H1/MAT135H1 + MAT136H1 also satisfy calculus",
       "MAT221H1 with at least 80% also satisfies the algebra requirement",
       "1.0 credit at the 300+ level, PSL432H1, HPS390H1 and HPS391H1 also count"]
    ),
    program(
      "stats-minor", "ASMIN2289", "Statistics Minor", "Minor", "4.0",
      "Calculus, programming and linear algebra feeding a probability pair, then regression and one applied elective.",
      ["STA302H1"],
      ["MAT137", "MAT158H1", "MAT159H1", "MAT223H1", "MAT224H1", "MAT240H1",
       "STA237H1", "STA238H1", "STA247H1", "STA248H1", "STA255H1", "STA257H1",
       "STA261H1", "STA303H1", "STA304H1", "STA305H1", "STA313H1", "STA314H1",
       "STA347H1", "STA357H1", "STA355H1", "STA365H1", "STA410H1", "STA437H1",
       "STA450H1", "STA457H1"],
      [track("Balanced", "The common minor, taken beside a computer science or economics program.",
         ["MAT137", "MAT223H1", "STA257H1", "STA261H1", "STA303H1"]),
       track("Industry", "The applied probability pair and a visualization or modelling elective.",
         ["MAT137", "MAT223H1", "STA237H1", "STA238H1", "STA313H1"]),
       track("Proof-based", "Theory probability on a proof-based analysis base.",
         ["MAT158H1", "MAT159H1", "MAT240H1", "STA257H1", "STA261H1", "STA357H1"])],
      ["MAT157Y1, MAT148H1 + MAT149H1, MAT133Y1 at 70% also satisfy calculus",
       need("Year 1", "One of CSC108H1, CSC110Y1, CSC111H1 or CSC148H1", 0.5),
       "STA220H1/STA221H1, ECO220Y1 or ECO227Y1 routes also satisfy second year",
       "STA130H1 strongly recommended in first year"]
    )
  ]);

  window.UOFT_DEFAULT_PROGRAM = "mia-probstat";
}());
