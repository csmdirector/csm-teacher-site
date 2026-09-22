import { getCollection } from 'astro:content';

export async function GET() {
  const articles = await getCollection('teacher-resources', ({ data }) =>
    data.status === 'published' && data.visibility === 'public' && !data.noindex
  );
  const routes = ['/', '/about/', '/facilities/', '/why-csm/', '/teaching-opportunities/',
    '/music-teacher-jobs-cincinnati/', '/piano-teacher-jobs-cincinnati',
    '/voice-teacher-jobs-cincinnati', '/guitar-teacher-jobs-cincinnati',
    '/violin-teacher-jobs-cincinnati', '/drum-teacher-jobs-cincinnati', '/resources/',
    ...articles.map((article) => article.data.canonicalPath || `/resources/${article.id}/`)];
  const escape = (value: string) => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
  return new Response(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${routes.map((route) => `<url><loc>${escape(new URL(route, 'https://cincinnatimusicteacher.com').href)}</loc></url>`).join('\n')}\n</urlset>\n`, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
}
