const debug = require('debug')('webparsy:methods:property')

const parser = require('../parser')
const cheerio = require('../cheerio')

const schema = {
  method: 'property',
  process: (flags, page, params, html, usingPuppeteer) => {
    debug('Property for', params.selector, 'as', params.as)
    let elem = cheerio.load(html)(params.selector)
    
    if (params.parent) {
      debug(' ... parent element', params.parent)
      elem = elem.parents(params.parent)
    }

    debug('Grabbing attr', params.property)
    return elem.attr(params.property)
  },
  output: (flags, raw, params, url) => {
    return {
      type: 'output',
      data: parser.outputVal(raw, params, null, url)
    }
  }
}

module.exports = schema