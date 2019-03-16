'use strict'

let formatTimestamps = (ctx, next) => {
  let post

  if (ctx.instance) {
    post = ctx.instance
  } else {
    post = ctx.data
  }
  
  post.updatedAt = Date.now()

  if (post.customCreatedAt) {
    post.customCreatedAt = new Date(post.customCreatedAt)
  } else {
    delete post.customCreatedAt
  }
  if (post.customUpdatedAt) {
    post.customUpdatedAt = new Date(post.customUpdatedAt)
  } else {
    delete post.customUpdatedAt
  }

  post.mergedCreatedAt = post.customCreatedAt || post.createdAt
  post.mergedUpdatedAt = post.customUpdatedAt || post.updatedAt
  
  next()
}

module.exports = formatTimestamps
