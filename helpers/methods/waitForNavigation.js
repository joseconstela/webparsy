const schema = {
  method: 'waitForNavigation',
  process: async (flags, page, params, html, usingPuppeteer) => {
    if (!usingPuppeteer) throw new Error(`form requires using puppeteer to browse pages`)
    await page.waitForNavigation(params.options || {})
  }
}

module.exports = schema