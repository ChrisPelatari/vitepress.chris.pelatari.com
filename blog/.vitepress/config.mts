import { defineConfig, createContentLoader, type SiteConfig } from 'vitepress'
import path from 'path'
import fs from 'fs'
import { Feed } from 'feed'
import { fileURLToPath, URL } from 'node:url'
import version from '../../package.json'

const hostname: string = 'https://chris.pelatari.com'

// Per-post, asset-resolved render captured from VitePress's own transform (see transformHtml below).
// createContentLoader renders with markdown-it BEFORE Vite hashes assets, so its <img src> are raw
// source paths (./images/foo.png) that 404 against the hashed build output (/assets/foo.HASH.png).
// The site pages get the hashed URLs; the feed didn't -- two render engines, one disconnect. Capturing
// the page's resolved content here gives the feed the same URLs the browser gets.
const renderedPosts = new Map<string, string>()
const slug = (p: string) =>
  p.replace(/^\//, '').replace(/\.(md|html)$/i, '').replace(/\/index$/i, '').replace(/\/$/, '')
// Syndicated content should use absolute URLs: the page render emits root-relative /assets (hashed)
// and /images (public) paths, which a standalone reader would resolve against its own host. Targeted
// so external absolute URLs and protocol-relative (//) paths are left untouched.
const absolutize = (h: string) =>
  h.replaceAll('"/assets/', `"${hostname}/assets/`).replaceAll('"/images/', `"${hostname}/images/`)

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'Blue Fenix',
  description: 'professional geek tales and insights',
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: `${hostname}/images/apple-touch-icon.png`,
    siteTitle: false,
    footer: {
      message: `💾 May the source be with you. [v${version.version}]`,
      copyright: `[Copyright © 2003 - ${new Date().getFullYear()}]
 [Chris Pelatari]`,
    },
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Archive', link: '/archive' },
      { text: 'Meditations', link: '/meditations' },
      { text: 'About', link: '/about' },
    ],

    sidebar: [],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/ChrisPelatari' },
      { icon: 'mastodon', link: 'https://hachyderm.io/@blue_fenix' },
      {
        icon: {
          svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path fill="#e78130" d="M64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H64zM96 136c0-13.3 10.7-24 24-24c137 0 248 111 248 248c0 13.3-10.7 24-24 24s-24-10.7-24-24c0-110.5-89.5-200-200-200c-13.3 0-24-10.7-24-24zm0 96c0-13.3 10.7-24 24-24c83.9 0 152 68.1 152 152c0 13.3-10.7 24-24 24s-24-10.7-24-24c0-57.4-46.6-104-104-104c-13.3 0-24-10.7-24-24zm0 120a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z"/></svg>',
        },
        link: '/feed.xml',
      },
    ],
  },
  head: [
    ['link', { rel: 'icon', href: `${hostname}/favicon.ico` }],
    ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
    [
      'link',
      { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
    ],
    [
      'link',
      {
        href: 'https://fonts.googleapis.com/css2?family=Roboto&display=swap',
        rel: 'stylesheet',
      },
    ],
  ],
  ignoreDeadLinks: true,
  cleanUrls: true,
  srcExclude: ['**/README.md', '**/TODO.md', '**/drafts/**'],
  appearance: 'dark',
  // Capture each post's final, asset-resolved content (img src already Vite-hashed) so the feed can
  // reuse the site's own render instead of re-rendering with markdown-it. Reading ctx only -- no mutation.
  transformHtml(_code, _id, ctx) {
    const rel = ctx.pageData.relativePath
    if (rel.startsWith('posts/') && ctx.content) renderedPosts.set(slug(rel), ctx.content)
  },
  buildEnd: async (config: SiteConfig) => {
    const feed = new Feed({
      title: 'Blue Fenix Productions',
      description: 'professional geek ramblings',
      id: hostname,
      link: `${hostname}/about`,
      language: 'en',
      image: `${hostname}/images/IMG_1996.png`,
      favicon: `${hostname}/favicon.ico`,
      feedLinks: {
        rss: `${hostname}/feed.xml`,
      },
      copyright: 'Copyright © 2003 - present, Chris Pelatari',
    })

    // Load all the posts
    const posts = await createContentLoader('./posts/*.md', {
      excerpt: true,
      render: true,
    }).load()

    // sort the posts
    posts.sort((a, b) => {
      return a.frontmatter.date < b.frontmatter.date ? 1 : -1
    })

    for (const { url, excerpt, frontmatter, html } of posts) {
      //get the date from the file name - all of them are in the format YYYY-MM-DD-title.md
      // @ts-ignore: Object is possibly 'undefined'
      const date = new Date(url.split('/').pop().slice(0, 10))
      const resolved = renderedPosts.get(slug(url))

      feed.addItem({
        title: frontmatter.title,
        id: `${hostname}${url}`,
        link: `${hostname}${url}`,
        description: excerpt,
        // The site's asset-resolved render (hashed img URLs), absolutized; fall back to the markdown-it
        // render only if a post somehow wasn't captured by transformHtml.
        content: resolved ? absolutize(resolved) : html,
        author: [
          {
            name: 'Chris Pelatari',
            email: 'chris@bluefenix.net',
            link: `${hostname}`,
          },
        ],
        date: date,
      })
    }

    fs.writeFileSync(path.join(config.outDir, 'feed.xml'), feed.rss2())
  },
  vite: {
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./', import.meta.url)),
        fs: 'node:fs',
      },
    },
  },
})
