import { useCallback, useRef } from 'react'
import Tag from './Tag'

// Project card with 3D tilt effect on hover
export default function ProjectCard({ num, icon, title, description, tags, github, demo }) {
  const cardRef = useRef(null)

  const handleMouseMove = useCallback((e) => {
    const card = cardRef.current
    if (!card) return
    const rect = card.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    card.style.transform = `perspective(800px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg) translateY(-5px)`
  }, [])

  const handleMouseLeave = useCallback(() => {
    const card = cardRef.current
    if (!card) return
    card.style.transform = ''
  }, [])

  return (
    <div
      ref={cardRef}
      className="project-card"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <span className="project-num">{num}</span>
      <div className="project-header">
        <div className="project-icon">{icon}</div>
        <div className="project-links">
          <a
            href={github}
            className="project-link"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="View source on GitHub"
          >
            &#60;/&#62;
          </a>
          <a
            href={demo}
            className="project-link"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Live demo"
          >
            &#8599;
          </a>
        </div>
      </div>
      <h3 className="project-title">{title}</h3>
      <p className="project-desc">{description}</p>
      <div className="project-tags">
        {tags.map((tag) => (
          <Tag key={tag}>{tag}</Tag>
        ))}
      </div>
    </div>
  )
}
