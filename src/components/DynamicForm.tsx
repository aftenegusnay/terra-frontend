import { useFormularioDinamico } from '../hooks/useFormularioDinamico';
import type { FieldDef, FormValues } from '../lib/types';
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
  // Thin container: schema + validación viven en useFormularioDinamico (REQ-LIMPIO).
  const { control, isValid, enviar } = useFormularioDinamico(campos, valoresIniciales);

  return (
    <form onSubmit={enviar(onEnviar)}>
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