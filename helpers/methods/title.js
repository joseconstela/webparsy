const parser = require('../parser')

const schema = {
  method: 'title',
  puppeteer: true,
  output: (raw, params, url) => parser.outputVal(raw, params, 'title', url)
}

module.exports = schema