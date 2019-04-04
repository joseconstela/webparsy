const parser = require('../parser')

const schema = {
  method: 'title',
  puppeteer: true,
  output: (flags, raw, params, url) => parser.outputVal(raw, params, 'title', url)
}

module.exports = schema