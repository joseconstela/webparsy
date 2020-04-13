const createTestServer = require('create-test-server')
const init = require('../../index').init
const fs = require('fs')
const path = require('path')

let server

describe('example html', () => {
  
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

  it('should return title from first page', async function () {
    let yml = `version: 1
jobs:
  main:
    steps:
      - goto: ${server.url}
      - goto: ${server.url}/page2.html
      - goBack
      - title`
    try {
      let result = await init({string: yml})
      expect(result).toMatchObject({
        title: 'Shop Index'
      })
    }
    catch (ex) {
      expect(ex).toBeFalsy()
    }
  })

})
