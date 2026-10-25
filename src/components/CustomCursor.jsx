import { useEffect, useRef } from 'react'

const INTERACTIVE_SELECTOR = 'a, button, input, textarea, [role="button"]'

// Custom cursor with smooth trailing ring — only visible on non-touch/pointer devices
export default function CustomCursor() {
  const cursorRef = useRef(null)
  const ringRef = useRef(null)

  const mouse = useRef({ x: -100, y: -100 })
  const ring = useRef({ x: -100, y: -100 })
  const animId = useRef(null)

  useEffect(() => {
    if ('ontouchstart' in window || !window.matchMedia('(pointer: fine)').matches) return

    const cursor = cursorRef.current
    const ringEl = ringRef.current
    if (!cursor || !ringEl) return

    cursor.style.opacity = '1'
    ringEl.style.opacity = '0.55'

    const handleMove = (e) => {
      mouse.current = { x: e.clientX, y: e.clientY }
      cursor.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`
    }

    const lerp = (a, b, t) => a + (b - a) * t
    const LERP_FACTOR = 0.14

    const animate = () => {
      ring.current.x = lerp(ring.current.x, mouse.current.x, LERP_FACTOR)
      ring.current.y = lerp(ring.current.y, mouse.current.y, LERP_FACTOR)
      ringEl.style.transform = `translate3d(${ring.current.x}px, ${ring.current.y}px, 0)`
      animId.current = requestAnimationFrame(animate)
    }

    const setHoverState = (active) => {
      if (active) {
        cursor.style.width = '6px'
        cursor.style.height = '6px'
        cursor.style.marginLeft = '-3px'
        cursor.style.marginTop = '-3px'
        ringEl.style.width = '48px'
        ringEl.style.height = '48px'
        ringEl.style.marginLeft = '-24px'
        ringEl.style.marginTop = '-24px'
        ringEl.style.borderColor = 'var(--accent)'
        ringEl.style.opacity = '0.85'
      } else {
        cursor.style.width = '9px'
        cursor.style.height = '9px'
        cursor.style.marginLeft = '-4.5px'
        cursor.style.marginTop = '-4.5px'
        ringEl.style.width = '34px'
        ringEl.style.height = '34px'
        ringEl.style.marginLeft = '-17px'
        ringEl.style.marginTop = '-17px'
        ringEl.style.borderColor = 'var(--accent)'
        ringEl.style.opacity = '0.55'
      }
    }

    const handlePointerOver = (e) => {
      if (e.target instanceof Element && e.target.closest(INTERACTIVE_SELECTOR)) {
        setHoverState(true)
      }
    }

    const handlePointerOut = (e) => {
      if (
        e.target instanceof Element &&
        e.target.closest(INTERACTIVE_SELECTOR) &&
        (!(e.relatedTarget instanceof Element) || !e.relatedTarget.closest(INTERACTIVE_SELECTOR))
      ) {
        setHoverState(false)
      }
    }

    document.addEventListener('mousemove', handleMove, { passive: true })
    document.addEventListener('mouseover', handlePointerOver, { passive: true })
    document.addEventListener('mouseout', handlePointerOut, { passive: true })
    animId.current = requestAnimationFrame(animate)

    return () => {
      document.removeEventListener('mousemove', handleMove)
      document.removeEventListener('mouseover', handlePointerOver)
      document.removeEventListener('mouseout', handlePointerOut)
      if (animId.current) cancelAnimationFrame(animId.current)
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
          width: '9px',
          height: '9px',
          background: 'var(--accent)',
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 9998,
          transform: 'translate3d(-100px, -100px, 0)',
          marginLeft: '-4.5px',
          marginTop: '-4.5px',
          transition: 'width 0.2s ease, height 0.2s ease, margin 0.2s ease',
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
          width: '34px',
          height: '34px',
          border: '1.5px solid var(--accent)',
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 9997,
          transform: 'translate3d(-100px, -100px, 0)',
          marginLeft: '-17px',
          marginTop: '-17px',
          transition: 'width 0.22s ease, height 0.22s ease, margin 0.22s ease, border-color 0.2s ease, opacity 0.2s ease',
          opacity: 0,
          willChange: 'transform',
        }}
      />
    </>
  )
}
