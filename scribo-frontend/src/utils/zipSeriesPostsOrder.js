export default (posts) => {
  let zippedPost = {}

  Object.keys(posts).forEach(postId => {
    let { seriesPosts, seriesPostsMetadata, ...rest } = posts[postId]
    let orderedSeriesPosts = seriesPosts.map(post => ({
      ...post,
      order: seriesPostsMetadata
        .filter(meta => meta.seriesPostId === post.id)[0]
        .order,
    }))

    zippedPost[postId] = {
      seriesPosts: orderedSeriesPosts,
      ...rest
    }
  })
  return zippedPost
}
