import { useLocation } from 'react-router';
import { absoluteUrl, site } from '../../config/site';

interface SeoProps {
  /** <title>: descriptivo y conciso (Google Search Central, «title links»). */
  title: string;
  description: string;
  path?: string;
  image?: string;
  noindex?: boolean;
  jsonLd?: object | object[];
}

/**
 * Metadatos por página. En el navegador React 19 los eleva al <head>; en el
 * build, el prerender (scripts/prerender.mjs) los mueve al <head> del HTML
 * estático, así los buscadores reciben título, descripción y canonical sin
 * ejecutar JavaScript.
 */
export function Seo({ title, description, path, image = site.ogImage, noindex, jsonLd }: SeoProps) {
  const location = useLocation();
  const canonical = absoluteUrl(path ?? location.pathname);
  const fullTitle = title.includes(site.name) ? title : `${title} | ${site.name}`;
  return (
    <>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />
      {noindex && <meta name="robots" content="noindex, follow" />}
      <meta property="og:type" content="website" />
      <meta property="og:locale" content={site.locale} />
      <meta property="og:site_name" content={site.name} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={absoluteUrl(image)} />
      <meta name="twitter:card" content="summary_large_image" />
      {jsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />}
    </>
  );
}

/** Datos estructurados de la persona: solo información verificada. */
export const personJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  '@id': `${site.url}/#noelia`,
  name: 'Noelia Perucci',
  jobTitle: 'Personal trainer',
  description: 'Personal trainer certificada IFBB y Olympia. Atleta wellness NPC.',
  url: site.url,
  image: absoluteUrl('/media/noelia-tarima-npc-cordoba-cuadrada.webp'),
  sameAs: [site.contact.instagram, site.contact.youtube, site.contact.threads],
  hasCredential: site.credentials.map((c) => ({
    '@type': 'EducationalOccupationalCredential',
    name: c.title,
    recognizedBy: { '@type': 'Organization', name: c.issuer },
  })),
  address: { '@type': 'PostalAddress', addressCountry: 'AR' },
};

export const breadcrumbJsonLd = (items: { name: string; path: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.name, item: absoluteUrl(it.path) })),
});

export const faqJsonLd = (items: { q: string; a: string; confirmed: boolean }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: items
    .filter((f) => f.confirmed)
    .map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
});
