const createTestServer = require('create-test-server')
const init = require('../../index').init
const fs = require('fs')
const path = require('path')

let server

describe('example getRequest', () => {
  
  beforeEach(done => {
    createTestServer()
      .then(_server => {
        server = _server
        server.get('/*', async (req, res) => {
          res.setHeader('content-type', 'text/html')
          let location = req._parsedUrl.href
          if (location === '/') location = 'index.html'
          res.send(fs.readFileSync(path.resolve(__dirname, `../websites/shop/${location}`)))
        })
        done()
      })
  })

  afterEach(async () => {
    await server.close();
  });

  it('should return valid html using got library', async function () {
    let yml = `version: 1
jobs:
  main:
    steps:
      - goto:
          url: ${server.url}
          method: got
      - html:
          as: page_html
      - html:
          as: div_html
          selector: '#articles'`
    try {
      let result = await init({string: yml})
      expect(result.page_html).toBeTruthy()
      expect(result.div_html).toBeTruthy()
      expect(result.page_html.includes('doctype html')).toBeTruthy()
      expect(result.div_html.includes('articleA')).toBeTruthy()
    }
    catch (ex) {
      expect(ex).toBeFalsy()
    }
  })

})
