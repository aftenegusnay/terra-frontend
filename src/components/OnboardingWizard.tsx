import { useMemo, useState } from 'react';
import { ONBOARDING_STEPS } from '../config/onboardingSteps';
import type { FieldValue, FormValues } from '../lib/types';
import DynamicField from './DynamicField';
import './OnboardingWizard.css';

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
  const [valores, setValores] = useState<FormValues>(valoresIniciales);
  const [direccion, setDireccion] = useState<'adelante' | 'atras'>('adelante');

  const paso = ONBOARDING_STEPS[pasoActual];
  const totalPasos = ONBOARDING_STEPS.length;
  const progreso = ((pasoActual + 1) / totalPasos) * 100;

  const camposRequeridosCompletos = useMemo(() => {
    return paso.campos
      .filter((c) => c.required)
      .every((c) => {
        const v = valores[c.id];
        if (Array.isArray(v)) return v.length > 0;
        return v !== undefined && v !== '' && v !== null;
      });
  }, [paso, valores]);

  function actualizarCampo(id: string, value: FieldValue) {
    setValores((prev) => ({ ...prev, [id]: value }));
  }

  function siguiente() {
    if (pasoActual < totalPasos - 1) {
      setDireccion('adelante');
      setPasoActual((p) => p + 1);
    } else {
      onCompletar(valores);
    }
  }

  function anterior() {
    if (pasoActual === 0) return;
    setDireccion('atras');
    setPasoActual((p) => p - 1);
  }

  const esUltimoPaso = pasoActual === totalPasos - 1;

  return (
    <div className="onb">
      <div className="onb__progreso-track" aria-hidden="true">
        <div className="onb__progreso-relleno" style={{ width: `${progreso}%` }} />
      </div>

      <header className="onb__header">
        <button
          type="button"
          className="onb__volver"
          onClick={anterior}
          disabled={pasoActual === 0}
          aria-label="Paso anterior"
        >
          ← Atrás
        </button>
        <span className="onb__contador">
          {pasoActual + 1} de {totalPasos}
        </span>
      </header>

      <main className="onb__contenido">
        <div key={paso.id} className={`onb__paso onb__paso--${direccion}`}>
          {paso.icono && <span className="onb__icono">{paso.icono}</span>}
          <h1 className="onb__titulo">{paso.titulo}</h1>
          {paso.subtitulo && <p className="onb__subtitulo">{paso.subtitulo}</p>}

          <div className="onb__campos">
            {paso.campos.map((campo) => (
              <DynamicField
                key={campo.id}
                field={campo}
                value={valores[campo.id]}
                onChange={(v) => actualizarCampo(campo.id, v)}
                variant="onboarding"
              />
            ))}
          </div>
        </div>
      </main>

      <footer className="onb__footer">
        <button
          type="button"
          className="boton boton--dorado onb__continuar"
          onClick={siguiente}
          disabled={!camposRequeridosCompletos}
        >
          {esUltimoPaso ? 'Ir a mi panel' : 'Continuar'}
        </button>
        {esEdicion && onCancelar && (
          <button type="button" className="boton boton--linea onb__cancelar" onClick={onCancelar}>
            Cancelar
          </button>
        )}
      </footer>
    </div>
  );
}
