---
title: Archive
---

# Archive

<template>
  <div>
    <h1 class="text-h1">Archive</h1>
    <v-list>
      <v-list-item v-for="entry in posts" :key="entry.id">
        <v-list-item-title>
          <router-link :to="`/posts/${entry.id}`">{{ entry.frontmatter.title }}</router-link>
        </v-list-item-title>
        <v-list-item-subtitle>{{ entry.date }}</v-list-item-subtitle>
      </v-list-item>
    </v-list>
  </div>
</template>

<script setup>
</script>