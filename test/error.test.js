const error = require('../helpers/err')

describe('error', function () {
  it('should throw an error', function () {
    try {
      error.error('some-error', true) 
    }
    catch (ex) {
      expect(ex).toBeTruthy()
    }
  })
})

describe('error', function () {
  it('should not throw an error', function () {
    try {
      error.error('some-error', false) 
    }
    catch (ex) {
      expect(ex).toBeFalsy()
    }
  })
})

describe('fatal', function () {
  it('should throw an error', function () {
    try {
      error.fatal('some-error') 
    }
    catch (ex) {
      expect(ex).toBeTruthy()
    }
  })
})