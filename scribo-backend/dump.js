'use strict'

let fs = require('fs')
let jsesc = require('jsesc')
let env = require('./.env.private')
let serializedEnv = JSON.stringify(env)
let escapedEnv = jsesc(serializedEnv, {
  json: true,
})
let envValue = 'SECRET_ENVS=' + escapedEnv

console.log('Paste below as the value of `SECRET_ENVS`')
console.log('(Use unescaped in heroku)')
console.log('')
console.log('============ (Unescaped) ============')
console.log(serializedEnv)
console.log('')
console.log('============= (Escaped) =============')
console.log(escapedEnv)
console.log('')

fs.writeFile('./.env', envValue, (err) => {
  if (err) throw err
  console.log('File `.env` was succesfully saved!')
})
