import { useCallback, useEffect, useState } from 'react';
import {
  crearCertificacion,
  eliminarCertificacion,
  listarCertificaciones,
  type Certificacion,
} from '../services/certificacion.service';
import type { FormValues } from '../lib/types';

export type EstadoCerts = { fase: 'cargando' } | { fase: 'error' } | { fase: 'listo'; items: Certificacion[] };

/**
 * Hook de certificaciones EUDR: fetch + CRUD del dashboard viven aquí
 * (REQ-LIMPIO). Reemplaza el estado local + efecto + contador `intento`
 * que vivían en Dashboard.
 */
export function useCertificaciones(): {
  estado: EstadoCerts;
  reintentar(): void;
  crear(v: FormValues): Promise<boolean>;
  borrar(id: string): Promise<void>;
} {
  const [estado, setEstado] = useState<EstadoCerts>({ fase: 'cargando' });

  // D10 (S6): useCallback ESTABLE — sin contador `intento`. La carga inicial
  // (efecto) NO hace setState síncrono (el estado inicial ya es 'cargando'):
  // evita cascadas de render en el montaje. El cambio a 'cargando' durante
  // un reintento vive en la ruta del evento (botón), no en la del efecto.
  const cargar = useCallback(() => {
    listarCertificaciones()
      .then((items) => setEstado({ fase: 'listo', items }))
      .catch(() => setEstado({ fase: 'error' }));
  }, []);

  const reintentar = useCallback(() => {
    setEstado({ fase: 'cargando' });
    cargar();
  }, [cargar]);

  useEffect(() => {
    cargar(); // montaje: 'cargando' es el estado inicial → sin setState síncrono
  }, [cargar]);

  async function crear(valores: FormValues): Promise<boolean> {
    // D5 (S7/S8): Promise<boolean> — el contenedor decide cerrar el modal.
    // El hook NO posee estado UI del modal (glue del contenedor).
    try {
      const nueva = await crearCertificacion(valores);
      // B3 (S7): antepone el item SIEMPRE — funciona con fase 'error'
      // (transición error → listo) o 'listo' (copia preservada).
      setEstado((prev) =>
        prev.fase === 'listo' ? { ...prev, items: [nueva, ...prev.items] } : { fase: 'listo', items: [nueva] },
      );
      return true;
    } catch {
      return false; // S8: sin unhandled rejection; la lista no cambia
    }
  }

  async function borrar(id: string): Promise<void> {
    try {
      const restantes = await eliminarCertificacion(id);
      setEstado({ fase: 'listo', items: restantes });
    } catch (error) {
      console.error('No se pudo eliminar', error); // S9: mantiene estado actual
    }
  }

  return { estado, reintentar, crear, borrar };
}