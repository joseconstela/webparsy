const method = require('../../helpers/methods/form')

describe('method form', () => {
  it('should return correct method name', async function () {
    expect(method.method).toBe('form')
  })

  it('should throw if no puppeteer', async function () {
    const page = {
    }
    try {
      method.process({}, page, {}, null, false)
    }
    catch (Ex) {
      expect(ex).toBeTruthy()
    }
  })

  it('should no evaluate if no fills', async function () {
    const page = {
      click: jest.fn(),
      $x: jest.fn(),
      $eval: jest.fn(),
      evaluate: jest.fn()
    }
    await method.process({}, page, {
      fill: [],
      selector: '#form',
      submit: false
    }, null, true)
    expect(page.evaluate.mock.calls.length).toBe(0)
  })

  it('should fill form and do not submit', async function () {
    const page = {
      click: jest.fn(),
      $x: jest.fn(),
      $eval: jest.fn(),
      evaluate: jest.fn()
    }
    await method.process({}, page, {
      fill: [
        {
          value: 'jon',
          selector: '.username'
        }
      ],
      selector: '#form',
      submit: false
    }, null, true)
    expect(page.evaluate.mock.calls.length).toBe(1)
    expect(page.$eval.mock.calls.length).toBe(0)
  })

  it('should fill form and do not submit', async function () {
    const page = {
      click: jest.fn(),
      $x: jest.fn(),
      $eval: jest.fn(),
      evaluate: jest.fn()
    }
    await method.process({}, page, {
      fill: [
        {
          value: 'jon',
          selector: '.username'
        }
      ],
      selector: '#form',
      submit: true
    }, null, true)
    expect(page.evaluate.mock.calls.length).toBe(1)
    expect(page.$eval.mock.calls.length).toBe(1)
  })
})
