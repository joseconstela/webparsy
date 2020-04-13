const fs = require('fs')
const tmp = require('tmp')
const definition = require('../helpers/definition')

const fullExampleYml = `version: 1
jobs:
  main:
    steps:
      - hello`

describe('definition', function () {
  it('should load yml from string', async () => {
    try {
      let result = await definition.loadString(`version: 1`)
      expect(result.version).toBe(1)
    }
    catch (ex) {
      expect(ex).toBeFalsy()
    }
  })

  it('should validate as axpected', async () => {
    try {
      await definition.loadString(fullExampleYml)
    }
    catch (ex) {
      expect(ex).toBeFalsy()
    }
  })

  it('should throw if no jobs', async () => {
    try {
      let r = await definition.validate({})
      expect(r).toBeFalsy()
    }
    catch (ex) {
      expect(ex.message).toBe('No jobs found')
    }
  })

  it('should throw if no main job', async () => {
    try {
      let r = await definition.validate({jobs:{}})
      expect(r).toBeFalsy()
    }
    catch (ex) {
      expect(ex.message).toBe('No main job found')
    }
  })

  it('should throw if no main job steps', async () => {
    try {
      let r = await definition.validate({jobs:{main:{}}})
      expect(r).toBeFalsy()
    }
    catch (ex) {
      expect(ex.message).toBe('No main job steps found')
    }
  })

  it('should return true if valid', async () => {
    try {
      let r = await definition.validate({jobs:{main:{steps:[]}}})
      expect(r).toBeTruthy()
    }
    catch (ex) {
      expect(ex.message).toBeFalsy()
    }
  })

  it('should throw if no job name', async () => {
    try {
      const def = {jobs:{main:{steps:[]}}}
      let r = await definition.cfg(def, null, 'key', 'value')
      expect(r).toBeFalsy()
    }
    catch (ex) {
      expect(ex.message).toBe('no jobname specified')
    }
  })

  it('should return correct config - jobName', async () => {
    try {
      const def = {jobs:{main:{steps:[]}}}
      let r = await definition.cfg(def, 'main')
      expect(r).toMatchObject({steps:[]})
    }
    catch (ex) {
      expect(ex.message).toBeFalsy()
    }
  })

  it('should return correct config - job steps', async () => {
    try {
      const def = {jobs:{main:{steps:[]}}}
      let r = await definition.cfg(def, 'main', 'steps')
      expect(Array.isArray(r)).toBeTruthy()
      expect(r.length).toBe(0)
    }
    catch (ex) {
      expect(ex.message).toBeFalsy()
    }
  })

  it('should return correct definition from file', async () => {
    let tmpObject = tmp.fileSync()
    try {
      fs.writeFileSync(tmpObject.name, fullExampleYml)
      let result = await definition.loadFile(tmpObject.name, true)
      expect(result).toMatchObject({
        version: 1, 
        jobs: {
          main: {
            steps: [
              'hello'
            ]
          }
        }
      })
    }
    catch (ex) {
      expect(ex.message).toBeFalsy()
    }
  })
})