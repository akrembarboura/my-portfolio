import { useEffect, useRef } from 'react'

// Custom cursor with trailing ring — only visible on non-touch devices
export default function CustomCursor() {
  const cursorRef = useRef(null)
  const ringRef = useRef(null)
  const ringPos = useRef({ x: 0, y: 0 })

  useEffect(() => {
    // Hide on touch devices
    if ('ontouchstart' in window) return

    const cursor = cursorRef.current
    const ring = ringRef.current
    if (!cursor || !ring) return

    const handleMove = (e) => {
      cursor.style.left = e.clientX + 'px'
      cursor.style.top = e.clientY + 'px'
      ringPos.current = { x: e.clientX, y: e.clientY }
    }

    // Smooth ring follow using animation frame
    let animId
    const animateRing = () => {
      ring.style.left = ringPos.current.x + 'px'
      ring.style.top = ringPos.current.y + 'px'
      animId = requestAnimationFrame(animateRing)
    }

    // Scale cursor on interactive elements
    const handleEnter = () => {
      cursor.style.width = '6px'
      cursor.style.height = '6px'
      ring.style.width = '48px'
      ring.style.height = '48px'
    }
    const handleLeave = () => {
      cursor.style.width = '10px'
      cursor.style.height = '10px'
      ring.style.width = '36px'
      ring.style.height = '36px'
    }

    document.addEventListener('mousemove', handleMove)
    animId = requestAnimationFrame(animateRing)

    const hoverTargets = document.querySelectorAll('a, button, .project-card, .skill-category')
    hoverTargets.forEach((el) => {
      el.addEventListener('mouseenter', handleEnter)
      el.addEventListener('mouseleave', handleLeave)
    })

    return () => {
      document.removeEventListener('mousemove', handleMove)
      cancelAnimationFrame(animId)
      hoverTargets.forEach((el) => {
        el.removeEventListener('mouseenter', handleEnter)
        el.removeEventListener('mouseleave', handleLeave)
      })
    }
  }, [])

  return (
    <>
      <div ref={cursorRef} className="cursor" />
      <div ref={ringRef} className="cursor-ring" />
    </>
  )
}
