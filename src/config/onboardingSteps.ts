import type { OnboardingStep } from '../lib/types';

/**
 * Pasos del onboarding, al estilo de la bienvenida de Platzi: una pregunta
 * central por pantalla. Para agregar un campo nuevo, basta con añadir un
 * objeto al arreglo `campos` del paso correspondiente (o crear un paso
 * nuevo) — OnboardingWizard y DynamicField ya saben renderizarlo.
 */
export const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    id: 'bienvenida',
    icono: '🌱',
    titulo: '¿Cómo te llamas?',
    subtitulo: 'Así te vamos a reconocer dentro de TERRA LINK.',
    campos: [
      {
        id: 'nombreCompleto',
        label: 'Nombre completo',
        type: 'text',
        placeholder: 'Ej. María Fernanda Cevallos',
        required: true,
      },
    ],
  },
  {
    id: 'perfil',
    icono: '🧭',
    titulo: '¿Cuál describe mejor tu rol?',
    subtitulo: 'Vamos a adaptar tu panel según tu respuesta.',
    campos: [
      {
        id: 'perfilProductivo',
        label: 'Tipo de perfil',
        type: 'choice-cards',
        required: true,
        options: [
          { value: 'productor_individual', icon: '👤', label: 'Productor individual', descripcion: 'Manejo mi propio lote o finca' },
          { value: 'cooperativa', icon: '🤝', label: 'Cooperativa / asociación', descripcion: 'Agrupo a varios productores' },
          { value: 'exportador', icon: '🚢', label: 'Exportador / agroindustria', descripcion: 'Compro y despacho producción certificada' },
          { value: 'inversor', icon: '💼', label: 'Inversor / financiador', descripcion: 'Evalúo activos agrícolas para financiar' },
        ],
      },
    ],
  },
  {
    id: 'ubicacion',
    icono: '📍',
    titulo: '¿Dónde se ubica tu operación principal?',
    campos: [
      {
        id: 'pais',
        label: 'País',
        type: 'select',
        required: true,
        options: [
          { value: 'EC', label: 'Ecuador' },
          { value: 'CO', label: 'Colombia' },
          { value: 'PE', label: 'Perú' },
          { value: 'BR', label: 'Brasil' },
          { value: 'otro', label: 'Otro' },
        ],
      },
      {
        id: 'provincia',
        label: 'Provincia / departamento',
        type: 'text',
        placeholder: 'Ej. Pichincha',
        required: true,
      },
    ],
  },
  {
    id: 'produccion',
    icono: '🌾',
    titulo: '¿Cuál es tu producto principal?',
    subtitulo: 'Elige el cultivo que más represente tu operación.',
    campos: [
      {
        id: 'cultivoPrincipal',
        label: 'Cultivo o materia prima principal',
        type: 'choice-cards',
        required: true,
        options: [
          { value: 'cacao', icon: '🍫', label: 'Cacao' },
          { value: 'cafe', icon: '☕', label: 'Café' },
          { value: 'palma', icon: '🌴', label: 'Aceite de palma' },
          { value: 'soja', icon: '🫘', label: 'Soja' },
          { value: 'madera', icon: '🌲', label: 'Madera' },
          { value: 'caucho', icon: '🌳', label: 'Caucho' },
          { value: 'ganado', icon: '🐄', label: 'Ganado / bovinos' },
          { value: 'otro', icon: '🌿', label: 'Otro' },
        ],
      },
      {
        id: 'hectareas',
        label: 'Hectáreas aproximadas bajo manejo',
        type: 'number',
        placeholder: '0',
        unit: 'ha',
        min: 0,
      },
    ],
  },
  {
    id: 'contacto',
    icono: '✉️',
    titulo: '¿Cómo te contactamos?',
    subtitulo: 'Solo lo usamos para novedades sobre tus certificaciones.',
    campos: [
      {
        id: 'correo',
        label: 'Correo electrónico',
        type: 'email',
        placeholder: 'tucorreo@ejemplo.com',
        required: true,
      },
      {
        id: 'telefono',
        label: 'Teléfono / WhatsApp',
        type: 'tel',
        placeholder: '+593 99 999 9999',
      },
    ],
  },
  {
    id: 'objetivo',
    icono: '🎯',
    titulo: '¿Qué te gustaría lograr primero en TERRA LINK?',
    campos: [
      {
        id: 'objetivos',
        label: 'Selecciona todas las que apliquen',
        type: 'multi-choice',
        options: [
          { value: 'tokenizar', icon: '🪙', label: 'Tokenizar mi primer lote' },
          { value: 'credito', icon: '🏦', label: 'Acceder a crédito' },
          { value: 'eudr', icon: '📋', label: 'Sacar certificación EUDR' },
          { value: 'inversion', icon: '📈', label: 'Encontrar oportunidades de inversión' },
        ],
      },
    ],
  },
];
