const method = require('../../helpers/methods/html')

const cheerio = require('../../helpers/cheerio')

describe('method html', () => {
  it('should return correct method name', async function () {
    expect(method.method).toBe('html')
  })

  it('should return html without processing', async function () {
    const html = '<a>'
    let result = await method.process(null, null, {}, html, false)
    expect(result).toBe('<a>')
  })

  // TODO add cheerio jest mocking
  // it('should return html without processing', async function () {
  //   const html = '<a>'
  //   let result = await method.process(null, null, {
  //     selector: '123',
  //     parent: '.parent'
  //   }, html, false)
  //   expect(cheerio.load.mock.calls.length).toBe(1)
  //   expect(result).toBe('<a>')
  // })

  it('should output correct format', async function () {
    let result = method.output({}, '<a href=""></a>', {
      selector: 'a',
      as: 'link'
    }, 'https://example.com')
    expect(result).toMatchObject({
      type: 'output',
      data: {
        link: '<a href=""></a>'
      }
    })
  })
})
