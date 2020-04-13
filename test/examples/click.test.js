const createTestServer = require('create-test-server')
const init = require('../../index').init
const fs = require('fs')
const path = require('path')

let server

describe('example click', () => {
  
  beforeEach(done => {
    createTestServer()
      .then(_server => {
        server = _server
        server.get('/*', async (req, res) => {
          res.setHeader('content-type', 'text/html')
          let location = req._parsedUrl.href
          if (location === '/') location = 'index.html'
          res.send(fs.readFileSync(path.resolve(__dirname, `../websites/weather/${location}`)))
        })
        done()
      })
  })

  afterEach(async () => {
    await server.close();
  });

  it('should click and get new page html', async function () {
    let yml = `version: 1
jobs:
  main:
    steps:
      - goto: ${server.url}
      - click: '#cities .madrid'
      - innerHtml:
          as: containerText
          selector: .cityName`
    try {
      let result = await init({string: yml})
      expect(result).toMatchObject({
        containerText: 'City of Madrid'
      })
    }
    catch (ex) {
      expect(ex).toBeFalsy()
    }
  })

})
