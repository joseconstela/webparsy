const createTestServer = require('create-test-server')
const path = require('path')
const fs = require('fs')
const tmp = require('tmp')

const init = require('../../index').init

let server

describe('example screenshot_save', () => {
  
  beforeEach(done => {
    createTestServer()
      .then(_server => {
        server = _server
        server.get('/', async (req, res) => {
          res.setHeader('content-type', 'text/html');
          res.send(fs.readFileSync(path.resolve(__dirname, '../websites/weather/index.html')))
        })
        done()
      })
  });

  afterEach(async () => {
    await server.close();
  });

  it('should store valid file', async function () {
    let tmpobj = tmp.fileSync()

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
      console.log({yml})
      let result = await init({string: yml});
      process.exit(1)
      expect( fs.statSync(tmpobj.name)['size'] > 100 ).toBeTruthy()
    }
    catch (ex) {
      console.error(ex)
      expect(ex).toBeFalsy()
    }
  })

})
