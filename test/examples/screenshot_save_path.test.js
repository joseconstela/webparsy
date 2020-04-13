const createTestServer = require('create-test-server')
const path = require('path')
const fs = require('fs')
const tmp = require('tmp')

const init = require('../../index').init

let server

describe('example screenshot_save_path', () => {
  
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

  it('should store valid file', async function () {
    let tmpobj = tmp.fileSync({postfix: '.png'})

    let yml = `version: 1
jobs:
  main:
    steps:
      - goto: 
          url: ${server.url}
      - screenshot:
          path: '${tmpobj.name}'
`
    try {
      let result = await init({string: yml});
      expect( fs.statSync(tmpobj.name)['size'] > 100 ).toBeTruthy()
    }
    catch (ex) {
      console.error(ex)
      expect(ex).toBeFalsy()
    }
  })

})
