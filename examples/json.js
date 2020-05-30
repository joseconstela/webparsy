'use strict'

/**
 * This example shows how how to input an url from NodeJS into webparsy
 */

const WebParsy = require('../')

WebParsy.init({
    "json": {
      "version": 1,
      "jobs": {
        "main": {
          "steps": [{
              "setContent": {
                "flag": "markup"
              }
            },
            {
              "pdf": {
                "as": "file",
                "format": "A4"
              }
            }
          ]
        }
      }
    },
    "flags": {
      "markup": "xx"
    }
  })