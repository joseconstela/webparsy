const debug = require('debug')('webparsy:methods:listUrls')

const parser = require('../parser')
const cheerio = require('../cheerio')
const steps = require('../steps')

const runElement = async (flags, page, params, $, elem) => {
  const elementHtml = $.html(elem)
  const stepResult = await steps.exec(
    flags,
    {property:params.element},
    page,
    elementHtml
  )
  return stepResult.result
}

const schema = {
  method: 'listUrls',
  process: async (flags, page, params, html, usingPuppeteer) => {
    debug('Listing urls...')
    let $ = cheerio.load(html)

    debug('Selector:', params.selector)
    let selectedElements = $(params.selector)
    // let selectedElements = await page.$$(params.selector)
    // const $ = cheerio.load(html)
    
    let elements = []
    await Promise.all($(selectedElements).toArray().map(async elem => {
      let v = await runElement(flags, page, params, $, elem)
      return elements.push(v)
    }))
    
    return elements
  },
  output: (flags, raw, params, url) => {
    debug('RAW result', JSON.stringify(raw))

    // Build list of urls without null / undefined / false elements
    let validRawList = []
    raw.map(item => { if (!!item[params.element.as]) validRawList.push(item) })
    debug('Result    ', JSON.stringify(validRawList))

    return {
      type: 'flag',
      data: parser.outputVal(validRawList, params, null, url)
    }
  }
}

module.exports = schema