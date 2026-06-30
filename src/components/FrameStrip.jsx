import { useEffect, useRef } from 'react'

export default function FrameStrip({ frames, activeFrameId, onSelect, onUploadFrame, fileInputRef }) {
  // Fix #6 — scroll active frame into view whenever selection changes
  const activeItemRef = useRef(null)

  useEffect(() => {
    activeItemRef.current?.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'smooth' })
  }, [activeFrameId])

  // Pre-compute category headers to avoid mutating variables inside .map()
  const itemsWithHeader = frames.map((frame, i) => ({
    frame,
    index: i,
    showHeader: i === 0 || frame.category !== frames[i - 1]?.category,
  }))

  return (
    <div className="strip-panel">
      <div className="strip-title">
        <span>Tira de molduras</span>
        <span>{frames.length} quadros</span>
      </div>

      <div className="filmstrip">
        {itemsWithHeader.map(({ frame, index, showHeader }) => {
          const isActive = frame.id === activeFrameId
          return (
            <div className="frame-item" key={frame.id} ref={isActive ? activeItemRef : null}>
              {showHeader && frame.category && (
                <div className="frame-group-label">{frame.category}</div>
              )}
              <button
                className={`frame-option ${isActive ? 'active' : ''}`}
                onClick={() => onSelect(frame.id)}
              >
                <span className="sprocket-num">{String(index + 1).padStart(2, '0')}</span>
                <span className={`swatch ${frame.src === null ? 'swatch--none' : ''}`}>
                  {frame.src ? (
                    <img src={frame.src} alt="" />
                  ) : (
                    // "Sem moldura" placeholder icon
                    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                      <rect x="4" y="4" width="32" height="32" rx="3" stroke="currentColor" strokeWidth="2" strokeDasharray="5 3"/>
                      <line x1="10" y1="10" x2="30" y2="30" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      <line x1="30" y1="10" x2="10" y2="30" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  )}
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