/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    future: {
        hoverOnlyWhenSupported: true,
    },
    content: [
        './pages/**/*.{ts,tsx}',
        './components/**/*.{ts,tsx}',
        './app/**/*.{ts,tsx}',
        './src/**/*.{ts,tsx}',
    ],
    prefix: "",
    theme: {
        container: {
            center: true,
            padding: "2rem",
            screens: {
                "2xl": "1400px",
            },
        },
    }
}
