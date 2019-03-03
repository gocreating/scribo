'use strict'

let handleSeriesPosts = (ctx, next) => {
  let Post = ctx.Model
  let SeriesPost = Post.app.models.SeriesPost
  let post

  if (ctx.instance) {
    post = ctx.instance
  } else {
    post = ctx.data
  }
  // skip if there is no series posts
  if (!post.seriesPosts || post.seriesPosts.length === 0) {
    post.isSeriesMain = false
    return next()
  }
  // start updating series posts
  post.isSeriesMain = true
  SeriesPost.destroyAll({
    mainPostId: post.id,
  }, (err, info) => {
    if (err) return next(err)

    let seriesPostInstances = post.seriesPosts.map(seriesPostId => ({
      mainPostId: post.id,
      seriesPostId,
    }))

    SeriesPost.create(seriesPostInstances, (err, seriesPosts) => {
      if (err) return next(err)
      next()
    })
  })
}

module.exports = handleSeriesPosts
