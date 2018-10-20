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
}
