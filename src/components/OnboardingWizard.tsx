import { ONBOARDING_STEPS } from '../config/onboardingSteps';
import { useOnboardingWizard } from '../hooks/useOnboardingWizard';
import type { FormValues } from '../lib/types';
import DynamicFieldControl from './DynamicFieldControl';
import Button from './ui/Button';

export default function OnboardingWizard({
  esEdicion = false,
  valoresIniciales = {},
  onCompletar,
  onCancelar,
}: {
  esEdicion?: boolean;
  valoresIniciales?: FormValues;
  onCompletar: (valores: FormValues) => void;
  onCancelar?: () => void;
}) {
  // Thin container: la máquina del wizard (schema, validación, pasos,
  // heurística) vive en useOnboardingWizard (REQ-LIMPIO).
  const {
    control,
    paso,
    totalPasos,
    progreso,
    esUltimoPaso,
    camposRequeridosCompletos,
    siguiente,
    anterior,
    direccion,
  } = useOnboardingWizard({ esEdicion, valoresIniciales, onCompletar });

  // D13: la API del hook no expone el índice — se deriva aquí para el
  // "N de M" y el disabled de Atrás (findIndex sobre el id del paso).
  const pasoActual = ONBOARDING_STEPS.findIndex((p) => p.id === paso.id);

  return (
    <div className="flex min-h-screen flex-col bg-crema">
      <div className="h-[5px] w-full bg-crema-linea" aria-hidden="true">
        <div
          className="h-full bg-linear-to-r from-dorado to-verde transition-[width] duration-[400ms]"
          style={{ width: `${progreso}%` }}
        />
      </div>

      <header className="flex items-center justify-between px-[clamp(20px,5vw,48px)] py-[18px]">
        <button
          type="button"
          className="p-1.5 px-1 text-[0.88rem] font-medium text-tierra hover:text-verde-tinta disabled:pointer-events-none disabled:opacity-0"
          onClick={anterior}
          disabled={pasoActual === 0}
          aria-label="Paso anterior"
        >
          ← Atrás
        </button>
        <span className="font-mono text-[0.74rem] tracking-[0.06em] text-tierra">
          {pasoActual + 1} de {totalPasos}
        </span>
      </header>

      <main className="flex flex-1 items-center justify-center px-[clamp(20px,6vw,48px)] pb-10 pt-5">
        {/* Fix bug #2: animación direccional real — data-direccion gobierna la
            variante (adelante ≠ atrás); key={paso.id} ya fuerza el remount. */}
        <div
          key={paso.id}
          className="w-full max-w-[560px] animate-entrar text-center data-[direccion=atras]:animate-entrar-atras"
          data-direccion={direccion}
        >
          {paso.icono && <span className="mb-3.5 block text-[2.6rem]">{paso.icono}</span>}
          <h1 className="mb-2 text-[clamp(1.5rem,3.6vw,2.1rem)]">{paso.titulo}</h1>
          {paso.subtitulo && <p className="mb-[30px] text-[0.98rem] text-tierra">{paso.subtitulo}</p>}

          <div className={`${paso.subtitulo ? '' : 'mt-7'} text-left`}>
            {paso.campos.map((campo) => (
              <DynamicFieldControl
                key={campo.id}
                field={campo}
                name={campo.id}
                control={control}
                variant="onboarding"
              />
            ))}
          </div>
        </div>
      </main>

      <footer className="flex flex-col items-center justify-center gap-2.5 px-[clamp(20px,5vw,48px)] pb-10 pt-6">
        <Button
          type="button"
          variant="dorado"
          className="min-w-[220px]"
          onClick={siguiente}
          disabled={!camposRequeridosCompletos}
        >
          {esUltimoPaso ? 'Ir a mi panel' : 'Continuar'}
        </Button>
        {esEdicion && onCancelar && (
          <Button type="button" variant="linea" className="min-w-[220px]" onClick={onCancelar}>
            Cancelar
          </Button>
        )}
      </footer>
    </div>
  );
}