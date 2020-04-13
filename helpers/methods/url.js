const parser = require('../parser')

const schema = {
  method: 'url',
  puppeteer: true,
  output: (flags, raw, params, url) => {
    return {
      type: 'output',
      data: parser.outputVal(raw, params, 'url', url)
    }
  }
}

module.exports = schema