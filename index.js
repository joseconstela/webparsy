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

  // YAML/JSON
  else if (program.yaml || program.json) {
    def = program.yaml || program.json
  }

  // No definition
  else {
    fatal('No definition specified')
  }

  await definition.validate(def)

  const browserOpts = definition.cfg(def, 'main', 'browser') || {}

  let options = {
    args: [
      '--no-sandbox'
    ],
    width: browserOpts.width || 1200,
    height: browserOpts.height || 800,
    scaleFactor: browserOpts.scaleFactor || 1,
    timeout: browserOpts.timeout || 30 * 1000,
    delay: browserOpts.delay || 0,
    headless: browserOpts.headless !== false
  }

  let puppeteer
  if (browserOpts.executablePath) {
    puppeteer = require('puppeteer-core')
    options.executablePath = browserOpts.executablePath
    options.userDataDir = browserOpts.userDataDir
  }
  else {
    puppeteer = require('puppeteer')
  }

  debug(`Puppeteer options ${JSON.stringify(options)}`)

  const browser = await puppeteer.launch(options)
  debug('Browser launched')

  const page = await browser.newPage()
  debug('New page created')

  const defaultSteps = definition.cfg(def, 'main', 'steps')
  debug('Get definition steps')
  try {
    const runSteps = async allSteps => {
      for (singleStep of allSteps) {
        if (singleStep.run) {
          const subSteps = definition.cfg(def, singleStep.run, 'steps')
          await runSteps(subSteps)
        }
        let stepResult = await steps.exec(program.flags, singleStep, page)
        output = Object.assign({}, output, stepResult.result || {})
      }
    }
    await runSteps(defaultSteps)
  }
  catch (ex) {
    error = ex
    exitCode = 5
  }
  finally { // Always gracefylly close the browser
    if (!browserOpts.keepOpen) await browser.close()
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