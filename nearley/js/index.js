'use strict'

const SMALL_SCREEN_WIDTH = 544
const EXAMPLE_LIST = ['sql-script2', 'sql-script3']


function getStorage (tag) {
  return localStorage.getItem('saved-' + tag)
}


function setStorage (tag, code) {
  localStorage.setItem('saved-' + tag, code)
}


function getTabName (navbar, tab) {
  if (tab) {
    return 'code'
  }
  return 'code'
}


function switchTab (navbar, newTab, editor) {
  setStorage(getTabName(navbar), editor.getValue())
  updateEditor(editor, getStorage(getTabName(navbar, newTab)))
}


const splitterMain = Split(['#left-panel', '#right-panel'], {
  elementStyle: (dimension, size, gutterSize) => ({
    'flex-basis': `calc(${size}% - ${gutterSize}px)`,
    'width': `calc(${size}% + .5 * ${gutterSize}px)`,
  }),
  gutterStyle: (dimension, gutterSize) => ({
    'flex-basis':  `${gutterSize}px`,
  }),
})
const dialogAbout = new A11yDialog(document.getElementById('dialog-about'))
document.getElementById('btn-about').addEventListener('click', function (event) {
  dialogAbout.show()
})


/* parser */
const splitterParser = Split(['#diagram-container', '#parse-result'], {
  gutterSize: 5,
  direction: 'vertical',
  elementStyle: (dimension, size, gutterSize) => ({
    'flex-basis': `calc(${size}% - ${gutterSize}px)`,
    'height': `calc(${size}% - ${gutterSize}px)`,
  }),
  gutterStyle: (dimension, gutterSize) => ({
    'flex-basis':  `${gutterSize}px`,
  }),
})
const btnShowParseError = document.getElementById('btn-show-parse-error')
function parseText (action, editor) {
  btnShowParseError.classList.remove('warning')
  const text = editor.getValue()
  if (!text) {
    return
  }
  setStorage(getTabName(), text)
  let result
  try {
    result = parseSql(text)
  } catch (e) {
    //console.log(e)
    btnShowParseError.classList.add('warning')
    return
  }
  ReactDOM.render(React.createElement(ReactInspector.ObjectInspector, {
    data: result
  }), document.getElementById('parse-result'))
}


/* editor */
noOverflow(document.getElementById('editor-bar'))

const editor = ace.edit('editor')
editor.session.setMode('ace/mode/sql')

function updateEditor (editor, code, tag) {
  editor.setValue(code, true)
  if (tag) {
    setStorage(tag, code)
  }
  parseText(undefined, editor)
}
editor.on('change', parseText)

function adjustEditorHeight () {
  document.getElementById('editor').style.height =
    window.innerHeight -
    document.getElementsByTagName('header')[0].offsetHeight -
    document.getElementById('editor-bar').offsetHeight -
    (window.innerWidth > SMALL_SCREEN_WIDTH ? 0 :
      document.getElementById('right-panel').offsetHeight) + 'px'
}
window.addEventListener('resize', adjustEditorHeight)
adjustEditorHeight()

document.getElementById('select-fontsize').addEventListener('change', function (event) {
  const fontsize = event.target.value
  if (!fontsize) {
    return
  }
  editor.setFontSize(+fontsize)
  localStorage.setItem('editor-fontsize', fontsize)
  event.target.value = ''
})
const oldFontsize = localStorage.getItem('editor-fontsize')
if (oldFontsize) {
  editor.setFontSize(+oldFontsize)
}


/* code save and load */
const savedCode = getStorage(getTabName())
if (savedCode) {
  updateEditor(editor, savedCode)
  const oldCursorPosition = localStorage.getItem('editor-cursor')
  if (oldCursorPosition) {
    editor.moveCursorToPosition(JSON.parse(oldCursorPosition))
  }
}
window.addEventListener('beforeunload', function (e) {
  localStorage.setItem('editor-cursor', JSON.stringify(editor.getCursorPosition()))
  setStorage(getTabName(), editor.getValue())
})
const dialogSaveload = new A11yDialog(document.getElementById('dialog-saveload'))
document.getElementById('btn-saveload').addEventListener('click', function (event) {
  dialogSaveload.show()
})


/* file input */
const inputFile = document.getElementById('input-file')
async function loadFile () {
  const file = inputFile.files[0]
  if (!file) {
    return
  }
  const content = await file.text()
  if (inputFile) {
    updateEditor(editor, content, getTabName())
  }
  dialogSaveload.hide()
}
inputFile.addEventListener('change', loadFile)


/* example */
const selectExample = document.getElementById('select-example')
for (let i = 0; i < EXAMPLE_LIST.length; i++){
  let opt = document.createElement('option')
  opt.value = EXAMPLE_LIST[i]
  opt.innerHTML = EXAMPLE_LIST[i]
  selectExample.appendChild(opt)
}
function loadExample () {
  const exampleName = selectExample.value
  if (!exampleName) {
    return
  }
  const xhr = new XMLHttpRequest()
  xhr.addEventListener('load', function () {
    updateEditor(editor, this.responseText, getTabName())
  })
  xhr.open('GET', 'examples/' + exampleName + '.sql')
  xhr.send()
  dialogSaveload.hide()
}
selectExample.addEventListener('change', loadExample)


//debug
function p () {
  const text = editor.getValue()
  if (!text) {
    return
  }
  return parseSql(text)
}