const parser = require('../parser')
const cheerio = require('../cheerio')

const schema = {
  method: 'property',
  process: (page, params, html) => cheerio.property(html, params.selector, params.property),
  output: (raw, params, url) => parser.outputVal(raw, params, null, url)
}

module.exports = schema