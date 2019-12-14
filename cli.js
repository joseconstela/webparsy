#!/usr/bin/env node
'use strict'

const printHelp = () => console.log(`Usage
  $ webparsy <yaml file>`)

let node, webparsy, file, flags = {}
node = process.argv[0]
webparsy = process.argv[1]
file = process.argv[2]

if (!file) return printHelp()

process.argv.slice(3).map((a, i) => {
  let next = process.argv[3+i+1]
  if (a.startsWith('--')) {
    if (next.startsWith('--')) throw new Error('Invalid argument')
    flags[a.replace('--', '')] = next
  }
})

require('.').init({
  file,
  flags,
  cli: true
})
