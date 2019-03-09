const parser = require('../parser')

const schema = {
  method: 'title',
  puppeteer: true,
  output: (v, params) => parser.outputVal(v, params, 'title')
}

module.exports = schema