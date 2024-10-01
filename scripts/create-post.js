import { writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { argv } from "process";
import dayjs from "dayjs";
import tagIndex from "./tags.js";
import { readFileSync } from "fs";

const title = argv[2];
const date = dayjs().format("YYYY-MM-DD");
const slug = title.toLowerCase().replace(/ /g, "-");
const tags = argv.slice(3);

const filename = `blog/${date}-${slug}.md`;
const content = `---
title: ${title}
date: ${date}
outline: deep
authors:
  - 7086cmd
categories: [${tags
  .map((tag) => {
    const tagInfo = tagIndex.find((t) => t.short === tag);
    return tagInfo.name;
  })
  .join(", ")}]
---
<AppBlogPostHeader />

Tags: ${tags
  .map((tag) => {
    const tagInfo = tagIndex.find((t) => t.short === tag);
    return `<Badge text="${tagInfo.name}" type="${tagInfo.color}" />`;
  })
  .join("")}
`;

writeFileSync(resolve(filename), content);

console.log(`Created post: ${filename} file`);

/**
 * @type {import("vitepress/types/default-theme").DefaultTheme.SidebarItem[]}
 */
const sidebar = JSON.parse(
  readFileSync(resolve(".vitepress/blogs.json"), "utf-8"),
);

const year = date.split("-")[0];

if (sidebar.filter((item) => item.text === year).length === 0) {
  sidebar.push({
    text: year,
    items: [],
  });
}

writeFileSync(
  resolve(".vitepress/blogs.json"),
  JSON.stringify(
    sidebar.map((item) => {
      if (item.text === year) {
        item.items.push({
          text: title,
          link: `/${filename.replace(".md", "")}`,
        });
      }
      return item;
    }),
    null,
    2,
  ),
);
