export default function Viewfinder({
  videoRef,
  canvasRef,
  cameraActive,
  hasResult,
  frameCounterLabel,
  mirrorPreview,
  rendering,
  cameraError,
  activeFrame,  // preview da moldura antes de capturar a foto
}) {
  const showEmpty = !cameraActive && !hasResult

  return (
    <div className="viewfinder">
      <div className={`vf-readout ${cameraActive ? '' : 'idle'}`}>
        <span>
          <span className="dot"></span>
          {cameraActive ? 'CÂMERA ATIVA' : 'EM ESPERA'}
        </span>
        <span>{frameCounterLabel}</span>
      </div>

      <div className="vf-frame">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          style={{
            display: cameraActive ? 'block' : 'none',
            transform: mirrorPreview ? 'scaleX(-1)' : 'none',
          }}
        />
        <canvas ref={canvasRef} style={{ display: hasResult ? 'block' : 'none' }} />

        {/* Frame preview overlay — aparece antes de capturar a foto */}
        {!hasResult && activeFrame?.src && (
          <img
            key={activeFrame.id}
            src={activeFrame.src}
            alt={activeFrame.name}
            className="vf-frame-overlay"
            aria-hidden="true"
          />
        )}

        {showEmpty && !cameraError && (
          <div className="vf-empty">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M4 7h2l1.5-2h9L18 7h2a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1z" />
              <circle cx="12" cy="13" r="3.5" />
            </svg>
            <span>
              Ligue a câmera ou envie uma foto
              <br />
              para começar
            </span>
          </div>
        )}

        {/* Fix #3 — camera permission / device error message */}
        {cameraError && (
          <div className="vf-camera-error">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <circle cx="12" cy="16" r="0.5" fill="currentColor" strokeWidth="2" />
            </svg>
            <span>{cameraError}</span>
          </div>
        )}

        {/* Fix #4 — rendering spinner overlay */}
        {rendering && (
          <div className="vf-rendering" aria-label="Processando…">
            <div className="vf-spinner" />
          </div>
        )}

        <div className="corner tl"></div>
        <div className="corner tr"></div>
        <div className="corner bl"></div>
        <div className="corner br"></div>
      </div>
    </div>
  )
}