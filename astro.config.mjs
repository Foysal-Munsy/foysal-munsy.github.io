import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import tailwind from "@astrojs/tailwind";
import icon from "astro-icon";

// Hosted as a GitHub user site at https://foysal-munsy.github.io/ (repo named
// "foysal-munsy.github.io"), so it serves from the root and needs no base path.
export default defineConfig({
    site: "https://foysal-munsy.github.io",
    base: "/",

    integrations: [
        mdx(),
        tailwind({ applyBaseStyles: false }),
        icon(),
    ],
    markdown: {
        shikiConfig: {
            theme: "github-dark",
            wrap: true,
        },
    },
});
