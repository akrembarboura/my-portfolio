import { useState, useEffect } from 'react'
import useScrollReveal from '../hooks/useScrollReveal'
import imageAkrem from '../assets/akrempicture.webp'
import HeroAvatar from './HeroAvatar'
import useTypewriter from '../hooks/useTypewriter'
import typewriterPhrases from '../data/typewriter'

export default function About() {
  const imageRef = useScrollReveal()
  const textRef = useScrollReveal()
  const [avatarSize, setAvatarSize] = useState(440)
  const typedText = useTypewriter(typewriterPhrases)

  useEffect(() => {
    const handleResize = () => {
      setAvatarSize(window.innerWidth < 768 ? 220 : 440)
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

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

            <h2 className="section-title">
              A developer who builds&nbsp;
              <span className="text-accent italic font-serif">
                end&#8209;to&#8209;end
              </span>
            </h2>

            <p className="text-[clamp(1rem,1.2vw,1.25rem)] text-text-2 mb-7 min-h-[2em] mt-4 font-mono">
              {'>'} I'm a <span className="text-text-1 font-semibold">{typedText}</span>
              <span className="inline-block w-[6px] h-[1em] bg-accent ml-[4px] align-text-bottom animate-pulse" />
            </p>

            <p className="about-desc">
              I specialize in <strong>React</strong>, <strong>Node.js</strong>, <strong>TypeScript</strong>, and
              MongoDB — writing code that connects clean user interfaces to well-structured APIs.
              I care about both sides of the stack equally.
            </p>

            

            {/* Action buttons — clear primary / secondary hierarchy */}
            <div className="about-actions">
              <a href="#projects" className="btn btn-primary">
                View Projects ↗
              </a>
              <a href="#contact" className="btn btn-secondary">
                Contact Me
              </a>
              <button
                type="button"
                onClick={handleDownloadCV}
                className="btn btn-secondary"
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
              size={avatarSize}
            />
          </div>

        </div>
      </div>
    </section>
  )
}
