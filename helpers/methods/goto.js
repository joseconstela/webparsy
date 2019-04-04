const schema = {
  method: 'goto',
  process: (flags, page, params, html) => {
    console.log(JSON.stringify({
      params, flags
    }, ' ', 2))
    const url = params.param ? flags[params.param] : params
    return page.goto(url)
  }
}

module.exports = schema