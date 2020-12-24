'use strict'


  const SMALL_SCREEN_WIDTH = 544
  const EXAMPLE_LIST = ['sql-script2', 'sql-script3']

  function getStorage(tag) {
    return localStorage.getItem('saved-' + tag)
  }


  function setStorage(tag, code) {
    localStorage.setItem('saved-' + tag, code)
  }


  function getTabName(navbar, tab) {
    if (tab) {
      return 'code'
    }
    return 'code'
  }


  function switchTab(navbar, newTab, editor) {
    setStorage(getTabName(navbar), editor.getValue())
    editor.setValue(getStorage(getTabName(navbar, newTab)))
  }


  const dialogAbout = new A11yDialog(document.getElementById('dialog-about'))
  document.getElementById('btn-about').addEventListener('click', function (event) {
    dialogAbout.show()
  })


  /* parser */
  const splitterParser = Split(['#inspector'], {
    gutterSize: 5,
    direction: 'vertical',
    elementStyle: (dimension, size, gutterSize) => ({
      'flex-basis': `calc(${size}% - ${gutterSize}px)`,
      'height': `calc(${size}% - ${gutterSize}px)`,
    }),
    gutterStyle: (dimension, gutterSize) => ({
      'flex-basis': `${gutterSize}px`,
    }),
  })
  const btnShowParseProblem = document.getElementById('btn-show-parse-problem')
  const divParseResult = document.getElementById('inspector')
  function parseText(action, editor) {
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

    function addIndent(a, indent) {
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
    let res = profileData(graph.graph);


    // Todo:
    //  The mocked data should be used in draw()
    var mockData = getMockData(selectExample);

    draw(res.nodes, res.edges, mockData);
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

  // editor.on('change', parseText);

  $("#refresh-workflow").on('click', function () {

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
      'flex-basis': `${gutterSize}px`,
    }),
    onDrag: () => editor.resize()
  })

  function adjustEditorHeight() {
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

  function highlightNode(node) {
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

  // Parse Text
  document.getElementById('btn-parse').addEventListener('click', function (event) {
    parseText('change', editor)
  })

  /* file input */
  const inputFile = document.getElementById('input-file')
  async function loadFile() {
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
  for (let i = 0; i < EXAMPLE_LIST.length; i++) {
    let opt = document.createElement('option')
    opt.value = EXAMPLE_LIST[i]
    opt.innerHTML = EXAMPLE_LIST[i]
    selectExample.appendChild(opt)
  }
  function loadExample() {
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
  function p() {
    const text = editor.getValue()
    if (!text) {
      return
    }
    return AST.parse(text)
  }

  function init() {
    if (window.goSamples) goSamples();  // init for these samples -- you don't need to call this
    var $ = go.GraphObject.make;

    let myDiagram =
        $(go.Diagram, "diagram-container", // must be the ID or reference to an HTML DIV
            {
              layout: $(go.LayeredDigraphLayout, { direction: 90, layerSpacing: 10, setsPortSpots: false }),
              "undoManager.isEnabled": true  // enable undo & redo
            });

    // when the document is modified, add a "*" to the title and enable the "Save" button
    myDiagram.addDiagramListener("Modified", function(e) {
      var button = document.getElementById("SaveButton");
      if (button) button.disabled = !myDiagram.isModified;
      var idx = document.title.indexOf("*");
      if (myDiagram.isModified) {
        if (idx < 0) document.title += "*";
      } else {
        if (idx >= 0) document.title = document.title.substr(0, idx);
      }
    });

    function tooltipTextConverter(person){
      var str = "";
      str += person.value;
      return str;
    }
    var tooltiptemplate =
        $("ToolTip",
            {"Border.fill":"whitesmoke","Border.stroke":"black"},
            $(go.TextBlock,
                {
                  font:"bold 14pt Helvetica,bold Arial,sans-serif",
                  wrap:go.TextBlock.WrapFit,
                  margin:5
                },
                new go.Binding("text","",tooltipTextConverter))
        );

    // define the step Node template
    myDiagram.nodeTemplateMap.add("step",
        $(go.Node, "Auto",
            { locationSpot: go.Spot.Center },
            new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
            $(go.Shape, "Rectangle",
                {
                  fill: "whitesmoke",
                  stroke: "gray",
                  strokeWidth: 2,
                  // desiredSize: new go.Size(160, 60),
                  portId: "",  // so that links connect to the Shape, not to the whole Node
                  fromSpot: go.Spot.BottomSide,
                  toSpot: go.Spot.TopSide,
                  alignment: go.Spot.Center
                }),
            $(go.TextBlock,
                {
                  font: "bold 16px sans-serif",
                  alignment: go.Spot.Center,
                  wrap: go.TextBlock.WrapFit,
                  editable: true,
                  margin: 10,

                },
                new go.Binding("text", "text").makeTwoWay()),

        ));
    myDiagram.nodeTemplateMap.add("step_value",
        $(go.Node, "Auto",
            {toolTip: tooltiptemplate},
            { locationSpot: go.Spot.Center },
            new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
            $(go.Shape, "Rectangle",
                {
                  fill: "whitesmoke",
                  stroke: "#00A9C9",
                  strokeWidth: 2,
                  // desiredSize: new go.Size(160, 60),
                  portId: "",  // so that links connect to the Shape, not to the whole Node
                  fromSpot: go.Spot.BottomSide,
                  toSpot: go.Spot.TopSide,
                  alignment: go.Spot.Center
                }),
            $(go.TextBlock,
                {
                  font: "bold 16px sans-serif",
                  alignment: go.Spot.Center,
                  wrap: go.TextBlock.WrapFit,
                  editable: true,
                  margin: 10,

                },
                new go.Binding("text", "text").makeTwoWay()),

        ));

    // // define the transition Node template.
    // myDiagram.nodeTemplateMap.add("transition",
    //     $(go.Node, "Horizontal",
    //         { locationSpot: go.Spot.Center, locationObjectName: "BAR" },
    //         new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
    //         $(go.Shape, "Rectangle",
    //             {
    //               name: "BAR",
    //               fill: "black",
    //               stroke: null,
    //               desiredSize: new go.Size(60, 8),
    //               portId: "",
    //               fromSpot: go.Spot.BottomSide,
    //               toSpot: go.Spot.TopSide
    //             }),
    //         $(go.TextBlock,
    //             { editable: true, margin: 3 },
    //             new go.Binding("text", "text").makeTwoWay())
    //     ));
    //
    // // define the parallel Node template.
    // myDiagram.nodeTemplateMap.add("parallel",
    //     $(go.Node,
    //         { locationSpot: go.Spot.Center },
    //         new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
    //         $(go.Shape, "Rectangle",
    //             {
    //               fill: "whitesmoke",
    //               stroke: "black",
    //               fromSpot: go.Spot.Bottom,
    //               toSpot: go.Spot.Top,
    //               desiredSize: new go.Size(200, 6),
    //               portId: "",
    //               fromSpot: go.Spot.BottomSide,
    //               toSpot: go.Spot.TopSide
    //             })
    //     ));

    // define the Link template
    myDiagram.linkTemplate =
        $(go.Link,
            { routing: go.Link.Orthogonal },
            $(go.Shape,
                { stroke: "black", strokeWidth: 2 }),
            $(go.Shape,
                {
                  stroke: null,
                  toArrow: "Standard",
                })
        );
    return myDiagram;
  }
  let diagram = init();

// let graph = { "class": "go.GraphLinksModel",
//   "nodeDataArray": [
//     {"key":"S1", "category":"step", "text":"Step 1"},
//     {"key":"TR1", "category":"transition", "text":"Transition 1"},
//     {"key":"S2", "category":"step", "text":"Step 2"},
//     {"key":"TR2", "category":"transition", "text":"Transition 2"},
//     {"key":"BAR1", "category":"parallel" },
//     {"key":"S3", "category":"step", "text":"Step 3"},
//     {"key":"S4", "category":"step", "text":"Step 4"},
//     {"key":"BAR2", "category":"parallel" },
//     {"key":"TR3", "category":"transition", "text":"Transition 3"},
//     {"key":"S5", "category":"step", "text":"Step 5"}
//   ],
//   "linkDataArray": [
//     {"from":"S1", "to":"TR1"},
//     {"from":"TR1", "to":"S2"},
//     {"from":"S2", "to":"TR2"},
//     {"from":"TR2", "to":"BAR1"},
//     {"from":"BAR1", "to":"S3"},
//     {"from":"BAR1", "to":"S4"},
//     {"from":"S3", "to":"BAR2"},
//     {"from":"S4", "to":"BAR2"},
//     {"from":"BAR2", "to":"TR3"},
//     {"from":"TR3", "to":"S5"}
//   ]};

  function load(graph) {
    diagram.model = go.Model.fromJson(graph);
  }
