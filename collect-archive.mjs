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
    description: data.description ? data.description : removeMd(body).slice(0, 150),
    slug: post.replace('.md', ''),
  }
})

// Remove the last element of the array, which is undefined/null
let postsOnly = data.slice(0, data.length - 1)

fs.writeFileSync(
  'blog/posts.json',
  JSON.stringify(postsOnly),
  'utf-8'
)
