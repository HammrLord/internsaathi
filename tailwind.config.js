/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#FF9933', // Saffron
                    hover: '#e68a2e',
                },
                secondary: {
                    DEFAULT: '#138808', // India Green
                    hover: '#107007',
                },
                chakra: '#054A91', // Ashoka Chakra Blue
                background: "var(--background)",
                foreground: "var(--foreground)",
            },
        },
    },
    plugins: [],
};
