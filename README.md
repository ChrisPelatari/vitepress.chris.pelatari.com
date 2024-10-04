https://chris.pelatari.com

## step1: create a new post

```bash
$ yarn post "Why do programmers prefer dark mode? Because light attracts bugs!"
```

## step2: edit the new post

### edit the front matter

```yaml
---
layout: post
title: Why do programmers prefer dark mode? Because light attracts bugs!
date: 2024-09-28
categories: [dad_jokes]
author: chrispelatari
---
```

### edit the content

```markdown
Credit where it's due, I found this via [this blog post](https://dev.to/lico/handling-404-error-in-spa-deployed-on-github-pages)
...
```

## step3: run collect-archive.mjs

```bash
yarn archive
```

## step4: add the new post to the home page
TODO: script this

```yaml
---
layout: home
...
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
...
```

## step5: copy the new post to the archive.md at the end of the javascript array
TODO: script this

```javascript
const archive = [
  ...
  ,{
    title: 'Put a nifty title here',
    date: '2024-09-28',
    link: '/posts/2024-09-28-handling-404-in-a-spa-deployed-to-github-pages'
  }
]
```

## step6: correct this guide once you run it again