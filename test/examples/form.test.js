const createTestServer = require('create-test-server')
const init = require('../../index').init
const fs = require('fs')
const path = require('path')

let server

describe('example form', () => {
  
  beforeEach(done => {
    createTestServer()
      .then(_server => {
        server = _server
        server.get('/*', async (req, res) => {
          res.setHeader('content-type', 'text/html')
          let location = req._parsedUrl.href
          if (location === '/') location = 'index.html'
          if (location.startsWith('/search.html')) location = 'search.html'
          res.send(fs.readFileSync(path.resolve(__dirname, `../websites/shop/${location}`)))
        })
        done()
      })
  })

  afterEach(async () => {
    await server.close();
  });

  it('should type in search bar', async function () {
    let yml = `version: 1
jobs:
  main:
    steps:
      - goto: ${server.url}
      - form:
          selector: '#search'
          submit: true
          fill:
            - selector: '[name="q"]'
              value: test
      - url`
    try {
      let result = await init({string: yml})
      expect(result.url.includes('/search.html?q=test')).toBeTruthy()
    }
    catch (ex) {
      expect(ex).toBeFalsy()
    }
  })

})
