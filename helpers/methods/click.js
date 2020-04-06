const schema = {
  method: 'click',
  process: async (flags, page, params, html, usingPuppeteer) => {
    if (params.selector) {
      await page.click(params.selector)
    }
    else if (params.xPath) {
      const [button] = await page.$x(params.xPath)
      if (button) {
          await button.click()
      }
      await page.click(params.selector)
    }
    else if (params) {
      await page.click(params)
    }
    else {
      throw new Error('incorrect-click-options')
    }
  }
}

module.exports = schema