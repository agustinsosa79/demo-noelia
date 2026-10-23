import { useState, type FormEvent } from 'react';
import { PLANS } from '@shared/plans';
import type { Plan } from '@shared/types';
import { whatsappLink } from '../../config/site';
import { ApiError, post, type InquiryResult } from '../../lib/api';
import { Button, ButtonExternal } from '../ui/Button';
import { Checkbox, ChoiceGroup, FormErrors, SelectField, TextArea, TextField } from '../ui/Fields';

type Pref = 'whatsapp' | 'email';

/**
 * Solicitud de plan: pocos campos (nombre, contacto, objetivo opcional).
 * Se envía a POST /api/inquiries. Si el servidor no responde, el error
 * ofrece seguir por WhatsApp para no perder la consulta.
 */
export function InquiryForm({ fixedPlan, tone = 'light' }: { fixedPlan?: Plan; tone?: 'light' | 'dark' }) {
  const [pref, setPref] = useState<Pref>('whatsapp');
  const [sending, setSending] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [result, setResult] = useState<InquiryResult | null>(null);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const get = (k: string) => String(f.get(k) ?? '').trim();
    setSending(true);
    setErrors([]);
    try {
      setResult(
        await post<InquiryResult>('/inquiries', {
          name: get('name'),
          contactPreference: pref,
          phone: pref === 'whatsapp' ? get('phone') : undefined,
          email: pref === 'email' ? get('email') : undefined,
          planSlug: fixedPlan?.slug ?? (get('planSlug') || undefined),
          goal: get('goal') || undefined,
          message: get('message') || undefined,
          consent: f.get('consent') === 'on',
        }),
      );
    } catch (err) {
      setErrors(err instanceof ApiError ? err.messages : ['No pudimos enviar la consulta.']);
    } finally {
      setSending(false);
    }
  }

  const fallbackWa = whatsappLink(`Hola Noelia, quiero consultar${fixedPlan ? ` por: ${fixedPlan.name}` : ' por tus planes'}.`);

  if (result) {
    return (
      <div role="status" className={`rounded-3xl p-8 md:p-10 ${tone === 'dark' ? 'bg-bone text-ink' : 'bg-white'}`}>
        <p className="label text-success">Consulta enviada</p>
        <p className="mt-3 font-display text-4xl">Listo, ya la recibió.</p>
        <p className="mt-4 max-w-prose text-muted">
          Tu consulta{result.planName ? ` por ${result.planName}` : ''} quedó registrada. Si querés una respuesta más rápida, mandala también por
          WhatsApp: el mensaje ya está escrito.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <ButtonExternal href={result.whatsappUrl ?? fallbackWa} variant="primary">
            Enviar por WhatsApp
          </ButtonExternal>
          <Button variant="outline" onClick={() => setResult(null)}>
            Hacer otra consulta
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className={`space-y-6 rounded-3xl p-7 md:p-10 ${tone === 'dark' ? 'bg-bone text-ink' : 'bg-white'}`}>
      <div className="grid gap-6 sm:grid-cols-2">
        <TextField label="Nombre" name="name" autoComplete="name" minLength={2} maxLength={80} />
        {pref === 'whatsapp' ? (
          <TextField label="Celular" name="phone" type="tel" autoComplete="tel" inputMode="tel" placeholder="341 555 1234" />
        ) : (
          <TextField label="Email" name="email" type="email" autoComplete="email" />
        )}
      </div>
      <ChoiceGroup<Pref>
        legend="¿Por dónde preferís que te responda?"
        name="contactPreference"
        value={pref}
        onChange={setPref}
        options={[
          { value: 'whatsapp', label: 'WhatsApp' },
          { value: 'email', label: 'Email' },
        ]}
      />
      {!fixedPlan && (
        <SelectField label="Plan que te interesa" name="planSlug" optional defaultValue="">
          <option value="">Todavía no sé</option>
          {PLANS.map((p) => (
            <option key={p.slug} value={p.slug}>
              {p.name}
            </option>
          ))}
        </SelectField>
      )}
      <TextField label="Tu objetivo" name="goal" optional maxLength={120} placeholder="Ej.: ganar fuerza, bajar de peso, competir" />
      <TextArea label="Mensaje" name="message" optional maxLength={1000} rows={3} />
      <Checkbox name="consent" required label="Acepto que Noelia use estos datos solo para responder mi consulta." />
      <FormErrors messages={errors} />
      {errors.length > 0 && (
        <a href={fallbackWa} target="_blank" rel="noopener noreferrer" className="inline-block text-sm font-medium underline underline-offset-4">
          Escribir por WhatsApp
        </a>
      )}
      <div className="flex flex-wrap items-center gap-4 pt-2">
        <Button type="submit" variant="primary" size="lg" arrow disabled={sending}>
          {sending ? 'Enviando…' : fixedPlan ? `Pedir ${fixedPlan.name.toLowerCase()}` : 'Enviar consulta'}
        </Button>
        <p className="text-sm text-muted">Sin costo ni compromiso.</p>
      </div>
    </form>
  );
}
