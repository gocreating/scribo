/**
 * console.log that can be controlled by ENV variable 'DISABLE_LOGGER'
 */

'use strict';

module.exports = process.env.DISABLE_LOG === 'true' ? () => {} : console.log;
