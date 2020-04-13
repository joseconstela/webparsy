const parser = require('../parser')

const schema = {
  method: 'title',
  puppeteer: true,
  output: (flags, raw, params, url) => {
    return {
      type: 'output',
      data: parser.outputVal(raw, params, 'title', url)
    }
  }
}

module.exports = schema