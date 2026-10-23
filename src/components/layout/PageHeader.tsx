import { useLayoutEffect, useRef, type ReactNode } from 'react';
import { Link } from 'react-router';
import { stock, type StockName } from '../../lib/media';
import { gsap, prefersReducedMotion, SplitText } from '../../motion/gsap';
import { releaseIntro } from '../../motion/intro';

/**
 * Encabezado de páginas internas: fondo oscuro con foto de ambiente, migas de
 * pan, H1 descriptivo (orientado a búsqueda) y una bajada corta.
 * Las rutas que lo usan declaran `handle: { darkHero: true }` para que el
 * header arranque transparente.
 */
export function PageHeader({
  title,
  lead,
  crumbs,
  image,
  children,
}: {
  title: string;
  lead?: ReactNode;
  crumbs?: { name: string; to?: string }[];
  image?: StockName;
  children?: ReactNode;
}) {
  const ref = useRef<HTMLElement>(null);
  useLayoutEffect(() => {
    if (!ref.current || prefersReducedMotion()) return;
    let split: SplitText | undefined;
    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(ref.current);
      split = SplitText.create(q('h1')[0], { type: 'lines', mask: 'lines' });
      gsap.from(split.lines, { yPercent: 110, duration: 1.2, stagger: 0.08, delay: 0.1 });
      gsap.from(q('[data-ph-in]'), { autoAlpha: 0, y: 20, duration: 1, stagger: 0.08, delay: 0.45 });
      gsap.fromTo(q('[data-ph-bg]'), { scale: 1.15 }, { scale: 1, duration: 2, ease: 'expo.out' });
    }, ref);
    releaseIntro();
    return () => {
      split?.revert();
      ctx.revert();
    };
  }, [title]);

  return (
    <section ref={ref} className="relative isolate overflow-hidden bg-ink text-bone">
      {image && (
        <div aria-hidden="true" className="absolute inset-0 -z-10">
          <img data-ph-bg {...stock(image)} sizes="100vw" alt="" fetchPriority="high" className="h-full w-full object-cover opacity-35" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/60 to-ink/40" />
        </div>
      )}
      <div className="container-site pt-36 pb-16 md:pt-44 md:pb-20">
        {crumbs && (
          <nav data-ph-in aria-label="Ruta de navegación" className="mb-8">
            <ol className="flex flex-wrap items-center gap-2 label text-fog">
              {crumbs.map((c, i) => (
                <li key={c.name} className="flex items-center gap-2">
                  {i > 0 && <span aria-hidden="true">/</span>}
                  {c.to ? (
                    <Link to={c.to} className="hover:text-bone">
                      {c.name}
                    </Link>
                  ) : (
                    <span aria-current="page" className="text-bone">
                      {c.name}
                    </span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}
        {/* key: SplitText reemplaza los nodos de texto; al cambiar el título se remonta el H1. */}
        <h1 key={title} data-intro className="max-w-5xl font-display text-display">
          {title}
        </h1>
        {lead && (
          <div data-ph-in className="mt-8 max-w-2xl text-lead text-bone/75">
            {lead}
          </div>
        )}
        {children && (
          <div data-ph-in className="mt-10">
            {children}
          </div>
        )}
      </div>
    </section>
  );
}
