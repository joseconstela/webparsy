const debug = require('debug')('webparsy:methods:screenshot')

const parser = require('../parser')
const cheerio = require('../cheerio')

const schema = {
  method: 'screenshot',
  process: async (flags, page, params, html, usingPuppeteer) => {
    if (params.as) {
      debug('Taking screenshot as', params.as)
      return await page.screenshot()
    }
    else if (params.path) {
      debug('Storing screenshot in', params.path)
      return await page.screenshot(params.path)
    }
    else {
      throw new Error('incorrect-screenshot-options')
    }
  },
  output: (flags, raw, params, url) => {
    if (!params.as) return raw
    return {
      type: 'output',
      data: parser.outputVal(raw, Object.assign(params, {
        type: 'buffer'
      }), null, url)
    }
  }
}

module.exports = schema