'use strict'

jsPlumb.ready(function () {
  jsPlumb.setContainer(document.getElementById('diagram-container'))
})


function draw () {
  jsPlumb.connect({
    source: 'item-left',
    target: 'item-right',
    endpoint: 'Dot'
  })
  jsPlumb.draggable('item_left')
  jsPlumb.draggable('item_right')
}


jsPlumb.ready(function () {
  draw()
})
