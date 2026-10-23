import { useRef, useState } from 'react';
import { Link } from 'react-router';
import { findCategory } from '@shared/catalog';
import type { Product } from '@shared/types';
import { useCart } from '../../cart/CartContext';
import { formatPrice } from '../../lib/format';
import { flyToCart } from '../../motion/micro';

/**
 * Tarjeta de producto: foto sobre blanco, nombre, presentación y precio.
 * Microinteracciones: zoom suave de la foto, botón de compra rápida que
 * aparece al pasar el mouse (siempre visible en pantallas táctiles) y la foto
 * que «vuela» al carrito al agregar.
 */
export function ProductCard({ product, priority = false }: { product: Product; priority?: boolean }) {
  const { add } = useCart();
  const img = useRef<HTMLImageElement>(null);
  const [added, setAdded] = useState(false);
  const category = findCategory(product.categorySlug);
  const needsFlavor = product.flavors.length > 0;

  const quickAdd = () => {
    add(product, 1, null);
    flyToCart(img.current);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1600);
  };

  return (
    <article className="group relative">
      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-shelf">
        <img
          ref={img}
          src={product.image.src}
          alt={product.image.alt}
          width={720}
          height={720}
          loading={priority ? 'eager' : 'lazy'}
          className="absolute inset-0 h-full w-full object-contain p-[12%] mix-blend-multiply transition-transform duration-700 ease-(--ease-out-expo) group-hover:scale-[1.06]"
        />
        {!product.inStock && <span className="absolute top-4 left-4 rounded-full bg-ink px-3 py-1 label text-bone">Sin stock</span>}
        <div className="absolute inset-x-4 bottom-4 flex justify-end transition-all duration-500 ease-(--ease-out-expo) [@media(hover:hover)]:translate-y-3 [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-focus-within:translate-y-0 [@media(hover:hover)]:group-focus-within:opacity-100 [@media(hover:hover)]:group-hover:translate-y-0 [@media(hover:hover)]:group-hover:opacity-100">
          {product.inStock &&
            (needsFlavor ? (
              <Link to={`/producto/${product.slug}`} className="relative z-10 inline-flex h-10 items-center rounded-full bg-ink px-4 text-sm text-bone hover:bg-rose">
                Elegir sabor
              </Link>
            ) : (
              <button
                type="button"
                onClick={quickAdd}
                className="relative z-10 inline-flex h-10 items-center gap-2 rounded-full bg-ink px-4 text-sm text-bone transition-colors hover:bg-rose"
                aria-label={`Agregar ${product.name} al carrito`}
              >
                {added ? 'Agregado ✓' : 'Agregar +'}
              </button>
            ))}
        </div>
      </div>
      <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
        <div className="min-w-0">
          <h3 className="font-title text-[1.05rem] leading-snug">
            <Link to={`/producto/${product.slug}`} className="after:absolute after:inset-0 after:rounded-2xl focus-visible:outline-none">
              {product.name}
            </Link>
          </h3>
          <p className="mt-1 text-sm text-muted">
            {category?.name}
            {needsFlavor && ` · ${product.flavors.length} sabores`}
          </p>
        </div>
        <p className="font-mono text-[0.95rem] whitespace-nowrap">{formatPrice(product.price)}</p>
      </div>
      <span aria-hidden="true" className="pointer-events-none absolute -inset-2 rounded-3xl group-has-[a:focus-visible]:outline-2 group-has-[a:focus-visible]:outline-rose" />
    </article>
  );
}
