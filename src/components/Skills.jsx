import { useState, useEffect, useRef } from 'react'
import useScrollReveal from '../hooks/useScrollReveal'
import SkillBar from './SkillBar'
import skills from '../data/skills'

export default function Skills() {
  const [animated, setAnimated] = useState(false)
  const sectionRef = useRef(null)

  // Trigger skill bar animations once the section is visible
  useEffect(() => {
    const el = sectionRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setAnimated(true)
          observer.unobserve(el)
        }
      },
      { threshold: 0.15 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const headerRef = useScrollReveal()

  return (
    <section id="skills" className="skills-section" ref={sectionRef}>
      <div className="container">
        <div ref={headerRef}>
          <p className="section-label">Technical Skills</p>
          <h2 className="section-title">My Tech Stack</h2>
          <p className="section-sub">
            Technologies and tools I use to build scalable, modern web applications
            from frontend to backend.
          </p>
        </div>

        <div className="skills-categories">
          {skills.map((cat) => (
            <SkillCategory
              key={cat.category}
              category={cat}
              animated={animated}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

function SkillCategory({ category, animated }) {
  const ref = useScrollReveal()

  return (
    <div className="skill-category" ref={ref}>
      <div className="skill-cat-header">
        <div className={`skill-cat-icon ${category.iconClass}`}>{category.icon}</div>
        <h3 className="skill-cat-name">{category.category}</h3>
      </div>
      <div className="skill-list">
        {category.items.map((skill) => (
          <SkillBar
            key={skill.name}
            icon={skill.icon}
            name={skill.name}
            level={skill.level}
            animated={animated}
          />
        ))}
      </div>
    </div>
  )
}
