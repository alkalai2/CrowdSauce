'use strict'

/*!
 * imports.
 */

var curry2 = require('curry2')

/*!
 * exports.
 */

module.exports = curry2(parse)

/**
 * Curried function that calls `JSON.parse` on provided input returning either
 * the parsed JSON or the specified default value if the data fails to parse as
 * valid JSON instead of throwing a `SyntaxError`.
 *
 * @param {*} defaultValue
 * Default value to return if given data does not parse as valid JSON.
 *
 * @param {*} data
 * Data to parse as JSON.
 *
 * @return {*}
 * JavaScript value corresponding to parsed data.
 */

function parse (defaultValue, data) {
  try {
    return JSON.parse(data)
  } catch (error) {
    if (defaultValue === null || defaultValue === undefined) {
      throw error
    } else {
      return defaultValue
    }
  }
}
