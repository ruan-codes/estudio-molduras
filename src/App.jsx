import { useEffect, useRef, useState } from 'react'
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import Viewfinder from './components/Viewfinder.jsx'
import StepProgress from './components/StepProgress.jsx'
import CameraActions from './components/CameraActions.jsx'
import ResultPanel from './components/ResultPanel.jsx'
import FrameStrip from './components/FrameStrip.jsx'
import { useCamera } from './hooks/useCamera.js'
import { captureVideoFrame, loadImage, renderComposite, renderPrintStrip } from './utils/canvas.js'
import { frames as builtInFrames } from './data/frames.js'

export default function App() {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const printImgRef = useRef(null)
  const photoFileInputRef = useRef(null)
  const frameFileInputRef = useRef(null)
  const blobUrlsRef = useRef([])

  const {
    active: cameraActive,
    error: cameraError,
    facingMode,
    start: startCamera,
    stop: stopCamera,
    switchCamera,
  } = useCamera(videoRef)

  const [photoImg, setPhotoImg] = useState(null)
  const [customFrames, setCustomFrames] = useState([])
  const [activeFrameId, setActiveFrameId] = useState(builtInFrames[0]?.id ?? null)
  const [caption, setCaption] = useState('')
  const [hasResult, setHasResult] = useState(false)
  const [printLayout, setPrintLayout] = useState('single')
  const [rendering, setRendering] = useState(false)

  const [step, setStep] = useState(1)
  const nextStep = () => setStep((s) => Math.min(3, s + 1))
  const prevStep = () => setStep((s) => Math.max(1, s - 1))

  const allFrames = [...builtInFrames, ...customFrames]
  const activeFrame = allFrames.find((f) => f.id === activeFrameId) || null

  useEffect(() => {
    async function run() {
      if (!photoImg || !canvasRef.current) return
      setRendering(true)
      try {
        const frameImg = activeFrame?.src ? await loadImage(activeFrame.src) : null
        renderComposite({ canvas: canvasRef.current, photoImg, frameImg, caption })
        setHasResult(true)
      } finally {
        setRendering(false)
      }
    }
    run()
  }, [photoImg, activeFrame, caption])

  useEffect(() => {
    return () => {
      blobUrlsRef.current.forEach((url) => URL.revokeObjectURL(url))
    }
  }, [])

  async function handleToggleCamera() {
    if (cameraActive) { stopCamera(); return }
    try {
      await startCamera()
      setHasResult(false)
    } catch {
      // erro visível via cameraError
    }
  }

  async function handleShoot() {
    const img = await captureVideoFrame(videoRef.current, facingMode === 'user')
    setPhotoImg(img)
    stopCamera()
    setStep(2)
  }

  function handleUploadClick() {
    photoFileInputRef.current?.click()
  }

  function handleFileSelected(file) {
    const reader = new FileReader()
    reader.onload = async (ev) => {
      const img = await loadImage(ev.target.result)
      setPhotoImg(img)
      setStep(2)
    }
    reader.readAsDataURL(file)
  }

  function handleUploadFrame(file) {
    const url = URL.createObjectURL(file)
    blobUrlsRef.current.push(url)
    const id = `custom-${Date.now()}`
    setCustomFrames((prev) => [
      ...prev,
      { id, name: file.name.replace(/\.(png|webp|svg)$/i, ''), desc: 'Moldura enviada por você', src: url },
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
    <div className="app" data-active-step={step}>
      <Header />

      <div className="stage">
        {/* Coluna esquerda: viewfinder + controles de câmera */}
        <div className="stage-left">
          <Viewfinder
            videoRef={videoRef}
            canvasRef={canvasRef}
            cameraActive={cameraActive}
            hasResult={hasResult}
            frameCounterLabel={frameCounterLabel}
            mirrorPreview={cameraActive && facingMode === 'user'}
            rendering={rendering}
            cameraError={cameraError}
            activeFrame={activeFrame}
          />

          {/* Barra de progresso do wizard — só aparece em telas mobile */}
          <StepProgress step={step} onBack={prevStep} />

          <CameraActions
            cameraActive={cameraActive}
            onToggleCamera={handleToggleCamera}
            onSwitchCamera={switchCamera}
            onUploadClick={handleUploadClick}
            onFileSelected={handleFileSelected}
            onShoot={handleShoot}
            canShoot={cameraActive}
            fileInputRef={photoFileInputRef}
          />
        </div>

        {/* Coluna direita: seleção de moldura + resultado */}
        <div className="stage-right">
          <div data-step="2">
            <FrameStrip
              frames={allFrames}
              activeFrameId={activeFrameId}
              onSelect={setActiveFrameId}
              onUploadFrame={handleUploadFrame}
              fileInputRef={frameFileInputRef}
            />
            <div className="controls controls-primary wizard-advance">
              <button className="btn-primary" style={{ flex: 1 }} onClick={nextStep}>
                Avançar → Revelar
              </button>
            </div>
          </div>

          <ResultPanel
            caption={caption}
            onCaptionChange={setCaption}
            printLayout={printLayout}
            onPrintLayoutChange={setPrintLayout}
            onDownload={handleDownload}
            onPrint={handlePrint}
            canDownload={hasResult}
          />
        </div>
      </div>

      <img ref={printImgRef} className="print-only" alt="" />
      <Footer />
    </div>
  )
}