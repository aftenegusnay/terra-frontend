import { EUDR_FIELDS } from '../config/eudrFields';
import type { Certificacion } from '../lib/storage';
import { formatearValorCampo } from '../lib/format';

const CAMPOS_TITULO = new Set(['nombreLote', 'estado', 'notas']);

// Fix 4c de contraste WCAG: pendiente pasa de #8a651f (~4.2:1) a #6b4a15
// (~5.5:1). Los otros 3 estados ya cumplían y NO cambian.
const ESTADO_ESTILO: Record<string, string> = {
  pendiente: 'bg-dorado/18 text-[#6b4a15]',
  en_revision: 'bg-satelite/16 text-satelite',
  aprobado: 'bg-verde/16 text-verde',
  rechazado: 'bg-rojo/14 text-rojo',
};

export default function CertificationCard({
  certificacion,
  onEliminar,
}: {
  certificacion: Certificacion;
  onEliminar: (id: string) => void;
}) {
  const campoProducto = EUDR_FIELDS.find((f) => f.id === 'producto');
  const campoEstado = EUDR_FIELDS.find((f) => f.id === 'estado');
  const estadoValor = certificacion.estado as string | undefined;
  const opcionEstado = campoEstado?.options?.find((o) => o.value === estadoValor);

  // Todo lo demás se muestra dinámicamente: si se agrega un campo nuevo a
  // EUDR_FIELDS, aparece aquí automáticamente sin tocar este componente.
  const camposSecundarios = EUDR_FIELDS.filter(
    (f) => !CAMPOS_TITULO.has(f.id) && f.id !== 'producto',
  );

  return (
    <article className="flex flex-col rounded-lg border border-crema-linea bg-crema px-[22px] pb-[18px] pt-5 transition-[box-shadow,translate] duration-150 hover:-translate-y-px hover:shadow-[0_10px_26px_rgba(28,23,16,0.1)]">
      <header className="mb-2.5 flex items-start justify-between gap-2.5">
        <div>
          <p className="mb-1 font-mono text-[0.68rem] tracking-[0.04em] text-tierra">
            {certificacion.codigoParcela ? String(certificacion.codigoParcela) : '—'}
          </p>
          <h3 className="text-[1.08rem]">
            {certificacion.nombreLote ? String(certificacion.nombreLote) : 'Sin nombre'}
          </h3>
        </div>
        <button
          type="button"
          className="shrink-0 p-1 text-[0.85rem] text-tierra/60 hover:text-rojo"
          onClick={() => onEliminar(certificacion.id)}
          aria-label="Eliminar certificación"
        >
          ✕
        </button>
      </header>

      <div className="mb-3.5 flex flex-wrap gap-2">
        {campoProducto && certificacion.producto && (
          <span className="rounded-full bg-crema-card px-[9px] py-1 font-mono text-[0.68rem] tracking-[0.03em] capitalize text-tierra">
            {formatearValorCampo(campoProducto, certificacion.producto)}
          </span>
        )}
        {opcionEstado && (
          <span
            className={`rounded-full px-[9px] py-1 font-mono text-[0.68rem] tracking-[0.03em] ${
              ESTADO_ESTILO[estadoValor ?? ''] ?? ''
            }`}
          >
            {opcionEstado.icon} {opcionEstado.label}
          </span>
        )}
      </div>

      <dl className="mb-1.5 flex flex-col gap-2">
        {camposSecundarios.map((campo) => {
          const valor = certificacion[campo.id];
          if (valor === undefined || valor === '' || valor === null) return null;
          return (
            <div
              key={campo.id}
              className="flex justify-between gap-3 border-b border-dashed border-crema-linea pb-1.5 text-[0.82rem]"
            >
              <dt className="shrink-0 text-tierra">{campo.label}</dt>
              <dd className="text-right font-medium text-tinta">{formatearValorCampo(campo, valor)}</dd>
            </div>
          );
        })}
      </dl>

      {certificacion.notas && (
        <p className="mt-1.5 rounded bg-crema-card px-3 py-2.5 text-[0.8rem] text-tinta/78">
          {String(certificacion.notas)}
        </p>
      )}

      <footer className="mt-3.5 font-mono text-[0.64rem] text-tierra/70">
        Creada el {new Date(certificacion.creadaEn).toLocaleDateString('es-EC')}
      </footer>
    </article>
  );
}