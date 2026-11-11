import { useState, useEffect } from 'react'
import useScrollReveal from '../hooks/useScrollReveal'
import imageAkrem from '../assets/akrempicture.png'
import HeroAvatar from './HeroAvatar'
import useTypewriter from '../hooks/useTypewriter'
import typewriterPhrases from '../data/typewriter'
import { Copy, Check, Download } from 'lucide-react'

export default function About() {
  const imageRef = useScrollReveal()
  const textRef = useScrollReveal()
  const [avatarSize, setAvatarSize] = useState(440)
  const [copied, setCopied] = useState(false)
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

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('akrembarboura316@gmail.com')
    setCopied(true)
    setTimeout(() => setCopied(false), 2200)
  }

  return (
    <section id="about">
      <div className="container">
        <div className="about-grid">

          {/* ── Text Column ── */}
          <div className="about-text reveal-left" ref={textRef}>
            <div className="flex flex-wrap items-center gap-3 mb-3">
              <p className="section-label !mb-0">About Me</p>
              
              {/* Recruiter / Remote Work Availability Indicator */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-[11px] font-mono text-neutral-300">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#39D353] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#39D353]" />
                </span>
                <span>Open to Remote · UTC+1 (CET) · 4+ hrs US Overlap</span>
              </div>
            </div>

            <h2 className="section-title">
              A developer who builds&nbsp;
              <span className="text-accent italic font-serif">
                end&#8209;to&#8209;end
              </span>
            </h2>

            <p className="about-role-line text-[clamp(1rem,1.2vw,1.25rem)] text-text-2 min-h-[2em] font-mono">
              {'>'} I'm a <span className="text-text-1 font-semibold">{typedText}</span>
              <span className="inline-block w-[6px] h-[1em] bg-accent ml-[4px] align-text-bottom animate-pulse" />
            </p>

            <p className="about-desc">
              I specialize in <strong>React 19</strong>, <strong>Next.js 15</strong>, <strong>TypeScript</strong>, <strong>Node.js</strong>, and
              PostgreSQL / Supabase — building production systems that connect clean interfaces to well-structured, scalable architectures.
              I work with high autonomy and deep async communication.
            </p>

            {/* Action buttons — clear primary / secondary hierarchy */}
            <div className="about-actions flex flex-wrap items-center gap-3">
              <a href="#projects" className="btn btn-primary">
                View Projects ↗
              </a>
              <button
                type="button"
                onClick={handleDownloadCV}
                className="btn btn-secondary inline-flex items-center gap-1.5"
                aria-label="Download CV"
              >
                <Download size={15} />
                <span>Download CV</span>
              </button>
              <button
                type="button"
                onClick={handleCopyEmail}
                className="btn btn-secondary inline-flex items-center gap-1.5 font-mono text-xs"
                title="Copy email to clipboard"
              >
                {copied ? (
                  <>
                    <Check size={14} className="text-[#39D353]" />
                    <span className="text-[#39D353]">Email Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy size={14} />
                    <span>Copy Email</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* ── Image Column: HeroAvatar with circuit halo ── */}
          <div
            ref={imageRef}
            className="reveal-right"
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
