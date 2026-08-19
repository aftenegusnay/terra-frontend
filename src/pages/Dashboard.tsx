import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProfileCard from '../components/ProfileCard';
import CertificationCard from '../components/CertificationCard';
import Modal from '../components/Modal';
import DynamicForm from '../components/DynamicForm';
import { EUDR_FIELDS } from '../config/eudrFields';
import {
  crearCertificacion,
  eliminarCertificacion,
  listarCertificaciones,
  type Certificacion,
} from '../services/certificacion.service';
import { descargarExportacion } from '../lib/storage'; // ÚNICA excepción del spec
import type { FormValues } from '../lib/types';
import './Dashboard.css';

type EstadoCerts = { fase: 'cargando' } | { fase: 'error' } | { fase: 'listo'; items: Certificacion[] };

export default function Dashboard({ perfil }: { perfil: FormValues }) {
  const navigate = useNavigate();
  const [estado, setEstado] = useState<EstadoCerts>({ fase: 'cargando' });
  const [modalAbierto, setModalAbierto] = useState(false);
  const [creando, setCreando] = useState(false);
  const [intento, setIntento] = useState(0); // re-trigger del efecto (botón reintentar)

  useEffect(() => {
    let activo = true;
    setEstado({ fase: 'cargando' });
    listarCertificaciones()
      .then((items) => {
        if (activo) setEstado({ fase: 'listo', items });
      })
      .catch(() => {
        if (activo) setEstado({ fase: 'error' });
      });
    return () => {
      activo = false;
    };
  }, [intento]);

  async function crear(valores: FormValues) {
    if (creando) return;
    setCreando(true);
    try {
      const nueva = await crearCertificacion(valores);
      setEstado((prev) => (prev.fase === 'listo' ? { ...prev, items: [nueva, ...prev.items] } : prev));
      setModalAbierto(false);
    } finally {
      setCreando(false);
    }
  }

  async function borrar(id: string) {
    try {
      const restantes = await eliminarCertificacion(id);
      setEstado({ fase: 'listo', items: restantes });
    } catch (error) {
      console.error('No se pudo eliminar', error); // mantiene estado actual
    }
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

          {estado.fase === 'cargando' && <div className="dash__cargando">Cargando…</div>}

          {estado.fase === 'error' && (
            <div className="dash__error">
              <p>No se pudieron cargar las certificaciones.</p>
              <button
                type="button"
                className="boton boton--linea"
                onClick={() => setIntento((i) => i + 1)}
              >
                Reintentar
              </button>
            </div>
          )}

          {estado.fase === 'listo' &&
            (estado.items.length === 0 ? (
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
                {estado.items.map((c) => (
                  <CertificationCard key={c.id} certificacion={c} onEliminar={borrar} />
                ))}
              </div>
            ))}
        </section>
      </main>

      {modalAbierto && (
        <Modal titulo="Nueva certificación EUDR" onCerrar={() => setModalAbierto(false)}>
          <DynamicForm
            campos={EUDR_FIELDS}
            textoEnviar="Guardar certificación"
            onEnviar={crear}
            onCancelar={() => setModalAbierto(false)}
          />
        </Modal>
      )}
    </div>
  );
}
