import { useState } from 'react'
import ProjectModal from './ProjectModal'

export default function ProjectCard({
  id,
  title,
  subtitle,
  description,
  image,
  status = 'COMPLETED',
  type = 'FREELANCING',
  privacy,
  tags = [],
  github,
  demo,
  metrics = [],
  architecture,
}) {
  const [modalOpen, setModalOpen] = useState(false)
  const hasLiveDemo = demo && demo !== '#'

  const getTypeBadgeClass = (t) => {
    switch (t?.toUpperCase()) {
      case 'FREELANCING':
        return 'badge-type-freelancing'
      case 'LEARNING':
        return 'badge-type-learning'
      case 'PERSONAL':
      default:
        return 'badge-type-personal'
    }
  }

  return (
    <>
      <article className="project-card group">
        {/* 1. Header: Bold uppercase title and concise 2-line description */}
        <div className="project-card-header">
          <div className="flex items-center justify-between gap-2 mb-1">
            <h3 className="project-card-title">{title}</h3>
            {metrics?.[0] && (
              <span className="text-[10px] font-mono text-[#39D353] bg-[#39D353]/10 px-2 py-0.5 rounded-full border border-[#39D353]/20">
                {metrics[0]}
              </span>
            )}
          </div>
          <p className="project-card-desc" title={description}>
            {description}
          </p>
        </div>

        {/* 2. Middle: Premium Generated Showcase Banner */}
        {image && (
          <div 
            className="project-showcase-media cursor-pointer relative"
            onClick={() => setModalOpen(true)}
            title="Click to inspect architecture and case study"
          >
            <img
              src={image}
              alt={`${title} showcase banner`}
              className="project-showcase-img transition-transform duration-300 group-hover:scale-[1.02]"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="text-xs font-mono font-medium px-3 py-1.5 rounded-full bg-black/80 text-white border border-white/20 backdrop-blur-sm">
                Inspect Architecture ↗
              </span>
            </div>
          </div>
        )}

        {/* 3. Tech Stack Tags (Recruiter Critical) */}
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 my-2.5">
            {tags.slice(0, 4).map((tag) => (
              <span
                key={tag}
                className="text-[10.5px] font-mono px-2 py-0.5 rounded bg-white/[0.04] text-neutral-300 border border-white/[0.08]"
              >
                {tag}
              </span>
            ))}
            {tags.length > 4 && (
              <span 
                onClick={() => setModalOpen(true)}
                className="text-[10.5px] font-mono px-1.5 py-0.5 rounded bg-white/[0.02] text-neutral-400 hover:text-accent cursor-pointer"
              >
                +{tags.length - 4}
              </span>
            )}
          </div>
        )}

        {/* 4. Footer: Badges & Interactive Links */}
        <footer className="project-card-footer mt-auto">
          <div className="project-badges">
            {status && (
              <span className="badge-pill badge-status-completed">
                {status}
              </span>
            )}
            {type && (
              <span className={`badge-pill ${getTypeBadgeClass(type)}`}>
                {type}
              </span>
            )}
            {privacy === 'PRIVATE' && (
              <span className="badge-pill badge-privacy-private">
                PRIVATE
              </span>
            )}
          </div>

          <div className="project-actions">
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="project-action-btn"
              title="View Architecture Details"
            >
              <span>Inspect</span>
            </button>
            {github && (
              <a
                href={github}
                target="_blank"
                rel="noopener noreferrer"
                className="project-action-btn"
                aria-label={`View ${title} source on GitHub`}
                title="View source on GitHub"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
                </svg>
                <span>Code</span>
              </a>
            )}
            {hasLiveDemo && (
              <a
                href={demo}
                target="_blank"
                rel="noopener noreferrer"
                className="project-action-btn demo-btn"
                aria-label={`View live demo of ${title}`}
                title="Live Demo"
              >
                <span>Live Demo</span>
                <span className="text-xs">↗</span>
              </a>
            )}
          </div>
        </footer>
      </article>

      {/* Case Study & Architecture Modal */}
      <ProjectModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        project={{
          id,
          title,
          subtitle,
          description,
          status,
          type,
          tags,
          github,
          demo,
          metrics,
          architecture,
        }}
      />
    </>
  )
}
