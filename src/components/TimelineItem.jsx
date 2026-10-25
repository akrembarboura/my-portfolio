import useScrollReveal from '../hooks/useScrollReveal'
import Tag from './Tag'

// Single timeline entry (experience, education, or training)
export default function TimelineItem({ role, date, org, description, tags, index = 0 }) {
  const itemRef = useScrollReveal({ threshold: 0.15 })
  const staggerClass = index < 5 ? `stagger-${index + 1}` : ''

  return (
    <div ref={itemRef} className={`timeline-item reveal ${staggerClass}`}>
      <div className="timeline-dot" aria-hidden="true">
        <span className="timeline-dot-core" />
      </div>
      <div className="timeline-card">
        <div className="timeline-top">
          <h3 className="timeline-role">{role}</h3>
          <span className="timeline-date">{date}</span>
        </div>
        <p className="timeline-org">{org}</p>
        <p className="timeline-desc">{description}</p>
        <div className="timeline-tags">
          {tags.map((tag) => (
            <Tag key={tag}>{tag}</Tag>
          ))}
        </div>
      </div>
    </div>
  )
}
