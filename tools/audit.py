#!/usr/bin/env python3
"""MFDS site audit.

Checks, across every .html and .js file:
  * HTML well-formedness (stray / unclosed tags)
  * internal links and #anchors resolve
  * hrefs embedded in JavaScript strings resolve too -- these render into
    pages at runtime, so an HTML-only crawl misses them (this is exactly
    how five dead links reached assets/plan.js)
  * raw "<" inside $...$ math, which the HTML parser eats before MathJax
    ever sees it

Run from the site root:  python3 tools/audit.py
Exits non-zero if anything is wrong, so it can gate a commit.
"""
import os, re, sys, html.parser

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
VOID = {'meta', 'link', 'br', 'hr', 'img', 'input', 'source', 'wbr'}


class Page(html.parser.HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.ids, self.links, self.stack, self.stray = set(), [], [], []

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if 'id' in a:
            self.ids.add(a['id'])
        if tag == 'a' and a.get('href'):
            self.links.append(a['href'])
        if tag not in VOID:
            self.stack.append(tag)

    def handle_endtag(self, tag):
        if tag in VOID:
            return
        if self.stack and self.stack[-1] == tag:
            self.stack.pop()
        elif tag in self.stack:
            while self.stack and self.stack[-1] != tag:
                self.stack.pop()
            self.stack.pop()
        else:
            self.stray.append(tag)


def walk(ext):
    for base, dirs, files in os.walk(ROOT):
        dirs[:] = [d for d in dirs if d != '.git']
        for f in files:
            if f.endswith(ext):
                yield os.path.relpath(os.path.join(base, f), ROOT)


def resolve(src_dir, href):
    """Return the on-disk path an href points at, or None if external."""
    if href.startswith(('http://', 'https://', 'mailto:', 'data:', '#')):
        return None
    target = href.split('#')[0].split('?')[0]   # drop fragment and ?v= cache-buster
    if not target:
        return None
    path = os.path.normpath(os.path.join(ROOT, src_dir, target))
    if target.endswith('/') or os.path.isdir(path):
        path = os.path.join(path, 'index.html')
    return path


def main():
    problems = []
    pages = {}

    # ---- parse every page ----
    for rel in walk('.html'):
        p = Page()
        p.feed(open(os.path.join(ROOT, rel), encoding='utf-8').read())
        pages[rel] = p
        for t in p.stray:
            problems.append(f'{rel}: stray </{t}>')
        for t in [t for t in p.stack if t not in ('html', 'body')]:
            problems.append(f'{rel}: unclosed <{t}>')

    # ---- links + anchors in HTML ----
    for rel, p in pages.items():
        d = os.path.dirname(rel)
        for href in p.links:
            if href.startswith('#'):
                frag = href[1:]
                if frag and frag not in p.ids:
                    problems.append(f'{rel}: missing anchor {href}')
                continue
            path = resolve(d, href)
            if path is None:
                continue
            if not os.path.exists(path):
                problems.append(f'{rel}: broken link {href}')
                continue
            frag = href.split('#')[1] if '#' in href else ''
            target_rel = os.path.relpath(path, ROOT)
            if frag and target_rel in pages and frag not in pages[target_rel].ids:
                problems.append(f'{rel}: missing anchor {href}')

    # ---- hrefs hiding inside JavaScript ----
    def js_hrefs(src):
        """Yield literal hrefs from JS source, skipping runtime concatenation.

        Two spellings occur: hrefs written inside HTML strings (href="...")
        and hrefs as object properties (href:'...'), e.g. plan.js homework
        entries. Missing the second spelling hid two dead links.
        """
        found = set(re.findall(r'href="([^"]+)"', src))
        found |= set(re.findall(r"""href\s*:\s*['"]([^'"]+)['"]""", src))
        for href in sorted(found):
            # skip string concatenation like  href="' + root + s.href + '"
            if not any(c in href for c in "'+`"):
                yield href

    for rel in walk('.js'):
        src = open(os.path.join(ROOT, rel), encoding='utf-8').read()
        # plan.js paths are site-root relative; asset scripts sit in assets/
        for href in js_hrefs(src):
            path = resolve('', href)
            if path and not os.path.exists(path):
                problems.append(f'{rel}: broken link {href} (rendered at runtime)')

    # ---- and hrefs inside INLINE <script> blocks in HTML ----
    # html.parser treats script bodies as CDATA, so the crawl above never sees
    # these. The study-plan units on algorithms/index.html are built this way.
    for rel in walk('.html'):
        src = open(os.path.join(ROOT, rel), encoding='utf-8').read()
        d = os.path.dirname(rel)
        for block in re.findall(r'<script\b[^>]*>(.*?)</script>', src, re.S):
            for href in js_hrefs(block):
                if href.startswith('#'):
                    frag = href[1:]
                    if frag and frag not in pages[rel].ids:
                        problems.append(f'{rel}: missing anchor {href} (rendered at runtime)')
                    continue
                path = resolve(d, href)
                if path is None:
                    continue
                if not os.path.exists(path):
                    problems.append(f'{rel}: broken link {href} (rendered at runtime)')
                    continue
                frag = href.split('#')[1] if '#' in href else ''
                target_rel = os.path.relpath(path, ROOT)
                if frag and target_rel in pages and frag not in pages[target_rel].ids:
                    problems.append(f'{rel}: missing anchor {href} (rendered at runtime)')

    # ---- "<" inside inline math that the HTML parser will eat ----
    # Only a "<" followed by a letter, "/", "!" or "?" opens a tag; "$a<\varepsilon$"
    # is harmless but "$a<b$" silently becomes a <b> element.
    for rel in walk('.html'):
        src = open(os.path.join(ROOT, rel), encoding='utf-8').read()
        for m in re.finditer(r'\$\$?[^$\n]{1,200}?\$\$?', src):
            # "${...}" is a JavaScript template-literal placeholder, not math
            if m.group(0).startswith('${') or '${' in m.group(0):
                continue
            if re.search(r'<[A-Za-z/!?]', m.group(0)):
                line = src[:m.start()].count('\n') + 1
                problems.append(f'{rel}:{line}: "<" opens a tag inside math -- escape as &lt;'
                                f'  |  {m.group(0)[:60]}')

    print(f'{len(pages)} html pages checked')
    if problems:
        print(f'\n{len(problems)} problem(s):')
        for x in problems:
            print('  ', x)
        return 1
    print('clean: 0 problems')
    return 0


if __name__ == '__main__':
    sys.exit(main())
