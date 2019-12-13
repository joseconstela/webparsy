const createTestServer = require('create-test-server');
const expect = require('chai').expect

const init = require('../index').init

let server

describe('basic authentication', async () => {
  
  before(async () => {
    server = await createTestServer();
    server.get('/', async (req, res) => {
      if (!req.headers.authorization || req.headers.authorization.indexOf('Basic ') === -1) {
        res.setHeader('WWW-Authenticate', 'Basic realm="Node"')
        res.status(401).json({ message: 'Missing Authorization Header' }).end()
      }
      else {
        // verify auth credentials
        const base64Credentials = req.headers.authorization.split(' ')[1];
        const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
        const [username, password] = credentials.split(':');
        res.status(200).end(`page_loaded for ${username} and ${password}`)
      }
    })
  });

  after(async () => {
    await server.close();
  });

  it('should not work without authentication', async function () {
    this.timeout(10000)
    let yml = `version: 1
jobs:
  main:
    steps:
      - goto: 
          url: ${server.url}
          method: got
      - html
`
    try {
      let result = await init({string: yml});
      expect(result).to.be.null
    }
    catch (ex) {
      expect(ex.message).to.equal('HTTPError: Response code 401 (Unauthorized)')
    }
  })

  it('should authenticate via got', async function () {
    this.timeout(10000)
    let yml = `version: 1
jobs:
  main:
    steps:
      - goto: 
          url: ${server.url}
          method: got
          authentication:
            type: basic
            username: username
            password: password
      - html
`
      let result = await init({string: yml});
      expect(result.html).to.contain('page_loaded')
  })

//   it('should authenticate via puppeteer', async function () {
//     this.timeout(10000)
//     let yml = `version: 1
// jobs:
//   main:
//     steps:
//       - goto: 
//           url: ${server.url}
//           authentication:
//             type: basic
//             username: username
//             password: password
//       - html
// `
//     try {
//       let result = await init({string: yml});
//       expect(result.html).to.contain('page_loaded')
//     }
//     catch (ex) {
//       console.error(ex)
//     }
    
//   })
})
