import { Navigate, Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Onboarding from './pages/Onboarding';
import { usePerfil } from './hooks/usePerfil';

export default function App() {
  // D1: App posee usePerfil; Onboarding recibe props { perfil, error, onGuardado }.
  const { perfil, cargando, error, guardar } = usePerfil();

  if (cargando)
    return (
      <div className="flex min-h-screen items-center justify-center bg-crema text-[0.95rem] text-tierra animate-pulse">
        Cargando…
      </div>
    );

  return (
    <Routes>
      <Route path="/" element={<Navigate to={perfil ? '/dashboard' : '/onboarding'} replace />} />
      <Route
        path="/onboarding"
        element={<Onboarding perfil={perfil} error={error} onGuardado={guardar} />}
      />
      <Route
        path="/dashboard"
        element={perfil ? <Dashboard perfil={perfil} /> : <Navigate to="/onboarding" replace />}
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}