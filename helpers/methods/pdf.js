const debug = require('debug')('webparsy:methods:pdf')

const parser = require('../parser')
const cheerio = require('../cheerio')

const schema = {
  method: 'pdf',
  process: async (flags, page, params, html, usingPuppeteer) => {
    if (!params.path && !params.as)
      throw new Error('pdf requires `as` or `path` parameter')

    if (params.path) {
      const { path, ...options } = params
      if (!options) options = {}
      if (path.flag) options.path = flags[path.flag]
      else options.path = path
      debug('String PDF in', options.path)
      await page.pdf(options)
    }

    if (params.as) {
      const { as, ...options } = params
      delete options.path
      debug('Creating PDF as', params.as)
      return await page.pdf(options || {})
    }
  },
  output: (flags, raw, params, url) => {
    if (!params.as) return raw
    return {
      type: 'output',
      data: parser.outputVal(raw, Object.assign(params, {
        type: 'buffer'
      }), null, url)
    }
  }
}

module.exports = schema