/** @type {import('tailwindcss').Config} */
export default {
    content: ["./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}"],
    darkMode: "class",
    theme: {
        extend: {
            fontFamily: {
                sans: [
                    "Geist",
                    "ui-sans-serif",
                    "system-ui",
                    "-apple-system",
                    "Segoe UI",
                    "Roboto",
                    "Helvetica Neue",
                    "Arial",
                    "sans-serif",
                ],
                mono: [
                    "Geist Mono",
                    "ui-monospace",
                    "SFMono-Regular",
                    "Menlo",
                    "Consolas",
                    "monospace",
                ],
            },
            maxWidth: {
                content: "48rem",
                wide: "72rem",
            },
        },
    },
    plugins: [],
};
