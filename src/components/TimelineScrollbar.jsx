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

  // ── SYNTHESIZED HAPTIC WEB AUDIO ENGINE ──
  const audioCtxRef = useRef(null)
  const lastSoundYRef = useRef(0)
  const lastMilestoneIdxRef = useRef(-1)
  const [soundEnabled, setSoundEnabled] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('portfolio_scroll_sound')
      return saved !== null ? saved === 'true' : true
    }
    return true
  })

  // Initialize or resume AudioContext safely on user gesture
  const initAudio = useCallback(() => {
    if (typeof window === 'undefined') return null
    try {
      if (!audioCtxRef.current) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext
        if (AudioCtx) {
          audioCtxRef.current = new AudioCtx()
        }
      }
      if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume()
      }
      return audioCtxRef.current
    } catch {
      return null
    }
  }, [])

  // Play micro mechanical haptic tick (ratchet feel)
  const playTick = useCallback((pitch = 950) => {
    if (!soundEnabled) return
    const ctx = initAudio()
    if (!ctx) return

    try {
      const now = ctx.currentTime
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()

      osc.type = 'triangle'
      osc.frequency.setValueAtTime(pitch, now)
      osc.frequency.exponentialRampToValueAtTime(pitch * 0.45, now + 0.007)

      gain.gain.setValueAtTime(0.032, now)
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.007)

      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.start(now)
      osc.stop(now + 0.008)
    } catch {
      // Audio safety fallback
    }
  }, [soundEnabled, initAudio])

  // Play resonant milestone chime when entering a section
  const playMilestoneChime = useCallback(() => {
    if (!soundEnabled) return
    const ctx = initAudio()
    if (!ctx) return

    try {
      const now = ctx.currentTime
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()

      osc.type = 'sine'
      osc.frequency.setValueAtTime(587.33, now) // D5
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.04) // Harmonic lift

      gain.gain.setValueAtTime(0.05, now)
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08)

      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.start(now)
      osc.stop(now + 0.09)
    } catch {
      // Audio safety fallback
    }
  }, [soundEnabled, initAudio])

  // Geometry dimensions: tight right-edge alignment
  const trackHeight = viewportHeight
  const CONTAINER_WIDTH = isMobile ? 60 : 250
  const SPINE_X = isMobile ? 48 : 226
  const MAX_DEFLECT_X = isMobile ? 20 : 32
  const CURVE_HALF_SPAN = isMobile ? 56 : 74
  const GAUSSIAN_SIGMA = isMobile ? 28 : 36
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

  // Spring animation change listener & audio trigger
  useEffect(() => {
    return smoothY.on('change', (latest) => {
      setRenderY(latest)

      // Play haptic tick every 24px of smooth displacement
      const diff = Math.abs(latest - lastSoundYRef.current)
      if (diff >= 24) {
        const isScrollingDown = latest >= lastSoundYRef.current
        const pitch = isScrollingDown ? 1020 : 860
        playTick(pitch)
        lastSoundYRef.current = latest
      }

      // Check proximity to milestone markers for resonant chime
      for (let i = 0; i < milestones.length; i++) {
        const mY = milestones[i].ratio * trackHeight
        if (Math.abs(latest - mY) < 10) {
          if (lastMilestoneIdxRef.current !== i) {
            playMilestoneChime()
            lastMilestoneIdxRef.current = i
          }
          break
        }
      }
    })
  }, [smoothY, trackHeight, milestones, playTick, playMilestoneChime])

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
      initAudio()
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
    [trackHeight, targetY, initAudio]
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
      {/* Clickable scrub track background placed directly at the right edge */}
      <div
        className="pointer-events-auto absolute right-0 top-0 bottom-0 w-[36px] sm:w-[48px] cursor-ns-resize"
        onPointerDown={(e) => {
          e.preventDefault()
          initAudio()
          setIsDragging(true)
          updateFromClientY(e.clientY, false)
        }}
      />

      {/* Ambient Radial Glow (Lime for Dark Mode, Liquid Blue for Light Mode) */}
      <div
        style={{
          top: renderY,
          left: SPINE_X - (isMobile ? 12 : 24),
          background: isDark
            ? 'radial-gradient(circle, rgba(132,204,22,0.26) 0%, rgba(132,204,22,0.08) 42%, transparent 72%)'
            : 'radial-gradient(circle, rgba(37,99,235,0.24) 0%, rgba(37,99,235,0.08) 42%, transparent 72%)',
        }}
        className="pointer-events-none absolute h-40 w-40 sm:h-48 sm:w-48 -translate-x-1/2 -translate-y-1/2 rounded-full blur-xl"
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
          const rightX = SPINE_X - deflect - (isMobile ? 6 : 8)
          const len = isMobile
            ? (t.isMajor ? 12 + proximity * 3 : 5 + proximity * 2)
            : (t.isMajor ? 18 + proximity * 4 : 8 + proximity * 3)

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
              initAudio()
              updateFromClientY(yPos, true)
            }}
            style={{
              top: yPos,
              left: SPINE_X - deflect - (isMobile ? 16 : 38),
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
          left: SPINE_X + (isMobile ? 0 : 8),
          transform: 'translate(-50%, -50%)',
        }}
        className="pointer-events-auto absolute z-30 cursor-grab active:cursor-grabbing"
        onPointerDown={(e) => {
          e.stopPropagation()
          initAudio()
          setIsDragging(true)
          updateFromClientY(e.clientY, false)
        }}
      >
        <div className={`flex items-center justify-center rounded-full ${isMobile ? 'h-11 w-11' : 'h-14 w-14'} bg-zinc-950/25`}>
          <div
            className={`flex items-center justify-center rounded-full border transition-transform duration-150 active:scale-95 ${
              isMobile ? 'h-8 w-8' : 'h-11 w-11'
            } ${
              isDark ? 'border-zinc-800/70' : 'border-blue-200/80'
            }`}
            style={{
              background: isDark
                ? 'radial-gradient(circle at 35% 30%, #1c222b 0%, #11151c 70%, #0b0e13 100%)'
                : 'radial-gradient(circle at 35% 30%, #ffffff 0%, #f1f5f9 70%, #e2e8f0 100%)',
              boxShadow: isDark
                ? '0 10px 24px rgba(0,0,0,0.85), inset 0 1px 1px rgba(255,255,255,0.08)'
                : '0 6px 18px rgba(37,99,235,0.18), inset 0 1px 1px rgba(255,255,255,0.9)',
            }}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className={`${isMobile ? 'h-3.5 w-3.5' : 'h-5 w-5'} transition-transform duration-300 ${
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

      {/* Discrete Haptic Sound Toggle Button */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation()
          const next = !soundEnabled
          setSoundEnabled(next)
          localStorage.setItem('portfolio_scroll_sound', String(next))
          if (next) {
            initAudio()
            playTick(1100)
          }
        }}
        title={soundEnabled ? 'Mute scroll sound' : 'Enable scroll sound'}
        aria-label={soundEnabled ? 'Mute scroll sound' : 'Enable scroll sound'}
        className={`pointer-events-auto absolute bottom-3 right-1.5 sm:right-2.5 z-40 p-1.5 rounded-full backdrop-blur-md border transition-all duration-200 cursor-pointer ${
          soundEnabled
            ? isDark
              ? 'bg-[#11161B]/85 text-lime-400 border-lime-500/40 hover:scale-110 shadow-sm shadow-lime-950/30'
              : 'bg-white/85 text-blue-600 border-blue-500/40 hover:scale-110 shadow-sm shadow-blue-500/10'
            : isDark
            ? 'bg-zinc-950/60 text-zinc-500 border-zinc-800/60 hover:text-zinc-300'
            : 'bg-white/60 text-slate-400 border-slate-200 hover:text-slate-600'
        }`}
      >
        {soundEnabled ? (
          <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
          </svg>
        ) : (
          <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
            <line x1="23" y1="9" x2="17" y2="15" />
            <line x1="17" y1="9" x2="23" y2="15" />
          </svg>
        )}
      </button>
    </aside>
  )
}
