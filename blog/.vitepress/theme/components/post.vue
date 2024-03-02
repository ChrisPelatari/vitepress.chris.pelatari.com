<template>
  <div class="VPPage">
    <v-container>
      <h3 class="text-h3">{{ frontmatter.title }}</h3>
      <p class="text-overline">{{ new Date(page.filePath.split('/').pop().slice(0, 11)).toDateString() }}</p>
      <p class="text-caption" v-if="frontmatter.permalink">{{ frontmatter.permalink }}</p>
      <Content />
    </v-container>
  </div>
</template>

<script setup>
import { useData } from 'vitepress'
const { frontmatter, page } = useData()
</script>

<style>
p {
  margin: 1.618em;
}

ol, ul {
  margin: 1.618em;
  list-style-position: outside;
}

ol li {
  margin: 0;
  padding: 0;
  list-style:decimal;
}

li {
  margin: 0;
  padding: 0;
  list-style:outside;
}

.vp-adaptive-theme {
  padding: 1.618em;
  margin: 1.618em;
  background: #212121;
  border: 1px solid #fafafa;
  border-radius: 0.25em;
}

code > span{
  margin: 1.618em;
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