var extend = require('lodash.assign')
  , save = require('save')
  , crudService = require('crud-service')
  , logger = require('mc-logger')
  , createItemSchema = require('./item-schema')

function createPublicQuery (query, options) {

  var now = options && options.date ? options.date : new Date()
    , publicQuery = extend({}, query
      , { state: 'Published'
        , $and:
          [ { $or: [ { liveDate: null }, { liveDate: { $lte: now } } ] }
          , { $or: [ { expiryDate: null }, { expiryDate: { $gte: now } } ] }
          ]
        })

  if (query.previewId) publicQuery = query

  return publicQuery

}

module.exports = function (saveEngine) {
  return function () {
    // Create a unique name for the memgo engine so it always starts empty.
    var articleSave = save('article', { engine: saveEngine, debug: false, logger: logger })
      , schema = createItemSchema()
      , service = crudService('article', articleSave, schema)

    // Find the articles that are available to the public
    service.findPublic = function (query, options, callback) {
      service.find(createPublicQuery(query, options), options, callback)
    }

    return service
  }
}
