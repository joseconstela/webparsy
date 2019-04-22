const parser = require('../parser')

const cheerio = require('../cheerio')

const schema = {
  method: 'text',
  process: (flags, page, params, html, usingPuppeteer) => {
    let elem = cheerio.load(html)(params.selector || null)

    if (params.parent) {
      elem = elem.parents(params.parent)
    }

    return elem.text(params.property)
  },
  output: (flags, raw, params, url) => parser.outputVal(raw, params, null, url)
}

module.exports = schema