"use strict"

function draw () {
  jsPlumb.ready(function () {
    jsPlumb.connect({
      source: 'item-left',
      target: 'item-right',
      endpoint: 'Dot'
    })
  })
}


draw()
