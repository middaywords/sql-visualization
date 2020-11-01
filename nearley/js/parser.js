(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory()
  } else {
    root.parseSql = factory()
  }
}(this, function () {
'use strict'

function parseSql (text) {
  return new nearley.Parser(grammar).feed(text).results[0]
}

return parseSql
}))
