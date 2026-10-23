import { gsap, isFinePointer, prefersReducedMotion } from './gsap';

/**
 * Botón magnético: el elemento sigue levemente al puntero (solo mouse/trackpad).
 * Devuelve una función de limpieza.
 */
export function magnetic(el: HTMLElement, strength = 0.28) {
  if (!isFinePointer() || prefersReducedMotion()) return () => {};
  const xTo = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'elastic.out(1, 0.4)' });
  const yTo = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'elastic.out(1, 0.4)' });
  const move = (e: PointerEvent) => {
    const r = el.getBoundingClientRect();
    xTo((e.clientX - (r.left + r.width / 2)) * strength);
    yTo((e.clientY - (r.top + r.height / 2)) * strength);
  };
  const leave = () => {
    xTo(0);
    yTo(0);
  };
  el.addEventListener('pointermove', move);
  el.addEventListener('pointerleave', leave);
  return () => {
    el.removeEventListener('pointermove', move);
    el.removeEventListener('pointerleave', leave);
    gsap.set(el, { x: 0, y: 0 });
  };
}

/**
 * «Vuela al carrito»: una copia de la imagen del producto viaja hasta el
 * botón del carrito. Confirma visualmente que el producto se agregó.
 */
export function flyToCart(source: HTMLElement | null) {
  const target = document.querySelector<HTMLElement>('[data-cart-target]');
  if (!source || !target || prefersReducedMotion()) return;
  const from = source.getBoundingClientRect();
  const to = target.getBoundingClientRect();
  const ghost = source.cloneNode(true) as HTMLElement;
  Object.assign(ghost.style, {
    position: 'fixed',
    left: `${from.left}px`,
    top: `${from.top}px`,
    width: `${from.width}px`,
    height: `${from.height}px`,
    zIndex: '90',
    pointerEvents: 'none',
    borderRadius: '12px',
    overflow: 'hidden',
  });
  document.body.appendChild(ghost);
  const dx = to.left + to.width / 2 - (from.left + from.width / 2);
  const dy = to.top + to.height / 2 - (from.top + from.height / 2);
  gsap
    .timeline({ onComplete: () => ghost.remove() })
    .to(ghost, { x: dx, duration: 0.75, ease: 'power2.inOut' }, 0)
    .to(ghost, { y: dy, duration: 0.75, ease: 'back.in(1.2)' }, 0)
    .to(ghost, { scale: 0.08, opacity: 0.4, duration: 0.75, ease: 'power3.in' }, 0);
}
