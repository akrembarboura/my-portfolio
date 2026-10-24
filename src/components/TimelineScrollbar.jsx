import { useEffect, useState, useRef, useCallback } from 'react'

const SECTIONS = [
  { id: 'about', label: 'About' },
  { id: 'pipeline', label: 'Workflow' },
  { id: 'skills', label: 'Tech Stack' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
  { id: 'contact', label: 'Contact' }
]

export default function TimelineScrollbar() {
  const [activeSection, setActiveSection] = useState('about')
  const [viewportHeight, setViewportHeight] = useState(() =>
    typeof window !== 'undefined' ? window.innerHeight : 800
  )
  const [isHovered, setIsHovered] = useState(false)
  const [isDragging, setIsDragging] = useState(false)

  // Top and bottom track padding in pixels
  const TOP_PAD = 48
  const BOT_PAD = 48
  const trackHeight = Math.max(viewportHeight - TOP_PAD - BOT_PAD, 100)

  // Direct animated state
  const [currentY, setCurrentY] = useState(TOP_PAD)

  // Refs for smooth 60-120fps animation loop
  const targetProgressRef = useRef(0)
  const currentProgressRef = useRef(0)
  const rafIdRef = useRef(null)
  const isDraggingRef = useRef(false)
  isDraggingRef.current = isDragging

  // Cross-browser scroll position helper (Chrome, Safari, Firefox, Edge)
  const getScrollMetrics = useCallback(() => {
    if (typeof window === 'undefined') return { scrollY: 0, maxScroll: 1, progress: 0 }
    const scrollY =
      window.scrollY ??
      window.pageYOffset ??
      document.documentElement.scrollTop ??
      document.body.scrollTop ??
      0

    const docHeight = Math.max(
      document.documentElement.scrollHeight || 0,
      document.body.scrollHeight || 0,
      document.documentElement.offsetHeight || 0,
      document.body.offsetHeight || 0
    )
    const winHeight = window.innerHeight || document.documentElement.clientHeight || 1
    const maxScroll = Math.max(docHeight - winHeight, 1)
    const progress = Math.min(Math.max(scrollY / maxScroll, 0), 1)

    return { scrollY, maxScroll, progress }
  }, [])

  // Window resize listener
  useEffect(() => {
    const handleResize = () => {
      setViewportHeight(window.innerHeight || document.documentElement.clientHeight || 800)
    }
    handleResize()
    window.addEventListener('resize', handleResize, { passive: true })
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Smooth RAF Lerp loop: guaranteed ultra-fluid across all browsers (Chrome, Safari, Firefox)
  useEffect(() => {
    let lastTime = performance.now()

    const animateLoop = (time) => {
      const dt = Math.min((time - lastTime) / 1000, 0.1)
      lastTime = time

      // Exponential smoothing (lerp)
      const target = targetProgressRef.current
      const current = currentProgressRef.current
      const diff = target - current

      if (Math.abs(diff) > 0.0001) {
        // Fast, smooth spring-like approach
        const lerpFactor = 1 - Math.exp(-22 * dt)
        const next = current + diff * lerpFactor
        currentProgressRef.current = next
        setCurrentY(TOP_PAD + next * trackHeight)
      } else if (current !== target) {
        currentProgressRef.current = target
        setCurrentY(TOP_PAD + target * trackHeight)
      }

      rafIdRef.current = requestAnimationFrame(animateLoop)
    }

    rafIdRef.current = requestAnimationFrame(animateLoop)
    return () => {
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current)
    }
  }, [trackHeight, TOP_PAD])

  // Scroll event listener (attaches to both window and document for full Chrome compatibility)
  useEffect(() => {
    const onScroll = () => {
      const { progress } = getScrollMetrics()
      targetProgressRef.current = progress

      // Active section detection
      const winHeight = window.innerHeight || 800
      for (let i = SECTIONS.length - 1; i >= 0; i--) {
        const el = document.getElementById(SECTIONS[i].id)
        if (el) {
          const rect = el.getBoundingClientRect()
          if (rect.top <= winHeight * 0.45) {
            setActiveSection(SECTIONS[i].id)
            break
          }
        }
      }
    }

    // Initial check
    onScroll()

    window.addEventListener('scroll', onScroll, { passive: true })
    document.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', onScroll)
      document.removeEventListener('scroll', onScroll)
    }
  }, [getScrollMetrics])

  // Scroll to section helper
  const scrollToSection = (id) => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  // Pointer scrub handler (1:1 direct scrolling)
  const scrubToClientY = useCallback(
    (clientY) => {
      const relativeY = Math.min(Math.max(clientY - TOP_PAD, 0), trackHeight)
      const progress = relativeY / trackHeight
      const { maxScroll } = getScrollMetrics()

      targetProgressRef.current = progress
      currentProgressRef.current = progress
      setCurrentY(TOP_PAD + relativeY)

      window.scrollTo({
        top: progress * maxScroll,
        behavior: 'auto'
      })
    },
    [trackHeight, TOP_PAD, getScrollMetrics]
  )

  // ── GEOMETRY OF RIGHT-EDGE SCROLLBAR ──
  // Container width: 80px pinned to right edge (right: 0)
  // Baseline is 12px from right edge -> X = 68
  const SVG_WIDTH = 80
  const BASE_X = 66
  const BULGE_X = 32 // Bulges left by 34px around the circular thumb
  const CURVE_SPAN = 58 // Vertical span of the curve

  const yPos = currentY
  const yStart = Math.max(yPos - CURVE_SPAN, 0)
  const yEnd = Math.min(yPos + CURVE_SPAN, viewportHeight)

  // SVG Cubic Bezier Path that curves around thumb
  const pathD = `
    M ${BASE_X} 0
    L ${BASE_X} ${yStart}
    C ${BASE_X} ${yPos - CURVE_SPAN * 0.44}, ${BULGE_X} ${yPos - CURVE_SPAN * 0.44}, ${BULGE_X} ${yPos}
    C ${BULGE_X} ${yPos + CURVE_SPAN * 0.44}, ${BASE_X} ${yPos + CURVE_SPAN * 0.44}, ${BASE_X} ${yEnd}
    L ${BASE_X} ${viewportHeight}
  `

  // Ruler Ticks along the vertical rail
  const tickCount = Math.floor(trackHeight / 26)
  const ticks = Array.from({ length: tickCount + 1 }).map((_, i) => {
    const tickY = TOP_PAD + (i / tickCount) * trackHeight
    const isNearBulge = Math.abs(tickY - yPos) < CURVE_SPAN
    return { id: i, y: tickY, isNearBulge }
  })

  return (
    <aside
      aria-label="Browser scrollbar replacement"
      className="fixed right-0 top-0 bottom-0 z-50 select-none pointer-events-auto"
      style={{ width: `${SVG_WIDTH}px`, touchAction: 'none' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Clickable scrub track background */}
      <div
        className="absolute inset-0 cursor-pointer"
        onPointerDown={(e) => {
          scrubToClientY(e.clientY)
        }}
      />

      {/* ── SVG CANVAS: NEON ELASTIC LINE & GLOW ── */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none overflow-visible"
        viewBox={`0 0 ${SVG_WIDTH} ${viewportHeight}`}
        style={{ width: `${SVG_WIDTH}px`, height: '100%' }}
      >
        <defs>
          {/* Radial ambient glow behind the curve bulge */}
          <radialGradient id="thumb-ambient-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#84cc16" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#84cc16" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Ambient Radial Glow following the curve */}
        <circle
          cx={BULGE_X + 16}
          cy={yPos}
          r="42"
          fill="url(#thumb-ambient-glow)"
          className="transition-opacity duration-200"
        />

        {/* Base Muted Vertical Line */}
        <line
          x1={BASE_X}
          y1={0}
          x2={BASE_X}
          y2={viewportHeight}
          stroke="currentColor"
          strokeWidth="1.5"
          className="text-border-strong opacity-25"
        />

        {/* Ruler Minor Ticks */}
        {ticks.map((t) => {
          const xPos = t.isNearBulge ? BASE_X - 12 : BASE_X
          return (
            <line
              key={t.id}
              x1={xPos - 5}
              y1={t.y}
              x2={xPos}
              y2={t.y}
              stroke="currentColor"
              strokeWidth="1"
              className={`transition-all duration-150 ${
                t.isNearBulge ? 'text-lime-400 opacity-80' : 'text-text-3 opacity-20'
              }`}
            />
          )
        })}

        {/* Dynamic Curved Glowing Line (using CSS drop-shadow for 100% Chrome/Cross-Browser fidelity) */}
        <path
          d={pathD}
          fill="none"
          stroke="#84cc16"
          strokeWidth="2.5"
          strokeLinecap="round"
          style={{
            filter: 'drop-shadow(0 0 5px #84cc16) drop-shadow(0 0 10px rgba(132, 204, 22, 0.4))'
          }}
        />
      </svg>

      {/* ── CLEAN MILESTONE LABELS (FLOAT TO THE LEFT OF THE CURVE) ── */}
      <div className="absolute inset-y-0 left-0 right-[24px] pointer-events-none hidden sm:block">
        {SECTIONS.map((sec, index) => {
          const secY = TOP_PAD + (index / (SECTIONS.length - 1)) * trackHeight
          const isActive = sec.id === activeSection
          const isNear = Math.abs(secY - yPos) < 40

          return (
            <button
              key={sec.id}
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                scrollToSection(sec.id)
              }}
              className={`pointer-events-auto absolute right-1 -translate-y-1/2 flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-mono transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'bg-background-1 text-lime-400 border border-lime-500/40 font-bold shadow-md shadow-lime-950/20 scale-100 opacity-100'
                  : isNear
                  ? 'bg-background-1/90 text-text-1 border border-border-light opacity-90'
                  : isHovered
                  ? 'text-text-3 hover:text-text-1 opacity-70 hover:opacity-100'
                  : 'opacity-0 -translate-x-1'
              }`}
              style={{ top: `${secY}px` }}
            >
              {isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-lime-400 animate-pulse shadow-[0_0_6px_#84cc16]" />
              )}
              <span className="whitespace-nowrap">{sec.label}</span>
            </button>
          )
        })}
      </div>

      {/* ── DRAGGABLE GLASSMORPHISM THUMB (RIGHT-EDGE WITH HTML5 POINTER CAPTURE) ── */}
      <div
        className="absolute z-30 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center cursor-grab active:cursor-grabbing pointer-events-auto"
        style={{
          left: `${BASE_X}px`,
          top: `${yPos}px`,
          width: '38px',
          height: '38px'
        }}
        onPointerDown={(e) => {
          e.stopPropagation()
          e.currentTarget.setPointerCapture(e.pointerId)
          setIsDragging(true)
          scrubToClientY(e.clientY)
        }}
        onPointerMove={(e) => {
          if (isDragging) {
            scrubToClientY(e.clientY)
          }
        }}
        onPointerUp={(e) => {
          try {
            e.currentTarget.releasePointerCapture(e.pointerId)
          } catch {
            // Ignore if pointer already released
          }
          setIsDragging(false)
        }}
        onPointerCancel={() => setIsDragging(false)}
      >
        {/* Thumb Body */}
        <div className="relative w-8 h-8 rounded-full bg-[#11161B]/95 border border-lime-500/60 shadow-xl backdrop-blur-md flex items-center justify-center transition-transform hover:scale-110 active:scale-95 group">
          
          {/* Animated Directional Chevrons */}
          <div className="flex flex-col items-center justify-center gap-0.5 text-lime-400">
            <svg
              className="w-3 h-3 stroke-current stroke-[2.5] fill-none"
              viewBox="0 0 24 24"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="18 15 12 9 6 15" />
            </svg>
            <svg
              className="-mt-1.5 w-3 h-3 stroke-current stroke-[2.5] fill-none opacity-60"
              viewBox="0 0 24 24"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </div>

          {/* Active Ping Glow */}
          <span className="absolute inset-0 rounded-full border border-lime-400/40 animate-ping pointer-events-none" />
        </div>
      </div>
    </aside>
  )
}
