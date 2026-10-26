#!/usr/bin/env node
// House style gate for every word in the repo. Two rules, both from
// .claude/skills/blog-post/SKILL.md: no em dashes, and no serial comma.
//
// Usage: node scripts/lint-prose.mjs [files...]   (defaults to the whole tree)
//
// The em dash rule is only enforced on the two content collections, because
// that is where it was written for and because dashes are load-bearing
// punctuation in a code comment. The serial comma rule runs everywhere: page
// copy in .astro, the docs at the root, llms.txt, the skills, the workflow
// files and the comments and string literals in the scripts and stylesheet,
// all of which are read by somebody.
//
// The serial comma test is a heuristic, because "x, and y" is a serial comma
// only when the sentence is running a series. The same shape joins two
// independent clauses, which the house style keeps. So the check flags a
// comma before and/or only when the sentence already has an earlier comma
// doing list work, and anything it gets wrong lives in prose-allow.json next
// to this file, one entry per accepted sentence.

import { readFileSync, readdirSync } from 'node:fs'
import { join, dirname, relative, resolve, extname } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const root = join(here, '..')

// Where the em dash rule applies. Everything else is serial comma only.
const COLLECTIONS = ['src/content/blog', 'src/content/research']

// Build output, dependencies and caches are not ours to style. Everything else
// under the repo root is walked, so a new page or doc is linted the day it
// lands rather than the day somebody remembers to add its directory here.
const SKIP_DIRS = new Set([
  'node_modules',
  'dist',
  '.git',
  '.astro',
  '.wrangler',
  '.vscode',
  'shots',
])
const EXTS = new Set([
  '.md',
  '.mdx',
  '.astro',
  '.txt',
  '.ts',
  '.mjs',
  '.css',
  '.html',
  '.yml',
  '.jsonc',
])

const allowPath = join(here, 'prose-allow.json')
const allow = new Set(JSON.parse(readFileSync(allowPath, 'utf8')).allow.map(normalise))
const used = new Set()

// NUL is the marker stripCode leaves where code used to be. It never belongs in
// a printed sentence or an allowlist key, so it dies here, at the one place
// every sentence passes through.
function normalise(s) {
  return s.replace(/\0/g, ' ').replace(/\s+/g, ' ').trim()
}

// Recursive, because the collections are loaded with a `**/*.{md,mdx}` glob
// (src/content.config.ts). Walking one level deep would let a post in a
// subdirectory publish unlinted while CI still printed "prose ok".
function collect(dir) {
  const out = []
  for (const e of readdirSync(join(root, dir), { withFileTypes: true })) {
    if (e.isDirectory()) {
      if (!SKIP_DIRS.has(e.name)) out.push(...collect(join(dir, e.name)))
    } else if (e.isSymbolicLink()) {
      // CLAUDE.md is a symlink to AGENTS.md. Following it would lint the same
      // bytes twice and print every problem in it twice.
      continue
    } else if (EXTS.has(extname(e.name))) {
      out.push(join(root, dir, e.name))
    }
  }
  return out
}

function inCollections(file) {
  return COLLECTIONS.some((c) => file.startsWith(c + '/'))
}

// Everything the rules do not apply to: fenced code, inline code, frontmatter
// keys that are not prose, JSX attributes, link targets, import lines. Replaced
// with spaces rather than deleted so line numbers and offsets survive.
function blank(text, re, fill = ' ') {
  return text.replace(re, (m) => m.replace(/[^\n]/g, fill))
}

