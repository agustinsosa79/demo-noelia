import { useCart } from '../cart/CartContext';
import { CartLines } from '../cart/CartLines';
import { Seo } from '../components/seo/Seo';
import { ButtonLink } from '../components/ui/Button';
import { formatPrice, pluralize } from '../lib/format';

export default function CartPage() {
  const { lines, count, subtotal } = useCart();
  return (
    <div className="container-site pt-32 pb-24 md:pt-40">
      <Seo title="Carrito" description="Tu carrito de compras." noindex />
      <h1 className="font-display text-display">Carrito</h1>
      <p className="mt-3 label text-muted">{pluralize(count, 'producto', 'productos')}</p>
      {lines.length === 0 ? (
        <div className="mt-12 max-w-xl rounded-3xl bg-white p-10">
          <p className="font-title text-2xl">Tu carrito está vacío.</p>
          <p className="mt-2 text-muted">Los planes de entrenamiento no se compran acá: se piden directamente a Noelia.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink to="/tienda" variant="dark">
              Ver suplementos
            </ButtonLink>
            <ButtonLink to="/entrenamiento" variant="outline">
              Ver planes
            </ButtonLink>
          </div>
        </div>
      ) : (
        <div className="mt-12 grid gap-12 lg:grid-cols-12">
          <div className="border-t border-line lg:col-span-7">
            <CartLines />
          </div>
          <aside aria-label="Resumen" className="lg:col-span-4 lg:col-start-9">
            <div className="space-y-5 rounded-3xl bg-white p-7 lg:sticky lg:top-28">
              <div className="flex items-baseline justify-between">
                <span className="text-muted">Subtotal</span>
                <span className="font-mono text-2xl">{formatPrice(subtotal)}</span>
              </div>
              <p className="text-sm text-muted">El envío se coordina al confirmar el pedido.</p>
              <ButtonLink to="/checkout" variant="primary" size="lg" className="w-full justify-between">
                Finalizar compra
              </ButtonLink>
              <ButtonLink to="/tienda" variant="text" arrow={false}>
                Seguir comprando
              </ButtonLink>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
