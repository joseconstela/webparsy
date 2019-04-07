const parser = require('../parser')
const cheerio = require('../cheerio')

const schema = {
  method: 'property',
  process: (flags, page, params, html) => {
    let elem = cheerio.load(html)(params.selector || null)

    if (params.parent) {
      elem = elem.parents(params.parent)
    }

    return elem.attr(params.property)
  },
  output: (flags, raw, params, url) => parser.outputVal(raw, params, null, url)
}

module.exports = schema