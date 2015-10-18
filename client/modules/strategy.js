var _ = require('lodash');
var Maze = require('./maze');
var Action = require('./action');

function Strategy(gamestate, simulator) {
    this.gamestate = gamestate;
    this.simulator = simulator;
}

Strategy.prototype.move = function(callback) {
    var actions = [];

    var turnToEstimate = 5;
    var self = this;
    var me = this.gamestate.players.getMe();
    var sheep = this.gamestate.players.getSheep();

    this.simulator.simulateNTurns(turnToEstimate, function(estimatedGamestate) {

        var route = self.bestRoute(estimatedGamestate);

        if(route) {
            for(var i=0; i<me.pm; i++) {
                var cell = route.cellPath[i];

                // si il y a un joueur, on ne va pas sur la case et on arrete de se deplacer
                if(cell.occupantId !== null && cell.occupantId !== sheep.id) {
                    break;
                }

                var action = new Action();
                action.move(cell.id);

                actions.push(action);
            }
        }

        callback(actions);
    });
};

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

Strategy.prototype.useItem = function(callback) {
    var actions = [];

    var me = this.gamestate.players.getMe();
    var items = me.items;

    callback(actions);
};

Strategy.prototype.getItem = function(callback) {
    var me = this.gamestate.players.getMe();

    var myCell = this.gamestate.getCellById(me.cellId);

    if(myCell.item) {
        var action = new Action();
        action.getItem();
        callback(action);
    }
    else {
        callback(null);
    }

};

module.exports = Strategy;