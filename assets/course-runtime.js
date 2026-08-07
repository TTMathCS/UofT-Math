"use strict";

const MATHML_NAMESPACE = "http://www.w3.org/1998/Math/MathML";

function createMathElement(tag, text, attributes) {
  const element = document.createElementNS(MATHML_NAMESPACE, tag);
  if (text !== undefined) element.textContent = text;
  Object.entries(attributes || {}).forEach(function (entry) {
    element.setAttribute(entry[0], entry[1]);
  });
  return element;
}

const mathSymbols = {
  alpha: ["mi", "α"],
  beta: ["mi", "β"],
  chi: ["mi", "χ"],
  delta: ["mi", "δ"],
  Delta: ["mi", "Δ"],
  emptyset: ["mi", "∅"],
  epsilon: ["mi", "ε"],
  eta: ["mi", "η"],
  gamma: ["mi", "γ"],
  Gamma: ["mi", "Γ"],
  kappa: ["mi", "κ"],
  lambda: ["mi", "λ"],
  Lambda: ["mi", "Λ"],
  mu: ["mi", "μ"],
  nu: ["mi", "ν"],
  omega: ["mi", "ω"],
  Omega: ["mi", "Ω"],
  phi: ["mi", "φ"],
  Phi: ["mi", "Φ"],
  pi: ["mi", "π"],
  Pi: ["mi", "Π"],
  psi: ["mi", "ψ"],
  Psi: ["mi", "Ψ"],
  rho: ["mi", "ρ"],
  sigma: ["mi", "σ"],
  Sigma: ["mi", "Σ"],
  tau: ["mi", "τ"],
  theta: ["mi", "θ"],
  Theta: ["mi", "Θ"],
  varepsilon: ["mi", "ε"],
  varphi: ["mi", "φ"],
  xi: ["mi", "ξ"],
  Xi: ["mi", "Ξ"],
  zeta: ["mi", "ζ"],
  ell: ["mi", "ℓ"],
  nabla: ["mi", "∇"],
  partial: ["mi", "∂"],
  approx: ["mo", "≈"],
  ast: ["mo", "∗"],
  cap: ["mo", "∩"],
  cdot: ["mo", "⋅"],
  circ: ["mo", "∘"],
  cong: ["mo", "≅"],
  cup: ["mo", "∪"],
  dagger: ["mo", "†"],
  downarrow: ["mo", "↓"],
  equiv: ["mo", "≡"],
  exists: ["mo", "∃"],
  forall: ["mo", "∀"],
  ge: ["mo", "≥"],
  geq: ["mo", "≥"],
  gg: ["mo", "≫"],
  iff: ["mo", "⟺"],
  in: ["mo", "∈"],
  infty: ["mo", "∞"],
  land: ["mo", "∧"],
  langle: ["mo", "⟨"],
  lceil: ["mo", "⌈"],
  le: ["mo", "≤"],
  leftarrow: ["mo", "←"],
  leftrightarrow: ["mo", "↔"],
  Leftarrow: ["mo", "⇐"],
  Leftrightarrow: ["mo", "⇔"],
  leq: ["mo", "≤"],
  lfloor: ["mo", "⌊"],
  ll: ["mo", "≪"],
  Longleftrightarrow: ["mo", "⟺"],
  Longrightarrow: ["mo", "⟹"],
  longrightarrow: ["mo", "⟶"],
  lor: ["mo", "∨"],
  mapsto: ["mo", "↦"],
  mid: ["mo", "∣"],
  ne: ["mo", "≠"],
  neg: ["mo", "¬"],
  neq: ["mo", "≠"],
  notin: ["mo", "∉"],
  odot: ["mo", "⊙"],
  oplus: ["mo", "⊕"],
  otimes: ["mo", "⊗"],
  parallel: ["mo", "∥"],
  perp: ["mo", "⟂"],
  pm: ["mo", "±"],
  propto: ["mo", "∝"],
  rangle: ["mo", "⟩"],
  rceil: ["mo", "⌉"],
  rfloor: ["mo", "⌋"],
  Rightarrow: ["mo", "⇒"],
  setminus: ["mo", "∖"],
  sim: ["mo", "∼"],
  simeq: ["mo", "≃"],
  subset: ["mo", "⊂"],
  subseteq: ["mo", "⊆"],
  subsetneq: ["mo", "⊊"],
  supset: ["mo", "⊃"],
  supseteq: ["mo", "⊇"],
  times: ["mo", "×"],
  to: ["mo", "→"],
  triangleq: ["mo", "≜"],
  uparrow: ["mo", "↑"],
  vee: ["mo", "∨"],
  wedge: ["mo", "∧"],
  cdots: ["mo", "⋯"],
  dots: ["mo", "…"],
  ldots: ["mo", "…"],
  vdots: ["mo", "⋮"],
  ddots: ["mo", "⋱"]
};

