<script setup lang="ts">
/// <reference types="vitepress/client" />
import { data as posts } from "./posts";
import dayjs from "dayjs";
</script>

<template>
  <h1>Posts</h1>
  <ul class="posts">
    <li class="post" v-for="post in posts" :key="post.url">
      <a class="link" :href="post.url">
        <div class="date">
          {{ dayjs(post.frontmatter.date).format("MMM D, YYYY") }}
        </div>
        <div class="title">{{ post.frontmatter.title }}</div>
        <div class="excerpt" v-html="post.frontmatter.description" />
        <div class="authors" v-if="post.frontmatter.authors">
          <img
            v-for="author in post.frontmatter.authors"
            :key="author"
            :src="`https://www.github.com/${author}.png`"
          />
        </div>
      </a>
    </li>
  </ul>
</template>

<style scoped>
.posts {
  list-style: none;
  padding: 0;

  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.post {
  display: flex;
  border-radius: 12px;
  background-color: var(--vp-c-bg-soft);
  transition: cubic-bezier(0.075, 0.82, 0.165, 1);
  transition-duration: 0.7s;
  transition-property: all;
  box-shadow:
    0 18px 56px rgba(0, 0, 0, 0.16),
    0 4px 12px rgba(0, 0, 0, 0.16);
}
.post:hover {
  background-color: var(--vp-c-gray-3);
  box-shadow:
    0 18px 56px rgba(0, 0, 0, 0.16),
    6px 12px 12px -2px var(--vp-c-brand-1);
}
.post .date {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--vp-c-text-2);
  margin-left: 1px;
}
.post .link {
  position: relative;
  display: flex;
  padding: 24px 32px;
  flex-direction: column;
  width: 100%;
  text-decoration: none;
  color: var(--vp-c-text-1);
  height: 128px;
}
.post .title {
  font-size: 1.5rem;
  font-weight: 600;
}
.post .excerpt {
  max-width: 70%;
  font-size: 1rem;
  line-height: 1.5;
  font-weight: 400;
  margin-top: 8px;
  color: var(--vp-c-text-2);
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
.post .authors {
  position: absolute;
  right: 32px;
  bottom: 16px;
  display: flex;
  min-width: 32px;
}
.post .authors img {
  margin-left: -0.5rem;
  width: 32px;
  height: 32px;
  border-radius: 50%;
}
</style>
