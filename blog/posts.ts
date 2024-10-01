import { ContentData, createContentLoader } from "vitepress";

export declare const data: ContentData[];

export default createContentLoader("/blog/*.md", {
  transform(rawData) {
    return rawData.sort((a, b) => {
      return +new Date(b.frontmatter.date) - +new Date(a.frontmatter.date);
    });
  },
});
