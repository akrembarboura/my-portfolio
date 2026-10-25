import useScrollReveal from '../hooks/useScrollReveal'
import SkillBar from './SkillBar'
import skills from '../data/skills.jsx'
import './Skills.css'

export default function Skills() {
  const headerRef = useScrollReveal()

  return (
    <section
      id="skills"
      className="stack-section w-full"
      aria-labelledby="skills-heading"
    >
      <div className="container">
        <header ref={headerRef} className="stack-header">
          <p className="section-label">Technical Stack</p>
          <h2 id="skills-heading" className="section-title">
            Core Technologies
          </h2>
          <p className="section-sub">
            The core languages, frameworks, and tools I use to design, build, and deploy full-stack web applications.
          </p>
        </header>

        <div className="stack-groups">
          {skills.map((group) => (
            <SkillCategory key={group.category} group={group} />
          ))}
        </div>
      </div>
    </section>
  )
}

function SkillCategory({ group }) {
  const ref = useScrollReveal()
  const headingId = `stack-group-${group.id}`

  return (
    <div ref={ref} className="stack-group" role="group" aria-labelledby={headingId}>
      <div className="stack-group-meta">
        <div className="stack-group-heading">
          {group.id && (
            <span className="stack-group-index" aria-hidden="true">
              {group.id}
            </span>
          )}
          <h3 id={headingId} className="stack-group-title">
            {group.category}
          </h3>
        </div>
        {group.caption && (
          <p className="stack-group-caption">{group.caption}</p>
        )}
      </div>

      <ul className="stack-grid">
        {group.items.map((skill) => (
          <SkillBar
            key={skill.name}
            Icon={skill.Icon}
            icon={skill.icon}
            name={skill.name}
            color={skill.color}
          />
        ))}
      </ul>
    </div>
  )
}
