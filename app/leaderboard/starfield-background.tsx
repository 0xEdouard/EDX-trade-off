'use client'

import { useEffect, useRef } from 'react'

interface Star {
  x: number
  y: number
  z: number
  prevZ: number
  color: 'red' | 'green' | 'blue'
}

export default function WarpSpeedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    const setCanvasSize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    setCanvasSize()
    window.addEventListener('resize', setCanvasSize)

    // Initialize stars
    const stars: Star[] = Array.from({ length: 1000 }, () => ({
      x: Math.random() * 2000 - 1000,
      y: Math.random() * 2000 - 1000,
      z: Math.random() * 2000,
      prevZ: 0,
      color: Math.random() < 0.33 ? 'red' : Math.random() < 0.5 ? 'green' : 'blue'
    }))

    // Animation settings
    const speed = 25

    function moveStars() {
      stars.forEach(star => {
        star.prevZ = star.z
        star.z = star.z - speed
        if (star.z < 1) {
          star.z = 2000
          star.prevZ = 2000
          star.x = Math.random() * 2000 - 1000
          star.y = Math.random() * 2000 - 1000
        }
      })
    }

    function drawStars() {
      if (!ctx) return
      if (!canvas) return
    
      const centerX = canvas!.width / 2
      const centerY = canvas!.height / 2

      ctx.fillStyle = 'rgba(0, 0, 0, 0.2)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      stars.forEach(star => {
        const sx = (star.x / star.z) * 800
        const sy = (star.y / star.z) * 800
        const px = (star.x / star.prevZ) * 800
        const py = (star.y / star.prevZ) * 800

        const x = sx + centerX
        const y = sy + centerY
        const prevX = px + centerX
        const prevY = py + centerY

        // Calculate line length based on z position (make lines thinner)
        const lineLength = Math.max(0.3, (2000 - star.z) / 120)

        // Draw chromatic aberration effect
        ctx.beginPath()
        ctx.moveTo(prevX, prevY)
        ctx.lineTo(x, y)
        
        // Blue streak
        ctx.strokeStyle = `rgba(50, 100, 255, ${0.5 * (1 - star.z / 2000)})`
        ctx.lineWidth = lineLength * 0.4
        ctx.stroke()
        
        // Red streak
        ctx.beginPath()
        ctx.moveTo(prevX - 1, prevY - 1)
        ctx.lineTo(x - 1, y - 1)
        ctx.strokeStyle = `rgba(255, 50, 50, ${0.3 * (1 - star.z / 2000)})`
        ctx.lineWidth = lineLength * 0.25
        ctx.stroke()
        
        // Green streak
        ctx.beginPath()
        ctx.moveTo(prevX + 1, prevY + 1)
        ctx.lineTo(x + 1, y + 1)
        ctx.strokeStyle = `rgba(50, 255, 50, ${0.3 * (1 - star.z / 2000)})`
        ctx.lineWidth = lineLength * 0.25
        ctx.stroke()
        
        // White/yellow core
        ctx.beginPath()
        ctx.moveTo(prevX, prevY)
        ctx.lineTo(x, y)
        ctx.strokeStyle = `rgba(255, 255, 200, ${0.7 * (1 - star.z / 2000)})`
        ctx.lineWidth = lineLength * 0.15
        ctx.stroke()
      })
    }

    function animate() {
      moveStars()
      drawStars()
      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', setCanvasSize)
    }
  }, [])

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 -z-10 bg-black"
      style={{ imageRendering: 'pixelated' }}
    />
  )
}
