'use strict'

let appendAbstractBlocks = (ctx, next) => {
  let post

  if (ctx.instance) {
    post = ctx.instance
  } else {
    post = ctx.data
  }
  if (!post.blocks) {
    return next()
  }
  post.abstractBlocks = post.blocks.slice(0, 2)
  next()
}

module.exports = appendAbstractBlocks
