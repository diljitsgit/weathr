/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
    theme: {
        extend: {
            borderRadius: {
                lg: "var(--radius)",
                md: "calc(var(--radius) - 2px)",
                sm: "calc(var(--radius) - 4px)",
            },
            colors: {
                dbackground: "#090910",
                lbackground: "#D8D8D8",
                grayTxt: "#747474",
                primary: "#3E5EFF",
                outline: "#27272A",
            },
            fontFamily: {
                logo: ["logo-font"],
                info: ["logo-info"],
            },
        },
    },
    plugins: [require("tailwindcss-animate")],
};
