export default function CameraActions({
    cameraActive,
    onToggleCamera,
    onSwitchCamera,
    onUploadClick,
    onFileSelected,
    onShoot,
    canShoot,
    fileInputRef,
  }) {
    return (
      <div data-step="1">
        <div className="controls">
          <button className="btn-ghost" onClick={onToggleCamera}>
            {cameraActive ? '⏹ Desligar câmera' : '📷 Ligar câmera'}
          </button>
          {cameraActive && (
            <button className="btn-ghost btn-icon" onClick={onSwitchCamera} aria-label="Trocar câmera">
              🔄
            </button>
          )}
          <button className="btn-ghost" onClick={onUploadClick}>
            ⬆ Enviar foto
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) onFileSelected(file)
              e.target.value = ''
            }}
          />
        </div>
        <div className="controls controls-primary">
          <button className="btn-primary" style={{ flex: 1 }} onClick={onShoot} disabled={!canShoot}>
            Capturar
          </button>
        </div>
      </div>
    )
  }