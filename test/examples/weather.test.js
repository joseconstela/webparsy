const createTestServer = require('create-test-server')
const path = require('path')
const fs = require('fs')

const init = require('../../index').init

let server

describe('example weather', () => {
  
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

  it('should get temperature as number', async function () {
    let yml = `version: 1
jobs:
  main:
    steps:
      - goto:
          url: ${server.url}
      - title
      - text:
          selector: .cityName
          as: city
      - text:
          selector: .temperature
          type: number
          as: temp
`
    try {
      let result = await init({string: yml});
      expect(result).toMatchObject({
        city: 'RandomCity',
        temp: 16.4,
        title: 'Weather of RandomCity'
      })
    }
    catch (ex) {
      expect(ex).toBeFalsy()
    }
  })

})
