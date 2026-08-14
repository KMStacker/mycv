import { useEffect, useRef, JSX } from 'react'

interface Sparkle {
  x: number
  y: number
  size: number
  color: string
  opacity: number
  maxOpacity: number
  speed: number
  growing: boolean
}

const SparkleOverlay = (): JSX.Element => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId: number
    let sparkles: Sparkle[] = []

    const getPaletteColors = (): string[] => {
      const bodyClass = document.body.className
      if (bodyClass.includes('theme-daysky')) {
        return ['#0284c7', '#38bdf8', '#fbbf24', '#ffffff', '#0369a1']
      }
      return ['#00ff66', '#00ffff', '#ff00a0', '#ffffff', '#ffd700']
    }

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    window.addEventListener('resize', resizeCanvas)
    resizeCanvas()

    const createSparkle = (): Sparkle => {
      const maxOpacity = Math.random() * 0.7 + 0.3
      const currentColors = getPaletteColors()
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2.2 + 0.5,
        color: currentColors[Math.floor(Math.random() * currentColors.length)],
        opacity: 0,
        maxOpacity,
        speed: Math.random() * 0.001 + 0.002,
        growing: true
      }
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      if (sparkles.length < 45 && Math.random() < 0.4) {
        sparkles.push(createSparkle())
      }

      sparkles = sparkles.filter((sparkle) => {
        if (sparkle.growing) {
          sparkle.opacity += sparkle.speed
          if (sparkle.opacity >= sparkle.maxOpacity) {
            sparkle.opacity = sparkle.maxOpacity
            sparkle.growing = false
          }
        } else {
          sparkle.opacity -= sparkle.speed
        }

        ctx.beginPath()
        ctx.arc(sparkle.x, sparkle.y, sparkle.size, 0, Math.PI * 2)
        ctx.fillStyle = sparkle.color
        ctx.globalAlpha = Math.max(0, sparkle.opacity)
        ctx.fill()

        return sparkle.opacity > 0
      })

      ctx.globalAlpha = 1.0
      animationFrameId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: -1
      }}
    />
  )
}

export default SparkleOverlay
