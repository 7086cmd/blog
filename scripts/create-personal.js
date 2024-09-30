import { writeFileSync } from "node:fs";
import { resolve } from "node:path";
import dayjs from "dayjs";
import { readFileSync } from "fs";

const date = dayjs().format("YYYY-MM-DD");

const filename = `personal/${date}.md`;
// Use the style Month (English) Date, Year
const content = `
Personal Blog on ${dayjs().format("MMMM D, YYYY")}.
`;

writeFileSync(resolve(filename), content);

console.log(`Created personal blog: ${filename} file`);

/**
 * @type {import("vitepress/types/default-theme").DefaultTheme.SidebarItem[]}
 */
const sidebar = JSON.parse(
    readFileSync(resolve(".vitepress/personal.json"), "utf-8"),
);

const year = date.split("-")[0];

if (sidebar.filter((item) => item.text === year).length === 0) {
    sidebar.push({
        text: year,
        items: [],
    });
}

writeFileSync(
    resolve(".vitepress/personal.json"),
    JSON.stringify(
        sidebar.map((item) => {
            if (item.text === year) {
                item.items.push({
                    text: dayjs().format("YYYY-MM-DD"),
                    link: `/${filename.replace(".md", "")}`,
                });
            }
            return item;
        }),
        null,
        2,
    ),
);
