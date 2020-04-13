const debug = require('debug')('webparsy:methods:html')

const parser = require('../parser')

const cheerio = require('../cheerio')

const schema = {
  method: 'html',
  process: (flags, page, params, html, usingPuppeteer) => {
    if (!params.selector) {
      debug('Returning HTML without selector')
      return html
    }
    
    let elem = cheerio.load(html)(params.selector || null)

    if (params.parent) {
      debug('Grabbing parent element html')
      elem = elem.parents(params.parent)
    }

    debug('Returning html')
    return elem.html()
  },
  output: (flags, raw, params, url) => {
    return {
      type: 'output',
      data: parser.outputVal(raw, params, 'html', url)
    }
  }
}

module.exports = schema