const parser = require('../parser')

const schema = {
  method: 'url',
  puppeteer: true,
  output: (flags, raw, params, url) => parser.outputVal(raw, params, 'title', url)
}

module.exports = schema