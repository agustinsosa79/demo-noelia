import { Link } from 'react-router';
import type { Plan } from '@shared/types';
import { formatPrice } from '../../lib/format';
import { ButtonLink } from '../ui/Button';

export function PlanPrice({ plan, tone = 'light' }: { plan: Plan; tone?: 'light' | 'dark' }) {
  if (plan.price) {
    return (
      <p>
        <span className="font-mono text-2xl">{formatPrice(plan.price.amount)}</span>
        <span className={tone === 'dark' ? 'text-fog' : 'text-muted'}> / {plan.price.period}</span>
      </p>
    );
  }
  return <p className={tone === 'dark' ? 'text-fog' : 'text-muted'}>Precio a consultar</p>;
}

/** CTA según el estado: el plan confirmado se pide; las propuestas se consultan. */
export const planCta = (plan: Plan) => (plan.status === 'confirmado' ? 'Quiero este plan' : 'Consultar disponibilidad');

/**
 * Tarjeta de plan con foto. El plan destacado se invierte (fondo oscuro) para
 * guiar la elección sin depender de badges.
 */
export function PlanCard({ plan }: { plan: Plan }) {
  const dark = plan.featured;
  return (
    <article className={`group relative flex flex-col overflow-hidden rounded-3xl ${dark ? 'bg-ink text-bone' : 'bg-white text-ink'}`}>
      <div className="relative aspect-[16/11] overflow-hidden">
        <img
          src={plan.image.src}
          alt={plan.image.alt}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-[1200ms] ease-(--ease-out-expo) group-hover:scale-105"
        />
        <span className="absolute top-5 left-5 rounded-full bg-ink/70 px-3 py-1.5 label text-bone backdrop-blur">Plan {plan.number}</span>
      </div>
      <div className="flex flex-1 flex-col p-7 md:p-8">
        <h3 className="font-display text-[2.1rem] leading-[0.95]">
          <Link to={`/entrenamiento/${plan.slug}`} className="after:absolute after:inset-0">
            {plan.name}
          </Link>
        </h3>
        <p className={`mt-3 ${dark ? 'text-fog' : 'text-muted'}`}>{plan.tagline}</p>
        <ul className={`mt-6 space-y-2.5 border-t pt-6 text-[0.95rem] ${dark ? 'border-bone/15' : 'border-line'}`}>
          {plan.includes.map((f) => (
            <li key={f.label} className="flex items-start gap-3">
              <svg viewBox="0 0 16 16" className="mt-1 size-4 shrink-0 text-rose" aria-hidden="true">
                <path d="M3 8.5l3 3 7-7" fill="none" stroke="currentColor" strokeWidth="1.8" />
              </svg>
              {f.label}
            </li>
          ))}
        </ul>
        <div className="mt-auto flex flex-wrap items-center justify-between gap-4 pt-8">
          <PlanPrice plan={plan} tone={dark ? 'dark' : 'light'} />
          <span className="relative z-10">
            <ButtonLink to={`/entrenamiento/${plan.slug}`} variant={dark ? 'primary' : 'outline'}>
              {plan.status === 'confirmado' ? 'Ver el plan' : 'Ver detalles'}
            </ButtonLink>
          </span>
        </div>
      </div>
    </article>
  );
}
