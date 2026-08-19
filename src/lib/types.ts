/**
 * Motor de formularios dinámicos: tanto el onboarding como el formulario de
 * certificaciones EUDR se arman a partir de listas de FieldDef. Agregar un
 * campo nuevo a cualquiera de los dos flujos es agregar un objeto a su
 * arreglo de configuración (ver src/config), no tocar componentes.
 */

export type FieldType =
  | 'text'
  | 'email'
  | 'tel'
  | 'number'
  | 'date'
  | 'textarea'
  | 'select'
  | 'choice-cards'
  | 'multi-choice';

export interface FieldOption {
  value: string;
  label: string;
  /** Emoji o símbolo corto mostrado en las tarjetas de selección tipo Platzi */
  icon?: string;
  descripcion?: string;
}

export interface FieldDef {
  id: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  required?: boolean;
  helpText?: string;
  unit?: string;
  options?: FieldOption[];
  /** Para type: 'number' */
  min?: number;
  max?: number;
}

export interface OnboardingStep {
  id: string;
  titulo: string;
  subtitulo?: string;
  /** Emoji grande mostrado sobre el título, al estilo de la bienvenida de Platzi */
  icono?: string;
  campos: FieldDef[];
}

/** Valor genérico que puede tomar cualquier campo del motor dinámico. */
export type FieldValue = string | string[] | number | undefined;

export type FormValues = Record<string, FieldValue>;
