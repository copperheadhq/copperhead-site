#!/usr/bin/env node
// House style gate for the blog and research collections. Two rules, both from
// .claude/skills/blog-post/SKILL.md: no em dashes, and no serial comma.
//
// Usage: node scripts/lint-prose.mjs [files...]   (defaults to both collections)
//
// The serial comma test is a heuristic, because "x, and y" is a serial comma
// only when the sentence is running a series. The same shape joins two
// independent clauses, which the house style keeps. So the check flags a
// comma before and/or only when the sentence already has an earlier comma
// doing list work, and anything it gets wrong lives in prose-allow.json next
// to this file, one entry per accepted sentence.

import { readFileSync, readdirSync } from 'node:fs'
import { join, dirname, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const root = join(here, '..')
const COLLECTIONS = ['src/content/blog', 'src/content/research']
const allowPath = join(here, 'prose-allow.json')
const allow = new Set(JSON.parse(readFileSync(allowPath, 'utf8')).allow.map(normalise))
const used = new Set()

function normalise(s) {
  return s.replace(/\s+/g, ' ').trim()
}

// Recursive, because the collections are loaded with a `**/*.{md,mdx}` glob
// (src/content.config.ts). Walking one level deep would let a post in a
// subdirectory publish unlinted while CI still printed "prose ok".
function collect(dir) {
  const out = []
  for (const e of readdirSync(join(root, dir), { withFileTypes: true })) {
    if (e.isDirectory()) out.push(...collect(join(dir, e.name)))
    else if (e.name.endsWith('.md') || e.name.endsWith('.mdx'))
      out.push(join(root, dir, e.name))
  }
  return out
}

// Everything the rules do not apply to: fenced code, inline code, frontmatter
// keys that are not prose, JSX attributes, link targets, import lines. Replaced
// with spaces rather than deleted so line numbers and offsets survive.
function blank(text, re) {
  return text.replace(re, (m) => m.replace(/[^\n]/g, ' '))
}

function strip(source) {
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

function lineOf(text, index) {
  return text.slice(0, index).split('\n').length
}

// The sentence around an offset, used both as the unit the heuristic reasons
// over and as the allowlist key.
function sentenceAt(text, index) {
  let start = Math.max(text.lastIndexOf('\n\n', index), text.lastIndexOf(': ', index))
  for (const m of text.slice(0, index).matchAll(/[.!?]['"\u2019\u201d]?(\s|$)/g)) {
    if (m.index > start) start = m.index
  }
  let end = text.length
  for (const m of text.slice(index).matchAll(/[.!?]['"\u2019\u201d]?(\s|$)/g)) {
    end = index + m.index + 1
    break
  }
  return normalise(text.slice(start + 1, end))
}

const problems = []

const args = process.argv.slice(2).filter((a) => !a.startsWith('--'))

for (const path of args.length ? args.map((f) => resolve(f)) : COLLECTIONS.flatMap(collect)) {
  const file = relative(root, path)
  const source = readFileSync(path, 'utf8')
  const text = strip(source)

  for (const m of text.matchAll(/[—–]/g)) {
    problems.push([file, lineOf(text, m.index), 'em dash', sentenceAt(text, m.index)])
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
