'use strict'
jsWorkflow.ready(function(){


const SMALL_SCREEN_WIDTH = 544
const EXAMPLE_LIST = ['sql-script2', 'sql-script3']
var nodeCount = 0;
let globalNodes, globalEdges;
// $("#graph").hide();



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


const dialogAbout = new A11yDialog(document.getElementById('dialog-about'))
document.getElementById('btn-about').addEventListener('click', function (event) {
  dialogAbout.show()
})


/* parser */
const splitterParser = Split([ '#inspector'], {
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
const btnShowParseProblem = document.getElementById('btn-show-parse-problem')
const divParseResult = document.getElementById('inspector')
function parseText (action, editor) {
  btnShowParseProblem.classList.remove('parse-problem')
  btnShowParseProblem.classList.remove('parse-continue')
  btnShowParseProblem.classList.remove('parse-error')
  btnShowParseProblem.classList.remove('parse-warning')
  const text = editor.getValue()
  if (!text) {
    // clear all results
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
    btnShowParseProblem.classList.add('parse-problem')
    btnShowParseProblem.classList.add('parse-error')
    return
  }
  if (!result) {
    btnShowParseProblem.classList.add('parse-problem')
    btnShowParseProblem.classList.add('parse-continue')
    return
  }
  setStorage(getTabName(), text)
  // take the first statement
  result = result[0]

  // create graph
  const graph = result.analyse().postfix()
  // mark erroneous
  const existingMarkers = editor.session.getMarkers()
  // !!!
  for (let i in existingMarkers) {
    const marker = existingMarkers[i]
    if (marker.type === 'highlight' || marker.type === 'erroneous') {
      editor.session.removeMarker(marker.id)
    }
  }
  graph.columns.forEach(coloum => {
    if (coloum.dangling) {
      btnShowParseProblem.classList.add('parse-problem')
      btnShowParseProblem.classList.add('parse-warning')
      for (let ast of coloum.asts) {
        if (ast instanceof AST.ColumnSelection) {
          ast = ast.expr
        }
        editor.session.addMarker(ast.getRange(), 'ace_erroneous', 'erroneous')
        if (ast instanceof AST.ColumnSelection) {
          break
        }
      }
    }
  })

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

  console.log(graph.graph);
  nodeCount = 0;
  let res = recursiveSearch(graph.graph, 0);
  // console.log(JSON.stringify(res.nodes));
  // console.log(JSON.stringify(res.edges));
  // console.log(res.nodes);
  // console.log(res.edges);
  for (var i = 0; i < res.nodes.length; i++) {
    res.nodes[i].depth = 1;
  }
  globalNodes = res.nodes;
  globalEdges = res.edges;
  console.log(globalNodes);
  console.log(globalEdges);
  initializeElements(res.nodes, res.edges);

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
editor.session.setMode('ace/mode/sql');

  editor.on('change', parseText);

  $("#refresh-workflow").on('click', function(){

  });
  $("#enable-arrow").on('change', function () {
    if ($("#enable-arrow").is(':checked')) {
      $(".ep").show();
    } else {
      $(".ep").hide();
    }
  });
const splitterMain = Split(['#left-panel', '#right-panel'], {
  elementStyle: (dimension, size, gutterSize) => ({
    'flex-basis': `calc(${size}% - ${gutterSize}px)`,
    'width': `calc(${size}% + .5 * ${gutterSize}px)`,
  }),
  gutterStyle: (dimension, gutterSize) => ({
    'flex-basis':  `${gutterSize}px`,
  }),
  onDrag: () => editor.resize()
})

function adjustEditorHeight () {
  document.getElementById('main').style.height =
    window.innerHeight -
    document.getElementsByTagName('header')[0].offsetHeight + 'px'
  if (window.innerWidth > SMALL_SCREEN_WIDTH) {
  }
  editor.resize()
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

function highlightNode (node) {
  const existingMarkers = editor.session.getMarkers()
  // !!!
  for (let i in existingMarkers) {
    const marker = existingMarkers[i]
    if (marker.type === 'highlight') {
      editor.session.removeMarker(marker.id)
    }
  }
  for (let ast of node.asts) {
    editor.session.addMarker(ast.getRange(), 'ace_highlight', 'highlight')
  }
}


/* code save and load */
const savedCode = getStorage(getTabName())
if (savedCode) {
  editor.setValue(savedCode)
  const oldCursorPosition = localStorage.getItem('editor-cursor')
  if (oldCursorPosition) {
    editor.moveCursorToPosition(JSON.parse(oldCursorPosition))
  }
  editor.selection.clearSelection()
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

function recursiveSearch(item, parent_id) {
  let nodes = new Array;
  let edges = new Array;
  // View
  if ('columns' in item) {
    let columns = Array.from(item.columns);
    columns.forEach(column => {
      nodes.push({
        id: ++nodeCount,
        name: column.name,
        type: 'Column',
        depth: 1
      });
      edges.push({parent_id, nodeCount});
      let subset = recursiveSearch(column, nodeCount);
      nodes = nodes.concat(subset.nodes);
      edges = edges.concat(subset.edges);
    });
  }
  // Column
  else if ('froms' in item) {
    let astnode = item.asts[item.asts.length - 1]
    nodes.push({
      id: ++nodeCount,
      name: ('column' in astnode) ? (astnode.table.name + '.' + astnode.column.name) : (astnode.name),
      type: 'Column'
    });
    edges.push({parent_id, nodeCount});
    for (let value of item.froms.values()) {
      let subset = recursiveSearch(value, nodeCount);
      nodes = nodes.concat(subset.nodes);
      edges = edges.concat(subset.edges);
    }
  }
  // Expression
  else if ('variables' in item) {
    nodes.push({
      id: ++nodeCount,
      name: item.text,
      type: 'Expression'
    });
    edges.push({parent_id, nodeCount});
    for (let value of item.variables.values()) {
      let subset = recursiveSearch(value, nodeCount);
      nodes = nodes.concat(subset.nodes);
      edges = edges.concat(subset.edges);
    }
  }
  // Table
  else if ('structure' in item) {
    nodes.push({
      id: ++nodeCount,
      name: item.name,
      type: 'Table'
    });
    edges.push({parent_id, nodeCount});
  }

  return {
    nodes: nodes,
    edges: edges
  }
}



function initializeElements(nodes, edges){


  $("#workflow-1").empty();
  // 手动布局
  // TODO 先把根节点找出来，对每个子节点编上高度。这不是典型的树，有的节点 有可能会
  //找到所有根

  for (var i = 0; i < nodes.length; i++) {
    nodes[i].depth = 1;
  }

  let roots = new Array();
  for (var i = 0; i < edges.length; i++) {
    if (edges[i].parent_id == 0) {
      roots.push(nodes[edges[i].nodeCount - 1]);
      nodes[edges[i].nodeCount - 1].depth = 1;
    }
  }


  let queue = new Array();//存储下标
  let queueHead = 0;
  let visited = new Array(nodes.length);
  for (var i = 0; i < visited.length; i++) {
    visited[i] = false;
  }
  for (var i = 0; i < roots.length; i++) {
    queue.push(roots[i].id - 1);
    visited[roots[i].id - 1] = true;
  }


  while(queueHead < queue.length){
    let id = queue[queueHead++] + 1;

    for(let i = 0; i < edges.length; i++){
      let nextNodeIndex = edges[i].nodeCount - 1;
      if (edges[i].parent_id == id) {
        if (!visited[nextNodeIndex]) {
          queue.push(nextNodeIndex);
          visited[nextNodeIndex] = true;
        }
        nodes[nextNodeIndex].depth = Math.max(nodes[nextNodeIndex].depth, nodes[id-1].depth + 1);
      }
    }


  }

  // console.log(nodeDepth);
  let maxDepth = 0;//找到最大的深度
  for (var i = 0; i < nodes.length; i++) {
    maxDepth = Math.max(nodes[i].depth, maxDepth);
  }
  //计算每个深度的元素个数
  let nodeDepthWidth = new Array(maxDepth);
  for (var i = 0; i < nodeDepthWidth.length; i++) {
    nodeDepthWidth[i] = 0;
  }
  for (var i = 0; i < nodes.length; i++) {
    nodeDepthWidth[nodes[i].depth - 1] ++;
  }
  let maxWidth = Math.max.apply(null, nodeDepthWidth);
  let currentLayout = new Array(maxDepth);
  for (var i = 0; i < currentLayout.length; i++) {
    currentLayout[i] = 0;
  }

  for (let i = 0; i < nodes.length; i++) {
    let divState = document.createElement("div");
    let divEp = document.createElement("div");
    divEp.className = 'ep';
    divState.className = "w state";
    divState.id = "node-" + nodes[i].id;
    divState.innerHTML = nodes[i].name + divEp.outerHTML;
    divState.style.top = (150 * (nodes[i].depth) + 50) + 'px';
    divState.style.left = (50 + 600 * ((maxWidth - nodeDepthWidth[nodes[i].depth-1]++) / 2 + currentLayout[nodes[i].depth-1]++)) + 'px';
    $("#workflow-1").append(divState);
  }

  var transitionData,
        workflow1;
      // Transition (Connection between States) Data
      transitionData = {transitions:{}};
      for (let i = 0; i < edges.length; i++) {
        let edge = edges[i];
        if (edge.parent_id == 0) {
          continue;
        }
        let fromNodeId = "node-" + nodes[edge.parent_id - 1].id;
        let toNodeId = "node-" + nodes[edge.nodeCount - 1].id;
        if (transitionData.transitions[fromNodeId]) {
          transitionData.transitions[fromNodeId] += "," + toNodeId;
        } else {
          transitionData.transitions[fromNodeId] = toNodeId;
        }
      }
      console.log(transitionData);
      // Create a new workflow instance as workflow1
      workflow1 = new jsWorkflow.Instance();

      // Initialize workflow1 with workflow container id
      workflow1.init('workflow-1');

      // Establish transitions among all the workflow States
      workflow1.instance.createStateTrasitions(transitionData);

}

$("#graph").hide();
$("#show-graph").click(function(){
  $("#main").hide();
  $("#graph").show();
  initializeElements(globalNodes, globalEdges);

});
$("#refresh-workflow").click(function(){
  initializeElements(globalNodes, globalEdges);
});
$("#back-edit").click(function(){
  $("#main").show();
  $("#graph").hide();
});
});
