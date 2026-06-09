import useScrollReveal from '../hooks/useScrollReveal'
import Button from './Button'
import imageAkrem from '../assets/ChatGPT Image Aug 8, 2025, 06_18_27 PM.png'

const ABOUT_IMAGE = imageAkrem

const highlights = [
  'Full Stack Development',
  'RESTful API Design',
  'React & Next.js',
  'MongoDB & Mongoose',
  'JWT Authentication',
  'Docker & Deployment',
  'Git & Version Control',
]

export default function About() {
  const ref = useScrollReveal()

  return (
    <section id="about">
      <div className="container">
        <div className="about-grid">
          <div className="about-image-wrap" ref={ref}>
            <div className="about-img-deco-1" />
            <div className="about-img-frame">
              <img src={ABOUT_IMAGE} alt="Akrem Barboura working" />
            </div>
            <div className="about-img-badge">
              <span className="num">5+</span>
              <span className="lbl">Projects Shipped</span>
            </div>
          </div>

          <div className="about-text reveal-right">
            <p className="section-label">About Me</p>
            <h2 className="section-title">
              Passionate Builder,<br />react builder
            </h2>
            <p className="about-desc">
              I'm a Full Stack / MERN Stack Developer based in Tunisia 🇹🇳, with a deep
              passion for building modern web applications that are not only functional but
              also beautifully crafted. I specialize in the MongoDB, Express, React, Node.js
            </p>
            <p className="about-desc">
              I enjoy turning complex problems into elegant solutions. Whether it's
              architecting scalable REST APIs, building interactive UIs with React, or
              optimizing database queries — I care deeply about performance, code quality,
              and developer experience.
            </p>
            <p className="about-desc">
              When I'm not coding, you'll find me exploring new technologies, contributing
              to open source, or leveling up my skills through personal projects.
            </p>

            <div className="about-highlights">
              {highlights.map((item) => (
                <div key={item} className="highlight-item">
                  <span className="dot" />
                  {item}
                </div>
              ))}
            </div>

            <div className="about-actions">
              <Button variant="primary" href="#" onClick={() => alert('CV download coming soon!')}>
                Download CV ↓
              </Button>
              <Button variant="secondary" href="https://github.com/akrembarboura" target="_blank" rel="noopener noreferrer">
                GitHub Profile
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
