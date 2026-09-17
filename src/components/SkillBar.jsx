import useScrollReveal from '../hooks/useScrollReveal'

export default function SkillBar({ icon, name, color }) {
  const ref = useScrollReveal({ threshold: 0.2 })

  return (
    <div className="flex items-center gap-4 mb-5 group" ref={ref}>
      <div 
        className="flex items-center justify-center w-10 h-10 rounded-sm bg-background-1 border border-border-light transition-all duration-300 group-hover:border-border-strong group-hover:-translate-y-1"
        style={{ color: color }}
      >
        {icon}
      </div>
      <span className="font-sans font-semibold text-[0.95rem] text-text-1 tracking-tight">
        {name}
      </span>
    </div>
  )
}
