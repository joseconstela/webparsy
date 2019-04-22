const parser = require('../parser')

const cheerio = require('../cheerio')
const steps = require('../steps')

const runElement = async (flags, page, $, params, elem) => {
  let el = {}
  await Promise.all(params.element.map(async defStep => {
    const elementHtml = await page.evaluate(el => el.outerHTML, elem)
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
  process: async (flags, page, params, html) => {
    let selectedElements = await page.$$(params.selector)
    // const $ = cheerio.load(html)

    let elements = []
    await Promise.all(selectedElements.map(async elem => {
      let v = await runElement(flags, page, null, params, elem)
      return elements.push(v)
    }))

    return elements
  },
  output: (flags, raw, params, url) => parser.outputVal(raw, params, null, url)
}

module.exports = schema