const createTestServer = require('create-test-server')
const path = require('path')
const fs = require('fs')

const init = require('../../index').init

let server

describe('example transform', () => {
  
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

  it('should transform strings into upper and lower cases', async function () {
    let yml = `version: 1
jobs:
  main:
    steps:
      - goto: 
          url: ${server.url}
      - title
      - text:
          selector: .cityName
          as: city_uppercase
          transform: uppercase
      - text:
          selector: .cityName
          as: city_lowercase
          transform: lowercase
`
    try {
      let result = await init({string: yml});
      expect(result).toMatchObject({
        city_lowercase: 'randomcity',
        city_uppercase: 'RANDOMCITY'
      })
    }
    catch (ex) {
      expect(ex).toBeFalsy()
    }
  })

})
