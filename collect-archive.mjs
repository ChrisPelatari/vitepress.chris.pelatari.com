import fs from 'fs'
import matter from 'gray-matter'
import removeMd from 'remove-markdown'

const posts = fs.readdirSync('./blog/posts/')

const data = posts.map((post) => {
  console.log(post)
  if (post === 'images') return

  const content = fs.readFileSync(`./blog/posts/${post}`, 'utf-8')
  const { data, content: body } = matter(content)
  return {
    title: data.title ? data.title : post.slice(10).replace('.md', ''),
    date: data.date,
    excerpt: data.excerpt,
    description: data.description
      ? data.description
      : removeMd(body).slice(0, 150),
    slug: post.replace('.md', ''),
  }
})

// Remove the last element of the array, which is undefined/null
let postsOnly = data.slice(0, data.length - 1)

// get the last post in the array
const lastPost = data[data.length - 2]

// get the last post's slug
const lastPostSlug = lastPost.slug

// get the last post's title
const lastPostTitle = lastPost.title

// add these values to /blog/index.md in the correct position
const index = fs.readFileSync('./blog/index.md', 'utf-8')

// write the updated front matter to the index.md file
const updatedIndex = `---
layout: home

hero:
  tagline: 'professional geek ramblings'
  image:
    src: '/images/IMG_1996.png'
    alt: 'Chris Pelatari | Blue Fenix Productions'
  actions:
    - theme: brand
      text: Latest Post
      link: /posts/${lastPostSlug}
    - theme: alt
      text: Archive
      link: /archive 
features:
  - title: How it started
    details: w00t! First post!
    link: /posts/2003-02-07-WOOT-FIRST-POST
  - title: How it's going
    details: ${lastPostTitle}
    link: /posts/${lastPostSlug}
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
`

fs.writeFileSync('./blog/index.md', updatedIndex, 'utf-8')

// write the updated posts.json file
fs.writeFileSync('blog/posts.json', JSON.stringify(postsOnly), 'utf-8')

// Read the existing archive.md file
const archivePath = './blog/archive.md'
let archiveContent = fs.readFileSync(archivePath, 'utf-8')

// Read and parse the posts.json file
const postsPath = './blog/posts.json'
const postsContent = JSON.parse(fs.readFileSync(postsPath, 'utf-8'))

// Convert posts array to JSON string
const postsJsonString = JSON.stringify(postsContent, null, 2)

// Replace the content of the posts constant within the <script setup> tag
archiveContent = archiveContent.replace(
  /const posts = \[.*?\];/s,
  `const posts = ${postsJsonString};`
)

// Write the updated content back to archive.md
fs.writeFileSync(archivePath, archiveContent, 'utf-8')

console.log('Archive updated!')
