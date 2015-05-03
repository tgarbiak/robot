"use strict";

const _ = require('lodash');

function distance(p1, p2) {
    return Math.sqrt(
        Math.pow(p2.x - p1.x, 2)
        + Math.pow(p2.y - p1.y, 2)
    );
}

function buildGraph(nodes) {
    let graph = _.fill(
        new Array(nodes.length),
        _.fill(new Array(nodes.length), 0)
    );
    let auxNodes = nodes.slice();
    while (auxNodes.length) {
        let index = auxNodes.length - 1;
        let point = auxNodes.pop();
        for (let i = 0; i < auxNodes.length; i++) {
            if (distance(point, auxNodes[i]) <= point.z + auxNodes[i].z) {
                graph[index][i] = 1;
            }
        }
    }
    return graph;
}

function findNodeForPoint (nodes, point) {
    for (let i = 0; i < nodes.length; i++) {
        if (distance(nodes[i], point) < nodes[i].z) {
            return i;
        }
    }
    return -1;
}

function findIfNodesConnected(graph, node1, node2) {
    // Breadth-first search.
    let visited = [];
    let queue = [node1];
    visited.push(node1);

    while(queue.length) {
        let node = queue.shift();
        if (node === node2) {
            return true;
        }
        _.each(graph[node], function(isAdjacent, otherNode) {
            if (!isAdjacent || -1 !== _.indexOf(visited, otherNode)) {
                return;
            }
            queue.push(otherNode);
            visited.push(otherNode);
        });
    }
    return false;
}

function search(data) {
    let graph = buildGraph(data.emitters);
    let findNode = _.curry(findNodeForPoint)(data.emitters);
    let startNode = findNode(data.startPoint);
    let endNode = findNode(data.endPoint);
    let areNodesConnected = _.curry(findIfNodesConnected)(graph);
    if (-1 === startNode || -1 === endNode) {
        return false;
    }
    return areNodesConnected(startNode, endNode);
}

module.exports = search;