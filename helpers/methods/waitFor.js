const parser = require('../parser')

const schema = {
  method: 'waitFor',
  process: async (flags, page, params, html, usingPuppeteer) => {
    if (!usingPuppeteer) throw new Error(`form requires using puppeteer to browse pages`)
    
    if (params.selector) {
      await page.waitForSelector(params.selector)
    }
    else if (params.xPath) {
      await page.waitForXPath(params.xPath, params.options || {})
    }
    else if (params.time) {
      await page.waitFor(parseInt(params.time))
    }
    else if (params.function) {
      await page.waitForFunction(params.function)
    }
    else {
      throw new Error('Invalid waitFor options')
    }
  }
}

module.exports = schema