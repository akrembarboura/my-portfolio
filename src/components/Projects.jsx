import useScrollReveal from '../hooks/useScrollReveal'
import ProjectCard from './ProjectCard'
import projects from '../data/projects'

export default function Projects() {
  const headerRef = useScrollReveal()
  const gridRef = useScrollReveal()

  return (
    <section id="projects">
      <div className="container">
        <div ref={headerRef}>
          <p className="section-label">Featured Work</p>
          <h2 className="section-title">Projects I've Built</h2>
          <p className="section-sub">
            Real-world applications built with the MERN stack, showcasing both
            technical skill and attention to user experience.
          </p>
        </div>

        <div className="projects-grid" ref={gridRef}>
          {projects.map((project) => (
            <ProjectCard key={project.id} {...project} />
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
          <a
            href="https://github.com/akrembarboura"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary"
          >
            View All Projects on GitHub →
          </a>
        </div>
      </div>
    </section>
  )
}
