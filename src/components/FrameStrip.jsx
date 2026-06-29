export default function FrameStrip({ frames, activeFrameId, onSelect, onUploadFrame, fileInputRef }) {
  let lastCategory = null

  return (
    <div className="strip-panel">
      <div className="strip-title">
        <span>Tira de molduras</span>
        <span>{frames.length} quadros</span>
      </div>

      <div className="filmstrip">
        {frames.map((frame, i) => {
          const showHeader = frame.category && frame.category !== lastCategory
          lastCategory = frame.category
          return (
            <div className="frame-item" key={frame.id}>
              {showHeader && <div className="frame-group-label">{frame.category}</div>}
              <button
                className={`frame-option ${frame.id === activeFrameId ? 'active' : ''}`}
                onClick={() => onSelect(frame.id)}
              >
                <span className="sprocket-num">{String(i + 1).padStart(2, '0')}</span>
                <span className="swatch">
                  <img src={frame.src} alt="" />
                </span>
                <span>
                  <div className="name">{frame.name}</div>
                  <div className="desc">{frame.desc}</div>
                </span>
              </button>
            </div>
          )
        })}
      </div>

      <div className="upload-frame-row">
        <button className="btn-ghost" style={{ width: '100%' }} onClick={() => fileInputRef.current?.click()}>
          + Adicionar minha moldura
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/webp,image/svg+xml"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) onUploadFrame(file)
            e.target.value = ''
          }}
        />
        <div className="upload-frame-hint">PNG, WebP ou SVG com fundo transparente no centro funciona melhor.</div>
      </div>
    </div>
  )
}