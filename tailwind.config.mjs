/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {},
  },
  plugins: [require("@tailwindcss/typography"), require("daisyui")],
  daisyui: {
    themes: ["light", "dark", "night", "dracula", "nord"],
  },
  // lightMode: ['selector', '[data-theme="nord"]'],
  // darkMode: ['selector', '[data-theme="night"]']
};
