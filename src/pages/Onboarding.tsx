import { useNavigate } from 'react-router-dom';
import OnboardingWizard from '../components/OnboardingWizard';
import type { FormValues } from '../lib/types';

export default function Onboarding({
  perfil,
  error,
  onGuardado,
}: {
  perfil: FormValues | null;
  error: boolean;
  onGuardado: (valores: FormValues) => Promise<void>;
}) {
  const navigate = useNavigate();

  async function completar(valores: FormValues) {
    try {
      // onGuardado (usePerfil) rethrow en fallo (D4): el error se consume aquí →
      // sin unhandled rejection (B4) y SIN navegación: el usuario permanece en el
      // wizard con sus valores para reintentar (S4).
      await onGuardado(valores);
      navigate('/dashboard', { replace: true });
    } catch {
      // B2/B4: el hook ya marcó error=true → el banner de abajo da feedback visible.
    }
  }

  return (
    <>
      {error && (
        <div className="flex justify-center bg-crema px-[clamp(20px,5vw,48px)] pt-4" role="alert">
          <p className="w-full max-w-[560px] rounded-lg border border-rojo/40 bg-crema-card px-4 py-3 text-center text-[0.88rem] text-tinta">
            No se pudo conectar con el servidor. Revisa tu conexión y vuelve a intentarlo.
          </p>
        </div>
      )}
      <OnboardingWizard
        esEdicion={perfil !== null}
        valoresIniciales={perfil ?? undefined}
        onCompletar={completar}
        onCancelar={() => navigate('/dashboard', { replace: true })}
      />
    </>
  );
}