function stripMarkdown(source) {
  let t = source
  t = blank(t, /^---\n[\s\S]*?\n---\n/)
  const fm = source.match(/^---\n([\s\S]*?)\n---\n/)
  t = blank(t, /```[\s\S]*?```/g)
  t = blank(t, /`[^`\n]*`/g)
  t = blank(t, /^import .*$/gm)
  t = blank(t, /\{\/\*[\s\S]*?\*\/\}/g)
  t = blank(t, /<[A-Za-z][^>]*>/g)
  t = blank(t, /\]\([^)]*\)/g)
  t = blank(t, /^#+ /gm)
  // Prose that lives in frontmatter is still prose, so put those values back.
  if (fm) {
    for (const key of ['title', 'description', 'deck']) {
      const m = fm[1].match(new RegExp(`^${key}: .*$`, 'm'))
      if (m) t = t.slice(0, m.index + 4) + m[0] + t.slice(m.index + 4 + m[0].length)
    }
  }
  return t
}

// An .astro file carries copy in two places: string literals in the component
// script at the top and the markup below it. Both ship to the page, so both are
// read. Blanked out: the style and script blocks, which are CSS and browser JS
// rather than words, plus the attributes whose values are machine addresses.
// A class list or a URL cannot hold a serial comma, but it can hold the commas
// that make the heuristic think a sentence is running a series.
function stripAstro(source) {
  // The fence at the top is a JS module, not markup, so it is read as code.
  const fence = source.match(/^---\n[\s\S]*?\n---/)
  const head = fence ? stripCode(fence[0]) : ''
  let t = fence ? source.slice(fence[0].length) : source
  t = blank(t, /<style[^>]*>[\s\S]*?<\/style>/g)
  t = blank(t, /<script[^>]*>[\s\S]*?<\/script>/g)
  t = blank(t, /^\s*import .*$/gm)
  t = blank(t, /\b(?:class|href|src|srcset|style|id|d|viewBox|content|name|property|rel)=(["'])[\s\S]*?\1/g, '\0')
  return head + t
}

// In a .ts, .mjs or .css file the prose is the comments and the string
// literals. Everything else is code, and code is full of commas that are not
// list commas: an argument list, an array of ten role bullets, a destructuring
// pattern. Left in, they make the heuristic read a whole array as one sentence
// and flag the one element that says "and".
//
// So code is replaced with NUL rather than with spaces. NUL is a sentence
// boundary (see BLOCK), which makes each string literal and each comment its
// own unit, while the whitespace between them stays whitespace so a comment
// that wraps over four lines is still read as one sentence.
const CODE_TOKEN =
  /\/\*[\s\S]*?\*\/|\/\/[^\n]*|'(?:\\.|[^'\\])*'|"(?:\\.|[^"\\])*"|`(?:\\.|[^`\\])*`/g

// YAML has no C comments and no template strings. A workflow file is mostly
// bare scalars, which are values rather than sentences, so the prose in it is
// the # comments and the quoted strings.
const YAML_TOKEN = /#[^\n]*|'(?:''|[^'])*'|"(?:\\.|[^"\\])*"/g

// Whitespace survives, so wrapped comments stay one sentence; everything else
// becomes the boundary.
function voidOut(code) {
  return code.replace(/\S/g, '\0')
}

// The delimiters go, the words stay: `// ` and `/*` and the quotes are marks
// the writer did not choose, and a quote sitting mid-sentence would split it.
function unwrap(token) {
  return token.replace(/^\/\*|\*\/$|^\/\/|^#|^['"`]|['"`]$/g, (m) => ' '.repeat(m.length))
}

function stripCode(source, token = CODE_TOKEN) {
  let out = ''
  let last = 0
  for (const m of source.matchAll(token)) {
    out += voidOut(source.slice(last, m.index))
    out += unwrap(m[0])
    last = m.index + m[0].length
  }
  return out + voidOut(source.slice(last))
}

function strip(file, source) {
  const ext = extname(file)
  if (ext === '.md' || ext === '.mdx') return stripMarkdown(source)
  if (ext === '.astro' || ext === '.html') return stripAstro(source)
  if (ext === '.yml') return stripCode(source, YAML_TOKEN)
  return stripCode(source)
}

function lineOf(text, index) {
  return text.slice(0, index).split('\n').length
}

// The sentence around an offset, used both as the unit the heuristic reasons
// over and as the allowlist key.
//
// A markdown table row, a table cell or a list bullet ends a sentence as firmly
// as a full stop does, even though it carries no punctuation. Without that, a
// twelve-row form table reads as one enormous sentence, every cell boundary
// looks like a list comma and the check flags the one row that happens to say
// "or" in it. So a cell wall, and a newline followed by a block marker, count
// as boundaries. So does a box-drawing character: several components open with
// an ASCII sketch of the layout they build, and a diagram is not prose.
const BLOCK = /\0|[|\u2500-\u257f]|\n[ \t]*(?:[>#]|[-*+] |\d+[.)] )/g

function sentenceAt(text, index) {
  let start = Math.max(text.lastIndexOf('\n\n', index), text.lastIndexOf(': ', index))
  for (const re of [/[.!?]['"’”]?(\s|$)/g, BLOCK]) {
    for (const m of text.slice(0, index).matchAll(re)) {
      if (m.index > start) start = m.index
    }
  }
  let end = text.length
  for (const re of [/[.!?]['"’”]?(\s|$)/g, BLOCK]) {
    for (const m of text.slice(index).matchAll(re)) {
      end = Math.min(end, index + m.index + 1)
      break
    }
  }
  return normalise(text.slice(start + 1, end))
}

const problems = []

const args = process.argv.slice(2).filter((a) => !a.startsWith('--'))

for (const path of args.length ? args.map((f) => resolve(f)) : collect('.')) {
  const file = relative(root, path)
  const source = readFileSync(path, 'utf8')
  // A copy synced in by scripts/sync-pages.mjs is another repo's text: the
  // legal masters follow their own style rules and counsel's wording, and a
  // fix made here would be overwritten by the next sync.
  const front = source.match(/^---\n([\s\S]*?)\n---$/m)
  if (file.startsWith('src/content/pages/') && front && /^source: /m.test(front[1])) continue
  const text = strip(file, source)

  if (inCollections(file)) {
    for (const m of text.matchAll(/[—–]/g)) {
      problems.push([file, lineOf(text, m.index), 'em dash', sentenceAt(text, m.index)])
    }
  }

  for (const m of text.matchAll(/,\s+(and|or)\s/g)) {
    const sentence = sentenceAt(text, m.index)
    const head = sentence.slice(0, sentence.indexOf(normalise(m[0])))
    // No earlier comma means no series to close: this is two clauses joined,
    // or a two-item pair, both of which keep the comma.
    // Commas inside an aside or inside a number are not list commas.
    if (!/,/.test(head.replace(/\([^)]*\)/g, '').replace(/(\d),(\d)/g, '$1$2'))) continue
    if (allow.has(sentence)) {
      used.add(sentence)
      continue
    }
    problems.push([file, lineOf(text, m.index), `serial comma before "${m[1]}"`, sentence])
  }
}

// --json prints the flagged sentences alone, which is how prose-allow.json gets
// regenerated after a sweep. Read every line before you paste it in.
if (process.argv.includes('--json')) {
  console.log(JSON.stringify(problems.map((p) => p[3]), null, 2))
  process.exit(0)
}

// An entry nobody matched means the sentence was rewritten. The rewrite never got
// looked at, so the entry goes rather than silently covering whatever replaced it.
// Only meaningful over the whole corpus: a single-file run matches almost nothing.
const stale = args.length ? [] : [...allow].filter((a) => !used.has(a))

for (const [file, line, rule, sentence] of problems) {
  console.log(`${file}:${line}  ${rule}\n    ${sentence.slice(0, 160)}`)
}
for (const a of stale) {
  console.log(`scripts/prose-allow.json  stale entry, the sentence no longer exists\n    ${a.slice(0, 160)}`)
}
if (problems.length || stale.length) {
  console.log('')
  if (problems.length) {
    console.log(
      `${problems.length} problem(s). Drop the comma, or if the sentence is joining` +
        `\nclauses rather than closing a series, add it to scripts/prose-allow.json.`,
    )
  }
  if (stale.length) {
    console.log(`${stale.length} stale allowlist entry(s). Delete them.`)
  }
  process.exit(1)
}
console.log('prose ok')
