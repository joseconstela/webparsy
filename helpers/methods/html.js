const parser = require('../parser')

const cheerio = require('../cheerio')

const schema = {
  method: 'html',
  process: (flags, page, params, html) => cheerio.html(html, params.selector),
  output: (flags, raw, params, url) => parser.outputVal(raw, params, 'html', url)
}

module.exports = schema