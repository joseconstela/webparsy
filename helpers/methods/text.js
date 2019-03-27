const parser = require('../parser')

const cheerio = require('../cheerio')

const schema = {
  method: 'text',
  process: (page, params, html) => {
    return cheerio.text(html, params.selector)
  },
  output: (raw, params) => parser.outputVal(raw, params)
}

module.exports = schema