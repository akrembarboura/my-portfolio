import { useEffect, useState } from 'react'

export default function HeroAvatar({ src, alt = 'Profile photo', size = 400 }) {
    const [isMobile, setIsMobile] = useState(false)

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768)
        checkMobile()
        window.addEventListener('resize', checkMobile)
        return () => window.removeEventListener('resize', checkMobile)
    }, [])

    const finalSize = isMobile ? Math.min(size, window.innerWidth - 64) : size;

    return (
        <div
            className="relative"
            style={{ width: finalSize, height: finalSize * 1.25 }} // Portrait/Editorial crop
        >
            <div 
                className="absolute inset-0 bg-background-2"
                style={{ 
                    transform: 'translate(12px, 12px)',
                    transition: 'transform 0.3s ease'
                }}
            />
            
            {/* Inner Wrapper (Clipped boundaries) */}
            <div 
                className="absolute inset-0 overflow-hidden bg-background-1 border border-border-strong group hover:-translate-y-1 hover:-translate-x-1 transition-transform duration-300 ease-out"
            >
                <img
                    src={src}
                    alt={alt}
                    className="w-full h-full object-cover object-top"
                />
                
            </div>
        </div>
    )
}
