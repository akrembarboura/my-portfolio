import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { useMotionValue, useSpring } from 'framer-motion'

const DEFAULT_MILESTONES = [
  { id: 'about', label: 'About', ratio: 0.05 },
  { id: 'pipeline', label: 'Workflow', ratio: 0.22 },
  { id: 'skills', label: 'Tech Stack', ratio: 0.40 },
  { id: 'experience', label: 'Experience', ratio: 0.58 },
  { id: 'projects', label: 'Projects', ratio: 0.76 },
  { id: 'contact', label: 'Contact', ratio: 0.94 },
]

export default function TimelineScrollbar() {
  const containerRef = useRef(null)
  const isDraggingRef = useRef(false)
  const [isDragging, setIsDragging] = useState(false)
  isDraggingRef.current = isDragging

  const [viewportHeight, setViewportHeight] = useState(() =>
    typeof window !== 'undefined' ? window.innerHeight : 800
  )
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth < 640 : false
  )

  const [scrollDirection, setScrollDirection] = useState('up')
  const [milestones, setMilestones] = useState(DEFAULT_MILESTONES)

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

  // Geometry dimensions from template
  const trackHeight = viewportHeight
  const CONTAINER_WIDTH = isMobile ? 80 : 310
  const SPINE_X = isMobile ? 54 : 224
  const MAX_DEFLECT_X = isMobile ? 22 : 34
  const CURVE_HALF_SPAN = isMobile ? 58 : 76
  const GAUSSIAN_SIGMA = isMobile ? 30 : 38
  const subdivisionsPerSegment = isMobile ? 3 : 6

  // Window resize & milestone calibration
  useEffect(() => {
    const handleResize = () => {
      const winH = window.innerHeight || 800
      setViewportHeight(winH)
      setIsMobile(window.innerWidth < 640)

      const docHeight = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight) - winH
      if (docHeight > 0) {
        const calibrated = DEFAULT_MILESTONES.map((m) => {
          const el = document.getElementById(m.id)
          if (!el) return m
          const rect = el.getBoundingClientRect()
          const absoluteTop = rect.top + window.scrollY
          const ratio = Math.min(0.96, Math.max(0.04, absoluteTop / (document.documentElement.scrollHeight - winH)))
          return { ...m, ratio }
        })
        setMilestones(calibrated)
      }
    }

    handleResize()
    window.addEventListener('resize', handleResize, { passive: true })
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Mathematical Gaussian wave displacement
  const getWaveDisplacement = useCallback((y, centerY) => {
    const dy = y - centerY
    return MAX_DEFLECT_X * Math.exp(-(dy * dy) / (2 * GAUSSIAN_SIGMA * GAUSSIAN_SIGMA))
  }, [MAX_DEFLECT_X, GAUSSIAN_SIGMA])

  // Build curved spline path around active bulge
  const buildCurvedSpinePath = useCallback((centerY, height) => {
    const topWaveY = centerY - CURVE_HALF_SPAN
    const bottomWaveY = centerY + CURVE_HALF_SPAN
    const peakX = SPINE_X - MAX_DEFLECT_X
    const cpOffset1 = CURVE_HALF_SPAN * 0.48
    const cpOffset2 = CURVE_HALF_SPAN * 0.42

    return [
      `M ${SPINE_X} 0`,
      `L ${SPINE_X} ${Math.max(0, topWaveY).toFixed(2)}`,
      `C ${SPINE_X} ${(topWaveY + cpOffset1).toFixed(2)}, ${peakX} ${(centerY - cpOffset2).toFixed(2)}, ${peakX} ${centerY.toFixed(2)}`,
      `C ${peakX} ${(centerY + cpOffset2).toFixed(2)}, ${SPINE_X} ${(bottomWaveY - cpOffset1).toFixed(2)}, ${SPINE_X} ${Math.min(height, bottomWaveY).toFixed(2)}`,
      `L ${SPINE_X} ${height}`,
    ].join(' ')
  }, [SPINE_X, MAX_DEFLECT_X, CURVE_HALF_SPAN])

  // Motion physics
  const initialY = 0.08 * trackHeight
  const targetY = useMotionValue(initialY)
  const smoothY = useSpring(targetY, { stiffness: 220, damping: 26, mass: 0.55 })
  const [renderY, setRenderY] = useState(initialY)

  useEffect(() => {
    return smoothY.on('change', (latest) => setRenderY(latest))
  }, [smoothY])

  // Sync scroll from page
  useEffect(() => {
    const handleScroll = () => {
      if (isDraggingRef.current) return
      const scrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0
      const docHeight = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight)
      const winHeight = window.innerHeight || 800
      const maxWinScroll = Math.max(docHeight - winHeight, 1)
      const ratio = Math.min(1, Math.max(0, scrollY / maxWinScroll))

      const nextY = Math.min(trackHeight - 24, Math.max(24, ratio * trackHeight))
      const current = targetY.get()
      if (Math.abs(nextY - current) > 0.5) {
        setScrollDirection(nextY >= current ? 'down' : 'up')
        targetY.set(nextY)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [trackHeight, targetY])

  // Ruler Ticks
  const ticks = useMemo(() => {
    const list = []
    for (let i = 0; i < milestones.length; i++) {
      const current = milestones[i]
      list.push({ id: `major-${current.id}`, y: current.ratio * trackHeight, isMajor: true, ratio: current.ratio })
      if (i < milestones.length - 1) {
        const next = milestones[i + 1]
        for (let s = 1; s < subdivisionsPerSegment; s++) {
          const interpRatio = current.ratio + (next.ratio - current.ratio) * (s / subdivisionsPerSegment)
          list.push({ id: `minor-${i}-${s}`, y: interpRatio * trackHeight, isMajor: false, ratio: interpRatio })
        }
      }
    }
    return list.sort((a, b) => a.y - b.y)
  }, [milestones, trackHeight, subdivisionsPerSegment])

  // User scrub / drag handler
  const updateFromClientY = useCallback(
    (clientY, smoothWindowScroll = false) => {
      const localY = Math.min(trackHeight - 24, Math.max(24, clientY))
      const nextRatio = Math.min(1, Math.max(0, localY / trackHeight))
      const prevY = targetY.get()
      setScrollDirection(localY >= prevY ? 'down' : 'up')
      targetY.set(localY)

      const docHeight = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight)
      const winHeight = window.innerHeight || 800
      const maxWinScroll = Math.max(docHeight - winHeight, 1)

      window.scrollTo({
        top: nextRatio * maxWinScroll,
        behavior: smoothWindowScroll ? 'smooth' : 'auto',
      })
    },
    [trackHeight, targetY]
  )

  useEffect(() => {
    if (!isDragging) return undefined
    const onMove = (e) => {
      e.preventDefault()
      updateFromClientY(e.clientY, false)
    }
    const onUp = () => setIsDragging(false)
    window.addEventListener('pointermove', onMove, { passive: false })
    window.addEventListener('pointerup', onUp)
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
    }
  }, [isDragging, updateFromClientY])

  const spinePathD = useMemo(() => buildCurvedSpinePath(renderY, trackHeight), [renderY, trackHeight, buildCurvedSpinePath])
  const centerPct = Math.min(96, Math.max(4, (renderY / trackHeight) * 100))

  return (
    <aside
      ref={containerRef}
      aria-label="Interactive timeline scrollbar"
      className="fixed right-0 top-0 bottom-0 z-50 select-none pointer-events-none touch-none"
      style={{ width: `${CONTAINER_WIDTH}px`, height: '100%' }}
    >
      {/* Clickable scrub track background */}
      <div
        className="pointer-events-auto absolute right-0 top-0 bottom-0 w-[48px] sm:w-[68px] cursor-ns-resize"
        onPointerDown={(e) => {
          e.preventDefault()
          setIsDragging(true)
          updateFromClientY(e.clientY, false)
        }}
      />

      {/* Ambient Radial Glow (Lime for Dark Mode, Liquid Blue for Light Mode) */}
      <div
        style={{
          top: renderY,
          left: SPINE_X - (isMobile ? 20 : 42),
          background: isDark
            ? 'radial-gradient(circle, rgba(132,204,22,0.26) 0%, rgba(132,204,22,0.08) 42%, transparent 72%)'
            : 'radial-gradient(circle, rgba(37,99,235,0.24) 0%, rgba(37,99,235,0.08) 42%, transparent 72%)',
        }}
        className="pointer-events-none absolute h-44 w-44 sm:h-52 sm:w-52 -translate-x-1/2 -translate-y-1/2 rounded-full blur-xl"
      />

      {/* SVG Canvas: Spine and Ruler Ticks */}
      <svg
        width={CONTAINER_WIDTH}
        height={trackHeight}
        viewBox={`0 0 ${CONTAINER_WIDTH} ${trackHeight}`}
        fill="none"
        className="pointer-events-none absolute inset-0 overflow-visible"
      >
        <defs>
          <linearGradient id="spine-glow-grad" x1="0" y1="0" x2="0" y2={trackHeight} gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor={isDark ? '#27272a' : '#cbd5e1'} stopOpacity="0.1" />
            <stop offset={`${Math.max(0, centerPct - 24)}%`} stopColor={isDark ? '#3f6212' : '#93c5fd'} stopOpacity="0.45" />
            <stop offset={`${Math.max(0, centerPct - 10)}%`} stopColor={isDark ? '#a3e635' : '#3b82f6'} stopOpacity="0.85" />
            <stop offset={`${centerPct}%`} stopColor={isDark ? '#bef264' : '#2563eb'} stopOpacity="1" />
            <stop offset={`${Math.min(100, centerPct + 10)}%`} stopColor={isDark ? '#a3e635' : '#3b82f6'} stopOpacity="0.85" />
            <stop offset={`${Math.min(100, centerPct + 26)}%`} stopColor={isDark ? '#3f6212' : '#93c5fd'} stopOpacity="0.45" />
            <stop offset="100%" stopColor={isDark ? '#27272a' : '#cbd5e1'} stopOpacity="0.1" />
          </linearGradient>
        </defs>

        {/* Ruler Ticks displaced smoothly with the Gaussian wave */}
        {ticks.map((t) => {
          const deflect = getWaveDisplacement(t.y, renderY)
          const proximity = Math.max(0, 1 - Math.abs(t.y - renderY) / (isMobile ? 65 : 95))
          const rightX = SPINE_X - deflect - (isMobile ? 8 : 12)
          const len = isMobile
            ? (t.isMajor ? 14 + proximity * 3 : 6 + proximity * 2)
            : (t.isMajor ? 22 + proximity * 4 : 9 + proximity * 3)

          const strokeColor = proximity > 0.35
            ? (isDark ? '#a3e635' : '#2563eb')
            : t.isMajor
            ? (isDark ? '#52525b' : '#94a3b8')
            : (isDark ? '#27272a' : '#e2e8f0')

          return (
            <line
              key={t.id}
              x1={rightX - len}
              y1={t.y}
              x2={rightX}
              y2={t.y}
              stroke={strokeColor}
              strokeOpacity={t.isMajor ? 0.55 + proximity * 0.4 : 0.38 + proximity * 0.35}
              strokeWidth={t.isMajor ? '1.15' : '0.85'}
              strokeLinecap="round"
            />
          )
        })}

        {/* Dynamic Curved Glowing Spine Path */}
        <path
          d={spinePathD}
          stroke="url(#spine-glow-grad)"
          strokeWidth={isMobile ? '1.8' : '2'}
          strokeLinecap="round"
          fill="none"
        />
      </svg>

      {/* Deflecting Milestone Labels */}
      {milestones.map((m) => {
        const yPos = m.ratio * trackHeight
        const deflect = getWaveDisplacement(yPos, renderY)
        const proximity = Math.max(0, 1 - Math.abs(yPos - renderY) / (isMobile ? 60 : 90))

        const shouldShow = isMobile ? proximity > 0.45 : proximity > 0.2
        if (!shouldShow) return null

        return (
          <button
            key={m.id}
            type="button"
            onPointerDown={(e) => {
              e.stopPropagation()
              updateFromClientY(yPos, true)
            }}
            style={{
              top: yPos,
              left: SPINE_X - deflect - (isMobile ? 18 : 44),
              transform: 'translate(-100%, -50%)',
              opacity: proximity > 0.45 ? 1 : Math.max(0.2, proximity * 1.6),
            }}
            className={`pointer-events-auto absolute z-20 rounded-full font-mono transition-all duration-200 cursor-pointer ${
              isMobile ? 'px-2 py-0.5 text-[10px]' : 'px-3 py-1 text-[12px] font-medium'
            } ${
              proximity > 0.45
                ? isDark
                  ? 'bg-zinc-900/90 text-white border border-lime-500/50 font-bold shadow-lg shadow-black/60 scale-100'
                  : 'bg-white text-blue-600 border border-blue-500/50 font-bold shadow-md shadow-blue-500/15 scale-100'
                : isDark
                ? 'bg-zinc-950/70 text-zinc-400 border border-zinc-800/60'
                : 'bg-white/80 text-slate-600 border border-slate-200/80'
            }`}
          >
            {m.label}
          </button>
        )
      })}

      {/* Floating Circular Triple-Chevron Orb */}
      <div
        style={{
          top: renderY,
          left: SPINE_X + (isMobile ? 16 : 34),
          transform: 'translate(-50%, -50%)',
        }}
        className="pointer-events-auto absolute z-30 cursor-grab active:cursor-grabbing"
        onPointerDown={(e) => {
          e.stopPropagation()
          setIsDragging(true)
          updateFromClientY(e.clientY, false)
        }}
      >
        <div className={`flex items-center justify-center rounded-full ${isMobile ? 'h-14 w-14' : 'h-20 w-20'} bg-zinc-950/30`}>
          <div
            className={`flex items-center justify-center rounded-full border transition-transform duration-150 active:scale-95 ${
              isMobile ? 'h-10 w-10' : 'h-14 w-14'
            } ${
              isDark ? 'border-zinc-800/70' : 'border-blue-200/80'
            }`}
            style={{
              background: isDark
                ? 'radial-gradient(circle at 35% 30%, #1c222b 0%, #11151c 70%, #0b0e13 100%)'
                : 'radial-gradient(circle at 35% 30%, #ffffff 0%, #f1f5f9 70%, #e2e8f0 100%)',
              boxShadow: isDark
                ? '0 10px 30px rgba(0,0,0,0.85), inset 0 1px 1px rgba(255,255,255,0.08)'
                : '0 8px 24px rgba(37,99,235,0.18), inset 0 1px 1px rgba(255,255,255,0.9)',
            }}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className={`${isMobile ? 'h-4 w-4' : 'h-6 w-6'} transition-transform duration-300 ${
                scrollDirection === 'down' ? 'rotate-180' : ''
              }`}
            >
              <path
                d="M7.5 10L12 5.5L16.5 10"
                stroke={isDark ? '#65a30d' : '#93c5fd'}
                strokeOpacity="0.45"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M7.5 14.2L12 9.7L16.5 14.2"
                stroke={isDark ? '#bef264' : '#2563eb'}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M7.5 18.4L12 13.9L16.5 18.4"
                stroke={isDark ? '#65a30d' : '#93c5fd'}
                strokeOpacity="0.45"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </div>
    </aside>
  )
}
