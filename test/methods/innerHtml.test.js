const method = require('../../helpers/methods/innerHtml')

describe('method innerHtml', () => {
  it('should return correct method name', async function () {
    expect(method.method).toBe('innerHtml')
  })

  it('should return html without processing', async function () {
    const page = {
      $eval: jest.fn()
    }

    const html = '<a>'
    let result = await method.process(null, page, {
      selector: '.element'
    }, html, false)
    expect(page.$eval.mock.calls.length).toBe(1)
    expect(page.$eval.mock.calls[0][0]).toBe('.element')
  })

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
