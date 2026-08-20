import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { FieldDef, FormValues } from '../lib/types';
import { construirCamposSchema, schemaFromFields } from '../lib/schemas';
import DynamicFieldControl from './DynamicFieldControl';
import Button from './ui/Button';

export default function DynamicForm({
  campos,
  valoresIniciales = {},
  textoEnviar = 'Guardar',
  onEnviar,
  onCancelar,
}: {
  campos: FieldDef[];
  valoresIniciales?: FormValues;
  textoEnviar?: string;
  onEnviar: (valores: FormValues) => void;
  onCancelar?: () => void;
}) {
  const shape = useMemo(() => construirCamposSchema(campos), [campos]);
  const schema = useMemo(() => schemaFromFields(shape), [shape]);
  const {
    control,
    handleSubmit,
    formState: { isValid },
  } = useForm<z.input<typeof schema>, unknown, z.output<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: objetoDefault(campos, valoresIniciales),
    mode: 'onChange', // isValid reactivo → disabled del submit (replica esValido con validación real)
  });

  return (
    <form onSubmit={handleSubmit((values) => onEnviar(values as FormValues))}>
      {campos.map((campo) => (
        <DynamicFieldControl key={campo.id} field={campo} name={campo.id} control={control} />
      ))}
      <div className="mt-2 flex justify-end gap-3 border-t border-crema-linea pt-[18px]">
        {onCancelar && (
          <Button type="button" variant="linea" onClick={onCancelar}>
            Cancelar
          </Button>
        )}
        <Button type="submit" variant="verde" disabled={!isValid}>
          {textoEnviar}
        </Button>
      </div>
    </form>
  );
}

function objetoDefault(campos: FieldDef[], iniciales: FormValues): Record<string, unknown> {
  const valores: Record<string, unknown> = {};
  for (const c of campos) valores[c.id] = iniciales[c.id];
  return valores;
}