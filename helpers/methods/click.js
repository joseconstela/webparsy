const debug = require('debug')('webparsy:methods:click')

const schema = {
  method: 'click',
  process: async (flags, page, params, html, usingPuppeteer) => {
    if (!params) throw new Error('incorrect-click-options')
    if (params.selector) {
      const { selector, options } = params
      debug('Clicking selector', selector)
      await page.click(selector, options || {})
    }
    else if (params.xPath) {
      const { xPath, options } = params
      debug('Clicking xPath', xPath)
      const [button] = await page.$x(xPath)
      if (button) await button.click()
    }
    else if (params) {
      debug('Clicking', params)
      await page.click(params)
    }
  }
}

module.exports = schema