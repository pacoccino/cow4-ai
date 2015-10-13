var _ = require('lodash');
var Helpers = require('./helpers');;
var Route = require('./route');

function Maze(gamestate) {

    this.gamestate = gamestate || null;

    this.source = null;
    this.nodes = null;
    this.distances = null;
    this.shortPath = null;
}


// Fontionne mais donne un chemin au pif
Maze.prototype.depthFirst = function(source, destination) {

    if(!source || !destination) return;

    var self = this;
    var path = [];
    var visiteds = Helpers.CreateMatrix(this.gamestate.mapSize.width, this.gamestate.mapSize.height);

    var traverse = function(cell) {
        if(cell === destination) {
            return true;
        }
        else {
            visiteds[cell.y][cell.x] = true;
            for (var i = 0; i < cell.adjacentsIds.length; i++) {
                var adjacentId = cell.adjacentsIds[i];
                var adjacent = self.gamestate.getCellById(adjacentId);

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
    path.splice(0,1);

    return path;
};

// Rempli la matrice des poids
Maze.prototype.breadthFirst = function(source, destination) {

    if(!source || !destination) return;
    var self = this;

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

    var nodes = Helpers.CreateMatrix(this.gamestate.mapSize.width, this.gamestate.mapSize.height, getNewNode );
    this.distances = Helpers.CreateMatrix(this.gamestate.mapSize.width, this.gamestate.mapSize.height );

    var queue = [];

    nodes[source.y][source.x].cell = source;
    nodes[source.y][source.x].distance = 0;
    this.distances[source.y][source.x] = 0;

    queue.push(source);

    wqueue:
        while(queue.length > 0) {
            var cell = queue.shift();
            var cellNode = nodes[cell.y][cell.x];

            for (var j = 0; j < cell.adjacentsIds.length; j++) {

                var adjacentId = cell.adjacentsIds[j];
                var adjacent = self.gamestate.getCellById(adjacentId);
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


// Rempli la matrice des poids
Maze.prototype.computeWeights = function(source) {

    if(!source) return;
    var self = this;

    this.source = source;

    var getNewNode = function() {
        var node = {};
        node.distance = Infinity;
        node.parent = null;
        node.cell = null;
        return node;
    };

    this.nodes = Helpers.CreateMatrix(this.gamestate.mapSize.width, this.gamestate.mapSize.height, getNewNode );
    this.distances = Helpers.CreateMatrix(this.gamestate.mapSize.width, this.gamestate.mapSize.height );

    var queue = [];

    this.nodes[source.y][source.x].cell = source;
    this.nodes[source.y][source.x].distance = 0;

    queue.push(source);

    wqueue:
        while(queue.length > 0) {
            var cell = queue.shift();
            var cellNode = this.nodes[cell.y][cell.x];

            for (var j = 0; j < cell.adjacentsIds.length; j++) {

                var adjacentId = cell.adjacentsIds[j];
                var adjacent = self.gamestate.getCellById(adjacentId);

                var node = this.nodes[adjacent.y][adjacent.x];

                if(node.distance === Infinity) {
                    node.parent = cellNode;
                    node.cell = adjacent;
                    node.distance = cellNode.distance + 1;
                    this.distances[node.cell.y][node.cell.x] = node.distance;

                    queue.push(adjacent);
                }
            }
        }

};

Maze.prototype.getShortestRoute = function(destination) {
    if(!this.source || !this.nodes) {
        console.error("You must set source and compute weights before looking for a path");
        return;
    }

    var endNode = this.nodes[destination.y][destination.x];

    var route = new Route(this.source, destination);

    var node = endNode;

    while(node.parent) {
        route.addStep(node.cell);
        node = node.parent;
    }

    route.reverse();

    return route;
};

// Trouve toutes les routes les plus courtes.
Maze.prototype.getShortestRoutes = function(destination) {

    if(!this.source || !this.nodes) {
        console.error("You must set source and compute weights before looking for a path");
        return;
    }
    var routes = [];

    var self = this;

    var continuePathFrom = function(cell, currentRoute) {
        if(cell === self.source) {
            currentRoute.reverse();
            return;
        }

        currentRoute.addStep(cell);

        var cellNode = self.nodes[cell.y][cell.x];

        var crawlableAdjacents = [];

        for (var j = 0; j < cell.adjacentsIds.length; j++) {

            var adjacentId = cell.adjacentsIds[j];
            var adjacent = self.gamestate.getCellById(adjacentId);

            var adjacentNode = self.nodes[adjacent.y][adjacent.x];

            if(adjacentNode.distance <= cellNode.distance) {
                crawlableAdjacents.push(adjacent);
            }
        }

        if(crawlableAdjacents.length > 0) {

            if(crawlableAdjacents.length > 1) {

                for (var i = 1; i < crawlableAdjacents.length; i++) {

                    var newPath = currentRoute.clone();
                    routes.push(newPath);

                    continuePathFrom(crawlableAdjacents[i], newPath);
                }
            }

            continuePathFrom(crawlableAdjacents[0], currentRoute);
        }
        else {
            // N'est pas censé arriver (sinon adjacentNode.distance > cellNode.distance)
            console.log("crawlableAdjacents.length === 0");
            routes.splice(routes.indexOf(currentRoute), 1);
        }
    };

    var firstRoute = new Route(this.source, destination);
    routes.push(firstRoute);

    continuePathFrom(destination, firstRoute);

    routes.sort(function(a,b) {
        return a.length > b.length;
    });

    return routes;
};

// Trouve toutes les routes. Obligé d'imposer une limite sinon ca peut durer tres longtemps
Maze.prototype.getAllRoutes = function(destination, lengthLimit, pathsLimit) {

    if(!this.source) {
        console.error("You must set source before looking for a path");
        return;
    }
    var routes = [];

    var self = this;

    var maxPaths = pathsLimit || 500;
    var maxLength = lengthLimit || 100; // la longueur limite doit etre proche du chemin le plus court + ~15

    var continuePathFrom = function(cell, currentRoute) {
        if(currentRoute.length > maxLength) {
            routes.splice(routes.indexOf(currentRoute), 1);
            return;
        }
        if(cell === self.source) {
            currentRoute.reverse();
            return;
        }

        currentRoute.addStep(cell);

        var crawlableAdjacents = [];

        for (var j = 0; j < cell.adjacentsIds.length; j++) {

            var adjacentId = cell.adjacentsIds[j];
            var adjacent = self.gamestate.getCellById(adjacentId);

            var alreadyVisited = currentRoute.cellPath.indexOf(adjacent);
            if(alreadyVisited === -1) {
                crawlableAdjacents.push(adjacent);
            }
        }

        if(crawlableAdjacents.length > 0) {

            var distanceFromOrigin = function(cell) {
                return Math.sqrt(Math.pow(cell.x - self.source.x, 2) + Math.pow(cell.y - self.source.y, 2));
            };

            // Fonction heuristique en fonction de la distance avec l'origine
            crawlableAdjacents.sort(function(a,b) {
                return distanceFromOrigin(a) - distanceFromOrigin(b);
            });

            if(crawlableAdjacents.length > 1 && routes.length < maxPaths) {

                for (var i = 0; i < crawlableAdjacents.length-1; i++) {

                    var newPath = currentRoute.clone();
                    routes.push(newPath);

                    continuePathFrom(crawlableAdjacents[i], newPath);
                }
            }

            continuePathFrom(crawlableAdjacents[crawlableAdjacents.length-1], currentRoute);
        }
        else {
            routes.splice(routes.indexOf(currentRoute), 1);
        }
    };

    var firstRoute = new Route(this.source, destination);
    routes.push(firstRoute);

    continuePathFrom(destination, firstRoute);

    routes.sort(function(a,b) {
        return a.length - b.length;
    });

    return routes;
};

module.exports = Maze;

