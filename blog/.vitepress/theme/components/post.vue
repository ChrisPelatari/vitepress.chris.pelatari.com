<template>
  <div class="VPPage">
    <v-container>
      <h3 class="text-h3">{{ frontmatter.title }}</h3>
      <p class="text-overline">{{ date.format(new Date(page.filePath.split('/').pop().slice(0, 11)), 'MMMM DD, YYYY') }}</p>
      <p class="text-caption" v-if="frontmatter.permalink">{{ frontmatter.permalink }}</p>
      <Content />
    </v-container>
  </div>
</template>

<script setup>
import { useData } from 'vitepress'
import date from 'date-and-time'
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

/* only limit img size on large screens */
@media (min-width: 800px) {
  img {
    max-width: 80%;
    margin: 0 auto;
  }
}
</style>