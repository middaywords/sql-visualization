"use strict"

const example_list = ['sql-script2', 'sql-script3']


function getStorage (tag) {
  return localStorage.getItem('saved-' + tag)
}


function setStorage (tag, code) {
  localStorage.setItem('saved-' + tag, code)
}


function updateEditor (editor, code, tag) {
  editor.setValue(code, true)
  if (tag) {
    setStorage(tag, code)
  }
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


document.addEventListener('DOMContentLoaded', function () {
  /* editor */
  const editor = ace.edit('editor')
  editor.session.setMode("ace/mode/sql")
  //editor.renderer.setShowGutter(false)

  /* code save and load */
  const savedCode = getStorage(getTabName())
  if (savedCode !== null) {
    updateEditor(editor, savedCode)
  }
  window.addEventListener('beforeunload', function (e) {
    saveStorage(getTabName(), editor.getValue())
  })

  /* file input */
  const input_file = document.getElementById('file-input')
  async function loadFile () {
    const inputFile = input_file.files[0]
    if (!inputFile) {
      return
    }
    const content = await inputFile.text()
    if (input_file) {
      updateEditor(editor, content, getTabName())
    }
  }
  input_file.addEventListener('change', loadFile)
  document.getElementById('load-file').addEventListener('click', loadFile)

  /* example */
  const select_example = document.getElementById('example-select')
  for (let i = 0; i < example_list.length; i++){
    let opt = document.createElement('option')
    opt.value = example_list[i]
    opt.innerHTML = example_list[i]
    select_example.appendChild(opt)
  }
  function loadExample () {
    const exampleName = select_example.value
    if (!exampleName) {
      return
    }
    const xhr = new XMLHttpRequest()
    xhr.addEventListener('load', function () {
      updateEditor(editor, this.responseText, getTabName())
    })
    xhr.open('GET', 'examples/' + exampleName + '.sql')
    xhr.send()
  }
  select_example.addEventListener('change', loadExample)
  document.getElementById('load-example').addEventListener('click', loadExample)

  /* parser */
  document.getElementById('start-parse').addEventListener('click', function (event) {
    const sql = editor.getValue()
    if (!sql) {
      return
    }
    setStorage(default_tag, sql)
    const parser = new nearley.Parser(grammar.ParserRules, grammar.ParserStart)
    parser.feed(sql)
    console.log(parser.results)
  })
}, false)
