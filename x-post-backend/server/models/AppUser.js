'use strict'

let whitelistMethods = require('../toolbox/whitelistMethods')

module.exports = (AppUser) => {
  whitelistMethods(AppUser, [
    'create',
    'logout',
    'findById',
    '__get__posts',
    '__create__posts',
    '__findById__posts',
    '__updateById__posts',
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

  AppUser.findPostsByUsername = (username, filter, next) => {
    let { Post } = AppUser.app.models

    AppUser.findOne({ where: { username } }, (err, appUser) => {
      if (err) return next(err)
      if (!appUser) return next(new Error('User not found'))
      if (!filter) {
        filter = {
          include: 'author',
          fields: {
            id: true,
            authorId: true,
            slug: true,
            headerImage: true,
            title: true,
            subtitle: true,
            abstractBlocks: true,
            createdAt: true,
            updatedAt: true,
          },
          order: 'updatedAt DESC',
        }
      }
      Post.find({
        where: { authorId: appUser.id },
        ...filter,
      }, (err, posts) => {
        if (err) return next(err)

        next(null, posts)
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

      Post.find({
        where: { authorId: appUser.id, slug },
        include: filter.include,
      }, (err, post) => {
        if (err) return next(err)
        if (!post) return next(new Error('Post not found'))

        next(null, post[0])
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
}
