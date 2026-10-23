import { useId, useRef, useState } from 'react';
import { gsap, prefersReducedMotion } from '../../motion/gsap';
import type { FaqItem } from '../../content/faq';

function Item({ item, tone }: { item: FaqItem; tone: 'light' | 'dark' }) {
  const [open, setOpen] = useState(false);
  const panel = useRef<HTMLDivElement>(null);
  const id = useId();

  const toggle = () => {
    const el = panel.current;
    const next = !open;
    setOpen(next);
    if (!el) return;
    if (prefersReducedMotion()) {
      el.style.height = next ? 'auto' : '0px';
      return;
    }
    gsap.to(el, { height: next ? 'auto' : 0, duration: 0.55, ease: 'expo.out' });
  };

  return (
    <div className={`border-b ${tone === 'dark' ? 'border-bone/15' : 'border-line'}`}>
      <h3>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={id}
          onClick={toggle}
          className="group flex w-full items-center justify-between gap-6 py-6 text-left text-lg font-medium md:text-xl"
        >
          {item.q}
          <span
            aria-hidden="true"
            className={`relative grid size-10 shrink-0 place-items-center rounded-full transition-colors duration-300 ${
              tone === 'dark' ? 'bg-bone/10 group-hover:bg-bone group-hover:text-ink' : 'bg-ink/6 group-hover:bg-ink group-hover:text-bone'
            }`}
          >
            <span className="absolute h-px w-3.5 bg-current" />
            <span className={`absolute h-3.5 w-px bg-current transition-transform duration-500 ease-(--ease-out-expo) ${open ? 'rotate-90 scale-0' : ''}`} />
          </span>
        </button>
      </h3>
      <div id={id} ref={panel} role="region" className="h-0 overflow-hidden" aria-hidden={!open}>
        <p className={`max-w-3xl pr-14 pb-7 ${tone === 'dark' ? 'text-fog' : 'text-muted'}`}>{item.a}</p>
      </div>
    </div>
  );
}

/** Acordeón accesible: botón con aria-expanded y panel con altura animada. */
export function Accordion({ items, tone = 'light' }: { items: FaqItem[]; tone?: 'light' | 'dark' }) {
  return (
    <div className={`border-t ${tone === 'dark' ? 'border-bone/15' : 'border-line'}`}>
      {items.map((item) => (
        <Item key={item.q} item={item} tone={tone} />
      ))}
    </div>
  );
}
