import { useState, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import PortfolioIntro from './PortfolioIntro'
import CustomCursor from './CustomCursor'
import Navbar from './Navbar'
import Footer from './Footer'
import TimelineScrollbar from './TimelineScrollbar'

export default function Layout() {
    const [darkMode, setDarkMode] = useState(() => {
        const saved = localStorage.getItem('theme')
        return saved ? saved === 'light' : true
    })

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light')
        localStorage.setItem('theme', darkMode ? 'light' : 'dark')
    }, [darkMode])

    const toggleTheme = () => setDarkMode((prev) => !prev)

    return (
        <>
            <PortfolioIntro />
            <CustomCursor />
            <Navbar darkMode={darkMode} onToggleTheme={toggleTheme} />
            <TimelineScrollbar />
            <main>
                <Outlet />
            </main>
            <Footer />
        </>
    )
}
