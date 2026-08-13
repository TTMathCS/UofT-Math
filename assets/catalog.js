(function () {
  "use strict";

  var guides = Array.isArray(window.UOFT_COURSES) ? window.UOFT_COURSES : [];
  var others = Array.isArray(window.UOFT_OTHER_COURSES) ? window.UOFT_OTHER_COURSES : [];
  var programs = Array.isArray(window.UOFT_PROGRAMS) ? window.UOFT_PROGRAMS : [];
  var enrolled = window.UOFT_ENROLLED || null;
  var terms = window.UOFT_TERMS || {};
  var termSource = window.UOFT_TERM_SOURCE || "the timetable";
  var structure = window.UOFT_STRUCTURE || null;
  var structurePath = window.UOFT_STRUCTURE_PATH || [];
  var search = document.getElementById("course-search");
  var filters = document.getElementById("course-filters");
  var grid = document.getElementById("course-grid");
  var resultCount = document.getElementById("result-count");
  var localCoursePath = /^[A-Za-z0-9_-]+\/index\.html$/;
  var FOCUS = "mia-probstat";
  var FOCUS_ROUTE = "Graduate school";
  var activeSubject = "All";

  // MAT137 is the catalog's short name; the calendar knows it as MAT137Y1
  var CALENDAR_CODE = { MAT137: "MAT137Y1" };

  // The guide entries carry a topic ("Analysis", "Topology") and the rest carry
  // a department, so filtering on either mixes two taxonomies. Filter on the
  // code prefix instead and keep the topic as the row's tag.
  var DEPARTMENTS = {
    APM: "Applied Mathematics",
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
  };

  function departmentOf(code) {
    return DEPARTMENTS[code.slice(0, 3)] || "Other";
  }

  function element(tag, className, text) {
    var node = document.createElement(tag);
    if (className) {
      node.className = className;
    }
    if (text !== undefined) {
      node.textContent = text;
    }
    return node;
  }

  function link(href, className, text) {
    var node = element("a", className, text);
    node.href = href;
    node.rel = "noreferrer";
    node.target = "_blank";
    return node;
  }

  function calendarUrl(code) {
    return "https://artsci.calendar.utoronto.ca/course/" +
      (CALENDAR_CODE[code] || code).toLowerCase();
  }

  function creditsOf(code) {
    return code === "MAT137" || /Y1$/.test(code) ? 1 : 0.5;
  }

  function hasGuide(course) {
    return Boolean(course.path && localCoursePath.test(course.path));
  }

  // one list, guides and everything else together, sorted by code
  var courses = guides.map(function (course) {
    return {
      code: course.code,
      title: course.title,
      subject: course.subject,
      dept: departmentOf(course.code),
      description: course.description,
      topics: course.topics || [],
      path: hasGuide(course) ? course.path : "",
      chapters: course.chapters,
      credits: creditsOf(course.code)
    };
  }).concat(others.map(function (course) {
    return {
      code: course.code,
      title: course.title,
      subject: course.subject,
      dept: departmentOf(course.code),
      description: "",
      topics: [],
      path: course.path || "",
      chapters: course.chapters || 0,
      credits: course.credits
    };
  })).sort(function (first, second) {
    return first.code.localeCompare(second.code);
  });

  var byCode = {};
  courses.forEach(function (course) {
    byCode[course.code] = course;
  });

  var taken = {};
  if (enrolled) {
    enrolled.terms.forEach(function (term) {
      term.courses.forEach(function (course) {
        taken[course.code] = course;
      });
    });
  }

  function findProgram(id) {
    var found = null;
    programs.forEach(function (item) {
      if (item.id === id) {
        found = item;
      }
    });
    return found;
  }

  // ---------- 00 · where these programs sit ----------

  function treeNode(item, depth) {
    var li = element("li", "tree-node");
    var head = element("div", "tree-row");
    var label = element("span", "tree-name", item.name);

    if (structurePath.indexOf(item.name) !== -1) {
      li.classList.add("on-path");
    }
    head.append(label);
    if (item.tag) {
      head.append(element("span", "tree-tag", item.tag));
    }
    if (item.note) {
      head.append(element("span", "tree-note", item.note));
    }
    li.append(head);

    if (item.children.length) {
      var list = element("ul", "tree-list");
      item.children.forEach(function (child) {
        list.append(treeNode(child, depth + 1));
      });
      li.append(list);
    }
    return li;
  }

  function renderStructure() {
    var host = document.getElementById("structure-tree");
    if (!host || !structure) {
      return;
    }
    var root = element("ul", "tree-list is-root");
    root.append(treeNode(structure, 0));
    host.replaceChildren(root);
  }

  // ---------- 01 · every program, one row each ----------

  function renderPrograms() {
    var host = document.getElementById("program-table");
    var table = element("table", "program-table");
    var head = element("thead");
    var body = element("tbody");
    var headRow = element("tr");

    ["Code", "Program", "Type", "Entry", "Credits"].forEach(function (label) {
      headRow.append(element("th", "", label));
    });
    head.append(headRow);

    programs.forEach(function (item) {
      var row = element("tr");
      var codeCell = element("td", "program-code-cell");
      var nameCell = element("td");

      if (item.id === FOCUS) {
        row.className = "is-focus";
      }
      codeCell.append(link(item.url, "program-code", item.code));
      nameCell.append(
        element("b", "", item.name),
        element("span", "program-summary", item.summary)
      );
      var entryCell = element("td", "program-entry");
      entryCell.append(element("span",
        item.entry === "Open" ? "entry-open" : "entry-limited", item.entry));
      row.append(
        codeCell,
        nameCell,
        element("td", "program-kind", item.kind),
        entryCell,
        element("td", "program-credits", item.credits)
      );
      body.append(row);
    });

    table.append(head, body);
    host.replaceChildren(table);
  }

  // ---------- 02 · ASSPE1890, expanded ----------

  function yearOf(code) {
    var found = null;
    guides.forEach(function (course) {
      if (course.code === code) {
        found = course.term;
      }
    });
    return found;
  }

  function planCourse(code, kind, done) {
    var course = byCode[code];
    var row = element("div", "plan-course " + kind);
    var title = element("span", "plan-title", course ? course.title : "");

    if (done) {
      row.classList.add("is-taken");
    }
    row.append(link(calendarUrl(code), "plan-code", code), title);
    if (course && course.path) {
      var guide = element("a", "plan-guide", "guide →");
      guide.href = course.path;
      row.append(guide);
    }
    row.append(element("i", "", creditsOf(code).toFixed(1)));
    return row;
  }

  function enrolledYearOne() {
    var block = element("div", "focus-year is-done");
    var head = element("div", "focus-year-head");
    var body = element("div", "focus-year-body");
    var total = 0;

    enrolled.terms.forEach(function (term) {
      var column = element("div", "focus-term");
      var label = element("div", "focus-term-head");

      label.append(element("b", "", term.name));
      if (term.span) {
        label.append(element("span", "focus-term-span", term.span));
      }
      column.append(label);

      term.courses.forEach(function (course) {
        var row = element("div", "plan-course is-taken");
        var entry = byCode[course.code];
        var title = element("span", "plan-title", course.title);
        // a full-year course appears in both terms; count its credit once
        if (!course.continued) {
          total += course.credits;
        } else {
          row.classList.add("is-continued");
          title.append(element("em", "", "continues"));
        }
        row.append(link(calendarUrl(course.code), "plan-code", course.code), title);
        if (entry && entry.path) {
          var guide = element("a", "plan-guide", "guide →");
          guide.href = entry.path;
          row.append(guide);
        }
        row.append(element("i", "", course.credits.toFixed(1)));
        column.append(row);
      });
      body.append(column);
    });

    head.append(
      element("h4", "", "Year 1 · " + enrolled.label),
      element("span", "focus-year-tag", "registered"),
      element("span", "focus-credits", total.toFixed(1) + " credits")
    );
    block.append(head, body);
    return block;
  }

  // Anything already registered for is done, wherever the calendar files it.
  // MAT247H1 is a second-year course taken in first-year winter here, so it
  // must not come back as a Year 2 suggestion.
  function stillToTake(code) {
    return !taken[code];
  }

  // Year 1 runs 2026-27, so Year N starts in 2025 + N.
  function academicYear(year) {
    var n = parseInt(year.replace(/\D/g, ""), 10);
    var start = 2025 + n;
    return start + "-" + String(start + 1).slice(2);
  }

  // "F" fall, "S" winter, "FS" either, "Y" both, "-" not offered this year.
  // Anything we have no timetable entry for is treated as either.
  function termOf(code) {
    return terms[code] || "FS";
  }

  // A course is pinned to a term only when the timetable pins it. "FS" means
  // you choose, so it belongs in the flexible band rather than in both columns
  // where it would read as being taken twice.
  function runsIn(code, half) {
    var t = termOf(code);
    return t === "Y" || t === half;
  }

  function isFlexible(code) {
    var t = termOf(code);
    return t === "FS" || t === "-";
  }

  function suggestedYear(program, picks, year) {
    var required = program.required.filter(function (code) {
      return yearOf(code) === year && stillToTake(code);
    });
    var suggested = picks.filter(function (code) {
      return yearOf(code) === year && stillToTake(code);
    });
    var outside = program.outside.filter(function (item) {
      return item && item.year === year;
    });
    if (!required.length && !suggested.length && !outside.length) {
      return null;
    }

    var codes = required.concat(suggested);
    var span = academicYear(year);
    var starts = [Number(span.slice(0, 4)), Number(span.slice(0, 4)) + 1];
    var block = element("div", "focus-year");
    var head = element("div", "focus-year-head");
    var body = element("div", "focus-year-body");
    var total = 0;

    // credit counts once per course even when it spans both terms
    codes.forEach(function (code) {
      total += creditsOf(code);
    });

    [["F", "Fall " + starts[0]], ["S", "Winter " + starts[1]]].forEach(function (pair) {
      var half = pair[0];
      var column = element("div", "focus-term");
      var label = element("div", "focus-term-head");
      var listed = codes.filter(function (code) {
        return runsIn(code, half);
      });

      label.append(element("b", "", pair[1]));
      column.append(label);

      listed.forEach(function (code) {
        var kind = program.required.indexOf(code) !== -1 ? "req" : "pick";
        var row = planCourse(code, kind, false);
        if (termOf(code) === "Y") {
          row.classList.add("is-continued");
          row.querySelector(".plan-title").append(element("em", "", "full year"));
        }
        column.append(row);
      });

      if (!listed.length) {
        column.append(element("div", "focus-term-empty", "nothing pinned to this term"));
      }
      body.append(column);
    });
    block.append(head, body);

    // courses the timetable does not pin to a term, plus the requirements from
    // other departments; both are placed wherever the load allows
    var flexible = codes.filter(isFlexible);
    if (flexible.length || outside.length) {
      var extra = element("div", "focus-flex");
      extra.append(element("div", "focus-flex-head", "Either term — place where the load allows"));
      flexible.forEach(function (code) {
        var kind = program.required.indexOf(code) !== -1 ? "req" : "pick";
        var row = planCourse(code, kind, false);
        if (termOf(code) === "-") {
          row.classList.add("is-unoffered");
          row.querySelector(".plan-title").append(
            element("em", "", "not offered in " + termSource));
        }
        extra.append(row);
      });
      outside.forEach(function (item) {
        total += item.credits;
        var row = element("div", "plan-course req is-outside");
        row.append(
          element("span", "", item.text),
          element("i", "", item.credits.toFixed(1))
        );
        extra.append(row);
      });
      block.append(extra);
    }

    head.append(
      element("h4", "", year + " · " + span),
      element("span", "focus-year-tag is-plan", "suggested"),
      element("span", "focus-credits", total.toFixed(1) + " credits")
    );
    return block;
  }

  function renderFocus() {
    var host = document.getElementById("focus-panel");
    var program = findProgram(FOCUS);
    if (!program) {
      return;
    }
    var route = null;
    program.tracks.forEach(function (item) {
      if (item.name === FOCUS_ROUTE) {
        route = item;
      }
    });
    var picks = route ? route.picks : [];
    var head = element("div", "focus-head");
    var meta = element("div", "focus-meta");

    head.append(
      element("span", "focus-kind", program.kind + " · " + program.code),
      element("h3", "", program.name),
      element("p", "focus-summary", program.summary)
    );

    [[program.credits, "credits to complete"],
     ["4", "years"],
     [FOCUS_ROUTE, "route shown below"]].forEach(function (pair) {
      var cell = element("div");
      cell.append(element("strong", "", pair[0]), element("span", "", pair[1]));
      meta.append(cell);
    });

    var about = element("div", "focus-about");
    about.append(
      element("h4", "", "What it is for"),
      element("p", "", "A mathematics specialist built around statistics rather" +
        " than around pure algebra and analysis. The core is lighter than the" +
        " Mathematics Specialist — no MAT347Y1 algebra year, no MAT357H1 — and" +
        " the space that frees goes into the full probability and statistics" +
        " sequence. It is the shortest honest route to a statistics or" +
        " biostatistics PhD that still carries a real mathematics transcript," +
        " and it stays credible for quantitative research work if the doctorate" +
        " does not happen."),
      element("p", "", "The route below is the graduate-school one: proof-based" +
        " analysis and algebra in the first two years, measure-theoretic" +
        " probability in third, mathematical statistics and stochastic" +
        " processes in fourth.")
    );

    host.replaceChildren(head, meta, about);
    host.append(link(program.url, "focus-link", "Full calendar entry ↗"));

    var plan = element("div", "focus-plan");
    if (enrolled && enrolled.terms.length) {
      plan.append(enrolledYearOne());
    }
    ["Year 2", "Year 3", "Year 4"].forEach(function (year) {
      var block = suggestedYear(program, picks, year);
      if (block) {
        plan.append(block);
      }
    });
    host.append(plan);

    var note = element("p", "focus-note");
    note.append(
      element("b", "", "Year 1 is the real timetable; Years 2-4 are not. "),
      element("span", "", "First year lists every course registered for, so it" +
        " comes to a full 5.0-credit load. The later years list only what" +
        " ASSPE1890 itself asks for on this route — the rest of each 5.0 is" +
        " electives, breadth requirements and whatever second program gets" +
        " added, none of which this page tries to choose. Terms come from the " +
        termSource + " and are a snapshot: offerings rotate, so check ACORN" +
        " before building an actual schedule.")
    );
    host.append(note);

    var floating = program.outside.filter(function (item) {
      return typeof item === "string" || !item.year;
    });
    if (floating.length) {
      var rest = element("div", "focus-outside");
      var list = element("ul");
      rest.append(element("h4", "", "Also required, no fixed year"));
      floating.forEach(function (item) {
        list.append(element("li", "", typeof item === "string" ? item : item.text));
      });
      rest.append(list);
      host.append(rest);
    }
  }

  // ---------- 03 · every course, alphabetical ----------

  function searchableText(course) {
    return [course.code, course.title, course.subject, course.dept, course.description]
      .concat(course.topics).join(" ").toLowerCase();
  }

  function makeCourseRow(course) {
    var row = element("div", "course-row");
    var title = element("span", "row-title", course.title);

    if (!course.title) {
      title.classList.add("is-blank");
      title.textContent = "see calendar";
    }
    row.append(
      link(calendarUrl(course.code), "course-code", course.code),
      title,
      element("span", "subject-tag", course.subject),
      element("span", "row-credits", course.credits.toFixed(1))
    );
    if (course.path) {
      var guide = element("a", "row-guide", course.chapters + " chapters →");
      guide.href = course.path;
      row.append(guide);
    } else {
      row.append(element("span", "row-guide is-empty", ""));
    }
    if (course.description) {
      row.title = course.description;
    }
    return row;
  }

  function renderCourses() {
    var query = search.value.trim().toLowerCase();
    var visible = courses.filter(function (course) {
      var matchesSubject = activeSubject === "All" || course.dept === activeSubject;
      return matchesSubject &&
        (!query || searchableText(course).indexOf(query) !== -1);
    });

    grid.replaceChildren();
    if (!visible.length) {
      grid.append(element("p", "empty-state", "No courses match this search."));
    } else {
      var list = element("div", "course-list");
      visible.forEach(function (course) {
        list.append(makeCourseRow(course));
      });
      grid.append(list);
    }

    resultCount.textContent = visible.length === courses.length
      ? "Showing all " + courses.length + " courses."
      : "Showing " + visible.length + " of " + courses.length + " courses.";
  }

  function renderFilters() {
    var subjects = ["All"];
    courses.forEach(function (course) {
      if (subjects.indexOf(course.dept) === -1) {
        subjects.push(course.dept);
      }
    });
    subjects = [subjects[0]].concat(subjects.slice(1).sort());

    filters.replaceChildren();
    subjects.forEach(function (subject) {
      var button = element("button", "", subject);
      button.type = "button";
      button.setAttribute("aria-pressed", subject === activeSubject ? "true" : "false");
      button.addEventListener("click", function () {
        activeSubject = subject;
        renderFilters();
        renderCourses();
      });
      filters.append(button);
    });
  }

  function setCount(id, value) {
    var node = document.getElementById(id);
    if (node) {
      node.textContent = String(value);
    }
  }

  setCount("program-count", programs.length);
  setCount("course-count", courses.length);
  // count the whole merged list: the CSC, PHY and ENG guides are registered in
  // other-courses.js and belong in the totals too
  setCount("guide-count", courses.filter(hasGuide).length);
  setCount("chapter-count", courses.reduce(function (total, course) {
    return total + (hasGuide(course) ? course.chapters : 0);
  }, 0));

  search.addEventListener("input", renderCourses);
  renderStructure();
  renderPrograms();
  renderFocus();
  renderFilters();
  renderCourses();
}());
