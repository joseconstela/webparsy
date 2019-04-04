const puppeteer = require('puppeteer')
const debug = require('debug')('webparsy')

const definition = require('./helpers/definition')
const steps = require('./helpers/steps')
const fatal = require('./helpers/err').fatal

// Host a copy of the definition file parsed using yaml's module
let def = null

/**
 * Initialize the webparsy!
 * 
 * @param {Object} program Commander's original object
 */
const init = async (program) => {
  let error
  let exitCode = 0

  let output = {}
  // Get definition

  // File path specified from the cli
  if (program.file) {
    def = await definition.loadFile(program.file)
  }

  // YAML string
  else if (program.string) {
    def = await definition.loadString(program.string)
  }

  // YAML
  else if (program.yaml) {
    def = program.yaml
  }


  // No definition
  else {
    fatal('No definition specified')
  }

  await definition.validate(def)

  const browserOpts = definition.cfg(def, 'main', 'browser') || {}

  const options = {
    args: ['--no-sandbox'],
    width: browserOpts.width || 1200,
    height: browserOpts.height || 800,
    scaleFactor: browserOpts.scaleFactor || 1,
    timeout: browserOpts.timeout || 30 * 1000,
    delay: browserOpts.delay || 0
  }

  debug(`Puppeteer options ${JSON.stringify(options)}`)

  const browser = await puppeteer.launch(options)
  debug('Browser launched')

  const page = await browser.newPage()
  debug('New page created')

  const defSteps = definition.cfg(def, 'main', 'steps')
  debug('Get definition steps')
  try {
    for (defStep of defSteps) {
      let stepResult = await steps.exec(program.flags, defStep, page)
      output = Object.assign({}, output, stepResult.result || {})
    }
  }
  catch (ex) {
    error = ex
    exitCode = 5
  }
  finally { // Always gracefylly close the browser
    await browser.close()
  }

  if (exitCode) {
    fatal(error)
  }

  if (program.cli) {
    console.log(JSON.stringify(output, ' ', 2))
  }
  else {
    return output
  }
}

module.exports.init = init