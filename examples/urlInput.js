'use strict'

/**
 * This example shows how how to input an url from NodeJS into webparsy
 */

const WebParsy = require('../')
const path = require('path')
const fs = require('fs')
const yaml = require('yaml')

const yamlDefinition = fs.readFileSync(
  path.join(process.cwd(), 'examples/urlInput.yml'),
  'utf-8'
)

WebParsy.init({
  yaml: yaml.parse(yamlDefinition),
  flags: {
    url: 'https://google.com'
  }
})
.then(result => {
  console.log('\nScraping result:\n')
  console.log(JSON.stringify({result}, ' ', 2))
})
.catch(ex => {
  console.error(':/', ex)
  process.exit(1)
})