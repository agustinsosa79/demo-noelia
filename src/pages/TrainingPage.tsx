import { useRef } from 'react';
import { PLANS } from '@shared/plans';
import { PageHeader } from '../components/layout/PageHeader';
import { InquiryForm } from '../components/plans/InquiryForm';
import { PlanCard } from '../components/plans/PlanCard';
import { PlanComparison } from '../components/plans/PlanComparison';
import { breadcrumbJsonLd, faqJsonLd, Seo } from '../components/seo/Seo';
import { Accordion } from '../components/ui/Accordion';
import { ButtonExternal } from '../components/ui/Button';
import { absoluteUrl, site, whatsappLink } from '../config/site';
import { trainingFaq } from '../content/faq';
import { usePageMotion } from '../motion/usePageMotion';

const where = site.city ? ` en ${site.city}` : '';

const steps = [
  { title: 'Le escribís', text: 'Por WhatsApp o con el formulario de abajo, con tu objetivo.' },
  { title: 'Evaluación física', text: 'Noelia conoce tu punto de partida y te cuenta las condiciones del plan.' },
  { title: 'Recibís tu plan', text: 'Plan de entrenamiento y, en la asesoría integral, plan nutricional.' },
  { title: 'Controles semanales', text: 'Revisan tu avance y ajustan el plan cada semana.' },
];

export default function TrainingPage() {
  const ref = useRef<HTMLDivElement>(null);
  usePageMotion(ref);
  return (
    <div ref={ref}>
      <Seo
        title={`Planes de entrenamiento personalizado${where}`}
        description={`Compará los planes de Noelia Perucci, personal trainer IFBB${where}: asesoría integral con evaluación física, plan de entrenamiento, plan nutricional y controles semanales.`}
        path="/entrenamiento"
        jsonLd={[
          breadcrumbJsonLd([{ name: 'Inicio', path: '/' }, { name: 'Planes de entrenamiento', path: '/entrenamiento' }]),
          {
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            name: 'Planes de entrenamiento de Noelia Perucci',
            itemListElement: PLANS.map((p, i) => ({ '@type': 'ListItem', position: i + 1, url: absoluteUrl(`/entrenamiento/${p.slug}`), name: p.name })),
          },
          faqJsonLd(trainingFaq),
        ]}
      />
      <PageHeader
        title="Planes de entrenamiento personalizado"
        crumbs={[{ name: 'Inicio', to: '/' }, { name: 'Planes' }]}
        image="barra-disco-oscuro"
        lead="Todos los planes empiezan con una evaluación física. Compará qué incluye cada uno y pedí el que necesitás: Noelia te responde para coordinar."
      >
        <ButtonExternal href={whatsappLink('Hola Noelia, quiero consultar qué plan me conviene.')} variant="outline-light">
          Consultar qué plan me conviene
        </ButtonExternal>
      </PageHeader>

      <section aria-labelledby="plans-list" className="bg-sand section-y">
        <div className="container-site">
          <h2 id="plans-list" data-split className="font-display text-title">
            Elegí tu plan
          </h2>
          <div className="mt-12 grid gap-5 lg:grid-cols-3">
            {PLANS.map((p) => (
              <div key={p.slug} data-fade className="flex">
                <PlanCard plan={p} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="comparativa" aria-labelledby="compare-title" className="container-site section-y">
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
          <h2 id="compare-title" data-split className="font-display text-title lg:col-span-7">
            Comparación de planes
          </h2>
          <p data-fade className="text-muted lg:col-span-4 lg:col-start-9">
            Lo que incluye cada plan, lado a lado. El precio y la modalidad se confirman al consultar.
          </p>
        </div>
        <div data-fade className="mt-12">
          <PlanComparison plans={PLANS} />
        </div>
      </section>

      <section aria-labelledby="steps-title" className="bg-ink text-bone section-y">
        <div className="container-site">
          <h2 id="steps-title" data-split className="font-display text-title">
            Cómo empezar a entrenar con Noelia
          </h2>
          <ol className="mt-14 grid gap-px overflow-hidden rounded-3xl bg-bone/12 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((s, i) => (
              <li key={s.title} data-fade className="bg-ink p-8 md:p-10">
                <span className="font-mono text-sm text-rose">0{i + 1}</span>
                <h3 className="mt-10 font-title text-2xl">{s.title}</h3>
                <p className="mt-3 text-fog">{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section aria-labelledby="training-faq" className="container-site section-y">
        <div className="grid gap-12 lg:grid-cols-12">
          <h2 id="training-faq" data-split className="font-display text-title lg:col-span-4">
            Preguntas frecuentes sobre los planes
          </h2>
          <div data-fade className="lg:col-span-8">
            <Accordion items={trainingFaq} />
          </div>
        </div>
      </section>

      <section id="consulta" aria-labelledby="inquiry-title" className="bg-sand section-y">
        <div className="container-site grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <h2 id="inquiry-title" data-split className="font-display text-title">
              Consultá por un plan
            </h2>
            <p data-fade className="mt-5 max-w-sm text-muted">
              Si no sabés cuál elegir, dejá el plan en blanco y contá tu objetivo: Noelia te orienta.
            </p>
          </div>
          <div data-fade className="lg:col-span-8">
            <InquiryForm />
          </div>
        </div>
      </section>
    </div>
  );
}
