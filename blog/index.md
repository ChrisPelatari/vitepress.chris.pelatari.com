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
      link: /posts/2024-11-10-implementing-stripe-checkout-session-in-aspnet-core-minimal-api
    - theme: alt
      text: Archive
      link: /archive 
features:
  - title: How it started
    details: w00t! First post!
    link: /posts/2003-02-07-WOOT-FIRST-POST
  - title: How it's going
    details: Implementing Stripe Checkout Session in ASP.NET Core Minimal API
    link: /posts/2024-11-10-implementing-stripe-checkout-session-in-aspnet-core-minimal-api
  - title: How it once was
    details: Andre 3 stacks in NY
    link: /posts/2008-11-22-andre-3-stacks-in-ny
  - title: Parsley Pappardelle with Creamy Mushroom Sauce
    details: A delicious pasta dish
    link: /Parsley_Pappardelle_Recipe
  - title: The Menagerie
    details: Some of my favorite critters
    link: /menagerie
  - title: Hire Me
    details: I am available for hire, check out my resume
    link: https://bluefenix.net/Chris_Pelatari_Resume_.docx
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
