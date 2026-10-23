import { useEffect, useRef, useState } from 'react';
import { NavLink, useParams, useSearchParams } from 'react-router';
import { CATEGORIES, findCategory, PRODUCTS, PRODUCT_SORTS, queryProducts, type ProductSort } from '@shared/catalog';
import { PageHeader } from '../components/layout/PageHeader';
import { ProductCard } from '../components/products/ProductCard';
import { breadcrumbJsonLd, faqJsonLd, Seo } from '../components/seo/Seo';
import { Accordion } from '../components/ui/Accordion';
import { Button } from '../components/ui/Button';
import { storeFaq } from '../content/faq';
import { pluralize } from '../lib/format';
import { gsap, prefersReducedMotion } from '../motion/gsap';
import { usePageMotion } from '../motion/usePageMotion';
import NotFoundPage from './NotFoundPage';

const SORT_LABELS: Record<ProductSort, string> = {
  destacados: 'Destacados',
  'precio-asc': 'Menor precio',
  'precio-desc': 'Mayor precio',
  nombre: 'Nombre (A-Z)',
};

export default function StorePage() {
  const { category: categorySlug } = useParams();
  const [params, setParams] = useSearchParams();
  const q = params.get('q') ?? '';
  const sortParam = params.get('orden') as ProductSort | null;
  const sort: ProductSort = sortParam && PRODUCT_SORTS.includes(sortParam) ? sortParam : 'destacados';
  const [term, setTerm] = useState(q);
  const category = categorySlug ? findCategory(categorySlug) : undefined;
  const products = queryProducts({ category: categorySlug, q, sort });
  const grid = useRef<HTMLDivElement>(null);
  const ref = useRef<HTMLDivElement>(null);
  usePageMotion(ref, [categorySlug]);

  // Búsqueda con espera corta: actualiza la URL (compartible) sin recargar.
  useEffect(() => {
    const id = window.setTimeout(() => {
      if (term.trim() === q) return;
      const next = new URLSearchParams(params);
      if (term.trim()) next.set('q', term.trim());
      else next.delete('q');
      setParams(next, { replace: true, preventScrollReset: true });
    }, 250);
    return () => window.clearTimeout(id);
  }, [term, q, params, setParams]);

  // Microinteracción: al filtrar, las tarjetas entran en cascada.
  const key = `${categorySlug}|${q}|${sort}`;
  useEffect(() => {
    if (!grid.current || prefersReducedMotion()) return;
    gsap.fromTo(grid.current.children, { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.05, overwrite: true });
  }, [key]);

  if (categorySlug && !category) return <NotFoundPage />;

  const title = category ? category.h1 : 'Suplementos deportivos';
  const chip =
    'inline-flex h-11 items-center rounded-full border border-line px-5 text-[0.95rem] whitespace-nowrap transition-colors hover:border-ink aria-[current=page]:border-ink aria-[current=page]:bg-ink aria-[current=page]:text-bone';

  return (
    <div ref={ref} key={categorySlug ?? 'todas'}>
      <Seo
        title={category ? `${category.h1}: precios y presentaciones` : 'Tienda de suplementos deportivos'}
        description={
          category
            ? `${category.description} Comprá online en la tienda de Noelia Perucci, personal trainer IFBB.`
            : 'Proteína en polvo, creatina, pre-entreno, vitaminas y accesorios. Comprá online en la tienda de Noelia Perucci, personal trainer IFBB.'
        }
        path={category ? `/tienda/categoria/${category.slug}` : '/tienda'}
        noindex={!!q}
        jsonLd={[
          breadcrumbJsonLd([
            { name: 'Inicio', path: '/' },
            { name: 'Suplementos', path: '/tienda' },
            ...(category ? [{ name: category.name, path: `/tienda/categoria/${category.slug}` }] : []),
          ]),
          faqJsonLd(storeFaq),
        ]}
      />
      <PageHeader
        title={title}
        crumbs={[{ name: 'Inicio', to: '/' }, ...(category ? [{ name: 'Suplementos', to: '/tienda' }, { name: category.name }] : [{ name: 'Suplementos' }])]}
        image="mancuerna-fondo-negro"
        lead={
          <>
            {category?.description ?? 'Proteínas, creatina, pre-entreno, vitaminas y accesorios para acompañar tu entrenamiento.'}
            <span className="mt-3 block text-sm text-fog">Catálogo de demostración: productos, fotos y precios ilustrativos.</span>
          </>
        }
      />

      <div className="sticky top-0 z-30 border-b border-line bg-bone/90 backdrop-blur-xl">
        <div className="container-site flex flex-col gap-3 py-4 lg:flex-row lg:items-center lg:justify-between">
          <nav aria-label="Categorías" data-lenis-prevent className="-mx-5 overflow-x-auto px-5 md:-mx-10 md:px-10 lg:mx-0 lg:px-0">
            <ul className="flex gap-2">
              <li>
                <NavLink to="/tienda" end preventScrollReset className={chip}>
                  Todos
                </NavLink>
              </li>
              {CATEGORIES.map((c) => (
                <li key={c.slug}>
                  <NavLink to={`/tienda/categoria/${c.slug}`} className={chip}>
                    {c.name}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
          <div className="flex gap-2">
            <label className="relative flex-1 lg:w-72 lg:flex-none">
              <span className="sr-only">Buscar suplementos</span>
              <svg aria-hidden="true" viewBox="0 0 20 20" className="absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted">
                <circle cx="8.5" cy="8.5" r="6" fill="none" stroke="currentColor" strokeWidth="1.6" />
                <path d="M13 13l5 5" stroke="currentColor" strokeWidth="1.6" />
              </svg>
              <input
                type="search"
                value={term}
                onChange={(e) => setTerm(e.target.value)}
                placeholder="Buscar: creatina, vainilla…"
                className="h-11 w-full rounded-full border border-line bg-white pr-4 pl-11 text-[0.95rem] focus:border-ink focus:outline-none"
              />
            </label>
            <label className="sr-only" htmlFor="sort">
              Ordenar por
            </label>
            <select
              id="sort"
              value={sort}
              onChange={(e) => {
                const next = new URLSearchParams(params);
                if (e.target.value === 'destacados') next.delete('orden');
                else next.set('orden', e.target.value);
                setParams(next, { replace: true, preventScrollReset: true });
              }}
              className="h-11 rounded-full border border-line bg-white px-4 text-[0.95rem] focus:border-ink focus:outline-none"
            >
              {PRODUCT_SORTS.map((s) => (
                <option key={s} value={s}>
                  {SORT_LABELS[s]}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <section aria-labelledby="results-title" className="container-site py-14 md:py-20">
        <h2 id="results-title" className="sr-only">
          Productos
        </h2>
        <p role="status" className="mb-8 label text-muted">
          {q ? `${pluralize(products.length, 'resultado', 'resultados')} para «${q}»` : pluralize(products.length, 'producto', 'productos')}
          {!q && !category && ` de ${PRODUCTS.length}`}
        </p>
        {products.length === 0 ? (
          <div className="rounded-3xl bg-white px-8 py-16 text-center">
            <p className="font-title text-2xl">No encontramos productos{q && ` para «${q}»`}.</p>
            <p className="mt-2 text-muted">Probá con otra palabra o mirá todas las categorías.</p>
            <Button
              variant="dark"
              className="mt-8"
              onClick={() => {
                setTerm('');
                setParams(new URLSearchParams(), { replace: true });
              }}
            >
              Ver todos los productos
            </Button>
          </div>
        ) : (
          <div ref={grid} className="grid grid-cols-2 gap-x-4 gap-y-12 md:gap-x-6 lg:grid-cols-4">
            {products.map((p, i) => (
              <ProductCard key={p.slug} product={p} priority={i < 4} />
            ))}
          </div>
        )}
      </section>

      <section aria-labelledby="store-faq" className="bg-sand section-y">
        <div className="container-site grid gap-12 lg:grid-cols-12">
          <h2 id="store-faq" data-split className="font-display text-title lg:col-span-4">
            Preguntas sobre las compras
          </h2>
          <div data-fade className="lg:col-span-8">
            <Accordion items={storeFaq} />
          </div>
        </div>
      </section>
    </div>
  );
}
