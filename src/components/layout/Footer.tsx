import { Link } from 'react-router';
import { CATEGORIES } from '@shared/catalog';
import { PLANS } from '@shared/plans';
import { site, whatsappLink } from '../../config/site';
import { ButtonExternal } from '../ui/Button';

export function Footer() {
  const cols = [
    { title: 'Planes', links: [{ to: '/entrenamiento', label: 'Todos los planes' }, ...PLANS.map((p) => ({ to: `/entrenamiento/${p.slug}`, label: p.name }))] },
    { title: 'Suplementos', links: [{ to: '/tienda', label: 'Toda la tienda' }, ...CATEGORIES.slice(0, 4).map((c) => ({ to: `/tienda/categoria/${c.slug}`, label: c.name }))] },
    { title: 'Noelia', links: [{ to: '/sobre-noelia', label: 'Sobre Noelia' }, { to: '/contacto', label: 'Contacto' }, { to: '/carrito', label: 'Carrito' }] },
  ];
  return (
    <footer className="bg-ink text-bone">
      <div className="container-site pt-24 pb-10">
        <div className="grid gap-16 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="font-display text-title">¿Querés empezar a entrenar con Noelia?</p>
            <p className="mt-5 max-w-md text-fog">Escribile por WhatsApp con tu objetivo y coordinan la evaluación física.</p>
            <div className="mt-8">
              <ButtonExternal href={whatsappLink('Hola Noelia, quiero empezar a entrenar con vos.')} variant="primary" magnetic>
                Escribir por WhatsApp
              </ButtonExternal>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-10 sm:grid-cols-4 lg:col-span-7">
            {cols.map((col) => (
              <nav key={col.title} aria-label={col.title}>
                <p className="label text-fog">{col.title}</p>
                <ul className="mt-5 space-y-3 text-[0.95rem]">
                  {col.links.map((l) => (
                    <li key={l.to}>
                      <Link to={l.to} className="text-bone/80 transition-colors hover:text-bone">
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
            <div>
              <p className="label text-fog">Redes</p>
              <ul className="mt-5 space-y-3 text-[0.95rem]">
                {[
                  { href: site.contact.instagram, label: 'Instagram' },
                  { href: site.contact.youtube, label: 'YouTube' },
                  { href: site.contact.threads, label: 'Threads' },
                ].map((s) => (
                  <li key={s.href}>
                    <a href={s.href} target="_blank" rel="noopener noreferrer" className="text-bone/80 transition-colors hover:text-bone">
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-24 flex flex-col gap-4 border-t border-bone/15 pt-8 text-sm text-fog md:flex-row md:justify-between">
          <p>© {new Date().getFullYear()} Noelia Perucci · Personal trainer IFBB · Argentina</p>
          <p className="max-w-xl md:text-right">Los suplementos no reemplazan una alimentación variada ni la consulta con profesionales de la salud.</p>
        </div>
      </div>
    </footer>
  );
}
