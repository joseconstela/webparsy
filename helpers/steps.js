const debug = require('debug')('webparsy:steps')

const got = require('got')

const error = require('./err').error
let methods = require('./methods')

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

let usingPuppeteer = true
let currentPageHtml = ''
let currentPageUrl = ''

const authentication = step => {
  if (step.goto.authentication && step.goto.authentication.type === 'basic') {
    return { username, password } = step.goto.authentication
  }
  return null
}

const getPageHtml = async (step, _html, page) => {
  if (_html) return _html
  
  if (getMethodName(step) === 'goto') {

    // URLs can be passed as:
    // - goto: example.com
    // or
    // - goto:
    //     flag: websiteUrl
    // or
    // - goto:
    //     url: example.com

    const auth = authentication(step)

    const url = step.goto.flag ? flags[step.goto.flag] : step.goto.url ? step.goto.url : step.goto
    currentPageUrl = url

    if (step.goto.method === 'got') {
      usingPuppeteer = false

      // Got authentication?
      let getOptions = {}
      if (auth) {
        getOptions.auth = `${auth.username}:${auth.password}`
      }

      let result = await got.get(step.goto.url, getOptions)
      currentPageHtml = result.body
    }
    else {
      // puppeteer authentication
      if (auth) {
        await page.authenticate({username: auth.username, password: auth.password,waitUntil: 'networkidle0'});
      }

      usingPuppeteer = true
      await page.goto(url)

      currentPageHtml = await page.content()
    }
  }
  else {
    if (usingPuppeteer && currentPageUrl !== page.url()) {
      currentPageHtml = await page.content()
      currentPageUrl = page.url()
    }
  }

  return currentPageHtml
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
    if (!usingPuppeteer) throw new Error(`${methodName} requires using puppeteer to browse pages`)
    raw = parameters ? await page[methodName](parameters) : await page[methodName]()
  } else if (usedMethod.process) {
    let _html = await getPageHtml(step, html, page)
    raw = await usedMethod.process(flags, page, parameters, _html, usingPuppeteer)
  }

  const result = usedMethod.output ? usedMethod.output(flags, raw, parameters, currentPageUrl) : null
  return { raw, result }
}

module.exports.exec = exec
