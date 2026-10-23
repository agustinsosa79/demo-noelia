import { useEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router';
import { CartDrawer } from '../../cart/CartDrawer';
import { gsap, prefersReducedMotion, ScrollTrigger } from '../../motion/gsap';
import { SmoothScroll, useSmoothScroll } from '../../motion/SmoothScroll';
import { Footer } from './Footer';
import { Header } from './Header';

function RouteEffects({ main }: { main: React.RefObject<HTMLElement | null> }) {
  const { pathname, hash } = useLocation();
  const { scrollTo } = useSmoothScroll();
  const first = useRef(true);

  useEffect(() => {
    if (hash) {
      // Esperar a que la página nueva esté en el DOM.
      const id = window.setTimeout(() => scrollTo(hash, { offset: -90 }), 60);
      return () => window.clearTimeout(id);
    }
    scrollTo(0, { immediate: true });
    // Transición de entrada entre páginas (no en la primera carga).
    if (!first.current && main.current && !prefersReducedMotion()) {
      gsap.fromTo(main.current, { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.8, clearProps: 'transform' });
    }
    first.current = false;
    const t = window.setTimeout(() => ScrollTrigger.refresh(), 250);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, hash]);
  return null;
}

export function Layout() {
  const main = useRef<HTMLElement>(null);
  return (
    <SmoothScroll>
      <a href="#contenido" className="sr-only z-[60] rounded-full bg-rose px-5 py-3 font-medium text-white focus:not-sr-only focus:fixed focus:top-4 focus:left-4">
        Saltar al contenido
      </a>
      <Header />
      <main id="contenido" ref={main} tabIndex={-1} className="focus:outline-none">
        <Outlet />
      </main>
      <Footer />
      <CartDrawer />
      <RouteEffects main={main} />
    </SmoothScroll>
  );
}
