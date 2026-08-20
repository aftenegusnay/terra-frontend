import { z } from 'zod';
import type { FieldDef, OnboardingStep } from '../lib/types';

/** '0.180, -78.467' — decimal con signo, rangos |lat|<=90 |lon|<=180 embebidos. */
export const PATRON_DECIMAL =
  /^-?(?:90(?:\.0+)?|[0-8]?\d(?:\.\d+)?),\s*-?(?:180(?:\.0+)?|1[0-7]\d(?:\.\d+)?|[0-9]{1,2}(?:\.\d+)?)$/;

/** '0.180 S, 78.467 W' — hemisferio NS/EW, case-insensitive (placeholder del campo). */
export const PATRON_HEMISFERIO =
  /^(?:[0-8]?\d(?:\.\d+)?|90(?:\.0+)?)\s*[NS],\s*(?:(?:1[0-7]\d|[0-9]{1,2})(?:\.\d+)?|180(?:\.0+)?)\s*[EW]$/i;

export const PATRON_GPS = /(?:)/; // marcador: identity-comparison contra este RegExp en el builder

export const PATRON_TEL = /^\+?[\d\s()-]{7,20}$/;

const MENSAJE_REQUERIDO = 'Este campo es obligatorio';

function mensajeError(campo: FieldDef, porDefecto: string): string {
  return campo.mensajeError ?? porDefecto;
}

/** Mapa FieldType → builder Zod 4. Sin transforms; input == output. */
export function construirCamposSchema(campos: FieldDef[]): Record<string, z.ZodTypeAny> {
  const shape: Record<string, z.ZodTypeAny> = {};
  for (const campo of campos) {
    shape[campo.id] = builderCampo(campo);
  }
  return shape;
}

function builderCampo(campo: FieldDef): z.ZodTypeAny {
  const esRequerido = campo.required ?? false;
  const base = baseSchema(campo);
  return esRequerido ? base : base.optional();
}

function baseSchema(campo: FieldDef): z.ZodTypeAny {
  const requerido = campo.required ?? false;
  switch (campo.type) {
    case 'text':
    case 'textarea': {
      if (campo.pattern === PATRON_GPS) {
        // A1: GPS se valida como refine con hint de formato y rangos embebidos.
        return z
          .string()
          .trim()
          .refine((v) => PATRON_DECIMAL.test(v) || PATRON_HEMISFERIO.test(v), {
            error: 'Formato: "0.180 S, 78.467 W" o "0.180, -78.467"',
          });
      }
      const cadena = campo.pattern
        ? z.string().regex(campo.pattern, { error: mensajeError(campo, 'Formato inválido') })
        : z.string();
      return requerido ? cadena.trim().min(1, { error: MENSAJE_REQUERIDO }) : cadena;
    }
    case 'email':
      // A3: API top-level de Zod 4.
      return z.email({ error: 'Ingresa un correo válido' });
    case 'tel':
      return z.string().regex(PATRON_TEL, { error: 'Número de teléfono inválido' });
    case 'number': {
      const numero = camposConRango(campo);
      return numero;
    }
    case 'date':
      return z.iso.date({ error: 'Fecha inválida' });
    case 'select':
    case 'choice-cards': {
      const valores = (campo.options ?? []).map((o) => o.value);
      if (valores.length === 0) return z.string();
      if (valores.length > 50) return z.string(); // límite z.enum v4
      return z.enum(valores as [string, ...string[]], {
        error: requerido ? MENSAJE_REQUERIDO : 'Opción inválida',
      });
    }
    case 'multi-choice': {
      const valores = (campo.options ?? []).map((o) => o.value);
      if (valores.length === 0) return z.array(z.string());
      const items = z.enum(valores as [string, ...string[]], { error: 'Opción inválida' });
      return requerido ? z.array(items).min(1, { error: MENSAJE_REQUERIDO }) : z.array(items);
    }
    default:
      return z.string();
  }
}

function camposConRango(campo: FieldDef): z.ZodNumber {
  let n: z.ZodNumber = z.number({ error: 'Ingresa un número' });
  if (campo.min !== undefined) n = n.min(campo.min, { error: `El mínimo es ${campo.min}` });
  if (campo.max !== undefined) n = n.max(campo.max, { error: `El máximo es ${campo.max}` });
  return n;
}

/** Schema plano de todos los campos de un formulario (wizard: pasos aplanados). */
export function schemaFromFields<S extends Record<string, z.ZodTypeAny>>(shape: S): z.ZodObject<S> {
  return z.object(shape);
}

/** Aplana los pasos del onboarding en un único z.object con las keys exactas. */
export function schemaFromSteps(pasos: OnboardingStep[]): z.ZodObject<Record<string, z.ZodTypeAny>> {
  const shape: Record<string, z.ZodTypeAny> = {};
  for (const paso of pasos) {
    Object.assign(shape, construirCamposSchema(paso.campos));
  }
  return z.object(shape);
}