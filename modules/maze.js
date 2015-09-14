var _ = require('lodash');

function Maze(map) {

    this.map = map || null;
}

Maze.prototype.shortestPath = function(source, destination) {
};


Maze.prototype.getPath = function(source, destination) {

    var path = [];
    var traverse = function(cell) {
        if(cell === destination) {
            return true;
        }
        else {
            cell.visited = true;
            for (var i = 0; i < cell.adjacents.length; i++) {
                var adjacent = cell.adjacents[i];

                if(!adjacent.visited && traverse(adjacent)) {
                    path.push(adjacent);
                    return true;
                }
            }
            return false;
        }
    };

    if(traverse(source)) {
        path.push(source);
    }
    return path;
};

Maze.prototype.getAllPaths = function(source, destination) {

    var path = [];
    var weights = new Array(map.mapSize.height);
    _.fill(weights, new Array(map.mapSize.width));

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

