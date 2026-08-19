import { delay, http, HttpResponse } from 'msw';
import {
  agregarCertificacion,
  eliminarCertificacion,
  guardarPerfil,
  leerCertificaciones,
  leerPerfil,
} from '../lib/storage';
import type { FormValues } from '../lib/types';

/** Latencia artificial para hacer visibles los estados de carga. 0 = sin latencia. */
export const LATENCIA_MOCK_MS = 300;

export const handlers = [
  http.get('/api/perfil', async () => {
    await delay(LATENCIA_MOCK_MS);
    const perfil = leerPerfil();
    return perfil ? HttpResponse.json(perfil) : new HttpResponse(null, { status: 404 });
  }),
  http.put('/api/perfil', async ({ request }) => {
    await delay(LATENCIA_MOCK_MS);
    const valores = (await request.json()) as FormValues;
    guardarPerfil(valores);
    return HttpResponse.json(valores);
  }),
  http.get('/api/certificaciones', async () => {
    await delay(LATENCIA_MOCK_MS);
    return HttpResponse.json(leerCertificaciones());
  }),
  http.post('/api/certificaciones', async ({ request }) => {
    await delay(LATENCIA_MOCK_MS);
    const valores = (await request.json()) as FormValues;
    const nueva = agregarCertificacion(valores); // genera id + creadaEn aquí (backend simulado)
    return HttpResponse.json(nueva, { status: 201 });
  }),
  http.delete('/api/certificaciones/:id', async ({ params }) => {
    await delay(LATENCIA_MOCK_MS);
    const restantes = eliminarCertificacion(String(params.id));
    return HttpResponse.json(restantes); // id inexistente → misma lista, 200
  }),
];
