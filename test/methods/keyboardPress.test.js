const method = require('../../helpers/methods/keyboardPress')

describe('method keyboardPress', () => {
  it('should return correct method name', async function () {
    expect(method.method).toBe('keyboardPress')
  })

  it('should call keyboard press', async function () {
    const page = {
      keyboard: {
        press: jest.fn()
      }
    }

    await method.process(null, page, {
      key: 'ENTER',
      options: {
        delay: 1000
      }
    }, 'html', false)
    expect(page.keyboard.press.mock.calls.length).toBe(1)
    expect(page.keyboard.press).toHaveBeenCalledWith('ENTER', {
      delay: 1000
    })
  })

  it('should throw if no key', async function () {
    try {
      await method.process(null, page, {
        options: {
          delay: 1000
        }
      }, '', false)
    } catch (ex) {
      expect(ex).toBeTruthy()
    }
  })
})
