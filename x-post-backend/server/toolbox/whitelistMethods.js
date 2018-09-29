'use strict'

/**
 * this great idea comes from:
 *    https://github.com/strongloop/loopback/issues/651#issuecomment-167111395
 *
 * however, I changed the name to 'whitelistMethods' from 'disableAllMethods'
 * to make it more descriptive
 *
 * Note this only works on built-in methods, custom-made remote methods won't be blacklisted.
 *
 * @param model
 * @param methodsToExpose
 */

const log = require('./log')

function whitelistMethods(
  model,
  methodsToExpose = [],
  logHiddenMethods = false
) {
  if (model && model.sharedClass) {
    const modelName = model.sharedClass.name
    const methods = model.sharedClass.methods()
    const relationMethods = []
    const hiddenMethods = []

    try {
      Object.keys(model.definition.settings.relations).forEach((relation) => {
        relationMethods.push({
          name: `__findById__${relation}`,
          isStatic: false,
        })
        relationMethods.push({
          name: `__destroyById__${relation}`,
          isStatic: false,
        })
        relationMethods.push({
          name: `__updateById__${relation}`,
          isStatic: false,
        })
        relationMethods.push({
          name: `__exists__${relation}`,
          isStatic: false,
        })
        relationMethods.push({
          name: `__link__${relation}`,
          isStatic: false,
        })
        relationMethods.push({
          name: `__get__${relation}`,
          isStatic: false,
        })
        relationMethods.push({
          name: `__create__${relation}`,
          isStatic: false,
        })
        relationMethods.push({
          name: `__update__${relation}`,
          isStatic: false,
        })
        relationMethods.push({
          name: `__destroy__${relation}`,
          isStatic: false,
        })
        relationMethods.push({
          name: `__unlink__${relation}`,
          isStatic: false,
        })
        relationMethods.push({
          name: `__count__${relation}`,
          isStatic: false,
        })
        relationMethods.push({
          name: `__delete__${relation}`,
          isStatic: false,
        })
      })
    } catch (err) {
      throw err
    }

    methods.concat(relationMethods).forEach((method) => {
      const methodName = method.name

      if (methodsToExpose.indexOf(methodName) < 0) {
        hiddenMethods.push(methodName)
        model.disableRemoteMethod(methodName, method.isStatic)
      }
    })

    if (logHiddenMethods) {
      log(
        '\nRemote methods hidden for',
        modelName,
        ':',
        hiddenMethods.join(', '),
        '\n'
      )
    }
  }
}

module.exports = whitelistMethods
