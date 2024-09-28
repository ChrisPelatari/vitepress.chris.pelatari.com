---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  tagline: 'professional geek ramblings'
  image:
    src: '/images/IMG_1996.png'
    alt: 'Blue Fenix'
  actions:
    - theme: brand
      text: Latest Post
      link: /posts/2024-09-28-handling-404-in-a-spa-deployed-to-github-pages
    - theme: alt
      text: Archive
      link: /archive

features:
  - title: How it started
    details: w00t! First post!
    link: /posts/2003-02-07-WOOT-FIRST-POST
  - title: How it's going
    details: Handling 404 in a SPA deployed to GitHub Pages
    link: /posts/2024-09-28-handling-404-in-a-spa-deployed-to-github-pages
  - title: How it once was
    details: Andre 3 stacks in NY
    link: /posts/2008-11-22-andre-3-stacks-in-ny
---

<style>
img.VPImage.image-src {
  border-radius: 50%;
}

.VPHero::before {
  content: url('/images/header_transparent.png');
  max-width: 100%;
  height: auto;
}

@media (max-width: 768px) {
  .VPHero::before {
    content: url('/images/header_transparent_mobile.png');
  }
}
</style>
