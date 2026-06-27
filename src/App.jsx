import { useEffect, useRef, useState } from 'react'
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import Viewfinder from './components/Viewfinder.jsx'
import Controls from './components/Controls.jsx'
import CaptionInput from './components/CaptionInput.jsx'
import FrameStrip from './components/FrameStrip.jsx'
import PrintOptions from './components/PrintOptions.jsx'
import { useCamera } from './hooks/useCamera.js'
import { captureVideoFrame, loadImage, renderComposite, renderPrintStrip } from './utils/canvas.js'
import { frames as builtInFrames } from './data/frames.js'

export default function App() {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const printImgRef = useRef(null)
  const photoFileInputRef = useRef(null)
  const frameFileInputRef = useRef(null)

  const {
    active: cameraActive,
    facingMode,
    start: startCamera,
    stop: stopCamera,
    switchCamera,
  } = useCamera(videoRef)

  const [photoImg, setPhotoImg] = useState(null) // HTMLImageElement da foto atual
  const [customFrames, setCustomFrames] = useState([])
  const [activeFrameId, setActiveFrameId] = useState(builtInFrames[0]?.id ?? null)
  const [caption, setCaption] = useState('')
  const [hasResult, setHasResult] = useState(false)
  const [printLayout, setPrintLayout] = useState('single')

  const allFrames = [...builtInFrames, ...customFrames]
  const activeFrame = allFrames.find((f) => f.id === activeFrameId) || null

  // Recompõe o canvas sempre que foto, moldura ou legenda mudarem
  useEffect(() => {
    async function run() {
      if (!photoImg || !canvasRef.current) return
      const frameImg = activeFrame ? await loadImage(activeFrame.src) : null
      renderComposite({ canvas: canvasRef.current, photoImg, frameImg, caption })
      setHasResult(true)
    }
    run()
  }, [photoImg, activeFrame, caption])

  async function handleToggleCamera() {
    if (cameraActive) {
      stopCamera()
      return
    }
    try {
      await startCamera()
      setHasResult(false)
    } catch {
      // erro já tratado dentro do hook
    }
  }

  async function handleShoot() {
    const img = await captureVideoFrame(videoRef.current, facingMode === 'user')
    setPhotoImg(img)
    stopCamera()
  }

  function handleUploadClick() {
    photoFileInputRef.current?.click()
  }

  function handleFileSelected(file) {
    const reader = new FileReader()
    reader.onload = async (ev) => {
      const img = await loadImage(ev.target.result)
      setPhotoImg(img)
    }
    reader.readAsDataURL(file)
  }

  function handleUploadFrame(file) {
    const url = URL.createObjectURL(file)
    const id = `custom-${Date.now()}`
    setCustomFrames((prev) => [
      ...prev,
      { id, name: file.name.replace(/\.png$/i, ''), desc: 'Moldura enviada por você', src: url },
    ])
    setActiveFrameId(id)
  }

  function handleDownload() {
    if (!canvasRef.current) return
    const link = document.createElement('a')
    link.download = 'foto-com-moldura.png'
    link.href = canvasRef.current.toDataURL('image/png')
    link.click()
  }

  function handlePrint() {
    if (!hasResult || !canvasRef.current || !printImgRef.current) return

    const sourceCanvas = canvasRef.current
    const targetCanvas =
      printLayout === 'single'
        ? sourceCanvas
        : renderPrintStrip({ sourceCanvas, copies: printLayout === 'strip4' ? 4 : 3 })

    const img = printImgRef.current
    img.onload = () => window.print()
    img.src = targetCanvas.toDataURL('image/png')
  }

  const frameIndex = allFrames.findIndex((f) => f.id === activeFrameId)
  const frameCounterLabel = `QUADRO ${String(frameIndex + 1).padStart(2, '0')}`

  return (
    <div className="app">
      <Header />

      <div className="stage">
        <div>
          <Viewfinder
            videoRef={videoRef}
            canvasRef={canvasRef}
            cameraActive={cameraActive}
            hasResult={hasResult}
            frameCounterLabel={frameCounterLabel}
            mirrorPreview={cameraActive && facingMode === 'user'}
          />

          <Controls
            cameraActive={cameraActive}
            onToggleCamera={handleToggleCamera}
            onSwitchCamera={switchCamera}
            onUploadClick={handleUploadClick}
            onFileSelected={handleFileSelected}
            onShoot={handleShoot}
            onDownload={handleDownload}
            onPrint={handlePrint}
            canShoot={cameraActive}
            canDownload={hasResult}
            fileInputRef={photoFileInputRef}
          />

          <CaptionInput value={caption} onChange={setCaption} />

          <PrintOptions value={printLayout} onChange={setPrintLayout} />
        </div>

        <FrameStrip
          frames={allFrames}
          activeFrameId={activeFrameId}
          onSelect={setActiveFrameId}
          onUploadFrame={handleUploadFrame}
          fileInputRef={frameFileInputRef}
        />
      </div>

      {/* Usada só durante a impressão — fica escondida na tela normal (ver .print-only no CSS) */}
      <img ref={printImgRef} className="print-only" alt="" />

      <Footer />
    </div>
  )
}