var _ = require('lodash');
var Maze = require('./maze');
var Action = require('./action');

function Strategy(gamestate) {
    this.gamestate = gamestate;
}

Strategy.prototype.bestRoute = function(estimatedGamestate) {

    var maze = new Maze(this.gamestate);

    var me = this.gamestate.players.getMe();
    var ennemy = this.gamestate.players.getEnnemy();
    var sheep = this.gamestate.players.getSheep();


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

Strategy.prototype.useItem = function() {
    var actions = [];

    var me = this.gamestate.players.getMe();
    var items = me.items;

    return actions;
};

Strategy.prototype.getItem = function() {
    var me = this.gamestate.players.getMe();

    var myCell = this.gamestate.getCellById(me.cellId);

    if(myCell.item) {
        var action = new Action();
        action.getItem();
        return action;
    }
    else {
        return null;
    }

};

module.exports = Strategy;