const mathFunctions = new Set([
  "arccos", "arcsin", "arctan", "arg", "cos", "cosh", "cot", "csc", "deg",
  "det", "dim", "exp", "gcd", "inf", "ker", "lcm", "ln", "log", "max", "min",
  "Pr", "rank", "sec", "sin", "sinh", "sup", "tan", "tanh", "tr"
]);

const largeOperators = {
  bigcap: "⋂",
  bigcup: "⋃",
  bigoplus: "⨁",
  iint: "∬",
  iiint: "∭",
  int: "∫",
  lim: "lim",
  liminf: "lim inf",
  limsup: "lim sup",
  oint: "∮",
  prod: "∏",
  sum: "∑"
};

// Accents that sit above their argument, as \hat x or \vec v.
const mathAccents = {
  bar: "¯",
  overline: "¯",
  hat: "^",
  widehat: "^",
  tilde: "~",
  widetilde: "~",
  vec: "→",
  dot: "˙",
  ddot: "¨"
};

// Font commands, mapped to the MathML mathvariant they set.
const mathVariants = {
  mathbb: "double-struck",
  mathbf: "bold",
  mathcal: "script",
  mathfrak: "fraktur",
  mathit: "italic",
  mathrm: "normal",
  mathsf: "sans-serif"
};

// Blackboard-bold, script and fraktur letters. Most live in the Mathematical
// Alphanumeric Symbols block at a fixed offset, but a scattering of them were
// encoded earlier in Letterlike Symbols and have to be spelled out.
const scriptBases = {mathbb: 0x1d538, mathcal: 0x1d49c, mathfrak: 0x1d504};
const scriptExceptions = {
  mathbb: {C: "ℂ", H: "ℍ", N: "ℕ", P: "ℙ", Q: "ℚ", R: "ℝ", Z: "ℤ"},
  mathcal: {B: "ℬ", E: "ℰ", F: "ℱ", H: "ℋ", I: "ℐ", L: "ℒ", M: "ℳ", R: "ℛ"},
  mathfrak: {C: "ℭ", H: "ℌ", I: "ℑ", R: "ℜ", Z: "ℨ"}
};

function scriptLetter(command, raw) {
  if (!/^[A-Za-z]$/.test(raw)) {
    return null;
  }
  const exception = scriptExceptions[command][raw];
  if (exception) {
    return exception;
  }
  const base = scriptBases[command];
  const offset = raw >= "a" ? raw.charCodeAt(0) - 97 + 26 : raw.charCodeAt(0) - 65;
  return String.fromCodePoint(base + offset);
}

class LatexMathParser {
  constructor(source) {
    this.source = source;
    this.position = 0;
  }

  parse() {
    return this.parseSequence();
  }

  skipWhitespace() {
    while (/\s/.test(this.source[this.position] || "")) this.position += 1;
  }

