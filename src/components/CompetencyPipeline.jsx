import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import './CompetencyPipeline.css'

// ============================================================================
// STAGE ICONS
// ============================================================================

const ICON = 'w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10'

function IdeaMark() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={`${ICON} fill-none stroke-current`} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-1 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
      <path d="M9 18h6" />
      <path d="M10 22h4" />
      <path d="M12 2v2" />
      <path d="M4.93 4.93l1.41 1.41" />
      <path d="M19.07 4.93l-1.41 1.41" />
    </svg>
  )
}

function NextMark() {
  return (
    <svg aria-hidden="true" viewBox="0 0 32 32" className={`${ICON} fill-current`}>
      <circle cx="16" cy="16" r="14" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M10 9h3.4l7.1 10.2V9H24v14h-3.2l-7.3-10.4V23H10V9Z" />
    </svg>
  )
}

function ExpressMark() {
  // Wider viewBox so the full "express" wordmark is never clipped
  return (
    <svg aria-hidden="true" viewBox="0 0 80 24" className="w-10 h-3.5 sm:w-14 sm:h-5 lg:w-16 lg:h-6 fill-current">
      <text x="40" y="18" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="19" fontWeight="800" letterSpacing="-0.5">
        express
      </text>
    </svg>
  )
}

function VercelMark() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={`${ICON} fill-current`}>
      <path d="m12 3 10 18H2L12 3Z" />
    </svg>
  )
}

// ============================================================================
// PIPELINE PHASES
// ============================================================================

const phases = [
  {
    id: '01',
    shortLabel: 'Idea',
    label: 'Idea & Scope',
    stage: 'Concept & Architecture',
    eyebrow: 'Phase 01 · Product Discovery',
    title: 'Concept & System Scoping',
    headline: 'Transforming raw ideas and client requirements into concrete technical roadmaps.',
    description: 'Analyzing real client requirements, scoping user flows, defining feature scope, and architecting the data model before writing code.',
    tags: ['Problem Discovery', 'User Flows', 'System Architecture'],
    command: 'project.init --scope=mvp --architecture=fullstack',
    status: 'SCOPED',
    metric: 'Architecture Defined',
    Icon: IdeaMark
  },
  {
    id: '02',
    shortLabel: 'Next.js',
    label: 'Next.js & React',
    stage: 'Client Systems',
    eyebrow: 'Phase 02 · Frontend Composition',
    title: 'Performant Client Architecture',
    headline: 'Composing sub-second, interactive web experiences.',
    description: 'Engineering responsive frontends with React 19, server-side pre-rendering, granular code-splitting, and silky micro-interactions.',
    tags: ['React 19', 'Next.js App Router', 'Tailwind CSS v4'],
    command: 'next build --turbopack --target=edge',
    status: 'OPTIMIZED',
    metric: '100% Lighthouse Score',
    Icon: NextMark
  },
  {
    id: '03',
    shortLabel: 'Express',
    label: 'Node & Express',
    stage: 'Backend & Data',
    eyebrow: 'Phase 03 · API & Microservices',
    title: 'Scalable Endpoints & Contracts',
    headline: 'Engineered for high throughput, data integrity, and strict security.',
    description: 'Building resilient RESTful services with JWT authentication, role-based access middleware, and normalized database schemas.',
    tags: ['Express.js', 'PostgreSQL / MongoDB', 'JWT Auth'],
    command: 'api.mount --routes=/v1 --jwt-verify',
    status: 'AUTHENTICATED',
    metric: '99.98% API Reliability',
    Icon: ExpressMark
  },
  {
    id: '04',
    shortLabel: 'Vercel',
    label: 'Vercel & Cloud',
    stage: 'Production Edge',
    eyebrow: 'Phase 04 · Global CI/CD',
    title: 'Worldwide Edge Network Delivery',
    headline: 'Promoting verified builds into production across 300+ edge nodes.',
    description: 'Automated GitHub integration, instant preview branches for team validation, and globally distributed low-latency delivery.',
    tags: ['Vercel Edge CDN', 'CI/CD Pipelines', 'Real-time Telemetry'],
    command: 'vercel deploy --prod --regions=global',
    status: 'LIVE ON EDGE',
    metric: '< 25ms Global TTFB',
    Icon: VercelMark
  }
]

const JUMP_INTERVAL = 4200 // long enough to actually read a phase
const JUMP_DURATION = 0.62

// ============================================================================
// HOOKS
// ============================================================================

