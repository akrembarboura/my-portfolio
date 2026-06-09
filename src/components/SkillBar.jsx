import useScrollReveal from '../hooks/useScrollReveal'

// Single skill row with icon, name, and animated progress bar
export default function SkillBar({ icon, name, level, animated }) {
  const ref = useScrollReveal({ threshold: 0.2 })

  return (
    <div className="skill-item" ref={ref}>
      <span className="skill-icon">{icon}</span>
      <span className="skill-name">{name}</span>
      <div className="skill-bar-wrap">
        <div
          className="skill-bar"
          style={{ width: animated ? `${level}%` : '0%' }}
        />
      </div>
    </div>
  )
}
