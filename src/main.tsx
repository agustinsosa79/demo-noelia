import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router';
import { CartProvider } from './cart/CartContext';
import { routes } from './routes';
import './styles/index.css';

const router = createBrowserRouter(routes);
const app = (
  <StrictMode>
    <CartProvider>
      <RouterProvider router={router} />
    </CartProvider>
  </StrictMode>
);

const root = document.getElementById('root')!;
const clean = (p: string) => p.replace(/\/+$/, '') || '/';
// En producción cada ruta llega prerenderizada (SEO) y se hidrata. Si el HTML
// no corresponde a esta URL (fallback de SPA, p. ej. una 404) o estamos en
// desarrollo, se monta desde cero.
// La búsqueda y el orden de la tienda (?q=, ?orden=) cambian el listado respecto del HTML estático.
const filtered = /[?&](q|orden)=/.test(location.search);
if (root.firstElementChild && !filtered && root.dataset.prerendered && clean(root.dataset.prerendered) === clean(location.pathname)) {
  hydrateRoot(root, app);
} else {
  root.textContent = '';
  createRoot(root).render(app);
}
