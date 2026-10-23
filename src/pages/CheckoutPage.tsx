import { useState, type FormEvent, type ReactNode } from 'react';
import { useCart } from '../cart/CartContext';
import { Seo } from '../components/seo/Seo';
import { Button, ButtonExternal, ButtonLink } from '../components/ui/Button';
import { Checkbox, ChoiceGroup, FormErrors, TextArea, TextField } from '../components/ui/Fields';
import { whatsappLink } from '../config/site';
import { ApiError, post, type OrderResult } from '../lib/api';
import { formatPrice } from '../lib/format';
import { useSmoothScroll } from '../motion/SmoothScroll';

type Method = 'envio' | 'retiro';

function Step({ n, title, children }: { n: string; title: string; children: ReactNode }) {
  return (
    <fieldset className="rounded-3xl bg-white p-7 md:p-9">
      <legend className="sr-only">{title}</legend>
      <div aria-hidden="true" className="mb-7 flex items-baseline gap-4">
        <span className="font-mono text-sm text-rose">{n}</span>
        <span className="font-title text-2xl">{title}</span>
      </div>
      <div className="space-y-6">{children}</div>
    </fieldset>
  );
}

function Confirmation({ result }: { result: OrderResult }) {
  const { order, payment } = result;
  return (
    <div className="container-site pt-32 pb-24 md:pt-40">
      <Seo title="Pedido registrado" description="Confirmación de pedido." noindex />
      <div className="max-w-3xl">
        <p role="status" className="label text-success">
          Pedido registrado
        </p>
        <h1 className="mt-4 font-display text-display">Pedido {order.number}</h1>
        <div className="mt-8 rounded-3xl bg-white p-7">
          <p className="font-medium">Estado: pendiente de pago</p>
          <p className="mt-2 text-muted">{payment.message}</p>
          <p className="mt-2 text-muted">Noelia te va a contactar para coordinar el pago y la entrega.</p>
        </div>
        <ul className="mt-8 divide-y divide-line border-y border-line">
          {order.lines.map((l) => (
            <li key={`${l.productSlug}-${l.flavor}`} className="flex justify-between gap-4 py-4">
              <span>
                {l.quantity} × {l.name}
                {l.flavor && <span className="text-muted"> · {l.flavor}</span>}
              </span>
              <span className="font-mono">{formatPrice(l.lineTotal)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-4 flex justify-between">
          <span className="text-muted">Subtotal</span>
          <span className="font-mono text-xl">{formatPrice(order.subtotal)}</span>
        </div>
        <div className="mt-12 flex flex-wrap gap-3">
          <ButtonExternal href={whatsappLink(`Hola Noelia, hice el pedido ${order.number} en tu tienda.`)} variant="primary">
            Avisarle por WhatsApp
          </ButtonExternal>
          <ButtonLink to="/tienda" variant="outline">
            Seguir comprando
          </ButtonLink>
        </div>
      </div>
    </div>
  );
}

/**
 * Checkout en una sola página y tres bloques (Baymard: menos pasos y campos
 * reduce el abandono). No hay pasarela de pagos: el pedido queda pendiente y
 * se dice explícitamente que no se cobra nada.
 */
export default function CheckoutPage() {
  const { lines, subtotal, clear } = useCart();
  const { scrollTo } = useSmoothScroll();
  const [method, setMethod] = useState<Method>('envio');
  const [sending, setSending] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [result, setResult] = useState<OrderResult | null>(null);

  if (result) return <Confirmation result={result} />;

  if (lines.length === 0) {
    return (
      <div className="container-site pt-32 pb-24 md:pt-40">
        <Seo title="Finalizar compra" description="Finalizar compra." noindex />
        <h1 className="font-display text-display">Finalizar compra</h1>
        <p className="mt-6 text-muted">No hay productos en el carrito.</p>
        <div className="mt-8">
          <ButtonLink to="/tienda" variant="dark">
            Ver suplementos
          </ButtonLink>
        </div>
      </div>
    );
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const get = (k: string) => String(f.get(k) ?? '').trim();
    setSending(true);
    setErrors([]);
    try {
      const res = await post<OrderResult>('/orders', {
        items: lines.map((l) => ({ productSlug: l.slug, quantity: l.quantity, flavor: l.flavor ?? undefined })),
        customer: { name: get('name'), email: get('email'), phone: get('phone') },
        delivery: method === 'envio' ? { method, address: get('address'), city: get('city'), postalCode: get('postalCode') } : { method },
        notes: get('notes') || undefined,
        acceptTerms: f.get('acceptTerms') === 'on',
      });
      setResult(res);
      clear();
      scrollTo(0, { immediate: true });
    } catch (err) {
      setErrors(err instanceof ApiError ? err.messages : ['No pudimos registrar el pedido.']);
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="container-site pt-32 pb-24 md:pt-40">
      <Seo title="Finalizar compra" description="Finalizar compra." noindex />
      <h1 className="font-display text-display">Finalizar compra</h1>
      <p className="mt-4 max-w-2xl text-muted">Completá tus datos. El pedido queda registrado y Noelia te contacta para coordinar el pago y la entrega.</p>
      <form onSubmit={onSubmit} className="mt-12 grid gap-8 lg:grid-cols-12">
        <div className="space-y-5 lg:col-span-7">
          <Step n="01" title="Tus datos">
            <TextField label="Nombre y apellido" name="name" autoComplete="name" minLength={2} maxLength={80} />
            <div className="grid gap-6 sm:grid-cols-2">
              <TextField label="Email" name="email" type="email" autoComplete="email" />
              <TextField label="Celular" name="phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="341 555 1234" />
            </div>
          </Step>
          <Step n="02" title="Entrega">
            <ChoiceGroup<Method>
              legend="¿Cómo lo recibís?"
              name="method"
              value={method}
              onChange={setMethod}
              options={[
                { value: 'envio', label: 'Envío a domicilio' },
                { value: 'retiro', label: 'Retiro' },
              ]}
            />
            {method === 'envio' ? (
              <>
                <TextField label="Dirección" name="address" autoComplete="street-address" placeholder="Calle, número, piso y depto." />
                <div className="grid gap-6 sm:grid-cols-[2fr_1fr]">
                  <TextField label="Localidad" name="city" autoComplete="address-level2" />
                  <TextField label="Código postal" name="postalCode" autoComplete="postal-code" maxLength={8} />
                </div>
                <p className="text-sm text-muted">El costo de envío se cotiza según tu zona y te lo confirman antes de pagar.</p>
              </>
            ) : (
              <p className="text-sm text-muted">El punto y el horario de retiro te los confirma Noelia.</p>
            )}
            <TextArea label="Notas" name="notes" optional maxLength={500} rows={3} />
          </Step>
          <Step n="03" title="Pago">
            <p className="rounded-2xl bg-sand px-5 py-4 text-[0.95rem]">
              <strong className="font-medium">No se cobra nada en este paso.</strong> El pago online todavía no está habilitado: Noelia te contacta
              para coordinar cómo pagar.
            </p>
            <Checkbox name="acceptTerms" required label="Entiendo que el pedido queda pendiente hasta coordinar el pago y acepto que usen mis datos para gestionarlo." />
          </Step>
          <FormErrors messages={errors} />
        </div>
        <aside aria-label="Resumen del pedido" className="lg:col-span-5">
          <div className="space-y-5 rounded-3xl bg-ink p-7 text-bone lg:sticky lg:top-28">
            <h2 className="font-title text-2xl">Tu pedido</h2>
            <ul className="divide-y divide-bone/12 text-[0.95rem]">
              {lines.map((l) => (
                <li key={l.key} className="flex items-center gap-4 py-3">
                  <img src={l.image} alt="" className="size-14 rounded-lg bg-shelf object-contain p-1" />
                  <span className="flex-1">
                    {l.quantity} × {l.name}
                    {l.flavor && <span className="block text-fog">{l.flavor}</span>}
                  </span>
                  <span className="font-mono whitespace-nowrap">{formatPrice(l.unitPrice * l.quantity)}</span>
                </li>
              ))}
            </ul>
            <div className="space-y-2 border-t border-bone/15 pt-5">
              <div className="flex justify-between">
                <span className="text-fog">Subtotal</span>
                <span className="font-mono text-xl">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm text-fog">
                <span>Envío</span>
                <span>{method === 'retiro' ? 'Sin cargo' : 'A cotizar'}</span>
              </div>
            </div>
            <Button type="submit" variant="primary" size="lg" arrow className="w-full justify-between" disabled={sending}>
              {sending ? 'Registrando…' : 'Confirmar pedido'}
            </Button>
            <p className="text-xs text-fog">El servidor recalcula los precios con el catálogo vigente.</p>
          </div>
        </aside>
      </form>
    </div>
  );
}
