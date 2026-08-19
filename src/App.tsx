import { Navigate, Route, Routes } from 'react-router-dom';
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';
import { leerCertificaciones, leerPerfil } from './lib/storage';

function RutaDashboard() {
  const perfil = leerPerfil();
  if (!perfil) return <Navigate to="/onboarding" replace />;
  return <Dashboard perfil={perfil} certificacionesIniciales={leerCertificaciones()} />;
}

function RutaInicio() {
  const perfil = leerPerfil();
  return <Navigate to={perfil ? '/dashboard' : '/onboarding'} replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<RutaInicio />} />
      <Route path="/onboarding" element={<Onboarding />} />
      <Route path="/dashboard" element={<RutaDashboard />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
