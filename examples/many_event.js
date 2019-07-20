const WebParsy = require('../')

process.on('github_tool', (tool) => {
  // Each Github tool is passed to the event.
  // The event name is defined in the YML's many `event` property.
  console.log(tool)
})

WebParsy.init({
  file: 'methods/many_event.yml'
})
.then(result => {
  // As the `eventMethod` property is set to `discard`, the resulting list of 
  // Github tools will be empty.
  // 
  // {
  //   "github_tools": []
  // }
  console.log(
    JSON.stringify(result, ' ', 2)
  )
})