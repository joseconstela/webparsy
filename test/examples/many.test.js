const createTestServer = require('create-test-server')
const init = require('../../index').init
const fs = require('fs')
const path = require('path')

let server

describe('example many', () => {
  
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

  it('should return valid list of elements', async function () {
    let yml = `version: 1
jobs:
  main:
    steps:
      - goto: ${server.url}
      - many: 
          as: listOfArticles
          selector: '#articles ul li'
          element:
            - property:
                selector: a
                type: string
                property: href
                as: url
                transform: absoluteUrl
            - text:
                selector: a
                type: string
                transform: trim
                as: title`
    try {
      let result = await init({string: yml})
      expect(result).toMatchObject({
        listOfArticles: [
          { url: `${server.url}/articles/A.html`, title: 'articleA' },
          { url: `${server.url}/articles/B.html`, title: 'articleB' }
        ]
      })
    }
    catch (ex) {
      expect(ex).toBeFalsy()
    }
  })

})
