(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.draw = factory()
  }
}(this, function () {
'use strict'

return
}))
