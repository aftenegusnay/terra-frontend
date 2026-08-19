import { EUDR_FIELDS } from '../config/eudrFields';
import type { Certificacion } from '../lib/storage';
import { formatearValorCampo } from '../lib/format';
import './CertificationCard.css';

const CAMPOS_TITULO = new Set(['nombreLote', 'estado', 'notas']);

const ESTADO_ESTILO: Record<string, string> = {
  pendiente: 'estado--pendiente',
  en_revision: 'estado--revision',
  aprobado: 'estado--aprobado',
  rechazado: 'estado--rechazado',
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
    <article className="cert-card">
      <header className="cert-card__header">
        <div>
          <p className="cert-card__folio">
            {certificacion.codigoParcela ? String(certificacion.codigoParcela) : '—'}
          </p>
          <h3>{certificacion.nombreLote ? String(certificacion.nombreLote) : 'Sin nombre'}</h3>
        </div>
        <button
          type="button"
          className="cert-card__eliminar"
          onClick={() => onEliminar(certificacion.id)}
          aria-label="Eliminar certificación"
        >
          ✕
        </button>
      </header>

      <div className="cert-card__badges">
        {campoProducto && certificacion.producto && (
          <span className="cert-card__badge cert-card__badge--producto">
            {formatearValorCampo(campoProducto, certificacion.producto)}
          </span>
        )}
        {opcionEstado && (
          <span
            className={`cert-card__badge estado ${ESTADO_ESTILO[estadoValor ?? ''] ?? ''}`}
          >
            {opcionEstado.icon} {opcionEstado.label}
          </span>
        )}
      </div>

      <dl className="cert-card__datos">
        {camposSecundarios.map((campo) => {
          const valor = certificacion[campo.id];
          if (valor === undefined || valor === '' || valor === null) return null;
          return (
            <div key={campo.id} className="cert-card__dato">
              <dt>{campo.label}</dt>
              <dd>{formatearValorCampo(campo, valor)}</dd>
            </div>
          );
        })}
      </dl>

      {certificacion.notas && (
        <p className="cert-card__notas">{String(certificacion.notas)}</p>
      )}

      <footer className="cert-card__footer">
        Creada el {new Date(certificacion.creadaEn).toLocaleDateString('es-EC')}
      </footer>
    </article>
  );
}
