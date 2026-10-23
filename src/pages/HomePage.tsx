import { useLayoutEffect, useRef } from 'react';
import { Link } from 'react-router';
import { CATEGORIES, queryProducts } from '@shared/catalog';
import { PLANS } from '@shared/plans';
import { ProcessScroller } from '../components/home/ProcessScroller';
import { PlanCard } from '../components/plans/PlanCard';
import { ProductCard } from '../components/products/ProductCard';
import { faqJsonLd, personJsonLd, Seo } from '../components/seo/Seo';
import { Accordion } from '../components/ui/Accordion';
import { ButtonExternal, ButtonLink } from '../components/ui/Button';
import { site, whatsappLink } from '../config/site';
import { storeFaq, trainingFaq } from '../content/faq';
import { noelia, stock } from '../lib/media';
import { gsap, prefersReducedMotion, SplitText } from '../motion/gsap';
import { releaseIntro } from '../motion/intro';
import { usePageMotion } from '../motion/usePageMotion';

const homeFaq = [...trainingFaq.slice(0, 4), storeFaq[0]];

function Hero() {
  const ref = useRef<HTMLElement>(null);
  useLayoutEffect(() => {
    if (!ref.current || prefersReducedMotion()) return;
    let split: SplitText | undefined;
    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(ref.current);
      split = SplitText.create(q('h1')[0], { type: 'lines', mask: 'lines' });
      gsap
        .timeline({ defaults: { ease: 'expo.out' } })
        .fromTo(q('[data-hero-bg]'), { scale: 1.18, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 2.2 }, 0)
        .from(split.lines, { yPercent: 110, duration: 1.3, stagger: 0.09 }, 0.25)
        .fromTo(q('[data-hero-photo]'), { clipPath: 'inset(100% 0 0 0 round 24px)' }, { clipPath: 'inset(0% 0 0 0 round 24px)', duration: 1.5, ease: 'expo.inOut' }, 0.35)
        .from(q('[data-hero-photo] img'), { scale: 1.3, duration: 2 }, 0.45)
        .from(q('[data-hero-in]'), { autoAlpha: 0, y: 24, duration: 1, stagger: 0.08 }, 0.8);
      // El fondo se aleja levemente al bajar (parallax).
      gsap.to(q('[data-hero-bg]'), { yPercent: 12, ease: 'none', scrollTrigger: { trigger: ref.current, start: 'top top', end: 'bottom top', scrub: true } });
    }, ref);
    releaseIntro();
    return () => {
      split?.revert();
      ctx.revert();
    };
  }, []);

  return (
    <section ref={ref} aria-labelledby="hero-title" className="relative isolate overflow-hidden bg-ink text-bone">
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <img data-hero-bg {...stock('gym-barra-sombra')} sizes="100vw" alt="" fetchPriority="high" className="h-full w-full object-cover opacity-45" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-ink/30" />
      </div>
      <div className="container-site grid min-h-svh gap-12 pt-32 pb-12 lg:grid-cols-12 lg:items-end lg:pb-16">
        <div className="lg:col-span-7">
          <p data-hero-in className="label text-fog">
            Noelia Perucci · Personal trainer certificada IFBB
          </p>
          <h1 id="hero-title" data-intro className="mt-6 font-display text-[clamp(3rem,1.2rem+6vw,7.25rem)] leading-[0.88]">
            Entrenamiento personalizado y plan nutricional
          </h1>
          <p data-hero-in className="mt-8 max-w-xl text-lead text-bone/80">
            Noelia arma tu plan a partir de una evaluación física y lo ajusta en controles semanales. Entrenamiento y alimentación, en un mismo
            seguimiento.
          </p>
          <div data-hero-in className="mt-10 flex flex-col gap-3 sm:flex-row">
            <ButtonLink to="/entrenamiento" variant="primary" size="lg" magnetic>
              Ver planes de entrenamiento
            </ButtonLink>
            <ButtonLink to="/tienda" variant="outline-light" size="lg">
              Comprar suplementos
            </ButtonLink>
          </div>
        </div>
        <figure className="mx-auto w-full max-w-[20rem] lg:col-span-4 lg:col-start-9 lg:mr-0 lg:max-w-[22rem]">
          <div data-hero-photo className="aspect-[4/5] overflow-hidden rounded-3xl lg:aspect-[3/5]">
            <img src={noelia.stage.src} alt={noelia.stage.alt} width={noelia.stage.w} height={noelia.stage.h} className="h-full w-full object-cover object-[50%_20%]" />
          </div>
          <figcaption data-hero-in className="mt-3 flex justify-between label text-fog">
            <span>NPC Córdoba</span>
            <span>Categoría wellness</span>
          </figcaption>
        </figure>
      </div>
      <div className="border-t border-bone/12">
        <ul className="container-site grid gap-x-10 gap-y-3 py-7 sm:grid-cols-3">
          {site.credentials.map((c) => (
            <li key={c.title} data-hero-in className="flex flex-col">
              <span className="label text-fog">{c.issuer}</span>
              <span className="mt-1 text-[0.95rem]">
                {c.title}
                {c.year && ` · ${c.year}`}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Paths() {
  const featured = queryProducts({ featured: true }).slice(0, 3);
  return (
    <section aria-labelledby="paths-title" className="container-site section-y">
      <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
        <h2 id="paths-title" data-split className="font-display text-display lg:col-span-7">
          Planes de entrenamiento y suplementos
        </h2>
        <p data-fade className="max-w-md text-muted lg:col-span-4 lg:col-start-9">
          Dos cosas distintas en un mismo lugar: un servicio que se coordina con Noelia y una tienda donde comprás productos.
        </p>
      </div>
      <div className="mt-14 grid gap-5 lg:grid-cols-2">
        <Link to="/entrenamiento" className="group relative isolate flex min-h-[32rem] flex-col justify-end overflow-hidden rounded-3xl bg-ink p-8 text-bone md:p-10">
          <div data-img-reveal className="absolute inset-0 -z-10">
            <img {...stock('kettlebell-tiza')} sizes="(min-width: 1024px) 50vw, 100vw" alt="" loading="lazy" className="h-full w-full object-cover opacity-70 transition-transform duration-[1400ms] ease-(--ease-out-expo) group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-transparent" />
          </div>
          <span className="label text-fog">Servicio · Se coordina con Noelia</span>
          <h3 className="mt-3 font-display text-[clamp(2.4rem,1.6rem+2.4vw,4rem)] leading-[0.9]">Planes de entrenamiento</h3>
          <p className="mt-4 max-w-sm text-bone/75">Evaluación física, plan de entrenamiento, plan nutricional y controles semanales.</p>
          <span className="mt-8 inline-flex items-center gap-3 font-medium">
            Ver planes
            <span aria-hidden="true" className="grid size-10 place-items-center rounded-full bg-rose transition-transform duration-500 ease-(--ease-out-expo) group-hover:translate-x-2">→</span>
          </span>
        </Link>
        <Link to="/tienda" className="group relative isolate flex min-h-[32rem] flex-col justify-between overflow-hidden rounded-3xl bg-shelf p-8 md:p-10">
          <div className="grid grid-cols-3 gap-3">
            {featured.map((p, i) => (
              <img
                key={p.slug}
                src={p.image.src}
                alt=""
                loading="lazy"
                className="aspect-[3/4] w-full object-contain mix-blend-multiply transition-transform duration-700 ease-(--ease-out-expo) group-hover:-translate-y-2"
                style={{ transitionDelay: `${i * 60}ms` }}
              />
            ))}
          </div>
          <div>
            <span className="label text-muted">Tienda · Comprás online</span>
            <h3 className="mt-3 font-display text-[clamp(2.4rem,1.6rem+2.4vw,4rem)] leading-[0.9]">Suplementos deportivos</h3>
            <p className="mt-4 max-w-sm text-muted">Proteínas, creatina, pre-entreno, vitaminas y accesorios.</p>
            <span className="mt-8 inline-flex items-center gap-3 font-medium">
              Ir a la tienda
              <span aria-hidden="true" className="grid size-10 place-items-center rounded-full bg-ink text-bone transition-transform duration-500 ease-(--ease-out-expo) group-hover:translate-x-2">→</span>
            </span>
          </div>
        </Link>
      </div>
    </section>
  );
}

function Statement() {
  return (
    <section aria-labelledby="method-title" className="container-site pb-24 lg:pb-36">
      <div className="grid gap-10 border-t border-line pt-10 lg:grid-cols-12">
        <h2 id="method-title" className="label text-muted lg:col-span-3">
          Cómo trabaja Noelia
        </h2>
        <p data-scrub-words className="font-title text-statement lg:col-span-9">
          Primero te evalúa. Con esa información arma tu plan de entrenamiento y tu plan nutricional. Después, cada semana, revisa tu avance y
          ajusta lo que haga falta.
        </p>
      </div>
    </section>
  );
}

function Plans() {
  return (
    <section aria-labelledby="plans-title" className="bg-sand section-y">
      <div className="container-site">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div>
            <p data-fade className="label text-muted">
              Entrenamiento
            </p>
            <h2 id="plans-title" data-split className="mt-4 font-display text-display">
              Planes de entrenamiento personalizado
            </h2>
          </div>
          <div data-fade>
            <ButtonLink to="/entrenamiento#comparativa" variant="text">
              Comparar planes
            </ButtonLink>
          </div>
        </div>
        <div className="mt-14 grid gap-5 lg:grid-cols-3">
          {PLANS.map((p) => (
            <div key={p.slug} data-fade className="flex">
              <PlanCard plan={p} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Store() {
  const products = queryProducts({ featured: true }).slice(0, 4);
  return (
    <section aria-labelledby="store-title" className="container-site section-y">
      <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
        <div>
          <p data-fade className="label text-muted">
            Tienda
          </p>
          <h2 id="store-title" data-split className="mt-4 font-display text-display">
            Suplementos deportivos
          </h2>
        </div>
        <nav data-fade aria-label="Categorías" className="flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <Link key={c.slug} to={`/tienda/categoria/${c.slug}`} className="rounded-full border border-line px-4 py-2 text-sm transition-colors hover:border-ink hover:bg-ink hover:text-bone">
              {c.name}
            </Link>
          ))}
        </nav>
      </div>
      <div className="mt-14 grid grid-cols-2 gap-x-4 gap-y-10 md:gap-x-6 lg:grid-cols-4">
        {products.map((p) => (
          <div key={p.slug} data-fade>
            <ProductCard product={p} />
          </div>
        ))}
      </div>
      <div data-fade className="mt-14 flex flex-col items-start justify-between gap-6 border-t border-line pt-8 sm:flex-row sm:items-center">
        <p className="text-sm text-muted">Catálogo de demostración: productos, fotos y precios ilustrativos.</p>
        <ButtonLink to="/tienda" variant="dark">
          Ver todos los suplementos
        </ButtonLink>
      </div>
    </section>
  );
}

function About() {
  return (
    <section aria-labelledby="about-title" className="bg-ink text-bone section-y">
      <div className="container-site grid gap-14 lg:grid-cols-12 lg:items-center">
        <div className="relative lg:col-span-5">
          <div data-img-reveal className="aspect-square overflow-hidden rounded-3xl">
            <img src={noelia.stageSquare.src} alt={noelia.stageSquare.alt} width={640} height={640} loading="lazy" className="h-full w-full object-cover" />
          </div>
          <figure data-fade className="absolute -right-3 -bottom-10 w-[58%] rounded-2xl bg-bone p-2 shadow-2xl md:-right-10">
            <img src={noelia.certificate.src} alt={noelia.certificate.alt} width={noelia.certificate.w} height={noelia.certificate.h} loading="lazy" className="w-full rounded-xl" />
            <figcaption className="px-2 pt-2 pb-1 label text-muted">Certificación Olympia · 2021</figcaption>
          </figure>
        </div>
        <div className="pt-8 lg:col-span-6 lg:col-start-7 lg:pt-0">
          <p data-fade className="label text-fog">
            Sobre Noelia
          </p>
          <h2 id="about-title" data-split className="mt-4 font-display text-display">
            Noelia Perucci, personal trainer IFBB
          </h2>
          <p data-fade className="mt-8 max-w-lg text-lead text-bone/75">
            Se formó en dos instituciones internacionales, IFBB y la Academia Olympia, y compite en la categoría wellness de NPC. Hoy acompaña a sus
            alumnas con evaluación física, plan de entrenamiento, plan nutricional y controles semanales.
          </p>
          <ul data-fade className="mt-10 divide-y divide-bone/12 border-y border-bone/12">
            {site.credentials.map((c) => (
              <li key={c.title} className="flex flex-col justify-between gap-1 py-4 sm:flex-row">
                <span>{c.title}</span>
                <span className="label text-fog">
                  {c.issuer}
                  {c.year && ` · ${c.year}`}
                </span>
              </li>
            ))}
          </ul>
          <div data-fade className="mt-10">
            <ButtonLink to="/sobre-noelia" variant="outline-light">
              Conocer a Noelia
            </ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}

function Faq() {
  return (
    <section aria-labelledby="faq-title" className="container-site section-y">
      <div className="grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <h2 id="faq-title" data-split className="font-display text-title">
            Preguntas frecuentes
          </h2>
          <p data-fade className="mt-5 max-w-xs text-muted">
            ¿Otra duda? Escribile a Noelia por WhatsApp.
          </p>
        </div>
        <div data-fade className="lg:col-span-8">
          <Accordion items={homeFaq} />
        </div>
      </div>
    </section>
  );
}

function FinalCta() {
  return (
    <section aria-labelledby="cta-title" className="container-site pb-24 lg:pb-32">
      <div className="relative isolate overflow-hidden rounded-[2rem] bg-ink px-8 py-20 text-bone md:px-16 md:py-28">
        <img data-parallax {...stock('kettlebells-bn')} sizes="100vw" alt="" loading="lazy" className="absolute inset-0 -z-10 h-[115%] w-full object-cover opacity-35" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-ink via-ink/80 to-ink/20" />
        <p data-fade className="label text-fog">
          Empezá hoy
        </p>
        <h2 id="cta-title" data-split className="mt-4 max-w-3xl font-display text-display">
          Pedí tu plan de entrenamiento
        </h2>
        <p data-fade className="mt-6 max-w-lg text-bone/75">
          Contale a Noelia tu objetivo y desde dónde partís. Te responde para coordinar la evaluación física.
        </p>
        <div data-fade className="mt-10 flex flex-col gap-3 sm:flex-row">
          <ButtonExternal href={whatsappLink('Hola Noelia, quiero empezar a entrenar con vos.')} variant="primary" size="lg" magnetic>
            Escribir por WhatsApp
          </ButtonExternal>
          <ButtonLink to="/entrenamiento#consulta" variant="outline-light" size="lg">
            Dejar una consulta
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}

export default function HomePage() {
  const ref = useRef<HTMLDivElement>(null);
  usePageMotion(ref);
  return (
    <div ref={ref}>
      <Seo
        title="Noelia Perucci | Personal trainer IFBB: entrenamiento y plan nutricional"
        description="Entrenamiento personalizado con evaluación física, plan nutricional y controles semanales con Noelia Perucci, personal trainer certificada IFBB. Tienda de suplementos deportivos."
        path="/"
        jsonLd={[{ '@context': 'https://schema.org', '@type': 'WebSite', name: site.name, url: site.url, inLanguage: 'es-AR' }, personJsonLd, faqJsonLd(homeFaq)]}
      />
      <Hero />
      <Paths />
      <Statement />
      <ProcessScroller />
      <Plans />
      <Store />
      <About />
      <Faq />
      <FinalCta />
    </div>
  );
}
