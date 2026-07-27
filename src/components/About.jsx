import useScrollReveal from '../hooks/useScrollReveal'
import imageAkrem from '../assets/akrempicture.png'
import { Link } from 'react-router-dom'
import HeroAvatar from './HeroAvatar'

export default function About() {
  const imageRef = useScrollReveal()
  const textRef = useScrollReveal()

  const handleDownloadCV = () => {
    const link = document.createElement('a')
    link.href = '/cv-akrem-barboura.pdf'
    link.download = 'Akrem-Barboura-CV.pdf'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <section id="about">
      <div className="container">
        <div className="about-grid">

          {/* ── Text Column ── */}
          <div className="about-text reveal-right" ref={textRef}>
            <p className="section-label">About Me</p>

            {/* ── "Available" badge ── */}
            <div className="rounded-full bg-slate-800/50 border border-slate-700 w-fit mb-4 px-3 py-1 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-sm text-slate-300">Available for opportunities</span>
            </div>

            <h2 className="section-title">
              Hi, I'm&nbsp;
              <span style={{
                background: 'linear-gradient(135deg,var(--accent),var(--accent-2))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>
                Akrem Barboura
              </span>
              &nbsp;
            </h2>

            <p className="about-desc" style={{ fontSize: '1.0625rem', fontWeight: 500, color: 'var(--text-1)', marginBottom: '0.5rem' }}>
              Junior Full-Stack Developer building modern, scalable web applications.
            </p>

            <p className="about-desc">
              I specialize in <strong>React</strong>, <strong>TypeScript</strong>, <strong>Node.js</strong>, and
              modern backend technologies. I transform ideas into <em>responsive</em>, <em>performant</em>, and
              production-ready applications.
            </p>

            <p className="about-desc">
              Based in Tunisia&nbsp;🇹🇳, I care deeply about crafting elegant UIs backed by clean, scalable APIs.
              Whether it's architecting REST services, optimizing database queries, or building pixel-perfect interfaces —
              I deliver end-to-end.
            </p>

            <p className="about-desc" style={{
              background: 'var(--tag-bg)',
              border: '1px solid var(--border-strong)',
              borderRadius: '10px',
              padding: '0.75rem 1rem',
              color: 'var(--accent)',
              fontWeight: 500,
            }}>
              🚀 Currently looking for opportunities to grow as a Full-Stack Developer.
            </p>

            {/* Action buttons */}
            <div className="about-actions">
              <Link to="/projects" className="btn btn-primary">
                View Projects ↗
              </Link>
              <Link to="/contact" className="btn btn-secondary">
                Contact Me
              </Link>
              <button
                onClick={handleDownloadCV}
                className="btn btn-secondary"
                style={{ cursor: 'pointer' }}
                aria-label="Download CV"
              >
                Download CV ↓
              </button>
            </div>
          </div>

          {/* ── Image Column: HeroAvatar with orbital icons ── */}
          <div
            ref={imageRef}
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <HeroAvatar
              src={imageAkrem}
              alt="Akrem Barboura — Full-Stack Developer"
              size={440}
            />
          </div>

        </div>
      </div>
    </section>
  )
}
