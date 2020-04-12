const createTestServer = require('create-test-server')
const init = require('../../index').init
const fs = require('fs')
const path = require('path')

let server

describe('example pdf_lib', () => {
  
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

  it('should return valid file buffer', async function () {
    let yml = `version: 1
jobs:
  main:
    steps:
      - goto: 
          flag: url
      - pdf:
          as: pdfFile`
    try {
      let result = await init({string: yml, flags: {
        url: server.url
      }});
      expect(Buffer.isBuffer(result.pdfFile)).toBeTruthy()
    }
    catch (ex) {
      expect(ex).toBeFalsy()
    }
  })

})
