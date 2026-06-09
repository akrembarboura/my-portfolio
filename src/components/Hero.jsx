import useTypewriter from '../hooks/useTypewriter'
import useStatCounter from '../hooks/useStatCounter'
import typewriterPhrases from '../data/typewriter'
import Button from './Button'
import imageAkrem from '../assets/ChatGPT Image Aug 8, 2025, 06_18_27 PM.png'
const HERO_IMAGE = imageAkrem

export default function Hero() {
  const typedText = useTypewriter(typewriterPhrases)
  const [projectsRef, projectsCount] = useStatCounter(5)
  const [yearsRef, yearsCount] = useStatCounter(2)
  const [techRef, techCount] = useStatCounter(9)

  return (
    <section id="hero" className="hero">
      <div className="hero-bg" />
      <div className="hero-grid" />

      <div className="container">
        <div className="hero-content">
          <div className="hero-left">
            <div className="hero-badge">
              <span className="dot" />
              Available for opportunities
            </div>
            <p className="hero-greeting">// Hello World </p>
            <h1 className="hero-name">Akrem<br />Barboura</h1>
            <p className="hero-role">
              I'm a <span className="typewriter">{typedText}</span>
              <span className="cursor-blink" />
            </p>
            <p className="hero-desc">
              Crafting performant, scalable full-stack web applications with clean architecture.
              Passionate about building products that make an impact — from pixel-perfect UIs to robust APIs.
            </p>
            <div className="hero-buttons">
              <Button variant="primary" href="#projects">View Projects ↓</Button>
              <Button variant="secondary" href="#contact">Contact Me 💬</Button>
            </div>
            <div className="hero-stats">
              <div className="stat-item" ref={projectsRef}>
                <span className="stat-number">{projectsCount}+</span>
                <span className="stat-label">Projects Built</span>
              </div>
              <div className="stat-item" ref={yearsRef}>
                <span className="stat-number">{yearsCount}+</span>
                <span className="stat-label">Years Experience</span>
              </div>
              <div className="stat-item" ref={techRef}>
                <span className="stat-number">{techCount}+</span>
                <span className="stat-label">Technologies</span>
              </div>
            </div>
          </div>

          <div className="hero-right">
            <div className="hero-image-wrap">
              <div className="hero-image-ring" />
              <div className="hero-image-ring-2" />
              <div className="hero-image-inner">
                <img src={HERO_IMAGE} alt="Akrem Barboura" />
              </div>
              <div className="floating-badge floating-badge-1">
                <span className="emoji">🇹🇳</span> Based in <strong>Tunisia</strong>
              </div>
              <div className="floating-badge floating-badge-2">
                <span className="emoji">💻</span> MERN Stack
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="hero-scroll">
        SCROLL
        <div className="scroll-line" />
      </div>
    </section>
  )
}
