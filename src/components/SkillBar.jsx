export default function SkillBar({ icon, name, role, isPrimary = false, color = 'var(--text-1)' }) {
  return (
    <div 
      className="flex items-center gap-4 py-3 px-3.5 rounded-xl transition-all duration-200 hover:bg-background-2/70 group cursor-default"
      style={{ '--skill-color': color }}
    >
      <div 
        className="flex items-center justify-center w-12 h-12 rounded-xl border border-border-light bg-background-1 shrink-0 transition-all duration-300 group-hover:scale-110 group-hover:-translate-y-1 group-hover:border-[var(--skill-color)] group-hover:shadow-[0_0_20px_-2px_var(--skill-color)]"
        style={{ color: color }}
        aria-hidden="true"
      >
        {icon}
      </div>
      <div className="flex flex-col min-w-0">
        <div className="flex items-center gap-2.5">
          <span className={`font-sans tracking-tight text-[1.025rem] truncate transition-colors duration-200 ${
            isPrimary 
              ? 'font-semibold text-text-1 group-hover:text-text-1' 
              : 'font-medium text-text-2 group-hover:text-text-1'
          }`}>
            {name}
          </span>
          {isPrimary && (
            <span 
              className="w-2 h-2 rounded-full shrink-0 transition-transform duration-200 group-hover:scale-125" 
              style={{ backgroundColor: color }}
              title="Primary technology" 
              aria-label="Core technology"
            />
          )}
        </div>
        {role && (
          <span className="text-[0.8rem] text-text-3 font-mono tracking-tight truncate mt-1">
            {role}
          </span>
        )}
      </div>
    </div>
  )
}
