const method = require('../../helpers/methods/goto')

describe('method click', () => {
  it('should return correct method name', async function () {
    expect(method.method).toBe('goto')
  })

  it('should return null', async function () {
    expect(method.process()).toBe(null)
  })
})
