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
      link: /posts/2024-02-18-the-declaration-of-snugland
    - theme: alt
      text: Archive
      link: /archive

features:
  - title: How it started
    details: w00t! First post!
    link: /posts/2003-02-07-WOOT-FIRST-POST
  - title: How it's going
    details: The Declaration of Snugland
    link: /posts/2024-02-18-the-declaration-of-snugland
  - title: How it's been
    details: Geez, I've been at this for a while...
    link: /archive
---

<style>
img.VPImage.image-src {
  border-radius: 50%;
}

h3 {
  text-align: center;
  margin-top: 1em;
  margin-bottom: 1em;
}

h1 {
  text-align: center;
  margin-top: 1em;
  margin-bottom: 1em;
}

.VPHero::before {
  content: url('/images/header_transparent.png');
}
</style>
