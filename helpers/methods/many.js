const parser = require('../parser')
const cheerio = require('../cheerio')
const steps = require('../steps')

const runElement = async (flags, page, params, $, elem) => {
  let el = {}
  await Promise.all(params.element.map(async defStep => {
    const elementHtml = $.html(elem)
    const stepResult = await steps.exec(
      flags,
      defStep,
      page,
      elementHtml
    )
    el = Object.assign(el, stepResult.result)
  }))
  return el
}

const schema = {
  method: 'many',
  process: async (flags, page, params, html, usingPuppeteer) => {
    let $ = cheerio.load(html)
    let selectedElements = $(params.selector)
    // let selectedElements = await page.$$(params.selector)
    // const $ = cheerio.load(html)
    
    let elements = []
    await Promise.all($(selectedElements).toArray().map(async elem => {
      let v = await runElement(flags, page, params, $, elem)

      if (params.event) {
        process.emit(params.event, v);
        if (params.eventMethod === 'discard') {
          elements = params.eventMethod
          return
        }
      }

      return elements.push(v)

    }))

    return elements
  },
  output: (flags, raw, params, url) => parser.outputVal(raw, params, null, url)
}

module.exports = schema