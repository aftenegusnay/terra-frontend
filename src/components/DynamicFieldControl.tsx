import { useController } from 'react-hook-form';
import type { Control, FieldValues, Path } from 'react-hook-form';
import type { FieldDef, FieldValue } from '../lib/types';
import DynamicField from './DynamicField';

interface Props<S extends FieldValues> {
  field: FieldDef;
  name: string;
  control: Control<S>;
  /** Estilo del host: onboarding (Platzi) vs compacto (modal/CRM). */
  variant?: 'onboarding' | 'compacto';
}

/** Tipos string cuyo '' se normaliza a undefined (los number ya normalizan en DynamicField). */
const TIPOS_STRING = ['text', 'email', 'tel', 'textarea', 'date', 'select'] as const;

export default function DynamicFieldControl<S extends FieldValues>({
  field,
  name,
  control,
  variant = 'compacto',
}: Props<S>) {
  const { field: controlador, fieldState } = useController({ name: name as Path<S>, control });
  const mensaje = fieldState.error?.message;
  const esString = (TIPOS_STRING as readonly string[]).includes(field.type);
  const valor: FieldValue =
    controlador.value === undefined || controlador.value === null ? undefined : (controlador.value as FieldValue);

  function manejarCambio(v: FieldValue) {
    // '' → undefined en el límite: opcionales vacíos no se guardan (contrato storage mejorado).
    controlador.onChange(esString && v === '' ? undefined : v);
  }

  return (
    <DynamicField field={field} value={valor} onChange={manejarCambio} variant={variant} error={mensaje} />
  );
}