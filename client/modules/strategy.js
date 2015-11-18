var _ = require('lodash');
var Maze = require('./maze');
var Action = require('./action');
var Constants = require('./constants');
var Route = require('./route');

function Strategy(gamestate) {
    this.gamestate = gamestate;

    this.actualStrategy = 'item';

    this.maze = null;
    this.forcedRoute = null;
}

Strategy.prototype.lazyRouteToSheep = function(estimatedGamestate) {

    var estimatedSheep = estimatedGamestate.players.getSheep();
    var estimatedSheepCell = estimatedGamestate.getCellById(estimatedSheep.cellId);

    var routes = this.maze.getShortestRoutes(estimatedSheepCell);

    var bestRoute = null;
    var bestRouteItems = -1;

    for (var j = 0; j < routes.length; j++) {
        var route = routes[j];

        for (var i = 0; i < route.cellPath.length-1; i++) {
            var cell = route.cellPath[i];

            // La route contient l'ennemi
            if(cell.occupantId === this.gamestate.players.getEnnemy().id)
                continue;

            if(route.items.length > bestRouteItems)
                bestRoute = route;
        }
    }

    if(bestRoute) {

        var truncRoute = new Route(bestRoute.source, bestRoute.cellPath[0]);
        truncRoute.addStep(bestRoute.cellPath[0]);
        return truncRoute;
    }
    else {
        return null;
    }
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
        return this.lazyRouteToSheep(estimatedGamestate);
    }
    else {
        if(route.cellPath.length === 1) {
            this.actualStrategy = 'lazySheep';
        }
        return route;
    }
};

Strategy.prototype.tryIfCanCatch = function() {

    if(this.forcedRoute) return;

    var sheep = this.gamestate.players.getSheep();
    var sheepCell = this.gamestate.getCellById(sheep.cellId);
    var routesToSheep = this.maze.getShortestRoutes(sheepCell);

    for (var j = 0; j < routesToSheep.length; j++) {
        var route = routesToSheep[j];

        // La route vers le poulet est trop longue
        if(route.cellPath.length > this.gamestate.players.getMe().pm)
            continue;

        for (var i = 0; i < route.cellPath.length-1; i++) {
            var cell = route.cellPath[i];

            // La route contient l'ennemi
            if(cell.occupantId === this.gamestate.players.getEnnemy().id)
                continue;

            // La route est correcte
            this.forcedRoute = route;
            break;
        }
    }
};

Strategy.prototype.findObjectives = function() {

    if(this.forcedRoute) return;

    var me = this.gamestate.players.getMe();
    var myCell = this.gamestate.getCellById(me);

    if(me.pm < Constants.MAX_PM && Math.random() * 10 < 5) {
        this.forcedRoute = new Route();
    }
};

Strategy.prototype.bestRoute = function(estimatedGamestate) {

    var me = this.gamestate.players.getMe();
    var source = this.gamestate.getCellById(me.cellId);

    this.forcedRoute = null;
    this.maze = new Maze(this.gamestate);
    this.maze.computeWeights(source);

    this.tryIfCanCatch();
    this.findObjectives();


    if(this.forcedRoute) return this.forcedRoute;


    switch(this.actualStrategy) {
        case 'lazySheep':
            return this.lazyRouteToSheep(estimatedGamestate);
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

        // TODO
        if(item.type === 'parfum') {
            var action = new Action();
            action.useItem('parfum');
            console.log('use parfum');
            actions.push(action);
        }
    }

    Action.executeOnGamestate(actions, this.gamestate, me);
    return actions;
};

Strategy.prototype.getItem = function() {
    var me = this.gamestate.players.getMe();

    var myCell = this.gamestate.getCellById(me.cellId);

    if(myCell.item) {
        var action = new Action();
        action.getItem();
        Action.executeOnGamestate(action, this.gamestate, me);

        console.log('get item:', myCell.item);
        return action;
    }
    else {
        return null;
    }

};

module.exports = Strategy;