/**
 * Cliente de la API. La web lee planes y productos desde /shared (sin red);
 * la API se usa solo para enviar consultas y pedidos, que se validan en el
 * servidor.
 */
const BASE = import.meta.env.VITE_API_URL ?? '/api';

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly messages: string[],
  ) {
    super(messages.join(' '));
  }
}

export const OFFLINE_MESSAGE = 'No pudimos enviar tus datos porque el servidor no responde. Podés escribirle a Noelia por WhatsApp.';

export async function post<T>(path: string, data: unknown): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${BASE}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  } catch {
    throw new ApiError(0, [OFFLINE_MESSAGE]);
  }
  const body = await res.json().catch(() => null);
  if (!res.ok) {
    // El proxy de desarrollo responde 500/502/504 cuando la API está apagada.
    if (res.status >= 500 || !body?.messages) throw new ApiError(res.status, [OFFLINE_MESSAGE]);
    throw new ApiError(res.status, body.messages);
  }
  return body as T;
}

export interface InquiryResult {
  id: string;
  createdAt: string;
  planName: string | null;
  whatsappUrl: string | null;
}

export interface OrderResult {
  order: {
    id: string;
    number: string;
    lines: { productSlug: string; name: string; flavor: string | null; unitPrice: number; quantity: number; lineTotal: number }[];
    itemCount: number;
    subtotal: number;
    shippingCost: number | null;
  };
  payment: { status: 'not_configured' | 'redirect'; redirectUrl: string | null; message: string };
}
