"use client"

import { useEffect, useRef } from "react"

interface Snowflake {
  x: number
  y: number
  size: number
  speed: number
  opacity: number
  sin: number
  sinStep: number
}

export function SnowfallAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationFrameId: number
    let snowflakes: Snowflake[] = []

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      createSnowflakes()
    }

    const createSnowflakes = () => {
      const flakeCount = Math.floor(window.innerWidth / 10) // Adjust density based on screen width
      snowflakes = []

      for (let i = 0; i < flakeCount; i++) {
        snowflakes.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 3 + 1,
          speed: Math.random() * 1 + 0.5,
          opacity: Math.random() * 0.5 + 0.3,
          sin: Math.random() * 2 * Math.PI,
          sinStep: Math.random() * 0.02 + 0.01,
        })
      }
    }

    const drawSnowflakes = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      snowflakes.forEach((flake) => {
        ctx.beginPath()
        ctx.arc(flake.x, flake.y, flake.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 255, 255, ${flake.opacity})`
        ctx.fill()

        // Update position for next frame
        flake.y += flake.speed
        flake.sin += flake.sinStep
        flake.x += Math.sin(flake.sin) * 0.5

        // Reset if snowflake goes off screen
        if (flake.y > canvas.height) {
          flake.y = -5
          flake.x = Math.random() * canvas.width
        }

        if (flake.x > canvas.width) {
          flake.x = 0
        } else if (flake.x < 0) {
          flake.x = canvas.width
        }
      })

      animationFrameId = requestAnimationFrame(drawSnowflakes)
    }

    window.addEventListener("resize", resizeCanvas)
    resizeCanvas()
    drawSnowflakes()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return <canvas ref={canvasRef} className="pointer-events-none fixed inset-0 z-0" style={{ touchAction: "none" }} />
}
