import { StrictMode } from 'react';
import { prerender } from 'react-dom/static';
import { createStaticHandler, createStaticRouter, StaticRouterProvider } from 'react-router';
import { CATEGORIES, PRODUCTS } from '@shared/catalog';
import { PLANS } from '@shared/plans';
import { CartProvider } from './cart/CartContext';
import { site } from './config/site';
import { routes } from './routes';

/** Rutas que se generan como HTML estático. `index: false` = no va al sitemap. */
export const prerenderRoutes: { path: string; index: boolean }[] = [
  { path: '/', index: true },
  { path: '/entrenamiento', index: true },
  ...PLANS.map((p) => ({ path: `/entrenamiento/${p.slug}`, index: true })),
  { path: '/tienda', index: true },
  ...CATEGORIES.map((c) => ({ path: `/tienda/categoria/${c.slug}`, index: true })),
  // Fichas de demostración: se generan pero no se indexan hasta tener el catálogo real.
  ...PRODUCTS.map((p) => ({ path: `/producto/${p.slug}`, index: !p.isDemo })),
  { path: '/sobre-noelia', index: true },
  { path: '/contacto', index: true },
  { path: '/carrito', index: false },
  { path: '/checkout', index: false },
];

export const siteUrl = site.url;

export async function render(url: string): Promise<string> {
  const handler = createStaticHandler(routes);
  const context = await handler.query(new Request(`http://localhost${url}`));
  if (context instanceof Response) throw new Error(`Respuesta inesperada al prerenderizar ${url}`);
  const router = createStaticRouter(handler.dataRoutes, context);
  const { prelude } = await prerender(
    <StrictMode>
      <CartProvider>
        <StaticRouterProvider router={router} context={context} hydrate={false} />
      </CartProvider>
    </StrictMode>,
  );
  return new Response(prelude).text();
}
