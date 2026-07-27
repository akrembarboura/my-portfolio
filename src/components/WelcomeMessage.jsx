import { useState, useEffect } from 'react';

const messages = [
    "Hmm... you look great today ✨",
    "Welcome back 👋",
    "Ready to explore? 🚀",
    "Have a great day 🌟",
    "Nice to see you! 🎉"
];

export default function WelcomeMessage() {
    const [isVisible, setIsVisible] = useState(false);
    const [isAnimatingOut, setIsAnimatingOut] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const randomMsg = messages[Math.floor(Math.random() * messages.length)];
        setMessage(randomMsg);

        // Wait 2 full seconds for the site loader to finish vanishing
        const showTimer = setTimeout(() => {
            setIsVisible(true);
        }, 2000);

        const hideTimer = setTimeout(() => {
            setIsAnimatingOut(true);
            setTimeout(() => setIsVisible(false), 500);
        }, 6500);

        return () => {
            clearTimeout(showTimer);
            clearTimeout(hideTimer);
        };
    }, []);

    if (!isVisible) return null;

    const handleClose = () => {
        setIsAnimatingOut(true);
        setTimeout(() => setIsVisible(false), 500);
    };

    return (
        <div
            style={{ zIndex: 9999999 }}
            className={`fixed bottom-6 right-6 sm:bottom-10 sm:right-10 flex items-center gap-3 px-5 py-4 
                     bg-slate-900 border border-slate-700
                     rounded-2xl shadow-2xl backdrop-blur-xl transition-all duration-500 ease-out transform
                     ${isAnimatingOut ? 'opacity-0 translate-y-10 scale-90' : 'opacity-100 translate-y-0 scale-100'} 
                     ${!isAnimatingOut ? 'animate-slide-up-fade' : ''}`}
        >
            <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
            <p className="text-white font-medium text-sm sm:text-base tracking-wide whitespace-nowrap">
                {message}
            </p>
            <button
                onClick={handleClose}
                className="ml-3 p-1 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-all"
                aria-label="Close"
            >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 6L6 18M6 6l12 12" />
                </svg>
            </button>
            <style>{`
            @keyframes slide-up-fade {
              0% { opacity: 0; transform: translateY(30px) scale(0.9); }
              100% { opacity: 1; transform: translateY(0) scale(1); }
            }
            .animate-slide-up-fade {
              animation: slide-up-fade 0.5s cubic-bezier(0.22, 1, 0.36, 1) forwards;
            }
            `}</style>
        </div>
    );
}
