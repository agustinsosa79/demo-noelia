/**
 * Configuración central: identidad, contacto y navegación.
 * Planes y productos están en /shared (los usa también la API).
 */
export const site = {
  name: 'Noelia Perucci',
  /** Dominio definitivo: pendiente. Se usa en canonical, Open Graph y sitemap. */
  url: 'https://www.noeliaperucci.com.ar',
  locale: 'es_AR',
  /**
   * Ciudad para SEO local. Dejar en null hasta confirmarla con Noelia
   * (hipótesis: Rosario, por el prefijo 341). Cuando se complete, se suma a
   * títulos y descripciones de las páginas de entrenamiento.
   */
  city: null as string | null,
  ogImage: '/og-image.jpg',
  contact: {
    /** Publicado en su flyer de servicios. Validar que siga vigente. */
    whatsappNumber: '5493412818319',
    whatsappDisplay: '+54 9 341 281-8319',
    instagram: 'https://www.instagram.com/noelia_perucci/',
    instagramHandle: '@noelia_perucci',
    youtube: 'https://www.youtube.com/@noelia_perucci',
    threads: 'https://www.threads.com/@noelia_perucci',
  },
  /** Datos verificados públicamente (ART_DIRECTION.md §1). */
  credentials: [
    { title: 'Personal Trainer IFBB Internacional', issuer: 'IFBB', year: null },
    { title: 'Bodybuilding & Fitness Trainer', issuer: 'Academia Olympia Internacional', year: '2021' },
    { title: 'Atleta wellness', issuer: 'NPC Córdoba', year: null },
  ],
} as const;

export const nav = [
  { to: '/entrenamiento', label: 'Planes' },
  { to: '/tienda', label: 'Suplementos' },
  { to: '/sobre-noelia', label: 'Sobre Noelia' },
  { to: '/contacto', label: 'Contacto' },
] as const;

export const whatsappLink = (text: string) => `https://wa.me/${site.contact.whatsappNumber}?text=${encodeURIComponent(text)}`;

export const absoluteUrl = (path: string) => new URL(path, site.url).toString();
