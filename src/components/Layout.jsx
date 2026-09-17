import { useState, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import SystemReveal from './SystemReveal'
import CustomCursor from './CustomCursor'
import Navbar from './Navbar'
import Footer from './Footer'

export default function Layout() {
    const [darkMode, setDarkMode] = useState(() => {
        const saved = localStorage.getItem('theme')
        return saved ? saved === 'light' : true
    })
    
    // For development/testing: Always run the reveal sequence
    const [isRevealing, setIsRevealing] = useState(() => {
        if (typeof window === 'undefined') return true;
        const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        return !isReducedMotion; // Always run unless user explicitly disabled motion
    })

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light')
        localStorage.setItem('theme', darkMode ? 'light' : 'dark')
    }, [darkMode])

    const toggleTheme = () => setDarkMode((prev) => !prev)

    return (
        <>
            <SystemReveal onComplete={() => setIsRevealing(false)} />
            <CustomCursor />
            
            {/* 
              Wrap the entire app in a div that transitions opacity.
              It is always rendered in the DOM immediately (no blocking),
              but is visually hidden while the System Reveal plays. 
            */}
            <div 
              className={`transition-opacity duration-[800ms] ease-out ${
                isRevealing ? 'opacity-0' : 'opacity-100'
              }`}
            >
              <Navbar darkMode={darkMode} onToggleTheme={toggleTheme} />
              <main>
                  <Outlet />
              </main>
              <Footer />
            </div>
        </>
    )
}
