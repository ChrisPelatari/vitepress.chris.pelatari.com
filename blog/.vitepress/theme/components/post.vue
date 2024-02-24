<template>
  <div class="VPPage">
    <v-container>
      <h3 class="text-h3">{{ frontmatter.title }}</h3>
      <p class="text-caption" v-if="frontmatter.author">{{ frontmatter.author }}</p>
      <p class="text-caption">{{ new Date(page.filePath.split('/').pop().slice(0, 10)).toLocaleString() }}</p>
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
  margin: 1.1618em;
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

img {
  max-width: 75%;
  height: auto;
}
</style>