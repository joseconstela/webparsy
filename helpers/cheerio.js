const cheerio = require('cheerio')

const load = (html) => cheerio.load(html)

module.exports.text = (html, selector) => typeof (html === 'string') ?
    load(html)(selector || null).text() :
    cheerio(selector || null).text()

module.exports.html = (html, selector) => {
  // Get full page html
  if (!selector && typeof html === 'string') return html

  // Get element html
  return typeof (html === 'string') ?
  load(html)(selector || null).html() :
  cheerio(selector || null).html()
}