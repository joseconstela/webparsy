const debug = require('debug')('webparsy:methods:screenshot')

const parser = require('../parser')
const cheerio = require('../cheerio')

const schema = {
  method: 'screenshot',
  process: async (flags, page, params, html, usingPuppeteer) => {
    if (!params.path && !params.as)
      throw new Error('screenshot requires `as` or `path` parameter')

    if (params.path) {
      const { path, ...options } = params
      if (!options) options = {}
      if (path.flag) options.path = flags[path.flag]
      else options.path = path
      await page.screenshot(options)
    }

    if (params.as) {
      const { as, ...options } = params
      delete options.path
      debug('Taking screenshot as', params.as)
      return await page.screenshot(options || {})
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