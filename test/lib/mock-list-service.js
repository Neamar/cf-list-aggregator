var extend = require('lodash.assign')

module.exports = createListService

function createListService () {
  var lists = {}
    , id = 0

  return (
    { read: function (id, cb) {
        cb(null, lists[id])
      }
    , create: function (list, cb) {
        var _id = '_' + id++
        lists[_id] = list
        cb(null, extend({ _id: _id }, list))
      }
    })
}
