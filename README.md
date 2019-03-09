# WebParsy

> WebParsy is a NodeJS library and cli which allows to scrape websites using [Puppeteer](https://github.com/GoogleChrome/puppeteer) and [YAML definitions](https://en.wikipedia.org/wiki/YAML)

```yaml
jobs:
  main:
    steps:
      - goto: https://example.com
      - pdf:
          - path: file.pdf
          - format: A4
```

---

Don't panic. There are examples for all WebParsy features in the examples folder. This are as basic as possible to help you get started.

##### Table of Contents

- [Overview](#overview)
- [Browser config](#browser-config)
- [Output](#output)
- [Transform](#transform)
- [Types](#types)
- [Steps](#steps)
  * [goto](#goto) Navigate to an URL
  * [goBack](#goBack) Navigate to the previous page in history.
  * [screenshot](#screenshot) Takes an screenshot of the page
  * [pdf](#pdf) Takes a pdf of the page
  * [text](#text) Gets the text for a given CSS selector
  * [title](#title) Gets the title for the current page.
  * [html](#html) Return HTML code for the page or a DOM element.

## Overview

You can use WebParsy either as cli from your terminal or as a NodeJS library.

### Cli

*Install webparsy:*
```bash
$ npm i webparsy -g
```

```bash
$ webparsy example/_weather.yml
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
})
```

#### Methods:

##### init(options)

options:

One of `yaml`, `file` or `string` is required.

- `yaml`: The scraping task definition, built using [yaml npm module](https://www.npmjs.com/package/yaml)
- `string`: The scraping task definition, as a plain string
- `file`: The path for the file that stores the web parsing definition.

Example:

```javascript
const webparsy = require('webparsy')
const yaml = require('yaml')
const parsingResults= await webparsy.init({
  yaml: yaml.parse(userInput)
})
```

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

WebParsy can get websites contents and return them.

For example, you could scrape a weather website, and get the temperature for your city in an object you can reuse for your own purposes.

You can either grab the page's [html](#html) code, the [title](#title) or an specific [text](#text) across the page by using CSS selectors.

Outputting values from WebParsy need some very basic details. This are:

- `as` the property you want to be returned
- `selector` the css selector to extract the html or text from

A possible example to grab your city's temperature could be:

```yaml
- text:
  - as: temperature
  - selector: .today_nowcard-temp span
```

## Transform

When you extract texts from a web page, you might want to transform the data
before returning it. [example](https://github.com/joseconstela/webparsy/blob/master/example/transform.yml)

You can use the following `- transform` methods:

- `uppercase` transforms the result to uppercase
- `lowercase` transforms the result to lowercase

## Types

When extractring details from a page, you might want this to be returned in
different formats, for example as a number in the example of grabing temperatures.
[example](https://github.com/joseconstela/webparsy/blob/master/example/type.yml)

You can use the following values for `- type`:

- `string`
- `number` 
- `integer` 
- `float` 

## Steps

Steps are the list of things the browser must do.

This can be:

  * [goto](#goto) Navigate to an URL
  * [goBack](#goBack) Navigate to the previous page in history.
  * [screenshot](#screenshot) Takes an screenshot of the page
  * [pdf](#pdf) Takes a pdf of the page
  * [text](#text) Gets the text for a given CSS selector
  * [title](#title) Gets the title for the current page.
  * [html](#html) Return HTML code for the page or a DOM element.

### goto

URL to navigate page to. The url should include scheme, e.g. https://. [example](https://github.com/joseconstela/webparsy/blob/master/example/goBack.yml)

```yaml
- goto: https://example.com
```

## goBack

Navigate to the previous page in history. [example](https://github.com/joseconstela/webparsy/blob/master/example/goBack.yml)

```yaml
- goBack
```

## screenshot

Takes an screenshot of the page. This triggers pupetteer's [page.screenshot](https://github.com/GoogleChrome/puppeteer/blob/v1.13.0/docs/api.md#pagescreenshotoptions).
[example](https://github.com/joseconstela/webparsy/blob/master/example/screenshot.yml)

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
page's title will tbe returned as `{ title }`. [example](https://github.com/joseconstela/webparsy/blob/master/example/goBack.yml)

```yaml
- title
```

## text

Gets the text for a given CSS selector. [example](https://github.com/joseconstela/webparsy/blob/master/example/_weather.yml)

Example: 

```yaml
- text:
  - selector: .user.name
  - as: userName
```

## html

Gets the HTML code. If no `selector` specified, it returns the page's full HTML
code. If no output.as property is defined, the result will tbe returned
as `{ html }`. [example](https://github.com/joseconstela/webparsy/blob/master/example/html.yml)

Example: 

```yaml
- html
  - as: divHtml
  - selector: div
```