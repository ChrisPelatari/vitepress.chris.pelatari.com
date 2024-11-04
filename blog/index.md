---
layout: home

hero:
  tagline: 'professional geek ramblings'
  image:
    src: '/images/IMG_1996.png'
    alt: 'Chris Pelatari | Blue Fenix Productions'
  actions:
    - theme: brand
      text: Latest Post
      link: /posts/2024-10-04-why-do-programmers-prefer-dark-mode
    - theme: alt
      text: Archive
      link: /archive 
features:
  - title: How it started
    details: w00t! First post!
    link: /posts/2003-02-07-WOOT-FIRST-POST
  - title: How it's going
    details: Why do programmers prefer dark mode? Because light attracts bugs
    link: /posts/2024-10-04-why-do-programmers-prefer-dark-mode
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
