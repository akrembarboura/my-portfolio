import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { MotionPathPlugin } from 'gsap/all'

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(MotionPathPlugin)
}

export default function SpiderEffect() {
  const containerRef = useRef(null)
  const spiderRef = useRef(null)
  const mainPathRef = useRef(null)
  const anchorPath1Ref = useRef(null)
  const anchorPath2Ref = useRef(null)
  
  // Calculate debug state synchronously during initialization to avoid setState in effect
  const [isDebug] = useState(() => {
    if (typeof window !== 'undefined') {
      return new URLSearchParams(window.location.search).get('spiderDebug') === '1'
    }
    return false
  })

  // Declare playAnimation before it is used
  const playAnimation = (ctx) => {
    ctx.add(() => {
      // The relative path the spider takes from its parent group origin (60,420)
      const relativePath = "M 0,0 Q 120,-40 280,-320"

      gsap.set(spiderRef.current, { opacity: 0 })

      // Small pause (Phase 1)
      const tl = gsap.timeline({ delay: 0.8 })

      // Phase 1: Spider subtly appears
      tl.to(spiderRef.current, {
        opacity: 0.9,
        duration: 0.5,
        ease: 'power1.inOut'
      })

      // Phase 2: Walking leg wiggle
      const legWiggle = gsap.to('.spider-leg', {
        rotation: "random(-20, 20)",
        transformOrigin: "center center",
        yoyo: true,
        repeat: -1,
        duration: 0.08,
        ease: 'sine.inOut',
        stagger: 0.015
      })

      // Phase 3 & 4: Diagonal movement & web following
      tl.to(
        spiderRef.current,
        {
          duration: 2.5,
          ease: 'power1.inOut',
          motionPath: {
            path: relativePath, // Animates relative to the outer <g> transform
            autoRotate: true
          },
          onComplete: () => legWiggle.kill()
        },
        '<'
      )

      // Main dragline draws
      tl.to(
        mainPathRef.current,
        {
          strokeDashoffset: 0,
          duration: 2.5,
          ease: 'power1.inOut'
        },
        '<'
      )

      // A few subtle anchor web lines progressively appear around the path
      tl.to(
        [anchorPath1Ref.current, anchorPath2Ref.current],
        {
          strokeDashoffset: 0,
          opacity: 0.2,
          duration: 1.5,
          stagger: 0.4,
          ease: 'power1.inOut'
        },
        '<0.5' // Start slightly after the main dragline
      )

      // Phase 5: Exit. Spider fades/shrinks.
      tl.to(spiderRef.current, {
        opacity: 0,
        scale: 0.6,
        duration: 0.5,
        ease: 'power1.inOut'
      })
    })
  }

  useEffect(() => {
    const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (isReducedMotion) return

    // Session storage rule: play only once per session (unless debugging)
    const hasPlayed = sessionStorage.getItem('spider-animation-played')
    if (hasPlayed && !isDebug) return

    const container = containerRef.current
    if (!container) return

    let ctx = gsap.context(() => {}, containerRef)

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            playAnimation(ctx)
            if (!isDebug) {
              sessionStorage.setItem('spider-animation-played', 'true')
            }
            observer.disconnect()
          }
        })
      },
      { threshold: 0.1 }
    )

    observer.observe(container)

    return () => {
      observer.disconnect()
      ctx.revert()
    }
  }, [isDebug])

  const spiderColor = "#0f0f0f"
  const spiderStroke = "rgba(255,255,255,0.25)"
  const webColor = "rgba(255,255,255,0.3)"

  return (
    <div 
      ref={containerRef}
      className={`absolute inset-0 pointer-events-none z-[20] ${isDebug ? 'border-2 border-red-500 bg-red-500/10' : ''}`}
      style={{ overflow: 'hidden' }}
    >
      <svg
        viewBox="0 0 400 500"
        preserveAspectRatio="none"
        className="w-full h-full"
      >
        {/* Main dragline web (Starts at 60,420, ends at 340,100) */}
        <path
          ref={mainPathRef}
          d="M 60,420 Q 180,380 340,100"
          fill="none"
          stroke={webColor}
          strokeWidth="1.2"
          style={{ strokeDasharray: 500, strokeDashoffset: 500 }}
        />
        
        {/* Anchor web lines to make it look like a structural web rather than just one line */}
        <path
          ref={anchorPath1Ref}
          d="M 180,380 L 100,280"
          fill="none"
          stroke={webColor}
          strokeWidth="0.8"
          style={{ strokeDasharray: 200, strokeDashoffset: 200, opacity: 0 }}
        />
        <path
          ref={anchorPath2Ref}
          d="M 260,250 L 360,300"
          fill="none"
          stroke={webColor}
          strokeWidth="0.8"
          style={{ strokeDasharray: 200, strokeDashoffset: 200, opacity: 0 }}
        />

        {/* Outer G isolates the physical placement so GSAP doesn't overwrite it! */}
        <g transform="translate(60, 420)">
          {/* Inner G is cleanly animated by GSAP from 0,0 relative to the parent */}
          <g ref={spiderRef}>
            {/* Spider Bounding Box for Debug Mode */}
            {isDebug && <rect x="-15" y="-15" width="30" height="30" fill="none" stroke="red" strokeWidth="1" />}

            {/* Spider Body */}
            <ellipse cx="-4" cy="0" rx="6" ry="4" fill={spiderColor} stroke={spiderStroke} strokeWidth="0.5" />
            <circle cx="3" cy="0" r="3.5" fill={spiderColor} stroke={spiderStroke} strokeWidth="0.5" />

            {/* Spider Legs */}
            <path className="spider-leg" d="M 3,0 Q 10,-8 14,-3" fill="none" stroke={spiderColor} strokeWidth="1.5" strokeLinecap="round" />
            <path className="spider-leg" d="M 1,0 Q 5,-12 10,-14" fill="none" stroke={spiderColor} strokeWidth="1.5" strokeLinecap="round" />
            <path className="spider-leg" d="M -1,0 Q -4,-12 -8,-14" fill="none" stroke={spiderColor} strokeWidth="1.5" strokeLinecap="round" />
            <path className="spider-leg" d="M -3,0 Q -12,-10 -15,-2" fill="none" stroke={spiderColor} strokeWidth="1.5" strokeLinecap="round" />

            <path className="spider-leg" d="M 3,0 Q 10,8 14,3" fill="none" stroke={spiderColor} strokeWidth="1.5" strokeLinecap="round" />
            <path className="spider-leg" d="M 1,0 Q 5,12 10,14" fill="none" stroke={spiderColor} strokeWidth="1.5" strokeLinecap="round" />
            <path className="spider-leg" d="M -1,0 Q -4,12 -8,14" fill="none" stroke={spiderColor} strokeWidth="1.5" strokeLinecap="round" />
            <path className="spider-leg" d="M -3,0 Q -12,10 -15,2" fill="none" stroke={spiderColor} strokeWidth="1.5" strokeLinecap="round" />
          </g>
        </g>

        {/* Debug Markers */}
        {isDebug && (
          <g>
            <path d="M 60,420 Q 180,380 340,100" fill="none" stroke="red" strokeWidth="1" strokeDasharray="4 4" />
            <circle cx="60" cy="420" r="5" fill="green" />
            <circle cx="340" cy="100" r="5" fill="blue" />
            <text x="70" y="440" fill="green" fontSize="12">Start (60, 420)</text>
            <text x="250" y="90" fill="blue" fontSize="12">End (340, 100)</text>
          </g>
        )}
      </svg>
    </div>
  )
}