  parseSequence(stopAtBrace) {
    const row = createMathElement("mrow");
    while (this.position < this.source.length) {
      this.skipWhitespace();
      if (stopAtBrace && this.source[this.position] === "}") break;
      if (this.position >= this.source.length) break;

      const atom = this.parseAtom();
      if (atom) row.append(this.parseScripts(atom));
    }
    return row;
  }

  parseScripts(base) {
    let subscript = null;
    let superscript = null;
    let primes = "";

    while (this.position < this.source.length) {
      this.skipWhitespace();
      const marker = this.source[this.position];
      if (marker === "_") {
        this.position += 1;
        subscript = this.parseArgument();
      } else if (marker === "^") {
        this.position += 1;
        superscript = this.parseArgument();
      } else if (marker === "'") {
        this.position += 1;
        primes += "′";
      } else {
        break;
      }
    }

    if (primes) {
      const primeNode = createMathElement("mo", primes);
      if (superscript) {
        const combined = createMathElement("mrow");
        combined.append(superscript, primeNode);
        superscript = combined;
      } else {
        superscript = primeNode;
      }
    }

    if (subscript && superscript) {
      const scripted = createMathElement("msubsup");
      scripted.append(base, subscript, superscript);
      return scripted;
    }
    if (subscript) {
      const scripted = createMathElement("msub");
      scripted.append(base, subscript);
      return scripted;
    }
    if (superscript) {
      const scripted = createMathElement("msup");
      scripted.append(base, superscript);
      return scripted;
    }
    return base;
  }

  parseArgument() {
    this.skipWhitespace();
    if (this.source[this.position] === "{") {
      this.position += 1;
      const group = this.parseSequence(true);
      if (this.source[this.position] === "}") this.position += 1;
      return group;
    }
    // An unbraced argument is a single token, as in LaTeX: \tfrac43 means
    // \tfrac{4}{3}, so a digit consumes only one digit (not the whole number).
    if (/[0-9]/.test(this.source[this.position] || "")) {
      const digit = this.source[this.position];
      this.position += 1;
      return createMathElement("mn", digit);
    }
    const atom = this.parseAtom();
    return atom ? this.parseScripts(atom) : createMathElement("mrow");
  }

  parseAtom() {
    const character = this.source[this.position];
    if (character === "{") {
      this.position += 1;
      const group = this.parseSequence(true);
      if (this.source[this.position] === "}") this.position += 1;
      return group;
    }
    if (character === "}") {
      this.position += 1;
      return createMathElement("mo", "}");
    }
    if (character === "\\") return this.parseCommand();
    if (/[0-9]/.test(character)) return this.parseNumber();
    if (/[A-Za-z]/.test(character)) {
      this.position += 1;
      return createMathElement("mi", character);
    }
    if (character === "~") {
      this.position += 1;
      return createMathElement("mspace", undefined, {width: "0.6em"});
    }

    this.position += 1;
    return createMathElement("mo", character);
  }

  parseNumber() {
    const start = this.position;
    while (/[0-9.]/.test(this.source[this.position] || "")) this.position += 1;
    return createMathElement("mn", this.source.slice(start, this.position));
  }

  readCommandName() {
    this.position += 1;
    const start = this.position;
    if (/[A-Za-z]/.test(this.source[this.position] || "")) {
      while (/[A-Za-z]/.test(this.source[this.position] || "")) this.position += 1;
      return this.source.slice(start, this.position);
    }
    this.position += 1;
    return this.source[start] || "";
  }

  readRawGroup() {
    this.skipWhitespace();
    if (this.source[this.position] !== "{") return "";
    this.position += 1;
    const start = this.position;
    let depth = 1;
    while (this.position < this.source.length && depth > 0) {
      if (this.source[this.position] === "{") depth += 1;
      if (this.source[this.position] === "}") depth -= 1;
      this.position += 1;
    }
    return this.source.slice(start, Math.max(start, this.position - 1));
  }

