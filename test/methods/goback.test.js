const method = require('../../helpers/methods/goBack')

describe('method click', () => {
  it('should return correct method name', async function () {
    expect(method.method).toBe('goBack')
  })

  it('should return correct puppeteer property', async function () {
    expect(method.puppeteer).toBe(true)
  })
})
