import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import OnboardingWizard from '../components/OnboardingWizard';
import { getPerfil, guardarPerfil } from '../services/perfil.service';
import type { FormValues } from '../lib/types';

export default function Onboarding() {
  const navigate = useNavigate();
  const [perfilExistente, setPerfilExistente] = useState<FormValues | null | undefined>(undefined);
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    let activo = true;
    getPerfil().then((perfil) => {
      if (activo) setPerfilExistente(perfil);
    });
    return () => {
      activo = false;
    };
  }, []);

  async function completar(valores: FormValues) {
    if (guardando) return; // evita doble POST por doble click (OnboardingWizard no recibe disabled)
    setGuardando(true);
    try {
      await guardarPerfil(valores);
      navigate('/dashboard', { replace: true });
    } finally {
      setGuardando(false);
    }
  }

  if (perfilExistente === undefined) return <div className="onb-cargando">Cargando…</div>;

  return (
    <OnboardingWizard
      esEdicion={perfilExistente !== null}
      valoresIniciales={perfilExistente ?? undefined}
      onCompletar={completar}
      onCancelar={() => navigate('/dashboard', { replace: true })}
    />
  );
}
