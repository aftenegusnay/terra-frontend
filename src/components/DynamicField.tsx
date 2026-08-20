import type { FieldDef, FieldValue } from '../lib/types';

interface Props {
  field: FieldDef;
  value: FieldValue;
  onChange: (value: FieldValue) => void;
  /** Estilo grande tipo Platzi (una pregunta por pantalla) vs. compacto (formulario de tarjetas) */
  variant?: 'onboarding' | 'compacto';
  /** Mensaje de validación (RHF). Oculto si falsy. */
  error?: string;
}

interface OpcionTarjetaProps {
  icon?: string;
  label: string;
  descripcion?: string;
  /** multi-choice no muestra descripcion hoy (decisión 8 del design) */
  mostrarDesc?: boolean;
  presionada: boolean;
  onClick: () => void;
}

// Reemplaza .opcion-tarjeta / .is-activa: la tarjeta activa se estiliza con la
// variante aria-pressed: (fix a11y D5) — el atributo aria-pressed ya existía
// en el markup y no cambia.
function OpcionTarjeta({
  icon,
  label,
  descripcion,
  mostrarDesc = true,
  presionada,
  onClick,
}: OpcionTarjetaProps) {
  return (
    <button
      type="button"
      className="flex cursor-pointer items-center gap-3 rounded-lg border-2 border-crema-linea bg-crema px-4 py-3.5 text-left transition-[border-color,translate,background-color] duration-150 hover:-translate-y-px hover:border-dorado-suave aria-pressed:border-dorado aria-pressed:bg-crema-card"
      onClick={onClick}
      aria-pressed={presionada}
    >
      {icon && <span className="shrink-0 text-[1.6rem] leading-none">{icon}</span>}
      <span className="flex flex-col gap-0.5">
        <span className="text-[0.92rem] font-semibold text-verde-tinta">{label}</span>
        {descripcion && mostrarDesc && (
          <span className="text-[0.76rem] text-tierra">{descripcion}</span>
        )}
      </span>
    </button>
  );
}

export default function DynamicField({ field, value, onChange, variant = 'compacto', error }: Props) {
  const inputId = `campo-${field.id}`;
  const errorId = `campo-${field.id}-error`;
  const esOnboarding = variant === 'onboarding';
  const esTarjetas = field.type === 'choice-cards' || field.type === 'multi-choice';

  // Ramas mutuamente excluyentes (decisión 5 del design): evita conflictos de
  // utilities duplicadas (p. ej. rounded vs rounded-lg en una misma clase).
  const claseLabel = `block font-semibold text-verde-tinta ${
    esTarjetas && esOnboarding
      ? 'mb-5 text-center text-base'
      : esOnboarding
        ? 'mb-3.5 text-center text-base'
        : 'mb-2 text-[0.86rem]'
  }`;

  const claseOpciones = esOnboarding
    ? 'grid grid-cols-[repeat(auto-fit,minmax(190px,1fr))] gap-3.5 max-[560px]:grid-cols-1'
    : 'grid grid-cols-2 gap-3 max-[560px]:grid-cols-1';

  // `border` default (1px, --default-border-width) + focus:border-dorado.
  // Fix #5: SIN outline-none — el foco visible global sigue activo.
  const claseControl = `w-full bg-crema text-[0.95rem] text-tinta transition-[border-color] duration-150 focus:border-dorado ${
    esOnboarding
      ? 'rounded-lg border-2 px-[18px] py-4 text-center text-[1.15rem]'
      : 'rounded border-[1.5px] px-3.5 py-3'
  }`;

  if (field.type === 'choice-cards') {
    return (
      <fieldset className="mb-5" aria-describedby={error ? errorId : undefined} aria-invalid={error ? true : undefined}>
        <legend className={claseLabel}>
          {field.label}
          {field.required && <span className="ml-[3px] text-dorado">*</span>}
        </legend>
        <div className={claseOpciones}>
          {field.options?.map((opt) => (
            <OpcionTarjeta
              key={opt.value}
              icon={opt.icon}
              label={opt.label}
              descripcion={opt.descripcion}
              presionada={value === opt.value}
              onClick={() => onChange(opt.value)}
            />
          ))}
        </div>
        {error && (
          <p id={errorId} className="mt-1.5 text-[0.76rem] text-rojo">
            {error}
          </p>
        )}
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
      <fieldset className="mb-5" aria-describedby={error ? errorId : undefined} aria-invalid={error ? true : undefined}>
        <legend className={claseLabel}>
          {field.label}
          {field.required && <span className="ml-[3px] text-dorado">*</span>}
        </legend>
        <div className={claseOpciones}>
          {field.options?.map((opt) => (
            <OpcionTarjeta
              key={opt.value}
              icon={opt.icon}
              label={opt.label}
              mostrarDesc={false}
              presionada={seleccionados.includes(opt.value)}
              onClick={() => toggle(opt.value)}
            />
          ))}
        </div>
        {error && (
          <p id={errorId} className="mt-1.5 text-[0.76rem] text-rojo">
            {error}
          </p>
        )}
      </fieldset>
    );
  }

  if (field.type === 'select') {
    return (
      <div className="mb-5">
        <label htmlFor={inputId} className={claseLabel}>
          {field.label}
          {field.required && <span className="ml-[3px] text-dorado">*</span>}
        </label>
        <select
          id={inputId}
          className={claseControl}
          value={(value as string) ?? ''}
          onChange={(e) => onChange(e.target.value)}
          required={field.required}
          aria-describedby={error ? errorId : undefined}
          aria-invalid={error ? true : undefined}
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
        {error && (
          <p id={errorId} className="mt-1.5 text-[0.76rem] text-rojo">
            {error}
          </p>
        )}
      </div>
    );
  }

  if (field.type === 'textarea') {
    return (
      <div className="mb-5">
        <label htmlFor={inputId} className={claseLabel}>
          {field.label}
          {field.required && <span className="ml-[3px] text-dorado">*</span>}
        </label>
        <textarea
          id={inputId}
          className={`${claseControl} resize-y`}
          value={(value as string) ?? ''}
          placeholder={field.placeholder}
          onChange={(e) => onChange(e.target.value)}
          required={field.required}
          rows={3}
          aria-describedby={error ? errorId : undefined}
          aria-invalid={error ? true : undefined}
        />
        {error && (
          <p id={errorId} className="mt-1.5 text-[0.76rem] text-rojo">
            {error}
          </p>
        )}
      </div>
    );
  }

  // text, email, tel, number, date
  return (
    <div className="mb-5">
      <label htmlFor={inputId} className={claseLabel}>
        {field.label}
        {field.required && <span className="ml-[3px] text-dorado">*</span>}
      </label>
      <div className="relative">
        <input
          id={inputId}
          className={claseControl}
          type={field.type}
          value={(value as string | number) ?? ''}
          placeholder={field.placeholder}
          min={field.min}
          max={field.max}
          onChange={(e) => {
            const v = e.target.value;
            onChange(field.type === 'number' ? (v === '' ? undefined : Number(v)) : v);
          }}
          required={field.required}
          aria-describedby={error ? errorId : undefined}
          aria-invalid={error ? true : undefined}
        />
        {field.unit && (
          <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 font-mono text-[0.78rem] text-tierra">
            {field.unit}
          </span>
        )}
      </div>
      {field.helpText && <p className="mt-1.5 text-[0.76rem] text-tierra">{field.helpText}</p>}
      {error && (
        <p id={errorId} className="mt-1.5 text-[0.76rem] text-rojo">
          {error}
        </p>
      )}
    </div>
  );
}