

<script lang="ts" setup>
import VPSocialLink from './VPSocialLink.vue'
import type { DefaultTheme } from 'vitepress/theme'

interface SocialLink extends DefaultTheme.SocialLink {
  rel: string
}

defineProps<{
  links: SocialLink[]
}>()
</script>

<template>
  <div class="VPSocialLinks">
    <VPSocialLink
      v-for="{ link, icon, ariaLabel, rel } in links"
      :key="link"
      :icon="icon"
      :link="link"
      :ariaLabel="ariaLabel"
      :rel="rel"
    />
  </div>
</template>

<style scoped>
.VPSocialLinks {
  display: flex;
  justify-content: center;
}
</style>
