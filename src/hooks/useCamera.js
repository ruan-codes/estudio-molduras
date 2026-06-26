import { useCallback, useRef, useState } from 'react'

// Encapsula toda a lógica de getUserMedia: ligar, desligar, trocar de câmera
// (frontal/traseira) e checar status. Recebe um ref de <video> onde o
// stream será exibido.
export function useCamera(videoRef) {
  const [active, setActive] = useState(false)
  const [error, setError] = useState(null)
  const [facingMode, setFacingMode] = useState('environment') // traseira por padrão no celular
  const streamRef = useRef(null)

  const openStream = useCallback(
    async (mode) => {
      streamRef.current?.getTracks().forEach((t) => t.stop())
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: mode, width: { ideal: 1280 }, height: { ideal: 1600 } },
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
    },
    [videoRef]
  )

  const start = useCallback(async () => {
    setError(null)
    try {
      await openStream(facingMode)
      setActive(true)
    } catch (err) {
      setError('Não foi possível acessar a câmera. Verifique a permissão do navegador.')
      throw err
    }
  }, [openStream, facingMode])

  const stop = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop())
    streamRef.current = null
    setActive(false)
  }, [])

  // Troca entre câmera frontal e traseira sem precisar desligar/ligar manualmente
  const switchCamera = useCallback(async () => {
    const nextMode = facingMode === 'user' ? 'environment' : 'user'
    try {
      await openStream(nextMode)
      setFacingMode(nextMode)
    } catch (err) {
      setError('Este dispositivo não tem uma segunda câmera disponível.')
    }
  }, [facingMode, openStream])

  return { active, error, facingMode, start, stop, switchCamera }
}