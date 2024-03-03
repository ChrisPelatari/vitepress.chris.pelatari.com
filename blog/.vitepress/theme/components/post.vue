<template>
  <div class="VPPage" style="margin:1.618rem;">
    <h3 class="text-h3">{{ frontmatter.title }}</h3>
    <p class="text-overline">{{ new Date(page.filePath.split('/').pop().slice(0, 10)).toDateString() }}</p>
    <p class="text-caption" v-if="frontmatter.permalink"><a href="`${frontmatter.permalink}`">{{ frontmatter.permalink }}</a></p>
    <Content />
  </div>
</template>

<script setup>
import { useData } from 'vitepress'
const { frontmatter, page } = useData()
</script>

<style>
p {
  padding: 0.4rem;
}

ol,
ul {
  margin: 1rem;
  list-style-position: outside !important;
}

ol li {
  margin: 0;
  padding: 0;
  list-style: decimal !important;
}

li {
  margin: 0;
  padding: 0;
  list-style: outside !important;
}

.text-h3 {
  font-size: calc(1.618em * 2);
  line-height: 2.75rem;
  font-weight: 600;
  margin-top: 1.618rem;
  margin-bottom: 1.618rem;
}

.text-overline {
  font-size: 0.75rem;
  line-height: 1rem;
  text-transform: uppercase;
  margin: 1.618em;
}

.vp-adaptive-theme {
  background: #212121;
  border: 1px solid #fafafa;
  border-radius: 0.25em;
}

code>span {
  margin: 2.5rem;
}

h2 {
  font-weight: 800;
}

.text-h2 {
  font-size: 2.25rem;
  line-height: 2.5rem;
  font-weight: 800;
  margin: 0;
}

h1 {
  font-weight: 800;
  font-size: larger;
  text-decoration: underline;
}

/* only limit img size on large screens */
@media (min-width: 800px) {
  img {
    max-width: 80%;
    margin: 0 auto;
  }
}
</style>