// @ts-check
import { defineConfig } from "astro/config";

import tailwind from "@astrojs/tailwind";
import icon from "astro-icon";
import { template } from "./src/settings";

import sitemap from "@astrojs/sitemap";


export default defineConfig({
    integrations: [tailwind(), sitemap(), icon()],
    site: 'https://chrisdburr.github.io',
    base: ''
});
