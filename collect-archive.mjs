import fs from 'fs'
import matter from 'gray-matter'
import removeMd from 'remove-markdown'

const posts = fs.readdirSync('./blog/posts')

const data = posts.map((post) => {
  const content = fs.readFileSync(`./blog/posts/${post}`, 'utf-8')
  const { data, content: body } = matter(content)
  return {
    ...data,
    title: data.title,
    date: data.date,
    excerpt: data.excerpt,
    slug: post.replace('.md', ''),
    body: removeMd(body),
  }
})

fs.writeFileSync(
  'blog/posts.json',
  JSON.stringify(data),
  'utf-8'
)
