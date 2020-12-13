const parser = require('../parser')

const schema = {
  method: 'scrollTo',
  process: async (flags, page, params, html, usingPuppeteer) => {
    if (!usingPuppeteer) throw new Error(`scroll requires using puppeteer to browse pages`)
    
    if (params.bottom) {
      return await page.evaluate(_ => {
        window.scrollTo(0,document.body.scrollHeight);
      });
    }
    
    if (params.top) {
      return await page.evaluate(_ => {
        window.scrollTo(0, 0);
      });
    }

    if (params.y) {
      return await page.evaluate(y => {
        window.scrollTo(0, y);
      }, params.y);
    }

    if (params.x) {
      return await page.evaluate(y => {
        window.scrollTo(x, 0);
      }, params.x);
    }

    if (params.selector) {
      const [element] = await page.$$(params.selector);
      if (!element) { return; }
      return await page.evaluate(element => {
        element.scrollIntoView();
      }, element);
    }

    if (params.xPath) {
      const [element] = await page.$x(params.xPath);
      if (!element) { return; }
      return await page.evaluate(element => {
        element.scrollIntoView();
      }, element);
    }

    throw new Error('Invalid scroll options')
  }
}

module.exports = schema