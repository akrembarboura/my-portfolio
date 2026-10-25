import { useEffect, useState } from 'react'

export default function HeroAvatar({ src, alt = 'Profile photo', size = 400 }) {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const finalSize = isMobile ? Math.min(size, window.innerWidth - 64) : size

  return (
    <div
      className="hero-avatar-frame relative flex items-center justify-center"
      style={{ width: finalSize }}
    >
      {/* Subtle architectural circuit halo behind portrait */}
      <svg
        viewBox="0 0 400 400"
        aria-hidden="true"
        className="hero-avatar-halo"
      >
        {/* Outer dashed telemetry ring */}
        <circle
          cx="200"
          cy="200"
          r="182"
          fill="none"
          stroke="var(--border-strong)"
          strokeWidth="1"
          strokeDasharray="6 10"
          className="hero-avatar-ring-spin"
        />
        {/* Inner structural ring */}
        <circle
          cx="200"
          cy="200"
          r="156"
          fill="none"
          stroke="var(--border)"
          strokeWidth="1.2"
        />
        {/* Top & Bottom Circuit Via Nodes */}
        <g stroke="var(--accent)" strokeWidth="1.5">
          <circle cx="200" cy="18" r="6" fill="var(--bg-0)" />
          <circle cx="200" cy="18" r="2.2" fill="var(--accent)" stroke="none" />
          <circle cx="382" cy="200" r="6" fill="var(--bg-0)" />
          <circle cx="382" cy="200" r="2.2" fill="var(--accent)" stroke="none" />
          <circle cx="18" cy="200" r="6" fill="var(--bg-0)" />
          <circle cx="18" cy="200" r="2.2" fill="var(--accent)" stroke="none" />
        </g>
      </svg>

      <img
        src={src}
        alt={alt}
        className="hero-avatar-img w-full h-auto object-contain select-none pointer-events-none drop-shadow-xl"
      />
    </div>
  )
}
