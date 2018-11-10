'use strict'

let envs = process.env.SECRET_ENVS

if (envs) {
  envs = JSON.parse(envs)
  console.log('Read env from environment variables')
} else {
  envs = require('./.env.private')
  console.log('Read env from private file')
}

module.exports = envs
