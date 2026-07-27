import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import navLinks from '../data/navLinks'

export default function Navbar({ darkMode, onToggleTheme }) {
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState('')
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20)

      // Find which section is currently in view
      // Find which section is currently in view ONLY if on homepage
      if (window.location.pathname === '/' || window.location.pathname === '') {
        const sectionIds = navLinks.map((l) => l.href.replace('/#', ''))
        for (let i = sectionIds.length - 1; i >= 0; i--) {
          const el = document.getElementById(sectionIds[i])
          if (el && el.offsetTop - 100 <= window.scrollY) {
            setActiveSection(sectionIds[i])
            break
          }
        }
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const { pathname } = useLocation()

  const closeMobile = () => setMobileOpen(false)

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 h-[70px] bg-nav backdrop-blur-xl border-b border-border-light transition-all duration-300 ${scrolled ? 'shadow-xl' : ''}`}>
        <div className="max-w-[1200px] h-full mx-auto px-8 flex items-center justify-between">
          <a href="#" className="font-syne font-extrabold text-[1.4rem] tracking-tight bg-gradient-to-br from-accent to-accent-2 bg-clip-text text-transparent">
            Akrem.
          </a>

          <ul className="hidden md:flex items-center gap-8 list-none">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (activeSection && link.href.includes(activeSection));
              return (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className={`text-[0.875rem] font-medium transition-colors relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:right-0 after:h-[1.5px] after:bg-accent after:origin-left after:transition-transform after:duration-250 ${isActive ? 'text-text-1 after:scale-x-100' : 'text-text-2 after:scale-x-0 hover:text-text-1 hover:after:scale-x-100'}`}
                  >
                    {link.label}
                  </Link>
                </li>
              )
            })}
          </ul>

          <div className="flex items-center gap-4">
            <button
              className="w-10 h-10 border border-border-light rounded-[10px] bg-transparent text-text-2 flex items-center justify-center text-[1.1rem] transition-all duration-200 hover:bg-background-2 hover:border-border-strong hover:text-text-1"
              onClick={onToggleTheme}
              aria-label="Toggle theme"
            >
              {darkMode ? '\u2600\ufe0f' : '\ud83c\udf19'}
            </button>
            <Link to="/contact" className="hidden md:inline-block px-5 py-2 bg-gradient-to-br from-accent to-accent-2 text-white rounded-lg text-[0.875rem] font-semibold border-none cursor-pointer transition-all duration-200 shadow-[0_0_20px_var(--accent-glow)] hover:opacity-90 hover:-translate-y-px hover:shadow-[0_4px_24px_var(--accent-glow)]">
              Let's Talk
            </Link>
            <button
              className="md:hidden flex flex-col gap-[5px] p-1 bg-none border-none cursor-pointer"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Menu"
              aria-expanded={mobileOpen}
            >
              <span className={`block w-[22px] h-[2px] bg-text-2 rounded-[2px] transition-all duration-300 ${mobileOpen ? 'rotate-45 translate-y-[7px]' : ''}`} />
              <span className={`block w-[22px] h-[2px] bg-text-2 rounded-[2px] transition-all duration-300 ${mobileOpen ? 'opacity-0' : ''}`} />
              <span className={`block w-[22px] h-[2px] bg-text-2 rounded-[2px] transition-all duration-300 ${mobileOpen ? '-rotate-45 -translate-y-[7px]' : ''}`} />
            </button>
          </div>
        </div>
      </nav>

      <div className={`fixed inset-0 top-[70px] z-[40] bg-nav backdrop-blur-xl p-8 flex flex-col gap-6 transition-transform duration-300 md:hidden ${mobileOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        {navLinks.map((link) => (
          <Link
            key={link.href}
            to={link.href}
            onClick={closeMobile}
            className="text-xl font-semibold text-text-2 py-3 border-b border-border-light transition-colors hover:text-accent"
          >
            {link.label}
          </Link>
        ))}
      </div>
    </>
  )
}

