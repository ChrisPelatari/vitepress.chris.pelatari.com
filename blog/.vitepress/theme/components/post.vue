<template>
  <div class="VPPage">
    <v-container>
      <h3 class="text-h3">{{ frontmatter.title }}</h3>
      <p class="text-caption" v-if="frontmatter.author">{{ frontmatter.author }}</p>
      <Content />
    </v-container>
  </div>
</template>

<script setup>
import { useData } from 'vitepress'
const { frontmatter } = useData()
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