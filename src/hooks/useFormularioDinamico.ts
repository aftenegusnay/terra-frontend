import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import type { Control } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { FieldDef, FormValues } from '../lib/types';
import { construirCamposSchema, schemaFromFields } from '../lib/schemas';

type ModoValidacion = 'onChange' | 'onBlur' | 'onTouched' | 'onSubmit' | 'all';

/**
 * Hook del formulario dinámico (modal EUDR, etc.): absorbe schema + useForm
 * para que los containers queden sin lógica de negocio (REQ-LIMPIO).
 * Dedup C2: shape + schema derivados de `campos` con useMemo (misma instancia
 * mientras los campos no cambien).
 */
export function useFormularioDinamico(
  campos: FieldDef[],
  valoresIniciales?: FormValues,
  mode: ModoValidacion = 'onChange',
): {
  control: Control<FormValues>;
  isValid: boolean;
  /** Curried (D6): recibe el onEnviar del contenedor y devuelve el handler del form. */
  enviar: (onEnviar: (valores: FormValues) => void) => () => void;
} {
  const shape = useMemo(() => construirCamposSchema(campos), [campos]);
  const schema = useMemo(() => schemaFromFields(shape), [shape]);

  const {
    control,
    handleSubmit,
    formState: { isValid },
  } = useForm<z.input<typeof schema>, unknown, z.output<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: objetoDefault(campos, valoresIniciales ?? {}),
    mode, // default 'onChange': isValid reactivo → disabled del submit (idéntico a hoy)
  });

  function enviar(onEnviar: (valores: FormValues) => void): () => void {
    return () => {
      void handleSubmit((values) => onEnviar(values as FormValues))();
    };
  }

  // D7: cast pragmático — las paths del motor son los ids runtime (no se puede
  // tipar Record<string, FieldValue> contra el shape zod). Verificado con tsc.
  return { control: control as Control<FormValues>, isValid, enviar };
}

function objetoDefault(campos: FieldDef[], iniciales: FormValues): Record<string, unknown> {
  const valores: Record<string, unknown> = {};
  for (const c of campos) valores[c.id] = iniciales[c.id];
  return valores;
}