import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

// ============================================================================
// STAGE ICONS (EXPANSIVE SVG MARKS)
// ============================================================================

function IdeaMark({ className = 'w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12' }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={`${className} fill-none stroke-current`} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-1 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
      <path d="M9 18h6" />
      <path d="M10 22h4" />
      <path d="M12 2v2" />
      <path d="M4.93 4.93l1.41 1.41" />
      <path d="M19.07 4.93l-1.41 1.41" />
    </svg>
  )
}

function NextMark({ className = 'w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12' }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 32 32" className={`${className} fill-current`}>
      <circle cx="16" cy="16" r="14" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M10 9h3.4l7.1 10.2V9H24v14h-3.2l-7.3-10.4V23H10V9Z" />
    </svg>
  )
}

function ExpressMark({ className = 'w-12 h-6 sm:w-14 sm:h-8 md:w-16 md:h-10' }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 64 24" className={`${className} fill-current`}>
      <text x="0" y="18" fontFamily="Arial, sans-serif" fontSize="19" fontWeight="800" letterSpacing="-1">
        express
      </text>
    </svg>
  )
}

function VercelMark({ className = 'w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12' }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={`${className} fill-current`}>
      <path d="m12 2 11 19H1L12 2Z" />
    </svg>
  )
}

// ============================================================================
// PIPELINE PHASES METADATA
// ============================================================================

