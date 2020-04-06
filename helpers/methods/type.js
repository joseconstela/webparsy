const schema = {
  method: 'type',
  process: async (flags, page, params, html, usingPuppeteer) => {
    const { selector, text, options } = params
    if (!selector || !text) throw new Error('incorrect-type-options')
    await page.type(selector, text.toString(), options || {})
  }
}

module.exports = schema