import { useEffect, useState } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Onboarding from './pages/Onboarding';
import { getPerfil } from './services/perfil.service';
import type { FormValues } from './lib/types';

type EstadoPerfil = { fase: 'cargando' } | { fase: 'listo'; perfil: FormValues | null };

function usePerfil() {
  const location = useLocation();
  const [estado, setEstado] = useState<EstadoPerfil>({ fase: 'cargando' });

  useEffect(() => {
    let activo = true;
    setEstado({ fase: 'cargando' });
    getPerfil()
      .then((perfil) => {
        if (activo) setEstado({ fase: 'listo', perfil });
      })
      .catch(() => {
        if (activo) setEstado({ fase: 'listo', perfil: null });
      });
    return () => {
      activo = false;
    };
  }, [location.pathname]); // refetch al navegar: Onboarding guardó → /dashboard ya ve el perfil

  return estado;
}

export default function App() {
  const { fase, perfil } = usePerfil();
  if (fase === 'cargando') return <div className="app-cargando">Cargando…</div>;

  return (
    <Routes>
      <Route path="/" element={<Navigate to={perfil ? '/dashboard' : '/onboarding'} replace />} />
      <Route path="/onboarding" element={<Onboarding />} />
      <Route
        path="/dashboard"
        element={perfil ? <Dashboard perfil={perfil} /> : <Navigate to="/onboarding" replace />}
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
