# ![WebPary logo](logo.png)
<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/badge/all_contributors-1-orange.svg?style=flat-square)](#contributors-)
<!-- ALL-CONTRIBUTORS-BADGE:END -->

> Fast and light NodeJS library and cli to scrape and interact with websites using [Puppeteer](https://github.com/GoogleChrome/puppeteer) ([or not](#goto)) and [YAML definitions](https://en.wikipedia.org/wiki/YAML)

```yaml
version: 1
jobs:
  main:
    steps:
      - goto: https://github.com/marketplace?category=code-quality
      - pdf:
          path: Github_Tools.pdf
          format: A4
      - many: 
          as: github_tools
          event: githubTool
          selector: main .col-lg-9.mt-1.mb-4.float-lg-right a.col-md-6.mb-4.d-flex.no-underline
          element:
            - property:
                selector: a
                type: string
                property: href
                as: url
                transform: absoluteUrl
            - text:
                selector: h3.h4
                type: string
                transform: trim
                as: name
            - text:
                selector: p
                type: string
                transform: trim
                as: description
```

_Return an array with Github's tools, and creates a PDF. Example output:_

```json
{
  "github_tools": [
    {
      "url": "https://github.com/marketplace/codelingo",
      "name": "codelingo",
      "description": "Your Code, Your Rules - Automate code reviews with your own best practices"
    },
    {
      "url": "https://github.com/marketplace/codebeat",
      "name": "codebeat",
      "description": "Code review expert on demand. Automated for mobile and web"
    },
    ...
  ]
}
```

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
- [Multi-jobs](#multi-jobs-support)
- [Steps](#steps)
  * [setContent](#setContent) Sets the HTML markup to assign to the page.
  * [goto](#goto) Navigate to an URL
  * [run](#run) Runs a group of steps by its name.
  * [goBack](#goBack) Navigate to the previous page in history
  * [screenshot](#screenshot) Takes an screenshot of the page
  * [pdf](#pdf) Takes a pdf of the page
  * [text](#text) Gets the text for a given CSS selector
  * [many](#many) Returns an array of elements given their CSS selectors
  * [title](#title) Gets the title for the current page.
  * [form](#form) Fill and submit forms
  * [html](#html) Return HTML code for the page or a DOM element
  * [click](#click) Click on an element (CSS and xPath selectors)
  * [url](#url) Return the current URL
  * [type](#type) Types a text (key events) in a given selector
  * [waitFor](#waitFor) Wait for selectors, time, functions, etc before continuing
  * [keyboardPress](#keyboardPress) Simulates the press of a keyboard key

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

#### Methods

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

None of the following settings are required.

```yaml
jobs:
  main:
    browser:
      width: 1200
      height: 800
      scaleFactor: 1
      timeout: 60
      delay: 0
      headless: true
      executablePath: ''
      userDataDir: ''
      keepOpen: false
```

- executablePath: If provided, webparsy will launch Chrome from the specified
path.
- userDataDir: If provided, webparsy will launch Chrome with the specified
user's profile.

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

## Multi-jobs support

You can define groups of steps (jobs) that you can reuse at any moment during an
scraping process.

For example, let's say you want to signup twice in a website. You will have a
"main" job (that executes by defaul) but you can create an additional one called
"signup", that you can reuse in the "main" one.

```yaml
version: 1
jobs:
  main:
    steps:
      - goto: https://example.com/
      - run: signup
      - click: '#logout'
      - run: signup
  signup:
    steps:
      - goto: https://example.com/register
      - form:
          selector: "#signup-user"
          submit: true
          fill:
            - selector: '[name="username"]'
              value: jonsnow@example.com
```

## Steps

Steps are the list of things the browser must do.

This can be:

  * [setContent](#setContent) Sets the HTML markup to assign to the page.
  * [goto](#goto) Navigate to an URL
  * [run](#run) Runs a group of steps by its name.
  * [goBack](#goBack) Navigate to the previous page in history
  * [screenshot](#screenshot) Takes an screenshot of the page
  * [pdf](#pdf) Takes a pdf of the page
  * [text](#text) Gets the text for a given CSS selector
  * [many](#many) Returns an array of elements given their CSS selectors
  * [title](#title) Gets the title for the current page.
  * [form](#form) Fill and submit forms
  * [html](#html) Return HTML code for the page or a DOM element
  * [click](#click) Click on an element (CSS and xPath selectors)
  * [url](#url) Return the current URL
  * [type](#type) Types a text (key events) in a given selector
  * [waitFor](#waitFor) Wait for selectors, time, functions, etc before continuing
  * [keyboardPress](#keyboardPress) Simulates the press of a keyboard key

## setContent

Sets the HTML markup to assign to the page.

Setting a string:

```yaml
- setContent:
    html: Hello!
```

Loading the HTML from a file:

```yaml
- setContent:
    file: myMarkup.html
```

Loading the HTML from a environment variable:

```yaml
- setContent:
    env: MY_MARKUP_ENVIRONMENT_VARIABLE
```

Loading the HTML from a flag:

```yaml
- setContent:
    flag: markup
```

## goto

URL to navigate page to. The url should include scheme, e.g. https://. [example](https://github.com/joseconstela/webparsy/blob/master/examples/methods/goBack.yml)

```yaml
- goto: https://example.com
```

You can also tell WebParsy to don't use Puppeteer to browse, and instead do a
direct HTTP request via got. This will perform much faster, but it may not be
suitable for websites that requires JavaScript. [simple example](https://github.com/joseconstela/webparsy/blob/master/examples/methods/getRequest.yml) / 
[extended example](https://github.com/joseconstela/webparsy/blob/master/examples/methods/many_using_get.yml)

Note that some methods (for example: `form`, `click` and others) will not be
available if you are not browsing using puppeteer.

```yaml
- goto:
    url: https://google.com
    method: got
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

### Authentication

You can perform basic HTTP authentication by providing the user and password as in the following example:

```yml
- goto: 
    url: http://example.com
    method: got
    authentication:
      type: basic
      username: my_user
      password: my_password
```


## run

Runs a group of steps by its name.

```yaml
- run: signupProcess
```

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

If you are using WebParsy as a NodeJS module, you can also get the screenshot
retuned as a Buffer by using the `as` property.

```yaml
- screenshot:
  - as: myScreenshotBuffer
```

## pdf

Takes a pdf of the page. This triggers pupetteer's [page.pdf](https://github.com/GoogleChrome/puppeteer/blob/v1.13.0/docs/api.md#pagepdfoptions)

```yaml
- pdf:
  - path: Github.pdf
```

If you are using WebParsy as a NodeJS module, you can also get the PDF file
retuned as a Buffer by using the `as` property.

```yaml
- pdf:
  - as: pdfFileBuffer
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

When you scape large amount of contents, you might end consuming hords of RAM,
your system might become slow and the scraping process might fail.

To prevent this, WebParsy allows you to use process events so you can have the
scraped contents as they are scraped, instead of storing them in memory and
waiting for the whole process to finish.

To do this, simply add an `event` property to `many`, with the event's name you
want to listen to. The event will contain each scraped item.

`event` will give you the data as it's being scraped. To prevent it from being
stored in memory, set `eventMethod` to `discard`.

[Example using events](https://github.com/joseconstela/webparsy/blob/master/examples/many_event.js)

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

Default behaviour (CSS selector)
```yaml
- click: button.click-me
```

Same as
```yaml
- click: 
    selector: button.click-me
```

By xPath (clicks on the first match)
```yaml
- click: 
    xPath: '/html/body/div[2]/div/div/div/div/div[3]/span'
```

## type

Sends a `keydown`, `keypress/input`, and `keyup` event for each character in
the text.

Example:

```yaml
- type:
    selector: input.user
    text: jonsnow@example.com
    options:
      delay: 4000
```

## url

Return the current URL.

Example:

```yaml
- url:
    as: currentUrl
```

## waitFor

Wait for specified CSS, XPath selectors, on an specific amount of time before
continuing [example](https://github.com/joseconstela/webparsy/blob/master/examples/methods/form.yml)

Examples: 

```yaml
- waitFor:
   selector: "#search-results"
```

```yaml
- waitFor:
   xPath: "/html/body/div[1]/header/div[1]/a/svg"
```

```yaml
- waitFor:
   function: "console.log(Date.now())"
```

```yaml
- waitFor:
    time: 1000 # Time in milliseconds
```

## keyboardPress

Simulates the press of a keyboard key. [extended docs](https://github.com/puppeteer/puppeteer/blob/master/docs/api.md#keyboardpresskey-options)

```yaml
- keyboardPress: 
    key: 'Enter'
```

## License

MIT © [Jose Constela](https://joseconstela.com)

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://github.com/Dumi-k"><img src="https://avatars0.githubusercontent.com/u/23239829?v=4" width="100px;" alt=""/><br /><sub><b>Dumi-k</b></sub></a><br /><a href="https://github.com/joseconstela/webparsy/issues?q=author%3ADumi-k" title="Bug reports">🐛</a></td>
  </tr>
</table>

<!-- markdownlint-enable -->
<!-- prettier-ignore-end -->
<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!