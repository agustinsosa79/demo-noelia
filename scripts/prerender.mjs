// Prerender (SSG): genera un HTML por ruta con el contenido y los metadatos
// ya resueltos, y el sitemap con las páginas indexables.
// Google: «server-side or pre-rendering is still a great idea because it makes
// your website faster for users and crawlers, and not all bots can run JavaScript».
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const template = fs.readFileSync(path.join(dist, 'index.html'), 'utf8');
const { render, prerenderRoutes, siteUrl } = await import(pathToFileURL(path.join(root, 'dist-ssr', 'entry-server.js')).href);

// Etiquetas que van al <head>. El JSON-LD queda en el body (válido para Google
// y necesario para que la hidratación coincida).
const HEAD_TAG = /<title>[\s\S]*?<\/title>|<meta\b[^>]*>|<link\b[^>]*rel="canonical"[^>]*>/g;

async function build(route, file) {
  const html = await render(route);
  const head = (html.match(HEAD_TAG) ?? []).join('\n    ');
  const body = html.replace(HEAD_TAG, '');
  const page = template
    .replace('<!--app-head-->', head)
    .replace('<div id="root">', `<div id="root" data-prerendered="${route}">`)
    .replace('<!--app-html-->', body);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, page);
  return head.match(/<title>(.*?)<\/title>/)?.[1] ?? '(sin título)';
}

for (const { path: route } of prerenderRoutes) {
  const file = route === '/' ? path.join(dist, 'index.html') : path.join(dist, route, 'index.html');
  const title = await build(route, file);
  // Copia /ruta.html: la usan servidores que no resuelven /ruta → /ruta/index.html (p. ej. vite preview).
  if (route !== '/') fs.copyFileSync(file, path.join(dist, `${route}.html`));
  console.log(`  ${route.padEnd(42)} ${title}`);
}
await build('/404', path.join(dist, '404.html'));

const today = new Date().toISOString().slice(0, 10);
const urls = prerenderRoutes
  .filter((r) => r.index)
  .map((r) => `  <url><loc>${siteUrl}${r.path === '/' ? '/' : r.path}</loc><lastmod>${today}</lastmod></url>`)
  .join('\n');
fs.writeFileSync(path.join(dist, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`);
console.log(`  sitemap.xml: ${prerenderRoutes.filter((r) => r.index).length} URLs`);
