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

// Renderiza a composição final no canvas: foto cobrindo toda a área +
// moldura (PNG/SVG com janela transparente) sobreposta + legenda opcional.
export function renderComposite({ canvas, photoImg, frameImg, caption, maxWidth = 1200 }) {
  const ratio = frameImg ? frameImg.width / frameImg.height : 4 / 5
  const width = maxWidth
  const height = Math.round(maxWidth / ratio)

  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')

  ctx.clearRect(0, 0, width, height)
  drawCoverImage(ctx, photoImg, 0, 0, width, height)

  if (frameImg) {
    ctx.drawImage(frameImg, 0, 0, width, height)
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
