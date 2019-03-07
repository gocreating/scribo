'use strict'

const ObjectId = require('mongodb').ObjectId

module.exports = function(SeriesPost) {
  SeriesPost.defineProperty('mainPostId', { type: ObjectId })
  SeriesPost.defineProperty('seriesPostId', { type: ObjectId })
}
