/**
 * example usage:
 * ```
 * npm run migrate -- 2019_03_16_add_post_order_timestamp.js
 * ```
 */

'use strict'

let path = require('path')
let app = require('../server.js')
let src = path.join(__dirname, process.argv[2])

console.log(src);
    
let migrationScript = require(src)

migrationScript(app)
