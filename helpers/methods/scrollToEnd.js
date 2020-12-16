const schema = {
  method: 'scrollToEnd',
  process: async (flags, page, params, html, usingPuppeteer) => {
    if (!usingPuppeteer) throw new Error(`scrollToEnd requires using puppeteer to browse pages`)

    return await page.evaluate(async (step, maxHeight, sleep) => {
      await new Promise((resolve, reject) => {
        var totalHeight = 0;
        var timer = setInterval(() => {
          console.log({step, maxHeight})
          var scrollHeight = document.body.scrollHeight;
          window.scrollBy(0, step);
          totalHeight += step;
          if (totalHeight >= maxHeight || totalHeight >= scrollHeight) {
            clearInterval(timer);
            resolve();
          }
        }, sleep);
      });
    },
      params.step || 10,
      params.max || 50000,
      params.sleep || 100);
  }
}

module.exports = schema