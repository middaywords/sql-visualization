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

	function initializeElements(nodes, edges) {
		for (var i = 0; i < nodes.length; i++) {
			nodes[i].children = [];
		}
		for (var i = 0; i < edges.length; i++) {
			if (edges[i].from > 0) {
				nodes[edges[i].from - 1].children.push(edges[i].to);
			}
		}
		$("#workflow-1").empty();
		// 手动布局
		// TODO 先把根节点找出来，对每个子节点编上高度。这不是典型的树，有的节点 有可能会
		//找到所有根
		for (var i = 0; i < nodes.length; i++) {
			nodes[i].depth = 1;
		}

		let rootIndexes = new Array();
		for (var i = 0; i < edges.length; i++) {
			if (edges[i].from == 0) {
				rootIndexes.push(edges[i].to - 1);
			}
		}
		let visited = new Array(nodes.length);
		for (var i = 0; i < visited.length; i++) {
			visited[i] = false;
		}
		let currentWidth = 0;
		let currentMaxWidth = 0;
		let widthDepth = new Array(100);
		for (var i = 0; i < widthDepth.length; i++) {
			widthDepth[i] = 1;
		}

		function dfs(nodeIndex, depth = 1) {
			nodes[nodeIndex].depth = Math.max(depth, nodes[nodeIndex].depth);
			let children = nodes[nodeIndex].children;
			if (children.length == 0) {
				nodes[nodeIndex].left = currentWidth + widthDepth[depth]++;
				currentMaxWidth = Math.max(currentMaxWidth, nodes[nodeIndex].left);
				for (var i = depth + 1; i < widthDepth.length; i++) {
					widthDepth[i] = widthDepth[depth];
				}
				return nodes[nodeIndex].left;
			}
			if (visited[nodeIndex]) {
				return -1;
			}
			visited[nodeIndex] = true;
			let sumWidth = 0;
			let countValidChild = 0;
			for (var i = 0; i < children.length; i++) {
				let nextIndex = children[i] - 1;
				let left = dfs(nextIndex, depth + 1);
				if (left > 0) {
					sumWidth += left - currentWidth;
					countValidChild++;
				}
			}
			sumWidth /= countValidChild;
			nodes[nodeIndex].left = currentWidth + Math.max(sumWidth, widthDepth[depth]);
			currentMaxWidth = Math.max(currentMaxWidth, nodes[nodeIndex].left);
			widthDepth[depth] = nodes[nodeIndex].left + 1 - currentWidth;

			return nodes[nodeIndex].left;
		}

		for (var i = 0; i < rootIndexes.length; i++) {
			dfs(rootIndexes[i], 1);
			currentWidth = currentMaxWidth;
			currentMaxWidth = 0;
			for (var j = 0; j < widthDepth.length; j++) {
				widthDepth[j] = 1;
			}
		}

		for (let i = 0; i < nodes.length; i++) {
			let divState = document.createElement("div");
			let divEp = document.createElement("div");
			divEp.className = 'ep';
			divState.className = "w state";
			divState.id = "node-" + nodes[i].id;
			divState.title = nodes[i].name;
			if (nodes[i].name.length > 20) {
				divState.innerHTML = nodes[i].name.substring(0, 20) + "..." + divEp.outerHTML;
			} else {
				divState.innerHTML = nodes[i].name + divEp.outerHTML;
			}

			divState.style.top = (50 + 150 * (nodes[i].depth)) + 'px';
			divState.style.maxWidth = "150px";
			// divState.style.left = (50 + 300 * ((maxWidth - nodeDepthWidth[nodes[i].depth-1]++) / 2 + currentLayout[nodes[i].depth-1]++)) + 'px';
			divState.style.left = (50 + 300 * (nodes[i].left)) + 'px';
			$("#workflow-1").append(divState);
		}


		var transitionData,
			workflow1;
		// Transition (Connection between States) Data
		transitionData = { transitions: {} };
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
