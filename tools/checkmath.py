#!/usr/bin/env python3
"""Check that every \command inside $...$ is one the course runtime can render.

Usage: checkmath.py <runtime.js> <page.html> [page.html ...]
"""
import re
import sys


def supported(runtime_path):
    src = open(runtime_path).read()
    names = set()
    for table in ("mathSymbols", "largeOperators", "mathAccents", "mathVariants"):
        start = src.index(table + " = {")
        end = src.index("\n};", start)
        names |= set(re.findall(r'(?:^|[{,\s])([A-Za-z]+)\s*:', src[start:end]))
    # \ln, \sup, \sec ... render through the mathFunctions set, not a table
    fn = src.index("mathFunctions = new Set([")
    names |= set(re.findall(r'"([A-Za-z]+)"', src[fn:src.index("]);", fn)]))
    # handled by explicit branches rather than a lookup table
    names |= {
        "operatorname", "frac", "dfrac", "tfrac", "sqrt", "text", "det", "dim",
        "ker", "lVert", "rVert", "left", "right", "begin", "end", "quad",
        "qquad", "Re", "Im", "min", "max", "log", "exp", "sin", "cos", "tan",
        "deg", "gcd", "tr", "rank", "span", "cdot", "colon",
        # size and spacing commands the parser consumes silently
        "displaystyle", "textstyle", "big", "Big", "bigg", "Bigg", "not",
        "pmod", "bmod", "prime", "overset", "underset", "phantom", "mathop",
        "limits", "nolimits", "smallmatrix", "atop", "over",
    }
    return names


def check(path, ok):
    html = open(path).read()
    problems = []
    spans = re.findall(r'\$([^$]+)\$', html)
    if html.count("$") % 2:
        problems.append("odd number of $ delimiters — an unclosed span")
    for span in spans:
        # \\ is a row separator inside smallmatrix, not the start of a command
        scan = span.replace("\\\\", " ")
        for cmd in re.findall(r'\\([a-zA-Z]+)', scan):
            if cmd not in ok:
                problems.append("\\%s  in  $%s$" % (cmd, span[:60]))
        if "\t" in span:
            problems.append("literal tab inside math: $%s$" % span[:60])
    return spans, problems


def main():
    ok = supported(sys.argv[1])
    total = bad = 0
    for path in sys.argv[2:]:
        spans, problems = check(path, ok)
        total += len(spans)
        name = path.split("/")[-2] + "/" + path.split("/")[-1]
        if problems:
            bad += len(problems)
            print("%s — %d math spans, %d PROBLEMS" % (name, len(spans), len(problems)))
            for line in dict.fromkeys(problems):
                print("    " + line)
        else:
            print("%s — %d math spans, clean" % (name, len(spans)))
    print("\n%d spans checked, %d problems" % (total, bad))
    return 1 if bad else 0


if __name__ == "__main__":
    sys.exit(main())
