import { useCallback, useEffect, useRef, useState } from 'react';
import {
  getPerfil as getPerfilDefault,
  guardarPerfil as guardarPerfilDefault,
} from '../services/perfil.service';
import type { FormValues } from '../lib/types';

export type EstadoPerfil = { fase: 'cargando' } | { fase: 'listo'; perfil: FormValues | null };

/**
 * Hook del perfil de onboarding: fetch + guardado viven aquí (REQ-LIMPIO).
 * D11: los servicios son inyectables (opciones) con defaults module-stable —
 * prepara tests con renderHook sin mockear módulos.
 */
export function usePerfil(opciones?: {
  getPerfil?: () => Promise<FormValues | null>;
  guardarPerfil?: (v: FormValues) => Promise<void>;
}): {
  perfil: FormValues | null;
  cargando: boolean;
  error: boolean;
  guardar(v: FormValues): Promise<void>;
  invalidar(): void;
} {
  const getPerfil = opciones?.getPerfil ?? getPerfilDefault;
  const guardarPerfil = opciones?.guardarPerfil ?? guardarPerfilDefault;
  const [estado, setEstado] = useState<EstadoPerfil>({ fase: 'cargando' });
  const [error, setError] = useState(false); // D12: última operación async falló (carga o guardado)
  const guardandoRef = useRef(false); // anti doble-click (guardar)

  // D2 (B1/A5): fetch ÚNICO al montar, SIN dep de location.pathname — la
  // navegación depende del estado (perfil), no del path → cero rebotes.
  useEffect(() => {
    let activo = true;
    getPerfil()
      .then((perfil) => {
        if (activo) {
          setEstado({ fase: 'listo', perfil });
          setError(false);
        }
      })
      .catch(() => {
        if (activo) {
          // B2 (S3): perfil null + error → App ruta / → wizard + banner,
          // nunca spinner infinito (D12).
          setEstado({ fase: 'listo', perfil: null });
          setError(true);
        }
      });
    return () => {
      activo = false;
    };
  }, [getPerfil]);

  const guardar = useCallback(
    async (valores: FormValues): Promise<void> => {
      if (guardandoRef.current) return; // ignora invocaciones concurrentes (anti doble-click)
      guardandoRef.current = true;
      try {
        await guardarPerfil(valores);
        // D2: setEstado directo — el perfil se refleja en App en el MISMO
        // commit que la navegación (B1); cero refetch, cero rebotes.
        setEstado({ fase: 'listo', perfil: valores });
        setError(false);
      } catch (err) {
        // D4 (B4): marca error para el banner y RETHROW — la página hace
        // await+catch: consume el error (sin unhandled rejection) y NO navega.
        setError(true);
        throw err;
      } finally {
        guardandoRef.current = false;
      }
    },
    [guardarPerfil],
  );

  const invalidar = useCallback(() => {
    // D3: no-op keeper — reservado para invalidación de caché futura.
    // B1 NO depende de él: guardar() actualiza el estado directamente (D2).
  }, []);

  return {
    perfil: estado.fase === 'cargando' ? null : estado.perfil,
    cargando: estado.fase === 'cargando',
    error,
    guardar,
    invalidar,
  };
}