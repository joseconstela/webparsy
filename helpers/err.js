/**
 * @param {object} err
 */
const error = (err, exit) => {
  if (exit) {
    throw new Error(err)
  }
  else {
    console.error(err)
  }
}

module.exports.error = error

/**
 * @param {object} err
 */
const fatal = (err) => error(err, true)

module.exports.fatal = fatal