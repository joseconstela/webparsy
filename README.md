# WebParsy [![CircleCI](https://circleci.com/gh/joseconstela/webparsy.svg?style=svg)](https://circleci.com/gh/joseconstela/webparsy) [![Greenkeeper badge](https://badges.greenkeeper.io/joseconstela/webparsy.svg)](https://greenkeeper.io/)

> WebParsy is a NodeJS library and cli which allows to scrape websites using [Puppeteer](https://github.com/GoogleChrome/puppeteer) and [YAML definitions](https://en.wikipedia.org/wiki/YAML)

```yaml
jobs:
  main:
    steps:
      - goto: https://google.com
      - pdf:
          path: Google.pdf
          format: A4
      - goto: https://weather.com/es-ES/tiempo/hoy/l/SPXX0050:1:SP
      - title
      - text:
          selector: .h4.today_nowcard-location
          as: city
      - text:
          selector: .today_nowcard-temp span
          type: number
          as: temp
```

_Build a PDF from Google's homepage and get Madrid's temperature._

---

Don't panic. There are examples for all WebParsy features in the examples folder. This are as basic as possible to help you get started.

<div>
	<p>
    <sup>Support my work,</sup>
		<br>
		<a href="https://www.patreon.com/joseconstela">
			<img src="https://c5.patreon.com/external/logo/become_a_patron_button@2x.png" width="160">
		</a>
  </p>
</div>

##### Table of Contents

- [Overview](#overview)
- [Browser config](#browser-config)
- [Output](#output)
- [Transform](#transform)
- [Types](#types)
- [Steps](#steps)
  * [goto](#goto) Navigate to an URL
  * [goBack](#goBack) Navigate to the previous page in history
  * [screenshot](#screenshot) Takes an screenshot of the page
  * [pdf](#pdf) Takes a pdf of the page
  * [text](#text) Gets the text for a given CSS selector
  * [many](#many) Returns an array of elements given their CSS selectors
  * [title](#title) Gets the title for the current page.
  * [form](#form) Fill and submit forms
  * [html](#html) Return HTML code for the page or a DOM element
  * [click](#click) Click on an element
  * [url](#url) Return the current URL
  * [waitFor](#waitFor) Wait for selectors or some time before continuing

## Overview

You can use WebParsy either as cli from your terminal or as a NodeJS library.

### Cli

*Install webparsy:*
```bash
$ npm i webparsy -g
```

```bash
$ webparsy example/_weather.yml --customFlag "custom flag value"
Result:

{
  "title": "Madrid, España Pronóstico del tiempo y condiciones meteorológicas - The Weather Channel | Weather.com",
  "city": "Madrid, España",
  "temp": 18
}
```

### Library

```javascript
const webparsy = require('webparsy')
const parsingResult = await webparsy.init({
  file: 'jobdefinition.yml'
  flags: { ... } // optional
})
```

#### Methods:

##### init(options)

options:

One of `yaml`, `file` or `string` is required.

- `yaml`: A [yaml npm module](https://www.npmjs.com/package/yaml) instance of the scraping definition.
- `string`: The YAML definition, as a plain string.
- `file`: The path for the YAML file containing the scraping definition.

Additionally, you can pass a `flags` object property to input additional values
to your scraping process.

## Browser config

You can setup Chrome's details in the `browser` property within the main job.

```yaml
jobs:
  main:
    browser:
      width: 1200
      height: 800
      scaleFactor: 1
      timeout: 60
      delay: 0
```

## Output

In order for WebParsy to get contents, it needs some very basic details. This are:

- `as` the property you want to be returned
- `selector` the css selector to extract the html or text from

Other optional options are

- `parent` Get the parent of the element filtered by a selector. 

Example

```yaml
text:
  selector: .entry-title
  as: entryLink
  parent: a
```

## Transform

When you extract texts from a web page, you might want to transform the data
before returning them. [example](https://github.com/joseconstela/webparsy/blob/master/examples/methods/transform.yml)

You can use the following `- transform` methods:

- `uppercase` transforms the result to uppercase
- `lowercase` transforms the result to lowercase
- `absoluteUrl` return the absolute url for a link

## Types

When extractring details from a page, you might want them to be returned in
different formats, for example as a number in the example of grabing temperatures.
[example](https://github.com/joseconstela/webparsy/blob/master/examples/methods/type.yml)

You can use the following values for `- type`:

- `string`
- `number` 
- `integer` 
- `float` 
- `fcd` tranform to **f**loat an string-number that uses **c**omma for thousands
- `fdc` tranform to **f**loat an string-number that uses **d**ot for thousands

## Steps

Steps are the list of things the browser must do.

This can be:

  * [goto](#goto) Navigate to an URL
  * [goBack](#goBack) Navigate to the previous page in history
  * [screenshot](#screenshot) Takes an screenshot of the page
  * [pdf](#pdf) Takes a pdf of the page
  * [text](#text) Gets the text for a given CSS selector
  * [many](#many) Returns an array of elements given their CSS selectors
  * [title](#title) Gets the title for the current page.
  * [form](#form) Fill and submit forms
  * [html](#html) Return HTML code for the page or a DOM element
  * [click](#click) Click on an element
  * [url](#url) Return the current URL
  * [waitFor](#waitFor) Wait for selectors or some time before continuing

### goto

URL to navigate page to. The url should include scheme, e.g. https://. [example](https://github.com/joseconstela/webparsy/blob/master/examples/methods/goBack.yml)

```yaml
- goto: https://example.com
```

You can also tell WebParsy which urls it should visit via flags (available via
cli and library). Example:

```yaml
- goto:
    flag: websiteUrl
```

You can then call webparsy as:

```bash
webparsy definition.yaml --websiteUrl "https://google.com"
```

or 

```javascript
webparsy.init({
  file: 'definition.yml'
  flags: { websiteUrl: 'https://google.com' }
})
```

[example](https://github.com/joseconstela/webparsy/blob/master/examples/flags.js)

## goBack

Navigate to the previous page in history. [example](https://github.com/joseconstela/webparsy/blob/master/examples/methods/goBack.yml)

```yaml
- goBack
```

## screenshot

Takes an screenshot of the page. This triggers pupetteer's [page.screenshot](https://github.com/GoogleChrome/puppeteer/blob/v1.13.0/docs/api.md#pagescreenshotoptions).
[example](https://github.com/joseconstela/webparsy/blob/master/examples/methods/screenshot.yml)

```yaml
- screenshot:
  - path: Github.png
```

## pdf

Takes a pdf of the page. This triggers pupetteer's [page.pdf](https://github.com/GoogleChrome/puppeteer/blob/v1.13.0/docs/api.md#pagepdfoptions)

```yaml
- pdf:
  - path: Github.pdf
```

## title

Gets the title for the current page. If no output.as property is defined, the
page's title will tbe returned as `{ title }`. [example](https://github.com/joseconstela/webparsy/blob/master/examples/methods/goBack.yml)

```yaml
- title
```

## many

Returns an array of elements given their CSS selectors. [example](https://github.com/joseconstela/webparsy/blob/master/examples/methods/many.yml)

Example: 

```yaml
- many: 
  as: articles
  selector: main ol.articles-list li.article-item
  element:
    - text:
      selector: .title
      as: title
```

## form

Fill and submit forms. [example](https://github.com/joseconstela/webparsy/blob/master/examples/methods/form.yml)

Form filling can use values from environment variables. This is useful if you
want to keep users login details in secret. If this is your case, instead of
specifying the value as a string, set it as the env property for value. Check
the example below or refer to [banking example](https://github.com/joseconstela/webparsy/blob/master/examples/methods/form.yml)

Example: 

```yaml
- form:
    selector: "#tsf"            # form selector
    submit: true               # Submit after filling all details
    fill:                      # array of inputs to fill
      - selector: '[name="q"]' # input selector
        value: test            # input value
```

Using environment variables
```yaml
- form:
    selector: "#login"            # form selector
    submit: true                  # Submit after filling all details
    fill:                         # array of inputs to fill
      - selector: '[name="user"]' # input selector
        value:
          env: USERNAME           # process.env.USERNAME
      - selector: '[name="pass"]' 
        value: 
          env: PASSWORD           # process.env.PASSWORD
```

## html

Gets the HTML code. If no `selector` specified, it returns the page's full HTML
code. If no output.as property is defined, the result will be returned
as `{ html }`. [example](https://github.com/joseconstela/webparsy/blob/master/examples/methods/html.yml)

Example: 

```yaml
- html
    as: divHtml
    selector: div
```

## click

Click on an element. [example](https://github.com/joseconstela/webparsy/blob/master/examples/methods/click.yml)

Example:

```yaml
- click: button.click-me
```

## url

Return the current URL.

Example:

```yaml
- url:
    as: currentUrl
```

## waitFor

Wait for specified CSS selectors, on an specific amount of time before
continuing [example](https://github.com/joseconstela/webparsy/blob/master/examples/methods/form.yml)

Examples: 

```yaml
- waitFor:
   selector: "#search-results"
```

```yaml
- waitFor:
    time: 1000 # Time in milliseconds
```

## License

MIT © [Jose Constela](https://joseconstela.com)
