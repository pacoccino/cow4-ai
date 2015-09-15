var _ = require('lodash');
var Helpers = require('./helpers');

function Maze(map) {

    this.map = map || null;

    this.source = null;
    this.distances = null;
    this.shortPath = null;
}

Maze.prototype.getSerializablePath = function() {
    var serializable = [];

        for (var x=0; x<this.shortPath.length; x++) {
            serializable.push({
                x: this.shortPath[x].x,
                y: this.shortPath[x].y
            });
        }

    return serializable;
};

Maze.prototype.setSource = function(source) {
    this.source = source;
    this.distances = Helpers.CreateMatrix(this.map.mapSize.width, this.map.mapSize.height );
    this.shortPath = null;
};

// Fontionne mais donne un chemin au pif
Maze.prototype.depthFirst = function(destination) {

    var source = this.source;

    if(!source || !destination) return;

    var path = [];
    var visiteds = Helpers.CreateMatrix(this.map.mapSize.width, this.map.mapSize.height);

    var traverse = function(cell) {
        if(cell === destination) {
            return true;
        }
        else {
            visiteds[cell.y][cell.x] = true;
            for (var i = 0; i < cell.adjacents.length; i++) {
                var adjacent = cell.adjacents[i];

                if(!visiteds[adjacent.y][adjacent.x] && traverse(adjacent)) {
                    path.push({
                        x: adjacent.x,
                        y: adjacent.y
                    });
                    return true;
                }
            }
            return false;
        }
    };

    if(traverse(source)) {
        path.push({
            x: source.x,
            y: source.y
        });
    }

    path.reverse();
    return path;
};

// Rempli la matrice des poids
Maze.prototype.breadthFirst = function(destination) {

    var source = this.source;

    if(!source) return;

    var getNewNode = function() {
        var node = {};
        node.distance = Infinity;
        node.parent = null;
        node.cell = null;
        return node;
    };

    var crawlPath = function(endNode) {
        var path = [];

        var node = endNode;
        path.push(node.cell);

        while(node.parent) {
            node = node.parent;
            path.push(node.cell);
        }

        path.reverse();

        return path;
    };

    var nodes = Helpers.CreateMatrix(this.map.mapSize.width, this.map.mapSize.height, getNewNode );

    var queue = [];

    nodes[source.y][source.x].cell = source;
    nodes[source.y][source.x].distance = 0;
    this.distances[source.y][source.x] = 0;

    queue.push(source);

    wqueue:
    while(queue.length > 0) {
        var cell = queue.shift();
        var cellNode = nodes[cell.y][cell.x];

        for (var j = 0; j < cell.adjacents.length; j++) {

            var adjacent = cell.adjacents[j];
            var node = nodes[adjacent.y][adjacent.x];

            if(node.distance === Infinity) {
                node.parent = cellNode;
                node.cell = adjacent;
                node.distance = cellNode.distance + 1;

                this.distances[adjacent.y][adjacent.x] = node.distance;

                if(destination && adjacent === destination) {

                    this.shortPath = crawlPath(node);
                    break wqueue;
                }
                //node.parent = cellNode;
                queue.push(adjacent);
            }
        }
    }
};


// not working
Maze.prototype.getAllPaths = function(source, destination) {

    var nodes = this.breadthFirst(source);
    var paths = [];

    var queue = [];

    queue.push(destination);

    while(queue.length > 0) {
        var cell = queue.shift();
        var cellNode = nodes[cell.y][cell.x];

        for (var j = 0; j < cell.adjacents.length; j++) {
            var adjacent = cell.adjacents[j];
            var node = nodes[adjacent.y][adjacent.x];
            if(node.distance === Infinity) {
                node.distance = cellNode.distance + 1;
                node.parent = cellNode;
                queue.push(adjacent);
            }
        }
    }

    return nodes;
};

module.exports = Maze;

