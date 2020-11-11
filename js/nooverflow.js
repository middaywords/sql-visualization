(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof exports === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.noOverflow = factory()
  }
}(this, function () {
'use strict'

function checkOverflow (element) {
  let curOverf = element.style.overflow
  if (!curOverf || curOverf === 'visible') {
    element.style.overflow = 'hidden'
  }

  let isOverflowing = element.clientWidth < element.scrollWidth
    || element.clientHeight < element.scrollHeight

  element.style.overflow = curOverf
  return isOverflowing
}


const resizeObserver = new ResizeObserver(function (entries) {
  for (let i = 0; i < entries.length; i++) {
    let element = entries[i].target
    while (true) {
      if (checkOverflow(element)) {
        if (!element.classList.contains('overflowed')) {
          element.classList.add('overflowed')
          element.dataset.oldWidth = element.scrollWidth
          element.dataset.oldHeight = element.scrollHeight
        }
        return
      } else {
        if (element.classList.contains('overflowed') &&
            element.clientWidth >= element.dataset.oldWidth &&
            element.clientHeight >= element.dataset.oldHeight) {
          element.classList.remove('overflowed')
        } else {
          return
        }
      }
    }
  }
})


function noOverflow (element) {
  resizeObserver.observe(element)
}


return noOverflow
}))
