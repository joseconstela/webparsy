const method = require('../../helpers/methods/click')

const page = {
  click: jest.fn(),
  $x: jest.fn()
}

describe('method click', () => {
  it('should return correct method name', async function () {
    expect(method.method).toBe('click')
  })

  it('should perform with selector', async function () {
    const options = {
      button: '1',
      delay: 123
    }
    await method.process({}, page, {
      selector: '123',
      options
    }, null, null)
    expect(page.click).toHaveBeenCalledWith('123', options)
  })

  it('should perform with xpath', async function () {
    method.process({}, page, {
      xPath: '123'
    }, null, null)
    expect(page.$x).toHaveBeenCalledWith('123')
  })

  it('should perform with default selector', async function () {
    method.process({}, page, '123', null, null)
    expect(page.click).toHaveBeenCalledWith('123')
  })

  it('should throw if no params specified', async function () {
    try {
      await method.process({}, page, {}, null, null)
    }
    catch (ex) {
      expect(ex).toBeTruthy()
      expect(ex.message).toBe('incorrect-click-options')
    }
  })

})
