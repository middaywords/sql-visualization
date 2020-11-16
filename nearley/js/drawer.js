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
    if (edges[i].from == 0) {
      roots.push(nodes[edges[i].to - 1]);
      nodes[edges[i].to - 1].depth = 1;
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
      let nextNodeIndex = edges[i].to - 1;
      if (edges[i].from == id) {
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
        if (edge.from == 0) {
          continue;
        }
        let fromNodeId = "node-" + nodes[edge.from - 1].id;
        let toNodeId = "node-" + nodes[edge.to - 1].id;
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

return initializeElements
}))
