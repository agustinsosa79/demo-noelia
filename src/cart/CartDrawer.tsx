import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router';
import { ButtonLink } from '../components/ui/Button';
import { formatPrice, pluralize } from '../lib/format';
import { gsap, prefersReducedMotion } from '../motion/gsap';
import { useSmoothScroll } from '../motion/SmoothScroll';
import { useCart } from './CartContext';
import { CartLines } from './CartLines';

/**
 * Carrito lateral sobre <dialog> nativo (foco atrapado, Esc y fondo inerte).
 * Baymard: después de agregar, mostrar el carrito con el resumen y el paso
 * siguiente claro; acá se abre solo cuando la persona lo pide, y el ícono del
 * header confirma cada agregado con una animación.
 */
export function CartDrawer() {
  const { isOpen, close, lines, count, subtotal } = useCart();
  const ref = useRef<HTMLDialogElement>(null);
  const { pathname } = useLocation();
  const { lenis } = useSmoothScroll();

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (isOpen && !d.open) {
      d.showModal();
      lenis?.stop();
      if (!prefersReducedMotion()) {
        gsap.fromTo(d, { xPercent: 100 }, { xPercent: 0, duration: 0.7, ease: 'expo.out' });
        gsap.from(d.querySelectorAll('li'), { autoAlpha: 0, x: 30, stagger: 0.05, delay: 0.2, duration: 0.6 });
      }
    } else if (!isOpen && d.open) {
      const done = () => {
        d.close();
        lenis?.start();
      };
      if (prefersReducedMotion()) done();
      else gsap.to(d, { xPercent: 100, duration: 0.45, ease: 'expo.in', onComplete: done });
    }
  }, [isOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => close(), [pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <dialog
      ref={ref}
      aria-labelledby="cart-title"
      data-lenis-prevent
      onCancel={(e) => {
        e.preventDefault();
        close();
      }}
      onClick={(e) => e.target === ref.current && close()}
      className="m-0 ml-auto h-dvh max-h-dvh w-full max-w-[28rem] bg-bone p-0 text-ink backdrop:bg-ink/50 backdrop:backdrop-blur-sm open:flex open:flex-col"
    >
      <header className="flex items-center justify-between px-6 py-6">
        <h2 id="cart-title" className="font-display text-3xl">
          Carrito <span className="font-mono text-sm text-muted normal-case">({pluralize(count, 'producto', 'productos')})</span>
        </h2>
        <button type="button" onClick={close} className="grid size-11 place-items-center rounded-full bg-ink/6 transition-colors hover:bg-ink hover:text-bone" aria-label="Cerrar carrito">
          <svg viewBox="0 0 14 14" className="size-3.5" aria-hidden="true">
            <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.6" />
          </svg>
        </button>
      </header>
      {lines.length === 0 ? (
        <div className="flex flex-1 flex-col justify-center gap-4 px-6 pb-16">
          <p className="font-title text-2xl">Tu carrito está vacío.</p>
          <p className="text-muted">Los planes de entrenamiento no se compran acá: se piden directamente a Noelia.</p>
          <div className="mt-2">
            <ButtonLink to="/tienda" variant="dark">
              Ver suplementos
            </ButtonLink>
          </div>
        </div>
      ) : (
        <>
          <div className="flex-1 overflow-y-auto px-6">
            <CartLines onNavigate={close} />
          </div>
          <footer className="space-y-4 border-t border-line px-6 py-6">
            <div className="flex items-baseline justify-between">
              <span className="text-muted">Subtotal</span>
              <span className="font-mono text-xl">{formatPrice(subtotal)}</span>
            </div>
            <p className="text-sm text-muted">El envío se coordina al confirmar el pedido.</p>
            <ButtonLink to="/checkout" variant="primary" size="lg" className="w-full justify-between">
              Finalizar compra
            </ButtonLink>
          </footer>
        </>
      )}
    </dialog>
  );
}
