'use strict'

module.exports = function createError(name, message, status) {
  let err = new Error(message)

  err.name = name
  if (status) {
    err.status = status
  }
  return err
}
