const program = require('commander')
const package = require('./package.json')
 
program
  .version(package.version)
  .parse(process.argv)
 
if (!program.args[0]) {
  console.log('No definition file specified')
  process.exit(1)
}

program.definitionFile = program.args[0]

require('./webparsy').init(program)