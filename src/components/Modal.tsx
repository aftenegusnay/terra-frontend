import { useEffect } from 'react';
import type { ReactNode } from 'react';

export default function Modal({
  titulo,
  onCerrar,
  children,
}: {
  titulo: string;
  onCerrar: () => void;
  children: ReactNode;
}) {
  useEffect(() => {
    function onEscape(e: KeyboardEvent) {
      if (e.key === 'Escape') onCerrar();
    }
    document.addEventListener('keydown', onEscape);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onEscape);
      document.body.style.overflow = '';
    };
  }, [onCerrar]);

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-verde-tinta/55 p-10 px-4 backdrop-blur-[2px] animate-modal-fondo" onMouseDown={onCerrar}>
      <div
        className="w-full max-w-[560px] rounded-lg bg-crema shadow-[0_24px_60px_rgba(28,23,16,0.35)] animate-modal-panel"
        role="dialog"
        aria-modal="true"
        aria-label={titulo}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-crema-linea px-6 py-5">
          <h2 className="text-[1.2rem]">{titulo}</h2>
          <button
            type="button"
            className="p-1.5 text-base text-tierra hover:text-rojo"
            onClick={onCerrar}
            aria-label="Cerrar"
          >
            ✕
          </button>
        </div>
        <div className="max-h-[72vh] overflow-y-auto p-6">{children}</div>
      </div>
    </div>
  );
}