const phases = [
  {
    id: '01',
    label: 'Idea & Scope',
    stage: 'Concept & Architecture',
    eyebrow: 'PHASE 01 // PRODUCT DISCOVERY',
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
    label: 'Next.js & React',
    stage: 'Client Systems',
    eyebrow: 'PHASE 02 // FRONTEND COMPOSITION',
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
    label: 'Node & Express',
    stage: 'Backend & Data',
    eyebrow: 'PHASE 03 // API & MICROSERVICES',
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
    label: 'Vercel & Cloud',
    stage: 'Production Edge',
    eyebrow: 'PHASE 04 // GLOBAL CI/CD',
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

// Cadence for natural auto-jump
const JUMP_INTERVAL = 3400

// ============================================================================
// MAIN COMPONENT: COMPETENCY PIPELINE
// ============================================================================

export default function CompetencyPipeline() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [showLogs, setShowLogs] = useState(true)
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth < 640 : false
  )

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640)
    }
    handleResize()
    window.addEventListener('resize', handleResize, { passive: true })
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const active = phases[activeIndex]

  // Dynamic console output
  const logs = useMemo(
    () =>
      phases.slice(0, activeIndex + 1).map((phase, index) => ({
        ...phase,
        time: `0${index + 1}:${(index * 14 + 10).toString().padStart(2, '0')}`,
        raw: `${phase.command} -> [${phase.status}]`
      })),
    [activeIndex]
  )

  // Auto-jump cycle
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((curr) => (curr + 1) % phases.length)
    }, JUMP_INTERVAL)
    return () => clearInterval(timer)
  }, [activeIndex])

  return (
    <section
      id="pipeline"
      className="w-full py-16 sm:py-20 md:py-24"
      aria-labelledby="pipeline-title"
    >
      <div className="container max-w-[1240px] mx-auto px-4 sm:px-6 md:px-8 pr-7 sm:pr-8 md:pr-10">

        {/* ── SECTION HEADER ── */}
        <div className="mb-8 md:mb-12 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <p className="section-label">// Execution Pipeline</p>
            <h2 id="pipeline-title" className="section-title mt-1.5 text-2xl sm:text-3xl md:text-4xl">
              From Concept to{' '}
              <span className="text-accent italic font-serif">
                Production
              </span>
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-text-2 max-w-[660px] mt-2.5 leading-relaxed">
              How product vision transforms methodically through four specialized phases from project conception to global edge infrastructure.
            </p>
          </div>

          <div className="inline-flex items-center gap-2 self-start md:self-auto px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full bg-background-1 border border-border-light text-text-2 font-mono text-xs shadow-sm">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.7)]" />
            <span className="font-semibold text-text-1">PIPELINE ACTIVE</span>
          </div>
        </div>

        {/* ── EXPANSIVE BORDERLESS ANIMATION STAGE (NO CADRES / GENEROUS ELEVATION) ── */}
        <div
          className="relative overflow-visible w-full pt-14 sm:pt-20 md:pt-24 pb-12 sm:pb-18 md:pb-24 mt-2 sm:mt-4 mb-4 sm:mb-8 md:mb-12"
        >
          {/* Inner Grid with Anchored Center Rail & Jumping Ball */}
          <div className="relative z-10 grid grid-cols-4 gap-1 sm:gap-4 md:gap-8 items-start justify-items-center">

            {/* Connecting Rail: Anchored mathematically to the vertical center of the icons */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute left-[12.5%] right-[12.5%] top-[34px] sm:top-[60px] md:top-[76px] -translate-y-1/2 h-[3px] bg-border-strong rounded-full overflow-visible"
            >
              {/* Active connecting beam */}
              <motion.div
                className="h-full bg-gradient-to-r from-accent/20 via-accent/80 to-accent rounded-full"
                animate={{ width: `${(activeIndex / (phases.length - 1)) * 100}%` }}
                transition={{ type: 'spring', stiffness: 200, damping: 24 }}
              />
            </div>

            {/* The Soaring Jumping Ball (Grand parabolic leap) */}
            <motion.div
              className="absolute top-[34px] sm:top-[60px] md:top-[76px] -translate-y-1/2 z-30 pointer-events-none -translate-x-1/2"
              animate={{
                left: `${12.5 + activeIndex * 25}%`
              }}
              transition={{
                type: 'spring',
                stiffness: 170,
                damping: 22
              }}
            >
              {/* The Bouncing Ball with Generous Clearance & Fluid Physics */}
              <motion.div
                key={activeIndex}
                initial={{ y: 0, scaleY: 1, scaleX: 1 }}
                animate={{
                  y: isMobile ? [0, -42, 0] : [0, -75, 0],
                  scaleY: [1, 1.5, 0.7, 1],
                  scaleX: [1, 0.68, 1.45, 1]
                }}
                transition={{
                  duration: 0.62,
                  times: [0, 0.46, 0.9, 1],
                  ease: ['easeOut', 'easeIn', 'easeOut']
                }}
                className="relative flex items-center justify-center"
              >
                {/* Large Glowing Energy Orb */}
                <div className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 rounded-full bg-accent border-2 border-white shadow-[0_0_20px_rgba(200,90,60,0.9),0_0_40px_rgba(200,90,60,0.5)] sm:shadow-[0_0_25px_rgba(200,90,60,1),0_0_50px_rgba(200,90,60,0.6)] flex items-center justify-center">
                  <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-white shadow-sm animate-pulse" />
                </div>

                {/* Dynamic Ground Shadow under ball */}
                <motion.div
                  key={`shadow-${activeIndex}`}
                  initial={{ scale: 1, opacity: 0.85 }}
                  animate={{
                    scale: [1, 0.15, 1.35, 1],
                    opacity: [0.85, 0.1, 0.9, 0.7]
                  }}
                  transition={{
                    duration: 0.62,
                    times: [0, 0.46, 0.9, 1]
                  }}
                  className="absolute -bottom-3 sm:-bottom-3.5 w-7 sm:w-8 h-2 rounded-full bg-accent/60 blur-[3px]"
                />
              </motion.div>
            </motion.div>

            {/* 4 Borderless Tool Nodes */}
            {phases.map((phase, index) => {
              const isActive = index === activeIndex
              return (
                <button
                  key={phase.id}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  className="group relative flex flex-col items-center focus:outline-none cursor-pointer px-1 pt-1 pb-2 sm:px-3 sm:pt-3 sm:pb-4 md:px-5 md:pt-5 md:pb-6 text-center transition-transform w-full"
                >
                  {/* Floating Icon Base */}
                  <div className="relative flex items-center justify-center w-16 h-16 sm:w-24 sm:h-24 md:w-28 md:h-28">
                    
                    {/* Impact Ripple Ring upon ball landing */}
                    {isActive && (
                      <motion.div
                        key={`impact-${activeIndex}`}
                        className="pointer-events-none absolute inset-0 rounded-full border-2 border-accent"
                        initial={{ scale: 0.45, opacity: 1 }}
                        animate={{ scale: isMobile ? 1.35 : 1.6, opacity: 0 }}
                        transition={{ duration: 0.65, ease: 'easeOut' }}
                      />
                    )}

                    {/* Ambient Aura Glow under active tool */}
                    {isActive && (
                      <motion.div
                        layoutId="active-jump-glow"
                        className="absolute inset-0 rounded-full bg-accent/30 blur-lg sm:blur-xl pointer-events-none"
                        transition={{ type: 'spring', stiffness: 350, damping: 28 }}
                      />
                    )}

                    {/* Floating Tool Icon (Spring Bounce on Landing) */}
                    <motion.div
                      key={`icon-${isActive}`}
                      animate={
                        isActive
                          ? {
                              scale: isMobile ? [1, 1.25, 1.12] : [1, 1.4, 1.18],
                              y: [0, 6, -2]
                            }
                          : {
                              scale: 0.85,
                              y: 0
                            }
                      }
                      transition={{
                        duration: 0.5,
                        delay: 0.44, // Synchronized with ball touchdown
                        ease: [0.175, 0.885, 0.32, 1.275]
                      }}
                      className={`relative z-10 flex items-center justify-center drop-shadow-md transition-opacity duration-300 ${
                        isActive ? 'opacity-100 text-text-1' : 'opacity-35 hover:opacity-85 text-text-2'
                      }`}
                    >
                      <phase.Icon />
                    </motion.div>
                  </div>

                  {/* Metadata Labels */}
                  <div className="mt-2.5 sm:mt-3 flex flex-col items-center">
                    <span
                      className={`text-xs sm:text-base md:text-lg font-semibold tracking-tight transition-colors duration-200 text-center leading-tight ${
                        isActive ? 'text-text-1 font-bold' : 'text-text-3 group-hover:text-text-2'
                      }`}
                    >
                      {phase.label}
                    </span>
                    <span
                      className={`hidden sm:block text-[10px] md:text-xs font-mono mt-1 transition-colors duration-200 text-center ${
                        isActive ? 'text-accent font-semibold' : 'text-text-3/60'
                      }`}
                    >
                      {phase.id} · {phase.stage}
                    </span>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* ── BORDERLESS EDITORIAL EXPLANATION & LIVE FEED (NO HEAVY BOXES / CADRES) ── */}
        <div className="grid gap-6 lg:gap-8 lg:grid-cols-[1.7fr_1fr] pt-6 sm:pt-10 md:pt-14">

          {/* Clean Borderless Stage Description */}
          <div className="relative flex flex-col justify-between">
            <AnimatePresence mode="wait">
              <motion.div
                key={active.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
                    <p className="font-mono text-xs uppercase tracking-[0.22em] text-accent font-semibold">
                      {active.eyebrow}
                    </p>
                    <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-background-1 border border-border-light text-[11px] font-mono text-text-2 shadow-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                      {active.metric}
                    </span>
                  </div>

                  <h3 className="mt-2.5 sm:mt-3 text-2xl sm:text-3xl font-bold tracking-tight text-text-1">
                    {active.title}
                  </h3>

                  <p className="mt-2 text-base sm:text-lg font-medium text-text-2 italic">
                    "{active.headline}"
                  </p>

                  <p className="mt-3 sm:mt-4 text-sm sm:text-base text-text-3 leading-relaxed max-w-2xl">
                    {active.description}
                  </p>
                </div>

                {/* Capability Tags */}
                <div className="mt-6 sm:mt-8 flex flex-wrap gap-2 sm:gap-2.5">
                  {active.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1.5 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-background-1 border border-border-light text-xs font-mono font-medium text-text-2 shadow-sm"
                    >
                      <span className="w-1 h-1 rounded-full bg-accent" />
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Vercel-Inspired Deployment Feed (Dashed Cadre & Clean CLI Aesthetic) */}
          <div className="relative rounded-xl border border-dashed border-border-strong bg-background-1/90 backdrop-blur-md p-4 sm:p-5 shadow-sm font-mono flex flex-col justify-between overflow-hidden">
            {/* Header */}
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-dashed border-border-strong flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <svg className="w-3.5 h-3.5 fill-current text-text-1" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="m12 2 11 19H1L12 2Z" />
                  </svg>
                  <p className="font-mono text-xs font-semibold uppercase tracking-wider text-text-1">
                    Deployment Feed
                  </p>
                  <span className="hidden sm:inline-block font-mono text-[10px] text-text-3">
                    // vercel.app
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    READY
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowLogs((v) => !v)}
                    className="rounded border border-dashed border-border-light px-2 py-0.5 font-mono text-[10px] text-text-3 hover:text-text-1 hover:border-border-strong transition-colors cursor-pointer"
                    aria-expanded={showLogs}
                  >
                    {showLogs ? 'hide' : 'show'}
                  </button>
                </div>
              </div>

              {/* Vercel Metadata Row */}
              <div className="pt-2.5 pb-1 flex items-center justify-between text-[10px] sm:text-[11px] font-mono text-text-3 border-b border-dashed border-border-light/60 flex-wrap gap-1 sm:gap-2">
                <span>env: <strong className="text-text-2 font-normal">production</strong></span>
                <span>branch: <strong className="text-text-2 font-normal">main</strong></span>
                <span>region: <strong className="text-text-2 font-normal">edge</strong></span>
              </div>
            </div>

            {/* Logs Body */}
            {showLogs && (
              <div className="mt-3.5 flex flex-col gap-2 font-mono text-xs leading-relaxed overflow-hidden">
                {logs.map((log) => {
                  const isCurrent = log.id === active.id
                  return (
                    <div
                      key={log.id}
                      className={`flex items-center gap-2 px-2 py-1 rounded transition-colors ${
                        isCurrent
                          ? 'bg-accent/10 border-l-2 border-accent text-text-1'
                          : 'text-text-2 hover:bg-background-2/40'
                      }`}
                    >
                      <span className="text-text-3 text-[10px] shrink-0 font-mono">
                        {log.time}
                      </span>
                      <span className={`text-[11px] shrink-0 font-bold ${isCurrent ? 'text-accent' : 'text-emerald-500'}`}>
                        {isCurrent ? '▲' : '✓'}
                      </span>
                      <span className="truncate text-xs">
                        {log.raw}
                      </span>
                    </div>
                  )
                })}

                <div className="flex items-center gap-2 text-text-3 text-[11px] mt-2 pt-2 border-t border-dashed border-border-light/60">
                  <span className="w-1.5 h-1.5 animate-pulse rounded-full bg-emerald-500" />
                  <span className="font-mono text-text-3">awaiting next trigger_</span>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Footer Guidance */}
        <p className="mt-8 sm:mt-10 text-center font-mono text-[10px] sm:text-[11px] text-text-3 uppercase tracking-wider">
          Click any phase node to explore · Auto-cycles every 3.4s
        </p>

      </div>
    </section>
  )
}
