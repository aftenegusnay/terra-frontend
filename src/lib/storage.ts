import type { FormValues } from './types';

const CLAVE_PERFIL = 'terra_perfil';
const CLAVE_CERTIFICACIONES = 'terra_certificaciones';

export interface Certificacion extends FormValues {
  id: string;
  creadaEn: string;
}

/** Genera un id único con fallback manual si crypto.randomUUID no está disponible (contexto HTTP/LAN). */
export function generarId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `id-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

/** Lee el perfil de onboarding guardado, o null si el usuario no lo completó. */
export function leerPerfil(): FormValues | null {
  try {
    const raw = localStorage.getItem(CLAVE_PERFIL);
    return raw ? (JSON.parse(raw) as FormValues) : null;
  } catch {
    return null; // JSON corrupto no rompe la app
  }
}

export function guardarPerfil(valores: FormValues): void {
  localStorage.setItem(CLAVE_PERFIL, JSON.stringify(valores));
}

export function leerCertificaciones(): Certificacion[] {
  try {
    const raw = localStorage.getItem(CLAVE_CERTIFICACIONES);
    return raw ? (JSON.parse(raw) as Certificacion[]) : [];
  } catch {
    return [];
  }
}

export function guardarCertificaciones(items: Certificacion[]): void {
  localStorage.setItem(CLAVE_CERTIFICACIONES, JSON.stringify(items));
}

export function agregarCertificacion(valores: FormValues): Certificacion {
  const nueva: Certificacion = {
    ...valores,
    id: generarId(),
    creadaEn: new Date().toISOString(),
  };
  const actuales = leerCertificaciones();
  guardarCertificaciones([nueva, ...actuales]);
  return nueva;
}

export function eliminarCertificacion(id: string): Certificacion[] {
  const restantes = leerCertificaciones().filter((c) => c.id !== id);
  guardarCertificaciones(restantes);
  return restantes;
}

/**
 * Payload de exportación consumido por el proyecto de backend independiente.
 * Se mantiene plano y versionado para que agregar campos en el frontend
 * (onboarding o EUDR_FIELDS) no rompa el contrato: los campos nuevos
 * simplemente aparecen como nuevas llaves dentro de `perfil` o cada
 * certificación.
 */
export interface ExportacionTerra {
  version: 1;
  exportadoEn: string;
  perfil: FormValues | null;
  certificaciones: Certificacion[];
}

export function construirExportacion(): ExportacionTerra {
  return {
    version: 1,
    exportadoEn: new Date().toISOString(),
    perfil: leerPerfil(),
    certificaciones: leerCertificaciones(),
  };
}

/** Descarga el JSON completo (perfil + certificaciones) para el backend. */
export function descargarExportacion(): void {
  const data = construirExportacion();
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `terra-link-export-${Date.now()}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
