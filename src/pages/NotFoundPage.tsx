import { Seo } from '../components/seo/Seo';
import { ButtonLink } from '../components/ui/Button';

export default function NotFoundPage() {
  return (
    <div className="container-site pt-36 pb-28 md:pt-44">
      <Seo title="Página no encontrada" description="La página que buscás no existe." noindex />
      <p className="font-mono text-sm text-rose">Error 404</p>
      <h1 className="mt-4 font-display text-display">Esta página no existe</h1>
      <p className="mt-6 max-w-md text-muted">Puede que el enlace haya cambiado. Seguí desde acá:</p>
      <div className="mt-10 flex flex-wrap gap-3">
        <ButtonLink to="/entrenamiento" variant="primary">
          Ver planes
        </ButtonLink>
        <ButtonLink to="/tienda" variant="dark">
          Ver suplementos
        </ButtonLink>
        <ButtonLink to="/" variant="outline">
          Ir al inicio
        </ButtonLink>
      </div>
    </div>
  );
}
