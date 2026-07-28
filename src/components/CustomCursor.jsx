import { useEffect, useRef } from 'react'

// Custom cursor with smooth trailing ring — only visible on non-touch/pointer devices
export default function CustomCursor() {
  const cursorRef = useRef(null)
  const ringRef = useRef(null)

  // Store the ACTUAL mouse position
  const mouse = useRef({ x: -100, y: -100 })
  // Store the LAGGED ring position for smooth follow
  const ring = useRef({ x: -100, y: -100 })
  const animId = useRef(null)

  useEffect(() => {
    // Hide on touch devices
    if ('ontouchstart' in window || !window.matchMedia('(pointer: fine)').matches) return

    const cursor = cursorRef.current
    const ringEl = ringRef.current
    if (!cursor || !ringEl) return

    // Make both cursors visible initially
    cursor.style.opacity = '1'
    ringEl.style.opacity = '1'

    const handleMove = (e) => {
      mouse.current = { x: e.clientX, y: e.clientY }
      // Move the dot instantly (no delay)
      cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`
    }

    // Smooth lerp loop for the trailing ring
    const lerp = (a, b, t) => a + (b - a) * t
    const LERP_FACTOR = 0.12 // lower = more lag, higher = snappier

    const animate = () => {
      ring.current.x = lerp(ring.current.x, mouse.current.x, LERP_FACTOR)
      ring.current.y = lerp(ring.current.y, mouse.current.y, LERP_FACTOR)
      ringEl.style.transform = `translate(${ring.current.x}px, ${ring.current.y}px)`
      animId.current = requestAnimationFrame(animate)
    }

    // Hover effects — scale cursor/ring on interactive elements
    const handleEnter = () => {
      cursor.style.width = '6px'
      cursor.style.height = '6px'
      ringEl.style.width = '52px'
      ringEl.style.height = '52px'
      ringEl.style.borderColor = 'var(--accent-2)'
      ringEl.style.opacity = '0.8'
    }
    const handleLeave = () => {
      cursor.style.width = '10px'
      cursor.style.height = '10px'
      ringEl.style.width = '36px'
      ringEl.style.height = '36px'
      ringEl.style.borderColor = 'var(--accent)'
      ringEl.style.opacity = '0.5'
    }

    document.addEventListener('mousemove', handleMove)
    animId.current = requestAnimationFrame(animate)

    const hoverTargets = document.querySelectorAll('a, button, .project-card, .skill-category')
    hoverTargets.forEach((el) => {
      el.addEventListener('mouseenter', handleEnter)
      el.addEventListener('mouseleave', handleLeave)
    })

    return () => {
      document.removeEventListener('mousemove', handleMove)
      cancelAnimationFrame(animId.current)
      hoverTargets.forEach((el) => {
        el.removeEventListener('mouseenter', handleEnter)
        el.removeEventListener('mouseleave', handleLeave)
      })
    }
  }, [])

  return (
    <>
      {/* Dot cursor — instant response */}
      <div
        ref={cursorRef}
        className="cursor"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '10px',
          height: '10px',
          background: 'var(--accent)',
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 9998,
          transform: 'translate(-100px, -100px)',
          marginLeft: '-5px',
          marginTop: '-5px',
          transition: 'width 0.2s ease, height 0.2s ease',
          mixBlendMode: 'screen',
          opacity: 0,
          willChange: 'transform',
        }}
      />
      {/* Ring cursor — smooth lerp trail */}
      <div
        ref={ringRef}
        className="cursor-ring"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '36px',
          height: '36px',
          border: '1.5px solid var(--accent)',
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 9997,
          transform: 'translate(-100px, -100px)',
          marginLeft: '-18px',
          marginTop: '-18px',
          transition: 'width 0.25s ease, height 0.25s ease, border-color 0.2s ease, opacity 0.2s ease',
          opacity: 0,
          willChange: 'transform',
        }}
      />
    </>
  )
}
