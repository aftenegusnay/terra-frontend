import axios from 'axios';
import http from './http';
import type { FormValues } from '../lib/types';

export async function getPerfil(): Promise<FormValues | null> {
  try {
    const { data } = await http.get<FormValues>('/perfil');
    return data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) return null;
    throw error;
  }
}

export async function guardarPerfil(valores: FormValues): Promise<void> {
  await http.put('/perfil', valores);
}
