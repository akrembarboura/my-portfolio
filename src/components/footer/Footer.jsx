import { useCallback } from 'react'
import { ArrowUp } from 'lucide-react'
import { FaGithub, FaLinkedin, FaEnvelope, FaFileAlt, FaPaperPlane } from 'react-icons/fa'
import './Footer.css'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  const handleBackToTop = useCallback(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }, [])

  return (
    <footer id="footer" className="footer-container" aria-label="Footer">
      {/* Top Divider Line — Crisp & Visible framing line */}
      <div className="footer-top-line" aria-hidden="true" />

      <div className="footer-inner-wrap">
        {/* Main Row: Identity & Pill Buttons */}
        <div className="footer-main-row">
          {/* Left: Brand Identity & Live Status */}
          <div className="footer-brand">
            <a href="#about" className="footer-brand-link">
              <img
                src="/akrempicture.webp"
                alt="Akrem Barboura"
                className="footer-brand-avatar"
              />
              <span className="footer-brand-name">
                Akrem Barboura
              </span>
            </a>
            <span className="footer-status-pill">
              <span className="footer-status-dot" aria-hidden="true" />
              <span>Available for opportunities</span>
            </span>
          </div>

          {/* Right: Big, Highly Visible Pill Buttons */}
          <nav aria-label="Social and action links" className="footer-pills-row">
            <a
              href="https://github.com/akrembarboura"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-pill-btn group"
              aria-label="GitHub profile"
            >
              <FaGithub className="footer-pill-icon" />
              <span>GitHub</span>
            </a>

            <a
              href="https://linkedin.com/in/akrembarboura"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-pill-btn group"
              aria-label="LinkedIn profile"
            >
              <FaLinkedin className="footer-pill-icon" />
              <span>LinkedIn</span>
            </a>

            <a
              href="mailto:akrembarboura316@gmail.com"
              className="footer-pill-btn group"
              aria-label="Send direct email"
            >
              <FaEnvelope className="footer-pill-icon" />
              <span>Email</span>
            </a>

            <a
              href="/cv-akrem-barboura.pdf"
              download="Akrem-Barboura-CV.pdf"
              className="footer-pill-btn group"
              aria-label="Download CV Resume"
            >
              <FaFileAlt className="footer-pill-icon" />
              <span>Resume</span>
            </a>

            <a
              href="#contact"
              className="footer-pill-btn group"
              aria-label="Navigate to contact form"
            >
              <FaPaperPlane className="footer-pill-icon" />
              <span>Contact</span>
            </a>

            <button
              type="button"
              onClick={handleBackToTop}
              className="footer-pill-btn group cursor-pointer"
              aria-label="Scroll back to top"
            >
              <ArrowUp className="w-4 h-4 text-accent transition-transform duration-200 group-hover:-translate-y-0.5" />
              <span>Top</span>
            </button>
          </nav>
        </div>

        {/* Bottom Row: Clear & Readable Metadata */}
        <div className="footer-bottom-row">
          <div className="footer-copyright">
            &copy; {currentYear} AKREM BARBOURA. ALL RIGHTS RESERVED.
          </div>
          <div className="footer-discipline">
            FULL-STACK DEVELOPER · REACT · NEXT.JS · TYPESCRIPT · NODE.JS · CLOUD
          </div>
        </div>
      </div>
    </footer>
  )
}
