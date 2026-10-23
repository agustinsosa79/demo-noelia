import { useRef } from 'react';
import { PageHeader } from '../components/layout/PageHeader';
import { breadcrumbJsonLd, personJsonLd, Seo } from '../components/seo/Seo';
import { ButtonExternal, ButtonLink } from '../components/ui/Button';
import { site } from '../config/site';
import { noelia } from '../lib/media';
import { usePageMotion } from '../motion/usePageMotion';

export default function AboutPage() {
  const ref = useRef<HTMLDivElement>(null);
  usePageMotion(ref);
  return (
    <div ref={ref}>
      <Seo
        title="Sobre Noelia Perucci: personal trainer IFBB y atleta wellness NPC"
        description="Noelia Perucci es personal trainer con diplomas internacionales IFBB y Olympia, y atleta de la categoría wellness en NPC."
        path="/sobre-noelia"
        jsonLd={[personJsonLd, breadcrumbJsonLd([{ name: 'Inicio', path: '/' }, { name: 'Sobre Noelia', path: '/sobre-noelia' }])]}
      />
      <PageHeader
        title="Noelia Perucci, personal trainer IFBB y atleta wellness"
        crumbs={[{ name: 'Inicio', to: '/' }, { name: 'Sobre Noelia' }]}
        image="columna-pesas"
        lead="Personal trainer con dos diplomas internacionales, IFBB y Olympia, y competidora de la categoría wellness en NPC."
      />

      <section aria-labelledby="training-title" className="container-site section-y">
        <div className="grid gap-14 lg:grid-cols-12 lg:items-center">
          <div data-img-reveal className="aspect-[4/5] overflow-hidden rounded-3xl lg:col-span-5">
            <img src={noelia.stageSquare.src} alt={noelia.stageSquare.alt} width={640} height={640} className="h-full w-full object-cover object-[50%_30%]" />
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            <h2 id="training-title" data-split className="font-display text-title">
              Formación y competencia
            </h2>
            <p data-fade className="mt-6 text-lead text-muted">
              «No soy una más. Me instruí. Estudié. Rendí… pagué por eso.» Así lo contó cuando publicó sus diplomas: se formó en dos instituciones
              internacionales y sigue estudiando.
            </p>
            <ul data-fade className="mt-10 divide-y divide-line border-y border-line">
              {site.credentials.map((c) => (
                <li key={c.title} className="flex flex-col justify-between gap-1 py-5 sm:flex-row">
                  <span className="font-title text-xl">{c.title}</span>
                  <span className="label text-muted">
                    {c.issuer}
                    {c.year && ` · ${c.year}`}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section aria-labelledby="cert-title" className="bg-ink text-bone section-y">
        <div className="container-site grid gap-14 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-5">
            <h2 id="cert-title" data-split className="font-display text-title">
              Certificación Olympia
            </h2>
            <p data-fade className="mt-6 text-fog">
              Bodybuilding & Fitness Trainer de la Academia Olympia Internacional, a nombre de Noelia Soledad Perucci. Capacitación online, emitida en
              julio de 2021.
            </p>
          </div>
          <figure data-img-reveal className="overflow-hidden rounded-3xl bg-bone p-3 lg:col-span-6 lg:col-start-7">
            <img src={noelia.certificate.src} alt={noelia.certificate.alt} width={noelia.certificate.w} height={noelia.certificate.h} loading="lazy" className="w-full rounded-2xl" />
          </figure>
        </div>
      </section>

      <section aria-labelledby="method-title" className="container-site section-y">
        <div className="grid gap-14 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-6">
            <h2 id="method-title" data-split className="font-display text-title">
              Cómo trabaja con sus alumnas
            </h2>
            <p data-fade className="mt-6 text-lead text-muted">
              Evaluación física, plan de entrenamiento, plan nutricional personalizado y controles semanales. En sus palabras: «Yo te ofrezco mi
              conocimiento y vos ponés tus ganas».
            </p>
            <div data-fade className="mt-10 flex flex-wrap gap-3">
              <ButtonLink to="/entrenamiento" variant="primary" magnetic>
                Ver planes de entrenamiento
              </ButtonLink>
              <ButtonExternal href={site.contact.instagram} variant="outline">
                Instagram {site.contact.instagramHandle}
              </ButtonExternal>
            </div>
          </div>
          <div data-img-reveal className="aspect-[6/5] overflow-hidden rounded-3xl lg:col-span-5 lg:col-start-8">
            <img src={noelia.training.src} alt={noelia.training.alt} width={noelia.training.w} height={noelia.training.h} loading="lazy" className="h-full w-full object-cover" />
          </div>
        </div>
      </section>
    </div>
  );
}
