import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation, useMatches } from 'react-router';
import { useCart } from '../../cart/CartContext';
import { nav, site, whatsappLink } from '../../config/site';
import { gsap, prefersReducedMotion } from '../../motion/gsap';
import { ButtonLink } from '../ui/Button';

function useScrollState() {
  const [state, setState] = useState({ scrolled: false, hidden: false });
  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      const goingDown = y > last;
      setState({ scrolled: y > 40, hidden: goingDown && y > 400 });
      last = y;
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return state;
}

function CartButton({ dark }: { dark: boolean }) {
  const { count, open, bump } = useCart();
  const badge = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    if (!bump || !badge.current || prefersReducedMotion()) return;
    gsap.fromTo(badge.current, { scale: 1.8 }, { scale: 1, duration: 0.6, ease: 'elastic.out(1, 0.35)', delay: 0.6 });
  }, [bump]);
  return (
    <button
      type="button"
      data-cart-target
      onClick={open}
      aria-label={`Abrir carrito, ${count} ${count === 1 ? 'producto' : 'productos'}`}
      className={`relative grid size-12 place-items-center rounded-full transition-colors duration-300 ${dark ? 'bg-bone/10 text-bone hover:bg-bone hover:text-ink' : 'bg-ink/6 text-ink hover:bg-ink hover:text-bone'}`}
    >
      <svg viewBox="0 0 24 24" className="size-5" aria-hidden="true">
        <path d="M5 8h14l-1.2 11.2a1 1 0 0 1-1 .8H7.2a1 1 0 0 1-1-.8L5 8Z" fill="none" stroke="currentColor" strokeWidth="1.6" />
        <path d="M9 10V7a3 3 0 0 1 6 0v3" fill="none" stroke="currentColor" strokeWidth="1.6" />
      </svg>
      <span
        ref={badge}
        aria-hidden="true"
        className={`absolute -top-0.5 -right-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-rose px-1 font-mono text-[0.68rem] text-white transition-opacity ${count ? 'opacity-100' : 'opacity-0'}`}
      >
        {count}
      </span>
    </button>
  );
}

function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) {
      d.showModal();
      if (!prefersReducedMotion()) {
        gsap.fromTo(d, { clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)', duration: 0.7, ease: 'expo.inOut' });
        gsap.from(d.querySelectorAll('[data-menu-item]'), { yPercent: 110, duration: 0.9, stagger: 0.06, delay: 0.25 });
      }
    }
    if (!open && d.open) d.close();
  }, [open]);
  return (
    <dialog
      ref={ref}
      aria-label="Menú"
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      className="m-0 h-dvh max-h-none w-full max-w-none bg-ink p-0 text-bone backdrop:bg-transparent open:flex open:flex-col"
    >
      <div className="container-site flex h-20 items-center justify-between">
        <span className="font-display text-xl">Noelia Perucci</span>
        <button type="button" onClick={onClose} className="h-11 rounded-full bg-bone/10 px-5 text-sm font-medium">
          Cerrar
        </button>
      </div>
      <nav aria-label="Menú móvil" className="container-site flex flex-1 flex-col justify-center gap-1 pb-10">
        {[{ to: '/', label: 'Inicio' }, ...nav].map((item) => (
          <div key={item.to} className="overflow-hidden">
            <NavLink
              data-menu-item
              to={item.to}
              end={item.to === '/'}
              className="block py-1 text-[clamp(2.6rem,12vw,4rem)] leading-[0.95] font-display aria-[current=page]:text-rose"
            >
              {item.label}
            </NavLink>
          </div>
        ))}
        <div className="mt-10 flex flex-col gap-2 text-fog">
          <a href={whatsappLink('Hola Noelia, quiero consultar por tus planes.')} target="_blank" rel="noopener noreferrer" className="hover:text-bone">
            WhatsApp {site.contact.whatsappDisplay}
          </a>
          <a href={site.contact.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-bone">
            Instagram {site.contact.instagramHandle}
          </a>
        </div>
      </nav>
    </dialog>
  );
}

export function Header() {
  const { scrolled, hidden } = useScrollState();
  const [menu, setMenu] = useState(false);
  const location = useLocation();
  const matches = useMatches();
  const darkHero = matches.some((m) => (m.handle as { darkHero?: boolean } | undefined)?.darkHero);
  const dark = darkHero && !scrolled;

  useEffect(() => setMenu(false), [location.pathname]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[transform,background-color,box-shadow] duration-500 ease-(--ease-out-expo) ${
        hidden && !menu ? '-translate-y-full' : 'translate-y-0'
      } ${dark ? 'bg-transparent' : 'bg-bone/85 shadow-[0_1px_0_var(--color-line)] backdrop-blur-xl'}`}
    >
      <div className={`container-site flex h-20 items-center justify-between gap-6 ${dark ? 'text-bone' : 'text-ink'}`}>
        <Link to="/" aria-label="Noelia Perucci, inicio" className="font-display text-[1.35rem] leading-none tracking-tight">
          Noelia Perucci
        </Link>
        <nav aria-label="Principal" className="hidden lg:block">
          <ul className="flex items-center gap-9">
            {nav.map((item) => (
              <li key={item.to}>
                <NavLink to={item.to} className="group relative py-2 text-[0.95rem]">
                  {({ isActive }) => (
                    <>
                      {item.label}
                      <span
                        aria-hidden="true"
                        className={`absolute inset-x-0 -bottom-0.5 h-px origin-left bg-current transition-transform duration-500 ease-(--ease-out-expo) ${isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`}
                      />
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center gap-2">
          <span className="hidden md:block">
            <ButtonLink to="/entrenamiento" variant={dark ? 'light' : 'dark'} arrow={false} className="h-12">
              Quiero entrenar
            </ButtonLink>
          </span>
          <CartButton dark={dark} />
          <button
            type="button"
            onClick={() => setMenu(true)}
            aria-expanded={menu}
            className={`grid size-12 place-items-center rounded-full lg:hidden ${dark ? 'bg-bone/10' : 'bg-ink/6'}`}
            aria-label="Abrir menú"
          >
            <span aria-hidden="true" className="flex w-5 flex-col gap-1.5">
              <span className="h-px w-full bg-current" />
              <span className="h-px w-full bg-current" />
            </span>
          </button>
        </div>
      </div>
      <MobileMenu open={menu} onClose={() => setMenu(false)} />
    </header>
  );
}
