import { DefaultTheme, defineConfig } from "vitepress";
import blogs from "./blogs.json" with { type: "json" };
import personal from "./personal.json" with { type: "json" };
import RSS from "rss";
import matter from "gray-matter";
import { readFileSync } from "fs";
import { resolve } from "node:path";
import dayjs from "dayjs";
import {writeFileSync} from "node:fs";

// https://vitepress.dev/reference/site-config
const config = defineConfig({
  title: "7086cmd's blog",
  description: "Ethan Goh's Blog",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: "Home", link: "/" },
      { text: "Blog", link: "/blog" },
    ],

    logo: "https://github.com/7086cmd.png",

    sidebar: {
      "/blog/": blogs,
      "/personal/": personal,
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
    math: true,
  },
});

const feed = new RSS({
  title: config.title,
  description: config.description,
  feed_url: "https://7086cmd.me/rss.xml",
  site_url: "https://7086cmd.me/",
  image_url: "https://github.com/7086cmd.png",
  copyright: config.themeConfig.footer.copyright,
  language: "en-US",
});

const posts = [];

(blogs as DefaultTheme.SidebarItem[]).forEach(cate => {
  if (cate.text === 'Introduction') return
  posts.concat(cate.items)
})

posts.forEach((post) => {
  const metadata = matter(readFileSync(resolve(post.link), "utf-8"));
  feed.item({
    title: post.text,
    url: post.link,
    categories: metadata.data.tags,
    author: '7086cmd',
    date: dayjs(metadata.data.date).toDate(),
  });
});

writeFileSync(resolve('public/rss.xml'), feed.xml())

export default config;
