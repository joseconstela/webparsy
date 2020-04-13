const debug = require('debug')('webparsy:methods:waitForNavigation')

const schema = {
  method: 'waitForNavigation',
  process: async (flags, page, params, html, usingPuppeteer) => {
    if (!usingPuppeteer) throw new Error(`form requires using puppeteer to browse pages`)
    debug(`Waiting for navigation ${JSON.stringify(params.options || {})}`)
    await page.waitForNavigation(params.options || {})
  }
}

module.exports = schema