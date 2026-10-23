import { MAX_QTY } from '../../cart/CartContext';

export function QuantityStepper({ value, onChange, label, size = 'md' }: { value: number; onChange: (v: number) => void; label: string; size?: 'sm' | 'md' }) {
  const h = size === 'sm' ? 'h-10' : 'h-14';
  const btn = `grid ${size === 'sm' ? 'w-10' : 'w-12'} place-items-center text-lg transition-colors hover:text-rose disabled:pointer-events-none disabled:opacity-30`;
  return (
    <div role="group" aria-label={label} className={`inline-flex ${h} items-stretch rounded-full border border-line bg-white`}>
      <button type="button" className={btn} onClick={() => onChange(value - 1)} disabled={value <= 1} aria-label="Restar una unidad">
        −
      </button>
      <input
        type="number"
        inputMode="numeric"
        min={1}
        max={MAX_QTY}
        value={value}
        aria-label="Cantidad"
        onChange={(e) => {
          const n = Number(e.target.value);
          if (Number.isFinite(n)) onChange(Math.max(1, Math.min(MAX_QTY, Math.round(n))));
        }}
        className="w-8 bg-transparent text-center font-mono [appearance:textfield] focus:outline-none [&::-webkit-inner-spin-button]:appearance-none"
      />
      <button type="button" className={btn} onClick={() => onChange(value + 1)} disabled={value >= MAX_QTY} aria-label="Sumar una unidad">
        +
      </button>
    </div>
  );
}
