import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const FULL_NAME = 'AKREM BARBOURA';
const STORAGE_KEY = 'portfolio_intro_seen';
const COOKIE_NAME = 'portfolio_intro_seen';

/**
 * Checks whether the intro animation should play.
 * - In development mode: always plays on refresh so the developer can verify it immediately
 * - In production: plays once per session via sessionStorage
 * - Skips if `prefers-reduced-motion` is enabled (unless forced via ?intro=1)
 */
function shouldPlayIntro() {
  if (typeof window === 'undefined') return false;

  try {
    // Clean up any legacy blocking cookie
    document.cookie = `${COOKIE_NAME}=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT`;

    // 1. In development mode (localhost), always play so testing and refreshing works reliably
    if (import.meta.env.DEV) {
      return true;
    }

    const urlParams = new URLSearchParams(window.location.search);
    const forceIntro = urlParams.get('intro') === '1' || urlParams.get('replay') === '1';

    // 2. Accessibility: Skip animation if user prefers reduced motion (unless forced)
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion && !forceIntro) return false;

    if (forceIntro) return true;

    // 3. In production: Check session storage
    if (sessionStorage.getItem(STORAGE_KEY) === 'true') {
      return false;
    }

    return true;
  } catch {
    return true;
  }
}

/**
 * Marks the session as having seen the intro.
 */
function markIntroAsSeen() {
  try {
    if (!import.meta.env.DEV) {
      sessionStorage.setItem(STORAGE_KEY, 'true');
    }
  } catch {
    // Gracefully handle storage errors
  }
}

export default function PortfolioIntro() {
  const [shouldRender] = useState(() => shouldPlayIntro());
  const [displayedCount, setDisplayedCount] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const [isDone, setIsDone] = useState(false);

  // Body scroll lock while intro is active
  useEffect(() => {
    if (!shouldRender || isDone) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [shouldRender, isDone]);

  // Main animation sequence
  useEffect(() => {
    if (!shouldRender || isDone) return;

    let isCancelled = false;
    let typingTimer = null;
    let exitTimer = null;

    // Phase A: 200ms initial appearance before typing begins
    const startTimer = setTimeout(() => {
      let currentCount = 0;

      const typeNextChar = () => {
        if (isCancelled) return;
        currentCount += 1;
        setDisplayedCount(currentCount);

        if (currentCount < FULL_NAME.length) {
          // Phase B: Typewriter effect at 60ms interval
          typingTimer = setTimeout(typeNextChar, 60);
        } else {
          // Phase C: Short pause of 400ms after full name appears
          exitTimer = setTimeout(() => {
            if (!isCancelled) {
              markIntroAsSeen();
              setIsExiting(true);
            }
          }, 400);
        }
      };

      typingTimer = setTimeout(typeNextChar, 60);
    }, 200);

    return () => {
      isCancelled = true;
      clearTimeout(startTimer);
      clearTimeout(typingTimer);
      clearTimeout(exitTimer);
    };
  }, [shouldRender, isDone]);

  // If the intro was skipped or has finished, unmount completely
  if (!shouldRender || isDone) {
    return null;
  }

  const displayedText = FULL_NAME.slice(0, displayedCount);

  return (
    <>
      <style>{`
        @keyframes introCursorBlink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        .portfolio-intro-cursor {
          display: inline-block;
          width: 2px;
          height: 1.15em;
          background-color: #39D353;
          margin-left: 0.15em;
          vertical-align: middle;
          animation: introCursorBlink 0.8s ease-in-out infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .portfolio-intro-cursor {
            animation: none;
          }
        }
      `}</style>

      {/* Phase D: Full-viewport overlay with Motion fade-out transition */}
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: isExiting ? 0 : 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        onAnimationComplete={() => {
          if (isExiting) {
            setIsDone(true);
          }
        }}
        className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#080808] px-4 select-none overflow-hidden"
        style={{ pointerEvents: isExiting ? 'none' : 'auto' }}
        aria-hidden="true"
        role="presentation"
      >
        <div
          className="font-sans font-medium text-[#FFFFFF] select-none text-center"
          style={{
            fontSize: 'clamp(1.15rem, 4.5vw, 2.5rem)',
            letterSpacing: '0.18em',
          }}
        >
          <span className="inline-flex items-center justify-center whitespace-nowrap leading-none">
            <span>{displayedText}</span>
            <span className="portfolio-intro-cursor" aria-hidden="true" />
          </span>
        </div>
      </motion.div>
    </>
  );
}
