import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import type { Path } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ONBOARDING_STEPS } from '../config/onboardingSteps';
import { schemaFromSteps } from '../lib/schemas';
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
  const [pasoActual, setPasoActual] = useState(0);
  const [direccion, setDireccion] = useState<'adelante' | 'atras'>('adelante');

  const schema = useMemo(() => schemaFromSteps(ONBOARDING_STEPS), []);
  const { control, trigger, watch } = useForm<z.input<typeof schema>, unknown, z.output<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: construirDefaultValues(valoresIniciales),
    mode: 'onTouched',
  });

  const paso = ONBOARDING_STEPS[pasoActual];
  const totalPasos = ONBOARDING_STEPS.length;
  const progreso = ((pasoActual + 1) / totalPasos) * 100;
  const valores = watch();

  // Heurística by-step IDÉNTICA a hoy: required del paso no vacíos → Continuar habilitado.
  const camposRequeridosCompletos = paso.campos
    .filter((c) => c.required)
    .every((c) => {
      const v = valores[c.id];
      if (Array.isArray(v)) return v.length > 0;
      return v !== undefined && v !== '' && v !== null;
    });

  async function siguiente() {
    const idsPaso = paso.campos.map((c) => c.id) as Path<z.input<typeof schema>>[];
    const ok = await trigger(idsPaso, { shouldFocus: true }); // Promise<boolean>
    if (!ok) return; // errores visibles; no avanza
    if (pasoActual < totalPasos - 1) {
      setDireccion('adelante');
      setPasoActual((p) => p + 1);
    } else {
      onCompletar(valores as FormValues);
    }
  }

  function anterior() {
    if (pasoActual === 0) return;
    setDireccion('atras');
    setPasoActual((p) => p - 1);
  }

  const esUltimoPaso = pasoActual === totalPasos - 1;

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

function construirDefaultValues(iniciales: FormValues): Record<string, unknown> {
  const valores: Record<string, unknown> = {};
  for (const paso of ONBOARDING_STEPS) {
    for (const c of paso.campos) {
      valores[c.id] = iniciales[c.id];
    }
  }
  return valores; // undefined para no-provistos → campos registrados con shouldUnregister:false
}