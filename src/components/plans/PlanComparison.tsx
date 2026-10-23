import type { ReactNode } from 'react';
import { Link } from 'react-router';
import type { Plan } from '@shared/types';
import { PlanPrice } from './PlanCard';

const FEATURES = ['Evaluación física', 'Plan de entrenamiento', 'Plan nutricional personalizado', 'Controles semanales'];

function featureOf(plan: Plan, label: string) {
  return (
    plan.includes.find((f) => f.label.startsWith(label)) ??
    (label === 'Controles semanales' ? plan.includes.find((f) => f.label === 'Seguimiento') : undefined)
  );
}

function Mark({ plan, label }: { plan: Plan; label: string }) {
  const f = featureOf(plan, label);
  if (f) {
    return (
      <span className="inline-flex items-center gap-2">
        <svg viewBox="0 0 16 16" className="size-4 text-rose" aria-hidden="true">
          <path d="M3 8.5l3 3 7-7" fill="none" stroke="currentColor" strokeWidth="1.8" />
        </svg>
        <span>{f.label === label ? 'Incluye' : f.label}</span>
      </span>
    );
  }
  // En una propuesta, lo que falta todavía no está definido (no se afirma que «no incluye»).
  return <span className="text-muted">{plan.status === 'propuesta' ? 'A definir' : 'No incluye'}</span>;
}

/**
 * Comparativa: tabla semántica en escritorio y bloques por plan en móvil
 * (sin scroll horizontal).
 */
export function PlanComparison({ plans }: { plans: Plan[] }) {
  const rows: { label: string; render: (p: Plan) => ReactNode }[] = [
    ...FEATURES.map((label) => ({ label, render: (p: Plan) => <Mark plan={p} label={label} /> })),
    { label: 'Modalidad', render: (p) => p.modality ?? <span className="text-muted">A consultar</span> },
    { label: 'Precio', render: (p) => <PlanPrice plan={p} /> },
  ];
  return (
    <>
      <div className="hidden overflow-hidden rounded-3xl bg-white md:block">
        <table className="w-full text-left text-[0.95rem]">
          <caption className="sr-only">Comparación de los planes de entrenamiento</caption>
          <thead>
            <tr className="border-b border-line">
              <th scope="col" className="w-1/4 px-8 py-7 align-bottom label font-normal text-muted">
                Qué incluye
              </th>
              {plans.map((p) => (
                <th key={p.slug} scope="col" className={`px-6 py-7 align-bottom ${p.featured ? 'bg-ink text-bone' : ''}`}>
                  <span className={`label ${p.featured ? 'text-fog' : 'text-muted'}`}>Plan {p.number}</span>
                  <Link to={`/entrenamiento/${p.slug}`} className="mt-2 block font-display text-2xl leading-none hover:text-rose">
                    {p.name}
                  </Link>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.label} className="border-b border-line last:border-0">
                <th scope="row" className="px-8 py-5 font-medium">
                  {row.label}
                </th>
                {plans.map((p) => (
                  <td key={p.slug} className={`px-6 py-5 ${p.featured ? 'bg-ink text-bone [&_.text-muted]:text-fog' : ''}`}>
                    {row.render(p)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="space-y-4 md:hidden">
        {plans.map((p) => (
          <section key={p.slug} aria-labelledby={`cmp-${p.slug}`} className={`rounded-3xl p-6 ${p.featured ? 'bg-ink text-bone [&_.text-muted]:text-fog' : 'bg-white'}`}>
            <p className="label text-muted">Plan {p.number}</p>
            <h3 id={`cmp-${p.slug}`} className="mt-1 font-display text-2xl">
              <Link to={`/entrenamiento/${p.slug}`}>{p.name}</Link>
            </h3>
            <dl className={`mt-4 divide-y text-[0.95rem] ${p.featured ? 'divide-bone/15' : 'divide-line'}`}>
              {rows.map((row) => (
                <div key={row.label} className="flex items-start justify-between gap-4 py-3">
                  <dt className="font-medium">{row.label}</dt>
                  <dd className="text-right">{row.render(p)}</dd>
                </div>
              ))}
            </dl>
          </section>
        ))}
      </div>
    </>
  );
}
