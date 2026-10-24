import { useEffect, useState } from 'react'
import navLinks from '../data/navLinks'
import { Sun, Moon } from 'lucide-react'
import LiquidFillButton from './LiquidFillButton'

export default function Navbar({ darkMode, onToggleTheme }) {
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState('about')
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20)

      // Find which section is currently in view
      const sectionIds = navLinks.map((l) => l.href.replace('#', ''))
      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const el = document.getElementById(sectionIds[i])
        if (el && el.offsetTop - 100 <= window.scrollY) {
          setActiveSection(sectionIds[i])
          break
        }
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    // Run once immediately to set correct initial active state
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const closeMobile = () => setMobileOpen(false)

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 h-[70px] bg-nav backdrop-blur-xl border-b border-border-light transition-all duration-300 ${scrolled ? 'shadow-xl' : ''}`}>
        <div className="w-full max-w-[1780px] h-full mx-auto px-5 sm:px-8 lg:px-12 xl:px-16 2xl:px-20 flex items-center justify-between">
          <a href="#about" className="flex items-center gap-3 group transition-transform duration-300 hover:scale-[1.02]">
            <img
              src="/akrempicture.png"
              alt="Akrem Barboura"
              className="w-[42px] h-[42px] rounded-full object-cover border border-border-strong group-hover:border-accent transition-all duration-300"
            />
            <span className="hidden sm:block font-sans font-bold text-[1.2rem] tracking-tight text-text-1 group-hover:text-accent transition-all duration-300">
              Akrem.
            </span>
          </a>

          <ul className="hidden md:flex items-center gap-8 list-none">
            {navLinks.map((link) => {
              const sectionId = link.href.replace('#', '')
              const isActive = activeSection === sectionId
              return (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className={`text-[0.875rem] font-medium transition-colors relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:right-0 after:h-[1.5px] after:bg-accent after:origin-left after:transition-transform after:duration-250 ${isActive ? 'text-text-1 after:scale-x-100' : 'text-text-2 after:scale-x-0 hover:text-text-1 hover:after:scale-x-100'}`}
                  >
                    {link.label}
                  </a>
                </li>
              )
            })}
          </ul>

          <div className="flex items-center gap-3 sm:gap-4 lg:gap-5 ml-4 sm:ml-6 md:ml-8 lg:ml-10">
            <button
              className="w-10 h-10 border border-border-light rounded-[10px] bg-transparent text-text-2 flex items-center justify-center text-[1.1rem] transition-all duration-200 hover:bg-background-2 hover:border-border-strong hover:text-text-1"
              onClick={onToggleTheme}
              aria-label="Toggle theme"
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <LiquidFillButton
              href="#contact"
              className="hidden md:inline-flex btn btn-primary py-[0.55rem] px-6 text-[0.85rem] !rounded-full shadow-editorial hover:shadow-editorial-hover hover:!translate-y-0"
            >
              Let's Talk
            </LiquidFillButton>
            <button
              className="md:hidden flex flex-col gap-[5px] p-1 bg-none border-none cursor-pointer"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
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
          <a
            key={link.href}
            href={link.href}
            onClick={closeMobile}
            className="text-xl font-semibold text-text-2 py-3 border-b border-border-light transition-colors hover:text-accent"
          >
            {link.label}
          </a>
        ))}
        <div className="pt-2">
          <LiquidFillButton
            href="#contact"
            onClick={closeMobile}
            className="w-full justify-center btn btn-primary py-3 px-6 text-sm !rounded-full shadow-editorial flex"
          >
            Let's Talk
          </LiquidFillButton>
        </div>
      </div>
    </>
  )
}
