#!/usr/bin/env node
// Copies the documents behind /legal/ in from the repo that owns them, so the
// site renders the master text rather than a retelling of it.
//
//   node scripts/sync-pages.mjs     expects copperhead-legal beside this repo
//
// The masters are drafted, reviewed and versioned in copperhead-legal. That
// repo is not there when Cloudflare builds this site, so the copies in
// src/content/pages are committed. This script is what keeps them copies:
// edit the master, re-run, commit both. Each file is rewritten whole except
// its `draft` flag, which is read back from the copy already here, so a page
// signed off on this site stays signed off across a re-sync and a new one
// arrives as a draft.
//
// What changes on the way in: the template header and footer go (the title,
// the status line under the subtitle, the counsel footer), the date and
// description move into frontmatter, references to the other published
// document become links and tables get the wrapper that lets them scroll on a
// phone. The bracketed placeholders stay: they are what the route counts to
// decide whether an entry may leave draft.

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const sibling = (p) => join(root, '..', p)
const out = join(root, 'src/content/pages')

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July',
  'August', 'September', 'October', 'November', 'December']

const DOCS = [
  {
    file: 'privacy.md',
    from: 'copperhead-legal/product/Copperhead_Privacy_Policy_revB.md',
    kind: 'Legal',
    title: 'Privacy Policy',
    path: '/legal/privacy/',
  },
  {
    file: 'terms.md',
    from: 'copperhead-legal/product/Copperhead_Terms_of_Service_revB.md',
    kind: 'Legal',
    title: 'Terms of Service',
    path: '/legal/terms/',
  },
]

// The two documents name each other in prose ("the Privacy Policy describes").
// The first mention of the other one in each body becomes a link to it.
const LINKS = {
  'Privacy Policy': '/legal/privacy/',
  'Terms of Service': '/legal/terms/',
}

function fail(msg) {
  console.error(`sync-pages: ${msg}`)
  process.exit(1)
}

// "14 September 2026" -> "2026-09-14"
function isoDate(text) {
  const m = text.match(/^(\d{1,2}) (\w+) (\d{4})$/)
  const month = m && MONTHS.indexOf(m[2])
  if (!m || month < 0) fail(`cannot read a date from "${text}"`)
  return `${m[3]}-${String(month + 1).padStart(2, '0')}-${m[1].padStart(2, '0')}`
}

// copperhead-legal: title, subtitle, status line, revision line, a rule, then
// the body, then the counsel footer.
function legal(src, from) {
  const lines = src.split('\n')
  const rule = lines.indexOf('---')
  if (rule < 0) fail(`${from}: no '---' under the header`)
  const header = lines.slice(0, rule).join('\n')
  const date = header.match(/Revision [A-Z], (\d{1,2} \w+ \d{4})/)
  if (!date) fail(`${from}: no "Revision X, <date>" line in the header`)
  // The line under the bold document name says what the document covers.
  const name = lines.findIndex((l) => /^\*\*[^*]+\*\*$/.test(l))
  const description = name >= 0 ? lines[name + 1].trim() : ''
  if (!description) fail(`${from}: no subtitle line under the bold document name`)
  const body = lines
    .slice(rule + 1)
    .filter((l) => !l.startsWith('*This template is provided'))
    .join('\n')
  return { updated: isoDate(date[1]), description: `${description}.`, body }
}

// A table too wide for a phone scrolls inside a <div data-bleed-ok>, the
// site's convention for intended overflow (global.css, scripts/shots.mjs). The
// masters are plain markdown, so the wrapper goes on here rather than there.
function wrapTables(md) {
  return md.replace(/(^\|.*\|[ \t]*\n)+/gm, (table) => `<div data-bleed-ok>\n\n${table}\n</div>\n`)
}

function link(md, self) {
  for (const [name, href] of Object.entries(LINKS)) {
    if (href !== self) md = md.replace(name, `[${name}](${href})`)
  }
  return md
}

// Whatever this site has already decided about the entry.
function draftFlag(file) {
  const path = join(out, file)
  if (!existsSync(path)) return true
  const m = readFileSync(path, 'utf8').match(/^draft: (true|false)$/m)
  return m ? m[1] === 'true' : true
}

mkdirSync(out, { recursive: true })

for (const doc of DOCS) {
  const from = sibling(doc.from)
  if (!existsSync(from)) fail(`${doc.from} not found beside this repo`)
  const src = readFileSync(from, 'utf8')
  const { updated, description, body } = legal(src, doc.from)
  const front = [
    '---',
    `title: ${JSON.stringify(doc.title)}`,
    `description: ${JSON.stringify(description)}`,
    `path: ${doc.path}`,
    `kind: ${doc.kind}`,
    `updated: ${updated}`,
    `draft: ${draftFlag(doc.file)}`,
    `source: ${doc.from}`,
    '---',
  ].join('\n')
  writeFileSync(join(out, doc.file), `${front}\n\n${wrapTables(link(body, doc.path)).trim()}\n`)
  console.log(`${doc.file.padEnd(12)} <- ${doc.from} (${updated})`)
}
