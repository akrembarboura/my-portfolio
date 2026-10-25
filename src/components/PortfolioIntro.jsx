import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { CircuitCanvas } from './CircuitBackground'

const FULL_NAME = 'AKREM BARBOURA'
const STORAGE_KEY = 'portfolio_intro_seen'

// Total intro duration = 350ms + (14 chars * 105ms = 1470ms) + 630ms + 550ms = 3000ms (3.0s)
const INITIAL_DELAY_MS = 350
const TYPING_INTERVAL_MS = 105
const HOLD_AFTER_TYPING_MS = 630
const EXIT_DURATION_S = 0.55

/**
 * Plays once per browser session (or when forced via ?intro=1 / ?replay=1).
 * Skips automatically if `prefers-reduced-motion: reduce` is enabled.
 */
function shouldPlayIntro() {
  if (typeof window === 'undefined') return false

  try {
    const urlParams = new URLSearchParams(window.location.search)
    const forceIntro = urlParams.get('intro') === '1' || urlParams.get('replay') === '1'
    if (forceIntro) return true

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return false

    return sessionStorage.getItem(STORAGE_KEY) !== 'true'
  } catch {
    return true
  }
}

function markIntroAsSeen() {
  try {
    sessionStorage.setItem(STORAGE_KEY, 'true')
  } catch {
    // Ignore storage quota / privacy mode errors
  }
}

export default function PortfolioIntro() {
  const [shouldRender] = useState(() => shouldPlayIntro())
  const [displayedCount, setDisplayedCount] = useState(0)
  const [isExiting, setIsExiting] = useState(false)
  const [isDone, setIsDone] = useState(false)

  // Lock body scroll while intro is active
  useEffect(() => {
    if (!shouldRender || isDone) return undefined

    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = originalOverflow
    }
  }, [shouldRender, isDone])

  // 3-second choreographed sequence
  useEffect(() => {
    if (!shouldRender || isDone) return undefined

    let isCancelled = false
    let typingTimer = null
    let exitTimer = null

    const startTimer = setTimeout(() => {
      let currentCount = 0

      const typeNextChar = () => {
        if (isCancelled) return
        currentCount += 1
        setDisplayedCount(currentCount)

        if (currentCount < FULL_NAME.length) {
          typingTimer = setTimeout(typeNextChar, TYPING_INTERVAL_MS)
        } else {
          exitTimer = setTimeout(() => {
            if (!isCancelled) {
              markIntroAsSeen()
              setIsExiting(true)
            }
          }, HOLD_AFTER_TYPING_MS)
        }
      }

      typeNextChar()
    }, INITIAL_DELAY_MS)

    return () => {
      isCancelled = true
      clearTimeout(startTimer)
      clearTimeout(typingTimer)
      clearTimeout(exitTimer)
    }
  }, [shouldRender, isDone])

  if (!shouldRender || isDone) {
    return null
  }

  const displayedText = FULL_NAME.slice(0, displayedCount)
  const progressRatio = displayedCount / FULL_NAME.length
  const isComplete = displayedCount === FULL_NAME.length

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{
        opacity: isExiting ? 0 : 1,
        scale: isExiting ? 1.015 : 1,
      }}
      transition={{ duration: EXIT_DURATION_S, ease: [0.22, 1, 0.36, 1] }}
      onAnimationComplete={() => {
        if (isExiting) {
          setIsDone(true)
        }
      }}
      className="portfolio-intro-overlay fixed inset-0 z-[9999] flex flex-col items-center justify-center px-6 select-none overflow-hidden"
      style={{ pointerEvents: isExiting ? 'none' : 'auto' }}
      aria-hidden="true"
      role="presentation"
    >
      {/* Shared Animated Circuit Canvas */}
      <CircuitCanvas animated />

      {/* Center Nameplate & Synchronized PCB Bus */}
      <div className="relative z-10 flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 0.75, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="font-mono text-[10px] sm:text-xs uppercase tracking-[0.28em]"
          style={{ color: 'var(--text-3, #A6A5A3)', marginBottom: '1.1rem' }}
        >
          {isComplete ? '// SYSTEM READY' : '// INITIALIZING NODE'}
        </motion.div>

        <div
          className="font-sans font-bold select-none text-center"
          style={{
            fontSize: 'clamp(1.35rem, 4.6vw, 2.75rem)',
            letterSpacing: '0.2em',
            color: 'var(--text-1, #FCFAF8)',
          }}
        >
          <span className="inline-flex items-center justify-center whitespace-nowrap leading-none">
            <span>{displayedText}</span>
            <span className="portfolio-intro-cursor" aria-hidden="true" />
          </span>
        </div>

        {/* Stepped PCB Progress Bus with Concentric Via Terminals */}
        <div
          className="w-full"
          style={{
            width: 'clamp(220px, 46vw, 440px)',
            marginTop: '1.25rem',
          }}
        >
          <svg viewBox="0 0 440 28" className="w-full h-7 overflow-visible" fill="none">
            <path
              d="M 14 14 L 90 14 L 102 22 L 338 22 L 350 14 L 426 14"
              stroke="var(--border-strong, rgba(252,250,248,0.18))"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <motion.path
              d="M 14 14 L 90 14 L 102 22 L 338 22 L 350 14 L 426 14"
              stroke="var(--accent, #C85A3C)"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: progressRatio }}
              transition={{ duration: 0.09, ease: 'linear' }}
            />
            <circle
              cx="14"
              cy="14"
              r="6.5"
              stroke="var(--accent, #C85A3C)"
              strokeWidth="2"
              fill="var(--bg-0, #1A1A19)"
            />
            <circle cx="14" cy="14" r="2.8" fill="var(--accent, #C85A3C)" />

            <circle
              cx="426"
              cy="14"
              r="6.5"
              stroke={isComplete ? 'var(--accent, #C85A3C)' : 'var(--border-strong, rgba(252,250,248,0.22))'}
              strokeWidth="2"
              fill="var(--bg-0, #1A1A19)"
            />
            <circle
              cx="426"
              cy="14"
              r="2.8"
              fill={isComplete ? 'var(--accent, #C85A3C)' : 'var(--border-strong, rgba(252,250,248,0.22))'}
            />
          </svg>
        </div>
      </div>
    </motion.div>
  )
}
