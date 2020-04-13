/**
 * Converts a value to the specified type
 * 
 * @param {string} value 
 * @param {string} type 
 * @param {*} defaultValue 
 */
const cast = (value, type, defaultValue) => {
  if (typeof value === 'undefined') return defaultValue || null
  if (value == null) return defaultValue
  
  let r 

  switch (type || 'string') {
    case 'buffer':
      if (Buffer.isBuffer(value)) return value
      return Buffer.from(value)
    case 'string':
      r = value.toString().trim()
      if (r === '') r = defaultValue
      return r
    case 'number':
      r = Number(value)
      return r ? r : Number(parseFloat(value)) || parseInt(value)
    case 'integer':
      return parseInt(value)
    case 'float':
      return parseFloat(value)
    case 'fdc':
      return parseFloat(value.replace(/\./g, '').replace(/\,/g, '.'))
    case 'fcd':
      return parseFloat(value.replace(/\,/g, ''))
    default:
      return value
  }
}

module.exports.cast = cast

/**
 * Transforms a value 
 * 
 * @param {string} value 
 * @param {string} type 
 * @param {*} type 
 */
const transform = (value, type, defalutValue, url) => {
  if (!type) return value

  switch (type.toLowerCase()) {
    case 'uppercase':
      if (typeof value !== 'string') return value
      return value.toUpperCase()
    case 'lowercase':
      if (typeof value !== 'string') return value
      return value.toLowerCase()
    case 'absoluteurl':
      if (typeof value !== 'string') return value
      return new URL(value, url).href
    default:
      return value
  }
}

module.exports.transform = transform

/**
 * 
 * @param {*} value 
 * @param {*} as 
 * @param {*} asDefault 
 * @param {*} url 
 */
const outputVal = (value, params, asDefault, url) => {
  if (Array.isArray(value) && !params.type) { params.type = 'array' }
  value = cast(value, params.type || 'string', params.default)
  value = transform(value, params.transform || 'string', params.default, url)
  let result = {}
  result[params.as || asDefault || 'default'] = value
  return result
}

module.exports.outputVal = outputVal