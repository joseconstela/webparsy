const debug = require('debug')('webparsy:steps')

const error = require('./err').error
const methods = require('./methods')

/**
 * @param {object} step 
 * @param {object} page 
 * @param {string} html 
 */
const exec = async (step, page, html) => {
  debug('----------------------------')
  debug(`Exec ${JSON.stringify(step)}`)

  // Raw response from 
  let raw

  let methodName = step
  if (typeof step !== 'string') {
    methodName = Object.keys(step)[0]
  }

  debug(`Method name ${methodName}`)

  const usedMethod = methods[methodName]

  if (!usedMethod) {
    error(`Step method ${methodName} not supported`, true, 5)
  }

  debug(`Method ${JSON.stringify(usedMethod)}`)
  debug(`puppeteer ${!!usedMethod.puppeteer}`)
  debug(`process ${!!usedMethod.process}`)

  let parameters = step[methodName]
  debug(`Parameters ${JSON.stringify(parameters)}`)
  
  if (usedMethod.puppeteer) {
    raw = parameters ? await page[methodName](parameters || {}) : await page[methodName]()
  } else if (usedMethod.process) {
    let _html = html || await page.content()
    raw = await usedMethod.process(page, parameters || {}, _html)
  }
  const result = usedMethod.output ? usedMethod.output(raw, parameters || {}) : null
  return { raw, result }
}

module.exports.exec = exec