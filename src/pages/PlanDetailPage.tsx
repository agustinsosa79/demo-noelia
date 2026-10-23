import { useRef } from 'react';
import { useParams } from 'react-router';
import { findPlan, PLANS } from '@shared/plans';
import { PageHeader } from '../components/layout/PageHeader';
import { InquiryForm } from '../components/plans/InquiryForm';
import { PlanCard, planCta, PlanPrice } from '../components/plans/PlanCard';
import { breadcrumbJsonLd, Seo } from '../components/seo/Seo';
import { ButtonExternal, ButtonLink } from '../components/ui/Button';
import { absoluteUrl, whatsappLink } from '../config/site';
import { usePageMotion } from '../motion/usePageMotion';
import NotFoundPage from './NotFoundPage';

export default function PlanDetailPage() {
  const { slug = '' } = useParams();
  const plan = findPlan(slug);
  const ref = useRef<HTMLDivElement>(null);
  usePageMotion(ref, [slug]);
  if (!plan) return <NotFoundPage />;

  const others = PLANS.filter((p) => p.slug !== plan.slug);
  const facts = [
    { k: 'Modalidad', v: plan.modality ?? 'A consultar' },
    { k: 'Duración', v: plan.duration ?? 'A consultar' },
    { k: 'Controles', v: plan.checkIns ?? 'A consultar' },
  ];

  return (
    <div ref={ref} key={slug}>
      <Seo
        title={plan.seo.title}
        description={plan.seo.description}
        path={`/entrenamiento/${plan.slug}`}
        jsonLd={[
          {
            '@context': 'https://schema.org',
            '@type': 'Service',
            name: plan.name,
            description: plan.summary,
            serviceType: 'Entrenamiento personalizado',
            url: absoluteUrl(`/entrenamiento/${plan.slug}`),
            provider: { '@type': 'Person', name: 'Noelia Perucci' },
            areaServed: { '@type': 'Country', name: 'Argentina' },
            ...(plan.price && { offers: { '@type': 'Offer', price: plan.price.amount, priceCurrency: plan.price.currency } }),
          },
          breadcrumbJsonLd([
            { name: 'Planes', path: '/entrenamiento' },
            { name: plan.name, path: `/entrenamiento/${plan.slug}` },
          ]),
        ]}
      />
      <PageHeader title={plan.seo.h1} crumbs={[{ name: 'Inicio', to: '/' }, { name: 'Planes', to: '/entrenamiento' }, { name: plan.name }]} image="kettlebell-gris" lead={plan.summary}>
        <div className="flex flex-col gap-3 sm:flex-row">
          <ButtonLink to="#solicitar" variant="primary" size="lg" magnetic>
            {planCta(plan)}
          </ButtonLink>
          <ButtonExternal href={whatsappLink(`Hola Noelia, quiero consultar por: ${plan.name}.`)} variant="outline-light" size="lg">
            Consultar por WhatsApp
          </ButtonExternal>
        </div>
      </PageHeader>

      <div className="container-site grid gap-14 section-y lg:grid-cols-12">
        <div className="space-y-24 lg:col-span-7">
          <section aria-labelledby="includes-title">
            <h2 id="includes-title" data-split className="font-display text-title">
              Qué incluye
            </h2>
            <ol className="mt-10 border-t border-line">
              {plan.includes.map((f, i) => (
                <li key={f.label} data-fade className="grid grid-cols-[3.5rem_1fr] gap-4 border-b border-line py-7">
                  <span className="font-mono text-sm text-rose">0{i + 1}</span>
                  <div>
                    <h3 className="font-title text-2xl">{f.label}</h3>
                    {f.detail && <p className="mt-2 text-muted">{f.detail}</p>}
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <section aria-labelledby="forwhom-title" className="grid gap-10 sm:grid-cols-2">
            <div data-fade>
              <h2 id="forwhom-title" className="font-title text-2xl">
                Para quién es
              </h2>
              <ul className="mt-5 space-y-3">
                {plan.forWhom.map((t) => (
                  <li key={t} className="flex gap-3">
                    <svg viewBox="0 0 16 16" className="mt-1.5 size-4 shrink-0 text-rose" aria-hidden="true">
                      <path d="M3 8.5l3 3 7-7" fill="none" stroke="currentColor" strokeWidth="1.8" />
                    </svg>
                    {t}
                  </li>
                ))}
              </ul>
            </div>
            {plan.notFor.length > 0 && (
              <div data-fade>
                <h2 className="font-title text-2xl">Cuándo conviene otro plan</h2>
                <ul className="mt-5 space-y-3 text-muted">
                  {plan.notFor.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              </div>
            )}
          </section>
        </div>

        <aside aria-label="Resumen del plan" className="lg:col-span-4 lg:col-start-9">
          <div className="overflow-hidden rounded-3xl bg-white lg:sticky lg:top-28">
            <img src={plan.image.src} alt={plan.image.alt} loading="lazy" className="aspect-[16/10] w-full object-cover" />
            <div className="space-y-6 p-7">
              <PlanPrice plan={plan} />
              <dl className="divide-y divide-line border-y border-line text-[0.95rem]">
                {facts.map((r) => (
                  <div key={r.k} className="flex justify-between gap-4 py-3.5">
                    <dt className="text-muted">{r.k}</dt>
                    <dd>{r.v}</dd>
                  </div>
                ))}
              </dl>
              <ButtonLink to="#solicitar" variant="primary" className="w-full justify-between">
                {planCta(plan)}
              </ButtonLink>
              <p className="text-sm text-muted">Es un servicio: no se compra en el carrito. Noelia te contacta para coordinar.</p>
            </div>
          </div>
        </aside>
      </div>

      <section id="solicitar" aria-labelledby="request-title" className="bg-ink text-bone section-y">
        <div className="container-site grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <h2 id="request-title" data-split className="font-display text-title">
              {plan.status === 'confirmado' ? `Pedí la ${plan.name.toLowerCase()}` : `Consultá por ${plan.name.toLowerCase()}`}
            </h2>
            <p data-fade className="mt-5 max-w-sm text-fog">
              Dejá tus datos y Noelia te contacta para coordinar la evaluación física.
            </p>
          </div>
          <div data-fade className="lg:col-span-8">
            <InquiryForm fixedPlan={plan} tone="dark" />
          </div>
        </div>
      </section>

      <section aria-labelledby="other-plans" className="bg-sand section-y">
        <div className="container-site">
          <h2 id="other-plans" data-split className="font-display text-title">
            Otros planes
          </h2>
          <div className="mt-12 grid gap-5 md:grid-cols-2">
            {others.map((p) => (
              <div key={p.slug} data-fade className="flex">
                <PlanCard plan={p} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
