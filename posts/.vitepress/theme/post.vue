<template>
  <div>
    <h1>{{ page.title }}</h1>
    <p>{{ page.date }}</p>
    <div v-html="page.content" />
  </div>
</template>

<script setup>
import { page } from 'vitepress'
</script>