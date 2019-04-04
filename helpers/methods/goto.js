const schema = {
  method: 'goto',
  process: (flags, page, params, html) => {
    const url = params.flag ? flags[params.flag] : params
    return page.goto(url)
  }
}

module.exports = schema