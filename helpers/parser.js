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
    case 'string':
      r = value.toString().trim()
      if (r === '') r = defaultValue
      return r
      break;
    case 'number':
      r = Number(value)
      return r ? r : Number(parseFloat(value)) || parseInt(value)
      break;
    case 'integer':
      return parseInt(value)
      break;
    case 'float':
      return parseFloat(value)
      break;
    case 'fdc':
      return parseFloat(value.replace(/\./g, '').replace(/\,/g, '.'))
      break;
    case 'fcd':
      return parseFloat(value.replace(/\,/g, ''))
      break;
    default:
      return value
      break;
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
const transform = (value, type) => {
  if (!type) return value

  switch (type.toLowerCase()) {
    case 'uppercase':
      if (typeof value !== 'string') return value
      return value.toUpperCase()
      break;
    case 'lowercase':
      if (typeof value !== 'string') return value
      return value.toLowerCase()
      break;
    default:
      return value
      break;
  }
}

module.exports.transform = transform

/**
 * 
 * @param {*} value 
 * @param {*} as 
 */
const outputVal = (value, params, asDefault) => {
  value = cast(value, params.type || 'string', params.default)
  value = transform(value, params.transform || 'string', params.default)
  let result = {}
  result[params.as || asDefault || 'default'] = value
  return result
}

module.exports.outputVal = outputVal