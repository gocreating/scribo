'use strict'

module.exports = function disableRobots(server) {
  server.get('/robots.txt', (req, res) => {
    res.send('User-agent: *\nDisallow: /')
  })
}
