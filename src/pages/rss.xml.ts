import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { site } from '../config';
import { postPath } from '../blog';
import { articlePath } from '../research';

// The feed, written out by hand: RSS 2.0 is thirty lines of XML, which is
// less than the dependency that would otherwise generate it. Posts and
// research articles share it, newest first, because a reader who subscribes
// wants to hear about either.
const esc = (s: string) =>
  s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

export const GET: APIRoute = async () => {
  const items = [
    ...(await getCollection('blog')).map((p) => ({
      path: postPath(p.id),
      title: p.data.title,
      description: p.data.description,
      date: p.data.date,
      category: p.data.kind,
    })),
    ...(await getCollection('research')).map((a) => ({
      path: articlePath(a.id),
      title: a.data.title,
      description: a.data.description,
      date: a.data.date,
      category: 'Research',
    })),
  ].sort((a, b) => b.date.valueOf() - a.date.valueOf());

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Copperhead: AI for PCB design</title>
    <link>${site}/</link>
    <atom:link href="${site}/rss.xml" rel="self" type="application/rss+xml" />
    <description>Posts and research from Copperhead, the open source AI agent for PCB design in KiCad.</description>
    <language>en</language>${
      items[0] ? `\n    <lastBuildDate>${items[0].date.toUTCString()}</lastBuildDate>` : ''
    }
${items
  .map((i) => {
    const url = new URL(i.path, site).href;
    return `    <item>
      <title>${esc(i.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${i.date.toUTCString()}</pubDate>
      <category>${esc(i.category)}</category>
      <description>${esc(i.description)}</description>
    </item>`;
  })
  .join('\n')}
  </channel>
</rss>
`;

  return new Response(body, {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
  });
};
