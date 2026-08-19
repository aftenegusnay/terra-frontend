import http from './http';
import type { Certificacion } from '../lib/storage';
import type { FormValues } from '../lib/types';

export type { Certificacion };

export async function listarCertificaciones(): Promise<Certificacion[]> {
  const { data } = await http.get<Certificacion[]>('/certificaciones');
  return data;
}

export async function crearCertificacion(valores: FormValues): Promise<Certificacion> {
  const { data } = await http.post<Certificacion>('/certificaciones', valores);
  return data;
}

export async function eliminarCertificacion(id: string): Promise<Certificacion[]> {
  const { data } = await http.delete<Certificacion[]>(`/certificaciones/${encodeURIComponent(id)}`);
  return data;
}
