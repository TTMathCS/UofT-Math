# CLAUDE.md

## Workflow

- Commit, push, open the PR, and squash-merge it without stopping to ask. Only
  pause when *what* to build is ambiguous, never over whether to ship.
- Confirm the Pages build finished and curl the live page before asking for a
  review.

## Repo rules

- Static HTML only. No build step, no package manager, no CDN.
- Every page carries `default-src 'self'`. Adding any off-site asset breaks it.
- `style.css` is byte-identical in every course folder. After editing one, copy
  it to the others and verify with `md5 -q */style.css`.
- A new course is not done until its entry in `assets/courses.js` moves from
  `planned(...)` to `guide(...)` with the real path and chapter count.
- Course/unit page structure mirrors MAT158H1 and MAT240H1. Read those before
  writing a new one.

## Content

- Math is MathML, rendered by `assets/course-runtime.js`. No LaTeX, no MathJax.
- Unit pages are teaching material: definitions, theorems with the reasoning
  spelled out, worked examples, pitfalls, practice. Not summaries.
- Prose is plain and direct. No AI-flavored phrasing in copy or comments.
