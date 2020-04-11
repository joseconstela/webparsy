const debug = require('debug')('webparsy:methods:click')

const schema = {
  method: 'click',
  process: async (flags, page, params, html, usingPuppeteer) => {
    if (params.selector) {
      debug('Clicking selector', params.selector)
      await page.click(params.selector)
    }
    else if (params.xPath) {
      debug('Clicking xPath', params.xPath)
      const [button] = await page.$x(params.xPath)
      if (button) {
          await button.click()
      }
    }
    else if (params) {
      debug('Clicking', params)
      await page.click(params)
    }
    else {
      throw new Error('incorrect-click-options')
    }
  }
}

module.exports = schema