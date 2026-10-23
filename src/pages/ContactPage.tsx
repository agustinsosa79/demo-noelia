import { useRef } from 'react';
import { PageHeader } from '../components/layout/PageHeader';
import { InquiryForm } from '../components/plans/InquiryForm';
import { Seo } from '../components/seo/Seo';
import { ButtonExternal } from '../components/ui/Button';
import { site, whatsappLink } from '../config/site';
import { usePageMotion } from '../motion/usePageMotion';

export default function ContactPage() {
  const ref = useRef<HTMLDivElement>(null);
  usePageMotion(ref);
  return (
    <div ref={ref}>
      <Seo
        title="Contacto: consultá por planes de entrenamiento"
        description="Escribile a Noelia Perucci por WhatsApp o dejale una consulta sobre planes de entrenamiento o la tienda de suplementos."
        path="/contacto"
      />
      <PageHeader title="Contacto" crumbs={[{ name: 'Inicio', to: '/' }, { name: 'Contacto' }]} image="disco-45" lead="La forma más rápida es WhatsApp. Si preferís, dejale una consulta y te responde por el medio que elijas." />
      <section className="bg-sand section-y">
        <div className="container-site grid gap-12 lg:grid-cols-12">
          <div className="space-y-4 lg:col-span-4">
            <div data-fade className="rounded-3xl bg-ink p-8 text-bone">
              <p className="label text-fog">WhatsApp</p>
              <p className="mt-3 font-mono text-xl">{site.contact.whatsappDisplay}</p>
              <div className="mt-6">
                <ButtonExternal href={whatsappLink('Hola Noelia, te escribo desde tu web.')} variant="primary" magnetic>
                  Abrir WhatsApp
                </ButtonExternal>
              </div>
            </div>
            <div data-fade className="rounded-3xl bg-white p-8">
              <p className="label text-muted">Instagram</p>
              <a href={site.contact.instagram} target="_blank" rel="noopener noreferrer" className="mt-3 block font-title text-2xl hover:text-rose">
                {site.contact.instagramHandle}
              </a>
            </div>
          </div>
          <div data-fade className="lg:col-span-8">
            <h2 className="sr-only">Formulario de consulta</h2>
            <InquiryForm />
          </div>
        </div>
      </section>
    </div>
  );
}
