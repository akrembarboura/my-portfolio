export default function SkillBar({ Icon, icon, name, color = 'var(--text-1)' }) {
  return (
    <li
      className="stack-item"
      style={{ '--skill-color': color }}
    >
      <span className="stack-item-logo" aria-hidden="true">
        {Icon ? <Icon /> : icon}
      </span>
      <span className="stack-item-name">{name}</span>
    </li>
  )
}
