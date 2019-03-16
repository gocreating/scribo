module.exports = function (app) {
  // if some entries are not updated, please decrease BATCH_SIZE since loopback seems to limit data size in bytes for a single query.
  const BATCH_SIZE = 10

  let { Post } = app.models
  let counter = 0

  Post.count({}, async (err, postCount) => {
    let batchCount = Math.ceil(postCount / BATCH_SIZE)

    for (let batch = 0; batch < batchCount; batch++) {
      console.log(`Batch #${batch + 1}`);
      
      let posts = await Post.find({
        where: {},
        skip: batch * BATCH_SIZE,
        limit: BATCH_SIZE,
      })

      posts.forEach(async (post) => {
        counter++
        console.log(`Migrating post #${counter}: ${post.title}`);
  
        post.customUpdatedAt = post.updatedAt
        post.mergedCreatedAt = post.customCreatedAt || post.createdAt
        post.mergedUpdatedAt = post.customUpdatedAt || post.updatedAt
  
        await post.save()
      })
    }

    console.log('Migration finished.')
    process.exit(0)
  })
}
