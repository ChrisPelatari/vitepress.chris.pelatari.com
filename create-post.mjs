import fs from 'fs'
import { argv } from 'process'
import { exec } from 'child_process'

// Get the title from the command line arguments
const title = argv[2]

// If no title is provided, use 'untitled' as the title
if (!title) {
  title = 'untitled'
}

// Replace any spaces with -
var formattedTitle = title.replace(/\s/g, '-')

// ensure the title is in lowercase
formattedTitle = formattedTitle.toLowerCase()

// ensure the title is URL friendly
formattedTitle = encodeURIComponent(formattedTitle)

// Get the current date
const currentDate = new Date().toISOString().split('T')[0]

// Generate the file name
const fileName = `${currentDate}-${formattedTitle}.md`

// create the contents of the file with the front matter
const fileContents = `---
  layout: post
  title: ${title}
  date: ${currentDate}
  categories: []
  author: chrispelatari
  excerpt:
---

# ${title}
`
// change to the blog directory
process.chdir('blog')

// change to the posts directory
process.chdir('posts')

// Create the file
fs.writeFileSync(fileName, fileContents, 'utf-8')

console.log(`Created file: ${fileName}`)

console.log('Opening the file in the default editor...')

// open the file in the default editor
exec(`code ${fileName}`)
