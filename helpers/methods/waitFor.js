const debug = require('debug')('webparsy:methods:waitFor')

const parser = require('../parser')

const schema = {
  method: 'waitFor',
  process: async (flags, page, params, html, usingPuppeteer) => {
    if (!usingPuppeteer) throw new Error(`form requires using puppeteer to browse pages`)
    
    if (params.selector) {
      debug(`Waiting for selector "${params.selector}"`)
      await page.waitForSelector(params.selector)
    }
    else if (params.xPath) {
      debug(`Waiting for xPath "${params.xPath}"`)
      await page.waitForXPath(params.xPath, params.options || {})
    }
    else if (params.time) {
      debug(`Waiting for time: ${parseInt(params.time).toString()}`)
      await page.waitFor(parseInt(params.time))
    }
    else if (params.function) {
      debug(`Waiting for function "${params.function.substr(0, 50)}..."`)
      await page.waitForFunction(params.function)
    }
    else {
      throw new Error('Invalid waitFor options')
    }
  }
}

module.exports = schema