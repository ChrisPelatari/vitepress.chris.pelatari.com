// https://vitepress.dev/guide/custom-theme
import { h } from 'vue'
import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import './style.css'
import post from './components/post.vue'
import mastodon from './components/mastodon.vue'
import VPSocialLink from './components/VPSocialLink.vue'
import VPSocialLinks from './components/VPSocialLinks.vue'

export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      // https://vitepress.dev/guide/extending-default-theme#layout-slots
    })
  },
  enhanceApp({ app, router, siteData }) {
    app.component('post', post)
    app.component('mastodon', mastodon)
    app.component('VPSocialLink', VPSocialLink)
    app.component('VPSocialLinks', VPSocialLinks)
  }
} satisfies Theme
