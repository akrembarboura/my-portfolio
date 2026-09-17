/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: ['class', '[data-theme="dark"]'],
    theme: {
        extend: {
            colors: {
                background: {
                    0: 'var(--bg-0)',
                    1: 'var(--bg-1)',
                    2: 'var(--bg-2)',
                },
                border: {
                    light: 'var(--border-light)',
                    strong: 'var(--border-strong)',
                },
                text: {
                    1: 'var(--text-1)',
                    2: 'var(--text-2)',
                    3: 'var(--text-3)',
                },
                accent: {
                    DEFAULT: 'var(--accent)',
                    muted: 'var(--accent-muted)',
                },
                card: 'var(--card-bg)',
                nav: 'var(--nav-bg)',
            },
            fontFamily: {
                sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
                display: ['"DM Sans"', 'system-ui', 'sans-serif'], // Or a serif if desired
                mono: ['"JetBrains Mono"', 'monospace'],
            },
            animation: {
                'fade-in-up': 'fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) both',
                'fade-in': 'fadeIn 0.6s ease both',
            },
            keyframes: {
                fadeInUp: {
                    '0%': { opacity: '0', transform: 'translateY(16px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                }
            },
            boxShadow: {
                'editorial': '0 4px 20px rgba(0, 0, 0, 0.03)',
                'editorial-hover': '0 8px 30px rgba(0, 0, 0, 0.06)',
            }
        },
    },
    plugins: [],
}
