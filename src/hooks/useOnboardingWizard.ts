import { useMemo, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import type { Control, Path } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ONBOARDING_STEPS } from '../config/onboardingSteps';
import { schemaFromSteps } from '../lib/schemas';
import type { FormValues, OnboardingStep } from '../lib/types';

/**
 * Hook de la máquina del wizard de onboarding: schema + useForm + paso +
 * heurística by-step viven aquí (REQ-LIMPIO). D13: la API NO expone el
 * índice — el contenedor lo deriva con findIndex (ver OnboardingWizard).
 */
export function useOnboardingWizard(opciones: {
  esEdicion?: boolean;
  valoresIniciales?: FormValues;
  onCompletar: (valores: FormValues) => void | Promise<void>;
}): {
  control: Control<FormValues>;
  paso: OnboardingStep;
  totalPasos: number;
  progreso: number;
  esUltimoPaso: boolean;
  camposRequeridosCompletos: boolean;
  siguiente(): Promise<void>;
  anterior(): void;
  direccion: 'adelante' | 'atras';
} {
  const { valoresIniciales = {}, onCompletar } = opciones;
  const [pasoActual, setPasoActual] = useState(0);
  const [direccion, setDireccion] = useState<'adelante' | 'atras'>('adelante');
  const enviandoRef = useRef(false); // D9 (S12): guard anti doble invocación de onCompletar

  // C2: schema + defaultValues computados UNA vez (useMemo interno).
  const schema = useMemo(() => schemaFromSteps(ONBOARDING_STEPS), []);
  const defaultValues = useMemo(() => construirDefaultValues(valoresIniciales), [valoresIniciales]);

  const { control, trigger, watch } = useForm<z.input<typeof schema>, unknown, z.output<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues,
    mode: 'onTouched', // onboarding: valida al tocar (idéntico a hoy)
  });

  const paso = ONBOARDING_STEPS[pasoActual];
  const totalPasos = ONBOARDING_STEPS.length;
  const progreso = ((pasoActual + 1) / totalPasos) * 100;
  // D8: watch() sin args re-renderiza en cada cambio → valores frescos en el
  // closure de siguiente() y en la heurística (C3 MANTENIDA by-step).
  const valores = watch();

  const camposRequeridosCompletos = paso.campos
    .filter((c) => c.required)
    .every((c) => {
      const v = valores[c.id];
      if (Array.isArray(v)) return v.length > 0;
      return v !== undefined && v !== '' && v !== null;
    });

  async function siguiente(): Promise<void> {
    if (enviandoRef.current) return; // S12: segundo clic no duplica
    const idsPaso = paso.campos.map((c) => c.id) as Path<z.input<typeof schema>>[];
    const ok = await trigger(idsPaso, { shouldFocus: true }); // validación real (Zod)
    if (!ok) return; // errores visibles; no avanza

    if (pasoActual < totalPasos - 1) {
      setDireccion('adelante');
      setPasoActual((p) => p + 1);
    } else {
      // D9: último paso válido → onCompletar EXACTAMENTE una vez. Contrato:
      // onCompletar (la página) consume sus propios errores; el hook solo
      // evita duplicados con el guard en vuelo.
      enviandoRef.current = true;
      try {
        await onCompletar(valores as FormValues);
      } finally {
        enviandoRef.current = false;
      }
    }
  }

  function anterior() {
    if (pasoActual === 0) return;
    setDireccion('atras');
    setPasoActual((p) => p - 1);
  }

  return {
    control: control as Control<FormValues>, // D7: paths = ids runtime (cast verificado con tsc)
    paso,
    totalPasos,
    progreso,
    esUltimoPaso: pasoActual === totalPasos - 1,
    camposRequeridosCompletos,
    siguiente,
    anterior,
    direccion,
  };
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