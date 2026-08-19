import { ONBOARDING_STEPS } from '../config/onboardingSteps';
import type { FormValues } from '../lib/types';
import { formatearValorCampo } from '../lib/format';
import './ProfileCard.css';

const TODOS_LOS_CAMPOS = ONBOARDING_STEPS.flatMap((paso) => paso.campos);

export default function ProfileCard({ perfil }: { perfil: FormValues }) {
  const nombre = (perfil.nombreCompleto as string) || 'Tu perfil';
  const iniciales = nombre
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join('');

  const resto = TODOS_LOS_CAMPOS.filter(
    (c) => c.id !== 'nombreCompleto' && perfil[c.id] !== undefined && perfil[c.id] !== '',
  );

  return (
    <aside className="perfil-card">
      <div className="perfil-card__avatar" aria-hidden="true">
        {iniciales || '🌱'}
      </div>
      <h2 className="perfil-card__nombre">{nombre}</h2>

      <dl className="perfil-card__datos">
        {resto.map((campo) => (
          <div key={campo.id} className="perfil-card__dato">
            <dt>{campo.label}</dt>
            <dd>{formatearValorCampo(campo, perfil[campo.id])}</dd>
          </div>
        ))}
      </dl>
    </aside>
  );
}
