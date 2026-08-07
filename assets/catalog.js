(function () {
  "use strict";

  var courses = Array.isArray(window.UOFT_COURSES) ? window.UOFT_COURSES : [];
  var programs = Array.isArray(window.UOFT_PROGRAMS) ? window.UOFT_PROGRAMS : [];
  var grid = document.getElementById("course-grid");
  var filters = document.getElementById("course-filters");
  var search = document.getElementById("course-search");
  var resultCount = document.getElementById("result-count");
  var courseCount = document.getElementById("course-count");
  var guideCount = document.getElementById("guide-count");
  var chapterCount = document.getElementById("chapter-count");
  var programCount = document.getElementById("program-count");
  var paths = document.getElementById("program-paths");
  var panel = document.getElementById("program-panel");
  var onlyWrap = document.getElementById("program-only-wrap");
  var onlyBox = document.getElementById("program-only");
  var activeSubject = "All";
  var activeProgram = null;
  var activeTrack = 0;
  var localCoursePath = /^[A-Za-z0-9_-]+\/index\.html$/;
  var levelOrder = ["Year 1", "Year 2", "Year 3", "Year 4"];
  var byCode = {};

  courses.forEach(function (course) {
    byCode[course.code] = course;
  });

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

  function store(key, value) {
    try {
      if (value === null) {
        window.localStorage.removeItem(key);
      } else {
        window.localStorage.setItem(key, value);
      }
    } catch (err) {
      // private browsing; the choice just will not survive a reload
    }
  }

  function read(key) {
    try {
      return window.localStorage.getItem(key);
    } catch (err) {
      return null;
    }
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

  // Y-coded courses are full year and worth 1.0; everything else is 0.5.
  // MAT137 is the catalog's short name for MAT137Y1.
  function creditsOf(code) {
    return code === "MAT137" || /Y1$/.test(code) ? 1 : 0.5;
  }

  function trackPicks() {
    if (!activeProgram || !activeProgram.tracks.length) {
      return [];
    }
    return activeProgram.tracks[activeTrack].picks;
  }

  // required  unavoidable
  // pick      an option this track takes
  // option    counts toward the program, this track skips it
  function roleOf(course) {
    if (!activeProgram) {
      return null;
    }
    if (activeProgram.required.indexOf(course.code) !== -1) {
      return "required";
    }
    if (activeProgram.options.indexOf(course.code) === -1) {
      return null;
    }
    return trackPicks().indexOf(course.code) !== -1 ? "pick" : "option";
  }

  function searchableText(course) {
    return [
      course.code,
      course.title,
      course.subject,
      course.term,
      course.description
    ].concat(course.topics || []).join(" ").toLowerCase();
  }

  function hasLocalGuide(course) {
    return course.path && localCoursePath.test(course.path);
  }

  function roleLabel(role) {
    if (role === "required") {
      return "required";
    }
    if (role === "pick") {
      return "suggested";
    }
    return role === "option" ? "eligible" : "—";
  }

  // ---------- the plan: what this program asks of you, year by year ----------

  function planCourse(code, kind) {
    var course = byCode[code];
    var line = course && hasLocalGuide(course)
      ? element("a", "plan-course " + kind)
      : element("span", "plan-course " + kind);
    if (course && hasLocalGuide(course)) {
      line.href = course.path;
      line.classList.add("has-guide");
    }
    if (course) {
      line.title = course.description;
    }
    line.append(
      element("b", "", code),
      element("span", "", course ? course.title : ""),
      element("i", "", creditsOf(code).toFixed(1))
    );
    return line;
  }

  // a requirement from another department: no catalog entry to link, so the
  // description takes the code column and only the credit value stays aligned
  function planNeed(item) {
    var line = element("span", "plan-course req is-outside");
    line.append(
      element("span", "", item.text),
      element("i", "", item.credits.toFixed(1))
    );
    return line;
  }

  function planCell(codes, kind, needs) {
    var cell = element("td");
    if (!codes.length && !(needs && needs.length)) {
      cell.append(element("span", "plan-none", "—"));
      return cell;
    }
    codes.forEach(function (code) {
      cell.append(planCourse(code, kind));
    });
    (needs || []).forEach(function (item) {
      cell.append(planNeed(item));
    });
    return cell;
  }

  function needsFor(year) {
    return activeProgram.outside.filter(function (item) {
      return item && item.year === year;
    });
  }

  function yearOf(code) {
    return byCode[code] ? byCode[code].term : "Other";
  }

  function sumCredits(codes) {
    return codes.reduce(function (total, code) {
      return total + creditsOf(code);
    }, 0);
  }

  function renderPlan(host) {
    var picks = trackPicks();
    var table = element("table", "plan-table");
    var head = element("thead");
    var body = element("tbody");
    var foot = element("tfoot");
    var headRow = element("tr");
    var footRow = element("tr");
    var totalRequired = 0;
    var totalPicks = 0;

    var routeName = activeProgram.tracks.length
      ? activeProgram.tracks[activeTrack].name
      : "route";
    ["Year", "Required", "Suggested · " + routeName, "Credits"].forEach(function (label) {
      headRow.append(element("th", "", label));
    });
    head.append(headRow);

    levelOrder.forEach(function (year) {
      var yearRequired = activeProgram.required.filter(function (code) {
        return yearOf(code) === year;
      });
      var yearPicks = picks.filter(function (code) {
        return yearOf(code) === year;
      });
      var yearNeeds = needsFor(year);
      if (!yearRequired.length && !yearPicks.length && !yearNeeds.length) {
        return;
      }

      var row = element("tr");
      var requiredCredits = sumCredits(yearRequired) + yearNeeds.reduce(
        function (total, item) {
          return total + item.credits;
        }, 0);
      var pickCredits = sumCredits(yearPicks);
      totalRequired += requiredCredits;
      totalPicks += pickCredits;

      row.append(
        element("th", "plan-year-cell", year),
        planCell(yearRequired, "req", yearNeeds),
        planCell(yearPicks, "pick"),
        element("td", "plan-credit-cell", (requiredCredits + pickCredits).toFixed(1))
      );
      body.append(row);
    });

    footRow.append(
      element("th", "plan-year-cell", "Total"),
      element("td", "plan-total", totalRequired.toFixed(1) + " required"),
      element("td", "plan-total", totalPicks.toFixed(1) + " suggested"),
      element("td", "plan-credit-cell", (totalRequired + totalPicks).toFixed(1))
    );
    foot.append(footRow);

    table.append(head, body, foot);
    var scroll = element("div", "plan-scroll");
    scroll.append(table);
    host.append(scroll);

    var note = element("p", "plan-foot");
    note.append(
      element("b", "", activeProgram.credits + " credits"),
      element("span", "", " to complete " + activeProgram.code + ". The " +
        (totalRequired + totalPicks).toFixed(1) + " above are the mathematics and" +
        " statistics half; the rest is ethics, programming and other departments," +
        " listed below.")
    );
    host.append(note);
  }

  function renderTracks(host) {
    if (!activeProgram.tracks.length) {
      return;
    }
    var wrap = element("div", "track-wrap");
    var row = element("div", "track-row");

    wrap.append(element("span", "track-kind", "Route through the options"));
    activeProgram.tracks.forEach(function (item, index) {
      var button = element("button", "track-button", item.name);
      button.type = "button";
      button.setAttribute("aria-pressed", index === activeTrack ? "true" : "false");
      button.addEventListener("click", function () {
        activeTrack = index;
        store("uoft-track", String(index));
        renderPanel();
        renderCourses();
      });
      row.append(button);
    });
    wrap.append(row, element("p", "track-who", activeProgram.tracks[activeTrack].who));
    host.append(wrap);
  }

  function renderPanel() {
    panel.replaceChildren();
    if (!activeProgram) {
      panel.hidden = true;
      onlyWrap.hidden = true;
      return;
    }

    var head = element("div", "panel-head");
    var link = element("a", "panel-link", "Full calendar entry ↗");

    head.append(
      element("span", "panel-kind", activeProgram.kind + " · " + activeProgram.code),
      element("h3", "", activeProgram.name),
      element("p", "panel-summary", activeProgram.summary)
    );
    panel.append(head);

    renderTracks(panel);
    renderPlan(panel);

    // year-tagged requirements already appear in the table; only the floating
    // notes are left to list here
    var notes = activeProgram.outside.filter(function (item) {
      return typeof item === "string";
    });
    if (notes.length) {
      var outside = element("div", "panel-outside");
      var list = element("ul");
      outside.append(element("h4", "", "Also counts, no fixed year"));
      notes.forEach(function (line) {
        list.append(element("li", "", line));
      });
      outside.append(list);
      panel.append(outside);
    }

    link.href = activeProgram.url;
    link.rel = "noreferrer";
    link.target = "_blank";
    panel.append(link);
    panel.hidden = false;
    onlyWrap.hidden = false;
    onlyWrap.querySelector("span").textContent = "Show only " + activeProgram.code + " courses";
  }

  // ---------- the catalog: everything, marked up for the chosen program ----------

  function makeCourseRow(course) {
    var row = hasLocalGuide(course)
      ? element("a", "course-row")
      : element("article", "course-row planned-row");
    var role = roleOf(course);

    if (hasLocalGuide(course)) {
      row.href = course.path;
    }
    // one line per course; the description survives as a hover tooltip
    row.title = course.description;
    if (role) {
      row.classList.add("is-" + role);
    }

    row.append(
      element("span", "course-code", course.code),
      element("span", "row-title", course.title),
      element("span", "subject-tag", course.subject)
    );
    if (activeProgram) {
      row.append(element("span", "role-tag", roleLabel(role)));
    }
    row.append(element("span", "row-meta", hasLocalGuide(course)
      ? String(course.chapters) + " chapters →"
      : "planned"));
    return row;
  }

  function levelSort(first, second) {
    var firstIndex = levelOrder.indexOf(first);
    var secondIndex = levelOrder.indexOf(second);
    if (firstIndex === -1) {
      firstIndex = levelOrder.length;
    }
    if (secondIndex === -1) {
      secondIndex = levelOrder.length;
    }
    return firstIndex === secondIndex
      ? first.localeCompare(second)
      : firstIndex - secondIndex;
  }

  function countRoles(list) {
    var tally = { required: 0, pick: 0, option: 0 };
    list.forEach(function (course) {
      var role = roleOf(course);
      if (role) {
        tally[role] += 1;
      }
    });
    return tally;
  }

  function makeCourseGroup(level, groupCourses) {
    var section = element("section", "course-year-group");
    var heading = element("div", "year-heading");
    var title = element("h3", "", level);
    var summary = element("p", "", groupCourses.length + (
      groupCourses.length === 1 ? " course" : " courses"
    ));
    var list = element("div", "course-list");

    if (activeProgram) {
      var tally = countRoles(groupCourses);
      summary.textContent = tally.required + " required · " + tally.pick +
        " suggested · " + tally.option + " eligible";
    }

    groupCourses.forEach(function (course) {
      list.append(makeCourseRow(course));
    });

    heading.append(title, summary);
    section.append(heading, list);
    return section;
  }

  function renderCourses() {
    var query = search.value.trim().toLowerCase();
    var onlyProgram = activeProgram && onlyBox.checked;
    var visible = courses.filter(function (course) {
      var matchesSubject = activeSubject === "All" || course.subject === activeSubject;
      var matchesQuery = !query || searchableText(course).indexOf(query) !== -1;
      var matchesProgram = !onlyProgram || roleOf(course) !== null;
      return matchesSubject && matchesQuery && matchesProgram;
    });

    grid.classList.toggle("has-program", Boolean(activeProgram));
    grid.replaceChildren();
    if (!visible.length) {
      grid.append(element("p", "empty-state", "No courses match this search yet."));
    } else {
      var groups = {};
      visible.forEach(function (course) {
        var level = course.term || "Other";
        if (!groups[level]) {
          groups[level] = [];
        }
        groups[level].push(course);
      });

      Object.keys(groups).sort(levelSort).forEach(function (level) {
        grid.append(makeCourseGroup(level, groups[level]));
      });
    }

    if (activeProgram) {
      var tally = countRoles(visible);
      resultCount.textContent = "Showing " + visible.length + " of " + courses.length +
        " · " + tally.required + " required, " + tally.pick + " suggested, " +
        tally.option + " eligible for " + activeProgram.code + ".";
    } else {
      resultCount.textContent = visible.length === courses.length
        ? "Showing all " + courses.length + " courses, grouped by year."
        : "Showing " + visible.length + " of " + courses.length + " courses, grouped by year.";
    }
  }

  function selectProgram(id) {
    activeProgram = id ? findProgram(id) : null;
    activeTrack = 0;
    store("uoft-program", activeProgram ? activeProgram.id : null);
    store("uoft-track", "0");
    renderPaths();
    renderPanel();
    renderCourses();
  }

  function renderPaths() {
    paths.replaceChildren();
    var kinds = [];
    programs.forEach(function (item) {
      if (kinds.indexOf(item.kind) === -1) {
        kinds.push(item.kind);
      }
    });

    kinds.forEach(function (kind) {
      var group = element("div", "path-group");
      var list = element("div", "path-list");
      var matching = programs.filter(function (item) {
        return item.kind === kind;
      });

      group.append(element("span", "path-kind", kind + " · " + matching.length));
      matching.forEach(function (item) {
        var button = element("button", "path-item");
        button.type = "button";
        button.setAttribute("aria-pressed",
          activeProgram && activeProgram.id === item.id ? "true" : "false");
        button.append(
          element("b", "", item.code),
          element("span", "", item.name),
          element("i", "", item.credits.replace("-", "–"))
        );
        button.addEventListener("click", function () {
          selectProgram(activeProgram && activeProgram.id === item.id ? null : item.id);
        });
        list.append(button);
      });
      group.append(list);
      paths.append(group);
    });

    var clear = element("button", "path-clear", "Clear selection");
    clear.type = "button";
    clear.disabled = !activeProgram;
    clear.addEventListener("click", function () {
      selectProgram(null);
    });
    paths.append(clear);
  }

  function renderFilters() {
    var subjects = ["All"];
    courses.forEach(function (course) {
      if (subjects.indexOf(course.subject) === -1) {
        subjects.push(course.subject);
      }
    });

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

  courseCount.textContent = String(courses.length);
  if (guideCount) {
    guideCount.textContent = String(courses.filter(hasLocalGuide).length);
  }
  if (programCount) {
    programCount.textContent = String(programs.length);
  }
  chapterCount.textContent = String(courses.reduce(function (total, course) {
    return total + course.chapters;
  }, 0));

  search.addEventListener("input", renderCourses);
  onlyBox.addEventListener("change", renderCourses);

  // first visit lands on the statistics specialist rather than an empty catalog
  var saved = read("uoft-program");
  activeProgram = findProgram(saved === null ? window.UOFT_DEFAULT_PROGRAM : saved);
  activeTrack = 0;
  if (activeProgram) {
    var savedTrack = parseInt(read("uoft-track"), 10);
    if (savedTrack >= 0 && savedTrack < activeProgram.tracks.length) {
      activeTrack = savedTrack;
    }
  }
  renderFilters();
  renderPaths();
  renderPanel();
  renderCourses();
}());
