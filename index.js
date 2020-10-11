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
    const runSteps = async (allSteps, taskFlags, isLoop) => {
      for (singleStep of allSteps) {
        if (singleStep.run) {
          const subTask = definition.cfg(def, singleStep.run)
          const subTaskSteps = subTask.steps
          const subTaskLoop = subTask.loop

          if (subTaskLoop) {
            if (!program.flags[subTaskLoop]) throw new Error('loop-undefined')
            console.log('program.flags[subTaskLoop]', program.flags[subTaskLoop])
            for (item of program.flags[subTaskLoop]) {
              await runSteps(subTaskSteps, item, true)
            }
          }
          else {
            await runSteps(subTaskSteps, isLoop)
            continue;
          }
        }

        let stepResult = await steps.exec(taskFlags || program.flags, singleStep, page)
        if (stepResult.result) {
          if (isLoop) {
            console.log(stepResult.result)
          }
          else {
            Object.assign(output, stepResult.result || {})
          }
        }
        else if (stepResult.flag) {
          Object.assign(program.flags, stepResult.flag)
        }
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