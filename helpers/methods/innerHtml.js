const debug = require('debug')('webparsy:methods:text')

const parser = require('../parser')

const schema = {
  method: 'innerHtml',
  process: async (flags, page, params, html, usingPuppeteer) => {
    let selector = params
    if (selector.selector) selector = selector.selector
    debug('Getting innerHtml for', selector)
    return await page.$eval(selector, async element => {
      return await element.innerHTML
    })
  },
  output: (flags, raw, params, url) => {
    return {
      type: 'output',
      data: parser.outputVal(raw, params, null, url)
    }
  }
}

module.exports = schema