import type { ButtonHTMLAttributes } from 'react';

// Reemplazo de las clases .boton / .boton--* de index.css (BLOQUE LEGACY).
// La API extiende los atributos nativos de <button>: los consumidores migran
// cambiando solo className → <Button>, sin tocar type/onClick/disabled/aria.
type VarianteBoton = 'dorado' | 'verde' | 'linea' | 'texto';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: VarianteBoton;
}

// `border` = 1px (vía --default-border-width); el color lo define la variante.
const BASE =
  'inline-flex items-center justify-center gap-2 rounded border px-6 py-3 text-[0.95rem] font-semibold transition-[translate,background-color,opacity] duration-150';

const VARIANTES: Record<VarianteBoton, string> = {
  dorado: 'border-transparent bg-dorado text-verde-tinta hover:bg-dorado-suave',
  verde: 'border-transparent bg-verde-tinta text-crema hover:bg-verde-oscuro',
  linea: 'border-crema-linea text-tinta hover:border-tierra',
  texto: 'border-transparent px-2 text-tierra hover:text-verde-tinta',
};

export default function Button({
  variant = 'dorado',
  type = 'button',
  disabled = false,
  className = '',
  ...attributes
}: Props) {
  const clases = `${BASE} ${VARIANTES[variant]} ${
    disabled ? 'cursor-not-allowed opacity-40' : 'hover:-translate-y-px'
  }${className ? ` ${className}` : ''}`;

  return <button type={type} disabled={disabled} className={clases} {...attributes} />;
}