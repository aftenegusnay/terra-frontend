import type { FieldDef, FieldValue } from './types';

export function etiquetaOpcion(field: FieldDef, valor: string): string {
  return field.options?.find((o) => o.value === valor)?.label ?? valor;
}

export function formatearValorCampo(field: FieldDef, valor: FieldValue): string {
  if (valor === undefined || valor === null || valor === '') return '—';

  if (field.type === 'select' || field.type === 'choice-cards') {
    return etiquetaOpcion(field, valor as string);
  }

  if (field.type === 'multi-choice' && Array.isArray(valor)) {
    return valor.map((v) => etiquetaOpcion(field, v)).join(', ') || '—';
  }

  if (field.type === 'number') {
    return field.unit ? `${valor} ${field.unit}` : String(valor);
  }

  if (field.type === 'date' && typeof valor === 'string') {
    const d = new Date(valor);
    if (!Number.isNaN(d.getTime())) {
      return d.toLocaleDateString('es-EC', { year: 'numeric', month: 'short', day: 'numeric' });
    }
  }

  return String(valor);
}
