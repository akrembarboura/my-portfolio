import useScrollReveal from '../hooks/useScrollReveal'
import SkillBar from './SkillBar'
import skills from '../data/skills.jsx'

export default function Skills() {
  const headerRef = useScrollReveal()

  return (
    <section id="skills" className="w-full" style={{ paddingTop: '5rem', paddingBottom: '6rem' }}>
      <div className="container">
        
        <div ref={headerRef} className="mb-16">
          <p className="section-label">Technical Stack</p>
          <h2 className="section-title">Core Technologies</h2>
          <p className="section-sub text-lg md:text-xl max-w-[680px] leading-relaxed">
            I don't try to learn every framework. I focus deeply on a core stack that allows me to build robust, scalable applications from the database up to the user interface.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10 border-t border-border-strong pt-14">
          {skills.map((cat) => (
            <SkillCategory
              key={cat.category}
              category={cat}
            />
          ))}
        </div>
        
      </div>
    </section>
  )
}

function SkillCategory({ category }) {
  const ref = useScrollReveal()

  return (
    <div className="flex flex-col" ref={ref}>
      <div className="flex items-center gap-3.5 pb-4 mb-6 border-b border-border-light group cursor-default">
        <span className="flex items-center justify-center w-11 h-11 rounded-lg bg-background-1 border border-border-light shrink-0 transition-all duration-300 group-hover:scale-110 group-hover:border-border-strong shadow-sm">
          {category.icon}
        </span>
        <h3 className="font-sans font-bold uppercase tracking-wider text-[0.95rem] text-text-1">
          {category.category}
        </h3>
      </div>
      
      <div className="flex flex-col gap-3">
        {category.items.map((skill) => (
          <SkillBar
            key={skill.name}
            icon={skill.icon}
            name={skill.name}
            role={skill.role}
            color={skill.color}
            isPrimary={skill.isPrimary}
          />
        ))}
      </div>
    </div>
  )
}
