'use strict'

let whitelistMethods = require('../toolbox/whitelistMethods')

module.exports = (AppUser) => {
  whitelistMethods(AppUser, [
    'create',
    'logout',
    'findById',
    '__get__posts',
    '__create__posts',
    '__destroyById__posts',
  ])

  AppUser.observe('before save', (ctx, next) => {
    if (!ctx.isNewInstance) {
      return next()
    }
    let FILTERED_PROPERTIES = [
      'id',
      'createdAt',
      'updatedAt',
    ]
    if (ctx.instance) {
      FILTERED_PROPERTIES.forEach((p) => {
        ctx.instance.unsetAttribute(p)
      })
      ctx.instance['createdAt'] = new Date()
    } else {
      FILTERED_PROPERTIES.forEach((p) => {
        delete ctx.data[p]
      })
    }
    next()
  })

  AppUser.xlogin = (credentials, next) => {
    AppUser.login(credentials, (err, data) => {
      if (err) return next(err)

      AppUser.findById(data.userId, (err, user) => {
        return next(null, {
          ttl: data.ttl,
          accessToken: data.id,
          tokenCreatedAt: data.created,
          user,
        })
      })
    })
  }
  AppUser.remoteMethod('xlogin', {
    isStatic: true,
    http: { verb: 'post', path: '/login' },
    description: 'login with email and password',
    accepts: [
      {
        arg: 'credentials',
        description: 'An object contains user\'s email and password.',
        type: 'object',
        http: { source: 'body' },
      },
    ],
    returns: {
      arg: 'data',
      type: 'object',
      root: true,
    },
  })

  AppUser.findPostsByUsername = (username, filter, pageId, keyword, next) => {
    let { Post } = AppUser.app.models

    AppUser.findOne({ where: { username } }, (err, appUser) => {
      if (err) return next(err)
      if (!appUser) return next(new Error('User not found'))

      let limit = parseInt(Post.settings.scope.limit)
      let page = parseInt(pageId)

      if (!filter) {
        filter = {
          include: [{
            relation: 'author',
            scope: {
              fields: ['username'],
            }
          }, {
            relation: 'seriesPosts',
            scope: {
              fields: ['title'],
            }
          }],
          fields: {
            id: true,
            authorId: true,
            slug: true,
            headerImage: true,
            title: true,
            subtitle: true,
            abstractBlocks: true,
            seriesCount: true,
            createdAt: true,
            updatedAt: true,
          },
          order: 'updatedAt DESC',
        }
      }
      filter.skip = (page - 1) * limit

      let query = {
        authorId: appUser.id,
        isInSeries: { inq: [null, false] },
      }

      if (keyword) {
        query.title = {
          like: keyword,
        }
        delete query.isInSeries
      }

      Post.count(query, (err, count) => {
        if (err) return next(err)

        Post.find({
          where: query,
          ...filter,
        }, (err, posts) => {
          if (err) return next(err)

          next(null, {
            posts,
            meta: {
              total: count,
              pageId,
              limit,
            }
          })
        })
      })
    })
  }
  AppUser.remoteMethod('findPostsByUsername', {
    isStatic: true,
    http: {
      verb: 'get',
      path: '/username/:username/posts',
      errorStatus: 404,
    },
    description: 'Get post list with username.',
    accepts: [
      {
        arg: 'username',
        description: 'Username of post author',
        type: 'any',
        required: true,
      },
      {
        arg: 'filter',
        type: 'object',
        http: { source: 'query' },
      },
      {
        arg: 'pageId',
        type: 'string',
        http: { source: 'query' },
      },
      {
        arg: 'keyword',
        type: 'string',
        http: { source: 'query' },
      },
    ],
    returns: {
      arg: 'data',
      type: 'object',
      root: true,
    },
  })

  AppUser.findPostByUserIdAndPostId = (userId, postId, filter, next) => {
    let { Post } = AppUser.app.models

    if (!filter) {
      filter = {
        include: [{
          relation: 'author',
          scope: {
            fields: ['username'],
          }
        }, {
          relation: 'seriesPosts',
          scope: {
            fields: ['title'],
          }
        }],
      }
    }

    Post.findById(postId, { ...filter }, (err, post) => {
      if (err) return next(err)

      return next(null, post)
    })
  }
  AppUser.remoteMethod('findPostByUserIdAndPostId', {
    isStatic: true,
    http: { verb: 'get', path: '/:userId/posts/:postId' },
    description: 'Find post',
    accepts: [
      {
        arg: 'userId',
        description: 'User ID',
        type: 'string',
        required: true,
      },
      {
        arg: 'postId',
        description: 'Post ID',
        type: 'string',
        required: true,
      },
      {
        arg: 'filter',
        type: 'object',
        http: { source: 'query' },
      },
    ],
    returns: {
      arg: 'data',
      type: 'object',
      root: true,
    },
  })

  AppUser.findPostByUsernameAndSlug = (username, slug, ctx, filter, next) => {
    let { Post } = AppUser.app.models

    AppUser.findOne({ where: { username } }, (err, appUser) => {
      if (err) return next(err)
      if (!appUser) return next(new Error('User not found'))

      Post.findOne({
        where: { authorId: appUser.id, slug },
        include: filter.include,
      }, (err, post) => {
        if (err) return next(err)
        if (!post) return next(new Error('Post not found'))

        next(null, post)
      })
    })
  }
  AppUser.remoteMethod('findPostByUsernameAndSlug', {
    isStatic: true,
    http: {
      verb: 'get',
      path: '/username/:username/posts/:slug',
      errorStatus: 404,
    },
    description: 'Get post with username and post slug.',
    accepts: [
      {
        arg: 'username',
        description: 'Username of post author',
        type: 'any',
        required: true,
      }, {
        arg: 'slug',
        description: 'Post slug',
        type: 'any',
        required: true,
      },
      {
        arg: 'ctx',
        type: 'object',
        http: { source: 'context' },
      }, {
        arg: 'filter',
        type: 'object',
        http: { source: 'query' },
      },
    ],
    returns: {
      arg: 'data',
      type: 'object',
      root: true,
    },
  })

  AppUser.updatePostByUserIdAndPostId = (userId, postId, data, next) => {
    let { Post, SeriesPost } = AppUser.app.models
    let { seriesPosts, ...updatedData } = data

    if (!seriesPosts) {
      seriesPosts = []
    }

    let seriesCount = seriesPosts.length
    let success = () => {
      Post.findById(postId, (err, post) => {
        if (err) return next(err)
        next(null, post)
      })
    }

    // Update target post
    Post.updateAll({
      id: postId,
      authorId: userId,
    }, {
      ...updatedData,
      seriesCount,
    }, (err, info) => {
      if (err) return next(err)

      // Update related series posts
      SeriesPost.find({
        where: { mainPostId: postId },
      }, (err, originSeriesPosts) => {
        if (err) return next(err)

        Post.updateAll({
          id: { inq: originSeriesPosts.map(post => post.seriesPostId) },
        }, {
          isInSeries: false,
        }, (err, info) => {
          if (err) return next(err)

          // skip if there is no series posts
          if (seriesCount === 0) {
            return success()
          }

          // start updating series posts
          SeriesPost.destroyAll({
            mainPostId: postId,
          }, (err, info) => {
            if (err) return next(err)

            SeriesPost.create(seriesPosts.map(seriesPostId => ({
              mainPostId: postId,
              seriesPostId,
            })), (err) => {
              if (err) return next(err)

              Post.updateAll({
                id: { inq: seriesPosts },
              }, {
                isInSeries: true,
              }, (err) => {
                if (err) return next(err)

                return success()
              })
            })
          })
        })
      })
    })
  }
  AppUser.remoteMethod('updatePostByUserIdAndPostId', {
    isStatic: true,
    http: { verb: 'put', path: '/:userId/posts/:postId' },
    description: 'Update post',
    accepts: [
      {
        arg: 'userId',
        description: 'User ID',
        type: 'string',
        required: true,
      },
      {
        arg: 'postId',
        description: 'Post ID',
        type: 'string',
        required: true,
      },
      {
        arg: 'data',
        description: 'An object contains post\'s data.',
        type: 'object',
        http: { source: 'body' },
        required: true,
      },
    ],
    returns: {
      arg: 'data',
      type: 'object',
      root: true,
    },
  })
}
