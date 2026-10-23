import { useLayoutEffect, type DependencyList, type RefObject } from 'react';
import { gsap, prefersReducedMotion, ScrollTrigger, SplitText } from './gsap';

/**
 * Animaciones declarativas por atributos, acotadas a `scope` y revertidas al
 * desmontar (gsap.context). Solo se animan transform y opacity (o clip-path en
 * imágenes) para quedarse en el compositor (web.dev, «Animations and performance»).
 *
 *   data-split          Título que entra línea por línea con máscara.
 *   data-fade           Bloque que sube y aparece una vez.
 *   data-img-reveal     Contenedor de imagen que se descubre de abajo hacia arriba.
 *   data-parallax       Imagen (dentro de un contenedor con overflow) con parallax suave.
 *   data-scrub-words    Párrafo que se ilumina palabra por palabra con el scroll.
 */
export function usePageMotion(scope: RefObject<HTMLElement | null>, deps: DependencyList = []) {
  useLayoutEffect(() => {
    const root = scope.current;
    if (!root || prefersReducedMotion()) return;
    const splits: SplitText[] = [];

    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(root);

      q('[data-split]').forEach((el: HTMLElement) => {
        const split = SplitText.create(el, {
          type: 'lines',
          mask: 'lines',
          linesClass: 'split-line-inner',
          autoSplit: true,
          onSplit: (self) =>
            gsap.from(self.lines, {
              yPercent: 110,
              duration: 1.1,
              stagger: 0.08,
              scrollTrigger: { trigger: el, start: 'top 88%', once: true },
            }),
        });
        splits.push(split);
      });

      const fades = q('[data-fade]');
      if (fades.length) {
        gsap.set(fades, { autoAlpha: 0, y: 28 });
        ScrollTrigger.batch(fades, {
          start: 'top 90%',
          once: true,
          onEnter: (batch) => gsap.to(batch, { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.08, overwrite: true }),
        });
      }

      q('[data-img-reveal]').forEach((el: HTMLElement) => {
        const img = el.querySelector('img');
        const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: 'top 85%', once: true } });
        tl.fromTo(el, { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.3, ease: 'expo.inOut' });
        if (img) tl.from(img, { scale: 1.25, duration: 1.8, ease: 'expo.out' }, 0.1);
      });

      q('[data-parallax]').forEach((el: HTMLElement) => {
        gsap.fromTo(
          el,
          { yPercent: -7 },
          { yPercent: 7, ease: 'none', scrollTrigger: { trigger: el.parentElement ?? el, start: 'top bottom', end: 'bottom top', scrub: true } },
        );
      });

      q('[data-scrub-words]').forEach((el: HTMLElement) => {
        const split = SplitText.create(el, { type: 'words' });
        splits.push(split);
        gsap.fromTo(
          split.words,
          { opacity: 0.16 },
          { opacity: 1, ease: 'none', stagger: 0.1, scrollTrigger: { trigger: el, start: 'top 80%', end: 'bottom 45%', scrub: true } },
        );
      });
    }, root);

    // Recalcular posiciones cuando terminan de cargar fuentes e imágenes.
    const refresh = () => ScrollTrigger.refresh();
    document.fonts?.ready.then(refresh);
    window.addEventListener('load', refresh);

    return () => {
      window.removeEventListener('load', refresh);
      splits.forEach((s) => s.revert());
      ctx.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
