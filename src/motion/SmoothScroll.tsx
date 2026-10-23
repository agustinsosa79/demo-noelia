import Lenis from 'lenis';
import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { gsap, prefersReducedMotion, ScrollTrigger } from './gsap';

interface ScrollApi {
  lenis: Lenis | null;
  /** Scroll a un elemento o posición, con Lenis si está activo. */
  scrollTo: (target: string | number | HTMLElement, opts?: { offset?: number; immediate?: boolean }) => void;
}

const ScrollContext = createContext<ScrollApi>({ lenis: null, scrollTo: () => {} });

/**
 * Scroll suave con Lenis sincronizado con ScrollTrigger (patrón recomendado
 * en el README de Lenis: lenis.on('scroll', ScrollTrigger.update) + gsap.ticker).
 * Se desactiva con prefers-reduced-motion: queda el scroll nativo.
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null);
  const raf = useRef<((time: number) => void) | null>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const instance = new Lenis({ lerp: 0.1, wheelMultiplier: 1, smoothWheel: true });
    instance.on('scroll', ScrollTrigger.update);
    raf.current = (time: number) => instance.raf(time * 1000);
    gsap.ticker.add(raf.current);
    gsap.ticker.lagSmoothing(0);
    setLenis(instance);
    return () => {
      if (raf.current) gsap.ticker.remove(raf.current);
      instance.destroy();
      setLenis(null);
    };
  }, []);

  const api: ScrollApi = {
    lenis,
    scrollTo: (target, opts = {}) => {
      if (lenis) {
        lenis.scrollTo(target, { offset: opts.offset ?? -80, immediate: opts.immediate, duration: 1.2 });
        return;
      }
      if (typeof target === 'number') window.scrollTo({ top: target });
      else {
        const el = typeof target === 'string' ? document.querySelector(target) : target;
        el?.scrollIntoView();
      }
    },
  };

  return <ScrollContext.Provider value={api}>{children}</ScrollContext.Provider>;
}

export const useSmoothScroll = () => useContext(ScrollContext);
