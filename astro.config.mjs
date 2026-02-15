// @ts-check

import sitemap from "@astrojs/sitemap";

import tailwind from "@astrojs/tailwind";
import { defineConfig } from "astro/config";
import icon from "astro-icon";

export default defineConfig({
  integrations: [tailwind(), sitemap(), icon()],
  site: "https://chrisdburr.github.io",
  base: "",
});
