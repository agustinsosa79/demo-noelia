import { useLayoutEffect, useRef } from 'react';
import { stock, type StockName } from '../../lib/media';
import { gsap, prefersReducedMotion, ScrollTrigger } from '../../motion/gsap';
import { ButtonLink } from '../ui/Button';

const steps: { title: string; text: string; image: StockName; alt: string }[] = [
  {
    title: 'Evaluación física',
    text: 'Es el primer paso: Noelia conoce tu punto de partida, tu historial y tu objetivo. Nada se arma antes de esto.',
    image: 'columna-pesas',
    alt: 'Columna de pesas numeradas de una máquina de gimnasio.',
  },
  {
    title: 'Plan de entrenamiento',
    text: 'Con la evaluación arma tu plan: ejercicios, series y progresión según tu nivel y el tiempo que tenés para entrenar.',
    image: 'barra-disco-oscuro',
    alt: 'Barra con disco apoyada en el piso de un gimnasio.',
  },
  {
    title: 'Plan nutricional',
    text: 'La alimentación acompaña al entrenamiento. Por eso la asesoría incluye un plan nutricional personalizado.',
    image: 'kettlebell-gris',
    alt: 'Kettlebell negra sobre el piso de goma de un gimnasio.',
  },
  {
    title: 'Controles semanales',
    text: 'Cada semana revisan tu avance y ajustan el plan. Así el plan acompaña tu progreso en lugar de quedar fijo.',
    image: 'rack-mancuernas',
    alt: 'Rack de mancuernas en un gimnasio.',
  },
];

/**
 * «Cómo funciona»: en escritorio la sección queda fija y los pasos se desplazan
 * en horizontal con el scroll (ScrollTrigger pin + scrub). En móvil y con
 * reduced-motion, se muestran apilados con scroll normal.
 */
export function ProcessScroller() {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!section.current || !track.current || prefersReducedMotion()) return;
    const mm = gsap.matchMedia();
    mm.add('(min-width: 1024px)', () => {
      const distance = () => track.current!.scrollWidth - window.innerWidth;
      const tween = gsap.to(track.current, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: {
          trigger: section.current,
          start: 'top top',
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 0.8,
          invalidateOnRefresh: true,
        },
      });
      gsap.fromTo(bar.current, { scaleX: 0 }, { scaleX: 1, ease: 'none', scrollTrigger: { trigger: section.current, start: 'top top', end: () => `+=${distance()}`, scrub: true } });
      // Cada imagen hace un leve contra-movimiento (parallax horizontal).
      track.current!.querySelectorAll('img').forEach((img) => {
        gsap.fromTo(img, { xPercent: -8 }, { xPercent: 8, ease: 'none', scrollTrigger: { trigger: img, containerAnimation: tween, start: 'left right', end: 'right left', scrub: true } });
      });
      return () => ScrollTrigger.refresh();
    });
    return () => mm.revert();
  }, []);

  return (
    <section ref={section} aria-labelledby="process-title" className="relative overflow-hidden bg-ink text-bone">
      <div className="lg:flex lg:h-svh lg:flex-col lg:justify-center">
        <div className="container-site flex flex-col gap-6 pt-24 pb-12 lg:flex-row lg:items-end lg:justify-between lg:pt-28 lg:pb-14">
          <div>
            <p className="label text-fog">Proceso</p>
            <h2 id="process-title" className="mt-4 font-display text-display">
              Cómo funciona la asesoría integral
            </h2>
          </div>
          <p className="max-w-md text-fog">Cuatro partes que se trabajan juntas, en este orden. Es el servicio tal como lo ofrece Noelia.</p>
        </div>
        <div ref={track} className="flex flex-col gap-5 px-5 pb-24 md:px-10 lg:w-max lg:flex-row lg:gap-6 lg:pr-[8vw] lg:pb-0 lg:pl-14">
          {steps.map((s, i) => (
            <article key={s.title} className="grid overflow-hidden rounded-3xl bg-carbon lg:h-[58vh] lg:w-[58vw] lg:grid-cols-2 xl:w-[52vw]">
              <div className="relative aspect-[4/3] overflow-hidden lg:aspect-auto">
                <img {...stock(s.image)} sizes="(min-width: 1024px) 30vw, 100vw" alt={s.alt} loading="lazy" className="absolute inset-0 h-full w-[116%] max-w-none -translate-x-[8%] object-cover lg:w-[116%]" />
              </div>
              <div className="flex flex-col justify-between gap-10 p-8 md:p-10">
                <span className="font-mono text-sm text-fog">0{i + 1} / 0{steps.length}</span>
                <div>
                  <h3 className="font-display text-[clamp(2rem,1.4rem+2vw,3.4rem)] leading-[0.92]">{s.title}</h3>
                  <p className="mt-5 max-w-sm text-fog">{s.text}</p>
                </div>
              </div>
            </article>
          ))}
          <div className="flex items-center rounded-3xl bg-rose p-10 lg:h-[58vh] lg:w-[30vw]">
            <div>
              <p className="font-display text-[clamp(2rem,1.4rem+2vw,3.2rem)] leading-[0.92]">Empezá por la evaluación</p>
              <div className="mt-8">
                <ButtonLink to="/entrenamiento/asesoria-integral" variant="dark" magnetic>
                  Ver la asesoría
                </ButtonLink>
              </div>
            </div>
          </div>
        </div>
        <div className="container-site hidden pt-10 lg:block">
          <div className="h-px bg-bone/15">
            <div ref={bar} className="h-px origin-left bg-rose" />
          </div>
        </div>
      </div>
    </section>
  );
}
