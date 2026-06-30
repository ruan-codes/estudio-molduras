// Carrega uma imagem (URL, data URL ou blob URL) como HTMLImageElement
export function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}

// Desenha `img` dentro do retângulo (x,y,w,h) cobrindo toda a área,
// cortando o excesso (mesmo comportamento de object-fit: cover).
export function drawCoverImage(ctx, img, x, y, w, h) {
  const ir = img.width / img.height
  const tr = w / h
  let sx = 0,
    sy = 0,
    sw = img.width,
    sh = img.height

  if (ir > tr) {
    sw = img.height * tr
    sx = (img.width - sw) / 2
  } else {
    sh = img.width / tr
    sy = (img.height - sh) / 2
  }
  ctx.drawImage(img, sx, sy, sw, sh, x, y, w, h)
}

export const STORY_WIDTH = 1080
export const STORY_HEIGHT = 1920
const FRAME_BLEED = 1.07

// Renderiza a composição final no tamanho de Story do Instagram:
// 1080x1920px, proporção 9:16.
export function renderComposite({ canvas, photoImg, frameImg, caption, width = STORY_WIDTH, height = STORY_HEIGHT }) {

  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')

  ctx.clearRect(0, 0, width, height)
  drawCoverImage(ctx, photoImg, 0, 0, width, height)

  if (frameImg) {
    const bleedWidth = width * FRAME_BLEED
    const bleedHeight = height * FRAME_BLEED
    ctx.drawImage(frameImg, (width - bleedWidth) / 2, (height - bleedHeight) / 2, bleedWidth, bleedHeight)
  }

  if (caption && caption.trim()) {
    ctx.font = `${Math.round(width * 0.032)}px 'Big Shoulders Stencil', sans-serif`
    ctx.textAlign = 'center'
    ctx.lineWidth = Math.round(width * 0.006)
    ctx.strokeStyle = 'rgba(0,0,0,0.55)'
    ctx.fillStyle = '#F4EFE4'
    const x = width / 2
    const y = height - height * 0.045
    ctx.strokeText(caption.trim(), x, y)
    ctx.fillText(caption.trim(), x, y)
  }
}

// Captura um frame do <video> e devolve um HTMLImageElement
export function captureVideoFrame(video, mirror = false) {
  const tmp = document.createElement('canvas')
  tmp.width = video.videoWidth
  tmp.height = video.videoHeight
  const ctx = tmp.getContext('2d')
  if (mirror) {
    ctx.translate(tmp.width, 0)
    ctx.scale(-1, 1)
  }
  ctx.drawImage(video, 0, 0)
  return loadImage(tmp.toDataURL('image/png'))
}

export function renderPrintStrip({ sourceCanvas, copies = 3, brandLabel = 'ESTÚDIO DE MOLDURAS' }) {
  const unitW = sourceCanvas.width
  const unitH = sourceCanvas.height
  const margin = Math.round(unitW * 0.08)
  const gap = Math.round(unitW * 0.05)

  const strip = document.createElement('canvas')
  strip.width = unitW + margin * 2
  strip.height = margin * 2 + copies * unitH + (copies - 1) * gap
  const ctx = strip.getContext('2d')

  // fundo "papel"
  ctx.fillStyle = '#F4EFE4'
  ctx.fillRect(0, 0, strip.width, strip.height)

  for (let i = 0; i < copies; i++) {
    const y = margin + i * (unitH + gap)
    ctx.drawImage(sourceCanvas, margin, y, unitW, unitH)

    if (i < copies - 1) {
      const lineY = y + unitH + gap / 2
      ctx.save()
      ctx.strokeStyle = 'rgba(26,24,21,0.35)'
      ctx.lineWidth = Math.max(2, unitW * 0.0025)
      ctx.setLineDash([unitW * 0.018, unitW * 0.014])
      ctx.beginPath()
      ctx.moveTo(margin * 0.25, lineY)
      ctx.lineTo(strip.width - margin * 0.25, lineY)
      ctx.stroke()
      ctx.restore()
    }
  }

  // etiqueta vertical de marca, na margem esquerda
  ctx.save()
  ctx.fillStyle = 'rgba(26,24,21,0.45)'
  ctx.font = `${Math.round(unitW * 0.02)}px 'JetBrains Mono', monospace`
  ctx.textAlign = 'center'
  ctx.translate(margin * 0.5, strip.height / 2)
  ctx.rotate(-Math.PI / 2)
  ctx.fillText(brandLabel, 0, 0)
  ctx.restore()

  return strip
}
