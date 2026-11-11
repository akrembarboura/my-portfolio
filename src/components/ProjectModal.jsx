import { useEffect } from 'react'
import { X, ExternalLink, Cpu, CheckCircle2 } from 'lucide-react'
import { FaGithub } from 'react-icons/fa'

export default function ProjectModal({ project, isOpen, onClose }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      window.addEventListener('keydown', handleKeyDown)
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  if (!isOpen || !project) return null

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/75 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div 
        className="relative w-full max-w-2xl bg-[#0d131f] border border-white/10 rounded-2xl shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto text-neutral-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-lg text-neutral-400 hover:text-white bg-white/5 hover:bg-white/10 transition-colors"
          aria-label="Close modal"
        >
          <X size={18} />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-mono tracking-widest uppercase text-accent font-semibold">
            {project.type || 'ENGINEERING SHOWCASE'}
          </span>
          <span className="text-neutral-500">·</span>
          <span className="text-xs font-mono uppercase text-neutral-400">
            {project.status || 'COMPLETED'}
          </span>
        </div>

        <h3 className="text-2xl font-bold font-sans tracking-tight text-white mb-2">
          {project.title}
        </h3>
        
        <p className="text-sm text-neutral-300 leading-relaxed mb-5">
          {project.subtitle || project.description}
        </p>

        {/* Tech Stack Pills */}
        <div className="mb-6">
          <div className="text-xs font-mono uppercase tracking-wider text-neutral-400 mb-2 flex items-center gap-1.5">
            <Cpu size={14} className="text-accent" />
            <span>Tech Stack &amp; Infrastructure</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {project.tags?.map((tag) => (
              <span
                key={tag}
                className="text-xs font-mono px-2.5 py-1 rounded-md bg-white/5 text-neutral-200 border border-white/10"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Architecture & Decisions */}
        {project.architecture && (
          <div className="mb-6 p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
            <h4 className="text-xs font-mono uppercase tracking-wider text-accent mb-2">
              System Architecture &amp; Decisions
            </h4>
            <p className="text-sm text-neutral-300 leading-relaxed">
              {project.architecture}
            </p>
          </div>
        )}

        {/* Key Engineering Metrics */}
        {project.metrics && project.metrics.length > 0 && (
          <div className="mb-6">
            <h4 className="text-xs font-mono uppercase tracking-wider text-neutral-400 mb-2">
              Key Engineering Highlights &amp; Metrics
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {project.metrics.map((metric, i) => (
                <div 
                  key={i} 
                  className="flex items-center gap-2 p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.06] text-xs font-mono text-neutral-300"
                >
                  <CheckCircle2 size={14} className="text-[#39D353] shrink-0" />
                  <span>{metric}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions Footer */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-white/10">
          <div className="flex items-center gap-3">
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-mono font-medium rounded-lg bg-white/10 hover:bg-white/15 text-white transition-colors"
              >
                <FaGithub className="w-3.5 h-3.5" />
                <span>Source Code</span>
              </a>
            )}
            {project.demo && project.demo !== '#' && (
              <a
                href={project.demo}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-mono font-medium rounded-lg bg-accent text-black hover:opacity-90 transition-opacity font-semibold"
              >
                <span>Live Deployment</span>
                <ExternalLink size={14} />
              </a>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-xs font-mono text-neutral-400 hover:text-white px-3 py-2 transition-colors ml-auto"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
