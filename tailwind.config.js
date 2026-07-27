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
                    3: 'var(--bg-3)',
                },
                border: {
                    light: 'var(--border)',
                    strong: 'var(--border-strong)',
                },
                text: {
                    1: 'var(--text-1)',
                    2: 'var(--text-2)',
                    3: 'var(--text-3)',
                },
                accent: {
                    DEFAULT: 'var(--accent)',
                    2: 'var(--accent-2)',
                    3: 'var(--accent-3)',
                    glow: 'var(--accent-glow)'
                },
                brand: {
                    green: 'var(--green)',
                    amber: 'var(--amber)',
                },
                card: 'var(--card-bg)',
                nav: 'var(--nav-bg)',
                tag: {
                    bg: 'var(--tag-bg)',
                    color: 'var(--tag-color)'
                }
            },
            fontFamily: {
                sans: ['"DM Sans"', 'sans-serif'],
                syne: ['Syne', 'sans-serif'],
                mono: ['"JetBrains Mono"', 'monospace'],
            },
            animation: {
                'pulse-fast': 'pulse 1.2s ease-in-out infinite',
                'fade-in-up': 'fadeInUp 0.7s ease both',
                'fade-in-down': 'fadeInDown 0.6s ease both',
                'blink': 'blink 2s ease-in-out infinite',
                'scroll-line': 'scrollAnim 1.5s ease-in-out infinite',
                'float-1': 'float1 4s ease-in-out infinite',
                'float-2': 'float2 4.5s ease-in-out infinite',
                'spin-slow': 'spin 8s linear infinite',
            },
            keyframes: {
                fadeInUp: {
                    '0%': { opacity: '0', transform: 'translateY(24px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                fadeInDown: {
                    '0%': { opacity: '0', transform: 'translateY(-16px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                blink: {
                    '0%, 100%': { opacity: '1' },
                    '50%': { opacity: '0.3' },
                },
                scrollAnim: {
                    '0%': { top: '-100%' },
                    '100%': { top: '100%' },
                },
                float1: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-10px)' },
                },
                float2: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(10px)' },
                },
            }
        },
    },
    plugins: [],
}
