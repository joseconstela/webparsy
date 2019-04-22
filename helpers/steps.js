const debug = require('debug')('webparsy:steps')

const error = require('./err').error
const methods = require('./methods')

/**
 * Given an step details, return webparsy's method name.
 * 
 * For example: `{ goto: { url: 'http://example.com', method: 'get' } }` 
 * will return `goto`
 * 
 * @param {Object} step 
 * @returns String
 */
const getMethodName = (step) => {
  return typeof step !== 'string' ? Object.keys(step)[0] : step
}

/**
 * @param {object} flags 
 * @param {object} step 
 * @param {object} page 
 * @param {string} html 
 */
const exec = async (flags, step, page, html) => {
  debug('----------------------------')
  debug(`Exec ${JSON.stringify(step)}`)

  // Raw response from 
  let raw

  let methodName = getMethodName(step)
  debug(`Method name ${methodName}`)

  const usedMethod = methods[methodName]

  if (!usedMethod) {
    error(`Step method ${methodName} not supported`, true, 5)
  }

  debug(`Method ${JSON.stringify(usedMethod)}`)
  debug(`puppeteer ${!!usedMethod.puppeteer}`)
  debug(`process ${!!usedMethod.process}`)

  let parameters = step[methodName] || {}
  debug(`Parameters ${JSON.stringify(parameters)}`)
  
  if (usedMethod.puppeteer) {
    raw = parameters ? await page[methodName](parameters) : await page[methodName]()
  } else if (usedMethod.process) {
    let _html = html || await page.content()
    raw = await usedMethod.process(flags, page, parameters, _html)
  }

  const url = await page.url()
  const result = usedMethod.output ? usedMethod.output(flags, raw, parameters, url) : null
  return { raw, result }
}

module.exports.exec = exec