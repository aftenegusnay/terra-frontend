import type { FieldDef, FieldValue } from '../lib/types';
import './DynamicField.css';

interface Props {
  field: FieldDef;
  value: FieldValue;
  onChange: (value: FieldValue) => void;
  /** Estilo grande tipo Platzi (una pregunta por pantalla) vs. compacto (formulario de tarjetas) */
  variant?: 'onboarding' | 'compacto';
}

export default function DynamicField({ field, value, onChange, variant = 'compacto' }: Props) {
  const inputId = `campo-${field.id}`;

  if (field.type === 'choice-cards') {
    return (
      <fieldset className={`campo campo--tarjetas campo--${variant}`}>
        <legend className="campo__label">
          {field.label}
          {field.required && <span className="campo__requerido">*</span>}
        </legend>
        <div className="campo__opciones">
          {field.options?.map((opt) => (
            <button
              type="button"
              key={opt.value}
              className={`opcion-tarjeta ${value === opt.value ? 'is-activa' : ''}`}
              onClick={() => onChange(opt.value)}
              aria-pressed={value === opt.value}
            >
              {opt.icon && <span className="opcion-tarjeta__icono">{opt.icon}</span>}
              <span className="opcion-tarjeta__texto">
                <span className="opcion-tarjeta__label">{opt.label}</span>
                {opt.descripcion && (
                  <span className="opcion-tarjeta__desc">{opt.descripcion}</span>
                )}
              </span>
            </button>
          ))}
        </div>
      </fieldset>
    );
  }

  if (field.type === 'multi-choice') {
    const seleccionados = Array.isArray(value) ? value : [];
    function toggle(v: string) {
      const set = new Set(seleccionados);
      if (set.has(v)) set.delete(v);
      else set.add(v);
      onChange(Array.from(set));
    }
    return (
      <fieldset className={`campo campo--tarjetas campo--${variant}`}>
        <legend className="campo__label">
          {field.label}
          {field.required && <span className="campo__requerido">*</span>}
        </legend>
        <div className="campo__opciones">
          {field.options?.map((opt) => (
            <button
              type="button"
              key={opt.value}
              className={`opcion-tarjeta ${seleccionados.includes(opt.value) ? 'is-activa' : ''}`}
              onClick={() => toggle(opt.value)}
              aria-pressed={seleccionados.includes(opt.value)}
            >
              {opt.icon && <span className="opcion-tarjeta__icono">{opt.icon}</span>}
              <span className="opcion-tarjeta__texto">
                <span className="opcion-tarjeta__label">{opt.label}</span>
              </span>
            </button>
          ))}
        </div>
      </fieldset>
    );
  }

  if (field.type === 'select') {
    return (
      <div className={`campo campo--${variant}`}>
        <label htmlFor={inputId} className="campo__label">
          {field.label}
          {field.required && <span className="campo__requerido">*</span>}
        </label>
        <select
          id={inputId}
          className="campo__control"
          value={(value as string) ?? ''}
          onChange={(e) => onChange(e.target.value)}
          required={field.required}
        >
          <option value="" disabled>
            Selecciona una opción
          </option>
          {field.options?.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    );
  }

  if (field.type === 'textarea') {
    return (
      <div className={`campo campo--${variant}`}>
        <label htmlFor={inputId} className="campo__label">
          {field.label}
          {field.required && <span className="campo__requerido">*</span>}
        </label>
        <textarea
          id={inputId}
          className="campo__control campo__control--textarea"
          value={(value as string) ?? ''}
          placeholder={field.placeholder}
          onChange={(e) => onChange(e.target.value)}
          required={field.required}
          rows={3}
        />
      </div>
    );
  }

  // text, email, tel, number, date
  return (
    <div className={`campo campo--${variant}`}>
      <label htmlFor={inputId} className="campo__label">
        {field.label}
        {field.required && <span className="campo__requerido">*</span>}
      </label>
      <div className="campo__control-wrap">
        <input
          id={inputId}
          className="campo__control"
          type={field.type}
          value={(value as string | number) ?? ''}
          placeholder={field.placeholder}
          min={field.min}
          max={field.max}
          onChange={(e) =>
            onChange(field.type === 'number' ? Number(e.target.value) : e.target.value)
          }
          required={field.required}
        />
        {field.unit && <span className="campo__unidad">{field.unit}</span>}
      </div>
      {field.helpText && <p className="campo__ayuda">{field.helpText}</p>}
    </div>
  );
}
