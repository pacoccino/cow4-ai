var _ = require('lodash');
var Maze = require('./maze');
var Action = require('./action');

function Strategy(gamestate) {
    this.gamestate = gamestate;

    this.actualStrategy = 'item';
}

Strategy.prototype.routeToSheep = function(estimatedGamestate) {

    var maze = new Maze(this.gamestate);

    var me = this.gamestate.players.getMe();

    var source = this.gamestate.getCellById(me.cellId);
    maze.computeWeights(source);

    var estimatedSheep = estimatedGamestate.players.getSheep();
    var estimatedSheepCell = estimatedGamestate.getCellById(estimatedSheep.cellId);

    var routes = maze.getShortestRoutes(estimatedSheepCell);

    var bestRoute = routes[0];
    var bestRouteItems = 0;
    for (var i = 0; i < routes.length; i++) {
        var route = routes[i];
        var nbItems = route.items.length;
        if(nbItems > bestRouteItems) {
            bestRoute = route;
        }
    }
    return bestRoute;
};

Strategy.prototype.routeToItem = function(estimatedGamestate) {

    var maze = new Maze(this.gamestate);

    var me = this.gamestate.players.getMe();

    var source = this.gamestate.getCellById(me.cellId);
    maze.computeWeights(source);


    var items = this.gamestate.allItems;
    var routes = [];
    for (var i = 0; i < items.length; i++) {
        var item = items[i];
        if(item.type === 'parfum') {
            var itemCell = this.gamestate.getCellById(item.cell.id);
            routes.push(maze.getShortestRoute(itemCell));
        }
    }

    var shortest = Infinity;
    var route;
    for (var i = 0; i < routes.length; i++) {
        if(routes[i].cellPath.length < shortest) {
            route = routes[i];
            shortest = routes[i].cellPath.length;
        }
    }

    if(!route) {
        return this.routeToSheep(estimatedGamestate);
    }
    else {
        if(route.cellPath.length === 1) {
            this.actualStrategy = 'sheep';
        }
        return route;
    }
};

Strategy.prototype.bestRoute = function(estimatedGamestate) {

    switch(this.actualStrategy) {
        case 'sheep':
            return this.routeToSheep(estimatedGamestate);
        case 'item':
            return this.routeToItem(estimatedGamestate);
    }
};

Strategy.prototype.useItem = function() {
    var actions = [];

    var me = this.gamestate.players.getMe();
    var items = me.items;

    for (var i = 0; i < items.length; i++) {
        var item = items[i];
        if(item.type === 'parfum') {
            var action = new Action();
            action.useItem('parfum');
            console.log('use parfum');
            actions.push(action);
        }
    }

    return actions;
};

Strategy.prototype.getItem = function() {
    var me = this.gamestate.players.getMe();

    var myCell = this.gamestate.getCellById(me.cellId);

    if(myCell.item) {
        var action = new Action();
        action.getItem();

        console.log('get item:', myCell.item.type);
        return action;
    }
    else {
        return null;
    }

};

module.exports = Strategy;