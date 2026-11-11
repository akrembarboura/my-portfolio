import { useState, useEffect } from 'react'
import { FileText, Copy, Check, X } from 'lucide-react'
import { FaGithub, FaLinkedin } from 'react-icons/fa'

export default function RecruiterQuickBar() {
  const [visible, setVisible] = useState(false)
  const [copied, setCopied] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 350 && !dismissed) {
        setVisible(true)
      } else {
        setVisible(false)
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [dismissed])

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('akrembarboura316@gmail.com')
    setCopied(true)
    setTimeout(() => setCopied(false), 2200)
  }

  const handleDownloadCV = () => {
    const link = document.createElement('a')
    link.href = '/cv-akrem-barboura.pdf'
    link.download = 'Akrem-Barboura-CV.pdf'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (dismissed || !visible) return null

  return (
    <aside
      aria-label="Recruiter Quick Actions"
      className="fixed bottom-5 left-1/2 -translate-x-1/2 z-40 transition-all duration-300 animate-slideUp"
    >
      <div className="flex items-center gap-2 sm:gap-3 px-3.5 py-2 rounded-full bg-[#0d131f]/90 hover:bg-[#0d131f] border border-white/15 shadow-2xl backdrop-blur-xl text-xs font-mono text-neutral-200">
        
        {/* Availability Status */}
        <div className="hidden sm:flex items-center gap-2 pr-2 border-r border-white/10">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#39D353] opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#39D353]" />
          </span>
          <span className="text-[11px] text-neutral-300 font-medium">
            Available for Remote (UTC+1)
          </span>
        </div>

        {/* Action: Download CV */}
        <button
          onClick={handleDownloadCV}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/15 text-white transition-colors"
          title="Download ATS-Friendly Resume"
        >
          <FileText size={13} className="text-accent" />
          <span className="font-semibold">CV ↓</span>
        </button>

        {/* Action: Copy Email */}
        <button
          onClick={handleCopyEmail}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/15 text-white transition-colors"
          title="Copy direct email address"
        >
          {copied ? (
            <>
              <Check size={13} className="text-[#39D353]" />
              <span className="text-[#39D353]">Copied!</span>
            </>
          ) : (
            <>
              <Copy size={13} />
              <span>Copy Email</span>
            </>
          )}
        </button>

        {/* Quick Socials */}
        <div className="flex items-center gap-1">
          <a
            href="https://linkedin.com/in/akrembarboura"
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 rounded-full hover:bg-white/10 text-neutral-400 hover:text-white transition-colors"
            title="LinkedIn Profile"
            aria-label="LinkedIn Profile"
          >
            <FaLinkedin className="w-3.5 h-3.5" />
          </a>
          <a
            href="https://github.com/akrembarboura"
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 rounded-full hover:bg-white/10 text-neutral-400 hover:text-white transition-colors"
            title="GitHub Repositories"
            aria-label="GitHub Repositories"
          >
            <FaGithub className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Dismiss Button */}
        <button
          onClick={() => setDismissed(true)}
          className="p-1 rounded-full text-neutral-500 hover:text-neutral-300 hover:bg-white/10 transition-colors ml-1"
          title="Dismiss quick actions"
          aria-label="Dismiss quick actions"
        >
          <X size={13} />
        </button>
      </div>
    </aside>
  )
}
