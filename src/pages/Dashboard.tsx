import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProfileCard from '../components/ProfileCard';
import CertificationCard from '../components/CertificationCard';
import Modal from '../components/Modal';
import DynamicForm from '../components/DynamicForm';
import Button from '../components/ui/Button';
import { EUDR_FIELDS } from '../config/eudrFields';
import {
  crearCertificacion,
  eliminarCertificacion,
  listarCertificaciones,
  type Certificacion,
} from '../services/certificacion.service';
import { descargarExportacion } from '../lib/storage'; // ÚNICA excepción del spec
import type { FormValues } from '../lib/types';

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
    <div className="min-h-screen bg-crema">
      <header className="sticky top-0 z-20 border-b border-crema-linea bg-crema">
        <div className="contenedor flex h-16 items-center justify-between">
          <span className="font-display text-[1.1rem] text-verde-tinta">
            TERRA <strong className="text-dorado">LINK</strong>
          </span>
          <div className="flex items-center gap-2.5">
            <Button type="button" variant="linea" onClick={descargarExportacion}>
              ⬇ Exportar JSON
            </Button>
            <Button type="button" variant="texto" onClick={() => navigate('/onboarding')}>
              Editar perfil
            </Button>
          </div>
        </div>
      </header>

      <main className="contenedor grid items-start gap-8 pb-20 pt-8 lg:grid-cols-[280px_1fr]">
        <ProfileCard perfil={perfil} />

        <section>
          <div className="mb-[26px] flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="font-mono text-[0.72rem] uppercase tracking-[0.12em] text-tierra">
                Certificaciones EUDR
              </span>
              <h1 className="mt-2 text-[clamp(1.3rem,2.4vw,1.7rem)]">
                Tus lotes en proceso de certificación
              </h1>
            </div>
            <Button type="button" variant="dorado" onClick={() => setModalAbierto(true)}>
              + Nueva certificación
            </Button>
          </div>

          {estado.fase === 'cargando' && (
            <div className="animate-pulse py-16 text-center text-[0.95rem] text-tierra">
              Cargando…
            </div>
          )}

          {estado.fase === 'error' && (
            <div className="flex flex-col items-center gap-4 rounded-lg border border-rojo/40 bg-crema-card px-6 py-10 text-center">
              <p className="text-[0.95rem] text-tinta">No se pudieron cargar las certificaciones.</p>
              <Button type="button" variant="linea" onClick={() => setIntento((i) => i + 1)}>
                Reintentar
              </Button>
            </div>
          )}

          {estado.fase === 'listo' &&
            (estado.items.length === 0 ? (
              <div className="flex flex-col items-center gap-4 rounded-lg border-[1.5px] border-dashed border-crema-linea px-6 py-12 text-center text-tierra">
                <p>Todavía no registras ninguna certificación EUDR.</p>
                <Button type="button" variant="verde" onClick={() => setModalAbierto(true)}>
                  Registrar la primera
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-[18px]">
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