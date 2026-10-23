import { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router';
import { findCategory, findProduct, PRODUCTS } from '@shared/catalog';
import { useCart } from '../cart/CartContext';
import { ProductCard } from '../components/products/ProductCard';
import { QuantityStepper } from '../components/products/QuantityStepper';
import { breadcrumbJsonLd, Seo } from '../components/seo/Seo';
import { Button, ButtonLink } from '../components/ui/Button';
import { ChoiceGroup } from '../components/ui/Fields';
import { formatPrice } from '../lib/format';
import { gsap, prefersReducedMotion } from '../motion/gsap';
import { flyToCart } from '../motion/micro';
import { usePageMotion } from '../motion/usePageMotion';
import NotFoundPage from './NotFoundPage';

export default function ProductPage() {
  const { slug = '' } = useParams();
  const product = findProduct(slug);
  const { add, open } = useCart();
  const [flavor, setFlavor] = useState<string | null>(null);
  const [qty, setQty] = useState(1);
  const [flavorError, setFlavorError] = useState(false);
  const [added, setAdded] = useState(false);
  const img = useRef<HTMLImageElement>(null);
  const ref = useRef<HTMLDivElement>(null);
  usePageMotion(ref, [slug]);

  useEffect(() => {
    setFlavor(null);
    setQty(1);
    setFlavorError(false);
    setAdded(false);
    if (img.current && !prefersReducedMotion()) {
      gsap.fromTo(img.current, { y: 40, autoAlpha: 0, scale: 0.94 }, { y: 0, autoAlpha: 1, scale: 1, duration: 1.2, ease: 'expo.out' });
    }
  }, [slug]);

  if (!product) return <NotFoundPage />;
  const category = findCategory(product.categorySlug);
  const needsFlavor = product.flavors.length > 0;
  const related = PRODUCTS.filter((p) => p.slug !== product.slug && p.inStock)
    .sort((a, b) => Number(b.categorySlug === product.categorySlug) - Number(a.categorySlug === product.categorySlug))
    .slice(0, 4);

  function onAdd() {
    if (!product) return;
    if (needsFlavor && !flavor) {
      setFlavorError(true);
      document.querySelector<HTMLInputElement>('input[name="flavor"]')?.focus();
      return;
    }
    add(product, qty, flavor);
    flyToCart(img.current);
    setAdded(true);
  }

  return (
    <div ref={ref} key={slug}>
      <Seo
        title={`${product.name}${category ? ` · ${category.name}` : ''}`}
        description={`${product.shortDescription} ${product.size}. Comprá online en la tienda de Noelia Perucci.`}
        path={`/producto/${product.slug}`}
        image={product.image.src}
        // Fichas de demostración: no se indexan hasta tener el catálogo real (entonces se suman datos estructurados Product).
        noindex={product.isDemo}
        jsonLd={breadcrumbJsonLd([
          { name: 'Suplementos', path: '/tienda' },
          ...(category ? [{ name: category.name, path: `/tienda/categoria/${category.slug}` }] : []),
          { name: product.name, path: `/producto/${product.slug}` },
        ])}
      />
      <div className="container-site pt-28 pb-20 md:pt-32">
        <nav aria-label="Ruta de navegación" className="mb-8">
          <ol className="flex flex-wrap items-center gap-2 label text-muted">
            <li>
              <Link to="/tienda" className="hover:text-ink">
                Suplementos
              </Link>
            </li>
            {category && (
              <>
                <li aria-hidden="true">/</li>
                <li>
                  <Link to={`/tienda/categoria/${category.slug}`} className="hover:text-ink">
                    {category.name}
                  </Link>
                </li>
              </>
            )}
          </ol>
        </nav>

        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <div className="relative grid aspect-square place-items-center overflow-hidden rounded-3xl bg-shelf lg:sticky lg:top-28">
              <img ref={img} src={product.image.src} alt={product.image.alt} width={720} height={720} className="w-[78%] object-contain mix-blend-multiply" />
              {product.isDemo && <span className="absolute bottom-5 left-5 label text-fog">Foto de ejemplo</span>}
            </div>
          </div>

          <div className="lg:col-span-5">
            <p className="label text-muted">{category?.name}</p>
            <h1 className="mt-3 font-display text-title">{product.name}</h1>
            <p className="mt-4 text-muted">{product.shortDescription}</p>
            <p className="mt-8 flex items-baseline gap-3">
              <span className="font-mono text-3xl">{formatPrice(product.price)}</span>
              {product.isDemo && <span className="text-sm text-muted">Precio de ejemplo</span>}
            </p>

            <div className="mt-10 space-y-8 border-t border-line pt-8">
              {needsFlavor && (
                <div>
                  <ChoiceGroup
                    legend="Sabor"
                    name="flavor"
                    value={flavor}
                    onChange={(f) => {
                      setFlavor(f);
                      setFlavorError(false);
                    }}
                    options={product.flavors.map((f) => ({ value: f, label: f }))}
                  />
                  {flavorError && (
                    <p role="alert" className="mt-3 text-sm text-danger">
                      Elegí un sabor para agregarlo al carrito.
                    </p>
                  )}
                </div>
              )}
              <div className="flex flex-wrap items-center gap-3">
                <QuantityStepper label="Cantidad" value={qty} onChange={setQty} />
                <Button variant="primary" size="lg" className="flex-1 justify-between" onClick={onAdd} disabled={!product.inStock} arrow={product.inStock}>
                  {product.inStock ? `Agregar al carrito · ${formatPrice(product.price * qty)}` : 'Sin stock'}
                </Button>
              </div>
              {added && (
                <div role="status" className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-white px-5 py-4">
                  <span className="text-[0.95rem]">✓ Agregado al carrito.</span>
                  <span className="flex gap-4 text-[0.95rem]">
                    <button type="button" onClick={open} className="font-medium underline underline-offset-4">
                      Ver carrito
                    </button>
                    <Link to="/checkout" className="font-medium underline underline-offset-4">
                      Finalizar compra
                    </Link>
                  </span>
                </div>
              )}
              {!product.inStock && <p className="text-sm text-muted">Este producto no tiene stock en este momento.</p>}
            </div>

            <dl className="mt-12 divide-y divide-line border-y border-line text-[0.95rem]">
              {product.specs.map((s) => (
                <div key={s.label} className="flex justify-between gap-6 py-4">
                  <dt className="text-muted">{s.label}</dt>
                  <dd className="text-right">{s.value}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-8 text-muted">{product.description}</p>
            <p className="mt-6 rounded-2xl bg-sand px-5 py-4 text-sm text-muted">
              Los suplementos dietarios no reemplazan una alimentación variada. Si tenés una condición de salud, estás embarazada o tomás medicación,
              consultá con un profesional antes de usarlos.
            </p>
            <div className="mt-10 rounded-3xl bg-ink p-7 text-bone">
              <p className="font-title text-xl">¿Querés un plan que acompañe lo que tomás?</p>
              <p className="mt-2 text-fog">La asesoría integral de Noelia incluye un plan nutricional personalizado.</p>
              <div className="mt-6">
                <ButtonLink to="/entrenamiento/asesoria-integral" variant="light">
                  Ver la asesoría
                </ButtonLink>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section aria-labelledby="related-title" className="bg-sand section-y">
        <div className="container-site">
          <h2 id="related-title" data-split className="font-display text-title">
            También te puede servir
          </h2>
          <div className="mt-12 grid grid-cols-2 gap-x-4 gap-y-12 md:gap-x-6 lg:grid-cols-4">
            {related.map((p) => (
              <div key={p.slug} data-fade>
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
