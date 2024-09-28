import fs from 'fs'
import { argv } from 'process'

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
---

`

// Create the file
fs.writeFileSync(fileName, fileContents, 'utf-8')

console.log(`Created file: ${fileName}`)
