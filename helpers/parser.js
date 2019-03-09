const cast = (value, type, defaultValue) => {
  if (typeof value === 'undefined') return defaultValue || null
  if (value == null) return null

  switch (type || 'string') {
    case 'string':
      return value.toString()
      break;
    case 'number':
      let r = Number(value)
      return r ? r : Number(parseFloat(value)) || parseInt(value)
      break;
    case 'integer':
      return parseInt(value)
      break;
    case 'float':
      return parseFloat(value)
      break;
    default:
      return value
      break;
  }
}

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