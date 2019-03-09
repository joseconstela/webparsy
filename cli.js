#!/usr/bin/env node

const program = require('commander')
const package = require('./package.json')
 
program
  .version(package.version)
  .parse(process.argv)
 
if (!program.args[0]) {
  console.log('No definition file specified')
  process.exit(1)
}

program.file = program.args[0]

require('.').init(program)