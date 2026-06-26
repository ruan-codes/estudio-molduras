import { useCallback, useRef, useState } from 'react'

// Encapsula toda a lógica de getUserMedia: ligar, desligar e checar status.
// Recebe um ref de <video> onde o stream será exibido.
export function useCamera(videoRef) {
  const [active, setActive] = useState(false)
  const [error, setError] = useState(null)
  const streamRef = useRef(null)

  const start = useCallback(async () => {
    setError(null)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: 1280, height: 1600 },
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
      setActive(true)
    } catch (err) {
      setError('Não foi possível acessar a câmera. Verifique a permissão do navegador.')
      throw err
    }
  }, [videoRef])

  const stop = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop())
    streamRef.current = null
    setActive(false)
  }, [])

  return { active, error, start, stop }
}