  parseCommand() {
    const command = this.readCommandName();

    if (command === "displaystyle" || command === "left" || command === "right"
        || command === "big" || command === "Big") {
      return null;
    }

    if ([",", ":", ";", " ", "qquad", "!"].includes(command)) {
      const widths = {",": "0.18em", ":": "0.28em", ";": "0.4em", " ": "0.4em", qquad: "2em", "!": "-0.12em"};
      return createMathElement("mspace", undefined, {width: widths[command]});
    }

    if (command === "{" || command === "}") return createMathElement("mo", command);

    // \| is the norm delimiter; \lVert and \rVert spell out the same bars.
    if (command === "|" || command === "lVert" || command === "rVert") {
      return createMathElement("mo", "‖");
    }

    if (command === "frac" || command === "dfrac" || command === "tfrac") {
      const fraction = createMathElement("mfrac");
      fraction.append(this.parseArgument(), this.parseArgument());
      return fraction;
    }

    if (command === "sqrt") {
      this.skipWhitespace();
      if (this.source[this.position] === "[") {
        // \sqrt[n]{x} -> nth root
        this.position += 1;
        const start = this.position;
        while (this.position < this.source.length && this.source[this.position] !== "]") {
          this.position += 1;
        }
        const index = new LatexMathParser(this.source.slice(start, this.position)).parse();
        if (this.source[this.position] === "]") this.position += 1;
        const root = createMathElement("mroot");
        root.append(this.parseArgument(), index);
        return root;
      }
      const root = createMathElement("msqrt");
      root.append(this.parseArgument());
      return root;
    }

    if (mathVariants[command]) {
      // MathML Core dropped mathvariant on mstyle, so browsers render
      // \mathbb{R} as a plain italic R. Emit the real character instead and
      // keep the mstyle only as a fallback for multi-character arguments.
      if (command === "mathbb" || command === "mathcal" || command === "mathfrak") {
        const start = this.position;
        const raw = this.readRawGroup();
        const letter = scriptLetter(command, raw);
        if (letter) {
          return createMathElement("mi", letter);
        }
        this.position = start;
      }
      const style = createMathElement("mstyle", undefined, {
        mathvariant: mathVariants[command]
      });
      style.append(this.parseArgument());
      return style;
    }

    if (command === "binom") {
      const stack = createMathElement("mfrac", undefined, {linethickness: "0"});
      stack.append(this.parseArgument(), this.parseArgument());
      const row = createMathElement("mrow");
      row.append(
        createMathElement("mo", "("),
        stack,
        createMathElement("mo", ")")
      );
      return row;
    }

    if (command === "text") {
      return createMathElement("mtext", this.readRawGroup());
    }

    if (command === "operatorname") {
      return createMathElement("mi", this.readRawGroup(), {mathvariant: "normal"});
    }

    if (mathAccents[command]) {
      const over = createMathElement("mover", undefined, {accent: "true"});
      over.append(this.parseArgument(), createMathElement("mo", mathAccents[command]));
      return over;
    }

    if (command === "overset") {
      const label = this.parseArgument();
      const base = this.parseArgument();
      const over = createMathElement("mover");
      over.append(base, label);
      return over;
    }

    if (command === "pmod") {
      const row = createMathElement("mrow");
      row.append(
        createMathElement("mo", "("),
        createMathElement("mi", "mod", {mathvariant: "normal"}),
        createMathElement("mspace", undefined, {width: "0.3em"}),
        this.parseArgument(),
        createMathElement("mo", ")")
      );
      return row;
    }

    if (command === "begin") return this.parseEnvironment();

    if (command === "not") {
      this.skipWhitespace();
      if (this.source[this.position] === "\\") {
        const nextCommand = this.readCommandName();
        const negated = {to: "↛", Rightarrow: "⇏", Longrightarrow: "⇏"}[nextCommand];
        if (negated) return createMathElement("mo", negated);
        if (mathSymbols[nextCommand]) return createMathElement("mo", "̸" + mathSymbols[nextCommand][1]);
      }
      return createMathElement("mo", "̸");
    }

    if (mathSymbols[command]) {
      return createMathElement(mathSymbols[command][0], mathSymbols[command][1]);
    }

    if (mathFunctions.has(command)) {
      return createMathElement("mi", command, {mathvariant: "normal"});
    }

    if (largeOperators[command]) {
      return createMathElement("mo", largeOperators[command], {
        largeop: "true",
        movablelimits: "true"
      });
    }

    return createMathElement("mtext", "\\" + command);
  }

