#!/usr/bin/env node
'use strict'

const meow = require('meow')
 
const cli = meow(`
    Usage
      $ webparsy <yaml file>
`, {
    
})

require('.').init({
  file: cli.input[0],
  flags: cli.flags,
  cli: true
})