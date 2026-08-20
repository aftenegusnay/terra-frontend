import { ONBOARDING_STEPS } from '../config/onboardingSteps';
import type { FormValues } from '../lib/types';
import { formatearValorCampo } from '../lib/format';

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

  // Sticky SOLO en desktop (REQ-DECOUPLE): el colapso a 1 columna lo maneja
  // el grid del Dashboard con lg: (mismo breakpoint 860px = 53.75rem).
  return (
    <aside className="h-fit rounded-lg bg-verde-tinta px-6 py-[26px] text-crema lg:sticky lg:top-6">
      <div className="mb-3.5 flex h-[52px] w-[52px] items-center justify-center rounded-full bg-dorado font-display text-[1.1rem] font-bold text-verde-tinta" aria-hidden="true">
        {iniciales || '🌱'}
      </div>
      <h2 className="mb-[18px] text-[1.15rem] text-crema">{nombre}</h2>

      <dl className="flex flex-col gap-3">
        {resto.map((campo) => (
          <div key={campo.id} className="flex flex-col gap-0.5 border-t border-crema/12 pt-2.5">
            <dt className="font-mono text-[0.62rem] uppercase tracking-[0.06em] text-dorado-suave">
              {campo.label}
            </dt>
            <dd className="text-[0.85rem] text-crema/90">{formatearValorCampo(campo, perfil[campo.id])}</dd>
          </div>
        ))}
      </dl>
    </aside>
  );
}