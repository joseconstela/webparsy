const parser = require('../parser')

const cheerio = require('../cheerio')
const steps = require('../steps')

const runElement = (page, $, params, elem) => {
  let el = {}
  params.element.map(async defStep => {
    const elementHtml = $(elem).html()
    const stepResult = await steps.exec(defStep, page, elementHtml)
    el = Object.assign(el, stepResult.result)
    console.log({el})
  })
  console.log({el})
  return el
}

const schema = {
  method: 'many',
  process: async (page, params, html) => {
    const $ = cheerio.load(html)

    let elements = []
    
    await $(params.selector).each(async (i, elem) => {
      const getElement = async () => {
        return await runElement(page, $, params, elem)
      }
      let el = await getElement()
      elements.push(el)
    })

    console.log('1')
    console.log({elements})

    return elements

    return;
    // return cheerio.html(html, params.selector)
  }
}

module.exports = schema