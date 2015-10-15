var Maze = require('./maze');
var Simulator = require('./simulator');
var Action = require('./action');
var Player = require('./player');
var IApoulet = require('./iapoulet');

var sendDelay = 1;

function IA(gamestate) {
    this.gamestate = gamestate;


    this.iapoulet = new IApoulet(this.gamestate);
}

IA.prototype.getActions = function(callback) {
    if(this.dumb === undefined) {
        this.dumb = (this.gamestate.players.players.indexOf(this.gamestate.players.getMe()) === 1);
    }

    if(this.dumb) {
        this.getDumbActions(callback);
    }
    else {
        this.getCleverActions(callback);
    }
};

IA.prototype.getCleverActions = function(callback) {

    var self = this;
    var simulator = new Simulator(this.gamestate, this.iapoulet);
    var maze = new Maze(this.gamestate);

    var actions = [];
    var me = this.gamestate.players.getMe();
    var ennemy = this.gamestate.players.getEnnemy();
    var sheep = this.gamestate.players.getSheep();

    var source = this.gamestate.getCellById(me.cellId);
    maze.computeWeights(source);

    var turnToEstimate = 5;
    simulator.simulateNTurns(turnToEstimate, function(estimatedGamestate) {
        var estimatedSheep = estimatedGamestate.players.getSheep();
        var estimatedSheepCell = estimatedGamestate.getCellById(estimatedSheep.cellId);
        var destination = estimatedSheepCell;

        var route = maze.getShortestRoute(destination);

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

IA.prototype.getDumbActions = function(callback) {

    var maze = new Maze(this.gamestate);

    var actions = [];

    var me = this.gamestate.players.getMe();
    var sheep = this.gamestate.players.getSheep();

    var source = this.gamestate.getCellById(me.cellId);
    var destination = this.gamestate.getCellById(sheep.cellId);

    maze.computeWeights(source);
    var route = maze.getShortestRoute(destination);

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
};

module.exports = IA;
