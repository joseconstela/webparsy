const schema = {
  method: 'form',
  process: async (page, params, html) => {
    (params.fill || []).map(async field => {
      await page.evaluate((data) => {
        document.querySelector(`${data.params.selector || 'form'} ${data.field.selector}`).value = data.field.value
      }, { params, field })
    })
    if (params.submit) {
      await page.$eval(params.selector || 'form', form => form.submit())
      await page.waitForNavigation()
    }
  }
}

module.exports = schema