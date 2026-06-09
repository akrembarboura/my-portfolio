import useScrollReveal from '../hooks/useScrollReveal'
import TimelineItem from './TimelineItem'
import timeline from '../data/timeline'

export default function Experience() {
  const headerRef = useScrollReveal()
  const listRef = useScrollReveal()

  return (
    <section id="experience" className="experience-section">
      <div className="container">
        <div ref={headerRef}>
          <p className="section-label">Journey</p>
          <h2 className="section-title">Experience & Education</h2>
          <p className="section-sub">
            My professional journey and educational background that shaped my
            development skills.
          </p>
        </div>

        <div className="timeline" ref={listRef}>
          {timeline.map((item) => (
            <TimelineItem key={item.id} {...item} />
          ))}
        </div>
      </div>
    </section>
  )
}
