/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class',
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                dark: {
                    bg: '#020617',     // Slate-950
                    card: '#0f172a',   // Slate-900
                    border: '#1e293b'  // Slate-800
                }
            },
            animation: {
                // 🚀 Optimized speed (30s) for better readability
                'marquee-ltr': 'marquee-ltr 30s linear infinite',
                'marquee2-ltr': 'marquee2-ltr 30s linear infinite',
            },
            keyframes: {
                // ➡️ Primary: Slides from hidden left (-100%) to center (0%)
                'marquee-ltr': {
                    '0%': { transform: 'translateX(-100%)' },
                    '100%': { transform: 'translateX(0%)' },
                },
                // ➡️ Secondary: Slides from center (0%) to hidden right (100%)
                'marquee2-ltr': {
                    '0%': { transform: 'translateX(0%)' },
                    '100%': { transform: 'translateX(100%)' },
                }
            }
        },
    },
    plugins: [
        require('@tailwindcss/typography'),
        function ({ addUtilities }) {
            addUtilities({
                '.pause': { 'animation-play-state': 'paused' },
                '.no-scrollbar': {
                    '-ms-overflow-style': 'none',
                    'scrollbar-width': 'none',
                    '&::-webkit-scrollbar': { display: 'none' }
                }
            });
        },
    ],
}