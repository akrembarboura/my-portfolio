import { useEffect, useState } from 'react'

export default function SystemReveal({ onComplete }) {
  const [phase, setPhase] = useState(0)
  // Handle reduced motion preference gracefully from the start
  const [shouldRender, setShouldRender] = useState(() => {
    if (typeof window !== 'undefined') {
      return !window.matchMedia('(prefers-reduced-motion: reduce)').matches
    }
    return true
  })

  useEffect(() => {
    // 1. Accessibility Check
    if (!shouldRender) {
      onComplete()
      return
    }
    
    // Prevent scrolling during animation
    document.body.style.overflow = 'hidden'

    // 2. Sequence Timers
    // Phase 0: 0-250ms (Initial text fade in - CSS handles 0ms delay)
    
    // Phase 1: 250ms (Line expands)
    const t1 = setTimeout(() => setPhase(1), 250)
    
    // Phase 2: 650ms (Identity transforms to layout positions)
    const t2 = setTimeout(() => setPhase(2), 650)
    
    // Phase 3: 1000ms (Background fades out, revealing interface)
    const t3 = setTimeout(() => setPhase(3), 1000)
    
    // Phase 4: 1800ms (Unmount overlay, restore scrolling)
    const t4 = setTimeout(() => {
      setShouldRender(false)
      document.body.style.overflow = ''
      onComplete()
    }, 1800)

    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
      clearTimeout(t4)
      document.body.style.overflow = ''
    }
  }, [onComplete, shouldRender])

  if (!shouldRender) return null

  return (
    <div 
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center pointer-events-none transition-colors duration-700 ease-in-out ${
        phase >= 3 ? 'bg-transparent' : 'bg-background-0'
      }`}
    >
      {/* Container to center everything */}
      <div className="relative flex flex-col items-center">
        
        {/* Name -> Navbar Logo */}
        <div 
          className={`font-sans font-bold tracking-tight text-text-1 transition-all duration-700 ease-[cubic-bezier(0.2,0.8,0.2,1)] ${
            phase === 0 ? 'opacity-0 scale-95 translate-y-2' : 
            phase === 1 ? 'opacity-100 scale-100 translate-y-0 text-[1.5rem]' :
            'opacity-0 translate-x-[calc(-50vw+max(32px,(100vw-1200px)/2+32px)+30px)] translate-y-[calc(-50vh+35px+10px)] scale-75'
          }`}
          style={{ willChange: 'transform, opacity' }}
        >
          AKREM BARBOURA
        </div>

        {/* The Structural Line */}
        <div 
          className={`h-[1px] bg-border-strong my-4 transition-all duration-700 ease-out ${
            phase >= 1 ? 'w-[140vw] max-w-[2000px] opacity-100' : 'w-0 opacity-0'
          }`}
          style={{ willChange: 'width, opacity' }}
        />

        {/* Role -> Hero Text */}
        <div 
          className={`font-mono text-[0.85rem] font-semibold tracking-widest text-text-2 uppercase transition-all duration-700 ease-[cubic-bezier(0.2,0.8,0.2,1)] ${
            phase === 0 ? 'opacity-0 scale-95 -translate-y-2' :
            phase === 1 ? 'opacity-100 scale-100 translate-y-0' :
            'opacity-0 translate-x-[calc(-50vw+max(32px,(100vw-1200px)/2+32px)+100px)] translate-y-[calc(-20vh)] scale-110'
          }`}
          style={{ willChange: 'transform, opacity' }}
        >
          Full-Stack Developer
        </div>
      </div>
    </div>
  )
}
