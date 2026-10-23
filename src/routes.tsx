import type { RouteObject } from 'react-router';
import { Layout } from './components/layout/Layout';
import AboutPage from './pages/AboutPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import ContactPage from './pages/ContactPage';
import HomePage from './pages/HomePage';
import NotFoundPage from './pages/NotFoundPage';
import PlanDetailPage from './pages/PlanDetailPage';
import ProductPage from './pages/ProductPage';
import StorePage from './pages/StorePage';
import TrainingPage from './pages/TrainingPage';

// Las páginas se importan directo (sin lazy): cada URL llega prerenderizada y
// se hidrata de una, sin límites de Suspense que desincronicen el <head>.

/** `darkHero`: la página empieza con un encabezado oscuro (el header arranca transparente). */
const dark = { darkHero: true };

export const routes: RouteObject[] = [
  {
    element: <Layout />,
    children: [
      { path: '/', element: <HomePage />, handle: dark },
      { path: '/entrenamiento', element: <TrainingPage />, handle: dark },
      { path: '/entrenamiento/:slug', element: <PlanDetailPage />, handle: dark },
      { path: '/tienda', element: <StorePage />, handle: dark },
      { path: '/tienda/categoria/:category', element: <StorePage />, handle: dark },
      { path: '/producto/:slug', element: <ProductPage /> },
      { path: '/carrito', element: <CartPage /> },
      { path: '/checkout', element: <CheckoutPage /> },
      { path: '/sobre-noelia', element: <AboutPage />, handle: dark },
      { path: '/contacto', element: <ContactPage />, handle: dark },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
];
