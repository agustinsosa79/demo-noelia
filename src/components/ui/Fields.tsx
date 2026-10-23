import { useId, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from 'react';

const control =
  'block w-full rounded-xl border border-line bg-white px-4 py-3.5 text-base text-ink placeholder:text-fog transition-[border-color,box-shadow] duration-200 hover:border-fog focus:border-ink focus:ring-4 focus:ring-ink/8 focus:outline-none aria-invalid:border-danger';

function Shell({ id, label, hint, error, optional, children }: { id: string; label: string; hint?: string; error?: string; optional?: boolean; children: ReactNode }) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="flex items-baseline justify-between gap-3 text-sm font-medium">
        {label}
        {optional && <span className="text-xs font-normal text-muted">Opcional</span>}
      </label>
      {children}
      {hint && !error && (
        <p id={`${id}-hint`} className="text-sm text-muted">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="text-sm text-danger">
          {error}
        </p>
      )}
    </div>
  );
}

type Common = { label: string; hint?: string; error?: string; optional?: boolean };

export function TextField({ label, hint, error, optional, ...rest }: Common & InputHTMLAttributes<HTMLInputElement>) {
  const id = useId();
  return (
    <Shell id={id} label={label} hint={hint} error={error} optional={optional}>
      <input
        id={id}
        className={control}
        aria-invalid={!!error || undefined}
        aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
        required={!optional}
        {...rest}
      />
    </Shell>
  );
}

export function TextArea({ label, hint, error, optional, ...rest }: Common & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const id = useId();
  return (
    <Shell id={id} label={label} hint={hint} error={error} optional={optional}>
      <textarea id={id} rows={4} className={`${control} resize-y`} aria-invalid={!!error || undefined} required={!optional} {...rest} />
    </Shell>
  );
}

const chevron = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' fill='none' stroke='%230b0b0c' stroke-width='1.6'/%3E%3C/svg%3E")`;

export function SelectField({ label, hint, error, optional, children, ...rest }: Common & SelectHTMLAttributes<HTMLSelectElement>) {
  const id = useId();
  return (
    <Shell id={id} label={label} hint={hint} error={error} optional={optional}>
      <select id={id} className={`${control} appearance-none bg-[length:12px] bg-[right_1.1rem_center] bg-no-repeat pr-10`} style={{ backgroundImage: chevron }} {...rest}>
        {children}
      </select>
    </Shell>
  );
}

/** Opciones tipo «píldora» con radios nativos (accesibles por teclado). */
export function ChoiceGroup<T extends string>({
  legend,
  name,
  options,
  value,
  onChange,
}: {
  legend: string;
  name: string;
  options: { value: T; label: string; disabled?: boolean }[];
  value: T | null;
  onChange: (value: T) => void;
}) {
  return (
    <fieldset>
      <legend className="mb-3 text-sm font-medium">{legend}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => (
          <label key={o.value} className="relative cursor-pointer">
            <input type="radio" name={name} value={o.value} checked={value === o.value} disabled={o.disabled} onChange={() => onChange(o.value)} className="peer sr-only" />
            <span className="inline-flex h-11 items-center rounded-full border border-line bg-white px-5 text-[0.95rem] transition-all duration-200 peer-checked:border-ink peer-checked:bg-ink peer-checked:text-bone peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-rose peer-disabled:opacity-40 hover:border-ink">
              {o.label}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export function Checkbox({ label, ...rest }: { label: ReactNode } & InputHTMLAttributes<HTMLInputElement>) {
  const id = useId();
  return (
    <label htmlFor={id} className="flex cursor-pointer items-start gap-3 text-sm text-muted">
      <input id={id} type="checkbox" className="mt-0.5 size-5 shrink-0 rounded accent-ink" {...rest} />
      <span>{label}</span>
    </label>
  );
}

export function FormErrors({ messages }: { messages: string[] }) {
  if (!messages.length) return null;
  return (
    <div role="alert" className="rounded-xl bg-danger/8 px-5 py-4 text-sm text-danger">
      {messages.length === 1 ? (
        <p>{messages[0]}</p>
      ) : (
        <ul className="list-disc space-y-1 pl-4">
          {messages.map((m) => (
            <li key={m}>{m}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
