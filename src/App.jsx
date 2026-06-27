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

  // Etapa do fluxo mobile (1 Capturar · 2 Moldura · 3 Revelar). No desktop
  // esse estado é ignorado visualmente — lá as duas áreas ficam sempre
  // visíveis lado a lado (ver regras dentro de @media no global.css).
  const [step, setStep] = useState(1)
  const nextStep = () => setStep((s) => Math.min(3, s + 1))
  const prevStep = () => setStep((s) => Math.max(1, s - 1))

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
    setStep(2) // depois de capturar, segue automaticamente pra escolha de moldura
  }

  function handleUploadClick() {
    photoFileInputRef.current?.click()
  }

  function handleFileSelected(file) {
    const reader = new FileReader()
    reader.onload = async (ev) => {
      const img = await loadImage(ev.target.result)
      setPhotoImg(img)
      setStep(2) // mesma lógica de avanço automático ao enviar uma foto
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
    <div className="app" data-active-step={step}>
      <Header />

      <Viewfinder
        videoRef={videoRef}
        canvasRef={canvasRef}
        cameraActive={cameraActive}
        hasResult={hasResult}
        frameCounterLabel={frameCounterLabel}
        mirrorPreview={cameraActive && facingMode === 'user'}
      />

      {/* Barra de progresso do wizard — só aparece em telas mobile */}
      <StepProgress step={step} onBack={prevStep} />

      <div className="stage">
        <div>
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

        <div data-step="2">
          <FrameStrip
            frames={allFrames}
            activeFrameId={activeFrameId}
            onSelect={setActiveFrameId}
            onUploadFrame={handleUploadFrame}
            fileInputRef={frameFileInputRef}
          />
          {/* botão de avançar — só existe visualmente no fluxo mobile */}
          <div className="controls controls-primary wizard-advance">
            <button className="btn-primary" style={{ flex: 1 }} onClick={nextStep}>
              Avançar → Revelar
            </button>
          </div>
        </div>
      </div>

      {/* Usada só durante a impressão — fica escondida na tela normal (ver .print-only no CSS) */}
      <img ref={printImgRef} className="print-only" alt="" />

      <Footer />
    </div>
  )
}