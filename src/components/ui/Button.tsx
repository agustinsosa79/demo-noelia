import { useEffect, useRef, type AnchorHTMLAttributes, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { Link } from 'react-router';
import { magnetic } from '../../motion/micro';

/**
 * Variantes por intención:
 * - primary: acción principal (fucsia). Una por pantalla.
 * - dark / light: acción fuerte sobre fondo claro / oscuro.
 * - outline / outline-light: acción secundaria.
 * - text: enlace de acción terciaria.
 *
 * Microinteracción: al pasar el mouse, un relleno «barre» el botón de abajo
 * hacia arriba y la flecha avanza (CSS, 450 ms, solo transform).
 */
export type ButtonVariant = 'primary' | 'dark' | 'light' | 'outline' | 'outline-light' | 'text';

const variants: Record<ButtonVariant, { base: string; fill: string; hoverText: string }> = {
  primary: { base: 'bg-rose text-white', fill: 'bg-ink', hoverText: 'group-hover:text-white' },
  dark: { base: 'bg-ink text-bone', fill: 'bg-rose', hoverText: 'group-hover:text-white' },
  light: { base: 'bg-bone text-ink', fill: 'bg-rose', hoverText: 'group-hover:text-white' },
  outline: { base: 'text-ink ring-1 ring-ink/25 ring-inset', fill: 'bg-ink', hoverText: 'group-hover:text-bone' },
  'outline-light': { base: 'text-bone ring-1 ring-bone/35 ring-inset', fill: 'bg-bone', hoverText: 'group-hover:text-ink' },
  text: { base: 'text-ink', fill: '', hoverText: '' },
};

export const buttonClass = (variant: ButtonVariant = 'primary', size: 'md' | 'lg' = 'md', extra = '') =>
  variant === 'text'
    ? `group inline-flex items-center gap-2 text-[0.95rem] font-medium underline decoration-ink/25 underline-offset-[6px] transition-[text-decoration-color] hover:decoration-rose ${extra}`
    : `group relative isolate inline-flex items-center justify-center gap-3 overflow-hidden rounded-full font-medium whitespace-nowrap transition-colors duration-300 disabled:pointer-events-none disabled:opacity-50 ${
        size === 'lg' ? 'h-14 pr-2 pl-7 text-[1rem]' : 'h-12 pr-1.5 pl-6 text-[0.95rem]'
      } ${variants[variant].base} ${extra}`;

function Inner({ variant, children, arrow }: { variant: ButtonVariant; children: ReactNode; arrow: boolean }) {
  if (variant === 'text') {
    return (
      <>
        {children}
        {arrow && <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">→</span>}
      </>
    );
  }
  const v = variants[variant];
  return (
    <>
      <span
        aria-hidden="true"
        className={`absolute inset-0 -z-10 translate-y-[101%] rounded-full transition-transform duration-[450ms] ease-(--ease-out-expo) group-hover:translate-y-0 ${v.fill}`}
      />
      <span className={`transition-colors duration-300 ${v.hoverText} ${arrow ? '' : 'pr-4.5'}`}>{children}</span>
      {arrow && (
        <span
          aria-hidden="true"
          className={`relative grid size-9 place-items-center overflow-hidden rounded-full ${variant === 'primary' || variant === 'dark' ? 'bg-white/15' : 'bg-ink/8'} ${v.hoverText}`}
        >
          <svg viewBox="0 0 16 16" className="size-3.5 transition-transform duration-[450ms] ease-(--ease-out-expo) group-hover:translate-x-[180%]">
            <path d="M1 8h13M9 3l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="1.6" />
          </svg>
          <svg viewBox="0 0 16 16" className="absolute size-3.5 -translate-x-[180%] transition-transform duration-[450ms] ease-(--ease-out-expo) group-hover:translate-x-0">
            <path d="M1 8h13M9 3l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="1.6" />
          </svg>
        </span>
      )}
    </>
  );
}

function useMagnetic<T extends HTMLElement>(enabled: boolean) {
  const ref = useRef<T>(null);
  useEffect(() => (enabled && ref.current ? magnetic(ref.current, 0.18) : undefined), [enabled]);
  return ref;
}

interface Common {
  variant?: ButtonVariant;
  size?: 'md' | 'lg';
  arrow?: boolean;
  magnetic?: boolean;
  className?: string;
  children: ReactNode;
}

export function ButtonLink({ to, variant = 'primary', size, arrow = true, magnetic: mag = false, className = '', children }: Common & { to: string }) {
  const ref = useMagnetic<HTMLAnchorElement>(mag);
  return (
    <Link ref={ref} to={to} className={buttonClass(variant, size, className)}>
      <Inner variant={variant} arrow={arrow}>
        {children}
      </Inner>
    </Link>
  );
}

export function ButtonExternal({
  variant = 'primary',
  size,
  arrow = true,
  magnetic: mag = false,
  className = '',
  children,
  ...rest
}: Common & AnchorHTMLAttributes<HTMLAnchorElement>) {
  const ref = useMagnetic<HTMLAnchorElement>(mag);
  return (
    <a ref={ref} target="_blank" rel="noopener noreferrer" className={buttonClass(variant, size, className)} {...rest}>
      <Inner variant={variant} arrow={arrow}>
        {children}
        <span className="sr-only"> (se abre en otra pestaña)</span>
      </Inner>
    </a>
  );
}

export function Button({
  variant = 'primary',
  size,
  arrow = false,
  magnetic: mag = false,
  className = '',
  children,
  ...rest
}: Common & ButtonHTMLAttributes<HTMLButtonElement>) {
  const ref = useMagnetic<HTMLButtonElement>(mag);
  return (
    <button ref={ref} className={buttonClass(variant, size, className)} {...rest}>
      <Inner variant={variant} arrow={arrow}>
        {children}
      </Inner>
    </button>
  );
}
