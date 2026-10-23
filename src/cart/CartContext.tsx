import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useRef, useState, type ReactNode } from 'react';
import type { Product } from '@shared/types';

export interface CartLine {
  key: string;
  slug: string;
  name: string;
  flavor: string | null;
  size: string;
  image: string;
  unitPrice: number;
  quantity: number;
}

type Action =
  | { type: 'hydrate'; lines: CartLine[] }
  | { type: 'add'; line: CartLine }
  | { type: 'setQty'; key: string; quantity: number }
  | { type: 'remove'; key: string }
  | { type: 'clear' };

export const MAX_QTY = 20;
const STORAGE_KEY = 'np-cart-v2';

function reducer(state: CartLine[], action: Action): CartLine[] {
  switch (action.type) {
    case 'hydrate':
      return action.lines;
    case 'add': {
      const existing = state.find((l) => l.key === action.line.key);
      if (!existing) return [...state, action.line];
      return state.map((l) => (l.key === action.line.key ? { ...l, quantity: Math.min(MAX_QTY, l.quantity + action.line.quantity) } : l));
    }
    case 'setQty':
      return state.map((l) => (l.key === action.key ? { ...l, quantity: Math.max(1, Math.min(MAX_QTY, action.quantity)) } : l));
    case 'remove':
      return state.filter((l) => l.key !== action.key);
    case 'clear':
      return [];
  }
}

interface CartContextValue {
  lines: CartLine[];
  count: number;
  subtotal: number;
  isOpen: boolean;
  /** Se incrementa en cada «agregar»: el ícono del carrito lo usa para animarse. */
  bump: number;
  open: () => void;
  close: () => void;
  add: (product: Product, quantity: number, flavor: string | null) => void;
  setQuantity: (key: string, quantity: number) => void;
  remove: (key: string) => void;
  clear: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  // El estado inicial es vacío (igual en el prerender y en el navegador);
  // el carrito guardado se carga después de montar para no romper la hidratación.
  const [lines, dispatch] = useReducer(reducer, []);
  const [isOpen, setOpen] = useState(false);
  const [bump, setBump] = useState(0);
  const hydrated = useRef(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) dispatch({ type: 'hydrate', lines: JSON.parse(raw) as CartLine[] });
    } catch {
      /* sin almacenamiento disponible */
    }
    hydrated.current = true;
  }, []);

  useEffect(() => {
    if (!hydrated.current) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      /* el carrito vive solo en esta pestaña */
    }
  }, [lines]);

  const add = useCallback((product: Product, quantity: number, flavor: string | null) => {
    dispatch({
      type: 'add',
      line: {
        key: `${product.slug}::${flavor ?? ''}`,
        slug: product.slug,
        name: product.name,
        flavor,
        size: product.size,
        image: product.image.src,
        unitPrice: product.price,
        quantity,
      },
    });
    setBump((n) => n + 1);
  }, []);

  const value = useMemo<CartContextValue>(
    () => ({
      lines,
      count: lines.reduce((n, l) => n + l.quantity, 0),
      subtotal: lines.reduce((s, l) => s + l.unitPrice * l.quantity, 0),
      isOpen,
      bump,
      open: () => setOpen(true),
      close: () => setOpen(false),
      add,
      setQuantity: (key, quantity) => dispatch({ type: 'setQty', key, quantity }),
      remove: (key) => dispatch({ type: 'remove', key }),
      clear: () => dispatch({ type: 'clear' }),
    }),
    [lines, isOpen, bump, add],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart debe usarse dentro de <CartProvider>');
  return ctx;
}
