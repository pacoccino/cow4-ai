var _ = require('lodash');
var Helpers = require('./helpers');

function Maze(map) {

    this.map = map || null;
}

 Maze.prototype.shortestPath = function(source, destination) {
};


Maze.prototype.getPath = function(source, destination) {

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
    return path;
};

Maze.prototype.getAllPaths = function(source, destination) {

    var path = [];
    var weights = new Array(this.map.mapSize.height);
    _.fill(weights, new Array(this.map.mapSize.width));

    var toVisit = [source];
    var actual;
    var traverse = function(cell) {
        var step = 0;

        var actual = source
        while(toVisit.length > 0) {

            cell.weight = step;
            for (var j = 0; j < cell.adjacents.length; j++) {
                var adjacent = cell.adjacents[j];
                toVisit.push(adjacent);

                toVisit.splice(toVisit.indexOf(cell), 1);
            }
            for (var i = 0; i < toVisit.length; i++) {
                var cell = toVisit[i];

            }
            step++;
        }

    };

    if(traverse(source)) {
        path.push(source);
    }
    return path;
};

module.exports = Maze;

