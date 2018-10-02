'use strict'

let whitelistMethods = require('../toolbox/whitelistMethods')

module.exports = function(Post) {
  whitelistMethods(Post, [
    'findById',
  ])
}
