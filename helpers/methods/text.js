const parser = require('../parser')

const cheerio = require('../cheerio')

const schema = {
  method: 'text',
  process: (flags, page, params, html) => cheerio.text(html, params.selector),
  output: (flags, raw, params, url) => parser.outputVal(raw, params, null, url)
}

module.exports = schema