const expect = require('chai').expect

const parser = require('../helpers/parser')

describe('parser', function () {
  describe('cast', function () {
    let defaultVal = 'default value'
    it('should return default value from emptry string', function () {
      let v = parser.cast('', 'string', defaultVal) 
      expect(v).to.equal('default value')
    })

    it('should return default value from null', function () {
      let v = parser.cast(null, 'string', defaultVal) 
      expect(v).to.equal('default value')
    })

    it('should return number from string', function () {
      let v = parser.cast('1', 'number') 
      expect(v).to.equal(1)
    })

    it('should return number from mixed string', function () {
      let v = parser.cast('1a', 'number') 
      expect(v).to.equal(1)
    })

    it('should return float from string', function () {
      let v = parser.cast('1.1', 'float') 
      expect(v).to.equal(1.1)
    })

    it('should return float from mixed string', function () {
      let v = parser.cast('1.1a', 'float') 
      expect(v).to.equal(1.1)
    })

    it('should return integer from mixed string as float', function () {
      let v = parser.cast('1.1a', 'integer') 
      expect(v).to.equal(1)
    })

    it('should return float from string with comma for thousands', function () {
      let v = parser.cast('1,123,123.123', 'fcd') 
      expect(v).to.equal(1123123.123)
    })

    it('should return float from string with dot for thousands', function () {
      let v = parser.cast('1.123.123,123', 'fdc') 
      expect(v).to.equal(1123123.123)
    })
  })

  describe('transform', function () {
    it('should return uppercase emptry string', function () {
      let v = parser.transform('', 'uppercase') 
      expect(v).to.equal('')
    })

    it('should return uppercase string', function () {
      let v = parser.transform('hello', 'uppercase') 
      expect(v).to.equal('HELLO')
    })

    it('should return lowercase string', function () {
      let v = parser.transform('HELLO', 'lowercase') 
      expect(v).to.equal('hello')
    })
  })

  describe('outputVal', function () {
    it('should return correct object', function () {
      let v = parser.outputVal('hello', {as:'greeting'}) 
      expect(v).to.deep.equal({greeting:'hello'})
    })

    it('should return correct casted object', function () {
      let v = parser.outputVal('3.3', {as:'number', type: 'float'}) 
      expect(v).to.deep.equal({number:3.3})
    })

    it('should return correct transformed object', function () {
      let v = parser.outputVal('cat', {as:'newText', transform: 'uppercase'}) 
      expect(v).to.deep.equal({newText:'CAT'})
    })
  })
})