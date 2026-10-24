import { useEffect, useState, useRef, useCallback } from 'react'
import { motion, useSpring, useMotionValue } from 'framer-motion'

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
  const [viewportHeight, setViewportHeight] = useState(800)
  const [isHovered, setIsHovered] = useState(false)
  const [isDragging, setIsDragging] = useState(false)

  // Track height constraints (padding from absolute top/bottom of screen)
  const TOP_PAD = 40
  const BOT_PAD = 40
  const trackHeight = Math.max(viewportHeight - TOP_PAD - BOT_PAD, 200)

  // Motion value for silky spring responsiveness
  const scrollRatio = useMotionValue(0)
  const smoothRatio = useSpring(scrollRatio, {
    stiffness: 180,
    damping: 24,
    mass: 0.6
  })

  const [currentY, setCurrentY] = useState(TOP_PAD)

  // Measure window height
  useEffect(() => {
    const handleResize = () => setViewportHeight(window.innerHeight)
    handleResize()
    window.addEventListener('resize', handleResize, { passive: true })
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Window scroll sync
  useEffect(() => {
    let ticking = false

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const docHeight = document.documentElement.scrollHeight
          const winHeight = window.innerHeight
          const maxScroll = Math.max(docHeight - winHeight, 1)
          const scrollY = window.scrollY
          const ratio = Math.min(Math.max(scrollY / maxScroll, 0), 1)

          scrollRatio.set(ratio)

          // Active section lookup
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
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [scrollRatio])

  // Sync spring to Y coordinate
  useEffect(() => {
    const unsubscribe = smoothRatio.on('change', (latest) => {
      setCurrentY(TOP_PAD + latest * trackHeight)
    })
    return () => unsubscribe()
  }, [smoothRatio, trackHeight, TOP_PAD])

  // Global drag handler (attaches to window so fast scrub never loses focus)
  const scrollToClientY = useCallback((clientY) => {
    const relativeY = Math.min(Math.max(clientY - TOP_PAD, 0), trackHeight)
    const ratio = relativeY / trackHeight
    const docHeight = document.documentElement.scrollHeight
    const winHeight = window.innerHeight
    const maxScroll = Math.max(docHeight - winHeight, 1)

    window.scrollTo({
      top: ratio * maxScroll,
      behavior: 'auto'
    })
  }, [trackHeight, TOP_PAD])

  useEffect(() => {
    if (!isDragging) return

    const onPointerMove = (e) => {
      const clientY = e.clientY ?? (e.touches && e.touches[0]?.clientY)
      if (typeof clientY === 'number') {
        scrollToClientY(clientY)
      }
    }

    const onPointerUp = () => {
      setIsDragging(false)
    }

    window.addEventListener('mousemove', onPointerMove)
    window.addEventListener('mouseup', onPointerUp)
    window.addEventListener('touchmove', onPointerMove, { passive: true })
    window.addEventListener('touchend', onPointerUp)

    return () => {
      window.removeEventListener('mousemove', onPointerMove)
      window.removeEventListener('mouseup', onPointerUp)
      window.removeEventListener('touchmove', onPointerMove)
      window.removeEventListener('touchend', onPointerUp)
    }
  }, [isDragging, scrollToClientY])

  // Click on section milestone
  const scrollToSection = (id) => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  // ── GEOMETRY OF RIGHT-EDGE SCROLLBAR ──
  // Container width: 90px at far right of viewport (right: 0)
  // Base rail: 12px from far right edge -> X = 78
  const SVG_WIDTH = 90
  const BASE_X = 76
  const BULGE_X = 42 // Bulges left by 34px around thumb
  const CURVE_SPAN = 56 // Vertical extent of curve

  const yPos = currentY
  const pathD = `
    M ${BASE_X} 0
    L ${BASE_X} ${Math.max(yPos - CURVE_SPAN, 0)}
    C ${BASE_X} ${yPos - CURVE_SPAN * 0.44}, ${BULGE_X} ${yPos - CURVE_SPAN * 0.44}, ${BULGE_X} ${yPos}
    C ${BULGE_X} ${yPos + CURVE_SPAN * 0.44}, ${BASE_X} ${yPos + CURVE_SPAN * 0.44}, ${BASE_X} ${Math.min(yPos + CURVE_SPAN, viewportHeight)}
    L ${BASE_X} ${viewportHeight}
  `

  // Subtle ruler ticks
  const tickCount = Math.floor(trackHeight / 24)
  const ticks = Array.from({ length: tickCount + 1 }).map((_, i) => {
    const tickY = TOP_PAD + (i / tickCount) * trackHeight
    const isNearBulge = Math.abs(tickY - yPos) < CURVE_SPAN
    return { id: i, y: tickY, isNearBulge }
  })

  return (
    <aside
      aria-label="Browser scrollbar replacement"
      className="fixed right-0 top-0 bottom-0 z-50 hidden md:block select-none pointer-events-auto"
      style={{ width: `${SVG_WIDTH}px` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Clickable scrub track background */}
      <div
        className="absolute inset-0 cursor-pointer"
        onClick={(e) => scrollToClientY(e.clientY)}
      />

      {/* ── SVG CANVAS: NEON ELASTIC LINE & GLOW ── */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none overflow-visible"
        viewBox={`0 0 ${SVG_WIDTH} ${viewportHeight}`}
        preserveAspectRatio="none"
      >
        <defs>
          <filter id="scrollbar-neon-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <radialGradient id="thumb-ambient-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#84cc16" stopOpacity="0.4" />
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
          className="text-border-strong opacity-30"
        />

        {/* Ruler Minor Ticks */}
        {ticks.map((t) => {
          const xPos = t.isNearBulge ? BASE_X - 14 : BASE_X
          return (
            <line
              key={t.id}
              x1={xPos - 5}
              y1={t.y}
              x2={xPos}
              y2={t.y}
              stroke="currentColor"
              strokeWidth="1"
              className={`transition-colors duration-150 ${
                t.isNearBulge ? 'text-lime-400 opacity-70' : 'text-text-3 opacity-20'
              }`}
            />
          )
        })}

        {/* Dynamic Curved Glowing Line */}
        <path
          d={pathD}
          fill="none"
          stroke="#84cc16"
          strokeWidth="2.5"
          strokeLinecap="round"
          filter="url(#scrollbar-neon-glow)"
        />
      </svg>

      {/* ── CLEAN MILESTONE LABELS (FLOAT TO THE LEFT OF THE CURVE) ── */}
      <div className="absolute inset-y-0 left-0 right-[28px] pointer-events-none">
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

      {/* ── DRAGGABLE GLASSMORPHISM THUMB (SITS RIGHT AT THE BROWSER EDGE) ── */}
      <div
        className="absolute z-30 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center cursor-grab active:cursor-grabbing pointer-events-auto"
        style={{
          left: `${BASE_X}px`,
          top: `${yPos}px`,
          width: '38px',
          height: '38px'
        }}
        onMouseDown={(e) => {
          e.stopPropagation()
          setIsDragging(true)
        }}
        onTouchStart={(e) => {
          e.stopPropagation()
          setIsDragging(true)
        }}
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