function useIsMobile(breakpoint = 640) {
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth < breakpoint : false
  )
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < breakpoint)
    onResize()
    window.addEventListener('resize', onResize, { passive: true })
    return () => window.removeEventListener('resize', onResize)
  }, [breakpoint])
  return isMobile
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function CompetencyPipeline() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [showLogs, setShowLogs] = useState(true)
  const isMobile = useIsMobile()
  const reduceMotion = useReducedMotion()
  const tabRefs = useRef([])

  const active = phases[activeIndex]
  const arc = isMobile ? 38 : 60

  const logs = useMemo(
    () =>
      phases.slice(0, activeIndex + 1).map((phase, index) => ({
        ...phase,
        time: `0${index + 1}:${(index * 14 + 10).toString().padStart(2, '0')}`,
        raw: `${phase.command} -> [${phase.status}]`
      })),
    [activeIndex]
  )

  // Auto-advance continuously (keeps running while the user is in the section)
  useEffect(() => {
    const timer = setTimeout(() => {
      setActiveIndex((curr) => (curr + 1) % phases.length)
    }, JUMP_INTERVAL)
    return () => clearTimeout(timer)
  }, [activeIndex])

  // Arrow-key navigation between phase tabs
  const onTabKeyDown = useCallback((e) => {
    const dir = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0
    if (!dir) return
    e.preventDefault()
    setActiveIndex((curr) => {
      const next = (curr + dir + phases.length) % phases.length
      tabRefs.current[next]?.focus()
      return next
    })
  }, [])

  return (
    <section
      id="pipeline"
      className="pipeline w-full"
      aria-labelledby="pipeline-title"
    >
      <div className="container">

        {/* ── 1. HEADER ───────────────────────────────────────────────── */}
        <header className="pipeline-header">
          <div>
            <p className="section-label">// Execution Pipeline</p>
            <h2 id="pipeline-title" className="section-title text-3xl sm:text-4xl">
              From Concept to{' '}
              <span className="text-accent italic font-serif">Production</span>
            </h2>
            <p className="pipeline-sub text-base sm:text-lg text-text-2 leading-relaxed">
              How product vision transforms methodically through four specialized phases — from project conception to global edge infrastructure.
            </p>
          </div>

          <div className="pipeline-status font-mono text-xs text-text-2" aria-live="polite">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-semibold text-text-1 tracking-wider">PIPELINE ACTIVE</span>
            <span className="text-text-3">{active.id}/0{phases.length}</span>
          </div>
        </header>

        {/* ── 2. ANIMATION STAGE ─────────────────────────────────────── */}
        <div className="pipeline-stage">
          <div className="pipeline-track" role="tablist" aria-label="Pipeline phases">

            {/* Rail sits behind the nodes (nodes mask it with their own background) */}
            <div className="pipeline-rail" aria-hidden="true">
              <motion.div
                className="h-full bg-accent rounded-full"
                animate={{ width: `${(activeIndex / (phases.length - 1)) * 100}%` }}
                transition={{ type: 'spring', stiffness: 200, damping: 26 }}
              />
            </div>

            {/* Ball — always rests ON TOP of the active node, never covers its icon */}
            <motion.div
              className="pipeline-ball-lane"
              aria-hidden="true"
              initial={false}
              animate={{ left: `${12.5 + activeIndex * 25}%` }}
              transition={reduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 170, damping: 22 }}
            >
              <div className="pipeline-ball-offset">
                <motion.div
                  key={activeIndex}
                  initial={{ y: 0, scaleY: 1, scaleX: 1 }}
                  animate={
                    reduceMotion
                      ? { y: 0 }
                      : {
                          y: [0, -arc, 0],
                          scaleY: [1, 1.35, 0.78, 1],
                          scaleX: [1, 0.8, 1.25, 1]
                        }
                  }
                  transition={{ duration: JUMP_DURATION, times: [0, 0.46, 0.9, 1], ease: ['easeOut', 'easeIn', 'easeOut'] }}
                  className="pipeline-ball rounded-full bg-accent border-2 border-white flex items-center justify-center shadow-[0_0_18px_rgba(200,90,60,0.85),0_0_40px_rgba(200,90,60,0.4)]"
                  style={{ transformOrigin: '50% 100%' }}
                >
                  <span className="w-1/3 h-1/3 rounded-full bg-white" />
                </motion.div>
              </div>
            </motion.div>

            {/* Phase nodes */}
            {phases.map((phase, index) => {
              const isActive = index === activeIndex
              const isDone = index < activeIndex
              return (
                <button
                  key={phase.id}
                  ref={(el) => { tabRefs.current[index] = el }}
                  type="button"
                  role="tab"
                  id={`pipeline-tab-${phase.id}`}
                  aria-selected={isActive}
                  aria-controls="pipeline-panel"
                  tabIndex={isActive ? 0 : -1}
                  onClick={() => setActiveIndex(index)}
                  onKeyDown={onTabKeyDown}
                  className="pipeline-node-btn group"
                >
                  <div className={`pipeline-node ${isActive ? 'is-active' : ''} ${isDone ? 'is-done' : ''}`}>
                    {isActive && !reduceMotion && (
                      <motion.span
                        key={`ripple-${activeIndex}`}
                        className="pointer-events-none absolute inset-0 rounded-full border-2 border-accent"
                        initial={{ scale: 1, opacity: 0.9 }}
                        animate={{ scale: 1.45, opacity: 0 }}
                        transition={{ duration: 0.7, delay: JUMP_DURATION * 0.85, ease: 'easeOut' }}
                      />
                    )}
                    <span
                      className={`relative z-10 flex items-center justify-center transition-all duration-300 ${
                        isActive
                          ? 'text-text-1 scale-110'
                          : isDone
                            ? 'text-text-2 opacity-70 group-hover:opacity-100'
                            : 'text-text-3 opacity-45 group-hover:opacity-90'
                      }`}
                    >
                      <phase.Icon />
                    </span>
                  </div>

                  <span
                    className={`pipeline-node-label block text-center text-xs sm:text-base lg:text-lg font-semibold tracking-tight leading-tight transition-colors duration-200 ${
                      isActive ? 'text-text-1' : 'text-text-3 group-hover:text-text-2'
                    }`}
                  >
                    <span className="sm:hidden">{phase.shortLabel}</span>
                    <span className="hidden sm:inline">{phase.label}</span>
                  </span>
                  <span
                    className={`pipeline-node-stage hidden sm:block text-center font-mono text-[11px] lg:text-xs transition-colors duration-200 ${
                      isActive ? 'text-accent' : 'text-text-3/70'
                    }`}
                  >
                    {phase.id} · {phase.stage}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* ── 3. DETAILS ─────────────────────────────────────────────── */}
        <div className="pipeline-details">

          {/* Editorial panel */}
          <div
            id="pipeline-panel"
            role="tabpanel"
            aria-labelledby={`pipeline-tab-${active.id}`}
            className="pipeline-editorial"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={active.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="pipeline-meta">
                  <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent font-semibold">
                    {active.eyebrow}
                  </p>
                  <span className="pipeline-pill font-mono text-[11px] text-text-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    {active.metric}
                  </span>
                </div>

                <h3 className="pipeline-title text-2xl sm:text-3xl lg:text-[2.1rem] font-bold tracking-tight leading-tight text-text-1">
                  {active.title}
                </h3>

                <p className="pipeline-quote text-base sm:text-lg italic text-text-2 leading-relaxed">
                  {active.headline}
                </p>

                <p className="pipeline-desc text-sm sm:text-base text-text-3 leading-relaxed">
                  {active.description}
                </p>

                <div className="pipeline-tags">
                  {active.tags.map((tag) => (
                    <span key={tag} className="pipeline-pill font-mono text-xs text-text-2">
                      <span className="w-1 h-1 rounded-full bg-accent" />
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Auto-advance progress (makes the timing visible & predictable) */}
            <div className="pipeline-timer" aria-hidden="true">
              {!reduceMotion && (
                <motion.div
                  key={`timer-${activeIndex}`}
                  className="h-full bg-accent/70"
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{ duration: JUMP_INTERVAL / 1000, ease: 'linear' }}
                />
              )}
            </div>
          </div>

          {/* Deployment feed */}
          <div className="pipeline-terminal font-mono">
            <div className="pipeline-term-head">
              <div className="flex items-center gap-2">
                <svg className="w-3.5 h-3.5 fill-current text-text-1" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="m12 3 10 18H2L12 3Z" />
                </svg>
                <p className="text-xs font-semibold uppercase tracking-wider text-text-1">Deployment Feed</p>
                <span className="hidden sm:inline text-[11px] text-text-3">// vercel.app</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="pipeline-chip inline-flex items-center gap-1.5 text-[10px] font-semibold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  READY
                </span>
                <button
                  type="button"
                  onClick={() => setShowLogs((v) => !v)}
                  className="pipeline-toggle text-[10px] text-text-3 hover:text-text-1 transition-colors"
                  aria-expanded={showLogs}
                >
                  {showLogs ? 'hide' : 'show'}
                </button>
              </div>
            </div>

            <div className="pipeline-term-env text-[11px] text-text-3">
              <span>env: <strong className="text-text-2 font-normal">production</strong></span>
              <span>branch: <strong className="text-text-2 font-normal">main</strong></span>
              <span>region: <strong className="text-text-2 font-normal">edge</strong></span>
            </div>

            {showLogs && (
              <div className="pipeline-term-logs text-xs" aria-live="polite">
                {logs.map((log) => {
                  const isCurrent = log.id === active.id
                  return (
                    <motion.div
                      key={log.id}
                      initial={{ opacity: 0, x: -6 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2 }}
                      className={`pipeline-term-line ${isCurrent ? 'is-current text-text-1' : 'text-text-2'}`}
                    >
                      <span className="text-text-3 text-[10px] shrink-0">{log.time}</span>
                      <span className={`shrink-0 font-bold ${isCurrent ? 'text-accent' : 'text-emerald-500'}`}>
                        {isCurrent ? '▲' : '✓'}
                      </span>
                      <span className="truncate" title={log.raw}>{log.raw}</span>
                    </motion.div>
                  )
                })}
                <div className="pipeline-term-foot text-[11px] text-text-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  awaiting next trigger_
                </div>
              </div>
            )}
          </div>
        </div>

        <p className="pipeline-hint text-center font-mono text-[11px] text-text-3 uppercase tracking-wider">
          {isMobile ? 'Tap a phase to explore' : 'Click a phase or use ← → keys'} · Auto-cycles every {JUMP_INTERVAL / 1000}s
        </p>
      </div>
    </section>
  )
}
