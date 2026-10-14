import { useEffect, useState } from 'react'
import useScrollReveal from '../hooks/useScrollReveal'
import ProjectCard from './ProjectCard'
import featuredProjects from '../data/featuredProjects'
import { supabase } from '../supabaseClient'

export default function Projects() {
  const headerRef = useScrollReveal()
  const gridRef = useScrollReveal()
  
  const [experiments, setExperiments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchExperiments() {
      try {
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .eq('status', 'active')
          .order('sort_order', { ascending: true })
        
        if (!error && data) {
          setExperiments(data)
        }
      } catch (err) {
        console.error('Error fetching experiments:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchExperiments()
  }, [])

  return (
    <section id="projects">
      <div className="container">
        
        <div ref={headerRef}>
          <p className="section-label">Selected Work</p>
          <h2 className="section-title">Featured Projects</h2>
          <p className="section-sub">
            Real products built for real businesses. These showcase full-stack architecture, clean engineering, and production delivery.
          </p>
        </div>

        <div className="projects-grid" ref={gridRef}>
          {featuredProjects.map((project) => (
            <ProjectCard 
              key={project.id} 
              {...project}
            />
          ))}
        </div>

        {experiments.length > 0 && (
          <div className="mt-24 pt-16 border-t border-border-light">
            <div className="mb-12 text-center">
              <h3 className="font-sans font-bold text-2xl text-text-1">Earlier Experiments</h3>
              <p className="text-text-2 mt-2 max-w-[600px] mx-auto">
                Smaller projects built to understand JavaScript, APIs, React, and databases.
              </p>
            </div>

            <div className="projects-grid">
              {loading ? (
                <div className="col-span-full flex justify-center py-12">
                  <span className="text-text-3 font-mono text-sm">Loading experiments...</span>
                </div>
              ) : (
                experiments.map((project) => (
                  <ProjectCard 
                    key={project.id} 
                    {...project} 
                  />
                ))
              )}
            </div>
          </div>
        )}

        <div style={{ textAlign: 'center', marginTop: '3.5rem' }}>
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
