const createTestServer = require('create-test-server')
const path = require('path')
const fs = require('fs')
const tmp = require('tmp')

const init = require('../../index').init

let server

describe('example pdf_save', () => {
  
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
    let tmpobj = tmp.fileSync({postfix: '.pdf'})

    let yml = `version: 1
jobs:
  main:
    steps:
      - goto: 
          url: ${server.url}
      - pdf:
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
