const schema = {
  method: 'goto',
  process: (flags, page, params, html) => {

    // URL can be passed as:
    // - goto: example.com
    // or
    // - goto:
    //     flag: websiteUrl
    // or
    // - goto:
    //     url: example.com
    
    const url = params.flag ? flags[params.flag] : params.url ? params.url : params
    return params.method === 'get' ? url : page.goto(url)
  }
}

module.exports = schema