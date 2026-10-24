import { useEffect, useState, useRef, useCallback } from 'react'

const SECTIONS = [
  { id: 'about', label: 'About' },
  { id: 'pipeline', label: 'Workflow' },
  { id: 'skills', label: 'Tech Stack' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
  { id: 'contact', label: 'Contact' }
]

// Theme accent colors: Lime green for Dark mode (#84cc16), Liquid Blue for Light mode (#2563eb)
const DARK_ACCENT = '#84cc16'
const DARK_GLOW = 'rgba(132, 204, 22, 0.45)'
const LIGHT_ACCENT = '#2563eb'
const LIGHT_GLOW = 'rgba(37, 99, 235, 0.45)'

export default function TimelineScrollbar() {
  const [activeSection, setActiveSection] = useState('about')
  const [viewportHeight, setViewportHeight] = useState(() =>
    typeof window !== 'undefined' ? window.innerHeight : 800
  )
  const [isDragging, setIsDragging] = useState(false)

  // Real-time theme detection (dark vs light mode)
  const [isDark, setIsDark] = useState(() => {
    if (typeof document !== 'undefined') {
      return document.documentElement.getAttribute('data-theme') !== 'light'
    }
    return true
  })

  useEffect(() => {
    const checkTheme = () => {
      const theme = document.documentElement.getAttribute('data-theme')
      setIsDark(theme !== 'light')
    }
    checkTheme()

    const observer = new MutationObserver(checkTheme)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme', 'class']
    })

    return () => observer.disconnect()
  }, [])

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

  // Cross-browser scroll position helper
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

  // Smooth RAF Lerp loop
  useEffect(() => {
    let lastTime = performance.now()

    const animateLoop = (time) => {
      const dt = Math.min((time - lastTime) / 1000, 0.1)
      lastTime = time

      const target = targetProgressRef.current
      const current = currentProgressRef.current
      const diff = target - current

      if (Math.abs(diff) > 0.0001) {
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

  // Scroll event listener
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

  // Pointer scrub handler
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
  const SVG_WIDTH = 80
  const BASE_X = 66
  const BULGE_X = 32
  const CURVE_SPAN = 58

  const yPos = currentY
  const yStart = Math.max(yPos - CURVE_SPAN, 0)
  const yEnd = Math.min(yPos + CURVE_SPAN, viewportHeight)

  const pathD = `
    M ${BASE_X} 0
    L ${BASE_X} ${yStart}
    C ${BASE_X} ${yPos - CURVE_SPAN * 0.44}, ${BULGE_X} ${yPos - CURVE_SPAN * 0.44}, ${BULGE_X} ${yPos}
    C ${BULGE_X} ${yPos + CURVE_SPAN * 0.44}, ${BASE_X} ${yPos + CURVE_SPAN * 0.44}, ${BASE_X} ${yEnd}
    L ${BASE_X} ${viewportHeight}
  `

  // Ruler Ticks
  const tickCount = Math.floor(trackHeight / 26)
  const ticks = Array.from({ length: tickCount + 1 }).map((_, i) => {
    const tickY = TOP_PAD + (i / tickCount) * trackHeight
    const isNearBulge = Math.abs(tickY - yPos) < CURVE_SPAN
    return { id: i, y: tickY, isNearBulge }
  })

  // Theme-specific accent and glow filters: Green for Dark Mode, Liquid Blue for Light Mode
  const strokeColor = isDark ? DARK_ACCENT : LIGHT_ACCENT
  const glowFilter = isDark
    ? `drop-shadow(0 0 6px ${DARK_ACCENT}) drop-shadow(0 0 12px ${DARK_GLOW})`
    : `drop-shadow(0 0 4px rgba(37, 99, 235, 0.45)) drop-shadow(0 0 8px rgba(37, 99, 235, 0.2))`

  return (
    <aside
      aria-label="Browser scrollbar replacement"
      className="fixed right-0 top-0 bottom-0 z-50 select-none pointer-events-auto"
      style={{ width: `${SVG_WIDTH}px`, touchAction: 'none' }}
    >
      {/* Clickable scrub track background */}
      <div
        className="absolute inset-0 cursor-pointer"
        onPointerDown={(e) => {
          scrubToClientY(e.clientY)
        }}
      />

      {/* ── SVG CANVAS: RESTORED GREEN IN DARK, LIQUID BLUE IN LIGHT ── */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none overflow-visible"
        viewBox={`0 0 ${SVG_WIDTH} ${viewportHeight}`}
        style={{ width: `${SVG_WIDTH}px`, height: '100%' }}
      >
        <defs>
          <radialGradient id="scrollbar-bulge-glow" cx="50%" cy="50%" r="50%">
            <stop
              offset="0%"
              stopColor={strokeColor}
              stopOpacity={isDark ? 0.45 : 0.22}
            />
            <stop
              offset="100%"
              stopColor={strokeColor}
              stopOpacity={0}
            />
          </radialGradient>
        </defs>

        {/* Ambient Radial Glow following the curve */}
        <circle
          cx={BULGE_X + 16}
          cy={yPos}
          r="44"
          fill="url(#scrollbar-bulge-glow)"
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
              stroke={t.isNearBulge ? strokeColor : 'currentColor'}
              strokeWidth="1"
              className={`transition-all duration-150 ${
                t.isNearBulge
                  ? isDark
                    ? 'text-lime-400 opacity-90'
                    : 'text-blue-600 opacity-90'
                  : 'text-text-3 opacity-20'
              }`}
            />
          )
        })}

        {/* Dynamic Curved Glowing Line */}
        <path
          d={pathD}
          fill="none"
          stroke={strokeColor}
          strokeWidth="2.5"
          strokeLinecap="round"
          style={{ filter: glowFilter }}
        />
      </svg>

      {/* ── CLEAN MILESTONE LABELS (ACTIVE & PROXIMITY WITHOUT HOVER POPUPS) ── */}
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
              className={`pointer-events-auto absolute right-1 -translate-y-1/2 flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono transition-all duration-200 cursor-pointer ${
                isActive
                  ? isDark
                    ? 'bg-[#11161B]/95 text-lime-400 border border-lime-500/50 font-bold shadow-md shadow-lime-950/40 scale-100 opacity-100'
                    : 'bg-white text-blue-600 border border-blue-500/50 font-bold shadow-md shadow-blue-500/15 scale-100 opacity-100'
                  : isNear
                  ? 'bg-background-1/90 text-text-1 border border-border-light opacity-95'
                  : 'opacity-0 pointer-events-none -translate-x-1'
              }`}
              style={{ top: `${secY}px` }}
            >
              {isActive && (
                <span
                  className={`w-1.5 h-1.5 rounded-full animate-pulse ${
                    isDark
                      ? 'bg-lime-400 shadow-[0_0_8px_#84cc16]'
                      : 'bg-blue-600 shadow-[0_0_8px_#2563eb]'
                  }`}
                />
              )}
              <span className="whitespace-nowrap">{sec.label}</span>
            </button>
          )
        })}
      </div>

      {/* ── DRAGGABLE THUMB (RESTORED LIME GREEN IN DARK, LIQUID BLUE IN LIGHT) ── */}
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
            // Ignore
          }
          setIsDragging(false)
        }}
        onPointerCancel={() => setIsDragging(false)}
      >
        {/* Thumb Body (No hover pop scale, pure smooth dragging) */}
        <div
          className={`relative w-8 h-8 rounded-full shadow-xl backdrop-blur-md flex items-center justify-center transition-transform active:scale-95 group ${
            isDark
              ? 'bg-[#11161B]/95 border border-lime-500/60 shadow-lime-950/50 text-lime-400'
              : 'bg-white/95 border border-blue-600/50 shadow-blue-600/15 text-blue-600'
          }`}
        >
          {/* Directional Chevrons */}
          <div className="flex flex-col items-center justify-center gap-0.5">
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

          {/* Active Liquid / Neon Ping Glow */}
          <span
            className={`absolute inset-0 rounded-full animate-ping pointer-events-none ${
              isDark ? 'border border-lime-400/50' : 'border border-blue-500/50'
            }`}
          />
        </div>
      </div>
    </aside>
  )
}
