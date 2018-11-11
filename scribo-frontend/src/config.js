/**
 * App Registration
 *   https://api.imgur.com/oauth2/addclient
 *
 * View Created Apps
 *   https://imgur.com/account/settings/apps
 */
let imgurClientID = {
  development: '3c24d2539de09eb',
  production: '95ac0b1d9572d86',
}
let donationHostMap = {
  development: 'http://localhost:4000',
  production: 'https://scribo-backend.herokuapp.com',
}
let disqusShortnameMap = {
  development: 'scribo-dev',
  production: 'scribo',
}

export default {
  imgur: {
    clientID: imgurClientID[process.env.NODE_ENV],
    maxSize: 10 * 1024 * 1024, // 10MB
  },
  donationHost: donationHostMap[process.env.NODE_ENV],
  disqusShortname: disqusShortnameMap[process.env.NODE_ENV],
}
