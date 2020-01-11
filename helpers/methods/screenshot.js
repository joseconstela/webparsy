const parser = require('../parser')
const cheerio = require('../cheerio')

const schema = {
  method: 'screenshot',
  process: async (flags, page, params, html, usingPuppeteer) => {
    if (params.as) {
      return await page.screenshot()
    }
    else if (params.path) {
      await page.screenshot(params.path)
    }
    else {
      throw new Error('incorrect-screenshot-options')
    }
  },
  output: (flags, raw, params, url) => {
    return parser.outputVal(raw, Object.assign(params, {
      type: 'buffer'
    }), null, url)
  }
}

module.exports = schema