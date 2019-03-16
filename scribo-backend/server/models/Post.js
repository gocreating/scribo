'use strict'

let whitelistMethods = require('../toolbox/whitelistMethods')
let appendAbstractBlocks = require('../hooks/post/appendAbstractBlocks')
let formatTimestamps = require('../hooks/post/formatTimestamps')

module.exports = function(Post) {
  whitelistMethods(Post, [
    'findById',
  ])

  Post.observe('before save', appendAbstractBlocks)
  Post.observe('before save', formatTimestamps)

  Post.findMixed = (filter, next) => {
    if (!filter) {
      filter = {
        include: [{
          relation: 'author',
          scope: {
            fields: ['username'],
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
        order: 'mergedCreatedAt DESC',
        limit: parseInt(Post.settings.scribo.limit),
      }
    }
    Post.find({ ...filter }, (err, posts) => {
      if (err) return next(err)

      next(null, posts)
    })
  }
  Post.remoteMethod('findMixed', {
    isStatic: true,
    http: {
      verb: 'get',
      path: '/mixed',
      errorStatus: 404,
    },
    description: 'Get posts of all users mixed together.',
    accepts: [
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
}
