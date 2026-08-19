import type { FieldDef } from '../lib/types';

/**
 * Campos del formulario de "Nueva certificación EUDR" en el dashboard.
 * Es un formulario dinámico independiente del onboarding: agregar un campo
 * aquí (por ejemplo "Certificado de deforestación cero") lo agrega
 * automáticamente al modal y a las tarjetas del CRM.
 */
export const EUDR_FIELDS: FieldDef[] = [
  {
    id: 'nombreLote',
    label: 'Nombre del lote o finca',
    type: 'text',
    placeholder: 'Ej. Finca El Rosal',
    required: true,
  },
  {
    id: 'codigoParcela',
    label: 'Código de parcela',
    type: 'text',
    placeholder: 'Ej. EC-PCH-04118',
    required: true,
    helpText: 'Identificador interno o catastral de la parcela.',
  },
  {
    id: 'producto',
    label: 'Producto (materia prima EUDR)',
    type: 'select',
    required: true,
    options: [
      { value: 'cacao', label: 'Cacao' },
      { value: 'cafe', label: 'Café' },
      { value: 'palma', label: 'Aceite de palma' },
      { value: 'soja', label: 'Soja' },
      { value: 'madera', label: 'Madera' },
      { value: 'caucho', label: 'Caucho' },
      { value: 'ganado', label: 'Ganado / bovinos' },
    ],
  },
  {
    id: 'coordenadas',
    label: 'Coordenadas GPS (lat, long)',
    type: 'text',
    placeholder: 'Ej. 0.180 S, 78.467 W',
    required: true,
    helpText: 'Geolocalización exigida por la Regulación EUDR para trazabilidad.',
  },
  {
    id: 'areaHectareas',
    label: 'Área del lote',
    type: 'number',
    unit: 'ha',
    min: 0,
    required: true,
  },
  {
    id: 'fechaCosecha',
    label: 'Fecha de cosecha o producción',
    type: 'date',
  },
  {
    id: 'proveedor',
    label: 'Proveedor / origen',
    type: 'text',
    placeholder: 'Ej. Cooperativa Villa Flora',
  },
  {
    id: 'paisOrigen',
    label: 'País de origen',
    type: 'select',
    options: [
      { value: 'EC', label: 'Ecuador' },
      { value: 'CO', label: 'Colombia' },
      { value: 'PE', label: 'Perú' },
      { value: 'BR', label: 'Brasil' },
      { value: 'otro', label: 'Otro' },
    ],
  },
  {
    id: 'estado',
    label: 'Estado de la certificación',
    type: 'choice-cards',
    required: true,
    options: [
      { value: 'pendiente', icon: '🕓', label: 'Pendiente' },
      { value: 'en_revision', icon: '🔍', label: 'En revisión' },
      { value: 'aprobado', icon: '✅', label: 'Aprobado' },
      { value: 'rechazado', icon: '⛔', label: 'Rechazado' },
    ],
  },
  {
    id: 'notas',
    label: 'Notas adicionales',
    type: 'textarea',
    placeholder: 'Observaciones, riesgos de deforestación detectados, etc.',
  },
];
