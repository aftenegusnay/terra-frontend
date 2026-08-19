import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProfileCard from '../components/ProfileCard';
import CertificationCard from '../components/CertificationCard';
import Modal from '../components/Modal';
import DynamicForm from '../components/DynamicForm';
import { EUDR_FIELDS } from '../config/eudrFields';
import {
  agregarCertificacion,
  descargarExportacion,
  eliminarCertificacion,
  type Certificacion,
} from '../lib/storage';
import type { FormValues } from '../lib/types';
import './Dashboard.css';

export default function Dashboard({
  perfil,
  certificacionesIniciales,
}: {
  perfil: FormValues;
  certificacionesIniciales: Certificacion[];
}) {
  const navigate = useNavigate();
  const [certificaciones, setCertificaciones] = useState(certificacionesIniciales);
  const [modalAbierto, setModalAbierto] = useState(false);

  function crearCertificacion(valores: FormValues) {
    const nueva = agregarCertificacion(valores);
    setCertificaciones((prev) => [nueva, ...prev]);
    setModalAbierto(false);
  }

  function borrarCertificacion(id: string) {
    setCertificaciones(eliminarCertificacion(id));
  }

  return (
    <div className="dash">
      <header className="dash__topbar">
        <div className="contenedor dash__topbar-inner">
          <span className="dash__marca">
            TERRA <strong>LINK</strong>
          </span>
          <div className="dash__acciones">
            <button type="button" className="boton boton--linea" onClick={descargarExportacion}>
              ⬇ Exportar JSON
            </button>
            <button
              type="button"
              className="boton boton--texto"
              onClick={() => navigate('/onboarding')}
            >
              Editar perfil
            </button>
          </div>
        </div>
      </header>

      <main className="contenedor dash__cuerpo">
        <ProfileCard perfil={perfil} />

        <section className="dash__certificaciones">
          <div className="dash__certificaciones-header">
            <div>
              <span className="eyebrow">Certificaciones EUDR</span>
              <h1>Tus lotes en proceso de certificación</h1>
            </div>
            <button
              type="button"
              className="boton boton--dorado"
              onClick={() => setModalAbierto(true)}
            >
              + Nueva certificación
            </button>
          </div>

          {certificaciones.length === 0 ? (
            <div className="dash__vacio">
              <p>Todavía no registras ninguna certificación EUDR.</p>
              <button
                type="button"
                className="boton boton--verde"
                onClick={() => setModalAbierto(true)}
              >
                Registrar la primera
              </button>
            </div>
          ) : (
            <div className="dash__grid">
              {certificaciones.map((c) => (
                <CertificationCard key={c.id} certificacion={c} onEliminar={borrarCertificacion} />
              ))}
            </div>
          )}
        </section>
      </main>

      {modalAbierto && (
        <Modal titulo="Nueva certificación EUDR" onCerrar={() => setModalAbierto(false)}>
          <DynamicForm
            campos={EUDR_FIELDS}
            textoEnviar="Guardar certificación"
            onEnviar={crearCertificacion}
            onCancelar={() => setModalAbierto(false)}
          />
        </Modal>
      )}
    </div>
  );
}
