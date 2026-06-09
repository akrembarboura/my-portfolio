import Tag from './Tag'

// Single timeline entry (experience, education, or training)
export default function TimelineItem({ type, typeBadge, role, date, org, description, tags }) {
  return (
    <div className="timeline-item">
      <div className="timeline-dot" />
      <div className="timeline-card">
        <div className="timeline-type">
          {type}
          <span className="timeline-type-badge">{typeBadge}</span>
        </div>
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
