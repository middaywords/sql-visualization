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
  editor.setValue(getStorage(getTabName(navbar, newTab)))
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
const splitterParser = Split(['#diagram-container', '#inspector'], {
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
const divParseResult = document.getElementById('inspector')
function parseText (action, editor) {
  btnShowParseError.classList.remove('warning')
  const text = editor.getValue()
  if (!text) {
    ReactDOM.unmountComponentAtNode(divParseResult)
    divParseResult.innerHTML = ''
    return
  }

  // try parse
  let result
  try {
    result = AST.parse(text)
  } catch (e) {
    //console.log(e)
    btnShowParseError.classList.add('warning')
    return
  }
  if (!result) {
    return
  }
  setStorage(getTabName(), text)
  // take the first statement
  result = result[0]

  // create graph
  const graph = result.analyse().postfix()

  function addIndent (a, indent) {
    return Array.isArray(a) ?
      a.map(i => addIndent(i, indent + '  ')).join('\n' + indent) : a
  }
  const describe = graph.graph.describe()

  // dump
  const babel = `
  ReactDOM.render(
    <div>
      <p id="inspector-ast">
        AST: <ReactInspector.ObjectInspector data={result} />
      </p>
      <p id="inspector-resemble">
        Resemble: <ReactInspector.ObjectInspector data={result.toString()} />
      </p>
      <p id="inspector-graph">
        Graph: <ReactInspector.ObjectInspector data={graph} />
      </p>
      <p id="inspector-describe">
        Describe: <ReactInspector.ObjectInspector data={describe} />
        <pre>{addIndent(describe, '  ')}</pre>
      </p>
    </div>,
    divParseResult)
`
ReactDOM.render( /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
  id: "inspector-ast"
}, "AST: ", /*#__PURE__*/React.createElement(ReactInspector.ObjectInspector, {
  data: result
})), /*#__PURE__*/React.createElement("p", {
  id: "inspector-resemble"
}, "Resemble: ", /*#__PURE__*/React.createElement(ReactInspector.ObjectInspector, {
  data: result.toString()
})), /*#__PURE__*/React.createElement("p", {
  id: "inspector-graph"
}, "Graph: ", /*#__PURE__*/React.createElement(ReactInspector.ObjectInspector, {
  data: graph
})), /*#__PURE__*/React.createElement("p", {
  id: "inspector-describe"
}, "Describe: ", /*#__PURE__*/React.createElement(ReactInspector.ObjectInspector, {
  data: describe
}), /*#__PURE__*/React.createElement("pre", null, addIndent(describe, '  ')))), divParseResult);
}


/* editor */
noOverflow(document.getElementById('editor-bar'))

const editor = ace.edit('editor')
for (let script of document.getElementsByTagName('script')) {
  if (script.src.endsWith('ace.min.js')) {
    ace.config.set('basePath', script.src.slice(null, -'ace.min.js'.length))
    break
  }
}
editor.session.setMode('ace/mode/sql')
editor.on('change', parseText)

function adjustEditorHeight () {
  if (window.innerWidth > SMALL_SCREEN_WIDTH) {
    document.getElementById('main').style.height =
      window.innerHeight -
      document.getElementsByTagName('header')[0].offsetHeight + 'px'
  }
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

document.getElementById('btn-clear').addEventListener('click', function (event) {
  editor.setValue('')
})
document.getElementById('btn-redo').addEventListener('click', function (event) {
  editor.redo()
})
document.getElementById('btn-undo').addEventListener('click', function (event) {
  editor.undo()
})


/* code save and load */
const savedCode = getStorage(getTabName())
if (savedCode) {
  editor.setValue(savedCode)
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
    editor.setValue(content)
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
    editor.setValue(this.responseText)
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
  return AST.parse(text)
}
