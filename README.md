# UofT-Math

Course guides for University of Toronto mathematics and statistics courses.
Static HTML, no build step, no runtime dependencies.

Live: https://ttmathcs.github.io/UofT-Math/

## Layout

```
index.html              catalog: suggested course selection + searchable course list
comprehensive_guide.html
course_changes.html
assets/                 catalog.css, catalog.js, courses.js, theme.js, course-runtime.js
<COURSE>/               index.html, unit01.html ... unitNN.html, style.css
```

`assets/courses.js` is the registry. Every card, subject filter, search term, and
the counters on the front page come from it. A course with no `path` shows as a
planned entry, so upper-year courses are searchable before their guide exists.

## Adding a course

1. Create the course folder, copy `style.css` from an existing course.
2. Write `index.html` (hero, about, chapters, textbook spine, practice plan,
   resources) and one `unitNN.html` per chapter.
3. Change the course's `planned(...)` line in `assets/courses.js` to `guide(...)`
   with its path and chapter count.

Unit pages follow: definitions → theorems with proof reasoning → worked examples
→ pitfalls → practice. Math is written as MathML, parsed by the helper in
`assets/course-runtime.js`.

## Constraints

- Every page sets `default-src 'self'`. Nothing loads from a CDN — no fonts, no
  script tags pointing off-site, no remote images.
- `style.css` is identical across all course folders. Change one, sync the rest.
- External links (UofT Calendar, textbooks, video) are fine as `href` targets;
  they just can't be loaded into the page.
