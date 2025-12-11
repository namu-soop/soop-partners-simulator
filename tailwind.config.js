/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#053c3c',
                    dark: '#074d4d',
                },
                secondary: {
                    DEFAULT: '#e0dbd1',
                },
                accent: {
                    DEFAULT: '#d4a574',
                    dark: '#c29465',
                },
            },
            fontFamily: {
                sans: ['"Noto Sans KR"', 'sans-serif'],
            },
        },
    },
    plugins: [],
}
