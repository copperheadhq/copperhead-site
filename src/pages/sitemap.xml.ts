import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { site } from '../config';
import { postPath } from '../blog';
import { articlePath } from '../research';

// Generated rather than kept in public/, so a new post cannot be forgotten here.
export const GET: APIRoute = async () => {
  const posts = await getCollection('blog');
  const articles = await getCollection('research');

  const urls = [
    { loc: '/', changefreq: 'weekly', priority: '1.0' },
    { loc: '/pricing/', changefreq: 'monthly', priority: '0.9' },
    { loc: '/blog/', changefreq: 'weekly', priority: '0.8' },
    { loc: '/research/', changefreq: 'monthly', priority: '0.8' },
    { loc: '/blog/faq/', changefreq: 'monthly', priority: '0.7' },
    // Redrawn on every scheduled rebuild, so it changes more often than anything
    // else here even though the page itself rarely does.
    { loc: '/stats/', changefreq: 'daily', priority: '0.5' },
    // Its content is live in the browser; the page itself hardly changes.
    { loc: '/status/', changefreq: 'monthly', priority: '0.5' },
    ...posts.map((p) => ({
      loc: postPath(p.id),
      changefreq: 'monthly',
      priority: '0.6',
      lastmod: p.data.date.toISOString().slice(0, 10),
    })),
    ...articles.map((a) => ({
      loc: articlePath(a.id),
      changefreq: 'monthly',
      priority: '0.7',
      lastmod: a.data.date.toISOString().slice(0, 10),
    })),
  ];

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${new URL(u.loc, site).href}</loc>${
      'lastmod' in u ? `\n    <lastmod>${u.lastmod}</lastmod>` : ''
    }
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`,
  )
  .join('\n')}
</urlset>
`;

  return new Response(body, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
