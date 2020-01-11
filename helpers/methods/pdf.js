const parser = require('../parser')
const cheerio = require('../cheerio')

const schema = {
  method: 'pdf',
  process: async (flags, page, params, html, usingPuppeteer) => {
    if (params.as) {
      let { as, ...pdfOptions } = params
      return await page.pdf(pdfOptions)
    }
    else if (params) {
      await page.pdf(params)
    }
    else {
      throw new Error('incorrect-pdf-options')
    }
  },
  output: (flags, raw, params, url) => {
    if (!params.as) return raw
    return parser.outputVal(raw, Object.assign(params, {
      type: 'buffer'
    }), null, url)
  }
}

module.exports = schema