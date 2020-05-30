const schema = {
  method: 'form',
  process: async (flags, page, params, html, usingPuppeteer) => {
    if (!usingPuppeteer) throw new Error(`form requires using puppeteer to browse pages`)

    await Promise.all((params.fill || []).map(async field => {
      // Field may contain references to environment variables. 
      // Just in case, use a cloned object so the original stays immutable.
      const fieldClone = {...field}

      // Check if the value is pointing to an environment variable
      if (field.value.env) fieldClone.value = process.env[field.value.env]

      await page.evaluate(data => {
        document.querySelector(`${data.params.selector || 'form'} ${data.field.selector}`).value = data.field.value
      }, { params, field: fieldClone })
    }))

    if (params.submit) {
      await page.$eval(params.selector || 'form', form => form.submit())
      await page.waitForNavigation()
    }
  }
}

module.exports = schema