import { useState, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import Loader from './Loader'
import CustomCursor from './CustomCursor'
import Navbar from './Navbar'
import Footer from './Footer'
import WelcomeMessage from './WelcomeMessage'

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
            <Loader />
            <CustomCursor />
            <Navbar darkMode={darkMode} onToggleTheme={toggleTheme} />

            {/* Dynamic content renders here based on the route */}
            <main>
                <Outlet />
            </main>

            <Footer />
            <WelcomeMessage />
        </>
    )
}
