const createTestServer = require('create-test-server')
const path = require('path')
const fs = require('fs')

const init = require('../../index').init

let server

describe('example types', () => {
  
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

  it('should transform temperature-like value in correct numbers', async function () {
    let yml = `version: 1
jobs:
  main:
    steps:
      - goto:
          url: ${server.url}
      - title
      - text:
          selector: .temperature span
          type: number
          as: temp_number
      - text:
          selector: .temperature span
          type: string
          as: temp_string
      - text:
          selector: .temperature span
          type: integer
          as: temp_integer
      - text:
          selector: .temperature span
          type: float
          as: temp_float`
    try {
      let result = await init({string: yml});
      expect(result).toMatchObject({
        temp_number: 16.4,
        temp_string: '16.4°',
        temp_integer: 16,
        temp_float: 16.4
      })
    }
    catch (ex) {
      expect(ex).toBeFalsy()
    }
  })

})
