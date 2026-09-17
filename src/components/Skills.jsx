import { useState, useEffect, useRef } from 'react'
import useScrollReveal from '../hooks/useScrollReveal'
import SkillBar from './SkillBar'
import skills from '../data/skills.jsx'

export default function Skills() {
  const [animated, setAnimated] = useState(false)
  const sectionRef = useRef(null)
  const headerRef = useScrollReveal()

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

  return (
    <section id="skills" className="py-16 md:py-24" ref={sectionRef}>
      <div className="container">
        
        <div ref={headerRef} className="mb-16">
          <p className="section-label">Technical Stack</p>
          <h2 className="section-title">Core Technologies</h2>
          <p className="text-text-2 text-lg max-w-[600px] leading-relaxed">
            I don't try to learn every framework. I focus deeply on a core stack that allows me to build robust, scalable applications from the database up to the user interface.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-12 gap-y-16 border-t border-border-strong pt-12">
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
    <div className="flex flex-col gap-6" ref={ref}>
      <div className="flex items-center gap-3 text-text-1 pb-4 border-b border-border-light">
        <span className="text-accent">{category.icon}</span>
        <h3 className="font-sans font-bold uppercase tracking-wider text-[0.85rem]">
          {category.category}
        </h3>
      </div>
      
      <div className="flex flex-col">
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
