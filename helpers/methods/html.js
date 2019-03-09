const parser = require('../parser')

const cheerio = require('../cheerio')

const schema = {
  method: 'html',
  process: (page, params, html) => cheerio.html(html, params.selector),
  output: (raw, params) => parser.outputVal(raw, params, 'html')
}

module.exports = schema