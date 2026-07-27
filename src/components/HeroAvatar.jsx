/**
 * HeroAvatar — Circular profile image with radial-orbiting social/action icon badges.
 *
 * Icons are positioned along a right-side arc using trigonometry so they
 * follow the circle edge precisely at any size.
 *
 * Props:
 *  - src       {string}  Image source URL
 *  - alt       {string}  Alt text for the image
 *  - size      {number}  Container size in px (default 320)
 */

import { useState } from 'react'

// ── SVG Icons ──────────────────────────────────────────────────────────────
const GitHubIcon = () => (
    <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2Z" />
    </svg>
)

const LinkedInIcon = () => (
    <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
)

const TwitterIcon = () => (
    <svg width="17" height="17" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
)

const MailIcon = () => (
    <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="m2 7 10 7 10-7" />
    </svg>
)

const DownloadIcon = () => (
    <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 5v14m0 0-5-5m5 5 5-5" />
        <path d="M3 19h18" />
    </svg>
)

const CodeIcon = () => (
    <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
    </svg>
)

// ── Orbit config ────────────────────────────────────────────────────────────
// angleDeg: degrees along the circle. 0° = right, -90° = top, 90° = bottom.
// The arc spans from roughly -70° to +70° (right-side bow).
const ORBIT_ITEMS = [
    { angleDeg: -75, label: 'GitHub', href: 'https://github.com/akrembarboura', icon: <GitHubIcon />, color: '#6e7681' },
    { angleDeg: -40, label: 'LinkedIn', href: 'https://linkedin.com/in/akrem-barboura', icon: <LinkedInIcon />, color: '#0a66c2' },
    { angleDeg: -8, label: 'Twitter', href: 'https://twitter.com/', icon: <TwitterIcon />, color: '#1d9bf0' },
    { angleDeg: 24, label: 'Email', href: 'mailto:akrembarboura@gmail.com', icon: <MailIcon />, color: '#ea4335' },
    { angleDeg: 55, label: 'Download CV', href: '/cv-akrem-barboura.pdf', download: true, icon: <DownloadIcon />, color: '#3b82f6' },
    { angleDeg: 82, label: 'Portfolio', href: 'https://github.com/akrembarboura', icon: <CodeIcon />, color: '#8b5cf6' },
]

const BADGE_SIZE = 40   // px — width/height of each icon badge
const ORBIT_EXTRA = 52  // px extra radius past the circle edge

// ── Component ───────────────────────────────────────────────────────────────
export default function HeroAvatar({ src, alt = 'Profile photo', size = 300 }) {
    const [hovered, setHovered] = useState(null)
    const radius = size / 2 + ORBIT_EXTRA
    const half = size / 2

    return (
        // Outer wrapper gives space for the badges that extend beyond the circle
        <div
            style={{
                position: 'relative',
                width: size + ORBIT_EXTRA * 2,
                height: size + ORBIT_EXTRA * 2,
                flexShrink: 0,
            }}
            aria-label="Profile with social links"
        >
            {/* ── Spinning gradient ring ── */}
            <div
                style={{
                    position: 'absolute',
                    top: ORBIT_EXTRA - 20,
                    left: ORBIT_EXTRA - 20,
                    width: size + 40,
                    height: size + 40,
                    borderRadius: '50%',
                    background: 'conic-gradient(from 0deg, var(--accent), var(--accent-2), var(--accent-3), var(--accent))',
                    opacity: 0.35,
                    animation: 'spin 8s linear infinite',
                }}
            />

            {/* ── Subtle static border ring ── */}
            <div
                style={{
                    position: 'absolute',
                    top: ORBIT_EXTRA - 12,
                    left: ORBIT_EXTRA - 12,
                    width: size + 24,
                    height: size + 24,
                    borderRadius: '50%',
                    border: '1px solid var(--border)',
                }}
            />

            {/* ── The actual profile image ── */}
            <div
                style={{
                    position: 'absolute',
                    top: ORBIT_EXTRA + 6,
                    left: ORBIT_EXTRA + 6,
                    width: size - 12,
                    height: size - 12,
                    borderRadius: '50%',
                    overflow: 'hidden',
                    border: '3px solid var(--bg-0)',
                    zIndex: 1,
                }}
            >
                <img
                    src={src}
                    alt={alt}
                    width={size}
                    height={size}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }}
                />
            </div>

            {/* ── "Based in Tunisia" floating badge ── */}
            <div
                style={{
                    position: 'absolute',
                    top: ORBIT_EXTRA + size - 36,
                    left: ORBIT_EXTRA - 28,
                    zIndex: 3,
                }}
                className="backdrop-blur-md bg-slate-900/80 border border-slate-700 text-slate-200 text-sm rounded-full px-3 py-1.5 flex items-center gap-3 shadow-lg whitespace-nowrap"
            >   <span><span className="font-bold">Based in Tunisia</span> TN</span>
            </div>

            {/* ── Orbital icon badges ── */}
            {ORBIT_ITEMS.map(({ angleDeg, label, href, download, icon, color }, i) => {
                const rad = (angleDeg * Math.PI) / 180
                // Centre of orbit origin = centre of the container
                const cx = ORBIT_EXTRA + half + Math.cos(rad) * radius - BADGE_SIZE / 2
                const cy = ORBIT_EXTRA + half + Math.sin(rad) * radius - BADGE_SIZE / 2
                const isHov = hovered === i

                return (
                    <a
                        key={label}
                        href={href}
                        {...(download ? { download: true } : { target: '_blank', rel: 'noopener noreferrer' })}
                        aria-label={label}
                        title={label}
                        onMouseEnter={() => setHovered(i)}
                        onMouseLeave={() => setHovered(null)}
                        style={{
                            position: 'absolute',
                            left: cx,
                            top: cy,
                            width: BADGE_SIZE,
                            height: BADGE_SIZE,
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: 'var(--bg-1)',
                            border: `1.5px solid ${isHov ? color : 'var(--border-strong)'}`,
                            color: isHov ? color : 'var(--text-2)',
                            boxShadow: isHov ? `0 0 16px ${color}55` : '0 4px 16px rgba(0,0,0,0.25)',
                            transform: isHov ? 'scale(1.2)' : 'scale(1)',
                            transition: 'transform 0.2s ease, border-color 0.2s ease, color 0.2s ease, box-shadow 0.2s ease',
                            backdropFilter: 'blur(12px)',
                            WebkitBackdropFilter: 'blur(12px)',
                            zIndex: 2,
                            cursor: 'pointer',
                            textDecoration: 'none',
                        }}
                    >
                        {icon}
                    </a>
                )
            })}
        </div>
    )
}
