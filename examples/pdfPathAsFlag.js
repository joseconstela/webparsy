'use strict'

/**
 * This example shows how how to input an url from NodeJS into webparsy
 */

const WebParsy = require('../')

WebParsy.init({
  file: 'examples/methods/pdf_lib_path_as_flag.yml',
  flags: {
    url: 'https://elpais.com',
    pdfFileLocation: 'elPais.pdf'
  }
})
.then(result => console.log(typeof result.image))