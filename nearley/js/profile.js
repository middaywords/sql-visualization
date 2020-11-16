(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
      define([], factory);
    } else if (typeof exports === 'object' && module.exports) {
      module.exports = factory();
    } else {
      root.profileData = factory()
    }
  }(this, function () {
  'use strict'

  var nodeCount;

  function profileData(item) {
      nodeCount = 0;
      return recursiveSearch(item, nodeCount);
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
        edges.push({
          from: parent_id, 
          to: nodeCount
        });
        let subset = recursiveSearch(column, nodeCount);
        nodes = nodes.concat(subset.nodes);
        edges = edges.concat(subset.edges);
      });
    }
    // Column
    else if ('froms' in item) {
      let astnode = item.asts[item.asts.length - 1]
      if (('column' in astnode) || ('name' in astnode)) {
        nodes.push({
          id: ++nodeCount,
          name: ('column' in astnode) ? (astnode.table.name + '.' + astnode.column.name) : (astnode.name),
          type: 'Column'
        });
        edges.push({
          from: parent_id, 
          to: nodeCount
        });
      } 
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
      edges.push({
        from: parent_id, 
        to: nodeCount
      });
      parent_id = nodeCount;
      for (let value of item.variables.values()) {
        let subset = recursiveSearch(value, parent_id);
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
      edges.push({
        from: parent_id, 
        to: nodeCount
      });
    }
  
    return {
      nodes: nodes,
      edges: edges
    }
  }

  return profileData
}))