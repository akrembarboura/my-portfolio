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
            className="relative flex items-center justify-center"
            style={{ width: finalSize }}
        >
            <img
                src={src}
                alt={alt}
                className="w-full h-auto object-contain select-none pointer-events-none drop-shadow-xl"
            />
        </div>
    )
}

