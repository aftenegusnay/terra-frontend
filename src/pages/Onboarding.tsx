import { useNavigate } from 'react-router-dom';
import OnboardingWizard from '../components/OnboardingWizard';
import { guardarPerfil } from '../lib/storage';
import type { FormValues } from '../lib/types';

export default function Onboarding() {
  const navigate = useNavigate();

  function completar(valores: FormValues) {
    guardarPerfil(valores);
    navigate('/dashboard', { replace: true });
  }

  return <OnboardingWizard onCompletar={completar} />;
}
