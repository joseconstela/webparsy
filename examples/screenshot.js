'use strict'

/**
 * This example shows how how to input an url from NodeJS into webparsy
 */

const WebParsy = require('../')

WebParsy.init({
  file: 'methods/screenshot_lib.yml',
  flags: {
    url: 'https://google.com'
  }
})
.then(result => console.log(typeof result.image))