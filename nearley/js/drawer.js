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

	function initializeElements(nodes, edges, mockData) {
		console.log(nodes);
		console.log(edges);
		console.log(mockData);
		let mData = {};
		$("#data-table-div").hide();
		if (mockData != null) {
			// 任选一组mock数据
			$("#data-table-div").show();
			$("#data-table-body").empty();
			$("#data-table-head").empty();
			let tdKey = document.createElement("td");
			tdKey.innerText = "字段";
			$("#data-table-head").append(tdKey);
			for (let j = 0; j < mockData.length; j++) {
				let tdValue = document.createElement("td");
				tdValue.innerText = "值" + (j + 1);
				$("#data-table-head").append(tdValue);
			}
			for (const mDataKey in mockData[0]) {

				let tr = document.createElement("tr");
				let tdKey = document.createElement("td");
				tdKey.innerText = mDataKey;
				tr.append(tdKey);
				for (let j = 0; j < mockData.length; j++) {
					let tdValue = document.createElement("td");
					tdValue.innerText = mockData[j][mDataKey];
					tr.append(tdValue);
				}
				$("#data-table-body").append(tr);
			}
		}


		let graph = {
			"class": "go.GraphLinksModel",
			"nodeDataArray": [
				// {"key":"S1", "category":"step", "text":"Step 1"},
				// {"key":"TR1", "category":"transition", "text":"Transition 1"},
				// {"key":"S2", "category":"step", "text":"Step 2"},
				// {"key":"TR2", "category":"transition", "text":"Transition 2"},
				// {"key":"BAR1", "category":"parallel" },
				// {"key":"S3", "category":"step", "text":"Step 3"},
				// {"key":"S4", "category":"step", "text":"Step 4"},
				// {"key":"BAR2", "category":"parallel" },
				// {"key":"TR3", "category":"transition", "text":"Transition 3"},
				// {"key":"S5", "category":"step", "text":"Step 5"}
			],
			"linkDataArray": [
				// {"from":"S1", "to":"TR1"},
				// {"from":"TR1", "to":"S2"},
				// {"from":"S2", "to":"TR2"},
				// {"from":"TR2", "to":"BAR1"},
				// {"from":"BAR1", "to":"S3"},
				// {"from":"BAR1", "to":"S4"},
				// {"from":"S3", "to":"BAR2"},
				// {"from":"S4", "to":"BAR2"},
				// {"from":"BAR2", "to":"TR3"},
				// {"from":"TR3", "to":"S5"}
			]
		};
		for (const node of nodes) {
			let text = node.name;
			if (mockData != null && mockData[0].hasOwnProperty(text)) {
				let value = "\n";
				for (let j = 0; j < mockData.length; j++) {
					value += "值" + (j + 1) + ": " + mockData[j][text] + '\n';
				}
				graph["nodeDataArray"].push({
					"key": node.id,
					"category": "step_value",
					"text": node.name,
					"value": value
				});
			} else {
				graph["nodeDataArray"].push({
					"key": node.id,
					"category": "step",
					"text": node.name
				});
			}

		}
		for (let i = 1; i < edges.length; i++) {
			graph.linkDataArray.push({
				"from": edges[i].from,
				"to": edges[i].to
			})
		}
		load(graph);
	}
	// 	for (var i = 0; i < nodes.length; i++) {
	// 		nodes[i].children = [];
	// 	}
	// 	for (var i = 0; i < edges.length; i++) {
	// 		if (edges[i].from > 0) {
	// 			nodes[edges[i].from - 1].children.push(edges[i].to);
	// 		}
	// 	}
	// 	$("#workflow-1").empty();
	// 	// 手动布局
	// 	// TODO 先把根节点找出来，对每个子节点编上高度。这不是典型的树，有的节点 有可能会
	// 	//找到所有根
	// 	for (var i = 0; i < nodes.length; i++) {
	// 		nodes[i].depth = 1;
	// 	}
	//
	// 	let rootIndexes = new Array();
	// 	for (var i = 0; i < edges.length; i++) {
	// 		if (edges[i].from == 0) {
	// 			rootIndexes.push(edges[i].to - 1);
	// 		}
	// 	}
	// 	let visited = new Array(nodes.length);
	// 	for (var i = 0; i < visited.length; i++) {
	// 		visited[i] = false;
	// 	}
	// 	let currentWidth = 0;
	// 	let currentMaxWidth = 0;
	// 	let widthDepth = new Array(100);
	// 	for (var i = 0; i < widthDepth.length; i++) {
	// 		widthDepth[i] = 1;
	// 	}
	//
	// 	function dfs(nodeIndex, depth = 1) {
	// 		nodes[nodeIndex].depth = Math.max(depth, nodes[nodeIndex].depth);
	// 		let children = nodes[nodeIndex].children;
	// 		if (children.length == 0) {
	// 			nodes[nodeIndex].left = currentWidth + widthDepth[depth]++;
	// 			currentMaxWidth = Math.max(currentMaxWidth, nodes[nodeIndex].left);
	// 			for (var i = depth + 1; i < widthDepth.length; i++) {
	// 				widthDepth[i] = widthDepth[depth];
	// 			}
	// 			return nodes[nodeIndex].left;
	// 		}
	// 		if (visited[nodeIndex]) {
	// 			return -1;
	// 		}
	// 		visited[nodeIndex] = true;
	// 		let sumWidth = 0;
	// 		let countValidChild = 0;
	// 		for (var i = 0; i < children.length; i++) {
	// 			let nextIndex = children[i] - 1;
	// 			let left = dfs(nextIndex, depth + 1);
	// 			if (left > 0) {
	// 				sumWidth += left - currentWidth;
	// 				countValidChild++;
	// 			}
	// 		}
	// 		sumWidth /= countValidChild;
	// 		nodes[nodeIndex].left = currentWidth + Math.max(sumWidth, widthDepth[depth]);
	// 		currentMaxWidth = Math.max(currentMaxWidth, nodes[nodeIndex].left);
	// 		widthDepth[depth] = nodes[nodeIndex].left + 1 - currentWidth;
	//
	// 		return nodes[nodeIndex].left;
	// 	}
	//
	// 	for (var i = 0; i < rootIndexes.length; i++) {
	// 		dfs(rootIndexes[i], 1);
	// 		currentWidth = currentMaxWidth;
	// 		currentMaxWidth = 0;
	// 		for (var j = 0; j < widthDepth.length; j++) {
	// 			widthDepth[j] = 1;
	// 		}
	// 	}
	//
	// 	for (let i = 0; i < nodes.length; i++) {
	// 		let divState = document.createElement("div");
	// 		let divEp = document.createElement("div");
	// 		divEp.className = 'ep';
	// 		divState.className = "w state";
	// 		divState.id = "node-" + nodes[i].id;
	// 		divState.title = nodes[i].name;
	// 		if (nodes[i].name.length > 20) {
	// 			divState.innerHTML = nodes[i].name.substring(0, 20) + "..." + divEp.outerHTML;
	// 		} else {
	// 			divState.innerHTML = nodes[i].name + divEp.outerHTML;
	// 		}
	//
	// 		divState.style.top = (50 + 150 * (nodes[i].depth)) + 'px';
	// 		divState.style.maxWidth = "150px";
	// 		// divState.style.left = (50 + 300 * ((maxWidth - nodeDepthWidth[nodes[i].depth-1]++) / 2 + currentLayout[nodes[i].depth-1]++)) + 'px';
	// 		divState.style.left = (50 + 300 * (nodes[i].left)) + 'px';
	// 		$("#workflow-1").append(divState);
	// 	}
	//
	//
	// 	var transitionData,
	// 		workflow1;
	// 	// Transition (Connection between States) Data
	// 	transitionData = { transitions: {} };
	// 	for (let i = 0; i < edges.length; i++) {
	// 		let edge = edges[i];
	// 		if (edge.from == 0) {
	// 			continue;
	// 		}
	// 		let fromNodeId = "node-" + nodes[edge.from - 1].id;
	// 		let toNodeId = "node-" + nodes[edge.to - 1].id;
	// 		if (transitionData.transitions[fromNodeId]) {
	// 			transitionData.transitions[fromNodeId] += "," + toNodeId;
	// 		} else {
	// 			transitionData.transitions[fromNodeId] = toNodeId;
	// 		}
	// 	}
	// 	console.log(transitionData);
	// 	// Create a new workflow instance as workflow1
	// 	workflow1 = new jsWorkflow.Instance();
	//
	// 	// Initialize workflow1 with workflow container id
	// 	workflow1.init('workflow-1');
	//
	// 	// Establish transitions among all the workflow States
	// 	workflow1.instance.createStateTrasitions(transitionData);
	// }

	return initializeElements
}))
