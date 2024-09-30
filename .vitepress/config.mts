import { defineConfig } from "vitepress";
import blogs from "./blogs.json" with { type: "json" };
import personal from "./personal.json" with { type: "json" };

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "7086cmd's blog",
  description: "Ethan Goh's Blog",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: "Home", link: "/" },
      { text: "Blog", link: "/blog" }
    ],

    logo: 'https://github.com/7086cmd.png',

    sidebar: {
      '/blog/': blogs,
      '/personal/': personal,
    },

    socialLinks: [
      { icon: "github", link: "https://github.com/7086cmd" },
      { icon: "x", link: "https://x.com/7086cmd" },
      { icon: "instagram", link: "https://www.instagram.com/ethangoh7086cmd" }
    ],
    footer: {
      message: `Released under the MIT License.`,
      copyright: "Copyright © 2023-present Ethan Goh",
    },
  },
  markdown: {
    math: true
  }
});