  parseEnvironment() {
    const environment = this.readRawGroup();
    const endMarker = "\\end{" + environment + "}";
    const end = this.source.indexOf(endMarker, this.position);
    if (end === -1) return createMathElement("mtext", "\\begin{" + environment + "}");

    const contents = this.source.slice(this.position, end);
    this.position = end + endMarker.length;
    if (environment !== "matrix" && environment !== "smallmatrix") {
      return createMathElement("mtext", contents);
    }

    const table = createMathElement("mtable", undefined, {
      columnspacing: "0.8em",
      rowspacing: "0.3em"
    });
    contents.split(/\\\\/).forEach(function (rowSource) {
      const row = createMathElement("mtr");
      rowSource.split("&").forEach(function (cellSource) {
        const cell = createMathElement("mtd");
        cell.append(new LatexMathParser(cellSource).parse());
        row.append(cell);
      });
      table.append(row);
    });
    return table;
  }
}

function renderLatex(source, display) {
  const math = createMathElement("math", undefined, {
    class: "math-rendered",
    display: display ? "block" : "inline",
    "aria-label": source
  });
  const semantics = createMathElement("semantics");
  const annotation = createMathElement("annotation", source, {encoding: "application/x-tex"});
  semantics.append(new LatexMathParser(source).parse(), annotation);
  math.append(semantics);
  return math;
}

function renderLatexMath() {
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const textNodes = [];

  while (walker.nextNode()) {
    const parent = walker.currentNode.parentElement;
    if (!parent || parent.closest("script, style, code, pre, textarea, math")) continue;
    if (walker.currentNode.nodeValue.includes("$")) textNodes.push(walker.currentNode);
  }

  const pattern = /(\$\$[\s\S]*?\$\$|\$(?:\\.|[^$])+\$)/g;
  textNodes.forEach(function (textNode) {
    const text = textNode.nodeValue;
    if (!pattern.test(text)) return;
    pattern.lastIndex = 0;

    const fragment = document.createDocumentFragment();
    let offset = 0;
    let match;
    while ((match = pattern.exec(text)) !== null) {
      fragment.append(document.createTextNode(text.slice(offset, match.index)));
      const display = match[0].startsWith("$$");
      const source = match[0].slice(display ? 2 : 1, display ? -2 : -1).trim();
      fragment.append(renderLatex(source, display));
      offset = match.index + match[0].length;
    }
    fragment.append(document.createTextNode(text.slice(offset)));
    textNode.replaceWith(fragment);
  });
}

function setupSectionNavigation() {
  const links = Array.from(document.querySelectorAll("nav a[data-t]"));
  if (!links.length || !("IntersectionObserver" in window)) return;

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      const id = entry.target.id;
      links.forEach(function (link) {
        link.classList.toggle("active", link.getAttribute("href") === "#" + id);
      });
    });
  }, {rootMargin: "-30% 0px -60% 0px"});

  links.forEach(function (link) {
    const target = document.getElementById(link.getAttribute("href").slice(1));
    if (target) observer.observe(target);
  });
}

function hardenExternalLinks() {
  document.querySelectorAll("a[href]").forEach(function (link) {
    const href = link.getAttribute("href");
    if (!href || !/^https:\/\//i.test(href)) return;
    link.rel = "external noopener noreferrer";
    link.referrerPolicy = "no-referrer";
  });
}

document.addEventListener("DOMContentLoaded", function () {
  renderLatexMath();
  hardenExternalLinks();
  setupSectionNavigation();
});
