const debug = require('debug')('webparsy:methods:text')

const parser = require('../parser')

const cheerio = require('../cheerio')

const schema = {
  method: 'text',
  process: (flags, page, params, html, usingPuppeteer) => {
    debug('Getting text from element', params.selector)
    let elem = cheerio.load(html)(params.selector || null)

    if (params.parent) {
      debug(' ... parent element', params.parent)
      elem = elem.parents(params.parent)
    }

    debug(' ... property', params.property)
    return elem.text(params.property)
  },
  output: (flags, raw, params, url) => {
    return {
      type: 'output',
      data: parser.outputVal(raw, params, null, url)
    }
  }
}

module.exports = schema