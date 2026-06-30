import CaptionInput from './CaptionInput.jsx'
import PrintOptions from './PrintOptions.jsx'

export default function ResultPanel({
  caption,
  onCaptionChange,
  printLayout,
  onPrintLayoutChange,
  onDownload,
  onPrint,
  onCancelPhoto,
  canDownload,
}) {
  return (
    <div data-step="3">
      <CaptionInput value={caption} onChange={onCaptionChange} />
      <PrintOptions value={printLayout} onChange={onPrintLayoutChange} />

      <div className="controls">
        <button className="btn-ghost" style={{ flex: 1 }} onClick={onCancelPhoto} disabled={!canDownload}>
          Cancelar foto
        </button>
      </div>

      <div className="controls controls-primary">
        <button className="btn-cyan" style={{ flex: 1 }} onClick={onDownload} disabled={!canDownload}>
          Baixar PNG
        </button>
        <button className="btn-ghost btn-icon" onClick={onPrint} disabled={!canDownload} aria-label="Imprimir foto">
          🖨️
        </button>
      </div>
    </div>
  )
}
