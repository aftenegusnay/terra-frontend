import { useNavigate } from 'react-router-dom';
import OnboardingWizard from '../components/OnboardingWizard';
import { guardarPerfil, leerPerfil } from '../lib/storage';
import type { FormValues } from '../lib/types';

export default function Onboarding() {
  const navigate = useNavigate();
  const perfilExistente = leerPerfil();

  function completar(valores: FormValues) {
    guardarPerfil(valores);
    navigate('/dashboard', { replace: true });
  }

  return (
    <OnboardingWizard
      esEdicion={perfilExistente !== null}
      valoresIniciales={perfilExistente ?? undefined}
      onCompletar={completar}
      onCancelar={() => navigate('/dashboard', { replace: true })}
    />
  );
}
