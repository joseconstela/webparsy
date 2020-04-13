const debug = require('debug')('webparsy:methods:keyboardPress')

const schema = {
  method: 'keyboardPress',
  process: async (flags, page, params, html) => {
    const { key, options } = params
    if (!key) throw new Error('incorrect-keyboardPress-options')
    debug('Pressing', key, `${options? JSON.stringify(options) : {}}`)
    await page.keyboard.press(key, options || {})
  }
}

module.exports = schema