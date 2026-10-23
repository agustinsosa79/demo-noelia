import { Link } from 'react-router';
import { QuantityStepper } from '../components/products/QuantityStepper';
import { formatPrice } from '../lib/format';
import { useCart } from './CartContext';

export function CartLines({ onNavigate }: { onNavigate?: () => void }) {
  const { lines, setQuantity, remove } = useCart();
  return (
    <ul className="divide-y divide-line">
      {lines.map((line) => (
        <li key={line.key} className="flex gap-4 py-5">
          <img src={line.image} alt="" width={88} height={88} className="size-22 shrink-0 rounded-xl bg-shelf object-contain p-2 mix-blend-multiply" />
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-3">
              <div>
                <Link to={`/producto/${line.slug}`} onClick={onNavigate} className="font-title leading-snug hover:text-rose">
                  {line.name}
                </Link>
                {line.flavor && <p className="text-sm text-muted">Sabor: {line.flavor}</p>}
              </div>
              <p className="font-mono text-[0.95rem] whitespace-nowrap">{formatPrice(line.unitPrice * line.quantity)}</p>
            </div>
            <div className="mt-3 flex items-center justify-between gap-3">
              <QuantityStepper size="sm" label={`Cantidad de ${line.name}`} value={line.quantity} onChange={(q) => setQuantity(line.key, q)} />
              <button type="button" onClick={() => remove(line.key)} className="text-sm text-muted underline-offset-4 hover:text-danger hover:underline">
                Quitar<span className="sr-only"> {line.name}</span>
              </button>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
