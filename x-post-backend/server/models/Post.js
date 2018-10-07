'use strict'

let whitelistMethods = require('../toolbox/whitelistMethods')
const appendAbstractBlocks = require('../hooks/post/appendAbstractBlocks')

module.exports = function(Post) {
  whitelistMethods(Post, [
    'findById',
  ])

  Post.observe('before save', appendAbstractBlocks)
}
