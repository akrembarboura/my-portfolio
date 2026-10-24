import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

// ============================================================================
// STAGE ICONS (RESPONSIVE SVG MARKS)
// ============================================================================

function IdeaMark({ className = 'w-5 h-5 sm:w-7 sm:h-7 md:w-9 md:h-9' }) {
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

function NextMark({ className = 'w-5 h-5 sm:w-7 sm:h-7 md:w-9 md:h-9' }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 32 32" className={`${className} fill-current`}>
      <circle cx="16" cy="16" r="14" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M10 9h3.4l7.1 10.2V9H24v14h-3.2l-7.3-10.4V23H10V9Z" />
    </svg>
  )
}

function ExpressMark({ className = 'w-9 h-4 sm:w-12 sm:h-6 md:w-14 md:h-7' }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 64 24" className={`${className} fill-current`}>
      <text x="0" y="18" fontFamily="Arial, sans-serif" fontSize="19" fontWeight="800" letterSpacing="-1">
        express
      </text>
    </svg>
  )
}

function VercelMark({ className = 'w-5 h-5 sm:w-7 sm:h-7 md:w-9 md:h-9' }) {
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
    shortLabel: 'Idea',
    label: 'Idea & Scope',
    stage: 'Concept & Architecture',
    eyebrow: 'PHASE 01 // PRODUCT DISCOVERY',
    title: 'Concept & System Scoping',
    headline: 'Transforming raw ideas and client requirements into concrete technical roadmaps.',
    description: 'Analyzing real client requirements, scoping user flows, defining feature scope, and architecting data models before writing code.',
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
    shortLabel: 'Express',
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
    shortLabel: 'Vercel',
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
      className="w-full py-12 sm:py-16 md:py-20"
      aria-labelledby="pipeline-title"
    >
      <div className="container max-w-[1240px] mx-auto px-4 sm:px-6 md:px-8 pr-7 sm:pr-8 md:pr-10">

        {/* ── 1. SECTION HEADER (MOBILE-FIRST TYPOGRAPHY & CLEAN SPACING) ── */}
        <div className="mb-6 sm:mb-8 md:mb-10">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <p className="section-label text-xs sm:text-sm font-mono tracking-wider text-accent font-semibold uppercase">
              // Execution Pipeline
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-background-1 border border-border-light text-text-2 font-mono text-[11px] sm:text-xs shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
              <span className="font-semibold text-text-1">PIPELINE ACTIVE</span>
            </div>
          </div>

          <h2 id="pipeline-title" className="section-title mt-2 text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight">
            From Concept to{' '}
            <span className="text-accent italic font-serif">
              Production
            </span>
          </h2>
          
          <p className="mt-2 text-sm sm:text-base text-text-2 max-w-[620px] leading-relaxed">
            How product vision transforms methodically through four specialized phases from project conception to global edge infrastructure.
          </p>
        </div>

        {/* ── 2. INTERACTIVE PIPELINE STAGE (ENCAPSULATED, ZERO OVERFLOW, PERFECT RAIL ALIGNMENT) ── */}
        <div className="relative w-full rounded-2xl bg-background-1/60 border border-border-light/80 p-4 sm:p-6 mb-6 sm:mb-8 backdrop-blur-sm">
          
          {/* Inner Stage Track Container */}
          <div className="relative w-full max-w-2xl mx-auto pt-7 pb-2 sm:pt-9 sm:pb-3">

            {/* Connecting Rail: Centered directly through the icon centers */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute left-[12.5%] right-[12.5%] top-[52px] sm:top-[64px] md:top-[72px] -translate-y-1/2 h-[3px] bg-border-strong rounded-full overflow-hidden"
            >
              <motion.div
                className="h-full bg-accent rounded-full"
                animate={{ width: `${(activeIndex / (phases.length - 1)) * 100}%` }}
                transition={{ type: 'spring', stiffness: 220, damping: 26 }}
              />
            </div>

            {/* The Soaring Jumping Ball (Scoped strictly within stage, responsive leap) */}
            <motion.div
              className="absolute top-[28px] sm:top-[38px] md:top-[44px] z-30 pointer-events-none -translate-x-1/2"
              animate={{
                left: `${12.5 + activeIndex * 25}%`
              }}
              transition={{
                type: 'spring',
                stiffness: 180,
                damping: 22
              }}
            >
              <motion.div
                key={activeIndex}
                initial={{ y: 0, scaleY: 1, scaleX: 1 }}
                animate={{
                  y: isMobile ? [0, -32, 0] : [0, -56, 0],
                  scaleY: [1, 1.4, 0.75, 1],
                  scaleX: [1, 0.72, 1.35, 1]
                }}
                transition={{
                  duration: 0.58,
                  times: [0, 0.46, 0.9, 1],
                  ease: ['easeOut', 'easeIn', 'easeOut']
                }}
                className="relative flex items-center justify-center"
              >
                {/* Energy Orb */}
                <div className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-full bg-accent border-2 border-white shadow-[0_0_16px_rgba(200,90,60,0.9)] flex items-center justify-center">
                  <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-white shadow-sm animate-pulse" />
                </div>

                {/* Ground Shadow */}
                <motion.div
                  key={`shadow-${activeIndex}`}
                  initial={{ scale: 1, opacity: 0.8 }}
                  animate={{
                    scale: [1, 0.2, 1.3, 1],
                    opacity: [0.8, 0.15, 0.9, 0.7]
                  }}
                  transition={{
                    duration: 0.58,
                    times: [0, 0.46, 0.9, 1]
                  }}
                  className="absolute -bottom-2.5 w-6 sm:w-7 h-1.5 rounded-full bg-accent/60 blur-[2px]"
                />
              </motion.div>
            </motion.div>

            {/* 4 Tool Nodes with Clean Mobile Hierarchy */}
            <div className="relative z-10 grid grid-cols-4 gap-1 sm:gap-3 items-start justify-items-center">
              {phases.map((phase, index) => {
                const isActive = index === activeIndex
                return (
                  <button
                    key={phase.id}
                    type="button"
                    onClick={() => setActiveIndex(index)}
                    className="group relative flex flex-col items-center focus:outline-none cursor-pointer p-1 text-center transition-transform w-full"
                  >
                    {/* Icon Base Circle */}
                    <div className="relative flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full">
                      
                      {/* Active Ripple Ring */}
                      {isActive && (
                        <motion.div
                          key={`impact-${activeIndex}`}
                          className="pointer-events-none absolute inset-0 rounded-full border-2 border-accent"
                          initial={{ scale: 0.5, opacity: 1 }}
                          animate={{ scale: isMobile ? 1.25 : 1.5, opacity: 0 }}
                          transition={{ duration: 0.6, ease: 'easeOut' }}
                        />
                      )}

                      {/* Active Glow Backdrop */}
                      {isActive && (
                        <motion.div
                          layoutId="active-stage-glow"
                          className="absolute inset-0 rounded-full bg-accent/25 blur-md sm:blur-lg pointer-events-none"
                          transition={{ type: 'spring', stiffness: 350, damping: 28 }}
                        />
                      )}

                      {/* Tool SVG Icon */}
                      <motion.div
                        key={`icon-${isActive}`}
                        animate={
                          isActive
                            ? { scale: isMobile ? [1, 1.2, 1.1] : [1, 1.3, 1.15], y: [0, 3, -1] }
                            : { scale: 0.85, y: 0 }
                        }
                        transition={{ duration: 0.45, delay: 0.4, ease: [0.175, 0.885, 0.32, 1.275] }}
                        className={`relative z-10 flex items-center justify-center drop-shadow transition-colors duration-200 ${
                          isActive ? 'text-text-1' : 'text-text-3 opacity-40'
                        }`}
                      >
                        <phase.Icon />
                      </motion.div>
                    </div>

                    {/* Stage Label (Short & crisp on mobile, expanded on desktop) */}
                    <div className="mt-2 flex flex-col items-center">
                      <span
                        className={`text-[11px] sm:text-xs md:text-sm font-semibold tracking-tight transition-colors duration-200 text-center ${
                          isActive ? 'text-text-1 font-bold' : 'text-text-3'
                        }`}
                      >
                        <span className="sm:hidden">{phase.shortLabel}</span>
                        <span className="hidden sm:inline">{phase.label}</span>
                      </span>
                      <span className="hidden md:block text-[10px] font-mono mt-0.5 text-text-3/60">
                        {phase.id}
                      </span>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* ── 3. CONTENT SHOWCASE (MOBILE-FIRST CARD ORDERING) ── */}
        <div className="grid gap-5 lg:gap-8 lg:grid-cols-[1.55fr_1fr] items-start">

          {/* A. ACTIVE PHASE EDITORIAL CARD */}
          <div className="relative rounded-2xl bg-background-1/90 border border-border-light p-5 sm:p-6 md:p-7 shadow-sm backdrop-blur-md">
            <AnimatePresence mode="wait">
              <motion.div
                key={active.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col justify-between"
              >
                <div>
                  {/* Phase Eyebrow & Status Header */}
                  <div className="flex items-center justify-between gap-2 pb-3 border-b border-border-light/60 flex-wrap">
                    <p className="font-mono text-xs uppercase tracking-wider text-accent font-semibold">
                      {active.eyebrow}
                    </p>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-background-2 border border-border-light text-[11px] font-mono text-text-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                      {active.metric}
                    </span>
                  </div>

                  {/* Title & Headline */}
                  <h3 className="mt-3 text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-text-1">
                    {active.title}
                  </h3>

                  <p className="mt-2 text-sm sm:text-base font-medium text-accent italic">
                    "{active.headline}"
                  </p>

                  <p className="mt-3 text-xs sm:text-sm md:text-base text-text-2 leading-relaxed">
                    {active.description}
                  </p>
                </div>

                {/* Capability Tag Badges */}
                <div className="mt-5 sm:mt-6 pt-4 border-t border-border-light/60 flex flex-wrap gap-2">
                  {active.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1 rounded-full bg-background-2/80 border border-border-light text-[11px] sm:text-xs font-mono font-medium text-text-2"
                    >
                      <span className="w-1 h-1 rounded-full bg-accent" />
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* B. VERCEL DEPLOYMENT FEED (CLEAN CLI TERMINAL) */}
          <div className="relative rounded-2xl border border-dashed border-border-strong bg-background-1/80 backdrop-blur-md p-4 sm:p-5 shadow-sm font-mono overflow-hidden">
            {/* Terminal Header */}
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
              <div className="pt-2 pb-2 flex items-center justify-between text-[10px] sm:text-[11px] font-mono text-text-3 border-b border-dashed border-border-light/60 flex-wrap gap-1 sm:gap-2">
                <span>env: <strong className="text-text-2 font-normal">production</strong></span>
                <span>branch: <strong className="text-text-2 font-normal">main</strong></span>
                <span>region: <strong className="text-text-2 font-normal">edge</strong></span>
              </div>
            </div>

            {/* Terminal Logs Body */}
            {showLogs && (
              <div className="mt-3 flex flex-col gap-1.5 font-mono text-[11px] sm:text-xs leading-relaxed overflow-hidden">
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
                      <span className="truncate text-[11px] sm:text-xs">
                        {log.raw}
                      </span>
                    </div>
                  )
                })}

                <div className="flex items-center gap-2 text-text-3 text-[10px] sm:text-[11px] mt-2 pt-2 border-t border-dashed border-border-light/60">
                  <span className="w-1.5 h-1.5 animate-pulse rounded-full bg-emerald-500" />
                  <span className="font-mono text-text-3">awaiting next trigger_</span>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* ── 4. FOOTER GUIDANCE HINT ── */}
        <p className="mt-6 sm:mt-8 text-center font-mono text-[10px] sm:text-[11px] text-text-3 uppercase tracking-wider">
          Tap any phase to explore · Auto-cycles every 3.4s
        </p>

      </div>
    </section>
  )
}
