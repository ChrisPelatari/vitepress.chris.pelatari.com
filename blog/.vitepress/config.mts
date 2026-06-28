import { defineConfig, createContentLoader, type SiteConfig } from 'vitepress'
import path from 'path'
import fs from 'fs'
import { Feed } from 'feed'
import { fileURLToPath, URL } from 'node:url'
import { parse } from 'node-html-parser'
import version from '../../package.json'

const hostname: string = 'https://chris.pelatari.com'

const slug = (p: string) =>
  p.replace(/^\//, '').replace(/\.(md|html)$/i, '').replace(/\/index$/i, '').replace(/\/$/, '')

// Syndicated content needs absolute URLs; VitePress emits root-relative /assets (hashed) and /images
// (public). Targeted so external (http) and protocol-relative (//) URLs are left untouched.
const absolutize = (h: string) =>
  h.replaceAll('"/assets/', `"${hostname}/assets/`).replaceAll('"/images/', `"${hostname}/images/`)

// Each post's whole rendered page, captured from VitePress's OWN render (see transformHtml) -- so its
// <img src> are the Vite-hashed URLs the browser gets, not createContentLoader's pre-bundle source
// paths (two render engines were the disconnect). ctx.content is the entire page (nav/footer/search),
// so we extract just the article: the post component's own root (.VPPage, from theme/components/
// post.vue), minus its title/date/permalink meta. One render, one semantic selector -- no second
// markdown pass, no asset correlation.
const renderedPages = new Map<string, string>()
const articleFrom = (rendered: string): string | null => {
  const page = parse(rendered).querySelector('.VPPage')
  if (!page) return null
  page.querySelectorAll('.text-h3, .text-overline, .text-caption').forEach((e) => e.remove())
  return page.innerHTML
}

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
  // Capture each post's rendered page from VitePress's own render (asset URLs already Vite-hashed);
  // the article is pulled out of it in buildEnd. Reading ctx only, no mutation.
  transformHtml(_code, _id, ctx) {
    const rel = ctx.pageData.relativePath
    if (rel.startsWith('posts/') && ctx.content) renderedPages.set(slug(rel), ctx.content)
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
      const article = articleFrom(renderedPages.get(slug(url)) ?? '')

      feed.addItem({
        title: frontmatter.title,
        id: `${hostname}${url}`,
        link: `${hostname}${url}`,
        description: excerpt,
        // The article extracted from VitePress's own rendered page (Vite-hashed img URLs), absolutized;
        // fall back to the markdown-it render only if a post wasn't captured / had no .VPPage.
        content: article ? absolutize(article) : html,
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
