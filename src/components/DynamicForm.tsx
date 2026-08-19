import { useMemo, useState } from 'react';
import type { FieldDef, FieldValue, FormValues } from '../lib/types';
import DynamicField from './DynamicField';
import './DynamicForm.css';

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
  const [valores, setValores] = useState<FormValues>(valoresIniciales);

  const esValido = useMemo(
    () =>
      campos
        .filter((c) => c.required)
        .every((c) => {
          const v = valores[c.id];
          if (Array.isArray(v)) return v.length > 0;
          return v !== undefined && v !== '' && v !== null;
        }),
    [campos, valores],
  );

  function actualizar(id: string, value: FieldValue) {
    setValores((prev) => ({ ...prev, [id]: value }));
  }

  return (
    <form
      className="dyn-form"
      onSubmit={(e) => {
        e.preventDefault();
        if (esValido) onEnviar(valores);
      }}
    >
      {campos.map((campo) => (
        <DynamicField
          key={campo.id}
          field={campo}
          value={valores[campo.id]}
          onChange={(v) => actualizar(campo.id, v)}
        />
      ))}

      <div className="dyn-form__acciones">
        {onCancelar && (
          <button type="button" className="boton boton--linea" onClick={onCancelar}>
            Cancelar
          </button>
        )}
        <button type="submit" className="boton boton--verde" disabled={!esValido}>
          {textoEnviar}
        </button>
      </div>
    </form>
  );
}
